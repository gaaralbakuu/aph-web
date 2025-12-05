import 'nprogress/nprogress.css' // progress bar style

import NProgress from 'nprogress' // progress bar
import Vue from 'vue'

import { getToken } from '@/utils/auth' // getToken from cookie

import store from '../store'
import router from './index'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/register'] // no redirect whitelist

router.beforeEach((to, from, next) => {
  NProgress.start() // start progress bar
  if (getToken()) {
    // determine if there has token
    /* has token */
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is homepage will not trigger	afterEach hook, so manually handle it
    } else {
      if (!store.getters.user.userId) {
        // 判断当前用户是否已拉取完user_info信息
        store
          .dispatch('GetUserInfo')
          .then((res) => {
            // 拉取user_info
            store
              .dispatch('GenerateRoutes', store.getters.user)
              .then(() => {
                // console.log(router, store.getters.addRouters)
                // router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                Array.from(store.getters.addRouters).forEach((route) => {
                  const exists = router.getRoutes().some((r) => r.path === route.path)
                  if (!exists) router.addRoute(route)
                })
                next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
              })
              .catch((e) => {
                console.info(e)
              })
          })
          .catch((err) => {
            console.log(err)
            store.dispatch('FedLogOut').then(() => {
              Vue.prototype.$message.error('用户身份验证失败，请重新登录')
              next({ path: '/' })
            })
          })
      } else {
        next()
      }
    }
  } else {
    /* has no token */
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
