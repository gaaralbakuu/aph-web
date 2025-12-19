<template>
  <div ref="lesssonCatalogue-container" class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">

    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.catalogueManagement || 'Catalogue Management' }}</h1>
    </div>

    <!-- Main Content Split View -->
    <div class="flex-1 overflow-hidden flex">

       <!-- Left: Organization Tree -->
       <div class="w-[300px] flex flex-col border-r border-[#E5E5E5] bg-white">
          <div class="p-4 border-b border-[#E5E5E5] bg-[#F9F9F9]">
             <h2 class="text-sm font-medium text-[#0D0D0D] mb-3">{{ l.college || 'College Organization' }}</h2>
             <div class="flex gap-2">
                <input v-model="filterOrgText" class="flex-1 px-3 py-1.5 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]" :placeholder="l.keyword" />
                <button class="px-3 py-1.5 bg-white border border-[#CCCCCC] rounded text-sm hover:bg-[#F2F2F2] transition-colors" @click="getCollegeList">
                   <i class="el-icon-refresh"></i>
                </button>
             </div>
          </div>
          <div class="flex-1 overflow-y-auto p-2">
             <el-tree class="filter-tree" ref="orgTree" node-key="id" :accordion="true" :default-expand-all="true"
                :data="collegeList" :filter-node-method="filterOrg" :expand-on-click-node="false">
                <template #default="{ node, data }">
                  <div class="flex-1 flex items-center py-1 cursor-pointer hover:bg-[#F2F8FF] rounded px-2 transition-colors"
                       :class="catalogObj.query.college_id === data.id ? 'bg-[#E5F6FD] text-[#065FD4] font-medium' : 'text-[#0D0D0D]'"
                       @click="clickCollege(data.id)">
                    <span class="truncate">{{ data.name_label }}</span>
                  </div>
                </template>
             </el-tree>
          </div>
       </div>

       <!-- Right: Catalogue Tree -->
       <div class="flex-1 flex flex-col bg-white">
          <div v-if="!catalogObj.query.college_id" class="flex flex-col items-center justify-center h-full text-[#606060]">
             <i class="el-icon-office-building text-4xl mb-2"></i>
             <p>{{ l.plsSelectCollegeToManage }}</p>
          </div>
          <div v-else class="flex flex-col h-full">
             <!-- Toolbar -->
             <div class="p-4 border-b border-[#E5E5E5] bg-white flex items-center justify-between">
                <div class="flex items-center gap-4">
                   <div class="relative group w-32">
                      <select v-model="catalogObj.query.is_valid" @change="getCatalogList" class="w-full px-3 py-1.5 bg-white border border-[#CCCCCC] rounded text-sm text-[#0D0D0D] hover:border-[#606060] outline-none focus:border-[#065FD4]">
                         <option value="">{{ c.all }}</option>
                         <option value="Y">{{ c.enable }}</option>
                         <option value="N">{{ c.disable }}</option>
                      </select>
                   </div>
                   <input v-model="filterCatalogText" class="w-64 px-3 py-1.5 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]" :placeholder="l.keyword" />
                   <button class="px-3 py-1.5 bg-white border border-[#CCCCCC] rounded text-sm hover:bg-[#F2F2F2] transition-colors" @click="getCatalogList">
                      <i class="el-icon-refresh"></i>
                   </button>
                </div>
                <button class="flex items-center gap-2 px-4 py-2 bg-[#065FD4] text-white! font-medium text-sm uppercase rounded-sm hover:bg-[#0551B4] transition-colors shadow-sm" @click="addCatalog">
                   <i class="el-icon-plus"></i>
                   <span>{{ l.addCatalog }}</span>
                </button>
             </div>

             <!-- Tree Content -->
             <div class="flex-1 overflow-y-auto p-4 bg-[#F9F9F9]">
                <el-tree ref="catalogTree" node-key="id" :accordion="true" :default-expand-all="true" :data="catalogObj.data"
                   :filter-node-method="filterCatalog" :empty-text="l.emptyCatalogue">
                   <template #default="{ node, data }">
                      <div class="flex-1 flex items-center justify-between py-2 px-3 bg-white border border-[#E5E5E5] mb-2 rounded shadow-sm group hover:border-[#065FD4] transition-colors">
                         <div class="flex items-center gap-2">
                            <span class="font-medium text-[#0D0D0D]">{{ data.name_label }}</span>
                            <span v-if="data.is_valid == 'N'" class="bg-[#F0F0F0] text-[#606060] text-[10px] px-1 rounded">{{ c.disable }}</span>
                         </div>
                         <div class="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button class="text-[#065FD4] text-xs hover:underline uppercase font-medium" @click.stop="addCatalog(data)">{{ l.addChildCatalog }}</button>
                            <button class="text-[#606060] text-xs hover:underline uppercase font-medium" @click.stop="editCatalog(data)">{{ c.edit }}</button>
                            <button class="text-[#065FD4] text-xs hover:underline uppercase font-medium" @click.stop="getCourseListById(data.id)">{{ l.manage }}</button>
                            <button v-if="data.is_valid=='N'" class="text-[#069C56] text-xs hover:underline uppercase font-medium" @click.stop="modifyCatalogStatus(data)">{{ c.enable }}</button>
                            <button v-else class="text-[#CC0000] text-xs hover:underline uppercase font-medium" @click.stop="modifyCatalogStatus(data)">{{ c.disable }}</button>
                         </div>
                      </div>
                   </template>
                </el-tree>
             </div>
          </div>
       </div>

    </div>

    <!-- Modals & Drawers -->

    <!-- Add/Edit Catalog Drawer -->
    <a-drawer :visible="showObj.catalog_show" :width="500" @close="showObj.catalog_show = false" :body-style="{ padding: 0 }">
       <div class="flex flex-col h-full font-roboto bg-white">
          <div class="px-6 py-4 border-b border-[#E5E5E5] text-lg font-medium text-[#0D0D0D]">
             {{ catalogObj.form.id ? l.editCatalogue : l.addCatalogue }}
          </div>
          <div class="flex-1 overflow-y-auto p-6 space-y-6">
             <div class="group">
                <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.belongCollege }} <span class="text-red-500">*</span></label>
                <select v-model="catalogObj.form.college_id" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]" @change="collegeChange">
                   <option v-for="i in collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</option>
                </select>
             </div>

             <div class="group" v-if="catalogObj.form.college_id">
                <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.parentCatalogue }}</label>
                <a-cascader v-model:value="catalogObj.form.pid" :options="catalogObj.list" allow-clear
                   :placeholder="l.emptyIsRootCatalogue" class="w-full" :field-names="catalogObj.cascaderProps">
                </a-cascader>
             </div>

             <div class="grid grid-cols-2 gap-4">
                <div class="group">
                   <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.name_zh }} <span class="text-red-500">*</span></label>
                   <input v-model="catalogObj.form.name_zh" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]" />
                </div>
                <div class="group">
                   <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.name_tw }}</label>
                   <input v-model="catalogObj.form.name_tw" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]" />
                </div>
                <div class="group">
                   <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.name_en }}</label>
                   <input v-model="catalogObj.form.name_en" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]" />
                </div>
                <div class="group">
                   <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.name_vi }}</label>
                   <input v-model="catalogObj.form.name_vi" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]" />
                </div>
             </div>
          </div>
          <div class="p-4 border-t border-[#E5E5E5] bg-white flex justify-end gap-2">
             <button class="px-4 py-2 text-[#606060] font-medium text-sm hover:bg-[#F2F2F2] rounded-sm transition-colors" @click="showObj.catalog_show = false">{{ l.giveup }}</button>
             <button class="px-6 py-2 bg-[#065FD4] text-white! font-medium text-sm uppercase rounded-sm shadow-sm hover:bg-[#0551B4] transition-colors" @click="submitCatalog">{{ l.submit }}</button>
          </div>
       </div>
    </a-drawer>

    <!-- Course Management Drawer -->
    <a-drawer :visible="showObj.course_show" :width="800" @close="showObj.course_show = false" :body-style="{ padding: 0 }">
       <div class="flex flex-col h-full font-roboto bg-white">
          <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white">
             <h3 class="text-lg font-medium text-[#0D0D0D]">{{ l.courseManage }}</h3>
             <button class="px-4 py-2 bg-[#065FD4] text-white! font-medium text-sm uppercase rounded-sm shadow-sm hover:bg-[#0551B4] transition-colors" @click="beforeOpenCourseDialog">
                {{ l.addCourse }}
             </button>
          </div>

          <div class="flex-1 overflow-y-auto p-0">
             <a-table :dataSource="courseObj.list" row-key="id" :pagination="false">
                <a-table-column :title="l.cover">
                   <template #default="{ record }">
                      <img v-if="record.thumbnail_path" :src="$api.videoServer + '/' + record.thumbnail_path" class="w-20 h-12 object-cover bg-gray-200" />
                   </template>
                </a-table-column>
                <a-table-column :title="l.title" dataIndex="name_zh"></a-table-column>
                <a-table-column :title="l.status" dataIndex="is_valid"></a-table-column>
                <a-table-column :title="c.operation">
                   <template #default="{ record }">
                      <button class="text-[#CC0000] text-xs hover:underline uppercase" @click="toggleCourseStatus(record)">{{ l.remove }}</button>
                   </template>
                </a-table-column>
             </a-table>
          </div>

          <div class="p-4 border-t border-[#E5E5E5] bg-white flex justify-end">
             <button class="px-4 py-2 bg-[#F2F2F2] text-[#0D0D0D] font-medium text-sm rounded-sm hover:bg-[#E5E5E5] transition-colors" @click="showObj.course_show = false">{{ c.close }}</button>
          </div>
       </div>
    </a-drawer>

    <!-- Add Course Modal -->
    <a-modal v-model:open="showObj.selectCourse" :width="1000" :title="l.addCourseToCatalogue" @ok="bindCourseToCatalog" @cancel="cancelBindCourse">
       <div class="flex flex-col h-[600px] font-roboto">
          <div class="flex h-full gap-4">
             <!-- Left: Source List -->
             <div class="flex-1 flex flex-col border border-[#E5E5E5] rounded">
                <div class="p-2 border-b border-[#E5E5E5] bg-[#F9F9F9] flex gap-2">
                   <input v-model="courseObj.query.name" class="flex-1 px-2 py-1 text-sm border rounded" :placeholder="l.keyword" @keyup.enter="getCourseList" />
                   <button class="px-3 py-1 bg-[#065FD4] text-white! text-xs rounded" @click="getCourseList">{{ l.search }}</button>
                   <button class="px-3 py-1 bg-[#069C56] text-white! text-xs rounded" @click="multipleAdd">{{ l.multipleAdd }}</button>
                </div>
                <div class="flex-1 overflow-auto">
                   <a-table :dataSource="courseObj.courseList" row-key="id" :pagination="false" :rowSelection="{ onChange: handleSelectionChangeToBeAdded }">
                      <a-table-column :title="l.cover" width="80px">
                         <template #default="{ record }">
                            <img v-if="record.thumbnail_path" :src="$api.videoServer + '/' + record.thumbnail_path" class="w-12 h-8 object-cover" />
                         </template>
                      </a-table-column>
                      <a-table-column :title="l.title" dataIndex="name_zh"></a-table-column>
                      <a-table-column width="60px">
                         <template #default="{ record }">
                            <button class="text-[#065FD4] text-xs" @click="addCourse(record)">Add</button>
                         </template>
                      </a-table-column>
                   </a-table>
                </div>
             </div>

             <!-- Right: Selected List -->
             <div class="flex-1 flex flex-col border border-[#E5E5E5] rounded">
                <div class="p-2 border-b border-[#E5E5E5] bg-[#F9F9F9] flex justify-between items-center">
                   <span class="text-sm font-medium">{{ l.toBeAddedList }}</span>
                   <button class="px-3 py-1 bg-[#CC0000] text-white! text-xs rounded" @click="multipleRemove">{{ l.multipleRemove }}</button>
                </div>
                <div class="flex-1 overflow-auto">
                   <a-table :dataSource="courseObj.form" row-key="id" :pagination="false" :rowSelection="{ onChange: handleSelectionChangeToBeRemoved }">
                      <a-table-column :title="l.title" dataIndex="name_zh"></a-table-column>
                      <a-table-column width="60px">
                         <template #default="{ index }">
                            <button class="text-[#CC0000] text-xs" @click="removeCourse(index)">Del</button>
                         </template>
                      </a-table-column>
                   </a-table>
                </div>
             </div>
          </div>
       </div>
    </a-modal>

    <!-- Confirm Dialog Modal -->
    <div v-if="showObj.confirmShow" class="fixed inset-0 z-50 flex items-center justify-center font-roboto">
      <div class="fixed inset-0 bg-black/50" @click="handleConfirmCancel"></div>
      <div class="relative bg-white rounded shadow-xl p-6 max-w-sm w-full mx-4 border border-[#E5E5E5]">
        <h3 class="text-lg font-medium text-[#0D0D0D] mb-4">{{ showObj.confirmData.title }}</h3>
        <p class="text-[#606060] mb-6 text-sm">{{ showObj.confirmData.message }}</p>
        <div class="flex justify-end gap-2">
          <button @click="handleConfirmCancel" class="px-4 py-2 text-[#0D0D0D] font-medium text-sm hover:bg-[#F2F2F2] rounded-sm transition-colors">
            {{ l.giveup || 'Cancel' }}
          </button>
          <button @click="handleConfirmOk" class="px-4 py-2 bg-[#065FD4] text-white! font-medium text-sm rounded-sm hover:bg-[#0551B4] transition-colors shadow-sm">
            {{ l.submit || 'OK' }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { reactive, computed, onMounted, watch, getCurrentInstance, ref } from 'vue'
import { useQuery, useMutation } from '@tanstack/vue-query'
import api from '@/api'
import { useLocalI18n } from '@/composables/useLocalI18n'
import store from '@/store'

const instance = getCurrentInstance()
const route = instance.proxy.$route
const router = instance.proxy.$router
const { $request, $message, $prompt } = instance.proxy
const { l, c } = useLocalI18n('videoAdminCatalogue')

const multipleSelectionObj = reactive({
  toBeAdded: [],
  toBeRemoved: []
})

const showObj = reactive({
  org_show: false,
  catalog_show: false,
  course_show: false,
  selectCourse: false,
  confirmShow: false,
  confirmData: { title: '', message: '', callback: null }
})

const filterOrgText = ref('')
const filterCatalogText = ref('')

const publicCodeObj = reactive({
  collegeList: []
})

const catalogObj = reactive({
  cascaderProps: {
    expandTrigger: 'hover',
    checkStrictly: true,
    emitPath: false,
    value: 'id',
    label: 'name_label',
    children: 'children'
  },
  data: [],
  list: [],
  query: {
    college_id: "",
    is_valid: ''
  },
  form: {
    id: "",
    pid: "",
    college_id: "",
    name_zh: "",
    name_en: "",
    name_tw: "",
    name_vi: "",
    sort: 0
  }
})

const defaultProps = reactive({
  children: 'children',
  label: 'label'
})

const courseObj = reactive({
  currentIndex: '',
  catalog_id: '',
  query: {
    page: 1,
    pageSize: 10,
    college_id: "",
    is_public: "",
    name: "",
    is_his: 0
  },
  form: [],
  total: 0,
  list: [],
  courseList: []
})

// Queries
const { data: collegeListData, refetch: refetchCollege } = useQuery({
  queryKey: ['collegeList'],
  queryFn: () => $request(api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
    resource_path: route.path
  })
})

