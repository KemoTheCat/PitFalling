<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { RouterLink } from 'vue-router'
import AvatarCropper from '@/components/AvatarCropper.vue'
import { uploadAvatar } from '@/lib/uploadAvatar'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const nick = ref<string>('')
const savingNick = ref(false)
const nickError = ref('')
const nickOk = ref(false)

const avatarSaving = ref(false)
const avatarError = ref('')
const avatarOk = ref(false)

onMounted(() => { nick.value = auth.nickname || '' })
const isComplete = computed(() => auth.isProfileComplete)

function toMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  try { return JSON.stringify(err) } catch { return 'Unknown error' }
}

async function saveNickname() {
  nickError.value = ''; nickOk.value = false
  if (!nick.value || nick.value.trim().length < 2) {
    nickError.value = 'El nickname debe tener al menos 2 caracteres.'
    return
  }
  savingNick.value = true
  try {
    await auth.updateProfile({ nickname: nick.value.trim() })
    nickOk.value = true
  } catch (err: unknown) {
    nickError.value = toMessage(err)
  } finally {
    savingNick.value = false
  }
}

async function saveAvatar(file: File) {
  avatarError.value = ''; avatarOk.value = false
  if (!auth.user) { avatarError.value = 'No hay sesión activa.'; return }
  avatarSaving.value = true
  try {
    const url = await uploadAvatar(auth.user.id, file)
    await auth.setAvatar(url)
    avatarOk.value = true
  } catch (err: unknown) {
    avatarError.value = toMessage(err)
  } finally {
    avatarSaving.value = false
  }
}
</script>

<template>
  <section class="max-w-2xl mx-auto space-y-6 p-4">
    <!-- ... panel de nickname ... -->
    <div class="grid md:grid-cols-2 gap-6">
      <!-- AVATAR -->
      <div class="border border-anodyne bg-white p-5">
        <h2 class="font-anodyne-mono text-base uppercase tracking-widest mb-3">Foto de perfil</h2>
        <AvatarCropper @cropped="saveAvatar" />
        <div class="mt-3 text-sm">
          <p v-if="avatarSaving" class="text-anodyne-ink-2">Guardando…</p>
          <p v-if="avatarError" class="text-[crimson]">{{ avatarError }}</p>
          <p v-if="avatarOk" class="text-green-700">Avatar actualizado.</p>
        </div>
      </div>
    </div>

    <div class="border border-anodyne bg-white p-5 flex items-center justify-between">
      <div class="text-sm text-anodyne-ink-2">
        Estado del perfil:
        <span :class="isComplete ? 'text-green-700' : 'text-[crimson]'">
          {{ isComplete ? 'Completo' : 'Incompleto' }}
        </span>
      </div>
      <RouterLink
        :to="isComplete ? '/dashboard' : '#'"
        class="inline-flex items-center rounded-sm bg-anodyne-brand hover:bg-anodyne-brand-2 text-white px-4 py-2 text-sm font-semibold tracking-wide"
        :class="!isComplete && 'opacity-60 pointer-events-none'"
      >
        Continuar al Panel
      </RouterLink>
    </div>
  </section>
  </template>

