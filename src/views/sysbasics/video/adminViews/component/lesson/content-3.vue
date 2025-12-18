<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-gray-50/50 backdrop-blur-3xl font-sans selection:bg-blue-100 selection:text-blue-900">
    <!-- Top Bar -->
    <div class="flex justify-between items-center px-10 py-6">
      <div class="flex items-center gap-4">
        <div class="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
          <i class="el-icon-menu text-blue-500 text-xl"></i>
        </div>
        <h1 class="text-2xl font-bold text-gray-800 tracking-tight">Gallery</h1>
      </div>

      <div class="flex gap-4">
        <div class="relative group">
          <input v-model="videoListObj.query.title" type="text" placeholder="Search" class="pl-10 pr-4 py-2.5 rounded-full bg-white border border-gray-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-50 transition-all outline-none w-64 group-hover:w-80 shadow-sm" @change="getVideoList" @keydown.enter="getVideoList">
          <i class="el-icon-search absolute left-3.5 top-3 text-gray-400 group-hover:text-blue-500 transition-colors"></i>
        </div>

        <button class="bg-gray-900 text-white px-6 py-2.5 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-gray-200 flex items-center gap-2" @click="uploadNewVideo">
          <i class="el-icon-upload2"></i>
          <span>Upload</span>
        </button>
      </div>
    </div>

    <!-- Filters -->
    <div class="px-10 pb-6 flex gap-3 overflow-x-auto no-scrollbar">
       <button
         class="px-5 py-2 rounded-full text-sm font-medium transition-all border"
         :class="videoListObj.query.status === '' ? 'bg-black text-white border-black shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'"
         @click="videoListObj.query.status = ''; getVideoList()"
       >All</button>
       <button
         class="px-5 py-2 rounded-full text-sm font-medium transition-all border"
         :class="videoListObj.query.status === 'pengding' ? 'bg-amber-500 text-white border-amber-500 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'"
         @click="videoListObj.query.status = 'pengding'; getVideoList()"
       >Processing Queue</button>
       <button
         class="px-5 py-2 rounded-full text-sm font-medium transition-all border"
         :class="videoListObj.query.status === 'Completed' ? 'bg-green-500 text-white border-green-500 shadow-md' : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'"
         @click="videoListObj.query.status = 'Completed'; getVideoList()"
       >Ready</button>

       <div class="w-px bg-gray-300 mx-2 h-8 self-center"></div>

       <a-select v-model:value="videoListObj.query.college_id" placeholder="Filter by College" class="w-48 !bg-transparent" :bordered="false">
          <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</a-select-option>
       </a-select>
    </div>

    <!-- Content Grid -->
    <div class="flex-1 overflow-y-auto px-10 pb-10">

      <div v-if="videoListObj.list.length === 0" class="flex flex-col items-center justify-center h-full opacity-50">
        <i class="el-icon-picture-outline text-6xl mb-4 text-gray-300"></i>
        <p class="text-xl font-light text-gray-400">Nothing here yet</p>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div v-for="i in videoListObj.list" :key="i.id" class="group relative rounded-3xl bg-white p-3 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_50px_-15px_rgba(0,0,0,0.1)] transition-all duration-300 hover:-translate-y-2 border border-gray-100">

          <!-- Image/Thumbnail Container -->
          <div class="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 cursor-pointer" @click="coverPreview(api.videoServer + '/' + i.thumbnail_path)">
            <img :src="api.videoServer + '/' + i.thumbnail_path" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />

            <!-- Pending Blur Overlay -->
            <div v-if="i.status === 'Pending' || i.status === 'pengding'" class="absolute inset-0 bg-white/30 backdrop-blur-md flex flex-col items-center justify-center z-10 border-4 border-white/50 m-2 rounded-xl">
               <div class="animate-spin text-amber-500 mb-2 text-2xl">
                 <i class="el-icon-loading"></i>
               </div>
               <span class="text-sm font-semibold text-gray-700 tracking-wide bg-white/80 px-3 py-1 rounded-full shadow-sm">Waiting...</span>
            </div>

            <!-- Processing Overlay -->
            <div v-if="videoProcess && videoProcess.videoId == i.id && !videoProcess.isFinished" class="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center z-20 transition-all">
                <div class="relative w-20 h-20">
                   <svg class="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path class="text-gray-400/30" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="2" />
                      <path class="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-300 ease-linear" :stroke-dasharray="((videoProcess.currentTime / i.duration) * 100).toFixed(0) + ', 100'" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
                   </svg>
                   <div class="absolute inset-0 flex items-center justify-center text-white font-bold text-sm">
                      {{ ((videoProcess.currentTime / i.duration) * 100).toFixed(0) }}%
                   </div>
                </div>
                <p class="text-white text-xs mt-2 font-medium tracking-wide">Optimizing...</p>
            </div>

            <!-- Hover Controls -->
            <div class="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0 duration-300">
               <button class="w-8 h-8 rounded-full bg-white/90 backdrop-blur text-gray-700 hover:text-blue-600 shadow-sm flex items-center justify-center" @click.stop="beforeModifyVideo(i)">
                 <i class="el-icon-setting"></i>
               </button>
               <button class="w-8 h-8 rounded-full bg-white/90 backdrop-blur text-gray-700 hover:text-red-500 shadow-sm flex items-center justify-center" @click.stop="deleteVideo(i)">
                 <i class="el-icon-delete"></i>
               </button>
            </div>

            <!-- Play Button Big -->
            <div class="absolute inset-0 flex items-center justify-center pointer-events-none" v-if="!((i.status === 'Pending' || i.status === 'pengding') || (videoProcess && videoProcess.videoId == i.id && !videoProcess.isFinished))">
               <div class="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-300 cursor-pointer pointer-events-auto shadow-xl border border-white/30" @click.stop="previewVideo(i)">
                  <i class="el-icon-caret-right text-4xl ml-1"></i>
               </div>
            </div>

            <span class="absolute bottom-3 right-3 bg-black/60 backdrop-blur text-white text-[10px] font-bold px-2 py-1 rounded-lg">
               {{ formatDuration(i.duration) }}
            </span>
          </div>

          <!-- Info -->
          <div class="mt-4 px-2">
             <div class="flex justify-between items-start mb-1">
                <h3 class="font-bold text-gray-800 text-lg leading-tight line-clamp-1">{{ i.title }}</h3>
             </div>
             <p class="text-sm text-gray-500 line-clamp-2 min-h-[2.5em] leading-relaxed mb-4">{{ i.description || 'No description provided.' }}</p>

             <div class="flex items-center justify-between pt-2 border-t border-gray-100">
                <div class="flex items-center gap-2">
                   <div class="w-6 h-6 rounded-full bg-gradient-to-tr from-blue-400 to-purple-400 flex items-center justify-center text-white text-[10px] font-bold">
                     {{ i.create_user.charAt(0).toUpperCase() }}
                   </div>
                   <span class="text-xs text-gray-400">{{ i.create_user }}</span>
                </div>
                <div class="flex items-center gap-2">
                   <span v-if="i.is_public == 1" class="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.6)]"></span>
                   <span v-else class="w-2 h-2 rounded-full bg-amber-400"></span>
                </div>
             </div>
          </div>

        </div>
      </div>

      <div class="mt-10 flex justify-center">
         <a-pagination v-model:current="videoListObj.query.page" v-model:page-size="videoListObj.query.pageSize" :total="videoListObj.total" :page-size-options="['8', '12', '24']" @change="handlePageChange"></a-pagination>
      </div>
    </div>

    <!-- Simplified Drawers/Modals -->
    <div class="components">
      <input ref="videoInput" type="file" @change="videoChange" style="display: none" accept="video/*" />
      <input ref="coverInput" type="file" @change="uploadCoverChange" style="display: none" accept="image/*" />

      <a-modal v-model:open="showObj.coverDialog" :footer="null" :width="600" :closable="false" wrapClassName="glass-modal">
        <div class="p-2 bg-white rounded-xl">
           <img width="100%" :src="coverObj.dialogImageUrl" class="rounded-lg" />
        </div>
      </a-modal>

      <a-modal v-model:open="showObj.previewVideo" :footer="null" :width="800" @cancel="videoClose" :closable="false" wrapClassName="glass-modal">
        <div class="bg-black rounded-xl overflow-hidden shadow-2xl">
          <div style="width: 100%; aspect-ratio: 1.8">
            <videoPlayer ref="videoPlayerRef" :src="showObj.videoUrl"></videoPlayer>
          </div>
        </div>
      </a-modal>

      <a-drawer :visible="showObj.uploadVideo" title="New Upload" :width="500" @close="closeUploadDrawer">
         <div class="p-6 h-full flex flex-col bg-white">
            <div class="flex-1 space-y-8">
               <!-- Drag Drop Area -->
               <div v-if="!flagObj.selectVideo" class="border-2 border-dashed border-gray-200 rounded-3xl h-56 flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all" @click="videoSelect">
                  <div class="p-4 bg-blue-50 rounded-full text-blue-500 mb-3">
                     <i class="el-icon-upload text-2xl"></i>
                  </div>
                  <span class="font-bold text-gray-700">Select Video</span>
                  <span class="text-xs text-gray-400 mt-1">or drag and drop here</span>
               </div>

               <div v-else class="bg-blue-50/50 rounded-3xl p-6 border border-blue-100">
                  <div class="flex items-center gap-4 mb-4">
                     <div class="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-blue-500">
                        <i class="el-icon-video-play text-xl"></i>
                     </div>
                     <div class="flex-1 overflow-hidden">
                        <h4 class="font-bold text-gray-800 truncate">{{ uploadVideoObj.file.name }}</h4>
                        <p class="text-xs text-gray-500">{{ uploadVideoObj.size }}</p>
                     </div>
                     <button @click="videoRemove(true)" class="w-8 h-8 rounded-full bg-white text-gray-400 hover:text-red-500 shadow-sm flex items-center justify-center"><i class="el-icon-close"></i></button>
                  </div>
                  <div class="bg-white rounded-full h-2 w-full overflow-hidden">
                     <div class="bg-blue-500 h-full rounded-full transition-all duration-300" :style="{ width: uploadVideoObj.uploadPercent + '%' }"></div>
                  </div>
                  <div class="flex justify-between mt-2 text-xs font-medium text-gray-500">
                     <span>{{ uploadVideoObj.uploadPercent }}%</span>
                     <span>{{ uploadVideoObj.uploadEvent.speed }}</span>
                  </div>
               </div>

               <!-- Form -->
               <div class="space-y-5">
                  <div class="group relative">
                     <input v-model="uploadVideoObj.name" type="text" placeholder=" " class="peer w-full border-b-2 border-gray-200 bg-transparent py-2.5 outline-none focus:border-blue-500 transition-colors pt-6" />
                     <label class="absolute left-0 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500">Video Title</label>
                  </div>

                  <div class="grid grid-cols-2 gap-6">
                      <div class="space-y-2">
                         <label class="text-xs font-bold text-gray-400 uppercase">College</label>
                         <a-select v-model:value="uploadVideoObj.college_id" class="w-full">
                           <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</a-select-option>
                         </a-select>
                      </div>
                      <div class="space-y-2">
                         <label class="text-xs font-bold text-gray-400 uppercase">Access</label>
                         <div class="flex items-center gap-3 mt-1">
                            <a-switch :checked="uploadVideoObj.is_public === 1" @change="(val) => uploadVideoObj.is_public = val ? 1 : 0"></a-switch>
                            <span class="text-sm font-medium text-gray-600">{{ uploadVideoObj.is_public ? 'Public' : 'Private' }}</span>
                         </div>
                      </div>
                  </div>

                  <div class="space-y-2">
                      <label class="text-xs font-bold text-gray-400 uppercase">Cover</label>
                      <div class="flex gap-4">
                         <div class="w-24 h-16 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity" @click="coverSelect">
                            <img v-if="coverObj.imageUrl" :src="coverObj.imageUrl" class="w-full h-full object-cover" />
                            <div v-else class="w-full h-full flex items-center justify-center text-gray-400"><i class="el-icon-plus"></i></div>
                         </div>
                         <button class="text-xs font-bold text-blue-500 bg-blue-50 px-4 rounded-lg hover:bg-blue-100 transition-colors h-16" @click="drawCoverByFile(uploadVideoObj.file, Math.random() * uploadVideoObj.duration)">Generate<br>Snapshot</button>
                      </div>
                  </div>

                  <div class="group relative">
                     <textarea v-model="uploadVideoObj.description" placeholder=" " rows="3" class="peer w-full border-b-2 border-gray-200 bg-transparent py-2.5 outline-none focus:border-blue-500 transition-colors pt-6 resize-none"></textarea>
                     <label class="absolute left-0 top-2 text-xs text-gray-400 transition-all peer-placeholder-shown:top-6 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-500">Description</label>
                  </div>
               </div>
            </div>

            <div class="pt-6">
               <button class="w-full bg-black text-white py-4 rounded-2xl font-bold shadow-lg shadow-gray-300 hover:shadow-xl hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed" @click="handleSubmit('uploadVideo')" :disabled="!flagObj.uploadAble || flagObj.uploading">
                  {{ flagObj.uploading ? 'Uploading...' : 'Publish Video' }}
               </button>
            </div>
         </div>
      </a-drawer>

      <!-- Modify Drawer (Minimal) -->
      <a-drawer :visible="showObj.modifyVideo" title="Edit Video" :width="500" @close="showObj.modifyVideo = false">
         <div class="p-6 space-y-6">
             <div class="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                <img :src="api.videoServer + '/' + modifyVideoObj.form.oldthumbnail_path" class="w-20 h-20 object-cover rounded-xl" />
                <div class="flex-1">
                   <h3 class="font-bold text-gray-800">Current Cover</h3>
                   <button class="text-xs text-blue-500 font-bold mt-1" @click="coverSelect">Change Image</button>
                </div>
                <div class="w-20 h-20 bg-white border border-dashed border-gray-300 rounded-xl overflow-hidden" v-if="coverObj.imageUrl">
                   <img :src="coverObj.imageUrl" class="w-full h-full object-cover" />
                </div>
             </div>

             <a-input v-model:value="modifyVideoObj.form.title" size="large" placeholder="Title"></a-input>
             <a-select v-model:value="modifyVideoObj.form.college_id" size="large" class="w-full">
                 <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</a-select-option>
             </a-select>
             <a-textarea v-model:value="modifyVideoObj.form.description" :rows="4" placeholder="Description"></a-textarea>

             <button class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold mt-4" @click="handleSubmit('modifyVideo')">Save Updates</button>
         </div>
      </a-drawer>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch, onMounted, onBeforeUnmount, ref, getCurrentInstance } from 'vue'
