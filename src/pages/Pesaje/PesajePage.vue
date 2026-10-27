<template>
  <q-page class="q-pa-md">
    <q-table
      title="Pesajes"
      :rows="pesaje.pesajes"
      :columns="columns"
      row-key="id"
      :loading="pesaje.loading"
      :rows-per-page-options="[10, 20, 50, 0]"
      no-data-label="No hay pesajes para mostrar"
      loading-label="Cargando pesajes..."
    >
      <template #top-right>
        <q-btn
          flat
          round
          icon="refresh"
          aria-label="Actualizar"
          :loading="pesaje.loading"
          @click="pesaje.fetchAll()"
        />
      </template>
    </q-table>

    <q-banner v-if="pesaje.error" class="bg-negative text-white q-mt-md" rounded>
      {{ pesaje.error }}
    </q-banner>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import type { QTableColumn } from 'quasar';
import { usePesajeStore } from 'stores/pesaje';
import type { PesajeResponseDto } from 'src/models/Pesaje/PesajeResponseDto';

const pesaje = usePesajeStore();

const columns: QTableColumn<PesajeResponseDto>[] = [
  { name: 'id', label: 'Id', field: 'id', align: 'left', sortable: true },
  { name: 'pesoNeto', label: 'Peso neto', field: 'pesoNeto', align: 'left', sortable: true },
  { name: 'tipoPesaje', label: 'Tipo de pesaje', field: 'tipoPesaje', align: 'left', sortable: true },
  { name: 'fechaHora', label: 'Fecha y hora', field: 'fechaHora', align: 'left', sortable: true },
  { name: 'observaciones', label: 'Observaciones', field: 'observaciones', align: 'left', sortable: true },
  { name: 'loteId', label: 'Lote (Id)', field: 'loteId', align: 'left', sortable: true },
];

onMounted(() => {
  void pesaje.fetchAll();
});
</script>