<template>
  <div class="videoTag-container">
    <a-modal v-model="showObj.tagShow" :title="l.addTag" :ok-text="l.submit" :cancel-text="l.giveup" @ok="handleSubmit" width="600px" :maskClosable="false">
      <div class="form-container">
        <a-form layout="vertical">
          <a-form-item :label="l.name_zh">
            <a-input v-model="tagForm.name_zh" placeholder=""/>
          </a-form-item>
          <a-form-item :label="l.name_tw">
            <a-input v-model="tagForm.name_tw" placeholder=""/>
          </a-form-item>
          <a-form-item :label="l.name_en">
            <a-input v-model="tagForm.name_en" placeholder=""/>
          </a-form-item>
          <a-form-item :label="l.name_vi">
            <a-input v-model="tagForm.name_vi" placeholder=""/>
          </a-form-item>

          <div class="text-red-500 italic text-xs">
            * {{ l.validationError }}
          </div>
        </a-form>
      </div>
    </a-modal>

    <div class="pageBody">
      <div class="pageBody-filter">
        <div class="filter-form">
          <div class="filter-item">
            <span class="filter-label">{{ l.title }}:</span>
            <a-input v-model="queryParams.name" clearable @keyup.enter="refetchTagList" style="width: 200px" placeholder=""/>
          </div>
          <div class="filter-item">
            <span class="filter-label">{{ l.status }}:</span>
            <a-select v-model="queryParams.is_valid" @change="refetchTagList" style="width: 150px" placeholder="">
              <a-select-option value="">{{ c.all }}</a-select-option>
              <a-select-option value="Y">{{ l.enable }}</a-select-option>
              <a-select-option value="N">{{ l.disable }}</a-select-option>
            </a-select>
          </div>
          <a-button type="primary" @click="refetchTagList">{{ l.search }}</a-button>
        </div>
        <div>
          <a-button type="primary" @click="addTag">{{ l.addTag }}</a-button>
        </div>
      </div>

      <div class="tableContainer" ref="tableContainer">
        <a-table
          v-if="tagList && tagList.length > 0"
          :columns="tableColumns"
          :data-source="tagList"
          :pagination="tablePagination"
          @change="handleTableChange"
          :loading="tableLoading"
          :scroll="{ x: 1200 }"
          size="middle"
          :rowKey="(record, index) => record.id || index"
        >
          <template slot="statusColumn" slot-scope="text, record">
            <span :style="{ color: text === 'Y' ? 'green' : 'red' }">
              {{ text === 'Y' ? l.enable : l.disable }}
            </span>
          </template>
          <template slot="actionColumn" slot-scope="text, record">
            <a-button-group>
              <a-button type="primary" size="small" @click="modifyTag(record)">{{ c.edit }}</a-button>
              <a-button
                v-if="record.is_valid == 'N'"
                type="primary"
                size="small"
                style="background-color: seagreen; border-color: seagreen"
                @click="modifyStatus(record)"
              >
                {{ c.enable }}
              </a-button>
              <a-button v-else type="danger" size="small" @click="modifyStatus(record)">
                {{ c.disable }}
              </a-button>
            </a-button-group>
          </template>
        </a-table>
        <div v-else class="empty-state">
          {{ c.no_data || 'No data available' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import api from '@/api'
import { useLocalI18n } from '@/composables/useLocalI18n'

const instance = getCurrentInstance()
const { $request, $message, $createElement, $confirm } = instance.proxy
const { l, c } = useLocalI18n('videoAdminTag')
const queryClient = useQueryClient()

// State
const showObj = reactive({
  tagShow: false,
})

const queryParams = reactive({
  page: 1,
  pageSize: 10,
  name: '',
  is_valid: '',
})

const tagForm = reactive({
  id: '',
  name_zh: '',
  name_en: '',
  name_tw: '',
  name_vi: '',
  is_valid: '',
  rec_status: '',
})

const tablePagination = reactive({
  current: 1,
  pageSize: 10,
  total: 0,
  pageSizeOptions: ['5', '10', '15', '30', '50', '100'],
  showSizeChanger: true,
  showQuickJumper: true,
  showTotal: (total) => `Total ${total} items`,
})

const tableColumns = ref([
  {
    title: 'No',
    key: 'index',
    width: 50,
    customRender: (text, record, index) => index + 1,
  },
  {
    title: 'Name (ZH)',
    dataIndex: 'name_zh',
    key: 'name_zh',
    width: 150,
  },
  {
    title: 'Name (TW)',
    dataIndex: 'name_tw',
    key: 'name_tw',
    width: 150,
  },
  {
    title: 'Name (EN)',
    dataIndex: 'name_en',
    key: 'name_en',
    width: 150,
  },
  {
    title: 'Name (VI)',
    dataIndex: 'name_vi',
    key: 'name_vi',
    width: 150,
  },
  {
    title: 'Created',
    dataIndex: 'create_time',
    key: 'create_time',
    width: 200,
  },
  {
    title: 'Status',
    dataIndex: 'is_valid',
    key: 'is_valid',
    width: 100,
    scopedSlots: { customRender: 'statusColumn' },
  },
  {
    title: 'Action',
    key: 'action',
    width: 250,
    fixed: 'right',
    scopedSlots: { customRender: 'actionColumn' },
  },
])

// TanStack Query - Fetch tag list
const { data: tagListData, isLoading: tableLoading, refetch: refetchTagList } = useQuery({
  queryKey: ['videoTagList', queryParams],
  queryFn: async () => {
    const response = await $request(
      api.videoServer + '/Video/VideoTag/getList',
      queryParams
    )
    if (response.httpCode === 200) {
      return {
        list: response.data.list || [],
        total: response.data.total || 0,
      }
    }
    throw new Error('Failed to fetch tags')
  },
  staleTime: 1000 * 60 * 5, // 5 minutes
})

const tagList = computed(() => tagListData.value?.list || [])
const tagTotal = computed(() => tagListData.value?.total || 0)

// Update pagination total
watch(
  () => tagTotal.value,
  (newTotal) => {
    tablePagination.total = newTotal
  }
)

// TanStack Query - Add or modify tag
const { mutate: submitTag, isLoading: isSubmitting } = useMutation({
  mutationFn: async (formData) => {
    const response = await $request(
      api.videoServer + '/Video/VideoTag/addOrModifyTag',
      formData,
      'post'
    )
    if (response.httpCode === 200) {
      return response
    }
    throw new Error('Failed to submit tag')
  },
  onSuccess: () => {
    $message.success(l.value.oprateSuccess)
    showObj.tagShow = false
    queryClient.invalidateQueries({ queryKey: ['videoTagList'] })
    resetForm()
  },
  onError: (error) => {
    console.error('Error submitting tag:', error)
    $message.error(l.value.oprateSuccess)
  },
})

// TanStack Query - Update tag status
const { mutate: updateTagStatus, isLoading: isUpdatingStatus } = useMutation({
  mutationFn: async ({ key, value }) => {
    const response = await $request(
      api.videoServer + '/Video/VideoTag/EnableOrDisabledTag',
      { key, value },
      'post'
    )
    if (response.httpCode === 200) {
      return response
    }
    throw new Error('Failed to update status')
  },
  onSuccess: () => {
    $message.success(l.value.oprateSuccess)
    queryClient.invalidateQueries({ queryKey: ['videoTagList'] })
  },
  onError: (error) => {
    console.error('Error updating status:', error)
    $message.error('Failed to update status')
  },
})

// Methods
const updateColumnTitles = () => {
  tableColumns.value = tableColumns.value.map((col) => {
    switch (col.key) {
      case 'name_zh':
        col.title = l.value.name_zh || 'Name (ZH)'
        break
      case 'name_tw':
        col.title = l.value.name_tw || 'Name (TW)'
        break
      case 'name_en':
        col.title = l.value.name_en || 'Name (EN)'
        break
      case 'name_vi':
        col.title = l.value.name_vi || 'Name (VI)'
        break
      case 'create_time':
        col.title = l.value.create_time || 'Created'
        break
      case 'is_valid':
        col.title = l.value.status || 'Status'
        break
      case 'action':
        col.title = l.value.oprate || 'Action'
        break
    }
    return col
  })
}

const handleTableChange = (pagination) => {
  tablePagination.current = pagination.current
  tablePagination.pageSize = pagination.pageSize
  queryParams.page = pagination.current
  queryParams.pageSize = pagination.pageSize
  refetchTagList()
}

const resetForm = () => {
  tagForm.id = ''
  tagForm.name_zh = ''
  tagForm.name_en = ''
  tagForm.name_tw = ''
  tagForm.name_vi = ''
  tagForm.is_valid = ''
  tagForm.rec_status = ''
}

const addTag = () => {
  resetForm()
  showObj.tagShow = true
}

const modifyTag = (data) => {
  Object.assign(tagForm, data)
  showObj.tagShow = true
}

const modifyStatus = (record) => {
  const currentStatus = record.is_valid
  const value = currentStatus === 'N' ? 'Y' : 'N'
  const oprate = currentStatus === 'N' ? c.value.enable : c.value.disable
  const name = record.name_zh || record.name_en || record.name_vi || 'Record'

  const h = $createElement
  $confirm({
    title: l.value.confirmTips || 'Confirm',
    content: h('div', [h('p', `${oprate}《${name}》?`)]),
    okText: l.value.confirmtext || 'Yes',
    cancelText: l.value.cancelText || 'No',
    onOk: () => {
      updateTagStatus({ key: record.id, value })
    },
    onCancel: () => {
      console.log('Cancel operation')
    },
  })
}

const handleSubmit = () => {
  // Kiểm tra validation - ít nhất một trường ngôn ngữ phải được điền
  const hasValidLanguage =
    tagForm.name_zh.trim() !== '' ||
    tagForm.name_tw.trim() !== '' ||
    tagForm.name_en.trim() !== '' ||
    tagForm.name_vi.trim() !== ''

  if (!hasValidLanguage) {
    $message.warning(l.value.validationError)
    return
  }

  if (tagForm.id === '') {
    tagForm.rec_status = 1
  }

  submitTag(tagForm)
}

// Watch language change
watch(
  () => instance.proxy.$i18n.locale,
  () => {
    updateColumnTitles()
  }
)

onMounted(() => {
  updateColumnTitles()
  refetchTagList()
})
</script>

<style scoped>
.videoTag-container {
  width: 100%;
  height: 100%;
  padding: 0;
}

.videoTag-container .pageBody {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.videoTag-container .pageBody .pageBody-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 14px;
  height: auto;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-form {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  white-space: nowrap;
  font-weight: 500;
}

.videoTag-container .pageBody .tableContainer {
  width: 100%;
  flex: 1;
  overflow: auto;
  padding: 12px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #999;
  font-size: 14px;
}

/deep/ .ant-table {
  font-size: 14px;
}

/deep/ .ant-table-thead > tr > th {
  background-color: #f2f4f9;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
}

/deep/ .ant-table-tbody > tr > td {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

/deep/ .ant-table-tbody > tr:hover > td {
  background-color: #fafafa;
}

/deep/ .ant-pagination {
  margin-top: 12px;
  text-align: right;
}

.form-container {
  padding: 12px;
}

/deep/ .ant-form-item {
  margin-bottom: 16px;
}

/deep/ .ant-modal-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

/deep/ .ant-modal-title {
  font-size: 16px;
  font-weight: 600;
}

/deep/ .ant-btn-group {
  display: flex;
  gap: 8px;
}

/deep/ .ant-btn-group > .ant-btn {
  flex: 1;
  min-width: 60px;
}
</style>
