<template>
  <div v-if="visible" class="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-200" @click="handleOverlayClick">
    <div :class="['relative bg-white border border-solid border-transparent rounded-[6px] shadow-[rgba(0,0,0,0.1)_0px_20px_25px_-5px,rgba(0,0,0,0.04)_0px_10px_10px_-5px] flex flex-col box-border font-[\'HarmonyOS Sans\',_\'PingFang SC\',_\'Microsoft Yahei\',_\'Heiti SC\',_\'WenQuanYi Micro Hei\',_\'Helvetica Neue\',_Helvetica,_Arial,_sans-serif] text-[14px] leading-[14px] min-w-[392px] w-[600px] max-h-[calc(100%_-_48px)] p-0 animate-dialogIn', customClass]" :style="dialogStyle" @click.stop>
      <!-- Header -->
      <div class="flex justify-between items-center px-6 py-3 border-b border-gray-100 bg-white/95">
        <h2 class="text-base font-bold text-gray-900 m-0 leading-tight font-sans tracking-tight">{{ title }}</h2>
        <button @click="handleClose" type="button" class="shadcn-btn-icon">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
        </button>
      </div>
      <slot name="notice">
      </slot>
      <!-- Body -->
      <div class="px-6 py-6 text-gray-700 text-base overflow-y-auto flex-1 bg-white">
        <slot name="content">
          <slot></slot>
        </slot>
      </div>
      <!-- Footer -->
      <div v-if="$slots.footer" class="px-6 pb-6 pt-4 border-t border-gray-100 bg-white/95 text-right">
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
    height: {
      type: String,
      default: 'auto',
    },
    maxWidth: {
      type: String,
      default: '80vw',
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
        height: this.height || 'auto',
        maxWidth: this.maxWidth,
        maxHeight: '90vh',
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
@keyframes dialogIn {
  0% {
    opacity: 0;
    transform: translateY(24px) scale(0.98);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}
.animate-dialogIn {
  animation: dialogIn 0.22s cubic-bezier(0.16, 1, 0.3, 1);
}
.shadcn-btn-icon {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.shadcn-btn-icon:hover {
  color: #111827;
}
</style>
