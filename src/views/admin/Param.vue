<template>
  <div class="app-container" v-loading="pageLoading">
    <el-button type="primary" class="fr" @click="createItem">{{ c.create}}</el-button>
    <div class="filter-container">
      <el-select class="filter-item" style="width: 240px;" v-model="query.paramType" @change="research" filterable
        clearable :placeholder="l.param_typePd">
        <el-option v-for="(d,i) in typeOptions" :value="d.param_type" :key="i"></el-option>
      </el-select>
      <el-input style="width: 300px;" :placeholder="c.queryPlaceholder" clearable prefix-icon="el-icon-search"
        class="filter-item" @keyup.enter="research" @clear="research" v-model="query.queryString"></el-input>
      <el-button class="filter-item" type="success" plain @click="research">{{ c.queryButton}}</el-button>
      <el-button class="filter-item" type="info" plain @click="exportData" :loading="exportLoading">{{ c.export}}
      </el-button>
    </div>
    <z-table :list="list" :tableProps="tableProps" :columns="columns" @editItem="editItem" @deleteItem="deleteItem">
      <template v-slot:operation="v">
        <a href="#" class="text-blue" @click.prevent="editItem(v.row,v.$index)">{{ c.edit}}</a>
        <span>&nbsp;</span>
        <a href="#" class="text-green" @click.prevent="copyItem(v.row,v.$index)">{{ c.copy}}</a>
        <span>&nbsp;</span>
        <a href="#" class="text-red" @click.prevent="deleteItem(v.row,v.$index)">{{ c.delete}}</a>
      </template>
    </z-table>
    <z-pagination :pagination="pagination" :total="total" v-model:page="query.page" v-model:limit="query.size"
      @change="getList"></z-pagination>
    <z-form-dialog :name="name" :data="data" :formProps="formProps" :fields="fields" @submmit="submmit"
      :submmitLoading="submmitLoading" v-model:visible="editFormVisible"></z-form-dialog>
  </div>
</template>

<script>
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
  api: api.param,
  apiCreate: api.param + 'update',
  tableProps: {
    border: true,
    opsColWith: 120,
  },
})
export default {
  components: { zTable, zFormDialog, zPagination },
  name: 'adminParam',
  data() {
    return {
      ...config,
      name: '',
      columns: [],
      fields: [],
      typeOptions: [],
    }
  },
  created() {
    this.name = this.l.title;
    this.columns = [
      { title: this.l.param_type, key: 'param_type', width: 160 },
      { title: this.l.param_name, key: 'param_name', width: 180 },
      { title: this.l.param_priority, key: 'param_priority', width: 100 },
      { title: this.l.param_value, key: 'param_value', width: 180 },
      { title: this.l.param_condition1, key: 'param_condition1', width: 100 },
      { title: this.l.param_condition2, key: 'param_condition2', width: 100 },
      { title: this.l.param_condition3, key: 'param_condition3', width: 100 },
      { title: this.l.remarks, key: 'remarks' },
      { title: this.c.modify_user, key: 'modify_user', width: 90 },
      { title: this.c.modify_time, key: 'modify_time', width: 140 },
    ];
    this.fields = [
      { title: this.l.param_type, key: 'param_type', required: true },
      { title: this.l.param_name, key: 'param_name', required: true },
      {
        title: this.l.param_priority,
        key: 'param_priority',
        required: true,
        name: 'number',
      },
      { title: this.l.param_value, key: 'param_value' },
      { title: this.l.param_condition1, key: 'param_condition1' },
      { title: this.l.param_condition2, key: 'param_condition2' },
      { title: this.l.param_condition3, key: 'param_condition3' },
      {
        title: this.l.remarks,
        key: 'remarks',
        name: 'textarea',
        required: true,
        tips: this.l.remarksTip,
      },
    ];
    this.getList();
    this.$request(this.api + 'gettypelist').then((r) => {
      this.typeOptions = r.data;
    });
  },
  methods: {
    ...initFuncs,
    copyItem(v) {
      this.data = _.cloneDeep(this.initData)
      this.pageLoading = true
      this.$request(this.api + 'getbyid', {
        id: v.id,
      })
        .then((r) => {
          this.pageLoading = false
          this.data = this.formatAfterGet(r.data)
          this.data.id = null
          this.editFormVisible = true
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
  },
}
</script>
<style scoped>
</style>
