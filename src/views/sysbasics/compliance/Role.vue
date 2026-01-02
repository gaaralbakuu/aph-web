<template>
  <div class="flex flex-col h-full bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Main Content Grid -->
    <div class="flex-1 grid grid-cols-12 overflow-hidden">

      <!-- Panel 1: Roles (Span 4) -->
      <div class="col-span-4 bg-white border-r border-[#E5E5E5] flex flex-col h-full overflow-hidden">
         <!-- Header -->
         <div class="px-4 py-3 border-b border-[#E5E5E5] flex justify-between items-center bg-white sticky top-0 z-10">
            <h2 class="text-base font-medium mb-0!">{{ l.title || 'Roles' }}</h2>
            <button v-show="showAuth.m_add" class="bg-[#CC0000] text-white! px-3 py-1.5 text-xs font-medium uppercase rounded hover:bg-[#990000] transition-colors flex items-center gap-1 cursor-pointer" @click="createItem">
               <i class="el-icon-plus font-bold"></i> {{ l.createItem }}
            </button>
         </div>
         <!-- Filter -->
         <div v-show="showAuth.m_search" class="p-3 border-b border-[#E5E5E5] bg-[#FAFAFA]">
            <div class="relative group border border-[#CCCCCC] rounded px-3 py-1.5 bg-white focus-within:border-[#065FD4]">
               <i class="el-icon-search text-[#606060] absolute left-3 top-1/2 -translate-y-1/2"></i>
               <input v-model="query.queryString" class="w-full pl-6 outline-none text-sm text-[#0D0D0D] border-none bg-transparent h-full" :placeholder="l.search" @keyup.enter="research" @change="research">
            </div>
         </div>
         <!-- List Header -->
         <div class="grid grid-cols-[1fr_2fr_60px] gap-2 px-4 py-2 border-b border-[#E5E5E5] bg-[#F9F9F9] text-xs font-medium text-[#606060]">
             <div>{{ l.role_name }}</div>
             <div>{{ l.role_desc }}</div>
             <div class="text-center">{{ c.operation }}</div>
         </div>
         <!-- List Body -->
         <div class="flex-1 overflow-y-auto custom-scrollbar" v-loading="pageLoading">
             <div v-for="(item, index) in list" :key="item.role_id"
                  class="grid grid-cols-[1fr_2fr_60px] gap-2 px-4 py-3 border-b border-[#F0F0F0] hover:bg-[#F0F8FF] cursor-pointer group transition-colors items-center"
                  :class="{'bg-[#E6F7FF]': currentDataId === item.role_id}"
                  @click="getChildrenTree(item)">
                  <div class="text-sm font-medium text-[#0D0D0D] truncate" :title="item.role_name">{{ item.role_name }}</div>
                  <div class="text-xs text-[#606060] truncate" :title="item.role_desc">{{ item.role_desc }}</div>
                  <div class="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                     <i v-if="showAuth.m_updata" class="el-icon-edit text-[#065FD4] cursor-pointer hover:scale-125 text-base" :title="c.edit" @click.stop="editItem(item, index)"></i>
                     <i v-if="showAuth.m_del" class="el-icon-delete text-[#CC0000] cursor-pointer hover:scale-125 text-base" :title="c.delete" @click.stop="deleteItem(item, index)"></i>
                  </div>
             </div>
         </div>
         <!-- Footer -->
         <div class="p-2 border-t border-[#E5E5E5] bg-white">
            <z-pagination :total="total" :page.sync="query.page" :limit.sync="query.size" @change="getList" :options="{ small: true, layout: 'prev, pager, next' }"></z-pagination>
         </div>
      </div>

      <!-- Panel 2: Users (Span 3) -->
      <div class="col-span-3 bg-white flex flex-col h-full overflow-hidden">
         <div class="px-4 py-3 border-b border-[#E5E5E5] flex justify-between items-center bg-[#FAFAFA] h-[53px]">
             <h3 class="text-sm font-medium mb-0!">{{ l.allocatedAccount }}</h3>
             <button v-if="currentDataId && showAuth.m_add" class="text-[#065FD4] hover:bg-[#E6F7FF] p-1.5 rounded transition-colors cursor-pointer" :title="l.addUser" @click="addUserClick">
                <i class="el-icon-plus font-bold text-lg"></i>
             </button>
         </div>
         <div class="p-2 border-b border-[#E5E5E5]" v-if="currentDataId && showAuth.m_search">
            <input v-model="userQuery.queryString" class="w-full border border-[#CCCCCC] rounded px-2 py-1.5 text-xs outline-none focus:border-[#065FD4]" :placeholder="l.search" @change="researchUser">
         </div>
         <div class="flex-1 overflow-y-auto custom-scrollbar" v-if="currentDataId">
             <div v-for="(user, index) in userList" :key="user.userid" class="flex justify-between items-center px-4 py-2 border-b border-[#F0F0F0] hover:bg-[#F9F9F9] group">
                 <div class="flex flex-col min-w-0">
                    <span class="text-sm text-[#0D0D0D] truncate font-medium">{{ user.username }}</span>
                    <span class="text-xs text-[#606060] truncate">{{ user.userid }}</span>
                 </div>
                 <i v-if="showAuth.m_del" class="el-icon-close text-[#606060] hover:text-[#CC0000] cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity font-bold" :title="c.delete" @click.stop="deleteUserRoleItem(user, index)"></i>
             </div>
         </div>
          <div class="flex flex-col items-center justify-center h-full text-[#999999] text-sm gap-2" v-else>
            <i class="el-icon-user text-3xl text-[#E5E5E5]"></i>
            {{ l.selectRoleFirst || 'Select a role' }}
         </div>
         <div class="p-2 border-t border-[#E5E5E5] bg-white" v-if="currentDataId">
            <z-pagination :total="userTotal" :page.sync="userQuery.page" :limit.sync="userQuery.size" @change="getUserList" :options="{ small: true, layout: 'prev, pager, next' }"></z-pagination>
         </div>
      </div>

      <!-- Panel 3: Permissions (Span 5) -->
      <div class="col-span-5 bg-white border-l border-[#E5E5E5] flex flex-col h-full overflow-hidden">
         <div class="px-4 py-3 border-b border-[#E5E5E5] flex justify-between items-center bg-[#FAFAFA] h-[53px]">
             <h3 class="text-sm font-medium mb-0!">{{ l.selectedMemnu }}</h3>
             <button v-if="currentDataId && showAuth.m_updata" class="bg-[#069C56] text-white! px-3 py-1.5 text-xs font-medium uppercase rounded hover:bg-[#057A43] transition-colors disabled:opacity-50 flex items-center gap-1 cursor-pointer" :disabled="!menuCheckChange" @click="saveRoleMenu">
                <i class="el-icon-check font-bold" v-if="!saveMenuLoading"></i>
                <i class="el-icon-loading" v-else></i>
                {{ l.save }}
             </button>
         </div>
         <div class="flex-1 overflow-y-auto custom-scrollbar p-4" v-if="currentDataId">
            <el-tree
              ref="tree"
              :data="treeData"
              node-key="menu_id"
              :default-expand-all="false"
              show-checkbox
              :default-checked-keys="menuIds"
              :expand-on-click-node="false"
              @check-change="menuCheckChange = true"
              class="custom-tree filter-tree">
                <span class="custom-tree-node flex-1 flex items-center justify-between pr-2 py-1 text-sm w-full" slot-scope="{ data }">
                    <span class="font-medium text-[#0D0D0D] text-sm">{{ data.menu_name_label }} <span class="text-[#999999] font-normal text-xs ml-1">[{{ data.resource_type }}]</span></span>
                    <span v-show="showAuth.m_updata && data.resource_type != 'MENU'" class="flex gap-2 items-center" @click.stop>
                        <el-tooltip :content="c.m_add" placement="top" v-if="data.m_add == 'Y'" :open-delay="500">
                            <el-switch size="mini" v-model="data.m_add1" active-value="Y" inactive-value="N" @change="menuCheckChange = true" active-color="#069C56"></el-switch>
                        </el-tooltip>
                         <el-tooltip :content="c.m_del" placement="top" v-if="data.m_del == 'Y'" :open-delay="500">
                            <el-switch size="mini" v-model="data.m_del1" active-value="Y" inactive-value="N" @change="menuCheckChange = true" active-color="#CC0000"></el-switch>
                        </el-tooltip>
                         <el-tooltip :content="c.m_updata" placement="top" v-if="data.m_updata == 'Y'" :open-delay="500">
                            <el-switch size="mini" v-model="data.m_updata1" active-value="Y" inactive-value="N" @change="menuCheckChange = true" active-color="#065FD4"></el-switch>
                        </el-tooltip>
                         <el-tooltip :content="c.m_search" placement="top" v-if="data.m_search == 'Y'" :open-delay="500">
                            <el-switch size="mini" v-model="data.m_search1" active-value="Y" inactive-value="N" @change="menuCheckChange = true"></el-switch>
                        </el-tooltip>

                        <!-- More permissions (grouped or scrollable if too many) -->
                         <el-tooltip :content="c.m_import" placement="top" v-if="data.m_import == 'Y'" :open-delay="500">
                            <el-switch size="mini" v-model="data.m_import1" active-value="Y" inactive-value="N" @change="menuCheckChange = true"></el-switch>
                        </el-tooltip>
                        <el-tooltip :content="c.m_export" placement="top" v-if="data.m_export == 'Y'" :open-delay="500">
                            <el-switch size="mini" v-model="data.m_export1" active-value="Y" inactive-value="N" @change="menuCheckChange = true"></el-switch>
                        </el-tooltip>
                         <el-tooltip :content="c.m_upload" placement="top" v-if="data.m_upload == 'Y'" :open-delay="500">
                            <el-switch size="mini" v-model="data.m_upload1" active-value="Y" inactive-value="N" @change="menuCheckChange = true"></el-switch>
                        </el-tooltip>
                         <el-tooltip :content="c.m_audit" placement="top" v-if="data.m_audit == 'Y'" :open-delay="500">
                            <el-switch size="mini" v-model="data.m_audit1" active-value="Y" inactive-value="N" @change="menuCheckChange = true"></el-switch>
                        </el-tooltip>
                         <el-tooltip :content="c.m_print" placement="top" v-if="data.m_print == 'Y'" :open-delay="500">
                            <el-switch size="mini" v-model="data.m_print1" active-value="Y" inactive-value="N" @change="menuCheckChange = true"></el-switch>
                        </el-tooltip>
                    </span>
                </span>
            </el-tree>
         </div>
          <div class="flex flex-col items-center justify-center h-full text-[#999999] text-sm gap-2" v-else>
            <i class="el-icon-menu text-3xl text-[#E5E5E5]"></i>
            {{ l.selectRoleFirst || 'Select a role' }}
         </div>
      </div>

    </div>

    <!-- Dialogs -->
    <z-form-dialog :name="name" :data="data" :formProps="formProps" :fields="fields" @submmit="submmit" :submmitLoading="submmitLoading" :visible.sync="editFormVisible"></z-form-dialog>
    <chooseUser :visible.sync="addUserDialogShow" :useridList.sync="addUsers" @submmit="submmitAddUser"></chooseUser>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, getCurrentInstance, watch } from 'vue'
