<template>
  <q-card style="min-width: 440px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar lote' : 'Nuevo lote' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-input v-model="form.codigo" label="Código" outlined class="q-mb-sm" lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresá el código']" />
        <q-input v-model.number="form.cantidadCabezas" label="Cantidad de cabezas" type="number" outlined
          class="q-mb-sm" lazy-rules
          :rules="[(v: number) => (Number.isInteger(v) && v > 0) || 'Ingresá un número entero mayor a 0']" />
        <q-select v-model="form.especie" :options="especies" label="Especie" outlined class="q-mb-sm"
          :rules="[(v: string) => !!v || 'Elegí la especie']" />
        <q-select v-model="form.categoria" :options="categorias" label="Categoría" outlined class="q-mb-sm"
          :rules="[(v: string) => !!v || 'Elegí la categoría']" />
        <q-select v-model="form.estado" :options="estados" label="Estado" outlined class="q-mb-sm"
          :rules="[(v: string) => !!v || 'Elegí el estado']" />
        <q-input v-model="form.fechaHoraIngreso" label="Fecha y hora de ingreso" type="datetime-local" outlined
          stack-label class="q-mb-sm" lazy-rules
          :rules="[(v: string) => !!v || 'Ingresá la fecha de ingreso']" />
        <q-input v-model="form.fechaHoraEgreso" label="Fecha y hora de egreso" type="datetime-local" outlined
          stack-label class="q-mb-sm" lazy-rules
          :rules="[
            (v: string) => !!v || 'Ingresá la fecha de egreso',
            (v: string) => !form.fechaHoraIngreso || v >= form.fechaHoraIngreso || 'No puede ser anterior al ingreso',
          ]" />
        <q-select v-model="form.clienteId" :options="clienteOptions" label="Cliente" outlined emit-value
          map-options :rules="[(v: number) => !!v || 'Elegí el cliente']" />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="$emit('close')" />
      <q-btn :label="editId ? 'Guardar' : 'Crear'" color="primary" :loading="loteStore.loading" @click="onSubmit" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { QForm } from 'quasar';
import { useLotesStore } from 'stores/lotes';
import { useClienteStore } from 'stores/cliente';
import type { LoteRequestDto } from 'src/models/Lote/LoteRequestDto';
import { notificarError } from 'src/utils/notificar';

const especies: string[] = ['Bovino', 'Ovino', 'Porcino', 'Equino'];
const estados: string[] = ['EnEspera', 'EnCorral', 'Pesado', 'Retirado'];
const categorias: string[] = ['Ternero', 'Novillo', 'Vaquillona', 'Vaca', 'Toro'];
const props = defineProps<{ editId: number | null }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const loteStore = useLotesStore();
const clienteStore = useClienteStore();
const formRef = ref<QForm | null>(null);

const form = ref<LoteRequestDto>({
  codigo: '',
  cantidadCabezas: 0,
  especie: '',
  categoria: '',
  estado: '',
  fechaHoraIngreso: '',
  fechaHoraEgreso: '',
  clienteId: 0,
});

const clienteOptions = computed(() =>
  clienteStore.clientes.map((c) => ({ label: c.razonSocial, value: c.id })),
);

const aInput = (v: string) => v.slice(0, 16);
const aApi = (v: string) => (v.length === 16 ? `${v}:00` : v);

onMounted(async () => {
  await clienteStore.fetchAll();
  if (props.editId) {
    const l = await loteStore.fetchById(props.editId);
    if (l) {
      form.value = {
        codigo: l.codigo,
        cantidadCabezas: l.cantidadCabezas,
        especie: l.especie,
        categoria: l.categoria,
        estado: l.estado,
        fechaHoraIngreso: aInput(l.fechaHoraIngreso),
        fechaHoraEgreso: aInput(l.fechaHoraEgreso),
        clienteId: l.clienteId,
      };
    }
  }
});

async function onSubmit() {
  const valido = await formRef.value?.validate();
  if (!valido) {
    return;
  }
  const dto: LoteRequestDto = {
    ...form.value,
    fechaHoraIngreso: aApi(form.value.fechaHoraIngreso),
    fechaHoraEgreso: aApi(form.value.fechaHoraEgreso),
  };
  try {
    if (props.editId) {
      await loteStore.update(props.editId, dto);
    } else {
      await loteStore.create(dto);
    }
    emit('close');
  } catch {
    notificarError('No se pudo guardar el lote');
  }
}
</script>