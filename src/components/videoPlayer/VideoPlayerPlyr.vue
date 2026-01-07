<template>
  <div class="video-play-container">
    <!-- Plyr Video Player -->
    <div ref="plyrContainer" class="plyr-wrapper">
      <video ref="videoElement" controls playsinline @timeupdate="onTimeUpdate" @play="onPlay" @pause="onPause" @ended="onEnded" @seeking="onSeeking" @seeked="onSeeked" @loadstart="onLoadStart" @loadedmetadata="onLoadedMetadata" @loadeddata="onLoadedData" @progress="onProgress" @canplay="onCanPlay" @canplaythrough="onCanPlayThrough" @waiting="onWaiting" @error="onError" @volumechange="onVolumeChange" @ratechange="onRateChange"></video>
    </div>

    <!-- Quality selector -->
    <div v-show="showObj.playQualityPanel" class="playbackRateControl">
      <div v-for="(src, label) in other_src" :key="label" class="playbackRatePanel" @click="changeQuality(src, label)">
        {{ label }}
      </div>
    </div>

    <!-- Resume play button -->
    <div v-show="showObj.resumePlayBtn" class="resumePlayBtn">
      <div v-if="lastPlayTime !== videoObj.duration">
        {{ $t('videoPlayer.resume_play_question', { time: formatSeconds(lastPlayTime, true) }) }}
        <el-button type="text" @click="backToLastPlay">{{ c.confirm }}</el-button>
        <el-button type="text" class="text-red" @click="showObj.resumePlayBtn = false">{{ c.cancel }}</el-button>
      </div>
    </div>

    <!-- Top message -->
    <div v-if="showObj.topMessageShow" class="topMessage">
      <div>
        {{ showObj.topMessage }}
        <el-button type="text" class="text-blue" @click="showObj.topMessageShow = false">{{ c.cancel }}</el-button>
      </div>
    </div>

    <!-- Question modal -->
    <transition name="fade">
      <div v-if="showObj.breakPointShow" class="modal">
        <div class="modal-content" @click.stop>
          <el-button v-if="!showObj.showAnswer" class="modal-rightBtn" type="primary" @click="submitAnswer">
            {{ l.submit_answer }}
          </el-button>
          <el-button v-else class="modal-rightBtn" type="success" @click="closeModal">{{ questionObj.remainingTime }}{{ l.seconds_to_close }}</el-button>

          <div class="modal-title">
            <div>
              <span style="color: #409fee; font-size: 30px">{{ questionObj.index + 1 }}</span>
              <span style="margin-right: 0.5em">/{{ markers.length }}</span>
            </div>
            <div>{{ markers[questionObj.index].text }}</div>
          </div>

          <div v-show="markers[questionObj.index].question_type === 0" class="option-box">
            <el-input v-model="fillin" type="textarea" :rows="4"></el-input>
          </div>

          <div class="option-box">
            <div v-for="(option, index) in markers[questionObj.index].options" :key="option.id" class="m_options" :style="returnStyle(option)" @click="selectOption(index, markers[questionObj.index].question_type)">
              <span class="icon_type">
                <span v-show="markers[questionObj.index].question_type === 1">
                  <i v-show="!option.value" class="far fa-circle"></i>
                  <i v-show="option.value === true" class="far fa-dot-circle"></i>
                </span>
                <span v-show="markers[questionObj.index].question_type === 2">
                  <i v-show="!option.value" class="far fa-square"></i>
                  <i v-show="option.value === true" class="far fa-check-square"></i>
                </span>
              </span>
              <span class="text">{{ option.name_label }}</span>
              <span v-show="showObj.showAnswer" style="float: right">
                <i v-if="option.value === true && option.is_correct === true" class="fas fa-check-circle" style="color: #19be6b"></i>
                <i v-else-if="option.value === true && option.is_correct === false" class="fas fa-times-circle" style="color: #fa3534"></i>
                <i v-else-if="!option.value && option.is_correct === true" class="fas fa-info-circle" style="color: #ffaa00"></i>
              </span>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import 'plyr/dist/plyr.css'

