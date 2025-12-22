<template>
  <div :class="['relative', { 'group': mode === 'hover' }, className]" ref="dropdownRef">
    <button 
      class="w-full flex items-center justify-between px-3 py-2 bg-white border border-[#CCCCCC] rounded text-sm text-[#0D0D0D] hover:border-[#999999] transition-colors"
      :class="[
        mode === 'hover' ? 'group-hover:border-[#606060]' : '',
        isOpen && mode === 'click' ? 'border-[#606060]' : ''
      ]"
      @click="mode === 'click' ? toggleDropdown() : null"
    >
      <span class="flex items-center gap-2">
        <i :class="iconClass" class="text-[#606060]" v-if="iconClass"></i>
        <span class="truncate">{{ selectedLabel }}</span>
      </span>
      <i 
        class="el-icon-arrow-down text-[#606060] text-xs transition-transform"
        :class="[
          mode === 'hover' ? 'group-hover:rotate-180' : '',
          isOpen && mode === 'click' ? 'rotate-180' : ''
        ]"
      ></i>
    </button>

    <!-- Invisible hover bridge (hover mode only) -->
    <div v-if="mode === 'hover'" class="absolute top-full left-0 right-0 h-1 hidden group-hover:block"></div>

    <!-- Dropdown Menu -->
    <div 
      class="absolute top-full left-0 right-0 pt-1 z-50"
      :class="[
        mode === 'hover' ? 'hidden group-hover:block' : '',
        mode === 'click' ? (isOpen ? 'block' : 'hidden') : ''
      ]"
    >
      <div class="bg-white border border-[#E5E5E5] rounded shadow-lg">
        <div class="max-h-56 overflow-y-auto">
          <!-- Options -->
          <button
            v-for="option in options"
            :key="option.id"
            class="w-full text-left px-3 py-2 hover:bg-[#F2F2F2] text-sm text-[#0D0D0D] border-b border-gray-100 last:border-b-0"
            :class="modelValue === option.id ? 'bg-[#F0F0F0] text-[#065FD4] font-medium' : ''"
            @click="handleSelect(option.id)"
          >
            <div class="flex items-center gap-2">
              <i class="el-icon-check text-[#065FD4]" :class="modelValue === option.id ? 'opacity-100' : 'opacity-0'"></i>
              <span>{{ option[labelKey] }}</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => []
  },
  modelValue: {
    type: [String, Number],
    required: true
  },
  placeholder: {
    type: String,
    default: 'Select option'
  },
  labelKey: {
    type: String,
    default: 'label'
  },
  iconClass: {
    type: String,
    default: ''
  },
  className: {
    type: String,
    default: 'w-48'
  },
  // New props for mode control
  mode: {
    type: String,
    enum: ['hover', 'click'],
    default: 'click'
  },
  closeOnSelect: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['update:modelValue', 'change'])

const isOpen = ref(false)
const dropdownRef = ref(null)

const selectedLabel = computed(() => {
  if (!props.modelValue) {
    return props.placeholder
  }
  const option = props.options.find(o => o.id === props.modelValue)
  return option ? option[props.labelKey] : props.modelValue
})

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const handleSelect = (optionId) => {
  emit('update:modelValue', optionId)
  emit('change', optionId)
  
  // Close dropdown after select if closeOnSelect is true
  if (props.closeOnSelect && props.mode === 'click') {
    closeDropdown()
  }
}

// Handle click outside for click mode
const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    closeDropdown()
  }
}

// Add/remove click outside listener
onMounted(() => {
  if (props.mode === 'click') {
    document.addEventListener('click', handleClickOutside)
  }
})

onUnmounted(() => {
  if (props.mode === 'click') {
    document.removeEventListener('click', handleClickOutside)
  }
})
</script>

<style scoped>
/* Component-specific styles */
</style>
