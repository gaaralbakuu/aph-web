<template>
  <div class="banner-container">

    <el-dialog :visible.sync="showObj.topic" @open='getTopicList' width="60%" :title="l.topicDialogTitle">
      <div class="CourseSelect-dialog">
        <el-form inline>
          <el-form-item :label="l.college">
            <el-select v-model="topicObj.query.college_id" :placeholder="l.collegePlaceholder" @change="getTopicList"
              :clearable="isAdmin">
              <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="l.status">
            <el-select v-model="topicObj.query.is_valid" style="width: 100px;">
              <el-option :label="l.all" value=""></el-option>
              <el-option :label="l.enabled" value="Y"></el-option>
              <el-option :label="l.disabled" value="N"></el-option>
            </el-select>
            <el-button type="success" @click="getTopicList" style="margin-left:20px ;">{{l.search}}</el-button>
          </el-form-item>
        </el-form>
        <el-table ref="topicTable" :data="topicObj.list" row-key='id' tooltip-effect="dark" highlight-current-row
          highlight-selection-row stripe border>
          <el-table-column type="index" width="50" :label="l.serialNumber"></el-table-column>
          <el-table-column :label="l.topicName" prop="title_label"></el-table-column>
          <el-table-column :label="l.lastModifier" prop="modify_user"></el-table-column>
          <el-table-column :label="l.lastModifyTime" prop="modify_time"></el-table-column>
          <el-table-column :label="l.enabled" prop="is_valid" width="80"></el-table-column>
          <el-table-column :label="l.operation" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button type='text' @click="selectTopic(scope.row)">{{l.edit}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleTopicSizeChange" @current-change="handleTopicPageChange"
          :current-page="topicObj.query.page" :page-sizes="[5,10, 15, 30, 50,100]" :page-size="topicObj.query.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="topicObj.total" style="float: right;">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button style="width: 8em;" type="primary" plain @click="showObj.topic = false">{{l.close}}</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="showObj.course" @open='getCourseList' width="60%" :title="l.addToTopic">
      <div class="CourseSelect-dialog">
        <el-form inline>
          <el-form-item :label="l.college">
            <el-select v-model="courseObj.query.college_id" :placeholder="l.publicCourse" clearable>
              <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="l.name">
            <el-input :placeholder="l.keywordSearch" v-model="courseObj.query.name" clearable @clear='getCourseList'
              @keyup.native.enter="getCourseList"></el-input>
          </el-form-item>
          <el-form-item :label="l.courseType">
            <el-select v-model="courseObj.query.is_public" :disabled="!isAdmin&&courseObj.query.college_id==''"
              style="width: 100px;" @change="getCourseList">
              <el-option :label="l.all" value=""></el-option>
              <el-option :label="l.public" :value="1"></el-option>
              <el-option :label="l.nonPublic" :value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="getCourseList">{{l.search}}</el-button>
          </el-form-item>
        </el-form>
        <el-table ref="toBeAddedTable" class='video-table' :data="courseObj.list" tooltip-effect="dark" row-key="id"
          highlight-current-row highlight-selection-row stripe border max-height="500px">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column type="index" width="50" :label="l.serialNumber">
          </el-table-column>
          <el-table-column prop="thumbnail_path" :label="l.cover">
            <template slot-scope="scope">
              <div class="img" v-if="scope.row.thumbnail_path">
                <img class="auto-img" :src="api.baseUrl+'/'+ scope.row.thumbnail_path" />
              </div>
              <div v-else style="text-align: center;width: 100%;">
                <i class="el-icon-picture-outline" style="font-size: 60px;"></i>
                <div>{{l.noCover}}</div>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="name_zh" :label="l.name">
          </el-table-column>
          <el-table-column prop="description" :label="l.description">
          </el-table-column>
          <el-table-column :label="l.operation" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button class="text-green" type='text' @click="toPlay(scope.row.id)">{{l.preview}}</el-button>
              <el-button type="text" @click="selectCourse(scope.row)">{{l.select}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleCourseSizeChange" @current-change="handleCoursePageChange"
          :current-page="courseObj.query.page" :page-sizes="[5,10, 15, 30, 50,100]"
          :page-size="courseObj.query.pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="courseObj.total" style="float: right;">
        </el-pagination>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button style="width: 8em;" type="primary" plain @click="showObj.course = false">{{l.close}}</el-button>
      </div>
    </el-dialog>

    <input ref="coverInput" type="file" @change="uploadCoverChange" style="display: none;" accept="image/*" />

    <div class="banner-filter">
      <el-form inline>
        <el-form-item :label="l.name">
          <el-input v-model="query.queryString.str"></el-input>
        </el-form-item>
        <el-form-item :label="l.status">
          <el-select v-model="query.queryString.status" class="filter-item" clearable @change="getBannerList">
            <el-option :label="l.enabled" :value="1"></el-option>
            <el-option :label="l.disabled" :value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="getBannerList">{{l.search}}</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="addBanner">{{l.addBanner}}</el-button>
      </div>
    </div>
    <div class="banner-content">
      <el-table :data="bannerList">
        <el-table-column :label="l.cover">
          <template slot-scope="v">
            <img style="width: 200px;height: 100px;" :src="api.baseUrl+'/'+v.row.file_url" />
          </template>
        </el-table-column>
        <el-table-column :label="l.name" prop="name"></el-table-column>
        <el-table-column :label="l.description" prop="description"></el-table-column>
        <el-table-column :label="l.jumpLink" prop="link">
          <template slot-scope="v">
            {{v.row.link||l.noJump}}
          </template>
        </el-table-column>
        <el-table-column :label="l.status" prop="status">
          <template slot-scope="v">
            {{v.row.status==1?l.enabled:l.disabled}}
          </template>
        </el-table-column>
        <el-table-column :label="l.modify_time" prop="modify_time"></el-table-column>
        <el-table-column :label="l.modify_user" prop="modify_user"></el-table-column>
        <el-table-column :label="l.operation" fixed="right">
          <template slot-scope="v">
            <a href="#" class="text-blue" @click.prevent="editItem(v.row)">{{l.edit}}</a>&nbsp;
            <a href="#" class="text-red" @click.prevent="deleteItem(v.row)">{{l.delete}}</a>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="query.page"
        :page-sizes="[5,10, 15, 30, 50,100]" :page-size="query.size" layout="total, sizes, prev, pager, next, jumper"
        :total="total" style="float: right;">
      </el-pagination>
    </div>

    <el-drawer class="drawer-container" :visible.sync="showObj.bannerShow" :wrapperClosable='false' size="40%">
      <div slot='title' class="title">{{l.bannerManagement}}</div>
      <div class="form-container">
        <div class="form">
          <el-form label-width="60px" size="medium">
            <el-form-item :label="l.cover" v-if="form.id==''">
              <div v-if="coverObj.imageUrl==''" class="cover">
                <div class="plus-icon" @click="coverSelect('upload')">
                  <i class="el-icon-upload" style="font-size: 30px;"></i>
                  <div>
                    {{l.select}}
                  </div>
                </div>
              </div>
              <div v-else class="cover">
                <img class="auto-img" :src="coverObj.imageUrl" height="150px" />
                <div class="cover-oprate">
                  <i class="el-icon-zoom-in iconZoom" @click="coverPreview(coverObj.imageUrl)" :alt='l.preview'></i>
                  <i class="el-icon-folder-opened iconZoom" @click="coverSelect('upload')"></i>
                </div>
              </div>
            </el-form-item>
            <el-form-item :label="l.cover" v-else>
              <div class="cover">
                <img class="auto-img" :src="form.file[0]" height="150px" />
              </div>
            </el-form-item>
            <el-form-item :label="l.name">
              <el-input v-model="form.name" requird></el-input>
            </el-form-item>
            <el-form-item :label="l.description">
              <el-input v-model="form.description"></el-input>
            </el-form-item>
            <el-form-item :label="l.jumpLink">
              <el-select v-model="targetObj.type" style="width: 100%;">
                <el-option :label="l.noJump" value=""></el-option>
                <el-option :label="l.topicName" value="topic"></el-option>
                <el-option :label="l.course" value="course"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="l.target" v-show="targetObj.type!=''">
              <el-input v-model="targetObj.label" disabled>
                <template slot="append">
                  <el-button @click="openSelectTarget" style="background-color: #67C23A;color: white;">{{l.select}}</el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item :label="l.status">
              <el-select v-model="form.status" style="width: 100%;">
                <el-option :label="l.enabled" :value="1"></el-option>
                <el-option :label="l.disabled" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="l.bannerTiming">
              <el-select v-model="form.autopz" style="width: 100%;">
                <el-option :label="l.yes" value="Y"></el-option>
                <el-option :label="l.no" value="N"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="l.bannerStartTime" v-show="form.autopz=='Y'">
              <el-date-picker v-model="form.begdate" type="datetime" :placeholder="l.select"
                style="width: 100%;"></el-date-picker>
            </el-form-item>
            <el-form-item :label="l.bannerEndTime" v-show="form.autopz=='Y'">
              <el-date-picker v-model="form.enddate" type="datetime" :placeholder="l.select"
                style="width: 100%;"></el-date-picker>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="buttonBar">
        <el-button type="primary" @click="handleSubmit">{{l.submit}}</el-button>
        <el-button type="danger" @click="showObj.bannerShow = false">{{l.close}}</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted, onBeforeUnmount, getCurrentInstance, nextTick } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import api from '@/api'
import { useLocalI18n } from '@/composables/useLocalI18n'
import store from '@/store'
import zTable from '@/views/_common/Table.vue'

const instance = getCurrentInstance()
const { $request, $message, $confirm } = instance.proxy
const route = instance.proxy.$route
const router = instance.proxy.$router
const { l, c } = useLocalI18n('videoAdminBanner')
const queryClient = useQueryClient()

// State
const coverInput = ref(null)

const coverObj = reactive({
  dialogImageUrl: "",
  imageUrl: "",
  file: {
    name: ''
  },
})

const showObj = reactive({
  bannerShow: false,
  coverDialog: false,
  course: false,
  topic: false,
  calculateMaxheight: 500
})

const targetObj = reactive({
  label: '',
  type: '',
  target_id: '',
})

const publicCodeObj = computed(() => {
  return {
    collegeList: collegeListData.value ? collegeListData.value.data : []
  }
})

const topicObj = reactive({
  query: {
    web_page: "",
    college_id: "",
    type: "",
    page: 1,
    pageSize: 15,
    is_valid: "Y"
  },
  list: [],
  total: 0,
})

const courseObj = reactive({
  query: {
    page: 1,
    pageSize: 10,
    college_id: "",
    is_public: "",
    name: "",
    is_his: 0
  },
  total: 0,
  list: [],
  selectedList: []
})

const query = reactive({
  queryString: {
    str: '',
    status: 1
  },
  type: 'VIDEO',
  size: 15,
  page: 1,
})

const form = reactive({
  id: '',
  link: '',
  empnopz: "N",
  orgidpz: "N",
  deptnopz: "N",
  otherspz: "N",
  status: "1",
  autopz: "N",
  name: "",
  description: "",
  type: "VIDEO",
  begdate: "",
  enddate: ""
})

const bannerList = ref([])
const total = ref(0)

const isAdmin = computed(() => {
  return store.getters.isAdmin
})

// Queries
const { data: collegeListData, refetch: refetchCollege } = useQuery({
  queryKey: ['collegeList', route.path],
  queryFn: () => $request(api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
    resource_path: route.path
  })
})

