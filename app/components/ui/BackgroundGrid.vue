<style scoped>
  .grid-wrapper {
    min-height: 100vh;
    width: 100%;
    position: relative;
    background: var(--bg);
    color: var(--white);
  }

  .grid-background {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(to right, #FFFFFF08, transparent 1px),
      linear-gradient(to bottom, #FFFFFF08, transparent 1px);
    background-size: 20px 30px;
    pointer-events: none;
  }

  .grid-content {
    position: relative;
    z-index: 1;
    min-height: 100vh;
  }
</style>

<template>
  <div class="grid-wrapper">
    <div class="grid-background" aria-hidden="true"></div>
    <div class="grid-content">
      <slot/>
    </div>
  </div>
</template>
