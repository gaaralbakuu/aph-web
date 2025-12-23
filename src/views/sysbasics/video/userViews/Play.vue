<template>
  <div class="min-h-screen bg-[#F9F9F9] text-[#0f0f0f] relative">
    <!-- File Preview Component -->
    <FilePreviews
      :file-url="showObj.fileUrl"
      :visible="showObj.filePreviews"
      @update:visible="showObj.filePreviews = $event"
    />

    <!-- Custom Exam Record Modal -->
    <div v-if="showObj.examDialog" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div class="flex items-center justify-between px-6 py-4 border-b border-[#e5e5e5]">
          <h2 class="text-xl font-bold text-[#0f0f0f]">{{ l.examRecord }}</h2>
          <button @click="showObj.examDialog = false" class="p-2 hover:bg-gray-100 rounded-full transition text-[#606060] hover:text-[#0f0f0f]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-6 h-6">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="p-6 overflow-y-auto">
          <div class="border border-[#e5e5e5] rounded-lg overflow-hidden mb-6">
            <div class="bg-gray-50 border-b border-[#e5e5e5] grid grid-cols-12 gap-4 px-4 py-3 text-sm font-semibold text-[#606060]">
               <div class="col-span-1">{{ c.sn }}</div>
               <div class="col-span-4">{{ l.examedTime }}</div>
               <div class="col-span-3">{{ l.examUser }}</div>
               <div class="col-span-2">{{ l.examScore }}</div>
               <div class="col-span-2 text-center">{{ c.operate }}</div>
            </div>
            <div v-if="examRecord.length === 0" class="p-8 text-center text-[#606060] text-sm">
               {{ c.noData || 'No Data' }}
            </div>
            <div v-else>
               <div v-for="(row, index) in examRecord" :key="index" class="grid grid-cols-12 gap-4 px-4 py-3 text-sm border-b last:border-0 border-[#e5e5e5] hover:bg-blue-50 transition items-center text-[#0f0f0f]">
                  <div class="col-span-1">{{ index + 1 }}</div>
                  <div class="col-span-4">{{ row.create_time }}</div>
                  <div class="col-span-3 truncate">{{ row.create_user }}</div>
                  <div class="col-span-2 font-medium">{{ row.score }}</div>
                  <div class="col-span-2 text-center">
                     <button @click="reviewExam(row)" class="text-[#065FD4] font-semibold hover:underline px-2 py-1 rounded hover:bg-blue-100 transition">
                        {{ l.check }}
                     </button>
                  </div>
               </div>
            </div>
          </div>
          <div class="flex flex-col sm:flex-row items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-100 gap-4">
             <div class="text-sm text-[#0f0f0f]">
                {{l.mostExam}}
                <span class="font-bold mx-1">{{currentExam.max_reply_num}}</span>{{l.examUnit}}，{{l.youCanExam}}
                <span class="font-bold mx-1" :class="{'text-[#CC0000]': currentExam.max_reply_num - examRecord.length <= 0}">
                  {{currentExam.max_reply_num - examRecord.length}}
                </span>{{l.examUnit}}
             </div>
             <button
               @click="goToExam"
               :disabled="currentExam.max_reply_num - examRecord.length <= 0"
               class="px-5 py-2 bg-[#065FD4] text-white! text-sm font-semibold rounded-full hover:bg-[#0056b3] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-sm"
             >
               {{l.goExam}}
             </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="max-w-[1800px] mx-auto p-4 lg:px-6 lg:py-6 flex flex-col xl:flex-row! gap-6">

      <!-- Left Column: Video & Info -->
      <div class="flex-1 min-w-0">
        <!-- Video Player Wrapper -->
        <div class="w-full aspect-video bg-black rounded-xl overflow-hidden shadow-sm relative group">
          <videoPlayer
            ref="videoPlayerRef"
            :src="currentVideo.url"
            :other_src="currentVideo.other_url"
            :progressControl="true"
            :markers="questionList"
            :playInBackground="false"
            :resumePlaying="true"
            :lastPlayTime="progressObj.progress"
            :maxPlayTime="progressObj.max_progress"
            :finishPoint="currentVideo.finish_time"
            :playbackRateArray="[1]"
            :questionControl="currentVideo.is_process_question"
            :watermark="user.userId + ' ' + user.userName"
            :playStatus.sync="isPlaying"
            @loadedMetadata="getPlayProgress"
            @pause="reportPlayProgress"
            @ended="reportPlayDuration"
            @seeked="reportPlayProgress"
            @play="playVideoAction"
            @progressUpdate="onVideoProgressUpdate"
            class="h-full w-full"
          />
        </div>

        <!-- Video Info Section -->
        <div class="mt-3">
          <!-- Title -->
          <h1 class="text-[20px] font-bold text-[#0f0f0f] leading-7 wrap-break-word mb-2 font-display">
             {{ currentVideoTitle || courseInfo.name_label || l.courseTitle }}
          </h1>

          <!-- Channel Info & Action Buttons Row -->
          <div class="flex flex-col justify-between gap-4">

             <!-- Channel Info -->
             <!-- <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-[#E5E5E5] flex items-center justify-center text-[#606060] font-bold text-lg overflow-hidden">
                   {{ (courseInfo.create_dept || 'C').charAt(0).toUpperCase() }}
                </div>
                <div class="flex flex-col">
                   <span class="text-[16px] font-bold text-[#0f0f0f] leading-tight">
                      {{ courseInfo.create_dept || 'Channel Name' }}
                   </span>
                   <span class="text-[12px] text-[#606060]">
                      {{ courseInfo.create_user || 'Subscribers' }}
                   </span>
                </div>
                <button class="ml-4 px-4 py-2 bg-black text-white! text-sm font-medium rounded-full hover:bg-gray-800 transition">
                   Subscribe
                </button>
             </div> -->

             <!-- Action Buttons -->
             <div class="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">

                <!-- Like/Dislike Pill -->
                <div class="flex items-center bg-[#f2f2f2] rounded-full h-9 overflow-hidden">
                   <button
                     @click="handleGoodBad(1)"
                     class="flex items-center gap-2 px-4 h-full hover:bg-[#e5e5e5] transition border-r border-[#d9d9d9] relative"
                   >
                      <svg v-if="my_goodBad_info.type === 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                      <span class="text-sm font-medium">{{ courseInfo.goodBad_Info.good_count || 0 }}</span>
                   </button>
                   <button
                     @click="handleGoodBad(0)"
                     class="flex items-center px-4 h-full hover:bg-[#e5e5e5] transition"
                   >
                      <svg v-if="my_goodBad_info.type === 0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 mt-1"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>
                      <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5 mt-1"><path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path></svg>
                   </button>
                </div>

                <!-- Share (Generic) -->
                <button class="flex items-center gap-2 px-4 h-9 bg-[#f2f2f2] rounded-full hover:bg-[#e5e5e5] transition text-sm font-medium">
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
                   Share
                </button>

                <!-- Favorite (Save) -->
                <button
                   @click="handleFavorClick"
                   class="flex items-center gap-2 px-4 h-9 bg-[#f2f2f2] rounded-full hover:bg-[#e5e5e5] transition text-sm font-medium"
                 >
                    <svg v-if="favoriteList.total > 0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5 text-[#065FD4]"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="w-5 h-5"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
                    {{ favoriteList.total > 0 ? l.favorited : l.favorite }}
                 </button>

                 <!-- More Options -->
                 <button class="w-9 h-9 flex items-center justify-center bg-[#f2f2f2] rounded-full hover:bg-[#e5e5e5] transition">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><circle cx="12" cy="12" r="2"></circle><circle cx="19" cy="12" r="2"></circle><circle cx="5" cy="12" r="2"></circle></svg>
                 </button>
             </div>
          </div>

          <!-- Description Box -->
          <div class="mt-4 bg-[#f2f2f2] rounded-xl p-3 cursor-pointer hover:bg-[#e5e5e5] transition" @click="toggleDesc">
             <div class="text-[14px] font-bold text-[#0f0f0f] mb-1">
               {{ formatDuration(courseInfo.totalDuration, true) }} • {{ courseInfo.create_time }}
             </div>
             <div class="text-[14px] text-[#0f0f0f] leading-5 whitespace-pre-wrap" :class="{'line-clamp-2': !isDescExpanded}">
                <span class="font-medium mr-2" v-if="courseInfo.tags && courseInfo.tags.length > 0">
                    <span v-for="(tag, idx) in courseInfo.tags" :key="idx" class="text-[#065FD4] mr-1">#{{ tag.name_label }}</span>
                </span>
                {{ courseInfo.description || l.noDescription }}
             </div>
             <button class="mt-1 text-[14px] font-bold text-[#0f0f0f]" v-if="!isDescExpanded">
                {{ l.showMore || 'Show more' }}
             </button>
             <button class="mt-1 text-[14px] font-bold text-[#0f0f0f]" v-else>
                {{ l.showLess || 'Show less' }}
             </button>
          </div>

          <!-- Tabs (Comments, etc) -->
          <div class="mt-6">
            <div class="border-b border-[#e5e5e5] flex gap-6">
               <button
                 v-for="tab in ['details', 'resources', 'exams']"
                 :key="tab"
                 class="pb-2 text-[16px] font-bold border-b-2 transition capitalize"
                 :class="activeTab === tab ? 'border-[#0f0f0f] text-[#0f0f0f]' : 'border-transparent text-[#606060] hover:text-[#0f0f0f]'"
                 @click="activeTab = tab"
               >
                 {{ getTabLabel(tab) }}
               </button>
            </div>

            <!-- Tab Content -->
            <div class="py-4">
               <div v-if="activeTab === 'details'" class="grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-sm">
                  <div class="flex border-b border-dashed border-gray-200 pb-2">
                     <span class="text-[#606060] w-32 shrink-0">{{ l.lecturer }}</span>
                     <span class="text-[#0f0f0f]">{{ courseInfo.lecturer == 1 ? l.internalLecturer : l.externalLecturer }}</span>
                  </div>
                  <div class="flex border-b border-dashed border-gray-200 pb-2">
                     <span class="text-[#606060] w-32 shrink-0">{{ l.courseCatalog }}</span>
                     <span class="text-[#0f0f0f]">{{ returnPublicObjLabel(courseInfo.type, 'value', 'label', 'courseCatalog') }}</span>
                  </div>
                   <div class="flex border-b border-dashed border-gray-200 pb-2">
                     <span class="text-[#606060] w-32 shrink-0">{{ l.profit }}</span>
                     <span class="text-[#0f0f0f]">{{ courseInfo.profit }}</span>
                  </div>
               </div>

               <div v-if="activeTab === 'resources'" class="space-y-2">
                  <div v-if="attachmentList.length === 0" class="text-center py-8 text-[#606060] bg-gray-50 rounded-lg">{{ c.noData }}</div>
                  <div v-else v-for="item in attachmentList" :key="item.id" class="flex items-center justify-between p-3 bg-white border border-[#e5e5e5] rounded-lg hover:bg-gray-50 transition">
                      <div class="flex items-center gap-3">
                         <div class="w-8 h-8 bg-red-100 text-red-600 rounded flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm4 18H6V4h7v5h5v11z"/></svg>
                         </div>
                         <span class="text-sm font-medium truncate text-[#0f0f0f]">{{ item.name_label }}</span>
                      </div>
                      <button @click="previewFile(item.file_url)" class="text-[#065FD4] font-semibold text-xs hover:underline">{{ c.check }}</button>
                  </div>
               </div>

               <div v-if="activeTab === 'exams'" class="space-y-2">
                   <div v-if="examList.length === 0" class="text-center py-8 text-[#606060] bg-gray-50 rounded-lg">{{ c.noData }}</div>
                   <div v-else v-for="item in examList" :key="item.id" class="flex items-center justify-between p-3 bg-white border border-[#e5e5e5] rounded-lg hover:bg-gray-50 transition">
                      <div class="flex items-center gap-3">
                         <div class="w-8 h-8 bg-green-100 text-green-600 rounded flex items-center justify-center shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                         </div>
                         <span class="text-sm font-medium truncate text-[#0f0f0f]">{{ item.name_label }}</span>
                      </div>
                      <button @click="getReplyRecord(item)" class="text-[#065FD4] font-semibold text-xs hover:underline">{{ l.examDetail }}</button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Playlist / Up Next -->
      <div class="w-full xl:w-[400px]! shrink-0">
         <div class="bg-white border border-[#e5e5e5] rounded-xl overflow-hidden flex flex-col xl:max-h-[calc(100vh-40px)]! xl:sticky! xl:top-[90px]!">
             <!-- Playlist Header -->
             <div class="p-3 border-b border-[#e5e5e5] flex items-center justify-between bg-gray-50">
                <div class="font-bold text-[#0f0f0f]">{{ l.course || 'Course Content' }}</div>
                <div class="flex gap-1">
                   <button
                      @click="showObj.playlist='course'"
                      class="px-2 py-1 text-xs font-medium rounded transition"
                      :class="showObj.playlist === 'course' ? 'bg-black text-white!' : 'text-[#606060] hover:bg-gray-200'"
                   >{{ l.course || 'All' }}</button>
                   <button
                      @click="showObj.playlist='topic'"
                      class="px-2 py-1 text-xs font-medium rounded transition"
                      :class="showObj.playlist === 'topic' ? 'bg-black text-white!' : 'text-[#606060] hover:bg-gray-200'"
                   >{{ l.topic || 'Related' }}</button>
                </div>
             </div>

             <!-- List Content -->
             <div class="overflow-y-auto flex-1 p-2 space-y-2 custom-scrollbar">
                <!-- Course Playlist Items -->
                <template v-if="showObj.playlist === 'course'">
                   <div
                      v-for="(video, index) in videoList"
                      :key="video.id"
                      @click="toggleVideo(index)"
                      class="flex gap-2 cursor-pointer group p-1 hover:bg-gray-100 rounded-lg transition"
                      :class="{'bg-[#E5E5E5]': playingIndex === index}"
                   >
                      <!-- Thumbnail -->
                      <div class="relative w-[120px] h-[68px] bg-gray-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                          <img v-if="courseInfo.thumbnail_path" :src="courseInfo.thumbnail_path" class="w-full h-full object-cover" />

                          <div v-if="playingIndex === index" class="absolute inset-0 bg-black/60 flex items-center justify-center text-white!">
                              <svg v-if="isPlaying" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M14 19h4V5h-4v14zm-8 0h4V5H6v14z"/></svg>
                              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M8 5v14l11-7z"/></svg>
                          </div>

                          <div class="absolute bottom-1 right-1 bg-black/80 text-white! text-[10px] px-1 rounded">
                             {{ formatDuration(video.duration) }}
                          </div>
                      </div>

                      <!-- Info -->
                      <div class="flex-1 min-w-0 flex flex-col justify-center">
                          <h3 class="text-[14px] font-semibold text-[#0f0f0f] leading-5 line-clamp-2 mb-1" :class="{'text-[#065FD4]': playingIndex === index}">
                             {{ video.title }}
                          </h3>
                          <div class="text-[12px] text-[#606060]">
                             {{ courseInfo.create_dept || 'Channel' }}
                          </div>
                      </div>
                   </div>
                </template>

                <!-- Topic Playlist Items -->
                <template v-if="showObj.playlist === 'topic'">
                   <div
                      v-for="(item, index) in topicObj.list[0].detail"
                      :key="item.id"
                      @click="switchCourse(item, index)"
                      class="flex gap-2 cursor-pointer group p-1 hover:bg-gray-100 rounded-lg transition"
                      :class="{'bg-[#E5E5E5]': topicObj.index === index}"
                   >
                      <div class="relative w-[120px] h-[68px] bg-gray-200 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                          <img v-if="item.thumbnail_path" :src="item.thumbnail_path" class="w-full h-full object-cover" />
                          <div v-if="topicObj.index === index" class="absolute inset-0 bg-black/60 flex items-center justify-center text-white!">
                              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-5 h-5"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                          </div>
                      </div>
                      <div class="flex-1 min-w-0 flex flex-col justify-center">
                          <h3 class="text-[14px] font-semibold text-[#0f0f0f] leading-5 line-clamp-2 mb-1">
                             {{ item.course_name_label }}
                          </h3>
                          <div class="text-[12px] text-[#606060]">
                             {{ item.create_time }}
                          </div>
                      </div>
                   </div>
                </template>
             </div>
         </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, getCurrentInstance, nextTick } from 'vue'
