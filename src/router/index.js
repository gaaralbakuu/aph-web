import Vue from 'vue'
import Router from 'vue-router'

/* Layout */
import Layout from '@/views/layout/Layout.vue'

import admin from './admin'
import compliance from './compliance'
import compliance2 from './compliance2'
import sysbasics from './sysbasics'
import video from './video' // Thêm import video routes
// import compliance from './compliance'

Vue.use(Router)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch((err) => err)
}

const isDevelopMode = import.meta.env.DEV

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
        path: ':path*',
        component: () => import('@/views/redirect/index'),
      },
    ],
  },
  {
    path: '/401',
    component: () => import('@/views/errorPage/401'),
    name: '401',
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/errorPage/404'),
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

  // User Video Layout
  {
    path: '/videoLayout',
    component: () => import('@/views/sysbasics/video/layout/videoUserLayout.vue'),
    name: 'videoLayout',
    meta: { noCache: isDevelopMode },
    children: [
      {
        path: 'home',
        component: () => import('@/views/sysbasics/video/userViews/home.vue'),
        name: 'videoHome',
        meta: { noCache: isDevelopMode, title: 'Video Dashboard' },
      },
      {
        path: 'trainingDetail',
        component: () => import('@/views/sysbasics/video/userViews/trainingDetail.vue'),
        name: 'trainingDetail',
        meta: { noCache: isDevelopMode, title: 'Training Details' },
      },
      {
        path: 'topicDetail',
        component: () => import('@/views/sysbasics/video/userViews/topicDetail.vue'),
        name: 'topicDetail',
        meta: { noCache: isDevelopMode, title: 'Topic Details' },
      },
      {
        path: 'play',
        component: () => import('@/views/sysbasics/video/userViews/play.vue'),
        name: 'videoPlay',
        meta: { noCache: isDevelopMode, title: 'Video Player' },
      },
      {
        path: 'topic',
        component: () => import('@/views/sysbasics/video/userViews/topic.vue'),
        name: 'videoTopic',
        meta: { noCache: isDevelopMode, title: 'Topics' },
      },
      {
        path: 'course',
        component: () => import('@/views/sysbasics/video/userViews/course.vue'),
        name: 'videoCourse',
        meta: { noCache: isDevelopMode, title: 'Courses' },
      },
      {
        path: 'mine',
        component: () => import('@/views/sysbasics/video/userViews/mine.vue'),
        name: 'videoMine',
        meta: { noCache: isDevelopMode, title: 'My Videos' },
        children: [
          {
            path: 'training',
            component: () => import('@/views/sysbasics/video/userViews/component/training.vue'),
            name: 'myTraining',
            meta: { noCache: isDevelopMode, title: 'My Training' },
          },
          {
            path: 'favorite',
            component: () => import('@/views/sysbasics/video/userViews/component/favorite.vue'),
            name: 'myFavorite',
            meta: { noCache: isDevelopMode, title: 'Favorites' },
          },
          {
            path: 'history',
            component: () => import('@/views/sysbasics/video/userViews/component/history.vue'),
            name: 'myHistory',
            meta: { noCache: isDevelopMode, title: 'Watch History' },
          },
        ],
      },
    ],
  },
]

export { constantRouterMap }

export const asyncRouterMap = [admin, sysbasics, compliance, compliance2] // Thêm video vào asyncRouterMap
//export const asyncRouterMap = [sysbasics]

export const routerVideo = video // Xuất khẩu riêng lẻ cho các tuyến video

export const noPageRoute = { path: '*', redirect: { name: '404' } }

export default new Router({
  routes: constantRouterMap, // Thêm routerVideo vào routes mặc định
  mode: 'hash',
  scrollBehavior: () => ({ y: 0 }),
})
