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
              <label>{{ l.manufacture_name }}</label>
              <el-input :placeholder="l.input_manufacture_name" v-model="manufacturer.query.manufacture_name" style="width: 100%" clearable />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
              <label>{{ l.addr }}</label>
              <el-input :placeholder="l.addr" v-model="manufacturer.query.addr" style="width: 100%" clearable />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
              <label>{{ l.legal_person }}</label>
              <el-input :placeholder="l.input_legal_person" v-model="manufacturer.query.legal_person" style="width: 100%" clearable />
            </div>
          </div>
          <div style="display: flex; gap: 12px">
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
              <label>{{ l.fileName }}</label>
              <el-input :placeholder="l.input_fileName" v-model="manufacturer.query.fileName" style="width: 100%" clearable />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
              <label>{{ l.produce_processes }}</label>
              <el-input :placeholder="l.input_produce_processes" v-model="manufacturer.query.produce_processes" style="width: 100%" clearable />
            </div>
            <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
              <label>{{ l.requestor_facility_type }}</label>
              <el-select v-model="manufacturer.query.requestor_facility_type" :placeholder="l.input_requestor_facility_type" clearable style="width: 100%">
                <el-option label="T1SC" value="T1SC"></el-option>
                <el-option label="T2" value="T2"></el-option>
              </el-select>
            </div>
          </div>
        </div>
        <!-- Right: buttons -->
        <div style="display: flex; flex-direction: column; justify-content: center; align-items: flex-end; min-width: 160px; gap: 12px;">
          <el-button v-show="showAuth.m_search" type="primary" size="medium" @click="getList" style="margin-right: 8px">{{ c.queryButton }}</el-button>
          <el-button v-show="showAuth.m_search" type="info" size="medium" @click="reset">{{ l.reset }}</el-button>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <el-button v-show="showAuth.m_add" type="primary" class="create_btn" size="medium" @click="add">{{ c.create }}</el-button>
    <el-button v-show="showAuth.m_export" type="success" class="create_btn" size="medium" @click="exportExcel">{{ c.export }}</el-button>
    <el-button type="warning" size="medium" @click="visabled.uploadFile = true">{{ c.m_upload }}</el-button>
    <el-button type="warning" size="medium" @click="exportTemplate">{{ c.downloadTemplate }}</el-button>
    <!-- 表格 -->
    <template>
      <el-table :data="manufacturer.list" style="width: 100%">
        <el-table-column :label="l.basic">
          <el-table-column type="index" :index="indexMethod" :label="l.num" width="60"></el-table-column>
          <el-table-column prop="name_zh" :label="l.manufacture_name"></el-table-column>
          <el-table-column :label="l.addr">
            <template slot-scope="scope">
              <el-button @click.native.prevent="checkArrdess(scope.$index, scope.row)" type="text" size="small">
                {{ l.check_addr }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="legal_person" :label="l.legal_person"></el-table-column>
          <el-table-column prop="requestor_facility_name" :label="l.requestor_facility_name"></el-table-column>
        </el-table-column>
        <el-table-column :label="l.compliance_evidence">
          <el-table-column prop="province" :label="l.business_license">
            <template slot-scope="scope">
              <el-button @click.native.prevent="check0A(scope.$index, scope.row)" type="text" size="small">
                {{ l.chenck_attachment }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="NDA">
            <template slot-scope="scope">
              <el-button @click.native.prevent="check0B(scope.$index, scope.row)" type="text" size="small">
                {{ l.chenck_attachment }}
              </el-button>
            </template>
          </el-table-column>
          <el-table-column :label="l.other_attachment">
            <template slot-scope="scope">
              <el-button @click.native.prevent="check0C(scope.$index, scope.row)" type="text" size="small">
                {{ l.chenck_attachment }}
              </el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column fixed="right" :label="c.operation" width="120">
          <template slot-scope="scope">
            <el-link v-show="showAuth.m_updata" type="primary" @click.native.prevent="editItem(scope.$index, scope.row)">
              {{ c.edit }}
            </el-link>
            <el-link v-show="showAuth.m_export" type="success" @click.native.prevent="exportItem(scope.row)">
              {{ c.export }}
            </el-link>
            <el-link v-show="showAuth.m_del" type="danger" @click.native.prevent="deleteItem(scope.$index, scope.row)">
              {{ c.delete }}
            </el-link>
          </template>
        </el-table-column>
      </el-table>
    </template>
    <!-- 分页 -->
    <z-pagination :pagination="pagination" :total="manufacturer.query.total" :page.sync="manufacturer.query.curPage" :limit.sync="manufacturer.query.pageSize" @change="getList"></z-pagination>
    <!-- 创建/编辑窗口 -->
    <CustomDialog
      :title="l.add_manufacturer"
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
                <label class="form-label">{{ l.manufacture_name_CN }}</label>
                <el-input :placeholder="l.input_manufacture_name_CN" v-model="manufacturer.data.name_zh" clearable class="form-input" />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.manufacture_name_US }}</label>
                <el-input :placeholder="l.input_manufacture_name_US" v-model="manufacturer.data.name_en" clearable class="form-input" />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.legal_person }}</label>
                <el-input :placeholder="l.input_legal_person" v-model="manufacturer.data.legal_person" clearable class="form-input" />
              </div>
            </div>
            <div style="display: flex; gap: 16px;">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.partner_country }}</label>
                <el-input :placeholder="l.input_partner_country" v-model="manufacturer.data.country" clearable class="form-input" />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.customs_number }}</label>
                <el-input :placeholder="l.input" v-model="manufacturer.data.customs_number" clearable class="form-input" />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.biz_license_number }}</label>
                <el-input :placeholder="l.input" v-model="manufacturer.data.biz_license_number" clearable class="form-input" />
              </div>
            </div>

            <!-- Row 3: Radio Groups -->
            <div style="display: flex; gap: 16px;">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.requestor_facility_type }}</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input type="radio" v-model="manufacturer.data.requestor_facility_type" value="T1SC" />
                    <span class="radio-text">T1SC</span>
                  </label>
                  <label class="radio-item">
                    <input type="radio" v-model="manufacturer.data.requestor_facility_type" value="T2" />
                    <span class="radio-text">T2</span>
                  </label>
                </div>
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.export_business }}</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input type="radio" v-model="manufacturer.data.is_export_biz" value="Y" />
                    <span class="radio-text">{{ c.Y }}</span>
                  </label>
                  <label class="radio-item">
                    <input type="radio" v-model="manufacturer.data.is_export_biz" value="N" />
                    <span class="radio-text">{{ c.N }}</span>
                  </label>
                </div>
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.is_involve_product }}</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input type="radio" v-model="manufacturer.data.is_involve_product" value="Y" />
                    <span class="radio-text">{{ l.product }}</span>
                  </label>
                  <label class="radio-item">
                    <input type="radio" v-model="manufacturer.data.is_involve_product" value="N" />
                    <span class="radio-text">{{ l.exploit }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Row 4: Dates + Producer Status -->
            <div style="display: flex; gap: 16px;">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.cooperation_start_date }}</label>
                <el-date-picker
                  v-model="manufacturer.data.cooperation_start_date"
                  type="datetime"
                  :placeholder="l.input"
                  class="form-input date-picker"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.cooperation_end_date }}</label>
                <el-date-picker
                  v-model="manufacturer.data.cooperation_end_date"
                  type="datetime"
                  :placeholder="l.input"
                  class="form-input date-picker"
                  format="yyyy-MM-dd HH:mm:ss"
                  value-format="yyyy-MM-dd HH:mm:ss"
                />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.is_alidas_producer }}</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input type="radio" v-model="manufacturer.data.is_alidas_producer" value="Y" />
                    <span class="radio-text">{{ c.Y }}</span>
                  </label>
                  <label class="radio-item">
                    <input type="radio" v-model="manufacturer.data.is_alidas_producer" value="N" />
                    <span class="radio-text">{{ c.N }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Row 5: Company Details + Authorization -->
            <div style="display: flex; gap: 16px;">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.cooperation_company_ownership }}</label>
                <el-input :placeholder="l.input" v-model="manufacturer.data.cooperation_company_ownership" clearable class="form-input" />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.cooperation_group_name }}</label>
                <el-input :placeholder="l.input" v-model="manufacturer.data.cooperation_group_name" clearable class="form-input" />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.is_alidas_authorized }}</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input type="radio" v-model="manufacturer.data.is_alidas_authorized" value="Y" />
                    <span class="radio-text">{{ c.Y }}</span>
                  </label>
                  <label class="radio-item">
                    <input type="radio" v-model="manufacturer.data.is_alidas_authorized" value="N" />
                    <span class="radio-text">{{ c.N }}</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- Row 6: Facility Information -->
            <div style="display: flex; gap: 16px;">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.requestor_facility_name }}</label>
                <el-input :placeholder="l.input" v-model="manufacturer.data.requestor_facility_name" clearable class="form-input" />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.requestor_facility_code }}</label>
                <el-input :placeholder="l.input" v-model="manufacturer.data.requestor_facility_code" clearable class="form-input" />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.requestor_contact_name }}</label>
                <el-input :placeholder="l.input" v-model="manufacturer.data.requestor_contact_name" clearable class="form-input" />
              </div>
            </div>

            <!-- Row 7: Numbers + Manual ID -->
            <div style="display: flex; gap: 16px;">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.monthly_produce_quantity }}</label>
                <el-input-number
                  v-model="manufacturer.data.monthly_produce_quantity"
                  :min="1"
                  class="form-input number-input"
                  controls-position="right"
                />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.employee_num }}</label>
                <el-input-number
                  v-model="manufacturer.data.employee_num"
                  :min="1"
                  class="form-input number-input"
                  controls-position="right"
                />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.manual_input_id }}</label>
                <el-input :placeholder="l.input" v-model="manufacturer.data.manual_input_id" clearable class="form-input" />
              </div>
            </div>

            <!-- Row 8: New Fields - Part 1 -->
            <div style="display: flex; gap: 16px;">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.vendor_code }}</label>
                <el-input :placeholder="l.input_vendor_code" v-model="manufacturer.data.vendor_code" clearable class="form-input" />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.unique_identifier }}</label>
                <el-input :placeholder="l.input_unique_identifier" v-model="manufacturer.data.unique_identifier" clearable class="form-input" />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.ffc_id }}</label>
                <el-input :placeholder="l.input_ffc_id" v-model="manufacturer.data.ffc_id" clearable class="form-input" />
              </div>
            </div>

            <!-- Row 9: New Fields - Part 2 -->
            <div style="display: flex; gap: 16px;">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.sap_code }}</label>
                <el-input :placeholder="l.input_sap_code" v-model="manufacturer.data.sap_code" clearable class="form-input" />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.classification }}</label>
                <el-input :placeholder="l.input_classification" v-model="manufacturer.data.classification" clearable class="form-input" />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.authorization_status }}</label>
                <el-select v-model="manufacturer.data.authorization_status" placeholder="Select" class="form-input">
                  <el-option v-for="item in options_authorization_status" :key="item.value" :label="item.label" :value="item.value" />
                </el-select>
              </div>
            </div>

            <!-- Row 10: New Fields - Part 3 -->
            <div style="display: flex; gap: 16px;">
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.compliance_warning_letter }}</label>
                <el-input :placeholder="l.input_compliance_warning_letter" v-model="manufacturer.data.compliance_warning_letter" clearable class="form-input" />
              </div>
              <div style="flex: 1; display: flex; flex-direction: column; gap: 6px;">
                <label class="form-label">{{ l.types_of_orders }}</label>
                <el-input :placeholder="l.input_types_of_orders" v-model="manufacturer.data.types_of_orders" clearable class="form-input" />
              </div>
              <div style="flex: 1;"></div>
            </div>
          </div>

          <!-- Contact Information Section -->
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">{{ l.contact_info }}</h3>
              <el-button
                type="primary"
                size="small"
                @click="contactInfoList"
                class="add-button"
              >
                <i class="el-icon-plus"></i>
                {{ l.addData }}
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
                    {{ c.delete }}
                  </el-button>
                </template>
              </z-table>
            </div>
          </div>

          <!-- Address & Processes Section -->
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">{{ l.addr_and_processes }}</h3>
              <el-button
                type="primary"
                size="small"
                @click="addressList"
                class="add-button"
              >
                <i class="el-icon-plus"></i>
                {{ l.addData }}
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
                    {{ c.delete }}
                  </el-button>
                </template>
              </z-table>
            </div>
          </div>

          <!-- Compliance Evidence Section -->
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">{{ l.compliance_evidence }}</h3>
              <el-button
                type="primary"
                size="small"
                @click="createFileData"
                class="add-button"
              >
                <i class="el-icon-plus"></i>
                {{ l.add_attachments }}
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
                    {{ c.delete }}
                  </el-button>
                </template>
              </z-table>
            </div>
          </div>
        </div>
      </template>
      <span slot="footer" class="dialog-footer">
        <el-button @click="manufacturer.addOrEditFormVisible = false" class="cancel-button">{{ c.cancel }}</el-button>
        <el-button type="primary" @click="OPenManufacturer" class="confirm-button">{{ c.confirm }}</el-button>
      </span>
    </CustomDialog>
    <!-- 确认信息窗口 -->
    <el-dialog :title="l.confirm_info" :visible.sync="manufacturer.inforFormVisible" width="40%">
      <el-descriptions :title="l.basic">
        <el-descriptions-item :label="l.manufacture_name_CN">
          {{ manufacturer.data.name_zh }}
        </el-descriptions-item>
        <el-descriptions-item :label="l.manufacture_name_US">
          {{ manufacturer.data.name_en }}
        </el-descriptions-item>
        <el-descriptions-item :label="l.requestor_facility_name">
          {{ manufacturer.data.requestor_facility_type }}
        </el-descriptions-item>
        <el-descriptions-item :label="l.legal_person">
          {{ manufacturer.data.legal_person }}
        </el-descriptions-item>
        <el-descriptions-item :label="l.partner_country">
          {{ manufacturer.data.country }}
        </el-descriptions-item>
        <el-descriptions-item :label="l.export_business">
          {{ manufacturer.data.is_export_biz }}
        </el-descriptions-item>
        <el-descriptions-item :label="l.customs_number">
          {{ manufacturer.data.customs_number }}
        </el-descriptions-item>
        <el-descriptions-item :label="l.biz_license_number">
          {{ manufacturer.data.biz_license_number }}
        </el-descriptions-item>
        <el-descriptions-item :label="l.is_involve_product">
          {{ manufacturer.data.is_involve_product }}
        </el-descriptions-item>
        <el-descriptions-item :label="l.cooperation_start_date">
          {{ Sdate }}
        </el-descriptions-item>
        <!-- <el-descriptions-item :label="l.cooperation_end_date">{{
          Edate
        }}</el-descriptions-item> -->
        <el-descriptions-item :label="l.is_alidas_producer">
          {{ manufacturer.data.is_alidas_producer }}
        </el-descriptions-item>
        <!-- <el-descriptions-item :label="l.cooperation_company_ownership">{{
          manufacturer.data.cooperation_company_ownership
        }}</el-descriptions-item>
        <el-descriptions-item :label="l.cooperation_group_name">{{
          manufacturer.data.cooperation_group_name
        }}</el-descriptions-item> -->
        <el-descriptions-item :label="l.is_alidas_authorized">
          {{ manufacturer.data.is_alidas_authorized }}
        </el-descriptions-item>
        <el-descriptions-item :label="l.requestor_facility_name">
          {{ manufacturer.data.requestor_facility_name }}
        </el-descriptions-item>
        <el-descriptions-item :label="l.requestor_contact_name">
          {{ manufacturer.data.requestor_contact_name }}
        </el-descriptions-item>
        <el-descriptions-item :label="l.monthly_produce_quantity">
          {{ manufacturer.data.monthly_produce_quantity }}
        </el-descriptions-item>
        <el-descriptions-item :label="l.employee_num">
          {{ manufacturer.data.employee_num }}
        </el-descriptions-item>
        <el-descriptions-item :label="l.requestor_facility_code">
          {{ manufacturer.data.requestor_facility_code }}
        </el-descriptions-item>
        <el-descriptions-item label="手动输入的ID">
          {{ manufacturer.data.manual_input_id }}
        </el-descriptions-item>
        <el-descriptions-item :label="l.vendor_code">
          {{ manufacturer.data.vendor_code }}
        </el-descriptions-item>
        <el-descriptions-item :label="l.unique_identifier">
          {{ manufacturer.data.unique_identifier }}
        </el-descriptions-item>
        <el-descriptions-item :label="l.ffc_id">
          {{ manufacturer.data.ffc_id }}
        </el-descriptions-item>
        <el-descriptions-item :label="l.sap_code">
          {{ manufacturer.data.sap_code }}
        </el-descriptions-item>
        <el-descriptions-item :label="l.classification">
          {{ manufacturer.data.classification }}
        </el-descriptions-item>
        <el-descriptions-item :label="l.authorization_status">
          {{ manufacturer.data.authorization_status }}
        </el-descriptions-item>
        <el-descriptions-item :label="l.compliance_warning_letter">
          {{ manufacturer.data.compliance_warning_letter }}
        </el-descriptions-item>
        <el-descriptions-item :label="l.types_of_orders">
          {{ manufacturer.data.types_of_orders }}
        </el-descriptions-item>
      </el-descriptions>
      <!-- <el-descriptions :title="l.contact_infos" :column="4">
        <el-descriptions-item :label="l.contact_name">{{
          manufacturer.data.contact_name
        }}</el-descriptions-item>
        <el-descriptions-item :label="l.contact_job_title">{{
          manufacturer.data.contact_job_title
        }}</el-descriptions-item>
        <el-descriptions-item :label="l.contact_phone">{{
          manufacturer.data.contact_phone
        }}</el-descriptions-item>
        <el-descriptions-item :label="l.contact_email">{{
          manufacturer.data.contact_email
        }}</el-descriptions-item>
      </el-descriptions> -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="manufacturer.inforFormVisible = false">
          {{ c.cancel }}
        </el-button>
        <el-button type="primary" @click="submmitManufacturer">
          {{ c.confirm }}
        </el-button>
      </span>
    </el-dialog>

    <!-- 合规联系人信息 -->
    <el-dialog :title="l.contact_info" @submmit="contactInfoSubmmit" :visible.sync="contactInfo.dialogFormVisible" width="50%">
      <el-form :model="contactInfo.data" label-position="top" inline style="border-radius: 2px" :rules="rulesRules">
        <el-row>
          <el-col :span="12">
            <el-form-item :label="l.contact_name">
              <el-input :placeholder="l.input" v-model="contactInfo.data.contact_name" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="l.contact_job_title">
              <el-input :placeholder="l.input" v-model="contactInfo.data.contact_job_title" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="l.contact_phone" prop="contactPhone">
              <el-input :placeholder="l.input" v-model="contactInfo.data.contact_phone" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="l.contact_email" prop="contactEmail">
              <el-input :placeholder="l.input" v-model="contactInfo.data.contact_email" clearable />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="contactInfo.dialogFormVisible = false">
          {{ c.cancel }}
        </el-button>
        <el-button type="primary" @click="contactInfoSubmmit">
          {{ c.confirm }}
        </el-button>
        <slot name="operation"></slot>
      </span>
    </el-dialog>

    <!-- 地址窗口 -->
    <z-form-dialog :name="l.addr_and_processes" :data="address.data" :formProps="formProps" :fields="address.fields" @submmit="addressSubmmit" :submmitLoading="submmitLoading" :visible.sync="address.dialogFormVisible"></z-form-dialog>
    <!-- 附件窗口 -->
    <el-dialog :title="l.add_attachments" :visible.sync="attachment.dialogFormVisible" width="30%">
      <el-form ref="form">
        <el-form-item label="">
          <el-button type="primary" @click="selectFile">
            {{ l.selectFile }}
          </el-button>
          <div class="text item">
            {{ attachment.fileList.file.name }}
          </div>
          <div>
            <progress v-if="this.attachment.uploadProgress > 0" :value="this.attachment.uploadProgress" max="100"></progress>
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
    </el-dialog>
    <!-- 地址信息 -->
    <el-dialog :title="l.addr_and_processes" :visible.sync="address.dialogTableVisible2" width="30%">
      <el-table :data="address.list">
        <el-table-column property="address_zh" :label="l.address_zh"></el-table-column>
        <el-table-column property="address_en" :label="l.address_en"></el-table-column>
        <el-table-column property="own_processes" :label="l.own_processes"></el-table-column>
        <el-table-column property="match_processes" :label="l.own_processes"></el-table-column>
      </el-table>
    </el-dialog>
    <!-- 附件信息 -->
    <el-dialog :title="l.attachment_info" :visible.sync="attachment.dialogFormVisible2" width="30%">
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
    </el-dialog>

    <el-dialog :visible.sync="visabled.uploadFile" width="30%">
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
    </el-dialog>
    <filePreviews v-if="attachment.fileUrl" :file-url="attachment.fileUrl" :visible="attachment.dialogFormVisible3" @update:visible="attachment.dialogFormVisible3 = $event"></filePreviews>

    <!-- Chi tiết modal -->
    <CustomDialog :title="c.detail" :visible.sync="manufacturer.detailFormVisible" :clickOutside="false" width="90%" custom-class="scrollable-dialog manufacturer-detail-dialog">
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
                    {{ manufacturer.data.cooperation_start_date || '--' }}
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
                    {{ manufacturer.data.authorization_status || '--' }}
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
import { reactive, ref, computed, onMounted, getCurrentInstance, watch } from 'vue'
import axios from 'axios'
import SparkMD5 from 'spark-md5'

