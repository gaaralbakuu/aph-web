<template>
  <div class="app-container text-center">
    <p style="font-size: 52px;line-height: 100px;">欢迎访问</p>
    <p style="font-size: 26px;font-weight: 300;color: #666666">你现在登录的是</p>
    <p style="font-size: 26px;font-weight: 300;color: #666666">{{company}} {{sysname}}</p>
  </div>
</template>

<script>
import con from '@/config'
export default {
  name: 'welcome',
  data() {
    return {
      sysname: con.system.name,
      company: con.system.company,
    }
  },
}
</script>

<style scoped>
</style>
