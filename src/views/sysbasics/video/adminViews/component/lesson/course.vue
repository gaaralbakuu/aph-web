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
    <div class="px-6 pt-4 pb-4 border-b border-[#E5E5E5] bg-white sticky top-0 z-20">
      <div class="flex flex-wrap items-center gap-4">

        <!-- College Filter -->
        <div class="relative group w-48">
           <select v-model="courseObj.query.college_id" @change="getCourseList" class="w-full px-3 py-2 bg-white border border-[#CCCCCC] rounded text-sm text-[#0D0D0D] hover:border-[#606060] outline-none focus:border-[#065FD4]">
              <option value="" v-if="isAdmin">{{ l.allColleges || 'All Colleges' }}</option>
              <option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</option>
           </select>
        </div>

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
        <div class="relative group w-32">
           <select v-model="courseObj.query.is_public" @change="getCourseList" class="w-full px-3 py-2 bg-white border border-[#CCCCCC] rounded text-sm text-[#0D0D0D] hover:border-[#606060] outline-none focus:border-[#065FD4]" :disabled="!isAdmin && courseObj.query.college_id == ''">
              <option value="">{{ c.all }}</option>
              <option :value="1">{{ l.public }}</option>
              <option :value="0">{{ l.private }}</option>
           </select>
        </div>

        <!-- Status -->
        <div class="relative group w-32">
           <select v-model="courseObj.query.is_valid" @change="getCourseList" class="w-full px-3 py-2 bg-white border border-[#CCCCCC] rounded text-sm text-[#0D0D0D] hover:border-[#606060] outline-none focus:border-[#065FD4]">
              <option value="">{{ c.all }}</option>
              <option value="Y">{{ c.enable }}</option>
              <option value="N">{{ c.disable }}</option>
           </select>
        </div>

        <button class="px-4 py-2 bg-[#F2F2F2] text-[#0D0D0D] font-medium text-sm uppercase rounded-sm hover:bg-[#E5E5E5] transition-colors" @click="getCourseList">
           {{ l.search }}
        </button>
      </div>
    </div>

    <!-- Content List -->
    <div class="flex-1 overflow-y-scroll flex flex-col">
       <!-- List Header -->
       <div class="grid grid-cols-[50px_120px_2fr_2fr_1fr_1fr_100px_100px_120px_150px] gap-4 px-6 py-2 border-b border-[#E5E5E5] text-xs font-medium text-[#606060] bg-white sticky top-0 z-10">
          <div>No</div>
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
                   <div class="text-sm text-[#0D0D0D] font-medium pt-2 line-clamp-2" :title="record.name_zh">{{ record.name_zh }}</div>

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
                      <span :class="[
                        'inline-flex items-center gap-1 text-sm',
                        record.is_public == 1 ? 'text-[#069C56]' : 'text-[#606060]'
                      ]">
                         <i :class="record.is_public == 1 ? 'el-icon-view' : 'el-icon-lock'"></i>
                         {{ record.is_public == 1 ? l.public : l.private }}
                      </span>
                   </div>

                   <!-- Action -->
                   <div class="text-right pt-2 flex flex-col gap-1 items-end">
                      <button class="text-[#065FD4] font-medium hover:underline text-sm uppercase" @click="modifyCourseBinding(record)">
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
      <div class="flex items-center gap-2">
        <span>{{ l.rowsPerPage }}:</span>
        <select class="border-none bg-transparent outline-none font-medium text-[#0D0D0D]" v-model.number="courseObj.query.pageSize" @change="handleSizeChange(courseObj.query.pageSize)">
          <option :value="10">10</option>
          <option :value="30">30</option>
          <option :value="50">50</option>
          <option :value="100">100</option>
        </select>
        <span class="mx-2">{{ (courseObj.query.page - 1) * courseObj.query.pageSize + 1 }}-{{ Math.min(courseObj.query.page * courseObj.query.pageSize, courseObj.total) }} {{ l.of }} {{ courseObj.total }}</span>
        <i class="el-icon-arrow-left cursor-pointer hover:bg-[#F2F2F2] p-1 rounded-full text-base" :class="courseObj.query.page <= 1 ? 'opacity-50 cursor-not-allowed' : ''" @click="courseObj.query.page > 1 && handlePageChange(courseObj.query.page - 1)"></i>
        <i class="el-icon-arrow-right cursor-pointer hover:bg-[#F2F2F2] p-1 rounded-full text-base" :class="courseObj.query.page >= Math.ceil(courseObj.total / courseObj.query.pageSize) ? 'opacity-50 cursor-not-allowed' : ''" @click="courseObj.query.page < Math.ceil(courseObj.total / courseObj.query.pageSize) && handlePageChange(courseObj.query.page + 1)"></i>
      </div>
    </div>


    <!-- Drawers & Modals -->

    <!-- Add/Modify Course Drawer -->
    <a-drawer :visible="showObj.addOrModifyCourse" :title="l.manageCourse" width="960" @close="showObj.addOrModifyCourse = false" :body-style="{ padding: 0 }">
       <div class="flex flex-col bg-white font-roboto absolute top-[55px] left-0 right-0 bottom-0">
          <!-- Tabs Header -->
          <div class="border-b border-[#E5E5E5] px-6">
             <div class="flex gap-8">
                <button v-for="tab in ['data', 'video', 'exam', 'attachment']" :key="tab"
                   class="py-4 border-b-2 font-medium text-sm transition-colors uppercase"
                   :class="showObj.activeTabName === tab ? 'border-[#065FD4] text-[#065FD4]' : 'border-transparent text-[#606060] hover:text-[#0D0D0D]'"
                   @click="tabClick({name: tab})">
                   {{ tab === 'data' ? l.basicalInfo : tab === 'video' ? l.courseVideo : tab === 'exam' ? l.courseExam : l.courseAttachments }}
                </button>
             </div>
          </div>

          <!-- Content Area -->
          <div class="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[#F9F9F9]">

             <!-- Basic Info Tab -->
             <div v-if="showObj.activeTabName === 'data'" class="max-w-4xl mx-auto bg-white p-6 rounded shadow-sm border border-[#E5E5E5]">
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
                            Change
                         </div>
                      </div>
                   </div>
                </div>

                <!-- Form Grid -->
                <div class="grid grid-cols-2 gap-6">
                   <!-- College -->
                   <div class="group">
                      <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.belongCollege }} <span class="text-red-500">*</span></label>
                      <select v-model="courseObj.newForm.college_id" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]">
                         <option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</option>
                      </select>
                   </div>

                   <!-- Course Type -->
                   <div class="group">
                      <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.courseType }}</label>
                      <div class="flex items-center gap-4 h-[38px]">
                         <a-switch :checked="courseObj.newForm.is_public === 1" @change="(val) => courseObj.newForm.is_public = val ? 1 : 0">
                            <template #checkedChildren>{{ l.public }}</template>
                            <template #unCheckedChildren>{{ l.private }}</template>
                         </a-switch>
                      </div>
                   </div>

                   <!-- Names -->
                   <div class="col-span-2 grid grid-cols-4 gap-4">
                      <div v-for="lang in ['zh', 'tw', 'en', 'vi']" :key="lang">
                         <label class="block text-xs font-medium text-[#606060] mb-1">Name ({{ lang.toUpperCase() }}) <span v-if="lang=='zh'" class="text-red-500">*</span></label>
                         <input v-model="courseObj.newForm['name_' + lang]" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]" />
                      </div>
                   </div>

                   <!-- Catalog, Lecturer, Language -->
                   <div>
                      <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.courseCatalog }} <span class="text-red-500">*</span></label>
                      <select v-model="courseObj.newForm.type" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]">
                         <option v-for="i in publicCodeObj.courseCatalog" :key="i.value" :value="i.value">{{ i.label }}</option>
                      </select>
                   </div>
                   <div>
                      <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.lecturer }} <span class="text-red-500">*</span></label>
                      <select v-model="courseObj.newForm.lecturer" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]">
                         <option v-for="i in publicCodeObj.lecturer_status" :key="i.value" :value="i.value">{{ i.label }}</option>
                      </select>
                   </div>
                   <div>
                      <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.trainLanguage }} <span class="text-red-500">*</span></label>
                      <select v-model="courseObj.newForm.language" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]">
                         <option v-for="i in publicCodeObj.language_type" :key="i.value" :value="i.value">{{ i.label }}</option>
                      </select>
                   </div>

                   <!-- Group & Profit -->
                   <div>
                      <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.applicableGroup }} <span class="text-red-500">*</span></label>
                      <input v-model="courseObj.newForm.applicable_group" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]" />
                   </div>
                   <div>
                      <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.profit }} <span class="text-red-500">*</span></label>
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
                                  <span v-for="(i, index) in tagObj.list" :key="index"
                                     class="px-2 py-1 text-xs border rounded cursor-pointer transition-colors"
                                     :class="selectedTags.includes(i) ? 'bg-[#E5F6FD] border-[#065FD4] text-[#065FD4]' : 'bg-white border-[#CCCCCC] hover:bg-[#F9F9F9]'"
                                     @click="selectTag(i)">
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
                            <span v-if="selectedTags.length===0" class="text-[#999999]">{{ l.chooseTagPd }}</span>
                         </div>
                      </a-popover>
                   </div>

                   <!-- Description -->
                   <div class="col-span-2">
                      <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.desc }}</label>
                      <textarea v-model="courseObj.newForm.description" rows="4" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4] resize-none"></textarea>
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
                   <a-table class="draggable-table-video" :dataSource="manageObj.selectedVideoList" row-key="id" :pagination="false"
                      :row-selection="{ selectedRowKeys: videoSelectedRowKeys, onChange: videoSelectionChange }">
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
                               <a-switch :checked="record.is_process_question" @change="(val) => record.is_process_question = val" size="small" />
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
                   <a-table class="draggable-table-exam" :dataSource="manageObj.selectedExamList" row-key="id" :pagination="false"
                      :row-selection="{ selectedRowKeys: examSelectedRowKeys, onChange: examSelectionChange }">
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
                   <button class="px-3 py-1.5 bg-white border border-[#065FD4] text-[#065FD4] text-xs font-medium rounded uppercase shadow-sm hover:bg-[#E5F6FD] transition-colors" @click="attachmentWarning">{{ l.importantNotice }}</button>
                   <button class="px-3 py-1.5 bg-[#065FD4] text-white! text-xs font-medium rounded uppercase shadow-sm hover:bg-[#0551B4] transition-colors disabled:opacity-50" :disabled="courseObj.newForm.id==''" @click="attachmentSelect">{{ l.addAttachment }}</button>
                   <button class="px-3 py-1.5 bg-[#CC0000] text-white! text-xs font-medium rounded uppercase shadow-sm hover:bg-[#990000] transition-colors disabled:opacity-50" :disabled="courseObj.newForm.id==''" @click="removeMultipleAttachment">{{ l.batchRemove }}</button>
                </div>
                <div class="flex-1 overflow-auto">
                   <a-table :dataSource="manageObj.attachmentsList" row-key="id" :pagination="false"
                      :row-selection="{ selectedRowKeys: attachmentSelectedRowKeys, onChange: attachmentSelectionChange }">
                      <a-table-column :title="l.simplifiedChineseName" dataIndex="name_zh"></a-table-column>
                      <a-table-column :title="l.fileType" dataIndex="file_type"></a-table-column>
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
    <a-modal v-model="showObj.selectVideo" :title="l.addVideo" width="800px" @ok="selectMultipleVideo" @cancel="showObj.selectVideo = false" :ok-text="l.multipleAdd" :cancel-text="c.cancel">
       <div class="flex flex-col h-[500px]">
          <div class="flex gap-4 mb-4">
             <select v-model="videoListObj.query.college_id" class="w-40 px-2 py-1 border rounded text-sm">
                <option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{i.name_label}}</option>
             </select>
             <input v-model="videoListObj.query.title" class="flex-1 px-2 py-1 border rounded text-sm" :placeholder="l.title" @keyup.enter="getVideoList" />
             <button class="px-4 py-1 bg-[#065FD4] text-white! rounded text-sm" @click="getVideoList">{{ l.search }}</button>
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
    <input ref="attachmentInput" type="file" @change="uploadattAchmentChange" style="display: none;" />
    <input ref="coverInput" type="file" @change="uploadCoverChange" style="display: none;" accept="image/*" />
    <a-modal v-model="showObj.coverDialog" :title="l.preview" :footer="null" :width="600">
        <img width="100%" :src="coverObj.dialogImageUrl" alt="" />
    </a-modal>

  </div>
