/**
 * HLS Encryption Key Handler
 * Handles fetching AES-128 encryption keys from custom endpoints
 */

import axios from 'axios'

import { getToken } from '@/utils/auth'

export class HLSEncryptionKeyHandler {
  constructor() {
    this.keyCache = new Map() // Cache để lưu keys đã fetch
    this.stats = {
      totalFetches: 0,
      cacheHits: 0,
      errors: 0
    }
  }

  /**
   * Fetch encryption key from endpoint
   * @param {string} keyUri - URI from M3U8 file (e.g., "http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetKey?video_id=...")
   * @param {string} iv - Initialization vector (optional, for reference only)
   * @returns {Promise<ArrayBuffer>} Key data (16 bytes for AES-128)
   */
  async fetchKey(keyUri, iv = null) {
    this.stats.totalFetches++

    // Check cache first
    if (this.keyCache.has(keyUri)) {
      this.stats.cacheHits++
      console.log(`📦 Cache hit for key: ${keyUri}`)
      return this.keyCache.get(keyUri)
    }

    try {
      console.log('🔐 Fetching HLS key from:', {
        uri: keyUri,
        iv: iv || 'not specified',
        cacheStatus: `${this.stats.cacheHits}/${this.stats.totalFetches} hits`
      })
      
      let response
      let keyData
      
      // Try with arraybuffer first
      try {
        response = await axios.get(keyUri, {
          responseType: 'arraybuffer',
          headers: {
            token: getToken(),
            'Accept': '*/*'
          },
          timeout: 10000 // 10 second timeout
        })
        keyData = response.data
      } catch (error) {
        // If arraybuffer fails, try blob
        console.warn('⚠️ ArrayBuffer response failed, trying blob...')
        response = await axios.get(keyUri, {
          responseType: 'blob',
          headers: {
            token: getToken(),
            'Accept': '*/*'
          },
          timeout: 10000
        })
        keyData = await response.data.arrayBuffer()
      }
      
      console.log(`📥 Response received:`, {
        type: typeof keyData,
        byteLength: keyData?.byteLength || 'undefined',
        status: response.status
      })
      
      // Handle case where response is JSON (contains base64 or hex encoded key)
      if (typeof keyData === 'string') {
        console.log('⚠️ Response is string, attempting to parse...')
        try {
          // Try JSON parse
          const jsonData = JSON.parse(keyData)
          if (jsonData.key) {
            // Base64 encoded key
            keyData = this._base64ToArrayBuffer(jsonData.key)
          } else if (jsonData.data) {
            keyData = this._base64ToArrayBuffer(jsonData.data)
          } else {
            throw new Error('No key data in JSON response')
          }
        } catch (parseError) {
          // Try hex string
          try {
            keyData = this._hexToArrayBuffer(keyData)
          } catch {
            throw new Error('Could not parse key response as JSON or hex')
          }
        }
      }
      
      // Convert to ArrayBuffer if needed
      if (!(keyData instanceof ArrayBuffer)) {
        if (keyData instanceof Uint8Array) {
          keyData = keyData.buffer.slice(keyData.byteOffset, keyData.byteOffset + keyData.byteLength)
        } else if (typeof keyData === 'string') {
          // Last resort: try hex decode
          keyData = this._hexToArrayBuffer(keyData)
        }
      }
      
      // Validate key size (AES-128 requires 16 bytes)
      if (!keyData || keyData.byteLength !== 16) {
        const actualSize = keyData?.byteLength || 'undefined'
        console.error(`❌ Invalid key size: expected 16 bytes, got ${actualSize}`)
        console.error('Key content (hex):', Array.from(new Uint8Array(keyData || [])).map(b => b.toString(16).padStart(2, '0')).join(' '))
        this.stats.errors++
        throw new Error(`Invalid key size: ${actualSize} bytes (expected 16)`)
      }

      console.log('✅ Valid HLS key received (16 bytes)')
      console.log('🔑 Key (hex):', Array.from(new Uint8Array(keyData)).map(b => b.toString(16).padStart(2, '0')).join(' '))
      
      // Cache the key
      this.keyCache.set(keyUri, keyData)
      return keyData
    } catch (error) {
      this.stats.errors++
      console.error('❌ Failed to fetch HLS encryption key:', {
        uri: keyUri,
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        code: error.code,
        stats: this.stats
      })
      throw error
    }
  }

  /**
   * Convert hex string to ArrayBuffer
   * @private
   */
  _hexToArrayBuffer(hexString) {
    // Remove spaces and convert to uppercase
    hexString = hexString.replace(/\s/g, '').toUpperCase()
    
    // Check if valid hex
    if (!/^[0-9A-F]*$/.test(hexString)) {
      throw new Error('Invalid hex string')
    }
    
    const length = hexString.length / 2
    const buffer = new ArrayBuffer(length)
    const view = new Uint8Array(buffer)
    
    for (let i = 0; i < length; i++) {
      view[i] = parseInt(hexString.substr(i * 2, 2), 16)
    }
    
    return buffer
  }

  /**
   * Convert base64 string to ArrayBuffer
   * @private
   */
  _base64ToArrayBuffer(base64String) {
    const binaryString = atob(base64String)
    const length = binaryString.length
    const buffer = new ArrayBuffer(length)
    const view = new Uint8Array(buffer)
    
    for (let i = 0; i < length; i++) {
      view[i] = binaryString.charCodeAt(i)
    }
    
    return buffer
  }

  /**
   * Clear key cache
   */
  clearCache() {
    const size = this.keyCache.size
    console.log(`🗑️ Clearing HLS key cache (${size} entries)`)
    this.keyCache.clear()
  }

  /**
   * Get cache statistics
   */
  getCacheStats() {
    return {
      cacheSize: this.keyCache.size,
      totalFetches: this.stats.totalFetches,
      cacheHits: this.stats.cacheHits,
      hitRate: this.stats.totalFetches > 0 
        ? `${(this.stats.cacheHits / this.stats.totalFetches * 100).toFixed(2)}%`
        : 'N/A',
      errors: this.stats.errors,
      keys: Array.from(this.keyCache.keys()).map(uri => ({
        uri,
        size: this.keyCache.get(uri).byteLength
      }))
    }
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.stats = { totalFetches: 0, cacheHits: 0, errors: 0 }
  }
}

export default new HLSEncryptionKeyHandler()
