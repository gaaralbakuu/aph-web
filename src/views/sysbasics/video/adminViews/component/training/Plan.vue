<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.manageTraining }}</h1>
      <Button variant="primary" icon="el-icon-plus" @click="addTraining">
        {{ l.createNew }}
      </Button>
    </div>

    <!-- Filter Tabs & Toolbar -->
    <div class="px-6 pt-6 pb-2 border-b border-[#E5E5E5] bg-white sticky top-0 z-20">
      <div class="flex items-center gap-6 text-sm font-medium text-[#606060]">
        <button
          class="pb-3 border-b-2 transition-colors"
          :class="trainingObj.query.is_valid === '' ? 'text-[#0D0D0D] border-[#0D0D0D]' : 'border-transparent hover:text-[#0D0D0D]'"
          @click="
            trainingObj.query.is_valid = ''
            getTrainingList()
          ">
          {{ l.all }}
        </button>
        <button
          class="pb-3 border-b-2 transition-colors"
          :class="trainingObj.query.is_valid === 'Y' ? 'text-[#0D0D0D] border-[#0D0D0D]' : 'border-transparent hover:text-[#0D0D0D]'"
          @click="
            trainingObj.query.is_valid = 'Y'
            getTrainingList()
          ">
          {{ l.enable }}
        </button>
        <button
          class="pb-3 border-b-2 transition-colors"
          :class="trainingObj.query.is_valid === 'N' ? 'text-[#0D0D0D] border-[#0D0D0D]' : 'border-transparent hover:text-[#0D0D0D]'"
          @click="
            trainingObj.query.is_valid = 'N'
            getTrainingList()
          ">
          {{ l.disable }}
        </button>
      </div>

      <!-- Filters Row -->
      <div class="mt-4 flex items-center gap-4 mb-2">
        <Dropdown
          v-if="isAdmin"
          :modelValue="trainingObj.query.college_id"
          :options="publicCodeObj.collegeList"
          :placeholder="l.publicResources"
          label-key="name_label"
          icon-class="el-icon-office-building"
          @update:modelValue="trainingObj.query.college_id = $event; getTrainingList()"
        />

        <div class="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-[#CCCCCC] rounded hover:border-[#606060] transition-colors focus-within:border-[#065FD4]">
          <i class="el-icon-search text-[#606060] text-lg"></i>
          <input
            v-model="trainingObj.query.name"
            type="text"
            :placeholder="l.name"
            class="bg-transparent border-none outline-none text-sm w-full placeholder-[#999999]"
            @keyup.enter="getTrainingList"
            @change="getTrainingList"
          />
        </div>
      </div>
    </div>

    <!-- Content List -->
    <div class="flex-1 overflow-y-scroll relative">
      <!-- Grid Header -->
      <div class="grid grid-cols-[50px_1.5fr_2fr_120px_120px_80px_100px] gap-4 px-6 py-2 border-b border-[#E5E5E5] text-xs font-medium text-[#606060] bg-white sticky top-0 z-10 min-w-[1200px]">
        <div>#</div>
        <div>{{ l.simplifiedTitle }}</div>
        <div>{{ l.description }}</div>
        <div>{{ l.startTime }}</div>
        <div>{{ l.endTime }}</div>
        <div>{{ l.enableStatus }}</div>
        <div class="text-right">{{ l.actions }}</div>
      </div>

      <!-- Grid Body -->
      <div class="flex-1 overflow-hidden bg-white flex flex-col min-w-[1200px]">
         <div v-if="trainingObj.list.length === 0" class="flex flex-col items-center justify-center py-20">
            <div class="w-24 h-24 bg-[#F9F9F9] rounded-full flex items-center justify-center mb-4">
              <i class="el-icon-notebook-2 text-4xl text-[#CCCCCC]"></i>
            </div>
            <p class="text-[#0D0D0D]">{{ l.noData || 'No Data' }}</p>
         </div>
         <div v-else class="divide-y divide-[#E5E5E5]">
            <div v-for="(item, index) in trainingObj.list" :key="item.id" class="grid grid-cols-[50px_1.5fr_2fr_120px_120px_80px_100px] gap-4 px-6 py-3 hover:bg-[#F9F9F9] items-center text-sm text-[#0D0D0D] transition-colors">
               <div class="text-[#606060]">{{ index + 1 }}</div>
               <div class="font-medium truncate" :title="item.name_zh">{{ item.name_zh }}</div>
               <div class="truncate text-[#606060]" :title="item.description">{{ item.description }}</div>
               <div class="text-[#606060] text-xs">{{ item.start_date }}</div>
               <div class="text-[#606060] text-xs">{{ item.end_date }}</div>
               <div>
                  <span v-if="item.is_valid === 'Y'" class="px-2 py-1 rounded bg-[#E6F4EA] text-[#137333] text-xs font-medium">{{ l.enable }}</span>
                  <span v-else class="px-2 py-1 rounded bg-[#FCE8E6] text-[#C5221F] text-xs font-medium">{{ l.disable }}</span>
               </div>
               <div class="flex justify-end gap-3 text-[#606060]">
                 <i class="el-icon-edit text-lg cursor-pointer hover:text-[#065FD4]" :title="l.manage" @click="modifyTraining(item)"></i>
                 <i v-if="item.is_valid === 'N'" class="el-icon-video-play text-lg cursor-pointer hover:text-[#137333]" :title="l.enable" @click="modifyStatus(item)"></i>
                 <i v-else class="el-icon-video-pause text-lg cursor-pointer hover:text-[#C5221F]" :title="l.disable" @click="modifyStatus(item)"></i>
               </div>
            </div>
         </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-end p-4 border-t border-[#E5E5E5] bg-white text-xs text-[#606060]">
      <Pagination
        :page="trainingObj.query.page"
        :pageSize="trainingObj.query.pageSize"
        :total="trainingObj.total"
        :l="l"
        @update:page="trainingObj.query.page = $event"
        @update:pageSize="trainingObj.query.pageSize = $event"
        @change="getTrainingList"
      />
    </div>

    <!-- Drawer -->
    <a-drawer
      :visible="showObj.trainingShow"
      :title="l.manageTraining"
      :width="960"
      @close="showObj.trainingShow = false"
      :body-style="{ padding: 0 }"
      class="youtube-drawer"
    >
       <div class="flex flex-col h-full bg-white relative">
         <div class="flex-1 overflow-y-auto custom-scrollbar">
            <!-- Tabs -->
            <div class="px-6 border-b border-[#E5E5E5] bg-white sticky top-0 z-10 flex gap-6 text-sm font-medium text-[#606060]">
              <button class="py-3 border-b-2 transition-colors" :class="showObj.activeTabName === 'data' ? 'border-[#065FD4] text-[#065FD4]' : 'border-transparent hover:text-[#0D0D0D]'" @click="showObj.activeTabName = 'data'">{{ l.basicInfo }}</button>
              <button class="py-3 border-b-2 transition-colors" :class="showObj.activeTabName === 'detail' ? 'border-[#065FD4] text-[#065FD4]' : 'border-transparent hover:text-[#0D0D0D]'" @click="swiperTab({name: 'detail'})">{{ l.resources }}</button>
            </div>

            <div class="p-8">
               <!-- Basic Info Tab -->
               <div v-show="showObj.activeTabName === 'data'">
                  <!-- Cover -->
                  <div class="mb-8">
                     <h4 class="text-sm font-medium text-[#0D0D0D] mb-1">{{ l.cover }}</h4>
                     <div class="flex gap-4 items-center">
                        <div class="w-[260px] h-[150px] bg-[#F9F9F9] border border-dashed border-[#CCCCCC] rounded relative group overflow-hidden flex items-center justify-center cursor-pointer" @click="coverSelect">
                           <template v-if="coverObj.imageUrl || trainingObj.form.thumbnail_path || trainingObj.form.oldthumbnail_path">
                              <img :src="coverObj.imageUrl || $api.videoServer + '/' + (trainingObj.form.thumbnail_path || trainingObj.form.oldthumbnail_path)" class="w-full h-full object-cover" />
                              <div class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-4 transition-opacity">
                                 <i class="el-icon-zoom-in text-white text-2xl" @click.stop="coverPreview(coverObj.imageUrl || $api.videoServer + '/' + (trainingObj.form.thumbnail_path || trainingObj.form.oldthumbnail_path))"></i>
                                 <i class="el-icon-upload text-white text-2xl" @click.stop="coverSelect"></i>
                              </div>
                           </template>
                           <div v-else class="flex flex-col items-center text-[#606060]">
                              <i class="el-icon-upload text-3xl mb-2"></i>
                              <span class="text-xs">{{ l.selectCover }}</span>
                           </div>
                        </div>
                     </div>
                  </div>

                  <div class="grid grid-cols-2 gap-6 mb-6">
                     <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                        <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.startTime }} ({{ c.required }})</label>
                        <el-date-picker v-model="trainingObj.form.start_date" type="datetime" :placeholder="l.startTime" class="w-full !border-none !p-0 !h-6" value-format="yyyy-MM-dd HH:mm:ss" :clearable="false"></el-date-picker>
                     </div>
                     <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                        <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.endTime }} ({{ c.required }})</label>
                        <el-date-picker v-model="trainingObj.form.end_date" type="datetime" :placeholder="l.endTime" class="w-full !border-none !p-0 !h-6" value-format="yyyy-MM-dd HH:mm:ss" :clearable="false"></el-date-picker>
                     </div>
                     <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                        <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.belongingCollege }} ({{ c.required }})</label>
                        <select v-model="trainingObj.form.college_id" class="w-full bg-transparent outline-none text-[#0D0D0D] text-sm h-6">
                           <option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</option>
                        </select>
                     </div>
                     <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                        <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.participants }} ({{ c.required }})</label>
                        <input v-model.number="trainingObj.form.person_num" class="w-full outline-none text-[#0D0D0D] text-sm" />
                     </div>
                  </div>

                  <div class="space-y-6">
                     <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                        <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.simplifiedTitle }} ({{ c.required }})</label>
                        <input v-model="trainingObj.form.name_zh" class="w-full outline-none text-[#0D0D0D] text-sm" />
                     </div>
                     <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                        <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.traditionalTitle }}</label>
                        <input v-model="trainingObj.form.name_tw" class="w-full outline-none text-[#0D0D0D] text-sm" />
                     </div>
                     <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                        <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.englishTitle }}</label>
                        <input v-model="trainingObj.form.name_en" class="w-full outline-none text-[#0D0D0D] text-sm" />
                     </div>
                     <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                        <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.vietnameseTitle }}</label>
                        <input v-model="trainingObj.form.name_vi" class="w-full outline-none text-[#0D0D0D] text-sm" />
                     </div>
                     <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                        <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.description }} ({{ c.required }})</label>
                        <textarea v-model="trainingObj.form.description" rows="4" class="w-full outline-none text-[#0D0D0D] text-sm resize-none"></textarea>
                     </div>
                  </div>
               </div>

               <!-- Resources Tab -->
               <div v-show="showObj.activeTabName === 'detail'">
                  <div class="flex justify-end gap-2 mb-4">
                     <Button variant="secondary" @click="showObj.selectCourse = true">{{ l.addCourse }}</Button>
                     <Button variant="secondary" @click="showObj.selectExam = true">{{ l.addExam }}</Button>
                     <Button variant="danger" @click="removeMultipleItemFormDetail">{{ l.batchRemove }}</Button>
                  </div>

                  <div class="border border-[#E5E5E5] rounded overflow-hidden">
                     <div class="grid grid-cols-[50px_1fr_100px_100px_100px] bg-[#F9F9F9] border-b border-[#E5E5E5] px-4 py-2 text-xs font-medium text-[#606060]">
                        <!-- Checkbox placeholder logic can be added if needed, for now just index -->
                        <div>#</div>
                        <div>{{ l.name }}</div>
                        <div>{{ l.type }}</div>
                        <div>{{ l.required }}</div>
                        <div class="text-right">{{ l.actions }}</div>
                     </div>
                     <div ref="detailTableBody" class="divide-y divide-[#E5E5E5]">
                        <div v-for="(item, index) in tableObj.detail" :key="item.bind_id" class="grid grid-cols-[50px_1fr_100px_100px_100px] px-4 py-2 text-sm text-[#0D0D0D] items-center hover:bg-[#F9F9F9]">
                           <div>
                              <input type="checkbox" :value="item" v-model="tableObj.detailSelection" class="accent-[#065FD4]" />
                           </div>
                           <div>{{ item.name_label }}</div>
                           <div>{{ item.type == 1 ? l.exam : l.courseName }}</div>
                           <div>
                             <el-switch v-model="item.is_must" :active-value="1" :inactive-value="0"></el-switch>
                           </div>
                           <div class="text-right flex justify-end gap-2">
                              <span class="text-[#137333] cursor-pointer hover:underline text-xs uppercase font-medium" @click="previewDetail(item)">{{ l.preview }}</span>
                              <span class="text-[#C5221F] cursor-pointer hover:underline text-xs uppercase font-medium" @click="removeItemFormDetail(index)">{{ l.remove }}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <!-- Footer -->
         <div class="p-4 border-t border-[#E5E5E5] flex justify-end gap-2 bg-white z-10">
            <Button variant="ghost" @click="showObj.trainingShow = false">{{ c.cancel || 'CANCEL' }}</Button>
            <Button variant="primary" @click="handleSubmit">{{ l.submit || 'SAVE' }}</Button>
         </div>
       </div>
    </a-drawer>

    <!-- Helpers -->
    <input ref="coverInput" type="file" @change="uploadCoverChange" style="display: none;" accept="image/*" />
    <a-modal v-model="showObj.coverDialog" :title="l.preview" :footer="null">
      <img width="100%" :src="coverObj.dialogImageUrl" />
    </a-modal>

    <!-- Select Exam Dialog -->
    <a-modal v-model="showObj.selectExam" :title="l.bindExam" :width="1000" :footer="null">
       <div class="flex gap-4 mb-4">
          <select v-model="examObj.query.college_id" @change="getExamList" class="border border-[#CCCCCC] rounded px-2 py-1 text-sm outline-none focus:border-[#065FD4]">
             <option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</option>
          </select>
          <input v-model="examObj.query.name" class="border border-[#CCCCCC] rounded px-2 py-1 text-sm outline-none flex-1" :placeholder="l.titleFilter" />
          <Button variant="secondary" size="sm" @click="getExamList">{{ l.search }}</Button>
          <Button variant="primary" size="sm" @click="selectMultipleItemToDetail">{{ l.batchAdd }}</Button>
       </div>
       <div class="max-h-[500px] overflow-y-auto border border-[#E5E5E5]">
          <div class="grid grid-cols-[50px_1fr_100px_100px_100px_150px_150px_80px_150px] bg-[#F9F9F9] px-4 py-2 text-xs font-medium text-[#606060] min-w-[1000px]">
             <div><input type="checkbox" @change="(e) => toggleAll(e, examObj.list, tableObj.examSelection)" /></div>
             <div>{{ l.examName }}</div>
             <div>{{ l.passingScore }}</div>
             <div>{{ l.maxAttempts }}</div>
             <div>{{ l.examDuration }}</div>
             <div>{{ l.startTime }}</div>
             <div>{{ l.endTime }}</div>
             <div>{{ l.enableStatus }}</div>
             <div class="text-right">{{ l.actions }}</div>
          </div>
          <div v-for="(ex, idx) in examObj.list" :key="ex.id" class="grid grid-cols-[50px_1fr_100px_100px_100px_150px_150px_80px_150px] px-4 py-2 text-sm border-b border-[#E5E5E5] hover:bg-[#F9F9F9] items-center min-w-[1000px]">
             <div><input type="checkbox" :value="ex" v-model="tableObj.examSelection" /></div>
             <div>{{ ex.name_label }}</div>
             <div>{{ ex.pass_score }}</div>
             <div>{{ ex.max_reply_num }}</div>
             <div>{{ ex.test_duration }}</div>
             <div class="text-xs">{{ ex.start_time }}</div>
             <div class="text-xs">{{ ex.end_time }}</div>
             <div>{{ ex.is_valid }}</div>
             <div class="text-right flex justify-end gap-2">
                <span class="text-[#137333] cursor-pointer hover:underline text-xs uppercase font-medium" @click="previewDetail(ex)">{{ l.preview }}</span>
                <span class="text-[#065FD4] cursor-pointer hover:underline text-xs uppercase font-medium" @click="selectItemToDetail(ex)">{{ l.select }}</span>
             </div>
          </div>
       </div>
    </a-modal>

    <!-- Select Course Dialog -->
    <a-modal v-model="showObj.selectCourse" :title="l.addCourse" :width="1000" :footer="null">
       <div class="flex gap-4 mb-4 flex-wrap">
          <select v-model="courseObj.query.college_id" @change="getCourseList" class="border border-[#CCCCCC] rounded px-2 py-1 text-sm outline-none focus:border-[#065FD4]">
             <option value="">{{ l.publicCourses }}</option>
             <option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</option>
          </select>
          <input v-model="courseObj.query.name" class="border border-[#CCCCCC] rounded px-2 py-1 text-sm outline-none flex-1" :placeholder="l.name" />
          <select v-model="courseObj.query.is_valid" @change="getCourseList" class="border border-[#CCCCCC] rounded px-2 py-1 text-sm outline-none focus:border-[#065FD4]">
             <option value="">{{ l.all }}</option>
             <option value="Y">{{ l.enable }}</option>
             <option value="N">{{ l.disable }}</option>
          </select>
          <Button variant="secondary" size="sm" @click="getCourseList">{{ l.search }}</Button>
          <Button variant="primary" size="sm" @click="selectMultipleItemToDetail">{{ l.batchAdd }}</Button>
       </div>
       <div class="max-h-[500px] overflow-y-auto border border-[#E5E5E5]">
          <div class="grid grid-cols-[50px_100px_1fr_1fr_100px_80px_80px_100px] bg-[#F9F9F9] px-4 py-2 text-xs font-medium text-[#606060] min-w-[1000px]">
             <div><input type="checkbox" @change="(e) => toggleAll(e, courseObj.list, tableObj.courseSelection)" /></div>
             <div>{{ l.cover }}</div>
             <div>{{ l.courseName }}</div>
             <div>{{ l.courseDescription }}</div>
             <div>{{ l.affiliation }}</div>
             <div>{{ l.courseCredit }}</div>
             <div>{{ l.status }}</div>
             <div class="text-right">{{ l.actions }}</div>
          </div>
          <div v-for="(co, idx) in courseObj.list" :key="co.id" class="grid grid-cols-[50px_100px_1fr_1fr_100px_80px_80px_100px] px-4 py-2 text-sm border-b border-[#E5E5E5] hover:bg-[#F9F9F9] items-center min-w-[1000px]">
             <div><input type="checkbox" :value="co" v-model="tableObj.courseSelection" /></div>
             <div class="w-16 h-10 bg-[#E5E5E5]">
                <img v-if="co.thumbnail_path" :src="$api.videoServer + '/' + co.thumbnail_path" class="w-full h-full object-cover cursor-pointer" @click="coverPreview($api.videoServer + '/' + co.thumbnail_path)" />
                <div v-else class="flex items-center justify-center h-full text-[#606060] text-xs">No Img</div>
             </div>
             <div class="font-medium">{{ co.name_zh }}</div>
             <div class="truncate" :title="co.description">{{ co.description }}</div>
             <div>{{ co.org_id }}</div>
             <div>{{ co.score }}</div>
             <div>{{ co.is_valid }}</div>
             <div class="text-right">
                <span class="text-[#065FD4] cursor-pointer hover:underline text-xs uppercase font-medium" @click="selectItemToDetail(co)">{{ l.add }}</span>
             </div>
          </div>
       </div>
       <div class="mt-4 flex justify-end">
         <Pagination :page="courseObj.query.page" :pageSize="courseObj.query.pageSize" :total="courseObj.total" :l="l" @update:page="courseObj.query.page=$event" @update:pageSize="courseObj.query.pageSize=$event; getCourseList()" @change="getCourseList" />
       </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, getCurrentInstance, nextTick, set } from 'vue'