import * as signalR from '@microsoft/signalr'
import { message } from 'ant-design-vue'
import { useLocalI18n } from '@/composables/useLocalI18n'
import api from '@/api'
import store from '@/store'
import videoPlayer from '@/components/videoPlayer/VideoPlayerPlyr.vue'

// Global instance access
const instance = getCurrentInstance()
const route = instance.proxy.$route
const router = instance.proxy.$router
const { $request } = instance.proxy

// Internationalization
const { l, c } = useLocalI18n('videoAdminContent')

// Refs
const videoInput = ref()
const coverInput = ref()
const videoPlayerRef = ref()

// Computed
const isAdmin = computed(() => store.getters.isAdmin)

// Reactive data
const coverObj = reactive({
  dialogImageUrl: '',
  imageUrl: '',
  file: {
    name: '',
  },
})

const uploadVideoObj = reactive({
  id: '',
  name: '',
  duration: '',
  type: '',
  college_id: '',
  is_public: 0,
  size: 0,
  uploadSize: '0 B',
  uploadPercent: 0,
  uploadEvent: {
    uploadSize: 0,
    speed: '0 B/s',
    oTime: 0,
    restTime: l.value.notStart || 'Not started',
  },
  thumbnail: '',
  thumbnail_path: '',
  description: '',
  file: {
    name: '',
  },
})

