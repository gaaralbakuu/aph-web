<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.title || 'Workflow Fields' }}</h1>

      <div class="flex gap-2">
        <Button variant="primary" @click="createItem">
          <i class="el-icon-plus mr-2"></i>
          {{ c.create }}
        </Button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-hidden p-4 flex gap-4">

      <!-- LEFT: Master List -->
      <div class="flex flex-col bg-white border border-[#E5E5E5] rounded shadow-sm transition-all duration-300" :class="detailFlag ? 'w-[45%]' : 'w-full'">
        <div class="p-3 border-b border-[#E5E5E5] flex items-center gap-2">
           <div class="flex-1 relative">
             <i class="el-icon-search absolute left-2 top-1/2 -translate-y-1/2 text-[#606060]"></i>
             <input
               v-model="query.queryString.str"
               type="text"
               :placeholder="l.search"
               class="w-full pl-8 pr-2 py-1.5 text-sm border border-[#CCCCCC] rounded outline-none focus:border-[#065FD4]"
               @keyup.enter="researchMain"
             />
           </div>
           <Button variant="secondary" size="sm" @click="researchMain">{{ c.queryButton }}</Button>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar">
           <!-- Header -->
           <div class="grid grid-cols-[1fr_80px_80px_100px_140px_120px] px-4 py-2 bg-[#F9F9F9] text-xs font-medium text-[#606060] border-b border-[#E5E5E5]">
              <div>{{ l.name }}</div>
              <div>{{ l.process_code }}</div>
              <div>{{ l.status }}</div>
              <div>{{ c.modify_user }}</div>
              <div>{{ c.modify_time }}</div>
              <div class="text-right">{{ c.action }}</div>
           </div>

           <div v-if="list.length === 0" class="p-4 text-center text-[#606060] text-sm">{{ c.noData }}</div>

           <div
             v-for="item in list"
             :key="item.id"
             class="grid grid-cols-[1fr_80px_80px_100px_140px_120px] px-4 py-3 border-b border-[#E5E5E5] hover:bg-[#F0F8FF] cursor-pointer text-sm items-center transition-colors"
             :class="queryDetail.queryString.parentId === item.id ? 'bg-[#E8F4FF] border-l-4 border-l-[#065FD4]' : ''"
             @click="clickDetail(item)"
           >
              <div class="truncate" :title="item.name">{{ item.name }}</div>
              <div class="truncate" :title="item.process_code">{{ item.process_code }}</div>
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

              <div class="flex justify-end gap-2 text-[#606060]">
                 <a
                   class="text-xs font-medium hover:underline"
                   :class="item.status == '1' ? 'text-[#E6A23C]' : 'text-[#069C56]'"
                   @click.stop="disOrEnable(item)"
                 >
                    {{ item.status == '1' ? c.disable : c.enable }}
                 </a>
                 <i class="el-icon-edit hover:text-[#065FD4]" @click.stop="editItem(item)"></i>
                 <i class="el-icon-delete hover:text-[#CC0000]" @click.stop="deleteItem(item)"></i>
              </div>
           </div>
        </div>

        <div class="p-2 border-t border-[#E5E5E5]">
           <Pagination
             :page="query.page"
             :pageSize="query.size"
             :total="total"
             :l="l"
             simple
             @update:page="query.page = $event"
             @update:pageSize="query.size = $event"
             @change="getList"
           />
        </div>
      </div>

      <!-- RIGHT: Details List -->
      <div v-if="detailFlag" class="flex-1 flex flex-col bg-white border border-[#E5E5E5] rounded shadow-sm overflow-hidden">
        <div class="p-3 border-b border-[#E5E5E5] flex justify-between items-center h-[60px]">
           <div class="flex items-center gap-2 flex-1">
              <span class="text-sm font-medium whitespace-nowrap">Version:</span>
              <select v-model="versionProcessSelected" class="border border-[#CCCCCC] rounded px-2 py-1 text-sm outline-none focus:border-[#065FD4] max-w-[150px]" @change="changeVersionProcess">
                 <option v-for="v in versionProcess" :key="v.value" :value="v.value">{{ v.label }}</option>
              </select>
           </div>
           <div class="flex gap-2">
              <Button v-if="indexFlag" :loading="sortLoading" variant="secondary" size="sm" @click="updateDetailSort">
                 {{ c.saveIndex }}
              </Button>
              <Button variant="primary" size="sm" @click="openDetail">
                 <i class="el-icon-plus mr-1"></i>
                 {{ l.addDetail || 'Add Detail' }}
              </Button>
           </div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar">
           <!-- Header -->
           <div class="grid grid-cols-[120px_1fr_80px_100px_140px_120px] px-4 py-2 bg-[#F9F9F9] text-xs font-medium text-[#606060] border-b border-[#E5E5E5]">
              <div>{{ l.detialNmae }}</div>
              <div>{{ l.field_json }}</div>
              <div>{{ l.status }}</div>
              <div>{{ c.modify_user }}</div>
              <div>{{ c.modify_time }}</div>
              <div class="text-right">{{ c.action }}</div>
           </div>

           <div class="min-w-full" ref="sortableDetailList">
              <div v-if="listDetail.length === 0" class="p-4 text-center text-[#606060] text-sm">{{ c.noData }}</div>

              <div
                v-for="item in listDetail"
                :key="item.id"
                :data-id="item.id"
                class="grid grid-cols-[120px_1fr_80px_100px_140px_120px] px-4 py-3 border-b border-[#E5E5E5] hover:bg-[#F9F9F9] items-center text-sm text-[#0D0D0D] cursor-move"
              >
                 <div class="truncate" :title="item.name">{{ item.name }}</div>
                 <div class="truncate" :title="item.field_json">{{ item.field_json }}</div>
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

                 <div class="flex justify-end gap-2 text-[#606060]">
                    <a
                      class="text-xs font-medium hover:underline"
                      :class="item.status == '1' ? 'text-[#E6A23C]' : 'text-[#069C56]'"
                      @click.stop="disOrEnable(item)"
                    >
                       {{ item.status == '1' ? c.disable : c.enable }}
                    </a>
                    <i class="el-icon-edit hover:text-[#065FD4]" @click.stop="editDetail(item)"></i>
                    <i class="el-icon-delete hover:text-[#CC0000]" @click.stop="deleteDetail(item)"></i>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>

    <!-- Master Drawer -->
    <a-drawer :visible="editFormVisible" :title="name" :width="500" @close="editFormVisible = false" :body-style="{ padding: 0 }">
       <div class="flex flex-col h-full bg-white font-roboto">
         <div class="flex-1 p-6">
            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.name }}</label>
              <input v-model="data.name" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.process_code }}</label>
              <input v-model="data.process_code" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <div class="flex items-center gap-4">
               <label class="text-sm text-[#0D0D0D]">{{ l.isEnable }}</label>
               <a-switch v-model="statusBool" checked-children="Y" un-checked-children="N" />
            </div>
         </div>
         <div class="border-t border-[#E5E5E5] p-4 flex justify-end items-center gap-2 bg-white">
           <Button variant="ghost" @click="editFormVisible = false">{{ c.cancel }}</Button>
           <Button variant="primary" :disabled="submmitLoading" @click="submmit">{{ c.confirm }}</Button>
         </div>
       </div>
    </a-drawer>

    <!-- Detail Drawer -->
    <a-drawer :visible="visibleDetail" :title="l.detailField + (dataDetail ? c.edit : c.create)" :width="700" @close="visibleDetail = false" :body-style="{ padding: 0 }">
       <div class="flex flex-col h-full bg-white font-roboto">
         <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">

            <div class="grid grid-cols-2 gap-4 mb-4">
               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.detailNamePd || 'Name' }}</label>
                  <input v-model="dataMain.name" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
               </div>

               <div class="flex items-center gap-4 pl-2">
                  <label class="text-sm font-medium">Activate</label>
                  <a-switch v-model="dataMainStatusBool" checked-children="Y" un-checked-children="N" />
               </div>
            </div>

            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
               <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.detailTitlePd || 'Detail Title' }}</label>
               <input v-model="dataDetail.title" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <div class="mb-2 font-medium text-sm">Fields List</div>
            <div v-for="(item, index) in dataDetail.list" :key="index" class="flex gap-2 mb-2 items-center">
               <div class="flex-1 relative group border border-[#CCCCCC] rounded px-2 py-1 bg-white focus-within:border-[#065FD4]">
                  <input v-model="item.key" :placeholder="l.detailKeyPd || 'Key'" class="w-full outline-none text-sm bg-transparent" />
               </div>
               <div class="flex-1 relative group border border-[#CCCCCC] rounded px-2 py-1 bg-white focus-within:border-[#065FD4]">
                  <input v-model="item.label" :placeholder="l.detailLabelPd || 'Label'" class="w-full outline-none text-sm bg-transparent" />
               </div>
               <div class="flex items-center gap-1">
                  <input type="checkbox" v-model="item.enter" class="cursor-pointer" />
                  <span class="text-xs">Line Break</span>
               </div>
               <div class="flex items-center gap-1">
                  <i class="el-icon-remove text-[#CC0000] text-xl cursor-pointer hover:opacity-80" @click="removeItem(index)"></i>
                  <i v-if="index == dataDetail.list.length - 1" class="el-icon-circle-plus text-[#065FD4] text-xl cursor-pointer hover:opacity-80" @click="addItem()"></i>
               </div>
            </div>

            <div class="mt-4 flex flex-wrap gap-2">
               <span
                  v-for="item in listField" :key="item"
                  class="px-2 py-1 bg-[#E8F4FF] text-[#065FD4] text-xs rounded cursor-pointer hover:bg-[#D1E9FF]"
                  @click="copyToClipboard(item)"
               >
                  {{ item }}
               </span>
            </div>

         </div>
         <div class="border-t border-[#E5E5E5] p-4 flex justify-end items-center gap-2 bg-white">
           <Button variant="ghost" @click="visibleDetail = false">{{ c.cancel }}</Button>
           <Button variant="primary" :loading="submmitLoadingDetail" @click="submmitDetail">{{ c.confirm }}</Button>
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
import Sortable from 'sortablejs'
import { cloneDeep } from 'lodash'

