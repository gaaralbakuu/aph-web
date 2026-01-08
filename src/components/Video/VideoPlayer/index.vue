<template>
  <div class="video-player-container">
    <div class="video-wrapper bg-black rounded-lg overflow-hidden shadow-lg">
      <!-- Video Element -->
      <video
        ref="videoPlayer"
        class="w-full h-auto"
        :src="videoSrc"
        :poster="poster"
        @loadedmetadata="onLoadedMetadata"
        @timeupdate="onTimeUpdate"
        @ended="onEnded"
        @play="onPlay"
        @pause="onPause"
        @error="onError"
      >
        Your browser does not support the video tag.
      </video>

      <!-- Video Controls Overlay -->
      <div
        v-if="showControls"
        class="controls-overlay absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4"
      >
        <!-- Progress Bar -->
        <div class="progress-container mb-3">
          <div
            class="progress-bar bg-gray-600 h-1 rounded cursor-pointer"
            @click="seekToPosition"
          >
            <div
              class="progress-filled bg-blue-500 h-full rounded"
              :style="{ width: progressPercent + '%' }"
            ></div>
          </div>
        </div>

        <!-- Control Buttons -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <!-- Play/Pause Button -->
            <button
              @click="togglePlayPause"
              class="text-white hover:text-blue-400 transition-colors"
            >
              <i :class="isPlaying ? 'el-icon-video-pause' : 'el-icon-video-play'" class="text-xl"></i>
            </button>

            <!-- Time Display -->
            <span class="text-white text-sm">
              {{ formatTime(currentTime) }} / {{ formatTime(duration) }}
            </span>

            <!-- Volume Control -->
            <div class="flex items-center space-x-2">
              <button @click="toggleMute" class="text-white hover:text-blue-400">
                <i :class="isMuted ? 'el-icon-remove-outline' : 'el-icon-mic'" class="text-lg"></i>
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                v-model="volume"
                @input="changeVolume"
                class="volume-slider"
              />
            </div>
          </div>

          <div class="flex items-center space-x-4">
            <!-- Playback Speed -->
            <select
              v-model="playbackRate"
              @change="changePlaybackRate"
              class="bg-transparent text-white text-sm border-none outline-none"
            >
              <option value="0.5" class="text-black">0.5x</option>
              <option value="1" class="text-black">1x</option>
              <option value="1.25" class="text-black">1.25x</option>
              <option value="1.5" class="text-black">1.5x</option>
              <option value="2" class="text-black">2x</option>
            </select>

            <!-- Fullscreen Button -->
            <button
              @click="toggleFullscreen"
              class="text-white hover:text-blue-400 transition-colors"
            >
              <i class="el-icon-full-screen text-xl"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div v-if="isLoading" class="loading-overlay absolute inset-0 flex items-center justify-center bg-black/50">
        <el-icon class="is-loading text-white text-2xl">
          <Loading />
        </el-icon>
      </div>

      <!-- Error Message -->
      <div v-if="hasError" class="error-overlay absolute inset-0 flex items-center justify-center bg-black/80">
        <div class="text-center text-white">
          <i class="el-icon-warning text-4xl mb-2"></i>
          <p>Video không thể tải được</p>
          <el-button @click="retryLoad" type="primary" size="small">Thử lại</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { Loading } from '@element-plus/icons-vue'

defineOptions({
  name: 'VideoPlayer'
})

const props = defineProps({
  videoSrc: {
    type: String,
    required: true
  },
  poster: {
    type: String,
    default: ''
  },
  autoplay: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['loaded', 'timeupdate', 'ended', 'play', 'pause', 'error'])

const videoPlayer = ref(null)
const isPlaying = ref(false)
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(1)
const isMuted = ref(false)
const playbackRate = ref(1)
const showControls = ref(true)
const isLoading = ref(true)
const hasError = ref(false)
const controlsTimeout = ref(null)

const progressPercent = computed(() => {
  return duration.value > 0 ? (currentTime.value / duration.value) * 100 : 0
})

const setupVideoEvents = () => {
  const video = videoPlayer.value
  if (video) {
    video.addEventListener('loadedmetadata', onLoadedMetadata)
    video.addEventListener('timeupdate', onTimeUpdate)
    video.addEventListener('ended', onEnded)
    video.addEventListener('play', onPlay)
    video.addEventListener('pause', onPause)
    video.addEventListener('error', onError)
  }
}

const onLoadedMetadata = () => {
  duration.value = videoPlayer.value.duration
  isLoading.value = false
  emit('loaded', { duration: duration.value })
}

const onTimeUpdate = () => {
  currentTime.value = videoPlayer.value.currentTime
  emit('timeupdate', { currentTime: currentTime.value, duration: duration.value })
}

const onEnded = () => {
  isPlaying.value = false
  emit('ended')
}

const onPlay = () => {
  isPlaying.value = true
  emit('play')
}

const onPause = () => {
  isPlaying.value = false
  emit('pause')
}

const onError = () => {
  hasError.value = true
  isLoading.value = false
  emit('error')
}

const togglePlayPause = () => {
  if (isPlaying.value) {
    pauseVideo()
  } else {
    playVideo()
  }
}

const playVideo = () => {
  videoPlayer.value.play()
}

const pauseVideo = () => {
  videoPlayer.value.pause()
}

const seekToPosition = (event) => {
  const rect = event.target.getBoundingClientRect()
  const percent = (event.clientX - rect.left) / rect.width
  const newTime = percent * duration.value
  videoPlayer.value.currentTime = newTime
}

const toggleMute = () => {
  isMuted.value = !isMuted.value
  videoPlayer.value.muted = isMuted.value
}

const changeVolume = () => {
  videoPlayer.value.volume = volume.value
  isMuted.value = volume.value === 0
}

const changePlaybackRate = () => {
  videoPlayer.value.playbackRate = playbackRate.value
}

const toggleFullscreen = () => {
  const video = videoPlayer.value
  if (video.requestFullscreen) {
    video.requestFullscreen()
  } else if (video.webkitRequestFullscreen) {
    video.webkitRequestFullscreen()
  } else if (video.msRequestFullscreen) {
    video.msRequestFullscreen()
  }
}

const retryLoad = () => {
  hasError.value = false
  isLoading.value = true
  videoPlayer.value.load()
}

const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

const clearControlsTimeout = () => {
  if (controlsTimeout.value) {
    clearTimeout(controlsTimeout.value)
    controlsTimeout.value = null
  }
}

onMounted(() => {
  setupVideoEvents()
  if (props.autoplay) {
    playVideo()
  }
})

onBeforeUnmount(() => {
  clearControlsTimeout()
  if (videoPlayer.value) {
    videoPlayer.value.removeEventListener('loadedmetadata', onLoadedMetadata)
    videoPlayer.value.removeEventListener('timeupdate', onTimeUpdate)
    videoPlayer.value.removeEventListener('ended', onEnded)
    videoPlayer.value.removeEventListener('play', onPlay)
    videoPlayer.value.removeEventListener('pause', onPause)
    videoPlayer.value.removeEventListener('error', onError)
  }
})
</script>

<style scoped>
.video-player-container {
  position: relative;
  width: 100%;
}

.controls-overlay {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.video-wrapper:hover .controls-overlay {
  opacity: 1;
}

.volume-slider {
  width: 60px;
  height: 4px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 2px;
  outline: none;
  -webkit-appearance: none;
}

.volume-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
}

.volume-slider::-moz-range-thumb {
  width: 12px;
  height: 12px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

.loading-overlay,
.error-overlay {
  z-index: 10;
}
</style>
