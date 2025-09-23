const baseUrl = process.env.VUE_APP_API
let url = baseUrl + '/'
//url = 'http://192.168.31.18:65301/'

// Video API Configuration
const videoBaseUrl = process.env.VUE_APP_VIDEO_API
let videoUrl = videoBaseUrl + '/'

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
  userfeedback: url + 'Platform/suggest/',
  workflowField: url + 'platform/workflowfield/',
  symesg: url + 'platform/symesg/',
  epidemic: url + 'Requirements/Epidemic/',
  file: url + 'platform/file/',
  Message: url + 'Platform/message/',
  suggest: url + 'Platform/suggest/',
  Sydept: url + 'Requirements/Sydept/',
  BpmUser: url + 'Interface/BpmUser/',
  publiccode: url + 'Requirements/Publiccode/',
  ComplianceDictionary: url + 'Compliance/complianceDictionary/',
  ComplianceAttachments: url + 'Compliance/complianceAttachments/',
  ComplianceUser: url + 'Compliance/ComplianceUser/',
  ComplianceManufacturer: url + 'Compliance/ComplianceManufacturer/',
  checkMenuAuth: url +  'platform/user/checkMenuAuth',

  // Video Server Configuration (MỚI)
  videoServer: videoBaseUrl,

  // Video APIs (MỚI - từ VideoWebSourceCode)
  video: videoUrl + 'Video/Video/',
  videoManage: videoUrl + 'Video/VideoManage/',
  videoCourse: videoUrl + 'Video/VideoCourse/',
  videoExam: videoUrl + 'Video/VideoExam/',
  videoLecturer: videoUrl + 'Video/VideoLecturer/',
  videoTrain: videoUrl + 'Video/VideoTrain/',
  videoRole: videoUrl + 'Video/VideoRole/',
  videoMenu: videoUrl + 'Video/VideoMenu/',
  videoTag: videoUrl + 'Video/VideoTag/',
  videoAnalyze: videoUrl + 'Video/VideoAnalyze/',
  videoCollege: videoUrl + 'Video/VideoCollege/',
  videoCatalog: videoUrl + 'Video/VideoCourseCatalog/',
  videoPageTag: videoUrl + 'Video/VideoPageTag/',
  videoProcessQuestion: videoUrl + 'Video/VideoProcessQuestion/',

  // Additional Requirements APIs (từ VideoWebSourceCode)
  organization: url + 'Requirements/Syorg/',
  departure: url + 'Requirements/Hrdimis/',
  exam: url + 'Requirements/Exam/',
  Caretake: url + 'Requirements/Caretake/',
  Security: url + 'Requirements/Security/',

  // KPI System (MỚI)
  kpi: url + '/Kpi/PEmpScore/'
}

export default api
