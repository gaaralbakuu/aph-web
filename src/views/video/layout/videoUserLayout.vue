<template>
  <div class="video-user-layout">
    <!-- Header -->
    <div class="bg-white shadow-sm border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center">
            <h1 class="text-xl font-bold text-gray-900">Video Learning</h1>
          </div>

          <!-- Navigation -->
          <nav class="hidden md:flex space-x-8">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.path"
              class="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors"
              :class="{ 'text-blue-600 border-b-2 border-blue-600': $route.path === item.path }"
            >
              {{ item.name }}
            </router-link>
          </nav>

          <!-- User Menu -->
          <div class="flex items-center space-x-4">
            <!-- Search -->
            <div class="relative">
              <input
                type="text"
                placeholder="Tìm kiếm video..."
                class="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <i class="el-icon-search absolute left-3 top-2.5 text-gray-400"></i>
            </div>

            <!-- User Avatar -->
            <div class="flex items-center space-x-2">
              <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <i class="el-icon-user text-white text-sm"></i>
              </div>
              <span class="text-sm text-gray-700 hidden md:block">User</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex min-h-screen bg-gray-50">
      <!-- Sidebar -->
      <div class="w-64 bg-white shadow-sm">
        <div class="p-4">
          <nav class="space-y-2">
            <router-link
              v-for="item in navigation"
              :key="item.name"
              :to="item.path"
              class="flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              :class="[
                $route.path === item.path
                  ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              ]"
            >
              <i :class="item.icon" class="mr-3"></i>
              {{ item.name }}
            </router-link>
          </nav>
        </div>
      </div>

      <!-- Content Area -->
      <div class="flex-1">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VideoUserLayout',
  data() {
    return {
      navigation: [
        {
          name: 'Dashboard',
          path: '/videoLayout/home',
          icon: 'el-icon-s-home'
        },
        {
          name: 'My Training',
          path: '/videoLayout/mine/training',
          icon: 'el-icon-school'
        },
        {
          name: 'Favorites',
          path: '/videoLayout/mine/favorite',
          icon: 'el-icon-star-on'
        },
        {
          name: 'Watch History',
          path: '/videoLayout/mine/history',
          icon: 'el-icon-time'
        },
        {
          name: 'Courses',
          path: '/videoLayout/course',
          icon: 'el-icon-document-copy'
        },
        {
          name: 'Topics',
          path: '/videoLayout/topic',
          icon: 'el-icon-price-tag'
        }
      ]
    }
  }
}
</script>

<style scoped>
.video-user-layout {
  min-height: 100vh;
}
</style>
