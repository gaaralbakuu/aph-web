<template>
  <div class="app-container" v-loading="pageLoading">
    <!-- 查询 -->
    <div>
      <el-form
        :inline="true"
        :model="queryList"
        label-position="right"
        label-width="140px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item :label="this.l.helpManual"> </el-form-item>
            <!-- <el-form-item>
                <el-button @click="getList()" type="primary">{{ c.queryButton
                }}</el-button>
              </el-form-item> -->
          </el-col>
          <!-- <el-col :span="4">
            <el-form-item>
              <el-button @click="getList()" type="primary">{{ c.queryButton
              }}</el-button>
            </el-form-item>
          </el-col> -->

          <!-- <el-col :span="4">
              <el-form-item>
                <el-button @click="addClickHelp()" type="primary">{{ l.cAdd
                }}</el-button>
              </el-form-item>
            </el-col> -->
          <el-col :span="12">
            <el-form-item :label="this.l.seamainContact"> </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
            <el-form-item>
              <el-button @click="addClickCis()" type="primary">{{ l.cAdd
              }}</el-button>
            </el-form-item>
          </el-col> -->
          <!-- <el-col :span="4">
            <el-form-item>
              <el-button @click="getList()" type="primary">{{ c.queryButton
              }}</el-button>
            </el-form-item>
          </el-col> -->
          <el-col :span="11">
            <div style="padding: 0 50px">
              <el-table
                :data="helpManualList.list"
                style="width: 100%; height: 700px"
                max-height="650"
                highlight-current-row
              >
                <el-table-column
                  v-for="(item, index) in helpManualList.columns"
                  :key="index"
                  :prop="item.key"
                  :label="item.title || item.key"
                  :width="item.width"
                  show-overflow-tooltip
                >
                  <template #default="scope">
                    <span v-if="item.key === 'file_name'">
                      <a
                        href="javascript:void(0);"
                        @click="getFilePreview(scope.row.file_url)"
                        >{{ scope.row.file_name }}</a
                      >
                    </span>
                    <span v-else-if="item.key === 'serialNumbers'">
                      {{ scope.$index + 1 }}
                    </span>
                    <span v-else>
                      {{ scope.row[item.key] }}
                    </span>
                  </template>
                </el-table-column>
                <!-- <el-table-column
                  fixed="right"
                  :label="this.c.operation"
                  width="120"
                >
                  <template #default="scope">
                    <el-button
                      @click="deleteClick(scope.row, scope.$index)"
                      type="text"
                      size="small"
                      >{{ c.delete }}</el-button
                    >
                  </template>
                </el-table-column> -->
              </el-table>
              <z-pagination
                :pagination="pagination"
                :total="helpManualList.total"
                v-model:page="helpManualList.curPage"
                v-model:limit="helpManualList.pageSize"
                @change="getList"
              >
              </z-pagination>
            </div>
          </el-col>

          <el-col :span="11">
            <div style="padding: 0 50px">
              <el-table
                :data="CisCContacterList.list"
                style="width: 100%; height: 700px"
                max-height="650"
                highlight-current-row
              >
                <el-table-column
                  v-for="(item, index) in CisCContacterList.columns"
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
                <!-- <el-table-column
                  fixed="right"
                  :label="this.c.operation"
                  width="120"
                >
                  <template #default="scope">
                    <el-button
                      @click="deleteCisClick(scope.row, scope.$index)"
                      type="text"
                      size="small"
                      >{{ c.delete }}</el-button
                    >
                  </template>
                </el-table-column> -->
              </el-table>
              <z-pagination
                :pagination="pagination"
                :total="CisCContacterList.total"
                v-model:page="CisCContacterList.curPage"
                v-model:limit="CisCContacterList.pageSize"
                @change="getCisList"
              >
              </z-pagination>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <el-dialog
        title="aaa"
        width="60%"
        :lock-scroll="true"
        v-model:visible="addHelpFormVisible"
      >
        <div style="padding: 0 50px">
          <input
            type="file"
            @change="file"
            ref="fileinput"
            style="display: none"
          />
          <el-col :span="24"
            ><el-button type="primary" @click="$refs.fileinput.click()">{{ l.selectFile
            }}</el-button></el-col
          >
          <el-table :data="addHelpManual.fileList" style="width: 90%">
            <el-table-column
              v-for="(item, index) in addHelpManual.columns"
              :key="index"
              :prop="item.key"
              :label="item.title"
              :width="item.width"
            >
            </el-table-column>
            <!-- <el-table-column
              fixed="right"
              :label="this.c.operation"
              width="145"
            >
              <template #default="scope">
                <el-button
                  @click="removeClick(scope.row)"
                  type="text"
                  size="small"
                  >{{ c.delete }}</el-button
                >
              </template>
            </el-table-column> -->
          </el-table>
        </div>
        <template #footer><span style="padding: 0 50px">
          <el-button @click="addHelpFormVisible = false">{{
            $t('common').cancel
          }}</el-button>
          <el-button type="primary" @click="submmitaddHelp">
            {{ $t('common').confirm }}
          </el-button>
          <slot name="operation"></slot>
        </span></template>
      </el-dialog>

      <el-dialog
        title="aaa"
        width="60%"
        :lock-scroll="true"
        v-model:visible="addCisFormVisible"
      >
        <div style="padding: 0 50px">
          <el-form
            :model="addCisCCtacter.list"
            :inline="true"
            label-position="left"
            label-width="160px"
          >
            <el-col
              v-for="(item, index) in addCisCCtacter.fields"
              :key="index"
              :span="item.span"
            >
              <el-form-item :label="item.title" :prop="item.key">
                <component
                  :is="getComponentType(item.type)"
                  v-model="addCisCCtacter.list[item.key]"
                  :placeholder="item.placeholder"
                  :rules="item.rules"
                ></component> </el-form-item
            ></el-col>
          </el-form>
        </div>
        <template #footer><span style="padding: 0 50px">
          <el-button @click="addCisFormVisible = false">{{
            $t('common').cancel
          }}</el-button>
          <el-button type="primary" @click="submmitaddCis">
            {{ $t('common').confirm }}
          </el-button>
          <slot name="operation"></slot>
        </span></template>
      </el-dialog>

      <FilePreviews
        v-if="fileUrl"
        :file-url="fileUrl"
        :visible="dialogVisible"
        @update:visible="dialogVisible = $event"
      />
    </div>
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
  name: 'shareInformation',
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
      name: 'shareInformation',
      pageLoading: false,
      addHelpFormVisible: false,
      addCisFormVisible: false,
      dialogVisible: false,
      selectedFile: null,
      showPreview: false,
      fileList: [],
      fileUrl: null,
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
        address: '',
        requestor_facility_type: '',
        name: '',
        audit_time: '',
        rec_status: null,
      },
      // 尽职调查列表
      helpManualList: {
        list: [],
        pageSize: 15,
        curPage: 1,
        total: 0,
        columns: [
          {
            title: this.l.serialNumbers,
            key: 'serialNumbers',
            width: 100,
          },
          {
            title: this.l.manualName,
            key: 'file_name',
            width: 340,
          },
        ],
      },

      CisCContacterList: {
        list: [],
        pageSize: 15,
        curPage: 1,
        total: 0,
        columns: [
          {
            title: this.l.serialNumbers,
            key: 'serialNumbers',
            width: 100,
          },
          {
            title: this.l.contactEmail,
            key: 'contacter_mail',
            width: 280,
          },
          {
            title: this.l.contactPhone,
            key: 'contacter_phone',
            width: 120,
          },
        ],
      },
      options: [
        {
          value: '0A',
          label: this.l.businessLicense, // { businessLicense: '营业执照' }
        },
        {
          value: '0B',
          label: 'NDA0C',
        },
        {
          value: '0C',
          label: this.l.otherAttachment, // { otherAttachment: '其他附件' }
        },
        {
          value: '1',
          label: this.l.dueDiligence, // { dueDiligence: '尽职调查' }
        },
        {
          value: '2',
          label: this.l.improve, // { improve: '改善' }
        },
      ],
      addHelpManual: {
        list: [],
        fileList: [],
        optionsList: '',
        pageSize: 15,
        curPage: 1,
        total: 0,
        columns: [
          {
            title: this.l.manualName,
            key: 'file_name',
            width: 400,
          },
          {
            title: this.l.fileSuffix,
            key: 'file_suffix',
            width: 250,
          },
        ],
      },
      addCisCCtacter: {
        list: {},
        addCisList: {
          contacter_name: '',
          contacter_mail: '',
          contacter_phone: '',
          is_valid: 'Y',
        },
        optionsList: '',
        pageSize: 15,
        curPage: 1,
        total: 0,
        fields: [
          {
            title: this.l.name,
            key: 'contacter_name',
            type: 'el-input',
            placeholder: this.l.pleaseEnterAName,
            span: 8,
            // rules: [{ required: true, message: '姓名不能为空', trigger: 'blur' }]
          },
          {
            title: this.l.contactEmail,
            key: 'contacter_mail',
            type: 'el-input',
            placeholder: this.l.pleaseEnterAMailbox,
            span: 8,
          },
          {
            title: this.l.contactPhone,
            key: 'contacter_phone',
            type: 'el-input',
            placeholder: this.l.pleaseEnterThePhone,
            span: 8,
          },
        ],
      },
    }
  },
  methods: {
    // 获取帮助手册
    getList() {
      this.$request(
        api.baseUrl +
          '/ComplianceOutside/complianceAttachmentsOutside/getStudyFile',
        {
          page: this.helpManualList.curPage,
          pageSize: this.helpManualList.pageSize,
        }
      )
        .then((r) => {
          console.log(r)
          this.helpManualList.list = r.data.list
          this.helpManualList.total = r.data.total
          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    },

    // APE SEA主要联系人
    getCisList() {
      this.$request(
        api.baseUrl +
          '/ComplianceOutside/ComplianceContacterOutside/getCisCContacter',
        {
          page: this.CisCContacterList.curPage,
          pageSize: this.CisCContacterList.pageSize,
        }
      )
        .then((r) => {
          console.log(r)
          this.CisCContacterList.list = r.data.list
          this.CisCContacterList.total = r.data.total
          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    getComponentType(type) {
      // 根据 item.type 返回对应的组件
      switch (type) {
        case 'el-input':
          return 'el-input'
        default:
          return 'el-input' // 默认使用 el-input
      }
    },

    addClickHelp() {
      this.addHelpFormVisible = true
    },
    submmitaddHelp() {
      console.log(this.fileList)
      console.log(this.addHelpManual.fileList)
      if (this.fileList && this.fileList.length == 0) {
        this.$message({
          type: 'info',
          message: this.l.attachmentAddFail, // { attachmentAddFail: '附件添加失败' }
        })
      }
      const formData = new FormData()
      formData.append('file', this.fileList[0])
      formData.append(
        'attachment_type',
        this.addHelpManual.fileList[0].attachment_type
      )
      this.$request(
        api.baseUrl + '/Compliance/complianceAttachments/uploadAttachment',
        formData,
        'post'
      )
        .then((r) => {
          console.log(r)
          this.$message({
            type: 'success',
            message: this.l.attachmentAddSuccess, // { attachmentAddSuccess: '附件添加成功' }
          })
          this.addHelpFormVisible = false
          this.getList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.l.attachmentAddFail, // { attachmentAddFail: '附件添加失败' }
          })
        })
    },

    addClickCis() {
      this.addCisFormVisible = true
    },
    submmitaddCis() {
      console.log(this.addCisCCtacter.list)
      this.$confirm(
        this.l.confirmAddRow, // { confirmAddRow: '此操作将新增该数据, 是否继续?' }
        this.l.addContact, // { addContact: '新增联系人' }
        {
          confirmButtonText: this.l.confirm, // { confirm: '确定' }
          cancelButtonText: this.l.cancel, // { cancel: '取消' }
          type: 'warning',
        }
      )
        .then(() => {
          this.$request(
            api.baseUrl + '/Compliance/ComplianceContacter/addCisCContacter',
            this.addCisCCtacter.list,
            'post'
          )
            .then((r) => {
              console.log(r)
              this.$message({
                type: 'success',
                message: this.l.attachmentAddSuccess, // { attachmentAddSuccess: '附件添加成功' }
              })
              this.getCisList()
              this.addCisFormVisible = false
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: this.l.addFail, // { addFail: '添加失败' }
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.l.addFail, // { addFail: '添加失败' }
          })
        })
    },

    deleteCisClick(row, index) {
      console.log(row)
      let i = index + 1
      this.$confirm(
        this.l.confirmDeleteRow.replace('{row}', i), // { confirmDeleteRow: '此操作将删除第{row}行数据, 是否继续?' }
        this.l.deleteContact, // { deleteContact: '删除联系人' }
        {
          confirmButtonText: this.l.confirm, // { confirm: '确定' }
          cancelButtonText: this.l.cancel, // { cancel: '取消' }
          type: 'warning',
        }
      )
        .then(() => {
          this.$request(
            api.baseUrl + '/Compliance/ComplianceContacter/deleteCisCContacter',
            { id: row.id },
            'post'
          )
            .then((r) => {
              console.log(r)
              this.$message({
                type: 'success',
                message: this.l.deleteSuccess, // { deleteSuccess: '删除成功' }
              })
              this.getCisList()
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: this.l.deleteFail, // { deleteFail: '删除失败' }
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.l.deleteFail, // { deleteFail: '删除失败' }
          })
        })
    },

    // 选择附件
    file(e) {
      console.log(e)
      this.fileList = e.target.files
      console.log(this.fileList)
      for (let i = 0; i < this.fileList.length; i++) {
        const file = this.fileList[i]
        const file_name = this.fileList[i].name
        const fileExtension = this.getFileExtension(file_name)
        const reader = new FileReader()

        console.log(fileExtension)
        reader.onloadend = () => {
          const base64String = reader.result.split(',')[1]
          let fileInfo = {
            file_name: this.fileList[i].name,
            file_suffix: fileExtension,
            attachment_type: 3,
            fileContent: base64String,
          }
          this.addHelpManual.fileList = []
          this.addHelpManual.fileList.push(fileInfo)
        }

        reader.readAsDataURL(file)
      }
    },
    getFileExtension(file_name) {
      return file_name.slice(
        Math.max(0, file_name.lastIndexOf('.')) || Infinity
      )
    },
    removeClick() {
      console.log(this.addHelpManual.fileList)
      this.addHelpManual.fileList = []
      this.clearFileInput()
      console.log(this.fileList)
    },
    clearFileInput() {
      this.$refs.fileinput.value = '' // 清空文件输入框
    },

    // 预览文件
    getFilePreview(url) {
      this.pageLoading = true
      const urls = api.baseUrl + '/' + url
      this.fileUrl = urls
      this.dialogVisible = true
      this.pageLoading = false
    },
    // 删除附件
    deleteClick(row, index) {
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
              key: row.manufacturerAttchmentId,
              value: 'N',
            },
            'post'
          )
            .then((r) => {
              this.$message({
                type: 'success',
                message: '删除成功',
              })
              this.getList()
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
  },
  beforeDestroy() {
    // 清除事件监听器
    if (this.$refs.previewContainer) {
      this.$refs.previewContainer.removeEventListener('contextmenu', () => {})
      this.$refs.previewContainer.removeEventListener('touchstart', () => {})
      this.$refs.previewContainer.removeEventListener('touchend', () => {})
    }
  },
  created() {
    this.getList()
    this.getCisList()
  },
}
</script>
      <style scoped>
/* .preview-container {
      width: 100%;
      height: 600px;
      border: 1px solid #ccc;
      overflow: hidden;
    } */
/* iframe {
      width: 100%;
      height: 100%;
      display: block;
    } */
</style>
