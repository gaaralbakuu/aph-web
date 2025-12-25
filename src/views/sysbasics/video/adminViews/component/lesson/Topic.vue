<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.recommendationTopic || 'Topic Management' }}</h1>
    </div>

    <!-- Filter Bar -->
    <div class="px-6 pt-4 pb-4 border-b border-[#E5E5E5] bg-white sticky top-0 z-20">
      <div class="flex flex-wrap items-center gap-4">
        <!-- College Filter -->
        <Dropdown
          :modelValue="topicObj.query.college_id"
          :options="publicCodeObj.collegeList"
          label-key="name_label"
          value-key="id"
          icon-class="el-icon-office-building"
          @update:modelValue="
            topicObj.query.college_id = $event
            getTopicList()
          " />

        <!-- Page Filter -->
        <Dropdown
          :modelValue="topicObj.query.web_page"
          :options="publicCodeObj.page"
          label-key="label"
          value-key="value"
          icon-class="el-icon-document"
          @update:modelValue="
            topicObj.query.web_page = $event
            getTopicList()
          " />

        <!-- Status Filter -->
        <Dropdown
          :modelValue="topicObj.query.is_valid"
          :options="[
            { id: '', name_label: c.all },
            { id: 'Y', name_label: l.enable },
            { id: 'N', name_label: l.disable },
          ]"
          :placeholder="c.all"
          label-key="name_label"
          icon-class="el-icon-turn-off"
          @update:modelValue="
            topicObj.query.is_valid = $event
            getTopicList()
          " />

        <button class="px-4 py-2 bg-[#F2F2F2] text-[#0D0D0D] font-medium text-sm uppercase rounded-sm hover:bg-[#E5E5E5] transition-colors" @click="getTopicList">
          {{ l.search }}
        </button>

        <div class="flex-1"></div>

        <button class="flex items-center gap-2 px-4 py-2 bg-[#CC0000] text-white! font-medium text-sm uppercase rounded-sm hover:bg-[#990000] transition-colors shadow-sm" @click="addTopic">
          <i class="el-icon-plus text-lg"></i>
          <span>{{ l.newTopic }}</span>
        </button>
      </div>

      <!-- Secondary Action Bar (visible when editing a topic details) -->
      <div v-show="detailObj.currentId" class="mt-4 flex items-center gap-4 pt-4 border-t border-[#E5E5E5]">
        <span class="text-sm font-medium text-[#0D0D0D]">
          {{ l.currentTopic }}:
          <span class="text-[#065FD4]">{{ topicObj.form.title_label || topicObj.form.title_en }}</span>
        </span>
        <div class="flex-1"></div>
        <button v-show="detailObj.list.length != topicObj.form.detail.length" class="px-4 py-2 bg-[#069C56] text-white! font-medium text-sm uppercase rounded-sm hover:bg-[#058549] transition-colors shadow-sm" @click="updateDetailList">
          {{ l.updateList }}
        </button>
        <button class="px-4 py-2 bg-[#065FD4] text-white! font-medium text-sm uppercase rounded-sm hover:bg-[#0551B4] transition-colors shadow-sm" @click="showObj.courseDialog = true">
          {{ l.bindCourse }}
        </button>
      </div>
    </div>

    <!-- Main Content Area (Split View) -->
    <div class="flex-1 overflow-hidden flex bg-[#F0F0F0]">
      <!-- Left: Topic List -->
      <div class="w-[400px] flex flex-col border-r border-[#E5E5E5] bg-white">
        <!-- List Header -->
        <div class="grid grid-cols-[50px_1fr_60px] gap-2 px-4 py-2 border-b border-[#E5E5E5] text-xs font-medium text-[#606060] bg-[#F9F9F9]">
          <div>{{ c.ordinal || 'No' }}</div>
          <div>{{ l.topicName }}</div>
          <div class="text-right">{{ l.action }}</div>
        </div>

        <!-- List Body -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="topicObj.list.length === 0" class="flex flex-col items-center justify-center py-10">
            <p class="text-sm text-[#606060]">{{ c.noData }}</p>
          </div>
          <div v-else class="divide-y divide-[#E5E5E5]">
            <div v-for="(record, index) in topicObj.list" :key="record.id" class="grid grid-cols-[50px_1fr_60px] gap-2 px-4 py-3 cursor-pointer transition-colors hover:bg-[#F2F8FF]" :class="detailObj.currentId === record.id ? 'bg-[#E5F6FD] border-l-4 border-l-[#065FD4]' : 'border-l-4 border-l-transparent'" @click="getDetailList(record)">
              <div class="text-sm text-[#606060]">{{ (topicObj.query.page - 1) * topicObj.query.pageSize + index + 1 }}</div>
              <div class="min-w-0">
                <div class="text-sm font-medium text-[#0D0D0D] truncate" :title="record.title_label">{{ record.title_label }}</div>
                <div class="text-xs text-[#606060] mt-1">{{ record.page }} • {{ record.modify_user }}</div>
                <div class="mt-1">
                  <span :class="['text-[10px] px-1 rounded border', record.is_valid == 'Y' ? 'bg-[#E5F6FD] text-[#065FD4] border-[#065FD4]' : 'bg-[#F9F9F9] text-[#606060] border-[#CCCCCC]']">
                    {{ record.is_valid == 'Y' ? l.enable : l.disable }}
                  </span>
                </div>
              </div>
              <div class="text-right flex flex-col gap-2 items-end">
                <i class="el-icon-edit text-[#606060] hover:text-[#065FD4] p-1" @click.stop="editTopic(record)"></i>
                <i :class="record.is_valid == 'Y' ? 'el-icon-close text-[#CC0000]' : 'el-icon-check text-[#069C56]'" class="p-1 hover:bg-gray-100 rounded" @click.stop="modifyTopicStatus(record)"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="p-2 border-t border-[#E5E5E5] bg-white flex justify-center">
          <el-pagination @size-change="handleSizeChange" @current-change="handlePageChange" :current-page="topicObj.query.page" :page-size="topicObj.query.pageSize" layout="prev, pager, next" small :total="topicObj.total"></el-pagination>
        </div>
      </div>

      <!-- Right: Detail List (Courses in Topic) -->
      <div class="flex-1 flex flex-col bg-white overflow-hidden">
        <div v-if="!detailObj.currentId" class="flex flex-col items-center justify-center h-full text-[#606060]">
          <i class="el-icon-back text-4xl mb-2"></i>
          <p>{{ l.selectTopicToView }}</p>
        </div>
        <div v-else class="flex flex-col h-full">
          <div class="px-6 py-4 border-b border-[#E5E5E5] bg-[#F9F9F9]">
            <h2 class="font-medium text-[#0D0D0D] mb-0!">{{ l.coursesInTopic }}</h2>
          </div>

          <!-- Detail Header -->
          <div class="grid grid-cols-[50px_100px_2fr_2fr_100px] gap-4 px-6 py-2 border-b border-[#E5E5E5] text-xs font-medium text-[#606060] bg-white">
            <div>{{ c.ordinal || 'No' }}</div>
            <div>{{ l.cover }}</div>
            <div>{{ l.courseName }}</div>
            <div>{{ l.courseDescription }}</div>
            <div class="text-right">{{ l.action }}</div>
          </div>

          <!-- Detail Body -->
          <div class="flex-1 overflow-y-auto">
            <div v-if="detailObj.list.length === 0" class="flex items-center justify-center py-10">
              <p class="text-sm text-[#606060]">{{ c.noData }}</p>
            </div>
            <div v-else class="divide-y divide-[#E5E5E5]">
              <div v-for="(record, index) in detailObj.list" :key="record.course_id" class="grid grid-cols-[50px_100px_2fr_2fr_100px] gap-4 px-6 py-3 hover:bg-[#F9F9F9] items-center">
                <div class="text-sm text-[#606060]">{{ index + 1 }}</div>

                <!-- Cover -->
                <div class="w-[100px] h-[56px] bg-[#E5E5E5] rounded-sm overflow-hidden relative group/thumb">
                  <img v-if="!imageErrors[record.course_id] && record.thumbnail_path" :src="$api.videoServer + '/' + record.thumbnail_path" class="w-full h-full object-cover" @error="handleImageError(record.course_id)" />
                  <div v-else class="w-full h-full flex flex-col items-center justify-center bg-[#CCCCCC] text-white!">
                    <i class="el-icon-picture-outline"></i>
                    <span class="text-[8px] font-bold mt-0.5">{{ l.noImage || 'No Image' }}</span>
                  </div>
                </div>

                <div class="text-sm text-[#0D0D0D] font-medium truncate" :title="record.course_name_label">{{ record.course_name_label }}</div>
                <div class="text-sm text-[#606060] truncate" :title="record.description">{{ record.description }}</div>

                <div class="text-right flex flex-col gap-1 items-end">
                  <button class="text-[#069C56] text-xs hover:underline" @click="toPlay(record.course_primary_id)">{{ l.preview }}</button>
                  <button class="text-[#CC0000] text-xs hover:underline" @click="deleteDetail(index)">{{ l.remove }}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Drawers & Modals -->

    <!-- Edit Topic Drawer -->
    <a-drawer :visible="showObj.topicShow" width="500" :body-style="{ padding: 0 }" @close="showObj.topicShow = false" :title="topicObj.form.id ? l.editTopic : l.newTopic ">
      <div class="flex flex-col bg-white font-roboto absolute top-[55px] left-0 right-0 bottom-0">
        <div class="flex flex-col h-full font-roboto">
          <div class="flex-1 overflow-y-auto p-6 space-y-6">
            <div class="">
              <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.selectCollege }}</label>
              <Dropdown :modelValue="topicObj.form.college_id" :options="publicCodeObj.collegeList" label-key="name_label" value-key="id" @update:modelValue="topicObj.form.college_id = $event" className="w-full" />
            </div>

            <div class="">
              <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.selectType }}</label>
              <Dropdown :modelValue="topicObj.form.type" :options="publicCodeObj.type" label-key="label" value-key="value" @update:modelValue="topicObj.form.type = $event" className="w-full" />
            </div>

            <div class="">
              <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.selectPage }}</label>
              <Dropdown :modelValue="topicObj.form.page" :options="publicCodeObj.page" label-key="label" value-key="value" @update:modelValue="topicObj.form.page = $event" className="w-full" />
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div class="group">
                <label class="block text-xs font-medium text-[#606060] mb-1">
                  {{ l.titleZh }}
                  <span class="text-red-500">*</span>
                </label>
                <input v-model="topicObj.form.title_zh" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]" />
              </div>
              <div class="group">
                <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.titleTw }}</label>
                <input v-model="topicObj.form.title_tw" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]" />
              </div>
              <div class="group">
                <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.titleEn }}</label>
                <input v-model="topicObj.form.title_en" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]" />
              </div>
              <div class="group">
                <label class="block text-xs font-medium text-[#606060] mb-1">{{ l.titleVi }}</label>
                <input v-model="topicObj.form.title_vi" class="w-full p-2 bg-white border border-[#CCCCCC] rounded text-sm outline-none focus:border-[#065FD4]" />
              </div>
            </div>
          </div>
          <div class="p-4 border-t border-[#E5E5E5] bg-white flex justify-end gap-2">
            <button class="px-4 py-2 text-[#606060] font-medium text-sm hover:bg-[#F2F2F2] rounded-sm transition-colors" @click="showObj.topicShow = false">{{ l.cancel }}</button>
            <button class="px-6 py-2 bg-[#065FD4] text-white! font-medium text-sm uppercase rounded-sm shadow-sm hover:bg-[#0551B4] transition-colors" @click="submitTopic">{{ l.submit }}</button>
          </div>
        </div>
      </div>
    </a-drawer>

    <!-- Add Course Dialog -->
    <el-dialog :visible.sync="showObj.courseDialog" @open="getCourseList" width="900px" :title="l.addCourseDialogTitle">
      <div class="flex flex-col h-[500px] font-roboto">
        <!-- Filter -->
        <div class="flex flex-wrap gap-4 mb-4">
          <select v-model="courseObj.query.college_id" class="w-40 px-2 py-1 border rounded text-sm outline-none">
            <option v-for="i in publicCodeObj.collegeList" :key="i.id" :value="i.id">{{ i.name_label }}</option>
          </select>
          <input v-model="courseObj.query.name" class="flex-1 px-2 py-1 border rounded text-sm outline-none" :placeholder="l.keywordSearch" @keyup.enter="getCourseList" />
          <select v-model="courseObj.query.is_public" class="w-32 px-2 py-1 border rounded text-sm outline-none" :disabled="!isAdmin && courseObj.query.college_id == ''">
            <option value="">{{ l.all }}</option>
            <option :value="1">{{ l.public }}</option>
            <option :value="0">{{ l.private }}</option>
          </select>
          <button class="px-4 py-1 bg-[#065FD4] text-white! rounded text-sm" @click="getCourseList">{{ l.search }}</button>
          <button class="px-4 py-1 bg-[#069C56] text-white! rounded text-sm disabled:opacity-50" :disabled="courseObj.selectedList.length == 0" @click="addMultipleCourseToTopic">{{ l.batchAdd }}</button>
        </div>

        <!-- Table -->
        <div class="flex-1 overflow-auto border border-[#E5E5E5] rounded">
          <a-table :dataSource="courseObj.list" rowKey="id" :pagination="false" :rowSelection="{ onChange: handleSelectionChange }">
            <a-table-column :title="l.cover">
              <template slot-scope="text, record">
                <div class="w-16 h-10 bg-[#E5E5E5] rounded-sm overflow-hidden relative">
                  <img v-if="!imageErrors[record.id] && record.thumbnail_path" :src="$api.videoServer + '/' + record.thumbnail_path" class="w-full h-full object-cover" @error="handleImageError(record.id)" />
                  <div v-else class="w-full h-full flex items-center justify-center bg-[#CCCCCC] text-white! text-[10px] font-bold">
                    {{ l.noImage || 'No Image' }}
                  </div>
                </div>
              </template>
            </a-table-column>
            <a-table-column :title="l.name" dataIndex="name_zh"></a-table-column>
            <a-table-column :title="l.description" dataIndex="description" width="200" :ellipsis="true"></a-table-column>
            <a-table-column :title="l.action" width="120">
              <template slot-scope="text, record">
                <button class="text-[#065FD4] hover:underline mr-2" @click="toPlay(record.id)">{{ l.preview }}</button>
                <button class="text-[#069C56] hover:underline" @click="addSingleCourseToTopic(record)">{{ l.select }}</button>
              </template>
            </a-table-column>
          </a-table>
        </div>

        <!-- Pagination -->
        <div class="mt-4 flex justify-end">
          <el-pagination @size-change="handleCourseSizeChange" @current-change="handleCoursePageChange" :current-page="courseObj.query.page" :page-sizes="[5, 10, 15, 30, 50, 100]" :page-size="courseObj.query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="courseObj.total"></el-pagination>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted, getCurrentInstance } from 'vue'
