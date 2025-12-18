<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Video Management (Design 2: Studio Drawer)</h2>
      <a-button type="primary" @click="openUploadDrawer">
        <a-icon type="upload" /> Upload Video
      </a-button>
    </div>

    <!-- Video List Reuse -->
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

    <!-- Studio Style Right Drawer -->
    <a-drawer
      title="Create"
      placement="right"
      :closable="true"
      :visible="visible"
      width="720"
      @close="onClose"
      :headerStyle="{ borderBottom: '1px solid #e5e7eb', padding: '16px 24px' }"
      :bodyStyle="{ padding: 0, display: 'flex', flexDirection: 'column', height: 'calc(100% - 55px)' }"
    >
        <!-- Content Scrollable -->
        <div class="flex-1 overflow-y-auto p-6 space-y-8">
            <!-- Header Section -->
            <div class="flex items-start space-x-4">
                <div class="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0 border border-gray-200">
                     <a-icon type="video-camera" class="text-2xl text-gray-400" />
                </div>
                <div class="flex-1">
                     <h4 class="font-medium text-gray-900">Upload in progress...</h4>
                     <div class="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div class="bg-blue-600 h-1.5 rounded-full" style="width: 45%"></div>
                     </div>
                     <p class="text-xs text-gray-500 mt-1">45% uploaded • 2 mins remaining</p>
                </div>
            </div>

            <!-- Form Fields -->
            <div class="space-y-6">
                <div class="relative group">
                    <input type="text" id="title" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " />
                    <label for="title" class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Title (required)</label>
                </div>

                <div class="relative group mt-4">
                    <textarea id="desc" rows="4" class="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" "></textarea>
                    <label for="desc" class="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Description</label>
                </div>

                <!-- Thumbnails Section -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Thumbnail</label>
                    <p class="text-xs text-gray-500 mb-3">Select or upload a picture that shows what's in your video.</p>
                    <div class="grid grid-cols-4 gap-3">
                        <div class="aspect-w-16 aspect-h-9 border-2 border-dashed border-gray-300 rounded flex items-center justify-center cursor-pointer hover:border-gray-400">
                             <div class="flex flex-col items-center">
                                <a-icon type="plus" class="text-gray-400 mb-1" />
                                <span class="text-[10px] text-gray-500">Upload</span>
                             </div>
                        </div>
                        <div class="aspect-w-16 aspect-h-9 bg-gray-100 rounded opacity-50"></div>
                        <div class="aspect-w-16 aspect-h-9 bg-gray-100 rounded opacity-50"></div>
                        <div class="aspect-w-16 aspect-h-9 bg-gray-100 rounded opacity-50"></div>
                    </div>
                </div>

                <!-- Settings -->
                <div class="grid grid-cols-2 gap-6">
                    <div>
                         <label class="block text-sm font-medium text-gray-700 mb-2">Visibility</label>
                         <a-radio-group v-model="visibility" class="flex flex-col space-y-2">
                            <a-radio value="private">Private</a-radio>
                            <a-radio value="unlisted">Unlisted</a-radio>
                            <a-radio value="public">Public</a-radio>
                        </a-radio-group>
                    </div>
                     <div>
                         <label class="block text-sm font-medium text-gray-700 mb-2">Playlist</label>
                         <a-select placeholder="Add to playlist" style="width: 100%">
                            <a-select-option value="1">Music</a-select-option>
                         </a-select>
                    </div>
                </div>
            </div>
        </div>

        <!-- Footer Actions -->
        <div class="border-t border-gray-200 p-4 bg-gray-50 flex justify-end space-x-3">
            <a-button @click="onClose">Cancel</a-button>
            <a-button type="primary" :loading="true">Processing...</a-button>
        </div>
    </a-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      visible: false,
      visibility: 'public',
      imageErrors: {},
      videoList: [
        { id: 1, title: 'Sample Video', thumbnail: 'https://via.placeholder.com/300', status: 'Published' }
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
