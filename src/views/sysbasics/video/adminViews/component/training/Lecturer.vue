<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.lecturerManagement }}</h1>
      <Button variant="primary" icon="el-icon-plus" @click="addLecturer">
        {{ l.create }}
      </Button>
    </div>

    <!-- Filter Tabs & Toolbar -->
    <div class="px-6 pt-6 pb-2 border-b border-[#E5E5E5] bg-white sticky top-0 z-20">
      <div class="flex items-center gap-6 text-sm font-medium text-[#606060]">
        <button
          class="pb-3 border-b-2 transition-colors"
          :class="lecturerList.form.is_valid === '' ? 'text-[#0D0D0D] border-[#0D0D0D]' : 'border-transparent hover:text-[#0D0D0D]'"
          @click="
            lecturerList.form.is_valid = ''
            getLecturerList()
          ">
          {{ l.all }}
        </button>
        <button
          class="pb-3 border-b-2 transition-colors"
          :class="lecturerList.form.is_valid === 'Y' ? 'text-[#0D0D0D] border-[#0D0D0D]' : 'border-transparent hover:text-[#0D0D0D]'"
          @click="
            lecturerList.form.is_valid = 'Y'
            getLecturerList()
          ">
          {{ l.enabled }}
        </button>
        <button
          class="pb-3 border-b-2 transition-colors"
          :class="lecturerList.form.is_valid === 'N' ? 'text-[#0D0D0D] border-[#0D0D0D]' : 'border-transparent hover:text-[#0D0D0D]'"
          @click="
            lecturerList.form.is_valid = 'N'
            getLecturerList()
          ">
          {{ l.disabled }}
        </button>
      </div>

      <!-- Filters Row -->
      <div class="mt-4 flex items-center gap-4 mb-2">
        <div class="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-[#CCCCCC] rounded hover:border-[#606060] transition-colors focus-within:border-[#065FD4]">
          <i class="el-icon-search text-[#606060] text-lg"></i>
          <input
            v-model="lecturerList.form.name"
            type="text"
            :placeholder="l.inputKeywordFilter"
            class="bg-transparent border-none outline-none text-sm w-full placeholder-[#999999]"
            @keyup.enter="getLecturerList"
            @change="getLecturerList"
          />
        </div>
      </div>
    </div>

    <!-- Content List -->
    <div class="flex-1 overflow-y-scroll relative">
      <!-- Grid Header -->
      <div class="grid grid-cols-[80px_1fr_80px_120px_120px_120px_2fr_1.5fr_1.5fr_100px] gap-4 px-6 py-2 border-b border-[#E5E5E5] text-xs font-medium text-[#606060] bg-white sticky top-0 z-10 min-w-[1400px]">
        <div>{{ l.cardNumber }}</div>
        <div>{{ l.name }}</div>
        <div>{{ l.gender }}</div>
        <div>{{ l.birthday }}</div>
        <div>{{ l.phoneNumber }}</div>
        <div>{{ l.country }}</div>
        <div>{{ l.address }}</div>
        <div>{{ l.company }}</div>
        <div>{{ l.email }}</div>
        <div class="text-right">{{ l.operation }}</div>
      </div>

      <!-- Grid Body -->
      <div class="flex-1 overflow-hidden bg-white flex flex-col min-w-[1400px]">
         <div v-if="lecturerList.data.length === 0" class="flex flex-col items-center justify-center py-20">
            <div class="w-24 h-24 bg-[#F9F9F9] rounded-full flex items-center justify-center mb-4">
              <i class="el-icon-user text-4xl text-[#CCCCCC]"></i>
            </div>
            <p class="text-[#0D0D0D]">{{ l.tempNoData || 'No Data' }}</p>
         </div>
         <div v-else class="divide-y divide-[#E5E5E5]">
            <div v-for="(item, index) in lecturerList.data" :key="index" class="grid grid-cols-[80px_1fr_80px_120px_120px_120px_2fr_1.5fr_1.5fr_100px] gap-4 px-6 py-3 hover:bg-[#F9F9F9] items-center text-sm text-[#0D0D0D] transition-colors">
               <div class="text-[#606060]">{{ item.ic_card }}</div>
               <div class="font-medium truncate" :title="item.name_zh">{{ item.name_zh }}</div>
               <div>{{ item.sex == 1 ? l.male : l.female }}</div>
               <div class="text-[#606060] text-xs">{{ item.birthday }}</div>
               <div class="text-[#606060]">{{ item.phone }}</div>
               <div class="text-[#606060] truncate">{{ item.country }}</div>
               <div class="text-[#606060] truncate" :title="item.address">{{ item.address }}</div>
               <div class="text-[#606060] truncate" :title="item.company">{{ item.company }}</div>
               <div class="text-[#606060] truncate" :title="item.email">{{ item.email }}</div>
               <div class="flex justify-end gap-3 text-[#606060]">
                 <i class="el-icon-edit text-lg cursor-pointer hover:text-[#065FD4]" :title="l.edit" @click="editLecturer(item)"></i>
                 <i class="el-icon-delete text-lg cursor-pointer hover:text-[#C5221F]" :title="l.delete" @click="deleteLecturer(item)"></i>
               </div>
            </div>
         </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-end p-4 border-t border-[#E5E5E5] bg-white text-xs text-[#606060]">
      <Pagination
        :page="lecturerList.form.page"
        :pageSize="lecturerList.form.pageSize"
        :total="lecturerList.total"
        :l="l"
        @update:page="lecturerList.form.page = $event"
        @update:pageSize="lecturerList.form.pageSize = $event"
        @change="getLecturerList"
      />
    </div>

    <!-- Add/Edit Drawer -->
    <a-drawer
      :visible="showObj.add_show || showObj.edit_show"
      :title="showObj.add_show ? l.addLecturer : l.editLecturer"
      :width="600"
      @close="closeDrawer"
      :body-style="{ padding: 0 }"
      class="youtube-drawer"
    >
       <div class="flex flex-col h-full bg-white relative">
          <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
             <div class="space-y-6">
                <!-- Basic Info -->
                <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                   <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.cardNumber }} ({{ c.required }})</label>
                   <input v-model="currentLecturer.ic_card" class="w-full outline-none text-[#0D0D0D] text-sm" />
                </div>

                <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                   <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.chineseName }} ({{ c.required }})</label>
                   <input v-model="currentLecturer.name_zh" class="w-full outline-none text-[#0D0D0D] text-sm" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                     <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.traditionalChineseName }}</label>
                     <input v-model="currentLecturer.name_tw" class="w-full outline-none text-[#0D0D0D] text-sm" />
                  </div>
                  <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                     <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.englishName }}</label>
                     <input v-model="currentLecturer.name_en" class="w-full outline-none text-[#0D0D0D] text-sm" />
                  </div>
                </div>

                <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                   <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.vietnameseName }}</label>
                   <input v-model="currentLecturer.name_vi" class="w-full outline-none text-[#0D0D0D] text-sm" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                   <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                      <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.gender }} ({{ c.required }})</label>
                      <div class="flex gap-4 mt-1">
                         <label class="flex items-center gap-2 cursor-pointer">
                           <input type="radio" v-model="currentLecturer.sex" value="1" class="accent-[#065FD4]" />
                           <span class="text-sm">{{ l.male }}</span>
                         </label>
                         <label class="flex items-center gap-2 cursor-pointer">
                           <input type="radio" v-model="currentLecturer.sex" value="0" class="accent-[#065FD4]" />
                           <span class="text-sm">{{ l.female }}</span>
                         </label>
                      </div>
                   </div>
                   <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                      <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.birthday }} ({{ c.required }})</label>
                      <el-date-picker v-model="currentLecturer.birthday" type="date" :placeholder="l.selectDate" class="w-full !border-none !p-0 !h-6" value-format="yyyy-MM-dd" :clearable="false"></el-date-picker>
                   </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                   <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                      <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.phoneNumber }} ({{ c.required }})</label>
                      <input v-model="currentLecturer.phone" class="w-full outline-none text-[#0D0D0D] text-sm" />
                   </div>
                   <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                      <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.country }}</label>
                      <input v-model="currentLecturer.country" class="w-full outline-none text-[#0D0D0D] text-sm" />
                   </div>
                </div>

                <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                   <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.address }}</label>
                   <input v-model="currentLecturer.address" class="w-full outline-none text-[#0D0D0D] text-sm" />
                </div>

                <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                   <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.email }}</label>
                   <input v-model="currentLecturer.email" class="w-full outline-none text-[#0D0D0D] text-sm" />
                </div>

                <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                   <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.company }}</label>
                   <input v-model="currentLecturer.company" class="w-full outline-none text-[#0D0D0D] text-sm" />
                </div>
             </div>
          </div>

          <div class="p-4 border-t border-[#E5E5E5] flex justify-end gap-2 bg-white z-10">
            <Button variant="ghost" @click="closeDrawer">{{ c.cancel || 'CANCEL' }}</Button>
            <Button variant="primary" @click="submitLecturer">{{ l.submit || 'SAVE' }}</Button>
          </div>
       </div>
    </a-drawer>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, getCurrentInstance } from 'vue'
