<template>
  <div>
    <div class="banner-carousel-container w-full relative bg-black group" v-if="banners.length">
      <!-- Banner Items -->
      <div class="carousel-wrapper w-full overflow-hidden">
        <div class="carousel-content flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
          <div v-for="(banner, index) in banners" :key="index" class="carousel-item w-full shrink-0">
            <div class="w-screen pb-[28%] relative">
              <div class="absolute inset-0">
                <div class="relative w-full h-full">
                  <img :src="banner.image" alt="" class="h-full w-full object-cover cursor-pointer" @click="handleBannerClick(banner)" />
                </div>
                <div class="absolute bottom-0 left-0 p-5 text-white text-lg font-semibold bg-linear-to-t from-black via-black/80 to-transparent w-full">
                  {{ banner.title }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Previous Button -->
      <button v-if="showNavigation" class="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-0" @click="prevSlide" aria-label="Previous banner">
        <i class="el-icon-arrow-left text-lg"></i>
      </button>

      <!-- Next Button -->
      <button v-if="showNavigation" class="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 translate-x-full group-hover:translate-x-0" @click="nextSlide" aria-label="Next banner">
        <i class="el-icon-arrow-right text-lg"></i>
      </button>

      <!-- Dots Navigation -->
      <div v-if="showDots" class="absolute bottom-4 right-4 transform z-10 flex gap-2">
        <button v-for="(banner, index) in banners" :key="`thumb-${index}`" class="thumbnail transition-all rounded-md overflow-hidden border-2 cursor-pointer" :class="[index === currentIndex ? 'border-white ring-2 ring-white' : 'border-gray-400 hover:border-white']" @click="goToSlide(index)" :aria-label="`Go to banner ${index + 1}`">
          <img :src="banner.image" alt="" class="w-12 h-12 object-cover" />
        </button>
      </div>
    </div>
    <div class="bg-gray-200 z-50 animate-pulse pb-[28%]" v-else></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  banners: {
    type: Array,
    default: () => [],
  },
  autoPlay: {
    type: Boolean,
    default: true,
  },
  autoPlayInterval: {
    type: Number,
    default: 5000, // 5 seconds
  },
  showNavigation: {
    type: Boolean,
    default: true,
  },
  showDots: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['banner-click'])

// Reactive data
const currentIndex = ref(0)
const autoPlayTimer = ref(null)

// Watch
watch(() => props.banners, (newVal) => {
  if (newVal.length > 0) {
    currentIndex.value = 0
    startAutoPlay()
  }
})

// Methods
const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % props.banners.length
  resetAutoPlay()
}

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + props.banners.length) % props.banners.length
  resetAutoPlay()
}

const goToSlide = (index) => {
  currentIndex.value = index
  resetAutoPlay()
}

const handleBannerClick = (banner) => {
  emit('banner-click', banner)
}

const startAutoPlay = () => {
  if (!props.autoPlay || props.banners.length <= 1) return
  // Tránh tạo multiple timers
  if (autoPlayTimer.value) {
    clearInterval(autoPlayTimer.value)
  }
  autoPlayTimer.value = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % props.banners.length
  }, props.autoPlayInterval)
}

const resetAutoPlay = () => {
  if (autoPlayTimer.value) {
    clearInterval(autoPlayTimer.value)
  }
  startAutoPlay()
}

const pauseAutoPlay = () => {
  if (autoPlayTimer.value) {
    clearInterval(autoPlayTimer.value)
    autoPlayTimer.value = null
  }
}

// Lifecycle
onMounted(() => {
  if (props.banners.length > 0) {
    startAutoPlay()
  }
})

onUnmounted(() => {
  if (autoPlayTimer.value) {
    clearInterval(autoPlayTimer.value)
  }
})
</script>

<style scoped>
.banner-carousel-container {
  width: 100%;
  overflow: hidden;
}

.carousel-wrapper {
  position: relative;
  width: 100%;
}

.carousel-content {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-item {
  flex-shrink: 0;
  width: 100%;
}

.dot {
  transition: all 0.3s ease;
}

.dot.active {
  background-color: white;
  width: 2rem;
}

button {
  outline: none;
  border: none;
  cursor: pointer;
}

button:focus {
  outline: 2px solid white;
  outline-offset: 2px;
}
</style>
