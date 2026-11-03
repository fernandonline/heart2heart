<script setup lang="ts">
import FormImage from '@/components/formImage.vue'
import FormTitle from '@/components/FormTitle.vue'
import FormMessage from '@/components/formMessage.vue'

const { loggedIn } = useUserSession()
if (!loggedIn.value) {
    navigateTo('/')
}

const config = useRuntimeConfig()
const etapaAtual = ref(0)
const etapas = [FormImage, FormTitle, FormMessage]
const titulosEtapas = ['Escolha a imagem', 'Dados do card', 'Sua mensagem']

interface DadosDoCard {
    imageFile: File | null
    title: string
    date: string
    message: string
}

type DadosDaEtapa =
    | { imageFile: File }
    | { title: string; date: string }
    | { message: string }

const dadosCompletos = ref<DadosDoCard>({
    imageFile: null,
    title: '',
    date: '',
    message: ''
})

const processando = ref(false)
const erro = ref('')

function irParaProximaEtapa(dadosDaEtapa: DadosDaEtapa) {
    // Salva os dados dessa etapa
    Object.assign(dadosCompletos.value, dadosDaEtapa)
    
    console.log(`✅ Etapa ${etapaAtual.value + 1} concluída:`, dadosDaEtapa)

    if (etapaAtual.value === etapas.length - 1) {
        processarTudo()
        return
    }

    etapaAtual.value++
}

function voltarEtapa() {
    if (etapaAtual.value > 0) {
        etapaAtual.value--
    }
}

async function uploadImage(file: File): Promise<string> {
    console.log('Fazendo upload da imagem...')
    
    const cloudName = config.public.cloudnaryName
    const uploadPreset = config.public.uploadPreset
    
    const formDataUpload = new FormData()
    formDataUpload.append('file', file)
    formDataUpload.append('upload_preset', uploadPreset)

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
            method: 'POST',
            body: formDataUpload
        }
    )

    if (!response.ok) {
        throw new Error('Falha no upload da imagem')
    }

    const data = await response.json()
    console.log('Upload concluído!')
    
    return data.secure_url
}

// ========================================
// PROCESSA TUDO: UPLOAD + SALVAR
// ========================================
async function processarTudo() {
    processando.value = true
    erro.value = ''

    try {
        const imageFile = dadosCompletos.value.imageFile
        if (!imageFile) {
            throw new Error('Selecione uma imagem para continuar.')
        }

        const imageUrl = await uploadImage(imageFile)
        await $fetch('/api/cards/create', {
            method: 'POST',
            body: {
                imageUrl,
                title: dadosCompletos.value.title,
                date: dadosCompletos.value.date,
                message: dadosCompletos.value.message
            }
        })
        alert('Card criado com sucesso!')
        navigateTo('/dashboard')
    } catch (error: unknown) {
        console.error('Erro:', error)
        erro.value = error instanceof Error ? error.message : 'Erro ao criar card'
        alert(erro.value)
    } finally {
      processando.value = false
    }
}
</script>

<template>
  <main class="form-page">
    <section class="form-container" aria-labelledby="form-heading">
      <header class="form-heading">
        <h1 id="form-heading">Crie seu card</h1>
        <p>Preencha as três etapas para preparar uma surpresa especial.</p>
      </header>

      <ol class="wizard-progress" aria-label="Progresso do formulário">
        <li
          v-for="(titulo, index) in titulosEtapas"
          :key="titulo"
          class="wizard-step"
          :class="{
            'wizard-step--active': index === etapaAtual,
            'wizard-step--completed': index < etapaAtual
          }"
          :aria-current="index === etapaAtual ? 'step' : undefined"
        >
          <span class="wizard-step-bar" aria-hidden="true"></span>
          <span class="wizard-step-label">
            <span class="wizard-step-number">0{{ index + 1 }}</span>
            <span class="wizard-step-title">{{ titulo }}</span>
          </span>
        </li>
      </ol>

      <div v-if="erro" class="form-error" role="alert">
        {{ erro }}
      </div>

      <div v-if="!processando" class="wizard-content" aria-live="polite">
        <component
          :is="etapas[etapaAtual]"
          :dados-iniciais="dadosCompletos"
          @proximo="irParaProximaEtapa"
        />

        <button
          v-if="etapaAtual > 0"
          type="button"
          @click="voltarEtapa"
          class="btn-voltar"
        >
          ← Voltar
        </button>
      </div>

      <div v-else class="processing" role="status" aria-live="polite">
        <span class="processing-spinner" aria-hidden="true"></span>
        <h2>Processando seu card...</h2>
        <p>Estamos enviando a imagem e salvando os dados. Aguarde um instante.</p>
      </div>
    </section>
  </main>
