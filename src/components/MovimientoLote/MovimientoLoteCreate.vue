<template>
  <q-card style="min-width: 440px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar movimiento de lote' : 'Nuevo movimiento de lote' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-select v-model="form.estadoAnterior" :options="estadoOptions" label="Estado anterior" outlined emit-value
          map-options class="q-mb-sm" />
        <q-select v-model="form.estadoNuevo" :options="estadoOptions" label="Estado nuevo" outlined emit-value
          map-options class="q-mb-sm" />
        <q-input v-model="form.fechaHora" label="Fecha y hora" type="datetime-local" outlined stack-label class="q-mb-sm" lazy-rules
          :rules="[(v: string) => !!v || 'Ingresá la fecha y hora']" />
        <q-input v-model="form.observaciones" label="Observaciones" outlined class="q-mb-sm" />
        <q-input v-model="form.personaResponsable" label="Persona responsable" outlined class="q-mb-sm" lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresá la persona responsable']" />
        <q-select v-model="form.loteId" :options="loteOptions" label="Lote" outlined emit-value
          map-options :rules="[(v: number) => !!v || 'Elegí el lote']" />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="$emit('close')" />
      <q-btn :label="editId ? 'Guardar' : 'Crear'" color="primary" :loading="movimientoLoteStore.loading" @click="onSubmit" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QForm } from 'quasar';
import { useMovimientoLoteStore } from 'stores/movimientoLote';
import { useLotesStore } from 'stores/lotes';
import type { MovimientoLoteRequestDto } from 'src/models/MovimientoLote/MovimientoLoteRequestDto';
import { notificarError } from 'src/utils/notificar';



const props = defineProps<{ editId: number | null }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const movimientoLoteStore = useMovimientoLoteStore();
const loteStore = useLotesStore();
const formRef = ref<QForm | null>(null);

const form = ref<MovimientoLoteRequestDto>({
  estadoAnterior: 0,
  estadoNuevo: 0,
  fechaHora: '',
  observaciones: '',
  personaResponsable: '',
  loteId: 0,
});

const loteOptions = computed(() =>
  loteStore.lotesList.map((l) => ({ label: l.nombre, value: l.id })),
);

const estadoOptions = computed(() =>
  loteStore.estadosList.map((e) => ({ label: e.nombre, value: e.id })),
);

const aInput = (v: string) => (v ? v.slice(0, 16) : '');
const aApi = (v: string) => (v && v.length === 16 ? `${v}:00` : v);

onMounted(async () => {
  await loteStore.fetchSelectList();
  if (props.editId) {
    const m = await movimientoLoteStore.fetchById(props.editId);
    if (m) {
      const lote = loteStore.lotesList.find((l) => l.nombre === m.codigoLote);
      form.value = {
        estadoAnterior: m.estadoAnterior,
        estadoNuevo: m.estadoNuevo,
        fechaHora: aInput(m.fechaHora),
        observaciones: m.observaciones ?? '',
        personaResponsable: m.personaResponsable,
        loteId: lote ? lote.id : 0,
      };
    }
  }
});
async function onSubmit() {
  const valido = await formRef.value?.validate();
  if (!valido) {
    return;
  }
  const dto: MovimientoLoteRequestDto = {
    ...form.value,
    fechaHora: aApi(form.value.fechaHora),
  };
  try {
    if (props.editId) {
      await movimientoLoteStore.update(props.editId, dto);
    } else {
      await movimientoLoteStore.create(dto);
    }
    emit('close');
  } catch {
    notificarError('No se pudo guardar el movimiento de lote');
  }
}
</script>