import CryptoJS from 'crypto-js'
import Hls from 'hls.js'
import Plyr from 'plyr'

import { getToken } from '@/utils/auth'

export default {
  name: 'videoPlayerCom',
  props: {
    palyStatus: {
      type: Boolean,
      default: false,
    },
    src: {
      type: String,
      default: '',
    },
    other_src: {
      type: Object,
      default() {
        return {}
      },
    },
    autoplay: {
      type: Boolean,
      default: false,
    },
    controls: {
      type: Boolean,
      default: true,
    },
    loop: {
      type: Boolean,
      default: false,
    },
    muted: {
      type: Boolean,
      default: false,
    },
    poster: {
      type: String,
      default: '',
    },
    preload: {
      type: String,
      default: 'auto',
    },
    playbackRate: {
      type: Number,
      default: 1,
    },
    playbackRateArray: {
      type: Array,
      default() {
        return [1]
      },
    },
    pictureInPicture: {
      type: Boolean,
      default: false,
    },
    progressControl: {
      type: Boolean,
      default: false,
    },
    questionControl: {
      type: Boolean,
      default: false,
    },
    markers: {
      type: Array,
      default() {
        return []
      },
    },
    finishPoint: {
      type: Number,
      default: 0,
    },
    playInBackground: {
      type: Boolean,
      default: false,
    },
    resumePlaying: {
      type: Boolean,
      default: true,
    },
    lastPlayTime: {
      type: Number,
      default: 0,
    },
    maxPlayTime: {
      type: Number,
      default: 0,
    },
    controlBarOption: {
      type: Object,
      default() {
        return {}
      },
    },
    watermark: {
      type: [String, Number],
      default: '',
    },
  },

  data() {
    return {
      player: null,
      hls: null,
      watermarkTimer: null,
      radio: '',
      checkbox: [],
      fillin: '',
      videoObj: {
        videoUrl: '',
        duration: 0,
        watchMaxTime: 0,
        currentTime: 0,
        copyCurrentTime: 0,
      },
      flagObj: {
        retry: 5,
        destroyed: false,
        needinitial: true,
        isFullscreen: false,
        isPlaying: false,
        needAlert: false,
        loadSuccess: false,
        hasAlerted: false,
      },
      paramsObj: {
        markersIndex: 0,
        markersArray: [],
        alreadyAnswered: [],
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
        list: [],
      },
      topMsgTimer: null,
    }
  },

  watch: {
    src: {
      handler(val) {
        if (!val) return
        this.questionObj.index = 0
        this.flagObj.retry = 5
        this.flagObj.isPlaying = false
        this.flagObj.loadSuccess = false
        this.videoObj.videoUrl = val
        if (this.player) {
          this.loadVideoSource(val)
        }
      },
      immediate: true,
    },

    lastPlayTime: {
      handler(val) {
        if (typeof val === 'number' && val > 0 && this.resumePlaying) {
          this.showObj.resumePlayBtn = true
        }
      },
      immediate: true,
    },

    maxPlayTime: {
      handler(val) {
        if (typeof val === 'number' && val > 0) {
          this.videoObj.watchMaxTime = val
        }
      },
      immediate: true,
    },

    'videoObj.currentTime'(newV, oldV) {
      if (this.player) {
        if (newV - oldV > 2) {
          this.videoObj.copyCurrentTime = oldV
        }
        if (newV > this.videoObj.watchMaxTime) {
          const timeDiff = parseFloat(newV) - parseFloat(this.videoObj.watchMaxTime)
          if (timeDiff < 2) {
            this.videoObj.watchMaxTime = newV
          }
        }
      }
    },

    'flagObj.isPlaying'(newV) {
      this.$emit('update:playStatus', newV)
    },
  },

  methods: {
    /**
     * Initialize Plyr player
     */
    initVideoPlayer() {
      if (this.player === null && this.flagObj.needinitial) {
        const plyrOptions = {
          controls: this.controls ? ['play-large', 'play', 'progress', 'current-time', 'duration', 'mute', 'volume', 'captions', 'settings', 'pip', 'fullscreen'] : [],
          autoplay: this.autoplay,
          muted: this.muted,
          loop: { active: this.loop },
          displayDuration: true,
          invertTime: false,
          toggleInvert: true,
          seekTime: 10,
          speed: { selected: 1, options: this.playbackRateArray },
          keyboard: { focused: true, global: false },
          tooltips: { controls: true, seek: true },
          captions: { active: true, language: 'auto', update: false },
          fullscreen: { enabled: true, fallback: true, iosNative: true },
          ratio: '16:9',
          storage: { enabled: true, key: 'plyr' },
          preview: { thumbnails: null, lines: null },
          ads: { enabled: false },
          analytics: { enabled: false },
          vimeo: { premium: false, referrer: null },
          youtube: { noCookie: true, rel: 0, showinfo: 0, iv_load_policy: 3, modestbranding: 1 },
          quality: { default: 576, options: [360, 576, 720, 1080, 1440, 4320] },
        }

        this.player = new Plyr(this.$refs.videoElement, plyrOptions)

        // Setup HLS.js for M3U8 with encryption
        this.setupHLS()

        this.flagObj.needinitial = false
      }
    },

    /**
     * Decrypt the encryption key from server
     * Server returns 60-byte encrypted key, we need to decrypt to 16-byte AES key
     */
    decryptServerKey(encryptedKeyData) {
      // Base64 decode helper
      function Base64() {
        var _keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='

        this.decode = function (input) {
          var output = ''
          var chr1, chr2, chr3
          var enc1, enc2, enc3, enc4
          var i = 0
          input = input.replace(/[^A-Za-z0-9\+\/\=]/g, '')
          while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++))
            enc2 = _keyStr.indexOf(input.charAt(i++))
            enc3 = _keyStr.indexOf(input.charAt(i++))
            enc4 = _keyStr.indexOf(input.charAt(i++))
            chr1 = (enc1 << 2) | (enc2 >> 4)
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2)
            chr3 = ((enc3 & 3) << 6) | enc4
            output = output + String.fromCharCode(chr1)
            if (enc3 != 64) {
              output = output + String.fromCharCode(chr2)
            }
            if (enc4 != 64) {
              output = output + String.fromCharCode(chr3)
            }
          }
          // UTF-8 decode
          var string = ''
          var idx = 0
          var c = 0, c2 = 0, c3 = 0
          while (idx < output.length) {
            c = output.charCodeAt(idx)
            if (c < 128) {
              string += String.fromCharCode(c)
              idx++
            } else if (c > 191 && c < 224) {
              c2 = output.charCodeAt(idx + 1)
              string += String.fromCharCode(((c & 31) << 6) | (c2 & 63))
              idx += 2
            } else {
              c2 = output.charCodeAt(idx + 1)
              c3 = output.charCodeAt(idx + 2)
              string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63))
              idx += 3
            }
          }
          return string
        }
      }

      try {
        let key = CryptoJS.enc.Utf8.parse('jM0q0hBUf94uInL4FSa9sNvqZiO3b194')
        let iv = CryptoJS.enc.Utf8.parse('u85vDXaf2qZwgQj7')
        
        // Decode encrypted key from server
        const encryptedKeyText = new TextDecoder('utf-8').decode(encryptedKeyData)
        const base64Decoded = new Base64().decode(encryptedKeyText)
        
        let decrypted = CryptoJS.AES.decrypt(
          {
            ciphertext: CryptoJS.enc.Base64.parse(base64Decoded),
          },
          key,
          {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
          }
        )
        let patchKey = decrypted.toString(CryptoJS.enc.Utf8)

        // Convert to ArrayBuffer
        var fullkey = (function str2ab(str) {
          var buf = new ArrayBuffer(str.length)
          var bufView = new Uint8Array(buf)
          for (var i = 0, strLen = str.length; i < strLen; i++) {
            bufView[i] = str.charCodeAt(i)
          }
          return buf
        })(patchKey)

        return new Uint8Array(fullkey)
      } catch (err) {
        console.error('❌ Lỗi decrypt key:', err)
        return null
      }
    },

    /**
     * Setup HLS.js for M3U8 streaming with encryption support
     */
    setupHLS() {
      if (Hls.isSupported()) {
        console.log('📺 Initializing HLS.js for M3U8 streaming...')

        // Enable verbose logging if window.__HLS_DEBUG__ is set
        const hlsDebugMode = typeof window !== 'undefined' && window.__HLS_DEBUG__
        if (hlsDebugMode) {
          console.log('🐛 HLS.js verbose logging enabled (window.__HLS_DEBUG__ = true)')
        }

        // Store reference to component for use in loader
        const self = this
        const DefaultLoader = Hls.DefaultConfig.loader

        // Custom Loader Class để intercept key requests
        class CustomLoader extends DefaultLoader {
          constructor(config) {
            super(config)
            this.decryptServerKey = self.decryptServerKey.bind(self)
          }

          load(context, config, callbacks) {
            // Intercept key requests
            if (context.type === 'key') {
              console.log('🔑 [CustomLoader] Intercepting key request:', context.url)
              
              const originalOnSuccess = callbacks.onSuccess
              
              // Wrap onSuccess to decrypt key
              callbacks.onSuccess = (response, stats, context, networkDetails) => {
                console.log('🔑 [CustomLoader] Key response received, size:', response.data?.byteLength || 0, 'bytes')
                
                if (response.data && response.data.byteLength !== 16) {
                  // Decrypt the key
                  const encryptedKey = new Uint8Array(response.data)
                  console.log('🔓 [CustomLoader] Decrypting key from', encryptedKey.length, 'bytes...')
                  
                  const decryptedKey = self.decryptServerKey(encryptedKey)
                  
                  if (decryptedKey && decryptedKey.length === 16) {
                    console.log('✅ [CustomLoader] Key decrypted successfully:', decryptedKey.length, 'bytes')
                    // Replace response data with decrypted key
                    response.data = decryptedKey.buffer
                  } else {
                    console.error('❌ [CustomLoader] Key decryption failed!')
                  }
                }
                
                // Call original callback with modified response
                originalOnSuccess(response, stats, context, networkDetails)
              }
            }
            
            // Call parent load method
            super.load(context, config, callbacks)
          }
        }

        this.hls = new Hls({
          debug: hlsDebugMode, // Set to true for verbose HLS.js logging
          
          // ========== CUSTOM LOADER ==========
          loader: CustomLoader,
          
          // ========== BUFFER CONFIGURATION ==========
          maxBufferLength: 30,
          maxMaxBufferLength: 60,
          maxBufferSize: 60 * 1000 * 1000,
          maxBufferHole: 0.5,
          
          // ========== LOADING CONFIGURATION ==========
          highBufferWatchdogPeriod: 3,
          nudgeOffset: 0.1,
          nudgeMaxRetry: 5,
          maxFragLookUpTolerance: 0.25,
          
          startLevel: -1,
          autoStartLoad: true,
          startPosition: -1,
          defaultAudioCodec: undefined,
          
          liveSyncDurationCount: 3,
          liveMaxLatencyDurationCount: 10,
          
          lowBufferWatchdogPeriod: 0.5,
          
          fragLoadingTimeOut: 20000,
          fragLoadingMaxRetry: 6,
          fragLoadingRetryDelay: 1000,
          fragLoadingMaxRetryTimeout: 64000,
          
          keyLoadingTimeOut: 20000,
          keyLoadingMaxRetry: 6,
          keyLoadingRetryDelay: 1000,
          
          forceKeyFrameOnDiscontinuity: true,
          
          // ========== XHR SETUP ==========
          xhrSetup: (xhr, url) => {
            if (url.includes('ApacheLeaningVideo')) {
              xhr.setRequestHeader('token', getToken())
              console.log('📥 XHR setup for video resource:', url)
            }
          },
        })

        this.hls.attachMedia(this.$refs.videoElement)
        console.log('✅ HLS.js attached to video element')

        this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
          this.flagObj.loadSuccess = true
          console.log('📝 HLS manifest parsed successfully')
          if (this.player) {
            console.log('▶️ Auto-playing video...')
            // this.player.play()
          }
        })

        this.hls.on(Hls.Events.ERROR, (event, data) => {
          console.error('❌ HLS Error Event:', {
            type: data.type,
            details: data.details,
            fatal: data.fatal,
            error: data.error?.message,
          })

          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.log('🔄 Network error detected, attempting to recover...')
                if (this.hls) {
                  this.hls.startLoad()
                }
                break
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.log('🔄 Media error detected, attempting to recover...')
                if (this.hls) {
                  this.hls.recoverMediaError()
                }
                break
              default:
                console.error('💥 Fatal HLS error, cannot recover')
                this.topMsg('视频加载失败，请刷新重试')
                break
            }
          } else {
            // Non-fatal errors - handle specific cases
            if (data.details === 'bufferStalledError') {
              console.warn('⚠️ Buffer stalled, attempting to recover by restarting load...')
              // Khi buffer stall, thử restart load để lấy thêm fragment
              if (this.hls) {
                this.hls.startLoad()
              }
            } else {
              console.warn('⚠️ Non-fatal HLS error:', data.details)
            }
          }
        })

        // Additional event listeners for debugging
        this.hls.on(Hls.Events.FRAG_PARSING_INIT_SEGMENT, () => {
          console.log('📦 Init segment parsed')
        })

        this.hls.on(Hls.Events.FRAG_LOADED, (event, data) => {
          console.log('📥 Fragment loaded:', {
            sn: data.frag.sn,
            start: data.frag.start,
            duration: data.frag.duration,
            end: data.frag.start + data.frag.duration
          })
        })

        this.hls.on(Hls.Events.FRAG_LOADING, (event, data) => {
          console.log('📥 Loading fragment:', {
            sn: data.frag.sn,
            start: data.frag.start,
            duration: data.frag.duration
          })
        })
        
        // Monitor buffer append
        this.hls.on(Hls.Events.BUFFER_APPENDED, (event, data) => {
          console.log('📊 Buffer appended:', {
            type: data.type,
            timeRanges: data.timeRanges
          })
        })
        
        // Monitor buffer status
        this.hls.on(Hls.Events.FRAG_BUFFERED, (event, data) => {
          console.log('✅ Fragment buffered:', {
            sn: data.frag.sn,
            start: data.frag.start,
            end: data.frag.start + data.frag.duration
          })
        })

        this.hls.on(Hls.Events.KEY_LOADING, (event, data) => {
          console.log('🔐 Loading encryption key for fragment:', {
            fragSn: data.frag?.sn,
            keyUri: data.frag?.decryptdata?.uri
          })
        })

        this.hls.on(Hls.Events.KEY_LOADED, (event, data) => {
          console.log('🔑 KEY_LOADED - Raw key received:', {
            fragSn: data.frag?.sn,
            keyByteLength: data.frag?.decryptdata?.key?.byteLength
          })
          
          // Decrypt key từ server (60 bytes) thành AES key (16 bytes)
          if (data.frag && data.frag.decryptdata && data.frag.decryptdata.key) {
            const rawKey = data.frag.decryptdata.key
            
            // Chỉ decrypt nếu key chưa phải 16 bytes
            if (rawKey.byteLength !== 16) {
              console.log('🔓 Decrypting server key:', rawKey.byteLength, 'bytes → 16 bytes')
              
              const decryptedKey = this.decryptServerKey(rawKey)
              
              if (decryptedKey && decryptedKey.length === 16) {
                // QUAN TRỌNG: Ghi đè key trong decryptdata
                data.frag.decryptdata.key = decryptedKey
                console.log('✅ Key decrypted and set successfully')
              } else {
                console.error('❌ Key decryption failed!')
              }
            } else {
              console.log('✅ Key already 16 bytes, using directly')
            }
          }
        })

        // Note: HLS.js handles key decryption automatically after receiving the key.
        // The KEY_LOADED event just confirms the key was received.
        // In most cases, you don't need to manually process KEY_LOADED events.
      } else if (this.$refs.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        // Fallback for Safari native HLS support
        console.log('🍎 Using Safari native HLS support')
        this.$refs.videoElement.src = this.videoObj.videoUrl
      }
    },

    /**
     * Load video source with HLS support
     */
    loadVideoSource(src) {
      if (!src) return

      if (this.hls) {
        this.hls.detachMedia()
        this.hls.destroy()
      }

      this.videoObj.videoUrl = src

      if (Hls.isSupported()) {
        this.setupHLS()
        this.hls.loadSource(src)
      } else if (this.$refs.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
        this.$refs.videoElement.src = src
      } else {
        // Fallback to direct video load
        this.$refs.videoElement.src = src
      }
    },

    /**
     * Change video quality
     */
    changeQuality(src, label) {
      const currentTime = this.player.currentTime
      this.loadVideoSource(src)
      this.showObj.playQualityPanel = false

      this.$nextTick(() => {
        if (Hls.isSupported() && this.hls) {
          this.hls.on(Hls.Events.MANIFEST_PARSED, () => {
            this.player.currentTime = currentTime
            this.player.play()
          })
        } else {
          this.player.currentTime = currentTime
          this.player.play()
        }
      })
    },

    /**
     * Show top message
     */
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

    /**
     * Handle question modal
     */
    questionModalOpen() {
      if (this.questionObj.index + 1 <= this.markers.length) {
        const alreadyAnsweredSet = new Set(this.questionObj.alreadyAnswered)
        if (alreadyAnsweredSet.has(this.paramsObj.markersArray[this.questionObj.index].id)) {
          this.questionObj.index++
        } else {
          if (this.videoObj.currentTime === this.paramsObj.markersArray[this.questionObj.index].time) {
            this.player.pause()
            this.showObj.breakPointShow = true
          }
        }
      }
    },

    /**
     * Return style for options
     */
    returnStyle(option) {
      if (this.showObj.showAnswer) {
        if (option.value) {
          if (option.is_correct) {
            return 'color: #19be6b;'
          } else {
            return 'color: #fa3534;'
          }
        } else {
          if (option.is_correct) {
            return 'color: #ffaa00;'
          } else {
            return ''
          }
        }
      } else {
        if (option.value) {
          return 'color: #409fee;'
        } else {
          return ''
        }
      }
    },

    /**
     * Select option
     */
    selectOption(index, type) {
      if (this.showObj.showAnswer) {
        return
      }

      const currentQuestion = this.markers[this.questionObj.index]
      if (type === 2) {
        if (currentQuestion.options[index].value === true) {
          currentQuestion.options[index].value = false
        } else {
          currentQuestion.options[index].value = true
        }
      } else if (type === 1 || type === 3) {
        currentQuestion.options.forEach((option, oindex) => {
          option.value = oindex === index
        })
      }
    },

    /**
     * Close modal
     */
    closeModal() {
      this.showObj.breakPointShow = false
    },

    /**
     * Submit answer
     */
    submitAnswer() {
      this.showObj.showAnswer = true
      this.questionObj.remainingTime = 5
      this.startCountdown()
    },

    /**
     * Start countdown
     */
    startCountdown() {
      this.questionObj.timer = setInterval(() => {
        if (this.questionObj.remainingTime > 1) {
          this.questionObj.remainingTime--
        } else {
          clearInterval(this.questionObj.timer)
          this.closeQuestionPanel()
        }
      }, 1000)
    },

    /**
     * Close question panel
     */
    closeQuestionPanel() {
      if (this.questionObj.timer) {
        clearInterval(this.questionObj.timer)
        this.questionObj.timer = null
      }
      this.showObj.breakPointShow = false
      this.showObj.showAnswer = false
      this.questionObj.alreadyAnswered.push(this.markers[this.questionObj.index].id)
      this.player.play()
      this.questionObj.index++
    },

    /**
     * Format seconds to time string
     */
    formatSeconds(value, chinese) {
      const result = parseInt(value)
      let h = Math.floor(result / 3600) < 10 ? '0' + Math.floor(result / 3600) : Math.floor(result / 3600)
      let m = Math.floor((result / 60) % 60) < 10 ? '0' + Math.floor((result / 60) % 60) : Math.floor((result / 60) % 60)
      let s = Math.floor(result % 60) < 10 ? '0' + Math.floor(result % 60) : Math.floor(result % 60)
      let res = ''

      if (chinese) {
        if (h !== '00') res += `${h}时`
        if (m !== '00') res += `${m}分`
        res += `${s}秒`
      } else {
        if (h !== '00') res += `${h}:`
        if (m !== '00') res += `${m}:`
        res += `${s}s`
      }

      return res
    },

    /**
     * Back to last play time
     */
    backToLastPlay() {
      if (this.lastPlayTime > 0) {
        this.videoObj.copyCurrentTime = this.lastPlayTime
        this.player.currentTime = this.lastPlayTime
        this.onPlay()
      }
    },

    /**
     * Handle visibility change
     */
    handleVisibilityChange() {
      if (document.hidden && this.flagObj.isPlaying) {
        this.onPause()
        this.flagObj.needAlert = true
      } else if (!document.hidden && !this.flagObj.isPlaying) {
        if (this.flagObj.needAlert && !this.flagObj.hasAlerted) {
          this.flagObj.hasAlerted = true
          this.$alert(this.l.prevent_leaving, this.l.leaving_detected, {
            confirmButtonText: this.c.confirm,
            callback: (action) => {
              this.flagObj.needAlert = false
            },
          })
        }
      }
    },

    /**
     * Generate markers
     */
    generateMarkers() {
      const alreadyAnsweredSet = new Set(this.questionObj.alreadyAnswered)
      this.paramsObj.markersArray = this.markers.filter((i) => !alreadyAnsweredSet.has(i.id))

      if (this.finishPoint > 0) {
        this.paramsObj.markersArray.push({
          time: this.finishPoint <= this.videoObj.duration ? this.finishPoint : this.videoObj.duration,
          text: this.l.finish_point,
          color: '#18b566',
        })
      }
    },

    /**
     * Video event handlers
     */
    onLoadStart(e) {
      this.$emit('loadStart', e)
    },

    onDurationChange(e) {
      this.$emit('durationChange', e)
    },

    onLoadedMetadata(e) {
      this.flagObj.loadSuccess = true
      this.videoObj.duration = Math.ceil(this.player.duration)
      this.generateMarkers()
      this.$emit('loadedMetadata', e)
    },

    onLoadedData(e) {
      this.$emit('loadedData', e)
    },

    onProgress(e) {
      this.$emit('progress', e)
    },

    onWaiting(e) {
      this.$emit('waiting', e)
    },

    onCanPlay(e) {
      this.$emit('canPlay', e)
    },

    onCanPlayThrough(e) {
      this.$emit('canPlayThrough', e)
    },

    onPlay(e) {
      this.flagObj.hasAlerted = false
      this.flagObj.isPlaying = true
      this.showObj.resumePlayBtn = false
      this.$emit('play', e)
    },

    onPause(e) {
      this.flagObj.isPlaying = false
      this.$emit('pause', e)
    },

    onSeeking(e) {
      if (this.progressControl) {
        const seekingTime = this.player.currentTime
        if (seekingTime > this.videoObj.watchMaxTime) {
          this.player.currentTime = this.videoObj.copyCurrentTime
          const msg = `禁止快进，您的最大播放进度为：${this.formatSeconds(this.videoObj.watchMaxTime, true)}`
          this.topMsg(msg)
          return
        }
      }
      this.$emit('seeking', e)
    },

    onSeeked(e) {
      this.$emit('seeked', e)
    },

    onTimeUpdate(e) {
      if (this.player) {
        this.videoObj.currentTime = Math.floor(this.player.currentTime)
        if (this.questionControl && this.paramsObj.markersArray.length > 0) {
          this.questionModalOpen()
        }
      }
      this.$emit('timeUpdate', e)
    },

    onEnded(e) {
      this.$emit('ended', e)
    },

    onError(e) {
      console.error('Video error:', e)
      this.$emit('error', e)
    },

    onVolumeChange(e) {
      this.$emit('volumeChange', e)
    },

    onRateChange(e) {
      this.topMsg(this.l.playback_speed_no_progress)
      this.$emit('rateChange', e)
    },

    /**
     * Get/Set playback rate (compatibility API for video.js)
     * Usage: player.playbackRate() to get, player.playbackRate(1.5) to set
     */
    getPlaybackRate() {
      return this.player ? this.player.speed : 1
    },

    setPlaybackRate(rate) {
      if (this.player && typeof rate === 'number') {
        this.player.speed = rate
      }
    },

    /**
     * Get current time (compatibility API)
     */
    getCurrentTime() {
      return this.player ? this.player.currentTime : 0
    },

    /**
     * Set current time (compatibility API)
     */
    setCurrentTime(time) {
      if (this.player && typeof time === 'number') {
        this.player.currentTime = time
      }
    },

    /**
     * Get duration (compatibility API)
     */
    getDuration() {
      return this.player ? this.player.duration : 0
    },

    /**
     * Get volume (compatibility API)
     */
    getVolume() {
      return this.player ? this.player.volume : 1
    },

    /**
     * Set volume (compatibility API)
     */
    setVolume(vol) {
      if (this.player && typeof vol === 'number') {
        this.player.volume = vol
      }
    },

    /**
     * Cleanup
     */
    onDestroy() {
      if (this.player) {
        this.player.destroy()
        this.player = null
      }
      if (this.hls) {
        this.hls.destroy()
        this.hls = null
      }
      if (this.watermarkTimer) {
        clearInterval(this.watermarkTimer)
        this.watermarkTimer = null
      }
      if (this.questionObj.timer) {
        clearInterval(this.questionObj.timer)
        this.questionObj.timer = null
      }
      this.flagObj.destroyed = true
    },
  },

  beforeDestroy() {
    this.onDestroy()
    if (!this.playInBackground) {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange)
    }
  },

  mounted() {
    this.$nextTick(() => {
      if (this.player === null && this.flagObj.needinitial) {
        this.initVideoPlayer()
        if (this.videoObj.videoUrl) {
          this.loadVideoSource(this.videoObj.videoUrl)
        }
      }
    })

    if (!this.playInBackground) {
      document.addEventListener('visibilitychange', this.handleVisibilityChange)
    }

    if (this.watermark) {
      // Watermark support can be added here if needed
    }
  },
}
</script>

