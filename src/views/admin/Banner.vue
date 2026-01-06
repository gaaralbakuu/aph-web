<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.title || 'Banner Management' }}</h1>

      <div class="flex gap-2">
        <Button v-if="indexFlag" :loading="sortLoading" variant="secondary" @click="updateDetailSort">
           {{ c.saveIndex || 'Save Order' }}
        </Button>
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

      <!-- Status Filter -->
      <div class="relative group">
         <select v-model="query.queryString.status" class="appearance-none pl-3 pr-8 py-2 bg-white border border-[#CCCCCC] rounded text-sm text-[#0D0D0D] outline-none focus:border-[#065FD4] hover:border-[#606060] cursor-pointer min-w-[120px]" @change="research">
            <option value="0">{{ c.all || 'All' }}</option>
            <option value="1">{{ c.enabled }}</option>
            <option value="2">{{ c.disabled }}</option>
         </select>
         <i class="el-icon-arrow-down absolute right-2 top-1/2 -translate-y-1/2 text-[#606060] pointer-events-none text-xs"></i>
      </div>

      <Button variant="secondary" @click="research">{{ c.queryButton }}</Button>
    </div>

    <!-- Content Grid -->
    <div class="flex-1 overflow-hidden bg-white flex flex-col relative">
      <!-- Grid Header -->
      <div class="grid grid-cols-[200px_150px_150px_150px_150px_80px_80px_80px_80px_80px_100px_140px_100px] gap-4 px-6 py-3 border-b border-[#E5E5E5] text-xs font-medium text-[#606060] bg-[#F9F9F9] sticky top-0 z-10 min-w-[1600px]">
        <div>{{ l.name }}</div>
        <div>{{ l.description }}</div>
        <div>{{ l.link }}</div>
        <div>{{ l.file_name }}</div>
        <div>{{ l.file_url }}</div>
        <div>{{ l.empnopz }}</div>
        <div>{{ l.orgidpz }}</div>
        <div>{{ l.deptnopz }}</div>
        <div>{{ l.otherspz }}</div>
        <div>{{ l.status }}</div>
        <div>{{ c.modify_user }}</div>
        <div>{{ c.modify_time }}</div>
        <div class="text-right">{{ c.action }}</div>
      </div>

      <!-- List -->
      <div class="flex-1 overflow-auto custom-scrollbar">
        <div class="min-w-[1600px]" ref="sortableList">
          <div v-if="list.length === 0" class="flex flex-col items-center justify-center py-20 text-[#606060]">
            <i class="el-icon-document text-4xl mb-2 text-[#CCCCCC]"></i>
            <p>{{ c.noData }}</p>
          </div>

          <div v-for="(item, index) in list" :key="item.id" :data-id="item.id" class="grid grid-cols-[200px_150px_150px_150px_150px_80px_80px_80px_80px_80px_100px_140px_100px] gap-4 px-6 py-3 border-b border-[#E5E5E5] hover:bg-[#F9F9F9] items-center text-sm text-[#0D0D0D] cursor-move">
            <div class="truncate" :title="item.name">{{ item.name }}</div>
            <div class="truncate" :title="item.description">{{ item.description }}</div>
            <div class="truncate" :title="item.link">{{ item.link }}</div>
            <div class="truncate" :title="item.file_name">{{ item.file_name }}</div>
            <div class="truncate" :title="item.file_url">{{ item.file_url }}</div>
            <div class="truncate">{{ item.empnopz }}</div>
            <div class="truncate">{{ item.orgidpz }}</div>
            <div class="truncate">{{ item.deptnopz }}</div>
            <div class="truncate">{{ item.otherspz }}</div>
            <div>
               <span
                 class="px-2 py-0.5 rounded text-xs font-medium"
                 :class="item.status == '1' ? 'bg-[#DEF7E5] text-[#069C56]' : 'bg-[#FEF0F0] text-[#F56C6C]'"
               >
                 {{ item.status == '1' ? c.enabled : c.disabled }}
               </span>
            </div>
            <div class="truncate">{{ item.modify_user }}</div>
            <div class="truncate text-xs text-[#606060]">{{ item.modify_time }}</div>

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
    <a-drawer :visible="editFormVisible" :title="l.title" :width="600" @close="editFormVisible = false" :body-style="{ padding: 0 }">
       <div class="flex flex-col h-full bg-white font-roboto">
         <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">

            <!-- Name -->
            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
               <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.name }} ({{ c.required }})</label>
               <input v-model="data.name" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <!-- Description -->
            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
               <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.description }}</label>
               <input v-model="data.description" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <!-- Link -->
            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
               <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.link }}</label>
               <input v-model="data.link" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <!-- Status Switch -->
            <div class="mb-4 flex items-center gap-4">
               <label class="text-sm text-[#0D0D0D]">{{ l.isEnable }}</label>
               <a-switch v-model="statusBool" checked-children="Y" un-checked-children="N" />
            </div>

            <!-- Upload -->
            <div class="mb-4">
               <label class="block text-sm font-medium text-[#0D0D0D] mb-2">{{ l.upload }}</label>
               <ImgUploader
                  v-model="data.file"
                  :show-count="false"
                  :max-count="1"
                  @addImg="addImg"
                  @deleteImg="deleteImg"
               />
            </div>

            <!-- Selects Grid -->
            <div class="grid grid-cols-2 gap-4">
                <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                   <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.empnopzPd || l.empnopz }} ({{ c.required }})</label>
                   <select v-model="data.empnopz" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent appearance-none">
                      <option value="N">N</option>
                      <option value="Y">Y</option>
                   </select>
                </div>
                <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                   <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.orgidpzPd || l.orgidpz }} ({{ c.required }})</label>
                   <select v-model="data.orgidpz" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent appearance-none">
                      <option value="N">N</option>
                      <option value="Y">Y</option>
                   </select>
                </div>
                <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                   <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.deptnopzPd || l.deptnopz }} ({{ c.required }})</label>
                   <select v-model="data.deptnopz" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent appearance-none">
                      <option value="N">N</option>
                      <option value="Y">Y</option>
                   </select>
                </div>
                <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                   <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.otherspzPd || l.otherspz }} ({{ c.required }})</label>
                   <select v-model="data.otherspz" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent appearance-none">
                      <option value="N">N</option>
                      <option value="Y">Y</option>
                   </select>
                </div>
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
import { reactive, ref, computed, getCurrentInstance, onMounted, nextTick, onBeforeUnmount } from 'vue'
import { message, Modal } from 'ant-design-vue'
import api from '@/api'
import { useLocalI18n } from '@/composables/useLocalI18n'
import Button from '@/views/sysbasics/video/adminViews/component/common/Button.vue'
import Pagination from '@/views/sysbasics/video/adminViews/component/common/Pagination.vue'
import ImgUploader from '@/components/Img/Uploader.vue'
import Sortable from 'sortablejs'
import { cloneDeep } from 'lodash'

