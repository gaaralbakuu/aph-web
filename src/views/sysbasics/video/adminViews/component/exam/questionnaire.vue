<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.questionnaire }}</h1>

      <div class="flex gap-2">
        <button class="flex items-center gap-2 px-4 py-2 bg-[#CC0000] text-white! font-medium text-sm uppercase rounded-sm hover:bg-[#990000] transition-colors shadow-sm" @click="addQuestionnaire">
          <i class="el-icon-plus text-lg"></i>
          <span>{{ l.newQuestionnaire }}</span>
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="px-6 pt-6 pb-2 border-b border-[#E5E5E5] bg-white sticky top-0 z-20">
      <div class="flex items-center gap-4 text-sm font-medium text-[#606060]">
         <!-- College Select -->
        <div class="relative group w-48">
          <button class="w-full flex items-center justify-between px-3 py-2 bg-white border border-[#CCCCCC] rounded text-sm text-[#0D0D0D] hover:border-[#999999] transition-colors group-hover:border-[#606060]">
            <span class="flex items-center gap-2">
              <i class="el-icon-office-building text-[#606060]"></i>
              <span class="truncate">{{ college_id ? returnCollegeName(college_id) : l.pleaseSelectCollege }}</span>
            </span>
            <i class="el-icon-arrow-down text-[#606060] text-xs group-hover:rotate-180 transition-transform"></i>
          </button>
           <!-- Invisible hover bridge -->
          <div class="absolute top-full left-0 right-0 h-1 hidden group-hover:block"></div>
          <!-- Dropdown Menu -->
          <div class="absolute top-full left-0 right-0 pt-1 hidden group-hover:block z-50">
            <div class="bg-white border border-[#E5E5E5] rounded shadow-lg">
              <div class="max-h-56 overflow-y-auto">
                <button
                  v-for="college in publicCodeObj.collegeList"
                  :key="college.id"
                  class="w-full text-left px-3 py-2 hover:bg-[#F2F2F2] text-sm text-[#0D0D0D] border-b border-[#E5E5E5] last:border-b-0"
                  :class="college_id === college.id ? 'bg-[#F0F0F0] text-[#065FD4] font-medium' : ''"
                  @click="
                    college_id = college.id
                    getQuestionnaireList()
                  ">
                  <div class="flex items-center gap-2">
                    <i class="el-icon-check text-[#065FD4]" :class="college_id === college.id ? 'opacity-100' : 'opacity-0'"></i>
                    <span>{{ college.name_label }}</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-[#CCCCCC] rounded hover:border-[#606060] transition-colors focus-within:border-[#065FD4]">
          <i class="el-icon-search text-[#606060] text-lg"></i>
          <input v-model="questionnaireObj.query.name" type="text" :placeholder="l.titleFilter" class="bg-transparent border-none outline-none text-sm w-full placeholder-[#999999]" @change="getQuestionnaireList" />
        </div>

        <button class="bg-[#065FD4] text-white! px-4 py-2 rounded text-sm uppercase font-medium shadow-sm hover:bg-[#0551B4]" @click="getQuestionnaireList">{{ l.search }}</button>
      </div>
    </div>

    <!-- Content List -->
    <div class="flex-1 overflow-y-auto bg-white">
      <!-- Header -->
      <div class="grid grid-cols-[50px_1fr_1fr_1fr_1fr_1fr_1fr_1fr_120px] gap-4 px-6 py-2 border-b border-[#E5E5E5] text-xs font-medium text-[#606060] bg-white sticky top-0 z-10">
        <div>{{ l.serialNumber }}</div>
        <div>{{ l.nameZh }}</div>
        <div>{{ l.nameTw }}</div>
        <div>{{ l.nameEn }}</div>
        <div>{{ l.nameVi }}</div>
        <div>{{ l.createTime }}</div>
        <div>{{ l.updateTime }}</div>
        <div>{{ l.status }}</div>
        <div class="text-right">{{ l.operation }}</div>
      </div>

      <!-- List -->
      <div class="divide-y divide-[#E5E5E5]">
         <div v-if="questionnaireObj.list.length === 0" class="flex flex-col items-center justify-center py-20">
          <div class="w-32 h-32 bg-[#F9F9F9] rounded-full flex items-center justify-center mb-4">
            <i class="el-icon-document text-4xl text-[#CCCCCC]"></i>
          </div>
          <p class="text-[#0D0D0D]">{{ c.noData }}</p>
        </div>
        <div v-else v-for="(item, index) in questionnaireObj.list" :key="item.id" class="grid grid-cols-[50px_1fr_1fr_1fr_1fr_1fr_1fr_1fr_120px] gap-4 px-6 py-3 hover:bg-[#F9F9F9] items-center text-sm text-[#0D0D0D]">
            <div class="text-[#606060]">{{ (questionnaireObj.query.page - 1) * questionnaireObj.query.pageSize + index + 1 }}</div>
            <div class="font-medium truncate" :title="item.name_zh">{{ item.name_zh || "--" }}</div>
            <div class="truncate" :title="item.name_tw">{{ item.name_tw || "--" }}</div>
            <div class="truncate" :title="item.name_en">{{ item.name_en || "--" }}</div>
            <div class="truncate" :title="item.name_vi">{{ item.name_vi || "--" }}</div>
            <div class="text-xs text-[#606060]">{{ item.create_time }}</div>
            <div class="text-xs text-[#606060]">{{ item.modify_time || item.create_time }}</div>
            <div>
              <span :class="item.is_valid === 'Y' ? 'text-[#069C56]' : 'text-[#CC0000]'">
                {{ item.is_valid === 'Y' ? l.enabled : l.disabled }}
              </span>
            </div>
            <div class="flex items-center justify-end gap-3">
               <button class="text-[#CC9900] hover:text-[#0D0D0D]" @click="previewQuestionnaire(item.id)" :title="l.preview">
                 <i class="el-icon-view text-lg"></i>
               </button>
               <button class="text-[#065FD4] hover:text-[#0D0D0D]" @click="editQuestionnaire(item.id)" :title="l.edit">
                 <i class="el-icon-edit text-lg"></i>
               </button>
               <button :class="item.is_valid === 'Y' ? 'text-[#CC0000]' : 'text-[#069C56]'" @click="toggleQuestionnaireStatus(item)">
                 <i :class="item.is_valid === 'Y' ? 'el-icon-video-pause' : 'el-icon-video-play'" class="text-lg"></i>
               </button>
            </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
     <div class="flex justify-end p-4 border-t border-[#E5E5E5] bg-white text-xs text-[#606060]">
      <div class="flex items-center gap-2">
        <span>{{ l.rowsPerPage }}:</span>
        <select
          class="border-none bg-transparent outline-none font-medium"
          v-model.number="questionnaireObj.query.pageSize"
          @change="
            questionnaireObj.query.page = 1
            getQuestionnaireList()
          ">
          <option :value="10">10</option>
          <option :value="30">30</option>
          <option :value="50">50</option>
        </select>
        <span class="mx-2">{{ (questionnaireObj.query.page - 1) * questionnaireObj.query.pageSize + 1 }}-{{ Math.min(questionnaireObj.query.page * questionnaireObj.query.pageSize, questionnaireObj.total) }} {{ l.of }} {{ questionnaireObj.total }}</span>
        <i class="el-icon-arrow-left cursor-pointer hover:bg-[#F2F2F2] p-1 rounded-full" :class="questionnaireObj.query.page <= 1 ? 'opacity-50 cursor-not-allowed' : ''" @click="questionnaireObj.query.page > 1 && handlePageChange(questionnaireObj.query.page - 1)"></i>
        <i class="el-icon-arrow-right cursor-pointer hover:bg-[#F2F2F2] p-1 rounded-full" :class="questionnaireObj.query.page >= Math.ceil(questionnaireObj.total / questionnaireObj.query.pageSize) ? 'opacity-50 cursor-not-allowed' : ''" @click="questionnaireObj.query.page < Math.ceil(questionnaireObj.total / questionnaireObj.query.pageSize) && handlePageChange(questionnaireObj.query.page + 1)"></i>
      </div>
    </div>

    <!-- Edit Questionnaire Drawer -->
    <a-drawer :visible="showObj.questionnaireDrawer" :title="l.editQuestionnaire" :width="800" @close="showObj.questionnaireDrawer = false" :body-style="{ padding: 0 }">
       <div class="flex flex-col h-full bg-white font-roboto">
          <div class="flex-1 overflow-y-auto p-6 space-y-4">
             <div class="relative group border border-[#CCCCCC] rounded px-3 py-2 focus-within:border-[#065FD4]">
                <label class="block text-xs text-[#606060] mb-1">{{ l.attachedCollege }}</label>
                <select v-model="questionnaireObj.form.college_id" class="w-full outline-none text-sm bg-transparent">
                  <option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</option>
                </select>
             </div>

             <div class="grid grid-cols-2 gap-4">
                <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.nameZh }}</label>
                  <input v-model="questionnaireObj.form.name_zh" class="w-full outline-none text-[#0D0D0D] text-sm" />
               </div>
               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.nameTw }}</label>
                  <input v-model="questionnaireObj.form.name_tw" class="w-full outline-none text-[#0D0D0D] text-sm" />
               </div>
               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.nameEn }}</label>
                  <input v-model="questionnaireObj.form.name_en" class="w-full outline-none text-[#0D0D0D] text-sm" />
               </div>
               <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                  <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.nameVi }}</label>
                  <input v-model="questionnaireObj.form.name_vi" class="w-full outline-none text-[#0D0D0D] text-sm" />
               </div>
             </div>

             <div class="mt-4">
                <div class="flex justify-between items-center mb-2">
                   <h3 class="text-sm font-medium text-[#0D0D0D]">{{ l.addQuestion }}</h3>
                   <div class="flex gap-2">
                      <button class="text-[#CC0000] text-xs font-medium uppercase hover:underline" @click="templateObj.question = []">{{ l.clear }}</button>
                      <button class="text-[#065FD4] text-xs font-medium uppercase hover:underline" @click="openDialogQuestion">{{ l.add }}</button>
                   </div>
                </div>

                <div class="border border-[#E5E5E5] rounded bg-[#F9F9F9] p-2 space-y-2">
                   <div v-if="templateObj.question.length === 0" class="text-center py-4 text-[#606060] text-sm">{{ c.noData }}</div>
                   <div v-for="(i, index) in templateObj.question" :key="index" class="bg-white border border-[#E5E5E5] rounded p-2 shadow-sm">
                      <div class="flex justify-between items-start mb-2">
                         <div class="font-medium text-sm">#{{ index + 1 }}</div>
                         <button class="text-[#CC0000] hover:text-[#990000]" @click="deleteQuestionInFrom(index)">
                            <i class="el-icon-close"></i>
                         </button>
                      </div>

                      <div class="flex gap-2 items-center mb-2">
                         <div class="bg-[#F2F2F2] px-2 py-1 text-xs text-[#606060] rounded border border-[#CCCCCC] min-w-[80px] text-center">
                            {{ returnPublicObjLabel(i.question_type,'value','label','question_type') }}
                         </div>
                         <div class="flex-1 text-sm truncate" :title="i.name_label">{{ i.name_label }}</div>
                      </div>

                      <div class="flex gap-2 items-center">
                         <div class="flex items-center border border-[#CCCCCC] rounded px-2 py-1 focus-within:border-[#065FD4]">
                            <span class="text-xs text-[#606060] mr-2 whitespace-pre">{{ l.correctScore }}</span>
                            <input v-model.number="i.score" type="number" class="w-full outline-none text-sm text-right" />
                         </div>
                      </div>

                      <!-- Rule for MultiChoice -->
                      <div v-if="i.question_type == 2" class="mt-2 flex gap-2 items-center bg-[#F9F9F9] p-2 rounded border border-[#E5E5E5]">
                         <span class="text-xs text-[#606060]">{{ l.missOptionRule }}</span>
                         <select v-model="i.rule" class="border border-[#CCCCCC] rounded text-xs p-1 outline-none">
                            <option :value="1">{{ l.missOptionScore }}</option>
                            <option :value="0">{{ l.noScoreForMissOrWrong }}</option>
                         </select>
                         <input v-if="i.rule == 1" v-model.number="i.rule_score" type="number" class="border border-[#CCCCCC] rounded w-16 px-1 py-0.5 text-xs outline-none" placeholder="Score" />
                      </div>
                   </div>
                </div>
             </div>
          </div>
          <div class="p-4 border-t border-[#E5E5E5] flex justify-end gap-2 bg-white">
            <button class="px-4 py-2 text-[#065FD4] font-medium text-sm uppercase hover:bg-[#F2F8FF] rounded-sm transition-colors" @click="showObj.questionnaireDrawer = false">
              {{ l.close }}
            </button>
            <button class="px-6 py-2 bg-[#065FD4] text-white! font-medium text-sm uppercase rounded-sm shadow-sm hover:bg-[#0551B4] transition-colors" @click="submitQuestionnaire">
              {{ l.submit }}
            </button>
          </div>
       </div>
    </a-drawer>

    <!-- Add Question Modal -->
    <a-modal v-model="showObj.questionDialog" :title="l.addQuestion" :footer="null" :width="900">
       <div class="flex flex-col h-[500px]">
          <!-- Filter -->
          <div class="flex gap-2 mb-4 flex-wrap">
             <div class="w-40 border border-[#CCCCCC] rounded px-2 py-1">
                <select v-model="questionObj.query.college_id" @change="questionCollegeChange" class="w-full outline-none text-sm bg-transparent">
                   <option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</option>
                </select>
             </div>
             <div class="flex-1 border border-[#CCCCCC] rounded px-2 py-1 flex items-center min-w-[150px]">
               <input v-model="questionObj.query.name" :placeholder="l.title" class="w-full outline-none text-sm" @keydown.enter="getQuestionList" />
             </div>
             <div class="w-40">
                <el-cascader clearable class="w-full no-border-input border border-[#CCCCCC] rounded px-2 py-1" v-model="questionObj.query.question_category_id" :options="publicCodeObj.questionCatagory" :props="{ label:'name_label',value:'id',checkStrictly:true }" :placeholder="l.catalogRoot" @change="changCatalog"></el-cascader>
             </div>
             <div class="w-32 border border-[#CCCCCC] rounded px-2 py-1">
                <select v-model="questionObj.query.question_type" @change="getQuestionList" class="w-full outline-none text-sm bg-transparent">
                   <option value="">{{ l.all }}</option>
                   <option v-for="i in publicCodeObj.question_type" :key='i.value' :value="i.value">{{ i.label }}</option>
                </select>
             </div>
             <div class="w-32 border border-[#CCCCCC] rounded px-2 py-1">
                <select v-model="questionObj.query.question_status" @change="getQuestionList" class="w-full outline-none text-sm bg-transparent">
                   <option value="">{{ l.all }}</option>
                   <option v-for="i in publicCodeObj.question_status" :key='i.value' :value="i.value">{{ i.label }}</option>
                </select>
             </div>
             <button class="bg-[#065FD4] text-white! px-4 py-1 rounded text-sm uppercase" @click="getQuestionList">{{ l.search }}</button>
          </div>

          <!-- List -->
          <div class="flex-1 overflow-y-auto border border-[#E5E5E5] rounded">
             <div class="grid grid-cols-[50px_1fr_100px_100px_100px_80px] bg-[#F9F9F9] border-b border-[#E5E5E5] px-4 py-2 text-xs font-medium text-[#606060] sticky top-0">
                <div>No</div>
                <div>{{ l.question }}</div>
                <div>{{ l.difficulty }}</div>
                <div>{{ l.questionType }}</div>
                <div>{{ l.publishStatus }}</div>
                <div class="text-right">{{ l.operation }}</div>
             </div>
             <div class="divide-y divide-[#E5E5E5]">
                <div v-for="(item, index) in questionObj.list" :key="item.id" class="grid grid-cols-[50px_1fr_100px_100px_100px_80px] px-4 py-2 hover:bg-[#F2F8FF] text-sm text-[#0D0D0D] items-center">
                   <div class="text-[#606060]">{{ index + 1 }}</div>
                   <div class="truncate" :title="item.name_label">{{ item.name_label }}</div>
                   <div>{{ item.difficulty_level }}</div>
                   <div>{{ returnPublicObjLabel(item.question_type,'value','label','question_type') }}</div>
                   <div>{{ returnPublicObjLabel(item.question_status,'value','label','question_status') }}</div>
                   <div class="text-right">
                      <button class="text-[#069C56] hover:underline uppercase text-xs font-medium" @click="selectQuestion(item)">{{ l.select }}</button>
                   </div>
                </div>
             </div>
          </div>
       </div>
    </a-modal>
  </div>
