import Vue from 'vue'
import App from './App.vue'
import Cookies from 'js-cookie'
import router from '@/router'
import store from '@/store'
import request from '@/utils/request'
import api from '@/api'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import 'font-awesome/css/font-awesome.min.css' // font-awesome
import '@/styles/index.scss' // global css
import '@/router/permission' // permission control
import '@/icons' // icon
import '@/utils/errorLog'

import { setCookie, localGet, localSet } from '@/utils/auth'

import VueI18n from 'vue-i18n'
import zhCn from '@/lang/zh-CN.js'
import enUS from '@/lang/en-US.js'
import zhTW from '@/lang/zh-TW.js'
import viVN from './lang/vi-VN'

import mixinCommon from '@/mixin/mixin.js'

import '@/utils/filter'

Vue.use(VueI18n)
const i18n = new VueI18n({
  // 默认语言
  locale: 'zh-CN',
  // 引入语言文件
  messages: {
    'zh-CN': zhCn,
    'en-US': enUS,
    'zh-TW': zhTW,
    'vi-VN': viVN,
  },
  silentTranslationWarn: true,
})
Vue.mixin(mixinCommon)

Vue.use(Element, {
  size: Cookies.get('size') || 'small', // set element-ui default size [medium,small,mini]
  i18n: (key, value) => i18n.t(key, value),
})
Vue.config.productionTip = false

Vue.prototype.$request = request
Vue.prototype.$api = api

let language = localGet('lang')
if (!language) {
  language = navigator.language || navigator.browserLanguage
  if (language) localSet('lang', language)
}
if (language) i18n.locale = language

Vue.prototype._i18n = i18n
new Vue({
  i18n,
  router,
  store,
  render: (h) => h(App),
}).$mount('#app')
