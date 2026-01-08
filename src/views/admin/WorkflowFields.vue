<template>
  <div class="p-6 space-y-6" v-loading="pageLoading">
    <div class="flex justify-between items-start">
      <div class="space-y-4 flex-1">
         <div class="flex items-center space-x-4">
             <Input
                v-model="query.queryString.str"
                :placeholder="l.search"
                class="w-[300px]"
                @keyup.enter="researchMain"
             />
             <Button variant="secondary" @click="researchMain">{{ c.queryButton }}</Button>
         </div>
      </div>
      <Button @click="createItem">{{ c.create }}</Button>
    </div>

    <div class="grid grid-cols-12 gap-6">
       <!-- Left Panel: Workflow List -->
       <div class="col-span-12 lg:col-span-5">
          <div class="rounded-md border">
             <Table>
                <TableHeader>
                   <TableRow>
                      <TableHead v-for="col in columns" :key="col.key">{{ col.title }}</TableHead>
                      <TableHead>Op</TableHead>
                   </TableRow>
                </TableHeader>
                <TableBody>
                   <TableRow
                      v-for="(row, index) in list"
                      :key="index"
                      class="cursor-pointer"
                      :class="{ 'bg-muted/50': processCode === row.process_code && detailFlag }"
                      @click="clickDetail(row)"
                   >
                      <TableCell v-for="col in columns" :key="col.key">
                         <template v-if="col.key === 'status'">
                            <span class="px-2 py-0.5 rounded text-xs text-white" :class="statusClass[row.status]">{{ status[row.status] }}</span>
                         </template>
                         <template v-else>{{ row[col.key] }}</template>
                      </TableCell>
                      <TableCell>
                         <div class="flex space-x-2">
                             <Button variant="ghost" size="icon" class="h-6 w-6" :class="statusButtonClass[row.status]" @click.stop.prevent="disOrEnable(row)">
                                <i :class="row.status == 1 ? 'fa fa-ban' : 'fa fa-check'"></i>
                             </Button>
                             <Button variant="ghost" size="icon" class="h-6 w-6" @click.stop.prevent="editItem(row)">
                                <i class="fa fa-pencil text-blue-600"></i>
                             </Button>
                             <Button variant="ghost" size="icon" class="h-6 w-6" @click.stop.prevent="deleteItem(row)">
                                <i class="fa fa-trash text-red-600"></i>
                             </Button>
                         </div>
                      </TableCell>
                   </TableRow>
                </TableBody>
             </Table>
          </div>
          <div class="mt-4 flex justify-end">
             <Pagination
               v-model="query.page"
               :total="total"
               :page-size="query.size"
               @update:modelValue="val => { query.page = val; getList() }"
             />
          </div>
       </div>

       <!-- Right Panel: Workflow Details -->
       <div class="col-span-12 lg:col-span-7" v-if="detailFlag">
          <div class="flex justify-between items-center mb-4 min-h-[40px]">
             <div class="flex items-center space-x-2 w-1/2">
                <span class="whitespace-nowrap text-sm font-bold">Version:</span>
                <Select v-model="versionProcessSelected" @update:modelValue="changeVersionProcess">
                   <SelectItem v-for="item in versionProcess" :key="item.value" :value="item.value">
                      {{ item.label }}
                   </SelectItem>
                </Select>
             </div>
             <div class="flex space-x-2">
                <Button @click="openDetail" variant="outline">{{ l.addDetail }}</Button>
                <Button v-if="indexFlag" @click="updateDetailSort" :disabled="sortLoading" variant="secondary">{{ c.saveIndex }}</Button>
             </div>
          </div>

          <div class="rounded-md border">
             <Table>
                <TableHeader>
                   <TableRow>
                      <TableHead v-for="col in columnsDetail" :key="col.key">{{ col.title }}</TableHead>
                      <TableHead>Op</TableHead>
                   </TableRow>
                </TableHeader>
                <draggable
                   v-model="listDetail"
                   tag="tbody"
                   item-key="id"
                   @end="onDragEnd"
                   handle=".drag-handle"
                >
                   <template #item="{ element, index }">
                      <TableRow class="hover:bg-muted/50">
                         <TableCell v-for="col in columnsDetail" :key="col.key" class="drag-handle cursor-move">
                            <template v-if="col.key === 'status'">
                               <span class="px-2 py-0.5 rounded text-xs text-white" :class="statusClass[element.status]">{{ status[element.status] }}</span>
                            </template>
                            <template v-else>{{ element[col.key] }}</template>
                         </TableCell>
                         <TableCell>
                            <div class="flex space-x-2">
                               <Button variant="ghost" size="icon" class="h-6 w-6" :class="statusButtonClass[element.status]" @click.stop.prevent="disOrEnable(element)">
                                  <i :class="element.status == 1 ? 'fa fa-ban' : 'fa fa-check'"></i>
                               </Button>
                               <Button variant="ghost" size="icon" class="h-6 w-6" @click.stop.prevent="editDetail(element)">
                                  <i class="fa fa-pencil text-blue-600"></i>
                               </Button>
                               <Button variant="ghost" size="icon" class="h-6 w-6" @click.stop.prevent="deleteDetail(element)">
                                  <i class="fa fa-trash text-red-600"></i>
                               </Button>
                            </div>
                         </TableCell>
                      </TableRow>
                   </template>
                </draggable>
             </Table>
          </div>
       </div>
    </div>

    <!-- Main Workflow Dialog -->
    <Dialog :open="editFormVisible" @update:open="val => editFormVisible = val">
      <DialogContent class="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{{ name }}</DialogTitle>
        </DialogHeader>
        <div class="grid gap-4 py-4">
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.name }}</Label>
              <Input v-model="data.name" class="col-span-3" />
           </div>
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.process_code }}</Label>
              <Input v-model="data.process_code" class="col-span-3" />
           </div>
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.isEnable }}</Label>
              <div class="col-span-3">
                 <!-- Switch logic -->
                 <input type="checkbox" :checked="data.status == '1'" @change="e => data.status = e.target.checked ? '1' : '2'" />
              </div>
           </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="editFormVisible = false">{{ c.cancel }}</Button>
          <Button type="submit" @click="submmit" :disabled="submmitLoading">{{ c.confirm }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Detail Dialog -->
    <Dialog :open="visibleDetail" @update:open="val => visibleDetail = val">
      <DialogContent class="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>{{ l.detailField }} {{ dataDetail ? c.edit : c.create }}</DialogTitle>
        </DialogHeader>
        <div class="space-y-4 py-4">
           <div class="flex gap-4">
              <div class="flex-1 space-y-2">
                 <Label class="font-bold">Name</Label>
                 <Input v-model="dataMain.name" :placeholder="l.detailNamePd" />
              </div>
              <div class="flex-1 space-y-2">
                 <Label class="font-bold">Status</Label>
                 <div>
                    <input type="checkbox" :checked="dataMain.status == '1'" @change="e => dataMain.status = e.target.checked ? '1' : '2'" />
                 </div>
              </div>
           </div>

           <div class="space-y-2">
              <Label class="font-bold">Detail Info</Label>
              <div class="flex items-center gap-2">
                 <Input v-model="dataDetail.title" :placeholder="l.detailTitlePd" />
              </div>
           </div>

           <div class="space-y-2 max-h-[300px] overflow-auto border p-2 rounded">
              <div v-for="(item, index) in dataDetail.list" :key="index" class="flex items-center gap-2 mb-2">
                 <Input v-model="item.key" :placeholder="l.detailKeyPd" class="w-1/3" />
                 <Input v-model="item.label" :placeholder="l.detailLabelPd" class="w-1/3" />
                 <div class="flex items-center gap-1 w-[100px]">
                    <input type="checkbox" v-model="item.enter" /> <span class="text-xs">Line Break</span>
                 </div>
                 <Button variant="destructive" size="icon" @click="removeItem(index)">
                    <i class="fa fa-minus"></i>
                 </Button>
                 <Button v-if="index == dataDetail.list.length - 1" size="icon" @click="addItem()">
                    <i class="fa fa-plus"></i>
                 </Button>
              </div>
           </div>

           <div class="flex flex-wrap gap-2">
              <span
                 v-for="item in listField"
                 :key="item"
                 class="px-2 py-1 bg-gray-200 rounded text-xs cursor-pointer hover:bg-gray-300"
                 @click="copyToClipboard(item)"
              >
                 {{ item }}
              </span>
           </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="visibleDetail = false">{{ c.cancel }}</Button>
          <Button type="submit" @click="submmitDetail" :disabled="submmitLoadingDetail">{{ c.confirm }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, watch } from 'vue'
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
const { l, c } = useLocalI18n('adminWorkflowFields')

const pageLoading = ref(false)
const list = ref([])
const total = ref(0)
const editFormVisible = ref(false)
const submmitLoading = ref(false)
const sortLoading = ref(false)

const detailFlag = ref(false)
const visibleDetail = ref(false)
const submmitLoadingDetail = ref(false)
const indexFlag = ref(false)

const processCode = ref('')
const listDetail = ref([])
const listSortIds = ref([])
const versionProcess = ref([])
const versionProcessSelected = ref('')
const listField = ref([])

const dataMain = ref({})
const dataDetailInit = { title: '', type: 'info', list: [{ key: '', type: '' }] }
const dataDetail = ref(_.cloneDeep(dataDetailInit))

const config = Object.assign({}, _.cloneDeep(defaultConfig), {
  api: api.workflowField,
  apiCreate: api.workflowField + 'addormodify',
  apiParamShow: api.param + 'getparamshow',
})

const query = reactive({
  queryString: { str: '' },
  size: 10,
  page: 1,
})

const queryDetail = reactive({ queryString: {}, size: 99, page: 1 })

const data = ref({})
const initData = { status: '1' }
const name = computed(() => l.value?.title || 'Title')

const status = computed(() => ({ 1: c.value?.enabled, 2: c.value?.disabled }))
const statusClass = { 1: 'bg-green-500', 2: 'bg-red-500' }
const statusButton = computed(() => ({ 1: c.value?.disable, 2: c.value?.enable }))
const statusButtonClass = { 1: 'text-yellow-600', 2: 'text-green-600' }

const columns = computed(() => [
  { title: l.value?.name, key: 'name' },
  { title: l.value?.process_code, key: 'process_code' },
  { title: l.value?.status, key: 'status' },
  { title: c.value?.modify_user, key: 'modify_user' },
  { title: c.value?.modify_time, key: 'modify_time' },
])

const columnsDetail = computed(() => [
  { title: l.value?.detialNmae, key: 'name' },
  { title: l.value?.field_json, key: 'field_json' },
  { title: l.value?.status, key: 'status' },
  { title: c.value?.modify_user, key: 'modify_user' },
  { title: c.value?.modify_time, key: 'modify_time' },
])

const getList = () => {
    pageLoading.value = true
    proxy.$request(config.api + 'getlist', query)
        .then(r => {
            list.value = r.data.list
            total.value = r.datas.total
            pageLoading.value = false
        })
        .catch(() => pageLoading.value = false)
}

const researchMain = () => {
    listDetail.value = []
    query.page = 1
    getList()
}

const createItem = () => {
    data.value = _.cloneDeep(initData)
    editFormVisible.value = true
}

const editItem = (row) => {
    data.value = _.cloneDeep(row)
    data.value.status = String(data.value.status)
    editFormVisible.value = true
}

const deleteItem = (row) => {
    if(window.confirm(c.value?.deleteConfirm)) {
        pageLoading.value = true
        proxy.$request(config.api + 'delete/' + row.id, {}, 'post')
            .then(() => {
                pageLoading.value = false
                proxy.$message.success(c.value?.deleteSuccess)
                getList()
            })
            .catch(() => pageLoading.value = false)
    }
}

const disOrEnable = (row) => {
    if(window.confirm(statusButton.value[row.status] + l.value?.record)) {
        pageLoading.value = true
        proxy.$request(config.api + 'DisOrEnable/' + row.id, {}, 'post')
            .then(() => {
                pageLoading.value = false
                proxy.$message.success(c.value?.success)
                if(row.parent_id) getDetailList()
                else getList()
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
            proxy.$message.success(c.value?.success)
            editFormVisible.value = false
            getList()
        })
        .catch(() => submmitLoading.value = false)
}

const clickDetail = (row) => {
    dataMain.value = {}
    processCode.value = ''
    dataDetail.value = _.cloneDeep(dataDetailInit)
    if(row) {
        queryDetail.queryString.parentId = row.id
        processCode.value = row.process_code
        getListVersion(row.process_code)
    }
    detailFlag.value = true
}

const getListVersion = (id) => {
    proxy.$request(api.param + 'getlistversion', { id: id }).then(r => {
        if(r.data.length != 0) {
            versionProcessSelected.value = r.data[0].OID
        } else {
            versionProcessSelected.value = ''
        }
        versionProcess.value = r.data.map(item => ({ value: item.OID, label: item.VERSION }))
        getDetailList()
    })
}

const changeVersionProcess = () => {
    getDetailList()
}

const getDetailList = () => {
    pageLoading.value = true
    let url = config.api + 'getlist'
    proxy.$request(url, {
        ...queryDetail,
        queryString: JSON.stringify({
            ...queryDetail.queryString,
            oid: versionProcessSelected.value
        })
    }).then(r => {
        pageLoading.value = false
        listDetail.value = r.data.list
        listSortIds.value = listDetail.value.map(v => v.id)
    }).catch(() => pageLoading.value = false)

    proxy.$request(config.apiParamShow, { id: versionProcessSelected.value }, 'get').then(r => {
        listField.value = r.data
    })
}

const openDetail = () => {
    dataMain.value = { status: '1' }
    visibleDetail.value = true
    dataDetail.value = _.cloneDeep(dataDetailInit)
}

const editDetail = (row) => {
    proxy.$request(config.api + 'getbyid', { id: row.id }).then(r => {
        let d = r.data
        if(d) {
            dataMain.value = {
                id: d.id,
                process_code: d.process_code,
                name: d.name,
                sort: d.sort,
                status: String(d.status)
            }
            if(d.field_json) dataDetail.value = JSON.parse(d.field_json)
        }
        visibleDetail.value = true
    })
}

const deleteDetail = (row) => {
    if(window.confirm(c.value?.deleteConfirm)) {
        pageLoading.value = true
        proxy.$request(config.api + 'delete/' + row.id, {}, 'post')
            .then(() => {
                pageLoading.value = false
                proxy.$message.success(c.value?.deleteSuccess)
                getDetailList()
            })
            .catch(() => pageLoading.value = false)
    }
}

const addItem = () => {
    dataDetail.value.list.push({ key: '', label: '' })
}

const removeItem = (i) => {
    dataDetail.value.list.splice(i, 1)
    if(dataDetail.value.list.length == 0) addItem()
}

const copyToClipboard = (text) => {
   navigator.clipboard.writeText(text).then(() => {
      proxy.$message.success('Copy success')
   }, () => {
      proxy.$message.error('Copy failed')
   })
}

const submmitDetail = () => {
    submmitLoadingDetail.value = true
    let url = config.apiCreate
    let obj = {
        field_json: JSON.stringify(dataDetail.value),
        parent_id: queryDetail.queryString.parentId,
        process_code: processCode.value,
        status: dataMain.value.status,
        oid: versionProcessSelected.value,
        version: versionProcess.value.find(x => x.value == versionProcessSelected.value)?.label,
        ...dataMain.value
    }
    proxy.$request(url, obj, 'post')
        .then(() => {
            submmitLoadingDetail.value = false
            proxy.$message.success(c.value?.success)
            visibleDetail.value = false
            getDetailList()
        })
        .catch(() => submmitLoadingDetail.value = false)
}

const onDragEnd = (evt) => {
    indexFlag.value = true
    listSortIds.value = listDetail.value.map(v => v.id)
}

const updateDetailSort = () => {
    sortLoading.value = true
    proxy.$request(config.api + 'UpdateSort', listSortIds.value, 'post')
        .then(() => {
            sortLoading.value = false
            getDetailList()
            indexFlag.value = false
        })
        .catch(() => sortLoading.value = false)
}

onMounted(() => {
    getList()
})
</script>

<style scoped>
</style>
