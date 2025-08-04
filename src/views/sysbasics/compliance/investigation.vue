<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div class="p-3 border-b border-solid border-gray-100 flex flex-col gap-[1px]">
      <div class="text-2xl font-bold text-black">{{ $l.dueDiligenceInvestigation }}</div>
      <div class="text-gray-500 text-sm">{{ $l.manage }}</div>
    </div>

    <!-- Search Section -->
    <div class="flex gap-3 flex-wrap justify-between p-3">
      <div class="flex gap-3 flex-wrap">
        <div class="relative h-9">
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
              <path d="m8 13 4-7 4 7" />
              <path d="M9.1 11h5.7" />
            </svg>
          </div>
          <input type="text" :placeholder="$l.manufactureName" v-model="queryList.manufacture_name" class="h-9 pr-3 pl-10 border border-gray-200 rounded-full focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
        </div>
        <div class="relative h-9">
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
          <input type="text" :placeholder="$l.address" v-model="queryList.address" class="h-9 pr-3 pl-10 border border-gray-200 rounded-full focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
        </div>
        <div class="relative h-9">
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <input type="text" :placeholder="$l.name" v-model="queryList.name" class="h-9 pr-3 pl-10 border border-gray-200 rounded-full focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
        </div>
      </div>

      <div class="flex gap-3">
        <button v-show="showAuth.m_search" @click="submitForm" class="h-9 rounded flex items-center bg-black text-white px-4 hover:bg-gray-800 transition-colors duration-150">
          {{ $c.queryButton }}
        </button>
        <button v-show="showAuth.m_search" @click="resetForm" class="h-9 rounded flex items-center bg-white text-black border border-solid border-gray-200 px-4 hover:bg-gray-100 hover:border-gray-400 transition-colors duration-150">
          {{ $l.reset }}
        </button>
      </div>
    </div>

    <!-- Action Bar -->
    <div class="flex items-center justify-between p-3 bg-white border-b border-gray-100">
      <div class="flex items-center gap-3">
        <button v-show="showAuth.m_add" @click="addForm" class="inline-flex items-center h-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full px-3 shadow-sm transition duration-200 ease-in-out transform gap-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {{ $l.cAdd }}
        </button>
      </div>

      <div class="flex items-center gap-3">
        <button v-show="showAuth.m_export" @click="exportInfo" class="inline-flex items-center h-8 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full px-3 shadow-sm transition duration-200 ease-in-out transform gap-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ $l.down }}
        </button>

        <button @click="recEmail" class="inline-flex items-center h-8 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full px-3 shadow-sm transition duration-200 ease-in-out transform gap-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {{ $l.emailNotification }}
        </button>
      </div>
    </div>
    <!-- 表格 -->
    <!-- <el-table :data="tableList.list" :row-style="tableRowClassName" border stripe style="width: 100%;border" highlight-current-row max-height="575">
          <el-table-column width="460" :label="$l.basicInformation" fixed="left">
            <el-table-column v-for="(item, index) in tableList.columns1" :key="index" :prop="item.key" :label="item.title || item.key" :width="item.width" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="item.key === 'address'" :title="scope.row[item.key]" class="truncate-lines" v-html="scope.row[item.key]"></span>
                <span v-else>
                  {{ scope.row[item.key] }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="$l.complianceContactInfor">
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
          <el-table-column :label="$l.latestSeaAudit">
            <el-table-column v-for="(item, index) in tableList.columns3" :key="index" :prop="item.key" :label="item.title" :width="item.width" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="item.formatter" v-html="item.formatter(scope.row[item.key])"></span>
                <span v-else>
                  {{ scope.row[item.key] }}
                </span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column :label="$l.annualSeaAudit">
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
          <el-table-column fixed="right" :label="$c.operation" width="270">
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
        </el-table> -->

    <!-- Table Section -->
    <div class="flex-1 px-3 overflow-y-auto">
      <investigation-table :data="tableList.list" :isLoading="false" @action="handleTableAction" @row-click="handleRowClick" :page="{ page: tableList.curPage, pageSize: tableList.pageSize }" :showAuth="showAuth" class="main-table" />
    </div>

    <!-- Pagination -->
    <div class="p-3">
      <z-pagination :pagination="pagination" :total="tableList.total" :page.sync="tableList.curPage" :limit.sync="tableList.pageSize" @change="getList" class="custom-pagination" />
    </div>

    <!-- Edit Dialog -->
    <CustomDialog :title="$l.modify" :visible.sync="editFormVisible" :clickOutside="false" width="90%" :maxWidth="'1080px'">
      <template #content>
        <div class="flex flex-col gap-6">
          <div class="text-xl font-black text-gray-900 dark:text-white">{{ $l.basicInformation }}</div>

          <el-form :model="editSurvey.list" ref="editForm" :label-width="formLabelWidth">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.basicArchives }}</label>
                <div class="flex gap-2">
                  <el-input v-model="editSurvey.list.name_en" :disabled="true" :placeholder="$l.pleaseSelectBaseArchive" class="rounded-md" />
                  <el-button type="primary" plain @click="editselectClick" class="rounded-md">{{ $l.selectBaseArchive }}</el-button>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.surveyYear }}</label>
                <el-input v-model="editSurvey.list.survey_year" class="rounded-md" />
              </div>
            </div>

            <div class="text-xl font-black text-gray-900 dark:text-white mt-6">{{ $l.latestSeaAudit }}</div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.auditTime }}</label>
                <el-date-picker v-model="editSurvey.list.audit_time" type="date" :placeholder="$l.pleaseSelectAnApprovalDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" class="rounded-md w-full" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.nameOfTheThirdPartyOrganization }}</label>
                <el-input v-model="editSurvey.list.near_third_party_org" :placeholder="$l.pleaseEnterThirdPartyOrganization" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.auditResult }}</label>
                <el-input v-model="editSurvey.list.audit_result" :placeholder="$l.pleaseEnterTheAuditResult" class="rounded-md" />
              </div>
            </div>

            <div class="text-xl font-black text-gray-900 dark:text-white mt-6">{{ $l.annualSeaAudit }}</div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.dueAuditDate }}</label>
                <el-date-picker v-model="editSurvey.list.due_audit_date" type="date" :placeholder="$l.pleaseSelectAnApprovalDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" class="rounded-md w-full" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.realAuditDate }}</label>
                <el-date-picker v-model="editSurvey.list.real_audit_date" type="date" :placeholder="$l.pleaseSelectAnApprovalDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" class="rounded-md w-full" />
              </div>
            </div>

            <div class="flex flex-col col-span-full gap-2 mt-6">
              <div class="text-xl font-black text-gray-900 dark:text-white">{{ $l.supportInfo }}</div>
              <input type="file" @change="editFile" ref="editfileinput" style="display: none" />
              <div>
                <el-button type="primary" @click="$refs.editfileinput.click()" class="rounded-md w-full">{{ $l.fileUpload }}</el-button>
              </div>
            </div>

            <div class="col-span-full mt-4" v-if="editSurvey.fileList.length > 0">
              <el-table :data="editSurvey.fileList" class="rounded-lg">
                <el-table-column v-for="(item, index) in editSurvey.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                <el-table-column fixed="right" :label="$c.operation" width="145">
                  <template slot-scope="scope">
                    <el-button @click="editDeleteFile(scope.row, scope.$index)" type="text" size="small" class="text-red-500">{{ $c.delete }}</el-button>
                    <el-button @click="removeEditFile(scope.row, scope.$index)" type="text" size="small" class="text-red-500">{{ $l.deleteFile }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form>
        </div>
      </template>

      <template slot="footer">
        <div class="flex gap-3 justify-end">
          <el-button @click="editFormVisible = false" class="rounded-md">{{ $c.cancel }}</el-button>
          <el-button type="primary" @click="submmitedit" class="rounded-md">{{ $c.confirm }}</el-button>
        </div>
      </template>
    </CustomDialog>

    <!-- 查看 -->
    <CustomDialog :title="$c.check" :clickOutside="false" width="100%" :lock-scroll="true" :visible.sync="checkFormVisible" custom-class="custom-dialog" :maxWidth="'1080px'">
      <template #content>
        <div class="flex flex-col gap-2">
          <div class="text-xl font-black text-gray-900 dark:text-white">{{ $l.basicInformation }}</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="font-light text-sm text-gray-700">{{ $l.basicArchives }}</label>
              <el-input v-model="checkSurvey.list.name_zh" :disabled="true" class="w-full"></el-input>
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-light text-sm text-gray-700">{{ $l.surveyYear }}</label>
              <el-input v-model="checkSurvey.list.survey_year" :disabled="true" class="w-full"></el-input>
            </div>
          </div>

          <div class="text-xl font-black text-gray-900 dark:text-white mt-2">{{ $l.latestSeaAudit }}</div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div class="flex flex-col gap-2">
              <label class="font-light text-sm text-gray-700">{{ $l.auditDate }}</label>
              <el-date-picker disabled v-model="checkSurvey.list.near_audit_time" type="date" value-format="yyyy-MM-dd" class="w-full" style="width: 100%"></el-date-picker>
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-light text-sm text-gray-700">{{ $l.nameOfTheThirdPartyOrganization }}</label>
              <el-input disabled v-model="checkSurvey.list.near_third_party_org" class="w-full"></el-input>
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-light text-sm text-gray-700">{{ $l.auditResult }}</label>
              <el-input disabled v-model="checkSurvey.list.near_audit_result" class="w-full"></el-input>
            </div>
          </div>

          <div class="text-xl font-black text-gray-900 dark:text-white mt-2">{{ $l.annualSeaAudit }}</div>

          <!-- <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div class="flex flex-col gap-2">
                  <label class="font-light text-sm text-gray-700">{{ $l.dueAuditDate }}</label>
                  <el-date-picker v-model="checkSurvey.list.due_audit_date" type="date" value-format="yyyy-MM-dd" :disabled="true" class="w-full" style="width: 100%"></el-date-picker>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-light text-sm text-gray-700">{{ $l.costPayProgress }}</label>
                  <el-slider v-model="checkSurvey.list.cost_pay_progress" :disabled="true" class="w-full"></el-slider>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-light text-sm text-gray-700">{{ $l.realAuditDate }}</label>
                  <el-date-picker v-model="checkSurvey.list.audit_time" type="date" value-format="yyyy-MM-dd" :disabled="true" class="w-full" style="width: 100%"></el-date-picker>
                </div>
              </div> -->

          <div class="grid grid-cols-1 gap-4 mt-2">
            <div class="flex flex-col gap-4">
              <label class="font-light text-sm text-gray-700">{{ $l.isSubmitCap }}</label>
              <div class="flex gap-2">
                <el-radio v-model="checkSurvey.list.is_submit_cap" label="Y" :disabled="true">{{ $l.yes }}</el-radio>
                <el-radio v-model="checkSurvey.list.is_submit_cap" label="N" :disabled="true">{{ $l.no }}</el-radio>
              </div>
            </div>
          </div>

          <div class="text-xl font-black text-gray-900 dark:text-white mt-2">{{ $l.auditFile }}</div>

          <div>
            <!-- 文件表格 -->
            <el-table :data="checkSurvey.fileList">
              <el-table-column v-for="(item, index) in checkSurvey.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
              <el-table-column fixed="right" :label="$c.operation" width="145">
                <template slot-scope="scope">
                  <el-button @click="getFilePreview(scope.row.file_url)" type="text" size="small">{{ $c.check }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </CustomDialog>

    <!-- 审核 -->
    <CustomDialog :title="$l.audit" :visible.sync="auditFormVisible" :clickOutside="false" width="40%" :maxWidth="'600px'">
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm text-gray-700 dark:text-gray-300">
              {{ $l.auditResult }}
              <span class="text-red-500">*</span>
            </label>
            <el-select v-model="auditSurvey.list.rec_status" :placeholder="$c.please_select" class="w-full">
              <el-option
                v-for="option in [
                  { value: 7, label: $l.pass },
                  { value: -1, label: $l.fail },
                ]"
                :key="option.value"
                :label="option.label"
                :value="option.value"></el-option>
            </el-select>
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm text-gray-700 dark:text-gray-300">{{ $l.auditRemarks }}</label>
            <el-input v-model="auditSurvey.list.audit_result" type="textarea" :rows="4" :placeholder="$c.please_input" class="w-full"></el-input>
          </div>
        </div>
      </template>

      <template slot="footer">
        <div class="flex gap-3 justify-end">
          <el-button @click="auditFormVisible = false" class="rounded-md">{{ $c.cancel }}</el-button>
          <el-button type="primary" @click="submitAudit" class="rounded-md">{{ $c.confirm }}</el-button>
        </div>
      </template>
    </CustomDialog>

    <CustomDialog :title="$l.audit" :visible.sync="auditFormsVisible" :clickOutside="false" width="40%" :maxWidth="'600px'">
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm text-gray-700 dark:text-gray-300">{{ $l.auditRemarks }}</label>
            <el-input v-model="auditSurvey.list.audit_result" type="textarea" :rows="4" :placeholder="$c.please_input" class="w-full"></el-input>
          </div>
        </div>
      </template>

      <template slot="footer">
        <div class="flex gap-3 justify-end">
          <el-button @click="auditFormsVisible = false" class="rounded-md">{{ $c.cancel }}</el-button>
          <el-button type="primary" @click="submitAudit" class="rounded-md">{{ $c.confirm }}</el-button>
        </div>
      </template>
    </CustomDialog>

    <!-- 新增 -->
    <CustomDialog :title="$l.cAdd" :visible.sync="addFormVisible" :clickOutside="false" width="90%" :maxWidth="'1080px'">
      <template #content>
        <div class="flex flex-col gap-6">
          <div class="text-xl font-black text-gray-900 dark:text-white">{{ $l.basicInformation }}</div>

          <el-form :model="addSurvey.addList" ref="addForm" :label-width="formLabelWidth">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">
                  {{ $l.basicArchives }}
                  <span class="text-red-500">*</span>
                </label>
                <div class="flex gap-2">
                  <el-input v-model="addSurvey.addList.name_en" :placeholder="$l.basicArchives" :disabled="true" class="rounded-md" />
                  <el-button type="primary" plain @click="addselectClick" class="rounded-md">{{ $l.selectBaseArchive }}</el-button>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">
                  {{ $l.surveyYear }}
                  <span class="text-red-500">*</span>
                </label>
                <el-date-picker v-model="addSurvey.addList.survey_year" type="year" :placeholder="$l.surveyYearPlaceholder" format="yyyy" value-format="yyyy" class="rounded-md w-full" style="width: 100%" />
              </div>
            </div>

            <div class="text-xl font-black text-gray-900 dark:text-white mt-6">{{ $l.latestSeaAudit }}</div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.auditDate }}</label>
                <el-date-picker v-model="addSurvey.addList.near_audit_time" type="date" :placeholder="$l.pleaseSelectAnApprovalDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="true" class="rounded-md w-full" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.nameOfTheThirdPartyOrganization }}</label>
                <el-input v-model="addSurvey.addList.near_third_party_org" :placeholder="$l.pleaseEnterThirdPartyOrganization" :disabled="true" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.auditResult }}</label>
                <el-input v-model="addSurvey.addList.near_audit_result" :placeholder="$l.pleaseEnterTheAuditResult" class="rounded-md" />
              </div>
            </div>

            <div class="flex flex-col col-span-full gap-2 mt-6">
              <div class="text-xl font-black text-gray-900 dark:text-white">{{ $l.supportInfo }}</div>
              <input type="file" @change="addFile" ref="addfileinput" style="display: none" />
              <div>
                <el-button type="primary" @click="$refs.addfileinput.click()" class="rounded-md w-full">{{ $l.fileUpload }}</el-button>
              </div>
            </div>

            <div class="col-span-full mt-4" v-if="addSurvey.fileList.length > 0">
              <el-table :data="addSurvey.fileList" class="rounded-lg">
                <el-table-column v-for="(item, index) in addSurvey.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                <el-table-column fixed="right" :label="$c.operation" width="145">
                  <template slot-scope="scope">
                    <el-button @click="removeAddClick(scope.row, scope.$index)" type="text" size="small" class="text-red-500">{{ $c.delete }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form>
        </div>
      </template>

      <template slot="footer">
        <div class="flex gap-3 justify-end">
          <el-button @click="addFormVisible = false" class="rounded-md">{{ $c.cancel }}</el-button>
          <el-button type="primary" @click="submmitadd" class="rounded-md">{{ $c.confirm }}</el-button>
        </div>
      </template>
    </CustomDialog>

    <!-- <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                <div class="flex flex-col gap-2">
                  <label class="font-light text-sm text-gray-700">
                    {{ $l.dueAuditDate }}
                    <span class="text-red-500">*</span>
                  </label>
                  <el-date-picker v-model="addSurvey.addList.due_audit_date" type="date" :placeholder="$l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd" class="w-full" style="width: 100%"></el-date-picker>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-light text-sm text-gray-700">{{ $l.costPayProgress }}</label>
                  <el-slider v-model="addSurvey.addList.cost_pay_progress" class="w-full"></el-slider>
                </div>
                <div class="flex flex-col gap-2">
                  <label class="font-light text-sm text-gray-700">{{ $l.realAuditDate }}</label>
                  <el-date-picker v-model="addSurvey.addList.audit_time" type="date" :placeholder="$l.pleaseSelectAnApprovalDate" value-format="yyyy-MM-dd" class="w-full" style="width: 100%"></el-date-picker>
                </div>
              </div> -->

    <!-- 新增 选择基础档案 -->
    <CustomDialog :formProps="formProps" :visible.sync="addselectFormVisible" :title="$l.selectTheBaseFile" :maxWidth="'800px'" :width="'100%'">
      <template #content>
        <div class="flex flex-col gap-2">
          <div class="flex gap-2 items-center">
            <el-input v-model="manufacture.queryString" :placeholder="$l.search"></el-input>
            <el-button type="primary" @click="getManufacturerList">{{ $l.search }}</el-button>
          </div>

          <el-table :data="manufacture.list" style="width: 100%; height: 700px" max-height="550">
            <el-table-column v-for="(item, index) in manufacture.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
            <el-table-column fixed="right" :label="$c.operation" width="100">
              <template slot-scope="scope">
                <el-button @click="addselectItem(scope.row)" type="text" size="small">{{ $l.choose }}</el-button>
              </template>
            </el-table-column>
          </el-table>

          <z-pagination :pagination="pagination" :total="manufacture.total" :page.sync="manufacture.curPage" :limit.sync="manufacture.pageSize" @change="getManufacturerList"></z-pagination>
        </div>
      </template>
    </CustomDialog>

    <!-- 修改 选择基础档案 -->
    <CustomDialog :formProps="formProps" :visible.sync="editselectFormVisible">
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex gap-2 items-center">
            <div class="flex-1">
              <el-input v-model="manufacture.queryString" :placeholder="$l.search" class="w-full"></el-input>
            </div>
            <el-button type="primary" @click="getManufacturerList">{{ $l.search }}</el-button>
          </div>
          
          <el-table :data="manufacture.list" style="width: 100%">
            <el-table-column v-for="(item, index) in manufacture.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
            <el-table-column fixed="right" :label="$c.operation" width="145">
              <template slot-scope="scope">
                <el-button @click="editselectItem(scope.row)" type="text" size="small">{{ $l.choose }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
    </CustomDialog>

    <CustomDialog width="80%" :visible.sync="recEmailVisible" :height="'100%'">
      <template #content>
        <div class="flex flex-col gap-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Roles Section -->
            <div class="flex flex-col gap-2">
              <label class="font-medium text-sm text-gray-700 dark:text-gray-300">{{ $l.roles }}</label>
              <el-table :data="roleList.list" style="width: 100%">
                <el-table-column v-for="(item, index) in roleList.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                <el-table-column fixed="right" :label="$c.operation" width="145">
                  <template slot-scope="scope">
                    <el-button @click="addRoleItem(scope.row)" type="text" size="small">{{ $l.addNotification }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- Email Notification Role Section -->
            <div class="flex flex-col gap-2">
              <label class="font-medium text-sm text-gray-700 dark:text-gray-300">{{ $l.emailNotificationRole }}</label>
              <el-table :data="recEmailList.list" style="width: 100%">
                <el-table-column v-for="(item, index) in recEmailList.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                <el-table-column fixed="right" :label="$c.operation" width="145">
                  <template slot-scope="scope">
                    <el-button @click="deleteRoleItem(scope.row)" type="text" size="small" style="color: red">{{ $l.cancellationNotice }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <!-- Send Email Section -->
          <div class="flex flex-col gap-4">
            <label class="font-medium text-lg text-gray-800 dark:text-gray-200">{{ $l.sendEmail }}</label>
            
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex flex-col gap-1">
                <label class="font-medium text-sm text-gray-700 dark:text-gray-300">{{ $l.approachingReviewDate }}</label>
                <el-date-picker v-model="recEmailList.distanceTime" type="date" :placeholder="$l.selectDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" class="w-full"></el-date-picker>
              </div>
              
              <div class="flex items-end">
                <el-button type="primary" @click="sendRoleEmail" class="w-full h-9">{{ $l.sendEmail }}</el-button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </CustomDialog>

    <!-- 查看附件 -->
    <CustomDialog width="50%" :title="$l.viewAttachment" :lock-scroll="true" :visible.sync="viewFileFormVisible" custom-class="custom-dialog">
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
    </CustomDialog>

    <!-- 查看历史 -->
    <CustomDialog :title="$l.history" :visible.sync="historyFormVisible" width="95%" :maxWidth="'1500px'" :height="'100%'">
      <template #content>
        <div class="flex flex-col gap-6 h-full">
          <!-- History Table -->
          <div class="flex-1 overflow-hidden">
            <investigation-history-table :data="historyList.list" :isLoading="historyList.loading" @action="handleHistoryAction" @view-attachments="handleViewHistoryAttachments" @row-click="handleHistoryRowClick" :page="{ page: historyList.curPage, pageSize: historyList.pageSize }" :showAuth="showAuth" class="main-table" />
          </div>
        </div>
      </template>

      <template slot="footer">
        <div class="p-3">
          <z-pagination :pagination="pagination" :total="historyList.total" :page.sync="historyList.curPage" :limit.sync="historyList.pageSize" @change="getHistoryListCurrent" class="custom-pagination" />
        </div>
      </template>
    </CustomDialog>

    <!-- 预览 -->
    <filePreviews v-if="fileUrl" :file-url="fileUrl" :visible="dialogVisible" @update:visible="dialogVisible = $event" />
  </div>
</template>
<script>
import { _, api, zTable, zPagination, initFuncs, zForm, dayjs } from '@/views/_common'
import axios from 'axios'
import { mapGetters } from 'vuex'
import filePreviews from '../../_common/filePreviews.vue'
import CustomDialog from '../../_common/CustomDialog.vue'
import exportExcel from '../../../utils/exportExcel'
import InvestigationTable from './investigation-table.vue'
import InvestigationHistoryTable from './investigation-history-table.vue'

export default {
  name: 'investigation',
  components: {
    zTable,
    zPagination,
    initFuncs,
    zForm,
    filePreviews,
    CustomDialog,
    InvestigationTable,
    InvestigationHistoryTable,
  },
  data() {
    return {
      name: 'investigation',
      api: api.role,
      pageLoading: false,
      formLabelWidth: '120px',
      addFormVisible: false,
      checkFormVisible: false,
      editFormVisible: false,
      auditFormVisible: false,
      auditFormsVisible: false,
      selectFormVisible: false,
      addselectFormVisible: false,
      editselectFormVisible: false,
      viewFileFormVisible: false,
      historyFormVisible: false,
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
      currentManufacturerId: null, // 当前查看历史的manufacture_id
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
        pageSize: 15,
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
            title: this.$l.surveyYear,
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

      // 查看历史
      historyList: {
        list: [],
        pageSize: 15,
        curPage: 1,
        total: 0,
        loading: false,
        columns: [
          {
            title: this.$l.surveyYear,
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
            key: 'requestor_facility_type',
            width: 130,
          },
          {
            title: this.$l.name,
            key: 'contact_name',
            width: 80,
          },
          {
            title: this.$l.contactPhone,
            key: 'contact_phone',
            width: 100,
          },
          {
            title: this.$l.contactEmail,
            key: 'contact_email',
            width: 190,
          },
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
            title: this.$l.recStatus,
            key: 'rec_status',
            width: 100,
          },
          {
            title: this.$l.auditFile,
            key: 'audit_file',
            width: 80,
          },
          {
            title: this.$l.isSubmitCap,
            key: 'is_submit_cap',
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
            width: 200,
          },
          // {
          //   title: this.$l.manufacturerName,
          //   key: 'name_zh',
          //   width: 100,
          // },
          {
            title: this.$l.manufacturerNameEn,
            key: 'name_en',
            width: 400,
          },

          // {
          //   title: this.$l.manufacturerAddress,
          //   key: 'address',
          //   width: 100,
          // },
          // {
          //   title: this.$l.namlegalPersoneEn,
          //   key: 'legal_person',
          //   width: 100,
          // },
          // {
          //   title: this.$l.contactName,
          //   key: 'contact_name',
          //   width: 100,
          // },

          // {
          //   title: this.$l.contactPhone,
          //   key: 'contact_phone',
          //   width: 100,
          // },

          // {
          //   title: this.$l.contactEmail,
          //   key: 'contact_email',
          //   width: 100,
          // },
          // {
          //   title: this.$l.contactJobTitle,
          //   key: 'contact_job_title',
          //   width: 100,
          // },
          // {
          //   title: this.$l.country,
          //   key: 'country',
          //   width: 100,
          // },
          // {
          //   title: this.$l.customsNumber,
          //   key: 'customs_number',
          //   width: 100,
          // },
          // {
          //   title: this.$l.requestorFacilityType,
          //   key: 'requestor_facility_type',
          //   width: 100,
          // },
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
    handleTableAction({ action, row }) {
      console.log(action)

      if (action === 'check') {
        this.checkClick(row, row._index !== undefined ? row._index : null)
      } else if (action === 'edit') {
        this.editClick(row, row._index !== undefined ? row._index : null)
      } else if (action === 'history') {
        if (row.audit_count === 0) {
          this.$message.error(this.$l.noHistoryData || 'No history data available')
          return
        }

        this.historyClick(row, row._index !== undefined ? row._index : null)
      } else if (action === 'auditNew') {
        this.auditNew(row, row._index !== undefined ? row._index : null)
      } else if (action === 'auditClick') {
        this.auditClick(row, row._index !== undefined ? row._index : null)
      } else if (action === 'invalid') {
        this.invalid(row, row._index !== undefined ? row._index : null)
      } else if (action === 'auditClose') {
        this.auditClose(row, row._index !== undefined ? row._index : null)
      }
    },

    handleRowClick(row) {
      // Handle row click if needed
      console.log('Row clicked:', row)
    },
    /* 查询 */

    getHistoryListCurrent() {
      this.getHistoryList()
    },

    // 尽职调查列表
    getList() {
      this.$request(api.baseUrl + '/Compliance/comPlianceSurvey/getList', {
        ...this.queryList,
        page: this.tableList.curPage,
        pageSize: this.tableList.pageSize,
      })
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
      console.log(row.manufacture_id)
      this.$request(api.baseUrl + '/Compliance/comPlianceSurvey/getList', {
        manufacture_id: row.manufacture_id,
      })
        .then((r) => {
          console.log('r.data.list', r.data.list)
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
      this.addSurvey.addList.name_en = row.name_en
      this.addSurvey.addList.third_party_org = row.third_party_org
      console.log('r.data.list', row)

      this.addselectFormVisible = false
    },

    // 新增 打开选择附件窗口，返回附件信息
    addFile(e) {
      let someFlag = this.addSurvey.addFileList.some((fileObj) => {
        let falg = fileObj[0].name === e.target.files[0].name
        return falg
      })
      if (someFlag) {
        return this.$message.error(this.$l.fileAlreadyExists)
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
            message: this.$l.addFailed,
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
          message: this.$l.pleaseSelectBaseArchive,
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
                message: this.$l.attachmentAddFailed,
              })
            })
        }
      }
      this.$confirm(this.$l.confirmAdd, this.$l.title, {
        confirmButtonText: this.$c.confirm,
        cancelButtonText: this.$c.cancel,
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
          message: this.$l.pleaseSelectBaseArchive,
        })
        return
      }

      // 显示确认对话框
      try {
        await this.$confirm(this.$l.confirmAdd, this.$l.title, {
          confirmButtonText: this.$c.confirm,
          cancelButtonText: this.$c.cancel,
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
                  message: this.$l.attachmentAddFailed,
                })
                throw new Error(this.$l.attachmentUploadError) // 确保有错误时不会继续执行
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
        if (error.message !== this.$l.attachmentUploadError) {
          this.$message({
            type: 'info',
            message: this.$l.operationCanceled,
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
            message: this.$l.addSuccess,
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
            message: this.$l.addFailed,
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
      console.log(row)
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
        await this.$confirm(this.$l.confirmEdit, this.$l.title, {
          confirmButtonText: this.$c.confirm,
          cancelButtonText: this.$c.cancel,
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
                  message: this.$l.attachmentAddFailed,
                })
                throw new Error(this.$l.attachmentUploadError) // 确保有错误时不会继续执行
              })
          })

          // 等待所有文件上传完成
          await Promise.all(uploadPromises)

          // 如果所有文件上传成功，则调用新增方法
          this.editSurveys()
        }
      } catch (e) {
        // 用户点击取消或上传过程中出错
        if (error.message !== this.$l.attachmentUploadError) {
          this.$message({
            type: 'info',
            message: this.$l.operationCanceled,
          })
        }
      }
    },
    // 新增/修改尽职调查
    editSurveys() {
      //console.log(this.editSurvey.list)
      // this.editSurvey.list.id = ''
      this.$request(api.baseUrl + '/Compliance/complianceSurvey/addSurvey', { ...this.editSurvey.list, third_party_org: this.editSurvey.list.near_third_party_org }, 'post')
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
      this.historyFormVisible = true
      this.historyList.curPage = 1
      this.getHistoryList(row.manufacturer_id)
    },

    // 获取历史列表
    getHistoryList(manufactureId = null) {
      // 如果没有传入manufactureId，使用当前存储的ID
      const id = manufactureId || this.currentManufacturerId

      console.log('Getting history list for manufacturer ID:', id)

      if (!id) return

      this.currentManufacturerId = id
      this.historyList.loading = true

      this.$request(api.baseUrl + '/Compliance/complianceSurvey/getManufacturerHisList', {
        manufacture_id: id,
        page: this.historyList.curPage,
        pageSize: this.historyList.pageSize,
      })
        .then((r) => {
          // 处理数据，添加附件数量信息
          const list = r.data || []
          list.forEach((item) => {
            // 如果API返回的数据中没有attachment_count，可以设置默认值或通过其他方式获取
            if (item.attachment_count === undefined) {
              item.attachment_count = 0 // 默认值，可以根据实际情况调整
            }
          })

          this.historyList.list = list
          this.historyList.total = r.total || 0
          this.historyList.loading = false
        })
        .catch(() => {
          this.historyList.loading = false
          this.$message.error(this.$l.dataLoadFailed)
        })
    },

    // 查看历史中的某一项详细信息
    checkHistoryItem(row) {
      this.checkClick(row)
    },

    // 处理历史表格的操作事件
    handleHistoryAction({ action, row }) {
      console.log('History action:', action, row)

      if (action === 'check') {
        this.checkHistoryItem(row)
      } else if (action === 'edit') {
        this.editClick(row, row._index !== undefined ? row._index : null)
      } else if (action === 'auditNew') {
        this.auditNew(row, row._index !== undefined ? row._index : null)
      } else if (action === 'auditClick') {
        this.auditClick(row, row._index !== undefined ? row._index : null)
      } else if (action === 'invalid') {
        this.invalid(row, row._index !== undefined ? row._index : null)
      } else if (action === 'auditClose') {
        this.auditClose(row, row._index !== undefined ? row._index : null)
      }
    },

    // 处理历史表格行点击事件
    handleHistoryRowClick(row) {
      // 可以在这里添加行点击逻辑，比如高亮选中行
      console.log('History row clicked:', row)
    },

    // 处理查看历史附件
    handleViewHistoryAttachments(row) {
      this.viewFile(row.survey_id)
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
          message: this.$l.pleaseSelectAuditResult,
        })
      }
      this.$confirm(this.$l.confirmAudit, this.$l.title, {
        confirmButtonText: this.$c.confirm,
        cancelButtonText: this.$c.cancel,
        type: 'warning',
      })
        .then(() => {
          this.$request(api.baseUrl + '/Compliance/complianceSurvey/auditSurvey', this.auditSurvey.list, 'post')
            .then((r) => {
              this.$message({
                type: 'success',
                message: this.$l.auditSuccess,
              })
              this.getHistoryList()
              this.auditSurvey.list = {}
              this.auditFormVisible = false
              this.auditFormsVisible = false
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: this.$l.auditFailed,
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$l.cancelAudit,
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
            message: this.$l.attachmentAddFailed,
          })
        })
    },
    // 删除附件
    removeEditFile(row, index) {
      let i = index + 1
      this.$confirm(this.$l.confirmDeleteFileData.replace('{index}', i), this.$l.deleteHelpManual, {
        confirmButtonText: this.$c.confirm,
        cancelButtonText: this.$c.cancel,
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
                message: this.$l.deleteSuccess,
              })
              // this.getList()
            })
            .catch(() => {
              this.$message({
                type: 'error',
                message: this.$l.deleteFailed,
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$l.cancelDelete,
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
              message: this.$l.noFile,
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

      const name = (this.name || 'export_data') + '_' + dayjs().format('YYYYMMDD')
      const tHeader = mergedArrayUsingSpread.map((item) => ({
        ...item,
        header: item.title || item.key,
        width: item.width || 20,
      }))
      const tData = this.tableList.list.map((item) => {
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

      console.log(this.tableList)

      exportExcel(name + '.xlsx', [
        {
          name: this.$l.answerDetails,
          columns: tHeader,
          data: tData,
          callback: ({ worksheet }) => {
            const col = tHeader.length
            const row = tData.length

            // Styling for header and rows (simplified for brevity)
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

            // style row
            Array.from({
              length: col,
            }).forEach((_, indexColumn) => {
              Array.from({
                length: row,
              }).forEach((_, indexRow) => {
                // border
                worksheet.getRow(2 + indexRow).getCell(1 + indexColumn).border = {
                  top: { style: 'thin', color: { argb: '000000' } },
                  left: {
                    style: indexColumn === 0 ? 'thick' : 'thin',
                    color: { argb: '000000' },
                  },
                  bottom: {
                    style: indexRow === row - 1 ? 'thick' : 'thin',
                    color: { argb: '000000' },
                  },
                  right: {
                    style: indexColumn === col - 1 ? 'thick' : 'thin',
                    color: { argb: '000000' },
                  },
                }

                // bg color
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

      // import('@/vendor/Export2Excel')
      //   .then((excel) => {
      //     const tHeader = mergedArrayUsingSpread.map((item) => {
      //       return item.title || item.key
      //     })

      //     const filterVal1 = mergedArrayUsingSpread.map((item) => {
      //       return item.key
      //     })

      //     const data1 = this.tableList.list.map((item) => filterVal1.map((key) => (item[key] || '').toString().replace(/<br \/>/g, '\n')))

      //     console.log(data1)

      //     excel.export_json_to_excel({
      //       header: tHeader,
      //       sheetname: this.$l.answerDetails,
      //       data: data1,
      //       filename: (this.name || 'export_data') + '_' + dayjs().format('YYYYMMDD'),
      //     })
      //     this.exportLoading = false
      //   })
      //   .catch((e) => {
      //     this.exportLoading = false
      //     this.$message.error(this.$l.dataProcessingFailed)

      //     throw e
      //   })
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
      this.$confirm(this.$l.confirmAddRole, this.$l.title, {
        confirmButtonText: this.$c.confirm,
        cancelButtonText: this.$c.cancel,
        type: 'warning',
      })
        .then(() => {
          this.$request(api.baseUrl + '/Compliance/complianceSurvey/updateSurveyEmail', this.surveyEmail, 'post')
            .then((r) => {
              this.$message({
                type: 'success',
                message: this.$l.addSuccess,
              })
              this.getRoleEmail()
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: this.$l.addFailed,
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$l.cancelAdd,
          })
        })
    },

    deleteRoleItem(row, index) {
      this.surveyEmail.rec_survey = '0'
      this.surveyEmail.role_id = row.role_id
      this.$confirm(this.$l.confirmDeleteRole, this.$l.title, {
        confirmButtonText: this.$c.confirm,
        cancelButtonText: this.$c.cancel,
        type: 'warning',
      })
        .then(() => {
          this.$request(api.baseUrl + '/Compliance/complianceSurvey/updateSurveyEmail', this.surveyEmail, 'post')
            .then((r) => {
              this.$message({
                type: 'success',
                message: this.$l.deleteSuccess,
              })
              this.getRoleEmail()
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: this.$l.deleteFailed,
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$l.cancelDelete,
          })
        })
    },

    sendRoleEmail() {
      this.$confirm(this.$l.confirmSendEmail, this.$l.title, {
        confirmButtonText: this.$c.confirm,
        cancelButtonText: this.$c.cancel,
        type: 'warning',
      })
        .then(() => {
          this.$request(api.baseUrl + '/Compliance/complianceSurvey/roleEmail', { distanceTime: this.recEmailList.distanceTime }, 'post')
            .then((r) => {
              this.$message({
                type: 'success',
                message: this.$l.addSuccess,
              })
            })
            .catch(() => {
              this.$message({
                type: 'info',
                message: this.$l.addFailed,
              })
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$l.cancelAdd,
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
        console.log(newV)
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
  line-clamp: 3;
  /* 限制为3行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
