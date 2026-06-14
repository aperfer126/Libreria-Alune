<template>
  <div>
  <LayoutBreadcrumb :crumbs="[{ label: 'Carrito' }]" />
  <div class="container py-5">
    <h1 class="h3 fw-bold mb-4">Tu carrito</h1>

    <div v-if="cart.items.length === 0" class="text-center py-5">
      <p class="fs-4 text-muted mb-4">El carrito está vacío.</p>
      <NuxtLink to="/catalogo" class="btn btn-primary">Ir al catálogo</NuxtLink>
    </div>

    <div v-else class="row g-4">
      <!-- Tabla de artículos -->
      <div class="col-lg-8">
        <div class="card shadow-sm">
          <div class="card-body p-0">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-3">Libro</th>
                  <th class="text-center" style="width:140px">Cantidad</th>
                  <th class="text-end" style="width:100px">Precio/ud.</th>
                  <th class="text-end" style="width:110px">Subtotal</th>
                  <th style="width:40px"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in cart.items" :key="item.bookId">
                  <!-- Libro -->
                  <td class="ps-3">
                    <NuxtLink :to="`/libro/${item.bookId}`" class="d-flex align-items-center gap-3 text-decoration-none text-dark">
                      <img
                        :src="item.coverUrl || '/placeholder-book.png'"
                        :alt="item.title"
                        style="width: 44px; height: 60px; object-fit: cover"
                        class="rounded"
                      />
                      <div>
                        <p class="mb-0 fw-semibold lh-sm">{{ item.title }}</p>
                        <p class="mb-0 text-muted small">{{ item.author }}</p>
                      </div>
                    </NuxtLink>
                  </td>

                  <!-- Cantidad -->
                  <td class="text-center">
                    <div class="input-group input-group-sm justify-content-center" style="width: 110px; margin: 0 auto">
                      <button class="btn btn-outline-secondary" @click="cart.decreaseItem(item.bookId)">−</button>
                      <span class="input-group-text bg-white px-3">{{ item.quantity }}</span>
                      <button class="btn btn-outline-secondary" @click="cart.addItem({ bookId: item.bookId, title: item.title, author: item.author, price: item.price, coverUrl: item.coverUrl })">+</button>
                    </div>
                  </td>

                  <!-- Precio unitario -->
                  <td class="text-end text-muted small">
                    {{ formatPrice(item.price) }}
                  </td>

                  <!-- Subtotal fila -->
                  <td class="text-end fw-semibold">
                    {{ formatPrice(item.price * item.quantity) }}
                  </td>

                  <!-- Eliminar -->
                  <td class="text-end pe-3">
                    <button class="btn btn-sm btn-outline-danger" @click="cart.removeItem(item.bookId)">✕</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Resumen del pedido -->
      <div class="col-lg-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <h5 class="fw-bold mb-3">Resumen del pedido</h5>

            <!-- Desglose por libro -->
            <div
              v-for="item in cart.items"
              :key="item.bookId"
              class="d-flex justify-content-between align-items-start mb-1"
            >
              <span class="text-muted small text-truncate me-2" style="max-width: 55%">
                {{ item.title }}
                <span class="text-secondary"> × {{ item.quantity }}</span>
              </span>
              <span class="small fw-medium text-nowrap">{{ formatPrice(item.price * item.quantity) }}</span>
            </div>

            <hr class="my-3" />

            <!-- Subtotal -->
            <div class="d-flex justify-content-between mb-2">
              <span class="text-muted">Subtotal ({{ cart.count }} art.)</span>
              <span class="fw-medium">{{ formatPrice(cart.total) }}</span>
            </div>

            <!-- Envío -->
            <div class="d-flex justify-content-between align-items-center mb-3">
              <span class="text-muted">Envío</span>
              <span v-if="shippingFree" class="text-success fw-medium">Gratis</span>
              <span v-else class="fw-medium">
                4,99 €
                <span class="d-block text-muted" style="font-size:0.7rem">
                  Gratis a partir de 50 €
                  (faltan {{ formatPrice(50 - cart.total) }})
                </span>
              </span>
            </div>

            <!-- Barra de progreso hacia envío gratis -->
            <div v-if="!shippingFree" class="mb-3">
              <div class="progress" style="height: 6px">
                <div
                  class="progress-bar bg-success"
                  :style="{ width: Math.min((cart.total / 50) * 100, 100) + '%' }"
                ></div>
              </div>
            </div>

            <hr class="my-3" />

            <!-- Total final -->
            <div class="d-flex justify-content-between fw-bold fs-5 mb-4">
              <span>Total</span>
              <span class="text-primary">{{ formatPrice(orderTotal) }}</span>
            </div>

            <button class="btn btn-primary w-100 btn-lg" @click="goToCheckout">
              Proceder al pago
            </button>
            <NuxtLink to="/catalogo" class="btn btn-outline-secondary w-100 mt-2">
              Seguir comprando
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

useSeoMeta({ title: 'Carrito | Librería Alune' })

const cart = useCartStore()
const { status } = useAuth()
const router = useRouter()

function goToCheckout() {
  if (status.value !== 'authenticated') {
    router.push('/auth/login?callbackUrl=/checkout')
    return
  }
  router.push('/checkout')
}

const shippingFree = computed(() => cart.total >= 50)
const shippingCost = computed(() => shippingFree.value ? 0 : 4.99)
const orderTotal = computed(() => cart.total + shippingCost.value)

function formatPrice(price: number) {
  return price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}
</script>
