<template>
  <div class="trainingManage-container">
    <div class="component">
      <input ref="coverInput" type="file" @change="uploadCoverChange" style="display: none;" accept="image/*" />

      <el-dialog :visible.sync="showObj.coverDialog" :title="l.preview">
        <img width="100%" :src="coverObj.dialogImageUrl" alt="" fit='fill'>
      </el-dialog>

      <!-- 选择考试dialog -->
      <el-dialog :visible.sync="showObj.selectExam" @open='getExamList' :title="l.bindExam" width="75%">
        <div class="examSelect-dialog">
          <el-form inline label-width="60px">
            <el-form-item :label="l.collegeFilter">
              <el-select v-model="examObj.query.college_id" @change="getExamList">
                <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                  :value="i.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="l.titleFilter">
              <el-input v-model="examObj.query.name"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" plain @click="selectMultipleItemToDetail">{{l.batchAdd}}</el-button>
              <el-button type="success" @click="getExamList">{{ l.search }}</el-button>
            </el-form-item>
          </el-form>

          <a-table ref="examDialogTable" :dataSource="examObj.list" bordered :scroll="{ y: cssObj.tableMaxHeight }" :rowSelection="{ onChange: examSelectionChange }" :rowKey="record => record.id" :pagination="false">
            <a-table-column :title="l.serialNumber" width="50">
              <template #default="{ index }">
                {{ index + 1 }}
              </template>
            </a-table-column>
            <a-table-column :title="l.examName" dataIndex="name_label"></a-table-column>
            <a-table-column :title="l.passingScore" dataIndex="pass_score"></a-table-column>
            <a-table-column :title="l.maxAttempts" dataIndex="max_reply_num"></a-table-column>
            <a-table-column :title="l.examDuration" dataIndex="test_duration"></a-table-column>
            <a-table-column :title="l.startTime" dataIndex="start_time"></a-table-column>
            <a-table-column :title="l.endTime" dataIndex="end_time"></a-table-column>
            <a-table-column :title="l.enableStatus" dataIndex="is_valid"></a-table-column>
            <a-table-column :title="l.actions" fixed="right" :width="200">
              <template #default="{ record }">
                <a-button type="link" style="color: green;" @click="previewDetail(record)">{{l.preview}}</a-button>
                <a-button type="link" @click="selectItemToDetail(record)">{{l.select}}</a-button>
              </template>
            </a-table-column>
          </a-table>
        </div>
      </el-dialog>

      <el-dialog :visible.sync="showObj.selectCourse" :title="l.addCourse" width="75%" @open='getCourseList'
        class="lessonList-dialog">
        <el-form inline>
          <el-form-item :label="l.college">
            <el-select v-model="courseObj.query.college_id" @change="getCourseList" clearable>
              <el-option :label="l.publicCourses" value=""></el-option>
              <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="l.name">
            <el-input v-model="courseObj.query.name" clearable @clear='getCourseList'
              @keyup.native.enter="getCourseList"></el-input>
          </el-form-item>
          <el-form-item :label="l.status">
            <div class="frcc">
              <el-select v-model="courseObj.query.is_valid" @change="getCourseList" style="width: 100px;">
                <el-option :label="l.all" value=""></el-option>
                <el-option :label="l.enable" value="Y"></el-option>
                <el-option :label="l.disable" value="N"></el-option>
              </el-select>
              <el-button type="success" @click="getCourseList" style="margin-left:20px ;">{{l.search}}</el-button>
              <el-button type="primary" plain @click="selectMultipleItemToDetail"
                style="margin-left:20px ;">{{l.batchAdd}}</el-button>
            </div>
          </el-form-item>
        </el-form>
        <a-table ref="courseDialogTable" :dataSource="courseObj.list" bordered :scroll="{ y: cssObj.tableMaxHeight }" :custom-row="() => ({ style: { height: '100px', fontSize: '14px' } })" :rowSelection="{ onChange: courseSelectionChange }" :rowKey="record => record.id" :pagination="false">
          <a-table-column :title="l.serialNumber" width="50">
            <template #default="{ index }">
              {{ index + 1 }}
            </template>
          </a-table-column>
          <a-table-column :title="l.cover">
            <template #default="{ record }">
              <div class="img" v-if="record.thumbnail_path">
                <img class="auto-img" @click="coverPreview(api.videoServer+'/'+ record.thumbnail_path)"
                  :src="api.videoServer+'/'+ record.thumbnail_path" />
              </div>
              <div v-else style="text-align: center;width: 100%;">
                <i class="el-icon-picture-outline" style="font-size: 60px;"></i>
                <div>{{l.noCover}}</div>
              </div>
            </template>
          </a-table-column>
          <a-table-column :title="l.courseName" dataIndex="name_zh"></a-table-column>
          <a-table-column :title="l.courseDescription" dataIndex="description" :ellipsis="true"></a-table-column>
          <a-table-column :title="l.affiliation" dataIndex="org_id"></a-table-column>
          <a-table-column :title="l.courseCredit" dataIndex="score"></a-table-column>
          <a-table-column :title="l.status" dataIndex="is_valid"></a-table-column>
          <a-table-column :title="l.actions" fixed="right" :width="200">
            <template #default="{ record }">
              <a-button type="link" @click="selectItemToDetail(record)">{{l.add}}</a-button>
            </template>
          </a-table-column>
        </a-table>
        <div class="lessonList-pagenation">
          <el-pagination @size-change="courseHandleSizeChange" @current-change="courseHandlePageChange"
            :current-page="courseObj.query.page" :page-sizes="[5,10, 15, 30, 50,100]"
            :page-size="courseObj.query.pageSize" layout="total, sizes, prev, pager, next, jumper"
            :total="courseObj.total" style="float: right;">
          </el-pagination>
        </div>
      </el-dialog>

      <!-- 新增或修改培训班以及配套资源 -->
      <el-drawer class="drawer-container" direction='btt' :visible.sync="showObj.trainingShow" :wrapperClosable='false'
        size="92%">
        <div slot='title' class="title">{{l.manageTraining}}</div>
        <el-tabs ref='tabs' type="border-card" class="form-container" @tab-click="swiperTab"
          v-model="showObj.activeTabName">
          <el-tab-pane :label="l.basicInfo" name="data">
            <el-form label-width="80px" size="medium">
              <el-form-item :label="l.cover" required v-if="trainingObj.form.id">
                <div class="modifyCover">
                  <div class="cover">
                    <img class="auto-img" :src="api.videoServer+'/'+ trainingObj.form.oldthumbnail_path" height="150px" />
                    <div class="cover-oprate">
                      <i class="el-icon-zoom-in iconZoom"
                        @click="coverPreview(api.videoServer+'/'+ trainingObj.form.oldthumbnail_path)"></i>
                    </div>
                  </div>
                  <div class="change"><i class="el-icon-right"></i></div>
                  <div>
                    <div v-if="coverObj.imageUrl==''" class="cover">
                      <div class="plus-icon" @click="coverSelect('upload')">
                        <i class="el-icon-upload" style="font-size: 30px;"></i>
                        <div>
                          {{l.selectNewCover}}
                        </div>
                      </div>
                    </div>
                    <div v-else class="cover">
                      <img class="auto-img" :src="coverObj.imageUrl" height="150px" />
                      <div class="cover-oprate">
                        <i class="el-icon-zoom-in iconZoom" @click="coverPreview(coverObj.imageUrl)"></i>
                        <i class="el-icon-folder-opened iconRefresh" @click="coverSelect('upload')"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </el-form-item>
              <el-form-item :label="l.cover" required v-else>
                <div v-if="coverObj.imageUrl==''" class="cover">
                  <div class="plus-icon" @click="coverSelect('upload')">
                    <i class="el-icon-upload" style="font-size: 30px;"></i>
                    <div>
                      {{l.selectCover}}
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
              <el-row :gutter="24">
                <el-col :span='12'>
                  <el-form-item :label="l.startTime" required>
                    <el-date-picker v-model="trainingObj.form.start_date" type="datetime" :placeholder="l.startTime"
                      style="width: 100%;">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span='12'>
                  <el-form-item :label="l.endTime" required>
                    <el-date-picker v-model="trainingObj.form.end_date" type="datetime" :placeholder="l.endTime"
                      style="width: 100%;">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span='12'>
                  <el-form-item :label="l.belongingCollege" required>
                    <el-select v-model="trainingObj.form.college_id" :placeholder="l.selectCollege" style="width: 100%;">
                      <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                        :value="i.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span='12'>
                  <el-form-item :label="l.participants" required>
                    <el-input v-model.number="trainingObj.form.person_num"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item :label="l.simplifiedTitle" required>
                <el-input v-model="trainingObj.form.name_zh" requird></el-input>
              </el-form-item>
              <el-form-item :label="l.traditionalTitle">
                <el-input v-model="trainingObj.form.name_tw"></el-input>
              </el-form-item>
              <el-form-item :label="l.englishTitle">
                <el-input v-model="trainingObj.form.name_en"></el-input>
              </el-form-item>
              <el-form-item :label="l.vietnameseTitle">
                <el-input v-model="trainingObj.form.name_vi"></el-input>
              </el-form-item>
              <el-form-item :label="l.description" required>
                <el-input v-model="trainingObj.form.description" type="textarea" :rows="4"></el-input>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane :label="l.resources" name='detail'>
            <div style="float: right;margin-bottom: 10px;">
              <el-button type="primary" plain @click="showObj.selectCourse = true">{{l.addCourse}}</el-button>
              <el-button type="success" plain @click="showObj.selectExam = true">{{l.addExam}}</el-button>
              <el-button type="danger" plain @click="removeMultipleItemFormDetail">{{l.batchRemove}}</el-button>
            </div>
            <a-table ref="detailTable" class="draggable-table-detail" :dataSource="tableObj.detail" rowKey='bind_id' bordered :scroll="{ y: cssObj.tableMaxHeight }" :custom-row="() => ({ style: { height: '90px', fontSize: '14px' } })" :rowSelection="{ onChange: detailSelectionChange }" :pagination="false">
              <a-table-column :title="l.name" dataIndex="name_label">
              </a-table-column>
              <a-table-column :title="l.type">
                <template #default="{ record }">
                  {{record.type==1?l.exam:l.courseName}}
                </template>
              </a-table-column>
              <a-table-column :title="l.required">
                <template #default="{ record }">
                  <a-switch v-model:checked="record.is_must" :checked-value="1" :un-checked-value="0">
                  </a-switch>
                </template>
              </a-table-column>
              <a-table-column :title="l.actions" fixed="right" :width="200">
                <template #default="{ record, index }">
                  <a-button type="link" style="color: green;" @click="previewDetail(record)">{{l.preview}}</a-button>
                  <a-button type="link" style="color: red;" @click="removeItemFormDetail(index)">{{l.remove}}</a-button>
                </template>
              </a-table-column>
            </a-table>
          </el-tab-pane>
        </el-tabs>

        <div class="buttonBar">
          <el-button type="primary" @click="handleSubmit">{{l.submit}}</el-button>
          <el-button type="danger" @click="showObj.trainingShow = false">{{l.close}}</el-button>
        </div>
      </el-drawer>
    </div>

    <div class="pageBody">
      <div class="pageBody-filter">
        <el-form inline>
          <el-form-item :label="l.college">
            <el-select v-model="trainingObj.query.college_id" :placeholder="l.publicResources" @change="getTrainingList"
              :clearable="isAdmin">
              <el-option v-if="isAdmin" :label="l.allColleges" value=""></el-option>
              <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="l.name">
            <el-input v-model="trainingObj.query.name" clearable @clear='getTrainingList'
              @keyup.native.enter="getTrainingList"></el-input>
          </el-form-item>
          <el-form-item :label="l.status">
            <el-select v-model="trainingObj.query.is_valid" @change="getTrainingList" style="width: 100px;">
              <el-option :label="l.all" value=""></el-option>
              <el-option :label="l.enable" value="Y"></el-option>
              <el-option :label="l.disable" value="N"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item> <el-button type="success" @click="getTrainingList">{{l.search}}</el-button></el-form-item>
        </el-form>
        <div>
          <el-button type="primary" @click="addTraining">{{l.createNew}}</el-button>
        </div>
      </div>

      <div class="tableContainer" ref="tableContainer">
        <a-table :dataSource='trainingObj.list' bordered :scroll="{ y: cssObj.tableMaxHeight }" :custom-row="() => ({ style: { height: '60px', fontSize: '14px' } })" :rowKey="record => record.id" :pagination="false">
          <a-table-column :title="l.serialNumber" width="50">
            <template #default="{ index }">
              {{ index + 1 }}
            </template>
          </a-table-column>
          <a-table-column :title="l.simplifiedTitle" dataIndex="name_zh"></a-table-column>
          <a-table-column :title="l.description" dataIndex="description"></a-table-column>
          <a-table-column :title="l.startTime" dataIndex="start_date"></a-table-column>
          <a-table-column :title="l.endTime" dataIndex="end_date"></a-table-column>
          <a-table-column :title="l.enableStatus" dataIndex="is_valid"></a-table-column>
          <a-table-column :title="l.actions" fixed="right" :width="250">
            <template #default="{ record }">
              <a-button type="link" @click="modifyTraining(record)">{{l.manage}}</a-button>
              <a-button v-if="record.is_valid=='N'" type="link" style="color: seagreen;" @click="modifyStatus(record)">{{l.enable}}</a-button>
              <a-button v-else type="link" style="color: red;" @click="modifyStatus(record)">{{l.disable}}</a-button>
            </template>
          </a-table-column>
        </a-table>
      </div>

      <div class="trainingManage-pagenation">
        <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
          :current-page="trainingObj.query.page" :page-sizes="[5,10, 15, 30, 50,100]"
          :page-size="trainingObj.query.pageSize" layout="total, sizes, prev, pager, next, jumper"
          :total="trainingObj.total" style="float: right;">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted, onBeforeUnmount, getCurrentInstance, nextTick } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import api from '@/api'
