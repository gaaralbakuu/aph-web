import Layout from '@/views/layout/Layout'

export default {
	path: '/sysbasics',
	component: Layout,
	children: [{
			path: 'sysmesg',
			component: () => import('@/views/sysbasics/sysmesg'),
			name: 'sysbasicssymesg',
			meta: {
				noCache: true
			}
		},
		{
			path: 'epidemic',
			component: () => import('@/views/sysbasics/epidemic'),
			name: 'sysbasicsepidemic',
			meta: {
				noCache: true
			}
		},
		{
			path: 'publiccode',
			component: () => import('@/views/sysbasics/publiccode'),
			name: 'publiccode',
			meta: {
				noCache: true
			}
		}
	]
}
