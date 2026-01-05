import { getCurrentInstance, computed } from 'vue'

/**
 * Composable for local and common localization
 * @param {string} customName - Custom component name (optional)
 * @returns {Object} - { l, c, t, compName }
 */
export function useLocalI18n(customName) {
  const instance = getCurrentInstance()
  if (!instance) {
    throw new Error('useLocalI18n must be called inside setup() or <script setup>')
  }

  // Get component name
  const compName =
    customName ||
    (instance.type && (instance.type.name || instance.type.__name)) ||
    instance.proxy?.$options?.name ||
    ''

  // Get translation function
  // In Vue 2.7 + Vue I18n v8, $t is available on proxy
  let tFn = null
  if (instance.proxy && typeof instance.proxy.$t === 'function') {
    tFn = instance.proxy.$t.bind(instance.proxy)
  } else {
    // Fallback: echo key
    tFn = (k) => k
  }

  // Return computed properties
  // Note: tFn returns an object if the key corresponds to a structure in i18n
  const l = computed(() => (compName ? tFn(compName) : {}))
  const c = computed(() => tFn('common'))

  return { l, c, t: tFn, compName }
}
