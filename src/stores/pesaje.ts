import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { PesajeResponseDto } from 'src/models/Pesaje/PesajeResponseDto';
import type { PesajeRequestDto } from 'src/models/Pesaje/PesajeRequestDto';
import { notificarExito } from 'src/utils/notificar';

export const usePesajeStore = defineStore('pesaje', () => {
  const pesajes = ref<PesajeResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** GET api/Pesajes/All */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<PesajeResponseDto[]>('/Pesajes/All');
      pesajes.value = data;
    } catch (e) {
      pesajes.value = [];
      if (isAxiosError(e)) {
        error.value = e.response
          ? `Error ${e.response.status} al obtener los pesajes`
          : 'No se pudo conectar con la API';
      } else {
        error.value = 'Error inesperado al obtener los pesajes';
      }
    } finally {
      loading.value = false;
    }
  }

  /** GET api/Pesajes/ById?Id=... Devuelve el pesaje o null si no existe. */
  async function fetchById(id: number): Promise<PesajeResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<PesajeResponseDto>(`/Pesajes/ById?Id=${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

  /** POST api/Pesajes */
  async function create(pesaje: PesajeRequestDto) {
    loading.value = true;
    try {
      await api.post('/Pesajes', pesaje);
      notificarExito('Pesaje creado');
    } finally {
      loading.value = false;
    }
  }

  /** PUT api/Pesajes?Id=... */
  async function update(id: number, pesaje: PesajeRequestDto) {
    loading.value = true;
    try {
      await api.put(`/Pesajes?Id=${id}`, pesaje);
      notificarExito('Pesaje modificado');
    } finally {
      loading.value = false;
    }
  }

  /** DELETE api/Pesajes?Id=... (se llama borrar porque delete es palabra reservada) */
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/Pesajes?Id=${id}`);
      notificarExito('Pesaje eliminado');
    } finally {
      loading.value = false;
    }
  }

  return { pesajes, loading, error, fetchAll, fetchById, create, update, borrar };
});
