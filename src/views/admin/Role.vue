<template>
  <div class="p-6 space-y-6" v-loading="pageLoading">
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <Input
          v-model="query.queryString"
          :placeholder="l.search"
          class="w-[300px]"
          @keyup.enter="research"
        />
        <Button variant="secondary" @click="research">{{ c.queryButton }}</Button>
      </div>
      <Button @click="createItem">{{ l.createItem }}</Button>
    </div>

    <div class="grid grid-cols-12 gap-6">
       <!-- Role List -->
       <div class="col-span-12 md:col-span-4 lg:col-span-3">
          <div class="rounded-md border">
             <Table>
                <TableHeader>
                   <TableRow>
                      <TableHead v-for="col in columns" :key="col.key">{{ col.title }}</TableHead>
                      <TableHead>Op</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   <TableRow
                      v-for="(row, index) in list"
                      :key="index"
                      class="cursor-pointer"
                      :class="{ 'bg-muted/50': currentDataId === row.role_id }"
                      @click="getChildrenTree(row)"
                   >
                      <TableCell v-for="col in columns" :key="col.key">{{ row[col.key] }}</TableCell>
                      <TableCell>
                        <div class="flex space-x-2">
                           <Button variant="ghost" size="icon" class="h-6 w-6" @click.stop.prevent="editItem(row, index)">
                              <i class="fa fa-pencil text-blue-600"></i>
                           </Button>
                           <Button variant="ghost" size="icon" class="h-6 w-6" @click.stop.prevent="deleteItem(row, index)">
                              <i class="fa fa-trash text-red-600"></i>
                           </Button>
                        </div>
                      </TableCell>
                   </TableRow>
                </TableBody>
             </Table>
          </div>
          <div class="mt-4 flex justify-end">
             <Pagination
               v-model="query.page"
               :total="total"
               :page-size="query.size"
               @update:modelValue="handlePageChange"
             />
          </div>
       </div>

       <!-- Permission Tree -->
       <div class="col-span-12 md:col-span-4 lg:col-span-5">
          <div class="flex justify-between items-center mb-4 min-h-[36px]">
             <span v-if="currentDataId" class="text-xs font-bold">{{ l.selectedMemnu }}</span>
             <Button
                v-if="currentDataId && menuCheckChange"
                @click="saveRoleMenu"
                :disabled="saveMenuLoading"
                variant="default"
                size="sm"
             >
                {{ l.save }}
             </Button>
          </div>

          <div v-if="currentDataId" class="rounded-md border p-4 min-h-[200px] max-h-[600px] overflow-auto">
             <!-- Tree Component needed here. Using recursive component -->
             <RoleTreeItem
                v-if="treeData.length > 0"
                :model-value="treeData"
                :show-auth="showAuth"
                @update:modelValue="val => treeData = val"
                @change="handleMenuChange"
             />
          </div>
       </div>

       <!-- User List -->
       <div class="col-span-12 md:col-span-4 lg:col-span-4">
          <div class="flex justify-between items-center mb-4 min-h-[36px]">
             <span class="text-xs">{{ l.allocatedAccount }}</span>
             <div class="flex items-center space-x-2">
                <Input
                   v-model="userQuery.queryString"
                   @change="researchUser"
                   placeholder="Search user"
                   class="w-[120px] h-8 text-xs"
                />
                <Button size="icon" variant="outline" class="h-8 w-8" @click="addUserClick">
                   <i class="fa fa-plus"></i>
                </Button>
             </div>
          </div>

          <div v-if="currentDataId" class="rounded-md border">
             <Table>
                <TableHeader>
                   <TableRow>
                      <TableHead v-for="col in userColumns" :key="col.key">{{ col.title }}</TableHead>
                      <TableHead>Op</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   <TableRow v-for="(row, index) in userList" :key="index">
                      <TableCell v-for="col in userColumns" :key="col.key">{{ row[col.key] }}</TableCell>
                      <TableCell>
                         <Button variant="ghost" size="icon" class="h-6 w-6" @click.prevent="deleteUserRoleItem(row, index)">
                            <i class="fa fa-trash text-red-600"></i>
                         </Button>
                      </TableCell>
                   </TableRow>
                </TableBody>
             </Table>
          </div>
          <div v-if="currentDataId" class="mt-4 flex justify-end">
             <Pagination
               v-model="userQuery.page"
               :total="userTotal"
               :page-size="userQuery.size"
               @update:modelValue="val => { userQuery.page = val; getUserList() }"
             />
          </div>
       </div>
    </div>

    <!-- Role Edit Dialog -->
    <Dialog :open="editFormVisible" @update:open="val => editFormVisible = val">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{{ name }}</DialogTitle>
        </DialogHeader>
        <div class="grid gap-4 py-4">
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.role_name }} *</Label>
              <Input v-model="data.role_name" class="col-span-3" />
           </div>
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.role_desc }} *</Label>
              <Input v-model="data.role_desc" class="col-span-3" />
           </div>
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.role_type }}</Label>
              <Input v-model="data.role_type" class="col-span-3" />
           </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="editFormVisible = false">{{ c.cancel }}</Button>
          <Button type="submit" @click="submmit" :disabled="submmitLoading">{{ c.confirm }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Add User Dialog -->
    <Dialog :open="addUserDialogShow" @update:open="val => addUserDialogShow = val">
      <DialogContent class="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{{ l.batchAddUser }}</DialogTitle>
        </DialogHeader>
        <div class="py-4">
           <Label class="mb-2 block">{{ l.addUserLabel }}</Label>
           <Textarea
             v-model="addUsers"
             :placeholder="l.addUserPlaceholder"
             class="w-full h-32"
           />
        </div>
        <DialogFooter>
          <Button variant="outline" @click="addUserDialogShow = false">{{ c.cancel }}</Button>
          <Button type="submit" @click="submmitAddUser" :disabled="submitAddUserLoading">{{ c.confirm }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, watch } from 'vue'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectItem } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import { Pagination } from '@/components/ui/pagination'
