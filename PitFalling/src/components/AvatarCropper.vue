<template>
  <div class="space-y-3">
    <!-- Lienzo con marco cuadrado -->
    <div class="relative border border-anodyne bg-white p-3">
      <div
        ref="frameEl"
        class="mx-auto aspect-square w-full max-w-xs sm:max-w-sm bg-[#f3f3f3] border border-anodyne relative overflow-hidden"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @wheel.prevent="onWheel"
      >
        <canvas ref="canvasEl" class="h-full w-full block"></canvas>
        <!-- guía -->
        <div class="pointer-events-none absolute inset-0 ring-1 ring-anodyne/60"></div>
      </div>

      <!-- Controles -->
      <div class="mt-3 grid grid-cols-1 sm:grid-cols-[auto,1fr,auto] items-center gap-2">
        <label class="text-sm">Archivo</label>
        <input type="file" accept="image/*" @change="onPick" class="block w-full text-sm" />
        <span class="hidden sm:block text-sm text-anodyne-ink-2">{{ fileName || '—' }}</span>

        <label class="text-sm sm:col-start-1 sm:mt-2">Zoom</label>
        <input
          v-model.number="zoom"
          type="range"
          :min="minZoom"
          :max="maxZoom"
          step="0.001"
          class="w-full"
          @input="draw"
        />
        <span class="text-sm">{{ Math.round(zoom*100) }}%</span>
      </div>
    </div>

    <div class="flex flex-wrap gap-3">
      <button
        type="button"
        class="px-4 py-2 bg-anodyne-brand text-white rounded-sm disabled:opacity-60"
        :disabled="!imgReady"
        @click="emitCrop"
      >
        Guardar recorte
      </button>
      <button type="button" class="px-4 py-2 border border-anodyne rounded-sm" @click="reset">
        Reset
      </button>
      <span v-if="errorMsg" class="text-[crimson] text-sm">{{ errorMsg }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const emit = defineEmits<{
  (e: 'cropped', file: File): void
}>()

const canvasEl = ref<HTMLCanvasElement | null>(null)
const frameEl = ref<HTMLDivElement | null>(null)

const img = new Image()
let imgW = 0, imgH = 0

// vista
const zoom = ref(1)
const minZoom = ref(0.2)
const maxZoom = ref(5)
const offsetX = ref(0)
const offsetY = ref(0)
const dragging = ref(false)
let lastX = 0, lastY = 0

// estado
const imgReady = ref(false)
const fileName = ref('')
const errorMsg = ref('')

// helpers -------------------------------------------------

function fitToContain() {
  // que la imagen quepa completa dentro del frame (para tener zoom mínimo realista)
  const frame = frameEl.value!
  const size = frame.clientWidth // es cuadrado
  const k = Math.min(size / imgW, size / imgH)
  minZoom.value = Math.min(1, k) // deja hacer zoom-out hasta que "quepa"
  // y un máximo razonable (5x el quepa)
  maxZoom.value = Math.max(minZoom.value * 5, 2)
  // empieza en "cover" visualmente agradable
  const cover = Math.max(size / imgW, size / imgH)
  zoom.value = cover

  // centra
  offsetX.value = (size - imgW * zoom.value) / 2
  offsetY.value = (size - imgH * zoom.value) / 2
}

function draw() {
  const c = canvasEl.value
  const frame = frameEl.value
  if (!c || !frame || !imgReady.value) return
  const size = frame.clientWidth
  c.width = size
  c.height = size

  const ctx = c.getContext('2d')!
  ctx.clearRect(0, 0, size, size)
  ctx.imageSmoothingQuality = 'high'

  // límites para no dejar espacios
  const minX = size - imgW * zoom.value
  const minY = size - imgH * zoom.value
  offsetX.value = clamp(offsetX.value, minX, 0)
  offsetY.value = clamp(offsetY.value, minY, 0)

  ctx.drawImage(img, 0, 0, imgW, imgH, offsetX.value, offsetY.value, imgW * zoom.value, imgH * zoom.value)
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

function onPointerDown(e: PointerEvent) {
  if (!imgReady.value) return
  dragging.value = true
  lastX = e.clientX
  lastY = e.clientY
  ;(e.target as Element).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!dragging.value) return
  const dx = e.clientX - lastX
  const dy = e.clientY - lastY
  lastX = e.clientX
  lastY = e.clientY
  offsetX.value += dx
  offsetY.value += dy
  draw()
}

function onPointerUp(e: PointerEvent) {
  dragging.value = false
  ;(e.target as Element).releasePointerCapture?.(e.pointerId)
}

function onWheel(e: WheelEvent) {
  if (!imgReady.value) return
  const delta = -e.deltaY
  const factor = Math.exp(delta * 0.0015) // zoom suave
  const prevZoom = zoom.value
  let next = clamp(prevZoom * factor, minZoom.value, maxZoom.value)

  // zoom al cursor: ajustar offset para que el punto bajo el cursor quede fijo
  const rect = frameEl.value!.getBoundingClientRect()
  const cx = e.clientX - rect.left
  const cy = e.clientY - rect.top

  const k = next / prevZoom
  offsetX.value = cx - (cx - offsetX.value) * k
  offsetY.value = cy - (cy - offsetY.value) * k

  zoom.value = next
  draw()
}

function reset() {
  if (!frameEl.value) return
  fitToContain()
  draw()
}

async function onPick(ev: Event) {
  errorMsg.value = ''
  const input = ev.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  fileName.value = file.name

  // downscale en memoria si es gigante (max 2048px)
  const prepared = await downscaleIfNeeded(file, 2048)
  const url = URL.createObjectURL(prepared)
  img.onload = () => {
    imgW = img.width
    imgH = img.height
    URL.revokeObjectURL(url)
    imgReady.value = true
    fitToContain()
    draw()
  }
  img.onerror = () => {
    errorMsg.value = 'No se pudo cargar la imagen.'
  }
  img.src = url
}

async function emitCrop() {
  if (!imgReady.value || !canvasEl.value) return
  // exportar a 512x512
  const outSize = 512
  const out = document.createElement('canvas')
  out.width = outSize
  out.height = outSize
  const ctx = out.getContext('2d')!

  // mapear desde el canvas visible
  const src = canvasEl.value
  ctx.drawImage(src, 0, 0, src.width, src.height, 0, 0, outSize, outSize)

  const blob: Blob = await new Promise((res) => out.toBlob((b) => res(b as Blob), 'image/jpeg', 0.92))
  const file = new File([blob], 'avatar.jpg', { type: 'image/jpeg' })
  emit('cropped', file)
}

async function downscaleIfNeeded(file: File, maxSide: number): Promise<File> {
  const imgTmp = new Image()
  const url = URL.createObjectURL(file)
  await new Promise<void>((ok, err) => {
    imgTmp.onload = () => ok()
    imgTmp.onerror = () => err(new Error('img load error'))
    imgTmp.src = url
  })
  URL.revokeObjectURL(url)

  const w = imgTmp.width
  const h = imgTmp.height
  const bigger = Math.max(w, h)
  if (bigger <= maxSide) return file

  const k = maxSide / bigger
  const cw = Math.round(w * k)
  const ch = Math.round(h * k)
  const c = document.createElement('canvas')
  c.width = cw; c.height = ch
  const ctx = c.getContext('2d')!
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(imgTmp, 0, 0, cw, ch)
  const blob: Blob = await new Promise((res) => c.toBlob((b) => res(b as Blob), 'image/jpeg', 0.92))
  return new File([blob], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' })
}

onMounted(() => {
  // redibuja si cambia el tamaño del frame (responsive)
  const ro = new ResizeObserver(() => draw())
  if (frameEl.value) ro.observe(frameEl.value)
})
watch(zoom, draw)
</script>
