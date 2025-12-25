<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div class="p-3 border-b border-solid border-gray-100 flex flex-col gap-[1px]">
      <div class="text-2xl font-bold text-black">{{ l.dueDiligenceInvestigation }}</div>
      <div class="text-gray-500 text-sm">{{ l.manage }}</div>
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
          <input type="text" :placeholder="l.manufactureName" v-model="queryList.manufacture_name" class="h-9 pr-3 pl-10 border border-gray-200 rounded-full focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
        </div>
        <div class="relative h-9">
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25s-7.5-4.108-7.5-11.25a7.5 7.5 0 1115 0z" />
            </svg>
          </div>
          <input type="text" :placeholder="l.address" v-model="queryList.address" class="h-9 pr-3 pl-10 border border-gray-200 rounded-full focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
        </div>
        <div class="relative h-9">
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <input type="text" :placeholder="l.name" v-model="queryList.name" class="h-9 pr-3 pl-10 border border-gray-200 rounded-full focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
        </div>
      </div>

      <div class="flex gap-3">
        <button v-show="showAuth.m_search" @click="submitForm" class="h-9 rounded flex items-center bg-black text-white px-4 hover:bg-gray-800 transition-colors duration-150">
          {{ c.queryButton }}
        </button>
        <button v-show="showAuth.m_search" @click="resetForm" class="h-9 rounded flex items-center bg-white text-black border border-solid border-gray-200 px-4 hover:bg-gray-100 hover:border-gray-400 transition-colors duration-150">
          {{ l.reset }}
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
          {{ l.cAdd }}
        </button>
      </div>

      <div class="flex items-center gap-3">
        <button v-show="showAuth.m_export" @click="exportInfo" class="inline-flex items-center h-8 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full px-3 shadow-sm transition duration-200 ease-in-out transform gap-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ l.down }}
        </button>

        <button @click="recEmail" class="inline-flex items-center h-8 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full px-3 shadow-sm transition duration-200 ease-in-out transform gap-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {{ l.emailNotification }}
        </button>
      </div>
    </div>

    <!-- Table Section -->
    <div class="flex-1 px-3 overflow-y-auto">
      <investigation-table :data="tableList.list" :isLoading="false" @action="handleTableAction" @row-click="handleRowClick" :page="{ page: tableList.curPage, pageSize: tableList.pageSize }" :showAuth="showAuth" class="main-table" />
    </div>

    <!-- Pagination -->
    <div class="p-3">
      <z-pagination :pagination="pagination" :total="tableList.total" :page.sync="tableList.curPage" :limit.sync="tableList.pageSize" @change="getList" class="custom-pagination" />
    </div>

    <!-- Edit Dialog -->
    <CustomDialog :title="l.modify" :visible.sync="editFormVisible" :clickOutside="false" width="90%" :maxWidth="'1080px'">
      <template #content>
        <div class="flex flex-col gap-6">
          <div class="text-xl font-black text-gray-900 dark:text-white">{{ l.basicInformation }}</div>

          <el-form :model="editSurvey.list" ref="editForm" :label-width="formLabelWidth">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.basicArchives }}</label>
                <div class="flex gap-2">
                  <el-input v-model="editSurvey.list.name_en" :disabled="true" :placeholder="l.pleaseSelectBaseArchive" class="rounded-md" />
                  <el-button type="primary" plain @click="editselectClick" class="rounded-md">{{ l.selectBaseArchive }}</el-button>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.surveyYear }}</label>
                <el-input v-model="editSurvey.list.survey_year" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.initialAssessment }}</label>
                <el-checkbox v-model="editSurvey.list.is_initial_assessment" true-label="Y" false-label="N">
                  {{ l.initialAssessmentCheckbox }}
                </el-checkbox>
              </div>
            </div>

            <div class="text-xl font-black text-gray-900 dark:text-white mt-6">{{ l.latestSeaAudit }}</div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.auditTime }}</label>
                <el-date-picker v-model="editSurvey.list.audit_time" type="date" :placeholder="l.pleaseSelectAnApprovalDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" class="rounded-md w-full" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.nameOfTheThirdPartyOrganization }}</label>
                <el-input v-model="editSurvey.list.near_third_party_org" :placeholder="l.pleaseEnterThirdPartyOrganization" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.auditResult }}</label>
                <el-input v-model="editSurvey.list.audit_result" :placeholder="l.pleaseEnterTheAuditResult" class="rounded-md" />
              </div>
            </div>

            <div class="text-xl font-black text-gray-900 dark:text-white mt-6">{{ l.annualSeaAudit }}</div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.dueAuditDate }}</label>
                <el-date-picker v-model="editSurvey.list.due_audit_date" type="date" :placeholder="l.pleaseSelectAnApprovalDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" class="rounded-md w-full" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.realAuditDate }}</label>
                <el-date-picker v-model="editSurvey.list.real_audit_date" type="date" :placeholder="l.pleaseSelectAnApprovalDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" class="rounded-md w-full" />
              </div>
            </div>

            <div class="flex flex-col col-span-full gap-2 mt-6">
              <div class="text-xl font-black text-gray-900 dark:text-white">{{ l.supportInfo }}</div>
              <input type="file" @change="editFile" ref="editfileinput" style="display: none" />
              <div>
                <el-button type="primary" @click="$refs.editfileinput.click()" class="rounded-md w-full">{{ l.fileUpload }}</el-button>
              </div>
            </div>

            <div class="col-span-full mt-4" v-if="editSurvey.fileList.length > 0">
              <el-table :data="editSurvey.fileList" class="rounded-lg">
                <el-table-column v-for="(item, index) in editSurvey.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                <el-table-column fixed="right" :label="c.operation" width="145">
                  <template slot-scope="scope">
                    <el-button @click="editDeleteFile(scope.row, scope.$index)" type="text" size="small" class="text-red-500">{{ c.delete }}</el-button>
                    <el-button @click="removeEditFile(scope.row, scope.$index)" type="text" size="small" class="text-red-500">{{ l.deleteFile }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form>
        </div>
      </template>

      <template slot="footer">
        <div class="flex gap-3 justify-end">
          <el-button @click="editFormVisible = false" class="rounded-md">{{ c.cancel }}</el-button>
          <el-button type="primary" @click="submmitedit" class="rounded-md">{{ c.confirm }}</el-button>
        </div>
      </template>
    </CustomDialog>

    <!-- 查看 -->
    <CustomDialog :title="c.check" :clickOutside="false" width="100%" :lock-scroll="true" :visible.sync="checkFormVisible" custom-class="custom-dialog" :maxWidth="'1080px'">
      <template #content>
        <div class="flex flex-col gap-2">
          <div class="text-xl font-black text-gray-900 dark:text-white">{{ l.basicInformation }}</div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="font-light text-sm text-gray-700">{{ l.basicArchives }}</label>
              <el-input v-model="checkSurvey.list.name_en" :disabled="true" class="w-full"></el-input>
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-light text-sm text-gray-700">{{ l.surveyYear }}</label>
              <el-input v-model="checkSurvey.list.survey_year" :disabled="true" class="w-full"></el-input>
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-light text-sm text-gray-700">{{ l.initialAssessment }}</label>
              <div class="flex items-center gap-2">
                <el-tag v-if="isInitialAssessment(checkSurvey.list.is_initial_assessment)" type="success" size="small" class="!text-xs !h-6 !leading-5 !px-2 !rounded !font-medium gap-1">
                  <i class="el-icon-check text-xs"></i>
                  <span>{{ l.initialAssessmentTag }}</span>
                </el-tag>
                <span v-else class="text-gray-400 text-sm">{{ l.notInitialAssessment }}</span>
              </div>
            </div>
          </div>

          <div class="text-xl font-black text-gray-900 dark:text-white mt-2">{{ l.latestSeaAudit }}</div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
            <div class="flex flex-col gap-2">
              <label class="font-light text-sm text-gray-700">{{ l.auditDate }}</label>
              <el-date-picker disabled v-model="checkSurvey.list.audit_time" type="date" value-format="yyyy-MM-dd" class="w-full" style="width: 100%"></el-date-picker>
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-light text-sm text-gray-700">{{ l.nameOfTheThirdPartyOrganization }}</label>
              <el-input disabled v-model="checkSurvey.list.near_third_party_org" class="w-full"></el-input>
            </div>
            <div class="flex flex-col gap-2">
              <label class="font-light text-sm text-gray-700">{{ l.auditResult }}</label>
              <el-input disabled v-model="checkSurvey.list.audit_result" class="w-full"></el-input>
            </div>
          </div>

          <div class="text-xl font-black text-gray-900 dark:text-white mt-2">{{ l.annualSeaAudit }}</div>

          <div class="grid grid-cols-1 gap-4 mt-2">
            <div class="flex flex-col gap-4">
              <label class="font-light text-sm text-gray-700">{{ l.isSubmitCap }}</label>
              <div class="flex gap-2">
                <el-radio v-model="checkSurvey.list.is_submit_cap" label="Y" :disabled="true">{{ l.yes }}</el-radio>
                <el-radio v-model="checkSurvey.list.is_submit_cap" label="N" :disabled="true">{{ l.no }}</el-radio>
              </div>
            </div>
          </div>

          <div class="flex justify-between">
            <div class="text-xl font-black text-gray-900 dark:text-white mt-2">{{ l.auditFile }}</div>

            <div>
              <el-button type="text" size="small" class="delete-action-button" v-if="checkSurvey.fileList.length > 0" @click="downloadAllFiles">{{ l.downloadAll || 'Tải xuống tất cả' }}</el-button>
            </div>
          </div>

          <div>
            <!-- 文件表格 -->
            <el-table :data="checkSurvey.fileList">
              <el-table-column v-for="(item, index) in checkSurvey.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
              <el-table-column fixed="right" :label="c.operation" width="145">
                <template slot-scope="scope">
                  <el-button @click="getFilePreview(scope.row.file_url)" type="text" size="small">{{ c.check }}</el-button>
                  <el-button @click="downloadFile(scope.row)" type="text" size="small">{{ l.download || 'Tải xuống' }}</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
    </CustomDialog>

    <!-- 审核 -->
    <CustomDialog :title="l.audit" :visible.sync="auditFormVisible" :clickOutside="false" width="40%" :maxWidth="'600px'">
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm text-gray-700 dark:text-gray-300">
              {{ l.auditResult }}
              <span class="text-red-500">*</span>
            </label>
            <el-select v-model="auditSurvey.list.rec_status" :placeholder="c.please_select" class="w-full">
              <el-option
                v-for="option in [
                  { value: 7, label: l.pass },
                  { value: -1, label: l.fail },
                ]"
                :key="option.value"
                :label="option.label"
                :value="option.value"></el-option>
            </el-select>
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm text-gray-700 dark:text-gray-300">{{ l.auditRemarks }}</label>
            <el-input v-model="auditSurvey.list.audit_result" type="textarea" :rows="4" :placeholder="c.please_input" class="w-full"></el-input>
          </div>
        </div>
      </template>

      <template slot="footer">
        <div class="flex gap-3 justify-end">
          <el-button @click="auditFormVisible = false" class="rounded-md">{{ c.cancel }}</el-button>
          <el-button type="primary" @click="submitAudit" class="rounded-md">{{ c.confirm }}</el-button>
        </div>
      </template>
    </CustomDialog>

    <CustomDialog :title="l.audit" :visible.sync="auditFormsVisible" :clickOutside="false" width="40%" :maxWidth="'600px'">
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm text-gray-700 dark:text-gray-300">{{ l.auditRemarks }}</label>
            <el-input v-model="auditSurvey.list.audit_result" type="textarea" :rows="4" :placeholder="c.please_input" class="w-full"></el-input>
          </div>
        </div>
      </template>

      <template slot="footer">
        <div class="flex gap-3 justify-end">
          <el-button @click="auditFormsVisible = false" class="rounded-md">{{ c.cancel }}</el-button>
          <el-button type="primary" @click="submitAudit" class="rounded-md">{{ c.confirm }}</el-button>
        </div>
      </template>
    </CustomDialog>

    <!-- Thêm -->
    <CustomDialog :title="l.cAdd" :visible.sync="addFormVisible" :clickOutside="false" width="90%" :maxWidth="'1080px'">
      <template #content>
        <div class="flex flex-col gap-6">
          <div class="text-xl font-black text-gray-900 dark:text-white">{{ l.basicInformation }}</div>

          <el-form :model="addSurvey.addList" ref="addForm" :label-width="formLabelWidth">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">
                  {{ l.basicArchives }}
                  <span class="text-red-500">*</span>
                </label>
                <div class="flex gap-2">
                  <el-input v-model="addSurvey.addList.name_en" :placeholder="l.basicArchives" :disabled="true" class="rounded-md" />
                  <el-button type="primary" plain @click="addselectClick" class="rounded-md">{{ l.selectBaseArchive }}</el-button>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">
                  {{ l.surveyYear }}
                  <span class="text-red-500">*</span>
                </label>
                <el-date-picker v-model="addSurvey.addList.survey_year" type="year" :placeholder="l.surveyYearPlaceholder" format="yyyy" value-format="yyyy" class="rounded-md w-full" style="width: 100%" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.initialAssessment }}</label>
                <el-checkbox v-model="addSurvey.addList.is_initial_assessment" true-label="Y" false-label="N">
                  {{ l.initialAssessmentCheckbox }}
                </el-checkbox>
              </div>
            </div>

            <div class="text-xl font-black text-gray-900 dark:text-white mt-6">{{ l.latestSeaAudit }}</div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.auditDate }}</label>
                <el-date-picker v-model="addSurvey.addList.near_audit_time" type="date" :placeholder="l.pleaseSelectAnApprovalDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :disabled="true" class="rounded-md w-full" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.nameOfTheThirdPartyOrganization }}</label>
                <el-input v-model="addSurvey.addList.near_third_party_org" :placeholder="l.pleaseEnterThirdPartyOrganization" :disabled="true" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.auditResult }}</label>
                <el-input v-model="addSurvey.addList.near_audit_result" :placeholder="l.pleaseEnterTheAuditResult" class="rounded-md" />
              </div>
            </div>

            <div class="flex flex-col col-span-full gap-2 mt-6">
              <div class="text-xl font-black text-gray-900 dark:text-white">{{ l.supportInfo }}</div>
              <input type="file" @change="addFile" ref="addfileinput" style="display: none" />
              <div>
                <el-button type="primary" @click="$refs.addfileinput.click()" class="rounded-md w-full">{{ l.fileUpload }}</el-button>
              </div>
            </div>

            <div class="col-span-full mt-4" v-if="addSurvey.fileList.length > 0">
              <el-table :data="addSurvey.fileList" class="rounded-lg">
                <el-table-column v-for="(item, index) in addSurvey.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                <el-table-column fixed="right" :label="c.operation" width="145">
                  <template slot-scope="scope">
                    <el-button @click="removeAddClick(scope.row, scope.$index)" type="text" size="small" class="text-red-500">{{ c.delete }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form>
        </div>
      </template>

      <template slot="footer">
        <div class="flex gap-3 justify-end">
          <el-button @click="addFormVisible = false" class="rounded-md">{{ c.cancel }}</el-button>
          <el-button type="primary" @click="submmitadd" class="rounded-md">{{ c.confirm }}</el-button>
        </div>
      </template>
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
    <CustomDialog :formProps="formProps" :visible.sync="editselectFormVisible">
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex gap-2 items-center">
            <div class="flex-1">
              <el-input v-model="manufacture.queryString" :placeholder="l.search" class="w-full"></el-input>
            </div>
            <el-button type="primary" @click="getManufacturerList">{{ l.search }}</el-button>
          </div>

          <el-table :data="manufacture.list" style="width: 100%">
            <el-table-column v-for="(item, index) in manufacture.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
            <el-table-column fixed="right" :label="c.operation" width="145">
              <template slot-scope="scope">
                <el-button @click="editselectItem(scope.row)" type="text" size="small">{{ l.choose }}</el-button>
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
              <label class="font-medium text-sm text-gray-700 dark:text-gray-300">{{ l.roles }}</label>
              <el-table :data="roleList.list" style="width: 100%">
                <el-table-column v-for="(item, index) in roleList.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                <el-table-column fixed="right" :label="c.operation" width="145">
                  <template slot-scope="scope">
                    <el-button @click="addRoleItem(scope.row)" type="text" size="small">{{ l.addNotification }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- Email Notification Role Section -->
            <div class="flex flex-col gap-2">
              <label class="font-medium text-sm text-gray-700 dark:text-gray-300">{{ l.emailNotificationRole }}</label>
              <el-table :data="recEmailList.list" style="width: 100%">
                <el-table-column v-for="(item, index) in recEmailList.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                <el-table-column fixed="right" :label="c.operation" width="145">
                  <template slot-scope="scope">
                    <el-button @click="deleteRoleItem(scope.row)" type="text" size="small" style="color: red">{{ l.cancellationNotice }}</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <!-- Send Email Section -->
          <div class="flex flex-col gap-4">
            <label class="font-medium text-lg text-gray-800 dark:text-gray-200">{{ l.sendEmail }}</label>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="flex flex-col gap-1">
                <label class="font-medium text-sm text-gray-700 dark:text-gray-300">{{ l.approachingReviewDate }}</label>
                <el-date-picker v-model="recEmailList.distanceTime" type="date" :placeholder="l.selectDate" format="yyyy-MM-dd" value-format="yyyy-MM-dd" class="w-full"></el-date-picker>
              </div>

              <div class="flex items-end">
                <el-button type="primary" @click="sendRoleEmail" class="w-full h-9">{{ l.sendEmail }}</el-button>
              </div>
            </div>
          </div>
        </div>
      </template>
    </CustomDialog>

    <!-- 查看附件 -->
    <CustomDialog width="50%" :title="l.viewAttachment" :lock-scroll="true" :visible.sync="viewFileFormVisible" custom-class="custom-dialog">
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
    </CustomDialog>

    <!-- 查看历史 -->
    <CustomDialog :title="l.history" :visible.sync="historyFormVisible" width="95%" :maxWidth="'1500px'" :height="'100%'">
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

    <!-- 编辑提醒/警告函号 -->
    <CustomDialog :title="l.edit_notices || 'Edit Notices'" :visible.sync="editNoticesVisible" :clickOutside="false" width="100%" :maxWidth="'500px'">
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm text-gray-700 dark:text-gray-300">{{ l.edit_notices_official_reminder }}</label>
            <el-input v-model="editNoticesForm.official_reminder_number" :placeholder="l.official_reminder_number" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-medium text-sm text-gray-700 dark:text-gray-300">{{ l.edit_notices_warning_letter }}</label>
            <el-input v-model="editNoticesForm.warning_letter_number" :placeholder="l.warning_letter_number" />
          </div>
        </div>
      </template>

      <template slot="footer">
        <div class="flex gap-3 justify-end">
          <el-button @click="editNoticesVisible = false" class="rounded-md">{{ c.cancel }}</el-button>
          <el-button type="primary" @click="submitEditNotices" class="rounded-md">{{ c.confirm }}</el-button>
        </div>
      </template>
    </CustomDialog>

    <!-- 预览 -->
    <filePreviews v-if="fileUrl" :file-url="fileUrl" :visible="dialogVisible" @update:visible="dialogVisible = $event" />
  </div>
</template>
<script setup>
import { reactive, ref, computed, onMounted, getCurrentInstance, watch } from 'vue'
import axios from 'axios'
import { getToken } from '@/utils/auth'
import { _, api, dayjs, initFuncs, zForm, zPagination, zTable } from '@/views/_common'
import exportExcel from '../../../utils/exportExcel'
import CustomDialog from '../../_common/CustomDialog.vue'
import filePreviews from '../../_common/FilePreviews.vue'
import InvestigationHistoryTable from './InvestigationHistoryTable.vue'
import InvestigationTable from './InvestigationTable.vue'
import { useLocalI18n } from '@/composables/useLocalI18n'
import { useStore } from 'vuex'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('investigation')
const store = useStore()

const pageLoading = ref(false)
const formLabelWidth = ref('120px')
const addFormVisible = ref(false)
const checkFormVisible = ref(false)
const editFormVisible = ref(false)
const auditFormVisible = ref(false)
const auditFormsVisible = ref(false)
const selectFormVisible = ref(false)
const addselectFormVisible = ref(false)
const editselectFormVisible = ref(false)
const viewFileFormVisible = ref(false)
const historyFormVisible = ref(false)
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
const editNoticesVisible = ref(false)
const editNoticesForm = reactive({
  manufacturer_id: '',
  official_reminder_number: '',
  warning_letter_number: '',
})
const editNoticesIndex = ref(null)
const deleteFalg = ref('N')
const currentManufacturerId = ref(null)
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
  pageSize: 15,
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

// Formatters
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

const historyList = reactive({
  list: [],
  pageSize: 15,
  curPage: 1,
  total: 0,
  loading: false,
  columns: computed(() => [
    {
      title: l.value.surveyYear,
      key: 'survey_year',
      width: 100,
    },
    {
      title: l.value.initialAssessment,
      key: 'is_initial_assessment',
      width: 130,
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
    {
      title: l.value.name,
      key: 'contact_name',
      width: 80,
    },
    {
      title: l.value.contactPhone,
      key: 'contact_phone',
      width: 100,
    },
    {
      title: l.value.contactEmail,
      key: 'contact_email',
      width: 190,
    },
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
      key: 'real_audit_date',
      width: 140,
    },
    {
      title: l.value.recStatus,
      key: 'rec_status',
      width: 100,
    },
    {
      title: l.value.auditFile,
      key: 'audit_file',
      width: 80,
    },
    {
      title: l.value.isSubmitCap,
      key: 'is_submit_cap',
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
    is_initial_assessment: 'N',
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
    is_initial_assessment: 'N',
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

// Add refs for file inputs
const addfileinput = ref(null)
const editfileinput = ref(null)

// Methods
const handleTableAction = ({ action, row }) => {
  console.log(action)

  if (action === 'check') {
    checkClick(row, row._index !== undefined ? row._index : null)
  } else if (action === 'edit') {
    editClick(row, row._index !== undefined ? row._index : null)
  } else if (action === 'history') {
    if (row.audit_count === 0) {
      proxy.$message.error(l.value.noHistoryData || 'No history data available')
      return
    }

    historyClick(row, row._index !== undefined ? row._index : null)
  } else if (action === 'edit_notices') {
    editNotices(row, row._index !== undefined ? row._index : null)
  } else if (action === 'auditNew') {
    auditNew(row, row._index !== undefined ? row._index : null)
  } else if (action === 'auditClick') {
    auditClick(row, row._index !== undefined ? row._index : null)
  } else if (action === 'invalid') {
    invalid(row, row._index !== undefined ? row._index : null)
  } else if (action === 'auditClose') {
    auditClose(row, row._index !== undefined ? row._index : null)
  }
}

const handleRowClick = (row) => {
  console.log('Row clicked:', row)
}

const extractYear = (value) => {
  if (!value) return ''
  const str = String(value)
  const match = str.match(/\d{4}/)
  return match ? match[0] : str
}

const normalizeInitialFlag = (value) => {
  return isInitialAssessment(value) ? 'Y' : 'N'
}

const isInitialAssessment = (value) => {
  if (value === null || value === undefined) {
    return false
  }
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase()
    return ['y', '1', 'true', 'ia'].includes(normalized)
  }
  if (typeof value === 'number') {
    return value === 1
  }
  return Boolean(value)
}

const getHistoryListCurrent = () => {
  getHistoryList()
}

const getList = () => {
  proxy
    .$request(api.baseUrl + '/Compliance/comPlianceSurvey/getList', {
      ...queryList,
      page: tableList.curPage,
      pageSize: tableList.pageSize,
    })
    .then((r) => {
      tableList.list = r.data.list
      tableList.total = r.data.total
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const getPercentTotal = () => {
  proxy
    .$request(api.baseUrl + '/Compliance/comPlianceSurvey/getPercentTotal')
    .then((r) => {
      console.log(r)
    })
    .catch(() => {})
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
  addSurvey.addList.is_initial_assessment = 'N'
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
  addSurvey.addList.is_initial_assessment = 'N'
  console.log('r.data.list', row)

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
  if (addfileinput.value) addfileinput.value.value = ''
  if (addSurvey.addList.attachments && addSurvey.addList.attachments.length > 0) {
    addSurvey.addList.attachments.splice(index, 1)
  }
}

const submmitadds = () => {
  if (!addSurvey.addList.manufacture_id && addSurvey.addList.manufacture_id == '') {
    proxy.$message({
      type: 'info',
      message: l.value.pleaseSelectBaseArchive,
    })
    return
  }
  if (addSurvey.addFileList.length > 0) {
    addSurvey.addList.attachments = []
    for (let i = 0; i < addSurvey.addFileList.length; i++) {
      submmitfile(addSurvey.fileList[i], addSurvey.addFileList[i])
        .then((r) => {
          r.data.forEach((e) => {
            // proxy.$set(e, 'attachment_type', '1')
            e.attachment_type = '1'
          })
          addSurvey.addList.attachments.push(r.data[0])
          if (addfileinput.value) addfileinput.value.value = ''
        })
        .catch(() => {
          proxy.$message({
            type: 'info',
            message: l.value.attachmentAddFailed,
          })
        })
    }
  }
  proxy
    .$confirm(l.value.confirmAdd, l.value.title, {
      confirmButtonText: c.value.confirm,
      cancelButtonText: c.value.cancel,
      type: 'warning',
    })
    .then(() => {
      addSurveys()
    })
    .catch(() => {})
}

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
            throw new Error(l.value.attachmentUploadError)
          })
      })

      await Promise.all(uploadPromises)
      addSurveys()
    } else {
      addSurveys()
    }
  } catch (error) {
    if (error.message !== l.value.attachmentUploadError) {
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

      if (cRow && cRow.data) {
        cRow.data.survey_year = extractYear(cRow.data.survey_year)
        cRow.data.is_initial_assessment = normalizeInitialFlag(cRow.data.is_initial_assessment)
      }

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
  console.log(row)
  let rowList = _.cloneDeep(row)
  rowList.id = row.survey_id
  rowList.manufacture_id = row.bindManufacturerid
  rowList.manufacture_record_id = row.manufacturer_permary_id
  if (Number(rowList.cost_pay_progress)) {
    rowList.cost_pay_progress = Number(rowList.cost_pay_progress)
  } else {
    rowList.cost_pay_progress = 0
  }
  rowList.survey_year = extractYear(rowList.survey_year)
  rowList.is_initial_assessment = normalizeInitialFlag(rowList.is_initial_assessment)
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
            throw new Error(l.value.attachmentUploadError)
          })
      })
      await Promise.all(uploadPromises)
      editSurveys()
    }
  } catch (e) {
    if (e.message !== l.value.attachmentUploadError) {
      proxy.$message({
        type: 'info',
        message: l.value.operationCanceled,
      })
    }
  }
}