import debounce from 'lodash.debounce'
import videoPlayer from '@/components/videoPlayer/VideoPlayerPlyr.vue'
import FilePreviews from '@/views/_common/FilePreviews.vue'
import { useLocalI18n } from '@/composables/useLocalI18n'

// Global Instance
const { proxy } = getCurrentInstance()
// Robust fallback for i18n
const { l, c } = useLocalI18n('videoUserPlay')

const user = computed(() => proxy.$store.getters.user || {})

// State
const videoPlayerRef = ref(null)
const activeTab = ref('details')
const isDescExpanded = ref(false)

const currentVideo = ref({ url: '' })
const showObj = reactive({
  examDialog: false,
  playlist: 'course',
  filePreviews: false,
  fileUrl: ""
})
const currentExam = ref({
  id: '',
  questionnaire_id: '',
  max_reply_num: 0
})
const examRecord = ref([])
const playingTimmerId = ref(null)
const playDuration = ref(0)

const params = reactive({
  playId: "",
  userid: '',
  train_primary_id: '',
  no_primary_train_id: '',
  course_primary_id: '',
  no_primary_course_id: '',
  video_id: '',
  progress: 0,
  max_progress: 0,
  is_play: true,
  topic_id: "",
  class_id: ''
})

const my_goodBad_info = ref({
  good_bad_id: '',
  type: '',
})

