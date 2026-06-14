<template>
  <Teleport to="body">
    <Transition name="confirm-fade">
      <div v-if="state.visible" class="confirm-overlay" @click.self="cancel">
        <div class="confirm-box" role="dialog" aria-modal="true">
          <div class="confirm-header">
            <span class="confirm-icon" :class="state.isDanger ? 'danger' : 'warning'">
              <svg v-if="state.isDanger" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
              </svg>
            </span>
            <h5 class="confirm-title mb-0">{{ state.title }}</h5>
          </div>
          <p class="confirm-message">{{ state.message }}</p>
          <div class="confirm-actions">
            <button class="btn btn-outline-secondary" @click="cancel">Cancelar</button>
            <button
              class="btn"
              :class="state.isDanger ? 'btn-danger' : 'btn-primary'"
              @click="accept"
            >
              {{ state.confirmLabel }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { state, accept, cancel } = useConfirm()

onMounted(() => {
  window.addEventListener('keydown', onKey)
})
onUnmounted(() => {
  window.removeEventListener('keydown', onKey)
})

function onKey(e: KeyboardEvent) {
  if (!state.visible) return
  if (e.key === 'Escape') cancel()
  if (e.key === 'Enter') accept()
}
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.confirm-box {
  background: #fff;
  border-radius: 14px;
  padding: 28px 32px;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.25);
  animation: pop-in 0.18s ease;
}

@keyframes pop-in {
  from { transform: scale(0.92); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
}

.confirm-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.confirm-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
}

.confirm-icon.danger {
  background: #fde8e8;
  color: #c0392b;
}

.confirm-icon.warning {
  background: #fef3cd;
  color: #856404;
}

.confirm-title {
  font-weight: 700;
  font-size: 1.05rem;
  color: #1a1a1a;
}

.confirm-message {
  color: #555;
  font-size: 0.9rem;
  margin-bottom: 24px;
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.confirm-fade-enter-active,
.confirm-fade-leave-active {
  transition: opacity 0.18s ease;
}
.confirm-fade-enter-from,
.confirm-fade-leave-to {
  opacity: 0;
}
</style>
