import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

/**
 * Provides component-scoped translations.
 * This composable replaces the global translation mixin from the Vue 2 version.
 *
 * @param {string} componentName - The translation key corresponding to the component's name.
 * @returns {object} An object with `l` (local translations) and `c` (common translations).
 */
export function useTranslations(componentName) {
  const { t } = useI18n()

  // `l` provides translations scoped to the component (local).
  const l = computed(() => (componentName ? t(componentName, {}, { missingWarn: false, fallbackWarn: false }) : {}))

  // `c` provides translations from the "common" scope.
  const c = computed(() => t('common', {}, { missingWarn: false, fallbackWarn: false }))

  return { l, c }
}