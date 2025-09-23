# 项目介绍

此项目为后台前端解决方案，它基于 vue 和 element-ui 实现，你需要在本地安装 node 和 git。本项目技术栈基于 ES2015+、vue、vuex、vue-router 、vue-cli 、axios 和 element-ui，提前了解和学习这些知识会对使用本项目有很大的帮助。

## 必备知识

- HTML 基础 `https://www.w3school.com.cn/html/index.asp`
- JavaScript 基础 `https://www.w3school.com.cn/js/index.asp`
- CSS 基础 `https://www.w3school.com.cn/css/index.asp`
- Vue2.x `https://cn.vuejs.org/v2/guide/`
- Element `https://element.eleme.cn/#/zh-CN/component/installation`

了解基础用法

- vue-router `https://router.vuejs.org/zh/installation.html`
- vuex `https://vuex.vuejs.org/zh/`

## 开发环境

- VSCode
- VSCode 插件 Prettier Vetur
- Postman
- Git & TortoiseGit

`https://my.oschina.net/u/4271175/blog/3295628?hmsr=kaifa_aladdin`

## 项目目录

```
├── public                     # 静态资源
│   │── favicon.ico            # favicon图标
│   └── index.html             # html模板
├── src                        # 源代码
│   ├── api                    # 所有请求
│   ├── assets                 # 主题 字体等静态资源
│   ├── components             # 全局公用组件
│   ├── config                 # 全局配置
│   ├── icons                  # 项目 svg icons
│   ├── lang                   # 国际化 language
│   ├── mixin                  # 混入
│   ├── router                 # 路由
│   ├── store                  # 全局 store管理
│   ├── styles                 # 全局样式
│   ├── utils                  # 全局公用方法
│   ├── vendor                 # 公用vendor
│   ├── views                  # views 所有页面
│   ├── App.vue                # 入口页面
│   └── main.js                # 入口文件
├── babel.config.js            # babel-loader 配置
├── package.json               # package.json
└── vue.config.js              # vue-cli 配置
```

## 安装

```
# 克隆项目
git clone https://xxx.git

# 进入项目目录
cd xxx

# 安装依赖
npm install

# 国内大陆可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 本地开发 启动项目
npm run serve

# 发布打包项目
npm run build
```

## 布局 Layout

项目中大部分页面都是基于 `@/views/layout/Layout.vue` 的，除了个别页面如：login , 404, 401 等页面没有使用该 layout。

如果你想在一个项目中有多种不同的 layout 也是很方便的，只要在一级路由那里选择不同的 layout 组件就行。

```
// 路由中定义了布局组件使用 Layout
{
    path: '/example',
    component: Layout,
    children: [
      {
        path: 'icon',
        component: () => import('@/views/example/svg-icons'),
        name: 'exampleIcons',
        meta: { title: '图标' }
      }
    ]
  }
```

这里使用了 vue-router 路由嵌套, 所以一般情况下，你增加或者修改页面只会影响 layout 右侧的主体区域。其它内容如：侧边栏或者导航栏都是不会随着你主体页面变化而变化的。

```
    <keep-alive :include="cachedViews">
      <router-view :key="key" />
    </keep-alive>
```

这里在 router-view 外部包了一层 keep-alive 主要是为了缓存使用。

## 路由

路由定义于 `@/router/index.js` 中，并支持模块化定义。

```
export const constantRouterMap = [{...}]

// admin为模块化定义
export const asyncRouterMap = [admin]
```

这里的路由分为两种，constantRoutes 和 asyncRoutes。

constantRouterMap 中定义的路由为默认加载路由，一般与菜单无关。代表那些不需要动态判断权限的路由，如登录页、404、等通用页面。

asyncRouterMap 中定义路由为按需加载路由，一般与后端配合依据用户权限通过 addRoutes 完成路由动态加载。

## 路由拦截与权限验证

此项目中权限的实现方式是：用户登录之后，通过后端 api 获取当前用户的 roles 及对应的功能权限。然后根据功能去比对路由表，生成当前用户具有的权限可访问的路由表，通过 router.addRoutes 动态挂载到 router 上。

`@/router/permission.js`

```
    if (getToken()) {
    // determine if there has token
    /* has token */
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is homepage will not trigger	afterEach hook, so manually handle it
    } else {
      if (!store.getters.user.userId) {
        // 判断当前用户是否已拉取完user_info信息
        store
          .dispatch('GetUserInfo')
          .then(res => {
            // 拉取user_info
            store
              .dispatch('GenerateRoutes', store.getters.user)
              .then(() => {
                router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
              })
              .catch(e => {
                console.info(e)
              })
          })
          .catch(err => {
            console.log(err)
            store.dispatch('FedLogOut').then(() => {
              Vue.prototype.$message.error('用户身份验证失败，请重新登录')
              next({ path: '/' })
            })
          })
      } else {
        next()
      }
    }
  } else {
    /* has no token */
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
```

路由跳转拦截器中检查 token 是否存在，获取用户信息及菜单权限，否则跳转至登录页。

## 导航栏

以前的后台项目大部分都是多页面的形式，所以标签栏导航功能还是具有一定意义的，大部分都是基于 iframe 的方式实现的。

但随着时代的发展，现在的后台项目几乎都是 spa(single page web application 单页面开发)，再使用以前的方案来实现标签导航显然是不合适的。

