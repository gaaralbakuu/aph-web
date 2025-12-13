<template>
  <div class="examManage-container">
    <div class="component">

      <el-drawer class="drawer" :visible.sync="showObj.examDrawer" :wrapperClosable='false' size="60%">
        <div slot='title' class="title">{{ l.editExam }}</div>
        <div class="form">
          <el-form label-width="5em" size="medium">
            <el-form-item :label="l.belongCollege">
              <el-select v-model="examObj.form.college_id" :placeholder="l.pleaseSelectCollege" style="width: 100%;">
                <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                  :value="i.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="l.chineseName">
              <el-input v-model="examObj.form.name_zh"></el-input>
            </el-form-item>
            <el-form-item :label="l.traditionalChineseName">
              <el-input v-model="examObj.form.name_tw"></el-input>
            </el-form-item>
            <el-form-item :label="l.englishName">
              <el-input v-model="examObj.form.name_en"></el-input>
            </el-form-item>
            <el-form-item :label="l.vietnameseName">
              <el-input v-model="examObj.form.name_vi"></el-input>
            </el-form-item>
            <el-form-item :label="l.bindQuestionnaire">
              <el-input v-model="examObj.form.exam_name_zh" disabled>
                <template slot="append">
                  <el-button @click="showObj.questionnaireDialog=true"
                    style="background-color: #67C23A;color: white;">{{ l.select }}</el-button>
                </template>
              </el-input>
            </el-form-item>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item :label="l.startTime">
                  <el-date-picker v-model="examObj.form.start_time" type="datetime"
                    :placeholder="l.chooseStartTime" style="width: 100%;">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="l.endTime">
                  <el-date-picker v-model="examObj.form.end_time" type="datetime"
                    :placeholder="l.chooseEndTime" style="width: 100%;">
                  </el-date-picker>
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item :label="l.maxAnswerTimes">
              <el-input v-model.number="examObj.form.max_reply_num"></el-input>
            </el-form-item>
            <el-form-item :label="l.passScore">
              <el-input v-model.number="examObj.form.pass_score"></el-input>
            </el-form-item>
            <el-form-item :label="l.examDuration">
              <el-input v-model="examObj.form.test_duration"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div class="buttonBar">
          <el-button type="primary" @click="submitExam">{{ l.submit }}</el-button>
          <el-button type="danger" @click="showObj.examDrawer=false">{{ l.close }}</el-button>
        </div>
      </el-drawer>

      <el-dialog :visible.sync="showObj.questionnaireDialog" @open='getQuestionnaireList' width="60%">
        <el-form inline label-width="60px">
          <el-form-item :label="l.collegeFilter">
            <el-select v-model="questionnaireObj.query.college_id" @change="getQuestionnaireList">
              <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="l.titleFilter">
            <el-input v-model="questionnaireObj.query.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="getQuestionnaireList">{{ l.search }}</el-button>
          </el-form-item>
        </el-form>
        <a-table ref="questionnaireTable" :dataSource="questionnaireObj.list" :columns="questionnaireColumns" :pagination="false" :scroll="{ y: cssObj.tableMaxHeight }" rowKey="id">
          <template slot="operation" slot-scope="text, record">
            <a-button type="link" class="text-green" @click="selectQueertionnarire(record)">{{ l.chooseButton }}</a-button>
          </template>
        </a-table>
      </el-dialog>
    </div>

    <div class="pageBody">
      <div class="examFilter">
        <el-form inline label-width="60px">
          <el-form-item :label="l.collegeFilter">
            <el-select v-model="college_id" :clearable="isAdmin" @change="getExamList">
              <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="l.titleFilter">
            <el-input v-model="examObj.query.name" clearable @clear='getExamList'
              @keyup.native.enter="getExamList"></el-input>
          </el-form-item>
          <el-form-item :label="l.filterStatus">
            <el-select v-model="examObj.query.is_valid" style="width: 100px;" @change="getExamList">
              <el-option :label="l.allStatusOption" value=""></el-option>
              <el-option :label="l.enabledStatusOption" value="Y"></el-option>
              <el-option :label="l.disabledStatusOption" value="N"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="getExamList">{{ l.search }}</el-button>
            <el-button type="primary" @click="addExam">{{ l.newExamButton }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="examContent">
        <div class="examList">
          <div ref="tableContainer" style="height:calc(100% - 40px);">
            <a-table ref="examTable" :dataSource="examObj.list" :columns="examColumns" :pagination="false" :scroll="{ y: cssObj.tableMaxHeight }" rowKey="id">
              <template slot="operation" slot-scope="text, record">
                <a-button type="link" class="text-yellow" @click="previewExam(record.questionnaire_id)">{{ l.previewButton }}</a-button>
                <a-button type="link" @click="editExam(record)">{{ l.editButton }}</a-button>
                <a-button type="link" :class="record.is_valid=='Y' ? 'text-red' : 'text-green'" @click="toggleExamStatus(record)">{{ record.is_valid=='Y' ? l.disableButton : l.enableButton }}</a-button>
              </template>
            </a-table>
          </div>
          <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange"
            :current-page="examObj.query.page" :page-sizes="[5,10, 15, 30, 50,100]" :page-size="examObj.query.pageSize"
            layout="total, sizes, prev, pager, next, jumper" :total="examObj.total" style="float: right;">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, watch, onMounted, getCurrentInstance, nextTick } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import api from '@/api'
