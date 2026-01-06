<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.title || 'Role Management' }}</h1>

      <div class="flex gap-2">
        <Button variant="primary" @click="createItem">
          <i class="el-icon-plus mr-2"></i>
          {{ l.createItem || c.create }}
        </Button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-hidden p-4 flex gap-4">

      <!-- LEFT: Role List -->
      <div class="w-[350px] flex flex-col bg-white border border-[#E5E5E5] rounded shadow-sm">
        <div class="p-3 border-b border-[#E5E5E5] flex items-center gap-2">
           <div class="flex-1 relative">
             <i class="el-icon-search absolute left-2 top-1/2 -translate-y-1/2 text-[#606060]"></i>
             <input
               v-model="query.queryString"
               type="text"
               :placeholder="l.search"
               class="w-full pl-8 pr-2 py-1.5 text-sm border border-[#CCCCCC] rounded outline-none focus:border-[#065FD4]"
               @keyup.enter="research"
             />
           </div>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar">
           <!-- Header for list -->
           <div class="grid grid-cols-[1fr_80px] px-4 py-2 bg-[#F9F9F9] text-xs font-medium text-[#606060] border-b border-[#E5E5E5]">
              <div>{{ l.role_name }}</div>
              <div class="text-right">{{ c.action }}</div>
           </div>

           <div v-if="list.length === 0" class="p-4 text-center text-[#606060] text-sm">{{ c.noData }}</div>

           <div
             v-for="item in list"
             :key="item.id"
             class="grid grid-cols-[1fr_80px] px-4 py-3 border-b border-[#E5E5E5] hover:bg-[#F0F8FF] cursor-pointer text-sm items-center transition-colors"
             :class="currentDataId === item.role_id ? 'bg-[#E8F4FF] border-l-4 border-l-[#065FD4]' : ''"
             @click="getChildrenTree(item)"
           >
              <div class="font-medium truncate" :title="item.role_name">{{ item.role_name }}</div>
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

      <!-- CENTER: Permissions Tree -->
      <div class="flex-1 flex flex-col bg-white border border-[#E5E5E5] rounded shadow-sm overflow-hidden">
        <div class="p-3 border-b border-[#E5E5E5] flex justify-between items-center h-[57px]">
           <div class="text-sm font-medium">
             {{ currentDataId ? l.selectedMemnu : l.selectRoleFirst || 'Select a role to view permissions' }}
           </div>
           <Button v-if="currentDataId && menuCheckChange" :loading="saveMenuLoading" variant="primary" @click="saveRoleMenu">
             {{ l.save || c.save }}
           </Button>
        </div>

        <div class="flex-1 overflow-y-auto p-4 custom-scrollbar bg-white" v-if="currentDataId">
           <el-tree
             ref="treeRef"
             :data="treeData"
             node-key="menu_id"
             show-checkbox
             default-expand-all
             :default-checked-keys="menuIds"
             :expand-on-click-node="false"
             @check-change="menuCheckChange = true"
           >
             <template #default="{ node, data }">
               <div class="flex-1 flex items-center justify-between text-sm pr-2 w-full">
                  <span class="font-medium">{{ data.menu_name_label }} <span class="text-[#999999] text-xs font-normal">[{{ data.resource_type }}]</span></span>

                  <div class="flex gap-2 items-center" v-show="showAuth.m_updata && data.resource_type != 'MENU'">
                    <div v-if="data.m_add == 'Y'" class="flex items-center gap-1" title="Add">
                      <span class="text-[10px] text-[#606060]">{{ c.m_add }}</span>
                      <a-switch size="small" v-model:checked="data.m_add1" checked-value="Y" un-checked-value="N" @change="menuCheckChange = true" />
                    </div>
                    <div v-if="data.m_del == 'Y'" class="flex items-center gap-1" title="Delete">
                      <span class="text-[10px] text-[#606060]">{{ c.m_del }}</span>
                      <a-switch size="small" v-model:checked="data.m_del1" checked-value="Y" un-checked-value="N" @change="menuCheckChange = true" />
                    </div>
                    <div v-if="data.m_updata == 'Y'" class="flex items-center gap-1" title="Update">
                      <span class="text-[10px] text-[#606060]">{{ c.m_updata }}</span>
                      <a-switch size="small" v-model:checked="data.m_updata1" checked-value="Y" un-checked-value="N" @change="menuCheckChange = true" />
                    </div>
                    <!-- Additional switches can be added similarly, hidden for space if needed or wrapped -->
                  </div>
               </div>
             </template>
           </el-tree>
        </div>
        <div v-else class="flex-1 flex items-center justify-center text-[#999999]">
           <i class="el-icon-lock text-4xl"></i>
        </div>
      </div>

      <!-- RIGHT: Allocated Users -->
      <div class="w-[300px] flex flex-col bg-white border border-[#E5E5E5] rounded shadow-sm">
         <div class="p-3 border-b border-[#E5E5E5] flex justify-between items-center h-[57px]">
            <span class="text-sm font-medium">{{ l.allocatedAccount }}</span>
            <div class="flex items-center gap-2" v-if="currentDataId">
               <Button variant="ghost" class="!p-1" @click="addUserClick">
                 <i class="el-icon-plus text-lg"></i>
               </Button>
            </div>
         </div>

         <div class="p-2 border-b border-[#E5E5E5]" v-if="currentDataId">
            <input
               v-model="userQuery.queryString"
               type="text"
               :placeholder="l.search"
               class="w-full px-2 py-1 text-sm border border-[#CCCCCC] rounded outline-none focus:border-[#065FD4]"
               @change="researchUser"
             />
         </div>

         <div class="flex-1 overflow-y-auto custom-scrollbar" v-if="currentDataId">
            <div v-if="userList.length === 0" class="p-4 text-center text-[#606060] text-sm">{{ c.noData }}</div>
            <div
              v-for="user in userList"
              :key="user.id"
              class="flex justify-between items-center px-4 py-3 border-b border-[#E5E5E5] hover:bg-[#F9F9F9] text-sm group"
            >
               <div class="truncate">
                 <div class="font-medium text-[#0D0D0D]">{{ user.username }}</div>
                 <div class="text-xs text-[#606060]">{{ user.userid }}</div>
               </div>
               <i class="el-icon-close text-[#CC0000] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity" @click="deleteUserRoleItem(user)"></i>
            </div>
         </div>
         <div v-else class="flex-1 flex items-center justify-center text-[#999999]">
            <i class="el-icon-user text-4xl"></i>
         </div>

         <div class="p-2 border-t border-[#E5E5E5]" v-if="currentDataId">
            <Pagination
             :page="userQuery.page"
             :pageSize="userQuery.size"
             :total="userTotal"
             :l="l"
             simple
             @update:page="userQuery.page = $event"
             @update:pageSize="userQuery.size = $event"
             @change="getUserList"
           />
         </div>
      </div>

    </div>

    <!-- Create Role Drawer -->
    <a-drawer :visible="editFormVisible" :title="l.title" :width="500" @close="editFormVisible = false" :body-style="{ padding: 0 }">
       <div class="flex flex-col h-full bg-white font-roboto">
         <div class="flex-1 p-6">
            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.role_name }} ({{ c.required }})</label>
              <input v-model="data.role_name" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.role_desc }} ({{ c.required }})</label>
              <textarea v-model="data.role_desc" rows="3" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent resize-none"></textarea>
            </div>

            <div class="mb-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.role_type }}</label>
              <input v-model="data.role_type" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>
         </div>
         <div class="border-t border-[#E5E5E5] p-4 flex justify-end items-center gap-2 bg-white">
           <Button variant="ghost" @click="editFormVisible = false">{{ c.cancel }}</Button>
           <Button variant="primary" :disabled="submmitLoading" @click="submmit">{{ c.confirm }}</Button>
         </div>
       </div>
    </a-drawer>

    <!-- Batch Add User Modal -->
    <a-modal v-model:visible="addUserDialogShow" :title="l.batchAddUser" :footer="null">
       <div class="p-4">
          <label class="block text-sm font-medium text-[#0D0D0D] mb-2">{{ l.addUserLabel }}</label>
          <textarea
            v-model="addUsers"
            :placeholder="l.addUserPlaceholder"
            rows="5"
            class="w-full p-2 border border-[#CCCCCC] rounded outline-none focus:border-[#065FD4] resize-none text-sm"
          ></textarea>
          <p class="text-xs text-[#606060] mt-1">{{ l.addUserTip || 'Separate multiple user IDs with commas.' }}</p>
       </div>
       <div class="border-t border-[#E5E5E5] p-4 flex justify-end items-center gap-2">
           <Button variant="ghost" @click="addUserDialogShow = false">{{ c.cancel }}</Button>
           <Button variant="primary" :loading="submitAddUserLoading" @click="submmitAddUser">{{ c.confirm }}</Button>
       </div>
    </a-modal>

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
import { dateTools } from '@/utils'
import { useLocalI18n } from '@/composables/useLocalI18n'
import Button from '@/views/sysbasics/video/adminViews/component/common/Button.vue'
import Pagination from '@/views/sysbasics/video/adminViews/component/common/Pagination.vue'
import { cloneDeep, map } from 'lodash' // Assuming lodash is available as per original usage

