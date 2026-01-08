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
        <Select v-model="query.status" class="w-[140px]">
           <SelectItem value="">{{ c.all }}</SelectItem>
           <SelectItem value="0">{{ c.enabled }}</SelectItem>
           <SelectItem value="1">{{ c.disabled }}</SelectItem>
        </Select>
        <Button variant="secondary" @click="research">{{ c.queryButton }}</Button>
        <Button variant="outline" @click="exportData" :disabled="exportLoading">
           {{ exportLoading ? 'Exporting...' : c.export }}
        </Button>
      </div>
      <Button @click="addUser">{{ c.create }}</Button>
    </div>

    <div class="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead v-for="col in userObj.columns" :key="col.key">
              {{ col.title }}
            </TableHead>
            <TableHead>Operation</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="(row, index) in list" :key="index">
            <TableCell v-for="col in userObj.columns" :key="col.key">
               <template v-if="col.key == 'in_date' || col.key == 'out_date'">
                  <span>{{ $filters.datetime(row[col.key]) }}</span>
               </template>
               <template v-else-if="col.key == 'enable'">
                  <span class="px-2 py-0.5 rounded text-xs text-white" :class="row[col.key] == '0' ? 'bg-green-500' : 'bg-gray-500'">{{ row[col.key] == '0' ? 'Y' : 'N' }}</span>
               </template>
               <template v-else-if="col.key == 'register'">
                  <span class="px-2 py-0.5 rounded text-xs text-white" :class="row.password ? 'bg-green-500' : 'bg-gray-500'">{{ row.password ? 'Y' : 'N' }}</span>
               </template>
               <template v-else>
                  {{ row[col.key] }}
               </template>
            </TableCell>
            <TableCell>
              <div class="flex space-x-2">
                <Button variant="link" class="text-blue-600 h-auto p-0" @click.prevent="editItem(row, index)">{{ l.editItem }}</Button>
                <Button variant="link" class="text-red-600 h-auto p-0" @click.prevent="deleteItem(row, index)">{{ c.delete }}</Button>
                <Button variant="link" class="text-yellow-600 h-auto p-0" @click.prevent="forceChangePass(row, index)">{{ l.changePwd }}</Button>
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

    <!-- Edit User Dialog -->
    <Dialog :open="editFormVisible" @update:open="val => editFormVisible = val">
      <DialogContent class="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{{ name }}</DialogTitle>
        </DialogHeader>
        <div class="grid grid-cols-2 gap-4 py-4">
           <!-- Manually render fields -->
           <template v-for="field in userObj.fields" :key="field.key">
             <div v-if="field.key !== 'roles'" class="grid grid-cols-4 items-center gap-4 col-span-2 md:col-span-1">
                <Label class="text-right">{{ field.title }}</Label>
                <div class="col-span-3">
                    <Input
                      v-if="!field.name && !field.props?.disabled"
                      v-model="data[field.key]"
                    />
                    <Input
                      v-else-if="!field.name && field.props?.disabled"
                      v-model="data[field.key]"
                      disabled
                    />
                    <!-- Date -->
                    <Input
                       v-else-if="field.name === 'date'"
                       type="date"
                       v-model="data[field.key]"
                    />
                    <!-- Select -->
                    <Select
                       v-else-if="field.name === 'select'"
                       v-model="data[field.key]"
                       :disabled="field.props?.disabled"
                    >
                       <SelectItem v-for="opt in (field.options || [])" :key="opt.value" :value="opt.value">
                          {{ opt.label }}
                       </SelectItem>
                    </Select>
                    <!-- SelectObj (custom logic for work_name) -->
                    <Select
                       v-else-if="field.name === 'selectObj'"
                       v-model="data[field.key]"
                       @update:modelValue="val => {
                          const opt = field.options.find(o => o.value === val);
                          if(opt && field.events?.change) field.events.change(opt)
                       }"
                    >
                       <SelectItem v-for="opt in (field.options || [])" :key="opt.value" :value="opt.value">
                          {{ opt.label }}
                       </SelectItem>
                    </Select>
                    <!-- Switch -->
                    <div v-else-if="field.name === 'switch'" class="flex items-center h-10">
                       <input
                         type="checkbox"
                         :checked="data[field.key] == field.props.activeValue"
                         @change="e => data[field.key] = e.target.checked ? field.props.activeValue : field.props.inactiveValue"
                       />
                    </div>
                    <!-- Button -->
                    <Button
                       v-else-if="field.name === 'button'"
                       @click="field.events?.click"
                    >
                       {{ field.value }}
                    </Button>
                </div>
             </div>
           </template>

           <!-- Roles Multiple Select - Handling separately as it's complex -->
           <!-- Simplified as simple multi-select or tags input -->
        </div>
        <!-- Roles field special handling -->
        <div class="grid grid-cols-4 items-center gap-4">
           <Label class="text-right">{{ l.roles }}</Label>
           <div class="col-span-3">
              <!-- Using native multiple select for simplicity or just a text input for now as Select component doesn't support multiple yet -->
               <select multiple class="border rounded p-2 w-full" v-model="data.roles">
                  <option v-for="opt in roleOptions" :key="opt.role_id" :value="opt.role_id">
                     {{ opt.role_name }}
                  </option>
               </select>
           </div>
        </div>

        <DialogFooter>
          <Button variant="outline" @click="editFormVisible = false">{{ c.cancel }}</Button>
          <Button type="submit" @click="submmit" :disabled="submmitLoading">{{ c.confirm }}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- Drop Dept Dialog -->
    <Dialog :open="dropDeptVisible" @update:open="val => dropDeptVisible = val">
      <DialogContent class="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{{ l.dropDept }}</DialogTitle>
        </DialogHeader>
        <div class="space-y-4">
           <Input
             v-model="deptObj.query"
             :placeholder="c.queryPlaceholder"
             @keyup.enter="researchDept"
           />
           <div class="rounded-md border max-h-[400px] overflow-auto">
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead v-for="col in deptObj.columns" :key="col.key">{{ col.title }}</TableHead>
                   <TableHead>Op</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 <TableRow v-for="(row, index) in deptObj.list" :key="index">
                   <TableCell v-for="col in deptObj.columns" :key="col.key">{{ row[col.key] }}</TableCell>
                   <TableCell>
                      <Button variant="link" class="text-blue-600 h-auto p-0" @click.prevent="sendDeptItem(row, index)">{{ c.confirm }}</Button>
                   </TableCell>
                 </TableRow>
               </TableBody>
             </Table>
           </div>
           <Pagination
              v-model="deptObj.curPage"
              :total="deptObj.total"
              :page-size="deptObj.pageSize"
              @update:modelValue="researchDept"
           />
        </div>
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

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('adminUser')

