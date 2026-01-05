<template>
  <div class="h-screen w-screen bg-[#F9F9F9] flex flex-col font-roboto overflow-hidden" :class="{ 'blur-sm': isBlur }" v-show="exam.questions.length">
    <!-- Header -->
    <header class="h-[64px] bg-white border-b border-[#E5E5E5] flex items-center justify-between px-6 shrink-0 z-50">
      <div class="flex items-center gap-4">
        <div class="w-8 h-8 rounded-full bg-[#FF0000] flex items-center justify-center text-white font-bold text-xs">{{ l.examTag }}</div>
        <h1 class="text-lg font-medium text-[#0D0D0D] truncate max-w-[400px] mb-0!" :title="exam.name_label">
          {{ exam.name_label }}
        </h1>
      </div>

      <div class="flex items-center gap-6">
        <!-- Timer -->
        <div v-show="timerInitialized || remainingTime > 0" class="flex items-center gap-2 px-4 py-1.5 bg-[#F2F2F2] rounded text-[#0D0D0D] font-mono text-lg font-medium" :class="{ 'text-[#CC0000]! bg-[#FFE6E6]': remainingTime < 300 }">
          <i class="el-icon-timer text-xl"></i>
          <span>{{ formattedTime }}</span>
        </div>

        <!-- Warning Counter -->
        <div v-if="warningCount > 0" class="flex items-center gap-2 text-[#CC0000] font-medium animate-pulse">
          <i class="el-icon-warning text-lg"></i>
          <span>{{ l.warnings }}: {{ warningCount }}/3</span>
        </div>

        <!-- Submit Button -->
        <button v-show="params.mode == 'exam'" @click="confirmSubmit" class="px-6 py-2 bg-[#065FD4] text-white! font-medium uppercase text-sm rounded shadow-sm hover:bg-[#0551B4] transition-colors">
          {{ l.submit }}
        </button>
        <button v-show="params.mode == 'review' || params.mode == 'preview'" @click="closeTab" class="px-6 py-2 bg-[#065FD4] text-white! font-medium uppercase text-sm rounded shadow-sm hover:bg-[#0551B4] transition-colors">
          {{ l.close }}
        </button>
        <button v-show="params.mode == 'read'" @click="submitModifyScore" class="px-6 py-2 bg-[#FF6B6B] text-white! font-medium uppercase text-sm rounded shadow-sm hover:bg-[#E63946] transition-colors">
          {{ l.modifyScore }}
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden relative">
      <!-- Overlay: Fullscreen Required (if require_fullscreen = true) -->
      <div v-if="!isFullscreen && !isSubmitted && params.mode == 'exam' && antiCheatSettings.require_fullscreen" class="absolute inset-0 z-[100] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
        <div class="w-20 h-20 bg-[#F2F2F2] rounded-full flex items-center justify-center mb-6">
          <i class="el-icon-full-screen text-4xl text-[#065FD4]"></i>
        </div>
        <h2 class="text-2xl font-medium text-[#0D0D0D] mb-2">{{ l.fullscreenRequired }}</h2>
        <p class="text-[#606060] mb-8 max-w-md">{{ l.fullscreenDescription }}</p>
        <button @click="enterFullscreen" class="px-8 py-3 bg-[#065FD4] text-white! font-medium uppercase text-sm rounded shadow hover:bg-[#0551B4] transition-colors">
          {{ l.enterFullscreen }}
        </button>
      </div>

      <!-- Overlay: Start Exam (if require_fullscreen = false) -->
      <div v-if="!isFullscreen && !isSubmitted && params.mode == 'exam' && !antiCheatSettings.require_fullscreen" class="absolute inset-0 z-100 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
        <div class="w-20 h-20 bg-[#F2F2F2] rounded-full flex items-center justify-center mb-6">
          <i class="el-icon-document text-4xl text-[#065FD4]"></i>
        </div>
        <h2 class="text-2xl font-medium text-[#0D0D0D] mb-2">{{ l.readyToStart }}</h2>
        <p class="text-[#606060] mb-8 max-w-md">{{ l.readyToStartDesc }}</p>
        <button @click="startExam" class="px-8 py-3 bg-[#065FD4] text-white! font-medium uppercase text-sm rounded shadow hover:bg-[#0551B4] transition-colors">
          {{ l.startButton }}
        </button>
      </div>
      <!-- Left: Question List (Sidebar) -->
      <div class="w-[300px] bg-white border-r border-[#E5E5E5] flex flex-col shrink-0 overflow-hidden transition-all duration-300" :class="{ '-ml-[300px]': !showSidebar }">
        <div class="p-4 border-b border-[#E5E5E5] flex items-center justify-between">
          <span class="font-medium text-[#0D0D0D]">{{ l.questionList }}</span>
          <span class="text-xs text-[#606060]">{{ answeredCount }}/{{ totalQuestions }}</span>
        </div>
        <div class="flex-1 overflow-y-auto p-4">
          <div class="grid grid-cols-5 gap-2">
            <button v-for="(q, index) in exam.questions" :key="q.id" @click="scrollToQuestion(index)" class="w-10 h-10 rounded flex items-center justify-center text-sm font-medium transition-colors border" :class="[flagObj.currentIndex === index ? 'border-[#065FD4] ring-1 ring-[#065FD4] z-10' : 'border-transparent', replyObj.questions[index].check ? 'bg-[#E5F2FF] text-[#065FD4]' : 'bg-[#F2F2F2] text-[#606060] hover:bg-[#E5E5E5]']">
              {{ index + 1 }}
            </button>
          </div>
        </div>
        <div class="p-4 border-t border-[#E5E5E5] bg-[#F9F9F9] text-xs text-[#606060]">
          <div class="flex items-center gap-2 mb-2">
            <div class="w-3 h-3 bg-[#E5F2FF] rounded border border-[#065FD4]"></div>
            <span>{{ l.answered }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div class="w-3 h-3 bg-[#F2F2F2] rounded border border-[#E5E5E5]"></div>
            <span>{{ l.unanswered }}</span>
          </div>
        </div>
      </div>

      <!-- Toggle Sidebar Button -->
      <button @click="showSidebar = !showSidebar" class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-6 h-12 bg-white border border-l-0 border-[#E5E5E5] rounded-r flex items-center justify-center shadow-sm text-[#606060] hover:text-[#065FD4]" :style="{ left: showSidebar ? '300px' : '0' }">
        <i :class="showSidebar ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
      </button>

      <!-- Center: Question Area -->
      <div class="flex-1 overflow-y-auto bg-[#F9F9F9] p-8 scroll-smooth" id="questions-container">
        <div class="max-w-4xl mx-auto space-y-6">
          <div v-for="(q, index) in exam.questions" :key="q.id" :id="'q-' + index" class="bg-white rounded border border-[#E5E5E5] p-6 shadow-sm scroll-mt-24 group transition-shadow hover:shadow-md" :class="{ 'ring-2 ring-[#065FD4] ring-opacity-50': flagObj.currentIndex === index }" @click="flagObj.currentIndex = index">
            <!-- Question Header -->
            <div class="flex items-start gap-4 mb-4">
              <div class="text-[#065FD4] font-medium text-lg min-w-[30px]">{{ index + 1 }}.</div>
              <div class="flex-1">
                <div class="text-[#0D0D0D] text-lg leading-relaxed mb-2 select-none">
                  {{ q.name_label }}
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 bg-[#F2F2F2] text-[#606060] text-xs rounded uppercase font-medium">
                    {{ getQuestionTypeName(q.question_type) }}
                  </span>
                  <span class="px-2 py-0.5 bg-[#F2F2F2] text-[#606060] text-xs rounded font-medium">{{ q.score }} {{ l.point }}</span>
                </div>
              </div>
            </div>

            <!-- Options / Input -->
            <div class="pl-[46px]">
              <!-- Single Choice -->
              <div v-if="q.question_type === 1 || q.question_type === 3" class="space-y-3">
                <label v-for="(opt, optIndex) in q.options" :key="optIndex" class="flex items-center gap-3 p-3 rounded border border-transparent hover:bg-[#F9F9F9] cursor-pointer transition-colors group/opt" :class="{ 'bg-[#E5F2FF]! border-[#065FD4]!': isSelected(index, opt.id) }">
                  <div class="relative flex items-center justify-center w-5 h-5">
                    <input type="radio" :name="'q-' + q.id" :value="opt.id" v-model="replyObj.questions[index].check" :disabled="params.mode == 'read' || params.mode == 'review'" @change="radioChange" class="appearance-none w-5 h-5 border-2 border-[#606060] rounded-full checked:bg-[#065FD4] checked:border-[#065FD4] transition-colors" />
                    <div class="w-2 h-2 bg-white rounded-full absolute opacity-0" :class="{ 'opacity-100': isSelected(index, opt.id) }"></div>
                  </div>
                  <span class="text-[#0D0D0D] select-none">{{ opt.name_label }}</span>
                </label>
              </div>

              <!-- Multiple Choice -->
              <div v-else-if="q.question_type === 2" class="space-y-3">
                <label v-for="(opt, optIndex) in q.options" :key="optIndex" class="flex items-center gap-3 p-3 rounded border border-transparent hover:bg-[#F9F9F9] cursor-pointer transition-colors group/opt" :class="{ 'bg-[#E5F2FF]! border-[#065FD4]!': isSelected(index, opt.id) }">
                  <div class="relative flex items-center justify-center w-5 h-5">
                    <input type="checkbox" :value="opt.id" :checked="isSelected(index, opt.id)" :disabled="params.mode == 'read' || params.mode == 'review'" @change="checkBoxChange(index)" class="appearance-none w-5 h-5 border-2 border-[#606060] rounded-sm checked:bg-[#065FD4] checked:border-[#065FD4] transition-colors" />
                    <i v-if="isSelected(index, opt.id)" class="el-icon-check absolute text-white text-xs"></i>
                  </div>
                  <span class="text-[#0D0D0D] select-none">{{ opt.name_label }}</span>
                </label>
              </div>

              <!-- Text Input -->
              <div v-else-if="q.question_type === 0" class="relative">
                <textarea v-model="replyObj.questions[index].check" rows="4" :disabled="params.mode == 'read' || params.mode == 'review'" @input="fillinChange" class="w-full border border-[#CCCCCC] rounded p-3 text-[#0D0D0D] outline-none focus:border-[#065FD4] focus:ring-1 focus:ring-[#065FD4] transition-all resize-none bg-[#FAFAFA] focus:bg-white disabled:bg-[#F5F5F5] disabled:cursor-not-allowed" :placeholder="l.typeAnswerHere"></textarea>
              </div>
            </div>

            <!-- Review Mode: Show Answers and Score -->
            <div class="q_anwser" v-show="params.mode == 'review' || params.mode == 'read'" style="margin-top: 20px">
              <div class="score">
                {{ l.yourScore }}：
                <span style="color: #409fee">{{ replyObj.questions[index].real_score }}</span>
              </div>
              <div class="anwser">
                {{ l.yourAnswer }}：
                <span style="color: #409fee">{{ replyObj.questions[index].answer }}</span>
              </div>
              <div class="anwser">
                {{ l.realAnswer }}：
                <span style="color: #409fee">{{ replyObj.questions[index].realAnswer }}</span>
              </div>
            </div>

            <!-- Modify Score Section -->
            <div class="q_score" v-if="params.mode == 'read'" style="margin-top: 20px">
              <div class="anwser">
                {{ l.modifyScore }}：
                <span style="color: #409fee"><el-input v-model.number="modifyScoreObj.detail[index].score"></el-input></span>
              </div>
              <div class="anwser">
                {{ l.modifyRemark }}：
                <span style="color: #409fee"><el-input v-model="modifyScoreObj.detail[index].remark"></el-input></span>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Submit -->
        <div class="max-w-4xl mx-auto mt-8 flex justify-end gap-4">
          <button v-show="params.mode == 'exam'" @click="confirmSubmit" class="px-8 py-3 bg-[#065FD4] text-white! font-medium uppercase text-sm rounded shadow hover:bg-[#0551B4] transition-colors">
            {{ l.submit }}
          </button>
          <el-button v-show="params.mode == 'preview'" type="primary" @click="closeTab">{{ l.close }}</el-button>
        </div>
      </div>

      <!-- Right Sidebar for Review/Preview Mode -->
      <div v-if="params.mode == 'review' || params.mode == 'read' || params.mode == 'preview'" class="w-[280px] bg-white border-l border-[#E5E5E5] flex flex-col shrink-0 p-4 overflow-y-auto">
        <div class="result mb-4" v-show="params.mode == 'review' || params.mode == 'read'">
          <div class="item mb-4">
            <div style="font-size: 26px; font-weight: bold">{{ params.score }}</div>
            <div>
              <el-button type="success" plain>{{ l.qualified }}</el-button>
            </div>
          </div>
          <div class="item">
            <div style="margin-bottom: 8px">{{ l.answerSheet }}</div>
            <div style="color: #606060; font-size: 12px">{{ l.examinee }}：{{ user.userName }}</div>
          </div>
        </div>

        <div class="result" v-show="params.mode == 'preview'">
          <div class="item">
            <div>{{ l.answerSheet }}</div>
            <div style="color: #606060; font-size: 12px">{{ l.examinee }}：{{ user.userName }}</div>
          </div>
        </div>

        <div class="examcard">
          <div class="desc" style="text-align: center; padding: 20px 0; font-size: 12px; color: #606060">-{{ l.totalQuestions }} {{ exam.questions.length }} {{ l.totalQuestionsLast }}，{{ l.totalScore }} {{ exam.total_score }} {{ l.point }}-</div>
          <div v-show="params.mode == 'review' || params.mode == 'read'">
            <div class="num" style="justify-content: space-evenly; margin-bottom: 20px">
              <div class="num-item">
                <span style="font-size: 20px; color: limegreen; margin-right: 5px">{{ examNum.correct }}</span>
                {{ l.correct }}
              </div>
              <div class="num-item">
                <span style="font-size: 20px; color: orangered; margin-right: 5px">{{ examNum.error }}</span>
                {{ l.error }}
              </div>
              <div class="num-item">
                <span style="font-size: 20px; color: orange; margin-right: 5px">{{ examNum.half }}</span>
                {{ l.half }}
              </div>
            </div>
            <div class="card" style="display: flex; flex-wrap: wrap">
              <div
                class="num"
                @click="flagObj.currentIndex = index"
                v-for="(i, index) in replyObj.questions"
                :key="i.id"
                :style="{
                  width: '32px',
                  height: '32px',
                  margin: '5px',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: 'white',
                  backgroundColor: i.real_score == 0 ? 'orangered' : i.real_score == i.score ? 'limegreen' : 'orange',
                }">
                <span>{{ index + 1 }}</span>
              </div>
            </div>
          </div>
          <div v-show="params.mode == 'preview' || params.mode == 'exam'">
            <div class="num" style="justify-content: space-evenly; margin-bottom: 20px">
              <div class="num-item">
                <span style="font-size: 20px; margin-right: 5px">{{ examNum.done }}</span>
                {{ l.done }}
              </div>
              <div class="num-item">
                <span style="font-size: 20px; margin-right: 5px">{{ examNum.todo }}</span>
                {{ l.todo }}
              </div>
            </div>
            <div class="card" style="display: flex; flex-wrap: wrap">
              <div
                class="num"
                @click="flagObj.currentIndex = index"
                v-for="(i, index) in replyObj.questions"
                :key="i.id"
                :style="{
                  width: '32px',
                  height: '32px',
                  margin: '5px',
                  borderRadius: '50%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  color: flagObj.currentIndex == index ? 'white' : i.check && i.check.length ? 'white' : 'black',
                  backgroundColor: flagObj.currentIndex == index ? '#409fee' : i.check && i.check.length ? '#00aa00' : '#ddd',
                }">
                <span>{{ index + 1 }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { useLocalI18n } from '@/composables/useLocalI18n'
import api from '@/api/index.js'

const { proxy } = getCurrentInstance()
const { $request, $message, $confirm, $router, $route, $store, $api } = proxy
const { l, c } = useLocalI18n('videoUserExamDetail')

const modifyScoreObj = reactive({
  reply_id: '',
  questionnaire_id: '',
  detail: [
    {
      score: '',
    },
  ],
})

const params = reactive({
  class_id: '',
  exam_id: '',
  train_id: '',
  course_id: '',
  questionnaire_id: '',
  reply_id: '',
  mode: '',
  score: 0,
})

const flagObj = reactive({
  currentIndex: 0,
  submitted: false,
})

const exam = reactive({
  total_score: 0,
  name_label: '',
  questions: [
    {
      name_label: '',
    },
  ],
})

const replyObj = reactive({
  exam_id: '',
  train_id: '',
  course_id: '',
  questionnaire_id: '',
  class_id: '',
  questions: [
    {
      id: '',
      question_id: '',
      questionnaire_id: '',
      score: '',
      options: [
        {
          id: '',
          question_id: '',
          value: '',
        },
      ],
      check: '',
      answer: '',
      realAnswer: '',
    },
  ],
})

const examNum = reactive({
  done: 0,
  todo: 0,
  correct: 0,
  error: 0,
  half: 0,
})

const showSidebar = ref(true)
const isFullscreen = ref(false)
const isSubmitted = ref(false)
const isBlur = ref(false)
const warningCount = ref(0)
const remainingTime = ref(0) // seconds
const timerInitialized = ref(false) // Track if timer has been started

// Anti-cheating settings from API
const antiCheatSettings = reactive({
  forbid_copy: false,
  detect_tab_switch: false,
  require_fullscreen: false
})

let timerInterval = null
let isPassSubmit = false // Flag để bypass kiểm tra todo khi gian lận

const formattedTime = computed(() => {
  const h = Math.floor(remainingTime.value / 3600)
  const m = Math.floor((remainingTime.value % 3600) / 60)
  const s = remainingTime.value % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

const publicCodeObj = computed(() => ({
  question_type: [
    {
      label: l.value.fillIn,
      value: 0,
    },
    {
      label: l.value.radio,
      value: 1,
    },
    {
      label: l.value.checkbox,
      value: 2,
    },
    {
      label: l.value.judge,
      value: 3,
    },
  ],
  question_status: [
    {
      label: l.value.unpublished,
      value: 0,
    },
    {
      label: l.value.published,
      value: 1,
    },
  ],
}))

const user = computed(() => $store.getters['user'])

const currentQuestion = computed(() => {
  if (!exam.questions || exam.questions.length === 0) return {}
  return exam.questions[flagObj.currentIndex] || {}
})

const answeredCount = computed(() => {
  return replyObj.questions.filter((q) => {
    if (Array.isArray(q.check)) return q.check.length > 0
    return !!q.check
  }).length
})

const totalQuestions = computed(() => exam.questions.length)

const closeTab = () => {
  $confirm(l.value.closeTab, l.value.prompt, {
    confirmButtonText: l.value.close,
    cancelButtonText: c.value.cancel,
    type: 'warning',
  })
    .then(() => {
      window.close()
    })
    .catch(() => {})
}

const returnExamNum = () => {
  let done = 0
  let todo = 0
  replyObj.questions.forEach((i) => {
    if (i.check && (Array.isArray(i.check) ? i.check.length > 0 : i.check !== '')) {
      done++
    } else {
      todo++
    }
  })
  examNum.done = done
  examNum.todo = todo
}

const fillinChange = (text) => {
  if (text !== '') {
    replyObj.questions[flagObj.currentIndex].options = [
      {
        id: currentQuestion.value.options[0].id,
        question_id: currentQuestion.value.question_id,
        value: text,
      },
    ]
  } else {
    replyObj.questions[flagObj.currentIndex].options = []
  }
  returnExamNum()
}

const checkBoxChange = (index) => {
  let array = replyObj.questions[index].check
  let options = []
  array.forEach((v) => {
    let selectedOption = exam.questions[index].options.find((i) => i.id == v)
    if (selectedOption) {
      options.push({
        id: selectedOption.id,
        question_id: selectedOption.pid,
        value: selectedOption.id,
      })
    }
  })
  replyObj.questions[index].options = options
  returnExamNum()
}

const radioChange = () => {
  let v = replyObj.questions[flagObj.currentIndex].check
  let selectedOption = currentQuestion.value.options.find((i) => i.id == v)
  if (selectedOption) {
    replyObj.questions[flagObj.currentIndex].options = [
      {
        id: selectedOption.id,
        question_id: selectedOption.pid,
        value: selectedOption.id,
      },
    ]
  }
  returnExamNum()
}

const getQuestionTypeName = (type) => {
  const map = { 0: l.value.fillIn, 1: l.value.radio, 2: l.value.checkbox, 3: l.value.judge }
  return map[type] || l.value.unknown
}

const isSelected = (index, value) => {
  const check = replyObj.questions[index].check
  if (Array.isArray(check)) {
    return check.includes(value)
  }
  return check === value
}

const scrollToQuestion = (index) => {
  flagObj.currentIndex = index
  const el = document.getElementById(`q-${index}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

const returnPublicObjLabel = (inputValue, key, outputValue, filed) => {
  if (!publicCodeObj.value[filed]) return inputValue
  let item = publicCodeObj.value[filed].find((i) => {
    return i[key] == inputValue
  })
  if (item) {
    return item[outputValue]
  } else {
    return inputValue
  }
}

const getQuestionnaire = (qid) => {
  $request(
    api.baseUrl + '/Video/VideoExam/getQuestionnaire',
    {
      id: qid,
      exam_id: params.exam_id,
    },
    'post'
  ).then((r) => {

    remainingTime.value = r.data.test_duration * 60 // Convert minutes to seconds

    // Load anti-cheating settings từ API
    antiCheatSettings.forbid_copy = r.data.forbid_copy === 'Y' || r.data.forbid_copy === 1
    antiCheatSettings.detect_tab_switch = r.data.detect_tab_switch === 'Y' || r.data.detect_tab_switch === 1
    antiCheatSettings.require_fullscreen = r.data.require_fullscreen === 'Y' || r.data.require_fullscreen === 1

    let newReplyObj = {
      exam_id: params.exam_id,
      train_id: params.train_id,
      course_primary_id: params.course_id,
      questionnaire_id: qid,
      class_id: params.class_id,
      questions: [],
    }
    let total_score = 0
    r.data.questions.forEach((i) => {
      total_score += i.score

      if (i.question_type == 2) {
        newReplyObj.questions.push({
          id: i.id,
          question_id: i.question_id,
          questionnaire_id: i.questionnaire_id,
          score: i.score,
          options: [],
          check: [],
        })
      } else {
        newReplyObj.questions.push({
          id: i.id,
          question_id: i.question_id,
          questionnaire_id: i.questionnaire_id,
          score: i.score,
          options: [],
          check: '',
        })
      }
    })

    Object.assign(replyObj, newReplyObj)
    Object.assign(exam, r.data)
    exam.total_score = total_score
    returnExamNum()
  })
}

const submitQuestionnaire = () => {
  // Nếu do gian lận, bỏ qua kiểm tra todo
  if (examNum.todo > 0 && !isPassSubmit) {
    return $message.error(`${l.value.stillHave}${examNum.todo}${l.value.toSubmit}`)
  }
  $request(api.baseUrl + '/Video/VideoExam/ReplyQuestionnaire', replyObj, 'post').then((r) => {
    if (r.httpCode == 200) {
      $message({
        type: 'success',
        message: l.value.submissionSuccess,
      })
      flagObj.submitted = true
      submitExam()
    }
  })
}

const submitModifyScore = () => {
  let postData = {
    reply_id: params.reply_id,
    questionnaire_id: params.questionnaire_id,
    detail: modifyScoreObj.detail.filter((i) => i.score !== ''),
  }
  if (postData.length == 0) {
    return $message.error(l.value.plsInputSCore)
  }
  $request($api.videoServer + '/Video/VideoExam/modifyScore', postData, 'post').then((r) => {
    if (r.httpCode == 200) {
      $message({
        type: 'success',
        message: l.value.modifySuccess,
      })
    }
    console.log(r)
  })
}

const getAnswerDetail = (reply_id) => {
  $request($api.videoServer + '/Video/VideoExam/getAnswerDetail?reply_id=' + reply_id).then((r) => {
    let correct = 0
    let error = 0
    let half = 0
    let total_score = 0
    let totalRealScore = 0
    let newReplyObj = {
      questionnaire_id: params.questionnaire_id,
      questions: [],
    }
    let newModifyScoreObj = {
      reply_id: reply_id,
      questionnaire_id: params.questionnaire_id,
      detail: [],
    }
    r.data.questions.forEach((i) => {
      total_score += i.score
      totalRealScore += i.real_score

      newModifyScoreObj.detail.push({
        question_id: i.question_id,
        score: '',
        remark: '',
      })
      if (i.real_score == i.score) {
        correct++
      } else if (i.real_score == 0) {
        error++
      } else {
        half++
      }
      if (i.question_type == 0) {
        let selected = i.options[0].value
        let realAnswer = l.value.noStandardAnswer
        newReplyObj.questions.push({
          id: i.id,
          score: i.score,
          real_score: i.real_score,
          check: selected,
          answer: selected,
          realAnswer: realAnswer,
        })
      } else if (i.question_type == 2) {
        let selected = []
        let answer = []
        let realAnswer = []
        i.options.forEach((o) => {
          if (o.value == o.id) {
            selected.push(o.value)
            answer.push(o.name_label)
          }
          if (o.is_correct) {
            realAnswer.push(o.name_label)
          }
        })
        newReplyObj.questions.push({
          id: i.id,
          score: i.score,
          real_score: i.real_score,
          check: selected,
          answer: answer,
          realAnswer: realAnswer,
        })
      } else if (i.question_type == 1 || i.question_type == 3) {
        let selected = i.options.find((o) => {
          return o.value == o.id
        })
        let realAnswer = i.options.find((o) => {
          return o.is_correct == true
        }).name_label
        newReplyObj.questions.push({
          id: i.id,
          score: i.score,
          real_score: i.real_score,
          check: selected ? selected.value : '',
          answer: selected ? selected.name_label : '',
          realAnswer: realAnswer,
        })
      }
    })
    params.score = totalRealScore

    Object.assign(modifyScoreObj, newModifyScoreObj)
    Object.assign(replyObj, newReplyObj)

    Object.assign(exam, r.data)
    exam.total_score = total_score
    examNum.correct = correct
    examNum.error = error
    examNum.half = half
  })
}

const confirmSubmit = () => {
  $confirm(l.value.submitConfirmText, l.value.submitConfirmTitle, {
    confirmButtonText: l.value.confirm,
    cancelButtonText: c.value.cancel,
    type: 'warning',
  })
    .then(() => {
      submitQuestionnaire()
    })
    .catch(() => {})
}

const enterFullscreen = async () => {
  try {
    const elem = document.documentElement
    if (elem.requestFullscreen) {
      await elem.requestFullscreen()
    } else if (elem.webkitRequestFullscreen) {
      await elem.webkitRequestFullscreen()
    } else if (elem.msRequestFullscreen) {
      await elem.msRequestFullscreen()
    }
    isFullscreen.value = true
    // Chỉ start timer nếu còn thời gian
    if (remainingTime.value > 0) {
      timerInitialized.value = true // Mark timer as initialized
      startTimer()
    }
  } catch (err) {
    console.error('Fullscreen failed', err)
    $message.error(l.value.fullscreenRequired)
  }
}

const startExam = () => {
  // Không yêu cầu fullscreen, chỉ bắt đầu timer
  isFullscreen.value = true
  // Chỉ start timer nếu còn thời gian
  if (remainingTime.value > 0) {
    timerInitialized.value = true // Mark timer as initialized
    startTimer()
  }
}

const startTimer = () => {
  // Tắt timer nếu không có thời gian còn lại
  if (remainingTime.value <= 0) {
    return
  }
  
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      clearInterval(timerInterval)
      autoSubmit('time_up')
    }
  }, 1000)
}

// Anti-Cheating Logic
const handleVisibilityChange = () => {
  if (document.hidden && !isSubmitted.value && isFullscreen.value && antiCheatSettings.detect_tab_switch) {
    recordViolation()
  }
}

const handleFullscreenChange = () => {
  if (!document.fullscreenElement && !isSubmitted.value) {
    isFullscreen.value = false
    recordViolation()
  } else {
    isFullscreen.value = true
  }
}

const handleBlur = () => {
  // Phát hiện khi click ra ngoài window hoặc mở DevTools
  if (!isSubmitted.value && isFullscreen.value && antiCheatSettings.detect_tab_switch) {
    recordViolation()
  }
}

const handleFocus = () => {
  // Bắt sự kiện khi trở lại trang
  if (!isSubmitted.value && isFullscreen.value && antiCheatSettings.detect_tab_switch) {
    $message.warning({
      content: `${l.value.tabSwitchDetected}`,
      duration: 3,
    })
  }
}

const recordViolation = () => {
  warningCount.value++
  if (warningCount.value >= 3) {
    autoSubmit('violation_limit')
  } else {
    $message.error({
      content: `${l.value.violationText} (${warningCount.value}/3)`,
      duration: 5,
    })
    isBlur.value = true
    setTimeout(() => (isBlur.value = false), 2000)
  }
}

const autoSubmit = (reason) => {
  if (isSubmitted.value) return

  let title = reason === 'time_up' ? l.value.timeUpTitle : l.value.violationLimitTitle
  let text = reason === 'time_up' ? l.value.timeUpText : l.value.violationLimitText

  $message.warning({ content: title, duration: 5 })
  
  // Đánh dấu là submit do gian lận để bypass kiểm tra todo
  isPassSubmit = true
  submitQuestionnaire()
}

const submitExam = () => {
  isSubmitted.value = true
  clearInterval(timerInterval)

  // Unlock fullscreen
  if (document.exitFullscreen) document.exitFullscreen().catch(() => {})

  $message.success(l.value.submissionSuccess)

  // Redirect
  setTimeout(() => {
    window.close()
  }, 2000)
}

onMounted(() => {
  if ($route.params.questionnaire_id) {
    Object.assign(params, $route.params)
  } else {
    Object.assign(params, $route.query)
  }

  if (params.mode == 'exam' || params.mode == 'preview') {
    getQuestionnaire(params.questionnaire_id)
    // Set timer for exam mode
    remainingTime.value = 3600 // 60 minutes default, replace with actual from API
    if (params.mode == 'exam' && antiCheatSettings.require_fullscreen) {
      enterFullscreen()
    }
  } else {
    getAnswerDetail(params.reply_id)
  }

  // Anti-cheating event listeners
  document.addEventListener('visibilitychange', handleVisibilityChange)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  window.addEventListener('blur', handleBlur)
  window.addEventListener('focus', handleFocus)

  // Prevent right click / copy based on forbid_copy setting
  document.addEventListener('contextmenu', (event) => {
    if (antiCheatSettings.forbid_copy) {
      event.preventDefault()
    }
  })

  // Prevent copy if forbid_copy is enabled
  document.addEventListener('copy', (event) => {
    if (antiCheatSettings.forbid_copy) {
      event.preventDefault()
      $message.warning(l.value.copyForbidden)
    }
  })

  console.log(params)
})

onUnmounted(() => {
  clearInterval(timerInterval)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  window.removeEventListener('blur', handleBlur)
  window.removeEventListener('focus', handleFocus)
  document.removeEventListener('contextmenu', (event) => {
    if (antiCheatSettings.forbid_copy) {
      event.preventDefault()
    }
  })
  document.removeEventListener('copy', (event) => {
    if (antiCheatSettings.forbid_copy) {
      event.preventDefault()
    }
  })
})
</script>

<style scoped>
.custom_disabled ::v-deep .el-radio .el-radio__label {
  color: #606266 !important;
}
.custom_disabled ::v-deep .el-radio .el-radio__input.is-checked .el-radio__inner {
  background-color: #409fee;
  border-color: #409fee;
}
.custom_disabled ::v-deep .el-radio .el-radio__input.is-checked .el-radio__inner::after {
  background-color: #fff;
}
.custom_disabled ::v-deep .el-checkbox .el-checkbox__label {
  color: #606266 !important;
}
.custom_disabled ::v-deep .el-checkbox .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: #409fee;
  border-color: #409fee;
}
.custom_disabled ::v-deep .el-checkbox .el-checkbox__input.is-checked .el-checkbox__inner::after {
  border-color: #ffffff;
}
.custom_disabled ::v-deep .el-textarea__inner {
  background-color: white;
  color: #606266;
  border-color: #babfc5;
}

/* Custom scrollbar for webkit */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #cccccc;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #999999;
}
</style>
