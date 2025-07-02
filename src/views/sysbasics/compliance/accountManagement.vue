<template>
  <div class="app-container">
    <!-- 查询区域 -->
    <div>
      <div style="display: flex; gap: 16px; margin-bottom: 10px">
        <!-- Left: 6 search fields in one column -->
        <div style="flex: 1; display: flex; flex-direction: column; gap: 12px">
          <div style="display: flex; gap: 12px">
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
              <label>{{ $l.account }}</label>
              <el-input :placeholder="$l.input_accou" v-model="account.query.account" clearable style="width: 100%" />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
              <label>{{ $l.manufacture_name }}</label>
              <el-input :placeholder="$l.input_manufacture_name" v-model="account.query.manufacture_name" clearable style="width: 100%" />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
              <label>{{ $l.account_type }}</label>
              <el-input :placeholder="$l.input_account_type" v-model="account.query.account_type" clearable style="width: 100%" />
            </div>
          </div>
          <div style="display: flex; gap: 12px">
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
              <label>{{ $l.email }}</label>
              <el-input :placeholder="$l.input_email" v-model="account.query.email" clearable style="width: 100%" />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
              <label>{{ $l.create_time }}</label>
              <el-input :placeholder="$l.input_create_time" v-model="account.query.create_time" clearable style="width: 100%" />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
              <label>{{ $l.status }}</label>
              <el-select v-model="account.query.is_valid" :placeholder="$l.choose" clearable style="width: 100%">
                <el-option v-for="item in account.options" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </div>
          </div>
        </div>
        <!-- Right: 2 buttons aligned at the bottom -->
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-end; min-width: 160px; gap: 12px;">
          <el-button v-show="showAuth.m_search" type="primary" size="medium" @click="getUser" style="margin-right: 8px">{{ $c.queryButton }}</el-button>
          <el-button v-show="showAuth.m_search" type="info" size="medium" @click="reset">{{ $l.reset }}</el-button>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <el-button v-show="showAuth.m_add" type="primary" class="create_btn" size="medium" @click="add">{{ $c.create }}</el-button>
    <!-- 表格 -->
    <z-table :list="account.list" :tableProps="tableProps" :columns="account.columns" @editItem="editItem" @deleteItem="deleteItem">
      <template v-slot:operation="v">
        <a v-if="v.row.is_valid == 'N'" href="#" class="text-blue">
          {{ $c.enable }}
        </a>
        <a v-else href="#" class="text-blue">
          {{ $c.disable }}
        </a>
        <span>&nbsp;</span>
        <a v-show="showAuth.m_updata" href="#" class="text-green" @click.prevent="editItem(v.row, v.$index)">
          {{ $c.edit }}
        </a>
        <span>&nbsp;</span>
        <a v-show="showAuth.m_del" href="#" class="text-red" @click.prevent="deleteItem(v.row, v.$index)">
          {{ $c.delete }}
        </a>
      </template>
    </z-table>
    <!-- 分页 -->
    <z-pagination :pagination="pagination" :total="account.total" :page.sync="account.query.page" :limit.sync="account.query.pageSize" @change="getUser"></z-pagination>
    <!-- 创建、编辑表单 -->
    <z-form-dialog :name="$l.account" :data="account.data" :formProps="account.formProps" :fields="account.fields" @submmit="submmit" :submmitLoading="submmitLoading" :visible.sync="account.editFormVisible"></z-form-dialog>
    <!-- 选择分类对话框 -->
    <el-dialog :title="$l.baseFile_select" :visible.sync="manufacturer.dialogVisible" width="35%">
      <el-input style="width: 200px; margin-bottom: 10px" prefix-icon="el-icon-search" :placeholder="$l.manufacture_name" clearable class="filter-item" @keyup.enter.native="getManufacturer" @clear="getManufacturer" @blur="getManufacturer" v-model="manufacturer.manufacture_name"></el-input>
      <z-table :list="manufacturer.list" :tableProps="tableProps" :columns="manufacturer.columns" @row-dblclick="sendManufacturerItem">
        <template v-slot:operation="v">
          <a href="#" class="text-blue" @click.prevent="sendManufacturerItem(v.row, v.$index)">
            {{ $l.select }}
          </a>
          &nbsp;
        </template>
      </z-table>
      <z-pagination :pagination="pagination" :total="manufacturer.query.total" :page.sync="manufacturer.query.curPage" :limit.sync="manufacturer.query.pageSize" @change="getManufacturer"></z-pagination>
    </el-dialog>
  </div>
