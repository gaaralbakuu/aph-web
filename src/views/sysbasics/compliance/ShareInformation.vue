<template>
  <div class="h-full flex flex-col overflow-hidden">
    <div class="p-3 border-b border-solid border-gray-100 flex flex-col gap-[1px]">
      <div class="text-2xl font-bold text-black">{{ l.helpManual }} & {{ l.seamainContact }}</div>
      <div class="text-gray-500 text-sm">{{ l.manage }}</div>
    </div>

    <!-- Content Section with Folder Tree + File List Layout -->
    <div class="flex-1 p-3 overflow-hidden">
      <div class="grid grid-cols-12 gap-6 h-full">
        
        <!-- Folder Tree Sidebar -->
        <div class="col-span-3">
          <FolderTree 
            ref="folderTree"
            :showAuth="showAuth"
            @folder-selected="handleFolderSelected"
            :action-refresh="refreshAfterFolderChange"
          />
        </div>

        <!-- Main Content Area -->
        <div class="col-span-9 flex flex-col gap-6 flex-1 overflow-hidden">
          
          <!-- Help Manual Section -->
          <div class="flex-1 flex flex-col overflow-hidden">
            <ShareHelpManualTable 
              :data="helpManualList.list" 
              :isLoading="pageLoading"
              :showAuth="showAuth"
              :page="{ page: helpManualList.curPage, pageSize: helpManualList.pageSize }"
              :total="helpManualList.total"
              :pagination="pagination"
              :selectedFolder="selectedFolder"
              @action="handleHelpManualAction"
              @row-click="handleHelpManualRowClick"
              @add-click="addClickHelp"
              @file-preview="getFilePreview"
              @page-change="getList"
              class="main-table"
            />
          </div>

          <!-- Contact Section -->
          <div class="flex-1 flex flex-col overflow-hidden">
            <ShareContactTable 
              :data="CisCContacterList.list" 
              :isLoading="pageLoading"
              :showAuth="showAuth"
              :page="{ page: CisCContacterList.curPage, pageSize: CisCContacterList.pageSize }"
              :total="CisCContacterList.total"
              :pagination="pagination"
              @action="handleContactAction"
              @row-click="handleContactRowClick"
              @add-click="addClickCis"
              @page-change="getCisList"
              class="main-table"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Upload File Dialog -->
    <CustomDialog 
      :title="l.selectFile"
      width="70%" 
      :lock-scroll="true" 
      :visible.sync="addHelpFormVisible"
      class="modern-dialog"
    >
      <template #content>
        <div class="flex flex-col gap-6">
          <!-- Folder Selection -->
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <i class="fa fa-folder text-white"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">{{ l.selectFolder }}</h4>
                  <p class="text-sm text-gray-600">{{ l.selectFolderDescription }}</p>
                </div>
              </div>
            </div>
            <div class="mt-4">
              <el-select 
                v-model="addHelpManual.selectedFolderId" 
                :placeholder="l.selectFolder"
                class="w-full"
              >
                <el-option
                  v-for="folder in availableFolders"
                  :key="folder.id"
                  :label="folder.folder_name"
                  :value="folder.id"
                >
                  <div class="flex items-center gap-2">
                    <i :class="folder.folder_icon" :style="{ color: folder.folder_color }"></i>
                    <span>{{ folder.folder_name }}</span>
                  </div>
                </el-option>
              </el-select>
            </div>
          </div>

          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <i class="fa fa-cloud-upload text-white"></i>
                </div>
                <div>
                  <h4 class="font-semibold text-gray-900">{{ l.uploadHelpManual }}</h4>
                  <p class="text-sm text-gray-600">{{ l.uploadHelpManualDesc }}</p>
                </div>
              </div>
              <button 
                @click="triggerFileInput"
                class="inline-flex items-center h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-full px-4 shadow-sm transition duration-200 ease-in-out transform hover:scale-105 gap-2"
              >
                <i class="fa fa-folder-open text-sm"></i>
                <span>{{ l.selectFile }}</span>
              </button>
            </div>
          </div>

          <input type="file" @change="file" ref="fileinput" style="display: none" />
          
          <div v-if="addHelpManual.fileList.length > 0" class="bg-gray-50 rounded-lg p-4">
            <h5 class="font-medium text-gray-900 mb-3">{{ l.selectedFiles }}</h5>
            <el-table :data="addHelpManual.fileList" class="modern-table">
              <el-table-column v-for="(item, index) in addHelpManualColumns" :key="index" :prop="item.key" :label="item.title" :width="item.width">
                <template slot-scope="scope">
                  <span v-if="item.key === 'file_name'" class="font-medium text-gray-900">
                    {{ scope.row[item.key] }}
                  </span>
                  <span v-else-if="item.key === 'file_suffix'" class="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs font-mono">
                    {{ scope.row[item.key] }}
                  </span>
                  <span v-else>{{ scope.row[item.key] }}</span>
                </template>
              </el-table-column>
              <el-table-column fixed="right" :label="c.operation" width="100">
                <template slot-scope="scope">
                  <button 
                    @click="removeClick(scope.row)" 
                    class="h-8 w-8 flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors duration-200"
                  >
                    <i class="fa fa-trash text-sm"></i>
                  </button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="flex gap-3 justify-end">
          <button 
            @click="addHelpFormVisible = false" 
            class="h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200"
          >
            {{ c.cancel }}
          </button>
          <button 
            @click="submmitaddHelp" 
            class="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            {{ c.confirm }}
          </button>
        </div>
      </template>
    </CustomDialog>

    <!-- Add Contact Dialog -->
    <CustomDialog 
      :title="l.addContact"
      width="70%" 
      :lock-scroll="true" 
      :visible.sync="addCisFormVisible"
      class="modern-dialog"
    >
      <template #content>
        <div class="flex flex-col gap-6">
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <i class="fa fa-user-plus text-white"></i>
              </div>
              <div>
                <h4 class="font-semibold text-gray-900">{{ l.addNewContact }}</h4>
                <p class="text-sm text-gray-600">{{ l.contactInfoDesc }}</p>
              </div>
            </div>
          </div>

          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <el-form :model="addCisCCtacter.list" :inline="false" label-position="top" class="modern-form">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div v-for="(item, index) in addCisCCtacterFields" :key="index" class="form-group">
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                    {{ item.title }}
                    <span v-if="item.required" class="text-red-500">*</span>
                  </label>
                  <component 
                    :is="getComponentType(item.type)" 
                    v-model="addCisCCtacter.list[item.key]" 
                    :placeholder="item.placeholder" 
                    class="w-full h-10 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  />
                </div>
              </div>
            </el-form>
          </div>
        </div>
      </template>
      <template slot="footer">
        <div class="flex gap-3 justify-end">
          <button 
            @click="addCisFormVisible = false" 
            class="h-10 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200"
          >
            {{ c.cancel }}
          </button>
          <button 
            @click="submmitaddCis" 
            class="h-10 px-4 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors duration-200"
          >
            {{ c.confirm }}
          </button>
        </div>
      </template>
    </CustomDialog>

  </div>
