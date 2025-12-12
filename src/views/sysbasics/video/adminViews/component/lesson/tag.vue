<template>
  <div class="flex flex-col flex-1 overflow-hidden">
    <!-- Modal thêm/chỉnh sửa tag -->
    <a-modal v-model="showObj.tagShow" :title="l.addTag" :ok-text="l.submit" :cancel-text="l.giveup" @ok="handleSubmit" width="600px" :maskClosable="false">
      <div class="p-3">
        <a-form layout="vertical">
          <a-form-item :label="l.name_zh">
            <a-input v-model="tagForm.name_zh" placeholder="" />
          </a-form-item>
          <a-form-item :label="l.name_tw">
            <a-input v-model="tagForm.name_tw" placeholder="" />
          </a-form-item>
          <a-form-item :label="l.name_en">
            <a-input v-model="tagForm.name_en" placeholder="" />
          </a-form-item>
          <a-form-item :label="l.name_vi">
            <a-input v-model="tagForm.name_vi" placeholder="" />
          </a-form-item>

          <div class="text-red-500 italic text-xs">* {{ l.validationError }}</div>
        </a-form>
      </div>
    </a-modal>

    <!-- Confirm Dialog Modal -->
    <div v-if="showObj.confirmShow" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black/50" @click="handleConfirmCancel"></div>
      <div class="relative bg-white rounded-lg shadow-lg p-6 max-w-sm mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">{{ showObj.confirmData.title }}</h3>
        <p class="text-gray-700 mb-6">{{ showObj.confirmData.message }}</p>
        <div class="flex justify-end gap-3">
          <button @click="handleConfirmCancel" class="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium transition-colors">
            {{ l.giveup || 'Cancel' }}
          </button>
          <button @click="handleConfirmOk" class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 font-medium transition-colors">
            {{ l.submit || 'OK' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main content -->
    <div class="flex-1 bg-white flex flex-col overflow-hidden">
      <!-- Filter header -->
      <div class="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-6 py-4 flex justify-between items-center gap-4 flex-wrap shadow-sm">
        <div class="flex gap-4 items-center flex-wrap">
          <div class="flex items-center gap-3">
            <span class="whitespace-nowrap font-semibold text-gray-700">{{ l.title }}:</span>
            <a-input v-model="queryParams.name" clearable @keyup.enter="refetchTagList" class="w-56" placeholder="Search tags..." />
          </div>
          <div class="flex items-center gap-3">
            <span class="whitespace-nowrap font-semibold text-gray-700">{{ l.status }}:</span>
            <a-select v-model="queryParams.is_valid" @change="refetchTagList" class="w-44" placeholder="All">
              <a-select-option value="">{{ c.all }}</a-select-option>
              <a-select-option value="Y">{{ l.enable }}</a-select-option>
              <a-select-option value="N">{{ l.disable }}</a-select-option>
            </a-select>
          </div>
          <a-button type="primary" @click="refetchTagList" class="transition-all hover:shadow-md">{{ l.search }}</a-button>
        </div>
        <div>
          <a-button type="primary" @click="addTag" class="bg-blue-600 hover:bg-blue-700 transition-all hover:shadow-md">{{ l.addTag }}</a-button>
        </div>
      </div>

      <!-- Table container -->
      <div class="flex-1 flex flex-col overflow-hidden relative" ref="tableContainer">
        <div v-if="tableLoading" class="flex items-center justify-center h-80">
          <div class="text-center">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
            <p class="mt-3 text-gray-500 font-medium">{{ l.loading || 'Loading...' }}</p>
          </div>
        </div>
        <div v-else-if="tagList && tagList.length > 0" class="flex flex-col flex-1 overflow-hidden">
          <div class="flex-1 overflow-auto">
            <table class="w-full border-collapse text-sm">
              <!-- Table Header -->
              <thead class="bg-gradient-to-br from-gray-100 to-gray-50">
                <tr class="border-b-2 border-gray-300 sticky left-0 top-0">
                  <th class="px-5 py-4 text-left font-bold text-gray-800 w-12 text-xs uppercase tracking-wider">No</th>
                  <th class="px-5 py-4 text-left font-bold text-gray-800 min-w-40 text-xs uppercase tracking-wider">{{ l.name_zh || 'Name (ZH)' }}</th>
                  <th class="px-5 py-4 text-left font-bold text-gray-800 min-w-40 text-xs uppercase tracking-wider">{{ l.name_tw || 'Name (TW)' }}</th>
                  <th class="px-5 py-4 text-left font-bold text-gray-800 min-w-40 text-xs uppercase tracking-wider">{{ l.name_en || 'Name (EN)' }}</th>
                  <th class="px-5 py-4 text-left font-bold text-gray-800 min-w-40 text-xs uppercase tracking-wider">{{ l.name_vi || 'Name (VI)' }}</th>
                  <th class="px-5 py-4 text-left font-bold text-gray-800 min-w-48 text-xs uppercase tracking-wider">{{ l.create_time || 'Created' }}</th>
                  <th class="px-5 py-4 text-left font-bold text-gray-800 w-24 text-xs uppercase tracking-wider">{{ l.status || 'Status' }}</th>
                  <th class="px-5 py-4 text-left font-bold text-gray-800 min-w-72 text-xs uppercase tracking-wider">{{ l.oprate || 'Action' }}</th>
                </tr>
              </thead>
              <!-- Table Body -->
              <tbody class="divide-y divide-gray-200">
                <tr v-for="(record, index) in paginatedList" :key="record.id || index" class="bg-white hover:bg-blue-50 transition-all duration-200 hover:shadow-sm">
                  <td class="px-5 py-4 text-gray-900 font-medium text-sm">{{ (tablePagination.current - 1) * tablePagination.pageSize + index + 1 }}</td>
                  <td class="px-5 py-4 text-gray-800 text-sm">{{ record.name_zh }}</td>
                  <td class="px-5 py-4 text-gray-800 text-sm">{{ record.name_tw }}</td>
                  <td class="px-5 py-4 text-gray-800 text-sm">{{ record.name_en }}</td>
                  <td class="px-5 py-4 text-gray-800 text-sm">{{ record.name_vi }}</td>
                  <td class="px-5 py-4 text-gray-600 text-sm">{{ record.create_time }}</td>
                  <td class="px-5 py-4">
                    <span :class="[
                      'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
                      record.is_valid === 'Y' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    ]">
                      {{ record.is_valid === 'Y' ? l.enable : l.disable }}
                    </span>
                  </td>
                  <td class="px-5 py-4">
                    <div class="flex gap-2">
                      <button @click="modifyTag(record)" class="px-4 py-2 bg-blue-600 text-white! text-xs font-semibold rounded-lg hover:bg-blue-700 active:scale-95 transition-all duration-150 shadow-sm hover:shadow-md">
                        {{ c.edit }}
                      </button>
                      <button v-if="record.is_valid == 'N'" @click="modifyStatus(record)" class="px-4 py-2 bg-green-600 text-white! text-xs font-semibold rounded-lg hover:bg-green-700 active:scale-95 transition-all duration-150 shadow-sm hover:shadow-md">
                        {{ c.enable }}
                      </button>
                      <button v-else @click="modifyStatus(record)" class="px-4 py-2 bg-red-600 text-white! text-xs font-semibold rounded-lg hover:bg-red-700 active:scale-95 transition-all duration-150 shadow-sm hover:shadow-md">
                        {{ c.disable }}
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center gap-6 shadow-sm">
            <div class="text-sm font-medium text-gray-600">
              <span class="text-gray-800 font-semibold">{{ tablePagination.total }}</span>
              <span class="ml-1">{{ l.total }}</span>
            </div>
            <a-pagination v-model:current="tablePagination.current" v-model:page-size="tablePagination.pageSize" :total="tablePagination.total" :page-size-options="['5', '10', '15', '30', '50', '100']" :show-size-changer="true" @change="handlePageChange" class="[&_.ant-pagination-item-active]:bg-blue-600 [&_.ant-pagination-item-active]:border-blue-600"></a-pagination>
          </div>
        </div>
        <div v-else class="flex items-center justify-center h-80 text-gray-400 text-sm">
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
  confirmShow: false,
  confirmData: {
    title: '',
    message: '',
    recordId: null,
    value: null,
  },
})

