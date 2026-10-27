
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { isAxiosError } from 'axios';
import { api } from 'boot/axios';
import type { EmpleadoResponseDto } from 'src/models/Empleado/EmpleadoResponseDto';
import type { EmpleadoRequestDto } from 'src/models/Empleado/EmpleadoRequestDto';
import { notificarExito } from 'src/utils/notificar';

export const useEmpleadoStore = defineStore('empleado', () => {
  const empleados = ref<EmpleadoResponseDto[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  /** GET api/Empleados/All */
  async function fetchAll() {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.get<EmpleadoResponseDto[]>('/Empleados/All');
      empleados.value = data;
    } catch (e) {
      empleados.value = [];
      if (isAxiosError(e)) {
        error.value = e.response
          ? `Error ${e.response.status} al obtener los empleados`
          : 'No se pudo conectar con la API';
      } else {
        error.value = 'Error inesperado al obtener los empleados';
      }
    } finally {
      loading.value = false;
    }
  }

  /** GET api/Empleados/ById?Id=... Devuelve el empleado o null si no existe. */
  async function fetchById(id: number): Promise<EmpleadoResponseDto | null> {
    loading.value = true;
    try {
      const { data } = await api.get<EmpleadoResponseDto>(`/Empleados/ById?Id=${id}`);
      return data;
    } catch {
      return null;
    } finally {
      loading.value = false;
    }
  }

  /** POST api/Empleados */
  async function create(empleado: EmpleadoRequestDto) {
    loading.value = true;
    try {
      await api.post('/Empleados', empleado);
      notificarExito('Empleado creado');
    } finally {
      loading.value = false;
    }
  }

  /** PUT api/Empleados?Id=... */
  async function update(id: number, empleado: EmpleadoRequestDto) {
    loading.value = true;
    try {
      await api.put(`/Empleados?Id=${id}`, empleado);
      notificarExito('Empleado modificado');
    } finally {
      loading.value = false;
    }
  }

  /** DELETE api/Empleados?Id=... (se llama borrar porque delete es palabra reservada) */
  async function borrar(id: number) {
    loading.value = true;
    try {
      await api.delete(`/Empleados?Id=${id}`);
      notificarExito('Empleado eliminado');
    } finally {
      loading.value = false;
    }
  }

  return { empleados, loading, error, fetchAll, fetchById, create, update, borrar };
});
