<template>
  <div class="app-container">
    <!-- 查询区域 -->
    <div>
      <div style="display: flex; gap: 16px; margin-bottom: 10px">
        <!-- Left: 6 search fields in one column -->
        <div style="flex: 1; display: flex; flex-direction: column; gap: 12px">
          <div style="display: flex; gap: 12px">
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ l.account }}</label>
              <el-input :placeholder="l.input_accou" v-model="account.query.account" clearable style="width: 100%" />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ l.manufacture_name }}</label>
              <el-input :placeholder="l.input_manufacture_name" v-model="account.query.manufacture_name" clearable style="width: 100%" />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ l.account_type }}</label>
              <el-input :placeholder="l.input_account_type" v-model="account.query.account_type" clearable style="width: 100%" />
            </div>
          </div>
          <div style="display: flex; gap: 12px">
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ l.email }}</label>
              <el-input :placeholder="l.input_email" v-model="account.query.email" clearable style="width: 100%" />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ l.create_time }}</label>
              <el-input :placeholder="l.input_create_time" v-model="account.query.create_time" clearable style="width: 100%" />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ l.status }}</label>
              <el-select v-model="account.query.is_valid" :placeholder="l.choose" clearable style="width: 100%">
                <el-option v-for="item in accountOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </div>
        </div>
        <!-- Right: 2 buttons aligned at the bottom -->
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-end; min-width: 160px; gap: 12px">
          <el-button v-show="showAuth.m_search" type="primary" size="medium" @click="getUser" style="margin-right: 8px">{{ c.queryButton }}</el-button>
          <el-button v-show="showAuth.m_search" type="info" size="medium" @click="reset">{{ l.reset }}</el-button>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <el-button v-show="showAuth.m_add" type="primary" class="create_btn" size="medium" @click="add">{{ c.create }}</el-button>
    <!-- 表格 -->
    <a-table :dataSource="account.list" :columns="accountColumns" :pagination="false" :bordered="config.tableProps.border" rowKey="id">
      <template slot="operation" slot-scope="text, record, index">
        <a v-if="record.is_valid == 'N'" href="#" class="text-blue">
          {{ c.enable }}
        </a>
        <a v-else href="#" class="text-blue">
          {{ c.disable }}
        </a>
        <span>&nbsp;</span>
        <a v-show="showAuth.m_updata" href="#" class="text-green" @click.prevent="editItem(record, index)">
          {{ c.edit }}
        </a>
        <span>&nbsp;</span>
        <a v-show="showAuth.m_del" href="#" class="text-red" @click.prevent="deleteItem(record, index)">
          {{ c.delete }}
        </a>
      </template>
    </a-table>
    <!-- 分页 -->
    <z-pagination :pagination="pagination" :total="account.total" :page.sync="account.query.page" :limit.sync="account.query.pageSize" @change="getUser"></z-pagination>
    <!-- 创建、编辑表单 -->
    <CustomDialog :title="l.account" :visible.sync="account.editFormVisible" :maxWidth="'500px'" :clickOutside="false">
      <template #notice>
        <div class="text-sm text-gray-500 bg-gray-50 px-6 py-3">Tạo tài khoản mới dành cho đối tác sử dụng</div>
      </template>
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-light flex">
              {{ l.account }}
              <span class="text-red-500" v-if="true">*</span>
            </label>
            <el-input :placeholder="l.account" v-model="account.data.account" :disabled="false" clearable />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-light flex">
              {{ l.password }}
              <span class="text-red-500" v-if="true">*</span>
            </label>
            <el-input :placeholder="l.password" v-model="account.data.password" type="password" clearable />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-light flex">
              {{ l.email }}
            </label>
            <el-input :placeholder="l.email" v-model="account.data.email" clearable />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-light flex">
              {{ l.phone }}
              <span class="text-red-500" v-if="true">*</span>
            </label>
            <el-input :placeholder="l.phone" v-model="account.data.phone" :disabled="false" clearable />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-light flex">
              {{ l.account_name }}
              <span class="text-red-500" v-if="true">*</span>
            </label>
            <el-input :placeholder="l.account_name" v-model="account.data.account_name" clearable />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-light flex">
              {{ l.manufacture_name }}
              <span class="text-red-500" v-if="true">*</span>
            </label>
            <div class="flex gap-2">
              <el-input :placeholder="l.manufacture_name" v-model="account.data.company_name" :disabled="true" clearable />

              <el-button type="primary" :disabled="false" @click="openDept">{{ l.baseFile_select }}</el-button>
            </div>
          </div>
          <div class="flex flex-col gap-2" style="display: none">
            <el-input v-model="account.data.manufacturer_id" :disabled="true" style="visibility: hidden" />
          </div>
        </div>
      </template>
      <template #footer>
        <el-button @click="account.editFormVisible = false">
          {{ c.cancel }}
        </el-button>
        <el-button type="primary" @click="submmit">
          {{ c.confirm }}
        </el-button>
      </template>
    </CustomDialog>
    <!-- 选择分类对话框 -->
    <CustomDialog :title="l.baseFile_select" :visible.sync="manufacturer.dialogVisible" width="100%" :maxWidth="'600px'">
      <el-input style="width: 200px; margin-bottom: 10px" prefix-icon="el-icon-search" :placeholder="l.manufacture_name" clearable class="filter-item" @keyup.enter.native="getManufacturer" @clear="getManufacturer" @blur="getManufacturer" v-model="manufacturer.manufacture_name"></el-input>
      <a-table :dataSource="manufacturer.list" :columns="manufacturerColumns" :pagination="false" :bordered="config.tableProps.border" rowKey="manufacture_id" @row="sendManufacturerItem">
        <template slot="operation" slot-scope="text, record, index">
          <a href="#" class="text-blue" @click.prevent="sendManufacturerItem(record, index)">
            {{ l.select }}
          </a>
          &nbsp;
        </template>
      </a-table>
      <z-pagination :pagination="pagination" :total="manufacturer.query.total" :page.sync="manufacturer.query.page" :limit.sync="manufacturer.query.pageSize" @change="getManufacturer"></z-pagination>
    </CustomDialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, watch, set } from 'vue'