// Global instance
const instance = getCurrentInstance()
const { $request, $message, $confirm } = instance.proxy

// Localization
const { l, c } = useLocalI18n('adminBanner')

// State
const pageLoading = ref(false)
const submmitLoading = ref(false)
const sortLoading = ref(false)
const editFormVisible = ref(false)
const indexFlag = ref(false)

const list = ref([])
const total = ref(0)
const query = reactive({
  queryString: { str: '', status: '1' },
  size: 10,
  page: 1,
})

const initData = {
   name: '',
   description: '',
   link: '',
   status: '1',
   file: [],
   file_id: '',
   empnopz: 'N',
   orgidpz: 'N',
   deptnopz: 'N',
   otherspz: 'N'
}
const data = reactive({ ...initData })

const sortableList = ref(null)
let sortable = null

// Computed for Switch (1=Enabled, 2=Disabled)
const statusBool = computed({
   get: () => data.status === '1',
   set: (val) => { data.status = val ? '1' : '2' }
})

// Methods
const getList = () => {
  pageLoading.value = true
  // Note: Original code uses generic query logic.
  // The backend likely expects queryString as JSON string if it's complex, or just object.
  // Original `Banner.vue` didn't have `formatQuery`. Wait, `AppVersion` had.
  // `Banner.vue` just passed `query`. `z-table` usually handles it.
  // But wait, `z-table` usually calls `getList` which does request.
  // Here we do request manually.

  $request(api.banner + 'getlist', query)
    .then(r => {
      list.value = r.data.list
      total.value = r.data.total
      pageLoading.value = false
      initSortable()
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
  // Ensure file is array
  data.file = []
  delete data.id
  editFormVisible.value = true
}

const editItem = (item) => {
   Object.assign(data, item)
   data.status = String(data.status) // Ensure string
   // File handling? Original: `this.data.file` was used in Uploader.
   // If backend returns `file_url` but we need `file` array for uploader?
   // Uploader expects array of objects or strings?
   // `Img/Uploader.vue` usually takes array of URLs or objects.
   // If `item.file` is not present, maybe construct it from `file_url`.
   if (!data.file) data.file = []
   if (data.file_url && data.file.length === 0) {
      // Assuming file_url is the image
      data.file = [data.file_url]
   }
   editFormVisible.value = true
}

const deleteItem = (item) => {
  Modal.confirm({
    title: c.value.oprConfirm,
    content: c.value.cfmDelete,
    onOk() {
      pageLoading.value = true
      $request(api.banner + 'delete/' + item.id, {}, 'post')
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

const addImg = (v) => {
   // v is usually [url] or [fileObject] depending on implementation.
   // Original: this.data.file.push(v[0])
   // If Uploader emits `addImg` with array of new images.
   if (v && v.length > 0) {
      // Ensure we only have 1 if max-count is 1
      data.file = [v[0]]
   }
}

const deleteImg = () => {
   data.file_id = ''
   data.file = []
}

const submmit = () => {
   submmitLoading.value = true

   let formData = new FormData()
   if (data.file && data.file[0] && typeof data.file[0] !== 'string') {
      // If it's a file object
      formData.append('file[]', data.file[0])
   }
   // If it's a string (existing url), backend might handle it via `model` json,
   // or we might not need to send `file[]`.

   formData.append('model', JSON.stringify(data))

   $request(api.banner + 'createormodify', formData, 'post')
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

const initSortable = () => {
   nextTick(() => {
      if (sortable) sortable.destroy()
      const el = sortableList.value
      if (!el) return

      sortable = Sortable.create(el, {
         animation: 150,
         ghostClass: 'bg-gray-100',
         onEnd: (evt) => {
            const item = list.value[evt.oldIndex]
            list.value.splice(evt.oldIndex, 1)
            list.value.splice(evt.newIndex, 0, item)
            indexFlag.value = true
         }
      })
   })
}

const updateDetailSort = () => {
   sortLoading.value = true
   const listSortIds = list.value.map(v => v.id)
   $request(api.banner + 'updateSeq', listSortIds, 'post')
     .then(() => {
        sortLoading.value = false
        message.success(c.value.success)
        indexFlag.value = false
        getList()
     })
     .catch(() => {
        sortLoading.value = false
     })
}

onBeforeUnmount(() => {
   if (sortable) sortable.destroy()
})

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
