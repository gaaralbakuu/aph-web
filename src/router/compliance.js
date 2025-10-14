import Layout from '@/views/layout/Layout.vue'
let isDevelopMode = process.env.NODE_ENV === 'development' ? true : false//保存当前环境是否为开发环境
export default {
    path: '/compliance',
    component: Layout,
    children: [
        {
            path: 'Investigation',
            component: () => import('@/views/sysbasics/compliance/investigation.vue'),
            name: 'Investigation',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'ShareInformation',
            component: () => import('@/views/sysbasics/compliance/shareInformation.vue'),
            name: 'ShareInformation',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'InvestigationInfo',
            component: () => import('@/views/sysbasics/compliance/investigationInfo.vue'),
            name: 'InvestigationInfo',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'AccountManagement',
            component: () => import('@/views/sysbasics/compliance/accountManagement.vue'),
            name: 'AccountManagement',
            meta: {
                noCache: isDevelopMode
            }
        },

        {
            path: 'Manufacturer',
            component: () => import('@/views/sysbasics/compliance/manufacturer.vue'),
            name: 'Manufacturer',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'Manufacturer2',
            component: () => import('@/views/sysbasics/compliance/manufacturer2.vue'),
            name: 'Manufacturer2',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'Demo3',
            component: () => import('@/views/sysbasics/compliance/demo3.vue'),
            name: 'Demo3',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'ImproveAnalysis',
            component: () => import('@/views/sysbasics/compliance/improveAnalysis.vue'),
            name: 'ImproveAnalysis',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'ImproveManagement',
            component: () => import('@/views/sysbasics/compliance/improveManagement.vue'),
            name: 'ImproveManagement',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
          path: 'ImproveManagementInfo',
          component: () => import('@/views/sysbasics/compliance/improveManagementInfo.vue'),
          name: 'improveManagementInfo',
          meta: {
              noCache: isDevelopMode
          }
      },
        {
          path: 'cisbanner',
          component: () => import('@/views/sysbasics/compliance/banner.vue'),
          name: 'sysbasicscompliancebanner',
          meta: {
            noCache: true
          }
        },
        {
          path: 'cisRole',
          component: () => import('@/views/sysbasics/compliance/role.vue'),
          name: 'sysbasicscompliancerole',
          meta: {
            noCache: true
          }
        },
    ]
}
