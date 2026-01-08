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

<script setup>
import 'plyr/dist/plyr.css'

import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, nextTick, getCurrentInstance } from 'vue'
import CryptoJS from 'crypto-js'
import Hls from 'hls.js'
import Plyr from 'plyr'

import { getToken } from '@/utils/auth'

defineOptions({ name: 'videoPlayerCom' })

const props = defineProps({
  palyStatus: { type: Boolean, default: false }, // keeping original prop name
  src: { type: String, default: '' },
  other_src: { type: Object, default: () => ({}) },
  autoplay: { type: Boolean, default: false },
  controls: { type: Boolean, default: true },
  loop: { type: Boolean, default: false },
  muted: { type: Boolean, default: false },
  poster: { type: String, default: '' },
  preload: { type: String, default: 'auto' },
  playbackRate: { type: Number, default: 1 },
  playbackRateArray: { type: Array, default: () => [1] },
  pictureInPicture: { type: Boolean, default: false },
  progressControl: { type: Boolean, default: false },
  questionControl: { type: Boolean, default: false },
  markers: { type: Array, default: () => [] },
  finishPoint: { type: Number, default: 0 },
  playInBackground: { type: Boolean, default: false },
  resumePlaying: { type: Boolean, default: true },
  lastPlayTime: { type: Number, default: 0 },
  maxPlayTime: { type: Number, default: 0 },
  controlBarOption: { type: Object, default: () => ({}) },
  watermark: { type: [String, Number], default: '' },
})

const emit = defineEmits(['update:playStatus', 'loadStart', 'durationChange', 'loadedMetadata', 'loadedData', 'progress', 'waiting', 'canPlay', 'canPlayThrough', 'play', 'pause', 'seeking', 'seeked', 'timeUpdate', 'ended', 'error', 'volumeChange', 'rateChange'])

const inst = getCurrentInstance()
const proxy = inst?.proxy

// These two were used in your template (c.xxx, l.xxx).
// In your old Options API code they were accessed as this.c / this.l (likely provided by a global mixin).
// Vue templates auto-unwrap computed refs.
const c = computed(() => proxy?.c ?? {})
const l = computed(() => proxy?.l ?? {})

// Refs to DOM
const plyrContainer = ref(null)
const videoElement = ref(null)

// State
const player = ref(null)
const hls = ref(null)
const watermarkTimer = ref(null)
const topMsgTimer = ref(null)

const radio = ref('')
const checkbox = ref([])
const fillin = ref('')

const videoObj = reactive({
  videoUrl: '',
  duration: 0,
  watchMaxTime: 0,
  currentTime: 0,
  copyCurrentTime: 0,
})

const flagObj = reactive({
  retry: 5,
  destroyed: false,
  needinitial: true,
  isFullscreen: false,
  isPlaying: false,
  needAlert: false,
  loadSuccess: false,
  hasAlerted: false,
})

const paramsObj = reactive({
  markersIndex: 0,
  markersArray: [],
  alreadyAnswered: [],
})

const showObj = reactive({
  topMessage: '',
  topMessageShow: false,
  breakPointShow: false,
  resumePlayBtn: false,
  showAnswer: false,
  playQualityPanel: false,
})

const questionObj = reactive({
  currentTime: 0,
  index: 0,
  timer: null,
  remainingTime: 5,
  alreadyAnswered: [],
  list: [],
})

// -------------------- Core logic --------------------

function initVideoPlayer() {
  if (player.value === null && flagObj.needinitial) {
    const plyrOptions = {
      controls: props.controls ? ['play-large', 'play', 'progress', 'current-time', 'duration', 'mute', 'volume', 'captions', 'settings', 'pip', 'fullscreen'] : [],
      autoplay: props.autoplay,
      muted: props.muted,
      loop: { active: props.loop },
      displayDuration: true,
      invertTime: false,
      toggleInvert: true,
      seekTime: 10,
      speed: { selected: 1, options: props.playbackRateArray },
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
      // allow user override (if they used it)
      ...(props.controlBarOption || {}),
    }

    if (!videoElement.value) return
    player.value = new Plyr(videoElement.value, plyrOptions)

    setupHLS()
    flagObj.needinitial = false
  }
}

function decryptServerKey(encryptedKeyData) {
  // Base64 decode helper (kept as-is)
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
        if (enc3 != 64) output = output + String.fromCharCode(chr2)
        if (enc4 != 64) output = output + String.fromCharCode(chr3)
      }
      // UTF-8 decode
      var string = ''
      var idx = 0
      var c = 0,
        c2 = 0,
        c3 = 0
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

    const encryptedKeyText = new TextDecoder('utf-8').decode(encryptedKeyData)
    const base64Decoded = new Base64().decode(encryptedKeyText)

    let decrypted = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Base64.parse(base64Decoded) }, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 })

    let patchKey = decrypted.toString(CryptoJS.enc.Utf8)

    // Convert to ArrayBuffer
    const buf = new ArrayBuffer(patchKey.length)
    const view = new Uint8Array(buf)
    for (let i = 0; i < patchKey.length; i++) view[i] = patchKey.charCodeAt(i)

    return new Uint8Array(buf)
  } catch (err) {
    console.error('❌ Lỗi decrypt key:', err)
    return null
  }
}

