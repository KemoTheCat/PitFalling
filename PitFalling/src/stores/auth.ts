import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { supabase } from '@/lib/supabaseClient'

// --- Session policy (configurable via env) ---
const DAY_MS = 86_400_000
const MAX_DAYS = Number((import.meta as any).env?.VITE_SESSION_MAX_DAYS ?? 365)
const IDLE_MAX_DAYS = Number((import.meta as any).env?.VITE_SESSION_IDLE_MAX_DAYS ?? 90)

function nowMs(): number { return Date.now() }
function hasExpired(startAt: number | null, lastAt: number | null): boolean {
  const n = nowMs()
  if (startAt && n - startAt > MAX_DAYS * DAY_MS) return true
  if (lastAt && n - lastAt > IDLE_MAX_DAYS * DAY_MS) return true
  return false
}

// --- Local storage cleanup helpers ---
function getProjectRef(): string {
  try {
    const url = new URL((import.meta as any).env?.VITE_SUPABASE_URL as string)
    return url.hostname.split('.')[0] || ''
  } catch {
    return ''
  }
}

function removeSupabaseAuthKeys(): void {
  const ref = getProjectRef()
  const prefixes = ref ? [
    `sb-${ref}-`,               // supabase-js v2 keys
    'supabase.auth.'            // legacy keys (defensive)
  ] : ['sb-', 'supabase.auth.']

  try {
    // localStorage
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i) || ''
      if (prefixes.some(p => key.startsWith(p))) localStorage.removeItem(key)
    }
  } catch {}
  try {
    // sessionStorage (por si alguna lib alterna lo usó)
    for (let i = sessionStorage.length - 1; i >= 0; i--) {
      const key = sessionStorage.key(i) || ''
      if (prefixes.some(p => key.startsWith(p))) sessionStorage.removeItem(key)
    }
  } catch {}
}

function removePersistedPiniaAuth(): void {
  try { localStorage.removeItem('anodyne_auth') } catch {}
}

type Role = 'Visitor' | 'Contratista' | 'Operador' | 'Supervisor' | 'Administrador'
type PublicUser = { id: string; email: string }

