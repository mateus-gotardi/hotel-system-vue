<template>
    <button class="button">
        <slot></slot>
    </button>
</template>

<style>
@media (min-width: 1024px) {
    .button {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgb(171, 171, 171);
        padding: 15px;
        border-radius: 10px;
    }
}
</style>
  