const courseInfo = ref({
  org_id: '',
  name_zh: '',
  name_tw: '',
  name_en: '',
  description: '',
  thumbnail_path: '',
  score: '',
  totalDuration: 0,
  create_time: '',
  create_dept: '',
  language: '',
  type: '',
  tags: [{ name_label: '' }],
  goodBad_Info: {
    good_count: 0,
    bad_count: 0,
  },
})

const videoList = ref([{
  id: '',
  course_id: '',
  url: '',
  is_process_question: false,
  finish_time: 0,
}])

const examList = ref([])
const questionList = ref([])
const attachmentList = ref([])
const isPlaying = ref(false)
const playingIndex = ref(null)

const progressObj = reactive({
  progress: 0,
  max_progress: 0,
  id: ''
})

const favoriteList = reactive({
  total: 0,
})

const topicObj = reactive({
  query: {
    college_id: "",
    name: "",
    page: 1,
    pageSize: 15,
    is_valid: 'Y'
  },
  list: [{ detail: [] }],
  total: 0,
  index: 0
})

const publicCodeObj = reactive({
  language_type: [],
  courseCatalog: []
})

// Computed
const currentVideoTitle = computed(() => {
  if (videoList.value && playingIndex.value != null && videoList.value[playingIndex.value]) {
    return videoList.value[playingIndex.value].title
  }
  return ''
})

