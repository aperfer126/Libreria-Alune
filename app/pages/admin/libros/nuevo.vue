<template>
  <div>
  <LayoutBreadcrumb :crumbs="[{ label: 'Admin', to: '/admin' }, { label: 'Libros', to: '/admin/libros' }, { label: 'Nuevo libro' }]" />
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-md-2">
        <AdminSidebar />
      </div>

      <div class="col-md-10">
        <h1 class="h3 fw-bold mb-4">Añadir nuevo libro</h1>

        <div v-if="error" class="alert alert-danger mb-3">{{ error }}</div>

        <div class="card shadow-sm">
          <div class="card-body">
            <AdminBookForm submit-label="Crear libro" :loading="loading" @submit="create" />
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin' })
useSeoMeta({ title: 'Nuevo libro | Admin | Librería Alune' })

const router = useRouter()
const { show: showToast } = useToast()
const loading = ref(false)
const error = ref('')

async function create(form: Record<string, any>) {
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/books', { method: 'POST', body: form })
    showToast(`"${form.title}" añadido al catálogo`)
    router.push('/admin/libros')
  } catch (e: any) {
    error.value = e.data?.statusMessage || 'Error al crear el libro'
  } finally {
    loading.value = false
  }
}
</script>
