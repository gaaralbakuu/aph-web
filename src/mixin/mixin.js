/**
 * DEPRECATED: This mixin is no longer used in Vue 3.
 * Use the useLocalI18n composable instead.
 * 
 * Migration guide:
 * 1. Import composable: import { useLocalI18n } from '@/composables/useLocalI18n'
 * 2. In setup(): const { l, c } = useLocalI18n('componentName')
 * 3. Return { l, c } from setup
 * 4. Use {{ l.key }} and {{ c.key }} in template
 * 
 * For Options API components (temporary compatibility):
 * Use computed properties instead of data
 */
export default {
  computed: {
    // Computed properties instead of mutating $l/$c in lifecycle hooks
    // This prevents Vue 3 proxy trap errors
    l() {
      if (this.$options.name && typeof this.$t === 'function') {
        return this.$t(this.$options.name)
      }
      return {}
    },
    c() {
      if (typeof this.$t === 'function') {
        return this.$t('common')
      }
      return {}
    }
  }
}
