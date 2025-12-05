<template>
  <div class="relative group overflow-hidden">
    <div class="overflow-hidden">
      <div class="flex gap-3 transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${currentIndex * (100 / actualItemsPerView)}%)` }">
        <!-- Course Cards Carousel -->
        <div v-for="video in courses" :key="video.id" class="flex-none 2xl:w-[calc((100%-12px*4)/5)] xl:w-[calc((100%-12px*3)/4)] w-[calc((100%-12px*2)/3)] bg-gray-100 cursor-pointer hover:shadow-lg transition-shadow" @click="handleCourseClick(video)">
          <div class="pb-[50%] relative">
            <div class="absolute inset-0">
              <img v-if="video.thumbnail_path" class="w-full h-full object-cover" :src="`${$api.videoServer}/${video.thumbnail_path}`" alt="Video Thumbnail" />
              <div v-else class="w-full h-full bg-gray-300 flex items-center justify-center">
                <i class="el-icon-video-play text-gray-500 text-3xl"></i>
              </div>
            </div>
          </div>
          <div class="flex flex-col">
            <div class="p-3">{{ video.course_name_label ?? video[`course_name_${locale}`] ?? video.course_name_zh ?? video[`name_${locale}`] ?? video.name_zh }}</div>
          </div>
        </div>
      </div>

      <!-- Previous Button -->
      <button v-if="showNavigation && courses.length > actualItemsPerView" class="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center ring-0 outline-0! bg-white py-6 px-1 rounded-r-md transition-all duration-300 ease-in-out transform -translate-x-full group-hover:translate-x-0" :class="{ 'opacity-30 cursor-not-allowed': currentIndex === 0, 'opacity-100': currentIndex !== 0 }" @click="prevSlide" :disabled="currentIndex === 0" aria-label="Previous courses">
        <i class="el-icon-arrow-left text-lg text-black"></i>
      </button>

      <!-- Next Button -->
      <button v-if="showNavigation && courses.length > actualItemsPerView" class="absolute right-0 top-1/2 -translate-y-1/2 flex items-center justify-center ring-0 outline-0! bg-white py-6 px-1 rounded-l-md transition-all duration-300 ease-in-out transform translate-x-full group-hover:translate-x-0" :class="{ 'opacity-30 cursor-not-allowed': currentIndex >= maxScroll, 'opacity-100': currentIndex < maxScroll }" @click="nextSlide" :disabled="currentIndex >= maxScroll" aria-label="Next courses">
        <i class="el-icon-arrow-right text-lg text-black"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch, getCurrentInstance } from 'vue'

const props = defineProps({
  courses: {
    type: Array,
    default: () => [],
  },
  locale: {
    type: String,
    default: 'zh',
  },
  itemsPerView: {
    type: Number,
    default: 3,
  },
  showNavigation: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['course-click'])

const instance = getCurrentInstance()
const $api = instance.proxy.$api
const $router = instance.proxy.$router

// Reactive data
const currentIndex = ref(0)
const actualItemsPerView = ref(3) // Số items thực tế hiển thị dựa vào breakpoint

// Computed
const cardWidth = computed(() => {
  return 100 / actualItemsPerView.value
})
const maxScroll = computed(() => {
  return Math.max(0, props.courses.length - actualItemsPerView.value)
})

// Watch
watch(() => props.courses, (newVal) => {
  if (newVal.length > 0) {
    currentIndex.value = 0
  }
})

// Methods
const getItemsPerViewByBreakpoint = () => {
  const width = window.innerWidth
  // 2xl: >=1536px -> 5 items
  // xl: >=1280px -> 4 items
  // < xl -> 3 items
  if (width >= 1536) {
    return 5
  } else if (width >= 1280) {
    return 4
  } else {
    return 3
  }
}

const updateItemsPerView = () => {
  actualItemsPerView.value = getItemsPerViewByBreakpoint()
  // Reset index nếu vượt quá max
  if (currentIndex.value > maxScroll.value) {
    currentIndex.value = Math.max(0, maxScroll.value)
  }
}

const nextSlide = () => {
  if (currentIndex.value < maxScroll.value) {
    currentIndex.value += 1
  }
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value -= 1
  }
}

const goToSlide = (index) => {
  if (index >= 0 && index <= maxScroll.value) {
    currentIndex.value = index
  }
}

const handleCourseClick = (video) => {
  console.log('🎬 Course clicked:', video) // Debug
  emit('course-click', video)
}

const toPlayVideo = (video) => {
  $router.push({
    name: 'videoPlay',
    query: {
      course_primary_id: video.id,
      topic_id: video.pid,
    },
  })
}

// Lifecycle
onMounted(() => {
  // Khởi tạo actualItemsPerView
  updateItemsPerView()

  // Listen to window resize
  window.addEventListener('resize', updateItemsPerView)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateItemsPerView)
})
</script>

<style scoped>
.course-carousel-container {
  position: relative;
  padding: 0 3rem; /* Để chỗ cho nút prev/next */
}

.carousel-wrapper {
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
}

.carousel-content {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-item {
  flex-shrink: 0;
}

button:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
</style>
