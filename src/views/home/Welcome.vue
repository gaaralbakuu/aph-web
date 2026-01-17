<template>
  <div class="welcome-container">
    <div class="welcome-text">
      {{ t('welcome.title') }}
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
defineOptions({ name: 'Welcome' })
const { t } = useI18n()
</script>

<style scoped>
.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.welcome-text {
  font-size: 24px;
  font-weight: bold;
}
</style>
