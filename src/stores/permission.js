import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { asyncRouterMap, constantRouterMap, noPageRoute, routerVideo } from '@/router'

/**
 * Kiểm tra route có trong danh sách quyền hay không
 * @param {Array} arr - Danh sách route names có quyền
 * @param {Object} route - Route cần kiểm tra
 */
function hasPermission(arr, route) {
  if (route.name && arr.indexOf(route.name) !== -1) {
    return true
  }
  return false
}

/**
 * Lọc async routes theo quyền của user
 * @param {Array} routes - asyncRouterMap
 * @param {Object} menus - Object chứa routeName: menuTitle
 */
function filterAsyncRouter(routes, menus) {
  const res = []
  const arr = Object.keys(menus)

  routes.forEach((route) => {
    const tmp = { ...route }
    if (tmp.children) {
      tmp.children = filterAsyncRouter(tmp.children, menus)
      if (tmp.children.length > 0) {
        if (menus[tmp.name]) tmp.meta.title = menus[tmp.name]
        res.push(tmp)
      }
    } else if (hasPermission(arr, tmp)) {
      tmp.meta.title = menus[tmp.name]
      res.push(tmp)
    }
  })

  return res
}

export const usePermissionStore = defineStore('permission', () => {
  // State
  const routers = ref([...constantRouterMap])
  const addRouters = ref([])

  // Computed
  const permissionRouters = computed(() => routers.value)

  // Actions
  const generateRoutes = async (userData) => {
    const { menu } = userData
    const routeNameList = {}

    menu.forEach((i) => {
      if (['WEB', 'MENU'].includes(i.resource_type)) {
        routeNameList[i.resource_path] = i.menu_name
      }
    })

    let accessedRouters = []
    accessedRouters = filterAsyncRouter(asyncRouterMap, routeNameList)
    accessedRouters.push(...routerVideo)
    accessedRouters.push(noPageRoute)

    addRouters.value = accessedRouters
    routers.value = constantRouterMap.concat(accessedRouters)
  }

  return {
    // State
    routers,
    addRouters,
    // Computed
    permissionRouters,
    // Actions
    generateRoutes
  }
})
