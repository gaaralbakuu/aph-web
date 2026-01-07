<template>
  <div class="app-breadcrumb">
    <el-breadcrumb separator="/">
      <transition-group name="breadcrumb">
        <el-breadcrumb-item v-for="(item,index) in levelList" :key="item.id||index">
          <span class="no-redirect">{{ item.name }}</span>
        </el-breadcrumb-item>
      </transition-group>
    </el-breadcrumb>
  </div>

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {
      levelList: null,
    }
  },
  computed: {
    ...mapGetters(['user']),
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    },
  },
  created() {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb() {
      this.levelList = []
      let tmp = this.user.menu.find((i) => i.resource == this.$route.name)
      if (tmp) {
        do {
          this.levelList.unshift(tmp)
          tmp = this.user.menu.find((i) => i.id == tmp.parent_id)
        } while (tmp)
      }
      // 如果要使用路由定义的name进行显示 则用下面这句
      // this.levelList = this.$route.matched
    },
  },
}
</script>

<style rel="stylesheet/scss" scoped>
.app-breadcrumb {
  display: inline-block;
  font-size: 14px;
}
.app-breadcrumb .el-breadcrumb {
  line-height: 50px;
}
.app-breadcrumb .no-redirect {
  color: #97a8be;
  cursor: text;
}
</style>
