<template>
    <div class="register">
        <h1>Registrar usuário</h1>
        <div class="inputContainer">
            <label for="name">Nome</label>
            <input type="text" placeholder="Nome" v-model="name" />
        </div>
        <div class="inputContainer">
            <label for="email">Email</label>
            <input type="email" placeholder="Email" v-model="email" />
        </div>
        <div class="inputContainer">
            <label for="password">Senha</label>
            <input type="password" placeholder="Senha" v-model="password" />
        </div>
        <div class="inputContainer">
            <label for="confirmPassword">Confirmar senha</label>
            <input type="password" placeholder="Confirmar senha" v-model="confirmPassword" />
        </div>
        <div class="buttonContainer">
            <button @click="registerUser">Registrar</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../clients/supabase'

let email = ref('')
let password = ref('')
let confirmPassword = ref('')
let name = ref('')

async function registerUser() {
    if (password.value !== confirmPassword.value) {
        console.log('As senhas não coincidem')
        return
    }
    const { data, error } = await supabase.auth.signUp({
        email: email.value,
        password: password.value,
        options: {
            data: { name: name.value }
        }
    })
    if (error) {
        console.log(error)
    } else {
        console.log(data)
    }
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
  