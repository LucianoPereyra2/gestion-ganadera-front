<template>
  <q-card style="min-width: 420px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar sector' : 'Nuevo sector' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-input
          v-model="form.nombre"
          label="Nombre"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresá el nombre']"
        />
        <q-input
          v-model="form.descripcion"
          label="Descripción"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresá la descripción']"
        />
        <q-input
          v-model.number="form.capacidadMaxima"
          label="Capacidad máxima"
          type="number"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: number) => (Number.isInteger(v) && v > 0) || 'Ingresá un número entero mayor a 0']"
        />
        <q-toggle v-model="form.disponible" label="Disponible" />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="$emit('close')" />
      <q-btn
        :label="editId ? 'Guardar' : 'Crear'"
        color="primary"
        :loading="sectorStore.loading"
        @click="onSubmit"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QForm } from 'quasar';
import { useSectorStore } from 'stores/sector';
import type { SectorRequestDto } from 'src/models/Sector/SectorRequestDto';
import { notificarError } from 'src/utils/notificar';

const props = defineProps<{ editId: number | null }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const sectorStore = useSectorStore();
const formRef = ref<QForm | null>(null);

const form = ref<SectorRequestDto>({
  nombre: '',
  descripcion: '',
  capacidadMaxima: 0,
  disponible: true,
});

onMounted(async () => {
  if (props.editId) {
    const sector = await sectorStore.fetchById(props.editId);
    if (sector) {
      form.value = {
        nombre: sector.nombre,
        descripcion: sector.descripcion,
        capacidadMaxima: sector.capacidadMaxima,
        disponible: sector.disponible,
      };
    }
  }
});

async function onSubmit() {
  const valido = await formRef.value?.validate();
  if (!valido) {
    return;
  }
  try {
    if (props.editId) {
      await sectorStore.update(props.editId, form.value);
    } else {
      await sectorStore.create(form.value);
    }
    emit('close');
  } catch {
    notificarError('No se pudo guardar el sector');
  }
}
</script>