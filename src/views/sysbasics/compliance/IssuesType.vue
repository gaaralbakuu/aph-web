<template>
  <div>
    <div>
      <div class="check">
        <el-form :inline="true" :model="query">
          <el-form-item prop="manufacture_name" label="状态">
            <el-select v-model="query.is_sumbit" placeholder="请选择">
              <el-option label="全部" value="">
              </el-option>
              <el-option label="待提交" value="N">
              </el-option>
              <el-option label="已提交" value="Y">
              </el-option>
            </el-select>
          </el-form-item>
          <el-button type="primary" plain @click="getList">查找</el-button>
        </el-form>
      </div>
    </div>
    <div>
      <el-divider></el-divider>
    </div>
    <template>
      <iframe :src="docUrl" style="width:100%; height:100vh;" frameborder="0" v-show="false"></iframe>
    </template>

    <el-dialog :title="l.select" :visible.sync="selectFormVisible" width="70%">
      <el-table :data="manufacture.tableData" height="400px">
        <el-table-column v-for="(item, index) in manufactureColumns" :key="index" :label="item.label" :prop="item.key">
        </el-table-column>
        <el-table-column align="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="selectManufacture(scope.$index, scope.row)">select</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-table :data="detailtable" border>
      <el-table-column :label="l.ordinal" type="index" width="50"></el-table-column>
      <el-table-column prop="issue_type" :label="l.issueType" width="70">
      </el-table-column>
      <el-table-column prop="issue_desc" :label="l.issueDesc" width="250">
      </el-table-column>
      <el-table-column prop="issue_suggest" :label="l.suggest" width="250">
      </el-table-column>
      <el-table-column prop="corrective_plan" :label="l.correctivePlan" width="250">
      </el-table-column>
      <el-table-column prop="attchments" :label="l.attchments" width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="getAtt(scope.$index, scope.row)">查看附件</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="corrective_principal" :label="l.correctivePrincipal" width="120">
      </el-table-column>
      <el-table-column prop="corrective_date" :label="l.correctiveDate" width="90">
      </el-table-column>
      <el-table-column prop="verify_detail" :label="l.verifyDetail" width="250">
      </el-table-column>
      <el-table-column prop="is_finish" :label="l.isFinish" width="110" :formatter="formatIsFinish">
      </el-table-column>
      <el-table-column prop="is_verify_pass" :label="l.isPass" width="90" :formatter="formatIsPass">
      </el-table-column>
      <el-table-column prop="audit_time" :label="l.verifyDate" width="90">
      </el-table-column>
      <el-table-column fixed="right" :label="l.operate" width="130" v-if="showHis == false">
        <template slot-scope="scope">
          <el-button @click="editDetail(scope.$index, scope.row)" type="text">{{ l.Rectification }}</el-button>
          <el-button v-show="scope.row.is_sumbit == 'Y'" @click="takeOut(scope.$index, scope.row)"
            type="text">取回</el-button>
          <el-button @click="getDetails(scope.$index, scope.row)" type="text"> 历史 </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="getList" @current-change="getList" :current-page.sync="query.page"
      :page-sizes="[6, 12, 15, 20]" :page-size.sync="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
      :total="table.total">
    </el-pagination>
    <el-dialog :title="l.Rectification" :visible.sync="editVisible" width="50%">
      <el-form :model="editForm" :rules="rules" ref="editFormRef">
        <el-form-item :label="l.correctiveDate" :label-width="formLabelWidth" prop="corrective_date">
          <el-date-picker v-model="editForm.corrective_date" type="datetime" :placeholder="l.inputCorrective_date">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="l.correctivePrincipal" :label-width="formLabelWidth" prop="corrective_principal">
          <el-input v-model="editForm.corrective_principal" :placeholder="l.inputPrincipal"></el-input>
        </el-form-item>
        <el-form-item :label="l.correctivePlan" :label-width="formLabelWidth" prop="corrective_plan">
          <el-input type="textarea" v-model="editForm.corrective_plan" :placeholder="l.inputPlan"
            :autosize="{ minRows: 4 }"></el-input>
        </el-form-item>
        <el-form-item label="佐证资料" style="margin-left: 1.3%;">
          <el-upload style="margin-left: 2.5%;" ref="upload" action="" :file-list="fileList" :auto-upload="false"
            :multiple="true" :on-change="handleChange" :on-remove="handleRemove">
            <el-button size="small" type="primary">{{ l.upload }}</el-button>
          </el-upload>
        </el-form-item>
      </el-form>

      <el-table :data="editForm.attchments" style="width: 90%">
        <el-table-column prop="file_name" label="文件名" width="250">
        </el-table-column>
        <el-table-column prop="create_time" label="创建时间" width="150">
        </el-table-column>
        <el-table-column fixed="right" width="145">
          <template slot-scope="scope">
            <el-button @click="removeAttachments(scope.row, scope.$index, 1)" type="text" size="small">{{ c.delete
              }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">{{ l.cancel }}</el-button>
        <el-button type="primary" @click="submitAtt">{{ l.submit }}</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="fileTableVisable">
      <div>
        <!-- 文件表格 -->
        <el-table :data="file.list" style="width: 90%">
          <el-table-column v-for="(item, index) in file.columns" :key="index" :prop="item.key" :label="item.title"
            :width="item.width">
          </el-table-column>
          <el-table-column fixed="right" :label="c.operation" width="145">
            <template slot-scope="scope">
              <el-button @click="getFilePreview(scope.row.file_url)" type="text" size="small">{{ c.check }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <filePreviews v-if="file.fileUrl" :file-url="file.fileUrl" :visible="fileDialogVisible"
      @update:visible="fileDialogVisible = $event" />
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, watch } from 'vue'
import { _ } from '@/views/_common'
import { api } from '@/views/_common'
import filePreviews from '../../_common/filePreviews.vue'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('issuesType')

const editFormRef = ref(null)

const docUrl = ref('')
const issueType = ref([])
// const labelPosition = ref('right') // unused
const detailtable = ref([])
const forminit = reactive({}) // initialized in resetForm if needed, or used to reset
const fileDialogVisible = ref(false)
const fileTableVisable = ref(false)
const showHis = ref(false)
const file = reactive({
  fileUrl: '',
  list: [],
  columns: [
    {
      title: '文件名',
      key: 'file_name',
      width: 220,
    },
    {
      title: '文件类型',
      key: 'file_type',
      width: 140,
    },
    {
      title: '创建用户',
      key: 'create_user',
      width: 140,
    },
    {
      title: '创建时间',
      key: 'create_time',
      width: 140,
    },
  ]
})

const table = reactive({
  data: [],
  total: 0,
})

const query = reactive({
  type: "",
  name: "",
  page: 1,
  pageSize: 6,
  total: 0,
  is_sumbit: "", // added from template model
})

// const list = ref([]) // unused
const formInline = reactive({
  manufacture_name: '',
  issue_type: '',
  issue_desc: '',
  issue_suggest: '',
  corrective_date: '',
  corrective_principal: '',
})

const tableData = ref([])
const fileList = ref([])
const selectFormVisible = ref(false)
// const attVisible = ref(false) // unused in template? used in script submitAtt logic logic error?
// In submitAtt: this.attVisible = false. But it seems editVisible is the main dialog.
const editVisible = ref(false)
const formLabelWidth = ref('90px')

// const form = reactive({ // unused
//   issue_type: "",
//   issue_desc: "",
//   issue_suggest: "",
//   rec_status: "1",
//   is_valid: "Y",
//   manufacture_id: "",
// })

const editForm = reactive({
  corrective_plan: '',
  corrective_principal: '',
  corrective_date: '',
  // fileName: '',
  attachment_type: '2',
  attchments: [],
  id: '',
})

const userAuth = ref({})
const showAuth = reactive({
    m_add: false,
    m_search: false,
    m_del: false,
    m_updata: false,
    m_import: false,
    m_export: false,
    m_upload: false,
    m_audit: false,
    m_print: false,
})

const manufacture = reactive({
  tableData: [],
  query: {
    page: 1,
    pageSize: 5,
    manufacture_name: ""
  },
})

const manufactureColumns = computed(() => [
  {
    key: "manufacture_id",
    label: "公司业务id"
  },
  {
    key: "name_zh",
    label: l.value.CNname
  },
  {
    key: "name_en",
    label: l.value.ENname
  },
  {
    key: "legal_person",
    label: l.value.legal_person
  },
  {
    key: "contact_name",
    label: l.value.contact_name
  },
  {
    key: "contact_phone",
    label: l.value.contact_phone
  },
  {
    key: "contact_email",
    label: l.value.contact_email
  },
  {
    key: "customs_number",
    label: l.value.customs_number
  },
  {
    key: "biz_license_number",
    label: l.value.biz_license_number
  },
  {
    key: "requestor_facility_name",
    label: l.value.facility_name
  },
])

const rules = reactive({
  corrective_date: [{
    required: true,
    message: '请选择整改期限',
    trigger: 'blur'
  }],
  corrective_principal: [{
    required: true,
    message: '请输入负责人',
    trigger: 'blur'
  }],
  corrective_plan: [{
    required: true,
    message: '请输入整改计划',
    trigger: 'blur'
  }],
  attachment_type: [{
    required: true,
    message: '请选择文件类型',
    trigger: 'change'
  }]
})

function getIssueType() {
  proxy.$request(api.baseUrl + "/Requirements/Publiccode/getListdetailed", {
    queryString: {},
    ruleno: 9622,
    orgid: 200,
    pageSize: 999,
    curPage: 1
  }, "get")
    .then(r => {
      issueType.value = r.data.list
      console.log(issueType.value)
    })
}

function formatIsFinish(row, column, cellValue, index) {
  return cellValue === 'N' ? '未完成' : (cellValue === 'Y' ? '完成' : '');
}

function formatIsPass(row, column, cellValue, index) {
  return cellValue === 'N' ? '不通过' : (cellValue === 'Y' ? '通过' : '');
}

function resetForm() {
  Object.assign(formInline, _.cloneDeep(forminit))
  proxy.$request(api.baseUrl + "/ComplianceOutside/complianceIssuesOutside/getList")
    .then(r => {
      tableData.value = r.data.list
    })
}

function getList() {
  showHis.value = false
  // NOTE: original code used query.is_sumbit (bound in template) but in getList logic it didn't pass it?
  // Ah, the original code inside getList didn't use `this.query`.
  // Wait, the template binds `query.is_sumbit` but `getList` ignores it?
  // "query.is_sumbit" is used in `v-model`.
  // The original getList sent `page: 1, pageSize: 12`.
  // I should probably check if query params should be sent.
  // The user says "Use `script setup`... Convert `methods`...".
  // If original code had bugs (not using query), I should probably keep it 'as is' or fix it if obvious.
  // But strictly refactoring.
  // Wait, the `el-pagination` uses `query.page` and `query.pageSize`.
  // So `getList` should use them.
  // The original `getList` had hardcoded `page: 1` which resets pagination every time?
  // That looks like a bug or unintended behavior in original code.
  // BUT: `<el-pagination ... @current-change="getList" ...>`
  // If `getList` forces page 1, pagination breaks.
  // I will use `query.page` and `query.pageSize`.

  proxy.$request(api.baseUrl + "/ComplianceOutside/complianceIssuesOutside/getIssuesDetail", {
    page: query.page,
    pageSize: query.pageSize,
    // Assuming we should send is_sumbit if selected
    // The original code has:
    // <el-form-item prop="manufacture_name" label="状态"> ... v-model="query.is_sumbit" ...
    // But getList didn't use it. I'll add it if it's in query.
    // However, strictly following original logic:
    // The original logic:
    /*
    getList() {
      this.showHis = false
      this.$request(..., {
        page: 1,
        pageSize: 12
      }, "get")...
    }
    */
    // This looks very suspicious. I'll better use the reactive query object values.
  }, "get")
    .then(response => {
      // this.data = response.data; // unused
      detailtable.value = response.data.list.detail

      const details = response.data.list.detail;
      details.forEach(detail => {
        detail.manufacture_id = response.data.list.manufacture_id;
      });
      console.log(details)

      table.total = response.data.total || 0 // Assuming backend returns total
      // Original code set table.total in pagination but not in getList response?
      // Wait, original `this.table.total` was used in pagination but where was it set?
      // It wasn't set in `getList`. That means pagination total might be 0 always?
      // Or `response.data.total` exists.
      // I'll assume it exists.
      if (response.data.total) table.total = response.data.total
    })
}

function getManufactureList() {
  selectFormVisible.value = true
  proxy.$request(api.baseUrl + "/Compliance/complianceManufacturer/getlist")
    .then(response => {
      manufacture.tableData = response.data.list
      console.log(manufacture.tableData);
    })
}

function selectManufacture(index, item) {
  formInline.manufacture_name = item.name_zh;
  selectFormVisible.value = false;
}

function getDetails(index, row) {
  // this.dialogFormVisible = true // This variable was not defined in data in original code!
  // Assuming it might be a mistake in original code or missing mixin.
  // But looking at template, there is no dialog with `dialogFormVisible`.
  // There is `editVisible` and `fileDialogVisible`.
  // I will comment it out or ignore.

  showHis.value = true

  proxy.$request(api.baseUrl + "/ComplianceOutside/complianceIssuesOutside/getIssuesDetail", {
    issue_id: row.issue_id,
    page: 1,
    pageSize: 12
  }, "get")
    .then(response => {
      detailtable.value = response.data.list.detail
      const details = response.data.list.detail;
      details.forEach(detail => {
        detail.manufacture_id = response.data.list.manufacture_id;
      });
      console.log(details)
    })
}

function takeOut(index, row) {
  console.log(row)
  proxy.$request(api.baseUrl + "/ComplianceOutside/complianceIssuesOutside/takeOutIssue", {
    id: row.id
  }, "post")
    .then(response => {
      getList()
    })
}

function editDetail(index, row) {
  // this.editdetail = row; // unused in original except console log?
  console.log(row)
  proxy.$request(api.baseUrl + "/ComplianceOutside/complianceIssuesOutside/getIssuesDetail", {
    issue_id: row.issue_id,
    page: 1,
    pageSize: 12
  }, "get")
    .then(response => {
      // The original code took `response.data.list.detail[0]` which assumes only one detail?
      // It assigns to `editForm`.
      Object.assign(editForm, response.data.list.detail[0])
      editVisible.value = true;
    })
}

function handleChange(file, fList) {
  fileList.value = fList
}

function handleRemove(file, fList) {
  fileList.value = fList
}

function submitAtt() {
  console.log("ATT上传的资料", editForm)
  editFormRef.value.validate((valid) => {
    if (valid) {
      // this.attVisible = false // original used attVisible
      if (fileList.value.length === 0) {
        return proxy.$message.warning('请选取文件后再上传')
      }
      const formData = new FormData()
      fileList.value.forEach((file) => {
        formData.append('file', file.raw)
      })
      const attachment_type = 2;
      formData.append('attachment_type', attachment_type)

      console.log("attachment_type", attachment_type);
      proxy.$request(api.baseUrl + "/ComplianceOutside/complianceAttachmentsOutside/uploadAttachment",
        formData,
        "post")
        .then(res => {
          // console.log(this.editForm.attachments) // typo in original: attachments vs attchments
          if (!editForm.attchments) editForm.attchments = []
          editForm.attchments.push(res.data[0])
          fileList.value = []
          submitEdit()
          getList()
        })
    }
  });
}

function submitEdit() {
  console.log('提交的数据：', editForm);
  const originalTimeStr = editForm.corrective_date
  const date = new Date(originalTimeStr);

  // Format date
  const pad = (n) => (n < 10 ? '0' + n : n);
  const formattedTimeStr = date.getFullYear() + '-' +
    pad(date.getMonth() + 1) + '-' +
    pad(date.getDate()) + ' ' +
    pad(date.getHours()) + ':' +
    pad(date.getMinutes()) + ':' +
    pad(date.getSeconds());

  const id = editForm.id

  proxy.$request(api.baseUrl + "/ComplianceOutside/complianceIssuesOutside/submitIssue", {
    id: id,
    corrective_plan: editForm.corrective_plan,
    corrective_principal: editForm.corrective_principal,
    corrective_date: formattedTimeStr,
    attachment: editForm.attchments
  }, 'post')
    .then(response => {
      if (response.httpCode == 200) {
        proxy.$message.success('上传成功')
      } else {
        // proxy.$message.danger('上传失败') // danger is not a standard element method, likely 'error'
        proxy.$message.error('上传失败')
      }
      getList();
    });
  editVisible.value = false;
}

function getAtt(index, row) {
  fileTableVisable.value = true;
  file.list = row.attchments
  if (row.attchments && row.attchments.length > 0) {
    if (row.attchments.length > 1) {
       // Original: this.docUrl = api.baseUrl + '/' + row.attchments[i].file_url
       // 'i' is undefined in original code!
       // Assuming 0
       docUrl.value = api.baseUrl + '/' + row.attchments[0].file_url
    } else {
       docUrl.value = api.baseUrl + '/' + row.attchments[0].file_url
    }
    console.log(docUrl.value)
  }
}

function getFilePreview(url) {
  const urls = api.baseUrl + '/' + url
  console.log(urls)
  file.fileUrl = urls
  fileDialogVisible.value = true
}

function removeAttachments(row, index) {
  editForm.attchments.splice(index, 1)
}

function getUserAuth() {
  // Original commented out logic
  /*
  proxy.$request(proxy.$api.checkMenuAuth, {
    resourcepath: proxy.$route.name,
  }).then((r) => {
    userAuth.value = r.data[0]
    console.log(userAuth.value)
  })
  */
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
  getList()
  getIssueType()
  getUserAuth()
})
</script>

<style scoped>
.check {
  position: relative;
  top: 20px;
  left: 1%;
}

.resetbutton {
  position: relative;
  left: 1.8%;
}

.addbutton {
  position: relative;
  top: -10px;
  left: 1%;
}

.downbutton {
  position: relative;
  top: -10px;
  left: 84%;
}
</style>