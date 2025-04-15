<template>
  <div class="app-container" v-loading="pageLoading">
    <el-button type="primary" class="fr" @click="createItem" style="margin-left: 5px">
      {{ $c.create }}
    </el-button>
    <el-button :loading="sortLoading" v-if="indexFlag" class="fr" @click="updateDetailSort" type="success" plain>
      {{ $c.saveIndex }}
    </el-button>
    <div class="filter-container">
      <el-input style="width: 200px" :placeholder="$l.search" clearable prefix-icon="el-icon-search" class="filter-item"
        @keyup.enter.native="getList" @clear="getList" v-model="query.queryString.str">
      </el-input>
      <el-select v-model="query.queryString.status" class="filter-item" clearable :placeholder="$l.statusPd"
        @change="getList">
        <el-option :label="$c.enabled" value="1"></el-option>
        <el-option :label="$c.disabled" value="2"></el-option>
      </el-select>
      <el-button class="filter-item" type="success" plain @click="getList">{{ $c.queryButton }}</el-button>
    </div>
    <z-table ref="dragTable" :list="list" :tableProps="tableProps" :columns="columns" @editItem="editItem"
      @deleteItem="deleteItem">
      <template v-slot:operation="v">
        <a href="#" class="text-blue" @click.prevent="editItem(v.row, v.$index)">{{ $c.edit }}</a>&nbsp;
        <a href="#" v-if="v.row.status==2 " class="text-green" @click.prevent="deleteItem(v.row, 1)">{{ $c.enable }}</a>
        <a href="#" v-if="v.row.status==1 " class="text-red" @click.prevent="deleteItem(v.row, 2)">{{ $c.disable }}</a>
      </template>
      <!-- <template v-slot:content="v">
				<span v-if="v.key === 'status'" class="label" :class="statusClass[v.row['status']]">
					{{ status[v.row['status']] }}
				</span>
				<span v-else>{{ v.row[v.key] }}</span>
			</template> -->
    </z-table>
    <z-pagination :pagination="pagination" :total="total" :page.sync="query.page" :limit.sync="query.size"
      @change="getList"></z-pagination>
    <z-form-dialog :name="name" :data="data" :formProps="formProps" :fields="fields" @submmit="submmit"
      :submmitLoading="submmitLoading" :visible.sync="editFormVisible"></z-form-dialog>
  </div>
</template>

