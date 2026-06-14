<template>
  <div>
    <!-- Hero Carrusel -->
    <div class="hero-carousel mb-5" @mouseenter="pauseTimer" @mouseleave="resumeTimer">
      <!-- Slides -->
      <transition :name="transitionName">
        <!-- Slide 0: Bienvenida -->
        <div v-if="activeSlide === 0" key="0" class="hero-slide hero-slide--welcome">
          <div class="container text-center text-white py-5">
            <p class="hero-eyebrow mb-2">📚 Tu librería de confianza</p>
            <h1 class="display-5 fw-bold mb-3">Bienvenido a Librería Alune</h1>
            <p class="lead mb-4 text-white-50">Descubre las últimas novedades en libros, manga, juvenil y mucho más.</p>
            <NuxtLink to="/catalogo" class="btn btn-light btn-lg me-2 fw-semibold">Ver catálogo</NuxtLink>
            <NuxtLink to="/auth/registro" class="btn btn-outline-light btn-lg">Crear cuenta</NuxtLink>
          </div>
        </div>

        <!-- Slide 1: Novedades -->
        <div v-else-if="activeSlide === 1" key="1" class="hero-slide hero-slide--offer">
          <div class="container text-center text-white py-5">
            <p class="hero-eyebrow mb-2">🆕 Recién llegados</p>
            <h2 class="display-5 fw-bold mb-3">Novedades de la semana</h2>
            <p class="lead mb-4 text-white-50">Los títulos más esperados ya están disponibles. ¡Sé el primero en leerlos!</p>
            <NuxtLink to="/catalogo" class="btn btn-light btn-lg fw-semibold">Ver novedades</NuxtLink>
          </div>
        </div>

        <!-- Slide 2: Horario -->
        <div v-else key="2" class="hero-slide hero-slide--hours">
          <div class="container text-center text-white py-5">
            <p class="hero-eyebrow mb-2">🕐 Estamos aquí para ti</p>
            <h2 class="display-5 fw-bold mb-3">Horario de la tienda</h2>
            <div class="schedule-grid mx-auto mb-4">
              <div class="schedule-row">
                <span>Lunes – Viernes</span>
                <span class="fw-semibold">9:00 – 20:30</span>
              </div>
              <div class="schedule-row">
                <span>Sábados</span>
                <span class="fw-semibold">10:00 – 14:00</span>
              </div>
              <div class="schedule-row">
                <span>Domingos y festivos</span>
                <span class="text-white-50 fst-italic">Cerrado</span>
              </div>
            </div>
            <NuxtLink to="/sobre-nosotros" class="btn btn-light btn-lg fw-semibold">Cómo llegar</NuxtLink>
          </div>
        </div>
      </transition>

      <!-- Controles laterales -->
      <button class="hero-ctrl hero-ctrl--prev" @click="prev">&#8249;</button>
      <button class="hero-ctrl hero-ctrl--next" @click="next">&#8250;</button>

      <!-- Indicadores -->
      <div class="hero-dots">
        <button
          v-for="i in 3"
          :key="i"
          class="hero-dot"
          :class="{ active: activeSlide === i - 1 }"
          @click="goTo(i - 1)"
        ></button>
      </div>
    </div>

    <div class="container">
      <!-- Carrusel: Novedades (más recientes) -->
      <HomeBookCarousel
        title="Últimas novedades"
        :books="novedades"
        :pending="pendingNovedades"
        view-all-link="/catalogo"
      />

      <!-- Carrusel: Manga -->
      <HomeBookCarousel
        title="Últimas novedades en Manga"
        :books="manga"
        :pending="pendingManga"
        view-all-link="/catalogo?genre=Manga"
      />

      <!-- Carrusel: Juvenil -->
      <HomeBookCarousel
        title="Últimas novedades en Juvenil"
        :books="juvenil"
        :pending="pendingJuvenil"
        view-all-link="/catalogo?genre=Juvenil"
      />

      <!-- Carrusel: Terror -->
      <HomeBookCarousel
        title="Últimas novedades en Terror"
        :books="terror"
        :pending="pendingTerror"
        view-all-link="/catalogo?genre=Terror"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Inicio | Librería Alune', description: 'Tienda de libros online con las mejores novedades' })

