<template>
  <section class="space-y-10">
    <!-- HERO -->
    <header class="pt-4 pb-6">
      <div class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div class="max-w-3xl">
          <p class="font-anodyne-mono text-xs tracking-widest uppercase text-anodyne-ink-2 mb-3">
            Anodyne Systems — Authorized Access Only
          </p>
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-semibold leading-tight font-anodyne-mono">
            Bienvenido al <span class="underline decoration-[length:3px] [text-decoration-color:rgb(var(--brand))] underline-offset-4">Mystery Flesh Pit National Park</span>
          </h1>
          <p class="mt-3 text-base sm:text-lg text-anodyne-ink-2">
            Su puerta de entrada oficial para contratistas y visitantes autorizados por Anodyne.
          </p>

          <div class="mt-6 flex flex-wrap items-center gap-3">
            <RouterLink
              to="/login"
              class="inline-flex items-center rounded-sm bg-anodyne-brand hover:bg-anodyne-brand-2 text-white px-4 py-2 text-sm font-semibold tracking-wide"
            >
              Portal de Contratista
            </RouterLink>

            <a
              href="#avisos-seguridad"
              class="inline-flex items-center rounded-sm border border-anodyne px-4 py-2 text-sm font-semibold tracking-wide hover:bg-anodyne-flesh-100"
            >
              Avisos de Seguridad
            </a>
          </div>
        </div>

        <!-- Panel lateral -->
        <aside class="w-full lg:w-80 border border-anodyne bg-white">
          <div class="px-4 py-3 border-b border-anodyne flex items-center justify-between">
            <span class="font-anodyne-mono text-xs uppercase tracking-widest">Boletín Operativo</span>
            <span class="text-[10px] text-anodyne-ink-2">AN-OPS</span>
          </div>
          <div class="p-4 space-y-3 text-sm">
            <p class="text-anodyne-ink-2">
              <strong class="font-medium text-anodyne-ink">Estado actual:</strong> Parque CERRADO al público general.
            </p>
            <div class="hr-rule"></div>
            <ul class="list-disc pl-5 space-y-1 text-anodyne-ink-2">
              <li>Ingresos solo con credenciales válidas.</li>
              <li>Equipo PPE obligatorio en zonas marcadas.</li>
              <li>Reporte inmediato de comportamientos anómalos.</li>
            </ul>
          </div>
        </aside>
      </div>
    </header>

    <!-- ADVERTENCIA -->
    <section id="avisos-seguridad" class="border border-warning bg-warning-soft rounded-[2px]">
      <div class="px-4 py-3 border-b border-warning flex items-center gap-3">
        <div class="h-4 w-4 grid place-items-center text-[10px] border border-warning text-warning-ink">!</div>
        <h2 class="font-anodyne-mono text-sm tracking-wider uppercase text-warning-ink">
          Advertencia de Seguridad
        </h2>
      </div>
      <div class="p-4 text-sm leading-relaxed text-warning-ink">
        <p class="font-medium">
          ADVERTENCIA: El parque se encuentra actualmente <u>CERRADO</u> al público general. Solo personal
          autorizado.
        </p>
        <p class="mt-2">
          El incumplimiento de estas directrices puede resultar en acciones disciplinarias, sanciones y/o
          exposición a riesgos biológico-geológicos no clasificados.
        </p>
      </div>
    </section>

    <!-- Acerca -->
    <section class="grid md:grid-cols-3 gap-6">
      <div class="md:col-span-2 border border-anodyne bg-white p-5">
        <h3 class="font-anodyne-mono text-base uppercase tracking-widest mb-2">Acerca del Sitio</h3>
        <p class="text-sm text-anodyne-ink-2 leading-relaxed">
          El Mystery Flesh Pit National Park es un activo natural bajo administración provisional de Anodyne.
          Este portal centraliza credenciales, avisos y documentación para operaciones seguras.
        </p>
      </div>
      <div class="border border-anodyne bg-white p-5">
        <h3 class="font-anodyne-mono text-base uppercase tracking-widest mb-2">Identidad Visual</h3>
        <p class="text-xs text-anodyne-ink-2">
          Fuentes: <span class="font-medium">Inter</span> y <span class="font-medium">IBM Plex Mono</span>.
          Paleta: marfil técnico, gris carbón, azul petróleo, amarillo advertencia.
        </p>
        <div class="mt-3 flex gap-2">
          <div class="h-6 w-6 rounded-sm bg-anodyne-flesh-100 border border-anodyne" title="Flesh 100"></div>
          <div class="h-6 w-6 rounded-sm" style="background:rgb(var(--ink));" title="Ink"></div>
          <div class="h-6 w-6 rounded-sm" style="background:rgb(var(--brand));" title="Brand"></div>
          <div class="h-6 w-6 rounded-sm" style="background:rgb(var(--warn));" title="Warn"></div>
        </div>
      </div>
    </section>
  </section>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>