import { getToken, localGet } from '@/utils/auth'
import { _, api, defaultConfig, initFuncs, zForm, zFormDialog, zPagination, zTable } from '@/views/_common'

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

// Variables
const options_authorization_status = computed(() => [
  { value: 'onboarding', label: l.value.producer_status_onboarding },
  { value: 'discontinued', label: l.value.producer_status_discontinued },
  { value: 'in_use', label: l.value.producer_status_in_use },
])
const maxSizeInBytes = ref(5 * 1024 * 1024)
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
    manufacture_id: '',
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
})
const contactInfo = reactive({
  list: [],
  data: {},
  dialogFormVisible: false,
  dialogTableVisible2: false,
  columns: computed(() => [
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
  ]),
  fields: computed(() => [
    {
      title: l.value.contact_name,
      key: 'contact_name',
      span: 12,
      required: true,
    },
    {
      title: l.value.contact_job_title,
      key: 'contact_job_title',
      span: 12,
      required: true,
    },
    {
      title: l.value.contact_phone,
      key: 'contact_phone',
      span: 12,
      required: true,
    },
    {
      title: l.value.contact_email,
      key: 'contact_email',
      span: 12,
      required: true,
    },
  ]),
})
const address = reactive({
  list: [],
  data: {},
  dialogFormVisible: false,
  dialogTableVisible2: false,
  columns: computed(() => [
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
  ]),
  fields: computed(() => [
    {
      title: l.value.address_zh,
      key: 'address_zh',
      span: 12,
      required: true,
    },
    {
      title: l.value.address_en,
      key: 'address_en',
      span: 12,
      required: true,
    },
    {
      title: l.value.own_processes,
      key: 'own_processes',
      span: 12,
      required: true,
    },
    {
      title: l.value.match_processes,
      key: 'match_processes',
      span: 12,
      required: true,
    },
  ]),
})
const attachment = reactive({
  list: [],
  data: {},
  dialogFormVisible: false,
  dialogFormVisible2: false,
  dialogFormVisible3: false,
  fileUrl: '',
  columns: computed(() => [
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
  ]),
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
  ]),
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
})
const rulesRules = reactive({
  contactPhone: [
    {
      validator: (rule, value, callback) => {
        const reg = /^(0|\+84)[1-9][0-9]{8}$/
        console.log(reg.test(contactInfo.data.contact_phone))
        rulesRules.isPhone = false
        if (contactInfo.data.contact_phone === '') {
          callback(new Error(l.value.input_phone))
        } else if (!reg.test(contactInfo.data.contact_phone)) {
          callback(new Error(l.value.input_confirm_phone))
        } else {
          rulesRules.isPhone = true
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  contactEmail: [
    {
      validator: (rule, value, callback) => {
        const reg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        rulesRules.isEmail = false
        if (contactInfo.data.contact_email === '') {
          callback(new Error(l.value.input_email))
        } else if (!reg.test(contactInfo.data.contact_email)) {
          callback(new Error(l.value.ininput_confirm_email))
        } else {
          rulesRules.isEmail = true
          callback()
        }
      },
      trigger: 'blur',
    },
  ],
  isPhone: false,
  isEmail: false,
})
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
const visabled = reactive({
  uploadFile: false,
})
const uploadQuery = reactive({})
const pagination = reactive({
  layout: 'prev, pager, next, jumper, ->, total,sizes',
  pagerCount: 7,
  pageSizes: [10, 15, 20, 30, 40, 50, 100],
})
const tableProps = reactive(config.tableProps)
const submmitLoading = ref(false)

// Refs
const fileInput = ref(null)
const addfileinput = ref(null)

// Methods
const getList = () => {
  manufacturer.loading = true
  proxy
    .$request(
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
        curPage: manufacturer.query.curPage,
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

const getDataByID = (id) => {
  console.log(id)
  proxy
    .$request(config.apiID, {
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

const getAddrsList = (data) => {
  proxy
    .$request(
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

const getAttachments = (id, file_type) => {
  proxy
    .$request(
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

const reset = () => {
  manufacturer.query = {
    manufacture_id: '',
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
  getList()
}

const add = () => {
  Object.assign(manufacturer.data, {
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
  })
  contactInfo.data = {}
  contactInfo.list = []
  address.data = {}
  address.list = []
  attachment.data = {}
  attachment.list = []
  manufacturer.addOrEditFormVisible = true
}

const editItem = (index, data) => {
  getDataByID(data.id)
  manufacturer.addOrEditFormVisible = true
}

const OPenManufacturer = () => {
  console.log(manufacturer.data)
  if (manufacturer.data.id == undefined) {
    if (rulesRules.isPhone && rulesRules.isEmail) {
      manufacturer.inforFormVisible = true
    } else {
      console.log(rulesRules.isPhone)
      console.log(rulesRules.isEmail)
      proxy.$message({
        message: l.value.compliance_contact_error,
        type: 'info',
      })
    }
  } else {
    manufacturer.inforFormVisible = true
  }
}

const submmitManufacturer = () => {
  manufacturer.data.contactInfoList = contactInfo.list
  manufacturer.data.addressList = address.list
  manufacturer.data.attachment = attachment.list
  console.log(manufacturer.data)
  proxy
    .$request(config.apiUpdate, manufacturer.data, 'post')
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
      proxy.$message({
        message: e,
        type: 'info',
      })
    })
}

const deleteItem = (index, data) => {
  console.log(data)
  proxy
    .$prompt(l.value.delete_confirm, c.value.oprConfirm, {
      type: 'warning',
      inputPattern: /^[Y]{1}$/i,
      inputErrorMessage: '请输入Y/y',
      confirmButtonText: c.value.confirm,
      cancelButtonText: c.value.cancel,
    })
    .then(() => {
      proxy
        .$request(
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

const exportExcel = () => {
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
    data: manufacturer.query,
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
        manufacturer.loading = false
      } catch {
        proxy.$message.error(l.value.file_export_failed)
      }
    }
  })
}

const exportTemplate = () => {
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

const exportItem = (row) => {
  axios({
    headers: {
      token: getToken(),
    },
    responseType: 'blob',
    method: 'post',
    url: proxy.$api.baseUrl + '/Compliance/complianceManufacturer/exportList',
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
        const elink = document.createElement('a')
        elink.download = decodeURIComponent('基础档案.zip')
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
        manufacturer.loading = false
      } catch {
        proxy.$message.error('文件导出失败')
      }
    }
  })
}

const checkArrdess = (index, data) => {
  console.log(data.manufacture_id)
  getAddrsList(data)
  address.dialogTableVisible2 = true
}

const check0A = (index, data) => {
  getAttachments(data.id, '0A')
  attachment.dialogFormVisible2 = true
}

const check0B = (index, data) => {
  getAttachments(data.id, '0B')
  attachment.dialogFormVisible2 = true
}

const check0C = (index, data) => {
  getAttachments(data.id, '0C')
  attachment.dialogFormVisible2 = true
}

const checkAttachments = (data) => {
  attachment.fileUrl = api.baseUrl + '/' + data.file_url
  console.log(attachment.fileUrl)
  attachment.dialogFormVisible3 = true
}

const downAttachments = (data) => {
  const url = api.baseUrl + '/' + data.file_url
  console.log(url)
  window.open(url, '_blank')
}

const contactInfoList = () => {
  console.log('contactInfo')
  contactInfo.dialogFormVisible = true
}

const contactInfoSubmmit = () => {
  console.log(contactInfo.data)
  if (Object.keys(contactInfo.data).length === 0) {
    proxy.$message({
      type: 'info',
      message: l.value.info_empty_error,
    })
    return
  }
  if (rulesRules.isPhone && rulesRules.isEmail) {
    contactInfo.list.push(contactInfo.data)
    contactInfo.data = {}
    contactInfo.dialogFormVisible = false
    console.log(contactInfo.list)
  } else {
    console.log(rulesRules.isPhone)
    console.log(rulesRules.isEmail)
    proxy.$message({
      message: l.value.phone_email_error,
      type: 'error',
    })
  }
}

const contactInfoDeleteItem = (row, index) => {
  console.log(row)
  contactInfo.list.splice(index, 1)
}

const addressList = () => {
  console.log('addressList')
  address.dialogFormVisible = true
}

const addressSubmmit = () => {
  if (manufacturer.data.id != undefined) {
    address.data.manufacture_id = manufacturer.data.id
  }
  address.list.push(address.data)
  console.log(address.list)
  address.data = {}
  address.dialogFormVisible = false
}

const addressDeleteItem = (data, index) => {
  address.list.splice(index, 1)
}

const createFileData = () => {
  attachment.fileList = {
    attachment_type: '',
    fileName: '',
    file: {},
  }
  attachment.dialogFormVisible = true
}

const attachmentSubmmit = () => {
  console.log(attachment.fileList)
  if (!attachment.fileList.file.name) {
    attachment.fileList.file = {}
    fileInput.value.value = ''
    return proxy.$message.error(l.value.file_is_empty)
  }
  if (fileSizeInBytes.value > maxSizeInBytes.value) {
    getAttachmentFlag()
  } else {
    let forData = new FormData()
    forData.append('fileName', attachment.fileList.fileName)
    forData.append('file', attachment.fileList.file)
    forData.append('attachment_type', attachment.fileList.attachment_type)
    proxy
      .$request(config.apiUploadAttachment, forData, 'post')
      .then((r) => {
        console.log(r.data[0])
        proxy.$set(r.data[0], 'attachment_type', attachment.fileList.attachment_type)
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

const onFileChange = (e) => {
  uploadQuery.file = e.target.files[0]
  console.log(uploadQuery.file)
  if (!uploadQuery.file) {
    alert(l.value.select_file)
    return
  }
}

const uploadExcel = () => {
  if (!uploadQuery.file) {
    alert(l.value.select_file)
    return
  }

  let formData = new FormData()
  formData.append('file', uploadQuery.file)

  proxy
    .$request(proxy.$api.baseUrl + '/Compliance/complianceManufacturer/uploadManufacturer', formData, 'post')
    .then((r) => {
      console.log(r)
      proxy.$message({
        type: 'success',
        message: l.value.upload_success,
      })
      visabled.uploadFile = false
      uploadQuery.file = {}
      addfileinput.value.value = ''
    })
    .catch((e) => {
      proxy.$message.error(e)
    })
}

const attachmentDeleteItem = (data, index) => {
  console.log(data)
  proxy
    .$prompt(l.value.prompt, c.value.oprConfirm, {
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

const selectFile = () => {
  fileInput.value.click()
}

const fileChange = (value) => {
  console.log(value.target.files)
  attachment.fileList.file = value.target.files[0]

  if (value.target.files.length == 0) {
    attachment.fileList.file = {}
    return proxy.$message.error(l.value.file_is_empty)
  }
  if (!value.target.files[0].type) {
    fileInput.value.value = ''
    return proxy.$message.error(l.value.unsupported_file_type)
  }
  fileSizeInBytes.value = value.target.files[0].size
  if (fileSizeInBytes.value > maxSizeInBytes.value) {
    attachment.divide.file = value.target.files[0]
    calculateFileHash()
  }
}

const calculateFileHash = async () => {
  const spark = new SparkMD5.ArrayBuffer()
  const fileReader = new FileReader()
  fileReader.readAsArrayBuffer(attachment.divide.file)
  fileReader.onload = (e) => {
    spark.append(e.target.result)
    attachment.divide.fileHash = spark.end()
    splitFile()
  }
}

const splitFile = () => {
  let start = 0
  attachment.divide.chunks = []
  while (start < attachment.divide.file.size) {
    const chunk = attachment.divide.file.slice(start, start + attachment.divide.chunkSize)
    attachment.divide.chunks.push(chunk)
    start += attachment.divide.chunkSize
  }
  console.log(attachment.divide.chunks)
}

const generateUUID = () => {
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

const getAttachmentFlag = () => {
  proxy
    .$request(proxy.$api.baseUrl + '/Compliance/complianceAttachments/getAttachmentFlag', {
      fileHash: attachment.divide.fileHash,
      attachment_type: attachment.fileList.attachment_type,
    })
    .then((r) => {
      if (r.data && r.data.length > 0) {
        console.log(r.data[0])
        proxy.$set(r.data[0], 'attachment_type', attachment.fileList.attachment_type)
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

const uploadFile = async () => {
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

const mergeFile = async () => {
  try {
    let fileObj = {}

    fileObj = {
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
      fileInput.value.value = ''
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

const indexMethod = (index) => {
  return index + 1
}

const matterType = (row) => {
  let label
  attachment.options.forEach((item) => {
    if (item.value == row) {
      label = item.label
    }
  })
  return label
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

const handleTableAction = ({ action, row }) => {
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

const handleRowClick = (row) => {
  console.log('Row clicked:', row)
}

const viewDetail = (row) => {
  getDataByID(row.id)
  manufacturer.detailFormVisible = true
}

const getStatusClass = (status) => {
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
}

const getStatusLabel = (status) => {
  if (!status) return '--'
  const statusMap = {
    onboarding: l.value.producer_status_onboarding,
    in_use: l.value.producer_status_in_use,
    discontinued: l.value.producer_status_discontinued,
  }
  return statusMap[status.toLowerCase()] || status
}

const getFileTypeColor = (type) => {
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
}

const Sdate = computed(() => {
  if (manufacturer.data.cooperation_start_date) {
    return new Date(manufacturer.data.cooperation_start_date).toLocaleString()
  }
  return ''
})

const Edate = computed(() => {
  if (manufacturer.data.cooperation_end_date) {
    return new Date(manufacturer.data.cooperation_end_date).toLocaleString()
  }
  return ''
})

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
.el-button + .el-button {
  margin-left: 0px !important;
}
</style>
