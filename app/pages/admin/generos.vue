<template>
  <div>
  <LayoutBreadcrumb :crumbs="[{ label: 'Admin', to: '/admin' }, { label: 'Géneros' }]" />
  <div class="container-fluid py-4">
    <div class="row">
      <div class="col-md-2">
        <AdminSidebar />
      </div>

      <div class="col-md-10">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h1 class="h3 fw-bold mb-0">Gestión de géneros</h1>
        </div>

        <div class="row g-4">
          <!-- Formulario añadir / editar -->
          <div class="col-md-4">
            <div class="card shadow-sm">
              <div class="card-body">
                <h5 class="fw-semibold mb-3">{{ editing ? 'Editar género' : 'Nuevo género' }}</h5>
                <form novalidate @submit.prevent="save">
                  <div class="mb-3">
                    <label class="form-label">Nombre del género <span class="text-danger">*</span></label>
                    <input
                      v-model="form.name"
                      type="text"
                      class="form-control"
                      :class="{ 'is-invalid': submitted && !form.name.trim(), 'is-valid': submitted && form.name.trim() && !formError }"
                      placeholder="Ej: Aventura"
                    />
                    <div v-if="submitted && !form.name.trim()" class="invalid-feedback">
                      El nombre del género es obligatorio.
                    </div>
                    <div v-else-if="formError" class="text-danger small mt-1">{{ formError }}</div>
                  </div>
                  <div class="d-flex gap-2">
                    <button type="submit" class="btn btn-primary" :disabled="saving">
                      <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
                      {{ editing ? 'Guardar cambios' : 'Crear género' }}
                    </button>
                    <button v-if="editing" type="button" class="btn btn-outline-secondary" @click="cancelEdit">
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Listado -->
          <div class="col-md-8">
            <div class="input-group mb-3" style="max-width: 320px">
              <span class="input-group-text bg-white border-end-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="#888" viewBox="0 0 16 16">
                  <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.099zm-5.242 1.656a5.5 5.5 0 1 1 0-11 5.5 5.5 0 0 1 0 11z"/>
                </svg>
              </span>
              <input
                v-model="search"
                type="search"
                class="form-control border-start-0 ps-0"
                placeholder="Buscar género..."
                @keyup.escape="search = ''"
              />
            </div>

            <div class="card shadow-sm">
              <div class="card-body p-0">
                <table class="table table-hover align-middle mb-0">
                  <thead class="table-light">
                    <tr>
                      <th class="ps-3">Género</th>
                      <th class="text-center" style="width:100px">Libros</th>
                      <th style="width:140px"></th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-if="pending">
                      <td colspan="3" class="text-center py-4 text-muted">Cargando...</td>
                    </tr>
                    <tr v-else-if="genres.length === 0 && search">
                      <td colspan="3" class="text-center text-muted py-4">
                        No se encontraron géneros para "<strong>{{ search }}</strong>".
                      </td>
                    </tr>
                    <tr v-for="genre in genres" :key="genre.id">
                      <td class="ps-3 fw-medium">{{ genre.name }}</td>
                      <td class="text-center">
                        <span class="badge bg-secondary">{{ genre._count?.books ?? 0 }}</span>
                      </td>
                      <td>
                        <div class="d-flex gap-1 justify-content-end pe-3">
                          <button class="btn btn-sm btn-outline-primary" @click="startEdit(genre)">Editar</button>
                          <button
                            class="btn btn-sm btn-outline-danger"
                            :disabled="(genre._count?.books ?? 0) > 0"
                            :title="(genre._count?.books ?? 0) > 0 ? 'Tiene libros asociados' : 'Eliminar'"
                            @click="remove(genre)"
                          >
                            Eliminar
                          </button>
                        </div>
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
  </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin' })
useSeoMeta({ title: 'Géneros | Admin | Librería Alune' })

const { show: showToast } = useToast()
const { confirm } = useConfirm()

const { data: genresData, pending, refresh } = await useFetch<any[]>('/api/genres')
const allGenres = computed(() => genresData.value ?? [])

const search = ref('')
const genres = computed(() => {
  const q = search.value.trim().toLowerCase()
  if (!q) return allGenres.value
  return allGenres.value.filter((g: any) => g.name.toLowerCase().includes(q))
})

const form = reactive({ name: '' })
const formError = ref('')
const saving = ref(false)
const submitted = ref(false)
const editing = ref<{ id: number; name: string } | null>(null)

function startEdit(genre: { id: number; name: string }) {
  editing.value = genre
  form.name = genre.name
  formError.value = ''
  submitted.value = false
}

function cancelEdit() {
  editing.value = null
  form.name = ''
  formError.value = ''
  submitted.value = false
}

async function save() {
  submitted.value = true
  if (!form.name.trim()) return

  formError.value = ''
  saving.value = true
  try {
    if (editing.value) {
      await $fetch(`/api/genres/${editing.value.id}`, { method: 'PUT', body: { name: form.name } })
      showToast(`Género "${form.name}" actualizado correctamente`)
      cancelEdit()
    } else {
      await $fetch('/api/genres', { method: 'POST', body: { name: form.name } })
      showToast(`Género "${form.name}" creado correctamente`)
      form.name = ''
      submitted.value = false
    }
    await refresh()
  } catch (e: any) {
    formError.value = e.data?.statusMessage || 'Error al guardar'
  } finally {
    saving.value = false
  }
}

async function remove(genre: { id: number; name: string }) {
  const ok = await confirm({
    title: 'Eliminar género',
    message: `¿Estás seguro de que quieres eliminar el género "${genre.name}"? Esta acción no se puede deshacer.`,
    confirmLabel: 'Sí, eliminar',
  })
  if (!ok) return
  try {
    await $fetch(`/api/genres/${genre.id}`, { method: 'DELETE' })
    showToast(`Género "${genre.name}" eliminado`)
    await refresh()
  } catch (e: any) {
    showToast(e.data?.statusMessage || 'Error al eliminar')
  }
}
</script>
