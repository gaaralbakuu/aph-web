<template>
  <div class="videoTag-container">
    <a-modal v-model="showObj.tagShow" :title="$l.addTag" :ok-text="$l.submit" :cancel-text="$l.giveup" @ok="handleSubmit" width="600px" :maskClosable="false">
      <div class="form-container">
        <a-form layout="vertical">
          <a-form-item :label="$l.name_zh">
            <a-input v-model="tagObj.form.name_zh" placeholder=""/>
          </a-form-item>
          <a-form-item :label="$l.name_tw">
            <a-input v-model="tagObj.form.name_tw" placeholder=""/>
          </a-form-item>
          <a-form-item :label="$l.name_en">
            <a-input v-model="tagObj.form.name_en" placeholder=""/>
          </a-form-item>
          <a-form-item :label="$l.name_vi">
            <a-input v-model="tagObj.form.name_vi" placeholder=""/>
          </a-form-item>

          <div class="text-red-500 italic text-xs">
            * {{ $l.validationError }}
          </div>
        </a-form>
      </div>
    </a-modal>

    <div class="pageBody">
      <div class="pageBody-filter">
        <div class="filter-form">
          <div class="filter-item">
            <span class="filter-label">{{ $l.title }}:</span>
            <a-input v-model="tagObj.query.name" clearable @keyup.enter="getTagList" style="width: 200px" placeholder=""/>
          </div>
          <div class="filter-item">
            <span class="filter-label">{{ $l.status }}:</span>
            <a-select v-model="tagObj.query.is_valid" @change="getTagList" style="width: 150px" placeholder="">
              <a-select-option value="">{{ $c.all }}</a-select-option>
              <a-select-option value="Y">{{ $l.enable }}</a-select-option>
              <a-select-option value="N">{{ $l.disable }}</a-select-option>
            </a-select>
          </div>
          <a-button type="primary" @click="getTagList">{{ $l.search }}</a-button>
        </div>
        <div>
          <a-button type="primary" @click="addTag">{{ $l.addTag }}</a-button>
        </div>
      </div>

      <div class="tableContainer" ref="tableContainer">
        <a-table
          v-if="tagObj.list && tagObj.list.length > 0"
          :columns="tableColumns"
          :data-source="tagObj.list"
          :pagination="tablePagination"
          @change="handleTableChange"
          :loading="tableLoading"
          :scroll="{ x: 1200 }"
          size="middle"
          :rowKey="(record, index) => record.id || index"
        >
          <template slot="statusColumn" slot-scope="text, record">
            <span :style="{ color: text === 'Y' ? 'green' : 'red' }">
              {{ text === 'Y' ? $l.enable : $l.disable }}
            </span>
          </template>
          <template slot="actionColumn" slot-scope="text, record">
            <a-button-group>
              <a-button type="primary" size="small" @click="modifyTag(record)">{{ $c.edit }}</a-button>
              <a-button
                v-if="record.is_valid == 'N'"
                type="primary"
                size="small"
                style="background-color: seagreen; border-color: seagreen"
                @click="modifyStatus(record)"
              >
                {{ $c.enable }}
              </a-button>
              <a-button v-else type="danger" size="small" @click="modifyStatus(record)">
                {{ $c.disable }}
              </a-button>
            </a-button-group>
          </template>
        </a-table>
        <div v-else class="empty-state">
          {{ $c.no_data || 'No data available' }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'videoAdminTag',
  data() {
    return {
      tagObj: {
        query: {
          page: 1,
          pageSize: 10,
          name: '',
          is_valid: '',
        },
        form: {
          id: '',
          name_zh: '',
          name_en: '',
          name_tw: '',
          name_vi: '',
          is_valid: '',
          rec_status: '',
        },
        list: [],
        total: 0,
      },
      showObj: {
        tagShow: false,
      },
      tableLoading: false,
      tablePagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        pageSizeOptions: ['5', '10', '15', '30', '50', '100'],
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total) => `Total ${total} items`,
      },
      tableColumns: [
        {
          title: 'No',
          key: 'index',
          width: 50,
          customRender: (text, record, index) => index + 1,
        },
        {
          title: 'Name (ZH)',
          dataIndex: 'name_zh',
          key: 'name_zh',
          width: 150,
        },
        {
          title: 'Name (TW)',
          dataIndex: 'name_tw',
          key: 'name_tw',
          width: 150,
        },
        {
          title: 'Name (EN)',
          dataIndex: 'name_en',
          key: 'name_en',
          width: 150,
        },
        {
          title: 'Name (VI)',
          dataIndex: 'name_vi',
          key: 'name_vi',
          width: 150,
        },
        {
          title: 'Created',
          dataIndex: 'create_time',
          key: 'create_time',
          width: 200,
        },
        {
          title: 'Status',
          dataIndex: 'is_valid',
          key: 'is_valid',
          width: 100,
          scopedSlots: { customRender: 'statusColumn' },
        },
        {
          title: 'Action',
          key: 'action',
          width: 250,
          fixed: 'right',
          scopedSlots: { customRender: 'actionColumn' },
        },
      ],
    }
  },

  watch: {
    // Watch để cập nhật i18n titles khi ngôn ngữ thay đổi
    '$i18n.locale': function() {
      this.updateColumnTitles()
    },
  },

  methods: {
    updateColumnTitles() {
      // Cập nhật tiêu đề cột khi ngôn ngữ thay đổi
      this.tableColumns = this.tableColumns.map((col) => {
        switch (col.key) {
          case 'name_zh':
            col.title = this.$l.name_zh || 'Name (ZH)'
            break
          case 'name_tw':
            col.title = this.$l.name_tw || 'Name (TW)'
            break
          case 'name_en':
            col.title = this.$l.name_en || 'Name (EN)'
            break
          case 'name_vi':
            col.title = this.$l.name_vi || 'Name (VI)'
            break
          case 'create_time':
            col.title = this.$l.create_time || 'Created'
            break
          case 'is_valid':
            col.title = this.$l.status || 'Status'
            break
          case 'action':
            col.title = this.$l.oprate || 'Action'
            break
        }
        return col
      })
    },

    handleTableChange(pagination, filters, sorter) {
      this.tablePagination.current = pagination.current
      this.tablePagination.pageSize = pagination.pageSize
      this.tagObj.query.page = pagination.current
      this.tagObj.query.pageSize = pagination.pageSize
      this.getTagList()
    },

    addTag() {
      this.tagObj.form = {
        id: '',
        name_zh: '',
        name_en: '',
        name_tw: '',
        name_vi: '',
        is_valid: '',
        rec_status: '',
      }
      this.showObj.tagShow = true
    },

    modifyTag(data) {
      this.tagObj.form = Object.assign({}, this.tagObj.form, data)
      this.showObj.tagShow = true
    },

    modifyStatus(record) {
      const currentStatus = record.is_valid
      const value = currentStatus === 'N' ? 'Y' : 'N'
      const oprate = currentStatus === 'N' ? this.$c.enable : this.$c.disable
      const name = record.name_zh || record.name_en || record.name_vi || 'Record'

      const h = this.$createElement
      this.$confirm({
        title: this.$l.confirmTips || 'Confirm',
        content: h('div', [h('p', `${oprate}《${name}》?`)]),
        okText: this.$l.confirmtext || 'Yes',
        cancelText: this.$l.cancelText || 'No',
        onOk: () => {
          this.$request(
            this.$api.videoServer + '/Video/VideoTag/EnableOrDisabledTag',
            {
              key: record.id,
              value: value,
            },
            'post'
          ).then((r) => {
            this.$message.success(this.$l.oprateSuccess)
            this.getTagList()
          })
        },
        onCancel: () => {
          console.log('Cancel operation')
        },
      })
    },

    handleSubmit() {
      // Kiểm tra validation - ít nhất một trường ngôn ngữ phải được điền
      const hasValidLanguage =
        this.tagObj.form.name_zh.trim() !== '' ||
        this.tagObj.form.name_tw.trim() !== '' ||
        this.tagObj.form.name_en.trim() !== '' ||
        this.tagObj.form.name_vi.trim() !== ''

      if (!hasValidLanguage) {
        this.$message.warning(this.$l.validationError)
        return
      }

      if (this.tagObj.form.id === '') {
        this.tagObj.form.rec_status = 1
      }

      this.$request(this.$api.videoServer + '/Video/VideoTag/addOrModifyTag', this.tagObj.form, 'post')
        .then((r) => {
          if (r.httpCode === 200) {
            this.$message.success(this.$l.oprateSuccess)
            this.showObj.tagShow = false
            this.getTagList()
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    getTagList() {
      this.tableLoading = true
      this.$request(this.$api.videoServer + '/Video/VideoTag/getList', this.tagObj.query)
        .then((r) => {
          if (r.httpCode === 200) {
            this.tagObj.list = r.data.list || []
            this.tagObj.total = r.data.total || 0
            this.tablePagination.total = r.data.total || 0
          }
          this.tableLoading = false
        })
        .catch((e) => {
          console.log(e)
          this.tableLoading = false
        })
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.getTagList()
      this.updateColumnTitles()
    })
  },
}
</script>

<style scoped>
.videoTag-container {
  width: 100%;
  height: 100%;
  padding: 0;
}

.videoTag-container .pageBody {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  flex-direction: column;
}

.videoTag-container .pageBody .pageBody-filter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ddd;
  padding: 16px;
  height: auto;
  flex-wrap: wrap;
  gap: 12px;
}

.filter-form {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  white-space: nowrap;
  font-weight: 500;
}

.videoTag-container .pageBody .tableContainer {
  width: 100%;
  flex: 1;
  overflow: auto;
  padding: 12px;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 300px;
  color: #999;
  font-size: 14px;
}

/deep/ .ant-table {
  font-size: 14px;
}

/deep/ .ant-table-thead > tr > th {
  background-color: #f2f4f9;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
}

/deep/ .ant-table-tbody > tr > td {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
}

/deep/ .ant-table-tbody > tr:hover > td {
  background-color: #fafafa;
}

/deep/ .ant-pagination {
  margin-top: 12px;
  text-align: right;
}

.form-container {
  padding: 12px;
}

/deep/ .ant-form-item {
  margin-bottom: 16px;
}

/deep/ .ant-modal-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
}

/deep/ .ant-modal-title {
  font-size: 16px;
  font-weight: 600;
}

/deep/ .ant-btn-group {
  display: flex;
  gap: 8px;
}

/deep/ .ant-btn-group > .ant-btn {
  flex: 1;
  min-width: 60px;
}
</style>
