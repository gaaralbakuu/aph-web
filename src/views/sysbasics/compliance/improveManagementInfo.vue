<template>
  <div class="app-container" v-loading="pageLoading">
    <div>
      <el-button type="success" @click="backInvestigation">{{$l.backToPreviousPage}}</el-button>
      <el-button type="success" @click="getList">{{$l.refresh}}</el-button>
    </div>
    <!-- 内容 -->
    <div>
      <div style="margin-top: 10px">
        <!-- 表格 -->
        <el-table :data="tableList.list" style="width: 100%" highlight-current-row>
          <el-table-column :label="$l.issueBasicInfo">
            <el-table-column v-for="(item, index) in tableList.columns1" :key="index" :prop="item.key"
              :label="item.title || item.key" :width="item.width" show-overflow-tooltip>
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
          <el-table-column :label="$l.t1SubconCap">
            <el-table-column v-for="(item, index) in tableList.columns2" :key="index" :prop="item.key"
              :label="item.title" :width="item.width" show-overflow-tooltip>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="$l.lt1FactoryVerification">
            <el-table-column v-for="(item, index) in tableList.columns3" :key="index" :prop="item.key"
              :label="item.title" :width="item.width" show-overflow-tooltip>
            </el-table-column>
          </el-table-column>

          <el-table-column fixed="right" :label="$l.operation" width="170">
            <template slot-scope="scope">
              <el-button @click="audit(scope.row, scope.$index)" type="text" size="small">{{$l.audit}}</el-button>

              <el-button @click="getHisList(scope.row, scope.$index)" type="text" size="small">{{$l.viewHistory}}</el-button>
            </template>
          </el-table-column>
        </el-table>

        <z-pagination :pagination="pagination" :total="tableList.total" :page.sync="tableList.curPage"
          :limit.sync="tableList.pageSize" @change="getList">
        </z-pagination>

        <!-- 查看 -->

      </div>
    </div>

    <!-- 预览 -->
    <filePreviews v-if="fileUrl" :file-url="fileUrl" :visible="dialogVisible"
      @update:visible="dialogVisible = $event" />


      <el-dialog :title="$l.auditResult" :visible.sync="visible.passForm" width="30%">
      <el-form>
        <el-form-item :label="$l.results" :label-width="formLabelWidth">
          <el-radio-group v-model="check.rec_status">
            <el-radio v-model="check.rec_status" label="7">
              {{$l.pass}}
            </el-radio>
            <el-radio v-model="check.rec_status" label="-1">
              {{$l.fail}}
            </el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$l.capCompleted" :label-width="formLabelWidth">
          <el-radio-group v-model="check.is_finish">
            <el-radio v-model="check.is_finish" label="Y">{{$l.completed}}</el-radio>
            <el-radio v-model="check.is_finish" label="N">{{$l.notCompleted}}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$l.verificationDetails" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="check.verify_detail" :placeholder="$l.verificationDetailsPlaceholder"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="visible.passForm = false">{{$l.cancel}}</el-button>
        <el-button type="primary" @click="passsubmit">{{$l.submit}}</el-button>
      </div>
    </el-dialog>
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
  name: 'improveManagementInfo',
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
      check:{

      },
      pagination: {
        // 分页组件配置 如不需分页，可以把pagination设置为null
        layout: 'prev, pager, next, jumper, ->, total,sizes',
        pagerCount: 7,
        pageSizes: [10, 15, 20, 30, 40, 50, 100],
      },
      queryList: {
        id: '',
        page: 1,
        pageSize: 12
      },
      fileList: [],
      visible:{
        passForm:false
      },
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
            title: this.$l.serialNumbers,
            key: 'serialNumbers',
            width: 100,
          },
          {
            title: this.$l.issueType,
            key: 'issue_type',
            width: 100,
          },
          {
            title: this.$l.issueDesc,
            key: 'issue_desc',
            width: 120,
          },
          {
            title: this.$l.issueSuggest,
            key: 'issue_suggest',
            width: 150,
          },
        ],
        columns2: [
          {
            title: this.$l.correctivePlan,
            key: 'corrective_plan',
            width: 80,
          },
          {
            title: this.$l.contactPhone,
            key: 'contact_phone',
            width: 90,
          },
          {
            title: this.$l.correctivePrincipal,
            key: 'corrective_principal',
            width: 190,
          },
          {
            title: this.$l.correctiveDate,
            key: 'corrective_date',
            width: 190,
          },
        ],
        columns3: [
          {
            title: this.$l.verifyDetail,
            key: 'verify_detail',
            width: 140,
          },
          {
            title: this.$l.auditResult,
            key: 'audit_result',
            width: 100,
          },
          {
            title: this.$l.isVerifyPass,
            key: 'is_verify_pass',
            width: 100,
          },
          {
            title: this.$l.verifyDate,
            key: 'verify_date',
            width: 100,
          },
        ]
      },
      tableData: [],
    }
  },
  methods: {
    /* 查询 */

    // 尽职调查列表
    getList() {
      // const id = this.clickRow.id
      // console.log(id)
      // this.is_his = this.is_his == 1 ? 0 : 1
      this.$request(
        api.baseUrl + '/Compliance/complianceIssues/getIssuesDetail',
        this.queryList,
        'get'
      ).then((response) => {
        this.tableList.list = response.data.list.detail
      })
    },

    audit(){
      this.visible.passForm=true;
    },


    /* 附件 */



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
        '/Compliance/complianceAttachments/checkManufacturerAttachments',
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
          this.$router.push('/compliance/ImproveManagement').catch(() => { })
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
    console.log(this.$route.query)
    // this.queryList.id = this.$route.query.id
    this.queryList.id = 'b649d270-407b-46f0-9612-35c015801e5a'
    this.getList()
    this.getUserAuth()
  },
}
</script>
<style scoped></style>
