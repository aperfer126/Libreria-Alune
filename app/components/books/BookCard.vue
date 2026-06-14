<template>
  <div class="card h-100 shadow-sm book-card">
    <!-- Botón favorito -->
    <button
      v-if="status === 'authenticated'"
      class="fav-btn"
      :class="{ active: isFav }"
      :title="isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'"
      @click.prevent="toggleFav"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
      </svg>
    </button>

    <NuxtLink :to="`/libro/${book.id}`">
      <img
        :src="book.coverUrl || '/placeholder-book.png'"
        :alt="book.title"
        class="card-img-top book-cover"
        loading="lazy"
      />
    </NuxtLink>
    <div class="card-body d-flex flex-column">
      <span v-if="isRecent" class="badge bg-success mb-1 align-self-start">Novedad</span>
      <h6 class="card-title mb-1 text-truncate" :title="book.title">
        <NuxtLink :to="`/libro/${book.id}`" class="text-decoration-none text-dark">{{ book.title }}</NuxtLink>
      </h6>
      <p class="card-text text-muted small mb-2">{{ book.author }}</p>
      <p class="card-text small text-secondary mb-2">{{ (book.genres ?? []).map((g: any) => g.name).join(', ') }}</p>
      <div class="mt-auto d-flex justify-content-between align-items-center">
        <span class="fw-bold text-primary fs-5">{{ formatPrice(book.price) }}</span>
        <button
          class="btn btn-sm btn-outline-primary"
          :disabled="book.stock === 0"
          @click.prevent="addToCart"
        >
          {{ book.stock === 0 ? 'Agotado' : 'Añadir' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useFavoritesStore } from '~/stores/favorites'

const props = defineProps<{
  book: {
    id: number
    title: string
    author: string
    price: number | string
    coverUrl?: string | null
    stock: number
    createdAt?: string | Date
    genres?: { id: number; name: string }[]
  }
}>()

const isRecent = computed(() => {
  if (!props.book.createdAt) return false
  const diff = Date.now() - new Date(props.book.createdAt).getTime()
  return diff < 30 * 24 * 60 * 60 * 1000
})

const cart = useCartStore()
const favStore = useFavoritesStore()
const { status } = useAuth()
const router = useRouter()
const route = useRoute()
const { show: showToast } = useToast()

const isFav = computed(() => favStore.isFavorite(props.book.id))

watch(status, async (s) => {
  if (s === 'authenticated') await favStore.load()
}, { immediate: true })

function formatPrice(price: number | string) {
  return Number(price).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}

function addToCart() {
  if (status.value !== 'authenticated') {
    router.push(`/auth/login?callbackUrl=${encodeURIComponent(route.fullPath)}`)
    return
  }
  cart.addItem({
    bookId: props.book.id,
    title: props.book.title,
    author: props.book.author,
    price: Number(props.book.price),
    coverUrl: props.book.coverUrl ?? null,
  })
  showToast(`"${props.book.title}" añadido al carrito`)
}

async function toggleFav() {
  await favStore.toggle(props.book.id)
}
</script>

<style scoped>
.book-card {
  transition: transform 0.2s, box-shadow 0.2s;
}
.book-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}
.book-cover {
  height: 220px;
  object-fit: cover;
  background: #f0f0f0;
}

.fav-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  z-index: 2;
  background: white;
  border: none;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 4px rgba(0,0,0,0.2);
  cursor: pointer;
  color: #ccc;
  transition: color 0.15s, transform 0.15s;
}
.fav-btn:hover,
.fav-btn.active {
  color: #c0392b;
  transform: scale(1.15);
}
</style>