</template>

<script setup>
import { reactive, computed, watch, onMounted, ref, getCurrentInstance } from 'vue'
import { message } from 'ant-design-vue'
import store from '@/store'
import api from '@/api'
import { useLocalI18n } from '@/composables/useLocalI18n'
import { assignObject } from '@/utils'

// Hooks
const { l, c } = useLocalI18n('videoAdminQuestionnaire')
const instance = getCurrentInstance()
const route = instance.proxy.$route
const router = instance.proxy.$router
const { $request, $prompt } = instance.proxy

// State
const isAdmin = computed(() => store.getters.isAdmin)
const college_id = ref(null)

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
  question_type: [
    { label: l.value.fillBlank, value: 0 },
    { label: l.value.singleChoice, value: 1 },
    { label: l.value.multiChoice, value: 2 },
    { label: l.value.judgment, value: 3 }
  ],
  question_status: [
    { label: l.value.unpublished, value: 0 },
    { label: l.value.published, value: 1 }
  ]
})

const questionnaireObj = reactive({
  query: {
    page: 1,
    pageSize: 10,
    name: '',
    question_category_id: '',
    question_status: '',
    question_type: '',
    college_id: '',
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
    pageSize: 20,
    name: '',
    question_category_id: '',
    question_status: '',
    question_type: '',
  },
})

