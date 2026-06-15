<template>
  <div class="checkout-page">
    <div v-if="!isAuthenticated" class="text-center py-5">
      <p class="fs-5 text-muted mb-3">Debes iniciar sesión para completar tu compra.</p>
      <NuxtLink to="/auth/login?redirect=/checkout" class="btn btn-primary">Iniciar sesión</NuxtLink>
    </div>

    <div v-else-if="cart.items.length === 0" class="text-center py-5">
      <p class="fs-4 text-muted mb-3">No hay artículos en el carrito.</p>
      <NuxtLink to="/catalogo" class="btn btn-primary">Ir al catálogo</NuxtLink>
    </div>

    <div v-else class="checkout-wrap">

      <!-- Columna izquierda: formulario unificado -->
      <div class="checkout-form-col">
        <div class="d-flex align-items-center gap-2 mb-4">
          <NuxtLink to="/carrito" class="text-decoration-none text-muted fs-5">←</NuxtLink>
          <h1 class="h4 fw-bold mb-0">Finalizar compra</h1>
        </div>

        <form @submit.prevent="handleSubmit">

          <!-- Sección 1: Dirección de envío -->
          <div class="checkout-section mb-3">
            <div class="checkout-section-title">
              <span class="checkout-step-badge">1</span>
              Dirección de envío
            </div>

            <div class="row g-3">
              <div class="col-6">
                <label class="field-label">Nombre</label>
                <input v-model="addr.name" type="text" class="form-control form-control-sm" placeholder="Juan" required />
              </div>
              <div class="col-6">
                <label class="field-label">Apellidos</label>
                <input v-model="addr.surname" type="text" class="form-control form-control-sm" placeholder="García López" />
              </div>
              <div class="col-12">
                <label class="field-label">Correo electrónico</label>
                <input v-model="addr.email" type="email" class="form-control form-control-sm" placeholder="correo@ejemplo.com" required />
              </div>
              <div class="col-12">
                <label class="field-label">Teléfono <span class="text-muted fw-normal">(opcional)</span></label>
                <input v-model="addr.phone" type="tel" class="form-control form-control-sm" placeholder="+34 612 345 678" />
              </div>
              <div class="col-12">
                <label class="field-label">Dirección</label>
                <input v-model="addr.line1" type="text" class="form-control form-control-sm" placeholder="Calle Mayor 12, 3ºA" required />
              </div>
              <div class="col-12">
                <label class="field-label">Dirección (línea 2) <span class="text-muted fw-normal">(opcional)</span></label>
                <input v-model="addr.line2" type="text" class="form-control form-control-sm" placeholder="Piso, puerta…" />
              </div>
              <div class="col-7">
                <label class="field-label">Ciudad</label>
                <input v-model="addr.city" type="text" class="form-control form-control-sm" placeholder="Madrid" required />
              </div>
              <div class="col-5">
                <label class="field-label">Código postal</label>
                <input v-model="addr.postalCode" type="text" class="form-control form-control-sm" placeholder="28001" required />
              </div>
              <div class="col-12">
                <label class="field-label">País</label>
                <select v-model="addr.country" class="form-select form-select-sm">
                  <option value="ES">España</option>
                  <option value="PT">Portugal</option>
                  <option value="FR">Francia</option>
                  <option value="DE">Alemania</option>
                  <option value="IT">Italia</option>
                  <option value="GB">Reino Unido</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Sección 2: Pago con tarjeta -->
          <div class="checkout-section mb-3">
            <div class="checkout-section-title">
              <span class="checkout-step-badge">2</span>
              Pago seguro
              <span class="ms-auto d-flex align-items-center gap-1 text-muted" style="font-size:.72rem;font-weight:400">
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                </svg>
                Cifrado SSL
              </span>
            </div>

            <div v-if="loadingStripe" class="text-center py-4">
              <div class="spinner-border spinner-border-sm text-primary me-2"></div>
              <span class="text-muted small">Cargando datos de pago...</span>
            </div>

            <!-- Stripe Card Elements (sin sección Link) -->
            <div :class="{ 'd-none': loadingStripe }">
              <div class="mb-3">
                <label class="field-label">Número de tarjeta</label>
                <div id="card-number" class="stripe-field"></div>
              </div>
              <div class="row g-3">
                <div class="col-6">
                  <label class="field-label">Fecha de caducidad</label>
                  <div id="card-expiry" class="stripe-field"></div>
                </div>
                <div class="col-6">
                  <label class="field-label">Código de seguridad</label>
                  <div id="card-cvc" class="stripe-field"></div>
                </div>
              </div>
            </div>

            <div v-if="paymentError" class="alert alert-danger py-2 small mt-3 mb-0">{{ paymentError }}</div>
          </div>

          <!-- Botón pagar -->
          <button
            type="submit"
            class="btn btn-primary w-100 py-3 fw-semibold"
            :disabled="paying || loadingStripe"
            style="font-size:1rem;border-radius:10px"
          >
            <span v-if="paying">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Procesando pago...
            </span>
            <span v-else>
              Pagar {{ formatPrice(cart.total >= 50 ? cart.total : cart.total + 4.99) }}
            </span>
          </button>

          <p class="text-center text-muted mt-3 mb-0 small">
            Al pagar aceptas nuestras condiciones de compra.
          </p>
        </form>
      </div>

      <!-- Columna derecha: resumen del pedido -->
      <div class="checkout-summary-col">
        <div class="checkout-summary-card">
          <h2 class="h6 fw-semibold text-muted text-uppercase mb-3" style="letter-spacing:.06em">Tu pedido</h2>
          <ul class="list-unstyled mb-3">
            <li v-for="item in cart.items" :key="item.bookId" class="d-flex align-items-center gap-3 mb-3">
              <div class="position-relative flex-shrink-0">
                <img
                  :src="item.coverUrl || '/placeholder-book.png'"
                  :alt="item.title"
                  class="rounded"
                  style="width:52px;height:70px;object-fit:cover;box-shadow:0 2px 8px rgba(0,0,0,.15)"
                />
                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-dark" style="font-size:0.6rem;min-width:1.25rem">
                  {{ item.quantity }}
                </span>
              </div>
              <div class="flex-grow-1 min-w-0">
                <p class="mb-0 fw-medium small text-truncate">{{ item.title }}</p>
                <p class="mb-0 text-muted" style="font-size:0.72rem">{{ item.quantity }} × {{ formatPrice(item.price) }}</p>
              </div>
              <span class="fw-semibold small text-nowrap">{{ formatPrice(item.price * item.quantity) }}</span>
            </li>
          </ul>
          <hr />
          <div class="d-flex justify-content-between small text-muted mb-1">
            <span>Subtotal</span><span>{{ formatPrice(cart.total) }}</span>
          </div>
          <div class="d-flex justify-content-between small mb-3">
            <span class="text-muted">Envío</span>
            <span :class="cart.total >= 50 ? 'text-success fw-medium' : 'text-muted'">
              {{ cart.total >= 50 ? 'Gratis' : formatPrice(4.99) }}
            </span>
          </div>
          <hr />
          <div class="d-flex justify-content-between align-items-baseline mt-2">
            <span class="fw-semibold">Total</span>
            <span class="fw-bold fs-5 text-primary">
              {{ formatPrice(cart.total >= 50 ? cart.total : cart.total + 4.99) }}
            </span>
          </div>
          <p class="text-center text-muted mt-4 mb-0 small d-flex align-items-center justify-content-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
            </svg>
            Pago 100% seguro con Stripe
          </p>
        </div>
      </div>
    </div>

    <!-- Herramientas de desarrollador (solo ADMIN/MODERADOR) -->
    <CheckoutStripeDevTools v-if="isStaff" @fill="autoFillAddress" />
  </div>
