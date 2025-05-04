import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  // 内网穿透配置
  server: {
    allowedHosts: [
      '51e46d8.r22.cpolar.top', // 添加你要允许的主机地址
      // 可以添加多个主机地址，用逗号分隔
    ],



    // 当前端请求路径以 /api/ 开头时，请求将被转发到 http://localhost:8080/user，并对路径做一次重写处理，把开头的 /api 去掉。
    proxy: {
      '/api/user/': {
        target: 'http://localhost:8080/',
        changeOrigin: true,
        rewrite:(path) => path.replace(/^\/api/,'')
      }
    }
    
  }
  
})