所以目前的方案大致为： 运用 keep-alive 和 router-view 的结合。

顶部标签栏导航实际作用相当于 nav 的另一种展现形式，其实说白了都是一个个 router-link，点击跳转到相应的页面。然后我们再来监听路由 \$route 的变化，来判断当前页面是否需要重新加载或者已被缓存。

## 样式

常见的工作流程是，全局样式都写在 `@/styles` 目录下，每个页面自己对应的样式都写在自己的 .vue 文件之中

```
├── styles
│   ├── element-ui.scss         # 全局自定义element-ui 样式
│   ├── index.scss              # 全局通用样式
│   ├── mixin.scss              # 全局mixin
│   ├── layout.scss             # 全局layout
│   └── transition.scss         # vue transition 动画
```

每一个组件或页面的样式就写在当前 vue 文件内，请记住加上 scoped 或者命名空间，避免造成全局的样式污染。

```
<style scoped>
  /* local styles */
  .xxx-container{}
</style>
```

## 图标

如果你没有在本项目 Icon 中找到需要的图标，可以到 iconfont.cn 或者其它 svg 图标网站，下载 svg 使用。

下载完成之后将 .svg 文件放入 `@/icons/svg` 文件夹下之后就会自动导入。

```
<svg-icon icon-class="password" />
// icon-class 为 icon 的名字
```

项目同时引入了 `font-awesome` 库，也可以随时使用其图标。

```
<i class="fa fa-users" />
```

## 国际化

本项目集合了国际化 i18n 方案。通过 vue-i18n 而实现。  
`@/lang` 目前配置了英文和中文两种语言。

添加语言资源项：  
`@/lang/zh-CN.js`

```
export default {
	demo:{
		test:'测试'
	}
}
```

在 vue 文件中使用  
`@/views/demo.vue`

```
<template>
  <div>{{$l.test}}</div>
</template>
<script>
export default {
  name: 'demo',
  data: function () {
    return {}
  },
  method: {},
}
```

## API 请求

### API 地址配置

`@/api/index.js`

```
const api = {
  baseUrl,
  auth: url + 'platform/auth/',
  user: url + 'platform/user/',
  menu: url + 'platform/menu/',
  role: url + 'platform/role/',
  dictionary: url + 'platform/dictionary/',
  quartz: url + 'platform/quartz/',
  param: url + 'platform/param/',
  rtestuser:url+'platform/rtestuser/'
  banner:url+'platform/banner/'
}
```

在 vue 实例中使用 this.\$api 即可访问 api 对象。

### axios 封装

`@/utils/request.js`

```
export default function request(url, data, method, donotAutoShowError) {
  data = data || {}
  method = method || 'get'
  method = method.toLowerCase()
  var config = {
    url,
    method
  }
  if (method === 'get') {
    config.params = data
  } else {
    console.info(data)
    config.data = data
  }
  return new Promise((resolve, reject) => {
    service(config)
      .then(r => {
        resolve(r)
      })
      .catch(e => {
        if (!donotAutoShowError) {
          Vue.prototype.$message({
            message: e.message || 'Unknown Error',
            type: 'error',
            duration: 5 * 1000
          })
        }
        reject(e)
      })
  })
}
```

用法 - Get

```
this.$request(url, params)
  .then((r) => {
    null
  })
  .catch((e) => {
    null
  })
```

用法 - Post

```
this.$request(url, data, 'post')
  .then((r) => {
    null
  })
  .catch((e) => {
    null
  })
```

## 新增功能

- 新建页面组件
- 编写组件内容
- 定义路由

## 📚 Documentation - Tài liệu dự án

### 📁 Thư mục docs/
```
docs/
├── CHANGELOG.md          # Lịch sử chi tiết các thay đổi và fix bugs
├── BUG_TRACKER.md        # Theo dõi lỗi theo danh mục
├── README.md            # Hướng dẫn sử dụng hệ thống ghi lỗi
└── templates/           # Templates cho việc ghi lỗi
    └── BUG_TEMPLATE.md  # Template ghi lỗi mới
```

### 🐛 Hệ thống ghi lỗi
Dự án sử dụng hệ thống ghi lỗi có tổ chức để:
- Theo dõi lịch sử sửa lỗi
- Phân loại lỗi theo danh mục (API, UI, Database)
- Tạo báo cáo thống kê
- Đảm bảo tính minh bạch

#### Cách sử dụng:
1. **Phát hiện lỗi**: Ghi vào `docs/BUG_TRACKER.md`
2. **Sửa lỗi**: Cập nhật trạng thái và chi tiết vào `docs/CHANGELOG.md`
3. **Commit**: Sử dụng format `fix: BUG-XXX - mô tả lỗi`

#### Template commit:
```
fix: BUG-001 - DeserializeData overload 5 arguments

- Thêm overload mới cho DeserializeData với 5 tham số
- Đồng bộ logic với VideoApiSourceCode
- Files: Apache.Uniapp.Core/Helpers/DbContext.cs
```

### 📊 Báo cáo thống kê
- Hàng tháng: Cập nhật thống kê trong `BUG_TRACKER.md`
- Hàng quý: Phân tích xu hướng và cải thiện chất lượng

---

*Tài liệu được cập nhật thường xuyên để phản ánh tình trạng dự án mới nhất.*
