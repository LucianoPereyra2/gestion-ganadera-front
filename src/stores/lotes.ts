
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { LoteResponseDto } from 'src/models/Lote/LoteResponseDto';
import type { LoteRequestDto } from 'src/models/Lote/LoteRequestDto';
import { notificarExito } from 'src/utils/notificar';

export const useLotesStore = defineStore('lotes', () => {
  const lotes = ref<LoteResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** GET api/Lotes/All */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<LoteResponseDto[]>('/Lotes/All');
      lotes.value = data;
    } catch (e) {
      lotes.value = [];
      if (isAxiosError(e)) {
        error.value = e.response
          ? `Error ${e.response.status} al obtener los lotes`
          : 'No se pudo conectar con la API';
      } else {
        error.value = 'Error inesperado al obtener los lotes';
      }
    } finally {
      loading.value = false;
    }
  }

  /** GET api/Lotes/ById?Id=... Devuelve el lote o null si no existe. */
  async function fetchById(id: number): Promise<LoteResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<LoteResponseDto>(`/Lotes/ById?Id=${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

  /** POST api/Lotes */
  async function create(lotes: LoteRequestDto) {
    loading.value = true;
    try {
      await api.post('/Lotes', lotes);
      notificarExito('Lote creado');
    } finally {
      loading.value = false;
    }
  }

  /** PUT api/Lotes?Id=... */
  async function update(id: number, lotes: LoteRequestDto) {
    loading.value = true;
    try {
      await api.put(`/Lotes?Id=${id}`, lotes);
      notificarExito('Lote modificado');
    } finally {
      loading.value = false;
    }
  }

  /** DELETE api/Lotes?Id=... (se llama borrar porque delete es palabra reservada) */
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/Lotes?Id=${id}`);
      notificarExito('Lote eliminado');
    } finally {
      loading.value = false;
    }
  }

  return { lotes, loading, error, fetchAll, fetchById, create, update, borrar };
});
