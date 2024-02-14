<template>
    <button :class="`button ${selecionado ? 'selecionado' : ''}`">
        <slot></slot>
    </button>
</template>

<script>
export default {
    props: ['selecionado']
};
</script>
<style>
@media (min-width: 1024px) {
    .button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgb(171, 171, 171);
        padding: .5rem 1rem;
        border-radius: 10px;
        border: none
    }

    .button:hover {
        opacity: 0.8;
    }

    .selecionado {
        background-color: hsla(160, 100%, 37%, 1);
    }
}
</style>
  