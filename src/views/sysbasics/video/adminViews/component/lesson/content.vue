<template>
  <div class="videoManage-container">
    <div class="components">
      <input ref="videoInput" type="file" @change="videoChange" style="display: none" accept="video/*" />
      <input ref="coverInput" type="file" @change="uploadCoverChange" style="display: none" accept="image/*" />
      <el-dialog :visible.sync="showObj.coverDialog" :title="$l.preview">
        <img width="100%" :src="coverObj.dialogImageUrl" alt="" fit="fill" />
      </el-dialog>

      <el-dialog :visible.sync="showObj.previewVideo" :title="$l.preview" :before-close="videoClose">
        <div style="width: 100%; aspect-ratio: 1.8">
          <videoPlayer ref="videoPlayer" :src="showObj.videoUrl"></videoPlayer>
        </div>
      </el-dialog>

      <el-drawer class="upload-container" :visible.sync="showObj.uploadVideo" :wrapperClosable="false" size="50%">
        <div slot="title" class="title">{{ $l.uploadVideo }}</div>
        <div class="form-container">
          <div class="video">
            <div class="plus-icon" v-if="!flagObj.selectVideo" @click="videoSelect">
              <i class="el-icon-upload" style="font-size: 30px"></i>
              <div>
                {{ $l.selectVideo }}
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
                  <span>{{ $l.alreadyUploaded }}：{{ uploadVideoObj.uploadSize }} / {{ uploadVideoObj.size }}</span>
                  <span>{{ $l.currentSpeed }}：{{ uploadVideoObj.uploadEvent.speed }}</span>
                  <span>{{ $l.remainTime }}：{{ uploadVideoObj.uploadEvent.restTime }}</span>
                </div>
                <el-progress :percentage="uploadVideoObj.uploadPercent" :show-text="false"></el-progress>
              </div>
            </div>
          </div>

          <div class="video-form">
            <el-form label-width="80px" size="medium">
              <el-form-item :label="$l.cover">
                <div v-if="coverObj.imageUrl == ''" class="cover">
                  <div class="plus-icon" @click="coverSelect('upload')">
                    <i class="el-icon-upload" style="font-size: 30px"></i>
                    <div>
                      {{ $l.selectCover }}
                    </div>
                  </div>
                </div>
                <div v-else class="cover">
                  <img class="auto-img" :src="coverObj.imageUrl" height="150px" />
                  <div class="cover-oprate">
                    <i class="el-icon-zoom-in iconZoom" @click="coverPreview(coverObj.imageUrl)" :alt="$l.preview"></i>
                    <i class="el-icon-refresh-left iconZoom" @click="drawCoverByFile(uploadVideoObj.file, Math.random(0, 1) * uploadVideoObj.duration)"></i>
                    <i class="el-icon-folder-opened iconZoom" @click="coverSelect('upload')"></i>
                  </div>
                </div>
              </el-form-item>
              <el-form-item :label="$l.title">
                <el-input v-model="uploadVideoObj.name"></el-input>
              </el-form-item>
              <!-- <el-form-item :label="$l.type">
              视频类型已隐藏
                <el-input v-model="uploadVideoObj.type"></el-input>
              </el-form-item> -->

              <el-row :gutter="16">
                <el-col :span="18">
                  <el-form-item :label="$l.college">
                    <el-select v-model="uploadVideoObj.college_id" :placeholder="$l.selectCollegePd" style="width: 100%">
                      <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label" :value="i.id"></el-option>
                    </el-select>
                    <span class="text-red-500 italic text-xs">* {{ $c.required }}</span>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="$l.republic">
                    <el-switch v-model="uploadVideoObj.is_public" active-color="#13ce66" :active-value="1" :inactive-value="0"></el-switch>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item :label="$l.introduce">
                <el-input v-model="uploadVideoObj.description" type="textarea" :placeholder="$l.introducePd" :rows="4"></el-input>
                <span class="text-red-500 italic text-xs">* {{ $c.required }}</span>
              </el-form-item>
            </el-form>
            <div class="buttonBar">
              <el-button type="primary" @click="handleSubmit('uploadVideo')" :disabled="!flagObj.uploadAble">{{ $l.uploadVideo }}</el-button>
              <el-button type="danger" @click="abortUploadVideo" :disabled="!flagObj.uploading">{{ $l.giveup }}</el-button>
            </div>
          </div>
        </div>
      </el-drawer>

      <el-drawer class="upload-container" :visible.sync="showObj.modifyVideo" :wrapperClosable="false" size="50%">
        <div slot="title" class="title">{{ $l.modifyVideo }}</div>
        <div class="form-container">
          <div class="video-form">
            <el-form label-width="80px" size="medium">
              <el-form-item :label="$l.cover">
                <div class="modifyCover">
                  <div class="cover">
                    <img class="auto-img" :src="$api.videoServer + '/' + modifyVideoObj.form.oldthumbnail_path" height="150px" />
                    <div class="cover-oprate">
                      <i class="el-icon-zoom-in iconZoom" @click="coverPreview($api.videoServer + '/' + modifyVideoObj.form.oldthumbnail_path)"></i>
                    </div>
                  </div>
                  <div class="change"><i class="el-icon-right"></i></div>
                  <div>
                    <div v-if="coverObj.imageUrl == ''" class="cover">
                      <div class="plus-icon" @click="coverSelect('upload')">
                        <i class="el-icon-upload" style="font-size: 30px"></i>
                        <div>
                          {{ $l.selectNewCover }}
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
              </el-form-item>
              <el-form-item :label="$l.title">
                <el-input v-model="modifyVideoObj.form.title"></el-input>
              </el-form-item>
              <!-- <el-form-item :label="$l.type">
                <el-input v-model="modifyVideoObj.form.type"></el-input>
              </el-form-item> -->
              <el-row :gutter="16">
                <el-col :span="18">
                  <el-form-item :label="$l.college">
                    <el-select v-model="modifyVideoObj.form.college_id" :placeholder="$l.selectCollegePd" style="width: 100%">
                      <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label" :value="i.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="6">
                  <el-form-item :label="$l.republic">
                    <el-switch v-model="modifyVideoObj.form.is_public" active-color="#13ce66" :active-value="1" :inactive-value="0"></el-switch>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-form-item :label="$l.introduce">
                <el-input v-model="modifyVideoObj.form.description" type="textarea" :placeholder="$l.introducePd" :rows="4"></el-input>
              </el-form-item>
            </el-form>
            <div class="buttonBar">
              <el-button type="primary" @click="handleSubmit('modifyVideo')">{{ $l.updateVideo }}</el-button>
              <el-button type="danger" @click="showObj.modifyVideo = false">{{ $l.giveup }}</el-button>
            </div>
          </div>
        </div>
      </el-drawer>
    </div>

    <div class="pageBody">
      <div class="videoFilter">
        <div>
          <el-form inline>
            <el-form-item :label="$l.college">
              <el-select v-model="videoListObj.query.college_id" :placeholder="$l.notAdmin" clearable>
                <el-option v-for="i in publicCodeObj.collegeList" :key="i.id" :label="i.name_label" :value="i.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item :label="$l.title">
              <el-input v-model="videoListObj.query.title" clearable @clear="getVideoList" @keyup.native.enter="getVideoList"></el-input>
            </el-form-item>
            <el-form-item :label="$l.republic">
              <el-select v-model="videoListObj.query.is_public" :disabled="!isAdmin && videoListObj.query.college_id == ''" style="width: 100px" @change="getVideoList">
                <el-option :label="$c.all" value=""></el-option>
                <el-option :label="$l.public" :value="1"></el-option>
                <el-option :label="$l.privite" :value="0"></el-option>
              </el-select>
            </el-form-item>
            <!-- <el-form-item label="视频类型">
            已隐藏
              <el-input v-model="videoListObj.query.type" clearable @clear='getVideoList'
                @keyup.native.enter="getVideoList"></el-input>
            </el-form-item> -->
            <el-form-item :label="$l.TransformFormat">
              <el-select v-model="videoListObj.query.status" style="width: 100px" @change="getVideoList">
                <el-option :label="$c.all" value=""></el-option>
                <el-option :label="$l.pengding" value="pengding"></el-option>
                <el-option :label="$l.Completed" value="Completed"></el-option>
                <el-option :label="$l.Faild" value="Faild"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="getVideoList">{{ $l.search }}</el-button>
            </el-form-item>
          </el-form>
        </div>
        <div>
          <el-button type="primary" @click="uploadNewVideo">{{ $l.uploadVideo }}</el-button>
        </div>
      </div>

      <div class="videoList">
        <div class="video-content">
          <div class="video-item" v-for="i in videoListObj.list" :key="i.id">
            <div class="cover">
              <img class="auto-img" :src="$api.videoServer + '/' + i.thumbnail_path" height="130px" @click="coverPreview($api.videoServer + '/' + i.thumbnail_path)" />
            </div>
            <div class="content">
              <div class="video-name text-clamp-1">
                {{ i.title }}
                <span class="tag">
                  <el-tag size="mini">{{ i.is_public == 1 ? $l.public : $l.privite }}</el-tag>
                </span>
              </div>
              <div class="video-desc text-clamp-2">
                {{ $l.introduce + '：' + i.description || $l.noIntroduce }}
              </div>
              <div class="video-info">
                <span>{{ $l.duration }}：{{ formatDuration(i.duration) }}</span>
                <!-- <span>视频归属：{{returnCollegeName(i.college_id)}}</span> -->
              </div>
              <div class="video-info">
                <span>{{ $l.create_user }}：{{ i.create_user }}</span>
                <span>{{ $l.create_time }}：{{ i.create_time }}</span>
              </div>
            </div>

            <div class="play" v-show="i.url">
              <i class="el-icon-video-play" @click="previewVideo(i)"></i>
            </div>
            <div class="delete">
              <i class="el-icon-delete" @click="deleteVideo(i)"></i>
            </div>

            <div class="btn-right">
              <el-button type="primary" plain @click="beforeModifyVideo(i)">{{ $l.edit }}</el-button>
            </div>
          </div>
        </div>
      </div>
      <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="videoListObj.query.page" :page-sizes="[5, 10, 15, 30, 50, 100]" :page-size="videoListObj.query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="videoListObj.total" style="float: right"></el-pagination>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import videoPlayer from '@/components/videoPlayer/VideoPlayerPlyr.vue'