const modifyVideoObj = reactive({
  form: {
    id: '',
    title: '',
    type: '',
    college_id: '',
    is_public: '',
    oldthumbnail_path: '',
    thumbnail_path: '',
    description: '',
  },
})

const videoListObj = reactive({
  query: {
    college_id: '',
    title: '',
    type: '',
    status: '',
    is_public: '',
    page: 1,
    pageSize: 15,
  },
  total: 0,
  list: [],
})

const flagObj = reactive({
  selectVideo: false,
  uploadAble: false,
  uploading: false,
})

const showObj = reactive({
  videoUrl: '',
  uploadVideo: false,
  modifyVideo: false,
  coverDialog: false,
  previewVideo: false,
})

const publicCodeObj = reactive({
  collegeList: [],
})

let axiosController = null

// SignalR / progress state (use refs for script-setup)
const connection = ref(null)
const videoId = ref('')
const currentTimeMs = ref(0)
const isFinished = ref(false)
const statusMessage = ref('')
const statusType = ref('')

// Watchers
watch(
  () => videoListObj.query.college_id,
  (newVal, oldVal) => {
    if (newVal && oldVal === '') {
      videoListObj.query.is_public = ''
    }
    if (!isAdmin.value) {
      if (newVal == '') {
        videoListObj.query.is_public = 1
      }
    }
    getVideoList()
  }
)

