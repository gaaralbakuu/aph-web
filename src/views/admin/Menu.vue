<template>
  <div class="p-6 space-y-6" v-loading="pageLoading">
    <div class="flex justify-between items-center min-h-[40px]">
       <div class="flex items-center space-x-2">
          <Button v-if="treeData.length == 0" @click="createNode(null)">{{ c.addItem }}</Button>
          <span v-if="treeData.length > 0" class="text-xs text-muted-foreground">{{ c.indexDescription }}</span>
       </div>
       <Button
         v-if="indexChangeFlag"
         @click="saveIndex"
         :disabled="sortLoading"
         variant="secondary"
       >
          {{ c.saveIndex }}
       </Button>
    </div>

    <div class="rounded-md border p-4">
       <MenuTreeItem
         v-if="treeData.length > 0"
         :model-value="treeData"
         @update:modelValue="val => treeData = val"
         @edit="editNode"
         @add="createNode"
         @addChild="createChildNode"
         @remove="removeNode"
         @change="handleTreeChange"
         @toggle="disableOrEnable"
       />
       <div v-else class="text-center py-8 text-muted-foreground">No menu items</div>
    </div>

    <Dialog :open="editNodeFormVisible" @update:open="val => editNodeFormVisible = val">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{{ l.title }}</DialogTitle>
        </DialogHeader>
        <div class="grid gap-4 py-4">
           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.resourcetType }}</Label>
              <Select v-model="nodeData.resource_type" class="col-span-3">
                 <SelectItem v-for="(item, index) in options" :key="index" :value="item.value">
                    {{ item.label }}
                 </SelectItem>
              </Select>
           </div>

           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.resourcePath }}</Label>
              <Input v-model="nodeData.resource_path" class="col-span-3" />
           </div>

           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.imageUrl }}</Label>
              <Input v-model="nodeData.image_url" class="col-span-3" />
           </div>

           <div class="grid grid-cols-4 items-center gap-4">
              <Label class="text-right">{{ l.isshow }}</Label>
              <Select v-model="nodeData.is_show" class="col-span-3">
                 <SelectItem value="Y">Y</SelectItem>
                 <SelectItem value="N">N</SelectItem>
              </Select>
           </div>

           <div class="grid grid-cols-4 items-start gap-4">
              <Label class="text-right pt-2">{{ l.menuName }}</Label>
              <div class="col-span-3 space-y-2">
                 <div v-for="(v, i) in labelData" :key="i" class="flex gap-2">
                    <Select v-model="v.key" :placeholder="c.selectLang" class="w-1/3">
                       <SelectItem v-for="(item, index) in langOptions" :key="index" :value="item.param_value">
                          {{ item.param_condition1 }}
                       </SelectItem>
                    </Select>
                    <Input v-model="v.label" class="flex-1" :placeholder="l.menuNamePlaceholder" />
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
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectItem } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter
} from '@/components/ui/dialog'
import { useLocalI18n } from '@/composables/useLocalI18n'
import { dateTools, expendsTree, generateTree } from '@/utils'
import MenuTreeItem from './components/MenuTreeItem.vue'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('adminMenu')

const pageLoading = ref(false)
const submmitLoading = ref(false)
const sortLoading = ref(false)
const editNodeFormVisible = ref(false)
const indexChangeFlag = ref(false)

const treeData = ref([])
const nodeData = ref({})
const labelData = ref([{ key: '', label: '' }])
const langOptions = ref([])

const options = computed(() => [
  { label: l.value?.directory, value: 'MENU' },
  { label: l.value?.web, value: 'WEB' },
  { label: l.value?.app, value: 'APP' },
])

const apiPath = proxy.$api.menu

const getList = () => {
  pageLoading.value = true
  proxy.$request(apiPath + 'getlist', { size: -1 })
    .then(r => {
      treeData.value = generateTree(r.data, 'menu_id', 'parent_id', '0')
      pageLoading.value = false
    })
    .catch(() => pageLoading.value = false)
}

const editNode = (data) => {
  nodeData.value = Object.assign({}, data)
  labelData.value = JSON.parse(nodeData.value.menu_name || '[]')
  if (!labelData.value.length) labelData.value = [{ key: '', label: '' }]
  editNodeFormVisible.value = true
}

const createNode = (data) => {
  if (data) {
    nodeData.value = { parent_id: data.parent_id }
  } else {
    nodeData.value = { parent_id: 0 }
  }
  labelData.value = [{ key: '', label: '' }]
  editNodeFormVisible.value = true
}

const createChildNode = (data) => {
  if (data.resource_type != 'MENU') return
  nodeData.value = { parent_id: data.menu_id }
  labelData.value = [{ key: '', label: '' }]
  editNodeFormVisible.value = true
}

const submmitNode = () => {
  const data = Object.assign({}, nodeData.value)
  if (data.children && data.children.length > 0 && data.resource_type != 'MENU') {
    proxy.$message.error(l.value?.isExistChildren)
    return
  }
  delete data.children
  if (!data.menu_id) {
    data.menu_id = dateTools.now_time().replace(/[- :]/g, '') + '001'
  }
  submmitLoading.value = true
  delete data.menu_name

  proxy.$request(apiPath + 'save', { menu_name: JSON.stringify(labelData.value), ...data }, 'post')
    .then(() => {
      submmitLoading.value = false
      proxy.$message.success(c.value?.success)
      editNodeFormVisible.value = false
      getList()
    })
    .catch(() => submmitLoading.value = false)
}

const disableOrEnable = (data) => {
  const post = { ...data }
  delete post.children
  post.enabled = post.enabled == 1 ? 0 : 1
  pageLoading.value = true
  proxy.$request(apiPath + 'save', post, 'post')
    .then(() => {
      pageLoading.value = false
      proxy.$message.success(c.value?.success)
      data.enabled = post.enabled
    })
    .catch(() => pageLoading.value = false)
}

const removeNode = (data) => {
  if (window.confirm(c.value?.deleteConfirm)) {
    pageLoading.value = true
    proxy.$request(apiPath + 'delete/' + data.menu_id, {}, 'post')
      .then(() => {
        pageLoading.value = false
        proxy.$message.success(c.value?.success)
        getList()
      })
      .catch(() => pageLoading.value = false)
  }
}

const saveIndex = () => {
  var tmp = expendsTree(treeData.value)
  var data = tmp.map((i, index) => ({
    id: i.id || i.menu_id,
    menu_seq: index,
    parent_id: i.parent_id
  }))

  sortLoading.value = true
  proxy.$request(apiPath + 'sort', data, 'post')
    .then(() => {
      sortLoading.value = false
      proxy.$message.success(c.value?.success)
      indexChangeFlag.value = false
      getList()
    })
    .catch(() => sortLoading.value = false)
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

onMounted(() => {
  getLanguageList()
  getList()
})
</script>

<style scoped>
</style>
