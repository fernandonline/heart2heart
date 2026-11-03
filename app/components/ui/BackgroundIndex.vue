<template>
    <section class="background-index">
        <slot />

        <div class="decorative-circle circle-1"></div>
        <div class="decorative-circle circle-2"></div>
        <div class="background-orb orb-1"></div>
        <div class="background-orb orb-2"></div>
    </section>
</template>

<style scoped>
.background-index {
  position: relative;
  display: flex;
  width: 100%;
  min-height: 100vh;
  align-items: center;
  padding: 1.5rem;
  overflow: hidden;
}

.decorative-circle {
  position: absolute;
  border-radius: 50%;
  filter: blur(20px);
  opacity: 0.4;
  animation: float 6s ease-in-out infinite;
}

.circle-1 {
  width: 100px;
  height: 100px;
  background: linear-gradient(90deg, #720026, #f72585);
  bottom: -3rem;
  left: -3rem;
}

.circle-2 {
  width: 80px;
  height: 80px;
  background: linear-gradient(90deg, #f72585, #720026);
  top: -3rem;
  right: 1rem;
}

.background-orb {
  position: absolute;
  width: 24rem;
  height: 24rem;
  background: linear-gradient(90deg, #f72585, #720026);
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.3;
  z-index: 0;
  animation: orbGlow 6s ease-in-out infinite;
}

.orb-1 {
  top: -8rem;
  left: -8rem;
}

.orb-2 {
  bottom: -8rem;
  right: -8rem;
  animation-delay: 1s;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

@keyframes orbGlow {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 0.6; }
}
</style>
