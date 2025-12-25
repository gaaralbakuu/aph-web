<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Channel Dashboard Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.channel }}</h1>

      <div class="flex gap-2">
        <button class="flex items-center gap-2 px-4 py-2 bg-[#CC0000] text-white! font-medium text-sm uppercase rounded-sm hover:bg-[#990000] transition-colors shadow-sm" @click="uploadNewVideo">
          <i class="el-icon-video-camera-solid text-lg"></i>
          <span>{{ l.create }}</span>
        </button>
      </div>
    </div>

    <!-- Filter Tabs -->
    <div class="px-6 pt-6 pb-2 border-b border-[#E5E5E5] bg-white sticky top-0 z-20">
      <div class="flex items-center gap-6 text-sm font-medium text-[#606060]">
        <button
          class="pb-3 border-b-2 transition-colors"
          :class="videoListObj.query.status === '' ? 'text-[#0D0D0D] border-[#0D0D0D]' : 'border-transparent hover:text-[#0D0D0D]'"
          @click="
            videoListObj.query.status = ''
            getVideoList()
          ">
          {{ l.videos }}
        </button>
        <button
          class="pb-3 border-b-2 transition-colors"
          :class="videoListObj.query.status === 'pengding' ? 'text-[#0D0D0D] border-[#0D0D0D]' : 'border-transparent hover:text-[#0D0D0D]'"
          @click="
            videoListObj.query.status = 'pengding'
            getVideoList()
          ">
          {{ l.liveOrPending }}
        </button>
      </div>

      <!-- Filters Row -->
      <div class="mt-4 flex items-center gap-4 mb-2">
        <!-- Channel Select Dropdown -->
        <Dropdown
          :modelValue="videoListObj.query.college_id"
          :options="publicCodeObj.collegeList"
          :placeholder="l.allChannels"
          label-key="name_label"
          icon-class="el-icon-office-building"
          @update:modelValue="videoListObj.query.college_id = $event; getVideoList()"
        />

        <!-- Search Filter -->
        <div class="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-[#CCCCCC] rounded hover:border-[#606060] transition-colors focus-within:border-[#065FD4]">
          <i class="el-icon-s-operation text-[#606060] text-lg"></i>
          <input v-model="videoListObj.query.title" type="text" :placeholder="l.filter" class="bg-transparent border-none outline-none text-sm w-full placeholder-[#999999]" @change="getVideoList" />
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-scroll relative">
      <!-- Content Table Header -->
      <div class="grid grid-cols-[3fr_1fr_1fr_1.2fr_1fr] gap-4 px-6 py-2 border-b border-[#E5E5E5] text-xs font-medium text-[#606060] bg-white sticky top-0 z-10">
        <div>{{ l.video }}</div>
        <div>{{ l.visibility }}</div>
        <div>{{ l.date }}</div>
        <div>{{ l.uploadedBy }}</div>
        <div class="text-right">{{ l.views }}</div>
      </div>

      <!-- Video List -->
      <div class="flex-1 overflow-hidden bg-white flex flex-col">
        <div v-if="videoListObj.list.length === 0" class="flex flex-col items-center justify-center py-20 flex-1 absolute inset-0 bg-white">
          <div class="w-32 h-32 bg-[#F9F9F9] rounded-full flex items-center justify-center mb-4">
            <i class="el-icon-video-camera text-4xl text-[#CCCCCC]"></i>
          </div>
          <p class="text-[#0D0D0D]">{{ c.noData }}</p>
          <p class="text-sm text-[#606060] mt-1">{{ l.noVideoAvailable }}</p>
          <button class="mt-4 text-[#065FD4] font-medium text-sm uppercase" @click="uploadNewVideo">{{ l.uploadVideo }}</button>
        </div>
        <div v-else class="flex flex-1 flex-col">
          <div class="divide-y divide-[#E5E5E5]">
            <div v-for="i in videoListObj.list" :key="i.id" class="grid grid-cols-[3fr_1fr_1fr_1.2fr_1fr] gap-4 px-6 py-2 hover:bg-[#F9F9F9] group items-start transition-[background-color] relative">
              <!-- Column 1: Video -->
              <div class="flex gap-4">
                <!-- Checkbox placeholder -->
                <div class="w-4 flex items-center justify-center pt-8">
                  <div class="w-4 h-4 border border-[#CCCCCC] rounded-sm"></div>
                </div>

                <!-- Thumbnail -->
                <div class="relative w-[120px] h-[68px] bg-[#E5E5E5] shrink-0 group/thumb cursor-pointer" @click="coverPreview(api.videoServer + '/' + i.thumbnail_path)">
                  <img v-if="!imageErrors[i.id]" :src="api.videoServer + '/' + i.thumbnail_path" class="w-full h-full object-cover" @error="handleImageError(i.id)" />
                  <div v-else class="w-full h-full bg-[#CCCCCC] flex items-center justify-center text-white text-sm font-bold">
                    {{ l.noImage || 'No Image' }}
                  </div>
                  <span class="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-medium px-1 rounded-sm">{{ formatDuration(i.duration) }}</span>

                  <!-- Hover Play -->
                  <div class="absolute inset-0 bg-black/40 opacity-0 group-hover/thumb:opacity-100 flex items-center justify-center transition-opacity" @click.stop="previewVideo(i)">
                    <i class="el-icon-video-play text-white text-2xl"></i>
                  </div>

                  <!-- Status Overlays on Thumbnail -->
                  <div v-if="i.status === 'Pending' || i.status === 'pengding'" class="absolute inset-0 bg-white/90 flex flex-col items-center justify-center text-[#606060]">
                    <i class="el-icon-time animate-spin text-lg mb-1"></i>
                    <span class="text-[10px] uppercase font-bold">{{ l.pending }}</span>
                  </div>

                  <div v-if="videoProcess && videoProcess.videoId == i.id && !videoProcess.isFinished" class="absolute inset-0 bg-white/90 flex flex-col items-center justify-center">
                    <div class="text-[10px] font-bold text-[#065FD4]">{{ ((videoProcess.currentTime / i.duration) * 100).toFixed(0) }}%</div>
                    <div class="w-8 h-1 bg-[#E5E5E5] mt-1 overflow-hidden">
                      <div class="h-full bg-[#065FD4]" :style="{ width: (videoProcess.currentTime / i.duration) * 100 + '%' }"></div>
                    </div>
                  </div>
                </div>

                <!-- Title & Desc -->
                <div class="min-w-0 pt-1 flex flex-col justify-between h-[68px]">
                  <div>
                    <h3 class="text-sm font-medium text-[#0D0D0D] line-clamp-1 mb-1 cursor-pointer hover:text-[#065FD4]" :title="i.title" @click="beforeModifyVideo(i)">{{ i.title }}</h3>
                    <p class="text-xs text-[#606060] line-clamp-1 group-hover:hidden">{{ i.description || l.addDescription }}</p>

                    <!-- Hover Actions (Replace desc on hover) -->
                    <div class="hidden group-hover:flex items-center gap-4 text-[#606060]">
                      <i class="el-icon-edit text-lg cursor-pointer hover:text-[#0D0D0D]" :title="l.details" @click="beforeModifyVideo(i)"></i>
                      <i class="el-icon-data-analysis text-lg cursor-pointer hover:text-[#0D0D0D]" title="Analytics"></i>
                      <i class="el-icon-chat-dot-square text-lg cursor-pointer hover:text-[#0D0D0D]" title="Comments"></i>
                      <i class="el-icon-view text-lg cursor-pointer hover:text-[#0D0D0D]" title="View on YouTube"></i>
                      <div class="relative group/more">
                        <i class="el-icon-more text-lg cursor-pointer hover:text-[#0D0D0D] rotate-90" title="Options"></i>
                        <!-- Dropdown simulation -->
                        <div class="absolute left-0 top-full bg-white shadow-lg border border-[#E5E5E5] py-2 rounded w-32 hidden group-hover/more:block z-50">
                          <button class="w-full text-left px-4 py-2 hover:bg-[#F2F2F2] text-sm" @click="deleteVideo(i)">{{ l.deleteForever }}</button>
                          <button class="w-full text-left px-4 py-2 hover:bg-[#F2F2F2] text-sm">{{ l.download }}</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Column 2: Visibility -->
              <div class="pt-3">
                <div class="flex items-center gap-1">
                  <i v-if="i.is_public == 1" class="el-icon-view text-[#069C56] text-lg"></i>
                  <i v-else class="el-icon-lock text-[#606060] text-lg"></i>
                  <span class="text-sm text-[#0D0D0D]">{{ i.is_public == 1 ? l.public : l.private }}</span>
                </div>
              </div>

              <!-- Column 3: Date -->
              <div class="pt-3">
                <div class="text-sm text-[#0D0D0D]">{{ i.create_time ? i.create_time.split(' ')[0] : 'Draft' }}</div>
                <div class="text-xs text-[#606060]">{{ l.uploaded }}</div>

                <!-- Processing Status Text -->
                <div v-if="videoProcess && videoProcess.videoId == i.id && !videoProcess.isFinished" class="text-xs text-[#065FD4] mt-1 animate-pulse">
                  {{ l.processingHdVersion }}
                </div>
                <div v-else-if="i.status === 'Pending' || i.status === 'pengding'" class="text-xs text-[#606060] mt-1 italic">
                  {{ l.waitingInQueue }}
                </div>
              </div>

              <!-- Column 5: Uploaded By -->
              <div class="pt-3">
                <div class="text-sm text-[#0D0D0D] truncate" :title="getUploadedBy(i)">{{ getUploadedBy(i) }}</div>
                <div class="text-xs text-[#606060]">{{ getUploadedByLabel(i) }}</div>
              </div>

              <!-- Column 6: Views (Dummy data) -->
              <div class="pt-3 text-right text-sm text-[#0D0D0D]">{{ i.views }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- Pagination Footer -->
    <div class="flex justify-end p-4 border-t border-[#E5E5E5] bg-white text-xs text-[#606060]">
      <Pagination
        :page="videoListObj.query.page"
        :pageSize="videoListObj.query.pageSize"
        :total="videoListObj.total"
        :l="l"
        @update:page="videoListObj.query.page = $event"
        @update:pageSize="videoListObj.query.pageSize = $event"
        @change="getVideoList"
      />
    </div>

    <div class="components">
      <input ref="videoInput" type="file" @change="videoChange" style="display: none" accept="video/*" />
      <input ref="coverInput" type="file" @change="uploadCoverChange" style="display: none" accept="image/*" />

      <!-- Image Preview Modal -->
      <a-modal v-model:open="showObj.coverDialog" :title="l.preview" :footer="null" :width="600">
        <img width="100%" :src="coverObj.dialogImageUrl" alt="" />
      </a-modal>

      <!-- Video Preview Modal -->
      <a-modal v-model:open="showObj.previewVideo" :title="l.preview" :footer="null" :width="800" @cancel="videoClose">
        <div style="width: 100%; aspect-ratio: 1.8">
          <videoPlayer ref="videoPlayerRef" :src="showObj.videoUrl"></videoPlayer>
        </div>
      </a-modal>

      <!-- Upload Video Drawer -->
      <a-drawer :visible="showObj.uploadVideo" :title="l.uploadVideo" :width="960" @close="closeUploadDrawer" :body-style="{ padding: 0 }">
        <div class="flex flex-col bg-white font-roboto absolute top-[55px] left-0 right-0 bottom-0">
          <!-- Step 1: Upload Selection -->
          <div 
            v-if="!flagObj.selectVideo" 
            class="flex-1 flex flex-col justify-center items-center p-10 animate-fade-in border-2 border-dashed transition-all"
            :class="flagObj.dragActive ? 'border-[#065FD4] bg-[#F0F8FF]' : 'border-[#E5E5E5] bg-white'"
            @dragover.prevent="flagObj.dragActive = true"
            @dragenter.prevent="flagObj.dragActive = true"
            @dragleave.prevent="handleDragLeave"
            @drop.prevent="handleVideoDrop"
          >
            <div class="w-32 h-32 rounded-full bg-[#F9F9F9] flex items-center justify-center mb-6 cursor-pointer hover:bg-[#F0F0F0] transition-colors" :class="flagObj.dragActive ? 'bg-[#E8F4FF]' : ''" @click="videoSelect">
              <i class="el-icon-upload text-5xl" :class="flagObj.dragActive ? 'text-[#065FD4]' : 'text-[#909090]'"></i>
            </div>
            <h2 class="text-[#0D0D0D] text-lg font-medium mb-2">{{ l.dragOrClickToSelect }}</h2>
            <p class="text-[#606060] text-sm mb-8 text-center max-w-md">Your videos will be private until you publish them.</p>
            <Button variant="primary" @click="videoSelect">
              {{ l.selectVideo || 'SELECT FILES' }}
            </Button>
          </div>

          <!-- Step 2: Details & Elements -->
          <div v-else class="flex-1 flex overflow-hidden">
            <!-- Left Column: Form (Scrollable) -->
            <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <div class="flex justify-between items-center mb-6">
                <h3 class="text-xl font-medium text-[#0D0D0D]">{{ l.details }}</h3>
                <Button variant="link" @click="videoRemove(true)">{{ l.reselectVideo }}</Button>
              </div>

              <!-- Title -->
              <div class="mb-6 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.title }} ({{ c.required }})</label>
                <input v-model="uploadVideoObj.name" class="w-full outline-none text-[#0D0D0D] text-sm" :placeholder="l.title" />
                <div class="absolute right-2 bottom-2 text-xs text-[#606060]">{{ uploadVideoObj.name.length }}/100</div>
              </div>

              <!-- Description -->
              <div class="mb-8 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">Description</label>
                <textarea v-model="uploadVideoObj.description" class="w-full outline-none text-[#0D0D0D] text-sm resize-none" rows="5" :placeholder="l.introducePd"></textarea>
                <div class="absolute right-2 bottom-2 text-xs text-[#606060]">{{ uploadVideoObj.description.length }}/5000</div>
              </div>

              <!-- Thumbnail -->
              <div class="mb-8">
                <h4 class="text-sm font-medium text-[#0D0D0D] mb-1">{{ l.thumbnail }}</h4>
                <p class="text-xs text-[#606060] mb-4">{{ l.thumbnailDesc }}</p>

                <div class="flex gap-4">
                  <!-- Upload Box -->
                  <div class="w-32 aspect-video border border-dashed border-[#CCCCCC] rounded cursor-pointer flex flex-col items-center justify-center hover:border-[#606060] hover:bg-[#F9F9F9] transition-all relative overflow-hidden group" @click="coverSelect('upload')">
                    <template v-if="!coverObj.imageUrl">
                      <i class="el-icon-picture-outline text-xl text-[#606060] mb-1"></i>
                      <span class="text-xs text-[#606060]">{{ l.uploadFile }}</span>
                    </template>
                    <img v-else :src="coverObj.imageUrl" class="w-full h-full object-cover" />
                    <div v-if="coverObj.imageUrl" class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <i class="el-icon-more text-white text-xl"></i>
                    </div>
                  </div>

                  <!-- Auto Generated (Action to regenerate) -->
                  <div class="w-32 aspect-video bg-[#F0F0F0] rounded flex items-center justify-center relative cursor-pointer hover:bg-[#E0E0E0] transition-colors" @click="drawCoverByFile(uploadVideoObj.file, Math.random() * uploadVideoObj.duration)" title="Generate random frame">
                    <i class="el-icon-refresh text-[#606060]"></i>

                    <span class="text-[10px] text-[#909090]">{{ l.autoGen }}</span>
                  </div>
                </div>
              </div>

              <!-- Audience / Settings -->
              <div class="mb-8">
                <h4 class="text-sm font-medium text-[#0D0D0D] mb-2">{{ l.audience }}</h4>

                <div class="bg-[#F9F9F9] p-4 rounded border border-[#E5E5E5] mb-4">
                  <label class="block text-sm font-medium text-[#0D0D0D] mb-2">{{ l.college }}</label>
                  <div class="relative">
                    <select v-model="uploadVideoObj.college_id" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]">
                      <option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</option>
                    </select>
                  </div>
                </div>

                <div class="bg-[#F9F9F9] p-4 rounded border border-[#E5E5E5]">
                  <label class="block text-sm font-medium text-[#0D0D0D] mb-2">{{ l.visibility }}</label>
                  <div class="flex items-center gap-4">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="visibility" :value="0" :checked="uploadVideoObj.is_public == 0" @change="uploadVideoObj.is_public = 0" class="accent-[#065FD4]" />
                      <span class="text-sm">{{ l.private }}</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="visibility" :value="1" :checked="uploadVideoObj.is_public == 1" @change="uploadVideoObj.is_public = 1" class="accent-[#065FD4]" />
                      <span class="text-sm">{{ l.public }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Video Preview & Status (Sticky) -->
            <div class="w-[300px] bg-[#F9F9F9] p-4 border-l border-[#E5E5E5] flex flex-col gap-4">
              <!-- Video Player Placeholder -->
              <div class="w-full aspect-video bg-black rounded overflow-hidden relative group">
                <div v-if="!coverObj.imageUrl" class="absolute inset-0 flex items-center justify-center text-white text-xs">
                  <span v-if="!uploadVideoObj.uploadEvent.oTime">{{ l.previewUnavailable }}</span>
                  <span v-else>{{ l.processing }}</span>
                </div>
                <img v-else :src="coverObj.imageUrl" class="absolute inset-0 w-full h-full object-cover" />
                <div class="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1 rounded">{{ formatDuration(uploadVideoObj.duration) }}</div>
              </div>

              <!-- Metadata -->
              <div class="space-y-3">
                <div>
                  <div class="text-xs text-[#606060] mb-1">Filename</div>
                  <div class="text-sm text-[#0D0D0D] break-all line-clamp-2" :title="uploadVideoObj.file.name">{{ uploadVideoObj.file.name }}</div>
                </div>

                <!-- Upload Progress -->
                <div v-if="flagObj.uploading || uploadVideoObj.uploadPercent > 0" class="bg-white p-3 rounded border border-[#E5E5E5]">
                  <div class="flex justify-between text-xs mb-1">
                    <span class="text-[#065FD4] font-medium" v-if="flagObj.uploading">{{ l.uploading }}</span>
                    <span class="text-[#069C56] font-medium" v-else>{{ l.uploadComplete }}</span>
                    <span>{{ uploadVideoObj.uploadPercent }}%</span>
                  </div>
                  <div class="h-1 bg-[#E5E5E5] w-full rounded-full overflow-hidden mb-2">
                    <div class="h-full bg-[#065FD4] transition-all duration-300" :style="{ width: uploadVideoObj.uploadPercent + '%' }"></div>
                  </div>
                  <div class="flex justify-between text-[10px] text-[#606060]">
                    <span>{{ uploadVideoObj.uploadEvent.speed }}</span>
                    <span>{{ uploadVideoObj.uploadEvent.restTime }} {{ l.timeLeft }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div v-if="flagObj.selectVideo" class="border-t border-[#E5E5E5] p-4 flex justify-between items-center bg-white z-10">
            <!-- Left: Status text -->
            <div class="text-sm text-[#606060]">
              <span v-if="flagObj.uploading" class="flex items-center gap-2">
                <i class="el-icon-loading"></i>
                {{ l.uploadingWarning }}
              </span>
            </div>

            <!-- Right: Buttons -->
            <div class="flex gap-2">
              <Button v-if="flagObj.selectVideo" variant="ghost" @click="closeUploadDrawer">
                {{ c.cancel || 'CANCEL' }}
              </Button>
              <Button v-if="flagObj.selectVideo" variant="primary" :disabled="!flagObj.uploadAble || flagObj.uploading" @click="handleSubmit('uploadVideo')">
                {{ flagObj.uploading ? l.uploading.toUpperCase() : l.uploadVideo || 'UPLOAD' }}
              </Button>
            </div>
          </div>
        </div>
      </a-drawer>

      <!-- Modify Video Drawer -->
      <a-drawer :visible="showObj.modifyVideo" :title="l.modifyVideo" :width="960" :body-style="{ padding: 0 }" @close="showObj.modifyVideo = false">
        <div class="flex flex-col bg-white font-roboto absolute top-[55px] left-0 right-0 bottom-0">
          <div class="flex-1 flex overflow-hidden">
            <!-- Left Column: Form -->
            <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
              <h3 class="text-xl font-medium text-[#0D0D0D] mb-6">{{ l.videoDetails }}</h3>

              <!-- Title -->
              <div class="mb-6 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.title }} ({{ c.required }})</label>
                <input v-model="modifyVideoObj.form.title" class="w-full outline-none text-[#0D0D0D] text-sm" :placeholder="l.title" />
              </div>

              <!-- Description -->
              <div class="mb-8 relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">Description</label>
                <textarea v-model="modifyVideoObj.form.description" class="w-full outline-none text-[#0D0D0D] text-sm resize-none" rows="5" :placeholder="l.introducePd" style="resize: none"></textarea>
              </div>

              <!-- Thumbnail -->
              <div class="mb-8">
                <h4 class="text-sm font-medium text-[#0D0D0D] mb-1">{{ l.thumbnail }}</h4>
                <p class="text-xs text-[#606060] mb-4">{{ l.thumbnailDesc }}</p>

                <div class="flex gap-4">
                  <!-- Current/New Upload Box -->
                  <div class="w-32 aspect-video border border-dashed border-[#CCCCCC] rounded cursor-pointer flex flex-col items-center justify-center hover:border-[#606060] hover:bg-[#F9F9F9] transition-all relative overflow-hidden group" @click="coverSelect('upload')">
                    <img v-if="coverObj.imageUrl" :src="coverObj.imageUrl" class="w-full h-full object-cover" />
                    <div v-else class="flex flex-col items-center">
                      <i class="el-icon-plus text-xl text-[#606060] mb-1"></i>
                      <span class="text-xs text-[#606060]">{{ l.uploadNew }}</span>
                    </div>

                    <div v-if="coverObj.imageUrl" class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <span class="text-white text-xs">{{ l.change }}</span>
                    </div>
                  </div>

                  <!-- Original Thumbnail Preview (if exists and different from new) -->
                  <div v-if="modifyVideoObj.form.oldthumbnail_path && !coverObj.imageUrl" class="w-32 aspect-video relative rounded overflow-hidden border border-[#E5E5E5]">
                    <img :src="api.videoServer + '/' + modifyVideoObj.form.oldthumbnail_path" class="w-full h-full object-cover opacity-80" />
                    <span class="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1 rounded">{{ l.current }}</span>
                  </div>
                </div>
              </div>

              <!-- Audience / Settings -->
              <div class="mb-8">
                <h4 class="text-sm font-medium text-[#0D0D0D] mb-2">{{ l.audience }}</h4>

                <div class="bg-[#F9F9F9] p-4 rounded border border-[#E5E5E5] mb-4">
                  <label class="block text-sm font-medium text-[#0D0D0D] mb-2">{{ l.college }}</label>
                  <div class="relative">
                    <select v-model="modifyVideoObj.form.college_id" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]">
                      <option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</option>
                    </select>
                  </div>
                </div>

                <div class="bg-[#F9F9F9] p-4 rounded border border-[#E5E5E5]">
                  <label class="block text-sm font-medium text-[#0D0D0D] mb-2">{{ l.visibility }}</label>
                  <div class="flex items-center gap-4">
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="modify_visibility" :value="0" :checked="modifyVideoObj.form.is_public == 0" @change="modifyVideoObj.form.is_public = 0" class="accent-[#065FD4]" />
                      <span class="text-sm">{{ l.private }}</span>
                    </label>
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="modify_visibility" :value="1" :checked="modifyVideoObj.form.is_public == 1" @change="modifyVideoObj.form.is_public = 1" class="accent-[#065FD4]" />
                      <span class="text-sm">{{ l.public }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right Column: Info (Sticky) -->
            <div class="w-[300px] bg-[#F9F9F9] p-4 border-l border-[#E5E5E5] flex flex-col gap-4">
              <div class="w-full aspect-video bg-black rounded overflow-hidden relative">
                <img v-if="coverObj.imageUrl" :src="coverObj.imageUrl" class="w-full h-full object-cover" />
                <img v-else-if="modifyVideoObj.form.oldthumbnail_path" :src="api.videoServer + '/' + modifyVideoObj.form.oldthumbnail_path" class="w-full h-full object-cover" />
              </div>

              <div class="space-y-3">
                <div>
                  <div class="text-xs text-[#606060] mb-1">{{ l.videoLink }}</div>
                  <a :href="getVideoViewLink" target="_blank" rel="noopener noreferrer" class="text-sm text-[#065FD4] break-all cursor-pointer hover:underline">
                    {{ getVideoViewLink }}
                  </a>
                </div>
              </div>
            </div>
          </div>

          <!-- Footer -->
          <div class="border-t border-[#E5E5E5] p-4 flex justify-end items-center gap-2 bg-white z-10">
            <Button variant="ghost" @click="showObj.modifyVideo = false">
              {{ c.cancel || 'CANCEL' }}
            </Button>
            <Button variant="primary" @click="handleSubmit('modifyVideo')">
              {{ l.updateVideo || 'SAVE' }}
            </Button>
          </div>
        </div>
      </a-drawer>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch, onMounted, onBeforeUnmount, ref, getCurrentInstance } from 'vue'
import * as signalR from '@microsoft/signalr'
import { message } from 'ant-design-vue'
import { useLocalI18n } from '@/composables/useLocalI18n'
import api from '@/api'
import store from '@/store'
import videoPlayer from '@/components/videoPlayer/VideoPlayerPlyr.vue'
import Button from '../common/Button.vue'
import Pagination from '../common/Pagination.vue'
import Dropdown from '../common/Dropdown.vue'

// Global instance access
const instance = getCurrentInstance()
const route = instance.proxy.$route
const router = instance.proxy.$router
const { $request } = instance.proxy

// Internationalization
const { l, c } = useLocalI18n('videoAdminContent')

// Refs
const videoInput = ref()
const coverInput = ref()
const videoPlayerRef = ref()

// Computed
const isAdmin = computed(() => store.getters.isAdmin)

// Reactive data
const imageErrors = ref({})
const coverObj = reactive({
  dialogImageUrl: '',
  imageUrl: '',
  file: {
    name: '',
  },
})

const uploadVideoObj = reactive({
  id: '',
  name: '',
  duration: '',
  type: '',
  college_id: '',
  is_public: 0,
  size: 0,
  uploadSize: '0 B',
  uploadPercent: 0,
  uploadEvent: {
    uploadSize: 0,
    speed: '0 B/s',
    oTime: 0,
    restTime: l.value.notStart || 'Not started',
  },
  thumbnail: '',
  thumbnail_path: '',
  description: '',
  file: {
    name: '',
  },
})

const modifyVideoObj = reactive({
  form: {
    id: '',
    title: '',
    type: '',
    college_id: '',
    is_public: '',
    oldthumbnail_path: '',
    thumbnail_path: '',
    description: '',
  },
})

const videoListObj = reactive({
  query: {
    college_id: '',
    title: '',
    type: '',
    status: '',
    is_public: '',
    page: 1,
    pageSize: 10,
  },
  total: 0,
  list: [],
})

const handleImageError = (id) => {
  console.log('Image load error for ID:', id)
  imageErrors.value = { ...imageErrors.value, [id]: true }
}

const flagObj = reactive({
  selectVideo: false,
  uploadAble: false,
  uploading: false,
  dragActive: false,
})

const showObj = reactive({
  videoUrl: '',
  uploadVideo: false,
  modifyVideo: false,
  coverDialog: false,
  previewVideo: false,
})

const publicCodeObj = reactive({
  collegeList: [],
})

let axiosController = null

// SignalR / progress state (use refs for script-setup)
const connection = ref(null)
const videoId = ref('')
const currentTimeMs = ref(0)
const isFinished = ref(false)
const statusMessage = ref('')
const statusType = ref('')

// Watchers
watch(
  () => videoListObj.query.college_id,
  (newVal, oldVal) => {
    if (newVal && oldVal === '') {
      videoListObj.query.is_public = ''
    }
    if (!isAdmin.value) {
      if (newVal == '') {
        videoListObj.query.is_public = 1
      }
    }
    getVideoList()
  }
)

// Methods
const uploadNewVideo = () => {
  uploadVideoObj.id = ''
  uploadVideoObj.name = ''
  uploadVideoObj.duration = ''
  uploadVideoObj.type = ''
  uploadVideoObj.college_id = isAdmin.value ? '' : publicCodeObj.collegeList[0].id
  uploadVideoObj.is_public = 0
  uploadVideoObj.size = 0
  uploadVideoObj.uploadSize = '0 B'
  uploadVideoObj.uploadPercent = 0
  uploadVideoObj.uploadEvent = {
    uploadSize: 0,
    speed: '0 B/s',
    oTime: 0,
    restTime: l.value.notStart,
  }
  uploadVideoObj.thumbnail = ''
  uploadVideoObj.thumbnail_path = ''
  uploadVideoObj.description = ''
  uploadVideoObj.file = { name: '' }
  showObj.uploadVideo = true
}

const handleSizeChange = (pageSize) => {
  videoListObj.query.pageSize = pageSize
  getVideoList()
}

const handlePageChange = (page) => {
  videoListObj.query.page = page
  getVideoList()
}

const previewVideo = (i) => {
  if (i.url) {
    showObj.videoUrl = api.videoServer + i.url
  }
  showObj.previewVideo = true
}

const videoClose = () => {
  if (videoPlayerRef.value) {
    videoPlayerRef.value.onPause()
  }
  showObj.previewVideo = false
}

const handleSubmit = (type) => {
  if (type == 'uploadVideo') {
    if (!uploadVideoObj.file) {
      return message.error(l.value.plsSelectVideo)
    }
    if (!uploadVideoObj.name) {
      return message.error(l.value.plsInputTitle)
    }
    if (!uploadVideoObj.type) {
      uploadVideoObj.type = 'Video'
    }
    if (!uploadVideoObj.description) {
      return message.error(l.value.plsInputDesc)
    }
    if (!uploadVideoObj.college_id) {
      return message.error(l.value.plsSelectCollege)
    }
    uploadCover(type)
  } else if (type == 'modifyVideo') {
    if (!modifyVideoObj.form.title) {
      return message.error(l.value.plsInputTitle)
    }
    if (!modifyVideoObj.form.type) {
      return message.error(l.value.plsSelectType)
    }
    if (!modifyVideoObj.form.description) {
      return message.error(l.value.plsSelectCollege)
    }
    if (!coverObj.file.name) {
      modifyVideo()
    } else {
      uploadCover(type)
    }
  }
}

const getCollegeList = () => {
  $request(api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
    resource_path: route.path,
  })
    .then((r) => {
      publicCodeObj.collegeList = [{ id: '', name_label: l.value.allChannels || 'All Colleges' }, ...r.data]
      videoListObj.query.college_id = r.data[0].id
    })
    .catch((e) => {
      message.error(e.message)
    })
}

