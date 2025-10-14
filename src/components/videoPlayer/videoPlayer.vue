<template>
  <div class="video-play-container">
    <!-- 播放器 -->
    <video class="video-js vjs-default-skin vjs-big-play-centered player" ref="myVideo" :id="videoWrapperId"
      :autoplay="autoplay" :controls="controls" :loop="loop" :muted="muted" :poster="poster"
      :playbackRate="playbackRate" :disablepictureinpicture="!pictureInPicture" @loadstart="onLoadStart"
      @durationchange="onDurationChange" @loadedmetadata="onLoadedMetadata" @loadeddata="onLoadedData"
      @progress="onProgress" @canplay="onCanPlay" @canplaythrough="onCanPlayThrough" @play="onPlay" @pause="onPause"
      @seeking="onSeeking" @seeked="onSeeked" @waiting="onWaiting" @timeupdate="onTimeUpdate" @ended="onEnded"
      @error="onError" @volumechange="onVolumeChange" @stalled="onStalled" @ratechange="onRateChange"
      @fullscreenchange='fullscreen'>
    </video>

    <div class="playbackRateControl" v-show="showObj.playQualityPanel">
      <div class="playbackRatePanel" v-for="(value,key) in other_src" :key='key' @click="changeQuality(value,key)">
        {{key}}
      </div>
    </div>

    <div v-show="showObj.resumePlayBtn" class="resumePlayBtn">
      <div v-if="lastPlayTime!=videoObj.duration">
        上次播放到{{formatSeconds(lastPlayTime,true)}},是否继续播放？
        <el-button type="text" @click="backToLastPlay">确定</el-button>
        <el-button class="text-red" type="text" @click="showObj.resumePlayBtn = false">关闭</el-button>
      </div>
      <!-- <div v-else>
        当前视频已完成播放，是否重新播放？
        <el-button type="text" @click="onPlay">确定</el-button>
        <el-button class="text-red" type="text" @click="showObj.resumePlayBtn = false">关闭</el-button>
      </div> -->
    </div>

    <div v-if="showObj.topMessageShow" class="topMessage">
      <div>
        {{showObj.topMessage}}
        <el-button class="text-blue" type="text" @click="showObj.topMessageShow = false">关闭</el-button>
      </div>
    </div>

    <!-- 问题弹窗 -->
    <transition name="fade">
      <div v-if="showObj.breakPointShow" class="modal">
        <div class="modal-content" @click.stop>
          <el-button v-if="!showObj.showAnswer" class="modal-rightBtn" type="primary"
            @click="submitAnswer">提交</el-button>
          <el-button v-else class="modal-rightBtn" type="success"
            @click="closeModal">{{questionObj.remainingTime+'秒后关闭'}}</el-button>
          <!-- <span class="close" @click="closeModal">&times;</span> -->
          <div class="modal-title">
            <div>
              <span style="color: #409fee;font-size: 30px;">{{questionObj.index+1}}</span>
              <span style="margin-right: 0.5em;">/{{markers.length}} </span>
            </div>
            <div>{{markers[questionObj.index].text}}</div>
          </div>

          <div class="option-box" v-show="markers[questionObj.index].question_type==0">
            <el-input v-model="fillin" type="textarea" :rows="4"></el-input>
          </div>
          <div class="option-box">
            <div class="m_options" v-for="(o,index) in markers[questionObj.index].options" :key="o.id"
              @click="selectOption(index,markers[questionObj.index].question_type)" :style="returnStyle(o)">
              <span class="icon_type">
                <span v-show="markers[questionObj.index].question_type==1">
                  <i v-show="o.value!=true" class="far fa-circle" />
                  <i v-show="o.value==true" class="far fa-dot-circle" />
                </span>
                <span v-show="markers[questionObj.index].question_type==2">
                  <i v-show="o.value!=true" class="far fa-square" />
                  <i v-show="o.value==true" class="far fa-check-square" />
                </span>
              </span>
              <span class="text"> {{o.name_label}}</span>
              <span v-show="showObj.showAnswer" style="float: right;">
                <i v-if="o.value==true&&o.is_correct==true" class="fas fa-check-circle" style="color:#19be6b ;" />
                <i v-else-if="o.value==true&&o.is_correct==false" class="fas fa-times-circle" style="color:#fa3534 ;" />
                <i v-else-if="!o.value&&o.is_correct==true" class="fas fa-info-circle" style="color:#ffaa00 ;" />
              </span>
            </div>
          </div>
          <!-- <div class="modal-btn">
            <el-button type="primary" @click="submitAnswer">提交</el-button>
          </div> -->
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  // import "./video.js"
  import "./video.min.js"
  import {
    getToken,
  } from '@/utils/auth'
  import '@/utils/jquery.js'
  import "./videojs.watermark.min.js"
  import "./videojs-markers.js"

  const videojs = typeof window !== 'undefined' && window.videojs ? window.videojs : globalThis.videojs
  const jq = typeof window !== 'undefined' && window.jQuery ? window.jQuery : globalThis.jQuery

  export default {
    name: "videoPlayerCom",
    props: {
      palyStatus: {
        //用于更新父组件播放状态
        type: Boolean,
        default: false
      },
      src: {
        //视频地址
        type: String,
        default: ''
      },
      other_src: { //视频其他清晰度
        type: Object,
        default () {
          return {}
        }
      },
      autoplay: {
        //自动播放
        type: Boolean,
        default: false
      },
      controls: {
        //显示控制器
        type: Boolean,
        default: true
      },
      loop: {
        //循环播放
        type: Boolean,
        default: false
      },
      muted: {
        //静音播放
        type: Boolean,
        default: false
      },
      poster: {
        //视频封面
        type: String,
        default: ''
      },
      preload: {
        //预加载
        type: String,
        default: "auto"
      },
      playbackRate: {
        //播放速度
        type: Number,
        default: 1
      },



      playbackRateArray: {
        //可选播放速度
        type: Array,
        default () {
          return [1]
        }
      },
      pictureInPicture: {
        //启用画中画，仅H5有效
        type: Boolean,
        default: false
      },
      progressControl: {
        //禁止用户快进
        type: Boolean,
        default: false
      },
      questionControl: {
        //开启弹窗答题
        type: Boolean,
        default: false
      },
      markers: {
        //进度条打点
        type: Array,
        default () {
          return []
        }
      },
      finishPoint: {
        //任务完成点，用户视频完成
        type: Number,
        default: 0
      },
      playInBackground: {
        //运行后台播放
        type: Boolean,
        default: false
      },
      resumePlaying: {
        //继续上次播放
        type: Boolean,
        default: true
      },
      lastPlayTime: {
        //上次播放进度
        type: Number,
        default: 0
      },
      maxPlayTime: {
        //最大播放进度
        type: Number,
        default: 0
      },
      controlBarOption: {
        type: Object,
        default () {
          return {
            //自定义控制栏
            PlayToggle: true,
            CurrentTimeDisplay: true,
            progressControl: true,
            DurationDisplay: true,
            PlaybackRateMenuButton: true,
            volumePanel: {
              inline: false,
            },
          }
        }
      },
      watermark: {
        type: [String, Number],
        default: ""
      },

    },
    data() {
      return {
        player: null, //保存实例的video，父组件可以直接通过this.$refs.xxx.player使用video方法
        watermarkTimer: null, //水印定时器，视频播放时移动
        radio: '', //单选答案
        checkbox: [], //多选答案
        fillin: "", //填空答案
        videoObj: {
          videoUrl: "", //视频流地址
          types: ['application/x-mpegURL', 'video/mp4', 'video/webm', 'application/dash+xml', 'video/ogg', 'video/mpeg',
            'video/3gpp'
          ],
          duration: 0,
          watchMaxTime: 0, //当前可快进到的最大时长	单位为s
          currentTime: 0, //记录当前播放进度 单位为s
          copyCurrentTime: 0, //记录点击进度条时正在播放的节点  单位为s
        },

        flagObj: {
          retry: 5,
          destroyed: false, //当前页面是否被销毁
          needinitial: true, //需要初始化视频
          isFullscreen: false, //是否全屏状态
          isPlaying: false, //视频是否播放中
          needAlert: false, //禁止快进提示
          loadSuccess: false, //成功加载视频资源
          hasAlerted: false // 新增标志位，记录是否已经弹过窗
        },

        paramsObj: {
          markersIndex: 0, //当前的标点位置
          markersArray: [], //播放页传入的标点
          alreadyAnswered: [], //已回答的问题
        },
        showObj: {
          topMessage: '',
          topMessageShow: false,
          breakPointShow: false,
          resumePlayBtn: false,
          showAnswer: false,
          playQualityPanel: false,
        },

        questionObj: {
          currentTime: 0,
          index: 0,
          timer: null,
          remainingTime: 5,
          alreadyAnswered: [],
          list: []
        },

        topMsgTimer: null

      }
    },
    watch: {
      src: {
        // 监听视频资源地址实时更新
        handler(val) {
          if (!val) return
          this.questionObj.index = 0
          this.flagObj.retry = 5
          this.flagObj.isPlaying = false
          this.flagObj.loadSuccess = false
          this.videoObj.videoUrl = val
          if (this.player) {
            this.reloadSrc(this.videoObj.videoUrl)
            if (this.player.markers && this.markers.length > 0) {
              this.player.markers.removeAll()
            }
          }
        },
        immediate: true
      },

      lastPlayTime: {
        //通过后台获取到上次播放进度
        handler(val) {
          if (typeof val == 'number' && val > 0 && this.resumePlaying) {
            this.showObj.resumePlayBtn = true
          }
        },
        immediate: true
      },

      maxPlayTime: {
        //通过后台获取到最大播放进度
        handler(val) {
          if (typeof val == 'number' && val > 0) {
            this.videoObj.watchMaxTime = val
          }
        },
        immediate: true
      },

      'videoObj.currentTime'(newV, oldV) {
        if (this.player) {
          if (newV - oldV > 2) {
            this.videoObj.copyCurrentTime = oldV
          }
          if (newV > this.videoObj.watchMaxTime) {
            let timeDiff = parseFloat(newV) - parseFloat(this.videoObj.watchMaxTime)
            if (timeDiff < 2) {
              this.videoObj.watchMaxTime = newV
            }
          }
        }
      },
      'flagObj.isPlaying'(newV) {
        this.$emit('update:playStatus', newV)
      }
    },
    computed: {
      videoWrapperId() {
        return `video-wrapper-${Math.floor(Math.random() * 100000000)}`
      },
    },
    methods: {
      /*****    自定义工具函数 start   *****/

      changeQuality(src, label) {
        //修改播放清晰度
        let copyCurrentTime = this.player.currentTime()
        this.reloadSrc(src)
        this.showObj.playQualityPanel = false
        jq('#quality').html(label)
        this.$nextTick(() => {
          this.player.currentTime(copyCurrentTime)
        })
      },

      topMsg(msg, sec = 5) {
        if (this.topMsgTimer) {
          clearTimeout(this.topMsgTimer)
          this.topMsgTimer = null
        }
        this.showObj.topMessage = msg
        this.showObj.topMessageShow = true
        this.topMsgTimer = setTimeout(() => {
          this.showObj.topMessage = ''
          this.showObj.topMessageShow = false
          clearTimeout(this.topMsgTimer)
          this.topMsgTimer = null
        }, sec * 1000)
      },

      //初始化视频播放器
      async initVideoPlayer() {
        if (this.player == null && this.flagObj.needinitial) {
          let controlBar = {
            //自定义控制栏
            ...this.controlBarOption,
          }
          if (this.pictureInPicture) {
            controlBar['PictureInPictureToggle'] = true
          }
          this.player = await videojs(this.videoWrapperId, {
            playbackRates: this.playbackRateArray,
            controlBar: {
              children: controlBar,
            },
            html5: {
              vhs: {
                overrideNative: true, //强制使用videojs里的hls.js
                cacheEncryptionKeys: true
              }
            }
          }, () => {
            //请求视频时附带token
            videojs.Vhs.xhr.beforeRequest = function(options) {
              if (options.uri.includes('ApacheLeaningVideo')) {
                options.headers = {
                  token: getToken()
                };
              }
              return options;
            };


            //jquery实现禁止快进开始
            jq(".vjs-progress-control").css("pointer-events", "none").css("width", "100%");
            jq(".vjs-progress-control").wrap(
              '<div class="progressMask" style="width:100%"></div>'); //在seekbar创建父元素progressMask
            jq(".progressMask").on('click', (e) => { //给progressMask绑定自定义方法
              let offsetX = e.offsetX
              let offsetWidth = e.target.offsetWidth
              let seekingTime = this.videoObj.duration * (offsetX / offsetWidth)
              if (this.progressControl) {
                if (seekingTime <= this.videoObj.watchMaxTime) {
                  //允许用户调到最大进度
                  this.player.currentTime(seekingTime)
                } else {
                  //禁止快进
                  let msg = '禁止快进，您的最大播放进度为：' + this.formatSeconds(this.videoObj.watchMaxTime, true)
                  this.topMsg(msg)
                }
              } else {
                this.player.currentTime(seekingTime)
              }
            })

            //实现清晰度切换
            jq(".vjs-control-bar").append(
              '<button class="vjs-control" id="quality">Auto</button>'
            );
            jq("#quality").on('click', (e) => {
              this.showObj.playQualityPanel = true
            });

            //实现全屏按钮
            jq(".vjs-control-bar").append(
              '<button class="vjs-control" id="fullScreenBtn"><b><i class="el-icon-full-screen"></i></b></button>'
            );
            jq("#fullScreenBtn").on("click", this.fullscreenToggle.bind(this))

            this.flagObj.needinitial = false
          });
        }
      },

      questionModalOpen() {
        if (this.questionObj.index + 1 <= this.markers.length) {
          let alreadyAnsweredSet = new Set(this.questionObj
            .alreadyAnswered) //this.questionObj.alreadyAnswered保持的是用户回答过的问题ID
          if (alreadyAnsweredSet.has(this.paramsObj.markersArray[this.questionObj.index].id)) {
            //判断当前问题用户曾经回答过，当前问题位置++
            this.questionObj.index++; //记录当前问题位置,然后弹窗
          } else {
            if (this.videoObj.currentTime == this.paramsObj.markersArray[this.questionObj.index].time) {
              this.player.pause();
              this.showObj.breakPointShow = true
            }
          }
        }
      },


      returnStyle(o) {
        //根据回答情况返回样式
        if (this.showObj.showAnswer) {
          if (o.value) {
            if (o.is_correct) {
              return 'color:#19be6b;'
            } else {
              return 'color:#fa3534;'
            }
          } else {
            if (o.is_correct) {
              return 'color:#ffaa00;'
            } else {
              return ''
            }
          }
        } else {
          if (o.value) {
            return 'color:#409fee;'
          } else {
            return ''
          }
        }
      },

      selectOption(index, type) {
        //选择选项
        if (this.showObj.showAnswer) {
          //已经提交不可继续选择
          return
        } else {
          let currentQuestion = this.markers[this.questionObj.index]
          if (type == 2) {
            if (currentQuestion.options[index].value == true) {
              currentQuestion.options[index].value = false
            } else {
              currentQuestion.options[index].value = true
            }
          } else if (type == 1 || type == 3) {
            currentQuestion.options.forEach((o, oindex) => {
              if (oindex == index) {
                o.value = true
              } else {
                o.value = false
              }
            })
          }
        }
      },

      closeModal() {
        this.showObj.breakPointShow = false;
      },

      submitAnswer() {
        this.showObj.showAnswer = true
        this.questionObj.remainingTime = 5
        this.startCountdown()
      },


      submitQuestion() {
        //提交回答情况
        this.showObj.showAnswer = true
        this.questionObj.remainingTime = 5
        this.startCountdown()
      },

      startCountdown() {
        // 开始倒计时
        this.questionObj.timer = setInterval(() => {
          if (this.questionObj.remainingTime > 1) {
            this.questionObj.remainingTime--; // 每秒减少1秒
          } else {
            clearInterval(this.questionObj.timer); // 清除定时器
            this.closeQuestionPanel(); // 关闭弹窗
          }
        }, 1000);
      },

      closeQuestionPanel() {
        //手动关闭
        if (this.questionObj.timer) {
          clearInterval(this.questionObj.timer); // 清除定时器
          this.questionObj.timer = null;
        }
        this.showObj.breakPointShow = false
        this.showObj.showAnswer = false
        this.questionObj.alreadyAnswered.push(this.markers[this.questionObj.index].id)
        this.player.play()
        this.questionObj.index++
      },


      //格式化秒数到时分秒格式
      formatSeconds(value, chinese) {
        let result = parseInt(value)
        let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600);
        let m = Math.floor((result / 60 % 60)) < 10 ? '0' + Math.floor((result / 60 % 60)) : Math.floor((result / 60 %
          60));
        let s = Math.floor((result % 60)) < 10 ? '0' + Math.floor((result % 60)) : Math.floor((result % 60));
        let res = '';
        if (chinese) {
          if (h !== '00') res += `${h}时`;
          if (m !== '00') res += `${m}分`;
          res += `${s}秒`;
        } else {
          if (h !== '00') res += `${h}:`;
          if (m !== '00') res += `${m}:`;
          res += `${s}s`;
        }
        return res;
      },

      //回到上次播放位置
      backToLastPlay() {
        if (this.lastPlayTime > 0) {
          // this.videoObj.watchMaxTime = this.lastPlayTime
          this.videoObj.copyCurrentTime = this.lastPlayTime
          this.player.currentTime(this.lastPlayTime)
          this.onPlay()
        }
      },

      //监听页面是否在前台展示
      handleVisibilityChange() {
        if (document.hidden && this.flagObj.isPlaying) {
          //页面从后台切回前台
          this.onPause()
          this.flagObj.needAlert = true
        } else if (!document.hidden && !this.flagObj.isPlaying) {
          if (this.flagObj.needAlert && !this.flagObj.hasAlerted) {
            this.flagObj.hasAlerted = true
            this.$alert('请不要在视频播放过程中离开本页面', '检测到离开', {
              confirmButtonText: '确定',
              callback: action => {
                this.flagObj.needAlert = false
              }
            });
          }
        }
      },


      //生成视频标点
      generateMarkers() {
        let alreadyAnsweredSet = new Set(this.questionObj
          .alreadyAnswered) //this.questionObj.alreadyAnswered保持的是用户回答过的问题ID
        this.paramsObj.markersArray = this.markers.filter(i => !alreadyAnsweredSet.has(i.id))
        //根据标点生成的自动暂停点

        if (this.finishPoint > 0) {
          this.paramsObj.markersArray.push({
            time: this.finishPoint <= this.videoObj.duration ? this.finishPoint : this.videoObj.duration,
            text: '完成点位',
            color: '#18b566'
          })
        }


        if (typeof this.player.markers === 'function') {
          //给视频进度打标点
          if (this.paramsObj.markersArray.length > 0) {
            this.player.markers({
              markerStyle: {
                // 标记点样式
                "width": "0.7em",
                "height": "0.7em",
                "bottom": "-0.20em",
                "border-radius": "50%",
                "position": "absolute",
                "font-size": "14px"
              },
              //鼠标移入标记点的提示
              markerTip: {
                display: true, // 是否显示
                text: function(marker) { //用于动态构建标记提示文本的回调函数,只需返回一个字符串，参数标记是传递给插件的标记对象
                  return marker.text;
                }
              },
              markers: this.paramsObj.markersArray,
            });
          }
        } else if (typeof this.player.markers === 'object') {
          //切换视频时更新视频标点
          this.player.markers.reset(this.paramsObj.markersArray)
        }
      },

      //更新水印位置
      updateWatermartPosition() {
        if (!this.flagObj.destroyed) {
          var a = Math.ceil(Math.random() * 96)
          var b = 100
          let watermark
          this.watermarkTimer = setInterval(() => {
            watermark = this.watermark + " " + new Date().toLocaleDateString() + " " + new Date()
              .toLocaleTimeString().slice(0, -3)
            let fontSize = 20
            var borderLeft = watermark.length * fontSize / this.$refs.myVideo.clientWidth * 100 * -1

            if (this.flagObj.isPlaying) {
              if (b > borderLeft) {
                b -= 0.2; //水印向左平移
              } else if (b <= borderLeft) {
                //重新生成水印位置
                b = 100
                a = Math.ceil(Math.random() * 96)
              }
            }

            this.player.watermark({
              file: '',
              text: watermark,
              fontsize: 20,
              marginTop: 2,
              marginBottom: 2,
              xytype: 1,
              xpos: a,
              ypos: b,
              xrepeat: 0,
              opacity: 0.6,
              debug: true,
              clickable: false,
            });
          }, 100);
        }
      },


      //自定义的视频全屏事件
      fullscreen() {
        let playerLive = document.querySelector('.video-play-container');
        try {
          if (playerLive.requestFullscreen) {
            this.flagObj.isFullscreen = true
            return playerLive.requestFullscreen();
          } else if (playerLive.webkitRequestFullScreen) {
            this.flagObj.isFullscreen = true
            return playerLive.webkitRequestFullScreen();
          } else if (playerLive.mozRequestFullScreen) {
            this.flagObj.isFullscreen = true
            return playerLive.mozRequestFullScreen();
          } else if (playerLive.msRequestFullscreen) {
            this.flagObj.isFullscreen = true
            playerLive.msRequestFullscreen();
          }
        } catch (err) {
          // 如果原生全屏api出错，则使用video.js自带的全屏api
          this.flagObj.isFullscreen = true
          this.player.requestFullscreen();
        }
      },

      //退出全屏
      exitFullscreen() {
        this.player.exitFullscreen()
        this.flagObj.isFullscreen = false
      },

      //全屏切换事件
      fullscreenToggle() {
        if (this.flagObj.isFullscreen) {
          this.exitFullscreen()
        } else {
          this.fullscreen()
        }
      },

      reloadSrc(src) {
        // 重新加载视频资源
        if (src) {
          let url = src.toLowerCase();
          let type;

          // 根据URL后缀猜测视频类型
          if (url.includes('.m3u8') || url.includes('apacheleaningvideo')) {
            type = 'application/x-mpegURL';
          } else if (url.includes('.mp4') || url.includes('.m4v')) {
            type = 'video/mp4';
          } else if (url.includes('.webm')) {
            type = 'video/webm';
          } else if (url.includes('.ogg') || url.includes('.ogv')) {
            type = 'video/ogg';
          } else if (url.includes('.mov')) {
            type = 'video/quicktime';
          } else if (url.includes('.avi')) {
            type = 'video/x-msvideo';
          } else if (url.includes('.wmv')) {
            type = 'video/x-ms-wmv';
          } else if (url.includes('.flv')) {
            type = 'video/x-flv';
          } else if (url.includes('.mkv')) {
            type = 'video/x-matroska';
          } else if (url.includes('.3gp')) {
            type = 'video/3gpp';
          } else if (url.includes('.3g2')) {
            type = 'video/3gpp2';
          }

          const tryNextType = (index) => {
            if (!type && index < this.videoObj.types.length) {
              // 如果没有匹配到具体的类型，则尝试预设的类型列表
              type = this.videoObj.types[index];

              this.player.src({
                src: src,
                type: type
              });

              this.player.one('error', () => {
                // 如果出错，尝试下一个类型
                type = null; // 清除已设置的类型，继续尝试下一个
                tryNextType(index + 1);
              });

            } else if (type) {
              // 直接使用猜测的类型加载视频
              this.player.src({
                src: src,
                type: type
              });

            } else {
              console.error('无法找到合适的视频类型');
            }
          };

          tryNextType(0);
        }
      },


      /*****    自定义工具函数 start   *****/

      /*****    video的回调事件 start   *****/


      onLoadStart(e) {
        // console.log('提示视频的元数据已开始加载，无法获取视频时长：',this.$refs.myVideo.duration);
        this.$emit('loadStart', e);
      },
      onDurationChange(e) {
        // console.log('提示视频的时长已改变：',this.$refs.myVideo.duration);//视频的实际时长（单位：秒）
        this.$emit('durationChange', e);
      },
      onLoadedMetadata(e) {
        // console.log('提示视频的元数据已加载，可以调回上次播放位置');
        this.flagObj.loadSuccess = true
        this.videoObj.duration = parseInt(this.player.duration())
        if (typeof this.player.markers === 'function') {
          this.generateMarkers()
        }
        this.$emit('loadedMetadata', e);
      },
      onLoadedData(e) {
        // console.log('提示当前帧的数据是可用的');
        this.$emit('loadedData', e);
      },
      onProgress(e) {
        // console.log('提示视频正在下载中');
        this.$emit('progress', e);
      },
      onCanPlay(e) {
        // console.log('提示该视频已准备好开始播放');
        if (typeof this.player.markers === 'object') {
          this.generateMarkers()
        }
        this.$emit('canPlay', e);
      },
      onCanPlayThrough(e) {
        // console.log('提示视频能够不停顿地一直播放');
        this.$emit('canPlayThrough', e);
      },
      onPlay(e) {
        // console.log('提示该视频正在播放中');
        this.player.play()
        this.flagObj.hasAlerted = false // 每次开始播放前重置
        this.flagObj.isPlaying = true
        this.showObj.resumePlayBtn = false
        this.$emit('play', e);
      },
      onPause(e) {
        // console.log('暂停播放');
        this.player.pause()
        this.flagObj.isPlaying = false
        this.$emit('pause', e)
      },
      onSeeking(e) {
        this.$emit('seeking', e);
      },
      onSeeked(e) {
        // console.log('进度条已经移动到了新的位置：', this.player.currentTime());
        this.$emit('seeked', e);
      },
      onWaiting(e) {
        // console.log('视频加载等待');
        this.$emit('waiting', e);
      },
      onPlaying(e) {
        // console.log('playing');
        this.$emit('playing', e);
      },
      onTimeUpdate(e) {
        if (this.player) {
          this.videoObj.currentTime = Math.floor(this.player.currentTime())
          if (this.questionControl && this.paramsObj.markersArray.length > 0) {
            this.questionModalOpen()
          }
        }
        this.$emit('timeUpdate', e);
      },
      onEnded(e) {
        // console.log('视频播放完了');
        this.$emit('ended', e);
      },
      onError(e) {

        // this.reloadSrc(this.videoObj.videoUrl)
        // console.log('视频格式出错了');
        this.$emit('error', e);
      },
      onVolumeChange(e) {
        // console.log('音量大小改变');
        this.$emit('volumeChange', e);
      },
      onStalled(e) {
        // console.log('媒体数据暂时不可用');
        // 在这里处理 stall 事件，例如提示用户或者重试加载
        this.$emit('stalled', e);
      },
      onRateChange(e) {

        this.topMsg('使用倍数播放将不上传进度，无法获取积分')
        this.$emit('rateChange', e);
      },

      onDestroy() {
        if (this.player) {
          //如果播放器还存在，则销毁播放器
          this.player.pause();
          this.player.dispose();
          this.player = null;
        }
        if (this.watermarkTimer) {
          //如果水印还存在，则销毁播放器
          clearInterval(this.watermarkTimer)
          this.watermarkTimer = null
        }

        if (this.questionObj.timer) {
          //如果水印还存在，则销毁播放器
          clearInterval(this.questionObj.timer)
          this.questionObj.timer = null
        }
        this.flagObj.destroyed = true
      },



      /*****    video的回调事件 end   *****/












    },

    beforeDestroy() {
      if (this.player) {
        //如果播放器还存在，则销毁播放器
        this.player.pause();
        this.player.dispose();
        this.player = null;
      }
      if (this.watermarkTimer) {
        //如果水印还存在，则销毁播放器
        clearInterval(this.watermarkTimer)
        this.watermarkTimer = null
      }
      if (this.questionObj.timer) {
        clearTimeout(this.questionObj.timer)
        this.questionObj.timer = null
      }
      if (this.topMsgTimer) {
        clearTimeout(this.topMsgTimer)
        this.topMsgTimer = null
      }
      this.flagObj.destroyed = true
    },

    mounted() {
      this.$nextTick(() => {
        if (this.player == null && this.flagObj.needinitial) {
          //视频地址和需要初始化标志位为真时
          this.initVideoPlayer()
        }
      })


      if (!this.playInBackground) {
        //不允许后台播放
        document.addEventListener('visibilitychange', this.handleVisibilityChange)
      }
      if (this.watermark) {
        //加载自定义水印
        this.updateWatermartPosition()
      }



      if (!this.flagObj.loadSuccess && this.flagObj.retry > 0) {
        //视频加载失败时，尝试按格式加载
        let reloadTimer = setTimeout(() => {
          this.reloadSrc(this.videoObj.videoUrl)
          clearInterval(reloadTimer)
        }, 1)
      }
      //如果可以查到视频播放进度，需要后端请求进度后，设置this.videoObj.watchMaxTime和this.videoObj.copyCurrentime
    }

  }