// Watchers
watch(playingIndex, (newValue) => {
  if (newValue != null && newValue >= 0) {
    currentVideo.value = videoList.value[newValue]
    if (currentVideo.value.is_process_question) {
      getBindingQuestionById(currentVideo.value.id)
    } else {
      questionList.value = []
    }
  }
})

// Methods
const toggleDesc = () => {
  isDescExpanded.value = !isDescExpanded.value
}

const getTabLabel = (tab) => {
  const map = {
    details: l.value.details || 'Details',
    resources: l.value.courseMaterial || 'Resources',
    exams: l.value.courseExam || 'Exams'
  }
  return map[tab] || tab
}

const toggleVideo = (index) => {
  reportPlayProgress()
  playingIndex.value = index
}

const previewFile = (url) => {
  showObj.fileUrl = proxy.$api.videoServer + '/' + url
  showObj.filePreviews = true
}

const switchCourse = (i, index) => {
  playingIndex.value = null
  topicObj.index = index
  getCourseInfo(i.course_primary_id, true)
  getCourseResource(i.course_primary_id)
}

const getBindingQuestionById = (id) => {
  proxy.$request(proxy.$api.videoServer + '/Video/VideoProcessQuestion/getList', {
    video_id: id,
  }).then((r) => {
    if (r.data.length > 0) {
      let questionsArray = r.data.map((i) => {
        let q = i.question
        return {
          bind_id: i.id,
          time: i.time,
          color: '#409eff',
          id: q.id,
          text: q.name_label,
          options: q.options,
          question_type: q.question_type,
          difficulty_level: q.difficulty_level,
          question_status: q.question_status,
        }
      })
      questionList.value = questionsArray
    } else {
      questionList.value = []
    }
  })
}

