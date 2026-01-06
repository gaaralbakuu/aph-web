<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.title || 'Quartz Job Management' }}</h1>

      <div class="flex gap-2">
        <Button variant="primary" @click="createItem">
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

      <Button variant="secondary" @click="research">{{ c.queryButton }}</Button>
      <Button variant="ghost" @click="exportData" :disabled="exportLoading">
        <i class="el-icon-download mr-1"></i>
        {{ c.export }}
      </Button>
    </div>

    <!-- Content Grid -->
    <div class="flex-1 overflow-hidden bg-white flex flex-col relative">
      <!-- Grid Header -->
      <div class="grid grid-cols-[120px_100px_80px_140px_80px_140px_100px_120px_140px_140px_80px_100px_140px_170px_150px_90px_140px_180px] gap-4 px-6 py-3 border-b border-[#E5E5E5] text-xs font-medium text-[#606060] bg-[#F9F9F9] sticky top-0 z-10 min-w-[2400px]">
        <div>{{ l.job_name }}</div>
        <div>{{ l.job_group }}</div>
        <div>{{ l.enabled }}</div>
        <div>{{ l.description }}</div>
        <div>{{ l.running }}</div>
        <div>{{ l.last_run_time }}</div>
        <div>{{ l.trigger_type_label }}</div>
        <div>{{ l.cron }}</div>
        <div>{{ l.begintime }}</div>
        <div>{{ l.endtime }}</div>
        <div>{{ l.runtimes }}</div>
        <div>{{ l.interval_second }}</div>
        <div>{{ l.assembly_name }}</div>
        <div>{{ l.class_fullname }}</div>
        <div>{{ c.remarks }}</div>
        <div>{{ c.modify_user }}</div>
        <div>{{ c.modify_time }}</div>
        <div class="text-right">{{ c.action }}</div>
      </div>

      <!-- List -->
      <div class="flex-1 overflow-auto custom-scrollbar">
        <div class="min-w-[2400px]">
          <div v-if="list.length === 0" class="flex flex-col items-center justify-center py-20 text-[#606060]">
            <i class="el-icon-document text-4xl mb-2 text-[#CCCCCC]"></i>
            <p>{{ c.noData }}</p>
          </div>

          <div v-for="(item, index) in list" :key="index" class="grid grid-cols-[120px_100px_80px_140px_80px_140px_100px_120px_140px_140px_80px_100px_140px_170px_150px_90px_140px_180px] gap-4 px-6 py-3 border-b border-[#E5E5E5] hover:bg-[#F9F9F9] items-center text-sm text-[#0D0D0D]">
            <div class="truncate" :title="item.job_name">{{ item.job_name }}</div>
            <div class="truncate" :title="item.job_group">{{ item.job_group }}</div>
            <div>
               <span v-if="!item.enabled" class="px-2 py-0.5 rounded text-xs font-medium bg-[#F2F2F2] text-[#606060]">{{ l.stopped }}</span>
               <span v-else class="px-2 py-0.5 rounded text-xs font-medium bg-[#E5F6FD] text-[#065FD4]">{{ c.enabled }}</span>
            </div>
            <div class="truncate" :title="item.description">{{ item.description }}</div>
            <div>
               <span v-if="!item.running" class="px-2 py-0.5 rounded text-xs font-medium bg-[#F2F2F2] text-[#606060]">{{ l.free }}</span>
               <span v-else class="px-2 py-0.5 rounded text-xs font-medium bg-[#DEF7E5] text-[#069C56]">{{ l.operating }}</span>
            </div>
            <div class="truncate">{{ item.last_run_time }}</div>
            <div class="truncate">{{ item.trigger_type_label }}</div>
            <div class="truncate">{{ item.cron }}</div>
            <div class="truncate">{{ item.begintime }}</div>
            <div class="truncate">{{ item.endtime }}</div>
            <div class="truncate">{{ item.runtimes }}</div>
            <div class="truncate">{{ item.interval_second }}</div>
            <div class="truncate" :title="item.assembly_name">{{ item.assembly_name }}</div>
            <div class="truncate" :title="item.class_fullname">{{ item.class_fullname }}</div>
            <div class="truncate" :title="item.remarks">{{ item.remarks }}</div>
            <div class="truncate">{{ item.modify_user }}</div>
            <div class="truncate text-xs text-[#606060]">{{ item.modify_time }}</div>

            <div class="flex justify-end gap-3 text-[#606060] text-lg">
               <!-- Edit -->
               <i
                 class="el-icon-edit cursor-pointer"
                 :class="!!item.enabled ? 'text-[#CCCCCC] cursor-not-allowed' : 'hover:text-[#065FD4]'"
                 :title="c.edit"
                 @click="!item.enabled && editItem(item)"
               ></i>

               <!-- Start/Pause -->
               <i
                 class="cursor-pointer"
                 :class="!item.enabled ? 'el-icon-video-play hover:text-[#069C56]' : 'el-icon-video-pause hover:text-[#E6A23C]'"
                 :title="!item.enabled ? c.enable : l.stop"
                 @click="startOrPauseJob(item, !item.enabled ? 1 : 0)"
               ></i>

               <!-- Run Once -->
               <i
                 class="el-icon-refresh cursor-pointer"
                 :class="!!item.enabled ? 'text-[#CCCCCC] cursor-not-allowed' : 'hover:text-[#065FD4]'"
                 :title="l.runOne"
                 @click="!item.enabled && doOnceJob(item)"
               ></i>

               <!-- Delete -->
               <i
                 class="el-icon-delete cursor-pointer"
                 :class="!!item.enabled ? 'text-[#CCCCCC] cursor-not-allowed' : 'hover:text-[#CC0000]'"
                 :title="c.delete"
                 @click="!item.enabled && deleteItem(item)"
               ></i>

               <!-- Log -->
               <i class="el-icon-document hover:text-[#606060] cursor-pointer" :title="l.log" @click="showLog(item)"></i>
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

    <!-- Job Drawer -->
    <a-drawer :visible="editFormVisible" :title="l.title" :width="700" @close="editFormVisible = false" :body-style="{ padding: 0 }">
       <div class="flex flex-col h-full bg-white font-roboto">
         <div class="flex-1 overflow-y-auto p-6 custom-scrollbar">

            <div class="grid grid-cols-2 gap-4">
               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.job_name }} ({{ c.required }})</label>
                  <input v-model="data.job_name" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
               </div>

               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.job_group }} ({{ c.required }})</label>
                  <input v-model="data.job_group" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
               </div>

               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.trigger_type_label }} ({{ c.required }})</label>
                  <select v-model="data.trigger_type" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent appearance-none">
                     <option v-for="opt in typeOptions" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
                  </select>
               </div>

               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.description }}</label>
                  <input v-model="data.description" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
               </div>

               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.assembly_name }} ({{ c.required }})</label>
                  <input v-model="data.assembly_name" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
               </div>

               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.class_fullname }} ({{ c.required }})</label>
                  <input v-model="data.class_fullname" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
               </div>

               <div>
                  <label class="block text-xs text-[#606060] mb-1">{{ l.begintime }}</label>
                  <el-date-picker v-model="data.begintime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="Select date" class="w-full !border-none" style="width: 100%"></el-date-picker>
               </div>

               <div>
                  <label class="block text-xs text-[#606060] mb-1">{{ l.endtime }}</label>
                  <el-date-picker v-model="data.endtime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="Select date" class="w-full !border-none" style="width: 100%"></el-date-picker>
               </div>
            </div>

            <!-- Dynamic Fields -->
            <div class="mt-4 grid grid-cols-2 gap-4">
               <div v-if="data.trigger_type != 'cron'" class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.runtimes }}</label>
                  <input v-model="data.runtimes" type="number" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
               </div>

               <div v-if="data.trigger_type != 'cron'" class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.interval_second }}</label>
                  <input v-model="data.interval_second" type="number" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
               </div>

               <div v-if="data.trigger_type == 'cron'" class="col-span-2 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.cron }}</label>
                  <input v-model="data.cron" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent" />
               </div>
            </div>

            <div class="mt-4 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
               <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ c.remarks }}</label>
               <textarea v-model="data.remarks" rows="3" class="w-full outline-none text-[#0D0D0D] text-sm bg-transparent resize-none"></textarea>
            </div>

         </div>
         <div class="border-t border-[#E5E5E5] p-4 flex justify-end items-center gap-2 bg-white">
           <Button variant="ghost" @click="editFormVisible = false">{{ c.cancel }}</Button>
           <Button variant="primary" :loading="submmitLoading" @click="submmit">{{ c.confirm }}</Button>
         </div>
       </div>
    </a-drawer>

    <!-- Log Drawer -->
    <a-drawer :visible="logDialogShow" :title="l.logShow" :width="700" @close="logDialogShow = false" :body-style="{ padding: 0 }">
       <div class="flex flex-col h-full bg-white font-roboto">
          <div class="p-4 border-b border-[#E5E5E5] flex justify-end">
             <Button variant="danger" :disabled="loglist.length == 0" :loading="clearLogLoading" @click="emptyLog">
                {{ l.clear }}
             </Button>
          </div>

          <div class="flex-1 overflow-auto custom-scrollbar">
             <div class="grid grid-cols-[1fr_1fr_1fr] gap-4 px-6 py-2 bg-[#F9F9F9] text-xs font-medium text-[#606060] border-b border-[#E5E5E5]">
                <div>{{ l.logBegintime }}</div>
                <div>{{ l.logEndtime }}</div>
                <div>{{ l.logSpendTime }}</div>
             </div>
             <div v-if="loglist.length == 0" class="p-4 text-center text-[#606060]">{{ c.noData }}</div>
             <div v-for="(log, idx) in loglist" :key="idx" class="grid grid-cols-[1fr_1fr_1fr] gap-4 px-6 py-2 border-b border-[#E5E5E5] text-sm">
                <div class="truncate">{{ log.begintime }}</div>
                <div class="truncate">{{ log.endtime }}</div>
                <div class="truncate">{{ log.spend_time }}</div>
             </div>
          </div>

          <div class="p-4 border-t border-[#E5E5E5]">
              <Pagination
                :page="logQuery.page"
                :pageSize="logQuery.size"
                :total="logtotal"
                :l="l"
                @update:page="logQuery.page = $event"
                @update:pageSize="logQuery.size = $event"
                @change="getLogList"
              />
          </div>
       </div>
    </a-drawer>

    <!-- Loading Overlay -->
    <div v-if="pageLoading" class="absolute inset-0 z-50 bg-white/50 flex items-center justify-center">
        <i class="el-icon-loading text-3xl text-[#065FD4]"></i>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, getCurrentInstance, onMounted } from 'vue'
