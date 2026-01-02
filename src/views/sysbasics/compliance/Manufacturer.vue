<template>
  <div class="flex flex-col h-[calc(100vh-60px)] bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Filter Bar -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] bg-white sticky top-0 z-20 shadow-sm flex flex-col gap-4">
       <!-- Header & Actions -->
       <div class="flex justify-between items-center">
         <div>
            <h1 class="text-xl font-medium mb-0!">{{ l.title }}</h1>
            <p class="text-xs text-[#606060] mt-1">{{ l.description }}</p>
         </div>
         <div class="flex gap-2">
            <button v-show="showAuth.m_add" class="flex items-center gap-2 px-4 py-2 bg-[#CC0000] text-white! font-medium text-sm uppercase rounded shadow-sm hover:bg-[#990000] transition-colors cursor-pointer" @click="add">
              <i class="el-icon-plus text-lg font-bold"></i>
              <span>{{ c.create || 'CREATE' }}</span>
            </button>
         </div>
       </div>

       <!-- Filters -->
       <div v-show="showAuth.m_search" class="grid grid-cols-6 gap-4 items-end">
          <!-- Facility Type (Toggle) -->
          <div class="col-span-2 relative group border border-[#CCCCCC] rounded px-1 py-1 bg-white focus-within:border-[#065FD4] flex items-center">
             <button class="flex-1 py-1 text-xs font-medium rounded transition-colors"
                :class="manufacturer.query.requestor_facility_type === '' ? 'bg-[#E5E5E5] text-[#0D0D0D]' : 'text-[#606060] hover:bg-[#F9F9F9]'"
                @click="manufacturer.query.requestor_facility_type = ''; getList()">
                {{ c.all }}
             </button>
             <button class="flex-1 py-1 text-xs font-medium rounded transition-colors"
                :class="manufacturer.query.requestor_facility_type === 'T1SC' ? 'bg-[#E5E5E5] text-[#0D0D0D]' : 'text-[#606060] hover:bg-[#F9F9F9]'"
                @click="manufacturer.query.requestor_facility_type = 'T1SC'; getList()">
                {{ l.requestor_facility_type_T1SC || 'T1SC' }}
             </button>
             <button class="flex-1 py-1 text-xs font-medium rounded transition-colors"
                :class="manufacturer.query.requestor_facility_type === 'T2' ? 'bg-[#E5E5E5] text-[#0D0D0D]' : 'text-[#606060] hover:bg-[#F9F9F9]'"
                @click="manufacturer.query.requestor_facility_type = 'T2'; getList()">
                {{ l.requestor_facility_type_T2 || 'T2' }}
             </button>
          </div>

          <!-- Manufacture Name -->
          <div class="relative group border border-[#CCCCCC] rounded px-3 py-1 bg-white focus-within:border-[#065FD4]">
             <label class="block text-[10px] text-[#606060] mb-0 group-focus-within:text-[#065FD4]">{{ l.manufacture_name }}</label>
             <input v-model="manufacturer.query.manufacture_name" class="w-full outline-none text-sm text-[#0D0D0D] border-none bg-transparent p-0 h-6" :placeholder="l.manufacture_name" @keyup.enter="getList">
          </div>

          <!-- Address -->
          <div class="relative group border border-[#CCCCCC] rounded px-3 py-1 bg-white focus-within:border-[#065FD4]">
             <label class="block text-[10px] text-[#606060] mb-0 group-focus-within:text-[#065FD4]">{{ l.addr }}</label>
             <input v-model="manufacturer.query.addr" class="w-full outline-none text-sm text-[#0D0D0D] border-none bg-transparent p-0 h-6" :placeholder="l.addr" @keyup.enter="getList">
          </div>

          <!-- Legal Person -->
          <div class="relative group border border-[#CCCCCC] rounded px-3 py-1 bg-white focus-within:border-[#065FD4]">
             <label class="block text-[10px] text-[#606060] mb-0 group-focus-within:text-[#065FD4]">{{ l.legal_person }}</label>
             <input v-model="manufacturer.query.legal_person" class="w-full outline-none text-sm text-[#0D0D0D] border-none bg-transparent p-0 h-6" :placeholder="l.legal_person" @keyup.enter="getList">
          </div>

          <!-- Buttons -->
          <div class="flex gap-2 items-center justify-end">
             <button class="bg-[#F0F0F0] text-[#0D0D0D] p-2 rounded hover:bg-[#E5E5E5] transition-colors cursor-pointer" :title="c.reset" @click="reset">
                <i class="el-icon-refresh"></i>
             </button>
             <button class="bg-[#065FD4] text-white! p-2 rounded hover:bg-[#0056BF] transition-colors cursor-pointer" :title="c.queryButton" @click="getList">
                <i class="el-icon-search font-bold"></i>
             </button>
          </div>
       </div>
    </div>

    <!-- Main List (Horizontal Scrollable) -->
    <div class="flex-1 overflow-hidden flex flex-col bg-white relative">
       <div class="flex-1 overflow-auto custom-scrollbar" v-loading="manufacturer.loading">
          <!-- Wrapper for horizontal scrolling -->
          <div class="min-w-[1400px]">
             <!-- Table Header -->
             <div class="grid grid-cols-[60px_140px_140px_300px_250px_220px_200px_220px_180px_80px] gap-0 border-b border-[#E5E5E5] bg-[#F9F9F9] text-xs font-medium text-[#606060] sticky top-0 z-10">
                <div class="px-4 py-3 border-r border-[#E5E5E5] last:border-r-0">#</div>
                <div class="px-4 py-3 border-r border-[#E5E5E5] last:border-r-0">{{ l.vendor_code || 'Vendor Code' }}</div>
                <div class="px-4 py-3 border-r border-[#E5E5E5] last:border-r-0">{{ l.sap_code || 'SAP Code' }}</div>
                <div class="px-4 py-3 border-r border-[#E5E5E5] last:border-r-0">{{ l.partner_english_name || 'English Name' }}</div>
                <div class="px-4 py-3 border-r border-[#E5E5E5] last:border-r-0">{{ l.business_registration_number || 'Biz License' }}</div>
                <div class="px-4 py-3 border-r border-[#E5E5E5] last:border-r-0">{{ l.overall_capabilities || 'Capabilities' }}</div>
                <div class="px-4 py-3 border-r border-[#E5E5E5] last:border-r-0">{{ l.authorization_status || 'Auth Status' }}</div>
                <div class="px-4 py-3 border-r border-[#E5E5E5] last:border-r-0">{{ l.address || 'Address' }}</div>
                <div class="px-4 py-3 border-r border-[#E5E5E5] last:border-r-0">{{ l.types_of_orders || 'Order Types' }}</div>
                <div class="px-4 py-3 text-center sticky right-0 bg-[#F9F9F9] z-20 shadow-[-2px_0_5px_rgba(0,0,0,0.05)]">{{ c.operation }}</div>
             </div>

             <!-- Table Body -->
             <div v-if="manufacturer.list.length > 0">
                 <div v-for="(item, index) in manufacturer.list" :key="item.id"
                      class="grid grid-cols-[60px_140px_140px_300px_250px_220px_200px_220px_180px_80px] gap-0 border-b border-[#F0F0F0] hover:bg-[#F0F8FF] group items-center transition-colors relative">
                      <div class="px-4 py-3 text-xs text-[#606060] border-r border-transparent group-hover:border-[#E6F7FF]">{{ index + 1 + (manufacturer.query.page - 1) * manufacturer.query.pageSize }}</div>
                      <div class="px-4 py-3 text-xs text-[#0D0D0D] truncate border-r border-transparent group-hover:border-[#E6F7FF]" :title="item.vendor_code">{{ item.vendor_code || '--' }}</div>
                      <div class="px-4 py-3 text-xs text-[#0D0D0D] truncate border-r border-transparent group-hover:border-[#E6F7FF]" :title="item.sap_code">{{ item.sap_code || '--' }}</div>
                      <div class="px-4 py-3 text-sm font-medium text-[#0D0D0D] truncate border-r border-transparent group-hover:border-[#E6F7FF]" :title="item.name_en">{{ item.name_en || '--' }}</div>
                      <div class="px-4 py-3 text-xs text-[#606060] truncate border-r border-transparent group-hover:border-[#E6F7FF]" :title="item.biz_license_number">{{ item.biz_license_number || '--' }}</div>

                      <!-- Capabilities Popover -->
                      <div class="px-4 py-3 border-r border-transparent group-hover:border-[#E6F7FF]">
                         <el-popover trigger="hover" placement="top" width="280">
                            <div class="max-h-48 overflow-y-auto custom-scrollbar">
                               <div v-if="item.address && item.address.length > 0">
                                  <div v-for="addr in item.address" :key="addr.id" class="py-1 border-b border-[#F0F0F0] last:border-0 text-xs">
                                     <span class="text-[#606060]">{{ addr.own_processes }}</span>
                                  </div>
                               </div>
                               <div v-else class="text-center text-[#999999] italic p-2">{{ c.empty || 'No data' }}</div>
                            </div>
                            <div slot="reference" class="flex items-center gap-2 cursor-pointer">
                               <span class="text-xs text-[#065FD4]">{{ c.view_capabilities || 'View' }}</span>
                               <span class="bg-[#E5E5E5] text-[#606060] text-[10px] px-1.5 py-0.5 rounded-full" v-if="item.address">{{ item.address.length }}</span>
                            </div>
                         </el-popover>
                      </div>

                      <!-- Auth Status -->
                      <div class="px-4 py-3 border-r border-transparent group-hover:border-[#E6F7FF]">
                         <span class="px-2 py-0.5 rounded text-[10px] font-medium uppercase border"
                            :class="getStatusClass(item.authorization_status)">
                            {{ getStatusText(item.authorization_status) }}
                         </span>
                      </div>

                      <!-- Address Popover -->
                      <div class="px-4 py-3 border-r border-transparent group-hover:border-[#E6F7FF]">
                         <el-popover trigger="hover" placement="top" width="280">
                            <div class="max-h-48 overflow-y-auto custom-scrollbar">
                               <div v-if="item.address && item.address.length > 0">
                                  <div v-for="addr in item.address" :key="addr.id" class="py-1 border-b border-[#F0F0F0] last:border-0 text-xs flex gap-1">
                                     <i class="el-icon-location-outline mt-0.5"></i>
                                     <span class="text-[#606060]">{{ addr.address_en }}</span>
                                  </div>
                               </div>
                               <div v-else class="text-center text-[#999999] italic p-2">{{ c.empty || 'No data' }}</div>
                            </div>
                            <div slot="reference" class="flex items-center gap-2 cursor-pointer">
                               <span class="text-xs text-[#065FD4]">{{ c.view_address || 'View' }}</span>
                               <span class="bg-[#E5E5E5] text-[#606060] text-[10px] px-1.5 py-0.5 rounded-full" v-if="item.address">{{ item.address.length }}</span>
                            </div>
                         </el-popover>
                      </div>

                      <div class="px-4 py-3 text-xs text-[#606060] truncate border-r border-transparent group-hover:border-[#E6F7FF]" :title="item.types_of_orders">{{ item.types_of_orders || '--' }}</div>

                      <!-- Action Column (Sticky Right) -->
                      <div class="px-4 py-3 text-center sticky right-0 bg-white group-hover:bg-[#F0F8FF] z-10 shadow-[-2px_0_5px_rgba(0,0,0,0.05)] transition-colors">
                         <el-dropdown trigger="click" @command="(cmd) => handleAction(cmd, item)">
                            <i class="el-icon-more rotate-90 text-[#606060] hover:text-[#0D0D0D] cursor-pointer text-lg p-1"></i>
                            <el-dropdown-menu slot="dropdown">
                               <el-dropdown-item command="detail"><i class="el-icon-view"></i> {{ c.detail || 'Detail' }}</el-dropdown-item>
                               <el-dropdown-item command="edit"><i class="el-icon-edit"></i> {{ c.edit || 'Edit' }}</el-dropdown-item>
                               <el-dropdown-item command="delete" class="text-red-500"><i class="el-icon-delete"></i> {{ c.delete || 'Delete' }}</el-dropdown-item>
                            </el-dropdown-menu>
                         </el-dropdown>
                      </div>
                 </div>
             </div>
             <div v-else class="flex flex-col items-center justify-center h-64 text-[#999999]">
                <i class="el-icon-document-remove text-4xl mb-2 text-[#E5E5E5]"></i>
                <p>{{ c.noData || 'No data found' }}</p>
             </div>
          </div>
       </div>

       <!-- Pagination -->
       <div class="p-4 border-t border-[#E5E5E5] bg-white flex justify-end">
          <z-pagination :total="manufacturer.query.total" :page.sync="manufacturer.query.page" :limit.sync="manufacturer.query.pageSize" @change="getList" :options="{ small: true }"></z-pagination>
       </div>
    </div>

    <!-- Create/Edit Drawer -->
    <a-drawer
      :visible="manufacturer.addOrEditFormVisible"
      :width="900"
      :closable="false"
      :mask-closable="false"
      @close="manufacturer.addOrEditFormVisible = false"
      class="manufacturer-drawer"
      :body-style="{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }"
    >
       <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white">
          <h2 class="text-lg font-medium text-[#0D0D0D] mb-0!">{{ manufacturer.data.id ? c.edit : c.create }} {{ l.title }}</h2>
          <button class="text-[#606060] hover:text-[#0D0D0D] transition-colors cursor-pointer" @click="manufacturer.addOrEditFormVisible = false">
             <i class="el-icon-close text-xl font-bold"></i>
          </button>
       </div>

       <div class="flex-1 overflow-y-auto custom-scrollbar p-8 bg-white">
          <!-- Form Sections -->
          <div class="space-y-8">
             <!-- Basic Info -->
             <div>
                <h3 class="text-sm font-bold text-[#0D0D0D] uppercase mb-4 border-b border-[#E5E5E5] pb-2">{{ l.basic }}</h3>
                <div class="grid grid-cols-2 gap-6">
                   <div class="form-item">
                      <label class="block text-xs text-[#606060] mb-1">{{ l.manufacture_name_CN }}</label>
                      <input v-model="manufacturer.data.name_zh" class="w-full border border-[#CCCCCC] rounded px-3 py-2 text-sm outline-none focus:border-[#065FD4]" :placeholder="l.input_manufacture_name_CN">
                   </div>
                   <div class="form-item">
                      <label class="block text-xs text-[#606060] mb-1">{{ l.manufacture_name_US }}</label>
                      <input v-model="manufacturer.data.name_en" class="w-full border border-[#CCCCCC] rounded px-3 py-2 text-sm outline-none focus:border-[#065FD4]" :placeholder="l.input_manufacture_name_US">
                   </div>
                   <div class="form-item">
                      <label class="block text-xs text-[#606060] mb-1">{{ l.cooperation_start_date }}</label>
                      <!-- Custom Styled Date Picker Example -->
                      <a-date-picker
                        v-model="manufacturer.data.cooperation_start_date"
                        class="w-full !border-[#CCCCCC] !rounded !text-sm"
                        :placeholder="c.selectDate"
                        format="YYYY-MM-DD"
                        valueFormat="YYYY-MM-DD HH:mm:ss"
                      />
                   </div>
                   <div class="form-item">
                      <label class="block text-xs text-[#606060] mb-1">{{ l.requestor_facility_type }}</label>
                      <div class="flex gap-4">
                         <label class="flex items-center gap-2 cursor-pointer text-sm">
                            <input type="radio" v-model="manufacturer.data.requestor_facility_type" value="T1SC" class="accent-[#065FD4]"> T1SC
                         </label>
                         <label class="flex items-center gap-2 cursor-pointer text-sm">
                            <input type="radio" v-model="manufacturer.data.requestor_facility_type" value="T2" class="accent-[#065FD4]"> T2
                         </label>
                      </div>
                   </div>
                </div>
             </div>

             <!-- Address List -->
             <div>
                <div class="flex justify-between items-center mb-4 border-b border-[#E5E5E5] pb-2">
                   <h3 class="text-sm font-bold text-[#0D0D0D] uppercase mb-0!">{{ l.addr_and_processes }}</h3>
                   <button class="text-[#065FD4] text-xs font-medium uppercase hover:underline" @click="addressList">
                      + {{ c.addData || 'ADD' }}
                   </button>
                </div>
                <div class="border border-[#E5E5E5] rounded overflow-hidden">
                   <div v-for="(addr, idx) in address.list" :key="idx" class="flex justify-between items-center p-3 border-b border-[#E5E5E5] last:border-0 bg-[#FAFAFA]">
                      <div class="text-xs text-[#606060]">
                         <div class="font-medium text-[#0D0D0D]">{{ addr.address_en }}</div>
                         <div>{{ addr.own_processes }}</div>
                      </div>
                      <div class="flex gap-2">
                         <i class="el-icon-edit text-[#065FD4] cursor-pointer" @click="addressEditItem(addr, idx)"></i>
                         <i class="el-icon-delete text-[#CC0000] cursor-pointer" @click="addressDeleteItem(addr, idx)"></i>
                      </div>
                   </div>
                   <div v-if="address.list.length === 0" class="p-4 text-center text-xs text-[#999999]">{{ c.empty }}</div>
                </div>
             </div>

             <!-- Contact Info List -->
             <div>
                <div class="flex justify-between items-center mb-4 border-b border-[#E5E5E5] pb-2">
                   <h3 class="text-sm font-bold text-[#0D0D0D] uppercase mb-0!">{{ l.contact_info }}</h3>
                   <button class="text-[#065FD4] text-xs font-medium uppercase hover:underline" @click="contactInfoList">
                      + {{ c.addData || 'ADD' }}
                   </button>
                </div>
                <div class="border border-[#E5E5E5] rounded overflow-hidden">
                   <div v-for="(contact, idx) in contactInfo.list" :key="idx" class="flex justify-between items-center p-3 border-b border-[#E5E5E5] last:border-0 bg-[#FAFAFA]">
                      <div class="text-xs text-[#606060]">
                         <div class="font-medium text-[#0D0D0D]">{{ contact.contact_name }}</div>
                         <div>{{ contact.contact_email }}</div>
                      </div>
                      <div class="flex gap-2">
                         <i class="el-icon-edit text-[#065FD4] cursor-pointer" @click="contactInfoEditItem(contact, idx)"></i>
                         <i class="el-icon-delete text-[#CC0000] cursor-pointer" @click="contactInfoDeleteItem(contact, idx)"></i>
                      </div>
                   </div>
                   <div v-if="contactInfo.list.length === 0" class="p-4 text-center text-xs text-[#999999]">{{ c.empty }}</div>
                </div>
             </div>
          </div>
       </div>

       <div class="px-6 py-4 border-t border-[#E5E5E5] bg-white flex justify-end gap-3">
          <button class="px-4 py-2 text-sm font-medium text-[#606060] hover:bg-[#F2F2F2] rounded uppercase transition-colors" @click="manufacturer.addOrEditFormVisible = false">{{ c.cancel }}</button>
          <button class="px-6 py-2 text-sm font-medium text-white! bg-[#065FD4] hover:bg-[#0056BF] rounded uppercase shadow-sm transition-colors" @click="OPenManufacturer">{{ c.confirm }}</button>
       </div>
    </a-drawer>

    <!-- Address Dialog -->
    <CustomDialog :title="l.addr_and_processes" :visible.sync="address.dialogFormVisible" :maxWidth="'600px'">
       <template #content>
          <div class="flex flex-col gap-4">
             <div class="form-item">
                <label class="block text-xs text-[#606060] mb-1">{{ l.address_en }}</label>
                <input v-model="address.data.address_en" class="w-full border border-[#CCCCCC] rounded px-3 py-2 text-sm outline-none focus:border-[#065FD4]">
             </div>
             <div class="form-item">
                <label class="block text-xs text-[#606060] mb-1">{{ l.own_processes }}</label>
                <input v-model="address.data.own_processes" class="w-full border border-[#CCCCCC] rounded px-3 py-2 text-sm outline-none focus:border-[#065FD4]">
             </div>
          </div>
       </template>
       <template #footer>
          <el-button @click="address.dialogFormVisible = false">{{ c.cancel }}</el-button>
          <el-button type="primary" @click="addressSubmmit">{{ c.confirm }}</el-button>
       </template>
    </CustomDialog>

    <!-- Contact Info Dialog -->
    <CustomDialog :title="l.contact_info" :visible.sync="contactInfo.dialogFormVisible" :maxWidth="'600px'">
       <template #content>
          <div class="flex flex-col gap-4">
             <div class="form-item">
                <label class="block text-xs text-[#606060] mb-1">{{ l.contact_name }}</label>
                <input v-model="contactInfo.data.contact_name" class="w-full border border-[#CCCCCC] rounded px-3 py-2 text-sm outline-none focus:border-[#065FD4]">
             </div>
             <div class="form-item">
                <label class="block text-xs text-[#606060] mb-1">{{ l.contact_email }}</label>
                <input v-model="contactInfo.data.contact_email" class="w-full border border-[#CCCCCC] rounded px-3 py-2 text-sm outline-none focus:border-[#065FD4]">
             </div>
             <div class="form-item">
                <label class="block text-xs text-[#606060] mb-1">{{ l.contact_phone }}</label>
                <input v-model="contactInfo.data.contact_phone" class="w-full border border-[#CCCCCC] rounded px-3 py-2 text-sm outline-none focus:border-[#065FD4]">
             </div>
          </div>
       </template>
       <template #footer>
          <el-button @click="contactInfo.dialogFormVisible = false">{{ c.cancel }}</el-button>
          <el-button type="primary" @click="contactInfoSubmmit">{{ c.confirm }}</el-button>
       </template>
    </CustomDialog>

    <!-- Confirm Dialog -->
    <CustomDialog :title="l.confirm_info" :visible.sync="manufacturer.inforFormVisible" :maxWidth="'800px'">
       <template #content>
          <div class="p-4 text-sm">
             <p>{{ l.confirm_save }}</p>
          </div>
       </template>
       <template #footer>
          <el-button @click="manufacturer.inforFormVisible = false">{{ c.cancel }}</el-button>
          <el-button type="primary" @click="submmitManufacturer">{{ c.confirm }}</el-button>
       </template>
    </CustomDialog>

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, watch, set } from 'vue'
import { _, api, defaultConfig, zPagination } from '@/views/_common'
import CustomDialog from '../../_common/CustomDialog.vue'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('manufacturer')

