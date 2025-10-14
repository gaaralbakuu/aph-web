import mitt from 'mitt'
const emitter = mitt()

export default {
  install(app, options = {}) {
    let isListenerAdded = false
    const store = app.config.globalProperties.$store

    const handleEscKey = function (event) {
      if (event.key === 'Escape') {
        if (store && store.getters) {
          try {
            const dialogCount = store.getters['dialogStack/dialogCount']

            if (dialogCount > 0) {
              event.preventDefault()
              event.stopPropagation()

              const topDialog = store.getters['dialogStack/topDialog']
              if (topDialog) {
                emitter.emit('close-top-dialog', topDialog.id)
              }
            }
          } catch (error) {
            console.warn('Dialog stack ESC handler error:', error)
          }
        }
      }
    }

    app.config.globalProperties.$initDialogEscHandler = function () {
      if (!isListenerAdded) {
        document.addEventListener('keydown', handleEscKey)
        isListenerAdded = true
      }
    }

    app.config.globalProperties.$removeDialogEscHandler = function () {
      if (isListenerAdded) {
        document.removeEventListener('keydown', handleEscKey)
        isListenerAdded = false
      }
    }

    app.config.globalProperties.$dialogEventBus = emitter
  },
}
