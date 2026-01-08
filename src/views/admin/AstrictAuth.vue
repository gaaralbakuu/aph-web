<template>
  <div class="p-6 space-y-6" v-loading="pageLoading">
    <div class="flex justify-between items-center">
      <div class="flex items-center space-x-4">
        <Input
          v-model="query.orgid"
          :placeholder="l.org_id"
          class="w-[200px]"
          @keyup.enter="research"
        />
        <Input
          v-model="query.deptcodes"
          :placeholder="l.dept_codes"
          class="w-[200px]"
          @keyup.enter="research"
        />
        <Button variant="secondary" @click="research">{{ c.queryButton }}</Button>
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
               <template v-if="col.key === 'system'"></template>
               <template v-else>{{ row[col.key] }}</template>
            </TableCell>
            <TableCell>
              <div class="flex space-x-2">
                <Button variant="link" class="text-blue-600 h-auto p-0" @click.prevent="editItem(row, index)">{{ c.edit }}</Button>
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
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.org_id }} *</Label>
              <Input v-model="data.org_id" class="col-span-3" />
           </div>

           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.dept_codes }} *</Label>
              <!-- DynamicTag replacement: Input for now, or use tags input logic. Original used 'dynamicTag'. Assuming comma separated. -->
              <!-- Or implement simple tag input. For now: Text input. -->
              <!-- Or DynamicTag component if available. -->
              <Input v-model="data.dept_codes_str" class="col-span-3" placeholder="Use comma to separate" />
           </div>

           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.menu_name }} *</Label>
              <Select v-model="data.menu_id" class="col-span-3">
                 <SelectItem v-for="opt in menuOptions" :key="opt.menu_id" :value="opt.menu_id">
                    {{ opt.menu_name_label }}
                 </SelectItem>
              </Select>
           </div>

           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ c.remarks }}</Label>
              <Input v-model="data.remark" class="col-span-3" />
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
import { Select, SelectItem } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import { Pagination } from '@/components/ui/pagination'
import { useLocalI18n } from '@/composables/useLocalI18n'
import { _, api, defaultConfig } from '@/views/_common'
import { localGet } from '@/utils/auth'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('adminAstrictAuth')

const pageLoading = ref(false)
const list = ref([])
const total = ref(0)
const editFormVisible = ref(false)
const submmitLoading = ref(false)
const menuOptions = ref([])

const config = Object.assign({}, _.cloneDeep(defaultConfig), {
  api: api.auth,
  apiCreate: api.auth + 'InsertOrUpdateCAuthBlack',
  apiList: api.auth + 'GetCAuthBlacklist',
})

const query = reactive({
  size: 10,
  page: 1,
  orgid: '',
  deptcodes: ''
})

const data = ref({})
const currentLang = localGet('lang') || 'zh-CN'
const name = computed(() => l.value?.title || 'Title')

const columns = computed(() => [
  { title: l.value?.org_id, key: 'org_id' },
  { title: l.value?.dept_codes, key: 'dept_codes' },
  { title: l.value?.menu_name, key: 'menu_name' },
  { title: c.value?.remarks, key: 'remark' },
])

const init = () => {
    proxy.$request(proxy.$api.menu + 'getlist', { type: 'APP' }).then(r => {
        menuOptions.value = r.data
    })
}

const getList = () => {
    pageLoading.value = true
    proxy.$request(config.apiList, query).then(r => {
        list.value = formatList(r.data.rows)
        total.value = r.data.total
        pageLoading.value = false
    }).catch(() => pageLoading.value = false)
}

const formatList = (l) => {
    return l.map(i => {
        const menus = JSON.parse(i.menu_name || '[]')
        const label = menus.find(m => m.key == currentLang)?.label
        i.menu_name = label || i.menu_name
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
    data.value = { dept_codes: [] }
    data.value.dept_codes_str = ''
    editFormVisible.value = true
}

const editItem = (row) => {
    data.value = _.cloneDeep(row)
    data.value.dept_codes_str = (data.value.dept_codes || '').toString() // ensure string
    editFormVisible.value = true
}

const deleteItem = (row) => {
    if(window.confirm(c.value?.deleteConfirm)) {
        pageLoading.value = true
        proxy.$request(api.auth + 'DeleteCAuthBlackById', { id: row.id }, 'post')
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
    const d = _.cloneDeep(data.value)
    d.dept_codes = d.dept_codes_str

    proxy.$request(config.apiCreate, d, 'post').then(() => {
        submmitLoading.value = false
        editFormVisible.value = false
        proxy.$message.success(c.value?.success)
        getList()
    }).catch(() => submmitLoading.value = false)
}

onMounted(() => {
    getList()
    init()
})
</script>

<style scoped>
</style>