</template>
<script setup>
import { ref, reactive, computed, onMounted, getCurrentInstance, watch } from 'vue'
import { api } from '@/views/_common'

import CustomDialog from '../../_common/CustomDialog.vue'
import FolderTree from './components/FolderTree.vue'
import ShareContactTable from './ShareContactTable.vue'
import ShareHelpManualTable from './ShareHelpManualTable.vue'
import { useLocalI18n } from '@/composables/useLocalI18n'

const { proxy } = getCurrentInstance()
const { l, c } = useLocalI18n('shareInformation')

const folderTree = ref(null)
const fileinput = ref(null)

const pageLoading = ref(false)
const addHelpFormVisible = ref(false)
const addCisFormVisible = ref(false)
const selectedFile = ref(null)
const fileList = ref([]) // Note: this seems to be used for native file input list
const selectedFolder = ref(null)
const availableFolders = ref([])
const userAuth = ref({})

const showAuth = reactive({
  m_search: false,
  m_add: false,
  m_del: false,
  m_updata: false,
  m_import: false,
  m_export: false,
  m_upload: false,
  m_audit: false,
  m_print: false,
})

const pagination = reactive({
  layout: 'prev, pager, next, jumper, ->, total,sizes',
  pagerCount: 7,
  pageSizes: [10, 15, 20, 30, 40, 50, 100],
})

