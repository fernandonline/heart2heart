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

.form-group input {
  width: 100%;
  min-height: 2.8rem;
  padding: 0.65rem 0.75rem;
  border: 1px solid #ced4da;
  border-radius: 0.55rem;
  background: white;
  color: #212529;
  font: inherit;
}

.form-group input:focus {
  border-color: var(--fuchsia-red);
  outline: 3px solid rgba(245, 47, 87, 0.15);
}

.btn-proximo {
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

.btn-proximo:hover:not(:disabled) {
  background: #d91f48;
}

.btn-proximo:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}
</style>