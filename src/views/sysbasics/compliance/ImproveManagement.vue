<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div class="p-3 border-b border-solid border-gray-100 flex flex-col gap-[1px]">
      <div class="text-2xl font-bold text-black">{{ l.thresholdIssueManagement }}</div>
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
          <input type="text" :placeholder="l.manufactureName" v-model="formInline.manufacture_name" class="h-9 pr-3 pl-10 border border-gray-200 rounded-full focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
        </div>
      </div>

      <div class="flex gap-3">
        <button v-show="showAuth.m_search" @click="getList" class="h-9 rounded flex items-center bg-black text-white px-4 hover:bg-gray-800 transition-colors duration-150">
          {{ l.search }}
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
          {{ l.create }}
        </button>
      </div>

      <div class="flex items-center gap-3"></div>
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
    <CustomDialog :title="l.create" :visible.sync="addFormVisible" :clickOutside="false" width="90%" :maxWidth="'1080px'">
      <template #content>
        <div class="flex flex-col gap-6">
          <div class="text-xl font-black text-gray-900 dark:text-white">{{ l.basicInformation }}</div>

          <el-form :model="form" ref="form" :rules="rules" :label-width="formLabelWidth">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-show="false" class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.manufacture }}</label>
                <el-input v-model="form.manufacture_id" :disabled="true"></el-input>
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.manufactureName }}</label>
                <div class="flex gap-2">
                  <el-input v-model="form.name_en" :disabled="true" :placeholder="l.selectManufacture" class="rounded-md" />
                  <el-button type="primary" plain @click="showManufacture" class="rounded-md">{{ l.selectManufacture }}</el-button>
                </div>
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.issueType }}</label>
                <el-input v-model="form.issue_type" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.subheader }}</label>
                <el-input v-model="form.subheader" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.code_provision }}</label>
                <el-input v-model="form.code_provision" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.audit_explanation }}</label>
                <el-input type="textarea" v-model="form.audit_explanation" :autosize="{ minRows: 4 }" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.corrective_action_plan }}</label>
                <el-input type="textarea" v-model="form.corrective_action_plan" :autosize="{ minRows: 4 }" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.corrective_date }}</label>
                <el-date-picker v-model="form.corrective_date" type="date" :placeholder="l.corrective_date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" class="rounded-md w-full" style="width: 100%" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.pic }}</label>
                <el-input v-model="form.corrective_principal" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.surveyYear }}</label>
                <el-date-picker v-model="form.survey_year" type="year" :placeholder="c.surveyYearPlaceholder" format="yyyy" value-format="yyyy" class="rounded-md w-full" style="width: 100%" />
              </div>

              <div class="flex flex-col col-span-full gap-2">
                <div class="text-xl font-black text-gray-900 dark:text-white">{{ l.supportInfo }}</div>
                <input type="file" @change="addFile" ref="addfileinput" style="display: none" />
                <div>
                  <el-button type="primary" @click="$refs.addfileinput.click()" class="rounded-md w-full">{{ l.fileUpload }}</el-button>
                </div>
              </div>

              <div class="col-span-full" v-if="form.fileList.length > 0">
                <div class="">
                  <z-table :list="form.fileList" :columns="form.columns">
                    <template #operation="{row, $index}">
                      <el-button @click="removeAddClick(row, $index)" type="text" size="small" class="text-red-500">{{ c.delete }}</el-button>
                    </template>
                  </z-table>
                </div>
              </div>
            </div>
          </el-form>
        </div>
      </template>

      <template slot="footer">
        <div class="flex gap-3 justify-end">
          <el-button @click="addCancel('form')" :disabled="isSubmitting" class="rounded-md">{{ l.cancel }}</el-button>
          <el-button type="primary" @click="submit('form')" :loading="isSubmitting" class="rounded-md">{{ l.submit }}</el-button>
        </div>
      </template>
    </CustomDialog>

    <CustomDialog :title="l.check" :visible.sync="dialogFormVisible" width="90%" :height="'100%'">
      <template #content>
        <div class="flex flex-col h-full overflow-hidden gap-2">
          <div class="grid grid-cols-2 gap-3">
            <div class="flex gap-2 items-center">
              <label class="font-light text-sm text-gray-700 mr-2">
                {{ l.factory_name }}
              </label>
              <div class="flex-1">
                <el-input v-model="clickRow.name_en" :placeholder="l.basicArchives" class="w-full" style="width: 100%" disabled></el-input>
              </div>
            </div>
            <div class="flex gap-2 items-center">
              <label class="font-light text-sm text-gray-700 mr-2">
                {{ l.vendor_code }}
              </label>
              <div class="flex-1">
                <el-input v-model="clickRow.vendor_code" :placeholder="l.basicArchives" class="w-full" style="width: 100%" disabled></el-input>
              </div>
            </div>
          </div>

          <improve-management-details-table :data="detailtable.list" :isLoading="detailtable.isLoading" @action="handleDetailsTableAction" class="main-table" :page="getDetailsQuery" />
        </div>
      </template>
      <template slot="footer">
        <z-pagination :pagination="pagination" :total="detailtable.total" :page.sync="getDetailsQuery.page" :limit.sync="getDetailsQuery.pageSize" @change="showHisList(is_his)"></z-pagination>
      </template>
    </CustomDialog>

    <CustomDialog :title="l.selectManufacture" :visible.sync="dialogSelectManufacture" :height="'100%'">
      <template #content>
        <div class="flex flex-col overflow-hidden h-full gap-3">
          <div class="flex-1 overflow-auto border border-gray-200 rounded">
            <div v-if="manufacture.loading" class="flex items-center justify-center h-32">
              <div class="text-gray-500">{{ l.loading || 'Loading...' }}</div>
            </div>
            <div v-else-if="manufacture.tableData.length === 0" class="flex items-center justify-center h-32">
              <div class="text-gray-500">{{ l.noData || 'No data available' }}</div>
            </div>
            <table v-else class="w-full border-collapse">
              <thead class="bg-gray-50 sticky top-0">
                <tr>
                  <th v-for="(item, index) in manufacture.column" :key="index" class="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-b border-gray-200">
                    {{ item.label }}
                  </th>
                  <th class="px-4 py-3 text-right text-sm font-semibold text-gray-900 border-b border-gray-200">{{ c.operation || 'Action' }}</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-200">
                <tr v-for="(row, rowIndex) in manufacture.tableData" :key="rowIndex" class="hover:bg-gray-50 transition-colors">
                  <td v-for="(item, colIndex) in manufacture.column" :key="colIndex" class="px-4 py-3 text-sm text-gray-900 border-b border-gray-100">
                    {{ row[item.key] }}
                  </td>
                  <td class="px-4 py-3 text-sm text-right border-b border-gray-100">
                    <button @click="selectManufacture(rowIndex, row)" class="inline-flex items-center px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded transition-colors duration-150">
                      {{ c.select || 'Select' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination for manufacturer list -->
          <div class="flex justify-between items-center">
            <div class="text-sm text-gray-500">{{ l.total }}: {{ manufacture.total }}</div>
            <z-pagination :pagination="pagination" :total="manufacture.total" :page.sync="manufacture.query.page" :limit.sync="manufacture.query.pageSize" @change="getManufactureList" />
          </div>
        </div>
      </template>
    </CustomDialog>

    <CustomDialog :title="l.result" :visible.sync="passFormVisible" width="100%" :maxWidth="'600px'" class="modern-dialog">
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label class="font-light text-sm text-black">{{ l.verification_status }}</label>
            <el-select v-model="check.verification_status" :placeholder="l.pleaseSelect" class="rounded-md w-full">
              <el-option :label="l.on_track" value="on_track"></el-option>
              <el-option :label="l.off_track" value="off_track"></el-option>
              <el-option :label="l.closed" value="closed"></el-option>
            </el-select>
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-light text-sm text-black">{{ l.reviewed_by }}</label>
            <el-input v-model="check.reviewed_by" :placeholder="l.input_reviewed_by" class="rounded-md" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-light text-sm text-black">{{ l.verification_date }}</label>
            <el-date-picker v-model="check.verification_date" type="date" :placeholder="l.verification_date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" class="rounded-md w-full" style="width: 100%" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-light text-sm text-black">{{ l.comments }}</label>
            <el-input type="textarea" v-model="check.comments" :placeholder="l.input_comments" :autosize="{ minRows: 4 }" class="rounded-md" />
          </div>

          <div class="flex flex-col gap-2">
            <label class="font-light text-sm text-black">{{ l.follow_up_action_required }}</label>
            <el-radio-group v-model="check.follow_up_required">
              <el-radio label="N">{{ l.no }}</el-radio>
              <el-radio label="Y">{{ l.yes_include_in_next_internal_audit }}</el-radio>
            </el-radio-group>
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="flex gap-3 justify-end">
          <el-button @click="passFormVisible = false" class="rounded-md">{{ l.cancel }}</el-button>
          <el-button type="primary" @click="passsubmit" class="rounded-md">{{ l.submit }}</el-button>
        </div>
      </template>
    </CustomDialog>

    <CustomDialog :title="l.editInformation" :visible.sync="editVisible" :clickOutside="false" width="90%" :maxWidth="'1080px'">
      <template #content>
        <div class="flex flex-col gap-6">
          <div class="text-xl font-black text-gray-900 dark:text-white">{{ l.basicInformation }}</div>

          <el-form :model="editForm" ref="editForm" :rules="editRules" :label-width="formLabelWidth">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.issueType }}</label>
                <el-select v-model="editForm.issue_type" :placeholder="l.inputIssue" class="rounded-md w-full">
                  <el-option v-for="item in issueType" :key="item.name_zh" :label="item.name_label" :value="item.name_zh"></el-option>
                </el-select>
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.subheader }}</label>
                <el-input v-model="editForm.subheader" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2 col-span-full">
                <label class="font-light text-sm text-black">{{ l.code_provision }}</label>
                <el-input v-model="editForm.code_provision" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.audit_explanation }}</label>
                <el-input type="textarea" v-model="editForm.audit_explanation" :placeholder="l.inputAuditExplanation" :autosize="{ minRows: 4 }" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.corrective_action_plan }}</label>
                <el-input type="textarea" v-model="editForm.corrective_action_plan" :placeholder="l.inputCorrectiveActionPlan" :autosize="{ minRows: 4 }" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.corrective_date }}</label>
                <el-date-picker v-model="editForm.corrective_date" type="date" :placeholder="l.corrective_date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" class="rounded-md w-full" style="width: 100%" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ l.pic }}</label>
                <el-input v-model="editForm.corrective_principal" class="rounded-md" />
              </div>

              <div class="flex flex-col gap-2">
                <label class="font-light text-sm text-black">{{ c.surveyYear }}</label>
                <el-date-picker v-model="editForm.survey_year" type="year" :placeholder="c.surveyYearPlaceholder" format="yyyy" value-format="yyyy" class="rounded-md w-full" style="width: 100%" />
              </div>
            </div>
          </el-form>
        </div>
      </template>

      <template slot="footer">
        <div class="flex gap-3 justify-end">
          <el-button @click="editVisible = false" :disabled="isEditSubmitting" class="rounded-md">{{ l.cancel }}</el-button>
          <el-button type="primary" @click="submitEdit" :loading="isEditSubmitting" class="rounded-md">{{ l.submit }}</el-button>
        </div>
      </template>
    </CustomDialog>

    <!-- Rectification Dialog -->
    <CustomDialog :title="l.rectificationInfo" :visible.sync="rectificationVisible" width="90%" :maxWidth="'1200px'">
      <template #content>
        <div class="flex flex-col gap-6 max-h-[70vh] overflow-y-auto">
          <!-- 问题信息 -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-gray-800">{{ l.issueInformation }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ l.issueType }}</label>
                <p class="text-sm text-gray-900">{{ rectificationData.issue_type }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ l.subheader }}</label>
                <p class="text-sm text-gray-900">{{ rectificationData.subheader }}</p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ l.codeProvision }}</label>
                <p class="text-sm text-gray-900">{{ rectificationData.code_provision }}</p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ l.auditExplanation }}</label>
                <p class="text-sm text-gray-900">{{ rectificationData.audit_explanation }}</p>
              </div>
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-1">{{ l.correctiveActionPlan }}</label>
                <p class="text-sm text-gray-900">{{ rectificationData.corrective_action_plan }}</p>
              </div>
            </div>
          </div>

          <!-- 整改信息 -->
          <div class="bg-blue-50 p-4 rounded-lg">
            <h3 class="text-lg font-semibold mb-4 text-blue-800">{{ l.rectificationInformation }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="md:col-span-2">
                <label class="block text-sm font-medium text-blue-700 mb-1">{{ l.correctivePlan }}</label>
                <div class="bg-white p-3 rounded border">
                  <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ rectificationData.corrective_plan }}</p>
                </div>
              </div>
              <div>
                <label class="block text-sm font-medium text-blue-700 mb-1">{{ l.correctivePrincipal }}</label>
                <p class="text-sm text-gray-900">{{ rectificationData.corrective_principal }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-blue-700 mb-1">{{ l.correctiveDate }}</label>
                <p class="text-sm text-gray-900">{{ rectificationData.corrective_date ? new Date(rectificationData.corrective_date).toLocaleDateString() : '' }}</p>
              </div>
              <div>
                <label class="block text-sm font-medium text-blue-700 mb-1">{{ l.status }}</label>
                <el-tag :type="getStatusType(rectificationData.status)">{{ getStatusText(rectificationData.status) }}</el-tag>
              </div>
              <div>
                <label class="block text-sm font-medium text-blue-700 mb-1">{{ l.isFinish }}</label>
                <el-tag :type="rectificationData.is_finish === 'Y' ? 'success' : 'warning'">
                  {{ rectificationData.is_finish === 'Y' ? l.finish : l.unfinished }}
                </el-tag>
              </div>
            </div>
          </div>

          <!-- 附件信息 -->
          <div class="bg-green-50 p-4 rounded-lg" v-if="rectificationData.attachments && rectificationData.attachments.length > 0">
            <h3 class="text-lg font-semibold mb-4 text-green-800">{{ l.attachments }}</h3>
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
                  {{ l.preview }}
                </el-button>
              </div>
            </div>
          </div>

          <!-- 验证信息 -->
          <div class="bg-yellow-50 p-4 rounded-lg" v-if="rectificationData.verification_date || rectificationData.comments">
            <h3 class="text-lg font-semibold mb-4 text-yellow-800">{{ l.verificationInformation }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div v-if="rectificationData.verification_date">
                <label class="block text-sm font-medium text-yellow-700 mb-1">{{ l.verificationDate }}</label>
                <p class="text-sm text-gray-900">{{ new Date(rectificationData.verification_date).toLocaleDateString() }}</p>
              </div>
              <div v-if="rectificationData.comments" class="md:col-span-2">
                <label class="block text-sm font-medium text-yellow-700 mb-1">{{ l.comments }}</label>
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
          <el-button @click="rectificationVisible = false" class="rounded-md">{{ l.close }}</el-button>
        </div>
      </template>
    </CustomDialog>

    <!-- 文件查看 -->
    <el-dialog :visible.sync="fileTableVisable" :title="l.viewDocument">
      <div>
        <!-- 文件表格 -->
        <z-table :list="file.list" :columns="file.columns">
          <template #operation="{row, $index}">
            <el-button @click="getFilePreview(row.file_url)" type="text" size="small">{{ c.check }}</el-button>
          </template>
        </z-table>
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
              <z-table :list="roleList.list" :columns="roleList.columns">
                <template #operation="{row, $index}">
                  <el-button @click="addRoleItem(row)" type="text" size="small">{{ l.addNotification }}</el-button>
                </template>
              </z-table>
            </el-col>

            <el-col :span="12">
              <z-table :list="recEmailList.list" :columns="recEmailList.columns">
                <template #operation="{row, $index}">
                  <el-button @click="deleteRoleItem(row)" type="text" size="small" style="color: red">{{ l.cancellationNotice }}</el-button>
                </template>
              </z-table>
            </el-col>

            <el-col :span="24">
              <el-form-item :label="l.sendEmail"></el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item :label="l.approachingReviewDate">
                <el-date-picker v-model="recEmailList.distanceTime" type="date" placeholder="选择日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"></el-date-picker>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item>
                <el-button type="primary" @click="sendRoleEmail">{{ l.sendEmail }}</el-button>
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
          <el-form-item :label="l.upload_file" required>
            <input type="file" accept=".xls,.xlsx" class="el-input" @change="onFileChange" style="border: 1px solid #dcdcdc; border-radius: 5px; padding: 3px" />
          </el-form-item>
        </el-form>
        <div style="margin-top: 40px; text-align: right">
          <el-button type="primary" @click="visabled.uploadFile = false">{{ c.cancel }}</el-button>
          <el-button type="success" @click="uploadExcel">{{ c.m_upload }}</el-button>
        </div>
      </div>
    </el-dialog>

    <FilePreviews v-if="file.fileUrl" :file-url="file.fileUrl" :visible="fileDialogVisible" @update:visible="fileDialogVisible = $event" />
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, getCurrentInstance, watch } from 'vue'
import axios from 'axios'
import dayjs from 'dayjs'
import { getToken } from '@/utils/auth'
import { checkField } from '@/utils/checkFiled'
import { _, api, zPagination, zTable } from '@/views/_common'
import CustomDialog from '../../_common/CustomDialog.vue'
import FilePreviews from '../../_common/FilePreviews.vue'
import ImproveManagementDetailsTable from './ImproveManagementDetailsTable.vue'
import ImproveManagementTable from './ImproveManagementTable.vue'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('improveManagement')

const fileTableVisable = ref(false)
const fileDialogVisible = ref(false)
const recEmailVisible = ref(false)
const issueType = ref([])
const userAuth = ref([])
const isSubmitting = ref(false)
const isEditSubmitting = ref(false)
const visabled = reactive({
  uploadFile: false,
})
const uploadQuery = reactive({})
const pagination = reactive({
  layout: 'prev, pager, next, jumper, ->, total,sizes',
  pagerCount: 7,
  pageSizes: [10, 15, 20, 30, 40, 50, 100],
})
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
const file = reactive({
  fileUrl: '',
  list: [],
  columns: computed(() => [
    {
      title: l.value.filename,
      key: 'file_name',
      width: 220,
    },
    {
      title: l.value.fileType,
      key: 'file_type',
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
  ]),
})
const check = reactive({
  verification_status: '',
  reviewed_by: '',
  verification_date: '',
  comments: '',
  follow_up_required: 'N',
  rec_status: '',
})
const clickRow = ref({})
const labelPosition = ref('right')
const passFormVisible = ref(false)
const detailtable = reactive({
  list: [],
  total: 0,
  isLoading: false,
})
const is_his = ref(0)
const forminit = reactive({})
const table = reactive({
  data: [],
  total: 0,
  page: 1,
  column: computed(() => [
    {
      key: 'name_zh',
      label: l.value.name_zh,
      width: '',
    },
    {
      key: 'issue_type',
      label: l.value.issue_type,
      width: '',
    },
    {
      key: 'issue_desc',
      label: l.value.issue_desc,
      width: '',
    },
    {
      key: 'issue_suggest',
      label: l.value.issue_suggest,
      width: '',
    },
    {
      key: 'corrective_plan',
      label: l.value.corrective_plan,
      width: '',
    },
    {
      key: 'attchments',
      label: l.value.attchments,
      width: '',
    },
    {
      key: 'corrective_principal',
      label: l.value.corrective_principal,
      width: '',
    },
    {
      key: 'corrective_date',
      label: l.value.corrective_date,
      width: '',
    },
    {
      key: 'verify_detail',
      label: l.value.verify_detail,
      width: '',
    },
    {
      key: 'is_finish',
      label: l.value.is_finish,
      width: '',
    },
    {
      key: 'is_verify_pass',
      label: l.value.is_verify_pass,
      width: '',
    },
    {
      key: 'verify_date',
      label: l.value.verify_date,
      width: '',
    },
    {
      key: 'create_time',
      label: l.value.create_time,
      width: '',
    },
  ]),
})
const query = reactive({
  type: '',
  name: '',
  page: 1,
  pageSize: 10,
  total: 0,
})
const list = ref([])
const formInline = reactive({
  manufacture_name: '',
  issue_type: '',
  issue_desc: '',
  issue_suggest: '',
  corrective_date: '',
  corrective_principal: '',
})
const tableData = reactive({
  total: 0,
  page: 1,
  pageSize: 15,
  list: [],
  loading: false,
})
const manufacture = reactive({
  column: computed(() => [
    {
      key: 'manufacture_id',
      label: 'ID',
    },
    {
      key: 'name_en',
      label: l.value.ENname || 'Name (EN)',
    },
  ]),
  tableData: [],
  total: 0,
  loading: false,
  query: {
    page: 1,
    pageSize: 15,
    manufacture_name: '',
  },
})
const addFormVisible = ref(false)
const dialogFormVisible = ref(false)
const dialogSelectManufacture = ref(false)
const editVisible = ref(false)
const rectificationVisible = ref(false)
const rectificationData = ref({})
const formLabelWidth = ref('130px')
const form = reactive({
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
  columns: computed(() => [
    {
      title: l.value.filename,
      key: 'file_name',
      width: 220,
    },
    {
      title: l.value.fileType,
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
  ]),
})
const editForm = reactive({
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
})
const rules = computed(() => ({
  issue_type: [{ required: true, message: l.value.pleaseTypeIssue, trigger: 'change' }],
  subheader: [{ required: true, message: l.value.pleaseSubheader, trigger: 'blur' }],
  code_provision: [{ required: true, message: l.value.pleaseCodeProvision, trigger: 'blur' }],
  audit_explanation: [{ required: true, message: l.value.pleaseAuditExplanation, trigger: 'blur' }],
  corrective_action_plan: [{ required: true, message: l.value.pleaseCorrectiveActionPlan, trigger: 'blur' }],
  corrective_plan: [{ required: true, message: l.value.pleaseCorrectivePlan, trigger: 'blur' }],
  corrective_date: [{ required: true, message: l.value.pleaseCorrectiveDate, trigger: 'change' }],
  corrective_principal: [{ required: true, message: l.value.pleasePIC, trigger: 'blur' }],
  deadline: [{ required: true, message: l.value.pleaseDeadline, trigger: 'change' }],
  status: [{ required: true, message: l.value.pleaseStatus, trigger: 'change' }],
}))
const editRules = computed(() => ({
  issue_type: [{ required: true, message: l.value.pleaseTypeIssue, trigger: 'change' }],
  subheader: [{ required: true, message: l.value.pleaseSubheader, trigger: 'blur' }],
  code_provision: [{ required: true, message: l.value.pleaseCodeProvision, trigger: 'blur' }],
  audit_explanation: [{ required: true, message: l.value.pleaseAuditExplanation, trigger: 'blur' }],
  corrective_action_plan: [{ required: true, message: l.value.pleaseCorrectiveActionPlan, trigger: 'blur' }],
  corrective_plan: [{ required: true, message: l.value.pleaseCorrectivePlan, trigger: 'blur' }],
  corrective_date: [{ required: true, message: l.value.pleaseCorrectiveDate, trigger: 'change' }],
  corrective_principal: [{ required: true, message: l.value.pleasePIC, trigger: 'blur' }],
  deadline: [{ required: true, message: l.value.pleaseDeadline, trigger: 'change' }],
  status: [{ required: true, message: l.value.pleaseStatus, trigger: 'change' }],
}))
const getDetailsQuery = reactive({
  page: 1,
  pageSize: 10,
  id: '',
  is_his: '0',
})
const roleList = reactive({
  list: [],
  query: {
    params: {},
    size: 15,
    page: 1,
    role_type: 'cis',
  },
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

const addfileinput = ref(null)

const handleTableAction = ({ action, row }) => {
  console.log(action, row)
  if (action === 'detail') {
    getDetails(null, row)
  }
}

const handleDetailsTableAction = ({ action, row }) => {
  console.log(action, row)
  if (action === 'edit') {
    editDetail(null, row)
  }
  if (action === 'delete') {
    deleteIssue(row)
  }
  if (action === 'audit') {
    passornot(row)
  }
  if (action === 'rectification') {
    viewRectification(row)
  }
}

const getIssueType = () => {
  proxy
    .$request(
      api.baseUrl + '/Requirements/Publiccode/getListdetailed',
      {
        queryString: {},
        ruleno: 9622,
        orgid: 200,
        pageSize: 999,
        curPage: 1,
      },
      'get'
    )
    .then((r) => {
      issueType.value = r.data.list
      console.log(issueType.value)
    })
}

const showManufacture = () => {
  manufacture.query.page = 1
  dialogSelectManufacture.value = true
  getManufactureList()
}

const formatIsFinish = (row, column, cellValue, index) => {
  return cellValue === 'N' ? l.value.unfinished : cellValue === 'Y' ? l.value.finish : ''
}

const formatIsPass = (row, column, cellValue, index) => {
  return cellValue === 'N' ? l.value.noPass : cellValue === 'Y' ? l.value.pass : ''
}

const passornot = (row) => {
  console.log(row)
  passFormVisible.value = true
  check.id = row.id
  check.verification_status = row.status
  check.reviewed_by = row.audit_user
  check.verification_date = row.verification_date
  check.comments = row.comments
  check.follow_up_required = row.follow_up_required
}

const passsubmit = () => {
  passFormVisible.value = false
  const issuesId = check.id
  const rec_status = check.rec_status
  proxy
    .$request(
      api.baseUrl + '/Compliance/complianceIssues/auditIssues',
      {
        issuesId: issuesId,
        status: check.verification_status,
        reviewed_by: check.reviewed_by,
        verification_date: check.verification_date,
        comments: check.comments,
        follow_up_required: check.follow_up_required,
      },
      'post'
    )
    .then((response) => {
      if (response.httpCode == 200) {
        proxy.$message.success('审核成功')
      } else {
        proxy.$message.error('审核失败')
      }
    })
}

const resetForm = () => {
  Object.assign(formInline, forminit)
  proxy.$request(api.baseUrl + '/Compliance/complianceIssues/getList').then((r) => {
    tableData.list = r.data.list
    tableData.total = r.data.total
  })
}

const getList = () => {
  proxy
    .$request(
      api.baseUrl + '/Compliance/complianceIssues/getList',
      {
        ...query,
        manufacture_name: formInline.manufacture_name,
        issues_type: formInline.issues_type,
        issues_desc: formInline.issues_desc,
        suggest: formInline.suggest,
        corrective_date: formInline.corrective_date,
        corrective_principal: formInline.corrective_principal,
      },
      'get'
    )
    .then((r) => {
      tableData.list = r.data.list
      tableData.total = r.data.total
      table.total = r.data.total
      console.log(tableData.list)
    })
}

const getDetails = (index, row) => {
  dialogFormVisible.value = true
  const detail = []
  detail.push({
    index,
    row,
  })
  clickRow.value = row
  getDetailsQuery.id = detail[0].row.id
  getDetail()
}

const getDetail = () => {
  detailtable.isLoading = true
  proxy.$request(api.baseUrl + '/Compliance/complianceIssues/getIssuesDetail', getDetailsQuery, 'get').then((response) => {
    // data.value = response.data
    // console.log(data.value)
    detailtable.list = response.data.list.detail
    detailtable.total = response.data.total
    console.log(detailtable)
    const details = response.data.list.detail
    details.forEach((detail) => {
      detail.manufacture_id = response.data.list.manufacture_id
    })
    console.log(details)
    detailtable.isLoading = false
  })
}

const showHisList = (is_his) => {
  const id = clickRow.value.id
  console.log(id)
  proxy
    .$request(
      api.baseUrl + '/Compliance/complianceIssues/getIssuesDetail',
      {
        ...getDetailsQuery,
        id: id,
      },
      'get'
    )
    .then((response) => {
      // data.value = response.data
      detailtable.list = response.data.list.detail
      detailtable.total = response.data.total
      console.log(response.data)
      const details = response.data.list.detail
      details.forEach((detail) => {
        detail.manufacture_id = response.data.list.manufacture_id
      })
    })
}

const editDetail = (index, row) => {
  const editdetail = row
  console.log(editdetail)
  Object.assign(editForm, editdetail)
  console.log(editForm)
  editVisible.value = true
}

const deleteIssue = (row) => {
  proxy
    .$confirm(l.value.confirmDelete, c.value.oprConfirm, {
      confirmButtonText: c.value.confirm,
      cancelButtonText: c.value.cancel,
      type: 'warning',
    })
    .then(() => {
      proxy
        .$request(api.baseUrl + '/Compliance/complianceIssues/deleteIssue', { issueId: row.id }, 'post')
        .then((response) => {
          if (response.httpCode === 200) {
            proxy.$message.success(l.value.deleteSuccess)
            getDetail()
          } else {
            proxy.$message.error(response.message || l.value.deleteFailed)
          }
        })
        .catch((error) => {
          proxy.$message.error(error.response?.data?.message || l.value.deleteFailed)
        })
    })
    .catch(() => {
      // User cancelled
    })
}

const submitEdit = () => {
  isEditSubmitting.value = true

  proxy
    .$request(
      api.baseUrl + '/Compliance/complianceIssues/addOrModifyIssues',
      {
        manufacture_id: editForm.manufacture_id,
        detail: [
          {
            issue_type: editForm.issue_type,
            audit_explanation: editForm.audit_explanation,
            corrective_action_plan: editForm.corrective_action_plan,
            corrective_plan: editForm.corrective_plan,
            corrective_date: editForm.corrective_date,
            subheader: editForm.subheader,
            code_provision: editForm.code_provision,
            corrective_principal: editForm.corrective_principal,
            survey_year: editForm.survey_year,
            deadline: editForm.deadline,
            status: editForm.status,
            is_valid: editForm.is_valid,
            rec_status: editForm.rec_status,
            id: editForm.id,
            pid: editForm.pid,
          },
        ],
      },
      'post'
    )
    .then((response) => {
      // data.value = response.data
      getList()
      editVisible.value = false
      proxy.$message.success(l.value.editSuccess)
    })
    .catch((error) => {
      console.error('Error updating form:', error)
      proxy.$message.error(error.response.data.message || l.value.updateFailed)
    })
    .finally(() => {
      isEditSubmitting.value = false
    })
}

const addForm = () => {
  addFormVisible.value = true
}

const resetFormAdd = () => {
  Object.assign(form, {
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
  })
  form.manufacture_id = ''
  form.name_en = ''
  dialogSelectManufacture.value = false
  addFormVisible.value = false
}

const addCancel = (formName) => {
  addFormVisible.value = false
  resetFormAdd()
}

const submit = (formName) => {
  const issue_type = form.issue_type
  const audit_explanation = form.audit_explanation
  const corrective_action_plan = form.corrective_action_plan
  const corrective_date = form.corrective_date
  const subheader = form.subheader
  const code_provision = form.code_provision
  const corrective_principal = form.corrective_principal
  const survey_year = form.survey_year
  const rec_status = form.rec_status
  const is_valid = form.is_valid
  const manufacture_id = form.manufacture_id

  if (!issue_type || !audit_explanation || !corrective_action_plan || !corrective_date || !subheader || !code_provision || !corrective_principal) {
    proxy.$message.error(l.value.pleaseCompleteAllFields)
    return
  }

  if (!manufacture_id) {
    proxy.$message.error(l.value.pleaseSelectManufacture)
    return
  }

  if (form.addFileList.length > 0) {
    form.addFileList.forEach((file) => {
      form.attachments.push({
        file_name: file.name,
        file_suffix: file.name.split('.').pop(),
        file_url: file.url,
      })
    })
  }

  isSubmitting.value = true

  proxy
    .$request(
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
      // data.value = response.data
      getList()
      resetFormAdd()
      addFormVisible.value = false
      proxy.$message.success(l.value.addSuccess)
    })
    .catch((error) => {
      console.error('Error submitting form:', error)
      proxy.$message.error(error.response.data.message || l.value.submitFailed)
    })
    .finally(() => {
      isSubmitting.value = false
    })
}

const viewRectification = (row) => {
  proxy
    .$request(
      api.baseUrl + '/Compliance/complianceIssues/getRectificationInfo',
      {
        issueId: row.id,
      },
      'get'
    )
    .then((response) => {
      if (response.httpCode === 200) {
        rectificationData.value = response.data
        rectificationVisible.value = true
      } else {
        proxy.$message.error(response.message || l.value.loadDataFailed)
      }
    })
    .catch((error) => {
      proxy.$message.error(error.response?.data?.message || l.value.loadDataFailed)
    })
}

const getStatusType = (status) => {
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
}

const getStatusText = (status) => {
  switch (status) {
    case 'open':
      return l.value.statusOpen
    case 'in_progress':
      return l.value.statusInProgress
    case 'completed':
      return l.value.statusCompleted
    case 'closed':
      return l.value.statusClosed
    default:
      return status
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const previewFile = (attachment) => {
  file.fileUrl = api.baseUrl + '/' + attachment.file_url
  fileDialogVisible.value = true
}

const getManufactureList = () => {
  manufacture.loading = true
  const params = {
    page: manufacture.query.page,
    pageSize: manufacture.query.pageSize,
    manufacture_name: manufacture.query.manufacture_name,
  }
  proxy
    .$request(api.baseUrl + '/Compliance/complianceManufacturer/getlist', params, 'get')
    .then((response) => {
      console.log('✅ API Response:', response)
      const tableData = response.data.list || []
      const total = response.data.total || tableData.length

      manufacture.tableData = tableData
      manufacture.total = total

      console.log('✅ Updated tableData:', manufacture.tableData)
      console.log('✅ Updated total:', manufacture.total)
    })
    .catch((error) => {
      console.error('❌ Error fetching manufacturers:', error)
      proxy.$message.error(error.response?.data?.message || l.value.loadDataFailed)
    })
    .finally(() => {
      manufacture.loading = false
    })
}

const selectManufacture = (index, item) => {
  form.manufacture_id = item.manufacture_id
  form.name_en = item.name_en
  dialogSelectManufacture.value = false
}

const exportExcel = () => {
  proxy
    .$request(
      api.baseUrl + '/Compliance/complianceIssues/getList',
      {
        manufacture_name: formInline.manufacture_name,
        issues_type: formInline.issues_type,
        issues_desc: formInline.issues_desc,
        suggest: formInline.suggest,
        corrective_date: formInline.corrective_date,
        corrective_principal: formInline.corrective_principal,
        query: query,
      },
      'get'
    )
    .then((r) => {
      if (r.data.list.length == 0) {
        proxy.$alert('暂无数据', '提示', {
          confirmButtonText: '确定',
          callback: (action) => {},
        })
        return
      }
      const exprotList = r.data.list
      console.log(exprotList)

      function insertAndExtractArrays(objArray) {
        objArray.forEach((obj) => {
          if (obj.detail && Array.isArray(obj.detail)) {
            obj.detail.forEach((detailObj) => {
              if (detailObj !== null && typeof detailObj === 'object') {
                detailObj.name_zh = obj.name_zh
              }
            })
          }
        })
        const arrays = []

        function recurse(item) {
          if (Array.isArray(item)) {
            arrays.push(...item)
          } else if (item !== null && typeof item === 'object') {
            for (const key in item) {
              if (item.hasOwnProperty(key)) {
                recurse(item[key])
              }
            }
          }
        }
        objArray.forEach((obj) => recurse(obj))
        return arrays
      }
      const extractedArrays = insertAndExtractArrays(exprotList)
      console.log(extractedArrays)
      import('@/vendor/Export2Excel').then((excel) => {
        const filterVal = table.column.map((item) => {
          return item.key
        })
        const tHeader = table.column.map((item) => {
          return item.label || item.key
        })
        const data = extractedArrays.map((v) => filterVal.map((j) => v[j]))
        console.log(data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: l.value.xlsxImproveManageName + '_' + dayjs().format('YYYYMMDD'),
        })
        // exportLoading.value = false // exportLoading is not defined in refs
      })
    })
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

const checkFile = (row) => {
  fileTableVisable.value = true
  file.list = row.attchments
}

const getFilePreview = (url) => {
  const urls = api.baseUrl + '/' + url
  console.log(urls)
  file.fileUrl = urls
  fileDialogVisible.value = true
}

const recEmail = () => {
  console.log('aa')
  recEmailVisible.value = true
  getRoleList()
  getRoleEmail()
}

const addRoleItem = (row) => {
  console.log(row)
  surveyEmail.rec_issues = '1'
  surveyEmail.role_id = row.role_id
  proxy
    .$confirm(l.value.confirmAddRole, l.value.dueDiligence, {
      confirmButtonText: c.value.confirm,
      cancelButtonText: c.value.cancel,
      type: 'warning',
    })
    .then(() => {
      proxy
        .$request(api.baseUrl + '/Compliance/complianceIssues/updateIssuesEmail', surveyEmail, 'post')
        .then((r) => {
          console.log(r)
          proxy.$message({
            type: 'success',
            message: c.value.success,
          })
          getRoleEmail()
        })
        .catch(() => {
          proxy.$message({
            type: 'error',
            message: c.value.fail,
          })
        })
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: c.value.cancel,
      })
    })
}

const deleteRoleItem = (row) => {
  console.log(row)
  surveyEmail.rec_issues = '0'
  surveyEmail.role_id = row.role_id
  proxy
    .$confirm(l.value.confirmAddRole, l.value.dueDiligence, {
      confirmButtonText: c.value.confirm,
      cancelButtonText: c.value.cancel,
      type: 'warning',
    })
    .then(() => {
      proxy
        .$request(api.baseUrl + '/Compliance/complianceIssues/updateIssuesEmail', surveyEmail, 'post')
        .then((r) => {
          console.log(r)
          proxy.$message({
            type: 'success',
            message: c.value.success,
          })
          getRoleEmail()
        })
        .catch(() => {
          proxy.$message({
            type: 'error',
            message: c.value.fail,
          })
        })
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: c.value.cancel,
      })
    })
}

const sendRoleEmail = () => {
  console.log(recEmailList.distanceTime)
  proxy
    .$confirm(l.value.confirmSendEmail, l.value.improvedManagement, {
      confirmButtonText: c.value.confirm,
      cancelButtonText: c.value.cancel,
      type: 'warning',
    })
    .then(() => {
      proxy
        .$request(api.baseUrl + '/Compliance/complianceIssues/roleEmail', { distanceTime: recEmailList.distanceTime }, 'post')
        .then((r) => {
          console.log(r)
          proxy.$message({
            type: 'success',
            message: c.value.success,
          })
        })
        .catch(() => {
          proxy.$message({
            type: 'error',
            message: c.value.fail,
          })
        })
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: c.value.cancel,
      })
    })
}

