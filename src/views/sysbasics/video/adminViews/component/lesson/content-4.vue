<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Video Management (Design 4: Minimalist)</h2>
      <a-button type="primary" @click="openUploadDrawer">
        <a-icon type="upload" /> Upload Video
      </a-button>
    </div>

    <!-- Video List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="video in videoList" :key="video.id" class="border rounded-lg p-4 shadow-sm">
         <div class="aspect-w-16 aspect-h-9 bg-gray-100 rounded mb-2 overflow-hidden relative group">
          <img
            v-show="!imageErrors[video.id]"
            :src="video.thumbnail"
            class="object-cover w-full h-full"
            @error="handleImageError(video.id)"
          />
          <div v-if="imageErrors[video.id]" class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 absolute top-0 left-0">
            <a-icon type="picture" class="text-4xl" />
          </div>
        </div>
        <h3>{{ video.title }}</h3>
      </div>
    </div>

    <!-- Minimalist Drawer -->
    <a-drawer
      title="Quick Upload"
      placement="right"
      :closable="true"
      :visible="visible"
      width="450"
      @close="onClose"
    >
        <div class="h-full flex flex-col">
            <!-- State 1: Before Upload -->
            <div v-if="!fileSelected" class="flex-1 flex flex-col items-center justify-center space-y-6 animate-pulse-slow">
                <div class="w-40 h-40 bg-blue-50 rounded-full flex items-center justify-center relative cursor-pointer hover:bg-blue-100 transition-colors" @click="selectFile">
                    <a-icon type="cloud-upload" class="text-6xl text-blue-500" />
                    <div class="absolute inset-0 border-2 border-dashed border-blue-200 rounded-full animate-spin-slow"></div>
                </div>
                <div class="text-center">
                    <h3 class="text-lg font-medium text-gray-900">Drop file here</h3>
                    <p class="text-sm text-gray-500 mt-1">or click to browse</p>
                </div>
            </div>

            <!-- State 2: After Upload (Form) -->
            <div v-else class="flex-1 space-y-6 animate-fade-in-up">
                <div class="flex items-center space-x-3 bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <div class="w-10 h-10 bg-blue-200 rounded flex items-center justify-center">
                        <a-icon type="file-text" class="text-blue-600" />
                    </div>
                    <div class="flex-1 overflow-hidden">
                        <p class="text-sm font-medium text-gray-900 truncate">my-video-file.mp4</p>
                        <p class="text-xs text-blue-600">Ready to process</p>
                    </div>
                    <button @click="fileSelected = false" class="text-gray-400 hover:text-red-500">
                        <a-icon type="delete" />
                    </button>
                </div>

                <div class="space-y-4">
                    <a-input placeholder="Title" size="large" class="border-t-0 border-x-0 border-b-2 rounded-none px-0 focus:shadow-none focus:border-blue-600 bg-transparent font-medium text-lg" />

                    <a-textarea placeholder="Add a description..." :rows="3" class="bg-gray-50 border-0 rounded-lg p-3 resize-none focus:ring-1 focus:ring-blue-500" />

                    <div class="flex items-center justify-between pt-2">
                        <span class="text-sm text-gray-500">Visibility</span>
                        <a-switch checked-children="Public" un-checked-children="Private" default-checked />
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div v-if="fileSelected" class="mt-auto pt-4">
                <a-button type="primary" block size="large" class="h-12 rounded-lg font-bold shadow-lg shadow-blue-500/30">
                    Publish Now
                </a-button>
            </div>
        </div>
    </a-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      fileSelected: false,
      imageErrors: {},
      videoList: [
        { id: 1, title: 'Short Clip', thumbnail: 'https://via.placeholder.com/300', status: 'Published' }
      ]
    };
  },
  methods: {
    openUploadDrawer() { this.visible = true; this.fileSelected = false; },
    onClose() { this.visible = false; },
    selectFile() {
        // Simulate file selection
        setTimeout(() => {
            this.fileSelected = true;
        }, 500);
    },
    handleImageError(id) { this.$set(this.imageErrors, id, true); }
  }
};
</script>

<style scoped>
/* Simple animations */
@keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
    animation: fadeInUp 0.3s ease-out;
}
</style>
