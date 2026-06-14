<template>
  <div>
  <LayoutBreadcrumb :crumbs="[{ label: 'Sobre Nosotros' }]" />
  <div>
    <!-- Hero -->
    <div class="sobre-hero py-5 text-white text-center mb-5">
      <div class="container">
        <h1 class="display-5 fw-bold mb-2">Sobre Nosotros</h1>
        <p class="lead text-white-50">Tu librería de confianza. Apasionados por los libros desde 2010.</p>
      </div>
    </div>

    <div class="container pb-5">
      <div class="row g-5">
        <!-- Columna izquierda: formulario de contacto -->
        <div class="col-lg-6">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body p-4 p-md-5">
              <h2 class="h4 fw-bold mb-4">Ponte en contacto</h2>

              <form @submit.prevent="sendMessage">
                <div class="mb-3">
                  <input
                    v-model="form.name"
                    type="text"
                    class="form-control"
                    placeholder="Nombre completo"
                    required
                  />
                </div>
                <div class="mb-3">
                  <input
                    v-model="form.email"
                    type="email"
                    class="form-control"
                    placeholder="Email"
                    required
                  />
                </div>
                <div class="mb-3">
                  <input
                    v-model="form.subject"
                    type="text"
                    class="form-control"
                    placeholder="Asunto"
                    required
                  />
                </div>
                <div class="mb-4">
                  <textarea
                    v-model="form.message"
                    class="form-control"
                    placeholder="Mensaje"
                    rows="5"
                    required
                  ></textarea>
                </div>

                <div v-if="sent" class="alert alert-success py-2 small mb-3">
                  ✓ Mensaje enviado correctamente. Te responderemos lo antes posible.
                </div>
                <div v-if="formError" class="alert alert-danger py-2 small mb-3">
                  {{ formError }}
                </div>

                <button type="submit" class="btn btn-danger w-100 py-2 fw-semibold" :disabled="sending">
                  <span v-if="sending" class="spinner-border spinner-border-sm me-2"></span>
                  Enviar Mensaje
                </button>
              </form>
            </div>
          </div>
        </div>

        <!-- Columna derecha: información y mapa -->
        <div class="col-lg-6 d-flex flex-column gap-4">
          <!-- Tarjeta de información -->
          <div class="card border-0 shadow-sm">
            <div class="card-body p-4 p-md-5">
              <h2 class="h4 fw-bold mb-4">Información de Contacto</h2>

              <ul class="list-unstyled d-flex flex-column gap-3">
                <li class="d-flex align-items-start gap-3">
                  <span class="contact-icon bg-danger-subtle text-danger rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                    📍
                  </span>
                  <div>
                    <p class="fw-semibold mb-0">Dirección</p>
                    <p class="text-muted mb-0">Calle de los Libros 42, 28001 Madrid, España</p>
                  </div>
                </li>
                <li class="d-flex align-items-start gap-3">
                  <span class="contact-icon bg-danger-subtle text-danger rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                    📞
                  </span>
                  <div>
                    <p class="fw-semibold mb-0">Teléfono</p>
                    <p class="text-muted mb-0">+34 91 123 45 67</p>
                  </div>
                </li>
                <li class="d-flex align-items-start gap-3">
                  <span class="contact-icon bg-danger-subtle text-danger rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                    ✉️
                  </span>
                  <div>
                    <p class="fw-semibold mb-0">Email</p>
                    <a href="mailto:info@libreria.com" class="text-muted text-decoration-none">info@libreria.com</a>
                  </div>
                </li>
                <li class="d-flex align-items-start gap-3">
                  <span class="contact-icon bg-danger-subtle text-danger rounded-circle d-flex align-items-center justify-content-center flex-shrink-0">
                    🕐
                  </span>
                  <div>
                    <p class="fw-semibold mb-0">Horario</p>
                    <p class="text-muted mb-0">Lunes a Viernes: 9:00 – 20:30</p>
                    <p class="text-muted mb-0">Sábados: 10:00 – 14:00</p>
                  </div>
                </li>
              </ul>

              <hr class="my-4" />

              <div>
                <p class="fw-semibold mb-2">Síguenos</p>
                <div class="d-flex gap-3">
                  <a href="#" class="social-btn" aria-label="Twitter/X">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.857-8.17-10.643H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </a>
                  <a href="#" class="social-btn" aria-label="Instagram">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                  <a href="#" class="social-btn" aria-label="Facebook">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Mapa -->
          <div class="card border-0 shadow-sm overflow-hidden" style="min-height: 260px">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3037.177!2d-3.703!3d40.4168!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd422997800a3c81%3A0xc436dec1618c2269!2sMadrid%2C%20Spain!5e0!3m2!1sen!2ses!4v1234567890"
              width="100%"
              height="260"
              style="border: 0"
              allowfullscreen
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Ubicación de la librería"
            ></iframe>
          </div>
        </div>
      </div>

      <!-- Sección "Quiénes somos" -->
      <div class="row mt-5 g-4 align-items-center">
        <div class="col-md-6">
          <h2 class="h3 fw-bold mb-3">¿Quiénes somos?</h2>
          <p class="text-secondary">
            Somos una librería independiente con más de 15 años de experiencia, dedicada a acercar la
            lectura a todos los públicos. Desde clásicos de la literatura universal hasta las últimas
            novedades en manga y juvenil, nuestro catálogo crece cada semana con las mejores selecciones
            de nuestro equipo.
          </p>
          <p class="text-secondary">
            Creemos en el poder transformador de los libros y nos esforzamos por ofrecer una experiencia
            de compra sencilla, rápida y con el mejor servicio al cliente. Envíos en 24-48 horas a toda
            España peninsular.
          </p>
          <NuxtLink to="/catalogo" class="btn btn-danger mt-2">Explorar el catálogo</NuxtLink>
        </div>
        <div class="col-md-6">
          <div class="row g-3">
            <div class="col-6">
              <div class="stat-card text-center p-4 rounded-3 bg-danger-subtle">
                <div class="display-5 fw-bold text-danger">+10k</div>
                <p class="text-secondary mb-0 small">Títulos disponibles</p>
              </div>
            </div>
            <div class="col-6">
              <div class="stat-card text-center p-4 rounded-3 bg-primary-subtle">
                <div class="display-5 fw-bold text-primary">+15</div>
                <p class="text-secondary mb-0 small">Años de experiencia</p>
              </div>
            </div>
            <div class="col-6">
              <div class="stat-card text-center p-4 rounded-3 bg-success-subtle">
                <div class="display-5 fw-bold text-success">+50k</div>
                <p class="text-secondary mb-0 small">Clientes satisfechos</p>
              </div>
            </div>
            <div class="col-6">
              <div class="stat-card text-center p-4 rounded-3 bg-warning-subtle">
                <div class="display-5 fw-bold text-warning">24h</div>
                <p class="text-secondary mb-0 small">Envío express</p>
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
useSeoMeta({
  title: 'Sobre Nosotros | Librería Alune',
  description: 'Conoce nuestra librería, dónde encontrarnos y cómo contactar con nosotros.',
})

const form = reactive({ name: '', email: '', subject: '', message: '' })
const sending = ref(false)
const sent = ref(false)
const formError = ref('')

async function sendMessage() {
  sending.value = true
  formError.value = ''
  sent.value = false

  await new Promise((r) => setTimeout(r, 1000))

  // Aquí se integraría un servicio de email (Resend, SendGrid, etc.)
  // Por ahora simula el envío
  sent.value = true
  Object.assign(form, { name: '', email: '', subject: '', message: '' })
  sending.value = false
}
</script>

<style scoped>
.sobre-hero {
  background: linear-gradient(135deg, #1a1a2e 0%, #c0392b 100%);
  min-height: 200px;
  display: flex;
  align-items: center;
}

.contact-icon {
  width: 42px;
  height: 42px;
  font-size: 1.1rem;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f1f3f4;
  color: #444;
  transition: background 0.2s, color 0.2s;
  text-decoration: none;
}

.social-btn:hover {
  background: #c0392b;
  color: #fff;
}

.stat-card {
  transition: transform 0.2s;
}

.stat-card:hover {
  transform: translateY(-3px);
}
</style>
