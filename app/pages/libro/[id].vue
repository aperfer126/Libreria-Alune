<template>
  <div>
    <LayoutBreadcrumb :crumbs="[
      { label: 'Catálogo', to: '/catalogo' },
      ...(book?.genres?.[0] ? [{ label: book.genres[0].name, to: `/catalogo?genre=${encodeURIComponent(book.genres[0].name)}` }] : []),
      { label: book?.title ?? 'Libro' }
    ]" />

    <div class="container py-5">
      <!-- Skeleton loading -->
      <div v-if="pending" class="row g-5">
        <div class="col-md-3 placeholder-glow">
          <div class="placeholder bg-secondary rounded" style="height: 400px"></div>
        </div>
        <div class="col-md-6 placeholder-glow">
          <div class="placeholder bg-secondary rounded mb-3" style="height: 32px; width: 60%"></div>
          <div class="placeholder bg-secondary rounded" style="height: 80px"></div>
        </div>
      </div>

      <template v-else-if="book">
        <!-- 3 columnas: portada | info+ficha | precio+acciones -->
        <div class="row g-4 mb-5">

          <!-- Columna 1: Portada -->
          <div class="col-md-3 text-center">
            <img
              :src="book.coverUrl || '/placeholder-book.png'"
              :alt="book.title"
              class="img-fluid rounded shadow"
              style="max-height: 400px; object-fit: cover; width: 100%"
            />
          </div>

          <!-- Columna 2: Info + ficha técnica -->
          <div class="col-md-6">
            <div class="mb-2 d-flex flex-wrap gap-1">
              <span v-for="g in book.genres" :key="g.id" class="badge bg-secondary">{{ g.name }}</span>
              <span v-if="isRecent" class="badge bg-success">Novedad</span>
            </div>

            <h1 class="h2 fw-bold mb-1">{{ book.title }}</h1>
            <p class="text-muted fs-5 mb-4">{{ book.author }}</p>

            <!-- Ficha técnica -->
            <h5 class="fw-semibold mb-3">Ficha técnica</h5>
            <dl class="row g-0 book-specs">
              <template v-if="book.publisher">
                <dt class="col-5">Editorial</dt>
                <dd class="col-7">{{ book.publisher }}</dd>
              </template>
              <template v-if="book.publishedAt">
                <dt class="col-5">Año de edición</dt>
                <dd class="col-7">{{ new Date(book.publishedAt).getFullYear() }}</dd>
              </template>
              <template v-if="book.genres?.length">
                <dt class="col-5">Género{{ book.genres.length > 1 ? 's' : '' }}</dt>
                <dd class="col-7">{{ book.genres.map((g: any) => g.name).join(', ') }}</dd>
              </template>
              <template v-if="book.isbn">
                <dt class="col-5">ISBN</dt>
                <dd class="col-7">{{ book.isbn }}</dd>
              </template>
              <template v-if="book.pages">
                <dt class="col-5">Páginas</dt>
                <dd class="col-7">{{ book.pages }}</dd>
              </template>
              <template v-if="book.binding">
                <dt class="col-5">Encuadernación</dt>
                <dd class="col-7">{{ book.binding }}</dd>
              </template>
            </dl>
          </div>

          <!-- Columna 3: Precio + acciones (sticky) -->
          <div class="col-md-3">
            <div class="action-card p-4 rounded-3 border shadow-sm">
              <div class="mb-1 text-muted small">Precio</div>
              <div class="fs-1 fw-bold text-primary mb-1">{{ formatPrice(book.price) }}</div>
              <div class="mb-4">
                <span v-if="book.stock > 0" class="text-success small fw-semibold">✓ En stock</span>
                <span v-else class="text-danger small fw-semibold">✗ Agotado</span>
              </div>

              <!-- Selector de cantidad (solo si hay stock) -->
              <div v-if="book.stock > 0" class="input-group input-group-sm mb-3">
                <button class="btn btn-outline-secondary" type="button" @click="qty > 1 && qty--">−</button>
                <input v-model.number="qty" type="number" class="form-control text-center" min="1" :max="book.stock" />
                <button class="btn btn-outline-secondary" type="button" @click="qty < book.stock && qty++">+</button>
              </div>

              <!-- Añadir al carrito -->
              <button
                v-if="book.stock > 0"
                class="btn btn-primary w-100 mb-2"
                @click="addToCart"
              >
                🛒 Añadir al carrito
              </button>

              <!-- Reservar (sin stock) -->
              <template v-else>
                <button
                  class="btn btn-outline-warning w-100 mb-2"
                  :disabled="reservationDone || reserving"
                  @click="reserve"
                >
                  <span v-if="reserving" class="spinner-border spinner-border-sm me-2"></span>
                  {{ reservationDone ? '✓ Reserva confirmada' : '📋 Reservar' }}
                </button>
                <p class="text-muted small mb-2 text-center">
                  {{ reservationDone
                    ? 'Te avisaremos cuando vuelva a estar disponible.'
                    : 'Sin stock. Resérvalo y te avisaremos cuando llegue.' }}
                </p>
              </template>

              <!-- Favorito -->
              <button
                class="btn w-100 fav-action-btn"
                :class="isFav ? 'btn-danger' : 'btn-outline-secondary'"
                @click="toggleFav"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16" class="me-1">
                  <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                </svg>
                {{ isFav ? 'En favoritos' : 'Añadir a favoritos' }}
              </button>
            </div>
          </div>
        </div>

        <!-- Sinopsis -->
        <div v-if="book.description" class="synopsis-block mb-5">
          <h3 class="h5 fw-bold mb-3">Sinopsis</h3>
          <div ref="synopsisEl" class="synopsis-text" :class="{ expanded: synopsisExpanded }">
            <p class="mb-0">{{ book.description }}</p>
          </div>
          <button
            v-if="synopsisOverflows"
            class="btn btn-link ps-0 mt-2 text-danger fw-semibold text-decoration-none"
            @click="synopsisExpanded = !synopsisExpanded"
          >
            {{ synopsisExpanded ? 'Leer menos ▲' : 'Leer más ▼' }}
          </button>
        </div>

        <!-- Carrusel: artículos relacionados -->
        <div v-if="relatedBooks.length" class="mb-5">
          <HomeBookCarousel
            title="Artículos relacionados"
            :books="relatedBooks"
            :pending="pendingRelated"
            :view-all-link="relatedViewAllLink"
          />
        </div>

        <!-- Carrusel: más del mismo autor -->
        <div v-if="authorBooks.length" class="mb-5">
          <HomeBookCarousel
            :title="`Más de ${book.author}`"
            :books="authorBooks"
            :pending="pendingAuthor"
          />
        </div>

      </template>
    </div>

  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useFavoritesStore } from '~/stores/favorites'