const TOTAL_SLIDES = 3
const activeSlide = ref(0)
const transitionName = ref('slide-left')
let timer: ReturnType<typeof setInterval> | null = null

function goTo(index: number) {
  transitionName.value = index > activeSlide.value ? 'slide-left' : 'slide-right'
  activeSlide.value = index
}

function next() {
  goTo((activeSlide.value + 1) % TOTAL_SLIDES)
}

function prev() {
  goTo((activeSlide.value - 1 + TOTAL_SLIDES) % TOTAL_SLIDES)
}

function startTimer() {
  timer = setInterval(next, 5000)
}

function pauseTimer() {
  if (timer) clearInterval(timer)
}

function resumeTimer() {
  pauseTimer()
  startTimer()
}

onMounted(startTimer)
onUnmounted(pauseTimer)

const { data: novedadesData, pending: pendingNovedades } = await useFetch('/api/books', { query: { sort: 'createdAt', limit: 10 } })
const { data: mangaData, pending: pendingManga } = await useFetch('/api/books', { query: { genre: 'Manga', sort: 'createdAt', limit: 10 } })
const { data: juvenilData, pending: pendingJuvenil } = await useFetch('/api/books', { query: { genre: 'Juvenil', sort: 'createdAt', limit: 10 } })
const { data: terrorData, pending: pendingTerror } = await useFetch('/api/books', { query: { genre: 'Terror', sort: 'createdAt', limit: 10 } })

const novedades = computed(() => novedadesData.value?.books ?? [])
const manga = computed(() => mangaData.value?.books ?? [])
const juvenil = computed(() => juvenilData.value?.books ?? [])
const terror = computed(() => terrorData.value?.books ?? [])
</script>

<style scoped>
/* Contenedor del carrusel — altura fija para que no colapse durante la transición */
.hero-carousel {
  position: relative;
  height: 380px;
  overflow: hidden;
}

/* Cada slide ocupa todo el contenedor */
.hero-slide {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  width: 100%;
  height: 100%;
}

.hero-slide--welcome {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
}

.hero-slide--offer {
  background: linear-gradient(135deg, #6a0572 0%, #c0392b 100%);
}

.hero-slide--hours {
  background: linear-gradient(135deg, #1a1a2e 0%, #2c3e50 60%, #1a5276 100%);
}

.hero-eyebrow {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
}

/* Tabla de horarios */
.schedule-grid {
  max-width: 380px;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(4px);
}

.schedule-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 0.95rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.schedule-row:last-child {
  border-bottom: none;
}

/* Controles prev/next */
.hero-ctrl {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.3);
  border: none;
  color: #fff;
  font-size: 1.8rem;
  line-height: 0;
  padding: 0;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.hero-ctrl:hover {
  background: rgba(0, 0, 0, 0.6);
}

.hero-ctrl--prev { left: 16px; }
.hero-ctrl--next { right: 16px; }

/* Indicadores de puntos */
.hero-dots {
  position: absolute;
  bottom: 14px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 10;
}

.hero-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.6);
  background: transparent;
  cursor: pointer;
  padding: 0;
  transition: background 0.2s, border-color 0.2s;
}

.hero-dot.active {
  background: #fff;
  border-color: #fff;
}

/* Transiciones de slide */
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.55s ease;
}

.slide-left-enter-from  { transform: translateX(100%); }
.slide-left-leave-to    { transform: translateX(-100%); }
.slide-right-enter-from { transform: translateX(-100%); }
.slide-right-leave-to   { transform: translateX(100%); }
</style>
