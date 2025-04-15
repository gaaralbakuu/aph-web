<template>
  <div>
    <div>
      <div style="position: relative; top: 20px; left: 1%">
        <el-form :inline="true" :model="formInline" ref="loginFormRef">
          <el-form-item prop="manufacture_name" :label="$l.manufactureName">
            <el-input
              v-model="formInline.manufacture_name"
              :placeholder="$l.manufactureName"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i
            ></el-input>
          </el-form-item>
          <el-form-item prop="issue_type" :label="$l.issueType">
            <el-input
              v-model="formInline.issues_type"
              :placeholder="$l.issueType"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i
            ></el-input>
          </el-form-item>
          <el-form-item prop="issue_desc" :label="$l.issueDesc">
            <el-input
              v-model="formInline.issues_desc"
              :placeholder="$l.issueDesc"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i
            ></el-input>
          </el-form-item>
          <el-button
            v-show="showAuth.m_search"
            type="primary"
            plain
            @click="getTotal"
            >{{ $l.search }}</el-button
          >
        </el-form>

        <el-form
          :inline="true"
          :model="formInline"
          ref="FormRef"
          style="position: relative; left: 1.6%"
        >
          <el-form-item prop="suggest" :label="$l.suggest">
            <el-input v-model="formInline.suggest" :placeholder="$l.suggest">
              <i slot="prefix" class="el-input__icon el-icon-search"></i
            ></el-input>
          </el-form-item>
          <el-form-item prop="corrective_date" :label="$l.correctiveDate">
            <el-input
              v-model="formInline.corrective_date"
              :placeholder="$l.correctiveDate"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i
            ></el-input>
          </el-form-item>
          <el-form-item
            style="position: relative; left: 1.65%"
            prop="corrective_principal"
            :label="$l.correctivePrincipal"
          >
            <el-input
              v-model="formInline.corrective_principal"
              :placeholder="$l.correctivePrincipal"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i
            ></el-input>
          </el-form-item>
          <el-button
            v-show="showAuth.m_search"
            plain
            class="resetbutton"
            @click="resetForm"
            >{{ $l.reset }}</el-button
          >
        </el-form>
      </div>
    </div>
    <div>
      <el-divider></el-divider>
    </div>
    <el-table :data="tableData1" border style="width: 100%; margin-top: 1%">
      <el-table-column
        prop="total"
        :label="$l.T1Total"
        width="430"
      ></el-table-column>
      <el-table-column
        prop="totalIssues"
        :label="$l.issueTotal"
        width="430"
      ></el-table-column>
      <el-table-column
        prop="finshIssues"
        :label="$l.improveTotal"
        width="420"
      ></el-table-column>
      <el-table-column prop="updaterate" :label="$l.totalRate" width="430">
      </el-table-column>
    </el-table>

    <el-table :data="tableData" border style="width: 100%; margin-top: 1%">
      <el-table-column :label="$l.basicInformation">
        <el-table-column
          :label="$l.ordinal"
          type="index"
          width="210"
        ></el-table-column>
        <el-table-column
          prop="name_zh"
          :label="$l.manufactureName"
          width="300"
        ></el-table-column>
      </el-table-column>
      <el-table-column :label="$l.thresholdIssueManagement">
        <el-table-column
          :label="$l.issueType"
          width="200"
        >
          <template slot-scope="scope">
            <!-- {{ getIssueTypeName(scope.row) }} -->
            <span
                  v-html="getIssueTypeName(scope.row.detail)"
                >
                </span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="issue_type"
          :label="$l.issueType"
          width="200"
        ></el-table-column> -->
        <el-table-column
          prop="total"
          :label="$l.problemTotal"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="is_finsh_total"
          :label="$l.problemImprove"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="no_finsh_total"
          :label="$l.noImprove"
          width="300"
        ></el-table-column>
        <el-table-column
          prop="updategsl"
          :label="$l.problemRate"
          width="300"
        ></el-table-column>
      </el-table-column>
    </el-table>
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
      this.$request(
        api.baseUrl +
          '/Compliance/complianceIssues/getManufacturerAnalyzeDetail',
        {
          name: this.formInline.name,
          issues_type: this.formInline.issues_type,
          issues_desc: this.formInline.issues_desc,
          suggest: this.formInline.issues_desc,
          corrective_date: this.formInline.corrective_date,
          corrective_principal: this.formInline.corrective_principal,
        }
      ).then((r) => {
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
        this.tableData = updatedData
        //console.log(this.tableData)
      })
    },
    //重置
    resetForm() {
      this.getAnalyze()
      this.formInline = _.cloneDeep(this.forminit)
      this.$request(api.baseUrl + '/Compliance/complianceIssues/getTotal').then(
        (r) => {
          const resetData = r.data
          const newarr = []
          newarr.push(resetData)
          this.tableData1 = newarr
        }
      )
    },
    getAnalyze() {
      this.$request(
        api.baseUrl +
          '/Compliance/complianceIssues/getManufacturerAnalyzeDetail'
      ).then((r) => {
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
        this.tableData = updatedData
      })
    },

    getIssueTypeName(row){
      if(row && row.length > 0){
        return row.map(item => item["issue_type"]).join('<br/>');
      }
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
</style>
  