export interface LoteResponseDto {
  id: number;
  codigo: string;
  cantidadCabezas: number;
  especieAnimalId: number;
  categoria: string;
  estado: number;
  fechaHoraIngreso: string;
  fechaHoraEgreso: string;
  clienteId: number;
}