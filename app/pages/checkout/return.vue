<template>
  <div class="container py-5 text-center">
    <div v-if="pending" class="py-5">
      <div class="spinner-border text-primary mb-3"></div>
      <p class="text-muted">Confirmando tu pago...</p>
    </div>

    <div v-else-if="success" class="py-5">
      <div class="display-1 mb-3">✅</div>
      <h1 class="h2 fw-bold text-success mb-3">¡Pedido realizado con éxito!</h1>
      <p class="text-muted mb-4">Tu pago se ha procesado correctamente. Puedes ver el estado de tu pedido en tu perfil.</p>
      <NuxtLink to="/" class="btn btn-primary me-2">Ir al inicio</NuxtLink>
      <NuxtLink to="/mis-pedidos" class="btn btn-outline-secondary">Ver mis pedidos</NuxtLink>
    </div>

    <div v-else class="py-5">
      <div class="display-1 mb-3">❌</div>
      <h1 class="h2 fw-bold mb-3">Pago no completado</h1>
      <p class="text-muted mb-4">{{ errorMsg || 'El pago no se ha podido procesar.' }}</p>
      <NuxtLink to="/checkout" class="btn btn-primary me-2">Intentar de nuevo</NuxtLink>
      <NuxtLink to="/carrito" class="btn btn-outline-secondary">Volver al carrito</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { loadStripe } from '@stripe/stripe-js'
import { useCartStore } from '~/stores/cart'

useSeoMeta({ title: 'Confirmación de pedido | Librería Alune' })

const route = useRoute()
const config = useRuntimeConfig()
const cart = useCartStore()

const pending = ref(true)
const success = ref(false)
const errorMsg = ref('')

onMounted(async () => {
  // Éxito directo (sin redirección 3DS)
  if (route.query.success === '1') {
    success.value = true
    pending.value = false
    return
  }

  // Vuelta desde redirección 3DS de Stripe
  const paymentIntentClientSecret = route.query.payment_intent_client_secret as string
  if (!paymentIntentClientSecret) {
    pending.value = false
    errorMsg.value = 'No se encontró información del pago.'
    return
  }

  try {
    const stripe = await loadStripe(config.public.stripePublicKey as string)
    if (!stripe) throw new Error()

    const { paymentIntent } = await stripe.retrievePaymentIntent(paymentIntentClientSecret)
    if (paymentIntent?.status === 'succeeded') {
      cart.clear()
      success.value = true
    } else {
      errorMsg.value = 'El pago no se completó correctamente.'
    }
  } catch {
    errorMsg.value = 'No se pudo verificar el estado del pago.'
  } finally {
    pending.value = false
  }
})
</script>