// Methods
const returnCollegeName = (id) => {
  let college = publicCodeObj.collegeList.find((i) => i.id == id)
  if (college) {
    return college.name_label
  } else {
    return id
  }
}

const uploadNewVideo = () => {
  uploadVideoObj.id = ''
  uploadVideoObj.name = ''
  uploadVideoObj.duration = ''
  uploadVideoObj.type = ''
  uploadVideoObj.college_id = isAdmin.value ? '' : publicCodeObj.collegeList[0].id
  uploadVideoObj.is_public = 0
  uploadVideoObj.size = 0
  uploadVideoObj.uploadSize = '0 B'
  uploadVideoObj.uploadPercent = 0
  uploadVideoObj.uploadEvent = {
    uploadSize: 0,
    speed: '0 B/s',
    oTime: 0,
    restTime: l.value.notStart,
  }
  uploadVideoObj.thumbnail = ''
  uploadVideoObj.thumbnail_path = ''
  uploadVideoObj.description = ''
  uploadVideoObj.file = { name: '' }
  showObj.uploadVideo = true
}

const handleSizeChange = (pageSize) => {
  videoListObj.query.pageSize = pageSize
  getVideoList()
}

const handlePageChange = (page) => {
  videoListObj.query.page = page
  getVideoList()
}

