<template>
  <div class="h-full bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fa fa-folder text-blue-500"></i>
          <h3 class="text-sm font-semibold text-gray-900">{{ $t('shareInformation.folders') }}</h3>
        </div>
        <button v-show="showAuth.m_add" @click="openCreateFolderDialog()" class="h-8 w-8 flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors duration-200" :title="$t('shareInformation.createFolder')">
          <i class="fa fa-plus text-xs"></i>
        </button>
      </div>
    </div>

    <!-- Folder List -->
    <div class="flex-1 overflow-y-auto" style="max-height: 500px">
      <div class="p-2">
        <!-- All Files -->
        <div @click="selectFolder(null)" :class="['flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 mb-1', selectedFolderId === null ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent']">
          <div class="flex items-center gap-2 flex-1">
            <i class="fa fa-files-o text-gray-500"></i>
            <span class="text-sm font-medium text-gray-700">{{ $t('shareInformation.allFiles') }}</span>
          </div>
          <span class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
            {{ totalFiles }}
          </span>
        </div>

        <!-- Folder Items -->
        <div v-for="folder in folders" :key="folder.id" @click="selectFolder(folder.id)" @contextmenu.prevent="openContextMenu($event, folder)" :class="['flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all duration-200 mb-1 group', selectedFolderId === folder.id ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent']">
          <div class="flex items-center gap-2 flex-1">
            <i :class="folder.folder_icon || 'fa-folder'" class="fa" :style="{ color: folder.folder_color || '#3B82F6' }"></i>
            <span class="text-sm font-medium text-gray-700">{{ folder.folder_name }}</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {{ folder.file_count || 0 }}
            </span>
            <button v-show="showAuth.m_updata" @click.stop="openEditFolderDialog(folder)" class="h-6 w-6 flex items-center justify-center bg-gray-50 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100" :title="$t('shareInformation.editFolder')">
              <i class="fa fa-edit text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Folder Dialog -->
    <CustomDialog :title="editingFolder ? $t('shareInformation.editFolder') : $t('shareInformation.createFolder')" width="500px" :lock-scroll="true" :visible.sync="folderDialogVisible" class="modern-dialog">
      <template #content>
        <div class="flex flex-col gap-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <i class="fa fa-folder text-white"></i>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">
                  {{ editingFolder ? $t('shareInformation.editFolder') : $t('shareInformation.createFolder') }}
                </h4>
                <p class="text-sm text-gray-600">
                  {{ editingFolder ? 'Cập nhật thông tin thư mục' : 'Tạo thư mục mới để tổ chức tài liệu' }}
                </p>
              </div>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <el-form :model="folderForm" :inline="false" label-position="top" class="modern-form">
              <div class="grid grid-cols-1 gap-6">
                <!-- Folder Name -->
                <div class="form-group">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('shareInformation.folderName') }}
                    <span class="text-red-500">*</span>
                  </label>
                  <el-input v-model="folderForm.folder_name" :placeholder="$t('shareInformation.pleaseEnterFolderName')" class="w-full h-10 rounded-lg" />
                </div>

                <!-- Folder Description -->
                <div class="form-group">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ $t('shareInformation.folderDescription') }}
                  </label>
                  <el-input type="textarea" v-model="folderForm.folder_description" :placeholder="'Nhập mô tả cho thư mục...'" :rows="3" class="w-full rounded-lg" />
                </div>

                <!-- Color and Icon -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="form-group">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('shareInformation.folderColor') }}
                    </label>
                    <div class="flex gap-2 flex-wrap">
                      <div v-for="color in predefinedColors" :key="color" @click="folderForm.folder_color = color" :class="['w-8 h-8 rounded-lg cursor-pointer border-2 transition-all duration-200', folderForm.folder_color === color ? 'border-gray-400 scale-110' : 'border-gray-200 hover:border-gray-300']" :style="{ backgroundColor: color }"></div>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ $t('shareInformation.folderIcon') }}
                    </label>
                    <div class="flex gap-2 flex-wrap">
                      <div v-for="icon in predefinedIcons" :key="icon" @click="folderForm.folder_icon = icon" :class="['w-8 h-8 rounded-lg cursor-pointer border-2 transition-all duration-200 flex items-center justify-center', folderForm.folder_icon === icon ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50']">
                        <i :class="icon" class="fa text-gray-600"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </el-form>
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="flex gap-3 justify-end">
          <button @click="folderDialogVisible = false" class="h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200">
            {{ $c.cancel }}
          </button>
          <button @click="saveFolderForm" class="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
            {{ $c.confirm }}
          </button>
        </div>
      </template>
    </CustomDialog>

    <!-- Context Menu -->
    <div v-if="contextMenuVisible" :style="{ top: contextMenuY + 'px', left: contextMenuX + 'px' }" class="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[150px]">
      <div @click="openEditFolderDialog(contextFolder)" class="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer flex items-center gap-2">
        <i class="fa fa-edit"></i>
        {{ $t('shareInformation.editFolder') }}
      </div>
      <div v-show="showAuth.m_del" @click="confirmDeleteFolder(contextFolder)" class="px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer flex items-center gap-2">
        <i class="fa fa-trash"></i>
        {{ $t('shareInformation.deleteFolder') }}
      </div>
    </div>

    <!-- Overlay to close context menu -->
    <div v-if="contextMenuVisible" @click="contextMenuVisible = false" class="fixed inset-0 z-40"></div>
  </div>
</template>

<script>
import { api } from '@/views/_common'

import CustomDialog from '../../../_common/CustomDialog.vue'

