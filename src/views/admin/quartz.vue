<template>
  <div class="app-container" v-loading="pageLoading">
    <el-button type="primary" class="fr" @click="createItem">{{
      $c.create
    }}</el-button>
    <div class="filter-container">
      <el-input
        style="width: 300px"
        :placeholder="$c.queryPlaceholder"
        clearable
        prefix-icon="el-icon-search"
        class="filter-item"
        @keyup.enter.native="research"
        @clear="research"
        v-model="query.queryString"
      ></el-input>
      <el-button class="filter-item" type="success" plain @click="research">{{
        $c.queryButton
      }}</el-button>
      <el-button
        class="filter-item"
        type="info"
        plain
        @click="exportData"
        :loading="exportLoading"
        >{{ $c.export }}
      </el-button>
    </div>
    <z-table
      :list="list"
      :tableProps="tableProps"
      :columns="columns"
      @editItem="editItem"
      @deleteItem="deleteItem"
    >
      <template v-slot:content="v">
        <template v-if="v.key === 'enabled'">
          <span v-if="!v.row[v.key]" class="label bg-gray">{{
            $l.stopped
          }}</span>
          <span v-else class="label bg-blue">{{ $c.enabled }}</span>
        </template>
        <template v-else-if="v.key === 'running'">
          <span v-if="!v.row[v.key]" class="label bg-gray">{{ $l.free }}</span>
          <span v-else class="label bg-green">{{ $l.operating }}</span>
        </template>
        <span v-else>{{ v.row[v.key] }}</span>
      </template>
      <template v-slot:operation="v">
        <el-link
          type="primary"
          :disabled="!!v.row.enabled"
          @click.prevent="editItem(v.row, v.$index)"
          :underline="false"
        >
          <i class="fa fa-pencil" :title="$c.edit"></i>
        </el-link>
        <el-link
          class="ml-5"
          v-if="!v.row.enabled"
          type="success"
          @click.prevent="startOrPauseJob(v.row, 1)"
          :underline="false"
        >
          <i class="fa fa-play" :title="$c.enable"></i>
        </el-link>
        <el-link
          class="ml-5"
          v-else
          type="warning"
          @click.prevent="startOrPauseJob(v.row, 0)"
          :underline="false"
        >
          <i class="fa fa-stop" :title="$l.stop"></i>
        </el-link>
        <el-link
          class="ml-5"
          :disabled="!!v.row.enabled"
          type="primary"
          @click.prevent="doOnceJob(v.row)"
          :underline="false"
        >
          <i class="fa fa-repeat" :title="$l.runOne"></i>
        </el-link>
        <el-link
          class="ml-5"
          :disabled="!!v.row.enabled"
          type="danger"
          @click.prevent="deleteItem(v.row, v.$index)"
          :underline="false"
        >
          <i class="fa fa-trash" :title="$c.delete"></i>
        </el-link>
        <el-link
          class="ml-5"
          type="info"
          @click.prevent="showLog(v.row, v.$index)"
          :underline="false"
        >
          <i class="fa fa-list-ol" :title="$l.log"></i>
        </el-link>
      </template>
    </z-table>
    <z-pagination
      :pagination="pagination"
      :total="total"
      :page.sync="query.page"
      :limit.sync="query.size"
      @change="getList"
    ></z-pagination>
    <z-form-dialog
      :name="name"
      :data="data"
      :formProps="formProps"
      :fields="fields"
      @submmit="submmit"
      :submmitLoading="submmitLoading"
      :visible.sync="editFormVisible"
    ></z-form-dialog>
    <el-dialog
      :title="$l.logShow"
      width="50%"
      :close-on-click-modal="false"
      :visible.sync="logDialogShow"
    >
      <el-button
        style="margin-top: -15px"
        class="fr"
        :disabled="loglist.length == 0"
        type="danger"
        @click.native="emptyLog"
        :loading="submmitLoading"
        >{{ $l.clear }}
      </el-button>
      <z-table
        :list="loglist"
        :tableProps="table2"
        :columns="table2columns"
        @editItem="() => {}"
        @deleteItem="() => {}"
      >
      </z-table>
      <z-pagination
        :pagination="pagination"
        :total="logtotal"
        :page.sync="logQuery.page"
        :limit.sync="logQuery.size"
        @change="getLogList"
      ></z-pagination>
    </el-dialog>
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
  api: api.quartz,
  apiCreate: api.quartz + 'update',
  tableProps: {
    border: true,
    opsColWith: 140,
  },
})
export default {
  components: { zTable, zFormDialog, zPagination },
  name: 'adminQurtz',
  data: function () {
    return {
      ...config,
      name: this.$l.title,
      columns: [
        { title: this.$l.job_name, key: 'job_name', width: 100 },
        { title: this.$l.job_group, key: 'job_group', width: 80 },
        { title: this.$l.enabled, key: 'enabled', width: 80 },
        { title: this.$l.description, key: 'description', width: 140 },
        { title: this.$l.running, key: 'running', width: 80 },
        { title: this.$l.last_run_time, key: 'last_run_time', width: 140 },
        {
          title: this.$l.trigger_type_label,
          key: 'trigger_type_label',
          width: 100,
        },
        { title: this.$l.cron, key: 'cron', width: 120 },
        { title: this.$l.begintime, key: 'begintime', width: 140 },
        { title: this.$l.endtime, key: 'endtime', width: 140 },
        { title: this.$l.runtimes, key: 'runtimes', width: 70 },
        { title: this.$l.interval_second, key: 'interval_second', width: 90 },
        { title: this.$l.assembly_name, key: 'assembly_name', width: 140 },
        { title: this.$l.class_fullname, key: 'class_fullname', width: 170 },
        { title: this.$c.remarks, key: 'remarks' },
        { title: this.$c.modify_user, key: 'modify_user', width: 90 },
        { title: this.$c.modify_time, key: 'modify_time', width: 140 },
      ],
      fields: [
        { title: this.$l.job_name, key: 'job_name', required: true, span: 12 },
        {
          title: this.$l.job_group,
          key: 'job_group',
          required: true,
          span: 12,
        },
        {
          title: this.$l.trigger_type_label,
          key: 'trigger_type',
          required: true,
          span: 12,
          name: 'select',
          options: [],
        },
        { title: this.$l.description, key: 'description', span: 12 },
        {
          title: this.$l.assembly_name,
          key: 'assembly_name',
          required: true,
          span: 12,
        },
        {
          title: this.$l.class_fullname,
          key: 'class_fullname',
          required: true,
          span: 12,
        },
        {
          title: this.$l.begintime,
          key: 'begintime',
          span: 12,
          name: 'date',
          props: { type: 'datetime', valueFormat: 'yyyy-MM-dd HH:mm:ss' },
        },
        {
          title: this.$l.endtime,
          key: 'endtime',
          span: 12,
          name: 'date',
          props: { type: 'datetime', valueFormat: 'yyyy-MM-dd HH:mm:ss' },
        },
        {
          title: this.$l.runtimes,
          key: 'runtimes',
          name: 'number',
          span: 12,
          hidden: false,
        },
        {
          title: this.$l.interval_second,
          key: 'interval_second',
          name: 'number',
          span: 12,
          hidden: false,
        },
        { title: this.$l.cron, key: 'cron', hidden: false },
        { title: this.$c.remarks, key: 'remarks', name: 'textarea' },
      ],
      typeOptions: [
        { label: this.$l.cron, value: 'cron' },
        { label: this.$l.typeOptions2, value: 'simple' },
      ],
      table2: {
        border: false,
        opsColWith: 80,
        hideOperations: true,
      },
      table2columns: [
        { title: this.$l.logBegintime, key: 'begintime' },
        { title: this.$l.logEndtime, key: 'endtime' },
        { title: this.$l.logSpendTime, key: 'spend_time' },
        // { title: '数据1', key: 'data1', width: 100 },
        // { title: '数据2', key: 'data2', width: 100 },
        // { title: '数据3', key: 'data3', width: 100 },
      ],
      logDialogShow: false,
      logQuery: {},
      loglist: [],
      logtotal: 0,
    }
  },
  methods: {
    ...initFuncs,
    formatList(list) {
      let tmp = _.cloneDeep(list)
      return tmp.map((i) => {
        let t = this.typeOptions.find((j) => j.value == i.trigger_type)
        if (t) i.trigger_type_label = t.label
        return i
      })
    },
    startOrPauseJob(row, enable) {
      let url = api.quartz + 'enable'
      this.pageLoading = true
      this.$request(url, { id: row.id, enable }, 'post')
        .then((r) => {
          this.pageLoading = false
          this.$message.success(this.$c.success)
          this.getList()
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    doOnceJob(row) {
      let url = api.quartz + 'do'
      this.pageLoading = true
      this.$request(url, { id: row.id }, 'post')
        .then((r) => {
          this.pageLoading = false
          this.$message.success(this.$l.runed)
          this.getList()
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    showLog(row) {
      this.logQuery = { page: 1, size: 10, jobid: row.id }
      this.loglist = []
      this.logtotal = 0
      this.logDialogShow = true
      this.getLogList()
    },
    getLogList() {
      let url = api.quartz + 'getloglist'
      this.$request(url, this.logQuery)
        .then((r) => {
          this.loglist = r.data.list
          this.logtotal = r.data.total
        })
        .catch(() => {})
    },
    emptyLog() {
      this.$confirm(this.$l.clearLog).then(() => {
        this.submmitLoading = true
        let url = api.quartz + 'emptylog'
        this.$request(url, { jobid: this.loglist[0].job_id }, 'post')
          .then((r) => {
            this.$message.success(this.$c.success)
            this.submmitLoading = false
            this.logDialogShow = false
          })
          .catch(() => {
            this.submmitLoading = false
          })
      })
    },
  },
  created: function () {
    this.getList()
    this.getFieldConfig(this.fields,'trigger_type').options = this.typeOptions
  },
  watch: {
    data: {
      deep: true,
      immediate: true,
      handler(val, o) {
        this.getFieldConfig(this.fields,'runtimes').hidden = val.trigger_type == 'cron'
        this.getFieldConfig(this.fields,'interval_second').hidden =
          val.trigger_type == 'cron'
        this.getFieldConfig(this.fields,'cron').hidden = val.trigger_type != 'cron'
      },
    },
  },
}
</script>
<style scoped>
</style>
