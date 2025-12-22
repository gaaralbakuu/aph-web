<template>
  <div class="flex items-center gap-2 text-xs text-[#606060]">
    <span>{{ l?.rowsPerPage || 'Rows per page' }}:</span>
    <select
      class="border-none bg-transparent outline-none font-medium text-[#0D0D0D] cursor-pointer"
      :value="pageSize"
      @change="onPageSizeChange"
    >
      <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">{{ opt }}</option>
    </select>
    <span class="mx-2">
      {{ (page - 1) * pageSize + 1 }}-{{ Math.min(page * pageSize, total) }}
      {{ l?.of || 'of' }}
      {{ total }}
    </span>
    <i
      class="el-icon-arrow-left p-1 rounded-full text-base transition-colors"
      :class="page <= 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#F2F2F2]'"
      @click="onPrevPage"
    ></i>
    <i
      class="el-icon-arrow-right p-1 rounded-full text-base transition-colors"
      :class="page >= totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-[#F2F2F2]'"
      @click="onNextPage"
    ></i>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  page: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  pageSizeOptions: {
    type: Array,
    default: () => [10, 30, 50]
  },
  l: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:page', 'update:pageSize', 'change'])

const totalPages = computed(() => {
  if (props.pageSize === 0) return 0
  return Math.ceil(props.total / props.pageSize)
})

const onPageSizeChange = (event) => {
  const newSize = parseInt(event.target.value)
  emit('update:pageSize', newSize)
  emit('update:page', 1)
  emit('change')
}

const onPrevPage = () => {
  if (props.page > 1) {
    emit('update:page', props.page - 1)
    emit('change')
  }
}

const onNextPage = () => {
  if (props.page < totalPages.value) {
    emit('update:page', props.page + 1)
    emit('change')
  }
}
</script>