import Sortable from 'sortablejs'
import { useLocalI18n } from '@/composables/useLocalI18n'
import { _ } from '@/views/_common'
import Button from '../common/Button.vue'
import Pagination from '../common/Pagination.vue'
import Dropdown from '../common/Dropdown.vue'

const { l, c } = useLocalI18n('videoAdminPlan')
const { proxy } = getCurrentInstance()
const isAdmin = computed(() => proxy.$store.getters.isAdmin)

// Refs
const coverInput = ref(null)
const detailTableBody = ref(null)

// Data
const coverObj = reactive({
  needUpload: false,
  dialogImageUrl: "",
  imageUrl: "",
  file: ""
})

const showObj = reactive({
  activeTabName: 'data',
  selectCourse: false,
  selectExam: false,
  trainingShow: false,
  coverDialog: false,
  initSortable: false
})

const tableObj = reactive({
  detail: [],
  detailSelection: [],
  courseSelection: [],
  examSelection: [],
})

const publicCodeObj = reactive({
  collegeList: []
})

const trainingObj = reactive({
  query: {
    college_id: "",
    page: 1,
    pageSize: 10,
    name: "",
    is_valid: ''
  },
  form: {
    id: "",
    name_zh: "",
    name_en: "",
    name_vi: "",
    name_tw: "",
    college_id: "",
    thumbnail_path: '',
    oldthumbnail_path: '',
    description: "",
    person_num: "",
    start_date: "",
    end_date: "",
    detail: [],
    is_valid: "Y",
    rec_status: 1,
  },
  list: [],
  total: 0
})

