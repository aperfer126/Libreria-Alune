<template>
  <div>
  <LayoutBreadcrumb :crumbs="[{ label: 'Admin', to: '/admin' }, { label: 'Pedidos' }]" />
  <div class="container-fluid py-4">
    <div class="row">
      <!-- Sidebar + Filtros -->
      <div class="col-md-3">
        <AdminSidebar />

        <div class="card shadow-sm mt-3">
          <div class="card-body p-3">
            <h6 class="fw-semibold mb-3">Filtros</h6>

            <label class="form-label small text-muted mb-1">Buscar cliente</label>
            <div class="input-group input-group-sm mb-3">
              <span class="input-group-text bg-white border-end-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="#888" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
                </svg>
              </span>
              <input
                v-model="search"
                type="search"
                class="form-control border-start-0 ps-0"
                placeholder="Nombre o email..."
                @keyup.escape="search = ''"
              />
            </div>

            <label class="form-label small text-muted mb-1">Estado</label>
            <select v-model="filterStatus" class="form-select form-select-sm mb-3">
              <option value="">Todos los estados</option>
              <option value="PENDING">Pendiente</option>
              <option value="PAID">Pagado</option>
              <option value="CANCELLED">Cancelado</option>
            </select>

            <button
              v-if="search || filterStatus"
              class="btn btn-outline-secondary btn-sm w-100"
              @click="resetFilters"
            >
              Limpiar filtros
            </button>
          </div>
        </div>
      </div>

      <!-- Contenido -->
      <div class="col-md-9">
        <div class="mb-4">
          <h1 class="h3 fw-bold mb-0">Pedidos</h1>
          <p v-if="hasFilters" class="text-muted small mb-0 mt-1">
            {{ filtered.length }} resultado{{ filtered.length !== 1 ? 's' : '' }} encontrado{{ filtered.length !== 1 ? 's' : '' }}
          </p>
        </div>

        <div v-if="pending" class="text-center py-5"><div class="spinner-border text-primary"></div></div>

        <div v-else class="card shadow-sm">
          <div class="table-responsive">
            <table class="table table-hover mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-3">#</th>
                  <th>Cliente</th>
                  <th>Artículos</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in filtered" :key="order.id">
                  <td class="ps-3 fw-semibold">#{{ order.id }}</td>
                  <td>
                    <div class="fw-medium" v-html="highlight(order.user?.name ?? '')"></div>
                    <div class="text-muted small" v-html="highlight(order.user?.email ?? '')"></div>
                  </td>
                  <td class="text-muted small">{{ order.items.length }} artículo(s)</td>
                  <td class="fw-bold">{{ formatPrice(Number(order.total)) }}</td>
                  <td><span :class="statusClass(order.status)" class="badge">{{ statusLabel(order.status) }}</span></td>
                  <td class="text-muted small">{{ new Date(order.createdAt).toLocaleDateString('es-ES') }}</td>
                  <td><NuxtLink :to="`/admin/pedidos/${order.id}`" class="btn btn-sm btn-outline-secondary">Ver detalle</NuxtLink></td>
                </tr>
                <tr v-if="filtered.length === 0">
                  <td colspan="7" class="text-center text-muted py-4">
                    {{ hasFilters ? 'No se encontraron pedidos con los filtros aplicados.' : 'No hay pedidos todavía.' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin' })
useSeoMeta({ title: 'Pedidos | Admin | Librería Alune' })

const { data: ordersData, pending } = await useFetch('/api/orders')
const orders = computed(() => (ordersData.value as any[]) ?? [])

const search = ref('')
const filterStatus = ref('')

const hasFilters = computed(() => !!(search.value || filterStatus.value))

function resetFilters() {
  search.value = ''
  filterStatus.value = ''
}

const filtered = computed(() => {
  let list = orders.value
  const q = search.value.trim().toLowerCase()
  if (q) {
    list = list.filter((o: any) =>
      o.user?.name?.toLowerCase().includes(q) ||
      o.user?.email?.toLowerCase().includes(q)
    )
  }
  if (filterStatus.value) list = list.filter((o: any) => o.status === filterStatus.value)
  return list
})

function highlight(text: string) {
  const q = search.value.trim()
  if (!q) return text
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(re, '<mark class="px-0 bg-warning-subtle rounded-1">$1</mark>')
}

function formatPrice(price: number) {
  return price.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
}
function statusLabel(s: string) {
  return { PENDING: 'Pendiente', PAID: 'Pagado', CANCELLED: 'Cancelado' }[s] ?? s
}
function statusClass(s: string) {
  return { PENDING: 'bg-warning text-dark', PAID: 'bg-success', CANCELLED: 'bg-danger' }[s] ?? 'bg-secondary'
}
</script>
