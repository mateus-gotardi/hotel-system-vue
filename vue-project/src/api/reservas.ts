import type { AxiosInstance } from "axios";

type ReservaBody = {
    idhotel: string;
    numeroreserva: string;
    apartamento: string;
    datacheckin: string;
    datacheckout: string;
    status: string;
    hospedes: {
        idhospede: string;
        nome: string;
        sobrenome: string;
    }[]
}

export class Reservas {
    constructor(
        private readonly http: AxiosInstance,
    ) { }
    public async getAll<T = any>() {
        return this.http.get<T>(`/buscarReservaHospede`)
    }
    public async getOne<T = any>(id: string) {
        return this.http.get<T>(`/buscarReservaHospede:${id}`)
    }
    public async create<T = any>(body: ReservaBody) {
        return this.http.post<T>(`/cadastrarReservaHospede`, body)
    }
    public async update<T = any>(body: ReservaBody) {
        return this.http.put<T>(`/atualizarReservaHospede`, body)
    }
    public async deleteReserva<T = any>(id: string) {
        return this.http.delete<T>(`/apagarReservaHospede:${id}`)
    }
}