let axiosController

export default {
  name: 'videoAdminContent',
  components: {
    videoPlayer,
  },
  data() {
    return {
      coverObj: {
        dialogImageUrl: '',
        imageUrl: '',
        file: {
          //选择的视频文件信息
          name: '',
        },
      },
      uploadVideoObj: {
        id: '',
        name: '', //视频名称
        duration: '',
        type: '', //视频类型
        college_id: '', //所属学院
        is_public: '', //是否为公开课
        size: 0, //视频大小
        uploadSize: '0 B', //已上传大小
        uploadPercent: 0, //已上传比例
        uploadEvent: {
          //axios上传事件
          uploadSize: 0,
          speed: '0 B/s',
          oTime: 0,
          restTime: this.$l.notStart,
        },
        thumbnail: '', //选择的封面
        thumbnail_path: '', //封面上传后端后回传的路径
        description: '', //视频简介
        file: {
          //选择的视频文件信息
          name: '',
        },
      },
      modifyVideoObj: {
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
      },
      videoListObj: {
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
      },
      flagObj: {
        selectVideo: false, //用户是否选择了视频
        uploadAble: false, //视频是否可以上传
        uploading: false, //视频处于上传过程中
      },
      showObj: {
        videoUrl: '',
        uploadVideo: false, //选择上传视频抽屉弹窗
        modifyVideo: false, //编辑视频信息
        coverDialog: false, //预览图片
        previewVideo: false, //预览视频
      },

      publicCodeObj: {
        collegeList: [],
      },
    }
  },

  computed: {
    ...mapGetters(['isAdmin']),
  },

  watch: {
    'videoListObj.query.college_id'(newVal, oldVal) {
      if (newVal && oldVal === '') {
        this.videoListObj.query.is_public = ''
      }
      if (!this.isAdmin) {
        if (newVal == '') {
          this.videoListObj.query.is_public = 1
        }
      }
      this.getVideoList()
    },
  },

  methods: {
    returnCollegeName(id) {
      let college = this.publicCodeObj.collegeList.find((i) => i.id == id)
      if (college) {
        return college.name_label
      } else {
        return id
      }
    },

    uploadNewVideo() {
      this.uploadVideoObj = {
        id: '',
        name: '', //视频名称
        duration: '',
        type: '', //视频类型
        college_id: this.isAdmin ? '' : this.publicCodeObj.collegeList[0].id, //所属学院
        is_public: 0, //是否为公开课
        size: 0, //视频大小
        uploadSize: '0 B', //已上传大小
        uploadPercent: 0, //已上传比例
        uploadEvent: {
          //axios上传事件
          uploadSize: 0,
          speed: '0 B/s',
          oTime: 0,
          restTime: this.$l.notStart,
        },
        thumbnail: '', //选择的封面
        thumbnail_path: '', //封面上传后端后回传的路径
        description: '', //视频简介
        file: {
          //选择的视频文件信息
          name: '',
        },
      }
      this.showObj.uploadVideo = true
    },

    handleSizeChange(i) {
      this.videoListObj.query.pageSize = i
      this.getVideoList()
    },

    handlePageChange(i) {
      this.videoListObj.query.page = i
      this.getVideoList()
    },

    previewVideo(i) {
      if (i.url) {
        this.showObj.videoUrl = this.$api.videoServer + i.url
      }
      this.showObj.previewVideo = true
    },
    videoClose() {
      this.$refs.videoPlayer.onPause()
      this.showObj.previewVideo = false
    },

    handleSubmit(type) {
      if (type == 'uploadVideo') {
        if (!this.uploadVideoObj.file) {
          return this.$message.error(this.$l.plsSelectVideo)
        }

        if (!this.uploadVideoObj.name) {
          return this.$message.error(this.$l.plsInputTitle)
        }

        if (!this.uploadVideoObj.type) {
          this.uploadVideoObj.type = 'Video'
          //return this.$message.error(this.$l.plsSelectType)
        }

        if (!this.uploadVideoObj.description) {
          return this.$message.error(this.$l.plsInputDesc)
        }

        if (!this.uploadVideoObj.college_id) {
          return this.$message.error(this.$l.plsSelectCollege)
        }

        this.uploadCover(type)
      } else if (type == 'modifyVideo') {
        if (!this.modifyVideoObj.form.title) {
          return this.$message.error(this.$l.plsInputTitle)
        }

        if (!this.modifyVideoObj.form.type) {
          return this.$message.error(this.$l.plsSelectType)
        }

        if (!this.modifyVideoObj.form.description) {
          return this.$message.error(this.$l.plsSelectCollege)
        }

        if (!this.coverObj.file.name) {
          //没有选择封面，直接修改视频信息
          this.modifyVideo()
        } else {
          //有选择新封面，先上传封面
          this.uploadCover(type)
        }
      }
    },

    getCollegeList() {
      // 根据页面路由获取管理学院
      this.$request(this.$api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
        resource_path: this.$route.path,
      })
        .then((r) => {
          this.publicCodeObj.collegeList = r.data
          this.videoListObj.query.college_id = r.data[0].id
          // this.getVideoList()
        })
        .catch((e) => {
          this.$message.error(e.message)
        })
    },

    /*********   视频封面  start   *********/

    coverSelect(filed) {
      this.$refs.coverInput.click()
    },

    coverPreview(url) {
      if (!url) return
      this.coverObj.dialogImageUrl = url
      this.showObj.coverDialog = true
    },

    uploadCoverChange(e) {
      let file = e.target.files[0]
      if (!file) return
      // 使用 FileReader 读取文件
      let reader = new FileReader()
      reader.onload = (r) => {
        this.coverObj.imageUrl = r.target.result // 将读取的结果赋值给 imageUrl
      }
      reader.readAsDataURL(file) // 读取文件为 Data URL
      this.coverObj.file = file
    },

    uploadCover(next) {
      //上传封面
      let formData = new FormData()
      formData.append('formFile', this.coverObj.file)
      this.$request(this.$api.videoServer + '/Video/VideoManage/uploadPicture', formData, 'post')
        .then((r) => {
          if (r.httpCode == 200 && r.data.url) {
            if (next == 'uploadVideo') {
              this.uploadVideoObj.thumbnail_path = r.data.url
              this.uploadVideo()
            } else if (next == 'modifyVideo') {
              this.modifyVideoObj.form.thumbnail_path = r.data.url
              this.modifyVideo()
            }
            this.coverObj = {
              dialogImageUrl: '',
              imageUrl: '',
              file: '',
            }
            this.$refs.coverInput.value = '' //清空文件选择的内容
          }
        })
        .catch((e) => {
          // this.uploadStatus = e.message
        })
    },

    /*********   视频封面  end   *********/

    /*********   视频上传  start   *********/

    videoSelect() {
      //模拟点击，打开window文件选择器
      this.$refs.videoInput.click()
    },

    videoChange(e) {
      //选择视频文件变更
      this.videoRemove()
      let file = e.target.files[0]

      this.uploadVideoObj.file = file

      if (file.type.split('/')[0] !== 'video') {
        this.videoRemove(true)
        return this.$message.error(this.$l.plsSelectVideo)
      } else {
        this.flagObj.selectVideo = true
        this.flagObj.uploadAble = true
        this.flagObj.uploading = false
      }

      this.uploadVideoObj.name = file.name.split('.')[0]
      // this.uploadVideoObj.type = file.type.split('/')[0]
      this.uploadVideoObj.size = this.formatFileSize(file.size)

      this.drawCoverByFile(file)
    },

    drawCoverByFile(videoFile, time = 0) {
      let that = this
      if (videoFile) {
        let video = document.createElement('video')
        video.currentTime = time // 设置视频停留到指定时间帧
        video.preload = 'auto' // 只预加载元数据
        video.muted = true
        video.autoplay = true // 设置视频加载完后自动播放，这样才能加载到指定时间的画面
        video.src = URL.createObjectURL(videoFile) // 创建对象URL指向文件
        video.oncanplay = function () {
          that.uploadVideoObj.duration = video.duration
          let canvas = document.createElement('canvas')
          // 在视频数据加载完成后执行
          canvas.width = video.videoWidth
          canvas.height = video.videoHeight
          let ctx = canvas.getContext('2d')
          ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
          let imgDataUrl = canvas.toDataURL('image/png')
          that.coverObj.imageUrl = imgDataUrl
          fetch(imgDataUrl)
            .then((res) => res.blob())
            .then((blob) => {
              let coverFile = new File([blob], that.uploadVideoObj.name + '.png', {
                type: 'image/png',
              })
              that.coverObj.file = coverFile
            })
        }
      }
    },

    rightCheck(i, tosat = false) {
      if (this.isAdmin) {
        return true
      } else {
        if (this.publicCodeObj.collegeList.some((c) => c.id == i.college_id)) {
          return true
        } else {
          if (toast) {
            this.$message({
              type: 'error',
              message: this.$l.noRightToEdit,
            })
          }
          return false
        }
      }
    },

    beforeModifyVideo(i) {
      if (this.rightCheck(i, true)) {
        this.modifyVideoObj.form = {
          id: i.id,
          title: i.title,
          type: i.type,
          college_id: i.college_id,
          is_public: i.is_public,
          oldthumbnail_path: i.thumbnail_path,
          thumbnail_path: '',
          description: i.description,
        }
        ;(this.coverObj = {
          dialogImageUrl: '',
          imageUrl: '',
          file: {
            //选择的视频文件信息
            name: '',
          },
        }),
          (this.showObj.modifyVideo = true)
      }
    },

    modifyVideo() {
      if (!this.modifyVideoObj.form.thumbnail_path) {
        //没有选择更新封面的情况，把旧封面作为保留
        this.modifyVideoObj.form.thumbnail_path = this.modifyVideoObj.form.oldthumbnail_path
      }
      this.$request(this.$api.videoServer + '/Video/VideoManage/modifyVideoInfo', this.modifyVideoObj.form, 'post')
        .then((r) => {
          if (r.httpCode == 200) {
            this.$message({
              type: 'success',
              message: this.$l.updateSuccess,
            })
            let timer = setTimeout(() => {
              this.showObj.modifyVideo = false
              this.getVideoList()
              clearTimeout(timer)
            }, 1500)
          }
        })
        .catch((e) => {
          this.$message.error(e.message)
          console.log(e)
        })
    },

    deleteVideo(i) {
      if (this.rightCheck(i, true)) {
        this.$prompt(`《${i.title}》` + this.$l.deleteVideoConfirm, {
          type: 'warning',
          inputPattern: /^[Y]{1}$/i,
          inputErrorMessage: this.$l.inputErrorMessage,
          confirmButtonText: this.$l.confirmtext,
          cancelButtonText: this.$l.cancelText,
        })
          .then(() => {
            this.$request(
              this.$api.videoServer + '/Video/VideoManage/deleteVideo',
              {
                id: i.id,
              },
              'post'
            ).then((r) => {
              this.$message({
                type: 'success',
                message: this.$l.deleteSuccess,
              })
              this.getVideoList()
            })
          })
          .catch(() => {
            // console.log('取消操作');
          })
      }
    },

    uploadVideo() {
      //上传视频 - sử dụng streaming endpoint để hỗ trợ file lớn (>1GB)
      let that = this

      axiosController = new AbortController()
      let formData = new FormData()
      // Thứ tự: file trước, các field khác sau (để streaming xử lý đúng)
      formData.append('file', this.uploadVideoObj.file)
      let fields = ['id', 'college_id', 'is_public', 'name', 'type', 'thumbnail_path', 'description']
      fields.forEach((i) => {
        formData.append(i, this.uploadVideoObj[i])
      })
      let customConfig = {
        onUploadProgress: function (progressEvent) {
          let uploadPart = progressEvent.loaded - that.uploadVideoObj.uploadEvent.uploadSize //计算该分段上传的文件大小，单位b
          let uploadTime = (new Date().getTime() - that.uploadVideoObj.uploadEvent.oTime) / 1000 //计算出上次调用该方法时到现在的时间差，单位为s
          let speed = uploadPart / uploadTime
          let restTime = (progressEvent.total - progressEvent.loaded) / speed
          that.$set(that.uploadVideoObj.uploadEvent, 'speed', that.formatFileSize(speed) + '/s')
          that.$set(that.uploadVideoObj.uploadEvent, 'restTime', that.formatSeconds(restTime, true))
          that.$set(that.uploadVideoObj.uploadEvent, 'uploadSize', progressEvent.loaded)
          that.$set(that.uploadVideoObj.uploadEvent, 'oTime', new Date().getTime())
          that.$set(that.uploadVideoObj, 'uploadPercent', Math.round((progressEvent.loaded * 100) / progressEvent.total))
          that.$set(that.uploadVideoObj, 'uploadSize', that.formatFileSize(progressEvent.loaded))
        },
      }

      this.flagObj.uploading = true
      this.$set(this.uploadVideoObj.uploadEvent, 'oTime', new Date().getTime())
      // Sử dụng endpoint streaming mới để tránh OutOfMemoryException với file lớn
      this.$request(this.$api.videoServer + '/Video/VideoManage/uploadVideoStreaming', formData, 'post', 'noErrorDialog', customConfig, axiosController)
        .then((r) => {
          if (r.httpCode == 200) {
            this.$message({
              type: 'success',
              message: this.$l.uploadSuccess,
            })
            let timer = setTimeout(() => {
              this.flagObj.uploadAble = false
              this.getVideoList()
              this.showObj.uploadVideo = false
              clearTimeout(timer)
              this.videoRemove(true)
            }, 1500)
          }
        })
        .catch((e) => {
          this.flagObj.uploading = false
          return this.$message.error(e.message)
        })
    },

    videoRemove(flag) {
      if (flag) {
        this.$refs.videoInput.value = '' //清空文件选择的内容
      }
      //删除视频文件
      this.flagObj.selectVideo = false
      this.flagObj.uploadAble = false
      this.uploadVideoObj = {
        id: '',
        name: '', //视频名称
        duration: '',
        type: '', //视频类型
        college_id: this.isAdmin ? '' : this.publicCodeObj.collegeList[0].id, //所属学院
        is_public: 0, //是否为公开课
        size: 0, //视频大小
        uploadSize: '0 B', //已上传大小
        uploadPercent: 0, //已上传比例
        uploadEvent: {
          //axios上传事件
          uploadSize: 0,
          speed: '0 B/s',
          oTime: 0,
          restTime: '未开始',
        },
        thumbnail: '', //选择的封面
        thumbnail_path: '', //封面上传后端后回传的路径
        description: '', //视频简介
        file: {
          //选择的视频文件信息
          name: '',
        },
      }
    },

    abortUploadVideo() {
      //终止视频上传任务
      this.flagObj.uploading = false
      axiosController.abort()
    },

    /*********   视频上传  end   *********/

    /*********   已上传视频操作  start   *********/

    getVideoList() {
      this.$request(this.$api.videoServer + '/Video/VideoManage/getVideoList', this.videoListObj.query)
        .then((r) => {
          if (r.httpCode == 200) {
            this.videoListObj.list = r.data.list
            this.videoListObj.total = r.data.total
            if (r.data.total == 0) {
              this.videoListObj.list = []
              // this.$message({
              //   type: 'info',
              //   message: '暂无数据'
              // })
            }
          }
        })
        .catch((e) => {
          console.log(e)
        })
    },

    /*********   已上传视频操作  end   *********/

    /*********   工具函数  start   *********/

    formatFileSize(bytes) {
      if (bytes === 0) return '0 B'
      let k = 1024 // 或者使用1000，这取决于你是否想使用二进制前缀
      let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
      let i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    },

    //格式化秒数到时分秒格式
    formatSeconds(seconds, chinese) {
      let hours = Math.floor(seconds / 3600)
      let minutes = Math.floor((seconds % 3600) / 60)
      let remainingSeconds = parseInt(seconds % 60)
      let fractionalHours
      if (chinese) {
        if (hours > 0) {
          fractionalHours = hours + minutes / 60
          return `${fractionalHours.toFixed(1)}` + this.$l.hours
        } else if (minutes > 0) {
          return `${minutes}` + this.$l.mins
        } else {
          return `${remainingSeconds}` + this.$l.seconds
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
    },

    formatDuration(totalSeconds, unit) {
      let duration = Math.floor(totalSeconds)
      let hours = Math.floor(duration / 3600)
      let minutes = Math.floor((duration % 3600) / 60)
      let seconds = duration % 60

      if (unit) {
        return [hours > 0 ? `${hours + this.$l.hours}` : '', minutes.toString().padStart(2, '0') + this.$l.mins, seconds.toString().padStart(2, '0') + this.$l.seconds].filter(Boolean).join('')
      } else {
        return [hours > 0 ? `${hours}:` : '', minutes.toString().padStart(2, '0') + ':', seconds.toString().padStart(2, '0')].filter(Boolean).join('')
      }
    },

    /*********   工具函数  end   *********/
  },

  beforeDestroy() {
    if (this.$refs.videoPlayer) {
      this.$refs.videoPlayer.onDestroy()
    }
  },

  mounted() {
    this.getCollegeList()
  },
}
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
