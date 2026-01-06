<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      :background-color="variables.menuBg"
      :text-color="variables.menuText"
      :active-text-color="variables.menuActiveText"
      mode="vertical"
    >
      <sidebar-item v-for="route in permission_routers" :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import SidebarItem from '../SidebarItem'
import variables from '@/styles/variables.scss'

defineOptions({ name: 'Sidebar' })

const store = useStore()
const route = useRoute()

const permission_routers = computed(() => store.getters.permission_routers)
const sidebar = computed(() => store.getters.sidebar)
const isCollapse = computed(() => !sidebar.value.opened)
</script>
