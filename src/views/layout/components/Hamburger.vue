<template>
  <div @click="toggleClick" class="hamburger">
    <i class="icon fa " :class="{'fa-list-ul':isActive,'fa-ellipsis-v':!isActive}" aria-hidden="true"></i>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false,
    },
    toggleClick: {
      type: Function,
      default: null,
    },
  },
}
</script>

<style lang="scss" scoped>
.hamburger {
  color: #606266;
  cursor: pointer;
  font-size: 20px;
  transition: 0.38s;
  fill: currentColor;
}
</style>
