<template>
  <div class="app-container" v-loading="pageLoading">
    <!-- 查询 -->
    <!-- <div>
        <el-form
          :inline="true"
          :model="queryList"
          label-position="right"
          label-width="140px"
        >
          <el-row>
            <el-col :span="7">
              <el-form-item label="合作伙伴名称">
                <el-input
                  v-model="queryList.manufacture_name"
                  placeholder="请输入合作伙伴名称"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="地址">
                <el-input
                  v-model="queryList.address"
                  placeholder="请输入地址"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="APE是否为LT1工厂">
                <el-select
                  v-model="queryList.requestor_facility_type"
                  placeholder="请选择"
                >
                  <el-option label="是" value="0"></el-option>
                  <el-option label="否" value="1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <el-button
                  @click="submitForm()"
                  icon="el-icon-search"
                  type="primary"
                  >查询</el-button
                >
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item label="姓名">
                <el-input
                  v-model="queryList.name"
                  placeholder="请输入姓名"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="this.l.auditDate">
                <el-date-picker
                  v-model="queryList.audit_time"
                  type="date"
                  :placeholder="this.l.pleaseSelectAnApprovalDate"
                  value-format="yyyy-MM-dd"
                  style="width: 200px"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="7">
              <el-form-item :label="this.l.auditResult">
                <el-input
                  v-model="queryList.rec_status"
                  :placeholder="this.l.pleaseEnterTheAuditResult"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="3">
              <el-form-item>
                <el-button @click="resetForm()" type="info" icon="el-icon-delete"
                  >重置</el-button
                >
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <el-divider></el-divider> -->
    <div>
      <el-button type="success" @click="backInvestigation"
        >返回上一页</el-button
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
          <el-table-column :label="this.l.basicInformation">
            <el-table-column
              v-for="(item, index) in tableList.columns1"
              :key="index"
              :prop="item.key"
              :label="item.title || item.key"
              :width="item.width"
              show-overflow-tooltip
            >
              <template #default="scope">
                <span v-if="item.key === 'serialNumbers'">
                  {{ scope.$index + 1 }}
                </span>
                <span v-else>
                  {{ scope.row[item.key] }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="this.l.complianceContactInfor">
            <el-table-column
              v-for="(item, index) in tableList.columns2"
              :key="index"
              :prop="item.key"
              :label="item.title"
              :width="item.width"
              show-overflow-tooltip
            >
            </el-table-column>
          </el-table-column>
          <el-table-column :label="this.l.latestSeaAudit">
            <el-table-column
              v-for="(item, index) in tableList.columns3"
              :key="index"
              :prop="item.key"
              :label="item.title"
              :width="item.width"
              show-overflow-tooltip
            >
            </el-table-column>
          </el-table-column>
          <el-table-column :label="this.l.annualSeaAudit">
            <el-table-column
              v-for="(item, index) in tableList.columns4"
              :key="index"
              :prop="item.key"
              :label="item.title"
              :width="item.width"
              show-overflow-tooltip
            >
              <template #default="scope">
                <span v-if="item.key === 'audit_file'">
                  <a
                    href="javascript:void(0);"
                    @click="viewFile(scope.row.surveyid)"
                    >{{ l.viewFile }}</a
                  >
                </span>
                <span v-else-if="item.key === 'is_submit_cap'">
                  {{ scope.row.is_submit_cap == 'Y' ? l.yes : l.no }}
                </span>
                <span v-else>
                  {{ scope.row[item.key] }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column fixed="right" :label="this.c.operation" width="170">
            <template #default="scope">
              <el-button
                @click="checkClick(scope.row, scope.$index)"
                type="text"
                size="small"
                >{{ c.check }}</el-button
              >
            </template>
          </el-table-column>
        </el-table>

        <z-pagination
          :pagination="pagination"
          :total="tableList.total"
          v-model:page="tableList.curPage"
          v-model:limit="tableList.pageSize"
          @change="getList"
        >
        </z-pagination>

        <!-- 查看 -->
        <el-dialog
          width="80%"
          :lock-scroll="true"
          v-model:visible="checkFormVisible"
          custom-class="custom-dialog"
        >
          <div style="padding: 0 50px">
            <div>
              <el-form :model="checkSurvey.list">
                <el-col :span="24">
                  <el-form-item
                    :label="this.l.basicInformation"
                  ></el-form-item>
                </el-col>

                <el-form-item :label="this.l.basicArchives">
                  <el-col :span="8">
                    <el-input v-model="checkSurvey.list.name_zh"></el-input>
                  </el-col>
                </el-form-item>

                <el-col :span="24">
                  <el-form-item :label="this.l.latestSeaAudit"></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="this.l.auditDate">
                    <el-date-picker
                      v-model="checkSurvey.list.audit_time"
                      type="date"
                      :placeholder="this.l.pleaseSelectAnApprovalDate"
                      value-format="yyyy-MM-dd"
                      style="width: 300px"
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6"
                  ><el-form-item
                    :label="this.l.nameOfTheThirdPartyOrganization"
                  >
                    <el-input
                      v-model="checkSurvey.list.third_party_org"
                      :placeholder="this.l.pleaseEnterThirdPartyOrganization"
                    ></el-input> </el-form-item
                ></el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6"
                  ><el-form-item :label="this.l.auditResult">
                    <el-input
                      v-model="checkSurvey.list.audit_result"
                      :placeholder="this.l.pleaseEnterTheAuditResult"
                    ></el-input> </el-form-item
                ></el-col>

                <el-col :span="24">
                  <el-form-item :label="this.l.annualSeaAudit"></el-form-item>
                </el-col>
                <el-col :span="6"
                  ><el-form-item :label="this.l.dueAuditDate">
                    <el-date-picker
                      v-model="checkSurvey.list.due_audit_date"
                      type="date"
                      :placeholder="this.l.pleaseSelectAnApprovalDate"
                      value-format="yyyy-MM-dd"
                      style="width: 300px"
                    ></el-date-picker> </el-form-item
                ></el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6"
                  ><el-form-item :label="this.l.costPayProgress">
                    <el-input
                      v-model="checkSurvey.list.cost_pay_progress"
                      :placeholder="this.l.pleaseEnterTheAuditResult"
                    ></el-input> </el-form-item
                ></el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6"
                  ><el-form-item :label="this.l.realAuditDate">
                    <el-date-picker
                      v-model="checkSurvey.list.real_audit_date"
                      type="date"
                      :placeholder="this.l.pleaseSelectAnApprovalDate"
                      value-format="yyyy-MM-dd"
                      style="width: 300px"
                    ></el-date-picker> </el-form-item
                ></el-col>
                <el-col :span="8"
                  ><el-form-item :label="this.l.isSubmitCap">
                    <el-radio
                      v-model="checkSurvey.list.is_submit_cap"
                      label="Y"
                      >{{ l.yes }}</el-radio
                    >
                    <el-radio
                      v-model="checkSurvey.list.is_submit_cap"
                      label="N"
                      >{{ l.no }}</el-radio
                    >
                  </el-form-item></el-col
                >
                <el-col :span="24">
                  <el-form-item :label="this.l.auditFile"></el-form-item>
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
                  :label="this.c.operation"
                  width="145"
                >
                  <template #default="scope">
                    <el-button
                      @click="getFilePreview(scope.row.file_url)"
                      type="text"
                      size="small"
                      >{{ c.check }}</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-dialog>
      </div>
    </div>

    <!-- 预览 -->
    <FilePreviews
      v-if="fileUrl"
      :file-url="fileUrl"
      :visible="dialogVisible"
      @update:visible="dialogVisible = $event"
    />
  </div>
</template>
        <script>
import axios from 'axios'

import {
  _,
  api,
  initFuncs,
  zForm,
  zFormDialog,
  zPagination,
  zTable,
} from '@/views/_common'

import FilePreviews from '../../_common/FilePreviews.vue'
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
          label: this.l.cancelAudit,
          value: 0,
        },
        {
          label: this.l.newOrder,
          value: 1,
        },
        {
          label: this.l.audit,
          value: 7,
        },
        {
          label: this.l.end,
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
            title: this.l.serialNumbers,
            key: 'serialNumbers',
            width: 100,
          },
          {
            title: this.l.nameZh,
            key: 'name_zh',
            width: 120,
          },
          {
            title: this.l.address,
            key: 'address',
            width: 150,
          },
          {
            title: this.l.requestorFacilityType,
            key: 'vehicleStime',
            width: 130,
          },
        ],
        columns2: [
          {
            title: this.l.name,
            key: 'contact_name',
            width: 80,
          },
          {
            title: this.l.contactPhone,
            key: 'contact_phone',
            width: 90,
          },
          {
            title: this.l.contactEmail,
            key: 'contact_email',
            width: 190,
          },
        ],
        columns3: [
          {
            title: this.l.auditDate,
            key: 'audit_time',
            width: 140,
          },
          {
            title: this.l.auditResult,
            key: 'audit_result',
            width: 100,
          },
        ],
        columns4: [
          {
            title: this.l.dueAuditDate,
            key: 'due_audit_date',
            width: 140,
          },
          {
            title: this.l.costPayProgress,
            key: 'cost_pay_progress',
            width: 120,
          },
          {
            title: this.l.realAuditDate,
            key: 'real_audit_date',
            width: 140,
          },
          {
            title: this.l.auditFile,
            key: 'audit_file',
            width: 80,
          },
          {
            title: this.l.isSubmitCap,
            key: 'is_submit_cap',
            formatter: this.formatYN,
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
            title: this.l.nameZh,
            key: 'name_zh',
            props: {
              disabled: true,
            },
            span: 8,
          },
          {
            title: this.l.address,
            key: 'address',
            props: {
              disabled: true,
            },
            span: 8,
          },
          {
            title: this.l.requestorFacilityType,
            key: 'name_zh',
            props: {
              disabled: true,
            },
            span: 8,
          },
          {
            title: this.l.name,
            key: 'contact_name',
            props: {
              disabled: true,
            },
            span: 8,
          },
          {
            title: this.l.contactPhone,
            key: 'contact_phone',
            props: {
              disabled: true,
            },
            span: 8,
          },
          {
            title: this.l.contactEmail,
            key: 'contact_email',
            props: {
              disabled: true,
            },
            span: 8,
          },
          {
            title: this.l.auditDate,
            key: 'audit_time',
            props: {
              disabled: true,
            },
            name: 'date',
            span: 8,
          },
          {
            title: this.l.auditResult,
            key: 'aduit_result',
            props: {
              disabled: true,
            },
            span: 8,
          },
          {
            title: this.l.dueAuditDate,
            key: 'due_audit_date',
            props: {
              disabled: true,
            },
            name: 'date',
            span: 8,
          },
          {
            title: this.l.costPayProgress,
            key: 'cost_pay_progress',
            props: {
              disabled: true,
            },
            span: 8,
          },
          {
            title: this.l.realAuditDate,
            key: 'real_audit_date',
            props: {
              disabled: true,
            },
            name: 'date',
            span: 8,
          },
          {
            title: this.l.auditResult,
            key: 'vehicleStime',
            props: {
              disabled: true,
            },
            span: 8,
          },
          {
            title: this.l.isSubmitCap,
            key: 'is_submit_cap',
            props: {
              disabled: true,
            },

            span: 8,
          },
        ],
        columns: [
          {
            title: this.l.fileName,
            key: 'file_name',
            width: 220,
          },

          {
            title: this.l.fileSuffix,
            key: 'file_suffix',
            width: 140,
          },
          {
            title: this.l.createUser,
            key: 'create_user',
            width: 140,
          },
          {
            title: this.l.createTime,
            key: 'create_time',
            width: 140,
          },
          {
            title: this.l.modifyUser,
            key: 'modify_user',
            width: 140,
          },
          {
            title: this.l.modifyTime,
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
            title: this.l.manufactureId,
            key: 'manufacture_id',
            width: 100,
          },
          {
            title: this.l.manufacturerName,
            key: 'name_zh',
            width: 100,
          },
          {
            title: this.l.manufacturerNameEn,
            key: 'name_en',
            width: 100,
          },

          {
            title: this.l.manufacturerAddress,
            key: 'address',
            width: 100,
          },
          {
            title: this.l.namlegalPersoneEn,
            key: 'legal_person',
            width: 100,
          },
          {
            title: this.l.contactName,
            key: 'contact_name',
            width: 100,
          },

          {
            title: this.l.contactPhone,
            key: 'contact_phone',
            width: 100,
          },

          {
            title: this.l.contactEmail,
            key: 'contact_email',
            width: 100,
          },
          {
            title: this.l.contactJobTitle,
            key: 'contact_job_title',
            width: 100,
          },
          {
            title: this.l.country,
            key: 'country',
            width: 100,
          },
          {
            title: this.l.customsNumber,
            key: 'customs_number',
            width: 100,
          },
          {
            title: this.l.requestorFacilityType,
            key: 'requestor_facility_type',
            width: 100,
          },
        ],
      },
      tableData: [],
    }
  },
  methods: {
    /* 查询 */

    // 尽职调查列表
    getList() {
      console.log(this.queryList)
      this.$request(
        api.baseUrl +
          '/ComplianceOutside/complianceSurveyOutside/getManufacturerHisList',
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
        api.baseUrl +
          '/ComplianceOutside/complianceManufacturerOutside/getlist',
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
      this.checkviewFile(row.surveyid)
        .then((r) => {
          if (r.data && r.data.length == 0) {
            console.log(r)

            this.checkFormVisible = true
            this.pageLoading = false
          } else {
            const { file_url, file_name, file_type } = r.data[0]
            this.file_name = file_name
            this.file_url = file_url
            this.file_type = file_type
            const fileExtension = this.getFileExtension(file_name)
            let rr = _.cloneDeep(r.data)
            this.$set(rr[0], 'file_suffix', fileExtension)
            console.log(rr)
            this.checkSurvey.fileList = rr
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
        api.baseUrl +
          '/ComplianceOutside/complianceAttachmentsOutside/uploadAttachment',
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
            api.baseUrl +
              '/ComplianceOutside/complianceAttachmentsOutside/deleteAttchment',
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

    // 公共 获取附件
    checkviewFile(id) {
      let r = this.$request(
        api.baseUrl +
          '/ComplianceOutside/complianceAttachmentsOutside/checkManufacturerAttachments',
        {
          id: id,
          file_type: 1,
        }
      )
      return r
    },

    // 点击查看文件
    viewFile(id) {
      this.pageLoading = true

      this.$request(
        api.baseUrl +
          '/ComplianceOutside/complianceAttachmentsOutside/checkManufacturerAttachments',
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
          this.$router.push('/investigation').catch(() => {})
        })
    },
    // 获取当前页面用户拥有的操作权限的函数
    getUserAuth() {
      //获取当前页面用户拥有的操作权限的函数
      // this.userAuth = null
      // this.$request(this.$api.checkMenuAuth, {
      //   resourcepath: this.$route.name,
      // }).then((r) => {
      //   this.userAuth = r.data[0]
      // })
    },
  },
  created() {
    console.log(this.$route.query.manufacture_id)
    this.queryList.manufacture_id = this.$route.query.manufacture_id
    this.getList()
    this.getUserAuth()
  },
}
</script>
        <style scoped>
</style>
