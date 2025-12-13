<template>
  <div ref="lesssonCatalogue-container" class="lesssonCatalogue-container">
    <el-drawer class="drawer-container" :visible.sync="showObj.collegeShow" :wrapperClosable="false" size="40%" :before-close="getCollegeList">
      <div slot="title" class="title">{{ l.addEditCollege }}</div>
      <div class="form-container">
        <div class="form">
          <el-form label-width="100px" size="medium">
            <el-form-item :label="l.simplifiedChineseName" required>
              <el-input v-model="collegeList.form.name_zh"></el-input>
            </el-form-item>
            <el-form-item :label="l.traditionalChineseName">
              <el-input v-model="collegeList.form.name_tw"></el-input>
            </el-form-item>
            <el-form-item :label="l.englishName">
              <el-input v-model="collegeList.form.name_en"></el-input>
            </el-form-item>
            <el-form-item :label="l.vietnameseName">
              <el-input v-model="collegeList.form.name_vi"></el-input>
            </el-form-item>
            <el-form-item :label="l.allUsers" required>
              <el-switch v-model="collegeList.form.is_all" active-color="#13ce66" active-value="1" inactive-value="0"></el-switch>
            </el-form-item>
          </el-form>
        </div>
        <div class="buttonBar">
          <el-button type="primary" @click="submitORG">{{ l.submit }}</el-button>
          <el-button type="danger" @click="showObj.collegeShow = false">{{ l.close }}</el-button>
        </div>
      </div>
    </el-drawer>

    <div style="display: flex; justify-content: space-around">
      <div style="width: 30%">
        <div class="org_filter" style="display: flex; height: 60px; padding: 14px 0px">
          <el-input :placeholder="l.inputKeywordFilter" v-model="filterOrgText"></el-input>
          <el-button type="success" @click="getCollegeList" style="margin-left: 10px">{{ l.refresh }}</el-button>
          <el-button type="primary" @click="addORG" style="margin-left: 10px">{{ l.addCollege }}</el-button>
        </div>
        <el-tree class="org-tree" ref="orgTree" node-key="id" :accordion="true" :default-expand-all="true" :data="collegeList.data" :filter-node-method="filterOrg">
          <div class="org-tree-node" slot-scope="{ node, data }" @click="getCollegeUser(data.id)">
            <span>{{ data.name_zh }}</span>
            <span>
              <el-button type="text" @click.prevent="editORG(data)">{{ l.edit }}</el-button>
            </span>
          </div>
        </el-tree>
      </div>
      <div style="width: 65%">
        <div class="catalog_filter" style="display: flex; height: 60px; padding: 14px 0px">
          <el-select v-model="selectUser.value" :placeholder="l.pleaseSelect" @change="selectValueChange">
            <el-option v-for="item in selectUser.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-input :placeholder="l.inputKeywordFilter" v-model="filterCatalogText" clearable></el-input>
          <el-button type="success" @click="getCollegeUser" style="margin-left: 10px">{{ l.refresh }}</el-button>
          <el-button type="primary" @click="addUser" style="margin-left: 10px">{{ l.addUser }}</el-button>
        </div>
        <el-table :data="collegeUserList.data" style="width: 100%" :max-height="showObj.calculateMaxheight" ref="userTable">
          <el-table-column v-for="(item, index) in collegeUserList.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
          <el-table-column fixed="right" :label="l.operation" width="100">
            <template slot-scope="scope">
              <el-button @click="deleteUesrs(scope.row)" type="text" size="small" style="color: red">{{ l.delete }}</el-button>
            </template>
          </el-table-column>
        </el-table>

        <z-pagination :pagination="pagination" :total="collegeUserList.total" :page.sync="collegeUserList.query.page" :limit.sync="collegeUserList.query.pageSize" @change="getCollegeUser"></z-pagination>

        <chooseUser :visible.sync="showObj.addUserDialogShow" :useridList.sync="addUsers" @submmit="submmitAddUser"></chooseUser>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted, onBeforeUnmount, getCurrentInstance, nextTick } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import api from '@/api'
