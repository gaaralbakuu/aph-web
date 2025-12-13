<template>
  <div class="questionnaireManage-container">
    <div class="component">
      <el-dialog :title="l.addQuestion" :visible.sync="showObj.questionDialog" @open='getQuestionList' width="80%">
        <div class="questionDialog">
          <div class="questionFilter">
            <el-form inline label-width="60px">
              <el-form-item :label="l.college">
                <el-select v-model="questionObj.query.college_id" @change="questionCollegeChange">
                  <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                    :value="i.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="l.title">
                <el-input v-model="questionObj.query.name" @keydown.native.enter="getQuestionList"></el-input>
              </el-form-item>
              <el-form-item :label="l.category">
                <el-cascader clearable style="width: 100%;" v-model="questionObj.query.question_category_id"
                  :options="publicCodeObj.questionCatagory" :props="{
                  label:'name_label',value:'id',checkStrictly:true
                }" :placeholder="l.catalogRoot" @change="changCatalog"></el-cascader>
              </el-form-item>
              <el-form-item :label="l.questionType">
                <el-select v-model="questionObj.query.question_type" style="width: 100px;" @change="getQuestionList">
                  <el-option :label="l.all" value=""></el-option>
                  <el-option v-for="i in publicCodeObj.question_type" :key='i.value' :label="i.label"
                    :value="i.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item :label="l.status">
                <el-select v-model="questionObj.query.question_status" style="width: 100px;" @change="getQuestionList">
                  <el-option :label="l.all" value=""></el-option>
                  <el-option v-for="i in publicCodeObj.question_status" :key='i.value' :label="i.label"
                    :value="i.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="getQuestionList">{{ l.search }}</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="questionContent">
            <div class="questionList">
              <a-table :columns="questionColumns" :dataSource="questionObj.list" :scroll="{ y: cssObj.tableMaxHeight }" style="width: 100%" rowKey="id" :pagination="false">
                <template slot="question_type" slot-scope="text, record">
                  {{ returnPublicObjLabel(record.question_type, 'value', 'label', 'question_type') }}
                </template>
                <template slot="question_status" slot-scope="text, record">
                  {{ returnPublicObjLabel(record.question_status, 'value', 'label', 'question_status') }}
                </template>
                <template slot="is_valid" slot-scope="text, record">
                  {{ record.is_valid === 'Y' ? l.enabled : l.disabled }}
                </template>
                <template slot="operation" slot-scope="text, record">
                  <a-button type="link" @click="selectQuestion(record)">{{ l.select }}</a-button>
                </template>
              </a-table>
            </div>
          </div>
        </div>
      </el-dialog>

      <el-drawer class="drawer" :visible.sync="showObj.questionnaireDrawer" :wrapperClosable='false' size="60%"
        @opened='getPopoverWidth'>
        <div slot='title' class="title">{{ l.editQuestionnaire }}</div>
        <div class="form">

          <el-form label-width="5em" size="medium">
            <el-form-item :label="l.attachedCollege">
              <el-select v-model="questionnaireObj.form.college_id" style="width: 100%;">
                <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                  :value="i.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="l.nameZh">
              <el-input v-model="questionnaireObj.form.name_zh">
              </el-input>
            </el-form-item>
            <el-form-item :label="l.nameTw">
              <el-input v-model="questionnaireObj.form.name_tw">
              </el-input>
            </el-form-item>
            <el-form-item :label="l.nameEn">
              <el-input v-model="questionnaireObj.form.name_en">
              </el-input>
            </el-form-item>
            <el-form-item :label="l.nameVi">
              <el-input v-model="questionnaireObj.form.name_vi">
              </el-input>
            </el-form-item>
            <el-form-item :label="l.addQuestion">
              <div ref="question_title">
                <el-button type="danger" plain @click="templateObj.question = []">{{ l.clear }}</el-button>
                <el-button type="primary" plain @click="openDialogQuestion">{{ l.add }}</el-button>
              </div>
            </el-form-item>
            <div class="questionList">
              <el-form-item v-for="(i,index) in templateObj.question" :key="index" :label="`${l.question}${index+1}`">
                <div class="questionCard">
                  <div class="questionItem">
                    <el-input v-model="i.name_label" disabled style="width: 50%;">
                      <template slot="prepend">
                        <div class="prepend">
                          {{returnPublicObjLabel(i.question_type,'value','label','question_type')}}
                        </div>
                      </template>
                    </el-input>
                    <el-input v-model.number="i.score" style="width: 20%;">
                      <template slot="prepend">
                        <div class="prepend">
                          {{ l.correctScore }}
                        </div>
                      </template>
                    </el-input>
                    <div style="width: 20%;display: flex;justify-content: space-between;">
                      <el-button type="danger" :style="{width: cssObj.popoverWidth*0.075+'px'}"
                        @click="deleteQuestionInFrom(index)">{{ l.delete }}</el-button>
                      <el-popover placement="top-start" :title="i.name_label" :width="cssObj.popoverWidth"
                        :offset="cssObj.popoverWidth*0.3" trigger="click">
                        <div class="options" style=" width: 100%;height: auto;min-height: 100px;">
                          <div v-if="i.question_type===0" class="text">
                            <el-input disabled type="textarea" :rows="2" :placeholder="l.fillInTheBlank">
                            </el-input>
                          </div>
                          <div v-else class="radio-box" style=" width: 100%;">
                            <div class="option-card" v-for="(o,oIndex) in i.options" :key="oIndex"
                              style="border-radius: 5px;border: 1px solid #ddd; padding: 5px 10px; margin-bottom: 20px;">
                              <div class="oprate"
                                style="display: flex;align-items: center;justify-content: space-between;font-size: 16px;margin-bottom: 5px;border-bottom: 1px solid #ddd;padding-bottom: 5px;">
                                <div>{{ l.option }}{{oIndex+1}}</div>
                              </div>
                              <el-form label-width="60px" size="medium">
                                <el-row :gutter="10">
                                  <el-col :span='7'>
                                    <div class="input-box"
                                      style="width: 100%;height: 40px;display: flex; align-items: center;">
                                      <el-input v-model="o.name_zh" disabled>
                                        <template slot="prepend">{{ l.zh }}</template>
                                      </el-input>
                                    </div>
                                  </el-col>
                                  <el-col :span="7">
                                    <div class="input-box"
                                      style="width: 100%;height: 40px;display: flex; align-items: center;">
                                      <el-input v-model="o.name_en" disabled>
                                        <template slot="prepend">{{ l.en }}</template>
                                      </el-input>
                                    </div>
                                  </el-col>
                                  <el-col :span='7'>
                                    <div class="input-box"
                                      style="width: 100%;height: 40px;display: flex; align-items: center;">
                                      <el-input v-model="o.name_tw" disabled>
                                        <template slot="prepend">{{ l.tw }}</template>
                                      </el-input>
                                    </div>
                                  </el-col>
                                  <el-col :span='7'>
                                    <div class="input-box"
                                      style="width: 100%;height: 40px;display: flex; align-items: center;">
                                      <el-input v-model="o.name_vi" disabled>
                                        <template slot="prepend">{{ l.vi }}</template>
                                      </el-input>
                                    </div>
                                  </el-col>
                                  <el-col :span='3'>
                                    <div class="input-box"
                                      style="width: 100%;height: 40px;display: flex; align-items: center;">
                                      <el-switch disabled v-model="o.is_correct" :active-value="true"
                                        :inactive-value="false" active-color="#13ce66" inactive-color="#ccc"
                                        :active-text="l.correctAnswer">
                                      </el-switch>
                                    </div>
                                  </el-col>
                                </el-row>
                              </el-form>
                            </div>
                          </div>
                        </div>
                        <el-button slot="reference" type="success" plain
                          :style="{width: cssObj.popoverWidth*0.075+'px'}">{{ l.detail }}</el-button>
                      </el-popover>
                    </div>
                  </div>
                  <div v-show="i.question_type==2" class="questionItem_rule"
                    style="width: 100%;margin-top: 10px;display: flex;justify-content: space-between;">
                    <div style="width: 50%;display: flex;">
                      <div class="el-input-group__prepend" style="width: 7em;text-align:center;height: 36px;">
                        {{ l.missOptionRule }}
                      </div>
                      <el-select v-model="i.rule" style="flex: 1;">
                        <el-option :label="l.missOptionScore" :value="1"></el-option>
                        <el-option :label="l.noScoreForMissOrWrong" :value="0"></el-option>
                      </el-select>
                    </div>
                    <el-input :disabled='i.rule!=1' v-model.number="i.rule_score" style="width: 20%;">
                      <template slot="prepend">
                        <div class="prepend" style="width: 4em;">
                          {{ l.missOptionScore }}
                        </div>
                      </template>
                    </el-input>
                    <div style="width: 20%;"></div>
                  </div>
                </div>
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="buttonBar">
          <el-button type="primary" @click="submitQuestionnaire">{{ l.submit }}</el-button>
          <el-button type="danger" @click="showObj.questionnaireDrawer=false">{{ l.close }}</el-button>
        </div>
      </el-drawer>
    </div>

    <div class="pageBody">
      <div class="questionnaireFilter">
        <el-form inline label-width="60px">
          <el-form-item :label="l.college">
            <el-select v-model="college_id" :clearable="isAdmin" @change="getQuestionnaireList">
              <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label"
                :value="i.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item :label="l.title">
            <el-input v-model="questionnaireObj.query.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="getQuestionnaireList">{{ l.search }}</el-button>
            <el-button type="primary" @click="addQuestionnaire">{{ l.newQuestionnaire }}</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="questionnaireContent">
        <div class="questionnaireList">
          <div ref="tableContainer" style="height:calc(100% - 40px) ;">
            <a-table :columns="questionnaireColumns" :dataSource="questionnaireObj.list" :scroll="{ y: cssObj.tableMaxHeight }" style="width: 100%" rowKey="id" :pagination="false">
              <template slot="is_valid" slot-scope="text, record">
                {{ record.is_valid === 'Y' ? l.enabled : l.disabled }}
              </template>
              <template slot="operation" slot-scope="text, record">
                <a-button type="link" class="text-yellow" @click="previewQuestionnaire(record.id)">{{ l.preview }}</a-button>
                <a-button type="link" @click="editQuestionnaire(record.id)">{{ l.edit }}</a-button>
                <a-button type="link" :class="record.is_valid=='Y' ? 'text-red' : 'text-green'" @click="toggleQuestionnaireStatus(record)">{{ record.is_valid=='Y' ? l.disable : l.enable }}</a-button>
              </template>
            </a-table>
          </div>
          <a-pagination :current.sync="questionnaireObj.query.page" :pageSize.sync="questionnaireObj.query.pageSize" :total="questionnaireObj.total" :pageSizeOptions="['5','10','15','30','50','100']" showSizeChanger @change="handlePageChange" @showSizeChange="handleSizeChange" style="float: right;" />
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
const { l, c } = useLocalI18n('videoAdminQuestionnaire')
const queryClient = useQueryClient()

