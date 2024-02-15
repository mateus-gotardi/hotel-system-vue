<template>
    <div class="hoteis-container">
        <h2>Hoteis cadastrados</h2>
        <div class="search-container">
            <input type="text" class="search-input" placeholder="pesquisar hotel..." v-model="pesquisa" />
        </div>
        <div class="list-container">
            <div v-for="hotel in hotelStore.hoteis" :key="hotel.id">
                <div class="hotel" v-if="pesquisaInclui(hotel)">
                    <div class="hotel-col">
                        <span class="hotel-text">{{ hotel.nome }}</span>
                    </div>
                    <div class="hotel-col">
                        <span class="hotel-text">CNPJ: {{ hotel.cnpj }}</span>
                    </div>
                    <div class="hotel-col">
                        <span class="hotel-text">{{ hotel.pais }}</span>
                        <span class="hotel-text">{{ hotel.estado }}</span>
                        <span class="hotel-text">{{ hotel.cidade }}</span>
                    </div>
                    <div class="hotel-col buttons-container">
                        <button class="hotel-btn" @click="editarHotel(hotel)">
                            Editar
                        </button>
                        <button class="hotel-btn delete-btn" @click="apagarHotel(hotel.id)">
                            Apagar
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <EditarHotelModal v-if="hotelStore.editMode" />
    </div>
</template>
<script lang="ts">
import type { IHotel } from '@/types/hotel';
import { defineComponent } from 'vue';
import { useHotelStore } from '@/stores/hotel';
import EditarHotelModal from '@/components/EditarHotelModal.vue';
import api from '@/api';


export default defineComponent({

    data() {
        const hotelStore = useHotelStore()
        let pesquisa = ''
        return {
            hotelStore,
            pesquisa
        }
    },
    components: {
        EditarHotelModal
    },
    mounted() {
        this.hotelStore.deselectHotel()
        this.hotelStore.fetchHoteis()
    },
    methods: {
        handleSelect(value: IHotel) {
            if (value == this.hotelStore.hotel) {
                this.hotelStore.deselectHotel()
                return
            }
            this.hotelStore.selectHotel(value)
        },
        async apagarHotel(id: string) {
            const response = await api.hotel.deleteHotel(id)
            if (response.data.message == 'hotel excluido com sucesso') {
                await this.hotelStore.fetchHoteis()
            }
        },
        editarHotel(hotel: IHotel) {
            this.hotelStore.selectHotel(hotel)
            this.hotelStore.openEdit()
        },
        pesquisaInclui(hotel: IHotel) {
            if (this.pesquisa.length == 0) {
                return true
            } else {
                if (hotel.nome.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
                    hotel.cnpj.includes(this.pesquisa.toLowerCase()) ||
                    hotel.pais.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
                    hotel.cidade.toLowerCase().includes(this.pesquisa.toLowerCase()) ||
                    hotel.estado.toLowerCase().includes(this.pesquisa.toLowerCase())
                ) {
                    return true
                } else return false
            }
        }
    }
})

</script>
    
<style>
.hoteis-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
    align-items: flex-start;
    justify-content: flex-start;
    width: 90vw;
}

.list-container {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 1rem;
}

.hotel {
    display: flex;
    flex-direction: column;
    background-color: var(--color-background-soft);
    padding: 1rem;
    border-radius: .5rem;
    -webkit-box-shadow: 2px 2px 5px 0px rgba(201, 201, 201, 1);
    -moz-box-shadow: 2px 2px 5px 0px rgba(201, 201, 201, 1);
    box-shadow: 2px 2px 5px 0px rgba(201, 201, 201, 1);
}

.hotel-col {
    display: flex;
    flex-direction: row;
    gap: .5rem;
}

.buttons-container {
    margin-top: 1rem
}

@media (max-width: 1024px) {
    .list-container {
        flex-direction: column;
    }
}
</style>
    