const previewVideo = (i) => {
  if (i.url) {
    showObj.videoUrl = api.videoServer + i.url
  }
  showObj.previewVideo = true
}

const videoClose = () => {
  if (videoPlayerRef.value) {
    videoPlayerRef.value.onPause()
  }
  showObj.previewVideo = false
}

const handleSubmit = (type) => {
  if (type == 'uploadVideo') {
    if (!uploadVideoObj.file) {
      return message.error(l.value.plsSelectVideo)
    }
    if (!uploadVideoObj.name) {
      return message.error(l.value.plsInputTitle)
    }
    if (!uploadVideoObj.type) {
      uploadVideoObj.type = 'Video'
    }
    if (!uploadVideoObj.description) {
      return message.error(l.value.plsInputDesc)
    }
    if (!uploadVideoObj.college_id) {
      return message.error(l.value.plsSelectCollege)
    }
    uploadCover(type)
  } else if (type == 'modifyVideo') {
    if (!modifyVideoObj.form.title) {
      return message.error(l.value.plsInputTitle)
    }
    if (!modifyVideoObj.form.type) {
      return message.error(l.value.plsSelectType)
    }
    if (!modifyVideoObj.form.description) {
      return message.error(l.value.plsSelectCollege)
    }
    if (!coverObj.file.name) {
      modifyVideo()
    } else {
      uploadCover(type)
    }
  }
}

const getCollegeList = () => {
  $request(api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
    resource_path: route.path,
  })
    .then((r) => {
      publicCodeObj.collegeList = r.data
      videoListObj.query.college_id = r.data[0].id
    })
    .catch((e) => {
      message.error(e.message)
    })
}

