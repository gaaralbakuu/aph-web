import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'

/* Layout */
import Layout from '@/views/layout/Layout.vue'

import admin from './admin'
import compliance from './compliance'
import compliance2 from './compliance2'
import sysbasics from './sysbasics'
import video from './video' // Thêm import video routes

const isDevelopMode = import.meta.env.DEV

const constantRouterMap = [
  {
    path: '/',
    redirect: '/home/welcome'
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
        component: () => import('@/views/home/Welcome.vue'),
        name: 'welcome',
        meta: { title: 'Welcome Page' },
      },
    ],
  },

  
  {
    path: '/examDetail',
    component: () => import('@/views/sysbasics/video/userViews/ExamDetail.vue'),
    name: 'examDetail',
    meta: { noCache: isDevelopMode }
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
        component: () => import('@/views/sysbasics/video/userViews/Home.vue'),
        name: 'videoHome',
        meta: { noCache: isDevelopMode, title: 'Video Dashboard' },
      },
      {
        path: 'trainingDetail',
        component: () => import('@/views/sysbasics/video/userViews/TrainingDetail.vue'),
        name: 'trainingDetail',
        meta: { noCache: isDevelopMode, title: 'Training Details' },
      },
      {
        path: 'topicDetail',
        component: () => import('@/views/sysbasics/video/userViews/TopicDetail.vue'),
        name: 'topicDetail',
        meta: { noCache: isDevelopMode, title: 'Topic Details' },
      },
      {
        path: 'play',
        component: () => import('@/views/sysbasics/video/userViews/Play.vue'),
        name: 'videoPlay',
        meta: { noCache: isDevelopMode, title: 'Video Player' },
      },
      {
        path: 'topic',
        component: () => import('@/views/sysbasics/video/userViews/Topic'),
        name: 'videoTopic',
        meta: { noCache: isDevelopMode, title: 'Topics' },
      },
      {
        path: 'course',
        component: () => import('@/views/sysbasics/video/userViews/Course'),
        name: 'videoCourse',
        meta: { noCache: isDevelopMode, title: 'Courses' },
      },
      {
        path: 'mine',
        component: () => import('@/views/sysbasics/video/userViews/Mine'),
        name: 'videoMine',
        meta: { noCache: isDevelopMode, title: 'My Videos' },
        children: [
          {
            path: 'training',
            component: () => import('@/views/sysbasics/video/userViews/component/Training'),
            name: 'myTraining',
            meta: { noCache: isDevelopMode, title: 'My Training' },
          },
          {
            path: 'favorite',
            component: () => import('@/views/sysbasics/video/userViews/component/Favorite'),
            name: 'myFavorite',
            meta: { noCache: isDevelopMode, title: 'Favorites' },
          },
          {
            path: 'history',
            component: () => import('@/views/sysbasics/video/userViews/component/History'),
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

export const routerVideo = video

export const noPageRoute = { path: '/:pathMatch(.*)*', redirect: { name: '404' } }

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRouterMap,
  scrollBehavior: () => ({ top: 0 }),
})

export {router};

// const routes = [
//   {
//     path: '/',
//     component: {
//       template: '<div style="color:red;font-size:30px">ROUTER OK</div>'
//     }
//   }
// ]

// const router = createRouter({
//   history: createWebHistory(),
//   routes
// })

// export default router