const editSurveys = () => {
  proxy
    .$request(api.baseUrl + '/Compliance/complianceSurvey/addSurvey', { ...editSurvey.list, third_party_org: editSurvey.list.near_third_party_org }, 'post')
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
    .finally(() => {
      getHistoryListCurrent()
    })
}

const editNotices = (row, index) => {
  if (!row) return
  editNoticesForm.manufacturer_id = row.manufacturer_id || ''
  editNoticesForm.official_reminder_number = row.official_reminder_number || ''
  editNoticesForm.warning_letter_number = row.warning_letter_number || ''
  editNoticesIndex.value = index
  editNoticesVisible.value = true
}

const submitEditNotices = () => {
  const payload = {
    manufacture_id: editNoticesForm.manufacturer_id,
    official_reminder_number: editNoticesForm.official_reminder_number,
    warning_letter_number: editNoticesForm.warning_letter_number,
  }

  proxy
    .$confirm(l.value.confirmEdit, l.value.title, {
      confirmButtonText: c.value.confirm,
      cancelButtonText: c.value.cancel,
      type: 'warning',
    })
    .then(() => {
      proxy
        .$request(api.baseUrl + '/Compliance/complianceSurvey/editNotices', payload, 'post')
        .then(() => {
          proxy.$message({ type: 'success', message: l.value.modifySuccees })
          if (editNoticesIndex.value !== null && tableList.list[editNoticesIndex.value]) {
            // proxy.$set(tableList.list[editNoticesIndex.value], 'official_reminder_number', payload.official_reminder_number)
            // proxy.$set(tableList.list[editNoticesIndex.value], 'warning_letter_number', payload.warning_letter_number)
            tableList.list[editNoticesIndex.value].official_reminder_number = payload.official_reminder_number
            tableList.list[editNoticesIndex.value].warning_letter_number = payload.warning_letter_number
          } else {
            getList()
          }
          editNoticesVisible.value = false
        })
        .catch(() => {
          proxy.$message({ type: 'info', message: l.value.modifyFailed })
        })
    })
    .catch(() => {})
}