export const useAuthStore = defineStore('auth', () => {
  // ---------- STATE ----------
  const user = ref<PublicUser | null>(null)
  const role = ref<Role>('Visitor')          // Rol genérico hasta que cree personaje
  const avatarUrl = ref<string>('')          // URL pública del avatar (Storage)
  const nickname = ref<string>('')           // Apodo mostrado en UI
  const ready = ref<boolean>(false)          // bandera de hidratación de sesión
  const sessionStartedAt = ref<number | null>(null) // inicio de sesión (ms epoch)
  const lastActiveAt = ref<number | null>(null)     // última actividad para idle TTL
  const loggingOut = ref<boolean>(false)     // evita carreras durante logout
  const justLoggedOutAt = ref<number | null>(null)  // ventana corta para ignorar eventos post-logout

  // ---------- GETTERS ----------
  const isAuthed = computed(() => !!user.value)
  const isProfileComplete = computed(() => !!(nickname.value && avatarUrl.value))
  const isReady = computed(() => ready.value)
  const isExpired = computed(() => hasExpired(sessionStartedAt.value, lastActiveAt.value))

  // ---------- HELPERS ----------
  async function ensureProfileExists(): Promise<void> {
    if (!user.value) return
    const { data, status, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.value.id)
      .maybeSingle()

    if (error && status !== 406) throw error
    // Si no hay fila aún (data === null o 406), creamos con defaults seguros.
    if (!data) {
      const { error: upsertErr } = await supabase
        .from('profiles')
        .upsert({ id: user.value.id, role: 'Contratista' })
      if (upsertErr) throw upsertErr
    }
  }

  function resetLocal(): void {
    user.value = null
    role.value = 'Visitor'
    avatarUrl.value = ''
    nickname.value = ''
    sessionStartedAt.value = null
    lastActiveAt.value = null
  }

  // ---------- ACTIONS ----------
  async function loadSession(): Promise<void> {
    ready.value = false
    try {
      // Si ya tenemos datos persistidos y están expirados, limpiamos localmente
      if (hasExpired(sessionStartedAt.value, lastActiveAt.value)) {
        try { await supabase.auth.signOut({ scope: 'local' }) } catch {}
        resetLocal()
      }

      const { data } = await supabase.auth.getSession()
      const u = data.session?.user
      if (u) {
        // Inicializamos timestamps si no existen
        const now = nowMs()
        if (!sessionStartedAt.value) sessionStartedAt.value = now
        if (!lastActiveAt.value) lastActiveAt.value = now
        // Sanidad mínima por si el storage tenía datos corruptos
        user.value = { id: String(u.id), email: u.email ?? '' }
        await ensureProfileExists()
        await fetchProfile()
      } else {
        resetLocal()
      }
    } finally {
      ready.value = true
    }
  }

  async function fetchProfile(): Promise<void> {
    if (!user.value) return
    const { data, error } = await supabase
      .from('profiles')
      .select('role, avatar_url, nickname')
      .eq('id', user.value.id)
      .single()

    if (error) {
      // Si aún no existe o hay RLS, mantenemos defaults seguros
      role.value = 'Contratista'
      avatarUrl.value = ''
      nickname.value = ''
      return
    }

    role.value = (data.role as Role) ?? 'Contratista'
    avatarUrl.value = data.avatar_url ?? ''
    nickname.value = data.nickname ?? ''
  }

  async function setAvatar(url: string): Promise<void> {
    if (!user.value) return
    avatarUrl.value = url
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.value.id, avatar_url: url })
    if (error) throw error
  }

  async function updateProfile(partial: { nickname?: string; role?: Role; avatar_url?: string }): Promise<void> {
    if (!user.value) return
    const patch: Record<string, unknown> = { id: user.value.id, ...partial }
    const { error } = await supabase.from('profiles').upsert(patch)
    if (error) throw error
    if (partial.nickname !== undefined) nickname.value = partial.nickname
    if (partial.avatar_url !== undefined) avatarUrl.value = partial.avatar_url
    if (partial.role !== undefined) role.value = partial.role
  }

  function bumpActivity(): void {
    lastActiveAt.value = nowMs()
  }

  async function login(email: string, password: string): Promise<void> {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    const now = nowMs()
    sessionStartedAt.value = now
    lastActiveAt.value = now
    await loadSession()
  }

  async function register(email: string, password: string): Promise<void> {
    // Si la confirmación de email está activa, no habrá sesión aquí
    const emailRedirectTo = window.location.origin
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo }
    })
    if (error) throw error

    // Confirmación ON → no hay sesión; la UI debe avisar "revisa tu correo"
    if (!data.session) return

    // Confirmación OFF → ya hay sesión
    user.value = { id: data.user!.id, email: data.user!.email ?? '' }
    await ensureProfileExists()
    await fetchProfile()
  }

  async function hardLocalLogout(): Promise<void> {
    // Nota: este método NO debe dejar el flag `loggingOut` en true, porque
    // puede ser invocado desde el guard (/login?force=1) o AuthView, fuera de
    // `logout()`. Nos apoyamos en `justLoggedOutAt` para ignorar eventos.
    try {
      // Marcar instante de logout para ignorar eventos de auth por una ventana corta
      justLoggedOutAt.value = Date.now()

      // Resetear store en memoria de inmediato para que la UI reaccione
      resetLocal()
      ready.value = true

      // Limpieza defensiva de cualquier rastro local
      try { removePersistedPiniaAuth() } catch {}
      try { removeSupabaseAuthKeys() } catch {}

      // Cerrar canales Realtime abiertos
      try {
        const channels = (supabase as any).getChannels ? (supabase as any).getChannels() : []
        for (const ch of channels) {
          try { void ch.unsubscribe() } catch {}
        }
        if ((supabase as any).removeAllChannels) {
          try { (supabase as any).removeAllChannels() } catch {}
        }
      } catch {}
    } finally {
      // Garantiza que el flag quede liberado por si veníamos de un estado previo
      loggingOut.value = false
    }
  }

  async function logout(): Promise<void> {
    // Cierre local inmediato (no esperar a Supabase)
    await hardLocalLogout()
    try {
      // Intento de signout local del SDK, con timeout de cortesía en background
      const localSignout = supabase.auth.signOut({ scope: 'local' })
      await Promise.race([
        localSignout,
        new Promise(resolve => setTimeout(resolve, 800))
      ])

      // Revocación global en segundo plano (best-effort, no esperamos)
      try { void supabase.auth.signOut({ scope: 'global' }) } catch {}
    } catch (e) {
      console.warn('[auth.logout] signOut raced/failed (ignored)', e)
    } finally {
      loggingOut.value = false
    }
  }

  // Mantener sincronizado el store con cambios de sesión (multi-tab / refresh token)
  supabase.auth.onAuthStateChange(async (event, session) => {
    // Ignorar eventos durante logout o justo después (ventana de gracia)
    const ignoreWindow = justLoggedOutAt.value && (Date.now() - (justLoggedOutAt.value as number) < 1500)
    if (loggingOut.value || ignoreWindow) {
      return
    }

    // Si nuestra política ya expiró, cerramos localmente sin bloquear
    if (hasExpired(sessionStartedAt.value, lastActiveAt.value)) {
      try { await supabase.auth.signOut({ scope: 'local' }) } catch {}
      resetLocal()
      return
    }

    if (session?.user) {
      user.value = { id: session.user.id, email: session.user.email ?? '' }
      try { await ensureProfileExists() } catch {}
      try { await fetchProfile() } catch {}
      const now = nowMs()
      if (event === 'SIGNED_IN' || !sessionStartedAt.value) sessionStartedAt.value = now
      // Consideramos actividad en INITIAL_SESSION / TOKEN_REFRESHED / USER_UPDATED
      if (event === 'INITIAL_SESSION' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED' || event === 'SIGNED_IN') {
        lastActiveAt.value = now
      }
    } else {
      resetLocal()
    }
  })

  return {
    // state + getters
    user, role, avatarUrl, nickname, isAuthed, isProfileComplete, isReady, isExpired,
    sessionStartedAt, lastActiveAt, loggingOut, justLoggedOutAt,
    // actions
    loadSession, fetchProfile, setAvatar, updateProfile, login, register, logout, bumpActivity, hardLocalLogout
  }
}, {
  /**
   * Persistencia básica (compatible con distintas variantes del plugin).
   * - Usamos UNA sola clave para todo el proyecto.
   * - Sin opciones avanzadas que chocan con typings (paths/serializer/afterRestore).
   */
  persist: {
    key: 'anodyne_auth',
    storage: localStorage,
    paths: ['user', 'role', 'avatarUrl', 'nickname', 'sessionStartedAt', 'lastActiveAt']
  }
})
