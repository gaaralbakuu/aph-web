import { nextTick } from 'vue'
import store from '../store'

// Error handler initialization function
// Call this from main.js with: initErrorHandler(app)
export function initErrorHandler(app) {
  // you can set only in production env show the error-log
  // if (process.env.NODE_ENV === 'production') {
  app.config.errorHandler = function(err, vm, info, a) {
    nextTick(() => {
      store.dispatch('addErrorLog', {
        err,
        vm,
        info,
        url: window.location.href
      })
      console.error(err, info)
    })
  }
  // }
}
