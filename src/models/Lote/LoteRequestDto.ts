export interface LoteRequestDto {
  codigo: string;
  cantidadCabezas: number;
  especieAnimalId: number;
  categoria: string;
  estado: number;
  fechaHoraIngreso: string;
  fechaHoraEgreso: string;
  clienteId: number;
}