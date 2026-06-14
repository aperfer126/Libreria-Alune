<template>
  <div>
  <LayoutBreadcrumb :crumbs="[{ label: tab === 'register' ? 'Nuevo usuario' : 'Iniciar sesión' }]" />
  <div class="container py-5" style="max-width: 460px">
    <div class="card shadow">
      <div class="card-header p-0 border-0">
        <ul class="nav nav-tabs nav-fill border-0">
          <li class="nav-item">
            <button
              class="nav-link fw-semibold rounded-0 rounded-top-start w-100"
              :class="{ active: tab === 'login' }"
              @click="tab = 'login'"
            >
              Iniciar sesión
            </button>
          </li>
          <li class="nav-item">
            <button
              class="nav-link fw-semibold rounded-0 rounded-top-end w-100"
              :class="{ active: tab === 'register' }"
              @click="tab = 'register'"
            >
              Nuevo usuario
            </button>
          </li>
        </ul>
      </div>

      <div class="card-body p-4">

        <!-- LOGIN -->
        <form v-if="tab === 'login'" @submit.prevent="login">
          <div class="mb-3">
            <label class="form-label" for="login-email">Email</label>
            <input
              id="login-email"
              v-model="loginForm.email"
              type="email"
              class="form-control"
              required
              autocomplete="email"
              placeholder="tu@email.com"
            />
          </div>
          <div class="mb-3">
            <label class="form-label" for="login-password">Contraseña</label>
            <input
              id="login-password"
              v-model="loginForm.password"
              type="password"
              class="form-control"
              required
              autocomplete="current-password"
            />
          </div>

          <div v-if="loginError" class="alert alert-danger py-2 small mb-3">{{ loginError }}</div>

          <button type="submit" class="btn btn-primary w-100" :disabled="loginLoading">
            <span v-if="loginLoading" class="spinner-border spinner-border-sm me-2"></span>
            Entrar
          </button>
        </form>

        <!-- REGISTRO -->
        <form v-else @submit.prevent="register" novalidate>
          <div class="mb-3">
            <label class="form-label" for="reg-name">Nombre completo</label>
            <input
              id="reg-name"
              v-model="regForm.name"
              type="text"
              class="form-control"
              :class="{ 'is-invalid': regErrors.name }"
              required
              autocomplete="name"
              placeholder="Tu nombre"
              @blur="validateName"
            />
            <div v-if="regErrors.name" class="invalid-feedback">{{ regErrors.name }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label" for="reg-email">Email</label>
            <input
              id="reg-email"
              v-model="regForm.email"
              type="email"
              class="form-control"
              :class="{ 'is-invalid': regErrors.email }"
              required
              autocomplete="email"
              placeholder="tu@email.com"
              @blur="validateEmail"
            />
            <div v-if="regErrors.email" class="invalid-feedback">{{ regErrors.email }}</div>
          </div>

          <div class="mb-3">
            <label class="form-label" for="reg-password">Contraseña</label>
            <input
              id="reg-password"
              v-model="regForm.password"
              type="password"
              class="form-control"
              :class="{ 'is-invalid': regErrors.password }"
              required
              autocomplete="new-password"
              placeholder="Mínimo 6 caracteres"
              @blur="validatePassword"
            />
            <div v-if="regErrors.password" class="invalid-feedback">{{ regErrors.password }}</div>
          </div>

          <div class="mb-4">
            <label class="form-label" for="reg-confirm">Repetir contraseña</label>
            <input
              id="reg-confirm"
              v-model="regForm.confirm"
              type="password"
              class="form-control"
              :class="{ 'is-invalid': regErrors.confirm }"
              required
              autocomplete="new-password"
              placeholder="Repite la contraseña"
              @blur="validateConfirm"
            />
            <div v-if="regErrors.confirm" class="invalid-feedback">{{ regErrors.confirm }}</div>
          </div>

          <div v-if="regError" class="alert alert-danger py-2 small mb-3">{{ regError }}</div>

          <button type="submit" class="btn btn-primary w-100" :disabled="regLoading">
            <span v-if="regLoading" class="spinner-border spinner-border-sm me-2"></span>
            Crear cuenta
          </button>
        </form>

      </div>
    </div>
  </div>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Acceso | Librería Alune' })

const { signIn } = useAuth()
const route = useRoute()
const router = useRouter()

const tab = ref<'login' | 'register'>((route.query.tab as string) === 'register' ? 'register' : 'login')

// ── LOGIN ──────────────────────────────────────────────
const loginForm = reactive({ email: '', password: '' })
const loginLoading = ref(false)
const loginError = ref('')

async function login() {
  loginLoading.value = true
  loginError.value = ''
  try {
    const result = await signIn('credentials', {
      email: loginForm.email,
      password: loginForm.password,
      redirect: false,
    })
    if (result?.error) {
      loginError.value = 'Email o contraseña incorrectos'
    } else {
      const redirect = (route.query.callbackUrl as string) || (route.query.redirect as string) || '/'
      router.push(redirect)
    }
  } catch {
    loginError.value = 'Error al iniciar sesión. Inténtalo de nuevo.'
  } finally {
    loginLoading.value = false
  }
}

// ── REGISTRO ───────────────────────────────────────────
const regForm = reactive({ name: '', email: '', password: '', confirm: '' })
const regErrors = reactive({ name: '', email: '', password: '', confirm: '' })
const regLoading = ref(false)
const regError = ref('')

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateName() {
  regErrors.name = regForm.name.trim() ? '' : 'El nombre es obligatorio'
}
function validateEmail() {
  if (!regForm.email.trim()) {
    regErrors.email = 'El email es obligatorio'
  } else if (!EMAIL_RE.test(regForm.email)) {
    regErrors.email = 'Introduce un email válido'
  } else {
    regErrors.email = ''
  }
}
function validatePassword() {
  regErrors.password = regForm.password.length >= 6 ? '' : 'La contraseña debe tener al menos 6 caracteres'
}
function validateConfirm() {
  regErrors.confirm = regForm.confirm === regForm.password ? '' : 'Las contraseñas no coinciden'
}

function validateAll() {
  validateName()
  validateEmail()
  validatePassword()
  validateConfirm()
  return !regErrors.name && !regErrors.email && !regErrors.password && !regErrors.confirm
}

async function register() {
  if (!validateAll()) return
  regLoading.value = true
  regError.value = ''
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: { name: regForm.name, email: regForm.email, password: regForm.password },
    })
    await signIn('credentials', { email: regForm.email, password: regForm.password, redirect: false })
    const redirect = (route.query.callbackUrl as string) || '/'
    router.push(redirect)
  } catch (e: any) {
    regError.value = e.data?.statusMessage || 'Error al crear la cuenta. Inténtalo de nuevo.'
  } finally {
    regLoading.value = false
  }
}
</script>

<style scoped>
.nav-tabs .nav-link {
  color: #6c757d;
  border-bottom: 2px solid transparent;
  padding: 0.85rem 1rem;
}
.nav-tabs .nav-link.active {
  color: #c0392b;
  border-bottom: 2px solid #c0392b;
  background: transparent;
}
.nav-tabs .nav-link:hover:not(.active) {
  color: #333;
  background: #f8f9fa;
}
</style>
