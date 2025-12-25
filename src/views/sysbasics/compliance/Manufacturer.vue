<template>
  <div class="h-full flex flex-col overflow-hidden">
    <input type="file" ref="fileInput" style="display: none" @change="fileChange" />
    <div class="p-3 border-b border-solid border-gray-100 flex flex-col gap-[1px]">
      <div class="text-2xl font-bold text-black">{{ l.title }}</div>
      <div class="text-gray-500 text-sm">{{ l.description }}</div>
    </div>
    <!-- Search Section -->
    <div class="flex gap-3 flex-wrap justify-between p-3">
      <div class="flex gap-3 flex-wrap">
        <div class="relative h-9 flex items-center gap-2 mr-5">
          <div class="flex bg-gray-100 p-0.5 rounded h-9">
            <button :class="['h-full px-4 rounded font-normal transition', manufacturer.query.requestor_facility_type === '' ? 'bg-white shadow' : 'bg-gray-100 text-gray-700']" @click="manufacturer.query.requestor_facility_type = ''">
              {{ c.all }}
            </button>
            <button :class="['h-full px-4 rounded font-normal transition', manufacturer.query.requestor_facility_type === 'T1SC' ? 'bg-white shadow' : 'bg-gray-100 text-gray-700']" @click="manufacturer.query.requestor_facility_type = 'T1SC'">
              {{ l.requestor_facility_type_T1SC }}
            </button>
            <button :class="['h-full px-4 rounded font-normal transition', manufacturer.query.requestor_facility_type === 'T2' ? 'bg-white shadow' : 'bg-gray-100 text-gray-700']" @click="manufacturer.query.requestor_facility_type = 'T2'">
              {{ l.requestor_facility_type_T2 }}
            </button>
          </div>
          <div class="h-full py-2">
            <div class="border-r border-solid border-gray-200 h-full"></div>
          </div>
        </div>
        <div class="relative h-9">
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5">
              <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20" />
              <path d="m8 13 4-7 4 7" />
              <path d="M9.1 11h5.7" />
            </svg>
          </div>
          <input type="text" :placeholder="l.manufacture_name" v-model="manufacturer.query.manufacture_name" class="h-9 pr-3 pl-10 border border-gray-200 rounded-full focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
        </div>
        <div class="relative h-9">
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-5 h-5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
            </svg>
          </div>
          <input type="text" :placeholder="l.addr" v-model="manufacturer.query.addr" class="h-9 pr-3 pl-10 border border-gray-200 rounded-full focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
        </div>
        <div class="relative h-9">
          <div class="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1" stroke="currentColor" class="w-5 h-5">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
          </div>
          <input type="text" :placeholder="l.produce_processes" v-model="manufacturer.query.produce_processes" class="h-9 pr-3 pl-10 border border-gray-200 rounded-full focus:outline-none dark:bg-gray-800 dark:border-gray-700 dark:text-white" />
        </div>
      </div>
      <!-- Search buttons -->
      <div class="flex gap-3">
        <button v-show="showAuth.m_search" @click="getList" class="h-9 rounded flex items-center bg-black text-white px-4 hover:bg-gray-800 transition-colors duration-150">
          {{ c.queryButton }}
        </button>
        <button v-show="showAuth.m_search" @click="reset" class="h-9 rounded flex items-center bg-white text-black border border-solid border-gray-200 px-4 hover:bg-gray-100 hover:border-gray-400 transition-colors duration-150">
          {{ c.reset }}
        </button>
      </div>
    </div>

    <!-- Action Bar -->
    <div class="flex items-center justify-between p-3 bg-white border-b border-gray-100">
      <div class="flex items-center gap-3">
        <button v-show="showAuth.m_add" @click="add" class="inline-flex items-center h-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full px-3 shadow-sm transition duration-200 ease-in-out transform gap-1">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          {{ c.create }}
        </button>
      </div>
    </div>
    <!-- Table Section -->
    <div class="flex-1 px-3 overflow-auto">
      <manufacturer-table :data="manufacturer.list" :isLoading="manufacturer.loading" @action="handleTableAction" @row-click="handleRowClick" :page="manufacturer.query" class="main-table" />
    </div>

    <!-- Pagination -->
    <div class="p-3">
      <z-pagination :pagination="pagination" :total="manufacturer.query.total" :page.sync="manufacturer.query.page" :limit.sync="manufacturer.query.pageSize" @change="getList" class="custom-pagination" />
    </div>


    <!-- Create/Edit Dialog -->
    <CustomDialog :title="manufacturer.data.id ? c.edit : c.create" :visible.sync="manufacturer.addOrEditFormVisible" :clickOutside="false" width="90%" :maxWidth="'1080px'">
      <template #content>
        <div class="flex flex-col gap-2">
          <div class="text-xl font-black text-gray-900 dark:text-white">{{ l.basic }}</div>
          <!-- Basic Information Section -->
          <div class="">
            <div class="text-base font-semibold text-black">{{ l.partner_information }}</div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.manufacture_name_CN }}</label>
                <el-input :placeholder="l.input_manufacture_name_CN" v-model="manufacturer.data.name_zh" clearable class="w-full rounded-md" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.manufacture_name_US }}</label>
                <el-input :placeholder="l.input_manufacture_name_US" v-model="manufacturer.data.name_en" clearable class="w-full rounded-md" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.legal_person }}</label>
                <el-input :placeholder="l.input_legal_person" v-model="manufacturer.data.legal_person" clearable class="w-full rounded-md" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.partner_country }}</label>
                <el-input :placeholder="l.input_partner_country" v-model="manufacturer.data.country" clearable class="w-full rounded-md" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.cooperation_group_name }}</label>
                <el-input :placeholder="c.input" v-model="manufacturer.data.cooperation_group_name" clearable class="w-full rounded-md" />
              </div>
            </div>

            <div class="text-base font-semibold text-black mt-4">{{ l.registration_legal }}</div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.customs_number }}</label>
                <el-input :placeholder="c.input" v-model="manufacturer.data.customs_number" clearable class="w-full rounded-md" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.biz_license_number }}</label>
                <el-input :placeholder="c.input" v-model="manufacturer.data.biz_license_number" clearable class="w-full rounded-md" />
              </div>
            </div>

            <div class="text-base font-semibold text-black mt-4">{{ l.cooperation_authorization }}</div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.requestor_facility_type }}</label>
                <el-radio-group v-model="manufacturer.data.requestor_facility_type" class="flex gap-4 h-9 items-center">
                  <el-radio label="T1SC">T1SC</el-radio>
                  <el-radio label="T2">T2</el-radio>
                </el-radio-group>
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.is_involve_product }}</label>

                <el-radio-group v-model="manufacturer.data.is_involve_product" class="flex gap-4 h-9 items-center">
                  <el-radio label="Y">{{ l.product }}</el-radio>
                  <el-radio label="N">{{ l.exploit }}</el-radio>
                </el-radio-group>
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.is_alidas_authorized }}</label>
                <el-radio-group v-model="manufacturer.data.is_alidas_authorized" class="flex gap-4 h-9 items-center">
                  <el-radio label="Y">{{ c.Y }}</el-radio>
                  <el-radio label="N">{{ c.N }}</el-radio>
                </el-radio-group>
              </div>

              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.cooperation_start_date }}</label>
                <el-date-picker v-model="manufacturer.data.cooperation_start_date" type="datetime" :placeholder="c.input" class="w-full rounded-md" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.cooperation_end_date }}</label>
                <el-date-picker v-model="manufacturer.data.cooperation_end_date" type="datetime" :placeholder="c.input" class="w-full rounded-md" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" style="width: 100%" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.authorization_status }}</label>
                <el-select v-model="manufacturer.data.authorization_status" placeholder="Select" class="w-full rounded-md">
                  <el-option v-for="item in optionsAuthorizationStatus" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </div>
            </div>

            <div class="text-base font-semibold text-black mt-4">{{ l.production_operations }}</div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.requestor_facility_code }}</label>
                <el-input :placeholder="c.input" v-model="manufacturer.data.requestor_facility_code" clearable class="w-full rounded-md" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.requestor_contact_name }}</label>
                <el-input :placeholder="c.input" v-model="manufacturer.data.requestor_contact_name" clearable class="w-full rounded-md" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.monthly_produce_quantity }}</label>
                <el-input-number v-model="manufacturer.data.monthly_produce_quantity" :min="1" class="w-full rounded-md" controls-position="right" style="width: 100%" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.employee_num }}</label>
                <el-input-number v-model="manufacturer.data.employee_num" :min="1" class="w-full rounded-md" controls-position="right" style="width: 100%" />
              </div>
            </div>

            <div class="text-base font-semibold text-black mt-4">{{ l.codes_identifiers }}</div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.vendor_code }}</label>
                <el-input :placeholder="l.input_vendor_code" v-model="manufacturer.data.vendor_code" clearable class="w-full rounded-md" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.unique_identifier }}</label>
                <el-input :placeholder="l.input_unique_identifier" v-model="manufacturer.data.unique_identifier" clearable class="w-full rounded-md" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.ffc_id }}</label>
                <el-input :placeholder="l.input_ffc_id" v-model="manufacturer.data.ffc_id" clearable class="w-full rounded-md" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.sap_code }}</label>
                <el-input :placeholder="l.input_sap_code" v-model="manufacturer.data.sap_code" clearable class="w-full rounded-md" />
              </div>
            </div>

            <div class="text-base font-semibold text-black mt-4">{{ l.classification_orders }}</div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.classification }}</label>
                <el-input :placeholder="l.input_classification" v-model="manufacturer.data.classification" clearable class="w-full rounded-md" />
              </div>
              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.types_of_orders }}</label>
                <el-input :placeholder="l.input_types_of_orders" v-model="manufacturer.data.types_of_orders" clearable class="w-full rounded-md" />
              </div>
            </div>

            <div class="text-base font-semibold text-black mt-4">{{ l.warnings_compliance }}</div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div class="flex flex-col gap-2">
                <label class="text-sm font-light">{{ l.compliance_warning_letter }}</label>
                <el-input :placeholder="l.input_compliance_warning_letter" v-model="manufacturer.data.compliance_warning_letter" clearable class="w-full rounded-md" />
              </div>
            </div>
          </div>

          <div class="mt-4 flex justify-between items-center">
            <div class="text-xl font-black text-gray-900 dark:text-white">
              {{ l.contact_info }}
            </div>

            <div>
              <button class="px-3 h-9 bg-white text-xs rounded-full border border-gray-300 flex items-center gap-1 hover:bg-gray-100" @click="contactInfoList">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>

                {{ c.addData || 'Add data' }}
              </button>
            </div>
          </div>
          <div>
            <z-table :list="contactInfo.list" :tableProps="config.tableProps" :columns="contactInfoColumns" @deleteItem="contactInfoDeleteItem" class="w-full">
              <template v-slot:operation="v">
                <el-button type="text" size="small" class="text-blue-500 hover:underline mr-2" @click="contactInfoEditItem(v.row, v.$index)">
                  <i class="el-icon-edit"></i>
                  {{ c.edit }}
                </el-button>
                <el-button type="text" size="small" class="text-red-500 hover:underline" @click="contactInfoDeleteItem(v.row, v.$index)">
                  <i class="el-icon-delete"></i>
                  {{ c.delete }}
                </el-button>
              </template>
            </z-table>
          </div>

          <div class="mt-4 flex justify-between items-center">
            <div class="text-xl font-black text-gray-900 dark:text-white">
              {{ l.addr_and_processes }}
            </div>

            <div>
              <button class="px-3 h-9 bg-white text-xs rounded-full border border-gray-300 flex items-center gap-1 hover:bg-gray-100" @click="addressList">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>

                {{ c.addData || 'Add data' }}
              </button>
            </div>
          </div>

          <div>
            <z-table :list="address.list" :tableProps="config.tableProps" :columns="addressColumns" @deleteItem="addressDeleteItem" class="w-full">
              <template v-slot:operation="v">
                <el-button type="text" size="small" class="text-blue-500 hover:underline mr-2" @click="addressEditItem(v.row, v.$index)">
                  <i class="el-icon-edit"></i>
                  {{ c.edit }}
                </el-button>
                <el-button type="text" size="small" class="text-red-500 hover:underline" @click="addressDeleteItem(v.row, v.$index)">
                  <i class="el-icon-delete"></i>
                  {{ c.delete }}
                </el-button>
              </template>
            </z-table>
          </div>

          <div class="mt-4 flex justify-between items-center">
            <div class="text-xl font-black text-gray-900 dark:text-white">
              {{ l.compliance_evidence }}
            </div>

            <div>
              <button class="px-3 h-9 bg-white text-xs rounded-full border border-gray-300 flex items-center gap-1 hover:bg-gray-100" @click="createFileData">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>

                {{ c.add_attachments || 'Add attachments' }}
              </button>
            </div>
          </div>

          <div>
            <z-table :list="attachment.list" :tableProps="config.tableProps" :columns="attachmentColumns" @deleteItem="attachmentDeleteItem" class="w-full">
              <template v-slot:operation="v">
                <el-button type="text" size="small" class="text-red-500 hover:underline" @click="attachmentDeleteItem(v.row, v.$index)">
                  <i class="el-icon-delete"></i>
                  {{ c.delete }}
                </el-button>
              </template>
            </z-table>
          </div>
        </div>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="manufacturer.addOrEditFormVisible = false" class="dialog-cancel-button">
          {{ c.cancel }}
        </el-button>
        <el-button type="primary" @click="OPenManufacturer" class="dialog-confirm-button">
          {{ c.confirm }}
        </el-button>
      </span>
    </CustomDialog>
    <!-- 确认信息窗口 -->
    <CustomDialog :title="l.confirm_info" :visible.sync="manufacturer.inforFormVisible" :maxWidth="'1000px'" :width="'100%'">
      <template #content>
        <div class="flex flex-col gap-6 p-4">
          <!-- 基本信息 Section -->
          <div class="rounded-lg border border-gray-200 shadow-sm overflow-hidden dark:border-gray-700">
            <div class="bg-gradient-to-r from-blue-50 to-blue-100 px-4 py-3 dark:from-blue-900 dark:to-blue-800 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ l.partner_information }}</h3>
            </div>
            <div class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.manufacture_name_CN }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayValue(manufacturer.data.name_zh) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.manufacture_name_US }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayValue(manufacturer.data.name_en) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.legal_person }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayValue(manufacturer.data.legal_person) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.partner_country }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayValue(manufacturer.data.country) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.requestor_facility_name }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayValue(manufacturer.data.requestor_facility_type) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.requestor_facility_code }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayValue(manufacturer.data.requestor_facility_code) }}</span>
              </div>
            </div>
          </div>

          <!-- 商业信息 Section -->
          <div class="rounded-lg border border-gray-200 shadow-sm overflow-hidden dark:border-gray-700">
            <div class="bg-gradient-to-r from-green-50 to-green-100 px-4 py-3 dark:from-green-900 dark:to-green-800 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ l.export_business }}</h3>
            </div>
            <div class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.export_business }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayYnFlag(manufacturer.data.is_export_biz) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.is_involve_product }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayProductFlag(manufacturer.data.is_involve_product) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.customs_number }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayValue(manufacturer.data.customs_number) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.biz_license_number }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayValue(manufacturer.data.biz_license_number) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.cooperation_start_date }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayValue(Sdate) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.vendor_code }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayValue(manufacturer.data.vendor_code) }}</span>
              </div>
            </div>
          </div>

          <!-- 授权信息 Section -->
          <div class="rounded-lg border border-gray-200 shadow-sm overflow-hidden dark:border-gray-700">
            <div class="bg-gradient-to-r from-purple-50 to-purple-100 px-4 py-3 dark:from-purple-900 dark:to-purple-800 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ l.cooperation_authorization }}</h3>
            </div>
            <div class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.is_alidas_producer }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayYnFlag(manufacturer.data.is_alidas_producer) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.is_alidas_authorized }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayYnFlag(manufacturer.data.is_alidas_authorized) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.authorization_status }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayAuthorizationStatus(manufacturer.data.authorization_status) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.requestor_contact_name }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayValue(manufacturer.data.requestor_contact_name) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.compliance_warning_letter }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayValue(manufacturer.data.compliance_warning_letter) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.classification }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayValue(manufacturer.data.classification) }}</span>
              </div>
            </div>
          </div>

          <!-- 生产信息 Section -->
          <div class="rounded-lg border border-gray-200 shadow-sm overflow-hidden dark:border-gray-700">
            <div class="bg-gradient-to-r from-orange-50 to-orange-100 px-4 py-3 dark:from-orange-900 dark:to-orange-800 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ l.production_operations }}</h3>
            </div>
            <div class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.monthly_produce_quantity }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayValue(manufacturer.data.monthly_produce_quantity) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.employee_num }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayValue(manufacturer.data.employee_num) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.types_of_orders }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayValue(manufacturer.data.types_of_orders) }}</span>
              </div>
            </div>
          </div>

          <!-- 标识信息 Section -->
          <div class="rounded-lg border border-gray-200 shadow-sm overflow-hidden dark:border-gray-700">
            <div class="bg-gradient-to-r from-indigo-50 to-indigo-100 px-4 py-3 dark:from-indigo-900 dark:to-indigo-800 border-b border-gray-200 dark:border-gray-700">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">{{ l.codes_identifiers }}</h3>
            </div>
            <div class="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.unique_identifier }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayValue(manufacturer.data.unique_identifier) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.ffc_id }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayValue(manufacturer.data.ffc_id) }}</span>
              </div>
              <div class="flex flex-col gap-1">
                <span class="text-xs font-medium text-gray-500 uppercase tracking-wide">{{ l.sap_code }}</span>
                <span class="text-sm font-medium text-gray-900 dark:text-white">{{ displayValue(manufacturer.data.sap_code) }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="manufacturer.inforFormVisible = false">
          {{ c.cancel }}
        </el-button>
        <el-button type="primary" @click="submmitManufacturer">
          {{ c.confirm }}
        </el-button>
      </span>
    </CustomDialog>

    <!-- 合规联系人信息 -->
    <CustomDialog :title="l.contact_info" @submmit="contactInfoSubmmit" :visible.sync="contactInfo.dialogFormVisible" :maxWidth="'600px'">
      <template #notice>
        <div class="text-sm text-gray-500 py-3 px-6 bg-gray-50 leading-4">
          {{ l.contact_info_notice || 'contact_info_notice' }}
        </div>
      </template>
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-light flex">
              {{ l.contact_name }}
              <span class="text-red-500">*</span>
            </label>
            <el-input :placeholder="l.input" v-model="contactInfo.data.contact_name" clearable />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-light flex">
              {{ l.contact_job_title }}
              <span class="text-red-500">*</span>
            </label>
            <el-input :placeholder="l.input" v-model="contactInfo.data.contact_job_title" clearable />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-light flex">
              {{ l.contact_phone }}
              <span class="text-red-500">*</span>
            </label>
            <el-input :placeholder="l.input" v-model="contactInfo.data.contact_phone" clearable />
            <p class="text-xs text-gray-400">{{ l.contact_phone_note || 'contact_phone_note' }}</p>
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-light flex">
              {{ l.contact_email }}
              <span class="text-red-500">*</span>
            </label>
            <el-input :placeholder="l.input" v-model="contactInfo.data.contact_email" clearable />
            <p class="text-xs text-gray-400">{{ l.contact_email_note || 'contact_email_note' }}</p>
          </div>
        </div>
      </template>
      <template #footer>
        <el-button @click="contactInfo.dialogFormVisible = false">
          {{ c.cancel }}
        </el-button>
        <el-button type="primary" @click="contactInfoSubmmit">
          {{ c.confirm }}
        </el-button>
        <slot name="operation"></slot>
      </template>
    </CustomDialog>

    <!-- Địa chỉ - CustomDialog -->
    <CustomDialog :title="l.addr_and_processes" @submmit="addressSubmmit" :visible.sync="address.dialogFormVisible" :maxWidth="'600px'">
      <template #notice>
        <div class="text-sm text-gray-500 py-3 px-6 bg-gray-50 leading-4">Thông tin địa chỉ và quy trình sản xuất là bắt buộc. Vui lòng điền đầy đủ thông tin.</div>
      </template>
      <template #content>
        <div class="flex flex-col gap-4">
          <div class="flex flex-col gap-2">
            <label class="text-sm font-light flex">
              {{ l.address_zh }}
              <span class="text-red-500">*</span>
            </label>
            <el-input :placeholder="l.input" v-model="address.data.address_zh" clearable />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-light flex">
              {{ l.address_en }}
              <span class="text-red-500">*</span>
            </label>
            <el-input :placeholder="l.input" v-model="address.data.address_en" clearable />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-light flex">
              {{ l.own_processes }}
              <span class="text-red-500">*</span>
            </label>
            <el-input :placeholder="l.input" v-model="address.data.own_processes" clearable />
          </div>
          <div class="flex flex-col gap-2">
            <label class="text-sm font-light flex">
              {{ l.match_processes }}
              <span class="text-red-500">*</span>
            </label>
            <el-input :placeholder="l.input" v-model="address.data.match_processes" clearable />
          </div>
        </div>
      </template>
      <template #footer>
        <el-button @click="address.dialogFormVisible = false">
          {{ c.cancel }}
        </el-button>
        <el-button type="primary" @click="addressSubmmit">
          {{ c.confirm }}
        </el-button>
      </template>
    </CustomDialog>
    <!-- 附件窗口 -->
    <CustomDialog :title="l.add_attachments" :visible.sync="attachment.dialogFormVisible" width="30%">
      <el-form ref="form">
        <el-form-item label="">
          <el-button type="primary" @click="selectFile">
            {{ l.selectFile }}
          </el-button>
          <div class="text item">
            {{ attachment.fileList.file.name }}
          </div>
          <div>
            <progress v-if="attachment.uploadProgress > 0" :value="attachment.uploadProgress" max="100"></progress>
          </div>
        </el-form-item>
        <el-form-item :label="l.fileName">
          <el-input :placeholder="l.input_fileName" v-model="attachment.fileList.file.name" :disabled="true" style="width: 300px"></el-input>
        </el-form-item>
        <el-form-item :label="l.fileType">
          <el-select :placeholder="l.choose" style="width: 300px" v-model="attachment.fileList.attachment_type">
            <el-option v-for="item in attachment.options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <div style="float: right">
            <el-button @click="attachment.dialogFormVisible = false">
              {{ c.cancel }}
            </el-button>
            <el-button type="primary" @click="attachmentSubmmit">
              {{ c.confirm }}
            </el-button>
          </div>
        </el-form-item>
      </el-form>
    </CustomDialog>
    <!-- 地址信息 -->
    <CustomDialog :title="l.addr_and_processes" :visible.sync="address.dialogTableVisible2" width="30%">
      <el-table :data="address.list">
        <el-table-column property="address_zh" :label="l.address_zh"></el-table-column>
        <el-table-column property="address_en" :label="l.address_en"></el-table-column>
        <el-table-column property="own_processes" :label="l.own_processes"></el-table-column>
        <el-table-column property="match_processes" :label="l.own_processes"></el-table-column>
      </el-table>
    </CustomDialog>
    <!-- 附件信息 -->
    <CustomDialog :title="l.attachment_info" :visible.sync="attachment.dialogFormVisible2" width="30%">
      <el-table :data="attachment.list">
        <el-table-column property="file_name" :label="l.fileName"></el-table-column>
        <el-table-column property="create_user" :label="l.create_people"></el-table-column>
        <el-table-column property="create_time" :label="l.create_date"></el-table-column>
        <el-table-column fixed="right" :label="l.operation">
          <template slot-scope="scope">
            <el-button @click="checkAttachments(scope.row)" type="text" size="small">
              {{ l.check }}
            </el-button>
            <el-button type="text" size="small" @click="downAttachments(scope.row)">
              {{ l.down }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </CustomDialog>

    <CustomDialog :visible.sync="visabled.uploadFile" width="30%">
      <div>
        <el-form style="margin-top: 20px">
          <el-form-item :label="l.upload_file" required>
            <input type="file" accept=".xls,.xlsx" class="el-input" @change="onFileChange" ref="addfileinput" style="border: 1px solid #dcdcdc; border-radius: 5px; padding: 3px" />
          </el-form-item>
        </el-form>
        <div style="margin-top: 40px; text-align: right">
          <el-button type="primary" @click="visabled.uploadFile = false">
            {{ c.cancel }}
          </el-button>
          <el-button type="success" @click="uploadExcel">
            {{ c.m_upload }}
          </el-button>
        </div>
      </div>
    </CustomDialog>
    <filePreviews v-if="attachment.fileUrl" :file-url="attachment.fileUrl" :visible="attachment.dialogFormVisible3" @update:visible="attachment.dialogFormVisible3 = $event"></filePreviews>

    <!-- Chi tiết modal -->
    <CustomDialog :title="c.detail" :visible.sync="manufacturer.detailFormVisible" :clickOutside="false" width="90%" :maxWidth="'1280px'" custom-class="scrollable-dialog manufacturer-detail-dialog">
      <template #content>
        <div class="form-container">
          <!-- Basic Information Section -->
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">
                <i class="el-icon-info"></i>
                {{ l.basic }}
              </h3>
            </div>
            <div class="form-content">
              <div class="detail-descriptions">
                <el-descriptions :column="3" border>
                  <el-descriptions-item :label="l.manufacture_name_CN">
                    {{ manufacturer.data.name_zh || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.manufacture_name_US">
                    {{ manufacturer.data.name_en || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.legal_person">
                    {{ manufacturer.data.legal_person || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.partner_country">
                    {{ manufacturer.data.country || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.customs_number">
                    {{ manufacturer.data.customs_number || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.biz_license_number">
                    {{ manufacturer.data.biz_license_number || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.requestor_facility_type">
                    {{ manufacturer.data.requestor_facility_type || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.export_business">
                    {{ manufacturer.data.is_export_biz || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.is_involve_product">
                    {{ manufacturer.data.is_involve_product || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.cooperation_start_date">
                    {{ Sdate }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.is_alidas_producer">
                    {{ manufacturer.data.is_alidas_producer || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.is_alidas_authorized">
                    {{ manufacturer.data.is_alidas_authorized || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.requestor_facility_name">
                    {{ manufacturer.data.requestor_facility_name || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.requestor_contact_name">
                    {{ manufacturer.data.requestor_contact_name || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.monthly_produce_quantity">
                    {{ manufacturer.data.monthly_produce_quantity || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.employee_num">
                    {{ manufacturer.data.employee_num || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.requestor_facility_code">
                    {{ manufacturer.data.requestor_facility_code || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.vendor_code">
                    {{ manufacturer.data.vendor_code || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.unique_identifier">
                    {{ manufacturer.data.unique_identifier || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.ffc_id">
                    {{ manufacturer.data.ffc_id || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.sap_code">
                    {{ manufacturer.data.sap_code || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.classification">
                    {{ manufacturer.data.classification || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.authorization_status">
                    {{ displayAuthorizationStatus(manufacturer.data.authorization_status) }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.compliance_warning_letter">
                    {{ manufacturer.data.compliance_warning_letter || '--' }}
                  </el-descriptions-item>
                  <el-descriptions-item :label="l.types_of_orders">
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
                {{ l.contact_info }}
              </h3>
            </div>
            <div class="table-container">
              <el-table :data="contactInfo.list" class="form-table" border>
                <el-table-column prop="contact_name" :label="l.contact_name" min-width="120"></el-table-column>
                <el-table-column prop="contact_job_title" :label="l.contact_job_title" min-width="120"></el-table-column>
                <el-table-column prop="contact_phone" :label="l.contact_phone" min-width="140"></el-table-column>
                <el-table-column prop="contact_email" :label="l.contact_email" min-width="180"></el-table-column>
              </el-table>
            </div>
          </div>

          <!-- Address & Processes Section -->
          <div class="form-section" v-if="address.list && address.list.length > 0">
            <div class="section-header">
              <h3 class="section-title">
                <i class="el-icon-location-outline"></i>
                {{ l.addr_and_processes }}
              </h3>
            </div>
            <div class="table-container">
              <el-table :data="address.list" class="form-table" border>
                <el-table-column prop="address_zh" :label="l.address_zh" min-width="200"></el-table-column>
                <el-table-column prop="address_en" :label="l.address_en" min-width="200"></el-table-column>
                <el-table-column prop="own_processes" :label="l.own_processes" min-width="150"></el-table-column>
                <el-table-column prop="match_processes" :label="l.match_processes" min-width="150"></el-table-column>
              </el-table>
            </div>
          </div>

          <!-- Compliance Evidence Section -->
          <div class="form-section" v-if="attachment.list && attachment.list.length > 0">
            <div class="section-header">
              <h3 class="section-title">
                <i class="el-icon-folder"></i>
                {{ l.compliance_evidence }}
              </h3>
            </div>
            <div class="table-container">
              <el-table :data="attachment.list" class="form-table" border>
                <el-table-column prop="file_name" :label="l.fileName" min-width="200"></el-table-column>
                <el-table-column prop="attachment_type" :label="l.fileType" min-width="120">
                  <template slot-scope="scope">
                    <span>{{ matterType(scope.row.attachment_type) }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="create_user" :label="l.create_people" min-width="120"></el-table-column>
                <el-table-column prop="create_time" :label="l.create_date" min-width="150"></el-table-column>
                <el-table-column :label="c.operation" width="150" fixed="right">
                  <template slot-scope="scope">
                    <el-button @click="checkAttachments(scope.row)" type="text" size="small" class="delete-action-button">
                      {{ l.check }}
                    </el-button>
                    <el-button type="text" size="small" @click="downAttachments(scope.row)" class="delete-action-button">
                      {{ l.down }}
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
          {{ c.cancel }}
        </el-button>
      </span>
    </CustomDialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, watch, set } from 'vue'
import axios from 'axios'
import SparkMD5 from 'spark-md5'
import { getToken, localGet } from '@/utils/auth'
import { _, api, defaultConfig, zFormDialog, zPagination, zTable } from '@/views/_common'
import CustomDialog from '../../_common/CustomDialog.vue'
import filePreviews from '../../_common/filePreviews.vue'
import ManufacturerTable from './ManufacturerTable.vue'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('manufacturer')

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

const fileInput = ref(null)
const addfileinput = ref(null)

const optionsAuthorizationStatus = computed(() => [
  { value: 'onboarding', label: l.value.producer_status_onboarding },
  { value: 'discontinued', label: l.value.producer_status_discontinued },
  { value: 'in_use', label: l.value.producer_status_in_use },
])

const maxSizeInBytes = 5 * 1024 * 1024
const fileSizeInBytes = ref(0)

const manufacturer = reactive({
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
    pageSize: 10,
    page: 1,
    total: 0,
  },
  addOrEditFormVisible: false,
  inforFormVisible: false,
  detailFormVisible: false,
})

const contactInfo = reactive({
  list: [],
  data: {},
  editIndex: -1,
  dialogFormVisible: false,
  dialogTableVisible2: false,
})

const contactInfoColumns = computed(() => [
  {
    title: l.value.contact_name,
    key: 'contact_name',
  },
  {
    title: l.value.contact_job_title,
    key: 'contact_job_title',
  },
  {
    title: l.value.contact_phone,
    key: 'contact_phone',
  },
  {
    title: l.value.contact_email,
    key: 'contact_email',
  },
])

const address = reactive({
  list: [],
  data: {},
  editIndex: -1,
  dialogFormVisible: false,
  dialogTableVisible2: false,
})

const addressColumns = computed(() => [
  {
    title: l.value.address_zh,
    key: 'address_zh',
  },
  {
    title: l.value.address_en,
    key: 'address_en',
  },
  {
    title: l.value.own_processes,
    key: 'own_processes',
  },
  {
    title: l.value.match_processes,
    key: 'match_processes',
  },
])

const attachment = reactive({
  list: [],
  data: {},
  dialogFormVisible: false,
  dialogFormVisible2: false,
  dialogFormVisible3: false,
  fileUrl: '',
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
  uploadProgress: 0,
  options: computed(() => [
    {
      value: '0A',
      label: l.value.business_license,
    },
    {
      value: '0B',
      label: 'NDA ',
    },
    {
      value: '0C',
      label: l.value.other_attachment,
    },
  ])
})

const attachmentColumns = computed(() => [
  {
    title: l.value.fileName,
    key: 'file_name',
  },
  {
    title: l.value.fileType,
    key: 'attachment_type',
    formatter: matterType,
  },
  {
    title: l.value.create_people,
    key: 'create_user',
  },
  {
    title: l.value.create_date,
    key: 'create_time',
  },
  {
    title: l.value.modify_user,
    key: 'modify_user',
  },
  {
    title: l.value.modify_time,
    key: 'modify_time',
  },
])

const userAuth = ref({})
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

const visabled = reactive({
  uploadFile: false,
})

const uploadQuery = reactive({})
const pagination = ref(null) // z-pagination uses this? Not in data originally. Used in template.

const Sdate = computed(() => {
  return manufacturer.data.cooperation_start_date ? new Date(manufacturer.data.cooperation_start_date).toLocaleString() : ''
})

function getList() {
  manufacturer.loading = true
  proxy.$request(
    config.apiManufacturer,
    {
      manufacture_id: manufacturer.query.manufacture_id,
      addr: manufacturer.query.addr,
      manufacture_name: manufacturer.query.manufacture_name,
      fileName: manufacturer.query.fileName,
      legal_person: manufacturer.query.legal_person,
      produce_processes: manufacturer.query.produce_processes,
      requestor_facility_type: manufacturer.query.requestor_facility_type,
      requestor_facility_name: manufacturer.query.requestor_facility_name,
      pageSize: manufacturer.query.pageSize,
      page: manufacturer.query.page,
    },
    'get'
  )
    .then((r) => {
      console.log(r)
      manufacturer.list = r.data.list
      manufacturer.query.total = r.data.total
    })
    .catch((e) => {
      console.log(e)
    })
    .finally(() => {
      manufacturer.loading = false
    })
}

function getDataByID(id) {
  console.log(id)
  proxy.$request(config.apiID, {
    id: id,
  })
    .then((r) => {
      console.log(r)
      manufacturer.data = r.data
      attachment.list = r.data.attachment
      address.list = r.data.addressList
      contactInfo.list = r.data.contactInfoList
    })
    .catch((e) => {
      console.log(e)
    })
}

function getAddrsList(data) {
  proxy.$request(
    config.apiManufacturerAddrs,
    {
      id: data.id,
    },
    'get'
  )
    .then((r) => {
      address.list = r.data
    })
    .catch((e) => {
      console.log(e)
    })
}

function getAttachments(id, file_type) {
  proxy.$request(
    config.apiAttachments,
    {
      id: id,
      file_type: file_type,
    },
    'get'
  )
    .then((r) => {
      attachment.list = r.data
      console.log(attachment.list)
    })
    .catch((e) => {
      console.log(e)
    })
}

function reset() {
  manufacturer.query = {
    manufacture_id: '', // 公司业务id
    addr: '',
    manufacture_name: '',
    fileName: '',
    legal_person: '',
    produce_processes: '',
    requestor_facility_type: '',
    requestor_facility_name: '',
    pageSize: 15,
    page: 1,
    total: 0,
  }
  getList()
}

function add() {
  manufacturer.data = {
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
  }
  contactInfo.data = {}
  contactInfo.list = []
  contactInfo.editIndex = -1
  address.data = {}
  address.list = []
  address.editIndex = -1
  attachment.data = {}
  attachment.list = []
  manufacturer.addOrEditFormVisible = true
}

function editItem(index, data) {
  getDataByID(data.id)
  manufacturer.addOrEditFormVisible = true
}

function OPenManufacturer() {
  console.log(manufacturer.data)
  // Logic same as original
  manufacturer.inforFormVisible = true
}

function submmitManufacturer() {
  manufacturer.data.contactInfoList = contactInfo.list
  manufacturer.data.addressList = address.list
  manufacturer.data.attachment = attachment.list
  console.log(manufacturer.data)
  proxy.$request(config.apiUpdate, manufacturer.data, 'post', false)
    .then((r) => {
      console.log(r)
      proxy.$message({
        message: c.value.success,
        type: 'success',
      })
      getList()
      manufacturer.addOrEditFormVisible = false
      manufacturer.inforFormVisible = false
    })
    .catch((e) => {
      console.log(e)
    })
}

function deleteItem(index, data) {
  console.log(data)
  proxy.$prompt(l.value.delete_confirm, c.value.oprConfirm, {
    type: 'warning',
    inputPattern: /^[Y]{1}$/i,
    inputErrorMessage: '请输入Y/y',
    confirmButtonText: c.value.confirm,
    cancelButtonText: c.value.cancel,
  })
    .then(() => {
      proxy.$request(
        config.apiDelete,
        {
          id: data.id,
        },
        'post'
      )
        .then((r) => {
          console.log(r)
          proxy.$message({
            type: 'success',
            message: c.value.success,
          })
          getList()
        })
        .catch((e) => {
          console.log(e)
          proxy.$message.error(l.value.delete_error)
        })
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: l.value.cancel_delete,
      })
    })
}

function exportExcel() {
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
    },
    responseType: 'blob',
    method: 'post',
    url: proxy.$api.baseUrl + '/Compliance/complianceManufacturer/exportList',
    data: manufacturer.query, // used this.query in original, assumed manufacturer.query
  }).then((r) => {
    let file = new FileReader()
    file.readAsText(r.data, 'utf-8')
    file.onload = function () {
      try {
        const blob = new Blob([r.data], {
          type: 'application/octet-stream;',
        })
        const elink = document.createElement('a')
        elink.download = decodeURIComponent(l.value.fileBasic_download + '.zip')
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href)
        document.body.removeChild(elink)
        // this.loading = false // no loading var in original context for export
      } catch {
        proxy.$message.error(l.value.file_export_failed)
      }
    }
  })
}

function exportTemplate() {
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
    },
    responseType: 'blob',
    method: 'post',
    url: api.baseUrl + '/Compliance/complianceManufacturer/uploadManufacturerTemplate',
  }).then((r) => {
    try {
      const blob = new Blob([r.data], {
        type: 'application/octet-stream;',
      })
      const elink = document.createElement('a')
      elink.download = l.value.file_download + '.xlsx'
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

function exportItem(row) {
  // Original exportItem implementation
  console.log('Export item:', row)
}

function checkArrdess(index, data) {
  console.log(data.manufacture_id)
  getAddrsList(data)
  address.dialogTableVisible2 = true
}

function checkAttachments(data) {
  attachment.fileUrl = api.baseUrl + '/' + data.file_url
  console.log(attachment.fileUrl)
  attachment.dialogFormVisible3 = true
}

// Contact Info Methods
function contactInfoList() {
  console.log('contactInfo')
  contactInfo.editIndex = -1
  contactInfo.data = {}
  contactInfo.dialogFormVisible = true
}

function contactInfoSubmmit() {
  console.log(contactInfo.data)
  if (Object.keys(contactInfo.data).length === 0) {
    proxy.$message({
      type: 'info',
      message: l.value.info_empty_error,
    })
    return
  }
  const phoneRegex = /^(0|\+84)[1-9][0-9]{8}$/
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

  if (!phoneRegex.test(contactInfo.data.contact_phone)) {
    proxy.$message({
      message: l.value.input_confirm_phone,
      type: 'error',
    })
    return
  }
  if (!emailRegex.test(contactInfo.data.contact_email)) {
    proxy.$message({
      message: l.value.ininput_confirm_email,
      type: 'error',
    })
    return
  }
  const payload = _.cloneDeep(contactInfo.data)
  if (contactInfo.editIndex > -1) {
    set(contactInfo.list, contactInfo.editIndex, payload)
  } else {
    contactInfo.list.push(payload)
  }
  contactInfo.data = {}
  contactInfo.editIndex = -1
  contactInfo.dialogFormVisible = false
  console.log(contactInfo.list)
}

function contactInfoDeleteItem(row, index) {
  console.log(row)
  contactInfo.list.splice(index, 1)
  if (contactInfo.editIndex === index) {
    contactInfo.editIndex = -1
    contactInfo.data = {}
  } else if (contactInfo.editIndex > index) {
    contactInfo.editIndex -= 1
  }
}

function contactInfoEditItem(row, index) {
  contactInfo.editIndex = index
  contactInfo.data = _.cloneDeep(row)
  contactInfo.dialogFormVisible = true
}

// Address Methods
function addressList() {
  console.log('addressList')
  address.editIndex = -1
  address.data = {}
  address.dialogFormVisible = true
}

function addressSubmmit() {
  const address_en = address.data.address_en
  const address_zh = address.data.address_zh
  const own_processes = address.data.own_processes
  const match_processes = address.data.match_processes

  if (!address_en || !address_zh || !own_processes || !match_processes) {
    proxy.$message({
      type: 'info',
      message: l.value.info_empty_error,
    })
    return
  }

  const payload = _.cloneDeep(address.data)
  if (manufacturer.data.id != undefined) {
    payload.manufacture_id = manufacturer.data.id
  }
  if (address.editIndex > -1) {
    set(address.list, address.editIndex, payload)
  } else {
    address.list.push(payload)
  }
  console.log(address.list, address.data)
  address.data = {}
  address.editIndex = -1
  address.dialogFormVisible = false
}

function addressDeleteItem(data, index) {
  address.list.splice(index, 1)
  if (address.editIndex === index) {
    address.editIndex = -1
    address.data = {}
  } else if (address.editIndex > index) {
    address.editIndex -= 1
  }
}

function addressEditItem(row, index) {
  address.editIndex = index
  address.data = _.cloneDeep(row)
  address.dialogFormVisible = true
}

function createFileData() {
  attachment.fileList = {
    attachment_type: '',
    fileName: '',
    file: {},
  }
  attachment.dialogFormVisible = true
}

function attachmentSubmmit() {
  console.log(attachment.fileList)
  if (!attachment.fileList.file.name) {
    attachment.fileList.file = {}
    if (fileInput.value) fileInput.value.value = ''
    return proxy.$message.error(l.value.file_is_empty)
  }
  if (fileSizeInBytes.value > maxSizeInBytes.value) {
    getAttachmentFlag()
  } else {
    let forData = new FormData()
    forData.append('fileName', attachment.fileList.fileName)
    forData.append('file', attachment.fileList.file)
    forData.append('attachment_type', attachment.fileList.attachment_type)
    proxy.$request(config.apiUploadAttachment, forData, 'post')
      .then((r) => {
        console.log(r.data[0])
        set(r.data[0], 'attachment_type', attachment.fileList.attachment_type)
        attachment.list.push(r.data[0])
        proxy.$message({
          message: c.value.oprConfirm,
          type: 'success',
        })
        attachment.dialogFormVisible = false
      })
      .catch((e) => {
        console.log(e)
      })
  }
}

function onFileChange(e) {
  uploadQuery.file = e.target.files[0]
  console.log(uploadQuery.file)
  if (!uploadQuery.file) {
    alert(l.value.select_file)
    return
  }
}

function uploadExcel() {
  if (!uploadQuery.file) {
    alert(l.value.select_file)
    return
  }

  let formData = new FormData()
  formData.append('file', uploadQuery.file)

  proxy.$request(proxy.$api.baseUrl + '/Compliance/complianceManufacturer/uploadManufacturer', formData, 'post')
    .then((r) => {
      console.log(r)
      proxy.$message({
        type: 'success',
        message: l.value.upload_success,
      })
      visabled.uploadFile = false
      uploadQuery.file = {}
      if (addfileinput.value) addfileinput.value.value = ''
    })
    .catch((e) => {
      proxy.$message.error(e)
    })
}

function attachmentDeleteItem(data, index) {
  console.log(data)
  proxy.$prompt(l.value.prompt, c.value.oprConfirm, {
    type: 'warning',
    inputPattern: /^[Y]{1}$/i,
    inputErrorMessage: l.value.inputErrorMessage,
    confirmButtonText: c.value.confirm,
    cancelButtonText: c.value.cancel,
  })
    .then(() => {
      attachment.list.splice(index, 1)
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: l.value.info,
      })
    })
}

function selectFile() {
  if (fileInput.value) fileInput.value.click()
}

function fileChange(value) {
  console.log(value.target.files)
  attachment.fileList.file = value.target.files[0]

  if (value.target.files.length == 0) {
    attachment.fileList.file = {}
    return proxy.$message.error(l.value.file_is_empty)
  }
  if (!value.target.files[0].type) {
    if (fileInput.value) fileInput.value.value = ''
    return proxy.$message.error(l.value.unsupported_file_type)
  }
  fileSizeInBytes.value = value.target.files[0].size
  if (fileSizeInBytes.value > maxSizeInBytes.value) {
    attachment.divide.file = value.target.files[0]
    calculateFileHash()
  }
}

async function calculateFileHash() {
  const spark = new SparkMD5.ArrayBuffer()
  const fileReader = new FileReader()
  fileReader.readAsArrayBuffer(attachment.divide.file)
  fileReader.onload = (e) => {
    spark.append(e.target.result)
    attachment.divide.fileHash = spark.end()
    splitFile()
  }
}

function splitFile() {
  let start = 0
  attachment.divide.chunks = []
  while (start < attachment.divide.file.size) {
    const chunk = attachment.divide.file.slice(start, start + attachment.divide.chunkSize)
    attachment.divide.chunks.push(chunk)
    start += attachment.divide.chunkSize
  }
  console.log(attachment.divide.chunks)
}

function generateUUID() {
  let d = new Date().getTime()
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    d += performance.now()
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0
    d = Math.floor(d / 16)
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })
}

function getAttachmentFlag() {
  proxy.$request(proxy.$api.baseUrl + '/Compliance/complianceAttachments/getAttachmentFlag', {
    fileHash: attachment.divide.fileHash,
    attachment_type: attachment.fileList.attachment_type,
  }).then((r) => {
    if (r.data && r.data.length > 0) {
      console.log(r.data[0])
      set(r.data[0], 'attachment_type', attachment.fileList.attachment_type)
      attachment.list.push(r.data[0])
      proxy.$message({
        message: c.value.oprConfirm,
        type: 'success',
      })
      attachment.dialogFormVisible = false
    } else {
      uploadFile()
    }
  })
}

async function uploadFile() {
  if (!attachment.fileList.attachment_type) {
    return proxy.$message.error(l.value.select_file_type)
  }
  attachment.divide.taskId = generateUUID()
  let uploadedChunks = 0
  for (let i = 0; i < attachment.divide.chunks.length; i++) {
    const formData = new FormData()
    formData.append('id', attachment.divide.taskId)
    formData.append('file', attachment.divide.chunks[i])
    formData.append('chunkIndex', i)
    formData.append('fileHash', attachment.divide.fileHash)
    formData.append('fileName', attachment.divide.file.name)
    formData.append('fileType', attachment.divide.file.type)
    formData.append('totalChunks', attachment.divide.chunks.length)
    formData.append('attachment_type', attachment.fileList.attachment_type)
    await proxy.$request(proxy.$api.baseUrl + '/Compliance/complianceAttachments/AddTaskToQueue', formData, 'post').then((r) => {
      uploadedChunks++
      attachment.uploadProgress = Math.round((uploadedChunks / attachment.divide.chunks.length) * 100)
    })
  }
  await mergeFile()
}

async function mergeFile() {
  try {
    let fileObj = {
      id: attachment.divide.taskId,
      fileHash: attachment.divide.fileHash,
      totalChunks: attachment.divide.chunks.length,
      fileName: attachment.divide.file.name,
      fileType: attachment.divide.file.type,
      attachment_type: attachment.fileList.attachment_type,
    }
    console.log(fileObj)
    await proxy.$request(proxy.$api.baseUrl + '/Compliance/complianceAttachments/getTaskStatus', fileObj, 'post').then((r) => {
      proxy.$message({
        type: 'success',
        message: c.value.oprConfirm,
      })
      attachment.list.push(r.data[0])
      if (fileInput.value) fileInput.value.value = ''
      attachment.uploadProgress = 0
      attachment.dialogFormVisible = false
      console.log(r)
    })
  } catch (error) {
    proxy.$message({
      type: 'error',
      message: l.value.upload_failed,
    })
  }
}

function matterType(row) {
  // If row is object, use attachment_type, else use row as value
  let val = row
  if (typeof row === 'object' && row !== null) {
      val = row.attachment_type
  }

  let label
  attachment.options.value.forEach((item) => {
    if (item.value == val) {
      label = item.label
    }
  })
  return label
}

function getUserAuth() {
  proxy.$request(proxy.$api.checkMenuAuth, {
    resourcepath: proxy.$route.name,
  }).then((r) => {
    userAuth.value = r.data[0]
  })
}

function handleTableAction({ action, row }) {
  if (action === 'edit') {
    editItem(null, row)
  } else if (action === 'export') {
    exportItem(row)
  } else if (action === 'delete') {
    deleteItem(null, row)
  } else if (action === 'detail') {
    viewDetail(row)
  }
}

function handleRowClick(row) {
  console.log('Row clicked:', row)
}

function viewDetail(row) {
  getDataByID(row.id)
  manufacturer.detailFormVisible = true
}

function displayValue(value) {
  if (value === 0) {
    return 0
  }
  return value && value !== '' ? value : '--'
}

function displayYnFlag(value) {
  if (value === 'Y') {
    return c.value.Y
  }
  if (value === 'N') {
    return c.value.N
  }
  return '--'
}

function displayProductFlag(value) {
  if (value === 'Y') {
    return l.value.product
  }
  if (value === 'N') {
    return l.value.exploit
  }
  return '--'
}

function displayAuthorizationStatus(value) {
  if (!value) {
    return '--'
  }
  const match = optionsAuthorizationStatus.value.find((item) => item.value === value)
  return match ? match.label : value
}

function downloadAllAttachments(manufacturerId) {
  if (!manufacturerId) {
    proxy.$message.warning(c.value.no_data)
    return
  }
  const url = api.baseUrl + '/Compliance/complianceManufacturer/downloadAttachments'
  const fileName = (manufacturer.data.name_zh || 'manufacturer') + '_attachments.zip'

  axios({
    headers: {
      token: getToken(),
    },
    responseType: 'blob',
    method: 'get',
    url: url + '?id=' + encodeURIComponent(manufacturerId),
  })
    .then((response) => {
      const blob = new Blob([response.data])
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = fileName
      document.body.appendChild(a)
      a.click()
      URL.revokeObjectURL(a.href)
      document.body.removeChild(a)
      proxy.$message.success(c.value.success)
    })
    .catch((error) => {
      console.log(error)
      proxy.$message.error(c.value.fail)
    })
}

function downAttachments(data) {
  if (!data) {
    proxy.$message.warning(c.value.no_data)
    return
  }

  if (!data.id) {
    const fallbackUrl = api.baseUrl + '/' + data.file_url
    const fallbackName =
      data.file_name || data.fileName || fallbackUrl.split('/').pop() || 'download'
    const link = document.createElement('a')
    link.href = fallbackUrl
    link.download = fallbackName
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    return
  }

  const requestUrl =
    api.baseUrl +
    '/Compliance/complianceManufacturer/downloadAttachment?attachmentId=' +
    encodeURIComponent(data.id)
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

watch(() => contactInfo.dialogFormVisible, (val) => {
  if (!val) {
    contactInfo.editIndex = -1
    contactInfo.data = {}
  }
})

watch(() => address.dialogFormVisible, (val) => {
  if (!val) {
    address.editIndex = -1
    address.data = {}
  }
})

watch(userAuth, (newV) => {
  showAuth.m_add = newV.m_add == 'Y'
  showAuth.m_search = newV.m_search == 'Y'
  showAuth.m_del = newV.m_del == 'Y'
  showAuth.m_updata = newV.m_updata == 'Y'
  showAuth.m_import = newV.m_import == 'Y'
  showAuth.m_export = newV.m_export == 'Y'
  showAuth.m_upload = newV.m_upload == 'Y'
  showAuth.m_audit = newV.m_audit == 'Y'
  showAuth.m_print = newV.m_print == 'Y'
}, { deep: true })

onMounted(() => {
  getList()
  getUserAuth()
})
</script>

<style scoped>
.el-button + .el-button {
  margin-left: 0px !important;
}
</style>
