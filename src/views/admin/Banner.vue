<template>
  <div class="p-6 space-y-6" v-loading="pageLoading">
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <Input
          v-model="query.queryString.str"
          :placeholder="l.search"
          class="w-[200px]"
          @keyup.enter="research"
        />
        <Select v-model="query.queryString.status" class="w-[140px]" placeholder="Status">
           <SelectItem value="0">{{ c.all }}</SelectItem>
           <SelectItem value="1">{{ c.enabled }}</SelectItem>
           <SelectItem value="2">{{ c.disabled }}</SelectItem>
        </Select>
        <Button variant="secondary" @click="research">{{ c.queryButton }}</Button>
      </div>
      <div class="flex space-x-2">
         <Button v-if="indexFlag" @click="updateDetailSort" :disabled="sortLoading" variant="secondary">{{ c.saveIndex }}</Button>
         <Button @click="createItem">{{ c.create }}</Button>
      </div>
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
        <draggable
           v-model="list"
           tag="tbody"
           item-key="id"
           @end="onDragEnd"
           handle=".drag-handle"
        >
           <template #item="{ element, index }">
              <TableRow class="hover:bg-muted/50">
                 <TableCell v-for="col in columns" :key="col.key" class="drag-handle cursor-move">
                    <template v-if="col.key === 'status'">
                       <span class="px-2 py-0.5 rounded text-xs text-white" :class="statusClass[element.status]">{{ status[element.status] }}</span>
                    </template>
                    <template v-else>{{ element[col.key] }}</template>
                 </TableCell>
                 <TableCell>
                    <div class="flex space-x-2">
                       <Button variant="ghost" size="icon" class="h-6 w-6" @click.prevent="editItem(element, index)">
                          <i class="fa fa-pencil text-blue-600"></i>
                       </Button>
                       <Button variant="ghost" size="icon" class="h-6 w-6" @click.prevent="deleteItem(element, index)">
                          <i class="fa fa-trash text-red-600"></i>
                       </Button>
                    </div>
                 </TableCell>
              </TableRow>
           </template>
        </draggable>
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
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.name }} *</Label>
              <Input v-model="data.name" class="col-span-3" />
           </div>
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.description }}</Label>
              <Input v-model="data.description" class="col-span-3" />
           </div>
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.link }}</Label>
              <Input v-model="data.link" class="col-span-3" />
           </div>
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.isEnable }}</Label>
              <div class="col-span-3">
                 <input type="checkbox" :checked="data.status == '1'" @change="e => data.status = e.target.checked ? '1' : '2'" />
              </div>
           </div>
           <div class="grid grid-cols-4 items-start gap-4">
              <Label class="text-right pt-2">{{ l.upload }}</Label>
              <div class="col-span-3">
                 <!-- Simple file input placeholder -->
                 <input type="file" @change="e => data.file = [e.target.files[0]]" />
                 <div v-if="data.file_url" class="mt-2 text-xs">{{ data.file_url }}</div>
              </div>
           </div>
           <!-- Extra Selects -->
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.empnopz }} *</Label>
              <Select v-model="data.empnopz" class="col-span-3">
                 <SelectItem value="Y">Y</SelectItem>
                 <SelectItem value="N">N</SelectItem>
              </Select>
           </div>
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.orgidpz }} *</Label>
              <Select v-model="data.orgidpz" class="col-span-3">
                 <SelectItem value="Y">Y</SelectItem>
                 <SelectItem value="N">N</SelectItem>
              </Select>
           </div>
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.deptnopz }} *</Label>
              <Select v-model="data.deptnopz" class="col-span-3">
                 <SelectItem value="Y">Y</SelectItem>
                 <SelectItem value="N">N</SelectItem>
              </Select>
           </div>
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.otherspz }} *</Label>
              <Select v-model="data.otherspz" class="col-span-3">
                 <SelectItem value="Y">Y</SelectItem>
                 <SelectItem value="N">N</SelectItem>
              </Select>
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
import draggable from 'vuedraggable'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectItem } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import { Pagination } from '@/components/ui/pagination'
import { useLocalI18n } from '@/composables/useLocalI18n'
import { _, api, defaultConfig } from '@/views/_common'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('adminBanner')

const pageLoading = ref(false)
const list = ref([])
const total = ref(0)
const editFormVisible = ref(false)
const submmitLoading = ref(false)
const sortLoading = ref(false)
const indexFlag = ref(false)

const config = Object.assign({}, _.cloneDeep(defaultConfig), {
  api: api.banner,
})

const query = reactive({
  queryString: { str: '', status: '' },
  size: 10,
  page: 1,
})

const initData = { file: [], status: '1' }
const data = ref({ ...initData })
const name = computed(() => l.value?.title || 'Title')

const status = computed(() => ({ 1: c.value?.enabled, 2: c.value?.disabled }))
const statusClass = { 1: 'bg-green-500', 2: 'bg-red-500' }

const columns = computed(() => [
  { title: l.value?.name, key: 'name', width: 200 },
  { title: l.value?.description, key: 'description' },
  { title: l.value?.link, key: 'link' },
  { title: l.value?.file_name, key: 'file_name' },
  { title: l.value?.file_url, key: 'file_url' },
  { title: l.value?.empnopz, key: 'empnopz' },
  { title: l.value?.orgidpz, key: 'orgidpz' },
  { title: l.value?.deptnopz, key: 'deptnopz' },
  { title: l.value?.otherspz, key: 'otherspz' },
  { title: l.value?.status, key: 'status', width: 70 },
  { title: c.value?.modify_user, key: 'modify_user', width: 100 },
  { title: c.value?.modify_time, key: 'modify_time', width: 140 },
])

const getList = () => {
    pageLoading.value = true
    proxy.$request(config.api + 'getlist', query).then(r => {
        list.value = r.data.rows
        total.value = r.data.total
        pageLoading.value = false
    }).catch(() => pageLoading.value = false)
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
    data.value = _.cloneDeep(initData)
    editFormVisible.value = true
}

const editItem = (row) => {
    data.value = _.cloneDeep(row)
    data.value.status = String(data.value.status)
    data.value.file = [] // Reset file input
    editFormVisible.value = true
}

const deleteItem = (row) => {
    if(window.confirm(c.value?.deleteConfirm)) {
        pageLoading.value = true
        proxy.$request(config.api + 'delete', { id: row.id }).then(() => {
            pageLoading.value = false
            proxy.$message.success(c.value?.deleteSuccess)
            getList()
        }).catch(() => pageLoading.value = false)
    }
}

const submmit = () => {
    submmitLoading.value = true
    let formData = new FormData()
    if (data.value.file && data.value.file[0]) {
        formData.append('file[]', data.value.file[0])
    }
    formData.append('model', JSON.stringify(data.value))

    proxy.$request(config.api + 'createormodify', formData, 'post').then(() => {
        submmitLoading.value = false
        proxy.$message.success(c.value?.success)
        editFormVisible.value = false
        getList()
    }).catch(() => submmitLoading.value = false)
}

const onDragEnd = () => {
    indexFlag.value = true
}

const updateDetailSort = () => {
    sortLoading.value = true
    let listSortIds = list.value.map(v => v.id)
    proxy.$request(config.api + 'updateSeq', listSortIds, 'post').then(() => {
        sortLoading.value = false
        indexFlag.value = false
        getList()
    }).catch(() => sortLoading.value = false)
}

onMounted(() => {
    getList()
})
</script>

<style scoped>
</style>
