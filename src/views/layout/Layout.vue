<template>
  <div class="h-full">
    <div>
      <div :class="['bg-[#f5f9fc] flex flex-col border-r border-gray-100 transition fixed top-0 left-0 h-full z-100', { '-translate-x-full': isCollapse, 'w-80': !isCollapse }]">
        <div class="border-b border-gray-200">
          <div class="h-12 flex justify-between items-center">
            <div class="flex items-center px-4 h-full font-semibold">
              {{ sysname }}
            </div>
            <div class="pr-2 transition-transform duration-200" :class="{ 'translate-x-full pl-2 relative': isCollapse }">
              <Button variant="secondary" class="bg-transparent hover:bg-gray-200 shadow-none size-8 p-0" @click="toggleSideBar">
                <HugeiconsIcon :icon="MenuCollapseIcon" v-if="!isCollapse" />
                <HugeiconsIcon :icon="Menu01Icon" v-else />
              </Button>
            </div>
          </div>
        </div>
        <div class="flex-1 overflow-hidden">
          <ScrollArea class="size-full">
            <div class="p-4">
              <SidebarItem v-for="item in user.menus" :key="item.id" :item="item" :collapse="isCollapse" :level="0" />
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
    <div class="flex flex-col h-full transition-[margin-left] duration-200" :class="[{ 'ml-0': isCollapse, 'ml-80': !isCollapse && !isMobile }]">
      <div>
        <header class="h-12">
          <!-- <Navbar /> -->
        </header>
      </div>
      <TagsView v-if="showTagBar" />
      <div clas="test">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

import scuLogoImg from '@/assets/apache.png'
import con from '@/config/index.js'

import Navbar from './components/Navbar.vue'
import SidebarItem from './components/SidebarItem.vue'
import TagsView from './components/TagsView.vue'

import { useResizeHandler } from '@/composables/useResizeHandler.js'
import { useAppStore } from '@/stores/app.js'
import { useTagsViewStore } from '@/stores/tagsView.js'
import { useUserStore } from '@/stores/user.js'
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue'
import Button from '@/components/ui/button/Button.vue'
import { Menu01Icon, MenuCollapseIcon } from '@hugeicons/core-free-icons/index'
import { HugeiconsIcon } from '@hugeicons/vue'

const appStore = useAppStore()
const tagsViewStore = useTagsViewStore()
const userStore = useUserStore()
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

const { sidebar, device } = storeToRefs(appStore)
const { cachedViews } = storeToRefs(tagsViewStore)
const { user } = storeToRefs(userStore)

const isCollapse = computed(() => !sidebar.value.opened)

const isMobile = computed(() => device.value === 'mobile')

console.log(isMobile.value)

const handleClickOutside = () => {
  appStore.closeSideBar({ withoutAnimation: false })
}

const toggleSideBar = () => {
  appStore.toggleSideBar()
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
</style>
