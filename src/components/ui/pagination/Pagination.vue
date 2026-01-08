<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { computed } from 'vue'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const props = defineProps({
  modelValue: { type: Number, required: true },
  total: { type: Number, required: true },
  pageSize: { type: Number, default: 10 },
  class: { type: String, default: '' },
})

const emits = defineEmits(['update:modelValue'])

const page = useVModel(props, 'modelValue', emits, { passive: true })
const totalPages = computed(() => Math.ceil(props.total / props.pageSize))

function prev() {
  if (page.value > 1) page.value--
}

function next() {
  if (page.value < totalPages.value) page.value++
}
</script>

<template>
  <div :class="cn('flex items-center space-x-2', props.class)">
    <Button variant="outline" size="sm" @click="prev" :disabled="page <= 1">
      Previous
    </Button>
    <div class="text-sm font-medium">
      Page {{ page }} of {{ totalPages }}
    </div>
    <Button variant="outline" size="sm" @click="next" :disabled="page >= totalPages">
      Next
    </Button>
  </div>
</template>
