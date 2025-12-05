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

                <!-- Multi-year Average Column -->
                <template v-else-if="(col.originalId || col.id) === 'issueYearsAverage'">
                  <div
                    v-if="getIssueYearsAverage(item) !== null"
                    :class="['flex max-w-full overflow-hidden overflow-ellipsis leading-5 items-center gap-1 cursor-pointer select-none transition-transform duration-150 hover:scale-[1.02]']"
                    @click.stop="openIssueYearsDialog(item)"
                    :title="$l.issue_years_average"
                  >
                    <div :class="['w-3 h-3 rounded-full', getPercentColor(getIssueYearsAverage(item)).main]"></div>
                    <div :class="['px-3', getPercentColor(getIssueYearsAverage(item)).sub]">{{ formatPercent(getIssueYearsAverage(item)) }}</div>
                  </div>
                  <span v-else class="text-gray-300 italic text-xs">
                    {{ $c.empty }}
                  </span>
                </template>

                <!-- Action Column -->
                <template v-else-if="(col.originalId || col.id) === 'action'">
                    <div class="flex justify-end items-center">
                      <el-dropdown trigger="click">
                        <el-button
                          type="text"
                          class="!p-2 !text-gray-500 !border-0 !rounded hover:!text-blue-500 hover:!bg-blue-50 !transition-all dark:hover:!bg-blue-900/20"
                        >
                          <i class="el-icon-more w-3.5 text-sm text-gray-400"></i>
                        </el-button>
                        <el-dropdown-menu slot="dropdown">
                          <el-dropdown-item @click.native="handleAction('history', item)">{{ $l.history }}</el-dropdown-item>
                          <el-dropdown-item @click.native="handleAction('edit_notices', item)">{{ $l.edit_notices || 'Edit Notices' }}</el-dropdown-item>
                        </el-dropdown-menu>
                      </el-dropdown>
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
            <!-- Multi-year average -->
            <td class="border-b border-gray-100 px-2 py-3 bg-yellow-100 text-left whitespace-nowrap transition-colors dark:border-gray-700 dark:bg-gray-800 text-xs font-medium">
              <span class="text-gray-500 dark:text-gray-400">{{ $c.dash }}</span>
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

    <CustomDialog
      :visible.sync="issueYearsDialogVisible"
      :title="$l.issue_years_average_detail_title"
      :clickOutside="false"
      width="70%"
      :maxWidth="'900px'"
    >
      <div class="px-6 pb-6 space-y-6">
        <div class="grid gap-4 rounded-xl bg-gray-50 p-4 text-sm dark:bg-gray-900/40 md:grid-cols-4">
          <div class="flex flex-col">
            <span class="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{{ $l.vendor_code }}</span>
            <span class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{{ issueYearsDialogMeta.vendor_code || $c.empty }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{{ $l.sap_code }}</span>
            <span class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100">{{ issueYearsDialogMeta.sap_code || $c.empty }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{{ $l.name_en }}</span>
            <span class="mt-1 text-sm font-semibold text-gray-900 dark:text-gray-100 line-clamp-2">{{ issueYearsDialogMeta.name_en || $c.empty }}</span>
          </div>
          <div class="flex flex-col">
            <span class="text-[11px] font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">{{ $l.issue_years_average }}</span>
            <div class="mt-2">
              <template v-if="issueYearsDialogMeta.averageRatio !== null">
                <div class="inline-flex items-center gap-2">
                  <span :class="['w-3 h-3 rounded-full', getPercentColor(issueYearsDialogMeta.averageRatio).main]"></span>
                  <span :class="['px-3 py-1 rounded-full text-xs font-semibold', getPercentColor(issueYearsDialogMeta.averageRatio).sub]">{{ issueYearsDialogAverageText }}</span>
                </div>
              </template>
              <span v-else class="text-sm text-gray-400 dark:text-gray-500">{{ $c.empty }}</span>
            </div>
          </div>
        </div>

        <div class="overflow-hidden rounded-xl border border-gray-100 shadow-sm dark:border-gray-700">
          <table class="min-w-full divide-y divide-gray-100 dark:divide-gray-700">
            <thead class="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:bg-gray-900/60 dark:text-gray-400">
              <tr>
                <th class="px-4 py-3">{{ $l.issue_years_detail_year }}</th>
                <th class="px-4 py-3 text-right">{{ $l.issue_years_detail_total }}</th>
                <th class="px-4 py-3 text-right">{{ $l.issue_years_detail_finish }}</th>
                <th class="px-4 py-3 text-right">{{ $l.issue_years_detail_ratio }}</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100 dark:divide-gray-800">
              <tr v-if="issueYearsDialogRows.length === 0">
                <td colspan="4" class="px-4 py-6 text-center text-sm text-gray-400 dark:text-gray-500">
                  {{ $c.no_data }}
                </td>
              </tr>
              <tr
                v-for="(row, rowIdx) in issueYearsDialogRows"
                :key="row.manufacture_id || `${row.year}-${rowIdx}`"
                class="bg-white text-sm text-gray-700 transition-colors dark:bg-black dark:text-gray-200 even:bg-gray-50 even:dark:bg-gray-900/40"
              >
                <td class="px-4 py-3 whitespace-nowrap">{{ row.year || $c.dash }}</td>
                <td class="px-4 py-3 text-right whitespace-nowrap">{{ row.total_issue === null || row.total_issue === undefined ? $c.dash : row.total_issue }}</td>
                <td class="px-4 py-3 text-right whitespace-nowrap">{{ row.finish === null || row.finish === undefined ? $c.dash : row.finish }}</td>
                <td class="px-4 py-3 text-right whitespace-nowrap">
                  <template v-if="row.ratio !== null">
                    <div class="inline-flex items-center gap-2">
                      <span :class="['w-3 h-3 rounded-full', getPercentColor(row.ratio).main]"></span>
                      <span :class="['px-3 py-1 rounded-full text-xs font-medium', getPercentColor(row.ratio).sub]">{{ formatPercent(row.ratio) }}</span>
                    </div>
                  </template>
                  <span v-else class="text-xs italic text-gray-300 dark:text-gray-500">{{ $c.empty }}</span>
                </td>
              </tr>
              <tr v-if="issueYearsDialogRows.length > 0" class="bg-gray-50 text-sm font-medium text-gray-600 dark:bg-gray-900/60 dark:text-gray-300">
                <td colspan="3" class="px-4 py-4 text-right">{{ $l.issue_years_detail_average }}</td>
                <td class="px-4 py-4 text-right">
                  <template v-if="issueYearsDialogMeta.averageRatio !== null">
                    <div class="inline-flex items-center gap-2">
                      <span :class="['w-3 h-3 rounded-full', getPercentColor(issueYearsDialogMeta.averageRatio).main]"></span>
                      <span :class="['px-3 py-1 rounded-full text-xs font-semibold', getPercentColor(issueYearsDialogMeta.averageRatio).sub]">{{ issueYearsDialogAverageText }}</span>
                    </div>
                  </template>
                  <span v-else class="text-sm text-gray-400 dark:text-gray-500">{{ $c.dash }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </CustomDialog>
  </div>
</template>

<script>
import CustomDialog from '@/views/_common/CustomDialog.vue'

/*
  Chú ý: 
  - Các text hiển thị đều lấy từ file ngôn ngữ qua $l.key và $c.key.
  - Tiêu đề cột được lấy từ $l[col.title]
  - Text thông thường (empty, dash, no_data) được lấy từ $c[key]
  - Nếu muốn custom thêm cột, sửa columns và bổ sung key vào tất cả file ngôn ngữ.
*/

export default {
  name: 'InvestigationTable',
  components: {
    CustomDialog,
  },
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
        { id: 'issueYearsAverage', title: 'issue_years_average', width: 160, textAlign: 'left' },
        { id: 'official_reminder_number', title: 'official_reminder_number', width: 150, textAlign: 'right' },
        { id: 'warning_letter_number', title: 'warning_letter_number', width: 150, textAlign: 'right' },
        { id: 'audit_count', title: 'audit_count', width: 120, textAlign: 'right' },
        { id: 'action', title: 'action', width: 100, textAlign: 'right', freeze: 'right' },
      ],
      rowHeight: 44,
      scrollTop: 0,
      height: 400, // mặc định, có thể truyền prop hoặc tính toán động
      issueYearsDialogVisible: false,
      issueYearsDialogMeta: {
        vendor_code: '',
        sap_code: '',
        name_en: '',
        averageRatio: null,
      },
      issueYearsDialogRows: [],
    }
  },
  computed: {
    averageIssueYearsRatio() {
      return this.getAverageIssueYearsRatio()
    },
    issueYearsDialogAverageText() {
      const ratio = this.issueYearsDialogMeta.averageRatio
      if (typeof ratio !== 'number' || isNaN(ratio)) return null
      return this.formatPercent(ratio)
    },
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
        return { main: 'bg-yellow-500', sub: 'bg-yellow-50' }
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
    // Tính trung bình tỷ lệ nhiều năm theo từng dòng
    calculateIssueYearsAverage(issueYears) {
      if (!Array.isArray(issueYears) || issueYears.length === 0) return null
      let sumRatio = 0
      let count = 0
      issueYears.forEach(entry => {
        if (!entry) return
        const total = Number(entry.total_issue)
        if (!Number.isFinite(total) || total <= 0) return
        const finish = Number(entry.finish)
        const safeFinish = Number.isFinite(finish) ? finish : 0
        sumRatio += safeFinish / total
        count += 1
      })
      if (count === 0) return null
      const average = sumRatio / count
      if (!Number.isFinite(average)) return null
      return Math.round(average * 10000) / 10000
    },
    // Hiển thị phần trăm với số thập phân cố định
    formatPercent(ratio, fractionDigits = 2) {
      if (typeof ratio !== 'number' || isNaN(ratio)) return ''
      const percentValue = ratio * 100
      return `${percentValue.toFixed(fractionDigits)}%`
    },
    // Tính trung bình tỷ lệ nhiều năm của toàn bộ bảng
    getAverageIssueYearsRatio() {
      if (!this.data || this.data.length === 0) return null
      const ratios = this.data
        .map(item => this.calculateIssueYearsAverage(item && item.issueYears))
        .filter(ratio => typeof ratio === 'number' && !isNaN(ratio))

      if (ratios.length === 0) return null
      const sum = ratios.reduce((acc, ratio) => acc + ratio, 0)
      const average = sum / ratios.length
      if (!Number.isFinite(average)) return null
      return Math.round(average * 10000) / 10000
    },
    getIssueYearsAverage(item) {
      if (!item) return null
      return this.calculateIssueYearsAverage(item.issueYears)
    },
    calculateIssueYearRatio(entry) {
      if (!entry) return null
      const total = Number(entry.total_issue)
      if (!Number.isFinite(total) || total <= 0) return null
      const finish = Number(entry.finish)
      const safeFinish = Number.isFinite(finish) ? finish : 0
      const ratio = safeFinish / total
      if (!Number.isFinite(ratio)) return null
      const clamped = Math.max(0, Math.min(ratio, 1))
      return Math.round(clamped * 10000) / 10000
    },
    prepareIssueYearsRows(issueYears) {
      if (!Array.isArray(issueYears)) return []
      return issueYears
        .map((entry, index) => {
          if (!entry) return null
          const ratio = this.calculateIssueYearRatio(entry)
          const totalNumber = Number(entry.total_issue)
          const finishNumber = Number(entry.finish)
          return {
            ...entry,
            year: entry.year,
            total_issue: Number.isFinite(totalNumber) ? totalNumber : entry.total_issue,
            finish: Number.isFinite(finishNumber) ? finishNumber : entry.finish,
            ratio,
            _order: index,
          }
        })
        .filter(Boolean)
        .sort((a, b) => {
          const yearA = Number(a.year)
          const yearB = Number(b.year)
          if (Number.isFinite(yearA) && Number.isFinite(yearB)) return yearB - yearA
          if (Number.isFinite(yearA)) return -1
          if (Number.isFinite(yearB)) return 1
          return (b._order || 0) - (a._order || 0)
        })
        .map(({ _order, ...rest }) => rest)
    },
    openIssueYearsDialog(item) {
      if (!item) return
      const rows = this.prepareIssueYearsRows(item.issueYears)
      const averageRatio = this.getIssueYearsAverage(item)
      this.issueYearsDialogRows = rows
      this.issueYearsDialogMeta = {
        vendor_code: item.vendor_code || '',
        sap_code: item.sap_code || '',
        name_en: item.name_en || '',
        averageRatio,
      }
      this.issueYearsDialogVisible = true
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
