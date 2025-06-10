import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '@/views/layout/Layout'
import SubLayout from '@/views/layout/SubLayout'

import admin from './admin'
import sysbasics from './sysbasics'
import compliance from './compliance'
import compliance2 from './compliance2'
// import compliance from './compliance'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

/**
 * 注意三级以上路由需要使用 SubLayout 无法 keeps-alive 缓存
 * 路由只建议构建两层，建议与菜单分离处理
 */

export const constantRouterMap = [
  {
    path: '/',
    redirect: '/home/welcome'
  },
  {
    path: '/login',
    component: () => import('@/views/login/index')
  },
  {
    name:'loginRegister',
    path: '/register',
    component: () => import('@/views/login/register')
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: ':path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    name: '401'
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/errorPage/404')
  },
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: 'welcome',
        component: () => import('@/views/home/welcome'),
        name: 'welcome',
        meta: { title: 'Welcome Page' }
      }
    ]
  },
  {
    path: '/example',
    component: Layout,
    children: [
      {
        path: 'icon',
        component: () => import('@/views/example/svg-icons'),
        name: 'exampleIcons',
        meta: { title: '图标' }
      }
    ]
  }
]

export const asyncRouterMap = [admin,sysbasics, compliance, compliance2]
//export const asyncRouterMap = [sysbasics]

export const noPageRoute = { path: '*', redirect: { name: '404' } }

export default new Router({
  routes: constantRouterMap,
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 })
})
