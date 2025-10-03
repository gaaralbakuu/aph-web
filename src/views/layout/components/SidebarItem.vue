<template>
  <li>
    <div v-if="hasChildren" class="flex flex-col">
      <button
        type="button"
        :class="buttonClasses"
        :style="buttonStyle"
        @click="toggleOpen"
        :title="collapse ? item.title : ''"
      >
        <div class="flex flex-1 items-center gap-3" :style="contentStyle">
          <i
            v-if="isFontIcon"
            :class="['fa', iconName, 'text-base']"
            aria-hidden="true"
          ></i>
          <svg-icon v-else :icon-class="iconName" class="h-5 w-5" />
          <span v-if="!collapse" class="truncate">{{ item.title }}</span>
        </div>
        <i
          v-if="!collapse"
          class="fa fa-chevron-down text-xs transition-transform duration-200"
          :class="{ 'rotate-180': isOpen }"
          :style="{ color: branchActive ? activeColor : textColor }"
        ></i>
      </button>
      <transition name="sidebar-fade">
        <ul
          v-show="isOpen && !collapse"
          class="mt-1 space-y-1 border-l border-white/10 pl-3"
        >
          <sidebar-item
            v-for="child in item.children"
            :key="child.id"
            :item="child"
            :level="level + 1"
            :collapse="collapse"
            :text-color="textColor"
            :active-color="activeColor"
          />
        </ul>
      </transition>
    </div>
    <div v-else-if="item.is_show === 'Y'">
      <a
        :href="item.target"
        :target="isExternalLink(item.target) ? '_blank' : '_self'"
        :class="leafClasses"
        :style="leafStyle"
        @click="handleLeafClick"
        :title="collapse ? item.title : ''"
      >
        <div class="flex flex-1 items-center gap-3" :style="contentStyle">
          <i
            v-if="isFontIcon"
            :class="['fa', iconName, 'text-base']"
            aria-hidden="true"
          ></i>
          <svg-icon v-else :icon-class="iconName" class="h-5 w-5" />
          <span v-if="!collapse" class="truncate">{{ item.title }}</span>
        </div>
      </a>
    </div>
  </li>
</template>
<script>
import { validateURL } from '@/utils/validate'

export default {
  name: 'SidebarItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
    level: {
      type: Number,
      default: 0,
    },
    collapse: {
      type: Boolean,
      default: false,
    },
    textColor: {
      type: String,
      default: '#B8C7CE',
    },
    activeColor: {
      type: String,
      default: '#FFFFFF',
    },
  },
  data() {
    return {
      isOpen: this.item && this.item.children && this.item.children.length > 0 && this.hasActiveDescendant(this.item),
    }
  },
  computed: {
    hasChildren() {
      return Array.isArray(this.item.children) && this.item.children.length > 0
    },
    iconName() {
      return this.getIcon(this.item.icon)
    },
    isFontIcon() {
      return this.iconName && this.iconName.substr(0, 3) === 'fa-'
    },
    branchActive() {
      return this.hasChildren && this.hasActiveDescendant(this.item)
    },
    isActive() {
      if (this.hasChildren) {
        return false
      }
      if (this.isExternalLink(this.item.target)) {
        return false
      }
      return this.$route.name === this.item.target
    },
    buttonClasses() {
      return [
        'flex h-11 w-full items-center rounded-lg transition-colors duration-200 focus:outline-none',
        this.collapse ? 'justify-center px-0' : 'justify-between px-3',
        'hover:bg-white/5',
      ]
    },
    buttonStyle() {
      return {
        color: this.branchActive ? this.activeColor : this.textColor,
        backgroundColor: this.branchActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
      }
    },
    leafClasses() {
      return [
        'flex h-11 w-full items-center rounded-lg transition-colors duration-200 focus:outline-none',
        this.collapse ? 'justify-center px-0' : 'justify-start px-3',
        'hover:bg-white/5',
      ]
    },
    leafStyle() {
      return {
        backgroundColor: this.isActive ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
        color: this.isActive ? this.activeColor : this.textColor,
      }
    },
    contentStyle() {
      if (this.collapse) {
        return {}
      }
      const indent = Math.max(this.level, 0) * 12
      return {
        paddingLeft: indent ? indent + 'px' : '0px',
      }
    },
  },
  watch: {
    collapse(val) {
      if (val) {
        this.isOpen = false
      } else if (this.hasChildren && this.hasActiveDescendant(this.item)) {
        this.isOpen = true
      }
    },
    '$route.name'() {
      if (this.hasChildren) {
        this.isOpen = this.hasActiveDescendant(this.item)
      }
    },
  },
  methods: {
    isExternalLink(routePath) {
      return validateURL(routePath)
    },
    handleLeafClick(e) {
      if (this.isExternalLink(this.item.target)) {
        return
      }
      e.preventDefault()
      this.$router.push({ name: this.item.target }).catch(() => {})
    },
    toggleOpen() {
      if (this.collapse) {
        return
      }
      this.isOpen = !this.isOpen
    },
    getIcon(icon) {
      if (!icon) {
        return 'fa-cube'
      }
      return icon
    },
    hasActiveDescendant(node) {
      if (!node) {
        return false
      }
      if (node.is_show === 'Y' && node.target && !this.isExternalLink(node.target) && this.$route.name === node.target) {
        return true
      }
      if (!node.children || node.children.length === 0) {
        return false
      }
      return node.children.some((child) => this.hasActiveDescendant(child))
    },
  },
}
</script>
