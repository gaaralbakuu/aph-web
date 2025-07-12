// 拼接路径
const resolve = (dir) => require('path').join(__dirname, dir)

// API_URL
// process.env.VUE_APP_API = 'http://10.30.3.121:65301' //prd
  process.env.VUE_APP_API = 'http://localhost:65301' //prd

if (process.env.NODE_ENV === 'development') {
  process.env.VUE_APP_API = 'http://10.30.2.247:5000' //test
  // process.env.VUE_APP_API = 'http://localhost:65301' //prd
}

if (process.env.NODE_ENV === 'production') {
  process.env.VUE_APP_API = 'https://appvn.apachefootwear.com' //prd
}
console.log(process.env.VUE_APP_API)

module.exports = {
  publicPath: '/',
  devServer: {
    host: '0.0.0.0',
    port: 8180,
  },
  configureWebpack: () => {
    var obj = {
      externals: {
        './cptable': 'var cptable',
      },
    }
    return obj
  },
  chainWebpack: (config) => {
    // set whitespace
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        options.compilerOptions.whitespace = 'preserve'
        return options
      })
      .end()
    // markdown
    config.module.rule('md').test(/\.md$/).use('text-loader').loader('text-loader').end()
    // svg
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule.include
      .add(resolve('src/icons/svg'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      })
      .end()
    // image exclude
    const imagesRule = config.module.rule('images')
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude.add(resolve('src/icons/svg'))
      .end()
  },
}
