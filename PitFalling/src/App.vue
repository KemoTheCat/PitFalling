<template>
  <div class="min-h-screen flex flex-col bg-anodyne-flesh-50 text-anodyne-ink">
    <AppNavbar />

    <!-- Main ocupa el espacio flexible -->
    <main class="flex-1 w-full px-4 sm:px-6 lg:px-8">
      <!-- Contenido centrado con ancho máximo -->
      <div class="mx-auto w-full max-w-7xl py-6">
        <RouterView />
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppNavbar from '@/components/AppNavbar.vue'
import AppFooter from '@/components/AppFooter.vue'
</script>
