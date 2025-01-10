import Layout from '@/views/layout/Layout'

export default {
  path: '/admin',
  component: Layout,
  children: [
    {
      path: 'menu',
      component: () => import('@/views/admin/menu'),
      name: 'adminMenu',
      meta: { noCache: true }
    },
    {
      path: 'dictionary',
      component: () => import('@/views/admin/dictionary'),
      name: 'adminDictionary',
      meta: { noCache: true }
    },
    {
      path: 'user',
      component: () => import('@/views/admin/user'),
      name: 'adminUser',
      meta: { noCache: true }
    },
    {
      path: 'role',
      component: () => import('@/views/admin/role'),
      name: 'adminRole',
      meta: { noCache: true }
    },
    {
      path: 'quartz',
      component: () => import('@/views/admin/quartz'),
      name: 'adminQuartz',
      meta: { noCache: true }
    },
    {
      path: 'param',
      component: () => import('@/views/admin/param'),
      name: 'adminParam',
      meta: { noCache: true }
    },
    {
      path: 'banner',
      component: () => import('@/views/admin/banner'),
      name: 'adminBanner',
      meta: { noCache: true }
    },
    {
      path: 'testuser',
      component: () => import('@/views/admin/testUser'),
      name: 'adminTestUser',
      meta: { noCache: true }
    },

    {
      path: 'appVersion',
      component: () => import('@/views/admin/appVersion'),
      name: 'adminAppVersion',
      meta: { noCache: true }
    },
    // 用户反馈
    {
      path: 'userfeedback',
      component: () => import('@/views/admin/userfeedback'),
      name: 'userfeedback',
      meta: { noCache: true }
    },
    {
      path: 'astrictAuth',
      component: () => import('@/views/admin/astrictAuth'),
      name: 'adminAstrictAuth',
      meta: { noCache: true }
    },
    {
      path: 'workflowFields',
      component: () => import('@/views/admin/workflowFields'),
      name: 'workflowFields',
      meta: { noCache: true }
    },
		{
		  path: 'demo',
		  component: () => import('@/views/demo/demo'),
		  name: 'userfeedback',
		  meta: { noCache: true }
		}
  ]
}
