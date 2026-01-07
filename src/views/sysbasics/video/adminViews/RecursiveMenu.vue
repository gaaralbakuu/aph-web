<template>
  <div v-if="menuItems && menuItems.length">
    <!-- 如果是目录类型 -->
    <el-submenu v-for="item in menuItems" v-if="item.resource_type === 'catalogue'" :key="item.menu_id" :index="item.menu_id">
      <template #title>{{ item.name_label }}</template>
      <!-- 递归调用自身来处理子菜单 -->
      <recursive-menu :menu-items="item.children"></recursive-menu>
    </el-submenu>

    <!-- 如果是菜单类型 -->
    <el-menu-item v-for="item in menuItems" v-else-if="item.resource_type === 'menu'" :key="item.menu_id" :index="item.menu_id">
      <router-link class="link" :to="item.resource_path">{{ item.name_label }}</router-link>
    </el-menu-item>
  </div>
</template>

<script>
export default {
  name: 'RecursiveMenu'
}
</script>

<script setup>
defineProps({
  menuItems: {
    type: Array,
    required: true
  }
})
</script>

<style scoped>
.link {
  display: block;
  width: 100%;
  height: 100%;
  color: #000;
}
</style>
