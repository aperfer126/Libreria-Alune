<template>
  <footer class="text-light mt-5 py-5" style="background-color: #2b1a0e;">
    <div class="container">
      <div class="row g-4">

        <!-- Marca -->
        <div class="col-md-3">
          <div class="d-flex align-items-center gap-2 mb-2">
            <img src="/logo.png" alt="Librería Alune" style="height:100px;width:100px;object-fit:contain" />
            <h5 class="fw-bold mb-0">Librería Alune</h5>
          </div>
          <p class="text-secondary small">Tu tienda de libros de confianza. Novedades, clásicos, manga y mucho más.</p>
        </div>

        <!-- Categorías -->
        <div class="col-md-3">
          <h6 class="fw-semibold mb-3">Categorías</h6>
          <ul class="list-unstyled small mb-0">
            <li class="mb-1"><NuxtLink to="/catalogo?genre=Manga" class="footer-link">Manga</NuxtLink></li>
            <li class="mb-1"><NuxtLink to="/catalogo?genre=Juvenil" class="footer-link">Juvenil</NuxtLink></li>
            <li class="mb-1"><NuxtLink to="/catalogo?genre=Terror" class="footer-link">Terror</NuxtLink></li>
            <li class="mb-1"><NuxtLink to="/catalogo?genre=Narrativa" class="footer-link">Narrativa</NuxtLink></li>
            <li class="mb-1"><NuxtLink to="/catalogo?genre=Fantasía" class="footer-link">Fantasía</NuxtLink></li>
          </ul>
        </div>

        <!-- Información -->
        <div class="col-md-3">
          <h6 class="fw-semibold mb-3">Información</h6>
          <ul class="list-unstyled small mb-0">
            <li class="mb-1"><NuxtLink to="/auth/login?tab=register" class="footer-link">Crear cuenta</NuxtLink></li>
            <li class="mb-1"><NuxtLink to="/mis-pedidos" class="footer-link">Mis pedidos</NuxtLink></li>
            <li class="mb-1"><NuxtLink to="/favoritos" class="footer-link">Mis favoritos</NuxtLink></li>
            <li class="mb-1"><NuxtLink to="/sobre-nosotros" class="footer-link">Sobre nosotros</NuxtLink></li>
          </ul>
        </div>

        <!-- Contacto -->
        <div class="col-md-3">
          <h6 class="fw-semibold mb-3">Contacto</h6>
          <ul class="list-unstyled small mb-0">
            <li class="d-flex align-items-start gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#adb5bd" viewBox="0 0 16 16" class="mt-1 flex-shrink-0">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
              </svg>
              <span class="text-secondary">Calle Gran Vía, 42<br>28013 Madrid</span>
            </li>
            <li class="d-flex align-items-center gap-2 mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#adb5bd" viewBox="0 0 16 16" class="flex-shrink-0">
                <path d="M3.654 1.328a.678.678 0 0 0-1.015-.063L1.605 2.3c-.483.484-.661 1.169-.45 1.77a17.6 17.6 0 0 0 4.168 6.608 17.6 17.6 0 0 0 6.608 4.168c.601.211 1.286.033 1.77-.45l1.034-1.034a.678.678 0 0 0-.063-1.015l-2.307-1.794a.68.68 0 0 0-.58-.122l-2.19.547a1.745 1.745 0 0 1-1.657-.459L5.482 8.062a1.745 1.745 0 0 1-.46-1.657l.548-2.19a.68.68 0 0 0-.122-.58L3.654 1.328z"/>
              </svg>
              <a href="tel:+34910000000" class="footer-link">+34 910 000 000</a>
            </li>
            <li class="d-flex align-items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="#adb5bd" viewBox="0 0 16 16" class="flex-shrink-0">
                <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2zm13 2.383-4.708 2.825L15 11.105V5.383zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741z"/>
              </svg>
              <a href="mailto:info@libreria.com" class="footer-link">info@libreria.com</a>
            </li>
          </ul>
        </div>

      </div>

      <hr class="border-secondary mt-4" />
      <p class="text-center text-secondary small mb-0">
        © {{ new Date().getFullYear() }} Librería Alune. Todos los derechos reservados.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.footer-link {
  color: #adb5bd;
  text-decoration: none;
  transition: color 0.15s;
}
.footer-link:hover {
  color: #fff;
}
</style>
