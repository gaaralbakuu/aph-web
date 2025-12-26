<template>
  <div class="h-full bg-white rounded-xl shadow-lg overflow-hidden">
    <!-- Header -->
    <div class="px-4 py-3 border-b border-gray-100">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <i class="fa fa-folder text-blue-500"></i>
          <h3 class="text-sm font-semibold text-gray-900">{{ l.folders }}</h3>
        </div>
        <button v-show="showAuth.m_add" @click="openCreateFolderDialog()" class="h-8 w-8 flex items-center justify-center bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors duration-200" :title="l.createFolder">
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
            <span class="text-sm font-medium text-gray-700">{{ l.allFiles }}</span>
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
            <button v-show="showAuth.m_updata" @click.stop="openEditFolderDialog(folder)" class="h-6 w-6 flex items-center justify-center bg-gray-50 hover:bg-blue-100 text-gray-600 hover:text-blue-600 rounded-full transition-colors duration-200 opacity-0 group-hover:opacity-100" :title="l.editFolder">
              <i class="fa fa-edit text-xs"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Folder Dialog -->
    <CustomDialog :title="editingFolder ? l.editFolder : l.createFolder" width="500px" :lock-scroll="true" :visible.sync="folderDialogVisible" class="modern-dialog">
      <template #content>
        <div class="flex flex-col gap-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <i class="fa fa-folder text-white"></i>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">
                  {{ editingFolder ? l.editFolder : l.createFolder }}
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
                    {{ l.folderName }}
                    <span class="text-red-500">*</span>
                  </label>
                  <el-input v-model="folderForm.folder_name" :placeholder="l.pleaseEnterFolderName" class="w-full h-10 rounded-lg" />
                </div>

                <!-- Folder Description -->
                <div class="form-group">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ l.folderDescription }}
                  </label>
                  <el-input type="textarea" v-model="folderForm.folder_description" :placeholder="'Nhập mô tả cho thư mục...'" :rows="3" class="w-full rounded-lg" />
                </div>

                <!-- Color and Icon -->
                <div class="grid grid-cols-2 gap-4">
                  <div class="form-group">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ l.folderColor }}
                    </label>
                    <div class="flex gap-2 flex-wrap">
                      <div v-for="color in predefinedColors" :key="color" @click="folderForm.folder_color = color" :class="['w-8 h-8 rounded-lg cursor-pointer border-2 transition-all duration-200', folderForm.folder_color === color ? 'border-gray-400 scale-110' : 'border-gray-200 hover:border-gray-300']" :style="{ backgroundColor: color }"></div>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="block text-sm font-medium text-gray-700 mb-2">
                      {{ l.folderIcon }}
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
            {{ c.cancel }}
          </button>
          <button @click="saveFolderForm" class="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200">
            {{ c.confirm }}
          </button>
        </div>
      </template>
    </CustomDialog>

    <!-- Context Menu -->
    <div v-if="contextMenuVisible" :style="{ top: contextMenuY + 'px', left: contextMenuX + 'px' }" class="fixed z-50 bg-white rounded-lg shadow-xl border border-gray-200 py-2 min-w-[150px]">
      <div @click="openEditFolderDialog(contextFolder)" class="px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer flex items-center gap-2">
        <i class="fa fa-edit"></i>
        {{ l.editFolder }}
      </div>
      <div v-show="showAuth.m_del" @click="confirmDeleteFolder(contextFolder)" class="px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer flex items-center gap-2">
        <i class="fa fa-trash"></i>
        {{ l.deleteFolder }}
      </div>
    </div>

    <!-- Overlay to close context menu -->
    <div v-if="contextMenuVisible" @click="contextMenuVisible = false" class="fixed inset-0 z-40"></div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, getCurrentInstance } from 'vue'
import { api } from '@/views/_common'
import CustomDialog from '../../../_common/CustomDialog.vue'
import { useLocalI18n } from '@/composables/useLocalI18n'

const props = defineProps({
  showAuth: {
    type: Object,
    default: () => ({}),
  },
  actionRefresh: {
    type: Function,
    default: () => {},
  },
})

const emit = defineEmits(['folder-selected'])

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('shareInformation')

const folders = ref([])
const selectedFolderId = ref(null)
const totalFiles = ref(0)
const loading = ref(false)

// Dialog
const folderDialogVisible = ref(false)
const editingFolder = ref(null)
const folderForm = reactive({
  folder_name: '',
  folder_description: '',
  folder_color: '#3B82F6',
  folder_icon: 'fa-folder',
})

