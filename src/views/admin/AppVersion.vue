<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.title || 'App Version' }}</h1>
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
      <div class="flex items-center gap-2 px-3 py-2 bg-white border border-[#CCCCCC] rounded hover:border-[#606060] transition-colors focus-within:border-[#065FD4] w-[250px]">
        <i class="el-icon-search text-[#606060] text-lg"></i>
        <input
          v-model="query.queryString.str"
          type="text"
          :placeholder="l.search"
          class="bg-transparent border-none outline-none text-sm w-full placeholder-[#999999]"
          @keyup.enter="research"
        />
        <i v-if="query.queryString.str" class="el-icon-close text-[#606060] cursor-pointer hover:text-[#0D0D0D]" @click="query.queryString.str = ''; research()"></i>
      </div>

      <!-- System Filter -->
      <div class="relative group">
         <select v-model="query.queryString.system" class="appearance-none pl-3 pr-8 py-2 bg-white border border-[#CCCCCC] rounded text-sm text-[#0D0D0D] outline-none focus:border-[#065FD4] hover:border-[#606060] cursor-pointer min-w-[120px]" @change="research">
            <option value="">{{ l.systemPd || 'System' }}</option>
            <option value="all">ALL</option>
            <option value="ios">IOS</option>
            <option value="android">Android</option>
         </select>
         <i class="el-icon-arrow-down absolute right-2 top-1/2 -translate-y-1/2 text-[#606060] pointer-events-none text-xs"></i>
      </div>

      <!-- Install Type Filter -->
      <div class="relative group">
         <select v-model="query.queryString.install_type" class="appearance-none pl-3 pr-8 py-2 bg-white border border-[#CCCCCC] rounded text-sm text-[#0D0D0D] outline-none focus:border-[#065FD4] hover:border-[#606060] cursor-pointer min-w-[140px]" @change="research">
            <option :value="undefined">{{ l.install_typePd || 'Install Type' }}</option>
            <option value="1">{{ l.full }}</option>
            <option value="2">{{ l.incremental }}</option>
         </select>
         <i class="el-icon-arrow-down absolute right-2 top-1/2 -translate-y-1/2 text-[#606060] pointer-events-none text-xs"></i>
      </div>

      <Button variant="secondary" @click="research">{{ c.queryButton }}</Button>
    </div>

    <!-- Content Grid -->
    <div class="flex-1 overflow-hidden bg-white flex flex-col relative">
      <!-- Grid Header -->
      <div class="grid grid-cols-[120px_140px_100px_80px_100px_120px_120px_120px_220px_140px_90px_140px_120px] gap-4 px-6 py-3 border-b border-[#E5E5E5] text-xs font-medium text-[#606060] bg-[#F9F9F9] sticky top-0 z-10 min-w-[1700px]">
        <div>{{ l.app_id }}</div>
        <div>{{ l.app_name }}</div>
        <div>{{ l.system }}</div>
        <div>{{ l.is_test }}</div>
        <div>{{ l.install_type }}</div>
        <div>{{ l.version }}</div>
        <div>{{ l.pkg_url }}</div>
        <div>{{ l.wgt_url }}</div>
        <div>{{ l.version_notes }}</div>
        <div>{{ l.remarks }}</div>
        <div>{{ c.modify_user }}</div>
        <div>{{ c.modify_time }}</div>
        <div class="text-right">{{ c.action }}</div>
      </div>

      <!-- List -->
      <div class="flex-1 overflow-auto custom-scrollbar">
        <div class="min-w-[1700px]">
          <div v-if="list.length === 0" class="flex flex-col items-center justify-center py-20 text-[#606060]">
            <i class="el-icon-document text-4xl mb-2 text-[#CCCCCC]"></i>
            <p>{{ c.noData }}</p>
          </div>

          <div v-for="(item, index) in list" :key="index" class="grid grid-cols-[120px_140px_100px_80px_100px_120px_120px_120px_220px_140px_90px_140px_120px] gap-4 px-6 py-3 border-b border-[#E5E5E5] hover:bg-[#F9F9F9] items-center text-sm text-[#0D0D0D]">
            <div class="truncate" :title="item.app_id">{{ item.app_id }}</div>
            <div class="truncate" :title="item.app_name">{{ item.app_name }}</div>
            <div class="truncate">{{ systemMap[item.system] || item.system }}</div>
            <div class="truncate">{{ item.is_test }}</div>
            <div class="truncate">{{ typeMap[item.install_type] || item.install_type }}</div>
            <div class="truncate" :title="item.version">{{ item.version }}</div>
            <div class="truncate" :title="item.pkg_url">{{ item.pkg_url }}</div>
            <div class="truncate" :title="item.wgt_url">{{ item.wgt_url }}</div>
            <div class="truncate" :title="item.version_notes">{{ item.version_notes }}</div>
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

            <div class="grid grid-cols-2 gap-4">
               <!-- App ID -->
               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                 <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.app_id }} ({{ c.required }})</label>
                 <input v-model="data.app_id" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
               </div>

               <!-- App Name -->
               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                 <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.app_name }} ({{ c.required }})</label>
                 <input v-model="data.app_name" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
               </div>

               <!-- System -->
               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                 <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.system }} ({{ c.required }})</label>
                 <select v-model="data.system" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent appearance-none" @change="appStoreChange">
                    <option value="all">ALL</option>
                    <option value="android">Android</option>
                    <option value="ios">IOS</option>
                 </select>
               </div>

               <!-- Is Test -->
               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                 <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.is_test }} ({{ c.required }})</label>
                 <select v-model="data.is_test" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent appearance-none">
                    <option value="Y">Y</option>
                    <option value="N">N</option>
                 </select>
               </div>

               <!-- Install Type -->
               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4] bg-white"
                  :class="{'opacity-50 pointer-events-none bg-gray-50': installTypeDisabled}">
                 <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.install_type }} ({{ c.required }})</label>
                 <select v-model="data.install_type" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent appearance-none">
                    <option :value="1">{{ l.full }}</option>
                    <option :value="2">{{ l.incremental }}</option>
                 </select>
               </div>

               <!-- Version -->
               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                 <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.version }} ({{ c.required }})</label>
                 <input v-model="data.version" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
               </div>
            </div>

            <!-- URL (File) -->
            <div class="mt-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
               <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.url }} ({{ c.required }})</label>
               <input v-model="data.file" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <!-- Version Notes -->
            <div class="mt-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
               <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.version_notes }} ({{ c.required }})</label>
               <textarea v-model="data.version_notes" rows="3" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent resize-none"></textarea>
            </div>

            <!-- Remarks -->
            <div class="mt-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
               <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.remarks }}</label>
               <textarea v-model="data.remarks" rows="2" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent resize-none"></textarea>
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
import { cloneDeep } from 'lodash'

