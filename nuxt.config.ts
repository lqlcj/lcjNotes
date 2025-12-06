// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  
  // 兼容性配置
  compatibilityDate: '2024-04-03',
  
  // CSS 配置
  css: ['~/assets/styles/styles.css'],
  
  // 模块配置
  modules: [
    '@pinia/nuxt'
  ],
  
  // Vite 配置
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'markdown-libs': ['markdown-it', 'front-matter'],
          },
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      minify: 'esbuild',
      chunkSizeWarningLimit: 1000,
    },
  },
  
  // 应用配置
  app: {
    head: {
      title: '♥Leyili',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },
    pageTransition: { name: 'page', mode: 'out-in' },
    layoutTransition: { name: 'layout', mode: 'out-in' }
  },
  
  // 路由配置
  router: {
    options: {
      scrollBehaviorType: 'smooth'
    }
  },
  
  // 实验性功能
  experimental: {
    payloadExtraction: false
  },

  // 建议在 nuxt.config.ts 中明确指定 preset，这样构建产物会直接适配 Cloudflare Workers
  nitro: {
    preset: 'cloudflare',
    // 存储配置：本地开发使用内存存储，避免 cloudflareKV 驱动错误
    // 在生产环境（Cloudflare）中，KV binding 会通过 wrangler.jsonc 自动配置
    storage: {
      kv: {
        driver: 'memory' // 本地开发使用内存存储，生产环境会自动使用 Cloudflare KV
      }
    }
  },
  
  // 运行时配置
  runtimeConfig: {
    adminPassword: process.env.ADMIN_PASSWORD || 'admin123', // 默认密码，生产环境请修改
    public: {
      // 公共配置
    }
  }
})

