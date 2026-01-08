import { onMounted, onBeforeUnmount, watch } from 'vue'
import { useAppStore } from '@/stores/app'
import { useRoute } from 'vue-router'

const WIDTH = 1024
const RATIO = 3

export function useResizeHandler() {
  const appStore = useAppStore()
  const route = useRoute()
  const { body } = document

  const isMobile = () => {
    const rect = body.getBoundingClientRect()
    return rect.width - RATIO < WIDTH
  }

  const resizeHandler = () => {
    if (!document.hidden) {
      const mobile = isMobile()
      appStore.toggleDevice(mobile ? 'mobile' : 'desktop')

      if (mobile) {
        appStore.closeSideBar({ withoutAnimation: true })
      }
    }
  }

  watch(() => route.path, () => {
    if (appStore.device === 'mobile' && appStore.sidebar.opened) {
      appStore.closeSideBar({ withoutAnimation: false })
    }
  })

  onMounted(() => {
    const mobile = isMobile()
    if (mobile) {
      appStore.toggleDevice('mobile')
      appStore.closeSideBar({ withoutAnimation: true })
    }
    window.addEventListener('resize', resizeHandler)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
  })
}
