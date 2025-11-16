import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

type Role = 'Visitor' | 'Contratista' | 'Operador' | 'Supervisor' | 'Administrador'
type PublicUser = { id: string; email: string }

/**
 * Dummy authentication store used while the real flow is rebuilt.
 * It keeps the same public API so the rest of the app keeps compiling,
 * but none of the actions talk to Supabase or any backend.
 */
export const useAuthStore = defineStore('auth', () => {
  const user = ref<PublicUser | null>(null)
  const role = ref<Role>('Visitor')
  const avatarUrl = ref<string>('')
  const nickname = ref<string>('')
  const ready = ref<boolean>(true)
  const sessionStartedAt = ref<number | null>(null)
  const lastActiveAt = ref<number | null>(null)

  const isAuthed = computed(() => !!user.value)
  const isProfileComplete = computed(() => !!(nickname.value && avatarUrl.value))
  const isReady = computed(() => ready.value)
  const isExpired = computed(() => false)

  function resetLocal(): void {
    user.value = null
    role.value = 'Visitor'
    avatarUrl.value = ''
    nickname.value = ''
    sessionStartedAt.value = null
    lastActiveAt.value = null
  }

  async function loadSession(): Promise<void> {
    ready.value = true
  }

  async function fetchProfile(): Promise<void> {
    // no-op placeholder
  }

  async function setAvatar(url: string): Promise<void> {
    avatarUrl.value = url
  }

  async function updateProfile(partial: { nickname?: string; role?: Role; avatar_url?: string }): Promise<void> {
    if (partial.nickname !== undefined) nickname.value = partial.nickname
    if (partial.role !== undefined) role.value = partial.role
    if (partial.avatar_url !== undefined) avatarUrl.value = partial.avatar_url
  }

  function bumpActivity(): void {
    lastActiveAt.value = Date.now()
  }

  async function login(email: string, _password: string): Promise<void> {
    const now = Date.now()
    user.value = { id: `local-${now}`, email }
    sessionStartedAt.value = now
    lastActiveAt.value = now
    ready.value = true
  }

  async function register(email: string, _password: string): Promise<void> {
    await login(email, _password)
  }

  async function hardLocalLogout(): Promise<void> {
    resetLocal()
    ready.value = true
  }

  async function logout(): Promise<void> {
    await hardLocalLogout()
  }

  return {
    // state + getters
    user, role, avatarUrl, nickname, sessionStartedAt, lastActiveAt,
    isAuthed, isProfileComplete, isReady, isExpired,
    // actions
    loadSession, fetchProfile, setAvatar, updateProfile,
    login, register, logout, hardLocalLogout, bumpActivity
  }
})
