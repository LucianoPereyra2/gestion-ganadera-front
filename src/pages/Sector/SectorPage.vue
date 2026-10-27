<template>
  <q-page class="q-pa-md">
    <q-table
      title="Sectores"
      :rows="sector.sectores"
      :columns="columns"
      row-key="id"
      :loading="sector.loading"
      :rows-per-page-options="[10, 20, 50, 0]"
      no-data-label="No hay sectores para mostrar"
      loading-label="Cargando sectores..."
    >
      <template #top-right>
        <q-btn
          flat
          round
          icon="refresh"
          aria-label="Actualizar"
          :loading="sector.loading"
          @click="sector.fetchAll()"
        />
      </template>
    </q-table>

    <q-banner v-if="sector.error" class="bg-negative text-white q-mt-md" rounded>
      {{ sector.error }}
    </q-banner>
  </q-page>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import type { QTableColumn } from 'quasar';
import { useSectorStore } from 'stores/sector';
import type { SectorResponseDto } from 'src/models/Sector/SectorResponseDto';

const sector = useSectorStore();

const columns: QTableColumn<SectorResponseDto>[] = [
  { name: 'id', label: 'Id', field: 'id', align: 'left', sortable: true },
  { name: 'nombre', label: 'Nombre', field: 'nombre', align: 'left', sortable: true },
  { name: 'descripcion', label: 'Descripción', field: 'descripcion', align: 'left', sortable: true },
  { name: 'capacidadMaxima', label: 'Capacidad máxima', field: 'capacidadMaxima', align: 'left', sortable: true },
  { name: 'disponible', label: 'Disponible', field: 'disponible', align: 'left', sortable: true },
];

onMounted(() => {
  void sector.fetchAll();
});
</script>