<template>
  <div class="app-container">
    <!-- 主容器 -->
    <div class="main-layout">
      <!-- 侧边栏 -->
      <div class="sidebar glass-panel" :class="{ 'collapsed': sidebarCollapsed }">
        <div class="sidebar-content" v-if="!sidebarCollapsed" @click.stop>
          <div class="sidebar-header">
            <div class="app-logo">
              <el-icon style="margin-right: 5px; vertical-align: middle;">
                <Timer />
              </el-icon>
            </div>
          </div>

          <el-scrollbar height="calc(100vh - 180px)">
            <el-collapse v-model="activeYears" accordion class="year-collapse">
              <el-collapse-item v-for="year in years" :key="year.value" :title="year.label" :name="year.value">
                <div class="month-list">
                  <div v-for="month in year.months" :key="`${year.value}-${month.value}`" class="month-item"
                    :class="{ 'active': isMonthActive(year.value, month.value) }"
                    @click="selectMonth(year.value, month.value)">
                    <span>{{ month.label }}</span>
                    <span class="article-count">{{ month.count }}</span>
                  </div>
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-scrollbar>

          <div class="sidebar-footer">
            <div class="user-profile">
              <el-avatar :size="32" src="https://via.placeholder.com/40" />
              <span class="username">用户名</span>
            </div>
          </div>
        </div>

        <!-- 切换按钮 - 放在中间位置 -->
        <div class="sidebar-toggle" @click="toggleSidebar">
          <el-icon v-if="sidebarCollapsed">
            <ArrowRight />
          </el-icon>
          <el-icon v-else>
            <ArrowLeft />
          </el-icon>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="content-area">
        <div class="content-header glass-panel">
          <h1>{{ category.categoryName }}</h1>
          <div class="header-actions">
            <div class="search-group">
              <el-input v-model="searchQuery" placeholder="搜索文章..." prefix-icon="Search" clearable class="search-input"
                @keyup.enter="handleSearch" />
              <el-button type="primary" @click="handleSearch">
                <el-icon>
                  <Search />
                </el-icon>
                搜索
              </el-button>
              <el-button @click="handleReset">
                <el-icon>
                  <RefreshRight />
                </el-icon>
                重置
              </el-button>
            </div>
            <el-radio-group v-model="filterCondition" class="filter-group">
              <el-radio-button :label="1">最新发布</el-radio-button>
              <el-radio-button :label="0">最多阅读</el-radio-button>
            </el-radio-group>
          </div>
        </div>
        <h3 style="margin-left: 20px;color: #333">{{ category.description }}</h3>

        <div class="articles-container" ref="articlesContainer" @scroll="handleScroll">
          <div v-infinite-scroll="loadMoreArticles" infinite-scroll-distance="100" infinite-scroll-immediate="false"
            class="articles-wrapper">
            <div v-for="article in displayedArticles" :key="article.id" :id="`article-${article.id}`"
              class="article-card glass-panel" :class="{ 'highlight': article.highlight }" ref="articleRefs">
              <div class="article-header">
                <h2 class="article-title">{{ article.title }}</h2>
                <div class="article-date">{{ formatDate(article.updateTime) }}
                  <div class="click_times" style="color: blanchedalmond;">点击量：{{ article.clickTimes }}</div>
                </div>

              </div>

              <div class="article-body">
                <div class="article-content">
                  <p class="article-excerpt">{{ formatExcerpt(article.content) }}</p>
                  <div class="article-tags">
                    <el-tag v-for="tag in article.tags" :key="tag" size="small" effect="plain" class="article-tag">
                      {{ tag }}
                    </el-tag>
                  </div>
                </div>

                <div class="article-image" v-if="article.cover">
                  <el-image :src="article.cover" :alt="article.title" :preview-src-list="[article.cover]"
                    preview-teleported fit="cover" loading="lazy" class="article-img">
                    <template #error>
                      <div class="image-error">
                        <el-icon>
                          <Picture />
                        </el-icon>
                        <span>加载失败</span>
                      </div>
                    </template>
                  </el-image>
                </div>
              </div>

            </div>

            <div v-if="loading" class="loading-more">
              <el-icon class="is-loading">
                <Loading />
              </el-icon>
              <span>加载更多文章...</span>
            </div>

            <div v-if="noMoreArticles" class="no-more-articles">
              已经到底了
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
//#region Imports
import { ref, reactive, computed, onMounted, nextTick, onUnmounted, watch } from 'vue'
import {
  ArrowLeft, ArrowRight, Search, Filter, View, Star, Share,
  HomeFilled, Bell, Message, Document, Loading, Timer, RefreshRight
} from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import { categoryGetService } from '@/api/category'
import { articleListService } from '@/api/article'
//#endregion