function setupHLS() {
  if (!videoElement.value) return

  if (Hls.isSupported()) {
    const hlsDebugMode = typeof window !== 'undefined' && window.__HLS_DEBUG__
    const DefaultLoader = Hls.DefaultConfig.loader

    class CustomLoader extends DefaultLoader {
      constructor(config) {
        super(config)
      }
      load(context, config, callbacks) {
        if (context.type === 'key') {
          const originalOnSuccess = callbacks.onSuccess
          callbacks.onSuccess = (response, stats, ctx, networkDetails) => {
            try {
              if (response.data && response.data.byteLength !== 16) {
                const encryptedKey = new Uint8Array(response.data)
                const decryptedKey = decryptServerKey(encryptedKey)
                if (decryptedKey && decryptedKey.length === 16) {
                  response.data = decryptedKey.buffer
                }
              }
            } catch (e) {
              console.error('❌ Key decrypt wrapper error:', e)
            }
            originalOnSuccess(response, stats, ctx, networkDetails)
          }
        }
        super.load(context, config, callbacks)
      }
    }

    hls.value = new Hls({
      debug: hlsDebugMode,
      loader: CustomLoader,

      maxBufferLength: 30,
      maxMaxBufferLength: 60,
      maxBufferSize: 60 * 1000 * 1000,
      maxBufferHole: 0.5,

      highBufferWatchdogPeriod: 3,
      nudgeOffset: 0.1,
      nudgeMaxRetry: 5,
      maxFragLookUpTolerance: 0.25,

      startLevel: -1,
      autoStartLoad: true,
      startPosition: -1,

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

      xhrSetup: (xhr, url) => {
        if (url.includes('ApacheLeaningVideo')) {
          xhr.setRequestHeader('token', getToken())
        }
      },
    })

    hls.value.attachMedia(videoElement.value)

    hls.value.on(Hls.Events.MANIFEST_PARSED, () => {
      flagObj.loadSuccess = true
    })

    hls.value.on(Hls.Events.ERROR, (_event, data) => {
      if (data?.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            hls.value && hls.value.startLoad()
            break
          case Hls.ErrorTypes.MEDIA_ERROR:
            hls.value && hls.value.recoverMediaError()
            break
          default:
            topMsg('视频加载失败，请刷新重试')
            break
        }
      } else {
        if (data.details === 'bufferStalledError') {
          hls.value && hls.value.startLoad()
        }
      }
    })
  } else if (videoElement.value.canPlayType('application/vnd.apple.mpegurl')) {
    // Safari native HLS fallback
    videoElement.value.src = videoObj.videoUrl
  }
}

function loadVideoSource(src) {
  if (!src) return

  if (hls.value) {
    hls.value.detachMedia()
    hls.value.destroy()
    hls.value = null
  }

  videoObj.videoUrl = src

  if (Hls.isSupported()) {
    setupHLS()
    hls.value && hls.value.loadSource(src)
  } else if (videoElement.value && videoElement.value.canPlayType('application/vnd.apple.mpegurl')) {
    videoElement.value.src = src
  } else if (videoElement.value) {
    videoElement.value.src = src
  }
}

function changeQuality(src, _label) {
  if (!player.value) return
  const currentTime = player.value.currentTime
  loadVideoSource(src)
  showObj.playQualityPanel = false

  nextTick(() => {
    if (Hls.isSupported() && hls.value) {
      hls.value.on(Hls.Events.MANIFEST_PARSED, () => {
        if (!player.value) return
        player.value.currentTime = currentTime
        player.value.play()
      })
    } else {
      player.value.currentTime = currentTime
      player.value.play()
    }
  })
}

function topMsg(msg, sec = 5) {
  if (topMsgTimer.value) {
    clearTimeout(topMsgTimer.value)
    topMsgTimer.value = null
  }
  showObj.topMessage = msg
  showObj.topMessageShow = true
  topMsgTimer.value = setTimeout(() => {
    showObj.topMessage = ''
    showObj.topMessageShow = false
    clearTimeout(topMsgTimer.value)
    topMsgTimer.value = null
  }, sec * 1000)
}

