<template>
  <div class="flex-1 flex overflow-hidden">
    <div class="h-full w-64 border-r border-gray-200 flex flex-col">
      <div class="menu-label">{{$c.lessonLayout}}</div>
      <div class="menu-wrapper">
        <el-menu :default-active="defaultIndex" class="border-0!">
          <template v-for="nav in menu">
            <!-- 假设我们不直接遍历第一层导航栏，而是遍历其下的子菜单 -->
            <recursive-menu :menu-items="nav.children"></recursive-menu>
          </template>
        </el-menu>
      </div>
    </div>
    <div class="flex-1 overflow-hidden flex flex-col">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  let type = 'lesson'
  import {
    mapGetters
  } from 'vuex'

  import RecursiveMenu from './RecursiveMenu.vue';
  export default {
    name: type + 'Layout',
    components: {
      RecursiveMenu
    },
    data() {
      return {
        type: type,
        defaultIndex: null,
        menu: []
      }
    },
    computed: {
      ...mapGetters(['videoMenu'])
    },
    watch: {
      videoMenu(newVal) {
        this.updateMenu(newVal);
      }
    },
    methods: {
      updateMenu(videoMenu) {
        // 过滤出包含 'lesson' 的菜单项
        this.menu = videoMenu.filter(item => item.resource_path.includes(this.type));
        // 查找第一个 resource_type 为 'menu' 的 menu_id
        const firstMenuItem = this.findFirstMenuItem(this.menu);
        this.defaultIndex = firstMenuItem ? firstMenuItem.menu_id : null;
      },
      findFirstMenuItem(menuItems) {
        for (let item of menuItems) {
          if (item.resource_type === 'menu') {
            return item;
          }
          if (item.children && item.children.length > 0) {
            const foundItem = this.findFirstMenuItem(item.children);
            if (foundItem) return foundItem;
          }
        }
        return null;
      }
    },
    mounted() {
      if (this.videoMenu && this.videoMenu.length > 0) {
        this.updateMenu(this.videoMenu);
      }
    }
  }
</script>

<style scoped>
.menu-container .menu-label {
  height: 60px;
  padding: 15px 20px;
  font-size: 28px;
  font-weight: bold;
  line-height: 30px;
  border-bottom: 1px solid #e1e1e1;
  border-right: 1px solid #e1e1e1;
}
.menu-container .menu-wrapper {
  width: 100%;
  height: calc(100% - 60px);
}
.menu-container .menu-wrapper .link {
  width: 100%;
  height: 100%;
  color: #000;
}
.router-view {
  width: 85%;
  height: 100%;
}
</style>
