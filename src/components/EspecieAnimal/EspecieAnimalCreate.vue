<template>
  <q-card style="min-width: 420px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar especie' : 'Nueva especie' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-input
          v-model="form.nombre"
          label="Nombre"
          outlined
          lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresá el nombre']"
        />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="$emit('close')" />
      <q-btn
        :label="editId ? 'Guardar' : 'Crear'"
        color="primary"
        :loading="especieStore.loading"
        @click="onSubmit"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QForm } from 'quasar';
import { useEspecieAnimalStore } from 'stores/especieAnimal';
import type { EspecieAnimalRequestDto } from 'src/models/EspecieAnimal/EspecieAnimalRequestDto';
import { notificarError } from 'src/utils/notificar';
const props = defineProps<{ editId: number | null }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const especieStore = useEspecieAnimalStore();
const formRef = ref<QForm | null>(null);

const form = ref<EspecieAnimalRequestDto>({ nombre: '' });

onMounted(async () => {
  if (props.editId) {
    const especie = await especieStore.fetchById(props.editId);
    if (especie) {
      form.value = { nombre: especie.nombre };
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
      await especieStore.update(props.editId, form.value);
    } else {
      await especieStore.create(form.value);
    }
    emit('close');
    } catch {
    notificarError('No se pudo guardar la especie');
  }
}
</script>