<template>
  <div class="app-container" v-loading="pageLoading">
    <!-- 查询 -->
    <div>
      <el-form :inline="true" :model="queryList" label-position="right" label-width="140px">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="this.$l.helpManual"></el-form-item>
            <el-form-item>
              <!-- <el-button
                v-show="showAuth.m_search"
                @click="getList()"
                type="primary"
                >{{ $c.queryButton }}</el-button
              > -->
            </el-form-item>
          </el-col>

          <el-col :span="4">
            <el-form-item>
              <el-button v-show="showAuth.m_add" @click="addClickHelp()" type="primary">{{ $l.cAdd }}</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="this.$l.seamainContact"></el-form-item>
          </el-col>
          <el-col :span="4">
            <el-form-item>
              <el-button v-show="showAuth.m_add" @click="addClickCis()" type="primary">{{ $l.cAdd }}</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <div style="padding: 0 50px">
              <el-table :data="helpManualList.list" style="width: 100%; height: 700px" max-height="650" highlight-current-row>
                <el-table-column v-for="(item, index) in helpManualList.columns" :key="index" :prop="item.key" :label="item.title || item.key" :width="item.width" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="item.key === 'file_name'">
                      <a href="javascript:void(0);" @click="getFilePreview(scope.row.file_url)">{{ scope.row.file_name }}</a>
                    </span>
                    <span v-else-if="item.key === 'serialNumbers'">
                      {{ scope.$index + 1 }}
                    </span>
                    <span v-else>
                      {{ scope.row[item.key] }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" :label="this.$c.operation" width="120">
                  <template slot-scope="scope">
                    <el-button v-show="showAuth.m_del" @click="deleteClick(scope.row, scope.$index)" type="text" size="small">{{ $c.delete }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <z-pagination :pagination="pagination" :total="helpManualList.total" :page.sync="helpManualList.curPage" :limit.sync="helpManualList.pageSize" @change="getList"></z-pagination>
            </div>
          </el-col>
          <el-col :span="11">
            <div style="padding: 0 50px">
              <el-table :data="CisCContacterList.list" style="width: 100%; height: 700px" max-height="650" highlight-current-row>
                <el-table-column v-for="(item, index) in CisCContacterList.columns" :key="index" :prop="item.key" :label="item.title || item.key" :width="item.width" show-overflow-tooltip>
                  <template slot-scope="scope">
                    <span v-if="item.key === 'serialNumbers'">
                      {{ scope.$index + 1 }}
                    </span>
                    <span v-else>
                      {{ scope.row[item.key] }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" :label="this.$c.operation" width="120">
                  <template slot-scope="scope">
                    <el-button v-show="showAuth.m_del" @click="deleteCisClick(scope.row, scope.$index)" type="text" size="small">{{ $c.delete }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
              <z-pagination :pagination="pagination" :total="CisCContacterList.total" :page.sync="CisCContacterList.curPage" :limit.sync="CisCContacterList.pageSize" @change="getCisList"></z-pagination>
            </div>
          </el-col>
        </el-row>
      </el-form>

      <el-dialog title="aaa" width="60%" :lock-scroll="true" :visible.sync="addHelpFormVisible">
        <div style="padding: 0 50px">
          <input type="file" @change="file" ref="fileinput" style="display: none" />
          <el-col :span="24">
            <el-button type="primary" @click="$refs.fileinput.click()">{{ $l.selectFile }}</el-button>
          </el-col>
          <el-table :data="addHelpManual.fileList" style="width: 90%">
            <el-table-column v-for="(item, index) in addHelpManual.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
            <el-table-column fixed="right" :label="this.$c.operation" width="145">
              <template slot-scope="scope">
                <el-button @click="removeClick(scope.row)" type="text" size="small">{{ $c.delete }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <span slot="footer" style="padding: 0 50px">
          <el-button @click="addHelpFormVisible = false">{{ $t('common').cancel }}</el-button>
          <el-button type="primary" @click="submmitaddHelp">
            {{ $t('common').confirm }}
          </el-button>
          <slot name="operation"></slot>
        </span>
      </el-dialog>

      <el-dialog title="aaa" width="60%" :lock-scroll="true" :visible.sync="addCisFormVisible">
        <div style="padding: 0 50px">
          <el-form :model="addCisCCtacter.list" :inline="true" label-position="left" label-width="160px">
            <el-col v-for="(item, index) in addCisCCtacter.fields" :key="index" :span="item.span">
              <el-form-item :label="item.title" :prop="item.key">
                <component :is="getComponentType(item.type)" v-model="addCisCCtacter.list[item.key]" :placeholder="item.placeholder" :rules="item.rules"></component>
              </el-form-item>
            </el-col>
          </el-form>
        </div>
        <span slot="footer" style="padding: 0 50px">
          <el-button @click="addCisFormVisible = false">{{ $t('common').cancel }}</el-button>
          <el-button type="primary" @click="submmitaddCis">
            {{ $t('common').confirm }}
          </el-button>
          <slot name="operation"></slot>
        </span>
      </el-dialog>

      <filePreviews v-if="fileUrl" :file-url="fileUrl" :visible="dialogVisible" @update:visible="dialogVisible = $event" />
    </div>
  </div>
</template>
<script>
import { _, api, zTable, zPagination, zFormDialog, initFuncs, zForm } from '@/views/_common'
import axios from 'axios'
import filePreviews from '../../_common/filePreviews.vue'
// import FilePreview from 'vue-file-preview'
//引入VueOfficeDocx组件
// import VueOfficeDocx from '@vue-office/docx'
//引入相关样式
// import '@vue-office/docx/lib/index.css'
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
            width: 100,
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
            width: 50,
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
            // rules: [{ required: true, message: '姓名不能为空', trigger: 'blur' }]
          },
          {
            title: this.$l.contactEmail,
            key: 'contacter_mail',
            type: 'el-input',
            placeholder: this.$l.pleaseEnterAMailbox,
            span: 8,
          },
          {
            title: this.$l.contactPhone,
            key: 'contacter_phone',
            type: 'el-input',
            placeholder: this.$l.pleaseEnterThePhone,
            span: 8,
          },
        ],
      },
    }
  },
  methods: {
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
          message: '附件添加失败',
        })
      }
      const formData = new FormData()
      formData.append('file', this.fileList[0])
      formData.append('attachment_type', this.addHelpManual.fileList[0].attachment_type)
      this.$request(api.baseUrl + '/Compliance/complianceAttachments/uploadAttachment', formData, 'post')
        .then((r) => {
          console.log(r)
          this.$message({
            type: 'success',
            message: this.$c.success,
          })
          this.addHelpFormVisible = false
          this.addHelpManual.fileList = []
          this.clearFileInput()
          this.getList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '附件添加失败',
          })
        })
    },

    addClickCis() {
      this.addCisFormVisible = true
    },
    submmitaddCis() {
      console.log(this.addCisCCtacter.list)
      this.$confirm('此操作将新增该数据, 是否继续?', '新增联系人', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
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
                message: '添加失败',
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '添加失败',
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
                message: '删除失败',
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
<style>
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
