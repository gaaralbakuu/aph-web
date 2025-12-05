<template>
  <div class="h-full flex flex-col">
    <input type="file" ref="fileInput" style="display: none" @change="fileChange" />
    <div class="p-3 border-b border-solid border-gray-100 flex flex-col gap-[1px]">
      <div class="text-2xl font-bold text-black">Tệp tin cơ bản</div>
      <div class="text-gray-500 text-sm">Danh sách các hồ sơ của đối tác</div>
    </div>
    <!-- Search Section -->
    <div class="flex gap-3 flex-wrap p-3">
      <div class="relative h-8">
        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
            <path d="m8 13 4-7 4 7" />
            <path d="M9.1 11h5.7" />
          </svg>
        </div>
        <input type="text" :placeholder="$l.manufacture_name" v-model="manufacturer.query.manufacture_name" class="h-8 pr-3 pl-10 border border-gray-200 rounded-md focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white rounded-md" />
      </div>
      <div class="relative h-8">
        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
          </svg>
        </div>
        <input type="text" :placeholder="$l.addr" v-model="manufacturer.query.addr" class="h-8 pr-3 pl-10 border border-gray-200 rounded-md focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white rounded-md" />
      </div>
      <div class="relative h-8">
        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
        <input type="text" :placeholder="$l.legal_person" v-model="manufacturer.query.legal_person" class="h-8 pr-3 pl-10 border border-gray-200 rounded-md focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white rounded-md" />
      </div>
      <!-- <div class="relative h-8">
        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
        </div>
        <input type="text" :placeholder="$l.fileName" v-model="manufacturer.query.fileName" class="h-8 pr-3 pl-10 border border-gray-200 rounded-md focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white rounded-md" />
      </div> -->
      <div class="relative h-8">
        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-5 h-5">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </div>
        <input type="text" :placeholder="$l.produce_processes" v-model="manufacturer.query.produce_processes" class="h-8 pr-3 pl-10 border border-gray-200 rounded-md focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white rounded-md" />
      </div>
      <div class="relative h-8">
        <div class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-5 h-5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6Z" />
          </svg>
        </div>
        <select v-model="manufacturer.query.requestor_facility_type" :placeholder="$l.requestor_facility_type" class="pl-10 h-8 border border-gray-200 rounded-md focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white rounded-md w-full appearance-none">
          <option value="" disabled selected hidden>{{ $l.requestor_facility_type }}</option>
          <option value="T1SC">T1SC</option>
          <option value="T2">T2</option>
        </select>
      </div>
      <!-- Search buttons -->
      <div class="flex gap-3">
        <button
          v-show="showAuth.m_search"
          @click="getList"
          class="h-8 rounded flex items-center bg-black text-white px-4 hover:bg-blue-600 transition-colors duration-150"
        >
          {{ $c.queryButton }}
        </button>
        <button
          v-show="showAuth.m_search"
          @click="reset"
          class="h-8 rounded flex items-center bg-white text-black border border-solid border-gray-200 px-4 hover:bg-gray-100 hover:border-blue-400 transition-colors duration-150"
        >
          {{ $c.reset }}
        </button>
      </div>
    </div>

    <!-- Action Bar -->
    <div class="flex items-center justify-between p-3 bg-white border-b border-gray-100">
      <div class="flex items-center gap-3">
        <button 
          v-show="showAuth.m_add" 
          @click="add" 
          class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition duration-200 ease-in-out transform hover:scale-105"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {{ $c.create }}
        </button>
        
        <button 
          v-show="showAuth.m_export" 
          @click="exportExcel" 
          class="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg shadow-sm transition duration-200 ease-in-out transform hover:scale-105"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ $c.export }}
        </button>
        
        <button 
          @click="visabled.uploadFile = true" 
          class="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg shadow-sm transition duration-200 ease-in-out transform hover:scale-105"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          {{ $c.m_upload }}
        </button>
        
        <button 
          @click="exportTemplate" 
          class="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg shadow-sm transition duration-200 ease-in-out transform hover:scale-105"
        >
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          {{ $l.downloadTemplate }}
        </button>
      </div>
    </div>
    <!-- Table Section -->
    <div class="flex-1 p-3">
        <manufacturer-table :data="manufacturer.list" :isLoading="manufacturer.loading" @action="handleTableAction" @row-click="handleRowClick" class="main-table" />
    </div>

    <!-- Pagination -->
    <div class="p-3">
      <z-pagination :pagination="pagination" :total="manufacturer.query.total" :page.sync="manufacturer.query.curPage" :limit.sync="manufacturer.query.pageSize" @change="getList" class="custom-pagination" />
    </div>
    <!-- Create/Edit Dialog -->
    <CustomDialog :title="manufacturer.data.id ? $c.edit : $c.create" :visible.sync="manufacturer.addOrEditFormVisible" :clickOutside="false" width="90%" custom-class="scrollable-dialog manufacturer-form-dialog">
      <template #content>
        <div class="form-container">
          <!-- Basic Information Section -->
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">
                <i class="el-icon-info"></i>
                {{ $l.basic }}
              </h3>
            </div>
            <div class="form-content">
              <div class="form-row">
                <div class="form-group">
                  <label class="form-label required">{{ $l.manufacture_name_CN }}</label>
                  <el-input :placeholder="$l.input_manufacture_name_CN" v-model="manufacturer.data.name_zh" clearable class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label required">{{ $l.manufacture_name_US }}</label>
                  <el-input :placeholder="$l.input_manufacture_name_US" v-model="manufacturer.data.name_en" clearable class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">{{ $l.legal_person }}</label>
                  <el-input :placeholder="$l.input_legal_person" v-model="manufacturer.data.legal_person" clearable class="form-input" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">{{ $l.partner_country }}</label>
                  <el-input :placeholder="$l.input_partner_country" v-model="manufacturer.data.country" clearable class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">{{ $l.customs_number }}</label>
                  <el-input :placeholder="$c.input" v-model="manufacturer.data.customs_number" clearable class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">{{ $l.biz_license_number }}</label>
                  <el-input :placeholder="$c.input" v-model="manufacturer.data.biz_license_number" clearable class="form-input" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">{{ $l.requestor_facility_type }}</label>
                  <div class="radio-group-container">
                    <el-radio-group v-model="manufacturer.data.requestor_facility_type" class="custom-radio-group">
                      <el-radio label="T1SC">T1SC</el-radio>
                      <el-radio label="T2">T2</el-radio>
                    </el-radio-group>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">{{ $l.export_business }}</label>
                  <div class="radio-group-container">
                    <el-radio-group v-model="manufacturer.data.is_export_biz" class="custom-radio-group">
                      <el-radio label="Y">{{ $c.Y }}</el-radio>
                      <el-radio label="N">{{ $c.N }}</el-radio>
                    </el-radio-group>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">{{ $l.is_involve_product }}</label>
                  <div class="radio-group-container">
                    <el-radio-group v-model="manufacturer.data.is_involve_product" class="custom-radio-group">
                      <el-radio label="Y">{{ $l.product }}</el-radio>
                      <el-radio label="N">{{ $l.exploit }}</el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">{{ $l.cooperation_start_date }}</label>
                  <el-date-picker v-model="manufacturer.data.cooperation_start_date" type="datetime" :placeholder="$c.input" class="form-input date-picker" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
                </div>
                <div class="form-group">
                  <label class="form-label">{{ $l.cooperation_end_date }}</label>
                  <el-date-picker v-model="manufacturer.data.cooperation_end_date" type="datetime" :placeholder="$c.input" class="form-input date-picker" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" />
                </div>
                <div class="form-group">
                  <label class="form-label">{{ $l.is_alidas_producer }}</label>
                  <div class="radio-group-container">
                    <el-radio-group v-model="manufacturer.data.is_alidas_producer" class="custom-radio-group">
                      <el-radio label="Y">{{ $c.Y }}</el-radio>
                      <el-radio label="N">{{ $c.N }}</el-radio>
                    </el-radio-group>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">{{ $l.cooperation_group_name }}</label>
                  <el-input :placeholder="$c.input" v-model="manufacturer.data.cooperation_group_name" clearable class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">{{ $l.is_alidas_authorized }}</label>
                  <div class="radio-group-container">
                    <el-radio-group v-model="manufacturer.data.is_alidas_authorized" class="custom-radio-group">
                      <el-radio label="Y">{{ $c.Y }}</el-radio>
                      <el-radio label="N">{{ $c.N }}</el-radio>
                    </el-radio-group>
                  </div>
                </div>
                <div class="form-group">
                  <label class="form-label">{{ $l.requestor_facility_code }}</label>
                  <el-input :placeholder="$c.input" v-model="manufacturer.data.requestor_facility_code" clearable class="form-input" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">{{ $l.requestor_contact_name }}</label>
                  <el-input :placeholder="$c.input" v-model="manufacturer.data.requestor_contact_name" clearable class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">{{ $l.monthly_produce_quantity }}</label>
                  <el-input-number v-model="manufacturer.data.monthly_produce_quantity" :min="1" class="form-input number-input" controls-position="right" />
                </div>
                <div class="form-group">
                  <label class="form-label">{{ $l.employee_num }}</label>
                  <el-input-number v-model="manufacturer.data.employee_num" :min="1" class="form-input number-input" controls-position="right" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">{{ $l.vendor_code }}</label>
                  <el-input :placeholder="$l.input_vendor_code" v-model="manufacturer.data.vendor_code" clearable class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">{{ $l.unique_identifier }}</label>
                  <el-input :placeholder="$l.input_unique_identifier" v-model="manufacturer.data.unique_identifier" clearable class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">{{ $l.ffc_id }}</label>
                  <el-input :placeholder="$l.input_ffc_id" v-model="manufacturer.data.ffc_id" clearable class="form-input" />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">{{ $l.sap_code }}</label>
                  <el-input :placeholder="$l.input_sap_code" v-model="manufacturer.data.sap_code" clearable class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">{{ $l.classification }}</label>
                  <el-input :placeholder="$l.input_classification" v-model="manufacturer.data.classification" clearable class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">{{ $l.authorization_status }}</label>
                  <el-select v-model="manufacturer.data.authorization_status" placeholder="Select" class="form-input">
                    <el-option v-for="item in options_authorization_status" :key="item.value" :label="item.label" :value="item.value" />
                  </el-select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label class="form-label">{{ $l.compliance_warning_letter }}</label>
                  <el-input :placeholder="$l.input_compliance_warning_letter" v-model="manufacturer.data.compliance_warning_letter" clearable class="form-input" />
                </div>
                <div class="form-group">
                  <label class="form-label">{{ $l.types_of_orders }}</label>
                  <el-input :placeholder="$l.input_types_of_orders" v-model="manufacturer.data.types_of_orders" clearable class="form-input" />
                </div>
                <div class="form-group"></div>
              </div>
            </div>
          </div>

          <!-- Contact Information Section -->
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">
                <i class="el-icon-phone"></i>
                {{ $l.contact_info }}
              </h3>
              <el-button type="primary" size="small" icon="el-icon-plus" @click="contactInfoList" class="add-section-button">
                {{ $c.addData }}
              </el-button>
            </div>
            <div class="table-container">
              <z-table :list="contactInfo.list" :tableProps="tableProps" :columns="contactInfo.columns" @deleteItem="contactInfoDeleteItem" class="form-table">
                <template v-slot:operation="v">
                  <el-button type="text" size="small" class="delete-action-button" @click="contactInfoDeleteItem(v.row, v.$index)">
                    <i class="el-icon-delete"></i>
                    {{ $c.delete }}
                  </el-button>
                </template>
              </z-table>
            </div>
          </div>

          <!-- Address & Processes Section -->
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">
                <i class="el-icon-location-outline"></i>
                {{ $l.addr_and_processes }}
              </h3>
              <el-button type="primary" size="small" icon="el-icon-plus" @click="addressList" class="add-section-button">
                {{ $c.addData }}
              </el-button>
            </div>
            <div class="table-container">
              <z-table :list="address.list" :tableProps="tableProps" :columns="address.columns" @deleteItem="addressDeleteItem" class="form-table">
                <template v-slot:operation="v">
                  <el-button type="text" size="small" class="delete-action-button" @click="addressDeleteItem(v.row, v.$index)">
                    <i class="el-icon-delete"></i>
                    {{ $c.delete }}
                  </el-button>
                </template>
              </z-table>
            </div>
          </div>

          <!-- Compliance Evidence Section -->
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">
                <i class="el-icon-document"></i>
                {{ $l.compliance_evidence }}
              </h3>
              <el-button type="primary" size="small" icon="el-icon-plus" @click="createFileData" class="add-section-button">
                {{ $c.add_attachments }}
              </el-button>
            </div>
            <div class="table-container">
              <z-table :list="attachment.list" :tableProps="tableProps" :columns="attachment.columns" @deleteItem="attachmentDeleteItem" class="form-table">
                <template v-slot:operation="v">
                  <el-button type="text" size="small" class="delete-action-button" @click="attachmentDeleteItem(v.row, v.$index)">
                    <i class="el-icon-delete"></i>
                    {{ $c.delete }}
                  </el-button>
                </template>
              </z-table>
            </div>
          </div>
        </div>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="manufacturer.addOrEditFormVisible = false" class="dialog-cancel-button">
          {{ $c.cancel }}
        </el-button>
        <el-button type="primary" @click="OPenManufacturer" class="dialog-confirm-button">
          {{ $c.confirm }}
        </el-button>
      </span>
    </CustomDialog>
    <!-- 确认信息窗口 -->
    <el-dialog :title="$l.confirm_info" :visible.sync="manufacturer.inforFormVisible" width="40%">
      <el-descriptions :title="$l.basic">
        <el-descriptions-item :label="$l.manufacture_name_CN">
          {{ manufacturer.data.name_zh }}
        </el-descriptions-item>
        <el-descriptions-item :label="$l.manufacture_name_US">
          {{ manufacturer.data.name_en }}
        </el-descriptions-item>
        <el-descriptions-item :label="$l.requestor_facility_name">
          {{ manufacturer.data.requestor_facility_type }}
        </el-descriptions-item>
        <el-descriptions-item :label="$l.legal_person">
          {{ manufacturer.data.legal_person }}
        </el-descriptions-item>
        <el-descriptions-item :label="$l.partner_country">
          {{ manufacturer.data.country }}
        </el-descriptions-item>
        <el-descriptions-item :label="$l.export_business">
          {{ manufacturer.data.is_export_biz }}
        </el-descriptions-item>
        <el-descriptions-item :label="$l.customs_number">
          {{ manufacturer.data.customs_number }}
        </el-descriptions-item>
        <el-descriptions-item :label="$l.biz_license_number">
          {{ manufacturer.data.biz_license_number }}
        </el-descriptions-item>
        <el-descriptions-item :label="$l.is_involve_product">
          {{ manufacturer.data.is_involve_product }}
        </el-descriptions-item>
        <el-descriptions-item :label="$l.cooperation_start_date">
          {{ Sdate }}
        </el-descriptions-item>
        <!-- <el-descriptions-item :label="$l.cooperation_end_date">{{
          Edate
        }}</el-descriptions-item> -->
        <el-descriptions-item :label="$l.is_alidas_producer">
          {{ manufacturer.data.is_alidas_producer }}
        </el-descriptions-item>
        <!-- <el-descriptions-item :label="$l.cooperation_company_ownership">{{
          manufacturer.data.cooperation_company_ownership
        }}</el-descriptions-item>
        <el-descriptions-item :label="$l.cooperation_group_name">{{
          manufacturer.data.cooperation_group_name
        }}</el-descriptions-item> -->
        <el-descriptions-item :label="$l.is_alidas_authorized">
          {{ manufacturer.data.is_alidas_authorized }}
        </el-descriptions-item>
        <el-descriptions-item :label="$l.requestor_facility_name">
          {{ manufacturer.data.requestor_facility_name }}
        </el-descriptions-item>
        <el-descriptions-item :label="$l.requestor_contact_name">
          {{ manufacturer.data.requestor_contact_name }}
        </el-descriptions-item>
        <el-descriptions-item :label="$l.monthly_produce_quantity">
          {{ manufacturer.data.monthly_produce_quantity }}
        </el-descriptions-item>
        <el-descriptions-item :label="$l.employee_num">
          {{ manufacturer.data.employee_num }}
        </el-descriptions-item>
        <el-descriptions-item :label="$l.requestor_facility_code">
          {{ manufacturer.data.requestor_facility_code }}
        </el-descriptions-item>
        <el-descriptions-item label="手动输入的ID">
          {{ manufacturer.data.manual_input_id }}
        </el-descriptions-item>
        <el-descriptions-item :label="$l.vendor_code">
          {{ manufacturer.data.vendor_code }}
        </el-descriptions-item>
        <el-descriptions-item :label="$l.unique_identifier">
          {{ manufacturer.data.unique_identifier }}
        </el-descriptions-item>
        <el-descriptions-item :label="$l.ffc_id">
          {{ manufacturer.data.ffc_id }}
        </el-descriptions-item>
        <el-descriptions-item :label="$l.sap_code">
          {{ manufacturer.data.sap_code }}
        </el-descriptions-item>
        <el-descriptions-item :label="$l.classification">
          {{ manufacturer.data.classification }}
        </el-descriptions-item>
        <el-descriptions-item :label="$l.authorization_status">
          {{ manufacturer.data.authorization_status }}
        </el-descriptions-item>
        <el-descriptions-item :label="$l.compliance_warning_letter">
          {{ manufacturer.data.compliance_warning_letter }}
        </el-descriptions-item>
        <el-descriptions-item :label="$l.types_of_orders">
          {{ manufacturer.data.types_of_orders }}
        </el-descriptions-item>
      </el-descriptions>
      <!-- <el-descriptions :title="$l.contact_infos" :column="4">
        <el-descriptions-item :label="$l.contact_name">{{
          manufacturer.data.contact_name
        }}</el-descriptions-item>
        <el-descriptions-item :label="$l.contact_job_title">{{
          manufacturer.data.contact_job_title
        }}</el-descriptions-item>
        <el-descriptions-item :label="$l.contact_phone">{{
          manufacturer.data.contact_phone
        }}</el-descriptions-item>
        <el-descriptions-item :label="$l.contact_email">{{
          manufacturer.data.contact_email
        }}</el-descriptions-item>
      </el-descriptions> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="manufacturer.inforFormVisible = false">
          {{ $c.cancel }}
        </el-button>
        <el-button type="primary" @click="submmitManufacturer">
          {{ $c.confirm }}
        </el-button>
      </span>
    </el-dialog>

    <!-- 合规联系人信息 -->
    <el-dialog :title="$l.contact_info" @submmit="contactInfoSubmmit" :visible.sync="contactInfo.dialogFormVisible" width="50%">
      <el-form :model="contactInfo.data" label-position="top" inline style="border-radius: 2px" :rules="rulesRules">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$l.contact_name">
              <el-input :placeholder="$l.input" v-model="contactInfo.data.contact_name" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$l.contact_job_title">
              <el-input :placeholder="$l.input" v-model="contactInfo.data.contact_job_title" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$l.contact_phone" prop="contactPhone">
              <el-input :placeholder="$l.input" v-model="contactInfo.data.contact_phone" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$l.contact_email" prop="contactEmail">
              <el-input :placeholder="$l.input" v-model="contactInfo.data.contact_email" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="contactInfo.dialogFormVisible = false">
          {{ $t('common').cancel }}
        </el-button>
        <el-button type="primary" @click="contactInfoSubmmit">
          {{ $t('common').confirm }}
        </el-button>
        <slot name="operation"></slot>
      </span>
    </el-dialog>

    <!-- 地址窗口 -->
    <z-form-dialog :name="$l.addr_and_processes" :data="address.data" :formProps="formProps" :fields="address.fields" @submmit="addressSubmmit" :submmitLoading="submmitLoading" :visible.sync="address.dialogFormVisible"></z-form-dialog>
    <!-- 附件窗口 -->
    <el-dialog :title="$l.add_attachments" :visible.sync="attachment.dialogFormVisible" width="30%">
      <el-form ref="form">
        <el-form-item label="">
          <el-button type="primary" @click="selectFile">
            {{ $l.selectFile }}
          </el-button>
          <div class="text item">
            {{ attachment.fileList.file.name }}
          </div>
          <div>
            <progress v-if="this.attachment.uploadProgress > 0" :value="this.attachment.uploadProgress" max="100"></progress>
          </div>
        </el-form-item>
        <el-form-item :label="$l.fileName">
          <el-input :placeholder="$l.input_fileName" v-model="attachment.fileList.file.name" :disabled="true" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item :label="$l.fileType">
          <el-select :placeholder="$l.choose" style="width: 300px" v-model="attachment.fileList.attachment_type">
            <el-option v-for="item in attachment.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div style="float: right">
            <el-button @click="attachment.dialogFormVisible = false">
              {{ $c.cancel }}
            </el-button>
            <el-button type="primary" @click="attachmentSubmmit">
              {{ $c.confirm }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 地址信息 -->
    <el-dialog :title="$l.addr_and_processes" :visible.sync="address.dialogTableVisible2" width="30%">
      <el-table :data="address.list">
        <el-table-column property="address_zh" :label="$l.address_zh"></el-table-column>
        <el-table-column property="address_en" :label="$l.address_en"></el-table-column>
        <el-table-column property="own_processes" :label="$l.own_processes"></el-table-column>
        <el-table-column property="match_processes" :label="$l.own_processes"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 附件信息 -->
    <el-dialog :title="$l.attachment_info" :visible.sync="attachment.dialogFormVisible2" width="30%">
      <el-table :data="attachment.list">
        <el-table-column property="file_name" :label="$l.fileName"></el-table-column>
        <el-table-column property="create_user" :label="$l.create_people"></el-table-column>
        <el-table-column property="create_time" :label="$l.create_date"></el-table-column>
        <el-table-column fixed="right" :label="$l.operation">
          <template slot-scope="scope">
            <el-button @click="checkAttachments(scope.row)" type="text" size="small">
              {{ $l.check }}
            </el-button>
            <el-button type="text" size="small" @click="downAttachments(scope.row)">
              {{ $l.down }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :visible.sync="visabled.uploadFile" width="30%">
      <div>
        <el-form style="margin-top: 20px">
          <el-form-item :label="$l.upload_file" required>
            <input type="file" accept=".xls,.xlsx" class="el-input" @change="onFileChange" ref="addfileinput" style="border: 1px solid #dcdcdc; border-radius: 5px; padding: 3px" />
          </el-form-item>
        </el-form>
        <div style="margin-top: 40px; text-align: right">
          <el-button type="primary" @click="visabled.uploadFile = false">
            {{ $c.cancel }}
          </el-button>
          <el-button type="success" @click="uploadExcel">
            {{ $c.m_upload }}
          </el-button>
        </div>
      </div>
    </el-dialog>
    <filePreviews v-if="attachment.fileUrl" :file-url="attachment.fileUrl" :visible="attachment.dialogFormVisible3" @update:visible="attachment.dialogFormVisible3 = $event"></filePreviews>

    <!-- Chi tiết modal -->
    <CustomDialog :title="$c.detail" :visible.sync="manufacturer.detailFormVisible" :clickOutside="false" width="90%" custom-class="scrollable-dialog manufacturer-detail-dialog">
      <template #content>
        <div class="form-container">
          <!-- Basic Information Section -->
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">
                <i class="el-icon-info"></i>
                {{ $l.basic }}
              </h3>
            </div>
            <div class="form-content">
              <div class="detail-descriptions">
                <el-descriptions :column="3" border>
                  <el-descriptions-item :label="$l.manufacture_name_CN">
                    {{ manufacturer.data.name_zh || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.manufacture_name_US">
                    {{ manufacturer.data.name_en || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.legal_person">
                    {{ manufacturer.data.legal_person || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.partner_country">
                    {{ manufacturer.data.country || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.customs_number">
                    {{ manufacturer.data.customs_number || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.biz_license_number">
                    {{ manufacturer.data.biz_license_number || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.requestor_facility_type">
                    {{ manufacturer.data.requestor_facility_type || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.export_business">
                    {{ manufacturer.data.is_export_biz || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.is_involve_product">
                    {{ manufacturer.data.is_involve_product || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.cooperation_start_date">
                    {{ manufacturer.data.cooperation_start_date || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.is_alidas_producer">
                    {{ manufacturer.data.is_alidas_producer || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.is_alidas_authorized">
                    {{ manufacturer.data.is_alidas_authorized || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.requestor_facility_name">
                    {{ manufacturer.data.requestor_facility_name || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.requestor_contact_name">
                    {{ manufacturer.data.requestor_contact_name || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.monthly_produce_quantity">
                    {{ manufacturer.data.monthly_produce_quantity || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.employee_num">
                    {{ manufacturer.data.employee_num || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.requestor_facility_code">
                    {{ manufacturer.data.requestor_facility_code || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.vendor_code">
                    {{ manufacturer.data.vendor_code || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.unique_identifier">
                    {{ manufacturer.data.unique_identifier || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.ffc_id">
                    {{ manufacturer.data.ffc_id || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.sap_code">
                    {{ manufacturer.data.sap_code || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.classification">
                    {{ manufacturer.data.classification || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.authorization_status">
                    {{ manufacturer.data.authorization_status || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.compliance_warning_letter">
                    {{ manufacturer.data.compliance_warning_letter || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="$l.types_of_orders">
                    {{ manufacturer.data.types_of_orders || '--' }}
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </div>
          </div>

          <!-- Contact Information Section -->
          <div class="form-section" v-if="contactInfo.list && contactInfo.list.length > 0">
            <div class="section-header">
              <h3 class="section-title">
                <i class="el-icon-user"></i>
                {{ $l.contact_info }}
              </h3>
            </div>
            <div class="table-container">
              <el-table :data="contactInfo.list" class="form-table" border>
                <el-table-column prop="contact_name" :label="$l.contact_name" min-width="120"></el-table-column>
                <el-table-column prop="contact_job_title" :label="$l.contact_job_title" min-width="120"></el-table-column>
                <el-table-column prop="contact_phone" :label="$l.contact_phone" min-width="140"></el-table-column>
                <el-table-column prop="contact_email" :label="$l.contact_email" min-width="180"></el-table-column>
              </el-table>
            </div>
          </div>

          <!-- Address & Processes Section -->
          <div class="form-section" v-if="address.list && address.list.length > 0">
            <div class="section-header">
              <h3 class="section-title">
                <i class="el-icon-location"></i>
                {{ $l.addr_and_processes }}
              </h3>
            </div>
            <div class="table-container">
              <el-table :data="address.list" class="form-table" border>
                <el-table-column prop="address_zh" :label="$l.address_zh" min-width="200"></el-table-column>
                <el-table-column prop="address_en" :label="$l.address_en" min-width="200"></el-table-column>
                <el-table-column prop="own_processes" :label="$l.own_processes" min-width="150"></el-table-column>
                <el-table-column prop="match_processes" :label="$l.match_processes" min-width="150"></el-table-column>
              </el-table>
            </div>
          </div>

          <!-- Compliance Evidence Section -->
          <div class="form-section" v-if="attachment.list && attachment.list.length > 0">
            <div class="section-header">
              <h3 class="section-title">
                <i class="el-icon-folder"></i>
                {{ $l.compliance_evidence }}
              </h3>
            </div>
            <div class="table-container">
              <el-table :data="attachment.list" class="form-table" border>
                <el-table-column prop="file_name" :label="$l.fileName" min-width="200"></el-table-column>
                <el-table-column prop="attachment_type" :label="$l.fileType" min-width="120">
                  <template slot-scope="scope">
                    <span>{{ matterType(scope.row.attachment_type) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="create_user" :label="$l.create_people" min-width="120"></el-table-column>
                <el-table-column prop="create_time" :label="$l.create_date" min-width="150"></el-table-column>
                <el-table-column :label="$c.operation" width="150" fixed="right">
                  <template slot-scope="scope">
                    <el-button @click="checkAttachments(scope.row)" type="text" size="small" class="delete-action-button">
                      {{ $l.check }}
                    </el-button>
                    <el-button type="text" size="small" @click="downAttachments(scope.row)" class="delete-action-button">
                      {{ $l.down }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="manufacturer.detailFormVisible = false" class="dialog-cancel-button">
          {{ $c.cancel }}
        </el-button>
      </span>
    </CustomDialog>
  </div>
</template>

<script>
import axios from 'axios'
import SparkMD5 from 'spark-md5'

import { getToken, localGet } from '@/utils/auth'
import { _, api, defaultConfig,initFuncs,  zForm, zFormDialog, zPagination, zTable } from '@/views/_common'

import CustomDialog from '../../_common/CustomDialog.vue'
import filePreviews from '../../_common/filePreviews.vue'
import ManufacturerTable from './ManufacturerTable.vue'

const config = Object.assign({}, _.cloneDeep(defaultConfig), {
  api: api.ComplianceManufacturer,
  apiManufacturer: api.ComplianceManufacturer + 'getlist',
  apiID: api.ComplianceManufacturer + 'getbyid',
  apiManufacturerAddrs: api.ComplianceManufacturer + 'checkManufacturerAddrs',
  apiUpdate: api.ComplianceManufacturer + 'update',
  apiDelete: api.ComplianceManufacturer + 'delete',
  apiAttachments: api.ComplianceAttachments + 'checkManufacturerAttachments',
  apiUploadAttachment: api.ComplianceAttachments + 'uploadAttachment',
  tableProps: {
    border: true,
    opsColWith: 150,
  },
})
export default {
  name: 'manufacturer',
  components: {
    zTable,
    zFormDialog,
    zPagination,
    filePreviews,
    CustomDialog,
    ManufacturerTable,
  },
  data() {
    var checkPhone = (rule, value, callback) => {
      const reg = /^(0|\+84)[1-9][0-9]{8}$/ // Số điện thoại Việt Nam
      console.log(reg.test(this.contactInfo.data.contact_phone))
      this.rulesRules.isPhone = false
      if (this.contactInfo.data.contact_phone === '') {
        callback(new Error(this.$l.input_phone))
      } else if (!reg.test(this.contactInfo.data.contact_phone)) {
        callback(new Error(this.$l.input_confirm_phone))
      } else {
        this.rulesRules.isPhone = true
        callback()
      }
    }
    var checkEmail = (rule, value, callback) => {
      const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ // 邮箱正则表达式
      this.rulesRules.isEmail = false
      if (this.contactInfo.data.contact_email === '') {
        callback(new Error(this.$l.input_email))
      } else if (!reg.test(this.contactInfo.data.contact_email)) {
        callback(new Error(this.$l.ininput_confirm_email))
      } else {
        this.rulesRules.isEmail = true
        callback()
      }
    }
    return {
      ...config,

      // Trạng thái producer: onboarding, discontinued, in use
      options_authorization_status: [
        { value: 'onboarding', label: this.$l.producer_status_onboarding },
        { value: 'discontinued', label: this.$l.producer_status_discontinued },
        { value: 'in_use', label: this.$l.producer_status_in_use },
      ],
      maxSizeInBytes: 5 * 1024 * 1024,
      fileSizeInBytes: 0,
      manufacturer: {
        list: [],
        loading: false,
        data: {
          name_zh: '',
          name_en: '',
          legal_person: '',
          contact_name: '',
          contact_phone: '',
          contact_email: '',
          contact_job_title: '',
          country: '',
          customs_number: '',
          biz_license_number: '',
          cooperation_start_date: '',
          cooperation_end_date: '',
          cooperation_company_ownership: '',
          cooperation_group_name: '',
          requestor_facility_name: '',
          requestor_facility_code: '',
          requestor_contact_name: '',
          employee_num: 0,
          monthly_produce_quantity: 0,
          is_export_biz: '',
          requestor_facility_type: '',
          is_involve_product: '',
          is_alidas_producer: '',
          is_alidas_authorized: '',
          manual_input_id: '',
          vendor_code: '',
          unique_identifier: '',
          ffc_id: '',
          sap_code: '',
          classification: '',
          authorization_status: '',
          compliance_warning_letter: '',
          types_of_orders: '',
          contactInfoList: [],
          addressList: [],
          attachment: [],
        },
        query: {
          manufacture_id: '', // 公司业务id
          addr: '',
          manufacture_name: '',
          fileName: '',
          legal_person: '',
          produce_processes: '',
          requestor_facility_type: '',
          requestor_facility_name: '',
          pageSize: 15,
          curPage: 1,
          total: 0,
        },
        addOrEditFormVisible: false,
        inforFormVisible: false,
        detailFormVisible: false,
      },
      contactInfo: {
        list: [],
        data: {},
        dialogFormVisible: false,
        dialogTableVisible2: false,
        columns: [
          {
            title: this.$l.contact_name,
            key: 'contact_name',
          },
          {
            title: this.$l.contact_job_title,
            key: 'contact_job_title',
          },
          {
            title: this.$l.contact_phone,
            key: 'contact_phone',
          },
          {
            title: this.$l.contact_email,
            key: 'contact_email',
          },
        ],
        fields: [
          {
            title: this.$l.contact_name,
            key: 'contact_name',
            span: 12,
            required: true,
          },
          {
            title: this.$l.contact_job_title,
            key: 'contact_job_title',
            span: 12,
            required: true,
          },
          {
            title: this.$l.contact_phone,
            key: 'contact_phone',
            span: 12,
            required: true,
          },
          {
            title: this.$l.contact_email,
            key: 'contact_email',
            span: 12,
            required: true,
          },
        ],
      },
      address: {
        list: [],
        data: {},
        dialogFormVisible: false,
        dialogTableVisible2: false,
        columns: [
          {
            title: this.$l.address_zh,
            key: 'address_zh',
          },
          {
            title: this.$l.address_en,
            key: 'address_en',
          },
          {
            title: this.$l.own_processes,
            key: 'own_processes',
          },
          {
            title: this.$l.match_processes,
            key: 'match_processes',
          },
        ],
        fields: [
          {
            title: this.$l.address_zh,
            key: 'address_zh',
            span: 12,
            required: true,
          },
          {
            title: this.$l.address_en,
            key: 'address_en',
            span: 12,
            required: true,
          },
          {
            title: this.$l.own_processes,
            key: 'own_processes',
            span: 12,
            required: true,
          },
          {
            title: this.$l.match_processes,
            key: 'match_processes',
            span: 12,
            required: true,
          },
        ],
      },
      attachment: {
        list: [],
        data: {},
        dialogFormVisible: false,
        dialogFormVisible2: false,
        dialogFormVisible3: false,
        fileUrl: '',
        columns: [
          {
            title: this.$l.fileName,
            key: 'file_name',
          },
          {
            title: this.$l.fileType,
            key: 'attachment_type',
            formatter: this.matterType,
          },
          {
            title: this.$l.create_people,
            key: 'create_user',
          },
          {
            title: this.$l.create_date,
            key: 'create_time',
          },
          {
            title: this.$l.modify_user,
            key: 'modify_user',
          },
          {
            title: this.$l.modify_time,
            key: 'modify_time',
          },
        ],
        options: [
          {
            value: '0A',
            label: this.$l.business_license,
          },
          {
            value: '0B',
            label: 'NDA ',
          },
          {
            value: '0C',
            label: this.$l.other_attachment,
          },
        ],
        fileList: {
          attachment_type: '',
          fileName: '',
          file: {},
        },
        divide: {
          file: null,
          chunkSize: 3 * 1024 * 1024, // 5MB
          chunks: [],
          fileHash: '',
          fileList: [],
          taskId: '',
          fileName: '',
          attachment_type: '',
        },
        uploadProgress: 0, // 上传进度
      },
      rulesRules: {
        contactPhone: [{ validator: checkPhone, trigger: 'blur' }],
        contactEmail: [{ validator: checkEmail, trigger: 'blur' }],
        isPhone: false,
        isEmail: false,
      },
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
      visabled: {
        uploadFile: false,
      },
      uploadQuery: {},
    }
  },
  methods: {
    getList() {
      this.manufacturer.loading = true
      this.$request(
        this.apiManufacturer,
        {
          manufacture_id: this.manufacturer.query.manufacture_id,
          addr: this.manufacturer.query.addr,
          manufacture_name: this.manufacturer.query.manufacture_name,
          fileName: this.manufacturer.query.fileName,
          legal_person: this.manufacturer.query.legal_person,
          produce_processes: this.manufacturer.query.produce_processes,
          requestor_facility_type: this.manufacturer.query.requestor_facility_type,
          requestor_facility_name: this.manufacturer.query.requestor_facility_name,
          pageSize: this.manufacturer.query.pageSize,
          curPage: this.manufacturer.query.curPage,
        },
        'get'
      )
        .then((r) => {
          console.log(r)
          this.manufacturer.list = r.data.list
          this.manufacturer.query.total = r.data.total
        })
        .catch((e) => {
          console.log(e)
        })
        .finally(() => {
          this.manufacturer.loading = false
        })
    },
    getDataByID(id) {
      console.log(id)
      this.$request(this.apiID, {
        id: id,
      })
        .then((r) => {
          console.log(r)
          this.manufacturer.data = r.data
          this.attachment.list = r.data.attachment
          this.address.list = r.data.addressList
          this.contactInfo.list = r.data.contactInfoList
        })
        .catch((e) => {
          console.log(e)
        })
    },
    getAddrsList(data) {
      this.$request(
        this.apiManufacturerAddrs,
        {
          id: data.id,
        },
        'get'
      )
        .then((r) => {
          this.address.list = r.data
        })
        .catch((e) => {
          console.log(e)
        })
    },
    getAttachments(id, file_type) {
      this.$request(
        this.apiAttachments,
        {
          id: id,
          file_type: file_type,
        },
        'get'
      )
        .then((r) => {
          this.attachment.list = r.data
          console.log(this.attachment.list)
        })
        .catch((e) => {
          console.log(e)
        })
    },
    reset() {
      this.manufacturer.query = {
        manufacture_id: '', // 公司业务id
        addr: '',
        manufacture_name: '',
        fileName: '',
        legal_person: '',
        produce_processes: '',
        requestor_facility_type: '',
        requestor_facility_name: '',
        pageSize: 15,
        curPage: 1,
        total: 0,
      }
      this.getList()
    },
    add() {
      (this.manufacturer.data = {
        name_zh: '',
        name_en: '',
        legal_person: '',
        contact_name: '',
        contact_phone: '',
        contact_email: '',
        contact_job_title: '',
        country: '',
        customs_number: '',
        biz_license_number: '',
        cooperation_start_date: '',
        cooperation_end_date: '',
        cooperation_company_ownership: '',
        cooperation_group_name: '',
        requestor_facility_name: '',
        requestor_facility_code: '',
        requestor_contact_name: '',
        employee_num: 0,
        monthly_produce_quantity: 0,
        is_export_biz: '',
        requestor_facility_type: '',
        is_involve_product: '',
        is_alidas_producer: '',
        is_alidas_authorized: '',
        vendor_code: '',
        unique_identifier: '',
        ffc_id: '',
        sap_code: '',
        classification: '',
        authorization_status: '',
        compliance_warning_letter: '',
        types_of_orders: '',
        contactInfoList: [],
        addressList: [],
        attachment: [],
      }),
        (this.contactInfo.data = {}),
        (this.contactInfo.list = []),
        (this.address.data = {}),
        (this.address.list = []),
        (this.attachment.data = {}),
        (this.attachment.list = []),
        (this.manufacturer.addOrEditFormVisible = true)
    },
    editItem(index, data) {
      this.getDataByID(data.id)
      this.manufacturer.addOrEditFormVisible = true
    },
    OPenManufacturer() {
      console.log(this.manufacturer.data)
      if (this.manufacturer.data.id == undefined) {
        if (this.rulesRules.isPhone && this.rulesRules.isEmail) {
          this.manufacturer.inforFormVisible = true
        } else {
          console.log(this.rulesRules.isPhone)
          console.log(this.rulesRules.isEmail)
          this.$message({
            message: this.$l.compliance_contact_error,
            type: 'info',
          })
        }
      } else {
        this.manufacturer.inforFormVisible = true
      }
    },
    submmitManufacturer() {
      this.manufacturer.data.contactInfoList = this.contactInfo.list
      this.manufacturer.data.addressList = this.address.list
      this.manufacturer.data.attachment = this.attachment.list
      console.log(this.manufacturer.data)
      this.$request(this.apiUpdate, this.manufacturer.data, 'post')
        .then((r) => {
          console.log(r)
          this.$message({
            message: this.$c.success,
            type: 'success',
          })
          this.getList()
          this.manufacturer.addOrEditFormVisible = false
          this.manufacturer.inforFormVisible = false
        })
        .catch((e) => {
          console.log(e)
          this.$message({
            message: info,
            type: 'info',
          })
        })
    },
    deleteItem(index, data) {
      console.log(data)
      this.$prompt(this.$l.delete_confirm, this.$c.oprConfirm, {
        type: 'warning',
        inputPattern: /^[Y]{1}$/i,
        inputErrorMessage: '请输入Y/y',
        confirmButtonText: this.$c.confirm,
        cancelButtonText: this.$c.cancel,
      })
        .then(() => {
          this.$request(
            this.apiDelete,
            {
              id: data.id,
            },
            'post'
          )
            .then((r) => {
              console.log(r)
              this.$message({
                type: 'success',
                message: this.$c.success,
              })
              this.getList()
            })
            .catch((e) => {
              console.log(e)
              this.$message.error(this.$l.delete_error)
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$l.cancel_delete,
          })
        })
    },
    exportExcel() {
      let lang = localGet('lang')
      let acceptLanguage = ''
      if (lang) {
        let array = lang.split('-')
        acceptLanguage = lang + ',' + array[0] + ';q=0.9'
      }
      console.log(acceptLanguage)

      axios({
        headers: {
          token: getToken(),
          'Accept-Language': acceptLanguage,
          // "Content-Type":"application/vnd.ms-excel"
        },
        responseType: 'blob',
        method: 'post',
        url: this.$api.baseUrl + '/Compliance/complianceManufacturer/exportList',
        data: this.query,
      }).then((r) => {
        let file = new FileReader()
        file.readAsText(r.data, 'utf-8')
        file.onload = function () {
          try {
            const blob = new Blob([r.data], {
              type: 'application/octet-stream;',
            })
            // 创建一个超链接，将文件流赋进去，然后实现这个超链接的单击事件
            const elink = document.createElement('a')
            elink.download = decodeURIComponent(this.$l.fileBasic_download + '.zip')
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
            this.loading = false
          } catch {
            this.$message.error(this.$l.file_export_failed)
          }
        }
      })
    },
    exportTemplate() {
      let lang = localGet('lang')
      let acceptLanguage = ''
      if (lang) {
        let array = lang.split('-')
        acceptLanguage = lang + ',' + array[0] + ';q=0.9'
      }

      axios({
        headers: {
          token: getToken(),
          'Accept-Language': acceptLanguage,
          // "Content-Type":"application/vnd.ms-excel"
        },
        responseType: 'blob',
        method: 'post',
        url: api.baseUrl + '/Compliance/complianceManufacturer/uploadManufacturerTemplate',
      }).then((r) => {
        try {
          const blob = new Blob([r.data], {
            type: 'application/octet-stream;',
          })
          // 创建一个隐藏的 <a> 元素
          const elink = document.createElement('a')
          elink.download = this.$l.file_download + '.xlsx' // 确保包含文件扩展名
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

    exportItem(row) {
      axios({
        headers: {
          token: getToken(),
          // "Content-Type":"application/vnd.ms-excel"
        },
        responseType: 'blob',
        method: 'post',
        url: this.$api.baseUrl + '/Compliance/complianceManufacturer/exportList',
        data: {
          id: row.id,
        },
      }).then((r) => {
        let file = new FileReader()
        file.readAsText(r.data, 'utf-8')
        file.onload = function () {
          try {
            const blob = new Blob([r.data], {
              type: 'application/octet-stream;',
            })
            // 创建一个超链接，将文件流赋进去，然后实现这个超链接的单击事件
            const elink = document.createElement('a')
            elink.download = decodeURIComponent('基础档案.zip')
            elink.style.display = 'none'
            elink.href = URL.createObjectURL(blob)
            document.body.appendChild(elink)
            elink.click()
            URL.revokeObjectURL(elink.href) // 释放URL 对象
            document.body.removeChild(elink)
            this.loading = false
          } catch {
            this.$message.error('文件导出失败')
          }
        }
      })
    },
    checkArrdess(index, data) {
      console.log(data.manufacture_id)
      this.getAddrsList(data)
      this.address.dialogTableVisible2 = true
    },
    check0A(index, data) {
      this.getAttachments(data.id, '0A')
      this.attachment.dialogFormVisible2 = true
    },
    check0B(index, data) {
      this.getAttachments(data.id, '0B')
      this.attachment.dialogFormVisible2 = true
    },
    check0C(index, data) {
      this.getAttachments(data.id, '0C')
      this.attachment.dialogFormVisible2 = true
    },
    checkAttachments(data) {
      this.attachment.fileUrl = api.baseUrl + '/' + data.file_url
      console.log(this.attachment.fileUrl)
      this.attachment.dialogFormVisible3 = true
    },
    downAttachments(data) {
      const url = api.baseUrl + '/' + data.file_url
      console.log(url)
      //window.open (url, "newwindow", "height=100, width=400, toolbar =no, menubar=no, scrollbars=no, resizable=no, location=no, status=no");
      window.open(url, '_blank')
    },
    // 新增合规联系人信息
    contactInfoList() {
      console.log('contactInfo')
      this.contactInfo.dialogFormVisible = true
    },
    contactInfoSubmmit() {
      console.log(this.contactInfo.data)
      if (Object.keys(this.contactInfo.data).length === 0) {
        this.$message({
          type: 'info',
          message: this.$l.info_empty_error,
        })
        return
      }
      if (this.rulesRules.isPhone && this.rulesRules.isEmail) {
        this.contactInfo.list.push(this.contactInfo.data)
        this.contactInfo.data = {}
        this.contactInfo.dialogFormVisible = false

        console.log(this.contactInfo.list)
      } else {
        console.log(this.rulesRules.isPhone)
        console.log(this.rulesRules.isEmail)
        this.$message({
          message: this.$l.phone_email_error,
          type: 'error',
        })
      }
    },
    contactInfoDeleteItem(row, index) {
      console.log(row)
      this.contactInfo.list.splice(index, 1)
    },

    addressList() {
      // 新增地址
      console.log('addressList')
      this.address.dialogFormVisible = true
    },
    addressSubmmit() {
      if (this.manufacturer.data.id != undefined) {
        this.address.data.manufacture_id = this.manufacturer.data.id
      }
      this.address.list.push(this.address.data)
      console.log(this.address.list)
      this.address.data = {}
      this.address.dialogFormVisible = false
    },
    addressDeleteItem(data, index) {
      this.address.list.splice(index, 1)
    },
    createFileData() {
      this.attachment.fileList = {
        attachment_type: '',
        fileName: '',
        file: {},
      }
      this.attachment.dialogFormVisible = true
    },
    attachmentSubmmit() {
      console.log(this.attachment.fileList)
      if (!this.attachment.fileList.file.name) {
        this.attachment.fileList.file = {}
        this.$refs.fileInput.value = ''
        return this.$message.error(this.$l.file_is_empty)
      }
      // 确定上传文件对话框
      if (this.fileSizeInBytes > this.maxSizeInBytes) {
        this.getAttachmentFlag()
      } else {
        let forData = new FormData()
        forData.append('fileName', this.attachment.fileList.fileName)
        forData.append('file', this.attachment.fileList.file)
        forData.append('attachment_type', this.attachment.fileList.attachment_type)
        this.$request(this.apiUploadAttachment, forData, 'post')
          .then((r) => {
            console.log(r.data[0])
            this.$set(r.data[0], 'attachment_type', this.attachment.fileList.attachment_type)
            this.attachment.list.push(r.data[0])
            this.$message({
              message: this.$c.oprConfirm,
              type: 'success',
            })
            this.attachment.dialogFormVisible = false
          })
          .catch((e) => {
            console.log(e)
          })
      }
    },
    /*************           用户行为  start        ****************/
    //选择上传的文件
    onFileChange(e) {
      this.uploadQuery.file = e.target.files[0]
      console.log(this.uploadQuery.file)
      if (!this.uploadQuery.file) {
        alert(this.$l.select_file)
        return
      }
    },
    //上传模板
    uploadExcel() {
      if (!this.uploadQuery.file) {
        alert(this.$l.select_file)
        return
      }

      let formData = new FormData()
      formData.append('file', this.uploadQuery.file)

      this.$request(this.$api.baseUrl + '/Compliance/complianceManufacturer/uploadManufacturer', formData, 'post')
        .then((r) => {
          console.log(r)
          this.$message({
            type: 'success',
            message: this.$l.upload_success,
          })
          this.visabled.uploadFile = false
          this.uploadQuery.file = {}
          this.$refs.addfileinput.value = ''
        })
        .catch((e) => {
          this.$message.error(e)
        })
    },
    attachmentDeleteItem(data, index) {
      console.log(data)
      this.$prompt(this.$l.prompt, this.$c.oprConfirm, {
        type: 'warning',
        inputPattern: /^[Y]{1}$/i,
        inputErrorMessage: this.$l.inputErrorMessage,
        confirmButtonText: this.$c.confirm,
        cancelButtonText: this.$c.cancel,
      })
        .then(() => {
          this.attachment.list.splice(index, 1)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$l.info,
          })
        })
    },
    selectFile() {
      this.$refs.fileInput.click()
    },
    fileChange(value) {
      console.log(value.target.files)
      this.attachment.fileList.file = value.target.files[0]

      if (value.target.files.length == 0) {
        this.attachment.fileList.file = {}
        return this.$message.error(this.$l.file_is_empty)
      }
      if (!value.target.files[0].type) {
        this.$refs.fileInput.value = ''
        return this.$message.error(this.$l.unsupported_file_type)
      }
      this.fileSizeInBytes = value.target.files[0].size
      if (this.fileSizeInBytes > this.maxSizeInBytes) {
        this.attachment.divide.file = value.target.files[0]
        this.calculateFileHash()
      }
    },

    /**
     *分块上传功能
     *   */

    // 计算文件的MD5哈希值
    async calculateFileHash() {
      const spark = new SparkMD5.ArrayBuffer()
      const fileReader = new FileReader()
      fileReader.readAsArrayBuffer(this.attachment.divide.file)
      fileReader.onload = (e) => {
        spark.append(e.target.result)
        this.attachment.divide.fileHash = spark.end()
        this.splitFile()
      }
    },

    splitFile() {
      let start = 0
      this.attachment.divide.chunks = []
      while (start < this.attachment.divide.file.size) {
        const chunk = this.attachment.divide.file.slice(start, start + this.attachment.divide.chunkSize)
        this.attachment.divide.chunks.push(chunk)
        start += this.attachment.divide.chunkSize
      }
      console.log(this.attachment.divide.chunks)
    },

    generateUUID() {
      // Public Domain/MIT
      let d = new Date().getTime()
      if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now() // use high-precision timer if available
      }
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0
        d = Math.floor(d / 16)
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
      })
    },
    getAttachmentFlag() {
      /* let mergeFile = {
        fileHash: this.attachment.divide.fileHash,
        attachment_type: this.attachment.fileList.attachment_type
      } */
      this.$request(this.$api.baseUrl + '/Compliance/complianceAttachments/getAttachmentFlag', {
        fileHash: this.attachment.divide.fileHash,
        attachment_type: this.attachment.fileList.attachment_type,
      }).then((r) => {
        if (r.data && r.data.length > 0) {
          console.log(r.data[0])
          this.$set(r.data[0], 'attachment_type', this.attachment.fileList.attachment_type)
          this.attachment.list.push(r.data[0])
          this.$message({
            message: this.$c.oprConfirm,
            type: 'success',
          })
          this.attachment.dialogFormVisible = false
        } else {
          this.uploadFile()
        }
      })
    },
    async uploadFile() {
      if (!this.attachment.fileList.attachment_type) {
        return this.$message.error(this.$l.select_file_type)
      }
      this.attachment.divide.taskId = this.generateUUID()
      let uploadedChunks = 0
      for (let i = 0; i < this.attachment.divide.chunks.length; i++) {
        const formData = new FormData()
        formData.append('id', this.attachment.divide.taskId)
        formData.append('file', this.attachment.divide.chunks[i])
        formData.append('chunkIndex', i)
        formData.append('fileHash', this.attachment.divide.fileHash)
        formData.append('fileName', this.attachment.divide.file.name)
        formData.append('fileType', this.attachment.divide.file.type)
        formData.append('totalChunks', this.attachment.divide.chunks.length)
        formData.append('attachment_type', this.attachment.fileList.attachment_type)
        await this.$request(this.$api.baseUrl + '/Compliance/complianceAttachments/AddTaskToQueue', formData, 'post').then((r) => {
          uploadedChunks++
          this.attachment.uploadProgress = Math.round((uploadedChunks / this.attachment.divide.chunks.length) * 100)
        })
      }
      await this.mergeFile()
    },

    async mergeFile() {
      try {
        let fileObj = {}

        fileObj = {
          id: this.attachment.divide.taskId,
          fileHash: this.attachment.divide.fileHash,
          totalChunks: this.attachment.divide.chunks.length,
          fileName: this.attachment.divide.file.name,
          fileType: this.attachment.divide.file.type,
          attachment_type: this.attachment.fileList.attachment_type,
        }
        console.log(fileObj)
        await this.$request(this.$api.baseUrl + '/Compliance/complianceAttachments/getTaskStatus', fileObj, 'post').then((r) => {
          this.$message({
            type: 'success',
            message: this.$c.oprConfirm,
          })
          this.attachment.list.push(r.data[0])
          this.$refs.fileInput.value = ''
          this.attachment.uploadProgress = 0
          this.attachment.dialogFormVisible = false
          console.log(r)
        })
      } catch (error) {
        this.$message({
          type: 'error',
          message: this.$l.upload_failed,
        })
      }
    },

    indexMethod(index) {
      return index + 1
    },
    matterType(row) {
      let label
      this.attachment.options.forEach((item) => {
        if (item.value == row) {
          label = item.label
        }
      })
      return label
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

    handleTableAction({ action, row }) {
      if (action === 'edit') {
        this.editItem(null, row)
      } else if (action === 'export') {
        this.exportItem(row)
      } else if (action === 'delete') {
        this.deleteItem(null, row)
      } else if (action === 'detail') {
        this.viewDetail(row)
      }
    },

    handleRowClick(row) {
      // Handle row click if needed
      console.log('Row clicked:', row)
    },

    viewDetail(row) {
      this.getDataByID(row.id)
      this.manufacturer.detailFormVisible = true
    },

    exportItem(row) {
      // Handle single row export
      console.log('Export item:', row)
    },

    // Helper methods for detail dialog
    getStatusClass(status) {
      if (!status) return 'status-default'
      switch (status.toLowerCase()) {
        case 'onboarding':
          return 'status-warning'
        case 'in_use':
          return 'status-success'
        case 'discontinued':
          return 'status-danger'
        default:
          return 'status-default'
      }
    },

    getStatusLabel(status) {
      if (!status) return '--'
      const statusMap = {
        onboarding: this.$l.producer_status_onboarding,
        in_use: this.$l.producer_status_in_use,
        discontinued: this.$l.producer_status_discontinued,
      }
      return statusMap[status.toLowerCase()] || status
    },

    getFileTypeColor(type) {
      switch (type) {
        case '0A':
          return 'success'
        case '0B':
          return 'warning'
        case '0C':
          return 'info'
        default:
          return ''
      }
    },
  },
  created() {
    this.getList()
    this.getUserAuth()
  },
  computed: {
    Sdate() {
      return this.manufacturer.data.cooperation_start_date.toLocaleString()
    },
    Edate() {
      return this.manufacturer.data.cooperation_end_date.toLocaleString()
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
.el-button + .el-button {
  margin-left: 0px !important;
}
</style>