import { useLocalI18n } from '@/composables/useLocalI18n'
import store from '@/store'
import Sortable from 'sortablejs'
import _ from 'lodash'

const instance = getCurrentInstance()
const { $request, $message, $prompt } = instance.proxy
const route = instance.proxy.$route
const router = instance.proxy.$router
const { l, c } = useLocalI18n('videoAdminPlan')
const queryClient = useQueryClient()

// State
const coverInput = ref(null)

const coverObj = reactive({
  needUpload: false,
  dialogImageUrl: "",
  imageUrl: "",
  file: ""
})

const showObj = reactive({
  activeTabName: 'data',
  selectCourse: false,
  selectExam: false,
  trainingShow: false,
  coverDialog: false,
  initSortable: false
})

const cssObj = reactive({
  tableMaxHeight: '500px',
  headerRowStyle: {
    background: '#f2f4f9',
    color: '#505050',
    fontSize: '14px',
    height: '50px'
  }
})

const tableObj = reactive({
  detail: [],
  detailSelection: [],
  courseSelection: [],
  examSelection: [],
})

const publicCodeObj = reactive({
  collegeList: []
})

const trainingObj = reactive({
  query: {
    college_id: "",
    page: 1,
    pageSize: 10,
    name: "",
    is_valid: ''
  },
  form: {
    id: "",
    name_zh: "",
    name_en: "",
    name_vi: "",
    name_tw: "",
    college_id: "",
    thumbnail_path: '',
    oldthumbnail_path: '',
    description: "",
    person_num: "",
    start_date: "",
    end_date: "",
    detail: [],
    is_valid: "Y",
    rec_status: 1,
  },
  list: [],
  total: 0
})

