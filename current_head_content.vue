<template>
  <div class="p-4">
    <!-- Header -->
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Video Management</h2>
      <a-button type="primary" @click="openUploadDrawer">
        <a-icon type="upload" /> Upload Video
      </a-button>
    </div>

    <!-- Video List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="video in videoList" :key="video.id" class="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
        <div class="aspect-w-16 aspect-h-9 bg-gray-100 rounded mb-2 overflow-hidden relative group">
          <img
            v-show="!imageErrors[video.id]"
            :src="video.thumbnail"
            alt="Thumbnail"
            class="object-cover w-full h-full transition-transform group-hover:scale-105"
            @error="handleImageError(video.id)"
          />
          <div v-if="imageErrors[video.id]" class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 absolute top-0 left-0">
            <a-icon type="picture" class="text-4xl" />
          </div>
          <div class="absolute bottom-1 right-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
            {{ video.duration }}
          </div>
        </div>
        <h3 class="font-medium truncate" :title="video.title">{{ video.title }}</h3>
        <p class="text-gray-500 text-sm mb-2">{{ video.uploadDate }}</p>
        <div class="flex justify-between items-center">
            <span :class="{'text-green-500': video.status === 'Published', 'text-yellow-500': video.status === 'Processing'}">
                {{ video.status }}
            </span>
            <div>
                <a-button size="small" icon="edit" class="mr-1" />
                <a-button size="small" type="danger" icon="delete" />
            </div>
        </div>
      </div>
    </div>

    <!-- Upload Drawer -->
    <a-drawer
      title="Upload Video"
      placement="right"
      :closable="true"
      :visible="visible"
      width="500"
      @close="onClose"
    >
      <div class="flex flex-col h-full">
        <!-- Dropzone -->
        <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6 hover:border-blue-500 transition-colors cursor-pointer">
            <a-icon type="cloud-upload" class="text-4xl text-gray-400 mb-2" />
            <p class="text-gray-500">Click or drag file to this area to upload</p>
        </div>

        <!-- Form -->
        <a-form layout="vertical">
            <a-form-item label="Title">
                <a-input placeholder="Video title" />
            </a-form-item>
            <a-form-item label="Description">
                <a-textarea placeholder="Tell viewers about your video" :rows="4" />
            </a-form-item>
             <a-form-item label="Visibility">
                <a-select default-value="public">
                    <a-select-option value="public">Public</a-select-option>
                    <a-select-option value="private">Private</a-select-option>
                </a-select>
            </a-form-item>
        </a-form>

        <!-- Footer -->
        <div class="mt-auto pt-4 border-t flex justify-end">
            <a-button style="margin-right: 8px" @click="onClose">Cancel</a-button>
            <a-button type="primary" @click="onClose">Upload</a-button>
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
        {
            id: 1,
            title: 'Introduction to Vue 3',
            thumbnail: 'https://via.placeholder.com/300x200',
            duration: '10:05',
            uploadDate: '2023-10-27',
            status: 'Published'
        },
         {
            id: 2,
            title: 'Advanced Tailwind CSS',
            thumbnail: 'invalid-url.jpg', // Test fallback
            duration: '45:30',
            uploadDate: '2023-10-26',
            status: 'Processing'
        }
      ]
    };
  },
  methods: {
    openUploadDrawer() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    handleImageError(id) {
      this.$set(this.imageErrors, id, true);
    }
  }
};
</script>

<style scoped>
/* Scoped styles if needed */
</style>
