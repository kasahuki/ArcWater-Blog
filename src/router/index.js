import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import CategoryPage from '../views/CategoryPage.vue'
import ArticleDetail from '../views/ArticleDetail.vue'
import Login from '../views/Login.vue'
import MusicShow from '../views/MusicShow.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path:'/login',
    name:'login',
    component: Login
  },
  {
    path: '/category/:slug',
    name: 'Category',
    component: CategoryPage
  },
  {
    path: '/article/:id',
    name: 'ArticleDetail',
    component: ArticleDetail
    
  },
  {
    path: '/about',
    name: 'About',
    // 路由懒加载 不用导入
    component: () => import('../views/AboutPage.vue')
  },
  {
    path: '/music',
    name: 'Music',
    component: MusicShow
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // 开发环境下优先使用保存的滚动位置
    if (import.meta.env.DEV) {
      try {
        const saved = sessionStorage.getItem('dev_scroll_position')
        if (saved) {
          const { y } = JSON.parse(saved)
          // 如果是同一路由的刷新，恢复滚动位置
          if (to.path === from.path) {
            return { top: y, behavior: 'instant' }
          }
        }
      } catch (e) {
        console.warn('路由滚动位置恢复失败:', e)
      }
    }
    
    // 默认行为：优先使用浏览器保存的位置，否则回到顶部
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router