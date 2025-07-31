<template>
  <div class="w-full h-full bg-white overflow-hidden text-sm dark:bg-black dark:border-gray-700">
    <!-- Empty State -->
    <div v-if="!isLoading && (!data || data.length === 0)" class="flex flex-col items-center justify-center h-96 px-5 py-10 text-gray-400">
      <div class="text-6xl text-gray-300 mb-4">
        <i class="el-icon-document"></i>
      </div>
      <div class="text-base font-medium text-gray-600 mb-2">{{ $c.table_empty }}</div>
      <div class="text-sm text-gray-400">{{ $c.no_data }}</div>
    </div>

    <!-- Table Content -->
    <div v-else class="h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800" ref="scrollArea" @scroll="handleScroll">
      <table class="w-full border-collapse min-w-[1200px] table-fixed bg-white dark:bg-black">
        <thead class="bg-white">
          <!-- First header row - parent columns -->
          <tr class="bg-white">
            <th v-for="(col, colIdx) in columns" :key="col.id + '_main'" :style="getStickyStyle(col, colIdx, true)" :class="[col.className, ' px-2 py-3 font-medium text-sm text-black text-left whitespace-nowrap sticky top-0 z-10 transition-colors bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 tracking-wide', col.freeze ? 'sticky-' + col.freeze : '']" :colspan="getColSpan(col)" :rowspan="shouldHaveRowSpan(col) ? getMaxRowSpan() : undefined">
              <div class="block max-w-full overflow-hidden overflow-ellipsis leading-5" :title="col.title === '#' ? '#' : $l[col.title]">
                {{ col.title === '#' ? '#' : $l[col.title] || col.title }}
              </div>
            </th>
          </tr>
          
          <!-- Second header row - child columns (only render if maxRowSpan > 1) -->
          <tr v-if="getMaxRowSpan() > 1" class="bg-white">
            <template v-for="(col, colIdx) in columns">
              <!-- If column has children, render each child -->
              <template v-if="col.children && col.children.length > 0">
                <th v-for="(childCol, childIdx) in col.children" :key="childCol.id" :style="getStickyStyleForChild(col, childCol, colIdx, childIdx, true)" :class="[childCol.className, ' px-2 py-3 font-medium text-sm text-black text-left whitespace-nowrap sticky z-10 transition-colors bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 tracking-wide', col.freeze ? 'sticky-' + col.freeze : '']" style="top: 44px;">
                  <div v-if="childCol.id === 'current_year'" class="block max-w-full overflow-hidden overflow-ellipsis leading-5">
                    {{ new Date().getFullYear() }}
                  </div>
                  <div v-else-if="childCol.id === 'last_year'" class="block max-w-full overflow-hidden overflow-ellipsis leading-5">
                    {{ new Date().getFullYear() - 1 }}
                  </div>
                  <div v-else class="block max-w-full overflow-hidden overflow-ellipsis leading-5" :title="$l[childCol.title]">
                    {{ $l[childCol.title] || childCol.title }}
                  </div>
                </th>
              </template>
              <!-- Columns without children don't render anything in second row (they use rowspan) -->
            </template>
          </tr>
        </thead>
        <tbody>
          <template v-if="isLoading">
            <tr v-for="i in 10" :key="'skeleton-' + i" class="animate-pulse">
              <td v-for="(col, colIdx) in getFlattenedColumns()" :key="col.id" :style="getStickyStyleForFlattened(col, colIdx, false)" :class="['border-b border-gray-100 px-3 py-3 bg-white text-left whitespace-nowrap transition-colors dark:border-gray-700 dark:bg-black', col.freeze ? 'sticky-' + col.freeze : '']">
                <div class="h-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] rounded animate-[skeleton-loading_1.5s_infinite] dark:from-gray-800 dark:via-gray-700 dark:to-gray-800"></div>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="(item, idx) in data" :key="item.id || idx" class="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-900" @click="handleRowClick(item)" @mouseenter="handleRowHover(item, true)" @mouseleave="handleRowHover(item, false)">
              <td v-for="(col, colIdx) in getFlattenedColumns()" :key="col.id" :class="[col.className, col.freeze ? 'sticky-' + col.freeze : '', 'border-b border-gray-100 px-2 py-3 bg-white text-left whitespace-nowrap transition-colors relative dark:border-gray-700 dark:bg-black text-xs']" :style="getStickyStyleForFlattened(col, colIdx, false)">
                <!-- Index Column -->
                <span v-if="(col.originalId || col.id) === 'index'" class="font-medium text-black text-xs">{{ idx + 1 + (page.page - 1) * page.pageSize }}</span>

                <!-- Name Column with Tooltip -->
                <div v-else-if="(col.originalId || col.id) === 'issue_type'" class="max-w-[500px]" :title="item[col.originalId || col.id]">
                  <div class="text-black text-xs line-clamp-2 whitespace-normal h-8">{{ item[col.originalId || col.id] || $c.empty }}</div>
                </div>

                <div v-else-if="(col.originalId || col.id) === 'subheader'" class="max-w-[500px]" :title="item[col.originalId || col.id]">
                  <div v-if="item[col.originalId || col.id]" class="text-black text-xs line-clamp-2 whitespace-normal h-8">{{ item[col.originalId || col.id] }}</div>
                  <div v-else class="text-gray-300 italic text-xs">
                    {{ $c.empty }}
                  </div>
                </div>
                <div v-else-if="(col.originalId || col.id) === 'name_en'" class="max-w-[200px]" :title="item[col.originalId || col.id]">
                  <div v-if="item[col.originalId || col.id]" class="text-black text-xs line-clamp-2 whitespace-normal h-8">{{ item[col.originalId || col.id] }}</div>
                  <div v-else class="text-gray-300 italic text-xs">
                    {{ $c.empty }}
                  </div>
                </div>
                <div v-else-if="(col.originalId || col.id) === 'audit_explanation'" class="max-w-[500px]" :title="item[col.originalId || col.id]">
                  <div v-if="item[col.originalId || col.id]" class="text-black text-xs line-clamp-2 whitespace-normal h-8">{{ item[col.originalId || col.id] }}</div>
                  <div v-else class="text-gray-300 italic text-xs">
                    {{ $c.empty }}
                  </div>
                </div>
                <div v-else-if="(col.originalId || col.id) === 'corrective_action_plan'" class="max-w-[500px]" :title="item[col.originalId || col.id]">
                  <div v-if="item[col.originalId || col.id]" class="text-black text-xs line-clamp-2 whitespace-normal h-8">{{ item[col.originalId || col.id] }}</div>
                  <div v-else class="text-gray-300 italic text-xs">
                    {{ $c.empty }}
                  </div>
                </div>

                <!-- Deadline Column -->
                <template v-else-if="(col.originalId || col.id) === 'corrective_date'">
                  <span v-if="item[col.originalId || col.id]" class="text-xs whitespace-normal">{{ formatDate(item[col.originalId || col.id]) }}</span>
                  <span v-else class="text-gray-300 italic text-xs">
                    {{ $c.empty }}
                  </span>
                </template>

                <!-- Status Column -->
                <template v-else-if="(col.originalId || col.id) === 'status'">
                  <el-tag v-if="item[col.originalId || col.id]" :type="getStatusType(item[col.originalId || col.id])" size="small" class="!text-xs !h-6 !leading-5 !px-2 !rounded !font-medium">
                    {{ getStatusText(item[col.originalId || col.id]) }}
                  </el-tag>
                  <span v-else class="text-gray-300 italic text-xs">
                    {{ $c.empty }}
                  </span>
                </template>

                <!-- Current year Column -->
                <template v-else-if="col.id === 'current_year'">
                  <div :class="['flex max-w-full overflow-hidden overflow-ellipsis leading-5 items-center gap-1']">
                    <div :class="['w-3 h-3 rounded-full', getPercentColor(item[col.id] / 100).main]"></div>
                    <div :class="['px-3', getPercentColor(item[col.id] / 100).sub]">{{ item[col.id] }}%</div>
                  </div>
                </template>

                <!-- Last year Column -->
                <template v-else-if="col.id === 'last_year'">
                  <div :class="['flex max-w-full overflow-hidden overflow-ellipsis leading-5 items-center gap-1']">
                    <div :class="['w-3 h-3 rounded-full', getPercentColor(item[col.id] / 100).main]"></div>
                    <div :class="['px-3', getPercentColor(item[col.id] / 100).sub]">{{ item[col.id] }}%</div>
                  </div>
                </template>

                <!-- Action Column -->
                <template v-else-if="(col.originalId || col.id) === 'action'">
                  <div class="flex justify-end items-center">
                    <el-button
                      type="text"
                      class="!p-2 !text-gray-500 !border-0 !rounded hover:!text-blue-500 hover:!bg-blue-50 !transition-all dark:hover:!bg-blue-900/20"
                      @click="handleAction('history', item)"
                    >
                      <i class="el-icon-date w-3.5 text-sm text-gray-400"></i>
                    </el-button>
                  </div>
                </template>

                <!-- Default Columns -->
                <template v-else>
                  <div class="text-black dark:text-gray-400 line-clamp-2">
                    <span v-if="item[col.originalId || col.id] === undefined || item[col.originalId || col.id] === null || item[col.originalId || col.id] === ''" class="text-gray-300 italic text-xs">
                      {{ $c.empty }}
                    </span>
                    <span v-else class="text-xs whitespace-normal">{{ item[col.originalId || col.id] }}</span>
                  </div>
                </template>
              </td>
            </tr>
          </template>
          <!-- Average Row -->
          <tr v-if="!isLoading && data && data.length > 0" class="dark:bg-gray-800 font-medium border-t-2 border-gray-200 dark:border-gray-600 bg-yellow-100 sticky bottom-0 z-50">
            <!-- First 4 columns merged for Average title -->
            <td colspan="4" class="border-b border-gray-100 px-2 py-3 bg-yellow-100 text-center whitespace-nowrap transition-colors dark:border-gray-700 dark:bg-gray-800 text-xs font-medium">
              <span class="text-gray-600 dark:text-gray-300 font-semibold">{{ $l.average }}</span>
            </td>
            <!-- Last year average -->
            <td class="border-b border-gray-100 px-2 py-3 bg-yellow-100 text-left whitespace-nowrap transition-colors dark:border-gray-700 dark:bg-gray-800 text-xs font-medium">
              <div :class="['flex max-w-full overflow-hidden overflow-ellipsis leading-5 items-center gap-1']">
                <div :class="['w-3 h-3 rounded-full', getPercentColor(getAverageLastYear() / 100).main]"></div>
                <div :class="['px-3', getPercentColor(getAverageLastYear() / 100).sub]">{{ getAverageLastYear() }}%</div>
              </div>
            </td>
            <!-- Current year average -->
            <td class="border-b border-gray-100 px-2 py-3 bg-yellow-100 text-left whitespace-nowrap transition-colors dark:border-gray-700 dark:bg-gray-800 text-xs font-medium">
              <div :class="['flex max-w-full overflow-hidden overflow-ellipsis leading-5 items-center gap-1']">
                <div :class="['w-3 h-3 rounded-full', getPercentColor(getAverageCurrentYear() / 100).main]"></div>
                <div :class="['px-3', getPercentColor(getAverageCurrentYear() / 100).sub]">{{ getAverageCurrentYear() }}%</div>
              </div>
            </td>
            <!-- Remaining columns -->
            <td class="border-b border-gray-100 px-2 py-3 bg-yellow-100 text-right whitespace-nowrap transition-colors dark:border-gray-700 dark:bg-gray-800 text-xs font-medium">
              <span class="text-gray-500 dark:text-gray-400">{{ $c.dash }}</span>
            </td>
            <td class="border-b border-gray-100 px-2 py-3 bg-yellow-100 text-right whitespace-nowrap transition-colors dark:border-gray-700 dark:bg-gray-800 text-xs font-medium">
              <span class="text-gray-500 dark:text-gray-400">{{ $c.dash }}</span>
            </td>
            <td class="border-b border-gray-100 px-2 py-3 bg-yellow-100 text-right whitespace-nowrap transition-colors dark:border-gray-700 dark:bg-gray-800 text-xs font-medium">
              <span class="text-gray-500 dark:text-gray-400">{{ $c.dash }}</span>
            </td>
            <td class="border-b border-gray-100 px-2 py-3 bg-yellow-100 text-right whitespace-nowrap transition-colors dark:border-gray-700 dark:bg-gray-800 text-xs font-medium">
              <span class="text-gray-500 dark:text-gray-400">{{ $c.dash }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
/*
  Chú ý: 
  - Các text hiển thị đều lấy từ file ngôn ngữ qua $l.key và $c.key.
  - Tiêu đề cột được lấy từ $l[col.title]
  - Text thông thường (empty, dash, no_data) được lấy từ $c[key]
  - Nếu muốn custom thêm cột, sửa columns và bổ sung key vào tất cả file ngôn ngữ.
*/

export default {
  name: 'investigation_table',
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
        pageSize: 10,
      }),
    },
    showAuth: {
      type: Object,
      default: () => ({
        m_add: false,
        m_search: false,
        m_del: false,
        m_updata: false,
        m_import: false,
        m_export: false,
        m_upload: false,
        m_audit: false,
      }),
    },
  },
  data() {
    return {
      columns: [
        { id: 'index', title: '#', width: 60, textAlign: 'left' },
        { id: 'vendor_code', title: 'vendor_code', width: 120, textAlign: 'left' },
        { id: 'sap_code', title: 'sap_code', width: 180, textAlign: 'left' },
        { id: 'name_en', title: 'name_en', width: 300, textAlign: 'left' },
        {
          id: 'improvement_rate',
          title: 'improvement_rate',
          width: 200,
          textAlign: 'left',
          children: [
            { id: 'last_year', title: 'last_year', width: 100, textAlign: 'left' },
            { id: 'current_year', title: 'current_year', width: 100, textAlign: 'left' },
          ],
        },
        { id: 'official_reminder_number', title: 'official_reminder_number', width: 150, textAlign: 'right' },
        { id: 'warning_letter_number', title: 'warning_letter_number', width: 150, textAlign: 'right' },
        { id: 'audit_count', title: 'audit_count', width: 120, textAlign: 'right' },
        { id: 'action', title: 'action', width: 100, textAlign: 'right', freeze: 'right' },
      ],
      rowHeight: 44,
      scrollTop: 0,
      height: 400, // mặc định, có thể truyền prop hoặc tính toán động
    }
  },
  methods: {
    // Tính toán maxRowSpan dựa trên việc có cột nào có children hay không
    getMaxRowSpan() {
      const hasChildrenColumns = this.columns.some(col => col.children && col.children.length > 0)
      return hasChildrenColumns ? 2 : 1
    },

    // Tính toán số lượng colspan cho mỗi cột
    getColSpan(col) {
      if (col.children && col.children.length > 0) {
        return col.children.length
      }
      // Cột không có children thì colspan = 1 (không cần span)
      return 1
    },
    
    // Kiểm tra xem cột có children hay không (để quyết định có rowspan hay không)
    shouldHaveRowSpan(col) {
      return !col.children || col.children.length === 0
    },
    
    // Tính toán tổng width của tất cả children columns
    getTotalChildrenWidth(col) {
      if (col.children && col.children.length > 0) {
        return col.children.reduce((sum, child) => sum + child.width, 0)
      }
      return col.width
    },
    
    // Tính toán sticky style cho child columns
    getStickyStyleForChild(parentCol, childCol, parentColIdx, childIdx, isHeader) {
      if (!parentCol.freeze) return { width: childCol.width + 'px', textAlign: childCol.textAlign }
      
      let style = {
        width: childCol.width + 'px',
        textAlign: childCol.textAlign,
        position: 'sticky',
        zIndex: isHeader ? 10 : 2,
        background: isHeader ? '#f9fafb' : '#ffffff',
      }
      
      if (parentCol.freeze === 'left') {
        let left = 0
        // Tính toán left dựa trên tất cả các cột bên trái
        for (let i = 0; i < parentColIdx; i++) {
          left += this.columns[i].width
        }
        // Thêm width của các child trước đó trong cùng parent
        for (let j = 0; j < childIdx; j++) {
          left += parentCol.children[j].width
        }
        style.left = left + 'px'
      } else if (parentCol.freeze === 'right') {
        let right = 0
        // Tính toán right dựa trên tất cả các cột bên phải
        for (let i = this.columns.length - 1; i > parentColIdx; i--) {
          right += this.columns[i].width
        }
        // Thêm width của các child sau trong cùng parent
        for (let j = parentCol.children.length - 1; j > childIdx; j--) {
          right += parentCol.children[j].width
        }
        style.right = right + 'px'
      }
      return style
    },
    
    // Flatten columns cho việc render tbody
    getFlattenedColumns() {
      const flattened = []
      this.columns.forEach(col => {
        if (col.children && col.children.length > 0) {
          // Nếu có children, thêm tất cả children
          col.children.forEach(child => {
            flattened.push({
              ...child,
              parentId: col.id,
              freeze: col.freeze // Kế thừa freeze từ parent
            })
          })
        } else {
          // Nếu không có children, chỉ thêm 1 cột (không cần span nhiều cột)
          flattened.push({
            ...col,
            originalId: col.id
          })
        }
      })
      return flattened
    },
    
    // Tính toán sticky style cho flattened columns
    getStickyStyleForFlattened(col, colIdx, isHeader) {
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
        const flattenedCols = this.getFlattenedColumns()
        for (let i = 0; i < colIdx; i++) {
          if (flattenedCols[i].freeze === 'left' || !flattenedCols[i].freeze) {
            left += flattenedCols[i].width
          }
        }
        style.left = left + 'px'
      } else if (col.freeze === 'right') {
        let right = 0
        const flattenedCols = this.getFlattenedColumns()
        for (let i = flattenedCols.length - 1; i > colIdx; i--) {
          if (flattenedCols[i].freeze === 'right' || !flattenedCols[i].freeze) {
            right += flattenedCols[i].width
          }
        }
        style.right = right + 'px'
      }
      return style
    },
    
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
          if (this.columns[i].freeze === 'left' || !this.columns[i].freeze) {
            left += this.columns[i].width
          }
        }
        style.left = left + 'px'
      } else if (col.freeze === 'right') {
        let right = 0
        for (let i = this.columns.length - 1; i > colIdx; i--) {
          if (this.columns[i].freeze === 'right' || !this.columns[i].freeze) {
            right += this.columns[i].width
          }
        }
        style.right = right + 'px'
      }
      return style
    },
    getPercentColor(value) {
      if (typeof value !== 'number' || isNaN(value)) return { main: '', sub: '' }
      if (value < 0.3) {
        return { main: 'bg-red-500', sub: 'bg-red-50' }
      } else if (value < 0.8) {
        return { main: 'bg-orange-500', sub: 'bg-orange-50' }
      } else {
        return { main: 'bg-green-500', sub: 'bg-green-50' }
      }
    },
    // Tính trung bình của current_year
    getAverageCurrentYear() {
      if (!this.data || this.data.length === 0) return 0
      const validData = this.data.filter(item => 
        item.current_year !== null && 
        item.current_year !== undefined && 
        !isNaN(parseFloat(item.current_year))
      )
      if (validData.length === 0) return 0
      const sum = validData.reduce((acc, item) => acc + parseFloat(item.current_year), 0)
      return Math.round(sum / validData.length * 100) / 100
    },
    // Tính trung bình của last_year
    getAverageLastYear() {
      if (!this.data || this.data.length === 0) return 0
      const validData = this.data.filter(item => 
        item.last_year !== null && 
        item.last_year !== undefined && 
        !isNaN(parseFloat(item.last_year))
      )
      if (validData.length === 0) return 0
      const sum = validData.reduce((acc, item) => acc + parseFloat(item.last_year), 0)
      return Math.round(sum / validData.length * 100) / 100
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
        on_track: 'warning',
        off_track: 'info',
        closed: 'success',
      }
      return statusMap[status] || 'default'
    },
    getStatusText(status) {
      const textMap = {
        on_track: this.$l.on_track,
        off_track: this.$l.off_track,
        closed: this.$l.closed,
      }
      return textMap[status] || status
    },
    formatDate(date) {
      if (!date) return ''
      const d = new Date(date)
      return d.toLocaleDateString(this.$i18n.locale, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
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

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}
</style>
