<template>
  <q-card style="min-width: 440px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar pesaje' : 'Nuevo pesaje' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-input v-model.number="form.pesoNeto" label="Peso neto (kg)" type="number" outlined class="q-mb-sm" lazy-rules
          :rules="[(v: number) => (v !== null && v !== undefined && v > 0) || 'Ingresá un peso mayor a 0']" />


          <q-select v-model="form.tipoPesaje" :options="tipoOptions" label="Ingrese tipo de pesaje" outlined emit-value
          map-options class="q-mb-sm"/>
          

        <q-input v-model="form.fechaHora" label="Fecha y hora" type="datetime-local" outlined stack-label class="q-mb-sm" lazy-rules
          :rules="[(v: string) => !!v || 'Ingresá la fecha y hora']" />

        <q-input v-model="form.observaciones" label="Observaciones" outlined class="q-mb-sm" />

        <q-select v-model="form.loteId" :options="loteOptions" label="Lote" outlined emit-value
          map-options :rules="[(v: number) => !!v || 'Elegí el lote']" />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="$emit('close')" />
      <q-btn :label="editId ? 'Guardar' : 'Crear'" color="primary" :loading="pesajeStore.loading" @click="onSubmit" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QForm } from 'quasar';
import { usePesajeStore } from 'stores/pesaje';
import { useLotesStore } from 'stores/lotes';
import type { PesajeRequestDto } from 'src/models/Pesaje/PesajeRequestDto';
import { notificarError } from 'src/utils/notificar';

const props = defineProps<{ editId: number | null }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const pesajeStore = usePesajeStore();
const loteStore = useLotesStore();
const formRef = ref<QForm | null>(null);


const form = ref<PesajeRequestDto>({
  pesoNeto: 0,
   tipoPesaje: 0,
  fechaHora: '',
  observaciones: '',
  loteId: 0,
});

const loteOptions = computed(() =>
  loteStore.lotesList.map((l) => ({ label: l.nombre, value: l.id })),
);

const tipoOptions = computed(() =>
  pesajeStore.tiposList.map((t) => ({ label: t.nombre, value: t.id })),
);

const aInput = (v: string) => (v ? v.slice(0, 16) : '');
const aApi = (v: string) => (v && v.length === 16 ? `${v}:00` : v);

onMounted(async () => {
  await pesajeStore.fetchTipoPesajeSelectList();
  await loteStore.fetchSelectList();
  if (props.editId) {
    const p = await pesajeStore.fetchById(props.editId);
    if (p) {
      form.value = {
        pesoNeto: p.pesoNeto,
        tipoPesaje: p.tipoPesaje,
        fechaHora: aInput(p.fechaHora ?? ''),
        observaciones: p.observaciones ?? '',
        loteId: p.loteId,
      };
    }
  }
});

async function onSubmit() {
  const valido = await formRef.value?.validate();
  if (!valido) {
    return;
  }
  const dto: PesajeRequestDto = {
    ...form.value,
    fechaHora: aApi(form.value.fechaHora),
  };
  try {
    if (props.editId) {
      await pesajeStore.update(props.editId, dto);
    } else {
      await pesajeStore.create(dto);
    }
    emit('close');
  } catch {
    notificarError('No se pudo guardar el pesaje');
  }
}
</script>