import { _ } from '@/views/_common'
import Dropdown from '../common/Dropdown.vue'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('videoAdminTopic')
const $api = proxy.$api
const $request = proxy.$request
const $message = proxy.$message
const $confirm = proxy.$confirm
const $router = proxy.$router
const $route = proxy.$route
const $store = proxy.$store

const imageErrors = ref({})
const handleImageError = (id) => {
  imageErrors.value = { ...imageErrors.value, [id]: true }
}

const topicObj = reactive({
  query: {
    web_page: '',
    college_id: '',
    type: '',
    page: 1,
    pageSize: 15,
    is_valid: 'Y',
  },
  form: {
    id: '',
    college_id: '',
    title_zh: '',
    title_en: '',
    title_tw: '',
    title_vi: '',
    page: '',
    sort: '10',
    type: 'topic',
    is_valid: 'Y',
    rec_status: 1,
    detail: [],
  },
  list: [],
  total: 0,
})

const detailObj = reactive({
  currentId: '',
  list: [],
})

const courseObj = reactive({
  query: {
    page: 1,
    pageSize: 10,
    college_id: '',
    is_public: '',
    name: '',
    is_his: 0,
  },
  total: 0,
  list: [],
  selectedList: [],
})

const publicCodeObj = reactive({
  allCollegeList: [],
  collegeList: [],
  type: [
    {
      label: l.value.topic,
      id: 'topic',
    },
  ],
  page: [
    { label: c.value.all, value: '' },
    {
      label: l.value.homePage,
      value: 'home',
    },
  ],
})