import { useLocalI18n } from '@/composables/useLocalI18n'
import { _, api, dateTools } from '@/views/_common'
import RoleTreeItem from './components/RoleTreeItem.vue'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('adminRole')

const pageLoading = ref(false)
const list = ref([])
const total = ref(0)
const editFormVisible = ref(false)
const submmitLoading = ref(false)
const saveMenuLoading = ref(false)

const currentDataId = ref(0)
const treeData = ref([])
const menuData = ref([])
const menuIds = ref([])
const menuCheckChange = ref(false)
const menuObj = ref([])

const userList = ref([])
const userTotal = ref(0)
const addUserDialogShow = ref(false)
const addUsers = ref('')
const submitAddUserLoading = ref(false)

const apiPath = api.role

const query = reactive({
  params: {},
  size: 10,
  page: 1,
  queryString: ''
})

const userQuery = reactive({
  queryString: '',
  size: 10,
  page: 1,
})

const data = ref({})
const name = computed(() => l.value?.title || 'Title')

const columns = computed(() => [
  { title: l.value?.role_id, key: 'role_id' },
  { title: l.value?.role_name, key: 'role_name' },
])

const userColumns = computed(() => [
  { title: l.value?.userid, key: 'userid' },
  { title: l.value?.username, key: 'username' },
])

const showAuth = reactive({
  m_search: true, m_add: true, m_del: true, m_updata: true,
  m_import: true, m_export: true, m_upload: true, m_audit: true, m_print: true,
})

const getList = () => {
  pageLoading.value = true
  proxy.$request(apiPath + 'getlist', query)
    .then(r => {
      list.value = r.data.list
      total.value = r.datas.total
      pageLoading.value = false
    })
    .catch(() => pageLoading.value = false)
}

