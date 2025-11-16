import { ref, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

/**
 * Composable para manejar la visibilidad de la página
 * Bumpa la actividad cuando el usuario regresa a la tab
 */
export function usePageVisibility() {
  const isVisible = ref(!document.hidden)
  const auth = useAuthStore()

  function handleVisibilityChange() {
    isVisible.value = !document.hidden
    
    // Cuando el usuario regresa a la tab, bumpar actividad
    if (isVisible.value && auth.isAuthed) {
      console.log('[visibility] Page visible, bumping activity')
      auth.bumpActivity()
    }
  }

  onMounted(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
  })

  onUnmounted(() => {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  })

  return {
    isVisible
  }
}