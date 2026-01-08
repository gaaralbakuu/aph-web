import 'element-plus/dist/index.css'
import 'ant-design-vue/dist/reset.css'
import '@fontsource/momo-signature'
import '@fontsource/momo-trust-display'
import '@fontsource/momo-trust-sans'
import 'font-awesome/css/font-awesome.min.css' // font-awesome
import '@/styles/index.css' // global css
import '@/router/permission' // permission control
import { SvgIcon } from '@/icons' // icon component
import { initErrorHandler } from '@/utils/errorLog' // error handler
import { datetime } from '@/utils/filter'
// Import HLS debug utilities (available in window scope)
import '@/utils/hls-debug'

import '@/assets/css/tailwind.css'
import ElementPlus from 'element-plus'
import Antd from 'ant-design-vue'
import Cookies from 'js-cookie'
import { createApp } from 'vue'
import Viewer from 'v-viewer'
// import 'viewerjs/dist/viewer.css'
import { createI18n } from 'vue-i18n'
import { VueQueryPlugin } from '@tanstack/vue-query'

import api from '@/api'
import enUS from '@/lang/en-US.js'
import zhCn from '@/lang/zh-CN.js'
import zhTW from '@/lang/zh-TW.js'
import viVN from './lang/vi-VN.js'
import mixinCommon from '@/mixin/mixin.js'
import { router } from '@/router'
import store from '@/store'
import { localGet, localSet } from '@/utils/auth'
import dialogEscPlugin from '@/utils/dialogEscPlugin.js'
import request from '@/utils/request'

import App from './App.vue'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

// Register SvgIcon globally
app.component('svg-icon', SvgIcon)

// Initialize error handler
initErrorHandler(app)

app.use(Viewer, {
  defaultOptions: {
    zIndex: 999999,
  },
})

app.config.globalProperties.$filters = {
  datetime,
}

app.use(VueQueryPlugin)
app.use(Antd)
app.use(store)
app.use(router)
app.use(pinia)

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

// DEPRECATED MIXIN - Using computed properties for backwards compatibility
// New components should use useLocalI18n composable instead
// This mixin provides `l` and `c` as computed properties (not $l, $c)
// app.mixin(mixinCommon)

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
