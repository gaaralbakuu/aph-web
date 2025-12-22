<template>
  <div 
    class="flex items-center gap-2 px-3 py-2 bg-white border border-[#CCCCCC] rounded hover:border-[#606060] transition-colors focus-within:border-[#065FD4]"
    :class="{ 'opacity-50 cursor-not-allowed': disabled }"
  >
    <i class="el-icon-search text-[#606060] text-lg"></i>
    <input 
      :value="modelValue"
      :placeholder="placeholder"
      :disabled="disabled"
      type="text"
      class="bg-transparent border-none outline-none text-sm w-full placeholder-[#999999] disabled:cursor-not-allowed"
      @input="$emit('update:modelValue', $event.target.value)"
      @keyup.enter="$emit('search')"
    />
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  placeholder: {
    type: String,
    default: 'Search...',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

defineEmits(['update:modelValue', 'search'])
</script>
