<template>
  <div class="table-manufacturer-container">
    <!-- Empty State -->
    <div v-if="!isLoading && (!data || data.length === 0)" class="empty-state">
      <div class="empty-icon">
        <i class="el-icon-document"></i>
      </div>
      <div class="empty-text">{{ $c.table_empty }}</div>
      <div class="empty-description">Chưa có dữ liệu nhà sản xuất nào được tải</div>
    </div>

    <!-- Table Content -->
    <div v-else class="table-scroll-area" ref="scrollArea" @scroll="handleScroll">
      <table class="manufacturer-table">
        <thead>
          <tr>
            <th v-for="(col, colIdx) in columns" :key="col.id" :style="getStickyStyle(col, colIdx, true)" :class="[col.className, 'table-header', col.freeze ? 'sticky-' + col.freeze : '']">
              <div class="th-content" :title="col.title === '#' ? '#' : $t('manufacturer_table.' + col.title)">
                {{ col.title === '#' ? '#' : $t('manufacturer_table.' + col.title) }}
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="isLoading">
            <tr v-for="i in 10" :key="'skeleton-' + i" class="skeleton-row">
              <td v-for="(col, colIdx) in columns" :key="col.id" :style="getStickyStyle(col, colIdx, false)" :class="col.freeze ? 'sticky-' + col.freeze : ''">
                <div class="skeleton-loader"></div>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="(item, idx) in visibleRows" :key="item.id || idx" class="data-row" @click="handleRowClick(item)" @mouseenter="handleRowHover(item, true)" @mouseleave="handleRowHover(item, false)">
              <td v-for="col in columns" :key="col.id" :class="[col.className, col.freeze ? 'sticky-' + col.freeze : '', 'table-cell']">
                <!-- Index Column -->
                <span v-if="col.id === 'index'" class="index-cell">{{ idx + 1 + memory.firstSpace }}</span>
                
                <!-- Name Column with Tooltip -->
                <div v-else-if="col.id === 'name_en'" class="name-cell">
                  <el-tooltip effect="dark" :content="item[col.id]" placement="top" :disabled="!item[col.id] || item[col.id].length < 30">
                    <div class="text-truncate">{{ item[col.id] || $c.empty }}</div>
                  </el-tooltip>
                </div>
                
                <!-- Address Column -->
                <template v-else-if="col.id === 'address'">
                  <div class="address-cell">
                    <el-popover trigger="hover" placement="top" width="280">
                      <div class="popover-content">
                        <div v-if="item.address && item.address.length > 0" class="address-list">
                          <div v-for="addr in item.address" :key="addr.id" class="address-item">
                            <i class="el-icon-location-outline"></i>
                            <span>{{ addr.address_en }}</span>
                          </div>
                        </div>
                        <div v-else class="no-data">{{ $c.empty }}</div>
                      </div>
                      <template slot="reference">
                        <el-button type="text" size="mini" class="view-link">
                          <i class="el-icon-view"></i>
                          {{ $c.view_address }}
                        </el-button>
                      </template>
                    </el-popover>
                    <el-tag v-if="item.address && item.address.length > 0" size="mini" type="info" class="count-badge">
                      {{ item.address.length }}
                    </el-tag>
                  </div>
                </template>
                
                <!-- Capabilities Column -->
                <template v-else-if="col.id === 'capabilities'">
                  <div class="capabilities-cell">
                    <el-popover trigger="hover" placement="top" width="280">
                      <div class="popover-content">
                        <div v-if="item.address && item.address.length > 0" class="capabilities-list">
                          <div v-for="capability in item.address" :key="capability.id" class="capability-item">
                            <i class="el-icon-cpu"></i>
                            <span>{{ capability.own_processes }}</span>
                          </div>
                        </div>
                        <div v-else class="no-data">{{ $c.empty }}</div>
                      </div>
                      <template slot="reference">
                        <el-button type="text" size="mini" class="view-link">
                          <i class="el-icon-view"></i>
                          {{ $c.view_capabilities }}
                        </el-button>
                      </template>
                    </el-popover>
                    <el-tag v-if="item.address && item.address.length > 0" size="mini" type="info" class="count-badge">
                      {{ item.address.length }}
                    </el-tag>
                  </div>
                </template>
                
                <!-- Status Column -->
                <template v-else-if="col.id === 'authorization_status'">
                  <div class="status-cell">
                    <el-tag v-if="item[col.id]" 
                            :type="getStatusType(item[col.id])" 
                            size="small"
                            class="status-tag">
                      {{ getStatusText(item[col.id]) }}
                    </el-tag>
                    <span v-else class="empty-cell">{{ $c.empty }}</span>
                  </div>
                </template>
                
                <!-- Action Column -->
                <template v-else-if="col.id === 'action'">
                  <div class="action-cell">
                    <el-dropdown @command="(cmd) => handleAction(cmd, item)" trigger="click" size="small">
                      <el-button type="text" class="action-button">
                        <i class="el-icon-more"></i>
                      </el-button>
                      <el-dropdown-menu slot="dropdown" class="action-dropdown">
                        <el-dropdown-item command="detail">
                          <i class="el-icon-view"></i>
                          {{ $t('common.detail') }}
                        </el-dropdown-item>
                        <el-dropdown-item command="edit">
                          <i class="el-icon-edit"></i>
                          {{ $t('common.edit') }}
                        </el-dropdown-item>
                        <el-dropdown-item command="export">
                          <i class="el-icon-download"></i>
                          {{ $t('common.export') }}
                        </el-dropdown-item>
                        <el-dropdown-item command="delete" class="danger-action">
                          <i class="el-icon-delete"></i>
                          {{ $t('common.delete') }}
                        </el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </template>
                
                <!-- Default Columns -->
                <template v-else>
                  <div class="default-cell">
                    <span v-if="item[col.id] === undefined || item[col.id] === null || item[col.id] === ''" class="empty-cell">
                      {{ $c.empty }}
                    </span>
                    <span v-else class="cell-content">{{ item[col.id] }}</span>
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
  name: 'ImproveManagementTable2',
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      columns: [
        { id: 'index', title: '#', width: 60, textAlign: 'left' },
        { id: 'name_en', title: 'partner_english_name', width: 300, textAlign: 'left' },
        { id: 'vendor_code', title: 'vendor_code', width: 140, textAlign: 'left' },
        { id: 'sap_code', title: 'sap_code', width: 140, textAlign: 'left' },
        { id: 'address', title: 'address', width: 220, textAlign: 'left' },
        { id: 'types_of_orders', title: 'types_of_orders', width: 180, textAlign: 'left' },
        { id: 'capabilities', title: 'overall_capabilities', width: 220, textAlign: 'left' },
        { id: 'biz_license_number', title: 'business_registration_number', width: 180, textAlign: 'left' },
        { id: 'authorization_status', title: 'authorization_status', width: 160, textAlign: 'left' },
        { id: 'requestor_facility_code', title: 'leading_t1', width: 140, textAlign: 'left' },
        { id: 'action', title: 'action', width: 80, textAlign: 'right', freeze: 'right' },
      ],
      rowHeight: 44,
      scrollTop: 0,
      height: 400, // mặc định, có thể truyền prop hoặc tính toán động
    }
  },
  computed: {
    memory() {
      // Tính toán số dòng hiển thị dựa vào scrollTop và chiều cao
      const total = this.data.length
      const visibleRowCount = Math.ceil(this.height / this.rowHeight)
      const index = Math.floor(this.scrollTop / this.rowHeight)
      const firstSpace = Math.max(index - 2, 0)
      const lastSpace = Math.min(index + visibleRowCount + 2, total)
      return {
        firstSpace,
        lastSpace,
      }
    },
    visibleRows() {
      return this.data.slice(this.memory.firstSpace, this.memory.lastSpace)
    },
  },
  methods: {
    handleScroll(e) {
      this.scrollTop = e.target.scrollTop
    },
    getStickyStyle(col, colIdx, isHeader) {
      if (!col.freeze) return { width: col.width + 'px', textAlign: col.textAlign }
      let style = { width: col.width + 'px', textAlign: col.textAlign, position: 'sticky', zIndex: isHeader ? 10 : 2 }
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
        'onboarding': 'warning',
        'discontinued': 'info', 
        'in_use': 'success'
      }
      return statusMap[status] || 'default'
    },
    getStatusText(status) {
      const textMap = {
        'onboarding': this.$t('manufacturer_table.onboarding'),
        'discontinued': this.$t('manufacturer_table.discontinued'),
        'in_use': this.$t('manufacturer_table.in_use')
      }
      return textMap[status] || status
    },
  },
}
</script>

