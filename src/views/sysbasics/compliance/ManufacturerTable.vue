<template>
  <div class="w-full h-full bg-white overflow-hidden text-sm dark:bg-black dark:border-gray-700">
    <!-- Empty State -->
    <div v-if="!isLoading && (!data || data.length === 0)" class="flex flex-col items-center justify-center h-96 px-5 py-10 text-gray-400">
      <div class="text-6xl text-gray-300 mb-4">
        <i class="el-icon-document"></i>
      </div>
      <div class="text-base font-medium text-gray-600 mb-2">{{ c.table_empty }}</div>
      <div class="text-sm text-gray-400">Chưa có dữ liệu nhà sản xuất nào được tải</div>
    </div>

    <!-- Table Content -->
    <div v-else class="h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800" ref="scrollArea" @scroll="handleScroll">
      <table class="w-full border-collapse min-w-[1200px] table-fixed bg-white dark:bg-black">
        <thead>
          <tr>
            <th v-for="(col, colIdx) in columns" :key="col.id" :style="getStickyStyle(col, colIdx, true)" :class="[col.className, ' px-2 py-3 font-medium text-sm text-black text-left whitespace-nowrap sticky top-0 z-10 transition-colors dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 border-b border-solid border-gray-200 tracking-wide bg-white', col.freeze ? 'sticky-' + col.freeze : '']">
              <div class="block max-w-full overflow-hidden overflow-ellipsis leading-5" :title="col.title === '#' ? '#' : $t('manufacturer_table.' + col.title)">
                {{ col.title === '#' ? '#' : $t('manufacturer_table.' + col.title) }}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="isLoading">
            <tr v-for="i in 10" :key="'skeleton-' + i" class="animate-pulse">
              <td v-for="(col, colIdx) in columns" :key="col.id" :style="getStickyStyle(col, colIdx, false)" :class="['border-b border-gray-100 px-3 py-3 bg-white text-left whitespace-nowrap transition-colors dark:border-gray-700 dark:bg-black', col.freeze ? 'sticky-' + col.freeze : '']">
                <div class="h-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] rounded animate-[skeleton-loading_1.5s_infinite] dark:from-gray-800 dark:via-gray-700 dark:to-gray-800"></div>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="(item, idx) in data" :key="item.id || idx" class="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-900" @click="handleRowClick(item)" @mouseenter="handleRowHover(item, true)" @mouseleave="handleRowHover(item, false)">
              <td v-for="col in columns" :key="col.id" :class="[col.className, col.freeze ? 'sticky-' + col.freeze : '', 'border-b border-gray-100 px-2 py-3 bg-white text-left whitespace-nowrap transition-colors relative dark:border-gray-700 dark:bg-black']">
                <!-- Index Column -->
                <span v-if="col.id === 'index'" class="font-medium text-black text-xs">{{ idx + 1 + (page.page - 1) * page.pageSize }}</span>

                <!-- Name Column with Tooltip -->
                <div v-else-if="col.id === 'name_en'" class="max-w-[280px]">
                  <el-tooltip effect="dark" :content="item[col.id]" placement="top" :disabled="!item[col.id] || item[col.id].length < 30">
                    <div class="overflow-hidden overflow-ellipsis whitespace-nowrap font-semibold text-black font-bold dark:text-gray-300">{{ item[col.id] || c.empty }}</div>
                  </el-tooltip>
                </div>

                <!-- Address Column -->
                <template v-else-if="col.id === 'address'">
                  <div class="flex items-center gap-2">
                    <el-popover trigger="hover" placement="top" width="280">
                      <div class="max-h-48 overflow-y-auto">
                        <div v-if="item.address && item.address.length > 0" class="flex flex-col gap-2">
                          <div v-for="addr in item.address" :key="addr.id" class="flex items-start gap-2 py-1.5 border-b border-gray-100 text-xs leading-5 last:border-b-0">
                            <i class="el-icon-location-outline text-black mt-0.5 text-sm"></i>
                            <span>{{ addr.address_en }}</span>
                          </div>
                        </div>
                        <div v-else class="text-center text-gray-300 italic py-4">{{ c.empty }}</div>
                      </div>
                      <template slot="reference">
                        <el-button type="text" size="mini" class="!p-1 !px-2 !text-xs !text-blue-500 !border-0 hover:!text-blue-400 hover:!bg-blue-50 dark:hover:!bg-blue-900/20">
                          <i class="el-icon-view mr-1 text-xs"></i>
                          {{ c.view_address }}
                        </el-button>
                      </template>
                    </el-popover>
                    <el-tag v-if="item.address && item.address.length > 0" size="mini" type="info" class="!text-xs !h-4.5 !leading-4 !px-1.5 !rounded-full">
                      {{ item.address.length }}
                    </el-tag>
                  </div>
                </template>

                <!-- Capabilities Column -->
                <template v-else-if="col.id === 'capabilities'">
                  <div class="flex items-center gap-2">
                    <el-popover trigger="hover" placement="top" width="280">
                      <div class="max-h-48 overflow-y-auto">
                        <div v-if="item.address && item.address.length > 0" class="flex flex-col gap-2">
                          <div v-for="capability in item.address" :key="capability.id" class="flex items-start gap-2 py-1.5 border-b border-gray-100 text-xs leading-5 last:border-b-0">
                            <i class="el-icon-cpu text-gray-400 mt-0.5 text-sm"></i>
                            <span>{{ capability.own_processes }}</span>
                          </div>
                        </div>
                        <div v-else class="text-center text-gray-300 italic py-4">{{ c.empty }}</div>
                      </div>
                      <template slot="reference">
                        <el-button type="text" size="mini" class="!p-1 !px-2 !text-xs !text-blue-500 !border-0 hover:!text-blue-400 hover:!bg-blue-50 dark:hover:!bg-blue-900/20">
                          <i class="el-icon-view mr-1 text-xs"></i>
                          {{ c.view_capabilities }}
                        </el-button>
                      </template>
                    </el-popover>
                    <el-tag v-if="item.address && item.address.length > 0" size="mini" type="info" class="!text-xs !h-4.5 !leading-4 !px-1.5 !rounded-full">
                      {{ item.address.length }}
                    </el-tag>
                  </div>
                </template>

                <!-- Status Column -->
                <template v-else-if="col.id === 'authorization_status'">
                  <div class="flex items-center">
                    <el-tag v-if="item[col.id]" :type="getStatusType(item[col.id])" size="small" class="!text-xs !h-6 !leading-5 !px-2 !rounded !font-medium">
                      {{ getStatusText(item[col.id]) }}
                    </el-tag>
                    <span v-else class="text-gray-300 italic text-xs">{{ c.empty }}</span>
                  </div>
                </template>

                <!-- Action Column -->
                <template v-else-if="col.id === 'action'">
                  <div class="flex justify-end items-center">
                    <el-dropdown @command="(cmd) => handleAction(cmd, item)" trigger="click" size="small">
                      <el-button type="text" class="!p-2 !text-gray-500 !border-0 !rounded hover:!text-blue-500 hover:!bg-blue-50 !transition-all dark:hover:!bg-blue-900/20">
                        <i class="el-icon-more"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown" class="!rounded-xl !shadow-lg !p-1.5">
                        <el-dropdown-item command="detail">
                          <i class="el-icon-view w-3.5 text-sm"></i>
                          {{ $t('common.detail') }}
                        </el-dropdown-item>
                        <el-dropdown-item command="edit">
                          <i class="el-icon-edit w-3.5 text-sm"></i>
                          {{ $t('common.edit') }}
                        </el-dropdown-item>
                        <el-dropdown-item command="export">
                          <i class="el-icon-download w-3.5 text-sm"></i>
                          {{ $t('common.export') }}
                        </el-dropdown-item>
                        <el-dropdown-item command="delete" class="!text-red-500 hover:!bg-red-50">
                          <i class="el-icon-delete w-3.5 text-sm"></i>
                          {{ $t('common.delete') }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </template>

                <!-- Default Columns -->
                <template v-else>
                  <div class="text-black dark:text-gray-400">
                    <span v-if="item[col.id] === undefined || item[col.id] === null || item[col.id] === ''" class="text-gray-300 italic text-xs">
                      {{ c.empty }}
                    </span>
                    <span v-else class="text-sm">{{ item[col.id] }}</span>
                  </div>
                </template>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted, getCurrentInstance } from 'vue'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('ManufacturerTable') // Assuming namespace, might need adjustment

