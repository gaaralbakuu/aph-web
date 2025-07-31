<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <i class="fa fa-users text-white"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ $l.seamainContact }}</h3>
            <p class="text-sm text-gray-500">{{ $t('ShareContactTable.mainContactDirectory') }}</p>
          </div>
        </div>
        <button 
          v-show="showAuth.m_add" 
          @click="handleAddClick()" 
          class="inline-flex items-center h-10 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full px-4 shadow-sm transition duration-200 ease-in-out transform hover:scale-105 gap-2"
        >
          <i class="fa fa-plus text-sm"></i>
          <span>{{ $c.create }}</span>
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="flex-1 overflow-hidden">
      <div class="overflow-y-auto" style="max-height: 500px;">
        <el-table 
          :data="data" 
          v-loading="isLoading"
          class="w-full modern-table" 
          highlight-current-row
          @row-click="handleRowClick"
          :row-style="{ cursor: 'pointer' }"
        >
          <!-- Serial Number Column -->
          <el-table-column 
            :label="$t('ShareContactTable.serialNumber')" 
            width="80" 
            fixed="left"
          >
            <template slot-scope="scope">
              <span class="font-mono text-gray-500 font-medium">
                {{ (page.page - 1) * page.pageSize + scope.$index + 1 }}
              </span>
            </template>
          </el-table-column>

          <!-- Contact Name Column -->
          <el-table-column 
            prop="contacter_name" 
            :label="$t('ShareContactTable.contactName')" 
            min-width="150"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <i class="fa fa-user text-green-600 text-sm"></i>
                </div>
                <span class="font-medium text-gray-900">
                  {{ scope.row.contacter_name }}
                </span>
              </div>
            </template>
          </el-table-column>

          <!-- Email Column -->
          <el-table-column 
            prop="contacter_mail" 
            :label="$t('ShareContactTable.email')" 
            min-width="200"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div class="flex items-center gap-2">
                <i class="fa fa-envelope text-blue-500"></i>
                <a 
                  :href="'mailto:' + scope.row.contacter_mail" 
                  class="text-blue-600 hover:text-blue-800 hover:underline"
                  @click.stop
                >
                  {{ scope.row.contacter_mail }}
                </a>
              </div>
            </template>
          </el-table-column>

          <!-- Phone Column -->
          <el-table-column 
            prop="contacter_phone" 
            :label="$t('ShareContactTable.phone')" 
            width="150"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div class="flex items-center gap-2">
                <i class="fa fa-phone text-green-500"></i>
                <a 
                  :href="'tel:' + scope.row.contacter_phone" 
                  class="text-gray-700 hover:text-green-600"
                  @click.stop
                >
                  {{ scope.row.contacter_phone }}
                </a>
              </div>
            </template>
          </el-table-column>

          <!-- Department Column -->
          <el-table-column 
            prop="department" 
            :label="$t('ShareContactTable.department')" 
            width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span class="text-gray-700">
                {{ scope.row.department || $c.empty }}
              </span>
            </template>
          </el-table-column>

          <!-- Position Column -->
          <el-table-column 
            prop="position" 
            :label="$t('ShareContactTable.position')" 
            width="120"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span class="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
                {{ scope.row.position || $c.empty }}
              </span>
            </template>
          </el-table-column>

          <!-- Status Column -->
          <el-table-column 
            prop="status" 
            :label="$t('ShareContactTable.status')" 
            width="100"
          >
            <template slot-scope="scope">
              <span 
                :class="{
                  'px-2 py-1 rounded text-xs font-medium': true,
                  'bg-green-100 text-green-800': scope.row.status === 'active',
                  'bg-gray-100 text-gray-800': scope.row.status === 'inactive'
                }"
              >
                {{ scope.row.status === 'active' ? $c.active : $c.inactive }}
              </span>
            </template>
          </el-table-column>

          <!-- Actions Column -->
          <el-table-column 
            fixed="right" 
            :label="$c.operation" 
            width="150"
          >
            <template slot-scope="scope">
              <div class="flex items-center gap-2">
                <!-- View Button -->
                <button 
                  @click.stop="handleAction('view', scope.row)" 
                  class="h-8 w-8 flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors duration-200"
                  :title="$c.view"
                >
                  <i class="fa fa-eye text-sm"></i>
                </button>

                <!-- Edit Button -->
                <button 
                  v-show="showAuth.m_updata" 
                  @click.stop="handleAction('edit', scope.row)" 
                  class="h-8 w-8 flex items-center justify-center bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-full transition-colors duration-200"
                  :title="$c.edit"
                >
                  <i class="fa fa-edit text-sm"></i>
                </button>
                
                <!-- Delete Button -->
                <button 
                  v-show="showAuth.m_del" 
                  @click.stop="handleAction('delete', scope.row)" 
                  class="h-8 w-8 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors duration-200"
                  :title="$c.delete"
                >
                  <i class="fa fa-trash text-sm"></i>
                </button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- Empty State -->
      <div v-if="!isLoading && (!data || data.length === 0)" class="flex flex-col items-center justify-center py-12">
        <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <i class="fa fa-users text-gray-400 text-2xl"></i>
        </div>
        <p class="text-gray-500 text-center">{{ $c.table_empty }}</p>
        <button 
          v-show="showAuth.m_add" 
          @click="handleAddClick()" 
          class="mt-4 inline-flex items-center h-10 bg-green-600 hover:bg-green-700 text-white font-medium rounded-full px-4 shadow-sm transition duration-200 ease-in-out transform hover:scale-105 gap-2"
        >
          <i class="fa fa-plus text-sm"></i>
          <span>{{ $t('ShareContactTable.addFirstContact') }}</span>
        </button>
      </div>
    </div>

    <!-- Footer with Pagination -->
    <div v-if="data && data.length > 0" class="px-6 py-4 border-t border-gray-100 bg-gray-50">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-500">
          {{ $t('ShareContactTable.totalContacts') }}: {{ total }}
        </div>
        <z-pagination 
          :pagination="pagination" 
          :total="total" 
          :page.sync="page.page" 
          :limit.sync="page.pageSize" 
          @change="handlePageChange"
          class="custom-pagination"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { zPagination } from '@/views/_common'

export default {
  name: 'ShareContactTable',
  components: {
    zPagination
  },
  props: {
    data: {
      type: Array,
      default: () => []
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    showAuth: {
      type: Object,
      default: () => ({})
    },
    page: {
      type: Object,
      default: () => ({ page: 1, pageSize: 15 })
    },
    total: {
      type: Number,
      default: 0
    },
    pagination: {
      type: Object,
      default: () => ({
        layout: 'prev, pager, next, jumper, ->, total,sizes',
        pagerCount: 7,
        pageSizes: [10, 15, 20, 30, 40, 50, 100]
      })
    }
  },
  methods: {
    handleAction(action, row) {
      this.$emit('action', { action, row })
    },

    handleRowClick(row) {
      this.$emit('row-click', row)
    },

    handleAddClick() {
      this.$emit('add-click')
    },

    handlePageChange() {
      this.$emit('page-change')
    }
  }
}
</script>

<style scoped>
.modern-table {
  border-radius: 8px;
  overflow: hidden;
}

.modern-table .el-table__header-wrapper {
  background: #f8fafc;
}

.modern-table .el-table__header th {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #374151;
}

.modern-table .el-table__row:hover {
  background-color: #f8fafc;
}

.custom-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
