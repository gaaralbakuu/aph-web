import Layout from '@/views/layout/Layout.vue'
let isDevelopMode = process.env.NODE_ENV === 'development' ? true : false//保存当前环境是否为开发环境
export default {
    path: '/compliance',
    component: Layout,
    children: [
        {
            path: 'Investigation',
            component: () => import('@/views/sysbasics/compliance/Investigation.vue'),
            name: 'Investigation',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'ShareInformation',
            component: () => import('@/views/sysbasics/compliance/ShareInformation.vue'),
            name: 'ShareInformation',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'InvestigationInfo',
            component: () => import('@/views/sysbasics/compliance/InvestigationInfo.vue'),
            name: 'InvestigationInfo',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'AccountManagement',
            component: () => import('@/views/sysbasics/compliance/AccountManagement.vue'),
            name: 'AccountManagement',
            meta: {
                noCache: isDevelopMode
            }
        },

        {
            path: 'Manufacturer',
            component: () => import('@/views/sysbasics/compliance/Manufacturer.vue'),
            name: 'Manufacturer',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'Manufacturer2',
            component: () => import('@/views/sysbasics/compliance/Manufacturer2.vue'),
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
            component: () => import('@/views/sysbasics/compliance/ImproveAnalysis.vue'),
            name: 'ImproveAnalysis',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'ImproveManagement',
            component: () => import('@/views/sysbasics/compliance/ImproveManagement.vue'),
            name: 'ImproveManagement',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
          path: 'ImproveManagementInfo',
          component: () => import('@/views/sysbasics/compliance/ImproveManagementInfo.vue'),
          name: 'improveManagementInfo',
          meta: {
              noCache: isDevelopMode
          }
      },
        {
          path: 'cisbanner',
          component: () => import('@/views/sysbasics/compliance/Banner.vue'),
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