// Cover methods
const coverSelect = () => {
  coverInput.value.click()
}

const coverPreview = (url) => {
  if (!url) return
  coverObj.dialogImageUrl = url
  showObj.coverDialog = true
}

const uploadCoverChange = (e) => {
  let file = e.target.files[0]
  if (!file) return
  let reader = new FileReader()
  reader.onload = (r) => {
    coverObj.imageUrl = r.target.result
  }
  reader.readAsDataURL(file)
  coverObj.file = file
}

const uploadCover = (next) => {
  let formData = new FormData()
  formData.append('formFile', coverObj.file)
  $request(api.videoServer + '/Video/VideoManage/uploadPicture', formData, 'post')
    .then((r) => {
      if (r.httpCode == 200 && r.data.url) {
        if (next == 'uploadVideo') {
          uploadVideoObj.thumbnail_path = r.data.url
          uploadVideo()
        } else if (next == 'modifyVideo') {
          modifyVideoObj.form.thumbnail_path = r.data.url
          modifyVideo()
        }
      }
    })
    .catch((e) => {
      console.error(e)
    })
}

// Video upload methods
const videoSelect = () => {
  videoInput.value.click()
}

const videoChange = (e) => {
  videoRemove()
  let file = e.target.files[0]
  uploadVideoObj.file = file

  if (file.type.split('/')[0] !== 'video') {
    videoRemove(true)
    return message.error(l.value.plsSelectVideo)
  } else {
    flagObj.selectVideo = true
    flagObj.uploadAble = true
    flagObj.uploading = false
  }

  uploadVideoObj.name = file.name.split('.')[0]
  uploadVideoObj.size = formatFileSize(file.size)
  drawCoverByFile(file)
}

const drawCoverByFile = (videoFile, time = 0) => {
  if (videoFile) {
    let video = document.createElement('video')
    video.currentTime = time
    video.preload = 'auto'
    video.muted = true
    video.autoplay = true
    video.src = URL.createObjectURL(videoFile)
    video.oncanplay = function () {
      uploadVideoObj.duration = video.duration
      let canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      let ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
      let imgDataUrl = canvas.toDataURL('image/png')
      coverObj.imageUrl = imgDataUrl
      fetch(imgDataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          let coverFile = new File([blob], uploadVideoObj.name + '.png', {
            type: 'image/png',
          })
          coverObj.file = coverFile
        })
    }
  }
}

const rightCheck = (i, toast = false) => {
  if (isAdmin.value) {
    return true
  } else {
    if (publicCodeObj.collegeList.some((c) => c.id == i.college_id)) {
      return true
    } else {
      if (toast) {
        message.error(l.value.noRightToEdit)
      }
      return false
    }
  }
}

const beforeModifyVideo = (i) => {
  if (rightCheck(i, true)) {
    modifyVideoObj.form = {
      id: i.id,
      title: i.title,
      type: i.type,
      college_id: i.college_id,
      is_public: i.is_public,
      oldthumbnail_path: i.thumbnail_path,
      thumbnail_path: '',
      description: i.description,
    }
    coverObj.imageUrl = ''
    coverObj.file = { name: '' }
    showObj.modifyVideo = true
  }
}

const modifyVideo = () => {
  if (!modifyVideoObj.form.thumbnail_path) {
    modifyVideoObj.form.thumbnail_path = modifyVideoObj.form.oldthumbnail_path
  }
  $request(api.videoServer + '/Video/VideoManage/modifyVideoInfo', modifyVideoObj.form, 'post')
    .then((r) => {
      if (r.httpCode == 200) {
        message.success(l.value.updateSuccess)
        let timer = setTimeout(() => {
          showObj.modifyVideo = false
          // Clear cover preview/file after successful modify
          try {
            if (coverInput && coverInput.value) coverInput.value.value = ''
          } catch (e) {}
          coverObj.imageUrl = ''
          coverObj.file = { name: '' }
          getVideoList()
          clearTimeout(timer)
        }, 1500)
      }
    })
    .catch((e) => {
      message.error(e.message)
      console.log(e)
    })
}

