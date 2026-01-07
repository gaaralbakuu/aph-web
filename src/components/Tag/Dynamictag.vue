<template>
  <div>
    <el-tag :key="tag" v-for="tag in tags" closable :size="conf.tagSize" :disable-transitions="false"
      @close="handleClose(tag)">
      {{tag}}
    </el-tag>
    <el-input class="input-new-tag" v-if="inputVisible" v-model="inputValue" ref="saveTagInput" :size="conf.inputSize"
      :style="{width:conf.inputWidth+'px'}" @keyup.enter.prevent="handleInputConfirm" @blur="handleInputConfirm">
    </el-input>
    <el-button v-else type="primary" class="button-new-tag" :size="conf.buttonSize" icon="el-icon-plus"
      @click="showInput" circle></el-button>
  </div>
</template>
<style>
.el-tag + .el-tag {
  margin-left: 10px;
}

.button-new-tag {
  margin-left: 10px;
}

.input-new-tag {
  margin-left: 10px;
  vertical-align: bottom;
}
</style>

<script>
const defaultConfig = {
  tagSize: 'medium',
  buttonSize: 'mini',
  inputSize: 'mini',
  inputWidth: '120',
  // buttonLabel: '+ New Tag'
}
export default {
  model: {
    prop: 'tags',
    event: 'change',
  },
  props: {
    tags: Array,
    config: Object,
  },
  data() {
    return {
      conf: Object.assign({}, defaultConfig, this.config),
      inputVisible: false,
      inputValue: '',
    }
  },
  methods: {
    handleClose(tag) {
      this.tags.splice(this.tags.indexOf(tag), 1)
    },

    showInput() {
      this.inputVisible = true
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    handleInputConfirm() {
      const inputValue = this.inputValue
      if (inputValue) {
        this.tags.push(inputValue)
      }
      this.inputVisible = false
      this.inputValue = ''
    },
  },
  watch: {
    tags: function (newValue, oldValue) {
      this.$emit('update', newValue)
    },
  },
}
</script>
