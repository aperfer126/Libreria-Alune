<template>
  <nav aria-label="breadcrumb" class="breadcrumb-bar">
    <div class="container">
      <ol class="breadcrumb mb-0 py-2">
        <li class="breadcrumb-item">
          <NuxtLink to="/">Inicio</NuxtLink>
        </li>
        <li
          v-for="(crumb, i) in crumbs"
          :key="i"
          class="breadcrumb-item"
          :class="{ active: i === crumbs.length - 1 }"
        >
          <NuxtLink v-if="i < crumbs.length - 1" :to="crumb.to">{{ crumb.label }}</NuxtLink>
          <span v-else>{{ crumb.label }}</span>
        </li>
      </ol>
    </div>
  </nav>
</template>

<script setup lang="ts">
defineProps<{
  crumbs: { label: string; to?: string }[]
}>()
</script>

<style scoped>
.breadcrumb-bar {
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
  font-size: 0.82rem;
}

.breadcrumb-item a {
  color: #c0392b;
  text-decoration: none;
}

.breadcrumb-item a:hover {
  text-decoration: underline;
}

.breadcrumb-item.active span {
  color: #6c757d;
}

.breadcrumb-item + .breadcrumb-item::before {
  color: #adb5bd;
}
</style>
