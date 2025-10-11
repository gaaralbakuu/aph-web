import { ref, onMounted, inject } from 'vue'
import { ApiInjectionKey, RequestInjectionKey } from '@/plugins/api'

/**
 * Fetches and provides language options from the API.
 * This composable replaces the `getLangOptions` mixin.
 * @returns {object} An object containing a reactive `langOptions` ref.
 */
export function useLangOptions() {
  // Inject the api and request utilities provided in `src/plugins/api.js`
  const api = inject(ApiInjectionKey)
  const request = inject(RequestInjectionKey)

  const langOptions = ref([])

  const fetchLangOptions = async () => {
    try {
      const url = api.param + 'getbyType'
      const response = await request(url, { type: 'AppSettings', name: 'Language' })
      if (response && response.data) {
        langOptions.value = response.data
      }
    } catch (error) {
      console.error('Failed to fetch language options:', error)
      // Optionally, handle the error by showing a notification to the user
    }
  }

  // Fetch the options when the composable is used in a component
  onMounted(fetchLangOptions)

  return {
    langOptions,
    fetchLangOptions, // Expose the function in case a manual refetch is needed
  }
}