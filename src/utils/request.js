import axios from 'axios'
import { getToken, localGet } from '@/utils/auth'

// Create a new axios instance
const service = axios.create({
  timeout: 300000, // request timeout
})

// Request interceptor
service.interceptors.request.use(
  (config) => {
    // Add token to headers if it exists
    const token = getToken()
    if (token) {
      config.headers.token = token
      config.headers.client = 'WEB'
    }

    // Add language preference to headers
    const lang = localGet('lang')
    if (lang) {
      const langParts = lang.split('-')
      config.headers['Accept-Language'] = `${lang},${langParts[0]};q=0.9`
    }

    return config
  },
  (error) => {
    // Log request errors
    console.error('Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
service.interceptors.response.use(
  (response) => {
    const res = response.data

    // Check if the response is a blob (file download)
    if (response.request.responseType === 'blob') {
      return response
    }

    // Check for expected response structure
    if (typeof res !== 'object' || res === null) {
      console.error('Unknown response format:', res)
      return Promise.reject(new Error('An unknown error occurred.'))
    }

    // Pass through successful responses
    if (res.status) {
      return res
    } else {
      // Reject responses that have a status of false
      return Promise.reject(res)
    }
  },
  (error) => {
    console.error('Response Error:', error)
    return Promise.reject(error)
  }
)

/**
 * A flexible and framework-agnostic request function.
 *
 * @param {string} url - The request URL.
 * @param {object} [data={}] - The data for the request.
 * @param {string} [method='get'] - The HTTP method.
 * @param {object} [options={}] - Additional axios config options.
 * @returns {Promise} A promise that resolves with the response or rejects with an error.
 */
export default function request(url, data = {}, method = 'get', options = {}) {
  const config = {
    url,
    method: method.toLowerCase(),
    ...options,
  }

  if (config.method === 'get') {
    config.params = data
  } else {
    config.data = data
  }

  return service(config)
}