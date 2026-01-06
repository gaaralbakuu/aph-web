<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.title || 'Dictionary Management' }}</h1>

      <div class="flex gap-2">
        <Button variant="primary" @click="createItem">
          <i class="el-icon-plus mr-2"></i>
          {{ c.create }}
        </Button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-hidden p-4 flex gap-4">

      <!-- LEFT: Dictionary List -->
      <div class="w-[500px] flex flex-col bg-white border border-[#E5E5E5] rounded shadow-sm">
        <div class="p-3 border-b border-[#E5E5E5] flex items-center gap-2">
           <div class="flex-1 relative">
             <i class="el-icon-search absolute left-2 top-1/2 -translate-y-1/2 text-[#606060]"></i>
             <input
               v-model="query.queryString"
               type="text"
               :placeholder="c.queryPlaceholder"
               class="w-full pl-8 pr-2 py-1.5 text-sm border border-[#CCCCCC] rounded outline-none focus:border-[#065FD4]"
               @keyup.enter="research"
             />
           </div>
           <Button variant="secondary" size="sm" @click="research">{{ c.queryButton }}</Button>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar">
           <!-- Header for list -->
           <div class="grid grid-cols-[140px_120px_1fr_80px] px-4 py-2 bg-[#F9F9F9] text-xs font-medium text-[#606060] border-b border-[#E5E5E5]">
              <div>{{ l.type }}</div>
              <div>{{ l.label }}</div>
              <div>{{ l.description }}</div>
              <div class="text-right">{{ c.action }}</div>
           </div>

           <div v-if="list.length === 0" class="p-4 text-center text-[#606060] text-sm">{{ c.noData }}</div>

           <div
             v-for="item in list"
             :key="item.id"
             class="grid grid-cols-[140px_120px_1fr_80px] px-4 py-3 border-b border-[#E5E5E5] hover:bg-[#F0F8FF] cursor-pointer text-sm items-center transition-colors"
             :class="currentDataId === item.id ? 'bg-[#E8F4FF] border-l-4 border-l-[#065FD4]' : ''"
             @click="getChildrenTree(item)"
           >
              <div class="truncate" :title="item.type">{{ item.type }}</div>
              <div class="truncate" :title="item.label">{{ item.label }}</div>
              <div class="truncate" :title="item.description">{{ item.description }}</div>
              <div class="flex justify-end gap-2 text-[#606060]">
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

      <!-- RIGHT: Dictionary Items Tree -->
      <div class="flex-1 flex flex-col bg-white border border-[#E5E5E5] rounded shadow-sm overflow-hidden">
        <div class="p-3 border-b border-[#E5E5E5] flex justify-between items-center h-[57px]">
           <div class="text-sm font-medium">
             {{ currentDataId ? (l.indexDescription || 'Dictionary Items') : (l.selectFirst || 'Select a dictionary to view items') }}
           </div>
           <div v-if="currentDataId" class="flex gap-2">
              <Button v-if="indexChangeFlag" :loading="sortLoading" variant="secondary" size="sm" @click="saveIndex">
                 {{ l.saveIndex || 'Save Order' }}
              </Button>
              <Button variant="primary" size="sm" @click="createNode(null)">
                 <i class="el-icon-plus mr-1"></i>
                 {{ l.addItem || c.create }}
              </Button>
           </div>
        </div>

        <div class="flex-1 overflow-y-auto p-4 custom-scrollbar" v-if="currentDataId">
           <el-tree
              ref="treeRef"
              :data="treeData"
              node-key="id"
              default-expand-all
              :expand-on-click-node="false"
              draggable
              :allow-drop="nodeIndexCheck"
              @node-drop="afterDrop"
           >
             <template #default="{ node, data }">
               <div class="flex-1 flex items-center justify-between text-sm pr-2 group">
                  <div class="flex items-center gap-2">
                     <span class="font-medium">{{ node.label }}</span>
                     <span class="text-[#999999] text-xs">-- {{ data.value }}</span>
                  </div>

                  <div class="flex gap-3 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <i class="el-icon-edit text-[#606060] hover:text-[#065FD4] cursor-pointer" :title="c.edit" @click.stop="editNode(data)"></i>
                     <i class="el-icon-plus text-[#606060] hover:text-[#069C56] cursor-pointer" :title="l.createNode" @click.stop="createNode(data)"></i>
                     <i class="el-icon-folder-add text-[#606060] hover:text-[#E6A23C] cursor-pointer" :title="l.createChildNode" @click.stop="createChildNode(data)"></i>
                     <i class="el-icon-delete text-[#606060] hover:text-[#CC0000] cursor-pointer" :title="c.delete" @click.stop="removeNode(data)"></i>
                  </div>
               </div>
             </template>
           </el-tree>
        </div>
        <div v-else class="flex-1 flex items-center justify-center text-[#999999]">
           <i class="el-icon-collection text-4xl"></i>
        </div>
      </div>
    </div>

    <!-- Edit Dictionary Drawer -->
    <a-drawer :visible="editFormVisible" :title="name" :width="500" @close="editFormVisible = false" :body-style="{ padding: 0 }">
       <div class="flex flex-col h-full bg-white font-roboto">
         <div class="flex-1 p-6">
            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.type }}</label>
              <input v-model="data.type" :disabled="!!data.id" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.label }}</label>
              <input v-model="data.label" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.description }}</label>
              <input v-model="data.description" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.remarks }}</label>
              <textarea v-model="data.remarks" rows="3" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent resize-none"></textarea>
            </div>
         </div>
         <div class="border-t border-[#E5E5E5] p-4 flex justify-end items-center gap-2 bg-white">
           <Button variant="ghost" @click="editFormVisible = false">{{ c.cancel }}</Button>
           <Button variant="primary" :disabled="submmitLoading" @click="submmit">{{ c.confirm }}</Button>
         </div>
       </div>
    </a-drawer>

    <!-- Edit Item Drawer -->
    <a-drawer :visible="editNodeFormVisible" :title="l.title" :width="600" @close="editNodeFormVisible = false" :body-style="{ padding: 0 }">
       <div class="flex flex-col h-full bg-white font-roboto">
         <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">

            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
               <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.itemValue }}</label>
               <input v-model="nodeData.value" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <!-- Multi-lang Labels -->
            <div class="mb-4">
               <label class="block text-sm font-medium text-[#0D0D0D] mb-2">{{ l.itemLabel }}</label>
               <div v-for="(v, i) in labelData" :key="i" class="flex gap-2 mb-2 items-start">
                  <div class="w-1/3 relative border border-[#CCCCCC] rounded px-2 py-1 bg-white">
                     <select v-model="v.key" class="w-full outline-none text-sm bg-transparent appearance-none">
                        <option value="" disabled>{{ c.selectLang }}</option>
                        <option v-for="(item, index) in langOptions" :key="index" :value="item.param_value">{{ item.param_condition1 }}</option>
                     </select>
                  </div>
                  <div class="flex-1 relative border border-[#CCCCCC] rounded px-2 py-1 bg-white focus-within:border-[#065FD4]">
                     <input v-model="v.label" :placeholder="l.itemLabelPlaceholder" class="w-full outline-none text-sm bg-transparent" />
                  </div>
                  <div class="flex items-center gap-1 mt-1">
                     <i class="el-icon-remove text-[#CC0000] text-xl cursor-pointer hover:opacity-80" @click="removeItem(i)"></i>
                     <i v-if="i == labelData.length - 1" class="el-icon-circle-plus text-[#065FD4] text-xl cursor-pointer hover:opacity-80" @click="addItem()"></i>
                  </div>
               </div>
            </div>

         </div>
         <div class="border-t border-[#E5E5E5] p-4 flex justify-end items-center gap-2 bg-white">
           <Button variant="ghost" @click="editNodeFormVisible = false">{{ c.cancel }}</Button>
           <Button variant="primary" :loading="submmitLoading" @click="submmitNode">{{ c.confirm }}</Button>
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
import { expendsTree, generateTree } from '@/utils'
import { useLocalI18n } from '@/composables/useLocalI18n'
import Button from '@/views/sysbasics/video/adminViews/component/common/Button.vue'
import Pagination from '@/views/sysbasics/video/adminViews/component/common/Pagination.vue'

