<template>
  <div class="video-home">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Video Dashboard</h1>
      <p class="text-gray-600">Khám phá và học tập với thư viện video của chúng tôi</p>
    </div>

    <!-- Quick Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-blue-100 rounded-lg">
            <i class="el-icon-video-play text-blue-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Total Videos</p>
            <p class="text-xl font-semibold">{{ totalVideos }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-green-100 rounded-lg">
            <i class="el-icon-user text-green-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Active Users</p>
            <p class="text-xl font-semibold">{{ activeUsers }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-yellow-100 rounded-lg">
            <i class="el-icon-star-on text-yellow-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Total Views</p>
            <p class="text-xl font-semibold">{{ totalViews }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-4 rounded-lg shadow">
        <div class="flex items-center">
          <div class="p-2 bg-purple-100 rounded-lg">
            <i class="el-icon-trophy text-purple-600"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm text-gray-600">Courses</p>
            <p class="text-xl font-semibold">{{ totalCourses }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Featured Video -->
    <div class="bg-white rounded-lg shadow mb-6 overflow-hidden">
      <div class="p-6">
        <h2 class="text-xl font-semibold mb-4">Video Nổi Bật</h2>
        <div class="aspect-video bg-gray-200 rounded-lg flex items-center justify-center">
          <VideoPlayer
            v-if="featuredVideo"
            :video-src="featuredVideo.src"
            :poster="featuredVideo.poster"
            class="w-full h-full"
          />
          <div v-else class="text-center">
            <i class="el-icon-video-play text-4xl text-gray-400 mb-2"></i>
            <p class="text-gray-500">Chưa có video nổi bật</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Video Grid -->
    <div class="mb-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-xl font-semibold">Video Mới Nhất</h2>
        <el-button type="primary" size="small">
          <i class="el-icon-plus mr-1"></i>
          Xem Tất Cả
        </el-button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <VideoCard
          v-for="video in recentVideos"
          :key="video.id"
          :id="video.id"
          :title="video.title"
          :description="video.description"
          :thumbnail="video.thumbnail"
          :duration="video.duration"
          :views="video.views"
          :likes="video.likes"
          :upload-date="video.uploadDate"
          :tags="video.tags"
          :author="video.author"
          :is-favorite="video.isFavorite"
          @toggle-favorite="handleToggleFavorite"
          @share="handleShare"
          @more-options="handleMoreOptions"
        />
      </div>
    </div>

    <!-- Categories -->
    <div class="mb-6">
      <h2 class="text-xl font-semibold mb-4">Danh Mục</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div
          v-for="category in categories"
          :key="category.id"
          class="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer text-center"
        >
          <div class="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
            <i :class="category.icon" class="text-blue-600 text-xl"></i>
          </div>
          <h3 class="font-medium text-gray-900">{{ category.name }}</h3>
          <p class="text-sm text-gray-500">{{ category.count }} videos</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VideoPlayer from '@/components/Video/VideoPlayer/index.vue'
import VideoCard from '@/components/Video/VideoCard.vue'

export default {
  name: 'VideoHome',
  components: {
    VideoPlayer,
    VideoCard
  },
  data() {
    return {
      totalVideos: 0,
      activeUsers: 0,
      totalViews: 0,
      totalCourses: 0,
      featuredVideo: null,
      recentVideos: [],
      categories: [
        { id: 1, name: 'Training', icon: 'el-icon-school', count: 25 },
        { id: 2, name: 'Courses', icon: 'el-icon-document-copy', count: 18 },
        { id: 3, name: 'Tutorials', icon: 'el-icon-help', count: 32 },
        { id: 4, name: 'Webinars', icon: 'el-icon-monitor', count: 12 },
        { id: 5, name: 'Certifications', icon: 'el-icon-trophy', count: 8 },
        { id: 6, name: 'Updates', icon: 'el-icon-bell', count: 15 }
      ]
    }
  },
  mounted() {
    this.loadDashboardData()
  },
  methods: {
    async loadDashboardData() {
      try {
        // Mock data - replace with actual API calls
        this.totalVideos = 156
        this.activeUsers = 1247
        this.totalViews = 45230
        this.totalCourses = 23

        this.featuredVideo = {
          src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          poster: 'https://via.placeholder.com/640x360/4f46e5/ffffff?text=Featured+Video'
        }

        this.recentVideos = [
          {
            id: 1,
            title: 'Vue.js Fundamentals',
            description: 'Learn the basics of Vue.js framework',
            thumbnail: 'https://via.placeholder.com/320x180/10b981/ffffff?text=Vue.js',
            duration: 1800,
            views: 1250,
            likes: 89,
            uploadDate: new Date(Date.now() - 86400000),
            tags: ['Vue.js', 'JavaScript', 'Frontend'],
            author: 'Tech Academy',
            isFavorite: false
          },
          {
            id: 2,
            title: 'React vs Vue Comparison',
            description: 'Compare React and Vue.js frameworks',
            thumbnail: 'https://via.placeholder.com/320x180/f59e0b/ffffff?text=React+vs+Vue',
            duration: 2400,
            views: 890,
            likes: 67,
            uploadDate: new Date(Date.now() - 172800000),
            tags: ['React', 'Vue.js', 'Comparison'],
            author: 'Dev Insights',
            isFavorite: true
          },
          {
            id: 3,
            title: 'Node.js Backend Development',
            description: 'Build scalable backend with Node.js',
            thumbnail: 'https://via.placeholder.com/320x180/8b5cf6/ffffff?text=Node.js',
            duration: 3600,
            views: 2100,
            likes: 145,
            uploadDate: new Date(Date.now() - 259200000),
            tags: ['Node.js', 'Backend', 'API'],
            author: 'Server Pro',
            isFavorite: false
          }
        ]
      } catch (error) {
        console.error('Error loading dashboard data:', error)
        this.$message.error('Không thể tải dữ liệu dashboard')
      }
    },

    handleToggleFavorite(videoId) {
      const video = this.recentVideos.find(v => v.id === videoId)
      if (video) {
        video.isFavorite = !video.isFavorite
        this.$message.success(
          video.isFavorite ? 'Đã thêm vào yêu thích' : 'Đã bỏ khỏi yêu thích'
        )
      }
    },

    handleShare(videoId) {
      // Implement share functionality
      this.$message.info(`Chia sẻ video ${videoId}`)
    },

    handleMoreOptions(videoId) {
      // Implement more options menu
      this.$message.info(`Tùy chọn cho video ${videoId}`)
    }
  }
}
</script>

<style scoped>
.video-home {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}
</style>