</script>

<style lang="scss" scoped>
  @import url('./video-js.css');
  @import url('./videojs.watermark.css');
  @import url('./videojs.markers.css');


  .playbackRateControl {

    width: 30%;
    height: 100%;
    position: absolute;
    right: 0;
    color: white;
    padding: 5% 3%;
    background-color: rgba(12, 12, 12, 0.8);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    z-index: 1500;

    .playbackRatePanel {
      width: 90%;
      height: 15%;
      border-radius: 5px;
      background-color: rgba(80, 80, 80, 0.8);
      padding-left: 1em;
      display: flex;
      align-items: center;
    }
  }



  .el-radio-group {
    width: 100%;


  }

  .video-js .vjs-progress-control {
    display: none;
  }



  .video-play-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .video-js .vjs-tech {
      position: relative !important;
    }

    .player {
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 1000;
    }

    .resumePlayBtn {
      position: absolute;
      z-index: 19999999;
      left: 10px;
      bottom: 20px;
      color: white;
      padding: 0 1em;
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0.7);
    }

    .topMessage {
      position: absolute;
      z-index: 19999999;
      text-align: center;
      top: 20px;
      color: white;
      // font-size: 16px;
      padding: 5px 20px;
      border-radius: 5px;
      background-color: rgba(0, 0, 0, 0.7);
    }

    .modal {
      position: absolute;
      z-index: 19999999;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      overflow: auto;
      background-color: rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;

      /* 模态内容 */
      .modal-content {
        background-color: #fefefe;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
        min-width: 600px;
        // max-width: 500px;
        box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 7px 20px 0 rgba(0, 0, 0, 0.19);

        .modal-rightBtn {
          float: right;
        }

        .modal-title {
          display: flex;
          align-items: baseline;
          font-weight: bold;
          font-size: 20px;
          // text-align: center;
        }

        .modal-btn {
          margin-top: 20px;
          text-align: center;
        }

        .option-box {
          // width: 1%;

          .m_options {
            margin-top: 10px;
            width: 100%;
            height: auto;
            // height: auto;
          }
        }

        /* 关闭按钮 */
        .close {
          color: #aaa;
          float: right;
          font-size: 28px;
          font-weight: bold;

          &:hover,
          &:focus {
            color: red;
            text-decoration: none;
            cursor: pointer;
          }
        }
      }
    }







    /* 淡入动画 */
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.5s;
    }

    .fade-enter,
    .fade-leave-to

    /* .fade-leave-active 在 Vue 2.1.8+ 中 */
      {
      opacity: 0;
    }
  }
</style>
