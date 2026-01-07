<template>
  <div class="setting-container">
    <div class="pageBody">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="platformName">
          <template #title>
            <div style="font-size: 20px; font-weight: bold">
              {{ l.platformName }}
            </div>
          </template>
          <div style="text-align: right">
            <el-button style="margin: 10px 0px" type="primary" plain @click="updatePlatformName">
              {{ l.save }}
            </el-button>
          </div>
          <el-form label-width="80px" label-position="left">
            <el-form-item :label="l.simplifiedChineseName">
              <el-input v-model="platformName['zh-CN']"></el-input>
            </el-form-item>
            <el-form-item :label="l.traditionalChineseName">
              <el-input v-model="platformName['zh-TW']"></el-input>
            </el-form-item>
            <el-form-item :label="l.englishName">
              <el-input v-model="platformName['en-US']"></el-input>
            </el-form-item>
            <el-form-item :label="l.vietnameseName">
              <el-input v-model="platformName['vi-VN']"></el-input>
            </el-form-item>
          </el-form>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance } from 'vue'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { l, c } = useLocalI18n('videoAdminStting')
const { proxy } = getCurrentInstance()

const isAdmin = computed(() => proxy.$store.getters.isAdmin)

const activeNames = ref('platformName')
const platformName = reactive({
  'en-US': 'E + learning',
  'zh-CN': '万邦线上学习平台',
  'zh-TW': '萬邦線上學習平臺',
})
const platformNameForm = reactive({
  id: '',
  param_name: '',
  param_type: '',
  param_value: '',
  param_priority: '0',
  param_condition1: '',
  param_condition2: '',
  param_condition3: '',
  remarks: '',
  is_valid: '',
  rec_status: '',
  org_id: '',
  group_id: '',
})

const getPlatformName = () => {
  proxy
    .$request(proxy.$api.baseUrl + '/Platform/param/getparametervalue', {
      type: 'VideoSystem',
      name: 'platformName',
    })
    .then((r) => {
      if (r.data.length > 0) {
        Object.assign(platformName, JSON.parse(r.data[0].param_value))
        Object.assign(platformNameForm, r.data[0])
      }
    })
}

const updatePlatformName = () => {
  if (platformName['zh-CN'] == '') {
    return proxy.$message.error(l.value.pleaseInputSimplifiedChineseName)
  }
  if (platformName['zh-TW'] == '') {
    return proxy.$message.error(l.value.pleaseInputTraditionalChineseName)
  }
  if (platformName['en-US'] == '') {
    return proxy.$message.error(l.value.pleaseInputEnglishName)
  }

  platformNameForm.param_value = JSON.stringify(platformName)
  proxy.$request(proxy.$api.baseUrl + '/platform/param/update', platformNameForm, 'POST').then((r) => {
    if (r.message == 'Success') {
      proxy.$message({
        type: 'success',
        message: l.value.updateSuccess,
      })
    }
  })
}

onMounted(() => {
  getPlatformName()
})
</script>
<style scoped>
.setting-container {
  width: 100%;
  height: 100%;
  background-color: white;
}

.setting-container .pageBody {
  width: 100%;
  height: 100%;
  padding: 20px;
}
</style>
