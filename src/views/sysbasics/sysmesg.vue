<template>
  <div class="app-container" v-loading="pageLoading">
    <el-button type="primary" class="fr" @click="createItem">{{$c.create}}</el-button>
    <div class="filter-container">

      <el-input style="width: 300px;" :placeholder="$c.queryPlaceholder" clearable prefix-icon="el-icon-search"
        class="filter-item" @keyup.enter.native="research" @clear="research" v-model="query.queryString"></el-input>
           <el-input-number style="width: 300px;" :placeholder="$c.queryPlaceholder" clearable prefix-icon="el-icon-search"
        class="filter-item" @keyup.enter.native="research" @clear="research" v-model="query.mesgid"></el-input-number>

      <el-button class="filter-item" type="success" plain @click="research">{{$c.queryButton}}</el-button>
      <el-button class="filter-item" type="info" plain @click="exportData" :loading="exportLoading">{{$c.export}}
      </el-button>
    </div>
    <z-table :list="list" :tableProps="tableProps" :columns="columns" @editItem="editItem" @deleteItem="deleteItem">
      <template v-slot:operation="v">
        <a href="#" class="text-blue" @click.prevent="editItem(v.row,v.$index)">{{$c.edit}}</a>
        <span>&nbsp;</span>
        <a href="#" class="text-green" @click.prevent="copyItem(v.row,v.$index)">{{$c.copy}}</a>
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
  api: api.symesg,
  apiCreate: api.symesg+ 'update',
  tableProps: {
    border: true,
    opsColWith: 120,
  },
})
export default {
  components: { zTable, zFormDialog, zPagination },
  name: 'sysbasicsSymesg',
  data: function () {
    return {
      ...config,
      name: this.$l.title,
      columns: [
    { title: this.$l.msg_id, key: 'msg_id' , width: 160 },
    { title: this.$l.msg_name_zh, key: 'msg_name_zh' , width: 200 },
    { title: this.$l.msg_name_en, key: 'msg_name_en' , width: 200 },
    { title: this.$l.msg_name_tw, key: 'msg_name_tw'  },
    { title: this.$l.msg_type, key: 'msg_type' , width: 100 },
    { title: this.$l.msg_id_pz, key: 'msg_id_pz' , width: 100 },
    { title: this.$c.modify_user, key: 'modify_user'  },
    { title: this.$c.modify_time, key: 'modify_time' }
  ],
  fields: [
    { title: this.$l.msg_id, key: 'msg_id',  required: true },  // 在编辑状态时只读 props: { disabled: true }
    { title: this.$l.msg_name_zh, key: 'msg_name_zh' , required: true },
    { title: this.$l.msg_name_en, key: 'msg_name_en' , required: true },
    { title: this.$l.msg_name_tw, key: 'msg_name_tw' , required: true },
    {
          title: this.$l.msg_type,
          key: 'msg_type',
          name: 'select',
          events: {},
          options: [
            { value: 'M', label: '提示' },
            { value: 'E', label: '错误' },
            { value: 'A', label: '警示' },
          ],
          props: { placeholder: this.$l.systemPd },
          required: true,
          span: 12,
        },
     {
          title: this.$l.msg_id_pz,
          key: 'msg_id_pz',
          name: 'select',
          events: {},
          options: [
            { value: 'Y', label: 'Y' },
            { value: 'N', label: 'N' },
          ],
          props: { placeholder: this.$l.systemPd },
          required: true,
          span: 12,
        },
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