import { _, api, defaultConfig, zPagination } from '@/views/_common'
import CustomDialog from '../../_common/CustomDialog.vue'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('accountManagement')

const config = Object.assign({}, _.cloneDeep(defaultConfig), {
  api: api.ComplianceUser,
  apiList: api.ComplianceUser + 'getlist',
  apiUpdate: api.ComplianceUser + 'update',
  apiAdd: api.ComplianceUser + 'add',
  apiDelete: api.ComplianceUser + 'delete',
  apiManufacturer: api.ComplianceManufacturer + 'getlist',
  tableProps: {
    border: true,
    opsColWith: 150,
  },
})

const userAuth = ref({})
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

const pagination = ref(null) // Pagination props often passed to z-pagination, check usage. Original data: pagination: undefined/null implicit?
// Actually z-pagination likely expects `pagination` prop if it's not null.
// In original code, `pagination` was not defined in data, so it was undefined.
// We can leave it undefined or null.

const account = reactive({
  list: [],
  data: {},
  formProps: {
    dialogWidth: '30%',
    labelWidth: '160px',
  },
  query: {
    account: '',
    manufacture_name: '',
    account_type: '',
    email: '',
    create_time: '',
    status: '',
    is_valid: 'Y',
    pageSize: 10,
    page: 1,
  },
  total: 0,
  editFormVisible: false,
  // fields: ... defined below as computed or just used in logic
  // Original `fields` usage:
  // `this.account.fields[0].props.disabled = false`
  // We need to maintain this structure or refactor.
  // I will define it as reactive and use it in add/edit.
  fields: [
    {
      title: l.value.account,
      key: 'account',
      span: 24,
      required: true,
      props: {
        disabled: false,
      },
    },
    {
      title: 'password',
      key: 'password',
      span: 24,
      required: true,
    },
    {
      title: 'email',
      key: 'email',
      span: 24,
    },
    {
      title: 'phone',
      key: 'phone',
      span: 24,
      required: true,
      props: {
        disabled: false,
      },
    },
    {
      title: 'account_name',
      key: 'account_name',
      span: 24,
      required: true,
    },
    {
      title: 'manufacture_name',
      key: 'company_name',
      span: 24,
      required: true,
      props: {
        disabled: true,
      },
    },
    {
      span: 6,
      name: 'button',
      value: 'baseFile_select',
      props: {
        type: 'primary',
        disabled: false,
      },
      events: {
        click: openDept,
      },
    },
    {
      title: '',
      key: 'manufacturer_id',
      span: 24,
      props: {
        disabled: true,
        style: 'visibility:hidden',
      },
    },
  ]
})

const accountOptions = computed(() => [
  {
    value: 'Y',
    label: c.value.enable,
  },
  {
    value: 'N',
    label: c.value.disable,
  },
])

const accountColumns = computed(() => [
  {
    title: l.value.account,
    dataIndex: 'account',
    fixed: true,
    width: 110,
  },
  {
    title: l.value.account_name,
    dataIndex: 'account_name',
    fixed: true,
    width: 110,
  },
  {
    title: l.value.manufacture_name,
    dataIndex: 'company_name',
  },
  {
    title: l.value.email,
    dataIndex: 'email',
  },
  {
    title: l.value.phone,
    dataIndex: 'phone',
  },
  {
    title: l.value.create_time,
    dataIndex: 'create_time',
  },
  {
    title: l.value.status,
    dataIndex: 'is_valid',
  },
  {
    title: l.value.operation,
    scopedSlots: { customRender: 'operation' },
    width: 150,
  },
])

