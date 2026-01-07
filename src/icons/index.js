import SvgIcon from '@/components/SvgIcon/index.vue'// svg组件

// Load all SVG files
const svgModules = import.meta.glob('./svg/*.svg')
for (const path in svgModules) {
  svgModules[path]()
}

// Export SvgIcon for registration in main.js
export { SvgIcon }
