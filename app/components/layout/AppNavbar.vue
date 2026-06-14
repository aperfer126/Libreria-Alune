<template>
  <header class="sticky-top shadow">
    <!-- Barra principal -->
    <nav class="navbar navbar-expand-lg navbar-dark py-0" style="background-color: #230f09;">
      <div class="container">
        <NuxtLink to="/" class="navbar-brand d-flex align-items-center gap-2">
          <img src="/logo.png" alt="Librería Alune" style="height:100px;width:100px;object-fit:contain" />
          <span class="fw-bold fs-4">Librería Alune</span>
        </NuxtLink>

        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarMain"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div id="navbarMain" class="collapse navbar-collapse">
          <form class="d-flex mx-lg-4" style="max-width: 360px; width: 100%" @submit.prevent="search">
            <input
              v-model="searchQuery"
              type="search"
              class="form-control form-control-sm me-2"
              placeholder="Buscar libros, autores..."
            />
            <button class="btn btn-sm btn-outline-light" type="submit">
              🔍
            </button>
          </form>

          <div class="shipping-info d-none d-xl-flex flex-column lh-sm me-3">
            <span class="text-white-50" style="font-size:0.7rem">🚚 Gastos de envío en península <strong class="text-white">4,99 €</strong></span>
            <span class="text-success" style="font-size:0.7rem">✓ Envío gratis a partir de <strong>50 €</strong></span>
          </div>

          <ul class="navbar-nav ms-auto align-items-center gap-2">
            <li v-if="isAdmin" class="nav-item">
              <NuxtLink to="/admin" class="nav-link text-warning">⚙ Admin</NuxtLink>
            </li>

            <li class="nav-item cart-hover-wrapper" @mouseenter="cartOpen = true" @mouseleave="cartOpen = false">
              <NuxtLink to="/carrito" class="btn btn-outline-light btn-sm position-relative">
                🛒
                <span
                  v-if="cartCount > 0"
                  class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                >
                  {{ cartCount }}
                </span>
              </NuxtLink>

              <!-- Preview del carrito -->
              <div v-if="cartOpen" class="cart-preview shadow">
                <div v-if="cart.items.length === 0" class="text-center text-muted py-3 small">
                  El carrito está vacío
                </div>
                <template v-else>
                  <ul class="list-unstyled mb-0">
                    <li
                      v-for="item in cart.items.slice(0, 4)"
                      :key="item.bookId"
                      class="cart-preview-item"
                    >
                      <NuxtLink
                        :to="`/libro/${item.bookId}`"
                        class="d-flex align-items-center gap-2 px-3 py-2 text-decoration-none text-dark"
                      >
                        <img
                          :src="item.coverUrl || '/placeholder-book.png'"
                          :alt="item.title"
                          class="rounded"
                          style="width:32px;height:44px;object-fit:cover;flex-shrink:0"
                        />
                        <div class="flex-grow-1 overflow-hidden">
                          <p class="mb-0 small fw-semibold text-truncate">{{ item.title }}</p>
                          <p class="mb-0 text-muted" style="font-size:0.75rem">
                            {{ item.quantity }} × {{ formatPreviewPrice(item.price) }}
                          </p>
                        </div>
                      </NuxtLink>
                    </li>
                    <li v-if="cart.items.length > 4" class="text-center text-muted py-1" style="font-size:0.75rem">
                      + {{ cart.items.length - 4 }} artículo{{ cart.items.length - 4 > 1 ? 's' : '' }} más
                    </li>
                  </ul>
                  <div class="border-top px-3 py-2 d-flex justify-content-between align-items-center">
                    <span class="small fw-bold">Total</span>
                    <span class="fw-bold text-primary small">{{ formatPreviewPrice(cart.total) }}</span>
                  </div>
                  <div class="px-3 pb-3">
                    <NuxtLink to="/carrito" class="btn btn-primary btn-sm w-100">
                      Ver carrito
                    </NuxtLink>
                  </div>
                </template>
              </div>
            </li>

            <!-- Favoritos -->
            <li v-if="status === 'authenticated'" class="nav-item">
              <NuxtLink to="/favoritos" class="btn btn-outline-light btn-sm" title="Mis favoritos">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                </svg>
              </NuxtLink>
            </li>

            <li v-if="status === 'authenticated'" class="nav-item dropdown">
              <a class="nav-link dropdown-toggle" href="#" data-bs-toggle="dropdown">
                {{ session?.user?.name }}
              </a>
              <ul class="dropdown-menu dropdown-menu-end">
                <li><NuxtLink to="/mi-perfil" class="dropdown-item">Mi perfil</NuxtLink></li>
                <li><NuxtLink to="/favoritos" class="dropdown-item">Mis favoritos</NuxtLink></li>
                <li><NuxtLink to="/mis-pedidos" class="dropdown-item">Mis pedidos</NuxtLink></li>
                <li><hr class="dropdown-divider" /></li>
                <li>
                  <button class="dropdown-item text-danger" @click="handleSignOut">
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </li>

            <li v-else class="nav-item">
              <NuxtLink to="/auth/login" class="btn btn-primary btn-sm d-flex align-items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 1a6 6 0 0 0-6 6h12a6 6 0 0 0-6-6z"/>
                </svg>
                Mi cuenta
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <!-- Barra de categorías -->
    <nav class="navbar navbar-expand-lg category-bar py-0">
      <div class="container">
        <button
          class="navbar-toggler border-0 py-2"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarCategories"
        >
          <span class="navbar-toggler-icon"></span>
        </button>

        <div id="navbarCategories" class="collapse navbar-collapse">
          <ul class="navbar-nav align-items-lg-center">
            <!-- Inicio -->
            <li class="nav-item">
              <NuxtLink to="/" class="nav-link category-link px-3 py-3">
                Inicio
              </NuxtLink>
            </li>

            <!-- Libros (desplegable con géneros) -->
            <li class="nav-item dropdown">
              <a
                class="nav-link category-link dropdown-toggle px-3 py-3"
                href="#"
                data-bs-toggle="dropdown"
                data-bs-auto-close="true"
              >
                Libros
              </a>
              <ul class="dropdown-menu dropdown-menu-genres shadow border-0">
                <li v-if="pendingGenres" class="dropdown-item text-muted">Cargando...</li>
                <template v-else>
                  <li>
                    <NuxtLink to="/catalogo" class="dropdown-item">
                      Todos los libros
                    </NuxtLink>
                  </li>
                  <li><hr class="dropdown-divider" /></li>
                  <li v-for="genre in genres" :key="genre.id">
                    <NuxtLink
                      :to="`/catalogo?genre=${encodeURIComponent(genre.name)}`"
                      class="dropdown-item genre-item"
                    >
                      {{ genre.name }}
                    </NuxtLink>
                  </li>
                </template>
              </ul>
            </li>

            <!-- Sobre Nosotros -->
            <li class="nav-item">
              <NuxtLink to="/sobre-nosotros" class="nav-link category-link px-3 py-3">
                Sobre Nosotros
              </NuxtLink>
            </li>
          </ul>

          <!-- Redes sociales -->
          <ul class="navbar-nav ms-auto align-items-lg-center flex-row gap-1 py-2 py-lg-0">
            <li class="nav-item">
              <a href="https://facebook.com" target="_blank" rel="noopener" class="social-link" title="Facebook">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                </svg>
              </a>
            </li>
            <li class="nav-item">
              <a href="https://instagram.com" target="_blank" rel="noopener" class="social-link" title="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C5.829 0 5.556.01 4.703.048 3.85.088 3.269.222 2.76.42a3.917 3.917 0 0 0-1.417.923A3.927 3.927 0 0 0 .42 2.76C.222 3.268.087 3.85.048 4.7.01 5.555 0 5.827 0 8.001c0 2.172.01 2.444.048 3.297.04.852.174 1.433.372 1.942.205.526.478.972.923 1.417.444.445.89.719 1.416.923.51.198 1.09.333 1.942.372C5.555 15.99 5.827 16 8 16s2.444-.01 3.298-.048c.851-.04 1.434-.174 1.943-.372a3.916 3.916 0 0 0 1.416-.923c.445-.445.718-.891.923-1.417.197-.509.332-1.09.372-1.942C15.99 10.445 16 10.173 16 8s-.01-2.445-.048-3.299c-.04-.851-.175-1.433-.372-1.941a3.926 3.926 0 0 0-.923-1.417A3.911 3.911 0 0 0 13.24.42c-.51-.198-1.092-.333-1.943-.372C10.443.01 10.172 0 7.998 0H8zm-.717 1.442h.718c2.136 0 2.389.007 3.232.046.78.035 1.204.166 1.486.275.373.145.64.319.92.599.28.28.453.546.598.92.11.281.24.705.275 1.485.039.843.047 1.096.047 3.231s-.008 2.389-.047 3.232c-.035.78-.166 1.203-.275 1.485a2.47 2.47 0 0 1-.599.919c-.28.28-.546.453-.92.598-.28.11-.704.24-1.485.276-.843.038-1.096.047-3.232.047s-2.39-.009-3.233-.047c-.78-.036-1.203-.166-1.485-.276a2.478 2.478 0 0 1-.92-.598 2.48 2.48 0 0 1-.6-.92c-.109-.281-.24-.705-.275-1.485-.038-.843-.046-1.096-.046-3.233 0-2.136.008-2.388.046-3.231.036-.78.166-1.204.276-1.486.145-.373.319-.64.599-.92.28-.28.546-.453.92-.598.282-.11.705-.24 1.485-.276.738-.034 1.024-.044 2.515-.045v.002zm4.988 1.328a.96.96 0 1 0 0 1.92.96.96 0 0 0 0-1.92zm-4.27 1.122a4.109 4.109 0 1 0 0 8.217 4.109 4.109 0 0 0 0-8.217zm0 1.441a2.667 2.667 0 1 1 0 5.334 2.667 2.667 0 0 1 0-5.334z"/>
                </svg>
              </a>
            </li>
            <li class="nav-item">
              <a href="https://x.com" target="_blank" rel="noopener" class="social-link" title="X (Twitter)">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865z"/>
                </svg>
              </a>
            </li>
            <li class="nav-item">
              <a href="https://tiktok.com" target="_blank" rel="noopener" class="social-link" title="TikTok">
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M9 0h1.98c.144.715.54 1.617 1.235 2.512C12.895 3.389 13.797 4 15 4v2c-1.753 0-3.07-.814-4-1.829V11a5 5 0 1 1-5-5v2a3 3 0 1 0 3 3V0z"/>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useFavoritesStore } from '~/stores/favorites'

