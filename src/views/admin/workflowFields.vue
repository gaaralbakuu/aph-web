<template>
  <div class="app-container" v-loading="pageLoading">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-button type="primary" class="fr" @click="createItem">{{
          $c.create
        }}</el-button>
        <div class="filter-container">
          <el-input
            style="width: 300px"
            :placeholder="$l.search"
            clearable
            prefix-icon="el-icon-search"
            class="filter-item"
            v-model="query.queryString.str"
          ></el-input>
          <el-button
            class="filter-item"
            type="success"
            @click="researchMain"
            plain
            >{{ $c.queryButton }}</el-button
          >
        </div>
      </el-col>
      <el-col :span="11">
        <z-table
          :list="list"
          :tableProps="tableProps"
          @current-change="clickDetail"
          :columns="columns"
        >
          <template v-slot:content="v">
            <span
              v-if="v.key === 'status'"
              class="label"
              :class="statusClass[v.row['status']]"
            >
              {{ status[v.row['status']] }}
            </span>
            <span v-else>{{ v.row[v.key] }}</span>
          </template>
          <template v-slot:operation="v">
            <!-- <a href="#" class="text-green">复制</a> -->
            <a
              href="#"
              :class="statusButtonClass[v.row.status]"
              :dta="v"
              @click.prevent="disOrEnable(v.row)"
              >{{ statusButton[v.row.status] }}</a
            >
            <a href="#" class="text-blue" @click.prevent="editItem(v.row)">{{
              $c.edit
            }}</a>
            <a href="#" class="text-red" @click.prevent="deleteItem(v.row)">{{
              $c.delete
            }}</a>
          </template>
        </z-table>
        <z-pagination
          :list="list"
          :pagination="pagination"
          :total="total"
          :page.sync="query.page"
          :limit.sync="query.size"
          @change="getList"
        ></z-pagination>
      </el-col>
      <z-form-dialog
        :name="name"
        :data="data"
        :formProps="formProps"
        :fields="fields"
        @submmit="submmit"
        :submmitLoading="submmitLoading"
        :visible.sync="editFormVisible"
      >
      </z-form-dialog>

      <el-col :span="13" v-show="detailFlag">
        <div
          style="
            padding: 10px 0;
            min-height: 40px;
            margin-bottom: 10px;
            display: flex;
            justify-content: space-between;
            gap: 10px;
          "
        >
          <div style="display: flex; align-items: center; gap: 4px">
            <div style="white-space: pre">Số phiên bản</div>
            <el-select
              @change="changeVersionProcess"
              style="width: 100%"
              v-model="versionProcessSelected"
              :placeholder="$l.typePd"
            >
              <el-option
                v-for="item in versionProcess"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div style="display: flex; flex-direction: row-reverse; gap: 4px">
            <el-button @click="openDetail" type="primary" plain>{{
              $l.addDetail
            }}</el-button>
            <el-button
              :loading="sortLoading"
              v-if="indexFlag"
              @click="updateDetailSort"
              style="margin-left: 0"
              type="success"
              plain
              >{{ $c.saveIndex }}</el-button
            >
          </div>
          <!-- <el-input
            style="width: 300px"
            placeholder="输入名称查询按回车"
            clearable
            prefix-icon="el-icon-search"
            class="filter-item"
            @keyup.enter.native="research"
            @clear="research"
            v-model="queryDetail.queryString.str"
          ></el-input>
          <el-button class="filter-item" type="success" plain @click="getDetailList"
            >查询</el-button
          > -->
        </div>
        <z-table
          ref="dragTable"
          :list="listDetail"
          row-key="id"
          :tableProps="tableProps"
          :columns="columnsDetail"
        >
          <template v-slot:content="v">
            <span
              v-if="v.key === 'status'"
              class="label"
              :class="statusClass[v.row['status']]"
            >
              {{ status[v.row['status']] }}
            </span>
            <span v-else>{{ v.row[v.key] }}</span>
          </template>
          <template v-slot:operation="v">
            <a
              href="#"
              :class="statusButtonClass[v.row.status]"
              :dta="v"
              @click.prevent="disOrEnable(v.row)"
              >{{ statusButton[v.row.status] }}</a
            >
            <a href="#" class="text-blue" @click.prevent="editDetail(v.row)">{{
              $c.edit
            }}</a>
            <a href="#" class="text-red" @click.prevent="deleteDetail(v.row)">{{
              $c.delete
            }}</a>
          </template>
        </z-table>
        <!-- <z-pagination
          :pagination="pagination"
          :total="totalDetail"
          :page.sync="queryDetail.page"
          :limit.sync="queryDetail.size"
          @change="getDetailList"
        ></z-pagination> -->
      </el-col>
    </el-row>

    <!-- detail -->
    <el-dialog
      :title="
        this.$l.detailField + (dataDetail ? this.$c.edit : this.$c.create)
      "
      :close-on-click-modal="false"
      :visible.sync="visibleDetail"
      width="600px"
    >
      <el-form :model="dataDetail">
        <div style="display: flex; gap: 10px;margin-bottom:  10px;">
          <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
            <div style="font-weight: bold">Tên</div>
            <div>
              <el-input
                :placeholder="$l.detailNamePd"
                v-model="dataMain.name"
              ></el-input>
            </div>
          </div>
          <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
            <div style="font-weight: bold">Kích hoạt</div>
            <div style="height: 32px; display: flex; align-items: center">
              <el-switch
                v-model="dataMain.status"
                inactiveValue="2"
                activeValue="1"
              >
              </el-switch>
            </div>
          </div>
        </div>
        <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
          <div style="font-weight: bold">Thông tin chi tiết</div>
          <div style="height: 32px; display: flex; align-items: center">
            <el-input
              value="info"
              style="display: none"
              v-model="dataDetail.type"
            ></el-input>
            <el-input
              :placeholder="$l.detailTitlePd"
              :label="$l.detailTitlePddname"
              v-model="dataDetail.title"
            ></el-input>
          </div>
        </div>
        <el-form-item>
          <el-row
            v-for="(item, index) in dataDetail.list"
            :key="index"
            style="margin-top: 5px"
          >
            <el-col :span="7">
              <el-input
                :placeholder="$l.detailKeyPd"
                v-model="item.key"
              ></el-input>
            </el-col>
            <el-col style="margin-left: 5px" :span="7">
              <el-input :placeholder="$l.detailLabelPd" v-model="item.label">
              </el-input>
            </el-col>
            <el-col style="margin-left: 5px" :span="5">
              <el-checkbox v-model="item.enter">Xuống hàng</el-checkbox>
            </el-col>

            <el-col :span="4" style="margin-left: 5px">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-minus"
                circle
                @click="removeItem(index)"
              ></el-button>
              <el-button
                v-show="index == dataDetail.list.length - 1"
                style="margin-left: 3px"
                type="primary"
                size="mini"
                icon="el-icon-plus"
                circle
                @click="addItem()"
              ></el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <div style="display: flex; gap: 4px; flex-wrap: wrap">
          <el-tag
            v-for="item in listField"
            :key="item"
            effect="dark"
            @click="copyToClipboard(item)"
            style="margin-left: 0; cursor: pointer"
          >
            {{ item }}
          </el-tag>
        </div>
      </el-form>
      <div style="padding-right: 100px; margin-top: 40px">
        <div class="align-r">
          <el-button @click="visibleDetail = false">{{ $c.cancel }}</el-button>
          <el-button
            v-if="!formProps.disabled"
            type="primary"
            @click.native="submmitDetail"
            :loading="submmitLoadingDetail"
            >{{ $c.confirm }}
          </el-button>
          <slot name="operation"></slot>
        </div>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Sortable from 'sortablejs'

