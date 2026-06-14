<template>
  <div>
    <NuxtRouteAnnouncer />
    <LayoutAppNavbar />
    <main>
      <NuxtPage />
    </main>
    <LayoutAppFooter />
    <LayoutToastCenter />
    <AdminConfirmDialog />
  </div>
</template>

<script setup lang="ts">
useHead({
  link: [
    { rel: 'icon', type: 'image/png', href: '/favicon.png' },
  ],
})
</script>
