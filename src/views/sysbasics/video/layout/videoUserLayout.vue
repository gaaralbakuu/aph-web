<template>
  <div class="min-h-full">
    <div class="h-[66px] border-b border-solid border-gray-200 bg-white fixed top-0 left-0 w-full flex justify-between px-6 z-50">
      <div class="flex items-center gap-4">
        <div class="h-full flex gap-2 items-center">
          <img src="@/assets/logo.png" class="h-[60px]" />
          <span class="text-sm font-semibold">{{ platformName[lang] }}</span>
        </div>

        <!-- Channel Selector Dropdown -->
        <el-dropdown trigger="click" @command="handleCommand" v-if="collageList.data.length > 0">
          <div class="flex items-center gap-1 px-3 py-2 rounded-md hover:bg-gray-100 cursor-pointer transition-colors">
            <span class="text-sm font-medium">{{ selectedCollage.name_label }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-4 h-4">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item v-for="(item, index) in collageList.data" :key="index" :command="item">
                {{ item.name_label }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="flex items-center gap-2">
        <LangSelect class="lang-select" />
        <div class="relative group ml-auto">
          <div class="h-10 w-10 rounded-md text-[20px] cursor-pointer flex items-center justify-center bg-[#f5f5f5] text-black hover:bg-[#eaeaea] hover:text-black dark:bg-[#1a1a1a] dark:text-white dark:hover:bg-[#272727] dark:hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" class="h-5 w-5">
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div class="pointer-events-none absolute right-0 z-50 w-60 transform pt-3 opacity-0 transition-opacity duration-200 group-hover:pointer-events-auto group-hover:opacity-100">
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
                <router-link v-if="adminEntryMenu" :to="adminEntryMenu.resource_path" class="px-5 py-3 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-600">
                  {{ c.videoAdminHome }}
                </router-link>
                <router-link to="/home/welcome" class="px-5 py-3 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-600">
                  {{ c.videoUserHome }}
                </router-link>
                <!-- <div @click="passwordFormVisible = true" class="cursor-pointer px-5 py-3 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-600">
                    {{ l.changePwd }}
                  </div> -->
              </div>
              <div class="flex flex-col pt-1">
                <div @click="logout" class="cursor-pointer px-5 py-3 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-600">
                  {{ c.logOut }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed left-0 top-0 bottom-0 w-24 pt-[66px] bg-white">
      <div class="flex flex-col p-3 gap-1" v-if="menus.length">
        <div v-for="menu in menus" :key="menu.menu_id">
          <router-link v-show="!menu.resource_path.includes('http')" class="menu rounded-xl hover:bg-gray-100 size-[72px] flex flex-col gap-1 justify-center items-center" :to="menu.resource_path">
            <component :is="menu.icon" class="w-6 h-6 mx-auto" />
            <div class="text-[11px]">
              {{ menu.name_label }}
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

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import store from '@/store'
import { useLocalI18n } from '@/composables/useLocalI18n'
import LangSelect from '@/views/layout/components/LangSelect.vue'
import HomeIcon from '@/assets/svg/house.svg'
import CourseIcon from '@/assets/svg/film.svg'
import TopicIcon from '@/assets/svg/folder.svg'
import { localGet } from '@/utils/auth'
import { getCurrentInstance } from 'vue'

const instance = getCurrentInstance()
const { $request, $api } = instance.proxy

const { l, c } = useLocalI18n('VideoUserLayout')

console.log(l)

const adminEntryMenu = ref(null)
const menus = computed(() => [
  {
    icon: HomeIcon,
    resource_path: '/videoLayout/home',
    name_label: l.value.home,
  },
  {
    icon: CourseIcon,
    resource_path: '/videoLayout/course',
    name_label: l.value.course,
  },
  {
    icon: TopicIcon,
    resource_path: '/videoLayout/topic',
    name_label: l.value.topic,
  },
])
const collageList = reactive({
  form: {
    page: 1,
    pageSize: 15,
  },
  data: [],
})
const selectedCollage = reactive({
  name_label: '',
})
const platformName = reactive({
  'vi-VN': 'Học tập trực tuyến E+',
  'en-US': 'E + learning',
  'zh-CN': '万邦线上学习平台',
  'zh-TW': '萬邦線上學習平臺',
})
const lang = ref(localGet('lang'))

const user = computed(() => store.getters.user)
const videoMenu = computed(() => store.getters.videoMenu)
const college_id = computed(() => store.getters.college_id)

console.log('college_id:', college_id.value)

const isAdministrator = () => {
  $request($api.videoServer + '/Video/VideoMenu/getUserIsManager', {
    userid: '',
  })
    .then((r) => {
      if (r.data !== false) {
        store.commit('SET_ISADMIN', r.data.is_super)
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

const logout = () => {
  store.dispatch('LogOut').then(() => {
    location.reload()
  })
}

const getCollegeList = () => {
  $request($api.videoServer + '/Video/VideoCollege/getMyCollege', {
    ...collageList.form,
    userid: user.value.userId,
  })
    .then((r) => {
      collageList.data = r.data.list
      if (collageList.data.length > 0) {
        const is_all = collageList.data.find((i) => i.is_all === '1')
        if (is_all) {
          handleCommand(is_all)
        } else {
          handleCommand(collageList.data[0])
        }
      }
    })
    .catch((error) => {
      console.error(error.message)
    })
}

const handleCommand = (command) => {
  Object.assign(selectedCollage, command)
  store.commit('SET_COLLEGE_ID', command.id)
}

const simplifyMenuData = (menuArray) => {
  return menuArray.map((item) => simplifyMenuItem(item))
}

const simplifyMenuItem = (item) => {
  return {
    name_label: item.name_label,
    children: Array.isArray(item.children) ? simplifyMenuData(item.children) : [],
    menu_id: item.menu_id,
    resource_path: item.resource_path,
    resource_type: item.resource_type,
    menu_seq: item.menu_seq,
    is_show: item.is_show,
    is_valid: item.is_valid,
    is_manager: item.is_manager,
  }
}

const findFirstManagerMenu = (menuItems) => {
  for (const item of menuItems) {
    if (item.resource_type === 'menu' && item.is_manager === 'Y') {
      return item
    }
    if (item.children && item.children.length > 0) {
      const foundItem = findFirstManagerMenu(item.children)
      if (foundItem) return foundItem
    }
  }
  return null
}

const getPlatformName = () => {
  $request($api.baseUrl + '/Platform/param/getparametervalue', {
    type: 'VideoSystem',
    name: 'platformName',
  })
    .then((r) => {
      if (r.data.length > 0) {
        Object.assign(platformName, JSON.parse(r.data[0].param_value))
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

const getMyMenu = () => {
  $request($api.videoServer + '/Video/VideoMenu/getMyMenu', {
    userid: '',
    college: '',
    is_manager: '',
    is_marge: true,
  })
    .then((r) => {
      if (r.data.length > 0) {
        store.commit('SET_VIDEOMENU', simplifyMenuData(r.data))
        const tempEntry = findFirstManagerMenu(videoMenu.value)
        if (tempEntry) {
          adminEntryMenu.value = tempEntry
          isAdministrator()
        }
      } else {
        store.commit('SET_VIDEOMENU', [])
      }
    })
    .catch((error) => {
      console.error(error)
    })
}

onMounted(() => {
  // getPlatformName()
  getCollegeList()
  getMyMenu()
})
</script>

<style>
.menu.router-link-active {
  @apply bg-[#e8ebed] text-[#1a1a1a];
}
</style>