const getCourseInfo = (vid, myGoodBad) => {
  proxy.$request(
      proxy.$api.videoServer + '/Video/VideoCourseCatalog/getCourseList', {
        id: vid,
        page: 1,
        pageSize: 1,
      },
      'post'
    )
    .then((r) => {
      courseInfo.value = r.data.list[0]
      params.course_primary_id = courseInfo.value.id
      params.no_primary_course_id = courseInfo.value.course_id
      if (myGoodBad) {
        getMyGoodBad(params.no_primary_course_id)
      }
      getFavorList()
    })
    .catch((e) => {
      console.log(e)
    })
}

const getMyGoodBad = (course_id) => {
  proxy.$request(
    proxy.$api.videoServer + '/Video/VideoCourseCatalog/getMyGoodBad', {
      page: 1,
      pageSize: 1,
      userid: user.value.userId,
      course_id: course_id,
    }
  ).then((r) => {
    if (r.data.total) {
      my_goodBad_info.value = r.data.list[0]
    } else {
      my_goodBad_info.value = {
        good_bad_id: '',
        type: '',
      }
    }
  })
}

const handleGoodBad = (type) => {
  if (my_goodBad_info.value.good_bad_id) {
    cancelGoodBad(type)
  } else {
    submitGoodBad(type)
  }
}

