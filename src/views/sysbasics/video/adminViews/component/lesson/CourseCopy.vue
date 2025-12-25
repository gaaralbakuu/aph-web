<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.courseList || 'Courses' }}</h1>
      <button class="flex items-center gap-2 px-4 py-2 bg-[#CC0000] text-white! font-medium text-sm uppercase rounded-sm hover:bg-[#990000] transition-colors shadow-sm" @click="addCourse">
        <i class="el-icon-plus text-lg"></i>
        <span>{{ l.addCourse }}</span>
      </button>
    </div>

    <!-- Filter Bar -->
    <div class="px-6 pt-6 pb-2 border-b border-[#E5E5E5] bg-white sticky top-0 z-20"><div class="flex items-center gap-6 text-sm font-medium text-[#606060]">
        <button
          class="pb-3 border-b-2 transition-colors"
          :class="courseObj.query.is_valid === '' ? 'text-[#0D0D0D] border-[#0D0D0D]' : 'border-transparent hover:text-[#0D0D0D]'"
          @click="
            courseObj.query.is_valid = ''
            getCourseList()
          ">
          {{ c.all || 'All' }}
        </button>
        <button
          class="pb-3 border-b-2 transition-colors"
          :class="courseObj.query.is_valid === 'Y' ? 'text-[#0D0D0D] border-[#0D0D0D]' : 'border-transparent hover:text-[#0D0D0D]'"
          @click="
            courseObj.query.is_valid = 'Y'
            getCourseList()
          ">
          {{ l.enable || 'Enable' }}
        </button>
        <button
          class="pb-3 border-b-2 transition-colors"
          :class="courseObj.query.is_valid === 'N' ? 'text-[#0D0D0D] border-[#0D0D0D]' : 'border-transparent hover:text-[#0D0D0D]'"
          @click="
            courseObj.query.is_valid = 'N'
            getCourseList()
          ">
          {{ l.disable || 'Disable' }}
        </button>
      </div>
      <div class="mt-4 mb-2 flex flex-wrap items-center gap-4">
        <!-- College Filter -->

        <Dropdown
          :modelValue="courseObj.query.college_id"
          :options="publicCodeObj.collegeList"
          :placeholder="'All Colleges'"
          label-key="name_label"
          icon-class="el-icon-office-building"
          @update:modelValue="
            courseObj.query.college_id = $event
            getCourseList()
          " />

        <!-- Search Title -->
        <div class="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-[#CCCCCC] rounded hover:border-[#606060] transition-colors focus-within:border-[#065FD4] min-w-[200px] max-w-sm">
          <i class="el-icon-search text-[#606060] text-lg"></i>
          <input v-model="courseObj.query.name" type="text" :placeholder="l.title" class="bg-transparent border-none outline-none text-sm w-full placeholder-[#999999]" @keyup.enter="getCourseList" />
        </div>

        <!-- Search Desc -->
        <div class="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-[#CCCCCC] rounded hover:border-[#606060] transition-colors focus-within:border-[#065FD4] min-w-[200px] max-w-sm">
          <input v-model="courseObj.query.description" type="text" :placeholder="l.desc" class="bg-transparent border-none outline-none text-sm w-full placeholder-[#999999]" @keyup.enter="getCourseList" />
        </div>

        <!-- Course Type -->

        <Dropdown
          :modelValue="courseObj.query.is_public"
          :options="[{ id: '', name_label: c.all || 'Tất cả' }, { id: '1', name_label: l.public || 'Công khai' }, { id: '0', name_label: l.private || 'Riêng tư' }]"
          :placeholder="'Tất cả'"
          label-key="name_label"
          icon-class="el-icon-view"
          @update:modelValue="
            courseObj.query.is_public = $event
            getCourseList()
          " />

        <button class="px-4 py-2 bg-[#F2F2F2] text-[#0D0D0D] font-medium text-sm uppercase rounded-sm hover:bg-[#E5E5E5] transition-colors" @click="getCourseList">
          {{ l.search }}
        </button>
      </div>
    </div>

    <!-- Content List -->
    <div class="flex-1 overflow-y-scroll overflow-x-hidden flex flex-col">
      <!-- List Header -->
      <div class="grid grid-cols-[50px_120px_2fr_2fr_1fr_1fr_100px_100px_120px_150px] gap-4 px-6 py-2 border-b border-[#E5E5E5] text-xs font-medium text-[#606060] bg-white sticky top-0 z-10">
        <div>{{ c.ordinal || 'No' }}</div>
        <div>{{ l.cover }}</div>
        <div>{{ l.title }}</div>
        <div>{{ l.desc }}</div>
        <div>{{ l.courseCatalog }}</div>
        <div>{{ l.belongCollege }}</div>
        <div>{{ l.score }}</div>
        <div>{{ l.lecturer }}</div>
        <div>{{ l.courseType }}</div>
        <div class="text-right">{{ c.operation }}</div>
      </div>

      <!-- List Body -->
      <div class="flex-1 bg-white flex flex-col min-h-0">
        <div v-if="courseObj.list.length === 0" class="flex flex-col items-center justify-center py-20 flex-1">
          <div class="w-32 h-32 bg-[#F9F9F9] rounded-full flex items-center justify-center mb-4">
            <i class="el-icon-notebook-2 text-4xl text-[#CCCCCC]"></i>
          </div>
          <p class="text-[#0D0D0D]">{{ c.noData }}</p>
        </div>
        <div v-else class="flex-1 flex flex-col">
          <div class="divide-y divide-[#E5E5E5]">
            <div v-for="(record, index) in courseObj.list" :key="record.id" class="grid grid-cols-[50px_120px_2fr_2fr_1fr_1fr_100px_100px_120px_150px] gap-4 px-6 py-3 hover:bg-[#F9F9F9] group items-start transition-colors relative">
              <div class="text-sm text-[#606060] pt-2">{{ (courseObj.query.page - 1) * courseObj.query.pageSize + index + 1 }}</div>

              <!-- Cover -->
              <div class="w-[120px] h-[68px] bg-[#E5E5E5] shrink-0 cursor-pointer overflow-hidden rounded-sm relative group/thumb" @click="coverPreview($api.videoServer + '/' + record.thumbnail_path)">
                <img v-if="record.thumbnail_path && !imageErrors[record.id]" :src="$api.videoServer + '/' + record.thumbnail_path" class="w-full h-full object-cover" @error="handleImageError(record.id)" />
                <div v-else class="w-full h-full flex items-center justify-center text-[#999999]">
                  <i class="el-icon-picture-outline text-2xl"></i>
                </div>
                <div class="absolute bottom-1 right-1 bg-black/80 text-white! text-[10px] font-medium px-1 rounded-sm">{{ formatDuration(record.duration) }}</div>
              </div>

              <!-- Title -->
              <div class="text-sm text-[#0D0D0D] font-medium pt-2 line-clamp-2" :title="record.name_label">{{ record.name_label }}</div>

              <!-- Desc -->
              <div class="text-sm text-[#606060] pt-2 line-clamp-2" :title="record.description">{{ record.description }}</div>

              <!-- Catalog -->
              <div class="text-sm text-[#606060] pt-2">{{ returnPublicObjLabel(record.type, 'value', 'label', 'courseCatalog') }}</div>

              <!-- College -->
              <div class="text-sm text-[#606060] pt-2">{{ returnPublicObjLabel(record.college_id, 'id', 'name_label', 'allCollegeList') }}</div>

              <!-- Score -->
              <div class="text-sm text-[#606060] pt-2">{{ record.score }}</div>

              <!-- Lecturer -->
              <div class="text-sm text-[#606060] pt-2">{{ record.lecturer == 1 ? l.externalLecturer : l.internalLecturer }}</div>

              <!-- Type -->
              <div class="pt-2">
                <span :class="['inline-flex items-center gap-1 text-sm', record.is_public == 1 ? 'text-[#069C56]' : 'text-[#606060]']">
                  <i :class="record.is_public == 1 ? 'el-icon-view' : 'el-icon-lock'"></i>
                  {{ record.is_public == 1 ? l.public : l.private }}
                </span>
              </div>

              <!-- Action -->
              <div class="text-right pt-2 flex flex-col gap-1 items-end">
                <button class="text-[#065FD4] font-medium hover:underline text-sm uppercase" @click="handleManageCourse(record)">
                  {{ rightCheck(record) ? l.manage : l.check }}
                </button>
                <button v-if="rightCheck(record)" class="text-sm font-medium hover:underline uppercase" :class="record.is_valid == 'N' ? 'text-[#069C56]' : 'text-[#CC0000]'" @click="modifyCourseStatus(record)">
                  {{ record.is_valid == 'N' ? c.enable : c.disable }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination Footer -->
    <div class="flex justify-end p-4 border-t border-[#E5E5E5] bg-white text-xs text-[#606060]">
      <Pagination
        :page="courseObj.query.page"
        :pageSize="courseObj.query.pageSize"
        :total="courseObj.total"
        :l="c"
        @update:page="handlePageChange"
        @update:pageSize="handleSizeChange"
         />
    </div>

    <!-- Drawers & Modals -->

    <!-- Add/Modify Course Drawer -->
    <a-drawer :visible="showObj.addOrModifyCourse" :title="l.manageCourse" width="960" @close="showObj.addOrModifyCourse = false" :body-style="{ padding: 0 }">
      <div class="flex flex-col bg-white font-roboto absolute top-[55px] left-0 right-0 bottom-0">
        <!-- Tabs Header -->
        <div class="border-b border-[#E5E5E5] px-6">
          <div class="flex gap-8">
            <button v-for="tab in ['data', 'video', 'exam', 'attachment']" :key="tab" class="py-4 border-b-2 font-medium text-sm transition-colors uppercase" :class="showObj.activeTabName === tab ? 'border-[#065FD4] text-[#065FD4]' : 'border-transparent text-[#606060] hover:text-[#0D0D0D]'" @click="tabClick({ name: tab })">
              {{ tab === 'data' ? l.basicalInfo : tab === 'video' ? l.courseVideo : tab === 'exam' ? l.courseExam : l.courseAttachments }}
            </button>
          </div>
        </div>

        <!-- Content Area -->
        <div class="flex-1 overflow-y-auto custom-scrollbar bg-[#F9F9F9]">
          <!-- Basic Info Tab -->
          <div v-if="showObj.activeTabName === 'data'" class="bg-white p-6 rounded">
            <h3 class="text-lg font-medium text-[#0D0D0D] mb-6">Course Details</h3>

            <!-- Cover Image -->
            <div class="mb-8">
              <h4 class="text-sm font-medium text-[#0D0D0D] mb-2">{{ l.cover }}</h4>
              <div class="flex gap-4">
                <div class="w-40 aspect-video border border-dashed border-[#CCCCCC] rounded cursor-pointer flex flex-col items-center justify-center hover:border-[#606060] hover:bg-[#F9F9F9] transition-all relative overflow-hidden group" @click="coverSelect">
                  <img v-if="coverObj.imageUrl" :src="coverObj.imageUrl" class="w-full h-full object-cover" />
                  <img v-else-if="courseObj.newForm.thumbnail_path && !imageErrors['cover_' + courseObj.newForm.id]" :src="$api.videoServer + '/' + courseObj.newForm.thumbnail_path" class="w-full h-full object-cover" @error="handleImageError('cover_' + courseObj.newForm.id)" />
                  <div v-else class="flex flex-col items-center">
                    <i class="el-icon-upload text-2xl text-[#606060] mb-1"></i>
                    <span class="text-xs text-[#606060]">{{ l.chooseCover }}</span>
                  </div>
                  <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white! text-xs">
                    {{ l.change || 'Change' }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Form Grid -->
            <div class="grid grid-cols-2 gap-6">
              <!-- College -->
              <div class="group">
                <label class="block text-xs font-medium text-[#606060] mb-1">
                  {{ l.belongCollege }}
                  <span class="text-red-500">*</span>
                </label>
                <select v-model="courseObj.newForm.college_id" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]">
                  <option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</option>
                </select>
              </div>

              <!-- Course Type -->
              <div class="group">
                <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.courseType }}</label>
                <div class="flex items-center gap-4 h-[38px]">
                  <a-switch :checked="courseObj.newForm.is_public === 1" @change="(val) => (courseObj.newForm.is_public = val ? 1 : 0)">
                    <template #checkedChildren>{{ l.public }}</template>
                    <template #unCheckedChildren>{{ l.private }}</template>
                  </a-switch>
                </div>
              </div>

              <!-- Names -->
              <div class="col-span-2 grid grid-cols-4 gap-4">
                <div v-for="lang in ['zh', 'tw', 'en', 'vi']" :key="lang">
                  <label class="block text-xs font-medium text-[#606060] mb-1">
                    Name ({{ lang.toUpperCase() }})
                    <span v-if="lang == 'zh'" class="text-red-500">*</span>
                  </label>
                  <input v-model="courseObj.newForm['name_' + lang]" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]" />
                </div>
              </div>

              <!-- Catalog, Lecturer, Language -->
              <div>
                <label class="block text-xs font-medium text-[#606060] mb-1">
                  {{ l.courseCatalog }}
                  <span class="text-red-500">*</span>
                </label>
                <select v-model="courseObj.newForm.type" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]">
                  <option v-for="i in publicCodeObj.courseCatalog" :key="i.value" :value="i.value">{{ i.label }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-[#606060] mb-1">
                  {{ l.lecturer }}
                  <span class="text-red-500">*</span>
                </label>
                <select v-model="courseObj.newForm.lecturer" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]">
                  <option v-for="i in publicCodeObj.lecturer_status" :key="i.value" :value="i.value">{{ i.label }}</option>
                </select>
              </div>
              <div>
                <label class="block text-xs font-medium text-[#606060] mb-1">
                  {{ l.trainLanguage }}
                  <span class="text-red-500">*</span>
                </label>
                <select v-model="courseObj.newForm.language" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]">
                  <option v-for="i in publicCodeObj.language_type" :key="i.value" :value="i.value">{{ i.label }}</option>
                </select>
              </div>

              <!-- Group & Profit -->
              <div>
                <label class="block text-xs font-medium text-[#606060] mb-1">
                  {{ l.applicableGroup }}
                  <span class="text-red-500">*</span>
                </label>
                <input v-model="courseObj.newForm.applicable_group" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]" />
              </div>
              <div>
                <label class="block text-xs font-medium text-[#606060] mb-1">
                  {{ l.profit }}
                  <span class="text-red-500">*</span>
                </label>
                <input v-model="courseObj.newForm.profit" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]" />
              </div>

              <!-- Tags -->
              <div class="col-span-2">
                <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.tag }}</label>
                <a-popover placement="bottom" trigger="click" :width="500">
                  <template #content>
                    <div class="w-[400px]">
                      <div class="mb-2 font-medium text-xs text-[#606060]">{{ l.tagPd }}</div>
                      <div class="flex flex-wrap gap-2">
                        <span v-for="(i, index) in tagObj.list" :key="index" class="px-2 py-1 text-xs border rounded cursor-pointer transition-colors" :class="selectedTags.includes(i) ? 'bg-[#E5F6FD] border-[#065FD4] text-[#065FD4]' : 'bg-white border-[#CCCCCC] hover:bg-[#F9F9F9]'" @click="selectTag(i)">
                          {{ i.name_label }}
                        </span>
                      </div>
                    </div>
                  </template>
                  <div class="w-full min-h-[38px] p-2 bg-white border border-[#CCCCCC] rounded text-sm cursor-pointer flex flex-wrap gap-2 items-center">
                    <span v-for="(i, index) in selectedTags" :key="index" class="bg-[#E5F6FD] text-[#065FD4] px-2 py-0.5 rounded text-xs flex items-center gap-1">
                      {{ i.name_label }}
                      <i class="el-icon-close cursor-pointer hover:text-[#0551B4]" @click.stop="selectTag(i)"></i>
                    </span>
                    <span v-if="selectedTags.length === 0" class="text-[#999999]">{{ l.chooseTagPd }}</span>
                  </div>
                </a-popover>
              </div>

              <!-- Description -->
              <div class="col-span-2">
                <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.desc }}</label>
                <textarea v-model="courseObj.newForm.description" rows="4" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4] resize-none!"></textarea>
              </div>
            </div>
          </div>

          <!-- Video Tab -->
          <div v-if="showObj.activeTabName === 'video'" class="bg-white rounded border border-[#E5E5E5] flex flex-col h-full">
            <div class="p-4 border-b border-[#E5E5E5] flex justify-end gap-2">
              <button class="px-3 py-1.5 bg-[#065FD4] text-white! text-xs font-medium rounded uppercase shadow-sm hover:bg-[#0551B4] transition-colors" @click="showObj.selectVideo = true">{{ l.addVideo }}</button>
              <button class="px-3 py-1.5 bg-[#CC0000] text-white! text-xs font-medium rounded uppercase shadow-sm hover:bg-[#990000] transition-colors" @click="removeMultipleVideo">{{ l.multipleRemove }}</button>
            </div>
            <div class="flex-1 overflow-auto">
              <a-table class="draggable-table-video" :dataSource="manageObj.selectedVideoList" row-key="id" :pagination="false" :row-selection="{ selectedRowKeys: videoSelectedRowKeys, onChange: videoSelectionChange }">
                <a-table-column :title="l.cover">
                  <template slot-scope="text, record">
                    <div v-if="record">
                      <img v-if="record.thumbnail_path && !imageErrors['vid_' + record.id]" :src="$api.videoServer + '/' + record.thumbnail_path" class="w-20 h-12 object-cover bg-[#E5E5E5] rounded-sm" @error="handleImageError('vid_' + record.id)" />
                      <div v-else class="w-20 h-12 bg-[#E5E5E5] rounded-sm flex items-center justify-center text-[#999999]"><i class="el-icon-picture-outline"></i></div>
                    </div>
                  </template>
                </a-table-column>
                <a-table-column :title="l.title" dataIndex="title"></a-table-column>
                <a-table-column :title="l.duration">
                  <template #default="{ text }">{{ formatDuration(text, true) }}</template>
                </a-table-column>
                <a-table-column :title="l.playQuestion">
                  <template #default="{ record }">
                    <div class="flex items-center gap-2">
                      <a-switch :checked="record.is_process_question" @change="(val) => (record.is_process_question = val)" size="small" />
                      <button v-if="record.is_process_question" class="text-[#065FD4] text-xs hover:underline" @click="openProcessQuestion(record)">{{ l.playQuestionManage }}</button>
                    </div>
                  </template>
                </a-table-column>
                <a-table-column :title="c.operation" width="100">
                  <template #default="{ index }">
                    <button class="text-[#CC0000] text-xs hover:underline" @click="removeVideo(index)">{{ l.remove }}</button>
                  </template>
                </a-table-column>
              </a-table>
            </div>
          </div>

          <!-- Exam Tab -->
          <div v-if="showObj.activeTabName === 'exam'" class="bg-white rounded border border-[#E5E5E5] flex flex-col h-full">
            <div class="p-4 border-b border-[#E5E5E5] flex justify-end gap-2">
              <button class="px-3 py-1.5 bg-[#065FD4] text-white! text-xs font-medium rounded uppercase shadow-sm hover:bg-[#0551B4] transition-colors" @click="showObj.selectExam = true">{{ l.addExam }}</button>
              <button class="px-3 py-1.5 bg-[#CC0000] text-white! text-xs font-medium rounded uppercase shadow-sm hover:bg-[#990000] transition-colors" @click="removeMultipleExam">{{ l.multipleRemove }}</button>
            </div>
            <div class="flex-1 overflow-auto">
              <a-table class="draggable-table-exam" :dataSource="manageObj.selectedExamList" row-key="id" :pagination="false" :row-selection="{ selectedRowKeys: examSelectedRowKeys, onChange: examSelectionChange }">
                <a-table-column :title="l.title" dataIndex="name_label"></a-table-column>
                <a-table-column :title="l.passScore" dataIndex="pass_score"></a-table-column>
                <a-table-column :title="l.examDuration" dataIndex="test_duration"></a-table-column>
                <a-table-column :title="c.operation" width="150">
                  <template #default="{ record, index }">
                    <div class="flex gap-2">
                      <button class="text-[#069C56] text-xs hover:underline" @click="previewExam(record)">{{ l.preview }}</button>
                      <button class="text-[#CC0000] text-xs hover:underline" @click="removeExam(index)">{{ l.remove }}</button>
                    </div>
                  </template>
                </a-table-column>
              </a-table>
            </div>
          </div>

          <!-- Attachment Tab -->
          <div v-if="showObj.activeTabName === 'attachment'" class="bg-white rounded border border-[#E5E5E5] flex flex-col h-full">
            <div class="p-4 border-b border-[#E5E5E5] flex justify-end gap-2">
              <button class="px-3 py-1.5 bg-orange-500 text-xs font-medium rounded uppercase shadow-sm hover:bg-orange-600 text-white! transition-colors" @click="attachmentWarning">{{ l.importantNotice }}</button>
              <button class="px-3 py-1.5 bg-[#065FD4] text-white! text-xs font-medium rounded uppercase shadow-sm hover:bg-[#0551B4] transition-colors disabled:opacity-50" :disabled="courseObj.newForm.id == ''" @click="attachmentSelect">{{ l.addAttachment }}</button>
              <button class="px-3 py-1.5 bg-[#CC0000] text-white! text-xs font-medium rounded uppercase shadow-sm hover:bg-[#990000] transition-colors disabled:opacity-50" :disabled="courseObj.newForm.id == ''" @click="removeMultipleAttachment">{{ l.batchRemove }}</button>
            </div>
            <div class="flex-1 overflow-auto">
              <a-table :dataSource="manageObj.attachmentsList" row-key="id" :pagination="false" :row-selection="{ selectedRowKeys: attachmentSelectedRowKeys, onChange: attachmentSelectionChange }">
                <a-table-column :title="l.simplifiedChineseName" dataIndex="name_zh"></a-table-column>
                <a-table-column :title="l.fileType" dataIndex="file_type" :width="120" :ellipsis="true"></a-table-column>
                <a-table-column :title="l.fileSize">
                  <template #default="{ text }">{{ formatBytes(text) }}</template>
                </a-table-column>
                <a-table-column :title="l.operations" width="150">
                  <template #default="{ record, index }">
                    <div class="flex gap-2">
                      <button class="text-[#069C56] text-xs hover:underline" @click="previewFile(record.file_url)">{{ l.preview }}</button>
                      <button class="text-[#CC0000] text-xs hover:underline" @click="removeAttachment(index)">{{ l.remove }}</button>
                    </div>
                  </template>
                </a-table-column>
              </a-table>
            </div>
          </div>
        </div>

        <!-- Footer Buttons -->
        <div class="p-4 border-t border-[#E5E5E5] bg-white flex justify-end gap-2">
          <button class="px-4 py-2 text-[#606060] font-medium text-sm hover:bg-[#F2F2F2] rounded-sm transition-colors" @click="showObj.addOrModifyCourse = false">{{ l.giveup }}</button>
          <button class="px-6 py-2 bg-[#065FD4] text-white! font-medium text-sm uppercase rounded-sm shadow-sm hover:bg-[#0551B4] transition-colors" @click="handleSubmit">{{ l.submit }}</button>
        </div>
      </div>
    </a-drawer>

    <!-- Other Modals (Select Video, Select Exam, etc.) -->
    <!-- Select Video Modal -->
    <a-modal v-model:open="showObj.selectVideo" :title="l.addVideo" width="800px" @ok="selectMultipleVideo" @cancel="showObj.selectVideo = false" :ok-text="l.multipleAdd" :cancel-text="c.cancel">
      <div class="flex flex-col h-[500px]">
        <div class="flex gap-4 mb-4">
          <select v-model="videoListObj.query.college_id" class="w-40 px-2 py-1 border rounded text-sm">
            <option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</option>
          </select>
          <input v-model="videoListObj.query.title" class="flex-1 px-2 py-1 border rounded text-sm" :placeholder="l.title" @keyup.enter="getCourseList" />
          <button class="px-4 py-1 bg-[#065FD4] text-white! rounded text-sm" @click="getCourseList">{{ l.search }}</button>
        </div>
        <div class="flex-1 overflow-auto">
          <a-table :dataSource="videoListObj.list" row-key="id" :pagination="false" :row-selection="{ selectedRowKeys: videoSelectedRowKeys, onChange: videoSelectionChange }">
            <a-table-column :title="l.cover">
              <template slot-scope="text, record">
                <div v-if="record">
                  <img v-if="record.thumbnail_path && !imageErrors['sel_vid_' + record.id]" :src="$api.videoServer + '/' + record.thumbnail_path" class="w-16 h-10 object-cover" @error="handleImageError('sel_vid_' + record.id)" />
                  <div v-else class="w-16 h-10 bg-[#E5E5E5] flex items-center justify-center text-[#999999]"><i class="el-icon-picture-outline"></i></div>
                </div>
              </template>
            </a-table-column>
            <a-table-column :title="l.title" dataIndex="title"></a-table-column>
            <a-table-column :title="l.duration">
              <template #default="{ text }">{{ formatDuration(text, true) }}</template>
            </a-table-column>
          </a-table>
        </div>
        <div class="mt-4 flex justify-end">
          <a-pagination v-model:current="videoListObj.query.page" :total="videoListObj.total" :page-size="videoListObj.query.pageSize" show-less-items @change="getVideoList" />
        </div>
      </div>
    </a-modal>

    <!-- Select Exam Modal -->
    <a-modal v-model="showObj.selectExam" :title="l.addExam" width="800px" @ok="selectMultipleExam" @cancel="showObj.selectExam = false" :ok-text="l.multipleAdd" :cancel-text="c.cancel" @after-open="getCourseList">
      <div class="flex flex-col h-[500px]">
        <div class="flex gap-4 mb-4">
          <input v-model="examObj.query.name" class="flex-1 px-2 py-1 border rounded text-sm" :placeholder="l.title" @keyup.enter="getExamList" />
          <select v-model="examObj.query.is_valid" class="w-40 px-2 py-1 border rounded text-sm">
            <option value="">{{ c.all }}</option>
            <option value="Y">{{ c.enable }}</option>
            <option value="N">{{ c.disable }}</option>
          </select>
          <button class="px-4 py-1 bg-[#065FD4] text-white! rounded text-sm" @click="getExamList">{{ l.search }}</button>
        </div>
        <div class="flex-1 overflow-auto">
          <a-table :dataSource="examObj.list" row-key="id" :pagination="false" :row-selection="{ selectedRowKeys: examSelectedRowKeys, onChange: examSelectionChange }">
            <a-table-column :title="l.title" dataIndex="name_label"></a-table-column>
            <a-table-column :title="l.passScore" dataIndex="pass_score"></a-table-column>
            <a-table-column :title="l.examDuration" dataIndex="test_duration"></a-table-column>
          </a-table>
        </div>
        <div class="mt-4 flex justify-end">
          <a-pagination v-model:current="examObj.query.page" :total="examObj.total" :page-size="examObj.query.pageSize" show-less-items @change="getExamList" />
        </div>
      </div>
    </a-modal>

    <!-- Confirm Dialog Modal -->
    <div v-if="showObj.confirmShow" class="fixed inset-0 z-50 flex items-center justify-center font-roboto">
      <div class="fixed inset-0 bg-black/50" @click="handleConfirmCancel"></div>
      <div class="relative bg-white rounded shadow-xl p-6 max-w-sm w-full mx-4 border border-[#E5E5E5]">
        <h3 class="text-lg font-medium text-[#0D0D0D] mb-4">{{ showObj.confirmData.title }}</h3>
        <p class="text-[#606060] mb-6 text-sm">{{ showObj.confirmData.message }}</p>
        <div class="flex justify-end gap-2">
          <button @click="handleConfirmCancel" class="px-4 py-2 text-[#0D0D0D] font-medium text-sm hover:bg-[#F2F2F2] rounded-sm transition-colors">
            {{ l.giveup || 'Cancel' }}
          </button>
          <button @click="handleConfirmOk" class="px-4 py-2 bg-[#065FD4] text-white! font-medium text-sm rounded-sm hover:bg-[#0551B4] transition-colors shadow-sm">
            {{ l.submit || 'OK' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Other helper components -->
    <FilePreviews :file-url="showObj.fileUrl" :visible="showObj.filePreviews" @update:visible="showObj.filePreviews = $event" />
    <input ref="attachmentInput" type="file" @change="uploadattAchmentChange" style="display: none" />
    <input ref="coverInput" type="file" @change="uploadCoverChange" style="display: none" accept="image/*" />
    <a-modal v-model="showObj.coverDialog" :title="l.preview" :footer="null" :width="600">
      <img width="100%" :src="coverObj.dialogImageUrl" alt="" />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount, getCurrentInstance, nextTick } from 'vue'
import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query'
import Sortable from 'sortablejs'
import api from '@/api'
import store from '@/store'
import { useLocalI18n } from '@/composables/useLocalI18n'
import videoPlayer from '@/components/videoPlayer/VideoPlayerPlyr.vue'
import FilePreviews from '@/views/_common/FilePreviews.vue'
import Pagination from '../common/Pagination.vue'
import Dropdown from '../common/Dropdown.vue'

// Instance and global properties
const instance = getCurrentInstance()
const route = instance.proxy.$route
const router = instance.proxy.$router
const { $request, $message, $notify, $alert, $prompt } = instance.proxy
const { l, c } = useLocalI18n('videoAdminCourse')
const queryClient = useQueryClient()

// Refs
const multipleTable = ref(null)
const tableContainer = ref(null)
const coverInput = ref(null)
const attachmentInput = ref(null)
const videoPlayerRef = ref(null)
const questionTable = ref(null)
const questionDialogTable = ref(null)
const videoDialogTable = ref(null)
const examDialogTable = ref(null)
const videoListTable = ref(null)
const examListTable = ref(null)
const attachmentsListTable = ref(null)
const tagInput = ref(null)

// Computed
const isAdmin = computed(() => store.getters.isAdmin)

// Reactive data
const selectedRowKeys = ref([])
const questionSelectedRowKeys = ref([])
const videoSelectedRowKeys = ref([])
const examSelectedRowKeys = ref([])
const attachmentSelectedRowKeys = ref([])

const initSortableObj = reactive({
  video: false,
  exam: false
})

const videoListObj = reactive({
  query: {
    is_public: "",
    college_id: "",
    title: "",
    page: 1,
    pageSize: 15
  },
  total: 0,
  list: []
})

const questionObj = reactive({
  video_id: '',
  query: {
    name: '',
    question_status: '',
    question_type: '',
    question_category_id: '',
    id: ''
  },
  list: []
})

const examObj = reactive({
  query: {
    name: "",
    is_valid: "",
    page: 1,
    pageSize: 12
  },
  total: 0,
  list: []
})

const manageObj = reactive({
  currentPrimaryId: '',
  videoList: [],
  videoSelection: [],
  examList: [],
  examSelection: [],
  selectedVideoList: [],
  selectedExamList: [],
  questionList: [],
  questionSelection: [],
  attachmentsList: [],
  attachmentSelection: []
})

const showObj = reactive({
  videoUrl: '',
  activeTabName: 'data',
  addOrModifyCourse: false,
  coverDialog: false,
  selectVideo: false,
  selectExam: false,
  processQuestion: false,
  selectQuestion: false,
  attachment: false,
  filePreviews: false,
  fileUrl: "",
  confirmShow: false,
  confirmData: { title: '', message: '', callback: null }
})

const catalogObj = reactive({
  cascaderProps: {
    expandTrigger: 'hover',
    checkStrictly: true,
    emitPath: false,
    value: 'id',
    label: 'name_label'
  },
  data: [],
  query: {
    org_id: ''
  }
})

const coverObj = reactive({
  dialogImageUrl: "",
  imageUrl: "",
  file: {
    name: ''
  }
})

const attachmentObj = reactive({
  id: '',
  file_name_zh: '',
  file_name_tw: '',
  file_name_en: '',
  file_name_vi: '',
  file: ''
})

const cssObj = reactive({
  tableMaxHeight: '400px',
  popoverWidth: "600px",
  headerRowStyle: {
    background: '#f2f4f9',
    color: '#505050',
    fontSize: '14px',
    height: '50px'
  }
})

const selectedTags = ref([])

const tagObj = reactive({
  query: {
    page: 1,
    pageSize: 9999,
    name: ""
  },
  list: [],
  total: 0
})

const courseObj = reactive({
  newForm: {
    id: "",
    type: '',
    name_zh: "",
    name_tw: "",
    name_en: "",
    name_vi: "",
    description: "",
    college_id: '',
    is_public: "",
    org_id: "",
    thumbnail_path: "",
    score: "",
    applicable_group: "",
    profit: "",
    lecturer: "",
    language: "",
    tag_ids: [],
    video_exam_list: []
  },
  query: {
    search_type: 1,
    college_id: '',
    is_public: '',
    catalog_id: "",
    name: "",
    description: "",
    tag_id: [],
    page: 1,
    pageSize: 10,
    is_valid: '',
    is_his: 0
  },
  total: 0,
  list: [],
  multipleSelection: []
})

const publicCodeObj = reactive({
  allCollegeList: [],
  collegeList: [],
  org_id: [],
  language_type: [],
  courseCatalog: [],
  question_type: [
    { label: l.value.fillIn, value: 0 },
    { label: l.value.singleChoice, value: 1 },
    { label: l.value.multipleChoice, value: 2 },
    { label: l.value.judge, value: 3 }
  ],
  question_status: [
    { label: l.value.published, value: 0 },
    { label: l.value.unpublished, value: 1 }
  ],
  lecturer_status: [
    { label: l.value.externalLecturer, value: 0 },
    { label: l.value.internalLecturer, value: 1 }
  ]
})

// TanStack Query - Get Course List
const { data: courseData, refetch: refetchCourseList } = useQuery({
  queryKey: ['courseList', courseObj.query],
  queryFn: async () => {
    const response = await $request(
      api.videoServer + '/Video/VideoCourseCatalog/getCourseList',
      courseObj.query,
      'post'
    )
    return response.data
  },
  onSuccess: (data) => {
    courseObj.list = data.list
    courseObj.total = data.total
    showObj.addOrModifyCourse = false
  },
  enabled: false
})

// TanStack Query - Get Video List
const { refetch: refetchVideoList } = useQuery({
  queryKey: ['videoList', videoListObj.query],
  queryFn: async () => {
    const response = await $request(
      api.videoServer + '/Video/VideoManage/getVideoList',
      videoListObj.query
    )
    return response.data
  },
  onSuccess: (data) => {
    videoListObj.list = data.list
    videoListObj.total = data.total
  },
  enabled: false
})

// TanStack Query - Get Exam List
const { refetch: refetchExamList } = useQuery({
  queryKey: ['examList', examObj.query],
  queryFn: async () => {
    const response = await $request(
      api.videoServer + '/Video/VideoExam/getExamList',
      examObj.query
    )
    return response.data
  },
  onSuccess: (data) => {
    examObj.list = data.list
    examObj.total = data.total
  },
  enabled: false
})

// TanStack Query - Get Question List
const { refetch: refetchQuestionList } = useQuery({
  queryKey: ['questionList', questionObj.query],
  queryFn: async () => {
    const response = await $request(
      api.videoServer + '/Video/VideoExam/getQuestionList',
      questionObj.query
    )
    return response.data
  },
  onSuccess: (data) => {
    questionObj.list = data.list
    showObj.selectQuestion = true
  },
  enabled: false
})

// TanStack Query - Get Tag List
const { refetch: refetchTagList } = useQuery({
  queryKey: ['tagList', tagObj.query],
  queryFn: async () => {
    const response = await $request(
      api.videoServer + '/Video/VideoTag/getList',
      tagObj.query
    )
    return response.data
  },
  onSuccess: (data) => {
    if (data.list) {
      tagObj.list = data.list
      tagObj.total = data.total
    }
  },
  enabled: false
})

// TanStack Query - Get All College List
const { refetch: refetchAllCollegeList } = useQuery({
  queryKey: ['allCollegeList'],
  queryFn: async () => {
    const response = await $request(
      api.videoServer + '/Video/VideoCollege/getCollegeList',
      { page: 1, pageSize: 9999 }
    )
    return response.data
  },
  onSuccess: (data) => {
    publicCodeObj.allCollegeList = data.list
  }
})

// TanStack Query - Get College List by Path
const { refetch: refetchCollegeList } = useQuery({
  queryKey: ['collegeListByPath', route.path],
  queryFn: async () => {
    const response = await $request(
      api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath',
      { resource_path: route.path }
    )
    return response.data
  },
  onSuccess: (data) => {
    publicCodeObj.collegeList = data
    courseObj.query.college_id = publicCodeObj.collegeList[0].id
    videoListObj.query.college_id = publicCodeObj.collegeList[0].id
    getCourseList()
  },
  onError: (error) => {
    $message.error(error.message)
  }
})

// TanStack Query - Get Attachments
const getAttachmentsMutation = useMutation({
  mutationFn: async (id) => {
    const response = await $request(
      api.videoServer + '/Video/VideoCourseCatalog/GetCourseAttachemnts',
      { course_primary_id: id, page: 1, pageSize: 9999 }
    )
    return response.data
  },
  onSuccess: (data) => {
    manageObj.attachmentsList = data.list || []
  }
})

// TanStack Query - Upload Attachment
const uploadAttachmentMutation = useMutation({
  mutationFn: async (formData) => {
    const response = await $request(
      api.videoServer + '/Video/VideoCourseCatalog/uploadAttachment',
      formData,
      'post'
    )
    return response.data
  },
  onSuccess: (data) => {
    if (data.id) {
      manageObj.attachmentsList.push({
        id: data.id,
        file_name_zh: attachmentObj.file_name_zh,
        file_name_tw: attachmentObj.file_name_tw,
        file_name_en: attachmentObj.file_name_en,
        file_name_vi: attachmentObj.file_name_vi,
        url: data.url,
        file_size: data.file_size
      })
      $message.success(l.value.operateSuccess)
      showObj.attachment = false
      attachmentObj.id = ''
      attachmentObj.file_name_zh = ''
      attachmentObj.file_name_tw = ''
      attachmentObj.file_name_en = ''
      attachmentObj.file_name_vi = ''
      attachmentObj.file = ''
    }
  }
})

// TanStack Query - Upload Cover
const uploadCoverMutation = useMutation({
  mutationFn: async (formData) => {
    const response = await $request(
      api.videoServer + '/Video/VideoManage/uploadPicture',
      formData,
      'post'
    )
    return response.data
  },
  onSuccess: (data) => {
    if (data.url) {
      courseObj.newForm.thumbnail_path = data.url
      submitCourse()
    }
  }
})

// TanStack Query - Submit Course
const submitCourseMutation = useMutation({
  mutationFn: async (postData) => {
    const response = await $request(
      api.videoServer + '/Video/VideoCourseCatalog/addOrModifyCourse',
      postData,
      'post'
    )
    return response.data
  },
  onSuccess: () => {
    $message.success(l.value.operateSuccess)
    getCourseList()
    showObj.addOrModifyCourse = false
  }
})

// TanStack Query - Modify Course Status
const modifyCourseStatusMutation = useMutation({
  mutationFn: async ({ id, is_valid }) => {
    const response = await $request(
      api.videoServer + '/Video/VideoCourseCatalog/modifyCourseStatus',
      { id, is_valid },
      'post'
    )
    return response.data
  },
  onSuccess: () => {
    $message.success(l.value.operateSuccess)
    getCourseList()
  }
})

// TanStack Query - Submit Process Question
const submitProcessQuestionMutation = useMutation({
  mutationFn: async (postData) => {
    const response = await $request(
      api.videoServer + '/Video/VideoProcessQuestion/addQestionToVideo',
      postData,
      'post'
    )
    return response.data
  },
  onSuccess: () => {
    $message.success(l.value.operateSuccess)
    videoClose()
  }
})

// TanStack Query - Get Binding Question By Id
const getBindingQuestionByIdMutation = useMutation({
  mutationFn: async (id) => {
    const response = await $request(
      api.videoServer + '/Video/VideoProcessQuestion/getList',
      { video_id: id }
    )
    return response.data
  },
  onSuccess: (data) => {
    if (data.length > 0) {
      manageObj.questionList = data.map(item => ({
        ...item,
        text: item.name_label
      }))
    } else {
      manageObj.questionList = []
    }
    showObj.processQuestion = true
  }
})

// TanStack Query - Get Course Video and Exam
const getCourseVideoAndExamMutation = useMutation({
  mutationFn: async (courseId) => {
    const response = await $request(
      api.videoServer + '/Video/VideoCourseCatalog/getCourseVideoAndExam?course_id=' + courseId
    )
    return response.data
  },
  onSuccess: (data) => {
    manageObj.selectedVideoList = []
    manageObj.selectedExamList = []
    if (data.length > 0) {
      data.forEach(i => {
        if (i.type == 1) {
          manageObj.selectedVideoList.push(i)
        } else if (i.type == 0) {
          manageObj.selectedExamList.push(i)
        }
      })
    }
    showObj.addOrModifyCourse = true
  }
})

// Methods
const previewFile = (url) => {
  showObj.fileUrl = api.videoServer + '/' + url
  showObj.filePreviews = true
}

const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const attachmentWarning = () => {
  $alert(l.value.attachmentWarningMessage)
}

const getAttachments = (id) => {
  manageObj.attachmentsList = []
  getAttachmentsMutation.mutate(id)
}

const attachmentSelect = () => {
  attachmentInput.value.click()
}

const attachmentSelectionChange = (val) => {
  manageObj.attachmentSelection = val
}

const uploadattAchmentChange = (e) => {
  const file = e.target.files[0]
  attachmentObj.file = file
  attachmentObj.file_name_zh = file.name
  showObj.attachment = true
}

const uploadAttachment = () => {
  const formData = new FormData()
  formData.append('id', attachmentObj.id)
  formData.append('file_name_zh', attachmentObj.file_name_zh)
  formData.append('file_name_tw', attachmentObj.file_name_tw)
  formData.append('file_name_en', attachmentObj.file_name_en)
  formData.append('file_name_vi', attachmentObj.file_name_vi)
  formData.append('file', attachmentObj.file)
  uploadAttachmentMutation.mutate(formData)
}

const removeAttachment = (i) => {
  manageObj.attachmentsList.splice(i, 1)
}

const removeMultipleAttachment = () => {
  const idsToDelete = manageObj.attachmentSelection.map(item => item.id)
  manageObj.attachmentsList = manageObj.attachmentsList.filter(item => !idsToDelete.includes(item.id))
  attachmentsListTable.value.clearSelection()
}

const tabClick = (key) => {
  if (key == 'video') {
    if (initSortableObj.video == false) {
      const tbodyVideo = document.querySelector(".draggable-table-video .ant-table-tbody")
      new Sortable(tbodyVideo, {
        animation: 150,
        onEnd({ newIndex, oldIndex }) {
          const currRow = manageObj.selectedVideoList.splice(oldIndex, 1)[0]
          manageObj.selectedVideoList.splice(newIndex, 0, currRow)
        }
      })
      initSortableObj.video = true
    }
  } else if (key == 'exam') {
    if (initSortableObj.exam == false) {
      const tbodyExam = document.querySelector(".draggable-table-exam .ant-table-tbody")
      new Sortable(tbodyExam, {
        animation: 150,
        onEnd({ newIndex, oldIndex }) {
          const currRow = manageObj.selectedExamList.splice(oldIndex, 1)[0]
          manageObj.selectedExamList.splice(newIndex, 0, currRow)
        }
      })
      initSortableObj.exam = true
    }
  }
}

const handleVideoSizeChange = (i) => {
  videoListObj.query.page = 1
  videoListObj.query.pageSize = i
  getVideoList()
}

const handleVideoPageChange = (i) => {
  videoListObj.query.page = i
  getVideoList()
}

const handleExamSizeChange = (i) => {
  examObj.query.page = 1
  examObj.query.pageSize = i
  getExamList()
}

const handleExamPageChange = (i) => {
  examObj.query.page = i
  getExamList()
}

const videoSelectionChange = (val) => {
  manageObj.videoSelection = val
}

const selectVideo = (data) => {
  data.primary_id = ''
  data.is_process_question = false
  data.finish_time = 100
  if (manageObj.selectedVideoList.some(i => i.id === data.id)) {
    $message.error(l.value.videoAlready)
  } else {
    manageObj.selectedVideoList.push(data)
  }
}

const selectMultipleVideo = () => {
  const videoIdSet = new Set(manageObj.selectedVideoList.map(i => i.id))
  manageObj.videoSelection.forEach(i => {
    if (!videoIdSet.has(i.id)) {
      i.primary_id = ''
      i.is_process_question = false
      i.finish_time = 100
      manageObj.selectedVideoList.push(i)
    }
  })
  videoDialogTable.value.clearSelection()
  $message.success(l.value.operateSuccess)
  showObj.selectVideo = false
}

const removeVideo = (i) => {
  manageObj.selectedVideoList.splice(i, 1)
}

const removeMultipleVideo = () => {
  const idsToDelete = manageObj.videoSelection.map(item => item.id)
  manageObj.selectedVideoList = manageObj.selectedVideoList.filter(item => !idsToDelete.includes(item.id))
  videoListTable.value.clearSelection()
}

const getVideoList = () => {
  refetchVideoList()
}

const examSelectionChange = (val) => {
  manageObj.examSelection = val
}

const selectExam = (data) => {
  data.primary_id = ''
  data.is_process_question = false
  if (manageObj.selectedExamList.some(i => i.id === data.id)) {
    $message.error(l.value.examAlready)
  } else {
    manageObj.selectedExamList.push(data)
  }
}

const selectMultipleExam = () => {
  const examIdSet = new Set(manageObj.selectedExamList.map(i => i.id))
  manageObj.examSelection.forEach(i => {
    if (!examIdSet.has(i.id)) {
      i.primary_id = ''
      i.is_process_question = false
      manageObj.selectedExamList.push(i)
    }
  })
  examDialogTable.value.clearSelection()
  $message.success(l.value.operateSuccess)
  showObj.selectExam = false
}

const removeExam = (i) => {
  manageObj.selectedExamList.splice(i, 1)
}

const removeMultipleExam = () => {
  const idsToDelete = manageObj.examSelection.map(item => item.id)
  manageObj.selectedExamList = manageObj.selectedExamList.filter(item => !idsToDelete.includes(item.id))
  examListTable.value.clearSelection()
}

const getExamList = () => {
  refetchExamList()
}

const previewExam = (i) => {
  const url = router.resolve({
    name: 'examDetail',
    query: {
      train_id: "",
      course_id: '',
      exam_id: '',
      questionnaire_id: i.questionnaire_id,
      mode: 'preview'
    }
  }).href
  window.open(url, '_blank')
}

const videoClose = () => {
  videoPlayerRef.value.onDestroy()
  showObj.processQuestion = false
}

const questionSelectionChange = (val) => {
  manageObj.questionSelection = val
}

const selectQuestion = (data) => {
  data.time = ''
  data.text = data.name_label
  manageObj.questionList.push(data)
}

const selectMultipleQuestion = () => {
  manageObj.questionSelection.forEach(i => {
    i.time = ''
    i.text = i.name_label
  })
  manageObj.questionList = manageObj.questionList.concat(manageObj.questionSelection)
  questionDialogTable.value.clearSelection()
  showObj.selectQuestion = false
}

const removeQuestion = (i) => {
  manageObj.questionList.splice(i, 1)
}

const removeMultipleQuestion = () => {
  const idsToDelete = manageObj.questionSelection.map(item => item.id)
  manageObj.questionList = manageObj.questionList.filter(item => !idsToDelete.includes(item.id))
  questionTable.value.clearSelection()
}

const getQuestionList = () => {
  refetchQuestionList()
}

const getBindingQuestionById = (id) => {
  getBindingQuestionByIdMutation.mutate(id)
}

const openProcessQuestion = (data) => {
  showObj.videoUrl = api.videoServer + data.url
  questionObj.video_id = data.id
  getBindingQuestionById(data.id)
}

const submitProcessQuestion = () => {
  const postData = {
    video_id: questionObj.video_id,
    detail: []
  }

  let emptyIndex = false
  manageObj.questionList.forEach((i, index) => {
    if (i.time == '') {
      emptyIndex = index + 1
    }
    postData.detail.push({
      question_primary_id: i.id,
      time: i.time,
      is_valid: "Y",
      rec_status: 1
    })
  })

  if (emptyIndex) {
    return $message.error(l.value.activetimePd.replace('emptyIndex', emptyIndex))
  }

  submitProcessQuestionMutation.mutate(postData)
}

const flashMarkers = () => {
  videoPlayerRef.value.generateMarkers()
}

const modifyCourseBinding = (data) => {
  Object.assign(courseObj.newForm, data)
  courseObj.newForm.lecturer = Number(courseObj.newForm.lecturer)
  selectedTags.value = tagObj.list.filter(aItem => data.tags.some(bItem => bItem.id === aItem.id))

  if (typeof data == 'object') {
    manageObj.currentPrimaryId = data.id
  } else {
    manageObj.currentPrimaryId = data
  }

  getCourseVideoAndExamMutation.mutate(manageObj.currentPrimaryId)
}

const getCatalogList = (oid) => {
  let org_id = ''
  if (typeof oid == 'string') {
    org_id = oid
  }
  $request(api.videoServer + '/Video/VideoCourseCatalog/getCatalogList?org_id=' + org_id)
    .then(r => {
      catalogObj.data = r.data
    })
}

const getTagList = () => {
  refetchTagList()
}

const selectTag = (i) => {
  if (!selectedTags.value.includes(i)) {
    if (selectedTags.value.length >= 5) {
      return $notify.error({
        title: l.value.error,
        message: l.value.most5Tags
      })
    } else {
      selectedTags.value.push(i)
    }
  } else {
    const index = selectedTags.value.indexOf(i)
    selectedTags.value.splice(index, 1)
  }
}

const coverSelect = () => {
  coverInput.value.click()
}

const coverPreview = (url) => {
  if (!url) return
  coverObj.dialogImageUrl = url
  showObj.coverDialog = true
}

const uploadCoverChange = (e) => {
  const file = e.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (r) => {
    coverObj.imageUrl = r.target.result
  }
  reader.readAsDataURL(file)
  coverObj.file = file
}

const uploadCover = () => {
  const formData = new FormData()
  formData.append('formFile', coverObj.file)
  uploadCoverMutation.mutate(formData)
}

const handleSubmit = () => {
  if (manageObj.selectedVideoList.length == 0) {
    return $message.error(l.value.containOneVideoAtleat)
  }
  if (rightCheck(courseObj.newForm, true)) {
    if (coverObj.file.name) {
      uploadCover()
    } else {
      submitCourse()
    }
  }
}

const handleSizeChange = (i) => {
  courseObj.query.pageSize = i
  getCourseList()
}

const handlePageChange = (i) => {
  courseObj.query.page = i
  getCourseList()
}

const addCourse = () => {
  coverObj.dialogImageUrl = ""
  coverObj.imageUrl = ""
  coverObj.file = { name: '' }

  courseObj.newForm = {
    id: "",
    name_zh: "",
    name_tw: "",
    name_en: "",
    name_vi: "",
    description: "",
    college_id: isAdmin.value ? '' : publicCodeObj.collegeList[0].id,
    is_public: isAdmin.value ? 1 : 0,
    org_id: 200,
    thumbnail_path: "",
    score: "",
    applicable_group: "",
    profit: "",
    lecturer: "",
    language: "",
    tag_ids: [],
    video_exam_list: []
  }
  courseObj.currentPrimaryId = ''
  manageObj.selectedVideoList = []
  manageObj.selectedExamList = []
  manageObj.attachmentsList = []
  this.selectedTags = []
  this.initSortableObj.video = false
  this.initSortableObj.exam = false
  showObj.addOrModifyCourse = true
}

const modifyCourseStatus = (i) => {
  if (rightCheck(i, true)) {
    const currentStatus = i.is_valid
    let value
    let oprate
    if (currentStatus == 'N') {
      value = 'Y'
      oprate = c.value.enable
    } else {
      value = 'N'
      oprate = c.value.disable
    }

    $prompt(oprate + i.name_label + l.value.confirmTips, {
      type: 'warning',
      inputPattern: /^[Y]{1}$/i,
      inputErrorMessage: l.value.inputErrorMessage,
      confirmButtonText: l.value.confirmText,
      cancelButtonText: l.value.cancelText
    }).then(() => {
      modifyCourseStatusMutation.mutate({ id: i.id, is_valid: value })
    }).catch(() => {
      console.log('取消操作')
    })
  }
}

const rightCheck = (i, toast = false) => {
  if (isAdmin.value) {
    return true
  } else {
    if (publicCodeObj.collegeList.some(c => c.id == i.college_id)) {
      return true
    } else {
      if (toast) {
        $message.error(l.value.noRight)
      }
      return false
    }
  }
}

const getCourseList = () => {
  refetchCourseList()
}

const submitCourse = () => {
  const video_exam_list = []
  const attachmentids_list = []

  if (manageObj.selectedVideoList.length > 0) {
    manageObj.selectedVideoList.forEach((i, index) => {
      video_exam_list.push({
        primary_id: i.primary_id,
        type: 1,
        video_id: i.id,
        exam_id: '',
        display_order: index + 1,
        is_process_question: i.is_process_question ? 1 : 0,
        finish_time: i.finish_time || 100,
        score: i.score || 0,
        is_valid: 'Y',
        rec_status: 1
      })
    })
  }

  if (manageObj.selectedExamList.length > 0) {
    manageObj.selectedExamList.forEach((i, index) => {
      video_exam_list.push({
        primary_id: i.primary_id,
        type: 0,
        video_id: '',
        exam_id: i.id,
        display_order: index + 1,
        is_process_question: 0,
        finish_time: 100,
        score: i.score || 0,
        is_valid: 'Y',
        rec_status: 1
      })
    })
  }

  if (manageObj.attachmentsList.length > 0) {
    attachmentids_list.push(...manageObj.attachmentsList.map(i => i.id))
  }

  courseObj.newForm.tag_ids = []
  if (selectedTags.value.length > 0) {
    selectedTags.value.forEach(i => {
      courseObj.newForm.tag_ids.push(i.id)
    })
  }

  if (courseObj.newForm.name_zh === '') {
    return $message.error(l.value.titleError)
  }

  if (courseObj.newForm.college_id === '') {
    return $message.error(l.value.belongCollegeError)
  }

  if (courseObj.newForm.applicable_group === '') {
    return $message.error(l.value.applicableGroupError)
  }

  if (courseObj.newForm.lecturer === '') {
    return $message.error(l.value.lecturerTypeError)
  }

  if (courseObj.newForm.language === '') {
    return $message.error(l.value.languageError)
  }

  if (courseObj.newForm.profit === '') {
    return $message.error(l.value.profitError)
  }

  if (courseObj.newForm.courseCatalog === '') {
    return $message.error(l.value.courseCatalogPd)
  }

  const postData = Object.assign({
    id: "",
    name_zh: "",
    name_tw: "",
    name_en: "",
    name_vi: "",
    description: "",
    college_id: "",
    org_id: "",
    thumbnail_path: "",
    score: "",
    applicable_group: "",
    profit: "",
    lecturer: "",
    language: "",
    tag_ids: [],
    video_exam_list: [],
    attachmentids_list: [],
    is_update_version: 0
  }, courseObj.newForm)

  postData.video_exam_list = video_exam_list
  postData.attachmentids_list = attachmentids_list

  submitCourseMutation.mutate(postData)
}

const handleSelectionChange = (val) => {
  courseObj.multipleSelection = val
}

const updateTableMaxHeight = () => {
  const container = tableContainer.value
  if (container) {
    cssObj.tableMaxHeight = container.clientHeight
  }
}

const getPopoverWidth = () => {
  const container = tagInput.value
  if (container) {
    cssObj.popoverWidth = 0.9 * container.clientWidth
  }
}

const formatDuration = (totalSeconds, unit) => {
  if (totalSeconds) {
    const duration = Math.floor(totalSeconds)
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    const seconds = duration % 60

    if (unit) {
      return [
        hours > 0 ? hours.toString().padStart(2, '0') + l.value.hours : '',
        minutes.toString().padStart(2, '0') + l.value.minutes,
        seconds.toString().padStart(2, '0') + l.value.seconds
      ].filter(Boolean).join('')
    } else {
      return [
        hours > 0 ? hours.toString().padStart(2, '0') : '',
        minutes.toString().padStart(2, '0'),
        seconds.toString().padStart(2, '0')
      ].filter(Boolean).join('')
    }
  } else {
    return ""
  }
}

const formatFinishTimePicker = (totalSeconds) => {
  if (totalSeconds) {
    const duration = Math.floor(totalSeconds)
    const hours = Math.floor(duration / 3600)
    const minutes = Math.floor((duration % 3600) / 60)
    const seconds = duration % 60

    return [
      hours.toString().padStart(2, '0') + ':',
      minutes.toString().padStart(2, '0') + ':',
      seconds.toString().padStart(2, '0')
    ].filter(Boolean).join('')
  } else {
    return ''
  }
}

const formatFinishTime = (timeString) => {
  if (!timeString || typeof timeString !== 'string') return 0

  const match = timeString.match(/^(\d{2}):(\d{2}):(\d{2})$/)
  if (!match) return 0

  const [_, hours, minutes, seconds] = match.map(Number)
  return hours * 3600 + minutes * 60 + seconds
}

const returnPublicObjLabel = (value, key, label, filed) => {
  const item = publicCodeObj[filed].find(i => i[key] == value)
  if (item) {
    return item[label]
  } else {
    return value
  }
}

const getAllCollegeList = () => {
  refetchAllCollegeList()
}

const getCollegeList = () => {
  refetchCollegeList()
}

const getLanguage_type = () => {
  $request(api.publiccode + 'getListdetailed', {
    queryString: {},
    ruleno: '121',
    pageSize: 9999
  }).then(r => {
    const list = []
    r.data.list.forEach(j => {
      list.push({
        value: j.code_value,
        label: j.code_name
      })
    })
    publicCodeObj.language_type = list
  }).catch(e => {
    $message.error(e.message)
  })
}

const getCourseCatalog = () => {
  $request(api.publiccode + 'getListdetailed', {
    queryString: {},
    ruleno: '122',
    pageSize: 9999
  }).then(r => {
    const list = []
    r.data.list.forEach(j => {
      list.push({
        value: j.code_value,
        label: j.code_name
      })
    })
    publicCodeObj.courseCatalog = list
  }).catch(e => {
    $message.error(e.message)
  })
}

// Watchers
watch(() => courseObj.query.college_id, (newVal, oldVal) => {
  if (newVal && oldVal === '') {
    courseObj.query.is_public = ''
  }
  if (!isAdmin.value) {
    if (newVal == '') {
      courseObj.query.is_public = 1
    }
  }
  getCourseList()
})

watch(() => videoListObj.query.college_id, (newVal, oldVal) => {
  if (newVal && oldVal === '') {
    videoListObj.query.is_public = ''
  }
  if (!isAdmin.value) {
    if (newVal == '') {
      videoListObj.query.is_public = 1
    }
  }
  getVideoList()
})

// Lifecycle
onMounted(() => {
  getAllCollegeList()
  getCollegeList()
  getTagList()
  getLanguage_type()
  getCourseCatalog()
  window.addEventListener('resize', updateTableMaxHeight)
  nextTick(() => {
    updateTableMaxHeight()
  })
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateTableMaxHeight)
})
</script>




