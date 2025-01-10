<template>
    <div class="tip" :style="style[type]">
        <p>{{content}}</p>
    </div>
</template>

<script>
const style = {
  primary: { 'background-color': '#ecf5ff', 'border-color': '#409eff' },
  success: { 'background-color': '#f0f9eb', 'border-color': '#67c23a' },
  info: { 'background-color': '#f4f4f5', 'border-color': '#909399' },
  warning: { 'background-color': '#fdf6ec', 'border-color': '#e6a23c' },
  danger: { 'background-color': '#fef0f0', 'border-color': '#f56c6c' }
}
export default {
  props: {
    content: String,
    type: {
      type: String,
      default: 'primary'
    }
  },
  data: function () {
    return {
      style: style
    }
  }
}
</script>

<style scoped>
    .tip {
        padding: 8px 16px;
        border-radius: 4px;
        border-left: 5px solid;
        margin: 10px 0;
    }

    .tip p {
        font-size: 14px;
        color: #5e6d82;
        line-height: 1.5em;
    }
</style>
