<template>
  <div class="h-screen w-screen bg-[#F9F9F9] flex flex-col font-roboto overflow-hidden" :class="{ 'blur-sm': isBlur }">
    <!-- Header -->
    <header class="h-[64px] bg-white border-b border-[#E5E5E5] flex items-center justify-between px-6 shrink-0 z-50">
      <div class="flex items-center gap-4">
        <div class="w-8 h-8 rounded-full bg-[#FF0000] flex items-center justify-center text-white font-bold text-xs">
          EXAM
        </div>
        <h1 class="text-lg font-medium text-[#0D0D0D] truncate max-w-[400px]" :title="examTitle">
          {{ examTitle }}
        </h1>
      </div>

      <div class="flex items-center gap-6">
        <!-- Timer -->
        <div class="flex items-center gap-2 px-4 py-1.5 bg-[#F2F2F2] rounded text-[#0D0D0D] font-mono text-lg font-medium" :class="{ 'text-[#CC0000]! bg-[#FFE6E6]': remainingTime < 300 }">
          <i class="el-icon-timer text-xl"></i>
          <span>{{ formattedTime }}</span>
        </div>

        <!-- Warning Counter -->
        <div v-if="warningCount > 0" class="flex items-center gap-2 text-[#CC0000] font-medium animate-pulse">
          <i class="el-icon-warning text-lg"></i>
          <span>{{ l.warnings }}: {{ warningCount }}/3</span>
        </div>

        <!-- Submit Button -->
        <button
          @click="confirmSubmit"
          class="px-6 py-2 bg-[#065FD4] text-white! font-medium uppercase text-sm rounded shadow-sm hover:bg-[#0551B4] transition-colors"
        >
          {{ l.submitExam }}
        </button>
      </div>
    </header>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden relative">
      <!-- Fullscreen Overlay (if not fullscreen) -->
      <div v-if="!isFullscreen && !isSubmitted" class="absolute inset-0 z-[100] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
        <div class="w-20 h-20 bg-[#F2F2F2] rounded-full flex items-center justify-center mb-6">
          <i class="el-icon-full-screen text-4xl text-[#065FD4]"></i>
        </div>
        <h2 class="text-2xl font-medium text-[#0D0D0D] mb-2">{{ l.fullscreenRequired }}</h2>
        <p class="text-[#606060] mb-8 max-w-md">{{ l.fullscreenDescription }}</p>
        <button
          @click="enterFullscreen"
          class="px-8 py-3 bg-[#065FD4] text-white! font-medium uppercase text-sm rounded shadow hover:bg-[#0551B4] transition-colors"
        >
          {{ l.enterFullscreen }}
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
            <button
              v-for="(q, index) in questionList"
              :key="q.id"
              @click="scrollToQuestion(index)"
              class="w-10 h-10 rounded flex items-center justify-center text-sm font-medium transition-colors border"
              :class="[
                currentQuestionIndex === index ? 'border-[#065FD4] ring-1 ring-[#065FD4] z-10' : 'border-transparent',
                q.userAnswer ? 'bg-[#E5F2FF] text-[#065FD4]' : 'bg-[#F2F2F2] text-[#606060] hover:bg-[#E5E5E5]'
              ]"
            >
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
      <button
        @click="showSidebar = !showSidebar"
        class="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-6 h-12 bg-white border border-l-0 border-[#E5E5E5] rounded-r flex items-center justify-center shadow-sm text-[#606060] hover:text-[#065FD4]"
        :style="{ left: showSidebar ? '300px' : '0' }"
      >
        <i :class="showSidebar ? 'el-icon-arrow-left' : 'el-icon-arrow-right'"></i>
      </button>

      <!-- Center: Question Area -->
      <div class="flex-1 overflow-y-auto bg-[#F9F9F9] p-8 scroll-smooth" id="questions-container">
        <div class="max-w-4xl mx-auto space-y-6">
          <div
            v-for="(q, index) in questionList"
            :key="q.id"
            :id="'q-' + index"
            class="bg-white rounded border border-[#E5E5E5] p-6 shadow-sm scroll-mt-24 group transition-shadow hover:shadow-md"
            :class="{ 'ring-2 ring-[#065FD4] ring-opacity-50': currentQuestionIndex === index }"
            @click="currentQuestionIndex = index"
          >
            <!-- Question Header -->
            <div class="flex items-start gap-4 mb-4">
              <div class="text-[#065FD4] font-medium text-lg min-w-[30px]">
                {{ index + 1 }}.
              </div>
              <div class="flex-1">
                <div class="text-[#0D0D0D] text-lg leading-relaxed mb-2 select-none">
                  {{ q.title }}
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-2 py-0.5 bg-[#F2F2F2] text-[#606060] text-xs rounded uppercase font-medium">
                    {{ getQuestionTypeName(q.type) }}
                  </span>
                  <span class="px-2 py-0.5 bg-[#F2F2F2] text-[#606060] text-xs rounded font-medium">
                    {{ q.score }} {{ l.points }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Options / Input -->
            <div class="pl-[46px]">
              <!-- Single/Multiple Choice -->
              <div v-if="[1, 2, 3].includes(q.type)" class="space-y-3">
                <label
                  v-for="(opt, optIndex) in q.options"
                  :key="optIndex"
                  class="flex items-center gap-3 p-3 rounded border border-transparent hover:bg-[#F9F9F9] cursor-pointer transition-colors group/opt"
                  :class="{ 'bg-[#E5F2FF]! border-[#065FD4]!': isSelected(q, opt.value) }"
                >
                  <div class="relative flex items-center justify-center w-5 h-5">
                    <input
                      :type="q.type === 2 ? 'checkbox' : 'radio'"
                      :name="'q-' + q.id"
                      :value="opt.value"
                      v-model="q.userAnswer"
                      class="appearance-none w-5 h-5 border-2 border-[#606060] rounded-sm checked:bg-[#065FD4] checked:border-[#065FD4] transition-colors"
                      :class="{ 'rounded-full': q.type !== 2 }"
                    />
                    <i v-if="q.type === 2" class="el-icon-check absolute text-white text-xs opacity-0" :class="{ 'opacity-100': isSelected(q, opt.value) }"></i>
                    <div v-else class="w-2 h-2 bg-white rounded-full absolute opacity-0" :class="{ 'opacity-100': isSelected(q, opt.value) }"></div>
                  </div>
                  <span class="text-[#0D0D0D] select-none">{{ opt.label }}</span>
                </label>
              </div>

              <!-- Text Input -->
              <div v-else-if="q.type === 0" class="relative">
                <textarea
                  v-model="q.userAnswer"
                  rows="4"
                  class="w-full border border-[#CCCCCC] rounded p-3 text-[#0D0D0D] outline-none focus:border-[#065FD4] focus:ring-1 focus:ring-[#065FD4] transition-all resize-none bg-[#FAFAFA] focus:bg-white"
                  :placeholder="l.typeAnswerHere"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Bottom Submit -->
        <div class="max-w-4xl mx-auto mt-8 flex justify-end">
             <button
            @click="confirmSubmit"
            class="px-8 py-3 bg-[#065FD4] text-white! font-medium uppercase text-sm rounded shadow hover:bg-[#0551B4] transition-colors"
          >
            {{ l.submitExam }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, getCurrentInstance } from 'vue'
import { useLocalI18n } from '@/composables/useLocalI18n'
import api from '@/api'

const { proxy } = getCurrentInstance()
const { $request, $message, $confirm, $router, $route } = proxy

// Localization
const l = computed(() => ({
  submitExam: 'Submit Exam',
  warnings: 'Warnings',
  fullscreenRequired: 'Fullscreen Required',
  fullscreenDescription: 'This exam must be taken in fullscreen mode to ensure academic integrity. Please click the button below to enter fullscreen and start the exam.',
  enterFullscreen: 'Start Exam (Fullscreen)',
  questionList: 'Questions',
  answered: 'Answered',
  unanswered: 'Unanswered',
  points: 'Points',
  typeAnswerHere: 'Type your answer here...',
  submitConfirmTitle: 'Submit Exam?',
  submitConfirmText: 'Are you sure you want to submit? You cannot change your answers after submission.',
  timeUpTitle: 'Time Up!',
  timeUpText: 'The exam time has ended. Your answers will be submitted automatically.',
  violationTitle: 'Exam Violation',
  violationText: 'You have left the exam window or exited fullscreen. This is recorded as a violation.',
  violationLimitTitle: 'Violation Limit Exceeded',
  violationLimitText: 'You have exceeded the maximum number of allowed violations. Your exam will be submitted automatically.',
  cancel: 'Cancel',
  confirm: 'Confirm',
}))

// State
const examTitle = ref('Loading...')
const questionList = ref([])
const remainingTime = ref(0) // seconds
const warningCount = ref(0)
const isFullscreen = ref(false)
const isSubmitted = ref(false)
const showSidebar = ref(true)
const currentQuestionIndex = ref(0)
const isBlur = ref(false)
let timerInterval = null

// Mock Data (Replace with API load)
const loadExamData = async () => {
  // Simulate API call
  // In real implementation:
  // const res = await $request(api.baseUrl + '/Video/VideoExam/getExamDetail', { id: $route.query.id })

  // Mocking for development/demo
  examTitle.value = 'Advanced Vue.js Certification Exam'
  remainingTime.value = 3600 // 60 minutes

  // Generate mock questions
  questionList.value = Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    title: `Question ${i + 1}: What is the correct way to handle reactivity in Vue 2.7 Composition API?`,
    type: i % 4, // 0: text, 1: single, 2: multi, 3: boolean
    score: 5,
    userAnswer: i % 4 === 2 ? [] : '',
    options: [
      { label: 'Option A: Use reactive()', value: 'A' },
      { label: 'Option B: Use ref()', value: 'B' },
      { label: 'Option C: Use computed()', value: 'C' },
      { label: 'Option D: All of the above', value: 'D' },
    ]
  }))
}

