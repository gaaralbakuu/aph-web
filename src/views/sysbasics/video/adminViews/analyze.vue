<template>
  <div class="analyze-container">
    <div class="menu-container">
      <div class="menu-label">{{$c.analyzeLayout}}</div>
      <div class="menu-wrapper">
        <el-menu :default-active="defaultIndex">
          <!-- 假设我们不直接遍历第一层导航栏，而是遍历其下的子菜单 -->
          <recursive-menu
            v-for="nav in menu"
            :key="nav.menu_id"
            :menu-items="nav.children"
          ></recursive-menu>
        </el-menu>
      </div>
    </div>
    <div class="router-view">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'analyzeLayout'
}
</script>

<script setup>
import { ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
import RecursiveMenu from './RecursiveMenu.vue'

const type = 'analyze'
const { proxy } = getCurrentInstance()

const defaultIndex = ref(null)
const menu = ref([])

const videoMenu = computed(() => proxy.$store.getters.videoMenu)

const findFirstMenuItem = (menuItems) => {
  for (let item of menuItems) {
    if (item.resource_type === 'menu') {
      return item
    }
    if (item.children && item.children.length > 0) {
      const foundItem = findFirstMenuItem(item.children)
      if (foundItem) return foundItem
    }
  }
  return null
}

const updateMenu = (videoMenuData) => {
  // 过滤出包含 'analyze' 的菜单项
  menu.value = videoMenuData.filter(item => item.resource_path.includes(type))
  // 查找第一个 resource_type 为 'menu' 的 menu_id
  const firstMenuItem = findFirstMenuItem(menu.value)
  defaultIndex.value = firstMenuItem ? firstMenuItem.menu_id : null
}

watch(videoMenu, (newVal) => {
  updateMenu(newVal)
})

onMounted(() => {
  if (videoMenu.value && videoMenu.value.length > 0) {
    updateMenu(videoMenu.value)
  }
})
</script>

<style scoped>
.analyze-container {
  width: 100%;
  height: 100%;
  display: flex;
}
.analyze-container .menu-container {
  width: 15%;
  min-width: 200px;
  height: 100%;
  background-color: white;
}
.analyze-container .menu-container .menu-label {
  height: 60px;
  padding: 15px 20px;
  font-size: 28px;
  font-weight: bold;
  line-height: 30px;
  border-bottom: 1px solid #e1e1e1;
  border-right: 1px solid #e1e1e1;
}
.analyze-container .menu-container .menu-wrapper {
  width: 100%;
  height: calc(100% - 60px);
}
.analyze-container .menu-container .menu-wrapper .link {
  width: 100%;
  height: 100%;
  color: #000;
}
.analyze-container .router-view {
  width: 85%;
  height: 100%;
}
</style>