<style>
.lessonList-container {
  width: 100%;
  height: 100%;
  background-color: #ffffff;
}
.lessonList-container .videoSelect-dialog {
  width: 100%;
  height: auto;
  max-height: 70vh;
  padding: 10px;
}
.lessonList-container .videoSelect-dialog .video-table {
  width: 100%;
  height: auto;
  max-height: 70vh;
  margin-bottom: 10px;
}
.lessonList-container .drawer-container .title {
  padding: 0px 20px 10px 20px;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.lessonList-container .drawer-container .form-container {
  width: 95%;
  height: calc(100% - 80px);
  margin: 0 auto;
}
.lessonList-container .drawer-container .form-container .tab-container {
  width: 100%;
  height: 100%;
}
.lessonList-container .drawer-container .form-container .modifyCover {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.lessonList-container .drawer-container .form-container .modifyCover .change {
  text-align: center;
  color: #409fee;
  font-size: 50px;
}
.lessonList-container .drawer-container .form-container .cover {
  position: relative;
  width: 150px;
  height: 150px;
  display: flex;
  align-items: center;
}
.lessonList-container .drawer-container .form-container .cover:hover .cover-oprate {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  background-color: rgba(167, 167, 167, 0.7);
  color: white;
  font-size: 30px;
}
.lessonList-container .drawer-container .form-container .cover:hover .cover-oprate .iconZoom {
  margin-top: 15%;
}
.lessonList-container .drawer-container .form-container .cover:hover .cover-oprate .iconZoom:hover {
  color: #409fee;
}
.lessonList-container .drawer-container .form-container .cover:hover .cover-oprate .iconRefresh {
  margin-top: 15%;
}
.lessonList-container .drawer-container .form-container .cover:hover .cover-oprate .iconRefresh:hover {
  color: #00aa7f;
}
.lessonList-container .drawer-container .form-container .cover .plus-icon {
  width: 140px;
  height: 140px;
  border: 2px dotted #ccc;
  border-radius: 5px;
  color: #999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  cursor: pointer;
}
.lessonList-container .drawer-container .form-container .cover .plus-icon:hover {
  color: #409fee;
}
.lessonList-container .drawer-container .form-container .cover .cover-oprate {
  display: none;
}
.lessonList-container .drawer-container .form-container .tags {
  margin: 0 10px;
  padding: 0 10px;
  white-space: nowrap;
}
.lessonList-container .drawer-container .form-container .tagInput {
  width: 100%;
  height: auto;
  min-height: 40px;
  border: 1px solid #ddd;
  border-radius: 5px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
}
.lessonList-container .drawer-container .buttonBar {
  width: 100%;
  height: 60px;
  margin: 0 auto;
  padding: 0 15px;
  position: absolute;
  background-color: white;
  bottom: 0px;
  border-top: 1px solid #ccc;
  float: right;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.lessonList-container .lessonList-filter {
  padding: 15px;
  width: 100%;
  min-width: 1000px;
  height: 60px;
  background-color: #f2f4f9;
}
.lessonList-container .lessonList-oprate {
  padding: 10px;
  width: 100%;
  min-width: 1000px;
  height: 50px;
  background-color: #ffffff;
}
.lessonList-container .lessonList-table {
  width: 100%;
  min-width: 1000px;
  height: calc(100% - 160px);
}
.lessonList-container .lessonList-table .img {
  width: 100%;
  height: 80px;
}
.lessonList-container .lessonList-table .img .auto-img {
  position: relative;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  max-width: 100%;
  max-height: 100%;
  cursor: pointer;
}
.lessonList-container .lessonList-pagenation {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