const submitGoodBad = (type) => {
  proxy.$request(
    proxy.$api.videoServer + '/Video/VideoCourseCatalog/goodBad', {
      id: '',
      course_id: params.no_primary_course_id,
      userid: user.value.userId,
      type: type,
    },
    'post'
  ).then((r) => {
    if (r.status) {
      if (my_goodBad_info.value.type == 1) {
        proxy.$message({
          message: c.value.success,
          type: 'success',
        })
      } else {
        proxy.$message({
          message: c.value.success,
          type: 'success',
        })
      }
      getCourseInfo(params.course_primary_id, 'myGoodBad')
    }
  })
}

const cancelGoodBad = (type) => {
  proxy.$request(
    proxy.$api.videoServer + '/Video/VideoCourseCatalog/cancelGoodBad', {
      id: my_goodBad_info.value.good_bad_id,
    },
    'post'
  ).then((r) => {
    if (r.status) {
      if (typeof type == 'number') {
        submitGoodBad(type)
      } else {
        if (my_goodBad_info.value.type == 1) {
          proxy.$message({
            message: c.value.success,
            type: 'success',
          })
        } else {
          proxy.$message({
            message: c.value.success,
            type: 'success',
          })
        }
        getCourseInfo(params.course_primary_id)
        my_goodBad_info.value = {
          good_bad_id: '',
          type: '',
        }
      }
    }
  })
}

const getCourseResource = (vid) => {
  proxy.$request(
      proxy.$api.videoServer +
      '/Video/VideoCourseCatalog/getCourseVideoAndExam?course_id=' + vid)
    .then((r) => {
      videoList.value = []
      examList.value = []
      courseInfo.value.totalDuration = 0
      if (r.data.length > 0) {
        params.no_primary_course_id = r.data[0].no_primary_course_id
        r.data.forEach((i, index) => {
          if (i.video) {
            if (!i.video.url.includes('http')) {
              i.video.url = proxy.$api.videoServer + i.video.url
            }
            if (i.video.other_url) {
              try {
                let videoUrls = JSON.parse(i.video.other_url)
                for (let key in videoUrls) {
                  if (Object.prototype.hasOwnProperty.call(videoUrls, key)) {
                    videoUrls[key] = proxy.$api.videoServer + videoUrls[key];
                  }
                }
                i.video.other_url = videoUrls
              } catch(e) { /* ignore */ }
            }
            i.video.finish_time = i.finish_time
            courseInfo.value.totalDuration += i.video.duration
            videoList.value.push(i.video)
            if (i.video.id == params.video_id) {
              toggleVideo(index)
            }
          } else {
            examList.value.push(i.exam)
          }
        })
        if (playingIndex.value == null) {
          playingIndex.value = 0
        }
      }
    })
    .catch((e) => {
      console.log(e)
    })
}

const reviewExam = (data) => {
  let url = proxy.$router.resolve({
    name: 'examDetail',
    query: {
      exam_id: currentExam.value.id,
      questionnaire_id: currentExam.value.questionnaire_id,
      reply_id: data.id,
      mode: 'review'
    }
  }).href;
  window.open(url, '_blank');
}

const goToExam = () => {
  let url = proxy.$router.resolve({
    name: 'examDetail',
    query: {
      train_id: params.train_id,
      train_primary_id: params.train_primary_id,
      course_id: params.course_primary_id,
      exam_id: currentExam.value.id,
      questionnaire_id: currentExam.value.questionnaire_id,
      mode: 'exam'
    }
  }).href;
  window.open(url, '_blank');
}

const getReplyRecord = (i) => {
  currentExam.value = i
  proxy.$request(proxy.$api.videoServer + '/Video/VideoExam/getAnswerList', {
    exam_id: i.id,
    userid: user.value.userId,
    questionnaire_id: i.questionnaire_id,
    course_id: params.course_primary_id,
    train_id: params.no_primary_train_id,
    train_primary_id: params.train_primary_id,
    course_primary_id: params.course_primary_id,
    class_id: params.class_id,
    is_test: false,
    page: 1,
    pageSize: 10
  }).then(r => {
    examRecord.value = r.data.list
    showObj.examDialog = true
  })
}

