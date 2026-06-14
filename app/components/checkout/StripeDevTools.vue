<template>
  <div class="stripe-dev-tools">
    <!-- Botón toggle -->
    <button class="stripe-dev-btn" @click="open = !open" :title="open ? 'Cerrar herramientas' : 'Herramientas Stripe'">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
      </svg>
      <span class="stripe-dev-label">Desarrolladores</span>
    </button>

    <!-- Panel -->
    <Transition name="slide">
      <div v-if="open" class="stripe-dev-panel">
        <div class="stripe-dev-header">
          <span class="stripe-logo">stripe</span>
          <span class="stripe-dev-title">Herramientas de prueba</span>
          <button class="stripe-dev-close" @click="open = false">✕</button>
        </div>

        <!-- Relleno mágico -->
        <div class="stripe-dev-section">
          <div class="stripe-dev-section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="#635bff" viewBox="0 0 16 16">
              <path d="M11.251.068a.5.5 0 0 1 .227.58L9.677 6.5H13a.5.5 0 0 1 .364.843l-8 8.5a.5.5 0 0 1-.842-.49L6.323 9.5H3a.5.5 0 0 1-.364-.843l8-8.5a.5.5 0 0 1 .615-.09z"/>
            </svg>
            Relleno mágico
          </div>
          <p class="stripe-dev-desc">Rellena los campos de dirección con datos de prueba.</p>
          <button class="stripe-dev-action-btn" @click="fillAddress">
            ⚡ Rellenar dirección automáticamente
          </button>
        </div>

        <!-- Tarjetas predefinidas -->
        <div class="stripe-dev-section">
          <div class="stripe-dev-section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="#635bff" viewBox="0 0 16 16">
              <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v1h14V4a1 1 0 0 0-1-1H2zm13 4H1v5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V7z"/>
            </svg>
            Tarjetas de prueba
          </div>

          <div v-for="card in testCards" :key="card.number" class="stripe-dev-card" @click="copyCard(card)">
            <div class="stripe-dev-card-header">
              <span :class="['stripe-dev-card-status', card.type]">
                {{ card.type === 'success' ? '✓' : card.type === 'auth' ? '🔐' : '✕' }}
              </span>
              <span class="stripe-dev-card-label">{{ card.label }}</span>
              <button class="stripe-dev-copy-btn" @click.stop="copyToClipboard(card.number)">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                  <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                </svg>
              </button>
            </div>
            <div class="stripe-dev-card-number">···· {{ card.number.slice(-4) }}</div>
            <div class="stripe-dev-card-meta">
              <span>Exp: {{ card.exp }}</span>
              <span>CVC: {{ card.cvc }}</span>
            </div>
          </div>
        </div>

        <!-- Datos extra -->
        <div class="stripe-dev-section">
          <div class="stripe-dev-section-title">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="#635bff" viewBox="0 0 16 16">
              <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
            </svg>
            Datos para los campos
          </div>
          <div class="stripe-dev-info-grid">
            <div v-for="item in quickData" :key="item.label" class="stripe-dev-info-row" @click="copyToClipboard(item.value)">
              <span class="stripe-dev-info-label">{{ item.label }}</span>
              <span class="stripe-dev-info-value">{{ item.value }}</span>
            </div>
          </div>
        </div>

        <!-- Toast interno -->
        <Transition name="fade">
          <div v-if="toastMsg" class="stripe-dev-toast">{{ toastMsg }}</div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  fill: [data: {
    name: string; surname: string; email: string; phone: string
    line1: string; line2: string; city: string; postalCode: string; country: string
  }]
}>()

const open = ref(false)
const toastMsg = ref('')

const testCards = [
  { label: 'Tarjeta correcta',    number: '4242424242424242', exp: '12/34', cvc: '123', type: 'success' },
  { label: 'Requiere 3D Secure',  number: '4000002500003155', exp: '12/34', cvc: '123', type: 'auth' },
  { label: 'Pago rechazado',      number: '4000000000000002', exp: '12/34', cvc: '123', type: 'fail' },
  { label: 'Fondos insuficientes',number: '4000000000009995', exp: '12/34', cvc: '123', type: 'fail' },
]

const testAddress = {
  name: 'Juan',
  surname: 'García López',
  email: 'test@libreria.com',
  phone: '+34 612 345 678',
  line1: 'Calle Mayor 12, 3ºA',
  line2: '',
  city: 'Madrid',
  postalCode: '28001',
  country: 'ES',
}

const quickData = [
  { label: 'Nombre',     value: testAddress.name },
  { label: 'Apellidos',  value: testAddress.surname },
  { label: 'Email',      value: testAddress.email },
  { label: 'Teléfono',   value: testAddress.phone },
  { label: 'Dirección',  value: testAddress.line1 },
  { label: 'Ciudad',     value: testAddress.city },
  { label: 'CP',         value: testAddress.postalCode },
]

