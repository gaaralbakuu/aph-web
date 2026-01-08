<template>
  <viewer :images="imgSrcs">
    <div v-if="showCount" style="text-align: right;font-size: 12px;">
      {{imgSrcs.length}}/{{maxCount}}
    </div>
    <div class="img-box" v-for="(src,index) in imgSrcs" :key="index"
      :style="Object.assign({},{'background-image':'url('+src+')'},sizeStyle)">
      <a href="javascript:void(0);">
        <img :src="src" :key="src" style="opacity:0;" :style="sizeStyle">
      </a>
      <a v-if="!disabled" href="javascript:void(0);" class="close" @click="deleteImg(index)"></a>
    </div>
    <div class="up_input_wrp" v-if="!disabled && !countDisable" :style="sizeStyle">
      <input class="up_input js_file" type="file" @change="addImg" ref="up_input"
        accept="image/jpg,image/jpeg,image/png,image/gif" :multiple="multiple">
    </div>
  </viewer>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
// import 'viewerjs/dist/viewer.css'

const props = defineProps({
  images: {
    type: Array,
    default: function () {
      return []
    },
  },
  disabled: {
    type: Boolean,
    default: function () {
      return false
    },
  },
  maxCount: {
    type: Number,
    default: function () {
      return 9
    },
  },
  multiple: {
    type: Boolean,
    default: function () {
      return false
    },
  },
  showCount: {
    type: Boolean,
    default: function () {
      return true
    },
  },
  imgSize: {
    type: Number,
    default: function () {
      return 80
    },
  },
})

const emit = defineEmits(['change', 'addImg', 'deleteImg'])

const countDisable = ref({
  type: Boolean,
  default: function () {
    return true
  },
})

const up_input = ref(null)

const addImg = (event) => {
  //是否允许编辑
  if (props.disabled) return
  let inputDOM = up_input.value
  let files = inputDOM.files
  //是否超出最大文件数量限制
  if (props.images.length + files.length > props.maxCount) {
    console.info('Max images count limit')
    countDisable.value = true
    return
  }
  //是否有自定义回调函数
  // Note: $listeners.addImg check replaced with emit
  emit('addImg', files, props.images)
  // Default behavior if no listener (Vue 3 always emits)
  if (!event.defaultPrevented) {
    for (let i = 0; i < files.length; i++) {
      props.images.push(files[i])
    }
  }
}

const deleteImg = (index) => {
  //是否有自定义回调函数
  // Note: $listeners.deleteImg check replaced with emit
  emit('deleteImg', index, props.images)
  // Default behavior if no listener
  if (props.images.length > index) {
    props.images.splice(index, 1)
  }
  if (props.images.length >= props.maxCount) {
    countDisable.value = true
  } else {
    countDisable.value = false
  }
}

const createObjectURL = (file) => {
  let url = null
  if (window.createObjectURL != undefined) {
    // basic
    url = window.createObjectURL(file)
  } else if (window.URL != undefined) {
    // mozilla(firefox)
    url = window.URL.createObjectURL(file)
  } else if (window.webkitURL != undefined) {
    // webkit or chrome
    url = window.webkitURL.createObjectURL(file)
  }
  return url
}

const imgSrcs = computed(() => {
  let imgSrcs = []
  props.images.forEach((i) => {
    if (i.name) {
      imgSrcs.push(createObjectURL(i))
    } else {
      imgSrcs.push(i)
    }
  })
  if (imgSrcs.length >= props.maxCount) {
    countDisable.value = true
  } else {
    countDisable.value = false
  }
  return imgSrcs
})

const sizeStyle = computed(() => {
  let tmp = props.imgSize + 'px'
  return {
    width: tmp,
    height: tmp,
  }
})

watch(() => props.images, (val) => {
  emit('change', val)
})

defineOptions({
  model: {
    prop: 'images',
    event: 'change',
  },
})
</script>

<style scoped>
.viewer-container {
  z-index: 2099 !important;
}

.img-box {
  margin-right: 9px;
  margin-bottom: 9px;
  display: inline-block;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  position: relative;
}

.close {
  background: red;
  color: #fff;
  border: 2px solid #fff;
  border-radius: 10px;
  height: 20px;
  width: 20px;
  line-height: 18px;
  text-align: center;
  font-size: 13px;
  box-sizing: border-box;
  top: -6px;
  right: -6px;
  position: absolute;
}

.close::before {
  content: '\2716';
}

.up_input {
  position: absolute;
  z-index: 1;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

.up_input_wrp {
  display: inline-block;
  position: relative;
  border: 1px solid #d9d9d9;
}

.up_input_wrp:after,
.up_input_wrp:before {
  content: ' ';
  position: absolute;
  top: 50%;
  left: 50%;
  -webkit-transform: translate(-50%, -50%);
  transform: translate(-50%, -50%);
  background-color: #d9d9d9;
}

.up_input_wrp:before {
  width: 2px;
  height: 39.5px;
}

.up_input_wrp:after {
  width: 39.5px;
  height: 2px;
}
.viewer-canvas {
  z-index: 999999999999999;
}
</style>
