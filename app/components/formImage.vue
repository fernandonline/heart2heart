<script setup lang="ts">
const emit = defineEmits<{
    proximo: [payload: {imageFile: File}]
}>()

const props = defineProps<{
  dadosIniciais?: {
    imageFile?: File | null
  }
}>()

const imageFile = ref<File | null>(props.dadosIniciais?.imageFile || null)
const previewUrl = ref('')

function handleFileSelect(e: Event) {
    const target = e.target as HTMLInputElement
    const file = target.files?.[0]
    
    if (file) {
        if (previewUrl.value) {
            URL.revokeObjectURL(previewUrl.value)
        }
        imageFile.value = file
        previewUrl.value = URL.createObjectURL(file)  
        console.log('Arquivo selecionado:', file.name)
    }
}

onMounted(() => {
    if (imageFile.value) {
        previewUrl.value = URL.createObjectURL(imageFile.value)
    }
})

onBeforeUnmount(() => {
    if (previewUrl.value) {
        URL.revokeObjectURL(previewUrl.value)
    }
})

function enviar() {
    if (imageFile.value) {
        emit('proximo', { imageFile: imageFile.value })
    }
}
</script>

<template>
  <div class="form-step">
    <h2>Escolha uma imagem</h2>
    
    <input 
      type="file" 
      @change="handleFileSelect" 
      accept="image/*"
      required="true"
    />

    <div v-if="previewUrl" class="preview">
      <img :src="previewUrl" alt="Pré-visualização da imagem selecionada" />
      <p>Imagem selecionada: {{ imageFile?.name }}</p>
    </div>

    <button 
      @click="enviar" 
      :disabled="!imageFile"
      class="btn-proximo"
    >
      Próximo →
    </button>
  </div>
</template>

<style scoped>
.form-step {
  display: grid;
  gap: 1rem;
}

.form-step h2 {
  color: #212529;
  font-size: 1.25rem;
}

.form-step input[type="file"] {
  width: 100%;
  padding: 0.8rem;
  border: 1px dashed #d49aa5;
  border-radius: 0.65rem;
  background: #fff8f9;
  color: #495057;
}

.preview {
  display: grid;
  justify-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 0.75rem;
  background: #f8f9fa;
  color: #6c757d;
  text-align: center;
}

.preview img {
  display: block;
  max-width: 100%;
  max-height: 18rem;
  border-radius: 0.5rem;
  object-fit: contain;
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