const formatDuration = (totalSeconds, unit) => {
  let duration = Math.floor(totalSeconds)
  let hours = Math.floor(duration / 3600)
  let minutes = Math.floor((duration % 3600) / 60)
  let seconds = duration % 60

  if (unit) {
    return [
        hours > 0 ? `${hours}h ` : '',
        minutes.toString().padStart(2, '0') + 'm ',
        seconds.toString().padStart(2, '0') + 's',
      ]
      .filter(Boolean)
      .join('')
  } else {
    return [
        hours > 0 ? `${hours}:` : '',
        minutes.toString().padStart(2, '0') + ':',
        seconds.toString().padStart(2, '0'),
      ]
      .filter(Boolean)
      .join('')
  }
}

const playVideoAction = () => {
  if (!params.playId) {
    if(videoPlayerRef.value?.player) videoPlayerRef.value.player.pause()
    proxy.$message(l.value.playActionError)
    return
  }
  if (videoPlayerRef.value?.player) {
    let progress = videoPlayerRef.value.videoObj.currentTime
    let max_progress = videoPlayerRef.value.videoObj.watchMaxTime
    proxy.$request(
      proxy.$api.videoServer + '/Video/Video/playVideoAction',
      [{
        playId: params.playId,
        userid: user.value.userId,
        train_id: params.train_primary_id,
        no_primary_train_id: params.no_primary_train_id,
        course_id: params.course_primary_id,
        no_primary_course_id: params.no_primary_course_id,
        video_id: currentVideo.value.id,
        progress: progress,
        max_progress: max_progress,
        is_play: true,
      }],
      'post',
      'noErrorDialog'
    ).then((r) => {
      // success
    })
  }
}

const reportPlayProgress = () => {
  if (videoPlayerRef.value?.player) {
    let currentRate = 1
    const player = videoPlayerRef.value.player
    if (player.speed !== undefined) {
      currentRate = player.speed
    } else if (typeof player.playbackRate === 'function') {
      currentRate = player.playbackRate()
    } else if (player.playbackRate !== undefined) {
      currentRate = player.playbackRate
    }

    if (currentRate != 1) {
      return proxy.$message({
        message: l.value.playbackSpeedError,
        type: 'warning'
      })
    }
    let progress = videoPlayerRef.value.videoObj.currentTime
    let max_progress = videoPlayerRef.value.videoObj.watchMaxTime
    let playStatus = videoPlayerRef.value.flagObj.isPlaying

    if (progress > 0 && max_progress >= progress) {
      proxy.$request(
        proxy.$api.videoServer + '/Video/Video/uploadPlayProcess',
        [{
          playId: params.playId,
          userid: user.value.userId,
          train_id: params.train_primary_id,
          no_primary_train_id: params.no_primary_train_id,
          course_id: params.course_primary_id,
          no_primary_course_id: params.no_primary_course_id,
          video_id: currentVideo.value.id,
          progress: progress,
          max_progress: max_progress,
          is_play: playStatus,
        }],
        'post',
        'noErrorDialog'
      ).then((r) => {
         // success
      })
    }
  }
}

const getPlayProgress = () => {
  if (videoPlayerRef.value?.player) {
    proxy.$request(
      proxy.$api.videoServer + '/Video/Video/getPlayProcess', {
        playId: params.playId,
        userid: user.value.userId,
        train_id: params.train_primary_id,
        no_primary_train_id: params.no_primary_train_id,
        course_id: params.course_primary_id,
        no_primary_course_id: params.no_primary_course_id,
        video_id: currentVideo.value.id,
        progress: 0,
        max_progress: 0,
        is_play: isPlaying.value
      },
      'post',
      'noErrorDialog'
    ).then((r) => {
      if ((r.httpCode == 200) & (r.status == true)) {
        if (r.data.playId) {
          params.playId = r.data.playId
        } else {
          params.playId = r.data.id
        }
        let progress = parseInt(r.data.progress)
        let max_progress = parseInt(r.data.max_progress)
        progressObj.progress = progress <= max_progress ? progress : max_progress
        progressObj.max_progress = max_progress
      }
    })
  }
}

const reportPlayDuration = () => {
  if (videoPlayerRef.value?.player) {
    proxy.$request(
      proxy.$api.videoServer + '/Video/Video/uploadPlayDuration', {
        userid: user.value.userId,
        train_id: params.train_primary_id,
        no_primary_train_id: params.no_primary_train_id,
        course_id: params.no_primary_course_id,
        video_id: currentVideo.value.id,
        course_primary_id: params.course_primary_id,
        play_time: playDuration.value,
        playId: params.playId,
        create_time: new Date().toLocaleString()
      },
      'post',
      'noErrorDialog'
    ).then((r) => {
       // success
    })
  }
}

