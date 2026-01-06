<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.title || 'Menu Management' }}</h1>
      <div class="flex gap-2">
         <Button v-if="indexChangeFlag" :loading="sortLoading" variant="secondary" @click="saveIndex">
           {{ c.saveIndex || 'Save Order' }}
         </Button>
         <Button variant="primary" @click="createNode(null)" v-if="treeData.length === 0">
           <i class="el-icon-plus mr-2"></i>
           {{ c.addItem }}
         </Button>
      </div>
    </div>

    <!-- Content -->
    <div class="flex-1 overflow-hidden p-6">
      <div class="bg-white border border-[#E5E5E5] rounded shadow-sm h-full flex flex-col">
         <!-- Toolbar inside content -->
         <div class="p-4 border-b border-[#E5E5E5] flex justify-between items-center bg-[#F9F9F9]">
            <span class="text-xs text-[#606060]">{{ c.indexDescription || 'Drag and drop to reorder menus.' }}</span>
            <Button v-if="treeData.length > 0" variant="primary" size="sm" @click="createNode(null)">
               <i class="el-icon-plus mr-1"></i>
               {{ c.addItem }}
            </Button>
         </div>

         <!-- Tree -->
         <div class="flex-1 overflow-y-auto custom-scrollbar p-4">
            <el-tree
              ref="treeRef"
              :data="treeData"
              node-key="id"
              :default-expand-all="false"
              :expand-on-click-node="false"
              draggable
              :allow-drop="nodeIndexCheck"
              @node-drop="afterDrop"
            >
              <template #default="{ node, data }">
                 <div class="flex-1 flex items-center justify-between text-sm pr-2 group">
                    <div class="flex items-center gap-3 overflow-hidden">
                       <span
                         class="px-2 py-0.5 rounded text-[10px] font-medium min-w-[40px] text-center"
                         :class="{
                           'bg-[#E5F6FD] text-[#065FD4]': data.resource_type == 'APP',
                           'bg-[#DEF7E5] text-[#069C56]': data.resource_type == 'WEB',
                           'bg-[#FEF0F0] text-[#F56C6C]': data.resource_type == 'MENU'
                         }"
                       >
                         {{ data.resource_type }}
                       </span>
                       <span class="font-medium text-[#0D0D0D] truncate">{{ data.menu_name_label }}</span>
                       <span class="text-xs text-[#999999] font-normal truncate">{{ data.resource_path }}</span>
                       <span v-if="data.image_url" class="text-xs text-[#999999] font-normal ml-2"><i :class="data.image_url"></i></span>
                    </div>

                    <div class="flex gap-4 items-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <!-- Enable/Disable -->
                       <div class="cursor-pointer" @click.stop="disableOrEnable(data)" :title="data.enabled == 1 ? c.enabled : c.disabled">
                          <i v-if="data.enabled == 1" class="el-icon-open text-[#065FD4] text-lg"></i>
                          <i v-else class="el-icon-turn-off text-[#999999] text-lg"></i>
                       </div>

                       <!-- Actions -->
                       <i class="el-icon-edit text-[#606060] hover:text-[#065FD4] cursor-pointer" :title="c.edit" @click.stop="editNode(data)"></i>
                       <i class="el-icon-plus text-[#606060] hover:text-[#069C56] cursor-pointer" :title="c.createNode" @click.stop="createNode(data)"></i>

                       <!-- Create Child (only for MENU) -->
                       <i
                         class="el-icon-folder-add cursor-pointer"
                         :class="data.resource_type == 'MENU' ? 'text-[#606060] hover:text-[#E6A23C]' : 'text-transparent pointer-events-none'"
                         :title="c.createChildNode"
                         @click.stop="createChildNode(data)"
                       ></i>

                       <i class="el-icon-delete text-[#606060] hover:text-[#CC0000] cursor-pointer" :title="c.delete" @click.stop="removeNode(data)"></i>
                    </div>
                 </div>
              </template>
            </el-tree>
         </div>
      </div>
    </div>

    <!-- Drawer -->
    <a-drawer :visible="editNodeFormVisible" :title="l.title" :width="600" @close="editNodeFormVisible = false" :body-style="{ padding: 0 }">
       <div class="flex flex-col h-full bg-white font-roboto">
         <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">

            <!-- Resource Type -->
            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
               <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.resourcetType }}</label>
               <select v-model="nodeData.resource_type" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent appearance-none">
                  <option v-for="(item, index) in options" :key="index" :value="item.value">{{ item.label }}</option>
               </select>
            </div>

            <!-- Resource Path -->
            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
               <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.resourcePath }}</label>
               <input v-model="nodeData.resource_path" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <!-- Icon -->
            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
               <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.imageUrl }}</label>
               <input v-model="nodeData.image_url" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" placeholder="e.g. el-icon-user" />
            </div>

            <!-- Is Show -->
            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
               <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.isshow }}</label>
               <select v-model="nodeData.is_show" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent appearance-none">
                  <option value="Y">Y</option>
                  <option value="N">N</option>
               </select>
            </div>

            <!-- Multi-lang Labels -->
            <div class="mb-4">
               <label class="block text-sm font-medium text-[#0D0D0D] mb-2">{{ l.menuName }}</label>
               <div v-for="(v, i) in labelData" :key="i" class="flex gap-2 mb-2 items-start">
                  <div class="w-1/3 relative border border-[#CCCCCC] rounded px-2 py-1 bg-white">
                     <select v-model="v.key" class="w-full outline-none text-sm bg-transparent appearance-none">
                        <option value="" disabled>{{ c.selectLang }}</option>
                        <option v-for="(item, index) in langOptions" :key="index" :value="item.param_value">{{ item.param_condition1 }}</option>
                     </select>
                  </div>
                  <div class="flex-1 relative border border-[#CCCCCC] rounded px-2 py-1 bg-white focus-within:border-[#065FD4]">
                     <input v-model="v.label" :placeholder="l.menuNamePlaceholder" class="w-full outline-none text-sm bg-transparent" />
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
import { reactive, ref, computed, getCurrentInstance, onMounted, watch } from 'vue'
import { message, Modal } from 'ant-design-vue'
import api from '@/api'
import { dateTools, expendsTree, generateTree } from '@/utils'
import { useLocalI18n } from '@/composables/useLocalI18n'
import Button from '@/views/sysbasics/video/adminViews/component/common/Button.vue'

