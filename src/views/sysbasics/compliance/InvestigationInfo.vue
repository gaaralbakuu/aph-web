<template>
  <div class="app-container" v-loading="pageLoading">
    <!-- 查询 -->

    <div>
      <el-button type="success" @click="backInvestigation">{{ l.backToPreviousPage }}</el-button>
    </div>
    <!-- 内容 -->
    <div>
      <div style="margin-top: 10px">
        <!-- 表格 -->
        <el-table :data="tableList.list" style="width: 100%" highlight-current-row>
          <el-table-column :label="l.basicInformation">
            <el-table-column v-for="(item, index) in tableList.columns1" :key="index" :prop="item.key" :label="item.title || item.key" :width="item.width" show-overflow-tooltip>
              <template #default="scope">
                <span v-if="item.key === 'address'" :title="scope.row[item.key]" class="truncate-lines" v-html="scope.row[item.key]"></span>
                <span v-else>
                  {{ scope.row[item.key] }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="l.complianceContactInfor">
            <el-table-column v-for="(item, index) in tableList.columns2" :key="index" :prop="item.key" :label="item.title" :width="item.width" show-overflow-tooltip>
              <template #default="scope">
                <span v-if="item.key === 'contact_name'" :title="scope.row[item.key]" class="truncate-lines" v-html="scope.row[item.key]"></span>
                <span v-else-if="item.key === 'contact_phone'" :title="scope.row[item.key]" class="truncate-lines" v-html="scope.row[item.key]"></span>
                <span v-else-if="item.key === 'contact_email'" :title="scope.row[item.key]" class="truncate-lines" v-html="scope.row[item.key]"></span>
                <span v-else>
                  {{ scope.row[item.key] }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="l.seaAudit">
            <el-table-column v-for="(item, index) in tableList.columns4" :key="index" :prop="item.key" :label="item.title" :width="item.width" show-overflow-tooltip>
              <template #default="scope">
                <el-button v-if="item.key === 'audit_file'" type="text" size="small" @click="clickViewFile(scope.row)" style="color: orange">
                  {{ l.viewFile }}
                </el-button>
                <span v-else-if="item.formatter" v-html="item.formatter(scope.row[item.key])"></span>
                <span v-else-if="item.key === 'is_submit_cap'">
                  {{ scope.row.is_submit_cap == 'Y' ? l.yes : l.no }}
                </span>
                <span v-else>
                  {{ scope.row[item.key] }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column fixed="right" :label="c.operation" width="170">
            <template #default="scope">
              <el-button @click="checkClick(scope.row, scope.$index)" type="text" size="small">{{ c.check }}</el-button>

              <el-button v-show="showAuth.m_audit && scope.row.rec_status === -1" @click="auditNew(scope.row, scope.$index)" type="text" size="small" style="color: green">{{ l.newOrder }}</el-button>
              <el-button v-show="showAuth.m_audit && scope.row.rec_status === 1" @click="auditClick(scope.row, scope.$index)" type="text" size="small" style="color: orange">{{ l.audit }}</el-button>
              <el-button v-show="showAuth.m_audit && scope.row.rec_status === 7" @click="invalid(scope.row, scope.$index)" type="text" size="small" style="color: red">{{ l.cancelAudit }}</el-button>
              <el-button v-show="showAuth.m_audit && scope.row.rec_status === 7" @click="auditClose(scope.row, scope.$index)" type="text" size="small" style="color: green">{{ l.end }}</el-button>
            </template>
          </el-table-column>
        </el-table>

        <z-pagination :pagination="pagination" :total="tableList.total" v-model:page="tableList.curPage" v-model:limit="tableList.pageSize" @change="getList"></z-pagination>

        <z-form-dialog :data="auditSurvey.list" :formProps="auditSurvey.formProps" :fields="auditSurvey.fields1" @submmit="submitAudit" v-model:visible="auditFormsVisible"></z-form-dialog>

        <!-- 审核 -->
        <z-form-dialog :data="auditSurvey.list" :formProps="auditSurvey.formProps" :fields="auditSurvey.fields" @submmit="submitAudit" v-model:visible="auditFormVisible"></z-form-dialog>

        <!-- 查看 -->
        <el-dialog width="80%" :lock-scroll="true" v-model:visible="checkFormVisible" custom-class="custom-dialog">
          <div style="padding: 0 50px">
            <div>
              <el-form :model="checkSurvey.list">
                <el-col :span="24">
                  <el-form-item :label="l.basicInformation"></el-form-item>
                </el-col>

                <el-form-item :label="l.basicArchives">
                  <el-col :span="8">
                    <el-input v-model="checkSurvey.list.name_zh"></el-input>
                  </el-col>
                </el-form-item>

                <el-col :span="24">
                  <el-form-item :label="l.seaAudit"></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="l.dueAuditDate">
                    <el-date-picker v-model="checkSurvey.list.due_audit_date" type="date" :placeholder="l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd" style="width: 300px"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="l.costPayProgress">
                    <el-input v-model="checkSurvey.list.cost_pay_progress" :placeholder="l.pleaseEnterTheAuditResult"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="l.realAuditDate">
                    <el-date-picker v-model="checkSurvey.list.real_audit_date" type="date" :placeholder="l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd" style="width: 300px"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="l.isSubmitCap">
                    <el-radio v-model="checkSurvey.list.is_submit_cap" label="Y">{{ l.yes }}</el-radio>
                    <el-radio v-model="checkSurvey.list.is_submit_cap" label="N">{{ l.no }}</el-radio>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item :label="l.auditFile"></el-form-item>
                </el-col>
              </el-form>
            </div>
            <div>
              <!-- 文件表格 -->
              <el-table :data="checkSurvey.fileList" style="width: 90%">
                <el-table-column v-for="(item, index) in checkSurvey.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                <el-table-column fixed="right" :label="c.operation" width="145">
                  <template #default="scope">
                    <el-button @click="getFilePreview(scope.row.file_url)" type="text" size="small">{{ c.check }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-dialog>

        <!-- 查看附件 -->
        <el-dialog width="50%" :title="l.chenck_attachment" :lock-scroll="true" v-model:visible="viewFileFormVisible" custom-class="custom-dialog">
          <div style="padding: 0 50px">
            <!-- 文件表格 -->
            <el-table :data="checkFile.fileList" style="width: 100%">
              <el-table-column v-for="(item, index) in checkFile.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
              <el-table-column fixed="right" :label="c.operation" width="100">
                <template #default="scope">
                  <el-button @click="getFilePreview(scope.row.file_url)" type="text" size="small">{{ c.check }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-dialog>
      </div>
    </div>

    <!-- 预览 -->
    <filePreviews v-if="fileUrl" :file-url="fileUrl" :visible="dialogVisible" @update:visible="dialogVisible = $event" />
  </div>
</template>
<script setup>
import { reactive, ref, computed, onMounted, getCurrentInstance, watch } from 'vue'
import { _ } from '@/views/_common'
import { api } from '@/views/_common'
import { initFuncs } from '@/views/_common'
import { zForm } from '@/views/_common'
import { zFormDialog } from '@/views/_common'
import { zPagination } from '@/views/_common'
import { zTable } from '@/views/_common'
import filePreviews from '../../_common/filePreviews.vue'
import { useLocalI18n } from '@/composables/useLocalI18n'
import { useRouter, useRoute } from 'vue-router'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('investigation')
const store = proxy.$store
const router = useRouter() || proxy.$router
const route = useRoute() || proxy.$route

const pageLoading = ref(false)
const checkFormVisible = ref(false)
const selectFormVisible = ref(false)
const auditFormVisible = ref(false)
const auditFormsVisible = ref(false)
const viewFileFormVisible = ref(false)
const dialogVisible = ref(false)
const file_url = ref('')
const file_name = ref('')
const file_suffix = ref('')
const fileUrl = ref(null)
const isImage = ref(false)
const isPdf = ref(false)
const isText = ref(false)
const fileContent = ref('')
const deleteFalg = ref('N')
const fileInfo = reactive({})
const userAuth = ref([])
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

const formProps = reactive({
  dialogWidth: '80%',
  labelWidth: '160px',
})

const pagination = reactive({
  layout: 'prev, pager, next, jumper, ->, total,sizes',
  pagerCount: 7,
  pageSizes: [10, 15, 20, 30, 40, 50, 100],
})

const queryList = reactive({
  manufacture_name: '',
  manufacture_id: '',
  address: '',
  requestor_facility_type: '',
  name: '',
  audit_time: '',
  rec_status: null,
})

const fileList = ref([])

const rec_status = computed(() => [
  {
    label: l.value.cancelAudit,
    value: 0,
  },
  {
    label: l.value.newOrder,
    value: 1,
  },
  {
    label: l.value.audit,
    value: 7,
  },
  {
    label: l.value.end,
    value: 99,
  },
])

// Formatters
const formatterRec = (row) => {
  const found = rec_status.value.find((e) => e.value == row)
  if (found) {
    return found.label
  }
}

const tableList = reactive({
  list: [],
  pageSize: 15,
  curPage: 1,
  total: 0,
  columns1: computed(() => [
    {
      title: '调查年份',
      key: 'survey_year',
      width: 100,
    },
    {
      title: l.value.nameZh,
      key: 'name_zh',
      width: 120,
    },
    {
      title: l.value.address,
      key: 'address',
      width: 150,
    },
    {
      title: l.value.requestorFacilityType,
      key: 'requestor_facility_type',
      width: 130,
    },
  ]),
  columns2: computed(() => [
    {
      title: l.value.name,
      key: 'contact_name',
      width: 80,
    },
    {
      title: l.value.contactPhone,
      key: 'contact_phone',
      width: 100,
    },
    {
      title: l.value.contactEmail,
      key: 'contact_email',
      width: 190,
    },
  ]),
  columns4: computed(() => [
    {
      title: l.value.dueAuditDate,
      key: 'due_audit_date',
      width: 140,
    },
    {
      title: l.value.costPayProgress,
      key: 'cost_pay_progress',
      width: 120,
    },
    {
      title: l.value.realAuditDate,
      key: 'real_audit_date',
      width: 140,
    },
    {
      title: l.value.recStatus,
      key: 'rec_status',
      width: 100,
      formatter: formatterRec,
    },
    {
      title: l.value.auditFile,
      key: 'audit_file',
      width: 80,
    },
    {
      title: l.value.isSubmitCap,
      key: 'is_submit_cap',
      width: 140,
    },
  ]),
})

const checkSurvey = reactive({
  list: {},
  fileList: [],
  fields1: computed(() => [
    {
      title: l.value.nameZh,
      key: 'name_zh',
      props: {
        disabled: true,
      },
      span: 8,
    },
    {
      title: l.value.address,
      key: 'address',
      props: {
        disabled: true,
      },
      span: 8,
    },
    {
      title: l.value.requestorFacilityType,
      key: 'name_zh',
      props: {
        disabled: true,
      },
      span: 8,
    },
    {
      title: l.value.name,
      key: 'contact_name',
      props: {
        disabled: true,
      },
      span: 8,
    },
    {
      title: l.value.contactPhone,
      key: 'contact_phone',
      props: {
        disabled: true,
      },
      span: 8,
    },
    {
      title: l.value.contactEmail,
      key: 'contact_email',
      props: {
        disabled: true,
      },
      span: 8,
    },
    {
      title: l.value.auditDate,
      key: 'audit_time',
      props: {
        disabled: true,
      },
      name: 'date',
      span: 8,
    },
    {
      title: l.value.auditResult,
      key: 'aduit_result',
      props: {
        disabled: true,
      },
      span: 8,
    },
    {
      title: l.value.dueAuditDate,
      key: 'due_audit_date',
      props: {
        disabled: true,
      },
      name: 'date',
      span: 8,
    },
    {
      title: l.value.costPayProgress,
      key: 'cost_pay_progress',
      props: {
        disabled: true,
      },
      span: 8,
    },
    {
      title: l.value.realAuditDate,
      key: 'real_audit_date',
      props: {
        disabled: true,
      },
      name: 'date',
      span: 8,
    },
    {
      title: l.value.auditResult,
      key: 'vehicleStime',
      props: {
        disabled: true,
      },
      span: 8,
    },
    {
      title: l.value.isSubmitCap,
      key: 'is_submit_cap',
      props: {
        disabled: true,
      },
      span: 8,
    },
  ]),
  columns: computed(() => [
    {
      title: l.value.fileName,
      key: 'file_name',
      width: 220,
    },
    {
      title: l.value.fileSuffix,
      key: 'file_suffix',
      width: 140,
    },
    {
      title: l.value.createUser,
      key: 'create_user',
      width: 140,
    },
    {
      title: l.value.createTime,
      key: 'create_time',
      width: 140,
    },
    {
      title: l.value.modifyUser,
      key: 'modify_user',
      width: 140,
    },
    {
      title: l.value.modifyTime,
      key: 'modify_time',
      width: 140,
    },
  ]),
})

const checkFile = reactive({
  list: {},
  fileList: [],
  columns: computed(() => [
    {
      title: l.value.fileName,
      key: 'file_name',
      width: 260,
    },
    {
      title: l.value.fileSuffix,
      key: 'file_suffix',
      width: 140,
    },
    {
      title: l.value.createUser,
      key: 'create_user',
      width: 120,
    },
    {
      title: l.value.createTime,
      key: 'create_time',
      width: 140,
    },
    {
      title: l.value.modifyUser,
      key: 'modify_user',
      width: 120,
    },
    {
      title: l.value.modifyTime,
      key: 'modify_time',
      width: 140,
    },
  ]),
})

const manufacture = reactive({
  list: [],
  queryString: '',
  columns: computed(() => [
    {
      title: l.value.manufactureId,
      key: 'manufacture_id',
      width: 100,
    },
    {
      title: l.value.manufacturerName,
      key: 'name_zh',
      width: 100,
    },
    {
      title: l.value.manufacturerNameEn,
      key: 'name_en',
      width: 100,
    },
    {
      title: l.value.manufacturerAddress,
      key: 'address',
      width: 100,
    },
    {
      title: l.value.namlegalPersoneEn,
      key: 'legal_person',
      width: 100,
    },
    {
      title: l.value.contactName,
      key: 'contact_name',
      width: 100,
    },
    {
      title: l.value.contactPhone,
      key: 'contact_phone',
      width: 100,
    },
    {
      title: l.value.contactEmail,
      key: 'contact_email',
      width: 100,
    },
    {
      title: l.value.contactJobTitle,
      key: 'contact_job_title',
      width: 100,
    },
    {
      title: l.value.country,
      key: 'country',
      width: 100,
    },
    {
      title: l.value.customsNumber,
      key: 'customs_number',
      width: 100,
    },
    {
      title: l.value.requestorFacilityType,
      key: 'requestor_facility_type',
      width: 100,
    },
  ]),
})

const auditSurvey = reactive({
  list: {},
  formProps: {
    dialogWidth: '40%',
    labelWidth: '150px',
  },
  fields: computed(() => [
    {
      title: l.value.auditResult,
      key: 'rec_status',
      name: 'select',
      value: 'value',
      label: 'label',
      options: [
        {
          value: 7,
          label: l.value.pass,
        },
        {
          value: -1,
          label: l.value.fail,
        },
      ],
      span: 18,
    },
    {
      title: l.value.auditRemarks,
      key: 'audit_result',
      name: 'textarea',
      span: 18,
    },
  ]),
  fields1: computed(() => [
    {
      title: l.value.auditRemarks,
      key: 'audit_result',
      name: 'textarea',
      span: 18,
    },
  ]),
})

// Methods
const getList = () => {
  console.log(queryList)
  proxy
    .$request(api.baseUrl + '/Compliance/complianceSurvey/getManufacturerHisList', queryList)
    .then((r) => {
      tableList.list = r.data
      // tableList.total = r.data.total
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const submitForm = () => {
  console.log(queryList)
  getList()
}

const getManufacturerList = () => {
  proxy
    .$request(api.baseUrl + '/Compliance/complianceManufacturer/getlist', {})
    .then((r) => {
      console.log(r)
      manufacture.list = r.data.list
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const checkClick = (row, index) => {
  pageLoading.value = true
  checkSurvey.list = _.cloneDeep(row)
  checkviewFile(row.survey_id)
    .then((r) => {
      console.log(r)
      if (r.data && r.data.length == 0) {
        checkFormVisible.value = true
        pageLoading.value = false
      } else {
        const processedFiles = r.data.map((file) => {
          const { file_url: url, file_name: name, file_type: type } = file
          file_name.value = name
          file_url.value = url
          // file_type.value = type
          const fileExtension = getFileExtension(name)
          return {
            ...file,
            file_suffix: fileExtension,
            attachment_type: '1',
          }
        })
        checkSurvey.fileList = processedFiles
        checkFormVisible.value = true
        pageLoading.value = false
      }
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const historyClick = (row, index) => {
  console.log(row)
}

const submmitfile = (addList, fileList) => {
  console.log(addList)
  console.log(fileList)
  const formData = new FormData()
  formData.append('file', fileList[0])
  formData.append('attachment_type', addList[0].attachment_type)
  let r = proxy.$request(api.baseUrl + '/Compliance/complianceAttachments/uploadAttachment', formData, 'post')
  return r
}

const removeEditFile = (row, index) => {
  console.log(row)
  let i = index + 1
  proxy
    .$confirm('此操作将删除第' + i + '条数据, 是否继续?', '删除帮助手册', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      proxy
        .$request(
          api.baseUrl + '/Compliance/complianceAttachments/deleteAttchment',
          {
            key: row.id,
            value: deleteFalg.value,
          },
          'post'
        )
        .then((r) => {
          proxy.$message({
            type: 'success',
            message: '删除成功',
          })
          // getList()
        })
        .catch(() => {
          proxy.$message({
            type: 'error',
            message: '删除失败',
          })
        })
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: '取消删除',
      })
    })
}

const resetForm = () => {
  console.log('ccc')
  Object.keys(queryList).forEach((key) => {
    queryList[key] = ''
  })
}

const file = (fileList) => {
  return new Promise((resolve, reject) => {
    const fileInfos = []

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      const file_name = file.name
      const fileExtension = getFileExtension(file_name)
      const reader = new FileReader()

      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1]
        const fileInfo = {
          file_name: file_name,
          file_suffix: fileExtension,
          attachment_type: 1,
          create_user: '63377',
          create_time: Date.now(),
          modify_user: '63377',
          modify_time: Date.now(),
          fileContent: base64String,
        }
        fileInfos.push(fileInfo)

        if (fileInfos.length === fileList.length) {
          resolve(fileInfos)
        }
      }

      reader.onerror = (error) => {
        reject(error)
      }

      reader.readAsDataURL(file)
    }
  })
}

const getFileExtension = (file_name) => {
  return file_name.slice(Math.max(0, file_name.lastIndexOf('.')) || Infinity)
}

const auditClick = (row, index) => {
  auditSurvey.list = {}
  let auditClone = _.cloneDeep(row)
  auditFlag(auditClone, auditClone.rec_status)
}

const auditNew = (row, index) => {
  auditSurvey.list = {}
  let auditClone = _.cloneDeep(row)
  auditFlags(auditClone, 1)
}

const invalid = (row, index) => {
  auditSurvey.list = {}
  let auditClone = _.cloneDeep(row)
  auditFlags(auditClone, 1)
}

const auditClose = (row, index) => {
  auditSurvey.list = {}
  let auditClone = _.cloneDeep(row)
  auditFlags(auditClone, 99)
}

const auditFlag = (row, i) => {
  // proxy.$set(auditSurvey.list, 'survey_id', row.survey_id)
  auditSurvey.list.survey_id = row.survey_id
  auditFormVisible.value = true
}

const auditFlags = (row, i) => {
  auditSurvey.list.survey_id = row.survey_id
  console.log(row.rec_status)
  console.log(i)
  auditSurvey.list.rec_status = i
  auditFormsVisible.value = true
}

const submitAudit = () => {
  console.log(auditSurvey.list)
  if (!auditSurvey.list.rec_status && auditSurvey.list.rec_status == null) {
    proxy.$message({
      type: 'info',
      message: '请选择审核结果',
    })
  }
  proxy
    .$confirm('正在审核该数据, 是否继续?', '尽职调查', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(() => {
      proxy
        .$request(api.baseUrl + '/Compliance/complianceSurvey/auditSurvey', auditSurvey.list, 'post')
        .then((r) => {
          console.log(r)
          proxy.$message({
            type: 'success',
            message: '审核成功',
          })
          getList()
          auditSurvey.list = {}
          auditFormVisible.value = false
          auditFormsVisible.value = false
        })
        .catch(() => {
          proxy.$message({
            type: 'info',
            message: '审核失败',
          })
        })
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: '取消审核',
      })
    })
}

const checkviewFile = (id) => {
  let r = proxy.$request(api.baseUrl + '/Compliance/complianceAttachments/checkManufacturerAttachments', {
    id: id,
    file_type: 1,
  })
  return r
}

const clickViewFile = (row) => {
  viewFileFormVisible.value = true
  checkviewFile(row.survey_id)
    .then((r) => {
      const processedFiles = r.data.map((file) => {
        const { file_url: url, file_name: name, file_type: type } = file
        file_name.value = name
        file_url.value = url
        // file_type.value = type
        const fileExtension = getFileExtension(name)
        return {
          ...file,
          file_suffix: fileExtension,
          attachment_type: '1',
        }
      })
      checkFile.fileList = processedFiles

      pageLoading.value = false
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const viewFile = (id) => {
  console.log(id)
  pageLoading.value = true

  proxy
    .$request(api.baseUrl + '/Compliance/complianceAttachments/checkManufacturerAttachments', {
      id: id,
      file_type: 1,
    })
    .then((r) => {
      console.log(r)
      if (r.data.length == 0) {
        pageLoading.value = false
        return proxy.$message({
          type: 'info',
          message: '暂无文件',
        })
      }
      const { file_url: url, file_name: name, file_type: type } = r.data[0]
      file_name.value = name
      file_url.value = url
      // file_type.value = type
      console.log(url)
      getFilePreview(url)

      pageLoading.value = false
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const getFilePreview = (url) => {
  console.log(url)
  const urls = api.baseUrl + '/' + url
  fileUrl.value = urls
  dialogVisible.value = true
}

const backInvestigation = () => {
  // Vue 2.7 or with vuex setup might differ, ensuring compatibility
  if (store.dispatch) {
    store.dispatch('delView', router.currentRoute).then(({ visitedViews }) => {
      router.push('/compliance/investigation').catch(() => {})
    })
  } else {
    // Fallback if store dispatch is not available directly or structure is different
    router.push('/compliance/investigation').catch(() => {})
  }
}

const getUserAuth = () => {
  proxy
    .$request(proxy.$api.checkMenuAuth, {
      resourcepath: route.name,
    })
    .then((r) => {
      userAuth.value = r.data[0]
    })
}

onMounted(() => {
  console.log(route.query.manufacture_id)
  queryList.manufacture_id = route.query.manufacture_id
  getList()
  getUserAuth()
})

watch(
  userAuth,
  (newV) => {
    showAuth.m_add = newV.m_add == 'Y'
    showAuth.m_search = newV.m_search == 'Y'
    showAuth.m_del = newV.m_del == 'Y'
    showAuth.m_updata = newV.m_updata == 'Y'
    showAuth.m_import = newV.m_import == 'Y'
    showAuth.m_export = newV.m_export == 'Y'
    showAuth.m_upload = newV.m_upload == 'Y'
    showAuth.m_audit = newV.m_audit == 'Y'
    showAuth.m_print = newV.m_print == 'Y'
  },
  { deep: true }
)
</script>
<style scoped>
.truncate-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
