/**
 * Video Player Configuration Examples
 * 
 * Các ví dụ cấu hình cho component videoPlayerPlyr.vue
 */

// ============================================================================
// 1. CẤU HÌNH CƠ BẢN - M3U8 Video với Encryption
// ============================================================================
export const basicM3U8Config = {
  src: 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=30f98387-3f77-47c1-97e9-a1dc9327c6e9&type=original',
  autoplay: false,
  controls: true,
  poster: 'https://example.com/poster.jpg'
}

// ============================================================================
// 2. CẤU HÌNH CHẤT LƯỢNG ĐA GIÁC ĐỘ
// ============================================================================
export const multiQualityConfig = {
  src: 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=30f98387-3f77-47c1-97e9-a1dc9327c6e9&type=original',
  other_src: {
    '1080P - Full HD': 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=30f98387-3f77-47c1-97e9-a1dc9327c6e9&type=1080p',
    '720P - HD': 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=30f98387-3f77-47c1-97e9-a1dc9327c6e9&type=720p',
    '480P - SD': 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=30f98387-3f77-47c1-97e9-a1dc9327c6e9&type=480p',
    '360P - Low': 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=30f98387-3f77-47c1-97e9-a1dc9327c6e9&type=360p'
  },
  playbackRateArray: [0.75, 1, 1.25, 1.5, 2]
}

// ============================================================================
// 3. CẤU HÌNH HỎI ĐÁP - SINGLE CHOICE QUESTIONS
// ============================================================================
export const singleChoiceQuestionsConfig = {
  questionControl: true,
  markers: [
    {
      id: 1,
      time: 30, // Tạm dừng ở giây 30
      text: 'Câu 1: Khái niệm cơ bản là gì?',
      question_type: 1, // 1 = single choice
      options: [
        { 
          id: 'opt_1', 
          name_label: 'Định nghĩa A', 
          value: false, 
          is_correct: true 
        },
        { 
          id: 'opt_2', 
          name_label: 'Định nghĩa B', 
          value: false, 
          is_correct: false 
        },
        { 
          id: 'opt_3', 
          name_label: 'Định nghĩa C', 
          value: false, 
          is_correct: false 
        }
      ]
    },
    {
      id: 2,
      time: 120,
      text: 'Câu 2: Ứng dụng thực tế?',
      question_type: 1,
      options: [
        { id: 'opt_4', name_label: 'Ứng dụng 1', value: false, is_correct: false },
        { id: 'opt_5', name_label: 'Ứng dụng 2', value: false, is_correct: true },
        { id: 'opt_6', name_label: 'Ứng dụng 3', value: false, is_correct: false }
      ]
    }
  ]
}

// ============================================================================
// 4. CẤU HÌNH HỎI ĐÁP - MULTIPLE CHOICE QUESTIONS
// ============================================================================
export const multipleChoiceQuestionsConfig = {
  questionControl: true,
  markers: [
    {
      id: 1,
      time: 60,
      text: 'Câu 1: Chọn tất cả đáp án đúng',
      question_type: 2, // 2 = multiple choice
      options: [
        { 
          id: 'opt_1', 
          name_label: 'Tùy chọn A - Đúng', 
          value: false, 
          is_correct: true 
        },
        { 
          id: 'opt_2', 
          name_label: 'Tùy chọn B - Sai', 
          value: false, 
          is_correct: false 
        },
        { 
          id: 'opt_3', 
          name_label: 'Tùy chọn C - Đúng', 
          value: false, 
          is_correct: true 
        },
        { 
          id: 'opt_4', 
          name_label: 'Tùy chọn D - Sai', 
          value: false, 
          is_correct: false 
        }
      ]
    }
  ]
}