const manufacturer = reactive({
  list: [],
  data: {},
  query: {
    manufacture_name: '',
    pageSize: 10,
    page: 1,
    total: 0,
  },
  dialogVisible: false,
})

const manufacturerColumns = computed(() => [
  {
    title: l.value.manufacture_name,
    dataIndex: 'name_en',
    fixed: true,
    width: 500,
  },
  {
    title: l.value.operation,
    scopedSlots: { customRender: 'operation' },
    width: 100,
  },
])

function getUser() {
  proxy.$request(config.apiList, account.query, 'post')
    .then((r) => {
      account.list = r.data.list
      account.total = r.data.total
    })
    .catch((e) => {})
}

function reset() {
  account.query.account = ''
  account.query.manufacture_name = ''
  account.query.account_type = ''
  account.query.email = ''
  account.query.create_time = ''
  account.query.is_valid = ''
}

function getManufacturer() {
  proxy.$request(config.apiManufacturer, manufacturer.query, 'get')
    .then((r) => {
      manufacturer.list = r.data.list
      manufacturer.query.total = r.data.total
    })
    .catch((e) => {})
}

function add() {
  account.data = {}
  account.fields[0].props.disabled = false
  account.fields[3].props.disabled = false
  account.fields[5].props.disabled = true
  account.editFormVisible = true
}

function editItem(data) {
  account.data = _.cloneDeep(data)
  account.data.password = ''
  account.fields[0].props.disabled = true
  account.fields[3].props.disabled = true
  account.fields[5].props.disabled = true
  account.editFormVisible = true
}

function submmit() {
  let url = ''
  if (account.data.id) {
    url = config.apiUpdate
  } else {
    url = config.apiAdd
  }
  proxy.$request(url, account.data, 'post')
    .then((r) => {
      proxy.$message({
        message: c.value.success,
        type: 'success',
      })
      getUser()
      account.editFormVisible = false
    })
    .catch((e) => {})
}

function deleteItem(data) {
  proxy.$prompt(l.value.prompt, c.value.oprConfirm, {
    type: 'warning',
    inputPattern: /^[Y]{1}$/i,
    inputErrorMessage: l.value.inputErrorMessage,
    confirmButtonText: c.value.confirm,
    cancelButtonText: c.value.cancel,
  })
    .then(() => {
      proxy.$request(config.apiDelete, { id: data.id }, 'post')
        .then((r) => {
          proxy.$message({
            type: 'success',
            message: c.value.success,
          })
          getUser()
        })
        .catch((e) => {
          proxy.$message.error(l.value.delete_error)
        })
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: l.value.info,
      })
    })
}

function openDept() {
  manufacturer.dialogVisible = true
}

function sendManufacturerItem(data) {
  set(account.data, 'manufacturer_id', data.manufacture_id)
  set(account.data, 'account_name', data.name_en)
  set(account.data, 'company_name', data.name_en)
  manufacturer.dialogVisible = false
}

function getUserAuth() {
  console.log(proxy.$api.checkMenuAuth)

  proxy.$request(proxy.$api.checkMenuAuth, {
    resourcepath: proxy.$route.name,
  }).then((r) => {
    userAuth.value = r.data[0]
  })
}

watch(userAuth, (newV) => {
  showAuth.m_add = newV.m_add == 'Y'
  showAuth.m_search = newV.m_search == 'Y'
  showAuth.m_del = newV.m_del == 'Y'
  showAuth.m_updata = newV.m_updata == 'Y'
  showAuth.m_import = newV.m_import == 'Y'
  showAuth.m_export = newV.m_export == 'Y'
  showAuth.m_upload = newV.m_upload == 'Y'
  showAuth.m_audit = newV.m_audit == 'Y'
  showAuth.m_print = newV.m_print == 'Y'
}, { deep: true })

onMounted(() => {
  getUser()
  getManufacturer()
  getUserAuth()
})
</script>
<style scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
  padding: 0px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple-light {
  background: #e5e9f2;
}
.row-bg {
  padding: 5px 0;
  background-color: #f9fafc;
}
.r_input {
  width: 1600px;
}
.r_btn {
  float: right;
  padding: 0;
  margin: 0;
}
.search_tips {
  width: 100px;
  text-align: right;
  font-size: 14px;
  display: inline-block;
  font-family: '微软雅黑';
}
.create_btn {
  margin-bottom: 15px;
}
</style>
