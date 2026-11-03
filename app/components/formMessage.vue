<script setup lang="ts">
const emit = defineEmits<{
  proximo: [payload: { message: string }]
}>()

const props = defineProps<{
  dadosIniciais?: {
    message?: string
  }
}>()

const message = ref(props.dadosIniciais?.message || '')

function enviar() {
    emit('proximo', { message: message.value })
}
</script>

<template>
  <div class="form-step">
    <h2>Sua mensagem</h2>

    <div class="form-group">
      <label for="message">Mensagem</label>
      <textarea 
        id="message"
        v-model="message" 
        placeholder="Digite sua mensagem..."
        rows="8"
        required="true"

      />
      <small>Dica: Cada linha será uma quebra na exibição</small>
    </div>

    <button 
      @click="enviar" 
      :disabled="!message.trim()"
      class="btn-finalizar"
    >
      Finalizar
    </button>
  </div>
</template>