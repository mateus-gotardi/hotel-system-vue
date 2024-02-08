<template>
    <div class="register">
        <h1>Registrar Hotel</h1>
        <div class="inputContainer">
            <label for="name">Nome</label>
            <input type="text" placeholder="Nome" v-model="nome" />
        </div>
        <div class="inputContainer">
            <label for="cnpj">CNPJ</label>
            <input type="cnpj" placeholder="cnpj" v-model="cnpj" />
        </div>
        <div class="inputContainer">
            <label for="pais">Pais</label>
            <input type="text" placeholder="Pais" v-model="pais" />
        </div>
        <div class="inputContainer">
            <label for="estado">Estado</label>
            <input type="text" placeholder="Estado" v-model="estado" />
        </div>
        <div class="inputContainer">
            <label for="pais">Cidade</label>
            <input type="text" placeholder="Cidade" v-model="cidade" />
        </div>
        <div class="buttonContainer">
            <button @click="registerHotel">Registrar</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '../api'

let cnpj = ref('')
let pais = ref('')
let estado = ref('')
let cidade = ref('')
let nome = ref('')

async function registerHotel() {
    const hotel = await api.hotel.create({
        nome: nome.value,
        cnpj: cnpj.value,
        cidade: cidade.value,
        estado: estado.value,
        pais: pais.value,
    })
    console.log(hotel)
}

</script>
  
<style>
@media (min-width: 1024px) {
    .register {
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
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
  