<template>
  <div>
    <LayoutBreadcrumb :crumbs="[{ label: 'Mis favoritos' }]" />
    <div class="container py-5">
      <h1 class="h3 fw-bold mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#c0392b" viewBox="0 0 16 16" class="me-2">
          <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
        </svg>
        Mis favoritos
      </h1>

      <div v-if="pending" class="row g-3">
        <div v-for="n in 6" :key="n" class="col-6 col-sm-4 col-md-3 col-lg-2">
          <div class="placeholder-glow">
            <div class="placeholder bg-secondary rounded" style="height:220px;width:100%"></div>
            <div class="placeholder bg-secondary rounded mt-2" style="height:14px;width:80%"></div>
          </div>
        </div>
      </div>

      <div v-else-if="books.length === 0" class="text-center py-5">
        <div class="fs-1 mb-3">🤍</div>
        <p class="fs-5 text-muted mb-4">Aún no tienes libros favoritos.</p>
        <NuxtLink to="/catalogo" class="btn btn-primary">Explorar catálogo</NuxtLink>
      </div>

      <div v-else class="row g-3">
        <div v-for="book in books" :key="book.id" class="col-6 col-sm-4 col-md-3 col-lg-2 position-relative">
          <BooksBookCard :book="book" />
          <button
            class="fav-remove-btn"
            title="Quitar de favoritos"
            @click="removeFav(book.id)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFavoritesStore } from '~/stores/favorites'

useSeoMeta({ title: 'Mis favoritos | Librería Alune' })
definePageMeta({ middleware: 'auth' })

const favStore = useFavoritesStore()
const { data, pending, refresh } = await useFetch<any[]>('/api/favorites')
const books = computed(() => data.value ?? [])

async function removeFav(bookId: number) {
  await favStore.toggle(bookId)
  await refresh()
}
</script>

<style scoped>
.fav-remove-btn {
  position: absolute;
  top: 8px;
  right: 20px;
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
  color: #c0392b;
  transition: transform 0.15s;
}
.fav-remove-btn:hover {
  transform: scale(1.15);
}
</style>