</template>

<script>
  import Sortable from 'sortablejs'
  import { mapGetters } from 'vuex'
  import videoPlayer from '@/components/videoPlayer/VideoPlayerPlyr.vue'
  import { _ } from '@/views/_common'
  import FilePreviews from '@/views/_common/FilePreviews.vue'

  export default {
    name: 'videoAdminCourse',
    components: {
      videoPlayer,
      FilePreviews
    },
    data() {
      return {
        // Ant Design table selection support
        selectedRowKeys: [],
        questionSelectedRowKeys: [],
        videoSelectedRowKeys: [],
        examSelectedRowKeys: [],
        attachmentSelectedRowKeys: [],
        imageErrors: {},
        
        initSortableObj: {
          video: false,
          exam: false
        },
        videoListObj: {
          query: {
            is_public: "",
            college_id: "",
            title: "",
            page: 1,
            pageSize: 10
          },
          total: 0,
          list: []
        },
        questionObj: {
          video_id: '',
          query: {
            name: '',
            question_status: '',
            question_type: '',
            question_category_id: '',
            id: ''
          },
          list: []
        },
        examObj: {
          query: {
            name: "",
            is_valid: "",
            page: 1,
            pageSize: 10
          },
          total: 0,
          list: []
        },
        manageObj: {
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
        },
        showObj: {
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
        },
        catalogObj: {
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
          },
        },
        coverObj: {
          dialogImageUrl: "",
          imageUrl: "",
          file: {
            name: ''
          },
        },
        attachmentObj: {
          id: '',
          file_name_zh: '',
          file_name_tw: '',
          file_name_en: '',
          file_name_vi: '',
          file: ''
        },
        cssObj: {
          tableMaxHeight: '400px',
          popoverWidth: "600px",
        },
        selectedTags: [],
        tagObj: {
          query: {
            page: 1,
            pageSize: 9999,
            name: ""
          },
          list: [],
          total: 0
        },
        courseObj: {
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
        },

        publicCodeObj: {
          allCollegeList:[],
          collegeList: [],
          org_id: [],
          language_type: [],
          courseCatalog: [],
          question_type: [{
              label: this.$l.fillIn,
              value: 0
            },
            {
              label: this.$l.radio,
              value: 1
            },
            {
              label: this.$l.checkbox,
              value: 2
            },
            {
              label: this.$l.judge,
              value: 3
            }
          ],
          question_status: [{
              label: this.$l.published,
              value: 0
            },
            {
              label: this.$l.unpublished,
              value: 1
            }
          ],
          lecturer_status: [{
              label: this.$l.externalLecturer,
              value: 0
            },
            {
              label: this.$l.internalLecturer,
              value: 1
            }
          ],
        }
      }
    },

    computed: {
      ...mapGetters(['isAdmin']),
      l() {
        return this.$l
      },
      c() {
        return this.$c
      }
    },

    watch: {
      "courseObj.query.college_id"(newVal, oldVal) {
        if (newVal && oldVal === '') {
          this.courseObj.query.is_public = ''
        }
        if (!this.isAdmin) {
          if (newVal == '') {
            this.courseObj.query.is_public = 1
          }
        }
        this.getCourseList()
      },
      "videoListObj.query.college_id"(newVal, oldVal) {
        if (newVal && oldVal === '') {
          this.videoListObj.query.is_public = ''
        }
        if (!this.isAdmin) {
          if (newVal == '') {
            this.videoListObj.query.is_public = 1
          }
        }
        this.getVideoList()
      },
      "showObj.selectExam"(newVal) {
         if (newVal) {
            this.getExamList()
         }
      }
    },


    methods: {
      handleImageError(id) {
        this.$set(this.imageErrors, id, true)
      },
      previewFile(url) {
        this.showObj.fileUrl = this.$api.videoServer + '/' + url
        this.showObj.filePreviews = true
      },
      formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
      },

      attachmentWarning() {
        this.$message.warning(this.$l.attachmentWarningMessage)
      },

      getAttachments(id) {
        this.manageObj.attachmentsList = []
        this.$request(this.$api.videoServer + '/Video/VideoCourseCatalog/GetCourseAttachemnts', {
            course_primary_id: id,
            page: 1,
            pageSize: 9999
          })
          .then(r => {
            if (r.httpCode == 200) {
              this.manageObj.attachmentsList = r.data.list
            }
          })
          .catch(e => {
            console.log(e);
          })
      },

      attachmentSelect() {
        this.$refs.attachmentInput.click()
      },

      attachmentSelectionChange(val) {
        this.manageObj.attachmentSelection = val
      },

      uploadattAchmentChange(e) {
        let file = e.target.files[0]
        this.attachmentObj.file = file
        this.attachmentObj.file_name_zh = file.name
        this.uploadAttachment()
      },

      uploadAttachment() {
        let formData = new FormData();
        formData.append('id', this.attachmentObj.id);
        formData.append('file_name_zh', this.attachmentObj.file_name_zh);
        formData.append('file', this.attachmentObj.file);
        this.$request(this.$api.videoServer + '/Video/VideoCourseCatalog/uploadAttachment', formData, 'post')
          .then(r => {
            if (r.httpCode == 200) {
              this.manageObj.attachmentsList.push({
                id: r.data.id,
                file_url: r.data.file_url,
                name_zh: r.data.file_name_zh,
                file_type: r.data.file_type,
                file_size: r.data.file_size,
              })
              this.$refs.attachmentInput.value = ""
              this.$message.success(this.$l.operateSuccess)
            }
          })
          .catch(e => {
            console.log(e);
          })
      },

      removeAttachment(i) {
        this.manageObj.attachmentsList.splice(i, 1)
      },

      removeMultipleAttachment() {
        let idsToDelete = this.manageObj.attachmentSelection.map(item => item.id);
        this.manageObj.attachmentsList = this.manageObj.attachmentsList.filter(item => !idsToDelete.includes(item.id));
        this.attachmentSelectedRowKeys = []
      },

      tabClick(v) {
        this.showObj.activeTabName = v.name

        // Re-initialize Sortable when tab changes
        if (v.name == 'video' && !this.initSortableObj.video) {
           this.$nextTick(() => {
              const tbody = document.querySelector(".draggable-table-video .ant-table-body table tbody") || document.querySelector(".draggable-table-video table tbody");
              if (tbody) {
                  new Sortable(tbody, {
                      animation: 150,
                      onEnd: ({ newIndex, oldIndex }) => {
                          let list = _.cloneDeep(this.manageObj.selectedVideoList)
                          const item = list.splice(oldIndex, 1)[0]
                          list.splice(newIndex, 0, item)
                          this.manageObj.selectedVideoList = list
                      }
                  });
                  this.initSortableObj.video = true
              }
           })
        } else if (v.name == 'exam' && !this.initSortableObj.exam) {
           this.$nextTick(() => {
              const tbody = document.querySelector(".draggable-table-exam .ant-table-body table tbody") || document.querySelector(".draggable-table-exam table tbody");
              if (tbody) {
                  new Sortable(tbody, {
                      animation: 150,
                      onEnd: ({ newIndex, oldIndex }) => {
                          let list = _.cloneDeep(this.manageObj.selectedExamList)
                          const item = list.splice(oldIndex, 1)[0]
                          list.splice(newIndex, 0, item)
                          this.manageObj.selectedExamList = list
                      }
                  });
                  this.initSortableObj.exam = true
              }
           })
        }
      },

      handleSizeChange(i) {
        this.courseObj.query.pageSize = i
        this.getCourseList()
      },

      handlePageChange(i) {
        this.courseObj.query.page = i
        this.getCourseList()
      },

      videoSelectionChange(val) {
        this.videoSelectedRowKeys = val
        this.manageObj.videoSelection = this.manageObj.selectedVideoList.filter(item => val.includes(item.id))
      },

      selectMultipleVideo() {
        let selectedVideos = this.videoListObj.list.filter(item => this.videoSelectedRowKeys.includes(item.id))
        selectedVideos.forEach(v => {
           if (!this.manageObj.selectedVideoList.some(existing => existing.id === v.id)) {
              this.manageObj.selectedVideoList.push({ ...v, primary_id: '', is_process_question: false })
           }
        })
        this.showObj.selectVideo = false
        this.videoSelectedRowKeys = []
      },

      removeVideo(i) {
        this.manageObj.selectedVideoList.splice(i, 1)
      },

      removeMultipleVideo() {
         this.manageObj.selectedVideoList = this.manageObj.selectedVideoList.filter(item => !this.videoSelectedRowKeys.includes(item.id))
         this.videoSelectedRowKeys = []
      },

      getVideoList() {
        this.$request(this.$api.videoServer + '/Video/VideoManage/getVideoList', this.videoListObj.query)
          .then(r => {
            if (r.httpCode == 200) {
              this.videoListObj.list = r.data.list
              this.videoListObj.total = r.data.total
            }
          })
      },

      examSelectionChange(val) {
         this.examSelectedRowKeys = val
         this.manageObj.examSelection = this.manageObj.selectedExamList.filter(item => val.includes(item.id))
      },

      removeExam(i) {
        this.manageObj.selectedExamList.splice(i, 1)
      },

      removeMultipleExam() {
         this.manageObj.selectedExamList = this.manageObj.selectedExamList.filter(item => !this.examSelectedRowKeys.includes(item.id))
         this.examSelectedRowKeys = []
      },

      getExamList() {
        this.$request(this.$api.videoServer + '/Video/VideoExam/getExamList', this.examObj.query)
          .then(r => {
            this.examObj.list = r.data.list
            this.examObj.total = r.data.total
          })
          .catch(e => {
            console.log(e);
          })
      },

      selectMultipleExam() {
        // Logic to add selected exams to manageObj.selectedExamList
        // Assuming examSelectedRowKeys contains IDs from the selection change event
        let selectedExams = this.examObj.list.filter(item => this.examSelectedRowKeys.includes(item.id))
        selectedExams.forEach(e => {
           if (!this.manageObj.selectedExamList.some(existing => existing.id === e.id)) {
              this.manageObj.selectedExamList.push({ ...e, primary_id: '' })
           }
        })
        this.showObj.selectExam = false
        this.examSelectedRowKeys = []
      },

      modifyCourseBinding(data) {
        this.courseObj.newForm = Object.assign(this.courseObj.newForm, data)
        this.courseObj.newForm.lecturer = Number(this.courseObj.newForm.lecturer)
        this.selectedTags = this.tagObj.list.filter(aItem => data.tags.some(bItem => bItem.id === aItem.id));
        if (typeof data == 'object') {
          this.manageObj.currentPrimaryId = data.id
        } else {
          this.manageObj.currentPrimaryId = data
        }
        this.$request(this.$api.videoServer + '/Video/VideoCourseCatalog/getCourseVideoAndExam?course_id=' + this.manageObj.currentPrimaryId)
          .then(r => {
            this.manageObj.selectedVideoList = []
            this.manageObj.selectedExamList = []
            if (r.data.length > 0) {
              r.data.forEach(i => {
                if (i.video) {
                  i.video.primary_id = i.id
                  i.video.score = i.score
                  i.video.finish_time = parseInt(i.finish_time / i.video.duration)
                  this.manageObj.selectedVideoList.push(i.video)
                } else if (i.exam) {
                  i.exam.primary_id = i.id
                  i.exam.score = i.score
                  this.manageObj.selectedExamList.push(i.exam)
                }
              })
            }
            // Reset Sortable flags so they re-init when tab is clicked
            this.initSortableObj.video = false;
            this.initSortableObj.exam = false;

            this.showObj.addOrModifyCourse = true
          })
          .catch(e => {
            console.log(e);
          })
      },

      getTagList() {
        this.$request(this.$api.videoServer + '/Video/VideoTag/getList', this.tagObj.query)
          .then(r => {
            if (r.httpCode == 200) {
              this.tagObj.list = r.data.list
              this.tagObj.total = r.data.total
            }
          })
      },

      selectTag(i) {
        if (!this.selectedTags.includes(i)) {
          if (this.selectedTags.length >= 5) {
            return this.$message.error(this.$l.most5Tags);
          } else {
            this.selectedTags.push(i)
          }
        } else {
          let index = this.selectedTags.indexOf(i)
          this.selectedTags.splice(index, 1)
        }
      },

      coverSelect() {
        this.$refs.coverInput.click()
      },

      coverPreview(url) {
        if (!url) return
        this.coverObj.dialogImageUrl = url
        this.showObj.coverDialog = true
      },

      uploadCoverChange(e) {
        let file = e.target.files[0]
        if (!file) return;
        let reader = new FileReader();
        reader.onload = (r) => {
          this.coverObj.imageUrl = r.target.result;
        };
        reader.readAsDataURL(file);
        this.coverObj.file = file
      },

      uploadCover() {
        let formData = new FormData();
        formData.append('formFile', this.coverObj.file);
        this.$request(this.$api.videoServer + '/Video/VideoManage/uploadPicture', formData, 'post')
          .then(r => {
            if (r.httpCode == 200 && r.data.url) {
              this.courseObj.newForm.thumbnail_path = r.data.url
              this.coverObj = {
                dialogImageUrl: "",
                imageUrl: "",
                file: "",
              }
              this.submitCourse()
            }
          })
      },

      handleSubmit() {
        if (this.manageObj.selectedVideoList.length == 0) {
          return this.$message.error(this.$l.containOneVideoAtleat)
        }
        if (this.rightCheck(this.courseObj.newForm, true)) {
          if (this.coverObj.file.name) {
            this.uploadCover()
          } else {
            this.submitCourse()
          }
        }
      },

      submitCourse() {
         let video_exam_list = []
         let attachmentids_list = []

         if (this.manageObj.selectedVideoList.length > 0) {
            this.manageObj.selectedVideoList.forEach((i, index) => {
               video_exam_list.push({
                  id: i.primary_id,
                  bind_id: i.id,
                  course_id: this.courseObj.currentPrimaryId,
                  score: i.score,
                  is_process_question: i.is_process_question,
                  finish_time: i.finish_time * i.duration,
                  type: 0,
                  sort: index,
                  is_valid: "Y",
                  rec_status: 1
               })
            })
         }

         if (this.manageObj.selectedExamList.length > 0) {
            this.manageObj.selectedExamList.forEach((i, index) => {
               video_exam_list.push({
                  id: i.primary_id,
                  bind_id: i.id,
                  course_id: this.courseObj.currentPrimaryId,
                  score: i.score,
                  is_process_question: false,
                  type: 1,
                  sort: index + this.manageObj.selectedVideoList.length,
                  is_valid: "Y",
                  rec_status: 1
               })
            })
         }

         if (this.manageObj.attachmentsList.length > 0) {
             attachmentids_list = this.manageObj.attachmentsList.map(i => i.id)
         }

         this.courseObj.newForm.tag_ids = this.selectedTags.map(i => i.id)

         if (!this.courseObj.newForm.name_zh) return this.$message.error(this.$l.titleError)

         let postData = { ...this.courseObj.newForm, video_exam_list, attachmentids_list, is_update_version: 0 }

         this.$request(this.$api.videoServer + '/Video/VideoCourseCatalog/addOrModifyCourse', postData, 'post')
          .then(r => {
            if (r.httpCode == 200) {
              this.$message.success(this.$l.operateSuccess)
              this.showObj.addOrModifyCourse = false
              this.getCourseList()
            }
          })
      },


      addCourse() {
        this.coverObj = { dialogImageUrl: "", imageUrl: "", file: { name: '' } }
        this.courseObj.newForm = {
          id: "",
          name_zh: "",
          name_tw: "",
          name_en: "",
          name_vi: "",
          description: "",
          college_id: this.isAdmin ? '' : this.publicCodeObj.collegeList[0].id,
          is_public: this.isAdmin ? 1 : 0,
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
        this.courseObj.currentPrimaryId = ''
        this.manageObj.selectedVideoList = []
        this.manageObj.selectedExamList = []
        this.manageObj.attachmentsList = []
        this.selectedTags = []
        this.initSortableObj.video = false;
        this.initSortableObj.exam = false;
        this.showObj.addOrModifyCourse = true
      },

      modifyCourseStatus(i) {
        if (this.rightCheck(i, true)) {
          let currentStatus = i.is_valid
          let value = currentStatus == 'N' ? 'Y' : 'N'
          let oprate = currentStatus == 'N' ? this.$c.enable : this.$c.disable
          let name = i.name_zh

          this.showObj.confirmData = {
              title: this.$l.confirmTips || 'Confirm',
              message: `${oprate}《${name}》?`,
              callback: () => {
                 this.$request(this.$api.videoServer + '/Video/VideoCourseCatalog/modifyCourseStatus', {
                    key: i.id,
                    value: value
                 }, 'post').then(r => {
                    this.$message.success(this.$l.operateSuccess)
                    this.getCourseList()
                 })
              }
          }
          this.showObj.confirmShow = true
        }
      },

      handleConfirmOk() {
          if (this.showObj.confirmData.callback) {
              this.showObj.confirmData.callback()
          }
          this.showObj.confirmShow = false
      },

      handleConfirmCancel() {
          this.showObj.confirmShow = false
      },

      rightCheck(i, toast = false) {
        if (this.isAdmin) return true
        if (this.publicCodeObj.collegeList.some(c => c.id == i.college_id)) return true
        if (toast) this.$message.error(this.$l.noRightToEdit)
        return false
      },

      getCourseList() {
        this.$request(this.$api.videoServer + '/Video/VideoCourseCatalog/getCourseList', this.courseObj.query, 'post')
          .then(r => {
            this.courseObj.list = r.data.list
            this.courseObj.total = r.data.total
          })
      },

      getAllCollegeList(){
        this.$request(this.$api.videoServer + '/Video/VideoCollege/getCollegeList', { page:1, pageSize:9999 })
          .then((r) => { this.publicCodeObj.allCollegeList = r.data.list })
      },

      getCollegeList() {
        this.$request(this.$api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', { resource_path: this.$route.path })
          .then((r) => {
            this.publicCodeObj.collegeList = r.data
            this.courseObj.query.college_id = this.publicCodeObj.collegeList[0].id
            this.videoListObj.query.college_id = this.publicCodeObj.collegeList[0].id
            this.getCourseList()
          })
      },

      getLanguage_type() {
         this.$request(this.$api.publiccode + 'getListdetailed', { queryString: {}, ruleno: '121', pageSize: 9999 })
          .then(r => {
             let list = [];
             r.data.list.forEach(j => { list.push({ label: j.name_label, value: j.code_no }); })
             this.publicCodeObj.language_type = list
          })
      },

      getCourseCatalog() {
         this.$request(this.$api.publiccode + 'getListdetailed', { queryString: {}, ruleno: '122', pageSize: 9999 })
          .then(r => {
             let list = [];
             r.data.list.forEach(j => { 
              list.push({ label: j.name_label, value: j.code_no }); 
            })
             this.publicCodeObj.courseCatalog = list
          })
      },

      formatDuration(totalSeconds, unit) {
         if (!totalSeconds) return ""
          let duration = Math.floor(totalSeconds)
          let hours = Math.floor(duration / 3600);
          let minutes = Math.floor((duration % 3600) / 60);
          let seconds = duration % 60;
          if (unit) {
            return [hours > 0 ? `${hours}${this.$l.hours}` : '', minutes.toString().padStart(2, '0') + this.$l.mins, seconds.toString().padStart(2, '0') + this.$l.seconds].filter(Boolean).join('');
          } else {
            return [hours > 0 ? `${hours}:` : '', minutes.toString().padStart(2, '0') + ':', seconds.toString().padStart(2, '0')].filter(Boolean).join('');
          }
      },

      returnPublicObjLabel(value, key, label, filed) {
         if(!this.publicCodeObj[filed]) return value;
        let item = this.publicCodeObj[filed].find(i => i[key] == value)
        return item ? item[label] : value
      }
    },
    mounted() {
      this.getAllCollegeList()
      this.getCollegeList()
      this.getTagList()
      this.getLanguage_type()
      this.getCourseCatalog()
    }
  }
</script>

<style scoped>
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
