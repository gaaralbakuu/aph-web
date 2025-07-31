<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div class="p-3 border-b border-solid border-gray-100 flex flex-col gap-[1px]">
      <div class="text-2xl font-bold text-black">{{ $l.helpManual }} & {{ $l.seamainContact }}</div>
      <div class="text-gray-500 text-sm">{{ $l.manage }}</div>
    </div>

    <!-- Content Section with Tables -->
    <div class="flex-1 p-3 overflow-y-auto">
      <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 h-full">
        
        <!-- Help Manual Section -->
        <div class="flex flex-col">
          <ShareHelpManualTable 
            :data="helpManualList.list" 
            :isLoading="pageLoading"
            :showAuth="showAuth"
            :page="{ page: helpManualList.curPage, pageSize: helpManualList.pageSize }"
            :total="helpManualList.total"
            :pagination="pagination"
            @action="handleHelpManualAction"
            @row-click="handleHelpManualRowClick"
            @add-click="addClickHelp"
            @file-preview="getFilePreview"
            @page-change="getList"
            class="main-table"
          />
        </div>

        <!-- Contact Section -->
        <div class="flex flex-col">
          <ShareContactTable 
            :data="CisCContacterList.list" 
            :isLoading="pageLoading"
            :showAuth="showAuth"
            :page="{ page: CisCContacterList.curPage, pageSize: CisCContacterList.pageSize }"
            :total="CisCContacterList.total"
            :pagination="pagination"
            @action="handleContactAction"
            @row-click="handleContactRowClick"
            @add-click="addClickCis"
            @page-change="getCisList"
            class="main-table"
          />
        </div>
      </div>
    </div>

    <!-- Upload File Dialog -->
    <CustomDialog 
      :title="$l.selectFile" 
      width="70%" 
      :lock-scroll="true" 
      :visible.sync="addHelpFormVisible"
      class="modern-dialog"
    >
      <template #content>
        <div class="flex flex-col gap-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <i class="fa fa-cloud-upload text-white"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">Tải lên tài liệu hướng dẫn</h4>
                  <p class="text-sm text-gray-600">Chọn file PDF, DOC, DOCX để tải lên</p>
                </div>
              </div>
              <button 
                @click="$refs.fileinput.click()" 
                class="inline-flex items-center h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full px-4 shadow-sm transition duration-200 ease-in-out transform hover:scale-105 gap-2"
              >
                <i class="fa fa-folder-open text-sm"></i>
                <span>{{ $l.selectFile }}</span>
              </button>
            </div>
          </div>

          <input type="file" @change="file" ref="fileinput" style="display: none" />
          
          <div v-if="addHelpManual.fileList.length > 0" class="bg-gray-50 rounded-lg p-4">
            <h5 class="font-medium text-gray-900 mb-3">File đã chọn:</h5>
            <el-table :data="addHelpManual.fileList" class="modern-table">
              <el-table-column v-for="(item, index) in addHelpManual.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width">
                <template slot-scope="scope">
                  <span v-if="item.key === 'file_name'" class="font-medium text-gray-900">
                    {{ scope.row[item.key] }}
                  </span>
                  <span v-else-if="item.key === 'file_suffix'" class="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-mono">
                    {{ scope.row[item.key] }}
                  </span>
                  <span v-else>{{ scope.row[item.key] }}</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" :label="$c.operation" width="100">
                <template slot-scope="scope">
                  <button 
                    @click="removeClick(scope.row)" 
                    class="h-8 w-8 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors duration-200"
                  >
                    <i class="fa fa-trash text-sm"></i>
                  </button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="flex gap-3 justify-end">
          <button 
            @click="addHelpFormVisible = false" 
            class="h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200"
          >
            {{ $c.cancel }}
          </button>
          <button 
            @click="submmitaddHelp" 
            class="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            {{ $c.confirm }}
          </button>
        </div>
      </template>
    </CustomDialog>

    <!-- Add Contact Dialog -->
    <CustomDialog 
      :title="$l.addContact" 
      width="70%" 
      :lock-scroll="true" 
      :visible.sync="addCisFormVisible"
      class="modern-dialog"
    >
      <template #content>
        <div class="flex flex-col gap-6">
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <i class="fa fa-user-plus text-white"></i>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">Thêm người liên hệ mới</h4>
                <p class="text-sm text-gray-600">Vui lòng điền đầy đủ thông tin liên hệ</p>
              </div>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <el-form :model="addCisCCtacter.list" :inline="false" label-position="top" class="modern-form">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="(item, index) in addCisCCtacter.fields" :key="index" class="form-group">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ item.title }}
                    <span v-if="item.required" class="text-red-500">*</span>
                  </label>
                  <component 
                    :is="getComponentType(item.type)" 
                    v-model="addCisCCtacter.list[item.key]" 
                    :placeholder="item.placeholder" 
                    class="w-full h-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>
            </el-form>
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="flex gap-3 justify-end">
          <button 
            @click="addCisFormVisible = false" 
            class="h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200"
          >
            {{ $c.cancel }}
          </button>
          <button 
            @click="submmitaddCis" 
            class="h-10 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            {{ $c.confirm }}
          </button>
        </div>
      </template>
    </CustomDialog>

    <!-- File Preview Dialog -->
    <filePreviews 
      v-if="fileUrl" 
      :file-url="fileUrl" 
      :visible="dialogVisible" 
      @update:visible="dialogVisible = $event" 
    />
  </div>