import {
  _,
  api,
  dayjs,
  defaultConfig,
  initFuncs,
  zFormDialog,
  zPagination,
  zTable,
} from '@/views/_common'

const config = Object.assign({}, _.cloneDeep(defaultConfig), {
  api: api.workflowField,
  apiEdit: api.workflowField + 'addormodify',
  apiCreate: api.workflowField + 'addormodify',
  apiParamShow: api.param + 'getparamshow',
  tableProps: {
    'highlight-current-row': true,
    border: true,
    opsColWith: '120',
  },
  initData: { status: '1' },
  data: {},
  editFormVisible: false, //编辑模态框的显示状态
  list: [],
  total: 0,
  query: {
    queryString: {},
    size: 10,
    page: 1,
  },

  formProps: {
    dialogWidth: '40%',
    labelWidth: '140px',
  },

  pagination: {
    //分页组件配置 如不需分页，可以把pagination设置为null
    layout: 'prev, pager, next, ->, total',
  },
})
export default {
  name: 'adminWorkflowFields',
  components: { zTable, zFormDialog, zPagination },
  data: function () {
    return {
      ...config,
      statusButton: { 1: this.$c.disable, 2: this.$c.enable },
      statusButtonClass: { 1: 'text-yellow', 2: 'text-green' },
      parentId: '',
      name: this.$l.title,
      workflowOptions: [],
      detailFlag: false,
      visibleDetail: false,
      status: { 1: this.$c.enabled, 2: this.$c.disabled },
      statusClass: { 2: 'bg-red', 1: 'bg-green' },
      columns: [
        { title: this.$l.name, key: 'name' },
        { title: this.$l.process_code, key: 'process_code', width: 70 },
        { title: this.$l.status, key: 'status', width: 70 },
        { title: this.$c.modify_user, key: 'modify_user', width: 100 },
        { title: this.$c.modify_time, key: 'modify_time', width: 140 },
      ],
      fields: [
        {
          title: this.$l.name,
          key: 'name',
          span: 24,
          //required: true,
        },
        {
          title: this.$l.process_code,
          key: 'process_code',
          span: 24,
          //required: true,
        },
        {
          title: this.$l.isEnable,
          key: 'status',
          span: 8,
          name: 'switch',
          props: { inactiveValue: '2', activeValue: '1' },
        },
      ],
      dataMain: {},
      dataDetailInit: {
        title: '',
        type: 'info',
        list: [{ key: '', type: '' }],
      },
      dataDetail: {
        title: '',
        type: 'info',
        list: [{ key: '', type: '' }],
      },
      queryDetail: { queryString: {}, size: 99, page: 1 },
      processCode: '',
      listDetail: [],
      totalDetail: 0,
      detailName: '',
      indexFlag: false,
      sortLoading: false,
      submmitLoadingDetail: false,
      listSortIds: [],
      typeOptions: [
        { value: 'info', label: 'Info' },
        { value: 'grid', label: 'Grid' },
      ],

      versionProcess: [],
      versionProcessSelected: '',
      listField: [],

      columnsDetail: [
        { title: this.$l.detialNmae, key: 'name', width: 120 },
        { title: this.$l.field_json, key: 'field_json', width: 140 },
        { title: this.$l.status, key: 'status', width: 80 },
        { title: this.$c.modify_user, key: 'modify_user', width: 100 },
        { title: this.$c.modify_time, key: 'modify_time', width: 140 },
      ],
      tableData: [],
    }
  },
  methods: {
    ...initFuncs,
    changeGridField() {
      if (this.dataDetail.type == 'info') this.dataDetail.grid_field = ''
    },
    changeVersionProcess() {
      this.getDetailList()
    },
    researchMain() {
      this.listDetail = []
      this.query.page = 1
      this.getList()
    },
    formatAfterGet(data) {
      data.status = data.status.toString()
      return data
    },
    updateDetailSort() {
      this.sortLoading = true
      this.$request(this.api + 'UpdateSort', this.listSortIds, 'post')
        .then((r) => {
          this.sortLoading = false
          this.getDetailList()
        })
        .catch((e) => {
          this.sortLoading = false
        })
    },
    createItem() {
      this.data = _.cloneDeep(this.initData)
      this.editFormVisible = true
    },
    disOrEnable(v) {
      let status = { 1: this.$c.disable, 2: this.$c.enable }
      this.$confirm(status[v.status] + this.$l.record, this.$c.oprConfirm).then(
        () => {
          this.pageLoading = true
          this.$request(this.api + 'DisOrEnable/' + v.id, {}, 'post')
            .then((r) => {
              this.pageLoading = false
              this.$message({
                message: this.$c.success,
                type: 'success',
              })
              if (v.parent_id) this.getDetailList()
              if (!v.parent_id) this.getList()
            })
            .catch(() => {
              this.pageLoading = false
            })
        }
      )
    },
    openDetail() {
      this.dataMain = { status: '1' }
      this.visibleDetail = true
      this.dataDetail = _.cloneDeep(this.dataDetailInit)
    },
    clickDetail(v) {
      this.dataMain = {}
      this.processCode = ''
      this.dataDetail = _.cloneDeep(this.dataDetailInit)
      if (v) {
        this.queryDetail.queryString.parentId = v.id
        this.processCode = v.process_code
        this.getListVersion(v.process_code)
      }

      this.detailFlag = true
    },
    getListVersion(id) {
      this.$request(api.param + 'getlistversion', { id: id }).then((r) => {
        if (r.data.length != 0) {
          this.versionProcessSelected = r.data[0].OID
        } else {
          this.versionProcessSelected = ''
        }
        this.versionProcess = r.data.map((item) => {
          return { value: item.OID, label: item.VERSION }
        })

        this.getDetailList()
      })
    },
    getDetailList() {
      this.pageLoading = true
      let url = this.api + 'getlist'
      this.$request(url, {
        ...this.queryDetail,
        queryString: JSON.stringify({
          ...this.queryDetail.queryString,
          oid: this.versionProcessSelected,
        }),
      })
        .then((r) => {
          this.pageLoading = false
          this.listDetail = []
          this.listDetail = r.data.list

          this.listSortIds = this.listDetail.map((v) => {
            return v.id
          })
          this.setSort()
          this.$forceUpdate()
        })
        .catch(() => {
          this.pageLoading = false
        })

      this.$request(
        this.apiParamShow,
        { id: this.versionProcessSelected },
        'get'
      ).then((r) => {
        this.listField = r.data
      })
    },
    editDetail(v) {
      this.$request(this.api + 'getbyid', { id: v.id }).then((r) => {
        let data = r.data
        if (data) {
          this.dataMain = {
            id: data.id,
            process_code: data.process_code,
            name: data.name,
            sort: data.sort,
            status: data.status.toString(),
          }

          if (data.field_json) this.dataDetail = JSON.parse(data.field_json)
        }

        this.$forceUpdate()
        this.visibleDetail = true
      })
    },

    deleteDetail(v) {
      this.$confirm(this.$c.cfmDelete, this.$c.oprConfirm).then(() => {
        this.pageLoading = true
        let url = this.api + 'delete/' + v.id

        this.$request(url, {}, 'post')
          .then((r) => {
            this.pageLoading = false
            this.$message({
              message: this.$c.success,
              type: 'success',
            })
            this.getDetailList()
          })
          .catch(() => {
            this.pageLoading = false
          })
      })
    },

    addItem() {
      this.dataDetail.list.push({ key: '', label: '' })
    },
    removeItem(i) {
      this.dataDetail.list.splice(i, 1)
      if (this.dataDetail.list.length == 0) this.addItem()
    },
    setSort() {
      let el = this.$refs.dragTable.$el.querySelectorAll(
        '.el-table__body-wrapper > table > tbody'
      )[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost',
        setData: function (dataTransfer) {
          dataTransfer.setData('Text', '')
        },
        onEnd: (evt) => {
          // const targetRow = this.listDetail.splice(evt.oldIndex, 1)[0]
          // this.detailList.splice(evt.newIndex, 0, targetRow)
          var tmp = this.listSortIds[evt.oldIndex]
          this.listSortIds[evt.oldIndex] = this.listSortIds[evt.newIndex]
          this.listSortIds[evt.newIndex] = tmp
          this.indexFlag = true
        },
      })
    },
    submmitDetail() {
      this.submmitLoading = true
      let url = this.apiCreate
      let obj = {
        field_json: JSON.stringify(this.dataDetail),
        parent_id: this.queryDetail.queryString.parentId,
        process_code: this.processCode,
        status: this.dataMain.status,
        oid: this.versionProcessSelected,
        version: this.versionProcess.find((x) => {
          return x.value == this.versionProcessSelected
        }).label,
        ...this.dataMain,
      }
      this.$request(url, obj, 'post')
        .then((r) => {
          this.submmitLoadingDetail = false
          this.$message({
            message: this.$c.success,
            type: 'success',
          })
          this.visibleDetail = false
          this.getDetailList()
        })
        .catch(() => {
          this.submmitLoadingDetail = false
        })
    },

    copyToClipboard(text) {
      const textarea = document.createElement('textarea')
      textarea.value = text
      document.body.appendChild(textarea)
      textarea.select()
      try {
        document.execCommand('copy')
        this.$message({
          message: 'Copy thành công',
          type: 'success',
        })
      } catch (err) {
        this.$message({
          message: 'Copy thất bại',
          type: 'error',
        })
      }
      document.body.removeChild(textarea)
    },
  },
  created: function () {
    this.getList()
  },
}
</script>
<style scoped>
::v-deep .el-card__header {
  padding: 6px 20px !important;
}
::v-deep .el-card__body {
  padding-left: 0px !important;
}
</style>