// Cover methods
const coverSelect = () => {
  coverInput.value.click()
}

const coverPreview = (url) => {
  if (!url) return
  coverObj.dialogImageUrl = url
  showObj.coverDialog = true
}

const uploadCoverChange = (e) => {
  let file = e.target.files[0]
  if (!file) return
  let reader = new FileReader()
  reader.onload = (r) => {
    coverObj.imageUrl = r.target.result
  }
  reader.readAsDataURL(file)
  coverObj.file = file
}

const uploadCover = (next) => {
  let formData = new FormData()
  formData.append('formFile', coverObj.file)
  $request(api.videoServer + '/Video/VideoManage/uploadPicture', formData, 'post')
    .then((r) => {
      if (r.httpCode == 200 && r.data.url) {
        if (next == 'uploadVideo') {
          uploadVideoObj.thumbnail_path = r.data.url
          uploadVideo()
        } else if (next == 'modifyVideo') {
          modifyVideoObj.form.thumbnail_path = r.data.url
          modifyVideo()
        }
      }
    })
    .catch((e) => {
      console.error(e)
    })
}

// Video upload methods
const videoSelect = () => {
  videoInput.value.click()
}

const handleDragLeave = (e) => {
  // Chỉ set dragActive = false nếu rời khỏi toàn bộ drop area
  if (e.target.classList && e.target.classList.contains('el-icon-upload')) {
    flagObj.dragActive = false
  }
}

