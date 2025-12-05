// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { createSvgPlugin } from 'vite-plugin-vue2-svg' // <- chú ý named import
import viteString from 'vite-plugin-string'
import PluginInspect from 'vite-plugin-inspect'
import progress from 'vite-plugin-progress'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  console.log('Main API:', env.VITE_API)
  console.log('Video API:', env.VITE_VIDEO_API)

  const isDev = mode === 'development'
  const enableVisualizer = false // bật true khi bạn muốn phân tích bundle thủ công

  return {
    // 1) cacheDir để giảm cold-start
    cacheDir: 'node_modules/.vite_cache',

    plugins: [
      // Vue2 plugin
      vue2({ template: { compilerOptions: { whitespace: 'preserve' } } }),

      tailwindcss(),

      // SVG sprite — OK để dùng
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
        symbolId: 'icon-[name]',
        inject: 'body-last',
        customDomId: 'svg-sprite-icons',
      }),

      viteString({ include: ['**/*.md'] }),

      // CHỈ enable PluginInspect trong dev (apply: 'serve')
      PluginInspect({ apply: 'serve' }),

      // progress chỉ hiển thị progress bar (apply build ok)
      progress({ clear: true }),

      createSvgPlugin({
        defaultImport: 'component', // import SVG như component
      }),
    ].filter(Boolean),

    resolve: {
      alias: { '@': path.resolve(__dirname, './src') },
      extensions: ['.mjs', '.js', '.ts', '.json', '.vue'],
    },

    server: {
      host: true,
      port: 5173,
      // 🔥 HMR configuration cho Windows
      hmr: {
        host: 'localhost',
        port: 5173,
        protocol: 'ws',
      },
      // 🔥 Watch configuration - tối ưu cho Windows + thư mục sâu
      watch: {
        // Windows + thư mục sâu: dùng polling với timeout ngắn hơn
        usePolling: true,
        // Giảm interval xuống 50ms để detect changes nhanh hơn (thư mục sâu)
        interval: 50,
        // Bỏ qua node_modules và các folder không cần thiết
        ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/.cache/**', '**/obj/**', '**/bin/**'],
        // Timeout để debounce multiple changes - giảm xuống 50ms cho response nhanh hơn
        awaitWriteFinish: {
          stabilityThreshold: 50,
          pollInterval: 50,
        },
      },
      // Thêm middlewareMode: false để đảm bảo file watch hoạt động bình thường
      middlewareMode: false,
    },

    css: { devSourcemap: true },

    build: {
      target: 'es2018',
      sourcemap: false,
      minify: 'esbuild',
      reportCompressedSize: false,
      // Tăng warning limit nếu bạn có chunk lớn (chỉ cảnh báo)
      chunkSizeWarningLimit: 2000,

      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id) return
            // chỉ xử lý node_modules (giảm số lần includes)
            if (id.includes('node_modules')) {
              if (id.includes('@vue-office/pdf')) return 'vo-pdf'
              if (id.includes('@vue-office/excel')) return 'vo-excel'
              if (id.includes('element-ui')) return 'element-ui'
              if (id.includes('echarts')) return 'echarts'
              return 'vendor'
            }
          },
        },
      },

      // CommonJS options - QUAN TRỌNG cho Element UI
      commonjsOptions: {
        // Transform mixed ES/CJS modules - quan trọng cho Element UI
        transformMixedEsModules: true,
        // Include tất cả node_modules có thể là CJS
        include: [/node_modules/],
        // Giữ default export khi Rollup chuyển CJS -> ESM để Vue.use(Element) không bị rỗng trong build
        defaultIsModuleExports: 'auto',
        // Đặc biệt cho element-ui
        requireReturnsDefault: 'auto',
      },

      // nếu dự án nhiều file lớn trong public, cân nhắc false để copy thủ công
      // emptyOutDir: true,
    },

    define: {
      'process.env': { NODE_ENV: JSON.stringify(mode) },
      __DEV__: isDev,
    },

    optimizeDeps: {
      // Element UI là CJS phức tạp, cần prebundle toàn bộ các component
      include: [
        'vue',
        'vue-router',
        'vuex',
        'element-ui',
        // Prebundle các component hay bị lỗi (table, form, etc.)
        'element-ui/lib/table',
        'element-ui/lib/table-column',
        'element-ui/lib/form',
        'element-ui/lib/form-item',
        'element-ui/lib/dialog',
        'element-ui/lib/input',
        'element-ui/lib/select',
        'element-ui/lib/option',
        'element-ui/lib/pagination',
        'element-ui/lib/loading',
        'element-ui/lib/message',
        'element-ui/lib/message-box',
        'element-ui/lib/notification',
      ],
      // Giữ interop CJS cho element-ui (fix Table/Form mất props khi build)
      needsInterop: ['element-ui'],
      exclude: [],
      // Force prebundle lại khi có thay đổi
      force: false,
      esbuildOptions: {
        // Hỗ trợ CommonJS modules
        target: 'es2018',
      }
    },
  }
})