const courseObj = reactive({
  query: {
    search_type: 1,
    catalog_id: "",
    college_id: "",
    name: "",
    description: "",
    tag_id: [],
    page: 1,
    pageSize: 10,
    is_valid: '',
    is_his: 0
  },
  total: 0,
  list: []
})

const examObj = reactive({
  query: {
    college_id: '',
    name: '',
    page: 1,
    pageSize: 12
  },
  total: 0,
  list: []
})

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

watch(() => collegeListData.value, (newVal) => {
  if (newVal) {
    publicCodeObj.collegeList = newVal.data
    if (!isAdmin.value && publicCodeObj.collegeList.length > 0) {
      trainingObj.query.college_id = publicCodeObj.collegeList[0].id
      examObj.query.college_id = publicCodeObj.collegeList[0].id
    }
    refetchTrainingList()
  }
})

const { data: trainingListData, refetch: refetchTrainingList } = useQuery({
  queryKey: ['trainingList', trainingObj.query],
  queryFn: () => $request(api.videoServer + '/Video/VideoTrain/getlist', trainingObj.query),
  enabled: false
})

watch(() => trainingListData.value, (newVal) => {
  if (newVal && newVal.httpCode == 200) {
    trainingObj.list = newVal.data.list
    trainingObj.total = newVal.data.total
    if (newVal.data.total == 0) {
      $message.info(l.noData)
    }
  }
})