import { message, Modal } from 'ant-design-vue'
import api from '@/api'
import { useLocalI18n } from '@/composables/useLocalI18n'
import Button from '@/views/sysbasics/video/adminViews/component/common/Button.vue'
import Pagination from '@/views/sysbasics/video/adminViews/component/common/Pagination.vue'
import { cloneDeep } from 'lodash'

// Global instance
const instance = getCurrentInstance()
const { $request, $message, $confirm } = instance.proxy

// Localization
const { l, c } = useLocalI18n('adminQurtz')

// State
const pageLoading = ref(false)
const submmitLoading = ref(false)
const exportLoading = ref(false)
const clearLogLoading = ref(false)
const editFormVisible = ref(false)
const logDialogShow = ref(false)

const list = ref([])
const total = ref(0)
const query = reactive({
  queryString: '',
  size: 10,
  page: 1,
})

const typeOptions = computed(() => [
   { label: l.value.cron || 'Cron', value: 'cron' },
   { label: l.value.typeOptions2 || 'Simple', value: 'simple' },
])

const initData = {
   job_name: '',
   job_group: '',
   trigger_type: 'cron',
   description: '',
   assembly_name: '',
   class_fullname: '',
   begintime: '',
   endtime: '',
   runtimes: 0,
   interval_second: 0,
   cron: '',
   remarks: ''
}
const data = reactive({ ...initData })

