<template>
  <footer class="mt-16 border-t border-anodyne bg-white">
    <div
      class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6
             flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
    >
      <div>
        <p class="text-sm text-anodyne-ink-2 font-anodyne-mono tracking-widest uppercase">
          © Anodyne Systems
        </p>
        <p class="text-xs text-anodyne-ink-2">
          National Operations Interface — Confidential / Authorized Access Only
        </p>
      </div>

      <nav class="flex flex-wrap gap-x-4 gap-y-2 text-sm">
        <RouterLink to="/terms" class="hover:underline">Términos</RouterLink>
        <RouterLink to="/privacy" class="hover:underline">Política</RouterLink>
        <RouterLink to="/msds" class="hover:underline">MSDS</RouterLink>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
