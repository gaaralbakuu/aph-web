<template>
  <el-config-provider :locale="locale">
    <div id="app">
      <router-view></router-view>
    </div>
  </el-config-provider>
</template>

<script setup>
import { onMounted, onUnmounted, getCurrentInstance, computed } from 'vue'
import { ElConfigProvider } from 'element-plus'
import en from 'element-plus/es/locale/lang/en'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import zhTw from 'element-plus/es/locale/lang/zh-tw'
import vi from 'element-plus/es/locale/lang/vi'
import con from '@/config'
import { localGet } from '@/utils/auth'

const { proxy } = getCurrentInstance()

const locale = computed(() => {
  const lang = localGet('lang')
  switch (lang) {
    case 'zh-CN': return zhCn
    case 'zh-TW': return zhTw
    case 'en-US': return en
    case 'vi-VN': return vi
    default: return vi
  }
})

onMounted(() => {
  document.title = con.system.name + ' - ' + con.system.company
  // Khởi tạo dialog ESC handler if available
  if (proxy.$initDialogEscHandler) {
    proxy.$initDialogEscHandler()
  }
})

onUnmounted(() => {
  // Cleanup ESC handler
  if (proxy.$removeDialogEscHandler) {
    proxy.$removeDialogEscHandler()
  }
})
</script>