// Columns definitions using computed to react to localization changes
const helpManualColumns = computed(() => [
  {
    title: l.value.serialNumbers,
    key: 'serialNumbers',
    width: 200,
  },
  {
    title: l.value.mainHeader,
    key: 'main_header',
    width: 280,
  },
  {
    title: l.value.manualName,
    key: 'file_name',
    width: 340,
  },
])

const helpManualList = reactive({
  list: [],
  pageSize: 15,
  curPage: 1,
  total: 0,
})

const cisCContacterColumns = computed(() => [
  {
    title: l.value.serialNumbers,
    key: 'serialNumbers',
    width: 200,
  },
  {
    title: l.value.name,
    key: 'contacter_name',
    width: 100,
  },
  {
    title: l.value.contactEmail,
    key: 'contacter_mail',
    width: 280,
  },
  {
    title: l.value.contactPhone,
    key: 'contacter_phone',
    width: 120,
  },
])

const CisCContacterList = reactive({
  list: [],
  pageSize: 15,
  curPage: 1,
  total: 0,
})

const addHelpManualColumns = computed(() => [
  {
    title: l.value.mainHeader,
    key: 'main_header',
    width: 280,
  },
  {
    title: l.value.manualName,
    key: 'file_name',
    width: 400,
  },
  {
    title: l.value.fileSuffix,
    key: 'file_suffix',
    width: 250,
  },
])

const addHelpManual = reactive({
  list: [],
  fileList: [],
  mainHeader: '',
  selectedFolderId: null,
  optionsList: '',
  pageSize: 15,
  curPage: 1,
  total: 0,
})

const addCisCCtacterFields = computed(() => [
  {
    title: l.value.name,
    key: 'contacter_name',
    type: 'el-input',
    placeholder: l.value.pleaseEnterAName,
    span: 8,
    required: true,
  },
  {
    title: l.value.contactEmail,
    key: 'contacter_mail',
    type: 'el-input',
    placeholder: l.value.pleaseEnterAMailbox,
    span: 8,
    required: true,
  },
  {
    title: l.value.contactPhone,
    key: 'contacter_phone',
    type: 'el-input',
    placeholder: l.value.pleaseEnterThePhone,
    span: 8,
    required: false,
  },
])

const addCisCCtacter = reactive({
  list: {},
  // addCisList seems unused in original code except for initialization maybe?
  // But usage in template is `addCisCCtacter.list`.
  // Original initialized `list: {}` but also had `addCisList` which was unused.
  // We can just initialize `list` properly if needed.
  optionsList: '',
  pageSize: 15,
  curPage: 1,
  total: 0,
})

// Methods

function handleFolderSelected(folder) {
  console.log('Folder selected:', folder)
  selectedFolder.value = folder
  getList()
}

function handleHelpManualAction({ action, row }) {
  console.log('Help Manual action:', action, row)

  if (action === 'view') {
    downloadFile(row.file_url, row.file_name)
  } else if (action === 'delete') {
    deleteClick(row, row._index !== undefined ? row._index : null)
  }
}

function handleHelpManualRowClick(row) {
  console.log('Help Manual row clicked:', row)
  downloadFile(row.file_url, row.file_name)
}

function getFilePreview(file) {
  // Not implemented in original code, but referenced in template @file-preview
  console.log('Preview file:', file)
}