import { useLocalI18n } from '@/composables/useLocalI18n'
import store from '@/store'
import { assignObject } from '@/utils'

const instance = getCurrentInstance()
const { $request, $message, $prompt } = instance.proxy
const route = instance.proxy.$route
const router = instance.proxy.$router
const { l, c } = useLocalI18n('videoAdminExam')
const queryClient = useQueryClient()

// State
const college_id = ref(null)
const showObj = reactive({
  questionnaireDialog: false,
  examDrawer: false,
  recordDialog: false
})

const questionnaireObj = reactive({
  query: {
    page: 1,
    pageSize: 12,
    college_id: '',
    name: ''
  },
  list: []
})

const publicCodeObj = computed(() => {
  return {
    collegeList: collegeListData.value ? collegeListData.value.data : [],
    question_type: [
      {
        label: l.blankQuestion,
        value: 0
      },
      {
        label: l.singleChoiceQuestion,
        value: 1
      },
      {
        label: l.multipleChoiceQuestion,
        value: 2
      },
      {
        label: l.trueFalseQuestion,
        value: 3
      }
    ],
    question_status: [
      {
        label: l.notPublished,
        value: 0
      },
      {
        label: l.published,
        value: 1
      }
    ]
  }
})

const cssObj = reactive({
  tableMaxHeight: '500px',
  popoverWidth: "600px",
  headerRowStyle: {
    background: '#f2f4f9',
    color: '#505050',
    fontSize: '14px',
    height: '50px'
  }
})

const currentExam = reactive({
  id: '',
  questionnaire_id: '',
  max_reply_num: 0
})

const examObj = reactive({
  query: {
    page: 1,
    pageSize: 15,
    is_valid: "",
  },
  recordQuery: {
    userid: '',
    exam_id: '',
    questionnaire_id: '',
    page: 1,
    pageSize: 15,
  },
  form: {
    id: "",
    college_id:'',
    questionnaire_id: "",
    exam_name_zh: "",
    name_zh: "",
    name_tw: "",
    name_en: "",
    name_vi: "",
    start_time: "",
    end_time: "",
    max_reply_num: "",
    pass_score: "",
    test_duration: ""
  },
  list: [],
  record: [],
  total: 0,
  recordTotal: 0
})

const isAdmin = computed(() => {
  return store.getters.isAdmin
})

const questionnaireColumns = computed(() => {
  return [
    { title: 'No', dataIndex: '', key: 'index', width: 50, customRender: (text, record, index) => index + 1 },
    { title: l.nameZhColumn, dataIndex: 'name_zh' },
    { title: l.nameTwColumn, dataIndex: 'name_tw' },
    { title: l.nameEnColumn, dataIndex: 'name_en' },
    { title: l.nameViColumn, dataIndex: 'name_vi' },
    { title: l.createTimeColumn, dataIndex: 'create_time' },
    { title: l.updateTimeColumn, dataIndex: 'modify_time' },
    { title: l.statusColumn, dataIndex: 'is_valid', customRender: (text) => text == 'Y' ? l.statusEnabled : l.statusDisabled },
    { title: l.operationColumn, key: 'operation', fixed: 'right', scopedSlots: { customRender: 'operation' } }
  ]
})

const examColumns = computed(() => {
  return [
    { title: 'No', dataIndex: '', key: 'index', width: 50, customRender: (text, record, index) => index + 1 },
    { title: l.examNameColumn, dataIndex: 'name_label' },
    { title: l.passScoreColumn, dataIndex: 'pass_score' },
    { title: l.maxReplyNumColumn, dataIndex: 'max_reply_num' },
    { title: l.testDurationColumn, dataIndex: 'test_duration' },
    { title: l.startTimeColumn, dataIndex: 'start_time' },
    { title: l.endTimeColumn, dataIndex: 'end_time' },
    { title: l.isValidColumn, dataIndex: 'is_valid' },
    { title: l.operationColumn, key: 'operation', fixed: 'right', width: 180, scopedSlots: { customRender: 'operation' } }
  ]
})

// Queries
const { data: collegeListData, refetch: refetchCollegeList } = useQuery({
  queryKey: ['collegeList', route.path],
  queryFn: () => $request(api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
    resource_path: route.path
  })
})

watch(() => publicCodeObj.value.collegeList, (newVal) => {
  if (newVal && newVal.length > 0) {
    college_id.value = newVal[0].id
    questionnaireObj.query.college_id = college_id.value
    refetchExamList()
  }
})

const { data: examListData, refetch: refetchExamList } = useQuery({
  queryKey: ['examList', examObj.query, college_id],
  queryFn: () => $request(api.baseUrl + '/Video/VideoExam/getExamList', {
    ...examObj.query,
    college_id: college_id.value
  }),
  enabled: false
})

