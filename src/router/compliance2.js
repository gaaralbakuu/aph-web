import Layout from '@/views/layout/Layout.vue'
let isDevelopMode = process.env.NODE_ENV === 'development' ? true : false//保存当前环境是否为开发环境
export default {
    path: '/compliance2',
    component: Layout,
    children: [
        {
            path: 'complianceManufacturer',
            component: () => import('@/views/sysbasics/compliance2/ComplianceManufacturer.vue'),
            name: 'complianceManufacturer',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'investigation',
            component: () => import('@/views/sysbasics/compliance2/Investigation.vue'),
            name: 'investigation',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'investigationInfo',
            component: () => import('@/views/sysbasics/compliance2/InvestigationInfo.vue'),
            name: 'investigationInfo',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'issuesType',
            component: () => import('@/views/sysbasics/compliance2/IssuesType.vue'),
            name: 'issuesType',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'shareInformation',
            component: () => import('@/views/sysbasics/compliance2/ShareInformation.vue'),
            name: 'shareInformation',
            meta: {
                noCache: isDevelopMode
            }
        },
    ]
}