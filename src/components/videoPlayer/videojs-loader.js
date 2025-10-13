import './video.min.js'

const videojs = globalThis.videojs

if (!videojs) {
  throw new Error('video.js failed to initialize')
}

export default videojs