watch(() => publicCodeObj.value.collegeList, (newVal) => {
  if (newVal) {
    if(newVal.length > 0) {
        topicObj.query.college_id = newVal[0].id
        courseObj.query.college_id = newVal[0].id
    }
  }
})

const { data: bannerListData, refetch: refetchBannerList } = useQuery({
  queryKey: ['bannerList', query],
  queryFn: () => $request(api.baseUrl + '/Platform/banner/getList', query),
  enabled: false
})

watch(() => bannerListData.value, (newVal) => {
  if (newVal) {
    bannerList.value = newVal.data.list
    total.value = newVal.data.total
  }
})

const { data: topicListData, refetch: refetchTopicList } = useQuery({
  queryKey: ['topicList', topicObj.query],
  queryFn: () => $request(api.videoServer + "/Video/VideoPageTag/getlist", topicObj.query),
  enabled: false
})

watch(() => topicListData.value, (newVal) => {
  if (newVal) {
    topicObj.list = newVal.data.list
    topicObj.total = newVal.data.total
    if (newVal.data.total == 0) {
      // Logic for empty topic list if needed
    }
  }
})

const { data: courseListData, refetch: refetchCourseList } = useQuery({
  queryKey: ['courseList', courseObj.query],
  queryFn: () => $request(api.videoServer + '/Video/VideoCourseCatalog/getCourseList', courseObj.query, 'post'),
  enabled: false
})

