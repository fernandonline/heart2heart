<template>
    <button class="base-button">
        <slot></slot>
    </button>
</template>

<style scoped>
.base-button {
  cursor: pointer;
  color: white;
  overflow: hidden;
}

.base-button:hover {
    background: white;
    color: black;
}
</style>