import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { SectorResponseDto } from 'src/models/Sector/SectorResponseDto';
import type { SectorRequestDto } from 'src/models/Sector/SectorRequestDto';
import { notificarExito } from 'src/utils/notificar';

export const useSectorStore = defineStore('sector', () => {
  const sectores = ref<SectorResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** GET api/Sectores/All */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<SectorResponseDto[]>('/Sectores/All');
      sectores.value = data;
    } catch (e) {
      sectores.value = [];
      if (isAxiosError(e)) {
        error.value = e.response
          ? `Error ${e.response.status} al obtener los sectores`
          : 'No se pudo conectar con la API';
      } else {
        error.value = 'Error inesperado al obtener los sectores';
      }
    } finally {
      loading.value = false;
    }
  }

  /** GET api/Sectores/ById?Id=... Devuelve el sector o null si no existe. */
  async function fetchById(id: number): Promise<SectorResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<SectorResponseDto>(`/Sectores/ById?Id=${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

  /** POST api/Sectores */
  async function create(sector: SectorRequestDto) {
    loading.value = true;
    try {
      await api.post('/Sectores', sector);
      notificarExito('Sector creado');
    } finally {
      loading.value = false;
    }
  }

  /** PUT api/Sectores?Id=... */
  async function update(id: number, sector: SectorRequestDto) {
    loading.value = true;
    try {
      await api.put(`/Sectores?Id=${id}`, sector);
      notificarExito('Sector modificado');
    } finally {
      loading.value = false;
    }
  }

  /** DELETE api/Sectores?Id=...) */
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/Sectores?Id=${id}`);
      notificarExito('Sector eliminado');
    } finally {
      loading.value = false;
    }
  }

  return { sectores, loading, error, fetchAll, fetchById, create, update, borrar };
});
