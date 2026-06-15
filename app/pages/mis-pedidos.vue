<template>
  <div class="container py-5">
    <h1 class="h3 fw-bold mb-4">Mis pedidos</h1>

    <div v-if="pending" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
    </div>

    <div v-else-if="!orders?.length" class="text-center py-5 text-muted">
      <p class="fs-5">Aún no has realizado ningún pedido.</p>
      <NuxtLink to="/catalogo" class="btn btn-primary">Explorar catálogo</NuxtLink>
    </div>

    <div v-else class="d-flex flex-column gap-4">
      <div v-for="order in orders" :key="order.id" class="card shadow-sm">
        <!-- Cabecera del pedido -->
        <div class="card-header">
          <div class="d-flex flex-wrap justify-content-between align-items-center gap-2">
            <div class="d-flex align-items-center gap-3">
              <span class="fw-bold">Pedido <span class="text-primary">#{{ order.id }}</span></span>
              <span class="text-muted small">{{ formatDate(order.createdAt) }}</span>
            </div>
            <span :class="statusClass(order.status)" class="badge px-3 py-2">{{ statusLabel(order.status) }}</span>
          </div>
        </div>

        <div class="card-body p-0">
          <!-- Artículos -->
          <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
              <tr>
                <th class="ps-3" colspan="2">Libro</th>
                <th class="text-center">Cantidad</th>
                <th class="text-end">Precio ud.</th>
                <th class="text-end pe-3">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in order.items" :key="item.id">
                <td class="ps-3" style="width:52px">
                  <NuxtLink :to="`/libro/${item.book.id}`">
                    <img
                      :src="item.book.coverUrl || '/placeholder-book.png'"
                      :alt="item.book.title"
                      style="width:40px;height:54px;object-fit:cover"
                      class="rounded"
                    />
                  </NuxtLink>
                </td>
                <td>
                  <NuxtLink :to="`/libro/${item.book.id}`" class="text-decoration-none text-body">
                    <p class="mb-0 fw-medium">{{ item.book.title }}</p>
                    <p class="mb-0 text-muted small">{{ item.book.author }}</p>
                  </NuxtLink>
                </td>
                <td class="text-center text-muted">{{ item.quantity }}</td>
                <td class="text-end text-muted small">{{ formatPrice(Number(item.price)) }}</td>
                <td class="text-end pe-3 fw-semibold">{{ formatPrice(Number(item.price) * item.quantity) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pie: dirección + total -->
        <div class="card-footer bg-white">
          <div class="row align-items-start g-2">
            <div class="col-md-7">
              <p class="mb-1 small fw-semibold text-muted">🚚 Dirección de envío</p>
              <p v-if="formatShippingAddress(order.shippingAddress)" class="mb-0 small" style="white-space: pre-line">{{ formatShippingAddress(order.shippingAddress) }}</p>
              <p v-else class="mb-0 small text-muted fst-italic">Sin dirección registrada</p>
            </div>
            <div class="col-md-5 text-md-end">
              <p class="mb-0 text-muted small">Total del pedido</p>
              <p class="mb-0 fw-bold text-primary fs-5">{{ formatPrice(Number(order.total)) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatShippingAddress } from '~/composables/useShippingAddress'
definePageMeta({ middleware: 'auth' })
useSeoMeta({ title: 'Mis pedidos | Librería Alune' })

const { data: orders, pending } = await useFetch('/api/orders', {
  query: {},
  transform: (data: any[]) => data,
})

function formatPrice(price: number) {
  return price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
}

function statusLabel(status: string) {
  return { PENDING: 'Pendiente', PAID: 'Pagado', CANCELLED: 'Cancelado' }[status] ?? status
}

function statusClass(status: string) {
  return { PENDING: 'bg-warning text-dark', PAID: 'bg-success', CANCELLED: 'bg-danger' }[status] ?? 'bg-secondary'
}
</script>