const courseObj = reactive({
  query: {
    search_type: 1,
    catalog_id: "",
    college_id: "",
    name: "",
    description: "",
    tag_id: [],
    page: 1,
    pageSize: 10,
    is_valid: '',
    is_his:0
  },
  total: 0,
  list: []
})

const examObj = reactive({
  query: {
    college_id:'',
    name:'',
    page: 1,
    pageSize: 12
  },
  total: 0,
  list: []
})

// Methods
const toggleAll = (e, list, selection) => {
   if (e.target.checked) {
      // Very rough implementation, should ideally use refs or better state management
      // This is tricky with reactive array replacement in vue 2 composition api
      // Just pushing all to selection
      list.forEach(item => {
         if(!selection.includes(item)) selection.push(item)
      })
   } else {
      selection.length = 0
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
  let file = e.target.files[0]
  if (!file) return;
  let reader = new FileReader();
  reader.onload = (r) => {
    coverObj.imageUrl = r.target.result;
  };
  reader.readAsDataURL(file);
  coverObj.file = file
  coverObj.needUpload = true
}

const uploadCover = () => {
  let formData = new FormData();
  formData.append('formFile', coverObj.file);
  proxy.$request(proxy.$api.videoServer + '/Video/VideoManage/uploadPicture', formData, 'post')
    .then(r => {
      if (r.httpCode == 200 && r.data.url) {
        trainingObj.form.thumbnail_path = r.data.url
        coverObj.needUpload = false
        // Reset local cover state
        if (coverInput.value) coverInput.value.value = '';
        submitTraining()
      }
    })
    .catch(e => {
    })
}

const previewDetail = async (i) => {
  if (i.type === '0' || i.type === 0) {
    let routeUrl = proxy.$router.resolve({
      name: 'videoPlay',
      query: {
        course_id: i.bind_id,
      }
    }).href;
    window.open(routeUrl, '_blank');
  } else {
    let questionnaire_id
    if (i.questionnaire_id) {
      questionnaire_id = i.questionnaire_id
    } else {
      let res = await proxy.$request(proxy.$api.videoServer + '/Video/VideoExam/getExamList', {
        id: i.bind_id,
      })
      questionnaire_id = res.data.list[0].questionnaire_id
    }

    let url = proxy.$router.resolve({
      name: 'videoUserExamDetail',
      query: {
        train_id: "",
        course_id: '',
        exam_id: '',
        questionnaire_id: questionnaire_id,
        mode: 'preview'
      }
    }).href;
    window.open(url, '_blank');
  }
}

const getExamList = () => {
  proxy.$request(proxy.$api.videoServer + '/Video/VideoExam/getExamList', examObj.query)
    .then(r => {
      examObj.list = r.data.list
      examObj.total = r.data.total || 0
    })
    .catch(e => {
      console.log(e);
    })
}

const getCourseList = () => {
  courseObj.query.is_public = ""
  if (!isAdmin.value) {
    if (courseObj.query.college_id == '') {
      courseObj.query.is_public = 1
    }
  }
  proxy.$request(proxy.$api.videoServer + '/Video/VideoCourseCatalog/getCourseList', courseObj.query, 'post')
    .then(r => {
      courseObj.list = r.data.list
      courseObj.total = r.data.total
    })
    .catch(e => {
      console.log(e);
    })
}

const selectItemToDetail = (data) => {
  if (tableObj.detail.some(i => i.bind_id === data.id)) {
    proxy.$message.error(l.value.examExists)
  } else {
    // Need to clone to avoid reactivity issues with original list
    let item = _.cloneDeep(data)
    set(item, 'is_must', 0)
    set(item, 'bind_id', data.id)
    set(item, 'type', showObj.selectCourse ? 0 : 1)
    set(item, 'id', '')
    tableObj.detail.push(item)
  }
}

const selectMultipleItemToDetail = () => {
  let selectCourse = showObj.selectCourse ? true : false
  let idSet = new Set(tableObj.detail.map(i => i.bind_id))
  let count = 0

  if (selectCourse) {
    tableObj.courseSelection.forEach(data => {
      if (!idSet.has(data.id)) {
        let i = _.cloneDeep(data)
        set(i, 'is_must', 0)
        set(i, 'type', 0)
        set(i, 'bind_id', i.id)
        set(i, 'id', '')
        tableObj.detail.push(i)
        count++
      }
    })
    tableObj.courseSelection = []
    showObj.selectCourse = false
  } else {
    tableObj.examSelection.forEach(data => {
      if (!idSet.has(data.id)) {
        let i = _.cloneDeep(data)
        set(i, 'is_must', 0)
        set(i, 'type', 1)
        set(i, 'bind_id', i.id)
        set(i, 'id', '')
        tableObj.detail.push(i)
        count++
      }
    })
    tableObj.examSelection = []
    showObj.selectExam = false
  }
  if (count > 0) proxy.$message.success(l.value.addedSuccess)
}

const removeItemFormDetail = (index) => {
  tableObj.detail.splice(index, 1)
}

const removeMultipleItemFormDetail = () => {
  let selectedBindIds = tableObj.detailSelection.map(item => item.bind_id)
  tableObj.detail = tableObj.detail.filter(item => !selectedBindIds.includes(item.bind_id))
  tableObj.detailSelection = []
}

const swiperTab = (v) => {
  showObj.activeTabName = v.name
  if (v.name == 'detail') {
    if (showObj.initSortable == false) {
      nextTick(() => {
         if (detailTableBody.value) {
            new Sortable(detailTableBody.value, {
              animation: 150,
              onEnd: ({
                newIndex,
                oldIndex
              }) => {
                let temp = _.cloneDeep(tableObj.detail)
                let targetRow = tableObj.detail[oldIndex];
                temp.splice(oldIndex, 1);
                temp.splice(newIndex, 0, targetRow);
                tableObj.detail = temp
              },
            });
            showObj.initSortable = true
         }
      })
    }
  }
}

const addTraining = () => {
  trainingObj.form = {
      college_id: "",
      id: "",
      name_zh: "",
      name_en: "",
      name_vi: "",
      name_tw: "",
      description: "",
      person_num: "",
      start_date: "",
      end_date: "",
      is_valid: "Y",
      rec_status: 1,
      detail: []
    }
    tableObj.detail = []
    showObj.activeTabName = 'data'
    coverObj.imageUrl = ""
    coverObj.file = ""
    coverObj.needUpload = false
    showObj.trainingShow = true
}

const modifyTraining = (data) => {
  coverObj.needUpload = false
  coverObj.dialogImageUrl = ""
  coverObj.imageUrl = ""
  coverObj.file = ""

  proxy.$request(proxy.$api.videoServer + '/Video/VideoTrain/getTrainDetil', {
    id: data.id
  }).then(r => {
    trainingObj.form = r.data
    tableObj.detail = r.data.detail
    if (r.data.thumbnail_path) {
      trainingObj.form.oldthumbnail_path = r.data.thumbnail_path
    }
    showObj.trainingShow = true
    showObj.activeTabName = 'data'
  })
}

const modifyStatus = (i) => {
  let value = i.is_valid == 'N' ? 'Y' : 'N'
  let oprate = i.is_valid == 'N' ? l.value.enable : l.value.disable

  if(window.confirm(l.value.confirmDisable.replace('{oprate}', oprate).replace('{name}', i.name_label))) {
      proxy.$request(proxy.$api.videoServer + '/Video/VideoTrain/ModifyTrainStatus', {
        key: i.id,
        value: value
      }, 'post').then(r => {
        proxy.$message.success(l.value.operationSuccess)
        getTrainingList()
      })
  }
}

const handleSubmit = () => {
  if (trainingObj.form.id == '' && !coverObj.needUpload && !trainingObj.form.thumbnail_path) {
    return proxy.$message.info(l.value.noCoverSelected)
  }
  if (!trainingObj.form.college_id) return proxy.$message.info(l.value.noCollegeSelected)
  if (!trainingObj.form.start_date) return proxy.$message.info(l.value.noStartTime)
  if (!trainingObj.form.end_date) return proxy.$message.info(l.value.noEndTime)
  if (!trainingObj.form.person_num) return proxy.$message.info(l.value.noParticipants)
  if (!trainingObj.form.name_zh) return proxy.$message.info(l.value.noSimplifiedTitle)
  if (!trainingObj.form.description) return proxy.$message.info(l.value.noDescription)

  if (coverObj.needUpload) {
    uploadCover()
  } else {
    submitTraining()
  }
}

const submitTraining = () => {
  let detail = []
  if (tableObj.detail.length > 0) {
    tableObj.detail.forEach((i, index) => {
      if (!i.id) {
        i.train_id = trainingObj.form.id
      }
      detail.push({
        id: i.id || '',
        train_id: i.train_id || trainingObj.form.id,
        bind_id: i.bind_id,
        type: i.type,
        is_must: i.is_must,
        sort: index,
        is_valid: 'Y',
        rec_status: 1,
      })
    })
  }

  trainingObj.form.detail = detail

  proxy.$request(proxy.$api.videoServer + '/Video/VideoTrain/addOrModifyTrain', trainingObj.form, 'post')
    .then(r => {
      if (r.httpCode == 200) {
        proxy.$message.success(l.value.submitSuccess)
        showObj.trainingShow = false
        getTrainingList()
      }
    })
    .catch(e => {})
}

const getTrainingList = () => {
  proxy.$request(proxy.$api.videoServer + '/Video/VideoTrain/getlist', trainingObj.query)
    .then(r => {
      if (r.httpCode == 200) {
        trainingObj.list = r.data.list
        trainingObj.total = r.data.total
      }
    })
    .catch(e => {})
}

const getCollegeList = () => {
  proxy.$request(proxy.$api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
      resource_path: proxy.$route.path
    })
    .then((r) => {
      publicCodeObj.collegeList = r.data
      if (!isAdmin.value) {
        if(r.data.length > 0) {
           trainingObj.query.college_id = r.data[0].id
           examObj.query.college_id = r.data[0].id
        }
      }
      getTrainingList()
    })
    .catch((e) => {
      proxy.$message.error(e.message)
    })
}

onMounted(() => {
  getCollegeList()
})
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
