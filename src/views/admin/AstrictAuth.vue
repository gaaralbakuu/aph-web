<template>
  <div class="app-container" v-loading="pageLoading">
    <el-button type="primary" class="fr" @click="createItem">{{ c.create}}</el-button>
    <div class="filter-container">
      <el-input style="width: 200px" :placeholder="l.org_id" clearable prefix-icon="el-icon-search" class="filter-item"
        @keyup.enter="research" @clear="research" v-model="query.orgid"></el-input>
      <el-input style="width: 200px" :placeholder="l.dept_codes" clearable prefix-icon="el-icon-search"
        class="filter-item" @keyup.enter="research" @clear="research" v-model="query.deptcodes">
      </el-input>
      <el-button class="filter-item" type="success" plain @click="research">{{ c.queryButton}}</el-button>
    </div>
    <z-table :list="list" :tableProps="tableProps" :columns="columns">
      <template v-slot:content="v">
        <template v-if="v.key === 'system'">
          <span></span>
        </template>
        <span v-else>{{ v.row[v.key] }}</span>
      </template>
      <template v-slot:operation="v">
        <a href="#" class="text-blue" @click.prevent="editItem(v.row, v.$index)">{{ c.edit}}</a>&nbsp;
        <a href="#" class="text-red" @click.prevent="deleteItem(v.row, v.$index)">{{ c.delete}}</a>
      </template>
    </z-table>
    <z-pagination :pagination="pagination" :total="total" v-model:page="query.page" v-model:limit="query.size"
      @change="getList"></z-pagination>
    <z-form-dialog :name="name" :data="data" :formProps="formProps" :fields="fields" @submmit="submmit"
      :submmitLoading="submmitLoading" v-model:visible="editFormVisible"></z-form-dialog>
  </div>
</template>
<script>
import { localGet } from '@/utils/auth'
import {
  _,
  api,
  defaultConfig,
  initFuncs,
  zFormDialog,
  zPagination,
  zTable,
} from '@/views/_common'
const config = Object.assign({}, _.cloneDeep(defaultConfig), {
  api: api.auth,
  apiSingle: api.auth + 'GetCAuthBlackById',
  apiCreate: api.auth + 'InsertOrUpdateCAuthBlack',
  apiEdit: api.auth + 'InsertOrUpdateCAuthBlack',
  apiDelete: api.auth + 'DeleteCAuthBlackById',
  apiList: api.auth + 'GetCAuthBlacklist',
  tableProps: {
    border: true,
    opsColWith: 140,
  },
  formProps: {
    dialogWidth: '50%',
    labelWidth: '140px',
  },
  initData: { dept_codes: [] },
})
export default {
  components: { zTable, zFormDialog, zPagination },
  name: 'adminAstrictAuth',
  data: function () {
    return {
      ...config,
      query: {
        size: 10,
        page: 1,
      },
      name: this.l.title,
      currentLang: localGet('lang') || 'zh-CN',
      data: {},
      columns: [
        { title: this.l.org_id, key: 'org_id', width: 120 },
        { title: this.l.dept_codes, key: 'dept_codes', width: 300 },
        { title: this.l.menu_name, key: 'menu_name', width: 200 },
        { title: this.c.remarks, key: 'remark' },
      ],
      fields: [
        { title: this.l.org_id, key: 'org_id', required: true, span: 24 },
        {
          title: this.l.dept_codes,
          name: 'dynamicTag',
          key: 'dept_codes',
          required: true,
          span: 24,
        },
        {
          title: this.l.menu_name,
          key: 'menu_id',
          name: 'select',
          options: [],
          props: {},
          required: true,
          span: 24,
        },
        { title: this.c.remarks, key: 'remark', span: 24 },
      ],
    }
  },
  methods: {
    ...initFuncs,
    init() {
      this.$request(this.$api.menu + 'getlist', {
        type: 'APP',
      })
        .then((r) => {
          this.setFieldOptions(this.fields,'menu_id', r.data, 'menu_id', 'menu_name_label')
        })
        .catch(() => {})
    },
    formatList(list) {
      // 依据实际需求处理
      const tmp = _.cloneDeep(list)
      return tmp.map((i) => {
        i.menu_name = JSON.parse(i.menu_name || '[]')
        i.menu_name = i.menu_name.find((i) => i.key == this.currentLang)?.label
        return i
      })
    },
    formatAfterGet(data) {
      // 依据实际需求处理
      data.dept_codes = (data.dept_codes || '').split(',')
      return data
    },
    formatBeforeSave(data) {
      // 依据实际需求处理
      const tmp = _.cloneDeep(data)
      tmp.dept_codes = (tmp.dept_codes || []).join(',')
      return tmp
    },
  },
  created: function () {
    this.getList()
    this.init()
  },
}
</script>
<style scoped>
</style>