// Global instance
const instance = getCurrentInstance()
const { $request, $message, $confirm } = instance.proxy

// Localization
const { l, c } = useLocalI18n('adminWorkflowFields')
const name = computed(() => l.value.title || 'Workflow Fields')

// State
const pageLoading = ref(false)
const submmitLoading = ref(false)
const submmitLoadingDetail = ref(false)
const sortLoading = ref(false)
const editFormVisible = ref(false)
const visibleDetail = ref(false)
const detailFlag = ref(false)
const indexFlag = ref(false)

// Master List
const list = ref([])
const total = ref(0)
const query = reactive({
  queryString: { str: '' },
  size: 10,
  page: 1,
})

const initData = {
   name: '',
   process_code: '',
   status: '1'
}
const data = reactive({ ...initData })

// Detail List
const listDetail = ref([])
const totalDetail = ref(0)
const queryDetail = reactive({
   queryString: { parentId: '' },
   size: 99,
   page: 1
})
const versionProcess = ref([])
const versionProcessSelected = ref('')
const listField = ref([])
const listSortIds = ref([])
const processCode = ref('')

const dataMain = reactive({})
const dataDetailInit = {
   title: '',
   type: 'info',
   list: [{ key: '', type: '', label: '', enter: false }]
}
const dataDetail = reactive({ ...dataDetailInit })