const handleVideoDrop = (e) => {
  flagObj.dragActive = false
  const files = e.dataTransfer?.files
  
  if (!files || files.length === 0) {
    return
  }

  const file = files[0]
  
  // Validate file type
  if (!file.type.startsWith('video/')) {
    message.error(l.value.plsSelectVideo || 'Please select a video file')
    return
  }

  // Process the dropped file
  uploadVideoObj.file = file
  flagObj.selectVideo = true
  flagObj.uploadAble = true
  flagObj.uploading = false

  uploadVideoObj.name = file.name.split('.')[0]
  uploadVideoObj.size = formatFileSize(file.size)
  drawCoverByFile(file)
}

const videoChange = (e) => {
  videoRemove()
  let file = e.target.files[0]
  uploadVideoObj.file = file

  if (file.type.split('/')[0] !== 'video') {
    videoRemove(true)
    return message.error(l.value.plsSelectVideo)
  } else {
    flagObj.selectVideo = true
    flagObj.uploadAble = true
    flagObj.uploading = false
  }

  uploadVideoObj.name = file.name.split('.')[0]
  uploadVideoObj.size = formatFileSize(file.size)
  drawCoverByFile(file)
}

const drawCoverByFile = (videoFile, time = 0) => {
  if (videoFile) {
    let video = document.createElement('video')
    video.currentTime = time
    video.preload = 'auto'
    video.muted = true
    video.autoplay = true
    video.src = URL.createObjectURL(videoFile)
    video.oncanplay = function () {
      uploadVideoObj.duration = video.duration
      let canvas = document.createElement('canvas')
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      let ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight)
      let imgDataUrl = canvas.toDataURL('image/png')
      coverObj.imageUrl = imgDataUrl
      fetch(imgDataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          let coverFile = new File([blob], uploadVideoObj.name + '.png', {
            type: 'image/png',
          })
          coverObj.file = coverFile
        })
    }
  }
}