const pageLoading = ref(false)
const list = ref([])
const total = ref(0)
const editFormVisible = ref(false)
const submmitLoading = ref(false)
const exportLoading = ref(false)
const dropDeptVisible = ref(false)

const roleOptions = ref([])

const config = Object.assign({}, _.cloneDeep(defaultConfig), {
	api: api.user,
	apipubliccode: api.publiccode,
	apiSydept: api.Sydept,
	apiList: api.user + 'getlist',
	apiSingle: api.user + 'getWithRoles',
})

const query = reactive({
  status: '0',
  size: 10,
  page: 1,
  queryString: ''
})

const initDataData = {
    department_t: null,
    dept_no: null,
    org_id: null,
    password: '7C4A8D09CA3762AF61E59520943DC26494F8941B',
    enable: '0',
    roles: ['10001']
}

const data = ref({ ...initDataData })

const name = computed(() => l.value?.title || 'Title')

const deptObj = reactive({
    query: '',
    list: [],
    pageSize: 10,
    total: 0,
    curPage: 1,
    columns: computed(() => [
        { title: l.value?.org_id, key: 'org_id', width: 100 },
        { title: l.value?.dept_no, key: 'dept_no', width: 100 },
        { title: l.value?.dept_name, key: 'dept_name_zh', width: 100 },
        { title: l.value?.up_dept_no, key: 'up_dept_no', width: 100 },
        { title: l.value?.up_deptname, key: 'up_deptname' }
    ])
})

const userObj = reactive({
    columns: computed(() => [
        { title: l.value?.userid, key: 'userid', width: 100 },
        { title: l.value?.username, key: 'username', width: 100 },
        { title: l.value?.department, key: 'department_t' },
        { title: l.value?.work_name, key: 'work_name' },
        { title: l.value?.instel, key: 'instel', width: 120 },
        { title: l.value?.register, key: 'register', width: 100 },
        { title: l.value?.in_date, key: 'in_date', width: 100 },
        { title: l.value?.out_date, key: 'out_date', width: 100 },
        { title: l.value?.last_date, key: 'last_date', width: 150 },
        { title: l.value?.enable, key: 'enable', width: 100 }
    ]),
    fields: computed(() => [
        { title: l.value?.userid, key: 'userid', span: 8 },
        { title: l.value?.username, key: 'username', span: 8 },
        { title: l.value?.instel, key: 'instel', span: 8 },
        { title: l.value?.name_t, key: 'name_t', span: 8 },
        { title: l.value?.name_s, key: 'name_s', span: 8 },
        { title: l.value?.name_e, key: 'name_e', span: 8 },
        { title: l.value?.in_date, key: 'in_date', name: 'date', span: 8 },
        { title: l.value?.out_date, key: 'out_date', name: 'date', span: 8 },
        { title: l.value?.birthday, key: 'birthday', name: 'date', span: 8 },
        { title: l.value?.icno, key: 'ic_no', span: 8 },
        {
            title: l.value?.work_name,
            key: 'work_name',
            span: 8,
            name: 'selectObj',
            options: [], // populated later
            events: { change: getWork_no }
        },
        {
            title: l.value?.sex,
            key: 'sex',
            span: 8,
            name: 'select',
            options: [{ value: 'F', label: '女' }, { value: 'M', label: '男' }]
        },
        { title: l.value?.org_id, key: 'org_id', span: 8, props: { disabled: true } },
        { title: l.value?.dept_no, key: 'dept_no', span: 8, props: { disabled: true } },
        { title: l.value?.dept_name, key: 'department_t', span: 8, props: { disabled: true } },
        {
            title: '',
            name: 'button',
            span: 8,
            value: l.value?.dropDept,
            events: { click: openDept }
        },
        {
            title: l.value?.enable,
            key: 'enable',
            name: 'switch',
            span: 8,
            props: { activeValue: '0', inactiveValue: '1' }
        },
        // Roles handled separately
    ])
})