//#region State & Variables
// 路由相关
const route = useRoute()  // Vue Router的路由实例，用于获取路由参数

// UI状态
const sidebarCollapsed = ref(false)  // 侧边栏是否折叠
const searchQuery = ref('')  // 搜索关键词

// 加载状态
const loading = ref(false)  // 是否正在加载文章
const noMoreArticles = ref(false)  // 是否已经没有更多文章

// DOM引用
const articlesContainer = ref(null)  // 文章容器的DOM引用
const articleRefs = ref([])  // 所有文章卡片的DOM引用数组


// 分类数据
const category = ref('')  // 当前分类的信息
const displayedArticles = ref([])  // 当前显示的文章列表

// 时间筛选相关
const currentYear = new Date().getFullYear().toString()  // 当前年份
const years = ref([])  // 所有可选的年份数据
const activeYears = ref([currentYear])  // 当前展开的年份面板
const selectedYear = ref(currentYear)  // 当前选中的年份
const selectedMonth = ref((new Date().getMonth() + 1).toString())  // 当前选中的月份

// 搜索和筛选状态
const filterCondition = ref(1)

// 分页相关
// 格式化年月为Java LocalDate格式 (yyyy-MM-dd)
const formatToLocalDate = (year, month) => {
  // 补零，确保月份是两位数
  const formattedMonth = month.toString().padStart(2, '0')
  // 默认使用每月第一天
  return `${year}-${formattedMonth}-01`
}

const pageNum = ref(1)  // 当前页码
const pageSize = ref(2)  // 每页显示的文章数量

//要让 pageParams.date 在 selectedYear 和 selectedMonth 改变时自动响应并更新，把整个 pageParams 变成一个计算属性。
const pageParams = computed(() => ({
  categoryId: route.params.slug,
  pageNum: pageNum.value,
  pageSize: pageSize.value,
  filterCondition: filterCondition.value,
  title: searchQuery.value,
  date: formatToLocalDate(selectedYear.value, selectedMonth.value)
}))



//#endregion

//#region API Calls
const getCategory = async (id) => {
  const res = await categoryGetService(id)
  category.value = res.data
}



// 加载文章列表
const loadArticles = async () => {
  try {
    loading.value = true
    const params = {
      ...pageParams.value,
      pageNum: pageNum.value
    }
    const response = await articleListService(params)
    const data = response.data

    if (data.result.length < pageSize.value) {
      noMoreArticles.value = true
    }

    // 为每篇文章添加示例标签
    const articleTags = [
      ['Vue3', 'JavaScript', '前端开发'],
      ['React', 'TypeScript', '组件开发'],
      ['后端开发', 'Java', 'Spring Boot'],
      ['数据库', 'MySQL', '性能优化'],
      ['DevOps', 'Docker', '持续集成'],
      ['UI设计', '用户体验', '响应式'],
      ['算法', '数据结构', '编程技巧'],
      ['微服务', '架构设计', '系统优化'],
      ['前端框架', 'Element Plus', '组件库'],
      ['网络编程', 'HTTP', 'WebSocket']
    ]

    return data.result.map(article => ({
      ...article,
      tags: articleTags[Math.floor(Math.random() * articleTags.length)]
    }))
  } catch (error) {
    console.error('加载文章失败:', error)
    return []
  } finally {
    loading.value = false
  }
}

// 无限滚动加载更多
const loadMoreArticles = async () => {
  if (loading.value || noMoreArticles.value) return

  pageNum.value++
  console.log('加载更多文章，当前页码：', pageNum.value)

  const newArticles = await loadArticles()
  if (newArticles && newArticles.length > 0) {
    displayedArticles.value = [...displayedArticles.value, ...newArticles]
  }
}

// 处理滚动事件
const handleScroll = () => {
  if (!articlesContainer.value || loading.value || noMoreArticles.value) return

  const { scrollTop, scrollHeight, clientHeight } = articlesContainer.value
  const scrollBottom = scrollHeight - scrollTop - clientHeight

  // 当距离底部小于100px时加载更多
  if (scrollBottom < 100) {
    console.log('触发加载更多', {
      scrollTop,
      scrollHeight,
      clientHeight,
      scrollBottom,
      pageNum: pageNum.value
    })
    loadMoreArticles()
  }
}

