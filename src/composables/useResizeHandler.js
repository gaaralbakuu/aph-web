import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

const WIDTH = 1024
const RATIO = 3

export function useResizeHandler() {
  const store = useStore()
  const route = useRoute()
  const { body } = document

  const isMobile = () => {
    const rect = body.getBoundingClientRect()
    return rect.width - RATIO < WIDTH
  }

  const resizeHandler = () => {
    if (!document.hidden) {
      const mobile = isMobile()
      store.dispatch('toggleDevice', mobile ? 'mobile' : 'desktop')

      if (mobile) {
        store.dispatch('closeSideBar', { withoutAnimation: true })
      }
    }
  }

  watch(() => route.path, () => {
    if (store.state.app.device === 'mobile' && store.state.app.sidebar.opened) {
      store.dispatch('closeSideBar', { withoutAnimation: false })
    }
  })

  onMounted(() => {
    const mobile = isMobile()
    if (mobile) {
      store.dispatch('toggleDevice', 'mobile')
      store.dispatch('closeSideBar', { withoutAnimation: true })
    }
    window.addEventListener('resize', resizeHandler)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
  })
}
