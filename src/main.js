import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/main.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import App from './App.vue'
import router from './router'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import { createPinia } from 'pinia'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

// 注册所有图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.use(pinia)
app.use(ElementPlus)
app.use(router)

// 全局滚动位置恢复机制 - 解决开发环境下热更新后页面位置丢失问题
if (import.meta.env.DEV) {
  // 保存滚动位置
  const saveScrollPosition = () => {
    const scrollY = window.scrollY || document.documentElement.scrollTop
    const scrollX = window.scrollX || document.documentElement.scrollLeft
    sessionStorage.setItem('dev_scroll_position', JSON.stringify({ x: scrollX, y: scrollY }))
  }

  // 恢复滚动位置
  const restoreScrollPosition = () => {
    try {
      const saved = sessionStorage.getItem('dev_scroll_position')
      if (saved) {
        const { x, y } = JSON.parse(saved)
        // 延迟恢复，确保DOM已渲染
        setTimeout(() => {
          window.scrollTo({ top: y, left: x, behavior: 'instant' })
        }, 100)
      }
    } catch (e) {
      console.warn('恢复滚动位置失败:', e)
    }
  }

  // 监听页面可见性变化（热更新时会触发）
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      restoreScrollPosition()
    }
  })

  // 监听页面加载完成
  window.addEventListener('load', restoreScrollPosition)

  // 定期保存滚动位置（开发环境）
  setInterval(saveScrollPosition, 1000)

  // 页面卸载前保存位置
  window.addEventListener('beforeunload', saveScrollPosition)
}

app.mount('#app')

// 在main.js 中导入 main.css 全局生效
