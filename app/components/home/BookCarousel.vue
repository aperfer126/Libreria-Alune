<template>
  <section class="mb-5">
    <div class="d-flex justify-content-between align-items-center mb-1">
      <h2 class="h4 fw-bold mb-0">{{ title }}</h2>
      <NuxtLink v-if="viewAllLink" :to="viewAllLink" class="btn btn-sm btn-outline-secondary">
        Ver todos
      </NuxtLink>
    </div>
    <div class="carousel-underline mb-3"></div>

    <div v-if="pending" class="d-flex gap-3">
      <div v-for="n in 5" :key="n" class="placeholder-glow" style="width: 180px">
        <div class="placeholder bg-secondary rounded" style="height: 220px; width: 100%"></div>
        <div class="placeholder bg-secondary rounded mt-2" style="height: 16px; width: 80%"></div>
        <div class="placeholder bg-secondary rounded mt-1" style="height: 14px; width: 60%"></div>
      </div>
    </div>

    <div v-else-if="books.length === 0" class="text-muted fst-italic">
      No hay libros disponibles en esta categoría todavía.
    </div>

    <div v-else class="position-relative">
      <div ref="scrollContainer" class="carousel-scroll d-flex gap-3 overflow-hidden pb-2">
        <div
          v-for="book in books"
          :key="book.id"
          class="flex-shrink-0"
          style="width: 180px"
        >
          <BooksBookCard :book="book" />
        </div>
      </div>

      <button
        v-if="books.length > visibleCount"
        class="carousel-btn carousel-btn-prev btn btn-light border shadow-sm"
        @click="scroll(-1)"
      >
        &#8249;
      </button>
      <button
        v-if="books.length > visibleCount"
        class="carousel-btn carousel-btn-next btn btn-light border shadow-sm"
        @click="scroll(1)"
      >
        &#8250;
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{
  title: string
  books: Array<{
    id: number
    title: string
    author: string
    price: number | string
    coverUrl?: string | null
    stock: number
    createdAt?: string | Date
    genre?: { name: string }
    genres?: { id: number; name: string }[]
  }>
  pending?: boolean
  viewAllLink?: string
}>()

const scrollContainer = ref<HTMLElement | null>(null)
const visibleCount = 5

function scroll(dir: 1 | -1) {
  if (!scrollContainer.value) return
  scrollContainer.value.scrollBy({ left: dir * 200, behavior: 'smooth' })
}
</script>

<style scoped>
.carousel-underline {
  height: 3px;
  background: linear-gradient(to right, #c0392b 60px, #e0e0e0 60px);
  border-radius: 2px;
}

.carousel-scroll {
  scroll-snap-type: x mandatory;
  overflow-x: auto;
  scrollbar-width: none;
}
.carousel-scroll::-webkit-scrollbar {
  display: none;
}
.carousel-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 36px;
  height: 36px;
  border-radius: 50% !important;
  font-size: 1.4rem;
  line-height: 1;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}
.carousel-btn-prev { left: -18px; }
.carousel-btn-next { right: -18px; }
</style>
