<template>
  <div class="p-6 space-y-6" v-loading="pageLoading">
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <Input
          v-model="query.queryString"
          :placeholder="c.queryPlaceholder"
          class="w-[300px]"
          @keyup.enter="research"
        />
        <Button variant="secondary" @click="research">{{ c.queryButton }}</Button>
        <Button variant="outline" @click="exportData" :disabled="exportLoading">
           {{ exportLoading ? 'Exporting...' : c.export }}
        </Button>
      </div>
      <Button @click="createItem">{{ c.create }}</Button>
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead v-for="col in columns" :key="col.key">
              {{ col.title }}
            </TableHead>
            <TableHead>Operation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(row, index) in list" :key="index">
            <TableCell v-for="col in columns" :key="col.key">
               <template v-if="col.key === 'enabled'">
                  <span v-if="!row[col.key]" class="px-2 py-0.5 rounded text-xs text-white bg-gray-500">{{ l.stopped }}</span>
                  <span v-else class="px-2 py-0.5 rounded text-xs text-white bg-blue-500">{{ c.enabled }}</span>
               </template>
               <template v-else-if="col.key === 'running'">
                  <span v-if="!row[col.key]" class="px-2 py-0.5 rounded text-xs text-white bg-gray-500">{{ l.free }}</span>
                  <span v-else class="px-2 py-0.5 rounded text-xs text-white bg-green-500">{{ l.operating }}</span>
               </template>
               <template v-else>
                  {{ row[col.key] }}
               </template>
            </TableCell>
            <TableCell>
              <div class="flex items-center space-x-2">
                <Button
                   variant="ghost"
                   size="icon"
                   class="h-6 w-6"
                   :disabled="!!row.enabled"
                   @click.prevent="editItem(row, index)"
                   title="Edit"
                >
                   <i class="fa fa-pencil text-blue-600"></i>
                </Button>

                <Button
                   v-if="!row.enabled"
                   variant="ghost"
                   size="icon"
                   class="h-6 w-6"
                   @click.prevent="startOrPauseJob(row, 1)"
                   title="Enable"
                >
                   <i class="fa fa-play text-green-600"></i>
                </Button>
                <Button
                   v-else
                   variant="ghost"
                   size="icon"
                   class="h-6 w-6"
                   @click.prevent="startOrPauseJob(row, 0)"
                   title="Stop"
                >
                   <i class="fa fa-stop text-yellow-600"></i>
                </Button>

                <Button
                   variant="ghost"
                   size="icon"
                   class="h-6 w-6"
                   :disabled="!!row.enabled"
                   @click.prevent="doOnceJob(row)"
                   title="Run Once"
                >
                   <i class="fa fa-repeat text-blue-600"></i>
                </Button>

                <Button
                   variant="ghost"
                   size="icon"
                   class="h-6 w-6"
                   :disabled="!!row.enabled"
                   @click.prevent="deleteItem(row, index)"
                   title="Delete"
                >
                   <i class="fa fa-trash text-red-600"></i>
                </Button>

                <Button
                   variant="ghost"
                   size="icon"
                   class="h-6 w-6"
                   @click.prevent="showLog(row, index)"
                   title="Log"
                >
                   <i class="fa fa-list-ol text-gray-600"></i>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <div class="flex justify-end">
      <Pagination
        v-model="query.page"
        :total="total"
        :page-size="query.size"
        @update:modelValue="handlePageChange"
      />
    </div>

    <!-- Edit Dialog -->
    <Dialog :open="editFormVisible" @update:open="val => editFormVisible = val">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{{ name }}</DialogTitle>
        </DialogHeader>
        <div class="grid gap-4 py-4">
           <!-- Manually render fields for better control or map them -->
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.job_name }} *</Label>
              <Input v-model="data.job_name" class="col-span-3" />
           </div>
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.job_group }} *</Label>
              <Input v-model="data.job_group" class="col-span-3" />
           </div>
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.trigger_type_label }} *</Label>
              <Select v-model="data.trigger_type" class="col-span-3">
                 <SelectItem v-for="opt in typeOptions" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                 </SelectItem>
              </Select>
           </div>
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.description }}</Label>
              <Input v-model="data.description" class="col-span-3" />
           </div>
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.assembly_name }} *</Label>
              <Input v-model="data.assembly_name" class="col-span-3" />
           </div>
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.class_fullname }} *</Label>
              <Input v-model="data.class_fullname" class="col-span-3" />
           </div>
           <!-- Date pickers omitted or use simple input type="datetime-local" for now -->
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.begintime }}</Label>
              <Input type="datetime-local" v-model="data.begintime" class="col-span-3" />
           </div>
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.endtime }}</Label>
              <Input type="datetime-local" v-model="data.endtime" class="col-span-3" />
           </div>

           <div v-if="data.trigger_type != 'cron'" class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.runtimes }}</Label>
              <Input type="number" v-model="data.runtimes" class="col-span-3" />
           </div>
           <div v-if="data.trigger_type != 'cron'" class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.interval_second }}</Label>
              <Input type="number" v-model="data.interval_second" class="col-span-3" />
           </div>
           <div v-if="data.trigger_type == 'cron'" class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.cron }}</Label>
              <Input v-model="data.cron" class="col-span-3" />
           </div>
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ c.remarks }}</Label>
              <Textarea v-model="data.remarks" class="col-span-3" />
           </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="editFormVisible = false">{{ c.cancel }}</Button>
          <Button type="submit" @click="submmit" :disabled="submmitLoading">{{ c.confirm }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Log Dialog -->
    <Dialog :open="logDialogShow" @update:open="val => logDialogShow = val">
      <DialogContent class="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{{ l.logShow }}</DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
           <div class="flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                :disabled="loglist.length == 0 || submmitLoading"
                @click="emptyLog"
              >
                 {{ l.clear }}
              </Button>
           </div>
           <div class="rounded-md border max-h-[400px] overflow-auto">
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead v-for="col in table2columns" :key="col.key">
                     {{ col.title }}
                   </TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 <TableRow v-for="(row, index) in loglist" :key="index">
                   <TableCell v-for="col in table2columns" :key="col.key">
                     {{ row[col.key] }}
                   </TableCell>
                 </TableRow>
               </TableBody>
             </Table>
           </div>
           <div class="flex justify-end">
             <Pagination
               v-model="logQuery.page"
               :total="logtotal"
               :page-size="logQuery.size"
               @update:modelValue="val => { logQuery.page = val; getLogList() }"
             />
           </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="logDialogShow = false">Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, watch } from 'vue'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectItem } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import { Pagination } from '@/components/ui/pagination'
