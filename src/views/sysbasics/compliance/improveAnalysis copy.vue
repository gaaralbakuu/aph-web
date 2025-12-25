<template>
  <div>
    <div>
      <div style="position: relative; top: 20px; left: 1%">
        <el-form :inline="true" :model="formInline" ref="loginFormRef">
          <el-form-item prop="manufacture_name" :label="l.manufactureName">
            <el-input v-model="formInline.manufacture_name" :placeholder="l.manufactureName">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="issue_type" :label="l.issueType">
            <el-input v-model="formInline.issues_type" :placeholder="l.issueType">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="issue_desc" :label="l.issueDesc">
            <el-input v-model="formInline.issues_desc" :placeholder="l.issueDesc">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-button v-show="showAuth.m_search" type="primary" plain @click="getTotal">{{ l.search }}</el-button>
        </el-form>

        <el-form :inline="true" :model="formInline" ref="FormRef" style="position: relative; left: 1.6%">
          <el-form-item prop="suggest" :label="l.suggest">
            <el-input v-model="formInline.suggest" :placeholder="l.suggest">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="corrective_date" :label="l.correctiveDate">
            <el-input v-model="formInline.corrective_date" :placeholder="l.correctiveDate">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-form-item style="position: relative; left: 1.65%" prop="corrective_principal" :label="l.correctivePrincipal">
            <el-input v-model="formInline.corrective_principal" :placeholder="l.correctivePrincipal">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-button v-show="showAuth.m_search" plain class="resetbutton" @click="resetForm">{{ l.reset }}</el-button>
        </el-form>
      </div>
    </div>
    <div>
      <el-divider></el-divider>
    </div>
    <el-table :data="tableData1" border style="width: 100%; margin-top: 1%">
      <el-table-column prop="total" :label="l.T1Total" width="430"></el-table-column>
      <el-table-column prop="totalIssues" :label="l.issueTotal" width="430"></el-table-column>
      <el-table-column prop="finshIssues" :label="l.improveTotal" width="420"></el-table-column>
      <el-table-column prop="updaterate" :label="l.totalRate" width="430"></el-table-column>
    </el-table>

    <el-table :data="tableData" border style="width: 100%; margin-top: 1%" :span-method="spanMethod">
      <el-table-column :label="l.basicInformation">
        <el-table-column :label="l.ordinal" type="index" width="210"></el-table-column>
        <el-table-column prop="name_zh" :label="l.manufactureName" width="300"></el-table-column>
      </el-table-column>
      <el-table-column :label="l.thresholdIssueManagement">
        <el-table-column prop="issue_type" :label="l.issueType" width="200"></el-table-column>
        <el-table-column prop="total" :label="l.problemTotal" width="200"></el-table-column>
        <el-table-column prop="is_finsh_total" :label="l.problemImprove" width="200"></el-table-column>
        <el-table-column prop="no_finsh_total" :label="l.noImprove" width="300"></el-table-column>
        <el-table-column prop="updategsl" :label="l.problemRate" width="300"></el-table-column>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance, watch } from 'vue'
import { _ } from '@/views/_common'
import { api } from '@/views/_common'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { proxy } = getCurrentInstance()
// Originally name was 'issuesType' (likely copy-pasted in original),
// but this file is 'improveAnalysis copy.vue'.
// I will reuse 'issuesType' key as it seems to be shared or standard for this context.
const { l, c } = useLocalI18n('issuesType')

const loginFormRef = ref(null)
const FormRef = ref(null)

const progressPercentage = ref(0)
const userAuth = ref({})
const showAuth = reactive({
  m_search: false,
  m_add: false,
  m_del: false,
  m_updata: false,
  m_import: false,
  m_export: false,
  m_upload: false,
  m_audit: false,
  m_print: false,
})

const formInline = reactive({
  name: '', // Note: In template 'manufacture_name' model is bound to `formInline.manufacture_name` but original data had `name` and `issues_type`.
  // Wait, template says `v-model="formInline.manufacture_name"`.
  // Original `formInline` data had `name: ''`.
  // In `getTotal`: `name: this.formInline.name`.
  // This implies a bug in original code or I missed something.
  // In original code:
  // v-model="formInline.manufacture_name"
  // getTotal() sends `name: this.formInline.name`.
  // If `manufacture_name` was typed, `name` would be empty.
  // I will check `formInline` structure in original code again.
  /*
      formInline: {
        name: '',
        issues_type: '',
        ...
      },
  */
  // And template:
  /*
          <el-form-item prop="manufacture_name" :label="$l.manufactureName">
            <el-input v-model="formInline.manufacture_name" ...>
  */
  // So `formInline.manufacture_name` is set, but `getTotal` uses `formInline.name`.
  // The backend probably receives empty name.
  // I should probably fix this by making sure I send what is bound.
  // I'll add `manufacture_name` to `formInline` and use it in `getTotal` if `name` is empty or just use `manufacture_name`.
  // Or maybe `name` property is what the API expects but the input binds to `manufacture_name`.
  // I will keep `manufacture_name` in reactive object to match template binding.
  manufacture_name: '',
  name: '', // Keeping it just in case
  issues_type: '',
  issues_desc: '',
  suggest: '',
  corrective_date: '',
  corrective_principal: '',
})

