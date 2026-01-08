<template>
  <div class="video-card bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer">
    <!-- Video Thumbnail -->
    <div class="relative aspect-video bg-gray-200">
      <img
        v-if="thumbnail"
        :src="thumbnail"
        :alt="title"
        class="w-full h-full object-cover"
        @error="onImageError"
      />
      <div v-else class="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
        <i class="el-icon-video-play text-white text-4xl"></i>
      </div>

      <!-- Play Overlay -->
      <div class="play-overlay absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
        <div class="play-button bg-white/90 rounded-full p-3 shadow-lg">
          <i class="el-icon-video-play text-gray-800 text-xl"></i>
        </div>
      </div>

      <!-- Duration Badge -->
      <div v-if="duration" class="duration-badge absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        {{ formatDuration(duration) }}
      </div>
    </div>

    <!-- Video Info -->
    <div class="p-4">
      <!-- Title -->
      <h3 class="font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors">
        {{ title }}
      </h3>

      <!-- Description -->
      <p v-if="description" class="text-gray-600 text-sm mb-3 line-clamp-2">
        {{ description }}
      </p>

      <!-- Meta Info -->
      <div class="flex items-center justify-between text-xs text-gray-500">
        <div class="flex items-center space-x-3">
          <!-- Views -->
          <span v-if="views !== undefined" class="flex items-center">
            <i class="el-icon-view mr-1"></i>
            {{ formatNumber(views) }}
          </span>

          <!-- Likes -->
          <span v-if="likes !== undefined" class="flex items-center">
            <i class="el-icon-star-off mr-1"></i>
            {{ formatNumber(likes) }}
          </span>
        </div>

        <!-- Upload Date -->
        <span v-if="uploadDate">
          {{ formatDate(uploadDate) }}
        </span>
      </div>

      <!-- Tags -->
      <div v-if="tags && tags.length > 0" class="mt-3 flex flex-wrap gap-1">
        <span
          v-for="tag in tags.slice(0, 3)"
          :key="tag"
          class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full"
        >
          {{ tag }}
        </span>
        <span v-if="tags.length > 3" class="text-xs text-gray-500">
          +{{ tags.length - 3 }} more
        </span>
      </div>

      <!-- Author -->
      <div v-if="author" class="mt-3 flex items-center">
        <div class="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-2">
          <i class="el-icon-user text-xs text-gray-600"></i>
        </div>
        <span class="text-sm text-gray-700">{{ author }}</span>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="px-4 pb-4 flex items-center justify-between">
      <div class="flex space-x-2">
        <!-- Favorite Button -->
        <button
          @click.stop="toggleFavorite"
          :class="[
            'flex items-center space-x-1 px-3 py-1 rounded-full text-xs transition-colors',
            isFavorite
              ? 'bg-red-100 text-red-600 hover:bg-red-200'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          ]"
        >
          <i :class="isFavorite ? 'el-icon-star-on' : 'el-icon-star-off'"></i>
          <span>{{ isFavorite ? 'Favorited' : 'Favorite' }}</span>
        </button>

        <!-- Share Button -->
        <button
          @click.stop="shareVideo"
          class="flex items-center space-x-1 px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
        >
          <i class="el-icon-share"></i>
          <span>Share</span>
        </button>
      </div>

      <!-- More Options -->
      <button
        @click.stop="showMoreOptions"
        class="p-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <i class="el-icon-more"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'VideoCard'
})

const props = defineProps({
  id: {
    type: [String, Number],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  thumbnail: {
    type: String,
    default: ''
  },
  duration: {
    type: Number,
    default: 0
  },
  views: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  uploadDate: {
    type: [String, Date],
    default: null
  },
  tags: {
    type: Array,
    default: () => []
  },
  author: {
    type: String,
    default: ''
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['thumbnail-error', 'toggle-favorite', 'share', 'more-options'])

const onImageError = () => {
  // Handle thumbnail load error
  emit('thumbnail-error', props.id)
}

const toggleFavorite = () => {
  emit('toggle-favorite', props.id)
}

const shareVideo = () => {
  emit('share', props.id)
}

const showMoreOptions = () => {
  emit('more-options', props.id)
}

const formatDuration = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`
}

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

const formatDate = (date) => {
  if (!date) return ''

  const now = new Date()
  const uploadDate = new Date(date)
  const diffTime = Math.abs(now - uploadDate)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 1) return 'Today'
  if (diffDays === 2) return 'Yesterday'
  if (diffDays <= 7) return `${diffDays - 1} days ago`
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`
  if (diffDays <= 365) return `${Math.ceil(diffDays / 30)} months ago`
  return `${Math.ceil(diffDays / 365)} years ago`
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.aspect-video {
  aspect-ratio: 16 / 9;
}

.play-overlay {
  transition: opacity 0.3s ease;
}

.video-card:hover .play-overlay {
  opacity: 1;
}
</style>
