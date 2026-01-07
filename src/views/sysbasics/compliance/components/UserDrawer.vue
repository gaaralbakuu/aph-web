<template>
  <a-drawer
    :visible="visible"
    :width="720"
    :closable="false"
    :mask-closable="true"
    @close="handleClose"
    class="user-drawer"
    :body-style="{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }"
  >
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white">
      <h2 class="text-lg font-medium text-[#0D0D0D] mb-0!">{{ l.selectUsers || 'Select Users' }}</h2>
      <button class="text-[#606060] hover:text-[#0D0D0D] transition-colors cursor-pointer" @click="handleClose">
        <i class="el-icon-close text-xl font-bold"></i>
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left: Search & Result List -->
      <div class="flex-1 flex flex-col border-r border-[#E5E5E5] bg-white w-1/2">
        <!-- Search Bar -->
        <div class="p-4 border-b border-[#E5E5E5] bg-[#FAFAFA]">
          <div class="relative group border border-[#CCCCCC] rounded px-3 py-2 bg-white focus-within:border-[#065FD4] shadow-sm">
            <i class="el-icon-search text-[#606060] absolute left-3 top-1/2 -translate-y-1/2"></i>
            <input
              v-model="searchQuery.queryString"
              class="w-full pl-6 outline-none text-sm text-[#0D0D0D] border-none bg-transparent"
              :placeholder="l.searchUsers || 'Search users by ID or Name'"
              @keyup.enter="handleSearch"
            >
          </div>
        </div>

        <!-- Result List -->
        <div class="flex-1 overflow-y-auto custom-scrollbar relative" v-loading="loading">
           <!-- Header Row -->
           <div class="grid grid-cols-[1fr_2fr_40px] gap-2 px-4 py-2 bg-[#F9F9F9] border-b border-[#E5E5E5] text-xs font-medium text-[#606060]">
               <div>{{ l.userid || 'User ID' }}</div>
               <div>{{ l.username || 'Username' }}</div>
               <div class="text-center"></div>
           </div>

           <!-- Rows -->
           <div v-if="searchList.length > 0">
             <div v-for="user in searchList" :key="user.userid"
                  class="grid grid-cols-[1fr_2fr_40px] gap-2 px-4 py-3 border-b border-[#F0F0F0] hover:bg-[#F0F8FF] group cursor-pointer items-center transition-colors"
                  @click="addToSelected(user)">
                  <div class="text-xs text-[#606060] truncate">{{ user.userid }}</div>
                  <div class="text-sm font-medium text-[#0D0D0D] truncate">{{ user.username }}</div>
                  <div class="text-center">
                    <i v-if="isSelected(user)" class="el-icon-check text-[#069C56] font-bold"></i>
                    <i v-else class="el-icon-plus text-[#065FD4] opacity-0 group-hover:opacity-100 font-bold transition-opacity"></i>
                  </div>
             </div>
           </div>
           <div v-else class="flex flex-col items-center justify-center h-40 text-[#999999] text-sm">
              <i class="el-icon-search text-2xl mb-2"></i>
              {{ l.noData || 'No users found' }}
           </div>
        </div>

        <!-- Pagination -->
        <div class="p-2 border-t border-[#E5E5E5] bg-white">
           <el-pagination
              small
              layout="prev, pager, next"
              :total="searchTotal"
              v-model:page-size="searchQuery.size"
              v-model:current-page="searchQuery.page"
              @current-change="handleSearch"
           ></el-pagination>
        </div>
      </div>

      <!-- Right: Selected List -->
      <div class="flex-1 flex flex-col bg-[#F9F9F9] w-1/2">
        <div class="px-4 py-3 border-b border-[#E5E5E5] bg-[#F9F9F9] flex justify-between items-center h-[69px]">
          <div class="flex items-center gap-2">
             <span class="text-sm font-medium text-[#0D0D0D]">{{ l.selected || 'Selected' }}</span>
             <span class="bg-[#E5E5E5] text-[#606060] text-xs px-2 py-0.5 rounded-full font-bold">{{ selectedList.length }}</span>
          </div>
          <button v-if="selectedList.length > 0" class="text-[#CC0000] text-xs hover:underline cursor-pointer" @click="clearSelected">{{ l.clearAll || 'Clear All' }}</button>
        </div>

        <div class="flex-1 overflow-y-auto custom-scrollbar p-2">
           <div v-if="selectedList.length > 0" class="flex flex-col gap-2">
              <div v-for="(user, index) in selectedList" :key="user.userid" class="flex items-center justify-between p-3 bg-white border border-[#E5E5E5] rounded shadow-sm group">
                 <div class="flex flex-col min-w-0">
                    <span class="text-sm font-medium text-[#0D0D0D] truncate">{{ user.username }}</span>
                    <span class="text-xs text-[#606060] truncate">{{ user.userid }}</span>
                 </div>
                 <button class="text-[#999999] hover:text-[#CC0000] transition-colors p-1 cursor-pointer" @click="removeSelected(index)">
                    <i class="el-icon-close font-bold"></i>
                 </button>
              </div>
           </div>
           <div v-else class="flex flex-col items-center justify-center h-full text-[#999999] text-sm">
              <i class="el-icon-user text-3xl text-[#E5E5E5] mb-2"></i>
              {{ l.noUsersSelected || 'No users selected' }}
           </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="px-6 py-4 border-t border-[#E5E5E5] bg-white flex justify-end gap-3">
       <button class="px-4 py-2 text-sm font-medium text-[#606060] hover:bg-[#F2F2F2] rounded uppercase transition-colors cursor-pointer" @click="handleClose">
          {{ c.cancel || 'Cancel' }}
       </button>
       <button class="px-6 py-2 text-sm font-medium text-white! bg-[#065FD4] hover:bg-[#0056BF] rounded uppercase shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          :disabled="selectedList.length === 0"
          @click="handleSubmit">
          {{ c.confirm || 'Confirm' }}
       </button>
    </div>
  </a-drawer>