import { useLocalI18n } from '@/composables/useLocalI18n'
import { _, api, defaultConfig } from '@/views/_common'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('adminQurtz') // Note: typo 'Qurtz' copied from original

const pageLoading = ref(false)
const list = ref([])
const total = ref(0)
const editFormVisible = ref(false)
const submmitLoading = ref(false)
const exportLoading = ref(false)

const logDialogShow = ref(false)
const logQuery = reactive({ page: 1, size: 10, jobid: null })
const loglist = ref([])
const logtotal = ref(0)

const config = Object.assign({}, _.cloneDeep(defaultConfig), {
  api: api.quartz,
  apiCreate: api.quartz + 'update',
})

const query = reactive({
  queryString: '',
  size: 10,
  page: 1,
})

const data = ref({})
const name = computed(() => l.value?.title || 'Title')

const typeOptions = computed(() => [
  { label: l.value?.cron, value: 'cron' },
  { label: l.value?.typeOptions2, value: 'simple' },
])

const columns = computed(() => [
  { title: l.value?.job_name, key: 'job_name', width: 100 },
  { title: l.value?.job_group, key: 'job_group', width: 80 },
  { title: l.value?.enabled, key: 'enabled', width: 80 },
  { title: l.value?.description, key: 'description', width: 140 },
  { title: l.value?.running, key: 'running', width: 80 },
  { title: l.value?.last_run_time, key: 'last_run_time', width: 140 },
  { title: l.value?.trigger_type_label, key: 'trigger_type_label', width: 100 },
  { title: l.value?.cron, key: 'cron', width: 120 },
  { title: l.value?.begintime, key: 'begintime', width: 140 },
  { title: l.value?.endtime, key: 'endtime', width: 140 },
  { title: l.value?.runtimes, key: 'runtimes', width: 70 },
  { title: l.value?.interval_second, key: 'interval_second', width: 90 },
  { title: l.value?.assembly_name, key: 'assembly_name', width: 140 },
  { title: l.value?.class_fullname, key: 'class_fullname', width: 170 },
  { title: c.value?.remarks, key: 'remarks' },
  { title: c.value?.modify_user, key: 'modify_user', width: 90 },
  { title: c.value?.modify_time, key: 'modify_time', width: 140 },
])

