<template>
  <div>
    <NuxtRouteAnnouncer />
    <LayoutAppNavbar />
    <main>
      <slot />
    </main>
    <LayoutAppFooter />
    <LayoutToastCenter />
    <AdminConfirmDialog />
  </div>
</template>
