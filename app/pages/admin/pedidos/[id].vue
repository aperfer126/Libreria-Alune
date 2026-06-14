<template>
  <div>
    <LayoutBreadcrumb :crumbs="[{ label: 'Admin', to: '/admin' }, { label: 'Pedidos', to: '/admin/pedidos' }, { label: `Pedido #${order?.id}` }]" />
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-md-3">
          <AdminSidebar />
        </div>

        <div class="col-md-9">
          <div v-if="pending" class="text-center py-5"><div class="spinner-border text-primary"></div></div>

          <template v-else-if="order">
            <!-- Cabecera -->
            <div class="d-flex justify-content-between align-items-start mb-4">
              <div>
                <h1 class="h3 fw-bold mb-1">Pedido #{{ order.id }}</h1>
                <span class="text-muted small">{{ formatDate(order.createdAt) }}</span>
              </div>
              <span :class="statusClass(order.status)" class="badge fs-6 px-3 py-2">
                {{ statusLabel(order.status) }}
              </span>
            </div>

            <div class="row g-4">
              <!-- Artículos -->
              <div class="col-lg-8">
                <div class="card shadow-sm">
                  <div class="card-header fw-semibold">📦 Artículos del pedido</div>
                  <div class="card-body p-0">
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
                            <img
                              :src="item.book.coverUrl || '/placeholder-book.png'"
                              :alt="item.book.title"
                              style="width:40px;height:54px;object-fit:cover"
                              class="rounded"
                            />
                          </td>
                          <td>
                            <p class="mb-0 fw-medium">{{ item.book.title }}</p>
                            <p class="mb-0 text-muted small">{{ item.book.author }}</p>
                          </td>
                          <td class="text-center">{{ item.quantity }}</td>
                          <td class="text-end">{{ formatPrice(Number(item.price)) }}</td>
                          <td class="text-end pe-3 fw-semibold">{{ formatPrice(Number(item.price) * item.quantity) }}</td>
                        </tr>
                      </tbody>
                      <tfoot class="table-light">
                        <tr>
                          <td colspan="4" class="text-end fw-bold pe-3">Total</td>
                          <td class="text-end pe-3 fw-bold text-primary fs-5">{{ formatPrice(Number(order.total)) }}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Panel lateral: cliente + envío -->
              <div class="col-lg-4 d-flex flex-column gap-3">
                <!-- Cliente -->
                <div class="card shadow-sm">
                  <div class="card-header fw-semibold">👤 Cliente</div>
                  <div class="card-body">
                    <p class="mb-1 fw-medium">{{ order.user.name }}</p>
                    <p class="mb-0 text-muted small">{{ order.user.email }}</p>
                  </div>
                </div>

                <!-- Dirección de envío -->
                <div class="card shadow-sm">
                  <div class="card-header fw-semibold">🚚 Dirección de envío</div>
                  <div class="card-body">
                    <p v-if="order.shippingAddress" class="mb-0" style="white-space: pre-line">{{ formatShippingAddress(order.shippingAddress) }}</p>
                    <p v-else class="mb-0 text-muted small fst-italic">Sin dirección registrada</p>
                  </div>
                </div>

                <!-- Resumen -->
                <div class="card shadow-sm">
                  <div class="card-header fw-semibold">📋 Resumen</div>
                  <div class="card-body">
                    <dl class="mb-0 small">
                      <div class="d-flex justify-content-between mb-1">
                        <dt class="fw-normal text-muted">Nº de pedido</dt>
                        <dd class="mb-0 fw-semibold">#{{ order.id }}</dd>
                      </div>
                      <div class="d-flex justify-content-between mb-1">
                        <dt class="fw-normal text-muted">Fecha</dt>
                        <dd class="mb-0">{{ formatDate(order.createdAt) }}</dd>
                      </div>
                      <div class="d-flex justify-content-between mb-1">
                        <dt class="fw-normal text-muted">Artículos</dt>
                        <dd class="mb-0">{{ order.items.length }}</dd>
                      </div>
                      <div class="d-flex justify-content-between">
                        <dt class="fw-normal text-muted">Estado</dt>
                        <dd class="mb-0"><span :class="statusClass(order.status)" class="badge">{{ statusLabel(order.status) }}</span></dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <div class="mt-4">
              <NuxtLink to="/admin/pedidos" class="btn btn-outline-secondary">← Volver a pedidos</NuxtLink>
            </div>
          </template>

          <div v-else class="alert alert-danger">Pedido no encontrado.</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatShippingAddress } from '~/composables/useShippingAddress'
definePageMeta({ middleware: 'admin' })

const route = useRoute()
const { data: order, pending } = await useFetch<any>(`/api/admin/orders/${route.params.id}`)

useSeoMeta({ title: computed(() => order.value ? `Pedido #${order.value.id} | Admin` : 'Pedido | Admin') })

function formatPrice(price: number) {
  return price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}
function formatDate(d: string) {
  return new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}
function statusLabel(s: string) {
  return { PENDING: 'Pendiente', PAID: 'Pagado', CANCELLED: 'Cancelado' }[s] ?? s
}
function statusClass(s: string) {
  return { PENDING: 'bg-warning text-dark', PAID: 'bg-success', CANCELLED: 'bg-danger' }[s] ?? 'bg-secondary'
}
</script>
