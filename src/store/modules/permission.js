import { asyncRouterMap, constantRouterMap, noPageRoute } from '@/router'

/**
 * 通过meta.role判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
function hasPermission(arr, route) {
  if (route.name && arr.indexOf(route.name) != -1) {
    return true
  }
  return false
}

/**
 * 递归过滤异步路由表，返回符合用户权限的路由表
 * @param routes asyncRouterMap
 * @param arr 用户有权限的 routeNames Array
 */
function filterAsyncRouter(routes, menus) {
  const res = []
  const arr = Object.keys(menus)
  routes.forEach(route => {
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

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { menu } = data
        const routeNameList = {}
        menu.forEach(i => {
          if (['WEB', 'MENU'].includes(i.resource_type)) {
            routeNameList[i.resource_path] = i.menu_name
          }
        })
        let accessedRouters = []
        accessedRouters = filterAsyncRouter(asyncRouterMap, routeNameList)
        accessedRouters.push(noPageRoute)
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  },
  getters: {
    permission_routers: state => state.routers,
    addRouters: state => state.addRouters
  }
}

export default permission