const deleteVideo = (i) => {
  if (rightCheck(i, true)) {
    const confirmed = window.confirm(`《${i.title}》${l.value.deleteVideoConfirm}`)
    if (confirmed) {
      $request(api.videoServer + '/Video/VideoManage/deleteVideo', { id: i.id }, 'post')
        .then((r) => {
          message.success(l.value.deleteSuccess)
          getVideoList()
        })
        .catch((e) => {
          message.error(e.message)
        })
    }
  }
}

const uploadVideo = () => {
  axiosController = new AbortController()
  let formData = new FormData()
  formData.append('file', uploadVideoObj.file)
  let fields = ['id', 'college_id', 'is_public', 'name', 'type', 'thumbnail_path', 'description']
  fields.forEach((i) => {
    formData.append(i, uploadVideoObj[i])
  })
  let customConfig = {
    onUploadProgress: function (progressEvent) {
      if (!progressEvent.total) {
        uploadVideoObj.uploadPercent = 0
        return
      }
      let currentTime = new Date().getTime()
      let uploadTime = (currentTime - uploadVideoObj.uploadEvent.oTime) / 1000

      if (uploadTime > 0) {
        let uploadPart = progressEvent.loaded - uploadVideoObj.uploadEvent.uploadSize
        // Avoid negative uploadPart which might happen due to timing issues or retries
        if (uploadPart < 0) uploadPart = 0

        let speed = uploadPart / uploadTime
        if (speed > 0) {
          let restTime = (progressEvent.total - progressEvent.loaded) / speed
          uploadVideoObj.uploadEvent.speed = formatFileSize(speed) + '/s'
          uploadVideoObj.uploadEvent.restTime = formatSeconds(restTime, true)
        }
      }

      uploadVideoObj.uploadEvent.uploadSize = progressEvent.loaded
      uploadVideoObj.uploadEvent.oTime = currentTime
      uploadVideoObj.uploadPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      uploadVideoObj.uploadSize = formatFileSize(progressEvent.loaded)
    },
  }

  flagObj.uploading = true
  uploadVideoObj.uploadEvent.oTime = new Date().getTime()
  $request(api.videoServer + '/Video/VideoManage/uploadVideoStreaming', formData, 'post', 'noErrorDialog', customConfig, axiosController)
    .then((r) => {
      if (r.httpCode == 200) {
        message.success(l.value.uploadSuccess)
        let timer = setTimeout(() => {
          flagObj.uploadAble = false
          getVideoList()
          showObj.uploadVideo = false
          clearTimeout(timer)
          videoRemove(true)
        }, 1500)
      }
    })
    .catch((e) => {
      flagObj.uploading = false
      return message.error(e.message)
    })
}

const videoRemove = (flag) => {
  if (flag) {
    videoInput.value.value = ''
  }
  // Reset cover input and preview when removing selected video
  try {
    if (coverInput && coverInput.value) {
      coverInput.value.value = ''
    }
  } catch (e) {}
  coverObj.imageUrl = ''
  coverObj.file = { name: '' }
  flagObj.selectVideo = false
  flagObj.uploadAble = false
  uploadVideoObj.id = ''
  uploadVideoObj.name = ''
  uploadVideoObj.duration = ''
  uploadVideoObj.type = ''
  uploadVideoObj.college_id = isAdmin.value ? '' : publicCodeObj.collegeList[0].id
  uploadVideoObj.is_public = 0
  uploadVideoObj.size = 0
  uploadVideoObj.uploadSize = '0 B'
  uploadVideoObj.uploadPercent = 0
  uploadVideoObj.uploadEvent = {
    uploadSize: 0,
    speed: '0 B/s',
    oTime: 0,
    restTime: 'Not started',
  }
  uploadVideoObj.thumbnail = ''
  uploadVideoObj.thumbnail_path = ''
  uploadVideoObj.description = ''
  uploadVideoObj.file = { name: '' }
}

const abortUploadVideo = () => {
  flagObj.uploading = false
  if (axiosController) {
    axiosController.abort()
  }
}

const closeUploadDrawer = () => {
  // If an upload is in progress, abort it first
  if (flagObj.uploading) {
    abortUploadVideo()
  }
  showObj.uploadVideo = false
  // Clear selected video and cover preview to reset the form
  videoRemove(true)
}