const rightCheck = (i, toast = false) => {
  if (isAdmin.value) {
    return true
  } else {
    if (publicCodeObj.collegeList.some((c) => c.id == i.college_id)) {
      return true
    } else {
      if (toast) {
        message.error(l.value.noRightToEdit)
      }
      return false
    }
  }
}

const beforeModifyVideo = (i) => {
  if (rightCheck(i, true)) {
    modifyVideoObj.form = {
      id: i.id,
      title: i.title,
      type: i.type,
      college_id: i.college_id,
      is_public: i.is_public,
      oldthumbnail_path: i.thumbnail_path,
      thumbnail_path: '',
      description: i.description,
    }
    coverObj.imageUrl = ''
    coverObj.file = { name: '' }
    showObj.modifyVideo = true
  }
}

const modifyVideo = () => {
  if (!modifyVideoObj.form.thumbnail_path) {
    modifyVideoObj.form.thumbnail_path = modifyVideoObj.form.oldthumbnail_path
  }
  $request(api.videoServer + '/Video/VideoManage/modifyVideoInfo', modifyVideoObj.form, 'post')
    .then((r) => {
      if (r.httpCode == 200) {
        message.success(l.value.updateSuccess)
        let timer = setTimeout(() => {
          showObj.modifyVideo = false
          // Clear cover preview/file after successful modify
          try {
            if (coverInput && coverInput.value) coverInput.value.value = ''
          } catch (e) {}
          coverObj.imageUrl = ''
          coverObj.file = { name: '' }
          getVideoList()
          clearTimeout(timer)
        }, 1500)
      }
    })
    .catch((e) => {
      message.error(e.message)
      console.log(e)
    })
}