const config = Object.assign({}, _.cloneDeep(defaultConfig), {
  api: api.ComplianceManufacturer,
  apiManufacturer: api.ComplianceManufacturer + 'getlist',
  apiID: api.ComplianceManufacturer + 'getbyid',
  apiUpdate: api.ComplianceManufacturer + 'update',
  apiDelete: api.ComplianceManufacturer + 'delete',
})

const manufacturer = reactive({
  list: [],
  loading: false,
  data: {},
  query: {
    manufacture_name: '',
    addr: '',
    legal_person: '',
    requestor_facility_type: '',
    pageSize: 15,
    page: 1,
    total: 0
  },
  addOrEditFormVisible: false,
  inforFormVisible: false
})

const address = reactive({
  list: [],
  data: {},
  dialogFormVisible: false,
  editIndex: -1
})

const contactInfo = reactive({
    list: [],
    data: {},
    dialogFormVisible: false,
    editIndex: -1
})

// Attachments removed for now as requested to fix error
// const attachment = reactive({ ... })

const userAuth = ref({})
const showAuth = reactive({
  m_search: false,
  m_add: false,
  m_del: false,
  m_updata: false
})

function getList() {
  manufacturer.loading = true
  proxy.$request(config.apiManufacturer, manufacturer.query, 'get')
    .then(r => {
       manufacturer.list = r.data.list
       manufacturer.query.total = r.data.total
       manufacturer.loading = false
    })
    .catch(() => {
       manufacturer.loading = false
    })
}

