<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.title || 'Astrict Auth' }}</h1>
      <div class="flex gap-2">
        <Button variant="primary" @click="createItem">
          <i class="el-icon-plus mr-2"></i>
          {{ c.create }}
        </Button>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] bg-white sticky top-0 z-20 flex flex-wrap items-center gap-4">
      <!-- Org ID -->
      <div class="flex items-center gap-2 px-3 py-2 bg-white border border-[#CCCCCC] rounded hover:border-[#606060] transition-colors focus-within:border-[#065FD4] w-[200px]">
        <i class="el-icon-search text-[#606060] text-lg"></i>
        <input
          v-model="query.orgid"
          type="text"
          :placeholder="l.org_id"
          class="bg-transparent border-none outline-none text-sm w-full placeholder-[#999999]"
          @keyup.enter="research"
        />
        <i v-if="query.orgid" class="el-icon-close text-[#606060] cursor-pointer hover:text-[#0D0D0D]" @click="query.orgid = ''; research()"></i>
      </div>

      <!-- Dept Codes -->
      <div class="flex items-center gap-2 px-3 py-2 bg-white border border-[#CCCCCC] rounded hover:border-[#606060] transition-colors focus-within:border-[#065FD4] w-[200px]">
        <i class="el-icon-search text-[#606060] text-lg"></i>
        <input
          v-model="query.deptcodes"
          type="text"
          :placeholder="l.dept_codes"
          class="bg-transparent border-none outline-none text-sm w-full placeholder-[#999999]"
          @keyup.enter="research"
        />
        <i v-if="query.deptcodes" class="el-icon-close text-[#606060] cursor-pointer hover:text-[#0D0D0D]" @click="query.deptcodes = ''; research()"></i>
      </div>

      <Button variant="secondary" @click="research">{{ c.queryButton }}</Button>
    </div>

    <!-- Content Grid -->
    <div class="flex-1 overflow-hidden bg-white flex flex-col relative">
      <!-- Grid Header -->
      <div class="grid grid-cols-[120px_1fr_200px_1fr_80px] gap-4 px-6 py-3 border-b border-[#E5E5E5] text-xs font-medium text-[#606060] bg-[#F9F9F9] sticky top-0 z-10 min-w-[1000px]">
        <div>{{ l.org_id }}</div>
        <div>{{ l.dept_codes }}</div>
        <div>{{ l.menu_name }}</div>
        <div>{{ c.remarks }}</div>
        <div class="text-right">{{ c.action }}</div>
      </div>

      <!-- List -->
      <div class="flex-1 overflow-auto custom-scrollbar">
        <div class="min-w-[1000px]">
          <div v-if="list.length === 0" class="flex flex-col items-center justify-center py-20 text-[#606060]">
            <i class="el-icon-document text-4xl mb-2 text-[#CCCCCC]"></i>
            <p>{{ c.noData }}</p>
          </div>

          <div v-for="(item, index) in list" :key="index" class="grid grid-cols-[120px_1fr_200px_1fr_80px] gap-4 px-6 py-3 border-b border-[#E5E5E5] hover:bg-[#F9F9F9] items-center text-sm text-[#0D0D0D]">
            <div class="truncate" :title="item.org_id">{{ item.org_id }}</div>
            <div class="truncate" :title="item.dept_codes">{{ item.dept_codes }}</div>
            <div class="truncate" :title="formatMenuName(item)">{{ formatMenuName(item) }}</div>
            <div class="truncate" :title="item.remark">{{ item.remark }}</div>

            <div class="flex justify-end gap-3 text-[#606060]">
               <a class="text-[#065FD4] hover:underline cursor-pointer" @click="editItem(item)">{{ c.edit }}</a>
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
    <a-drawer :visible="editFormVisible" :title="l.title" :width="500" @close="editFormVisible = false" :body-style="{ padding: 0 }">
       <div class="flex flex-col h-full bg-white font-roboto">
         <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">

            <!-- Org ID -->
            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
               <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.org_id }} ({{ c.required }})</label>
               <input v-model="data.org_id" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <!-- Dept Codes (Dynamic Tag) -->
            <div class="mb-4">
               <label class="block text-xs text-[#606060] mb-2">{{ l.dept_codes }} ({{ c.required }})</label>
               <Dynamictag v-model="data.dept_codes_arr" />
            </div>

            <!-- Menu Name -->
            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
               <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.menu_name }} ({{ c.required }})</label>
               <select v-model="data.menu_id" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent appearance-none">
                  <option v-for="item in menuOptions" :key="item.menu_id" :value="item.menu_id">{{ item.menu_name_label }}</option>
               </select>
            </div>

            <!-- Remarks -->
            <div class="mt-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
               <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ c.remarks }}</label>
               <textarea v-model="data.remark" rows="3" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent resize-none"></textarea>
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
import { localGet } from '@/utils/auth'
import { useLocalI18n } from '@/composables/useLocalI18n'
import Button from '@/views/sysbasics/video/adminViews/component/common/Button.vue'
import Pagination from '@/views/sysbasics/video/adminViews/component/common/Pagination.vue'
import Dynamictag from '@/components/Tag/Dynamictag.vue'

// Global instance
const instance = getCurrentInstance()
const { $request, $message, $confirm } = instance.proxy

// Localization
const { l, c } = useLocalI18n('adminAstrictAuth')
const currentLang = ref(localGet('lang') || 'zh-CN')

// State
const pageLoading = ref(false)
const submmitLoading = ref(false)
const editFormVisible = ref(false)

const list = ref([])
const total = ref(0)
const query = reactive({
  orgid: '',
  deptcodes: '',
  size: 10,
  page: 1,
})

const data = reactive({
  org_id: '',
  dept_codes_arr: [],
  menu_id: '',
  remark: ''
})

const menuOptions = ref([])

// Methods
const init = () => {
  $request(api.menu + 'getlist', { type: 'APP' })
    .then(r => {
       menuOptions.value = r.data
    })
    .catch(() => {})
}

const getList = () => {
  pageLoading.value = true
  $request(api.auth + 'GetCAuthBlacklist', query)
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

const formatMenuName = (item) => {
   try {
     const arr = JSON.parse(item.menu_name || '[]')
     if (Array.isArray(arr)) {
        const found = arr.find(i => i.key == currentLang.value)
        return found ? found.label : arr[0]?.label || item.menu_name
     }
     return item.menu_name
   } catch (e) {
     return item.menu_name
   }
}

const createItem = () => {
  Object.assign(data, {
     org_id: '',
     dept_codes_arr: [],
     menu_id: '',
     remark: ''
  })
  delete data.id
  editFormVisible.value = true
}

const editItem = (item) => {
  // item.dept_codes is a string "A,B"
  Object.assign(data, item)
  data.dept_codes_arr = item.dept_codes ? item.dept_codes.split(',') : []
  editFormVisible.value = true
}

const deleteItem = (item) => {
  Modal.confirm({
    title: c.value.oprConfirm,
    content: c.value.cfmDelete,
    onOk() {
      pageLoading.value = true
      $request(api.auth + 'DeleteCAuthBlackById', { id: item.id }, 'post')
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
  const payload = { ...data }
  payload.dept_codes = payload.dept_codes_arr.join(',')
  delete payload.dept_codes_arr

  $request(api.auth + 'InsertOrUpdateCAuthBlack', payload, 'post')
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
  init()
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
