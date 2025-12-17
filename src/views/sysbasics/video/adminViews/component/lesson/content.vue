<template>
  <div class="flex flex-col flex-1 overflow-hidden">
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
      <a-drawer :visible="showObj.uploadVideo" :title="l.uploadVideo" :width="900" @close="showObj.uploadVideo = false">
        <div class="w-full h-full pb-24">
          <!-- Video Upload Area -->
          <div class="w-full mb-8">
            <div class="flex justify-center items-center">
              <div v-if="!flagObj.selectVideo" class="w-full h-56 border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all" @click="videoSelect">
                <i class="el-icon-upload text-5xl text-gray-400 mb-4"></i>
                <div class="text-lg text-gray-600 font-medium">{{ l.selectVideo }}</div>
                <div class="text-sm text-gray-400 mt-2">点击选择或拖拽视频文件</div>
              </div>
              <div v-else class="w-full bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <div class="flex items-start gap-4">
                  <i class="el-icon-video-camera-solid text-5xl text-blue-500 shrink-0"></i>
                  <div class="flex-1 overflow-hidden">
                    <div class="text-lg font-semibold text-gray-800 truncate">{{ uploadVideoObj.file.name }}</div>
                    <div class="text-sm text-gray-500 mt-1">{{ uploadVideoObj.size }}</div>
                    <div class="flex items-center gap-4 mt-3">
                      <div>
                        <div class="text-sm font-medium text-blue-600 w-12 text-center">{{ uploadVideoObj.uploadPercent }}%</div>
                      </div>
                      <div class="flex-1">
                        <a-progress :percent="uploadVideoObj.uploadPercent" :show-info="false"></a-progress>
                      </div>
                    </div>
                    <div class="mt-3 grid grid-cols-3 gap-3 text-xs text-gray-600">
                      <div class="flex items-center">
                        <i class="el-icon-upload text-blue-500 mr-2"></i>
                        <span>{{ uploadVideoObj.uploadSize }} / {{ uploadVideoObj.size }}</span>
                      </div>
                      <div class="flex items-center">
                        <i class="el-icon-d-arrow-right text-green-500 mr-2"></i>
                        <span>{{ uploadVideoObj.uploadEvent.speed }}</span>
                      </div>
                      <div class="flex items-center">
                        <i class="el-icon-time text-orange-500 mr-2"></i>
                        <span>{{ uploadVideoObj.uploadEvent.restTime }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button class="p-2 rounded-full bg-white hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors size-10" @click="videoRemove(true)" title="删除">
                      <i class="el-icon-delete text-xl"></i>
                    </button>
                    <button class="p-2 rounded-full bg-white hover:bg-green-50 text-green-500 hover:text-green-700 transition-colors size-10" @click="videoSelect" title="更换">
                      <i class="el-icon-folder-opened text-xl"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Cover Upload -->
          <div class="w-full mb-8">
            <h3 class="text-base font-semibold text-gray-800 mb-3">{{ l.cover }}</h3>
            <div v-if="coverObj.imageUrl == ''" class="w-40 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all" @click="coverSelect('upload')">
              <i class="el-icon-upload text-3xl text-gray-400 mb-2"></i>
              <div class="text-sm text-gray-600">{{ l.selectCover }}</div>
            </div>
            <div v-else class="relative w-40 h-32 rounded-lg overflow-hidden group">
              <img class="w-full h-full object-cover" :src="coverObj.imageUrl" />
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-around items-center">
                <button class="p-2 rounded-full bg-white text-gray-800 hover:bg-blue-500 hover:text-white transition-colors size-10" @click="coverPreview(coverObj.imageUrl)" title="预览">
                  <i class="el-icon-zoom-in"></i>
                </button>
                <button class="p-2 rounded-full bg-white text-gray-800 hover:bg-green-500 hover:text-white transition-colors size-10" @click="drawCoverByFile(uploadVideoObj.file, Math.random(0, 1) * uploadVideoObj.duration)" title="刷新">
                  <i class="el-icon-refresh-left"></i>
                </button>
                <button class="p-2 rounded-full bg-white text-gray-800 hover:bg-orange-500 hover:text-white transition-colors size-10" @click="coverSelect('upload')" title="更换">
                  <i class="el-icon-folder-opened"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Form Fields -->
          <div class="w-full space-y-4">
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ l.title }}
                <span class="text-red-500">*</span>
              </label>
              <a-input v-model:value="uploadVideoObj.name" :placeholder="l.title" class="w-full"></a-input>
            </div>

            <!-- College & Public Switch -->
            <div class="grid grid-cols-3 gap-4">
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ l.college }}
                  <span class="text-red-500">*</span>
                </label>
                <a-select v-model:value="uploadVideoObj.college_id" :placeholder="l.selectCollegePd" class="w-full">
                  <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</a-select-option>
                </a-select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ l.republic }}</label>
                <a-switch v-model:checked="uploadVideoObj.is_public" :checked-value="1" :un-checked-value="0"></a-switch>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ l.introduce }}
                <span class="text-red-500">*</span>
              </label>
              <a-textarea v-model:value="uploadVideoObj.description" :placeholder="l.introducePd" :rows="3" class="w-full"></a-textarea>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="absolute bottom-0 right-0 w-full pr-8 pb-6 pt-4 bg-white border-t border-gray-200 flex justify-end items-center gap-3">
            <a-button @click="showObj.uploadVideo = false" class="px-6">{{ c.cancel }}</a-button>
            <a-button type="primary" @click="handleSubmit('uploadVideo')" :disabled="!flagObj.uploadAble" :loading="flagObj.uploading" class="px-6">
              <i class="el-icon-upload mr-2"></i>
              {{ l.uploadVideo }}
            </a-button>
            <a-button v-if="flagObj.uploading" danger @click="abortUploadVideo" class="px-6">{{ l.giveup }}</a-button>
          </div>
        </div>
      </a-drawer>

      <!-- Modify Video Drawer -->
      <a-drawer :visible="showObj.modifyVideo" :title="l.modifyVideo" :width="800" :body-style="{ paddingBottom: '100px' }" @close="showObj.modifyVideo = false">
        <!-- Cover Comparison -->
        <div class="w-full mb-8">
          <h3 class="text-base font-semibold text-gray-800 mb-4">{{ l.cover }}</h3>
          <div class="flex items-center gap-6">
            <!-- Old Cover -->
            <div class="flex flex-col items-center">
              <div class="relative w-44 h-32 rounded-lg overflow-hidden group mb-2">
                <img class="w-full h-full object-cover" :src="api.videoServer + '/' + modifyVideoObj.form.oldthumbnail_path" />
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center">
                  <button class="p-2 rounded-full bg-white text-gray-800 hover:bg-blue-500 hover:text-white transition-colors" @click="coverPreview(api.videoServer + '/' + modifyVideoObj.form.oldthumbnail_path)">
                    <i class="el-icon-zoom-in"></i>
                  </button>
                </div>
              </div>
              <span class="text-xs text-gray-500">{{ l.oldCover }}</span>
            </div>

            <!-- Arrow -->
            <div class="text-3xl text-blue-500 mt-4">
              <i class="el-icon-right"></i>
            </div>

            <!-- New Cover -->
            <div class="flex flex-col items-center">
              <div v-if="coverObj.imageUrl == ''" class="w-44 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all mb-2" @click="coverSelect('upload')">
                <i class="el-icon-upload text-3xl text-gray-400 mb-2"></i>
                <div class="text-sm text-gray-600">{{ l.selectNewCover }}</div>
              </div>
              <div v-else class="relative w-44 h-32 rounded-lg overflow-hidden group mb-2">
                <img class="w-full h-full object-cover" :src="coverObj.imageUrl" />
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-around items-center">
                  <button class="p-2 rounded-full bg-white text-gray-800 hover:bg-blue-500 hover:text-white transition-colors" @click="coverPreview(coverObj.imageUrl)">
                    <i class="el-icon-zoom-in"></i>
                  </button>
                  <button class="p-2 rounded-full bg-white text-gray-800 hover:bg-green-500 hover:text-white transition-colors" @click="coverSelect('upload')">
                    <i class="el-icon-folder-opened"></i>
                  </button>
                </div>
              </div>
              <span class="text-xs text-gray-500">{{ l.newCover }}</span>
            </div>
          </div>
        </div>

        <!-- Form Fields -->
        <div class="w-full space-y-5">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ l.title }}</label>
            <a-input v-model:value="modifyVideoObj.form.title" :placeholder="l.title" class="w-full"></a-input>
          </div>

          <!-- College & Public Switch -->
          <div class="grid grid-cols-3 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ l.college }}</label>
              <a-select v-model:value="modifyVideoObj.form.college_id" :placeholder="l.selectCollegePd" class="w-full">
                <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</a-select-option>
              </a-select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ l.republic }}</label>
              <a-switch v-model:checked="modifyVideoObj.form.is_public" :checked-value="1" :un-checked-value="0"></a-switch>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ l.introduce }}</label>
            <a-textarea v-model:value="modifyVideoObj.form.description" :placeholder="l.introducePd" :rows="3" class="w-full"></a-textarea>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="absolute bottom-0 right-0 w-full pr-8 pb-6 pt-4 bg-white border-t border-gray-200 flex justify-end items-center gap-3">
          <a-button @click="showObj.modifyVideo = false">{{ c.cancel }}</a-button>
          <a-button type="primary" @click="handleSubmit('modifyVideo')">
            <i class="el-icon-document-copy mr-1"></i>
            {{ l.updateVideo }}
          </a-button>
        </div>
      </a-drawer>
    </div>

    <div class="flex-1 flex flex-col overflow-hidden">
      <div class="flex justify-between border-b border-gray-200 px-4 py-3 h-16">
        <div class="flex items-center gap-6">
          <div class="flex items-center gap-2">
            <div>
              <span class="mr-2">{{ l.college }}</span>
              <a-select v-model:value="videoListObj.query.college_id" :placeholder="l.notAdmin" style="width: 150px" clearable allow-clear>
                <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</a-select-option>
              </a-select>
            </div>
            <div>
              <span class="mr-2">{{ l.title }}</span>
              <a-input v-model:value="videoListObj.query.title" style="width: 150px" clearable allow-clear @change="getVideoList" @pressEnter="getVideoList"></a-input>
            </div>
            <div>
              <span class="mr-2">{{ l.republic }}</span>
              <a-select v-model:value="videoListObj.query.is_public" :disabled="!isAdmin && videoListObj.query.college_id == ''" style="width: 100px" @change="getVideoList">
                <a-select-option value="">{{ c.all }}</a-select-option>
                <a-select-option :value="1">{{ l.public }}</a-select-option>
                <a-select-option :value="0">{{ l.privite }}</a-select-option>
              </a-select>
            </div>
            <div>
              <span class="mr-2">{{ l.TransformFormat }}</span>
              <a-select v-model:value="videoListObj.query.status" style="width: 100px" @change="getVideoList">
                <a-select-option value="">{{ c.all }}</a-select-option>
                <a-select-option value="pengding">{{ l.pengding }}</a-select-option>
                <a-select-option value="Completed">{{ l.Completed }}</a-select-option>
                <a-select-option value="Faild">{{ l.Faild }}</a-select-option>
              </a-select>
            </div>
            <a-button type="primary" @click="getVideoList">{{ l.search }}</a-button>
          </div>
        </div>
        <div class="flex items-center gap-4">
          <a-button type="primary" @click="uploadNewVideo">{{ l.uploadVideo }}</a-button>
        </div>
      </div>

      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Video List Container -->
        <div class="overflow-y-auto bg-gray-50 flex-1">
          <div v-if="videoListObj.list.length === 0" class="flex flex-col items-center justify-center h-96">
            <i class="el-icon-document text-6xl text-gray-300 mb-4"></i>
            <p class="text-gray-500 text-lg">{{ c.noData }}</p>
          </div>
          <div v-else class="space-y-4 p-6">
            <!-- Video Item Card -->
            <div v-for="i in videoListObj.list" :key="i.id" class="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100 overflow-hidden">
              <div class="flex h-40">
                <!-- Thumbnail -->
                <div class="relative w-56 h-40 shrink-0 bg-gray-900 overflow-hidden group">
                  <img class="w-full h-full object-cover cursor-pointer" :src="api.videoServer + '/' + i.thumbnail_path" @click="coverPreview(api.videoServer + '/' + i.thumbnail_path)" />
                  <!-- Hover overlay with play button -->
                  <div class="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                    <button v-if="i.url" class="opacity-0 group-hover:opacity-100 transition-opacity w-16 h-16 rounded-full bg-white bg-opacity-90 hover:bg-opacity-100 flex items-center justify-center shadow-lg" @click="previewVideo(i)">
                      <i class="el-icon-video-play text-3xl text-blue-500"></i>
                    </button>
                  </div>
                </div>

                <!-- Content -->
                <div class="grow flex flex-col justify-between p-4">
                  <!-- Title and Tag -->
                  <div>
                    <div class="flex items-center gap-2 mb-2">
                      <h3 class="text-lg font-semibold text-gray-800 line-clamp-1 grow">{{ i.title }}</h3>
                      <a-tag :color="i.is_public == 1 ? 'blue' : 'orange'">
                        {{ i.is_public == 1 ? l.public : l.privite }}
                      </a-tag>
                    </div>
                    <!-- Description -->
                    <p class="text-sm text-gray-600 line-clamp-2">{{ i.description || l.noIntroduce }}</p>
                  </div>

                  <!-- Info Row -->
                  <div class="grid grid-cols-3 gap-4 text-xs text-gray-500">
                    <div class="flex items-center space-x-1">
                      <i class="el-icon-time text-blue-500"></i>
                      <span>{{ formatDuration(i.duration) }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <i class="el-icon-user text-green-500"></i>
                      <span>{{ i.create_user }}</span>
                    </div>
                    <div class="flex items-center space-x-1">
                      <i class="el-icon-document text-orange-500"></i>
                      <span>{{ i.create_time }}</span>
                    </div>
                  </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-col items-center justify-center gap-2 px-4 py-4 border-l border-gray-100 bg-gray-50 group">
                  <button class="p-2.5 rounded-lg text-gray-600 hover:text-blue-600 hover:bg-blue-200 transition-colors" @click="beforeModifyVideo(i)" title="编辑">
                    <i class="el-icon-edit text-lg"></i>
                  </button>
                  <button class="p-2.5 rounded-lg text-gray-600 hover:text-red-600 hover:bg-red-200 transition-colors" @click="deleteVideo(i)" title="删除">
                    <i class="el-icon-delete text-lg"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="bg-white border-t border-gray-200 px-6 py-4 flex justify-between items-center">
          <div class="text-sm text-gray-600">{{ l.total }}：{{ videoListObj.total }}</div>
          <a-pagination v-model:current="videoListObj.query.page" v-model:page-size="videoListObj.query.pageSize" :total="videoListObj.total" :page-size-options="['5', '10', '15', '30', '50', '100']" :show-size-changer="true" @change="handlePageChange"></a-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch, onMounted, onBeforeUnmount, ref, getCurrentInstance } from 'vue'
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
        coverObj.imageUrl = ''
        coverObj.file = ''
        coverInput.value.value = ''
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

// Lifecycle
onMounted(() => {
  getCollegeList()
})

onBeforeUnmount(() => {
  if (videoPlayerRef.value) {
    videoPlayerRef.value.onDestroy()
  }
})
</script>

<style scoped>
/* Tùy chỉnh CSS không thể tạo bằng Tailwind class */

/* Vị trí tuyệt đối cho auto-img và cover */
.auto-img {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
}

/* Các class cũ nếu còn sử dụng trong template */
.cover-oprate {
  display: none;
}

.cover:hover .cover-oprate {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: rgba(167, 167, 167, 0.7);
  color: white;
  font-size: 30px;
}

.iconZoom {
  margin-top: 15%;
}

.iconZoom:hover {
  color: #409fee;
}

.iconRefresh {
  margin-top: 15%;
}

.iconRefresh:hover {
  color: #00aa7f;
}

/* Nếu có old video list structure */
.video-item .delete,
.video-item .play {
  visibility: hidden;
}

.video-item:hover .delete,
.video-item:hover .play {
  visibility: visible;
  width: 50px;
  font-size: 20px;
}

.video-item:hover .delete:hover {
  color: red;
  cursor: pointer;
}

.video-item:hover .play:hover {
  color: lightgreen;
  cursor: pointer;
}
</style>
