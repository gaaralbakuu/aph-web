<template>
  <div class="w-full h-full bg-white overflow-hidden text-sm dark:bg-black dark:border-gray-700">
    <!-- Empty State -->
    <div v-if="!isLoading && (!data || data.length === 0)" class="flex flex-col items-center justify-center h-96 px-5 py-10 text-gray-400">
      <div class="text-6xl text-gray-300 mb-4">
        <i class="el-icon-document"></i>
      </div>
      <div class="text-base font-medium text-gray-600 mb-2">{{ $c.table_empty }}</div>
      <div class="text-sm text-gray-400">{{ $t('improveManagement_table.no_data') }}</div>
    </div>

    <!-- Table Content -->
    <div v-else class="h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800" ref="scrollArea" @scroll="handleScroll">
      <table class="w-full border-collapse min-w-[1200px] table-fixed bg-white dark:bg-black">
        <thead>
          <tr>
            <th v-for="(col, colIdx) in columns" :key="col.id" :style="getStickyStyle(col, colIdx, true)" :class="[col.className, ' px-2 py-3 font-medium text-sm text-black text-left whitespace-nowrap sticky top-0 z-10 transition-colors dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 border-b border-solid border-gray-200 tracking-wide bg-white', col.freeze ? 'sticky-' + col.freeze : '']">
              <div class="block max-w-full overflow-hidden overflow-ellipsis leading-5" :title="col.title === '#' ? '#' : $t('improveManagement_table.' + col.title)">
                {{ col.title === '#' ? '#' : $t('improveManagement_table.' + col.title) }}
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
                    <div class="overflow-hidden overflow-ellipsis whitespace-nowrap text-black font-bold dark:text-gray-300">{{ item[col.id] || $c.empty }}</div>
                  </el-tooltip>
                </div>

                <!-- Status Column -->
                <template v-else-if="col.id === 'percent_closed_ti'">
                  <div class="flex items-center">{{ item['finish'] > 0 ? ((item['finish'] / item['total_issue']) * 100).toFixed(2) : 0 }}%</div>
                </template>

                <!-- Action Column -->
                <template v-else-if="col.id === 'action'">
                  <div class="flex justify-end items-center">
                    <button type="button" class="rounded-full px-3 py-1 flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-300 font-normal text-xs" @click="handleAction('detail', item)">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      </svg>

                      <span>{{ $l.view_detail || 'Xem' }}</span>
                    </button>
                  </div>
                </template>

                <!-- Default Columns -->
                <template v-else>
                  <div class="text-black dark:text-gray-400">
                    <span v-if="item[col.id] === undefined || item[col.id] === null || item[col.id] === ''" class="text-gray-300 italic text-xs">
                      {{ $c.empty }}
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

<script>
/*
  Chú ý: Các text hiển thị đều lấy từ file ngôn ngữ qua $l.key.
  Nếu muốn custom thêm cột, sửa columns phía dưới và bổ sung key vào file ngôn ngữ.
*/

export default {
  name: 'improveManagement_table',
  props: {
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
        pageSize: 15,
      }),
    },
  },
  data() {
    return {
      columns: [
        { id: 'index', title: '#', width: 60, textAlign: 'left' },
        { id: 'name_en', title: 'factory_name', width: 260, textAlign: 'left' },
        { id: 'vendor_code', title: 'vendor_code', width: 160, textAlign: 'left' },
        { id: 'audit_time', title: 'audit_date', width: 160, textAlign: 'left' },
        { id: 'total_issue', title: 'total_threshold_issues', width: 180, textAlign: 'left' },
        { id: 'finish', title: 'number_of_closed_ti', width: 180, textAlign: 'left' },
        { id: 'percent_closed_ti', title: 'percent_closed_ti', width: 140, textAlign: 'left' },
        { id: 'last_date', title: 'last_updated', width: 160, textAlign: 'left' },
        { id: 'action', title: 'action', width: 100, textAlign: 'right', freeze: 'right' },
      ],
      rowHeight: 44,
      scrollTop: 0,
      height: 400, // mặc định, có thể truyền prop hoặc tính toán động
    }
  },
  computed: {},
  methods: {
    handleScroll(e) {
      this.scrollTop = e.target.scrollTop
    },
    getStickyStyle(col, colIdx, isHeader) {
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
          if (this.columns[i].freeze === 'left' || !this.columns[i].freeze) left += this.columns[i].width
        }
        style.left = left + 'px'
      } else if (col.freeze === 'right') {
        let right = 0
        for (let i = this.columns.length - 1; i > colIdx; i--) {
          if (this.columns[i].freeze === 'right' || !this.columns[i].freeze) right += this.columns[i].width
        }
        style.right = right + 'px'
      }
      return style
    },
    handleAction(cmd, row) {
      this.$emit('action', { action: cmd, row })
    },
    handleView(cmd, row) {
      this.$emit('view', { action: cmd, row })
    },
    handleRowClick(row) {
      this.$emit('row-click', row)
    },
    handleRowHover(row, isEnter) {
      this.$emit('row-hover', { row, isEnter })
    },
    getStatusType(status) {
      const statusMap = {
        onboarding: 'warning',
        discontinued: 'info',
        in_use: 'success',
      }
      return statusMap[status] || 'default'
    },
    getStatusText(status) {
      const textMap = {
        onboarding: this.$t('improveManagement_table.onboarding'),
        discontinued: this.$t('improveManagement_table.discontinued'),
        in_use: this.$t('improveManagement_table.in_use'),
      }
      return textMap[status] || status
    },
  },
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

/* Header sticky backgrounds */
/* th.sticky-right {
  background: #f9fafb !important;
}

th.sticky-left {
  background: #f9fafb !important;
}

.dark th.sticky-left,
.dark th.sticky-right {
  background: #111827 !important;
} */

/* Hover state for sticky columns */
/* tr:hover .sticky-left,
tr:hover .sticky-right {
  background: #f9fafb !important;
} */

/* .dark tr:hover .sticky-left,
.dark tr:hover .sticky-right {
  background: #111827 !important;
} */

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
