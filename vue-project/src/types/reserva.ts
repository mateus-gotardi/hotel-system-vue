export type Hospede = {
    nome: string;
    sobrenome: string;
    idhospede: string | number;
}

export type Reserva = {
    id: number,
    idhotel: number,
    numeroreserva: number | string,
    apartamento: number | string,
    datacheckin: string,
    datacheckout: string,
    status: number | string,
    hospedes?: Hospede[]
}

export type ReservaParcial = {
    idhotel?: number,
    numeroreserva?: number | string,
    apartamento?: number | string,
    datacheckin?: string,
    datacheckout?: string,
    status?: number | string,
    hospedes?: Hospede[]
}