const deleteVideo = (i) => {
  if (rightCheck(i, true)) {
    const confirmed = window.confirm(`《${i.title}》${l.value.deleteVideoConfirm}`)
    if (confirmed) {
      $request(api.videoServer + '/Video/VideoManage/deleteVideo', { id: i.id }, 'post')
        .then((r) => {
          message.success(l.value.deleteSuccess)
          getVideoList()
        })
        .catch((e) => {
          message.error(e.message)
        })
    }
  }
}

const uploadVideo = () => {
  axiosController = new AbortController()
  let formData = new FormData()
  formData.append('file', uploadVideoObj.file)
  let fields = ['id', 'college_id', 'is_public', 'name', 'type', 'thumbnail_path', 'description']
  fields.forEach((i) => {
    formData.append(i, uploadVideoObj[i])
  })
  let customConfig = {
    onUploadProgress: function (progressEvent) {
      if (!progressEvent.total) {
        uploadVideoObj.uploadPercent = 0
        return
      }
      let currentTime = new Date().getTime()
      let uploadTime = (currentTime - uploadVideoObj.uploadEvent.oTime) / 1000

      if (uploadTime > 0) {
        let uploadPart = progressEvent.loaded - uploadVideoObj.uploadEvent.uploadSize
        // Avoid negative uploadPart which might happen due to timing issues or retries
        if (uploadPart < 0) uploadPart = 0

        let speed = uploadPart / uploadTime
        if (speed > 0) {
          let restTime = (progressEvent.total - progressEvent.loaded) / speed
          uploadVideoObj.uploadEvent.speed = formatFileSize(speed) + '/s'
          uploadVideoObj.uploadEvent.restTime = formatSeconds(restTime, true)
        }
      }

      uploadVideoObj.uploadEvent.uploadSize = progressEvent.loaded
      uploadVideoObj.uploadEvent.oTime = currentTime
      uploadVideoObj.uploadPercent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
      uploadVideoObj.uploadSize = formatFileSize(progressEvent.loaded)
    },
  }

  flagObj.uploading = true
  uploadVideoObj.uploadEvent.oTime = new Date().getTime()
  $request(api.videoServer + '/Video/VideoManage/uploadVideoStreaming', formData, 'post', 'noErrorDialog', customConfig, axiosController)
    .then((r) => {
      if (r.httpCode == 200) {
        message.success(l.value.uploadSuccess)
        let timer = setTimeout(() => {
          flagObj.uploadAble = false
          getVideoList()
          showObj.uploadVideo = false
          clearTimeout(timer)
          videoRemove(true)
        }, 1500)
      }
    })
    .catch((e) => {
      flagObj.uploading = false
      return message.error(e.message)
    })
}

