// Plugin để quản lý dialog stack ESC key handling
export default {
  install(app, options = {}) {
    // Tạo instance duy nhất để quản lý ESC key
    let isListenerAdded = false
    
    const handleEscKey = function(event) {
      if (event.key === 'Escape') {
        // Access store via app config or global properties
        const store = app.config.globalProperties.$store

        if (store && store.getters) {
          try {
            const dialogCount = store.getters['dialogStack/dialogCount']
            
            if (dialogCount > 0) {
              event.preventDefault()
              event.stopPropagation()
              
              const topDialog = store.getters['dialogStack/topDialog']
              if (topDialog) {
                // Use a global event bus or mitt, or direct store dispatch
                // Since $emit on root is deprecated in Vue 3, use a custom event or store action
                // For now, assume store action or document event dispatch
                document.dispatchEvent(new CustomEvent('close-top-dialog', { detail: topDialog.id }))
              }
            }
          } catch (error) {
            console.warn('Dialog stack ESC handler error:', error)
          }
        }
      }
    }
    
    // Thêm method vào Vue prototype (app.config.globalProperties) để có thể gọi từ bất kỳ component nào
    app.config.globalProperties.$initDialogEscHandler = function() {
      if (!isListenerAdded) {
        document.addEventListener('keydown', handleEscKey)
        isListenerAdded = true
      }
    }
    
    app.config.globalProperties.$removeDialogEscHandler = function() {
      if (isListenerAdded) {
        document.removeEventListener('keydown', handleEscKey)
        isListenerAdded = false
      }
    }
  }
}
