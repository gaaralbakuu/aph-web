<template>
  <div ref="lesssonCatalogue-container" class="lesssonCatalogue-container">
    <el-drawer class="drawer-container" :visible.sync="showObj.catalog_show" :wrapperClosable="false" size="40%" :before-close="getCatalogList">
      <div slot="title" class="title">{{ l.addEditCatalogue }}</div>
      <div class="form-container">
        <div class="form">
          <el-form label-width="100px" size="medium">
            <el-form-item :label="l.belongCollege" required>
              <el-select v-model="catalogObj.form.college_id" style="width: 100%" @change="collegeChange">
                <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label" :value="i.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="l.parentCatalogue" v-if="catalogObj.form.college_id != ''">
              <el-cascader v-model="catalogObj.form.pid" :options="catalogObj.list" clearable :placeholder="l.emptyIsRootCatalogue" style="width: 100%" :props="catalogObj.cascaderProps"> </el-cascader>
            </el-form-item>
            <el-form-item :label="l.simplifiedChineseName" required>
              <el-input v-model="catalogObj.form.name_zh"></el-input>
            </el-form-item>
            <el-form-item :label="l.traditionalChineseName">
              <el-input v-model="catalogObj.form.name_tw"></el-input>
            </el-form-item>
            <el-form-item :label="l.englishName">
              <el-input v-model="catalogObj.form.name_en"></el-input>
            </el-form-item>
            <el-form-item :label="l.vietnameseName">
              <el-input v-model="catalogObj.form.name_vi"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="buttonBar">
          <el-button type="primary" @click="submitCatalog">{{ l.submit }}</el-button>
          <el-button type="danger" @click="showObj.catalog_show = false">{{ l.close }}</el-button>
        </div>
      </div>
    </el-drawer>

    <div style="display: flex; justify-content: space-around">
      <div style="width: 30%">
        <div class="org_filter" style="display: flex; height: 60px; padding: 14px 0px">
          <el-input :placeholder="l.inputKeywordFilter" v-model="filterOrgText"></el-input>
          <el-button type="success" @click="getCollegeList" style="margin-left: 10px">{{ l.refresh }}</el-button>
        </div>
        <el-tree class="org-tree" ref="orgTree" node-key="id" :accordion="true" :default-expand-all="true" :data="publicCodeObj.collegeList" :filter-node-method="filterOrg">
          <div class="org-tree-node" slot-scope="{ node, data }" @click="clickCollege(data.id)">
            <span>{{ data.name_label }}</span>
          </div>
        </el-tree>
      </div>
      <div style="width: 65%">
        <div v-show="catalogObj.query.college_id != ''">
          <div class="catalog_filter" style="display: flex; height: 60px; padding: 14px 0px">
            <el-select v-model="catalogObj.query.is_valid" @change="getCatalogList">
              <el-option :label="l.all" value=""></el-option>
              <el-option :label="l.enabled" value="Y"></el-option>
              <el-option :label="l.disabled" value="N"></el-option>
            </el-select>
            <el-input :placeholder="l.inputKeywordFilter" v-model="filterCatalogText" style="margin-left: 10px"></el-input>
            <el-button type="success" @click="getCatalogList" style="margin-left: 10px">{{ l.refresh }}</el-button>
            <el-button type="primary" @click="addCatalog()" style="margin-left: 10px">{{ l.addCatalogue }}</el-button>
          </div>
          <el-tree ref="catalogTree" node-key="id" :accordion="true" :default-expand-all="true" :data="catalogObj.data" :filter-node-method="filterCatalog" :empty-text="l.emptyCatalogue">
            <div class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ data.name_label }}</span>
              <span>
                <el-button type="text" @click.stop="addCatalog(data)">{{ l.addChildCatalogue }}</el-button>
                <el-button type="text" @click.stop="editCatalog(data)">{{ l.edit }}</el-button>
                <el-button type="text" @click.stop="getCourseListById(data.id)">{{ l.manage }}</el-button>
                <el-button v-if="data.is_valid == 'N'" type="text" style="color: seagreen" @click.stop="modifyCatalogStatus(data)">{{ l.enable }}</el-button>
                <el-button v-else type="text" style="color: red" @click.stop="modifyCatalogStatus(data)">{{ l.disable }}</el-button>
              </span>
            </div>
          </el-tree>
        </div>
        <div v-show="catalogObj.query.college_id == ''" style="width: 100%; height: 500px; line-height: 500px; text-align: center; color: #aaa; font-size: 20px">
          {{ l.selectCollegeToView }}
        </div>
      </div>
    </div>

    <!-- 课程管理drawer -->
    <el-drawer class="drawer-container" :visible.sync="showObj.course_show" :wrapperClosable="false" size="50%">
      <div slot="title" class="title">{{ l.courseManagement }}</div>
      <div class="form-container">
        <el-button type="primary" @click="beforeOpenCourseDialog">{{ l.addCourse }}</el-button>
        <el-table :data="courseObj.list" style="width: 100%">
          <el-table-column prop="thumbnail_path" :label="l.cover">
            <template slot-scope="scope">
              <div class="img" v-if="scope.row.thumbnail_path">
                <img class="auto-img" :src="$api.videoServer + '/' + scope.row.thumbnail_path" />
              </div>
              <div v-else style="text-align: center; width: 100%">
                <i class="el-icon-picture-outline" style="font-size: 60px"></i>
                <div>{{ l.noCover }}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name_zh" :label="l.title"></el-table-column>
          <el-table-column prop="is_valid" :label="l.status"></el-table-column>
          <el-table-column :label="l.operation">
            <template slot-scope="scope">
              <el-button type="text" style="color: red" @click="toggleCourseStatus(scope.row)">{{ l.remove }}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="buttonBar">
        <el-button type="danger" @click="showObj.course_show = false">{{ l.close }}</el-button>
      </div>
    </el-drawer>

    <!-- 选择课程 -->
    <el-dialog :visible.sync="showObj.selectCourse" :title="l.addCourse" width="70%">
      <div style="height: 500px; display: flex; justify-content: space-between">
        <div style="width: 48%; border: 1px solid #ddd; border-radius: 5px; padding: 5px">
          <div style="margin-bottom: 10px; display: flex; justify-content: space-between">
            <el-input v-model="courseObj.query.name" style="width: 200px" @keyup.native.enter="getCourseList"></el-input>
            <el-button type="primary" @click="getCourseList">{{ l.search }}</el-button>
            <el-button type="success" @click="multipleAdd">{{ l.batchAdd }}</el-button>
          </div>
          <el-table :data="courseObj.courseList" height="420" @selection-change="handleSelectionChangeToBeAdded">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="thumbnail_path" :label="l.cover">
              <template slot-scope="scope">
                <div class="img" v-if="scope.row.thumbnail_path">
                  <img class="auto-img" :src="$api.videoServer + '/' + scope.row.thumbnail_path" />
                </div>
                <div v-else style="text-align: center; width: 100%">
                  <i class="el-icon-picture-outline" style="font-size: 30px"></i>
                  <div style="font-size: 10px">{{ l.noCover }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="name_zh" :label="l.title"></el-table-column>
            <el-table-column :label="l.operation">
              <template slot-scope="scope">
                <el-button type="text" @click="addCourse(scope.row)">{{ l.add }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div style="width: 48%; border: 1px solid #ddd; border-radius: 5px; padding: 5px">
          <div style="margin-bottom: 10px; display: flex; justify-content: space-between">
            <div>{{ l.toBeAddedList }}</div>
            <el-button type="danger" @click="multipleRemove">{{ l.batchRemove }}</el-button>
          </div>
          <el-table :data="courseObj.form" height="420" @selection-change="handleSelectionChangeToBeRemoved">
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="name_zh" :label="l.title"></el-table-column>
            <el-table-column :label="l.operation">
              <template slot-scope="scope">
                <el-button type="text" style="color: red" @click="removeCourse(scope.$index)">{{ l.remove }}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="bindCourseToCatalog">{{ l.confirm }}</el-button>
        <el-button @click="showObj.selectCourse = false">{{ l.cancel }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { l, c } = useLocalI18n('videoAdminCatalogue')
const { proxy } = getCurrentInstance()
const isAdmin = computed(() => proxy.$store.getters.isAdmin)

const filterOrgText = ref('')
const filterCatalogText = ref('')

const multipleSelectionObj = reactive({
  toBeAdded: [],
  toBeRemoved: [],
})

const showObj = reactive({
  org_show: false,
  catalog_show: false,
  course_show: false,
  selectCourse: false,
})

const publicCodeObj = reactive({
  collegeList: [],
})

const catalogObj = reactive({
  cascaderProps: {
    expandTrigger: 'hover',
    checkStrictly: true,
    emitPath: false,
    value: 'id',
    label: 'name_label',
    children: 'children',
  },
  data: [],
  list: [],
  query: {
    college_id: '',
    is_valid: '',
  },
  form: {
    id: '',
    pid: '',
    college_id: '',
    name_zh: '',
    name_en: '',
    name_tw: '',
    name_vi: '',
    sort: 0,
  },
})

const courseObj = reactive({
  currentIndex: '',
  catalog_id: '',
  query: {
    page: 1,
    pageSize: 10,
    college_id: '',
    is_public: '',
    name: '',
    is_his: 0,
  },
  form: [],
  total: 0,
  list: [],
  courseList: [],
})

const filterOrg = (value, data) => {
  if (!value) return true
  return data.name_label.indexOf(value) !== -1
}

watch(filterOrgText, (val) => {
  proxy.$refs.orgTree.filter(val)
})

const filterCatalog = (value, data) => {
  if (!value) return true
  return data.name_label.indexOf(value) !== -1
}

watch(filterCatalogText, (val) => {
  proxy.$refs.catalogTree.filter(val)
})

const getCollegeList = () => {
  proxy
    .$request(proxy.$api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
      resource_path: proxy.$route.path,
    })
    .then((r) => {
      publicCodeObj.collegeList = r.data
    })
    .catch((e) => {
      proxy.$message.error(e.message)
    })
}

const getCatalogList = () => {
  if (catalogObj.query.college_id) {
    proxy
      .$request(proxy.$api.videoServer + '/Video/VideoCourseCatalog/getCatalogList', catalogObj.query)
      .then((r) => {
        catalogObj.data = r.data
        showObj.catalog_show = false
      })
      .catch((e) => {
        console.log(e)
      })
  } else {
    showObj.catalog_show = false
  }
}

const getCatalogListById = () => {
  proxy
    .$request(proxy.$api.videoServer + '/Video/VideoCourseCatalog/getCatalogList', {
      college_id: catalogObj.form.college_id,
      is_valid: catalogObj.query.is_valid,
    })
    .then((r) => {
      catalogObj.list = r.data
    })
    .catch((e) => {
      console.log(e)
    })
}

const getCourseList = () => {
  courseObj.query.is_public = ''
  if (!isAdmin.value) {
    if (courseObj.query.college_id == '') {
      courseObj.query.is_public = 1
    }
  }
  proxy
    .$request(proxy.$api.videoServer + '/Video/VideoCourseCatalog/getCourseList', courseObj.query, 'post')
    .then((r) => {
      courseObj.courseList = r.data.list
      courseObj.total = r.data.total
    })
    .catch((e) => {
      console.log(e)
    })
}

const getCourseListById = (id) => {
  if (id) {
    courseObj.catalog_id = id
  }
  proxy
    .$request(
      proxy.$api.videoServer + '/Video/VideoCourseCatalog/getCourseList',
      {
        page: 1,
        pageSize: 10,
        catalog_id: courseObj.catalog_id,
        is_his: 0,
      },
      'post'
    )
    .then((r) => {
      courseObj.list = r.data.list
      showObj.course_show = true
    })
    .catch((e) => {
      console.log(e)
    })
}

const collegeChange = (v) => {
  catalogObj.form.pid = ''
  getCatalogListById()
}

const clickCollege = (id) => {
  catalogObj.query.college_id = id
  getCatalogList()
}

const handleSelectionChangeToBeAdded = (val) => {
  multipleSelectionObj.toBeAdded = val
}

const handleSelectionChangeToBeRemoved = (val) => {
  multipleSelectionObj.toBeRemoved = val
}

const multipleAdd = () => {
  let allVideoArray = [...courseObj.list, ...courseObj.form]
  let videoIdSet = new Set(allVideoArray.map((i) => i.id))
  multipleSelectionObj.toBeAdded.forEach((i) => {
    if (!videoIdSet.has(i.id)) {
      courseObj.form.push(i)
    }
  })
}

const multipleRemove = () => {
  let idsToDelete = multipleSelectionObj.toBeRemoved.map((item) => item.id)
  courseObj.form = courseObj.form.filter((item) => !idsToDelete.includes(item.id))
}

const addCatalog = (data) => {
  if (catalogObj.list.length == 0) {
    getCatalogListById()
  }
  catalogObj.form = Object.assign(catalogObj.form, {
    id: '',
    pid: data ? data.id : '',
    college_id: data ? data.college_id : catalogObj.query.college_id,
    name_zh: '',
    name_en: '',
    name_tw: '',
    name_vi: '',
  })
  showObj.catalog_show = true
}

const editCatalog = (data) => {
  catalogObj.form = Object.assign(catalogObj.form, data)
  showObj.catalog_show = true
}

const modifyCatalogStatus = (i) => {
  let currentStatus = i.is_valid
  let value
  let oprate
  if (currentStatus == 'N') {
    value = 'Y'
    oprate = l.value.enable
  } else {
    value = 'N'
    oprate = l.value.disable
  }

  proxy
    .$confirm(oprate + '《' + i.name_label + '》？' + l.value.confirm, {
      confirmButtonText: l.value.confirm,
      cancelButtonText: l.value.cancel,
      type: 'warning',
    })
    .then(() => {
      proxy
        .$request(
          proxy.$api.videoServer + '/Video/VideoCourseCatalog/changeCatalogIsValid',
          {
            key: i.id,
            value: value,
            remark: '',
          },
          'post'
        )
        .then((r) => {
          proxy.$message({
            type: 'success',
            message: l.value.operationSuccess,
          })
          getCatalogList()
        })
    })
    .catch(() => {})
}

const submitCatalog = () => {
  if (catalogObj.form.college_id == '') {
    return proxy.$message.error(l.value.pleaseSelectCollege)
  }
  if (catalogObj.form.name_zh == '') {
    return proxy.$message.error(l.value.pleaseInputChineseName)
  }
  proxy
    .$request(proxy.$api.videoServer + '/Video/VideoCourseCatalog/addOrModifyCatalog', catalogObj.form, 'post')
    .then((r) => {
      if (r.httpCode == 200) {
        proxy.$message({
          type: 'success',
          message: l.value.submitSuccess,
        })
        setTimeout(() => {
          getCatalogList()
        }, 1500)
      }
    })
    .catch((e) => {
      console.log(e)
    })
}

const addCourse = (data) => {
  if (courseObj.list.some((i) => i.id === data.id)) {
    proxy.$message.error(l.value.courseAlreadyExist)
  } else {
    if (courseObj.form.some((i) => i.id === data.id)) {
      proxy.$message.error(l.value.courseAlreadyInAddList)
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
  let postData = []
  courseObj.form.forEach((i) => {
    let j = {
      id: '',
      catalog_id: courseObj.catalog_id,
      course_id: i.id,
    }
    postData.push(j)
  })
  proxy
    .$request(proxy.$api.videoServer + '/Video/VideoCourseCatalog/addCourseToCatalog', postData, 'post')
    .then((r) => {
      if (r.httpCode == 200) {
        proxy.$message({
          type: 'success',
          message: l.value.submitSuccess,
        })
        setTimeout(() => {
          courseObj.form = []
          showObj.selectCourse = false
          getCourseListById()
        }, 1500)
      }
    })
    .catch((e) => {
      console.log(e)
    })
}

const toggleCourseStatus = (data) => {
  let value
  let oprate
  if (data.is_valid == 'Y') {
    value = 'N'
    oprate = l.value.remove
  } else {
    value = 'Y'
    oprate = l.value.recover
  }

  proxy
    .$confirm(oprate + '《' + data.name_zh + '》？', {
      confirmButtonText: l.value.confirm,
      cancelButtonText: l.value.cancel,
      type: 'warning',
    })
    .then(() => {
      proxy
        .$request(
          proxy.$api.videoServer + '/Video/VideoCourseCatalog/deleteCourseFromCatalog',
          {
            course_id: data.id,
            catalog_id: courseObj.catalog_id,
            is_valid: value,
          },
          'post'
        )
        .then((r) => {
          proxy.$message({
            type: 'success',
            message: l.value.operationSuccess,
          })
          getCourseListById()
        })
    })
    .catch(() => {})
}

onMounted(() => {
  getCollegeList()
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

.custom-tree-node {
  width: 95%;
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
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
