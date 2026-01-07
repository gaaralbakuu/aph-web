import Layout from '@/views/layout/Layout.vue'

export default {
  path: '/sysbasics',
  component: Layout,
  children: [
    {
      path: 'sysmesg',
      component: () => import('@/views/sysbasics/SysMsg.vue'),
      name: 'sysbasicssymesg',
      meta: {
        noCache: true,
      },
    },
    {
      path: 'epidemic',
      component: () => import('@/views/sysbasics/Epidemic.vue'),
      name: 'sysbasicsepidemic',
      meta: {
        noCache: true,
      },
    },
    {
      path: 'publiccode',
      component: () => import('@/views/sysbasics/PublicCode.vue'),
      name: 'publiccode',
      meta: {
        noCache: true,
      },
    },
  ],
}
