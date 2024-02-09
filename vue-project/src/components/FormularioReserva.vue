<template>
    <div class="modal">
        <div class="modal-header">
            <h2>Criar Reserva</h2>
            <button @click="reservaStore.fecharModal()">X</button>
        </div>
        <div class="inputContainer">
            <label for="numeroreserva">Numero Reserva</label>
            <input required type="text" placeholder="ex: 123" v-model="reservaStore.reserva.numeroreserva" />
        </div>
        <div class="inputContainer">
            <label for="apartamento">Apartamento</label>
            <input required type="text" placeholder="ex: 50" v-model="reservaStore.reserva.apartamento" />
        </div>
        <div class="inputContainer">
            <label for="checkin">Data checkin</label>
            <input required type="date" placeholder="2022-10-01" v-model="reservaStore.reserva.datacheckin" />
        </div>
        <div class="inputContainer">
            <label for="checkout">Data checkout</label>
            <input required type="date" placeholder="2022-10-01" v-model="reservaStore.reserva.datacheckout" />
        </div>
        <div class="inputContainer">
            <label for="status">Status</label>
            <input required type="text" placeholder="ex: 1" v-model="reservaStore.reserva.status" />
        </div>
        <div class="hospedesContainer">
            <p>Hospedes</p>
            <div class="hospede" v-for="(hospede, index) in reservaStore.reserva.hospedes" :key="index">
                <input type="text" placeholder="nome" v-model="hospede.nome">
                <input type="text" placeholder="nome" v-model="hospede.sobrenome">
                <button @click="removerHospede(index)">-</button>
            </div>
            <button @click="criarHospede">+</button>
        </div>
        <p class="error" v-if="error !== ''">{{ error }}</p>
        <div class="buttonContainer">
            <button @click="registerReserva">Criar Reserva</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '../api'
import { useHotelStore } from '@/stores/hotel';
import { useReservaStore } from '@/stores/reserva';
import type { Reserva } from '@/types/reserva';

const hotelStore = useHotelStore()
const reservaStore = useReservaStore()

let error = ref('')


function criarHospede() {
    reservaStore.adicionarHospede()
}
function removerHospede(index: number) {
    reservaStore.removerHospede(index)
}

async function registerReserva() {
    if (reservaStore.reserva.apartamento == '' || reservaStore.reserva.datacheckin == '' || reservaStore.reserva.status == '' || reservaStore.reserva.numeroreserva == '') {
        error.value = 'Todos os campos são obrigatórios';
        return
    } else {
        error.value = ''
    }
    try {
        const reserva = await api.reservas.create({
            apartamento: reservaStore.reserva.apartamento,
            idhotel: hotelStore.hotel.id,
            numeroreserva: reservaStore.reserva.numeroreserva,
            datacheckin: reservaStore.reserva.datacheckin,
            datacheckout: reservaStore.reserva.datacheckout,
            hospedes: reservaStore.reserva.hospedes,
            status: reservaStore.reserva.status
        })
        console.log(reserva)
    } catch (e: any) {
        console.log('erro')
        console.log(e.response.data.message)
        error.value = e.response.data.message
    }
}

</script>

<style>
.error {
    color: red;
    padding: 0;
    margin: 0;
}

@media (min-width: 1024px) {
    .modal {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        position: absolute;
        background-color: var(--color-background-soft);
        padding: 3rem;
        border-radius: 1rem
    }

    .inputContainer {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
    }

    .buttonContainer {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
    }
}
</style>
  