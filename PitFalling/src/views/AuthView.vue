<template>
  <section class="mx-auto w-full max-w-lg px-4 sm:px-6 lg:px-0 py-8">
    <header class="mb-6">
      <p class="font-anodyne-mono text-xs tracking-widest uppercase text-anodyne-ink-2">
        Anodyne Systems — Credential Checkpoint
      </p>
      <h1 class="text-2xl font-anodyne-mono font-semibold">Acceso</h1>
    </header>

    <div class="border border-anodyne bg-white rounded-sm overflow-hidden">
      <!-- Tabs -->
      <div role="tablist" aria-label="Seleccionar modo de acceso" class="grid grid-cols-2 border-b border-anodyne">
        <button
          role="tab"
          :aria-selected="mode === 'login'"
          class="px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]"
          :class="mode === 'login' ? 'bg-anodyne-flesh-100' : 'hover:bg-anodyne-flesh-100/60'"
          @click="mode = 'login'"
        >
          Iniciar sesión
        </button>
        <button
          role="tab"
          :aria-selected="mode === 'register'"
          class="px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]"
          :class="mode === 'register' ? 'bg-anodyne-flesh-100' : 'hover:bg-anodyne-flesh-100/60'"
          @click="mode = 'register'"
        >
          Crear cuenta
        </button>
      </div>

      <div class="p-4 sm:p-6">
        <!-- LOGIN -->
        <form v-if="mode==='login'" @submit.prevent="handleLogin" class="space-y-4" novalidate>
          <div>
            <label for="emailL" class="block text-sm font-medium">Correo corporativo</label>
            <input
              id="emailL"
              v-model.trim="email"
              type="email"
              required
              autocomplete="email"
              class="mt-1 block w-full border border-anodyne px-3 py-2 outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]"
            />
          </div>
          <div>
            <label for="passL" class="block text-sm font-medium">Contraseña</label>
            <input
              id="passL"
              v-model="password"
              type="password"
              minlength="6"
              required
              autocomplete="current-password"
              class="mt-1 block w-full border border-anodyne px-3 py-2 outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]"
            />
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              :disabled="loading"
              class="w-full sm:w-auto inline-flex items-center rounded-sm bg-anodyne-brand hover:bg-anodyne-brand-2 text-white px-4 py-2 text-sm font-semibold tracking-wide disabled:opacity-60"
            >
              {{ loading ? 'Verificando…' : 'Entrar' }}
            </button>
            <button
              type="button"
              class="text-sm underline underline-offset-4 hover:no-underline sm:ml-auto"
              @click="mode='register'"
            >
              ¿No tienes cuenta? Regístrate
            </button>
          </div>

          <p v-if="errorMsg" class="text-sm text-[crimson]">{{ errorMsg }}</p>
        </form>

        <!-- REGISTRO -->
        <form v-else @submit.prevent="handleRegister" class="space-y-4" novalidate>
          <div>
            <label for="emailR" class="block text-sm font-medium">Correo corporativo</label>
            <input
              id="emailR"
              v-model.trim="email"
              type="email"
              required
              autocomplete="email"
              class="mt-1 block w-full border border-anodyne px-3 py-2 outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]"
            />
          </div>
          <div>
            <label for="passR" class="block text-sm font-medium">Contraseña (mín. 6)</label>
            <input
              id="passR"
              v-model="password"
              type="password"
              minlength="6"
              required
              autocomplete="new-password"
              class="mt-1 block w-full border border-anodyne px-3 py-2 outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]"
            />
          </div>

          <div class="flex flex-col sm:flex-row sm:items-center gap-3">
            <button
              :disabled="loading"
              class="w-full sm:w-auto inline-flex items-center rounded-sm bg-anodyne-brand hover:bg-anodyne-brand-2 text-white px-4 py-2 text-sm font-semibold tracking-wide disabled:opacity-60"
            >
              {{ loading ? 'Creando…' : 'Registrarme' }}
            </button>
            <span class="text-xs text-anodyne-ink-2 sm:ml-auto">
              Al registrarte aceptas las políticas de Anodyne.
            </span>
          </div>

          <p v-if="errorMsg" class="text-sm text-[crimson]">{{ errorMsg }}</p>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

type Mode = 'login' | 'register'
const mode = ref<Mode>('login')
const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMsg = ref('')

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

onMounted(async () => {
  // Failsafe: si venimos con ?force=1, ejecutar limpieza local inmediata
  if (route.query.force === '1') {
    try { await auth.hardLocalLogout() } catch {}
  }
})

function toMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  try { return JSON.stringify(err) } catch { return 'Unknown error' }
}

async function handleLogin() {
  errorMsg.value = ''
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    const next = (route.query.next as string) || '/dashboard'
    await router.push(next)
  } catch (err: unknown) {
    errorMsg.value = toMessage(err) || 'No se pudo iniciar sesión.'
  } finally {
    loading.value = false
  }
}

async function handleRegister() {
  errorMsg.value = ''
  loading.value = true
  try {
    await auth.register(email.value, password.value)
    // Si tu proyecto tiene confirmación de email ON, no habrá sesión:
    if (!auth.isAuthed) {
      errorMsg.value = 'Revisa tu correo para confirmar tu cuenta (Anodyne Systems).'
      return
    }
    await router.push('/account/setup')
  } catch (err: unknown) {
    errorMsg.value = toMessage(err) || 'No se pudo registrar la cuenta.'
  } finally {
    loading.value = false
  }
}
</script>
