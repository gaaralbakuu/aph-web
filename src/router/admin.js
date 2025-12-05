import Layout from '@/views/layout/Layout'

export default {
  path: '/admin',
  component: Layout,
  children: [
    {
      path: 'menu',
      component: () => import('@/views/admin/Menu'),
      name: 'adminMenu',
      meta: { noCache: true }
    },
    {
      path: 'dictionary',
      component: () => import('@/views/admin/Dictionary'),
      name: 'adminDictionary',
      meta: { noCache: true }
    },
    {
      path: 'user',
      component: () => import('@/views/admin/User'),
      name: 'adminUser',
      meta: { noCache: true }
    },
    {
      path: 'role',
      component: () => import('@/views/admin/Role'),
      name: 'adminRole',
      meta: { noCache: true }
    },
    {
      path: 'quartz',
      component: () => import('@/views/admin/Quartz'),
      name: 'adminQuartz',
      meta: { noCache: true }
    },
    {
      path: 'param',
      component: () => import('@/views/admin/Param'),
      name: 'adminParam',
      meta: { noCache: true }
    },
    {
      path: 'banner',
      component: () => import('@/views/admin/Banner'),
      name: 'adminBanner',
      meta: { noCache: true }
    },
    {
      path: 'testuser',
      component: () => import('@/views/admin/TestUser'),
      name: 'adminTestUser',
      meta: { noCache: true }
    },

    {
      path: 'appVersion',
      component: () => import('@/views/admin/AppVersion'),
      name: 'adminAppVersion',
      meta: { noCache: true }
    },
    // 用户反馈
    {
      path: 'userfeedback',
      component: () => import('@/views/admin/UserFeedback'),
      name: 'userfeedback',
      meta: { noCache: true }
    },
    {
      path: 'astrictAuth',
      component: () => import('@/views/admin/AstrictAuth'),
      name: 'adminAstrictAuth',
      meta: { noCache: true }
    },
    {
      path: 'workflowFields',
      component: () => import('@/views/admin/WorkflowFields'),
      name: 'workflowFields',
      meta: { noCache: true }
    },
		// {
		//   path: 'demo',
		//   component: () => import('@/views/demo/demo'),
		//   name: 'userfeedback',
		//   meta: { noCache: true }
		// },
		{
		  path: 'dialog-stack-demo',
		  component: () => import('@/views/_common/DialogStackDemo'),
		  name: 'DialogStackDemo',
		  meta: { noCache: true, title: 'Dialog Stack Demo' }
		}
  ]
}
