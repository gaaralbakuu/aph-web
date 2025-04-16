<template>
  <div>
    <div>
      <div class="check">
        <el-form :inline="true" :model="formInline" ref="loginFormRef" :label-position="labelPosition">
          <el-form-item prop="manufacture_name" :label="$l.manufactureName">
            <el-input v-model="formInline.manufacture_name" :placeholder="$l.manufactureName">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="issue_type" :label="$l.issueType">
            <el-input v-model="formInline.issues_type" :placeholder="$l.issueType">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="issue_desc" :label="$l.issueDesc">
            <el-input v-model="formInline.issues_desc" :placeholder="$l.issueDesc">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-button type="primary" plain @click="getList">{{ $l.search }}</el-button>
        </el-form>

        <el-form :inline="true" :model="formInline" ref="FormRef" style="position: relative; left: 1.6%">
          <el-form-item prop="suggest" :label="$l.suggest">
            <el-input v-model="formInline.suggest" :placeholder="$l.suggest">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-form-item prop="corrective_date" :label="$l.correctiveDate">
            <el-input v-model="formInline.corrective_date" :placeholder="$l.correctiveDate">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-form-item style="position: relative; left: 1.65%" prop="corrective_principal" :label="$l.correctivePrincipal">
            <el-input v-model="formInline.corrective_principal" :placeholder="$l.correctivePrincipal">
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
          <el-button plain class="resetbutton" @click="resetForm">{{ $l.reset }}</el-button>
        </el-form>
      </div>
    </div>
    <div>
      <el-divider></el-divider>
    </div>
    <div>
      <el-button type="primary" plain @click="addForm" class="addbutton">
        <i class="el-icon-circle-plus-outline"></i>
        {{ $l.create }}
      </el-button>
      <el-button plain class="addbutton" @click="visabled.uploadFile = true">{{ $l.bulkImport }}</el-button>

      <el-button plain class="addbutton" @click="exportTemplate">{{ $c.downloadTemplate }}</el-button>

      <el-button @click="exportExcel" icon="el-icon-download" type="info" class="fr">{{ $l.download }}</el-button>
      <el-button @click="recEmail()" icon="el-icon-message" type="info" class="fr">{{ $l.emailNotification }}</el-button>
      <!-- <el-button class="downbutton" @click="exportExcel"
        >{{ $l.download }}<i class="el-icon-download el-icon--right"></i
      ></el-button> -->
    </div>
    <el-table :data="tableData.list" style="width: 98%; margin: 1%">
      <el-table-column :label="$l.basicInformation">
        <el-table-column :label="$l.ordinal" type="index" width="50"></el-table-column>
        <el-table-column prop="name_zh" :label="$l.manufactureName" width="150"></el-table-column>
      </el-table-column>
      <el-table-column :label="$l.issueInformation">
        <el-table-column :label="$l.issueType" width="150">
          <template slot-scope="scope">
            <!-- <div v-for="(detail_item, index) in scope.row.detail" :key="index">
              {{ checkField({ detail_item }, ['detail_item', 'issue_type']) }}
            </div> -->
            <div v-for="(detail_item, index) in scope.row.detail" :key="index">
              <span :title="checkField({ detail_item }, ['detail_item', 'issue_type'])" class="truncate-lines" v-html="checkField({ detail_item }, ['detail_item', 'issue_type'])"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$l.issueDesc" width="250">
          <template slot-scope="scope">
            <div v-for="(detail_item, index) in scope.row.detail" :key="index">
              <!-- {{ checkField({ detail_item }, ['detail_item', 'issue_desc']) }} -->
              <span :title="checkField({ detail_item }, ['detail_item', 'issue_desc'])" class="truncate-lines" v-html="checkField({ detail_item }, ['detail_item', 'issue_desc'])"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$l.suggest" width="250">
          <template slot-scope="scope">
            <div v-for="(detail_item, index) in scope.row.detail" :key="index">
              <!-- {{ checkField({ detail_item }, ['detail_item', 'issue_suggest']) }} -->
              <span :title="checkField({ detail_item }, ['detail_item', 'issue_suggest'])" class="truncate-lines" v-html="checkField({ detail_item }, ['detail_item', 'issue_suggest'])"></span>
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column :label="$l.T1subcom">
        <el-table-column :label="$l.correctivePlan" width="250">
          <template slot-scope="scope">
            <div v-for="(detail_item, index) in scope.row.detail" :key="index">
              <!-- {{
                checkField({ detail_item }, ['detail_item', 'corrective_plan'])
              }} -->
              <span :title="checkField({ detail_item }, ['detail_item', 'corrective_plan'])" class="truncate-lines" v-html="checkField({ detail_item }, ['detail_item', 'corrective_plan'])"></span>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="attchments" :label="$l.attchments" width="120">
          <el-button type="text">{{ $l.check }}</el-button>
        </el-table-column> -->
        <el-table-column :label="$l.correctivePrincipal" width="90">
          <template slot-scope="scope">
            <div v-for="(detail_item, index) in scope.row.detail" :key="index">
              <!-- {{
                checkField({ detail_item }, [
                  'detail_item',
                  'corrective_principal',
                ])
              }} -->
              <span :title="checkField({ detail_item }, ['detail_item', 'corrective_principal'])" class="truncate-lines" v-html="checkField({ detail_item }, ['detail_item', 'corrective_principal'])"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$l.correctiveDate" width="140">
          <template slot-scope="scope">
            <div v-for="(detail_item, index) in scope.row.detail" :key="index">
              {{ checkField({ detail_item }, ['detail_item', 'corrective_date']) }}
              <!-- <span
                  :title="checkField({ detail_item }, ['detail_item', 'corrective_date'])"
                  class="truncate-lines"
                  v-html="checkField({ detail_item }, ['detail_item', 'corrective_date'])"
                >
                </span> -->
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column :label="$l.factoryProven">
        <el-table-column :label="$l.verifyDetail" width="250">
          <template slot-scope="scope">
            <div v-for="(detail_item, index) in scope.row.detail" :key="index">
              <!-- {{
                checkField({ detail_item }, ['detail_item', 'verify_detail'])
              }} -->
              <span :title="checkField({ detail_item }, ['detail_item', 'verify_detail'])" class="truncate-lines" v-html="checkField({ detail_item }, ['detail_item', 'verify_detail'])"></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$l.isFinish" width="110">
          <template slot-scope="scope">
            <div v-for="(detail_item, index) in scope.row.detail" :key="index">
              {{ detail_item.is_finish === 'N' ? $l.unfinished : detail_item.is_finish === 'Y' ? $l.finish : '' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$l.isPass" width="90">
          <template slot-scope="scope">
            <div v-for="(detail_item, index) in scope.row.detail" :key="index">
              {{ detail_item.is_verify_pass === 'N' ? $l.noPass : detail_item.is_verify_pass === 'Y' ? $l.pass : '' }}
            </div>
          </template>
        </el-table-column>
        <el-table-column :label="$l.verifyDate" width="140">
          <template slot-scope="scope">
            <div v-for="(detail_item, index) in scope.row.detail" :key="index">
              {{ checkField({ detail_item }, ['detail_item', 'verify_date']) }}
              <!-- <span
                  :title="checkField({ detail_item }, ['detail_item', 'verify_date'])"
                  class="truncate-lines"
                  v-html="checkField({ detail_item }, ['detail_item', 'verify_date'])"
                >
                </span> -->
            </div>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column fixed="right" :label="$l.operate" width="100">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain @click="getDetails(scope.$index, scope.row)">{{ $l.check }}</el-button>
        </template>
      </el-table-column>
    </el-table>

    <z-pagination :pagination="pagination" :total="tableData.total" :page.sync="query.page" :limit.sync="query.pageSize" @change="getList"></z-pagination>

    <el-dialog :title="$l.create" :visible.sync="addFormVisible">
      <el-form :model="form" :rules="rules" ref="form" :label-width="formLabelWidth">
        <el-row style="margin: 20px">
          <el-col :span="24">
            <el-form-item v-show="false" :label="$l.manufacture" prop="manufacture_id">
              <el-input v-model="form.manufacture_id" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$l.manufactureName" prop="name_zh">
              <el-input v-model="form.name_zh" :disabled="true" :placeholder="$l.selectManufacture"></el-input>
              <el-button type="primary" plain @click="showManufacture">{{ $l.selectManufacture }}</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$l.issueType" prop="issue_type">
              <el-input v-model="form.issue_type"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$l.issueDesc" prop="issue_desc">
              <el-input type="textarea" v-model="form.issue_desc" :autosize="{ minRows: 4 }"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$l.suggest" prop="issue_suggest">
              <el-input type="textarea" v-model="form.issue_suggest" :autosize="{ minRows: 4 }"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$l.supportInfo"></el-form-item>
          </el-col>
          <input type="file" @change="addFile" ref="addfileinput" style="display: none" />
          <el-col :span="24">
            <el-button type="primary" @click="$refs.addfileinput.click()">{{ $l.fileUpload }}</el-button>
          </el-col>
          <el-col :span="24">
            <div>
              <!-- 文件表格 -->
              <el-table :data="form.fileList">
                <el-table-column v-for="(item, index) in form.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                <el-table-column fixed="right" :label="this.$c.operation" width="145">
                  <template slot-scope="scope">
                    <el-button @click="removeAddClick(scope.row, scope.$index)" type="text" size="small">{{ $c.delete }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addCancel('form')">{{ $l.cancel }}</el-button>
        <el-button type="primary" plain @click="submit('form')">{{ $l.submit }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$l.check" :visible.sync="dialogFormVisible" width="80%">
      <el-form inline :model="getDetailsQuery">
        <el-form-item prop="manufacture_name" :label="$l.reviewStatus">
          <el-select v-model="getDetailsQuery.rec_status" :placeholder="$l.pleaseSelect">
            <el-option :label="$c.all" value=""></el-option>
            <el-option :label="$l.pendingReview" value="1"></el-option>
            <el-option :label="$l.reviewed" value="7"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="manufacture_name" :label="$l.shoudSaveHistory">
          <el-select v-model="getDetailsQuery.is_his" :placeholder="$l.pleaseSelect">
            <el-option :label="$c.all" value=""></el-option>
            <el-option :label="$l.currentRecord" value="0"></el-option>
            <el-option :label="$l.history" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-button type="primary" @click="getDetail">{{ $c.m_search }}</el-button>
      </el-form>
      <el-table :data="detailtable.list" border style="color: cornflowerblue">
        <el-table-column :label="$l.ordinal" type="index" width="50"></el-table-column>
        <el-table-column prop="issue_type" :label="$l.issueType" width="70"></el-table-column>
        <el-table-column prop="issue_desc" :label="$l.issueDesc" width="300"></el-table-column>
        <el-table-column prop="issue_suggest" :label="$l.suggest" width="300"></el-table-column>
        <el-table-column prop="corrective_principal" :label="$l.correctivePrincipal" width="90"></el-table-column>
        <el-table-column prop="attchments" :label="$l.attchments" width="100">
          <template slot-scope="scope">
            <el-button @click="checkFile(scope.row)" type="text">{{ $l.check }}</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="corrective_date" :label="$l.correctiveDate" width="90"></el-table-column>
        <el-table-column prop="verify_detail" :label="$l.verifyDetail" width="300"></el-table-column>
        <el-table-column prop="is_finish" :label="$l.isFinish" width="110" :formatter="formatIsFinish"></el-table-column>
        <el-table-column prop="is_verify_pass" :label="$l.isPass" width="90" :formatter="formatIsPass"></el-table-column>
        <el-table-column prop="verify_date" :label="$l.verifyDate" width="90"></el-table-column>
        <el-table-column v-if="is_his == 0" fixed="right" :label="$l.operate" width="130">
          <template slot-scope="scope">
            <el-button :disabled="scope.row.rec_status === 7 || scope.row.rec_status === -1" @click="passornot(scope.row)" type="text" size="small">{{ $l.audit }}</el-button>
            <el-button @click="editDetail(scope.$index, scope.row)" v-show="showAuth.m_updata" type="text" size="small">{{ $l.edit }}</el-button>
            &nbsp;
            <el-popconfirm :title="$l.error">
              <el-button v-show="showAuth.m_del" slot="reference" type="text" size="mini">{{ $l.delete }}</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
        <!--        <el-table-column v-if="is_his == 0" fixed="right" label="状态" width="80">
          <template slot-scope="scope">
            <el-button v-if="scope.row.rec_status === 7" v-show="showAuth.m_audit == 'Y'" type="text"
              size="small">通过</el-button>
            <el-button v-if="scope.row.rec_status === 1" type="text" size="small">新单</el-button>
            <el-button v-if="scope.row.rec_status === -1" v-show="showAuth.m_audit == 'Y'" type="text"
              size="small">不通过</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- <el-button v-if="is_his == 1" @click="showHisList(0)" style="margin-left: 96.3%;margin-top:0.5%;" type="primary"
        plain>返回</el-button>
      <el-button v-if="is_his == 0" @click="showHisList(1)" style="margin-left: 93%; margin-top: 0.5%;" type="primary"
        plain>历史记录</el-button> -->
      <!-- <el-pagination
        style="margin-top: 15px"
        @size-change="getList"
        @current-change="showHisList(is_his)"
        :current-page.sync="getDetailsQuery.page"
        :page-sizes="[6, 12, 15, 20]"
        :page-size.sync="getDetailsQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="detailtable.total"
      >
      </el-pagination> -->
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

    <el-dialog :title="$l.result" :visible.sync="passFormVisible" width="40%">
      <el-form>
        <el-form-item :label="$l.results" :label-width="formLabelWidth">
          <el-radio-group v-model="check.rec_status">
            <el-radio v-model="check.rec_status" label="7">{{ $l.pass }}</el-radio>
            <el-radio v-model="check.rec_status" label="-1">{{ $l.noPass }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$l.isFinish" :label-width="formLabelWidth">
          <el-radio-group v-model="check.is_finish">
            <el-radio v-model="check.is_finish" label="Y">{{ $l.finish }}</el-radio>
            <el-radio v-model="check.is_finish" label="N">{{ $l.unfinished }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$l.verifyDetail" :label-width="formLabelWidth">
          <el-input type="textarea" v-model="check.verify_detail" :placeholder="$l.verifyDetail"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="passFormVisible = false">{{ $l.cancel }}</el-button>
        <el-button type="primary" @click="passsubmit">{{ $l.submit }}</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="$l.editInformation" :visible.sync="editVisible" width="50%">
      <el-form :model="editForm">
        <el-form-item :label="$l.issueType">
          <el-select v-model="editForm.issue_type" :placeholder="$l.inputIssue" style="width: 100%">
            <el-option v-for="item in issueType" :key="item.name_zh" :label="item.name_label" :value="item.name_zh"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$l.issueDesc">
          <el-input type="textarea" v-model="editForm.issue_desc" :placeholder="$l.inputDesc"></el-input>
        </el-form-item>
        <el-form-item :label="$l.suggest">
          <el-input type="textarea" v-model="editForm.issue_suggest" :placeholder="$l.inputSuggest"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">{{ $l.cancel }}</el-button>
        <el-button type="primary" @click="submitEdit">{{ $l.submit }}</el-button>
      </span>
    </el-dialog>

    <!-- 文件查看 -->
    <el-dialog :visible.sync="fileTableVisable" :title="$l.viewDocument">
      <div>
        <!-- 文件表格 -->
        <el-table :data="file.list" style="width: 90%">
          <el-table-column v-for="(item, index) in file.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
          <el-table-column fixed="right" :label="this.$c.operation" width="145">
            <template slot-scope="scope">
              <el-button @click="getFilePreview(scope.row.file_url)" type="text" size="small">{{ $c.check }}</el-button>
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
              <el-form-item :label="$l.roles"></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item :label="$l.emailNotificationRole"></el-form-item>
            </el-col>
            <el-col :span="12">
              <el-table :data="roleList.list" style="width: 90%">
                <el-table-column v-for="(item, index) in roleList.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                <el-table-column fixed="right" :label="this.$c.operation" width="145">
                  <template slot-scope="scope">
                    <el-button @click="addRoleItem(scope.row)" type="text" size="small">{{ $l.addNotification }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>

            <el-col :span="12">
              <el-table :data="recEmailList.list" style="width: 90%">
                <el-table-column v-for="(item, index) in recEmailList.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                <el-table-column fixed="right" :label="this.$c.operation" width="145">
                  <template slot-scope="scope">
                    <el-button @click="deleteRoleItem(scope.row)" type="text" size="small" style="color: red">{{ $l.cancellationNotice }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>

            <el-col :span="24">
              <el-form-item :label="$l.sendEmail"></el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item :label="$l.approachingReviewDate">
                <el-date-picker v-model="recEmailList.distanceTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item>
                <el-button type="primary" @click="sendRoleEmail">{{ $l.sendEmail }}</el-button>
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
          <el-form-item :label="$l.upload_file" required>
            <input type="file" accept=".xls,.xlsx" class="el-input" @change="onFileChange" style="border: 1px solid #dcdcdc; border-radius: 5px; padding: 3px" />
          </el-form-item>
        </el-form>
        <div style="margin-top: 40px; text-align: right">
          <el-button type="primary" @click="visabled.uploadFile = false">{{ $c.cancel }}</el-button>
          <el-button type="success" @click="uploadExcel">{{ $c.m_upload }}</el-button>
        </div>
      </div>
    </el-dialog>

    <filePreviews v-if="file.fileUrl" :file-url="file.fileUrl" :visible="fileDialogVisible" @update:visible="fileDialogVisible = $event" />
  </div>
</template>

<script>
import axios from 'axios'
// import { checkField } from '../../utils/checkFiled'
import { checkField } from '@/utils/checkFiled'
import { _, api, zPagination } from '@/views/_common'
import { getToken } from '@/utils/auth'
import dayjs from 'dayjs'
import filePreviews from '../../_common/filePreviews.vue'
export default {
  name: 'issuesType',
  components: {
    filePreviews,
    zPagination,
  },
  data() {
    return {
      api: api.role,
      fileTableVisable: false,
      fileDialogVisible: false,
      recEmailVisible: false,
      issueType: [],
      userAuth: [], //保存用户权限
      visabled: {
        uploadFile: false,
      },
      uploadQuery: {},
      pagination: {
        // 分页组件配置 如不需分页，可以把pagination设置为null
        layout: 'prev, pager, next, jumper, ->, total,sizes',
        pagerCount: 7,
        pageSizes: [10, 15, 20, 30, 40, 50, 100],
      },
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
      file: {
        fileUrl: '',
        list: [],
        columns: [
          {
            title: this.$l.filename,
            key: 'file_name',
            width: 220,
          },

          {
            title: this.$l.fileType,
            key: 'file_type',
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
        ],
      },
      check: {
        rec_status: '',
      },
      clickRow: [],
      labelPosition: 'right',
      passFormVisible: false,
      detailtable: {
        list: [],
        total: 0,
      },
      is_his: 0,
      forminit: {},
      table: {
        data: [],
        total: 0,
      },
      query: {
        type: '',
        name: '',
        page: 1,
        pageSize: 15,
        total: 0,
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
      tableData: {
        total: 0,
        page: 1,
        pageSize: 15,
        list: [],
      },
      manufacture: {
        column: [
          {
            key: 'manufacture_id',
            label: 'manufacture_id',
          },
          {
            key: 'name_zh',
            label: this.$l.CNname,
          },
          {
            key: 'name_en',
            label: this.$l.ENname,
          },
        ],
        tableData: [],
        query: {
          page: 1,
          pageSize: 15,
          manufacture_name: '',
        },
      },
      table: {
        data: [],
        page: 1,
        total: 0,
        column: [
          {
            key: 'name_zh',
            label: this.$l.name_zh,
            width: '',
          },
          {
            key: 'issue_type',
            label: this.$l.issue_type,
            width: '',
          },
          {
            key: 'issue_desc',
            label: this.$l.issue_desc,
            width: '',
          },
          {
            key: 'issue_suggest',
            label: this.$l.issue_suggest,
            width: '',
          },
          {
            key: 'corrective_plan',
            label: this.$l.corrective_plan,
            width: '',
          },
          {
            key: 'attchments',
            label: this.$l.attchments,
            width: '',
          },
          {
            key: 'corrective_principal',
            label: this.$l.corrective_principal,
            width: '',
          },
          {
            key: 'corrective_date',
            label: this.$l.corrective_date,
            width: '',
          },
          {
            key: 'verify_detail',
            label: this.$l.verify_detail,
            width: '',
          },
          {
            key: 'is_finish',
            label: this.$l.is_finish,
            width: '',
          },
          {
            key: 'is_verify_pass',
            label: this.$l.is_verify_pass,
            width: '',
          },
          {
            key: 'verify_date',
            label: this.$l.verify_date,
            width: '',
          },
          {
            key: 'create_time',
            label: this.$l.create_time,
            width: '',
          },
        ],
      },
      addFormVisible: false,
      dialogFormVisible: false,
      dialogSelectManufacture: false,
      editVisible: false,
      formLabelWidth: '130px',
      form: {
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
        columns: [
          {
            title: this.$l.filename,
            key: 'file_name',
            width: 220,
          },

          {
            title: this.$l.fileType,
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
        ],
      },
      editForm: {
        issueType: '',
        issue_desc: '',
        issue_suggest: '',
      },
      rules: {
        issue_type: [
          {
            required: true,
            message: this.$l.pleaseTypeIssue,
            trigger: 'change',
          },
        ],
        issue_desc: [
          {
            required: true,
            message: this.$l.pleaseDescription,
            trigger: 'blur',
          },
        ],
        issue_suggest: [
          {
            required: true,
            message: this.$l.pleaseSuggest,
            trigger: 'blur',
          },
        ],
      },
      getDetailsQuery: {
        page: 1,
        pageSize: 6,
        id: '',
        is_his: '0',
      },

      // 发送邮件
      roleList: {
        list: [],
        query: {
          params: {},
          size: 15,
          page: 1,
          role_type: 'cis',
        },
        total: 0,
        columns: [
          {
            title: this.$l.role_id,
            key: 'role_id',
          },
          {
            title: this.$l.role_name,
            key: 'role_name',
          },
          {
            title: this.$l.role_desc,
            key: 'role_desc',
          },
        ],
        fields: [
          {
            title: this.$l.role_name,
            key: 'role_name',
            required: true,
          },
          {
            title: this.$l.role_desc,
            key: 'role_desc',
            required: true,
          },
        ],
      },
      recEmailList: {
        list: [],
        distanceTime: '',
        total: 0,
        columns: [
          {
            title: this.$l.role_id,
            key: 'role_id',
          },
          {
            title: this.$l.role_name,
            key: 'role_name',
          },
          {
            title: this.$l.role_desc,
            key: 'role_desc',
          },
        ],
      },
      surveyEmail: {
        id: '',
        rec_issues: '',
        rec_survey: '',
        role_id: '',
      },
    }
  },
  created() {
    this.getList() // 在组件创建时调用getList方法获取数据
    this.getIssueType()
    this.getUserAuth()
  },
  methods: {
    getIssueType() {
      this.$request(
        api.baseUrl + '/Requirements/Publiccode/getListdetailed',
        {
          queryString: {},
          ruleno: 9622,
          orgid: 200,
          pageSize: 999,
          curPage: 1,
        },
        'get'
      ).then((r) => {
        this.issueType = r.data.list
        console.log(this.issueType)
      })
    },
    formatIsFinish(row, column, cellValue, index) {
      return cellValue === 'N' ? this.$l.unfinished : cellValue === 'Y' ? this.$l.finish : ''
    },
    formatIsPass(row, column, cellValue, index) {
      return cellValue === 'N' ? this.$l.noPass : cellValue === 'Y' ? this.$l.pass : ''
    },
    //审核
    passornot(row) {
      console.log(row)
      this.passFormVisible = true
      this.check.id = row.id
      console.log(this.check.id)
    },
    //提交审核结果
    passsubmit() {
      this.passFormVisible = false
      const issuesId = this.check.id
      const rec_status = this.check.rec_status
      this.$request(
        api.baseUrl + '/Compliance/complianceIssues/auditIssues',
        {
          issuesId: issuesId,
          rec_status: rec_status,
          is_finish: this.check.is_finish,
          verify_detail: this.check.verify_detail,
        },
        'post'
      ).then((response) => {
        if (response.httpCode == 200) {
          this.$message.success('审核成功')
        } else {
          this.$message.error('审核失败')
        }
      })
    },
    //重置
    resetForm() {
      this.formInline = _.cloneDeep(this.forminit)
      this.$request(api.baseUrl + '/Compliance/complianceIssues/getList').then((r) => {
        this.tableData.list = r.data.list
        this.tableData.total = r.data.total
      })
    },

    //获取列表
    getList() {
      this.$request(
        api.baseUrl + '/Compliance/complianceIssues/getList',
        {
          manufacture_name: this.formInline.manufacture_name,
          issues_type: this.formInline.issues_type,
          issues_desc: this.formInline.issues_desc,
          suggest: this.formInline.suggest,
          corrective_date: this.formInline.corrective_date,
          corrective_principal: this.formInline.corrective_principal,
          query: this.query,
        },
        'get'
      ).then((r) => {
        this.tableData.list = r.data.list
        this.tableData.total = r.data.total
        this.table.total = r.data.total
        console.log(this.tableData.list)
      })
    },
    // getDetails(index, row) {
    //   this.$router.push({
    //     path: '/compliance/ImproveManagementInfo',
    //     query: { id: row.id },
    //   })
    //   console.log(this.$router)
    // },
    //查看详情
    getDetails(index, row) {
      this.dialogFormVisible = true
      const detail = []
      detail.push({
        index,
        row,
      })
      this.clickRow = row
      this.getDetailsQuery.id = detail[0].row.id
      this.getDetail()
    },
    getDetail() {
      this.$request(api.baseUrl + '/Compliance/complianceIssues/getIssuesDetail', this.getDetailsQuery, 'get').then((response) => {
        this.data = response.data
        console.log(this.data)
        this.detailtable.list = response.data.list.detail
        this.detailtable.total = response.data.total
        console.log(this.detailtable)
        const details = response.data.list.detail
        details.forEach((detail) => {
          detail.manufacture_id = response.data.list.manufacture_id
        })
        console.log(details)
      })
    },
    showHisList(is_his) {
      const id = this.clickRow.id
      console.log(id)
      this.is_his = this.is_his == 1 ? 0 : 1
      this.$request(
        api.baseUrl + '/Compliance/complianceIssues/getIssuesDetail',
        {
          id: id,
          page: 1,
          pageSize: 12,
          is_his: is_his,
        },
        'get'
      ).then((response) => {
        this.data = response.data
        this.detailtable.list = response.data.list.detail
        this.detailtable.total = response.data.total
        console.log(response.data)
        const details = response.data.list.detail
        details.forEach((detail) => {
          detail.manufacture_id = response.data.list.manufacture_id
        })
      })
    },
    //修改
    editDetail(index, row) {
      this.editdetail = row
      console.log(this.editdetail)
      this.editForm = {
        ...this.editdetail,
      }
      console.log(this.editForm)
      this.editVisible = true
    },
    //提交修改结果
    submitEdit() {
      this.$request(
        api.baseUrl + '/Compliance/complianceIssues/addOrModifyIssues',
        {
          manufacture_id: this.editForm.manufacture_id,
          detail: [
            {
              issue_type: this.editForm.issue_type,
              issue_desc: this.editForm.issue_desc,
              issue_suggest: this.editForm.issue_suggest,
              is_valid: this.editForm.is_valid,
              rec_status: this.editForm.rec_status,
              id: this.editForm.id,
              pid: this.editForm.pid,
            },
          ],
        },
        'post'
      ).then((response) => {
        this.data = response.data
        this.getList()
        this.editVisible = false
      })
    },
    addForm() {
      this.addFormVisible = true
    },
    //创建取消
    addCancel(form) {
      this.addFormVisible = false
      this.form = _.cloneDeep(this.forminit)
      this.$refs[form].resetFields()
    },
    //创建
    submit(form) {
      this.$refs.form.validate((valid) => {
        console.log(valid)
        if (valid) {
          const issue_type = this.form.issue_type
          const issue_desc = this.form.issue_desc
          const issue_suggest = this.form.issue_suggest
          const rec_status = this.form.rec_status
          const is_valid = this.form.is_valid
          const manufacture_id = this.form.manufacture_id
          this.form = _.cloneDeep(this.forminit)
          this.addFormVisible = false
          this.$request(
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
          ).then((response) => {
            this.data = response.data
            this.getList()
          })
          // this.getList()
        }
      })
    },
    checkField, //多级表头渲染组件
    showManufacture() {
      this.dialogSelectManufacture = true
      this.getManufactureList()
    },
    getManufactureList() {
      this.$request(api.baseUrl + '/Compliance/complianceManufacturer/getlist').then((response) => {
        this.manufacture.tableData = response.data.list
        console.log(this.manufacture.tableData)
      })
    },
    selectManufacture(index, item) {
      this.form.manufacture_id = item.manufacture_id
      this.form.name_zh = item.name_zh
      this.dialogSelectManufacture = false
    },
    //下载导出
    exportExcel() {
      this.$request(
        api.baseUrl + '/Compliance/complianceIssues/getList',
        {
          manufacture_name: this.formInline.manufacture_name,
          issues_type: this.formInline.issues_type,
          issues_desc: this.formInline.issues_desc,
          suggest: this.formInline.suggest,
          corrective_date: this.formInline.corrective_date,
          corrective_principal: this.formInline.corrective_principal,
          query: this.query,
        },
        'get'
      ).then((r) => {
        if (r.data.list.length == 0) {
          this.$alert('暂无数据', '提示', {
            confirmButtonText: '确定',
            callback: (action) => {},
          })
          return
        }
        const exprotList = r.data.list
        console.log(exprotList)

        function insertAndExtractArrays(objArray) {
          // 将一层数据name_zh插入到二层数组对象detail中
          objArray.forEach((obj) => {
            if (obj.detail && Array.isArray(obj.detail)) {
              obj.detail.forEach((detailObj) => {
                if (detailObj !== null && typeof detailObj === 'object') {
                  detailObj.name_zh = obj.name_zh // 插入name_zh到detail对象中
                }
              })
            }
          })
          const arrays = []

          function recurse(item) {
            if (Array.isArray(item)) {
              // 如果是数组，添加到结果中
              arrays.push(...item)
            } else if (item !== null && typeof item === 'object') {
              // 如果是对象，遍历其所有值
              for (const key in item) {
                if (item.hasOwnProperty(key)) {
                  recurse(item[key]) // 递归调用
                }
              }
            }
          }
          // 遍历修改后的对象数组，并对每个项应用递归函数
          objArray.forEach((obj) => recurse(obj))
          return arrays
        }
        // 插入name_zh并提取所有数组
        const extractedArrays = insertAndExtractArrays(exprotList)
        console.log(extractedArrays)
        import('@/vendor/Export2Excel').then((excel) => {
          const filterVal = this.table.column.map((item) => {
            return item.key
          })
          const tHeader = this.table.column.map((item) => {
            return item.label || item.key
          })
          const data = extractedArrays.map((v) => filterVal.map((j) => v[j]))
          console.log(data)
          excel.export_json_to_excel({
            header: tHeader,
            data,
            filename: this.$l.xlsxImproveManageName + '_' + dayjs().format('YYYYMMDD'),
          })
          this.exportLoading = false
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
    checkFile(row) {
      this.fileTableVisable = true
      this.file.list = row.attchments
    },
    getFilePreview(url) {
      const urls = api.baseUrl + '/' + url
      console.log(urls)
      this.file.fileUrl = urls
      this.fileDialogVisible = true
    },

    // 邮件通知
    recEmail() {
      console.log('aa')
      this.recEmailVisible = true
      this.getRoleList()
      this.getRoleEmail()
    },

    addRoleItem(row, index) {
      console.log(row)
      this.surveyEmail.rec_issues = '1'
      this.surveyEmail.role_id = row.role_id
      this.$confirm(this.$l.confirmAddRole, this.$l.dueDiligence, {
        confirmButtonText: this.$c.confirm,
        cancelButtonText: this.$c.cancel,
        type: 'warning',
      })
        .then(() => {
          this.$request(api.baseUrl + '/Compliance/complianceIssues/updateIssuesEmail', this.surveyEmail, 'post')
            .then((r) => {
              console.log(r)
              this.$message({
                type: 'success',
                message: this.$c.success,
              })
              this.getRoleEmail()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$c.fail,
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$c.cancel,
          })
        })
    },

    deleteRoleItem(row, index) {
      console.log(row)
      this.surveyEmail.rec_issues = '0'
      this.surveyEmail.role_id = row.role_id
      this.$confirm(this.$l.confirmAddRole, this.$l.dueDiligence, {
        confirmButtonText: this.$c.confirm,
        cancelButtonText: this.$c.cancel,
        type: 'warning',
      })
        .then(() => {
          this.$request(api.baseUrl + '/Compliance/complianceIssues/updateIssuesEmail', this.surveyEmail, 'post')
            .then((r) => {
              console.log(r)
              this.$message({
                type: 'success',
                message: this.$c.success,
              })
              this.getRoleEmail()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$c.fail,
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$c.cancel,
          })
        })
    },

    sendRoleEmail() {
      console.log(this.recEmailList.distanceTime)
      this.$confirm(this.$l.confirmSendEmail, this.$l.improvedManagement, {
        confirmButtonText: this.$c.confirm,
        cancelButtonText: this.$c.cancel,
        type: 'warning',
      })
        .then(() => {
          this.$request(api.baseUrl + '/Compliance/complianceIssues/roleEmail', { distanceTime: this.recEmailList.distanceTime }, 'post')
            .then((r) => {
              console.log(r)
              this.$message({
                type: 'success',
                message: this.$c.success,
              })
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$c.fail,
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$c.cancel,
          })
        })
    },

    //选择上传的文件
    onFileChange(e) {
      this.uploadQuery.file = e.target.files[0]
      if (!this.uploadQuery.file) {
        alert('请选择一个文件')
        return
      }
    },
    //上传模板
    uploadExcel() {
      if (!this.uploadQuery.file) {
        alert('请选择一个文件')
        return
      }

      let formData = new FormData()
      formData.append('file', this.uploadQuery.file)

      this.$request(this.$api.baseUrl + '/Compliance/complianceIssues/uploadIssues', formData, 'post')
        .then((r) => {
          console.log(r)
        })
        .catch((e) => {
          this.$message.error(e)
        })
    },

    addFile(e) {
      console.log(e)
      this.form.addFileList.push(e.target.files[0])
      let etf = e.target.files
      console.log(this.form.addFileList)
      this.fileU(etf)
        .then((fileInfos) => {
          console.log(fileInfos)
          this.form.fileList.push(fileInfos[0])
          this.form.addfile = fileInfos[0]
          console.log(this.form.fileList)
          this.submmitfile(this.form.addfile)
          // this.form.addList.attachments = this.form.fileList
        })
        .catch((error) => {
          this.$message({
            type: 'info',
            message: '添加失败',
          })
        })
    },
    // 提交附件 返回附件信息
    submmitfile(fileList) {
      console.log(fileList.attachment_type)
      console.log(fileList)
      console.log(this.form.addFileList)
      const formData = new FormData()
      formData.append('file', this.form.addFileList[0])
      formData.append('attachment_type', fileList.attachment_type)
      this.$request(api.baseUrl + '/Compliance/complianceAttachments/uploadAttachment', formData, 'post')
        .then((r) => {
          r.data.forEach((e) => this.$set(e, 'attachment_type', '1'))
          this.form.attachments.push(r.data[0])
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '附件添加失败',
          })
          throw new Error('附件上传失败') // 确保有错误时不会继续执行
        })
    },
    // 选择附件
    fileU(fileList) {
      return new Promise((resolve, reject) => {
        const fileInfos = []
        const file = fileList[0]
        const file_name = file.name
        const fileExtension = this.getFileExtension(file_name)
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
    },
    // 生成附件后缀
    getFileExtension(file_name) {
      console.log(file_name)
      return file_name.slice(Math.max(0, file_name.lastIndexOf('.')) || Infinity)
    },

    exportTemplate() {
      axios({
        headers: {
          token: getToken(),
          // "Content-Type":"application/vnd.ms-excel"
        },
        responseType: 'blob',
        method: 'post',
        url: api.baseUrl + '/Compliance/complianceIssues/uploadIssuesTemplate',
      }).then((r) => {
        try {
          const blob = new Blob([r.data], {
            type: 'application/octet-stream;',
          })
          // 创建一个隐藏的 <a> 元素
          const elink = document.createElement('a')
          elink.download = this.$l.xlsxImproveName // 确保包含文件扩展名
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          // 添加到 DOM 并触发点击事件
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象

          // 清理工作：移除超链接
          document.body.removeChild(elink)
        } catch (error) {
          this.$message.error('文件导出失败')
        }
      })
    },

    // 获取角色
    getRoleList() {
      this.$request(this.api + 'getlist', this.roleList.query)
        .then((r) => {
          console.log(r)

          this.roleList.list = r.data.list
          this.roleList.total = r.data.total
        })
        .catch(() => {})
    },
    getRoleEmail() {
      this.$request(api.baseUrl + '/Compliance/complianceIssues/getRoleEmailList', {})
        .then((r) => {
          this.recEmailList.list = r.data.list
          this.recEmailList.total = r.data.total
        })
        .catch(() => {})
    },
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