const collegeList = computed(() => collegeListData.value ? collegeListData.value.data : [])

const { data: catalogListData, refetch: refetchCatalog } = useQuery({
  queryKey: ['catalogList', catalogObj.query],
  queryFn: () => {
    if (catalogObj.query.college_id) {
      return $request(api.baseUrl + '/Video/VideoCourseCatalog/getCatalogList', catalogObj.query)
    }
    return Promise.resolve({ data: [] })
  },
  enabled: computed(() => !!catalogObj.query.college_id)
})

watch(() => catalogListData.value, (newVal) => {
  if (newVal) {
    catalogObj.data = newVal.data
    showObj.catalog_show = false
  }
})

const { data: catalogListByIdData, refetch: refetchCatalogById } = useQuery({
  queryKey: ['catalogListById', catalogObj.form.college_id, catalogObj.query.is_valid],
  queryFn: ({ queryKey }) => {
    return $request(api.baseUrl + '/Video/VideoCourseCatalog/getCatalogList', {
      college_id: catalogObj.form.college_id,
      is_valid: catalogObj.query.is_valid
    })
  },
  enabled: false
})

watch(() => catalogListByIdData.value, (newVal) => {
  if (newVal) {
    catalogObj.list = newVal.data
  }
})

const { data: courseListData, refetch: refetchCourseList } = useQuery({
  queryKey: ['courseList', courseObj.query],
  queryFn: () => {
    courseObj.query.is_public = ""
    if (!isAdmin.value) {
      if (courseObj.query.college_id == '') {
        courseObj.query.is_public = 1
      }
    }
    return $request(api.videoServer + '/Video/VideoCourseCatalog/getCourseList', courseObj.query, 'post')
  },
  enabled: false
})

