<template>
  <div>
  <LayoutBreadcrumb :crumbs="selectedGenres.length
    ? [{ label: 'Catálogo', to: '/catalogo' }, { label: selectedGenres.join(', ') }]
    : [{ label: 'Catálogo' }]"
  />
  <div class="container-fluid py-4">
    <div class="row g-4">

      <!-- Sidebar de filtros -->
      <aside class="col-lg-2 col-md-3">
        <!-- Botón toggle en móvil -->
        <button
          class="btn btn-outline-secondary w-100 mb-3 d-md-none"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#sidebarFiltros"
        >
          ☰ Filtros
        </button>

        <div id="sidebarFiltros" class="collapse d-md-block">
          <div class="sidebar-card p-3 rounded-3 border bg-white shadow-sm">

            <!-- Búsqueda -->
            <div class="mb-4">
              <h6 class="sidebar-title text-uppercase fw-bold mb-2">Buscar</h6>
              <div class="input-group input-group-sm">
                <input
                  v-model="searchQ"
                  type="text"
                  class="form-control"
                  placeholder="Título, autor..."
                  @keyup.enter="applyFilters"
                />
                <button class="btn btn-danger btn-sm" @click="applyFilters">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" viewBox="0 0 16 16"><path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/></svg>
                </button>
              </div>
            </div>

            <!-- Géneros (multi-selección) -->
            <div class="mb-4">
              <h6 class="sidebar-title text-uppercase fw-bold mb-2">Géneros</h6>
              <ul class="list-unstyled mb-0">
                <li v-for="g in genres" :key="g.id">
                  <label class="genre-check d-flex align-items-center gap-2 py-1 px-2 rounded">
                    <input
                      type="checkbox"
                      class="form-check-input m-0 flex-shrink-0"
                      :value="g.name"
                      v-model="selectedGenres"
                      @change="applyFilters"
                    />
                    <span class="small">{{ g.name }}</span>
                  </label>
                </li>
              </ul>
            </div>

            <!-- Ordenar -->
            <div class="mb-4">
              <h6 class="sidebar-title text-uppercase fw-bold mb-2">Ordenar por</h6>
              <div class="d-flex flex-column gap-1">
                <label v-for="opt in sortOptions" :key="opt.value" class="sort-label d-flex align-items-center gap-2 py-1 px-2 rounded" :class="{ active: sortBy === opt.value }">
                  <input v-model="sortBy" type="radio" :value="opt.value" class="form-check-input m-0" @change="applyFilters" />
                  <span class="small">{{ opt.label }}</span>
                </label>
              </div>
            </div>

            <!-- Botón limpiar -->
            <button class="btn btn-sm btn-outline-secondary w-100 mt-4" @click="clearFilters">
              Limpiar filtros
            </button>
          </div>
        </div>
      </aside>

      <!-- Contenido principal -->
      <main class="col-lg-10 col-md-9">
        <!-- Cabecera con conteo y género activo -->
        <div class="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
          <div>
            <h1 class="h4 fw-bold mb-0">
              {{ selectedGenre || 'Todos los libros' }}
            </h1>
            <p v-if="!pending" class="text-muted small mb-0">
              {{ total }} resultado{{ total !== 1 ? 's' : '' }}
            </p>
          </div>
          <div v-if="selectedGenre || searchQ" class="d-flex flex-wrap gap-2">
            <span v-if="selectedGenre" class="badge bg-danger d-flex align-items-center gap-1">
              {{ selectedGenre }}
              <button class="btn-close btn-close-white ms-1" style="font-size:0.6rem" @click="selectGenre('')"></button>
            </span>
            <span v-if="searchQ" class="badge bg-secondary d-flex align-items-center gap-1">
              "{{ searchQ }}"
              <button class="btn-close btn-close-white ms-1" style="font-size:0.6rem" @click="searchQ = ''; applyFilters()"></button>
            </span>
          </div>
        </div>

        <!-- Skeleton loader -->
        <div v-if="pending" class="row g-3">
          <div v-for="n in 12" :key="n" class="col-6 col-sm-4 col-md-4 col-lg-3 col-xl-2">
            <div class="placeholder-glow">
              <div class="placeholder bg-secondary rounded" style="height: 220px; width: 100%"></div>
              <div class="placeholder bg-secondary rounded mt-2" style="height: 14px; width: 80%"></div>
              <div class="placeholder bg-secondary rounded mt-1" style="height: 12px; width: 55%"></div>
            </div>
          </div>
        </div>

        <!-- Sin resultados -->
        <div v-else-if="books.length === 0" class="text-center py-5 text-muted">
          <div class="fs-1 mb-3">📭</div>
          <p class="fs-5">No se encontraron libros con esos criterios.</p>
          <button class="btn btn-outline-secondary btn-sm" @click="clearFilters">Limpiar filtros</button>
        </div>

        <!-- Grid de libros -->
        <div v-else class="row g-3">
          <div v-for="book in books" :key="book.id" class="col-6 col-sm-4 col-md-4 col-lg-3 col-xl-2">
            <BooksBookCard :book="book" />
          </div>
        </div>

        <!-- Paginación -->
        <div v-if="total > limit" class="d-flex justify-content-center mt-5 gap-2">
          <button class="btn btn-outline-secondary btn-sm" :disabled="page === 0" @click="changePage(page - 1)">← Anterior</button>
          <span class="align-self-center text-muted small">Página {{ page + 1 }} de {{ totalPages }}</span>
          <button class="btn btn-outline-secondary btn-sm" :disabled="page >= totalPages - 1" @click="changePage(page + 1)">Siguiente →</button>
        </div>
      </main>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Catálogo | Librería Alune' })

