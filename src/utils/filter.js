import Vue from 'vue'
import dayjs from 'dayjs'

Vue.filter('datetime', function(value, fmt) {
  if (!value) return ''
  let day = dayjs(value)
  return day.format(fmt || 'YYYY-MM-DD')
})