function reset() {
    manufacturer.query.manufacture_name = ''
    manufacturer.query.addr = ''
    manufacturer.query.legal_person = ''
    manufacturer.query.requestor_facility_type = ''
    manufacturer.query.page = 1
    getList()
}

function add() {
    manufacturer.data = {}
    address.list = []
    contactInfo.list = []
    manufacturer.addOrEditFormVisible = true
}

function editItem(data) {
    proxy.$request(config.apiID, { id: data.id }).then(r => {
        manufacturer.data = r.data
        address.list = r.data.addressList || []
        contactInfo.list = r.data.contactInfoList || []
        manufacturer.addOrEditFormVisible = true
    })
}

function handleAction(cmd, item) {
    if (cmd === 'edit') editItem(item)
    if (cmd === 'delete') deleteItem(item)
    if (cmd === 'detail') editItem(item) // Reusing edit logic for detail
}

function deleteItem(item) {
    proxy.$confirm(c.value.cfmDelete).then(() => {
        proxy.$request(config.apiDelete, { id: item.id }, 'post').then(() => {
            proxy.$message.success(c.value.success)
            getList()
        })
    })
}

// Address logic
function addressList() {
    address.data = {}
    address.editIndex = -1
    address.dialogFormVisible = true
}

function addressEditItem(addr, index) {
    address.data = _.cloneDeep(addr)
    address.editIndex = index
    address.dialogFormVisible = true
}

