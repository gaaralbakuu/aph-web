<template>
  <div class="flex h-full" :class="{ mobile: device === 'mobile' }">
    <div
      v-if="device === 'mobile' && !isCollapse"
      class="fixed inset-0 z-40 bg-black/50"
      @click="handleClickOutside"
    ></div>
    <aside
      class="app-aside relative z-50 flex h-full flex-col border-r border-white/10 bg-gray-900 text-gray-100 shadow-xl transition-all duration-300"
      :style="[{ backgroundColor: menuBackgroundColor }, menuWidthStyle]"
      :class="{ hideSidebar: isCollapse }"
    >
      <div class="flex h-full flex-col">
        <div class="flex h-14 items-center justify-center border-b border-white/10 px-4">
          <template v-if="!isCollapse">
            <span class="truncate text-lg font-semibold tracking-wide">{{ sysname }}</span>
          </template>
          <template v-else>
            <div class="pt-0.5">
              <img class="w-11" :src="scuLogo" />
            </div>
          </template>
        </div>
        <nav class="flex-1 overflow-y-auto px-3 py-4">
          <ul class="space-y-1">
            <sidebar-item
              v-for="item in user.menus"
              :key="item.id"
              :item="item"
              :collapse="isCollapse"
              :level="0"
              :text-color="textColor"
              :active-color="textActiveColor"
            />
          </ul>
        </nav>
      </div>
    </aside>
    <div class="app-aside-right no-scroll-x flex h-full flex-1 flex-col bg-gray-50 dark:bg-black">
      <header class="flex h-auto flex-col border-b border-gray-100/60 bg-white/70 backdrop-blur dark:border-white/10 dark:bg-black/40 relative z-50">
        <navbar />
        <!-- <tags-view v-if="showTagBar"></tags-view> -->
      </header>
      <main class="flex-1 overflow-y-auto" v-if="showTagBar">
        <keep-alive :include="cachedViews">
          <router-view :key="key" />
        </keep-alive>
      </main>
      <main class="flex-1 overflow-y-auto" v-else>
        <router-view :key="key" />
      </main>
    </div>
  </div>
</template>

<script>
import { Navbar, SidebarItem, TagsView } from './components'
import { mapGetters } from 'vuex'
import ResizeMixin from './mixin/ResizeHandler'
import scuLogo from '@/assets/apache.png'
import con from '@/config'

// 主页布局配置项
const config = {
  menuWidth: '320',
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
      const widthValue = width + 'px'
      return { width: widthValue, minWidth: widthValue }
    },
  },
  created: function () {},
  mounted: function () {},
}
</script>

<style scoped></style>

<style>
.sidebar-fade-enter-active,
.sidebar-fade-leave-active {
  transition: all 0.2s ease;
}

.sidebar-fade-enter,
.sidebar-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.app-aside nav::-webkit-scrollbar {
  width: 6px;
}

.app-aside nav::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 9999px;
}

.mobile .app-aside {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
}
</style>