const historyClick = (row, index) => {
  console.log(row)
  historyFormVisible.value = true
  historyList.curPage = 1
  getHistoryList(row.manufacturer_id)
}

const getHistoryList = (manufactureId = null) => {
  const id = manufactureId || currentManufacturerId.value
  console.log('Getting history list for manufacturer ID:', id)

  if (!id) return

  currentManufacturerId.value = id
  historyList.loading = true

  proxy
    .$request(api.baseUrl + '/Compliance/complianceSurvey/getManufacturerHisList', {
      manufacture_id: id,
      page: historyList.curPage,
      pageSize: historyList.pageSize,
    })
    .then((r) => {
      const rawList = Array.isArray(r.data) ? r.data : []
      const list = rawList.map((item) => {
        const cloned = { ...item }
        if (cloned.attachment_count === undefined) {
          cloned.attachment_count = 0
        }
        cloned.survey_year = extractYear(cloned.survey_year)
        cloned.is_initial_assessment = normalizeInitialFlag(cloned.is_initial_assessment)
        return cloned
      })

      historyList.list = list
      historyList.total = r.total || 0
      historyList.loading = false
    })
    .catch(() => {
      historyList.loading = false
      proxy.$message.error(l.value.dataLoadFailed)
    })
}

const checkHistoryItem = (row) => {
  checkClick(row)
}

