import store from '../store'

export default {
  install(app) {
    app.config.errorHandler = (err, vm, info) => {
      // In Vue 3, `vm` is the component instance, and `info` is the error type.
      // We can dispatch the error to the store as before.
      store.dispatch('addErrorLog', {
        err,
        vm, // This will be the component instance
        info, // Additional info about the error
        url: window.location.href,
      })
      console.error(err, info)
    }
  },
}
