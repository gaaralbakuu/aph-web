import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store'
import { createI18n } from 'vue-i18n'

// UI and Styling
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/css/main.css' // Main css entry with Tailwind
import '@fontsource-variable/inter'
import 'font-awesome/css/font-awesome.min.css'

// i18n Languages
import zhCn from '@/lang/zh-CN.js'
import enUS from '@/lang/en-US.js'
import zhTW from '@/lang/zh-TW.js'
import viVN from './lang/vi-VN'

// App-specific Plugins
import apiPlugin from '@/plugins/api'

import icons from '@/icons' // icon
import errorLog from '@/utils/errorLog'
import '@/router/permission' // permission control

const i18n = createI18n({
  legacy: false, // Use Composition API
  locale: 'vi-VN',
  fallbackLocale: 'en-US',
  messages: {
    'zh-CN': zhCn,
    'en-US': enUS,
    'zh-TW': zhTW,
    'vi-VN': viVN,
  },
  silentTranslationWarn: true,
})

const app = createApp(App)

app.use(store)
app.use(router)
app.use(i18n)
app.use(ElementPlus)
app.use(apiPlugin)
app.use(icons)
app.use(errorLog)

app.mount('#app')