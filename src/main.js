import 'element-ui/lib/theme-chalk/index.css'
import 'ant-design-vue/dist/antd.css'
import '@fontsource/momo-signature';
import '@fontsource/momo-trust-display';
import '@fontsource/momo-trust-sans';
import 'font-awesome/css/font-awesome.min.css' // font-awesome
import '@/styles/index.css' // global css
import '@/router/permission' // permission control
import '@/icons' // icon
import '@/utils/errorLog'
import '@/utils/filter'
// Import HLS debug utilities (available in window scope)
import '@/utils/hls-debug'

import '@/assets/css/tailwind.css'
import Element from 'element-ui'
import Antd from 'ant-design-vue'
// import VueCompositionAPI from '@vue/composition-api'
import Cookies from 'js-cookie'
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { VueQueryPlugin } from '@tanstack/vue-query'

import api from '@/api'
import enUS from '@/lang/en-US.js'
import zhCn from '@/lang/zh-CN.js'
import zhTW from '@/lang/zh-TW.js'
import viVN from './lang/vi-VN'
import mixinCommon from '@/mixin/mixin.js'
import router from '@/router'
import store from '@/store'
import { localGet, localSet, setCookie } from '@/utils/auth'
import dialogEscPlugin from '@/utils/dialogEscPlugin.js'
import request from '@/utils/request'

import App from './App.vue'


// Vue.use(VueCompositionAPI)
Vue.use(VueI18n)
Vue.use(VueQueryPlugin)
Vue.use(Antd)
const i18n = new VueI18n({
  // 默认语言
  locale: 'vi-VN',
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
Vue.use(dialogEscPlugin)

Vue.use(Element, {
  size: Cookies.get('size') || 'small', // set element-ui default size [medium,small,mini]
  i18n: (key, value) => {
    console.log(key, value)

    return i18n.t(key, value)
  },
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
