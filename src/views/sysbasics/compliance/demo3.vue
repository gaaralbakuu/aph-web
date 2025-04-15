<template>
  <div class="app-container">
    <!-- 查询区域 -->
    <div>
      <el-row :gutter="24">
        <el-col :span="22">
          <el-row :gutter="22" class="r_input">
            <el-col :span="7">
              <span class="search_tips">{{ $l.label }}</span>
              <el-input
                :placeholder="$l.input"
                clearable
                v-model="direct.query.label"
                style="width: 300px"
              ></el-input>
            </el-col>
            <el-col :span="7">
              <span class="search_tips">{{ $l.type }}</span>
              <el-input
                :placeholder="$l.input"
                clearable
                v-model="direct.query.type"
                style="width: 300px"
              ></el-input>
            </el-col>
            <el-col :span="7">
              <span class="search_tips">{{ $l.create_time }}</span>
              <el-date-picker
                type="date"
                :placeholder="$l.input"
                v-model="direct.query.create_time"
                style="width: 300px"
              ></el-date-picker>
            </el-col>
          </el-row>
          <el-row :gutter="22" class="r_input">
            <el-col :span="7">
              <span class="search_tips">{{ $l.create_user }}</span>
              <el-input
                :placeholder="$l.input"
                v-model="direct.query.create_user"
                clearable
                style="width: 300px"
              >
              </el-input>
            </el-col>
            <el-col :span="7">
              <span class="search_tips">{{ $l.modify_time }}</span>
              <el-input
                :placeholder="$l.input"
                v-model="direct.query.modify_time"
                clearable
                style="width: 300px"
              ></el-input>
            </el-col>
          </el-row>
        </el-col>
        <el-col :span="2" class="r_btn">
          <el-row :gutter="2">
            <el-col :span="2">
              <el-button
                v-show="showAuth.m_search"
                type="primary"
                size="medium"
                @click="getList"
                >{{ $c.queryButton }}</el-button
              >
            </el-col>
          </el-row>
          <el-row :gutter="2">
            <el-col :span="2">
              <el-button
                v-show="showAuth.m_search"
                type="info"
                size="medium"
                @click="resetSearch"
                >{{ $l.reset }}</el-button
              >
            </el-col>
          </el-row>
        </el-col>
      </el-row>
    </div>
    <el-divider></el-divider>
    <el-button
      v-show="showAuth.m_add"
      type="primary"
      class="create_btn"
      size="medium"
      @click="add"
      >{{ $c.create }}</el-button
    >
    <!-- 表格 -->
    <z-table
      :list="direct.list"
      :tableProps="tableProps"
      :columns="direct.columns"
      @editItem="editItem"
      @deleteItem="deleteItem"
    >
      <template v-slot:operation="v">
        <a
          href="#"
          class="text-blue"
          @click.prevent="openDialog(v.row, v.$index)"
        >
          {{ $l.data_management }}
        </a>
        <span>&nbsp;</span>
        <a
          v-show="showAuth.m_updata"
          href="#"
          class="text-green"
          @click.prevent="editItem(v.row, v.$index)"
        >
          {{ $c.edit }}
        </a>
        <span>&nbsp;</span>
        <a
          v-show="showAuth.m_del"
          href="#"
          class="text-red"
          @click.prevent="deleteItem(v.row, v.$index)"
        >
          {{ $c.disable }}
        </a>
      </template>
    </z-table>
    <!-- 分页 -->
    <z-pagination
      :pagination="pagination"
      :total="direct.query.total"
      :page.sync="direct.query.page"
      :limit.sync="direct.query.pageSize"
      @change="getList"
    >
    </z-pagination>
    <!-- 创建/编辑窗口 -->
    <z-form-dialog
      :name="$l.dict"
      :data="direct.data"
      :formProps="formProps"
      :fields="direct.fields"
      @submmit="submmit"
      :submmitLoading="submmitLoading"
      :visible.sync="direct.addOrEditFormVisible1"
    >
    </z-form-dialog>
    <!-- 数据管理页面 -->
    <el-dialog
      :title="$l.dict_option"
      :visible.sync="direct.dialogTableVisible1"
      width="70%"
    >
      <el-button type="primary" class="create_btn" @click="addChildre">{{
        $c.create
      }}</el-button>
      <z-table
        :list="directChildre.list"
        :tableProps="tableProps"
        :columns="directChildre.columns"
        @editItem="editItemChildre"
      >
        <template v-slot:operation="v">
          <a
            href="#"
            class="text-blue"
            @click.prevent="editItemChildre(v.row, v.$index)"
          >
            {{ $c.edit }}
          </a>
          <a href="#" class="text-red">
            {{ $c.disable }}
          </a>
        </template>
      </z-table>
    </el-dialog>
    <!-- 创建/编辑窗口 -->
    <z-form-dialog
      :name="$l.dict_option"
      :data="directChildre.data"
      :formProps="formProps"
      :fields="directChildre.fields"
      @submmit="submmitChildre"
      :submmitLoading="submmitLoading"
      :visible.sync="directChildre.addOrEditFormVisible2"
    >
    </z-form-dialog>
  </div>
