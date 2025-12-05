# API Compatibility Guide: Video.js → Plyr

## Video.js API vs Plyr Differences

### ❌ Video.js API (Không còn hỗ trợ)
```javascript
player.playbackRate()           // Get rate
player.playbackRate(1.5)        // Set rate
player.paused()                 // Get paused state
player.currentTime()            // Get time
player.currentTime(120)         // Set time
player.duration()               // Get duration
player.volume()                 // Get volume
player.volume(0.5)              // Set volume
player.play()                   // Play
player.pause()                  // Pause
```

### ✅ Plyr API (Mới)
```javascript
player.speed                    // Get/Set rate
player.paused                   // Get paused state (property, not method)
player.currentTime              // Get/Set time
player.duration                 // Get duration
player.volume                   // Get/Set volume
player.play()                   // Play
player.pause()                  // Pause
```

### ✅ Compatibility Layer (Hỗ Trợ Cả Hai)
```javascript
// videoPlayerPlyr.vue exports these methods for backward compatibility
this.$refs.videoPlayer.getPlaybackRate()        // Get rate
this.$refs.videoPlayer.setPlaybackRate(1.5)     // Set rate
this.$refs.videoPlayer.getCurrentTime()         // Get time
this.$refs.videoPlayer.setCurrentTime(120)      // Set time
this.$refs.videoPlayer.getDuration()            // Get duration
this.$refs.videoPlayer.getVolume()              // Get volume
this.$refs.videoPlayer.setVolume(0.5)           // Set volume
```

---

## ✅ Cách Update Code

### Cách 1: Sử Dụng Compatibility Layer (Khuyên Dùng)
```javascript
// OLD (Video.js)
let rate = this.$refs.videoPlayer.player.playbackRate()
this.$refs.videoPlayer.player.playbackRate(1.5)

// NEW (Plyr with Compatibility)
let rate = this.$refs.videoPlayer.getPlaybackRate()
this.$refs.videoPlayer.setPlaybackRate(1.5)
```

### Cách 2: Trực Tiếp Sử Dụng Plyr API
```javascript
// Plyr properties (not methods)
let rate = this.$refs.videoPlayer.player.speed
this.$refs.videoPlayer.player.speed = 1.5
```

---

## 📋 File Cần Update

### Đã Update ✅
- `videoPlayerPlyr.vue` - Thêm compatibility methods
- `play.vue` - Sửa `playbackRate()` call

### Cần Check ⚠️
Tìm các file khác sử dụng `.player.playbackRate()`, `.player.paused()`, etc:

```bash
# Tìm tất cả file reference
grep -r "\.player\.playbackRate\(\)" src/
grep -r "\.player\.paused\(\)" src/
grep -r "\.player\.currentTime\(\)" src/
grep -r "\.player\.duration\(\)" src/
grep -r "\.player\.volume\(\)" src/
```

---

## 🔧 Quick Fix Examples

### Example 1: Playback Rate
```javascript
// ❌ OLD
if (this.$refs.videoPlayer.player.playbackRate() != 1) {
  // Speed not normal
}

// ✅ NEW
const rate = this.$refs.videoPlayer.getPlaybackRate()
if (rate != 1) {
  // Speed not normal
}
```

### Example 2: Paused State
```javascript
// ❌ OLD
let isPlaying = !this.$refs.videoPlayer.player.paused()

// ✅ NEW
let isPlaying = this.$refs.videoPlayer.flagObj.isPlaying
```

### Example 3: Current Time
```javascript
// ❌ OLD
let progress = this.$refs.videoPlayer.player.currentTime()
this.$refs.videoPlayer.player.currentTime(120)

// ✅ NEW - Use videoObj (already exists!)
let progress = this.$refs.videoPlayer.videoObj.currentTime
this.$refs.videoPlayer.setCurrentTime(120)
```

### Example 4: Duration
```javascript
// ❌ OLD
let duration = this.$refs.videoPlayer.player.duration()

// ✅ NEW
let duration = this.$refs.videoPlayer.videoObj.duration
// OR
let duration = this.$refs.videoPlayer.getDuration()
```

