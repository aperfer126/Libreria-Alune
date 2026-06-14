<template>
  <div class="error-page d-flex flex-column align-items-center justify-content-center text-center px-3">
    <div class="error-icon mb-4">📭</div>

    <h1 class="fw-bold mb-2" style="font-size: 5rem; line-height: 1; color: #c0392b;">404</h1>
    <h2 class="fw-semibold mb-3">Página no encontrada</h2>
    <p class="text-muted mb-1" style="max-width: 440px">
      La página que estás buscando no existe o ha sido eliminada.
    </p>
    <p class="text-muted mb-5" style="max-width: 440px">
      Serás redirigido al inicio automáticamente en
      <strong class="text-danger">{{ countdown }}</strong>
      {{ countdown === 1 ? 'segundo' : 'segundos' }}.
    </p>

    <div class="d-flex gap-3">
      <NuxtLink to="/" class="btn btn-primary px-4">Ir al inicio ahora</NuxtLink>
      <button class="btn btn-outline-secondary px-4" @click="$router.back()">Volver atrás</button>
    </div>

    <div class="progress-bar-track mt-5">
      <div class="progress-bar-fill" :style="{ width: progressWidth }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Página no encontrada | Librería Online' })

const router = useRouter()
const SECONDS = 8
const countdown = ref(SECONDS)
const progressWidth = computed(() => `${(countdown.value / SECONDS) * 100}%`)

let interval: ReturnType<typeof setInterval>

onMounted(() => {
  interval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(interval)
      router.push('/')
    }
  }, 1000)
})

onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
.error-page {
  min-height: calc(100vh - 120px);
  background: #f8f9fa;
}

.error-icon {
  font-size: 4rem;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-12px); }
}

.progress-bar-track {
  width: 260px;
  height: 4px;
  background: #dee2e6;
  border-radius: 999px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #c0392b;
  border-radius: 999px;
  transition: width 1s linear;
}
</style>