</template>

<style scoped>
.form-page {
  min-height: calc(100vh - 4.5rem);
  padding: clamp(1.5rem, 5vw, 4rem) 1rem;
  background: #fceded;
}

.form-container {
  width: min(100%, 760px);
  margin: 0 auto;
  padding: clamp(1.25rem, 4vw, 2.5rem);
  border: 1px solid rgba(140, 0, 29, 0.08);
  border-radius: 1.25rem;
  background: white;
  box-shadow: 0 1rem 2.5rem rgba(80, 0, 20, 0.1);
}

.form-heading {
  margin-bottom: 2rem;
  text-align: center;
}

.form-heading h1 {
  margin-bottom: 0.5rem;
  color: #212529;
  font-size: clamp(1.5rem, 4vw, 2rem);
}

.form-heading p {
  color: #6c757d;
  line-height: 1.5;
}

.wizard-progress {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.75rem;
  margin: 0 0 2rem;
  padding: 0;
  list-style: none;
}

.wizard-step {
  min-width: 0;
}

.wizard-step-bar {
  display: block;
  height: 0.4rem;
  margin-bottom: 0.65rem;
  border-radius: 99px;
  background: #e9ecef;
  transition: background-color 200ms ease;
}

.wizard-step--active .wizard-step-bar,
.wizard-step--completed .wizard-step-bar {
  background: var(--fuchsia-red);
}

.wizard-step-label {
  display: flex;
  align-items: baseline;
  gap: 0.4rem;
  color: #6c757d;
  font-size: 0.875rem;
}

.wizard-step--active .wizard-step-label,
.wizard-step--completed .wizard-step-label {
  color: var(--ruby-red);
}

.wizard-step-number {
  flex: 0 0 auto;
  font-weight: 700;
}

.wizard-step-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.form-error {
  margin-bottom: 1rem;
  padding: 0.85rem 1rem;
  border-radius: 0.6rem;
  background: #f8d7da;
  color: #842029;
}

.wizard-content {
  min-width: 0;
}

.btn-voltar {
  margin-top: 1rem;
  padding: 0.65rem 1rem;
  border: 1px solid #ced4da;
  border-radius: 0.6rem;
  background: white;
  color: #495057;
  font: inherit;
  cursor: pointer;
  transition: background-color 150ms ease, border-color 150ms ease;
}

.btn-voltar:hover {
  border-color: var(--ruby-red);
  background: #fff5f6;
}

.processing {
  display: grid;
  justify-items: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  text-align: center;
}

.processing h2 {
  color: #212529;
  font-size: 1.25rem;
}

.processing p {
  max-width: 28rem;
  color: #6c757d;
  line-height: 1.5;
}

.processing-spinner {
  width: 2.25rem;
  height: 2.25rem;
  border: 3px solid #f8cbd3;
  border-top-color: var(--ruby-red);
  border-radius: 50%;
  animation: spin 750ms linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 480px) {
  .wizard-progress {
    gap: 0.4rem;
  }

  .wizard-step-label {
    gap: 0.25rem;
    font-size: 0.72rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .wizard-step-bar,
  .btn-voltar {
    transition: none;
  }

  .processing-spinner {
    animation-duration: 2s;
  }
}
</style>