<style scoped>
.video-play-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #000;
}

.plyr-wrapper {
  width: 100%;
  height: 100%;
}

.plyr-wrapper video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

/* Quality control panel */
.playbackRateControl {
  position: absolute;
  right: 0;
  top: 0;
  width: 30%;
  height: 100%;
  padding: 5% 3%;
  background-color: rgba(12, 12, 12, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  z-index: 1500;
  color: white;
}

.playbackRatePanel {
  width: 90%;
  height: 15%;
  border-radius: 5px;
  background-color: rgba(80, 80, 80, 0.8);
  padding-left: 1em;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.playbackRatePanel:hover {
  background-color: rgba(100, 100, 100, 0.9);
}

/* Resume play button */
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

/* Top message */
.topMessage {
  position: absolute;
  z-index: 19999999;
  top: 20px;
  text-align: center;
  color: white;
  padding: 5px 20px;
  border-radius: 5px;
  background-color: rgba(0, 0, 0, 0.7);
}

/* Modal styles */
.modal {
  position: absolute;
  z-index: 19999999;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: auto;
}

.modal-content {
  background-color: #fefefe;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  min-width: 600px;
  box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.2), 0 7px 20px 0 rgba(0, 0, 0, 0.19);
  border-radius: 8px;
  position: relative;
}

.modal-rightBtn {
  position: absolute;
  right: 20px;
  top: 20px;
}

.modal-title {
  display: flex;
  align-items: baseline;
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 20px;
}

.option-box {
  margin-top: 20px;
}

.m_options {
  margin-top: 10px;
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  transition: all 0.2s ease;
}

.m_options:hover {
  background-color: #f5f5f5;
}

.icon_type {
  margin-right: 10px;
  min-width: 20px;
}

.text {
  flex: 1;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Text utilities */
.text-red {
  color: #fa3534 !important;
}

.text-blue {
  color: #409fee !important;
}
</style>
