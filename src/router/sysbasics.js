import Layout from '@/views/layout/Layout'

export default {
  path: '/sysbasics',
  component: Layout,
  children: [
    {
      path: 'sysmesg',
      component: () => import('@/views/sysbasics/SysMsg'),
      name: 'sysbasicssymesg',
      meta: {
        noCache: true,
      },
    },
    {
      path: 'epidemic',
      component: () => import('@/views/sysbasics/Epidemic'),
      name: 'sysbasicsepidemic',
      meta: {
        noCache: true,
      },
    },
    {
      path: 'publiccode',
      component: () => import('@/views/sysbasics/PublicCode'),
      name: 'publiccode',
      meta: {
        noCache: true,
      },
    },
  ],
}
