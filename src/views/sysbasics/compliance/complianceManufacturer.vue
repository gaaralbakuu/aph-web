<template>
  <div class="mar">
    <div class="dialog-content shadow">
      <span class="top-title">{{ $l.basicInformation }}</span>
      <el-form label-position="top" inline style="border-radius: 2px">
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$l.manufactureName">
              <el-input v-model="manufacturer.data.name_zh" clearable :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$l.manufactureNameEn">
              <el-input v-model="manufacturer.data.name_en" clearable :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$l.requestorFacilityType">
              <el-radio-group v-model="manufacturer.data.requestor_facility_type">
                <el-radio label="T1" :disabled="true">T1</el-radio>
                <el-radio label="T2" :disabled="true">T2</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$l.legalPerson">
              <el-input v-model="manufacturer.data.legal_person" clearable :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$l.country">
              <el-input v-model="manufacturer.data.country" clearable :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$l.isExportBiz">
              <el-radio-group v-model="manufacturer.data.is_export_biz">
                <el-radio label="Y" :disabled="true">{{ $l.yes }}</el-radio>
                <el-radio label="N" :disabled="true">{{ $l.no }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$l.customsNumber">
              <el-input v-model="manufacturer.data.customs_number" clearable :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$l.bizLicenseNumber">
              <el-input v-model="manufacturer.data.biz_license_number" clearable :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$l.isInvolveProduct">
              <el-radio-group v-model="manufacturer.data.is_involve_product">
                <el-radio label="Y" :disabled="true">{{ $l.product }}</el-radio>
                <el-radio label="N" :disabled="true">{{ $l.development }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$l.cooperationStartDate">
              <el-date-picker v-model="manufacturer.data.cooperation_start_date" type="datetime"
                :disabled="true"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$l.cooperationEndDate">
              <el-date-picker v-model="manufacturer.data.cooperation_end_date" type="datetime"
                :disabled="true"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$l.isAlidasProducer">
              <el-radio-group v-model="manufacturer.data.is_alidas_producer">
                <el-radio label="Y" :disabled="true">{{ $l.yes }}</el-radio>
                <el-radio label="N" :disabled="true">{{ $l.no }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$l.cooperationCompanyOwnership">
              <el-input v-model="manufacturer.data.cooperation_company_ownership" clearable :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$l.cooperationGroupName">
              <el-input v-model="manufacturer.data.cooperation_group_name" clearable :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$l.isAlidasAuthorized">
              <el-radio-group v-model="manufacturer.data.is_alidas_authorized">
                <el-radio label="Y" :disabled="true">{{ $l.yes }}</el-radio>
                <el-radio label="N" :disabled="true">{{ $l.no }}</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$l.requestorFacilityName">
              <el-input v-model="manufacturer.data.requestor_facility_name" clearable :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$l.requestorContactName">
              <el-input v-model="manufacturer.data.requestor_contact_name" clearable :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$l.monthlyProduceQuantity">
              <el-input-number v-model="manufacturer.data.monthly_produce_quantity" :min="1"
                :disabled="true"></el-input-number>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="8">
            <el-form-item :label="$l.employeeNum">
              <el-input-number v-model="manufacturer.data.employee_num" :min="1" :disabled="true"></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$l.requestorFacilityCode">
              <el-input v-model="manufacturer.data.requestor_facility_code" clearable :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="dialog-content shadow">
      <span class="top-title">{{ $l.complianceContactInfo }}</span>
      <el-form label-position="top" inline style="border-radius: 2px">
        <el-row>
          <el-col :span="6">
            <el-form-item :label="$l.contactName">
              <el-input v-model="manufacturer.data.contact_name" clearable :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$l.contactJobTitle">
              <el-input v-model="manufacturer.data.contact_job_title" clearable :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$l.contactPhone" prop="contactPhone">
              <el-input v-model="manufacturer.data.contact_phone" clearable :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$l.contactEmail" prop="contactEmail">
              <el-input v-model="manufacturer.data.contact_email" clearable :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="dialog-content shadow">
      <span class="top-title">{{ $l.partnerAddressAndProcesses }}</span>
      <z-table :list="address.list" :tableProps="{
        border: true,
        hideOperations: true
      }" :columns="address.columns">
      </z-table>
    </div>
    <div class="dialog-content shadow">
      <span class="top-title">{{ $l.complianceEvidence }}</span>
      <z-table :list="attachment.list" :tableProps="tableProps" :columns="attachment.columns">
        <template v-slot:operation="v">
          <a href="#" class="text-red" @click.prevent="checkAttachment(v.row, v.$index)">
            {{ $l.view }}
          </a>
        </template>
      </z-table>
    </div>
    <filePreviews v-if="attachment.fileUrl" :file-url="attachment.fileUrl" :visible="attachment.dialogFormVisible3"
      @update:visible="attachment.dialogFormVisible3 = $event">
    </filePreviews>
  </div>
</template>

<script>
import {
  _,
  api,
  zTable,
  zForm,
  zPagination,
  zFormDialog,
  initFuncs,
  eTable,
  defaultConfig,
} from '@/views/_common'
import filePreviews from '../../_common/filePreviews.vue'
const config = Object.assign({}, _.cloneDeep(defaultConfig), {
  tableProps: {
    border: true,
    opsColWith: 150,
  },
})
export default {
  name: 'complianceManufacturer',
  components: {
    zTable,
    zFormDialog,
    zPagination,
    filePreviews
  },
  data() {
    return {
      ...config,
      manufacturer: {
        list: [],
        data: {
          name_zh: "",
          name_en: "",
          legal_person: "",
          contact_name: "",
          contact_phone: "",
          contact_email: "",
          contact_job_title: "",
          country: "",
          customs_number: "",
          biz_license_number: "",
          cooperation_start_date: "",
          cooperation_end_date: "",
          cooperation_company_ownership: "",
          cooperation_group_name: "",
          requestor_facility_name: "",
          requestor_facility_code: "",
          requestor_contact_name: "",
          employee_num: 0,
          monthly_produce_quantity: 0,
          is_export_biz: "",
          requestor_facility_type: "",
          is_involve_product: "",
          is_alidas_producer: "",
          is_alidas_authorized: "",
          addressList: [],
          attachment: []
        },
        query: {
          manufacture_id: '',// 公司业务id
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
      address: {
        list: [],
        data: {},
        dialogFormVisible: false,
        dialogTableVisible2: false,
        columns: [{
          title: '中文地址',
          key: 'address_zh'
        }, {
          title: '英文地址',
          key: 'address_en'
        }, {
          title: '配合工序',
          key: 'own_processes'
        }, {
          title: '自有工序',
          key: 'match_processes'
        },]
      },
      attachment: {
        list: [],
        data: {},
        dialogFormVisible: false,
        dialogFormVisible2: false,
        dialogFormVisible3: false,
        fileUrl: "",
        columns: [{
          title: '文件名称',
          key: 'file_name'
        }, {
          title: '文件类型',
          key: 'attachment_type',
          formatter: this.matterType,
        }, {
          title: '创建人',
          key: 'create_user'
        }, {
          title: '创建时间',
          key: 'create_time'
        }, {
          title: '修改人',
          key: 'modify_user'
        }, {
          title: '修改时间',
          key: 'modify_time'
        }],
        options: [
          {
            value: '0A',
            label: '营业执照'
          }, {
            value: '0B',
            label: 'NDA '
          }, {
            value: '0C',
            label: '其它附件'
          }
        ],
        fileList: {
          attachment_type: "",
          fileName: "",
          file: {},
        }
      },
    }
  },
  methods: {
    getUser() {
      this.$request(api.baseUrl + '/ComplianceOutside/ComplianceAuthOutside/GetUserByToken').then(r => {
        console.log(r);
        this.getById(r.data.user.manufacturer_id)
      }).catch(e => {
        console.log();
      })
    },
    getById(id) {
      console.log(id);
      this.$request(api.baseUrl + '/ComplianceOutside/complianceManufacturerOutside/getbyid', {
        id: id
      }).then(r => {
        console.log(r);
        this.manufacturer.data = r.data
        this.address.list = r.data.addressList
        this.attachment.list = r.data.attachment
      }).catch(e => {
        console.log(e);
      })
    },
    matterType(row) {
      let label
      this.attachment.options.forEach(item => {
        if (item.value == row) {
          label = item.label
        }
      })
      return label
    },
    checkAttachment(data) {
      console.log(api.baseUrl + '/' + data.file_url);
      this.attachment.fileUrl = this.api + data.file_url
      this.attachment.dialogFormVisible3 = true
    }
  },
  created() {
    this.getUser()
  },
}
</script>

<style scoped>
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
  font-family: "微软雅黑";
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
  padding: ⅛rem;
}

.shadow {
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
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

.mar {
  margin: 20px;
}
</style>