function addressDeleteItem(addr, index) {
    address.list.splice(index, 1)
}

function addressSubmmit() {
    if (address.editIndex > -1) {
        set(address.list, address.editIndex, address.data)
    } else {
        address.list.push(address.data)
    }
    address.dialogFormVisible = false
}

// Contact Info logic
function contactInfoList() {
    contactInfo.data = {}
    contactInfo.editIndex = -1
    contactInfo.dialogFormVisible = true
}

function contactInfoEditItem(info, index) {
    contactInfo.data = _.cloneDeep(info)
    contactInfo.editIndex = index
    contactInfo.dialogFormVisible = true
}

function contactInfoDeleteItem(info, index) {
    contactInfo.list.splice(index, 1)
}

function contactInfoSubmmit() {
    if (contactInfo.editIndex > -1) {
        set(contactInfo.list, contactInfo.editIndex, contactInfo.data)
    } else {
        contactInfo.list.push(contactInfo.data)
    }
    contactInfo.dialogFormVisible = false
}

// Submit Main Form
function OPenManufacturer() {
    manufacturer.inforFormVisible = true
}

function submmitManufacturer() {
    const payload = {
        ...manufacturer.data,
        addressList: address.list,
        contactInfoList: contactInfo.list
    }
    const url = payload.id ? config.apiUpdate : api.ComplianceManufacturer + 'add'
    proxy.$request(url, payload, 'post').then(() => {
        proxy.$message.success(c.value.success)
        manufacturer.addOrEditFormVisible = false
        manufacturer.inforFormVisible = false
        getList()
    })
}

