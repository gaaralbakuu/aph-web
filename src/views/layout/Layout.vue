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
        <div :class="['flex h-14 items-center justify-center border-b border-white/10', {'px-4': !isCollapse, 'px-1': isCollapse}]" >
          <template v-if=" !isCollapse ">
            <span class="truncate text-lg font-semibold tracking-wide">{{ sysname }}</span>
          </template>
          <template v-else>
            <div class="pt-0.5">
              <img class="w-11" :src="scuLogo" />
            </div>
          </template>
        </div>
        <nav :class="['flex-1 overflow-y-auto py-1', {'px-1': isCollapse, 'px-3': !isCollapse}]" >
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
      <header class="flex h-auto flex-col border-b border-gray-100/60 bg-white/70 dark:border-white/10 dark:bg-black/40">
        <navbar />
        <!-- <tags-view v-if="showTagBar"></tags-view> -->
      </header>
      <main class="flex-1 overflow-y-auto" v-if="showTagBar">
        <router-view v-slot="{ Component, route }">
          <keep-alive :include="cachedViews">
            <component :is="Component" :key="route.fullPath" />
          </keep-alive>
        </router-view>
      </main>
      <main class="flex-1 overflow-y-auto" v-else>
        <router-view v-slot="{ Component, route }">
          <component :is="Component" :key="route.fullPath" />
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'

import scuLogoImg from '@/assets/apache.png'
import con from '@/config'

import Navbar from './components/Navbar.vue'
import SidebarItem from './components/SidebarItem.vue'
import TagsView from './components/TagsView.vue'

import { useResizeHandler } from '@/composables/useResizeHandler'

const store = useStore()
const route = useRoute()

// Initialize Resize Handler
useResizeHandler()

// Config
const config = {
  menuWidth: '320',
  menuCollapseWidth: '50',
  menuBackgroundColor: '#2C3B41',
  textColor: '#B8C7CE',
  textActiveColor: '#FFFFFF',
  showTagBar: true,
}

const sysname = con.system.name
const scuLogo = scuLogoImg

const { menuBackgroundColor, textColor, textActiveColor, showTagBar } = config

const sidebar = computed(() => store.getters.sidebar)
const user = computed(() => store.getters.user)
const isCollapse = computed(() => !sidebar.value.opened)
const device = computed(() => store.state.app.device)
const cachedViews = computed(() => store.state.tagsView.cachedViews)

const menuWidthStyle = computed(() => {
  const width = isCollapse.value ? (device.value === 'mobile' ? 0 : config.menuCollapseWidth) : config.menuWidth
  const widthValue = width + 'px'
  return { width: widthValue, minWidth: widthValue }
})

const handleClickOutside = () => {
  store.dispatch('closeSideBar', { withoutAnimation: false })
}
</script>

<style>
.sidebar-fade-enter-active,
.sidebar-fade-leave-active {
  transition: all 0.2s ease;
}

.sidebar-fade-enter-from,
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
