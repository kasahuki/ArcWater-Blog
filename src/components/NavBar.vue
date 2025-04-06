<template>
  <div class="nav-container">
    <div class="logo-container">
      <router-link to="/">
        <h1 class="logo"><img src="../assets/image/arcwater_logo.png" width="50"><span class="appleFont">ArcWater</span>
        </h1>
      </router-link>
    </div>

    <el-menu :default-active="activeIndex" mode="horizontal" router class="nav-menu appleFont"
      background-color="#ffffff" text-color="#333" active-text-color="#409EFF">
      <el-menu-item index="/">Home</el-menu-item>
      <el-sub-menu index="categories">
        <template #title>Category</template>
        <el-menu-item index="/category/frontend">前端开发</el-menu-item>
        <el-menu-item index="/category/backend">后端技术</el-menu-item>
        <el-menu-item index="/category/uiux">UI/UX设计</el-menu-item>
        <el-menu-item index="/category/mobile">移动开发</el-menu-item>
      </el-sub-menu>
      <el-menu-item index="/about">About</el-menu-item>
    </el-menu>

    <div class="theme-switch">
      <el-button circle class="theme-toggle-btn" @click="toggleTheme" :title="isDarkMode ? '切换到日间模式' : '切换到夜间模式'">
        <el-icon size="20">
          <component :is="isDarkMode ? 'Sunny' : 'Moon'" />
        </el-icon>
      </el-button>
    </div>

    <div class="search-container">
      <div class="search-wrapper">
        <div class="search-icon-container">
          <el-icon class="search-icon">
            <Search />
          </el-icon>
        </div>
        <input v-model="searchQuery" type="text" class="search-input" placeholder="输入关键词..."
          @keyup.enter="handleSearch" />
        <button class="search-button" @click="handleSearch">
          Search
        </button>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Search, Moon, Sunny } from '@element-plus/icons-vue'

const route = useRoute()
const searchQuery = ref('')
const isDarkMode = ref(false)

// 检查本地存储中是否已保存主题偏好
onMounted(() => {
  const savedTheme = localStorage.getItem('theme')
  if (savedTheme === 'dark') {
    isDarkMode.value = true
    applyDarkMode(true)
  }
})

// 切换主题模式
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value
  applyDarkMode(isDarkMode.value)
  // 保存用户偏好到本地存储
  localStorage.setItem('theme', isDarkMode.value ? 'dark' : 'light')
}

// 应用暗黑模式
const applyDarkMode = (isDark) => {
  const root = document.documentElement
  if (isDark) {
    root.classList.add('dark-mode')
  } else {
    root.classList.remove('dark-mode')
  }
}

const activeIndex = computed(() => {
  return route.path
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // 实际项目中这里会跳转到搜索结果页
    console.log('搜索:', searchQuery.value)
    // router.push({ path: '/search', query: { q: searchQuery.value } })
  }
}
</script>

<style scoped>
.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 60px;
}

.logo-container {
  margin-right: 20px;
}

.logo {
  width: 11rem;
  display: flex;
  align-items: center;
  /* 垂直居中 */
  justify-content: space-around;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;

}

.logo span:hover {
  transform: scale(1.05);
  /* 鼠标悬停时放大，增加互动感 */
  color: #007aff;
  /* 苹果蓝，增强品牌识别感 */
}


.nav-menu {
  flex: 1;
  border-bottom: none;


}

.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-wrapper {
  display: flex;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.7);
  transition: all 0.3s ease;
}

.search-wrapper:focus-within {
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.search-icon-container {
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  border-right: 1px solid rgba(240, 240, 240, 0.5);
  transition: all 0.3s ease;
}

.search-wrapper:focus-within .search-icon-container {
  background-color: rgba(255, 255, 255, 0.2);
}

.search-wrapper:focus-within .search-icon {
  color: var(--primary-color, #409eff);
  transform: scale(1.1);
}

.search-icon {
  color: #909399;
  transition: all 0.3s ease;
}

.search-input {
  width: 100%;
  max-width: 220px;
  height: 40px;
  padding-left: 10px;
  background-color: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.search-input:focus {
  max-width: 240px;
}

.search-input::placeholder {
  color: #909399;
  opacity: 0.7;
}

.search-button {
  height: 40px;
  padding: 0 16px;
  background-color: var(--primary-color, #409eff);
  color: white;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-button:hover {
  background-color: var(--primary-hover, #337ecc);
  padding: 0 20px;
}

a {
  text-decoration: none;
  color: inherit;
}

.theme-switch {
  margin: 0 15px;
}

.theme-toggle-btn {
  border: none;
  background-color: transparent;
  color: var(--text-color, #333);
  transition: all 0.3s ease;
}

.theme-toggle-btn:hover {
  transform: rotate(30deg);
  color: var(--primary-color, #409eff);
}
</style>