function questionModalOpen() {
  if (questionObj.index + 1 <= props.markers.length) {
    const alreadyAnsweredSet = new Set(questionObj.alreadyAnswered)
    if (alreadyAnsweredSet.has(paramsObj.markersArray[questionObj.index].id)) {
      questionObj.index++
    } else {
      if (videoObj.currentTime === paramsObj.markersArray[questionObj.index].time) {
        player.value && player.value.pause()
        showObj.breakPointShow = true
      }
    }
  }
}

function returnStyle(option) {
  if (showObj.showAnswer) {
    if (option.value) return option.is_correct ? 'color: #19be6b;' : 'color: #fa3534;'
    return option.is_correct ? 'color: #ffaa00;' : ''
  }
  return option.value ? 'color: #409fee;' : ''
}

function selectOption(index, type) {
  if (showObj.showAnswer) return

  const currentQuestion = props.markers[questionObj.index]
  if (!currentQuestion) return

  if (type === 2) {
    currentQuestion.options[index].value = currentQuestion.options[index].value !== true
  } else if (type === 1 || type === 3) {
    currentQuestion.options.forEach((option, oindex) => {
      option.value = oindex === index
    })
  }
}

function closeModal() {
  showObj.breakPointShow = false
}

function submitAnswer() {
  showObj.showAnswer = true
  questionObj.remainingTime = 5
  startCountdown()
}

function startCountdown() {
  questionObj.timer = setInterval(() => {
    if (questionObj.remainingTime > 1) questionObj.remainingTime--
    else {
      clearInterval(questionObj.timer)
      closeQuestionPanel()
    }
  }, 1000)
}

function closeQuestionPanel() {
  if (questionObj.timer) {
    clearInterval(questionObj.timer)
    questionObj.timer = null
  }
  showObj.breakPointShow = false
  showObj.showAnswer = false
  const cur = props.markers[questionObj.index]
  if (cur?.id != null) questionObj.alreadyAnswered.push(cur.id)
  player.value && player.value.play()
  questionObj.index++
}

function formatSeconds(value, chinese) {
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
}

function backToLastPlay() {
  if (props.lastPlayTime > 0 && player.value) {
    videoObj.copyCurrentTime = props.lastPlayTime
    player.value.currentTime = props.lastPlayTime
    onPlay()
  }
}

function handleVisibilityChange() {
  if (document.hidden && flagObj.isPlaying) {
    onPause()
    flagObj.needAlert = true
  } else if (!document.hidden && !flagObj.isPlaying) {
    if (flagObj.needAlert && !flagObj.hasAlerted) {
      flagObj.hasAlerted = true
      // Element Plus $alert (MessageBox) is usually available on proxy
      proxy?.$alert?.(l.value.prevent_leaving, l.value.leaving_detected, {
        confirmButtonText: c.value.confirm,
        callback: () => {
          flagObj.needAlert = false
        },
      })
    }
  }
}

function generateMarkers() {
  const alreadyAnsweredSet = new Set(questionObj.alreadyAnswered)
  paramsObj.markersArray = props.markers.filter((i) => !alreadyAnsweredSet.has(i.id))

  if (props.finishPoint > 0) {
    paramsObj.markersArray.push({
      time: props.finishPoint <= videoObj.duration ? props.finishPoint : videoObj.duration,
      text: l.value.finish_point,
      color: '#18b566',
    })
  }
}

// -------------------- Video event handlers (used by template) --------------------
function onLoadStart(e) {
  emit('loadStart', e)
}
function onDurationChange(e) {
  emit('durationChange', e)
}

function onLoadedMetadata(e) {
  flagObj.loadSuccess = true
  videoObj.duration = Math.ceil(player.value?.duration || 0)
  generateMarkers()
  emit('loadedMetadata', e)
}

function onLoadedData(e) {
  emit('loadedData', e)
}
function onProgress(e) {
  emit('progress', e)
}
function onWaiting(e) {
  emit('waiting', e)
}
function onCanPlay(e) {
  emit('canPlay', e)
}
function onCanPlayThrough(e) {
  emit('canPlayThrough', e)
}

function onPlay(e) {
  flagObj.hasAlerted = false
  flagObj.isPlaying = true
  showObj.resumePlayBtn = false
  emit('play', e)
}

function onPause(e) {
  flagObj.isPlaying = false
  emit('pause', e)
}

function onSeeking(e) {
  if (props.progressControl && player.value) {
    const seekingTime = player.value.currentTime
    if (seekingTime > videoObj.watchMaxTime) {
      player.value.currentTime = videoObj.copyCurrentTime
      const msg = `禁止快进，您的最大播放进度为：${formatSeconds(videoObj.watchMaxTime, true)}`
      topMsg(msg)
      return
    }
  }
  emit('seeking', e)
}

function onSeeked(e) {
  emit('seeked', e)
}

