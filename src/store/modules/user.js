import { setToken, removeToken } from '@/utils/auth'
import { generateTree } from '@/utils'
import api from '@/api'
import request from '@/utils/request'

const user = {
  state: {
    user: {},
    videoMenu: [], //video的菜单
    isAdmin: '',
    college_id: ''
  },

  mutations: {
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_VIDEOMENU: (state, videoMenu) => {
      state.videoMenu = videoMenu
    },
    SET_ISADMIN: (state, isAdmin) => {
      state.isAdmin = isAdmin
    },
    SET_COLLEGE_ID: (state, college_id) => {
      state.college_id = college_id
    }
  },

  actions: {
    // 用户登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password.trim()
      const code = (userInfo.code || '').trim()
      const captchaId = userInfo.captchaId
      return new Promise((resolve, reject) => {
        request(
          api.auth + 'login',
          {
            username: username,
            password: password,
            code,
            captchaId,
            client: 'WEB'
          },
          'post'
        )
          .then(r => {
            if (r.status) {
              setToken(r.data.token)
              resolve()
            } else {
              throw {
                message: r.message
              }
            }
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    // 获取用户信息
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        request(api.auth + 'getuserbytoken', { client: 'WEB' })
          .then(r => {
            if (r.status) {
              const user = r.data.user
              user.menu = r.data.menu
              if (!user.menu) user.menu = []
              // 根据后端返回的menu生成菜单数据结构
              let res = generateTree(
                user.menu.map(i => ({
                  id: i.menu_id,
                  parent_id: i.parent_id,
                  title: i.menu_name,
                  icon: i.image_url,
                  target: i.resource_path,
                  children: i.children,
                  is_show:i.is_show
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
              user.menus = res
              commit('SET_USER', user)
              resolve()
            } else {
              throw {
                message: r.error
              }
            }
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    // 修改密码
    ChangePass({ commit }, data) {
      return new Promise((resolve, reject) => {
        request(
          api.user + 'changePassword',
          {
            oldPwd:data.oldPwd,
            newPwd1: data.newPwd1,
            newPwd2:data.newPwd2
          },
          'post'
        )
          .then(r => {
            resolve()
          })
          .catch(e => {
            reject(e)
          })
      })
    },
    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        removeToken()
        commit('SET_USER', {})
        resolve()
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        removeToken()
        commit('SET_USER', {})
        resolve()
      })
    },
    
    // Video Menu Actions
    SetVideoMenu({ commit }, videoMenu) {
      commit('SET_VIDEOMENU', videoMenu)
    },
    
    SetIsAdmin({ commit }, isAdmin) {
      commit('SET_ISADMIN', isAdmin)
    },
    
    SetCollegeId({ commit }, collegeId) {
      commit('SET_COLLEGE_ID', collegeId)
    }
  },
  getters: {
    user: state => state.user,
    videoMenu: state => state.videoMenu,
    isAdmin: state => state.isAdmin,
    college_id: state => state.college_id
  }
}

export default user
