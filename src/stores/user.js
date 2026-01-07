import { defineStore } from 'pinia'
import { ref } from 'vue'
import api from '@/api'
import { generateTree } from '@/utils'
import { removeToken, setToken } from '@/utils/auth'
import request from '@/utils/request'

export const useUserStore = defineStore('user', () => {
  // State
  const user = ref({})
  const videoMenu = ref([])
  const isAdmin = ref('')
  const college_id = ref('')

  // Actions
  const loginByUsername = async (userInfo) => {
    const username = userInfo.username.trim()
    const password = userInfo.password.trim()
    const code = (userInfo.code || '').trim()
    const captchaId = userInfo.captchaId

    try {
      const r = await request(
        api.auth + 'login',
        {
          username,
          password,
          code,
          captchaId,
          client: 'WEB'
        },
        'post'
      )

      if (r.status) {
        setToken(r.data.token)
      } else {
        throw new Error(r.message)
      }
    } catch (error) {
      throw error
    }
  }

  const getUserInfo = async () => {
    try {
      const r = await request(api.auth + 'getuserbytoken', { client: 'WEB' })

      if (r.status) {
        const userData = r.data.user
        userData.menu = r.data.menu
        if (!userData.menu) userData.menu = []

        // Tạo cấu trúc menu từ dữ liệu backend
        let res = generateTree(
          userData.menu.map((i) => ({
            id: i.menu_id,
            parent_id: i.parent_id,
            title: i.menu_name,
            icon: i.image_url,
            target: i.resource_path,
            children: i.children,
            is_show: i.is_show
          })),
          'id',
          'parent_id',
          0
        )

        res.unshift({
          id: '0',
          title: '欢迎页',
          icon: 'home',
          target: 'welcome'
        })

        userData.menus = res
        user.value = userData
      } else {
        throw new Error(r.error)
      }
    } catch (error) {
      throw error
    }
  }

  const changePassword = async (data) => {
    try {
      await request(
        api.user + 'changePassword',
        {
          oldPwd: data.oldPwd,
          newPwd1: data.newPwd1,
          newPwd2: data.newPwd2
        },
        'post'
      )
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    removeToken()
    user.value = {}
  }

  const fedLogout = async () => {
    removeToken()
    user.value = {}
  }

  const setVideoMenu = (menu) => {
    videoMenu.value = menu
  }

  const setIsAdmin = (value) => {
    isAdmin.value = value
  }

  const setCollegeId = (id) => {
    college_id.value = id
  }

  return {
    // State
    user,
    videoMenu,
    isAdmin,
    college_id,
    // Actions
    loginByUsername,
    getUserInfo,
    changePassword,
    logout,
    fedLogout,
    setVideoMenu,
    setIsAdmin,
    setCollegeId
  }
})