</template>

<script setup lang="ts">
import { loadStripe, type Stripe, type StripeElements, type StripeCardNumberElement } from '@stripe/stripe-js'
import { useCartStore } from '~/stores/cart'

useSeoMeta({ title: 'Finalizar compra | Librería Alune' })

const cart = useCartStore()
const { status, data: session } = useAuth()
const config = useRuntimeConfig()
const router = useRouter()

const isAuthenticated = computed(() => status.value === 'authenticated')
const userRole = computed(() => (session.value?.user as { role?: string })?.role)
const isStaff = computed(() => ['ADMIN', 'MODERATOR'].includes(userRole.value ?? ''))

const loadingStripe = ref(true)
const paymentError = ref('')
const paying = ref(false)

const addr = reactive({
  name: '',
  surname: '',
  email: (session.value?.user?.email as string) ?? '',
  phone: '',
  line1: '',
  line2: '',
  city: '',
  postalCode: '',
  country: 'ES',
})

let stripe: Stripe | null = null
let elements: StripeElements | null = null
let cardNumberEl: StripeCardNumberElement | null = null

function formatPrice(price: number) {
  return price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}

async function initStripe() {
  if (!isAuthenticated.value || cart.items.length === 0) return

  loadingStripe.value = true
  paymentError.value = ''

  try {
    stripe = await loadStripe(config.public.stripePublicKey as string)
    if (!stripe) throw new Error('No se pudo cargar Stripe')

    const fieldStyle = {
      base: {
        fontSize: '14px',
        color: '#1a1a2e',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        '::placeholder': { color: '#9ca3af' },
      },
      invalid: { color: '#dc3545' },
    }

    elements = stripe.elements({ locale: 'es' })

    cardNumberEl = elements.create('cardNumber', { style: fieldStyle, showIcon: true })
    cardNumberEl.mount('#card-number')

    elements.create('cardExpiry', { style: fieldStyle }).mount('#card-expiry')
    elements.create('cardCvc', { style: fieldStyle }).mount('#card-cvc')

    loadingStripe.value = false
  } catch (e: any) {
    paymentError.value = e.data?.statusMessage || e.message || 'Error al preparar el pago'
    loadingStripe.value = false
  }
}

