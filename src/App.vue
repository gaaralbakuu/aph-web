<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import con from '@/config'
export default {
  name: 'App',
  created() {
    document.title = con.system.name + ' - ' + con.system.company
  },
  mounted() {
    // Khởi tạo dialog ESC handler
    this.$initDialogEscHandler()
  },
  beforeDestroy() {
    // Cleanup ESC handler
    this.$removeDialogEscHandler()
  },
}
</script>
