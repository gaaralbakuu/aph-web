import Layout from '@/views/layout/Layout.vue'

export default {
  path: '/sysbasics',
  component: Layout,
  children: [
    {
      path: 'sysmesg',
      component: () => import('@/views/sysbasics/sysmesg.vue'),
      name: 'sysbasicssymesg',
      meta: {
        noCache: true,
      },
    },
    {
      path: 'epidemic',
      component: () => import('@/views/sysbasics/epidemic.vue'),
      name: 'sysbasicsepidemic',
      meta: {
        noCache: true,
      },
    },
    {
      path: 'publiccode',
      component: () => import('@/views/sysbasics/publiccode.vue'),
      name: 'publiccode',
      meta: {
        noCache: true,
      },
    },
  ],
}
