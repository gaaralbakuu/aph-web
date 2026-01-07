<template>
  <div class="tags-view-container">
    <ScrollPane ref="scrollPane" class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        ref="tagRef"
        :class="isActive(tag) ? 'active' : ''"
        :to="tag"
        :key="tag.path"
        class="tags-view-item"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        <span v-show="isActive(tag)" class="el-icon-more" @click.prevent.stop="openMenu(tag, $event)" />
        {{ tag.title }}
        <span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)" />
      </router-link>
    </ScrollPane>
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">{{ l.refresh }}</li>
      <!-- <li @click="closeSelectedTag(selectedTag)">关闭当前</li> -->
      <li @click="closeOthersTags">{{ l.closeOtherTags }}</li>
      <li @click="closeAllTags">{{ l.closeAllTags }}</li>
    </ul>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick, getCurrentInstance, onMounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import ScrollPane from '@/components/ScrollPane/index.vue'
import { useLocalI18n } from '@/composables/useLocalI18n'

// Props/Emits if needed

const store = useStore()
const router = useRouter()
const route = useRoute()
const { proxy } = getCurrentInstance()
const { l } = useLocalI18n()

const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref({})
const scrollPane = ref(null)
const tagRef = ref([])

const visitedViews = computed(() => store.state.tagsView.visitedViews)

const isActive = (r) => r.path === route.path

const addViewTags = () => {
  if (route.name) {
    store.dispatch('addView', route)
  }
}

const moveToCurrentTag = () => {
  const tags = tagRef.value
  nextTick(() => {
    // If tagRef is an array of components or elements, find the matching one
    // Note: In Vue 3, ref inside v-for gives an array.
    if (!tags) return

    for (const tag of tags) {
      // tag here is likely the RouterLink component instance
      if (tag.to.path === route.path) {
        if (scrollPane.value) {
          scrollPane.value.moveToTarget(tag.$el)
        }
        if (tag.to.fullPath !== route.fullPath) {
          store.dispatch('updateVisitedView', route)
        }
        break
      }
    }
  })
}

const refreshSelectedTag = (view) => {
  store.dispatch('delCachedView', view).then(() => {
    const { fullPath } = view
    nextTick(() => {
      router.replace({ path: '/redirect' + fullPath })
    })
  })
}

const closeSelectedTag = (view) => {
  store.dispatch('delView', view).then(({ visitedViews: views }) => {
    if (isActive(view)) {
      const latestView = views.slice(-1)[0]
      if (latestView) {
        router.push(latestView).catch(() => {})
      } else {
        router.push('/').catch(() => {})
      }
    }
  })
}

const closeOthersTags = () => {
  router.push(selectedTag.value)
  store.dispatch('delOthersViews', selectedTag.value).then(() => {
    moveToCurrentTag()
  })
}

const closeAllTags = () => {
  store.dispatch('delAllViews')
  router.push('/').catch(() => {})
}

const openMenu = (tag, e) => {
  visible.value = true
  selectedTag.value = tag
  left.value = e.clientX
  top.value = e.clientY + 15
}

const closeMenu = () => {
  visible.value = false
}

watch(route, () => {
  addViewTags()
  moveToCurrentTag()
})

watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})

onMounted(() => {
  addViewTags()
})
</script>

<style rel="stylesheet/scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
}
.tags-view-container .tags-view-wrapper .tags-view-item {
  display: inline-block;
  position: relative;
  height: 26px;
  line-height: 26px;
  border: 1px solid #d8dce5;
  color: #495060;
  background: #fff;
  padding: 0 5px 0 10px;
  font-size: 12px;
  margin-left: 5px;
  margin-top: 4px;
  text-decoration: none;
}
.tags-view-container .tags-view-wrapper .tags-view-item:first-of-type {
  margin-left: 15px;
}
.tags-view-container .tags-view-wrapper .tags-view-item:last-of-type {
  margin-right: 15px;
}
.tags-view-container .tags-view-wrapper .tags-view-item.active {
  background-color: #409EFF;
  color: #fff;
  border-color: #409EFF;
}
.tags-view-container .contextmenu {
  margin: 0;
  background: #fff;
  z-index: 100;
  position: absolute;
  list-style-type: none;
  padding: 5px 0;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 400;
  color: #333;
  box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
}
.tags-view-container .contextmenu li {
  margin: 0;
  padding: 7px 16px;
  cursor: pointer;
}
.tags-view-container .contextmenu li:hover {
  background: #eee;
}
</style>

<style rel="stylesheet/scss">
.tags-view-wrapper .tags-view-item .el-icon-more {
  width: 16px;
  height: 16px;
  margin-left: -8px;
  vertical-align: 3px;
  border-radius: 50%;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transform-origin: 100% 50%;
}
.tags-view-wrapper .tags-view-item .el-icon-more:before {
  transform: rotate(90deg);
  display: inline-block;
  vertical-align: -2px;
}
.tags-view-wrapper .tags-view-item .el-icon-more:hover {
  background-color: #b4bccc;
  color: #fff;
}
.tags-view-wrapper .tags-view-item .el-icon-close {
  width: 16px;
  height: 16px;
  vertical-align: 2px;
  border-radius: 50%;
  text-align: center;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  transform-origin: 100% 50%;
}
.tags-view-wrapper .tags-view-item .el-icon-close:before {
  transform: scale(0.8);
  display: inline-block;
  vertical-align: -3px;
}
.tags-view-wrapper .tags-view-item .el-icon-close:hover {
  background-color: #b4bccc;
  color: #fff;
}
</style>
