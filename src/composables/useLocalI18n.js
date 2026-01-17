import { computed, getCurrentInstance } from 'vue'
import { useI18n } from 'vue-i18n'

export function useLocalI18n(key) {
  try {
    const { tm } = useI18n()
    const l = computed(() => tm(key) || {})
    const c = computed(() => tm('common') || {})
    return { l, c }
  } catch (e) {
    const instance = getCurrentInstance()
    if (instance) {
       const proxy = instance.proxy
       const l = computed(() => proxy.$t ? proxy.$t(key) : {})
       const c = computed(() => proxy.$t ? proxy.$t('common') : {})
       return { l, c }
    }
    return { l: computed(() => ({})), c: computed(() => ({})) }
  }
}
