<template>
  <el-scrollbar ref="scrollContainer" :vertical="false" class="scroll-container" @wheel.prevent="handleScroll">
    <slot />
  </el-scrollbar>
</template>

<script setup>
import { ref } from 'vue'

const padding = 15 // tag's padding

defineOptions({
  name: 'ScrollPane'
})

const left = ref(0)
const scrollContainer = ref(null)

const handleScroll = (e) => {
  const eventDelta = e.wheelDelta || -e.deltaY * 40
  const $scrollWrapper = scrollContainer.value.$refs.wrap
  $scrollWrapper.scrollLeft = $scrollWrapper.scrollLeft + eventDelta / 4
}

const moveToTarget = ($target) => {
  const $container = scrollContainer.value.$el
  const $containerWidth = $container.offsetWidth
  const $scrollWrapper = scrollContainer.value.$refs.wrap
  const $targetLeft = $target.offsetLeft
  const $targetWidth = $target.offsetWidth
  if ($targetLeft > $containerWidth) {
    // tag in the right
    $scrollWrapper.scrollLeft = $targetLeft - $containerWidth + $targetWidth + padding
  } else {
    // tag in the left
    $scrollWrapper.scrollLeft = $targetLeft - padding
  }
}

defineExpose({
  moveToTarget
})
</script>

<style scoped>
.scroll-container {
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  width: 100%;
}
.scroll-container ::v-deep .el-scrollbar__bar {
  bottom: 0px;
}
.scroll-container ::v-deep .el-scrollbar__wrap {
  height: 49px;
}
</style>