// ============================================================================
// 5. CẤU HÌNH HỎI ĐÁP - FILL-IN-THE-BLANK
// ============================================================================
export const fillInTheBlankConfig = {
  questionControl: true,
  markers: [
    {
      id: 1,
      time: 90,
      text: 'Câu 1: Điền câu trả lời của bạn',
      question_type: 0, // 0 = fill-in-the-blank
      options: [
        // Đối với fill-in, options có thể chứa expected answers
        { id: 'ans_1', name_label: 'Bạn nhập', value: false, is_correct: false }
      ]
    }
  ]
}

// ============================================================================
// 6. CẤU HÌNH TIẾP TỤC PHÁT - RESUME PLAYING
// ============================================================================
export const resumePlayingConfig = {
  resumePlaying: true,
  lastPlayTime: 120, // Giây - từ backend
  maxPlayTime: 300   // Giây - từ backend
}

// ============================================================================
// 7. CẤU HÌNH CẤIM TUA VIDEO - PROGRESS CONTROL
// ============================================================================
export const progressControlConfig = {
  progressControl: true, // Cấm tua vượt maxPlayTime
  maxPlayTime: 300        // Chỉ cho phép tua đến giây 300
}

// ============================================================================
// 8. CẤU HÌNH ĐỬN GIẢN - LEARNING PLATFORM
// ============================================================================
export const learningPlatformConfig = {
  src: 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=xxx&type=original',
  other_src: {
    'HD': 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=xxx&type=720p',
    'SD': 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=xxx&type=480p'
  },
  autoplay: false,
  controls: true,
  playbackRateArray: [1, 1.5, 2],
  questionControl: true,
  progressControl: true,
  resumePlaying: true,
  playInBackground: false // Cảnh báo nếu rời trang
}

// ============================================================================
// 9. CẤU HÌNH TRAINING EVALUATION - ĐẠI HỘI TRAINING
// ============================================================================
export const trainingEvaluationConfig = {
  src: 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=training-001&type=original',
  other_src: {
    '1080P': 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=training-001&type=1080p',
    '720P': 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=training-001&type=720p'
  },
  autoplay: false,
  controls: true,
  playbackRateArray: [1],
  questionControl: true,
  progressControl: true,
  resumePlaying: true,
  playInBackground: false,
  markers: [
    {
      id: 1,
      time: 60,
      text: 'Câu 1 của 5: Nội dung chính của buổi học?',
      question_type: 1,
      options: [
        { id: 'q1_opt1', name_label: 'Tùy chọn A', value: false, is_correct: false },
        { id: 'q1_opt2', name_label: 'Tùy chọn B', value: false, is_correct: true },
        { id: 'q1_opt3', name_label: 'Tùy chọn C', value: false, is_correct: false }
      ]
    },
    {
      id: 2,
      time: 180,
      text: 'Câu 2 của 5: Phương pháp áp dụng?',
      question_type: 1,
      options: [
        { id: 'q2_opt1', name_label: 'Phương pháp 1', value: false, is_correct: true },
        { id: 'q2_opt2', name_label: 'Phương pháp 2', value: false, is_correct: false },
        { id: 'q2_opt3', name_label: 'Phương pháp 3', value: false, is_correct: false }
      ]
    }
  ],
  finishPoint: 300 // Điểm hoàn thành ở giây 300
}