const { data: session, status, signOut } = useAuth()
const cart = useCartStore()
const favStore = useFavoritesStore()
const cartCount = computed(() => cart.count)
const cartOpen = ref(false)

function formatPreviewPrice(price: number) {
  return price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}
const isAdmin = computed(() => ['ADMIN', 'MODERATOR'].includes((session.value?.user as { role?: string })?.role ?? ''))

const searchQuery = ref('')
const router = useRouter()

const { data: genresData, pending: pendingGenres } = await useFetch('/api/genres')
const genres = computed(() => genresData.value ?? [])

// Limpiar el carrito cuando cambia el usuario (login o logout)
let lastUserId: string | null = null
watch(session, (newSession) => {
  const currentId = newSession?.user?.email ?? null
  if (lastUserId !== null && lastUserId !== currentId) {
    cart.clear()
    favStore.clear()
  }
  lastUserId = currentId
}, { immediate: true })

async function handleSignOut() {
  cart.clear()
  favStore.clear()
  await signOut({ callbackUrl: '/' })
}

function search() {
  if (searchQuery.value.trim()) {
    router.push(`/catalogo?q=${encodeURIComponent(searchQuery.value.trim())}`)
  }
}

</script>

<style scoped>
.category-bar {
  background-color: #2e1309;
}