watch(() => courseListData.value, (newVal) => {
  if (newVal) {
    courseObj.courseList = newVal.data.list
    courseObj.total = newVal.data.total
  }
})

const { data: courseListByIdData, refetch: refetchCourseListById } = useQuery({
  queryKey: ['courseListById', courseObj.catalog_id],
  queryFn: () => {
    return $request(api.videoServer + '/Video/VideoCourseCatalog/getCourseList', {
      page: 1,
      pageSize: 10,
      catalog_id: courseObj.catalog_id,
      is_his: 0
    }, 'post')
  },
  enabled: false
})

watch(() => courseListByIdData.value, (newVal) => {
  if (newVal) {
    courseObj.list = newVal.data.list
    showObj.course_show = true
  }
})

// Mutations
const submitCatalogMutation = useMutation({
  mutationFn: (formData) => $request(api.baseUrl + '/Video/VideoCourseCatalog/addOrModifyCatalog', formData, 'post'),
  onSuccess: (r) => {
    if (r.httpCode == 200) {
      $message.success(l.value.oprateSuccess)
      setTimeout(() => {
        showObj.catalog_show = false
        refetchCatalog()
      }, 1500)
    }
  }
})

const changeCatalogStatusMutation = useMutation({
  mutationFn: ({ key, value, remark }) => $request(api.baseUrl + '/Video/VideoCourseCatalog/changeCatalogIsValid', {
    key, value, remark
  }, 'post'),
  onSuccess: () => {
    $message.success(l.value.oprateSuccess)
    refetchCatalog()
  }
})

