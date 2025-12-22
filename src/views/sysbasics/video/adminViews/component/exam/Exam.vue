<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.examManagement }}</h1>

      <div class="flex gap-2">
        <button class="flex items-center gap-2 px-4 py-2 bg-[#CC0000] text-white! font-medium text-sm uppercase rounded-sm hover:bg-[#990000] transition-colors shadow-sm" @click="addExam">
          <i class="el-icon-plus text-lg"></i>
          <span>{{ l.newExamButton }}</span>
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="px-6 pt-6 pb-2 border-b border-[#E5E5E5] bg-white sticky top-0 z-20">
      <div class="flex items-center gap-6 text-sm font-medium text-[#606060]">
        <button
          class="pb-3 border-b-2 transition-colors"
          :class="examObj.query.is_valid === '' ? 'text-[#0D0D0D] border-[#0D0D0D]' : 'border-transparent hover:text-[#0D0D0D]'"
          @click="
            examObj.query.is_valid = ''
            getExamList()
          ">
          {{ l.allStatusOption }}
        </button>
        <button
          class="pb-3 border-b-2 transition-colors"
          :class="examObj.query.is_valid === 'Y' ? 'text-[#0D0D0D] border-[#0D0D0D]' : 'border-transparent hover:text-[#0D0D0D]'"
          @click="
            examObj.query.is_valid = 'Y'
            getExamList()
          ">
          {{ l.enabledStatusOption }}
        </button>
        <button
          class="pb-3 border-b-2 transition-colors"
          :class="examObj.query.is_valid === 'N' ? 'text-[#0D0D0D] border-[#0D0D0D]' : 'border-transparent hover:text-[#0D0D0D]'"
          @click="
            examObj.query.is_valid = 'N'
            getExamList()
          ">
          {{ l.disabledStatusOption }}
        </button>
      </div>

      <!-- Filters Row -->
      <div class="mt-4 flex items-center gap-4 mb-2">
        <!-- College Select Dropdown -->
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
                    getExamList()
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

        <!-- Search Filter -->
        <div class="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-[#CCCCCC] rounded hover:border-[#606060] transition-colors focus-within:border-[#065FD4]">
          <i class="el-icon-search text-[#606060] text-lg"></i>
          <input v-model="examObj.query.name" type="text" :placeholder="l.titleFilter" class="bg-transparent border-none outline-none text-sm w-full placeholder-[#999999]" @change="getExamList" />
        </div>
      </div>
    </div>

    <!-- Content List -->
    <div class="flex-1 overflow-y-auto bg-white">
      <!-- Header -->
      <div class="grid grid-cols-[50px_2fr_1fr_1fr_1fr_1.5fr_1.5fr_1fr_180px] gap-4 px-6 py-2 border-b border-[#E5E5E5] text-xs font-medium text-[#606060] bg-white sticky top-0 z-10">
        <div>No</div>
        <div>{{ l.examNameColumn }}</div>
        <div>{{ l.passScoreColumn }}</div>
        <div>{{ l.maxReplyNumColumn }}</div>
        <div>{{ l.testDurationColumn }}</div>
        <div>{{ l.startTimeColumn }}</div>
        <div>{{ l.endTimeColumn }}</div>
        <div>{{ l.isValidColumn }}</div>
        <div class="text-right">{{ l.operationColumn }}</div>
      </div>

      <!-- List -->
      <div class="divide-y divide-[#E5E5E5]">
        <div v-if="examObj.list.length === 0" class="flex flex-col items-center justify-center py-20">
          <div class="w-32 h-32 bg-[#F9F9F9] rounded-full flex items-center justify-center mb-4">
            <i class="el-icon-document text-4xl text-[#CCCCCC]"></i>
          </div>
          <p class="text-[#0D0D0D]">{{ c.noData }}</p>
        </div>
        <div v-else v-for="(item, index) in examObj.list" :key="item.id" class="grid grid-cols-[50px_2fr_1fr_1fr_1fr_1.5fr_1.5fr_1fr_180px] gap-4 px-6 py-3 hover:bg-[#F9F9F9] items-center text-sm text-[#0D0D0D]">
          <div class="text-[#606060]">{{ (examObj.query.page - 1) * examObj.query.pageSize + index + 1 }}</div>
          <div class="font-medium truncate" :title="item.name_label">{{ item.name_label }}</div>
          <div>{{ item.pass_score }}</div>
          <div>{{ item.max_reply_num }}</div>
          <div>{{ item.test_duration }}</div>
          <div class="text-xs text-[#606060]">{{ item.start_time }}</div>
          <div class="text-xs text-[#606060]">{{ item.end_time }}</div>
          <div>
            <span :class="item.is_valid === 'Y' ? 'text-[#069C56]' : 'text-[#CC0000]'">
              {{ item.is_valid === 'Y' ? l.statusEnabled : l.statusDisabled }}
            </span>
          </div>
          <div class="flex items-center justify-end gap-3">
            <button class="text-[#065FD4] hover:underline uppercase text-xs font-medium" @click="previewExam(item.questionnaire_id)">
              <i class="el-icon-view text-lg"></i>
            </button>
            <button class="text-[#606060] hover:text-[#0D0D0D]" @click="editExam(item)">
              <i class="el-icon-edit text-lg"></i>
            </button>
            <button class="" :class="item.is_valid === 'Y' ? 'text-[#CC0000]' : 'text-[#069C56]'" @click="toggleExamStatus(item)">
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
          v-model.number="examObj.query.pageSize"
          @change="
            examObj.query.page = 1
            getExamList()
          ">
          <option :value="10">10</option>
          <option :value="30">30</option>
          <option :value="50">50</option>
        </select>
        <span class="mx-2">{{ (examObj.query.page - 1) * examObj.query.pageSize + 1 }}-{{ Math.min(examObj.query.page * examObj.query.pageSize, examObj.total) }} {{ l.of }} {{ examObj.total }}</span>
        <i class="el-icon-arrow-left cursor-pointer hover:bg-[#F2F2F2] p-1 rounded-full" :class="examObj.query.page <= 1 ? 'opacity-50 cursor-not-allowed' : ''" @click="examObj.query.page > 1 && handlePageChange(examObj.query.page - 1)"></i>
        <i class="el-icon-arrow-right cursor-pointer hover:bg-[#F2F2F2] p-1 rounded-full" :class="examObj.query.page >= Math.ceil(examObj.total / examObj.query.pageSize) ? 'opacity-50 cursor-not-allowed' : ''" @click="examObj.query.page < Math.ceil(examObj.total / examObj.query.pageSize) && handlePageChange(examObj.query.page + 1)"></i>
      </div>
    </div>

    <!-- Edit Exam Drawer -->
    <a-drawer :visible="showObj.examDrawer" :title="l.editExam" :width="600" @close="showObj.examDrawer = false" :body-style="{ padding: 0 }">
      <div class="flex flex-col bg-white font-roboto absolute top-[55px] left-0 right-0 bottom-0">
        <div class="flex-1 overflow-y-auto p-6">
          <!-- College -->
          <div class="mb-6">
            <label class="block text-xs text-[#606060] mb-1">{{ l.belongCollege }}</label>
            <div class="relative group border border-[#CCCCCC] rounded px-3 py-2 focus-within:border-[#065FD4]">
              <select v-model="examObj.form.college_id" class="w-full outline-none text-sm bg-transparent">
                <option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</option>
              </select>
            </div>
          </div>

          <!-- Names -->
          <div class="mb-4 space-y-4">
            <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.chineseName }}</label>
              <input v-model="examObj.form.name_zh" class="w-full outline-none text-[#0D0D0D] text-sm" />
            </div>
            <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.traditionalChineseName }}</label>
              <input v-model="examObj.form.name_tw" class="w-full outline-none text-[#0D0D0D] text-sm" />
            </div>
            <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.englishName }}</label>
              <input v-model="examObj.form.name_en" class="w-full outline-none text-[#0D0D0D] text-sm" />
            </div>
            <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.vietnameseName }}</label>
              <input v-model="examObj.form.name_vi" class="w-full outline-none text-[#0D0D0D] text-sm" />
            </div>
          </div>

          <!-- Questionnaire Select -->
          <div class="mb-6">
            <label class="block text-xs text-[#606060] mb-1">{{ l.bindQuestionnaire }}</label>
            <div class="flex gap-2">
              <div class="flex-1 border border-[#CCCCCC] rounded px-3 py-2 bg-[#F9F9F9] text-sm text-[#0D0D0D]">
                {{ examObj.form.exam_name_zh || 'Not Selected' }}
              </div>
              <button class="bg-[#069C56] text-white! px-4 py-2 rounded text-sm uppercase font-medium shadow-sm hover:bg-[#058045]" @click="showObj.questionnaireDialog = true">
                {{ l.select }}
              </button>
            </div>
          </div>

          <!-- Time & Settings -->
          <div class="grid grid-cols-2 gap-4 mb-6">
            <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5">{{ l.startTime }}</label>
              <el-date-picker v-model="examObj.form.start_time" type="datetime" :placeholder="l.chooseStartTime" style="width: 100%; border: none" class="no-border-input"></el-date-picker>
            </div>
            <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5">{{ l.endTime }}</label>
              <el-date-picker v-model="examObj.form.end_time" type="datetime" :placeholder="l.chooseEndTime" style="width: 100%; border: none" class="no-border-input"></el-date-picker>
            </div>
          </div>

          <div class="space-y-4">
            <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.maxAnswerTimes }}</label>
              <input v-model.number="examObj.form.max_reply_num" type="number" class="w-full outline-none text-[#0D0D0D] text-sm" />
            </div>
            <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.passScore }}</label>
              <input v-model.number="examObj.form.pass_score" type="number" class="w-full outline-none text-[#0D0D0D] text-sm" />
            </div>
            <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
              <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.examDuration }} (min)</label>
              <input v-model="examObj.form.test_duration" type="number" class="w-full outline-none text-[#0D0D0D] text-sm" />
            </div>
          </div>
        </div>
        <!-- Footer -->
        <div class="p-4 border-t border-[#E5E5E5] flex justify-end gap-2 bg-white">
          <button class="px-4 py-2 text-[#065FD4] font-medium text-sm uppercase hover:bg-[#F2F8FF] rounded-sm transition-colors" @click="showObj.examDrawer = false">
            {{ l.close }}
          </button>
          <button class="px-6 py-2 bg-[#065FD4] text-white! font-medium text-sm uppercase rounded-sm shadow-sm hover:bg-[#0551B4] transition-colors" @click="submitExam">
            {{ l.submit }}
          </button>
        </div>
      </div>
    </a-drawer>

    <!-- Questionnaire Selection Modal -->
    <a-modal v-model="showObj.questionnaireDialog" :title="l.select + ' ' + l.bindQuestionnaire" :footer="null" :width="800">
      <div class="flex flex-col h-[500px]">
        <!-- Filter -->
        <div class="flex gap-4 mb-4">
          <div class="w-48 relative border border-[#CCCCCC] rounded px-2 py-1">
            <select v-model="questionnaireObj.query.college_id" @change="getQuestionnaireList" class="w-full outline-none text-sm bg-transparent">
              <option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</option>
            </select>
          </div>
          <div class="flex-1 border border-[#CCCCCC] rounded px-2 py-1 flex items-center">
            <input v-model="questionnaireObj.query.name" :placeholder="l.titleFilter" class="w-full outline-none text-sm" />
          </div>
          <button class="bg-[#065FD4] text-white! px-4 py-1 rounded text-sm uppercase" @click="getQuestionnaireList">{{ l.search }}</button>
        </div>

        <!-- List -->
        <div class="flex-1 overflow-y-auto border border-[#E5E5E5] rounded">
          <div class="grid grid-cols-[40px_1fr_1fr_1fr_1fr_80px] bg-[#F9F9F9] border-b border-[#E5E5E5] px-4 py-2 text-xs font-medium text-[#606060] sticky top-0">
            <div>No</div>
            <div>{{ l.nameZhColumn }}</div>
            <div>{{ l.nameTwColumn }}</div>
            <div>{{ l.nameEnColumn }}</div>
            <div>{{ l.nameViColumn }}</div>
            <div class="text-right">{{ l.operationColumn }}</div>
          </div>
          <div class="divide-y divide-[#E5E5E5]">
            <div v-for="(item, index) in questionnaireObj.list" :key="item.id" class="grid grid-cols-[40px_1fr_1fr_1fr_1fr_80px] px-4 py-2 hover:bg-[#F2F8FF] text-sm text-[#0D0D0D] items-center">
              <div class="text-[#606060]">{{ index + 1 }}</div>
              <div class="truncate">{{ item.name_zh }}</div>
              <div class="truncate">{{ item.name_tw }}</div>
              <div class="truncate">{{ item.name_en }}</div>
              <div class="truncate">{{ item.name_vi }}</div>
              <div class="text-right">
                <button class="text-[#069C56] font-medium hover:underline uppercase text-xs" @click="selectQueertionnarire(item)">{{ l.chooseButton }}</button>
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
const { l, c } = useLocalI18n('videoAdminExam')
const instance = getCurrentInstance()
const route = instance.proxy.$route
const router = instance.proxy.$router
const { $request, $prompt } = instance.proxy

