<script setup>
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
    <div class="dashboard-container">
      <UiMenuDashboard class="dashboard-menu" />

      <div v-if="carregando" class="dashboard-status">
        Carregando...
      </div>

      <div v-else-if="erro" class="dashboard-status dashboard-status--error">
        {{ erro }}
      </div>

      <div v-else-if="cards.length === 0" class="dashboard-status dashboard-status--info">
        Você ainda não criou nenhum card!
      </div>

      <div v-else>

        <div class="card-container">
          <div v-for="card in cards" :key="card.id">
            <article class="dashboard-card">
              <img :src="card.imageUrl" class="dashboard-card-image" :alt="`Imagem do card: ${card.title}`">

              <div class="dashboard-card-content">
                <h2 class="dashboard-card-title">{{ card.title }}</h2>
                <p class="dashboard-card-message">{{ card.message }}</p>

                <div class="dashboard-card-actions">
                  <a class="dashboard-card-link" :href="card.url" target="_blank" rel="noopener noreferrer">
                    Ver card
                  </a>
                  <a class="dashboard-card-link" :href="card.url" target="_blank" rel="noopener noreferrer">
                    QR code
                  </a>
                  <details class="dashboard-card-menu">
                    <summary class="dashboard-card-menu-toggle" aria-label="Mais opções">
                      <span class="dashboard-card-dots" aria-hidden="true">
                        <span class="dot"></span>
                        <span class="dot"></span>
                        <span class="dot"></span>
                      </span>
                    </summary>
                    <div class="dashboard-card-menu-items">
                      <button type="button" class="dashboard-card-menu-item" @click="copiarLink(card.url)">
                        Copiar link
                      </button>
                      <button
                        type="button"
                        class="dashboard-card-menu-item"
                        :disabled="deleting === card.id"
                        @click="deleteCard(card.id, card.title)"
                      >
                        Remover
                      </button>
                    </div>
                  </details>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </div>
  </UiBackgroundGrid>
</template>

<style scoped>
.dashboard-container {
  width: min(100% - 2rem, 1200px);
  margin: 0 auto;
  padding: 2rem 0;
}

.dashboard-menu {
  margin-bottom: 1.5rem;
}

.dashboard-status {
  padding: 1rem 1.25rem;
  border-radius: 0.75rem;
  text-align: center;
  background: #f1f3f5;
  color: #343a40;
}

.dashboard-status--error {
  background: #f8d7da;
  color: #842029;
}

.dashboard-status--info {
  background: #cff4fc;
  color: #055160;
}

.card-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.dashboard-card {
  height: 100%;
  border-radius: 0.75rem;
  overflow: hidden;
  box-shadow: 0 0.5rem 1.25rem rgba(0, 0, 0, 0.12);
}

.dashboard-card-image {
  display: block;
  width: 100%;
  max-width: 100%;
  height: 180px;
  object-fit: cover;
  object-position: top;
}

.dashboard-card-content {
  display: flex;
  min-height: 190px;
  flex-direction: column;
  padding: 1rem;
  background: #f8f9fa;
}

.dashboard-card-title {
  margin-bottom: 0.5rem;
  color: #212529;
  font-size: 1.15rem;
}

.dashboard-card-message {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 1rem;
  color: #495057;
  line-height: 1.5;
}

.dashboard-card-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: auto;
}

.dashboard-card-link,
.dashboard-card-menu-toggle {
  display: inline-flex;
  min-height: 2.5rem;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--ruby-red);
  border-radius: 0.5rem;
  background: white;
  color: var(--ruby-red);
  text-decoration: none;
  cursor: pointer;
}

.dashboard-card-link {
  flex: 1;
  padding: 0.5rem;
  font-size: 0.9rem;
}

.dashboard-card-link:hover,
.dashboard-card-menu-toggle:hover {
  background: var(--ruby-red);
  color: white;
}

.dashboard-card-menu {
  position: relative;
}

.dashboard-card-menu-toggle {
  width: 2.5rem;
  list-style: none;
}

.dashboard-card-menu-toggle::-webkit-details-marker {
  display: none;
}

.dashboard-card-dots {
  display: flex;
  align-items: center;
}

.dot {
  width: 3px;
  height: 3px;
  margin: 0 2px;
  border-radius: 50%;
  background: currentColor;
}

.dashboard-card-menu-items {
  position: absolute;
  z-index: 1;
  right: 0;
  bottom: calc(100% + 0.4rem);
  min-width: 9rem;
  padding: 0.35rem;
  border: 1px solid #dee2e6;
  border-radius: 0.5rem;
  background: white;
  box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.15);
}

.dashboard-card-menu-item {
  display: block;
  width: 100%;
  padding: 0.55rem 0.65rem;
  border: 0;
  border-radius: 0.3rem;
  background: transparent;
  color: #212529;
  text-align: left;
  cursor: pointer;
}

.dashboard-card-menu-item:hover:not(:disabled) {
  background: #f1f3f5;
}

.dashboard-card-menu-item:disabled {
  cursor: wait;
  opacity: 0.6;
}

@media (min-width: 998px) {
  .card-container {
    grid-template-columns: repeat(3, 1fr);
  }

  .dashboard-card-message {
    -webkit-line-clamp: 3;
  }
}
</style>