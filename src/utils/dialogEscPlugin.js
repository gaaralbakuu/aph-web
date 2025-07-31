// Plugin để quản lý dialog stack ESC key handling
export default {
  install(Vue, options = {}) {
    // Tạo instance duy nhất để quản lý ESC key
    let isListenerAdded = false
    
    const handleEscKey = function(event) {
      if (event.key === 'Escape') {
        // Tìm Vue instance có store
        const app = document.querySelector('#app').__vue__
        if (app && app.$store && app.$store.getters) {
          try {
            const dialogCount = app.$store.getters['dialogStack/dialogCount']
            
            if (dialogCount > 0) {
              event.preventDefault()
              event.stopPropagation()
              
              const topDialog = app.$store.getters['dialogStack/topDialog']
              if (topDialog) {
                app.$root.$emit('close-top-dialog', topDialog.id)
              }
            }
          } catch (error) {
            console.warn('Dialog stack ESC handler error:', error)
          }
        }
      }
    }
    
    // Thêm method vào Vue prototype để có thể gọi từ bất kỳ component nào
    Vue.prototype.$initDialogEscHandler = function() {
      if (!isListenerAdded) {
        document.addEventListener('keydown', handleEscKey)
        isListenerAdded = true
      }
    }
    
    Vue.prototype.$removeDialogEscHandler = function() {
      if (isListenerAdded) {
        document.removeEventListener('keydown', handleEscKey)
        isListenerAdded = false
      }
    }
  }
}
