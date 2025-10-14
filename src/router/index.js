import { createRouter, createWebHashHistory } from 'vue-router'

/* Layout */
import Layout from '@/views/layout/Layout.vue'

import admin from './admin'
import sysbasics from './sysbasics'
import compliance from './compliance'
import compliance2 from './compliance2'
import video from './video'

const constantRouterMap = [
  {
    path: '/',
    redirect: '/home/welcome',
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
  },
  {
    name: 'loginRegister',
    path: '/register',
    component: () => import('@/views/login/register.vue'),
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: ':path(.*)',
        component: () => import('@/views/redirect/index.vue'),
      },
    ],
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401.vue'),
    name: '401',
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/errorPage/404.vue'),
  },
  {
    path: '/home',
    component: Layout,
    children: [
      {
        path: 'welcome',
        component: () => import('@/views/home/welcome.vue'),
        name: 'welcome',
        meta: { title: 'Welcome Page' },
      },
    ],
  },
  {
    path: '/example',
    component: Layout,
    children: [
      {
        path: 'icon',
        component: () => import('@/views/example/svg-icons/index.vue'),
        name: 'exampleIcons',
        meta: { title: '图标' },
      },
    ],
  },
]

export { constantRouterMap }

export const asyncRouterMap = [admin, sysbasics, compliance, compliance2]

export const routerVideo = video

export const noPageRoute = { path: '/:pathMatch(.*)*', redirect: { name: '404' } }

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRouterMap,
  scrollBehavior: () => ({ left: 0, top: 0 }),
})

const originalPush = router.push
router.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

export default router
