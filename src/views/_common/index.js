import dayjs from 'dayjs'
import _ from 'lodash'

import api from '@/api'

import zForm from './Form'
import zFormDialog from './FormDialog'
import zPagination from './Pagination'
import zTable from './Table'

var defaultConfig = {
  // apiList,
  // apiSingle,
  // apiCreate,
  // apiEdit,
  // apiDelete,
  initData: {}, // 创建数据时的默认对象，可以用来设置默认值或者初始化一些属性
  tableProps: {
    border: true,
    opsColWith: 86,
    hideOperations: false
  },
  formProps: {
    dialogWidth: '70%',
    labelWidth: '140px'
  },
  query: {
    size: 10,
    page: 1
  },
  pagination: {
    // 分页组件配置 如不需分页，可以把pagination设置为null
    layout: 'prev, pager, next, jumper, ->, total, sizes'
  },
  pageLoading: false, // 页面的loading状态
  editFormVisible: false, // 编辑模态框的显示状态
  submmitLoading: false, // 保存按钮的loading状态
  exportLoading: false, // 导出按钮的loading状态
  list: [], // 列表数据
  data: {}, // 单条数据
  total: 0
}

var initFuncs = {
  research() {
    this.query.page = 1
    this.list = []
    this.total = 0
    this.getList()
  },
  getList() {
    this.pageLoading = true
    let url = this.api + 'getlist'
    if (this.apiList) {
      url = this.apiList
    }
    this.$request(url, this.formatQuery(this.query))
      .then(r => {
        this.pageLoading = false
        this.list = this.formatList(r.data.list)
        this.total = r.data.total
      })
      .catch(() => {
        this.pageLoading = false
      })
  },
 
  formatList(list) {
    // 依据实际需求处理
    const tmp = _.cloneDeep(list)
    return tmp.map(i => {
      return i
    })
  },
  formatAfterGet(data) {
    // 依据实际需求处理
    return data
  },
  formatBeforeSave(data) {
    // 依据实际需求处理
    const tmp = _.cloneDeep(data)
    return tmp
  },
  formatQuery(query, nopage = false) {
    const tmp = _.cloneDeep(query)
    if (tmp.params && tmp.params.datarange) {
      tmp.params.start = tmp.params.datarange[0]
      tmp.params.end = tmp.params.datarange[1]
      delete tmp.params.datarange
    }
    if (nopage) {
      tmp.size = 999999
    }
    return tmp
  },
  createItem() {
    this.data = _.cloneDeep(this.initData)
    this.editFormVisible = true
  },
  editItem(v) {
    this.data = _.cloneDeep(this.initData)
    this.pageLoading = true
    let url = this.api + 'getbyid'
    if (this.apiSingle) {
      url = this.apiSingle
    }
    this.$request(url, { id: v.id })
      .then(r => {
        this.pageLoading = false
        this.data = this.formatAfterGet(r.data || {})
        this.editFormVisible = true
      })
      .catch(() => {
        this.pageLoading = false
      })
  },
  deleteItem(v) {
    this.$confirm('确定要删除这条记录？', '操作确认').then(() => {
      this.pageLoading = true
      let url = this.api + 'delete'
      if (this.apiDelete) {
        url = this.apiDelete || url
      }
      url = url + '/' + v.id
      this.$request(url, { id: v.id }, 'post')
        .then(() => {
          this.pageLoading = false
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getList()
        })
        .catch(() => {
          this.pageLoading = false
        })
    })
  },
  submmit() {
    this.submmitLoading = true
    let url = ''
    if (!this.data.id) {
      url = this.apiCreate ? this.apiCreate : this.api + 'add'
    } else {
      url = this.apiEdit ? this.apiEdit : this.api + 'update'
    }
    const data = this.formatBeforeSave(this.data)
    this.$request(url, data, 'post')
      .then(() => {
        this.submmitLoading = false
        this.$message({
          message: '操作成功',
          type: 'success'
        })
        this.editFormVisible = false
        this.getList()
      })
      .catch(() => {
        this.submmitLoading = false
      })
  },
  exportData() {
    let url = this.api + 'getlist'
    if (this.apiList) {
      url = this.apiList
    }
    this.exportLoading = true
    this.$request(url, this.formatQuery(this.query, true))
      .then(r => {
        var exprotList = this.formatList(r.data.list)
        import('@/vendor/Export2Excel')
          .then(excel => {
            const filterVal = this.columns.map(item => {
              return item.key
            })
            const tHeader = this.columns.map(item => {
              return item.title || item.key
            })
            const data = exprotList.map(v => filterVal.map(j => v[j]))
            excel.export_json_to_excel({
              header: tHeader,
              data,
              filename:
                (this.name || 'export_data') + '_' + dayjs().format('YYYYMMDD')
            })
            this.exportLoading = false
          })
          .catch(e => {
            this.exportLoading = false
            throw e
          })
      })
      .catch(() => {
        this.exportLoading = false
      })
  },
  getFieldConfig(fields,fieldName) {
    var j = _.findIndex(fields, i => i.key == fieldName)
    if (j != -1) {
      return fields[j]
    }
    return null
  },
  arrayOptions(arr, v, l) {
    if (!v) return arr
    const r = []
    arr.forEach(item => {
      if (item[v] === undefined) return
      const data = []
      if (!l) {
        data.push(item[v])
      } else if (Array.isArray(l)) {
        l.forEach(i => {
          data.push(item[i])
        })
      } else {
        data.push(item[l])
      }
      r.push({ value: item[v], label: data.join(' ') })
    })
    return r
  },
  setFieldOptions(fields,fieldName, arr, v, l) {
    let tmp = []
    if (arr && arr.length > 0) {
      tmp = this.arrayOptions(arr, v, l)
    }
    var conf = this.getFieldConfig(fields,fieldName)
    if (conf) {
      conf.options = tmp
    }
  },

  
}
  
export {
  _,
  api,
  dayjs,
  defaultConfig,
  initFuncs,
  zForm,
  zFormDialog,
  zPagination,
  zTable,
  // getfeedback
}