// Video list methods
const getVideoList = () => {
  $request(api.videoServer + '/Video/VideoManage/getVideoList', videoListObj.query)
    .then((r) => {
      if (r.httpCode == 200) {
        videoListObj.list = r.data.list
        videoListObj.total = r.data.total
        if (r.data.total == 0) {
          videoListObj.list = []
        }
      }
    })
    .catch((e) => {
      console.log(e)
    })
}

// Utility functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  let k = 1024
  let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatSeconds = (seconds, chinese) => {
  let hours = Math.floor(seconds / 3600)
  let minutes = Math.floor((seconds % 3600) / 60)
  let remainingSeconds = parseInt(seconds % 60)
  let fractionalHours
  if (chinese) {
    if (hours > 0) {
      fractionalHours = hours + minutes / 60
      return `${fractionalHours.toFixed(1)}${l.value.hours}`
    } else if (minutes > 0) {
      return `${minutes}${l.value.mins}`
    } else {
      return `${remainingSeconds}${l.value.seconds}`
    }
  } else {
    if (hours > 0) {
      fractionalHours = hours + minutes / 60
      return `${fractionalHours.toFixed(1)} hours`
    } else if (minutes > 0) {
      return `${minutes} minutes`
    } else {
      return `${remainingSeconds} seconds`
    }
  }
}

const formatDuration = (totalSeconds, unit) => {
  let duration = Math.floor(totalSeconds)
  let hours = Math.floor(duration / 3600)
  let minutes = Math.floor((duration % 3600) / 60)
  let seconds = duration % 60

  if (unit) {
    return [hours > 0 ? `${hours}${l.value.hours}` : '', minutes.toString().padStart(2, '0') + `${l.value.mins}`, seconds.toString().padStart(2, '0') + `${l.value.seconds}`].filter(Boolean).join('')
  } else {
    return [hours > 0 ? `${hours}:` : '', minutes.toString().padStart(2, '0') + ':', seconds.toString().padStart(2, '0')].filter(Boolean).join('')
  }
}

const initializeSignalR = () => {
  // Tạo connection đến SignalR Hub
  connection.value = new signalR.HubConnectionBuilder()
    .withUrl(api.baseUrl + '/hubs/videoProg') // Thay đổi URL của bạn
    .withAutomaticReconnect()
    .build()

  // Nhận sự kiện progress từ server
  connection.value.on('ReceiveVideoProgress', (data) => {
    // console.log('Progress update:', data)
    currentTimeMs.value = data.timeMs
    videoId.value = data.videoId
    isFinished.value = false
  })

  // Nhận sự kiện FFmpeg hoàn tất
  connection.value.on('FFmpegFinished', (data) => {
    // console.log('FFmpeg finished:', data)
    isFinished.value = true
    statusMessage.value = 'Video converted successfully!'
    statusType.value = 'success'
    getVideoList();
  })

  // Nhận sự kiện lỗi
  connection.value.on('FFmpegError', (data) => {
    console.error('FFmpeg error:', data)
    isFinished.value = false
    statusMessage.value = `Error: ${data.message}`
    statusType.value = 'error'
  })

  // Kết nối đến server
  connection.value.start().catch((err) => {
    console.error('SignalR connection error:', err)
    statusMessage.value = 'Connection error'
    statusType.value = 'error'
  })
}

const videoProcess = computed(() => {
  if (!videoListObj.list.find((v) => v.id === videoId.value)) {
    return null
  }

  return {
    videoId: videoId.value,
    currentTime: currentTimeMs.value / (1000 * 1000),
    isFinished: isFinished.value,
    statusType: statusType.value,
  }
})

// Lifecycle
onMounted(() => {
  getCollegeList()
  initializeSignalR()
})

onBeforeUnmount(() => {
  if (videoPlayerRef.value) {
    videoPlayerRef.value.onDestroy()
  }
  // Stop SignalR connection when component unmounts
  if (connection && connection.value) {
    connection.value.stop().catch(() => {})
  }
})
</script>

<style scoped>
/* Custom Scrollbar for horizontal filter */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