### Example 5: Volume
```javascript
// ❌ OLD
let vol = this.$refs.videoPlayer.player.volume()
this.$refs.videoPlayer.player.volume(0.8)

// ✅ NEW
let vol = this.$refs.videoPlayer.getVolume()
this.$refs.videoPlayer.setVolume(0.8)
```

---

## 🎯 Recommendation: Use videoObj for Most Properties

`videoPlayerPlyr.vue` có `videoObj` object chứa trạng thái video:

```javascript
this.$refs.videoPlayer.videoObj = {
  videoUrl: '',              // Video URL
  duration: 0,               // Total duration
  watchMaxTime: 0,           // Max play time allowed
  currentTime: 0,            // Current play position
  copyCurrentTime: 0         // Last copied time
}

this.$refs.videoPlayer.flagObj = {
  isPlaying: false,          // Is video playing
  // ... other flags
}
```

**Ưu điểm:**
- Đã được update realtime
- Không cần gọi method
- Tốc độ nhanh hơn

**Ví dụ:**
```javascript
// ✅ BEST - Dùng videoObj
let progress = this.$refs.videoPlayer.videoObj.currentTime
let duration = this.$refs.videoPlayer.videoObj.duration
let isPlaying = this.$refs.videoPlayer.flagObj.isPlaying

// ✅ GOOD - Dùng compatibility methods
let progress = this.$refs.videoPlayer.getCurrentTime()
let duration = this.$refs.videoPlayer.getDuration()

// ⚠️ Avoid - Truy cập player trực tiếp nếu không cần
let progress = this.$refs.videoPlayer.player.currentTime
```

---

## ✨ Summary

| Property/Method | Video.js | Plyr | Compatibility | Recommended |
|-----------------|----------|------|---------------|-------------|
| Playback Rate | `playbackRate()` | `speed` | `getPlaybackRate()` | ✅ compatibility |
| Paused State | `paused()` | `paused` (prop) | `flagObj.isPlaying` | ✅ videoObj |
| Current Time | `currentTime()` | `currentTime` | `getCurrentTime()` | ✅ videoObj |
| Duration | `duration()` | `duration` | `getDuration()` | ✅ videoObj |
| Volume | `volume()` | `volume` | `getVolume()` | ✅ compatibility |
| Play | `play()` | `play()` | ✅ Same | ✅ Same |
| Pause | `pause()` | `pause()` | ✅ Same | ✅ Same |

---

## Testing

Sau khi update, test các tính năng:

```javascript
// Test playback rate
this.$refs.videoPlayer.setPlaybackRate(1.5)
console.log(this.$refs.videoPlayer.getPlaybackRate()) // Should be 1.5

// Test time
this.$refs.videoPlayer.setCurrentTime(60)
console.log(this.$refs.videoPlayer.getCurrentTime()) // Should be 60

// Test volume
this.$refs.videoPlayer.setVolume(0.5)
console.log(this.$refs.videoPlayer.getVolume()) // Should be 0.5

// Test state
console.log(this.$refs.videoPlayer.videoObj.currentTime) // Current time
console.log(this.$refs.videoPlayer.videoObj.duration) // Duration
console.log(this.$refs.videoPlayer.flagObj.isPlaying) // Is playing
```

---

## FAQ

**Q: Tại sao lỗi này xảy ra?**
A: Vì video.js sử dụng methods (hàm) để get/set properties, nhưng Plyr sử dụng properties trực tiếp. API interface hoàn toàn khác nhau.

**Q: Nên sử dụng cách nào?**
A: 
1. Ưu tiên dùng `videoObj` (nhanh nhất, đã có)
2. Tiếp theo dùng compatibility methods (`getPlaybackRate()`, etc.)
3. Tránh gọi `player` trực tiếp nếu có cách khác

**Q: Có API nào khác khác nhau?**
A: Chủ yếu là 5 cái trên. Play/pause/destroy giống nhau.

**Q: Phải update tất cả file không?**
A: Chỉ những file dùng old video.js API. Tìm bằng grep.

