<template>
  <div class="w-full h-full bg-white overflow-hidden text-sm dark:bg-black dark:border-gray-700">
    <!-- Empty State -->
    <div v-if="!isLoading && (!data || data.length === 0)" class="flex flex-col items-center justify-center h-96 px-5 py-10 text-gray-400">
      <div class="text-6xl text-gray-300 mb-4">
        <i class="el-icon-document"></i>
      </div>
      <div class="text-base font-medium text-gray-600 mb-2">{{ $c.table_empty }}</div>
      <div class="text-sm text-gray-400">{{ $l.noHistoryData }}</div>
    </div>

    <!-- Table Content -->
    <div v-else class="h-full overflow-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-800" ref="scrollArea" @scroll="handleScroll">
      <table class="w-full border-collapse min-w-[1500px] table-fixed bg-white dark:bg-black">
        <thead>
          <tr>
            <th v-for="(col, colIdx) in columns" :key="col.id" :style="getStickyStyle(col, colIdx, true)" :class="[col.className, ' px-2 py-3 font-medium text-sm text-black text-left whitespace-nowrap sticky top-0 z-10 transition-colors bg-white dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 border-b border-solid border-gray-200 tracking-wide', col.freeze ? 'sticky-' + col.freeze : '']">
              <div class="block max-w-full overflow-hidden overflow-ellipsis leading-5" :title="col.title === '#' ? '#' : $l[col.title]">
                {{ col.title === '#' ? '#' : $l[col.title] || col.title }}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="isLoading">
            <tr v-for="i in 5" :key="'skeleton-' + i" class="animate-pulse">
              <td v-for="(col, colIdx) in columns" :key="col.id" :style="getStickyStyle(col, colIdx, false)" :class="['border-b border-gray-100 px-3 py-3 bg-white text-left whitespace-nowrap transition-colors dark:border-gray-700 dark:bg-black', col.freeze ? 'sticky-' + col.freeze : '']">
                <div class="h-4 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] rounded animate-[skeleton-loading_1.5s_infinite] dark:from-gray-800 dark:via-gray-700 dark:to-gray-800"></div>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="(item, idx) in data" :key="item.id || idx" class="cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-900" @click="handleRowClick(item)" @mouseenter="handleRowHover(item, true)" @mouseleave="handleRowHover(item, false)">
              <td v-for="(col, colIdx) in columns" :key="col.id" :class="[col.className, col.freeze ? 'sticky-' + col.freeze : '', 'border-b border-gray-100 px-2 py-3 bg-white text-left whitespace-nowrap transition-colors relative dark:border-gray-700 dark:bg-black text-xs']" :style="getStickyStyle(col, colIdx, false)">
                <!-- Index Column -->
                <span v-if="col.id === 'index'" class="font-medium text-black text-xs">{{ idx + 1 + (page.page - 1) * page.pageSize }}</span>

                <!-- Name Column with Tooltip -->
                <div v-else-if="col.id === 'name_en'" class="max-w-[200px]" :title="item[col.id]">
                  <div v-if="item[col.id]" class="text-black text-xs line-clamp-2 whitespace-normal h-8">{{ item[col.id] }}</div>
                  <div v-else class="text-gray-300 italic text-xs">{{ $c.empty }}</div>
                </div>

                <!-- Address Column -->
                <div v-else-if="col.id === 'address'" class="max-w-[250px]" :title="item[col.id]">
                  <div v-if="item[col.id]" class="text-black text-xs line-clamp-2 whitespace-pre h-8">{{ item[col.id] }}</div>
                  <div v-else class="text-gray-300 italic text-xs">{{ $c.empty }}</div>
                </div>

                <!-- Third Party Organization -->
                <div v-else-if="col.id === 'third_party_org'" class="max-w-[180px]" :title="item[col.id]">
                  <div v-if="item[col.id]" class="text-black text-xs line-clamp-2 whitespace-normal h-8">{{ item[col.id] }}</div>
                  <div v-else class="text-gray-300 italic text-xs">{{ $c.empty }}</div>
                </div>

                <!-- Date Columns -->
                <template v-else-if="col.id === 'audit_time' || col.id === 'due_audit_date' || col.id === 'create_time' || col.id === 'modify_time'">
                  <span v-if="item[col.id]" class="text-xs whitespace-normal">{{ formatDate(item[col.id]) }}</span>
                  <span v-else class="text-gray-300 italic text-xs">{{ $c.empty }}</span>
                </template>

                <!-- Status/Progress Columns -->
                <template v-else-if="col.id === 'cost_pay_progress'">
                  <div v-if="item[col.id] !== null && item[col.id] !== undefined" class="flex items-center gap-2">
                    <div class="flex-1 bg-gray-200 rounded-full h-2">
                      <div class="bg-blue-600 h-2 rounded-full" :style="`width: ${item[col.id]}%`"></div>
                    </div>
                    <span class="text-xs text-gray-600">{{ item[col.id] }}%</span>
                  </div>
                  <span v-else class="text-gray-300 italic text-xs">{{ $c.empty }}</span>
                </template>

                <!-- Audit Result -->
                <template v-else-if="col.id === 'near_audit_result'">
                  <el-tag v-if="item[col.id]" :type="getAuditResultType(item[col.id])" size="small" class="!text-xs !h-6 !leading-5 !px-2 !rounded !font-medium">
                    {{ getAuditResultText(item[col.id]) }}
                  </el-tag>
                  <span v-else class="text-gray-300 italic text-xs">{{ $c.empty }}</span>
                </template>

                <!-- Record Status -->
                <template v-else-if="col.id === 'rec_status'">
                  <el-tag v-if="item[col.id] !== null && item[col.id] !== undefined" :type="getRecStatusType(item[col.id])" size="small" class="!text-xs !h-6 !leading-5 !px-2 !rounded !font-medium">
                    {{ getRecStatusText(item[col.id]) }}
                  </el-tag>
                  <span v-else class="text-gray-300 italic text-xs">{{ $c.empty }}</span>
                </template>

                <!-- Yes/No Fields -->
                <template v-else-if="col.id === 'is_submit_cap' || col.id === 'requestor_facility_type'">
                  <el-tag v-if="item[col.id] !== null && item[col.id] !== undefined" :type="item[col.id] === 'Y' || item[col.id] === '1' ? 'success' : 'info'" size="small" class="!text-xs !h-6 !leading-5 !px-2 !rounded !font-medium">
                    {{ item[col.id] === 'Y' || item[col.id] === '1' ? $l.yes : $l.no }}
                  </el-tag>
                  <span v-else class="text-gray-300 italic text-xs">{{ $c.empty }}</span>
                </template>

                <!-- User Info -->
                <template v-else-if="col.id === 'create_user' || col.id === 'modify_user' || col.id === 'audit_user'">
                  <span v-if="item[col.id]" class="text-xs whitespace-normal">{{ item[col.id] }}</span>
                  <span v-else class="text-gray-300 italic text-xs">{{ $c.empty }}</span>
                </template>

                <!-- Attachments Column -->
                <template v-else-if="col.id === 'attachments'">
                  <div class="flex items-center gap-2">
                    <button v-if="item[col.id].length > 0" class="flex items-center gap-1 text-xs transition-colors">
                      <i class="el-icon-paperclip"></i>
                      <span>{{ item[col.id].length }} {{ $l.files }}</span>
                    </button>
                    <span v-else class="text-gray-300 italic text-xs">{{ $l.noAttachments }}</span>
                  </div>
                </template>

                <!-- Action Column -->
                <template v-else-if="col.id === 'action'">
                  <div class="flex justify-end items-center gap-1 action-buttons">
                    <!-- Check/View Button -->
                    <el-button type="text" class="!p-1.5 !text-gray-500 !border-0 !rounded hover:!text-blue-500 hover:!bg-blue-50 !transition-all dark:hover:!bg-blue-900/20" @click.stop="handleAction('check', item)" :title="$c.check">
                      <i class="el-icon-view w-3 text-xs text-gray-400"></i>
                    </el-button>
                    
                    <!-- Edit Button -->
                    <el-button v-if="showAuth.m_updata" type="text" class="!p-1.5 !text-gray-500 !border-0 !rounded hover:!text-yellow-500 hover:!bg-yellow-50 !transition-all dark:hover:!bg-yellow-900/20" @click.stop="handleAction('edit', item)" :title="$l.modify">
                      <i class="el-icon-edit w-3 text-xs text-gray-400"></i>
                    </el-button>

                    <!-- Audit Actions based on rec_status -->
                    <!-- New Order (rec_status === -1) -->
                    <el-button v-if="showAuth.m_audit && item.rec_status === -1" type="text" class="!p-1.5 !text-gray-500 !border-0 !rounded hover:!text-green-500 hover:!bg-green-50 !transition-all dark:hover:!bg-green-900/20" @click.stop="handleAction('auditNew', item)" :title="$l.newOrder">
                      <i class="el-icon-circle-plus-outline w-3 text-xs text-green-500"></i>
                    </el-button>

                    <!-- Audit (rec_status === 1) -->
                    <el-button v-if="showAuth.m_audit && item.rec_status === 1" type="text" class="!p-1.5 !text-gray-500 !border-0 !rounded hover:!text-orange-500 hover:!bg-orange-50 !transition-all dark:hover:!bg-orange-900/20" @click.stop="handleAction('auditClick', item)" :title="$l.audit">
                      <i class="el-icon-check w-3 text-xs text-orange-500"></i>
                    </el-button>

                    <!-- Cancel Audit (rec_status === 7) -->
                    <el-button v-if="showAuth.m_audit && item.rec_status === 7" type="text" class="!p-1.5 !text-gray-500 !border-0 !rounded hover:!text-red-500 hover:!bg-red-50 !transition-all dark:hover:!bg-red-900/20" @click.stop="handleAction('invalid', item)" :title="$l.cancelAudit">
                      <i class="el-icon-close w-3 text-xs text-red-500"></i>
                    </el-button>

                    <!-- Close/End (rec_status === 7) -->
                    <el-button v-if="showAuth.m_audit && item.rec_status === 7" type="text" class="!p-1.5 !text-gray-500 !border-0 !rounded hover:!text-green-600 hover:!bg-green-50 !transition-all dark:hover:!bg-green-900/20" @click.stop="handleAction('auditClose', item)" :title="$l.end">
                      <i class="el-icon-finished w-3 text-xs text-green-600"></i>
                    </el-button>

                    <!-- View Attachments -->
                    <el-button v-if="item.attachment_count && item.attachment_count > 0" type="text" class="!p-1.5 !text-gray-500 !border-0 !rounded hover:!text-purple-500 hover:!bg-purple-50 !transition-all dark:hover:!bg-purple-900/20" @click.stop="handleViewAttachments(item)" :title="$l.viewAttachment">
                      <i class="el-icon-paperclip w-3 text-xs text-gray-400"></i>
                    </el-button>
                  </div>
                </template>

                <!-- Default Columns -->
                <template v-else>
                  <div class="text-black dark:text-gray-400 line-clamp-2">
                    <span v-if="item[col.id] === undefined || item[col.id] === null || item[col.id] === ''" class="text-gray-300 italic text-xs">
                      {{ $c.empty }}
                    </span>
                    <span v-else class="text-xs whitespace-normal">{{ item[col.id] }}</span>
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
  Component: investigation-history-table
  Hiển thị lịch sử điều tra thẩm định với các cột thông tin chi tiết và tệp đính kèm