// Global instance
const instance = getCurrentInstance()
const { $request, $message, $confirm } = instance.proxy

// Localization
const { l, c } = useLocalI18n('adminRole')

// State
const pageLoading = ref(false)
const submmitLoading = ref(false)
const saveMenuLoading = ref(false)
const editFormVisible = ref(false)
const addUserDialogShow = ref(false)
const submitAddUserLoading = ref(false)

const currentDataId = ref(0)
const menuCheckChange = ref(false)

// Lists & Data
const list = ref([])
const total = ref(0)
const query = reactive({
  queryString: '',
  size: 10,
  page: 1,
})

const data = reactive({
  role_id: '',
  role_name: '',
  role_desc: '',
  role_type: ''
})

const treeData = ref([])
const menuIds = ref([])
const treeRef = ref()

// User list (for right panel)
const userList = ref([])
const userTotal = ref(0)
const userQuery = reactive({
  queryString: '',
  size: 10,
  page: 1,
})
const addUsers = ref('')

// Methods

const getList = () => {
  pageLoading.value = true
  $request(api.role + 'getlist', query)
    .then((r) => {
      list.value = r.data.list
      total.value = r.datas.total
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
    role_id: '',
    role_name: '',
    role_desc: '',
    role_type: ''
  })
  delete data.id
  editFormVisible.value = true
}

