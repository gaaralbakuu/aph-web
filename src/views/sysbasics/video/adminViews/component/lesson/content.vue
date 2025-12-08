<template>
  <div class="videoManage-container">
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
      <a-drawer :visible="showObj.uploadVideo" class="upload-container" :title="l.uploadVideo" :width="800" @close="showObj.uploadVideo = false">
        <div class="form-container">
          <div class="video">
            <div class="plus-icon" v-if="!flagObj.selectVideo" @click="videoSelect">
              <i class="el-icon-upload" style="font-size: 30px"></i>
              <div>
                {{ l.selectVideo }}
              </div>
            </div>
            <div v-else class="video-card">
              <i class="el-icon-video-camera-solid" style="font-size: 50px; color: #55aaff; width: 100px; text-align: center"></i>
              <div class="video-info">
                <div class="video-oprate">
                  <div class="video-name text-clamp-1">
                    {{ uploadVideoObj.file.name }}
                  </div>
                  <div class="button">
                    <div>{{ uploadVideoObj.uploadPercent }}%</div>
                    <div class="video-icon">
                      <i class="el-icon-delete" @click="videoRemove(true)"></i>
                    </div>
                    <div class="video-icon">
                      <i class="el-icon-folder-opened" @click="videoSelect"></i>
                    </div>
                  </div>
                </div>
                <div class="status">
                  <span>{{ l.alreadyUploaded }}：{{ uploadVideoObj.uploadSize }} / {{ uploadVideoObj.size }}</span>
                  <span>{{ l.currentSpeed }}：{{ uploadVideoObj.uploadEvent.speed }}</span>
                  <span>{{ l.remainTime }}：{{ uploadVideoObj.uploadEvent.restTime }}</span>
                </div>
                <a-progress :percent="uploadVideoObj.uploadPercent" :show-info="false"></a-progress>
              </div>
            </div>
          </div>

          <div class="video-form">
            <a-form layout="vertical">
              <a-form-item :label="l.cover">
                <div v-if="coverObj.imageUrl == ''" class="cover">
                  <div class="plus-icon" @click="coverSelect('upload')">
                    <i class="el-icon-upload" style="font-size: 30px"></i>
                    <div>
                      {{ l.selectCover }}
                    </div>
                  </div>
                </div>
                <div v-else class="cover">
                  <img class="auto-img" :src="coverObj.imageUrl" height="150px" />
                  <div class="cover-oprate">
                    <i class="el-icon-zoom-in iconZoom" @click="coverPreview(coverObj.imageUrl)" :alt="l.preview"></i>
                    <i class="el-icon-refresh-left iconZoom" @click="drawCoverByFile(uploadVideoObj.file, Math.random(0, 1) * uploadVideoObj.duration)"></i>
                    <i class="el-icon-folder-opened iconZoom" @click="coverSelect('upload')"></i>
                  </div>
                </div>
              </a-form-item>
              <a-form-item :label="l.title">
                <a-input v-model:value="uploadVideoObj.name"></a-input>
              </a-form-item>

              <a-row :gutter="16">
                <a-col :span="18">
                  <a-form-item :label="l.college">
                    <a-select v-model:value="uploadVideoObj.college_id" :placeholder="l.selectCollegePd">
                      <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</a-select-option>
                    </a-select>
                    <span class="text-red-500 italic text-xs">* {{ c.required }}</span>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="l.republic">
                    <a-switch v-model:checked="uploadVideoObj.is_public" :checked-value="1" :un-checked-value="0"></a-switch>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item :label="l.introduce">
                <a-textarea v-model:value="uploadVideoObj.description" :placeholder="l.introducePd" :rows="4"></a-textarea>
                <span class="text-red-500 italic text-xs">* {{ c.required }}</span>
              </a-form-item>
            </a-form>
            <div
              :style="{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                borderTop: '1px solid #e8e8e8',
                padding: '10px 16px',
                textAlign: 'right',
                left: 0,
                background: '#fff',
                borderRadius: '0 0 4px 4px',
              }">
              <a-button type="primary" @click="handleSubmit('uploadVideo')" :disabled="!flagObj.uploadAble">{{ l.uploadVideo }}</a-button>
              <a-button danger @click="abortUploadVideo" :disabled="!flagObj.uploading">{{ l.giveup }}</a-button>
            </div>
          </div>
        </div>
      </a-drawer>

      <!-- Modify Video Drawer -->
      <a-drawer :visible="showObj.modifyVideo" class="upload-container" :title="l.modifyVideo" :width="800" @close="showObj.modifyVideo = false">
        <div class="form-container">
          <div class="video-form">
            <a-form layout="vertical">
              <a-form-item :label="l.cover">
                <div class="modifyCover">
                  <div class="cover">
                    <img class="auto-img" :src="api.videoServer + '/' + modifyVideoObj.form.oldthumbnail_path" height="150px" />
                    <div class="cover-oprate">
                      <i class="el-icon-zoom-in iconZoom" @click="coverPreview(api.videoServer + '/' + modifyVideoObj.form.oldthumbnail_path)"></i>
                    </div>
                  </div>
                  <div class="change"><i class="el-icon-right"></i></div>
                  <div>
                    <div v-if="coverObj.imageUrl == ''" class="cover">
                      <div class="plus-icon" @click="coverSelect('upload')">
                        <i class="el-icon-upload" style="font-size: 30px"></i>
                        <div>
                          {{ l.selectNewCover }}
                        </div>
                      </div>
                    </div>
                    <div v-else class="cover">
                      <img class="auto-img" :src="coverObj.imageUrl" height="150px" />
                      <div class="cover-oprate">
                        <i class="el-icon-zoom-in iconZoom" @click="coverPreview(coverObj.imageUrl)"></i>
                        <i class="el-icon-folder-opened iconRefresh" @click="coverSelect('upload')"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </a-form-item>
              <a-form-item :label="l.title">
                <a-input v-model:value="modifyVideoObj.form.title"></a-input>
              </a-form-item>
              <a-row :gutter="16">
                <a-col :span="18">
                  <a-form-item :label="l.college">
                    <a-select v-model:value="modifyVideoObj.form.college_id" :placeholder="l.selectCollegePd">
                      <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</a-select-option>
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="6">
                  <a-form-item :label="l.republic">
                    <a-switch v-model:checked="modifyVideoObj.form.is_public" :checked-value="1" :un-checked-value="0"></a-switch>
                  </a-form-item>
                </a-col>
              </a-row>
              <a-form-item :label="l.introduce">
                <a-textarea v-model:value="modifyVideoObj.form.description" :placeholder="l.introducePd" :rows="4"></a-textarea>
              </a-form-item>
            </a-form>
            <div class="buttonBar">
              <a-button type="primary" @click="handleSubmit('modifyVideo')">{{ l.updateVideo }}</a-button>
              <a-button danger @click="showObj.modifyVideo = false">{{ l.giveup }}</a-button>
            </div>
          </div>
        </div>
      </a-drawer>
    </div>

    <div class="pageBody">
      <div class="videoFilter">
        <div>
          <a-space>
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
          </a-space>
        </div>
        <div>
          <a-button type="primary" @click="uploadNewVideo">{{ l.uploadVideo }}</a-button>
        </div>
      </div>

      <div class="videoList">
        <div class="video-content">
          <div class="video-item" v-for="i in videoListObj.list" :key="i.id">
            <div class="cover">
              <img class="auto-img" :src="api.videoServer + '/' + i.thumbnail_path" height="130px" @click="coverPreview(api.videoServer + '/' + i.thumbnail_path)" />
            </div>
            <div class="content">
              <div class="video-name text-clamp-1">
                {{ i.title }}
                <span class="tag">
                  <a-tag>{{ i.is_public == 1 ? l.public : l.privite }}</a-tag>
                </span>
              </div>
              <div class="video-desc text-clamp-2">
                {{ l.introduce + '：' + i.description || l.noIntroduce }}
              </div>
              <div class="video-info">
                <span>{{ l.duration }}：{{ formatDuration(i.duration) }}</span>
              </div>
              <div class="video-info">
                <span>{{ l.create_user }}：{{ i.create_user }}</span>
                <span>{{ l.create_time }}：{{ i.create_time }}</span>
              </div>
            </div>

            <div class="play" v-show="i.url">
              <i class="el-icon-video-play" @click="previewVideo(i)"></i>
            </div>
            <div class="delete">
              <i class="el-icon-delete" @click="deleteVideo(i)"></i>
            </div>

            <div class="btn-right">
              <a-button type="primary" @click="beforeModifyVideo(i)">{{ l.edit }}</a-button>
            </div>
          </div>
        </div>
      </div>
      <a-pagination v-model:current="videoListObj.query.page" v-model:page-size="videoListObj.query.pageSize" :total="videoListObj.total" :page-size-options="['5', '10', '15', '30', '50', '100']" @change="handlePageChange" style="float: right; margin-top: 16px"></a-pagination>
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
      let uploadPart = progressEvent.loaded - uploadVideoObj.uploadEvent.uploadSize
      let uploadTime = (new Date().getTime() - uploadVideoObj.uploadEvent.oTime) / 1000
      let speed = uploadPart / uploadTime
      let restTime = (progressEvent.total - progressEvent.loaded) / speed
      uploadVideoObj.uploadEvent.speed = formatFileSize(speed) + '/s'
      uploadVideoObj.uploadEvent.restTime = formatSeconds(restTime, true)
      uploadVideoObj.uploadEvent.uploadSize = progressEvent.loaded
      uploadVideoObj.uploadEvent.oTime = new Date().getTime()
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