const props = defineProps({
  data: {
    type: Array,
    default: () => [],
  },
  isLoading: {
    type: Boolean,
    default: false,
  },
  page: {
    type: Object,
    default: () => ({
      page: 1,
      pageSize: 10,
    }),
  },
})

const emit = defineEmits(['action', 'view', 'row-click', 'row-hover'])

const columns = ref([
  { id: 'index', title: '#', width: 60, textAlign: 'left' },
  { id: 'vendor_code', title: 'vendor_code', width: 140, textAlign: 'left' },
  { id: 'sap_code', title: 'sap_code', width: 140, textAlign: 'left' },
  { id: 'name_en', title: 'partner_english_name', width: 300, textAlign: 'left' },
  { id: 'biz_license_number', title: 'business_registration_number', width: 250, textAlign: 'left' },
  { id: 'capabilities', title: 'overall_capabilities', width: 220, textAlign: 'left' },
  { id: 'authorization_status', title: 'authorization_status', width: 200, textAlign: 'left' },
  { id: 'address', title: 'address', width: 220, textAlign: 'left' },
  { id: 'types_of_orders', title: 'types_of_orders', width: 180, textAlign: 'left' },
  { id: 'action', title: 'action', width: 80, textAlign: 'right', freeze: 'right' },
])

const rowHeight = ref(44)
const scrollTop = ref(0)
const height = ref(400)

