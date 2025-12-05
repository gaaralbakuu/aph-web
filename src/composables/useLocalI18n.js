import { getCurrentInstance, computed } from 'vue'

/**
 * Composable để sử dụng đa ngôn ngữ local và common
 * @param {string} customName - Tên component tùy chỉnh (nếu không lấy từ component)
 * @returns {Object} - { l, c, t, compName }
 *   - l: computed ref chứa object key của component hiện tại
 *   - c: computed ref chứa object key common
 *   - t: hàm dịch (translation function)
 *   - compName: tên component
 *
 * @example
 * // Trong script setup
 * import { useLocalI18n } from '@/composables/useLocalI18n'
 * import { defineComponent } from 'vue'
 *
 * export default defineComponent({
 *   name: 'MyComponent',
 *   setup() {
 *     const { l, c } = useLocalI18n()
 *     return { l, c }
 *   }
 * })
 *
 * // Trong template
 * <span>{{ l.my_key }}</span>
 * <button>{{ c.confirm }}</button>
 */
export function useLocalI18n(customName) {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('useLocalI18n must be called inside setup() or <script setup>')
  }

  // Lấy tên component (works for <script setup> defineOptions({ name }) or export default { name })
  const compName =
    customName ||
    (instance.type && (instance.type.name || instance.type.__name)) ||
    instance.proxy?.$options?.name ||
    ''

  // Lấy hàm t: ưu tiên useI18n nếu có, không thì fallback instance.proxy.$t
  let tFn = null
  try {
    // Nếu bạn dùng vue-i18n v9, useI18n() sẽ trả về t
    // Import động để tránh lỗi build nếu không cài vue-i18n
    // eslint-disable-next-line global-require
    const { useI18n } = require('vue-i18n')
    const { t } = useI18n()
    tFn = t
  } catch (e) {
    // Fallback: sử dụng $t từ instance.proxy (Vue 2 hoặc plugin global)
    if (instance.proxy && typeof instance.proxy.$t === 'function') {
      tFn = instance.proxy.$t.bind(instance.proxy)
    } else {
      // Fallback cuối cùng: echo key
      tFn = (k) => k
    }
  }

  const l = computed(() => (compName ? tFn(compName) : {}))
  const c = computed(() => tFn('common'))

  return { l, c, t: tFn, compName }
}
