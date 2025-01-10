const baseUrl = process.env.VUE_APP_API
let url = baseUrl + '/'
//url = 'http://192.168.31.18:65301/'
const api = {
  baseUrl,
  auth: url + 'platform/auth/',
  user: url + 'platform/user/',
  menu: url + 'platform/menu/',
  role: url + 'platform/role/',
  dictionary: url + 'platform/dictionary/',
  quartz: url + 'platform/quartz/',
  param: url + 'platform/param/',
  register: url + 'platform/auth/getUserByUid',
  banner: url + 'platform/banner/',
  rtestuser: url + 'platform/rtestuser/',
  appVersion: url + 'platform/appversion/',
  userfeedback:url + 'Platform/suggest/',
  workflowField: url + 'platform/workflowfield/',
  symesg: url + 'platform/symesg/',
  epidemic: url + 'Requirements/Epidemic/',
  file: url + 'platform/file/',
  Message: url + 'Platform/message/',
  suggest:url + 'Platform/suggest/',
  Sydept:url + 'Requirements/Sydept/',
  BpmUser:url + 'Interface/BpmUser/',
  publiccode:url + 'Requirements/Publiccode/'
}

export default api