import { arrayToObject, dateTools } from '@/utils'
import { _, api, initFuncs, zFormDialog, zPagination, zTable } from '@/views/_common'
import chooseUser from '@/views/_common/ChooseUser.vue'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('adminRole')

const emptyData = {}

const apiRole = api.role
const apiMenu = api.menu
const name = computed(() => l.value.title)
const userAuth = ref(null)
const showAuth = reactive({
  m_search: false,
  m_add: false,
  m_del: false,
  m_updata: false,
  m_import: false,
  m_export: false,
  m_upload: false,
  m_audit: false,
  m_print: false,
})
// const columns = computed(() => [ ... ]) // Removed as z-table is removed
const fields = computed(() => [
  {
    title: l.value.role_name,
    key: 'role_name',
    required: true,
  },
  {
    title: l.value.role_desc,
    key: 'role_desc',
    required: true,
  },
])
// const tableProps = reactive({ ... }) // Removed
const formProps = reactive({
  dialogWidth: '500px', // Adjusted for better look
  labelWidth: '100px',
})
const query = reactive({
  params: {},
  size: 15,
  page: 1,
  role_type: 'cis',
  queryString: '',
})
// const pagination = reactive({ layout: ... }) // Removed, using z-pagination options directly

const pageLoading = ref(false)
const submmitLoading = ref(false)
const saveMenuLoading = ref(false)
const saveEmpLoading = ref(false)
const list = ref([])
const total = ref(0)
const data = reactive({
  role_desc: '',
  role_name: '',
  role_type: 'cis',
})
const editFormVisible = ref(false)
const currentDataId = ref(0)
const treeData = ref([])
const menuData = ref([])
const empData = ref([])
const menuIds = ref([])
const menuCheckChange = ref(false)
const empCheckChange = ref(false)
// const userColumns = computed(() => [ ... ]) // Removed
// const userTableProps = reactive({ ... }) // Removed
const userQuery = reactive({
  queryString: '',
  size: 15,
  page: 1,
  role_type: 'cis',
})
// const userPagination = reactive({ ... }) // Removed
const userList = ref([])
const userTotal = ref(0)
const addUserDialogShow = ref(false)
const addUsers = ref([])
const submitAddUserLoading = ref(false)

