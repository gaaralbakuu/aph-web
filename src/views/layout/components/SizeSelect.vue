<template>
  <el-dropdown trigger="click" @command="handleSetSize">
    <div>
      <svg-icon class-name="size-icon" icon-class="size" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item :disabled="size==='medium'" command="medium">{{ $l.loose }}</el-dropdown-item>
      <el-dropdown-item :disabled="size==='small'" command="small">{{ $l.moderate }}</el-dropdown-item>
      <el-dropdown-item :disabled="size==='mini'" command="mini">{{ $l.compact }}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
export default {
  name: 'SizeSelect',
  computed: {
    size() {
      return this.$store.getters.size
    },
  },
  methods: {
    handleSetSize(size) {
      this.$ELEMENT.size = size
      this.$store.dispatch('setSize', size)
      this.refreshView()
      this.$message({
        message: this.$l.switchSuccess,
        type: 'success',
      })
    },
    refreshView() {
      // In order to make the cached page re-rendered
      this.$store.dispatch('delAllCachedViews', this.$route)
      const { fullPath } = this.$route
      this.$nextTick(() => {
        this.$router.replace({
          path: '/redirect' + fullPath,
        })
      })
    },
    mounted() {
      console.log("asdddddddddddddddddddd", this.$l)
    },
  },
}
</script>

<style scoped>
.size-icon {
  font-size: 20px;
  cursor: pointer;
  fill: currentColor;
}
</style>
