import { setToken, removeToken } from '@/utils/auth'
import { generateTree } from '@/utils'
import api from '@/api'
import request from '@/utils/request'

const user = {
  state: {
    user: {}
  },

  mutations: {
    SET_USER: (state, user) => {
      state.user = user
    }
  },

  actions: {
    // 用户登录
    LoginByUsername({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const password = userInfo.password.trim()
      return new Promise((resolve, reject) => {
        request(
          api.auth + 'login',
          { username: username, password: password ,client:'WEB'},
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
    }
  },
  getters: {
    user: state => state.user
  }
}

export default user
