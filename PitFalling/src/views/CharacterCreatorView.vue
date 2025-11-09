<template>
  <section class="border border-anodyne bg-white p-8 grid place-items-center text-center">
    <div class="inline-flex items-center justify-center h-12 w-12 rounded-full border-2 border-anodyne animate-pulse">
      <!-- icono simple retro -->
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="h-6 w-6">
        <path fill="currentColor" d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7z"/>
      </svg>
    </div>
    <h1 class="mt-4 font-anodyne-mono text-xl">Calibrando Bio-Impresora…</h1>
    <p class="mt-2 text-sm text-anodyne-ink-2 max-w-xl">
      El módulo de creación de personajes está siendo ajustado por el personal de Anodyne.
      Los parámetros de fenotipos y asignación de equipo estarán disponibles en breve.
    </p>

    <!-- placeholder “diagrama” -->
    <div class="mt-6 border border-anodyne bg-anodyne-flesh-100 p-4 w-full max-w-2xl">
      <div class="grid grid-cols-3 gap-2 text-[10px] font-anodyne-mono uppercase tracking-widest text-anodyne-ink-2">
        <div class="h-16 border border-anodyne bg-white"></div>
        <div class="h-16 border border-anodyne bg-white"></div>
        <div class="h-16 border border-anodyne bg-white"></div>
      </div>
      <p class="mt-3 text-xs text-anodyne-ink-2">Esquema biológico (placeholder)</p>
    </div>
  </section>
</template>

<script setup lang="ts"></script>