const getList = () => {
    pageLoading.value = true
    proxy.$request(config.apiList, query)
        .then(r => {
            list.value = r.data.list
            total.value = r.datas.total
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

const addUser = () => {
    data.value = _.cloneDeep(initDataData)
    editFormVisible.value = true
}

const editItem = (row) => {
    pageLoading.value = true
    proxy.$request(config.apiSingle, { id: row.id })
        .then(r => {
            pageLoading.value = false
            data.value = r.data[0]
            editFormVisible.value = true
        })
        .catch(() => pageLoading.value = false)
}

const deleteItem = (row) => {
    if(window.confirm(c.value?.deleteConfirm)) {
        pageLoading.value = true
        proxy.$request(config.api + 'delete', { id: row.id }, 'post') // Check api endpoint
        .then(() => {
            pageLoading.value = false
            proxy.$message.success(c.value?.deleteSuccess)
            getList()
        })
        .catch(() => pageLoading.value = false)
    }
}

const forceChangePass = (row) => {
    const pwd = window.prompt(l.value?.inputPwd)
    if (pwd) {
        pageLoading.value = true
        proxy.$request(config.api + 'forceChangePassword', { user: row.id, password: pwd }, 'post')
            .then(() => {
                pageLoading.value = false
                proxy.$message.success(c.value?.success)
            })
            .catch(() => pageLoading.value = false)
    }
}

const getWork_no = (opt) => {
    data.value.work_name = opt.value
    data.value.work_no = opt.workNo
}

const openDept = () => {
    dropDeptVisible.value = true
    researchDept()
}

const researchDept = () => {
    proxy.$request(config.apiSydept + 'getList', {
        queryString: { dept_name: deptObj.query },
        pageSize: deptObj.pageSize,
        curPage: deptObj.curPage
    }).then(r => {
        deptObj.list = r.data.list
        deptObj.total = r.data.total
    })
}

const sendDeptItem = (row) => {
    data.value.department_t = row.dept_name_zh
    data.value.dept_no = row.dept_no
    data.value.org_id = row.org_id
    dropDeptVisible.value = false
}

const getPost = () => {
    proxy.$request(config.apipubliccode + 'getListdetailed', {
        queryString: {},
        ruleno: '8101',
        pageSize: 100
    }).then(r => {
        let l = []
        r.data.list.forEach(j => {
            l.push({ value: j.name_zh, label: j.name_zh, workNo: j.code_no })
        })
        // Find work_name field and update options
        const f = userObj.fields.find(x => x.key === 'work_name')
        if(f) f.options = l
    })
}

const getRoles = () => {
    proxy.$request(proxy.$api.role + 'getlist', { size: 999 }).then(r => {
        roleOptions.value = r.data.list
        // const f = userObj.fields.find(x => x.key === 'roles')
        // if(f) f.props.options = r.data.list.map(r => ({value: r.role_id, label: r.role_name}))
    })
}

const submmit = () => {
    submmitLoading.value = true
    const d = _.cloneDeep(data.value)
    if(Array.isArray(d.roles)) d.roles = d.roles.join(',')

    // Determine create or update
    let url = config.api + (d.id ? 'update' : 'add') // original zFormDialog logic
    // Actually config.api is '.../user'
    // Usually 'add' or 'update' is appended.
    // Let's assume standard behavior.

    proxy.$request(url, d, 'post')
        .then(() => {
            submmitLoading.value = false
            editFormVisible.value = false
            proxy.$message.success(c.value?.success)
            getList()
        })
        .catch(() => submmitLoading.value = false)
}

const exportData = () => {}

onMounted(() => {
    getRoles()
    getList()
    getPost()
})
</script>

<style scoped>
</style>
