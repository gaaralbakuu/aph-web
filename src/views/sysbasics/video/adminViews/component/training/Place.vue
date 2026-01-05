<template>
  <div class="flex flex-col flex-1 overflow-hidden bg-[#F9F9F9] font-roboto text-[#0D0D0D]">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white h-[70px]">
      <h1 class="text-xl font-medium mb-0!">{{ l.trainingPlaceManagement }}</h1>
      <Button variant="primary" icon="el-icon-plus" @click="addPlace">
        {{ l.create }}
      </Button>
    </div>

    <!-- Filter Tabs & Toolbar -->
    <div class="px-6 pt-6 pb-2 border-b border-[#E5E5E5] bg-white sticky top-0 z-20">
      <div class="flex items-center gap-6 text-sm font-medium text-[#606060]">
        <button
          class="pb-3 border-b-2 transition-colors"
          :class="trainPlaceList.form.is_valid === '' ? 'text-[#0D0D0D] border-[#0D0D0D]' : 'border-transparent hover:text-[#0D0D0D]'"
          @click="
            trainPlaceList.form.is_valid = ''
            getTrainPlaceList()
          ">
          {{ l.all }}
        </button>
        <button
          class="pb-3 border-b-2 transition-colors"
          :class="trainPlaceList.form.is_valid === 'Y' ? 'text-[#0D0D0D] border-[#0D0D0D]' : 'border-transparent hover:text-[#0D0D0D]'"
          @click="
            trainPlaceList.form.is_valid = 'Y'
            getTrainPlaceList()
          ">
          {{ l.enabled }}
        </button>
        <button
          class="pb-3 border-b-2 transition-colors"
          :class="trainPlaceList.form.is_valid === 'N' ? 'text-[#0D0D0D] border-[#0D0D0D]' : 'border-transparent hover:text-[#0D0D0D]'"
          @click="
            trainPlaceList.form.is_valid = 'N'
            getTrainPlaceList()
          ">
          {{ l.disabled }}
        </button>
      </div>

      <!-- Filters Row -->
      <div class="mt-4 flex items-center gap-4 mb-2">
        <div class="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-[#CCCCCC] rounded hover:border-[#606060] transition-colors focus-within:border-[#065FD4]">
          <i class="el-icon-search text-[#606060] text-lg"></i>
          <input
            v-model="trainPlaceList.form.name"
            type="text"
            :placeholder="l.name"
            class="bg-transparent border-none outline-none text-sm w-full placeholder-[#999999]"
            @keyup.enter="getTrainPlaceList"
            @change="getTrainPlaceList"
          />
        </div>
        <div class="flex-1 flex items-center gap-2 px-3 py-2 bg-white border border-[#CCCCCC] rounded hover:border-[#606060] transition-colors focus-within:border-[#065FD4]">
          <i class="el-icon-location text-[#606060] text-lg"></i>
          <input
            v-model="trainPlaceList.form.place"
            type="text"
            :placeholder="l.location"
            class="bg-transparent border-none outline-none text-sm w-full placeholder-[#999999]"
            @keyup.enter="getTrainPlaceList"
            @change="getTrainPlaceList"
          />
        </div>
      </div>
    </div>

    <!-- Content List -->
    <div class="flex-1 overflow-y-scroll relative">
      <!-- Grid Header -->
      <div class="grid grid-cols-[50px_1.5fr_1.5fr_2fr_100px_100px_120px_150px_150px_100px] gap-4 px-6 py-2 border-b border-[#E5E5E5] text-xs font-medium text-[#606060] bg-white sticky top-0 z-10 min-w-[1400px]">
        <div>#</div>
        <div>{{ l.name }}</div>
        <div>{{ l.location }}</div>
        <div>{{ l.equipmentDetails }}</div>
        <div>{{ l.capacity }}</div>
        <div>{{ l.status }}</div>
        <div>{{ l.modifiedBy }}</div>
        <div>{{ l.modifiedDepartment }}</div>
        <div>{{ l.modifiedTime }}</div>
        <div class="text-right">{{ l.operation }}</div>
      </div>

      <!-- Grid Body -->
      <div class="flex-1 overflow-hidden bg-white flex flex-col min-w-[1400px]">
         <div v-if="trainPlaceList.data.length === 0" class="flex flex-col items-center justify-center py-20">
            <div class="w-24 h-24 bg-[#F9F9F9] rounded-full flex items-center justify-center mb-4">
              <i class="el-icon-place text-4xl text-[#CCCCCC]"></i>
            </div>
            <p class="text-[#0D0D0D]">{{ l.tempNoData || 'No Data' }}</p>
         </div>
         <div v-else class="divide-y divide-[#E5E5E5]">
            <div v-for="(item, index) in trainPlaceList.data" :key="item.id" class="grid grid-cols-[50px_1.5fr_1.5fr_2fr_100px_100px_120px_150px_150px_100px] gap-4 px-6 py-3 hover:bg-[#F9F9F9] items-center text-sm text-[#0D0D0D] transition-colors">
               <div class="text-[#606060]">{{ index + 1 }}</div>
               <div class="font-medium truncate" :title="item.name_zh">{{ item.name_zh }}</div>
               <div class="truncate text-[#606060]" :title="item.place">{{ item.place }}</div>
               <div class="truncate text-[#606060]" :title="item.equipment">{{ item.equipment }}</div>
               <div>{{ item.people_number }}</div>
               <div>
                  <span v-if="item.is_valid === 'Y'" class="px-2 py-1 rounded bg-[#E6F4EA] text-[#137333] text-xs font-medium">{{ l.enabled }}</span>
                  <span v-else class="px-2 py-1 rounded bg-[#FCE8E6] text-[#C5221F] text-xs font-medium">{{ l.disabled }}</span>
               </div>
               <div class="text-[#606060] truncate">{{ item.modify_user }}</div>
               <div class="text-[#606060] truncate">{{ item.modify_dept }}</div>
               <div class="text-[#606060] text-xs">{{ item.modify_time }}</div>
               <div class="flex justify-end gap-3 text-[#606060]">
                 <i class="el-icon-edit text-lg cursor-pointer hover:text-[#065FD4]" :title="l.edit" @click="editPlace(item)"></i>
                 <i v-if="item.is_valid === 'N'" class="el-icon-video-play text-lg cursor-pointer hover:text-[#137333]" :title="l.enable" @click="deletePlace(item)"></i>
                 <i v-else class="el-icon-video-pause text-lg cursor-pointer hover:text-[#C5221F]" :title="l.disable" @click="deletePlace(item)"></i>
               </div>
            </div>
         </div>
      </div>
    </div>

    <!-- Pagination -->
    <div class="flex justify-end p-4 border-t border-[#E5E5E5] bg-white text-xs text-[#606060]">
      <Pagination
        :page="trainPlaceList.form.page"
        :pageSize="trainPlaceList.form.pageSize"
        :total="trainPlaceList.total"
        :l="l"
        @update:page="trainPlaceList.form.page = $event"
        @update:pageSize="trainPlaceList.form.pageSize = $event"
        @change="getTrainPlaceList"
      />
    </div>

    <!-- Add/Edit Drawer -->
    <a-drawer
      :visible="showObj.add_show || showObj.edit_show"
      :title="showObj.add_show ? l.addTrainingPlace : l.editTrainingPlace"
      :width="600"
      @close="closeDrawer"
      :body-style="{ padding: 0 }"
      class="youtube-drawer"
    >
       <div class="flex flex-col h-full bg-white relative">
          <div class="flex-1 overflow-y-auto p-8 custom-scrollbar">
             <div class="space-y-6">
                <!-- Form Inputs -->
                <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                   <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.chineseName }} ({{ c.required }})</label>
                   <input v-model="currentPlace.list.name_zh" class="w-full outline-none text-[#0D0D0D] text-sm" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                     <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.traditionalChineseName }}</label>
                     <input v-model="currentPlace.list.name_tw" class="w-full outline-none text-[#0D0D0D] text-sm" />
                  </div>
                  <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                     <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.englishName }}</label>
                     <input v-model="currentPlace.list.name_en" class="w-full outline-none text-[#0D0D0D] text-sm" />
                  </div>
                </div>

                <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                   <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.vietnameseName }}</label>
                   <input v-model="currentPlace.list.name_vi" class="w-full outline-none text-[#0D0D0D] text-sm" />
                </div>

                <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                   <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.location }} ({{ c.required }})</label>
                   <input v-model="currentPlace.list.place" class="w-full outline-none text-[#0D0D0D] text-sm" />
                </div>

                <div class="relative group border border-[#CCCCCC] rounded px-3 pt-3 pb-2 focus-within:border-[#065FD4] focus-within:ring-1 focus-within:ring-[#065FD4]">
                   <label class="block text-xs text-[#606060] mb-0.5 group-focus-within:text-[#065FD4]">{{ l.capacity }}</label>
                   <input v-model="currentPlace.list.people_number" class="w-full outline-none text-[#0D0D0D] text-sm" />
                </div>

                <!-- Equipment Checkboxes -->
                <div>
                   <h4 class="text-sm font-medium text-[#0D0D0D] mb-2">{{ l.equipmentDetails }}</h4>
                   <div class="flex items-center gap-2 mb-2">
                      <input type="checkbox" :checked="currentPlace.checkAll" @change="handleCheckAllChange" class="accent-[#065FD4]" />
                      <span class="text-sm">{{ l.selectAll }}</span>
                   </div>
                   <div class="grid grid-cols-2 gap-2 pl-4">
                      <label v-for="(item, index) in equipmentOptions" :key="index" class="flex items-center gap-2 cursor-pointer">
                         <input type="checkbox" :value="item" v-model="currentPlace.checkedEquipment" @change="handleCheckedEquipmentChange" class="accent-[#065FD4]" />
                         <span class="text-sm text-[#606060]">{{ item }}</span>
                      </label>
                   </div>
                </div>
             </div>
          </div>

          <div class="p-4 border-t border-[#E5E5E5] flex justify-end gap-2 bg-white z-10">
            <Button variant="ghost" @click="closeDrawer">{{ c.cancel || 'CANCEL' }}</Button>
            <Button variant="primary" @click="submitPlace">{{ l.submit || 'SAVE' }}</Button>
          </div>
       </div>
    </a-drawer>
  </div>
