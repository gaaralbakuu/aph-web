<template>
  <div class="banner-container">

    <el-dialog v-model:visible="showObj.topic" @open='getTopicList' width="60%" :title="l.topicDialogTitle">
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
            <template #default="scope">
              <el-button type='text' @click="selectTopic(scope.row)">{{l.edit}}</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination @size-change="handleTopicSizeChange" @current-change="handleTopicPageChange"
          :current-page="topicObj.query.page" :page-sizes="[5,10, 15, 30, 50,100]" :page-size="topicObj.query.pageSize"
          layout="total, sizes, prev, pager, next, jumper" :total="topicObj.total" style="float: right;">
        </el-pagination>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button style="width: 8em;" type="primary" plain @click="showObj.topic = false">{{l.close}}</el-button>
        </div>
      </template>
    </el-dialog>

    <el-dialog v-model:visible="showObj.course" @open='getCourseList' width="60%" :title="l.addToTopic">
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
              @keyup.enter="getCourseList"></el-input>
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
            <template #default="scope">
              <div class="img" v-if="scope.row.thumbnail_path">
                <img class="auto-img" :src="$api.baseUrl+'/'+ scope.row.thumbnail_path" />
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
            <template #default="scope">
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
      <template #footer>
        <div class="dialog-footer">
          <el-button style="width: 8em;" type="primary" plain @click="showObj.course = false">{{l.close}}</el-button>
        </div>
      </template>
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
          <template #default="v">
            <img style="width: 200px;height: 100px;" :src="$api.baseUrl+'/'+v.row.file_url" />
          </template>
        </el-table-column>
        <el-table-column :label="l.name" prop="name"></el-table-column>
        <el-table-column :label="l.description" prop="description"></el-table-column>
        <el-table-column :label="l.jumpLink" prop="link">
          <template #default="v">
            {{v.row.link||l.noJump}}
          </template>
        </el-table-column>
        <el-table-column :label="l.status" prop="status">
          <template #default="v">
            {{v.row.status==1?l.enabled:l.disabled}}
          </template>
        </el-table-column>
        <el-table-column :label="l.modify_time" prop="modify_time"></el-table-column>
        <el-table-column :label="l.modify_user" prop="modify_user"></el-table-column>
        <el-table-column :label="l.operation" fixed="right">
          <template #default="v">
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

    <el-drawer class="drawer-container" v-model:visible="showObj.bannerShow" :wrapperClosable='false' size="40%">
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
                <template #append>
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
import { reactive, ref, computed, onMounted, onBeforeUnmount, getCurrentInstance, nextTick } from 'vue'
import { zTable } from '@/views/_common'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { l, c } = useLocalI18n('videoAdminBanner')
const { proxy } = getCurrentInstance()
const isAdmin = computed(() => proxy.$store.getters.isAdmin)

// Refs
const coverInput = ref(null)

// Data
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

const publicCodeObj = reactive({
  collegeList: [],
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
  enddate: "",
  file: []
})

const bannerList = ref([])
const total = ref(0)

// Methods
const openSelectTarget = () => {
  showObj[targetObj.type] = true
}

const getCourseList = () => {
  proxy.$request(proxy.$api.videoServer + '/Video/VideoCourseCatalog/getCourseList', courseObj.query, 'post')
    .then(r => {
      courseObj.list = r.data.list
      courseObj.total = r.data.total
    })
    .catch(e => {
      console.log(e);
    })
}

const handleCourseSizeChange = (i) => {
  courseObj.query.page = 1
  courseObj.query.pageSize = i
  getCourseList()
}

const handleCoursePageChange = (i) => {
  courseObj.query.page = i
  getCourseList()
}

