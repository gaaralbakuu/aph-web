<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.title || 'Parameter Management' }}</h1>

      <div class="flex gap-2">
        <Button variant="primary" @click="createItem">
          <i class="el-icon-plus mr-2"></i>
          {{ c.create }}
        </Button>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] bg-white sticky top-0 z-20 flex flex-wrap items-center gap-4">
      <!-- Search -->
      <div class="flex items-center gap-2 px-3 py-2 bg-white border border-[#CCCCCC] rounded hover:border-[#606060] transition-colors focus-within:border-[#065FD4] w-[300px]">
        <i class="el-icon-search text-[#606060] text-lg"></i>
        <input
          v-model="query.queryString"
          type="text"
          :placeholder="c.queryPlaceholder"
          class="bg-transparent border-none outline-none text-sm w-full placeholder-[#999999]"
          @keyup.enter="research"
        />
        <i v-if="query.queryString" class="el-icon-close text-[#606060] cursor-pointer hover:text-[#0D0D0D]" @click="query.queryString = ''; research()"></i>
      </div>

      <!-- Type Filter -->
      <div class="relative group">
         <select v-model="query.paramType" class="appearance-none pl-3 pr-8 py-2 bg-white border border-[#CCCCCC] rounded text-sm text-[#0D0D0D] outline-none focus:border-[#065FD4] hover:border-[#606060] cursor-pointer min-w-[200px]" @change="research">
            <option :value="undefined">{{ l.param_typePd || 'Param Type' }}</option>
            <option v-for="(item, index) in typeOptions" :key="index" :value="item.param_type">{{ item.param_type }}</option>
         </select>
         <i class="el-icon-arrow-down absolute right-2 top-1/2 -translate-y-1/2 text-[#606060] pointer-events-none text-xs"></i>
      </div>

      <Button variant="secondary" @click="research">{{ c.queryButton }}</Button>
      <Button variant="ghost" @click="exportData" :disabled="exportLoading">
        <i class="el-icon-download mr-1"></i>
        {{ c.export }}
      </Button>
    </div>

    <!-- Content Grid -->
    <div class="flex-1 overflow-hidden bg-white flex flex-col relative">
      <!-- Grid Header -->
      <div class="grid grid-cols-[160px_180px_100px_180px_100px_100px_100px_200px_90px_140px_140px] gap-4 px-6 py-3 border-b border-[#E5E5E5] text-xs font-medium text-[#606060] bg-[#F9F9F9] sticky top-0 z-10 min-w-[1600px]">
        <div>{{ l.param_type }}</div>
        <div>{{ l.param_name }}</div>
        <div>{{ l.param_priority }}</div>
        <div>{{ l.param_value }}</div>
        <div>{{ l.param_condition1 }}</div>
        <div>{{ l.param_condition2 }}</div>
        <div>{{ l.param_condition3 }}</div>
        <div>{{ l.remarks }}</div>
        <div>{{ c.modify_user }}</div>
        <div>{{ c.modify_time }}</div>
        <div class="text-right">{{ c.action }}</div>
      </div>

      <!-- List -->
      <div class="flex-1 overflow-auto custom-scrollbar">
        <div class="min-w-[1600px]">
          <div v-if="list.length === 0" class="flex flex-col items-center justify-center py-20 text-[#606060]">
            <i class="el-icon-document text-4xl mb-2 text-[#CCCCCC]"></i>
            <p>{{ c.noData }}</p>
          </div>

          <div v-for="(item, index) in list" :key="index" class="grid grid-cols-[160px_180px_100px_180px_100px_100px_100px_200px_90px_140px_140px] gap-4 px-6 py-3 border-b border-[#E5E5E5] hover:bg-[#F9F9F9] items-center text-sm text-[#0D0D0D]">
            <div class="truncate" :title="item.param_type">{{ item.param_type }}</div>
            <div class="truncate" :title="item.param_name">{{ item.param_name }}</div>
            <div class="truncate">{{ item.param_priority }}</div>
            <div class="truncate" :title="item.param_value">{{ item.param_value }}</div>
            <div class="truncate" :title="item.param_condition1">{{ item.param_condition1 }}</div>
            <div class="truncate" :title="item.param_condition2">{{ item.param_condition2 }}</div>
            <div class="truncate" :title="item.param_condition3">{{ item.param_condition3 }}</div>
            <div class="truncate" :title="item.remarks">{{ item.remarks }}</div>
            <div class="truncate">{{ item.modify_user }}</div>
            <div class="truncate text-xs text-[#606060]">{{ item.modify_time }}</div>

            <div class="flex justify-end gap-3 text-[#606060]">
               <a class="text-[#065FD4] hover:underline cursor-pointer" @click="editItem(item)">{{ c.edit }}</a>
               <a class="text-[#069C56] hover:underline cursor-pointer" @click="copyItem(item)">{{ c.copy }}</a>
               <a class="text-[#CC0000] hover:underline cursor-pointer" @click="deleteItem(item)">{{ c.delete }}</a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-end p-4 border-t border-[#E5E5E5] bg-white text-xs text-[#606060]">
      <Pagination
        :page="query.page"
        :pageSize="query.size"
        :total="total"
        :l="l"
        @update:page="query.page = $event"
        @update:pageSize="query.size = $event"
        @change="getList"
      />
    </div>

    <!-- Drawer -->
    <a-drawer :visible="editFormVisible" :title="l.title" :width="600" @close="editFormVisible = false" :body-style="{ padding: 0 }">
       <div class="flex flex-col h-full bg-white font-roboto">
         <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">

            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
               <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.param_type }} ({{ c.required }})</label>
               <input v-model="data.param_type" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
               <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.param_name }} ({{ c.required }})</label>
               <input v-model="data.param_name" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
               <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.param_priority }} ({{ c.required }})</label>
               <input v-model="data.param_priority" type="number" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
               <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.param_value }}</label>
               <input v-model="data.param_value" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <div class="grid grid-cols-3 gap-4">
               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.param_condition1 }}</label>
                  <input v-model="data.param_condition1" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
               </div>
               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.param_condition2 }}</label>
                  <input v-model="data.param_condition2" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
               </div>
               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.param_condition3 }}</label>
                  <input v-model="data.param_condition3" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
               </div>
            </div>

            <div class="mt-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
               <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">
                  {{ l.remarks }} ({{ c.required }})
                  <el-tooltip v-if="l.remarksTip" :content="l.remarksTip" placement="top">
                    <i class="el-icon-info text-[#065FD4] ml-1"></i>
                  </el-tooltip>
               </label>
               <textarea v-model="data.remarks" rows="3" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent resize-none"></textarea>
            </div>

         </div>
         <div class="border-t border-[#E5E5E5] p-4 flex justify-end items-center gap-2 bg-white">
           <Button variant="ghost" @click="editFormVisible = false">{{ c.cancel }}</Button>
           <Button variant="primary" :loading="submmitLoading" @click="submmit">{{ c.confirm }}</Button>
         </div>
       </div>
    </a-drawer>

    <!-- Loading Overlay -->
    <div v-if="pageLoading" class="absolute inset-0 z-50 bg-white/50 flex items-center justify-center">
        <i class="el-icon-loading text-3xl text-[#065FD4]"></i>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, getCurrentInstance, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import api from '@/api'