import { useLocalI18n } from '@/composables/useLocalI18n'
import store from '@/store'
import zPagination from '@/views/_common/Pagination.vue'
import chooseUser from '@/views/_common/ChooseUser.vue'

const instance = getCurrentInstance()
const { $request, $message, $confirm } = instance.proxy
const route = instance.proxy.$route
const router = instance.proxy.$router
const { l, c } = useLocalI18n('videoAdminCollege')
const queryClient = useQueryClient()

// State
const submitAddUserLoading = ref(false)
const addUsers = ref([])
const filterOrgText = ref('')
const filterCatalogText = ref('')

const selectUser = reactive({
  list: [],
  value: 'userid',
  options: [
    {
      value: 'userid',
      label: l.userid,
    },
    {
      value: 'name',
      label: l.name,
    },
  ],
})

const pagination = reactive({
  layout: 'prev, pager, next, jumper, ->, total,sizes',
  pagerCount: 7,
  pageSizes: [10, 15, 20, 30, 40, 50, 100],
})

const showObj = reactive({
  collegeShow: false,
  selectCourse: false,
  addUserDialogShow: false,
  calculateMaxheight: 600,
})

const collegeList = reactive({
  total: 0,
  page: 1,
  pageSize: 15,
  data: [],
  form: {
    rec_status: 1,
    id: '',
    is_all: '',
    name_zh: '',
    name_tw: '',
    name_en: '',
    name_vi: '',
  },
})

const collegeUserList = reactive({
  total: 0,
  data: [],
  query: {
    college_id: '',
    name: '',
    userid: '',
    is_super: '',
    page: 1,
    pageSize: 15,
  },
  form: {},
  columns: [
    {
      title: l.userid,
      key: 'userid',
    },
    {
      title: l.name,
      key: 'name_t',
    },
    {
      title: l.departmentCode,
      key: 'dept_no',
    },
    {
      title: l.departmentName,
      key: 'department_t',
    },
    {
      title: l.positionCode,
      key: 'work_no',
    },
    {
      title: l.positionName,
      key: 'work_name',
    },
  ],
})

const isAdmin = computed(() => {
  return store.getters.isAdmin
})

// Queries
const { data: collegeListData, refetch: refetchCollegeList } = useQuery({
  queryKey: ['collegeList', route.path],
  queryFn: () => $request(api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
    resource_path: route.path,
  }),
  enabled: false
})

watch(() => collegeListData.value, (newVal) => {
  if (newVal) {
    collegeList.data = newVal.data
    showObj.collegeShow = false
  }
})

const { data: collegeUserListData, refetch: refetchCollegeUserList } = useQuery({
  queryKey: ['collegeUserList', collegeUserList.query],
  queryFn: () => $request(api.baseUrl + '/Video/VideoCollege/getCollegeUser', collegeUserList.query),
  enabled: false
})

watch(() => collegeUserListData.value, (newVal) => {
  if (newVal) {
    collegeUserList.data = newVal.data.list
    collegeUserList.total = newVal.data.total
  }
})

// Mutations
const submitCollegeMutation = useMutation({
  mutationFn: (data) => $request(api.baseUrl + '/Video/VideoCollege/addOrModifyCollege', data, 'post'),
  onSuccess: (r) => {
    if (r.httpCode == 200) {
      $message.success(l.submitSuccess)
      setTimeout(() => {
        showObj.collegeShow = false
        refetchCollegeList()
      }, 1500)
    }
  }
})

const addUserMutation = useMutation({
  mutationFn: (userList) => $request(api.baseUrl + '/Video/VideoCollege/setUserIntoCollege', userList, 'post'),
  onSuccess: () => {
    $message.success(c.success)
    showObj.addUserDialogShow = false
    submitAddUserLoading.value = false
    addUsers.value = []
    refetchCollegeUserList()
  },
  onError: () => {
    submitAddUserLoading.value = false
  }
})

