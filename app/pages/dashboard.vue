<script setup>
import Button from '~/components/ui/Button.vue'

const { loggedIn } = useUserSession()
if (!loggedIn.value) {
  navigateTo('/')
}

function copiarLink(url) {
  navigator.clipboard.writeText(url)
  alert('Link copiado!')
}

const cards = ref([])
const carregando = ref(true)
const erro = ref('')
const deleting = ref(null)

async function loadingCards() {
  carregando.value = true;
  erro.value = '';

  try {
    cards.value = await $fetch('/api/cards/mycard')
  } catch (error) {
    erro.value = error.data?.message || 'Erro ao carregar cards'
  } finally {
    carregando.value = false
  }
}

async function deleteCard(cardId, cardTitle) {

  if (!confirm(`Tem certeza que deseja deletar "${cardTitle}"?`)) { return }

  deleting.value = cardId

  try {
    await $fetch(`/api/cards/${cardId}`, {
      method: 'DELETE'
    })
    cards.value = cards.value.filter(c => c.id !== cardId)
  }
  catch (error) {
    alert('Houve um erro ao deletar: ' + (error.data?.message || 'Erro desconhecido'))
  }
  finally {
    deleting.value = null
  }
}

onMounted(() => {
  loadingCards()
})
</script>

<template>
  <UiBackgroundGrid>
    <div class="container p-4">
      <div v-if="carregando" class="text-center">
        Carregando...
      </div>

      <div v-else-if="erro" class="alert alert-danger">
        {{ erro }}
      </div>

      <div v-else-if="cards.length === 0" class="alert alert-info">
        <UiMenuDashboard class="mb-4" />
        Você ainda não criou nenhum card!
      </div>

      <div v-else>
        <UiMenuDashboard class="mb-4" />

        <div class="card-container">
          <div v-for="card in cards" :key="card.id" class="mb-3">
            <div class="card">
              <img :src="card.imageUrl" class="card-img-top" :alt="`Imagem do card: ${card.title}`">

              <div class="card-body bg-light">
                <h5 class="card-title">{{ card.title }}</h5>
                <p class="card-text">{{ card.message }}</p>
                <!--adicionar mais tarde: <small class="text-muted">Data: {{ card.date}}</small> -->


                <div class="w-100 d-flex gap-2">
                  <Button style="border-color:var(--ruby-red);" class="w-100">
                    <a class="ruby-red" :href="card.url" target="_blank">Ver card </a>
                  </Button>

                  <Button style="border-color:var(--ruby-red);" class="w-100">
                    <a class="ruby-red" :href="card.url" target="_blank">QR code </a>
                  </Button>


                  <div class="dropdown w-25 d-flex justify-content-center">
                    <Button style="border-color:var(--ruby-red);">
                      <span class="drop-btn d-flex" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown"
                        aria-expanded="false">

                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>

                      </span>

                      <ul class="dropdown-menu" aria-labelledby="dropdownMenuLink">
                        <a class="dropdown-item" @click="copiarLink(card.url)"> Copiar link</a>
                        <a class="dropdown-item" @click="deleteCard(card.id, card.title)"
                          :disabled="deleting === card.id">
                          Remover
                        </a>
                      </ul>
                    </Button>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </UiBackgroundGrid>
</template>

<style scoped>
.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.card {
  border-radius: var(--radius-card);
  border: none;
  overflow: hidden;
  background-color: transparent;
  min-height: 340px;
}

.card-img-top {
  aspect-ratio: 18/9;
  object-fit: cover;
  object-position: top;
}

.card-text {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.drop-btn {
  cursor: pointer;

}

.dot {
  width: 3px;
  height: 3px;
  background-color: var(--ruby-red);
  border-radius: 50%;
  margin: 0 2px;
}

.dropdown-item {
  cursor: pointer;
}

.dropdown-item:hover {
  background: rgba(0, 0, 0, 0.2);
}

@media only screen and (min-width: 998px) {
  .card-container {
    grid-template-columns: repeat(3, 1fr);
  }

  .card-text {
    -webkit-line-clamp: 3;
  }
}
</style>