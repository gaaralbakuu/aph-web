import Layout from '@/views/layout/Layout.vue'

export default {
  path: '/admin',
  component: Layout,
  children: [
    {
      path: 'menu',
      component: () => import('@/views/admin/Menu.vue'),
      name: 'adminMenu',
      meta: { noCache: true }
    },
    {
      path: 'dictionary',
      component: () => import('@/views/admin/Dictionary.vue'),
      name: 'adminDictionary',
      meta: { noCache: true }
    },
    {
      path: 'user',
      component: () => import('@/views/admin/User.vue'),
      name: 'adminUser',
      meta: { noCache: true }
    },
    {
      path: 'role',
      component: () => import('@/views/admin/Role.vue'),
      name: 'adminRole',
      meta: { noCache: true }
    },
    {
      path: 'quartz',
      component: () => import('@/views/admin/Quartz.vue'),
      name: 'adminQuartz',
      meta: { noCache: true }
    },
    {
      path: 'param',
      component: () => import('@/views/admin/Param.vue'),
      name: 'adminParam',
      meta: { noCache: true }
    },
    {
      path: 'banner',
      component: () => import('@/views/admin/Banner.vue'),
      name: 'adminBanner',
      meta: { noCache: true }
    },
    {
      path: 'testuser',
      component: () => import('@/views/admin/TestUser.vue'),
      name: 'adminTestUser',
      meta: { noCache: true }
    },

    {
      path: 'appVersion',
      component: () => import('@/views/admin/AppVersion.vue'),
      name: 'adminAppVersion',
      meta: { noCache: true }
    },
    // 用户反馈
    {
      path: 'userfeedback',
      component: () => import('@/views/admin/UserFeedback.vue'),
      name: 'userfeedback',
      meta: { noCache: true }
    },
    {
      path: 'astrictAuth',
      component: () => import('@/views/admin/AstrictAuth.vue'),
      name: 'adminAstrictAuth',
      meta: { noCache: true }
    },
    {
      path: 'workflowFields',
      component: () => import('@/views/admin/WorkflowFields.vue'),
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
		  component: () => import('@/views/_common/DialogStackDemo.vue'),
		  name: 'DialogStackDemo',
		  meta: { noCache: true, title: 'Dialog Stack Demo' }
		}
  ]
}
