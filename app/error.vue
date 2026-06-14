<template>
  <div class="error-page d-flex flex-column align-items-center justify-content-center text-center px-3">
    <div class="error-icon mb-4">{{ icon }}</div>

    <h1 class="fw-bold mb-2" style="font-size: 5rem; line-height: 1; color: #c0392b;">{{ code }}</h1>
    <h2 class="fw-semibold mb-3">{{ title }}</h2>
    <p class="text-muted mb-1" style="max-width: 440px">{{ message }}</p>
    <p class="text-muted mb-5" style="max-width: 440px">
      Serás redirigido al inicio automáticamente en
      <strong class="text-danger">{{ countdown }}</strong>
      {{ countdown === 1 ? 'segundo' : 'segundos' }}.
    </p>

    <div class="d-flex gap-3">
      <a href="/" class="btn btn-primary px-4">Ir al inicio ahora</a>
      <button class="btn btn-outline-secondary px-4" @click="goBack">Volver atrás</button>
    </div>

    <div class="progress-bar-track mt-5">
      <div class="progress-bar-fill" :style="{ width: progressWidth }"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
// En Nuxt 3, error.vue recibe el error como prop (no useError())
const props = defineProps<{ error: { statusCode?: number; message?: string } }>()

const code = props.error?.statusCode ?? 404

const icon = code === 404 ? '📭' : code === 403 ? '🔒' : '⚠️'

const title =
  code === 404 ? 'Página no encontrada' :
  code === 403 ? 'Acceso denegado' :
  'Algo ha ido mal'

const message =
  code === 404 ? 'La página que estás buscando no existe o ha sido eliminada.' :
  code === 403 ? 'No tienes permiso para acceder a esta página.' :
  'Se ha producido un error inesperado. Por favor, inténtalo de nuevo más tarde.'

const SECONDS = 8
const countdown = ref(SECONDS)
const progressWidth = computed(() => `${(countdown.value / SECONDS) * 100}%`)

function goBack() {
  if (typeof window !== 'undefined') window.history.back()
}

let interval: ReturnType<typeof setInterval>

onMounted(() => {
  interval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(interval)
      clearError({ redirect: '/' })
    }
  }, 1000)
})

onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
.error-page {
  min-height: 100vh;
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