const tree = ref(null)
const menuObj = ref([])

// Methods
const getList = () => {
  if (userAuth.value && userAuth.value.m_search == 'N') {
    return proxy.$message({
      message: c.value.authError,
      type: 'error',
    })
  }
  pageLoading.value = true
  proxy
    .$request(apiRole + 'getlist', query)
    .then((r) => {
      pageLoading.value = false
      list.value = r.data.list
      total.value = r.data.total
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const getOptions = () => {
  if (userAuth.value && userAuth.value.m_search == 'N') {
    return proxy.$message({
      message: c.value.authError,
      type: 'error',
    })
  }
  proxy
    .$request(apiMenu + 'getcisMenulist')
    .then((r) => {
      var tmp = {
        0: {
          children: [],
        },
      }
      r.data.forEach((i) => {
        tmp[i.menu_id] = Object.assign({}, i, {
          children: [],
          m_search1: null,
          m_add1: null,
          m_del1: null,
          m_updata1: null,
          m_import1: null,
          m_export1: null,
          m_upload1: null,
          m_audit1: null,
          m_print1: null,
        })
      })

    //   console.log(tmp)

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

const research = () => {
  if (userAuth.value.m_search == 'N') {
    return proxy.$message({
      message: c.value.authError,
      type: 'error',
    })
  }
  query.page = 1
  total.value = 0
  list.value = []
  getList()
}

const createItem = () => {
  if (userAuth.value.m_add == 'N') {
    return proxy.$message({
      message: c.value.authError,
      type: 'error',
    })
  }
  Object.assign(data, emptyData)
  // Re-init properties
  data.role_desc = ''
  data.role_name = ''
  data.role_type = 'cis'
  // clear id if exists
  if(data.role_id) delete data.role_id

  editFormVisible.value = true
}

const editItem = (v, index) => {
  if (userAuth.value.m_updata == 'N') {
    return proxy.$message({
      message: c.value.authError,
      type: 'error',
    })
  }
  pageLoading.value = true
  proxy
    .$request(apiRole + 'getbyid', {
      id: v.role_id, // Note: v.id might be wrong in original code if key is role_id, but usually backend returns id or role_id. Original used v.id in delete but v.role_id in template. I'll use v.role_id here as per list data.
    })
    .then((r) => {
      pageLoading.value = false
      Object.assign(data, r.data[0])
      editFormVisible.value = true
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const deleteItem = (v, index) => {
  if (userAuth.value.m_del == 'N') {
    return proxy.$message({
      message: c.value.authError,
      type: 'error',
    })
  }
  proxy
    .$confirm(c.value.cfmDelete, c.value.oprConfirm)
    .then(() => {
      pageLoading.value = true
      proxy
        .$request(apiRole + 'delete/' + v.role_id, {}, 'post')
        .then((r) => {
          pageLoading.value = false
          proxy.$message({
            message: c.value.success,
            type: 'success',
          })
          if(currentDataId.value === v.role_id) currentDataId.value = 0
          getList()
        })
        .catch(() => {
          pageLoading.value = false
        })
    })
    .catch(() => {
      return
    })
}

const getChildrenTree = (row) => {
  if (userAuth.value.m_search == 'N') {
    return proxy.$message({
      message: c.value.authError,
      type: 'error',
    })
  }
  currentDataId.value = row ? row.role_id : 0
  menuCheckChange.value = false
  empCheckChange.value = false
  menuIds.value = []
  refreshTree()
}

const saveRoleMenu = () => {
  saveMenuLoading.value = true
  var nodes = proxy.$refs.tree.getCheckedNodes()

  // console.log(nodes)
  var arr = _.map(nodes, (i) => {
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

  proxy
    .$request(
      apiRole + 'setMenus',
      {
        rid: currentDataId.value,
        menus: arr,
      },
      'post'
    )
    .then((r) => {
      submmitLoading.value = false
      proxy.$message({
        message: c.value.success,
        type: 'success',
      })
      saveMenuLoading.value = false
      menuCheckChange.value = false
      refreshTree()
    })
    .catch(() => {
      saveMenuLoading.value = false
    })
}

const refreshTree = () => {
  treeData.value = []
  if (currentDataId.value) {
    pageLoading.value = true
    proxy
      .$request(apiRole + 'getMenuAndEmp/' + currentDataId.value)
      .then((r) => {
        menuObj.value = r.data.menuids
        treeData.value = _.cloneDeep(menuData.value)
        // console.log(treeData.value)

        // Use a recursive function to traverse and update since treeData is hierarchical
        const updateNode = (nodes) => {
            nodes.forEach(x => {
                menuObj.value.forEach(y => {
                    if(x.menu_id == y.menu_id){
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
                })
                if(x.children && x.children.length > 0) updateNode(x.children)
            })
        }

        updateNode(treeData.value)

        menuIds.value = _.map(r.data.menuids, (i) => i.menu_id)
        pageLoading.value = false
      })
      .catch(() => {
        pageLoading.value = false
      })
    researchUser()
  }
}

const submmit = () => {
  submmitLoading.value = true
  let url = apiRole + 'add'
  if (!data.role_id) data.role_id = dateTools.now_time().replace(/[- :]/g, '') + '001'
  data.role_type = 'cis'
  proxy
    .$request(url, data, 'post')
    .then((r) => {
      submmitLoading.value = false
      proxy.$message({
        message: c.value.success,
        type: 'success',
      })
      editFormVisible.value = false
      getList()
    })
    .catch(() => {
      submmitLoading.value = false
    })
}

const researchUser = () => {
  userQuery.page = 1
  getUserList()
}

const getUserList = () => {
  if (userAuth.value && userAuth.value.m_search == 'N') {
    return proxy.$message({
      message: c.value.authError,
      type: 'error',
    })
  }
  proxy
    .$request(proxy.$api.user + 'getroleuserpage/', {
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
  if (userAuth.value.m_add == 'N') {
    return proxy.$message({
      message: c.value.authError,
      type: 'error',
    })
  }
  addUserDialogShow.value = true
}

const submmitAddUser = () => {
  if (addUsers.value.length == 0) return proxy.$message.error(l.value.addUserIsEmpty)
  submitAddUserLoading.value = true
  proxy
    .$request(
      apiRole + 'batchadduser/',
      {
        role_id: currentDataId.value,
        user_ids: addUsers.value,
      },
      'post'
    )
    .then((r) => {
      proxy.$message.success(c.value.success)
      addUserDialogShow.value = false
      submitAddUserLoading.value = false
      addUsers.value = []
      getUserList()
    })
    .catch(() => {
      submitAddUserLoading.value = false
    })
}

const deleteUserRoleItem = (row) => {
  if (userAuth.value.m_del == 'N') {
    return proxy.$message({
      message: c.value.authError,
      type: 'error',
    })
  }
  proxy
    .$confirm(l.value.removeUserFromRole)
    .then((r) => {
      proxy
        .$request(
          apiRole + 'deleteroleuser/' + row.id,
          {
            id: row.id,
          },
          'post'
        )
        .then((r) => {
          proxy.$message.success(c.value.success)
          getUserList()
        })
        .catch(() => {})
    })
    .catch((e) => {})
}

const getUserAuth = () => {
  proxy
    .$request(proxy.$api.checkMenuAuth, {
      resourcepath: proxy.$route.name,
    })
    .then((r) => {
      userAuth.value = r.data[0]
      // Trigger watch manually or ensure watch works
    })
    .catch(() => {})
}

onMounted(() => {
  getList()
  getOptions()
  getUserAuth()
})

watch(
  userAuth,
  (newV) => {
    if(!newV) return
    showAuth.m_add = newV.m_add == 'Y'
    showAuth.m_search = newV.m_search == 'Y'
    showAuth.m_del = newV.m_del == 'Y'
    showAuth.m_updata = newV.m_updata == 'Y'
    showAuth.m_import = newV.m_import == 'Y'
    showAuth.m_export = newV.m_export == 'Y'
    showAuth.m_upload = newV.m_upload == 'Y'
    showAuth.m_audit = newV.m_audit == 'Y'
    showAuth.m_print = newV.m_print == 'Y'
  },
  { deep: true, immediate: true }
)
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
  background-color: #E5E5E5;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #CCCCCC;
}

/* Tree styling enhancements */
:deep(.el-tree-node__content) {
    height: auto !important;
    padding-top: 4px;
    padding-bottom: 4px;
    border-radius: 4px;
}
:deep(.el-tree-node__content:hover) {
    background-color: #F9F9F9 !important;
}
:deep(.el-tree-node.is-current > .el-tree-node__content) {
    background-color: #E6F7FF !important;
    color: #065FD4;
}
</style>
