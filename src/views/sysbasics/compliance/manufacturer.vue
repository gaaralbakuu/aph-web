<template>
  <div class="app-container">
    <input type="file" ref="fileInput" style="display: none" @change="fileChange" />

    <!-- 查询区域 -->
    <div>
      <div style="display: flex; gap: 16px; margin-bottom: 10px">
        <!-- Left: search fields in columns -->
        <div style="flex: 1; display: flex; flex-direction: column; gap: 12px">
          <div style="display: flex; gap: 12px">
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
              <label>{{ $l.manufacture_name }}</label>
              <el-input :placeholder="$l.input_manufacture_name" v-model="manufacturer.query.manufacture_name" style="width: 100%" clearable />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
              <label>{{ $l.addr }}</label>
              <el-input :placeholder="$l.addr" v-model="manufacturer.query.addr" style="width: 100%" clearable />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
              <label>{{ $l.legal_person }}</label>
              <el-input :placeholder="$l.input_legal_person" v-model="manufacturer.query.legal_person" style="width: 100%" clearable />
            </div>
          </div>
          <div style="display: flex; gap: 12px">
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
              <label>{{ $l.fileName }}</label>
              <el-input :placeholder="$l.input_fileName" v-model="manufacturer.query.fileName" style="width: 100%" clearable />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
              <label>{{ $l.produce_processes }}</label>
              <el-input :placeholder="$l.input_produce_processes" v-model="manufacturer.query.produce_processes" style="width: 100%" clearable />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
              <label>{{ $l.requestor_facility_type }}</label>
              <el-select v-model="manufacturer.query.requestor_facility_type" :placeholder="$l.input_requestor_facility_type" clearable style="width: 100%">
                <el-option label="T1" value="T1"></el-option>
                <el-option label="T2" value="T2"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <!-- Right: buttons -->
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-end; min-width: 160px; gap: 12px;">
          <el-button v-show="showAuth.m_search" type="primary" size="medium" @click="getList" style="margin-right: 8px">{{ $c.queryButton }}</el-button>
          <el-button v-show="showAuth.m_search" type="info" size="medium" @click="reset">{{ $l.reset }}</el-button>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <el-button v-show="showAuth.m_add" type="primary" class="create_btn" size="medium" @click="add">{{ $c.create }}</el-button>
    <el-button v-show="showAuth.m_export" type="success" class="create_btn" size="medium" @click="exportExcel">{{ $c.export }}</el-button>
    <el-button type="warning" size="medium" @click="visabled.uploadFile = true">{{ $c.m_upload }}</el-button>
    <el-button type="warning" size="medium" @click="exportTemplate">{{ $c.downloadTemplate }}</el-button>
    <!-- 表格 -->
    <template>
      <el-table :data="manufacturer.list" style="width: 100%">
        <el-table-column :label="$l.basic">
          <el-table-column type="index" :index="indexMethod" :label="$l.num" width="60"></el-table-column>
          <el-table-column prop="name_zh" :label="$l.manufacture_name"></el-table-column>
          <el-table-column :label="$l.addr">
            <template slot-scope="scope">
              <el-button @click.native.prevent="checkArrdess(scope.$index, scope.row)" type="text" size="small">
                {{ $l.check_addr }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="legal_person" :label="$l.legal_person"></el-table-column>
          <el-table-column prop="requestor_facility_name" :label="$l.requestor_facility_name"></el-table-column>
        </el-table-column>
        <el-table-column :label="$l.compliance_evidence">
          <el-table-column prop="province" :label="$l.business_license">
            <template slot-scope="scope">
              <el-button @click.native.prevent="check0A(scope.$index, scope.row)" type="text" size="small">
                {{ $l.chenck_attachment }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="NDA">
            <template slot-scope="scope">
              <el-button @click.native.prevent="check0B(scope.$index, scope.row)" type="text" size="small">
                {{ $l.chenck_attachment }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column :label="$l.other_attachment">
            <template slot-scope="scope">
              <el-button @click.native.prevent="check0C(scope.$index, scope.row)" type="text" size="small">
                {{ $l.chenck_attachment }}
              </el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column fixed="right" :label="$c.operation" width="120">
          <template slot-scope="scope">
            <el-link v-show="showAuth.m_updata" type="primary" @click.native.prevent="editItem(scope.$index, scope.row)">
              {{ $c.edit }}
            </el-link>
            <el-link v-show="showAuth.m_export" type="success" @click.native.prevent="exportItem(scope.row)">
              {{ $c.export }}
            </el-link>
            <el-link v-show="showAuth.m_del" type="danger" @click.native.prevent="deleteItem(scope.$index, scope.row)">
              {{ $c.delete }}
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <z-pagination :pagination="pagination" :total="manufacturer.query.total" :page.sync="manufacturer.query.curPage" :limit.sync="manufacturer.query.pageSize" @change="getList"></z-pagination>
    <!-- 创建/编辑窗口 -->
    <CustomDialog
      :title="$l.add_manufacturer"
      :visible.sync="manufacturer.addOrEditFormVisible"
      :clickOutside="false"
      width="85%"
      custom-class="scrollable-dialog manufacturer-form-dialog"
    >
      <template #content>
        <div class="form-container">
          <!-- Basic Information Section -->
          <div style="display: flex; flex-direction: column; gap: 24px;">
            <div style="display: flex; gap: 16px;">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ $l.manufacture_name_CN }}</label>
                <el-input :placeholder="$l.input_manufacture_name_CN" v-model="manufacturer.data.name_zh" clearable class="form-input" />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ $l.manufacture_name_US }}</label>
                <el-input :placeholder="$l.input_manufacture_name_US" v-model="manufacturer.data.name_en" clearable class="form-input" />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ $l.legal_person }}</label>
                <el-input :placeholder="$l.input_legal_person" v-model="manufacturer.data.legal_person" clearable class="form-input" />
              </div>
            </div>
            <div style="display: flex; gap: 16px;">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ $l.partner_country }}</label>
                <el-input :placeholder="$l.input_partner_country" v-model="manufacturer.data.country" clearable class="form-input" />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ $l.customs_number }}</label>
                <el-input :placeholder="$l.input" v-model="manufacturer.data.customs_number" clearable class="form-input" />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ $l.biz_license_number }}</label>
                <el-input :placeholder="$l.input" v-model="manufacturer.data.biz_license_number" clearable class="form-input" />
              </div>
            </div>

            <!-- Row 3: Radio Groups -->
            <div style="display: flex; gap: 16px;">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ $l.requestor_facility_type }}</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input type="radio" v-model="manufacturer.data.requestor_facility_type" value="T1" />
                    <span class="radio-text">T1</span>
                  </label>
                  <label class="radio-item">
                    <input type="radio" v-model="manufacturer.data.requestor_facility_type" value="T2" />
                    <span class="radio-text">T2</span>
                  </label>
                </div>
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ $l.export_business }}</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input type="radio" v-model="manufacturer.data.is_export_biz" value="Y" />
                    <span class="radio-text">{{ $c.Y }}</span>
                  </label>
                  <label class="radio-item">
                    <input type="radio" v-model="manufacturer.data.is_export_biz" value="N" />
                    <span class="radio-text">{{ $c.N }}</span>
                  </label>
                </div>
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ $l.is_involve_product }}</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input type="radio" v-model="manufacturer.data.is_involve_product" value="Y" />
                    <span class="radio-text">{{ $l.product }}</span>
                  </label>
                  <label class="radio-item">
                    <input type="radio" v-model="manufacturer.data.is_involve_product" value="N" />
                    <span class="radio-text">{{ $l.exploit }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Row 4: Dates + Producer Status -->
            <div style="display: flex; gap: 16px;">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ $l.cooperation_start_date }}</label>
                <el-date-picker
                  v-model="manufacturer.data.cooperation_start_date"
                  type="datetime"
                  :placeholder="$l.input"
                  class="form-input date-picker"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ $l.cooperation_end_date }}</label>
                <el-date-picker
                  v-model="manufacturer.data.cooperation_end_date"
                  type="datetime"
                  :placeholder="$l.input"
                  class="form-input date-picker"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ $l.is_alidas_producer }}</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input type="radio" v-model="manufacturer.data.is_alidas_producer" value="Y" />
                    <span class="radio-text">{{ $c.Y }}</span>
                  </label>
                  <label class="radio-item">
                    <input type="radio" v-model="manufacturer.data.is_alidas_producer" value="N" />
                    <span class="radio-text">{{ $c.N }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Row 5: Company Details + Authorization -->
            <div style="display: flex; gap: 16px;">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ $l.cooperation_company_ownership }}</label>
                <el-input :placeholder="$l.input" v-model="manufacturer.data.cooperation_company_ownership" clearable class="form-input" />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ $l.cooperation_group_name }}</label>
                <el-input :placeholder="$l.input" v-model="manufacturer.data.cooperation_group_name" clearable class="form-input" />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ $l.is_alidas_authorized }}</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input type="radio" v-model="manufacturer.data.is_alidas_authorized" value="Y" />
                    <span class="radio-text">{{ $c.Y }}</span>
                  </label>
                  <label class="radio-item">
                    <input type="radio" v-model="manufacturer.data.is_alidas_authorized" value="N" />
                    <span class="radio-text">{{ $c.N }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Row 6: Facility Information -->
            <div style="display: flex; gap: 16px;">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ $l.requestor_facility_name }}</label>
                <el-input :placeholder="$l.input" v-model="manufacturer.data.requestor_facility_name" clearable class="form-input" />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ $l.requestor_facility_code }}</label>
                <el-input :placeholder="$l.input" v-model="manufacturer.data.requestor_facility_code" clearable class="form-input" />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ $l.requestor_contact_name }}</label>
                <el-input :placeholder="$l.input" v-model="manufacturer.data.requestor_contact_name" clearable class="form-input" />
              </div>
            </div>

            <!-- Row 7: Numbers + Manual ID -->
            <div style="display: flex; gap: 16px;">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ $l.monthly_produce_quantity }}</label>
                <el-input-number
                  v-model="manufacturer.data.monthly_produce_quantity"
                  :min="1"
                  class="form-input number-input"
                  controls-position="right"
                />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ $l.employee_num }}</label>
                <el-input-number
                  v-model="manufacturer.data.employee_num"
                  :min="1"
                  class="form-input number-input"
                  controls-position="right"
                />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ $l.manual_input_id }}</label>
                <el-input :placeholder="$l.input" v-model="manufacturer.data.manual_input_id" clearable class="form-input" />
              </div>
            </div>
          </div>

          <!-- Contact Information Section -->
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">{{ $l.contact_info }}</h3>
              <el-button
                type="primary"
                size="small"
                @click="contactInfoList"
                class="add-button"
              >
                <i class="el-icon-plus"></i>
                {{ $l.addData }}
              </el-button>
            </div>
            <div class="table-container">
              <z-table
                :list="contactInfo.list"
                :tableProps="tableProps"
                :columns="contactInfo.columns"
                @deleteItem="contactInfoDeleteItem"
                class="custom-table"
              >
                <template v-slot:operation="v">
                  <el-button
                    type="text"
                    size="small"
                    class="delete-button"
                    @click="contactInfoDeleteItem(v.row, v.$index)"
                  >
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
              <h3 class="section-title">{{ $l.addr_and_processes }}</h3>
              <el-button
                type="primary"
                size="small"
                @click="addressList"
                class="add-button"
              >
                <i class="el-icon-plus"></i>
                {{ $l.addData }}
              </el-button>
            </div>
            <div class="table-container">
              <z-table
                :list="address.list"
                :tableProps="tableProps"
                :columns="address.columns"
                @deleteItem="addressDeleteItem"
                class="custom-table"
              >
                <template v-slot:operation="v">
                  <el-button
                    type="text"
                    size="small"
                    class="delete-button"
                    @click="addressDeleteItem(v.row, v.$index)"
                  >
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
              <h3 class="section-title">{{ $l.compliance_evidence }}</h3>
              <el-button
                type="primary"
                size="small"
                @click="createFileData"
                class="add-button"
              >
                <i class="el-icon-plus"></i>
                {{ $l.add_attachments }}
              </el-button>
            </div>
            <div class="table-container">
              <z-table
                :list="attachment.list"
                :tableProps="tableProps"
                :columns="attachment.columns"
                @deleteItem="attachmentDeleteItem"
                class="custom-table"
              >
                <template v-slot:operation="v">
                  <el-button
                    type="text"
                    size="small"
                    class="delete-button"
                    @click="attachmentDeleteItem(v.row, v.$index)"
                  >
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
        <el-button @click="manufacturer.addOrEditFormVisible = false" class="cancel-button">{{ $c.cancel }}</el-button>
        <el-button type="primary" @click="OPenManufacturer" class="confirm-button">{{ $c.confirm }}</el-button>
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
              <el-input
                :placeholder="$l.input"
                v-model="contactInfo.data.contact_name"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$l.contact_job_title">
              <el-input
                :placeholder="$l.input"
                v-model="contactInfo.data.contact_job_title"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$l.contact_phone" prop="contactPhone">
              <el-input
                :placeholder="$l.input"
                v-model="contactInfo.data.contact_phone"
                clearable
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$l.contact_email" prop="contactEmail">
              <el-input
                :placeholder="$l.input"
                v-model="contactInfo.data.contact_email"
                clearable
              />
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
  </div>
