import api from '@/api'
import request from '@/utils/request'

// Create symbols for injection keys to avoid potential naming conflicts
export const ApiInjectionKey = Symbol('api')
export const RequestInjectionKey = Symbol('request')

export default {
  install(app) {
    // Provide the api and request functions to the entire application.
    // Components and composables can then inject them using `inject(ApiInjectionKey)`
    // and `inject(RequestInjectionKey)`.
    app.provide(ApiInjectionKey, api)
    app.provide(RequestInjectionKey, request)

    // For easier access in options API components (though Composition API is preferred),
    // we can still attach them to the global properties.
    app.config.globalProperties.$api = api
    app.config.globalProperties.$request = request
  }
}