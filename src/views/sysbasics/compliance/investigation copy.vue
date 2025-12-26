<template>
  <div class="app-container" v-loading="pageLoading">
    <!-- 查询区域 -->
    <div>
      <div style="display: flex; gap: 16px; margin-bottom: 10px">
        <!-- Left: search fields in columns -->
        <div style="flex: 1; display: flex; flex-direction: column; gap: 12px">
          <div style="display: flex; gap: 12px">
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ l.manufactureName }}</label>
              <el-input :placeholder="l.pleaseEnterAPartnerName" v-model="queryList.manufacture_name" style="width: 100%" clearable />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ l.address }}</label>
              <el-input :placeholder="l.PleaseEnterTheAddress" v-model="queryList.address" style="width: 100%" clearable />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ l.requestorFacilityType }}</label>
              <el-select v-model="queryList.requestor_facility_type" :placeholder="l.pleaseSelect" clearable style="width: 100%">
                <el-option label="T1" value="T1"></el-option>
                <el-option label="T2" value="T2"></el-option>
              </el-select>
            </div>
          </div>
          <div style="display: flex; gap: 12px">
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ l.name }}</label>
              <el-input :placeholder="l.pleaseEnterAName" v-model="queryList.name" style="width: 100%" clearable />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ l.auditTime }}</label>
              <el-date-picker v-model="queryList.audit_time" type="date" :placeholder="l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd" style="width: 100%" clearable />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px">
              <label>{{ l.recStatus }}</label>
              <el-select v-model="queryList.rec_status" :placeholder="l.pleaseEnterTheAuditResult" clearable style="width: 100%">
                <el-option :label="c.all" value=""></el-option>
                <el-option v-for="(item, index) in rec_status" :label="item.label" :value="item.value" :key="index"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <!-- Right: buttons -->
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-end; min-width: 160px; gap: 12px">
          <el-button v-show="showAuth.m_search" type="primary" size="medium" @click="submitForm" style="margin-right: 8px">{{ c.queryButton }}</el-button>
          <el-button v-show="showAuth.m_search" type="info" size="medium" @click="resetForm">{{ l.reset }}</el-button>
        </div>
      </div>
    </div>
    <el-divider></el-divider>

    <!-- 内容 -->
    <div>
      <el-button v-show="showAuth.m_add" @click="addForm()" icon="el-icon-search" type="primary">{{ l.cAdd }}</el-button>

      <el-button v-show="showAuth.m_export" @click="exportInfo()" icon="el-icon-download" type="info" class="fr">{{ l.down }}</el-button>

      <el-button @click="recEmail()" icon="el-icon-message" type="info" class="fr">{{ l.emailNotification }}</el-button>

      <div style="margin-top: 10px">
        <!-- 表格 -->
        <el-table :data="tableList.list" :row-style="tableRowClassName" border stripe style="width: 100%;border" highlight-current-row max-height="575">
          <el-table-column width="460" :label="l.basicInformation" fixed="left">
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
          <el-table-column :label="l.complianceContactInfor">
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
          <el-table-column :label="l.latestSeaAudit">
            <el-table-column v-for="(item, index) in tableList.columns3" :key="index" :prop="item.key" :label="item.title" :width="item.width" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="item.formatter" v-html="item.formatter(scope.row[item.key])"></span>
                <span v-else>
                  {{ scope.row[item.key] }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="l.annualSeaAudit">
            <el-table-column v-for="(item, index) in tableList.columns4" :key="index" :prop="item.key" :label="item.title" :width="item.width" show-overflow-tooltip>
              <template slot-scope="scope">
                <el-button v-if="item.key === 'audit_file'" type="text" size="small" @click="clickViewFile(scope.row)" style="color: orange">
                  {{ l.viewFile }}
                </el-button>
                <span v-else-if="item.key === 'is_submit_cap'">
                  {{ scope.row.is_submit_cap == 'Y' ? l.yes : l.no }}
                </span>
                <span v-else>
                  {{ scope.row[item.key] }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column fixed="right" :label="c.operation" width="270">
            <template slot-scope="scope">
              <el-button @click="checkClick(scope.row, scope.$index)" type="text" size="small">{{ c.check }}</el-button>
              <el-button v-show="showAuth.m_updata" @click="editClick(scope.row, scope.$index)" type="text" size="small" class="text-yellow">{{ l.modify }}</el-button>
              <el-button @click="historyClick(scope.row, scope.$index)" type="text" size="small" style="color: gray">{{ l.history }}</el-button>
              <el-button v-show="showAuth.m_audit && scope.row.rec_status === -1" @click="auditNew(scope.row, scope.$index)" type="text" size="small" style="color: green">{{ l.newOrder }}</el-button>
              <el-button v-show="showAuth.m_audit && scope.row.rec_status === 1" @click="auditClick(scope.row, scope.$index)" type="text" size="small" style="color: orange">{{ l.audit }}</el-button>
              <el-button v-show="showAuth.m_audit && scope.row.rec_status === 7" @click="invalid(scope.row, scope.$index)" type="text" size="small" style="color: red">{{ l.cancelAudit }}</el-button>
              <el-button v-show="showAuth.m_audit && scope.row.rec_status === 7" @click="auditClose(scope.row, scope.$index)" type="text" size="small" style="color: green">{{ l.end }}</el-button>
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
                  <el-form-item :label="l.basicInformation"></el-form-item>
                </el-col>

                <el-form-item :label="l.basicArchives">
                  <el-col :span="8">
                    <el-input v-model="editSurvey.list.name_zh" :placeholder="l.pleaseSelectBaseArchive" :disabled="true"></el-input>
                  </el-col>

                  <!-- <el-button @click="editselectClick()" type="primary"
                      >查看</el-button
                    > -->
                </el-form-item>

                <el-col :span="24">
                  <el-form-item :label="l.latestSeaAudit"></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="l.auditTime">
                    <el-date-picker v-model="editSurvey.list.audit_time" type="date" :placeholder="l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd" style="width: 300px"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="l.nameOfTheThirdPartyOrganization">
                    <el-input v-model="editSurvey.list.third_party_org" :placeholder="l.pleaseEnterThirdPartyOrganization"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="l.auditResult">
                    <el-input v-model="editSurvey.list.audit_result" :placeholder="l.pleaseEnterTheAuditResult"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item :label="l.annualSeaAudit"></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="l.dueAuditDate">
                    <el-date-picker v-model="editSurvey.list.due_audit_date" type="date" :placeholder="l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd" style="width: 300px"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="l.costPayProgress">
                    <el-slider v-model="editSurvey.list.cost_pay_progress"></el-slider>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="l.realAuditDate">
                    <el-date-picker v-model="editSurvey.list.audit_time" type="date" :placeholder="l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd" style="width: 300px"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item :label="l.isSubmitCap">
                    <el-radio v-model="editSurvey.list.is_submit_cap" label="Y">{{ l.yes }}</el-radio>
                    <el-radio v-model="editSurvey.list.is_submit_cap" label="N">{{ l.no }}</el-radio>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item :label="l.auditFile"></el-form-item>
                </el-col>
                <input type="file" multiple @change="editFile" ref="editfileinput" style="display: none" />
                <el-col :span="24">
                  <el-button type="primary" @click="$refs.editfileinput.click()">{{ l.selectFile }}</el-button>
                </el-col>
              </el-form>
            </div>
            <div>
              <!-- 文件表格 -->
              <el-table :data="editSurvey.fileList" style="width: 90%">
                <el-table-column v-for="(item, index) in editSurvey.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                <el-table-column fixed="right" :label="c.operation" width="145">
                  <template slot-scope="scope">
                    <!-- <el-button
                        @click="getFilePreview(scope.row.file_url)"
                        type="text"
                        size="small"
                        >查看</el-button
                      > -->
                    <el-button @click="editDeleteFile(scope.row, scope.$index)" type="text" size="small">{{ c.delete }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="editFormVisible = false">{{ c.cancel }}</el-button>
            <el-button type="primary" @click="submmitedit">
              {{ c.confirm }}
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
                  <el-form-item :label="l.basicInformation"></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="l.basicArchives">
                    <el-input v-model="checkSurvey.list.name_zh"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="24"></el-col>

                <el-col :span="6">
                  <el-form-item :label="l.surveyYear">
                    <el-input v-model="checkSurvey.list.survey_year"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item :label="l.latestSeaAudit"></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="l.auditDate">
                    <el-date-picker disabled v-model="checkSurvey.list.near_audit_time" type="date" value-format="yyyy-MM-dd" style="width: 300px"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="l.nameOfTheThirdPartyOrganization">
                    <el-input disabled v-model="checkSurvey.list.near_third_party_org"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="l.auditResult">
                    <el-input disabled v-model="checkSurvey.list.near_audit_result"></el-input>
                  </el-form-item>
                </el-col>

                <el-col :span="24">
                  <el-form-item :label="l.annualSeaAudit"></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="l.dueAuditDate">
                    <el-date-picker v-model="checkSurvey.list.due_audit_date" type="date" value-format="yyyy-MM-dd" style="width: 300px"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="l.costPayProgress">
                    <el-slider v-model="checkSurvey.list.cost_pay_progress"></el-slider>
                  </el-form-item>
                </el-col>
                <el-col :span="2">
                  <el-form-item label=""></el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="l.realAuditDate">
                    <el-date-picker v-model="checkSurvey.list.audit_time" type="date" value-format="yyyy-MM-dd" style="width: 300px"></el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item :label="l.isSubmitCap">
                    <el-radio v-model="checkSurvey.list.is_submit_cap" label="Y">{{ l.yes }}</el-radio>
                    <el-radio v-model="checkSurvey.list.is_submit_cap" label="N">{{ l.no }}</el-radio>
                  </el-form-item>
                </el-col>
                <el-col :span="24">
                  <el-form-item :label="l.auditFile"></el-form-item>
                </el-col>
              </el-form>
            </div>
            <div>
              <!-- 文件表格 -->
              <el-table :data="checkSurvey.fileList" style="width: 90%">
                <el-table-column v-for="(item, index) in checkSurvey.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                <el-table-column fixed="right" :label="c.operation" width="145">
                  <template slot-scope="scope">
                    <el-button @click="getFilePreview(scope.row.file_url)" type="text" size="small">{{ c.check }}</el-button>
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
        <CustomDialog :title="'Add'" :clickOutside="false" width="100%" :lock-scroll="true" @submmit="submmitadd" :visible.sync="addFormVisible" custom-class="custom-dialog" :maxWidth="'1080px'">
          <template #content>
            <div class="flex flex-col gap-2">
              <div class="text-xl font-black text-gray-900 dark:text-white">{{ l.basicInformation }}</div>
              <div class="grid grid-cols-1 gap-4">
                <div class="flex flex-col gap-1">
                  <label class="font-light text-sm text-gray-700 mr-2">
                    {{ l.basicArchives }}
                    <span class="text-red-500">*</span>
                  </label>
                  <div class="flex gap-2">
                    <el-input v-model="addSurvey.addList.name_en" :placeholder="l.basicArchives" class="w-full"></el-input>
                    <el-button @click="addselectClick()" type="primary" class="ml-2">{{ c.check }}</el-button>
                  </div>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-light text-sm text-gray-700">
                    {{ l.surveyYear }}
                    <span class="text-red-500">*</span>
                  </label>
                  <el-date-picker v-model="addSurvey.addList.survey_year" type="year" :placeholder="l.surveyYearPlaceholder" format="yyyy" value-format="yyyy" class="w-full"></el-date-picker>
                </div>
              </div>

              <div class="text-xl font-black text-gray-900 dark:text-white mt-2">{{ l.latestSeaAudit }}</div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div class="flex flex-col gap-2">
                  <label class="font-light text-sm text-gray-700">{{ l.auditDate }}</label>
                  <el-date-picker disabled v-model="addSurvey.addList.near_audit_time" type="date" :placeholder="l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd" class="w-full" style="width: 100%"></el-date-picker>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-light text-sm text-gray-700">{{ l.nameOfTheThirdPartyOrganization }}</label>
                  <el-input disabled v-model="addSurvey.addList.near_third_party_org" :placeholder="l.pleaseEnterThirdPartyOrganization" class="w-full"></el-input>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-light text-sm text-gray-700">{{ l.auditResult }}</label>
                  <el-input disabled v-model="addSurvey.addList.near_audit_result" :placeholder="l.pleaseEnterTheAuditResult" class="w-full"></el-input>
                </div>
              </div>

              <div class="text-xl font-black text-gray-900 dark:text-white mt-2">{{ l.annualSeaAudit }}</div>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div class="flex flex-col gap-2">
                  <label class="font-light text-sm text-gray-700">
                    {{ l.dueAuditDate }}
                    <span class="text-red-500">*</span>
                  </label>
                  <el-date-picker v-model="addSurvey.addList.due_audit_date" type="date" :placeholder="l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd" class="w-full" style="width: 100%"></el-date-picker>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-light text-sm text-gray-700">{{ l.costPayProgress }}</label>
                  <el-slider v-model="addSurvey.addList.cost_pay_progress" class="w-full"></el-slider>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-light text-sm text-gray-700">{{ l.realAuditDate }}</label>
                  <el-date-picker v-model="addSurvey.addList.audit_time" type="date" :placeholder="l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd" class="w-full" style="width: 100%"></el-date-picker>
                </div>
              </div>

              <div class="grid grid-cols-1 gap-4 mt-2">
                <div class="flex flex-col gap-4">
                  <label class="font-light text-sm text-gray-700">{{ l.isSubmitCap }}</label>
                  <div class="flex gap-2">
                    <el-radio v-model="addSurvey.addList.is_submit_cap" label="Y">{{ l.yes }}</el-radio>
                    <el-radio v-model="addSurvey.addList.is_submit_cap" label="N">{{ l.no }}</el-radio>
                  </div>
                </div>
              </div>

              <div class="text-xl font-black text-gray-900 dark:text-white mt-2">{{ l.auditFile }}</div>

              <div class="grid grid-cols-1 gap-4 mt-2">
                <input type="file" @change="addFile" ref="addfileinput" style="display: none" />
                <el-button type="primary" @click="$refs.addfileinput.click()" class="w-fit">{{ l.selectFile }}</el-button>
              </div>
              <div>
                <!-- 文件表格 -->
                <el-table :data="addSurvey.fileList">
                  <el-table-column v-for="(item, index) in addSurvey.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                  <el-table-column fixed="right" :label="c.operation" width="145">
                    <template slot-scope="scope">
                      <el-button @click="removeAddClick(scope.row, scope.$index)" type="text" size="small">{{ c.delete }}</el-button>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>
          </template>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addFormVisible = false">{{ c.cancel }}</el-button>
            <el-button type="primary" @click="submmitadd">
              {{ c.confirm }}
            </el-button>
            <slot name="operation"></slot>
          </span>
        </CustomDialog>

        <!-- 新增 选择基础档案 -->
        <CustomDialog :formProps="formProps" :visible.sync="addselectFormVisible" :title="l.selectTheBaseFile" :maxWidth="'800px'" :width="'100%'">
          <template #content>
            <div class="flex flex-col gap-2">
              <div class="flex gap-2 items-center">
                <el-input v-model="manufacture.queryString" :placeholder="l.search"></el-input>
                <el-button type="primary" @click="getManufacturerList">{{ l.search }}</el-button>
              </div>

              <el-table :data="manufacture.list" style="width: 100%; height: 700px" max-height="550">
                <el-table-column v-for="(item, index) in manufacture.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                <el-table-column fixed="right" :label="c.operation" width="100">
                  <template slot-scope="scope">
                    <el-button @click="addselectItem(scope.row)" type="text" size="small">{{ l.choose }}</el-button>
                  </template>
                </el-table-column>
              </el-table>

              <z-pagination :pagination="pagination" :total="manufacture.total" :page.sync="manufacture.curPage" :limit.sync="manufacture.pageSize" @change="getManufacturerList"></z-pagination>
            </div>
          </template>
        </CustomDialog>

        <!-- 修改 选择基础档案 -->
        <el-dialog :formProps="formProps" :visible.sync="editselectFormVisible">
          <div>
            <el-col :span="14">
              <el-input v-model="manufacture.queryString" :placeholder="l.search"></el-input>
            </el-col>
            <el-col :span="4">
              <el-button type="primary" @click="getManufacturerList">{{ l.search }}</el-button>
            </el-col>
            <el-table :data="manufacture.list" style="width: 90%">
              <el-table-column v-for="(item, index) in manufacture.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
              <el-table-column fixed="right" :label="c.operation" width="145">
                <template slot-scope="scope">
                  <el-button @click="editselectItem(scope.row)" type="text" size="small">{{ l.choose }}</el-button>
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
                  <el-form-item :label="l.roles"></el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item :label="l.emailNotificationRole"></el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-table :data="roleList.list" style="width: 90%">
                    <el-table-column v-for="(item, index) in roleList.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                    <el-table-column fixed="right" :label="c.operation" width="145">
                      <template slot-scope="scope">
                        <el-button @click="addRoleItem(scope.row)" type="text" size="small">{{ l.addNotification }}</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>

                <el-col :span="12">
                  <el-table :data="recEmailList.list" style="width: 90%">
                    <el-table-column v-for="(item, index) in recEmailList.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                    <el-table-column fixed="right" :label="c.operation" width="145">
                      <template slot-scope="scope">
                        <el-button @click="deleteRoleItem(scope.row)" type="text" size="small" style="color: red">{{ l.cancellationNotice }}</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </el-col>

                <el-col :span="24">
                  <el-form-item :label="l.sendEmail"></el-form-item>
                </el-col>

                <el-col :span="8">
                  <el-form-item :label="l.approachingReviewDate">
                    <el-date-picker v-model="recEmailList.distanceTime" type="date" :placeholder="l.selectDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
                  </el-form-item>
                </el-col>

                <el-col :span="4">
                  <el-form-item>
                    <el-button type="primary" @click="sendRoleEmail">{{ l.sendEmail }}</el-button>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </div>
        </el-dialog>

        <!-- 查看附件 -->
        <el-dialog width="50%" :title="l.viewAttachment" :lock-scroll="true" :visible.sync="viewFileFormVisible" custom-class="custom-dialog">
          <div style="padding: 0 50px">
            <!-- 文件表格 -->
            <el-table :data="checkFile.fileList" style="width: 100%">
              <el-table-column v-for="(item, index) in checkFile.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
              <el-table-column v-if="true" :label="c.operation" :width="86" fixed="right">
                <template slot-scope="scope">
                  <el-button @click="getFilePreview(scope.row.file_url)" type="text" size="small">{{ c.check }}</el-button>
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
<script setup>
import { reactive, ref, computed, onMounted, getCurrentInstance, watch } from 'vue'
import { _ } from '@/views/_common'
import { api } from '@/views/_common'
import { dayjs } from '@/views/_common'
import { initFuncs } from '@/views/_common'
import { zForm } from '@/views/_common'
import { zFormDialog } from '@/views/_common'
import { zPagination } from '@/views/_common'
import { zTable } from '@/views/_common'
import exportExcel from '../../../utils/exportExcel'
import CustomDialog from '../../_common/CustomDialog.vue'
import filePreviews from '../../_common/filePreviews.vue'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('investigation')

const pageLoading = ref(false)
const addFormVisible = ref(false)
const checkFormVisible = ref(false)
const editFormVisible = ref(false)
const auditFormVisible = ref(false)
const auditFormsVisible = ref(false)
const selectFormVisible = ref(false)
const addselectFormVisible = ref(false)
const editselectFormVisible = ref(false)
const viewFileFormVisible = ref(false)
const dialogVisible = ref(false)
const recEmailVisible = ref(false)
const file_url = ref('')
const file_name = ref('')
const file_suffix = ref('')
const fileUrl = ref(null)
const isImage = ref(false)
const isPdf = ref(false)
const isText = ref(false)
const fileContent = ref('')
const deleteFalg = ref('N')
const fileInfo = reactive({})
const userAuth = ref([])
const showAuth = reactive({
  m_search: false,
  m_add: false,
  m_del: false,
  m_updata: false,
  m_import: false,
  m_export: false,
  m_upload: false,
  m_audit: false,
  m_print: false,
})

const formProps = reactive({
  dialogWidth: '80%',
  labelWidth: '160px',
})

const pagination = reactive({
  layout: 'prev, pager, next, jumper, ->, total,sizes',
  pagerCount: 7,
  pageSizes: [10, 15, 20, 30, 40, 50, 100],
})

const rowStyles = reactive({
  warning: { background: 'oldlace' },
  success: { background: 'oldlace' },
})

const query = reactive({
  params: {},
  size: 15,
  page: 1,
  role_type: 'cis',
})

const queryList = reactive({
  manufacture_name: '',
  address: '',
  requestor_facility_type: '',
  name: '',
  audit_time: '',
  rec_status: null,
})

const getDetailList = reactive({
  list: {},
})

const fileList = ref([])

const rec_status = computed(() => [
  {
    label: l.value.cancelAudit,
    value: -1,
  },
  {
    label: l.value.newOrder,
    value: 1,
  },
  {
    label: l.value.audit,
    value: 7,
  },
  {
    label: l.value.end,
    value: 99,
  },
])

// Helper functions for formatter
const formatterRec = (row) => {
  const found = rec_status.value.find((e) => e.value == row)
  if (found) {
    return found.label
  }
}

const formatYN = (row) => {
  return row == 'Y' ? l.value.yes : l.value.no
}

const tableList = reactive({
  list: [],
  pageSize: 15,
  curPage: 1,
  total: 0,
  columns1: computed(() => [
    {
      title: l.value.surveyYear,
      key: 'survey_year',
      width: 60,
    },
    {
      title: l.value.nameZh,
      key: 'name_zh',
      width: 120,
    },
    {
      title: l.value.address,
      key: 'address',
      width: 150,
    },
    {
      title: l.value.requestorFacilityType,
      key: 'requestor_facility_type',
      width: 130,
    },
  ]),
  columns2: computed(() => [
    {
      title: l.value.name,
      key: 'contact_name',
      width: 80,
    },
    {
      title: l.value.contactPhone,
      key: 'contact_phone',
      width: 90,
    },
    {
      title: l.value.contactEmail,
      key: 'contact_email',
      width: 190,
    },
  ]),
  columns3: computed(() => [
    {
      title: l.value.auditDate,
      key: 'near_audit_time',
      width: 140,
    },
    {
      title: l.value.auditResult,
      key: 'near_audit_result',
      width: 100,
    },
    {
      title: l.value.recStatus,
      key: 'rec_status',
      formatter: formatterRec,
      width: 100,
    },
  ]),
  columns4: computed(() => [
    {
      title: l.value.dueAuditDate,
      key: 'due_audit_date',
      width: 140,
    },
    {
      title: l.value.costPayProgress,
      key: 'cost_pay_progress',
      width: 120,
    },
    {
      title: l.value.realAuditDate,
      key: 'audit_time',
      width: 140,
    },
    {
      title: l.value.auditFile,
      key: 'audit_file',
      width: 80,
    },
    {
      title: l.value.isSubmitCap,
      key: 'is_submit_cap',
      formatter: formatYN,
      width: 140,
    },
  ]),
})

const checkSurvey = reactive({
  list: {},
  fileList: [],
  fields1: computed(() => [
    {
      title: l.value.nameZh,
      key: 'name_zh',
      props: {
        disabled: true,
      },
      span: 8,
    },
    {
      title: l.value.address,
      key: 'address',
      props: {
        disabled: true,
      },
      span: 8,
    },
    {
      title: l.value.requestorFacilityType,
      key: 'name_zh',
      props: {
        disabled: true,
      },
      span: 8,
    },
    {
      title: l.value.name,
      key: 'contact_name',
      props: {
        disabled: true,
      },
      span: 8,
    },
    {
      title: l.value.contactPhone,
      key: 'contact_phone',
      props: {
        disabled: true,
      },
      span: 8,
    },
    {
      title: l.value.contactEmail,
      key: 'contact_email',
      props: {
        disabled: true,
      },
      span: 8,
    },
    {
      title: l.value.auditDate,
      key: 'audit_time',
      props: {
        disabled: true,
      },
      name: 'date',
      span: 8,
    },
    {
      title: l.value.auditResult,
      key: 'aduit_result',
      props: {
        disabled: true,
      },
      span: 8,
    },
    {
      title: l.value.dueAuditDate,
      key: 'due_audit_date',
      props: {
        disabled: true,
      },
      name: 'date',
      span: 8,
    },
    {
      title: l.value.costPayProgress,
      key: 'cost_pay_progress',
      props: {
        disabled: true,
      },
      span: 8,
    },
    {
      title: l.value.realAuditDate,
      key: 'audit_time',
      props: {
        disabled: true,
      },
      name: 'date',
      span: 8,
    },
    {
      title: l.value.auditResult,
      key: 'vehicleStime',
      props: {
        disabled: true,
      },
      span: 8,
    },
    {
      title: l.value.isSubmitCap,
      key: 'is_submit_cap',
      props: {
        disabled: true,
      },
      span: 8,
    },
  ]),
  columns: computed(() => [
    {
      title: l.value.fileName,
      key: 'file_name',
      width: 280,
    },
    {
      title: l.value.fileSuffix,
      key: 'file_suffix',
      width: 140,
    },
    {
      title: l.value.createUser,
      key: 'create_user',
      width: 140,
    },
    {
      title: l.value.createTime,
      key: 'create_time',
      width: 140,
    },
    {
      title: l.value.modifyUser,
      key: 'modify_user',
      width: 140,
    },
    {
      title: l.value.modifyTime,
      key: 'modify_time',
      width: 140,
    },
  ]),
})

const checkFile = reactive({
  list: {},
  fileList: [],
  columns: computed(() => [
    {
      title: l.value.fileName,
      key: 'file_name',
      width: 260,
    },
    {
      title: l.value.fileSuffix,
      key: 'file_suffix',
      width: 140,
    },
    {
      title: l.value.createUser,
      key: 'create_user',
      width: 120,
    },
    {
      title: l.value.createTime,
      key: 'create_time',
      width: 140,
    },
    {
      title: l.value.modifyUser,
      key: 'modify_user',
      width: 120,
    },
    {
      title: l.value.modifyTime,
      key: 'modify_time',
      width: 140,
    },
  ]),
})

const editSurvey = reactive({
  list: {},
  fileList: [],
  editFileList: [],
  editList: {
    attachments: [],
  },
  fields1: computed(() => [
    {
      title: l.value.nameZh,
      key: 'name_zh',
      span: 8,
    },
    {
      title: l.value.address,
      key: 'address',
      span: 8,
    },
    {
      title: l.value.requestorFacilityType,
      key: 'name_zh',
      span: 8,
    },
    {
      title: l.value.name,
      key: 'contact_name',
      span: 8,
    },
    {
      title: l.value.contactPhone,
      key: 'contact_phone',
      span: 8,
    },
    {
      title: l.value.contactEmail,
      key: 'contact_email',
      span: 8,
    },
    {
      title: l.value.auditDate,
      key: 'audit_time',
      name: 'date',
      span: 8,
    },
    {
      title: l.value.auditResult,
      key: 'aduit_result',
      span: 8,
    },
    {
      title: l.value.dueAuditDate,
      key: 'due_audit_date',
      name: 'date',
      span: 8,
    },
    {
      title: l.value.costPayProgress,
      key: 'cost_pay_progress',
      span: 8,
    },
    {
      title: l.value.realAuditDate,
      key: 'audit_time',
      name: 'date',
      span: 8,
    },
    {
      title: l.value.auditResult,
      key: 'vehicleStime',
      span: 8,
    },
    {
      title: l.value.isSubmitCap,
      key: 'is_submit_cap',
      span: 8,
    },
  ]),
  columns: computed(() => [
    {
      title: l.value.fileName,
      key: 'file_name',
      width: 280,
    },
    {
      title: l.value.fileSuffix,
      key: 'file_suffix',
      width: 140,
    },
    {
      title: l.value.createUser,
      key: 'create_user',
      width: 140,
    },
    {
      title: l.value.createTime,
      key: 'create_time',
      width: 140,
    },
    {
      title: l.value.modifyUser,
      key: 'modify_user',
      width: 140,
    },
    {
      title: l.value.modifyTime,
      key: 'modify_time',
      width: 140,
    },
  ]),
})

const auditSurvey = reactive({
  list: {},
  formProps: {
    dialogWidth: '40%',
    labelWidth: '150px',
  },
  fields: computed(() => [
    {
      title: l.value.auditResult,
      key: 'rec_status',
      name: 'select',
      value: 'value',
      label: 'label',
      options: [
        {
          value: 7,
          label: l.value.pass,
        },
        {
          value: -1,
          label: l.value.fail,
        },
      ],
      span: 18,
    },
    {
      title: l.value.auditRemarks,
      key: 'audit_result',
      name: 'textarea',
      span: 18,
    },
  ]),
  fields1: computed(() => [
    {
      title: l.value.auditRemarks,
      key: 'audit_result',
      name: 'textarea',
      span: 18,
    },
  ]),
})

const addSurvey = reactive({
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
    is_submit_cap: 'Y',
    rec_status: 1,
    attachments: [],
    near_third_party_org: '',
    near_rec_status: '',
    near_audit_time: '',
    near_audit_result: '',
  },
  fields: computed(() => [
    {
      title: l.value.basicArchives,
      key: 'shortphone',
      span: 8,
    },
  ]),
  columns: computed(() => [
    {
      title: l.value.fileName,
      key: 'file_name',
      width: 300,
    },
    {
      title: l.value.fileSuffix,
      key: 'file_suffix',
      width: 140,
    },
    {
      title: l.value.createUser,
      key: 'create_user',
      width: 140,
    },
    {
      title: l.value.createTime,
      key: 'create_time',
      width: 140,
    },
    {
      title: l.value.modifyUser,
      key: 'modify_user',
      width: 140,
    },
    {
      title: l.value.modifyTime,
      key: 'modify_time',
      width: 140,
    },
  ]),
})

const manufacture = reactive({
  list: [],
  pageSize: 15,
  curPage: 1,
  total: 0,
  queryString: '',
  columns: computed(() => [
    {
      title: l.value.manufactureId,
      key: 'manufacture_id',
      width: 200,
    },
    {
      title: l.value.manufacturerNameEn,
      key: 'name_en',
      width: 400,
    },
  ]),
})

const tableData = ref([])

const roleList = reactive({
  list: [],
  total: 0,
  columns: computed(() => [
    {
      title: l.value.role_id,
      key: 'role_id',
    },
    {
      title: l.value.role_name,
      key: 'role_name',
    },
    {
      title: l.value.role_desc,
      key: 'role_desc',
    },
  ]),
  fields: computed(() => [
    {
      title: l.value.role_name,
      key: 'role_name',
      required: true,
    },
    {
      title: l.value.role_desc,
      key: 'role_desc',
      required: true,
    },
  ]),
})

const recEmailList = reactive({
  list: [],
  distanceTime: '',
  total: 0,
  columns: computed(() => [
    {
      title: l.value.role_id,
      key: 'role_id',
    },
    {
      title: l.value.role_name,
      key: 'role_name',
    },
    {
      title: l.value.role_desc,
      key: 'role_desc',
    },
  ]),
})

const surveyEmail = reactive({
  id: '',
  rec_issues: '',
  rec_survey: '',
  role_id: '',
})

// Methods
const getList = () => {
  proxy
    .$request(api.baseUrl + '/Compliance/comPlianceSurvey/getList', queryList)
    .then((r) => {
      tableList.list = r.data.list
      tableList.total = r.data.total
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const submitForm = () => {
  getList()
}

const getManufacturerList = () => {
  proxy
    .$request(api.baseUrl + '/Compliance/complianceManufacturer/getlist', {
      page: manufacture.curPage,
      pageSize: manufacture.pageSize,
    })
    .then((r) => {
      manufacture.list = r.data.list
      manufacture.total = r.data.total
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const getRoleList = () => {
  pageLoading.value = true
  proxy
    .$request(api.role + 'getlist', query)
    .then((r) => {
      pageLoading.value = false
      roleList.list = r.data.list
      roleList.total = r.data.total
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const getRoleEmail = () => {
  proxy
    .$request(api.baseUrl + '/Compliance/complianceSurvey/getRoleEmailList', {})
    .then((r) => {
      recEmailList.list = r.data.list
      recEmailList.total = r.data.total
    })
    .catch(() => {})
}

const addForm = () => {
  addFormVisible.value = true
}

const addselectClick = () => {
  addselectFormVisible.value = true
  getManufacturerList()
}

const addselectItem = (row) => {
  console.log(row.manufacture_id)
  proxy
    .$request(api.baseUrl + '/Compliance/comPlianceSurvey/getList', {
      manufacture_id: row.manufacture_id,
    })
    .then((r) => {
      console.log('r.data.list', r.data.list)
      if (r.data.list.length != 0) {
        addSurvey.addList.near_audit_result = r.data.list[0].near_audit_result
        addSurvey.addList.near_audit_time = r.data.list[0].near_audit_time
        addSurvey.addList.near_rec_status = r.data.list[0].near_rec_status
        addSurvey.addList.near_third_party_org = r.data.list[0].near_third_party_org
      }
    })
    .catch(() => {
      pageLoading.value = false
    })
  addSurvey.addList.manufacture_id = row.manufacture_id
  addSurvey.addList.manufacture_record_id = row.id
  addSurvey.addList.name_en = row.name_en
  addSurvey.addList.third_party_org = row.third_party_org

  addselectFormVisible.value = false
}

const addFile = (e) => {
  let someFlag = addSurvey.addFileList.some((fileObj) => {
    let falg = fileObj[0].name === e.target.files[0].name
    return falg
  })
  if (someFlag) {
    return proxy.$message.error(l.value.fileAlreadyExists)
  }
  addSurvey.addFileList.push(e.target.files)
  let etf = e.target.files

  file(etf)
    .then((fileInfos) => {
      addSurvey.fileList.push(fileInfos[0])
    })
    .catch((error) => {
      proxy.$message({
        type: 'info',
        message: l.value.addFailed,
      })
    })
}

const removeAddClick = (row, index) => {
  addSurvey.fileList.splice(index, 1)
  addSurvey.addFileList.splice(index, 1)
  // refs are not automatically exposed in setup, using template ref
  // proxy.$refs.addfileinput.value = '' // This is one way, or define const addfileinput = ref(null)
  if (addfileinput.value) addfileinput.value.value = ''
  if (addSurvey.addList.attachments && addSurvey.addList.attachments.length > 0) {
    addSurvey.addList.attachments.splice(index, 1)
  }
}

const addfileinput = ref(null)

const submmitadd = async () => {
  if (!addSurvey.addList.manufacture_id) {
    proxy.$message({
      type: 'info',
      message: l.value.pleaseSelectBaseArchive,
    })
    return
  }

  try {
    await proxy.$confirm(l.value.confirmAdd, l.value.title, {
      confirmButtonText: c.value.confirm,
      cancelButtonText: c.value.cancel,
      type: 'warning',
    })

    if (addSurvey.addFileList.length > 0) {
      addSurvey.addList.attachments = []

      const uploadPromises = addSurvey.addFileList.map((file, index) => {
        return submmitfile(addSurvey.fileList[index], file)
          .then((r) => {
            r.data.forEach((e) => (e['attachment_type'] = '1'))
            addSurvey.addList.attachments.push(r.data[0])
          })
          .catch(() => {
            proxy.$message({
              type: 'info',
              message: l.value.attachmentAddFailed,
            })
            throw new Error('附件上传失败')
          })
      })

      await Promise.all(uploadPromises)
      addSurveys()
    } else {
      addSurveys()
    }
  } catch (error) {
    if (error.message !== '附件上传失败') {
      proxy.$message({
        type: 'info',
        message: l.value.operationCanceled,
      })
    }
  }
}

const addSurveys = () => {
  proxy
    .$request(api.baseUrl + '/Compliance/complianceSurvey/addSurvey', addSurvey.addList, 'post')
    .then(() => {
      proxy.$message({
        type: 'success',
        message: l.value.addSuccess,
      })
      Object.assign(addSurvey.addList, addSurvey.addListInit)
      addSurvey.fileList = []
      addSurvey.addFileList = []
      addSurvey.addList.attachments = []
      addFormVisible.value = false
      getList()
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: l.value.addFailed,
      })
    })
}

const getDetail = (id) => {
  proxy
    .$request(api.baseUrl + '/Compliance/complianceSurvey/getDetail', {
      survey_id: id,
    })
    .then((r) => {
      return r
    })
    .catch(() => {})
}

const checkClick = async (row, index) => {
  pageLoading.value = true
  proxy
    .$request(api.baseUrl + '/Compliance/complianceSurvey/getDetail', {
      survey_id: row.survey_id,
    })
    .then((r) => {
      let cRow = _.cloneDeep(r)

      if (Number(cRow.data.cost_pay_progress)) {
        cRow.data.cost_pay_progress = Number(cRow.data.cost_pay_progress)
      } else {
        cRow.data.cost_pay_progress = 0
      }
      checkSurvey.list = cRow.data
    })
  await checkviewFile(row.survey_id)
    .then((r) => {
      if (r.data && r.data.length == 0) {
        checkFormVisible.value = true
        pageLoading.value = false
      } else {
        const processedFiles = r.data.map((file) => {
          const { file_url: url, file_name: name, file_type: type } = file
          file_name.value = name
          file_url.value = url
          // file_type is not defined in ref, but used in Options API data
          // file_type.value = type
          const fileExtension = getFileExtension(name)
          return {
            ...file,
            file_suffix: fileExtension,
            attachment_type: '1',
          }
        })
        checkSurvey.fileList = _.cloneDeep(processedFiles)
        checkFormVisible.value = true
        pageLoading.value = false
      }
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const editClick = (row, index) => {
  let rowList = _.cloneDeep(row)
  rowList.id = row.survey_id
  rowList.manufacture_id = row.bindManufacturerid
  rowList.manufacture_record_id = row.manufacturer_permary_id
  if (Number(rowList.cost_pay_progress)) {
    rowList.cost_pay_progress = Number(rowList.cost_pay_progress)
  } else {
    rowList.cost_pay_progress = 0
  }
  editSurvey.list = rowList
  checkviewFile(row.survey_id)
    .then((r) => {
      editFormVisible.value = true
      const processedFiles = r.data.map((file) => {
        const { file_url: url, file_name: name, file_type: type } = file
        file_name.value = name
        file_url.value = url
        // file_type.value = type
        const fileExtension = getFileExtension(name)
        return {
          ...file,
          file_suffix: fileExtension,
          attachment_type: '1',
        }
      })
      editSurvey.fileList = _.cloneDeep(processedFiles)
      editSurvey.editFileList = []
      editSurvey.editList.attachments = _.cloneDeep(processedFiles)

      pageLoading.value = false
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const editselectClick = () => {
  editselectFormVisible.value = true
  getManufacturerList()
}

const editselectItem = (row) => {
  editSurvey.list.manufacturerid = row.manufacture_id
  editSurvey.list.name_zh = row.name_zh
  editselectFormVisible.value = false
}

const editFile = (e) => {
  editSurvey.editFileList.push(e.target.files)
  let etf = e.target.files

  file(etf)
    .then((fileInfos) => {
      editSurvey.fileList.push(fileInfos[0])
    })
    .catch((error) => {})
}

const editDeleteFile = (row, index) => {
  editSurvey.fileList.splice(index, 1)
  if (editSurvey.editFileList.length > 0) {
    if (!row.id) {
      editSurvey.editFileList = editSurvey.editFileList.filter((e) => {
        return e.file_name == row.file_name
      })
    }
  }
  if (editSurvey.editList.attachments && editSurvey.editList.attachments.length > 0) {
    if (row.id) {
      editSurvey.editList.attachments = editSurvey.editList.attachments.filter((e) => {
        return e.id != row.id
      })
    }
  }
}

const submmitedit = async () => {
  try {
    await proxy.$confirm(l.value.confirmEdit, l.value.title, {
      confirmButtonText: c.value.confirm,
      cancelButtonText: c.value.cancel,
      type: 'warning',
    })
    // proxy.$set(editSurvey.list, 'attachments', editSurvey.fileList)
    editSurvey.list.attachments = editSurvey.fileList
    if (editSurvey.editFileList.length == 0) {
      editSurveys()
    } else {
      const uploadPromises = editSurvey.editFileList.map((file, index) => {
        return submmitfile(editSurvey.fileList[index], file)
          .then((r) => {
            r.data.forEach((e) => (e['attachment_type'] = '1'))
            editSurvey.editList.attachments.push(r.data[0])
            editSurvey.list.attachments = editSurvey.editList.attachments
          })
          .catch(() => {
            proxy.$message({
              type: 'info',
              message: l.value.attachmentAddFailed,
            })
            throw new Error('附件上传失败')
          })
      })
      await Promise.all(uploadPromises)
      editSurveys()
    }
  } catch (e) {
    if (e.message !== '附件上传失败') {
      proxy.$message({
        type: 'info',
        message: l.value.operationCanceled,
      })
    }
  }
}

const editSurveys = () => {
  proxy
    .$request(api.baseUrl + '/Compliance/complianceSurvey/addSurvey', editSurvey.list, 'post')
    .then(() => {
      proxy.$message({
        type: 'success',
        message: l.value.modifySuccees,
      })
      getList()
      editFormVisible.value = false
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: l.value.modifyFailed,
      })
    })
}

const historyClick = (row, index) => {
  proxy.$router.push({
    path: '/compliance/InvestigationInfo',
    query: { manufacture_id: row.manufacturer_id },
  })
}

const auditClick = (row, index) => {
  auditSurvey.list = {}
  let auditClone = _.cloneDeep(row)
  auditFlag(auditClone, auditClone.rec_status)
}

const auditNew = (row, index) => {
  auditSurvey.list = {}
  let auditClone = _.cloneDeep(row)
  auditFlags(auditClone, 1)
}

const invalid = (row, index) => {
  auditSurvey.list = {}
  let auditClone = _.cloneDeep(row)
  auditFlags(auditClone, 1)
}

const auditClose = (row, index) => {
  auditSurvey.list = {}
  let auditClone = _.cloneDeep(row)
  auditFlags(auditClone, 99)
}

const auditFlag = (row, i) => {
  // proxy.$set(auditSurvey.list, 'survey_id', row.survey_id)
  auditSurvey.list.survey_id = row.survey_id
  auditFormVisible.value = true
}

const auditFlags = (row, i) => {
  auditSurvey.list.survey_id = row.survey_id
  auditSurvey.list.rec_status = i
  auditFormsVisible.value = true
}

const submitAudit = () => {
  if (!auditSurvey.list.rec_status && auditSurvey.list.rec_status == null) {
    proxy.$message({
      type: 'info',
      message: l.value.pleaseSelectAuditResult,
    })
  }
  proxy
    .$confirm(l.value.confirmAudit, l.value.title, {
      confirmButtonText: c.value.confirm,
      cancelButtonText: c.value.cancel,
      type: 'warning',
    })
    .then(() => {
      proxy
        .$request(api.baseUrl + '/Compliance/complianceSurvey/auditSurvey', auditSurvey.list, 'post')
        .then((r) => {
          proxy.$message({
            type: 'success',
            message: l.value.auditSuccess,
          })
          getList()
          auditSurvey.list = {}
          auditFormVisible.value = false
          auditFormsVisible.value = false
        })
        .catch(() => {
          proxy.$message({
            type: 'info',
            message: l.value.auditFailed,
          })
        })
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: l.value.cancelAudit,
      })
    })
}

const submmitfile = (fileList, addList) => {
  const formData = new FormData()
  formData.append('file', addList[0])
  formData.append('attachment_type', fileList.attachment_type)
  let r = proxy.$request(api.baseUrl + '/Compliance/complianceAttachments/uploadAttachment', formData, 'post')
  return r
}

const addsubmmitfile = (fileList, addList) => {
  const formData = new FormData()
  formData.append('file', addList[0])
  formData.append('attachment_type', fileList.attachment_type)
  proxy
    .$request(api.baseUrl + '/Compliance/complianceAttachments/uploadAttachment', formData, 'post')
    .then((r) => {
      addSurvey.addList.attachments.push(r.data[0])
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: l.value.attachmentAddFailed,
      })
    })
}

const removeEditFile = (row, index) => {
  let i = index + 1
  proxy
    .$confirm('此操作将删除第' + i + '条数据, 是否继续?', l.value.deleteHelpManual, {
      confirmButtonText: c.value.confirm,
      cancelButtonText: c.value.cancel,
      type: 'warning',
    })
    .then(() => {
      proxy
        .$request(
          api.baseUrl + '/Compliance/complianceAttachments/deleteAttchment',
          {
            key: row.id,
            value: deleteFalg.value,
          },
          'post'
        )
        .then((r) => {
          proxy.$message({
            type: 'success',
            message: l.value.deleteSuccess,
          })
        })
        .catch(() => {
          proxy.$message({
            type: 'error',
            message: l.value.deleteFailed,
          })
        })
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: l.value.cancelDelete,
      })
    })
}

const resetForm = () => {
  Object.keys(queryList).forEach((key) => {
    queryList[key] = ''
  })
  queryList.rec_status = null
}

const file = (fileList) => {
  return new Promise((resolve, reject) => {
    const fileInfos = []

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      const file_name = file.name
      const fileExtension = getFileExtension(file_name)
      const reader = new FileReader()

      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1]
        let now = new Date()
        const fileInfo = {
          file_name: file_name,
          file_suffix: fileExtension,
          attachment_type: 1,
          create_user: proxy.$store.getters.user.userId,
          create_time: new Date().toLocaleString(),
          modify_user: proxy.$store.getters.user.userId,
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
}

const getFileExtension = (file_name) => {
  return file_name.slice(Math.max(0, file_name.lastIndexOf('.')) || Infinity)
}

const truncateAddress = (address, maxLines = 3) => {
  if (!address) return ''
}

const checkviewFile = (id) => {
  let r = proxy.$request(api.baseUrl + '/Compliance/complianceAttachments/checkManufacturerAttachments', {
    id: id,
    file_type: 1,
  })
  return r
}

const clickViewFile = (row) => {
  viewFileFormVisible.value = true
  checkviewFile(row.survey_id)
    .then((r) => {
      const processedFiles = r.data.map((file) => {
        const { file_url: url, file_name: name, file_type: type } = file
        file_name.value = name
        file_url.value = url
        // file_type.value = type
        const fileExtension = getFileExtension(name)
        return {
          ...file,
          file_suffix: fileExtension,
          attachment_type: '1',
        }
      })
      checkFile.fileList = _.cloneDeep(processedFiles)
      pageLoading.value = false
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const viewFile = (id) => {
  pageLoading.value = true
  proxy
    .$request(api.baseUrl + '/Compliance/complianceAttachments/checkManufacturerAttachments', {
      id: id,
      file_type: 1,
    })
    .then((r) => {
      if (r.data.length == 0) {
        pageLoading.value = false
        return proxy.$message({
          type: 'info',
          message: l.value.noFile,
        })
      }
      const { file_url: url, file_name: name, file_type: type } = r.data[0]
      file_name.value = name
      file_url.value = url
      // file_type.value = type
      getFilePreview(url)

      pageLoading.value = false
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const getFilePreview = (url) => {
  const urls = api.baseUrl + '/' + url
  fileUrl.value = urls
  dialogVisible.value = true
}

const exportInfo = () => {
  // Use .value for computed props in script
  const mergedArrayUsingSpread = [...tableList.columns1, ...tableList.columns2, ...tableList.columns3, ...tableList.columns4]

  const name = 'investigation' + '_' + dayjs().format('YYYYMMDD')
  const tHeader = mergedArrayUsingSpread.map((item) => ({
    ...item,
    header: item.title || item.key,
    width: item.width || 20,
  }))
  const tData = tableList.list.map((item) => {
    Object.entries(item).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        item[key] = ''
      } else if (typeof value === 'object') {
        item[key] = JSON.stringify(value)
      } else if (typeof value === 'string') {
        item[key] = value
          .split(/<br \/>/g)
          .filter(Boolean)
          .join('\n')
      }
    })
    return item
  })

  console.log(tableList)

  exportExcel(name + '.xlsx', [
    {
      name: l.value.answerDetails,
      columns: tHeader,
      data: tData,
      callback: ({ worksheet }) => {
        const col = tHeader.length
        const row = tData.length

        worksheet.getRow(1).height = 45
        Array.from({ length: col }).forEach((_, index) => {
          worksheet.getRow(1).getCell(1 + index).border = {
            top: { style: 'thick', color: { argb: '000000' } },
            left: { style: index === 0 ? 'thick' : 'thin', color: { argb: '000000' } },
            bottom: { style: 'thin', color: { argb: '000000' } },
            right: { style: index === col - 1 ? 'thick' : 'thin', color: { argb: '000000' } },
          }
          worksheet.getRow(1).getCell(1 + index).alignment = {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: true,
          }
          worksheet.getRow(1).getCell(1 + index).fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFD080' },
          }
        })

        Array.from({ length: col }).forEach((_, indexColumn) => {
          Array.from({ length: row }).forEach((_, indexRow) => {
            worksheet.getRow(2 + indexRow).getCell(1 + indexColumn).border = {
              top: { style: 'thin', color: { argb: '000000' } },
              left: { style: indexColumn === 0 ? 'thick' : 'thin', color: { argb: '000000' } },
              bottom: { style: indexRow === row - 1 ? 'thick' : 'thin', color: { argb: '000000' } },
              right: { style: indexColumn === col - 1 ? 'thick' : 'thin', color: { argb: '000000' } },
            }

            if (indexRow % 2 !== 0) {
              worksheet.getRow(2 + indexRow).getCell(1 + indexColumn).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'F3F3F3' },
              }
            }
            worksheet.getRow(2 + indexRow).getCell(1 + indexColumn).numFmt = '@'
            worksheet.getRow(2 + indexRow).getCell(1 + indexColumn).alignment = {
              vertical: 'top',
              wrapText: true,
            }
          })
        })
      },
      views: [{ showGridLines: false }],
    },
    {
      name: 'GW-IMPORT-WAREHOUSE',
      columns: [],
      data: [],
      state: 'veryHidden',
    },
  ])
    .then(() => {})
    .catch((error) => {
      console.error(error)
    })
}

const recEmail = () => {
  recEmailVisible.value = true
  getRoleList()
  getRoleEmail()
}

const addRoleItem = (row, index) => {
  surveyEmail.rec_survey = '1'
  surveyEmail.role_id = row.role_id
  proxy
    .$confirm(l.value.confirmAddRole, l.value.title, {
      confirmButtonText: c.value.confirm,
      cancelButtonText: c.value.cancel,
      type: 'warning',
    })
    .then(() => {
      proxy
        .$request(api.baseUrl + '/Compliance/complianceSurvey/updateSurveyEmail', surveyEmail, 'post')
        .then((r) => {
          proxy.$message({
            type: 'success',
            message: l.value.addSuccess,
          })
          getRoleEmail()
        })
        .catch(() => {
          proxy.$message({
            type: 'info',
            message: l.value.addFailed,
          })
        })
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: l.value.cancelAdd,
      })
    })
}

const deleteRoleItem = (row, index) => {
  surveyEmail.rec_survey = '0'
  surveyEmail.role_id = row.role_id
  proxy
    .$confirm(l.value.confirmDeleteRole, l.value.title, {
      confirmButtonText: c.value.confirm,
      cancelButtonText: c.value.cancel,
      type: 'warning',
    })
    .then(() => {
      proxy
        .$request(api.baseUrl + '/Compliance/complianceSurvey/updateSurveyEmail', surveyEmail, 'post')
        .then((r) => {
          proxy.$message({
            type: 'success',
            message: l.value.deleteSuccess,
          })
          getRoleEmail()
        })
        .catch(() => {
          proxy.$message({
            type: 'info',
            message: l.value.deleteFailed,
          })
        })
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: l.value.cancelDelete,
      })
    })
}

const sendRoleEmail = () => {
  proxy
    .$confirm(l.value.confirmSendEmail, l.value.title, {
      confirmButtonText: c.value.confirm,
      cancelButtonText: c.value.cancel,
      type: 'warning',
    })
    .then(() => {
      proxy
        .$request(api.baseUrl + '/Compliance/complianceSurvey/roleEmail', { distanceTime: recEmailList.distanceTime }, 'post')
        .then((r) => {
          proxy.$message({
            type: 'success',
            message: l.value.addSuccess,
          })
        })
        .catch(() => {
          proxy.$message({
            type: 'info',
            message: l.value.addFailed,
          })
        })
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: l.value.cancelAdd,
      })
    })
}

const tableRowClassName = ({ row, rowIndex }) => {
  if (rowIndex % 2 == 0) {
    return rowStyles.success
  } else {
    return ''
  }
}

const getUserAuth = () => {
  proxy
    .$request(proxy.$api.checkMenuAuth, {
      resourcepath: proxy.$route.name,
    })
    .then((r) => {
      userAuth.value = r.data[0]
    })
}

onMounted(() => {
  getList()
  getUserAuth()
})

watch(
  userAuth,
  (newV) => {
    showAuth.m_add = newV.m_add == 'Y'
    showAuth.m_search = newV.m_search == 'Y'
    showAuth.m_del = newV.m_del == 'Y'
    showAuth.m_updata = newV.m_updata == 'Y'
    showAuth.m_import = newV.m_import == 'Y'
    showAuth.m_export = newV.m_export == 'Y'
    showAuth.m_upload = newV.m_upload == 'Y'
    showAuth.m_audit = newV.m_audit == 'Y'
    showAuth.m_print = newV.m_print == 'Y'
  },
  { deep: true }
)
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
