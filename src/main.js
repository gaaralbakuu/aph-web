import 'element-plus/dist/index.css'
import 'ant-design-vue/dist/reset.css'
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
import ElementPlus from 'element-plus'
import Antd from 'ant-design-vue'
import Cookies from 'js-cookie'
import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import { VueQueryPlugin } from '@tanstack/vue-query'

import api from '@/api'
import enUS from '@/lang/en-US.js'
import zhCn from '@/lang/zh-CN.js'
import zhTW from '@/lang/zh-TW.js'
import viVN from './lang/vi-VN'
import mixinCommon from '@/mixin/mixin.js'
import router from '@/router'
import store from '@/store'
import { localGet, localSet } from '@/utils/auth'
import dialogEscPlugin from '@/utils/dialogEscPlugin.js'
import request from '@/utils/request'

import App from './App.vue'

const app = createApp(App)

app.use(VueQueryPlugin)
app.use(Antd)
app.use(store)
app.use(router)

const i18n = createI18n({
  legacy: true, // Enable legacy mode for Options API support
  locale: 'vi-VN',
  messages: {
    'zh-CN': zhCn,
    'en-US': enUS,
    'zh-TW': zhTW,
    'vi-VN': viVN,
  },
  silentTranslationWarn: true,
})

app.use(i18n)

// Mixin needs to be global property or composable in Vue 3, but for compatibility we can mix it in
app.mixin(mixinCommon)

// Register updated dialogEscPlugin
app.use(dialogEscPlugin)

app.use(ElementPlus, {
  size: Cookies.get('size') || 'small',
})

// Global Properties
app.config.globalProperties.$request = request
app.config.globalProperties.$api = api
app.config.globalProperties._i18n = i18n

// Lang handling
let language = localGet('lang')
if (!language) {
  language = navigator.language || navigator.browserLanguage
  if (language) localSet('lang', language)
}
if (language) i18n.global.locale = language // In legacy mode, locale is directly accessible

app.mount('#app')
