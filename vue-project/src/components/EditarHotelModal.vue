<template>
    <div class="modal-container">
        <div class="modal">
            <div class="modal-header">
                <h2>Editar Hotel</h2>
                <button @click="() => {
                    hotelStore.closeEdit()
                    hotelStore.fetchHoteis()
                }">X</button>
            </div>
            <div class="modal-form">
                <h1>Registrar Hotel</h1>
                <div class="inputContainer">
                    <label for="name">Nome do Hotel</label>
                    <input required type="text" placeholder="Nome" id="name" v-model="hotelStore.hotel.nome" />
                </div>
                <div class="inputContainer">
                    <label for="cnpj">CNPJ</label>
                    <input required type="cnpj" placeholder="cnpj" id="cnpj" v-model="hotelStore.hotel.cnpj" />
                </div>
                <div class="inputContainer">
                    <label for="pais">Pais</label>
                    <input required type="text" placeholder="Pais" id="pais" v-model="hotelStore.hotel.pais" />
                </div>
                <div class="inputContainer">
                    <label for="estado">Estado</label>
                    <input required type="text" placeholder="Estado" id="estado" v-model="hotelStore.hotel.estado" />
                </div>
                <div class="inputContainer">
                    <label for="cidade">Cidade</label>
                    <input required type="text" placeholder="Cidade" id="cidade" v-model="hotelStore.hotel.cidade" />
                </div>
                <div class="buttonContainer">
                    <p class="error" v-if="error !== ''">{{ error }}</p>
                    <button @click="editHotel">Salvar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import api from '../api'
import { useHotelStore } from '@/stores/hotel';
import { validarCNPJ } from '../utils'

const hotelStore = useHotelStore()
let error = ref('')

async function editHotel() {
    if (!validarCNPJ(hotelStore.hotel.cnpj)) {
        error.value = 'CNPJ inválido'
        return
    }
    try {
        const response = await api.hotel.update({
            nome: hotelStore.hotel.nome,
            cnpj: hotelStore.hotel.cnpj,
            cidade: hotelStore.hotel.cidade,
            estado: hotelStore.hotel.estado,
            pais: hotelStore.hotel.pais,
            id: hotelStore.hotel.id,
        })
        if (response.data.message === 'hotel editado com sucesso') {
            hotelStore.fetchHoteis()
            hotelStore.closeEdit()
            hotelStore.deselectHotel()
        }
    } catch (e: any) {
        if (e.response.data.message == 'duplicate key value violates unique constraint "tb_hotel_cnpj_key"') {
            error.value = 'CNPJ ja cadastrado'
        } else {
            error.value = e.response.data.message
        }
    }

}

</script>

<style>
.error {
    color: red;
    padding: 0;
    margin: 0;
}

.modal-form {
    width: 100%
}

.modal-container {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.7);
}

@media (min-width: 1024px) {
    .modal {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        top: 5rem;
        right: 5rem;
        background-color: var(--color-background-soft);
        padding: 1rem 2rem;
        border-radius: 1rem;
        width: 30%;
    }

    .inputContainer {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        width: 100%;
    }

    .buttonContainer {
        display: flex;
        flex-direction: column;
        gap: 0.2rem;
        padding-top: .5rem;
    }

    .modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }
}
</style>
  