// 选择月份
const selectMonth = async (year, month) => {
  // 如果点击的是当前选中的月份，则不重新加载
  if (selectedYear.value === year && selectedMonth.value === month) {
    return;
  }

  selectedYear.value = year
  selectedMonth.value = month

  // 重置状态
  pageNum.value = 1
  displayedArticles.value = []
  noMoreArticles.value = false

  // 加载新月份的文章
  const newArticles = await loadArticles()
  if (newArticles && newArticles.length > 0) {
    displayedArticles.value = newArticles
  }

  // 滚动到顶部
  nextTick(() => {
    if (articlesContainer.value) {
      articlesContainer.value.scrollTop = 0
    }
  })
}

// 监听筛选条件变化
watch([filterCondition], async () => {
  // 重置页面状态
  pageNum.value = 1
  displayedArticles.value = []
  noMoreArticles.value = false

  // 加载文章
  const newArticles = await loadArticles()
  if (newArticles && newArticles.length > 0) {
    displayedArticles.value = newArticles
  }
}, { immediate: true })


//#region Watchers
// 监听路由参数变化
watch(() => route.params.slug, async (newId) => {
  if (newId) {
    await getCategory(newId)
  }
}, { immediate: true })
//#endregion

//#region Methods
// 格式化日期
const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const year = d.getFullYear()
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const day = d.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}

// 切换侧边栏
const toggleSidebar = () => {
  sidebarCollapsed.value = !sidebarCollapsed.value
}

// 检查月份是否激活
const isMonthActive = (year, month) => {
  return selectedYear.value === year && selectedMonth.value === month
}

// 格式化摘要内容，超过200个字符显示省略号
const formatExcerpt = (content) => {
  if (!content) return ''
  const maxLength = 300 // 增加字符显示数量
  return content.length > maxLength ? content.slice(0, maxLength) + '...' : content
}

// 搜索处理
const handleSearch = async () => {
  // 重置页面状态
  pageNum.value = 1
  displayedArticles.value = []
  noMoreArticles.value = false

  // 更新搜索参数
  pageParams.value = {
    ...pageParams.value,
    pageNum: 1,
    title: searchQuery.value,
    filterCondition: filterCondition.value
  }

  // 重新加载文章
  await loadMoreArticles()
}

// 重置处理
const handleReset = async () => {
  // 重置所有状态
  searchQuery.value = ''
  filterCondition.value = 1
  pageNum.value = 1
  displayedArticles.value = []
  noMoreArticles.value = false

  // 重置搜索参数
  pageParams.value = {
    categoryId: route.params.slug,
    pageNum: 1,
    pageSize: 10,
    filterCondition: 1,
    title: '',
    date: formatToLocalDate(selectedYear.value, selectedMonth.value)
  }

  // 重新加载文章
  await loadMoreArticles()
}
//#endregion

//#region Lifecycle Hooks
onMounted(() => {
  // 初始化数据
  updateYearsAndMonths()

  // 监听页面可见性变化
  document.addEventListener('visibilitychange', handleVisibilityChange)

  // 添加滚动事件监听
  if (articlesContainer.value) {
    articlesContainer.value.addEventListener('scroll', handleScroll)
  }

  // 初始加载文章
  loadArticles().then(articles => {
    if (articles && articles.length > 0) {
      displayedArticles.value = articles
    }
  })
})

onUnmounted(() => {
  document.removeEventListener('visibilitychange', handleVisibilityChange)

  // 移除滚动事件监听
  if (articlesContainer.value) {
    articlesContainer.value.removeEventListener('scroll', handleScroll)
  }
})
//#endregion

//#region Utils
// 生成年份和月份数据
const generateYearsAndMonths = () => {
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth() + 1

  // 生成最近12个月的数据
  const years = new Map()
  let year = currentYear
  let month = currentMonth

  for (let i = 0; i < 12; i++) {
    if (!years.has(year)) {
      years.set(year, {
        value: year.toString(),
        label: `${year}年`,
        months: []
      })
    }

    const yearData = years.get(year)
    yearData.months.unshift({
      value: month.toString(),
      label: `${month}月`,
      // count: Math.floor(Math.random() * 10) + 5 // 这里应该从API获取实际文章数
    })

    month--
    if (month === 0) {
      month = 12
      year--
    }
  }

  return Array.from(years.values())
}

// 更新年月数据
const updateYearsAndMonths = () => {
  const newYears = generateYearsAndMonths()
  years.value = newYears
  activeYears.value = [currentYear]
}