// Methods
const returnCollegeName = (id) => {
  let college = publicCodeObj.collegeList.find((i) => i.id == id)
  if (college) {
    return college.name_label
  } else {
    return id
  }
}

const handlePageChange = (page) => {
  questionnaireObj.query.page = page
  getQuestionnaireList()
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

const getCollegeList = () => {
  $request(api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
      resource_path: route.path
    })
    .then((r) => {
      publicCodeObj.collegeList = r.data
      college_id.value = r.data[0].id
      questionnaireObj.query.college_id = college_id.value
      getQuestionnaireList()
    })
    .catch((e) => {
      message.error(e.message)
    })
}

const getQuestionnaireList = () => {
  $request(api.baseUrl + '/Video/VideoExam/getQuestionnaireList', {
      ...questionnaireObj.query,
      college_id: college_id.value
    })
    .then(r => {
      questionnaireObj.list = r.data.list
      questionnaireObj.total = r.data.total
    })
    .catch(e => {
      console.log(e);
    })
}

const addQuestionnaire = () => {
  for (let key in questionnaireObj.form) {
    if (questionnaireObj.form.hasOwnProperty(key)) {
      if (key !== 'question') questionnaireObj.form[key] = '';
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
      assignObject(questionnaireObj.form, r.data)
      templateObj.question = r.data.questions
      showObj.questionnaireDrawer = true
    })
}

