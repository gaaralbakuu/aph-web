import axios from 'axios'
import { ElMessage } from 'element-plus'

import { getCookie, getToken, localGet } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.BASE_API, // api 的 base_url
  timeout: 300000 // request timeout
})

// request interceptor

service.interceptors.request.use(
  config => {
    // Do something before request is sent
    if (getToken()) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers.token = getToken()
      config.headers.client = "WEB"

    }
    let lang = localGet('lang')
    if (lang) {
      let array = lang.split('-')
      let tmp = lang + ',' + array[0] + ';q=0.9'
      config.headers['Accept-Language'] = tmp
    }

    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * 下面的注释为通过在response里，自定义code来标示请求状态
   * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
   */
  response => {
    const res = response.data
    if (typeof res !== 'object') {
      console.info(res)
      ElMessage({
        message: 'An unknown error occured.',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject()
    }
    if (res.status) {
      return res
    } else {
      return Promise.reject(res)
    }
  },
  error => {
    /* ElMessage({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    }) */
    return Promise.reject(error)
  }
)

export default function request(url, data, method, donotAutoShowError, customConfig, axiosController) {
  data = data || {};
  method = method || 'get';
  method = method.toLowerCase();
  var config = {
    url,
    method
  };
  if (method === 'get') {
    config.params = data;
  } else {
    config.data = data;
  }

  // Merge custom config (e.g., onUploadProgress)
  if (customConfig && typeof customConfig === 'object') {
    Object.assign(config, customConfig);
  }

  // Handle AbortController signal
  if (axiosController && axiosController.signal) {
    config.signal = axiosController.signal;
  }

  return service(config)
    .then(r => r)
    .catch(e => {
      // debugger;
      if (!donotAutoShowError) {
        ElMessage({
          message: (e && e.message) ? e.message : 'Unknown Error',
          type: 'error',
          duration: 5 * 1000
        });
      }
      // Re-throw error so .catch outside can receive it and message is shown
      throw e;
    });
}
