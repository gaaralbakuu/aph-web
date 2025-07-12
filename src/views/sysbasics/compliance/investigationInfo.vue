<template>
  <div class="app-container" v-loading="pageLoading">
    <!-- 查询 -->

    <div>
      <el-button type="success" @click="backInvestigation"
        >{{ $l.backToPreviousPage }}</el-button
      >
    </div>
    <!-- 内容 -->
    <div>
      <div style="margin-top: 10px">
        <!-- 表格 -->
        <el-table
          :data="tableList.list"
          style="width: 100%"
          highlight-current-row
        >
          <el-table-column :label="this.$l.basicInformation">
            <el-table-column
              v-for="(item, index) in tableList.columns1"
              :key="index"
              :prop="item.key"
              :label="item.title || item.key"
              :width="item.width"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span
                  v-if="item.key === 'address'"
                  :title="scope.row[item.key]"
                  class="truncate-lines"
                  v-html="scope.row[item.key]"
                >
                </span>
                <span v-else>
                  {{ scope.row[item.key] }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="this.$l.complianceContactInfor">
            <el-table-column
              v-for="(item, index) in tableList.columns2"
              :key="index"
              :prop="item.key"
              :label="item.title"
              :width="item.width"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <span
                  v-if="item.key === 'contact_name'"
                  :title="scope.row[item.key]"
                  class="truncate-lines"
                  v-html="scope.row[item.key]"
                >
                </span>
                <span
                  v-else-if="item.key === 'contact_phone'"
                  :title="scope.row[item.key]"
                  class="truncate-lines"
                  v-html="scope.row[item.key]"
                >
                </span>
                <span
                  v-else-if="item.key === 'contact_email'"
                  :title="scope.row[item.key]"
                  class="truncate-lines"
                  v-html="scope.row[item.key]"
                >
                </span>
                <span v-else>
                  {{ scope.row[item.key] }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="this.$l.seaAudit">
            <el-table-column
              v-for="(item, index) in tableList.columns4"
              :key="index"
              :prop="item.key"
              :label="item.title"
              :width="item.width"
              show-overflow-tooltip
            >
              <template slot-scope="scope">
                <el-button
                  v-if="item.key === 'audit_file'"
                  type="text"
                  size="small"
                  @click="clickViewFile(scope.row)"
                  style="color: orange"
                >
                  {{ $l.viewFile }}
                </el-button>
                <span
                  v-else-if="item.formatter"
                  v-html="item.formatter(scope.row[item.key])"
                ></span>
                <span v-else-if="item.key === 'is_submit_cap'">
                  {{ scope.row.is_submit_cap == 'Y' ? $l.yes : $l.no }}
                </span>
                <span v-else>
                  {{ scope.row[item.key] }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column fixed="right" :label="this.$c.operation" width="170">
            <template slot-scope="scope">
              <el-button
                @click="checkClick(scope.row, scope.$index)"
                type="text"
                size="small"
                >{{ $c.check }}</el-button
              >

              <el-button
                v-show="showAuth.m_audit && scope.row.rec_status === -1"
                @click="auditNew(scope.row, scope.$index)"
                type="text"
                size="small"
                style="color: green"
                >{{ $l.newOrder }}</el-button
              ><el-button
                v-show="showAuth.m_audit && scope.row.rec_status === 1"
                @click="auditClick(scope.row, scope.$index)"
                type="text"
                size="small"
                style="color: orange"
                >{{ $l.audit }}</el-button
              >
              <el-button
                v-show="showAuth.m_audit && scope.row.rec_status === 7"
                @click="invalid(scope.row, scope.$index)"
                type="text"
                size="small"
                style="color: red"
                >{{ $l.cancelAudit }}</el-button
              >
              <el-button
                v-show="showAuth.m_audit && scope.row.rec_status === 7"
                @click="auditClose(scope.row, scope.$index)"
                type="text"
                size="small"
                style="color: green"
                >{{ $l.end }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <z-pagination
          :pagination="pagination"
          :total="tableList.total"
          :page.sync="tableList.curPage"
          :limit.sync="tableList.pageSize"
          @change="getList"
        >
        </z-pagination>

        <z-form-dialog
          :data="auditSurvey.list"
          :formProps="auditSurvey.formProps"
          :fields="auditSurvey.fields1"
          @submmit="submitAudit"
          :visible.sync="auditFormsVisible"
        >
        </z-form-dialog>

        <!-- 审核 -->
        <z-form-dialog
          :data="auditSurvey.list"
          :formProps="auditSurvey.formProps"
          :fields="auditSurvey.fields"
          @submmit="submitAudit"
          :visible.sync="auditFormVisible"
        >
        </z-form-dialog>

        <!-- 查看 -->
        <el-dialog
          width="80%"
          :lock-scroll="true"
          :visible.sync="checkFormVisible"
          custom-class="custom-dialog"
        >
          <div style="padding: 0 50px">
            <div>
              <el-form :model="checkSurvey.list">
                <el-col :span="24">
                  <el-form-item
                    :label="this.$l.basicInformation"
                  ></el-form-item>
                </el-col>

                <el-form-item :label="this.$l.basicArchives">
                  <el-col :span="8">
                    <el-input v-model="checkSurvey.list.name_zh"></el-input>
                  </el-col>
                </el-form-item>

                <el-col :span="24">
                  <el-form-item :label="this.$l.seaAudit"></el-form-item>
                </el-col>
                <el-col :span="6"
                  ><el-form-item :label="this.$l.dueAuditDate">
                    <el-date-picker
                      v-model="checkSurvey.list.due_audit_date"
                      type="date"
                      :placeholder="this.$l.pleaseSelectAnApprovalDate"
                      value-format="yyyy-MM-dd"
                      style="width: 300px"
                    ></el-date-picker> </el-form-item
                ></el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6"
                  ><el-form-item :label="this.$l.costPayProgress">
                    <el-input
                      v-model="checkSurvey.list.cost_pay_progress"
                      :placeholder="this.$l.pleaseEnterTheAuditResult"
                    ></el-input> </el-form-item
                ></el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6"
                  ><el-form-item :label="this.$l.realAuditDate">
                    <el-date-picker
                      v-model="checkSurvey.list.real_audit_date"
                      type="date"
                      :placeholder="this.$l.pleaseSelectAnApprovalDate"
                      value-format="yyyy-MM-dd"
                      style="width: 300px"
                    ></el-date-picker> </el-form-item
                ></el-col>
                <el-col :span="8"
                  ><el-form-item :label="this.$l.isSubmitCap">
                    <el-radio
                      v-model="checkSurvey.list.is_submit_cap"
                      label="Y"
                      >{{ $l.yes }}</el-radio
                    >
                    <el-radio
                      v-model="checkSurvey.list.is_submit_cap"
                      label="N"
                      >{{ $l.no }}</el-radio
                    >
                  </el-form-item></el-col
                >
                <el-col :span="24">
                  <el-form-item :label="this.$l.auditFile"></el-form-item>
                </el-col>
              </el-form>
            </div>
            <div>
              <!-- 文件表格 -->
              <el-table :data="checkSurvey.fileList" style="width: 90%">
                <el-table-column
                  v-for="(item, index) in checkSurvey.columns"
                  :key="index"
                  :prop="item.key"
                  :label="item.title"
                  :width="item.width"
                >
                </el-table-column>
                <el-table-column
                  fixed="right"
                  :label="this.$c.operation"
                  width="145"
                >
                  <template slot-scope="scope">
                    <el-button
                      @click="getFilePreview(scope.row.file_url)"
                      type="text"
                      size="small"
                      >{{ $c.check }}</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-dialog>

        <!-- 查看附件 -->
        <el-dialog
          width="50%"
          :title="$l.chenck_attachment"
          :lock-scroll="true"
          :visible.sync="viewFileFormVisible"
          custom-class="custom-dialog"
        >
          <div style="padding: 0 50px">
            <!-- 文件表格 -->
            <el-table :data="checkFile.fileList" style="width: 100%">
              <el-table-column
                v-for="(item, index) in checkFile.columns"
                :key="index"
                :prop="item.key"
                :label="item.title"
                :width="item.width"
              >
              </el-table-column>
              <el-table-column
                fixed="right"
                :label="this.$c.operation"
                width="100"
              >
                <template slot-scope="scope">
                  <el-button
                    @click="getFilePreview(scope.row.file_url)"
                    type="text"
                    size="small"
                    >{{ $c.check }}</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-dialog>
      </div>
    </div>

    <!-- 预览 -->
    <filePreviews
      v-if="fileUrl"
      :file-url="fileUrl"
      :visible="dialogVisible"
      @update:visible="dialogVisible = $event"
    />
  </div>
</template>
      <script>
import {
  _,
  api,
  zTable,
  zPagination,
  zFormDialog,
  initFuncs,
  zForm,
} from '@/views/_common'
import axios from 'axios'
import filePreviews from '../../_common/filePreviews.vue'
export default {
  name: 'investigation',
  components: {
    zTable,
    zPagination,
    zFormDialog,
    initFuncs,
    zForm,
    filePreviews,
  },
  data() {
    return {
      name: 'investigation',
      pageLoading: false,
      checkFormVisible: false,
      selectFormVisible: false,
      auditFormVisible: false,
      auditFormsVisible: false,
      viewFileFormVisible: false,
      dialogVisible: false,
      file_url: '',
      file_name: '',
      file_suffix: '',
      fileUrl: null,
      isImage: false,
      isPdf: false,
      isText: false,
      fileContent: '',
      deleteFalg: 'N',
      fileInfo: {},
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
      formProps: {
        dialogWidth: '80%',
        labelWidth: '160px',
      },
      pagination: {
        // 分页组件配置 如不需分页，可以把pagination设置为null
        layout: 'prev, pager, next, jumper, ->, total,sizes',
        pagerCount: 7,
        pageSizes: [10, 15, 20, 30, 40, 50, 100],
      },
      queryList: {
        manufacture_name: '',
        manufacture_id: '',
        address: '',
        requestor_facility_type: '',
        name: '',
        audit_time: '',
        rec_status: null,
      },
      fileList: [],
      rec_status: [
        {
          label: this.$l.cancelAudit,
          value: 0,
        },
        {
          label: this.$l.newOrder,
          value: 1,
        },
        {
          label: this.$l.audit,
          value: 7,
        },
        {
          label: this.$l.end,
          value: 99,
        },
      ],
      // 尽职调查列表
      tableList: {
        list: [],
        pageSize: 15,
        curPage: 1,
        total: 0,
        columns1: [
          {
            title: '调查年份',
            key: 'survey_year',
            width: 100,
          },
          {
            title: this.$l.nameZh,
            key: 'name_zh',
            width: 120,
          },
          {
            title: this.$l.address,
            key: 'address',
            width: 150,
          },
          {
            title: this.$l.requestorFacilityType,
            key: 'requestor_facility_type',
            width: 130,
          },
        ],
        columns2: [
          {
            title: this.$l.name,
            key: 'contact_name',
            width: 80,
          },
          {
            title: this.$l.contactPhone,
            key: 'contact_phone',
            width: 100,
          },
          {
            title: this.$l.contactEmail,
            key: 'contact_email',
            width: 190,
          },
        ],
        // columns3: [
        //   {
        //     title: this.$l.auditDate,
        //     key: 'audit_time',
        //     width: 140,
        //   },
        //   {
        //     title: this.$l.auditResult,
        //     key: 'audit_result',
        //     width: 100,
        //   },
        // ],
        columns4: [
          {
            title: this.$l.dueAuditDate,
            key: 'due_audit_date',
            width: 140,
          },
          {
            title: this.$l.costPayProgress,
            key: 'cost_pay_progress',
            width: 120,
          },
          {
            title: this.$l.realAuditDate,
            key: 'real_audit_date',
            width: 140,
          },
          {
            title: this.$l.recStatus,
            key: 'rec_status',
            width: 100,
            formatter: this.formatterRec,
          },
          {
            title: this.$l.auditFile,
            key: 'audit_file',
            width: 80,
          },
          {
            title: this.$l.isSubmitCap,
            key: 'is_submit_cap',
            width: 140,
          },
        ],
      },
      // 查看
      checkSurvey: {
        list: {},
        fileList: [],
        fields1: [
          {
            title: this.$l.nameZh,
            key: 'name_zh',
            props: {
              disabled: true,
            },
            span: 8,
          },
          {
            title: this.$l.address,
            key: 'address',
            props: {
              disabled: true,
            },
            span: 8,
          },
          {
            title: this.$l.requestorFacilityType,
            key: 'name_zh',
            props: {
              disabled: true,
            },
            span: 8,
          },
          {
            title: this.$l.name,
            key: 'contact_name',
            props: {
              disabled: true,
            },
            span: 8,
          },
          {
            title: this.$l.contactPhone,
            key: 'contact_phone',
            props: {
              disabled: true,
            },
            span: 8,
          },
          {
            title: this.$l.contactEmail,
            key: 'contact_email',
            props: {
              disabled: true,
            },
            span: 8,
          },
          {
            title: this.$l.auditDate,
            key: 'audit_time',
            props: {
              disabled: true,
            },
            name: 'date',
            span: 8,
          },
          {
            title: this.$l.auditResult,
            key: 'aduit_result',
            props: {
              disabled: true,
            },
            span: 8,
          },
          {
            title: this.$l.dueAuditDate,
            key: 'due_audit_date',
            props: {
              disabled: true,
            },
            name: 'date',
            span: 8,
          },
          {
            title: this.$l.costPayProgress,
            key: 'cost_pay_progress',
            props: {
              disabled: true,
            },
            span: 8,
          },
          {
            title: this.$l.realAuditDate,
            key: 'real_audit_date',
            props: {
              disabled: true,
            },
            name: 'date',
            span: 8,
          },
          {
            title: this.$l.auditResult,
            key: 'vehicleStime',
            props: {
              disabled: true,
            },
            span: 8,
          },
          {
            title: this.$l.isSubmitCap,
            key: 'is_submit_cap',
            props: {
              disabled: true,
            },

            span: 8,
          },
        ],
        columns: [
          {
            title: this.$l.fileName,
            key: 'file_name',
            width: 220,
          },

          {
            title: this.$l.fileSuffix,
            key: 'file_suffix',
            width: 140,
          },
          {
            title: this.$l.createUser,
            key: 'create_user',
            width: 140,
          },
          {
            title: this.$l.createTime,
            key: 'create_time',
            width: 140,
          },
          {
            title: this.$l.modifyUser,
            key: 'modify_user',
            width: 140,
          },
          {
            title: this.$l.modifyTime,
            key: 'modify_time',
            width: 140,
          },
        ],
      },

      // 查看附件
      checkFile: {
        list: {},
        fileList: [],
        columns: [
          {
            title: this.$l.fileName,
            key: 'file_name',
            width: 260,
          },

          {
            title: this.$l.fileSuffix,
            key: 'file_suffix',
            width: 140,
          },
          {
            title: this.$l.createUser,
            key: 'create_user',
            width: 120,
          },
          {
            title: this.$l.createTime,
            key: 'create_time',
            width: 140,
          },
          {
            title: this.$l.modifyUser,
            key: 'modify_user',
            width: 120,
          },
          {
            title: this.$l.modifyTime,
            key: 'modify_time',
            width: 140,
          },
        ],
      },

      // 基础档案
      manufacture: {
        list: [],
        queryString: '',
        columns: [
          {
            title: this.$l.manufactureId,
            key: 'manufacture_id',
            width: 100,
          },
          {
            title: this.$l.manufacturerName,
            key: 'name_zh',
            width: 100,
          },
          {
            title: this.$l.manufacturerNameEn,
            key: 'name_en',
            width: 100,
          },

          {
            title: this.$l.manufacturerAddress,
            key: 'address',
            width: 100,
          },
          {
            title: this.$l.namlegalPersoneEn,
            key: 'legal_person',
            width: 100,
          },
          {
            title: this.$l.contactName,
            key: 'contact_name',
            width: 100,
          },

          {
            title: this.$l.contactPhone,
            key: 'contact_phone',
            width: 100,
          },

          {
            title: this.$l.contactEmail,
            key: 'contact_email',
            width: 100,
          },
          {
            title: this.$l.contactJobTitle,
            key: 'contact_job_title',
            width: 100,
          },
          {
            title: this.$l.country,
            key: 'country',
            width: 100,
          },
          {
            title: this.$l.customsNumber,
            key: 'customs_number',
            width: 100,
          },
          {
            title: this.$l.requestorFacilityType,
            key: 'requestor_facility_type',
            width: 100,
          },
        ],
      },
      tableData: [],

      //   审核
      auditSurvey: {
        list: {},
        formProps: {
          dialogWidth: '40%',
          labelWidth: '150px',
        },
        fields: [
          {
            title: this.$l.auditResult,
            key: 'rec_status',
            name: 'select',
            value: 'value',
            label: 'label',
            options: [
              {
                value: 7,
                label: this.$l.pass,
              },
              {
                value: -1,
                label: this.$l.fail,
              },
            ],
            span: 18,
          },
          {
            title: this.$l.auditRemarks,
            key: 'audit_result',
            name: 'textarea',
            span: 18,
          },
        ],
        fields1: [
          {
            title: this.$l.auditRemarks,
            key: 'audit_result',
            name: 'textarea',
            span: 18,
          },
        ],
      },
    }
  },
  methods: {
    /* 查询 */

    // 尽职调查列表
    getList() {
      console.log(this.queryList)
      this.$request(
        api.baseUrl + '/Compliance/complianceSurvey/getManufacturerHisList',
        this.queryList
      )
        .then((r) => {
          this.tableList.list = r.data
          // this.tableList.total = r.data.total
        })
        .catch(() => {
          this.pageLoading = false
        })
    },

    submitForm() {
      console.log(this.queryList)
      this.getList()
    },
    // 获取基础档案
    getManufacturerList() {
      this.$request(
        api.baseUrl + '/Compliance/complianceManufacturer/getlist',
        {}
      )
        .then((r) => {
          console.log(r)
          this.manufacture.list = r.data.list
        })
        .catch(() => {
          this.pageLoading = false
        })
    },

    /* 新增尽职调查 */

    /* 查看表格数据 */

    // 查看
    checkClick(row, index) {
      this.pageLoading = true
      this.checkSurvey.list = _.cloneDeep(row)
      this.checkviewFile(row.survey_id)
        .then((r) => {
          console.log(r)
          if (r.data && r.data.length == 0) {
            this.checkFormVisible = true
            this.pageLoading = false
          } else {
            const processedFiles = r.data.map((file) => {
              const { file_url, file_name, file_type } = file
              this.file_name = file_name
              this.file_url = file_url
              this.file_type = file_type
              const fileExtension = this.getFileExtension(file_name)
              // 创建新对象并添加额外属性
              return {
                ...file, // 拷贝原文件的所有属性
                file_suffix: fileExtension,
                attachment_type: '1',
              }
            })
            this.checkSurvey.fileList = processedFiles
            this.checkFormVisible = true
            this.pageLoading = false
          }
        })
        .catch(() => {
          this.pageLoading = false
        })
    },

    /* 查看历史 */
    historyClick(row, index) {
      console.log(row)
    },

    /* 附件 */

    // 提交附件 返回附件信息
    submmitfile(addList, fileList) {
      console.log(addList)
      console.log(fileList)
      const formData = new FormData()
      formData.append('file', fileList[0])
      formData.append('attachment_type', addList[0].attachment_type)
      let r = this.$request(
        api.baseUrl + '/Compliance/complianceAttachments/uploadAttachment',
        formData,
        'post'
      )
      return r
    },
    // 删除附件
    removeEditFile(row, index) {
      console.log(row)
      let i = index + 1
      this.$confirm(
        '此操作将删除第' + i + '条数据, 是否继续?',
        '删除帮助手册',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          this.$request(
            api.baseUrl + '/Compliance/complianceAttachments/deleteAttchment',
            {
              key: row.id,
              value: this.deleteFalg,
            },
            'post'
          )
            .then((r) => {
              this.$message({
                type: 'success',
                message: '删除成功',
              })
              // this.getList()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: '删除失败',
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除',
          })
        })
    },

    /* 功能，工具方法 */

    // 重置搜索
    resetForm() {
      console.log('ccc')
      this.queryList = {}
    },

    // 选择附件
    file(fileList) {
      return new Promise((resolve, reject) => {
        const fileInfos = []

        for (let i = 0; i < fileList.length; i++) {
          const file = fileList[i]
          const file_name = file.name
          const fileExtension = this.getFileExtension(file_name)
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
    },

    // 生成附件后缀
    getFileExtension(file_name) {
      return file_name.slice(
        Math.max(0, file_name.lastIndexOf('.')) || Infinity
      )
    },

    // 审核状态
    auditClick(row, index) {
      this.auditSurvey.list = {}
      let auditClone = _.cloneDeep(row)
      this.auditFlag(auditClone, auditClone.rec_status)
    },
    // 新单
    auditNew(row, index) {
      this.auditSurvey.list = {}
      let auditClone = _.cloneDeep(row)
      this.auditFlags(auditClone, 1)
    },
    // 取消审核
    invalid(row, index) {
      this.auditSurvey.list = {}
      let auditClone = _.cloneDeep(row)
      this.auditFlags(auditClone, 1)
    },
    // 结案
    auditClose(row, index) {
      this.auditSurvey.list = {}
      let auditClone = _.cloneDeep(row)
      this.auditFlags(auditClone, 99)
    },
    // 审核
    auditFlag(row, i) {
      this.$set(this.auditSurvey.list, 'survey_id', row.survey_id)
      this.auditFormVisible = true
    },
    // 新单，取消审核，结案
    auditFlags(row, i) {
      this.$set(this.auditSurvey.list, 'survey_id', row.survey_id)
      console.log(row.rec_status)
      console.log(i)
      this.$set(this.auditSurvey.list, 'rec_status', i)

      this.auditFormsVisible = true
    },
    // 提交审核
    submitAudit() {
      console.log(this.auditSurvey.list)
      if (
        !this.auditSurvey.list.rec_status &&
        this.auditSurvey.list.rec_status == null
      ) {
        this.$message({
          type: 'info',
          message: '请选择审核结果',
        })
      }
      this.$confirm('正在审核该数据, 是否继续?', '尽职调查', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$request(
            api.baseUrl + '/Compliance/complianceSurvey/auditSurvey',
            this.auditSurvey.list,
            'post'
          )
            .then((r) => {
              console.log(r)
              this.$message({
                type: 'success',
                message: '审核成功',
              })
              this.getList()
              this.auditSurvey.list = {}
              this.auditFormVisible = false
              this.auditFormsVisible = false
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '审核失败',
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消审核',
          })
        })
    },

    // 格式化审核状态
    formatterRec(row) {
      console.log(row)
      const found = this.rec_status.find((e) => e.value == row)
      if (found) {
        return found.label
      }
    },

    // 公共 获取附件
    checkviewFile(id) {
      let r = this.$request(
        api.baseUrl +
          '/Compliance/complianceAttachments/checkManufacturerAttachments',
        {
          id: id,
          file_type: 1,
        }
      )
      return r
    },

    clickViewFile(row) {
      this.viewFileFormVisible = true
      this.checkviewFile(row.survey_id)
        .then((r) => {
          const processedFiles = r.data.map((file) => {
            const { file_url, file_name, file_type } = file
            this.file_name = file_name
            this.file_url = file_url
            this.file_type = file_type
            const fileExtension = this.getFileExtension(file_name)
            // 创建新对象并添加额外属性
            return {
              ...file, // 拷贝原文件的所有属性
              file_suffix: fileExtension,
              attachment_type: '1',
            }
          })
          this.checkFile.fileList = processedFiles

          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    },

    // 点击查看文件
    viewFile(id) {
      console.log(id)
      this.pageLoading = true

      this.$request(
        api.baseUrl +
          '/Compliance/complianceAttachments/checkManufacturerAttachments',
        {
          id: id,
          file_type: 1,
        }
      )
        .then((r) => {
          console.log(r)
          if (r.data.length == 0) {
            this.pageLoading = false
            return this.$message({
              type: 'info',
              message: '暂无文件',
            })
          }
          const { file_url, file_name, file_type } = r.data[0]
          this.file_name = file_name
          this.file_url = file_url
          this.file_type = file_type
          console.log(file_url)
          // this.downloadFile(file_url, file_name)
          this.getFilePreview(file_url)

          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    },

    // 预览文件
    getFilePreview(url) {
      console.log(url)
      const urls = api.baseUrl + '/' + url
      this.fileUrl = urls
      this.dialogVisible = true
    },

    backInvestigation() {
      this.$store
        .dispatch('delView', this.$router.currentRoute)
        .then(({ visitedViews }) => {
          this.$router.push('/compliance/investigation').catch(() => {})
        })
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
  created() {
    console.log(this.$route.query.manufacture_id)
    this.queryList.manufacture_id = this.$route.query.manufacture_id
    this.getList()
    this.getUserAuth()
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
      <style scoped>
</style>
