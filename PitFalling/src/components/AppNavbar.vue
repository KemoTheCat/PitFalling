<template>
  <nav class="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-anodyne/30">
    <div class="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
      <!-- Logo / Brand -->
      <RouterLink to="/" class="flex items-center gap-3" aria-label="Anodyne Visitor Portal">
        <div class="h-10 flex items-center">
          <!-- Reemplaza la ruta por tu archivo -->
          <img
            src="@/assets/Logo.png"
            alt="Anodyne Systems"
            class="h-full w-auto object-contain select-none"
            draggable="false"
          />
        </div>
        <div class="leading-none hidden sm:block">
          <div class="text-sm font-semibold tracking-wide">Anodyne Visitor Portal</div>
          <div class="text-[10px] uppercase tracking-[0.2em] text-anodyne-ink-2">
            National Operations Interface
          </div>
        </div>
      </RouterLink>

      <!-- Desktop -->
      <div class="hidden sm:flex items-center gap-4">
        <RouterLink
          v-if="!isAuthed"
          to="/"
          class="text-sm font-medium hover:underline underline-offset-4"
        >Inicio</RouterLink>

        <RouterLink
          v-if="!isAuthed"
          to="/login"
          class="inline-flex items-center gap-2 rounded-sm border border-anodyne px-3 py-1.5 text-sm font-medium hover:bg-anodyne-flesh-100"
        >Acceder</RouterLink>

        <!-- Perfil (con dropdown) -->
        <div v-else class="relative" ref="dropdownEl">
          <button
            type="button"
            class="flex items-center gap-3 rounded-sm bg-white px-2.5 py-1.5 hover:ring-1 hover:ring-anodyne/30 transition"
            @click="toggle"
            :aria-expanded="open ? 'true' : 'false'"
            aria-haspopup="menu"
          >
            <div class="h-8 w-8 rounded-full overflow-hidden bg-anodyne-flesh-100 grid place-items-center">
              <img v-if="avatarUrl" :src="avatarUrl" alt="" class="h-full w-full object-cover" />
              <span v-else class="text-sm font-semibold">{{ initials }}</span>
            </div>
            <div class="leading-tight text-left">
              <div class="text-sm font-medium truncate max-w-[12rem]">{{ displayName }}</div>
              <div class="text-[11px]">
                <span class="inline-flex items-center rounded-sm px-1.5 py-[2px] border border-anodyne/60 bg-anodyne-flesh-100">
                  {{ role }}
                </span>
              </div>
            </div>
            <svg class="h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clip-rule="evenodd"/>
            </svg>
          </button>

          <!-- Dropdown + animación -->
          <transition
            enter-active-class="transition duration-150 ease-out"
            enter-from-class="opacity-0 -translate-y-1"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition duration-100 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 -translate-y-1"
          >
            <div
              v-if="open"
              class="absolute right-0 mt-2 w-60 rounded-md border border-anodyne/40 bg-white shadow-lg ring-1 ring-black/5 p-1"
              role="menu"
            >
              <div class="px-3 py-2 border-b border-anodyne/20">
                <p class="text-sm font-medium truncate">{{ displayName }}</p>
                <p class="text-xs text-anodyne-ink-2 truncate">{{ auth.user?.email }}</p>
              </div>

              <RouterLink
                to="/profile"
                class="block w-full text-left px-3 py-2 text-sm rounded-sm transition-all duration-150 hover:bg-anodyne-flesh-100 hover:text-anodyne-ink hover:pl-4"
                role="menuitem"
                @click="close"
              >
                Mi perfil
              </RouterLink>

              <RouterLink
                to="/settings"
                class="block w-full text-left px-3 py-2 text-sm rounded-sm transition-all duration-150 hover:bg-anodyne-flesh-100 hover:text-anodyne-ink hover:pl-4"
                role="menuitem"
                @click="close"
              >
                Configuración
              </RouterLink>

              <div class="my-1 border-t border-anodyne/20"></div>

              <button
                class="block w-full text-left px-3 py-2 text-sm rounded-sm transition-all duration-150 hover:bg-red-100 hover:text-red-700 hover:pl-4 disabled:opacity-60"
                role="menuitem"
                :disabled="auth.loggingOut"
                @click="doLogout"
              >
                {{ auth.loggingOut ? 'Saliendo…' : 'Salir' }}
              </button>
            </div>
          </transition>
        </div>
      </div>

      <!-- Mobile trigger -->
      <button
        class="sm:hidden inline-flex items-center rounded-sm border border-anodyne px-2 py-1 text-sm"
        @click="mobileOpen = !mobileOpen"
        aria-label="Abrir menú"
      >
        Menú
      </button>
    </div>

    <!-- Mobile panel -->
    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div v-if="mobileOpen" class="sm:hidden border-t border-anodyne bg-white">
        <div class="px-4 py-3 space-y-2">
          <RouterLink to="/" class="block text-sm" @click="mobileOpen=false">Inicio</RouterLink>

          <template v-if="!isAuthed">
            <RouterLink to="/login" class="block text-sm" @click="mobileOpen=false">Acceder</RouterLink>
          </template>

          <template v-else>
            <RouterLink to="/dashboard" class="block text-sm" @click="mobileOpen=false">Panel</RouterLink>
            <RouterLink to="/profile" class="block text-sm" @click="mobileOpen=false">Mi perfil</RouterLink>
            <RouterLink to="/settings" class="block text-sm" @click="mobileOpen=false">Configuración</RouterLink>
            <button @click="doLogout" class="block text-left text-sm underline underline-offset-4">Salir</button>
          </template>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()

const isAuthed = computed(() => auth.isAuthed)
const role = computed(() => auth.role)
const avatarUrl = computed(() => auth.avatarUrl)
const displayName = computed(() => auth.nickname || auth.user?.email || 'Usuario')
const initials = computed(() =>
  (auth.nickname?.charAt(0) || auth.user?.email?.charAt(0) || 'U').toUpperCase()
)

// Dropdown (desktop)
const open = ref(false)
const dropdownEl = ref<HTMLElement | null>(null)
function toggle(){ open.value = !open.value }
function close(){ open.value = false }
function onDocClick(e: MouseEvent) {
  const el = dropdownEl.value
  if (!el) return
  if (open.value && !el.contains(e.target as Node)) open.value = false
}
onMounted(() => document.addEventListener('mousedown', onDocClick))
onBeforeUnmount(() => document.removeEventListener('mousedown', onDocClick))

// Mobile panel
const mobileOpen = ref(false)

async function doLogout() {
  if (auth.loggingOut) return
  // Disparamos el logout pero no esperamos a red; navegamos de inmediato al failsafe
  void auth.logout()
  open.value = false
  mobileOpen.value = false
  await router.replace('/login?force=1')
}
</script>
