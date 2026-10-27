<template>
  <q-card style="min-width: 420px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar empleado' : 'Nuevo empleado' }}</div>
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
          v-model="form.apellido"
          label="Apellido"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresá el apellido']"
        />
        <q-input
          v-model="form.cargo"
          label="Cargo"
          outlined
          class="q-mb-sm"
          lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresá el cargo']"
        />
        <q-toggle v-model="form.activo" label="Activo" />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="$emit('close')" />
      <q-btn
        :label="editId ? 'Guardar' : 'Crear'"
        color="primary"
        :loading="empleadoStore.loading"
        @click="onSubmit"
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QForm } from 'quasar';
import { useEmpleadoStore } from 'stores/empleados';
import type { EmpleadoRequestDto } from 'src/models/Empleado/EmpleadoRequestDto';
import { notificarError } from 'src/utils/notificar';

// editId null = alta; con número = modificación
const props = defineProps<{ editId: number | null }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const empleadoStore = useEmpleadoStore();
const formRef = ref<QForm | null>(null);

// El formulario completa el mismo DTO que viaja a la API
const form = ref<EmpleadoRequestDto>({
  nombre: '',
  apellido: '',
  cargo: '',
  activo: true,
});

// Si es modificación, se traen los datos actuales del empleado
onMounted(async () => {
  if (props.editId) {
    const empleado = await empleadoStore.fetchById(props.editId);
    if (empleado) {
      form.value = {
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        cargo: empleado.cargo,
        activo: empleado.activo,
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
      await empleadoStore.update(props.editId, form.value);
    } else {
      await empleadoStore.create(form.value);
    }
    emit('close');
  } catch {
    notificarError('No se pudo guardar el empleado');
  }
}
</script>