</template>

<script setup>
import { reactive, computed, onMounted, getCurrentInstance } from 'vue'
import { _ } from '@/views/_common'
import { useLocalI18n } from '@/composables/useLocalI18n'
import Button from '../common/Button.vue'
import Pagination from '../common/Pagination.vue'

const { l, c } = useLocalI18n('videoAdminPlace')
const { proxy } = getCurrentInstance()

const equipmentOptions = computed(() => [l.value.computer, l.value.projector, l.value.microphone, l.value.soundSystem, l.value.whiteboard])

const showObj = reactive({
  add_show: false,
  edit_show: false,
})

const trainPlaceList = reactive({
  total: 0,
  data: [],
  form: {
    is_valid: 'Y',
    page: 1,
    pageSize: 15,
    name: '',
    place: ''
  },
})

// Unified state for Add/Edit
const currentPlace = reactive({
  list: {},
  checkAll: false,
  isIndeterminate: true,
  checkedEquipment: [],
})

const getTrainPlaceList = () => {
  proxy.$request(
      proxy.$api.videoServer + '/Video/VideoTrain/getTrainPlace',
      trainPlaceList.form
    )
    .then((r) => {
      trainPlaceList.data = r.data.list
      trainPlaceList.total = r.data.total
    })
    .catch((e) => {
      proxy.$message.error(e.message)
    })
}