const logQuery = reactive({ page: 1, size: 10, jobid: '' })
const loglist = ref([])
const logtotal = ref(0)

// Methods
const getList = () => {
  pageLoading.value = true
  $request(api.quartz + 'getlist', query)
    .then(r => {
      // Process list to add labels
      list.value = r.data.list.map(i => {
         const t = typeOptions.value.find(j => j.value == i.trigger_type)
         if (t) i.trigger_type_label = t.label
         return i
      })
      total.value = r.data.total
      pageLoading.value = false
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const research = () => {
  query.page = 1
  getList()
}

const createItem = () => {
  Object.assign(data, initData)
  delete data.id
  editFormVisible.value = true
}

const editItem = (item) => {
   Object.assign(data, item)
   editFormVisible.value = true
}

const deleteItem = (item) => {
  Modal.confirm({
    title: c.value.oprConfirm,
    content: c.value.cfmDelete,
    onOk() {
      pageLoading.value = true
      $request(api.quartz + 'delete/' + item.id, {}, 'post')
        .then(() => {
           message.success(c.value.success)
           pageLoading.value = false
           getList()
        })
        .catch(() => {
           pageLoading.value = false
        })
    }
  })
}

const startOrPauseJob = (row, enable) => {
   pageLoading.value = true
   $request(api.quartz + 'enable', { id: row.id, enable }, 'post')
     .then(() => {
        pageLoading.value = false
        message.success(c.value.success)
        getList()
     })
     .catch(() => {
        pageLoading.value = false
     })
}

const doOnceJob = (row) => {
   pageLoading.value = true
   $request(api.quartz + 'do', { id: row.id }, 'post')
     .then(() => {
        pageLoading.value = false
        message.success(l.value.runed || 'Run initiated')
        getList()
     })
     .catch(() => {
        pageLoading.value = false
     })
}

const submmit = () => {
   submmitLoading.value = true
   const url = api.quartz + 'update'
   $request(url, data, 'post')
     .then(() => {
        submmitLoading.value = false
        message.success(c.value.success)
        editFormVisible.value = false
        getList()
     })
     .catch(() => {
        submmitLoading.value = false
     })
}

const showLog = (row) => {
   logQuery.page = 1
   logQuery.jobid = row.id
   loglist.value = []
   logtotal.value = 0
   logDialogShow.value = true
   getLogList()
}

const getLogList = () => {
   $request(api.quartz + 'getloglist', logQuery)
     .then(r => {
        loglist.value = r.data.list
        logtotal.value = r.data.total
     })
     .catch(() => {})
}

const emptyLog = () => {
   Modal.confirm({
      title: c.value.oprConfirm,
      content: l.value.clearLog || 'Clear all logs?',
      onOk() {
         clearLogLoading.value = true
         $request(api.quartz + 'emptylog', { jobid: loglist.value[0].job_id }, 'post')
           .then(() => {
              message.success(c.value.success)
              clearLogLoading.value = false
              logDialogShow.value = false
           })
           .catch(() => {
              clearLogLoading.value = false
           })
      }
   })
}

const exportData = () => {
   message.info('Export not implemented')
}

// Lifecycle
onMounted(() => {
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