// ============================================================================
// 10. CẤU HÌNH HOÀN CHỈNH - FULL FEATURES
// ============================================================================
export const completeConfig = {
  // Video Source
  src: 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=30f98387-3f77-47c1-97e9-a1dc9327c6e9&type=original',
  other_src: {
    '1080P - Full HD': 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=30f98387-3f77-47c1-97e9-a1dc9327c6e9&type=1080p',
    '720P - HD': 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=30f98387-3f77-47c1-97e9-a1dc9327c6e9&type=720p',
    '480P - SD': 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=30f98387-3f77-47c1-97e9-a1dc9327c6e9&type=480p'
  },

  // Basic Controls
  autoplay: false,
  controls: true,
  loop: false,
  muted: false,
  poster: 'https://example.com/poster.jpg',

  // Playback Settings
  playbackRate: 1,
  playbackRateArray: [0.75, 1, 1.25, 1.5, 2],

  // Advanced Features
  pictureInPicture: true, // H5 only
  progressControl: true,
  questionControl: true,

  // Resume Playing
  resumePlaying: true,
  playInBackground: false,

  // Markers & Questions
  markers: [
    {
      id: 1,
      time: 30,
      text: 'Câu 1 của 3: Khái niệm cơ bản?',
      question_type: 1, // single choice
      options: [
        { id: '1a', name_label: 'Đáp án A', value: false, is_correct: true },
        { id: '1b', name_label: 'Đáp án B', value: false, is_correct: false },
        { id: '1c', name_label: 'Đáp án C', value: false, is_correct: false }
      ]
    },
    {
      id: 2,
      time: 120,
      text: 'Câu 2 của 3: Chọn tất cả đúng (Multiple)?',
      question_type: 2, // multiple choice
      options: [
        { id: '2a', name_label: 'Tùy chọn A - Đúng', value: false, is_correct: true },
        { id: '2b', name_label: 'Tùy chọn B - Sai', value: false, is_correct: false },
        { id: '2c', name_label: 'Tùy chọn C - Đúng', value: false, is_correct: true }
      ]
    },
    {
      id: 3,
      time: 180,
      text: 'Câu 3 của 3: Trả lời tự luận?',
      question_type: 0, // fill-in
      options: []
    }
  ],

  // Finish Point
  finishPoint: 240, // Video hoàn thành ở 240 giây

  // User Progress (from backend)
  lastPlayTime: 120,
  maxPlayTime: 200
}

// ============================================================================
// 11. VÍ DỤ SỬ DỤNG TRONG COMPONENT
// ============================================================================
export const exampleComponentUsage = `
<template>
  <div class="video-lesson-page">
    <videoPlayerPlyr
      ref="videoPlayer"
      :src="videoConfig.src"
      :other_src="videoConfig.other_src"
      :autoplay="videoConfig.autoplay"
      :controls="videoConfig.controls"
      :markers="videoConfig.markers"
      :question-control="videoConfig.questionControl"
      :progress-control="videoConfig.progressControl"
      :last-play-time="userProgress.lastTime"
      :max-play-time="userProgress.maxTime"
      @play="onVideoPlay"
      @pause="onVideoPause"
      @timeUpdate="onTimeUpdate"
      @ended="onVideoEnded"
    />
  </div>
</template>

<script>
import videoPlayerPlyr from '@/components/videoPlayer/VideoPlayerPlyr.vue'
import { completeConfig } from '@/config/video-player-examples'

export default {
  components: { videoPlayerPlyr },
  data() {
    return {
      videoConfig: completeConfig,
      userProgress: {
        lastTime: 0,
        maxTime: 0
      }
    }
  },
  mounted() {
    this.loadVideoData()
  },
  methods: {
    async loadVideoData() {
      try {
        const response = await this.$api.getVideoInfo(this.$route.params.videoId)
        this.videoConfig.src = response.m3u8Url
        this.videoConfig.markers = response.questions
        this.userProgress = response.userProgress
      } catch (error) {
        this.$message.error('Failed to load video')
      }
    },
    onVideoPlay() {
      console.log('Video playing')
    },
    onVideoPause() {
      console.log('Video paused')
    },
    onTimeUpdate(e) {
      console.log('Current time:', e)
    },
    onVideoEnded() {
      this.$message.success('Video completed!')
    }
  }
}
</script>
`

export default {
  basicM3U8Config,
  multiQualityConfig,
  singleChoiceQuestionsConfig,
  multipleChoiceQuestionsConfig,
  fillInTheBlankConfig,
  resumePlayingConfig,
  progressControlConfig,
  learningPlatformConfig,
  trainingEvaluationConfig,
  completeConfig,
  exampleComponentUsage
}
