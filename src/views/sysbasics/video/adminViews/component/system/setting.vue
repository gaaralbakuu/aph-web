<template>
  <div class="setting-container">
    <div class="pageBody">
      <el-collapse v-model="activeNames">
        <el-collapse-item name="platformName">
          <template slot="title">
            <div style="font-size: 20px;font-weight: bold;">
              {{l.platformName}}
            </div>
          </template>
          <div style="text-align: right;">
            <el-button style="margin: 10px 0px;" type="primary" plain @click="updatePlatformName">
              {{l.save}}
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
import { reactive, ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import api from '@/api'
import { useLocalI18n } from '@/composables/useLocalI18n'
import store from '@/store'

const instance = getCurrentInstance()
const { $request, $message } = instance.proxy
const { l, c } = useLocalI18n('videoAdminStting')
const queryClient = useQueryClient()

// State
const activeNames = ref('platformName')
const platformName = reactive({
  "en-US": "E + learning",
  "zh-CN": "万邦线上学习平台",
  "zh-TW": "萬邦線上學習平臺",
  "vi-VN": ""
})

const platformNameForm = reactive({
  "id": "",
  "param_name": "",
  "param_type": "",
  "param_value": "",
  "param_priority": "0",
  "param_condition1": "",
  "param_condition2": "",
  "param_condition3": "",
  "remarks": "",
  "is_valid": "",
  "rec_status": "",
  "org_id": "",
  "group_id": ""
})

const isAdmin = computed(() => {
  return store.getters.isAdmin
})

// Queries
const { data: platformNameData, refetch: refetchPlatformName } = useQuery({
  queryKey: ['platformName'],
  queryFn: () => $request(api.baseUrl + "/Platform/param/getparametervalue", {
    type: "VideoSystem",
    name: "platformName"
  }),
  enabled: false
})

watch(() => platformNameData.value, (newVal) => {
  if (newVal && newVal.data.length > 0) {
    const parsedValue = JSON.parse(newVal.data[0].param_value)
    Object.assign(platformName, parsedValue)
    Object.assign(platformNameForm, newVal.data[0])
  }
})

// Mutations
const updatePlatformNameMutation = useMutation({
  mutationFn: (data) => $request(api.baseUrl + '/platform/param/update', data, 'POST'),
  onSuccess: (r) => {
    if (r.message == 'Success') {
      $message.success(l.updateSuccess)
    }
  }
})

// Functions
const getPlatformName = () => {
  refetchPlatformName()
}

const updatePlatformName = () => {
  if (platformName["zh-CN"] == "") {
    return $message.error(l.pleaseInputSimplifiedChineseName)
  }
  if (platformName["zh-TW"] == "") {
    return $message.error(l.pleaseInputTraditionalChineseName)
  }
  if (platformName["en-US"] == "") {
    return $message.error(l.pleaseInputEnglishName)
  }

  platformNameForm.param_value = JSON.stringify(platformName)
  updatePlatformNameMutation.mutate(platformNameForm)
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
