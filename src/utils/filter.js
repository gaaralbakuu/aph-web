import dayjs from 'dayjs'

export function datetime(value, fmt) {
  if (!value) return ''
  let day = dayjs(value)
  return day.format(fmt || 'YYYY-MM-DD')
}
