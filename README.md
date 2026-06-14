<div align="center">

# Librería **Alune**

**Tienda de libros online con identidad propia**  
E-commerce completo con panel de administración, pagos con Stripe y gestión de géneros literarios.

[![Nuxt.js](https://img.shields.io/badge/Nuxt.js-3.14-00DC82?logo=nuxt.js)](https://nuxt.com)
[![Vue](https://img.shields.io/badge/Vue-3-4FC08D?logo=vue.js)](https://vuejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://typescriptlang.org)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?logo=bootstrap)](https://getbootstrap.com)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma)](https://prisma.io)
[![Stripe](https://img.shields.io/badge/Stripe-v17-635BFF?logo=stripe)](https://stripe.com)

</div>

---

## Características

- **Catálogo** con filtros en tiempo real por múltiples géneros simultáneos y búsqueda por título o autor
- **Detalle de libro** con portada, descripción, autor, editorial y géneros
- **Carrito y favoritos** persistentes con Pinia + pinia-plugin-persistedstate
- **Checkout** con Stripe Card Elements integrado en la página (sin redirecciones externas) y formulario de dirección de envío
- **Autenticación** completa: registro, login, perfil, pedidos — JWT con @sidebase/nuxt-auth
- **Panel de administración** — gestión de libros, usuarios, pedidos y gráficos de ventas por género
- **Página de perfil** — edición de datos personales y cambio de contraseña
- **Búsqueda** de libros por título o autor desde el header
- **Diseño responsivo** con identidad visual propia (paleta marrón/dorado del logo)

---

## Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Nuxt.js 3.14 (Vue 3 + TypeScript, compatibilityVersion: 4) |
| UI | Bootstrap 5 + CSS personalizado |
| Base de datos | MySQL 8.4 (Aiven Cloud) + Prisma ORM v5 |
| Autenticación | @sidebase/nuxt-auth v0.9.4 + NextAuth credentials + bcryptjs |
| Pagos | Stripe SDK v17 + @stripe/stripe-js v9 + webhooks |
| Estado global | Pinia v2 + pinia-plugin-persistedstate |
| Gráficos | Chart.js v4 + vue-chartjs |
| Despliegue | Vercel (preset: vercel) |

---

## Estructura de rutas

### Storefront

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio — carruseles por género y novedades |
| `/catalogo` | Catálogo con filtros multi-género y búsqueda |
| `/libro/[id]` | Detalle de libro |
| `/carrito` | Carrito de compra |
| `/checkout` | Proceso de pago con Stripe Card Elements |
| `/checkout/return` | Confirmación de pedido |
| `/favoritos` | Lista de favoritos |
| `/mis-pedidos` | Historial de pedidos del usuario |
| `/mi-perfil` | Edición de datos personales y contraseña |
| `/sobre-nosotros` | Información de la librería |

### Administración (requiere rol `ADMIN` o `MODERATOR`)

| Ruta | Descripción |
|------|-------------|
| `/admin` | Dashboard — gráficos de ventas por género e ingresos |
| `/admin/libros` | Tabla de libros + gestión de stock |
| `/admin/libros/nuevo` | Formulario de nuevo libro |
| `/admin/libros/[id]/editar` | Editar libro |
| `/admin/pedidos` | Historial de todos los pedidos |
| `/admin/pedidos/[id]` | Detalle de pedido |
| `/admin/usuarios` | Gestión de usuarios y roles |
| `/admin/generos` | Gestión de géneros literarios |

### Autenticación

| Ruta | Descripción |
|------|-------------|
| `/auth/login` | Inicio de sesión |
| `/auth/login?tab=register` | Registro de cuenta |

---

## Primeros pasos

### Requisitos previos

- Node.js ≥ 18
- MySQL local o cuenta en [Aiven](https://aiven.io) para producción
- Cuenta en [Stripe](https://stripe.com)

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/aperfer126/Libreria-Alune.git
cd Libreria-Alune
npm install
```

### 2. Configurar variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# Base de datos
DATABASE_URL=mysql://usuario:password@localhost:3306/libreria_alune

# Autenticación
AUTH_SECRET=tu_secreto_aleatorio_de_32_caracteres
AUTH_ORIGIN=http://localhost:3000

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PUBLIC_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

### 3. Aplicar migraciones y poblar datos

```bash
npx prisma migrate deploy
npx tsx prisma/seed.ts
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en el navegador.

---

## Scripts disponibles

```bash
npm run dev        # Servidor de desarrollo
npm run build      # Build de producción (prisma generate incluido)
npm run preview    # Previsualizar build de producción
npm run db:migrate # Crear y aplicar nueva migración
npm run db:seed    # Poblar la base de datos con datos de ejemplo
npm run db:studio  # Abrir Prisma Studio
```

---

## Webhooks de Stripe (desarrollo local)

Para recibir eventos de Stripe en local instala la [Stripe CLI](https://stripe.com/docs/stripe-cli) y ejecuta:

```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

La CLI imprimirá el `STRIPE_WEBHOOK_SECRET` que debes añadir a `.env`.

---

## Estructura del proyecto

```
app/
├── pages/
│   ├── index.vue              # Inicio con carruseles
│   ├── catalogo/              # Catálogo con filtros multi-género
│   ├── libro/[id].vue         # Detalle de libro
│   ├── carrito.vue            # Carrito de compra
│   ├── checkout/              # Checkout y página de retorno
│   ├── favoritos.vue          # Lista de favoritos
│   ├── mis-pedidos.vue        # Historial de pedidos
│   ├── mi-perfil.vue          # Edición de perfil y contraseña
│   ├── auth/                  # Login y registro
│   └── admin/                 # Panel de administración
├── components/
│   ├── layout/                # AppNavbar, AppFooter, ToastCenter
│   ├── home/                  # BookCarousel, BookCard
│   ├── checkout/              # StripeDevTools (solo admin/moderador)
│   └── admin/                 # ConfirmDialog y componentes del panel
├── composables/
│   └── useShippingAddress.ts  # Formatea direcciones de envío (JSON → texto)
├── stores/
│   ├── cart.ts                # Pinia store del carrito
│   └── favorites.ts           # Pinia store de favoritos
└── layouts/
    ├── default.vue            # Layout principal (navbar + footer)
    └── checkout.vue           # Layout limpio para checkout
server/
└── api/
    ├── books/                 # GET, POST, PUT, DELETE libros
    ├── genres/                # GET géneros
    ├── favorites/             # GET, POST, DELETE favoritos
    ├── orders/                # GET, POST pedidos
    ├── profile.put.ts         # PUT perfil de usuario
    ├── webhook/stripe.post.ts # Webhook Stripe (payment_intent.succeeded)
    ├── auth/[...].ts          # NextAuth handler
    └── admin/                 # Endpoints de administración
prisma/
├── schema.prisma              # Modelos: User, Book, Genre, Order, OrderItem, Favorite
├── migrations/
└── seed.ts                    # Datos de ejemplo (30+ libros, usuarios, pedidos)
```

---

## Modelo de datos

El esquema Prisma incluye 6 modelos:

`User` · `Book` · `Genre` · `Order` · `OrderItem` · `Favorite`

La relación `Book ↔ Genre` es **muchos-a-muchos** (tabla intermedia `_BookToGenre`), lo que permite asignar múltiples géneros a cada libro y filtrar por varios géneros simultáneamente en el catálogo.

---

## Usuarios de prueba (seed)

| Email | Contraseña | Rol |
|-------|-----------|-----|
| admin@libreria.com | admin123 | ADMIN |
| mod@libreria.com | mod123 | MODERATOR |
| user@libreria.com | user123 | USER |

---

## Despliegue en producción

La aplicación está desplegada en **Vercel** con base de datos **MySQL en Aiven Cloud**.

Variables de entorno necesarias en Vercel:

```
DATABASE_URL        → Connection string de Aiven (con ?sslaccept=strict)
AUTH_SECRET         → Secreto de sesión
AUTH_ORIGIN         → URL pública de la app en Vercel
STRIPE_SECRET_KEY   → Clave secreta de Stripe
STRIPE_PUBLIC_KEY   → Clave pública de Stripe
STRIPE_WEBHOOK_SECRET → Secreto del webhook de Stripe
```

---

## Licencia

Proyecto académico — TFG DAW · 2026