const onFileChange = (e) => {
  uploadQuery.file = e.target.files[0]
  if (!uploadQuery.file) {
    alert('请选择一个文件')
    return
  }
}

const uploadExcel = () => {
  if (!uploadQuery.file) {
    alert('请选择一个文件')
    return
  }

  let formData = new FormData()
  formData.append('file', uploadQuery.file)

  proxy
    .$request(proxy.$api.baseUrl + '/Compliance/complianceIssues/uploadIssues', formData, 'post')
    .then((r) => {
      console.log(r)
    })
    .catch((e) => {
      proxy.$message.error(e)
    })
}

const addFile = (e) => {
  console.log(e)
  form.addFileList.push(e.target.files[0])
  let etf = e.target.files
  console.log(form.addFileList)
  fileU(etf)
    .then((fileInfos) => {
      console.log(fileInfos)
      form.fileList.push(fileInfos[0])
      form.addfile = fileInfos[0]
      console.log(form.fileList)
      submmitfile(form.addfile)
    })
    .catch((error) => {
      proxy.$message({
        type: 'info',
        message: '添加失败',
      })
    })
}

const removeAddClick = (row, index) => {
  form.fileList.splice(index, 1)
  form.addFileList.splice(index, 1)
  if (addfileinput.value) addfileinput.value.value = ''
  if (form.attachments && form.attachments.length > 0) {
    form.attachments.splice(index, 1)
  }
}

