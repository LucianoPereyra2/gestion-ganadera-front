import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { MovimientoLoteResponseDto } from 'src/models/MovimientoLote/MovimientoLoteResponseDto';
import type { MovimientoLoteRequestDto } from 'src/models/MovimientoLote/MovimientoLoteRequestDto';
import { notificarExito } from 'src/utils/notificar';

export const useMovimientoLoteStore = defineStore('movimientoLote', () => {
  const movimientoLotes = ref<MovimientoLoteResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** GET api/MovimientoLotes/All */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<MovimientoLoteResponseDto[]>('/MovimientoLotes/All');
      movimientoLotes.value = data;
    } catch (e) {
      movimientoLotes.value = [];
      if (isAxiosError(e)) {
        error.value = e.response
          ? `Error ${e.response.status} al obtener los movimientoLotes`
          : 'No se pudo conectar con la API';
      } else {
        error.value = 'Error inesperado al obtener los movimientoLotes';
      }
    } finally {
      loading.value = false;
    }
  }

  /** GET api/MovimientoLotes/ById?Id=... Devuelve el movimientoLote o null si no existe. */
  async function fetchById(id: number): Promise<MovimientoLoteResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<MovimientoLoteResponseDto>(`/MovimientoLotes/ById?Id=${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

  /** POST api/MovimientoLotes */
  async function create(movimientoLote: MovimientoLoteRequestDto) {
    loading.value = true;
    try {
      await api.post('/MovimientoLotes', movimientoLote);
      notificarExito('MovimientoLote creado');
    } finally {
      loading.value = false;
    }
  }

  /** PUT api/MovimientoLotes?Id=... */
  async function update(id: number, movimientoLote: MovimientoLoteRequestDto) {
    loading.value = true;
    try {
      await api.put(`/MovimientoLotes?Id=${id}`, movimientoLote);
      notificarExito('MovimientoLote modificado');
    } finally {
      loading.value = false;
    }
  }

  /** DELETE api/MovimientoLotes?Id=... (se llama borrar porque delete es palabra reservada) */
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/MovimientoLotes?Id=${id}`);
      notificarExito('MovimientoLote eliminado');
    } finally {
      loading.value = false;
    }
  }

  return { movimientoLotes, loading, error, fetchAll, fetchById, create, update, borrar };
});