const toPlay = (id) => {
  let routeUrl = proxy.$router.resolve({
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
  proxy.$request(proxy.$api.videoServer + "/Video/VideoPageTag/getlist", topicObj.query)
    .then(r => {
      topicObj.list = r.data.list
      topicObj.total = r.data.total
    })
}

const handleTopicSizeChange = (i) => {
  topicObj.query.page = 1
  topicObj.query.pageSize = i
  getTopicList()
}

const handleTopicPageChange = (i) => {
  topicObj.query.page = i
  getTopicList()
}

const handleSizeChange = (i) => {
  query.page = 1
  query.size = i
  getBannerList()
}

const handlePageChange = (i) => {
  query.page = i
  getBannerList()
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
  proxy.$request(proxy.$api.baseUrl + '/Platform/banner/getList', query)
    .then(r => {
      bannerList.value = r.data.list
      total.value = r.data.total
    })
}

const editItem = (i) => {
  if (i.link) {
    let type = i.link.split('=')[0]
    let id = i.link.split('=')[1]
    if (type.includes('course')) {
      proxy.$request(proxy.$api.videoServer + "/Video/VideoCourseCatalog/getCourseList", {
        page: 1,
        pageSize: 15,
        id: id,
        is_his: 0
      }, 'post').then(r => {
        if (r.data.list.length > 0) {
          let data = r.data.list[0]
          Object.assign(targetObj, {
            type: 'course',
            label: data.name_label,
            target_id: data.id
          })
          getBannerInfo(i)
        }
      })
    } else if (type.includes('topic')) {
      proxy.$request(proxy.$api.videoServer + '/Video/VideoPageTag/getlist', {
          id: id,
          page: 1,
          pageSize: 10
        })
        .then(r => {
          if (r.status && r.data.total > 0) {
            let data = r.data.list[0]
            Object.assign(targetObj, {
              type: 'topic',
              label: data.title_label,
              target_id: data.id
            })
            getBannerInfo(i)
          }
        })
    }
  } else {
    Object.assign(targetObj, {
      type: '',
      label: '',
      target_id: ''
    })
    getBannerInfo(i)
  }
}

const getBannerInfo = (i) => {
  proxy.$request(proxy.$api.baseUrl + '/Platform/banner/getbyid', {
      id: i.id
    })
    .then(r => {
      Object.assign(form, r.data)
      // Ensure file array if string or single val
      if (!Array.isArray(form.file)) {
         form.file = [form.file]
      }
      showObj.bannerShow = true
    })
    .catch(() => {

    })
}

const deleteItem = (v) => {
  proxy.$confirm(l.value.deleteConfirm, l.value.confirm, {
      confirmButtonText: l.value.confirm,
      cancelButtonText: l.value.cancel,
      type: 'warning',
    })
    .then(() => {
      proxy.$request(proxy.$api.baseUrl + '/Platform/banner/delete/' + v.id, {}, "post")
        .then(r => {
          console.log(r);
          getBannerList()
        })
        .catch(() => {

        })
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: l.value.deleteCanceled,
      })
    })
}

const addBanner = () => {
  Object.assign(coverObj, {
      dialogImageUrl: "",
      imageUrl: "",
      file: {
        name: ''
      },
    })
    Object.assign(targetObj, {
      label: "",
      type: '',
      target_id: '',
    })
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
    enddate: "",
    file: []
  })
  if(coverInput.value) coverInput.value.value = ''
  showObj.bannerShow = true
}

const handleSubmit = () => {
  if (form.name == '') {
    return proxy.$message.error(l.value.nameRequired)
  }
  if (form.description == '') {
    return proxy.$message.error(l.value.descriptionRequired)
  }
  if (coverObj.file == '' && form.id == '') {
    return proxy.$message.error(l.value.coverRequired)
  }
  if (form.autopz == 'Y') {
    if (form.begdate == '' || form.enddate == '') {
      return proxy.$message.error(l.value.timeRangeRequired)
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
    // If updating, might not have new file, handle accordingly or backend handles it
    // Original logic:
    // if (this.form.id) { formData.append('file[]', this.form.file) }
    // But form.file comes from API as URL usually?
    // Assuming backend handles it if we don't send file, or we send existing URL.
    // If coverObj.file has new file, append it.
    if(coverObj.file && coverObj.file.name) {
       formData.append('file[]', coverObj.file)
    } else {
       // Append existing if needed or let backend handle update without file change
       // Original code: formData.append('file[]', this.form.file)
       // This seems risky if form.file is an array of URLs.
       // Let's assume coverObj is the source of truth for NEW files.
       // If no new file, maybe we don't append file[]?
       // Replicating original logic strictly:
       formData.append('file[]', form.file)
    }
  } else {
    formData.append('file[]', coverObj.file)
  }
  formData.append('model', JSON.stringify(form))
  proxy.$request(proxy.$api.baseUrl + '/Platform/banner/createormodify', formData, 'post')
    .then((r) => {
      proxy.$message({
        message: l.value.success,
        type: 'success',
      })
      showObj.bannerShow = false
      getBannerList()
    })
    .catch((e) => {
      console.log(e);
    })
}

const getCollegeList = () => {
  proxy.$request(proxy.$api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
      resource_path: proxy.$route.path
    })
    .then((r) => {
      publicCodeObj.collegeList = r.data

      topicObj.query.college_id = publicCodeObj.collegeList[0].id
      courseObj.query.college_id = publicCodeObj.collegeList[0].id

    })
    .catch((e) => {
      proxy.$message.error(e.message)
    })
}

const returnMaxheight = () => {
  showObj.calculateMaxheight = window.innerHeight - 160
}

onMounted(() => {
  getCollegeList()
  getBannerList()

  window.addEventListener('resize', returnMaxheight);
  nextTick(()=>{
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
