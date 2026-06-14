<template>
  <Teleport to="body">
    <Transition name="toast-pop">
      <div v-if="visible" class="toast-center">
        <div class="toast-inner">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" viewBox="0 0 16 16" class="me-2 flex-shrink-0">
            <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
          </svg>
          {{ message }}
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { message, visible } = useToast()
</script>

<style scoped>
.toast-center {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  pointer-events: none;
}

.toast-inner {
  display: flex;
  align-items: center;
  background: rgba(20, 20, 20, 0.88);
  color: #fff;
  padding: 14px 28px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 500;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(6px);
  max-width: 90vw;
}

.toast-pop-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.toast-pop-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.toast-pop-enter-from {
  opacity: 0;
  transform: scale(0.85);
}
.toast-pop-leave-to {
  opacity: 0;
  transform: scale(0.85);
}
</style>
