import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'

export default {
  install(app) {
    app.component('svg-icon', SvgIcon)
  },
}
