<template>
  <div v-if="item.children&&item.children.length>0">
    <el-submenu :index="item.title">
      <template slot="title">
        <menu-item :icon="getIcon(item.icon)" :title="item.title" />
      </template>
      <sidebar-item v-for="child in item.children" :key="child.id" :item="child" :isNest="true">
      </sidebar-item>
    </el-submenu>
  </div>
  <div v-else-if="item.is_show=='Y'">
    <a :href="item.target" target="_blank" @click="clickLink(item.target,$event)">
      <el-menu-item :index="item.target||Math.random().toString(36).substr(2)"
        :class="{'submenu-title-noDropdown':!isNest}">
        <menu-item :icon="getIcon(item.icon)" :title="item.title" />
      </el-menu-item>
    </a>
  </div>
</template>
<script>
import path from 'path'
import { validateURL } from '@/utils/validate'
import MenuItem from './MenuItem'

export default {
  name: 'SidebarItem',
  components: { MenuItem },
  props: {
    // route object
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false,
    },
    basePath: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      onlyOneChild: null,
    }
  },
  methods: {
    resolvePath(routePath) {
      return path.resolve(this.basePath, routePath)
    },
    isExternalLink(routePath) {
      return validateURL(routePath)
    },
    clickLink(routeName, e) {
      if (!this.isExternalLink(routeName)) {
        e.preventDefault()
        this.$router.push({ name: routeName }).catch(() => {})
      }
    },
    getIcon: function (icon) {
      if (!icon && !this.isNest) {
        return 'fa-cube'
      }
      return icon
    },
  },
}
</script>