function onTimeUpdate(e) {
  if (player.value) {
    videoObj.currentTime = Math.floor(player.value.currentTime)
    if (props.questionControl && paramsObj.markersArray.length > 0) {
      questionModalOpen()
    }
  }
  emit('timeUpdate', e)
}

function onEnded(e) {
  emit('ended', e)
}
function onError(e) {
  console.error('Video error:', e)
  emit('error', e)
}
function onVolumeChange(e) {
  emit('volumeChange', e)
}
function onRateChange(e) {
  topMsg(l.value.playback_speed_no_progress)
  emit('rateChange', e)
}

// compatibility methods (optional)
function getPlaybackRate() {
  return player.value ? player.value.speed : 1
}
function setPlaybackRate(rate) {
  if (player.value && typeof rate === 'number') player.value.speed = rate
}
function getCurrentTime() {
  return player.value ? player.value.currentTime : 0
}
function setCurrentTime(time) {
  if (player.value && typeof time === 'number') player.value.currentTime = time
}
function getDuration() {
  return player.value ? player.value.duration : 0
}
function getVolume() {
  return player.value ? player.value.volume : 1
}
function setVolume(vol) {
  if (player.value && typeof vol === 'number') player.value.volume = vol
}

function onDestroy() {
  if (player.value) {
    player.value.destroy()
    player.value = null
  }
  if (hls.value) {
    hls.value.destroy()
    hls.value = null
  }
  if (watermarkTimer.value) {
    clearInterval(watermarkTimer.value)
    watermarkTimer.value = null
  }
  if (questionObj.timer) {
    clearInterval(questionObj.timer)
    questionObj.timer = null
  }
  flagObj.destroyed = true
}

// -------------------- Watches --------------------
watch(
  () => props.src,
  (val) => {
    if (!val) return
    questionObj.index = 0
    flagObj.retry = 5
    flagObj.isPlaying = false
    flagObj.loadSuccess = false
    videoObj.videoUrl = val
    if (player.value) loadVideoSource(val)
  },
  { immediate: true }
)

watch(
  () => props.lastPlayTime,
  (val) => {
    if (typeof val === 'number' && val > 0 && props.resumePlaying) {
      showObj.resumePlayBtn = true
    }
  },
  { immediate: true }
)

watch(
  () => props.maxPlayTime,
  (val) => {
    if (typeof val === 'number' && val > 0) {
      videoObj.watchMaxTime = val
    }
  },
  { immediate: true }
)

watch(
  () => videoObj.currentTime,
  (newV, oldV) => {
    if (!player.value) return
    if (newV - oldV > 2) videoObj.copyCurrentTime = oldV
    if (newV > videoObj.watchMaxTime) {
      const timeDiff = parseFloat(newV) - parseFloat(videoObj.watchMaxTime)
      if (timeDiff < 2) videoObj.watchMaxTime = newV
    }
  }
)

watch(
  () => flagObj.isPlaying,
  (newV) => {
    emit('update:playStatus', newV)
  }
)

// -------------------- Lifecycle --------------------
onMounted(() => {
  nextTick(() => {
    if (player.value === null && flagObj.needinitial) {
      initVideoPlayer()
      if (videoObj.videoUrl) loadVideoSource(videoObj.videoUrl)
    }
  })

  if (!props.playInBackground) {
    document.addEventListener('visibilitychange', handleVisibilityChange)
  }
})

onBeforeUnmount(() => {
  onDestroy()
  if (!props.playInBackground) {
    document.removeEventListener('visibilitychange', handleVisibilityChange)
  }
})

// Expose everything the template needs (script setup auto-exposes top-level bindings)
export {
  // refs
  plyrContainer,
  videoElement,

  // props passthrough used by template
  // other_src is accessed directly in template; it's a prop so it exists.
  // markers is accessed directly in template; it's a prop so it exists.

  // state
  radio,
  checkbox,
  fillin,
  videoObj,
  flagObj,
  paramsObj,
  showObj,
  questionObj,
  c,
  l,

  // methods used by template
  changeQuality,
  backToLastPlay,
  submitAnswer,
  closeModal,
  returnStyle,
  selectOption,
  formatSeconds,

  // events bound on <video>
  onTimeUpdate,
  onPlay,
  onPause,
  onEnded,
  onSeeking,
  onSeeked,
  onLoadStart,
  onLoadedMetadata,
  onLoadedData,
  onProgress,
  onCanPlay,
  onCanPlayThrough,
  onWaiting,
  onError,
  onVolumeChange,
  onRateChange,

  // optional API
  getPlaybackRate,
  setPlaybackRate,
  getCurrentTime,
  setCurrentTime,
  getDuration,
  getVolume,
  setVolume,
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