const showObj = reactive({
  topicShow: false,
  courseDialog: false,
})

const isAdmin = computed(() => $store.getters.isAdmin)

watch(
  () => courseObj.query.college_id,
  (newVal, oldVal) => {
    if (newVal && oldVal === '') {
      courseObj.query.is_public = ''
    }
    if (!isAdmin.value) {
      if (newVal == '') {
        courseObj.query.is_public = 1
      }
    }
    getCourseList()
  }
)

const handleSizeChange = (i) => {
  topicObj.query.page = 1
  topicObj.query.pageSize = i
  getTopicList()
}

const handlePageChange = (i) => {
  topicObj.query.page = i
  getTopicList()
}

const handleCourseSizeChange = (i) => {
  courseObj.query.page = 1
  courseObj.query.pageSize = i
  getCourseList()
}

const handleCoursePageChange = (i) => {
  courseObj.query.page = i
  getCourseList()
}

const getAllCollegeList = () => {
  $request($api.videoServer + '/Video/VideoCollege/getCollegeList', {
    page: 1,
    pageSize: 9999,
  })
    .then((r) => {
      publicCodeObj.allCollegeList = r.data.list
    })
    .catch((e) => {
      $message.error(e.message)
    })
}

const getCourseList = () => {
  $request($api.videoServer + '/Video/VideoCourseCatalog/getCourseList', courseObj.query, 'post')
    .then((r) => {
      courseObj.list = r.data.list
      courseObj.total = r.data.total
    })
    .catch((e) => {
      console.log(e)
    })
}