function handleContactAction({ action, row }) {
  console.log('Contact action:', action, row)

  if (action === 'view') {
    console.log('View contact:', row)
  } else if (action === 'edit') {
    console.log('Edit contact:', row)
  } else if (action === 'delete') {
    deleteCisClick(row, row._index !== undefined ? row._index : null)
  }
}

function handleContactRowClick(row) {
  console.log('Contact row clicked:', row)
}

function getList(page) {
  // Original accepted page param in template `@page-change="getList"` but didn't use it in code (used this.helpManualList.curPage)
  // But typically the page change event passes the new page number.
  // The original component implementation of ShareHelpManualTable probably updates the prop or emits event.
  // If it emits new page, we should update curPage.
  // Looking at other files, usually zTable/pagination emits page change.
  // Here we assume simple reload or update if page is passed.
  if (typeof page === 'number') {
    helpManualList.curPage = page
  }

  const params = {
    page: helpManualList.curPage,
    pageSize: helpManualList.pageSize,
  }

  if (selectedFolder.value && selectedFolder.value.id) {
    params.folderId = selectedFolder.value.id
  }

  proxy.$request(api.baseUrl + '/Compliance/complianceAttachments/getStudyFile', params)
    .then((r) => {
      console.log(r)
      helpManualList.list = r.data.list
      helpManualList.total = r.data.total
      pageLoading.value = false
    })
    .catch(() => {
      pageLoading.value = false
    })
}

function loadFolders() {
  console.log('Loading folders...')
  proxy.$request(api.baseUrl + '/Compliance/complianceFolders/getFolders', {}, 'get')
    .then((r) => {
        availableFolders.value = r.data || []
    })
    .catch((error) => {
      console.error('Failed to load folders:', error)
    })
}

function refreshFolderStats() {
  if (folderTree.value && folderTree.value.getFolderStats) {
    folderTree.value.getFolderStats()
  }
}

function refreshAfterFolderChange() {
  loadFolders()
  getList()
}

function getCisList(page) {
  if (typeof page === 'number') {
    CisCContacterList.curPage = page
  }
  proxy.$request(api.baseUrl + '/Compliance/ComplianceContacter/getCisCContacter', {
    page: CisCContacterList.curPage,
    pageSize: CisCContacterList.pageSize,
  })
    .then((r) => {
      console.log(r)
      CisCContacterList.list = r.data.list
      CisCContacterList.total = r.data.total
      pageLoading.value = false
    })
    .catch(() => {
      pageLoading.value = false
    })
}

function getComponentType(type) {
  switch (type) {
    case 'el-input':
      return 'el-input'
    default:
      return 'el-input'
  }
}

function addClickHelp() {
  addHelpFormVisible.value = true
}

function triggerFileInput() {
  if (fileinput.value) {
    fileinput.value.click()
  }
}

function submmitaddHelp() {
  console.log(fileList.value)
  console.log(addHelpManual.fileList)
  if (fileList.value && fileList.value.length == 0) {
    proxy.$message({
      type: 'info',
      message: l.value.attachmentAddFail,
    })
    return
  }
  if (!addHelpManual.selectedFolderId) {
    proxy.$message({
      type: 'info',
      message: l.value.selectFolder,
    })
    return
  }
  const formData = new FormData()
  formData.append('file', fileList.value[0])
  formData.append('attachment_type', addHelpManual.fileList[0].attachment_type)
  formData.append('folder_id', addHelpManual.selectedFolderId)

  proxy.$request(api.baseUrl + '/Compliance/complianceAttachments/uploadAttachment', formData, 'post')
    .then((r) => {
      console.log(r)
      proxy.$message({
        type: 'success',
        message: l.value.attachmentAddSuccess,
      })
      addHelpFormVisible.value = false
      addHelpManual.fileList = []
      addHelpManual.selectedFolderId = null
      clearFileInput()
      getList()
      refreshFolderStats()
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: l.value.attachmentAddFail,
      })
    })
}