watch(() => courseListData.value, (newVal) => {
  if (newVal) {
    courseObj.list = newVal.data.list
    courseObj.total = newVal.data.total
  }
})

// Mutations
const deleteBannerMutation = useMutation({
  mutationFn: (id) => $request(api.baseUrl + '/Platform/banner/delete/' + id, {}, "post"),
  onSuccess: () => {
    refetchBannerList()
  }
})

const createOrModifyBannerMutation = useMutation({
  mutationFn: (formData) => $request(api.baseUrl + '/Platform/banner/createormodify', formData, 'post'),
  onSuccess: () => {
    $message.success(l.success)
    showObj.bannerShow = false
    refetchBannerList()
  }
})


// Functions

const openSelectTarget = () => {
  showObj[targetObj.type] = true
}

const getCourseList = () => {
  refetchCourseList()
}

const handleCourseSizeChange = (i) => {
  courseObj.query.page = 1
  courseObj.query.pageSize = i
  refetchCourseList()
}

const handleCoursePageChange = (i) => {
  courseObj.query.page = i
  refetchCourseList()
}

const toPlay = (id) => {
  let routeUrl = router.resolve({
    name: 'play',
    query: {
      course_primary_id: id
    },
  }).href
  window.open(routeUrl, '_blank')
}

const selectCourse = (row) => {
  targetObj.label = row.name_label
  targetObj.target_id = row.id
  showObj[targetObj.type] = false
}