// Computeds
const formattedTime = computed(() => {
  const h = Math.floor(remainingTime.value / 3600)
  const m = Math.floor((remainingTime.value % 3600) / 60)
  const s = remainingTime.value % 60
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
})

const answeredCount = computed(() => {
  return questionList.value.filter(q => {
    if (Array.isArray(q.userAnswer)) return q.userAnswer.length > 0
    return !!q.userAnswer
  }).length
})

const totalQuestions = computed(() => questionList.value.length)

// Methods
const getQuestionTypeName = (type) => {
  const map = { 0: 'Text', 1: 'Single Choice', 2: 'Multiple Choice', 3: 'True/False' }
  return map[type] || 'Unknown'
}

const isSelected = (question, value) => {
  if (Array.isArray(question.userAnswer)) {
    return question.userAnswer.includes(value)
  }
  return question.userAnswer === value
}

const scrollToQuestion = (index) => {
  currentQuestionIndex.value = index
  const el = document.getElementById(`q-${index}`)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
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
    startTimer()
  } catch (err) {
    console.error('Fullscreen failed', err)
    $message.error('Fullscreen is required to take this exam.')
  }
}

const startTimer = () => {
  if (timerInterval) clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (remainingTime.value > 0) {
      remainingTime.value--
    } else {
      autoSubmit('time_up')
    }
  }, 1000)
}

