import router from './index'
import store from '../store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/register'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  NProgress.start() // start progress bar
  if (getToken()) {
    // determine if there has token
    /* has token */
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is homepage will not trigger afterEach hook, so manually handle it
    } else {
      if (!store.getters.user || !store.getters.user.userId) {
        // Check if user info is loaded
        try {
          await store.dispatch('GetUserInfo')
          await store.dispatch('GenerateRoutes', store.getters.user)

          store.getters.addRouters.forEach(route => {
            router.addRoute(route)
          })

          next({ ...to, replace: true })
        } catch (error) {
          console.error('Failed to get user info:', error)
          await store.dispatch('FedLogOut')
          // Optionally, show an error message to the user
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      } else {
        next()
      }
    }
  } else {
    /* has no token */
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      next(`/login?redirect=${to.path}`) // otherwise all redirect to login page
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