export default {
  name: 'FolderTree',
  components: {
    CustomDialog,
  },
  props: {
    showAuth: {
      type: Object,
      default: () => ({}),
    },
    actionRefresh: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      folders: [],
      selectedFolderId: null,
      totalFiles: 0,
      loading: false,

      // Dialog
      folderDialogVisible: false,
      editingFolder: null,
      folderForm: {
        folder_name: '',
        folder_description: '',
        folder_color: '#3B82F6',
        folder_icon: 'fa-folder',
      },

      // Context Menu
      contextMenuVisible: false,
      contextMenuX: 0,
      contextMenuY: 0,
      contextFolder: null,

      // Predefined options
      predefinedColors: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'],
      predefinedIcons: ['fa-folder', 'fa-book', 'fa-file-text-o', 'fa-cog', 'fa-star', 'fa-heart', 'fa-briefcase', 'fa-archive'],
    }
  },
  created() {
    // this.fetchFolders()
    this.getFolderStats()
  },
  methods: {
    async fetchFolders() {
      try {
        this.loading = true
        const response = await this.$request(api.baseUrl + '/Compliance/complianceFolders/getFolders', {}, 'get')
        this.folders = response.data || []
      } catch (error) {
        console.error('Error fetching folders:', error)
        this.$message.error('Lấy danh sách thư mục thất bại')
      } finally {
        this.loading = false
      }
    },

    async getFolderStats() {
      try {
        const response = await this.$request(api.baseUrl + '/Compliance/complianceFolders/getFolderStats', {}, 'get')
        if (response.data) {
          this.folders = response.data
          this.totalFiles = response.data.reduce((sum, folder) => sum + (folder.file_count || 0), 0)

        }
      } catch (error) {
        console.error('Error fetching folder stats:', error)
      }
    },

    selectFolder(folderId) {
      this.selectedFolderId = folderId
      // Emit the folder object instead of just ID for better consistency
      const selectedFolder = folderId ? this.folders.find((f) => f.id === folderId) : null
      this.$emit('folder-selected', selectedFolder)
    },

    openCreateFolderDialog() {
      this.editingFolder = null
      this.folderForm = {
        folder_name: '',
        folder_description: '',
        folder_color: '#3B82F6',
        folder_icon: 'fa-folder',
      }
      this.folderDialogVisible = true
    },

    openEditFolderDialog(folder) {
      this.editingFolder = folder
      this.folderForm = {
        id: folder.id,
        folder_name: folder.folder_name,
        folder_description: folder.folder_description || '',
        folder_color: folder.folder_color || '#3B82F6',
        folder_icon: folder.folder_icon || 'fa-folder',
      }
      this.folderDialogVisible = true
      this.contextMenuVisible = false
    },

    async saveFolderForm() {
      if (!this.folderForm.folder_name.trim()) {
        this.$message.warning(this.$t('shareInformation.pleaseEnterFolderName'))
        return
      }

      try {
        if (this.editingFolder) {
          await this.$request(api.baseUrl + '/Compliance/complianceFolders/updateFolder', this.folderForm, 'put')
          this.$message.success('Cập nhật thư mục thành công')
        } else {
          await this.$request(api.baseUrl + '/Compliance/complianceFolders/createFolder', this.folderForm, 'post')
          this.$message.success('Tạo thư mục thành công')

        }

        this.folderDialogVisible = false
        this.fetchFolders()
        this.getFolderStats()
        this.actionRefresh() // Refresh parent component if needed
      } catch (error) {
        console.error('Error saving folder:', error)
        this.$message.error(this.editingFolder ? 'Cập nhật thư mục thất bại' : 'Tạo thư mục thất bại')
      }
    },

    openContextMenu(event, folder) {
      this.contextFolder = folder
      this.contextMenuX = event.clientX
      this.contextMenuY = event.clientY
      this.contextMenuVisible = true
    },

    confirmDeleteFolder(folder) {
      this.$confirm(`Bạn có chắc chắn muốn xóa thư mục "${folder.folder_name}" không? Các tài liệu trong thư mục sẽ được chuyển về thư mục mặc định.`, 'Xóa thư mục', {
        confirmButtonText: this.$c.confirm,
        cancelButtonText: this.$c.cancel,
        type: 'warning',
      })
        .then(() => {
          this.deleteFolder(folder.id)
        })
        .catch(() => {
          this.$message.info('Đã hủy xóa')
        })
      this.contextMenuVisible = false
    },

    async deleteFolder(folderId) {
      try {
        await this.$request(api.baseUrl + `/Compliance/complianceFolders/deleteFolder`, { id: folderId }, 'post')
        this.$message.success('Xóa thư mục thành công')
        this.fetchFolders()
        this.getFolderStats()
        this.actionRefresh() // Refresh parent component after deletion

        if (this.selectedFolderId === folderId) {
          this.selectFolder(null)
        }
      } catch (error) {
        console.error('Error deleting folder:', error)
        this.$message.error('Xóa thư mục thất bại')
      }
    },
  },
}
</script>

<style scoped>
.modern-form .form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #374151;
}
.modern-form .form-group :deep(.el-input__inner) {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  height: 40px;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
}
.modern-form .form-group :deep(.el-input__inner):focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
.modern-form .form-group :deep(.el-textarea__inner) {
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  transition: all 0.2s ease-in-out;
}
.modern-form .form-group :deep(.el-textarea__inner):focus {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.modern-dialog :deep(.el-dialog) {
  border-radius: 16px;
  border: none;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}
.modern-dialog :deep(.el-dialog__header) {
  border-bottom: 1px solid #f3f4f6;
  padding: 24px 24px 16px;
  margin-bottom: 0;
}
.modern-dialog :deep(.el-dialog__title) {
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}
.modern-dialog :deep(.el-dialog__body) {
  padding: 24px;
}
.modern-dialog :deep(.el-dialog__footer) {
  border-top: 1px solid #f3f4f6;
  padding: 16px 24px 24px;
}
</style>
