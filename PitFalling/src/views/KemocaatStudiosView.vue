<template>
  <div class="kemocaat-easter-root">
    <section
      ref="containerElement"
      class="kemocaat-easter"
      :class="{ 'kemocaat-easter--booting': booting }"
      :style="customProperties"
    >
      <div class="kemocaat-easter__space" aria-hidden="true">
        <div class="kemocaat-easter__grid"></div>
        <div class="kemocaat-easter__noise"></div>
        <div class="kemocaat-easter__orb orb--violet"></div>
        <div class="kemocaat-easter__orb orb--amber"></div>
        <div class="kemocaat-easter__ring ring--outer"></div>
        <div class="kemocaat-easter__ring ring--inner"></div>
      </div>

      <div class="kemocaat-easter__card">
        <p class="kemocaat-easter__eyebrow">
          Canal oculto · <span class="kemocaat-easter__tone">KemocaatStudios_uplink</span>
        </p>

        <h1>KEMOCAAT STUDIOS</h1>
        <p class="kemocaat-easter__lede">
          Oh, encontraste uno de los easter eggs, bienvenido a los créditos de la "Iniciativa Portal Anodyne" (Simulación de web empresarial). Este apartado secreto sirve como apartado adicional de créditos, la idea de crear una web para el RPG del mistery flesh pit era algo que desde que lo anunciaron y lo adquirí resonaba en mi cabeza y... Aquí esta! por otra parte el diseño de este apartado secreto es algo mas personal y único saliendo de la estética tan "anodyne" del lugar, el proyecto "pitfalling" esta hecho sin ningún animo de lucro. La reproducción o manipulación de este sitio web esta completamente prohibida.
        </p>

        <div class="kemocaat-easter__credits">
          <article v-for="credit in credits" :key="credit.label" class="kemocaat-easter__credit">
            <component :is="credit.icon" class="kemocaat-easter__icon" size="28" weight="fill" />
            <header>
              <p class="kemocaat-easter__label">{{ credit.label }}</p>
              <p class="kemocaat-easter__role">{{ credit.names }}</p>
            </header>
            <p class="kemocaat-easter__meta">{{ credit.note }}</p>
          </article>
        </div>

        <div class="kemocaat-easter__fans">
          <PhHeart class="kemocaat-easter__heart" size="24" weight="fill" />
          <span>Proyecto creado por y para fans, apoya a trevor roberts en sus redes oficiales</span>
        </div>

        <div class="kemocaat-easter__actions">
          <RouterLink to="/" class="kemocaat-easter__button kemocaat-easter__button--primary">
            Volver al portal
          </RouterLink>
        </div>
      </div>

      <transition name="boot" appear>
        <div v-if="booting" class="kemocaat-easter__boot" aria-live="assertive">
          <div class="kemocaat-easter__boot-noise"></div>
          <div class="kemocaat-easter__boot-grid"></div>
          <div class="kemocaat-easter__boot-card">
            <p class="kemocaat-easter__boot-eyebrow">signal//corrupted</p>
            <p class="kemocaat-easter__boot-title">Errores detectados en la conexión</p>
            <p class="kemocaat-easter__boot-body">
              Reintentando conexión... sincronizando identidad
              <span class="kemocaat-easter__caret">▌</span>
            </p>
            <div class="kemocaat-easter__boot-progress">
              <span class="kemocaat-easter__boot-bar"></span>
            </div>
          </div>
        </div>
      </transition>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, type Component } from 'vue'
import { RouterLink } from 'vue-router'
import { PhPlanet, PhLightning, PhWaveform, PhMeteor, PhHeart } from '@phosphor-icons/vue'

interface CreditBlock {
  label: string
  names: string
  note: string
  icon: Component
}

