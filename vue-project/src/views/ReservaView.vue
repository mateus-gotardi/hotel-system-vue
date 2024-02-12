<template>
  <div class="container">
    <h1>Cadastrar reserva</h1>
    <h3 v-if="hotelStore.hotel.id !== ''">Hotel selecionado: {{ hotelStore.hotel.nome }}</h3>
    <h3 v-if="hotelStore.hotel.id === ''">Escolher hotel</h3>
    <ul class="hotel-list">
      <li v-for="hotel in hotelStore.hoteis" :key="hotel.id" class="listItem">
        <HotelListButton @click="handleSelect(hotel)">
          {{ hotel.nome }} - {{ hotel.cidade }}, {{ hotel.pais }}
        </HotelListButton>
      </li>
    </ul>
    <div class="reservas-lista" v-if="hotelStore.hotel.id !== ''">
      <div class="reservasHead"><button @click="() => {
        reservaStore.abrirModal()
        reservaStore.sairModoEdicao()
      }">+</button></div>
      <div v-for="(reserva, index) in reservaStore.reservas" :key="index" class="reserva-detalhes">
        <div class="reserva-buttons"></div>
        <button @click="selectReserva(reserva)">
          Editar
        </button>
        <button>
          Apagar
        </button>
        <p>numero reserva: {{ reserva.numeroreserva }}</p>
        <p>status: {{ reserva.status }}</p>
        <p>apartamento: {{ reserva.apartamento }}</p>
        <p>check in: {{ reserva.datacheckin }}</p>
        <p v-if="reserva.datacheckout && reserva.datacheckout !== ''">check out: {{ reserva.datacheckout }}</p>
        <p v-if="hotelStore.hotel.id == ''">Hotel: {{ reserva.idhotel }}</p>
      </div>
    </div>
    <FormularioReserva v-if="reservaStore.reservaModal" />
  </div>
</template>
<script lang="ts">
import type { IHotel } from '@/types/hotel';
import { defineComponent } from 'vue'
import HotelListButton from '../components/HotelListButton.vue'
import { useHotelStore } from '@/stores/hotel';
import FormularioReserva from '@/components/FormularioReserva.vue';
import { useReservaStore } from '@/stores/reserva';
import type { Reserva } from '@/types/reserva';


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
    this.reservaStore.fetchReservas()
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
    selectReserva(reserva: Reserva) {
      this.reservaStore.fetchReservaDetails(reserva.id)
      this.reservaStore.entrarModoEdicao()
      this.reservaStore.abrirModal()
    },
    abrirNovaReserva() {

    }
  }
})

</script>
  
<style>
@media (min-width: 1024px) {
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .listItem {
    list-style-type: none;
  }

  .hotel-list {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
  