</template>

<script>
import { _, api, zTable, zForm, zPagination, zFormDialog, initFuncs, eTable, defaultConfig } from '@/views/_common'
import axios from 'axios'
import { getToken, localGet } from '@/utils/auth'
import filePreviews from '../../_common/filePreviews.vue'
import CustomDialog from '../../_common/CustomDialog.vue'
import SparkMD5 from 'spark-md5'

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
      maxSizeInBytes: 5 * 1024 * 1024,
      fileSizeInBytes: 0,
      manufacturer: {
        list: [],
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
                message: '操作成功',
              })
              this.getList()
            })
            .catch((e) => {
              console.log(e)
              this.$message.error('删除数据异常')
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

<style>
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
  padding: 0px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple-light {
  background: #e5e9f2;
}

.row-bg {
  padding: 5px 0;
  background-color: #f9fafc;
}

.r_input {
  width: 1600px;
}

.r_btn {
  float: right;
  padding: 0;
  margin: 0;
}

.search_tips {
  width: 100px;
  text-align: right;
  font-size: 14px;
  display: inline-block;
  font-family: '微软雅黑';
}

.create_btn {
  margin-bottom: 15px;
}

.scrollable-dialog .el-dialog__body {
  max-height: 70vh;
  /* 设置最大高度，根据需要调整 */
  overflow-y: auto;
  /* 启用垂直滚动条 */
}

.dialog-content {
  padding: 0.125rem;
}

.shadow {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  padding: 10px;
  margin-bottom: 20px;
}

.top-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.text {
  font-size: 14px;
  text-align: center !important;
}

.item {
  margin-bottom: 18px;
}

.el-table .cell,
.el-table--border .el-table__cell:first-child .cell {
  text-align: center !important;
}
</style>
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

<style>
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
  padding: 0px;
}

.bg-purple-dark {
  background: #99a9bf;
}

.bg-purple-light {
  background: #e5e9f2;
}

.row-bg {
  padding: 5px 0;
  background-color: #f9fafc;
}

.r_input {
  width: 1600px;
}

.r_btn {
  float: right;
  padding: 0;
  margin: 0;
}

.search_tips {
  width: 100px;
  text-align: right;
  font-size: 14px;
  display: inline-block;
  font-family: '微软雅黑';
}

.create_btn {
  margin-bottom: 15px;
}

.scrollable-dialog .el-dialog__body {
  max-height: 70vh;
  /* 设置最大高度，根据需要调整 */
  overflow-y: auto;
  /* 启用垂直滚动条 */
}

.dialog-content {
  padding: 0.125rem;
}

.shadow {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  padding: 10px;
  margin-bottom: 20px;
}

.top-title {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 10px;
}

.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}

.text {
  font-size: 14px;
  text-align: center !important;
}

.item {
  margin-bottom: 18px;
}

.el-table .cell,
.el-table--border .el-table__cell:first-child .cell {
  text-align: center !important;
}

.form-contaier{
    display: flex;
    flex-direction: column;
    gap: 20px;
}
</style>