// Anti-Cheating Logic
const handleVisibilityChange = () => {
  if (document.hidden && !isSubmitted.value && isFullscreen.value) {
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
    if (!isSubmitted.value && isFullscreen.value) {
        // Simple blur detection often triggers false positives (e.g. clicking inside iframe or certain inputs)
        // Check if document is actually hidden or if active element is outside
        if (document.hidden) {
            recordViolation()
        }
    }
}

const recordViolation = () => {
  warningCount.value++
  if (warningCount.value >= 3) {
    autoSubmit('violation_limit')
  } else {
    $message.error({
      content: `${l.value.violationTitle} (${warningCount.value}/3)`,
      duration: 5,
    })
    isBlur.value = true
    setTimeout(() => isBlur.value = false, 2000)
  }
}

const confirmSubmit = () => {
  $confirm(l.value.submitConfirmText, l.value.submitConfirmTitle, {
    confirmButtonText: l.value.confirm,
    cancelButtonText: l.value.cancel,
    type: 'warning'
  }).then(() => {
    submitExam()
  }).catch(() => {})
}

const autoSubmit = (reason) => {
  if (isSubmitted.value) return

  let title = reason === 'time_up' ? l.value.timeUpTitle : l.value.violationLimitTitle
  let text = reason === 'time_up' ? l.value.timeUpText : l.value.violationLimitText

  $message.warning({ content: title, duration: 5 })
  submitExam()
}

const submitExam = () => {
  isSubmitted.value = true
  clearInterval(timerInterval)

  // Unlock fullscreen
  if (document.exitFullscreen) document.exitFullscreen().catch(() => {})

  // Submit logic here
  $message.success('Exam submitted successfully!')

  // Redirect
  setTimeout(() => {
    // $router.push('/video/home') // Mock redirect
    window.close() // Usually opened in new tab
  }, 2000)
}

// Lifecycle
onMounted(() => {
  loadExamData()
  document.addEventListener('visibilitychange', handleVisibilityChange)
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  window.addEventListener('blur', handleBlur)

  // Prevent right click
  document.addEventListener('contextmenu', event => event.preventDefault())
})

onUnmounted(() => {
  clearInterval(timerInterval)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  window.removeEventListener('blur', handleBlur)
})
</script>

<style scoped>
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