const { data: examListData, refetch: refetchExamList } = useQuery({
  queryKey: ['examList', examObj.query],
  queryFn: () => $request(api.videoServer + '/Video/VideoExam/getExamList', examObj.query),
  enabled: false
})

watch(() => examListData.value, (newVal) => {
  if (newVal) {
    examObj.list = newVal.data.list
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
    courseObj.list = newVal.data.list
    courseObj.total = newVal.data.total
  }
})

// Mutations
const uploadCoverMutation = useMutation({
  mutationFn: (formData) => $request(api.videoServer + '/Video/VideoManage/uploadPicture', formData, 'post'),
  onSuccess: (r) => {
    if (r.httpCode == 200 && r.data.url) {
      trainingObj.form.thumbnail_path = r.data.url
      coverObj.needUpload = false
      coverObj.dialogImageUrl = ""
      coverObj.imageUrl = ""
      coverObj.file = ""
      if(coverInput.value) coverInput.value.value = ''
      submitTraining()
    }
  }
})

const submitTrainingMutation = useMutation({
  mutationFn: (data) => $request(api.videoServer + '/Video/VideoTrain/addOrModifyTrain', data, 'post'),
  onSuccess: (r) => {
    if (r.httpCode == 200) {
      $message.success(l.submitSuccess)
      showObj.trainingShow = false
      refetchTrainingList()
    }
  }
})