// State
const college_id = ref(null)
const question_title = ref(null)
const filterCatalogText = ref('')

const showObj = reactive({
  questionDialog: false,
  questionnaireDrawer: false
})

const templateObj = reactive({
  question: []
})

const publicCodeObj = reactive({
  collegeList: [],
  questionCatagory: [],
  question_type: [{
      label: l.fillBlank,
      value: 0
    },
    {
      label: l.singleChoice,
      value: 1
    },
    {
      label: l.multiChoice,
      value: 2
    },
    {
      label: l.judgment,
      value: 3
    }
  ],
  question_status: [{
      label: l.unpublished,
      value: 0
    },
    {
      label: l.published,
      value: 1
    }
  ]
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

const questionnaireObj = reactive({
  query: {
    page: 1,
    pageSize: 10,
    name: '',
    question_category_id: '',
    question_status: '',
    question_type: '',
  },
  form: {
    id: "",
    college_id: '',
    qid: "",
    name_zh: "",
    name_en: "",
    name_vi: "",
    name_tw: "",
    question: []
  },
  list: [],
  total: 0
})

const questionObj = reactive({
  list: [],
  total: 0,
  query: {
    college_id:"",
    page: 1,
    pageSize: 10,
    name: '',
    question_category_id: '',
    question_status: '',
    question_type: '',
  },
})

const isAdmin = computed(() => {
  return store.getters.isAdmin
})

const questionColumns = computed(() => {
  return [
    { title: l.serialNumber, key: 'index', width: 50, customRender: (text, record, index) => index + 1 },
    { title: l.question, dataIndex: 'name_label', key: 'question' },
    { title: l.difficulty, dataIndex: 'difficulty_level', key: 'difficulty' },
    { title: l.questionType, dataIndex: 'question_type', key: 'questionType', scopedSlots: { customRender: 'question_type' } },
    { title: l.publishStatus, dataIndex: 'question_status', key: 'publishStatus', scopedSlots: { customRender: 'question_status' } },
    { title: l.status, dataIndex: 'is_valid', key: 'status', scopedSlots: { customRender: 'is_valid' } },
    { title: l.operation, key: 'operation', fixed: 'right', scopedSlots: { customRender: 'operation' } }
  ]
})

const questionnaireColumns = computed(() => {
  return [
    { title: l.serialNumber, key: 'index', width: 50, customRender: (text, record, index) => index + 1 },
    { title: l.nameZh, dataIndex: 'name_zh', key: 'nameZh' },
    { title: l.nameTw, dataIndex: 'name_tw', key: 'nameTw' },
    { title: l.nameEn, dataIndex: 'name_en', key: 'nameEn' },
    { title: l.nameVi, dataIndex: 'name_vi', key: 'nameVi' },
    { title: l.createTime, dataIndex: 'create_time', key: 'createTime' },
    { title: l.updateTime, dataIndex: 'create_time', key: 'updateTime' },
    { title: l.status, dataIndex: 'is_valid', key: 'status', scopedSlots: { customRender: 'is_valid' } },
    { title: l.operation, key: 'operation', fixed: 'right', scopedSlots: { customRender: 'operation' } }
  ]
})

// Queries
const { data: collegeListData, refetch: refetchCollegeList } = useQuery({
  queryKey: ['collegeList', route.path],
  queryFn: () => $request(api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
    resource_path: route.path
  })
})

watch(() => collegeListData.value, (newVal) => {
  if (newVal) {
    publicCodeObj.collegeList = newVal.data
    college_id.value = newVal.data[0].id
    questionObj.query.college_id = college_id.value
    refetchQuestionnaireList()
  }
})

const { data: questionnaireListData, refetch: refetchQuestionnaireList } = useQuery({
  queryKey: ['questionnaireList', questionnaireObj.query, college_id],
  queryFn: () => $request(api.baseUrl + '/Video/VideoExam/getQuestionnaireList', {
    ...questionnaireObj.query,
    college_id: college_id.value
  }),
  enabled: false
})

watch(() => questionnaireListData.value, (newVal) => {
  if (newVal) {
    questionnaireObj.list = newVal.data.list
    questionnaireObj.total = newVal.data.total
    nextTick(() => {
      const container = instance.refs.tableContainer;
      if (container) {
        cssObj.tableMaxHeight = container.clientHeight + 'px';
      }
    })
  }
})

const { data: questionListData, refetch: refetchQuestionList } = useQuery({
  queryKey: ['questionList', questionObj.query],
  queryFn: () => $request(api.baseUrl + '/Video/VideoExam/getQuestionList', {
    ...questionObj.query
  }),
  enabled: false
})

watch(() => questionListData.value, (newVal) => {
  if (newVal) {
    questionObj.list = newVal.data.list
    questionObj.total = newVal.data.total
  }
})

const { data: questionCatagoryData, refetch: refetchQuestionCatagory } = useQuery({
  queryKey: ['questionCatagory', questionObj.query.college_id],
  queryFn: () => $request(api.videoServer + '/Video/VideoExam/getQuestionCatagoryList', {
    is_valid: '',
    college_id: questionObj.query.college_id
  }),
  enabled: false
})

watch(() => questionCatagoryData.value, (newVal) => {
  if (newVal && newVal.status) {
    publicCodeObj.questionCatagory = newVal.data
  }
})

// Mutations
const submitQuestionnaireMutation = useMutation({
  mutationFn: (data) => $request(api.baseUrl + '/Video/VideoExam/addOrModifyQuestionnarie', data, 'post'),
  onSuccess: (r) => {
    if (r.httpCode == 200) {
      $message.success(l.submitSuccess)
      setTimeout(() => {
        showObj.questionnaireDrawer = false
        refetchQuestionnaireList()
      }, 1500)
    }
  }
})

const toggleQuestionnaireStatusMutation = useMutation({
  mutationFn: ({ key, value }) => $request(api.baseUrl + '/Video/VideoExam/DeleteOrRecoveryQuestionnaireById', {
    key, value
  }, 'post'),
  onSuccess: () => {
    $message.success(l.modifySuccess)
    refetchQuestionnaireList()
  }
})

// Functions
const questionCollegeChange = () => {
  questionObj.query.question_category_id = ""
  refetchQuestionList()
  refetchQuestionCatagory()
}

const getCollegeList = () => {
  refetchCollegeList()
}

const changCatalog = (v) => {
  questionObj.query.question_category_id = v[v.length - 1]
  refetchQuestionList()
}

const getQuestionCatagoryList = () => {
  refetchQuestionCatagory()
}

const handleSizeChange = (current, size) => {
  questionnaireObj.query.pageSize = size
  refetchQuestionnaireList()
}

const handlePageChange = (page) => {
  questionnaireObj.query.page = page
  refetchQuestionnaireList()
}

const deleteQuestionInFrom = (index) => {
  templateObj.question.splice(index, 1)
}

const getPopoverWidth = () => {
  let container = question_title.value;
  if (container) {
    cssObj.popoverWidth = container.clientWidth;
  }
}

const filterCatalog = (value, data) => {
  if (!value) return true;
  return data.name_label.indexOf(value) !== -1;
}

const openDialogQuestion = () => {
  showObj.questionDialog = true
  refetchQuestionCatagory()
}

const selectQuestion = (data) => {
  let temp = {
    id: "",
    questioinnaire_id: "",
    question_id: data.id,
    score: "",
    sort: "",
    rule: 0,
    rule_score: 0,
    name_label: data.name_label,
    question_type: data.question_type,
    options: data.options
  }
  templateObj.question.push(temp)
}

const clickQuestionCatalog = (id) => {
  questionnaireObj.query.question_category_id = id
  refetchQuestionList()
}

const addQuestionnaire = () => {
  for (let key in questionnaireObj.form) {
    if (questionnaireObj.form.hasOwnProperty(key)) {
      questionnaireObj.form[key] = '';
    }
  }
  templateObj.question = []
  showObj.questionnaireDrawer = true
}

const editQuestionnaire = (id) => {
  $request(api.baseUrl + '/Video/VideoExam/getQuestionnaire', {
      id: id,
      show_answer: true
    }, 'post')
    .then(r => {
      questionnaireObj.form = r.data
      templateObj.question = r.data.questions
      showObj.questionnaireDrawer = true
    })
}

const toggleQuestionnaireStatus = (data) => {
  let msg
  let value
  if (data.is_valid == 'Y') {
    value = 'N'
    msg = l.confirmDisable.replace('{name}', data.name_zh)
  } else {
    value = 'Y'
    msg = l.confirmEnable.replace('{name}', data.name_zh)
  }
  $prompt(msg, {
      type: 'warning',
      inputPattern: /^[Y]{1}$/i,
      inputErrorMessage: l.inputErrorMessage,
      confirmButtonText: l.confirm,
      cancelButtonText: l.cancel
    }).then(() => {
      toggleQuestionnaireStatusMutation.mutate({ key: data.id, value })
    })
    .catch(() => {
      console.log('取消操作');
    })
}

const previewQuestionnaire = (id) => {
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

const submitQuestionnaire = () => {
  if (questionnaireObj.form.college_id == '') {
    return $message.error(l.selectCollege)
  }
  if (questionnaireObj.form.name_zh == '') {
    return $message.error(l.inputNameZh)
  }
  if (templateObj.question.length == 0) {
    return $message.error(l.addQuestionsToPaper)
  } else {
    questionnaireObj.form.question = templateObj.question
  }
  submitQuestionnaireMutation.mutate(questionnaireObj.form)
}

const getQuestionnaireList = () => {
  refetchQuestionnaireList()
}

const getQuestionList = () => {
  refetchQuestionList()
}

const returnPublicObjLabel = (inputValue, key, outputValue, filed) => {
  let item = publicCodeObj[filed].find(i => {
    return i[key] == inputValue
  })
  if (item) {
    return item[outputValue]
  } else {
    return inputValue
  }
}

onMounted(() => {
  getCollegeList()
})
</script>

<style>
.questionnaireManage-container {
  width: 100%;
  height: 100%;
}
.questionnaireManage-container .component .drawer .title {
  padding: 20px 0px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
}
.questionnaireManage-container .component .drawer .form {
  width: 95%;
  margin: 0 auto;
}
.questionnaireManage-container .component .drawer .form .questionList .questionCard {
  padding: 0px 0px 20px 0px;
  border-bottom: 1px dashed #ccc;
}
.questionnaireManage-container .component .drawer .form .questionList .questionCard .questionItem {
  display: flex;
  width: 100%;
  justify-content: space-between;
}
.questionnaireManage-container .component .drawer .form .questionList .questionCard .questionItem .prepend {
  width: 4em;
  text-align: center;
}
.questionnaireManage-container .component .drawer .buttonBar {
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
.questionnaireManage-container .pageBody {
  width: 100%;
  min-width: 1000px;
  height: 100%;
  margin: 0 auto;
}
.questionnaireManage-container .pageBody .questionnaireFilter {
  width: 100%;
  height: 60px;
  padding: 15px 0px;
  white-space: nowrap;
  background-color: white;
  float: right;
  border-bottom: 1px #eee solid;
}
.questionnaireManage-container .pageBody .questionnaireContent {
  width: 100%;
  height: calc(100% - 60px);
  display: flex;
}
.questionnaireManage-container .pageBody .questionnaireContent .questionnaireList {
  width: 100%;
  height: 100%;
  padding: 5px;
  background-color: white;
}
</style>
