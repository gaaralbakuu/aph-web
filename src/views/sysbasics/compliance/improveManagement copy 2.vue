<template>
  <div class="app-container">
    <!-- 查询区域 (Refactored) -->
    <div>
      <div style="display: flex; gap: 16px; margin-bottom: 10px">
        <!-- Left: search fields in columns -->
        <div style="flex: 1; display: flex; flex-direction: column; gap: 12px">
          <div style="display: flex; gap: 12px">
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ l.manufactureName }}</label>
              <el-input :placeholder="l.manufactureName" v-model="formInline.manufacture_name" style="width: 100%" clearable />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ l.issueType }}</label>
              <el-input :placeholder="l.issueType" v-model="formInline.issues_type" style="width: 100%" clearable />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ l.issueDesc }}</label>
              <el-input :placeholder="l.issueDesc" v-model="formInline.issues_desc" style="width: 100%" clearable />
            </div>
          </div>
          <div style="display: flex; gap: 12px">
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ l.suggest }}</label>
              <el-input :placeholder="l.suggest" v-model="formInline.suggest" style="width: 100%" clearable />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ l.correctiveDate }}</label>
              <el-input :placeholder="l.correctiveDate" v-model="formInline.corrective_date" style="width: 100%" clearable />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ l.correctivePrincipal }}</label>
              <el-input :placeholder="l.correctivePrincipal" v-model="formInline.corrective_principal" style="width: 100%" clearable />
            </div>
          </div>
        </div>
        <!-- Right: buttons -->
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-end; min-width: 160px; gap: 12px">
          <el-button type="primary" size="medium" @click="getList" style="margin-right: 8px">{{ l.search }}</el-button>
          <el-button type="info" size="medium" @click="resetForm">{{ l.reset }}</el-button>
        </div>
      </div>
    </div>
    <div>
      <el-divider></el-divider>
    </div>
    <div>
      <el-button type="primary" plain @click="addForm" class="addbutton">
        <i class="el-icon-circle-plus-outline"></i>
        {{ l.create }}
      </el-button>
      <el-button plain class="addbutton" @click="visabled.uploadFile = true">{{ l.bulkImport }}</el-button>

      <el-button plain class="addbutton" @click="exportTemplate">{{ c.downloadTemplate }}</el-button>

      <el-button @click="exportExcel" icon="el-icon-download" type="info" class="fr">{{ l.download }}</el-button>
      <el-button @click="recEmail()" icon="el-icon-message" type="info" class="fr">{{ l.emailNotification }}</el-button>
    </div>
    <el-table :data="tableData.list" style="width: 98%; margin: 1%">
      <el-table-column :label="l.basicInformation">
        <el-table-column :label="l.ordinal" type="index" width="50"></el-table-column>
        <el-table-column prop="name_zh" :label="l.manufactureName" width="150"></el-table-column>
      </el-table-column>
      <el-table-column :label="l.issueInformation">
        <el-table-column :label="l.issueType" width="350">
          <template slot-scope="scope">
            <div v-for="(detail_item, index) in scope.row.detail" :key="index">
              <span :title="checkField({ detail_item }, ['detail_item', 'issue_type'])" class="truncate-lines" v-html="checkField({ detail_item }, ['detail_item', 'issue_type'])"></span>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column :label="l.T1subcom">
        <el-table-column :label="l.correctivePlan" width="250">
          <template slot-scope="scope">
            <div v-for="(detail_item, index) in scope.row.detail" :key="index">
              <span :title="checkField({ detail_item }, ['detail_item', 'corrective_plan'])" class="truncate-lines" v-html="checkField({ detail_item }, ['detail_item', 'corrective_plan'])"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="l.correctivePrincipal" width="90">
          <template slot-scope="scope">
            <div v-for="(detail_item, index) in scope.row.detail" :key="index">
              <span :title="checkField({ detail_item }, ['detail_item', 'corrective_principal'])" class="truncate-lines" v-html="checkField({ detail_item }, ['detail_item', 'corrective_principal'])"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="l.correctiveDate" width="140">
          <template slot-scope="scope">
            <div v-for="(detail_item, index) in scope.row.detail" :key="index">
              {{ checkField({ detail_item }, ['detail_item', 'corrective_date']) }}
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column :label="l.factoryProven">
        <el-table-column :label="l.verifyDetail" width="250">
          <template slot-scope="scope">
            <div v-for="(detail_item, index) in scope.row.detail" :key="index">
              <span :title="checkField({ detail_item }, ['detail_item', 'verify_detail'])" class="truncate-lines" v-html="checkField({ detail_item }, ['detail_item', 'verify_detail'])"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="l.isFinish" width="110">
          <template slot-scope="scope">
            <div v-for="(detail_item, index) in scope.row.detail" :key="index">
              {{ detail_item.is_finish === 'N' ? l.unfinished : detail_item.is_finish === 'Y' ? l.finish : '' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="l.isPass" width="90">
          <template slot-scope="scope">
            <div v-for="(detail_item, index) in scope.row.detail" :key="index">
              {{ detail_item.is_verify_pass === 'N' ? l.noPass : detail_item.is_verify_pass === 'Y' ? l.pass : '' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="l.verifyDate" width="140">
          <template slot-scope="scope">
            <div v-for="(detail_item, index) in scope.row.detail" :key="index">
              {{ checkField({ detail_item }, ['detail_item', 'verify_date']) }}
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column fixed="right" :label="l.operate" width="100">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain @click="getDetails(scope.$index, scope.row)">{{ l.check }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <z-pagination :pagination="pagination" :total="tableData.total" :page.sync="query.page" :limit.sync="query.pageSize" @change="getList"></z-pagination>

    <CustomDialog :title="l.create" :visible.sync="addFormVisible" :clickOutside="false">
      <el-form :model="form" :rules="rules" ref="form" :label-width="formLabelWidth">
        <el-row style="margin: 20px">
          <el-col :span="24">
            <el-form-item v-show="false" :label="l.manufacture" prop="manufacture_id">
              <el-input v-model="form.manufacture_id" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="l.manufactureName" prop="name_zh">
              <el-input v-model="form.name_zh" :disabled="true" :placeholder="l.selectManufacture"></el-input>
              <el-button type="primary" plain @click="showManufacture">{{ l.selectManufacture }}</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="l.issueType" prop="issue_type">
              <el-input v-model="form.issue_type"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="l.issueDesc" prop="issue_desc">
              <el-input type="textarea" v-model="form.issue_desc" :autosize="{ minRows: 4 }"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="l.suggest" prop="issue_suggest">
              <el-input type="textarea" v-model="form.issue_suggest" :autosize="{ minRows: 4 }"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="l.supportInfo"></el-form-item>
          </el-col>
          <input type="file" @change="addFile" ref="addfileinput" style="display: none" />
          <el-col :span="24">
            <el-button type="primary" @click="$refs.addfileinput.click()">{{ l.fileUpload }}</el-button>
          </el-col>
          <el-col :span="24">
            <div>
              <!-- 文件表格 -->
              <el-table :data="form.fileList">
                <el-table-column v-for="(item, index) in form.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                <el-table-column fixed="right" :label="c.operation" width="145">
                  <template slot-scope="scope">
                    <el-button @click="removeAddClick(scope.row, scope.$index)" type="text" size="small">{{ c.delete }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCancel('form')">{{ l.cancel }}</el-button>
        <el-button type="primary" plain @click="submit('form')">{{ l.submit }}</el-button>
      </div>
    </CustomDialog>

    <el-dialog :title="l.check" :visible.sync="dialogFormVisible" width="80%">
      <el-form inline :model="getDetailsQuery">
        <el-form-item prop="manufacture_name" :label="l.reviewStatus">
          <el-select v-model="getDetailsQuery.rec_status" :placeholder="l.pleaseSelect">
            <el-option :label="c.all" value=""></el-option>
            <el-option :label="l.pendingReview" value="1"></el-option>
            <el-option :label="l.reviewed" value="7"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="manufacture_name" :label="l.shoudSaveHistory">
          <el-select v-model="getDetailsQuery.is_his" :placeholder="l.pleaseSelect">
            <el-option :label="c.all" value=""></el-option>
            <el-option :label="l.currentRecord" value="0"></el-option>
            <el-option :label="l.history" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="getDetail">{{ c.m_search }}</el-button>
      </el-form>
      <el-table :data="detailtable.list" border style="color: cornflowerblue">
        <el-table-column :label="l.ordinal" type="index" width="50"></el-table-column>
        <el-table-column prop="issue_type" :label="l.issueType" width="70"></el-table-column>
        <el-table-column prop="issue_desc" :label="l.issueDesc" width="300"></el-table-column>
        <el-table-column prop="issue_suggest" :label="l.suggest" width="300"></el-table-column>
        <el-table-column prop="corrective_principal" :label="l.correctivePrincipal" width="90"></el-table-column>
        <el-table-column prop="attchments" :label="l.attchments" width="100">
          <template slot-scope="scope">
            <el-button @click="checkFile(scope.row)" type="text">{{ l.check }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="corrective_date" :label="l.correctiveDate" width="90"></el-table-column>
        <el-table-column prop="verify_detail" :label="l.verifyDetail" width="300"></el-table-column>
        <el-table-column prop="is_finish" :label="l.isFinish" width="110" :formatter="formatIsFinish"></el-table-column>
        <el-table-column prop="is_verify_pass" :label="l.isPass" width="90" :formatter="formatIsPass"></el-table-column>
        <el-table-column prop="verify_date" :label="l.verifyDate" width="90"></el-table-column>
        <el-table-column v-if="is_his == 0" fixed="right" :label="l.operate" width="130">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.rec_status === 7 || scope.row.rec_status === -1" @click="passornot(scope.row)" type="text" size="small">{{ l.audit }}</el-button>
            <el-button @click="editDetail(scope.$index, scope.row)" v-show="showAuth.m_updata" type="text" size="small">{{ l.edit }}</el-button>
            &nbsp;
            <el-popconfirm :title="l.error">
              <el-button v-show="showAuth.m_del" slot="reference" type="text" size="mini">{{ l.delete }}</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <z-pagination :pagination="pagination" :total="detailtable.total" :page.sync="getDetailsQuery.page" :limit.sync="getDetailsQuery.pageSize" @change="showHisList(is_his)"></z-pagination>
    </el-dialog>

    <el-dialog :visible.sync="dialogSelectManufacture">
      <el-input v-show="false" v-model="manufacture.query.manufacture_name"></el-input>
      <el-button v-show="false" @click="getManufactureList"></el-button>
      <el-table :data="manufacture.tableData" height="400px">
        <el-table-column v-for="(item, index) in manufacture.column" :key="index" :label="item.label" :prop="item.key"></el-table-column>
        <el-table-column align="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="selectManufacture(scope.$index, scope.row)">select</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :title="l.result" :visible.sync="passFormVisible" width="40%">
      <el-form>
        <el-form-item :label="l.results" :label-width="formLabelWidth">
          <el-radio-group v-model="check.rec_status">
            <el-radio v-model="check.rec_status" label="7">{{ l.pass }}</el-radio>
            <el-radio v-model="check.rec_status" label="-1">{{ l.noPass }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="l.isFinish" :label-width="formLabelWidth">
          <el-radio-group v-model="check.is_finish">
            <el-radio v-model="check.is_finish" label="Y">{{ l.finish }}</el-radio>
            <el-radio v-model="check.is_finish" label="N">{{ l.unfinished }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="l.verifyDetail" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="check.verify_detail" :placeholder="l.verifyDetail"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="passFormVisible = false">{{ l.cancel }}</el-button>
        <el-button type="primary" @click="passsubmit">{{ l.submit }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="l.editInformation" :visible.sync="editVisible" width="50%">
      <el-form :model="editForm">
        <el-form-item :label="l.issueType">
          <el-select v-model="editForm.issue_type" :placeholder="l.inputIssue" style="width: 100%">
            asda
            <el-option v-for="item in issueType" :key="item.name_zh" :label="item.name_label" :value="item.name_zh"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="l.issueDesc">
          <el-input type="textarea" v-model="editForm.issue_desc" :placeholder="l.inputDesc"></el-input>
        </el-form-item>
        <el-form-item :label="l.suggest">
          <el-input type="textarea" v-model="editForm.issue_suggest" :placeholder="l.inputSuggest"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">{{ l.cancel }}</el-button>
        <el-button type="primary" @click="submitEdit">{{ l.submit }}</el-button>
      </span>
    </el-dialog>

    <!-- 文件查看 -->
    <el-dialog :visible.sync="fileTableVisable" :title="l.viewDocument">
      <div>
        <!-- 文件表格 -->
        <el-table :data="file.list" style="width: 90%">
          <el-table-column v-for="(item, index) in file.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
          <el-table-column fixed="right" :label="c.operation" width="145">
            <template slot-scope="scope">
              <el-button @click="getFilePreview(scope.row.file_url)" type="text" size="small">{{ c.check }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <el-dialog width="80% " :visible.sync="recEmailVisible">
      <div>
        <el-form style="border-radius: 2px">
          <el-row>
            <el-col :span="12">
              <el-form-item :label="l.roles"></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="l.emailNotificationRole"></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-table :data="roleList.list" style="width: 90%">
                <el-table-column v-for="(item, index) in roleList.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                <el-table-column fixed="right" :label="c.operation" width="145">
                  <template slot-scope="scope">
                    <el-button @click="addRoleItem(scope.row)" type="text" size="small">{{ l.addNotification }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>

            <el-col :span="12">
              <el-table :data="recEmailList.list" style="width: 90%">
                <el-table-column v-for="(item, index) in recEmailList.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                <el-table-column fixed="right" :label="c.operation" width="145">
                  <template slot-scope="scope">
                    <el-button @click="deleteRoleItem(scope.row)" type="text" size="small" style="color: red">{{ l.cancellationNotice }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>

            <el-col :span="24">
              <el-form-item :label="l.sendEmail"></el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item :label="l.approachingReviewDate">
                <el-date-picker v-model="recEmailList.distanceTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item>
                <el-button type="primary" @click="sendRoleEmail">{{ l.sendEmail }}</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </el-dialog>

    <!-- 批量导入 -->
    <el-dialog :visible.sync="visabled.uploadFile" width="30%">
      <div>
        <el-form style="margin-top: 20px">
          <el-form-item :label="l.upload_file" required>
            <input type="file" accept=".xls,.xlsx" class="el-input" @change="onFileChange" style="border: 1px solid #dcdcdc; border-radius: 5px; padding: 3px" />
          </el-form-item>
        </el-form>
        <div style="margin-top: 40px; text-align: right">
          <el-button type="primary" @click="visabled.uploadFile = false">{{ c.cancel }}</el-button>
          <el-button type="success" @click="uploadExcel">{{ c.m_upload }}</el-button>
        </div>
      </div>
    </el-dialog>

    <filePreviews v-if="file.fileUrl" :file-url="file.fileUrl" :visible="fileDialogVisible" @update:visible="fileDialogVisible = $event" />
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, getCurrentInstance, watch } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'
import { getToken } from '@/utils/auth'
import { checkField } from '@/utils/checkFiled'
import { _, api, zPagination, zTable } from '@/views/_common'
import CustomDialog from '../../_common/CustomDialog.vue'
import filePreviews from '../../_common/filePreviews.vue'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('issuesType') // Assuming correct namespace

const fileTableVisable = ref(false)
const fileDialogVisible = ref(false)
const recEmailVisible = ref(false)
const issueType = ref([])
const userAuth = ref([])
const visabled = reactive({
  uploadFile: false,
})
const uploadQuery = reactive({})
const pagination = reactive({
  layout: 'prev, pager, next, jumper, ->, total,sizes',
  pagerCount: 7,
  pageSizes: [10, 15, 20, 30, 40, 50, 100],
})
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
const file = reactive({
  fileUrl: '',
  list: [],
  columns: computed(() => [
    {
      title: l.value.filename,
      key: 'file_name',
      width: 220,
    },
    {
      title: l.value.fileType,
      key: 'file_type',
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
  ]),
})
const check = reactive({
  rec_status: '',
})
const clickRow = ref({})
const labelPosition = ref('right')
const passFormVisible = ref(false)
const detailtable = reactive({
  list: [],
  total: 0,
})
const is_his = ref(0)
const forminit = reactive({})
const table = reactive({
  data: [],
  total: 0,
})
const query = reactive({
  type: '',
  name: '',
  page: 1,
  pageSize: 15,
  total: 0,
})
const list = ref([])
const formInline = reactive({
  manufacture_name: '',
  issue_type: '',
  issue_desc: '',
  issue_suggest: '',
  corrective_date: '',
  corrective_principal: '',
})
const tableData = reactive({
  total: 0,
  page: 1,
  pageSize: 15,
  list: [],
})
const manufacture = reactive({
  column: computed(() => [
    {
      key: 'manufacture_id',
      label: 'manufacture_id',
    },
    {
      key: 'name_zh',
      label: l.value.CNname,
    },
    {
      key: 'name_en',
      label: l.value.ENname,
    },
  ]),
  tableData: [],
  query: {
    page: 1,
    pageSize: 15,
    manufacture_name: '',
  },
})
const addFormVisible = ref(false)
const dialogFormVisible = ref(false)
const dialogSelectManufacture = ref(false)
const editVisible = ref(false)
const formLabelWidth = ref('130px')
const form = reactive({
  issue_type: '',
  issue_desc: '',
  issue_suggest: '',
  rec_status: '1',
  is_valid: 'Y',
  manufacture_id: '',
  fileList: [],
  addfile: {},
  addFileList: [],
  attachments: [],
  columns: computed(() => [
    {
      title: l.value.filename,
      key: 'file_name',
      width: 220,
    },
    {
      title: l.value.fileType,
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
  ]),
})
const editForm = reactive({
  issueType: '',
  issue_desc: '',
  issue_suggest: '',
})
const rules = computed(() => ({
  issue_type: [{ required: true, message: l.value.pleaseTypeIssue, trigger: 'change' }],
  issue_desc: [{ required: true, message: l.value.pleaseDescription, trigger: 'blur' }],
  issue_suggest: [{ required: true, message: l.value.pleaseSuggest, trigger: 'blur' }],
}))
const getDetailsQuery = reactive({
  page: 1,
  pageSize: 6,
  id: '',
  is_his: '0',
})
const roleList = reactive({
  list: [],
  query: {
    params: {},
    size: 15,
    page: 1,
    role_type: 'cis',
  },
  total: 0,
  columns: computed(() => [
    {
      title: l.value.role_id,
      key: 'role_id',
    },
    {
      title: l.value.role_name,
      key: 'role_name',
    },
    {
      title: l.value.role_desc,
      key: 'role_desc',
    },
  ]),
  fields: computed(() => [
    {
      title: l.value.role_name,
      key: 'role_name',
      required: true,
    },
    {
      title: l.value.role_desc,
      key: 'role_desc',
      required: true,
    },
  ]),
})
const recEmailList = reactive({
  list: [],
  distanceTime: '',
  total: 0,
  columns: computed(() => [
    {
      title: l.value.role_id,
      key: 'role_id',
    },
    {
      title: l.value.role_name,
      key: 'role_name',
    },
    {
      title: l.value.role_desc,
      key: 'role_desc',
    },
  ]),
})
const surveyEmail = reactive({
  id: '',
  rec_issues: '',
  rec_survey: '',
  role_id: '',
})

// Add refs for file inputs
const addfileinput = ref(null)
// const formRef = ref(null) // Renamed from $refs.form access

// Methods
const getIssueType = () => {
  proxy
    .$request(
      api.baseUrl + '/Requirements/Publiccode/getListdetailed',
      {
        queryString: {},
        ruleno: 9622,
        orgid: 200,
        pageSize: 999,
        curPage: 1,
      },
      'get'
    )
    .then((r) => {
      issueType.value = r.data.list
      console.log(issueType.value)
    })
}

const formatIsFinish = (row, column, cellValue, index) => {
  return cellValue === 'N' ? l.value.unfinished : cellValue === 'Y' ? l.value.finish : ''
}

const formatIsPass = (row, column, cellValue, index) => {
  return cellValue === 'N' ? l.value.noPass : cellValue === 'Y' ? l.value.pass : ''
}

const passornot = (row) => {
  console.log(row)
  passFormVisible.value = true
  check.id = row.id
  console.log(check.id)
}

const passsubmit = () => {
  passFormVisible.value = false
  const issuesId = check.id
  const rec_status = check.rec_status
  proxy
    .$request(
      api.baseUrl + '/Compliance/complianceIssues/auditIssues',
      {
        issuesId: issuesId,
        rec_status: rec_status,
        is_finish: check.is_finish,
        verify_detail: check.verify_detail,
      },
      'post'
    )
    .then((response) => {
      if (response.httpCode == 200) {
        proxy.$message.success('审核成功')
      } else {
        proxy.$message.error('审核失败')
      }
    })
}

const resetForm = () => {
  Object.assign(formInline, forminit)
  proxy.$request(api.baseUrl + '/Compliance/complianceIssues/getList').then((r) => {
    tableData.list = r.data.list
    tableData.total = r.data.total
  })
}

const getList = () => {
  proxy
    .$request(
      api.baseUrl + '/Compliance/complianceIssues/getList',
      {
        manufacture_name: formInline.manufacture_name,
        issues_type: formInline.issues_type,
        issues_desc: formInline.issues_desc,
        suggest: formInline.suggest,
        corrective_date: formInline.corrective_date,
        corrective_principal: formInline.corrective_principal,
        query: query,
      },
      'get'
    )
    .then((r) => {
      tableData.list = r.data.list
      tableData.total = r.data.total
      table.total = r.data.total
      console.log(tableData.list)
    })
}

const getDetails = (index, row) => {
  dialogFormVisible.value = true
  const detail = []
  detail.push({
    index,
    row,
  })
  clickRow.value = row
  getDetailsQuery.id = detail[0].row.id
  getDetail()
}

const getDetail = () => {
  proxy.$request(api.baseUrl + '/Compliance/complianceIssues/getIssuesDetail', getDetailsQuery, 'get').then((response) => {
    // data.value = response.data
    console.log(response.data)
    detailtable.list = response.data.list.detail
    detailtable.total = response.data.total
    console.log(detailtable)
    const details = response.data.list.detail
    details.forEach((detail) => {
      detail.manufacture_id = response.data.list.manufacture_id
    })
    console.log(details)
  })
}

const showHisList = (his_flag) => {
  const id = clickRow.value.id
  console.log(id)
  is_his.value = is_his.value == 1 ? 0 : 1
  proxy
    .$request(
      api.baseUrl + '/Compliance/complianceIssues/getIssuesDetail',
      {
        id: id,
        page: 1,
        pageSize: 12,
        is_his: is_his.value,
      },
      'get'
    )
    .then((response) => {
      // data.value = response.data
      detailtable.list = response.data.list.detail
      detailtable.total = response.data.total
      console.log(response.data)
      const details = response.data.list.detail
      details.forEach((detail) => {
        detail.manufacture_id = response.data.list.manufacture_id
      })
    })
}

const editDetail = (index, row) => {
  const editdetail = row
  console.log(editdetail)
  Object.assign(editForm, editdetail)
  console.log(editForm)
  editVisible.value = true
}

const submitEdit = () => {
  proxy
    .$request(
      api.baseUrl + '/Compliance/complianceIssues/addOrModifyIssues',
      {
        manufacture_id: editForm.manufacture_id,
        detail: [
          {
            issue_type: editForm.issue_type,
            issue_desc: editForm.issue_desc,
            issue_suggest: editForm.issue_suggest,
            is_valid: editForm.is_valid,
            rec_status: editForm.rec_status,
            id: editForm.id,
            pid: editForm.pid,
          },
        ],
      },
      'post'
    )
    .then((response) => {
      // data.value = response.data
      getList()
      editVisible.value = false
    })
}

const addForm = () => {
  addFormVisible.value = true
}

const addCancel = (formName) => {
  addFormVisible.value = false
  // form.value = _.cloneDeep(forminit)
  Object.assign(form, _.cloneDeep(forminit))
  // Reset fields if using element-ui form ref, need to expose ref or access via template ref
  // proxy.$refs[formName].resetFields() // This assumes we can access refs
}

const submit = (formName) => {
  // Using proxy.$refs to access form validation if available
  // Or manually validate
  // Assuming element ui validation
  proxy.$refs[formName].validate((valid) => {
    console.log(valid)
    if (valid) {
      const issue_type = form.issue_type
      const issue_desc = form.issue_desc
      const issue_suggest = form.issue_suggest
      const rec_status = form.rec_status
      const is_valid = form.is_valid
      const manufacture_id = form.manufacture_id
      // form.value = _.cloneDeep(forminit)
      Object.assign(form, _.cloneDeep(forminit))
      addFormVisible.value = false
      proxy
        .$request(
          api.baseUrl + '/Compliance/complianceIssues/addOrModifyIssues',
          {
            manufacture_id: manufacture_id,
            detail: [
              {
                issue_type: issue_type,
                issue_desc: issue_desc,
                issue_suggest: issue_suggest,
                is_valid: is_valid,
                rec_status: rec_status,
              },
            ],
          },
          'post'
        )
        .then((response) => {
          // data.value = response.data
          getList()
        })
        .catch((error) => {
          console.error('Error submitting form:', error)
        })
      // getList()
    }
  })
}

const showManufacture = () => {
  dialogSelectManufacture.value = true
  getManufactureList()
}

const getManufactureList = () => {
  proxy.$request(api.baseUrl + '/Compliance/complianceManufacturer/getlist').then((response) => {
    manufacture.tableData = response.data.list
    console.log(manufacture.tableData)
  })
}

const selectManufacture = (index, item) => {
  form.manufacture_id = item.manufacture_id
  form.name_zh = item.name_zh
  dialogSelectManufacture.value = false
}

const exportExcel = () => {
  proxy
    .$request(
      api.baseUrl + '/Compliance/complianceIssues/getList',
      {
        manufacture_name: formInline.manufacture_name,
        issues_type: formInline.issues_type,
        issues_desc: formInline.issues_desc,
        suggest: formInline.suggest,
        corrective_date: formInline.corrective_date,
        corrective_principal: formInline.corrective_principal,
        query: query,
      },
      'get'
    )
    .then((r) => {
      if (r.data.list.length == 0) {
        proxy.$alert('暂无数据', '提示', {
          confirmButtonText: '确定',
          callback: (action) => {},
        })
        return
      }
      const exprotList = r.data.list
      console.log(exprotList)

      function insertAndExtractArrays(objArray) {
        objArray.forEach((obj) => {
          if (obj.detail && Array.isArray(obj.detail)) {
            obj.detail.forEach((detailObj) => {
              if (detailObj !== null && typeof detailObj === 'object') {
                detailObj.name_zh = obj.name_zh
              }
            })
          }
        })
        const arrays = []

        function recurse(item) {
          if (Array.isArray(item)) {
            arrays.push(...item)
          } else if (item !== null && typeof item === 'object') {
            for (const key in item) {
              if (item.hasOwnProperty(key)) {
                recurse(item[key])
              }
            }
          }
        }
        objArray.forEach((obj) => recurse(obj))
        return arrays
      }
      const extractedArrays = insertAndExtractArrays(exprotList)
      console.log(extractedArrays)
      import('@/vendor/Export2Excel').then((excel) => {
        // Note: table.column uses computed props for l.value
        // But table object is reactive, so we access it directly
        const filterVal = table.column.map((item) => {
          return item.key
        })
        const tHeader = table.column.map((item) => {
          return item.label || item.key
        })
        const data = extractedArrays.map((v) => filterVal.map((j) => v[j]))
        console.log(data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: l.value.xlsxImproveManageName + '_' + dayjs().format('YYYYMMDD'),
        })
        // exportLoading.value = false
      })
    })
}

const getUserAuth = () => {
  proxy
    .$request(proxy.$api.checkMenuAuth, {
      resourcepath: proxy.$route.name,
    })
    .then((r) => {
      userAuth.value = r.data[0]
    })
}

const checkFile = (row) => {
  fileTableVisable.value = true
  file.list = row.attchments
}

const getFilePreview = (url) => {
  const urls = api.baseUrl + '/' + url
  console.log(urls)
  file.fileUrl = urls
  fileDialogVisible.value = true
}

const recEmail = () => {
  console.log('aa')
  recEmailVisible.value = true
  getRoleList()
  getRoleEmail()
}

const addRoleItem = (row) => {
  console.log(row)
  surveyEmail.rec_issues = '1'
  surveyEmail.role_id = row.role_id
  proxy
    .$confirm(l.value.confirmAddRole, l.value.dueDiligence, {
      confirmButtonText: c.value.confirm,
      cancelButtonText: c.value.cancel,
      type: 'warning',
    })
    .then(() => {
      proxy
        .$request(api.baseUrl + '/Compliance/complianceIssues/updateIssuesEmail', surveyEmail, 'post')
        .then((r) => {
          console.log(r)
          proxy.$message({
            type: 'success',
            message: c.value.success,
          })
          getRoleEmail()
        })
        .catch(() => {
          proxy.$message({
            type: 'error',
            message: c.value.fail,
          })
        })
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: c.value.cancel,
      })
    })
}

const deleteRoleItem = (row) => {
  console.log(row)
  surveyEmail.rec_issues = '0'
  surveyEmail.role_id = row.role_id
  proxy
    .$confirm(l.value.confirmAddRole, l.value.dueDiligence, {
      confirmButtonText: c.value.confirm,
      cancelButtonText: c.value.cancel,
      type: 'warning',
    })
    .then(() => {
      proxy
        .$request(api.baseUrl + '/Compliance/complianceIssues/updateIssuesEmail', surveyEmail, 'post')
        .then((r) => {
          console.log(r)
          proxy.$message({
            type: 'success',
            message: c.value.success,
          })
          getRoleEmail()
        })
        .catch(() => {
          proxy.$message({
            type: 'error',
            message: c.value.fail,
          })
        })
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: c.value.cancel,
      })
    })
}

const sendRoleEmail = () => {
  console.log(recEmailList.distanceTime)
  proxy
    .$confirm(l.value.confirmSendEmail, l.value.improvedManagement, {
      confirmButtonText: c.value.confirm,
      cancelButtonText: c.value.cancel,
      type: 'warning',
    })
    .then(() => {
      proxy
        .$request(api.baseUrl + '/Compliance/complianceIssues/roleEmail', { distanceTime: recEmailList.distanceTime }, 'post')
        .then((r) => {
          console.log(r)
          proxy.$message({
            type: 'success',
            message: c.value.success,
          })
        })
        .catch(() => {
          proxy.$message({
            type: 'error',
            message: c.value.fail,
          })
        })
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: c.value.cancel,
      })
    })
}

const onFileChange = (e) => {
  uploadQuery.file = e.target.files[0]
  if (!uploadQuery.file) {
    alert('请选择一个文件')
    return
  }
}

const uploadExcel = () => {
  if (!uploadQuery.file) {
    alert('请选择一个文件')
    return
  }

  let formData = new FormData()
  formData.append('file', uploadQuery.file)

  proxy
    .$request(proxy.$api.baseUrl + '/Compliance/complianceIssues/uploadIssues', formData, 'post')
    .then((r) => {
      console.log(r)
    })
    .catch((e) => {
      proxy.$message.error(e)
    })
}

const addFile = (e) => {
  console.log(e)
  form.addFileList.push(e.target.files[0])
  let etf = e.target.files
  console.log(form.addFileList)
  fileU(etf)
    .then((fileInfos) => {
      console.log(fileInfos)
      form.fileList.push(fileInfos[0])
      form.addfile = fileInfos[0]
      console.log(form.fileList)
      submmitfile(form.addfile)
    })
    .catch((error) => {
      proxy.$message({
        type: 'info',
        message: '添加失败',
      })
    })
}

const removeAddClick = (row, index) => {
  form.fileList.splice(index, 1)
  form.addFileList.splice(index, 1)
  if (addfileinput.value) addfileinput.value.value = ''
  if (form.attachments && form.attachments.length > 0) {
    form.attachments.splice(index, 1)
  }
}

const submmitfile = (fileList) => {
  console.log(fileList.attachment_type)
  console.log(fileList)
  console.log(form.addFileList)
  const formData = new FormData()
  formData.append('file', form.addFileList[0])
  formData.append('attachment_type', fileList.attachment_type)
  proxy
    .$request(api.baseUrl + '/Compliance/complianceAttachments/uploadAttachment', formData, 'post')
    .then((r) => {
      r.data.forEach((e) => (e.attachment_type = '1'))
      form.attachments.push(r.data[0])
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: '附件添加失败',
      })
      throw new Error('附件上传失败')
    })
}

const fileU = (fileList) => {
  return new Promise((resolve, reject) => {
    const fileInfos = []
    const file = fileList[0]
    const file_name = file.name
    const fileExtension = getFileExtension(file_name)
    const reader = new FileReader()

    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1]
      const fileInfo = {
        file_name: file_name,
        file_suffix: fileExtension,
        attachment_type: 1,
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
  })
}

const getFileExtension = (file_name) => {
  console.log(file_name)
  return file_name.slice(Math.max(0, file_name.lastIndexOf('.')) || Infinity)
}

const exportTemplate = () => {
  axios({
    headers: {
      token: getToken(),
    },
    responseType: 'blob',
    method: 'post',
    url: api.baseUrl + '/Compliance/complianceIssues/uploadIssuesTemplate',
  }).then((r) => {
    try {
      const blob = new Blob([r.data], {
        type: 'application/octet-stream;',
      })
      const elink = document.createElement('a')
      elink.download = l.value.xlsxImproveName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href)
      document.body.removeChild(elink)
    } catch (error) {
      proxy.$message.error('文件导出失败')
    }
  })
}

const getRoleList = () => {
  proxy
    .$request(api.role + 'getlist', roleList.query)
    .then((r) => {
      console.log(r)
      roleList.list = r.data.list
      roleList.total = r.data.total
    })
    .catch(() => {})
}

const getRoleEmail = () => {
  proxy
    .$request(api.baseUrl + '/Compliance/complianceIssues/getRoleEmailList', {})
    .then((r) => {
      recEmailList.list = r.data.list
      recEmailList.total = r.data.total
    })
    .catch(() => {})
}

onMounted(() => {
  getList()
  getUserAuth()
  Object.assign(forminit, _.cloneDeep(form))
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
@charset "UTF-8";
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

.truncate-lines {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  /* 限制为3行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
