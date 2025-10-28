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

<script>
import { Loading } from '@element-plus/icons-vue'

export default {
  name: 'VideoPlayer',
  components: {
    Loading
  },
  props: {
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
  },
  data() {
    return {
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      volume: 1,
      isMuted: false,
      playbackRate: 1,
      showControls: true,
      isLoading: true,
      hasError: false,
      controlsTimeout: null
    }
  },
  computed: {
    progressPercent() {
      return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0
    }
  },
  mounted() {
    this.setupVideoEvents()
    if (this.autoplay) {
      this.playVideo()
    }
  },
  beforeUnmount() {
    this.clearControlsTimeout()
    if (this.$refs.videoPlayer) {
      this.$refs.videoPlayer.removeEventListener('loadedmetadata', this.onLoadedMetadata)
      this.$refs.videoPlayer.removeEventListener('timeupdate', this.onTimeUpdate)
      this.$refs.videoPlayer.removeEventListener('ended', this.onEnded)
      this.$refs.videoPlayer.removeEventListener('play', this.onPlay)
      this.$refs.videoPlayer.removeEventListener('pause', this.onPause)
      this.$refs.videoPlayer.removeEventListener('error', this.onError)
    }
  },
  methods: {
    setupVideoEvents() {
      const video = this.$refs.videoPlayer
      if (video) {
        video.addEventListener('loadedmetadata', this.onLoadedMetadata)
        video.addEventListener('timeupdate', this.onTimeUpdate)
        video.addEventListener('ended', this.onEnded)
        video.addEventListener('play', this.onPlay)
        video.addEventListener('pause', this.onPause)
        video.addEventListener('error', this.onError)
      }
    },

    onLoadedMetadata() {
      this.duration = this.$refs.videoPlayer.duration
      this.isLoading = false
      this.$emit('loaded', { duration: this.duration })
    },

    onTimeUpdate() {
      this.currentTime = this.$refs.videoPlayer.currentTime
      this.$emit('timeupdate', { currentTime: this.currentTime, duration: this.duration })
    },

    onEnded() {
      this.isPlaying = false
      this.$emit('ended')
    },

    onPlay() {
      this.isPlaying = true
      this.$emit('play')
    },

    onPause() {
      this.isPlaying = false
      this.$emit('pause')
    },

    onError() {
      this.hasError = true
      this.isLoading = false
      this.$emit('error')
    },

    togglePlayPause() {
      if (this.isPlaying) {
        this.pauseVideo()
      } else {
        this.playVideo()
      }
    },

    playVideo() {
      this.$refs.videoPlayer.play()
    },

    pauseVideo() {
      this.$refs.videoPlayer.pause()
    },

    seekToPosition(event) {
      const rect = event.target.getBoundingClientRect()
      const percent = (event.clientX - rect.left) / rect.width
      const newTime = percent * this.duration
      this.$refs.videoPlayer.currentTime = newTime
    },

    toggleMute() {
      this.isMuted = !this.isMuted
      this.$refs.videoPlayer.muted = this.isMuted
    },

    changeVolume() {
      this.$refs.videoPlayer.volume = this.volume
      this.isMuted = this.volume === 0
    },

    changePlaybackRate() {
      this.$refs.videoPlayer.playbackRate = this.playbackRate
    },

    toggleFullscreen() {
      const video = this.$refs.videoPlayer
      if (video.requestFullscreen) {
        video.requestFullscreen()
      } else if (video.webkitRequestFullscreen) {
        video.webkitRequestFullscreen()
      } else if (video.msRequestFullscreen) {
        video.msRequestFullscreen()
      }
    },

    retryLoad() {
      this.hasError = false
      this.isLoading = true
      this.$refs.videoPlayer.load()
    },

    formatTime(seconds) {
      const mins = Math.floor(seconds / 60)
      const secs = Math.floor(seconds % 60)
      return `${mins}:${secs.toString().padStart(2, '0')}`
    },

    clearControlsTimeout() {
      if (this.controlsTimeout) {
        clearTimeout(this.controlsTimeout)
        this.controlsTimeout = null
      }
    }
  }
}
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
