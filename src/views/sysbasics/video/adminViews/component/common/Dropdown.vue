<template>
  <div class="relative group w-full">
    <!-- Trigger Button -->
    <button
      class="w-full flex items-center justify-between px-3 py-2 bg-white border border-[#CCCCCC] rounded text-sm text-[#0D0D0D] hover:border-[#999999] transition-colors group-hover:border-[#606060]"
      :disabled="disabled"
    >
      <span class="flex items-center gap-2">
        <i v-if="icon" :class="icon" class="text-[#606060]"></i>
        <span class="truncate">
          {{ selectedLabel || placeholder }}
        </span>
      </span>
      <i class="el-icon-arrow-down text-[#606060] text-xs group-hover:rotate-180 transition-transform"></i>
    </button>

    <!-- Invisible hover bridge -->
    <div class="absolute top-full left-0 right-0 h-1 hidden group-hover:block"></div>

    <!-- Dropdown Menu -->
    <div class="absolute top-full left-0 right-0 pt-1 hidden group-hover:block z-50">
      <div class="bg-white border border-[#E5E5E5] rounded shadow-lg">
        <div class="max-h-56 overflow-y-auto">
          <!-- Empty State Option (if provided) -->
          <button
            v-if="clearable && modelValue"
            class="w-full text-left px-3 py-2 hover:bg-[#F2F2F2] text-sm text-[#0D0D0D] border-b border-[#E5E5E5]"
            @click="selectOption(null)">
            {{ clearLabel }}
          </button>

          <!-- Options -->
          <button
            v-for="option in options"
            :key="option[valueKey]"
            class="w-full text-left px-3 py-2 hover:bg-[#F2F2F2] text-sm text-[#0D0D0D] border-b border-[#E5E5E5] last:border-b-0"
            :class="modelValue === option[valueKey] ? 'bg-[#F0F0F0] text-[#065FD4] font-medium' : ''"
            @click="selectOption(option[valueKey])"
          >
            <div class="flex items-center gap-2">
              <i
                class="el-icon-check text-[#065FD4]"
                :class="modelValue === option[valueKey] ? 'opacity-100' : 'opacity-0'"
              ></i>
              <span>{{ option[labelKey] }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: {
    type: [String, Number, null],
    default: null,
  },
  options: {
    type: Array,
    required: true,
    validator: (value) => Array.isArray(value),
  },
  placeholder: {
    type: String,
    default: 'Chọn...',
  },
  clearLabel: {
    type: String,
    default: 'Tất cả',
  },
  icon: {
    type: String,
    default: null,
  },
  labelKey: {
    type: String,
    default: 'label',
  },
  valueKey: {
    type: String,
    default: 'value',
  },
  clearable: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

// Computed property to get selected label
const selectedLabel = computed(() => {
  if (!props.modelValue) return null
  const option = props.options.find((opt) => opt[props.valueKey] === props.modelValue)
  return option ? option[props.labelKey] : null
})

// Select option handler
const selectOption = (value) => {
  emit('update:modelValue', value)
  emit('change', value)
}
</script>

<style scoped></style>
