<template>
  <div class="play-container">
    <!-- 附件预览 -->
    <FilePreviews :file-url="showObj.fileUrl" :visible="showObj.filePreviews"
      @update:visible="showObj.filePreviews = $event" />

    <el-dialog class="examRecord-dialog" :title="$l.examRecord" :visible.sync="showObj.examDialog" width="50%">
      <el-table :data="examRecord" stripe style="width: 100%" max-height="350px" empty-text=" ">
        <el-table-column type="index" :label="$c.sn"></el-table-column>
        <el-table-column prop="create_time" :label="$l.examedTime"></el-table-column>
        <el-table-column prop="create_user" :label="$l.examUser"></el-table-column>
        <el-table-column prop="score" :label="$l.examScore"></el-table-column>
        <el-table-column :label="$c.operate" width="150" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="reviewExam(scope.row)">{{$l.check}}</el-button>
          </template>
        </el-table-column>
        <div slot="append">
          <div class="goToExam">
            <div class="detail">
              {{$l.mostExam}}
              <el-button class="num"
                type="text">{{currentExam.max_reply_num}}</el-button>{{$l.examUnit}}，{{$l.youCanExam}}
              <el-button class="num" type="text" :style="{
                    color:currentExam.max_reply_num-examRecord.length<=0?'red':''
                  }">{{currentExam.max_reply_num-examRecord.length}}</el-button>{{$l.examUnit}}
            </div>
            <div class="goToExam-btn">
              <el-button class="go" type="text" plain @click="goToExam"
                :disabled="currentExam.max_reply_num-examRecord.length<=0">{{$l.goExam}}</el-button>
            </div>
          </div>
        </div>
      </el-table>
      <div slot="footer">
        <el-button type="success" plain @click="getReplyRecord(currentExam)">{{$l.refresh}}</el-button>
        <el-button type="primary" plain @click="showObj.examDialog = false">{{$l.close}}</el-button>
      </div>
    </el-dialog>

    <div class="page-body">
      <div class="player-wrapper">
        <!-- 上方播放区域 -->
        <div class="title-wrapper">
          <!-- 课程标题 -->
          <div class="title-wrapper-left">
            <div class="title">{{ courseInfo.name_label }}</div>
            <div class="views">
              <!-- <i class="el-icon-view"></i>
              <span class="view">播放量</span> -->
            </div>
          </div>
        </div>

        <div class="video-wrapper">
          <!-- 播放器和左侧列表 -->
          <div class="video-player">
            <!-- 视频播放器 -->
            <videoPlayer ref="videoPlayer" :src="currentVideo.url" :other_src="currentVideo.other_url"
              :progressControl="true" :markers="questionList" :playInBackground="false" :resumePlaying="true"
              :lastPlayTime="progressObj.progress" :maxPlayTime="progressObj.max_progress"
              :finishPoint="currentVideo.finish_time" :playbackRateArray="[1]"
              :questionControl="currentVideo.is_process_question" :watermark="user.userId + ' ' + user.userName"
              :playStatus.sync="isPlaying" @loadedMetadata="getPlayProgress" @pause="reportPlayProgress"
              @ended="reportPlayDuration" @seeked="reportPlayProgress" @play="playVideoAction">
            </videoPlayer>
          </div>
          <div class="playlist">
            <!-- 列表 -->
            <div class="navi">
              <div @click="showObj.playlist='course'" :style="{
                color:showObj.playlist=='course'?'#409fee':'#fff'
              }">{{$l.courseTitle}}</div>
              <div v-show="topicObj.list[0].detail.length>1" @click="showObj.playlist='topic'" :style="{
                color:showObj.playlist=='topic'?'#409fee':'#fff'
              }">{{$l.topicTitle}}</div>
            </div>
            <div class="list" v-show="showObj.playlist=='course'">
              <div v-for="(i, index) in videoList" :key="i.id" class="item" @click="toggleVideo(index)" :style="{
                border:playingIndex == index?'2px solid #409fee':'2px solid rgba(99, 99, 99, 0.4) '
              }">
                <div class="title">
                  <el-tooltip effect="light" placement="right">
                    <div slot="content" style="max-width: 300px" class="text-clamp-4">
                      {{ i.description }}
                    </div>
                    <span class="text-clamp-2" style="max-width: calc(100% - 20px)">{{ i.title }}</span>
                  </el-tooltip>
                  <i v-show="playingIndex == index" :class="
                      isPlaying
                        ? 'el-icon-video-pause playing'
                        : 'el-icon-video-play'
                    " style="width: 20px"></i>
                </div>
                <div class="duration">
                  <div>{{$l.duration}}:{{ formatDuration(i.duration) }}</div>
                  <div>{{$l.needToLearn}}:{{ formatDuration(i.finish_time) }}</div>
                </div>
              </div>
            </div>

            <div class="list" v-show="showObj.playlist=='topic'">
              <div v-for="(i, index) in topicObj.list[0].detail" :key="i.id" @click="switchCourse(i,index)" class="item"
                :style="{
                border:topicObj.index==index?'2px solid #409fee':'2px solid rgba(99, 99, 99, 0.4) '
              }">
                <div class="title">
                  <el-tooltip effect="light" placement="right">
                    <div slot="content" style="max-width: 300px" class="text-clamp-4">
                      {{ i.description }}
                    </div>
                    <span class="text-clamp-2"
                      :style="{'max-width': 'calc(100% - 20px)'}">{{ i.course_name_label }}</span>
                  </el-tooltip>
                  <div v-show="topicObj.index==index">
                    <i class="el-icon-location"></i>
                  </div>
                </div>
                <div class="duration">
                  <div>{{$l.createTime}}:{{i.create_time}}</div>
                  <div>
                    <span style="margin-right: 1em;"><i
                        class="iconfont icon-appreciate_light"></i>{{i.goodBad_Info.good_count}}</span>
                    <span> <i class="iconfont icon-oppose_light"></i>{{i.goodBad_Info.bad_count}}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="info-wrapper">
        <!-- 下方信息区域 -->
        <div class="info-wrapper-left">
          <!-- 左侧课程信息区域 -->
          <div class="goodBad">
            <div class="gb_item">
              <i v-if="my_goodBad_info.type === 1" class="iconfont icon-appreciate_fill_light text-blue"
                @click="cancelGoodBad"></i>
              <i v-else-if="my_goodBad_info.type !== 1" class="iconfont icon-appreciate_light"
                @click="handleGoodBad(1)"></i>
              {{ courseInfo.goodBad_Info.good_count }}
            </div>
            <div class="gb_item">
              <i v-if="my_goodBad_info.type === 0" class="iconfont icon-oppose_fill_light text-blue"
                @click="cancelGoodBad"></i>
              <i v-else-if="my_goodBad_info.type !== 0" class="iconfont icon-oppose_light"
                @click="handleGoodBad(0)"></i>
              {{ courseInfo.goodBad_Info.bad_count }}
            </div>
            <div class="gb_item">
              <i class="iconfont" :class="
                     favoriteList.total == 0
                       ? 'icon-favor_light'
                       : 'icon-favor_fill_light text-blue'
                   " @click="handleFavorClick"></i>
            </div>
          </div>
          <div class="info"></div>
          <div class="sub-info">
            <div class="info-item">
              <div class="info-label">{{$l.courseCatalog}}:</div>
              <div> {{returnPublicObjLabel(courseInfo.type,'value','label','courseCatalog')}}</div>
            </div>
            <div class="info-item">
              <div class="info-label">{{$l.createDept}}:</div>
              <div>{{ courseInfo.create_dept +' '+courseInfo.create_time }}</div>
            </div>

            <!-- <div class="info-item">
                 <div class="info-label">课程来源:</div>
                 <div>{{$c.noData}}</div>
               </div> -->
            <div class="info-item">
              <div class="info-label">{{$l.totalDuration}}:</div>
              <div>{{formatDuration(courseInfo.totalDuration)}}</div>
            </div>
            <div class="info-item">
              <div class="info-label">{{$l.score}}:</div>
              <div>{{ courseInfo.score }}</div>
            </div>
          </div>
          <div class="sub-info">
            <div class="info-item">
              <div class="info-label">{{$l.lecturer}}:</div>
              <div>{{ courseInfo.lecturer==1?$l.internalLecturer:$l.externalLecturer }}</div>
            </div>
            <div class="info-item">
              <div class="info-label">{{$l.trainLanguage}}:</div>
              <div>{{returnPublicObjLabel(courseInfo.language,'value','label','language_type')}}</div>
            </div>

            <div class="info-item">
              <div class="info-label">{{$l.applicableGroup}}:</div>
              <div>{{courseInfo.applicable_group}}</div>
            </div>
            <div class="info-item">
              <div class="info-label">{{$l.profit}}:</div>
              <div>{{ courseInfo.profit }}</div>
            </div>
          </div>
          <div class="desc-label">{{$l.courseDesc}}:</div>

          <div class="desc">
            {{ courseInfo.description }}
            <el-tag style="margin: 0px 10px 10px 0px" size="mini" :key="index" v-for="(i, index) in courseInfo.tags">
              {{ i.name_label }}
            </el-tag>
          </div>
        </div>
        <div class="info-wrapper-right">
          <!-- 右侧资料和练习区域 -->
          <div class="material">
            <div class="title">{{$l.courseMaterial}}</div>
            <div class="list-wrapper frcc" v-if="attachmentList.length == 0">
              <div>{{$c.noData}}</div>
            </div>
            <div class="list-wrapper" v-else>
              <div class="item" v-for="i in attachmentList" :key="i.id">
                <span class="label">{{ i.name_label }}</span>
                <el-button class="button" type="text" @click="previewFile(i.file_url)">{{$c.check}}</el-button>
              </div>
            </div>
          </div>
          <!-- <div style="height: 30px;width: 1px;"></div> -->
          <div class="material">
            <div class="title">{{$l.courseExam}}</div>
            <div class="list-wrapper frcc" v-if="examList.length == 0">
              <div>{{$c.noData}}</div>
            </div>
            <div class="list-wrapper" v-else>
              <div class="item" v-for="i in examList" :key="i.id">
                <span class="label">{{ i.name_label }}</span>
                <el-button class="button" type="text" @click="getReplyRecord(i)">{{$l.examDetail}}</el-button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import debounce from 'lodash.debounce'
  import {
    mapGetters
  } from 'vuex'
  import videoPlayer from '@/components/videoPlayer/videoPlayer.vue'
  import FilePreviews from '@/views/_common/FilePreviews.vue'
  export default {
    name: 'videoUserPlay',
    components: {
      videoPlayer,
      FilePreviews
    },

    computed: {
      ...mapGetters(['user']),
    },

    watch: {
      playingIndex(newValue, oldValue) {
        if (newValue != null && newValue >= 0) {
          this.currentVideo = this.videoList[newValue]
          if (this.currentVideo.is_process_question) {
            this.getBindingQuestionById(this.currentVideo.id)
          } else {
            this.$set(this, 'questionList', [])
          }
        }
      }
    },

    data() {
      return {
        currentVideo: {
          url: ''
        },
        showObj: {
          examDialog: false,
          playlist: 'course',
          filePreviews: false,
          fileUrl: ""
        },
        currentExam: {
          id: '',
          questionnaire_id: '',
          max_reply_num: 0
        },
        examRecord: [],
        playingTimmerId: null,
        reportInterval: 5 * 1000,
        playDuration: 0,
        params: {


          playId: "", //播放id,从getPlayProgress方法中获取
          userid: '', //用户id
          train_primary_id: '', //培训主键id,只能从外部onload中获取
          no_primary_train_id: '', //培训非主键id,只能从外部onload中获取
          course_primary_id: '', //课程id
          no_primary_course_id: '', //课程非主键id
          video_id: '', //当前视频的id，从this.currentVideo中获取
          progress: 0, //当前播放进度，单位S
          max_progress: 0, //最大播放进度，单位S
          is_play: true,

          topic_id: "", //专题id，拥有此项会自动请求专题内其他课程




          playId: "", //播放id,从getPlayProgress方法中获取
          userid: '', //用户id
          train_primary_id: '', //培训主键id,只能从外部onload中获取
          no_primary_train_id: '', //培训非主键id,只能从外部onload中获取
          course_primary_id: '', //课程id
          no_primary_course_id: '', //课程非主键id
          video_id: '', //当前视频的id，从this.currentVideo中获取
          progress: 0, //当前播放进度，单位S
          max_progress: 0, //最大播放进度，单位S
          is_play: true,

          topic_id: "", //专题id，拥有此项会自动请求专题内其他课程
          class_id: ''


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
          tags: [{
            name_label: '',
          }, ],
          goodBad_Info: {
            good_count: 0,
            bad_count: 0,
          },
        },
        videoList: [{
          id: '',
          course_id: '',
          url: '',
          is_process_question: false,
          finish_time: 0,
        }, ],
        examList: [],
        questionList: [],
        attachmentList: [],
        isPlaying: false,
        playingIndex: null,
        progressObj: {
          progress: 0,
          max_progress: 0,
          id: ''
        },
        favoriteList: {
          total: 0,
        },

        topicObj: {
          query: {
            college_id: "",
            name: "",
            page: 1,
            pageSize: 15,
            is_valid: 'Y'
          },
          list: [{
            detail: []
          }],
          total: 0,
          index: 0
        },

        publicCodeObj: {
          language_type: [],
          courseCatalog: []
        },

      }
    },

    methods: {

      toggleVideo(index) {
        //切换当前播放视频时，上报播放进度
        this.reportPlayProgress()
        this.playingIndex = index
      },

      previewFile(url) {
        this.showObj.fileUrl = this.$api.videoServer + '/' + url
        this.showObj.filePreviews = true
      },

      switchCourse(i, index) {
        this.playingIndex = null
        this.topicObj.index = index
        this.getCourseInfo(i.course_primary_id, true)
        this.getCourseResource(i.course_primary_id)
      },

      getBindingQuestionById(id) {
        this.$request(this.$api.videoServer + '/Video/VideoProcessQuestion/getList', {
          video_id: id,
        }).then((r) => {
          if (r.data.length > 0) {
            let questionsArray = r.data.map((i) => {
              // 将 time 属性添加到 question 对象中，并返回更新后的 question 对象
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
            this.questionList = questionsArray
          } else {
            this.questionList = []
          }
        })
      },

      getCourseInfo(vid, myGoodBad) {
        this.$request(
            this.$api.videoServer + '/Video/VideoCourseCatalog/getCourseList', {
              id: vid,
              page: 1,
              pageSize: 1,
            },
            'post'
          )
          .then((r) => {
            this.courseInfo = r.data.list[0]
            this.params.course_primary_id = this.courseInfo.id
            this.params.no_primary_course_id = this.courseInfo.course_id
            if (myGoodBad) {
              this.getMyGoodBad(this.params.no_primary_course_id)
            }
            this.getFavorList()
          })
          .catch((e) => {
            console.log(e)
          })
      },

      getMyGoodBad(course_id) {
        this.$request(
          this.$api.videoServer + '/Video/VideoCourseCatalog/getMyGoodBad', {
            page: 1,
            pageSize: 1,
            userid: this.user.userId,
            course_id: course_id,
          }
        ).then((r) => {
          if (r.data.total) {
            this.my_goodBad_info = r.data.list[0]
          } else {
            this.my_goodBad_info = {
              good_bad_id: '',
              type: '',
            }
          }
        })
      },

      handleGoodBad(type) {
        if (this.my_goodBad_info.good_bad_id) {
          this.cancelGoodBad(type)
        } else {
          this.submitGoodBad(type)
        }
      },

      submitGoodBad(type) {
        this.$request(
          this.$api.videoServer + '/Video/VideoCourseCatalog/goodBad', {
            id: '',
            course_id: this.params.no_primary_course_id,
            userid: this.user.userId,
            type: type,
          },
          'post'
        ).then((r) => {
          if (r.status) {
            if (this.my_goodBad_info.type == 1) {
              this.$message({
                message: this.$c.success,
                type: 'success',
              })
            } else {
              this.$message({
                message: this.$c.success,
                type: 'success',
              })
            }
            this.getCourseInfo(this.params.course_primary_id, 'myGoodBad')
          }
        })
      },

      cancelGoodBad(type) {
        this.$request(
          this.$api.videoServer + '/Video/VideoCourseCatalog/cancelGoodBad', {
            id: this.my_goodBad_info.good_bad_id,
          },
          'post'
        ).then((r) => {
          if (r.status) {
            if (typeof type == 'number') {
              this.submitGoodBad(type)
            } else {
              if (this.my_goodBad_info.type == 1) {
                this.$message({
                  message: this.$c.success,
                  type: 'success',
                })
              } else {
                this.$message({
                  message: this.$c.success,
                  type: 'success',
                })
              }
              this.getCourseInfo(this.params.course_primary_id)
              this.my_goodBad_info = {
                good_bad_id: '',
                type: '',
              }
            }
          }
        })
      },

      getCourseResource(vid) {
        this.$request(
            this.$api.videoServer +
            '/Video/VideoCourseCatalog/getCourseVideoAndExam?course_id=' + vid)
          .then((r) => {
            this.videoList = []
            this.examList = []
            this.courseInfo.totalDuration = 0
            if (r.data.length > 0) {
              this.params.no_primary_course_id = r.data[0].no_primary_course_id
              r.data.forEach((i, index) => {
                if (i.video) {
                  if (!i.video.url.includes('http')) {
                    i.video.url = this.$api.videoServer + i.video.url
                  }
                  if (i.video.other_url) {
                    let videoUrls = JSON.parse(i.video.other_url)
                    for (let key in videoUrls) {
                      if (videoUrls.hasOwnProperty(key)) {
                        videoUrls[key] = this.$api.videoServer + videoUrls[key];
                      }
                    }
                    i.video.other_url = videoUrls
                  }
                  i.video.finish_time = i.finish_time
                  this.courseInfo.totalDuration += i.video.duration
                  this.videoList.push(i.video)
                  if (i.video.id == this.params.video_id) {
                    this.toggleVideo(index)
                  }
                } else {
                  this.examList.push(i.exam)
                }
              })
              if (this.playingIndex == null) {
                this.playingIndex = 0
              }
            }
          })
          .catch((e) => {
            console.log(e)
          })
      },

      goToExam(i) {
        let url = this.$router.resolve({
          name: 'examDetail',
          query: {
            questionnaire_id: this.currentExam.questionnaire_id,
            exam_id: this.currentExam.id, //需要传入有效exam_id
            no_primary_train_id: this.params.no_primary_train_id,
            train_primary_id: this.params.train_primary_id,
            course_primary_id: this.params.course_primary_id,
            class_id: this.params.class_id,
            is_test: true,
            mode: 'exam'


          },
        }).href
        // 使用window.open打开新标签页
        window.open(url, '_blank')
      },

      reviewExam(data) {
        let url = this.$router.resolve({
          name: 'examDetail',
          query: {
            exam_id: this.currentExam.id,
            questionnaire_id: this.currentExam.questionnaire_id,
            reply_id: data.id, //此处为回答记录主键,只需要回答记录组件，不需要课程id和培训id
            mode: 'review'
          }
        }).href;
        // 使用window.open打开新标签页
        window.open(url, '_blank');
      },

      goToExam() {
        //需要传入有效exam_id
        let url = this.$router.resolve({
          name: 'examDetail',
          query: {
            train_id: this.params.train_id,
            train_primary_id: this.params.train_primary_id,
            course_id: this.params.course_primary_id,
            exam_id: this.currentExam.id,
            questionnaire_id: this.currentExam.questionnaire_id,
            mode: 'exam'
          }
        }).href;
        // 使用window.open打开新标签页
        window.open(url, '_blank');
      },

















      getReplyRecord(i) {
        this.currentExam = i
        this.$request(this.$api.videoServer + '/Video/VideoExam/getAnswerList', {
          exam_id: i.id,
          userid: this.user.userId,
          questionnaire_id: i.questionnaire_id,
          course_id: this.params.course_primary_id,
          exam_id: i.id, //需要传入有效exam_id
          train_id: this.params.no_primary_train_id,
          train_primary_id: this.params.train_primary_id,
          course_primary_id: this.params.course_primary_id,
          class_id: this.params.class_id,
          is_test: true,

          page: 1,
          pageSize: 10
        }).then(r => {
          this.examRecord = r.data.list
          this.showObj.examDialog = true
        })
      },

      formatDuration(totalSeconds, unit) {
        let duration = Math.floor(totalSeconds)
        let hours = Math.floor(duration / 3600)
        let minutes = Math.floor((duration % 3600) / 60)
        let seconds = duration % 60

        if (unit) {
          return [
              hours > 0 ? `${hours}时` : '',
              minutes.toString().padStart(2, '0') + '分',
              seconds.toString().padStart(2, '0') + '秒',
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
      },

      playVideoAction(e) {
        if (!this.params.playId) {
          this.$refs.videoPlayer.player.pause()
          this.$message(this.$l.playActionError)
          return
        }
        if (this.$refs.videoPlayer.player) {
          let progress = this.$refs.videoPlayer.videoObj.currentTime //当前播放进度
          let max_progress = this.$refs.videoPlayer.videoObj.watchMaxTime //最大播放进度
          this.$request(
            this.$api.videoServer + '/Video/Video/playVideoAction',
            [{
              playId: this.params.playId,
              userid: this.user.userId,
              train_id: this.params.train_primary_id,
              no_primary_train_id: this.params.no_primary_train_id,
              course_id: this.params.course_primary_id,
              no_primary_course_id: this.params.no_primary_course_id,
              video_id: this.currentVideo.id,
              progress: progress,
              max_progress: max_progress,
              is_play: true,
            }],
            'post',
            'noErrorDialog'
          ).then((r) => {
            if ((r.httpCode == 200) & (r.status == true)) {
              // console.log(r);
            }
          })
        }
      },

      reportPlayProgress() {
        if (this.$refs.videoPlayer.player) {
          if (this.$refs.videoPlayer.player.playbackRate() != 1) {
            return this.$message({
              message: this.$l.playbackSpeedError,
              type: 'warning'
            })
          }
          let progress = this.$refs.videoPlayer.videoObj.currentTime //当前播放进度
          let max_progress = this.$refs.videoPlayer.videoObj.watchMaxTime //最大播放进度
          let playStatus = !this.$refs.videoPlayer.player.paused() //通过videojs.paused方法返回视频是否处于非播放状态
          if (progress > 0 && max_progress >= progress) {
            this.$request(
              this.$api.videoServer + '/Video/Video/uploadPlayProcess',
              [{
                playId: this.params.playId,
                userid: this.user.userId,
                train_id: this.params.train_primary_id,
                no_primary_train_id: this.params.no_primary_train_id,
                course_id: this.params.course_primary_id,
                no_primary_course_id: this.params.no_primary_course_id,
                video_id: this.currentVideo.id,
                progress: progress,
                max_progress: max_progress,
                is_play: playStatus,
              }],
              'post',
              'noErrorDialog'
            ).then((r) => {
              if ((r.httpCode == 200) & (r.status == true)) {
                // console.log(r);
              }
            })
          }
        }
      },

      getPlayProgress(e) {
        if (this.$refs.videoPlayer.player) {
          this.$request(
            this.$api.videoServer + '/Video/Video/getPlayProcess', {
              playId: this.params.playId,
              userid: this.user.userId,
              train_id: this.params.train_primary_id,
              no_primary_train_id: this.params.no_primary_train_id,
              course_id: this.params.course_primary_id,
              no_primary_course_id: this.params.no_primary_course_id,
              video_id: this.currentVideo.id,
              progress: 0,
              max_progress: 0,
              is_play: this.isPlaying
            },
            'post',
            'noErrorDialog'
          ).then((r) => {
            if ((r.httpCode == 200) & (r.status == true)) {
              if (r.data.playId) {
                this.params.playId = r.data.playId
              } else {
                this.params.playId = r.data.id
              }
              let progress = parseInt(r.data.progress) //当前播放进度
              let max_progress = parseInt(r.data.max_progress) //最大播放进度
              this.progressObj.progress = progress <= max_progress ? progress : max_progress
              this.progressObj.max_progress = max_progress
            }
          })
        }
      },

      reportPlayDuration() {
        if (this.$refs.videoPlayer.player) {
          this.$request(
            this.$api.videoServer + '/Video/Video/uploadPlayDuration', {
              userid: this.user.userId,
              train_id: this.params.train_primary_id,
              no_primary_train_id: this.params.no_primary_train_id,
              course_id: this.params.no_primary_course_id,
              video_id: this.currentVideo.id,
              course_primary_id: this.params.course_primary_id,
              play_time: this.playDuration,
              playId: this.params.playId,
              create_time: new Date().toLocaleString()
            },
            'post',
            'noErrorDialog'
          ).then((r) => {
            if ((r.httpCode == 200) & (r.status == true)) {
              // console.log(r);
            }
          })
        }
      },



      getAttachments(id) {
        this.attachmentList = []
        this.$request(this.$api.videoServer + '/Video/VideoCourseCatalog/GetCourseAttachemnts', {
            course_primary_id: id,
            page: 1,
            pageSize: 9999
          })
          .then(r => {
            if (r.httpCode == 200) {
              this.attachmentList = r.data.list
            }
          })
          .catch(e => {
            console.log(e);
          })
      },

      getFavorList() {
        this.$request(this.$api.videoServer + '/Video/Favorite/getlist', {
          course_id: this.params.no_primary_course_id,
          page: 1,
          pageSize: 9999,
        }).then((r) => {
          // this.favoriteList.list = r.data.list
          this.favoriteList.total = r.data.total
        })
      },

      returnLanguageLabel(v) {
        let item = this.language_type.find(i => {
          return i.value == v
        })
        if (item) {
          return item.label
        } else {
          return v
        }
      },

      returnPublicObjLabel(value, key, label, filed) {
        let item = this.publicCodeObj[filed].find(i => {
          return i[key] == value
        })
        if (item) {
          return item[label]
        } else {
          return value
        }
      },

      getLanguage_type() {
        this.$request(this.$api.publiccode + 'getListdetailed', {
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
            this.publicCodeObj.language_type = list
          })
          .catch(e => {
            this.$message.error(e.message)
          })
      },

      getCourseCatalog() {
        this.$request(this.$api.publiccode + 'getListdetailed', {
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
            this.publicCodeObj.courseCatalog = list
          })
          .catch(e => {
            this.$message.error(e.message)
          })
      },

      getTopicList(id) {
        this.$request(this.$api.videoServer + '/Video/VideoPageTag/getlist', {
            ...this.topicObj.query,
            college_id: this.vuex_collegeId,
            id: id
          })
          .then(r => {
            if (r.status) {
              this.topicObj.list = r.data.list
              this.topicObj.total = r.data.total
              this.topicObj.index = r.data.list[0].detail.findIndex(i => i.course_primary_id == this
                .params.course_id)
            }
          })
          .catch(e => {
            console.log(e);
          })
      },

      handleFavorClick: debounce(function() {
        let courseObj = {
          course_id: this.params.no_primary_course_id,
        }
        this.$request(
            this.$api.videoServer + '/Video/Favorite/addOrRemoveFavorite',
            courseObj,
            'post'
          )
          .then((r) => {
            this.getFavorList()
          })
          .catch(() => {})
      }, 300), // 300ms 内只允许触发一次
    },

    mounted() {
      this.getLanguage_type()
      this.getCourseCatalog()
      if (this.$route.query.course_primary_id) {
        this.params = Object.assign(this.params, this.$route.query)
        this.getAttachments(this.params.course_primary_id)
        this.getCourseResource(this.params.course_primary_id)
        this.getCourseInfo(this.params.course_primary_id, 'myGoodBad')
        this.playingTimmerId = setInterval(() => {
          if (this.isPlaying) {
            // 如果正在播放，则发送播放进度信息到服务器
            this.playDuration += 1
            if (this.playDuration % 5 == 0 && this.playDuration > 0) {
              this.reportPlayProgress()
              this.reportPlayDuration()
              this.playDuration = 0
            }
          }
        }, 1000)
      } else {
        console.log('没有获取到course_primary_id');
      }
      if (this.$route.query.topic_id) {
        this.getTopicList(this.$route.query.topic_id)
      }
    },

    beforeDestroy() {
      if (this.playDuration) {
        this.reportPlayDuration()
        this.reportPlayProgress()
      }
      if (this.playingTimmerId) {
        clearInterval(this.playingTimmerId)
      }
    },
  }
</script>


<style scoped>
@charset "UTF-8";
.play-container {
  width: 100%;
  background-color: #f3f4f6;
  padding-top: 20px;
}
.play-container .examRecord-dialog .goToExam {
  margin: 5px 0px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
}
.play-container .examRecord-dialog .goToExam .detail {
  padding-left: 10px;
  width: calc(100% - 150px);
  white-space: nowrap;
  overflow: hidden;
}
.play-container .examRecord-dialog .goToExam .detail .num {
  margin: 0 2px;
  font-size: 14px;
}
.play-container .examRecord-dialog .goToExam .goToExam-btn {
  width: 150px;
  text-align: center;
}
.play-container .examRecord-dialog .goToExam .goToExam-btn .go {
  font-size: 14px;
  z-index: 6000;
  border: none;
  font-weight: bold;
}
.play-container .examRecord-dialog .goToExam .goToExam-btn .go:hover {
  border: none;
}
.play-container .page-body {
  min-width: 1000px;
  width: 80%;
  margin: 0 auto;
}
.play-container .page-body .player-wrapper {
  width: 100%;
  aspect-ratio: 2.539;
  background-color: white;
}
.play-container .page-body .player-wrapper .title-wrapper {
  display: flex;
  padding: 10px;
}
.play-container .page-body .player-wrapper .title-wrapper .title-wrapper-left {
  width: 70%;
}
.play-container .page-body .player-wrapper .title-wrapper .title-wrapper-left .title {
  font-weight: 600;
  font-size: 28px;
}
.play-container .page-body .player-wrapper .title-wrapper .title-wrapper-left .views {
  color: #595959;
}
.play-container .page-body .player-wrapper .title-wrapper .title-wrapper-left .views .view {
  margin-left: 0.5em;
}
.play-container .page-body .player-wrapper .title-wrapper .title-wrapper-right {
  width: 30%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.play-container .page-body .player-wrapper .title-wrapper .title-wrapper-right .progress {
  font-size: 20px;
}
.play-container .page-body .player-wrapper .title-wrapper .title-wrapper-right .duration {
  margin-top: 10px;
}
.play-container .page-body .player-wrapper .title-wrapper .title-wrapper-right .duration span {
  margin-right: 8px;
}
.play-container .page-body .player-wrapper .video-wrapper {
  height: 100%;
  display: flex;
  background-color: #1d1d1d;
}
.play-container .page-body .player-wrapper .video-wrapper .video-player {
  width: 70%;
  height: 100%;
  z-index: 0;
}
.play-container .page-body .player-wrapper .video-wrapper .playlist {
  height: 100%;
  width: 30%;
  padding: 0px 1%;
}
.play-container .page-body .player-wrapper .video-wrapper .playlist .navi {
  display: flex;
  justify-content: space-evenly;
  color: white;
  margin-top: 10px;
}
.play-container .page-body .player-wrapper .video-wrapper .playlist .list {
  width: 100%;
  height: 90%;
  overflow-y: scroll;
}
.play-container .page-body .player-wrapper .video-wrapper .playlist .list .item {
  margin-top: 10px;
  padding: 5px;
  color: white;
  background-color: #35353a;
  border-radius: 8px;
}
.play-container .page-body .player-wrapper .video-wrapper .playlist .list .item .title {
  font-size: 18px;
  display: flex;
  justify-content: space-between;
}
.play-container .page-body .player-wrapper .video-wrapper .playlist .list .item .title .playing {
  animation: fadeInOut 6s infinite ease-in-out;
  /* 4秒，无限循环，缓动函数为ease-in-out */
}
.play-container .page-body .player-wrapper .video-wrapper .playlist .list .item .duration {
  width: 100%;
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  color: white;
}
.play-container .page-body .info-wrapper {
  width: 100%;
  height: 80vh;
  padding: 20px 10px;
  display: flex;
  background-color: #f8f9fb;
}
.play-container .page-body .info-wrapper .info-wrapper-left {
  width: 70%;
  padding: 10px;
  margin-right: 10px;
  background-color: white;
}
.play-container .page-body .info-wrapper .info-wrapper-left .goodBad {
  display: flex;
  align-items: center;
}
.play-container .page-body .info-wrapper .info-wrapper-left .goodBad .gb_item {
  margin-right: 50px;
  font-size: 20px;
  cursor: pointer;
}
.play-container .page-body .info-wrapper .info-wrapper-left .goodBad .gb_item i {
  font-size: 36px;
}
.play-container .page-body .info-wrapper .info-wrapper-left .info {
  border-bottom: 1px solid gainsboro;
  padding-bottom: 10px;
  font-size: 20px;
}
.play-container .page-body .info-wrapper .info-wrapper-left .sub-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
}
.play-container .page-body .info-wrapper .info-wrapper-left .sub-info .info-item {
  width: 20%;
}
.play-container .page-body .info-wrapper .info-wrapper-left .sub-info .info-item .info-label {
  color: black;
  font-size: 16px;
  padding-bottom: 10px;
}
.play-container .page-body .info-wrapper .info-wrapper-left .desc-label {
  width: 100%;
  font-size: 16px;
  margin-bottom: 10px;
  color: black;
  margin-top: 20px;
}
.play-container .page-body .info-wrapper .info-wrapper-left .desc-label .desc {
  width: 100%;
  height: auto;
  display: block;
  color: #333333;
}
.play-container .page-body .info-wrapper .info-wrapper-right {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 30%;
  flex-grow: 1;
  padding: 0px 0px 0px 20px;
}
.play-container .page-body .info-wrapper .info-wrapper-right .material {
  height: 49%;
  padding: 10px;
  background-color: white;
}
.play-container .page-body .info-wrapper .info-wrapper-right .material .title {
  color: #1d1d1d;
  font-weight: 600;
  font-size: 20px;
}
.play-container .page-body .info-wrapper .info-wrapper-right .material .list-wrapper {
  width: 100%;
  height: 100%;
  max-height: 100%;
  overflow: auto;
}
.play-container .page-body .info-wrapper .info-wrapper-right .material .list-wrapper .item {
  width: 100%;
  height: 40px;
  line-height: 40px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #f3f4f6;
}
.play-container .page-body .info-wrapper .info-wrapper-right .material .list-wrapper .item .label {
  color: #555;
  height: 40px;
  line-height: 40px;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-align: left;
}
.play-container .page-body .info-wrapper .info-wrapper-right .material .list-wrapper .item .button {
  width: 60px;
}
.play-container .page-body .info-wrapper .info-wrapper-right .material .list-wrapper .item:hover {
  background-color: #f3f4f6;
}

@keyframes fadeInOut {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
  100% {
    opacity: 1;
  }
}
</style>
