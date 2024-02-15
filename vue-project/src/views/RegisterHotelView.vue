<template>
    <div class="register">
        <div class="form-container">
            <h1>Registrar Hotel</h1>
            <div class="inputContainer">
                <label for="name">Nome do Hotel</label>
                <input required type="text" placeholder="Nome" id="name" v-model="nome" />
            </div>
            <div class="inputContainer">
                <label for="cnpj">CNPJ</label>
                <input required type="cnpj" placeholder="cnpj" id="cnpj" v-model="cnpj" />
            </div>
            <div class="inputContainer">
                <label for="pais">Pais</label>
                <input required type="text" placeholder="Pais" id="pais" v-model="pais" />
            </div>
            <div class="inputContainer">
                <label for="estado">Estado</label>
                <input required type="text" placeholder="Estado" id="estado" v-model="estado" />
            </div>
            <div class="inputContainer">
                <label for="cidade">Cidade</label>
                <input required type="text" placeholder="Cidade" id="cidade" v-model="cidade" />
            </div>
            <p class="error" v-if="error !== ''">{{ error }}</p>
            <div class="buttonContainer">
                <button @click="registerHotel">Registrar</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '../api'
import { validarCNPJ } from '@/utils';

let error = ref('')

let cnpj = ref('')
let pais = ref('')
let estado = ref('')
let cidade = ref('')
let nome = ref('')

async function registerHotel() {
    if (!validarCNPJ(cnpj.value)) {
        error.value = 'CNPJ inválido';
        return
    }
    if (cnpj.value == '' || pais.value == '' || estado.value == '' || cidade.value == '' || nome.value == '') {
        error.value = 'Todos os campos são obrigatórios';
        return
    }
    try {
        const hotel = await api.hotel.create({
            nome: nome.value,
            cnpj: cnpj.value,
            cidade: cidade.value,
            estado: estado.value,
            pais: pais.value,
        })
        if (hotel.status == 200) {
            console.log(hotel.data)
        }
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

.register {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    width: 90vw;
    padding: 2rem;
}

.form-container {
    width: 40%;
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
    margin-top: 1rem;
}

@media (max-width:720px) {
    .form-container {
        width: 100%;
    }
}
</style>
  