<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Channel Dashboard Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white">
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
        <div class="relative group w-48">
          <button class="w-full flex items-center justify-between px-3 py-2 bg-white border border-[#CCCCCC] rounded text-sm text-[#0D0D0D] hover:border-[#999999] transition-colors group-hover:border-[#606060]">
            <span class="flex items-center gap-2">
              <i class="el-icon-office-building text-[#606060]"></i>
              <span class="truncate">{{ videoListObj.query.college_id ? returnCollegeName(videoListObj.query.college_id) : l.allChannels }}</span>
            </span>
            <i class="el-icon-arrow-down text-[#606060] text-xs group-hover:rotate-180 transition-transform"></i>
          </button>

          <!-- Invisible hover bridge -->
          <div class="absolute top-full left-0 right-0 h-1 hidden group-hover:block"></div>

          <!-- Dropdown Menu -->
          <div class="absolute top-full left-0 right-0 mt-0 bg-white border border-[#E5E5E5] rounded shadow-lg hidden group-hover:block z-50">
            <div class="max-h-56 overflow-y-auto">
              <!-- All Channels Option -->
              <button
                class="w-full text-left px-3 py-2 hover:bg-[#F2F2F2] text-sm text-[#0D0D0D] border-b border-[#E5E5E5]"
                :class="videoListObj.query.college_id === '' ? 'bg-[#F0F0F0] text-[#065FD4] font-medium' : ''"
                @click="
                  videoListObj.query.college_id = ''
                  getVideoList()
                ">
                {{ l.allChannels }}
              </button>

              <!-- College Options -->
              <button
                v-for="college in publicCodeObj.collegeList"
                :key="college.id"
                class="w-full text-left px-3 py-2 hover:bg-[#F2F2F2] text-sm text-[#0D0D0D] border-b border-[#E5E5E5] last:border-b-0"
                :class="videoListObj.query.college_id === college.id ? 'bg-[#F0F0F0] text-[#065FD4] font-medium' : ''"
                @click="
                  videoListObj.query.college_id = college.id
                  getVideoList()
                ">
                <div class="flex items-center gap-2">
                  <i class="el-icon-check text-[#065FD4]" :class="videoListObj.query.college_id === college.id ? 'opacity-100' : 'opacity-0'"></i>
                  <span>{{ college.name_label }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>

        <!-- Search Filter -->
        <div class="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-[#CCCCCC] rounded hover:border-[#606060] transition-colors focus-within:border-[#065FD4]">
          <i class="el-icon-s-operation text-[#606060] text-lg"></i>
          <input v-model="videoListObj.query.title" type="text" :placeholder="l.filter" class="bg-transparent border-none outline-none text-sm w-full placeholder-[#999999]" @change="getVideoList" />
        </div>
      </div>
    </div>

    <div class="flex-1 overflow-y-scroll">
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
        <div v-if="videoListObj.list.length === 0" class="flex flex-col items-center justify-center py-20 flex-1">
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
                  <img :src="api.videoServer + '/' + i.thumbnail_path" class="w-full h-full object-cover" />
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
                      <i class="el-icon-edit text-lg cursor-pointer hover:text-[#0D0D0D]" title="Details" @click="beforeModifyVideo(i)"></i>
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
      <div class="flex items-center gap-2">
        <span>{{ l.rowsPerPage }}:</span>
        <select
          class="border-none bg-transparent outline-none font-medium"
          v-model.number="videoListObj.query.pageSize"
          @change="
            videoListObj.query.page = 1
            getVideoList()
          ">
          <option :value="10">10</option>
          <option :value="30">30</option>
          <option :value="50">50</option>
        </select>
        <span class="mx-2">1-{{ videoListObj.list.length }} {{ l.of }} {{ videoListObj.total }}</span>
        <i class="el-icon-arrow-left cursor-pointer hover:bg-[#F2F2F2] p-1 rounded-full" :class="videoListObj.query.page <= 1 ? 'opacity-50 cursor-not-allowed' : ''" @click="videoListObj.query.page > 1 && handlePageChange(videoListObj.query.page - 1)"></i>
        <i class="el-icon-arrow-right cursor-pointer hover:bg-[#F2F2F2] p-1 rounded-full" :class="videoListObj.query.page >= Math.ceil(videoListObj.total / videoListObj.query.pageSize) ? 'opacity-50 cursor-not-allowed' : ''" @click="videoListObj.query.page < Math.ceil(videoListObj.total / videoListObj.query.pageSize) && handlePageChange(videoListObj.query.page + 1)"></i>
      </div>
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
      <a-drawer :visible="showObj.uploadVideo" :title="l.uploadVideo" :width="900" @close="closeUploadDrawer">
        <div class="w-full h-full pb-24">
          <!-- Video Upload Area -->
          <div class="w-full mb-8">
            <div class="flex justify-center items-center">
              <div v-if="!flagObj.selectVideo" class="w-full h-56 border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all" @click="videoSelect">
                <i class="el-icon-upload text-5xl text-gray-400 mb-4"></i>
                <div class="text-lg text-gray-600 font-medium">{{ l.selectVideo }}</div>
                <div class="text-sm text-gray-400 mt-2">{{ l.dragOrClickToSelect }}</div>
              </div>
              <div v-else class="w-full bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <div class="flex items-start gap-4">
                  <i class="el-icon-video-camera-solid text-5xl text-blue-500 shrink-0"></i>
                  <div class="flex-1 overflow-hidden">
                    <div class="text-lg font-semibold text-gray-800 truncate">{{ uploadVideoObj.file.name }}</div>
                    <div class="text-sm text-gray-500 mt-1">{{ uploadVideoObj.size }}</div>
                    <div class="flex items-center gap-4 mt-3">
                      <div>
                        <div class="text-sm font-medium text-blue-600 w-12 text-center">{{ uploadVideoObj.uploadPercent }}%</div>
                      </div>
                      <div class="flex-1">
                        <a-progress :percent="uploadVideoObj.uploadPercent" :show-info="false"></a-progress>
                      </div>
                    </div>
                    <div class="mt-3 grid grid-cols-3 gap-3 text-xs text-gray-600">
                      <div class="flex items-center">
                        <i class="el-icon-upload text-blue-500 mr-2"></i>
                        <span>{{ uploadVideoObj.uploadSize }} / {{ uploadVideoObj.size }}</span>
                      </div>
                      <div class="flex items-center">
                        <i class="el-icon-d-arrow-right text-green-500 mr-2"></i>
                        <span>{{ uploadVideoObj.uploadEvent.speed }}</span>
                      </div>
                      <div class="flex items-center">
                        <i class="el-icon-time text-orange-500 mr-2"></i>
                        <span>{{ uploadVideoObj.uploadEvent.restTime }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button class="p-2 rounded-full bg-white hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors size-10" @click="videoRemove(true)" title="删除">
                      <i class="el-icon-delete text-xl"></i>
                    </button>
                    <button class="p-2 rounded-full bg-white hover:bg-green-50 text-green-500 hover:text-green-700 transition-colors size-10" @click="videoSelect" title="更换">
                      <i class="el-icon-folder-opened text-xl"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Cover Upload -->
          <div class="w-full mb-8">
            <h3 class="text-base font-semibold text-gray-800 mb-3">{{ l.cover }}</h3>
            <div v-if="coverObj.imageUrl == ''" class="w-40 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all" @click="coverSelect('upload')">
              <i class="el-icon-upload text-3xl text-gray-400 mb-2"></i>
              <div class="text-sm text-gray-600">{{ l.selectCover }}</div>
            </div>
            <div v-else class="relative w-40 h-32 rounded-lg overflow-hidden group">
              <img class="w-full h-full object-cover" :src="coverObj.imageUrl" />
              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-around items-center">
                <button class="p-2 rounded-full bg-white text-gray-800 hover:bg-blue-500 hover:text-white transition-colors size-10" @click="coverPreview(coverObj.imageUrl)" title="预览">
                  <i class="el-icon-zoom-in"></i>
                </button>
                <button class="p-2 rounded-full bg-white text-gray-800 hover:bg-green-500 hover:text-white transition-colors size-10" @click="drawCoverByFile(uploadVideoObj.file, Math.random(0, 1) * uploadVideoObj.duration)" title="刷新">
                  <i class="el-icon-refresh-left"></i>
                </button>
                <button class="p-2 rounded-full bg-white text-gray-800 hover:bg-orange-500 hover:text-white transition-colors size-10" @click="coverSelect('upload')" title="更换">
                  <i class="el-icon-folder-opened"></i>
                </button>
              </div>
            </div>
          </div>

          <!-- Form Fields -->
          <div class="w-full space-y-4">
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ l.title }}
                <span class="text-red-500">*</span>
              </label>
              <a-input v-model:value="uploadVideoObj.name" :placeholder="l.title" class="w-full"></a-input>
            </div>

            <!-- College & Public Switch -->
            <div class="grid grid-cols-3 gap-4">
              <div class="col-span-2">
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  {{ l.college }}
                  <span class="text-red-500">*</span>
                </label>
                <a-select v-model:value="uploadVideoObj.college_id" :placeholder="l.selectCollegePd" class="w-full">
                  <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</a-select-option>
                </a-select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">{{ l.republic }}</label>
                <a-switch
                  @change="
                    (value) => {
                      uploadVideoObj.is_public = value ? 1 : 0
                    }
                  "></a-switch>
              </div>
            </div>

            <!-- Description -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                {{ l.introduce }}
                <span class="text-red-500">*</span>
              </label>
              <a-textarea v-model:value="uploadVideoObj.description" :placeholder="l.introducePd" :rows="3" class="w-full"></a-textarea>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="absolute bottom-0 right-0 w-full pr-8 pb-6 pt-4 bg-white border-t border-gray-200 flex justify-end items-center gap-3">
            <a-button @click="closeUploadDrawer" class="px-6">{{ c.cancel }}</a-button>
            <a-button type="primary" @click="handleSubmit('uploadVideo')" :disabled="!flagObj.uploadAble" :loading="flagObj.uploading" class="px-6">
              <i class="el-icon-upload mr-2"></i>
              {{ l.uploadVideo }}
            </a-button>
            <a-button v-if="flagObj.uploading" danger @click="abortUploadVideo" class="px-6">{{ l.giveup }}</a-button>
          </div>
        </div>
      </a-drawer>

      <!-- Modify Video Drawer -->
      <a-drawer :visible="showObj.modifyVideo" :title="l.modifyVideo" :width="800" :body-style="{ paddingBottom: '100px' }" @close="showObj.modifyVideo = false">
        <!-- Cover Comparison -->
        <div class="w-full mb-8">
          <h3 class="text-base font-semibold text-gray-800 mb-4">{{ l.cover }}</h3>
          <div class="flex items-center gap-6">
            <!-- Old Cover -->
            <div class="flex flex-col items-center">
              <div class="relative w-44 h-32 rounded-lg overflow-hidden group mb-2">
                <img class="w-full h-full object-cover" :src="api.videoServer + '/' + modifyVideoObj.form.oldthumbnail_path" />
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-center items-center">
                  <button class="p-2 rounded-full bg-white text-gray-800 hover:bg-blue-500 hover:text-white transition-colors" @click="coverPreview(api.videoServer + '/' + modifyVideoObj.form.oldthumbnail_path)">
                    <i class="el-icon-zoom-in"></i>
                  </button>
                </div>
              </div>
              <span class="text-xs text-gray-500">{{ l.oldCover }}</span>
            </div>

            <!-- Arrow -->
            <div class="text-3xl text-blue-500 mt-4">
              <i class="el-icon-right"></i>
            </div>

            <!-- New Cover -->
            <div class="flex flex-col items-center">
              <div v-if="coverObj.imageUrl == ''" class="w-44 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col justify-center items-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all mb-2" @click="coverSelect('upload')">
                <i class="el-icon-upload text-3xl text-gray-400 mb-2"></i>
                <div class="text-sm text-gray-600">{{ l.selectNewCover }}</div>
              </div>
              <div v-else class="relative w-44 h-32 rounded-lg overflow-hidden group mb-2">
                <img class="w-full h-full object-cover" :src="coverObj.imageUrl" />
                <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex justify-around items-center">
                  <button class="p-2 rounded-full bg-white text-gray-800 hover:bg-blue-500 hover:text-white transition-colors" @click="coverPreview(coverObj.imageUrl)">
                    <i class="el-icon-zoom-in"></i>
                  </button>
                  <button class="p-2 rounded-full bg-white text-gray-800 hover:bg-green-500 hover:text-white transition-colors" @click="coverSelect('upload')">
                    <i class="el-icon-folder-opened"></i>
                  </button>
                </div>
              </div>
              <span class="text-xs text-gray-500">{{ l.newCover }}</span>
            </div>
          </div>
        </div>

        <!-- Form Fields -->
        <div class="w-full space-y-5">
          <!-- Title -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ l.title }}</label>
            <a-input v-model:value="modifyVideoObj.form.title" :placeholder="l.title" class="w-full"></a-input>
          </div>

          <!-- College & Public Switch -->
          <div class="grid grid-cols-3 gap-4">
            <div class="col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ l.college }}</label>
              <a-select v-model:value="modifyVideoObj.form.college_id" :placeholder="l.selectCollegePd" class="w-full">
                <a-select-option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</a-select-option>
              </a-select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">{{ l.republic }}</label>
              <a-switch
                @change="
                  (value) => {
                    modifyVideoObj.form.is_public = value ? 1 : 0
                  }
                "></a-switch>
            </div>
          </div>

          <!-- Description -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">{{ l.introduce }}</label>
            <a-textarea v-model:value="modifyVideoObj.form.description" :placeholder="l.introducePd" :rows="3" class="w-full"></a-textarea>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="absolute bottom-0 right-0 w-full pr-8 pb-6 pt-4 bg-white border-t border-gray-200 flex justify-end items-center gap-3">
          <a-button @click="showObj.modifyVideo = false">{{ c.cancel }}</a-button>
          <a-button type="primary" @click="handleSubmit('modifyVideo')">
            <i class="el-icon-document-copy mr-1"></i>
            {{ l.updateVideo }}
          </a-button>
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

const flagObj = reactive({
  selectVideo: false,
  uploadAble: false,
  uploading: false,
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
const returnCollegeName = (id) => {
  let college = publicCodeObj.collegeList.find((i) => i.id == id)
  if (college) {
    return college.name_label
  } else {
    return id
  }
}

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
      publicCodeObj.collegeList = r.data
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
    // console.log('Progress update:', data)
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