// Status Helpers
function getStatusClass(status) {
    if (status === 'in_use') return 'bg-[#E6F4EA] text-[#069C56] border-[#069C56]'
    if (status === 'onboarding') return 'bg-[#FEF7E0] text-[#E6A23C] border-[#E6A23C]'
    if (status === 'discontinued') return 'bg-[#FCE8E6] text-[#CC0000] border-[#CC0000]'
    return 'bg-[#E5E5E5] text-[#606060] border-[#CCCCCC]'
}

function getStatusText(status) {
    return status || '--'
}

function getUserAuth() {
  proxy.$request(proxy.$api.checkMenuAuth, {
    resourcepath: proxy.$route.name,
  }).then((r) => {
    userAuth.value = r.data[0]
  })
}

watch(userAuth, (newV) => {
  if(!newV) return
  showAuth.m_add = newV.m_add == 'Y'
  showAuth.m_search = newV.m_search == 'Y'
  showAuth.m_del = newV.m_del == 'Y'
  showAuth.m_updata = newV.m_updata == 'Y'
}, { deep: true })

onMounted(() => {
    getList()
    getUserAuth()
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #E5E5E5;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #CCCCCC;
}

/* Ant Design DatePicker Customization for Tailwind-like look */
:deep(.ant-calendar-picker-input) {
    border: 1px solid #CCCCCC !important;
    border-radius: 0.25rem !important;
    padding: 0.5rem 0.75rem !important;
    height: auto !important;
    box-shadow: none !important;
}
:deep(.ant-calendar-picker-input:focus),
:deep(.ant-calendar-picker:hover .ant-calendar-picker-input) {
    border-color: #065FD4 !important;
}
</style>
