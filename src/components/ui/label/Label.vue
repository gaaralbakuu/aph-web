<script setup lang="ts">
import { Label } from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  class: { type: String, default: '' },
  as: { type: String, default: 'label' },
})
</script>

<template>
  <Label
    :class="cn('text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70', props.class)"
    :as="as"
  >
    <slot />
  </Label>
</template>
