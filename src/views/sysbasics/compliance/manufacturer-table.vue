<template>
  <div class="table-manufacturer-container">
    <div v-if="!isLoading && (!data || data.length === 0)" class="empty-table">
      {{ $l.table_empty }}
    </div>
    <div class="table-scroll-area" ref="scrollArea" @scroll="handleScroll">
      <table class="manufacturer-table">
        <thead>
          <tr style="background-color: #f8f9fa">
            <th v-for="(col, colIdx) in columns" :key="col.id" :style="getStickyStyle(col, colIdx, true)" :class="[col.className, 'sitcky-column', col.freeze ? 'sticky-' + col.freeze : '']">
              <span class="th-content" :title="col.title === '#' ? '#' : $t('manufacturer_table.' + col.title)">
                {{ col.title === '#' ? '#' : $t('manufacturer_table.' + col.title) }}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-if="isLoading">
            <tr v-for="i in 10" :key="'skeleton-' + i">
              <td v-for="(col, colIdx) in columns" :key="col.id" :style="getStickyStyle(col, colIdx, false)" :class="col.freeze ? 'sticky-' + col.freeze : ''">
                <div class="skeleton"></div>
              </td>
            </tr>
          </template>
          <template v-else>
            <tr v-for="(item, idx) in visibleRows" :key="item.id || idx">
              <td v-for="col in columns" :key="col.id" :class="[col.className, col.freeze ? 'sticky-' + col.freeze : '']">
                <span v-if="col.id === 'index'">{{ idx + 1 + memory.firstSpace }}</span>
                <div v-else-if="col.id === 'name_en'" :style="{ width: col.width + 'px', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }">
                  <el-tooltip effect="dark" :content="item[col.id]" placement="bottom-start">
                    <span>{{ item[col.id] }}</span>
                  </el-tooltip>
                </div>
                <template v-else-if="col.id === 'address'">
                  <el-popover>
                    <div style="display: flex; flex-direction: column; gap: 4px">
                      <span v-for="capability in item.address" :key="capability.id" style="font-size: 12px">{{ capability.address_en }}</span>
                    </div>
                    <template slot="reference">
                      <a href="javascript:" class="address-link">{{ $l.view_address }}</a>
                    </template>
                  </el-popover>
                  <span style="font-size: 12px; color: #666">
                    (
                    <b style="color: red">{{ item.address.length }}</b>
                    )
                  </span>
                </template>
                <template v-else-if="col.id === 'capabilities'">
                  <el-popover>
                    <div style="display: flex; flex-direction: column; gap: 4px">
                      <span v-for="capability in item.address" :key="capability.id" style="font-size: 12px">{{ capability.own_processes }}</span>
                    </div>
                    <template slot="reference">
                      <a href="javascript:" class="address-link">{{ $l.view_capabilities }}</a>
                    </template>
                  </el-popover>
                  <span style="font-size: 12px; color: #666">
                    (
                    <b style="color: red">{{ item.address.length }}</b>
                    )
                  </span>
                </template>
                <template v-else-if="col.id === 'authorization_status'">
                  <el-tag v-if="item[col.id]" :type="item[col.id] === 'onboarding' ? 'warning' : item[col.id] === 'discontinued' ? 'info' : item[col.id] === 'In use' ? 'success' : 'default'" disable-transitions>
                    {{ item[col.id] === 'onboarding' ? $t('manufacturer_table.onboarding') : item[col.id] === 'discontinued' ? $t('manufacturer_table.discontinued') : item[col.id] === 'in_use' ? $t('manufacturer_table.in_use') : item[col.id] }}
                  </el-tag>
                  <span v-else class="empty-cell">{{ $l.empty }}</span>
                </template>
                <template v-else-if="col.id === 'action'">
                  <div style="text-align: right">
                    <el-dropdown @command="(cmd) => handleAction(cmd, item)" trigger="click">
                      <span class="el-dropdown-link">
                        <i class="el-icon-more"></i>
                      </span>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item command="detail">{{ $t('common.detail') || 'Detail' }}</el-dropdown-item>
                        <el-dropdown-item command="edit">{{ $t('common.edit') || 'Edit' }}</el-dropdown-item>
                        <el-dropdown-item command="export">{{ $t('common.export') || 'Export' }}</el-dropdown-item>
                        <el-dropdown-item command="delete">{{ $t('common.delete') || 'Delete' }}</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                </template>
                <template v-else>
                  <template v-if="item[col.id] === undefined || item[col.id] === null">
                    <span class="empty-cell">{{ $l.empty }}</span>
                  </template>
                  <template v-else>
                    {{ item[col.id] }}
                  </template>
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
  name: 'manufacturer_table',
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
      let style = { width: col.width + 'px', textAlign: col.textAlign, position: 'sticky', zIndex: isHeader ? 3 : 2 }
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
  },
}
</script>

<style scoped>
.table-manufacturer-container {
  width: 100%;
  height: 100%;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  background: #fff;
  overflow: hidden;
  font-size: 14px;
}
.table-scroll-area {
  height: 100%;
  overflow: auto;
  /* Custom scrollbar */
  scrollbar-width: thin;
  scrollbar-color: #bdbdbd #f5f5f5;
}
.manufacturer-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 1200px;
  table-layout: fixed;
}
.manufacturer-table th,
.manufacturer-table td {
  border-bottom: 1px solid #e5e7eb;
  padding: 10px 8px;
  background: #fff;
  text-align: left;
  white-space: nowrap;
}
.manufacturer-table th {
  background: #f8f9fa;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 1;
}
.sticky-left {
  position: sticky !important;
  left: 0;
  z-index: 2;
  background: linear-gradient(to right, #fff 80%, rgba(255, 255, 255, 0)) !important;
  box-shadow: 2px 0 4px -2px #e5e7eb;
}
.sticky-right {
  position: sticky !important;
  right: 0;
  z-index: 2;
  background: linear-gradient(to left, #fff 80%, rgba(255, 255, 255, 0)) !important;
  box-shadow: -2px 0 4px -2px #e5e7eb;
}

.sitcky-column.sticky-right {
  background: linear-gradient(to left, #f8f9fa 80%, rgba(255, 255, 255, 0)) !important;
}

.sitcky-column.sticky-left {
  background: linear-gradient(to right, #f8f9fa 80%, rgba(255, 255, 255, 0)) !important;
}

.th-content {
  display: block;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
}
.skeleton {
  height: 18px;
  background: #f3f3f3;
  border-radius: 4px;
  animation: skeleton-loading 1.2s infinite linear;
}
@keyframes skeleton-loading {
  0% {
    background-color: #f3f3f3;
  }
  50% {
    background-color: #ececec;
  }
  100% {
    background-color: #f3f3f3;
  }
}
.empty-table {
  /* padding: 40px 0; */
  text-align: center;
  color: #888;
}

/* Custom scrollbar for Chrome, Edge, Safari */
.table-scroll-area::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.table-scroll-area::-webkit-scrollbar-thumb {
  background: #bdbdbd;
  border-radius: 4px;
}
.table-scroll-area::-webkit-scrollbar-track {
  background: #f5f5f5;
  border-radius: 4px;
}
.empty-cell {
  color: #888;
  font-style: italic;
  font-size: 12px;
}

.address-link {
  font-size: 12px;
  text-decoration: none;
  cursor: pointer;
}
.address-link:hover {
  text-decoration: underline;
}
tbody tr {
  height: 45px;
}
</style>
