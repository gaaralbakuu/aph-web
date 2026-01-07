import 'nprogress/nprogress.css' // progress bar style

import NProgress from 'nprogress' // progress bar
import { ElMessage } from 'element-plus'

import { getToken } from '@/utils/auth' // getToken from cookie

import { useUserStore } from '@/stores/user'
import { usePermissionStore } from '@/stores/permission'
import { router } from './index'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/register', '/examDetail', '/videoLayout/home'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  NProgress.start() // start progress bar
  
  if (getToken()) {
    // determine if there has token
    /* has token */
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is homepage will not trigger afterEach hook, so manually handle it
    } else {
      const userStore = useUserStore()
      const permissionStore = usePermissionStore()
      
      if (!userStore.user.userId) {
        // Kiểm tra xem đã load user info chưa
        try {
          // Lấy thông tin user
          await userStore.getUserInfo()
          
          // Generate routes dựa trên quyền
          await permissionStore.generateRoutes(userStore.user)
          
          // Thêm dynamic routes vào router
          permissionStore.addRouters.forEach((route) => {
            const exists = router.getRoutes().some((r) => r.path === route.path)
            if (!exists) router.addRoute(route)
          })
          
          // Đảm bảo addRoute hoàn thành trước khi navigate
          next({ ...to, replace: true })
        } catch (err) {
          console.error(err)
          // Xử lý lỗi xác thực
          await userStore.fedLogout()
          ElMessage.error('用户身份验证失败，请重新登录')
          next({ path: '/' })
        }
      } else {
        next()
      }
    }
  } else {
    /* has no token */
    if (whiteList.indexOf(to.path) !== -1) {
      // Trong whitelist, cho phép truy cập
      next()
    } else {
      next(`/login?redirect=${to.path}`) // Redirect đến trang login
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
