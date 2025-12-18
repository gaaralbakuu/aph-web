<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Video Management (Design 1: YouTube Modal)</h2>
      <a-button type="primary" @click="openUploadDrawer">
        <a-icon type="upload" /> Upload Video
      </a-button>
    </div>

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

    <!-- YouTube Style Centered Modal (via Drawer) -->
    <a-drawer
      placement="right"
      :closable="false"
      :visible="visible"
      width="100%"
      :bodyStyle="{ padding: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }"
      @close="onClose"
    >
        <!-- The 'Modal' Container -->
        <div class="bg-white w-[960px] h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden relative" @click.stop>
            <!-- Header -->
            <div class="flex justify-between items-center px-6 py-4 border-b">
                <h3 class="text-lg font-medium text-gray-800">{{ uploadStep === 1 ? 'Upload videos' : 'Video details' }}</h3>
                <div class="flex items-center space-x-4">
                    <a-button type="link" icon="message" class="text-gray-500" />
                    <button @click="onClose" class="text-gray-500 hover:text-gray-700">
                        <a-icon type="close" class="text-xl" />
                    </button>
                </div>
            </div>

            <!-- Stepper (Visual Only for demo) -->
            <div v-if="uploadStep > 1" class="px-12 py-6 flex justify-center border-b bg-gray-50">
                <div class="flex items-center w-full max-w-2xl">
                     <div class="flex flex-col items-center relative">
                        <div class="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold z-10">1</div>
                        <span class="text-xs mt-1 font-medium text-blue-600">Details</span>
                     </div>
                     <div class="flex-1 h-1 bg-blue-200 mx-2"></div>
                     <div class="flex flex-col items-center relative">
                        <div class="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold z-10">2</div>
                        <span class="text-xs mt-1 text-gray-500">Elements</span>
                     </div>
                     <div class="flex-1 h-1 bg-gray-200 mx-2"></div>
                     <div class="flex flex-col items-center relative">
                        <div class="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold z-10">3</div>
                        <span class="text-xs mt-1 text-gray-500">Checks</span>
                     </div>
                     <div class="flex-1 h-1 bg-gray-200 mx-2"></div>
                     <div class="flex flex-col items-center relative">
                        <div class="w-8 h-8 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center font-bold z-10">4</div>
                        <span class="text-xs mt-1 text-gray-500">Visibility</span>
                     </div>
                </div>
            </div>

            <!-- Content Area -->
            <div class="flex-1 overflow-y-auto p-8">
                <!-- Step 1: Drag & Drop -->
                <div v-if="uploadStep === 1" class="h-full flex flex-col items-center justify-center text-center space-y-6">
                    <div class="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                         <a-icon type="cloud-upload" class="text-6xl text-gray-400" />
                    </div>
                    <h2 class="text-2xl font-medium text-gray-800">Drag and drop video files to upload</h2>
                    <p class="text-gray-500 text-sm">Your videos will be private until you publish them.</p>
                    <a-button type="primary" size="large" @click="nextStep">Select Files</a-button>
                </div>

                <!-- Step 2: Details Form -->
                <div v-else class="flex flex-col lg:flex-row gap-8">
                    <!-- Left: Form -->
                    <div class="flex-1 space-y-6">
                        <div>
                            <div class="flex justify-between mb-1">
                                <label class="text-sm font-medium text-gray-700">Title (required)</label>
                                <a-icon type="question-circle" class="text-gray-400" />
                            </div>
                            <a-input placeholder="Add a title that describes your video" size="large" class="rounded-md" />
                        </div>

                        <div>
                            <div class="flex justify-between mb-1">
                                <label class="text-sm font-medium text-gray-700">Description</label>
                                <a-icon type="question-circle" class="text-gray-400" />
                            </div>
                            <a-textarea placeholder="Tell viewers about your video" :rows="5" class="rounded-md" />
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label class="text-sm font-medium text-gray-700 block mb-2">Thumbnail</label>
                                <div class="border dashed border-gray-300 rounded h-24 flex items-center justify-center cursor-pointer hover:bg-gray-50">
                                    <div class="text-center">
                                        <a-icon type="picture" />
                                        <span class="text-xs block">Upload file</span>
                                    </div>
                                </div>
                            </div>
                             <div>
                                <label class="text-sm font-medium text-gray-700 block mb-2">Playlists</label>
                                <a-select placeholder="Select" style="width: 100%">
                                    <a-select-option value="1">Tutorials</a-select-option>
                                </a-select>
                            </div>
                        </div>

                        <div class="bg-gray-50 p-4 rounded border">
                            <span class="font-medium block mb-2">Audience</span>
                             <a-radio-group v-model="audience">
                                <a-radio :style="radioStyle" :value="1">Yes, it's made for kids</a-radio>
                                <a-radio :style="radioStyle" :value="2">No, it's not made for kids</a-radio>
                            </a-radio-group>
                        </div>
                    </div>

                    <!-- Right: Preview -->
                    <div class="w-full lg:w-80 flex-shrink-0">
                        <div class="bg-gray-100 rounded-lg overflow-hidden sticky top-0">
                             <div class="aspect-w-16 aspect-h-9 bg-black flex items-center justify-center text-white">
                                <a-icon type="play-circle" class="text-4xl" />
                             </div>
                             <div class="p-4 space-y-3">
                                <div class="text-xs text-gray-500 uppercase tracking-wide">Video Link</div>
                                <div class="text-blue-600 text-sm truncate">https://youtu.be/x8s9d8s...</div>
                                <div class="text-xs text-gray-500 uppercase tracking-wide">Filename</div>
                                <div class="text-gray-700 text-sm truncate">my_awesome_video.mp4</div>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="border-t px-6 py-3 bg-white flex justify-between items-center">
                <div v-if="uploadStep > 1" class="flex items-center text-gray-600 text-sm">
                    <a-icon type="loading" class="mr-2 text-blue-600" /> Uploading 45% ...
                </div>
                <div v-else></div>

                <div class="flex space-x-2">
                     <a-button v-if="uploadStep > 1" @click="uploadStep = 1">Back</a-button>
                     <a-button type="primary" @click="uploadStep > 1 ? onClose() : nextStep()">
                        {{ uploadStep === 1 ? 'Next' : 'Next' }}
                     </a-button>
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
      uploadStep: 1,
      audience: 2,
      radioStyle: { display: 'block', height: '30px', lineHeight: '30px' },
      imageErrors: {},
      videoList: [
        { id: 1, title: 'Intro to Vue', thumbnail: 'https://via.placeholder.com/300', status: 'Published' }
      ]
    };
  },
  methods: {
    openUploadDrawer() { this.visible = true; this.uploadStep = 1; },
    onClose() { this.visible = false; },
    nextStep() { this.uploadStep = 2; },
    handleImageError(id) { this.$set(this.imageErrors, id, true); }
  }
};
</script>
