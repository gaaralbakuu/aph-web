<template>
  <div class="roleManage-container">
    <div class="pageBody">
      <div class="components">
        <el-drawer class="drawer-container" v-model:visible="showObj.role" :wrapperClosable='false' size="60%">
          <div slot='title' class="title">{{l.addEditRole}}</div>
          <div class="form-container">
            <el-form label-width="120px" size="medium">
              <el-form-item :label="l.belongCollege">
                <el-select v-model="roleObj.form.college_id" style="width: 100%;">
                  <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_zh"
                    :value="i.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="l.roleName">
                <el-input v-model="roleObj.form.role_name"></el-input>
              </el-form-item>
              <el-form-item :label="l.roleDescription">
                <el-input v-model="roleObj.form.role_desc"></el-input>
              </el-form-item>
              <el-form-item :label="l.superPermission">
                <el-select v-model="roleObj.form.is_super" style="width: 100%;">
                  <el-option :label="l.yes" value="Y"></el-option>
                  <el-option :label="l.no" value="N"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="l.forAllUsers">
                <el-select v-model="roleObj.form.is_all" style="width: 100%;" :disabled='!isAdmin'>
                  <el-option :label="l.yes" :value="1"></el-option>
                  <el-option :label="l.no" :value="0"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
          <div class="buttonBar">
            <el-button type="primary" @click="submitRole">{{l.submit}}</el-button>
            <el-button type="danger" @click="showObj.role = false">{{l.discard}}</el-button>
          </div>
        </el-drawer>
        <chooseUser v-model:visible="showObj.chooseUser" v-model:useridList="userObj.toBeAddedList" @submmit="submmitUser">
        </chooseUser>
      </div>

      <div class="filter-wrapper">
        <el-form inline>
          <el-form-item :label="l.college">
            <el-select v-model="roleObj.query.college_id" @change="getRoleList" :clearable="isAdmin">
              <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_zh"
                :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="l.name">
            <el-input clearable v-model="roleObj.query.role_name" @keyup.enter="getRoleList"
              @clear="getRoleList"></el-input>
          </el-form-item>
          <el-form-item :label="l.description">
            <el-input clearable v-model="roleObj.query.role_desc" @keyup.enter="getRoleList"
              @clear="getRoleList"></el-input>
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="getRoleList">{{l.search}}</el-button>
          </el-form-item>
        </el-form>
        <div> <el-button type="success" @click="addRole">{{l.createNewRole}}</el-button>
        </div>
      </div>

      <div class="role-wrapper">
        <div class="role-table">
          <el-table :data="roleObj.list" :row-class-name="tableRowClassName" highlight-current-row border
            @row-click="setCurrentID" :max-height="showObj.calculateMaxheight">
            <el-table-column prop="role_id" :label="l.roleId"></el-table-column>
            <el-table-column prop="role_name" :label="l.roleName"></el-table-column>
            <el-table-column prop="role_desc" :label="l.roleDescription"></el-table-column>
            <el-table-column :label="l.operation">
              <template #default="scope">
                <el-button type="text" @click="modifyRole(scope.row)">{{l.edit}}</el-button>
                <el-button type="text" class="text-red" @click="deleteRole(scope.row)">{{l.delete}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="role-tabs">
          <el-tabs type="border-card" style="width: 100%;">
            <el-tab-pane :label="l.userManagement">
              <div v-show="roleObj.currentId!=''" class="border-card">
                <div class="roleUser-filter" style="display: flex;justify-content: space-between;margin-bottom: 20px;">
                  <div>
                    <el-input v-model="userObj.query.name" clearable style="width: 250px;"></el-input>
                    <el-button type="success" @click="fliterUserlist(userObj.query.name)">{{c.queryButton}}</el-button>
                  </div>
                  <el-button type="primary" @click="showObj.chooseUser = true">{{l.addUser}}</el-button>
                </div>
                <el-table :data="userObj.filterList" :row-class-name="tableRowClassName" highlight-current-row border
                  :max-height="showObj.calculateMaxheight">
                  <el-table-column prop="userid" :label="l.barcode"></el-table-column>
                  <el-table-column prop="name_t" :label="l.username"></el-table-column>
                  <el-table-column prop="department_t" :label="l.department"></el-table-column>
                  <el-table-column :label="l.operation">
                    <template #default="scope">
                      <el-button type="text" class="text-red" @click="deleteUser(scope.row)">{{l.delete}}</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div v-show="roleObj.currentId==''" class="border-card">{{l.pleaseSelectRole}}</div>
            </el-tab-pane>
            <el-tab-pane :label="l.menuManagement">
              <div class="roleMenu-filter" style="display: flex;justify-content: space-between;margin-bottom: 20px;">
                <div style="width: 1px;"></div>
                <el-button type="success" @click="submitMenu">{{l.saveMenu}}</el-button>
              </div>
              <el-tree class="filter-tree" :data="publicCodeObj.menuList" node-key="menu_id" show-checkbox ref="tree">
                <template #{ node, data }><div class="custom-menu-node" v->
                  <span>
                    <el-tag style="text-align: center;" effect="dark" size="mini"
                      :type="data.resource_type=='navigator'?'warning':data.resource_type=='catalogue'?'primary':'success'">{{data.resource_type.substr(0,4).toUpperCase()}}</el-tag>
                  </span>
                  <span style="font-weight: 600;">{{ data[`name_${locale.split('-')[0]}`] }}</span>
                  <span v-show="data.resource_path" style="color: #aaa;">{{ data.resource_path }}</span>
                </div></template>
              </el-tree>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, getCurrentInstance, nextTick, onBeforeUnmount } from 'vue'
