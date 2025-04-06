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
  }
  
})
