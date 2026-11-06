export interface MovimientoLoteRequestDto {
  estadoAnterior: number;
  estadoNuevo: number;
  fechaHora: string;
  observaciones: string;
  personaResponsable: string;
  loteId: number;
}