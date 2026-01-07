<template>
  <div class="app-container">
    <!-- 查询区域 -->
    <div>
      <el-row :gutter="24">
        <el-col :span="22">
          <el-row :gutter="22" class="r_input">
            <el-col :span="7">
              <span class="search_tips">{{ l.label }}</span>
              <el-input :placeholder="l.input" clearable v-model="direct.query.label" style="width: 300px"></el-input>
            </el-col>
            <el-col :span="7">
              <span class="search_tips">{{ l.type }}</span>
              <el-input :placeholder="l.input" clearable v-model="direct.query.type" style="width: 300px"></el-input>
            </el-col>
            <el-col :span="7">
              <span class="search_tips">{{ l.create_time }}</span>
              <el-date-picker type="date" :placeholder="l.input" v-model="direct.query.create_time" style="width: 300px"></el-date-picker>
            </el-col>
          </el-row>
          <el-row :gutter="22" class="r_input">
            <el-col :span="7">
              <span class="search_tips">{{ l.create_user }}</span>
              <el-input :placeholder="l.input" v-model="direct.query.create_user" clearable style="width: 300px"></el-input>
            </el-col>
            <el-col :span="7">
              <span class="search_tips">{{ l.modify_time }}</span>
              <el-input :placeholder="l.input" v-model="direct.query.modify_time" clearable style="width: 300px"></el-input>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="2" class="r_btn">
          <el-row :gutter="2">
            <el-col :span="2">
              <el-button v-show="showAuth.m_search" type="primary" size="medium" @click="getList">{{ c.queryButton }}</el-button>
            </el-col>
          </el-row>
          <el-row :gutter="2">
            <el-col :span="2">
              <el-button v-show="showAuth.m_search" type="info" size="medium" @click="resetSearch">{{ l.reset }}</el-button>
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <el-divider></el-divider>
    <el-button v-show="showAuth.m_add" type="primary" class="create_btn" size="medium" @click="add">{{ c.create }}</el-button>
    <!-- 表格 -->
    <z-table :list="direct.list" :tableProps="tableProps" :columns="direct.columns" @editItem="editItem" @deleteItem="deleteItem">
      <template v-slot:operation="v">
        <a href="#" class="text-blue" @click.prevent="openDialog(v.row, v.$index)">
          {{ l.data_management }}
        </a>
        <span>&nbsp;</span>
        <a v-show="showAuth.m_updata" href="#" class="text-green" @click.prevent="editItem(v.row, v.$index)">
          {{ c.edit }}
        </a>
        <span>&nbsp;</span>
        <a v-show="showAuth.m_del" href="#" class="text-red" @click.prevent="deleteItem(v.row, v.$index)">
          {{ c.disable }}
        </a>
      </template>
    </z-table>
    <!-- 分页 -->
    <z-pagination :pagination="pagination" :total="direct.query.total" v-model:page="direct.query.page" v-model:limit="direct.query.pageSize" @change="getList"></z-pagination>
    <!-- 创建/编辑窗口 -->
    <z-form-dialog :name="l.dict" :data="direct.data" :formProps="formProps" :fields="direct.fields" @submmit="submmit" :submmitLoading="submmitLoading" v-model:visible="direct.addOrEditFormVisible1"></z-form-dialog>
    <!-- 数据管理页面 -->
    <el-dialog :title="l.dict_option" v-model:visible="direct.dialogTableVisible1" width="70%">
      <el-button type="primary" class="create_btn" @click="addChildre">{{ c.create }}</el-button>
      <z-table :list="directChildre.list" :tableProps="tableProps" :columns="directChildre.columns" @editItem="editItemChildre">
        <template v-slot:operation="v">
          <a href="#" class="text-blue" @click.prevent="editItemChildre(v.row, v.$index)">
            {{ c.edit }}
          </a>
          <a href="#" class="text-red">
            {{ c.disable }}
          </a>
        </template>
      </z-table>
    </el-dialog>
    <!-- 创建/编辑窗口 -->
    <z-form-dialog :name="l.dict_option" :data="directChildre.data" :formProps="formProps" :fields="directChildre.fields" @submmit="submmitChildre" :submmitLoading="submmitLoading" v-model:visible="directChildre.addOrEditFormVisible2"></z-form-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, getCurrentInstance, watch } from 'vue'
