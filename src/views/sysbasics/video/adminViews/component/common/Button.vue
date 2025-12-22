<template>
  <button 
    :class="[
      'px-4 py-2 font-medium text-sm uppercase rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center',
      variantClasses
    ]"
    :disabled="disabled"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'outline', 'ghost', 'link'].includes(value),
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['click'])

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-[#065FD4] text-white! shadow-sm hover:bg-[#0551B4]'
    case 'secondary':
      return 'bg-[#F2F2F2] text-[#0D0D0D] hover:bg-[#E5E5E5]'
    case 'danger':
      return 'bg-[#CC0000] text-white! shadow-sm hover:bg-[#990000]'
    case 'outline':
      return 'border-2 border-[#065FD4] text-[#065FD4] bg-transparent hover:bg-[#F0F8FF]'
    case 'ghost':
      return 'bg-transparent text-[#065FD4] hover:bg-[#F0F8FF]'
    case 'link':
      return 'bg-transparent text-[#065FD4] px-0 hover:underline'
    default:
      return ''
  }
})
</script>
