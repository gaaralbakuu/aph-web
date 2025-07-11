<template>
  <div class="shadcn-input-wrapper">
    <input
      :type="type"
      :value="value"
      :placeholder="placeholder"
      :disabled="disabled"
      @input="$emit('input', $event.target.value)"
      @focus="$emit('focus', $event)"
      @blur="$emit('blur', $event)"
      class="shadcn-input"
      v-bind="$attrs"
    />
  </div>
</template>

<script>
export default {
  name: 'ShadcnInput',
  props: {
    value: [String, Number],
    placeholder: String,
    type: {
      type: String,
      default: 'text'
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style scoped>
.shadcn-input-wrapper {
  width: 100%;
}

.shadcn-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid #e1e5e9;
  background: #ffffff;
  font-size: 14px;
  font-weight: 400;
  color: #1f2937;
  outline: none;
  transition: all 0.2s ease;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.shadcn-input::placeholder {
  color: #9ca3af;
  font-weight: 400;
}

.shadcn-input:focus {
  border-color: #3b82f6;
  background: #ffffff;
}

.shadcn-input:hover:not(:disabled) {
  border-color: #d1d5db;
}

.shadcn-input:disabled {
  background: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
  border-color: #e5e7eb;
}
</style>
