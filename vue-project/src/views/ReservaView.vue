<template>
  <div class="container">
    <h1>Cadastrar reserva</h1>
    <h2>Escolher hotel</h2>
    <h3 v-if="selected.id !== ''">Hotel selecionado: {{ selected.nome }}</h3>
    <ul class="hotel-list">
      <li v-for="hotel in hoteis" :key="hotel.id" class="listItem">
        <HotelListButton @click="handleSelect(hotel)">
          nome: {{ hotel.nome }} - {{ hotel.cidade }}, {{ hotel.pais }}
        </HotelListButton>
      </li>
    </ul>
  </div>
</template>
<script lang="ts">
import api from '@/api';
import type { HotelBody } from '@/types/hotel';
import { defineComponent } from 'vue'
import HotelListButton from '../components/HotelListButton.vue'

interface Hotel extends HotelBody {
  id: string;
}
export default defineComponent({
  data() {
    const hoteis: Hotel[] = []
    let selected: Hotel = {
      id: '',
      nome: '',
      cidade: '',
      estado: '',
      cnpj: '',
      pais: '',
    }
    return {
      hoteis,
      selected,
    }
  },
  components: {
    HotelListButton
  },
  mounted() {
    this.fetchHoteis()
  },
  methods: {
    async fetchHoteis() {
      this.hoteis = (await api.hotel.getAll()).data
    },
    handleSelect(value: Hotel) {
      if (value == this.selected) {
        this.selected = {
          id: '',
          nome: '',
          cidade: '',
          estado: '',
          cnpj: '',
          pais: '',
        }
        return
      }
      this.selected = value
    }
  }
})

</script>
  
<style>
@media (min-width: 1024px) {
  .container {
    min-height: 100vh;
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
  