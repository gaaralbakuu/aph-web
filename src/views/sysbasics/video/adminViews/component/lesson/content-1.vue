<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-slate-50 font-sans">
    <!-- Top Bar -->
    <div class="flex justify-between items-center px-8 py-5 bg-white border-b border-slate-200 shadow-sm z-10">
      <div class="flex items-center gap-6">
        <h1 class="text-xl font-bold text-slate-800 tracking-tight">Media Library</h1>

        <!-- Filters -->
        <div class="flex items-center gap-3 bg-slate-50 p-1 rounded-lg border border-slate-200">
          <a-input v-model:value="videoListObj.query.title" placeholder="Search videos..." class="w-64 border-none bg-transparent focus:ring-0 text-sm" @change="getVideoList" @pressEnter="getVideoList">
            <template #prefix><i class="el-icon-search text-slate-400"></i></template>
          </a-input>

          <div class="h-4 w-px bg-slate-300"></div>

          <a-select v-model:value="videoListObj.query.status" placeholder="Status" class="w-32 !bg-transparent !border-none" :bordered="false" @change="getVideoList">
             <a-select-option value="">All Status</a-select-option>
             <a-select-option value="pengding">Pending</a-select-option>
             <a-select-option value="Completed">Completed</a-select-option>
             <a-select-option value="Faild">Failed</a-select-option>
          </a-select>
        </div>
      </div>

      <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 font-medium flex items-center gap-2" @click="uploadNewVideo">
        <i class="el-icon-plus font-bold"></i>
        <span>Upload New</span>
      </button>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto p-8">

      <!-- Empty State -->
      <div v-if="videoListObj.list.length === 0" class="flex flex-col items-center justify-center h-full text-slate-400">
        <div class="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <i class="el-icon-video-camera text-4xl text-slate-300"></i>
        </div>
        <p class="text-lg font-medium">No videos found</p>
        <p class="text-sm">Upload a video to get started</p>
      </div>

      <!-- Grid Layout -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8">

        <div v-for="i in videoListObj.list" :key="i.id" class="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 flex flex-col overflow-hidden border border-slate-100">

          <!-- Thumbnail Section -->
          <div class="relative aspect-video bg-slate-900 overflow-hidden cursor-pointer" @click="coverPreview(api.videoServer + '/' + i.thumbnail_path)">
            <img class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" :src="api.videoServer + '/' + i.thumbnail_path" loading="lazy" />

            <!-- Overlay Gradient -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

            <!-- Play Button (Hover) -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button v-if="i.url" class="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white hover:text-indigo-600 transition-all scale-75 group-hover:scale-100" @click.stop="previewVideo(i)">
                <i class="el-icon-video-play text-2xl ml-1"></i>
              </button>
            </div>

            <!-- Duration Badge -->
            <div class="absolute bottom-3 right-3 px-2 py-1 bg-black/70 backdrop-blur-sm rounded text-xs font-medium text-white">
              {{ formatDuration(i.duration) }}
            </div>

            <!-- STATUS: PENDING -->
            <div v-if="i.status === 'Pending' || i.status === 'pengding'" class="absolute inset-0 bg-slate-900/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
               <div class="w-10 h-10 border-2 border-white/20 border-t-white rounded-full animate-spin mb-3"></div>
               <span class="text-white font-medium tracking-wide text-sm">Queued</span>
               <span class="text-white/60 text-xs mt-1">Waiting for server...</span>
            </div>

            <!-- STATUS: PROCESSING (In Progress) -->
            <div v-if="videoProcess && videoProcess.videoId == i.id && !videoProcess.isFinished" class="absolute inset-0 bg-slate-900/90 z-20 flex flex-col items-center justify-center p-6 text-center">
              <div class="relative w-16 h-16 mb-4">
                <svg class="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
                  <path class="text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3" />
                  <path class="text-indigo-500 transition-all duration-300 ease-linear" :stroke-dasharray="((videoProcess.currentTime / i.duration) * 100).toFixed(0) + ', 100'" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" />
                </svg>
                <div class="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                  {{ ((videoProcess.currentTime / i.duration) * 100).toFixed(0) }}%
                </div>
              </div>
              <p class="text-indigo-300 font-medium animate-pulse">Processing...</p>
              <p class="text-slate-400 text-xs mt-1">Don't close window</p>
            </div>

          </div>

          <!-- Card Body -->
          <div class="p-4 flex-1 flex flex-col">
            <div class="flex justify-between items-start mb-2">
              <h3 class="text-base font-bold text-slate-800 line-clamp-1 group-hover:text-indigo-600 transition-colors" :title="i.title">{{ i.title }}</h3>
              <div class="shrink-0">
                <span v-if="i.is_public == 1" class="w-2 h-2 rounded-full bg-green-500 inline-block" title="Public"></span>
                <span v-else class="w-2 h-2 rounded-full bg-amber-500 inline-block" title="Private"></span>
              </div>
            </div>

            <p class="text-xs text-slate-500 mb-4 line-clamp-2 min-h-[2.5em]">{{ i.description || 'No description available' }}</p>

            <div class="mt-auto flex items-center justify-between pt-4 border-t border-slate-100">
               <div class="text-xs text-slate-400 flex items-center gap-1">
                 <i class="el-icon-date"></i>
                 <span>{{ i.create_time ? i.create_time.split(' ')[0] : '-' }}</span>
               </div>

               <div class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-300">
                  <button class="w-8 h-8 rounded-full bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-600 flex items-center justify-center transition-colors" @click="beforeModifyVideo(i)">
                    <i class="el-icon-edit"></i>
                  </button>
                  <button class="w-8 h-8 rounded-full bg-slate-50 hover:bg-red-50 text-slate-600 hover:text-red-600 flex items-center justify-center transition-colors" @click="deleteVideo(i)">
                    <i class="el-icon-delete"></i>
                  </button>
               </div>
            </div>
          </div>
        </div>

      </div>

       <!-- Pagination -->
       <div class="mt-8 flex justify-end">
          <a-pagination v-model:current="videoListObj.query.page" v-model:page-size="videoListObj.query.pageSize" :total="videoListObj.total" :page-size-options="['8', '12', '24', '48']" :show-size-changer="true" @change="handlePageChange"></a-pagination>
       </div>
    </div>

    <!-- Modals (Copied from original but styled simplified) -->
    <!-- Note: Keeping original functionality logic -->
    <div class="components">
      <input ref="videoInput" type="file" @change="videoChange" style="display: none" accept="video/*" />
      <input ref="coverInput" type="file" @change="uploadCoverChange" style="display: none" accept="image/*" />

      <!-- Image Preview Modal -->
      <a-modal v-model:open="showObj.coverDialog" :title="l.preview" :footer="null" :width="600">
        <img width="100%" :src="coverObj.dialogImageUrl" alt="" />
      </a-modal>

      <!-- Video Preview Modal -->
      <a-modal v-model:open="showObj.previewVideo" :title="l.preview" :footer="null" :width="800" @cancel="videoClose">
        <div style="width: 100%; aspect-ratio: 1.8">
          <videoPlayer ref="videoPlayerRef" :src="showObj.videoUrl"></videoPlayer>
        </div>
      </a-modal>

      <!-- Upload Video Drawer -->
      <a-drawer :visible="showObj.uploadVideo" :title="l.uploadVideo" :width="720" @close="closeUploadDrawer">
        <div class="p-6 h-full flex flex-col">
          <!-- Upload Box -->
          <div class="mb-8">
            <div v-if="!flagObj.selectVideo" class="border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-2xl h-64 flex flex-col justify-center items-center cursor-pointer hover:bg-indigo-50 hover:border-indigo-400 transition-all group" @click="videoSelect">
               <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4 group-hover:scale-110 transition-transform text-indigo-500">
                 <i class="el-icon-upload text-3xl"></i>
               </div>
               <p class="text-lg font-semibold text-slate-700">{{ l.selectVideo }}</p>
               <p class="text-sm text-slate-400 mt-2">MP4, WebM, MKV supported</p>
            </div>

            <div v-else class="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
               <div class="flex items-start gap-5">
                  <div class="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <i class="el-icon-video-camera-solid text-2xl"></i>
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4 class="font-bold text-slate-800 truncate">{{ uploadVideoObj.file.name }}</h4>
                    <p class="text-xs text-slate-500 mt-1">{{ uploadVideoObj.size }}</p>

                    <div class="mt-4">
                      <div class="flex justify-between text-xs font-medium text-slate-600 mb-1">
                        <span>Uploading...</span>
                        <span>{{ uploadVideoObj.uploadPercent }}%</span>
                      </div>
                      <div class="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div class="h-full bg-indigo-500 transition-all duration-300" :style="{ width: uploadVideoObj.uploadPercent + '%' }"></div>
                      </div>
                    </div>

                    <div class="flex gap-4 mt-3 text-xs text-slate-400">
                       <span>{{ uploadVideoObj.uploadEvent.speed }}</span>
                       <span>Est: {{ uploadVideoObj.uploadEvent.restTime }}</span>
                    </div>
                  </div>
                  <div class="flex flex-col gap-2">
                    <button class="text-slate-400 hover:text-red-500 transition-colors" @click="videoRemove(true)">
                      <i class="el-icon-close text-xl"></i>
                    </button>
                  </div>
               </div>
            </div>
          </div>

          <!-- Form -->
          <div class="space-y-6 flex-1">
             <div class="grid grid-cols-2 gap-6">
                <!-- Cover -->
                <div class="col-span-1">
                   <label class="block text-sm font-semibold text-slate-700 mb-2">{{ l.cover }}</label>
                   <div class="relative group aspect-video rounded-xl bg-slate-100 overflow-hidden border border-slate-200 hover:border-indigo-300 transition-colors cursor-pointer" @click="coverSelect('upload')">
                      <img v-if="coverObj.imageUrl" :src="coverObj.imageUrl" class="w-full h-full object-cover" />
                      <div v-else class="w-full h-full flex flex-col items-center justify-center text-slate-400">
                         <i class="el-icon-picture-outline text-2xl mb-1"></i>
                         <span class="text-xs">Upload Cover</span>
                      </div>
                      <!-- Hover Actions -->
                      <div v-if="coverObj.imageUrl" class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button class="p-2 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-full backdrop-blur-sm transition-colors" @click.stop="coverPreview(coverObj.imageUrl)">
                            <i class="el-icon-zoom-in"></i>
                          </button>
                          <button class="p-2 bg-white/20 hover:bg-white text-white hover:text-slate-900 rounded-full backdrop-blur-sm transition-colors" @click.stop="drawCoverByFile(uploadVideoObj.file, Math.random() * uploadVideoObj.duration)">
                            <i class="el-icon-refresh"></i>
                          </button>
                      </div>
                   </div>
                </div>

                <!-- Basic Info -->
                <div class="col-span-1 space-y-4">
                    <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-2">{{ l.title }} <span class="text-red-500">*</span></label>
                      <a-input v-model:value="uploadVideoObj.name" :placeholder="l.title" class="w-full"></a-input>
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-slate-700 mb-2">{{ l.college }} <span class="text-red-500">*</span></label>
                      <a-select v-model:value="uploadVideoObj.college_id" :placeholder="l.selectCollegePd" class="w-full">
                        <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</a-select-option>
                      </a-select>
                    </div>
                    <div class="flex items-center justify-between pt-2">
                       <span class="text-sm font-semibold text-slate-700">{{ l.republic }}</span>
                       <a-switch :checked="uploadVideoObj.is_public === 1" @change="(val) => uploadVideoObj.is_public = val ? 1 : 0"></a-switch>
                    </div>
                </div>
             </div>

             <div>
                <label class="block text-sm font-semibold text-slate-700 mb-2">{{ l.introduce }}</label>
                <a-textarea v-model:value="uploadVideoObj.description" :placeholder="l.introducePd" :rows="4" class="w-full"></a-textarea>
             </div>
          </div>

          <!-- Footer -->
          <div class="mt-8 flex justify-end gap-3 pt-6 border-t border-slate-100">
             <a-button @click="closeUploadDrawer" class="px-6 h-10 rounded-lg">{{ c.cancel }}</a-button>
             <a-button type="primary" @click="handleSubmit('uploadVideo')" :disabled="!flagObj.uploadAble" :loading="flagObj.uploading" class="px-8 h-10 rounded-lg bg-indigo-600 border-indigo-600 hover:bg-indigo-700">
               {{ l.uploadVideo }}
             </a-button>
          </div>
        </div>
      </a-drawer>

      <!-- Modify Video Drawer (Simplified for brevity but functional) -->
      <a-drawer :visible="showObj.modifyVideo" :title="l.modifyVideo" :width="720" @close="showObj.modifyVideo = false">
        <div class="p-6 space-y-6">
           <!-- Cover Comparison -->
           <div class="flex items-center gap-8 justify-center bg-slate-50 p-6 rounded-xl border border-slate-100">
              <div class="text-center">
                 <div class="w-40 aspect-video rounded-lg overflow-hidden bg-slate-200 mb-2">
                    <img :src="api.videoServer + '/' + modifyVideoObj.form.oldthumbnail_path" class="w-full h-full object-cover" />
                 </div>
                 <span class="text-xs text-slate-500">Current Cover</span>
              </div>
              <i class="el-icon-right text-slate-300 text-2xl"></i>
              <div class="text-center cursor-pointer" @click="coverSelect('upload')">
                 <div class="w-40 aspect-video rounded-lg overflow-hidden bg-white border-2 border-dashed border-indigo-200 hover:border-indigo-400 transition-colors flex items-center justify-center mb-2 relative group">
                    <img v-if="coverObj.imageUrl" :src="coverObj.imageUrl" class="w-full h-full object-cover" />
                    <i v-else class="el-icon-plus text-2xl text-indigo-300"></i>

                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                       <span class="text-white text-xs font-medium">Change</span>
                    </div>
                 </div>
                 <span class="text-xs text-slate-500">New Cover</span>
              </div>
           </div>

           <!-- Fields -->
           <div class="space-y-4">
              <a-input v-model:value="modifyVideoObj.form.title" :placeholder="l.title" addon-before="Title"></a-input>

              <div class="grid grid-cols-2 gap-4">
                 <a-select v-model:value="modifyVideoObj.form.college_id" :placeholder="l.selectCollegePd" class="w-full">
                    <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</a-select-option>
                 </a-select>
                 <div class="flex items-center justify-between border border-slate-200 rounded px-3 bg-white">
                    <span class="text-slate-600 text-sm">Public</span>
                    <a-switch :checked="modifyVideoObj.form.is_public === 1" @change="(val) => modifyVideoObj.form.is_public = val ? 1 : 0"></a-switch>
                 </div>
              </div>

              <a-textarea v-model:value="modifyVideoObj.form.description" :placeholder="l.introducePd" :rows="4"></a-textarea>
           </div>

           <div class="flex justify-end pt-6">
              <a-button type="primary" @click="handleSubmit('modifyVideo')" class="px-8 bg-indigo-600 border-indigo-600">Update Video</a-button>
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
/* Keeping specific CSS for modal if needed, but Tailwind handles most */
</style>