// Global instance
const instance = getCurrentInstance()
const { $request, $message, $confirm } = instance.proxy

// Localization
const { l, c } = useLocalI18n('adminDictionary')
const name = computed(() => l.value.title || 'Dictionary')

// State
const pageLoading = ref(false)
const submmitLoading = ref(false)
const sortLoading = ref(false)
const editFormVisible = ref(false)
const editNodeFormVisible = ref(false)
const indexChangeFlag = ref(false)

const currentDataId = ref(0)
const currentRow = ref({})

// List Data
const list = ref([])
const total = ref(0)
const query = reactive({
  queryString: '',
  size: 10,
  page: 1,
})

// Tree Data
const treeData = ref([])

// Forms
const data = reactive({
  type: '',
  label: '',
  description: '',
  remarks: ''
})

const nodeData = reactive({})
const labelData = ref([{ key: '', label: '' }])
const langOptions = ref([])

// Methods
const getList = () => {
  pageLoading.value = true
  $request(api.dictionary + 'getlist', query)
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
  Object.assign(data, {
     type: '',
     label: '',
     description: '',
     remarks: ''
  })
  delete data.id
  editFormVisible.value = true
}

const editItem = (item) => {
  Object.assign(data, item)
  editFormVisible.value = true
}

const deleteItem = (item) => {
  Modal.confirm({
    title: c.value.oprConfirm,
    content: c.value.cfmDelete,
    onOk() {
      pageLoading.value = true
      $request(api.dictionary + 'delete/' + item.id, {}, 'post')
        .then(() => {
           message.success(c.value.success)
           pageLoading.value = false
           if (currentDataId.value === item.id) {
              currentDataId.value = 0
              treeData.value = []
           }
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
  const url = api.dictionary + (data.id ? 'update' : 'save')
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

// Tree Methods
const getChildrenTree = (row) => {
  currentDataId.value = row ? row.id : 0
  currentRow.value = row || {}
  indexChangeFlag.value = false
  refreshTree()
}

const refreshTree = () => {
  if (currentDataId.value) {
    pageLoading.value = true
    $request(api.dictionary + 'getchildren', { parentId: currentDataId.value })
      .then(r => {
        let d = r.data
        d.forEach(v => {
           if (v.labelArray && v.labelArray.includes('[{"key":')) {
              try {
                 v.labelArray = JSON.parse(v.labelArray)
              } catch(e) { v.labelArray = [] }
           }
        })
        treeData.value = generateTree(d, 'id', 'parent_id', currentDataId.value)
        pageLoading.value = false
      })
      .catch((e) => {
        console.error(e)
        pageLoading.value = false
      })
  } else {
    treeData.value = []
  }
}

const createNode = (pData) => {
  labelData.value = [{ key: '', label: '' }]
  if (pData) {
     Object.assign(nodeData, {
        parent_id: pData.parent_id, // Wait, sibling? Original code used parent_id: data.parent_id for createNode(data)
        value: '',
        type: pData.type
     })
  } else {
     // Root node in this context (child of dictionary type)
     Object.assign(nodeData, {
        parent_id: currentDataId.value,
        value: '',
        type: currentRow.value.type
     })
  }
  // Remove ID
  delete nodeData.id
  editNodeFormVisible.value = true
}

const createChildNode = (pData) => {
   Object.assign(nodeData, {
      parent_id: pData.id,
      value: '',
      type: pData.type
   })
   delete nodeData.id
   labelData.value = [{ key: '', label: '' }]
   editNodeFormVisible.value = true
}

const editNode = (pData) => {
   if (pData.labelArray && Array.isArray(pData.labelArray)) {
      labelData.value = [...pData.labelArray]
   } else {
      labelData.value = [{ key: '', label: pData.label || '' }]
   }
   Object.assign(nodeData, pData)
   delete nodeData.label
   editNodeFormVisible.value = true
}

const submmitNode = () => {
   const url = api.dictionary + (nodeData.id ? 'update' : 'save')
   const d = { ...nodeData }
   delete d.children

   submmitLoading.value = true
   const payload = {
      label: JSON.stringify(labelData.value),
      ...d
   }

   $request(url, payload, 'post')
     .then(() => {
        submmitLoading.value = false
        message.success(c.value.success)
        editNodeFormVisible.value = false
        refreshTree()
     })
     .catch(() => {
        submmitLoading.value = false
     })
}

const removeNode = (pData) => {
  Modal.confirm({
    title: c.value.oprConfirm,
    content: c.value.cfmDelete,
    onOk() {
      pageLoading.value = true
      $request(api.dictionary + 'delete/' + pData.id, {}, 'post')
        .then(() => {
           message.success(c.value.success)
           pageLoading.value = false
           refreshTree()
        })
        .catch(() => {
           pageLoading.value = false
        })
    }
  })
}

const saveIndex = () => {
  var tmp = expendsTree(treeData.value)
  var d = tmp.map((i, index) => ({
    id: i.id,
    parent_id: i.parent_id,
    sorting: index,
  }))
  sortLoading.value = true
  $request(api.dictionary + 'sort', d, 'post')
    .then(() => {
       sortLoading.value = false
       message.success(c.value.success)
       indexChangeFlag.value = false
       refreshTree()
    })
    .catch(() => {
       sortLoading.value = false
    })
}

const nodeIndexCheck = (draggingNode, dropNode, type) => {
  if (dropNode.data.parent_id == draggingNode.data.parent_id) {
    return type === 'prev' || type === 'next'
  }
}

const afterDrop = () => {
  indexChangeFlag.value = true
}

const addItem = () => {
  labelData.value.push({ key: '', label: '' })
}

const removeItem = (i) => {
  labelData.value.splice(i, 1)
  if (labelData.value.length == 0) addItem()
}

const getLanguageList = () => {
  $request(api.param + 'getbyType', { type: 'AppSettings', name: 'Language' })
    .then((r) => {
      langOptions.value = r.data
    })
    .catch(() => {})
}

// Lifecycle
onMounted(() => {
  getLanguageList()
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
