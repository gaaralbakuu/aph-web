<template>
  <div v-if="visible" class="custom-dialog-overlay" @click="handleOverlayClick">
    <div class="custom-dialog" :class="customClass" :style="dialogStyle" @click.stop>
      <!-- Header -->
      <div class="custom-dialog__header">
        <h2 class="custom-dialog__title">{{ title }}</h2>
        <button class="custom-dialog__close" @click="handleClose" type="button">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <!-- Body -->
      <div class="custom-dialog__body">
        <slot name="content">
          <slot></slot>
        </slot>
      </div>

      <!-- Footer -->
      <div class="custom-dialog__footer" v-if="$slots.footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CustomDialog',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: '',
    },
    width: {
      type: String,
      default: '50%',
    },
    customClass: {
      type: String,
      default: '',
    },
    closeOnClickModal: {
      type: Boolean,
      default: true,
    },
    clickOutside: {
      type: Boolean,
      default: true,
    },
  },
  computed: {
    dialogStyle() {
      return {
        width: this.width,
        maxWidth: '90vw',
      }
    },
  },
  methods: {
    handleClose() {
      this.$emit('update:visible', false)
      this.$emit('close')
    },
    handleOverlayClick() {
      if (this.closeOnClickModal && this.clickOutside) {
        this.handleClose()
      }
    },
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    },
  },
  beforeDestroy() {
    document.body.style.overflow = ''
  },
}
</script>

<style scoped>
.custom-dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(2px);
}

.custom-dialog {
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  overflow: hidden;
}

.custom-dialog__header {
  padding: 24px 32px 16px;
  border-bottom: 1px solid #f1f3f4;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  background: #ffffff;
}

.custom-dialog__title {
  font-size: 20px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  line-height: 1.2;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.custom-dialog__close {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}

.custom-dialog__close:hover {
  background: #f3f4f6;
  color: #374151;
}

.custom-dialog__body {
  padding: 24px 32px 32px;
  color: #374151;
  font-size: 14px;
  overflow-y: auto;
  flex: 1;
  background: #ffffff;
}

.custom-dialog__footer {
  padding: 16px 32px 24px;
  text-align: right;
  border-top: 1px solid #f1f3f4;
  flex-shrink: 0;
  background: #ffffff;
}

/* Form Container Styles */
.form-container {
  max-width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-section {
  margin-bottom: 32px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.form-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  align-items: start;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 2px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.form-input {
  width: 100%;
}

/* Radio Group Styles */
.radio-group {
  display: flex;
  gap: 16px;
  margin-top: 4px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: #374151;
}

.radio-item input[type='radio'] {
  width: 16px;
  height: 16px;
  border: 1px solid #d1d5db;
  border-radius: 50%;
  margin: 0;
  cursor: pointer;
  accent-color: #3b82f6;
}

.radio-text {
  font-size: 14px;
  font-weight: 400;
  color: #374151;
}

/* Date Picker Styles */
.date-picker {
  width: 100%;
}

.date-picker .el-input__inner {
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  height: auto;
  line-height: 1.4;
}

.date-picker .el-input__inner:focus {
  border-color: #3b82f6;
}

/* Number Input Styles */
.number-input {
  width: 100%;
}

.number-input .el-input__inner {
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  height: auto;
  line-height: 1.4;
}

.number-input .el-input__inner:focus {
  border-color: #3b82f6;
}

/* Button Styles */
.add-button {
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  border-radius: 6px;
  border: 1px solid #3b82f6;
  background: #3b82f6;
  color: white;
  transition: all 0.15s ease;
}

.add-button:hover {
  background: #2563eb;
  border-color: #2563eb;
}

.delete-button {
  color: #ef4444;
  font-size: 13px;
  font-weight: 500;
  padding: 4px 8px;
}

.delete-button:hover {
  background: #fef2f2;
  color: #dc2626;
}

/* Table Container */
.table-container {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.custom-table {
  margin: 0;
}

/* Footer Buttons */
.dialog-footer .el-button {
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 6px;
  transition: all 0.15s ease;
}

.cancel-button {
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #374151;
}

.cancel-button:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.confirm-button {
  border: 1px solid #3b82f6;
  background: #3b82f6;
  color: white;
}

.confirm-button:hover {
  background: #2563eb;
  border-color: #2563eb;
}

/* Scrollable dialog support */
.scrollable-dialog .custom-dialog__body {
  max-height: 70vh;
  overflow-y: auto;
}

/* Animation */
.custom-dialog-overlay {
  animation: fadeIn 0.2s ease;
}

.custom-dialog {
  animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-20px);
    opacity: 0;
    scale: 0.96;
  }
  to {
    transform: translateY(0);
    opacity: 1;
    scale: 1;
  }
}

/* Responsive */
@media (max-width: 768px) {
  .custom-dialog {
    width: 95% !important;
    margin: 20px;
    max-height: 85vh;
  }

  .custom-dialog__header,
  .custom-dialog__body,
  .custom-dialog__footer {
    padding-left: 20px;
    padding-right: 20px;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .radio-group {
    flex-direction: column;
    gap: 12px;
  }
}

@media (max-width: 480px) {
  .custom-dialog__header,
  .custom-dialog__body,
  .custom-dialog__footer {
    padding-left: 16px;
    padding-right: 16px;
  }
}
</style>