const addCourseToCatalogMutation = useMutation({
  mutationFn: (postData) => $request(api.videoServer + '/Video/VideoCourseCatalog/addCourseToCatalog', postData, 'post'),
  onSuccess: (r) => {
    if (r.httpCode == 200) {
      $message.success(l.value.oprateSuccess)
      setTimeout(() => {
        courseObj.form = []
        showObj.selectCourse = false
        refetchCourseListById()
      }, 1500)
    }
  }
})

const deleteCourseFromCatalogMutation = useMutation({
  mutationFn: ({ course_id, catalog_id, is_valid }) => $request(api.baseUrl + '/Video/VideoCourseCatalog/deleteCourseFromCatalog', {
    course_id, catalog_id, is_valid
  }, 'post'),
  onSuccess: () => {
    $message.success(l.value.oprateSuccess)
    refetchCourseListById()
  }
})

// Computed
const isAdmin = computed(() => {
  return store.getters.roles && store.getters.roles.includes('admin')
})

// Watchers
watch(filterOrgText, (val) => {
  instance.refs.orgTree?.filter(val)
})

watch(filterCatalogText, (val) => {
  instance.refs.catalogTree?.filter(val)
})

// Functions
const getCollegeList = () => {
  refetchCollege()
}

const getCatalogList = () => {
  if (catalogObj.query.college_id) {
    refetchCatalog()
  } else {
    showObj.catalog_show = false
  }
}

