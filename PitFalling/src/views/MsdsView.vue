<template>
  <section class="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <div class="border border-yellow-600/50 bg-yellow-100/70 text-yellow-900 p-4">
      <p class="font-semibold uppercase tracking-widest text-xs">MSDS Ficticio — Universo Anodyne</p>
      <p class="mt-2 text-sm">
        Documento ficticio con fines de ambientación. No representa normas OSHA/ISO reales.
        Apoya al autor: <a class="underline" href="https://www.mysteryfleshpitnationalpark.com" target="_blank" rel="noopener">Sitio oficial</a> •
        <a class="underline" href="https://www.drivethrurpg.com/en/product/498633/mystery-flesh-pit-national-park-the-rpg" target="_blank" rel="noopener">Compra el RPG</a>.
      </p>
    </div>

    <header class="space-y-1">
      <p class="font-anodyne-mono text-xs tracking-widest uppercase text-anodyne-ink-2">Anodyne Systems — Safety Data</p>
      <h1 class="text-3xl font-bold">MSDS — Portal de Visitantes</h1>
      <p class="text-sm text-anodyne-ink-2">Revisión: {{ lastUpdated }}</p>
    </header>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">1. Identificación</h2>
      <ul class="list-disc pl-6">
        <li>Producto: <em>Anodyne Visitor Portal (AVP)</em></li>
        <li>Uso previsto: Interfaz web narrativa para contratistas/visitantes.</li>
        <li>Propietario del sitio: Kemocaat Studios (proyecto de fans, no oficial).</li>
      </ul>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">2. Peligros (Ficticios)</h2>
      <ul class="list-disc pl-6 space-y-2">
        <li>Exposición prolongada a avisos de seguridad puede inducir “hipervigilancia narrativa”.</li>
        <li>Acceso a secciones restringidas sin credenciales válidas puede causar “suspensión de rol”.</li>
        <li>Interacciones no autorizadas con especímenes virtuales: <em>evítese</em>.</li>
      </ul>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">3. Composición</h2>
      <p>Frontend: Vue 3 + Vite + TailwindCSS 4.1; Tipografías Inter / IBM Plex Mono; Backend: Supabase.</p>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">4. Primeros Auxilios</h2>
      <ul class="list-disc pl-6 space-y-2">
        <li>Fatiga visual: descansar 10 minutos por cada 2 horas.</li>
        <li>"¿tu pagina de personajes queda cargando despues de reiniciar? simplemente <code>cierra sesion</code> refresca pagina y vuelve a ingresar, ¡trabajamos duro para solucionar esto pronto! </li>
      </ul>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">5. Manipulación y Almacenamiento</h2>
      <ul class="list-disc pl-6 space-y-2">
        <li>Usar únicamente credenciales personales. No compartir contraseñas.</li>
        <li>Evitar uso simultáneo en múltiples pestañas si la sesión reporta inconsistencias.</li>
      </ul>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">6. Control de Exposición / EPP</h2>
      <ul class="list-disc pl-6 space-y-2">
        <li>Se recomienda alias y avatar legibles para control de identidad en consola.</li>
        <li>Acceso a “Dashboard” sólo con perfil completado.</li>
      </ul>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">7. Estabilidad y Reactividad</h2>
      <p>El sistema es estable en condiciones normales. Reactividad leve ante pérdida de red o tokens expirados.</p>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">8. Eliminación</h2>
      <p>Solicita borrado de cuenta a <a class="underline" href="mailto:kemocaat.studios@gmail.com">kemocaat.studios@gmail.com</a>. Copias de seguridad se purgan periódicamente.</p>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">9. Información Reglamentaria</h2>
      <p>Documento ficticio de inmersión narrativa. No sustituye fichas de seguridad reales.</p>
    </section>
  </section>
</template>

<script setup lang="ts">
const lastUpdated = new Date().toLocaleDateString()
</script>
