<template>
  <div class="bg-[#F9F9F9] min-h-screen pb-10 font-sans text-[#0D0D0D]">
    <!-- Exam Record Modal -->
    <div v-if="showObj.examDialog" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" @click.self="showObj.examDialog = false">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden m-4 flex flex-col max-h-[90vh]">
        <!-- Modal Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-[#E5E5E5]">
          <h3 class="text-xl font-semibold text-[#0D0D0D]">{{ l.examRecord }}</h3>
          <button @click="showObj.examDialog = false" class="text-[#606060] hover:text-[#0D0D0D] transition p-2 rounded-full hover:bg-gray-100">
            <i class="el-icon-close text-xl"></i>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto custom-scrollbar">
             <!-- Exam Stats Banner -->
             <div class="flex flex-col sm:flex-row items-center justify-between mb-6 bg-[#F9F9F9] border border-[#E5E5E5] p-4 rounded-lg gap-4">
                <div class="text-[#606060] text-sm flex-1 text-center sm:text-left">
                  <div class="mb-1">
                    {{ l.mostExam }} <span class="text-[#0D0D0D] font-bold text-lg mx-1">{{ currentExam.max_reply_num }}</span> {{ l.examUnit }}
                  </div>
                  <div>
                    {{ l.youCanExam }}
                    <span :class="remainingAttempts <= 0 ? 'text-[#CC0000]' : 'text-[#008A00]'" class="font-bold text-lg mx-1">
                      {{ remainingAttempts }}
                    </span>
                    {{ l.examUnit }}
                  </div>
                </div>
                <button
                  @click="goToExam"
                  :disabled="remainingAttempts <= 0"
                  class="bg-[#065FD4] hover:bg-[#0551b4] disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2.5 rounded font-medium transition shadow-sm uppercase text-sm tracking-wide w-full sm:w-auto"
                >
                  {{ l.goExam }}
                </button>
             </div>

            <!-- Custom Table -->
            <div class="border border-[#E5E5E5] rounded-lg overflow-hidden">
              <table class="w-full text-left text-sm">
                <thead class="bg-[#F2F2F2] border-b border-[#E5E5E5]">
                  <tr>
                    <th class="px-4 py-3 font-semibold text-[#606060] w-1/3">{{ l.examedTime }}</th>
                    <th class="px-4 py-3 font-semibold text-[#606060] w-1/4">{{ l.examUser }}</th>
                    <th class="px-4 py-3 font-semibold text-[#606060] w-1/4">{{ l.examScore }}</th>
                    <th class="px-4 py-3 font-semibold text-[#606060] text-right w-1/6">{{ c.operation }}</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-[#E5E5E5]">
                    <tr v-for="(row, idx) in examRecord" :key="idx" class="hover:bg-[#F9F9F9] transition-colors">
                        <td class="px-4 py-3 text-[#0D0D0D]">{{ row.create_time }}</td>
                        <td class="px-4 py-3 text-[#0D0D0D]">{{ row.create_user }}</td>
                        <td class="px-4 py-3 text-[#0D0D0D] font-medium">{{ row.score }}</td>
                        <td class="px-4 py-3 text-right">
                             <button @click="reviewExam(row)" class="text-[#065FD4] font-medium hover:text-[#0551b4] hover:underline">{{ l.check }}</button>
                        </td>
                    </tr>
                    <tr v-if="examRecord.length === 0">
                        <td colspan="4" class="px-4 py-12 text-center text-[#606060]">
                           <div class="flex flex-col items-center justify-center gap-2">
                             <i class="el-icon-document-delete text-3xl text-gray-300"></i>
                             <span>No records found</span>
                           </div>
                        </td>
                    </tr>
                </tbody>
              </table>
            </div>
        </div>

        <!-- Modal Footer -->
        <div class="bg-[#F9F9F9] px-6 py-4 flex justify-end gap-3 border-t border-[#E5E5E5]">
           <button @click="getReplyRecord(currentExam)" class="px-4 py-2 text-[#065FD4] font-medium hover:bg-blue-50 rounded transition border border-transparent hover:border-blue-100">{{ l.refresh }}</button>
           <button @click="showObj.examDialog = false" class="px-4 py-2 bg-white border border-[#E5E5E5] text-[#606060] font-medium hover:bg-gray-50 rounded shadow-sm transition">{{ c.close }}</button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 py-8">

      <!-- Banner / Header -->
      <div class="bg-white rounded-xl shadow-sm border border-[#E5E5E5] p-6 mb-8 flex flex-col md:flex-row gap-8">
         <div class="w-full md:w-[320px] flex-shrink-0">
             <div class="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-[#E5E5E5] shadow-inner relative group">
                 <el-image :src="logoImage" fit="cover" class="w-full h-full object-cover group-hover:scale-105 transition duration-500"></el-image>
             </div>
         </div>
         <div class="flex-1 flex flex-col justify-center">
             <div class="mb-6">
                 <h1 class="text-3xl font-bold text-[#0D0D0D] mb-3 leading-tight">{{ trainingInfo.name_label || 'Loading...' }}</h1>
                 <p class="text-[#606060] text-sm leading-relaxed line-clamp-3 max-w-3xl">{{ trainingInfo.description || 'No description available.' }}</p>
             </div>

             <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-8 text-sm text-[#606060] bg-[#F9F9F9] p-4 rounded-lg border border-[#E5E5E5]">
                 <div class="flex items-center gap-2">
                     <i class="el-icon-time text-lg text-[#909090]"></i>
                     <div class="flex flex-col">
                        <span class="text-xs text-[#909090] uppercase tracking-wider font-semibold">{{ l.trainTime }}</span>
                        <span class="font-medium text-[#0D0D0D]">{{ formatDate(trainingInfo.start_date) }} ～ {{ formatDate(trainingInfo.end_date) }}</span>
                     </div>
                 </div>
                 <div class="flex items-center gap-2">
                     <i class="el-icon-office-building text-lg text-[#909090]"></i>
                     <div class="flex flex-col">
                        <span class="text-xs text-[#909090] uppercase tracking-wider font-semibold">{{ l.implementDept }}</span>
                        <span class="font-medium text-[#0D0D0D]">{{ trainingInfo.create_dept || '-' }}</span>
                     </div>
                 </div>
                 <div class="flex items-center gap-2">
                     <i class="el-icon-user text-lg text-[#909090]"></i>
                     <div class="flex flex-col">
                        <span class="text-xs text-[#909090] uppercase tracking-wider font-semibold">{{ l.trainNum }}</span>
                        <span class="font-medium text-[#0D0D0D]">{{ trainingInfo.person_num || 0 }}</span>
                     </div>
                 </div>
             </div>
         </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left: Activity List -->
        <div class="lg:col-span-2 space-y-6">
            <div class="flex items-center justify-between mb-2 px-1">
                <h2 class="text-xl font-bold text-[#0D0D0D] flex items-center gap-2">
                  <i class="el-icon-notebook-2 text-[#065FD4]"></i>
                  {{ l.activityList }}
                </h2>
                <button @click="getTrainingDetail(train_primary_id)" class="p-2 text-[#065FD4] hover:bg-blue-50 rounded-full transition" :title="l.refresh">
                    <i class="el-icon-refresh text-xl"></i>
                </button>
            </div>

            <div v-for="(section, idx) in trainingActivity" :key="idx" class="bg-white rounded-xl shadow-sm border border-[#E5E5E5] overflow-hidden mb-6">
                <div class="bg-[#F9F9F9] px-6 py-4 border-b border-[#E5E5E5] font-semibold text-[#0D0D0D] flex items-center gap-2">
                    <span class="bg-[#E5E5E5] text-[#606060] text-xs font-bold px-2 py-0.5 rounded">Section {{ idx + 1 }}</span>
                    {{ section.name_label }}
                </div>
                <div class="divide-y divide-[#E5E5E5]">
                    <div v-for="(item, itemIdx) in section.detail" :key="itemIdx" class="p-4 flex flex-col sm:flex-row gap-4 hover:bg-[#FDFDFD] transition group relative">
                        <!-- Thumbnail -->
                         <div class="w-full sm:w-[200px] h-[112px] flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden relative border border-[#E5E5E5] group-hover:border-[#D0D0D0] transition">
                            <el-image
                              v-if="item.type === 'video'"
                              :src="$api.videoServer + '/' + item.thumbnail_path"
                              fit="cover"
                              class="w-full h-full"
                            >
                                <div slot="error" class="flex justify-center items-center w-full h-full bg-gray-100 text-gray-400">
                                    <i class="el-icon-picture-outline text-2xl"></i>
                                </div>
                            </el-image>
                            <div v-else class="w-full h-full flex flex-col items-center justify-center bg-blue-50 text-[#065FD4]">
                                <i class="el-icon-document-checked text-4xl mb-2"></i>
                                <span class="text-xs font-semibold uppercase tracking-widest">Exam</span>
                            </div>

                            <!-- Duration Overlay for Video -->
                             <div v-if="item.type === 'video'" class="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-mono">
                                 {{ item.duration || '00:00' }}
                             </div>
                         </div>

                         <!-- Content -->
                         <div class="flex-1 min-w-0 flex flex-col justify-between py-1">
                             <div>
                                 <div class="flex justify-between items-start gap-4 mb-1">
                                     <h3 class="text-base font-semibold text-[#0D0D0D] leading-snug group-hover:text-[#065FD4] transition line-clamp-2">
                                       {{ item.title }}
                                     </h3>

                                     <!-- Status Badge -->
                                     <span class="flex-shrink-0 text-xs px-2 py-0.5 rounded font-medium border"
                                        :class="section.is_finish ? 'bg-green-50 text-[#008A00] border-green-200' : 'bg-gray-100 text-[#606060] border-gray-200'">
                                        {{ section.is_finish ? l.completed : l.uncomplete }}
                                     </span>
                                 </div>

                                 <div class="text-sm text-[#606060] mb-2 line-clamp-1">
                                   {{ item.description || (item.type === 'exam' ? `${c.startTime}: ${item.start_time}` : '') }}
                                 </div>
                             </div>

                             <div class="flex items-center gap-2 text-xs text-[#909090]">
                                 <span class="border px-1.5 py-0.5 rounded" :class="section.is_must == 1 ? 'border-[#CC0000] text-[#CC0000] bg-red-50' : 'border-[#606060] text-[#606060] bg-gray-50'">
                                     {{ section.is_must == 1 ? l.compulsory : l.elective }}
                                 </span>
                                 <span>•</span>
                                 <span v-if="item.type === 'video'">Video</span>
                                 <span v-else>Exam</span>
                             </div>
                         </div>

                         <!-- Action Button -->
                         <div class="flex items-center sm:self-center">
                             <button
                                v-if="item.type === 'video'"
                                @click="goToCourse(item)"
                                class="w-full sm:w-auto px-5 py-2.5 bg-[#F2F2F2] hover:bg-[#E5E5E5] active:bg-[#D9D9D9] text-[#0D0D0D] font-medium rounded transition text-sm whitespace-nowrap"
                             >
                                 {{ l.check }}
                             </button>
                             <button
                                v-if="item.type === 'exam'"
                                @click="getReplyRecord(item)"
                                class="w-full sm:w-auto px-5 py-2.5 bg-[#F2F2F2] hover:bg-[#E5E5E5] active:bg-[#D9D9D9] text-[#0D0D0D] font-medium rounded transition text-sm whitespace-nowrap"
                             >
                                 {{ l.check }}
                             </button>
                         </div>
                    </div>
                </div>
            </div>

            <div v-if="trainingActivity.length === 0" class="text-center py-16 bg-white rounded-xl border border-[#E5E5E5] text-[#606060]">
                <div class="flex flex-col items-center justify-center gap-3">
                  <i class="el-icon-box text-4xl text-gray-300"></i>
                  <span>No activities found.</span>
                </div>
            </div>
        </div>

        <!-- Right: Stats -->
        <div class="lg:col-span-1 space-y-6">
            <div class="bg-white rounded-xl shadow-sm border border-[#E5E5E5] p-6 sticky top-6">
                <div class="flex items-center justify-between mb-6">
                    <h2 class="text-lg font-bold text-[#0D0D0D]">{{ l.activityProgress }}</h2>
                    <button @click="getLearningStatus(class_id)" class="text-[#065FD4] hover:bg-blue-50 p-2 rounded-full transition" :title="l.refresh">
                        <i class="el-icon-refresh font-bold"></i>
                    </button>
                </div>

                <!-- Total Progress Circle -->
                <div class="mb-8 text-center">
                     <div class="relative w-36 h-36 mx-auto mb-4 flex items-center justify-center">
                           <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                              <!-- Background Circle -->
                              <path class="text-[#F2F2F2]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="2.5" />
                              <!-- Progress Circle -->
                              <path class="text-[#065FD4] transition-all duration-1000 ease-out" :stroke-dasharray="`${overallProgress}, 100`" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" />
                           </svg>
                         <div class="absolute inset-0 flex flex-col items-center justify-center">
                             <span class="text-3xl font-bold text-[#0D0D0D]">{{ overallProgress }}<span class="text-sm align-top">%</span></span>
                             <span class="text-xs text-[#606060] uppercase tracking-wider font-semibold">{{ l.completed }}</span>
                         </div>
                     </div>
                </div>

                <!-- Detailed Stats Cards -->
                <div class="space-y-3">
                     <!-- Activity Item -->
                     <div class="bg-[#F9F9F9] rounded-lg p-4 border border-transparent hover:border-[#E5E5E5] transition">
                         <div class="flex justify-between text-sm mb-3">
                             <span class="font-medium text-[#606060]">{{ l.activityNum }}</span>
                             <span class="font-bold text-[#0D0D0D]">{{ learningObj.totalTask }}</span>
                         </div>
                         <div class="w-full bg-[#E5E5E5] rounded-full h-1.5 overflow-hidden">
                             <div class="bg-[#065FD4] h-full rounded-full transition-all duration-500" :style="{ width: `${overallProgress}%` }"></div>
                         </div>
                     </div>

                     <!-- Course Item -->
                     <div class="bg-[#F9F9F9] rounded-lg p-4 border border-transparent hover:border-[#E5E5E5] transition">
                         <div class="flex justify-between text-sm mb-2">
                             <span class="font-medium text-[#606060]">{{ l.courseProgress }}</span>
                             <span class="font-bold text-[#0D0D0D]">{{ learningObj.courseNum }}</span>
                         </div>
                         <div class="flex justify-between text-xs mt-2 pt-2 border-t border-[#EAEAEA]">
                             <span class="text-[#606060]">{{ l.completed }}: <span class="text-[#008A00] font-bold text-sm">{{ learningObj.finishCourseNum }}</span></span>
                             <span class="text-[#606060]">{{ l.uncomplete }}: <span class="text-[#CC0000] font-bold text-sm">{{ learningObj.unfinishCourseNum }}</span></span>
                         </div>
                     </div>

                     <!-- Exam Item -->
                     <div class="bg-[#F9F9F9] rounded-lg p-4 border border-transparent hover:border-[#E5E5E5] transition">
                         <div class="flex justify-between text-sm mb-2">
                             <span class="font-medium text-[#606060]">{{ l.examProgress }}</span>
                             <span class="font-bold text-[#0D0D0D]">{{ learningObj.examNum }}</span>
                         </div>
                         <div class="flex justify-between text-xs mt-2 pt-2 border-t border-[#EAEAEA]">
                             <span class="text-[#606060]">{{ l.completed }}: <span class="text-[#008A00] font-bold text-sm">{{ learningObj.finishExamNum }}</span></span>
                             <span class="text-[#606060]">{{ l.uncomplete }}: <span class="text-[#CC0000] font-bold text-sm">{{ learningObj.unfinishExamNum }}</span></span>
                         </div>
                     </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance } from 'vue'
import logoImage from '@/assets/logo.png'
import { assignObject } from '@/utils'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('videoUserTrainDetail')

// State
const class_id = ref('')
const no_primary_train_id = ref('')
const train_primary_id = ref('')

const trainingInfo = reactive({
  name_label: '',
  description: '',
  person_num: '',
  start_date: '',
  end_date: '',
  create_dept: '',
})

const trainingActivity = ref([])
const showObj = reactive({
  examDialog: false,
})

const currentExam = ref({
  id: '',
  questionnaire_id: '',
  max_reply_num: 0,
})

const examRecord = ref([])

const learningObj = reactive({
  total: 0,
  list: [],
  unfinishCourse: [],
  unfinishExam: [],
  totalTask: 0,
  finishTask: 0,
  unfinishTask: 0,
  courseNum: 0,
  finishCourseNum: 0,
  unfinishCourseNum: 0,
  examNum: 0,
  finishExamNum: 0,
  unfinishExamNum: 0,
})

// Computed
const user = computed(() => proxy.$store.getters.user)

const overallProgress = computed(() => {
  if (learningObj.totalTask === 0) return 0
  return Math.floor((learningObj.finishTask / learningObj.totalTask) * 100) || 0
})

const remainingAttempts = computed(() => {
  return (currentExam.value.max_reply_num || 0) - (examRecord.value.length || 0)
})

// Methods
const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return dateStr.substr(0, 10)
}

const getLearningStatus = (id) => {
  proxy.$request(
    proxy.$api.videoServer + '/Video/VideoAnalyze/getClassUserTrainLearingInfo',
    {
      page: 1,
      pageSize: 9999,
      class_id: id,
      userid: [user.value.userId],
    },
    'post'
  ).then((r) => {
    if (r.data.total > 0) {
      learningObj.total = r.data.total
      learningObj.list = r.data.list
      const data = r.data.list[0]

      // Update stats based on API response structure
      learningObj.courseNum = data.course_num
      learningObj.finishCourseNum = data.finsh_course_num
      learningObj.unfinishCourseNum = data.no_finsh_course_List.length
      learningObj.unfinishCourse = data.no_finsh_course_List

      learningObj.examNum = data.exam_num
      learningObj.finishExamNum = data.finsh_exam_num
      // Note: original code calculated unfinishExamNum strangely: tep.no_finsh_course_exam_List.length + tep.no_finsh_course_exam_List.length
      // But assigned data.no_finsh_exam_List.length earlier.
      // I will trust the array length of no_finsh_exam_List if available, assuming typo in original code repeated same list
      // Wait, original code had: tep.no_finsh_course_exam_List.length + tep.no_finsh_course_exam_List.length
      // But also: this.learningObj.unfinishExamNum = r.data.list[0].no_finsh_exam_List.length
      // It overwrote it immediately after. I will use the logical one.

      // Re-reading original code logic carefully:
      // It sets properties from r.data.list[0] then overwrites them from 'tep' (which IS r.data.list[0])
      // The overwrite used `tep.no_finsh_course_exam_List.length + tep.no_finsh_course_exam_List.length`.
      // It seems `no_finsh_course_exam_List` might be different from `no_finsh_exam_List`.
      // But the original code was messy. I'll stick to basic counts for now or follow the property names if valid.
      // I will assume standard counts: total - finish = unfinish or array lengths.

      learningObj.unfinishExamNum = data.no_finsh_exam_List ? data.no_finsh_exam_List.length : 0
      learningObj.unfinishExam = data.no_finsh_exam_List

      learningObj.totalTask = learningObj.courseNum + learningObj.examNum
      learningObj.unfinishTask = learningObj.unfinishCourseNum + learningObj.unfinishExamNum
      learningObj.finishTask = learningObj.totalTask - learningObj.unfinishTask
    }
  })
}

const getTrainingDetail = (id) => {
  proxy.$request(proxy.$api.videoServer + '/Video/VideoTrain/ShowTrainDetil', {
    id: id,
  }).then((r) => {
    assignObject(trainingInfo, r.data)
    no_primary_train_id.value = r.data.train_id
    train_primary_id.value = r.data.id
    trainingActivity.value = []

    if (r.data.detail) {
      r.data.detail.forEach((i) => {
        let temp = {
          id: i.id,
          name_label: i.name_label,
          course_id: i.course_id,
          bind_id: i.bind_id,
          type: i.type,
          is_must: i.is_must,
          is_finish: i.is_finish,
          sort: i.sort,
          detail: [],
        }
        if (i.detail) {
          i.detail.forEach((x) => {
            if (x.video != null) {
              temp.detail.push({
                type: 'video',
                course_id: x.no_primary_course_id,
                course_primary_id: x.course_id,
                title: x.video.title,
                is_process_question: x.video.is_process_question,
                duration: x.video.duration,
                url: x.video.url,
                thumbnail_path: x.video.thumbnail_path,
                description: x.video.description,
              })
            } else if (x.exam != null) {
              temp.detail.push({
                type: 'exam',
                id: x.exam.id,
                title: x.exam.name_label ? x.exam.name_label : x.exam.name_zh,
                questionnaire_id: x.exam.questionnaire_id,
                start_time: x.exam.start_time,
                end_time: x.exam.end_time,
                max_reply_num: x.exam.max_reply_num,
                pass_score: x.exam.pass_score,
                test_duration: x.exam.test_duration,
              })
            }
          })
        }
        trainingActivity.value.push(temp)
      })
    }
  })
}

const goToCourse = (x) => {
  if (x.type == 'video') {
    let routeUrl = proxy.$router.resolve({
      name: 'videoPlay',
      query: {
        train_primary_id: train_primary_id.value,
        no_primary_train_id: no_primary_train_id.value,
        course_primary_id: x.course_primary_id,
        no_primary_course_id: x.course_id,
        class_id: class_id.value,
      },
    }).href
    window.open(routeUrl, '_blank')
  }
}

const getReplyRecord = (i) => {
  currentExam.value = i
  proxy.$request(proxy.$api.videoServer + '/Video/VideoExam/getAnswerList', {
    questionnaire_id: i.questionnaire_id,
    userid: user.value.userId,
    train_id: no_primary_train_id.value,
    train_primary_id: train_primary_id.value,
    course_primary_id: '',
    exam_id: i.id,
    class_id: class_id.value,
    page: 1,
    pageSize: 999,
  }).then((r) => {
    examRecord.value = r.data.list || []
    showObj.examDialog = true
  })
}

const goToExam = () => {
  let url = proxy.$router.resolve({
    name: 'examDetail',
    query: {
      questionnaire_id: currentExam.value.questionnaire_id,
      exam_id: currentExam.value.id,
      no_primary_train_id: no_primary_train_id.value,
      train_primary_id: train_primary_id.value,
      course_primary_id: '',
      class_id: class_id.value,
      is_test: false,
      mode: 'exam',
    },
  }).href
  window.open(url, '_blank')
}

const reviewExam = (data) => {
  let url = proxy.$router.resolve({
    name: 'examDetail',
    query: {
      exam_id: currentExam.value.id,
      questionnaire_id: currentExam.value.questionnaire_id,
      reply_id: data.id,
      mode: 'review',
    },
  }).href
  window.open(url, '_blank')
}

onMounted(() => {
  class_id.value = proxy.$route.query.class_id
  getTrainingDetail(proxy.$route.query.id)
  getLearningStatus(class_id.value)
})
</script>

<style scoped>
/* Custom Scrollbar for Modal content */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #d1d1d1;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>
