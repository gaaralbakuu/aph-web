import dayjs from 'dayjs'

/**
 * Formats a date value using dayjs.
 * This function replaces the global 'datetime' filter from the Vue 2 version.
 *
 * @param {string | Date} value - The date value to format.
 * @param {string} [fmt='YYYY-MM-DD'] - The desired format string.
 * @returns {string} The formatted date string, or an empty string if the value is falsy.
 */
export function formatDate(value, fmt = 'YYYY-MM-DD') {
  if (!value) return ''
  return dayjs(value).format(fmt)
}