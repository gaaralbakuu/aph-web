<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-slate-50 font-sans">
    <!-- Top Navigation -->
    <div class="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-30 border-b border-slate-200/60 shadow-sm">
      <div class="flex items-center gap-4">
        <h1 class="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Library</h1>
        <div class="h-6 w-px bg-slate-200 mx-2"></div>
        <div class="flex gap-1 bg-slate-100 p-1 rounded-lg">
           <button class="px-3 py-1 text-xs font-medium rounded-md transition-all shadow-sm" :class="videoListObj.query.status === '' ? 'bg-white text-slate-800' : 'text-slate-500 hover:text-slate-700'" @click="videoListObj.query.status = ''; getVideoList()">All</button>
           <button class="px-3 py-1 text-xs font-medium rounded-md transition-all shadow-sm" :class="videoListObj.query.status === 'pengding' ? 'bg-white text-amber-600' : 'text-slate-500 hover:text-slate-700'" @click="videoListObj.query.status = 'pengding'; getVideoList()">Queued</button>
           <button class="px-3 py-1 text-xs font-medium rounded-md transition-all shadow-sm" :class="videoListObj.query.status === 'Completed' ? 'bg-white text-green-600' : 'text-slate-500 hover:text-slate-700'" @click="videoListObj.query.status = 'Completed'; getVideoList()">Ready</button>
        </div>
      </div>

      <div class="flex items-center gap-3">
         <div class="relative">
            <input type="text" v-model="videoListObj.query.title" placeholder="Search..." class="pl-9 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-48 focus:w-64 transition-all outline-none focus:ring-2 focus:ring-blue-100 placeholder-slate-400" @change="getVideoList" @keydown.enter="getVideoList">
            <i class="el-icon-search absolute left-3 top-2.5 text-slate-400"></i>
         </div>
         <button class="bg-blue-600 hover:bg-blue-700 text-white w-10 h-10 rounded-full shadow-lg shadow-blue-200 flex items-center justify-center transition-transform hover:scale-105" @click="uploadNewVideo">
            <i class="el-icon-plus font-bold text-lg"></i>
         </button>
      </div>
    </div>

    <!-- Content Area -->
    <div class="flex-1 overflow-y-auto p-6">

       <div v-if="videoListObj.list.length === 0" class="h-full flex flex-col items-center justify-center text-slate-300">
          <i class="el-icon-folder-opened text-6xl mb-4"></i>
          <p class="text-lg font-medium text-slate-400">Your library is empty</p>
       </div>

       <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          <div v-for="i in videoListObj.list" :key="i.id" class="group relative bg-white rounded-2xl p-3 shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

             <!-- Card Image -->
             <div class="relative aspect-[16/10] rounded-xl overflow-hidden bg-slate-200 mb-3 cursor-pointer" @click="coverPreview(api.videoServer + '/' + i.thumbnail_path)">
                <img :src="api.videoServer + '/' + i.thumbnail_path" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />

                <!-- Status: Pending Overlay -->
                <div v-if="i.status === 'Pending' || i.status === 'pengding'" class="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-slate-600">
                   <div class="relative">
                      <div class="w-10 h-10 border-4 border-slate-200 rounded-full"></div>
                      <div class="w-10 h-10 border-4 border-t-amber-500 rounded-full absolute top-0 left-0 animate-spin"></div>
                   </div>
                   <span class="text-xs font-bold uppercase tracking-wider mt-2 text-amber-600">In Queue</span>
                </div>

                <!-- Status: Processing Overlay -->
                <div v-if="videoProcess && videoProcess.videoId == i.id && !videoProcess.isFinished" class="absolute inset-0 bg-slate-900/80 z-20 flex flex-col items-center justify-center text-white">
                   <div class="text-2xl font-black mb-1">{{ ((videoProcess.currentTime / i.duration) * 100).toFixed(0) }}<span class="text-sm font-normal">%</span></div>
                   <div class="w-16 h-1 bg-white/20 rounded-full overflow-hidden">
                      <div class="h-full bg-blue-500" :style="{ width: ((videoProcess.currentTime / i.duration) * 100) + '%' }"></div>
                   </div>
                   <span class="text-[10px] uppercase tracking-widest mt-2 opacity-70 animate-pulse">Processing</span>
                </div>

                <!-- Hover Overlay Actions -->
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3" @click.stop="previewVideo(i)">
                   <div class="flex justify-between items-end transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                      <div class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-blue-600 cursor-pointer shadow-lg" @click.stop="previewVideo(i)">
                         <i class="el-icon-caret-right text-2xl ml-0.5"></i>
                      </div>

                      <div class="flex gap-2">
                         <button class="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-slate-800 transition-colors" @click.stop="beforeModifyVideo(i)">
                            <i class="el-icon-setting text-sm"></i>
                         </button>
                         <button class="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-red-500 hover:text-white transition-colors" @click.stop="deleteVideo(i)">
                            <i class="el-icon-delete text-sm"></i>
                         </button>
                      </div>
                   </div>
                </div>

                <div class="absolute top-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium px-2 py-0.5 rounded-md pointer-events-none">
                   {{ formatDuration(i.duration) }}
                </div>
             </div>

             <!-- Card Info -->
             <div>
                <h3 class="font-bold text-slate-800 text-sm leading-snug line-clamp-1 mb-1 group-hover:text-blue-600 transition-colors cursor-pointer" :title="i.title">{{ i.title }}</h3>
                <div class="flex items-center justify-between text-xs text-slate-400">
                   <span>{{ i.create_time ? i.create_time.split(' ')[0] : '' }}</span>
                   <div class="flex items-center gap-1.5">
                      <span class="w-1.5 h-1.5 rounded-full" :class="i.is_public ? 'bg-green-400' : 'bg-amber-400'"></span>
                      <span>{{ i.is_public ? 'Public' : 'Private' }}</span>
                   </div>
                </div>
             </div>

          </div>
       </div>

       <div class="mt-8 flex justify-center">
          <a-pagination v-model:current="videoListObj.query.page" v-model:page-size="videoListObj.query.pageSize" :total="videoListObj.total" show-less-items @change="handlePageChange"></a-pagination>
       </div>
    </div>

    <!-- Minimal Modals -->
    <div class="components">
      <input ref="videoInput" type="file" @change="videoChange" style="display: none" accept="video/*" />
      <input ref="coverInput" type="file" @change="uploadCoverChange" style="display: none" accept="image/*" />

      <a-modal v-model:open="showObj.coverDialog" :footer="null" :width="500" :closable="false" wrapClassName="clean-modal">
        <div class="rounded-xl overflow-hidden bg-white p-2 shadow-2xl">
           <img width="100%" :src="coverObj.dialogImageUrl" class="rounded-lg" />
        </div>
      </a-modal>

      <a-modal v-model:open="showObj.previewVideo" :footer="null" :width="800" @cancel="videoClose" :closable="false" wrapClassName="clean-modal">
         <div class="rounded-xl overflow-hidden shadow-2xl bg-black">
             <div style="width: 100%; aspect-ratio: 1.8">
               <videoPlayer ref="videoPlayerRef" :src="showObj.videoUrl"></videoPlayer>
             </div>
         </div>
      </a-modal>

      <a-drawer :visible="showObj.uploadVideo" :title="null" :width="450" @close="closeUploadDrawer" :closable="false">
         <div class="h-full flex flex-col bg-slate-50">
             <div class="px-6 py-5 bg-white border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
                <h2 class="text-lg font-bold text-slate-800">Upload Video</h2>
                <button @click="closeUploadDrawer" class="text-slate-400 hover:text-slate-600 transition-colors"><i class="el-icon-close text-xl"></i></button>
             </div>

             <div class="flex-1 overflow-y-auto p-6 space-y-6">
                <!-- Dropzone -->
                <div v-if="!flagObj.selectVideo" class="border-2 border-dashed border-slate-300 rounded-2xl h-48 flex flex-col items-center justify-center bg-white cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group" @click="videoSelect">
                   <div class="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-slate-500 group-hover:text-blue-500">
                      <i class="el-icon-upload text-xl"></i>
                   </div>
                   <span class="font-medium text-slate-600">Click to Browse</span>
                </div>

                <!-- Progress Card -->
                <div v-else class="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                   <div class="flex items-start gap-3 mb-3">
                      <div class="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                         <i class="el-icon-video-play"></i>
                      </div>
                      <div class="flex-1 overflow-hidden">
                         <h4 class="text-sm font-bold text-slate-800 truncate">{{ uploadVideoObj.file.name }}</h4>
                         <p class="text-xs text-slate-500">{{ uploadVideoObj.size }}</p>
                      </div>
                      <button @click="videoRemove(true)" class="text-slate-400 hover:text-red-500"><i class="el-icon-delete"></i></button>
                   </div>
                   <div class="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden mb-2">
                      <div class="h-full bg-blue-500 transition-all duration-300" :style="{ width: uploadVideoObj.uploadPercent + '%' }"></div>
                   </div>
                   <div class="flex justify-between text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                      <span>{{ uploadVideoObj.uploadPercent }}% Uploaded</span>
                      <span>{{ uploadVideoObj.uploadEvent.speed }}</span>
                   </div>
                </div>

                <!-- Inputs -->
                <div class="space-y-4">
                   <div class="space-y-1">
                      <label class="text-xs font-bold text-slate-500 uppercase ml-1">Title</label>
                      <input v-model="uploadVideoObj.name" type="text" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm" placeholder="Video title">
                   </div>

                   <div class="grid grid-cols-2 gap-4">
                      <div class="space-y-1">
                         <label class="text-xs font-bold text-slate-500 uppercase ml-1">College</label>
                         <select v-model="uploadVideoObj.college_id" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm appearance-none">
                            <option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</option>
                         </select>
                      </div>
                      <div class="space-y-1">
                         <label class="text-xs font-bold text-slate-500 uppercase ml-1">Access</label>
                         <div class="flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-xl h-[42px]">
                            <span class="text-sm text-slate-600">{{ uploadVideoObj.is_public ? 'Public' : 'Private' }}</span>
                            <a-switch size="small" :checked="uploadVideoObj.is_public === 1" @change="(val) => uploadVideoObj.is_public = val ? 1 : 0"></a-switch>
                         </div>
                      </div>
                   </div>

                   <div class="space-y-1">
                      <label class="text-xs font-bold text-slate-500 uppercase ml-1">Thumbnail</label>
                      <div class="flex gap-3 h-20">
                         <div class="w-32 bg-slate-200 rounded-xl overflow-hidden cursor-pointer relative group" @click="coverSelect">
                            <img v-if="coverObj.imageUrl" :src="coverObj.imageUrl" class="w-full h-full object-cover" />
                            <div class="absolute inset-0 flex items-center justify-center bg-black/10 group-hover:bg-black/20 transition-colors" v-else>
                               <i class="el-icon-plus text-slate-500"></i>
                            </div>
                         </div>
                         <button class="flex-1 border border-slate-200 bg-white rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors" @click="drawCoverByFile(uploadVideoObj.file, Math.random() * uploadVideoObj.duration)">Generate<br>Snapshot</button>
                      </div>
                   </div>

                   <div class="space-y-1">
                      <label class="text-xs font-bold text-slate-500 uppercase ml-1">Description</label>
                      <textarea v-model="uploadVideoObj.description" rows="3" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all text-sm resize-none" placeholder="Add details..."></textarea>
                   </div>
                </div>
             </div>

             <div class="p-6 bg-white border-t border-slate-100">
                <button class="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" @click="handleSubmit('uploadVideo')" :disabled="!flagObj.uploadAble || flagObj.uploading">
                   {{ flagObj.uploading ? 'Processing...' : 'Upload Video' }}
                </button>
             </div>
         </div>
      </a-drawer>

      <!-- Modify Drawer -->
      <a-drawer :visible="showObj.modifyVideo" :title="null" :width="450" @close="showObj.modifyVideo = false" :closable="false">
         <div class="h-full flex flex-col bg-slate-50">
             <div class="px-6 py-5 bg-white border-b border-slate-100 flex justify-between items-center sticky top-0 z-10">
                <h2 class="text-lg font-bold text-slate-800">Edit Video</h2>
                <button @click="showObj.modifyVideo = false" class="text-slate-400 hover:text-slate-600 transition-colors"><i class="el-icon-close text-xl"></i></button>
             </div>

             <div class="flex-1 p-6 space-y-6 overflow-y-auto">
                 <div class="relative group aspect-video rounded-xl overflow-hidden bg-slate-900 cursor-pointer" @click="coverSelect">
                    <img :src="coverObj.imageUrl || (api.videoServer + '/' + modifyVideoObj.form.oldthumbnail_path)" class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <span class="bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm">Change Cover</span>
                    </div>
                 </div>

                 <div class="space-y-4">
                    <input v-model="modifyVideoObj.form.title" type="text" class="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="Title">

                    <div class="grid grid-cols-2 gap-4">
                        <select v-model="modifyVideoObj.form.college_id" class="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm">
                           <option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</a-select-option>
                        </select>
                        <div class="flex items-center justify-between px-3 py-2 bg-white border border-slate-200 rounded-xl">
                            <span class="text-sm text-slate-600">Public</span>
                            <a-switch size="small" :checked="modifyVideoObj.form.is_public === 1" @change="(val) => modifyVideoObj.form.is_public = val ? 1 : 0"></a-switch>
                        </div>
                    </div>

                    <textarea v-model="modifyVideoObj.form.description" rows="4" class="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-500 text-sm resize-none" placeholder="Description"></textarea>
                 </div>
             </div>

             <div class="p-6 bg-white border-t border-slate-100">
                <button class="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-xl shadow-lg transition-all" @click="handleSubmit('modifyVideo')">Save Changes</button>
             </div>
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
:deep(.pro-modal .ant-modal-content) {
  background: transparent;
  box-shadow: none;
  padding: 0;
}
</style>
