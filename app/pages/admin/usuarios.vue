<template>
  <div>
  <LayoutBreadcrumb :crumbs="[{ label: 'Admin', to: '/admin' }, { label: 'Usuarios' }]" />
  <div class="container-fluid py-4">
    <div class="row">
      <!-- Sidebar + Filtros -->
      <div class="col-md-3">
        <AdminSidebar />

        <div class="card shadow-sm mt-3">
          <div class="card-body p-3">
            <h6 class="fw-semibold mb-3">Filtros</h6>

            <label class="form-label small text-muted mb-1">Buscar</label>
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

            <label class="form-label small text-muted mb-1">Rol</label>
            <select v-model="filterRole" class="form-select form-select-sm mb-3">
              <option value="">Todos los roles</option>
              <option value="USER">Usuario</option>
              <option value="MODERATOR">Moderador</option>
              <option value="ADMIN">Administrador</option>
            </select>

            <button
              v-if="search || filterRole"
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
        <div class="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1 class="h3 fw-bold mb-0">Gestión de usuarios</h1>
            <p v-if="hasFilters" class="text-muted small mb-0 mt-1">
              {{ filtered.length }} resultado{{ filtered.length !== 1 ? 's' : '' }} encontrado{{ filtered.length !== 1 ? 's' : '' }}
            </p>
          </div>
          <button class="btn btn-primary" @click="openCreate">+ Nuevo usuario</button>
        </div>

        <div v-if="pending" class="text-center py-5"><div class="spinner-border text-primary"></div></div>

        <div v-else class="card shadow-sm">
          <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
              <thead class="table-light">
                <tr>
                  <th class="ps-3">Nombre</th>
                  <th>Email</th>
                  <th class="text-center">Rol</th>
                  <th class="text-center">Pedidos</th>
                  <th>Registro</th>
                  <th style="width:160px"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filtered" :key="user.id">
                  <td class="ps-3 fw-medium" v-html="highlight(user.name)"></td>
                  <td class="text-muted" v-html="highlight(user.email)"></td>
                  <td class="text-center">
                    <span :class="user.role === 'ADMIN' ? 'badge bg-danger' : user.role === 'MODERATOR' ? 'badge bg-warning text-dark' : 'badge bg-secondary'">
                      {{ user.role === 'ADMIN' ? 'Admin' : user.role === 'MODERATOR' ? 'Moderador' : 'Usuario' }}
                    </span>
                  </td>
                  <td class="text-center">{{ user._count.orders }}</td>
                  <td class="text-muted small">{{ new Date(user.createdAt).toLocaleDateString('es-ES') }}</td>
                  <td class="text-end pe-3">
                    <button class="btn btn-sm btn-outline-primary me-1" @click="openEdit(user)">Editar</button>
                    <button class="btn btn-sm btn-outline-danger" @click="remove(user)">Eliminar</button>
                  </td>
                </tr>
                <tr v-if="filtered.length === 0">
                  <td colspan="6" class="text-center text-muted py-4">
                    {{ hasFilters ? 'No se encontraron usuarios con los filtros aplicados.' : 'No hay usuarios.' }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal crear/editar -->
  <div v-if="modal" class="modal-overlay" @click.self="closeModal">
    <div class="modal-box">
      <h5 class="fw-semibold mb-4">{{ editing ? 'Editar usuario' : 'Nuevo usuario' }}</h5>

      <div v-if="modalError" class="alert alert-danger py-2 small">{{ modalError }}</div>

      <form novalidate @submit.prevent="save">
        <div class="mb-3">
          <label class="form-label">Nombre <span class="text-danger">*</span></label>
          <input
            v-model="form.name"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': submitted && !form.name.trim() }"
          />
          <div class="invalid-feedback">El nombre es obligatorio.</div>
        </div>

        <div class="mb-3">
          <label class="form-label">Email <span class="text-danger">*</span></label>
          <input
            v-model="form.email"
            type="email"
            class="form-control"
            :class="{ 'is-invalid': submitted && !validEmail }"
          />
          <div class="invalid-feedback">
            {{ !form.email.trim() ? 'El email es obligatorio.' : 'Introduce un email válido.' }}
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label">
            Contraseña <span v-if="!editing" class="text-danger">*</span>
            <span v-else class="text-muted fw-normal small ms-1">(dejar vacío para no cambiar)</span>
          </label>
          <input
            v-model="form.password"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': submitted && !editing && !form.password }"
            autocomplete="new-password"
          />
          <div class="invalid-feedback">La contraseña es obligatoria.</div>
        </div>

        <div class="mb-4">
          <label class="form-label">Rol</label>
          <select v-model="form.role" class="form-select">
            <option value="USER">Usuario</option>
            <option value="MODERATOR">Moderador</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </div>

        <div class="d-flex gap-2 justify-content-end">
          <button type="button" class="btn btn-outline-secondary" @click="closeModal">Cancelar</button>
          <button type="submit" class="btn btn-primary" :disabled="saving">
            <span v-if="saving" class="spinner-border spinner-border-sm me-1"></span>
            {{ editing ? 'Guardar cambios' : 'Crear usuario' }}
          </button>
        </div>
      </form>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin-only' })
useSeoMeta({ title: 'Usuarios | Admin | Librería Alune' })

const { show: showToast } = useToast()
const { confirm } = useConfirm()

const { data: usersData, pending, refresh } = await useFetch<any[]>('/api/admin/users')
const users = computed(() => usersData.value ?? [])

const search = ref('')
const filterRole = ref('')

const hasFilters = computed(() => !!(search.value || filterRole.value))

function resetFilters() {
  search.value = ''
  filterRole.value = ''
}

const filtered = computed(() => {
  let list = users.value as any[]
  const q = search.value.trim().toLowerCase()
  if (q) {
    list = list.filter((u: any) =>
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    )
  }
  if (filterRole.value) list = list.filter((u: any) => u.role === filterRole.value)
  return list
})

function highlight(text: string) {
  const q = search.value.trim()
  if (!q) return text
  const re = new RegExp(`(${q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(re, '<mark class="px-0 bg-warning-subtle rounded-1">$1</mark>')
}

const modal = ref(false)
const editing = ref<any>(null)
const saving = ref(false)
const modalError = ref('')
const submitted = ref(false)

const form = reactive({ name: '', email: '', password: '', role: 'USER' })

const validEmail = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))

function openCreate() {
  editing.value = null
  form.name = ''
  form.email = ''
  form.password = ''
  form.role = 'USER'
  modalError.value = ''
  submitted.value = false
  modal.value = true
}

function openEdit(user: any) {
  editing.value = user
  form.name = user.name
  form.email = user.email
  form.password = ''
  form.role = user.role
  modalError.value = ''
  submitted.value = false
  modal.value = true
}

function closeModal() {
  modal.value = false
  editing.value = null
  submitted.value = false
  modalError.value = ''
}

async function save() {
  submitted.value = true
  const isValid = form.name.trim() && validEmail.value && (editing.value || form.password)
  if (!isValid) return

  modalError.value = ''
  saving.value = true
  try {
    if (editing.value) {
      const body: any = { name: form.name, email: form.email, role: form.role }
      if (form.password) body.password = form.password
      await $fetch(`/api/admin/users/${editing.value.id}`, { method: 'PUT', body })
      showToast(`Usuario "${form.name}" actualizado correctamente`)
    } else {
      await $fetch('/api/admin/users', { method: 'POST', body: { name: form.name, email: form.email, password: form.password, role: form.role } })
      showToast(`Usuario "${form.name}" creado correctamente`)
    }
    await refresh()
    closeModal()
  } catch (e: any) {
    modalError.value = e.data?.statusMessage || 'Error al guardar'
  } finally {
    saving.value = false
  }
}

async function remove(user: any) {
  const ok = await confirm({
    title: 'Eliminar usuario',
    message: `¿Estás seguro de que quieres eliminar a "${user.name}" (${user.email})? Esta acción no se puede deshacer.`,
    confirmLabel: 'Sí, eliminar',
  })
  if (!ok) return
  try {
    await $fetch(`/api/admin/users/${user.id}`, { method: 'DELETE' })
    showToast(`Usuario "${user.name}" eliminado`)
    await refresh()
  } catch (e: any) {
    showToast(e.data?.statusMessage || 'Error al eliminar')
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
}
.modal-box {
  background: #fff;
  border-radius: 12px;
  padding: 32px;
  width: 100%;
  max-width: 480px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}
</style>
