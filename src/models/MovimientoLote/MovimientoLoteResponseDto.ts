export interface MovimientoLoteResponseDto {
    id: number;
    estadoAnterior: string;
    estadoNuevo: string;
    fechaHora: string;
    observaciones: string;
    personaResponsable: string;
    loteId: number;
}