// Context Menu
const contextMenuVisible = ref(false)
const contextMenuX = ref(0)
const contextMenuY = ref(0)
const contextFolder = ref(null)

// Predefined options
const predefinedColors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280']
const predefinedIcons = ['fa-folder', 'fa-book', 'fa-file-text-o', 'fa-cog', 'fa-star', 'fa-heart', 'fa-briefcase', 'fa-archive']

async function fetchFolders() {
  try {
    loading.value = true
    const response = await proxy.$request(api.baseUrl + '/Compliance/complianceFolders/getFolders', {}, 'get')
    folders.value = response.data || []
  } catch (error) {
    console.error('Error fetching folders:', error)
    proxy.$message.error('Lấy danh sách thư mục thất bại')
  } finally {
    loading.value = false
  }
}

async function getFolderStats() {
  try {
    const response = await proxy.$request(api.baseUrl + '/Compliance/complianceFolders/getFolderStats', {}, 'get')
    if (response.data) {
      folders.value = response.data
      totalFiles.value = response.data.reduce((sum, folder) => sum + (folder.file_count || 0), 0)
    }
  } catch (error) {
    console.error('Error fetching folder stats:', error)
  }
}

function selectFolder(folderId) {
  selectedFolderId.value = folderId
  const selectedFolder = folderId ? folders.value.find((f) => f.id === folderId) : null
  emit('folder-selected', selectedFolder)
}

function openCreateFolderDialog() {
  editingFolder.value = null
  Object.assign(folderForm, {
    folder_name: '',
    folder_description: '',
    folder_color: '#3B82F6',
    folder_icon: 'fa-folder',
    id: undefined // clear id if it was there
  })
  folderDialogVisible.value = true
}

function openEditFolderDialog(folder) {
  editingFolder.value = folder
  Object.assign(folderForm, {
    id: folder.id,
    folder_name: folder.folder_name,
    folder_description: folder.folder_description || '',
    folder_color: folder.folder_color || '#3B82F6',
    folder_icon: folder.folder_icon || 'fa-folder',
  })
  folderDialogVisible.value = true
  contextMenuVisible.value = false
}

async function saveFolderForm() {
  if (!folderForm.folder_name.trim()) {
    proxy.$message.warning(l.value.pleaseEnterFolderName)
    return
  }

  try {
    if (editingFolder.value) {
      await proxy.$request(api.baseUrl + '/Compliance/complianceFolders/updateFolder', folderForm, 'put')
      proxy.$message.success('Cập nhật thư mục thành công')
    } else {
      await proxy.$request(api.baseUrl + '/Compliance/complianceFolders/createFolder', folderForm, 'post')
      proxy.$message.success('Tạo thư mục thành công')
    }

    folderDialogVisible.value = false
    fetchFolders()
    getFolderStats()
    props.actionRefresh()
  } catch (error) {
    console.error('Error saving folder:', error)
    proxy.$message.error(editingFolder.value ? 'Cập nhật thư mục thất bại' : 'Tạo thư mục thất bại')
  }
}

function openContextMenu(event, folder) {
  contextFolder.value = folder
  contextMenuX.value = event.clientX
  contextMenuY.value = event.clientY
  contextMenuVisible.value = true
}

function confirmDeleteFolder(folder) {
  proxy.$confirm(`Bạn có chắc chắn muốn xóa thư mục "${folder.folder_name}" không? Các tài liệu trong thư mục sẽ được chuyển về thư mục mặc định.`, 'Xóa thư mục', {
    confirmButtonText: c.value.confirm,
    cancelButtonText: c.value.cancel,
    type: 'warning',
  })
    .then(() => {
      deleteFolder(folder.id)
    })
    .catch(() => {
      proxy.$message.info('Đã hủy xóa')
    })
  contextMenuVisible.value = false
}

async function deleteFolder(folderId) {
  try {
    await proxy.$request(api.baseUrl + `/Compliance/complianceFolders/deleteFolder`, { id: folderId }, 'post')
    proxy.$message.success('Xóa thư mục thành công')
    fetchFolders()
    getFolderStats()
    props.actionRefresh()

    if (selectedFolderId.value === folderId) {
      selectFolder(null)
    }
  } catch (error) {
    console.error('Error deleting folder:', error)
    proxy.$message.error('Xóa thư mục thất bại')
  }
}

// Expose getFolderStats for parent to call
defineExpose({
    getFolderStats
})

onMounted(() => {
  getFolderStats()
})
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