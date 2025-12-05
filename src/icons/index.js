import Vue from 'vue'

import SvgIcon from '@/components/SvgIcon'// svg组件

// register globally
Vue.component('svg-icon', SvgIcon)

const svgModules = import.meta.glob('./svg/*.svg')
for (const path in svgModules) {
  svgModules[path]()
}
