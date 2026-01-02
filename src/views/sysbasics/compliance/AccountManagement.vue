<template>
  <div class="flex flex-col h-[calc(100vh-60px)] bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Header / Filter Bar -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] bg-white sticky top-0 z-20 shadow-sm flex flex-col gap-4">
       <div class="flex justify-between items-center">
         <h1 class="text-xl font-medium mb-0!">{{ l.account || 'Account Management' }}</h1>
         <div class="flex gap-2">
            <button v-show="showAuth.m_add" class="flex items-center gap-2 px-4 py-2 bg-[#CC0000] text-white! font-medium text-sm uppercase rounded shadow-sm hover:bg-[#990000] transition-colors cursor-pointer" @click="add">
              <i class="el-icon-plus text-lg font-bold"></i>
              <span>{{ c.create || 'CREATE' }}</span>
            </button>
         </div>
       </div>

       <!-- Filters -->
       <div v-show="showAuth.m_search" class="grid grid-cols-6 gap-4 items-end">
          <!-- Account -->
          <div class="relative group border border-[#CCCCCC] rounded px-3 py-1 bg-white focus-within:border-[#065FD4]">
             <label class="block text-[10px] text-[#606060] mb-0 group-focus-within:text-[#065FD4]">{{ l.account }}</label>
             <input v-model="account.query.account" class="w-full outline-none text-sm text-[#0D0D0D] border-none bg-transparent p-0 h-6" :placeholder="l.input_accou || 'Account'" @keyup.enter="getUser">
          </div>
          <!-- Manufacturer -->
          <div class="relative group border border-[#CCCCCC] rounded px-3 py-1 bg-white focus-within:border-[#065FD4]">
             <label class="block text-[10px] text-[#606060] mb-0 group-focus-within:text-[#065FD4]">{{ l.manufacture_name }}</label>
             <input v-model="account.query.manufacture_name" class="w-full outline-none text-sm text-[#0D0D0D] border-none bg-transparent p-0 h-6" :placeholder="l.input_manufacture_name || 'Manufacturer'" @keyup.enter="getUser">
          </div>
          <!-- Type -->
          <div class="relative group border border-[#CCCCCC] rounded px-3 py-1 bg-white focus-within:border-[#065FD4]">
             <label class="block text-[10px] text-[#606060] mb-0 group-focus-within:text-[#065FD4]">{{ l.account_type }}</label>
             <input v-model="account.query.account_type" class="w-full outline-none text-sm text-[#0D0D0D] border-none bg-transparent p-0 h-6" :placeholder="l.input_account_type || 'Type'" @keyup.enter="getUser">
          </div>
          <!-- Email -->
          <div class="relative group border border-[#CCCCCC] rounded px-3 py-1 bg-white focus-within:border-[#065FD4]">
             <label class="block text-[10px] text-[#606060] mb-0 group-focus-within:text-[#065FD4]">{{ l.email }}</label>
             <input v-model="account.query.email" class="w-full outline-none text-sm text-[#0D0D0D] border-none bg-transparent p-0 h-6" :placeholder="l.input_email || 'Email'" @keyup.enter="getUser">
          </div>
          <!-- Date -->
          <div class="relative group border border-[#CCCCCC] rounded px-3 py-1 bg-white focus-within:border-[#065FD4]">
             <label class="block text-[10px] text-[#606060] mb-0 group-focus-within:text-[#065FD4]">{{ l.create_time }}</label>
             <input v-model="account.query.create_time" class="w-full outline-none text-sm text-[#0D0D0D] border-none bg-transparent p-0 h-6" :placeholder="l.input_create_time || 'Create Time'" @keyup.enter="getUser">
          </div>
          <!-- Status & Buttons -->
          <div class="flex gap-2 items-center">
             <div class="relative group border border-[#CCCCCC] rounded px-3 py-1 bg-white focus-within:border-[#065FD4] flex-1">
               <label class="block text-[10px] text-[#606060] mb-0 group-focus-within:text-[#065FD4]">{{ l.status }}</label>
               <select v-model="account.query.is_valid" class="w-full outline-none text-sm text-[#0D0D0D] border-none bg-transparent p-0 h-6 appearance-none" @change="getUser">
                  <option value="" disabled selected>{{ l.choose || 'Choose' }}</option>
                  <option v-for="item in accountOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
               </select>
             </div>
             <button class="bg-[#F0F0F0] text-[#0D0D0D] p-2 rounded hover:bg-[#E5E5E5] transition-colors cursor-pointer" :title="l.reset" @click="reset">
                <i class="el-icon-refresh"></i>
             </button>
             <button class="bg-[#065FD4] text-white! p-2 rounded hover:bg-[#0056BF] transition-colors cursor-pointer" :title="c.queryButton" @click="getUser">
                <i class="el-icon-search font-bold"></i>
             </button>
          </div>
       </div>
    </div>

    <!-- Main List -->
    <div class="flex-1 overflow-hidden flex flex-col bg-white">
       <!-- Table Header -->
       <div class="grid grid-cols-[1.5fr_1.5fr_2fr_2fr_1.5fr_1.5fr_1fr_120px] gap-4 px-6 py-3 border-b border-[#E5E5E5] bg-[#F9F9F9] text-xs font-medium text-[#606060] sticky top-0 z-10">
          <div>{{ l.account }}</div>
          <div>{{ l.account_name }}</div>
          <div>{{ l.manufacture_name }}</div>
          <div>{{ l.email }}</div>
          <div>{{ l.phone }}</div>
          <div>{{ l.create_time }}</div>
          <div class="text-center">{{ l.status }}</div>
          <div class="text-right">{{ l.operation }}</div>
       </div>

       <!-- Table Body -->
       <div class="flex-1 overflow-y-auto custom-scrollbar" v-loading="loading">
          <div v-if="account.list.length > 0">
              <div v-for="(item, index) in account.list" :key="item.id"
                   class="grid grid-cols-[1.5fr_1.5fr_2fr_2fr_1.5fr_1.5fr_1fr_120px] gap-4 px-6 py-4 border-b border-[#F0F0F0] hover:bg-[#F0F8FF] group items-center transition-colors">
                   <div class="text-sm font-medium text-[#0D0D0D] truncate" :title="item.account">{{ item.account }}</div>
                   <div class="text-sm text-[#0D0D0D] truncate" :title="item.account_name">{{ item.account_name }}</div>
                   <div class="text-sm text-[#606060] truncate" :title="item.company_name">{{ item.company_name }}</div>
                   <div class="text-xs text-[#606060] truncate" :title="item.email">{{ item.email }}</div>
                   <div class="text-xs text-[#606060] truncate">{{ item.phone }}</div>
                   <div class="text-xs text-[#606060]">{{ item.create_time }}</div>
                   <div class="text-center">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase"
                        :class="item.is_valid == 'Y' ? 'bg-[#E6F4EA] text-[#069C56]' : 'bg-[#FCE8E6] text-[#CC0000]'">
                        {{ item.is_valid == 'Y' ? c.enable : c.disable }}
                      </span>
                   </div>
                   <div class="text-right flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <!-- Enable/Disable -->
                      <i v-if="item.is_valid == 'N'" class="el-icon-video-play text-[#069C56] cursor-pointer hover:scale-125 text-base" :title="c.enable" @click="toggleStatus(item)"></i>
                      <i v-else class="el-icon-video-pause text-[#E6A23C] cursor-pointer hover:scale-125 text-base" :title="c.disable" @click="toggleStatus(item)"></i>

                      <i v-show="showAuth.m_updata" class="el-icon-edit text-[#065FD4] cursor-pointer hover:scale-125 text-base" :title="c.edit" @click="editItem(item)"></i>
                      <i v-show="showAuth.m_del" class="el-icon-delete text-[#CC0000] cursor-pointer hover:scale-125 text-base" :title="c.delete" @click="deleteItem(item)"></i>
                   </div>
              </div>
          </div>
          <div v-else class="flex flex-col items-center justify-center h-full text-[#999999]">
             <i class="el-icon-document-remove text-4xl mb-2 text-[#E5E5E5]"></i>
             <p>{{ c.noData || 'No data found' }}</p>
          </div>
       </div>

       <!-- Pagination -->
       <div class="p-4 border-t border-[#E5E5E5] bg-white flex justify-end">
          <z-pagination :total="account.total" :page.sync="account.query.page" :limit.sync="account.query.pageSize" @change="getUser" :options="{ small: true }"></z-pagination>
       </div>
    </div>

    <!-- Create/Edit Account Drawer -->
    <a-drawer
      :visible="account.editFormVisible"
      :width="500"
      :closable="false"
      :mask-closable="true"
      @close="account.editFormVisible = false"
      class="account-drawer"
      :body-style="{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }"
    >
        <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white">
            <h2 class="text-lg font-medium text-[#0D0D0D] mb-0!">{{ account.data.id ? c.edit : c.create }} {{ l.account }}</h2>
            <button class="text-[#606060] hover:text-[#0D0D0D] transition-colors cursor-pointer" @click="account.editFormVisible = false">
                <i class="el-icon-close text-xl font-bold"></i>
            </button>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar p-6 bg-white">
            <div class="flex flex-col gap-5">
                 <!-- Notice -->
                 <div class="bg-[#E6F7FF] border border-[#91D5FF] text-[#0050B3] px-4 py-3 rounded text-sm flex items-start gap-2">
                    <i class="el-icon-info mt-0.5"></i>
                    <span>{{ l.createAccountNotice || 'Please fill in the account details carefully.' }}</span>
                 </div>

                 <!-- Account -->
                 <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                    <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.account }} <span class="text-[#CC0000]">*</span></label>
                    <input v-model="account.data.account" class="w-full outline-none text-sm text-[#0D0D0D]" :disabled="!!account.data.id" :placeholder="l.account">
                 </div>

                 <!-- Password -->
                 <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                    <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.password }} <span class="text-[#CC0000]" v-if="!account.data.id">*</span></label>
                    <input v-model="account.data.password" type="password" class="w-full outline-none text-sm text-[#0D0D0D]" :placeholder="account.data.id ? l.leaveBlankToKeep : l.password">
                 </div>

                 <!-- Email -->
                 <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                    <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.email }}</label>
                    <input v-model="account.data.email" class="w-full outline-none text-sm text-[#0D0D0D]" :placeholder="l.email">
                 </div>

                 <!-- Phone -->
                 <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                    <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.phone }} <span class="text-[#CC0000]">*</span></label>
                    <input v-model="account.data.phone" class="w-full outline-none text-sm text-[#0D0D0D]" :disabled="!!account.data.id" :placeholder="l.phone">
                 </div>

                 <!-- Account Name -->
                 <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                    <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.account_name }} <span class="text-[#CC0000]">*</span></label>
                    <input v-model="account.data.account_name" class="w-full outline-none text-sm text-[#0D0D0D]" :placeholder="l.account_name">
                 </div>

                 <!-- Manufacturer Selection -->
                 <div class="flex flex-col gap-1">
                    <label class="text-xs text-[#606060]">{{ l.manufacture_name }} <span class="text-[#CC0000]">*</span></label>
                    <div class="flex gap-2">
                       <div class="flex-1 border border-[#CCCCCC] rounded px-3 py-2 bg-[#F9F9F9] text-sm text-[#0D0D0D]">
                          {{ account.data.company_name || l.notSelected }}
                       </div>
                       <button class="bg-[#065FD4] text-white! px-4 py-2 rounded text-sm font-medium uppercase shadow-sm hover:bg-[#0056BF] transition-colors cursor-pointer" @click="manufacturer.dialogVisible = true">
                          {{ l.baseFile_select || 'SELECT' }}
                       </button>
                    </div>
                 </div>
            </div>
        </div>

        <div class="px-6 py-4 border-t border-[#E5E5E5] bg-white flex justify-end gap-3">
            <button class="px-4 py-2 text-sm font-medium text-[#606060] hover:bg-[#F2F2F2] rounded uppercase transition-colors cursor-pointer" @click="account.editFormVisible = false">
                {{ c.cancel }}
            </button>
            <button class="px-6 py-2 text-sm font-medium text-white! bg-[#065FD4] hover:bg-[#0056BF] rounded uppercase shadow-sm transition-colors cursor-pointer" @click="submmit">
                {{ c.confirm }}
            </button>
        </div>
    </a-drawer>

    <!-- Manufacturer Selector -->
    <ManufacturerDrawer :visible.sync="manufacturer.dialogVisible" @select="sendManufacturerItem" />

  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, watch, set } from 'vue'
