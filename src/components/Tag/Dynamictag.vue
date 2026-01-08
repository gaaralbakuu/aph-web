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

<script setup>
import { ref, watch, nextTick } from 'vue'

const defaultConfig = {
  tagSize: 'medium',
  buttonSize: 'mini',
  inputSize: 'mini',
  inputWidth: '120',
  // buttonLabel: '+ New Tag'
}

defineOptions({
  model: {
    prop: 'tags',
    event: 'change',
  },
})

const props = defineProps({
  tags: Array,
  config: Object,
})

const emit = defineEmits(['update'])

const conf = ref(Object.assign({}, defaultConfig, props.config))
const inputVisible = ref(false)
const inputValue = ref('')
const saveTagInput = ref(null)

const handleClose = (tag) => {
  props.tags.splice(props.tags.indexOf(tag), 1)
}

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    saveTagInput.value.$refs.input.focus()
  })
}

const handleInputConfirm = () => {
  const inputValueLocal = inputValue.value
  if (inputValueLocal) {
    props.tags.push(inputValueLocal)
  }
  inputVisible.value = false
  inputValue.value = ''
}

watch(() => props.tags, (newValue, oldValue) => {
  emit('update', newValue)
})
</script>
