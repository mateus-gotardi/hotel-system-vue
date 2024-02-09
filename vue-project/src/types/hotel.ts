export type HotelBody = {
    nome: string
    cnpj: string
    estado: string
    cidade: string
    pais: string
}
export interface IHotel extends HotelBody {
    id: string;
    inserted_at?: string;
    updated_at?: string;
}