<template>
    <button class="btn-romantic">
        <slot></slot>
    </button>
</template>

<style scoped>
.btn-romantic {
  color: var(--white);
  background-color: var(--fuchsia-red);
  border: none;
  overflow: hidden;
  position: relative;
  transition: color 0.3s ease;
  cursor: pointer;
  padding: .5em 1em;
  font-size: 1em;
  font-weight: 600;
  border-radius: var(--b-radius);
}

.btn-romantic:hover {
  color: var(--white);
  background-color: #f7234a;
}

</style>