const getCatalogListById = (id) => {
  refetchCatalogById()
}

const getCourseList = () => {
  refetchCourseList()
}

const getCourseListById = (id) => {
  if (id) {
    courseObj.catalog_id = id
  }
  refetchCourseListById()
}

const collegeChange = (v) => {
  catalogObj.form.pid = ''
  refetchCatalogById()
}

const clickCollege = (id) => {
  catalogObj.query.college_id = id
  refetchCatalog()
}

const handleSelectionChangeToBeAdded = (val) => {
  multipleSelectionObj.toBeAdded = val
}

const handleSelectionChangeToBeRemoved = (val) => {
  multipleSelectionObj.toBeRemoved = val
}

const multipleAdd = () => {
  const allVideoArray = [...courseObj.list, ...courseObj.form]
  const videoIdSet = new Set(allVideoArray.map(i => i.id))
  multipleSelectionObj.toBeAdded.forEach(i => {
    if (!videoIdSet.has(i.id)) {
      courseObj.form.push(i)
    }
  })
  // Clear selection if needed
  $message.success(l.value.addToListSuccess)
}

const multipleRemove = () => {
  const idsToDelete = multipleSelectionObj.toBeRemoved.map(item => item.id)
  courseObj.form = courseObj.form.filter(item => !idsToDelete.includes(item.id))
}