<script>
import Sortable from 'sortablejs'
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
  initData: {
    file: [],
    "empnopz": "N",
    "orgidpz": "N",
    "deptnopz": "N",
    "otherspz": "N",
    status: '1'
  },
})
export default {
  name: 'adminBanner',
  components: {
    zTable,
    zFormDialog,
    zPagination
  },
  data: function () {
    return {
      ...config,
      status: {
        1: this.$c.enabled,
        2: this.$c.disabled
      },

      statusClass: {
        2: 'bg-red',
        1: 'bg-green'
      },
      indexFlag: false,
      sortLoading: false,
      name: this.$l.title,
      query: {
        queryString: {},
        size: 15,
        page: 1,
      },
      columns: [{
        title: this.$l.name,
        key: 'name',
        width: 200
      },
      {
        title: this.$l.description,
        key: 'description'
      },
      {
        title: this.$l.link,
        key: 'link'
      },
      {
        title: this.$l.file_name,
        key: 'file_name'
      },
      {
        title: this.$l.file_url,
        key: 'file_url'
      },
      // {
      //   title: this.$l.empnopz,
      //   key: 'empnopz',
      //   formatter: this.formatYN,
      // },
      // {
      //   title: this.$l.orgidpz,
      //   key: 'orgidpz',
      //   formatter: this.formatYN,
      // },
      // {
      //   title: this.$l.deptnopz,
      //   key: 'deptnopz',
      //   formatter: this.formatYN,
      // },
      // {
      //   title: this.$l.otherspz,
      //   key: 'otherspz',
      //   formatter: this.formatYN,
      // },
      {
        title: this.$l.status,
        key: 'status',
        formatter: this.formatStatus,
        width: 70
      },
      {
        title: this.$c.modify_user,
        key: 'modify_user',
        width: 100
      },
      {
        title: this.$c.modify_time,
        key: 'modify_time',
        width: 140
      },
      ],
      fields: [{
        title: this.$l.name,
        key: 'name',
        required: true
      },
      {
        title: this.$l.description,
        key: 'description'
      },
      {
        title: this.$l.link,
        key: 'link'
      },

      {
        title: this.$l.upload,
        key: 'file',
        name: 'imgUploader',
        props: {
          showCount: false,
          maxCount: 1,
        },
        events: {
          addImg: this.addImg,
          deleteImg: this.deleteImg,
        },
      },
      // {
      //   title: this.$l.empnopz,
      //   key: 'empnopz',
      //   name: 'select',
      //   events: {},
      //   options: [{
      //     value: 'N',
      //     label: 'N'
      //   },
      //   {
      //     value: 'Y',
      //     label: 'Y'
      //   },
      //   ],
      //   props: {
      //     placeholder: this.$l.orgidpzPd
      //   },
      //   required: true,
      //   span: 6,
      // },
      // {
      //   title: this.$l.orgidpz,
      //   key: 'orgidpz',
      //   name: 'select',
      //   events: {},
      //   options: [{
      //     value: 'N',
      //     label: 'N'
      //   },
      //   {
      //     value: 'Y',
      //     label: 'Y'
      //   },
      //   ],
      //   props: {
      //     placeholder: this.$l.orgidpzPd
      //   },
      //   required: true,
      //   span: 6,
      // },
      // {
      //   title: this.$l.deptnopz,
      //   key: 'deptnopz',
      //   name: 'select',
      //   events: {},
      //   options: [{
      //     value: 'N',
      //     label: 'N'
      //   },
      //   {
      //     value: 'Y',
      //     label: 'Y'
      //   },
      //   ],
      //   props: {
      //     placeholder: this.$l.deptnopzPd
      //   },
      //   required: true,
      //   span: 6,
      // },
      // {
      //   title: this.$l.otherspz,
      //   key: 'otherspz',
      //   name: 'select',
      //   events: {},
      //   options: [{
      //     value: 'N',
      //     label: 'N'
      //   },
      //   {
      //     value: 'Y',
      //     label: 'Y'
      //   },
      //   ],
      //   props: {
      //     placeholder: this.$l.otherspzPd
      //   },
      //   required: true,
      //   span: 6,
      // },
      {
        title: this.$l.isEnable,
        key: 'status',
        span: 8,
        name: 'switch',
        props: {
          inactiveValue: '2',
          activeValue: '1'
        },
      },
      // {
      //   title: this.$l.autopz,
      //   key: 'autopz',
      //   span: 8,
      //   name: 'switch',
      //   props: {
      //     inactiveValue: 'N',
      //     activeValue: 'Y'
      //   },
      //   events: {
      //     change: this.autopzChange
      //   },
      // },
      {
        title: this.$l.begdate,
        key: 'begdate',
        span: 24,
        name: 'date',
        props: {
          type: 'datetime',
          valueFormat: 'yyyy-MM-dd HH:mm:ss'
        }
      },
      {
        title: this.$l.enddate,
        key: 'enddate',
        span: 24,
        name: 'date',
        props: {
          type: 'datetime',
          valueFormat: 'yyyy-MM-dd HH:mm:ss'
        }
      },
      ],
    }
  },
  methods: {
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
          var tmp = this.list[evt.oldIndex]
          this.list[evt.oldIndex] = this.list[evt.newIndex]
          this.list[evt.newIndex] = tmp
          this.indexFlag = true
        },
      })
    },
    getList(e) {
      this.$request(api.baseUrl + "/Compliance/complianceAuth/getBannerList", {
        queryString: {
          ...this.query.queryString,
          page: this.query.page,
          size: this.query.size
        }
      })
        .then(r => {
          this.pageLoading = false
          this.list = r.data.list
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    deleteItem(e,is_valid) {
      this.$confirm(this.$c.cfmDelete, this.$c.oprConfirm).then(() => {
        this.pageLoading = true
        let url = this.$api.baseUrl + '/Compliance/complianceAuth/DeleteOrRecoveryBannerById'

        this.$request(url, {
          key: e.id,
          value: is_valid
        }, 'post')
          .then(r => {
            this.pageLoading = false
            this.$message({
              message: this.$c.success,
              type: 'success'
            })
            this.getList()
          })
          .catch(() => {
            this.pageLoading = false
          })
      })
    },
    createItem() {
      this.data = _.cloneDeep(this.initData)
      this.editFormVisible = true
    },

    editItem(v) {
      this.data = _.cloneDeep(this.initData)
      this.pageLoading = true
      let url = api.baseUrl + '/Compliance/complianceAuth/getBannerByid'
      if (this.apiSingle) {
        url = this.apiSingle
      }
      this.$request(url, {
        id: v.id
      })
        .then(r => {
          this.pageLoading = false
          this.data = this.formatAfterGet(r.data || {})
          // this.autopzChange()
          this.editFormVisible = true
        })
        .catch(() => {
          this.pageLoading = false
        })
    },

    addImg(v, list) {
      console.log(this.data)
      this.data.file.push(v[0])
    },

    deleteImg(i, list) {
      this.data.file_id = ''
      this.data.file = []
    },

    submmit() {
      this.submmitLoading = true

      let formData = new FormData()
      if (this.data.file && this.data.file[0]) {
        formData.append('file', this.data.file[0])
      }

      formData.append('model', JSON.stringify(this.data))
      this.$request(api.baseUrl + '/Compliance/complianceAuth/CreateOrModifyBanner', formData, 'post')
        .then((r) => {
          this.submmitLoading = false
          this.$message({
            message: this.$c.success,
            type: 'success',
          })
          this.editFormVisible = false
          this.getList()
        })
        .catch(() => {
          this.submmitLoading = false
        })
    },

    updateDetailSort() {
      this.sortLoading = true
      let listSortIds = this.list.map((v) => {
        return v.id
      })
      this.$request(api.baseUrl + 'updateSeq', listSortIds, 'post')
        .then((r) => {
          this.sortLoading = false
          this.getList()
        })
        .catch((e) => {
          this.sortLoading = false
        })
    },

    formatAfterGet(data) {
      data.status = data.status.toString()
      return data
    },

    formatList(data) {
      //this.setSort()
      return data
    },

    formatStatus(row) {
      if (row == '1') {
        return this.$c.enabled
      } else if (row == '2') {
        return this.$c.disabled
      }
    },

    autopzChange() {
      if (this.data.autopz == "Y") {
        this.getFieldConfig(this.fields, 'begdate').props.disabled = false
        this.getFieldConfig(this.fields, 'enddate').props.disabled = false
      } else {
        this.getFieldConfig(this.fields, 'begdate').props.disabled = true
        this.getFieldConfig(this.fields, 'enddate').props.disabled = true
        this.data.begdate = null
        this.data.enddate = null
      }
    }
  },
  created: function () {
    this.getList()
  },
}
</script>
<style scoped></style>
