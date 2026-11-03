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
      <div class="container mt-5">
        <div v-if="loading" class="text-center">
          Carregando...
        </div>
    
        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        
        <div v-else class="card">
          <img
            v-if="card.imageUrl"
            :src="card.imageUrl"
            class="card-img-top"
            :alt="`Imagem do card: ${card.title}`"
          >
          <div class="card-body">
            <h1 class="card-title">{{ card.title }}</h1>
            <p class="card-text lead">{{ card.message }}</p> 
          </div>
        </div>
      </div>
    </ui-background-grid>
  </client-only>
</template>

<style scoped>
.card-img-top {
  width: 100%;
  object-fit: cover;
  border-radius: 8px;
}

/* http://localhost:3000/card/b6pbkkvdl */

header {
  display: none;
}
</style>