const videoRemove = (flag) => {
  if (flag) {
    videoInput.value.value = ''
  }
  // Reset cover input and preview when removing selected video
  try {
    if (coverInput && coverInput.value) {
      coverInput.value.value = ''
    }
  } catch (e) {}
  coverObj.imageUrl = ''
  coverObj.file = { name: '' }
  flagObj.selectVideo = false
  flagObj.uploadAble = false
  uploadVideoObj.id = ''
  uploadVideoObj.name = ''
  uploadVideoObj.duration = ''
  uploadVideoObj.type = ''
  uploadVideoObj.college_id = isAdmin.value ? '' : publicCodeObj.collegeList[0].id
  uploadVideoObj.is_public = 0
  uploadVideoObj.size = 0
  uploadVideoObj.uploadSize = '0 B'
  uploadVideoObj.uploadPercent = 0
  uploadVideoObj.uploadEvent = {
    uploadSize: 0,
    speed: '0 B/s',
    oTime: 0,
    restTime: 'Not started',
  }
  uploadVideoObj.thumbnail = ''
  uploadVideoObj.thumbnail_path = ''
  uploadVideoObj.description = ''
  uploadVideoObj.file = { name: '' }
}

const abortUploadVideo = () => {
  flagObj.uploading = false
  if (axiosController) {
    axiosController.abort()
  }
}

