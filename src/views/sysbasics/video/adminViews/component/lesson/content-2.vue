<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-slate-900 text-slate-100 font-sans selection:bg-purple-500 selection:text-white">
    <!-- Top Bar -->
    <div class="flex justify-between items-center px-8 py-6 bg-slate-900/50 backdrop-blur-md border-b border-white/5 z-10 sticky top-0">
      <div class="flex items-center gap-6">
        <h1 class="text-2xl font-black tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">STUDIO<span class="text-slate-500 font-light mx-2">|</span>CONTENT</h1>

        <!-- Filters -->
        <div class="flex items-center gap-3 bg-white/5 p-1.5 rounded-full border border-white/10">
          <a-input v-model:value="videoListObj.query.title" placeholder="Search..." class="w-64 border-none bg-transparent focus:ring-0 text-sm text-white placeholder-slate-500" @change="getVideoList" @pressEnter="getVideoList">
            <template #prefix><i class="el-icon-search text-slate-500"></i></template>
          </a-input>

          <div class="h-4 w-px bg-white/10"></div>

          <a-select v-model:value="videoListObj.query.status" placeholder="Status" class="w-32 !bg-transparent !border-none text-white" :bordered="false" @change="getVideoList">
             <a-select-option value="" class="text-slate-900">All</a-select-option>
             <a-select-option value="pengding" class="text-slate-900">Pending</a-select-option>
             <a-select-option value="Completed" class="text-slate-900">Completed</a-select-option>
             <a-select-option value="Faild" class="text-slate-900">Failed</a-select-option>
          </a-select>
        </div>
      </div>

      <button class="bg-purple-600 hover:bg-purple-500 text-white px-8 py-3 rounded-full font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(147,51,234,0.3)] hover:shadow-[0_0_30px_rgba(147,51,234,0.5)] flex items-center gap-2 group" @click="uploadNewVideo">
        <i class="el-icon-plus group-hover:rotate-90 transition-transform"></i>
        <span>CREATE</span>
      </button>
    </div>

    <!-- Main Content -->
    <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">

      <!-- Empty State -->
      <div v-if="videoListObj.list.length === 0" class="flex flex-col items-center justify-center h-full text-slate-600">
        <i class="el-icon-film text-6xl mb-4 opacity-20"></i>
        <p class="text-xl font-light tracking-widest uppercase">No Content Available</p>
      </div>

      <!-- Grid Layout -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">

        <div v-for="i in videoListObj.list" :key="i.id" class="group relative bg-slate-800 rounded-xl overflow-hidden border border-white/5 hover:border-purple-500/50 transition-all duration-300 hover:transform hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10">

          <!-- Thumbnail Section -->
          <div class="relative aspect-video bg-black cursor-pointer" @click="coverPreview(api.videoServer + '/' + i.thumbnail_path)">
            <img class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" :src="api.videoServer + '/' + i.thumbnail_path" loading="lazy" />

            <!-- Vignette -->
            <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>

            <!-- Play Button -->
            <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button v-if="i.url" class="w-16 h-16 rounded-full border-2 border-white/80 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all backdrop-blur-sm" @click.stop="previewVideo(i)">
                <i class="el-icon-video-play text-3xl ml-1"></i>
              </button>
            </div>

            <!-- Duration Badge -->
            <div class="absolute top-3 right-3 px-2 py-0.5 bg-black/80 border border-white/10 rounded text-[10px] font-mono tracking-widest text-slate-300">
              {{ formatDuration(i.duration) }}
            </div>

            <!-- STATUS: PENDING -->
            <div v-if="i.status === 'Pending' || i.status === 'pengding'" class="absolute inset-0 bg-black/80 flex flex-col items-center justify-center z-20">
               <div class="flex space-x-1 mb-3">
                 <div class="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-0"></div>
                 <div class="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></div>
                 <div class="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></div>
               </div>
               <span class="text-purple-400 font-mono text-xs uppercase tracking-widest animate-pulse">In Queue</span>
            </div>

            <!-- STATUS: PROCESSING (In Progress) -->
            <div v-if="videoProcess && videoProcess.videoId == i.id && !videoProcess.isFinished" class="absolute inset-0 bg-black/90 z-30 flex flex-col items-center justify-center p-6 text-center border-b-2 border-purple-500">
               <div class="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 font-mono mb-2">
                 {{ ((videoProcess.currentTime / i.duration) * 100).toFixed(0) }}%
               </div>
               <div class="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-2">
                 <div class="h-full bg-gradient-to-r from-purple-600 to-pink-600 shadow-[0_0_10px_rgba(168,85,247,0.8)]" :style="{ width: ((videoProcess.currentTime / i.duration) * 100) + '%' }"></div>
               </div>
               <p class="text-slate-400 text-[10px] font-mono uppercase tracking-widest">Rendering...</p>
            </div>

          </div>

          <!-- Card Body -->
          <div class="p-5">
            <div class="flex items-start justify-between gap-4 mb-3">
               <h3 class="text-lg font-bold text-slate-200 leading-tight line-clamp-2 group-hover:text-purple-400 transition-colors">{{ i.title }}</h3>
               <div class="shrink-0 flex flex-col items-end gap-1">
                 <span v-if="i.is_public == 1" class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-green-500/20 text-green-400 border border-green-500/30 uppercase">Pub</span>
                 <span v-else class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 uppercase">Pvt</span>
               </div>
            </div>

            <div class="flex items-center gap-4 text-xs text-slate-500 font-mono mb-4 border-t border-white/5 pt-3 mt-3">
               <div class="flex items-center gap-1">
                 <i class="el-icon-user"></i>
                 <span>{{ i.create_user }}</span>
               </div>
               <div class="flex items-center gap-1">
                 <i class="el-icon-date"></i>
                 <span>{{ i.create_time ? i.create_time.split(' ')[0] : '-' }}</span>
               </div>
            </div>

            <!-- Hover Actions Slide Up -->
            <div class="flex items-center justify-between">
                <span class="text-xs text-slate-600">{{ formatFileSize(i.size || 0) }}</span>
                <div class="flex gap-2">
                   <button class="w-8 h-8 rounded hover:bg-blue-500/20 text-slate-400 hover:text-blue-400 transition-colors flex items-center justify-center" @click="beforeModifyVideo(i)">
                     <i class="el-icon-edit"></i>
                   </button>
                   <button class="w-8 h-8 rounded hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors flex items-center justify-center" @click="deleteVideo(i)">
                     <i class="el-icon-delete"></i>
                   </button>
                </div>
            </div>
          </div>
        </div>
      </div>

       <!-- Pagination -->
       <div class="mt-8 flex justify-end">
          <a-pagination class="dark-pagination" v-model:current="videoListObj.query.page" v-model:page-size="videoListObj.query.pageSize" :total="videoListObj.total" :page-size-options="['8', '12', '24', '48']" :show-size-changer="true" @change="handlePageChange"></a-pagination>
       </div>
    </div>

    <!-- Modals (Copied from original but styled dark) -->
    <div class="components">
      <input ref="videoInput" type="file" @change="videoChange" style="display: none" accept="video/*" />
      <input ref="coverInput" type="file" @change="uploadCoverChange" style="display: none" accept="image/*" />

      <!-- Image Preview Modal -->
      <a-modal v-model:open="showObj.coverDialog" :title="null" :footer="null" :width="600" wrapClassName="dark-modal">
        <img width="100%" :src="coverObj.dialogImageUrl" alt="" class="rounded-lg border border-white/10" />
      </a-modal>

      <!-- Video Preview Modal -->
      <a-modal v-model:open="showObj.previewVideo" :title="null" :footer="null" :width="800" @cancel="videoClose" wrapClassName="dark-modal">
        <div style="width: 100%; aspect-ratio: 1.8" class="bg-black rounded-lg overflow-hidden border border-white/10">
          <videoPlayer ref="videoPlayerRef" :src="showObj.videoUrl"></videoPlayer>
        </div>
      </a-modal>

      <!-- Upload Video Drawer -->
      <a-drawer :visible="showObj.uploadVideo" :title="null" :width="720" @close="closeUploadDrawer" :closable="false" wrapClassName="dark-drawer">
        <div class="h-full flex flex-col bg-slate-900 text-slate-200">
          <!-- Header -->
          <div class="px-8 py-6 border-b border-white/10 flex justify-between items-center">
             <h2 class="text-xl font-bold text-white tracking-wide">UPLOAD VIDEO</h2>
             <button @click="closeUploadDrawer" class="text-slate-500 hover:text-white transition-colors">
               <i class="el-icon-close text-2xl"></i>
             </button>
          </div>

          <div class="p-8 flex-1 overflow-y-auto">
            <!-- Upload Box -->
            <div class="mb-8">
              <div v-if="!flagObj.selectVideo" class="border-2 border-dashed border-white/10 bg-white/5 rounded-2xl h-64 flex flex-col justify-center items-center cursor-pointer hover:bg-white/10 hover:border-purple-500/50 transition-all group" @click="videoSelect">
                 <div class="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform text-purple-500 border border-white/5">
                   <i class="el-icon-upload text-4xl"></i>
                 </div>
                 <p class="text-lg font-bold text-slate-300">DRAG & DROP</p>
                 <p class="text-xs text-slate-500 mt-2 font-mono">OR CLICK TO BROWSE</p>
              </div>

              <div v-else class="bg-slate-800 rounded-2xl border border-white/10 p-6 shadow-xl relative overflow-hidden">
                 <!-- Background Progress -->
                 <div class="absolute inset-0 bg-purple-500/5 transition-all duration-300 pointer-events-none" :style="{ width: uploadVideoObj.uploadPercent + '%' }"></div>

                 <div class="flex items-start gap-5 relative z-10">
                    <div class="w-16 h-16 rounded-lg bg-black/50 border border-white/10 flex items-center justify-center text-purple-500 shrink-0">
                      <i class="el-icon-video-camera-solid text-2xl"></i>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex justify-between items-start">
                         <h4 class="font-bold text-white truncate text-lg">{{ uploadVideoObj.file.name }}</h4>
                         <span class="font-mono text-purple-400 font-bold">{{ uploadVideoObj.uploadPercent }}%</span>
                      </div>
                      <p class="text-xs text-slate-500 font-mono mt-1 mb-3">{{ uploadVideoObj.size }} • {{ uploadVideoObj.uploadEvent.speed }}</p>

                      <div class="h-1 bg-slate-700 rounded-full overflow-hidden w-full">
                        <div class="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300" :style="{ width: uploadVideoObj.uploadPercent + '%' }"></div>
                      </div>
                    </div>
                    <button class="text-slate-500 hover:text-red-500 transition-colors" @click="videoRemove(true)">
                      <i class="el-icon-delete text-xl"></i>
                    </button>
                 </div>
              </div>
            </div>

            <!-- Form -->
            <div class="space-y-8">
               <div class="grid grid-cols-2 gap-8">
                  <!-- Cover -->
                  <div class="col-span-1">
                     <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Cover Image</label>
                     <div class="relative group aspect-video rounded-xl bg-black/50 overflow-hidden border border-white/10 hover:border-purple-500/50 transition-colors cursor-pointer" @click="coverSelect('upload')">
                        <img v-if="coverObj.imageUrl" :src="coverObj.imageUrl" class="w-full h-full object-cover" />
                        <div v-else class="w-full h-full flex flex-col items-center justify-center text-slate-600">
                           <i class="el-icon-picture text-3xl mb-2"></i>
                           <span class="text-[10px] font-mono uppercase">Upload Cover</span>
                        </div>
                        <!-- Hover Actions -->
                        <div v-if="coverObj.imageUrl" class="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                            <button class="text-white hover:text-purple-400 transition-colors" @click.stop="coverPreview(coverObj.imageUrl)">
                              <i class="el-icon-zoom-in text-2xl"></i>
                            </button>
                            <button class="text-white hover:text-green-400 transition-colors" @click.stop="drawCoverByFile(uploadVideoObj.file, Math.random() * uploadVideoObj.duration)">
                              <i class="el-icon-refresh text-2xl"></i>
                            </button>
                        </div>
                     </div>
                  </div>

                  <!-- Basic Info -->
                  <div class="col-span-1 space-y-5">
                      <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Title</label>
                        <a-input v-model:value="uploadVideoObj.name" :placeholder="l.title" class="w-full !bg-slate-800 !border-white/10 !text-white placeholder-slate-600 focus:!border-purple-500"></a-input>
                      </div>
                      <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">College</label>
                        <a-select v-model:value="uploadVideoObj.college_id" :placeholder="l.selectCollegePd" class="w-full !bg-slate-800 !text-white" dropdownClassName="dark-dropdown">
                          <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id" class="text-slate-900">{{ i.name_label }}</a-select-option>
                        </a-select>
                      </div>
                      <div class="flex items-center justify-between pt-2 p-3 bg-white/5 rounded border border-white/5">
                         <span class="text-sm font-bold text-slate-400">Public Access</span>
                         <a-switch :checked="uploadVideoObj.is_public === 1" @change="(val) => uploadVideoObj.is_public = val ? 1 : 0"></a-switch>
                      </div>
                  </div>
               </div>

               <div>
                  <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</label>
                  <a-textarea v-model:value="uploadVideoObj.description" :placeholder="l.introducePd" :rows="4" class="w-full !bg-slate-800 !border-white/10 !text-white placeholder-slate-600 focus:!border-purple-500"></a-textarea>
               </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="px-8 py-6 border-t border-white/10 bg-slate-900 flex justify-end gap-4">
             <button @click="closeUploadDrawer" class="px-6 py-2 rounded text-slate-400 hover:text-white transition-colors uppercase text-sm font-bold tracking-wider">Cancel</button>
             <button @click="handleSubmit('uploadVideo')" :disabled="!flagObj.uploadAble" class="px-8 py-2 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold tracking-wider uppercase shadow-lg shadow-purple-900/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
               {{ flagObj.uploading ? 'Uploading...' : 'Publish Video' }}
             </button>
          </div>
        </div>
      </a-drawer>

      <!-- Modify Video Drawer -->
      <a-drawer :visible="showObj.modifyVideo" :title="null" :width="720" @close="showObj.modifyVideo = false" :closable="false" wrapClassName="dark-drawer">
        <div class="h-full flex flex-col bg-slate-900 text-slate-200">
           <div class="px-8 py-6 border-b border-white/10 flex justify-between items-center">
             <h2 class="text-xl font-bold text-white tracking-wide">EDIT VIDEO</h2>
             <button @click="showObj.modifyVideo = false" class="text-slate-500 hover:text-white transition-colors">
               <i class="el-icon-close text-2xl"></i>
             </button>
          </div>

          <div class="p-8 flex-1 overflow-y-auto space-y-8">
             <!-- Cover Comparison -->
             <div class="flex items-center gap-8 justify-center bg-white/5 p-6 rounded-xl border border-white/10">
                <div class="text-center group">
                   <div class="w-48 aspect-video rounded-lg overflow-hidden bg-black mb-2 relative border border-white/10">
                      <img :src="api.videoServer + '/' + modifyVideoObj.form.oldthumbnail_path" class="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                   </div>
                   <span class="text-[10px] font-mono uppercase text-slate-500">Current</span>
                </div>
                <i class="el-icon-right text-purple-500 text-2xl"></i>
                <div class="text-center cursor-pointer" @click="coverSelect('upload')">
                   <div class="w-48 aspect-video rounded-lg overflow-hidden bg-slate-800 border border-dashed border-white/20 hover:border-purple-500 transition-colors flex items-center justify-center mb-2 relative group">
                      <img v-if="coverObj.imageUrl" :src="coverObj.imageUrl" class="w-full h-full object-cover" />
                      <i v-else class="el-icon-picture-outline text-2xl text-slate-600 group-hover:text-purple-500 transition-colors"></i>

                      <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                         <span class="text-white text-xs font-bold uppercase tracking-wider">Change</span>
                      </div>
                   </div>
                   <span class="text-[10px] font-mono uppercase text-slate-500">New</span>
                </div>
             </div>

             <!-- Fields -->
             <div class="space-y-6">
                <div class="space-y-2">
                   <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">Title</label>
                   <a-input v-model:value="modifyVideoObj.form.title" class="!bg-slate-800 !border-white/10 !text-white focus:!border-purple-500"></a-input>
                </div>

                <div class="grid grid-cols-2 gap-6">
                   <div class="space-y-2">
                       <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">College</label>
                       <a-select v-model:value="modifyVideoObj.form.college_id" class="w-full !bg-slate-800 !text-white" dropdownClassName="dark-dropdown">
                          <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id" class="text-slate-900">{{ i.name_label }}</a-select-option>
                       </a-select>
                   </div>
                   <div class="space-y-2">
                       <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">Visibility</label>
                       <div class="h-[32px] flex items-center px-4 bg-slate-800 rounded border border-white/10 justify-between">
                          <span class="text-sm text-slate-400">Publicly Available</span>
                          <a-switch :checked="modifyVideoObj.form.is_public === 1" @change="(val) => modifyVideoObj.form.is_public = val ? 1 : 0"></a-switch>
                       </div>
                   </div>
                </div>

                <div class="space-y-2">
                   <label class="block text-xs font-bold text-slate-500 uppercase tracking-wider">Description</label>
                   <a-textarea v-model:value="modifyVideoObj.form.description" :rows="5" class="!bg-slate-800 !border-white/10 !text-white focus:!border-purple-500"></a-textarea>
                </div>
             </div>
          </div>

           <div class="px-8 py-6 border-t border-white/10 bg-slate-900 flex justify-end gap-4">
             <button @click="showObj.modifyVideo = false" class="px-6 py-2 rounded text-slate-400 hover:text-white transition-colors uppercase text-sm font-bold tracking-wider">Cancel</button>
             <button @click="handleSubmit('modifyVideo')" class="px-8 py-2 rounded bg-purple-600 hover:bg-purple-500 text-white font-bold tracking-wider uppercase shadow-lg shadow-purple-900/50 transition-all">Save Changes</button>
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
/* Override Ant Design styles for dark mode */
:deep(.dark-drawer .ant-drawer-content) {
  background-color: #0f172a; /* slate-900 */
}
:deep(.dark-drawer .ant-drawer-header) {
  background-color: #0f172a;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
:deep(.dark-drawer .ant-drawer-title) {
  color: #f8fafc;
}

:deep(.ant-input), :deep(.ant-input-affix-wrapper) {
  background-color: rgba(255,255,255,0.05);
  border-color: rgba(255,255,255,0.1);
  color: white;
}
:deep(.ant-input:focus), :deep(.ant-input-affix-wrapper:focus), :deep(.ant-input-affix-wrapper-focused) {
  border-color: #a855f7;
  box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2);
}

:deep(.ant-pagination-item), :deep(.ant-pagination-prev .ant-pagination-item-link), :deep(.ant-pagination-next .ant-pagination-item-link) {
  background-color: transparent !important;
  border-color: rgba(255,255,255,0.2) !important;
  color: rgba(255,255,255,0.7) !important;
}

:deep(.ant-pagination-item-active) {
  border-color: #a855f7 !important;
}
:deep(.ant-pagination-item-active a) {
  color: #a855f7 !important;
}
:deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
   background-color: transparent;
   border-color: rgba(255,255,255,0.1);
   color: white;
}
</style>