function addClickCis() {
  addCisFormVisible.value = true
  // Reset form data? Original didn't seem to reset, but good practice.
  // Or maybe it reuses the same object. The original `addCisCCtacter.list` was just `{}` or whatever was left.
  // We'll leave it as is to match original behavior.
}

function submmitaddCis() {
  console.log(addCisCCtacter.list)
  proxy.$confirm(l.value.confirmAddRow, l.value.addContact, {
    confirmButtonText: c.value.confirm,
    cancelButtonText: c.value.cancel,
    type: 'warning',
  })
    .then(() => {
      proxy.$request(api.baseUrl + '/Compliance/ComplianceContacter/addCisCContacter', addCisCCtacter.list, 'post')
        .then((r) => {
          console.log(r)
          proxy.$message({
            type: 'success',
            message: c.value.success,
          })
          getCisList()
          addCisFormVisible.value = false
        })
        .catch(() => {
          proxy.$message({
            type: 'info',
            message: l.value.addFail,
          })
        })
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: l.value.addFail,
      })
    })
}

function deleteCisClick(row, index) {
  console.log(row)
  // row._index might not be available if zTable logic isn't exactly same, but let's assume index is passed or row is enough
  // original code: let i = index + 1
  // proxy.$confirm(l.value.deleteContactContent.replace('$1', i), ...

  // If index is undefined, fallback to something or just don't replace?
  // We can try to find index in list if needed, but 'index' argument is passed from handleContactAction if available.

  let msg = l.value.deleteContactContent
  if (index !== null && index !== undefined) {
      msg = msg.replace('$1', index + 1)
  } else {
      msg = msg.replace('$1', '') // Fallback
  }

  proxy.$confirm(msg, l.value.deleteContactTitle, {
    confirmButtonText: c.value.sure,
    cancelButtonText: c.value.cancel,
    type: 'warning',
  })
    .then(() => {
      proxy.$request(api.baseUrl + '/Compliance/ComplianceContacter/deleteCisCContacter', { id: row.id }, 'post')
        .then((r) => {
          console.log(r)
          proxy.$message({
            type: 'success',
            message: c.value.success,
          })
          getCisList()
        })
        .catch(() => {
          proxy.$message({
            type: 'info',
            message: c.value.info,
          })
        })
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: c.value.info,
      })
    })
}

function file(e) {
  console.log(e)
  fileList.value = e.target.files
  console.log(fileList.value)
  for (let i = 0; i < fileList.value.length; i++) {
    const f = fileList.value[i]
    const file_name = f.name
    const fileExtension = getFileExtension(file_name)
    const reader = new FileReader()

    console.log(fileExtension)
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1]
      let fileInfo = {
        file_name: f.name,
        file_suffix: fileExtension,
        main_header: addHelpManual.mainHeader,
        attachment_type: 3,
        fileContent: base64String,
      }
      addHelpManual.fileList = []
      addHelpManual.fileList.push(fileInfo)
    }

    reader.readAsDataURL(f)
  }
}

function getFileExtension(file_name) {
  return file_name.slice(Math.max(0, file_name.lastIndexOf('.')) || Infinity)
}

function removeClick(row) {
  console.log(addHelpManual.fileList)
  addHelpManual.fileList = []
  addHelpManual.mainHeader = ''
  clearFileInput()
  console.log(fileList.value)
}

function clearFileInput() {
  if (fileinput.value) {
    fileinput.value.value = ''
  }
}

function downloadFile(url, fileName) {
  const fullUrl = api.baseUrl + '/' + url

  const link = document.createElement('a')
  link.href = fullUrl
  link.download = fileName || 'download'
  link.style.display = 'none'
  link.target = '_blank'

  document.body.appendChild(link)
  link.click()

  document.body.removeChild(link)
}