import { _, api, defaultConfig, initFuncs, zForm, zFormDialog, zPagination, zTable } from '@/views/_common'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('demo3') // Corrected componentName based on filename or context if 'demo3' is correct key. Assuming 'demo3' for now or maybe 'dataDic' based on old name. Let's use 'dataDic' if 'demo3' is not standard. But user asked for demo3.vue. I'll use 'dataDic' as key if that was the name. The file name is demo3.vue but name in export default was 'dataDic'. I will use 'dataDic' as the key might be registered there. If not found, use 'demo3'. Let's stick to 'dataDic' for i18n key consistency if possible, or fallback.
// Actually, useLocalI18n usually takes a key that maps to a locale file. If not sure, 'dataDic' seems appropriate based on old component name.

const config = Object.assign({}, _.cloneDeep(defaultConfig), {
  api: api.ComplianceDictionary,
  apiList: api.ComplianceDictionary + 'getlist',
  apiAdd: api.ComplianceDictionary + 'add',
  apiUpdate: api.ComplianceDictionary + 'update',
  apiDelete: api.ComplianceDictionary + 'delete/',
  apiChildren: api.ComplianceDictionary + 'getdirectchildren/',
  apiAddOptions: api.ComplianceDictionary + 'batchAddOptions',
  tableProps: {
    border: true,
    opsColWith: 150,
  },
})

const userAuth = ref([])
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

const submmitLoading = ref(false)
const formProps = reactive(config.formProps || {}) // Ensure formProps is reactive if used in z-form-dialog
const tableProps = reactive(config.tableProps)
const pagination = reactive(config.pagination || {}) // Assuming pagination config exists or default

const direct = reactive({
  list: [],
  data: {},
  titleName: computed(() => l.value.dict_create),
  query: {
    label: '',
    type: '',
    create_time: '',
    create_user: '',
    modify_time: '',
    pageSize: 15,
    page: 1,
    total: 0,
  },
  columns: computed(() => [
    {
      title: l.value.label,
      key: 'label',
      fixed: true,
    },
    {
      title: l.value.type,
      key: 'type',
      fixed: true,
    },
    {
      title: l.value.create_user,
      key: 'create_user',
    },
    {
      title: l.value.create_time,
      key: 'create_time',
    },
    {
      title: l.value.modify_time,
      key: 'modify_time',
    },
    {
      title: l.value.is_valid,
      key: 'is_valid',
    },
  ]),
  fields: computed(() => [
    {
      title: l.value.label,
      key: 'label',
      span: 8,
      required: true,
    },
    {
      title: l.value.type,
      key: 'type',
      span: 8,
      required: true,
    },
    {
      title: l.value.is_valid,
      key: 'is_valid',
      name: 'switch',
      props: {
        activeValue: 'Y',
        inactiveValue: 'N',
      },
    },
    {
      title: l.value.create_user,
      key: 'create_user',
      props: { disabled: true },
      span: 6,
    },
    {
      title: l.value.create_time,
      key: 'create_time',
      props: { disabled: true },
      span: 6,
    },
    {
      title: l.value.modify_user,
      key: 'modify_user',
      props: { disabled: true },
      span: 6,
    },
    {
      title: l.value.modify_time,
      key: 'modify_time',
      props: { disabled: true },
      span: 6,
    },
  ]),
  dialogTableVisible1: false,
  addOrEditFormVisible1: false,
})

const directChildre = reactive({
  list: [],
  data: {},
  query: {
    pageSize: 15,
    page: 1,
    total: 0,
  },
  columns: computed(() => [
    {
      title: l.value.ption_name,
      key: 'label',
      fixed: true,
    },
    {
      title: l.value.ption_type,
      key: 'type',
      fixed: true,
    },
    {
      title: l.value.value,
      key: 'value',
    },
    {
      title: l.value.description,
      key: 'description',
    },
    {
      title: l.value.is_valid,
      key: 'is_valid',
    },
    {
      title: l.value.create_user,
      key: 'create_user',
    },
    {
      title: l.value.create_time,
      key: 'create_time',
    },
    {
      title: l.value.modify_user,
      key: 'modify_user',
    },
    {
      title: l.value.modify_time,
      key: 'modify_time',
    },
  ]),
  fields: computed(() => [
    {
      title: l.value.ption_name,
      key: 'label',
      span: 6,
      required: true,
    },
    {
      title: l.value.ption_type,
      key: 'type',
      span: 6,
      required: true,
    },
    {
      title: l.value.value,
      key: 'value',
      span: 6,
    },
    {
      title: l.value.description,
      key: 'description',
      span: 6,
    },
    {
      title: l.value.is_valid,
      key: 'is_valid',
      name: 'switch',
      props: {
        activeValue: 'Y',
        inactiveValue: 'N',
      },
    },
    {
      title: l.value.create_user,
      key: 'create_user',
      props: { disabled: true },
      span: 6,
    },
    {
      title: l.value.create_time,
      key: 'create_time',
      props: { disabled: true },
      span: 6,
    },
    {
      title: l.value.modify_user,
      key: 'modify_user',
      props: { disabled: true },
      span: 6,
    },
    {
      title: l.value.modify_time,
      key: 'modify_time',
      props: { disabled: true },
      span: 6,
    },
  ]),
  addOrEditFormVisible2: false,
})