.category-link {
  color: rgba(255, 255, 255, 0.92) !important;
  font-size: 0.9rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  transition: background-color 0.15s, color 0.15s;
}

.category-link:hover,
.category-link.router-link-active {
  background-color: rgba(0, 0, 0, 0.2);
  color: #fff !important;
}

.dropdown-menu-genres {
  min-width: 220px;
  border-radius: 8px;
  margin-top: 0 !important;
  padding: 8px 0;
}

.genre-item {
  padding: 8px 20px;
  font-size: 0.9rem;
  transition: background-color 0.12s;
}

.genre-item:hover {
  background-color: #fdf5e8;
  color: #e8a020;
}

/* Redes sociales */
.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.75);
  transition: color 0.15s, background 0.15s;
}

.social-link:hover {
  color: #fff;
  background: rgba(255, 255, 255, 0.15);
}

/* Preview carrito */
.cart-hover-wrapper {
  position: relative;
}

.cart-hover-wrapper::after {
  content: '';
  position: absolute;
  top: 100%;
  right: 0;
  width: 300px;
  height: 12px;
}

.cart-preview {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  width: 300px;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e5e5e5;
  z-index: 1050;
  overflow: hidden;
  animation: fadeDown 0.15s ease;
}

@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-6px); }
  to   { opacity: 1; transform: translateY(0); }
}

.cart-preview-item + .cart-preview-item {
  border-top: 1px solid #f0f0f0;
}
</style>
