<template>
  <div class="app-container" v-loading="pageLoading">
    <el-row :gutter="7">
      <el-col :span="7">
        <el-button v-show="showAuth.m_add" class="fr" style="margin-right: 20px" type="primary" @click="createItem">{{ l.createItem }} </el-button>
        <div v-show="showAuth.m_search" class="filter-container" style="margin-right: 20px">
          <el-input style="width: 250px" :placeholder="l.search" clearable prefix-icon="el-icon-search" class="filter-item" @keyup.enter.native="research" @clear="research" v-model="query.queryString"> </el-input>
        </div>
        <div class="roleBox">
          <z-table :list="list" :tableProps="tableProps" :columns="columns" @row-click="getChildrenTree" @editItem="editItem" @deleteItem="deleteItem">
            <template v-slot:operation="v">
              <a v-show="showAuth.m_updata" href="#" class="text-blue" @click.prevent="editItem(v.row, v.$index)">{{ c.edit }}</a
              >&nbsp;
              <a v-show="showAuth.m_del" href="#" class="text-red" @click.prevent="deleteItem(v.row, v.$index)">{{ c.delete }}</a>
            </template>
          </z-table>
          <z-pagination :pagination="pagination" :total="total" :page.sync="query.page" :limit.sync="query.size" @change="getList"></z-pagination>
        </div>
      </el-col>

      <el-col :span="6">
        <div class="userBox">
          <div style="min-height: 36px" v-if="currentDataId">
            <div class="flex flex-center" style="font-size: 12px; margin-bottom: 10px">
              <span
                ><b>{{ l.allocatedAccount }}</b></span
              >
              <div class="flex1"></div>
              <el-input v-show="showAuth.m_search" style="display: inline-block; width: 120px" suffix-icon="el-icon-search" size="mini" clearable v-model="userQuery.queryString" @change="researchUser"> </el-input>
              <el-button v-show="showAuth.m_add" style="margin-right: 20px" class="ml-5" size="mini" type="primary" icon="el-icon-plus" circle plain @click="addUserClick"> </el-button>
            </div>
          </div>
          <div v-if="currentDataId">
            <z-table :list="userList" :tableProps="userTableProps" :columns="userColumns">
              <template v-slot:operation="v">
                <a href="#" class="text-red" v-show="showAuth.m_del" @click.prevent="deleteUserRoleItem(v.row, v.$index)">{{ c.delete }}</a>
              </template>
            </z-table>
            <z-pagination :small="true" :pagination="userPagination" :total="userTotal" :page.sync="userQuery.page" :limit.sync="userQuery.size" @change="getUserList"> </z-pagination>
          </div>
        </div>
      </el-col>

      <el-col :span="11">
        <div style="min-height: 36px">
          <div
            style="display: inline-block; width: 120px; font-size: 12px; padding-top: 10px"
            v-if="currentDataId">
            <b> {{ l.selectedMemnu }}</b>
          </div>
          <el-button v-show="showAuth.m_updata" type="success" style="float: right" v-if="currentDataId && menuCheckChange" :loading="saveMenuLoading" @click="saveRoleMenu">
            {{ l.save }}
          </el-button>
        </div>
        <div v-if="currentDataId" style="border: #f4f4f4 solid 1px; padding: 10px 0">
          <el-tree :data="treeData" node-key="menu_id" :default-expand-all="false" :show-checkbox="true" ref="tree" :default-checked-keys="menuIds" :expand-on-click-node="false" @check-change="menuCheckChange = true">
            <span class="custom-tree-node" slot-scope="{ data }">
              <span style="font-weight: bold">{{ data.menu_name_label }}&nbsp;&nbsp;[{{ data.resource_type }}] </span>
              <span v-show="showAuth.m_updata">
                <el-switch :width="27" @change="menuCheckChange = true" v-show="data.m_add == 'Y' && data.resource_type != 'MENU'" v-model="data.m_add1" :active-text="c.m_add" active-value="Y" inactive-value="N"> </el-switch>
                <el-switch :width="27" @change="menuCheckChange = true" v-show="data.m_del == 'Y' && data.resource_type != 'MENU'" v-model="data.m_del1" :active-text="c.m_del" active-value="Y" inactive-value="N"> </el-switch>
                <el-switch :width="27" @change="menuCheckChange = true" v-show="data.m_updata == 'Y' && data.resource_type != 'MENU'" v-model="data.m_updata1" :active-text="c.m_updata" active-value="Y" inactive-value="N"> </el-switch>
                <el-switch :width="27" @change="menuCheckChange = true" v-show="data.m_search == 'Y' && data.resource_type != 'MENU'" v-model="data.m_search1" :active-text="c.m_search" active-value="Y" inactive-value="N"> </el-switch>
                <el-switch :width="27" @change="menuCheckChange = true" v-show="data.m_import == 'Y' && data.resource_type != 'MENU'" v-model="data.m_import1" :active-text="c.m_import" active-value="Y" inactive-value="N"> </el-switch>
                <el-switch :width="27" @change="menuCheckChange = true" v-show="data.m_export == 'Y' && data.resource_type != 'MENU'" v-model="data.m_export1" :active-text="c.m_export" active-value="Y" inactive-value="N"> </el-switch>
                <el-switch :width="27" @change="menuCheckChange = true" v-show="data.m_upload == 'Y' && data.resource_type != 'MENU'" v-model="data.m_upload1" :active-text="c.m_upload" active-value="Y" inactive-value="N"> </el-switch>
                <el-switch :width="27" @change="menuCheckChange = true" v-show="data.m_audit == 'Y' && data.resource_type != 'MENU'" v-model="data.m_audit1" :active-text="c.m_audit" active-value="Y" inactive-value="N"> </el-switch>
                <el-switch :width="27" @change="menuCheckChange = true" v-show="data.m_print == 'Y' && data.resource_type != 'MENU'" v-model="data.m_print1" :active-text="c.m_print" active-value="Y" inactive-value="N"> </el-switch>
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
    </el-row>

    <z-form-dialog :name="name" :data="data" :formProps="formProps" :fields="fields" @submmit="submmit" :submmitLoading="submmitLoading" :visible.sync="editFormVisible"></z-form-dialog>
    <!-- <el-dialog :visible.sync="editFormVisible">
        <el-form>
          <el-form-item label="角色名称">
          <el-input v-model="data.role_name"></el-input>
          </el-form-item>
          <el-form-item label="角色说明">
          <el-input v-model="data.role_name"></el-input>
          </el-form-item>
          <el-form-item label="角色类型">
          <el-input v-model="data.role_name"></el-input>
          </el-form-item>
        </el-form>
      </el-dialog> -->
    <chooseUser :visible.sync="addUserDialogShow" :useridList.sync="addUsers" @submmit="submmitAddUser"></chooseUser>
    <!-- <el-dialog :title="l.batchAddUser" :visible.sync="addUserDialogShow" width="40%">
			<el-form label-width="100px">
				<el-form-item :label="l.addUserLabel">
					<el-input type="textarea" :placeholder="l.addUserPlaceholder" v-model="addUsers"
						style="width: 80%">
					</el-input>
				</el-form-item>
			</el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="addUserDialogShow = false">{{c.cancel}}</el-button>
				<el-button type="primary" @click="submmitAddUser" :loading="submitAddUserLoading">{{c.confirm}}
				</el-button>
			</span>
		</el-dialog> -->
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, getCurrentInstance, watch } from 'vue'
import { arrayToObject, dateTools } from '@/utils'
import { _, api, initFuncs, zFormDialog, zPagination, zTable } from '@/views/_common'
import chooseUser from '@/views/_common/ChooseUser.vue'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('adminRole') // Assuming the name based on the file content's name property

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
const columns = computed(() => [
  {
    title: l.value.role_id,
    key: 'role_id',
  },
  {
    title: l.value.role_name,
    key: 'role_name',
  },
  {
    title: l.value.role_desc,
    key: 'role_desc',
  },
])
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
const tableProps = reactive({
  border: true,
  opsColWith: 100,
  highlightCurrentRow: true,
})
const formProps = reactive({
  dialogWidth: '70%',
  labelWidth: '140px',
})
const query = reactive({
  params: {},
  size: 15,
  page: 1,
  role_type: 'cis',
  queryString: '',
})
const pagination = reactive({
  layout: 'prev, pager, next, jumper, ->, total, sizes',
})
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
const userColumns = computed(() => [
  {
    title: l.value.userid,
    key: 'userid',
  },
  {
    title: l.value.username,
    key: 'username',
  },
])
const userTableProps = reactive({
  border: true,
  opsColWith: 60,
  highlightCurrentRow: true,
})
const userQuery = reactive({
  queryString: '',
  size: 15,
  page: 1,
  role_type: 'cis',
})
const userPagination = reactive({
  layout: 'prev, pager, next, jumper, ->, total, sizes',
})
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

      console.log(tmp)

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
  // Assuming emptyData might reset all fields. Since data is reactive, need to check if properties exist.
  // Re-initializing properties might be needed if they are gone.
  data.role_desc = ''
  data.role_name = ''
  data.role_type = 'cis'
  editFormVisible.value = true
}

