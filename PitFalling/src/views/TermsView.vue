<template>
  <section class="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
    <!-- Banner ficticio + créditos -->
    <div class="border border-yellow-600/50 bg-yellow-100/70 text-yellow-900 p-4">
      <p class="font-semibold uppercase tracking-widest text-xs">Aviso de Seguridad — Uso Ficticio</p>
      <p class="mt-2 text-sm leading-relaxed">
        Este portal forma parte de una <strong>experiencia de rol de mesa</strong> inspirada en el universo
        <em>Mystery Flesh Pit National Park</em> de <strong>Trevor Roberts</strong>. Es un proyecto de fans
        no oficial, <strong>no comercial</strong> y <strong>no afiliado</strong>.
        Para participar legalmente, adquiere el libro oficial del RPG:
        <a class="underline" href="https://www.drivethrurpg.com/en/product/498633/mystery-flesh-pit-national-park-the-rpg" target="_blank" rel="noopener">DriveThruRPG</a>.
      </p>
      <p class="mt-2 text-sm">
        Apoya al autor en el portal oficial:
        <a class="underline" href="https://www.mysteryfleshpitnationalpark.com" target="_blank" rel="noopener">mysteryfleshpitnationalpark.com</a>
      </p>
      <p class="mt-2 text-xs">
        Tipografías: <em>Inter</em> e <em>IBM Plex Mono</em> bajo licencia de Google Fonts.
        Imágenes y marcas: © Trevor Roberts (obra original) y © Kemocaat Studios (assets y código del portal).
        <strong>No se han usado herramientas de IA</strong> para generar imágenes.
      </p>
    </div>

    <header class="space-y-1">
      <p class="font-anodyne-mono text-xs tracking-widest uppercase text-anodyne-ink-2">Anodyne Systems — Legal Interface</p>
      <h1 class="text-3xl font-bold">Términos de Servicio</h1>
      <p class="text-sm text-anodyne-ink-2">Última actualización: {{ lastUpdated }}</p>
    </header>

    <!-- 1. Partes y objeto -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">1. Partes y Objeto</h2>
      <p>
        Este portal (“Servicio”) es operado por <strong>Kemocaat Studios</strong> (“Nosotros”).
        El universo <em>Mystery Flesh Pit National Park</em> es creación de <strong>Trevor Roberts</strong>.
        Nosotros no reclamamos derecho alguno sobre la obra original salvo el diseño, código y
        contenidos propios de este sitio.
      </p>
      <p>
        Estos Términos regulan el uso del Servicio por parte del usuario. Al acceder, aceptas
        que el Servicio es <strong>exclusivamente de entretenimiento</strong>, y que es un recurso
        de apoyo para una <strong>mesa de rol concreta de Kemocaat Studios</strong>; no se recomienda su
        uso general sin adaptación expresa.
      </p>
    </section>

    <!-- 2. No afiliación / Propiedad intelectual -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">2. No Afiliación y Propiedad Intelectual</h2>
      <ul class="list-disc pl-6 space-y-2">
        <li>Proyecto de fans, no afiliado, no oficial y no comercial.</li>
        <li>© Trevor Roberts — universo, marcas, personajes, iconografía de la obra original.</li>
        <li>© Kemocaat Studios — código fuente, diseño del portal y assets propios.</li>
        <li>Fuentes <em>Inter</em> e <em>IBM Plex Mono</em> distribuidas por Google Fonts.</li>
        <li><strong>Sin IA en imágenes:</strong> los assets visuales fueron producidos manualmente.</li>
      </ul>
    </section>

    <!-- 3. Uso aceptable / prohibiciones -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">3. Uso Aceptable</h2>
      <ul class="list-disc pl-6 space-y-2">
        <li>Usar el Servicio para partidas del RPG conforme a su licencia y compra legal.</li>
        <li>No redistribuir, vender o mercantilizar el portal, sus componentes o assets.</li>
        <li>No suplantar identidad, no vulnerar seguridad, no introducir malware.</li>
        <li>No extraer datos ni automatizar scraping sin autorización.</li>
      </ul>
    </section>

    <!-- 4. Cuentas / disponibilidad -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">4. Cuentas y Disponibilidad</h2>
      <p>
        Puedes registrarte con correo, alias y avatar. Nos reservamos el derecho de
        suspender cuentas por uso indebido. El Servicio puede cambiar o interrumpirse
        sin previo aviso (mantenimiento, mejoras o cierres de campaña).
      </p>
    </section>

    <!-- 5. Exenciones y responsabilidad -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">5. Exenciones y Limitación de Responsabilidad</h2>
      <p>
        El Servicio se ofrece “tal cual”. No garantizamos disponibilidad continua ni
        exactitud del contenido ficticio. En la medida máxima permitida por la ley, no
        seremos responsables por daños indirectos, pérdida de datos o lucro cesante.
      </p>
    </section>

    <!-- 6. DMCA/Retiro -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">6. Avisos de Retiro / DMCA</h2>
      <p>
        Si eres titular de derechos y consideras que algún contenido vulnera tu obra,
        escribe a <a class="underline" href="mailto:kemocaat.studios@gmail.com">kemocaat.studios@gmail.com</a>
        con la identificación del material y tu acreditación. Retiraremos o deshabilitaremos el
        acceso de forma diligente.
      </p>
    </section>

    <!-- 7. Ley aplicable -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">7. Ley Aplicable y Jurisdicción</h2>
      <p>
        Estos Términos se rigen por las leyes de <strong>Colombia</strong> (salvo normas de conflicto).
        Cualquier controversia se someterá a los tribunales de la ciudad del operador del Servicio,
        salvo disposición imperativa distinta.
      </p>
    </section>

    <!-- 8. Cambios -->
    <section class="space-y-3">
      <h2 class="text-xl font-semibold">8. Cambios a los Términos</h2>
      <p>
        Podemos modificar estos Términos. El uso continuado tras su publicación implica aceptación.
      </p>
    </section>
  </section>
</template>

<script setup lang="ts">
const lastUpdated = new Date().toLocaleDateString()
</script>
