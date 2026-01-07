// vite.config.js
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import svgLoader from 'vite-svg-loader'
import viteString from 'vite-plugin-string'
import PluginInspect from 'vite-plugin-inspect'
import progress from 'vite-plugin-progress'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode, command }) => {
  const env = loadEnv(mode, process.cwd(), '')
  console.log('Main API:', env.VITE_API)
  console.log('Video API:', env.VITE_VIDEO_API)
  console.log('Build mode:', mode)
  console.log('Build command:', command)

  const isDev = mode === 'development'

  return {
    logLevel: 'info',
    cacheDir: 'node_modules/.vite_cache',

    plugins: [
      vue({
        template: {
          compilerOptions: {
            // treat all tags with a dash as custom elements
            isCustomElement: (tag) => tag.includes('-') && !tag.startsWith('el-') && !tag.startsWith('a-')
          }
        }
      }),

      tailwindcss(),

      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
        symbolId: 'icon-[name]',
        inject: 'body-last',
        customDomId: 'svg-sprite-icons',
      }),

      viteString({ include: ['**/*.md'] }),
      PluginInspect({ apply: 'serve' }),
      progress({ clear: true }),
      svgLoader()
    ],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      },
      extensions: ['.mjs', '.js', '.ts', '.json', '.vue'],
    },

    server: {
      host: true,
      port: 5174,
      hmr: {
        host: 'localhost',
        port: 5174,
        protocol: 'ws',
      },
      watch: {
        usePolling: true,
        interval: 50,
        ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/.cache/**', '**/obj/**', '**/bin/**'],
        awaitWriteFinish: {
          stabilityThreshold: 50,
          pollInterval: 50,
        },
      },
      middlewareMode: false,
      proxy: {
        '/platform': {
          target: env.VITE_API || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          ws: false,
          rewrite: (path) => path,
        },
        '/video': {
          target: env.VITE_VIDEO_API || env.VITE_API || 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
          ws: false,
          rewrite: (path) => path,
        },
      },
    },

    css: { devSourcemap: true },

    build: {
      target: 'esnext',
      sourcemap: false,
      minify: 'esbuild',
      reportCompressedSize: true,
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (!id) return
            if (id.includes('node_modules')) {
              if (id.includes('@vue-office/pdf')) return 'vo-pdf'
              if (id.includes('@vue-office/excel')) return 'vo-excel'
              if (id.includes('element-plus')) return 'element-plus'
              if (id.includes('echarts')) return 'echarts'
              return 'vendor'
            }
          },
        },
      },
    },

    define: {
      'process.env': { NODE_ENV: JSON.stringify(mode) },
      __DEV__: isDev,
    },
  }
})