</template>
<script>
import { _, api, zTable, zPagination, zFormDialog, initFuncs, zForm } from '@/views/_common'
import axios from 'axios'
import filePreviews from '../../_common/filePreviews.vue'
import CustomDialog from '../../_common/CustomDialog.vue'
import ShareHelpManualTable from './share-help-manual-table.vue'
import ShareContactTable from './share-contact-table.vue'

export default {
  name: 'shareInformation',
  components: {
    zTable,
    zPagination,
    zFormDialog,
    initFuncs,
    zForm,
    filePreviews,
    CustomDialog,
    ShareHelpManualTable,
    ShareContactTable,
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
            title: this.$l.serialNumbers,
            key: 'serialNumbers',
            width: 200,
          },
          {
            title: this.$l.manualName,
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
            title: this.$l.serialNumbers,
            key: 'serialNumbers',
            width: 200,
          },
          {
            title: this.$l.name,
            key: 'contacter_name',
            width: 100,
          },
          {
            title: this.$l.contactEmail,
            key: 'contacter_mail',
            width: 280,
          },
          {
            title: this.$l.contactPhone,
            key: 'contacter_phone',
            width: 120,
          },
        ],
      },
      options: [
        {
          value: '0A',
          label: '营业执照',
        },
        {
          value: '0B',
          label: 'NDA0C',
        },
        {
          value: '0C',
          label: '其他附件',
        },
        {
          value: '1',
          label: '尽职调查',
        },
        {
          value: '2',
          label: '改善',
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
            title: this.$l.manualName,
            key: 'file_name',
            width: 400,
          },
          {
            title: this.$l.fileSuffix,
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
            title: this.$l.name,
            key: 'contacter_name',
            type: 'el-input',
            placeholder: this.$l.pleaseEnterAName,
            span: 8,
            required: true,
            // rules: [{ required: true, message: '姓名不能为空', trigger: 'blur' }]
          },
          {
            title: this.$l.contactEmail,
            key: 'contacter_mail',
            type: 'el-input',
            placeholder: this.$l.pleaseEnterAMailbox,
            span: 8,
            required: true,
          },
          {
            title: this.$l.contactPhone,
            key: 'contacter_phone',
            type: 'el-input',
            placeholder: this.$l.pleaseEnterThePhone,
            span: 8,
            required: false,
          },
        ],
      },
    }
  },
  methods: {
    // Handle actions from Help Manual Table
    handleHelpManualAction({ action, row }) {
      console.log('Help Manual action:', action, row)
      
      if (action === 'view') {
        this.getFilePreview(row.file_url)
      } else if (action === 'delete') {
        this.deleteClick(row, row._index !== undefined ? row._index : null)
      }
    },

    handleHelpManualRowClick(row) {
      // Handle row click if needed
      console.log('Help Manual row clicked:', row)
      this.getFilePreview(row.file_url)
    },

    // Handle actions from Contact Table
    handleContactAction({ action, row }) {
      console.log('Contact action:', action, row)
      
      if (action === 'view') {
        // Implement view contact details if needed
        console.log('View contact:', row)
      } else if (action === 'edit') {
        // Implement edit contact if needed
        console.log('Edit contact:', row)
      } else if (action === 'delete') {
        this.deleteCisClick(row, row._index !== undefined ? row._index : null)
      }
    },

    handleContactRowClick(row) {
      // Handle row click if needed
      console.log('Contact row clicked:', row)
    },
    // 获取帮助手册
    getList() {
      this.$request(api.baseUrl + '/Compliance/complianceAttachments/getStudyFile', {
        page: this.helpManualList.curPage,
        pageSize: this.helpManualList.pageSize,
      })
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
      this.$request(api.baseUrl + '/Compliance/ComplianceContacter/getCisCContacter', {
        page: this.CisCContacterList.curPage,
        pageSize: this.CisCContacterList.pageSize,
      })
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
          message: this.$l.attachmentAddFail,
        })
        return
      }
      const formData = new FormData()
      formData.append('file', this.fileList[0])
      formData.append('attachment_type', this.addHelpManual.fileList[0].attachment_type)
      this.$request(api.baseUrl + '/Compliance/complianceAttachments/uploadAttachment', formData, 'post')
        .then((r) => {
          console.log(r)
          this.$message({
            type: 'success',
            message: this.$l.attachmentAddSuccess,
          })
          this.addHelpFormVisible = false
          this.addHelpManual.fileList = []
          this.clearFileInput()
          this.getList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$l.attachmentAddFail,
          })
        })
    },

    addClickCis() {
      this.addCisFormVisible = true
    },
    submmitaddCis() {
      console.log(this.addCisCCtacter.list)
      this.$confirm(this.$l.confirmAddRow, this.$l.addContact, {
        confirmButtonText: this.$c.confirm,
        cancelButtonText: this.$c.cancel,
        type: 'warning',
      })
        .then(() => {
          this.$request(api.baseUrl + '/Compliance/ComplianceContacter/addCisCContacter', this.addCisCCtacter.list, 'post')
            .then((r) => {
              console.log(r)
              this.$message({
                type: 'success',
                message: this.$c.success,
              })
              this.getCisList()
              this.addCisFormVisible = false
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: this.$l.addFail,
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$l.addFail,
          })
        })
    },

    deleteCisClick(row, index) {
      console.log(row)
      let i = index + 1
      this.$confirm(this.$l.deleteContactContent.replace('$1', i), this.$l.deleteContactTitle, {
        confirmButtonText: this.$c.sure,
        cancelButtonText: this.$c.cancel,
        type: 'warning',
      })
        .then(() => {
          this.$request(api.baseUrl + '/Compliance/ComplianceContacter/deleteCisCContacter', { id: row.id }, 'post')
            .then((r) => {
              console.log(r)
              this.$message({
                type: 'success',
                message: this.$c.success,
              })
              this.getCisList()
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: this.$c.info,
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$c.info,
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
      return file_name.slice(Math.max(0, file_name.lastIndexOf('.')) || Infinity)
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
      this.$confirm(this.$l.deleteTutorialContent.replace('$1', i), this.$l.deleteTutorialTitle, {
        confirmButtonText: this.$c.sure,
        cancelButtonText: this.$c.cancel,
        type: 'warning',
      })
        .then(() => {
          this.$request(
            api.baseUrl + '/Compliance/complianceAttachments/deleteAttchment',
            {
              key: row.manufacturerAttchmentId,
              value: 'N',
            },
            'post'
          )
            .then((r) => {
              this.$message({
                type: 'success',
                message: this.$c.success,
              })
              this.getList()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$l.deleteFail,
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$c.info,
          })
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
<style lang="scss" scoped>
// Modern table styling
.modern-table {
  border: none;
  border-radius: 8px;
  overflow: hidden;

  :deep(.el-table__header-wrapper) {
    th {
      background-color: #f9fafb;
      color: #374151;
      font-weight: 600;
      border: none;
      font-size: 14px;
      padding: 16px 12px;
    }
  }

  :deep(.el-table__body-wrapper) {
    td {
      border: none;
      border-bottom: 1px solid #f3f4f6;
      padding: 16px 12px;
      font-size: 14px;
    }

    tr:hover {
      background-color: #f9fafb;
    }
  }

  :deep(.el-table__empty-block) {
    background-color: #f9fafb;
  }
}

// Modern dialog styling
.modern-dialog {
  :deep(.el-dialog) {
    border-radius: 16px;
    border: none;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
  }

  :deep(.el-dialog__header) {
    border-bottom: 1px solid #f3f4f6;
    padding: 24px 24px 16px;
    margin-bottom: 0;
  }

  :deep(.el-dialog__title) {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
  }

  :deep(.el-dialog__body) {
    padding: 24px;
  }

  :deep(.el-dialog__footer) {
    border-top: 1px solid #f3f4f6;
    padding: 16px 24px 24px;
  }
}

// Modern form styling
.modern-form {
  .form-group {
    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #374151;
    }

    :deep(.el-input__inner) {
      border-radius: 8px;
      border: 1px solid #d1d5db;
      height: 40px;
      font-size: 14px;
      transition: all 0.2s ease-in-out;

      &:focus {
        border-color: #3b82f6;
        box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
      }
    }
  }
}

// Custom pagination styling
.custom-pagination {
  :deep(.el-pagination) {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;

    .el-pager li {
      border-radius: 6px;
      min-width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 500;
      transition: all 0.2s ease-in-out;

      &.active {
        background-color: #3b82f6;
        color: white;
      }

      &:hover:not(.active) {
        background-color: #f3f4f6;
      }
    }

    .btn-prev,
    .btn-next {
      border-radius: 6px;
      min-width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease-in-out;

      &:hover {
        background-color: #f3f4f6;
      }
    }
  }
}

.main-table {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.main-table .modern-table {
  border-radius: 8px;
  overflow: hidden;
}

.main-table .modern-table .el-table__header-wrapper {
  background: #f8fafc;
}

.main-table .modern-table .el-table__header th {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #374151;
}

.main-table .modern-table .el-table__row:hover {
  background-color: #f8fafc;
}

// Animation classes
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>
