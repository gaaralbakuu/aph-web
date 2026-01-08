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
        <div :class="['flex flex-1 items-center', {'gap-3': !collapse}, {'justify-center': collapse}]" :style="contentStyle">
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
          <SidebarItem2
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
        <div :class="['flex flex-1 items-center', {'gap-3': !collapse}, {'justify-center': collapse}]" :style="contentStyle">
          <i
            v-if="isFontIcon"
            :class="['fa', iconName, 'text-base']"
            aria-hidden="true"
          ></i>
          <SvgIcon v-else :icon-class="iconName" class="h-5 w-5" />
          <span v-if="!collapse" class="truncate">{{ item.title }}</span>
        </div>
      </a>
    </div>
  </li>
</template>
<script setup>
import { ref, computed, watch, getCurrentInstance } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { validateURL } from '@/utils/validate'

const props = defineProps({
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
})

const route = useRoute()
const router = useRouter()

// Helper function để kiểm tra external link
const isExternalLink = (routePath) => {
  return validateURL(routePath)
}

// Helper function để lấy icon
const getIcon = (icon) => {
  if (!icon) {
    return 'fa-cube'
  }
  return icon
}

// Recursive function để kiểm tra active descendant
const hasActiveDescendant = (node) => {
  if (!node) {
    return false
  }
  if (node.is_show === 'Y' && node.target && !isExternalLink(node.target) && route.name === node.target) {
    return true
  }
  if (!node.children || node.children.length === 0) {
    return false
  }
  return node.children.some((child) => hasActiveDescendant(child))
}

// Reactive state
const isOpen = ref(
  props.item && props.item.children && props.item.children.length > 0 && hasActiveDescendant(props.item)
)

// Computed properties
const hasChildren = computed(() => {
  return Array.isArray(props.item.children) && props.item.children.length > 0
})

const iconName = computed(() => {
  return getIcon(props.item.icon)
})

const isFontIcon = computed(() => {
  return iconName.value && iconName.value.substr(0, 3) === 'fa-'
})

const branchActive = computed(() => {
  return hasChildren.value && hasActiveDescendant(props.item)
})

const isActive = computed(() => {
  if (hasChildren.value) {
    return false
  }
  if (isExternalLink(props.item.target)) {
    return false
  }
  return route.name === props.item.target
})

const buttonClasses = computed(() => {
  return [
    'flex h-11 w-full items-center rounded-lg transition-colors duration-200 focus:outline-none',
    props.collapse ? 'justify-center px-0' : 'justify-between px-3',
    'hover:bg-white/5',
  ]
})

const buttonStyle = computed(() => {
  return {
    color: branchActive.value ? props.activeColor : props.textColor,
    backgroundColor: branchActive.value ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
  }
})

const leafClasses = computed(() => {
  return [
    'flex h-11 w-full items-center rounded-lg transition-colors duration-200 focus:outline-none',
    props.collapse ? 'justify-center px-0' : 'justify-start px-3',
    'hover:bg-white/5',
  ]
})

const leafStyle = computed(() => {
  return {
    backgroundColor: isActive.value ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
    color: isActive.value ? props.activeColor : props.textColor,
  }
})

const contentStyle = computed(() => {
  if (props.collapse) {
    return {}
  }
  const indent = Math.max(props.level, 0) * 12
  return {
    paddingLeft: indent ? indent + 'px' : '0px',
  }
})

// Watchers
watch(() => props.collapse, (val) => {
  if (val) {
    isOpen.value = false
  } else if (hasChildren.value && hasActiveDescendant(props.item)) {
    isOpen.value = true
  }
})

watch(() => route.name, () => {
  if (hasChildren.value) {
    isOpen.value = hasActiveDescendant(props.item)
  }
})

// Methods
const handleLeafClick = (e) => {
  if (isExternalLink(props.item.target)) {
    return
  }
  e.preventDefault()
  router.push({ name: props.item.target }).catch(() => {})
}

const toggleOpen = () => {
  if (props.collapse) {
    return
  }
  isOpen.value = !isOpen.value
}
</script>
