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

<script>
import 'viewerjs/dist/viewer.css'

import Viewer from 'v-viewer'
import Vue from 'vue'

Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 999999,
  },
})

export default {
  model: {
    prop: 'images',
    event: 'change',
  },
  data() {
    return {
      countDisable: {
        type: Boolean,
        default: function () {
          return true
        },
      },
    }
  },
  props: {
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
  },
  methods: {
    addImg(event) {
      //是否允许编辑
      if (this.disabled) return
      let inputDOM = this.$refs.up_input
      let files = inputDOM.files
      //是否超出最大文件数量限制
      if (this.images.length + files.length > this.maxCount) {
        console.info('Max images count limit')
        this.countDisable = true
        return
      }
      //是否有自定义回调函数
      if (this.$listeners.addImg) {
        this.$emit('addImg', files, this.images)
      } else {
        for (let i = 0; i < files.length; i++) {
          this.images.push(files[i])
        }
      }
    },
    deleteImg(index) {
      //是否有自定义回调函数
      if (this.$listeners.deleteImg) {
        this.$emit('deleteImg', index, this.images)
      } else {
        this.images.splice(index, 1)
      }
      if (this.images.length >= this.maxCount) {
        this.countDisable = true
      } else {
        this.countDisable = false
      }
    },
    createObjectURL(file) {
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
    },
  },
  watch: {
    images: function (val) {
      this.$emit('change', val)
    },
  },
  computed: {
    imgSrcs: function () {
      let imgSrcs = []
      let that = this
      this.images.forEach((i) => {
        if (i.name) {
          imgSrcs.push(that.createObjectURL(i))
        } else {
          imgSrcs.push(i)
        }
      })
      if (imgSrcs.length >= this.maxCount) {
        that.countDisable = true
      } else {
        that.countDisable = false
      }
      return imgSrcs
    },
    sizeStyle: function () {
      let tmp = this.imgSize + 'px'
      return {
        width: tmp,
        height: tmp,
      }
    },
  },
}
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
