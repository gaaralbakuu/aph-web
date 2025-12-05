<template>
  <div class="min-h-full">
    <div class="h-[66px] border-b border-solid border-gray-200 bg-white fixed top-0 left-0 w-full z-10 flex justify-between px-6">
      <div class="h-full flex gap-2 items-center">
        <img src="@/assets/logo.png" class="h-[60px]" />
        <span class="text-sm font-semibold">{{ platformName[lang] }}</span>
      </div>
    </div>

    <div class="fixed left-0 top-0 bottom-0 w-24 pt-[66px] bg-white">
      <div class="flex flex-col p-3 gap-1">
        <div v-for="i in menu" :key="i.menu_id">
          <router-link v-show="!i.resource_path.includes('http')" class="menu rounded-xl hover:bg-gray-100 size-[72px] flex flex-col gap-1 justify-center items-center" :to="i.resource_path">
          <component :is="i.icon" class="w-6 h-6 mx-auto" />
            <div class="text-[11px]">
              {{ i.name_label }}
            </div>
          
          </router-link>
        </div>
      </div>
    </div>
    <div class="ml-24 pt-[66px]">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
//
import HomeIcon from '@/assets/svg/house.svg'
import CourseIcon from '@/assets/svg/film.svg'
import TopicIcon from '@/assets/svg/folder.svg'

import { localGet, localSet } from '@/utils/auth'
// import LangSelect from '@/views/layout/components/LangSelect.vue'
export default {
  name: 'VideoUserLayout',
  // components: {
  //   LangSelect,
  // },
  data() {
    return {
      adminEntryMenu: null,
      menu: [
        {
          icon: HomeIcon,
          resource_path: '/videoLayout/home',
          name_label: this.$l.home,
        },
        {
          icon: CourseIcon,
          resource_path: '/videoLayout/course',
          name_label: this.$l.course,
        },
        {
          icon: TopicIcon,
          resource_path: '/videoLayout/topic',
          name_label: this.$l.topic,
        },
      ],
      collageList: {
        form: {
          page: 1,
          pageSize: 15,
        },
        data: [],
      },
      selectedCollage: {
        name_label: '',
      }, // 存储当前选中的学院
      platformName: {
        'vi-VN': 'Học tập trực tuyến E+', // Đã cập nhật giá trị tiếng Việt
        'en-US': 'E + learning',
        'zh-CN': '万邦线上学习平台',
        'zh-TW': '萬邦線上學習平臺',
      },
      lang: localGet('lang'),
    }
  },
  computed: {
    ...mapGetters(['user', 'videoMenu', 'college_id']),
  },
  methods: {
    ...mapMutations(['SET_ISADMIN', 'SET_VIDEOMENU', 'SET_COLLEGE_ID']),
    isAdministrator() {
      this.$request(this.$api.videoServer + '/Video/VideoMenu/getUserIsManager', {
        userid: '',
      }).then((r) => {
        if (r.data == false) {
        } else {
          this.SET_ISADMIN(r.data.is_super)
        }
      })
    },
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // In order to re-instantiate the vue-router object to avoid bugs
      })
    },
    getCollegeList() {
      this.$request(this.$api.videoServer + '/Video/VideoCollege/getMyCollege', {
        ...this.collageList.form,
        userid: this.user.userId,
      })
        .then((r) => {
          this.collageList.data = r.data.list
          // 初始化时设置第一个学院为默认选中项
          if (this.collageList.data.length > 0) {
            let is_all = this.collageList.data.find((i) => i.is_all == '1')
            if (is_all) {
              this.handleCommand(is_all)
            } else {
              this.handleCommand(this.collageList.data[0])
            }
          }
        })
        .catch((e) => {
          this.$message.error(e.message)
        })
    },
    handleCommand(command) {
      this.selectedCollage = command
      this.SET_COLLEGE_ID(command.id)
    },

    getMyMenu() {
      this.$request(this.$api.videoServer + '/Video/VideoMenu/getMyMenu', {
        userid: '',
        college: '',
        is_manager: '',
        is_marge: true,
      }).then((r) => {
        if (r.data.length > 0) {
          this.SET_VIDEOMENU(this.simplifyMenuData(r.data))
          let temp = this.videoMenu.find((i) => {
            return i.resource_path == 'WEB_HOME' && i.resource_type == 'navigator'
          })
          this.$set(this, 'menu', temp.children)
          console.log(temp.children)
          let tempEntry = this.findFirstManagerMenu(this.videoMenu)
          if (tempEntry) {
            this.$set(this, 'adminEntryMenu', tempEntry)
            this.isAdministrator()
          }
        } else {
          this.SET_VIDEOMENU([])
        }
      })
    },

    simplifyMenuData(menuArray) {
      return menuArray.map((item) => this.simplifyMenuItem(item))
    },

    simplifyMenuItem(item) {
      const simplifiedItem = {
        name_label: item.name_label,
        children: Array.isArray(item.children) ? this.simplifyMenuData(item.children) : [], // 如果有子项则递归简化
        menu_id: item.menu_id,
        resource_path: item.resource_path,
        resource_type: item.resource_type,
        menu_seq: item.menu_seq,
        is_show: item.is_show,
        is_valid: item.is_valid,
        is_manager: item.is_manager,
      }

      // 移除值为 undefined 或 null 的属性（可选）
      /* Object.keys(simplifiedItem).forEach(key =>
          (simplifiedItem[key] === undefined || simplifiedItem[key] === null) && delete simplifiedItem[key]); */

      return simplifiedItem
    },

    findFirstManagerMenu(menuItems) {
      for (let item of menuItems) {
        // 检查当前项是否符合要求
        if (item.resource_type === 'menu' && item.is_manager === 'Y') {
          return item
        }
        // 如果当前项有子菜单，则递归查找子菜单
        if (item.children && item.children.length > 0) {
          const foundItem = this.findFirstManagerMenu(item.children)
          if (foundItem) return foundItem
        }
      }
      return null // 如果没有找到符合条件的菜单项
    },

    getPlatformName() {
      this.$request(this.$api.baseUrl + '/Platform/param/getparametervalue', {
        type: 'VideoSystem',
        name: 'platformName',
      }).then((r) => {
        if (r.data.length > 0) {
          this.platformName = JSON.parse(r.data[0].param_value)
        }
      })
    },
  },
  mounted() {
    // this.getPlatformName()
    // this.getCollegeList()
    if (this.videoMenu.length == 0) {
      //判断是否有菜单,没有向后端请求用户菜单
      // this.getMyMenu()
    } else {
      //有菜单生成用户首页顶部导航栏
      let temp = this.videoMenu.find((i) => {
        return i.resource_path == 'home' && i.resource_type == 'navigator'
      })
      if (temp) {
        this.$set(this, 'menu', temp.children)
        //看看是否存在后台管理员的菜单,有的话设置并显示后台管理进口,请求是否为超级管理员
        let tempEntry = this.findFirstManagerMenu(this.videoMenu)
        if (tempEntry) {
          this.$set(this, 'adminEntryMenu', tempEntry)
          this.isAdministrator()
        }
      } else {
        // this.getMyMenu()
      }
    }
  },
}
</script>

<style>
.menu.router-link-active {
  @apply bg-[#e8ebed] text-[#1a1a1a];
}
</style>