const handleScroll = (e) => {
  scrollTop.value = e.target.scrollTop
}

const getStickyStyle = (col, colIdx, isHeader) => {
  if (!col.freeze) return { width: col.width + 'px', textAlign: col.textAlign }
  let style = {
    width: col.width + 'px',
    textAlign: col.textAlign,
    position: 'sticky',
    zIndex: isHeader ? 10 : 2,
    background: isHeader ? '#f9fafb' : '#ffffff',
  }
  if (col.freeze === 'left') {
    let left = 0
    for (let i = 0; i < colIdx; i++) {
      if (columns.value[i].freeze === 'left' || !columns.value[i].freeze) left += columns.value[i].width
    }
    style.left = left + 'px'
  } else if (col.freeze === 'right') {
    let right = 0
    for (let i = columns.value.length - 1; i > colIdx; i--) {
      if (columns.value[i].freeze === 'right' || !columns.value[i].freeze) right += columns.value[i].width
    }
    style.right = right + 'px'
  }
  return style
}

const handleAction = (cmd, row) => {
  emit('action', { action: cmd, row })
}

const handleView = (cmd, row) => {
  emit('view', { action: cmd, row })
}

const handleRowClick = (row) => {
  emit('row-click', row)
}

const handleRowHover = (row, isEnter) => {
  emit('row-hover', { row, isEnter })
}

const getStatusType = (status) => {
  const statusMap = {
    onboarding: 'warning',
    discontinued: 'info',
    in_use: 'success',
  }
  return statusMap[status] || 'default'
}

const getStatusText = (status) => {
  const textMap = {
    onboarding: proxy.$t('manufacturer_table.onboarding'),
    discontinued: proxy.$t('manufacturer_table.discontinued'),
    in_use: proxy.$t('manufacturer_table.in_use'),
  }
  return textMap[status] || status
}
</script>

<style scoped>
/* ===== STICKY COLUMNS CUSTOM STYLES ===== */
.sticky-left {
  position: sticky !important;
  left: 0;
  z-index: 5;
  background: #ffffff !important;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.06);
}

.sticky-right {
  position: sticky !important;
  right: 0;
  z-index: 5;
  background: #ffffff !important;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.06);
}

/* Dark mode sticky backgrounds */
.dark .sticky-left,
.dark .sticky-right {
  background: #000000 !important;
}

/* ===== SKELETON ANIMATION ===== */
@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* ===== SCROLLBAR WEBKIT FALLBACK ===== */
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.scrollbar-thumb-gray-300::-webkit-scrollbar-thumb {
  background: #d1d5db;
  border-radius: 4px;
}

.scrollbar-track-gray-100::-webkit-scrollbar-track {
  background: #f3f4f6;
  border-radius: 4px;
}

.dark .scrollbar-thumb-gray-600::-webkit-scrollbar-thumb {
  background: #4b5563;
}

.dark .scrollbar-track-gray-800::-webkit-scrollbar-track {
  background: #1f2937;
}

/* ===== DROPDOWN MENU ITEM CUSTOM STYLES ===== */
.el-dropdown-menu__item {
  padding: 8px 16px !important;
  font-size: 13px !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  border-radius: 6px !important;
  margin: 2px 0 !important;
}

.el-dropdown-menu__item:hover {
  background: #f3f4f6 !important;
}

.el-dropdown-menu__item.is-disabled {
  color: #c0c4cc !important;
}

/* ===== RESPONSIVE ADJUSTMENTS ===== */
@media (max-width: 1200px) {
  table {
    font-size: 13px;
  }

  th,
  td {
    padding: 8px;
  }
}
</style>