const filterOrg = (value, data) => {
  if (!value) return true
  return data.name_label.indexOf(value) !== -1
}

const filterCatalog = (value, data) => {
  if (!value) return true
  return data.name_label.indexOf(value) !== -1
}

const addCatalog = async (data) => {
  if (catalogObj.list.length == 0) {
    await refetchCatalogById()
  }
  Object.assign(catalogObj.form, {
    id: "",
    pid: data ? data.id : "",
    college_id: data ? data.college_id : catalogObj.query.college_id,
    name_zh: "",
    name_en: "",
    name_tw: "",
    name_vi: "",
  })
  showObj.catalog_show = true
}

const editCatalog = (data) => {
  Object.assign(catalogObj.form, data)
  showObj.catalog_show = true
}

const modifyCatalogStatus = (i) => {
  const msg = i.is_valid == 'Y' ? l.value.disable + '《' + i.name_label + '》？' + l.value.confirmTips : l.value.enable + '《' + i.name_label + '》？' + l.value.confirmTips
  const status = i.is_valid == 'Y' ? 'N' : 'Y'

  showObj.confirmData = {
      title: l.value.confirmTips || 'Confirm',
      message: msg,
      callback: () => {
         changeCatalogStatusMutation.mutate({ key: i.id, value: status, remark: '' })
      }
  }
  showObj.confirmShow = true
}

const handleConfirmOk = () => {
  if (showObj.confirmData.callback) {
      showObj.confirmData.callback()
  }
  showObj.confirmShow = false
}

const handleConfirmCancel = () => {
  showObj.confirmShow = false
}

const submitCatalog = () => {
  if (!catalogObj.form.college_id) {
    $message.error(l.value.plsSelectBelongCollege)
    return
  }
  if (!catalogObj.form.name_zh) {
    $message.error(l.value.plsInputName_zh)
    return
  }
  submitCatalogMutation.mutate(catalogObj.form)
}

const addCourse = (data) => {
  if (courseObj.list.some(i => i.id === data.id)) {
    $message.error(l.value.alreadyExistedInCatalogue)
  } else {
    if (courseObj.form.some(i => i.id === data.id)) {
      $message.error(l.value.alreadyExistedInToBeAddedList)
    } else {
      courseObj.form.push(data)
    }
  }
}

const removeCourse = (i) => {
  courseObj.form.splice(i, 1)
}

const beforeOpenCourseDialog = () => {
  courseObj.form = []
  showObj.selectCourse = true
}

const bindCourseToCatalog = () => {
  const postData = courseObj.form.map(i => ({
    id: "",
    catalog_id: courseObj.catalog_id,
    course_id: i.course_id
  }))
  addCourseToCatalogMutation.mutate(postData)
}

const cancelBindCourse = () => {
  showObj.selectCourse = false
}

const toggleCourseStatus = (data) => {
  const value = data.is_valid == 'Y' ? 'N' : 'Y'
  const msg = data.is_valid == 'Y' 
    ? l.value.confirmDisable + ` 《${data.name_zh}》 ?`
    : l.value.confirmEnable + ` 《${data.name_zh}》 ?`

  showObj.confirmData = {
      title: l.value.confirmTips || 'Confirm',
      message: msg,
      callback: () => {
         deleteCourseFromCatalogMutation.mutate({
            course_id: data.course_id,
            catalog_id: courseObj.catalog_id,
            is_valid: value
         })
      }
  }
  showObj.confirmShow = true
}

onMounted(() => {
  refetchCollege()
})
</script>

<style scoped>
/* Scoped styles can stay if needed, but we used utility classes */
</style>
