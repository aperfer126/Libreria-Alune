<template>
  <div class="container py-5" style="max-width: 680px">
    <h1 class="h3 fw-bold mb-1">Mi perfil</h1>
    <p class="text-muted mb-4">Actualiza tu información personal y contraseña</p>

    <!-- Tabs -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: tab === 'datos' }"
          @click="tab = 'datos'"
        >
          Datos personales
        </button>
      </li>
      <li class="nav-item">
        <button
          class="nav-link"
          :class="{ active: tab === 'password' }"
          @click="tab = 'password'"
        >
          Cambiar contraseña
        </button>
      </li>
    </ul>

    <!-- Tab: Datos personales -->
    <div v-if="tab === 'datos'" class="card shadow-sm border-0">
      <div class="card-body p-4">
        <form @submit.prevent="saveDatos">
          <div class="mb-3">
            <label class="form-label fw-semibold">Nombre</label>
            <input v-model="form.name" type="text" class="form-control" placeholder="Tu nombre" required />
          </div>
          <div class="mb-4">
            <label class="form-label fw-semibold">Email</label>
            <input v-model="form.email" type="email" class="form-control" placeholder="tu@email.com" required />
            <div class="form-text">Si cambias el email tendrás que volver a iniciar sesión.</div>
          </div>

          <div v-if="datosError" class="alert alert-danger py-2 small">{{ datosError }}</div>
          <div v-if="datosOk" class="alert alert-success py-2 small">{{ datosOk }}</div>

          <button type="submit" class="btn btn-primary w-100" :disabled="datosSaving">
            <span v-if="datosSaving" class="spinner-border spinner-border-sm me-2"></span>
            Guardar cambios
          </button>
        </form>
      </div>
    </div>

    <!-- Tab: Cambiar contraseña -->
    <div v-if="tab === 'password'" class="card shadow-sm border-0">
      <div class="card-body p-4">
        <form @submit.prevent="savePassword">
          <div class="mb-3">
            <label class="form-label fw-semibold">Contraseña actual</label>
            <input v-model="pwForm.current" type="password" class="form-control" placeholder="••••••••" required />
          </div>
          <div class="mb-3">
            <label class="form-label fw-semibold">Nueva contraseña</label>
            <input v-model="pwForm.new" type="password" class="form-control" placeholder="Mínimo 6 caracteres" required />
          </div>
          <div class="mb-4">
            <label class="form-label fw-semibold">Confirmar nueva contraseña</label>
            <input v-model="pwForm.confirm" type="password" class="form-control" placeholder="Repite la contraseña" required />
          </div>

          <div v-if="pwError" class="alert alert-danger py-2 small">{{ pwError }}</div>
          <div v-if="pwOk" class="alert alert-success py-2 small">{{ pwOk }}</div>

          <button type="submit" class="btn btn-primary w-100" :disabled="pwSaving">
            <span v-if="pwSaving" class="spinner-border spinner-border-sm me-2"></span>
            Cambiar contraseña
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const { data: session } = useAuth()

const tab = ref<'datos' | 'password'>('datos')

const form = reactive({
  name: (session.value?.user?.name as string) ?? '',
  email: (session.value?.user?.email as string) ?? '',
})

const datosError = ref('')
const datosOk = ref('')
const datosSaving = ref(false)

async function saveDatos() {
  datosError.value = ''
  datosOk.value = ''
  datosSaving.value = true
  try {
    await $fetch('/api/profile', {
      method: 'PUT',
      body: { name: form.name, email: form.email },
    })
    datosOk.value = 'Datos actualizados correctamente.'
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    datosError.value = err?.data?.message ?? 'Error al guardar los cambios.'
  } finally {
    datosSaving.value = false
  }
}

const pwForm = reactive({ current: '', new: '', confirm: '' })
const pwError = ref('')
const pwOk = ref('')
const pwSaving = ref(false)

async function savePassword() {
  pwError.value = ''
  pwOk.value = ''
  if (pwForm.new !== pwForm.confirm) {
    pwError.value = 'Las contraseñas no coinciden.'
    return
  }
  pwSaving.value = true
  try {
    await $fetch('/api/profile', {
      method: 'PUT',
      body: { currentPassword: pwForm.current, newPassword: pwForm.new },
    })
    pwOk.value = 'Contraseña cambiada correctamente.'
    pwForm.current = ''
    pwForm.new = ''
    pwForm.confirm = ''
  } catch (e: unknown) {
    const err = e as { data?: { message?: string } }
    pwError.value = err?.data?.message ?? 'Error al cambiar la contraseña.'
  } finally {
    pwSaving.value = false
  }
}
</script>

<style scoped>
.nav-tabs .nav-link {
  color: #6c757d;
}
.nav-tabs .nav-link.active {
  color: #230f09;
  font-weight: 600;
  border-bottom-color: #e8a020;
}
</style>