const toggleQuestionnaireStatus = (data) => {
  let msg
  let value
  if (data.is_valid == 'Y') {
    value = 'N'
    msg = l.value.confirmDisable.replace('{name}', data.name_zh)
  } else {
    value = 'Y'
    msg = l.value.confirmEnable.replace('{name}', data.name_zh)
  }
  $prompt(msg, {
      type: 'warning',
      inputPattern: /^[Y]{1}$/i,
      inputErrorMessage: l.value.inputErrorMessage,
      confirmButtonText: l.value.confirm,
      cancelButtonText: l.value.cancel
    }).then(() => {
      $request(api.baseUrl + '/Video/VideoExam/DeleteOrRecoveryQuestionnaireById', {
        key: data.id,
        value: value
      }, 'post').then(r => {
        message.success(l.value.modifySuccess)
        getQuestionnaireList()
      })
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
    return message.error(l.value.selectCollege)
  }
  if (questionnaireObj.form.name_zh == '') {
    return message.error(l.value.inputNameZh)
  }
  if (templateObj.question.length == 0) {
    return message.error(l.value.addQuestionsToPaper)
  } else {
    questionnaireObj.form.question = templateObj.question
  }
  $request(api.baseUrl + '/Video/VideoExam/addOrModifyQuestionnarie', questionnaireObj.form,
      'post')
    .then(r => {
      if (r.httpCode == 200) {
        message.success(l.value.submitSuccess)
        let timer = setTimeout(() => {
          showObj.questionnaireDrawer = false
          getQuestionnaireList()
          clearTimeout(timer)
        }, 1500)
      }
    })
}

// Question Dialog
const openDialogQuestion = () => {
  questionObj.query.college_id = college_id.value
  showObj.questionDialog = true
  getQuestionCatagoryList()
  getQuestionList()
}

const questionCollegeChange = () => {
  questionObj.query.question_category_id = ""
  getQuestionList()
  getQuestionCatagoryList()
}

const changCatalog = (v) => {
  if (v && v.length > 0) {
    questionObj.query.question_category_id = v[v.length - 1]
  } else {
    questionObj.query.question_category_id = ''
  }
  getQuestionList()
}

const getQuestionCatagoryList = () => {
  $request(api.videoServer + '/Video/VideoExam/getQuestionCatagoryList', {
    is_valid: '',
    college_id: questionObj.query.college_id
  }).then(r => {
    if (r.status) {
      publicCodeObj.questionCatagory = r.data
    }
  })
}

const getQuestionList = () => {
  $request(api.baseUrl + '/Video/VideoExam/getQuestionList', {
      ...questionObj.query
    })
    .then(r => {
      questionObj.list = r.data.list
      questionObj.total = r.data.total
    })
    .catch(e => {
      console.log(e);
    })
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

const deleteQuestionInFrom = (index) => {
  templateObj.question.splice(index, 1)
}

onMounted(() => {
  getCollegeList()
})

watch(college_id, (val) => {
  if (val) {
    questionnaireObj.query.college_id = val
  }
})

</script>

<style scoped>
.no-border-input :deep(.el-input__inner) {
  border: none !important;
  height: 24px !important;
  line-height: 24px !important;
  padding: 0 !important;
}
.no-border-input :deep(.el-input__icon) {
  line-height: 24px !important;
}
</style>
