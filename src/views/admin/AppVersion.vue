<template>
  <div class="p-6 space-y-6" v-loading="pageLoading">
    <!-- Header Actions -->
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <Input
          v-model="query.queryString.str"
          :placeholder="l?.search"
          class="w-[250px]"
          @keyup.enter="research"
        />
        <Select v-model="query.queryString.system" :placeholder="l?.systemPd">
          <SelectItem value="all">ALL</SelectItem>
          <SelectItem value="ios">IOS</SelectItem>
          <SelectItem value="android">Android</SelectItem>
        </Select>
        <Select v-model="query.queryString.install_type" :placeholder="l?.install_typePd">
          <SelectItem value="1">{{ l?.full }}</SelectItem>
          <SelectItem value="2">{{ l?.incremental }}</SelectItem>
        </Select>
        <Button variant="secondary" @click="research">{{ c?.queryButton }}</Button>
      </div>
      <Button @click="createItem">{{ c?.create }}</Button>
    </div>

    <!-- Table -->
    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead v-for="col in columns" :key="col.key" :style="{ width: col.width + 'px' }">
              {{ col.title }}
            </TableHead>
            <TableHead>Operation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(row, index) in list" :key="index">
            <TableCell v-for="col in columns" :key="col.key">
               <template v-if="col.key === 'system'">
                {{ systemMap[row[col.key]] }}
              </template>
              <template v-else-if="col.key === 'install_type'">
                {{ typeMap[row[col.key]] }}
              </template>
              <template v-else>
                {{ row[col.key] }}
              </template>
            </TableCell>
            <TableCell>
              <div class="flex space-x-2">
                <Button variant="link" class="text-blue-600 h-auto p-0" @click.prevent="editItem(row, index)">{{ c?.edit }}</Button>
                <Button variant="link" class="text-green-600 h-auto p-0" @click.prevent="copyItem(row, index)">{{ c?.copy }}</Button>
                <Button variant="link" class="text-red-600 h-auto p-0" @click.prevent="deleteItem(row, index)">{{ c?.delete }}</Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>

    <!-- Pagination -->
    <div class="flex justify-end">
      <Pagination
        v-model="query.page"
        :total="total"
        :page-size="query.size"
        @update:modelValue="handlePageChange"
      />
    </div>

    <!-- Dialog -->
    <Dialog :open="editFormVisible" @update:open="val => editFormVisible = val">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{{ name }}</DialogTitle>
          <DialogDescription>
            Make changes to the app version here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-4 py-4">
          <div class="grid grid-cols-4 items-center gap-4">
             <Label class="text-right">{{ l?.app_id }} *</Label>
             <Input v-model="data.app_id" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
             <Label class="text-right">{{ l?.app_name }} *</Label>
             <Input v-model="data.app_name" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
             <Label class="text-right">{{ l?.system }} *</Label>
             <Select v-model="data.system" class="col-span-3">
                <SelectItem value="all">ALL</SelectItem>
                <SelectItem value="android">Android</SelectItem>
                <SelectItem value="ios">IOS</SelectItem>
             </Select>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
             <Label class="text-right">{{ l?.is_test }}</Label>
             <Select v-model="data.is_test" class="col-span-3">
                <SelectItem value="Y">Y</SelectItem>
                <SelectItem value="N">N</SelectItem>
             </Select>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
             <Label class="text-right">{{ l?.install_type }}</Label>
             <Select v-model="data.install_type" class="col-span-3" :disabled="data.system === 'all'">
                <SelectItem :value="1">{{ l?.full }}</SelectItem>
                <SelectItem :value="2">{{ l?.incremental }}</SelectItem>
             </Select>
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
             <Label class="text-right">{{ l?.version }} *</Label>
             <Input v-model="data.version" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
             <Label class="text-right">{{ l?.url }} *</Label>
             <Input v-model="data.file" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
             <Label class="text-right">{{ l?.version_notes }} *</Label>
             <Textarea v-model="data.version_notes" class="col-span-3" />
          </div>
          <div class="grid grid-cols-4 items-center gap-4">
             <Label class="text-right">{{ l?.remarks }}</Label>
             <Textarea v-model="data.remarks" class="col-span-3" />
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" @click="submmit" :disabled="submmitLoading">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, watch } from 'vue'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectItem } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Pagination } from '@/components/ui/pagination'

import { _, api, defaultConfig } from '@/views/_common'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('adminAppVersion')

const pageLoading = ref(false)
const list = ref([])
const total = ref(0)
const editFormVisible = ref(false)
const submmitLoading = ref(false)

