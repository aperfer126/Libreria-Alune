<template>
  <div>
  <LayoutBreadcrumb :crumbs="[{ label: 'Admin', to: '/admin' }, { label: 'Libros' }]" />
  <div class="container-fluid py-4">
    <div class="row">
      <!-- Sidebar + Filtros -->
      <div class="col-md-3">
        <AdminSidebar />

        <div class="card shadow-sm mt-3">
          <div class="card-body p-3">
            <h6 class="fw-semibold mb-3">Filtros</h6>

            <label class="form-label small text-muted mb-1">Buscar</label>
            <div class="input-group input-group-sm mb-3">
              <span class="input-group-text bg-white border-end-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#888" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
                </svg>
              </span>
              <input
                v-model="search"
                type="search"
                class="form-control border-start-0 ps-0"
                placeholder="Título, autor..."
                @keyup.escape="search = ''"
              />
            </div>

            <div class="d-flex justify-content-between align-items-center mb-1">
              <label class="form-label small text-muted mb-0">Géneros</label>
              <button v-if="filterGenres.length" class="btn btn-link btn-sm p-0 text-muted" style="font-size:0.75rem" @click="filterGenres = []">limpiar</button>
            </div>
            <div class="mb-3" style="max-height: 160px; overflow-y: auto">
              <div v-for="g in allGenres" :key="g.id" class="form-check form-check-sm">
                <input
                  :id="`genre-${g.id}`"
                  v-model="filterGenres"
                  class="form-check-input"
                  type="checkbox"
                  :value="g.name"
                />
                <label :for="`genre-${g.id}`" class="form-check-label small">{{ g.name }}</label>
              </div>
            </div>

            <label class="form-label small text-muted mb-1">Stock</label>
            <select v-model="filterStock" class="form-select form-select-sm mb-3">
              <option value="">Cualquier stock</option>
              <option value="low">Stock bajo (≤ 5)</option>
              <option value="ok">Stock normal (> 5)</option>
            </select>

            <button
              v-if="search || filterGenres.length || filterStock"
              class="btn btn-outline-secondary btn-sm w-100"
              @click="resetFilters"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      <!-- Contenido -->
      <div class="col-md-9">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h3 fw-bold mb-0">Gestión de libros</h1>
            <p v-if="hasFilters" class="text-muted small mb-0 mt-1">
              {{ filtered.length }} resultado{{ filtered.length !== 1 ? 's' : '' }} encontrado{{ filtered.length !== 1 ? 's' : '' }}
            </p>
          </div>
          <NuxtLink to="/admin/libros/nuevo" class="btn btn-primary">+ Nuevo libro</NuxtLink>
        </div>

        <div v-if="pending" class="text-center py-5"><div class="spinner-border text-primary"></div></div>

        <div v-else class="card shadow-sm">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th>Portada</th>
                  <th>Título</th>
                  <th>Autor</th>
                  <th>Géneros</th>
                  <th>Precio</th>
                  <th>Stock</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="filtered.length === 0">
                  <td colspan="7" class="text-center text-muted py-4">
                    No se encontraron libros con los filtros aplicados.
                  </td>
                </tr>
                <tr v-for="book in filtered" :key="book.id">
                  <td>
                    <img :src="book.coverUrl || '/placeholder-book.png'" :alt="book.title" style="width: 36px; height: 48px; object-fit: cover" class="rounded" />
                  </td>
                  <td class="fw-medium" v-html="highlight(book.title)"></td>
                  <td class="text-muted" v-html="highlight(book.author)"></td>
                  <td>
                    <span v-for="g in book.genres" :key="g.id" class="badge bg-secondary me-1">{{ g.name }}</span>
                  </td>
                  <td>
                    <span class="price-pill">{{ formatPrice(Number(book.price)) }}</span>
                  </td>
                  <td>
                    <span v-if="book.stock === 0" class="badge bg-danger d-flex align-items-center gap-1" style="width:fit-content">
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/></svg>
                      Agotado
                    </span>
                    <span v-else-if="book.stock <= 5" class="stock-low d-flex align-items-center gap-1" style="width:fit-content">
                      <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" viewBox="0 0 16 16"><path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/></svg>
                      {{ book.stock }} uds.
                    </span>
                    <span v-else class="text-body fw-medium">{{ book.stock }}</span>
                  </td>
                  <td>
                    <NuxtLink :to="`/admin/libros/${book.id}/editar`" class="btn btn-sm btn-outline-primary me-1">Editar</NuxtLink>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteBook(book)">Eliminar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin' })
useSeoMeta({ title: 'Libros | Admin | Librería Alune' })

const { show: showToast } = useToast()
const { confirm } = useConfirm()

const { data: booksData, pending, refresh } = await useFetch('/api/books', { query: { limit: 500 } })
const books = computed(() => booksData.value?.books ?? [])

const { data: genresData } = await useFetch<any[]>('/api/genres')
const allGenres = computed(() => genresData.value ?? [])

const search = ref('')
const filterGenres = ref<string[]>([])
const filterStock = ref('')

const hasFilters = computed(() => !!(search.value || filterGenres.value.length || filterStock.value))

function resetFilters() {
  search.value = ''
  filterGenres.value = []
  filterStock.value = ''
}

const filtered = computed(() => {
  let list = books.value as any[]
  const q = search.value.trim().toLowerCase()
  if (q) {
    list = list.filter((b: any) =>
      b.title.toLowerCase().includes(q) ||
      b.author.toLowerCase().includes(q) ||
      b.genres?.some((g: any) => g.name.toLowerCase().includes(q))
    )
  }
  if (filterGenres.value.length) {
    list = list.filter((b: any) =>
      b.genres?.some((g: any) => filterGenres.value.includes(g.name))
    )
  }
  if (filterStock.value === 'low') list = list.filter((b: any) => b.stock <= 5)
  if (filterStock.value === 'ok') list = list.filter((b: any) => b.stock > 5)
  return list
})

function highlight(text: string) {
  const q = search.value.trim()
  if (!q) return text
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(re, '<mark class="px-0 bg-warning-subtle rounded-1">$1</mark>')
}

function formatPrice(price: number) {
  return price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}

async function deleteBook(book: any) {
  const ok = await confirm({
    title: 'Eliminar libro',
    message: `¿Estás seguro de que quieres eliminar "${book.title}"? Esta acción no se puede deshacer.`,
    confirmLabel: 'Sí, eliminar',
  })
  if (!ok) return
  try {
    await $fetch(`/api/books/${book.id}`, { method: 'DELETE' })
    showToast(`"${book.title}" eliminado correctamente`)
    refresh()
  } catch (e: any) {
    showToast(e.data?.statusMessage || 'Error al eliminar el libro')
  }
}
</script>

<style scoped>
.price-pill {
  display: inline-block;
  background: #eef6ff;
  color: #1a56db;
  font-weight: 600;
  font-size: 0.85rem;
  padding: 2px 8px;
  border-radius: 20px;
  border: 1px solid #c7deff;
  white-space: nowrap;
}

.stock-low {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: #fff8ec;
  color: #92400e;
  font-weight: 600;
  font-size: 0.8rem;
  padding: 2px 8px;
  border-radius: 20px;
  border: 1px solid #fcd34d;
  white-space: nowrap;
}
</style>