<style scoped>
/* ===== CONTAINER & LAYOUT ===== */
.table-manufacturer-container {
  width: 100%;
  height: 100%;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  background: #ffffff;
  overflow: hidden;
  font-size: 14px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06);
}

/* ===== EMPTY STATE ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 400px;
  padding: 40px 20px;
  color: #909399;
}

.empty-icon {
  font-size: 64px;
  color: #c0c4cc;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 16px;
  font-weight: 500;
  color: #606266;
  margin-bottom: 8px;
}

.empty-description {
  font-size: 14px;
  color: #909399;
}

/* ===== TABLE SCROLL AREA ===== */
.table-scroll-area {
  height: 100%;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: #c0c4cc #f5f7fa;
}

.table-scroll-area::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

.table-scroll-area::-webkit-scrollbar-thumb {
  background: #c0c4cc;
  border-radius: 4px;
}

.table-scroll-area::-webkit-scrollbar-track {
  background: #f5f7fa;
  border-radius: 4px;
}

/* ===== TABLE STRUCTURE ===== */
.manufacturer-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
  table-layout: fixed;
  background: #ffffff;
}

/* ===== TABLE HEADER ===== */
.manufacturer-table th {
  background: #f8f9fa;
  border-bottom: 1px solid #e4e7ed;
  padding: 16px 12px;
  font-weight: 600;
  font-size: 14px;
  color: #303133;
  text-align: left;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 10;
}

