<template>
  <el-container style="height: 100%" :class="{ mobile: device === 'mobile' }">
    <div v-if="device === 'mobile' && !isCollapse" class="drawer-bg" @click="handleClickOutside"></div>
    <el-aside class="app-aside" :style="menuWidthStyle" :class="{ hideSidebar: isCollapse }">
      <el-container style="height: 100%" :style="{ 'background-color': menuBackgroundColor }">
        <el-header class="no-padding" style="height: auto">
          <div class="app-logo">
            <template v-if="!isCollapse">
              <span style="font-size: 18px">{{ sysname }}</span>
            </template>
            <template v-else>
              <div style="padding-top: 2px"><img style="width: 44px" :src="scuLogo" /></div>
            </template>
          </div>
        </el-header>
        <el-main class="no-padding no-scroll-x">
          <el-menu style="border: 0" :style="menuWidthStyle" :default-active="$route.name" :collapse="isCollapse" :collapse-transition="false" mode="vertical" unique-opened :background-color="menuBackgroundColor" :text-color="textColor" :active-text-color="textActiveColor">
            <sidebar-item v-for="item in user.menus" :key="item.id" :style="{ ...menuWidthStyle, backgroundColor: 'red' }" :item="item"></sidebar-item>
          </el-menu>
        </el-main>
      </el-container>
    </el-aside>
    <el-container style="height: 100%" class="app-aside-right no-scroll-x">
      <el-header class="no-padding" style="height: auto">
        <navbar></navbar>
        <!-- <tags-view v-if="showTagBar"></tags-view> -->
      </el-header>
      <el-main class="no-padding" v-if="showTagBar">
        <keep-alive :include="cachedViews">
          <router-view :key="key" />
        </keep-alive>
      </el-main>
      <el-main class="no-padding" v-else>
        <router-view :key="key" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { Navbar, SidebarItem, TagsView } from './components'
import { mapGetters } from 'vuex'
import ResizeMixin from './mixin/ResizeHandler'
import scuLogo from '@/assets/apache.png'
import con from '@/config'

// 主页布局配置项
const config = {
  menuWidth: '200',
  menuCollapseWidth: '50',
  menuBackgroundColor: '#2C3B41',
  textColor: '#B8C7CE',
  textActiveColor: '#FFFFFF',
  showTagBar: true, // 是否显示TagBar
}

export default {
  name: 'Lay',
  components: {
    Navbar,
    TagsView,
    SidebarItem,
  },
  mixins: [ResizeMixin],
  data: function () {
    return {
      ...config,
      scuLogo: scuLogo,
      description: '',
      sysname: con.system.name,
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('closeSideBar', { withoutAnimation: false })
    },
  },
  computed: {
    ...mapGetters(['permission_routers', 'sidebar', 'user']),
    isCollapse() {
      return !this.sidebar.opened
    },
    device() {
      return this.$store.state.app.device
    },
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    },
    menuWidthStyle() {
      const width = this.isCollapse ? (this.device === 'mobile' ? 0 : config.menuCollapseWidth) : config.menuWidth
      return { width: width + 'px' }
    },
  },
  created: function () {},
  mounted: function () {},
}
</script>

<style scoped>
.app-logo {
  height: 50px;
  line-height: 50px;
  font-size: 24px;
  color: #ffffff;
  text-align: center;
  background-color: rgba(0, 0, 0, 0.2);
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}
</style>

<style>
.el-submenu__title {
  display: flex;
  align-items: center;
}
</style>