import { useLocalI18n } from '@/composables/useLocalI18n'
import Button from '@/views/sysbasics/video/adminViews/component/common/Button.vue'
import Pagination from '@/views/sysbasics/video/adminViews/component/common/Pagination.vue'

// Global instance
const instance = getCurrentInstance()
const { $request, $message, $confirm } = instance.proxy

// Localization
const { l, c } = useLocalI18n('adminParam')

// State
const pageLoading = ref(false)
const submmitLoading = ref(false)
const exportLoading = ref(false)
const editFormVisible = ref(false)

const list = ref([])
const total = ref(0)
const query = reactive({
  queryString: '',
  paramType: undefined,
  size: 10,
  page: 1,
})

const typeOptions = ref([])

const initData = {
   param_type: '',
   param_name: '',
   param_priority: 0,
   param_value: '',
   param_condition1: '',
   param_condition2: '',
   param_condition3: '',
   remarks: ''
}
const data = reactive({ ...initData })

// Methods
const getList = () => {
  pageLoading.value = true
  $request(api.param + 'getlist', query)
    .then(r => {
      list.value = r.data.list
      total.value = r.data.total
      pageLoading.value = false
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const research = () => {
  query.page = 1
  getList()
}

const getTypeList = () => {
   $request(api.param + 'gettypelist')
      .then(r => {
         typeOptions.value = r.data
      })
      .catch(() => {})
}

const createItem = () => {
  Object.assign(data, initData)
  delete data.id
  editFormVisible.value = true
}

const editItem = (item) => {
   Object.assign(data, item)
   editFormVisible.value = true
}

const copyItem = (item) => {
   pageLoading.value = true
   $request(api.param + 'getbyid', { id: item.id })
     .then(r => {
        pageLoading.value = false
        Object.assign(data, r.data)
        delete data.id
        editFormVisible.value = true
     })
     .catch(() => {
        pageLoading.value = false
     })
}

const deleteItem = (item) => {
  Modal.confirm({
    title: c.value.oprConfirm,
    content: c.value.cfmDelete,
    onOk() {
      pageLoading.value = true
      $request(api.param + 'delete/' + item.id, {}, 'post')
        .then(() => {
           message.success(c.value.success)
           pageLoading.value = false
           getList()
        })
        .catch(() => {
           pageLoading.value = false
        })
    }
  })
}

const submmit = () => {
   submmitLoading.value = true
   const url = api.param + 'update' // Original config used 'update' for create too? apiCreate: api.param + 'update'
   $request(url, data, 'post')
     .then(() => {
        submmitLoading.value = false
        message.success(c.value.success)
        editFormVisible.value = false
        getList()
     })
     .catch(() => {
        submmitLoading.value = false
     })
}

const exportData = () => {
   // Implementation depends on backend
   message.info('Export not implemented')
}

// Lifecycle
onMounted(() => {
  getList()
  getTypeList()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cccccc;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #999999;
}
</style>
