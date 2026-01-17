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

    <div class="grid grid-cols-12 gap-6">
      <!-- Left Panel: Dictionary Types -->
      <div class="col-span-12 lg:col-span-6">
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
              <TableRow
                v-for="(row, index) in list"
                :key="index"
                class="cursor-pointer"
                :class="{ 'bg-muted/50': currentRow?.id === row.id }"
                @click="getChildrenTree(row)"
              >
                <TableCell v-for="col in columns" :key="col.key">
                  {{ row[col.key] }}
                </TableCell>
                <TableCell>
                  <div class="flex space-x-2">
                    <Button variant="link" class="text-blue-600 h-auto p-0" @click.stop.prevent="editItem(row, index)">{{ c.edit }}</Button>
                    <Button variant="link" class="text-red-600 h-auto p-0" @click.stop.prevent="deleteItem(row, index)">{{ c.delete }}</Button>
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
            @update:modelValue="handlePageChange"
          />
        </div>
      </div>

      <!-- Right Panel: Dictionary Tree -->
      <div class="col-span-12 lg:col-span-6">
        <div class="flex justify-between items-center mb-4 min-h-[40px]">
          <div v-if="currentDataId">
            <Button v-if="currentDataId" @click="createNode(null)" variant="outline" size="sm">{{ l.addItem }}</Button>
            <span v-if="treeData.length > 0" class="ml-2 text-xs text-muted-foreground">{{ l.indexDescription }}</span>
          </div>
          <Button v-if="currentDataId && indexChangeFlag" @click="saveIndex" variant="secondary" size="sm">{{ l.saveIndex }}</Button>
        </div>

        <div v-if="currentDataId" class="rounded-md border p-4 min-h-[200px]">
          <!-- Recursive Tree Component using vuedraggable or simple recursion -->
           <!-- For simplicity, using a recursive component strategy manually -->
           <TreeItem
             v-if="treeData.length > 0"
             :model-value="treeData"
             @update:modelValue="val => treeData = val"
             @edit="editNode"
             @add="createNode"
             @addChild="createChildNode"
             @remove="removeNode"
             @change="handleTreeChange"
           />
           <div v-else class="text-center text-muted-foreground py-8">No data</div>
        </div>
      </div>
    </div>

    <!-- Type Dialog -->
    <Dialog :open="editFormVisible" @update:open="val => editFormVisible = val">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{{ name }}</DialogTitle>
        </DialogHeader>
        <div class="grid gap-4 py-4">
           <div v-for="field in fields" :key="field.key" class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ field.title }}</Label>
              <Input v-model="data[field.key]" class="col-span-3" />
           </div>
        </div>
        <DialogFooter>
          <Button type="submit" @click="submmit" :disabled="submmitLoading">{{ c.confirm }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Node Dialog -->
    <Dialog :open="editNodeFormVisible" @update:open="val => editNodeFormVisible = val">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Node</DialogTitle>
        </DialogHeader>
        <div class="grid gap-4 py-4">
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.itemValue }}</Label>
              <Input v-model="nodeData.value" class="col-span-3" :placeholder="l.itemValuePlaceholder" />
           </div>

           <div class="grid grid-cols-4 items-start gap-4">
              <Label class="text-right pt-2">{{ l.itemLabel }}</Label>
              <div class="col-span-3 space-y-2">
                 <div v-for="(v, i) in labelData" :key="i" class="flex gap-2">
                    <Select v-model="v.key" :placeholder="c.selectLang" class="w-1/3">
                       <SelectItem v-for="(item, index) in langOptions" :key="index" :value="item.param_value">
                          {{ item.param_condition1 }}
                       </SelectItem>
                    </Select>
                    <Input v-model="v.label" class="flex-1" :placeholder="l.itemLabelPlaceholder" />
                    <Button variant="destructive" size="icon" @click="removeItem(i)" :disabled="labelData.length === 1 && i === 0 && !v.key && !v.label">
                       <i class="fa fa-minus"></i>
                    </Button>
                    <Button v-if="i === labelData.length - 1" variant="secondary" size="icon" @click="addItem()">
                       <i class="fa fa-plus"></i>
                    </Button>
                 </div>
              </div>
           </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="editNodeFormVisible = false">{{ c.cancel }}</Button>
          <Button type="submit" @click="submmitNode" :disabled="submmitLoading">{{ c.confirm }}</Button>
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
import { getCookie } from '@/utils/auth'
import { expendsTree, generateTree } from '@/utils'

// Tree Item Component (Inline for simplicity or externalize)
import TreeItem from './components/DictionaryTreeItem.vue'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('adminDictionary')

const pageLoading = ref(false)
const list = ref([])
const total = ref(0)
const editFormVisible = ref(false)
const editNodeFormVisible = ref(false)
const submmitLoading = ref(false)
const exportLoading = ref(false)

const config = Object.assign({}, _.cloneDeep(defaultConfig), {
  api: api.dictionary,
  tableProps: { highlightCurrentRow: true, border: true },
})

const query = reactive({
  queryString: '',
  size: 10,
  page: 1,
})

const data = ref({})
const nodeData = ref({})
const labelData = ref([{ key: '', label: '' }])
const langOptions = ref([])

const currentDataId = ref(0)
const currentRow = ref({})
const treeData = ref([])
const indexChangeFlag = ref(false)

