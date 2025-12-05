# Hướng Dẫn Sử Dụng Plyr Video Player Component

## Tổng Quan

Component `videoPlayerPlyr.vue` là một trình phát video hiện đại sử dụng **Plyr** và **HLS.js**, hỗ trợ phát các video M3U8 có mã hóa AES-128.

## Đặc Điểm Chính

✅ **Hỗ trợ HLS/M3U8** - Phát video stream với mã hóa AES-128  
✅ **Xử lý Encryption Keys** - Tự động lấy keys từ endpoint riêng  
✅ **Plyr UI** - Giao diện player hiện đại và dễ sử dụng  
✅ **Chuyển Chất Lượng** - Hỗ trợ chuyển đổi giữa các độ phân giải  
✅ **Đánh Dấu Câu Hỏi** - Tạm dừng video tại các điểm cụ thể để đặt câu hỏi  
✅ **Tiếp Tục Phát** - Lưu lại vị trí phát cuối cùng  

## Cài Đặt

### 1. Kiểm Tra Dependencies

```bash
npm list plyr hls.js
```

Nếu chưa có, cài đặt:

```bash
npm install plyr hls.js
```

### 2. Import Component

```vue
<template>
  <div>
    <videoPlayerPlyr
      ref="videoPlayer"
      :src="videoUrl"
      :other_src="qualities"
      :autoplay="true"
      :controls="true"
      :markers="questions"
      :question-control="true"
      :progress-control="true"
      :last-play-time="lastPlayTime"
      :max-play-time="maxPlayTime"
      @timeUpdate="onTimeUpdate"
      @ended="onEnded"
    />
  </div>
</template>

<script>
import videoPlayerPlyr from '@/components/videoPlayer/videoPlayerPlyr.vue'

export default {
  components: {
    videoPlayerPlyr
  },
  data() {
    return {
      videoUrl: 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=30f98387-3f77-47c1-97e9-a1dc9327c6e9&type=original',
      qualities: {
        '1080P': 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=30f98387-3f77-47c1-97e9-a1dc9327c6e9&type=1080p',
        '720P': 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=30f98387-3f77-47c1-97e9-a1dc9327c6e9&type=720p',
        '480P': 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=30f98387-3f77-47c1-97e9-a1dc9327c6e9&type=480p'
      },
      questions: [
        {
          id: 1,
          time: 30,
          text: 'Câu 1: Bạn hiểu gì về...',
          question_type: 1, // 1: single choice, 2: multiple choice, 0: fill-in
          options: [
            { id: 1, name_label: 'Đáp án A', value: false, is_correct: true },
            { id: 2, name_label: 'Đáp án B', value: false, is_correct: false }
          ]
        }
      ],
      lastPlayTime: 0,
      maxPlayTime: 0
    }
  },
  methods: {
    onTimeUpdate(event) {
      console.log('Current time:', event)
    },
    onEnded(event) {
      console.log('Video ended')
    }
  }
}
</script>
```

## Props

| Prop | Type | Default | Mô Tả |
|------|------|---------|-------|
| `src` | String | '' | URL video M3U8 (hỗ trợ mã hóa AES-128) |
| `other_src` | Object | {} | Object chứa các URL khác độ phân giải (key: tên, value: URL) |
| `autoplay` | Boolean | false | Tự động phát video khi load |
| `controls` | Boolean | true | Hiển thị các nút điều khiển |
| `loop` | Boolean | false | Lặp lại video khi kết thúc |
| `muted` | Boolean | false | Tắt tiếng khi phát |
| `poster` | String | '' | Hình ảnh poster/thumbnail |
| `playbackRate` | Number | 1 | Tốc độ phát ban đầu |
| `playbackRateArray` | Array | [1] | Các tốc độ phát có sẵn |
| `markers` | Array | [] | Mảng các câu hỏi để đặt câu hỏi |
| `question-control` | Boolean | false | Bật/tắt chế độ hỏi đáp |
| `progress-control` | Boolean | false | Cấm người dùng tua video (ngoài maxPlayTime) |
| `last-play-time` | Number | 0 | Vị trí phát cuối cùng (từ backend) |
| `max-play-time` | Number | 0 | Vị trí phát tối đa được phép |
| `finish-point` | Number | 0 | Điểm hoàn thành (tự động đặt marker) |

## Xử Lý M3U8 Encryption

### Cơ Chế Hoạt Động

1. **Backend trả về M3U8** với thông tin key:
   ```
   #EXT-X-KEY:METHOD=AES-128,URI="http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetKey?...",IV=0x...
   ```

