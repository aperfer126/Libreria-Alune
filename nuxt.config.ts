export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  future: {
    compatibilityVersion: 4,
  },
  modules: [
    '@sidebase/nuxt-auth',
    '@pinia/nuxt',
    'pinia-plugin-persistedstate/nuxt',
  ],
  auth: {
    baseURL: process.env.AUTH_ORIGIN || 'http://localhost:3000',
    provider: {
      type: 'authjs',
    },
  },
  runtimeConfig: {
    authSecret: process.env.AUTH_SECRET,
    stripeSecretKey: process.env.STRIPE_SECRET_KEY,
    stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    public: {
      stripePublicKey: process.env.STRIPE_PUBLIC_KEY,
    },
  },
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
  ],
})
