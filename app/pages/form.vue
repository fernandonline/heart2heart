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
    
    // Avança
    etapaAtual.value++
    
    // Se chegou no fim, processa tudo
    if (etapaAtual.value >= etapas.length) {
        processarTudo()
    }
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
        etapaAtual.value = 0 
    } finally {
      processando.value = false
    }
}
</script>

<template>
  <div class="form-container">
    <!-- ============ PROGRESSO ============ -->
    <div class="progress-bar">
      <div 
        v-for="(titulo, index) in titulosEtapas" 
        :key="index"
        class="step"
        :class="{ 
          active: index === etapaAtual, 
          completed: index < etapaAtual 
        }"
      >
        <div class="step-number">{{ index + 1 }}</div>
        <div class="step-title">{{ titulo }}</div>
      </div>
    </div>

    <div v-if="erro" class="error-box">
      {{ erro }}
    </div>

    <div v-if="!processando">
      <component 
        :is="etapas[etapaAtual]" 
        :dados-iniciais="dadosCompletos"
        @proximo="irParaProximaEtapa"
      />
      
      <button 
        v-if="etapaAtual > 0"
        @click="voltarEtapa"
        class="btn-voltar"
      >
        ← Voltar
      </button>
    </div>

    <div v-else class="processing">
      <p>Processando seu card...</p>
      <p>Aguarde, estamos enviando a imagem e salvando os dados.</p>
    </div>
  </div>
</template>

<style scoped>
.form-container {
  width: min(calc(100% - 2rem), 760px);
  margin: 0 auto;
  padding: 2rem 0;
}
</style>