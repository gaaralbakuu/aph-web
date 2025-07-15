<template>
  <el-dialog
    :visible.sync="dialogVisible"
    :title="$l.filePreview"
    width="80%"
    center
    @contextmenu.prevent
    @selectstart.prevent
    @dragstart.prevent
    top="0.5vh"
  >
    <div>
      <div
        v-if="isTextFile"
        @contextmenu.prevent
        @selectstart.prevent
        @dragstart.prevent
      >
        <textarea
          v-model="fileContent"
          readonly
          @contextmenu.prevent
          @selectstart.prevent
          @dragstart.prevent
          v-disable-selection
        ></textarea>
      </div>
      <div
        v-else-if="isImageFile"
        @contextmenu.prevent
        @selectstart.prevent
        @dragstart.prevent
        style="height: 85vh"
      >
        <img
          :src="fileUrl"
          alt="预览图片"
          @contextmenu.prevent
          @selectstart.prevent
          @dragstart.prevent
        />
      </div>
      <div v-else-if="isXlsFile">
        <vue-excel-viewer
          :src="fileUrl"
          :options="options"
          style="height: 85vh"
        />
      </div>
      <div v-else-if="isDocxFile">
        <vue-docx-viewer :src="fileUrl" style="height: 85vh" />
      </div>
      <div v-else-if="isXlsxFile">
        <vue-excel-viewer :src="fileUrl" style="height: 85vh" />
      </div>
      <div v-else-if="isPptxFile">
        <vue-pptx-viewer :src="fileUrl" style="height: 85vh" />
      </div>
      <div v-else-if="isPdfFile">
        <vue-pdf-viewer
          :src="fileUrl"
          @contextmenu.prevent
          @selectstart.prevent
          @dragstart.prevent
          style="height: 85vh"
        />
      </div>
      <div v-else @contextmenu.prevent @selectstart.prevent @dragstart.prevent>
        <p>{{ $l.fileDontSupport }}</p>
      </div>
    </div>
  </el-dialog>
</template>
  
  <script>
import VueDocxViewer from '@vue-office/docx'
import VueExcelViewer from '@vue-office/excel'
import VuePdfViewer from '@vue-office/pdf'
import VuePptxViewer from '@vue-office/pptx'
import '@vue-office/excel/lib/index.css'
import XLSX from 'xlsx'
export default {
  name: 'FilePreview',
  components: {
    VueDocxViewer,
    VueExcelViewer,
    VuePdfViewer,
    VuePptxViewer,
  },
  directives: {
    disableSelection: {
      bind(el) {
        el.onselectstart = () => false // IE
        el.style.userSelect = 'none' // Standard
        el.style.webkitUserSelect = 'none' // Safari
        el.style.MozUserSelect = 'none' // Firefox
        el.style.msUserSelect = 'none' // Edge
        el.addEventListener('mousedown', (e) => e.preventDefault())
      },
    },
  },
  props: {
    fileUrl: {
      type: String,
      required: true,
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      dialogVisible: this.visible,
      fileContent: '',
      sheets: [],
      sheetsData: [],
      activeSheetIndex: 0,
      options: {
        xls: true,
      },
    }
  },
  computed: {
    isTextFile() {
      return this.fileUrl.endsWith('.txt') || this.fileUrl.endsWith('.csv')
    },
    isImageFile() {
      return /\.(jpe?g|png|gif|bmp|svg)$/i.test(this.fileUrl)
    },
    isOfficeFile() {
      return /\.(docx|xlsx|pptx)$/i.test(this.fileUrl)
    },
    isXlsFile() {
      return this.fileUrl.endsWith('.xls')
    },
    isDocxFile() {
      return this.fileUrl.endsWith('.docx')
    },
    isXlsxFile() {
      return this.fileUrl.endsWith('.xlsx')
    },
    isPptxFile() {
      return this.fileUrl.endsWith('.pptx')
    },
    isPdfFile() {
      return this.fileUrl.endsWith('.pdf')
    },
    fileTypeTitle() {
      if (this.isDocxFile) return 'Word 文档预览'
      if (this.isXlsxFile) return 'Excel 文档预览'
      if (this.isXlsFile) return 'Excel 文档预览'
      if (this.isPdfFile) return 'PDF 文档预览'
      return '文件预览'
    },
  },
  watch: {
    visible(val) {
      this.dialogVisible = val
      if (val) {
        this.handleFileUrl()
      }
    },
    dialogVisible(val) {
      if (!val) {
        this.$emit('update:visible', false)
      }
    },
  },
  methods: {
    async fetchFileContent(url) {
      try {
        const response = await fetch(url)
        const text = await response.text()
        this.fileContent = text
      } catch (error) {
        console.error('Error fetching file content:', error)
      }
    },
    handleFileUrl() {
      if (this.isTextFile) {
        this.fetchFileContent(this.fileUrl)
      }
    },
  },
}
</script>
  
  
  <style scoped>
textarea {
  width: 100%;
  height: 800px;
  resize: none;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  padding: 10px;
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}

/* 防止文本选择 */
* {
  -webkit-user-select: none; /* Safari */
  -moz-user-select: none; /* Firefox */
  -ms-user-select: none; /* IE10+/Edge */
  user-select: none; /* Standard */
}
img {
  max-width: 100%;
  max-height: 100%; /* 确保图片高度不超过其容器 */
  object-fit: contain; /* 保持图片比例并适应容器 */
}
</style>