<style>
.videoManage-container {
  width: 100%;
  height: 100%;
}
.videoManage-container .upload-container .title {
  padding: 20px 0px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
}
.videoManage-container .upload-container .form-container {
  width: 100%;
  height: 95%;
  margin: 0 auto;
  background-color: #fff;
}
.videoManage-container .upload-container .form-container .video {
  width: 90%;
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0px auto 30px;
  border: 2px dashed #bbb;
  border-radius: 5px;
}
.videoManage-container .upload-container .form-container .video .plus-icon {
  color: #999;
  text-align: center;
  cursor: pointer;
}
.videoManage-container .upload-container .form-container .video .plus-icon:hover {
  color: #409fee;
}
.videoManage-container .upload-container .form-container .video .video-card {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.videoManage-container .upload-container .form-container .video .video-card .video-info {
  width: calc(100% - 80px);
}
.videoManage-container .upload-container .form-container .video .video-card .video-info .status {
  color: #999;
  margin: 5px 0px;
}
.videoManage-container .upload-container .form-container .video .video-card .video-info .status span {
  margin: 0 5px;
}
.videoManage-container .upload-container .form-container .video .video-card .video-info .video-oprate {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.videoManage-container .upload-container .form-container .video .video-card .video-info .video-oprate .video-name {
  font-size: 18px;
}
.videoManage-container .upload-container .form-container .video .video-card .video-info .video-oprate .button {
  font-size: 14px;
  display: flex;
  align-items: center;
}
.videoManage-container .upload-container .form-container .video .video-card .video-info .video-oprate .button .video-icon {
  width: 25px;
  height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #dddddd;
  border-radius: 50%;
  font-weight: bold;
}
.videoManage-container .upload-container .form-container .video .video-card .video-info .video-oprate .button div {
  margin: 0 5px;
}
.videoManage-container .upload-container .form-container .video .video-card .video-info .video-oprate .button div:nth-child(2):hover {
  color: darkred;
}
.videoManage-container .upload-container .form-container .video .video-card .video-info .video-oprate .button div:nth-child(3):hover {
  color: green;
}
.videoManage-container .upload-container .form-container .video-form {
  width: 95%;
  margin: 0 auto;
}
.videoManage-container .upload-container .form-container .video-form .modifyCover {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.videoManage-container .upload-container .form-container .video-form .modifyCover .change {
  text-align: center;
  color: #409fee;
  font-size: 50px;
}
.videoManage-container .upload-container .form-container .video-form .cover {
  position: relative;
  width: 260px;
  height: 150px;
  display: flex;
  align-items: center;
}
.videoManage-container .upload-container .form-container .video-form .cover .auto-img {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
}
.videoManage-container .upload-container .form-container .video-form .cover:hover .cover-oprate {
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
.videoManage-container .upload-container .form-container .video-form .cover:hover .cover-oprate .iconZoom {
  margin-top: 15%;
}
.videoManage-container .upload-container .form-container .video-form .cover:hover .cover-oprate .iconZoom:hover {
  color: #409fee;
}
.videoManage-container .upload-container .form-container .video-form .cover:hover .cover-oprate .iconRefresh {
  margin-top: 15%;
}
.videoManage-container .upload-container .form-container .video-form .cover:hover .cover-oprate .iconRefresh:hover {
  color: #00aa7f;
}
.videoManage-container .upload-container .form-container .video-form .cover .plus-icon {
  width: 140px;
  height: 140px;
  border: 2px dotted #ccc;
  border-radius: 5px;
  color: #999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
}
.videoManage-container .upload-container .form-container .video-form .cover .plus-icon:hover {
  color: #409fee;
}
.videoManage-container .upload-container .form-container .video-form .cover .cover-oprate {
  display: none;
}
.videoManage-container .upload-container .form-container .buttonBar {
  width: 95%;
  height: 60px;
  margin: 0 auto;
  padding: 0 15px;
  position: absolute;
  bottom: 0px;
  border-top: 1px solid #ccc;
  float: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.videoManage-container .pageBody {
  width: 100%;
  min-width: 1000px;
  height: 100%;
  margin: 0 auto;
  background-color: #fff;
}
.videoManage-container .pageBody .videoFilter {
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  padding: 14px;
  height: 60px;
}
.videoManage-container .pageBody .videoList {
  width: 100%;
  height: calc(100% - 100px);
}
.videoManage-container .pageBody .videoList .video-content {
  height: 100%;
  width: 100%;
  padding: 20px;
  overflow: scroll;
}
.videoManage-container .pageBody .videoList .video-content .video-item {
  width: 100%;
  height: 150px;
  padding: 10px;
  display: flex;
  align-items: center;
  border-bottom: 1px dashed #b4b4b4;
}
.videoManage-container .pageBody .videoList .video-content .video-item:hover {
  background-color: aliceblue;
}
.videoManage-container .pageBody .videoList .video-content .video-item:hover .delete {
  width: 50px;
  font-size: 20px;
  visibility: visible;
}
.videoManage-container .pageBody .videoList .video-content .video-item:hover .delete:hover {
  color: red;
  cursor: pointer;
}
.videoManage-container .pageBody .videoList .video-content .video-item:hover .play {
  width: 50px;
  font-size: 20px;
  visibility: visible;
}
.videoManage-container .pageBody .videoList .video-content .video-item:hover .play:hover {
  color: lightgreen;
  cursor: pointer;
}
.videoManage-container .pageBody .videoList .video-content .video-item .cover {
  width: 260px !important;
  height: 100%;
}
.videoManage-container .pageBody .videoList .video-content .video-item .cover .auto-img {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
}
.videoManage-container .pageBody .videoList .video-content .video-item .content {
  padding-left: 10px;
  width: calc(100% - 290px);
  height: 100%;
}
.videoManage-container .pageBody .videoList .video-content .video-item .content .video-name {
  height: 50px;
  line-height: 50px;
  font-size: 20px;
}
.videoManage-container .pageBody .videoList .video-content .video-item .content .video-name .tag {
  position: relative;
  top: -12px;
}
.videoManage-container .pageBody .videoList .video-content .video-item .content .video-desc {
  height: 40px;
  color: #999999;
}
.videoManage-container .pageBody .videoList .video-content .video-item .content .video-info {
  height: 20px;
  color: #999999;
}
.videoManage-container .pageBody .videoList .video-content .video-item .content .video-info span {
  margin-right: 10px;
}
.videoManage-container .pageBody .videoList .video-content .video-item .btn-right {
  text-align: center;
  width: 70px;
}
.videoManage-container .pageBody .videoList .video-content .video-item .delete,
.videoManage-container .pageBody .videoList .video-content .video-item .play {
  width: 30px;
  visibility: hidden;
}
</style>
