<script setup lang="ts">
const route =useRoute()
const card = ref()
const loading = ref(true)
const error = ref('')

definePageMeta({
  layout: 'custom',
})

onMounted(async () => {
    try
    {
      const publicId = route.params.publicId;
      const response: any = await $fetch(`/api/cards/${publicId}`)
      card.value = response
    }
    catch (err: any)
    {
      error.value = err.data?.message || 'Card não encontrado';
      console.error(err);
    }
    finally
    {
      loading.value = false;
    }
})
</script>

<template>
  <client-only>
    <ui-background-grid>
      <main class="public-card-page">
        <div v-if="loading" class="public-card-status">
          Carregando...
        </div>
    
        <div v-else-if="error" class="public-card-status public-card-status--error">
          {{ error }}
        </div>
        
        <article v-else class="public-card">
          <img
            v-if="card.imageUrl"
            :src="card.imageUrl"
            class="public-card-image"
            :alt="`Imagem do card: ${card.title}`"
          >
          <div class="public-card-content">
            <h1 class="public-card-title">{{ card.title }}</h1>
            <p class="public-card-message">{{ card.message }}</p>
          </div>
        </article>
      </main>
    </ui-background-grid>
  </client-only>
</template>

<style scoped>
.public-card-page {
  width: min(100% - 2rem, 760px);
  margin: 0 auto;
  padding: 3rem 0;
}

.public-card-status {
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  background: rgba(255, 255, 255, 0.1);
  text-align: center;
}

.public-card-status--error {
  background: #f8d7da;
  color: #842029;
}

.public-card {
  width: 100%;
  overflow: hidden;
  border-radius: 1rem;
  background: #f8f9fa;
  color: #212529;
  box-shadow: 0 0.75rem 2rem rgba(0, 0, 0, 0.25);
}

.public-card-image {
  display: block;
  width: 100%;
  max-width: 100%;
  height: clamp(12rem, 45vh, 30rem);
  object-fit: cover;
  object-position: center;
}

.public-card-content {
  padding: clamp(1.25rem, 4vw, 2rem);
}

.public-card-title {
  margin-bottom: 0.75rem;
  overflow-wrap: anywhere;
}

.public-card-message {
  margin: 0;
  color: #495057;
  font-size: 1.1rem;
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

header {
  display: none;
}
</style>