const route = useRoute()

const searchQ = ref((route.query.q as string) || '')
const selectedGenres = ref<string[]>(
  route.query.genre ? (Array.isArray(route.query.genre) ? route.query.genre as string[] : [route.query.genre as string]) : []
)
const sortBy = ref((route.query.sort as string) || 'createdAt')
const page = ref(0)
const limit = 24

const books = ref<any[]>([])
const total = ref(0)
const pending = ref(false)
const totalPages = computed(() => Math.ceil(total.value / limit))

const sortOptions = [
  { value: 'createdAt', label: 'Más recientes' },
  { value: 'price', label: 'Precio' },
  { value: 'title', label: 'Título (A-Z)' },
]

const { data: genresData } = await useFetch('/api/genres')
const genres = computed(() => genresData.value ?? [])

// Reaccionar a cambios en la URL (navegación desde el menú desplegable)
watch(
  () => route.query,
  (q) => {
    searchQ.value = (q.q as string) || ''
    selectedGenres.value = q.genre ? (Array.isArray(q.genre) ? q.genre as string[] : [q.genre as string]) : []
    sortBy.value = (q.sort as string) || 'createdAt'
    page.value = 0
    fetchBooks()
  },
)

async function fetchBooks() {
  pending.value = true
  const params: Record<string, string> = {
    sort: sortBy.value,
    limit: String(limit),
    offset: String(page.value * limit),
  }
  if (searchQ.value) params.q = searchQ.value
  if (selectedGenres.value.length) params.genre = selectedGenres.value.join(',')

  const data = await $fetch<{ books: any[]; total: number }>('/api/books', { query: params })
  books.value = data.books
  total.value = data.total
  pending.value = false
}

function applyFilters() {
  page.value = 0
  fetchBooks()
}

function changePage(p: number) {
  page.value = p
  fetchBooks()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function clearFilters() {
  searchQ.value = ''
  selectedGenres.value = []
  sortBy.value = 'createdAt'
  page.value = 0
  fetchBooks()
}

await fetchBooks()
</script>

<style scoped>
.sidebar-title {
  color: #888;
  font-size: 0.7rem;
  letter-spacing: 0.08em;
}

.genre-check {
  cursor: pointer;
  font-size: 0.875rem;
  color: #444;
  transition: background 0.12s;
}

.genre-check:hover {
  background: #fdf0ef;
  color: #c0392b;
}

.genre-check input[type="checkbox"] {
  accent-color: #c0392b;
}

.sort-label {
  cursor: pointer;
  font-size: 0.875rem;
  color: #444;
  transition: background 0.15s;
}

.sort-label:hover {
  background: #f5f5f5;
}

.sort-label.active {
  background: #fdf0ef;
  color: #c0392b;
  font-weight: 600;
}
</style>
