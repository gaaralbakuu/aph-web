<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.title || 'Tags' }}</h1>
      <Button variant="danger" @click="addTag">
        <i class="el-icon-plus text-lg mr-2"></i>
        <span>{{ l.addTag }}</span>
      </Button>
    </div>

    <!-- Filter Bar -->
    <div class="px-6 pt-4 pb-4 border-b border-[#E5E5E5] bg-white sticky top-0 z-20">
      <div class="flex items-center gap-4">
        <!-- Search Filter -->
        <SearchInput 
          v-model="queryParams.name"
          :placeholder="l.search || 'Search tags...'"
          class="flex-1 max-w-md"
          @search="refetchTagList"
        />

        <!-- Status Filter -->
        <div class="relative group w-40">
           <select v-model="queryParams.is_valid" @change="refetchTagList" class="w-full px-3 py-2 bg-white border border-[#CCCCCC] rounded text-sm text-[#0D0D0D] hover:border-[#606060] outline-none focus:border-[#065FD4]">
              <option value="">{{ c.all }}</option>
              <option value="Y">{{ l.enable }}</option>
              <option value="N">{{ l.disable }}</option>
           </select>
        </div>

        <Button variant="secondary" @click="refetchTagList">
           {{ l.search }}
        </Button>
      </div>
    </div>

    <!-- Content List -->
    <div class="flex-1 overflow-y-scroll flex flex-col">
       <!-- List Header -->
       <div class="grid grid-cols-[50px_1fr_1fr_1fr_1fr_150px_100px_140px] gap-4 px-6 py-2 border-b border-[#E5E5E5] text-xs font-medium text-[#606060] bg-white sticky top-0 z-10">
          <div>{{ c.ordinal || 'No' }}</div>
          <div>{{ l.name_zh || 'Name (ZH)' }}</div>
          <div>{{ l.name_tw || 'Name (TW)' }}</div>
          <div>{{ l.name_en || 'Name (EN)' }}</div>
          <div>{{ l.name_vi || 'Name (VI)' }}</div>
          <div>{{ l.create_time || 'Created' }}</div>
          <div>{{ l.status || 'Status' }}</div>
          <div class="text-right">{{ l.oprate || 'Action' }}</div>
       </div>

       <!-- List Body -->
       <div class="flex-1 bg-white flex flex-col min-h-0">
          <div v-if="tableLoading" class="flex flex-col items-center justify-center py-20 flex-1">
             <i class="el-icon-loading text-2xl text-[#065FD4]"></i>
             <p class="text-sm text-[#606060] mt-2">{{ l.loading || 'Loading...' }}</p>
          </div>
          <div v-else-if="tagList.length === 0" class="flex flex-col items-center justify-center py-20 flex-1">
             <div class="w-32 h-32 bg-[#F9F9F9] rounded-full flex items-center justify-center mb-4">
                <i class="el-icon-price-tag text-4xl text-[#CCCCCC]"></i>
             </div>
             <p class="text-[#0D0D0D]">{{ c.noData }}</p>
          </div>
          <div v-else class="flex-1 flex flex-col">
             <div class="divide-y divide-[#E5E5E5]">
                <div v-for="(record, index) in tagList" :key="record.id || index" class="grid grid-cols-[50px_1fr_1fr_1fr_1fr_150px_100px_140px] gap-4 px-6 py-3 hover:bg-[#F9F9F9] group items-center transition-colors">
                   <div class="text-sm text-[#606060]">{{ (tablePagination.current - 1) * tablePagination.pageSize + index + 1 }}</div>
                   <div class="text-sm text-[#0D0D0D] font-medium">{{ record.name_zh }}</div>
                   <div class="text-sm text-[#0D0D0D]">{{ record.name_tw }}</div>
                   <div class="text-sm text-[#0D0D0D]">{{ record.name_en }}</div>
                   <div class="text-sm text-[#0D0D0D]">{{ record.name_vi }}</div>
                   <div class="text-xs text-[#606060]">{{ record.create_time }}</div>
                   <div>
                      <span :class="[
                        'inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium uppercase',
                        record.is_valid === 'Y'
                          ? 'bg-[#E5F6FD] text-[#065FD4]'
                          : 'bg-[#F9F9F9] text-[#606060] border border-[#CCCCCC]'
                      ]">
                        {{ record.is_valid === 'Y' ? l.enable : l.disable }}
                      </span>
                   </div>
                   <div class="text-right flex items-center justify-end gap-3 transition-opacity">
                      <i class="el-icon-edit text-lg cursor-pointer text-[#606060] hover:text-[#0D0D0D]" :title="c.edit" @click="modifyTag(record)"></i>
                      <i v-if="record.is_valid == 'N'" class="el-icon-check text-lg cursor-pointer text-[#069C56] hover:text-[#058549]" :title="c.enable" @click="modifyStatus(record)"></i>
                      <i v-else class="el-icon-close text-lg cursor-pointer text-[#CC0000] hover:text-[#990000]" :title="c.disable" @click="modifyStatus(record)"></i>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </div>

    <!-- Pagination Footer -->
    <div class="flex justify-end p-4 border-t border-[#E5E5E5] bg-white text-xs text-[#606060]">
      <Pagination
        v-model:page="tablePagination.current"
        v-model:pageSize="tablePagination.pageSize"
        :total="tablePagination.total"
        :page-size-options="[10, 30, 50, 100]"
        :l="l"
        @change="refetchTagList"
      />
    </div>

    <!-- Drawer thêm/chỉnh sửa tag -->
    <a-drawer :visible="showObj.tagShow" width="500" :body-style="{ padding: 0 }" @close="showObj.tagShow = false">
       <div class="flex flex-col h-full font-roboto bg-white">
          <!-- Drawer Header -->
          <div class="px-6 py-4 border-b border-[#E5E5E5] text-lg font-medium text-[#0D0D0D]">
             {{ l.addTag || 'Add Tag' }}
          </div>

          <!-- Drawer Body -->
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
             <!-- ZH -->
             <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.name_zh }}</label>
                <input v-model="tagForm.name_zh" class="w-full outline-none text-[#0D0D0D] text-sm" placeholder="" />
             </div>
             <!-- TW -->
             <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.name_tw }}</label>
                <input v-model="tagForm.name_tw" class="w-full outline-none text-[#0D0D0D] text-sm" placeholder="" />
             </div>
             <!-- EN -->
             <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.name_en }}</label>
                <input v-model="tagForm.name_en" class="w-full outline-none text-[#0D0D0D] text-sm" placeholder="" />
             </div>
             <!-- VI -->
             <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.name_vi }}</label>
                <input v-model="tagForm.name_vi" class="w-full outline-none text-[#0D0D0D] text-sm" placeholder="" />
             </div>

             <div class="text-[#CC0000] italic text-xs mt-2">* {{ l.validationError }}</div>
          </div>

          <!-- Drawer Footer -->
          <div class="p-4 border-t border-[#E5E5E5] bg-white flex justify-end gap-2">
             <Button variant="secondary" @click="showObj.tagShow = false">{{ l.giveup }}</Button>
             <Button variant="primary" @click="handleSubmit">{{ l.submit }}</Button>
          </div>
       </div>
    </a-drawer>

    <!-- Confirm Dialog Modal -->
    <div v-if="showObj.confirmShow" class="fixed inset-0 z-50 flex items-center justify-center font-roboto">
      <div class="fixed inset-0 bg-black/50" @click="handleConfirmCancel"></div>
      <div class="relative bg-white rounded shadow-xl p-6 max-w-sm w-full mx-4 border border-[#E5E5E5]">
        <h3 class="text-lg font-medium text-[#0D0D0D] mb-4">{{ showObj.confirmData.title }}</h3>
        <p class="text-[#606060] mb-6 text-sm">{{ showObj.confirmData.message }}</p>
        <div class="flex justify-end gap-2">
          <Button variant="secondary" @click="handleConfirmCancel">
            {{ l.giveup || 'Cancel' }}
          </Button>
          <Button variant="primary" @click="handleConfirmOk">
            {{ l.submit || 'OK' }}
          </Button>
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
import SearchInput from '../common/SearchInput.vue'
import Button from '../common/Button.vue'
import Pagination from '../common/Pagination.vue'

const instance = getCurrentInstance()
const { $request, $message } = instance.proxy
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
  is_valid: 'Y',
  rec_status: '',
})

const tablePagination = reactive({
  current: 1,
  pageSize: 15,
  total: 0,
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

// Methods
const handlePageChange = (page) => {
  tablePagination.current = page
  queryParams.page = page
  refetchTagList()
}

const resetForm = () => {
  tagForm.id = ''
  tagForm.name_zh = ''
  tagForm.name_en = ''
  tagForm.name_tw = ''
  tagForm.name_vi = ''
  tagForm.is_valid = 'Y'
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
