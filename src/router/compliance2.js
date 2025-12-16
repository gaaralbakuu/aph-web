import Layout from '@/views/layout/Layout'
let isDevelopMode = process.env.NODE_ENV === 'development' ? true : false//保存当前环境是否为开发环境
export default {
    path: '/compliance2',
    component: Layout,
    children: [
        {
            path: 'complianceManufacturer',
        component: () => import("@/views/sysbasics/compliance2/complianceManufacturer.vue"),
            name: 'complianceManufacturer',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'investigation',
        component: () => import("@/views/sysbasics/compliance2/investigation.vue"),
            name: 'investigation',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'investigationInfo',
            component: () => import('@/views/sysbasics/compliance2/InvestigationInfo'),
            name: 'investigationInfo',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'issuesType',
            component: () => import('@/views/sysbasics/compliance2/IssuesType'),
            name: 'issuesType',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'shareInformation',
            component: () => import('@/views/sysbasics/compliance2/ShareInformation'),
            name: 'shareInformation',
            meta: {
                noCache: isDevelopMode
            }
        },
    ]
}