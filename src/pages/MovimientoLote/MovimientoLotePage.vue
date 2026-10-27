<template>
  <q-page class="q-pa-md">
    <q-table
      title="MovimientoLotes"
      :rows="movimientoLote.movimientoLotes"
      :columns="columns"
      row-key="id"
      :loading="movimientoLote.loading"
      :rows-per-page-options="[10, 20, 50, 0]"
      no-data-label="No hay movimientoLotes para mostrar"
      loading-label="Cargando movimientoLotes..."
    >
      <template #top-right>
        <q-btn
          flat
          round
          icon="refresh"
          aria-label="Actualizar"
          :loading="movimientoLote.loading"
          @click="movimientoLote.fetchAll()"
        />
      </template>
    </q-table>

    <q-banner v-if="movimientoLote.error" class="bg-negative text-white q-mt-md" rounded>
      {{ movimientoLote.error }}
    </q-banner>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import type { QTableColumn } from 'quasar';
import { useMovimientoLoteStore } from 'stores/movimientoLote';
import type { MovimientoLoteResponseDto } from 'src/models/MovimientoLote/MovimientoLoteResponseDto';
const movimientoLote = useMovimientoLoteStore();

const columns: QTableColumn<MovimientoLoteResponseDto>[] = [
  { name: 'id', label: 'Id', field: 'id', align: 'left', sortable: true },
  { name: 'estadoAnterior', label: 'Estado anterior', field: 'estadoAnterior', align: 'left', sortable: true },
  { name: 'estadoNuevo', label: 'Estado nuevo', field: 'estadoNuevo', align: 'left', sortable: true },
  { name: 'fechaHora', label: 'Fecha y hora', field: 'fechaHora', align: 'left', sortable: true },
  { name: 'observaciones', label: 'Observaciones', field: 'observaciones', align: 'left', sortable: true },
  { name: 'personaResponsable', label: 'Persona responsable', field: 'personaResponsable', align: 'left', sortable: true },
  { name: 'loteId', label: 'Lote (Id)', field: 'loteId', align: 'left', sortable: true },
];;
  

onMounted(() => {
  void movimientoLote.fetchAll();
});
</script>