2. **HLS.js tự động** gọi key loader để lấy key từ endpoint `GetKey`

3. **Encryption Key Handler** xử lý request và cache keys

### File Hỗ Trợ

**`src/utils/hls-encryption.js`** - Xử lý lấy và cache keys:

```javascript
import hlsEncryption from '@/utils/hls-encryption'

// Keys sẽ được cache tự động để tránh request lặp lại
```

### Cấu Hình Tùy Chỉnh

Nếu cần tùy chỉnh cách xử lý keys, sửa trong `videoPlayerPlyr.vue`:

```javascript
setupHLS() {
  if (Hls.isSupported()) {
    this.hls = new Hls({
      xhrSetup: (xhr, url) => {
        // Thêm token vào requests
        if (url.includes('GetKey') || url.includes('GetVideo')) {
          xhr.setRequestHeader('token', getToken())
        }
      },
      keyLoader: async (keyInfo, callback) => {
        // Custom key loading logic
        const keyData = await hlsEncryption.fetchKey(keyInfo.uri)
        callback(null, new Uint8Array(keyData))
      }
    })
  }
}
```

## Events

| Event | Tham Số | Mô Tả |
|-------|---------|-------|
| `play` | Event | Video bắt đầu phát |
| `pause` | Event | Video bị tạm dừng |
| `timeUpdate` | Event | Cập nhật thời gian phát |
| `ended` | Event | Video kết thúc |
| `seeking` | Event | Người dùng tua video |
| `seeked` | Event | Tua video hoàn thành |
| `error` | Event | Lỗi trong quá trình phát |
| `loadedMetadata` | Event | Metadata được load |
| `canPlay` | Event | Video sẵn sàng phát |
| `update:playStatus` | Boolean | Cập nhật trạng thái phát (dùng `.sync`) |

## Ví Dụ Hoàn Chỉnh

```vue
<template>
  <div class="video-page">
    <videoPlayerPlyr
      ref="videoPlayer"
      :src="videoUrl"
      :other_src="qualities"
      :autoplay="false"
      :controls="true"
      :markers="questions"
      :question-control="true"
      :progress-control="true"
      :last-play-time="userProgress.lastTime"
      :max-play-time="userProgress.maxTime"
      :playback-rate-array="[0.5, 1, 1.5, 2]"
      @play="handlePlay"
      @pause="handlePause"
      @ended="handleEnd"
    />
  </div>
</template>

<script>
import videoPlayerPlyr from '@/components/videoPlayer/videoPlayerPlyr.vue'

export default {
  components: { videoPlayerPlyr },
  data() {
    return {
      videoUrl: 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=xxx',
      qualities: {
        'HD': 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=xxx&type=hd',
        'SD': 'http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=xxx&type=sd'
      },
      questions: [],
      userProgress: {
        lastTime: 0,
        maxTime: 0
      }
    }
  },
  mounted() {
    this.fetchVideoData()
  },
  methods: {
    async fetchVideoData() {
      // Lấy dữ liệu video từ backend
      const response = await this.$api.getVideoInfo(this.$route.params.videoId)
      this.videoUrl = response.m3u8Url
      this.questions = response.questions
      this.userProgress = response.userProgress
    },
    handlePlay() {
      this.$emit('video-play')
    },
    handlePause() {
      this.$emit('video-pause')
    },
    handleEnd() {
      this.$message.success('Video hoàn thành!')
    }
  }
}
</script>
```

## Lưu Ý Quan Trọng

⚠️ **Không hard code text** - Sử dụng i18n keys từ `src/lang/`

⚠️ **Token Authentication** - Component tự động thêm token vào requests (xem `getToken()`)

⚠️ **Cache Keys** - Encryption keys được cache để tối ưu performance

⚠️ **Browser Support** - HLS.js hỗ trợ mọi browser, Safari dùng native HLS

## Troubleshooting

### Video không phát
- Kiểm tra URL M3U8 có đúng không
- Xác nhận token authorization
- Kiểm tra console cho lỗi CORS

### Mã hóa không hoạt động
- Đảm bảo endpoint `GetKey` trả về binary data
- Kiểm tra header `Content-Type: application/octet-stream`

### Câu hỏi không hiển thị
- Kiểm tra `question_type` có đúng (0, 1, hoặc 2)
- Verify `time` trùng với vị trí trong video

## Hỗ Trợ

Nếu có vấn đề, liên hệ team development!
