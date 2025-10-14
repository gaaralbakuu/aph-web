<template>
  <div class="app-breadcrumb">
    <el-breadcrumb separator="/">
      <transition-group name="breadcrumb">
        <template v-for="(item, index) in levelList" :key="item.id || index">
          <el-breadcrumb-item>
            <span class="no-redirect">{{ item.name }}</span>
          </el-breadcrumb-item>
          <!-- <el-breadcrumb-item v-if="item.meta.title" :key="item.path">
          <span class="no-redirect">{{ item.meta.title }}</span>
          <span v-if="item.redirect==='noredirect'||index==levelList.length-1"
            class="no-redirect">{{ item.meta.title }}</span>
          <router-link v-else :to="item.redirect||item.path">{{ item.meta.title }}</router-link>
        </el-breadcrumb-item> -->
        </template>
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

<style rel="stylesheet/scss" lang="scss" scoped>
.app-breadcrumb {
  display: inline-block;
  font-size: 14px;
  .el-breadcrumb {
    line-height: 50px;
  }
  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
