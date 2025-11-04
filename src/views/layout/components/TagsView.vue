<template>
  <div class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <router-link
        v-for="tag in Array.from(visitedViews)"
        ref="tag"
        :class="isActive(tag)?'active':''"
        :to="tag"
        :key="tag.path"
        class="tags-view-item"
        @contextmenu.prevent.native="openMenu(tag,$event)">
        <span v-show="isActive(tag)" class="el-icon-more" @click.prevent.stop="openMenu(tag,$event)"/>
        {{ tag.title }}
        <span class="el-icon-close" @click.prevent.stop="closeSelectedTag(tag)"/>
      </router-link>
    </scroll-pane>
    <ul v-show="visible" :style="{left:left+'px',top:top+'px'}" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">{{ $l.refresh }}</li>
      <!-- <li @click="closeSelectedTag(selectedTag)">关闭当前</li> -->
      <li @click="closeOthersTags">{{ $l.closeOtherTags }}</li>
      <li @click="closeAllTags">{{ $l.closeAllTags }}</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from '@/components/ScrollPane'

export default {
  name: 'TagsView',
  components: { ScrollPane },
  data () {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {}
    }
  },
  computed: {
    visitedViews () {
      return this.$store.state.tagsView.visitedViews
    }
  },
  watch: {
    $route () {
      this.addViewTags()
      this.moveToCurrentTag()
    },
    visible (value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu)
      } else {
        document.body.removeEventListener('click', this.closeMenu)
      }
    }
  },
  mounted () {
    this.addViewTags()

    console.log(this.$l)
  },
  methods: {
    generateRoute () {
      if (this.$route.name) {
        return this.$route
      }
      return false
    },
    isActive (route) {
      return route.path === this.$route.path
    },
    addViewTags () {
      const route = this.generateRoute()
      if (!route) {
        return false
      }
      this.$store.dispatch('addView', route)
    },
    moveToCurrentTag () {
      const tags = this.$refs.tag
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag.$el)

            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch('updateVisitedView', this.$route)
            }

            break
          }
        }
      })
    },
    refreshSelectedTag (view) {
      this.$store.dispatch('delCachedView', view).then(() => {
        const { fullPath } = view
        this.$nextTick(() => {
          this.$router.replace({
            path: '/redirect' + fullPath
          })
        })
      })
    },
    closeSelectedTag (view) {
      this.$store.dispatch('delView', view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          const latestView = visitedViews.slice(-1)[0]
          if (latestView) {
            this.$router.push(latestView).catch(() => {})
          } else {
            this.$router.push('/').catch(() => {})
          }
        }
      })
    },
    closeOthersTags () {
      this.$router.push(this.selectedTag)
      this.$store.dispatch('delOthersViews', this.selectedTag).then(() => {
        this.moveToCurrentTag()
      })
    },
    closeAllTags () {
      this.$store.dispatch('delAllViews')
      this.$router.push('/').catch(() => {})
    },
    openMenu (tag, e) {
      this.visible = true
      this.selectedTag = tag
      // const offsetLeft = this.$el.getBoundingClientRect().left // container margin left
      // this.left = e.clientX - offsetLeft + 8 // 15: margin right
      this.left = e.clientX
      this.top = e.clientY + 15
    },
    closeMenu () {
      this.visible = false
    }
  }
}
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
  /*&::before {*/
  /*content: '';*/
  /*background: #fff;*/
  /*display: inline-block;*/
  /*width: 8px;*/
  /*height: 8px;*/
  /*border-radius: 50%;*/
  /*position: relative;*/
  /*margin-right: 2px;*/
  /*}*/
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
