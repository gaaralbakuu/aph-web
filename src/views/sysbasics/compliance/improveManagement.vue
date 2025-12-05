<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div class="p-3 border-b border-solid border-gray-100 flex flex-col gap-[1px]">
      <div class="text-2xl font-bold text-black">{{ $l.thresholdIssueManagement }}</div>
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
          <input type="text" :placeholder="$l.manufactureName" v-model="formInline.manufacture_name" class="h-9 pr-3 pl-10 border border-gray-200 rounded-full focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
        </div>
        <!-- <div class="relative h-9">
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>
          <input type="text" :placeholder="$l.issueType" v-model="formInline.issue_type" class="h-9 pr-3 pl-10 border border-gray-200 rounded-full focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
        </div> -->
      </div>
      

      <div class="flex gap-3">
        <button v-show="showAuth.m_search" @click="getList" class="h-9 rounded flex items-center bg-black text-white px-4 hover:bg-gray-800 transition-colors duration-150">
          {{ $l.search }}
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
          {{ $l.create }}
        </button>
        <!--         
        <button v-show="showAuth.m_upload" @click="visabled.uploadFile = true" class="inline-flex items-center h-8 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-full px-3 shadow-sm transition duration-200 ease-in-out transform gap-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          {{ $l.bulkImport }}
        </button>

        <button @click="exportTemplate" class="inline-flex items-center h-8 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-full px-3 shadow-sm transition duration-200 ease-in-out transform gap-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ $c.downloadTemplate }}
        </button> -->
      </div>

      <div class="flex items-center gap-3">
        <!-- <button v-show="showAuth.m_export" @click="exportExcel" class="inline-flex items-center h-8 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full px-3 shadow-sm transition duration-200 ease-in-out transform gap-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ $l.download }}
        </button>
        
        <button @click="recEmail()" class="inline-flex items-center h-8 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-full px-3 shadow-sm transition duration-200 ease-in-out transform gap-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          {{ $l.emailNotification }}
        </button> -->
      </div>
    </div>

    <!-- Table Section -->
    <div class="flex-1 px-3 overflow-y-auto">
      <improve-management-table :data="tableData.list" :isLoading="tableData.loading" @action="handleTableAction" class="main-table" :page="query" />
    </div>

    <!-- Pagination -->
    <div class="p-3">
      <z-pagination :pagination="pagination" :total="tableData.total" :page.sync="query.page" :limit.sync="query.pageSize" @change="getList" class="custom-pagination" />
    </div>

    <!-- Create/Edit Dialog -->
    <CustomDialog :title="$l.create" :visible.sync="addFormVisible" :clickOutside="false" width="90%" :maxWidth="'1080px'">
      <template #content>
        <div class="flex flex-col gap-6">
          <div class="text-xl font-black text-gray-900 dark:text-white">{{ $l.basicInformation }}</div>

          <el-form :model="form" ref="form" :rules="rules" :label-width="formLabelWidth">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-show="false" class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.manufacture }}</label>
                <el-input v-model="form.manufacture_id" :disabled="true"></el-input>
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.manufactureName }}</label>
                <div class="flex gap-2">
                  <el-input v-model="form.name_en" :disabled="true" :placeholder="$l.selectManufacture" class="rounded-md" />
                  <el-button type="primary" plain @click="showManufacture" class="rounded-md">{{ $l.selectManufacture }}</el-button>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.issueType }}</label>
                <el-input v-model="form.issue_type" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.subheader }}</label>
                <el-input v-model="form.subheader" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.code_provision }}</label>
                <el-input v-model="form.code_provision" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.audit_explanation }}</label>
                <el-input type="textarea" v-model="form.audit_explanation" :autosize="{ minRows: 4 }" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.corrective_action_plan }}</label>
                <el-input type="textarea" v-model="form.corrective_action_plan" :autosize="{ minRows: 4 }" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.corrective_date }}</label>
                <el-date-picker v-model="form.corrective_date" type="date" :placeholder="$l.corrective_date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" class="rounded-md w-full" style="width: 100%" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.pic }}</label>
                <el-input v-model="form.corrective_principal" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.surveyYear }}</label>
                <el-date-picker v-model="form.survey_year" type="year" :placeholder="$c.surveyYearPlaceholder" format="yyyy" value-format="yyyy" class="rounded-md w-full" style="width: 100%" />
              </div>

              <!-- <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.status }}</label>
                <el-select v-model="form.status" :placeholder="$l.pleaseSelect" class="rounded-md w-full">
                  <el-option :label="$l.on_track" value="on_track"></el-option>
                  <el-option :label="$l.off_track" value="off_track"></el-option>
                  <el-option :label="$l.closed" value="closed"></el-option>
                </el-select>
              </div> -->

              <div class="flex flex-col col-span-full gap-2">
                <div class="text-xl font-black text-gray-900 dark:text-white">{{ $l.supportInfo }}</div>
                <input type="file" @change="addFile" ref="addfileinput" style="display: none" />
                <div>
                  <el-button type="primary" @click="$refs.addfileinput.click()" class="rounded-md w-full">{{ $l.fileUpload }}</el-button>
                </div>
              </div>

              <div class="col-span-full" v-if="form.fileList.length > 0">
                <div class="">
                  <el-table :data="form.fileList" class="rounded-lg">
                    <el-table-column v-for="(item, index) in form.columns" :key="index" :prop="item.key" :label="item.title" :width="item.width"></el-table-column>
                    <el-table-column fixed="right" :label="$c.operation" width="145">
                      <template slot-scope="scope">
                        <el-button @click="removeAddClick(scope.row, scope.$index)" type="text" size="small" class="text-red-500">{{ $c.delete }}</el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </el-form>
        </div>
      </template>

      <template slot="footer">
        <div class="flex gap-3 justify-end">
          <el-button @click="addCancel('form')" :disabled="isSubmitting" class="rounded-md">{{ $l.cancel }}</el-button>
          <el-button type="primary" @click="submit('form')" :loading="isSubmitting" class="rounded-md">{{ $l.submit }}</el-button>
        </div>
      </template>
    </CustomDialog>

    <CustomDialog :title="$l.check" :visible.sync="dialogFormVisible" width="90%" :height="'100%'">
      <template #content>
        <div class="flex flex-col h-full overflow-hidden gap-2">
          <div class="grid grid-cols-2 gap-3">
            <div class="flex gap-2 items-center">
              <label class="font-light text-sm text-gray-700 mr-2">
                {{ $l.factory_name }}
              </label>
              <div class="flex-1">
                <el-input v-model="clickRow.name_en" :placeholder="$l.basicArchives" class="w-full" style="width: 100%" disabled></el-input>
              </div>
            </div>
            <div class="flex gap-2 items-center">
              <label class="font-light text-sm text-gray-700 mr-2">
                {{ $l.vendor_code }}
              </label>
              <div class="flex-1">
                <el-input v-model="clickRow.vendor_code" :placeholder="$l.basicArchives" class="w-full" style="width: 100%" disabled></el-input>
              </div>
            </div>
          </div>
          <!-- <el-form inline :model="getDetailsQuery">
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
          </el-form> -->

          <improve-management-details-table :data="detailtable.list" :isLoading="detailtable.isLoading" @action="handleDetailsTableAction" class="main-table" :page="getDetailsQuery" />
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
        </div>
      </template>
      <template slot="footer">
        <z-pagination :pagination="pagination" :total="detailtable.total" :page.sync="getDetailsQuery.page" :limit.sync="getDetailsQuery.pageSize" @change="showHisList(is_his)"></z-pagination>
      </template>
    </CustomDialog>

    <CustomDialog :title="$l.selectManufacture" :visible.sync="dialogSelectManufacture" :height="'100%'">
      <template #content>
        <div class="flex flex-col overflow-hidden h-full gap-3">
          <!-- Search Section -->
          <!-- <div class="flex gap-2">
            <div class="relative flex-1">
              <div class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
                  <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
                  <path d="m8 13 4-7 4 7" />
                  <path d="M9.1 11h5.7" />
                </svg>
              </div>
              <input type="text" :placeholder="$l.manufactureName" v-model="manufacture.query.manufacture_name" class="h-9 pr-3 pl-10 w-full border border-gray-200 rounded-full focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
            </div>
            <button @click="getManufactureList" class="h-9 rounded flex items-center bg-black text-white px-4 hover:bg-gray-800 transition-colors duration-150">
              {{ $l.search }}
            </button>
          </div> -->

          <!-- Table Section -->
          <div class="flex-1 overflow-auto border border-gray-200 rounded">
            <div v-if="manufacture.loading" class="flex items-center justify-center h-32">
              <div class="text-gray-500">{{ $l.loading || 'Loading...' }}</div>
            </div>
            <div v-else-if="manufacture.tableData.length === 0" class="flex items-center justify-center h-32">
              <div class="text-gray-500">{{ $l.noData || 'No data available' }}</div>
            </div>
            <table v-else class="w-full border-collapse">
              <thead class="bg-gray-50 sticky top-0">
                <tr>
                  <th v-for="(item, index) in manufacture.column" :key="index" class="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                    {{ item.label }}
                  </th>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-900 border-b border-gray-200">{{ $c.operation || 'Action' }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="(row, rowIndex) in manufacture.tableData" :key="rowIndex" class="hover:bg-gray-50 transition-colors">
                  <td v-for="(item, colIndex) in manufacture.column" :key="colIndex" class="px-4 py-3 text-sm text-gray-900 border-b border-gray-100">
                    {{ row[item.key] }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right border-b border-gray-100">
                    <button @click="selectManufacture(rowIndex, row)" class="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors duration-150">
                      {{ $c.select || 'Select' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination for manufacturer list -->
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-500">{{ $l.total }}: {{ manufacture.total }}</div>
            <z-pagination :pagination="pagination" :total="manufacture.total" :page.sync="manufacture.query.page" :limit.sync="manufacture.query.pageSize" @change="getManufactureList" />
          </div>
        </div>
      </template>
    </CustomDialog>

    <CustomDialog :title="$l.result" :visible.sync="passFormVisible" width="100%" :maxWidth="'600px'" class="modern-dialog">
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-light text-sm text-black">{{ $l.verification_status }}</label>
            <el-select v-model="check.verification_status" :placeholder="$l.pleaseSelect" class="rounded-md w-full">
              <el-option :label="$l.on_track" value="on_track"></el-option>
              <el-option :label="$l.off_track" value="off_track"></el-option>
              <el-option :label="$l.closed" value="closed"></el-option>
            </el-select>
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-light text-sm text-black">{{ $l.reviewed_by }}</label>
            <el-input v-model="check.reviewed_by" :placeholder="$l.input_reviewed_by" class="rounded-md" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-light text-sm text-black">{{ $l.verification_date }}</label>
            <el-date-picker v-model="check.verification_date" type="date" :placeholder="$l.verification_date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" class="rounded-md w-full" style="width: 100%" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-light text-sm text-black">{{ $l.comments }}</label>
            <el-input type="textarea" v-model="check.comments" :placeholder="$l.input_comments" :autosize="{ minRows: 4 }" class="rounded-md" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-light text-sm text-black">{{ $l.follow_up_action_required }}</label>
            <el-radio-group v-model="check.follow_up_required">
              <el-radio label="N">{{ $l.no }}</el-radio>
              <el-radio label="Y">{{ $l.yes_include_in_next_internal_audit }}</el-radio>
            </el-radio-group>
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="flex gap-3 justify-end">
          <el-button @click="passFormVisible = false" class="rounded-md">{{ $l.cancel }}</el-button>
          <el-button type="primary" @click="passsubmit" class="rounded-md">{{ $l.submit }}</el-button>
        </div>
      </template>
    </CustomDialog>

    <CustomDialog :title="$l.editInformation" :visible.sync="editVisible" :clickOutside="false" width="90%" :maxWidth="'1080px'">
      <template #content>
        <div class="flex flex-col gap-6">
          <div class="text-xl font-black text-gray-900 dark:text-white">{{ $l.basicInformation }}</div>

          <el-form :model="editForm" ref="editForm" :rules="editRules" :label-width="formLabelWidth">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.issueType }}</label>
                <el-select v-model="editForm.issue_type" :placeholder="$l.inputIssue" class="rounded-md w-full">
                  <el-option v-for="item in issueType" :key="item.name_zh" :label="item.name_label" :value="item.name_zh"></el-option>
                </el-select>
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.subheader }}</label>
                <el-input v-model="editForm.subheader" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2 col-span-full">
                <label class="font-light text-sm text-black">{{ $l.code_provision }}</label>
                <el-input v-model="editForm.code_provision" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.audit_explanation }}</label>
                <el-input type="textarea" v-model="editForm.audit_explanation" :placeholder="$l.inputAuditExplanation" :autosize="{ minRows: 4 }" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.corrective_action_plan }}</label>
                <el-input type="textarea" v-model="editForm.corrective_action_plan" :placeholder="$l.inputCorrectiveActionPlan" :autosize="{ minRows: 4 }" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.corrective_date }}</label>
                <el-date-picker v-model="editForm.corrective_date" type="date" :placeholder="$l.corrective_date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" class="rounded-md w-full" style="width: 100%" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.pic }}</label>
                <el-input v-model="editForm.corrective_principal" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $c.surveyYear }}</label>
                <el-date-picker v-model="editForm.survey_year" type="year" :placeholder="$c.surveyYearPlaceholder" format="yyyy" value-format="yyyy" class="rounded-md w-full" style="width: 100%" />
              </div>
              <!-- 
              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ $l.status }}</label>
                <el-select v-model="editForm.status" :placeholder="$l.pleaseSelect" class="rounded-md w-full">
                  <el-option :label="$l.on_track" value="on_track"></el-option>
                  <el-option :label="$l.off_track" value="off_track"></el-option>
                  <el-option :label="$l.closed" value="closed"></el-option>
                </el-select>
              </div> -->
            </div>
          </el-form>
        </div>
      </template>

      <template slot="footer">
        <div class="flex gap-3 justify-end">
          <el-button @click="editVisible = false" :disabled="isEditSubmitting" class="rounded-md">{{ $l.cancel }}</el-button>
          <el-button type="primary" @click="submitEdit" :loading="isEditSubmitting" class="rounded-md">{{ $l.submit }}</el-button>
        </div>
      </template>
    </CustomDialog>

    <!-- Rectification Dialog -->
    <CustomDialog :title="$l.rectificationInfo" :visible.sync="rectificationVisible" width="90%" :maxWidth="'1200px'">
      <template #content>
        <div class="flex flex-col gap-6 max-h-[70vh] overflow-y-auto">
          <!-- 问题信息 -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">{{ $l.issueInformation }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $l.issueType }}</label>
                <p class="text-sm text-gray-900">{{ rectificationData.issue_type }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $l.subheader }}</label>
                <p class="text-sm text-gray-900">{{ rectificationData.subheader }}</p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $l.codeProvision }}</label>
                <p class="text-sm text-gray-900">{{ rectificationData.code_provision }}</p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $l.auditExplanation }}</label>
                <p class="text-sm text-gray-900">{{ rectificationData.audit_explanation }}</p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ $l.correctiveActionPlan }}</label>
                <p class="text-sm text-gray-900">{{ rectificationData.corrective_action_plan }}</p>
              </div>
            </div>
          </div>

          <!-- 整改信息 -->
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-blue-800">{{ $l.rectificationInformation }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-blue-700 mb-1">{{ $l.correctivePlan }}</label>
                <div class="bg-white p-3 rounded border">
                  <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ rectificationData.corrective_plan }}</p>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-blue-700 mb-1">{{ $l.correctivePrincipal }}</label>
                <p class="text-sm text-gray-900">{{ rectificationData.corrective_principal }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-blue-700 mb-1">{{ $l.correctiveDate }}</label>
                <p class="text-sm text-gray-900">{{ rectificationData.corrective_date ? new Date(rectificationData.corrective_date).toLocaleDateString() : '' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-blue-700 mb-1">{{ $l.status }}</label>
                <el-tag :type="getStatusType(rectificationData.status)">{{ getStatusText(rectificationData.status) }}</el-tag>
              </div>
              <div>
                <label class="block text-sm font-medium text-blue-700 mb-1">{{ $l.isFinish }}</label>
                <el-tag :type="rectificationData.is_finish === 'Y' ? 'success' : 'warning'">
                  {{ rectificationData.is_finish === 'Y' ? $l.finish : $l.unfinished }}
                </el-tag>
              </div>
            </div>
          </div>

          <!-- 附件信息 -->
          <div class="bg-green-50 p-4 rounded-lg" v-if="rectificationData.attachments && rectificationData.attachments.length > 0">
            <h3 class="text-lg font-semibold mb-4 text-green-800">{{ $l.attachments }}</h3>
            <div class="space-y-2">
              <div v-for="(attachment, index) in rectificationData.attachments" :key="index" class="flex items-center justify-between bg-white p-3 rounded border hover:bg-gray-50">
                <div class="flex items-center space-x-3">
                  <i class="fa fa-file-o text-gray-500"></i>
                  <div>
                    <p class="text-sm font-medium text-gray-900">{{ attachment.file_name }}</p>
                    <p class="text-xs text-gray-500">
                      {{ attachment.file_type }} • {{ formatFileSize(attachment.file_size) }} •
                      {{ attachment.create_time ? new Date(attachment.create_time).toLocaleDateString() : '' }}
                    </p>
                  </div>
                </div>
                <el-button size="mini" type="primary" @click="previewFile(attachment)" class="rounded">
                  {{ $l.preview }}
                </el-button>
              </div>
            </div>
          </div>

          <!-- 验证信息 -->
          <div class="bg-yellow-50 p-4 rounded-lg" v-if="rectificationData.verification_date || rectificationData.comments">
            <h3 class="text-lg font-semibold mb-4 text-yellow-800">{{ $l.verificationInformation }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-if="rectificationData.verification_date">
                <label class="block text-sm font-medium text-yellow-700 mb-1">{{ $l.verificationDate }}</label>
                <p class="text-sm text-gray-900">{{ new Date(rectificationData.verification_date).toLocaleDateString() }}</p>
              </div>
              <div v-if="rectificationData.comments" class="md:col-span-2">
                <label class="block text-sm font-medium text-yellow-700 mb-1">{{ $l.comments }}</label>
                <div class="bg-white p-3 rounded border">
                  <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ rectificationData.comments }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="flex gap-3 justify-end">
          <el-button @click="rectificationVisible = false" class="rounded-md">{{ $l.close }}</el-button>
        </div>
      </template>
    </CustomDialog>

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

    <FilePreviews v-if="file.fileUrl" :file-url="file.fileUrl" :visible="fileDialogVisible" @update:visible="fileDialogVisible = $event" />
  </div>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'

import { getToken } from '@/utils/auth'
// import { checkField } from '../../utils/checkFiled'
import { checkField } from '@/utils/checkFiled'
import { _, api, zPagination } from '@/views/_common'

import CustomDialog from '../../_common/CustomDialog.vue'
import FilePreviews from '../../_common/FilePreviews.vue'
import ImproveManagementDetailsTable from './ImproveManagementDetailsTable.vue'
import ImproveManagementTable from './ImproveManagementTable.vue'

export default {
  name: 'improveManagement',
  components: {
    FilePreviews,
    zPagination,
    CustomDialog,
    ImproveManagementTable,
    ImproveManagementDetailsTable,
  },
  data() {
    return {
      api: api.role,
      fileTableVisable: false,
      fileDialogVisible: false,
      recEmailVisible: false,
      issueType: [],
      userAuth: [], //保存用户权限
      isSubmitting: false, // Trạng thái loading cho button submit dialog thêm mới
      isEditSubmitting: false, // Trạng thái loading cho button submit dialog chỉnh sửa
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
        verification_status: '',
        reviewed_by: '',
        verification_date: '',
        comments: '',
        follow_up_required: 'N',
        rec_status: '',
      },
      clickRow: [],
      labelPosition: 'right',
      passFormVisible: false,
      detailtable: {
        list: [],
        total: 0,
        isLoading: false,
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
        pageSize: 10,
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
        column: [],
        tableData: [],
        total: 0,
        loading: false,
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
      rectificationVisible: false,
      rectificationData: {},
      formLabelWidth: '130px',
      form: {
        issue_type: '',
        audit_explanation: '',
        corrective_action_plan: '',
        corrective_plan: '',
        corrective_date: '',
        subheader: '',
        code_provision: '',
        corrective_principal: '',
        survey_year: '',
        deadline: '',
        status: '',
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
        audit_explanation: '',
        corrective_action_plan: '',
        corrective_plan: '',
        corrective_date: '',
        subheader: '',
        code_provision: '',
        corrective_principal: '',
        survey_year: '',
        deadline: '',
        status: '',
      },
      rules: {
        issue_type: [
          {
            required: true,
            message: this.$l.pleaseTypeIssue,
            trigger: 'change',
          },
        ],
        subheader: [
          {
            required: true,
            message: this.$l.pleaseSubheader,
            trigger: 'blur',
          },
        ],
        code_provision: [
          {
            required: true,
            message: this.$l.pleaseCodeProvision,
            trigger: 'blur',
          },
        ],
        audit_explanation: [
          {
            required: true,
            message: this.$l.pleaseAuditExplanation,
            trigger: 'blur',
          },
        ],
        corrective_action_plan: [
          {
            required: true,
            message: this.$l.pleaseCorrectiveActionPlan,
            trigger: 'blur',
          },
        ],
        corrective_plan: [
          {
            required: true,
            message: this.$l.pleaseCorrectivePlan,
            trigger: 'blur',
          },
        ],
        corrective_date: [
          {
            required: true,
            message: this.$l.pleaseCorrectiveDate,
            trigger: 'change',
          },
        ],
        corrective_principal: [
          {
            required: true,
            message: this.$l.pleasePIC,
            trigger: 'blur',
          },
        ],
        deadline: [
          {
            required: true,
            message: this.$l.pleaseDeadline,
            trigger: 'change',
          },
        ],
        status: [
          {
            required: true,
            message: this.$l.pleaseStatus,
            trigger: 'change',
          },
        ],
      },
      editRules: {
        issue_type: [
          {
            required: true,
            message: this.$l.pleaseTypeIssue,
            trigger: 'change',
          },
        ],
        subheader: [
          {
            required: true,
            message: this.$l.pleaseSubheader,
            trigger: 'blur',
          },
        ],
        code_provision: [
          {
            required: true,
            message: this.$l.pleaseCodeProvision,
            trigger: 'blur',
          },
        ],
        audit_explanation: [
          {
            required: true,
            message: this.$l.pleaseAuditExplanation,
            trigger: 'blur',
          },
        ],
        corrective_action_plan: [
          {
            required: true,
            message: this.$l.pleaseCorrectiveActionPlan,
            trigger: 'blur',
          },
        ],
        corrective_plan: [
          {
            required: true,
            message: this.$l.pleaseCorrectivePlan,
            trigger: 'blur',
          },
        ],
        corrective_date: [
          {
            required: true,
            message: this.$l.pleaseCorrectiveDate,
            trigger: 'change',
          },
        ],
        corrective_principal: [
          {
            required: true,
            message: this.$l.pleasePIC,
            trigger: 'blur',
          },
        ],
        deadline: [
          {
            required: true,
            message: this.$l.pleaseDeadline,
            trigger: 'change',
          },
        ],
        status: [
          {
            required: true,
            message: this.$l.pleaseStatus,
            trigger: 'change',
          },
        ],
      },
      getDetailsQuery: {
        page: 1,
        pageSize: 10,
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
    // Initialize manufacture columns after $l is ready
    this.manufacture.column = [
      {
        key: 'manufacture_id',
        label: 'ID',
      },
      {
        key: 'name_en',
        label: this.$l.ENname || 'Name (EN)',
      },
    ]
    
    this.getList() // 在组件创建时调用getList方法获取数据
    // this.getIssueType()
    this.getUserAuth()
  },
  methods: {
    handleTableAction({ action, row }) {
      console.log(action, row)
      if (action === 'detail') {
        this.getDetails(null, row)
      }
    },
    handleDetailsTableAction({ action, row }) {
      console.log(action, row)
      if (action === 'edit') {
        this.editDetail(null, row)
      }
      if (action === 'delete') {
        this.deleteIssue(row)
      }
      if (action === 'audit') {
        this.passornot(row)
      }
      if (action === 'rectification') {
        this.viewRectification(row)
      }
    },
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
    showManufacture() {
      // Reset to first page and open dialog
      this.manufacture.query.page = 1
      this.dialogSelectManufacture = true
      this.getManufactureList()
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
      this.check.verification_status = row.status
      this.check.reviewed_by = row.audit_user
      this.check.verification_date = row.verification_date
      this.check.comments = row.comments
      this.check.follow_up_required = row.follow_up_required
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
          status: this.check.verification_status,
          reviewed_by: this.check.reviewed_by,
          verification_date: this.check.verification_date,
          comments: this.check.comments,
          follow_up_required: this.check.follow_up_required,
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
          ...this.query,
          manufacture_name: this.formInline.manufacture_name,
          issues_type: this.formInline.issues_type,
          issues_desc: this.formInline.issues_desc,
          suggest: this.formInline.suggest,
          corrective_date: this.formInline.corrective_date,
          corrective_principal: this.formInline.corrective_principal,
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
      this.detailtable.isLoading = true
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
        this.detailtable.isLoading = false
      })
    },
    showHisList(is_his) {
      const id = this.clickRow.id
      console.log(id)
      this.$request(
        api.baseUrl + '/Compliance/complianceIssues/getIssuesDetail',
        {
          ...this.getDetailsQuery,
          id: id,
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

    // 删除问题
    deleteIssue(row) {
      this.$confirm(this.$l.confirmDelete, this.$c.oprConfirm, {
        confirmButtonText: this.$c.confirm,
        cancelButtonText: this.$c.cancel,
        type: 'warning',
      })
        .then(() => {
          this.$request(api.baseUrl + '/Compliance/complianceIssues/deleteIssue', { issueId: row.id }, 'post')
            .then((response) => {
              if (response.httpCode === 200) {
                this.$message.success(this.$l.deleteSuccess)
                // Refresh the detail table
                this.getDetail()
              } else {
                this.$message.error(response.message || this.$l.deleteFailed)
              }
            })
            .catch((error) => {
              this.$message.error(error.response?.data?.message || this.$l.deleteFailed)
            })
        })
        .catch(() => {
          // User cancelled
        })
    },
    //提交修改结果
    submitEdit() {
      // Bắt đầu loading state
      this.isEditSubmitting = true

      this.$request(
        api.baseUrl + '/Compliance/complianceIssues/addOrModifyIssues',
        {
          manufacture_id: this.editForm.manufacture_id,
          detail: [
            {
              issue_type: this.editForm.issue_type,
              audit_explanation: this.editForm.audit_explanation,
              corrective_action_plan: this.editForm.corrective_action_plan,
              corrective_plan: this.editForm.corrective_plan,
              corrective_date: this.editForm.corrective_date,
              subheader: this.editForm.subheader,
              code_provision: this.editForm.code_provision,
              corrective_principal: this.editForm.corrective_principal,
              survey_year: this.editForm.survey_year,
              deadline: this.editForm.deadline,
              status: this.editForm.status,
              is_valid: this.editForm.is_valid,
              rec_status: this.editForm.rec_status,
              id: this.editForm.id,
              pid: this.editForm.pid,
            },
          ],
        },
        'post'
      )
        .then((response) => {
          this.data = response.data
          this.getList()
          this.editVisible = false
          this.$message.success(this.$l.editSuccess)
        })
        .catch((error) => {
          console.error('Error updating form:', error)
          this.$message.error(error.response.data.message || this.$l.updateFailed)
        })
        .finally(() => {
          // Kết thúc loading state
          this.isEditSubmitting = false
        })
    },
    addForm() {
      this.addFormVisible = true
    },

    resetFormAdd() {
      this.form = {
        issue_type: '',
        audit_explanation: '',
        corrective_action_plan: '',
        corrective_plan: '',
        corrective_date: '',
        subheader: '',
        code_provision: '',
        corrective_principal: '',
        survey_year: '',
        deadline: '',
        status: '',
        rec_status: '1',
        is_valid: 'Y',
        manufacture_id: '',
        fileList: [],
        addfile: {},
        addFileList: [],
      }
      this.form.manufacture_id = ''
      this.form.name_en = ''
      this.dialogSelectManufacture = false
      this.addFormVisible = false
    },

    //创建取消
    addCancel(form) {
      this.addFormVisible = false
      this.resetFormAdd()
    },
    //创建
    submit(form) {
      const issue_type = this.form.issue_type
      const audit_explanation = this.form.audit_explanation
      const corrective_action_plan = this.form.corrective_action_plan
      const corrective_date = this.form.corrective_date
      const subheader = this.form.subheader
      const code_provision = this.form.code_provision
      const corrective_principal = this.form.corrective_principal
      const survey_year = this.form.survey_year
      // const status = this.form.status
      const rec_status = this.form.rec_status
      const is_valid = this.form.is_valid
      const manufacture_id = this.form.manufacture_id

      if (!issue_type || !audit_explanation || !corrective_action_plan || !corrective_date || !subheader || !code_provision || !corrective_principal) {
        this.$message.error(this.$l.pleaseCompleteAllFields)
        return
      }

      if (!manufacture_id) {
        this.$message.error(this.$l.pleaseSelectManufacture)
        return
      }

      if (this.form.addFileList.length > 0) {
        this.form.addFileList.forEach((file) => {
          this.form.attachments.push({
            file_name: file.name,
            file_suffix: file.name.split('.').pop(),
            file_url: file.url,
          })
        })
      }

      // Bắt đầu loading state
      this.isSubmitting = true

      this.$request(
        api.baseUrl + '/Compliance/complianceIssues/addOrModifyIssues',
        {
          manufacture_id: manufacture_id,
          detail: [
            {
              issue_type: issue_type,
              audit_explanation: audit_explanation,
              corrective_action_plan: corrective_action_plan,
              corrective_date: corrective_date,
              subheader: subheader,
              code_provision: code_provision,
              corrective_principal: corrective_principal,
              survey_year: survey_year,
              status: status,
              is_valid: is_valid,
              rec_status: rec_status,
            },
          ],
        },
        'post',
        true
      )
        .then((response) => {
          this.data = response.data
          this.getList()
          this.resetFormAdd()
          this.addFormVisible = false
          this.$message.success(this.$l.addSuccess)
        })
        .catch((error) => {
          console.error('Error submitting form:', error)
          this.$message.error(error.response.data.message || this.$l.submitFailed)
        })
        .finally(() => {
          // Kết thúc loading state
          this.isSubmitting = false
        })
    },

    // 查看整改信息
    viewRectification(row) {
      this.$request(
        api.baseUrl + '/Compliance/complianceIssues/getRectificationInfo',
        {
          issueId: row.id,
        },
        'get'
      )
        .then((response) => {
          if (response.httpCode === 200) {
            this.rectificationData = response.data
            this.rectificationVisible = true
          } else {
            this.$message.error(response.message || this.$l.loadDataFailed)
          }
        })
        .catch((error) => {
          this.$message.error(error.response?.data?.message || this.$l.loadDataFailed)
        })
    },

    // 获取状态类型
    getStatusType(status) {
      switch (status) {
        case 'open':
          return 'info'
        case 'in_progress':
          return 'warning'
        case 'completed':
          return 'success'
        case 'closed':
          return 'success'
        default:
          return 'info'
      }
    },

    // 获取状态文本
    getStatusText(status) {
      switch (status) {
        case 'open':
          return this.$l.statusOpen
        case 'in_progress':
          return this.$l.statusInProgress
        case 'completed':
          return this.$l.statusCompleted
        case 'closed':
          return this.$l.statusClosed
        default:
          return status
      }
    },

    // 格式化文件大小
    formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },

    // 预览文件
    previewFile(attachment) {
      this.file.fileUrl = api.baseUrl + '/' + attachment.file_url
      this.fileDialogVisible = true
    },

    checkField, //多级表头渲染组件
    showManufacture() {
      this.dialogSelectManufacture = true
      this.getManufactureList()
    },
    getManufactureList() {
      this.manufacture.loading = true
      const params = {
        page: this.manufacture.query.page,
        pageSize: this.manufacture.query.pageSize,
        manufacture_name: this.manufacture.query.manufacture_name,
      }
      this.$request(api.baseUrl + '/Compliance/complianceManufacturer/getlist', params, 'get')
        .then((response) => {
          console.log('✅ API Response:', response)
          // Make sure to assign to new object to trigger reactivity
          const tableData = response.data.list || []
          const total = response.data.total || tableData.length
          
          // Force reactivity update
          this.$set(this.manufacture, 'tableData', tableData)
          this.$set(this.manufacture, 'total', total)
          
          console.log('✅ Updated tableData:', this.manufacture.tableData)
          console.log('✅ Updated total:', this.manufacture.total)
        })
        .catch((error) => {
          console.error('❌ Error fetching manufacturers:', error)
          this.$message.error(error.response?.data?.message || this.$l.loadDataFailed)
        })
        .finally(() => {
          this.manufacture.loading = false
        })
    },
    selectManufacture(index, item) {
      this.form.manufacture_id = item.manufacture_id
      this.form.name_en = item.name_en
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

<style scoped>
.modern-table {
  border: none;
}
.modern-table :deep(.el-table__header-wrapper) th {
  background-color: #f9fafb;
  color: #374151;
  font-weight: 500;
  border: none;
}
.modern-table :deep(.el-table__body-wrapper) td {
  border: none;
  border-bottom: 1px solid #f3f4f6;
}
.modern-table :deep(.el-table__body-wrapper) tr:hover {
  background-color: #f9fafb;
}

.modern-dialog :deep(.el-dialog) {
  border-radius: 12px;
  border: none;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
.modern-dialog :deep(.el-dialog__header) {
  border-bottom: 1px solid #f3f4f6;
  padding-bottom: 16px;
  margin-bottom: 0;
}
.modern-dialog :deep(.el-dialog__body) {
  padding-top: 24px;
}

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
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
