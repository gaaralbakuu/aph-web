<template>
  <div ref="lesssonCatalogue-container" class="lesssonCatalogue-container">

    <a-modal v-model:open="showObj.selectCourse" @afterOpen='getCourseList' width="90%" style="top: 7vh"
      :title="l.addCourseToCatalogue">
      <div class="CourseSelect-dialog">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form layout="inline">
              <a-form-item :label="l.college">
                <a-select v-model:value="courseObj.query.college_id" @change="getCourseList"
                  :placeholder="l.emptyIsPublicCourse" allow-clear>
                  <a-select-option v-for="i in collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</a-select-option>
                </a-select>
              </a-form-item>
              <a-form-item :label="l.title">
                <a-input :placeholder="l.keyword" v-model:value="courseObj.query.name" allow-clear @clear='getCourseList'
                  @pressEnter="getCourseList"></a-input>
              </a-form-item>
              <a-form-item>
                <a-button type="primary" @click="getCourseList">{{l.search}}</a-button>
                <a-button type="default" @click="multipleAdd">{{l.multipleAdd}}</a-button>
              </a-form-item>
            </a-form>

            <a-table ref="toBeAddedTable" class='video-table' :dataSource="courseObj.courseList"
              row-key="id" :pagination="false" :scroll="{ y: 500 }"
              @selection-change="handleSelectionChangeToBeAdded">
              <a-table-column type="selection" width="55">
              </a-table-column>
              <a-table-column title="No" width="50">
                <template #default="{ index }">
                  {{ index + 1 }}
                </template>
              </a-table-column>
              <a-table-column :title="l.cover">
                <template #default="{ record }">
                  <div class="img" v-if="record.thumbnail_path">
                    <img class="auto-img" :src="api.baseUrl+'/'+ record.thumbnail_path" />
                  </div>
                  <div v-else style="text-align: center;width: 100%;">
                    <i class="el-icon-picture-outline" style="font-size: 60px;"></i>
                    <div>{{l.noCover}}</div>
                  </div>
                </template>
              </a-table-column>
              <a-table-column :title="l.title" data-index="name_zh">
              </a-table-column>
              <a-table-column :title="l.desc" data-index="description">
              </a-table-column>
              <a-table-column :title="c.operation" width="80">
                <template #default="{ record }">
                  <a-button type="link" @click="addCourse(record)">{{l.select}}</a-button>
                </template>
              </a-table-column>
            </a-table>
          </a-col>
          <a-col :span="12">
            <a-form layout="inline">
              <a-form-item :label="l.toBeAddedList">
                <a-button type="primary" danger @click="multipleRemove">{{l.multipleRemove}}</a-button>
              </a-form-item>
            </a-form>

            <a-table ref="toBeRemovedTable" :dataSource="courseObj.form"
              style="width: 95%;margin: 0 auto;" :pagination="false"
              @selection-change="handleSelectionChangeToBeRemoved">
              <a-table-column type="selection" width="55">
              </a-table-column>
              <a-table-column title="No" width="50">
                <template #default="{ index }">
                  {{ index + 1 }}
                </template>
              </a-table-column>
              <a-table-column :title="l.cover">
                <template #default="{ record }">
                  <div class="img" v-if="record.thumbnail_path">
                    <img class="auto-img" :src="api.baseUrl+'/'+ record.thumbnail_path" />
                  </div>
                  <div v-else style="text-align: center;width: 100%;">
                    <i class="el-icon-picture-outline" style="font-size: 60px;"></i>
                    <div>{{l.noCover}}</div>
                  </div>
                </template>
              </a-table-column>
              <a-table-column :title="l.title" data-index="name_zh"></a-table-column>
              <a-table-column :title="l.desc" data-index="description" ellipsis></a-table-column>
              <a-table-column :title="l.score" data-index="score"></a-table-column>
              <a-table-column :title="c.operation" width="80">
                <template #default="{ record, index }">
                  <a-button type='link' @click="removeCourse(index)">{{l.remove}}</a-button>
                </template>
              </a-table-column>
            </a-table>
          </a-col>
        </a-row>
      </div>
      <template #footer>
        <a-button type="primary" @click="bindCourseToCatalog">{{l.submit}}</a-button>
        <a-button @click="cancelBindCourse">{{l.giveup}}</a-button>
      </template>
    </a-modal>

    <a-drawer class="drawer-container" :visible="showObj.course_show" :closable="false" :width="600"
      placement="bottom" @close="showObj.course_show = false">
      <template #title>
        <div class="title">
          <div>{{l.courseManage}}</div>
          <div class="title-btn">
            <a-button type="primary" size="small" @click="beforeOpenCourseDialog">{{l.addCourse}}</a-button>
          </div>
        </div>
      </template>
      <div class="form-container">
        <a-table ref="multipleTable" :dataSource="courseObj.list" row-key="id"
          style="width: 95%;margin: 0 auto;" :pagination="false">
          <a-table-column title="No" width="50">
            <template #default="{ index }">
              {{ index + 1 }}
            </template>
          </a-table-column>
          <a-table-column :title="l.cover">
            <template #default="{ record }">
              <div class="img" v-if="record.thumbnail_path">
                <img class="auto-img" :src="api.baseUrl+'/'+ record.thumbnail_path" />
              </div>
              <div v-else style="text-align: center;width: 100%;">
                <i class="el-icon-picture-outline" style="font-size: 60px;"></i>
                <div>{{l.noCover}}</div>
              </div>
            </template>
          </a-table-column>
          <a-table-column :title="l.title" data-index="name_zh"></a-table-column>
          <a-table-column :title="l.desc" data-index="description" ellipsis></a-table-column>
          <a-table-column :title="l.score" data-index="score"></a-table-column>
          <a-table-column :title="l.status" data-index="is_valid"></a-table-column>
          <a-table-column :title="c.operation">
            <template #default="{ record }">
              <a-button type='link' @click="toggleCourseStatus(record)">{{l.remove}}</a-button>
            </template>
          </a-table-column>
        </a-table>
        <div class="buttonBar">
          <a-button type="primary" @click="showObj.course_show = false">{{c.close}}</a-button>
        </div>
      </div>
    </a-drawer>

    <a-drawer class="drawer-container" :visible="showObj.catalog_show" :closable="true" :width="600"
      @close="showObj.catalog_show = false">
      <template #title>
        <div class="title">{{l.addOrEditCatalogue}}</div>
      </template>
      <div class="form-container">
        <div class="form">
          <a-form :label-col="{ span: 6 }" size="middle">
            <a-form-item :label="l.name_zh" required>
              <a-input v-model:value="catalogObj.form.name_zh"></a-input>
            </a-form-item>
            <a-form-item :label="l.name_tw">
              <a-input v-model:value="catalogObj.form.name_tw"></a-input>
            </a-form-item>
            <a-form-item :label="l.name_en">
              <a-input v-model:value="catalogObj.form.name_en"></a-input>
            </a-form-item>
            <a-form-item :label="l.name_vi">
              <a-input v-model:value="catalogObj.form.name_vi"></a-input>
            </a-form-item>
            <a-form-item :label="l.belongCollege" required>
              <a-select v-model:value="catalogObj.form.college_id" style="width: 100%;" @change="collegeChange">
                <a-select-option v-for="i in collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</a-select-option>
              </a-select>
            </a-form-item>
            <a-form-item :label="l.parentCatalogue" v-show="catalogObj.form.college_id">
              <a-cascader v-model:value="catalogObj.form.pid" :options="catalogObj.list" allow-clear
                :placeholder="l.emptyIsRootCatalogue" style="width: 100%;" :field-names="catalogObj.cascaderProps">
              </a-cascader>
            </a-form-item>
          </a-form>
        </div>
        <div class="buttonBar">
          <a-button type="primary" @click="submitCatalog">{{l.submit}}</a-button>
          <a-button type="primary" danger @click="showObj.catalog_show = false">{{l.giveup}}</a-button>
        </div>
      </div>
    </a-drawer>

    <div style="display: flex;justify-content: space-around;height: 100%;">
      <div style="width: 30%;height: 100%;">
        <div class="org_filter" style="display: flex;height: 60px;padding: 14px 0px;">
          <a-input :placeholder="l.keyword" v-model:value="filterOrgText"></a-input>
          <a-button type="default" @click="getCollegeList" style="margin-left: 10px;">{{l.refresh}}</a-button>
        </div>
        <el-tree class="org-tree" ref="orgTree" node-key="id" :accordion="true" :default-expand-all="true"
          :data="collegeList" :filter-node-method="filterOrg">
          <template #default="{ node, data }">
            <div class="org-tree-node" @click="clickCollege(data.id)">
              <span> {{ data.name_label }}</span>
            </div>
          </template>
        </el-tree>
      </div>
      <div class="catalogBox">
        <div class="catalog_filter">
          <a-select v-model:value="catalogObj.query.is_valid" @change="getCatalogList">
            <a-select-option :value="''">{{c.all}}</a-select-option>
            <a-select-option :value="'Y'">{{c.enable}}</a-select-option>
            <a-select-option :value="'N'">{{c.disable}}</a-select-option>
          </a-select>
          <a-input :placeholder="l.keyword" v-model:value="filterCatalogText"></a-input>

          <a-button type="default" @click="getCatalogList" style="margin-left: 10px;">{{l.refresh}}</a-button>
          <a-button type="primary" @click="addCatalog" style="margin-left: 10px;">{{l.addCatalog}}</a-button>
        </div>
        <div class="catalog-tree">
          <el-tree ref="catalogTree" node-key="id" :accordion="true" :default-expand-all="true" :data="catalogObj.data"
            :filter-node-method="filterCatalog"
            :empty-text="catalogObj.query.college_id ? l.emptyCatalogue : l.plsSelectCollegeToManage">
            <template #default="{ node, data }">
              <div class="custom-tree-node">
                <span>{{ data.name_label }}</span>
                <span class="opera-button">
                  <a-button type="link" @click.stop="addCatalog(data)">{{l.addChildCatalog}}</a-button>
                  <a-button type="link" @click.stop="editCatalog(data)">{{c.edit}}</a-button>
                  <a-button type="link" v-show="data.is_valid=='N'" @click.stop="modifyCatalogStatus(data)">{{c.enable}}</a-button>
                  <a-button type="link" danger v-show="data.is_valid=='Y'" @click.stop="modifyCatalogStatus(data)">{{c.disable}}</a-button>
                  <a-button type="link" @click="getCourseListById(data.id)">{{l.manage}}</a-button>
                </span>
              </div>
            </template>
          </el-tree>
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
  selectCourse: false
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
    label: 'name_label'
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
      $message.success(l.oprateSuccess)
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
    $message.success(l.oprateSuccess)
    refetchCatalog()
  }
})

