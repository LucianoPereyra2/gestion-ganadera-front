import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { EspecieAnimalResponseDto } from 'src/models/EspecieAnimal/EspecieAnimalResponseDto';
import type { EspecieAnimalRequestDto } from 'src/models/EspecieAnimal/EspecieAnimalRequestDto';
import type { EspecieAnimalSelectListDto } from 'src/models/EspecieAnimal/EspecieAnimalSelectListDto';
import { notificarExito } from 'src/utils/notificar';

export const useEspecieAnimalStore = defineStore('especieAnimal', () => {
  const especies = ref<EspecieAnimalResponseDto[]>([]);
  const especiesList = ref<EspecieAnimalSelectListDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** GET api/EspeciesAnimales/All */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<EspecieAnimalResponseDto[]>('/EspeciesAnimales/All');
      especies.value = data;
    } catch (e) {
      especies.value = [];
      if (isAxiosError(e)) {
        error.value = e.response
          ? `Error ${e.response.status} al obtener las especies`
          : 'No se pudo conectar con la API';
      } else {
        error.value = 'Error inesperado al obtener las especies';
      }
    } finally {
      loading.value = false;
    }
  }
  /** GET api/EspeciesAnimales/GetSelectList */
    async function fetchSelectList() {
    loading.value = true;
    error.value = null;
    try {
      const res = await api.get<EspecieAnimalSelectListDto[]>('/EspeciesAnimales/GetSelectList');
      especiesList.value = res.data ?? [];
      return res.data;
    } finally {
      loading.value = false;
    }
  }

  /** GET api/EspeciesAnimales/ById?Id=... Devuelve la especie o null si no existe. */
  async function fetchById(id: number): Promise<EspecieAnimalResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<EspecieAnimalResponseDto>(`/EspeciesAnimales/ById?Id=${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

  /** POST api/EspeciesAnimales */
  async function create(especie: EspecieAnimalRequestDto) {
    loading.value = true;
    try {
      await api.post('/EspeciesAnimales', especie);
      notificarExito('Especie creada');
    } finally {
      loading.value = false;
    }
  }

  /** PUT api/EspeciesAnimales?Id=... */
  async function update(id: number, especie: EspecieAnimalRequestDto) {
    loading.value = true;
    try {
      await api.put(`/EspeciesAnimales?Id=${id}`, especie);
      notificarExito('Especie modificada');
    } finally {
      loading.value = false;
    }
  }

  /** DELETE api/EspeciesAnimales?Id=... */
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/EspeciesAnimales?Id=${id}`);
      notificarExito('Especie eliminada');
    } finally {
      loading.value = false;
    }
  }

  return { especies, especiesList, loading, error, fetchAll, fetchSelectList, fetchById, create, update, borrar };});