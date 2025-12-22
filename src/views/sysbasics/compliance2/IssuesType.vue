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

    <el-dialog :title="$l.select" :visible.sync="selectFormVisible" width="70%">
      <el-table :data="manufacture.tableData" height="400px">
        <el-table-column v-for="(item, index) in manufacture.column" :key="index" :label="item.label" :prop="item.key">
        </el-table-column>
        <el-table-column align="right">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" @click="selectManufacture(scope.$index, scope.row)">select</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-table :data="detailtable" border>
      <el-table-column :label="$l.ordinal" type="index" width="50"></el-table-column>
      <el-table-column prop="issue_type" :label="$l.issueType" width="70">
      </el-table-column>
      <el-table-column prop="issue_desc" :label="$l.issueDesc" width="250">
      </el-table-column>
      <el-table-column prop="issue_suggest" :label="$l.suggest" width="250">
      </el-table-column>
      <el-table-column prop="corrective_plan" :label="$l.correctivePlan" width="250">
      </el-table-column>
      <el-table-column prop="attchments" :label="$l.attchments" width="120">
        <template slot-scope="scope">
          <el-button type="text" @click="getAtt(scope.$index, scope.row)">查看附件</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="corrective_principal" :label="$l.correctivePrincipal" width="120">
      </el-table-column>
      <el-table-column prop="corrective_date" :label="$l.correctiveDate" width="90">
      </el-table-column>
      <el-table-column prop="verify_detail" :label="$l.verifyDetail" width="250">
      </el-table-column>
      <el-table-column prop="is_finish" :label="$l.isFinish" width="110" :formatter="formatIsFinish">
      </el-table-column>
      <el-table-column prop="is_verify_pass" :label="$l.isPass" width="90" :formatter="formatIsPass">
      </el-table-column>
      <el-table-column prop="audit_time" :label="$l.verifyDate" width="90">
      </el-table-column>
      <el-table-column fixed="right" :label="$l.operate" width="130" v-if="showHis == false">
        <template slot-scope="scope">
          <el-button @click="editDetail(scope.$index, scope.row)" type="text">{{ $l.Rectification }}</el-button>
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
    <el-dialog :title="$l.Rectification" :visible.sync="editVisible" width="50%">
      <el-form :model="editForm" :rules="rules" ref="editForm">
        <el-form-item :label="$l.correctiveDate" :label-width="formLabelWidth" prop="corrective_date">
          <el-date-picker v-model="editForm.corrective_date" type="datetime" :placeholder="$l.inputCorrective_date">
          </el-date-picker>
        </el-form-item>
        <el-form-item :label="$l.correctivePrincipal" :label-width="formLabelWidth" prop="corrective_principal">
          <el-input v-model="editForm.corrective_principal" :placeholder="$l.inputPrincipal"></el-input>
        </el-form-item>
        <el-form-item :label="$l.correctivePlan" :label-width="formLabelWidth" prop="corrective_plan">
          <el-input type="textarea" v-model="editForm.corrective_plan" :placeholder="$l.inputPlan"
            :autosize="{ minRows: 4 }"></el-input>
        </el-form-item>
        <!-- <el-form-item :label="$l.fileName" :label-width="formLabelWidth" prop="fileName">
          <el-input v-model="editForm.fileName" :placeholder="$l.inputfileName" class="custom-textarea"></el-input>
        </el-form-item> -->
        <!-- <el-form-item :label="$l.attachment_type" style="margin-left: 1.3%;" prop="attachment_type">
          <el-radio-group v-model="editForm.attachment_type">
            <el-radio v-model="editForm.attachment_type" label="0A">{{$l.license}}</el-radio>
            <el-radio v-model="editForm.attachment_type" label="0B">NDA</el-radio>
            <el-radio v-model="editForm.attachment_type" label="0C">{{$l.OtherAttachment}}</el-radio>
            <el-radio v-model="editForm.attachment_type" label="1">{{$l.Diligence}}</el-radio>
            <el-radio  v-model="editForm.attachment_type" label="2">{{$l.enhance}}</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="佐证资料" style="margin-left: 1.3%;">
          <el-upload style="margin-left: 2.5%;" ref="upload" action="" :file-list="fileList" :auto-upload="false"
            :multiple="true" :on-change="handleChange" :on-remove="handleRemove">
            <el-button size="small" type="primary">{{ $l.upload }}</el-button>
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
            <el-button @click="removeAttachments(scope.row, scope.$index, 1)" type="text" size="small">{{ $c.delete
              }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">{{ $l.cancel }}</el-button>
        <el-button type="primary" @click="submitAtt">{{ $l.submit }}</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="fileTableVisable">
      <div>
        <!-- 文件表格 -->
        <el-table :data="file.list" style="width: 90%">
          <el-table-column v-for="(item, index) in file.columns" :key="index" :prop="item.key" :label="item.title"
            :width="item.width">
          </el-table-column>
          <el-table-column fixed="right" :label="this.$c.operation" width="145">
            <template slot-scope="scope">
              <el-button @click="getFilePreview(scope.row.file_url)" type="text" size="small">{{ $c.check }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <FilePreviews v-if="file.fileUrl" :file-url="file.fileUrl" :visible="fileDialogVisible"
      @update:visible="fileDialogVisible = $event" />
  </div>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs';

import {
  getToken
} from '@/utils/auth'
import {
  checkField
} from '@/utils/checkFiled'
import {
  _,
  api,
} from '@/views/_common'

import FilePreviews from '../../_common/FilePreviews.vue'
export default {
  name: 'issuesType',
  components: {
    filePreviews,
  },
  data() {
    return {
      docUrl: '',
      issueType: [],
      labelPosition: 'right',
      detailtable: [],
      forminit: {},
      fileDialogVisible: false,
      fileTableVisable: false,
      showHis: false,
      file: {
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
      },
      table: {
        data: [],
        total: 0,
      },
      query: {
        type: "",
        name: "",
        page: 1,
        pageSize: 6,
        total: 0
      },
      list: [],
      formInline: {
        manufacture_name: '',
        issue_type: '',
        issue_desc: '',
        issue_suggest: '',
        corrective_date: '',
        corrective_principal: '',
      },
      tableData: [{}],
      fileList: [],
      selectFormVisible: false,
      attVisible: false,
      editVisible: false,
      formLabelWidth: '90px',
      form: {
        issue_type: "",
        issue_desc: "",
        issue_suggest: "",
        rec_status: "1",
        is_valid: "Y",
        manufacture_id: "",
      },
      editForm: {
        corrective_plan: '',
        corrective_principal: '',
        corrective_date: '',
        // fileName: '',
        attachment_type: '2'
      },
      userAuth: [],
      manufacture: {
        column: [{
          key: "manufacture_id",
          label: "公司业务id"
        },
        {
          key: "name_zh",
          label: this.$l.CNname
        },
        {
          key: "name_en",
          label: this.$l.ENname
        },
        {
          key: "legal_person",
          label: this.$l.legal_person
        },
        {
          key: "contact_name",
          label: this.$l.contact_name
        },
        {
          key: "contact_phone",
          label: this.$l.contact_phone
        },
        {
          key: "contact_email",
          label: this.$l.contact_email
        },
        {
          key: "customs_number",
          label: this.$l.customs_number
        },
        {
          key: "biz_license_number",
          label: this.$l.biz_license_number
        },
        {
          key: "requestor_facility_name",
          label: this.$l.facility_name
        },
        ],
        tableData: [],
        query: {
          page: 1,
          pageSize: 5,
          manufacture_name: ""
        },
      },
      rules: {
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
        // fileName: [{
        //   required: true,
        //   message: '请输入文件名称',
        //   trigger: 'blur'
        // }],
        attachment_type: [{
          required: true,
          message: '请选择文件类型',
          trigger: 'change'
        }]
      },
    }
  },
  created() {
    this.getList(); // 在组件创建时调用getList方法获取数据
    this.getIssueType()
    this.getUserAuth()
  },
  methods: {
    getIssueType() {
      this.$request(api.baseUrl + "/Requirements/Publiccode/getListdetailed", {
        queryString: {},
        ruleno: 9622,
        orgid: 200,
        pageSize: 999,
        curPage: 1
      }, "get")
        .then(r => {
          this.issueType = r.data.list
          console.log(this.issueType)
        })
    },
    formatIsFinish(row, column, cellValue, index) {
      return cellValue === 'N' ? '未完成' : (cellValue === 'Y' ? '完成' : '');
    },
    formatIsPass(row, column, cellValue, index) {
      return cellValue === 'N' ? '不通过' : (cellValue === 'Y' ? '通过' : '');
    },
    //重置
    resetForm() {
      this.formInline = _.cloneDeep(this.forminit)
      this.$request(api.baseUrl + "/ComplianceOutside/complianceIssuesOutside/getList")
        .then(r => {
          this.tableData = r.data.list
        })
    },
    //获取列表
    getList() {
      this.showHis = false
      this.$request(api.baseUrl + "/ComplianceOutside/complianceIssuesOutside/getIssuesDetail", {
        // id: id,
        // is_his: is_his,
        page: 1,
        pageSize: 12
      }, "get")
        .then(response => {
          this.data = response.data;
          // console.log(this.data)
          this.detailtable = response.data.list.detail
          // console.log(this.detailtable)
          const details = response.data.list.detail;
          details.forEach(detail => {
            detail.manufacture_id = response.data.list.manufacture_id;
          });
          console.log(details)
        })
      // this.getDetails();
    },
    getManufactureList() {
      this.selectFormVisible = true
      this.$request(api.baseUrl + "/Compliance/complianceManufacturer/getlist")
        .then(response => {
          this.manufacture.tableData = response.data.list
          console.log(this.manufacture.tableData);
        })
    },
    selectManufacture(index, item) {
      this.formInline.manufacture_name = item.name_zh;
      this.selectFormVisible = false;
    },
    //查看详情
    getDetails(index, row) {
      this.dialogFormVisible = true
      this.showHis = true
      const detail = [];
      detail.push({
        index,
        row
      });
      const id = detail[0].row.id
      const is_his = 0
      console.log(row)
      this.$request(api.baseUrl + "/ComplianceOutside/complianceIssuesOutside/getIssuesDetail", {
        // id: id,
        // is_his: is_his,
        issue_id: row.issue_id,
        page: 1,
        pageSize: 12
      }, "get")
        .then(response => {
          this.data = response.data;
          // console.log(this.data)
          this.detailtable = response.data.list.detail
          // console.log(this.detailtable)
          const details = response.data.list.detail;
          details.forEach(detail => {
            detail.manufacture_id = response.data.list.manufacture_id;
          });
          console.log(details)
        })
    },
    takeOut(index, row) {
      console.log(row)
      this.$request(api.baseUrl + "/ComplianceOutside/complianceIssuesOutside/takeOutIssue", {
        id: row.id
      }, "post")
        .then(response => {
          this.getList()
        })
    },
    //修改
    editDetail(index, row) {
      this.editdetail = row;
      console.log(this.editdetail)
      this.$request(api.baseUrl + "/ComplianceOutside/complianceIssuesOutside/getIssuesDetail", {
        issue_id: row.issue_id,
        page: 1,
        pageSize: 12
      }, "get")
        .then(response => {
          this.editForm = response.data.list.detail[0];
          // console.log(response)
          this.editVisible = true;
        })

    },
    handleChange(file, fileList) {
      this.fileList = fileList
    },
    // 删除文件之前的钩子，参数为上传的文件和文件列表，若返回 false 或者返回 Promise 且被 reject，则停止删除。function(file, fileList)
    handleRemove(file, fileList) {
      this.fileList = fileList
    },
    submitAtt() {
      console.log("ATT上传的资料", this.editForm)
      this.$refs.editForm.validate((valid) => {
        if (valid) {
          this.attVisible = false
          if (this.fileList.length === 0) {
            return this.$message.warning('请选取文件后再上传')
          }
          const formData = new FormData()
          this.fileList.forEach((file) => {
            formData.append('file', file.raw)
          })
          const id = this.editForm.id
          // formData.append('fileName', this.editForm.fileName)
          // formData.append('id', this.editForm.id)
          const attachment_type = 2;
          formData.append('attachment_type', attachment_type)

          console.log("attachment_type", attachment_type);
          this.$request(api.baseUrl + "/ComplianceOutside/complianceAttachmentsOutside/uploadAttachment",
            formData,
            "post")
            .then(res => {
              console.log(this.editForm.attachments)
              this.editForm.attchments.push(res.data[0])
              //清空fileList
              this.fileList = []
              this.submitEdit()
              this.getList()
            })
        }
      });
    },
    //提交修改结果
    submitEdit() {
      console.log('提交的数据：', this.editForm);
      const originalTimeStr = this.editForm.corrective_date
      const date = new Date(originalTimeStr);
      const attachment = this.attachment
      const formattedTimeStr = date.getFullYear() + '-' +
        ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
        ('0' + date.getDate()).slice(-2) + ' ' +
        ('0' + date.getHours()).slice(-2) + ':' +
        ('0' + date.getMinutes()).slice(-2) + ':' +
        ('0' + date.getSeconds()).slice(-2);
      const id = this.editForm.id
      console.log(attachment)
      this.$request(api.baseUrl + "/ComplianceOutside/complianceIssuesOutside/submitIssue", {
        id: id,
        corrective_plan: this.editForm.corrective_plan,
        corrective_principal: this.editForm.corrective_principal,
        corrective_date: formattedTimeStr,
        attachment: this.editForm.attchments
      }, 'post')
        .then(response => {
          this.data = response.data;
          if (response.httpCode == 200) {
            return this.$message.success('上传成功')
          } else {
            return this.$message.danger('上传失败')
          }
          this.getList();
        });
      this.editVisible = false;
    },
    getAtt(index, row) {
      this.fileTableVisable = true;
      this.file.list = row.attchments
      if (row.attchments.length > 1) {
        this.docUrl = api.baseUrl + '/' + row.attchments[i].file_url
        console.log(this.docUrl)
      } else {
        this.docUrl = api.baseUrl + '/' + row.attchments[0].file_url
        console.log(this.docUrl)
      }
    },
    getFilePreview(url) {
      const urls = api.baseUrl + '/' + url
      console.log(urls)
      this.file.fileUrl = urls
      this.fileDialogVisible = true
    },
    removeAttachments(row, index) {
      this.editForm.attchments.splice(index, 1)
    },
    // 获取当前页面用户拥有的操作权限的函数
    getUserAuth() {
      //获取当前页面用户拥有的操作权限的函数
      // this.userAuth = null
      // this.$request(this.$api.checkMenuAuth, {
      //   resourcepath: this.$route.name,
      // }).then((r) => {
      //   this.userAuth = r.data[0]
      //   console.log(this.userAuth)
      // })
    },
    checkField, //多级表头渲染组件
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