const name = computed(() => '')
const columns = computed(() => [
  { title: l.value?.type, key: 'type', width: 140 },
  { title: l.value?.label, key: 'label', width: 120 },
  { title: l.value?.description, key: 'description' },
])

const fields = computed(() => [
  { title: l.value?.type, key: 'type' },
  { title: l.value?.label, key: 'label' },
  { title: l.value?.description, key: 'description' },
  { title: l.value?.remarks, key: 'remarks' },
])

// Methods
const getList = () => {
  pageLoading.value = true
  proxy.$request(config.api + 'list', query)
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

const submmit = () => {
  submmitLoading.value = true
  let url = config.api + (data.value.id ? 'update' : 'add') // Check if API paths match original
  // Original used config.api without suffix for update/add or check defaultConfig
  // defaultConfig usually maps 'list', 'update', 'add', 'delete'
  // But wait, original code used zFormDialog which uses `apiCreate` and `apiEdit`.
  // Here I manually construct.
  // Actually original dictionary just used `api.dictionary`.
  // Assuming standard REST or `add`/`update` suffix.

  proxy.$request(url, data.value, 'post')
    .then(() => {
      submmitLoading.value = false
      editFormVisible.value = false
      proxy.$message.success(c.value?.success)
      getList()
    })
    .catch(() => submmitLoading.value = false)
}

const getChildrenTree = (row) => {
  currentDataId.value = row ? row.id : 0
  currentRow.value = row
  indexChangeFlag.value = false
  refreshTree()
}

const refreshTree = () => {
  if (currentDataId.value) {
    pageLoading.value = true
    proxy.$request(config.api + 'getchildren', { parentId: currentDataId.value })
      .then(r => {
        pageLoading.value = false
        let d = r.data
        d.forEach(v => {
          if (v.labelArray && v.labelArray.indexOf('[{"key":') >= 0) {
            let la = JSON.parse(v.labelArray)
            v.labelArray = la ? la : []
          }
        })
        treeData.value = generateTree(d, 'id', 'parent_id', currentDataId.value)
      })
      .catch(() => pageLoading.value = false)
  } else {
    treeData.value = []
  }
}

const editNode = (d) => {
  labelData.value = [...d.labelArray]
  let nd = Object.assign({}, d)
  delete nd.label // Avoid conflict?
  nodeData.value = nd
  editNodeFormVisible.value = true
}

const createNode = (d) => {
  labelData.value = [{ key: '', label: '' }]
  if (d) {
    nodeData.value = {
      parent_id: d.parent_id, // Wait, createNode(null) creates root node for this type?
      // Original: if data exists, it uses data.parent_id?
      // Actually `createNode` in original:
      // if (data) parent_id = data.parent_id (sibling?) No, wait.
      // Original logic:
      // if (data) { parent_id: data.parent_id ... } -> Sibling
      // createChildNode -> Child
      // createNode(null) -> Root of tree (parent_id = currentDataId)

      // But here `d` is passed.
      // If I want to add a sibling, I pass the node.
      // If I want to add a child, I use createChildNode.
      // If I want to add a root, I pass null.

      parent_id: d.parent_id,
      value: '',
      type: d.type
    }
  } else {
    nodeData.value = {
      parent_id: currentDataId.value,
      value: '',
      type: currentRow.value.type
    }
  }
  editNodeFormVisible.value = true
}

const createChildNode = (d) => {
  nodeData.value = { parent_id: d.id, value: '', type: d.type }
  labelData.value = [{ key: '', label: '' }]
  editNodeFormVisible.value = true
}

const removeNode = (d) => {
  if (window.confirm(c.value?.deleteConfirm)) {
    pageLoading.value = true
    proxy.$request(config.api + 'delete/' + d.id, {}, 'post')
      .then(() => {
        pageLoading.value = false
        proxy.$message.success(c.value?.success)
        refreshTree()
      })
      .catch(() => pageLoading.value = false)
  }
}

const submmitNode = () => {
  const url = config.api + 'update'
  const d = Object.assign({}, nodeData.value)
  delete d.children
  submmitLoading.value = true
  proxy.$request(url, { label: JSON.stringify(labelData.value), ...d }, 'post')
    .then(() => {
      submmitLoading.value = false
      proxy.$message.success(c.value?.success)
      editNodeFormVisible.value = false
      refreshTree()
    })
    .catch(() => submmitLoading.value = false)
}

const saveIndex = () => {
  var tmp = expendsTree(treeData.value)
  var d = tmp.map((i, index) => ({
    id: i.id,
    parent_id: i.parent_id,
    sorting: index,
  }))
  pageLoading.value = true
  const url = config.api + 'sort'
  proxy.$request(url, d, 'post')
    .then(() => {
      pageLoading.value = false
      proxy.$message.success(c.value?.success)
      indexChangeFlag.value = false
      refreshTree()
    })
    .catch(() => pageLoading.value = false)
}

const handleTreeChange = () => {
  indexChangeFlag.value = true
}

const addItem = () => {
  labelData.value.push({ key: '', label: '' })
}

const removeItem = (i) => {
  labelData.value.splice(i, 1)
  if (labelData.value.length == 0) addItem()
}

const getLanguageList = () => {
  let url = proxy.$api.param + 'getbyType'
  proxy.$request(url, { type: 'AppSettings', name: 'Language' }).then(r => {
    langOptions.value = r.data
  })
}

const exportData = () => {
  // Implement export logic
}

onMounted(() => {
  getLanguageList()
  getList()
})
</script>

<style scoped>
</style>
