<template>
  <div>
    <div class="flex overflow-hidden items-start border border-b border-gray-300">
      <div class="flex-1 h-full">
        <VideoPlayer ref="videoPlayerRef" :src="state.currentVideo.url" :other_src="state.currentVideo.other_url" :progressControl="true" :markers="state.questionList" :playInBackground="false" :resumePlaying="true" :lastPlayTime="state.progressObj.progress" :maxPlayTime="state.progressObj.max_progress" :finishPoint="state.currentVideo.finish_time" :playbackRateArray="[1]" :questionControl="state.currentVideo.is_process_question" :watermark="user.userId + ' ' + user.userName" :playStatus.sync="state.isPlaying" @loadedMetadata="getPlayProgress" @pause="reportPlayProgress" @ended="reportPlayDuration" @seeked="reportPlayProgress" @play="playVideoAction" @progressUpdate="onVideoProgressUpdate"></VideoPlayer>
      </div>

      <div class="flex flex-col overflow-hidden w-[420px] border-l border-gray-300 bg-gray-50" :style="{ height: playlistHeight }">
        <!-- 列表 -->
        <div class="border-b border-solid border-gray-300 px-3 py-2 bg-white">
          <div class="flex justify-between items-center">
            <div @click="state.showObj.playlist = 'course'" class="font-black text-lg cursor-pointer">
              {{ l.courseTitle }}
            </div>
            <div>
              {{ state.videoList.length }} {{ c.episodes || 'videos' }}
            </div>
          </div>
          <div
            v-show="state.topicObj.list[0].detail.length > 1"
            @click="state.showObj.playlist = 'topic'"
            :style="{
              color: state.showObj.playlist == 'topic' ? '#409fee' : '#fff',
            }">
            {{ l.topicTitle }}
          </div>
        </div>
        <div class="overflow-y-auto flex-1">
          <div class="flex flex-col" v-show="state.showObj.playlist == 'course'">
            <div v-for="(i, index) in state.videoList" :key="i.id" @click="toggleVideo(index)" :class="`flex items-center overflow-hidden py-2 hover:bg-gray-100 cursor-pointer ${state.playingIndex == index ? 'bg-gray-200!' : ''}`">
              <div class="w-8 flex justify-center">
                <i v-if="state.playingIndex == index" :class="state.isPlaying ? 'el-icon-video-pause playing' : 'el-icon-video-play'"></i>
                <span v-else>{{ index + 1 }}</span>
              </div>
              <div class="flex-1 overflow-hidden flex">
                <div>
                  <div class="pb-[52.5%] relative w-24 mr-3">
                    <img :src="i.thumbnail_path ? api.videoServer + '/' + i.thumbnail_path : ''" class="absolute top-0 left-0 w-full h-full object-cover rounded" />
                    <div class="absolute bottom-1 right-1 bg-black/60 text-white text-xs px-1 rounded">
                      {{ formatDuration(i.duration) }}
                    </div>
                  </div>
                </div>
                <div class="flex flex-col flex-1">
                  <div class="line-clamp-2 pr-2 font-bold text-xs" :title="i.title">
                    {{ i.title }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="list" v-show="state.showObj.playlist == 'topic'">
            <div
              v-for="(i, index) in state.topicObj.list[0].detail"
              :key="i.id"
              @click="switchCourse(i, index)"
              class="item"
              :style="{
                border: state.topicObj.index == index ? '2px solid #409fee' : '2px solid rgba(99, 99, 99, 0.4) ',
              }">
              <div class="title">
                <el-tooltip effect="light" placement="right">
                  <div slot="content" style="max-width: 300px" class="text-clamp-4">
                    {{ i.description }}
                  </div>
                  <span class="text-clamp-2" :style="{ 'max-width': 'calc(100% - 20px)' }">{{ i.course_name_label }}</span>
                </el-tooltip>
                <div v-show="state.topicObj.index == index">
                  <i class="el-icon-location"></i>
                </div>
              </div>
              <div class="duration">
                <div>{{ l.createTime }}:{{ i.create_time }}</div>
                <div>
                  <span style="margin-right: 1em">
                    <i class="iconfont icon-appreciate_light"></i>
                    {{ i.goodBad_Info.good_count }}
                  </span>
                  <span>
                    <i class="iconfont icon-oppose_light"></i>
                    {{ i.goodBad_Info.bad_count }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Info Section - Redesigned with Tailwind CSS 4 -->
    <div class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- Action Bar -->
      <div class="flex gap-6 px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div class="flex gap-6">
          <!-- Like Button -->
          <button @click="handleGoodBad(1)" class="flex items-center gap-2 group hover:text-blue-600 transition-colors">
            <i v-if="state.my_goodBad_info.type === 1" class="iconfont icon-appreciate_fill_light text-blue-600 text-lg"></i>
            <i v-else class="iconfont icon-appreciate_light text-gray-400 group-hover:text-blue-600 text-lg"></i>
            <span class="text-sm font-medium text-gray-700 group-hover:text-blue-600">{{ state.courseInfo.goodBad_Info.good_count }}</span>
          </button>
          
          <!-- Dislike Button -->
          <button @click="handleGoodBad(0)" class="flex items-center gap-2 group hover:text-red-600 transition-colors">
            <i v-if="state.my_goodBad_info.type === 0" class="iconfont icon-oppose_fill_light text-red-600 text-lg"></i>
            <i v-else class="iconfont icon-oppose_light text-gray-400 group-hover:text-red-600 text-lg"></i>
            <span class="text-sm font-medium text-gray-700 group-hover:text-red-600">{{ state.courseInfo.goodBad_Info.bad_count }}</span>
          </button>
          
          <!-- Favorite Button -->
          <button @click="handleFavorClick" class="flex items-center gap-2 group hover:text-pink-600 transition-colors">
            <i v-if="state.favoriteList.total > 0" class="iconfont icon-favor_fill_light text-pink-600 text-lg"></i>
            <i v-else class="iconfont icon-favor_light text-gray-400 group-hover:text-pink-600 text-lg"></i>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-8 p-6">
        <!-- Left Column - Course Info -->
        <div class="col-span-2 space-y-6">
          <!-- Course Details Grid -->
          <div class="space-y-4">
            <h3 class="text-lg font-bold text-gray-900">{{ l.courseInformation || 'Course Information' }}</h3>
            
            <!-- Info Grid 1 -->
            <div class="grid grid-cols-2 gap-6 bg-gray-50 p-4 rounded-lg">
              <div class="flex flex-col">
                <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">{{ l.courseCatalog }}</span>
                <span class="text-sm text-gray-900 mt-1 font-medium">{{ returnPublicObjLabel(state.courseInfo.type, 'value', 'label', 'courseCatalog') }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">{{ l.createDept }}</span>
                <span class="text-sm text-gray-900 mt-1 font-medium">{{ state.courseInfo.create_dept }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">{{ l.totalDuration }}</span>
                <span class="text-sm text-gray-900 mt-1 font-medium text-blue-600">{{ formatDuration(state.courseInfo.totalDuration) }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-semibold text-gray-600 uppercase tracking-wide">{{ l.score }}</span>
                <span class="text-sm text-gray-900 mt-1 font-medium">{{ state.courseInfo.score }} {{ c.points || 'pts' }}</span>
              </div>
            </div>

            <!-- Info Grid 2 -->
            <div class="grid grid-cols-2 gap-6 bg-indigo-50 p-4 rounded-lg border border-indigo-200">
              <div class="flex flex-col">
                <span class="text-xs font-semibold text-indigo-700 uppercase tracking-wide">{{ l.lecturer }}</span>
                <span class="text-sm text-gray-900 mt-1 font-medium">{{ state.courseInfo.lecturer == 1 ? l.internalLecturer : l.externalLecturer }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-semibold text-indigo-700 uppercase tracking-wide">{{ l.trainLanguage }}</span>
                <span class="text-sm text-gray-900 mt-1 font-medium">{{ returnPublicObjLabel(state.courseInfo.language, 'value', 'label', 'language_type') }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-semibold text-indigo-700 uppercase tracking-wide">{{ l.applicableGroup }}</span>
                <span class="text-sm text-gray-900 mt-1 font-medium">{{ state.courseInfo.applicable_group }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-xs font-semibold text-indigo-700 uppercase tracking-wide">{{ l.profit }}</span>
                <span class="text-sm text-gray-900 mt-1 font-medium">{{ state.courseInfo.profit }}</span>
              </div>
            </div>
          </div>

          <!-- Description Section -->
          <div class="space-y-3">
            <h4 class="text-sm font-bold text-gray-900 uppercase tracking-wide">{{ l.courseDesc }}</h4>
            <p class="text-sm text-gray-700 leading-relaxed line-clamp-3">{{ state.courseInfo.description }}</p>
            
            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mt-3">
              <el-tag v-for="(tag, index) in state.courseInfo.tags" :key="index" type="info" size="small" class="bg-blue-50 text-blue-700 border-blue-200">
                {{ tag.name_label }}
              </el-tag>
            </div>
          </div>
        </div>

        <!-- Right Column - Materials & Exams -->
        <div class="col-span-1 space-y-6">
          <!-- Course Materials -->
          <div class="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-4">
            <h4 class="text-sm font-bold text-amber-900 mb-3 flex items-center gap-2">
              <i class="iconfont icon-attachment text-amber-600"></i>
              {{ l.courseMaterial }}
            </h4>
            <div v-if="state.attachmentList.length == 0" class="flex items-center justify-center py-6 text-gray-400">
              <span class="text-xs">{{ c.noData }}</span>
            </div>
            <div v-else class="space-y-2">
              <div v-for="i in state.attachmentList" :key="i.id" class="flex items-center justify-between bg-white p-2 rounded border border-amber-100 hover:shadow-md transition-shadow">
                <span class="text-xs text-gray-700 truncate flex-1">{{ i.name_label }}</span>
                <button @click="previewFile(i.file_url)" class="ml-2 px-2 py-1 text-xs bg-amber-500 hover:bg-amber-600 text-white rounded transition-colors">
                  {{ c.check }}
                </button>
              </div>
            </div>
          </div>

          <!-- Exams Section -->
          <div class="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
            <h4 class="text-sm font-bold text-purple-900 mb-3 flex items-center gap-2">
              <i class="iconfont icon-exam text-purple-600"></i>
              {{ l.courseExam }}
            </h4>
            <div v-if="state.examList.length == 0" class="flex items-center justify-center py-6 text-gray-400">
              <span class="text-xs">{{ c.noData }}</span>
            </div>
            <div v-else class="space-y-2">
              <div v-for="i in state.examList" :key="i.id" class="flex items-center justify-between bg-white p-2 rounded border border-purple-100 hover:shadow-md transition-shadow">
                <span class="text-xs text-gray-700 truncate flex-1">{{ i.name_label }}</span>
                <button @click="getReplyRecord(i)" class="ml-2 px-2 py-1 text-xs bg-purple-500 hover:bg-purple-600 text-white rounded transition-colors">
                  {{ l.examDetail }}
                </button>
              </div>
            </div>
          </div>

          <!-- Create Time Info -->
          <div class="bg-gray-100 rounded-lg p-3 border border-gray-300">
            <div class="flex flex-col gap-1">
              <span class="text-xs font-semibold text-gray-600">{{ l.createTime }}</span>
              <span class="text-xs text-gray-800">{{ state.courseInfo.create_time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch, onMounted, onBeforeUnmount, nextTick, ref, getCurrentInstance } from 'vue'
import store from '@/store'
import { Message as ElMessage } from 'element-ui'
import debounce from 'lodash.debounce'
import { useLocalI18n } from '@/composables/useLocalI18n'
import api from '@/api'

import VideoPlayer from '@/components/videoPlayer/VideoPlayerPlyr.vue'

const instance = getCurrentInstance()
const route = instance.proxy.$route
const router = instance.proxy.$router
const { $request } = instance.proxy
const { l, c } = useLocalI18n('videoUserPlay')
const videoPlayerRef = ref()

// Computed properties
const user = computed(() => store.getters.user)

// Reactive data
const state = reactive({
  currentVideo: {
    url: '',
  },
  showObj: {
    examDialog: false,
    playlist: 'course',
    filePreviews: false,
    fileUrl: '',
  },
  currentExam: {
    id: '',
    questionnaire_id: '',
    max_reply_num: 0,
  },
  examRecord: [],
  playingTimmerId: null,
  reportInterval: 5 * 1000,
  playDuration: 0,
  params: {
    playId: '', //播放id,从getPlayProgress方法中获取
    userid: '', //用户id
    train_primary_id: '', //培训主键id,只能从外部onload中获取
    no_primary_train_id: '', //培训非主键id,只能从外部onload中获取
    course_primary_id: '', //课程id
    no_primary_course_id: '', //课程非主键id
    video_id: '', //当前视频的id，从this.currentVideo中获取
    progress: 0, //当前播放进度，单位S
    max_progress: 0, //最大播放进度，单位S
    is_play: true,

    topic_id: '', //专题id，拥有此项会自动请求专题内其他课程
    class_id: '',
  },
  my_goodBad_info: {
    good_bad_id: '',
    type: '',
  },
  courseInfo: {
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
    tags: [
      {
        name_label: '',
      },
    ],
    goodBad_Info: {
      good_count: 0,
      bad_count: 0,
    },
  },
  videoList: [
    // {
    //   id: '',
    //   course_id: '',
    //   url: '',
    //   is_process_question: false,
    //   finish_time: 0,
    // },
  ],
  examList: [],
  questionList: [],
  attachmentList: [],
  isPlaying: false,
  playingIndex: null,
  progressObj: {
    progress: 0,
    max_progress: 0,
    id: '',
  },
  favoriteList: {
    total: 0,
  },

  topicObj: {
    query: {
      college_id: '',
      name: '',
      page: 1,
      pageSize: 15,
      is_valid: 'Y',
    },
    list: [
      {
        detail: [],
      },
    ],
    total: 0,
    index: 0,
  },

  publicCodeObj: {
    language_type: [],
    courseCatalog: [],
  },
  playlistHeight: 'auto',
})

// Watch
watch(
  () => state.playingIndex,
  (newValue) => {
    if (newValue != null && newValue >= 0) {
      state.currentVideo = state.videoList[newValue]
      if (state.currentVideo.is_process_question) {
        getBindingQuestionById(state.currentVideo.id)
      } else {
        state.questionList = []
      }
    }
  }
)

// Methods
const toggleVideo = (index) => {
  //切换当前播放视频时，上报播放进度
  reportPlayProgress()
  state.playingIndex = index
}

const previewFile = (url) => {
  state.showObj.fileUrl = api.videoServer + '/' + url
  state.showObj.filePreviews = true
}

const switchCourse = (i, index) => {
  state.playingIndex = null
  state.topicObj.index = index
  getCourseInfo(i.course_primary_id, true)
  getCourseResource(i.course_primary_id)
}

const getBindingQuestionById = (id) => {
  // Assuming $request is available, perhaps from a composable or global
  // For now, keeping as is, but in Vue 3, might need to inject or use composable
  // TODO: Convert to TanStack Query
  $request(api.videoServer + '/Video/VideoProcessQuestion/getList', { video_id: id }).then((r) => {
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
      state.questionList = questionsArray
    } else {
      state.questionList = []
    }
  })
}

const getCourseInfo = (vid, myGoodBad) => {
  $request(api.videoServer + '/Video/VideoCourseCatalog/getCourseList', { id: vid, page: 1, pageSize: 1 }, 'post')
    .then((r) => {
      state.courseInfo = r.data.list[0]
      state.params.course_primary_id = state.courseInfo.id
      state.params.no_primary_course_id = state.courseInfo.course_id
      if (myGoodBad) {
        getMyGoodBad(state.params.no_primary_course_id)
      }
      getFavorList()
    })
    .catch((e) => {
      console.log(e)
    })
}

const getMyGoodBad = (course_id) => {
  $request(api.videoServer + '/Video/VideoCourseCatalog/getMyGoodBad', {
    page: 1,
    pageSize: 1,
    userid: user.value.userId,
    course_id: course_id,
  }).then((r) => {
    if (r.data.total) {
      state.my_goodBad_info = r.data.list[0]
    } else {
      state.my_goodBad_info = {
        good_bad_id: '',
        type: '',
      }
    }
  })
}

const handleGoodBad = (type) => {
  if (state.my_goodBad_info.good_bad_id) {
    cancelGoodBad(type)
  } else {
    submitGoodBad(type)
  }
}

const submitGoodBad = (type) => {
  $request(
    api.videoServer + '/Video/VideoCourseCatalog/goodBad',
    {
      id: '',
      course_id: state.params.no_primary_course_id,
      userid: user.value.userId,
      type: type,
    },
    'post'
  ).then((r) => {
    if (r.status) {
      ElMessage.success(c.success)
      getCourseInfo(state.params.course_primary_id, 'myGoodBad')
    }
  })
}

const cancelGoodBad = (type) => {
  $request(api.videoServer + '/Video/VideoCourseCatalog/cancelGoodBad', { id: state.my_goodBad_info.good_bad_id }, 'post').then((r) => {
    if (r.status) {
      if (typeof type == 'number') {
        submitGoodBad(type)
      } else {
        ElMessage.success(c.success)
        getCourseInfo(state.params.course_primary_id)
        state.my_goodBad_info = {
          good_bad_id: '',
          type: '',
        }
      }
    }
  })
}

const getCourseResource = (vid) => {
  $request(api.videoServer + '/Video/VideoCourseCatalog/getCourseVideoAndExam?course_id=' + vid)
    .then((r) => {
      state.videoList = []
      state.examList = []
      state.courseInfo.totalDuration = 0
      if (r.data.length > 0) {
        state.params.no_primary_course_id = r.data[0].no_primary_course_id
        r.data.forEach((i, index) => {
          if (i.video) {
            if (!i.video.url.includes('http')) {
              i.video.url = api.videoServer + i.video.url
            }
            if (i.video.other_url) {
              let videoUrls = JSON.parse(i.video.other_url)
              for (let key in videoUrls) {
                if (Object.prototype.hasOwnProperty.call(videoUrls, key)) {
                  videoUrls[key] = api.videoServer + videoUrls[key]
                }
              }
              i.video.other_url = videoUrls
            }
            i.video.finish_time = i.finish_time
            state.courseInfo.totalDuration += i.video.duration
            state.videoList.push(i.video)
            if (i.video.id == state.params.video_id) {
              toggleVideo(index)
            }
          } else {
            state.examList.push(i.exam)
          }
        })
        if (state.playingIndex == null) {
          state.playingIndex = 0
        }
      }
    })
    .catch((e) => {
      console.log(e)
    })
}

const reviewExam = (data) => {
  let url = router.resolve({
    name: 'examDetail',
    query: {
      exam_id: state.currentExam.id,
      questionnaire_id: state.currentExam.questionnaire_id,
      reply_id: data.id,
      mode: 'review',
    },
  }).href
  window.open(url, '_blank')
}

const goToExam = () => {
  let url = router.resolve({
    name: 'examDetail',
    query: {
      train_id: state.params.train_id,
      train_primary_id: state.params.train_primary_id,
      course_id: state.params.course_primary_id,
      exam_id: state.currentExam.id,
      questionnaire_id: state.currentExam.questionnaire_id,
      mode: 'exam',
    },
  }).href
  window.open(url, '_blank')
}

const getReplyRecord = (i) => {
  state.currentExam = i
  $request(api.videoServer + '/Video/VideoExam/getAnswerList', {
    exam_id: i.id,
    userid: user.value.userId,
    questionnaire_id: i.questionnaire_id,
    course_id: state.params.course_primary_id,
    train_id: state.params.no_primary_train_id,
    train_primary_id: state.params.train_primary_id,
    course_primary_id: state.params.course_primary_id,
    class_id: state.params.class_id,
    is_test: true,
    page: 1,
    pageSize: 10,
  }).then((r) => {
    state.examRecord = r.data.list
    state.showObj.examDialog = true
  })
}

const formatDuration = (totalSeconds, unit) => {
  let duration = Math.floor(totalSeconds)
  let hours = Math.floor(duration / 3600)
  let minutes = Math.floor((duration % 3600) / 60)
  let seconds = duration % 60

  if (unit) {
    return [hours > 0 ? `${hours}时` : '', minutes.toString().padStart(2, '0') + '分', seconds.toString().padStart(2, '0') + '秒'].filter(Boolean).join('')
  } else {
    return [hours > 0 ? `${hours}:` : '', minutes.toString().padStart(2, '0') + ':', seconds.toString().padStart(2, '0')].filter(Boolean).join('')
  }
}

const playVideoAction = () => {
  if (!state.params.playId) {
    videoPlayerRef.value?.player?.pause()
    ElMessage.error(l.playActionError)
    return
  }
  if (videoPlayerRef.value?.player) {
    let progress = videoPlayerRef.value.videoObj.currentTime //当前播放进度
    let max_progress = videoPlayerRef.value.videoObj.watchMaxTime //最大播放进度
    $request(
      api.videoServer + '/Video/Video/playVideoAction',
      [
        {
          playId: state.params.playId,
          userid: user.value.userId,
          train_id: state.params.train_primary_id,
          no_primary_train_id: state.params.no_primary_train_id,
          course_id: state.params.course_primary_id,
          no_primary_course_id: state.params.no_primary_course_id,
          video_id: state.currentVideo.id,
          progress: progress,
          max_progress: max_progress,
          is_play: true,
        },
      ],
      'post'
    ).then((r) => {
      if ((r.httpCode == 200) & (r.status == true)) {
        // console.log(r);
      }
    })
  }
}

const reportPlayProgress = () => {
  if (videoPlayerRef.value?.player) {
    // Get playback rate - Plyr uses .speed property, video.js uses .playbackRate()
    let currentRate = 1
    if (videoPlayerRef.value.player.speed !== undefined) {
      // Plyr
      currentRate = videoPlayerRef.value.player.speed
    } else if (typeof videoPlayerRef.value.player.playbackRate === 'function') {
      // Video.js
      currentRate = videoPlayerRef.value.player.playbackRate()
    } else if (videoPlayerRef.value.player.playbackRate !== undefined) {
      // Native video element
      currentRate = videoPlayerRef.value.player.playbackRate
    }

    if (currentRate != 1) {
      return ElMessage.warning(l.playbackSpeedError)
    }
    let progress = videoPlayerRef.value.videoObj.currentTime //当前播放进度
    let max_progress = videoPlayerRef.value.videoObj.watchMaxTime //最大播放进度

    let playStatus = videoPlayerRef.value.flagObj.isPlaying //获取视频播放状态
    if (progress > 0 && max_progress >= progress) {
      $request(
        api.videoServer + '/Video/Video/uploadPlayProcess',
        [
          {
            playId: state.params.playId,
            userid: user.value.userId,
            train_id: state.params.train_primary_id,
            no_primary_train_id: state.params.no_primary_train_id,
            course_id: state.params.course_primary_id,
            no_primary_course_id: state.params.no_primary_course_id,
            video_id: state.currentVideo.id,
            progress: progress,
            max_progress: max_progress,
            is_play: playStatus,
          },
        ],
        'post'
      ).then((r) => {
        if ((r.httpCode == 200) & (r.status == true)) {
          // console.log(r);
        }
      })
    }
  }
}

const getPlayProgress = () => {
  setPlaylistHeight()
  if (videoPlayerRef.value?.player) {
    $request(
      api.videoServer + '/Video/Video/getPlayProcess',
      {
        playId: state.params.playId,
        userid: user.value.userId,
        train_id: state.params.train_primary_id,
        no_primary_train_id: state.params.no_primary_train_id,
        course_id: state.params.course_primary_id,
        no_primary_course_id: state.params.no_primary_course_id,
        video_id: state.currentVideo.id,
        progress: 0,
        max_progress: 0,
        is_play: state.isPlaying,
      },
      'post'
    ).then((r) => {
      if ((r.httpCode == 200) & (r.status == true)) {
        if (r.data.playId) {
          state.params.playId = r.data.playId
        } else {
          state.params.playId = r.data.id
        }
        let progress = parseInt(r.data.progress) //当前播放进度
        let max_progress = parseInt(r.data.max_progress) //最大播放进度
        state.progressObj.progress = progress <= max_progress ? progress : max_progress
        state.progressObj.max_progress = max_progress
      }
    })
  }
}

const reportPlayDuration = () => {
  if (videoPlayerRef.value?.player) {
    $request(
      api.videoServer + '/Video/Video/uploadPlayDuration',
      {
        userid: user.value.userId,
        train_id: state.params.train_primary_id,
        no_primary_train_id: state.params.no_primary_train_id,
        course_id: state.params.no_primary_course_id,
        video_id: state.currentVideo.id,
        course_primary_id: state.params.course_primary_id,
        play_time: state.playDuration,
        playId: state.params.playId,
        create_time: new Date().toISOString(),
      },
      'post'
    ).then((r) => {
      if ((r.httpCode == 200) & (r.status == true)) {
        // console.log(r);
      }
    })
  }
}

const onVideoProgressUpdate = (progressData) => {
  console.log('📊 Video progress updated:', progressData)
  reportPlayProgress()
  reportPlayDuration()
}

const getAttachments = (id) => {
  state.attachmentList = []
  $request(api.videoServer + '/Video/VideoCourseCatalog/GetCourseAttachemnts', {
    course_primary_id: id,
    page: 1,
    pageSize: 9999,
  })
    .then((r) => {
      if (r.httpCode == 200) {
        state.attachmentList = r.data.list
      }
    })
    .catch((e) => {
      console.log(e)
    })
}

const getFavorList = () => {
  $request(api.videoServer + '/Video/Favorite/getlist', {
    course_id: state.params.no_primary_course_id,
    page: 1,
    pageSize: 9999,
  }).then((r) => {
    state.favoriteList.total = r.data.total
  })
}

const returnPublicObjLabel = (value, key, label, filed) => {
  let item = state.publicCodeObj[filed].find((i) => {
    return i[key] == value
  })
  if (item) {
    return item[label]
  } else {
    return value
  }
}

const getLanguage_type = () => {
  $request(api.publiccode + 'getListdetailed', {
    queryString: {},
    ruleno: '121',
    pageSize: 9999,
  })
    .then((r) => {
      let list = []
      r.data.list.forEach((j) => {
        list.push({
          label: j.name_label,
          value: j.code_no,
        })
      })
      state.publicCodeObj.language_type = list
    })
    .catch((e) => {
      // this.$message.error(e.message)
    })
}

const getCourseCatalog = () => {
  $request(api.publiccode + 'getListdetailed', {
    queryString: {},
    ruleno: '122',
    pageSize: 9999,
  })
    .then((r) => {
      let list = []
      r.data.list.forEach((j) => {
        list.push({
          label: j.name_label,
          value: j.code_no,
        })
      })
      state.publicCodeObj.courseCatalog = list
    })
    .catch((e) => {
      // this.$message.error(e.message)
    })
}

const getTopicList = (id) => {
  // Assuming vuex_collegeId is from store
  $request(api.videoServer + '/Video/VideoPageTag/getlist', {
    ...state.topicObj.query,
    college_id: store.state.vuex_collegeId,
    id: id,
  })
    .then((r) => {
      if (r.status) {
        state.topicObj.list = r.data.list
        state.topicObj.total = r.data.total
        state.topicObj.index = r.data.list[0].detail.findIndex((i) => i.course_primary_id == state.params.course_id)
      }
    })
    .catch((e) => {
      console.log(e)
    })
}

const handleFavorClick = debounce(() => {
  let courseObj = {
    course_id: state.params.no_primary_course_id,
  }
  $request(api.videoServer + '/Video/Favorite/addOrRemoveFavorite', courseObj, 'post')
    .then(() => {
      getFavorList()
    })
    .catch(() => {})
}, 300)

const setPlaylistHeight = debounce(() => {
  nextTick(() => {
    if (videoPlayerRef.value && videoPlayerRef.value.$el) {
      state.playlistHeight = videoPlayerRef.value.$el.offsetHeight + 'px'
    }
  })
}, 200)

// Lifecycle
onMounted(() => {
  getLanguage_type()
  getCourseCatalog()
  if (route.query.course_primary_id) {
    Object.assign(state.params, route.query)
    getAttachments(state.params.course_primary_id)
    getCourseResource(state.params.course_primary_id)
    getCourseInfo(state.params.course_primary_id, 'myGoodBad')
    setPlaylistHeight()
    state.playingTimmerId = setInterval(() => {
      if (state.isPlaying) {
        state.playDuration += 1
        if (state.playDuration % 5 == 0 && state.playDuration > 0) {
          reportPlayProgress()
          reportPlayDuration()
          state.playDuration = 0
        }
      }
    }, 1000)
  } else {
    console.log('没有获取到course_primary_id')
  }
  if (route.query.topic_id) {
    getTopicList(route.query.topic_id)
  }
  window.addEventListener('resize', setPlaylistHeight)
})

onBeforeUnmount(() => {
  if (state.playDuration) {
    reportPlayDuration()
    reportPlayProgress()
  }
  if (state.playingTimmerId) {
    clearInterval(state.playingTimmerId)
  }
  window.removeEventListener('resize', setPlaylistHeight)
})
</script>
