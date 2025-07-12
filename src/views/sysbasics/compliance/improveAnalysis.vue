<template>
  <div class="app-container" v-loading="pageLoading">
    <div>
      <div style="display: flex; gap: 16px; margin-bottom: 10px">
        <!-- Left: search fields in columns -->
        <div style="flex: 1; display: flex; flex-direction: column; gap: 12px">
          <div style="display: flex; gap: 12px">
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ $l.manufactureName }}</label>
              <el-input :placeholder="$l.manufactureName" v-model="formInline.name" style="width: 100%" clearable />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ $l.issueType }}</label>
              <el-input :placeholder="$l.issueType" v-model="formInline.issues_type" style="width: 100%" clearable />
            </div>
            <!-- <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ $l.issueDesc }}</label>
              <el-input :placeholder="$l.issueDesc" v-model="formInline.issues_desc" style="width: 100%" clearable />
            </div> -->
          </div>
          <!-- <div style="display: flex; gap: 12px">
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ $l.suggest }}</label>
              <el-input :placeholder="$l.suggest" v-model="formInline.suggest" style="width: 100%" clearable />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ $l.correctiveDate }}</label>
              <el-input :placeholder="$l.correctiveDate" v-model="formInline.corrective_date" style="width: 100%" clearable />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ $l.correctivePrincipal }}</label>
              <el-input :placeholder="$l.correctivePrincipal" v-model="formInline.corrective_principal" style="width: 100%" clearable />
            </div>
          </div> -->
        </div>
        <!-- Right: buttons -->
        <div style="display: flex; justify-content: center; align-items: flex-end; min-width: 160px; gap: 12px">
          <el-button v-show="showAuth.m_search" type="primary" size="medium" @click="getTotal">{{ $l.search }}</el-button>
          <el-button v-show="showAuth.m_search" type="info" size="medium" @click="resetForm">{{ $l.reset }}</el-button>
        </div>
      </div>
    </div>
    <div>
      <el-divider></el-divider>
    </div>
    <el-table :data="tableData1" border style="width: 100%; margin-top: 1%">
      <el-table-column prop="total" :label="$l.T1Total" width="430"></el-table-column>
      <el-table-column prop="totalIssues" :label="$l.issueTotal" width="430"></el-table-column>
      <el-table-column prop="finshIssues" :label="$l.improveTotal" width="420"></el-table-column>
      <el-table-column prop="updaterate" :label="$l.totalRate" width="430"></el-table-column>
    </el-table>

    <div class="container">
      <div class="table-wrapper">
        <table class="custom-table">
          <thead>
            <tr>
              <th rowspan="2" class="main-header" width="80">{{ $l.ordinal }}</th>
              <th rowspan="2" class="main-header">{{ $l.manufactureName }}</th>
              <th colspan="5" class="main-header">{{ $l.thresholdIssueManagement }}</th>
            </tr>
            <tr>
              <th>{{ $l.issueType }}</th>
              <th>{{ $l.problemTotal }}</th>
              <th>{{ $l.problemImprove }}</th>
              <th>{{ $l.noImprove }}</th>
              <th>{{ $l.problemRate }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in tableData" :key="index">
              <td v-if="item._rowspan" :rowspan="item._rowspan" class="index-column">
                {{ item.index + 1 }}
              </td>
              <td v-if="item._rowspan" :rowspan="item._rowspan" class="manufacturer-column">
                {{ item.name_zh }}
              </td>
              <td>
                <span class="issue-type">
                  {{ item.issue_type }}
                </span>
              </td>
              <td v-if="item._rowspan" :rowspan="item._rowspan" class="number-cell">{{ item.total }}</td>
              <td v-if="item._rowspan" :rowspan="item._rowspan" class="number-cell">{{ item.is_finsh_total }}</td>
              <td v-if="item._rowspan" :rowspan="item._rowspan" class="number-cell">{{ item.no_finsh_total }}</td>
              <td v-if="item._rowspan" :rowspan="item._rowspan" class="rate-cell">{{ item.updategsl }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { _, api } from '@/views/_common'
import { getToken } from '@/utils/auth'
export default {
  name: 'issuesType',
  data() {
    return {
      progressPercentage: 0,
      userAuth: [], //保存用户权限
      showAuth: {
        //用于权限控制，搭配v-show控制界面上的操作按钮是否展示
        m_search: false,
        m_add: false,
        m_del: false,
        m_updata: false,
        m_import: false,
        m_export: false,
        m_upload: false,
        m_audit: false,
        m_print: false,
      },
      formInline: {
        name: '',
        issues_type: '',
        issues_desc: '',
        suggest: '',
        corrective_date: '',
        corrective_principal: '',
      },
      forminit: {},
      tableData: [{}],
      list: [],
      tableData1: [],
      resetData: [],
    }
  },
  created() {
    this.getTotal() // 在组件创建时调用getList方法获取数据
    this.getAnalyzeDetail()
    this.getUserAuth()
  },
  methods: {
    spanMethod({ row, column, rowIndex, columnIndex }) {
      if (column.property === 'name_zh') {
        return {
          rowspan: row._rowspan,
          colspan: 1,
        }
      }
    },

    getTotal() {
      this.getAnalyzeDetail()
      this.$request(api.baseUrl + '/Compliance/complianceIssues/getTotal', {
        name: this.formInline.name,
        issues_type: this.formInline.issues_type,
        issues_desc: this.formInline.issues_desc,
        suggest: this.formInline.issues_desc,
        corrective_date: this.formInline.corrective_date,
        corrective_principal: this.formInline.corrective_principal,
      }).then((r) => {
        const list = r.data
        if (list.finshIssues == 0 && list.totalIssues == 0) {
          const rate = 0
          const newrate = rate.toFixed(2)
          const updaterate = `${newrate}%`
          const newlist = {
            ...list,
            updaterate,
          }
          const arr = []
          arr.push(newlist)
          this.tableData1 = arr
          console.log(this.tableData1)
        } else {
          const rate = (list.finshIssues / list.totalIssues) * 100
          const newrate = rate.toFixed(2)
          const updaterate = `${newrate}%`
          const newlist = {
            ...list,
            updaterate,
          }
          const arr = []
          arr.push(newlist)
          this.tableData1 = arr
          //console.log(this.tableData1)
        }
      })
    },
    getAnalyzeDetail() {
      this.$request(api.baseUrl + '/Compliance/complianceIssues/getManufacturerAnalyzeDetail', {
        name: this.formInline.name,
        issues_type: this.formInline.issues_type,
        issues_desc: this.formInline.issues_desc,
        suggest: this.formInline.issues_desc,
        corrective_date: this.formInline.corrective_date,
        corrective_principal: this.formInline.corrective_principal,
      }).then((r) => {
        const data = r.data
        const updatedData = data.map((item) => {
          const gsl = (item.is_finsh_total / item.total) * 100
          item.gsl = gsl.toFixed(2)
          const updategsl = `${item.gsl}%`
          return {
            ...item,
            updategsl,
          }
        })
        this.tableData = updatedData.reduce((acc, cur, currentIndex) => {
          cur.issue_type.map((type, index) => {
            acc.push({
              ...cur,
              issue_type: type,
              _rowspan: index === 0 ? cur.issue_type.length : 0,
              index: currentIndex,
            })
          })
          return acc
        }, [])
        //console.log(this.tableData)
      })
    },
    //重置
    resetForm() {
      this.getAnalyze()
      this.formInline = _.cloneDeep(this.forminit)
      this.$request(api.baseUrl + '/Compliance/complianceIssues/getTotal').then((r) => {
        const resetData = r.data
        const newarr = []
        newarr.push(resetData)
        this.tableData1 = newarr
      })
    },
    getAnalyze() {
      this.$request(api.baseUrl + '/Compliance/complianceIssues/getManufacturerAnalyzeDetail').then((r) => {
        const data = r.data
        const updatedData = data.map((item) => {
          const gsl = (item.is_finsh_total / item.total) * 100
          item.gsl = gsl.toFixed(2)
          const updategsl = `${item.gsl}%`
          return {
            ...item,
            updategsl,
          }
        })
        this.tableData = updatedData.reduce((acc, cur, currentIndex) => {
          cur.issue_type.map((type, index) => {
            acc.push({
              ...cur,
              issue_type: type,
              _rowspan: index === 0 ? cur.issue_type.length : 0, // 设置行合并
              index: currentIndex,
            })
          })
          return acc
        }, [])
      })
    },

    getIssueTypeName(row) {
      const issueTypeMap = row.issue_type.join('<br/>')
      return issueTypeMap
    },

    // 获取当前页面用户拥有的操作权限的函数
    getUserAuth() {
      //获取当前页面用户拥有的操作权限的函数
      // this.userAuth = null
      this.$request(this.$api.checkMenuAuth, {
        resourcepath: this.$route.name,
      }).then((r) => {
        this.userAuth = r.data[0]
      })
    },
  },
  watch: {
    userAuth: {
      deep: true,
      handler(newV) {
        this.showAuth.m_add = newV.m_add == 'Y' ? true : false
        this.showAuth.m_search = newV.m_search == 'Y' ? true : false
        this.showAuth.m_del = newV.m_del == 'Y' ? true : false
        this.showAuth.m_updata = newV.m_updata == 'Y' ? true : false
        this.showAuth.m_import = newV.m_import == 'Y' ? true : false
        this.showAuth.m_export = newV.m_export == 'Y' ? true : false
        this.showAuth.m_upload = newV.m_upload == 'Y' ? true : false
        this.showAuth.m_audit = newV.m_audit == 'Y' ? true : false
        this.showAuth.m_print = newV.m_print == 'Y' ? true : false
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.resetbutton {
  position: relative;
  left: 1.8%;
}

.container {
  margin-top: 20px;
  width: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.table-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.table-description {
  font-size: 14px;
  color: #64748b;
}

.table-wrapper {
  overflow-x: auto;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  font-size: 14px;
  border: 1px solid #e2e8f0;
}

.custom-table thead {
  border-bottom: 2px solid #e2e8f0;
}

.custom-table th {
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #374151;
  border-right: 1px solid #e2e8f0;
  position: relative;
}

.custom-table th:last-child {
  border-right: none;
}

.custom-table th.main-header {
  font-weight: 700;
  color: #1e293b;
  text-align: center;
  border-bottom: 1px solid #e2e8f0;
}

.custom-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  vertical-align: top;
}

.custom-table td:last-child {
  border-right: none;
}

.custom-table tbody tr:hover {
  background-color: #f8fafc;
}

.custom-table tbody tr:nth-child(even) {
  background-color: #fefefe;
}

.custom-table tbody tr:nth-child(even):hover {
  background-color: #f8fafc;
}

.index-column {
  width: 80px;
  text-align: center;
  font-weight: 600;
  color: #64748b;
}

.manufacturer-column {
  width: 200px;
  font-weight: 500;
  color: #1e293b;
}

.issue-type {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

.issue-type.high {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.issue-type.medium {
  background: #fffbeb;
  color: #d97706;
  border: 1px solid #fed7aa;
}

.issue-type.low {
  background: #f0fdf4;
  color: #16a34a;
  border: 1px solid #bbf7d0;
}

.number-cell {
  text-align: right;
  font-weight: 600;
  color: #374151;
}

.rate-cell {
  text-align: right;
  font-weight: 600;
}

.rate-good {
  color: #16a34a;
}

.rate-medium {
  color: #d97706;
}

.rate-bad {
  color: #dc2626;
}

.loading {
  text-align: center;
  padding: 40px;
  color: #64748b;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #64748b;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background: #f0fdf4;
  color: #16a34a;
}

.status-inactive {
  background: #fef2f2;
  color: #dc2626;
}

@media (max-width: 768px) {
  .container {
    margin: 10px;
    border-radius: 4px;
  }

  .table-header {
    padding: 12px 16px;
  }

  .custom-table th,
  .custom-table td {
    padding: 8px 12px;
    font-size: 12px;
  }
}
</style>
