export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

export function getQueryObject(url) {
  url = url == null ? window.location.href : url
  const search = url.substring(url.lastIndexOf('?') + 1)
  const obj = {}
  const reg = /([^?&=]+)=([^?&=]*)/g
  search.replace(reg, (rs, $1, $2) => {
    const name = decodeURIComponent($1)
    let val = decodeURIComponent($2)
    val = String(val)
    obj[name] = val
    return rs
  })
  return obj
}

/**
 *get getByteLen
 * @param {Sting} val input value
 * @returns {number} output value
 */
export function getByteLen(val) {
  let len = 0
  for (let i = 0; i < val.length; i++) {
    if (val[i].match(/[^\x00-\xff]/gi) != null) {
      len += 1
    } else {
      len += 0.5
    }
  }
  return Math.floor(len)
}

export function cleanArray(actual) {
  const newArray = []
  for (let i = 0; i < actual.length; i++) {
    if (actual[i]) {
      newArray.push(actual[i])
    }
  }
  return newArray
}

export function param(json) {
  if (!json) return ''
  return cleanArray(
    Object.keys(json).map(key => {
      if (json[key] === undefined) return ''
      return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
    })
  ).join('&')
}

export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"') +
      '"}'
  )
}

export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function objectMerge(target, source) {
  /* Merges two  objects,
     giving the last one precedence */

  if (typeof target !== 'object') {
    target = {}
  }
  if (Array.isArray(source)) {
    return source.slice()
  }
  Object.keys(source).forEach(property => {
    const sourceProperty = source[property]
    if (typeof sourceProperty === 'object') {
      target[property] = objectMerge(target[property], sourceProperty)
    } else {
      target[property] = sourceProperty
    }
  })
  return target
}

export function scrollTo(element, to, duration) {
  if (duration <= 0) return
  const difference = to - element.scrollTop
  const perTick = (difference / duration) * 10
  setTimeout(() => {
    element.scrollTop = element.scrollTop + perTick
    if (element.scrollTop === to) return
    scrollTo(element, to, duration - 10)
  }, 10)
}

export function toggleClass(element, className) {
  if (!element || !className) {
    return
  }
  let classString = element.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  element.className = classString
}

export const pickerOptions = [
  {
    text: '今天',
    onClick(picker) {
      const end = new Date()
      const start = new Date(new Date().toDateString())
      end.setTime(start.getTime())
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '最近一周',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '最近一个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      picker.$emit('pick', [start, end])
    }
  },
  {
    text: '最近三个月',
    onClick(picker) {
      const end = new Date(new Date().toDateString())
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      picker.$emit('pick', [start, end])
    }
  }
]

export function getTime(type) {
  if (type === 'start') {
    return new Date().getTime() - 3600 * 1000 * 24 * 90
  } else {
    return new Date(new Date().toDateString())
  }
}

export function debounce(func, wait, immediate) {
  let timeout, args, context, timestamp, result

  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp

    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }

  return function(...args) {
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }

    return result
  }
}

export function intArray(arr) {
  const r = []
  for (const i in arr) {
    if (parseInt(arr[i]) == arr[i]) {
      r[i] = parseInt(arr[i])
    } else {
      r[i] = arr[i]
    }
  }
  return r
}

export function splitStr(str) {
  if (!str) return []
  else if (str == '') return []
  else return intArray(str.split(','))
}

export function uniqueArr(arr) {
  return Array.from(new Set(arr))
}

export function arrayToObject(arr, k, v) {
  const r = {}
  arr.forEach(item => {
    let data = ''
    if (!v) {
      data = item[k]
    } else if (Array.isArray(v)) {
      v.forEach(vtmp => {
        data = data + ' ' + item[vtmp]
      })
    } else {
      data = item[v]
    }
    if (item[k]) r[item[k]] = data
  })
  return r
}

