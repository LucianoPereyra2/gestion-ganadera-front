export interface LoteRequestDto {
    codigo: string;
    cantidadCabezas: number;
    especie: string;
    categoria: string;
    estado: string;
    fechaHoraIngreso: string;
    fechaHoraEgreso: string;
    clienteId: number;
}