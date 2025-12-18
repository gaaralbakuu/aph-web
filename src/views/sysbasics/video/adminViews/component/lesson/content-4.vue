<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Channel Dashboard Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white">
       <h1 class="text-xl font-medium">Channel content</h1>

       <div class="flex gap-2">
         <button class="flex items-center gap-2 px-4 py-2 bg-[#CC0000] text-white font-medium text-sm uppercase rounded-sm hover:bg-[#990000] transition-colors shadow-sm" @click="uploadNewVideo">
            <i class="el-icon-video-camera-solid text-lg"></i>
            <span>Create</span>
         </button>
       </div>
    </div>

    <!-- Filter Tabs -->
    <div class="px-6 pt-6 pb-2 border-b border-[#E5E5E5] bg-white sticky top-0 z-20">
       <div class="flex items-center gap-6 text-sm font-medium text-[#606060]">
          <button class="pb-3 border-b-2 transition-colors" :class="videoListObj.query.status === '' ? 'text-[#0D0D0D] border-[#0D0D0D]' : 'border-transparent hover:text-[#0D0D0D]'" @click="videoListObj.query.status = ''; getVideoList()">Videos</button>
          <button class="pb-3 border-b-2 transition-colors" :class="videoListObj.query.status === 'pengding' ? 'text-[#0D0D0D] border-[#0D0D0D]' : 'border-transparent hover:text-[#0D0D0D]'" @click="videoListObj.query.status = 'pengding'; getVideoList()">Live / Pending</button>
          <button class="pb-3 border-b-2 border-transparent hover:text-[#0D0D0D]">Playlists</button>
          <button class="pb-3 border-b-2 border-transparent hover:text-[#0D0D0D]">Podcasts</button>
       </div>
       <div class="mt-4 flex items-center gap-2 mb-2">
          <i class="el-icon-s-operation text-[#606060] text-lg cursor-pointer"></i>
          <input v-model="videoListObj.query.title" type="text" placeholder="Filter" class="bg-transparent border-none outline-none text-sm w-full placeholder-[#606060]" @change="getVideoList">
       </div>
    </div>

    <!-- Content Table Header -->
    <div class="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-2 border-b border-[#E5E5E5] text-xs font-medium text-[#606060] bg-white sticky top-[105px] z-10">
       <div>Video</div>
       <div>Visibility</div>
       <div>Restrictions</div>
       <div>Date</div>
       <div class="text-right">Views</div>
    </div>

    <!-- List -->
    <div class="flex-1 overflow-y-auto bg-white">
       <div v-if="videoListObj.list.length === 0" class="flex flex-col items-center justify-center py-20">
          <div class="w-32 h-32 bg-[#F9F9F9] rounded-full flex items-center justify-center mb-4">
             <i class="el-icon-video-camera text-4xl text-[#CCCCCC]"></i>
          </div>
          <p class="text-[#0D0D0D]">No content available</p>
          <p class="text-sm text-[#606060] mt-1">Videos you upload will appear here.</p>
          <button class="mt-4 text-[#065FD4] font-medium text-sm uppercase" @click="uploadNewVideo">Upload videos</button>
       </div>

       <div v-else class="divide-y divide-[#E5E5E5]">
          <div v-for="i in videoListObj.list" :key="i.id" class="grid grid-cols-[3fr_1fr_1fr_1fr_1fr] gap-4 px-6 py-2 hover:bg-[#F9F9F9] group items-start transition-colors relative">

             <!-- Column 1: Video -->
             <div class="flex gap-4">
                <!-- Checkbox placeholder -->
                <div class="w-4 flex items-center justify-center pt-8">
                   <div class="w-4 h-4 border border-[#CCCCCC] rounded-sm"></div>
                </div>

                <!-- Thumbnail -->
                <div class="relative w-[120px] h-[68px] bg-[#E5E5E5] shrink-0 group/thumb cursor-pointer" @click="coverPreview(api.videoServer + '/' + i.thumbnail_path)">
                   <img :src="api.videoServer + '/' + i.thumbnail_path" class="w-full h-full object-cover" />
                   <span class="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-medium px-1 rounded-sm">{{ formatDuration(i.duration) }}</span>

                   <!-- Hover Play -->
                   <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity" @click.stop="previewVideo(i)">
                      <i class="el-icon-video-play text-white text-2xl"></i>
                   </div>

                   <!-- Status Overlays on Thumbnail -->
                   <div v-if="i.status === 'Pending' || i.status === 'pengding'" class="absolute inset-0 bg-white/90 flex flex-col items-center justify-center text-[#606060]">
                       <i class="el-icon-time animate-spin text-lg mb-1"></i>
                       <span class="text-[10px] uppercase font-bold">Pending</span>
                   </div>

                   <div v-if="videoProcess && videoProcess.videoId == i.id && !videoProcess.isFinished" class="absolute inset-0 bg-white/90 flex flex-col items-center justify-center">
                       <div class="text-[10px] font-bold text-[#065FD4]">{{ ((videoProcess.currentTime / i.duration) * 100).toFixed(0) }}%</div>
                       <div class="w-8 h-1 bg-[#E5E5E5] mt-1 overflow-hidden">
                          <div class="h-full bg-[#065FD4]" :style="{ width: ((videoProcess.currentTime / i.duration) * 100) + '%' }"></div>
                       </div>
                   </div>
                </div>

                <!-- Title & Desc -->
                <div class="min-w-0 pt-1 flex flex-col justify-between h-[68px]">
                   <div>
                      <h3 class="text-sm font-medium text-[#0D0D0D] line-clamp-1 mb-1 cursor-pointer hover:text-[#065FD4]" :title="i.title" @click="beforeModifyVideo(i)">{{ i.title }}</h3>
                      <p class="text-xs text-[#606060] line-clamp-1 group-hover:hidden">{{ i.description || 'Add description' }}</p>

                      <!-- Hover Actions (Replace desc on hover) -->
                      <div class="hidden group-hover:flex items-center gap-4 text-[#606060]">
                         <i class="el-icon-edit text-lg cursor-pointer hover:text-[#0D0D0D]" title="Details" @click="beforeModifyVideo(i)"></i>
                         <i class="el-icon-data-analysis text-lg cursor-pointer hover:text-[#0D0D0D]" title="Analytics"></i>
                         <i class="el-icon-chat-dot-square text-lg cursor-pointer hover:text-[#0D0D0D]" title="Comments"></i>
                         <i class="el-icon-view text-lg cursor-pointer hover:text-[#0D0D0D]" title="View on YouTube"></i>
                         <div class="relative group/more">
                            <i class="el-icon-more text-lg cursor-pointer hover:text-[#0D0D0D] rotate-90" title="Options"></i>
                            <!-- Dropdown simulation -->
                            <div class="absolute left-0 top-full bg-white shadow-lg border border-[#E5E5E5] py-2 rounded w-32 hidden group-hover/more:block z-50">
                               <button class="w-full text-left px-4 py-2 hover:bg-[#F2F2F2] text-sm" @click="deleteVideo(i)">Delete forever</button>
                               <button class="w-full text-left px-4 py-2 hover:bg-[#F2F2F2] text-sm">Download</button>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <!-- Column 2: Visibility -->
             <div class="pt-3">
                <div class="flex items-center gap-1">
                   <i v-if="i.is_public == 1" class="el-icon-view text-[#069C56] text-lg"></i>
                   <i v-else class="el-icon-lock text-[#606060] text-lg"></i>
                   <span class="text-sm text-[#0D0D0D]">{{ i.is_public == 1 ? 'Public' : 'Private' }}</span>
                </div>
             </div>

             <!-- Column 3: Restrictions -->
             <div class="pt-3">
                <span class="text-sm text-[#0D0D0D]">None</span>
             </div>

             <!-- Column 4: Date -->
             <div class="pt-3">
                <div class="text-sm text-[#0D0D0D]">{{ i.create_time ? i.create_time.split(' ')[0] : 'Draft' }}</div>
                <div class="text-xs text-[#606060]">Uploaded</div>

                <!-- Processing Status Text -->
                <div v-if="videoProcess && videoProcess.videoId == i.id && !videoProcess.isFinished" class="text-xs text-[#065FD4] mt-1 animate-pulse">
                   Processing HD version...
                </div>
                <div v-else-if="i.status === 'Pending' || i.status === 'pengding'" class="text-xs text-[#606060] mt-1 italic">
                   Waiting in queue
                </div>
             </div>

             <!-- Column 5: Views (Dummy data) -->
             <div class="pt-3 text-right text-sm text-[#0D0D0D]">
                --
             </div>

          </div>
       </div>

       <div class="flex justify-end p-4 border-t border-[#E5E5E5] bg-white text-xs text-[#606060]">
          <div class="flex items-center gap-2">
             <span>Rows per page:</span>
             <select class="border-none bg-transparent outline-none font-medium" v-model="videoListObj.query.pageSize" @change="getVideoList">
                <option value="10">10</option>
                <option value="30">30</option>
                <option value="50">50</option>
             </select>
             <span class="mx-2">1-{{ videoListObj.list.length }} of {{ videoListObj.total }}</span>
             <i class="el-icon-arrow-left cursor-pointer hover:bg-[#F2F2F2] p-1 rounded-full" @click="videoListObj.query.page > 1 && handlePageChange(videoListObj.query.page - 1)"></i>
             <i class="el-icon-arrow-right cursor-pointer hover:bg-[#F2F2F2] p-1 rounded-full" @click="handlePageChange(videoListObj.query.page + 1)"></i>
          </div>
       </div>
    </div>

    <!-- Modals -->
    <div class="components">
      <input ref="videoInput" type="file" @change="videoChange" style="display: none" accept="video/*" />
      <input ref="coverInput" type="file" @change="uploadCoverChange" style="display: none" accept="image/*" />

      <a-modal v-model:open="showObj.coverDialog" :footer="null" :width="600" :title="null" :closable="true">
        <img width="100%" :src="coverObj.dialogImageUrl" />
      </a-modal>

      <a-modal v-model:open="showObj.previewVideo" :footer="null" :width="800" @cancel="videoClose" :title="null">
        <div style="width: 100%; aspect-ratio: 1.8">
          <videoPlayer ref="videoPlayerRef" :src="showObj.videoUrl"></videoPlayer>
        </div>
      </a-modal>

      <!-- Upload Modal (Simulating YouTube Studio Upload) -->
      <a-modal v-model:open="showObj.uploadVideo" :width="960" :footer="null" :title="null" :closable="false" wrapClassName="studio-upload-modal">
        <div class="flex flex-col h-[80vh] bg-white overflow-hidden rounded-lg">
           <!-- Header -->
           <div class="flex justify-between items-center px-6 py-4 border-b border-[#E5E5E5]">
              <h2 class="text-xl font-medium text-[#0D0D0D]">{{ uploadVideoObj.file.name ? uploadVideoObj.file.name : 'Upload videos' }}</h2>
              <div class="flex gap-4">
                 <i class="el-icon-close text-2xl text-[#606060] cursor-pointer hover:text-[#0D0D0D]" @click="closeUploadDrawer"></i>
              </div>
           </div>

           <!-- Content -->
           <div class="flex-1 overflow-y-auto relative">
              <!-- Upload State -->
              <div v-if="!flagObj.selectVideo" class="h-full flex flex-col items-center justify-center space-y-6 animate-fade-in">
                 <div class="w-32 h-32 bg-[#F9F9F9] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#F0F0F0] transition-colors" @click="videoSelect">
                    <i class="el-icon-upload text-5xl text-[#909090]"></i>
                 </div>
                 <div class="text-center">
                    <p class="text-[#0D0D0D] text-lg">Drag and drop video files to upload</p>
                    <p class="text-[#606060] text-sm mt-1">Your videos will be private until you publish them.</p>
                 </div>
                 <button class="bg-[#065FD4] text-white px-6 py-2.5 rounded-sm font-medium uppercase text-sm" @click="videoSelect">Select Files</button>
              </div>

              <!-- Details State -->
              <div v-else class="flex h-full">
                 <!-- Left: Form -->
                 <div class="flex-1 p-8 space-y-8 overflow-y-auto">
                    <h3 class="text-xl font-medium text-[#0D0D0D]">Details</h3>

                    <div class="space-y-6">
                       <div class="group relative border border-[#CCCCCC] rounded px-3 py-2 focus-within:border-[#065FD4]">
                          <label class="block text-xs text-[#606060] mb-1">Title (required)</label>
                          <input v-model="uploadVideoObj.name" type="text" class="w-full outline-none text-[#0D0D0D] text-sm" placeholder="Add a title that describes your video">
                       </div>

                       <div class="group relative border border-[#CCCCCC] rounded px-3 py-2 focus-within:border-[#065FD4]">
                          <label class="block text-xs text-[#606060] mb-1">Description</label>
                          <textarea v-model="uploadVideoObj.description" rows="5" class="w-full outline-none text-[#0D0D0D] text-sm resize-none" placeholder="Tell viewers about your video"></textarea>
                       </div>

                       <div>
                          <label class="block text-sm font-medium text-[#0D0D0D] mb-2">Thumbnail</label>
                          <p class="text-xs text-[#606060] mb-3">Select or upload a picture that shows what's in your video.</p>
                          <div class="flex gap-4">
                             <div class="w-[125px] h-[70px] border border-dashed border-[#CCCCCC] flex flex-col items-center justify-center cursor-pointer hover:border-[#606060]" @click="coverSelect">
                                <i class="el-icon-picture-outline text-[#606060] mb-1"></i>
                                <span class="text-[10px] text-[#606060]">Upload file</span>
                             </div>
                             <!-- Auto generated placeholder -->
                             <div class="w-[125px] h-[70px] bg-[#F9F9F9] flex items-center justify-center cursor-pointer relative" @click="drawCoverByFile(uploadVideoObj.file, Math.random() * uploadVideoObj.duration)">
                                <span class="text-[10px] text-[#606060]">Auto-gen</span>
                                <img v-if="coverObj.imageUrl" :src="coverObj.imageUrl" class="absolute inset-0 w-full h-full object-cover" />
                             </div>
                          </div>
                       </div>

                       <div class="grid grid-cols-2 gap-6">
                          <div>
                              <label class="block text-sm font-medium text-[#0D0D0D] mb-2">College</label>
                              <select v-model="uploadVideoObj.college_id" class="w-full border border-[#CCCCCC] rounded px-3 py-2 outline-none text-sm">
                                 <option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</option>
                              </select>
                          </div>
                          <div>
                              <label class="block text-sm font-medium text-[#0D0D0D] mb-2">Visibility</label>
                              <div class="flex items-center gap-4 border border-[#CCCCCC] rounded px-3 py-2">
                                 <div class="flex items-center gap-2">
                                    <input type="radio" :checked="uploadVideoObj.is_public === 1" @change="uploadVideoObj.is_public = 1">
                                    <span class="text-sm">Public</span>
                                 </div>
                                 <div class="flex items-center gap-2">
                                    <input type="radio" :checked="uploadVideoObj.is_public === 0" @change="uploadVideoObj.is_public = 0">
                                    <span class="text-sm">Private</span>
                                 </div>
                              </div>
                          </div>
                       </div>
                    </div>
                 </div>

                 <!-- Right: Preview & Progress -->
                 <div class="w-[300px] bg-[#F9F9F9] p-4 flex flex-col border-l border-[#E5E5E5]">
                    <div class="sticky top-0">
                       <div class="aspect-video bg-black rounded overflow-hidden mb-4 relative">
                          <video class="w-full h-full object-contain" v-if="uploadVideoObj.file" :src="uploadVideoObj.file ? URL.createObjectURL(uploadVideoObj.file) : ''" muted></video>
                          <div class="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] p-1 truncate">{{ uploadVideoObj.file.name }}</div>
                       </div>

                       <div class="bg-white p-3 border border-[#E5E5E5] rounded">
                          <div class="text-xs text-[#606060] mb-1">Video Link</div>
                          <div class="text-blue-600 text-sm truncate cursor-pointer hover:underline">https://youtu.be/...</div>
                       </div>

                       <div class="mt-6 text-xs text-[#606060]">
                          <div class="flex justify-between mb-1">
                             <span>{{ flagObj.uploading ? 'Uploading...' : 'Upload Status' }}</span>
                             <span>{{ uploadVideoObj.uploadPercent }}%</span>
                          </div>
                          <div class="h-1 bg-[#E5E5E5] w-full rounded-full overflow-hidden">
                             <div class="h-full bg-[#065FD4] transition-all duration-300" :style="{ width: uploadVideoObj.uploadPercent + '%' }"></div>
                          </div>
                          <p class="mt-2">{{ uploadVideoObj.uploadEvent.speed }} • {{ uploadVideoObj.uploadEvent.restTime }} left</p>
                       </div>
                    </div>
                 </div>
              </div>
           </div>

           <!-- Footer -->
           <div class="px-6 py-3 border-t border-[#E5E5E5] flex justify-between items-center bg-white" v-if="flagObj.selectVideo">
              <div class="flex items-center gap-2">
                 <i v-if="uploadVideoObj.uploadPercent === 100" class="el-icon-circle-check text-[#069C56]"></i>
                 <i v-else class="el-icon-loading text-[#065FD4]"></i>
                 <span class="text-sm text-[#606060]">{{ uploadVideoObj.uploadPercent === 100 ? 'Checks complete. No issues found.' : 'Uploading...' }}</span>
              </div>
              <div class="flex gap-2">
                  <button class="px-4 py-2 text-[#065FD4] font-medium text-sm uppercase" @click="closeUploadDrawer">Cancel</button>
                  <button class="px-6 py-2 bg-[#065FD4] text-white font-medium text-sm uppercase rounded-sm disabled:bg-[#CCCCCC] disabled:text-[#606060]" @click="handleSubmit('uploadVideo')" :disabled="!flagObj.uploadAble || flagObj.uploading">Next</button>
              </div>
           </div>
        </div>
      </a-modal>

      <!-- Edit Modal (Simple overlay) -->
      <a-modal v-model:open="showObj.modifyVideo" title="Video details" :width="800" @ok="handleSubmit('modifyVideo')">
         <div class="grid grid-cols-3 gap-6">
            <div class="col-span-2 space-y-4">
               <a-input v-model:value="modifyVideoObj.form.title" placeholder="Title (required)" />
               <a-textarea v-model:value="modifyVideoObj.form.description" :rows="5" placeholder="Description" />
               <div class="border p-4 rounded">
                  <span class="text-xs text-gray-500 block mb-2">Visibility</span>
                  <a-radio-group v-model:value="modifyVideoObj.form.is_public">
                     <a-radio :value="1">Public</a-radio>
                     <a-radio :value="0">Private</a-radio>
                  </a-radio-group>
               </div>
            </div>
            <div class="col-span-1">
               <div class="aspect-video bg-gray-100 mb-2 rounded overflow-hidden">
                  <img :src="api.videoServer + '/' + modifyVideoObj.form.oldthumbnail_path" class="w-full h-full object-cover" />
               </div>
               <a-button size="small" block @click="coverSelect">Change Thumbnail</a-button>
            </div>
         </div>
      </a-modal>
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
/* Specific overrides for Studio feel */
:deep(.studio-upload-modal .ant-modal-content) {
   padding: 0;
   border-radius: 6px;
}
:deep(.studio-upload-modal .ant-modal-body) {
   padding: 0;
}
</style>