// Functions
const filterOrg = (value, data) => {
  if (!value) return true
  return data.name_zh.indexOf(value) !== -1
}

const addORG = () => {
  collegeList.form = Object.assign(collegeList.form, {
    id: '',
    is_all: '0',
    name_zh: '',
    name_tw: '',
    name_en: '',
    name_vi: '',
  })
  showObj.collegeShow = true
}

const editORG = (data) => {
  collegeList.form = Object.assign(collegeList.form, data)
  showObj.collegeShow = true
}

const submitORG = () => {
  if (!collegeList.form.name_zh) {
    return $message.error(l.pleaseInputChineseName)
  }
  submitCollegeMutation.mutate(collegeList.form)
}

const getCollegeList = () => {
  refetchCollegeList()
}

const getCollegeUser = (id) => {
  let org_id = ''
  if (typeof id == 'string') {
    org_id = id
    collegeUserList.query.college_id = org_id
  }
  refetchCollegeUserList()
}

const submmitAddUser = () => {
  if (addUsers.value.length == 0) return $message.error(l.addUserCannotEmpty)

  let userList = []
  addUsers.value.forEach((e) => {
    let j = {
      userid: e,
      college_id: collegeUserList.query.college_id,
      id: '',
    }
    userList.push(j)
  })

  submitAddUserLoading.value = true
  addUserMutation.mutate(userList)
}

const deleteUesrs = (row) => {
  if (!collegeUserList.query.college_id) return $message.error(l.pleaseSelectCollegeToDelete)

  const updatedRow = {
    ...row,
    is_valid: 'N',
    college_id: collegeUserList.query.college_id,
    is_super: collegeUserList.query.is_super,
  }
  let j = [updatedRow]
  $confirm(l.confirmAddData, l.dueDiligence, {
    confirmButtonText: l.confirm,
    cancelButtonText: l.cancel,
    type: 'warning',
  })
    .then(() => {
      addUserMutation.mutate(j)
    })
    .catch(() => {
      $message.info(l.cancelDelete)
    })
}

const selectValueChange = (r, i) => {
  collegeUserList.query.userid = ''
  collegeUserList.query.name = ''
  const filterKey = selectUser.value
  collegeUserList.query[filterKey] = filterCatalogText.value
  getCollegeUser()
}

const addUser = (data) => {
  if (!collegeUserList.query.college_id) return $message.error(l.pleaseClickConfirmCollege)
  showObj.addUserDialogShow = true
}

const returnMaxheight = () => {
  showObj.calculateMaxheight = window.innerHeight - 120
}

// Watchers
watch(filterOrgText, (val) => {
  instance.refs.orgTree.filter(val)
})

watch(filterCatalogText, (val) => {
  collegeUserList.query[selectUser.value] = val
  getCollegeUser()
})

onMounted(() => {
  getCollegeList()
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
.img {
  width: 80%;
  height: 60px;
}
.img .auto-img {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
}

.custom-tree-node {
  width: 95%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lesssonCatalogue-container {
  width: 100%;
  height: 100%;
}
.lesssonCatalogue-container .drawer-container .title {
  padding: 0px 20px 10px 20px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
}
.lesssonCatalogue-container .drawer-container .form-container {
  width: 100%;
  height: 95%;
  margin: 0 auto;
  background-color: #fff;
}
.lesssonCatalogue-container .drawer-container .form-container .form {
  width: 90%;
  margin: 0 auto;
}
.lesssonCatalogue-container .drawer-container .form-container .buttonBar {
  width: 100%;
  height: 60px;
  margin: 0 auto;
  padding: 0 30px;
  position: absolute;
  bottom: 0px;
  border-top: 1px solid #ccc;
  float: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.lesssonCatalogue-container .org-tree-node {
  width: 85%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