import { _, api, defaultConfig, zPagination } from '@/views/_common'
import ManufacturerDrawer from './components/ManufacturerDrawer.vue'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('accountManagement')

const config = Object.assign({}, _.cloneDeep(defaultConfig), {
  api: api.ComplianceUser,
  apiList: api.ComplianceUser + 'getlist',
  apiUpdate: api.ComplianceUser + 'update',
  apiAdd: api.ComplianceUser + 'add',
  apiDelete: api.ComplianceUser + 'delete',
  apiManufacturer: api.ComplianceManufacturer + 'getlist',
})

const loading = ref(false)
const userAuth = ref({})
const showAuth = reactive({
  m_search: false,
  m_add: false,
  m_del: false,
  m_updata: false,
})

const account = reactive({
  list: [],
  data: {},
  query: {
    account: '',
    manufacture_name: '',
    account_type: '',
    email: '',
    create_time: '',
    status: '',
    is_valid: 'Y',
    pageSize: 15,
    page: 1,
  },
  total: 0,
  editFormVisible: false,
})

const accountOptions = computed(() => [
  { value: 'Y', label: c.value.enable },
  { value: 'N', label: c.value.disable },
])

const manufacturer = reactive({
  dialogVisible: false,
})

function getUser() {
  loading.value = true
  proxy.$request(config.apiList, account.query, 'post')
    .then((r) => {
      account.list = r.data.list
      account.total = r.data.total
      loading.value = false
    })
    .catch((e) => {
      loading.value = false
    })
}