const getCollegeList = () => {
  $request($api.videoServer + '/Video/VideoMenu/getCollegeRoleByPath', {
    resource_path: $route.path,
  })
    .then((r) => {
      publicCodeObj.collegeList = r.data

      if(publicCodeObj.collegeList.length > 0) {
        topicObj.query.college_id = publicCodeObj.collegeList[0].id
        courseObj.query.college_id = publicCodeObj.collegeList[0].id
      }

      getTopicList()
    })
    .catch((e) => {
      $message.error(e.message)
    })
}

const getTopicList = () => {
  $request($api.videoServer + '/Video/VideoPageTag/getlist', topicObj.query).then((r) => {
    topicObj.list = r.data.list
    topicObj.total = r.data.total
    if (r.data.total == 0) {
      detailObj.currentId = ''
      detailObj.list = []
    }
  })
}

const addTopic = () => {
  topicObj.form = {
    id: '',
    college_id: publicCodeObj.collegeList[0]?.id || '',
    title_zh: '',
    title_en: '',
    title_tw: '',
    title_vi: '',
    page: '',
    sort: '10',
    type: 'topic',
    is_valid: 'Y',
    rec_status: 1,
    detail: [],
  }
  showObj.topicShow = true
}

const editTopic = (i) => {
  topicObj.form = _.cloneDeep(i) // Use cloneDeep to avoid direct mutation issues
  // Ensure detail is array if null
  if (!topicObj.form.detail) topicObj.form.detail = []
  showObj.topicShow = true
}

