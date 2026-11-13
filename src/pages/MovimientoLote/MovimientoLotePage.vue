<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <div class="row items-center q-gutter-sm">
        <div class="text-h6">Movimientos de lote</div>
        <q-space />
        <q-input v-model="filtro" dense outlined placeholder="Buscar" debounce="300" style="width: 220px">
          <template #append>
            <q-icon v-if="filtro === ''" name="search" />
            <q-icon v-else name="close" class="cursor-pointer" @click="filtro = ''" />
          </template>
        </q-input>
        <q-btn round unelevated color="primary" icon="add" @click="abrirAlta">
          <q-tooltip>Nuevo movimiento</q-tooltip>
        </q-btn>
        <q-btn flat round icon="refresh" :loading="movimientoLoteStore.loading" @click="recargar">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>
      </div>

      <q-card-section>
        <q-table
          :rows="movimientoLoteStore.movimientoLotes"
          :columns="columns"
          row-key="id"
          :filter="filtro"
          :loading="movimientoLoteStore.loading"
          :rows-per-page-options="[10, 20, 50, 0]"
          no-data-label="No hay movimientos de lote para mostrar"
          loading-label="Cargando movimientos de lote..."
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

      <q-banner v-if="movimientoLoteStore.error" class="bg-negative text-white" rounded>
        {{ movimientoLoteStore.error }}
      </q-banner>
    </q-card>

    <q-dialog v-model="mostrarFormulario">
      <MovimientoLoteCreate :edit-id="editId" @close="cerrarFormulario" />
    </q-dialog>

    <q-dialog v-model="confirmandoBaja">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" size="sm" class="q-mr-sm" />
          <span class="text-h6">Confirmar</span>
        </q-card-section>
        <q-card-section>Se va a eliminar el movimiento de lote. Esta acción no se puede deshacer.</q-card-section>
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
import { useMovimientoLoteStore } from 'stores/movimientoLote';
import { useLotesStore } from 'stores/lotes';
import type { MovimientoLoteResponseDto } from 'src/models/MovimientoLote/MovimientoLoteResponseDto';
import MovimientoLoteCreate from 'src/components/MovimientoLote/MovimientoLoteCreate.vue';
import { notificarError } from 'src/utils/notificar';

const movimientoLoteStore = useMovimientoLoteStore();
const loteStore = useLotesStore();

const filtro = ref('');
const mostrarFormulario = ref(false);
const editId = ref<number | null>(null);
const confirmandoBaja = ref(false);
const idABorrar = ref<number | null>(null);

const columns: QTableColumn<MovimientoLoteResponseDto>[] = [
  { name: 'id', label: 'Id', field: 'id', align: 'left', sortable: true },
  {
    name: 'estadoAnterior',
    label: 'Estado anterior',
    field: 'estadoAnterior',
    align: 'left',
    sortable: true,
    format: (val: number) => loteStore.estadosList.find((e) => e.id === val)?.nombre ?? String(val),  },
  {
    name: 'estadoNuevo',
    label: 'Estado nuevo',
    field: 'estadoNuevo',
    align: 'left',
    sortable: true,
    format: (val: number) => loteStore.estadosList.find((e) => e.id === val)?.nombre ?? String(val),
  },
  { name: 'fechaHora', label: 'Fecha y hora', field: 'fechaHora', align: 'left', sortable: true },
  { name: 'observaciones', label: 'Observaciones', field: 'observaciones', align: 'left', sortable: true },
  { name: 'personaResponsable', label: 'Persona responsable', field: 'personaResponsable', align: 'left', sortable: true },
  { name: 'codigoLote', label: 'Lote', field: 'codigoLote', align: 'left', sortable: true },  { name: 'acciones', label: 'Acciones', field: 'id', align: 'right', sortable: false },
];

function recargar() {
  void movimientoLoteStore.fetchAll();
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
      await movimientoLoteStore.borrar(idABorrar.value);
    }
  } catch {
    notificarError('No se pudo eliminar el movimiento de lote');
  } finally {
    confirmandoBaja.value = false;
    recargar();
  }
}

onMounted(() => {
  recargar();
  void loteStore.fetchEstadoSelectList();
});
</script>