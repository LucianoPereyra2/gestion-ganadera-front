<template>
  <q-page padding>
    <q-card class="q-pa-md">
      <div class="row items-center q-gutter-sm">
        <div class="text-h6">Lotes</div>
        <q-space />
        <q-input v-model="filtro" dense outlined placeholder="Buscar" debounce="300" style="width: 220px">
          <template #append>
            <q-icon v-if="filtro === ''" name="search" />
            <q-icon v-else name="close" class="cursor-pointer" @click="filtro = ''" />
          </template>
        </q-input>
        <q-btn round unelevated color="primary" icon="add" @click="abrirAlta">
          <q-tooltip>Nuevo lote</q-tooltip>
        </q-btn>
        <q-btn flat round icon="refresh" :loading="loteStore.loading" @click="recargar">
          <q-tooltip>Actualizar</q-tooltip>
        </q-btn>
      </div>

      <q-card-section>
        <q-table
          :rows="loteStore.lotes"
          :columns="columns"
          row-key="id"
          :filter="filtro"
          :loading="loteStore.loading"
          :rows-per-page-options="[10, 20, 50, 0]"
          no-data-label="No hay lotes para mostrar"
          loading-label="Cargando lotes..."
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

      <q-banner v-if="loteStore.error" class="bg-negative text-white" rounded>
        {{ loteStore.error }}
      </q-banner>
    </q-card>

    <q-dialog v-model="mostrarFormulario">
      <LoteCreate :edit-id="editId" @close="cerrarFormulario" />
    </q-dialog>

    <q-dialog v-model="confirmandoBaja">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="warning" color="warning" size="sm" class="q-mr-sm" />
          <span class="text-h6">Confirmar</span>
        </q-card-section>
        <q-card-section>Se va a eliminar el lote. Esta acción no se puede deshacer.</q-card-section>
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
import { useLotesStore } from 'stores/lotes';
import { useClienteStore } from 'stores/cliente';
import type { LoteResponseDto } from 'src/models/Lote/LoteResponseDto';
import LoteCreate from 'src/components/Lote/LoteCreate.vue';
import { notificarError } from 'src/utils/notificar';

const loteStore = useLotesStore();
const clienteStore = useClienteStore();

const filtro = ref('');
const mostrarFormulario = ref(false);
const editId = ref<number | null>(null);
const confirmandoBaja = ref(false);
const idABorrar = ref<number | null>(null);

const columns: QTableColumn<LoteResponseDto>[] = [
  { name: 'id', label: 'Id', field: 'id', align: 'left', sortable: true },
  { name: 'codigo', label: 'Código', field: 'codigo', align: 'left', sortable: true },
  { name: 'cantidadCabezas', label: 'Cantidad de cabezas', field: 'cantidadCabezas', align: 'left', sortable: true },
  { name: 'especie', label: 'Especie', field: 'especie', align: 'left', sortable: true },
  { name: 'categoria', label: 'Categoría', field: 'categoria', align: 'left', sortable: true },
  { name: 'estado', label: 'Estado', field: 'estado', align: 'left', sortable: true },
  { name: 'fechaHoraIngreso', label: 'Fecha de ingreso', field: 'fechaHoraIngreso', align: 'left', sortable: true },
  { name: 'fechaHoraEgreso', label: 'Fecha de egreso', field: 'fechaHoraEgreso', align: 'left', sortable: true },
  {
    name: 'clienteId',
    label: 'Cliente',
    field: 'clienteId',
    align: 'left',
    sortable: true,
    format: (val: number) => clienteStore.clientes.find((c) => c.id === val)?.razonSocial ?? String(val),
  },
  { name: 'acciones', label: 'Acciones', field: 'id', align: 'right', sortable: false },
];

function recargar() {
  void loteStore.fetchAll();
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
      await loteStore.borrar(idABorrar.value);
    }
  } catch {
    notificarError('No se pudo eliminar el lote');
  } finally {
    confirmandoBaja.value = false;
    recargar();
  }
}

onMounted(() => {
  recargar();
  void clienteStore.fetchAll();
});
</script>