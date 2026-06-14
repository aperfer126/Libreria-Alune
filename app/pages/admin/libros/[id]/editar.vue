<template>
  <div>
  <LayoutBreadcrumb :crumbs="[{ label: 'Admin', to: '/admin' }, { label: 'Libros', to: '/admin/libros' }, { label: 'Editar libro' }]" />
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-md-2">
        <AdminSidebar />
      </div>

      <div class="col-md-10">
        <h1 class="h3 fw-bold mb-4">Editar libro</h1>

        <div v-if="pending" class="text-center py-5"><div class="spinner-border text-primary"></div></div>

        <template v-else-if="book">
          <div v-if="error" class="alert alert-danger mb-3">{{ error }}</div>

          <div class="card shadow-sm">
            <div class="card-body">
              <AdminBookForm :initial="book" submit-label="Guardar cambios" :loading="loading" @submit="update" />
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin' })
useSeoMeta({ title: 'Editar libro | Admin | Librería Online' })

const route = useRoute()
const router = useRouter()
const { data: book, pending } = await useFetch<any>(`/api/books/${route.params.id}`)

const { show: showToast } = useToast()
const loading = ref(false)
const error = ref('')

async function update(form: Record<string, any>) {
  loading.value = true
  error.value = ''
  try {
    await $fetch(`/api/books/${route.params.id}`, { method: 'PUT', body: form })
    showToast(`"${form.title}" actualizado correctamente`)
    router.push('/admin/libros')
  } catch (e: any) {
    error.value = e.data?.statusMessage || 'Error al actualizar el libro'
  } finally {
    loading.value = false
  }
}
</script>
