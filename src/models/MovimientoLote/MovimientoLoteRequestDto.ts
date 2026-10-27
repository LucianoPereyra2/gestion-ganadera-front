export interface MovimientoLoteRequestDto {
    estadoAnterior: string;
    estadoNuevo: string;
    fechaHora: string;
    observaciones: string;
    personaResponsable: string;
    loteId: number;
}