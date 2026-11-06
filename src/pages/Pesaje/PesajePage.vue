<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <div class="row items-center q-gutter-sm">
        <div class="text-h6">Pesajes</div>
        <q-space />
        <q-input v-model="filtro" dense outlined placeholder="Buscar" debounce="300" style="width: 220px">
          <template #append>
            <q-icon v-if="filtro === ''" name="search" />
            <q-icon v-else name="close" class="cursor-pointer" @click="filtro = ''" />
          </template>
        </q-input>
        <q-btn round unelevated color="primary" icon="add" @click="abrirAlta">
          <q-tooltip>Nuevo pesaje</q-tooltip>
        </q-btn>
        <q-btn flat round icon="refresh" :loading="pesajeStore.loading" @click="recargar">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>
      </div>

      <q-card-section>
        <q-table
          :rows="pesajeStore.pesajes"
          :columns="columns"
          row-key="id"
          :filter="filtro"
          :loading="pesajeStore.loading"
          :rows-per-page-options="[10, 20, 50, 0]"
          no-data-label="No hay pesajees para mostrar"
          loading-label="Cargando pesajees..."
        >
          <template #body-cell-acciones="props">
            <q-td class="text-right">
              <q-btn dense flat color="primary" icon="edit" @click="abrirEdicion(props.row.id)">
                <q-tooltip>Editar</q-tooltip>
              </q-btn>
              <q-btn dense flat color="negative" icon="delete" @click="confirmarBaja(props.row.id)">
                <q-tooltip>Eliminar</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card-section>

      <q-banner v-if="pesajeStore.error" class="bg-negative text-white" rounded>
        {{ pesajeStore.error }}
      </q-banner>
    </q-card>

    <q-dialog v-model="mostrarFormulario">
      <PesajeCreate :edit-id="editId" @close="cerrarFormulario" />
    </q-dialog>

    <q-dialog v-model="confirmandoBaja">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" size="sm" class="q-mr-sm" />
          <span class="text-h6">Confirmar</span>
        </q-card-section>
        <q-card-section>Se va a eliminar el pesaje. Esta acción no se puede deshacer.</q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Cancelar" v-close-popup />
          <q-btn flat label="Eliminar" color="negative" @click="eliminar" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { QTableColumn } from 'quasar';
import { usePesajeStore } from 'stores/pesaje';
import type { PesajeResponseDto } from 'src/models/Pesaje/PesajeResponseDto';
import PesajeCreate from 'src/components/Pesaje/PesajeCreate.vue';
import { notificarError } from 'src/utils/notificar';

const pesajeStore = usePesajeStore();

const filtro = ref('');
const mostrarFormulario = ref(false);
const editId = ref<number | null>(null);
const confirmandoBaja = ref(false);
const idABorrar = ref<number | null>(null);

const columns: QTableColumn<PesajeResponseDto>[] = [
  { name: 'id', label: 'Id', field: 'id', align: 'left', sortable: true },

  { name: 'pesoNeto', label: 'Peso Neto', field: 'pesoNeto', align: 'left', sortable: true },

  {
    name: 'tipoPesaje',
    label: 'Tipo de Pesaje',
    field: 'tipoPesaje',
    align: 'left',
    sortable: true,
    format: (val: number) => (val === 0 ? 'Entrada' : 'Salida'),

  },  { name: 'fechaHora', label: 'Fecha y Hora', field: 'fechaHora', align: 'left', sortable: true },

  {name: 'observaciones', label: 'Observaciones', field: 'observaciones', align: 'left', sortable: true },
  
  {name: 'loteId', label: 'Lote Id', field: 'loteId', align: 'left', sortable: true },
 
  { name: 'acciones', label: 'Acciones', field: 'id', align: 'right', sortable: false },
];

function recargar() {
  void pesajeStore.fetchAll();
}

function abrirAlta() {
  editId.value = null;
  mostrarFormulario.value = true;
}

function abrirEdicion(id: number) {
  editId.value = id;
  mostrarFormulario.value = true;
}

function cerrarFormulario() {
  mostrarFormulario.value = false;
  recargar();
}

function confirmarBaja(id: number) {
  idABorrar.value = id;
  confirmandoBaja.value = true;
}

async function eliminar() {
  try {
    if (idABorrar.value !== null) {
      await pesajeStore.borrar(idABorrar.value);
    }
  } catch {
    notificarError('No se pudo eliminar el pesaje');
  } finally {
    confirmandoBaja.value = false;
    recargar();
  }
}

onMounted(() => {
  recargar();
});
</script>