const addCourseToCatalogMutation = useMutation({
  mutationFn: (postData) => $request(api.videoServer + '/Video/VideoCourseCatalog/addCourseToCatalog', postData, 'post'),
  onSuccess: (r) => {
    if (r.httpCode == 200) {
      $message.success(l.oprateSuccess)
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
    $message.success(l.oprateSuccess)
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
  instance.refs.toBeAddedTable?.clearSelection()
  $message.success(l.addToListSuccess)
}

const multipleRemove = () => {
  const idsToDelete = multipleSelectionObj.toBeRemoved.map(item => item.id)
  courseObj.form = courseObj.form.filter(item => !idsToDelete.includes(item.id))
  instance.refs.toBeRemovedTable?.clearSelection()
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
    college_id: data ? data.college_id : "",
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
  const msg = i.is_valid == 'Y' ? l.disable + '《' + i.name_label + '》？' + l.confirmTips : l.enable + '《' + i.name_label + '》？' + l.confirmTips
  const status = i.is_valid == 'Y' ? 'N' : 'Y'
  $prompt(msg, {
    type: 'warning',
    inputPattern: /^[Y]{1}$/i,
    inputErrorMessage: l.inputErrorMessage,
    confirmButtonText: l.confirmText,
    cancelButtonText: l.cancelText
  }).then(() => {
    changeCatalogStatusMutation.mutate({ key: i.id, value: status, remark: '' })
  }).catch(() => {
    console.log('取消操作')
  })
}

const submitCatalog = () => {
  if (!catalogObj.form.college_id) {
    $message.error(l.plsSelectBelongCollege)
    return
  }
  if (!catalogObj.form.name_zh) {
    $message.error(l.plsInputName_zh)
    return
  }
  submitCatalogMutation.mutate(catalogObj.form)
}

const addCourse = (data) => {
  if (courseObj.list.some(i => i.id === data.id)) {
    $message.error(l.alreadyExistedInCatalogue)
  } else {
    if (courseObj.form.some(i => i.id === data.id)) {
      $message.error(l.alreadyExistedInToBeAddedList)
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
    ? `您确定要禁用当前目录下《${data.name_zh}》这张课程吗？请输入Y后再次确认操作`
    : `您确定要启用当前目录下《${data.name_zh}》这张课程吗？请输入Y后再次确认操作`
  $prompt(msg, {
    type: 'warning',
    inputPattern: /^[Y]{1}$/i,
    inputErrorMessage: '输入验证信息错误',
    confirmButtonText: "确认",
    cancelButtonText: "取消"
  }).then(() => {
    deleteCourseFromCatalogMutation.mutate({
      course_id: data.course_id,
      catalog_id: courseObj.catalog_id,
      is_valid: value
    })
  }).catch(() => {
    console.log('取消操作')
  })
}

onMounted(() => {
  refetchCollege()
})
</script>

<style>
.img {
  width: 80%;
  height: 60px;
}
.img .auto-img {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
}

.catalogBox {
  width: 65%;
  height: 100%;
  max-height: 100%;
}
.catalogBox .catalog_filter {
  display: flex;
  height: 60px;
  padding: 14px 0px;
}
.catalogBox .catalog-tree {
  height: calc(100% - 60px);
  max-height: calc(100% - 60px);
  overflow: scroll;
}

.custom-tree-node {
  width: 95%;
  height: 40px;
  font-size: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.lesssonCatalogue-container {
  width: 100%;
  height: 100%;
}
.lesssonCatalogue-container .drawer-container .title {
  padding: 0px 20px 10px 20px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
}
.lesssonCatalogue-container .drawer-container .form-container {
  width: 100%;
  height: 95%;
  margin: 0 auto;
  background-color: #fff;
}
.lesssonCatalogue-container .drawer-container .form-container .form {
  width: 90%;
  margin: 0 auto;
}
.lesssonCatalogue-container .drawer-container .form-container .buttonBar {
  width: 100%;
  height: 60px;
  margin: 0 auto;
  padding: 0 30px;
  position: absolute;
  bottom: 0px;
  border-top: 1px solid #ccc;
  float: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.lesssonCatalogue-container .org-tree-node {
  width: 85%;
  height: 40px;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