const route = useRoute()
const router = useRouter()
const { data: book, pending } = await useFetch<any>(`/api/books/${route.params.id}`)
const cart = useCartStore()
const favStore = useFavoritesStore()
const { status } = useAuth()
const qty = ref(1)
const { show: showToast } = useToast()

const isRecent = computed(() => {
  if (!book.value?.createdAt) return false
  return Date.now() - new Date(book.value.createdAt).getTime() < 30 * 24 * 60 * 60 * 1000
})

useSeoMeta({
  title: computed(() => `${book.value?.title ?? 'Libro'} | Librería Online`),
})

const isFav = computed(() => favStore.isFavorite(book.value?.id))

watch(status, async (s) => {
  if (s === 'authenticated') await favStore.load()
}, { immediate: true })

// Sinopsis: mostrar "leer más" sólo si el texto desborda el contenedor colapsado
const synopsisExpanded = ref(false)
const synopsisEl = ref<HTMLElement | null>(null)
const synopsisOverflows = ref(false)

function checkSynopsisOverflow() {
  nextTick(() => {
    const el = synopsisEl.value
    if (el) synopsisOverflows.value = el.scrollHeight > el.clientHeight
  })
}

onMounted(checkSynopsisOverflow)
watch(() => book.value?.description, checkSynopsisOverflow)

// Libros relacionados (mismos géneros, excluye el actual)
const relatedGenre = computed(() => book.value?.genres?.[0]?.name ?? '')
const { data: relatedData, pending: pendingRelated } = await useFetch('/api/books', {
  query: computed(() => ({
    genre: relatedGenre.value,
    excludeId: book.value?.id,
    limit: 12,
  })),
  watch: [relatedGenre],
})
const relatedBooks = computed(() => relatedData.value?.books ?? [])
const relatedViewAllLink = computed(() =>
  relatedGenre.value ? `/catalogo?genre=${encodeURIComponent(relatedGenre.value)}` : '/catalogo'
)

// Libros del mismo autor (excluye el actual), sólo si hay resultados
const { data: authorData, pending: pendingAuthor } = await useFetch('/api/books', {
  query: computed(() => ({
    author: book.value?.author ?? '',
    excludeId: book.value?.id,
    limit: 12,
  })),
  watch: [() => book.value?.author],
})
const authorBooks = computed(() => authorData.value?.books ?? [])

function formatPrice(price: number | string) {
  return Number(price).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}

function addToCart() {
  if (!book.value) return
  if (status.value !== 'authenticated') {
    router.push(`/auth/login?callbackUrl=${encodeURIComponent(route.fullPath)}`)
    return
  }
  for (let i = 0; i < qty.value; i++) {
    cart.addItem({
      bookId: book.value.id,
      title: book.value.title,
      author: book.value.author,
      price: Number(book.value.price),
      coverUrl: book.value.coverUrl,
    })
  }
  showToast(`${qty.value > 1 ? `${qty.value} × ` : ''}"${book.value.title}" añadido al carrito`)
}

async function toggleFav() {
  if (status.value !== 'authenticated') {
    router.push(`/auth/login?callbackUrl=${encodeURIComponent(route.fullPath)}`)
    return
  }
  await favStore.toggle(book.value.id)
}

const reserving = ref(false)
const reservationDone = ref(false)

async function reserve() {
  if (status.value !== 'authenticated') {
    router.push(`/auth/login?callbackUrl=${encodeURIComponent(route.fullPath)}`)
    return
  }
  reserving.value = true
  try {
    const res = await $fetch<{ alreadyReserved?: boolean; message: string }>('/api/reservations', {
      method: 'POST',
      body: { bookId: book.value.id },
    })
    reservationDone.value = true
    showToast(res.alreadyReserved ? 'Ya tenías este libro reservado' : 'Reserva confirmada. Te avisaremos cuando esté disponible.')
  } catch {
    showToast('No se pudo completar la reserva. Inténtalo de nuevo.')
  } finally {
    reserving.value = false
  }
}
</script>

<style scoped>
.book-specs dt {
  font-weight: 600;
  color: #555;
  font-size: 0.875rem;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
}
.book-specs dd {
  color: #222;
  font-size: 0.875rem;
  padding: 6px 0;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 0;
}
.action-card {
  position: sticky;
  top: 100px;
  background: #fff;
}
.fav-action-btn {
  transition: all 0.2s;
}

.synopsis-block {
  border-top: 1px solid #e9ecef;
  padding-top: 2rem;
}
.synopsis-text {
  max-height: 7.5em;
  overflow: hidden;
  transition: max-height 0.4s ease;
  line-height: 1.75;
  color: #444;
  font-size: 1rem;
}
.synopsis-text.expanded {
  max-height: 1000px;
}
</style>