function reset() {
  account.query.account = ''
  account.query.manufacture_name = ''
  account.query.account_type = ''
  account.query.email = ''
  account.query.create_time = ''
  account.query.is_valid = ''
  getUser()
}

function add() {
  account.data = {
      is_valid: 'Y'
  }
  account.editFormVisible = true
}

function editItem(data) {
  account.data = _.cloneDeep(data)
  account.data.password = ''
  account.editFormVisible = true
}

function submmit() {
  let url = ''
  if (account.data.id) {
    url = config.apiUpdate
  } else {
    url = config.apiAdd
  }

  // Basic validation (optional but good)
  if (!account.data.account || !account.data.account_name || !account.data.phone || !account.data.manufacturer_id) {
      return proxy.$message.error(l.value.createAccountNotice || 'Please fill required fields')
  }

  proxy.$request(url, account.data, 'post')
    .then((r) => {
      proxy.$message({
        message: c.value.success,
        type: 'success',
      })
      getUser()
      account.editFormVisible = false
    })
    .catch((e) => {})
}

function deleteItem(data) {
  proxy.$prompt(l.value.prompt, c.value.oprConfirm, {
    type: 'warning',
    inputPattern: /^[Y]{1}$/i,
    inputErrorMessage: l.value.inputErrorMessage,
    confirmButtonText: c.value.confirm,
    cancelButtonText: c.value.cancel,
  })
    .then(() => {
      proxy.$request(config.apiDelete, { id: data.id }, 'post')
        .then((r) => {
          proxy.$message({
            type: 'success',
            message: c.value.success,
          })
          getUser()
        })
        .catch((e) => {
          proxy.$message.error(l.value.delete_error)
        })
    })
    .catch(() => {
      // Cancelled
    })
}

// Reuse update logic to toggle status for quick action
function toggleStatus(item) {
   // Logic might differ depending on backend API.
   // Usually status toggle is an update.
   let newItem = _.cloneDeep(item)
   newItem.is_valid = item.is_valid == 'Y' ? 'N' : 'Y'
   proxy.$request(config.apiUpdate, newItem, 'post').then(() => {
       proxy.$message.success(c.value.success)
       getUser()
   })
}

function sendManufacturerItem(data) {
  set(account.data, 'manufacturer_id', data.manufacture_id)
  set(account.data, 'account_name', data.name_en) // Original logic copied name_en to account_name?
  // Checking original logic:
  // set(account.data, 'account_name', data.name_en)
  // set(account.data, 'company_name', data.name_en)
  // Yes, it overwrites account_name. I will keep it.
  set(account.data, 'company_name', data.name_en)
  // manufacturer.dialogVisible = false // handled by drawer component
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
  getUser()
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
</style>