const selectTopic = (row) => {
  targetObj.label = row.title_label
  targetObj.target_id = row.id
  showObj[targetObj.type] = false
}

const getTopicList = () => {
  refetchTopicList()
}

const handleTopicSizeChange = (i) => {
  topicObj.query.page = 1
  topicObj.query.pageSize = i
  refetchTopicList()
}

const handleTopicPageChange = (i) => {
  topicObj.query.page = i
  refetchTopicList()
}

const handleSizeChange = (i) => {
  query.page = 1
  query.size = i
  refetchBannerList()
}

const handlePageChange = (i) => {
  query.page = i
  refetchBannerList()
}

const coverSelect = (filed) => {
  coverInput.value.click()
}

const coverPreview = (url) => {
  if (!url) return
  coverObj.dialogImageUrl = url
  showObj.coverDialog = true
}

const uploadCoverChange = (e) => {
  let file = e.target.files[0]
  if (!file) return;
  let reader = new FileReader();
  reader.onload = (r) => {
    coverObj.imageUrl = r.target.result;
  };
  reader.readAsDataURL(file);
  coverObj.file = file
}

const getBannerList = () => {
  refetchBannerList()
}

const editItem = (i) => {
  if (i.link) {
    let type = i.link.split('=')[0]
    let id = i.link.split('=')[1]
    if (type.includes('course')) {
      $request(api.videoServer + "/Video/VideoCourseCatalog/getCourseList", {
        page: 1,
        pageSize: 15,
        id: id,
        is_his: 0
      }, 'post').then(r => {
        if (r.data.list.length > 0) {
          let data = r.data.list[0]
          targetObj.type = 'course'
          targetObj.label = data.name_label
          targetObj.target_id = data.id
          getBannerInfo(i)
        }
      })
    } else if (type.includes('topic')) {
      $request(api.videoServer + '/Video/VideoPageTag/getlist', {
          id: id,
          page: 1,
          pageSize: 10
        })
        .then(r => {
          if (r.status && r.data.total > 0) {
            let data = r.data.list[0]
            targetObj.type = 'topic'
            targetObj.label = data.title_label
            targetObj.target_id = data.id
            getBannerInfo(i)
          }
        })
    } else {
        targetObj.type = ''
        targetObj.label = ''
        targetObj.target_id = ''
        getBannerInfo(i)
    }
  } else {
    targetObj.type = ''
    targetObj.label = ''
    targetObj.target_id = ''
    getBannerInfo(i)
  }
}

const getBannerInfo = (i) => {
  $request(api.baseUrl + '/Platform/banner/getbyid', {
      id: i.id
    })
    .then(r => {
      Object.assign(form, r.data)
      showObj.bannerShow = true
    })
    .catch(() => {})
}

