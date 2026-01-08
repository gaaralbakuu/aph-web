<script setup lang="ts">
import {
  CollapsibleRoot,
  CollapsibleTrigger,
  CollapsibleContent,
} from 'radix-vue'
import { cn } from '@/lib/utils'

const props = defineProps({
  open: { type: Boolean, default: undefined },
  defaultOpen: { type: Boolean, default: undefined },
  disabled: { type: Boolean, default: undefined },
  class: { type: String, default: '' },
})

const emits = defineEmits(['update:open'])
</script>

<template>
  <CollapsibleRoot
    :open="open"
    :default-open="defaultOpen"
    :disabled="disabled"
    :class="props.class"
    @update:open="emits('update:open', $event)"
  >
    <slot />
  </CollapsibleRoot>
</template>
