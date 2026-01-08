import { defineStore } from 'pinia'
import { ref } from 'vue'
import Cookies from 'js-cookie'

export const useAppStore = defineStore('app', () => {
  // State
  const sidebar = ref({
    opened: !+Cookies.get('sidebarStatus'),
    withoutAnimation: false
  })
  const device = ref('desktop')
  const language = ref(Cookies.get('language') || 'en')
  const size = ref(Cookies.get('size') || 'small')

  // Actions
  const toggleSideBar = () => {
    if (sidebar.value.opened) {
      Cookies.set('sidebarStatus', 1)
    } else {
      Cookies.set('sidebarStatus', 0)
    }
    sidebar.value.opened = !sidebar.value.opened
    sidebar.value.withoutAnimation = false
  }

  const closeSideBar = ({ withoutAnimation }) => {
    Cookies.set('sidebarStatus', 1)
    sidebar.value.opened = false
    sidebar.value.withoutAnimation = withoutAnimation
  }

  const toggleDevice = (newDevice) => {
    device.value = newDevice
  }

  const setLanguage = (newLanguage) => {
    language.value = newLanguage
    Cookies.set('language', newLanguage)
  }

  const setSize = (newSize) => {
    size.value = newSize
    Cookies.set('size', newSize)
  }

  return {
    // State
    sidebar,
    device,
    language,
    size,
    // Actions
    toggleSideBar,
    closeSideBar,
    toggleDevice,
    setLanguage,
    setSize
  }
})
