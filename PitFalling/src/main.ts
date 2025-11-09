import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPersist from 'pinia-plugin-persistedstate'
import App from './App.vue'
import router from './router'
import './assets/main.css'
import { useAuthStore } from '@/stores/auth'

function pruneLegacyAuthKeys() {
  try {
    // Elimina solo claves legacy antiguas
    if (localStorage.getItem('auth')) localStorage.removeItem('auth')
    // No toques 'anodyne_auth': la persistencia actual no usa versionado
    // Si en el futuro agregas versionado, migra con cuidado sin borrar por defecto.
  } catch {
    // Ante errores de acceso a storage, no borres el estado actual por seguridad
    try { localStorage.removeItem('auth') } catch {}
  }
}

async function bootstrap() {
  const app = createApp(App)

  // handlers para ver errores y no “tragar” la pantalla blanca
  app.config.errorHandler = (err, inst, info) => console.error('[Vue error]', err, info, inst)
  window.addEventListener('error', (e) => console.error('[window.onerror]', e.error || e))
  window.addEventListener('unhandledrejection', (e) => console.error('[unhandledrejection]', e.reason))

  const pinia = createPinia()
  pinia.use(piniaPersist)
  app.use(pinia)
  app.use(router)

  // limpia claves legacy antes de hidratar
  pruneLegacyAuthKeys()

  // hidratar sesión antes de guards
  try {
    const auth = useAuthStore()
    // Evita que el arranque quede colgado si getSession tarda o falla
    await Promise.race([
      auth.loadSession(),
      new Promise(resolve => setTimeout(resolve, 1200))
    ])
  } catch (e) {
    console.error('[bootstrap] loadSession failed:', e)
  }

  await router.isReady()
  app.mount('#app')
}

bootstrap().catch(e => console.error('[bootstrap] fatal:', e))