async function handleSubmit() {
  if (!stripe || !cardNumberEl) return

  paying.value = true
  paymentError.value = ''

  try {
    // Crear pedido y PaymentIntent con la dirección ya rellenada por el usuario
    const shippingAddress = JSON.stringify({
      name: addr.name, surname: addr.surname, email: addr.email,
      phone: addr.phone, line1: addr.line1, line2: addr.line2,
      city: addr.city, postalCode: addr.postalCode, country: addr.country,
    })

    const { clientSecret, orderId } = await $fetch<{ clientSecret: string; orderId: number }>('/api/orders', {
      method: 'POST',
      body: {
        items: cart.items.map(i => ({ bookId: i.bookId, quantity: i.quantity })),
        shippingAddress,
        customerEmail: addr.email,
      },
    })

    const baseUrl = window.location.origin

    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardNumberEl,
        billing_details: {
          name: `${addr.name} ${addr.surname}`.trim(),
          email: addr.email,
          phone: addr.phone || undefined,
          address: {
            line1: addr.line1,
            line2: addr.line2 || undefined,
            city: addr.city,
            postal_code: addr.postalCode,
            country: addr.country,
          },
        },
      },
      return_url: `${baseUrl}/checkout/return`,
    })

    if (error) {
      paymentError.value = error.message ?? 'El pago ha fallado. Inténtalo de nuevo.'
      paying.value = false
    } else {
      cart.clear()
      router.push(`/checkout/return?success=1&order=${orderId}`)
    }
  } catch (e: any) {
    paymentError.value = e.data?.statusMessage || e.message || 'Error al procesar el pago'
    paying.value = false
  }
}

function autoFillAddress(data: typeof addr) {
  Object.assign(addr, data)
}

onMounted(async () => {
  if (status.value === 'authenticated') {
    await nextTick()
    await initStripe()
  }
})

watch(status, async (val) => {
  if (val === 'authenticated') {
    await nextTick()
    await initStripe()
  }
})
</script>

<style scoped>
.checkout-page {
  background: #f8f9fa;
  min-height: calc(100vh - 120px);
  padding: 2.5rem 1rem;
}
.checkout-wrap {
  display: flex;
  gap: 2rem;
  max-width: 960px;
  margin: 0 auto;
  align-items: flex-start;
}
.checkout-form-col {
  flex: 1 1 58%;
  min-width: 0;
}
.checkout-section {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
}
.checkout-section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  font-size: 0.92rem;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
}
.checkout-step-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #0d6efd;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  flex-shrink: 0;
}
.checkout-summary-col {
  flex: 0 0 38%;
  max-width: 360px;
}
.checkout-summary-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.5rem;
  position: sticky;
  top: 90px;
}
.field-label {
  font-size: 0.78rem;
  font-weight: 500;
  color: #4b5563;
  margin-bottom: 4px;
  display: block;
}
.stripe-field {
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 9px 12px;
  background: #fff;
  transition: border-color .15s, box-shadow .15s;
}
.stripe-field:focus-within {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13,110,253,.15);
}
@media (max-width: 768px) {
  .checkout-wrap { flex-direction: column; }
  .checkout-summary-col { max-width: 100%; width: 100%; order: -1; }
}
</style>