const modifyTopicStatus = (row) => {
  let is_valid
  let oprateText
  if (row.is_valid == 'Y') {
    is_valid = 'N'
    oprateText = l.value.confirmDisable
  } else {
    is_valid = 'Y'
    oprateText = l.value.confirmEnable
  }
  $confirm(oprateText, l.value.recommendationTopic, {
    confirmButtonText: l.value.confirm,
    cancelButtonText: l.value.cancel,
    type: 'warning',
  })
    .then(() => {
      $request(
        $api.videoServer + '/Video/VideoPageTag/DeleteOrRecoveryById',
        {
          key: row.id,
          value: is_valid,
        },
        'post'
      )
        .then((r) => {
          $message.success(l.value.modifySuccess)
          getTopicList()
        })
        .catch(() => {
          $message.error(l.value.modifyFailed)
        })
    })
    .catch(() => {
      $message.info(l.value.cancelModify)
    })
}

const submitTopic = () => {
  if (!topicObj.form.title_zh) {
    return $message.error(l.value.pleaseEnterNameZh)
  }

  if (!topicObj.form.college_id) {
    return $message.error(l.value.pleaseSelectCollege)
  }

  $request($api.videoServer + '/Video/VideoPageTag/addOrModifyPageTag', topicObj.form, 'post').then((r) => {
    showObj.topicShow = false
    getTopicList()
    $message({
      type: 'success',
      message: l.value.submitSuccess,
    })
  })
}

