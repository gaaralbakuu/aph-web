import CryptoJS from 'crypto-js'

// Key cache to avoid re-processing same key multiple times
const keyCache = new Map()

/**
 * Xử lý khóa mã hóa cho HLS.js
 * Kiểm tra format của khóa (raw binary hoặc base64 text)
 * Nếu là base64, decrypt với AES-CBC
 * @param {ArrayBuffer|Uint8Array} keyData - Dữ liệu khóa từ server
 * @param {string} cacheKey - Key để cache kết quả (optional)
 * @returns {Uint8Array|null} - Khóa 16 byte hoặc null nếu lỗi
 */
export function processHLSEncryptionKey(keyData, cacheKey = null) {
  try {
    // Check cache
    if (cacheKey && keyCache.has(cacheKey)) {
      console.log('[processHLSEncryptionKey] Using cached key for:', cacheKey)
      return keyCache.get(cacheKey)
    }

    let result = keyData instanceof ArrayBuffer 
      ? new Uint8Array(keyData) 
      : keyData

    // Kiểm tra xem dữ liệu có phải là text (base64) hay binary
    const firstByte = result[0]
    const isText = firstByte >= 48 && firstByte <= 122 // ASCII: 0-9, A-Z, a-z, +, /, =

    console.log('[processHLSEncryptionKey] Phân tích khóa:', {
      byteLength: result.byteLength,
      firstByte: firstByte,
      firstByteBinary: '0x' + firstByte.toString(16).toUpperCase(),
      isText: isText,
      firstChar: String.fromCharCode(firstByte)
    })

    if (isText) {
      // Chuyển đổi ArrayBuffer sang text
      const keyStr = new TextDecoder().decode(result)
      console.log('[processHLSEncryptionKey] Khóa dạng base64, length:', keyStr.length)
      console.log('[processHLSEncryptionKey] Base64 preview:', keyStr.substring(0, 50) + '...')

      // Decode base64
      const decoded = base64Decode(keyStr.trim())
      console.log('[processHLSEncryptionKey] Base64 decoded:', {
        length: decoded.length,
        firstBytes: Array.from(decoded.slice(0, 4)).map(b => '0x' + b.toString(16).toUpperCase()).join(', ')
      })

      // Decrypt AES-CBC (parse Base64 inside function)
      const decrypted = decryptAesCbc(decoded)
      if (decrypted) {
        if (cacheKey) keyCache.set(cacheKey, decrypted)
        console.log('[processHLSEncryptionKey] ✓ Decrypt thành công')
        return decrypted
      } else {
        console.error('[processHLSEncryptionKey] ✗ Decrypt thất bại, trả về null')
        return null
      }
    } else {
      // Binary trực tiếp
      console.log('[processHLSEncryptionKey] Khóa dạng binary, validate...')
      const validated = validateKey(result)
      if (validated && cacheKey) keyCache.set(cacheKey, validated)
      return validated
    }
  } catch (error) {
    console.error('[processHLSEncryptionKey] Lỗi:', error.message, error.stack)
    return null
  }
}

/**
 * Decode base64 string thành Uint8Array
 */
function base64Decode(str) {
  // Remove whitespace
  str = str.replace(/\s/g, '')
  
  console.log('[base64Decode] Input length:', str.length)
  
  // Sử dụng atob nếu chỉ có ký tự base64 hợp lệ
  try {
    const binaryString = atob(str)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i)
    }
    console.log('[base64Decode] atob success, decoded length:', bytes.length)
    return bytes
  } catch (err) {
    console.error('[base64Decode] atob failed:', err.message)
    
    // Fallback: custom base64 decode
    console.log('[base64Decode] Using custom base64 decoder')
    const strTable = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
    let output = ''
    let i = 0
    const input = str.replace(/[^A-Za-z0-9\+\/\=]/g, '')

    while (i < input.length) {
      const e1 = strTable.indexOf(input[i++])
      const e2 = strTable.indexOf(input[i++])
      const e3 = strTable.indexOf(input[i++])
      const e4 = strTable.indexOf(input[i++])

      const a = (e1 << 2) | (e2 >> 4)
      const b = ((e2 & 15) << 4) | (e3 >> 2)
      const c = ((e3 & 3) << 6) | e4

      output += String.fromCharCode(a)
      if (e3 !== 64) output += String.fromCharCode(b)
      if (e4 !== 64) output += String.fromCharCode(c)
    }

    const bytes = new Uint8Array(output.length)
    for (let j = 0; j < output.length; j++) {
      bytes[j] = output.charCodeAt(j)
    }
    console.log('[base64Decode] Custom decoder success, decoded length:', bytes.length)
    return bytes
  }
}

