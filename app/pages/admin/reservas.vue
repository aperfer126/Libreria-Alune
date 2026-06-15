<template>
  <div>
    <LayoutBreadcrumb :crumbs="[{ label: 'Admin', to: '/admin' }, { label: 'Reservas' }]" />
    <div class="container-fluid py-4">
      <div class="row">

        <div class="col-md-3">
          <AdminSidebar />
        </div>

        <div class="col-md-9">
          <div class="d-flex align-items-center justify-content-between mb-4">
            <div>
              <h4 class="fw-bold mb-0">Reservas pendientes</h4>
              <p class="text-muted small mb-0">Libros agotados con clientes en lista de espera</p>
            </div>
            <span class="badge bg-warning text-dark fs-6">{{ books.length }} libro{{ books.length !== 1 ? 's' : '' }}</span>
          </div>

          <!-- Sin reservas -->
          <div v-if="!pending && books.length === 0" class="text-center py-5 text-muted">
            <div style="font-size: 3rem">📋</div>
            <p class="mt-2">No hay reservas pendientes. Todos los libros tienen stock.</p>
          </div>

          <!-- Skeleton -->
          <div v-else-if="pending" class="row g-3">
            <div v-for="i in 3" :key="i" class="col-12">
              <div class="card placeholder-glow">
                <div class="card-body">
                  <div class="placeholder col-4 mb-2"></div>
                  <div class="placeholder col-2"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Lista de libros con reservas -->
          <div v-else class="row g-3">
            <div v-for="book in books" :key="book.id" class="col-12">
              <div class="card shadow-sm border-0">
                <div class="card-body p-4">
                  <div class="d-flex gap-3 align-items-start">

                    <!-- Portada -->
                    <img
                      :src="book.coverUrl || '/placeholder-book.png'"
                      :alt="book.title"
                      class="rounded"
                      style="width: 56px; height: 80px; object-fit: cover; flex-shrink: 0"
                    />

                    <!-- Info principal -->
                    <div class="flex-grow-1 min-w-0">
                      <div class="d-flex align-items-start justify-content-between gap-2 flex-wrap">
                        <div>
                          <h6 class="fw-bold mb-0">{{ book.title }}</h6>
                          <p class="text-muted small mb-2">{{ book.author }}</p>
                        </div>
                        <div class="d-flex gap-2 flex-shrink-0">
                          <span class="badge bg-danger">Agotado</span>
                          <span class="badge bg-warning text-dark">
                            {{ book._count.reservations }} reserva{{ book._count.reservations !== 1 ? 's' : '' }}
                          </span>
                        </div>
                      </div>

                      <!-- Lista de usuarios -->
                      <div class="mt-2">
                        <p class="small fw-semibold text-muted mb-1">Clientes en espera:</p>
                        <div class="d-flex flex-wrap gap-2">
                          <span
                            v-for="(r, i) in book.reservations"
                            :key="i"
                            class="badge bg-light text-dark border"
                            :title="r.user.email"
                          >
                            {{ r.user.name }}
                            <span class="text-muted ms-1" style="font-weight: 400">· {{ formatDate(r.createdAt) }}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <!-- Acción -->
                    <div class="flex-shrink-0 d-flex flex-column gap-2">
                      <NuxtLink
                        :to="`/admin/libros/${book.id}/editar`"
                        class="btn btn-sm btn-primary"
                      >
                        Actualizar stock
                      </NuxtLink>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { data, pending } = await useFetch<{
  books: {
    id: number
    title: string
    author: string
    coverUrl: string | null
    _count: { reservations: number }
    reservations: { createdAt: string; user: { name: string; email: string } }[]
  }[]
}>('/api/admin/reservations')

const books = computed(() => data.value?.books ?? [])

function formatDate(date: string) {
  return new Date(date).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
}
</script>