const modifyStatusMutation = useMutation({
  mutationFn: ({ key, value }) => $request(api.videoServer + '/Video/VideoTrain/ModifyTrainStatus', { key, value }, 'post'),
  onSuccess: () => {
    $message.success(l.operationSuccess)
    refetchTrainingList()
  }
})

// Functions
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
  coverObj.needUpload = true
}

const uploadCover = () => {
  let formData = new FormData();
  formData.append('formFile', coverObj.file);
  uploadCoverMutation.mutate(formData)
}

const previewDetail = async (i) => {
  if (i.type === '0' || i.type === 0) {
    let routeUrl = router.resolve({
      name: 'play',
      query: {
        course_primary_id: i.bind_id,
      }
    }).href;
    window.open(routeUrl, '_blank');
  } else {
    let questionnaire_id
    if (i.questionnaire_id) {
      questionnaire_id = i.questionnaire_id
    } else {
      let res = await $request(api.videoServer + '/Video/VideoExam/getExamList', {
        id: i.bind_id,
      })
      questionnaire_id = res.data.list[0].questionnaire_id
    }

    let url = router.resolve({
      name: 'examDetail',
      query: {
        train_id: "",
        course_id: '',
        exam_id: '',
        questionnaire_id: questionnaire_id,
        mode: 'preview'
      }
    }).href;
    window.open(url, '_blank');
  }
}

const getExamList = () => {
  refetchExamList()
}

const getCourseList = () => {
  refetchCourseList()
}

const selectItemToDetail = (data) => {
  if (tableObj.detail.some(i => i.bind_id === data.id)) {
    $message.error(l.examExists)
  } else {
    // We need to clone to avoid reactivity issues with the source list
    const newItem = { ...data }
    newItem.is_must = 0
    newItem.bind_id = newItem.id
    newItem.type = showObj.selectCourse ? 0 : 1
    newItem.id = ''
    tableObj.detail.push(newItem)
  }
}

