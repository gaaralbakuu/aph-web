import Layout from '@/views/layout/Layout'
let isDevelopMode = process.env.NODE_ENV === 'development' ? true : false//保存当前环境是否为开发环境
export default {
    path: '/compliance',
    component: Layout,
    children: [
        {
            path: 'Investigation',
            component: () => import('@/views/sysbasics/compliance/Investigation'),
            name: 'Investigation',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'ShareInformation',
            component: () => import('@/views/sysbasics/compliance/ShareInformation'),
            name: 'ShareInformation',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'InvestigationInfo',
            component: () => import('@/views/sysbasics/compliance/InvestigationInfo'),
            name: 'InvestigationInfo',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'AccountManagement',
            component: () => import('@/views/sysbasics/compliance/AccountManagement'),
            name: 'AccountManagement',
            meta: {
                noCache: isDevelopMode
            }
        },

        {
            path: 'Manufacturer',
            component: () => import('@/views/sysbasics/compliance/Manufacturer'),
            name: 'Manufacturer',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'Manufacturer2',
            component: () => import('@/views/sysbasics/compliance/Manufacturer2'),
            name: 'Manufacturer2',
            meta: {
                noCache: isDevelopMode
            }
        },
        // {
        //     path: 'Demo3',
        //     component: () => import('@/views/sysbasics/compliance/demo3'),
        //     name: 'Demo3',
        //     meta: {
        //         noCache: isDevelopMode
        //     }
        // },
        {
            path: 'ImproveAnalysis',
            component: () => import('@/views/sysbasics/compliance/ImproveAnalysis'),
            name: 'ImproveAnalysis',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'ImproveManagement',
            component: () => import('@/views/sysbasics/compliance/ImproveManagement'),
            name: 'ImproveManagement',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
          path: 'ImproveManagementInfo',
          component: () => import('@/views/sysbasics/compliance/ImproveManagementInfo'),
          name: 'improveManagementInfo',
          meta: {
              noCache: isDevelopMode
          }
      },
        {
          path: 'cisbanner',
          component: () => import('@/views/sysbasics/compliance/Banner'),
          name: 'sysbasicscompliancebanner',
          meta: {
            noCache: true
          }
        },
        {
          path: 'cisRole',
          component: () => import('@/views/sysbasics/compliance/Role.vue'),
          name: 'sysbasicscompliancerole',
          meta: {
            noCache: true
          }
        },
    ]
}
