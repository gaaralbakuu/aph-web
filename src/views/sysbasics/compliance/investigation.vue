<template>
  <div class="app-container" v-loading="pageLoading">
    <!-- 查询 -->
    <div>
      <el-form :inline="true" :model="queryList" label-position="right" label-width="140px">
        <el-row>
          <el-col :span="7">
            <el-form-item :label="this.$l.manufactureName">
              <el-input v-model="queryList.manufacture_name" :placeholder="this.$l.pleaseEnterAPartnerName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item :label="this.$l.address">
              <el-input v-model="queryList.address" :placeholder="this.$l.PleaseEnterTheAddress"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item :label="this.$l.requestorFacilityType">
              <el-select v-model="queryList.requestor_facility_type" :placeholder="this.$l.pleaseSelect">
                <el-option label="T1" value="T1"></el-option>
                <el-option label="T2" value="T2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-button v-show="showAuth.m_search" @click="submitForm()" icon="el-icon-search" type="primary">{{ $c.queryButton }}</el-button>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item :label="this.$l.name">
              <el-input v-model="queryList.name" :placeholder="this.$l.pleaseEnterAName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item :label="this.$l.auditTime">
              <el-date-picker v-model="queryList.audit_time" type="date" :placeholder="this.$l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd" style="width: 200px"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item :label="this.$l.recStatus">
              <el-select v-model="queryList.rec_status" :placeholder="this.$l.pleaseEnterTheAuditResult" clearable>
                <el-option :label="$c.all" value=""></el-option>
                <el-option v-for="(item, index) in rec_status" :label="item.label" :value="item.value" :key="index"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="3">
            <el-form-item>
              <el-button v-show="showAuth.m_search" @click="resetForm()" type="info" icon="el-icon-delete">{{ $l.reset }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <el-divider></el-divider>

    <!-- 内容 -->
    <div>
      <el-button v-show="showAuth.m_add" @click="addForm()" icon="el-icon-search" type="primary">{{ $l.cAdd }}</el-button>

      <el-button v-show="showAuth.m_export" @click="exportInfo()" icon="el-icon-download" type="info" class="fr">{{ $l.down }}</el-button>

      <el-button @click="recEmail()" icon="el-icon-message" type="info" class="fr">{{ $l.emailNotification }}</el-button>

      <div style="margin-top: 10px">
        <!-- 表格 -->
        <el-table :data="tableList.list" :row-style="tableRowClassName" border stripe style="width: 100%;border" highlight-current-row max-height="575">
          <el-table-column width="460" :label="this.$l.basicInformation" fixed="left">
            <el-table-column v-for="(item, index) in tableList.columns1" :key="index" :prop="item.key" :label="item.title || item.key" :width="item.width" show-overflow-tooltip>
              <template slot-scope="scope">
                <!-- <span v-if="item.key === 'serialNumbers'">
                  {{ scope.$index + 1 }}
                </span> -->
                <span v-if="item.key === 'address'" :title="scope.row[item.key]" class="truncate-lines" v-html="scope.row[item.key]"></span>
                <span v-else>
                  {{ scope.row[item.key] }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="this.$l.complianceContactInfor">
            <el-table-column v-for="(item, index) in tableList.columns2" :key="index" :prop="item.key" :label="item.title" :width="item.width" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="item.key === 'contact_name'" :title="scope.row[item.key]" class="truncate-lines" v-html="scope.row[item.key]"></span>
                <span v-else-if="item.key === 'contact_phone'" :title="scope.row[item.key]" class="truncate-lines" v-html="scope.row[item.key]"></span>
                <span v-else-if="item.key === 'contact_email'" :title="scope.row[item.key]" class="truncate-lines" v-html="scope.row[item.key]"></span>
                <span v-else>
                  {{ scope.row[item.key] }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="this.$l.latestSeaAudit">
            <el-table-column v-for="(item, index) in tableList.columns3" :key="index" :prop="item.key" :label="item.title" :width="item.width" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="item.formatter" v-html="item.formatter(scope.row[item.key])"></span>
                <span v-else>
                  {{ scope.row[item.key] }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="this.$l.annualSeaAudit">
            <el-table-column v-for="(item, index) in tableList.columns4" :key="index" :prop="item.key" :label="item.title" :width="item.width" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button v-if="item.key === 'audit_file'" type="text" size="small" @click="clickViewFile(scope.row)" style="color: orange">
                  {{ $l.viewFile }}
                </el-button>
                <span v-else-if="item.key === 'is_submit_cap'">
                  {{ scope.row.is_submit_cap == 'Y' ? $l.yes : $l.no }}
                </span>
                <span v-else>
                  {{ scope.row[item.key] }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column fixed="right" :label="this.$c.operation" width="270">
            <template slot-scope="scope">
              <el-button @click="checkClick(scope.row, scope.$index)" type="text" size="small">{{ $c.check }}</el-button>
              <el-button v-show="showAuth.m_updata" @click="editClick(scope.row, scope.$index)" type="text" size="small" class="text-yellow">{{ $l.modify }}</el-button>
              <el-button @click="historyClick(scope.row, scope.$index)" type="text" size="small" style="color: gray">{{ $l.history }}</el-button>
              <el-button v-show="showAuth.m_audit && scope.row.rec_status === -1" @click="auditNew(scope.row, scope.$index)" type="text" size="small" style="color: green">{{ $l.newOrder }}</el-button>
              <el-button v-show="showAuth.m_audit && scope.row.rec_status === 1" @click="auditClick(scope.row, scope.$index)" type="text" size="small" style="color: orange">{{ $l.audit }}</el-button>
              <el-button v-show="showAuth.m_audit && scope.row.rec_status === 7" @click="invalid(scope.row, scope.$index)" type="text" size="small" style="color: red">{{ $l.cancelAudit }}</el-button>
              <el-button v-show="showAuth.m_audit && scope.row.rec_status === 7" @click="auditClose(scope.row, scope.$index)" type="text" size="small" style="color: green">{{ $l.end }}</el-button>
            </template>
          </el-table-column>
        </el-table>

        <z-pagination :pagination="pagination" :total="tableList.total" :page.sync="tableList.curPage" :limit.sync="tableList.pageSize" @change="getList"></z-pagination>

        <!-- 修改 -->
        <el-dialog width="80%" :lock-scroll="true" @submmit="submmitedit" :visible.sync="editFormVisible" top="1vh" custom-class="custom-dialog">
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
                    <el-date-picker v-model="editSurvey.list.audit_time" type="date" :placeholder="this.$l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd" style="width: 300px"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="this.$l.nameOfTheThirdPartyOrganization">
                    <el-input v-model="editSurvey.list.third_party_org" :placeholder="this.$l.pleaseEnterThirdPartyOrganization"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="this.$l.auditResult">
                    <el-input v-model="editSurvey.list.audit_result" :placeholder="this.$l.pleaseEnterTheAuditResult"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item :label="this.$l.annualSeaAudit"></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="this.$l.dueAuditDate">
                    <el-date-picker v-model="editSurvey.list.due_audit_date" type="date" :placeholder="this.$l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd" style="width: 300px"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="this.$l.costPayProgress">
                    <el-slider v-model="editSurvey.list.cost_pay_progress"></el-slider>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="this.$l.realAuditDate">
                    <el-date-picker v-model="editSurvey.list.audit_time" type="date" :placeholder="this.$l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd" style="width: 300px"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item :label="this.$l.isSubmitCap">
                    <el-radio v-model="editSurvey.list.is_submit_cap" label="Y">{{ this.$l.yes }}</el-radio>
                    <el-radio v-model="editSurvey.list.is_submit_cap" label="N">{{ this.$l.no }}</el-radio>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item :label="this.$l.auditFile"></el-form-item>
                </el-col>
                <input type="file" multiple @change="editFile" ref="editfileinput" style="display: none" />
                <el-col :span="24">
                  <el-button type="primary" @click="$refs.editfileinput.click()">{{ this.$l.selectFile }}</el-button>
                </el-col>
              </el-form>
            </div>
            <div>
              <!-- 文件表格 -->
              <el-table :data="editSurvey.fileList" style="width: 90%">
                <el-table-column v-for="(item, index) in editSurvey.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                <el-table-column fixed="right" :label="this.$c.operation" width="145">
                  <template slot-scope="scope">
                    <!-- <el-button
                        @click="getFilePreview(scope.row.file_url)"
                        type="text"
                        size="small"
                        >查看</el-button
                      > -->
                    <el-button @click="editDeleteFile(scope.row, scope.$index)" type="text" size="small">{{ $c.delete }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editFormVisible = false">{{ $t('common').cancel }}</el-button>
            <el-button type="primary" @click="submmitedit">
              {{ $t('common').confirm }}
            </el-button>
            <slot name="operation"></slot>
          </span>
        </el-dialog>

        <!-- 查看 -->
        <el-dialog width="80%" :lock-scroll="true" :visible.sync="checkFormVisible" top="1vh" custom-class="custom-dialog">
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
                <el-col :span="24"></el-col>

                <el-col :span="6">
                  <el-form-item label="调查年份">
                    <el-input v-model="checkSurvey.list.survey_year"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item :label="this.$l.latestSeaAudit"></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="this.$l.auditDate">
                    <el-date-picker disabled v-model="checkSurvey.list.near_audit_time" type="date" value-format="yyyy-MM-dd" style="width: 300px"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="this.$l.nameOfTheThirdPartyOrganization">
                    <el-input disabled v-model="checkSurvey.list.near_third_party_org"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="this.$l.auditResult">
                    <el-input disabled v-model="checkSurvey.list.near_audit_result"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item :label="this.$l.annualSeaAudit"></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="this.$l.dueAuditDate">
                    <el-date-picker v-model="checkSurvey.list.due_audit_date" type="date" value-format="yyyy-MM-dd" style="width: 300px"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="this.$l.costPayProgress">
                    <el-slider v-model="checkSurvey.list.cost_pay_progress"></el-slider>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="this.$l.realAuditDate">
                    <el-date-picker v-model="checkSurvey.list.audit_time" type="date" value-format="yyyy-MM-dd" style="width: 300px"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item :label="this.$l.isSubmitCap">
                    <el-radio v-model="checkSurvey.list.is_submit_cap" label="Y">{{ this.$l.yes }}</el-radio>
                    <el-radio v-model="checkSurvey.list.is_submit_cap" label="N">{{ this.$l.no }}</el-radio>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item :label="this.$l.auditFile"></el-form-item>
                </el-col>
              </el-form>
            </div>
            <div>
              <!-- 文件表格 -->
              <el-table :data="checkSurvey.fileList" style="width: 90%">
                <el-table-column v-for="(item, index) in checkSurvey.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                <el-table-column fixed="right" :label="this.$c.operation" width="145">
                  <template slot-scope="scope">
                    <el-button @click="getFilePreview(scope.row.file_url)" type="text" size="small">{{ $c.check }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-dialog>

        <!-- 审核 -->
        <z-form-dialog :data="auditSurvey.list" :formProps="auditSurvey.formProps" :fields="auditSurvey.fields" @submmit="submitAudit" :visible.sync="auditFormVisible"></z-form-dialog>

        <z-form-dialog :data="auditSurvey.list" :formProps="auditSurvey.formProps" :fields="auditSurvey.fields1" @submmit="submitAudit" :visible.sync="auditFormsVisible"></z-form-dialog>

        <!-- 新增 -->
        <el-dialog width="80%" :lock-scroll="true" @submmit="submmitadd" :visible.sync="addFormVisible" top="1vh" custom-class="custom-dialog">
          <div style="padding: 0 50px; margin-top: 30px; height: 70vh; overflow-y: auto">
            <div>
              <el-form :model="addSurvey.addList" label-position="top" label-width="160px">
                <el-col :span="24">
                  <el-form-item :label="this.$l.basicInformation"></el-form-item>
                </el-col>

                <el-form-item :label="this.$l.basicArchives">
                  <el-col :span="8">
                    <el-input v-model="addSurvey.addList.name_zh"></el-input>
                  </el-col>

                  <el-button @click="addselectClick()" type="primary">{{ $c.check }}</el-button>
                </el-form-item>
                <el-form-item label="调查年份">
                  <el-col :span="8">
                    <el-date-picker v-model="addSurvey.addList.survey_year" type="year" placeholder="选择年" format="yyyy" value-format="yyyy"></el-date-picker>
                  </el-col>
                </el-form-item>
                <el-col :span="24">
                  <el-form-item :label="this.$l.latestSeaAudit"></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="this.$l.auditDate">
                    <el-date-picker disabled v-model="addSurvey.addList.near_audit_time" type="date" :placeholder="this.$l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd" style="width: 300px"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="this.$l.nameOfTheThirdPartyOrganization">
                    <el-input disabled v-model="addSurvey.addList.near_third_party_org" :placeholder="this.$l.pleaseEnterThirdPartyOrganization"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="this.$l.auditResult">
                    <el-input disabled v-model="addSurvey.addList.near_audit_result" :placeholder="this.$l.pleaseEnterTheAuditResult"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item :label="this.$l.annualSeaAudit"></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="this.$l.dueAuditDate">
                    <el-date-picker v-model="addSurvey.addList.due_audit_date" type="date" :placeholder="this.$l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd" style="width: 300px"></el-date-picker>
                  </el-form-item>
                </el-col>
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
                <el-col :span="6">
                  <el-form-item :label="this.$l.realAuditDate">
                    <el-date-picker v-model="addSurvey.addList.audit_time" type="date" :placeholder="this.$l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd" style="width: 300px"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item :label="this.$l.isSubmitCap">
                    <el-radio v-model="addSurvey.addList.is_submit_cap" label="Y">{{ this.$l.yes }}</el-radio>
                    <el-radio v-model="addSurvey.addList.is_submit_cap" label="N">{{ this.$l.no }}</el-radio>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item :label="this.$l.auditFile"></el-form-item>
                </el-col>
                <input type="file" @change="addFile" ref="addfileinput" style="display: none" />
                <el-col :span="24">
                  <el-button type="primary" @click="$refs.addfileinput.click()">{{ this.$l.selectFile }}</el-button>
                </el-col>
              </el-form>
            </div>
            <div>
              <!-- 文件表格 -->
              <el-table :data="addSurvey.fileList" style="width: 90%">
                <el-table-column v-for="(item, index) in addSurvey.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                <el-table-column fixed="right" :label="this.$c.operation" width="145">
                  <template slot-scope="scope">
                    <el-button @click="removeAddClick(scope.row, scope.$index)" type="text" size="small">{{ $c.delete }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addFormVisible = false">{{ $t('common').cancel }}</el-button>
            <el-button type="primary" @click="submmitadd">
              {{ $t('common').confirm }}
            </el-button>
            <slot name="operation"></slot>
          </span>
        </el-dialog>

        <!-- 新增 选择基础档案 -->
        <el-dialog :formProps="formProps" :visible.sync="addselectFormVisible" title="选择基础档案" custom-class="custom-dialog">
          <div>
            <el-col :span="14">
              <el-input v-model="manufacture.queryString" :placeholder="this.$l.search"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="getManufacturerList">{{ $l.search }}</el-button>
            </el-col>
            <el-table :data="manufacture.list" style="width: 100%; height: 700px" max-height="550">
              <el-table-column v-for="(item, index) in manufacture.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
              <el-table-column fixed="right" :label="this.$c.operation" width="145">
                <template slot-scope="scope">
                  <el-button @click="addselectItem(scope.row)" type="text" size="small">{{ $l.choose }}</el-button>
                </template>
              </el-table-column>
            </el-table>

            <z-pagination :pagination="pagination" :total="manufacture.total" :page.sync="manufacture.curPage" :limit.sync="manufacture.pageSize" @change="getManufacturerList"></z-pagination>
          </div>
        </el-dialog>

        <!-- 修改 选择基础档案 -->
        <el-dialog :formProps="formProps" :visible.sync="editselectFormVisible">
          <div>
            <el-col :span="14">
              <el-input v-model="manufacture.queryString" :placeholder="this.$l.search"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="getManufacturerList">{{ $l.search }}</el-button>
            </el-col>
            <el-table :data="manufacture.list" style="width: 90%">
              <el-table-column v-for="(item, index) in manufacture.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
              <el-table-column fixed="right" :label="this.$c.operation" width="145">
                <template slot-scope="scope">
                  <el-button @click="editselectItem(scope.row)" type="text" size="small">{{ $l.choose }}</el-button>
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

                <el-col :span="8">
                  <el-form-item :label="$l.approachingReviewDate">
                    <el-date-picker v-model="recEmailList.distanceTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item>
                    <el-button type="primary" @click="sendRoleEmail">{{ $l.sendEmail }}</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-dialog>

        <!-- 查看附件 -->
        <el-dialog width="50%" title="查看附件" :lock-scroll="true" :visible.sync="viewFileFormVisible" custom-class="custom-dialog">
          <div style="padding: 0 50px">
            <!-- 文件表格 -->
            <el-table :data="checkFile.fileList" style="width: 100%">
              <el-table-column v-for="(item, index) in checkFile.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
              <el-table-column v-if="true" :label="$c.operation" :width="86" fixed="right">
                <template slot-scope="scope">
                  <el-button @click="getFilePreview(scope.row.file_url)" type="text" size="small">{{ $c.check }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </el-dialog>
      </div>
    </div>

    <!-- 预览 -->
    <filePreviews v-if="fileUrl" :file-url="fileUrl" :visible="dialogVisible" @update:visible="dialogVisible = $event" />
  </div>
</template>
<script>
import { _, api, zTable, zPagination, zFormDialog, initFuncs, zForm, dayjs } from '@/views/_common'
import axios from 'axios'
import { mapGetters } from 'vuex'
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
      api: api.role,
      pageLoading: false,
      addFormVisible: false,
      checkFormVisible: false,
      editFormVisible: false,
      auditFormVisible: false,
      auditFormsVisible: false,
      selectFormVisible: false,
      addselectFormVisible: false,
      editselectFormVisible: false,
      viewFileFormVisible: false,
      dialogVisible: false,
      recEmailVisible: false,
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
      rowStyles: {
        // 定义行样式
        warning: { background: 'oldlace' },
        success: { background: 'oldlace' },
      },
      query: {
        params: {},
        size: 15,
        page: 1,
        role_type: 'cis',
      },
      queryList: {
        manufacture_name: '',
        address: '',
        requestor_facility_type: '',
        name: '',
        audit_time: '',
        rec_status: null,
      },
      getDetailList: {
        list: {},
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
            title: '调查年份',
            key: 'survey_year',
            width: 60,
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
            key: 'near_audit_time',
            width: 140,
          },
          {
            title: this.$l.auditResult,
            key: 'near_audit_result',
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
            key: 'audit_time',
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
            key: 'audit_time',
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
            width: 280,
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
            key: 'audit_time',
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
            width: 280,
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
          manufacture_record_id: '',
          audit_time: '',
          due_audit_date: '',
          name_zh: '',
          third_party_org: '',
          audit_result: '',
          cost_pay_progress: 0,
          audit_time: '',
          is_submit_cap: 'Y',
          rec_status: 1,
          attachments: [],
          near_third_party_org: '',
          near_rec_status: '',
          near_audit_time: '',
          near_audit_result: '',
        },
        addListInit: {
          manufacture_id: '',
          audit_time: '',
          due_audit_date: '',
          name_zh: '',
          third_party_org: '',
          audit_result: '',
          cost_pay_progress: 0,
          audit_time: '',
          is_submit_cap: 'Y',
          rec_status: 1,
          attachments: [],
          near_third_party_org: '',
          near_rec_status: '',
          near_audit_time: '',
          near_audit_result: '',
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
            width: 300,
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
        pageSize: 15,
        curPage: 1,
        total: 0,
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

      // 发送邮件
      roleList: {
        list: [],
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
  methods: {
    /* 查询 */

    // 尽职调查列表
    getList() {
      this.$request(api.baseUrl + '/Compliance/comPlianceSurvey/getList', this.queryList)
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
      this.$request(api.baseUrl + '/Compliance/complianceManufacturer/getlist', {
        page: this.manufacture.curPage,
        pageSize: this.manufacture.pageSize,
      })
        .then((r) => {
          this.manufacture.list = r.data.list
          this.manufacture.total = r.data.total
        })
        .catch(() => {
          this.pageLoading = false
        })
    },

    // 获取角色
    getRoleList() {
      this.pageLoading = true
      this.$request(this.api + 'getlist', this.query)
        .then((r) => {
          this.pageLoading = false
          this.roleList.list = r.data.list
          this.roleList.total = r.data.total
        })
        .catch(() => {
          this.pageLoading = false
        })
    },

    getRoleEmail() {
      this.$request(api.baseUrl + '/Compliance/complianceSurvey/getRoleEmailList', {})
        .then((r) => {
          this.recEmailList.list = r.data.list
          this.recEmailList.total = r.data.total
        })
        .catch(() => {})
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
      this.$request(api.baseUrl + '/Compliance/comPlianceSurvey/getList', {
        manufacture_id: row.manufacture_id,
      })
        .then((r) => {
          if (r.data.list.length != 0) {
            this.addSurvey.addList.near_audit_result = r.data.list[0].near_audit_result
            this.addSurvey.addList.near_audit_time = r.data.list[0].near_audit_time
            this.addSurvey.addList.near_rec_status = r.data.list[0].near_rec_status
            this.addSurvey.addList.near_third_party_org = r.data.list[0].near_third_party_org
          }
        })
        .catch(() => {
          this.pageLoading = false
        })
      this.addSurvey.addList.manufacture_id = row.manufacture_id
      this.addSurvey.addList.manufacture_record_id = row.id
      this.addSurvey.addList.name_zh = row.name_zh
      this.addSurvey.addList.third_party_org = row.third_party_org

      this.addselectFormVisible = false
    },

    // 新增 打开选择附件窗口，返回附件信息
    addFile(e) {
      let someFlag = this.addSurvey.addFileList.some((fileObj) => {
        let falg = fileObj[0].name === e.target.files[0].name
        return falg
      })
      if (someFlag) {
        return this.$message.error('该文件已存在')
      }
      this.addSurvey.addFileList.push(e.target.files)
      let etf = e.target.files
      //console.log(e.target.files)

      this.file(etf)
        .then((fileInfos) => {
          //console.log(fileInfos)
          this.addSurvey.fileList.push(fileInfos[0])
          //console.log(this.addSurvey.fileList)
          // this.addSurvey.addList.attachments = this.addSurvey.fileList
        })
        .catch((error) => {
          this.$message({
            type: 'info',
            message: '添加失败',
          })
        })
    },

    // 移除还未新增的附件
    removeAddClick(row, index) {
      this.addSurvey.fileList.splice(index, 1)
      this.addSurvey.addFileList.splice(index, 1)
      this.$refs.addfileinput.value = ''
      if (this.addSurvey.addList.attachments && this.addSurvey.addList.attachments.length > 0) {
        this.addSurvey.addList.attachments.splice(index, 1)
      }
    },
    // 新增 上传附件，调用新增尽职调查
    submmitadds() {
      if (!this.addSurvey.addList.manufacture_id && this.addSurvey.addList.manufacture_id == '') {
        this.$message({
          type: 'info',
          message: '请选择基础档案',
        })
        return
      }
      if (this.addSurvey.addFileList.length > 0) {
        this.addSurvey.addList.attachments = []
        for (let i = 0; i < this.addSurvey.addFileList.length; i++) {
          this.submmitfile(this.addSurvey.fileList[i], this.addSurvey.addFileList[i])
            .then((r) => {
              r.data.forEach((e) => {
                this.$set(e, 'attachment_type', '1')
              })
              this.addSurvey.addList.attachments.push(r.data[0])
              this.$refs.addfileinput.value = ''
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: '附件添加失败',
              })
            })
        }
      }
      this.$confirm('确认添加该数据吗, 是否继续?', '尽职调查', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.addSurveys()
        })
        .catch(() => {})
    },

    async submmitadd() {
      // 检查基础档案是否选择
      if (!this.addSurvey.addList.manufacture_id) {
        this.$message({
          type: 'info',
          message: '请选择基础档案',
        })
        return
      }

      // 显示确认对话框
      try {
        await this.$confirm('确认添加该数据吗, 是否继续?', '尽职调查', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })

        // 用户点击确定后，检查是否有文件需要上传
        if (this.addSurvey.addFileList.length > 0) {
          this.addSurvey.addList.attachments = []

          // 使用Promise.all来等待所有的文件上传完成
          const uploadPromises = this.addSurvey.addFileList.map((file, index) => {
            return this.submmitfile(this.addSurvey.fileList[index], file)
              .then((r) => {
                r.data.forEach((e) => this.$set(e, 'attachment_type', '1'))
                this.addSurvey.addList.attachments.push(r.data[0])
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '附件添加失败',
                })
                throw new Error('附件上传失败') // 确保有错误时不会继续执行
              })
          })

          // 等待所有文件上传完成
          await Promise.all(uploadPromises)

          // 如果所有文件上传成功，则调用新增方法
          this.addSurveys()
        } else {
          // 如果没有文件需要上传，直接调用新增方法
          this.addSurveys()
        }
      } catch (error) {
        // 用户点击取消或上传过程中出错
        if (error.message !== '附件上传失败') {
          this.$message({
            type: 'info',
            message: '操作已取消',
          })
        }
      }
    },

    // 新增/修改尽职调查
    addSurveys() {
      this.$request(api.baseUrl + '/Compliance/complianceSurvey/addSurvey', this.addSurvey.addList, 'post')
        .then(() => {
          this.$message({
            type: 'success',
            message: '添加成功!',
          })
          this.addSurvey.addList = this.addSurvey.addListInit
          this.addSurvey.fileList = []
          this.addSurvey.addFileList = []
          this.addSurvey.addList.attachments = []
          this.addFormVisible = false
          this.getList()
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '添加失败',
          })
        })
    },

    /* 查看表格数据 */

    getDetail(id) {
      this.$request(api.baseUrl + '/Compliance/complianceSurvey/getDetail', {
        survey_id: id,
      })
        .then((r) => {
          return r
        })
        .catch(() => {})
    },
    // 查看
    async checkClick(row, index) {
      this.pageLoading = true
      this.$request(api.baseUrl + '/Compliance/complianceSurvey/getDetail', {
        survey_id: row.survey_id,
      }).then((r) => {
        let cRow = _.cloneDeep(r)

        if (Number(cRow.data.cost_pay_progress)) {
          cRow.data.cost_pay_progress = Number(cRow.data.cost_pay_progress)
        } else {
          cRow.data.cost_pay_progress = 0
        }
        this.checkSurvey.list = cRow.data
      })
      await this.checkviewFile(row.survey_id)
        .then((r) => {
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
            this.checkSurvey.fileList = _.cloneDeep(processedFiles)
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
      ////console.log(row)
      let rowList = _.cloneDeep(row)
      this.$set(rowList, 'id', row.survey_id)
      this.$set(rowList, 'manufacture_id', row.bindManufacturerid)
      this.$set(rowList, 'manufacture_record_id', row.manufacturer_permary_id)
      if (Number(rowList.cost_pay_progress)) {
        rowList.cost_pay_progress = Number(rowList.cost_pay_progress)
      } else {
        rowList.cost_pay_progress = 0
      }
      this.editSurvey.list = rowList
      this.checkviewFile(row.survey_id)
        .then((r) => {
          this.editFormVisible = true
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
          this.editSurvey.fileList = _.cloneDeep(processedFiles)
          this.editSurvey.editFileList = []
          this.editSurvey.editList.attachments = _.cloneDeep(processedFiles)

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
      this.editSurvey.editFileList.push(e.target.files)
      let etf = e.target.files

      this.file(etf)
        .then((fileInfos) => {
          this.editSurvey.fileList.push(fileInfos[0])
          // this.editSurvey.editList.attachments = this.editSurvey.fileList
        })
        .catch((error) => {})
    },
    // 移除还未新增的附件
    editDeleteFile(row, index) {
      // this.$refs.editfileinput.value = null
      ////console.log(row)
      //console.log(index)

      this.editSurvey.fileList.splice(index, 1)
      if (this.editSurvey.editFileList.length > 0) {
        if (!row.id) {
          this.editSurvey.editFileList = this.editSurvey.editFileList.filter((e) => {
            return e.file_name == row.file_name
          })
        }
      }
      if (this.editSurvey.editList.attachments && this.editSurvey.editList.attachments.length > 0) {
        if (row.id) {
          this.editSurvey.editList.attachments = this.editSurvey.editList.attachments.filter((e) => {
            return e.id != row.id
          })
        }
      }
    },

    // 提交修改
    async submmitedit() {
      try {
        await this.$confirm('确认添加该数据吗, 是否继续?', '尽职调查', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        })
        this.$set(this.editSurvey.list, 'attachments', this.editSurvey.fileList)
        if (this.editSurvey.editFileList.length == 0) {
          this.editSurveys()
        } else {
          // let editAttachments = []
          // 使用Promise.all来等待所有的文件上传完成
          const uploadPromises = this.editSurvey.editFileList.map((file, index) => {
            return this.submmitfile(this.editSurvey.fileList[index], file)
              .then((r) => {
                //console.log(r)
                r.data.forEach((e) => this.$set(e, 'attachment_type', '1'))
                // editAttachments.push(r.data[0])
                //console.log(this.editSurvey.editList)
                //console.log(this.editSurvey.list)
                this.editSurvey.editList.attachments.push(r.data[0])
                this.editSurvey.list.attachments = this.editSurvey.editList.attachments
              })
              .catch(() => {
                this.$message({
                  type: 'info',
                  message: '附件添加失败',
                })
                throw new Error('附件上传失败') // 确保有错误时不会继续执行
              })
          })

          // 等待所有文件上传完成
          await Promise.all(uploadPromises)

          // 如果所有文件上传成功，则调用新增方法
          this.editSurveys()
        }
      } catch (e) {
        // 用户点击取消或上传过程中出错
        if (error.message !== '附件上传失败') {
          this.$message({
            type: 'info',
            message: '操作已取消',
          })
        }
      }
    },
    // 新增/修改尽职调查
    editSurveys() {
      //console.log(this.editSurvey.list)
      // this.editSurvey.list.id = ''
      this.$request(api.baseUrl + '/Compliance/complianceSurvey/addSurvey', this.editSurvey.list, 'post')
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
      this.$router.push({
        path: '/compliance/InvestigationInfo',
        query: { manufacture_id: row.manufacturer_id },
      })
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
      this.$set(this.auditSurvey.list, 'rec_status', i)

      this.auditFormsVisible = true
    },
    // 提交审核
    submitAudit() {
      if (!this.auditSurvey.list.rec_status && this.auditSurvey.list.rec_status == null) {
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
          this.$request(api.baseUrl + '/Compliance/complianceSurvey/auditSurvey', this.auditSurvey.list, 'post')
            .then((r) => {
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
    submmitfile(fileList, addList) {
      //console.log(fileList)
      //console.log(addList)
      const formData = new FormData()
      formData.append('file', addList[0])
      formData.append('attachment_type', fileList.attachment_type)
      let r = this.$request(api.baseUrl + '/Compliance/complianceAttachments/uploadAttachment', formData, 'post')
      return r
    },
    addsubmmitfile(fileList, addList) {
      //console.log(fileList)
      //console.log(addList)
      const formData = new FormData()
      formData.append('file', addList[0])
      formData.append('attachment_type', fileList.attachment_type)
      this.$request(api.baseUrl + '/Compliance/complianceAttachments/uploadAttachment', formData, 'post')
        .then((r) => {
          this.addSurvey.addList.attachments.push(r.data[0])
          //console.log(this.addSurvey.addList.attachments)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '附件添加失败',
          })
        })
    },
    // 删除附件
    removeEditFile(row, index) {
      let i = index + 1
      this.$confirm('此操作将删除第' + i + '条数据, 是否继续?', '删除帮助手册', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
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
            let now = new Date()
            const fileInfo = {
              file_name: file_name,
              file_suffix: fileExtension,
              attachment_type: 1,
              create_user: this.$store.getters.user.userId,
              create_time: new Date().toLocaleString(),
              modify_user: this.$store.getters.user.userId,
              modify_time: new Date().toLocaleString(),
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
      return file_name.slice(Math.max(0, file_name.lastIndexOf('.')) || Infinity)
    },

    // 显示
    truncateAddress(address, maxLines = 3) {
      if (!address) return ''
    },

    // 公共 获取附件
    checkviewFile(id) {
      let r = this.$request(api.baseUrl + '/Compliance/complianceAttachments/checkManufacturerAttachments', {
        id: id,
        file_type: 1,
      })
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
          this.checkFile.fileList = _.cloneDeep(processedFiles)

          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    },
    // 点击查看文件
    viewFile(id) {
      this.pageLoading = true

      this.$request(api.baseUrl + '/Compliance/complianceAttachments/checkManufacturerAttachments', {
        id: id,
        file_type: 1,
      })
        .then((r) => {
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
          // this.downloadFile(file_url, file_name)
          this.getFilePreview(file_url)

          this.pageLoading = false
        })
        .catch(() => {
          this.pageLoading = false
        })
    },

    // 格式化审核状态
    formatterRec(row) {
      const found = this.rec_status.find((e) => e.value == row)
      if (found) {
        return found.label
      }
    },

    // 预览文件
    getFilePreview(url) {
      const urls = api.baseUrl + '/' + url
      this.fileUrl = urls
      this.dialogVisible = true
    },

    // 下载

    exportInfo() {
      const mergedArrayUsingSpread = [...this.tableList.columns1, ...this.tableList.columns2, ...this.tableList.columns3, ...this.tableList.columns4]
      import('@/vendor/Export2Excel')
        .then((excel) => {
          const tHeader = mergedArrayUsingSpread.map((item) => {
            return item.title || item.key
          })

          const filterVal1 = mergedArrayUsingSpread.map((item) => {
            return item.key
          })

          const data1 = this.tableList.list.map((item) => filterVal1.map((key) => item[key]))
          excel.export_json_to_excel({
            header: tHeader,
            sheetname: '回答详情',
            data: data1,
            filename: (this.name || 'export_data') + '_' + dayjs().format('YYYYMMDD'),
          })
          this.exportLoading = false
        })
        .catch((e) => {
          this.exportLoading = false
          this.$message.error('数据处理失败，导出失败')

          throw e
        })
    },

    // 邮件通知
    recEmail() {
      this.recEmailVisible = true
      this.getRoleList()
      this.getRoleEmail()
    },

    addRoleItem(row, index) {
      this.surveyEmail.rec_survey = '1'
      this.surveyEmail.role_id = row.role_id
      this.$confirm('是否添加角色为收件对象, 是否继续?', '尽职调查', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$request(api.baseUrl + '/Compliance/complianceSurvey/updateSurveyEmail', this.surveyEmail, 'post')
            .then((r) => {
              this.$message({
                type: 'success',
                message: '添加成功',
              })
              this.getRoleEmail()
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
            message: '取消添加',
          })
        })
    },

    deleteRoleItem(row, index) {
      this.surveyEmail.rec_survey = '0'
      this.surveyEmail.role_id = row.role_id
      this.$confirm('是否删除角色为收件对象, 是否继续?', '尽职调查', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$request(api.baseUrl + '/Compliance/complianceSurvey/updateSurveyEmail', this.surveyEmail, 'post')
            .then((r) => {
              this.$message({
                type: 'success',
                message: '删除成功',
              })
              this.getRoleEmail()
            })
            .catch(() => {
              this.$message({
                type: 'info',
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

    sendRoleEmail() {
      this.$confirm('是否发送邮件, 是否继续?', '尽职调查', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$request(api.baseUrl + '/Compliance/complianceSurvey/roleEmail', { distanceTime: this.recEmailList.distanceTime }, 'post')
            .then((r) => {
              this.$message({
                type: 'success',
                message: '添加成功',
              })
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
            message: '取消添加',
          })
        })
    },

    tableRowClassName({ row, rowIndex }) {
      if (rowIndex % 2 == 0) {
        return this.rowStyles.success
      } else {
        return ''
      }
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
/* .white-space-pre-line {
  white-space: pre-line;
} */
.truncate-lines {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  /* 限制为3行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
