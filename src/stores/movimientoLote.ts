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

  /** GET api/MovimientosLote/All */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<MovimientoLoteResponseDto[]>('/MovimientosLote/All');
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

  /** GET api/MovimientosLote/ById?Id=... */
  async function fetchById(id: number): Promise<MovimientoLoteResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<MovimientoLoteResponseDto>(`/MovimientosLote/ById?Id=${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

  /** POST api/MovimientosLote */
  async function create(movimientoLote: MovimientoLoteRequestDto) {
    loading.value = true;
    try {
      await api.post('/MovimientosLote', movimientoLote);
      notificarExito('MovimientoLote creado');
    } finally {
      loading.value = false;
    }
  }

  /** PUT api/MovimientosLote?Id=... */
  async function update(id: number, movimientoLote: MovimientoLoteRequestDto) {
    loading.value = true;
    try {
      await api.put(`/MovimientosLote?Id=${id}`, movimientoLote);
      notificarExito('MovimientoLote modificado');
    } finally {
      loading.value = false;
    }
  }

  /** DELETE api/MovimientosLote?Id=... */
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/MovimientosLote?Id=${id}`);
      notificarExito('MovimientoLote eliminado');
    } finally {
      loading.value = false;
    }
  }

  return { movimientoLotes, loading, error, fetchAll, fetchById, create, update, borrar };
});