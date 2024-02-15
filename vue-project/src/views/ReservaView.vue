<template>
  <div class="reservas-container">
    <div class="top">
      <h4 v-if="hotelStore.hotel.id !== ''">Hotel selecionado: {{ hotelStore.hotel.nome }}</h4>
      <h4 v-if="hotelStore.hotel.id === ''">Escolher hotel</h4>
      <ul class="hotel-list">
        <li v-for="hotel in hotelStore.hoteis" :key="hotel.id" class="listItem">
          <HotelListButton @click="handleSelect(hotel)" :selecionado="hotel.id === hotelStore.hotel.id">
            {{ hotel.nome }} - {{ hotel.cidade }}, {{ hotel.pais }}
          </HotelListButton>
        </li>
      </ul>
    </div>
    <div class="reservas">
      <div class="reservas-head">
        <button @click="() => {
          reservaStore.abrirModal()
          reservaStore.sairModoEdicao()
        }">Criar Reserva</button>
      </div>
      <div class="reservas-lista">
        <div v-for="(reserva, index) in reservaStore.reservas" :key="index" class="reserva-detalhes">
          <div class="reserva-buttons">
            <button @click="selectReserva(reserva)">
              Editar
            </button>
            <button @click="apagarReserva(reserva.id.toString())">
              Apagar
            </button>
          </div>
          <p>Numero reserva: {{ reserva.numeroreserva }}</p>
          <p v-if="hotelStore.hotel.id === ''">Hotel: {{ nomeDoHotel(reserva.idhotel.toString()) }}</p>
          <p>Status: {{ reserva.status }}</p>
          <p>Apartamento: {{ reserva.apartamento }}</p>
          <p>Check in: {{ reserva.datacheckin }}</p>
          <p v-if="reserva.datacheckout && reserva.datacheckout !== ''">Check out: {{ reserva.datacheckout }}</p>
        </div>
      </div>
    </div>
    <FormularioReserva v-if="reservaStore.reservaModal" />
  </div>
</template>
<script lang="ts">
import type { IHotel } from '@/types/hotel';
import { defineComponent } from 'vue';
import HotelListButton from '../components/HotelListButton.vue'
import { useHotelStore } from '@/stores/hotel';
import FormularioReserva from '@/components/FormularioReserva.vue';
import { useReservaStore } from '@/stores/reserva';
import type { Reserva } from '@/types/reserva';
import api from '@/api';


export default defineComponent({

  data() {
    const hotelStore = useHotelStore()
    const reservaStore = useReservaStore()
    return {
      hotelStore,
      reservaStore,
    }
  },
  components: {
    HotelListButton,
    FormularioReserva
  },
  mounted() {
    this.hotelStore.fetchHoteis()
    this.hotelStore.deselectHotel()
    if (this.hotelStore.hotel.id === '') {
      this.reservaStore.fetchReservas()
    } else {
      this.reservaStore.fetchReservas(this.hotelStore.hotel.id)
    }
    this.reservaStore.fecharModal()
  },
  methods: {
    handleSelect(value: IHotel) {
      if (value == this.hotelStore.hotel) {
        this.hotelStore.deselectHotel()
        this.reservaStore.fetchReservas()
        return
      }
      this.hotelStore.selectHotel(value)
      this.reservaStore.fetchReservas(value.id)
    },
    async apagarReserva(id: string) {
      const response = await api.reservas.deleteReserva(id)
      if (response.data.message == "Reserva apagada com sucesso") {
        this.reservaStore.fetchReservas(this.hotelStore.hotel.id)
      }
    },
    selectReserva(reserva: Reserva) {
      const hotel = this.hotelStore.hoteis.find((e) => e.id == reserva.idhotel.toString())
      this.reservaStore.fetchReservaDetails(reserva.id)
      this.reservaStore.entrarModoEdicao()
      this.reservaStore.abrirModal()
      if (hotel) {
        this.hotelStore.selectHotel(hotel)
      }
    },
    nomeDoHotel(id: string) {
      const hotel = this.hotelStore.hoteis.find((e) => e.id == id)
      return hotel?.nome
    }
  }
})

</script>
  
<style>
.reserva-detalhes {
  background-color: var(--color-background-soft);
  padding: .7rem;
  border-radius: .5rem;
  -webkit-box-shadow: 2px 2px 5px 0px rgba(201, 201, 201, 1);
  -moz-box-shadow: 2px 2px 5px 0px rgba(201, 201, 201, 1);
  box-shadow: 2px 2px 5px 0px rgba(201, 201, 201, 1);
}

.reserva-buttons {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: .5rem;
}

@media (min-width: 1024px) {
  .reservas-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    padding: 1.5rem 0;
    margin-left: 1rem;
    width: 90vw;
  }

  .reservas-lista {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1.5rem;
  }

  .reservas {
    height: 100%;
    width: 100%;
  }

  .hotel-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    width: 100%;
    align-items: center;
    justify-content: flex-start;
    padding: 0;
    column-gap: .8rem;
    row-gap: .5rem;
  }

  .reservas-head {
    margin: .5rem 0
  }
}

.listItem {
  list-style-type: none;
}
</style>
  