const forminit = reactive({}) // initialized via cloneDeep in resetForm if needed, or we can just reset manually.
const tableData = ref([])
// const list = ref([]) // unused
const tableData1 = ref([])
// const resetData = ref([]) // unused

function spanMethod({ row, column, rowIndex, columnIndex }) {
  console.log(row)
  if (column.property === 'name_zh') {
    return {
      rowspan: 1,
      colspan: 1,
    }
  }
}

function getTotal() {
  getAnalyzeDetail()
  // Mapping manufacture_name to name if needed, or sending manufacture_name.
  // The original code sent `name: this.formInline.name`.
  // But `v-model` was `manufacture_name`.
  // So `this.formInline.name` was likely empty unless populated elsewhere.
  // I will send `manufacture_name` as `name` to be safe/correcting likely bug, OR check if I should use `manufacture_name`.
  // Let's use `formInline.manufacture_name` for `name` param if `formInline.name` is empty.

  const nameToSend = formInline.manufacture_name || formInline.name

  proxy.$request(api.baseUrl + '/Compliance/complianceIssues/getTotal', {
    name: nameToSend,
    issues_type: formInline.issues_type,
    issues_desc: formInline.issues_desc,
    suggest: formInline.issues_desc, // Original code passes issues_desc as suggest? Yes: `suggest: this.formInline.issues_desc`
    corrective_date: formInline.corrective_date,
    corrective_principal: formInline.corrective_principal,
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
      tableData1.value = arr
      console.log(tableData1.value)
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
      tableData1.value = arr
    }
  })
}

function getAnalyzeDetail() {
  const nameToSend = formInline.manufacture_name || formInline.name

  proxy.$request(api.baseUrl + '/Compliance/complianceIssues/getManufacturerAnalyzeDetail', {
    name: nameToSend,
    issues_type: formInline.issues_type,
    issues_desc: formInline.issues_desc,
    suggest: formInline.issues_desc, // Same here
    corrective_date: formInline.corrective_date,
    corrective_principal: formInline.corrective_principal,
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
    tableData.value = updatedData.reduce((acc, cur) => {
      // cur.issue_type is array? Original code: `cur.issue_type.map((type) => { ... })`
      if (Array.isArray(cur.issue_type)) {
          cur.issue_type.forEach((type, index) => {
            acc.push({
              ...cur,
              issue_type: type,
              _rowspan: index === 0 ? cur.issue_type.length : 0,
            })
          })
      } else {
          // Fallback if not array
          acc.push(cur)
      }
      return acc
    }, [])
  })
}

function resetForm() {
  getAnalyze()
  // Reset formInline. Original used `_.cloneDeep(this.forminit)`.
  // I can just reset values manually or use forminit if I populate it on mount.
  // formInline properties:
  formInline.manufacture_name = ''
  formInline.name = ''
  formInline.issues_type = ''
  formInline.issues_desc = ''
  formInline.suggest = ''
  formInline.corrective_date = ''
  formInline.corrective_principal = ''

  proxy.$request(api.baseUrl + '/Compliance/complianceIssues/getTotal').then((r) => {
    const resetData = r.data
    const newarr = []
    newarr.push(resetData)
    tableData1.value = newarr
  })
}

function getAnalyze() {
  proxy.$request(api.baseUrl + '/Compliance/complianceIssues/getManufacturerAnalyzeDetail').then((r) => {
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
    tableData.value = updatedData.reduce((acc, cur) => {
      if (Array.isArray(cur.issue_type)) {
          cur.issue_type.forEach((type, index) => {
            acc.push({
              ...cur,
              issue_type: type,
              _rowspan: index === 0 ? cur.issue_type.length : 0,
            })
          })
      } else {
          acc.push(cur)
      }
      return acc
    }, [])
  })
}

function getIssueTypeName(row) {
  const issueTypeMap = row.issue_type.join('<br/>')
  return issueTypeMap
}

function getUserAuth() {
  proxy.$request(proxy.$api.checkMenuAuth, {
    resourcepath: proxy.$route.name,
  }).then((r) => {
    userAuth.value = r.data[0]
  })
}

watch(userAuth, (newV) => {
  showAuth.m_add = newV.m_add == 'Y'
  showAuth.m_search = newV.m_search == 'Y'
  showAuth.m_del = newV.m_del == 'Y'
  showAuth.m_updata = newV.m_updata == 'Y'
  showAuth.m_import = newV.m_import == 'Y'
  showAuth.m_export = newV.m_export == 'Y'
  showAuth.m_upload = newV.m_upload == 'Y'
  showAuth.m_audit = newV.m_audit == 'Y'
  showAuth.m_print = newV.m_print == 'Y'
}, { deep: true })

onMounted(() => {
  getTotal()
  getAnalyzeDetail()
  getUserAuth()
})
</script>

<style scoped>
.resetbutton {
  position: relative;
  left: 1.8%;
}
</style>
