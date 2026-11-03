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

<style scoped>
.form-step {
  display: grid;
  gap: 1.25rem;
}

.form-step h2 {
  color: #212529;
  font-size: 1.25rem;
}

.form-group {
  display: grid;
  gap: 0.5rem;
}

.form-group label {
  color: #343a40;
  font-weight: 600;
}

.form-group textarea {
  width: 100%;
  min-height: 12rem;
  padding: 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.55rem;
  background: white;
  color: #212529;
  font: inherit;
  line-height: 1.5;
  resize: vertical;
}

.form-group textarea:focus {
  border-color: var(--fuchsia-red);
  outline: 3px solid rgba(245, 47, 87, 0.15);
}

.form-group small {
  color: #6c757d;
  line-height: 1.4;
}

.btn-finalizar {
  justify-self: end;
  padding: 0.7rem 1.25rem;
  border: 0;
  border-radius: 0.6rem;
  background: var(--fuchsia-red);
  color: white;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 150ms ease, opacity 150ms ease;
}

.btn-finalizar:hover:not(:disabled) {
  background: #d91f48;
}

.btn-finalizar:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>