import chooseUser from '@/views/_common/ChooseUser.vue'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { l, c } = useLocalI18n('videoAdminRole')
const { proxy } = getCurrentInstance()

const defaultProps = reactive({
  children: 'children',
  label: 'role_name',
})
const publicCodeObj = reactive({
  org_id: [],
  collegeList: [],
  menuList: [],
})
const showObj = reactive({
  role: false,
  chooseUser: false,
  calculateMaxheight: 500,
})
const userObj = reactive({
  query: {
    role_id: '',
    page: 1,
    pageSize: 9999,
  },
  filterList: [], //通过关键字过滤的用户列表
  list: [],
  toBeAddedList: [],
})
const roleObj = reactive({
  currentId: '',
  query: {
    id: '',
    college_id: '',
    role_id: '',
    role_name: '',
    role_desc: '',
    is_super: '',
    is_valid: 'Y',
    page: 1,
    pageSize: 9999,
  },
  form: {
    id: '',
    org_id: '',
    role_id: '',
    college_id: '',
    role_name: '',
    role_desc: '',
    is_super: '',
    is_all: '',
  },
  list: [],
})

const isAdmin = computed(() => proxy.$store.getters.isAdmin)
const locale = computed(() => proxy.$i18n.locale)

const tableRowClassName = ({ row, rowIndex }) => {
  if (rowIndex % 2 == 0) {
    return ''
  } else {
    return 'warning-row'
  }
}

const setCurrentID = (row) => {
  roleObj.currentId = row.role_id
  userObj.query.role_id = row.role_id
  getUserListByRoleID()
  getUserMenuByRoleID()
}

const getFormattedDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const second = String(now.getSeconds()).padStart(2, '0')
  const millisecond = String(now.getMilliseconds()).padStart(3, '0')
  return `r${year}${month}${day}${hour}${minute}${second}${millisecond}`
}

const addRole = () => {
  roleObj.form = {
    id: '',
    org_id: '', //组织ID
    role_id: getFormattedDateTime(), //菜单ID
    role_name: '',
    role_desc: '',
    is_super: 'N',
    is_all: 0,
  }
  showObj.role = true
}

const modifyRole = (data) => {
  roleObj.form = Object.assign(roleObj.form, data)
  showObj.role = true
}

