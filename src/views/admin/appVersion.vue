<template>
  <div class="app-container" v-loading="pageLoading">
    <el-button type="primary" class="fr" @click="createItem">{{$c.create}}</el-button>
    <div class="filter-container">
      <el-input style="width: 250px" :placeholder="$l.search" clearable prefix-icon="el-icon-search" class="filter-item"
        @keyup.enter.native="research" @clear="research" v-model="query.queryString.str"></el-input>
      <el-select v-model="query.queryString.system" class="filter-item" clearable :placeholder="$l.systemPd">
        <el-option label="ALL" value="all"></el-option>
        <el-option label="IOS" value="ios"></el-option>
        <el-option label="Android" value="android"></el-option>
      </el-select>
      <el-select v-model="query.queryString.install_type" class="filter-item" clearable
        :placeholder="$l.install_typePd">
        <el-option :label="$l.full" value="1"></el-option>
        <el-option :label="$l.incremental" value="2"></el-option>
      </el-select>
      <el-button class="filter-item" type="success" plain @click="research">{{$c.queryButton}}</el-button>
    </div>
    <z-table :list="list" :tableProps="tableProps" :columns="columns">
      <template v-slot:content="v">
        <template v-if="v.key === 'system'">
          <span>{{ systemMap[v.row[v.key]] }}</span>
        </template>
        <template v-else-if="v.key === 'install_type'">
          <span>{{ typeMap[v.row[v.key]] }}</span>
        </template>
        <span v-else>{{ v.row[v.key] }}</span>
      </template>
      <template v-slot:operation="v">
        <a href="#" class="text-blue" @click.prevent="editItem(v.row, v.$index)">{{$c.edit}}</a>&nbsp;
        <a href="#" class="text-green" @click.prevent="copyItem(v.row, v.$index)">{{$c.copy}}</a>&nbsp;
        <a href="#" class="text-red" @click.prevent="deleteItem(v.row, v.$index)">{{$c.delete}}</a>
      </template>
    </z-table>
    <z-pagination :pagination="pagination" :total="total" :page.sync="query.page" :limit.sync="query.size"
      @change="getList"></z-pagination>
    <z-form-dialog :name="name" :data="data" :formProps="formProps" :fields="fields" @submmit="submmit"
      :submmitLoading="submmitLoading" :visible.sync="editFormVisible"></z-form-dialog>
  </div>
