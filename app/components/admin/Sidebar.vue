<template>
  <div class="list-group shadow-sm">
    <NuxtLink to="/admin" class="list-group-item list-group-item-action" active-class="fw-semibold">📊 Dashboard</NuxtLink>
    <NuxtLink to="/admin/libros" class="list-group-item list-group-item-action" active-class="fw-semibold">📚 Libros</NuxtLink>
    <NuxtLink to="/admin/generos" class="list-group-item list-group-item-action" active-class="fw-semibold">🏷️ Géneros</NuxtLink>
    <NuxtLink to="/admin/pedidos" class="list-group-item list-group-item-action" active-class="fw-semibold">📦 Pedidos</NuxtLink>
    <NuxtLink v-if="isAdmin" to="/admin/usuarios" class="list-group-item list-group-item-action" active-class="fw-semibold">👥 Usuarios</NuxtLink>
  </div>
</template>

<script setup lang="ts">
const { data: session } = useAuth()
const isAdmin = computed(() => (session.value?.user as { role?: string })?.role === 'ADMIN')
</script>