const editItem = (v) => {
  if (userAuth.value.m_updata == 'N') {
    return proxy.$message({
      message: c.value.authError,
      type: 'error',
    })
  }
  pageLoading.value = true
  proxy
    .$request(apiRole + 'getbyid', {
      id: v.id,
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

const deleteItem = (v) => {
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
        .$request(apiRole + 'delete/' + v.id, {}, 'post')
        .then((r) => {
          pageLoading.value = false
          proxy.$message({
            message: c.value.success,
            type: 'success',
          })
          currentDataId.value = 0
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

  console.log(nodes)
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
        console.log(treeData.value)
        treeData.value.forEach((i) => {
          i.children.forEach((x) => {
            menuObj.value.forEach((y) => {
              if (x.menu_id == y.menu_id) {
                ;(x.m_search1 = y.m_search), (x.m_add1 = y.m_add), (x.m_del1 = y.m_del), (x.m_updata1 = y.m_updata), (x.m_import1 = y.m_import), (x.m_export1 = y.m_export), (x.m_upload1 = y.m_upload), (x.m_audit1 = y.m_audit), (x.m_print1 = y.m_print)
              }
            })
          })
        })
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
  // proxy.$set(data, 'role_type', 'cis')
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
  { deep: true }
)
</script>

<style scoped>
/* .custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  padding-right: 8px;
}

.operaSpan {
  opacity: 1;
}

.operaSpan:hover {
  opacity: 1;
}

.topBox {
  display: block;
  width: 100%;
  height: 35px;
} */
</style>
