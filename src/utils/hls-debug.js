/**
 * HLS.js Debugging Utilities
 * Use these functions to debug M3U8 encryption key issues
 */

/**
 * Enable HLS.js verbose logging
 * Run in browser console: window.enableHLSDebug()
 */
export function enableHLSDebug() {
  window.__HLS_DEBUG__ = true
  console.log('✅ HLS.js verbose logging ENABLED')
  console.log('🔄 Reload page to apply changes')
  console.log('💡 Tip: Check console for detailed HLS.js logs')
}

/**
 * Disable HLS.js verbose logging
 * Run in browser console: window.disableHLSDebug()
 */
export function disableHLSDebug() {
  window.__HLS_DEBUG__ = false
  console.log('✅ HLS.js verbose logging DISABLED')
  console.log('🔄 Reload page to apply changes')
}

/**
 * Get HLS encryption stats
 */
export function getHLSStats() {
  try {
    const hlsEncryption = require('@/utils/hls-encryption').default
    return hlsEncryption.getCacheStats()
  } catch (error) {
    console.error('Cannot get HLS stats:', error)
    return null
  }
}

/**
 * Clear HLS key cache
 */
export function clearHLSCache() {
  try {
    const hlsEncryption = require('@/utils/hls-encryption').default
    hlsEncryption.clearCache()
    hlsEncryption.resetStats()
    console.log('✅ HLS key cache and stats cleared')
  } catch (error) {
    console.error('Cannot clear HLS cache:', error)
  }
}

/**
 * Extract and display M3U8 key line
 */
export function showM3U8KeyLine(m3u8Content) {
  if (typeof m3u8Content !== 'string') {
    console.error('❌ m3u8Content must be a string')
    return
  }

  const lines = m3u8Content.split('\n')
  const keyLine = lines.find(line => line.includes('EXT-X-KEY'))
  
  if (keyLine) {
    console.log('🔑 M3U8 Key Line:', keyLine)
    
    // Parse key info
    const uriMatch = keyLine.match(/URI="([^"]+)"/)
    const ivMatch = keyLine.match(/IV=0x([A-Fa-f0-9]+)/i)
    const methodMatch = keyLine.match(/METHOD=([^,]+)/)
    
    console.log('📋 Parsed Key Info:')
    console.log('  - Method:', methodMatch ? methodMatch[1] : 'unknown')
    console.log('  - URI:', uriMatch ? uriMatch[1] : 'unknown')
    console.log('  - IV (hex):', ivMatch ? ivMatch[1] : 'not specified (default zeros)')
  } else {
    console.warn('⚠️ No EXT-X-KEY line found in M3U8')
  }
}

/**
 * Display key in various formats
 */
export function displayKeyFormats(keyData) {
  if (!keyData) {
    console.error('❌ No key data provided')
    return
  }

  let bytes
  if (keyData instanceof ArrayBuffer) {
    bytes = new Uint8Array(keyData)
  } else if (keyData instanceof Uint8Array) {
    bytes = keyData
  } else if (typeof keyData === 'string') {
    // Try hex string
    const hexStr = keyData.replace(/\s/g, '')
    if (!/^[0-9A-F]*$/i.test(hexStr) || hexStr.length !== 32) {
      console.error('❌ Invalid hex string (expected 32 chars for 16 bytes)')
      return
    }
    bytes = new Uint8Array(16)
    for (let i = 0; i < 16; i++) {
      bytes[i] = parseInt(hexStr.substr(i * 2, 2), 16)
    }
  } else {
    console.error('❌ Unsupported key data type:', typeof keyData)
    return
  }

  console.log('🔐 Key in Multiple Formats:')
  console.log('  Bytes:', Array.from(bytes))
  console.log('  Hex:', Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(' '))
  console.log('  Hex (compact):', Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join(''))
  console.log('  Base64:', btoa(String.fromCharCode(...bytes)))
  console.log('  Size:', bytes.length, 'bytes')
}

/**
 * Simulate HLS encryption key flow
 */
export async function simulateKeyFlow() {
  console.log('🚀 Simulating HLS key flow...\n')
  
  try {
    // Step 1: Fetch M3U8
    console.log('📥 Step 1: Fetching M3U8 manifest...')
    // This would need actual video_id
    
    // Step 2: Parse M3U8
    console.log('📝 Step 2: Parsing M3U8 manifest...')
    
    // Step 3: Extract key URI
    console.log('🔑 Step 3: Extracting key URI from EXT-X-KEY line...')
    
    // Step 4: Fetch key
    console.log('📥 Step 4: Fetching encryption key...')
    
    // Step 5: Validate key
    console.log('✅ Step 5: Validating key (must be 16 bytes)...')
    
    // Step 6: Decrypt segments
    console.log('🔓 Step 6: Decrypting video segments...')
    
    console.log('\n✅ Key flow simulation complete')
  } catch (error) {
    console.error('❌ Simulation failed:', error)
  }
}

/**
 * Install debug utilities in window scope
 */
export function installDebugUtils() {
  if (typeof window !== 'undefined') {
    window.enableHLSDebug = enableHLSDebug
    window.disableHLSDebug = disableHLSDebug
    window.getHLSStats = getHLSStats
    window.clearHLSCache = clearHLSCache
    window.showM3U8KeyLine = showM3U8KeyLine
    window.displayKeyFormats = displayKeyFormats
    window.simulateKeyFlow = simulateKeyFlow
    
    console.log('✅ HLS Debug Utils installed in window scope')
    console.log('Available commands:')
    console.log('  - window.enableHLSDebug()')
    console.log('  - window.disableHLSDebug()')
    console.log('  - window.getHLSStats()')
    console.log('  - window.clearHLSCache()')
    console.log('  - window.showM3U8KeyLine(m3u8Content)')
    console.log('  - window.displayKeyFormats(keyData)')
    console.log('  - window.simulateKeyFlow()')
  }
}

// Auto-install on import
if (typeof window !== 'undefined') {
  installDebugUtils()
}