const deleteRole = (data) => {
  let postData = {
    role_id: data.role_id,
    is_valid: data.is_valid == 'Y' ? 'N' : 'Y',
  }
  proxy
    .$confirm(l.value.confirmDeleteRole.replace('{name}', data.role_name), l.value.deleteRoleTitle, {
      confirmButtonText: l.value.confirm,
      cancelButtonText: l.value.cancel,
      type: 'warning',
    })
    .then(() => {
      proxy.$request(proxy.$api.videoServer + '/Video/VideoMenu/deleteRole', postData, 'post').then((r) => {
        if (r.status) {
          proxy.$message({
            type: 'success',
            message: l.value.deleteSuccess,
          })
          getRoleList()
        }
      })
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: l.value.cancelDelete,
      })
    })
}

const getRoleList = () => {
  proxy.$request(proxy.$api.videoServer + '/Video/VideoMenu/getRoleDescList', roleObj.query).then((r) => {
    roleObj.list = r.data

    if (roleObj.list.length == 0) {
      userObj.list = []
    }
  })
}

const getPublic_org_id = () => {
  proxy
    .$request(proxy.$api.publiccode + 'getListdetailed', {
      queryString: {},
      ruleno: '107',
      pageSize: 9999,
    })
    .then((r) => {
      let list = []
      r.data.list.forEach((j) => {
        list.push({
          label: j.name_label + '(' + j.code_no + ')',
          value: j.code_no,
        })
      })
      publicCodeObj.org_id = list
    })
    .catch((e) => {
      proxy.$message.error(e.message)
    })
}

const submitRole = () => {
  proxy.$request(proxy.$api.videoServer + '/Video/VideoMenu/addOrModifyRoleDesc', roleObj.form, 'post').then((r) => {
    if (r.status) {
      proxy.$message({
        type: 'success',
        message: l.value.submitSuccess,
      })
      showObj.role = false
      getRoleList()
    }
  })
}

const removeMenuItemByPath = (menuItems, targetPath) => {
  for (let i = 0; i < menuItems.length; i++) {
    const item = menuItems[i]
    if (item.resource_path === targetPath) {
      menuItems.splice(i, 1)
      return true
    }
    if (item.children && item.children.length > 0) {
      const removed = removeMenuItemByPath(item.children, targetPath)
      if (removed) return true
    }
  }
  return false
}

const submitMenu = () => {
  let checkedKeys = proxy.$refs.tree.getCheckedKeys()
  let postData = {
    role_id: roleObj.currentId,
    dtos: [],
  }
  if (checkedKeys.length > 0) {
    checkedKeys.forEach((i) => {
      postData.dtos.push({
        id: '',
        role_id: roleObj.currentId,
        menu_id: i,
        role_type: '',
      })
    })
  }
  proxy.$request(proxy.$api.videoServer + '/Video/VideoMenu/addOrModifyRoleMenu', postData, 'post').then((r) => {
    if (r.status) {
      proxy.$message({
        type: 'success',
        message: l.value.saveSuccess,
      })
    }
  })
}

const getCollegeList = () => {
  proxy
    .$request(proxy.$api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
      resource_path: proxy.$route.path,
    })
    .then((r) => {
      if (r.status == true && r.data.length > 0) {
        publicCodeObj.collegeList = r.data
        if (!isAdmin.value) {
          roleObj.query.college_id = r.data[0].id
        }
        getRoleList()
      }
    })
    .catch((e) => {
      proxy.$message.error(e.message)
    })
}

const filterNode = (value, data) => {
  if (!value) return true
  return data.label.indexOf(value) !== -1
}

const isUserExist = (userId) => {
  return userObj.list.some((i) => i.userid == userId)
}

const submmitUser = () => {
  if (userObj.toBeAddedList.length == 0) {
    showObj.chooseUser = false
  } else {
    let postData = []
    userObj.toBeAddedList.forEach((i) => {
      if (!isUserExist(i)) {
        postData.push({
          id: '',
          is_valid: 'Y',
          userid: i,
          org_id: '',
          role_id: roleObj.currentId,
        })
      }
    })
    if (postData.length > 0) {
      proxy.$request(proxy.$api.videoServer + '/Video/VideoMenu/addOrModifyUserRole', postData, 'post').then((r) => {
        showObj.chooseUser = false
        getUserListByRoleID()
      })
    } else {
      proxy.$message({
        type: 'info',
        message: l.value.targetUserExist,
      })
    }
  }
}