// State
const isAdmin = computed(() => store.getters.isAdmin)
const college_id = ref(null)

const showObj = reactive({
  questionnaireDialog: false,
  examDrawer: false,
  recordDialog: false,
})

const publicCodeObj = reactive({
  collegeList: [],
  question_type: [
    { label: l.value.blankQuestion, value: 0 },
    { label: l.value.singleChoiceQuestion, value: 1 },
    { label: l.value.multipleChoiceQuestion, value: 2 },
    { label: l.value.trueFalseQuestion, value: 3 },
  ],
  question_status: [
    { label: l.value.notPublished, value: 0 },
    { label: l.value.published, value: 1 },
  ],
})

const questionnaireObj = reactive({
  query: {
    page: 1,
    pageSize: 50, // Increase page size for modal
    college_id: '',
    name: '',
  },
  list: [],
})

const examObj = reactive({
  query: {
    page: 1,
    pageSize: 10,
    is_valid: '',
    name: '',
  },
  form: {
    id: '',
    college_id: '',
    questionnaire_id: '',
    exam_name_zh: '',
    name_zh: '',
    name_tw: '',
    name_en: '',
    name_vi: '',
    start_time: '',
    end_time: '',
    max_reply_num: '',
    pass_score: '',
    test_duration: '',
  },
  list: [],
  total: 0,
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

const getCollegeList = () => {
  $request(api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
    resource_path: route.path,
  })
    .then((r) => {
      publicCodeObj.collegeList = r.data
      college_id.value = r.data[0].id
      questionnaireObj.query.college_id = college_id.value
      getExamList()
    })
    .catch((e) => {
      message.error(e.message)
    })
}

const handlePageChange = (page) => {
  examObj.query.page = page
  getExamList()
}

const getExamList = () => {
  $request(api.baseUrl + '/Video/VideoExam/getExamList', {
    ...examObj.query,
    college_id: college_id.value,
  })
    .then((r) => {
      examObj.list = r.data.list
      examObj.total = r.data.total
    })
    .catch((e) => {
      console.log(e)
    })
}

const addExam = () => {
  for (let key in examObj.form) {
    if (examObj.form.hasOwnProperty(key)) {
      examObj.form[key] = ''
    }
  }
  showObj.examDrawer = true
}

const editExam = (data) => {
  assignObject(examObj.form, data)
  showObj.examDrawer = true
}

const submitExam = () => {
  if (examObj.form.name_zh == '') {
    return message.error(l.value.pleaseEnterExamName)
  }
  if (examObj.form.questionnaire_id == '') {
    return message.error(l.value.pleaseBindQuestionnaire)
  }

  $request(api.baseUrl + '/Video/VideoExam/addExam', examObj.form, 'post').then((r) => {
    if (r.httpCode == 200) {
      message.success(l.value.submitSuccess)
      let timer = setTimeout(() => {
        showObj.examDrawer = false
        getExamList()
        clearTimeout(timer)
      }, 1500)
    }
  })
}

const toggleExamStatus = (data) => {
  let msg
  let value
  if (data.is_valid == 'Y') {
    msg = l.value.disableConfirmMessage.replace('{name}', data.name_zh)
    value = 'N'
  } else {
    msg = l.value.enableConfirmMessage.replace('{name}', data.name_zh)
    value = 'Y'
  }

  $prompt(msg, {
    type: 'warning',
    inputPattern: /^[Y]{1}$/i,
    inputErrorMessage: l.value.inputValidationFailed,
    confirmButtonText: l.value.confirmButtonText,
    cancelButtonText: l.value.cancelButtonText,
  })
    .then(() => {
      $request(
        api.baseUrl + '/Video/VideoExam/DeleteOrRecoveryExamById',
        {
          key: data.id,
          value: value,
        },
        'post'
      ).then((r) => {
        message.success(l.value.operationSuccess)
        getExamList()
      })
    })
    .catch(() => {
      console.log('cancel')
    })
}

const previewExam = (id) => {
  let url = router.resolve({
    name: 'examDetail',
    query: {
      train_id: '',
      course_id: '',
      exam_id: '',
      questionnaire_id: id,
      mode: 'preview',
    },
  }).href
  window.open(url, '_blank')
}

// Questionnaire Dialog Methods
const getQuestionnaireList = () => {
  $request(api.baseUrl + '/Video/VideoExam/getQuestionnaireList', {
    ...questionnaireObj.query,
  })
    .then((r) => {
      questionnaireObj.list = r.data.list
    })
    .catch((e) => {
      console.log(e)
    })
}

const selectQueertionnarire = (data) => {
  examObj.form.questionnaire_id = data.id
  examObj.form.exam_name_zh = data.name_zh
  showObj.questionnaireDialog = false
}

// Lifecycle
onMounted(() => {
  getCollegeList()
})

watch(
  () => showObj.questionnaireDialog,
  (val) => {
    if (val) {
      getQuestionnaireList()
    }
  }
)

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
