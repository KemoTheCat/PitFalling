<template>
  <section class="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <div class="border border-yellow-600/50 bg-yellow-100/70 text-yellow-900 p-4">
      <p class="font-semibold uppercase tracking-widest text-xs">Aviso de Seguridad — Uso Ficticio</p>
      <p class="mt-2 text-sm">
        Proyecto de fans no oficial, sin fines de lucro. Apoya a Trevor Roberts:
        <a class="underline" href="https://www.mysteryfleshpitnationalpark.com" target="_blank" rel="noopener">Sitio oficial</a> •
        <a class="underline" href="https://www.drivethrurpg.com/en/product/498633/mystery-flesh-pit-national-park-the-rpg" target="_blank" rel="noopener">Compra el RPG</a>.
        Fuentes: Inter & IBM Plex Mono (Google Fonts). Sin imágenes generadas por IA.
      </p>
    </div>

    <header class="space-y-1">
      <p class="font-anodyne-mono text-xs tracking-widest uppercase text-anodyne-ink-2">Anodyne Systems — Privacy Control</p>
      <h1 class="text-3xl font-bold">Política de Privacidad</h1>
      <p class="text-sm text-anodyne-ink-2">Última actualización: {{ lastUpdated }}</p>
    </header>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">1. Responsable y Finalidad</h2>
      <p>
        Responsable: <strong>Kemocaat Studios</strong>. Tratamos datos mínimos (correo, alias, avatar) para:
        autenticación, sesión, y funcionalidades propias del portal para la mesa de rol.
      </p>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">2. Base Legal</h2>
      <ul class="list-disc pl-6 space-y-2">
        <li>Consentimiento del usuario (registro).</li>
        <li>Ejecución de una relación tipo “servicio” (proveer el portal).</li>
        <li>Interés legítimo en mantener seguridad y prevención de abuso.</li>
      </ul>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">3. Conservación</h2>
      <p>
        Conservamos datos mientras la cuenta esté activa o hasta que solicites su eliminación.
        Copias de seguridad pueden persistir durante un periodo limitado.
      </p>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">4. Destinatarios y Encargados</h2>
      <ul class="list-disc pl-6 space-y-2">
        <li>Proveedor de base de datos/autenticación: <strong>Supabase</strong>.</li>
        <li>Alojamiento/despliegue: p.ej. <strong>Vercel</strong> (si aplica).</li>
        <li>No vendemos datos ni los cedemos a terceros comerciales.</li>
      </ul>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">5. Transferencias Internacionales</h2>
      <p>
        Algunos servicios pueden situarse fuera de tu país. Adoptamos medidas razonables para proteger
        la información (cifrado en tránsito y en reposo cuando esté disponible).
      </p>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">6. Seguridad</h2>
      <p>
        Aplicamos medidas técnicas y organizativas proporcionales, pero ningún sistema es infalible.
        Usa contraseñas robustas y no compartas credenciales.
      </p>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">7. Derechos</h2>
      <ul class="list-disc pl-6 space-y-2">
        <li>Acceso, rectificación, supresión, oposición y portabilidad cuando aplique.</li>
        <li>Solicitudes: <a class="underline" href="mailto:kemocaat.studios@gmail.com">kemocaat.studios@gmail.com</a>.</li>
      </ul>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">8. Cookies</h2>
      <p>
        Usamos cookies/tokens estrictamente necesarios (sesión) para que el portal funcione.
        No realizamos perfiles comerciales.
      </p>
    </section>

    <section class="space-y-3">
      <h2 class="text-xl font-semibold">9. Cambios</h2>
      <p>
        Podemos actualizar esta Política para reflejar ajustes técnicos o legales.
        Publicaremos la fecha de última modificación.
      </p>
    </section>
  </section>
</template>

<script setup lang="ts">
const lastUpdated = new Date().toLocaleDateString()
</script>