const closeUploadDrawer = () => {
  // If an upload is in progress, abort it first
  if (flagObj.uploading) {
    abortUploadVideo()
  }
  showObj.uploadVideo = false
  // Clear selected video and cover preview to reset the form
  videoRemove(true)
}

// Video list methods
const getVideoList = () => {
  $request(api.videoServer + '/Video/VideoManage/getVideoList', videoListObj.query)
    .then((r) => {
      if (r.httpCode == 200) {
        videoListObj.list = r.data.list
        videoListObj.total = r.data.total
        if (r.data.total == 0) {
          videoListObj.list = []
        }
      }
    })
    .catch((e) => {
      console.log(e)
    })
}

// Utility functions
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  let k = 1024
  let sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  let i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const formatSeconds = (seconds, chinese) => {
  let hours = Math.floor(seconds / 3600)
  let minutes = Math.floor((seconds % 3600) / 60)
  let remainingSeconds = parseInt(seconds % 60)
  let fractionalHours
  if (chinese) {
    if (hours > 0) {
      fractionalHours = hours + minutes / 60
      return `${fractionalHours.toFixed(1)}${l.value.hours}`
    } else if (minutes > 0) {
      return `${minutes}${l.value.mins}`
    } else {
      return `${remainingSeconds}${l.value.seconds}`
    }
  } else {
    if (hours > 0) {
      fractionalHours = hours + minutes / 60
      return `${fractionalHours.toFixed(1)} hours`
    } else if (minutes > 0) {
      return `${minutes} minutes`
    } else {
      return `${remainingSeconds} seconds`
    }
  }
}