const config = Object.assign({}, _.cloneDeep(defaultConfig), {
  api: api.appVersion,
  apiCreate: api.appVersion + 'addormodify',
  apiEdit: api.appVersion + 'addormodify',
})

const query = reactive({
  queryString: { str: '', system: '', install_type: undefined },
  size: 10,
  page: 1,
})

const data = ref({})
const initData = { pkg_url: '', install_type: '', file: '' }
const name = computed(() => l.value?.title || 'Title')

const systemMap = { all: 'ALL', android: 'Android', ios: 'IOS' }
const typeMap = computed(() => ({ 1: l.value?.full, 2: l.value?.incremental }))

const columns = computed(() => [
  { title: l.value?.app_id, key: 'app_id', width: 120 },
  { title: l.value?.app_name, key: 'app_name', width: 140 },
  { title: l.value?.system, key: 'system', width: 100 },
  { title: l.value?.is_test, key: 'is_test', width: 80 },
  { title: l.value?.install_type, key: 'install_type', width: 100 },
  { title: l.value?.version, key: 'version', width: 120 },
  { title: l.value?.pkg_url, key: 'pkg_url', width: 120 },
  { title: l.value?.wgt_url, key: 'wgt_url', width: 120 },
  { title: l.value?.version_notes, key: 'version_notes', width: 220 },
  { title: l.value?.remarks, key: 'remarks', width: 140 },
  { title: c.value?.modify_user, key: 'modify_user', width: 90 },
  { title: c.value?.modify_time, key: 'modify_time', width: 140 },
])

const getList = () => {
  pageLoading.value = true
  const q = formatQuery(query)
  proxy.$request(config.api + 'list', q)
    .then(r => {
      list.value = r.data.rows
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

const handlePageChange = (newPage) => {
  query.page = newPage
  getList()
}

const formatQuery = (q) => {
  let _q = _.cloneDeep(q)
  _q.queryString = JSON.stringify(_q.queryString)
  return _q
}

const createItem = () => {
  data.value = _.cloneDeep(initData)
  editFormVisible.value = true
}

const editItem = (row) => {
  data.value = _.cloneDeep(initData)
  pageLoading.value = true
  let url = config.api + 'getbyid'
  proxy.$request(url, { id: row.id })
    .then((r) => {
      pageLoading.value = false
      data.value = formatAfterGet(r.data || {})
      let file = data.value.pkg_url ? data.value.pkg_url : data.value.wgt_url
      data.value.file = file
      editFormVisible.value = true
    })
    .catch(() => {
      pageLoading.value = false
    })
}

const copyItem = (row) => {
  let newData = _.cloneDeep(row)
  delete newData.id
  delete newData.create_time
  delete newData.create_user
  delete newData.modify_time
  delete newData.modify_user

  let file = newData.pkg_url ? newData.pkg_url : newData.wgt_url
  newData.file = file
  data.value = newData
  editFormVisible.value = true
}

const deleteItem = (row) => {
  if (window.confirm(c.value?.deleteConfirm)) {
     proxy.$request(config.api + 'delete', { id: row.id })
      .then(() => {
        proxy.$message.success(c.value?.deleteSuccess)
        getList()
      })
  }
}

const formatAfterGet = (d) => {
  return d
}

const formatBeforeSave = (d) => {
  d.wgt_url = ''
  d.pkg_url = ''
  if (d.file) {
    if (d.install_type == 1) {
      d.pkg_url = d.file
    }
    if (d.install_type == 2 || d.system == 'all') {
      d.wgt_url = d.file
    }
  }
  if (d.install_type == 1 && d.system == 'ios') {
    if (d.pkg_url && d.pkg_url.indexOf('apps.apple') < 0) {
      proxy.$message({
        message: l.value?.iosUrlCheck,
        type: 'error',
      })
    }
  }
  return d
}

const submmit = () => {
  submmitLoading.value = true
  let d = _.cloneDeep(data.value)
  d = formatBeforeSave(d)

  let url = d.id ? config.apiEdit : config.apiCreate

  proxy.$request(url, d)
    .then(() => {
      submmitLoading.value = false
      editFormVisible.value = false
      proxy.$message.success(c.value?.saveSuccess)
      getList()
    })
    .catch(() => {
      submmitLoading.value = false
    })
}

watch(() => data.value.system, (val) => {
  if (val === 'all') {
    data.value.install_type = 2
  }
})

onMounted(() => {
  getList()
})
</script>

<style scoped>
</style>