// Global instance
const instance = getCurrentInstance()
const { $request, $message, $confirm } = instance.proxy

// Localization
const { l, c } = useLocalI18n('adminMenu')

// State
const pageLoading = ref(false)
const submmitLoading = ref(false)
const sortLoading = ref(false)
const editNodeFormVisible = ref(false)
const indexChangeFlag = ref(false)

const treeData = ref([])
const langOptions = ref([])

const options = computed(() => [
  { label: l.value.directory || 'Directory', value: 'MENU' },
  { label: l.value.web || 'WEB', value: 'WEB' },
  { label: l.value.app || 'APP', value: 'APP' },
])

// Form Data
const nodeData = reactive({})
const labelData = ref([{ key: '', label: '' }])

// Methods
const getLanguageList = () => {
  $request(api.param + 'getbyType', { type: 'AppSettings', name: 'Language' })
    .then((r) => {
      langOptions.value = r.data
    })
    .catch(() => {})
}

const refreshTree = () => {
  pageLoading.value = true
  $request(api.menu + 'getlist', { size: -1 })
    .then((r) => {
      treeData.value = generateTree(r.data, 'menu_id', 'parent_id', '0')
      pageLoading.value = false
    })
    .catch((e) => {
      pageLoading.value = false
    })
}

const createNode = (data) => {
  Object.assign(nodeData, {
      resource_type: 'MENU',
      resource_path: '',
      image_url: '',
      is_show: 'Y',
  })
  if (data) {
    nodeData.parent_id = data.parent_id
  } else {
    nodeData.parent_id = '0'
  }
  // Clear ID for new
  delete nodeData.menu_id

  labelData.value = [{ key: '', label: '' }]
  editNodeFormVisible.value = true
}

const createChildNode = (data) => {
  if (data.resource_type != 'MENU') return

  Object.assign(nodeData, {
      resource_type: 'WEB',
      resource_path: '',
      image_url: '',
      is_show: 'Y',
  })
  nodeData.parent_id = data.menu_id
  delete nodeData.menu_id

  labelData.value = [{ key: '', label: '' }]
  editNodeFormVisible.value = true
}

const editNode = (data) => {
  Object.assign(nodeData, data)
  try {
     labelData.value = JSON.parse(nodeData.menu_name)
  } catch (e) {
     labelData.value = [{ key: '', label: nodeData.menu_name_label || '' }]
  }
  editNodeFormVisible.value = true
}

const submmitNode = () => {
  const data = { ...nodeData }

  if (data.children && data.children.length > 0 && data.resource_type != 'MENU') {
     message.error(l.value.isExistChildren || 'Directory with children cannot be changed to Page.')
     return
  }
  delete data.children

  if (!data.menu_id) {
     data.menu_id = dateTools.now_time().replace(/[- :]/g, '') + '001'
  }

  submmitLoading.value = true
  // menu_name sent as JSON string of labelData
  const payload = {
     menu_name: JSON.stringify(labelData.value),
     ...data
  }

  $request(api.menu + 'save', payload, 'post')
    .then((r) => {
      submmitLoading.value = false
      message.success(c.value.success)
      editNodeFormVisible.value = false
      refreshTree()
    })
    .catch(() => {
      submmitLoading.value = false
    })
}

const disableOrEnable = (data) => {
  const post = { ...data }
  delete post.children
  post.enabled = post.enabled == 1 ? 0 : 1

  pageLoading.value = true
  $request(api.menu + 'save', post, 'post')
    .then((r) => {
      pageLoading.value = false
      message.success(c.value.success)
      data.enabled = post.enabled
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const removeNode = (data) => {
  Modal.confirm({
    title: c.value.oprConfirm,
    content: c.value.cfmDelete,
    onOk() {
      pageLoading.value = true
      $request(api.menu + 'delete/' + data.menu_id, {}, 'post')
        .then((r) => {
          pageLoading.value = false
          message.success(c.value.success)
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
  var data = tmp.map((i, index) => ({
    id: i.id,
    menu_seq: index,
    parent_id: i.parent_id,
  }))
  sortLoading.value = true
  $request(api.menu + 'sort', data, 'post')
    .then((r) => {
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
  if (dropNode.data.resource_type != 'MENU') {
    return type != 'inner'
  }
  return true
}

const afterDrop = (i, j, type) => {
  if (type == 'inner') {
    i.data.parent_id = j.data.menu_id
  } else {
    i.data.parent_id = j.data.parent_id
  }
  indexChangeFlag.value = true
}

const addItem = () => {
  labelData.value.push({ key: '', label: '' })
}

const removeItem = (i) => {
  labelData.value.splice(i, 1)
  if (labelData.value.length == 0) addItem()
}

// Lifecycle
onMounted(() => {
  getLanguageList()
  refreshTree()
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
