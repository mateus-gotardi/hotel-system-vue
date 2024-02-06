<template>
  <div class="about">
    <h1>Dados do usuário</h1>
    <h2>e-mail: {{ account.data.session.user.email }}</h2>
    <h2>nome: {{ account.data.session.user.user_metadata.name }}</h2>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { supabase } from '../clients/supabase'

const account = ref()
getSession()

async function getSession() {
  account.value = await supabase.auth.getSession()
}

</script>
<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
}
</style>
