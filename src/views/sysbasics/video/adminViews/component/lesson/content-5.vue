<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Video Management (Design 5: Split View)</h2>
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

    <!-- Split View Drawer -->
    <a-drawer
      title="Create New Video"
      placement="right"
      :closable="true"
      :visible="visible"
      width="800"
      @close="onClose"
    >
      <div class="flex h-full gap-6">
          <!-- Left Column: Preview & Status -->
          <div class="w-1/3 flex flex-col space-y-4">
              <div class="bg-gray-900 rounded-lg aspect-w-9 aspect-h-16 flex items-center justify-center text-white shadow-lg overflow-hidden relative">
                  <div class="absolute inset-0 flex items-center justify-center">
                     <a-icon type="play-circle" class="text-5xl opacity-80" />
                  </div>
                  <!-- Progress Overlay -->
                  <div class="absolute bottom-0 left-0 right-0 h-1 bg-gray-700">
                      <div class="h-full bg-red-600 w-2/3"></div>
                  </div>
              </div>

              <div class="bg-blue-50 p-4 rounded-lg border border-blue-100 text-sm">
                  <div class="flex items-center space-x-2 text-blue-800 font-medium mb-1">
                      <a-icon type="info-circle" />
                      <span>Upload Status</span>
                  </div>
                  <p class="text-blue-600">Processing HD version...</p>
                  <p class="text-gray-500 mt-2 text-xs">filename: final_edit_v2.mp4</p>
              </div>
          </div>

          <!-- Right Column: Form -->
          <div class="w-2/3 flex flex-col">
              <div class="flex-1 overflow-y-auto pr-2 space-y-5">
                  <div class="bg-white p-1">
                      <label class="block text-gray-700 font-semibold mb-2">Title</label>
                      <a-input size="large" placeholder="Video Title" />
                  </div>

                  <div class="bg-white p-1">
                      <label class="block text-gray-700 font-semibold mb-2">Description</label>
                      <a-textarea :rows="5" placeholder="Description..." />
                  </div>

                  <div class="grid grid-cols-2 gap-4">
                      <div>
                          <label class="block text-gray-700 font-semibold mb-2">Category</label>
                           <a-select default-value="edu" style="width: 100%">
                                <a-select-option value="edu">Education</a-select-option>
                                <a-select-option value="ent">Entertainment</a-select-option>
                            </a-select>
                      </div>
                      <div>
                          <label class="block text-gray-700 font-semibold mb-2">Tags</label>
                          <a-input placeholder="vue, js, coding" />
                      </div>
                  </div>
              </div>

              <!-- Footer -->
              <div class="pt-6 mt-4 border-t flex justify-between items-center">
                  <span class="text-gray-500 text-sm">Saved as draft</span>
                  <div class="flex space-x-3">
                      <a-button>Schedule</a-button>
                      <a-button type="primary">Publish</a-button>
                  </div>
              </div>
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
      imageErrors: {},
      videoList: [
        { id: 1, title: 'Tutorial Video', thumbnail: 'https://via.placeholder.com/300', status: 'Published' }
      ]
    };
  },
  methods: {
    openUploadDrawer() { this.visible = true; },
    onClose() { this.visible = false; },
    handleImageError(id) { this.$set(this.imageErrors, id, true); }
  }
};
</script>