const formatDuration = (totalSeconds, unit) => {
  let duration = Math.floor(totalSeconds)
  let hours = Math.floor(duration / 3600)
  let minutes = Math.floor((duration % 3600) / 60)
  let seconds = duration % 60

  if (unit) {
    return [hours > 0 ? `${hours}${l.value.hours}` : '', minutes.toString().padStart(2, '0') + `${l.value.mins}`, seconds.toString().padStart(2, '0') + `${l.value.seconds}`].filter(Boolean).join('')
  } else {
    return [hours > 0 ? `${hours}:` : '', minutes.toString().padStart(2, '0') + ':', seconds.toString().padStart(2, '0')].filter(Boolean).join('')
  }
}

const getUploadedBy = (video) => {
  // Ưu tiên hiển thị người sửa cuối cùng, nếu không có thì hiển thị người tải lên
  return video.modify_user || video.create_user || l.value.unknownUser
}

const getUploadedByLabel = (video) => {
  // Nhãn cho người tải lên hoặc người sửa
  if (video.modify_user && video.modify_user !== video.create_user) {
    return l.value.lastModified
  }
  return l.value.uploadedBy
}

const initializeSignalR = () => {
  // Tạo connection đến SignalR Hub
  connection.value = new signalR.HubConnectionBuilder()
    .withUrl(api.baseUrl + '/hubs/videoProg') // Thay đổi URL của bạn
    .withAutomaticReconnect()
    .build()

  // Nhận sự kiện progress từ server
  connection.value.on('ReceiveVideoProgress', (data) => {
    console.log('Progress update:', data)
    currentTimeMs.value = data.timeMs
    videoId.value = data.videoId
    isFinished.value = false
  })

  // Nhận sự kiện FFmpeg hoàn tất
  connection.value.on('FFmpegFinished', (data) => {
    // console.log('FFmpeg finished:', data)
    isFinished.value = true
    statusMessage.value = 'Video converted successfully!'
    statusType.value = 'success'
    getVideoList()
  })

  // Nhận sự kiện lỗi
  connection.value.on('FFmpegError', (data) => {
    console.error('FFmpeg error:', data)
    isFinished.value = false
    statusMessage.value = `Error: ${data.message}`
    statusType.value = 'error'
  })

  // Kết nối đến server
  connection.value.start().catch((err) => {
    console.error('SignalR connection error:', err)
    statusMessage.value = 'Connection error'
    statusType.value = 'error'
  })
}

const videoProcess = computed(() => {
  if (!videoListObj.list.find((v) => v.id === videoId.value)) {
    return null
  }

  return {
    videoId: videoId.value,
    currentTime: currentTimeMs.value / (1000 * 1000),
    isFinished: isFinished.value,
    statusType: statusType.value,
  }
})

const getVideoViewLink = computed(() => {
  if (!modifyVideoObj.form.id) return ''
  const relativePath = router.resolve({
    name: 'videoPlay',
    query: {
      course_primary_id: modifyVideoObj.form.id,
    },
  }).href
  return `${window.location.origin}${relativePath}`
})

// Lifecycle
onMounted(() => {
  getCollegeList()
  initializeSignalR()
})

onBeforeUnmount(() => {
  if (videoPlayerRef.value) {
    videoPlayerRef.value.onDestroy()
  }
  // Stop SignalR connection when component unmounts
  if (connection && connection.value) {
    connection.value.stop().catch(() => {})
  }
})
</script>

<style scoped>
.animate-fade-in {
  animation: fade-in 0.3s ease-in-out;
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #cccccc;
  border-radius: 4px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #999999;
}
</style>
