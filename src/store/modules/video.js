const state = {
  // Video Management
  videoList: [],
  currentVideo: null,
  videoCategories: [],
  videoTags: [],

  // Course Management
  courses: [],
  currentCourse: null,
  courseCategories: [],

  // User Progress
  userProgress: {},
  watchHistory: [],
  favorites: [],

  // Training Management
  trainings: [],
  currentTraining: null,
  trainingClasses: [],

  // Exam System
  exams: [],
  currentExam: null,
  userExamResults: [],

  // Analytics
  videoAnalytics: {},
  learningAnalytics: {},

  // System Settings
  videoSettings: {},
  userRoles: [],
  menuPermissions: [],

  // UI State
  loading: false,
  error: null
}

const mutations = {
  // Video mutations
  SET_VIDEO_LIST: (state, videos) => {
    state.videoList = videos
  },
  SET_CURRENT_VIDEO: (state, video) => {
    state.currentVideo = video
  },
  ADD_VIDEO: (state, video) => {
    state.videoList.unshift(video)
  },
  UPDATE_VIDEO: (state, updatedVideo) => {
    const index = state.videoList.findIndex(v => v.id === updatedVideo.id)
    if (index !== -1) {
      state.videoList.splice(index, 1, updatedVideo)
    }
  },
  DELETE_VIDEO: (state, videoId) => {
    state.videoList = state.videoList.filter(v => v.id !== videoId)
  },

  // Course mutations
  SET_COURSES: (state, courses) => {
    state.courses = courses
  },
  SET_CURRENT_COURSE: (state, course) => {
    state.currentCourse = course
  },

  // User Progress mutations
  SET_USER_PROGRESS: (state, progress) => {
    state.userProgress = { ...state.userProgress, ...progress }
  },
  SET_WATCH_HISTORY: (state, history) => {
    state.watchHistory = history
  },
  ADD_TO_FAVORITES: (state, videoId) => {
    if (!state.favorites.includes(videoId)) {
      state.favorites.push(videoId)
    }
  },
  REMOVE_FROM_FAVORITES: (state, videoId) => {
    state.favorites = state.favorites.filter(id => id !== videoId)
  },

  // Training mutations
  SET_TRAININGS: (state, trainings) => {
    state.trainings = trainings
  },
  SET_CURRENT_TRAINING: (state, training) => {
    state.currentTraining = training
  },

  // Exam mutations
  SET_EXAMS: (state, exams) => {
    state.exams = exams
  },
  SET_CURRENT_EXAM: (state, exam) => {
    state.currentExam = exam
  },
  SET_EXAM_RESULTS: (state, results) => {
    state.userExamResults = results
  },

  // Analytics mutations
  SET_VIDEO_ANALYTICS: (state, analytics) => {
    state.videoAnalytics = analytics
  },
  SET_LEARNING_ANALYTICS: (state, analytics) => {
    state.learningAnalytics = analytics
  },

  // System mutations
  SET_VIDEO_SETTINGS: (state, settings) => {
    state.videoSettings = settings
  },
  SET_USER_ROLES: (state, roles) => {
    state.userRoles = roles
  },
  SET_MENU_PERMISSIONS: (state, permissions) => {
    state.menuPermissions = permissions
  },

  // UI mutations
  SET_LOADING: (state, loading) => {
    state.loading = loading
  },
  SET_ERROR: (state, error) => {
    state.error = error
  },
  CLEAR_ERROR: (state) => {
    state.error = null
  }
}