const selectMultipleItemToDetail = () => {
  let selectCourse = showObj.selectCourse ? true : false
  let idSet = new Set(tableObj.detail.map(i => i.bind_id))

  if (selectCourse) {
    tableObj.courseSelection.forEach(i => {
      if (!idSet.has(i.id)) {
        const newItem = { ...i }
        newItem.is_must = 0
        newItem.type = 0
        newItem.bind_id = newItem.id
        newItem.id = ''
        tableObj.detail.push(newItem)
      }
    })
    instance.refs.courseDialogTable?.clearSelection();
    showObj.selectCourse = false
  } else {
    tableObj.examSelection.forEach(i => {
      if (!idSet.has(i.id)) {
        const newItem = { ...i }
        newItem.is_must = 0
        newItem.type = 1
        newItem.bind_id = newItem.id
        newItem.id = ''
        tableObj.detail.push(newItem)
      }
    })
    instance.refs.examDialogTable?.clearSelection();
    showObj.selectExam = false
  }
  $message.success(l.addedSuccess)
}

const removeItemFormDetail = (index) => {
  tableObj.detail.splice(index, 1)
}

const removeMultipleItemFormDetail = () => {
  let idsToDelete = tableObj.detailSelection.map(item => item.bind_id); // Using bind_id as key
  tableObj.detail = tableObj.detail.filter(item => !idsToDelete.includes(item.bind_id));
  instance.refs.detailTable?.clearSelection();
}

const courseSelectionChange = (selectedRowKeys, selectedRows) => {
  tableObj.courseSelection = selectedRows
}

const examSelectionChange = (selectedRowKeys, selectedRows) => {
  tableObj.examSelection = selectedRows
}

const detailSelectionChange = (selectedRowKeys, selectedRows) => {
  tableObj.detailSelection = selectedRows
}

const swiperTab = (v) => {
  if (v.name == 'detail') {
    if (showObj.initSortable == false) {
      nextTick(() => {
        const tbodyVideo = document.querySelector(".draggable-table-detail .ant-table-body tbody") || document.querySelector(".draggable-table-detail .ant-table-content tbody");
        if(tbodyVideo) {
           new Sortable(tbodyVideo, {
            animation: 150,
            onEnd: ({ newIndex, oldIndex }) => {
              let temp = _.cloneDeep(tableObj.detail)
              let targetRow = tableObj.detail[oldIndex];
              temp.splice(oldIndex, 1);
              temp.splice(newIndex, 0, targetRow);
              tableObj.detail = temp
            },
          });
          showObj.initSortable = true
        }
      })
    }
  }
}

const updateTableMaxHeight = () => {
  const container = instance.refs.tableContainer;
  if (container) {
    cssObj.tableMaxHeight = container.clientHeight + 'px';
  }
}

const handleSizeChange = (i) => {
  trainingObj.query.pageSize = i
  refetchTrainingList()
}

const handlePageChange = (i) => {
  trainingObj.query.page = i
  refetchTrainingList()
}

const courseHandleSizeChange = (i) => {
  courseObj.query.pageSize = i
  refetchCourseList()
}

const courseHandlePageChange = (i) => {
  courseObj.query.page = i
  refetchCourseList()
}

const addTraining = () => {
  trainingObj.form = {
    college_id: "",
    id: "",
    name_zh: "",
    name_en: "",
    name_vi: "",
    name_tw: "",
    description: "",
    person_num: "",
    start_date: "",
    end_date: "",
    is_valid: "Y",
    rec_status: 1,
    detail: []
  }
  tableObj.detail = []
  showObj.trainingShow = true
}

const modifyTraining = (data) => {
  coverObj.needUpload = false
  coverObj.dialogImageUrl = ""
  coverObj.imageUrl = ""
  coverObj.file = { name: '' }

  $request(api.videoServer + '/Video/VideoTrain/getTrainDetil', {
    id: data.id
  }).then(r => {
    trainingObj.form = r.data
    tableObj.detail = r.data.detail
    if (r.data.thumbnail_path) {
      trainingObj.form.oldthumbnail_path = r.data.thumbnail_path
    }
    showObj.trainingShow = true
  })
}