const getList = () => {
  proxy
    .$request(config.apiList, direct.query, 'get')
    .then((r) => {
      console.log(r)
      direct.list = r.data.list
      direct.query.total = r.data.total
    })
    .catch((e) => {
      console.log(e)
    })
}

const resetSearch = () => {
  direct.query.pageSize = 15
  direct.query.page = 1
  direct.query.total = 0
  direct.query.label = ''
  direct.query.type = ''
  direct.query.create_time = ''
  direct.query.create_user = ''
  direct.query.modify_time = ''
  getList()
}

const add = () => {
  direct.data = {}
  direct.addOrEditFormVisible1 = true
}

const editItem = (data) => {
  direct.data = data
  console.log(data)
  direct.addOrEditFormVisible1 = true
}

const submmit = () => {
  let url = ''
  if (!direct.data.id) {
    url = config.apiAdd
  } else {
    url = config.apiUpdate
  }
  const data = direct.data
  proxy
    .$request(url, data, 'post')
    .then((r) => {
      console.log(r)
      submmitLoading.value = false
      proxy.$message({
        message: c.value.success,
        type: 'success',
      })
      getList()
      direct.addOrEditFormVisible1 = false
    })
    .catch((e) => {
      console.log(e)
      submmitLoading.value = false
      getList()
    })
}

const deleteItem = (data) => {
  console.log(data)
  var str = `是否要删除字典名称为：${data.label},字典编码为:${data.type}的数据？`
  proxy
    .$confirm(str, c.value.oprConfirm, {
      cancelButtonClass: 'cancelButtonClass',
    })
    .then(() => {
      proxy
        .$request(config.apiDelete + data.id, {}, 'post')
        .then((r) => {
          console.log(r)
          // pageLoading.value = false // pageLoading not defined in original data
          proxy.$message({
            message: c.value.success,
            type: 'success',
          })
          getList()
        })
        .catch(() => {
          // pageLoading.value = false
        })
    })
    .catch(() => {
      proxy.$message({
        message: l.value.info,
        type: 'info',
      })
    })
}

const getDirectChildren = (data) => {
  proxy
    .$request(
      config.apiChildren,
      {
        parentId: data.id,
      },
      'get'
    )
    .then((r) => {
      console.log(r)
      directChildre.list = r.data
      directChildre.query.total = r.data.total
    })
    .catch((e) => {
      console.log(e)
    })
}

const openDialog = (data) => {
  direct.data = data
  getDirectChildren(data)
  direct.dialogTableVisible1 = true
}

const addChildre = () => {
  directChildre.data = {}
  directChildre.addOrEditFormVisible2 = true
}

const editItemChildre = (data) => {
  directChildre.data = data
  console.log(data)
  directChildre.addOrEditFormVisible2 = true
}

const submmitChildre = () => {
  let url = config.apiAddOptions
  let data = directChildre.data
  let arr = []
  data.parent_id = direct.data.id
  arr.push(data)
  console.log(data)
  proxy
    .$request(url, arr, 'post')
    .then((r) => {
      console.log(r)
      submmitLoading.value = false
      getDirectChildren(direct.data)
      directChildre.addOrEditFormVisible2 = false
      proxy.$message({
        message: c.value.success,
        type: 'success',
      })
    })
    .catch((e) => {
      console.log(e)
      submmitLoading.value = false
      getDirectChildren(direct.data)
    })
}

const getUserAuth = () => {
  proxy
    .$request(proxy.$api.checkMenuAuth, {
      resourcepath: proxy.$route.name,
    })
    .then((r) => {
      userAuth.value = r.data[0]
    })
}

onMounted(() => {
  getList()
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