const submmitfile = (fileList) => {
  console.log(fileList.attachment_type)
  console.log(fileList)
  console.log(form.addFileList)
  const formData = new FormData()
  formData.append('file', form.addFileList[0])
  formData.append('attachment_type', fileList.attachment_type)
  proxy
    .$request(api.baseUrl + '/Compliance/complianceAttachments/uploadAttachment', formData, 'post')
    .then((r) => {
      r.data.forEach((e) => (e.attachment_type = '1'))
      form.attachments.push(r.data[0])
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: '附件添加失败',
      })
      throw new Error('附件上传失败')
    })
}

const fileU = (fileList) => {
  return new Promise((resolve, reject) => {
    const fileInfos = []
    const file = fileList[0]
    const file_name = file.name
    const fileExtension = getFileExtension(file_name)
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
}

const exportTemplate = () => {
  axios({
    headers: {
      token: getToken(),
    },
    responseType: 'blob',
    method: 'post',
    url: api.baseUrl + '/Compliance/complianceIssues/uploadIssuesTemplate',
  }).then((r) => {
    try {
      const blob = new Blob([r.data], {
        type: 'application/octet-stream;',
      })
      const elink = document.createElement('a')
      elink.download = l.value.xlsxImproveName
      elink.style.display = 'none'
      elink.href = URL.createObjectURL(blob)
      document.body.appendChild(elink)
      elink.click()
      URL.revokeObjectURL(elink.href)
      document.body.removeChild(elink)
    } catch (error) {
      proxy.$message.error('文件导出失败')
    }
  })
}

const getRoleList = () => {
  proxy
    .$request(api.role + 'getlist', roleList.query)
    .then((r) => {
      console.log(r)
      roleList.list = r.data.list
      roleList.total = r.data.total
    })
    .catch(() => {})
}

const getRoleEmail = () => {
  proxy
    .$request(api.baseUrl + '/Compliance/complianceIssues/getRoleEmailList', {})
    .then((r) => {
      recEmailList.list = r.data.list
      recEmailList.total = r.data.total
    })
    .catch(() => {})
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
