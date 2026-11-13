export interface MovimientoLoteResponseDto {
  id: number;
  estadoAnterior: number;
  estadoNuevo: number;
  fechaHora: string;
  observaciones: string;
  personaResponsable: string;
  codigoLote: string;
}