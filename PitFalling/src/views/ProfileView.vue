<template>
  <section class="mx-auto max-w-3xl p-4 sm:p-6 lg:p-8 space-y-6">
    <header>
      <p class="font-anodyne-mono text-xs tracking-widest uppercase text-anodyne-ink-2">Anodyne Systems — Profile Center</p>
      <h1 class="text-2xl font-semibold">Mi perfil</h1>
      <p class="text-sm text-anodyne-ink-2">Gestiona tu alias y avatar. La opción de contraseña solo aparece si tienes sesión activa.</p>
    </header>

    <div class="grid gap-6 sm:grid-cols-2">
      <div class="border border-anodyne bg-white p-4 space-y-3">
        <h2 class="font-semibold">Identidad</h2>
        <label class="block text-sm">
          Alias
          <input v-model="nickname" class="mt-1 w-full border border-anodyne px-3 py-2 outline-none focus:ring-2 focus:ring-[rgb(var(--brand))]" />
        </label>
        <button @click="saveNickname" class="inline-flex items-center rounded-sm bg-anodyne-brand hover:bg-anodyne-brand-2 text-white px-3 py-1.5 text-sm font-semibold">Guardar</button>
      </div>

      <div class="border border-anodyne bg-white p-4 space-y-3">
        <h2 class="font-semibold">Avatar</h2>
        <div class="flex items-center gap-4">
          <div class="h-14 w-14 rounded-full overflow-hidden border border-anodyne bg-anodyne-flesh-100">
            <img v-if="avatarUrl" :src="avatarUrl" class="h-full w-full object-cover" />
          </div>
          <RouterLink to="/account/setup" class="text-sm underline underline-offset-4">Cambiar avatar</RouterLink>
        </div>
      </div>
    </div>

    <div v-if="isAuthed" class="border border-anodyne bg-white p-4 space-y-3">
      <h2 class="font-semibold">Seguridad</h2>
      <p class="text-sm text-anodyne-ink-2">La actualización de contraseña está disponible únicamente con sesión iniciada.</p>
      <RouterLink to="/settings" class="text-sm underline underline-offset-4">Actualizar contraseña</RouterLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const isAuthed = computed(() => auth.isAuthed)
const avatarUrl = computed(() => auth.avatarUrl)
const nickname = ref(auth.nickname)

async function saveNickname() {
  await auth.updateProfile({ nickname: nickname.value })
}
</script>