</template>
<script>
import {
  _,
  api,
  zTable,
  zPagination,
  zFormDialog,
  initFuncs,
  defaultConfig,
} from '@/views/_common'
import { getToken } from '@/utils/auth'
const config = Object.assign({}, _.cloneDeep(defaultConfig), {
  api: api.appVersion,
  apiCreate: api.appVersion + 'addormodify',
  apiEdit: api.appVersion + 'addormodify',
  tableProps: {
    border: true,
    opsColWith: 140,
  },
  formProps: {
    dialogWidth: '50%',
    labelWidth: '140px',
  },
  initData: { pkg_url: '', install_type: '', file: '' },
})
export default {
  components: { zTable, zFormDialog, zPagination },
  name: 'adminAppVersion',
  data: function () {
    return {
      ...config,
      query: {
        queryString: { str: '', system: '', install_type: undefined },
        size: 10,
        page: 1,
      },
      name: this.$l.title,
      data: {},
      systemMap: { all: 'ALL', android: 'Android', ios: 'IOS' },
      typeMap: { 1: this.$l.full, 2: this.$l.incremental },
      columns: [
        { title: this.$l.app_id, key: 'app_id', width: 120 },
        { title: this.$l.app_name, key: 'app_name', width: 140 },
        { title: this.$l.system, key: 'system', width: 100 },
        { title: this.$l.is_test, key: 'is_test', width: 80 },
        { title: this.$l.install_type, key: 'install_type', width: 100 },
        { title: this.$l.version, key: 'version', width: 120 },
        { title: this.$l.pkg_url, key: 'pkg_url', width: 120 },
        { title: this.$l.wgt_url, key: 'wgt_url', width: 120 },
        { title: this.$l.version_notes, key: 'version_notes', width: 220 },
        { title: this.$l.remarks, key: 'remarks', width: 140 },
        { title: this.$c.modify_user, key: 'modify_user', width: 90 },
        { title: this.$c.modify_time, key: 'modify_time', width: 140 },
      ],
      fields: [
        { title: this.$l.app_id, key: 'app_id', required: true, span: 12 },
        { title: this.$l.app_name, key: 'app_name', required: true, span: 12 },
        {
          title: this.$l.system,
          key: 'system',
          name: 'select',
          events: {},
          options: [
            { value: 'all', label: 'ALL' },
            { value: 'android', label: 'Android' },
            { value: 'ios', label: 'IOS' },
          ],
          props: { placeholder: this.$l.systemPd },
          required: true,
          span: 12,
        },
       {
          title: this.$l.is_test,
          key: 'is_test',
          name: 'select',
          events: {},
          options: [
            { value: 'Y', label: 'Y' },
            { value: 'N', label: 'N' },
          ],
          props: { placeholder: this.$l.is_testPd },
          required: true,
          span: 12,
        },
        {
          title: this.$l.install_type,
          key: 'install_type',
          name: 'select',
          events: {},
          options: [
            { value: 1, label: this.$l.full },
            { value: 2, label: this.$l.incremental },
          ],
          props: { placeholder: this.$l.install_typePd },
          required: true,
          span: 12,
        },
        { title: this.$l.version, key: 'version', span: 12, required: true },
        {
          title: this.$l.url,
          key: 'file',
          required: true,
          span: 24,
        },
        {
          title: this.$l.version_notes,
          key: 'version_notes',
          name: 'textarea',
          required: true,
          span: 24,
        },

        { title: this.$l.remarks, key: 'remarks', name: 'textarea', span: 24 },
      ],
    }
  },
  methods: {
    ...initFuncs,
    editItem(v) {
      this.data = _.cloneDeep(this.initData)
      this.pageLoading = true
      let url = this.api + 'getbyid'
      if (this.apiSingle) {
        url = this.apiSingle
      }
      this.$request(url, { id: v.id })
        .then((r) => {
          this.pageLoading = false
          this.data = this.formatAfterGet(r.data || {})
          let file = this.data.pkg_url ? this.data.pkg_url : this.data.wgt_url
          this.$set(this.data, 'file', file)
          if (this.data.system == 'all') {
            this.getFieldConfig(this.fields,'install_type').props.disabled = true
          } else {
            this.getFieldConfig(this.fields,'install_type').props.disabled = false
          }
          this.editFormVisible = true
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    copyItem(v) {
      this.data = _.cloneDeep(v)
      delete this.data.id
      delete this.data.create_time
      delete this.data.create_user
      delete this.data.modify_time
      delete this.data.modify_user
      let file = this.data.pkg_url ? this.data.pkg_url : this.data.wgt_url
      this.$set(this.data, 'file', file)
      if (this.data.system == 'all') {
        this.getFieldConfig(this.fields,'install_type').props.disabled = true
      } else {
        this.getFieldConfig(this.fields,'install_type').props.disabled = false
      }
      this.editFormVisible = true
    },
    formatBeforeSave(data) {
      this.data.wgt_url = ''
      this.data.pkg_url = ''
      if (this.data.file) {
        if (this.data.install_type == 1) {
          this.data.pkg_url = this.data.file
        }
        if (this.data.install_type == 2 || this.data.system == 'all') {
          this.data.wgt_url = this.data.file
        }
      }
      if (this.data.install_type == 1 && this.data.system == 'ios') {
        if (this.data.pkg_url && this.data.pkg_url.indexOf('apps.apple') < 0) {
          this.$message({
            message: this.$l.iosUrlCheck,
            type: 'error',
          })
        }
      }

      return this.data
    },
    formatQuery(query) {
      let q = _.cloneDeep(query)
      q.queryString = JSON.stringify(q.queryString)

      return q
    },
    createItem() {
      this.data = _.cloneDeep(this.initData)
      this.getFieldConfig(this.fields,'install_type').props.disabled = false
      this.editFormVisible = true
    },
    appStoreChange() {
      if (this.data.system == 'all') {
        this.getFieldConfig(this.fields,'install_type').props.disabled = true
        this.data.install_type = 2
      } else {
        this.getFieldConfig(this.fields,'install_type').props.disabled = false
      }
      this.$forceUpdate()
    },
  },
  created: function () {
    this.getFieldConfig(this.fields,'install_type').events.change = this.appStoreChange
    this.getFieldConfig(this.fields,'system').events.change = this.appStoreChange
    this.getList()
  },
}
</script>
<style scoped>
</style>