const deleteItem = (v) => {
  $confirm(l.deleteConfirm, l.confirm, {
      confirmButtonText: l.confirm,
      cancelButtonText: l.cancel,
      type: 'warning',
    })
    .then(() => {
      deleteBannerMutation.mutate(v.id)
    })
    .catch(() => {
      $message.info(l.deleteCanceled)
    })
}

const addBanner = () => {
  coverObj.dialogImageUrl = ""
  coverObj.imageUrl = ""
  coverObj.file = { name: '' }

  targetObj.label = ""
  targetObj.type = ''
  targetObj.target_id = ''

  Object.assign(form, {
    id: '',
    link: '',
    empnopz: "N",
    orgidpz: "N",
    deptnopz: "N",
    otherspz: "N",
    status: 1,
    autopz: "N",
    name: "",
    description: "",
    type: "VIDEO",
    begdate: "",
    enddate: ""
  })

  if(coverInput.value) coverInput.value.value = ''
  showObj.bannerShow = true
}

const handleSubmit = () => {
  if (form.name == '') {
    return $message.error(l.nameRequired)
  }
  if (form.description == '') {
    return $message.error(l.descriptionRequired)
  }
  if (coverObj.file == '' && form.id == '') {
    return $message.error(l.coverRequired)
  }
  if (form.autopz == 'Y') {
    if (form.begdate == '' || form.enddate == '') {
      return $message.error(l.timeRangeRequired)
    }
  }

  if (targetObj.type == 'topic') {
    form.link = `topic=${targetObj.target_id}`
  } else if (targetObj.type == 'course') {
    form.link = `course=${targetObj.target_id}`
  } else if (targetObj.type == '') {
    form.link = ''
  }

  let formData = new FormData();
  if (form.id) {
    if(form.file) formData.append('file[]', form.file)
  }

  if (coverObj.file && coverObj.file.name) {
      formData.append('file[]', coverObj.file)
  } else if (form.id && form.file) {
      formData.append('file[]', form.file)
  } else {
       formData.append('file[]', coverObj.file)
  }

  formData.append('model', JSON.stringify(form))
  createOrModifyBannerMutation.mutate(formData)
}

const getCollegeList = () => {
  refetchCollege()
}

const returnMaxheight = () => {
  showObj.calculateMaxheight = window.innerHeight - 160
}

onMounted(() => {
  getCollegeList()
  getBannerList()

  window.addEventListener('resize', returnMaxheight);
  nextTick(() => {
    returnMaxheight()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', returnMaxheight);
})
</script>

<style scoped>
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

  .banner-container {
    width: 100%;
    height: 100%;
  }

  .banner-container .drawer-container .title {
    padding: 20px 0px;
    font-size: 18px;
    font-weight: 600;
    border-bottom: 1px solid #ccc;
  }

  .banner-container .drawer-container .form-container {
    width: 90%;
    height: 90%;
    margin: 0 auto;
    background-color: #fff;
  }

  .banner-container .drawer-container .form-container .cover {
    position: relative;
    width: 260px;
    height: 150px;
    display: flex;
    align-items: center;
  }

  .banner-container .drawer-container .form-container .cover .auto-img {
    position: relative;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    max-width: 100%;
    max-height: 100%;
    cursor: pointer;
  }

  .banner-container .drawer-container .form-container .cover:hover .cover-oprate {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    background-color: rgba(167, 167, 167, 0.7);
    color: white;
    font-size: 30px;
  }

  .banner-container .drawer-container .form-container .cover .plus-icon {
    width: 140px;
    height: 140px;
    border: 2px dotted #ccc;
    border-radius: 5px;
    color: #999;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
  }

  .banner-container .drawer-container .form-container .cover .plus-icon:hover {
    color: #409fee;
  }

  .banner-container .drawer-container .form-container .cover .cover-oprate {
    display: none;
  }

  .banner-container .drawer-container .buttonBar {
    width: 100%;
    height: 60px;
    margin: 0 auto;
    padding: 0 25px;
    position: absolute;
    bottom: 0px;
    border-top: 1px solid #ccc;
    float: right;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }

  .banner-container .banner-filter {
    width: 100%;
    height: 60px;
    padding: 14px;
    border-bottom: 1px #ddd solid;
    display: flex;
    justify-content: space-between;
    background-color: white;
  }
</style>