import { api, _ } from '@/views/_common'
import { useLocalI18n } from '@/composables/useLocalI18n'
import Button from '../common/Button.vue'
import Pagination from '../common/Pagination.vue'

const { l, c } = useLocalI18n('videoAdminLecturer')
const { proxy } = getCurrentInstance()

const showObj = reactive({
  add_show: false,
  edit_show: false,
})

const lecturerList = reactive({
  total: 0,
  data: [],
  form: {
    is_valid: 'Y',
    page: 1,
    pageSize: 15,
    name: ''
  }
})

// Single object for Add/Edit to simplify
const currentLecturer = reactive({})

const getLecturerList = () => {
  proxy.$request(
      api.baseUrl + '/Video/VideoLecturer/getlist',
      lecturerList.form
    )
    .then((r) => {
      lecturerList.data = r.data.list
      lecturerList.total = r.data.total
    })
    .catch((e) => {
      proxy.$message.error(e.message)
    })
}

const addLecturer = () => {
  Object.keys(currentLecturer).forEach(key => delete currentLecturer[key])
  showObj.add_show = true
}

const editLecturer = (row) => {
  Object.assign(currentLecturer, _.cloneDeep(row))
  showObj.edit_show = true
}

const closeDrawer = () => {
  showObj.add_show = false
  showObj.edit_show = false
}