/**
 * Decrypt AES-CBC
 * Sử dụng khóa và IV hardcode từ backend
 * Flow: data (44 bytes) → parse Base64 → decrypt → 16 bytes key
 */
function decryptAesCbc(data) {
  try {
    console.log('[decryptAesCbc] Starting AES-CBC decrypt, input length:', data.length)
    
    const key = CryptoJS.enc.Utf8.parse('jM0q0hBUf94uInL4FSa9sNvqZiO3b194')
    const iv = CryptoJS.enc.Utf8.parse('u85vDXaf2qZwgQj7')

    console.log('[decryptAesCbc] Using hardcoded key and IV')

    // Chuyển Uint8Array thành Base64 string (để parse lại)
    let base64Str = ''
    for (let i = 0; i < data.length; i++) {
      base64Str += String.fromCharCode(data[i])
    }
    
    console.log('[decryptAesCbc] Base64 string length:', base64Str.length)
    console.log('[decryptAesCbc] Base64 preview:', base64Str.substring(0, 30) + '...')

    // Parse Base64 → WordArray
    let encryptedWords
    try {
      encryptedWords = CryptoJS.enc.Base64.parse(base64Str)
      console.log('[decryptAesCbc] Base64 parsed, word array length:', encryptedWords.sigBytes)
    } catch (e) {
      console.error('[decryptAesCbc] Base64 parse failed:', e.message)
      return null
    }

    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encryptedWords },
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    )

    const result = decrypted.toString(CryptoJS.enc.Utf8)
    
    if (!result || result.length === 0) {
      console.warn('[decryptAesCbc] Decrypt kết quả rỗng')
      return null
    }

    console.log('[decryptAesCbc] Decrypt result length:', result.length)

    // Chuyển text thành bytes
    const bytes = new Uint8Array(result.length)
    for (let i = 0; i < result.length; i++) {
      bytes[i] = result.charCodeAt(i)
    }

    console.log('[decryptAesCbc] Decrypt thành công:', {
      originalLength: data.length,
      decryptedLength: bytes.length,
      hexKey: Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' ').toUpperCase()
    })

    return bytes
  } catch (error) {
    console.error('[decryptAesCbc] Lỗi decrypt:', error.message, error.stack)
    return null
  }
}

/**
 * Validate khóa (phải là 16 bytes cho AES-128)
 */
function validateKey(keyData) {
  const data = keyData instanceof ArrayBuffer
    ? new Uint8Array(keyData)
    : keyData

  if (data.byteLength !== 16) {
    console.error('[validateKey] ✗ Kích thước khóa không hợp lệ:', {
      expected: 16,
      received: data.byteLength
    })
    return null
  }

  const keyHex = Array.from(data)
    .map(b => b.toString(16).padStart(2, '0'))
    .join(' ')
    .toUpperCase()

  console.log('[validateKey] ✓ Khóa hợp lệ (16 bytes):', keyHex)
  return data
}

/**
 * Clear key cache
 */
export function clearKeyCache() {
  keyCache.clear()
  console.log('[clearKeyCache] Key cache cleared')
}

/**
 * Lấy khóa từ server và xử lý
 * @param {string} url - URL để lấy khóa
 * @param {string} token - Token xác thực
 * @returns {Promise<Uint8Array|null>}
 */
export async function fetchAndProcessKey(url, token) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.responseType = 'arraybuffer'

    xhr.onload = () => {
      if (xhr.status === 200 && xhr.response) {
        console.log('[fetchAndProcessKey] Nhận khóa, kích thước:', xhr.response.byteLength)
        const processed = processHLSEncryptionKey(xhr.response, url)
        if (processed) {
          resolve(processed)
        } else {
          reject(new Error('Failed to process key'))
        }
      } else {
        reject(new Error(`Server returned status ${xhr.status}`))
      }
    }

    xhr.onerror = () => {
      reject(new Error('XHR request failed'))
    }

    xhr.ontimeout = () => {
      reject(new Error('Request timeout'))
    }

    if (token) {
      xhr.setRequestHeader('token', token)
    }
    xhr.setRequestHeader('Content-Type', 'application/octet-stream')

    xhr.open('GET', url)
    xhr.timeout = 30000
    xhr.send()
  })
}
