<template>
  <div class="app-container" v-loading="pageLoading">
    <!-- 查询 -->
    <div>
      <el-form :inline="true" :model="queryList" label-position="right" >
        <el-form-item :label="this.$l.auditTime">
          <el-date-picker v-model="queryList.audit_time" type="date" :placeholder="this.$l.pleaseSelectAnApprovalDate"
            value-format="yyyy-MM-dd" style="width: 200px"></el-date-picker>
        </el-form-item>
        <el-form-item :label="this.$l.recStatus">
          <el-input v-model="queryList.rec_status" :placeholder="this.$l.pleaseEnterTheAuditResult"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="submitForm()" icon="el-icon-search" type="primary">{{ $c.queryButton }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button @click="resetForm()" type="info" icon="el-icon-delete">{{ $l.reset }}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-divider></el-divider>

    <!-- 内容 -->
    <div>
      <!-- <el-button @click="addForm()" icon="el-icon-search" type="primary">{{
        $l.cAdd
      }}</el-button>
      <el-button
        @click="exportInfo()"
        icon="el-icon-download"
        type="info"
        class="fr"
        >下载</el-button
      > -->

      <div style="margin-top: 10px">
        <!-- 表格 -->
        <el-table :data="tableList.list" style="width: 100%" highlight-current-row>
          <el-table-column width="220" :label="this.$l.basicInformation" fixed>
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
          <el-table-column :label="this.$l.complianceContactInfor">
            <el-table-column v-for="(item, index) in tableList.columns2" :key="index" :prop="item.key"
              :label="item.title" :width="item.width" show-overflow-tooltip>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="this.$l.latestSeaAudit">
            <el-table-column v-for="(item, index) in tableList.columns3" :key="index" :prop="item.key"
              :label="item.title" :width="item.width" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="item.formatter" v-html="item.formatter(scope.row[item.key])"></span>
                <span v-else>
                  {{ scope.row[item.key] }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="this.$l.annualSeaAudit">
            <el-table-column v-for="(item, index) in tableList.columns4" :key="index" :prop="item.key"
              :label="item.title" :width="item.width" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="item.key === 'audit_file'">
                  <a href="javascript:void(0);" @click="viewFile(scope.row.survey_id)">{{ $l.viewFile }}</a>
                </span>
                <span v-else-if="item.key === 'is_submit_cap'">
                  {{ scope.row.is_submit_cap == 'Y' ? $l.yes : $l.no }}
                </span>
                <span v-else>
                  {{ scope.row[item.key] }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column fixed="right" :label="this.$c.operation" width="120">
            <template slot-scope="scope">
              <el-button @click="checkClick(scope.row, scope.$index)" type="text" size="small">{{ $c.check
                }}</el-button>
              <!-- <el-button
                @click="editClick(scope.row, scope.$index)"
                type="text"
                size="small"
                class="text-yellow"
                >{{ $l.modify }}</el-button
              > -->
              <el-button @click="historyClick(scope.row, scope.$index)" type="text" size="small" style="color: gray">{{
                $l.history }}</el-button>
              <!-- <el-button
                v-if="scope.row.rec_status === -1"
                @click="auditNew(scope.row, scope.$index)"
                type="text"
                size="small"
                style="color: green"
                >{{ $l.newOrder }}</el-button
              ><el-button
                v-if="scope.row.rec_status === 1"
                @click="auditClick(scope.row, scope.$index)"
                type="text"
                size="small"
                style="color: orange"
                >{{ $l.audit }}</el-button
              >
              <el-button
                v-if="scope.row.rec_status === 7"
                @click="invalid(scope.row, scope.$index)"
                type="text"
                size="small"
                style="color: red"
                >{{ $l.cancelAudit }}</el-button
              >
              <el-button
                v-if="scope.row.rec_status === 7"
                @click="auditClose(scope.row, scope.$index)"
                type="text"
                size="small"
                style="color: green"
                >{{ $l.end }}</el-button
              > -->
            </template>
          </el-table-column>
        </el-table>

        <z-pagination :pagination="pagination" :total="tableList.total" :page.sync="tableList.curPage"
          :limit.sync="tableList.pageSize" @change="getList">
        </z-pagination>

        <!-- 修改 -->
        <el-dialog width="80%" :lock-scroll="true" @submmit="submmitedit" :visible.sync="editFormVisible" top="1vh"
          custom-class="custom-dialog">
          <div style="padding: 0 50px">
            <div>
              <el-form :model="editSurvey.list" label-position="top" label-width="180px">
                <el-col :span="24">
                  <el-form-item :label="this.$l.basicInformation"></el-form-item>
                </el-col>

                <el-form-item :label="this.$l.basicArchives">
                  <el-col :span="8">
                    <el-input v-model="editSurvey.list.name_zh" placeholder="请选择基础档案" :disabled="true"></el-input>
                  </el-col>

                  <!-- <el-button @click="editselectClick()" type="primary"
                          >查看</el-button
                        > -->
                </el-form-item>

                <el-col :span="24">
                  <el-form-item :label="this.$l.latestSeaAudit"></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="this.$l.auditTime">
                    <el-date-picker v-model="editSurvey.list.audit_time" type="date"
                      :placeholder="this.$l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd"
                      style="width: 300px"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6"><el-form-item :label="this.$l.nameOfTheThirdPartyOrganization">
                    <el-input v-model="editSurvey.list.third_party_org"
                      :placeholder="this.$l.pleaseEnterThirdPartyOrganization"></el-input> </el-form-item></el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6"><el-form-item :label="this.$l.auditResult">
                    <el-input v-model="editSurvey.list.audit_result"
                      :placeholder="this.$l.pleaseEnterTheAuditResult"></el-input> </el-form-item></el-col>

                <el-col :span="24">
                  <el-form-item :label="this.$l.annualSeaAudit"></el-form-item>
                </el-col>
                <el-col :span="6"><el-form-item :label="this.$l.dueAuditDate">
                    <el-date-picker v-model="editSurvey.list.due_audit_date" type="date"
                      :placeholder="this.$l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd"
                      style="width: 300px"></el-date-picker> </el-form-item></el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6"><el-form-item :label="this.$l.costPayProgress">
                    <el-slider v-model="editSurvey.list.cost_pay_progress"></el-slider></el-form-item></el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6"><el-form-item :label="this.$l.realAuditDate">
                    <el-date-picker v-model="editSurvey.list.real_audit_date" type="date"
                      :placeholder="this.$l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd"
                      style="width: 300px"></el-date-picker> </el-form-item></el-col>
                <el-col :span="24"><el-form-item :label="this.$l.isSubmitCap">
                    <el-radio v-model="editSurvey.list.is_submit_cap" label="Y">{{ this.$l.yes }}</el-radio>
                    <el-radio v-model="editSurvey.list.is_submit_cap" label="N">{{ this.$l.no }}</el-radio>
                  </el-form-item></el-col>
                <el-col :span="24">
                  <el-form-item :label="this.$l.auditFile"></el-form-item>
                </el-col>
                <input type="file" multiple @change="editFile" ref="editfileinput" style="display: none" />
                <el-col :span="24"><el-button type="primary" @click="$refs.editfileinput.click()">{{ this.$l.selectFile
                    }}</el-button></el-col>
              </el-form>
            </div>
            <div>
              <!-- 文件表格 -->
              <el-table :data="editSurvey.fileList" style="width: 90%">
                <el-table-column v-for="(item, index) in editSurvey.columns" :key="index" :prop="item.key"
                  :label="item.title" :width="item.width">
                </el-table-column>
                <el-table-column fixed="right" :label="this.$c.operation" width="145">
                  <template slot-scope="scope">
                    <!-- <el-button
                            @click="getFilePreview(scope.row.file_url)"
                            type="text"
                            size="small"
                            >查看</el-button
                          > -->
                    <el-button @click="editDeleteFile(scope.row, scope.$index)" type="text" size="small">{{ $c.delete
                      }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editFormVisible = false">{{
              $t('common').cancel
            }}</el-button>
            <el-button type="primary" @click="submmitedit">
              {{ $t('common').confirm }}
            </el-button>
            <slot name="operation"></slot>
          </span>
        </el-dialog>

        <!-- 查看 -->
        <el-dialog width="80%" :lock-scroll="true" :visible.sync="checkFormVisible" top="1vh"
          custom-class="custom-dialog">
          <div style="padding: 0 50px">
            <div>
              <el-form :model="checkSurvey.list" label-position="top" label-width="180px">
                <el-col :span="24">
                  <el-form-item :label="this.$l.basicInformation"></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="this.$l.basicArchives">
                    <el-input v-model="checkSurvey.list.name_zh"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item :label="this.$l.latestSeaAudit"></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="this.$l.auditDate">
                    <el-date-picker v-model="checkSurvey.list.audit_time" type="date" value-format="yyyy-MM-dd"
                      style="width: 300px"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6"><el-form-item :label="this.$l.nameOfTheThirdPartyOrganization">
                    <el-input v-model="checkSurvey.list.third_party_org"></el-input> </el-form-item></el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6"><el-form-item :label="this.$l.auditResult">
                    <el-input v-model="checkSurvey.list.audit_result"></el-input> </el-form-item></el-col>

                <el-col :span="24">
                  <el-form-item :label="this.$l.annualSeaAudit"></el-form-item>
                </el-col>
                <el-col :span="6"><el-form-item :label="this.$l.dueAuditDate">
                    <el-date-picker v-model="checkSurvey.list.due_audit_date" type="date" value-format="yyyy-MM-dd"
                      style="width: 300px"></el-date-picker> </el-form-item></el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6"><el-form-item :label="this.$l.costPayProgress">
                    <el-slider v-model="checkSurvey.list.cost_pay_progress"></el-slider></el-form-item></el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6"><el-form-item :label="this.$l.realAuditDate">
                    <el-date-picker v-model="checkSurvey.list.real_audit_date" type="date" value-format="yyyy-MM-dd"
                      style="width: 300px"></el-date-picker> </el-form-item></el-col>
                <el-col :span="24"><el-form-item :label="this.$l.isSubmitCap">
                    <el-radio v-model="checkSurvey.list.is_submit_cap" label="Y">{{ this.$l.yes }}</el-radio>
                    <el-radio v-model="checkSurvey.list.is_submit_cap" label="N">{{ this.$l.no }}</el-radio>
                  </el-form-item></el-col>
                <el-col :span="24">
                  <el-form-item :label="this.$l.auditFile"></el-form-item>
                </el-col>
              </el-form>
            </div>
            <div>
              <!-- 文件表格 -->
              <el-table :data="checkSurvey.fileList" style="width: 90%">
                <el-table-column v-for="(item, index) in checkSurvey.columns" :key="index" :prop="item.key"
                  :label="item.title" :width="item.width">
                </el-table-column>
                <!-- <el-table-column
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
                </el-table-column> -->
              </el-table>
            </div>
          </div>
        </el-dialog>

        <!-- 审核 -->
        <z-form-dialog :data="auditSurvey.list" :formProps="auditSurvey.formProps" :fields="auditSurvey.fields"
          @submmit="submitAudit" :visible.sync="auditFormVisible">
        </z-form-dialog>

        <z-form-dialog :data="auditSurvey.list" :formProps="auditSurvey.formProps" :fields="auditSurvey.fields1"
          @submmit="submitAudit" :visible.sync="auditFormsVisible">
        </z-form-dialog>

        <!-- 新增 -->
        <el-dialog width="80%" :lock-scroll="true" @submmit="submmitadd" :visible.sync="addFormVisible" top="1vh"
          custom-class="custom-dialog">
          <div style="padding: 0 50px">
            <div>
              <el-form :model="addSurvey.addList" label-position="top" label-width="160px">
                <el-col :span="24">
                  <el-form-item :label="this.$l.basicInformation"></el-form-item>
                </el-col>

                <el-form-item :label="this.$l.basicArchives">
                  <el-col :span="8">
                    <el-input v-model="addSurvey.addList.name_zh"></el-input>
                  </el-col>

                  <el-button @click="addselectClick()" type="primary">{{
                    $c.check
                  }}</el-button>
                </el-form-item>

                <el-col :span="24">
                  <el-form-item :label="this.$l.latestSeaAudit"></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="this.$l.auditDate">
                    <el-date-picker v-model="addSurvey.addList.audit_time" type="date"
                      :placeholder="this.$l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd"
                      style="width: 300px"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6"><el-form-item :label="this.$l.nameOfTheThirdPartyOrganization">
                    <el-input v-model="addSurvey.addList.third_party_org"
                      :placeholder="this.$l.pleaseEnterThirdPartyOrganization"></el-input> </el-form-item></el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6"><el-form-item :label="this.$l.auditResult">
                    <el-input v-model="addSurvey.addList.audit_result"
                      :placeholder="this.$l.pleaseEnterTheAuditResult"></el-input> </el-form-item></el-col>

                <el-col :span="24">
                  <el-form-item :label="this.$l.annualSeaAudit"></el-form-item>
                </el-col>
                <el-col :span="6"><el-form-item :label="this.$l.dueAuditDate">
                    <el-date-picker v-model="addSurvey.addList.due_audit_date" type="date"
                      :placeholder="this.$l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd"
                      style="width: 300px"></el-date-picker> </el-form-item></el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="this.$l.costPayProgress" style="display: flex; flex-direction: column">
                    <!-- <el-input
                            v-model="addSurvey.addList.cost_pay_progress"
                            :placeholder="this.$l.pleaseEnterTheAuditResult"
                          ></el-input> -->
                    <el-slider v-model="addSurvey.addList.cost_pay_progress"></el-slider>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6"><el-form-item :label="this.$l.realAuditDate">
                    <el-date-picker v-model="addSurvey.addList.real_audit_date" type="date"
                      :placeholder="this.$l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd"
                      style="width: 300px"></el-date-picker> </el-form-item></el-col>
                <el-col :span="24"><el-form-item :label="this.$l.isSubmitCap">
                    <el-radio v-model="addSurvey.addList.is_submit_cap" label="Y">{{ this.$l.yes }}</el-radio>
                    <el-radio v-model="addSurvey.addList.is_submit_cap" label="N">{{ this.$l.no }}</el-radio>
                  </el-form-item></el-col>
                <el-col :span="24">
                  <el-form-item :label="this.$l.auditFile"></el-form-item>
                </el-col>
                <input type="file" @change="addFile" ref="addfileinput" style="display: none" />
                <el-col :span="24"><el-button type="primary" @click="$refs.addfileinput.click()">{{ this.$l.selectFile
                    }}</el-button></el-col>
              </el-form>
            </div>
            <div>
              <!-- 文件表格 -->
              <el-table :data="addSurvey.fileList" style="width: 90%">
                <el-table-column v-for="(item, index) in addSurvey.columns" :key="index" :prop="item.key"
                  :label="item.title" :width="item.width">
                </el-table-column>
                <!-- <el-table-column
                  fixed="right"
                  :label="this.$c.operation"
                  width="145"
                >
                  <template slot-scope="scope">
                    <el-button
                      @click="removeAddClick(scope.row)"
                      type="text"
                      size="small"
                      >{{ $c.delete }}</el-button
                    >
                  </template>
                </el-table-column> -->
              </el-table>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addFormVisible = false">{{
              $t('common').cancel
            }}</el-button>
            <el-button type="primary" @click="submmitadd">
              {{ $t('common').confirm }}
            </el-button>
            <slot name="operation"></slot>
          </span>
        </el-dialog>

        <!-- 新增 选择基础档案 -->
        <el-dialog :formProps="formProps" :visible.sync="addselectFormVisible" title="选择基础档案"
          custom-class="custom-dialog">
          <div>
            <el-col :span="14">
              <el-input v-model="manufacture.queryString" :placeholder="this.$l.search"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="getManufacturerList">{{
                $l.search
              }}</el-button>
            </el-col>
            <el-table :data="manufacture.list" style="width: 100%; height: 700px" max-height="550">
              <el-table-column v-for="(item, index) in manufacture.columns" :key="index" :prop="item.key"
                :label="item.title" :width="item.width">
              </el-table-column>
              <el-table-column fixed="right" :label="this.$c.operation" width="145">
                <template slot-scope="scope">
                  <el-button @click="addselectItem(scope.row)" type="text" size="small">{{ $l.choose }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-dialog>

        <!-- 修改 选择基础档案 -->
        <el-dialog :formProps="formProps" :visible.sync="editselectFormVisible">
          <div>
            <el-col :span="14">
              <el-input v-model="manufacture.queryString" :placeholder="this.$l.search"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="getManufacturerList">{{
                $l.search
              }}</el-button>
            </el-col>
            <el-table :data="manufacture.list" style="width: 90%">
              <el-table-column v-for="(item, index) in manufacture.columns" :key="index" :prop="item.key"
                :label="item.title" :width="item.width">
              </el-table-column>
              <el-table-column fixed="right" :label="this.$c.operation" width="145">
                <template slot-scope="scope">
                  <el-button @click="editselectItem(scope.row)" type="text" size="small">{{ $l.choose }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-dialog>
      </div>
    </div>

    <!-- 预览 -->
    <filePreviews v-if="fileUrl" :file-url="fileUrl" :visible="dialogVisible"
      @update:visible="dialogVisible = $event" />
  </div>
</template>
<script>
import axios from 'axios'

import {
  _,
  api,
  dayjs,
  initFuncs,
  zForm,
  zFormDialog,
  zPagination,
  zTable,
} from '@/views/_common'

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
      addFormVisible: false,
      checkFormVisible: false,
      editFormVisible: false,
      auditFormVisible: false,
      auditFormsVisible: false,
      selectFormVisible: false,
      addselectFormVisible: false,
      editselectFormVisible: false,
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
      /* showAuth: {
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
            }, */
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
      fileList: [],
      rec_status: [
        {
          label: this.$l.cancelAudit,
          value: -1,
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
            key: 'vehicleStime',
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
            width: 90,
          },
          {
            title: this.$l.contactEmail,
            key: 'contact_email',
            width: 190,
          },
        ],
        columns3: [
          {
            title: this.$l.auditDate,
            key: 'audit_time',
            width: 140,
          },
          {
            title: this.$l.auditResult,
            key: 'audit_result',
            width: 100,
          },
          {
            title: this.$l.recStatus,
            key: 'rec_status',
            formatter: this.formatterRec,
            width: 100,
          },
        ],
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
            title: this.$l.auditFile,
            key: 'audit_file',
            width: 80,
          },
          {
            title: this.$l.isSubmitCap,
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

      // 修改
      editSurvey: {
        list: {},
        fileList: [],
        editFileList: [],
        editList: {
          attachments: [],
        },
        fields1: [
          {
            title: this.$l.nameZh,
            key: 'name_zh',
            span: 8,
          },
          {
            title: this.$l.address,
            key: 'address',
            span: 8,
          },
          {
            title: this.$l.requestorFacilityType,
            key: 'name_zh',
            span: 8,
          },
          {
            title: this.$l.name,
            key: 'contact_name',
            span: 8,
          },
          {
            title: this.$l.contactPhone,
            key: 'contact_phone',
            span: 8,
          },
          {
            title: this.$l.contactEmail,
            key: 'contact_email',
            span: 8,
          },
          {
            title: this.$l.auditDate,
            key: 'audit_time',
            name: 'date',
            span: 8,
          },
          {
            title: this.$l.auditResult,
            key: 'aduit_result',
            span: 8,
          },
          {
            title: this.$l.dueAuditDate,
            key: 'due_audit_date',
            name: 'date',
            span: 8,
          },
          {
            title: this.$l.costPayProgress,
            key: 'cost_pay_progress',
            span: 8,
          },
          {
            title: this.$l.realAuditDate,
            key: 'real_audit_date',
            name: 'date',
            span: 8,
          },
          {
            title: this.$l.auditResult,
            key: 'vehicleStime',
            span: 8,
          },
          {
            title: this.$l.isSubmitCap,
            key: 'is_submit_cap',
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

      // 新增
      addSurvey: {
        list: [],
        fileList: [],
        addFileList: [],
        addList: {
          manufacture_id: '',
          audit_time: '',
          due_audit_date: '',
          name_zh: '',
          third_party_org: '',
          audit_result: '',
          cost_pay_progress: 0,
          real_audit_date: '',
          is_submit_cap: 'Y',
          rec_status: 1,
          attachments: [],
        },
        addListInit: {
          manufacture_id: '',
          audit_time: '',
          due_audit_date: '',
          name_zh: '',
          third_party_org: '',
          audit_result: '',
          cost_pay_progress: 0,
          real_audit_date: '',
          is_submit_cap: 'Y',
          rec_status: 1,
          attachments: [],
        },
        fields: [
          {
            title: this.$l.basicArchives,
            key: 'shortphone',
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
    }
  },
  methods: {
    /* 查询 */

    // 尽职调查列表
    getList() {
      console.log(this.queryList)
      this.$request(
        api.baseUrl + '/ComplianceOutside/complianceSurveyOutside/getList',
        this.queryList
      )
        .then((r) => {
          this.tableList.list = r.data.list
          this.tableList.total = r.data.total
        })
        .catch(() => {
          this.pageLoading = false
        })
    },

    submitForm() {
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

    // 打开新增窗口
    addForm() {
      this.addFormVisible = true
    },

    // 新增 打开基础档案选择
    addselectClick() {
      this.addselectFormVisible = true
      this.getManufacturerList()
    },
    // 新增 选择基础档案
    addselectItem(row) {
      console.log(row)
      this.addSurvey.addList.manufacture_id = row.manufacture_id
      this.addSurvey.addList.name_zh = row.name_zh
      this.addSurvey.addList.third_party_org = row.third_party_org
      this.addselectFormVisible = false
    },

    // 新增 打开选择附件窗口，返回附件信息
    addFile(e) {
      this.addSurvey.addFileList = e.target.files

      this.file(this.addSurvey.addFileList)
        .then((fileInfos) => {
          this.addSurvey.fileList = fileInfos
          this.addSurvey.addList.attachments = this.addSurvey.fileList
        })
        .catch((error) => {
          this.$message({
            type: 'info',
            message: '添加失败',
          })
        })
    },

    // 移除还未新增的附件
    removeAddClick() {
      this.$refs.addfileinput.value = null
      this.addSurvey.fileList = []
      this.addSurvey.addFileList = []
      this.addSurvey.addList.attachments = []
    },
    // 新增 上传附件，调用新增尽职调查
    submmitadd() {
      console.log(this.addSurvey.fileList)
      console.log(this.addSurvey.addFileList)
      if (
        !this.addSurvey.addList.manufacture_id &&
        this.addSurvey.addList.manufacture_id == ''
      ) {
        this.$message({
          type: 'info',
          message: '请选择基础档案',
        })
        return
      }
      this.$confirm('确认添加该数据吗, 是否继续?', '尽职调查', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          if (
            this.addSurvey.addFileList &&
            this.addSurvey.addFileList.length == 0
          ) {
            this.addSurveys()
          } else {
            this.submmitfile(
              this.addSurvey.fileList,
              this.addSurvey.addFileList
            )
              .then((r) => {
                console.log(r)
                this.addSurvey.addList.attachments = r.data
                console.log(this.addSurvey.addList)
                this.addSurveys()
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '附件添加失败',
                })
              })
          }
        })
        .catch(() => { })
    },

    // 新增/修改尽职调查
    addSurveys() {
      this.$request(
        api.baseUrl + '/ComplianceOutside/complianceSurveyOutside/addSurvey',
        this.addSurvey.addList,
        'post'
      )
        .then(() => {
          this.$message({
            type: 'success',
            message: '添加成功!',
          })
          this.getList()
          this.addSurvey.addList = this.addSurvey.addListInit
          this.addFormVisible = false
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '添加失败',
          })
        })
    },

    /* 查看表格数据 */

    // 查看
    checkClick(row, index) {
      this.pageLoading = true
      let cRow = _.cloneDeep(row)
      if (Number(cRow.cost_pay_progress)) {
        cRow.cost_pay_progress = Number(cRow.cost_pay_progress)
      } else {
        cRow.cost_pay_progress = 0
      }
      console.log(cRow)
      this.checkSurvey.list = cRow
      console.log(row.survey_id)
      this.checkviewFile(row.survey_id)
        .then((r) => {
          if (r.data && r.data.length == 0) {
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
            this.checkSurvey.fileList = rr
            this.checkFormVisible = true
            this.pageLoading = false
          }
        })
        .catch(() => {
          this.pageLoading = false
        })
    },

    /* 修改表格数据 */

    // 点击修改 打开窗口 获取附件
    editClick(row, index) {
      // this.pageLoading = true

      let rowList = _.cloneDeep(row)
      this.$set(rowList, 'id', row.survey_id)
      this.$set(rowList, 'manufacture_id', row.bindManufacturerid)
      if (Number(rowList.cost_pay_progress)) {
        rowList.cost_pay_progress = Number(rowList.cost_pay_progress)
      } else {
        rowList.cost_pay_progress = 0
      }
      this.editSurvey.list = rowList
      this.checkviewFile(row.survey_id)
        .then((r) => {
          this.editFormVisible = true
          const { file_url, file_name, file_type } = r.data[0]
          this.file_name = file_name
          this.file_url = file_url
          this.file_type = file_type
          const fileExtension = this.getFileExtension(file_name)
          let rr = _.cloneDeep(r.data)
          this.$set(rr[0], 'file_suffix', fileExtension)
          this.$set(rr[0], 'attachment_type', '1')
          this.editSurvey.fileList = rr

          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    },

    editselectClick() {
      this.editselectFormVisible = true
      this.getManufacturerList()
    },
    // 修改 选择基础档案
    editselectItem(row) {
      this.editSurvey.list.manufacturerid = row.manufacture_id
      this.editSurvey.list.name_zh = row.name_zh
      this.editselectFormVisible = false
    },
    // 修改 选择附件 返回附件信息
    editFile(e) {
      this.editSurvey.editFileList = e.target.files

      this.file(this.editSurvey.editFileList)
        .then((fileInfos) => {
          this.editSurvey.fileList = fileInfos
          this.editSurvey.editList.attachments = this.editSurvey.fileList
          console.log(this.editSurvey.fileList)
        })
        .catch((error) => {
          console.error('Error processing files:', error)
        })
    },
    // 删除附件信息
    editDeleteFile(row, index) {
      this.editSurvey.fileList = []
    },
    // 移除还未新增的附件
    editDeleteFile() {
      this.$refs.editfileinput.value = null
      this.editSurvey.fileList = []
      this.editSurvey.editFileList = []
      this.editSurvey.editList.attachments = []
    },

    // 提交修改
    submmitedit() {
      this.$set(this.editSurvey.list, 'attachments', this.editSurvey.fileList)

      this.submmitfile(this.editSurvey.fileList, this.editSurvey.editFileList)
        .then((r) => {
          console.log(r)
          this.editSurvey.editList.attachments = r.data
          this.editSurvey.list.attachments =
            this.editSurvey.editList.attachments
          this.$set(this.editSurvey.list.attachments[0], 'attachment_type', '1')
          this.editSurveys()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '附件添加失败',
          })
        })
    },
    // 新增/修改尽职调查
    editSurveys() {
      console.log(this.editSurvey.list)
      this.$request(
        api.baseUrl + '/ComplianceOutside/complianceSurveyOutside/addSurvey',
        this.editSurvey.list,
        'post'
      )
        .then(() => {
          this.$message({
            type: 'success',
            message: this.$l.modifySuccees,
          })
          this.getList()
          this.editFormVisible = false
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$l.modifyFailed,
          })
        })
    },

    /* 查看历史 */
    historyClick(row, index) {
      console.log(row)

      this.$router.push({
        path: '/compliance/InvestigationInfo',
        query: { manufacture_id: row.manufacturerid },
      })
      console.log(this.$router)
    },

    /* 审核 */

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
            api.baseUrl +
            '/ComplianceOutside/complianceSurveyOutside/auditSurvey',
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
      console.log(id)
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

    /* 查看历史 */
    historyClick(row, index) {
      console.log(row)

      this.$router.push({
        path: '/investigationInfo',
        query: { manufacture_id: row.manufacturer_id },
      })
      console.log(this.$router)
    },
    // 格式化审核状态
    formatterRec(row) {
      console.log(row)
      const found = this.rec_status.find((e) => e.value == row)
      if (found) {
        return found.label
      }
    },

    // 预览文件
    getFilePreview(url) {
      console.log(url)
      const urls = api.baseUrl + '/' + url
      this.fileUrl = urls
      this.dialogVisible = true
    },

    // 下载

    exportInfo() {
      console.log(this.tableList)
      console.log(this.tableList.list)
      const mergedArrayUsingSpread = [
        ...this.tableList.columns1,
        ...this.tableList.columns2,
        ...this.tableList.columns3,
        ...this.tableList.columns4,
      ]
      console.log(mergedArrayUsingSpread)

      import('@/vendor/Export2Excel')
        .then((excel) => {
          const tHeader = mergedArrayUsingSpread.map((item) => {
            return item.title || item.key
          })

          const filterVal1 = mergedArrayUsingSpread.map((item) => {
            return item.key
          })

          const data1 = this.tableList.list.map((item) =>
            filterVal1.map((key) => item[key])
          )
          console.log(tHeader)
          console.log(filterVal1)
          console.log(data1)
          excel.export_json_to_excel({
            header: tHeader,
            sheetname: '回答详情',
            data: data1,
            filename:
              (this.name || 'export_data') + '_' + dayjs().format('YYYYMMDD'),
          })
          this.exportLoading = false
        })
        .catch((e) => {
          this.exportLoading = false
          this.$message.error('数据处理失败，导出失败')
          console.log(e)
          throw e
        })
    },
    // 获取当前页面用户拥有的操作权限的函数
    getUserAuth() {
      //获取当前页面用户拥有的操作权限的函数
      // this.userAuth = null

    },
  },
  created() {
    this.getList()
    this.getUserAuth()
  },
}
</script>
<style scoped></style>