function showToast(msg: string) {
  toastMsg.value = msg
  setTimeout(() => { toastMsg.value = '' }, 1800)
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    showToast('Copiado: ' + text)
  } catch {
    showToast('No se pudo copiar')
  }
}

function fillAddress() {
  emit('fill', { ...testAddress })
  showToast('¡Formulario rellenado!')
  open.value = false
}
</script>

<style scoped>
.stripe-dev-tools {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* Botón toggle */
.stripe-dev-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #0a2540;
  color: #fff;
  border: none;
  border-radius: 24px;
  padding: 10px 18px 10px 14px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 16px rgba(0,0,0,.3);
  transition: background .15s;
}
.stripe-dev-btn:hover { background: #1a3a5c; }
.stripe-dev-label { letter-spacing: .02em; }

/* Panel */
.stripe-dev-panel {
  position: absolute;
  bottom: 52px;
  right: 0;
  width: 300px;
  background: #0a2540;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,.5);
  overflow: hidden;
  color: #e3e8f0;
}

.stripe-dev-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px 12px;
  border-bottom: 1px solid rgba(255,255,255,.08);
}
.stripe-logo {
  font-weight: 700;
  font-size: 0.95rem;
  color: #635bff;
  letter-spacing: -.01em;
}
.stripe-dev-title {
  font-size: 0.8rem;
  color: rgba(255,255,255,.6);
  flex: 1;
}
.stripe-dev-close {
  background: none;
  border: none;
  color: rgba(255,255,255,.4);
  cursor: pointer;
  font-size: 0.8rem;
  padding: 2px 4px;
  line-height: 1;
  transition: color .15s;
}
.stripe-dev-close:hover { color: #fff; }

/* Secciones */
.stripe-dev-section {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(255,255,255,.06);
}
.stripe-dev-section:last-child { border-bottom: none; }

.stripe-dev-section-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
}
.stripe-dev-desc {
  font-size: 0.73rem;
  color: rgba(255,255,255,.5);
  margin: 0 0 10px;
  line-height: 1.4;
}
.stripe-dev-action-btn {
  width: 100%;
  background: #635bff;
  border: none;
  border-radius: 6px;
  color: #fff;
  font-size: 0.78rem;
  font-weight: 600;
  padding: 8px;
  cursor: pointer;
  transition: background .15s;
}
.stripe-dev-action-btn:hover { background: #4f46e5; }

/* Tarjetas */
.stripe-dev-card {
  background: rgba(255,255,255,.06);
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 8px;
  cursor: pointer;
  transition: background .15s;
}
.stripe-dev-card:last-child { margin-bottom: 0; }
.stripe-dev-card:hover { background: rgba(255,255,255,.1); }

.stripe-dev-card-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}
.stripe-dev-card-status {
  font-size: 0.7rem;
  font-weight: 700;
  min-width: 16px;
}
.stripe-dev-card-status.success { color: #30c77b; }
.stripe-dev-card-status.auth    { color: #f5a623; }
.stripe-dev-card-status.fail    { color: #f66; }

.stripe-dev-card-label {
  font-size: 0.75rem;
  font-weight: 600;
  color: #e3e8f0;
  flex: 1;
}
.stripe-dev-copy-btn {
  background: none;
  border: none;
  color: rgba(255,255,255,.4);
  cursor: pointer;
  padding: 0;
  transition: color .15s;
}
.stripe-dev-copy-btn:hover { color: #fff; }

.stripe-dev-card-number {
  font-size: 0.78rem;
  font-family: 'Courier New', monospace;
  color: rgba(255,255,255,.7);
  letter-spacing: .05em;
}
.stripe-dev-card-meta {
  display: flex;
  gap: 12px;
  font-size: 0.7rem;
  color: rgba(255,255,255,.4);
  margin-top: 3px;
}

/* Info grid */
.stripe-dev-info-grid { display: flex; flex-direction: column; gap: 4px; }
.stripe-dev-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 8px;
  border-radius: 5px;
  cursor: pointer;
  transition: background .12s;
}
.stripe-dev-info-row:hover { background: rgba(255,255,255,.07); }
.stripe-dev-info-label { font-size: 0.71rem; color: rgba(255,255,255,.45); }
.stripe-dev-info-value {
  font-size: 0.71rem;
  color: rgba(255,255,255,.8);
  font-family: 'Courier New', monospace;
  max-width: 160px;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Toast */
.stripe-dev-toast {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(99,91,255,.95);
  color: #fff;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 20px;
  white-space: nowrap;
  pointer-events: none;
}

/* Transiciones */
.slide-enter-active, .slide-leave-active { transition: opacity .18s, transform .18s; }
.slide-enter-from, .slide-leave-to { opacity: 0; transform: translateY(10px); }

.fade-enter-active, .fade-leave-active { transition: opacity .2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