const table2columns = computed(() => [
  { title: l.value?.logBegintime, key: 'begintime' },
  { title: l.value?.logEndtime, key: 'endtime' },
  { title: l.value?.logSpendTime, key: 'spend_time' },
])

const getList = () => {
  pageLoading.value = true
  proxy.$request(config.api + 'getlist', query)
    .then(r => {
      list.value = formatList(r.data.list)
      total.value = r.data.total
      pageLoading.value = false
    })
    .catch(() => pageLoading.value = false)
}

const formatList = (l) => {
  let tmp = _.cloneDeep(l)
  return tmp.map((i) => {
    let t = typeOptions.value.find((j) => j.value == i.trigger_type)
    if (t) i.trigger_type_label = t.label
    return i
  })
}

const research = () => {
  query.page = 1
  getList()
}

const handlePageChange = (val) => {
  query.page = val
  getList()
}

const createItem = () => {
  data.value = {}
  editFormVisible.value = true
}

const editItem = (row) => {
  data.value = _.cloneDeep(row)
  editFormVisible.value = true
}

const deleteItem = (row) => {
  if (window.confirm(c.value?.deleteConfirm)) {
    pageLoading.value = true
    proxy.$request(config.api + 'delete', { id: row.id })
      .then(() => {
        pageLoading.value = false
        proxy.$message.success(c.value?.deleteSuccess)
        getList()
      })
      .catch(() => pageLoading.value = false)
  }
}

const startOrPauseJob = (row, enable) => {
  let url = config.api + 'enable'
  pageLoading.value = true
  proxy.$request(url, { id: row.id, enable }, 'post')
    .then(() => {
      pageLoading.value = false
      proxy.$message.success(c.value?.success)
      getList()
    })
    .catch(() => pageLoading.value = false)
}

const doOnceJob = (row) => {
  let url = config.api + 'do'
  pageLoading.value = true
  proxy.$request(url, { id: row.id }, 'post')
    .then(() => {
      pageLoading.value = false
      proxy.$message.success(l.value?.runed)
      getList()
    })
    .catch(() => pageLoading.value = false)
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
  let url = config.api + 'getloglist'
  proxy.$request(url, logQuery)
    .then(r => {
      loglist.value = r.data.list
      logtotal.value = r.data.total
    })
    .catch(() => {})
}

const emptyLog = () => {
  if (window.confirm(l.value?.clearLog)) {
    submmitLoading.value = true
    let url = config.api + 'emptylog'
    proxy.$request(url, { jobid: loglist.value[0]?.job_id }, 'post')
      .then(() => {
        proxy.$message.success(c.value?.success)
        submmitLoading.value = false
        logDialogShow.value = false
      })
      .catch(() => submmitLoading.value = false)
  }
}

const submmit = () => {
  submmitLoading.value = true
  let url = config.apiCreate
  proxy.$request(url, data.value, 'post')
    .then(() => {
      submmitLoading.value = false
      editFormVisible.value = false
      proxy.$message.success(c.value?.success)
      getList()
    })
    .catch(() => submmitLoading.value = false)
}

const exportData = () => {
  // Implement export
}

onMounted(() => {
  getList()
})
</script>

<style scoped>
</style>