const handleCheckAllChange = (e) => {
  const checked = e.target.checked
  currentPlace.checkedEquipment = checked ? equipmentOptions.value : []
  currentPlace.checkAll = checked
  currentPlace.isIndeterminate = false
}

const handleCheckedEquipmentChange = () => {
  const checkedCount = currentPlace.checkedEquipment.length
  currentPlace.checkAll = checkedCount === equipmentOptions.value.length
  currentPlace.isIndeterminate = checkedCount > 0 && checkedCount < equipmentOptions.value.length
}

const addPlace = () => {
  currentPlace.list = {}
  currentPlace.checkedEquipment = []
  currentPlace.checkAll = false
  currentPlace.isIndeterminate = false
  showObj.add_show = true
}

const editPlace = (row) => {
  currentPlace.list = _.cloneDeep(row)
  currentPlace.checkedEquipment = currentPlace.list.equipment?.split(";") || []
  handleCheckedEquipmentChange()
  showObj.edit_show = true
}

const closeDrawer = () => {
  showObj.add_show = false
  showObj.edit_show = false
}

const submitPlace = () => {
  currentPlace.list.equipment = currentPlace.checkedEquipment
  if (!currentPlace.list.name_zh) return proxy.$message.error(l.value.nameCannotBeEmpty)
  if (!currentPlace.list.place) return proxy.$message.error(l.value.locationCannotBeEmpty)

  const isEdit = showObj.edit_show

  const action = () => {
     proxy.$request(
       proxy.$api.videoServer + '/Video/VideoTrain/addTrainPlace',
       currentPlace.list,
       'post'
     ).then((r) => {
       proxy.$message.success(l.value.operationSuccess)
       closeDrawer()
       getTrainPlaceList()
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

const deletePlace = (row) => {
  let item = _.cloneDeep(row)
  item.equipment = item.equipment.split(";")
  item.is_valid = item.is_valid == "Y" ? "N" : "Y"

  if(window.confirm(l.value.confirmStatusChange)) {
    proxy.$request(
       proxy.$api.videoServer + '/Video/VideoTrain/addTrainPlace',
       item,
       'post'
    ).then((r) => {
       proxy.$message.success(l.value.operationSuccess)
       getTrainPlaceList()
    }).catch((e) => {
       proxy.$message.error(l.value.operationFailed)
    })
  }
}

onMounted(() => {
  getTrainPlaceList()
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