// 监听页面显示状态
const handleVisibilityChange = () => {
  if (document.visibilityState === 'visible') {
    const newYears = generateYearsAndMonths()
    if (JSON.stringify(years.value[0].months) !== JSON.stringify(newYears[0].months)) {
      years.value = newYears
      activeYears.value = [currentYear]
    }
  }
}
//#endregion
</script>

<style scoped>
.app-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #ffffff, #486eeb);
  color: #ffffff;
  --bg-color: rgba(28, 28, 30, 0.7);
  --bg-color-light: rgba(44, 44, 46, 0.7);
  --text-color: #ffffff;
  --text-color-secondary: rgba(235, 235, 245, 0.6);
  --border-color: rgba(84, 84, 88, 0.65);
  --accent-color: #0A84FF;
  --sidebar-width: 150px;
  --sidebar-collapsed-width: 50px;
  --header-height: 60px;
}

.glass-panel {
  background-color: var(--bg-color);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.main-layout {
  display: grid;
  grid-template-columns: auto 1fr;
  min-height: 100vh;
  gap: 1rem;
  padding: 1rem;
}

.sidebar {
  width: var(--sidebar-width);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: all 0.3s ease;
  position: relative;
}

.sidebar.collapsed {
  width: var(--sidebar-collapsed-width);
  min-width: var(--sidebar-collapsed-width);
}

.sidebar-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
}

.sidebar-header {
  display: flex;
  align-items: center;
  padding: 1rem;
}

.app-logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.year-collapse {
  border: none;
  background: transparent;
}

.year-collapse :deep(.el-collapse-item__header) {
  background: transparent;
  border: none;
  color: var(--text-color);
  font-weight: 500;
  padding: 0.5rem 0;
}

.month-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.month-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.month-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.month-item.active {
  background-color: rgba(10, 132, 255, 0.2);
  color: var(--accent-color);
}

.article-count {
  background-color: rgba(0, 47, 255, 0.1);
  padding: 0.125rem 0.5rem;
  border-radius: 1rem;
  font-size: 0.75rem;

}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.username {
  font-size: 0.875rem;
  font-weight: 500;
}

.sidebar-toggle {
  position: absolute;
  right: -20px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--accent-color);
  border-radius: 50%;
  cursor: pointer;
  z-index: 10;
  transition: all 0.3s ease;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.sidebar-toggle:hover {
  background-color: var(--accent-color);
  transform: translateY(-50%) scale(1.1);
}

.sidebar.collapsed .sidebar-toggle {
  right: -20px;
}

.content-area {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

.content-header {
  padding: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.content-header h1 {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 0;
  flex: 1;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.search-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.search-input {
  width: 240px;
}

.filter-group {
  background: var(--bg-color-light);
  padding: 0.25rem;
  border-radius: 0.5rem;
}

:deep(.el-radio-button__inner) {
  background: transparent !important;
  border: none !important;
  color: var(--text-color-secondary) !important;
  box-shadow: none !important;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: var(--accent-color) !important;
  color: white !important;
  box-shadow: none !important;
}


.articles-container {
  flex: 1;
  overflow-y: auto;
  padding-right: 0.625rem;
}

.articles-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-card {
  padding: 1.25rem;
  transition: all 0.3s ease;
}

.article-header {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.article-title {
  font-size: 1.25rem;
  font-weight: 500;
  margin: 0;
  flex: 1;
}

.article-date {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  white-space: nowrap;
}

.article-body {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.25rem;
  margin-bottom: 0.5rem;
  max-height: 200px;
  overflow: hidden;
}

.article-content {
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.article-excerpt {
  margin-right: 1rem;
  line-height: 1.6;
  color: var(--text-color-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  max-height: 9.6em;
  margin-bottom: 0.5rem;
}

.article-image {
  width: 150px;
  height: 150px;
  border-radius: 0.5rem;
  overflow: hidden;

}

.article-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.loading-more,
.no-more-articles {
  text-align: center;
  padding: 1.25rem;
  color: var(--text-color-secondary);
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: auto;
  padding-top: 0.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.article-tag {
  background-color: rgba(255, 255, 255, 0.1) !important;
  border: 1px solid rgba(255, 255, 255, 0.2) !important;
  color: var(--text-color) !important;
  font-size: 0.75rem !important;
  padding: 0 0.5rem !important;
  height: 1.5rem !important;
  line-height: 1.5rem !important;
  border-radius: 0.75rem !important;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  transition: all 0.3s ease;
}

.article-tag:hover {
  background-color: rgba(255, 255, 255, 0.2) !important;
  transform: translateY(-1px);
}
</style>