function deleteClick(row, index) {
  console.log(row)

  let msg = l.value.deleteTutorialContent
  if (index !== null && index !== undefined) {
      msg = msg.replace('$1', index + 1)
  } else {
      msg = msg.replace('$1', '')
  }

  proxy.$confirm(msg, l.value.deleteTutorialTitle, {
    confirmButtonText: c.value.sure,
    cancelButtonText: c.value.cancel,
    type: 'warning',
  })
    .then(() => {
      proxy.$request(
        api.baseUrl + '/Compliance/complianceAttachments/deleteAttchment',
        {
          key: row.manufacturerAttchmentId,
          value: 'N',
        },
        'post'
      )
        .then((r) => {
          proxy.$message({
            type: 'success',
            message: c.value.success,
          })
          getList()
          refreshFolderStats()
        })
        .catch(() => {
          proxy.$message({
            type: 'error',
            message: l.value.deleteFail,
          })
        })
    })
    .catch(() => {
      proxy.$message({
        type: 'info',
        message: c.value.info,
      })
    })
}

function getUserAuth() {
  proxy.$request(proxy.$api.checkMenuAuth, {
    resourcepath: proxy.$route.name,
  }).then((r) => {
    userAuth.value = r.data[0]
  })
}

watch(userAuth, (newV) => {
  showAuth.m_add = newV.m_add == 'Y'
  showAuth.m_search = newV.m_search == 'Y'
  showAuth.m_del = newV.m_del == 'Y'
  showAuth.m_updata = newV.m_updata == 'Y'
  showAuth.m_import = newV.m_import == 'Y'
  showAuth.m_export = newV.m_export == 'Y'
  showAuth.m_upload = newV.m_upload == 'Y'
  showAuth.m_audit = newV.m_audit == 'Y'
  showAuth.m_print = newV.m_print == 'Y'
}, { deep: true })

onMounted(() => {
  getList()
  getCisList()
  getUserAuth()
  loadFolders()
})
</script>
<style scoped>
.modern-table {
  border: none;
  border-radius: 8px;
  overflow: hidden;
}
.modern-table :deep(.el-table__header-wrapper) th {
  background-color: #f9fafb;
  color: #374151;
  font-weight: 600;
  border: none;
  font-size: 14px;
  padding: 16px 12px;
}
.modern-table :deep(.el-table__body-wrapper) td {
  border: none;
  border-bottom: 1px solid #f3f4f6;
  padding: 16px 12px;
  font-size: 14px;
}
.modern-table :deep(.el-table__body-wrapper) tr:hover {
  background-color: #f9fafb;
}
.modern-table :deep(.el-table__empty-block) {
  background-color: #f9fafb;
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

.custom-pagination :deep(.el-pagination) {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}
.custom-pagination :deep(.el-pagination) .el-pager li {
  border-radius: 6px;
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  transition: all 0.2s ease-in-out;
}
.custom-pagination :deep(.el-pagination) .el-pager li.active {
  background-color: #3b82f6;
  color: white;
}
.custom-pagination :deep(.el-pagination) .el-pager li:hover:not(.active) {
  background-color: #f3f4f6;
}
.custom-pagination :deep(.el-pagination) .btn-prev,
.custom-pagination :deep(.el-pagination) .btn-next {
  border-radius: 6px;
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease-in-out;
}
.custom-pagination :deep(.el-pagination) .btn-prev:hover,
.custom-pagination :deep(.el-pagination) .btn-next:hover {
  background-color: #f3f4f6;
}

.main-table {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.main-table .modern-table {
  border-radius: 8px;
  overflow: hidden;
}

.main-table .modern-table .el-table__header-wrapper {
  background: #f8fafc;
}

.main-table .modern-table .el-table__header th {
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  font-weight: 600;
  color: #374151;
}

.main-table .modern-table .el-table__row:hover {
  background-color: #f8fafc;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter,
.slide-up-leave-to {
  transform: translateY(20px);
  opacity: 0;
}
</style>