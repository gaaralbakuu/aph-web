import dayjs from 'dayjs'
import Vue from 'vue'

Vue.filter('datetime', function(value, fmt) {
  if (!value) return ''
  let day = dayjs(value)
  return day.format(fmt || 'YYYY-MM-DD')
})
