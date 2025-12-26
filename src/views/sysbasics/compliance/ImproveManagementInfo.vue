<template>
  <div class="app-container" v-loading="pageLoading">
    <div>
      <el-button type="success" @click="backInvestigation">{{ l.backToPreviousPage }}</el-button>
      <el-button type="success" @click="getList">{{ l.refresh }}</el-button>
    </div>
    <!-- 内容 -->
    <div>
      <div style="margin-top: 10px">
        <!-- 表格 -->
        <el-table :data="tableList.list" style="width: 100%" highlight-current-row>
          <el-table-column :label="l.issueBasicInfo">
            <el-table-column v-for="(item, index) in tableList.columns1" :key="index" :prop="item.key" :label="item.title || item.key" :width="item.width" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="item.key === 'serialNumbers'">
                  {{ scope.$index + 1 }}
                </span>
                <span v-else>
                  {{ scope.row[item.key] }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="l.t1SubconCap">
            <el-table-column v-for="(item, index) in tableList.columns2" :key="index" :prop="item.key" :label="item.title" :width="item.width" show-overflow-tooltip></el-table-column>
          </el-table-column>
          <el-table-column :label="l.lt1FactoryVerification">
            <el-table-column v-for="(item, index) in tableList.columns3" :key="index" :prop="item.key" :label="item.title" :width="item.width" show-overflow-tooltip></el-table-column>
          </el-table-column>

          <el-table-column fixed="right" :label="l.operation" width="170">
            <template slot-scope="scope">
              <el-button @click="audit(scope.row, scope.$index)" type="text" size="small">{{ l.audit }}</el-button>

              <el-button @click="getHisList(scope.row, scope.$index)" type="text" size="small">{{ l.viewHistory }}</el-button>
            </template>
          </el-table-column>
        </el-table>

        <z-pagination :pagination="pagination" :total="tableList.total" :page.sync="tableList.curPage" :limit.sync="tableList.pageSize" @change="getList"></z-pagination>

        <!-- 查看 -->
      </div>
    </div>

    <!-- 预览 -->
    <filePreviews v-if="fileUrl" :file-url="fileUrl" :visible="dialogVisible" @update:visible="dialogVisible = $event" />

    <el-dialog :title="l.auditResult" :visible.sync="visible.passForm" width="30%">
      <el-form>
        <el-form-item :label="l.results" :label-width="formLabelWidth">
          <el-radio-group v-model="check.rec_status">
            <el-radio v-model="check.rec_status" label="7">
              {{ l.pass }}
            </el-radio>
            <el-radio v-model="check.rec_status" label="-1">
              {{ l.fail }}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="l.capCompleted" :label-width="formLabelWidth">
          <el-radio-group v-model="check.is_finish">
            <el-radio v-model="check.is_finish" label="Y">{{ l.completed }}</el-radio>
            <el-radio v-model="check.is_finish" label="N">{{ l.notCompleted }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="l.verificationDetails" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="check.verify_detail" :placeholder="l.verificationDetailsPlaceholder"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible.passForm = false">{{ l.cancel }}</el-button>
        <el-button type="primary" @click="passsubmit">{{ l.submit }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script setup>
import { reactive, ref, computed, onMounted, getCurrentInstance } from 'vue'
import { _ } from '@/views/_common'
import { api } from '@/views/_common'
import { initFuncs } from '@/views/_common'
import { zForm } from '@/views/_common'
import { zFormDialog } from '@/views/_common'
import { zPagination } from '@/views/_common'
import { zTable } from '@/views/_common'
import filePreviews from '../../_common/filePreviews.vue'
import { useLocalI18n } from '@/composables/useLocalI18n'
import { useRouter, useRoute } from 'vue-router/composables'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('improveManagementInfo') // Assuming correct namespace
const store = proxy.$store
const router = useRouter() || proxy.$router
const route = useRoute() || proxy.$route

const pageLoading = ref(false)
const checkFormVisible = ref(false)
const selectFormVisible = ref(false)
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
const formLabelWidth = ref('120px')

const formProps = reactive({
  dialogWidth: '80%',
  labelWidth: '160px',
})

const check = reactive({})

const pagination = reactive({
  layout: 'prev, pager, next, jumper, ->, total,sizes',
  pagerCount: 7,
  pageSizes: [10, 15, 20, 30, 40, 50, 100],
})

const queryList = reactive({
  id: '',
  page: 1,
  pageSize: 12,
})

const fileList = ref([])

const visible = reactive({
  passForm: false,
})

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

const tableList = reactive({
  list: [],
  pageSize: 15,
  curPage: 1,
  total: 0,
  columns1: computed(() => [
    {
      title: l.value.serialNumbers,
      key: 'serialNumbers',
      width: 100,
    },
    {
      title: l.value.issueType,
      key: 'issue_type',
      width: 100,
    },
    {
      title: l.value.issueDesc,
      key: 'issue_desc',
      width: 120,
    },
    {
      title: l.value.issueSuggest,
      key: 'issue_suggest',
      width: 150,
    },
  ]),
  columns2: computed(() => [
    {
      title: l.value.correctivePlan,
      key: 'corrective_plan',
      width: 80,
    },
    {
      title: l.value.contactPhone,
      key: 'contact_phone',
      width: 90,
    },
    {
      title: l.value.correctivePrincipal,
      key: 'corrective_principal',
      width: 190,
    },
    {
      title: l.value.correctiveDate,
      key: 'corrective_date',
      width: 190,
    },
  ]),
  columns3: computed(() => [
    {
      title: l.value.verifyDetail,
      key: 'verify_detail',
      width: 140,
    },
    {
      title: l.value.auditResult,
      key: 'audit_result',
      width: 100,
    },
    {
      title: l.value.isVerifyPass,
      key: 'is_verify_pass',
      width: 100,
    },
    {
      title: l.value.verifyDate,
      key: 'verify_date',
      width: 100,
    },
  ]),
})

// Methods
const getList = () => {
  proxy.$request(api.baseUrl + '/Compliance/complianceIssues/getIssuesDetail', queryList, 'get').then((response) => {
    tableList.list = response.data.list.detail
  })
}

const audit = (row, index) => {
  visible.passForm = true
}

// Missing methods implementation that were referenced in Options API
const passsubmit = () => {
  // Placeholder based on existing Options API structure which referenced passsubmit in template
  // but wasn't defined in methods in the provided code snippet.
  // Assuming it should close dialog
  visible.passForm = false
}

const getHisList = (row, index) => {
  // Placeholder based on template usage
}

const resetForm = () => {
  console.log('ccc')
  Object.keys(queryList).forEach((key) => {
    if (key !== 'page' && key !== 'pageSize') queryList[key] = ''
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

const checkviewFile = (id) => {
  let r = proxy.$request(api.baseUrl + '/Compliance/complianceAttachments/checkManufacturerAttachments', {
    id: id,
    file_type: 1,
  })
  return r
}

const viewFile = (id) => {
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
  if (store.dispatch) {
    store.dispatch('delView', router.currentRoute).then(({ visitedViews }) => {
      router.push('/compliance/ImproveManagement').catch(() => {})
    })
  } else {
    router.push('/compliance/ImproveManagement').catch(() => {})
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
  console.log(route.query)
  // queryList.id = route.query.id // Uncomment if needed
  queryList.id = 'b649d270-407b-46f0-9612-35c015801e5a' // Hardcoded in original
  getList()
  getUserAuth()
})
</script>
<style scoped></style>
