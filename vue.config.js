// 拼接路径
const resolve = (dir) => require('path').join(__dirname, dir)
// const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

// API_URL
// process.env.VUE_APP_API = 'http://10.30.3.121:65301' //prd
process.env.VUE_APP_API = 'http://localhost:65301' //prd

// Video API_URL (riêng biệt cho video server)
process.env.VUE_APP_VIDEO_API = 'http://localhost:65301' // video server

if (process.env.NODE_ENV === 'development') {
  // process.env.VUE_APP_API = 'http://10.30.2.247:5000' //test
  process.env.VUE_APP_API = 'http://localhost:65301' //prd
  process.env.VUE_APP_VIDEO_API = 'http://localhost:65301' // video server dev
}

if (process.env.NODE_ENV === 'test') {
  process.env.VUE_APP_API = 'http://10.30.2.247:5000' //test
  process.env.VUE_APP_VIDEO_API = 'http://10.30.2.247:5000' // video server test
}

if (process.env.NODE_ENV === 'production') {
  process.env.VUE_APP_API = 'https://appvn.apachefootwear.com' //prd
  process.env.VUE_APP_VIDEO_API = 'https://video.apachefootwear.com' // video server prd
}

console.log('Main API:', process.env.VUE_APP_API)
console.log('Video API:', process.env.VUE_APP_VIDEO_API)

module.exports = {
  publicPath: '/',
  // TẮT song song khi đo để log chính xác (bật lại khi xong profiling)
  parallel: false,

  devServer: {
    host: '0.0.0.0',
    port: 8180,
    hot: true,
    liveReload: true,
    watchOptions: {
      poll: 1000,
      ignored: /node_modules/,
      aggregateTimeout: 300,
    },
  },

  transpileDependencies: ['element-ui'],

  css: {
    extract: process.env.NODE_ENV === 'production',
    sourceMap: true,
    // loaderOptions: { ... }
  },

  // ✅ KHÔNG return config; chỉ chỉnh trực tiếp và push plugin
  configureWebpack: (config) => {
    config.cache = false
    config.externals = Object.assign({}, config.externals, {
      './cptable': 'var cptable',
    })

    config.plugins = config.plugins || []
    // config.plugins.push(new SpeedMeasurePlugin())
    // config.plugins.push(new BundleAnalyzerPlugin())

    // Thêm optimization cho production build
    if (process.env.NODE_ENV === 'production') {
      config.optimization = {
        splitChunks: {
          chunks: 'all',
          minSize: 200 * 1024,
          maxSize: 300 * 1024, // ép cắt nhỏ
          cacheGroups: {
            vueOfficePdf: {
              test: /[\\/]node_modules[\\/]@vue-office[\\/]pdf[\\/]/,
              name: 'chunk-vo-pdf',
              priority: 25,
              chunks: 'all',
              enforce: true,
            },
            vueOfficeExcel: {
              test: /[\\/]node_modules[\\/]@vue-office[\\/]excel[\\/]/,
              name: 'chunk-vo-excel',
              priority: 25,
              chunks: 'all',
              enforce: true,
            },
          },
        },
      }
    }
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

    // markdown
    config.module.rule('md').test(/\.md$/).use('text-loader').loader('text-loader')

    // svg sprite
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .include.add(resolve('src/icons/svg')).end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({ symbolId: 'icon-[name]' })

    // images (trừ thư mục svg icons)
    const imagesRule = config.module.rule('images')
    imagesRule
      .test(/\.(png|jpe?g|gif|webp|svg)(\?.*)?$/)
      .exclude.add(resolve('src/icons/svg'))
  },

  // Khuyến nghị khi build prod để nhanh hơn (tùy bạn bật/để nguyên):
  productionSourceMap: false, // tắt source map prod để giảm thời gian build
}