// Global instance
const instance = getCurrentInstance()
const { $request, $message, $confirm } = instance.proxy

// Localization
const { l, c } = useLocalI18n('adminAppVersion')

const systemMap = computed(() => ({ all: 'ALL', android: 'Android', ios: 'IOS' }))
const typeMap = computed(() => ({ 1: l.value.full || 'Full', 2: l.value.incremental || 'Incremental' }))

// State
const pageLoading = ref(false)
const submmitLoading = ref(false)
const editFormVisible = ref(false)

const list = ref([])
const total = ref(0)
const query = reactive({
  queryString: { str: '', system: '', install_type: undefined },
  size: 10,
  page: 1,
})

const initData = {
   app_id: '',
   app_name: '',
   system: 'android',
   is_test: 'N',
   install_type: 1,
   version: '',
   file: '',
   version_notes: '',
   remarks: '',
   pkg_url: '',
   wgt_url: ''
}
const data = reactive({ ...initData })

// Computed
const installTypeDisabled = computed(() => data.system === 'all')

// Methods
const getList = () => {
  pageLoading.value = true
  // Custom query formatting as in original
  const q = cloneDeep(query)
  q.queryString = JSON.stringify(q.queryString)

  $request(api.appVersion + 'getlist', q)
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

const createItem = () => {
  Object.assign(data, initData)
  delete data.id
  editFormVisible.value = true
}

const editItem = (item) => {
  pageLoading.value = true
  $request(api.appVersion + 'getbyid', { id: item.id })
    .then(r => {
      pageLoading.value = false
      Object.assign(data, r.data)
      data.file = data.pkg_url ? data.pkg_url : data.wgt_url

      if (data.system === 'all') {
         data.install_type = 2
      }

      editFormVisible.value = true
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const copyItem = (item) => {
   // Shallow copy item props
   const cp = cloneDeep(item)
   delete cp.id
   delete cp.create_time
   delete cp.create_user
   delete cp.modify_time
   delete cp.modify_user

   Object.assign(data, cp)
   data.file = data.pkg_url ? data.pkg_url : data.wgt_url

   if (data.system === 'all') {
      data.install_type = 2
   }

   editFormVisible.value = true
}

const deleteItem = (item) => {
  Modal.confirm({
    title: c.value.oprConfirm,
    content: c.value.cfmDelete,
    onOk() {
      pageLoading.value = true
      $request(api.appVersion + 'delete/' + item.id, {}, 'post')
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

const appStoreChange = () => {
  if (data.system == 'all') {
    data.install_type = 2
  }
}

const submmit = () => {
  // Pre-save formatting
  data.wgt_url = ''
  data.pkg_url = ''
  if (data.file) {
    if (data.install_type == 1) {
      data.pkg_url = data.file
    }
    if (data.install_type == 2 || data.system == 'all') {
      data.wgt_url = data.file
    }
  }

  if (data.install_type == 1 && data.system == 'ios') {
    if (data.pkg_url && data.pkg_url.indexOf('apps.apple') < 0) {
      message.error(l.value.iosUrlCheck || 'iOS full install requires App Store URL')
      // Note: Original code returned here? Or continued? It showed message.
      // Usually validation failure stops submission.
      // But original didn't explicitly return false or throw.
      // "return this.data" was the end of formatBeforeSave.
    }
  }

  submmitLoading.value = true
  const url = api.appVersion + 'addormodify'

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

// Lifecycle
onMounted(() => {
  getList()
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