export const dateTools = {
  FormatDate: function(date) {
    if (!date) {
      date = new Date()
    }
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
    if ((month + '').length == 1) {
      month = '0' + month
    }
    if ((day + '').length == 1) {
      day = '0' + day
    }
    return year + '-' + month + '-' + day
  },
  StrToDate: function(str) {
    str = str.replace(/-/g, '/')
    return new Date(str)
  },
  now_date: function() {
    return this.FormatDate()
  },
  now_time: function() {
    var now = new Date()

    var year = now.getFullYear() // 年
    var month = now.getMonth() + 1 // 月
    var day = now.getDate() // 日

    var hh = now.getHours() // 时
    var mm = now.getMinutes() // 分
    var ss = now.getSeconds() // 秒

    var clock = year + '-'

    if (month < 10) clock += '0'

    clock += month + '-'

    if (day < 10) clock += '0'

    clock += day + ' '

    if (hh < 10) clock += '0'

    clock += hh + ':'
    if (mm < 10) clock += '0'
    clock += mm + ':'

    if (ss < 10) clock += '0'
    clock += ss
    return clock
  },
  add_day: function(datestr, days) {
    var date = this.StrToDate(datestr)
    date.setDate(date.getDate() + days)
    return this.FormatDate(date)
  },
  add_month: function(datestr, months) {
    var date = this.StrToDate(datestr)
    date.setMonth(date.getMonth() + months)
    return this.FormatDate(date)
  },
  add_year: function(datestr, years) {
    var date = this.StrToDate(datestr)
    date.setFullYear(date.getFullYear() + years)
    return this.FormatDate(date)
  },
  first_day: function(datestr) {
    var str = datestr.substr(0, 8)
    return str + '01'
  },
  last_day: function(datestr) {
    var str = this.add_month(datestr, 1)
    str = this.first_day(str)
    return this.add_day(str, -1)
  },
  days_between: function(date_s, date_e) {
    var start_date = this.StrToDate(date_s).getTime()
    var end_date = this.StrToDate(date_e).getTime()
    var days = (end_date - start_date) / (1000 * 60 * 60 * 24)
    return days + 1
  },
  dif_between: function(date_s, date_e) {
    date_e = this.add_day(date_e, 1)
    if (date_s > date_e) {
      return '0年'
    }
    var year_s = date_s.substr(0, 4)
    var month_s = date_s.substr(5, 2)
    var day_s = date_s.substr(8, 2)
    var year_e = date_e.substr(0, 4)
    var month_e = date_e.substr(5, 2)
    var day_e = date_e.substr(8, 2)
    var year = parseInt(year_e) - parseInt(year_s)
    var month = parseInt(month_e) - parseInt(month_s)
    var day = parseInt(day_e) - parseInt(day_s)
    if (day < 0) {
      const pre_month = this.last_day(this.add_month(date_e, -1))
      const pre_month_days = pre_month.substr(8, 2)
      day = day + parseInt(pre_month_days)
      month = month - 1
    }
    if (month < 0) {
      month = month + 12
      year = year - 1
    }
    return (
      (year > 0 ? year + '年' : '') +
      (month > 0 ? month + '月' : '') +
      (day > 0 ? day + '天' : '')
    )
  },
  week_date: function(n) {
    var now = new Date()
    var year = now.getFullYear()
    // 因为月份是从0开始的,所以获取这个月的月份数要加1才行
    var month = now.getMonth() + 1
    var date = now.getDate()
    var day = now.getDay()
    // 判断是否为周日,如果不是的话,就让今天的day-1(例如星期二就是2-1)
    if (day !== 0) {
      n = n + (day - 1)
    } else {
      n = n + day
    }
    if (day) {
      // 这个判断是为了解决跨年的问题
      if (month > 1) {
        month = month
      }
      // 这个判断是为了解决跨年的问题,月份是从0开始的
      else {
        year = year - 1
        month = 12
      }
    }
    now.setDate(now.getDate() - n)
    year = now.getFullYear()
    month = now.getMonth() + 1
    date = now.getDate()
    const s =
      year +
      '-' +
      (month < 10 ? '0' + month : month) +
      '-' +
      (date < 10 ? '0' + date : date)
    return s
  }
}

export function generateTree(arr, key, parentKey, rootId) {
  const tmp = {}
  tmp[rootId] = { children: [] }
  arr.forEach(i => {
    tmp[i[key]] = Object.assign({}, i, { children: [] })
  })
  arr.forEach(i => {
    var parentTmp = tmp[tmp[i[key]][parentKey]]
    if (parentTmp) {
      parentTmp.children.push(tmp[i[key]])
    }
  })
  return tmp[rootId].children
}

export function expendsTree(data) {
  function expends(tree) {
    const res = []
    for (var i = 0; i < tree.length; i++) {
      const tmp = tree[i]
      res.push(tmp)
      if (tmp.children && tmp.children.length > 0) {
        res.push.apply(res, expends(tmp.children))
      }
    }
    return res
  }
  return expends(data)
}
