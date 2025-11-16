<template>
  <section class="mx-auto max-w-6xl p-4 space-y-6">
    <!-- Encabezado -->
    <header class="flex items-center justify-between">
      <div>
        <p class="font-anodyne-mono text-xs tracking-widest uppercase text-anodyne-ink-2">
          Anodyne Systems © Contractor Console
        </p>
        <h1 class="text-2xl font-anodyne-mono font-semibold">
          Bienvenido, {{ displayName }}
        </h1>
        <p class="text-sm text-anodyne-ink-2">Panel de operaciones del visitante autorizado.</p>
      </div>

      <div class="text-right">
        <span class="inline-flex items-center gap-2 border border-anodyne bg-white px-3 py-1.5 rounded-sm">
          <span class="text-[11px] uppercase tracking-widest text-anodyne-ink-2">Rol</span>
          <span class="inline-flex items-center rounded-sm px-1.5 py-[2px] border border-anodyne bg-anodyne-flesh-100 text-sm">
            {{ role }}
          </span>
        </span>
      </div>
    </header>

    <!-- Banner Rol pendiente -->
    <div
      v-if="rolePending"
      class="border border-yellow-600/50 bg-yellow-100/60 text-yellow-900 p-4 text-sm"
    >
      <div class="font-semibold mb-1">Activación de Rol Pendiente</div>
      <p>
        Tu rol actual es <strong>{{ role }}</strong>. Se activará automáticamente
        cuando crees tu <strong>Registro de ingreso</strong>.
      </p>
    </div>

    <!-- Acciones -->
    <div class="flex items-center justify-between">
      <h2 class="font-anodyne-mono text-base uppercase tracking-widest">Operaciones</h2>
      <button
        :disabled="creating"
        @click="createCharacter"
        class="inline-flex items-center rounded-sm bg-anodyne-brand hover:bg-anodyne-brand-2 text-white px-4 py-2 text-sm font-semibold disabled:opacity-60"
      >
        {{ creating ? 'Creandoâ€¦' : 'Crear nuevo jugador' }}
      </button>
    </div>

    <!-- Mensajes -->
    <p v-if="errorMsg" class="text-[crimson] text-sm">{{ errorMsg }}</p>

    <!-- Mis Personajes -->
    <section class="space-y-3">
      <h3 class="font-anodyne-mono text-base uppercase tracking-widest">Mis Personajes</h3>

      <div v-if="loading" class="text-sm text-anodyne-ink-2">Cargando...¦</div>

      <div v-else-if="characters.length === 0" class="border border-anodyne bg-white p-5">
        <p class="text-sm text-anodyne-ink-2">
          Aún no tienes un personaje. Crea el primero con el botón
          <em>"Crear nuevo jugador"</em>.
        </p>
      </div>

      <ul v-else class="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <li
          v-for="c in characters"
          :key="c.id"
          class="border border-anodyne bg-white p-4 flex items-center gap-3"
        >
          <div class="h-12 w-12 rounded-sm overflow-hidden border border-anodyne bg-anodyne-flesh-100">
            <img v-if="c.avatar_url" :src="c.avatar_url" alt="" class="h-full w-full object-cover" />
          </div>
          <div class="min-w-0">
            <div class="font-medium truncate">{{ c.name }}</div>
            <div class="text-xs text-anodyne-ink-2">
              {{ new Date(c.created_at).toLocaleDateString() }}
            </div>
          </div>
        </li>
      </ul>
    </section>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'

 type CharacterRow = {
  id: string
  user_id: string
  name: string
  avatar_url: string | null
  created_at: string
}

const auth = useAuthStore()

const role = computed(() => auth.role)
const displayName = computed(() => auth.nickname || auth.user?.email || 'Usuario')

const characters = ref<CharacterRow[]>([])
const loading = ref(false)
const creating = ref(false)
const errorMsg = ref('')

const STORAGE_KEY = 'pf_mock_characters'

function readAllCharacters(): CharacterRow[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function persistCharacters(all: CharacterRow[]): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(all)) } catch {}
}

const rolePending = computed(() => role.value === 'Visitor' && characters.value.length === 0)

async function loadCharacters() {
  errorMsg.value = ''
  if (!auth.user) {
    characters.value = []
    return
  }
  loading.value = true
  try {
    const all = readAllCharacters()
    characters.value = all
      .filter(c => c.user_id === auth.user?.id)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  } finally {
    loading.value = false
  }
}

async function createCharacter() {
  if (!auth.user) { errorMsg.value = 'No hay sesión'; return }
  creating.value = true
  errorMsg.value = ''
  try {
    const now = new Date().toISOString()
    const newCharacter: CharacterRow = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}`,
      user_id: auth.user.id,
      name: `Nuevo personaje ${characters.value.length + 1}`,
      avatar_url: null,
      created_at: now
    }
    const all = readAllCharacters()
    all.unshift(newCharacter)
    persistCharacters(all)
    characters.value.unshift(newCharacter)

    if (characters.value.length === 1 && role.value === 'Visitor') {
      await auth.updateProfile({ role: 'Operador' })
    }
  } finally {
    creating.value = false
  }
}

onMounted(() => {
  if (auth.user) void loadCharacters()
})

watch(() => auth.user?.id, (newId) => {
  if (newId) {
    void loadCharacters()
  } else {
    characters.value = []
  }
})
</script>
