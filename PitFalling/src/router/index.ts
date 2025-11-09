import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  { path: '/', name: 'home', component: () => import('@/views/HomeView.vue') },
  { path: '/login', name: 'login', component: () => import('@/views/AuthView.vue') },
  {
    path: '/account/setup',
    name: 'accountSetup',
    component: () => import('@/views/AccountSetupView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/DashboardView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/character-creator',
    name: 'characterCreator',
    component: () => import('@/views/CharacterCreatorView.vue'),
    meta: { requiresAuth: true }
  },
  // ...
  {
    path: '/terms',
    name: 'terms',
    component: () => import('@/views/TermsView.vue')
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('@/views/PrivacyView.vue')
  },
  {
    path: '/msds',
    name: 'msds',
    component: () => import('@/views/MsdsView.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('@/views/ProfileView.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'),
    meta: { requiresAuth: true }
  },

  // opcional: captura 404 → home
  { path: '/:pathMatch(.*)*', redirect: { name: 'home' } }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

/**
 * Guard sencillo basado en el estado del store (sin llamadas de red por navegación).
 * - Evita loops (login con sesión → dashboard; ruta protegida sin sesión → login)
 * - Respeta `next` para volver a donde ibas
 */
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Forzar logout si se solicita explícitamente en /login?force=1 (antes de hidratar)
  if ((to.name === 'login' || to.path === '/login') && to.query?.force === '1') {
    try { await auth.hardLocalLogout() } catch {}
    return true
  }

  // Evitar rehidratación inmediatamente después de un logout reciente
  const justLoggedOutRecently = auth.justLoggedOutAt && (Date.now() - (auth.justLoggedOutAt as number) < 1500)

  // Asegura que la sesión esté hidratada una vez con un pequeño timeout de cortesía
  if (!auth.isReady && !justLoggedOutRecently) {
    try {
      await Promise.race([
        auth.loadSession(),
        new Promise(resolve => setTimeout(resolve, 1500))
      ])
    } catch (e) {
      console.error('[guard] loadSession failed', e)
    }
  }

  // Si hay sesión pero vencida según política local, cerrar y redirigir a login
  if (auth.isAuthed && auth.isExpired) {
    try { await auth.logout() } catch {}
    return { name: 'login', query: { reason: 'expired', next: to.fullPath !== '/login' ? to.fullPath : undefined } }
  }

  const authed = auth.isAuthed
  const requiresAuth = to.matched.some(r => r.meta?.requiresAuth)
  // console.debug('[guard]', { to: to.fullPath, authed, requiresAuth })

  if (requiresAuth && !authed) return { name: 'login', query: { next: to.fullPath } }
  if ((to.name === 'login' || to.path === '/login') && authed) return { name: 'dashboard' }
  return true
})

// Registrar actividad tras cada navegación exitosa
router.afterEach(() => {
  const auth = useAuthStore()
  if (auth.isAuthed) auth.bumpActivity()
})

export default router