const credits: CreditBlock[] = [
  {
    label: 'Dirección creativa',
    names: 'Kemocaat Studios',
    note: 'Creación y desarrollo del portal, assets visuales y código fuente, contenido y derivados.',
    icon: PhPlanet
  },
  {
    label: 'Arquitectura técnica',
    names: 'Portal Anodyne (proyecto pitfalling)',
    note: 'Vue 3, Vite, Tailwind CSS, Phosphor Icons, Vue Router, Pinia, Supabase, Google Fonts, Vercel, y más.',
    icon: PhLightning
  },
  {
    label: 'Lore y contenido',
    names: 'Trevor Roberts',
    note: 'Creación y desarrollo de la obra original, Mystery Flesh Pit National Park.',
    icon: PhMeteor
  }
] as const

const pointer = ref({ x: 0, y: 0 })
const scrollProgress = ref(0)
const booting = ref(true)
const containerElement = ref<HTMLElement | null>(null)
const footerHeight = ref(0)
let bootTimer: number | undefined
let resizeObserver: ResizeObserver | undefined

const customProperties = computed(() => ({
  '--pointer-x': pointer.value.x.toFixed(3),
  '--pointer-y': pointer.value.y.toFixed(3),
  '--scroll-progress': scrollProgress.value.toFixed(3)
}))

function updatePointer(event: PointerEvent) {
  const x = (event.clientX / window.innerWidth) * 2 - 1
  const y = (event.clientY / window.innerHeight) * 2 - 1
  pointer.value = {
    x: Number.isFinite(x) ? x : 0,
    y: Number.isFinite(y) ? y : 0
  }
}

function updateScroll() {
  if (!containerElement.value) return
  const container = containerElement.value
  const max = container.scrollHeight - container.clientHeight
  scrollProgress.value = max > 0 ? container.scrollTop / max : 0
}

function updateFooterHeight() {
  const footer = document.querySelector('footer')
  if (footer) {
    footerHeight.value = footer.offsetHeight
    // Establecer variable CSS para usar en max-height
    document.documentElement.style.setProperty('--footer-height', `${footer.offsetHeight}px`)
  }
}

onMounted(async () => {
  await nextTick()
  updateScroll()
  updateFooterHeight()
  
  // Observar cambios en el tamaño del footer
  const footer = document.querySelector('footer')
  if (footer) {
    resizeObserver = new ResizeObserver(() => {
      updateFooterHeight()
    })
    resizeObserver.observe(footer)
  }
  
  // También observar cambios en el tamaño de la ventana
  window.addEventListener('resize', updateFooterHeight)
  
  bootTimer = window.setTimeout(() => {
    booting.value = false
  }, 1600)
  window.addEventListener('pointermove', updatePointer)
  if (containerElement.value) {
    containerElement.value.addEventListener('scroll', updateScroll, { passive: true })
  }
})

