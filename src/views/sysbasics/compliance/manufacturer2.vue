<template>
  <div class="app-container">
    <input type="file" ref="fileInput" style="display: none" @change="fileChange" />

    <!-- Search Section -->
    <div class="search-section">
      <el-card shadow="never" class="search-card">
        <div class="search-form">
          <!-- Search fields -->
          <div class="search-fields">
            <div class="field-row">
              <div class="field-group">
                <label class="field-label">{{ $l.manufacture_name }}</label>
                <el-input :placeholder="$l.input_manufacture_name" v-model="manufacturer.query.manufacture_name" clearable class="search-input" />
              </div>
              <div class="field-group">
                <label class="field-label">{{ $l.addr }}</label>
                <el-input :placeholder="$l.addr" v-model="manufacturer.query.addr" clearable class="search-input" />
              </div>
              <div class="field-group">
                <label class="field-label">{{ $l.legal_person }}</label>
                <el-input :placeholder="$l.input_legal_person" v-model="manufacturer.query.legal_person" clearable class="search-input" />
              </div>
            </div>
            <div class="field-row">
              <div class="field-group">
                <label class="field-label">{{ $l.fileName }}</label>
                <el-input :placeholder="$l.input_fileName" v-model="manufacturer.query.fileName" clearable class="search-input" />
              </div>
              <div class="field-group">
                <label class="field-label">{{ $l.produce_processes }}</label>
                <el-input :placeholder="$l.input_produce_processes" v-model="manufacturer.query.produce_processes" clearable class="search-input" />
              </div>
              <div class="field-group">
                <label class="field-label">{{ $l.requestor_facility_type }}</label>
                <el-select v-model="manufacturer.query.requestor_facility_type" :placeholder="$l.input_requestor_facility_type" clearable class="search-input">
                  <el-option label="T1SC" value="T1SC"></el-option>
                  <el-option label="T2" value="T2"></el-option>
                </el-select>
              </div>
            </div>
          </div>
          
          <!-- Search buttons -->
          <div class="search-actions">
            <el-button v-show="showAuth.m_search" type="primary" icon="el-icon-search" @click="getList" class="search-button">
              {{ $c.queryButton }}
            </el-button>
            <el-button v-show="showAuth.m_search" icon="el-icon-refresh-left" @click="reset" class="reset-button">
              {{ $c.reset }}
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- Action Bar -->
    <div class="action-bar">
      <div class="action-buttons">
        <el-button v-show="showAuth.m_add" type="primary" icon="el-icon-plus" @click="add" class="action-btn primary-btn">
          {{ $c.create }}
        </el-button>
        <el-button v-show="showAuth.m_export" type="success" icon="el-icon-download" @click="exportExcel" class="action-btn success-btn">
          {{ $c.export }}
        </el-button>
        <el-button type="warning" icon="el-icon-upload2" @click="visabled.uploadFile = true" class="action-btn warning-btn">
          {{ $c.m_upload }}
        </el-button>
        <el-button type="info" icon="el-icon-document" @click="exportTemplate" class="action-btn info-btn">
          {{ $l.downloadTemplate }}
        </el-button>
      </div>
    </div>
    <!-- Table Section -->
    <div class="table-section">
      <el-card shadow="never" class="table-card">
        <manufacturer-table :data="manufacturer.list" :isLoading="manufacturer.loading" @action="handleTableAction" @row-click="handleRowClick" class="main-table" />
      </el-card>
    </div>

    <!-- Pagination -->
    <div class="pagination-section">
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
import { _, api, zTable, zForm, zPagination, zFormDialog, initFuncs, eTable, defaultConfig } from '@/views/_common'
import axios from 'axios'
import { getToken, localGet } from '@/utils/auth'
import filePreviews from '../../_common/filePreviews.vue'
import CustomDialog from '../../_common/CustomDialog.vue'
import SparkMD5 from 'spark-md5'
import ManufacturerTable from './manufacturer-table.vue'

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
      ;(this.manufacturer.data = {
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
/* ===== MAIN CONTAINER ===== */
.app-container {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

/* ===== SEARCH SECTION ===== */
.search-section {
  margin-bottom: 24px;
}

.search-card {
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}

.search-form {
  display: flex;
  gap: 24px;
  align-items: flex-end;
}

.search-fields {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-row {
  display: flex;
  gap: 16px;
}

.field-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field-label {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 0;
}

.search-input {
  width: 100%;
}

.search-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-width: 160px;
}

.search-button {
  min-width: 140px;
}

.reset-button {
  min-width: 140px;
}

/* ===== ACTION BAR ===== */
.action-bar {
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.action-btn {
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
}

.primary-btn:hover {
  background: #66b1ff;
  border-color: #66b1ff;
}

.success-btn:hover {
  background: #85ce61;
  border-color: #85ce61;
}

.warning-btn:hover {
  background: #ebb563;
  border-color: #ebb563;
}

.info-btn:hover {
  background: #a6a9ad;
  border-color: #a6a9ad;
}

/* ===== TABLE SECTION ===== */
.table-section {
  margin-bottom: 20px;
}

.table-card {
  border: 1px solid #e4e7ed;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}

.main-table {
  height: 600px;
}

/* ===== PAGINATION ===== */
.pagination-section {
  display: flex;
  justify-content: flex-end;
  padding: 16px 0;
}

.custom-pagination {
  background: #ffffff;
  padding: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}

/* ===== FORM DIALOG STYLES ===== */
.form-container {
  padding: 0;
}

.form-section {
  background: #ffffff;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  margin-bottom: 24px;
  overflow: hidden;
}

.section-header {
  background: #f8f9fa;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #e4e7ed;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title i {
  color: #409eff;
  font-size: 18px;
}

.form-content {
  padding: 24px 20px;
}

.form-row {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 0;
}

.form-label.required::after {
  content: ' *';
  color: #f56c6c;
}

.form-input {
  width: 100%;
}

.number-input {
  width: 100%;
}

.date-picker {
  width: 100%;
}

.radio-group-container {
  margin-top: 4px;
}

.custom-radio-group {
  display: flex;
  gap: 16px;
}

.add-section-button {
  border-radius: 6px;
  font-weight: 500;
}

/* ===== TABLE CONTAINERS ===== */
.table-container {
  padding: 16px 20px 20px;
  border-radius: 0px!important;
  border: 0px!important;
}

.form-table {
  border: 1px solid #e4e7ed;
  border-radius: 6px;
  overflow: hidden;
}

.delete-action-button {
  color: #f56c6c;
  padding: 4px 8px;
}

.delete-action-button:hover {
  color: #f78989;
  background: rgba(245, 108, 108, 0.1);
}

/* ===== DIALOG FOOTER ===== */
.dialog-footer {
  padding: 16px 24px;
  background: #f8f9fa;
  border-top: 1px solid #e4e7ed;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.dialog-cancel-button {
  padding: 10px 20px;
  border-radius: 6px;
}

.dialog-confirm-button {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
}

/* ===== DETAIL DIALOG ===== */
.detail-container {
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 0;
  background: #f8f9fa;
  border-radius: 8px;
}

/* Detail Header */
.detail-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 24px 32px;
  border-radius: 8px 8px 0 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: -24px -24px 0 -24px;
}

.manufacturer-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.manufacturer-name {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
  color: white;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-success {
  background: rgba(103, 194, 58, 0.2);
  color: #67c23a;
  border: 1px solid rgba(103, 194, 58, 0.3);
}

.status-warning {
  background: rgba(230, 162, 60, 0.2);
  color: #e6a23c;
  border: 1px solid rgba(230, 162, 60, 0.3);
}

.status-danger {
  background: rgba(245, 108, 108, 0.2);
  color: #f56c6c;
  border: 1px solid rgba(245, 108, 108, 0.3);
}

.status-default {
  background: rgba(144, 147, 153, 0.2);
  color: #909399;
  border: 1px solid rgba(144, 147, 153, 0.3);
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn-header {
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  color: white;
  backdrop-filter: blur(10px);
}

.action-btn-header:hover {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

/* Overview Cards */
.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 0 24px;
  margin-top: 24px;
}

.overview-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid #e4e7ed;
  transition: transform 0.2s, box-shadow 0.2s;
}

.overview-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.card-content {
  flex: 1;
}

.card-label {
  font-size: 14px;
  color: #909399;
  margin-bottom: 4px;
  font-weight: 500;
}

.card-value {
  font-size: 18px;
  font-weight: 600;
  color: #303133;
  word-break: break-all;
}

/* Detail Sections */
.detail-sections {
  padding: 0 24px 24px;
}

.detail-section {
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 12px;
  margin-bottom: 24px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.detail-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.section-title i {
  color: #409eff;
  font-size: 18px;
}

.record-count {
  background: #409eff;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.section-content {
  padding: 24px;
}

/* Custom Descriptions */
.custom-descriptions {
  margin: 0;
}

.custom-descriptions .el-descriptions__body .el-descriptions__table .el-descriptions__cell {
  padding: 12px 16px;
}

.custom-descriptions .el-descriptions__label {
  font-weight: 600;
  color: #606266;
  background: #f8f9fa;
}

.custom-descriptions .el-descriptions__content {
  color: #303133;
}

/* Custom Table */
.custom-table {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: none;
}

.custom-table .el-table__header {
  background: #f8f9fa;
}

.custom-table .el-table__header th {
  background: #f8f9fa;
  color: #606266;
  font-weight: 600;
  border-bottom: 2px solid #e4e7ed;
}

.custom-table .el-table__row:hover > td {
  background: #f0f7ff;
}

.custom-table .el-table--striped .el-table__body tr.el-table__row--striped td {
  background: #fafbfc;
}

/* Action Links */
.action-link {
  color: #409eff;
  padding: 4px 8px;
  margin-right: 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.action-link:hover {
  background: rgba(64, 158, 255, 0.1);
  color: #66b1ff;
}

.action-link i {
  margin-right: 4px;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #909399;
}

.empty-icon {
  font-size: 64px;
  color: #c0c4cc;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  color: #909399;
}

/* Detail Footer */
.detail-footer {
  padding: 20px 32px;
  background: #f8f9fa;
  border-top: 1px solid #e4e7ed;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.cancel-button {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Responsive Design for Detail Dialog */
@media (max-width: 1200px) {
  .detail-header {
    flex-direction: column;
    gap: 16px;
    text-align: center;
  }

  .overview-cards {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
  }

  .overview-card {
    padding: 16px;
  }

  .custom-descriptions {
    column-count: 1;
  }
}

@media (max-width: 768px) {
  .detail-header {
    padding: 16px 20px;
    margin: -20px -20px 0 -20px;
  }

  .manufacturer-name {
    font-size: 20px;
  }

  .overview-cards {
    grid-template-columns: 1fr;
    padding: 0 16px;
  }

  .detail-sections {
    padding: 0 16px 16px;
  }

  .section-content {
    padding: 16px;
  }

  .detail-footer {
    padding: 16px 20px;
  }
}

.detail-section {
  background: #f9f9f9;
  padding: 16px;
  border-radius: 6px;
}
/* 
.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  border-bottom:  2px solid #409eff;
  padding-bottom: 8px;
} */

.manufacturer-detail-dialog .el-descriptions {
  margin-bottom: 0;
}

.manufacturer-detail-dialog .el-table {
  margin-bottom: 0;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1200px) {
  .form-row {
    flex-direction: column;
    gap: 16px;
  }

  .field-row {
    flex-direction: column;
    gap: 12px;
  }

  .search-form {
    flex-direction: column;
    align-items: stretch;
  }

  .search-actions {
    flex-direction: row;
    min-width: auto;
  }
}

@media (max-width: 768px) {
  .app-container {
    padding: 16px;
  }

  .action-buttons {
    flex-wrap: wrap;
  }

  .action-btn {
    flex: 1;
    min-width: 120px;
  }
}

/* Form container styling - đơn giản như modal create */
.form-container .form-section {
  margin-bottom: 24px;
}

.form-container .form-section:last-child {
  margin-bottom: 0;
}

.form-container .form-section .section-header {
  padding: 10px 15px;
  border-bottom: 1px solid #e1e4e8;
}

.form-container .form-section .section-header .section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-container .form-section .section-header .section-title i {
  font-size: 18px;
  color: #3b82f6;
}

.form-container .form-section .form-content .detail-descriptions .el-descriptions .el-descriptions__header {
  display: none;
}

.form-container .form-section .form-content .detail-descriptions .el-descriptions .el-descriptions__body .el-descriptions__table {
  border: 1px solid #e1e4e8;
}

.form-container .form-section .form-content .detail-descriptions .el-descriptions .el-descriptions__body .el-descriptions__table .el-descriptions__cell {
  border-color: #e1e4e8;
  padding: 12px 16px;
}

.form-container .form-section .form-content .detail-descriptions .el-descriptions .el-descriptions__body .el-descriptions__table .el-descriptions__cell.el-descriptions__label {
  background-color: #f8fafc;
  font-weight: 500;
  color: #374151;
  width: 30%;
}

.form-container .form-section .form-content .detail-descriptions .el-descriptions .el-descriptions__body .el-descriptions__table .el-descriptions__cell.el-descriptions__content {
  color: #1f2937;
}

.form-container .form-section .table-container .form-table .el-table__header-wrapper .el-table__header th {
  background-color: #f8fafc;
  color: #374151;
  font-weight: 500;
  border-bottom: 2px solid #e1e4e8;
}

.form-container .form-section .table-container .form-table .el-table__body-wrapper .el-table__body tr:hover {
  background-color: #f8fafc;
}

.form-container .form-section .table-container .form-table .el-table__body-wrapper .el-table__body tr td {
  border-bottom: 1px solid #f1f5f9;
  color: #1f2937;
}

.el-button+.el-button{
  margin-left: 0px!important;
}
</style>
