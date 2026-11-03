<script setup lang="ts">
const emit = defineEmits<{
  proximo: [payload: { title: string; date: string }]
}>()

const props = defineProps<{
  dadosIniciais?: {
    title?: string
    date?: string
  }
}>()

const title = ref(props.dadosIniciais?.title || '')
const date = ref(props.dadosIniciais?.date || '')

function enviar() {
    emit('proximo', { 
        title: title.value, 
        date: date.value 
    })
}
</script>

<template>
  <div class="form-step">
    <h2>Dados do card</h2>

    <div class="form-group">
      <label for="title">Título *</label>
      <input 
        id="title"
        v-model="title" 
        type="text"
        placeholder="ex: João e Maria"
        required
      />
    </div>

    <div class="form-group">
      <label for="date">Data *</label>
      <input 
        id="date"
        v-model="date" 
        type="date"
        required
      />
    </div>

    <button 
      @click="enviar" 
      :disabled="!title.trim() || !date"
      class="btn-proximo"
    >
      Próximo →
    </button>
  </div>
</template>