const onVideoProgressUpdate = (progressData) => {
  reportPlayProgress();
  reportPlayDuration()
}

const getAttachments = (id) => {
  attachmentList.value = []
  proxy.$request(proxy.$api.videoServer + '/Video/VideoCourseCatalog/GetCourseAttachemnts', {
      course_primary_id: id,
      page: 1,
      pageSize: 9999
    })
    .then(r => {
      if (r.httpCode == 200) {
        attachmentList.value = r.data.list
      }
    })
    .catch(e => {
      console.log(e);
    })
}

const getFavorList = () => {
  proxy.$request(proxy.$api.videoServer + '/Video/Favorite/getlist', {
    course_id: params.no_primary_course_id,
    page: 1,
    pageSize: 9999,
  }).then((r) => {
    favoriteList.total = r.data.total
  })
}

const returnLanguageLabel = (v) => {
  let item = publicCodeObj.language_type.find(i => i.value == v)
  return item ? item.label : v
}

const returnPublicObjLabel = (value, key, label, filed) => {
  if (!publicCodeObj[filed]) return value
  let item = publicCodeObj[filed].find(i => i[key] == value)
  return item ? item[label] : value
}

const getLanguage_type = () => {
  proxy.$request(proxy.$api.publiccode + 'getListdetailed', {
      queryString: {},
      ruleno: '121',
      pageSize: 9999
    })
    .then(r => {
      let list = [];
      r.data.list.forEach(j => {
        list.push({
          label: j.name_label,
          value: j.code_no
        });
      })
      publicCodeObj.language_type = list
    })
    .catch(e => {
      // proxy.$message.error(e.message) // Suppress during verify
      console.warn("Language Type Load Failed", e)
    })
}

const getCourseCatalog = () => {
  proxy.$request(proxy.$api.publiccode + 'getListdetailed', {
      queryString: {},
      ruleno: '122',
      pageSize: 9999
    })
    .then(r => {
      let list = [];
      r.data.list.forEach(j => {
        list.push({
          label: j.name_label,
          value: j.code_no
        });
      })
      publicCodeObj.courseCatalog = list
    })
    .catch(e => {
      // proxy.$message.error(e.message) // Suppress during verify
    })
}

const getTopicList = (id) => {
  proxy.$request(proxy.$api.videoServer + '/Video/VideoPageTag/getlist', {
      ...topicObj.query,
      college_id: proxy.$store.getters.collegeId || '', // Check store for collegeId
      id: id
    })
    .then(r => {
      if (r.status) {
        topicObj.list = r.data.list
        topicObj.total = r.data.total
        topicObj.index = r.data.list[0].detail.findIndex(i => i.course_primary_id == params.course_id)
      }
    })
    .catch(e => {
      console.log(e);
    })
}

const handleFavorClick = debounce(function() {
  let courseObj = {
    course_id: params.no_primary_course_id,
  }
  proxy.$request(
      proxy.$api.videoServer + '/Video/Favorite/addOrRemoveFavorite',
      courseObj,
      'post'
    )
    .then(() => {
      getFavorList()
    })
    .catch(() => {})
}, 300)

// Lifecycle
onMounted(() => {
  getLanguage_type()
  getCourseCatalog()
  if (proxy.$route.query.course_primary_id) {
    Object.assign(params, proxy.$route.query)
    getAttachments(params.course_primary_id)
    getCourseResource(params.course_primary_id)
    getCourseInfo(params.course_primary_id, 'myGoodBad')

    playingTimmerId.value = setInterval(() => {
      if (isPlaying.value) {
        playDuration.value += 1
        if (playDuration.value % 5 == 0 && playDuration.value > 0) {
          reportPlayProgress()
          reportPlayDuration()
          playDuration.value = 0
        }
      }
    }, 1000)
  } else {
    console.log('No course_primary_id found');
  }

  if (proxy.$route.query.topic_id) {
    getTopicList(proxy.$route.query.topic_id)
  }
})

onBeforeUnmount(() => {
  if (playDuration.value) {
    reportPlayDuration()
    reportPlayProgress()
  }
  if (playingTimmerId.value) {
    clearInterval(playingTimmerId.value)
  }
})
</script>

<style scoped>
/* Custom scrollbar for playlist */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 20px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #9ca3af;
}
</style>
