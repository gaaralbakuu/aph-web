/**
 * Test script để debug M3U8 encryption key endpoint
 * Run trong browser console sau khi trang load
 */

import axios from 'axios'

import { getToken } from '@/utils/auth'

export async function testKeyEndpoint() {
  try {
    const videoId = '30f98387-3f77-47c1-97e9-a1dc9327c6e9' // Thay bằng video_id thực tế
    const keyUrl = `http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetKey?video_id=${videoId}`

    console.log('🔐 Testing Key Endpoint:', keyUrl)
    console.log('Token:', getToken())

    // Test 1: ArrayBuffer response
    console.log('\n📥 Test 1: Fetching key with arraybuffer response...')
    const response1 = await axios.get(keyUrl, {
      responseType: 'arraybuffer',
      headers: {
        token: getToken(),
        'Accept': '*/*'
      },
      timeout: 10000
    })

    console.log('✅ Response 1 (arraybuffer):')
    console.log('  - Type:', typeof response1.data)
    console.log('  - Byte length:', response1.data.byteLength)
    console.log('  - First 10 bytes:', new Uint8Array(response1.data).slice(0, 10))
    console.log('  - Hex:', Array.from(new Uint8Array(response1.data)).map(b => b.toString(16).padStart(2, '0')).join(' '))
    console.log('  - Status:', response1.status)
    console.log('  - Headers:', response1.headers)

    // Test 2: Text response (untuk xem có phải JSON không)
    console.log('\n📥 Test 2: Fetching key with text response...')
    const response2 = await axios.get(keyUrl, {
      responseType: 'text',
      headers: {
        token: getToken(),
        'Accept': '*/*'
      },
      timeout: 10000
    })

    console.log('✅ Response 2 (text):')
    console.log('  - Length:', response2.data.length)
    console.log('  - First 100 chars:', response2.data.substring(0, 100))
    console.log('  - Is JSON?', response2.data.startsWith('{') || response2.data.startsWith('['))

    // Test 3: Blob response
    console.log('\n📥 Test 3: Fetching key with blob response...')
    const response3 = await axios.get(keyUrl, {
      responseType: 'blob',
      headers: {
        token: getToken(),
        'Accept': '*/*'
      },
      timeout: 10000
    })

    console.log('✅ Response 3 (blob):')
    console.log('  - Type:', response3.data.type)
    console.log('  - Size:', response3.data.size)
    const arrayBuffer = await response3.data.arrayBuffer()
    console.log('  - Byte length:', arrayBuffer.byteLength)
    console.log('  - First 10 bytes:', new Uint8Array(arrayBuffer).slice(0, 10))

    // Test 4: Get M3U8 manifest để kiểm tra IV
    console.log('\n📥 Test 4: Fetching M3U8 manifest...')
    const m3u8Url = `http://10.30.2.247:5000/Video/Video/ApacheLeaningVideo/Play/GetM3U8?video_id=${videoId}&type=original`
    const response4 = await axios.get(m3u8Url, {
      headers: {
        token: getToken()
      },
      timeout: 10000
    })

    console.log('✅ M3U8 Content:')
    console.log(response4.data)

    // Extract key line
    const keyLine = response4.data.split('\n').find(line => line.includes('EXT-X-KEY'))
    console.log('\n🔑 Key Line from M3U8:', keyLine)

    // Parse IV if present
    if (keyLine && keyLine.includes('IV=')) {
      const ivMatch = keyLine.match(/IV=0x([A-Fa-f0-9]+)/i)
      if (ivMatch) {
        console.log('IV (hex):', ivMatch[1])
        console.log('IV (bytes):', Array.from(Buffer.from(ivMatch[1], 'hex')))
      }
    }

  } catch (error) {
    console.error('❌ Test failed:', error)
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      code: error.code
    })
  }
}

// Usage: testKeyEndpoint()
// Or paste in browser console and call it