</template>

<script setup>
import { ref, reactive, watch, getCurrentInstance, onMounted } from 'vue'
import { useLocalI18n } from '@/composables/useLocalI18n'
import { _, api } from '@/views/_common'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  useridList: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:visible', 'update:useridList', 'submmit'])

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('adminRole') // Reusing namespace or use common

const loading = ref(false)
const searchList = ref([])
const searchTotal = ref(0)
const selectedList = ref([])

const searchQuery = reactive({
  queryString: '',
  page: 1,
  size: 20,
  status: 0
})

const apiUser = api.user

const handleSearch = () => {
  loading.value = true
  proxy.$request(apiUser + 'getlist', searchQuery)
    .then(res => {
       searchList.value = res.data.list
       searchTotal.value = res.data.total
       loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}

const isSelected = (user) => {
  return selectedList.value.some(u => u.userid === user.userid)
}

const addToSelected = (user) => {
  if (!isSelected(user)) {
    selectedList.value.push(user)
  }
}

const removeSelected = (index) => {
  selectedList.value.splice(index, 1)
}

const clearSelected = () => {
  selectedList.value = []
}

const handleClose = () => {
  emit('update:visible', false)
}

const handleSubmit = () => {
  const ids = selectedList.value.map(u => u.userid)
  emit('update:useridList', ids)
  emit('submmit')
}

// Watch visibility to reset or fetch data
watch(() => props.visible, (val) => {
  if (val) {
    searchQuery.queryString = ''
    searchQuery.page = 1
    selectedList.value = [] // Start fresh or logic to prepopulate if needed?
    // Usually "Add Users" implies adding new ones, not editing existing list.
    // existing logic in Role.vue passes 'addUsers' which is initially empty.
    handleSearch()
  }
})

// Initialize
onMounted(() => {
    // optional
})

</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: #E5E5E5;
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: #CCCCCC;
}
</style>