watch(() => examListData.value, (newVal) => {
  if (newVal) {
    examObj.list = newVal.data.list
    examObj.total = newVal.data.total
    nextTick(() => {
      const container = instance.refs.tableContainer;
      if (container) {
        cssObj.tableMaxHeight = container.clientHeight + 'px';
      }
    })
  }
})

const { data: questionnaireListData, refetch: refetchQuestionnaireList } = useQuery({
  queryKey: ['questionnaireList', questionnaireObj.query],
  queryFn: () => $request(api.baseUrl + '/Video/VideoExam/getQuestionnaireList', {
    ...questionnaireObj.query,
  }),
  enabled: false
})

watch(() => questionnaireListData.value, (newVal) => {
  if (newVal) {
    questionnaireObj.list = newVal.data.list
  }
})

// Mutations
const submitExamMutation = useMutation({
  mutationFn: (data) => $request(api.baseUrl + '/Video/VideoExam/addExam', data, 'post'),
  onSuccess: (r) => {
    if (r.httpCode == 200) {
      $message.success(l.submitSuccess)
      setTimeout(() => {
        showObj.examDrawer = false
        refetchExamList()
      }, 1500)
    }
  }
})

const toggleExamStatusMutation = useMutation({
  mutationFn: ({ key, value }) => $request(api.baseUrl + '/Video/VideoExam/DeleteOrRecoveryExamById', {
    key,
    value
  }, 'post'),
  onSuccess: () => {
    $message.success(l.operationSuccess)
    refetchExamList()
  }
})

// Functions
const getCollegeList = () => {
  refetchCollegeList()
}

const handleSizeChange = (i) => {
  examObj.query.pageSize = i
  refetchExamList()
}

const handlePageChange = (i) => {
  examObj.query.page = i
  refetchExamList()
}

const selectQueertionnarire = (data) => {
  examObj.form.questionnaire_id = data.id
  examObj.form.exam_name_zh = data.name_zh
  showObj.questionnaireDialog = false
}

const addExam = () => {
  for (let key in examObj.form) {
    if (examObj.form.hasOwnProperty(key)) {
      examObj.form[key] = '';
    }
  }
  showObj.examDrawer = true
}

const editExam = (data) => {
  assignObject(examObj.form, data)
  showObj.examDrawer = true
}

const toggleExamStatus = (data) => {
  let msg
  let value
  if (data.is_valid == 'Y') {
    msg = l.disableConfirmMessage.replace('{name}', data.name_zh)
    value = 'N'
  } else {
    msg = l.enableConfirmMessage.replace('{name}', data.name_zh)
    value = 'Y'
  }

  $prompt(msg, {
      type: 'warning',
      inputPattern: /^[Y]{1}$/i,
      inputErrorMessage: l.inputValidationFailed,
      confirmButtonText: l.confirmButtonText,
      cancelButtonText: l.cancelButtonText
    }).then(() => {
      toggleExamStatusMutation.mutate({ key: data.id, value: value })
    })
    .catch(() => {
      console.log('cancel');
    })
}

const previewExam = (id) => {
  let url = router.resolve({
    name: 'examDetail',
    query: {
      train_id: "",
      course_id: '',
      exam_id: '',
      questionnaire_id: id,
      mode: 'preview'
    }
  }).href;
  window.open(url, '_blank');
}

const submitExam = () => {
  if (examObj.form.name_zh == '') {
    return $message.error(l.pleaseEnterExamName)
  }
  if (examObj.form.questionnaire_id == '') {
    return $message.error(l.pleaseBindQuestionnaire)
  }
  submitExamMutation.mutate(examObj.form)
}

const getExamList = () => {
  refetchExamList()
}

const getQuestionnaireList = () => {
  refetchQuestionnaireList()
}

onMounted(() => {
  getCollegeList()
})
</script>

<style>
.examManage-container {
  width: 100%;
  height: 100%;
}
.examManage-container .component .drawer .title {
  padding: 20px 0px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
}
.examManage-container .component .drawer .form {
  width: 95%;
  margin: 0 auto;
}
.examManage-container .component .drawer .buttonBar {
  width: 100%;
  height: 60px;
  background-color: #fff;
  margin: 0 auto;
  padding: 0 15px;
  position: absolute;
  bottom: 0px;
  border-top: 1px solid #ccc;
  float: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.examManage-container .pageBody {
  width: 100%;
  min-width: 1000px;
  height: 100%;
  margin: 0 auto;
}
.examManage-container .pageBody .examFilter {
  width: 100%;
  height: 60px;
  padding: 15px 0px;
  white-space: nowrap;
  background-color: white;
  float: right;
  border-bottom: 1px #eee solid;
}
.examManage-container .pageBody .examContent {
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
}
.examManage-container .pageBody .examContent .examList {
  width: 100%;
  height: 100%;
  padding: 5px;
  background-color: white;
}
</style>
