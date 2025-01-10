<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script>
import con from '@/config'
export default {
  name: 'app',
  created: () => {
    document.title = con.system.name + ' - ' + con.system.company
  },
}
</script>