</template>
  
  <script>
import {
  _,
  api,
  zTable,
  zForm,
  zPagination,
  zFormDialog,
  initFuncs,
  eTable,
  defaultConfig,
} from '@/views/_common'
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
export default {
  name: 'dataDic',
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
      direct: {
        list: [],
        data: {},
        titleName: this.$l.dict_create,
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
        columns: [
          {
            title: this.$l.label,
            key: 'label',
            fixed: true,
          },
          {
            title: this.$l.type,
            key: 'type',
            fixed: true,
          },
          {
            title: this.$l.create_user,
            key: 'create_user',
          },
          {
            title: this.$l.create_time,
            key: 'create_time',
          },
          {
            title: this.$l.modify_time,
            key: 'modify_time',
          },
          {
            title: this.$l.is_valid,
            key: 'is_valid',
          },
        ],
        fields: [
          {
            // 编辑表单数据
            title: this.$l.label,
            key: 'label',
            span: 8,
            required: true,
          },
          {
            title: this.$l.type,
            key: 'type',
            span: 8,
            required: true,
          },
          {
            title: this.$l.is_valid,
            key: 'is_valid',
            name: 'switch',
            props: {
              activeValue: 'Y',
              inactiveValue: 'N',
            },
          },
          {
            title: this.$l.create_user,
            key: 'create_user',
            props: { disabled: true },
            span: 6,
          },
          {
            title: this.$l.create_time,
            key: 'create_time',
            props: { disabled: true },
            span: 6,
          },
          {
            title: this.$l.modify_user,
            key: 'modify_user',
            props: { disabled: true },
            span: 6,
          },
          {
            title: this.$l.modify_time,
            key: 'modify_time',
            props: { disabled: true },
            span: 6,
          },
        ],
        dialogTableVisible1: false,
        addOrEditFormVisible1: false, // 创建窗口
      },
      directChildre: {
        list: [],
        data: {},
        query: {
          pageSize: 15,
          page: 1,
          total: 0,
        },
        columns: [
          {
            title: this.$l.ption_name,
            key: 'label',
            fixed: true,
          },
          {
            title: this.$l.ption_type,
            key: 'type',
            fixed: true,
          },
          {
            title: this.$l.value,
            key: 'value',
          },
          {
            title: this.$l.description,
            key: 'description',
          },
          {
            title: this.$l.is_valid,
            key: 'is_valid',
          },
          {
            title: this.$l.create_user,
            key: 'create_user',
          },
          {
            title: this.$l.create_time,
            key: 'create_time',
          },
          {
            title: this.$l.modify_user,
            key: 'modify_user',
          },
          {
            title: this.$l.modify_time,
            key: 'modify_time',
          },
        ],
        fields: [
          {
            // 编辑表单数据
            title: this.$l.ption_name,
            key: 'label',
            span: 6,
            required: true,
          },
          {
            title: this.$l.ption_type,
            key: 'type',
            span: 6,
            required: true,
          },
          {
            title: this.$l.value,
            key: 'value',
            span: 6,
          },
          {
            title: this.$l.description,
            key: 'description',
            span: 6,
          },
          {
            title: this.$l.is_valid,
            key: 'is_valid',
            name: 'switch',
            props: {
              activeValue: 'Y',
              inactiveValue: 'N',
            },
          },
          {
            title: this.$l.create_user,
            key: 'create_user',
            props: { disabled: true },
            span: 6,
          },
          {
            title: this.$l.create_time,
            key: 'create_time',
            props: { disabled: true },
            span: 6,
          },
          {
            title: this.$l.modify_user,
            key: 'modify_user',
            props: { disabled: true },
            span: 6,
          },
          {
            title: this.$l.modify_time,
            key: 'modify_time',
            props: { disabled: true },
            span: 6,
          },
        ],
        addOrEditFormVisible2: false, // 创建窗口
      },
    }
  },
  methods: {
    getList() {
      this.$request(this.apiList, this.direct.query, 'get')
        .then((r) => {
          console.log(r)
          this.direct.list = r.data.list
          this.direct.query.total = r.data.total
        })
        .catch((e) => {
          console.log(e)
        })
    },
    resetSearch() {
      this.direct.query = {
        pageSize: 15,
        page: 1,
        total: 0,
      }
      this.getList()
    },
    add() {
      this.direct.data = {}
      this.direct.addOrEditFormVisible1 = true
    },
    editItem(data) {
      this.direct.data = data
      console.log(data)
      this.direct.addOrEditFormVisible1 = true
    },
    submmit() {
      let url = ''
      if (!this.direct.data.id) {
        url = this.apiAdd
      } else {
        url = this.apiUpdate
      }
      const data = this.direct.data
      // console.log(url);
      // console.log(data);
      this.$request(url, data, 'post')
        .then((r) => {
          console.log(r)
          this.submmitLoading = false
          this.$message({
            message: this.$c.success,
            type: 'success',
          })
          this.getList()
          this.direct.addOrEditFormVisible1 = false
        })
        .catch((e) => {
          console.log(e)
          this.submmitLoading = false
          this.getList()
        })
    },
    deleteItem(data) {
      console.log(data)
      var str = `是否要删除字典名称为：${data.label},字典编码为:${data.type}的数据？`
      this.$confirm(str, this.$c.oprConfirm, {
        cancelButtonClass: 'cancelButtonClass',
      })
        .then(() => {
          this.$request(this.apiDelete + data.id, {}, 'post')
            .then((r) => {
              console.log(r)
              this.pageLoading = false
              this.$message({
                message: this.$c.success,
                type: 'success',
              })
              this.getList()
            })
            .catch(() => {
              this.pageLoading = false
            })
        })
        .catch(() => {
          this.$message({
            message: this.$l.info,
            type: 'info',
          })
        })
    },
    // 字典选项
    getDirectChildren(data) {
      this.$request(
        this.apiChildren,
        {
          parentId: data.id,
        },
        'get'
      )
        .then((r) => {
          console.log(r)
          this.directChildre.list = r.data
          this.directChildre.query.total = r.data.total
        })
        .catch((e) => {
          console.log(e)
        })
    },
    openDialog(data) {
      this.direct.data = data
      this.getDirectChildren(data)
      this.direct.dialogTableVisible1 = true
    },
    addChildre() {
      this.directChildre.data = {}
      this.directChildre.addOrEditFormVisible2 = true
    },
    editItemChildre(data) {
      this.directChildre.data = data
      console.log(data)
      this.directChildre.addOrEditFormVisible2 = true
    },
    submmitChildre() {
      let url = this.apiAddOptions
      let data = this.directChildre.data
      let arr = []
      // console.log(url);
      data.parent_id = this.direct.data.id
      arr.push(data)
      console.log(data)
      this.$request(url, arr, 'post')
        .then((r) => {
          console.log(r)
          this.submmitLoading = false
          this.getDirectChildren(this.direct.data)
          this.directChildre.addOrEditFormVisible2 = false
          this.$message({
            message: this.$c.success,
            type: 'success',
          })
        })
        .catch((e) => {
          console.log(e)
          this.submmitLoading = false
          this.getDirectChildren(this.direct.data)
        })
    },
    // 获取当前页面用户拥有的操作权限的函数
    getUserAuth() {
      //获取当前页面用户拥有的操作权限的函数
      // this.userAuth = null
      this.$request(this.$api.checkMenuAuth, {
        resourcepath: this.$route.name,
      }).then((r) => {
        this.userAuth = r.data[0]
      })
    },
  },
  created() {
    this.getList()
    his.getUserAuth()
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