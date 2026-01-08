<template>
  <div>
    <input ref="excel-upload-input" class="excel-upload-input" type="file" accept=".xlsx, .xls" @change="handleClick">
    <div class="drop" @drop="handleDrop" @dragover="handleDragover" @dragenter="handleDragover">
      <div class="file-name">
        <span v-if="!name">拖拽excel文件</span>
        <span v-else>{{name}}</span>
      </div>
      <el-button style="vertical-align: middle;" :loading="loading" type="success" plain @click="handleUpload">
        浏览
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import XLSX from 'xlsx'

defineOptions({
  name: 'UploadExcel'
})

const props = defineProps({
  beforeUpload: Function, // eslint-disable-line
  onSuccess: Function, // eslint-disable-line
})

const { proxy } = getCurrentInstance()

const name = ref(null)
const loading = ref(false)
const excelData = ref({
  header: null,
  results: null,
})

const generateData = ({ header, results }) => {
  excelData.value.header = header
  excelData.value.results = results
  props.onSuccess && props.onSuccess(excelData.value)
}

const handleDrop = (e) => {
  e.stopPropagation()
  e.preventDefault()
  if (loading.value) return
  const files = e.dataTransfer.files
  if (files.length !== 1) {
    proxy.$message.error('Only support uploading one file!')
    return
  }
  const rawFile = files[0] // only use files[0]
  name.value = rawFile.name

  if (!isExcel(rawFile)) {
    proxy.$message.error(
      'Only supports upload .xlsx, .xls, .csv suffix files'
    )
    return false
  }
  upload(rawFile)
  e.stopPropagation()
  e.preventDefault()
}

const handleDragover = (e) => {
  e.stopPropagation()
  e.preventDefault()
  e.dataTransfer.dropEffect = 'copy'
}

const handleUpload = () => {
  proxy.$refs['excel-upload-input'].click()
}

const handleClick = (e) => {
  const files = e.target.files
  const rawFile = files[0] // only use files[0]
  name.value = rawFile.name
  if (!rawFile) return
  upload(rawFile)
}

const upload = (rawFile) => {
  proxy.$refs['excel-upload-input'].value = null // fix can't select the same excel

  if (!props.beforeUpload) {
    readerData(rawFile)
    return
  }
  const before = props.beforeUpload(rawFile)
  if (before) {
    readerData(rawFile)
  }
}

const readerData = (rawFile) => {
  loading.value = true
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const data = e.target.result
      const fixedData = fixData(data)
      const workbook = XLSX.read(btoa(fixedData), { type: 'base64' })
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      const header = getHeaderRow(worksheet)
      const results = XLSX.utils.sheet_to_json(worksheet)
      generateData({ header, results })
      loading.value = false
      resolve()
    }
    reader.readAsArrayBuffer(rawFile)
  })
}

const fixData = (data) => {
  let o = ''
  let l = 0
  const w = 10240
  for (; l < data.byteLength / w; ++l)
    o += String.fromCharCode.apply(
      null,
      new Uint8Array(data.slice(l * w, l * w + w))
    )
  o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
  return o
}

const getHeaderRow = (sheet) => {
  const headers = []
  const range = XLSX.utils.decode_range(sheet['!ref'])
  let C
  const R = range.s.r
  /* start in the first row */
  for (C = range.s.c; C <= range.e.c; ++C) {
    /* walk every column in the range */
    const cell = sheet[XLSX.utils.encode_cell({ c: C, r: R })]
    /* find the cell in the first row */
    let hdr = 'UNKNOWN ' + C // <-- replace with your desired default
    if (cell && cell.t) hdr = XLSX.utils.format_cell(cell)
    headers.push(hdr)
  }
  return headers
}

const isExcel = (file) => {
  return /\.(xlsx|xls|csv)$/.test(file.name)
}

const clear = () => {
  name.value = ''
}

defineExpose({
  clear
})
</script>

<style scoped>
.excel-upload-input {
  display: none;
  z-index: -9999;
}

.drop {
  border: 2px dashed #bbb;
  width: 600px;
  height: 160px;
  margin: 0 auto;
  font-size: 24px;
  border-radius: 5px;
  color: #bbb;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 5px;
}
.file-name {
  max-width: 500px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: center;
  margin-right: 5px;
}
</style>
