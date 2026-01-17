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
            <TableHead v-for="col in columns" :key="col.key" :style="{ width: col.width + 'px' }">
              {{ col.title }}
            </TableHead>
            <TableHead>Operation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(row, index) in list" :key="index">
            <TableCell v-for="col in columns" :key="col.key">
              {{ row[col.key] }}
            </TableCell>
            <TableCell>
              <div class="flex space-x-2">
                <Button variant="link" class="text-blue-600 h-auto p-0" @click.prevent="editItem(row, index)">{{ c.edit }}</Button>
                <Button variant="link" class="text-green-600 h-auto p-0" @click.prevent="copyItem(row, index)">{{ c.copy }}</Button>
                <Button variant="link" class="text-red-600 h-auto p-0" @click.prevent="deleteItem(row, index)">{{ c.delete }}</Button>
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

    <Dialog :open="editFormVisible" @update:open="val => editFormVisible = val">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{{ name }}</DialogTitle>
        </DialogHeader>
        <div class="grid gap-4 py-4">
           <div v-for="field in fields" :key="field.key" class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">
                 {{ field.title }} <span v-if="field.required" class="text-red-500">*</span>
              </Label>
              <Input v-model="data[field.key]" class="col-span-3" />
           </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="editFormVisible = false">{{ c.cancel }}</Button>
          <Button type="submit" @click="submmit" :disabled="submmitLoading">{{ c.confirm }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance } from 'vue'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import { Pagination } from '@/components/ui/pagination'
import { useLocalI18n } from '@/composables/useLocalI18n'
import { _, api, defaultConfig } from '@/views/_common'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('adminTestUser')

const pageLoading = ref(false)
const list = ref([])
const total = ref(0)
const editFormVisible = ref(false)
const submmitLoading = ref(false)
const exportLoading = ref(false)

const config = Object.assign({}, _.cloneDeep(defaultConfig), {
  api: api.rtestuser,
  apiCreate: api.rtestuser + 'update',
})

const query = reactive({
  queryString: '',
  size: 10,
  page: 1,
})

const data = ref({})
const name = computed(() => l.value?.title || 'Title')

const columns = computed(() => [
  { title: l.value?.userid, key: 'userid', width: 160 },
  { title: l.value?.username, key: 'username', width: 200 },
  { title: l.value?.department, key: 'department_t', width: 200 },
  { title: l.value?.in_date, key: 'in_date', width: 200 },
  { title: l.value?.out_date, key: 'out_date', width: 200 },
  { title: c.value?.modify_user, key: 'modify_user', width: 160 },
  { title: c.value?.modify_time, key: 'modify_time' }
])

const fields = computed(() => [
  { title: l.value?.userid, key: 'userid', required: true },
])

const getList = () => {
  pageLoading.value = true
  proxy.$request(config.api + 'getlist', query)
    .then(r => {
      list.value = r.data.rows
      total.value = r.data.total
      pageLoading.value = false
    })
    .catch(() => pageLoading.value = false)
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
  pageLoading.value = true
  proxy.$request(config.api + 'getbyid', { id: row.id })
    .then(r => {
       pageLoading.value = false
       data.value = r.data // Assuming structure
       editFormVisible.value = true
    })
    .catch(() => pageLoading.value = false)
}

const copyItem = (row) => {
  pageLoading.value = true
  proxy.$request(config.api + 'getbyid', { id: row.id })
    .then(r => {
      pageLoading.value = false
      data.value = r.data
      data.value.id = null
      editFormVisible.value = true
    })
    .catch(() => pageLoading.value = false)
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
