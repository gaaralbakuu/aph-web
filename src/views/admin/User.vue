<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.title || 'User Management' }}</h1>

      <div class="flex gap-2">
        <Button variant="primary" @click="addUser">
          <i class="el-icon-plus mr-2"></i>
          {{ c.create }}
        </Button>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] bg-white sticky top-0 z-20 flex flex-wrap items-center gap-4">
      <!-- Search -->
      <div class="flex items-center gap-2 px-3 py-2 bg-white border border-[#CCCCCC] rounded hover:border-[#606060] transition-colors focus-within:border-[#065FD4] w-[300px]">
        <i class="el-icon-search text-[#606060] text-lg"></i>
        <input
          v-model="query.queryString"
          type="text"
          :placeholder="c.queryPlaceholder"
          class="bg-transparent border-none outline-none text-sm w-full placeholder-[#999999]"
          @keyup.enter="research"
        />
        <i v-if="query.queryString" class="el-icon-close text-[#606060] cursor-pointer hover:text-[#0D0D0D]" @click="query.queryString = ''; research()"></i>
      </div>

      <!-- Status Filter -->
      <div class="relative group">
        <select v-model="query.status" class="appearance-none pl-3 pr-8 py-2 bg-white border border-[#CCCCCC] rounded text-sm text-[#0D0D0D] outline-none focus:border-[#065FD4] hover:border-[#606060] cursor-pointer" @change="research">
          <option value="">{{ c.all }}</option>
          <option value="0">{{ c.enabled }}</option>
          <option value="1">{{ c.disabled }}</option>
        </select>
        <i class="el-icon-arrow-down absolute right-2 top-1/2 -translate-y-1/2 text-[#606060] pointer-events-none text-xs"></i>
      </div>

      <Button variant="secondary" @click="research">{{ c.queryButton }}</Button>
      <Button variant="ghost" @click="exportData" :disabled="exportLoading">
        <i class="el-icon-download mr-1"></i>
        {{ c.export }}
      </Button>
    </div>

    <!-- Content Grid -->
    <div class="flex-1 overflow-hidden bg-white flex flex-col relative">
      <!-- Grid Header -->
      <div class="grid grid-cols-[100px_100px_1.5fr_1.5fr_120px_100px_120px_120px_150px_100px_1fr] gap-4 px-6 py-3 border-b border-[#E5E5E5] text-xs font-medium text-[#606060] bg-[#F9F9F9] sticky top-0 z-10 min-w-[1400px]">
        <div>{{ l.userid }}</div>
        <div>{{ l.username }}</div>
        <div>{{ l.department }}</div>
        <div>{{ l.work_name }}</div>
        <div>{{ l.instel }}</div>
        <div>{{ l.register }}</div>
        <div>{{ l.in_date }}</div>
        <div>{{ l.out_date }}</div>
        <div>{{ l.last_date }}</div>
        <div class="text-center">{{ l.enable }}</div>
        <div class="text-right">{{ c.action || 'Actions' }}</div>
      </div>

      <!-- Loading State -->
      <div v-if="pageLoading" class="absolute inset-0 z-50 bg-white/50 flex items-center justify-center">
        <i class="el-icon-loading text-3xl text-[#065FD4]"></i>
      </div>

      <!-- List -->
      <div class="flex-1 overflow-auto custom-scrollbar">
        <div class="min-w-[1400px]">
          <div v-if="list.length === 0" class="flex flex-col items-center justify-center py-20 text-[#606060]">
            <i class="el-icon-document text-4xl mb-2 text-[#CCCCCC]"></i>
            <p>{{ c.noData }}</p>
          </div>

          <div v-for="(item, index) in list" :key="index" class="grid grid-cols-[100px_100px_1.5fr_1.5fr_120px_100px_120px_120px_150px_100px_1fr] gap-4 px-6 py-3 border-b border-[#E5E5E5] hover:bg-[#F9F9F9] items-center text-sm text-[#0D0D0D]">
            <div class="truncate" :title="item.userid">{{ item.userid }}</div>
            <div class="truncate" :title="item.username">{{ item.username }}</div>
            <div class="truncate" :title="item.department_t">{{ item.department_t }}</div>
            <div class="truncate" :title="item.work_name">{{ item.work_name }}</div>
            <div class="truncate">{{ item.instel }}</div>
            <div>
              <span class="px-2 py-0.5 rounded text-xs font-medium" :class="item.password ? 'bg-[#E5F6FD] text-[#065FD4]' : 'bg-[#F2F2F2] text-[#606060]'">
                {{ item.password ? 'Y' : 'N' }}
              </span>
            </div>
            <div class="text-[#606060] text-xs">{{ formatDate(item.in_date) }}</div>
            <div class="text-[#606060] text-xs">{{ formatDate(item.out_date) }}</div>
            <div class="text-[#606060] text-xs">{{ item.last_date }}</div>
            <div class="text-center">
              <span class="px-2 py-0.5 rounded text-xs font-medium" :class="item.enable == '0' ? 'bg-[#DEF7E5] text-[#069C56]' : 'bg-[#F2F2F2] text-[#606060]'">
                {{ item.enable == '0' ? 'Y' : 'N' }}
              </span>
            </div>

            <!-- Actions -->
            <div class="flex justify-end items-center gap-3 text-[#606060]">
              <i class="el-icon-edit text-lg cursor-pointer hover:text-[#065FD4]" :title="l.editItem" @click="editItem(item)"></i>
              <i class="el-icon-key text-lg cursor-pointer hover:text-[#E6A23C]" :title="l.changePwd" @click="forceChangePass(item)"></i>
              <i class="el-icon-delete text-lg cursor-pointer hover:text-[#CC0000]" :title="c.delete" @click="deleteItem(item)"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-end p-4 border-t border-[#E5E5E5] bg-white text-xs text-[#606060]">
      <Pagination
        :page="query.page"
        :pageSize="query.size"
        :total="total"
        :l="l"
        @update:page="query.page = $event"
        @update:pageSize="query.size = $event"
        @change="getList"
      />
    </div>

    <!-- Edit/Create User Drawer -->
    <a-drawer :visible="editFormVisible" :title="name" :width="700" @close="editFormVisible = false" :body-style="{ padding: 0 }">
      <div class="flex flex-col h-full bg-white font-roboto">
        <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <h3 class="text-lg font-medium text-[#0D0D0D] mb-6">{{ l.userInfo }}</h3>

          <div class="grid grid-cols-2 gap-6">
            <!-- UserID -->
            <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.userid }}</label>
              <input v-model="data.userid" :disabled="!!data.id" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <!-- Username -->
            <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.username }}</label>
              <input v-model="data.username" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <!-- Instel -->
            <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.instel }}</label>
              <input v-model="data.instel" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <!-- Name T/S/E -->
            <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.name_t }}</label>
              <input v-model="data.name_t" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>
            <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.name_s }}</label>
              <input v-model="data.name_s" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>
            <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.name_e }}</label>
              <input v-model="data.name_e" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <!-- Dates -->
            <div>
              <label class="block text-xs text-[#606060] mb-1">{{ l.in_date }}</label>
              <el-date-picker v-model="data.in_date" type="date" value-format="yyyy-MM-dd" placeholder="Select date" class="w-full !border-none" style="width: 100%"></el-date-picker>
            </div>
            <div>
              <label class="block text-xs text-[#606060] mb-1">{{ l.out_date }}</label>
              <el-date-picker v-model="data.out_date" type="date" value-format="yyyy-MM-dd" placeholder="Select date" class="w-full" style="width: 100%"></el-date-picker>
            </div>
            <div>
              <label class="block text-xs text-[#606060] mb-1">{{ l.birthday }}</label>
              <el-date-picker v-model="data.birthday" type="date" value-format="yyyy-MM-dd" placeholder="Select date" class="w-full" style="width: 100%"></el-date-picker>
            </div>

            <!-- IC No -->
            <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.icno }}</label>
              <input v-model="data.ic_no" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
            </div>

            <!-- Work Name -->
            <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.work_name }}</label>
              <select v-model="data.work_name" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent appearance-none" @change="handleWorkNameChange">
                <option v-for="item in workNameOptions" :key="item.value" :value="item.value">{{ item.label }}</option>
              </select>
            </div>

            <!-- Sex -->
            <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.sex }}</label>
              <select v-model="data.sex" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent appearance-none">
                <option value="F">女</option>
                <option value="M">男</option>
              </select>
            </div>

            <!-- Department Selection -->
            <div class="col-span-2 grid grid-cols-2 gap-6">
              <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 bg-[#F2F2F2]">
                 <label class="block text-xs text-[#606060] mb-0.5">{{ l.dept_name }}</label>
                 <div class="flex items-center justify-between">
                    <span class="text-sm text-[#0D0D0D]">{{ data.department_t || '-' }}</span>
                    <Button variant="link" @click="openDept">{{ l.dropDept || 'Select' }}</Button>
                 </div>
              </div>
              <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 bg-[#F2F2F2]">
                 <label class="block text-xs text-[#606060] mb-0.5">{{ l.org_id }}</label>
                 <span class="text-sm text-[#0D0D0D]">{{ data.org_id || '-' }}</span>
              </div>
            </div>

            <!-- Enable -->
            <div class="flex items-center gap-4">
              <label class="text-sm text-[#0D0D0D]">{{ l.enable }}</label>
              <a-switch v-model="enableBool" checked-children="Y" un-checked-children="N" />
            </div>

            <!-- Roles -->
            <div class="col-span-2">
              <label class="block text-xs text-[#606060] mb-1">{{ l.roles }}</label>
              <el-select v-model="data.roles" multiple placeholder="Select roles" class="w-full">
                <el-option
                  v-for="item in roleOptions"
                  :key="item.role_id"
                  :label="item.role_name"
                  :value="item.role_id">
                </el-option>
              </el-select>
            </div>

          </div>
        </div>

        <!-- Footer -->
        <div class="border-t border-[#E5E5E5] p-4 flex justify-end items-center gap-2 bg-white">
           <Button variant="ghost" @click="editFormVisible = false">{{ c.cancel }}</Button>
           <Button variant="primary" :disabled="submmitLoading" @click="submmit">{{ c.confirm }}</Button>
        </div>
      </div>
    </a-drawer>

    <!-- Department Selection Modal (reusing table style roughly or using simple list) -->
    <a-modal v-model:visible="dropDeptVisible" :title="l.dropDept" :width="800" :footer="null">
      <div class="mb-4 flex gap-2">
        <input
          v-model="deptObj.query"
          type="text"
          :placeholder="c.queryPlaceholder"
          class="flex-1 border border-[#CCCCCC] rounded px-3 py-2 text-sm outline-none focus:border-[#065FD4]"
          @keyup.enter="researchDept"
        />
        <Button variant="secondary" @click="researchDept">{{ c.queryButton }}</Button>
      </div>

      <div class="border border-[#E5E5E5] rounded overflow-hidden">
        <div class="grid grid-cols-[100px_100px_1fr_100px_1fr_80px] bg-[#F9F9F9] p-2 text-xs font-medium text-[#606060]">
          <div>{{ l.org_id }}</div>
          <div>{{ l.dept_no }}</div>
          <div>{{ l.dept_name }}</div>
          <div>{{ l.up_dept_no }}</div>
          <div>{{ l.up_deptname }}</div>
          <div class="text-right">{{ c.action }}</div>
        </div>
        <div class="max-h-[400px] overflow-y-auto">
          <div v-for="(item, idx) in deptObj.list" :key="idx" class="grid grid-cols-[100px_100px_1fr_100px_1fr_80px] p-2 border-t border-[#E5E5E5] hover:bg-[#F9F9F9] text-sm items-center">
             <div class="truncate">{{ item.org_id }}</div>
             <div class="truncate">{{ item.dept_no }}</div>
             <div class="truncate">{{ item.dept_name_zh }}</div>
             <div class="truncate">{{ item.up_dept_no }}</div>
             <div class="truncate">{{ item.up_deptname }}</div>
             <div class="text-right">
               <Button variant="link" @click="sendDeptItem(item)">{{ c.confirm }}</Button>
             </div>
          </div>
        </div>
      </div>
       <div class="mt-4 flex justify-end">
          <Pagination
            :page="deptObj.curPage"
            :pageSize="deptObj.pageSize"
            :total="deptObj.total"
            :l="l"
            @update:page="deptObj.curPage = $event"
            @update:pageSize="deptObj.pageSize = $event"
            @change="researchDept"
          />
       </div>
    </a-modal>

  </div>
</template>

<script setup>
import { reactive, ref, computed, getCurrentInstance, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import api from '@/api'
import dayjs from 'dayjs'
import { useLocalI18n } from '@/composables/useLocalI18n'
import Button from '@/views/sysbasics/video/adminViews/component/common/Button.vue'
import Pagination from '@/views/sysbasics/video/adminViews/component/common/Pagination.vue'

// Global instance
const instance = getCurrentInstance()
const { $request, $message, $confirm, $prompt } = instance.proxy

// Localization
// Fallback if 'adminUser' key doesn't work as expected with useLocalI18n
const { l, c } = useLocalI18n('adminUser')
const name = computed(() => l.value.title || 'User Management')

// State
const pageLoading = ref(false)
const exportLoading = ref(false)
const submmitLoading = ref(false)
const editFormVisible = ref(false)
const dropDeptVisible = ref(false)

// Query & List
const query = reactive({
  queryString: '',
  status: '0',
  size: 10,
  page: 1
})
const list = ref([])
const total = ref(0)

// Data Form
const initData = {
  userid: '',
  username: '',
  instel: '',
  name_t: '',
  name_s: '',
  name_e: '',
  in_date: null,
  out_date: null,
  birthday: null,
  ic_no: '',
  work_name: '',
  work_no: '',
  sex: '',
  org_id: null,
  dept_no: null,
  department_t: null,
  password: '7C4A8D09CA3762AF61E59520943DC26494F8941B', // Default 123456
  enable: '0',
  roles: ['10001']
}
const data = reactive({ ...initData })

const enableBool = computed({
  get: () => data.enable === '0',
  set: (val) => { data.enable = val ? '0' : '1' }
})

// Dept Object
const deptObj = reactive({
  query: '',
  list: [],
  pageSize: 10,
  total: 0,
  curPage: 1
})

// Options
const workNameOptions = ref([])
const roleOptions = ref([])

// Methods
const getList = () => {
  pageLoading.value = true
  $request(api.user + 'getlist', query)
    .then(r => {
      list.value = r.data.list
      total.value = r.data.total
      pageLoading.value = false
    })
    .catch(e => {
      pageLoading.value = false
      console.error(e)
    })
}

const research = () => {
  query.page = 1
  getList()
}

const formatDate = (date) => {
  if (!date) return ''
  return dayjs(date).format('YYYY-MM-DD')
}

// User Actions
const addUser = () => {
  Object.assign(data, initData)
  // Re-assign default array to avoid reference issues
  data.roles = ['10001']
  // Clear any IDs
  delete data.id
  editFormVisible.value = true
}

const editItem = (item) => {
  pageLoading.value = true
  // Typically we fetch details first
  $request(api.user + 'getWithRoles', { id: item.id })
    .then(r => {
      Object.assign(data, r.data)
      // Ensure roles is array of IDs for el-select
      if (data.roles && typeof data.roles === 'string') {
        // If it comes as string (shouldn't if getWithRoles returns array)
      }
      // If server returns objects, map to IDs.
      // Assuming getWithRoles returns roles as array of objects or IDs.
      // The original code didn't do much processing, so z-form-dialog probably handled it.
      // We need to verify what `getWithRoles` returns.
      // If it returns roles as [ {role_id: '...'}, ... ], map it.
      if (Array.isArray(data.roles) && data.roles.length > 0 && typeof data.roles[0] === 'object') {
         data.roles = data.roles.map(r => r.role_id)
      }

      pageLoading.value = false
      editFormVisible.value = true
    })
    .catch(e => {
      pageLoading.value = false
      message.error(e.message || 'Error fetching details')
    })
}

const deleteItem = (item) => {
  Modal.confirm({
    title: c.value.oprConfirm,
    content: `${c.value.delete} ${item.username}?`,
    onOk() {
      $request(api.user + 'delete', { id: item.id }, 'post')
        .then(() => {
          message.success(c.value.success)
          getList()
        })
    }
  })
}

const forceChangePass = (item) => {
  // Use simple prompt or custom modal. Using element's $prompt for now as in original
  // But original used this.$prompt which is ElementUI.
  // instance.proxy.$prompt works if Element is installed.
  $prompt(l.value.inputPwd, c.value.oprConfirm, {
    confirmButtonText: c.value.confirm,
    cancelButtonText: c.value.cancel
  }).then(({ value }) => {
    pageLoading.value = true
    $request(api.user + 'forceChangePassword', { user: item.id, password: value }, 'post')
      .then(() => {
        pageLoading.value = false
        message.success(c.value.success)
      })
      .catch(() => {
        pageLoading.value = false
      })
  }).catch(() => {})
}

// Submit
const submmit = () => {
  // Validation can be added here

  // Format data
  const payload = { ...data }
  // Roles need to be joined as string for saving? Original code: tmp.roles = tmp.roles.join(',')
  if (Array.isArray(payload.roles)) {
    payload.roles = payload.roles.join(',')
  }

  submmitLoading.value = true
  const method = payload.id ? 'update' : 'save'
  $request(api.user + method, payload, 'post')
    .then(() => {
      submmitLoading.value = false
      message.success(c.value.success)
      editFormVisible.value = false
      getList()
    })
    .catch(e => {
      submmitLoading.value = false
      message.error(e.message || 'Error saving')
    })
}

// Export
const exportData = () => {
   // Implementation depends on backend
   message.info('Export functionality not fully migrated in this snippet')
}

// Department
const openDept = () => {
  dropDeptVisible.value = true
  researchDept()
}

const researchDept = () => {
  $request(api.Sydept + 'getList', {
    queryString: { dept_name: deptObj.query },
    pageSize: deptObj.pageSize,
    curPage: deptObj.curPage
  }).then(r => {
    deptObj.list = r.data.list
    deptObj.total = r.data.total
  })
}

const sendDeptItem = (row) => {
  data.department_t = row.dept_name_zh
  data.dept_no = row.dept_no
  data.org_id = row.org_id
  dropDeptVisible.value = false
}

// Options loading
const getPost = () => {
  $request(api.publiccode + 'getListdetailed', {
    queryString: {},
    ruleno: '8101',
    pageSize: 100
  }).then(r => {
    workNameOptions.value = r.data.list.map(j => ({
      value: j.name_zh,
      label: j.name_zh,
      workNo: j.code_no
    }))
  })
}

const getRoles = () => {
  $request(api.role + 'getlist', { size: 999 }).then(r => {
    roleOptions.value = r.data.list
  })
}

const handleWorkNameChange = () => {
  const selected = workNameOptions.value.find(o => o.value === data.work_name)
  if (selected) {
    data.work_no = selected.workNo
  }
}

// Lifecycle
onMounted(() => {
  getRoles()
  getPost()
  getList()
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
  background-color: #cccccc;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #999999;
}
</style>
