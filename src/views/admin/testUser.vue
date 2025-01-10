<template>
  <div class="app-container" v-loading="pageLoading">
    <el-button type="primary" class="fr" @click="createItem">{{$c.create}}</el-button>
    <div class="filter-container">

      <el-input style="width: 300px;" :placeholder="$c.queryPlaceholder" clearable prefix-icon="el-icon-search"
        class="filter-item" @keyup.enter.native="research" @clear="research" v-model="query.queryString"></el-input>
      <el-button class="filter-item" type="success" plain @click="research">{{$c.queryButton}}</el-button>
      <el-button class="filter-item" type="info" plain @click="exportData" :loading="exportLoading">{{$c.export}}
      </el-button>
    </div>
    <z-table :list="list" :tableProps="tableProps" :columns="columns" @editItem="editItem" @deleteItem="deleteItem">
      <template v-slot:operation="v">
        <a href="#" class="text-blue" @click.prevent="editItem(v.row,v.$index)">{{$c.edit}}</a>
        <span>&nbsp;</span>
        <a href="#" class="text-green" @click.prevent="copyItem(v.row,v.$index)">{{$c.copy}}</a>
        <span>&nbsp;</span>
        <a href="#" class="text-red" @click.prevent="deleteItem(v.row,v.$index)">{{$c.delete}}</a>
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
const config = Object.assign({}, _.cloneDeep(defaultConfig), {
  api: api.rtestuser,
  apiCreate: api.rtestuser+ 'update',
  tableProps: {
    border: true,
    opsColWith: 120,
  },
})
export default {
  components: { zTable, zFormDialog, zPagination },
  name: 'adminTestUser',
  data: function () {
    return {
      ...config,
      name: this.$l.title,
      columns: [
    { title: this.$l.userid, key: 'userid' , width: 160 },
    { title: this.$l.username, key: 'username' , width: 200 },
    { title: this.$l.department, key: 'department_t' , width: 200 },
    { title: this.$l.in_date, key: 'in_date' , width: 200 },
    { title: this.$l.out_date, key: 'out_date' , width: 200 },
    { title: this.$c.modify_user, key: 'modify_user' , width: 160 },
    { title: this.$c.modify_time, key: 'modify_time' }
  ],
  fields: [
    { title: this.$l.userid, key: 'userid', required: true },

  ],
      typeOptions: [],
    }
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
  created: function () {
    this.getList()
   // this.$request(this.api + 'getlist').then((r) => {
   //   this.typeOptions = r.data
   // })
  },
}
</script>
<style scoped>
</style>