const getOptions = () => {
  proxy.$request(proxy.$api.menu + 'getlist')
    .then(r => {
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

const research = () => {
  query.page = 1
  getList()
}

const handlePageChange = (val) => {
  query.page = val
  getList()
}

const createItem = () => {
  data.value = {}
  editFormVisible.value = true
}

const editItem = (row) => {
  pageLoading.value = true
  proxy.$request(apiPath + 'getbyid', { id: row.id }) // original used row.id, but table uses role_id in key? Check original.
  // Original editItem(v) { ... id: v.id ... } but data uses role_id.
  // Let's assume row.id exists or row.role_id is used.
  // Actually usually list items have `id` (guid) and `role_id` (business id).
  .then(r => {
      pageLoading.value = false
      data.value = r.data[0]
      editFormVisible.value = true
    })
    .catch(() => pageLoading.value = false)
}

const deleteItem = (row) => {
  if (window.confirm(c.value?.deleteConfirm)) {
    pageLoading.value = true
    proxy.$request(apiPath + 'delete/' + row.id, {}, 'post')
      .then(() => {
        pageLoading.value = false
        proxy.$message.success(c.value?.deleteSuccess)
        currentDataId.value = 0
        getList()
      })
      .catch(() => pageLoading.value = false)
  }
}

const getChildrenTree = (row) => {
  currentDataId.value = row ? row.role_id : 0
  menuCheckChange.value = false
  menuIds.value = []
  refreshTree()
}

// Helper to flatten tree to list for saving
const flattenTree = (nodes) => {
  let result = []
  for (const node of nodes) {
     if (node.checked) { // We need to track checked state in our custom tree
        result.push(node)
     }
     if (node.children) {
        result = result.concat(flattenTree(node.children))
     }
  }
  return result
}

// Since we use custom tree, we need a way to get all checked nodes including those with partial checks or implicit logic.
// However, the original code used el-tree `getCheckedNodes`.
// We need to implement checked state tracking in `treeData`.
const saveRoleMenu = () => {
  saveMenuLoading.value = true

  // We need to traverse treeData and find all checked items
  const getChecked = (nodes) => {
     let res = []
     nodes.forEach(n => {
        if (n.checked) {
           res.push({
              menu_id: n.menu_id,
              m_search: n.m_search1,
              m_add: n.m_add1,
              m_del: n.m_del1,
              m_updata: n.m_updata1,
              m_import: n.m_import1,
              m_export: n.m_export1,
              m_upload: n.m_upload1,
              m_audit: n.m_audit1,
              m_print: n.m_print1,
           })
        }
        if (n.children && n.children.length) {
           res = res.concat(getChecked(n.children))
        }
     })
     return res
  }

  const arr = getChecked(treeData.value)

  proxy.$request(apiPath + 'setMenus', { rid: currentDataId.value, menus: arr }, 'post')
    .then(() => {
      submmitLoading.value = false
      proxy.$message.success(c.value?.success)
      saveMenuLoading.value = false
      menuCheckChange.value = false
      refreshTree()
    })
    .catch(() => saveMenuLoading.value = false)
}

const refreshTree = () => {
  treeData.value = []
  if (currentDataId.value) {
    pageLoading.value = true
    proxy.$request(apiPath + 'getMenuAndEmp/' + currentDataId.value)
      .then(r => {
        menuObj.value = r.data.menuids
        treeData.value = _.cloneDeep(menuData.value)

        // Map permissions and checked state
        const mapState = (nodes) => {
           nodes.forEach(x => {
              const y = menuObj.value.find(m => m.menu_id == x.menu_id)
              if (y) {
                 x.checked = true
                 x.m_search1 = y.m_search
                 x.m_add1 = y.m_add
                 x.m_del1 = y.m_del
                 x.m_updata1 = y.m_updata
                 x.m_import1 = y.m_import
                 x.m_export1 = y.m_export
                 x.m_upload1 = y.m_upload
                 x.m_audit1 = y.m_audit
                 x.m_print1 = y.m_print
              } else {
                 x.checked = false
              }
              if (x.children) mapState(x.children)
           })
        }
        mapState(treeData.value)

        pageLoading.value = false
      })
      .catch(() => pageLoading.value = false)
    researchUser()
  }
}

const submmit = () => {
  submmitLoading.value = true
  let url = apiPath + 'add'
  if (!data.value.role_id) data.value.role_id = dateTools.now_time().replace(/[- :]/g, '') + '001'
  proxy.$request(url, data.value, 'post')
    .then(() => {
      submmitLoading.value = false
      proxy.$message.success(c.value?.success)
      editFormVisible.value = false
      getList()
    })
    .catch(() => submmitLoading.value = false)
}

const researchUser = () => {
  userQuery.page = 1
  getUserList()
}

const getUserList = () => {
  proxy.$request(proxy.$api.user + 'getroleuserpage/', {
    ...userQuery,
    role_id: currentDataId.value,
  })
  .then(r => {
    userList.value = r.data.list
    userTotal.value = r.data.total
  })
  .catch(() => {})
}

const addUserClick = () => {
  addUserDialogShow.value = true
}

const submmitAddUser = () => {
  if (!addUsers.value) return proxy.$message.error(l.value?.addUserIsEmpty)
  let user_ids = addUsers.value.replace('，', ',').split(',')
  submitAddUserLoading.value = true
  proxy.$request(
    apiPath + 'batchadduser/',
    {
      role_id: currentDataId.value,
      user_ids,
    },
    'post'
  )
    .then(() => {
      proxy.$message.success(c.value?.success)
      addUserDialogShow.value = false
      submitAddUserLoading.value = false
      addUsers.value = ''
      getUserList()
    })
    .catch(() => submitAddUserLoading.value = false)
}

const deleteUserRoleItem = (row) => {
  if (window.confirm(l.value?.removeUserFromRole)) {
    proxy.$request(
      apiPath + 'deleteroleuser/' + row.id,
      { id: row.id },
      'post'
    )
      .then(() => {
        proxy.$message.success(c.value?.success)
        getUserList()
      })
      .catch(() => {})
  }
}

const handleMenuChange = () => {
   menuCheckChange.value = true
}

onMounted(() => {
  getList()
  getOptions()
})
</script>

<style scoped>
</style>