*/

export default {
  name: 'investigation_history_table',
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
        { id: 'name_en', title: 'manufacturerNameEn', width: 200, textAlign: 'left' },
        { id: 'address', title: 'address', width: 250, textAlign: 'left' },
        { id: 'third_party_org', title: 'nameOfTheThirdPartyOrganization', width: 180, textAlign: 'left' },
        { id: 'audit_time', title: 'auditTime', width: 120, textAlign: 'left' },
        // { id: 'due_audit_date', title: 'dueAuditDate', width: 120, textAlign: 'left' },
        // { id: 'cost_pay_progress', title: 'costPayProgress', width: 120, textAlign: 'left' },
        { id: 'audit_result', title: 'auditResult', width: 200, textAlign: 'left' },
        { id: 'is_submit_cap', title: 'isSubmitCap', width: 100, textAlign: 'center' },
        { id: 'rec_status', title: 'recStatus', width: 100, textAlign: 'center' },
        { id: 'create_user', title: 'createUser', width: 100, textAlign: 'left' },
        { id: 'create_time', title: 'createTime', width: 120, textAlign: 'left' },
        { id: 'modify_user', title: 'modifyUser', width: 100, textAlign: 'left' },
        { id: 'modify_time', title: 'modifyTime', width: 120, textAlign: 'left' },
        { id: 'attachments', title: 'attachment_info', width: 120, textAlign: 'center' },
        { id: 'action', title: 'action', width: 180, textAlign: 'right', freeze: 'right' },
      ],
      scrollTop: 0,
    }
  },
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
    handleAction(cmd, row) {
      this.$emit('action', { action: cmd, row })
    },
    handleRowClick(row) {
      this.$emit('row-click', row)
    },
    handleRowHover(row, isEnter) {
      this.$emit('row-hover', { row, isEnter })
    },
    handleViewAttachments(row) {
      this.$emit('view-attachments', row)
    },
    getAuditResultType(result) {
      const typeMap = {
        pass: 'success',
        fail: 'danger',
        pending: 'warning',
      }
      return typeMap[result] || 'info'
    },
    getAuditResultText(result) {
      const textMap = {
        pass: this.$l.pass,
        fail: this.$l.fail,
        pending: this.$c.pending,
      }
      return textMap[result] || result
    },
    getRecStatusType(status) {
      const typeMap = {
        '-1': 'info',     // Chờ duyệt
        '1': 'warning',   // Đã duyệt
        '7': 'success',   // Hoàn thành
        '99': 'success',  // Kết thúc
      }
      return typeMap[status] || 'default'
    },
    getRecStatusText(status) {
      const textMap = {
        '-1': this.$c.pending,
        '1': this.$l.audit,
        '7': this.$c.completed,
        '99': this.$l.end,
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

.line-clamp-2 {
  overflow: hidden;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  line-clamp: 2;
}

/* ===== ACTION BUTTONS RESPONSIVE ===== */
@media (max-width: 1400px) {
  .action-button-text {
    display: none;
  }
  
  .action-buttons {
    gap: 0.25rem;
  }
}

/* ===== HOVER EFFECTS FOR ACTION BUTTONS ===== */
.el-button--text:hover {
  transform: scale(1.05);
}

/* ===== AUDIT STATUS COLORS ===== */
.text-yellow-500 {
  color: #eab308 !important;
}

.hover\:text-yellow-500:hover {
  color: #eab308 !important;
}

.hover\:bg-yellow-50:hover {
  background-color: #fefce8 !important;
}

.text-orange-500 {
  color: #f97316 !important;
}

.hover\:text-orange-500:hover {
  color: #f97316 !important;
}

.hover\:bg-orange-50:hover {
  background-color: #fff7ed !important;
}

.text-purple-500 {
  color: #a855f7 !important;
}

.hover\:text-purple-500:hover {
  color: #a855f7 !important;
}

.hover\:bg-purple-50:hover {
  background-color: #faf5ff !important;
}
</style>
