<template>
  <div class="icons-container">
    <div v-for="item of iconsMap" :key="item.index" @click="handleClipboard(generateIconCode(item),$event)">
      <el-tooltip placement="top">
        <div slot="content">
          {{ generateIconCode(item) }}
        </div>
        <div class="icon-item">
          <svg-icon :icon-class="item" class-name="disabled" />
          <span>{{ item }}</span>
        </div>
      </el-tooltip>
    </div>
  </div>
</template>

<script>
import icons from './requireIcons'
import clipboard from '@/utils/clipboard'

export default {
  name: 'exampleIcon',
  data() {
    return {
      iconsMap: icons,
    }
  },
  methods: {
    generateIconCode(symbol) {
      return `<svg-icon icon-class="${symbol}" />`
    },
    handleClipboard(text, event) {
      clipboard(text, event)
    },
  },
}
</script>

<style rel="stylesheet/scss" scoped>
.icons-container {
  overflow: hidden;
}
.icons-container .icon-item {
  padding-top: 10px;
  margin: 15px;
  height: 64px;
  text-align: center;
  width: 64px;
  float: left;
  font-size: 22px;
  color: #24292e;
  cursor: pointer;
}
.icons-container span {
  display: block;
  font-size: 13px;
  margin-top: 8px;
}
.icons-container .disabled {
  pointer-events: none;
}
</style>
