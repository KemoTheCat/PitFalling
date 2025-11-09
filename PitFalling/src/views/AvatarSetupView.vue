<template>
  <section class="max-w-xl mx-auto space-y-4">
    <header>
      <h1 class="text-2xl font-anodyne-mono font-semibold">Configurar Avatar</h1>
      <p class="text-sm text-anodyne-ink-2">Sube y recorta tu imagen. Se usará como foto de perfil (y luego podrás optar por usarla en tu personaje).</p>
    </header>

    <AvatarCropper @cropped="saveAvatar" />

    <p v-if="saving" class="text-sm text-anodyne-ink-2">Guardando…</p>
    <p v-if="error" class="text-sm text-[crimson]">{{ error }}</p>
    <p v-if="publicUrl" class="text-sm text-anodyne-ink-2">Listo. <RouterLink to="/dashboard" class="underline">Volver al panel</RouterLink></p>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import AvatarCropper from '@/components/AvatarCropper.vue'
import { useAuthStore } from '@/stores/auth'
import { uploadAvatar } from '@/lib/uploadAvatar'

const auth = useAuthStore()
const saving = ref(false)
const error = ref('')
const publicUrl = ref('')

async function saveAvatar(file: File) {
  error.value = ''
  publicUrl.value = ''

  // Prevent concurrent uploads
  if (saving.value) return

  // Validate file type
  if (!file.type.startsWith('image/')) {
    error.value = 'El archivo debe ser una imagen.'
    return
  }

  // Validate file size (max 5MB)
  const MAX_SIZE = 5 * 1024 * 1024
  if (file.size > MAX_SIZE) {
    error.value = 'La imagen no debe superar 5MB.'
    return
  }

  if (!auth.user) {
    error.value = 'No hay sesión activa.'
    return
  }

  saving.value = true
  try {
    publicUrl.value = await uploadAvatar(auth.user.id, file)
  } catch (e: unknown) {
    error.value = e instanceof Error ? e.message : 'No se pudo subir el avatar.'
  } finally {
    saving.value = false
  }
}
</script>