const sortableDetailList = ref(null)
let sortable = null

// Computed
const statusBool = computed({
   get: () => data.status === '1',
   set: (val) => { data.status = val ? '1' : '2' }
})

const dataMainStatusBool = computed({
   get: () => dataMain.status === '1',
   set: (val) => { dataMain.status = val ? '1' : '2' }
})

// Methods
const getList = () => {
  pageLoading.value = true
  $request(api.workflowField + 'getlist', query)
    .then(r => {
      list.value = r.data.list
      total.value = r.data.total
      pageLoading.value = false
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const researchMain = () => {
  listDetail.value = []
  detailFlag.value = false
  query.page = 1
  getList()
}

const createItem = () => {
  Object.assign(data, initData)
  delete data.id
  editFormVisible.value = true
}

const editItem = (item) => {
   Object.assign(data, item)
   data.status = String(data.status)
   editFormVisible.value = true
}

const deleteItem = (item) => {
  Modal.confirm({
    title: c.value.oprConfirm,
    content: c.value.cfmDelete,
    onOk() {
      pageLoading.value = true
      $request(api.workflowField + 'delete/' + item.id, {}, 'post')
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

const disOrEnable = (item) => {
   const statusMap = { 1: c.value.disable, 2: c.value.enable }
   Modal.confirm({
      title: c.value.oprConfirm,
      content: `${statusMap[item.status]} ${l.value.record || 'record'}?`,
      onOk() {
         pageLoading.value = true
         $request(api.workflowField + 'DisOrEnable/' + item.id, {}, 'post')
           .then(() => {
              pageLoading.value = false
              message.success(c.value.success)
              if (item.parent_id) getDetailList()
              if (!item.parent_id) getList()
           })
           .catch(() => {
              pageLoading.value = false
           })
      }
   })
}

const submmit = () => {
   submmitLoading.value = true
   const url = api.workflowField + 'addormodify'
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

// Detail Logic
const clickDetail = (v) => {
   Object.assign(dataMain, {})
   processCode.value = ''
   Object.assign(dataDetail, cloneDeep(dataDetailInit))

   if (v) {
      queryDetail.queryString.parentId = v.id
      processCode.value = v.process_code
      getListVersion(v.process_code)
   }
   detailFlag.value = true
}

const getListVersion = (id) => {
   $request(api.param + 'getlistversion', { id: id })
     .then(r => {
        if (r.data.length != 0) {
           versionProcessSelected.value = r.data[0].OID
        } else {
           versionProcessSelected.value = ''
        }
        versionProcess.value = r.data.map(item => ({ value: item.OID, label: item.VERSION }))
        getDetailList()
     })
}

const changeVersionProcess = () => {
   getDetailList()
}

const getDetailList = () => {
   pageLoading.value = true
   const url = api.workflowField + 'getlist'
   const q = cloneDeep(queryDetail)
   q.queryString = JSON.stringify({
      ...queryDetail.queryString,
      oid: versionProcessSelected.value
   })

   $request(url, q)
     .then(r => {
        pageLoading.value = false
        listDetail.value = r.data.list
        listSortIds.value = listDetail.value.map(v => v.id)
        initSortable()
     })
     .catch(() => {
        pageLoading.value = false
     })

   $request(api.param + 'getparamshow', { id: versionProcessSelected.value }, 'get')
     .then(r => {
        listField.value = r.data
     })
}

const openDetail = () => {
   Object.assign(dataMain, { status: '1' })
   visibleDetail.value = true
   Object.assign(dataDetail, cloneDeep(dataDetailInit))
}

const editDetail = (v) => {
   $request(api.workflowField + 'getbyid', { id: v.id })
     .then(r => {
        const d = r.data
        if (d) {
           Object.assign(dataMain, {
              id: d.id,
              process_code: d.process_code,
              name: d.name,
              sort: d.sort,
              status: String(d.status)
           })
           if (d.field_json) {
              Object.assign(dataDetail, JSON.parse(d.field_json))
           }
        }
        visibleDetail.value = true
     })
}

const deleteDetail = (v) => {
   Modal.confirm({
      title: c.value.oprConfirm,
      content: c.value.cfmDelete,
      onOk() {
         pageLoading.value = true
         $request(api.workflowField + 'delete/' + v.id, {}, 'post')
           .then(() => {
              pageLoading.value = false
              message.success(c.value.success)
              getDetailList()
           })
           .catch(() => {
              pageLoading.value = false
           })
      }
   })
}

const submmitDetail = () => {
   submmitLoadingDetail.value = true
   const url = api.workflowField + 'addormodify'
   const ver = versionProcess.value.find(x => x.value == versionProcessSelected.value)

   const obj = {
      field_json: JSON.stringify(dataDetail),
      parent_id: queryDetail.queryString.parentId,
      process_code: processCode.value,
      status: dataMain.status,
      oid: versionProcessSelected.value,
      version: ver ? ver.label : '',
      ...dataMain
   }

   $request(url, obj, 'post')
     .then(() => {
        submmitLoadingDetail.value = false
        message.success(c.value.success)
        visibleDetail.value = false
        getDetailList()
     })
     .catch(() => {
        submmitLoadingDetail.value = false
     })
}

const initSortable = () => {
   nextTick(() => {
      if (sortable) sortable.destroy()
      const el = sortableDetailList.value
      if (!el) return

      sortable = Sortable.create(el, {
         animation: 150,
         ghostClass: 'bg-gray-100',
         onEnd: (evt) => {
            const tmp = listSortIds.value[evt.oldIndex]
            listSortIds.value[evt.oldIndex] = listSortIds.value[evt.newIndex]
            listSortIds.value[evt.newIndex] = tmp
            indexFlag.value = true
         }
      })
   })
}

const updateDetailSort = () => {
   sortLoading.value = true
   $request(api.workflowField + 'UpdateSort', listSortIds.value, 'post')
     .then(() => {
        sortLoading.value = false
        message.success(c.value.success)
        getDetailList()
        indexFlag.value = false
     })
     .catch(() => {
        sortLoading.value = false
     })
}

const addItem = () => {
   dataDetail.list.push({ key: '', label: '', enter: false })
}

const removeItem = (i) => {
   dataDetail.list.splice(i, 1)
   if (dataDetail.list.length == 0) addItem()
}

const copyToClipboard = (text) => {
   if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
         message.success('Copied')
      })
   } else {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      try {
         document.execCommand('copy')
         message.success('Copied')
      } catch (err) {
         message.error('Copy failed')
      }
      document.body.removeChild(textarea)
   }
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