const checkClickHistory = (row) => {
  console.log(row)
  let rowList = _.cloneDeep(row)
  rowList.id = row.survey_id
  rowList.manufacture_id = row.bindManufacturerid
  rowList.manufacture_record_id = row.manufacturer_permary_id
  if (Number(rowList.cost_pay_progress)) {
    rowList.cost_pay_progress = Number(rowList.cost_pay_progress)
  } else {
    rowList.cost_pay_progress = 0
  }
  rowList.survey_year = extractYear(rowList.survey_year)
  rowList.is_initial_assessment = normalizeInitialFlag(rowList.is_initial_assessment)
  checkSurvey.list = rowList
  checkviewFile(row.survey_id)
    .then((r) => {
      checkFormVisible.value = true
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
      checkSurvey.fileList = _.cloneDeep(processedFiles)
      checkSurvey.editFileList = []
      checkSurvey.editList.attachments = _.cloneDeep(processedFiles)

      pageLoading.value = false
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const handleHistoryAction = ({ action, row }) => {
  console.log('History action:', action, row)

  if (action === 'check') {
    checkClickHistory(row)
  } else if (action === 'edit') {
    editClick(row, row._index !== undefined ? row._index : null)
  } else if (action === 'auditNew') {
    auditNew(row, row._index !== undefined ? row._index : null)
  } else if (action === 'auditClick') {
    auditClick(row, row._index !== undefined ? row._index : null)
  } else if (action === 'invalid') {
    invalid(row, row._index !== undefined ? row._index : null)
  } else if (action === 'auditClose') {
    auditClose(row, row._index !== undefined ? row._index : null)
  }
}

const handleHistoryRowClick = (row) => {
  console.log('History row clicked:', row)
}

const handleViewHistoryAttachments = (row) => {
  viewFile(row.survey_id)
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
          getHistoryList()
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
    .$confirm(l.value.confirmDeleteFileData.replace('{index}', i), l.value.deleteHelpManual, {
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

const downloadAllFiles = () => {
  if (!checkSurvey.list || !checkSurvey.list.id) {
    proxy.$message.error(l.value.pleaseSelectSurvey || 'Vui lòng chọn cuộc điều tra')
    return
  }

  const surveyId = checkSurvey.list.id
  const fileName = (checkSurvey.list.name_en || 'survey') + '_attachments.zip'
  const url = api.baseUrl + '/Compliance/complianceSurvey/downloadAttachments'

  axios({
    headers: {
      token: getToken(),
    },
    responseType: 'blob',
    method: 'get',
    url: url + '?survey_id=' + encodeURIComponent(surveyId),
  })
    .then((response) => {
      const blob = new Blob([response.data])
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(objectUrl)
      document.body.removeChild(a)
      proxy.$message.success(l.value.downloadStart || 'Bắt đầu tải xuống')
    })
    .catch((error) => {
      console.log(error)
      proxy.$message.error(l.value.downloadFailed || 'Tải xuống thất bại')
    })
}

const downloadFile = (data) => {
  if (!data) {
    proxy.$message.warning(c.value.no_data)
    return
  }

  if (!data.id) {
    const fallbackUrl = api.baseUrl + '/' + data.file_url
    const fallbackName = data.file_name || data.fileName || fallbackUrl.split('/').pop() || 'download'
    const link = document.createElement('a')
    link.href = fallbackUrl
    link.download = fallbackName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    return
  }

  const requestUrl = api.baseUrl + '/Compliance/complianceSurvey/downloadAttachment?attachmentId=' + encodeURIComponent(data.id)
  const fileName = data.file_name || 'attachment'

  axios({
    headers: {
      token: getToken(),
    },
    responseType: 'blob',
    method: 'get',
    url: requestUrl,
  })
    .then((response) => {
      const blob = new Blob([response.data])
      const objectUrl = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = objectUrl
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(objectUrl)
      document.body.removeChild(a)
      proxy.$message.success(c.value.success)
    })
    .catch((error) => {
      console.log(error)
      proxy.$message.error(c.value.fail)
    })
}

const exportInfo = () => {
  // Use .value for computed props in script
  const mergedArrayUsingSpread = [...tableList.columns1, ...tableList.columns2, ...tableList.columns3, ...tableList.columns4]

  const name = (name.value || 'export_data') + '_' + dayjs().format('YYYYMMDD')
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
  getPercentTotal()
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
  line-clamp: 3;
  /* 限制为3行 */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
