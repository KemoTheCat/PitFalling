import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createWebHistory } from 'vue-router'
import { createPinia } from 'pinia'
import App from '../App.vue'

// Mock de componentes hijos para aislarlos
const AppNavbar = { template: '<nav>Navbar</nav>' }
const AppFooter = { template: '<footer>Footer</footer>' }
const RouterView = { template: '<div><slot /></div>' }

const routes = [{ path: '/', component: { template: '<div>Home</div>' } }]
const router = createRouter({
  history: createWebHistory(),
  routes
})

describe('App', () => {
  it('renders navbar, router-view, and footer', async () => {
    const pinia = createPinia()
    const wrapper = mount(App, {
      global: {
        plugins: [router, pinia],
        stubs: {
          // Usar stubs para no renderizar los componentes reales
          AppNavbar,
          AppFooter,
          RouterView
        }
      }
    })

    // Esperar a que el router esté listo
    await router.isReady()

    // Comprobar que los componentes principales están presentes
    expect(wrapper.findComponent(AppNavbar).exists()).toBe(true)
    expect(wrapper.findComponent(RouterView).exists()).toBe(true)
    expect(wrapper.findComponent(AppFooter).exists()).toBe(true)
  })
})
