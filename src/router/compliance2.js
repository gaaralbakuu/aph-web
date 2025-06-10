import Layout from '@/views/layout/Layout'
let isDevelopMode = process.env.NODE_ENV === 'development' ? true : false//保存当前环境是否为开发环境
export default {
    path: '/compliance2',
    component: Layout,
    children: [
        {
            path: 'complianceManufacturer',
            component: () => import('@/views/sysbasics/compliance2/complianceManufacturer'),
            name: 'complianceManufacturer',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'investigation',
            component: () => import('@/views/sysbasics/compliance2/investigation'),
            name: 'investigation',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'investigationInfo',
            component: () => import('@/views/sysbasics/compliance2/investigationInfo'),
            name: 'investigationInfo',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'issuesType',
            component: () => import('@/views/sysbasics/compliance2/issuesType'),
            name: 'issuesType',
            meta: {
                noCache: isDevelopMode
            }
        },
        {
            path: 'shareInformation',
            component: () => import('@/views/sysbasics/compliance2/shareInformation'),
            name: 'shareInformation',
            meta: {
                noCache: isDevelopMode
            }
        },
    ]
}