const modifyStatus = (i) => {
  let currentStatus = i.is_valid
  let value
  let oprate
  if (currentStatus == 'N') {
    value = 'Y'
    oprate = l.enable
  } else {
    value = 'N'
    oprate = l.disable
  }

  $prompt(l.confirmDisable.replace('{oprate}', oprate).replace('{name}', i.name_label), {
      type: 'warning',
      inputPattern: /^[Y]{1}$/i,
      inputErrorMessage: l.inputError,
      confirmButtonText: l.confirm,
      cancelButtonText: l.cancel
    }).then(() => {
      modifyStatusMutation.mutate({ key: i.id, value: value })
    })
    .catch(() => {})
}

const handleSubmit = () => {
  if (trainingObj.form.id == '' && !coverObj.needUpload) {
    return $message.info(l.noCoverSelected)
  }
  if (trainingObj.form.college_id == '') {
    return $message.info(l.noCollegeSelected)
  }
  if (trainingObj.form.start_date == '') {
    return $message.info(l.noStartTime)
  }
  if (trainingObj.form.end_date == '') {
    return $message.info(l.noEndTime)
  }
  if (trainingObj.form.person_num == '') {
    return $message.info(l.noParticipants)
  }
  if (trainingObj.form.name_zh == '') {
    return $message.info(l.noSimplifiedTitle)
  }
  if (trainingObj.form.description == '') {
    return $message.info(l.noDescription)
  }
  if (coverObj.needUpload) {
    uploadCover()
  } else {
    submitTraining()
  }
}

const submitTraining = () => {
  let detail = []
  if (tableObj.detail.length > 0) {
    tableObj.detail.forEach((i, index) => {
      if (i.id == '') {
        i.train_id = trainingObj.form.id // Use form.id instead of undefined trainingObj.id
      }
      detail.push({
        id: i.id,
        train_id: i.train_id,
        bind_id: i.bind_id,
        type: i.type,
        is_must: i.is_must,
        sort: index,
        is_valid: 'Y',
        rec_status: 1,
      })
    })
  }

  trainingObj.form.detail = detail
  submitTrainingMutation.mutate(trainingObj.form)
}

const getTrainingList = () => {
  refetchTrainingList()
}

const getCollegeList = () => {
  refetchCollege()
}

onMounted(() => {
  getCollegeList()
  window.addEventListener('resize', updateTableMaxHeight);
  nextTick(() => {
    updateTableMaxHeight();
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTableMaxHeight);
})
</script>

<style>
.modifyCover {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modifyCover .change {
  text-align: center;
  color: #409fee;
  font-size: 50px;
}

.cover {
  position: relative;
  width: 260px;
  height: 150px;
  display: flex;
  align-items: center;
}
.cover .auto-img {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
}
.cover:hover .cover-oprate {
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
.cover:hover .cover-oprate .iconZoom {
  margin-top: 15%;
}
.cover:hover .cover-oprate .iconZoom:hover {
  color: #409fee;
}
.cover:hover .cover-oprate .iconRefresh {
  margin-top: 15%;
}
.cover:hover .cover-oprate .iconRefresh:hover {
  color: #00aa7f;
}
.cover .plus-icon {
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
.cover .plus-icon:hover {
  color: #409fee;
}
.cover .cover-oprate {
  display: none;
}

.trainingManage-container {
  width: 100%;
  height: 100%;
}
.trainingManage-container .lessonList-dialog .img {
  width: 100%;
  height: 80px;
}
.trainingManage-container .lessonList-dialog .img .auto-img {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
}
.trainingManage-container .lessonList-dialog .lessonList-pagenation {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.trainingManage-container .drawer-container .title {
  padding: 20px 0px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
}
.trainingManage-container .drawer-container .form-container {
  width: 95%;
  height: 90%;
  margin: 0 auto;
  background-color: #fff;
}
.trainingManage-container .drawer-container .buttonBar {
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
.trainingManage-container .pageBody {
  width: 100%;
  min-width: 1000px;
  height: 100%;
  margin: 0 auto;
  background-color: #fff;
}
.trainingManage-container .pageBody .pageBody-filter {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  height: 60px;
  padding: 14px;
}
.trainingManage-container .pageBody .tableContainer {
  width: 100%;
  height: calc(100% - 110px);
}
.trainingManage-container .pageBody .trainingManage-pagenation {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
