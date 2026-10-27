<template>
  <q-card style="min-width: 420px">
    <q-card-section>
      <div class="text-h6">{{ editId ? 'Editar cliente' : 'Nuevo cliente' }}</div>
    </q-card-section>
    <q-separator />

    <q-card-section>
      <q-form ref="formRef" greedy @submit.prevent="onSubmit">
        <q-input v-model="form.razonSocial" label="Razón social" outlined class="q-mb-sm" lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresá la razón social']" />
        <q-input v-model="form.cuit" label="CUIT" outlined class="q-mb-sm" lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresá el CUIT']" />
        <q-input v-model="form.telefono" label="Teléfono" outlined class="q-mb-sm" lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresá el teléfono']" />
        <q-input v-model="form.email" label="Email" type="email" outlined class="q-mb-sm" lazy-rules
          :rules="[
            (v: string) => (!!v && v.trim().length > 0) || 'Ingresá el email',
            (v: string) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v) || 'Ingresá un email válido',
          ]" />
        <q-input v-model="form.direccion" label="Dirección" outlined class="q-mb-sm" lazy-rules
          :rules="[(v: string) => (!!v && v.trim().length > 0) || 'Ingresá la dirección']" />
        <q-toggle v-model="form.activo" label="Activo" />
      </q-form>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn label="Cancelar" flat @click="$emit('close')" />
      <q-btn :label="editId ? 'Guardar' : 'Crear'" color="primary" :loading="clienteStore.loading" @click="onSubmit" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QForm } from 'quasar';
import { useClienteStore } from 'stores/cliente';
import type { ClienteRequestDto } from 'src/models/Cliente/ClienteRequestDto';
import { notificarError } from 'src/utils/notificar';

const props = defineProps<{ editId: number | null }>();
const emit = defineEmits<{ (e: 'close'): void }>();

const clienteStore = useClienteStore();
const formRef = ref<QForm | null>(null);

const form = ref<ClienteRequestDto>({
  razonSocial: '',
  cuit: '',
  telefono: '',
  email: '',
  direccion: '',
  activo: true,
});

onMounted(async () => {
  if (props.editId) {
    const c = await clienteStore.fetchById(props.editId);
    if (c) {
      form.value = {
        razonSocial: c.razonSocial,
        cuit: c.cuit,
        telefono: c.telefono,
        email: c.email,
        direccion: c.direccion,
        activo: c.activo,
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
      await clienteStore.update(props.editId, form.value);
    } else {
      await clienteStore.create(form.value);
    }
    emit('close');
  } catch {
    notificarError('No se pudo guardar el cliente');
  }
}
</script>