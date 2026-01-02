<template>
  <a-drawer
    :visible="visible"
    :width="720"
    :closable="false"
    :mask-closable="true"
    @close="handleClose"
    class="manufacturer-drawer"
    :body-style="{ padding: 0, height: '100%', display: 'flex', flexDirection: 'column' }"
  >
    <!-- Header -->
    <div class="px-6 py-4 border-b border-[#E5E5E5] flex justify-between items-center bg-white">
      <h2 class="text-lg font-medium text-[#0D0D0D] mb-0!">{{ l.selectManufacturer || 'Select Manufacturer' }}</h2>
      <button class="text-[#606060] hover:text-[#0D0D0D] transition-colors cursor-pointer" @click="handleClose">
        <i class="el-icon-close text-xl font-bold"></i>
      </button>
    </div>

    <!-- Content -->
    <div class="flex-1 flex flex-col bg-white overflow-hidden">
        <!-- Search Bar -->
        <div class="p-4 border-b border-[#E5E5E5] bg-[#FAFAFA]">
          <div class="relative group border border-[#CCCCCC] rounded px-3 py-2 bg-white focus-within:border-[#065FD4] shadow-sm">
            <i class="el-icon-search text-[#606060] absolute left-3 top-1/2 -translate-y-1/2"></i>
            <input
              v-model="query.manufacture_name"
              class="w-full pl-6 outline-none text-sm text-[#0D0D0D] border-none bg-transparent"
              :placeholder="l.manufacture_name || 'Search Manufacturer'"
              @keyup.enter="handleSearch"
              @change="handleSearch"
            >
          </div>
        </div>

        <!-- Result List -->
        <div class="flex-1 overflow-y-auto custom-scrollbar relative" v-loading="loading">
           <!-- Header Row -->
           <div class="grid grid-cols-[1fr_100px] gap-2 px-6 py-2 bg-[#F9F9F9] border-b border-[#E5E5E5] text-xs font-medium text-[#606060]">
               <div>{{ l.manufacture_name || 'Manufacturer Name' }}</div>
               <div class="text-center">{{ c.operation || 'Operation' }}</div>
           </div>

           <!-- Rows -->
           <div v-if="list.length > 0">
             <div v-for="item in list" :key="item.manufacture_id"
                  class="grid grid-cols-[1fr_100px] gap-2 px-6 py-3 border-b border-[#F0F0F0] hover:bg-[#F0F8FF] group cursor-pointer items-center transition-colors"
                  @click="selectItem(item)">
                  <div class="text-sm font-medium text-[#0D0D0D] truncate">{{ item.name_en }}</div>
                  <div class="text-center">
                    <button class="bg-[#065FD4] text-white! px-3 py-1 text-xs font-medium uppercase rounded hover:bg-[#0056BF] transition-colors shadow-sm opacity-0 group-hover:opacity-100 cursor-pointer" @click.stop="selectItem(item)">
                       {{ l.select || 'Select' }}
                    </button>
                  </div>
             </div>
           </div>
           <div v-else class="flex flex-col items-center justify-center h-40 text-[#999999] text-sm">
              <i class="el-icon-office-building text-2xl mb-2"></i>
              {{ l.noData || 'No manufacturers found' }}
           </div>
        </div>

        <!-- Pagination -->
        <div class="p-2 border-t border-[#E5E5E5] bg-white">
           <el-pagination
              small
              layout="prev, pager, next, total"
              :total="query.total"
              :page-size.sync="query.pageSize"
              :current-page.sync="query.page"
              @current-change="handleSearch"
           ></el-pagination>
        </div>
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
  }
})

const emit = defineEmits(['update:visible', 'select'])

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('accountManagement')

const loading = ref(false)
const list = ref([])
const query = reactive({
  manufacture_name: '',
  pageSize: 15,
  page: 1,
  total: 0
})

const apiManufacturer = api.ComplianceManufacturer + 'getlist'

const handleSearch = () => {
  loading.value = true
  proxy.$request(apiManufacturer, query, 'get')
    .then(r => {
       list.value = r.data.list
       query.total = r.data.total
       loading.value = false
    })
    .catch(() => {
      loading.value = false
    })
}

const selectItem = (item) => {
    emit('select', item)
    handleClose()
}

const handleClose = () => {
  emit('update:visible', false)
}

watch(() => props.visible, (val) => {
  if (val) {
    query.manufacture_name = ''
    query.page = 1
    handleSearch()
  }
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
