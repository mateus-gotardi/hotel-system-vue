import type { AxiosInstance } from "axios";
import type { HotelBody, IHotel } from "@/types/hotel";

export class Hotel {
    constructor(
        private readonly http: AxiosInstance,
    ) { }
    public async getAll<T = Hotel>() {
        return this.http.get<T[]>(`/buscarHotel`)
    }
    public async getOne<T = any>(id: string) {
        return this.http.get<T>(`/buscarHotel/${id}`)
    }
    public async create<T = any>(body: HotelBody) {
        return this.http.post<T>(`/cadastrarHotel`, body)
    }
    public async update<T = any>(body: HotelBody) {
        return this.http.put<T>(`/atualizarHotel`, body)
    }
    public async deleteHotel<T = any>(id: string) {
        return this.http.delete<T>(`/apagarHotel/${id}`)
    }
}