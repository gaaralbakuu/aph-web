<template>
  <el-container style="height: 100%; width: 100%">
    <div class="videoAdminLayout-wrapper">
      <div class="navi">
        <div class="logo-wrapper">
          <img src="@/assets/logo.png" />
        </div>
        <div class="menu-wrapper flex-1">
          <div class="menu" v-for="i in navigator" :key="i.to">
            <router-link :class="{ customActive: isPathActive(i.to) }" class="link" :to="i.to">
              {{ i.label }}
            </router-link>
          </div>
        </div>
        <div class="flex gap-3 items-center pr-3">
          <div class="h-10 w-10 rounded-md text-[20px] cursor-pointer flex items-center justify-center bg-[#f5f5f5] text-black hover:bg-[#eaeaea] hover:text-black dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-[#272727] dark:hover:text-white" @click="toggleScreenfull">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
            </svg>
          </div>
          <size-select />
          <lang-select />
          <div class="relative group ml-auto">
            <div class="h-10 w-10 rounded-md text-[20px] cursor-pointer flex items-center justify-center bg-[#f5f5f5] text-black hover:bg-[#eaeaea] hover:text-black dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-[#272727] dark:hover:text-white">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
            <div class="pointer-events-none absolute right-0 z-50 w-[240px] transform pt-3 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
              <div class="flex flex-col rounded-md bg-white py-2 font-medium text-black shadow-lg dark:bg-[#1a1a1a] dark:text-white">
                <div class="flex items-center gap-2 px-5 py-3 border-b border-[#ebebeb] dark:border-gray-600">
                  <div class="flex h-5 w-5 items-center justify-center overflow-hidden rounded-full bg-black text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-3 w-3">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold">{{ user.userId }}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">{{ user.userName }}</span>
                  </div>
                </div>
                <div class="flex flex-col border-b border-[#ebebeb] dark:border-gray-600 py-1">
                  <router-link to="/videoLayout/home" class="px-5 py-3 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-600">
                    {{ $c.videoUserHome }}
                  </router-link>
                  <router-link to="/home/welcome" class="px-5 py-3 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-600">
                    {{ $c.apacheHome }}
                  </router-link>
                  <!-- <div @click="passwordFormVisible = true" class="cursor-pointer px-5 py-3 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-600">
                    {{ $l.changePwd }}
                  </div> -->
                </div>
                <div class="flex flex-col pt-1">
                  <div @click="logout" class="cursor-pointer px-5 py-3 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-600">
                    {{ $l.logout }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="content">
        <router-view></router-view>
      </div>
    </div>
  </el-container>
</template>

<script>
import LangSelect from '@/views/layout/components/LangSelect.vue'
import SizeSelect from '@/views/layout/components/SizeSelect.vue'
import screenfull, { toggle } from 'screenfull'
import { mapGetters, mapMutations } from 'vuex'
export default {
  name: 'videoAdminLayout',
  components: {
    LangSelect,
    SizeSelect,
  },
  data() {
    return {
      navigator: [],
      menuTree: [],
      passwordFormVisible: false,
    }
  },
  computed: {
    ...mapGetters(['user', 'videoMenu', 'isAdmin']),
  },
  methods: {
    ...mapMutations(['SET_VIDEOMENU', 'SET_ISADMIN']),
    logout() {
      this.$store.dispatch('LogOut').then(() => {
        location.reload() // In order to re-instantiate the vue-router object to avoid bugs
      })
    },

    generateNavigator(menuArray) {
      return menuArray.reduce((acc, navigator) => {
        if (navigator.resource_type === 'navigator' && !navigator.resource_path.includes('HOME')) {
          // 查找当前导航下的第一个菜单项(resource_type 为 menu)
          let firstMenuPath = findFirstMenuPath(navigator)
          if (firstMenuPath) {
            acc.push({
              label: navigator.name_label,
              to: firstMenuPath,
            })
          }
        }
        return acc
      }, [])

      function findFirstMenuPath(item) {
        // 如果当前项是菜单，则直接返回其 resource_path
        if (item.resource_type === 'menu') {
          return item.resource_path
        }

        // 如果有子项，递归查找
        if (item.children && item.children.length > 0) {
          for (let child of item.children) {
            let path = findFirstMenuPath(child)
            if (path) return path // 找到后立即返回，保证只获取第一个菜单项的路径
          }
        }

        return null
      }
    },

    isPathActive(path) {
      let pathArray = path.split('/')
      let flag = pathArray[0] + '/' + pathArray[1] + '/' + pathArray[2]
      return this.$route.path.startsWith(flag)
    },

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

    getMyMenu() {
      this.$request(this.$api.videoServer + '/Video/VideoMenu/getMyMenu', {
        userid: '',
        college: '',
        is_manager: '',
        is_marge: true,
      }).then((r) => {
        if (r.data.length > 0) {
          this.menuTree = this.simplifyMenuData(r.data)
          this.navigator = this.generateNavigator(this.menuTree)
          if (!this.isAdmin) {
            this.navigator = this.navigator.reverse()
          }
          this.SET_VIDEOMENU(this.menuTree)
        } else {
          this.menuTree = []
          this.navigator = []
          this.SET_VIDEOMENU(this.menuTree)
          this.$router.replace('/404')
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
      }

      // 移除值为 undefined 或 null 的属性（可选）
      /* Object.keys(simplifiedItem).forEach(key =>
          (simplifiedItem[key] === undefined || simplifiedItem[key] === null) && delete simplifiedItem[key]); */

      return simplifiedItem
    },

    toggleScreenfull() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'Your browser does not support fullscreen mode',
          type: 'warning',
        })
        return false
      }
      screenfull.toggle()
    },
  },
  mounted() {
    if (this.videoMenu.length == 0) {
      this.getMyMenu()
    } else {
      this.navigator = this.generateNavigator(this.videoMenu)
    }
    if (this.isAdmin === '') {
      this.isAdministrator()
    }
  },
}
</script>

<style lang="scss" scoped>
.videoAdminLayout-wrapper {
  width: 100%;
  height: 100%;
  background-color: aliceblue;

  .navi {
    width: 100%;
    min-width: 1200px;
    height: 50px;
    background-color: white;
    border-bottom: 1px solid #e1e1e1;
    display: flex;
    align-items: center;

    .customActive {
      background-color: #409fee;
      color: #fff !important;
    }

    .logo-wrapper {
      width: 15%;
      min-width: 200px;
      height: 100%;
      text-align: center;
      border-right: 1px solid #e1e1e1;
      background-color: white;

      img {
        width: 40px;
        height: 40px;
        margin-top: 5px;
      }
    }

    .menu-wrapper {
      width: 64%;
      height: 100%;
      display: flex;
      align-items: center;
      color: #000;

      .menu {
        display: block;
        width: 120px;
        height: 100%;
        text-align: center;
        // margin: 0px 30px;
        line-height: 50px;

        &:hover {
          background-color: #e1e1e1;
        }

        .link {
          display: block;
          width: 100%;
          min-width: 100px;
          height: 100%;
          color: #000;
        }

        .router-link-active {
          display: block;
          width: 100%;
          min-width: 100px;
          height: 100%;
          background-color: #409fee;
          color: #fff;
        }
      }
    }
  }

  .content {
    width: 100%;
    height: calc(100% - 50px);
    display: flex;

    .menu-container {
      width: 15%;
      height: 100%;
      background-color: white;

      .menu-label {
        height: 60px;
        padding: 10px;
        font-size: 28px;
        line-height: 40px;
      }
    }
  }
}
</style>
