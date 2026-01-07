<template>
  <div @click="click">
    <SvgIcon class="screenfull-svg" icon-class="screenfull"/>
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'Screenfull',
  data () {
    return {
      isFullscreen: false
    }
  },
  methods: {
    click () {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    }
  }
}
</script>

<style scoped>
  .screenfull-svg {
    cursor: pointer;
    fill: currentColor;
    font-size: 20px;
  }
</style>