const isCourseIdExists = (array, course_id) => {
  return array.some((item) => item.course_id === course_id)
}

const addSingleCourseToTopic = (i) => {
  if (!topicObj.form.id && detailObj.currentId) {
    let currentTopic = topicObj.list.find((t) => t.id === detailObj.currentId)
    if (currentTopic) topicObj.form = _.cloneDeep(currentTopic)
  }

  if (!topicObj.form.id) {
    return $message.error('Please select a topic first or create a new one.')
  }

  if (isCourseIdExists(topicObj.form.detail, i.id)) {
    return $message({
      type: 'error',
      message: l.value.courseAlreadyExists,
    })
  }

  let course = {
    id: '',
    course_id: i.id, // Fixed: i.id is the correct ID from getCourseList
    pid: topicObj.form.id,
    title_zh: i.name_zh,
    title_en: i.name_en,
    title_tw: i.name_tw,
    title_vi: i.name_vi,
    icon_app: '',
    icon_web: '',
    url: '',
    is_valid: 'Y',
    rec_status: 1,
  }

  topicObj.form.detail.push(course)

  detailObj.list.push({
    ...i,
    course_id: i.id,
    course_primary_id: i.id,
    course_name_label: i.name_zh,
    description: i.description,
    thumbnail_path: i.thumbnail_path,
  })

  submitTopic()
}

const handleSelectionChange = (selectedRowKeys, selectedRows) => {
  courseObj.selectedList = selectedRows
}

const addMultipleCourseToTopic = () => {
  if (!topicObj.form.id && detailObj.currentId) {
    let currentTopic = topicObj.list.find((t) => t.id === detailObj.currentId)
    if (currentTopic) topicObj.form = _.cloneDeep(currentTopic)
  }

  if (courseObj.selectedList.length > 0) {
    courseObj.selectedList.forEach((i) => {
      if (!isCourseIdExists(topicObj.form.detail, i.id)) {
        topicObj.form.detail.push({
          id: '',
          course_id: i.id,
          pid: topicObj.form.id,
          title_zh: i.name_zh,
          title_en: i.name_en,
          title_tw: i.name_tw,
          title_vi: i.name_vi,
          icon_app: '',
          icon_web: '',
          url: '',
          is_valid: 'Y',
          rec_status: 1,
        })
        detailObj.list.push({
          ...i,
          course_id: i.id,
          course_primary_id: i.id,
          course_name_label: i.name_zh,
          description: i.description,
          thumbnail_path: i.thumbnail_path,
        })
      }
    })
    submitTopic()
  } else {
    $message({
      type: 'error',
      message: l.value.pleaseSelectList,
    })
  }
}

const getDetailList = (i) => {
  topicObj.form = _.cloneDeep(i)
  topicObj.form.sort = Number(i.sort)
  detailObj.currentId = i.id
  detailObj.list = _.cloneDeep(i.detail || [])
  courseObj.selectedList = []
}

const updateDetailList = () => {
  let detail = []
  detailObj.list.forEach((i) => {
    detail.push({
      id: i.id || '',
      course_id: i.course_id,
      pid: topicObj.form.id,
      title_zh: i.title_zh || i.course_name_label,
      title_en: i.title_en,
      title_tw: i.title_tw,
      title_vi: i.title_vi,
      icon_app: '',
      icon_web: '',
      url: '',
      is_valid: 'Y',
      rec_status: 1,
    })
  })
  topicObj.form.detail = _.cloneDeep(detail)
  submitTopic()
}

const deleteDetail = (index) => {
  detailObj.list.splice(index, 1)
  if (topicObj.form.detail && topicObj.form.detail[index]) {
    topicObj.form.detail.splice(index, 1)
  }
  submitTopic()
}

const toPlay = (id) => {
  let routeUrl = $router.resolve({
    name: 'videoPlay',
    query: {
      course_primary_id: id,
    },
  }).href
  window.open(routeUrl, '_blank')
}

onMounted(() => {
  getAllCollegeList()
  getCollegeList()
})
</script>

<style scoped>
:deep(.drawer-no-padding .el-drawer__body) {
  padding: 0;
  height: 100%;
  display: flex;
  flex-direction: column;
}
</style>