onBeforeUnmount(() => {
  if (bootTimer) window.clearTimeout(bootTimer)
  window.removeEventListener('pointermove', updatePointer)
  window.removeEventListener('resize', updateFooterHeight)
  if (resizeObserver) {
    resizeObserver.disconnect()
  }
  if (containerElement.value) {
    containerElement.value.removeEventListener('scroll', updateScroll)
  }
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Space+Grotesk:wght@600&display=swap');

:global(body) {
  font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.kemocaat-easter-root {
  position: fixed;
  top: 3.5rem; /* Altura de la navbar (h-14 = 56px = 3.5rem) */
  left: 0;
  right: 0;
  bottom: v-bind('footerHeight + "px"');
  width: 100vw;
  z-index: 1;
  box-sizing: border-box;
}

.kemocaat-easter {
  position: relative;
  height: 100%;
  min-height: 100%;
  padding: 2rem clamp(1rem, 4vw, 4rem);
  overflow: hidden;
  background: radial-gradient(circle at 20% 20%, #0a1a2e, #15181b 70%);
  color: #f7f3e8;
  perspective: 1200px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
}

.kemocaat-easter--booting .kemocaat-easter__card {
  filter: grayscale(0.5) blur(2px);
  opacity: 0.4;
}

.kemocaat-easter__space {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.kemocaat-easter__grid {
  position: absolute;
  inset: -10%;
  background-image: linear-gradient(rgba(0, 168, 232, 0.15) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 0, 179, 0.12) 1px, transparent 1px);
  background-size: clamp(80px, 10vw, 140px) clamp(80px, 10vw, 140px);
  opacity: 0.5;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% {
    transform: translate3d(0, 0, 0);
  }
  100% {
    transform: translate3d(clamp(80px, 10vw, 140px), clamp(80px, 10vw, 140px), 0);
  }
}

.kemocaat-easter__noise {
  position: absolute;
  inset: 0;
  background-image: url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 preserveAspectRatio=%22none%22 viewBox=%220 0 400 400%22%3E%3Cfilter id=%22n%22 x=%220%22 y=%220%22 width=%22100%25%22 height=%22100%25%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.95%22 numOctaves=%222%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22400%22 height=%22400%22 filter=%22url(%23n)%22 opacity=%220.4%22/%3E%3C/svg%3E');
  mix-blend-mode: screen;
  opacity: 0.35;
}

.kemocaat-easter__orb {
  position: absolute;
  width: clamp(200px, 25vw, 320px);
  height: clamp(200px, 25vw, 320px);
  border-radius: 50%;
  filter: blur(20px);
  opacity: 0.7;
  transform: translate3d(
    calc(var(--pointer-x, 0) * 30px),
    calc(-20px + var(--pointer-y, 0) * 20px),
    0
  );
}

.orb--violet {
  background: radial-gradient(circle, #e8009b, transparent 60%);
  top: 10%;
  left: 15%;
}

.orb--amber {
  background: radial-gradient(circle, #00eeff, transparent 65%);
  bottom: 5%;
  right: 12%;
}

.kemocaat-easter__ring {
  position: absolute;
  border: 1px solid rgba(0, 247, 255, 0.4);
  border-radius: 50%;
  transform-style: preserve-3d;
}

.ring--outer {
  width: clamp(300px, 40vw, 520px);
  height: clamp(300px, 40vw, 520px);
  left: 50%;
  top: 52%;
  transform: translate(-50%, -50%)
    rotateX(calc(60deg + var(--pointer-y, 0) * 10deg))
    rotateZ(calc(var(--pointer-x, 0) * 10deg));
  opacity: 0.4;
  border-color: rgba(0, 238, 255, 0.5);
}

.ring--inner {
  width: clamp(150px, 20vw, 260px);
  height: clamp(150px, 20vw, 260px);
  left: 25%;
  top: 30%;
  transform: translate(-50%, -50%) rotateZ(calc(var(--pointer-x, 0) * -30deg));
  border-color: rgba(112, 0, 232, 0.5);
}

.kemocaat-easter__card {
  position: relative;
  width: min(1100px, calc(100% - 2rem));
  max-width: 1100px;
  padding: 2rem;
  border-radius: 32px;
  background: rgba(21, 24, 27, 0.75);
  border: 1px solid rgba(151, 0, 232, 0.2);
  backdrop-filter: blur(18px) saturate(150%);
  box-shadow: 0 40px 120px rgba(0, 0, 0, 0.6), 0 0 60px rgba(0, 168, 232, 0.1);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  font-family: 'Inter', sans-serif;
  max-height: none;
  overflow-y: visible;
  overflow-x: hidden;
  box-sizing: border-box;
  margin: 0 auto;
  transform: scale(0.8);  /* <--- AQUÍ, cambié de 0.85 a 0.8 */
  transform-origin: center center;
}

.kemocaat-easter__eyebrow {
  letter-spacing: 0.35em;
  font-size: clamp(0.65rem, 1.5vw, 0.75rem);
  text-transform: uppercase;
  color: rgba(247, 243, 232, 0.7);
  word-break: break-word;
}

.kemocaat-easter__tone {
  margin-left: 0.25rem;
  background: linear-gradient(90deg, #00dce8, #6f00ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.kemocaat-easter__card h1 {
  font-family: 'Space Grotesk', 'Inter', sans-serif;
  font-size: clamp(2rem, 6vw, 4rem);
  letter-spacing: -0.04em;
  text-transform: uppercase;
  color: #fff8e8;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(0, 168, 232, 0.3);
  line-height: 1.1;
  margin: 0;
}

.kemocaat-easter__lede {
  width: 100%;
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  line-height: 1.6;
  color: rgba(247, 243, 232, 0.9);
  margin: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.kemocaat-easter__credits {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(220px, 100%), 1fr));
  gap: clamp(0.75rem, 2vw, 1rem);
}

.kemocaat-easter__credit {
  border: 1px solid rgba(232, 0, 66, 0.2);
  border-radius: clamp(16px, 3vw, 20px);
  padding: clamp(1rem, 2.5vw, 1.25rem);
  background: rgba(21, 24, 27, 0.7);
  backdrop-filter: blur(12px);
  display: grid;
  gap: clamp(0.35rem, 1vw, 0.45rem);
  transform: translate3d(
    calc(var(--pointer-x, 0) * -8px),
    calc(var(--pointer-y, 0) * 8px),
    0
  );
  box-shadow: inset 0 0 30px rgba(232, 0, 174, 0.15);
}

.kemocaat-easter__icon {
  color: #00ddff;
  width: clamp(24px, 4vw, 28px);
  height: clamp(24px, 4vw, 28px);
  flex-shrink: 0;
}

.kemocaat-easter__label {
  font-size: clamp(0.65rem, 1.5vw, 0.75rem);
  text-transform: uppercase;
  color: rgba(247, 243, 232, 0.7);
  letter-spacing: 0.2em;
}

.kemocaat-easter__role {
  font-size: clamp(1rem, 2.5vw, 1.15rem);
  font-weight: 600;
  word-break: break-word;
}

.kemocaat-easter__meta {
  font-size: clamp(0.8rem, 2vw, 0.85rem);
  color: rgba(247, 243, 232, 0.75);
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.kemocaat-easter__timeline {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 0.75rem;
  border-top: 1px solid rgba(232, 0, 143, 0.2);
  padding-top: 1rem;
}

.kemocaat-easter__tick {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: rgba(247, 243, 232, 0.75);
}

.kemocaat-easter__tick span:first-child {
  font-size: 1.4rem;
  font-family: 'Space Grotesk', sans-serif;
  color: #00e5ff;
}

.kemocaat-easter__fans {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: clamp(0.4rem, 1.5vw, 0.5rem);
  margin-top: clamp(0.75rem, 2vw, 1rem);
  padding-top: clamp(1rem, 2.5vw, 1.25rem);
  border-top: 1px solid rgba(232, 0, 143, 0.2);
  font-size: clamp(0.8rem, 2vw, 0.9rem);
  color: rgba(247, 243, 232, 0.8);
  text-transform: lowercase;
  letter-spacing: 0.05em;
  text-align: center;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.kemocaat-easter__heart {
  color: #00d9ff;
  animation: heartbeat 1.5s ease-in-out infinite;
  width: clamp(20px, 3vw, 24px);
  height: clamp(20px, 3vw, 24px);
  flex-shrink: 0;
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  10%, 30% {
    transform: scale(1.1);
  }
  20%, 40% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.15);
  }
}

.kemocaat-easter__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.kemocaat-easter__button {
  border: 1px solid rgba(232, 0, 166, 0.4);
  border-radius: 999px;
  padding: clamp(0.75rem, 2vw, 0.85rem) clamp(1.25rem, 3vw, 1.5rem);
  font-size: clamp(0.85rem, 2vw, 0.95rem);
  font-weight: 600;
  color: #fff8e8;
  background: transparent;
  cursor: pointer;
  transition: background 200ms ease, border-color 200ms ease, transform 200ms ease;
  text-decoration: none;
  text-align: center;
  white-space: nowrap;
}

.kemocaat-easter__button:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 0, 191, 0.8);
  box-shadow: 0 0 20px rgba(255, 0, 191, 0.3);
}

.kemocaat-easter__button--primary {
  background: linear-gradient(120deg, rgba(232, 0, 97, 0.8), rgba(0, 221, 255, 0.9));
  border: none;
  box-shadow: 0 10px 30px rgba(232, 0, 116, 0.3), 0 0 20px rgba(0, 234, 255, 0.2);
}

.kemocaat-easter__boot {
  position: absolute;
  inset: 0;
  background: rgba(10, 26, 46, 0.9);
  display: grid;
  place-items: center;
  z-index: 10;
  overflow: hidden;
}

.kemocaat-easter__boot-noise,
.kemocaat-easter__boot-grid {
  position: absolute;
  inset: 0;
  opacity: 0.4;
  pointer-events: none;
}

.kemocaat-easter__boot-noise {
  background-image: repeating-linear-gradient(
    0deg,
    rgba(255, 255, 255, 0.08) 0,
    rgba(255, 255, 255, 0.08) 1px,
    transparent 1px,
    transparent 2px
  );
  animation: scan 0.6s linear infinite;
}

.kemocaat-easter__boot-grid {
  background-image: linear-gradient(rgba(255, 0, 72, 0.25) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 168, 232, 0.25) 1px, transparent 1px);
  background-size: 70px 70px;
  mix-blend-mode: screen;
}

.kemocaat-easter__boot-card {
  position: relative;
  padding: 2rem;
  border-radius: 24px;
  border: 1px solid rgba(0, 168, 232, 0.3);
  background: rgba(21, 24, 27, 0.85);
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 168, 232, 0.2);
  max-width: 540px;
  text-align: left;
}

.kemocaat-easter__boot-eyebrow {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.4em;
  color: rgba(247, 243, 232, 0.7);
}

.kemocaat-easter__boot-title {
  font-size: 1.4rem;
  font-weight: 600;
  margin-top: 0.5rem;
}

.kemocaat-easter__boot-body {
  margin-top: 0.75rem;
  color: rgba(247, 243, 232, 0.85);
  font-size: 0.95rem;
}

.kemocaat-easter__caret {
  animation: caret 0.8s steps(1) infinite;
}

.kemocaat-easter__boot-progress {
  margin-top: 1.5rem;
  width: 100%;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
  overflow: hidden;
}

.kemocaat-easter__boot-bar {
  display: block;
  height: 100%;
  width: 100%;
  background: linear-gradient(90deg, #00a8e8, #ff0037);
  animation: progress 1.4s ease-in forwards;
}

.boot-enter-active,
.boot-leave-active {
  transition: opacity 200ms ease, transform 200ms ease;
}

.boot-enter-from,
.boot-leave-to {
  opacity: 0;
  transform: scale(1.05);
}

@keyframes caret {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0;
  }
}

@keyframes progress {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes scan {
  from {
    transform: translateY(-10px);
  }
  to {
    transform: translateY(10px);
  }
}

@media (max-width: 768px) {
  .kemocaat-easter {
    padding: 1.5rem 1rem;
    align-items: flex-start;
    overflow-y: auto;
  }

  .kemocaat-easter__card {
    margin: 0;
    width: calc(100% - 2rem);
    max-width: 100%;
    padding: 1.5rem;
    max-height: none;
    overflow-y: visible;
  }

  .kemocaat-easter__credits {
    grid-template-columns: 1fr;
  }

  .kemocaat-easter__actions {
    flex-direction: column;
    width: 100%;
  }

  .kemocaat-easter__button {
    width: 100%;
  }

  .kemocaat-easter__orb {
    opacity: 0.4;
  }

  .kemocaat-easter__ring {
    opacity: 0.2;
  }

  .kemocaat-easter__boot-card {
    padding: 1.5rem;
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }
}

@media (max-width: 480px) {
  .kemocaat-easter {
    padding: 1rem 0.75rem;
  }

  .kemocaat-easter__card {
    padding: 1.25rem;
    border-radius: 24px;
    max-height: none;
  }

  .kemocaat-easter__card h1 {
    font-size: clamp(1.5rem, 8vw, 2.5rem);
  }

  .kemocaat-easter__eyebrow {
    font-size: 0.6rem;
    letter-spacing: 0.2em;
  }

  .kemocaat-easter__fans {
    flex-direction: column;
    text-align: center;
  }

  .kemocaat-easter__boot-card {
    padding: 1rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .kemocaat-easter__card {
    width: min(900px, calc(100% - 2rem));
  }

  .kemocaat-easter__credits {
    grid-template-columns: repeat(auto-fit, minmax(min(200px, 100%), 1fr));
  }
}
</style>