const queryParams = reactive({
  page: 1,
  pageSize: 15,
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
  pageSize: 15,
  total: 0,
  pageSizeOptions: ['5', '10', '15', '30', '50', '100'],
})

// TanStack Query - Fetch tag list
const {
  data: tagListData,
  isLoading: tableLoading,
  refetch: refetchTagList,
} = useQuery({
  queryKey: ['videoTagList', queryParams],
  queryFn: async () => {
    const response = await $request(api.videoServer + '/Video/VideoTag/getList', queryParams)
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

// Watch page size changes
watch(
  () => tablePagination.pageSize,
  (newSize) => {
    queryParams.pageSize = newSize
    tablePagination.current = 1
    queryParams.page = 1
    refetchTagList()
  }
)

// TanStack Query - Add or modify tag
const { mutate: submitTag, isLoading: isSubmitting } = useMutation({
  mutationFn: async (formData) => {
    const response = await $request(api.videoServer + '/Video/VideoTag/addOrModifyTag', formData, 'post')
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
    const response = await $request(api.videoServer + '/Video/VideoTag/EnableOrDisabledTag', { key, value }, 'post')
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

// Computed properties
const paginatedList = computed(() => {
  return tagList.value
})

const totalPages = computed(() => {
  return Math.ceil(tablePagination.total / tablePagination.pageSize)
})

// Methods
const handlePageChange = (page) => {
  tablePagination.current = page
  queryParams.page = page
  refetchTagList()
}

const handlePageSizeChange = () => {
  tablePagination.current = 1
  queryParams.page = 1
  queryParams.pageSize = tablePagination.pageSize
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

  showObj.confirmData = {
    title: l.value.confirmTips || 'Confirm',
    message: `${oprate}《${name}》?`,
    recordId: record.id,
    value: value,
  }
  showObj.confirmShow = true
}

const handleConfirmOk = () => {
  if (showObj.confirmData.recordId) {
    updateTagStatus({ key: showObj.confirmData.recordId, value: showObj.confirmData.value })
  }
  showObj.confirmShow = false
}

const handleConfirmCancel = () => {
  showObj.confirmShow = false
}

const handleSubmit = () => {
  // Kiểm tra validation - ít nhất một trường ngôn ngữ phải được điền
  const hasValidLanguage = tagForm.name_zh.trim() !== '' || tagForm.name_tw.trim() !== '' || tagForm.name_en.trim() !== '' || tagForm.name_vi.trim() !== ''

  if (!hasValidLanguage) {
    $message.warning(l.value.validationError)
    return
  }

  if (tagForm.id === '') {
    tagForm.rec_status = 1
  }

  submitTag(tagForm)
}

onMounted(() => {
  refetchTagList()
})
</script>
