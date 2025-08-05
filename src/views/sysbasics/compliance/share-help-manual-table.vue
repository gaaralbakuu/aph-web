<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden flex-1 flex flex-col">
    <!-- Header -->
    <div class="px-6 py-4 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
            <i class="fa fa-book text-white"></i>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-gray-900">{{ $l.helpManual }}</h3>
            <p class="text-sm text-gray-500">{{ $t('ShareHelpManualTable.manageDocumentGuides') }}</p>
          </div>
        </div>
        <button v-show="showAuth.m_add" @click="handleAddClick()" class="inline-flex items-center h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full px-4 shadow-sm transition duration-200 ease-in-out transform hover:scale-105 gap-2">
          <i class="fa fa-plus text-sm"></i>
          <span>{{ $c.create }}</span>
        </button>
      </div>
    </div>

    <!-- Table Container -->
    <div class="flex-1 overflow-hidden">
      <div class="overflow-y-auto h-full">
        <el-table :data="data" v-loading="isLoading" class="w-full modern-table" highlight-current-row @row-click="handleRowClick" :row-style="{ cursor: 'pointer' }">
          <!-- Serial Number Column -->
          <el-table-column :label="$t('ShareHelpManualTable.serialNumber')" width="80" fixed="left">
            <template slot-scope="scope">
              <span class="font-mono text-gray-500 font-medium">
                {{ (page.page - 1) * page.pageSize + scope.$index + 1 }}
              </span>
            </template>
          </el-table-column>

          <!-- Folder Column -->
          <el-table-column prop="folder_name" :label="'Folder name'" width="140" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.folder_name" class="flex items-center gap-2">
                <i :class="scope.row.folder_icon || 'fa-folder'" class="fa text-sm" :style="{ color: scope.row.folder_color || '#3B82F6' }"></i>
                <span class="text-gray-700 text-sm">{{ scope.row.folder_name }}</span>
              </div>
              <span v-else class="text-gray-400 text-sm">{{ $t('ShareHelpManualTableOutside.noFolder') }}</span>
            </template>
          </el-table-column>

          <!-- File Name Column -->
          <el-table-column prop="file_name" :label="$t('ShareHelpManualTable.fileName')" min-width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <div class="flex items-center gap-2">
                <i class="fa fa-file-o text-blue-500"></i>
                <span class="text-blue-600 hover:text-blue-800 cursor-pointer font-medium hover:underline" @click.stop="handleFilePreview(scope.row)">
                  {{ scope.row.file_name }}
                </span>
              </div>
            </template>
          </el-table-column>

          <!-- File Type Column -->
          <el-table-column prop="file_suffix" :label="$t('ShareHelpManualTable.fileType')" width="100">
            <template slot-scope="scope">
              <span class="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-mono uppercase">
                {{ scope.row.file_suffix }}
              </span>
            </template>
          </el-table-column>

          <!-- Upload Date Column -->
          <el-table-column prop="create_time" :label="$t('ShareHelpManualTable.uploadDate')" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="text-gray-600">
                {{ scope.row.create_time }}
              </span>
            </template>
          </el-table-column>

          <!-- Description Column -->
          <el-table-column prop="description" :label="$t('ShareHelpManualTable.description')" min-width="150" show-overflow-tooltip>
            <template slot-scope="scope">
              <span class="text-gray-700">
                {{ scope.row.description || $c.empty }}
              </span>
            </template>
          </el-table-column>

          <!-- Actions Column -->
          <el-table-column fixed="right" :label="$c.operation" width="120">
            <template slot-scope="scope">
              <div class="flex items-center gap-2">
                <!-- View Button -->
                <button @click.stop="handleAction('view', scope.row)" class="h-8 w-8 flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors duration-200" :title="$c.view">
                  <i class="fa fa-eye text-sm"></i>
                </button>

                <!-- Delete Button -->
                <button v-show="showAuth.m_del" @click.stop="handleAction('delete', scope.row)" class="h-8 w-8 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors duration-200" :title="$c.delete">
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
          <i class="fa fa-book text-gray-400 text-2xl"></i>
        </div>
        <p class="text-gray-500 text-center">{{ $c.table_empty }}</p>
        <button v-show="showAuth.m_add" @click="handleAddClick()" class="mt-4 inline-flex items-center h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full px-4 shadow-sm transition duration-200 ease-in-out transform hover:scale-105 gap-2">
          <i class="fa fa-plus text-sm"></i>
          <span>{{ $t('ShareHelpManualTable.addFirstDocument') }}</span>
        </button>
      </div>
    </div>

    <!-- Footer with Pagination -->
    <div v-if="data && data.length > 0" class="px-6 py-4 border-t border-gray-100 bg-gray-50">
      <div class="flex items-center justify-between">
        <div class="text-sm text-gray-500">{{ $t('ShareHelpManualTable.totalDocuments') }}: {{ total }}</div>
        <z-pagination :pagination="pagination" :total="total" :page.sync="page.page" :limit.sync="page.pageSize" @change="handlePageChange" class="custom-pagination" />
      </div>
    </div>
  </div>
</template>

<script>
import { zPagination } from '@/views/_common'

export default {
  name: 'ShareHelpManualTable',
  components: {
    zPagination,
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
    showAuth: {
      type: Object,
      default: () => ({}),
    },
    page: {
      type: Object,
      default: () => ({ page: 1, pageSize: 15 }),
    },
    total: {
      type: Number,
      default: 0,
    },
    pagination: {
      type: Object,
      default: () => ({
        layout: 'prev, pager, next, jumper, ->, total,sizes',
        pagerCount: 7,
        pageSizes: [10, 15, 20, 30, 40, 50, 100],
      }),
    },
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

    handleFilePreview(row) {
      this.$emit('file-preview', row)
    },

    handlePageChange() {
      this.$emit('page-change')
    },
  },
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
