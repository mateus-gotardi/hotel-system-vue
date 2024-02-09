import { defineStore } from 'pinia'
import type { Reserva, ReservaParcial } from '@/types/reserva';
import api from '@/api';
import type { AxiosResponse } from 'axios';

export interface ReservasStoreState {
  reserva: Reserva,
  reservas: Reserva[],
  reservaModal: boolean
}

export const useReservaStore = defineStore('reservas', {
  state: (): ReservasStoreState => ({
    reserva: {
      id: -1,
      apartamento: '',
      datacheckin: '',
      datacheckout: '',
      hospedes: [],
      idhotel: -1,
      numeroreserva: -1,
      status: '',
    },
    reservas: [],
    reservaModal: false
  }),
  actions: {
    async fetchReservas(id?: string) {
      if (id) {
        const response: AxiosResponse<Reserva[]> = await api.reservas.getByHotel(id);
        const reservas = response.data
        this.reservas = reservas
      } else {
        const response: AxiosResponse<Reserva[]> = await api.reservas.getAll();
        const reservas = response.data
        this.reservas = reservas
      }
    },
    async fetchReservaDetails(id: number) {
      const response: AxiosResponse<Reserva> = await api.reservas.getOne(JSON.stringify(id))
      const reserva = response.data
      this.reserva = reserva
    },
    setReserva(reserva: ReservaParcial) {
      this.reserva = { ...this.reserva, ...reserva }
    },
    removerReserva() {
      this.reserva = {
        id: -1,
        apartamento: '',
        datacheckin: '',
        datacheckout: '',
        hospedes: [],
        idhotel: -1,
        numeroreserva: -1,
        status: '',
      }
    },
    abrirModal() {
      this.reservaModal = true
    },
    fecharModal() {
      this.reservaModal = false
    },
    adicionarHospede() {
      const hospedes = this.reserva.hospedes || []
      hospedes.push({
        idhospede: -1,
        nome: '',
        sobrenome: ''
      })
      this.reserva.hospedes = hospedes
    },
    removerHospede(index: number) {
      const hospedes = this.reserva.hospedes
      hospedes?.splice(index, 1);
      this.reserva.hospedes = hospedes
    }
  }
})