const submitLecturer = () => {
  if (!currentLecturer.name_zh) return proxy.$message.error(l.value.nameCannotBeEmpty)
  if (!currentLecturer.sex) return proxy.$message.error(l.value.genderCannotBeEmpty)
  if (!currentLecturer.phone) return proxy.$message.error(l.value.phoneCannotBeEmpty)
  if (!currentLecturer.ic_card) return proxy.$message.error(l.value.cardNumberCannotBeEmpty)

  const isEdit = showObj.edit_show

  const action = () => {
     proxy.$request(
       api.baseUrl + '/Video/VideoLecturer/addOrModifyLecturer',
       currentLecturer,
       'post'
     ).then((r) => {
       proxy.$message.success(l.value.operationSuccess)
       closeDrawer()
       getLecturerList()
     }).catch(e => {})
  }

  if (isEdit) {
     if(window.confirm(l.value.confirmModify)) {
        action()
     }
  } else {
     action()
  }
}

const deleteLecturer = (row) => {
  row.is_valid = 'N'
  if(window.confirm(l.value.confirmDelete)) {
    proxy.$request(
       api.baseUrl + '/Video/VideoLecturer/addOrModifyLecturer',
       row,
       'post'
    ).then((r) => {
       proxy.$message.success(l.value.operationSuccess)
       getLecturerList()
    }).catch((e) => {
       proxy.$message.error(l.value.deleteFailed)
    })
  }
}

onMounted(() => {
  getLecturerList()
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