.table-header {
  transition: background-color 0.2s;
}

.th-content {
  display: block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.4;
}

/* ===== TABLE BODY ===== */
.manufacturer-table td {
  border-bottom: 1px solid #ebeef5;
  padding: 12px;
  background: #ffffff;
  text-align: left;
  white-space: nowrap;
  transition: background-color 0.2s;
}

.table-cell {
  position: relative;
}

/* ===== TABLE ROWS ===== */
.data-row {
  cursor: pointer;
  transition: background-color 0.2s;
}

.data-row:hover {
  background-color: #f5f7fa !important;
}

.data-row:hover .table-cell {
  background-color: #f5f7fa !important;
}

/* ===== STICKY COLUMNS ===== */
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

.table-header.sticky-right {
  background: #f8f9fa !important;
}

.table-header.sticky-left {
  background: #f8f9fa !important;
}

.data-row:hover .sticky-left,
.data-row:hover .sticky-right {
  background: #f5f7fa !important;
}

/* ===== CELL CONTENT TYPES ===== */
.index-cell {
  font-weight: 500;
  color: #909399;
  font-size: 13px;
}

.name-cell {
  max-width: 280px;
}

.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-weight: 500;
  color: #303133;
}

.address-cell,
.capabilities-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.view-link {
  padding: 4px 8px !important;
  font-size: 12px !important;
  color: #409eff !important;
  border: none !important;
}

.view-link:hover {
  color: #66b1ff !important;
  background: rgba(64, 158, 255, 0.1) !important;
}

.view-link i {
  margin-right: 4px;
  font-size: 12px;
}

.count-badge {
  font-size: 11px !important;
  height: 18px !important;
  line-height: 16px !important;
  padding: 0 6px !important;
  border-radius: 9px !important;
}

.status-cell {
  display: flex;
  align-items: center;
}

.status-tag {
  font-size: 12px !important;
  height: 24px !important;
  line-height: 22px !important;
  padding: 0 8px !important;
  border-radius: 4px !important;
  font-weight: 500 !important;
}

.action-cell {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.action-button {
  padding: 8px !important;
  color: #606266 !important;
  border: none !important;
  border-radius: 4px !important;
  transition: all 0.2s !important;
}

.action-button:hover {
  color: #409eff !important;
  background: rgba(64, 158, 255, 0.1) !important;
}

.default-cell {
  color: #606266;
}

.cell-content {
  font-weight: 400;
}

.empty-cell {
  color: #c0c4cc;
  font-style: italic;
  font-size: 12px;
  font-weight: 400;
}

/* ===== POPOVER CONTENT ===== */
.popover-content {
  max-height: 200px;
  overflow-y: auto;
}

.address-list,
.capabilities-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.address-item,
.capability-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid #f0f2f5;
  font-size: 13px;
  line-height: 1.4;
}

.address-item:last-child,
.capability-item:last-child {
  border-bottom: none;
}

.address-item i,
.capability-item i {
  color: #909399;
  margin-top: 2px;
  font-size: 14px;
}

.no-data {
  text-align: center;
  color: #c0c4cc;
  font-style: italic;
  padding: 16px;
}

/* ===== ACTION DROPDOWN ===== */
.action-dropdown .el-dropdown-menu__item {
  padding: 8px 16px !important;
  font-size: 13px !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
}

.action-dropdown .el-dropdown-menu__item i {
  font-size: 14px;
  width: 14px;
}

.action-dropdown .danger-action {
  color: #f56c6c !important;
}

.action-dropdown .danger-action:hover {
  background: rgba(245, 108, 108, 0.1) !important;
}

/* ===== SKELETON LOADING ===== */
.skeleton-row {
  animation: skeleton-shimmer 1.5s infinite linear;
}

.skeleton-loader {
  height: 16px;
  background: linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%);
  background-size: 200% 100%;
  border-radius: 4px;
  animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

@keyframes skeleton-shimmer {
  0% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}

/* ===== RESPONSIVE ADJUSTMENTS ===== */
@media (max-width: 1200px) {
  .manufacturer-table {
    font-size: 13px;
  }
  
  .manufacturer-table th,
  .manufacturer-table td {
    padding: 8px;
  }
}
</style>
