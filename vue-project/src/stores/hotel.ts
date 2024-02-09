import { defineStore } from 'pinia'
import type { IHotel } from '@/types/hotel';
import api from '@/api';
import type { AxiosResponse } from 'axios';

export interface HotelStoreState {
  hotel: IHotel;
  hoteis: IHotel[];
}

export const useHotelStore = defineStore('hotel', {
  state: (): HotelStoreState => ({
    hotel: {
      id: '',
      nome: '',
      cidade: '',
      estado: '',
      cnpj: '',
      pais: '',
    },
    hoteis: [],
  }),
  actions: {
    async fetchHoteis() {
      const response: AxiosResponse<IHotel[]> = await api.hotel.getAll();
      const hoteis = response.data;
      this.hoteis = hoteis;
    },
    selectHotel(hotel: IHotel) {
      this.hotel = hotel;
    },
    deselectHotel() {
      this.hotel = {
        id: '',
        nome: '',
        cidade: '',
        estado: '',
        cnpj: '',
        pais: '',
      };
    },
  }
})