const getMenuList = () => {
  proxy
    .$request(proxy.$api.videoServer + '/Video/VideoMenu/getlist', {
      page: 1,
      pageSize: 9999,
    })
    .then((r) => {
      publicCodeObj.menuList = r.data.list
      if (isAdmin.value == false) {
        let targetPath = '/videoAdminLayout/lesson/menuManage'
        if (removeMenuItemByPath(publicCodeObj.menuList, targetPath)) {
          console.log('菜单项已成功移除')
        } else {
          console.log('未找到指定路径的菜单项')
        }
      }
    })
}

const getUserListByRoleID = () => {
  proxy.$request(proxy.$api.videoServer + '/Video/VideoMenu/getRoleUser', userObj.query).then((r) => {
    userObj.list = r.data
    userObj.filterList = r.data
  })
}

const fliterUserlist = (text) => {
  if (text == '') {
    userObj.filterList = userObj.list
  } else {
    userObj.filterList = userObj.list.filter((user) => {
      return user.name_t.includes(text)
    })
  }
}

const getUserMenuByRoleID = () => {
  proxy
    .$request(proxy.$api.videoServer + '/Video/VideoMenu/getRoleMenuList', {
      role_id: roleObj.currentId,
      page: 1,
      pageSize: 9999,
    })
    .then((r) => {
      if (r.data.total > 0) {
        let list = r.data.list.filter((i) => i.resource_type == 'menu')
        let keys = list.map((i) => i.menu_id)
        proxy.$refs.tree.setCheckedKeys(keys)
      } else {
        proxy.$refs.tree.setCheckedKeys([])
      }
    })
}

const deleteUser = (i) => {
  proxy
    .$confirm(l.value.confirmDeleteUser.replace('{name}', i.name_t), l.value.deleteUserTitle, {
      confirmButtonText: l.value.confirm,
      cancelButtonText: l.value.cancel,
      type: 'warning',
    })
    .then(() => {
      proxy
        .$request(
          proxy.$api.videoServer + '/Video/VideoMenu/deleteUserFromRoleById',
          {
            id: i.id,
          },
          'post'
        )
        .then((r) => {
          proxy.$message({
            type: 'success',
            message: l.value.cancelDelete,
          })
          getUserListByRoleID()
        })
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: l.value.cancelDelete,
      })
    })
}

const returnMaxheight = () => {
  showObj.calculateMaxheight = window.innerHeight - 250
}

onMounted(() => {
  getCollegeList()
  getMenuList()
  window.addEventListener('resize', returnMaxheight)
  nextTick(() => {
    returnMaxheight()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', returnMaxheight)
})
</script>

<style>
.roleManage-container {
  width: 100%;
  height: 100%;
}
.roleManage-container .pageBody {
  width: 100%;
  margin: 0 auto;
}
.roleManage-container .pageBody .drawer-container {
  width: 100%;
}
.roleManage-container .pageBody .drawer-container .title {
  padding: 20px 0px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
}
.roleManage-container .pageBody .drawer-container .form-container {
  width: 100%;
  height: 95%;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
}
.roleManage-container .pageBody .drawer-container .buttonBar {
  width: 100%;
  height: 60px;
  margin: 0 auto;
  padding: 0 15px;
  position: absolute;
  bottom: 0px;
  border-top: 1px solid #ccc;
  float: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.roleManage-container .pageBody .filter-wrapper {
  height: 60px;
  background-color: white;
  padding: 15px 10px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e1e1e1;
}
.roleManage-container .pageBody .role-wrapper {
  display: flex;
}
.roleManage-container .pageBody .role-wrapper .role-table {
  width: 40%;
}
.roleManage-container .pageBody .role-wrapper .role-tabs {
  flex: 1;
}
</style>
