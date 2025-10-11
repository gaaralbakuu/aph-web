import { onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'

/**
 * Manages the global 'Escape' key listener to close the top-most dialog.
 * This composable should be used once in a root component like `App.vue`.
 */
export function useDialogEscManager() {
  const store = useStore()

  const handleGlobalEscKey = (event) => {
    if (event.key === 'Escape') {
      const topDialog = store.getters['dialogStack/topDialog']

      if (topDialog) {
        // Prevent default browser behavior (e.g., exiting fullscreen)
        event.preventDefault()
        event.stopPropagation()

        // Dispatch an action to remove the top dialog from the stack.
        // Dialog components will be responsible for watching this state change
        // and closing themselves.
        store.dispatch('dialogStack/removeDialog', topDialog.id)
      }
    }
  }

  onMounted(() => {
    document.addEventListener('keydown', handleGlobalEscKey)
  })

  onUnmounted(() => {
    document.removeEventListener('keydown', handleGlobalEscKey)
  })
}