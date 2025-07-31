export default {
  created() {
    // Chỉ áp dụng cho root component (App.vue) hoặc layout components
    if (this.$options.name === 'App' || this.$options._isLayoutComponent) {
      this._isDialogEscHandler = true
    }
  },
  mounted() {
    // Chỉ thêm event listener cho component được chỉ định
    if (this._isDialogEscHandler) {
      document.addEventListener('keydown', this.handleGlobalEscKey)
    }
  },
  beforeDestroy() {
    // Chỉ xóa event listener cho component được chỉ định
    if (this._isDialogEscHandler) {
      document.removeEventListener('keydown', this.handleGlobalEscKey)
    }
  },
  methods: {
    handleGlobalEscKey(event) {
      // Kiểm tra xem có phải phím ESC và store có tồn tại không
      if (event.key === 'Escape' && this.$store && this.$store.getters) {
        try {
          const dialogCount = this.$store.getters['dialogStack/dialogCount']
          
          // Chỉ xử lý khi có dialog đang mở
          if (dialogCount > 0) {
            event.preventDefault()
            event.stopPropagation()
            
            // Lấy dialog ở top của stack
            const topDialog = this.$store.getters['dialogStack/topDialog']
            if (topDialog) {
              // Emit sự kiện để đóng dialog
              this.$root.$emit('close-top-dialog', topDialog.id)
            }
          }
        } catch (error) {
          console.warn('Dialog stack mixin error:', error)
        }
      }
    }
  }
}
