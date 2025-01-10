<template>
  <el-dropdown trigger="click" @command="handleSetLang">
    <div>
      <svg-icon class-name="size-icon" icon-class="language" />
    </div>
    <el-dropdown-menu slot="dropdown">
      <el-dropdown-item v-for="(v,i) in langOptions" :key="i" :command="v">{{v.param_condition1}}</el-dropdown-item>
    </el-dropdown-menu>
  </el-dropdown>
</template>

<script>
import { getLangOptions } from '@/mixin/componet'
import { localSet, localGet } from '@/utils/auth'
export default {
  mixins: [getLangOptions],
  data: function () {
    return {
      curLang: localGet('lang'),
    }
  },
  methods: {
    handleSetLang(v) {
      if (v.param_value == this.curLang) return
      this.curLang = v.param_value
      localSet('lang', v.param_value)
      location.reload()
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