const actions = {
  // Video Actions
  async fetchVideos({ commit }, params = {}) {
    commit('SET_LOADING', true)
    try {
      const response = await this._vm.$api.video.getVideoList(params)
      commit('SET_VIDEO_LIST', response.data.list || response.data)
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchVideoById({ commit }, videoId) {
    commit('SET_LOADING', true)
    try {
      const response = await this._vm.$api.video.getVideoById(videoId)
      commit('SET_CURRENT_VIDEO', response.data)
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async createVideo({ commit }, videoData) {
    commit('SET_LOADING', true)
    try {
      const response = await this._vm.$api.video.createVideo(videoData)
      commit('ADD_VIDEO', response.data)
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async updateVideo({ commit }, { videoId, videoData }) {
    commit('SET_LOADING', true)
    try {
      const response = await this._vm.$api.video.updateVideo(videoId, videoData)
      commit('UPDATE_VIDEO', response.data)
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async deleteVideo({ commit }, videoId) {
    commit('SET_LOADING', true)
    try {
      await this._vm.$api.video.deleteVideo(videoId)
      commit('DELETE_VIDEO', videoId)
      return true
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Course Actions
  async fetchCourses({ commit }, params = {}) {
    commit('SET_LOADING', true)
    try {
      const response = await this._vm.$api.videoCourse.getCourseList(params)
      commit('SET_COURSES', response.data.list || response.data)
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // User Progress Actions
  async fetchUserProgress({ commit }, userId) {
    try {
      const response = await this._vm.$api.video.getUserProgress(userId)
      commit('SET_USER_PROGRESS', response.data)
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    }
  },

  async updateProgress({ commit }, progressData) {
    try {
      const response = await this._vm.$api.video.updateProgress(progressData)
      commit('SET_USER_PROGRESS', response.data)
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    }
  },

  async fetchWatchHistory({ commit }, userId) {
    try {
      const response = await this._vm.$api.video.getWatchHistory(userId)
      commit('SET_WATCH_HISTORY', response.data)
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    }
  },

  async addToFavorites({ commit }, videoId) {
    try {
      await this._vm.$api.video.addToFavorites(videoId)
      commit('ADD_TO_FAVORITES', videoId)
      return true
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    }
  },

  async removeFromFavorites({ commit }, videoId) {
    try {
      await this._vm.$api.video.removeFromFavorites(videoId)
      commit('REMOVE_FROM_FAVORITES', videoId)
      return true
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    }
  },

  // Training Actions
  async fetchTrainings({ commit }, params = {}) {
    commit('SET_LOADING', true)
    try {
      const response = await this._vm.$api.videoTrain.getTrainingList(params)
      commit('SET_TRAININGS', response.data.list || response.data)
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Exam Actions
  async fetchExams({ commit }, params = {}) {
    commit('SET_LOADING', true)
    try {
      const response = await this._vm.$api.videoExam.getExamList(params)
      commit('SET_EXAMS', response.data.list || response.data)
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async submitExam({ commit }, examData) {
    commit('SET_LOADING', true)
    try {
      const response = await this._vm.$api.videoExam.submitExam(examData)
      commit('SET_EXAM_RESULTS', response.data)
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  // Analytics Actions
  async fetchVideoAnalytics({ commit }, params = {}) {
    try {
      const response = await this._vm.$api.videoAnalyze.getVideoAnalytics(params)
      commit('SET_VIDEO_ANALYTICS', response.data)
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    }
  },

  async fetchLearningAnalytics({ commit }, params = {}) {
    try {
      const response = await this._vm.$api.videoAnalyze.getLearningAnalytics(params)
      commit('SET_LEARNING_ANALYTICS', response.data)
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    }
  },

  // System Actions
  async fetchVideoSettings({ commit }) {
    try {
      const response = await this._vm.$api.video.getSettings()
      commit('SET_VIDEO_SETTINGS', response.data)
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    }
  },

  async updateVideoSettings({ commit }, settings) {
    commit('SET_LOADING', true)
    try {
      const response = await this._vm.$api.video.updateSettings(settings)
      commit('SET_VIDEO_SETTINGS', response.data)
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    } finally {
      commit('SET_LOADING', false)
    }
  },

  async fetchUserRoles({ commit }) {
    try {
      const response = await this._vm.$api.videoRole.getUserRoles()
      commit('SET_USER_ROLES', response.data)
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    }
  },

  async fetchMenuPermissions({ commit }) {
    try {
      const response = await this._vm.$api.videoMenu.getMenuPermissions()
      commit('SET_MENU_PERMISSIONS', response.data)
      return response
    } catch (error) {
      commit('SET_ERROR', error.message)
      throw error
    }
  },

  // Utility Actions
  clearError({ commit }) {
    commit('CLEAR_ERROR')
  }
}

const getters = {
  // Video getters
  getVideoById: (state) => (id) => {
    return state.videoList.find(video => video.id === id)
  },
  getVideosByCategory: (state) => (categoryId) => {
    return state.videoList.filter(video => video.category_id === categoryId)
  },
  getVideosByTag: (state) => (tagId) => {
    return state.videoList.filter(video =>
      video.tags && video.tags.some(tag => tag.id === tagId)
    )
  },

  // Course getters
  getCourseById: (state) => (id) => {
    return state.courses.find(course => course.id === id)
  },

  // Progress getters
  getVideoProgress: (state) => (videoId) => {
    return state.userProgress[videoId] || 0
  },
  getCompletedVideos: (state) => {
    return Object.keys(state.userProgress).filter(videoId =>
      state.userProgress[videoId] >= 100
    )
  },

  // Favorites getters
  isFavorite: (state) => (videoId) => {
    return state.favorites.includes(videoId)
  },

  // Training getters
  getTrainingById: (state) => (id) => {
    return state.trainings.find(training => training.id === id)
  },

  // Exam getters
  getExamById: (state) => (id) => {
    return state.exams.find(exam => exam.id === id)
  },
  getUserExamResult: (state) => (examId) => {
    return state.userExamResults.find(result => result.exam_id === examId)
  },

  // Permission getters
  hasPermission: (state) => (permission) => {
    return state.menuPermissions.some(p => p.code === permission)
  },
  hasRole: (state) => (role) => {
    return state.userRoles.some(r => r.code === role)
  },

  // UI getters
  isLoading: (state) => state.loading,
  getError: (state) => state.error
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}
