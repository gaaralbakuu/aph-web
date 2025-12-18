<template>
  <div class="p-4 bg-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Video Management (Design 3: Dark Mode)</h2>
      <a-button type="primary" class="bg-indigo-600 border-indigo-600 hover:bg-indigo-500" @click="openUploadDrawer">
        <a-icon type="upload" /> Upload Video
      </a-button>
    </div>

    <!-- Video List -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="video in videoList" :key="video.id" class="bg-white border rounded-lg p-4 shadow-sm">
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

    <!-- Dark Mode Drawer -->
    <a-drawer
      placement="right"
      :closable="true"
      :visible="visible"
      width="600"
      @close="onClose"
      :headerStyle="{ backgroundColor: '#18181b', color: '#fff', borderBottom: '1px solid #27272a' }"
      :bodyStyle="{ backgroundColor: '#18181b', color: '#e4e4e7', padding: '0' }"
      :wrapClassName="'dark-mode-drawer'"
    >
      <!-- Custom Title Slot -->
      <template slot="title">
        <span class="text-gray-100 font-semibold tracking-wide">UPLOAD CONTENT</span>
      </template>

      <div class="flex flex-col h-full text-gray-300">
         <!-- Dark Dropzone -->
         <div class="p-8 border-b border-zinc-800 bg-zinc-900/50">
             <div class="border-2 border-dashed border-zinc-700 rounded-xl p-6 flex flex-col items-center justify-center hover:bg-zinc-800/50 hover:border-indigo-500 transition-all cursor-pointer group">
                 <div class="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center mb-3 group-hover:bg-indigo-500/20 group-hover:text-indigo-400 transition-colors">
                    <a-icon type="cloud-upload" class="text-2xl" />
                 </div>
                 <p class="font-medium text-gray-200">Drag video here</p>
                 <p class="text-xs text-gray-500 mt-1">MP4, WebM or MOV</p>
             </div>
         </div>

         <!-- Form Dark -->
         <div class="flex-1 p-6 space-y-6 overflow-y-auto">
            <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Video Details</label>
                <div class="space-y-4">
                    <div>
                        <input type="text" placeholder="Title" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow" />
                    </div>
                    <div>
                        <textarea placeholder="Description" rows="4" class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-shadow"></textarea>
                    </div>
                </div>
            </div>

            <div>
                <label class="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Visibility</label>
                <div class="grid grid-cols-3 gap-3">
                    <button class="bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-center hover:bg-zinc-700 focus:border-indigo-500 focus:bg-zinc-800 transition-colors">
                        <span class="block font-medium text-white text-sm">Public</span>
                    </button>
                    <button class="bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-center hover:bg-zinc-700 focus:border-indigo-500 focus:bg-zinc-800 transition-colors">
                        <span class="block font-medium text-white text-sm">Unlisted</span>
                    </button>
                    <button class="bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-center hover:bg-zinc-700 focus:border-indigo-500 focus:bg-zinc-800 transition-colors">
                        <span class="block font-medium text-white text-sm">Private</span>
                    </button>
                </div>
            </div>
         </div>

         <!-- Footer Dark -->
         <div class="p-4 border-t border-zinc-800 bg-zinc-900 flex justify-between items-center">
             <div class="flex items-center space-x-2">
                 <div class="w-8 h-8 rounded bg-zinc-800"></div> <!-- Small thumb preview -->
                 <div class="flex flex-col">
                     <span class="text-xs text-gray-400">Uploading...</span>
                     <div class="w-24 bg-zinc-700 h-1 mt-1 rounded overflow-hidden">
                         <div class="bg-indigo-500 w-1/2 h-full"></div>
                     </div>
                 </div>
             </div>
             <button class="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                 Save Changes
             </button>
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
        { id: 1, title: 'Dark Mode Tutorial', thumbnail: 'https://via.placeholder.com/300', status: 'Published' }
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

<style>
/* Override close icon for dark mode drawer */
.dark-mode-drawer .ant-drawer-close {
    color: #a1a1aa;
}
.dark-mode-drawer .ant-drawer-close:hover {
    color: #fff;
}
</style>