</template>

<script>
import { _, api, zTable, zForm, zPagination, zFormDialog, initFuncs, eTable, defaultConfig } from '@/views/_common'
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
export default {
  name: 'accountManagement',
  components: {
    zTable,
    zFormDialog,
    zPagination,
  },
  data() {
    return {
      ...config,
      userAuth: [], //保存用户权限
      showAuth: {
        //用于权限控制，搭配v-show控制界面上的操作按钮是否展示
        m_search: false,
        m_add: false,
        m_del: false,
        m_updata: false,
        m_import: false,
        m_export: false,
        m_upload: false,
        m_audit: false,
        m_print: false,
      },
      formProps: {
        dialogWidth: '80%',
        labelWidth: '160px',
      },
      account: {
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
          pageSize: 15,
          page: 1,
        },
        options: [
          {
            value: 'Y',
            label: this.$c.enable,
          },
          {
            value: 'N',
            label: this.$c.disable,
          },
        ],
        total: 0,
        columns: [
          {
            title: this.$l.account,
            key: 'account',
            fixed: true,
            width: 110,
          },
          {
            title: this.$l.account_name,
            key: 'account_name',
            fixed: true,
            width: 110,
          },
          {
            title: this.$l.manufacture_name,
            key: 'company_name',
          },
          {
            title: this.$l.email,
            key: 'email',
          },
          {
            title: this.$l.phone,
            key: 'phone',
          },
          // {
          //   title: this.$l.account_type,
          //   key: 'role_type_name',
          // },
          {
            title: this.$l.create_time,
            key: 'create_time',
          },
          {
            title: this.$l.status,
            key: 'is_valid',
          },
        ],
        fields: [
          {
            title: this.$l.account,
            key: 'account',
            span: 24,
            required: true,
            props: {
              disabled: false,
            },
          },
          {
            title: this.$l.password,
            key: 'password',
            span: 24,
            required: true,
          },
          {
            title: this.$l.email,
            key: 'email',
            span: 24,
          },
          {
            title: this.$l.phone,
            key: 'phone',
            span: 24,
            required: true,
            props: {
              disabled: false,
            },
          },
          {
            title: this.$l.account_name,
            key: 'account_name',
            span: 24,
            required: true,
          },
          {
            title: this.$l.manufacture_name,
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
            value: this.$l.baseFile_select,
            props: {
              type: 'primary',
              disabled: false,
            },
            events: {
              click: this.openDept,
            },
            // pull: 3,
          },
          {
            title: '',
            key: 'manufacturer_id',
            span: 24,
            props: {
              disabled: true,
              style: 'visibility:hidden', //visible
            },
          },
        ],
        editFormVisible: false,
      },
      manufacturer: {
        list: [],
        data: {},
        query: {
          manufacture_name: '',
          pageSize: 15,
          curPage: 1,
          total: 0,
        },
        columns: [
          {
            title: this.$l.manufacture_name,
            key: 'name_zh',
            fixed: true,
            width: 110,
          },
          {
            title: this.$l.legal_person,
            key: 'legal_person',
            fixed: true,
            width: 110,
          },
          {
            title: this.$l.requestor_facility_name,
            key: 'requestor_facility_name',
          },
        ],
        dialogVisible: false,
      },
    }
  },
  methods: {
    getUser() {
      this.$request(this.apiList, this.account.query, 'post')
        .then((r) => {
          this.account.list = r.data.list
          this.account.total = r.data.total
        })
        .catch((e) => {})
    },
    reset() {
      this.account.query.account = ''
      this.account.query.manufacture_name = ''
      this.account.query.account_type = ''
      this.account.query.email = ''
      this.account.query.create_time = ''
      this.account.query.status = ''
    },
    getManufacturer() {
      this.$request(this.apiManufacturer, this.manufacturer.query, 'get')
        .then((r) => {
          this.manufacturer.list = r.data.list
          this.manufacturer.query.total = r.data.total
        })
        .catch((e) => {})
    },
    add() {
      this.account.data = {}
      this.account.fields[0].props.disabled = false
      this.account.fields[3].props.disabled = false
      this.account.fields[5].props.disabled = true
      this.account.editFormVisible = true
    },
    editItem(data) {
      this.account.data = _.cloneDeep(data)
      this.account.data.password = ''
      this.account.fields[0].props.disabled = true
      this.account.fields[3].props.disabled = true
      this.account.fields[5].props.disabled = true
      this.account.editFormVisible = true
    },
    submmit() {
      let url = ''
      if (this.account.data.id) {
        url = this.apiUpdate
      } else {
        url = this.apiAdd
      }
      this.$request(url, this.account.data, 'post')
        .then((r) => {
          this.$message({
            message: this.$c.success,
            type: 'success',
          })
          this.getUser()
          this.account.editFormVisible = false
        })
        .catch((e) => {})
    },
    deleteItem(data) {
      // let url = this.apiDelete + { id: data.id }
      // console.log(url)
      this.$prompt(this.$l.prompt, this.$c.oprConfirm, {
        type: 'warning',
        inputPattern: /^[Y]{1}$/i,
        inputErrorMessage: this.$l.inputErrorMessage,
        confirmButtonText: this.$c.confirm,
        cancelButtonText: this.$c.cancel,
      })
        .then(() => {
          this.$request(this.apiDelete, { id: data.id }, 'post')
            .then((r) => {
              this.$message({
                type: 'success',
                message: this.$c.success,
              })
              this.getUser()
            })
            .catch((e) => {
              this.$message.error(this.$l.delete_error)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$l.info,
          })
        })
    },
    openDept() {
      //打开选择基础档案弹窗
      this.manufacturer.dialogVisible = true
    },
    sendManufacturerItem(data) {
      this.$set(this.account.data, 'manufacturer_id', data.manufacture_id)
      this.$set(this.account.data, 'account_name', data.name_zh)
      this.$set(this.account.data, 'company_name', data.name_zh)
      this.manufacturer.dialogVisible = false
    },
    // 获取当前页面用户拥有的操作权限的函数
    getUserAuth() {
      console.log(this.$api.checkMenuAuth)

      this.$request(this.$api.checkMenuAuth, {
        resourcepath: this.$route.name,
      }).then((r) => {
        this.userAuth = r.data[0]
      })
    },
  },
  created() {
    this.getUser()
    this.getManufacturer()
    this.getUserAuth()
  },
  watch: {
    userAuth: {
      deep: true,
      handler(newV) {
        this.showAuth.m_add = newV.m_add == 'Y' ? true : false
        this.showAuth.m_search = newV.m_search == 'Y' ? true : false
        this.showAuth.m_del = newV.m_del == 'Y' ? true : false
        this.showAuth.m_updata = newV.m_updata == 'Y' ? true : false
        this.showAuth.m_import = newV.m_import == 'Y' ? true : false
        this.showAuth.m_export = newV.m_export == 'Y' ? true : false
        this.showAuth.m_upload = newV.m_upload == 'Y' ? true : false
        this.showAuth.m_audit = newV.m_audit == 'Y' ? true : false
        this.showAuth.m_print = newV.m_print == 'Y' ? true : false
      },
    },
  },
}
</script>
<style>
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