const editItem = (item) => {
  pageLoading.value = true
  $request(api.role + 'getbyid', { id: item.id })
    .then((r) => {
      pageLoading.value = false
      Object.assign(data, r.data[0])
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
      $request(api.role + 'delete/' + item.id, {}, 'post')
        .then(() => {
          pageLoading.value = false
          message.success(c.value.success)
          currentDataId.value = 0
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
  let url = api.role + 'add'
  // If editing, logic might differ but original code used 'add' mostly?
  // Wait, original said: let url = this.api + (this.data.id ? 'update' : 'add') but then commented it out and used 'add'?
  // Actually, original: `let url = this.api + 'add'` was active. But it also had `if (!this.data.role_id) ...`
  // I will support update if id exists.
  if (data.id) {
     url = api.role + 'update'
  } else {
     if (!data.role_id) data.role_id = dateTools.now_time().replace(/[- :]/g, '') + '001'
  }

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

// Tree / Menu Logic
const menuData = ref([]) // Base structure

const getOptions = () => {
  $request(api.menu + 'getlist')
    .then((r) => {
      var tmp = { 0: { children: [] } }
      r.data.forEach((i) => {
        tmp[i.menu_id] = Object.assign({}, i, { children: [] })
      })
      for (let key in tmp) {
        var parentTmp = tmp[tmp[key].parent_id]
        if (parentTmp) {
          parentTmp.children.push(tmp[key])
        }
      }
      menuData.value = tmp['0'].children
    })
    .catch(() => {})
}

const getChildrenTree = (row) => {
  currentDataId.value = row ? row.role_id : 0
  menuCheckChange.value = false
  menuIds.value = []
  refreshTree()
}

const refreshTree = () => {
  treeData.value = []
  if (currentDataId.value) {
    pageLoading.value = true
    $request(api.role + 'getMenuAndEmp/' + currentDataId.value)
      .then((r) => {
        const menuObj = r.data.menuids
        const newTree = cloneDeep(menuData.value)

        // Map permissions to tree
        const processNode = (nodes) => {
           nodes.forEach(x => {
              const y = menuObj.find(m => m.menu_id == x.menu_id)
              if (y) {
                 x.m_search1 = y.m_search
                 x.m_add1 = y.m_add
                 x.m_del1 = y.m_del
                 x.m_updata1 = y.m_updata
                 x.m_import1 = y.m_import
                 x.m_export1 = y.m_export
                 x.m_upload1 = y.m_upload
                 x.m_audit1 = y.m_audit
                 x.m_print1 = y.m_print
              }
              if (x.children && x.children.length) {
                 processNode(x.children)
              }
           })
        }
        processNode(newTree)
        treeData.value = newTree
        menuIds.value = map(r.data.menuids, 'menu_id')
        pageLoading.value = false
      })
      .catch((e) => {
        console.error(e)
        pageLoading.value = false
      })
    researchUser()
  }
}

const saveRoleMenu = () => {
  saveMenuLoading.value = true
  const nodes = treeRef.value.getCheckedNodes()

  const arr = map(nodes, (i) => {
    return {
      menu_id: i.menu_id,
      m_search: i.m_search1,
      m_add: i.m_add1,
      m_del: i.m_del1,
      m_updata: i.m_updata1,
      m_import: i.m_import1,
      m_export: i.m_export1,
      m_upload: i.m_upload1,
      m_audit: i.m_audit1,
      m_print: i.m_print1,
    }
  })

  $request(api.role + 'setMenus', { rid: currentDataId.value, menus: arr }, 'post')
    .then(() => {
      message.success(c.value.success)
      saveMenuLoading.value = false
      menuCheckChange.value = false
      refreshTree()
    })
    .catch(() => {
      saveMenuLoading.value = false
    })
}

// User Logic
const researchUser = () => {
  userQuery.page = 1
  getUserList()
}

const getUserList = () => {
  if (!currentDataId.value) return
  $request(api.user + 'getroleuserpage/', {
    ...userQuery,
    role_id: currentDataId.value,
  })
    .then((r) => {
      userList.value = r.data.list
      userTotal.value = r.data.total
    })
    .catch(() => {})
}

const addUserClick = () => {
  addUsers.value = ''
  addUserDialogShow.value = true
}

const submmitAddUser = () => {
  if (!addUsers.value) return message.error(l.value.addUserIsEmpty)
  let user_ids = addUsers.value.replace('，', ',').split(',')
  submitAddUserLoading.value = true
  $request(api.role + 'batchadduser/', {
      role_id: currentDataId.value,
      user_ids,
    }, 'post')
    .then(() => {
      message.success(c.value.success)
      addUserDialogShow.value = false
      submitAddUserLoading.value = false
      addUsers.value = ''
      getUserList()
    })
    .catch(() => {
      submitAddUserLoading.value = false
    })
}

const deleteUserRoleItem = (row) => {
  Modal.confirm({
    title: c.value.oprConfirm,
    content: l.value.removeUserFromRole || 'Remove user from role?',
    onOk() {
      $request(api.role + 'deleteroleuser/' + row.id, { id: row.id }, 'post')
        .then(() => {
          message.success(c.value.success)
          getUserList()
        })
    }
  })
}

const showAuth = reactive({
    m_search: true,
    m_add: true,
    m_del: true,
    m_updata: true,
    m_import: true,
    m_export: true,
    m_upload: true,
    m_audit: true,
    m_print: true,
})

// Lifecycle
onMounted(() => {
  getList()
  getOptions()
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
