<template>
    <div class="register">
        <h1>Login</h1>
        <div class="inputContainer">
            <label for="email">Email</label>
            <input type="email" placeholder="Email" v-model="email" />
        </div>
        <div class="inputContainer">
            <label for="password">Senha</label>
            <input type="password" placeholder="Senha" v-model="password" />
        </div>
        <div class="buttonContainer">
            <button @click="login">Login</button>
            <button @click="showUserInfo">Mostrar informações do usuário</button>
            <button @click="logout">Logout</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { supabase } from '../clients/supabase'

let email = ref('')
let password = ref('')

async function login() {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
    })
    if (error) {
        console.log(error)
    } else {
        console.log(data)
    }
}
async function showUserInfo() {
    const user = await supabase.auth.getSession()
    console.log(user)
}

async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) {
        console.log(error)
    } else {
        console.log('Usuário deslogado')
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
  