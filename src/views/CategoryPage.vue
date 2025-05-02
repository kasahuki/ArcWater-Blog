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
            <el-collapse v-model="activeYears" accordion class="year-collapse" @change="handleYearChange">
              <el-collapse-item v-for="year in years" :key="year.value" :title="year.label" :name="year.value">
                <div class="month-list">
                  <div v-for="month in year.months" :key="`${year.value}-${month.value}`" class="month-item"
                    :class="{ 'active': isMonthActive(year.value, month.value) }"
                    @click="selectMonth(year.value, month.value)">
                    <span>{{ month.label }}</span>
                    <span class="article-count"> {{}}</span>
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
        <div class="description-container glass-panel">
          <h2 class="description-title">描述：{{ category.description }}</h2>
        </div>

        <div class="articles-container" ref="articlesContainer" @scroll="handleScroll">
          <div v-infinite-scroll="loadMoreArticles" infinite-scroll-distance="100" infinite-scroll-immediate="false"
            class="articles-wrapper">
            <div v-for="article in displayedArticles" :key="article.id" :id="`article-${article.id}`"
              class="article-card glass-panel" :class="{ 'highlight': article.highlight }" ref="articleRefs"
              @click.stop="handleArticleClick(article)">
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
                    preview-teleported fit="cover" loading="lazy" class="article-img" @click.stop=''>
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
import { useRoute, useRouter } from 'vue-router'
import { categoryGetService } from '@/api/category'
import { articleListService } from '@/api/article'
//#endregion




//#region State & Variables
// 路由相关
const route = useRoute()  // Vue Router的路由实例，用于获取路由参数 返回一个包含当前路由信息的响应式 ref 对象。
const router = useRouter() //useRouter() 返回 Vue Router 的实例对象，用于进行路由操作。
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
const pageSize = ref(5)  // 每页显示的文章数量

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
    console.log('发起请求，当前页码：', pageNum.value, '每页数量：', pageSize.value)
    const response = await articleListService(pageParams.value)
    const data = response.data

    // 检查是否还有更多数据
    if (!data.result || data.result.length < pageSize.value) {
      console.log('没有更多数据了')
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

    const articles = data.result.map(article => ({
      ...article,
      tags: articleTags[Math.floor(Math.random() * articleTags.length)]
    }))

    console.log('本次加载文章数：', articles.length)
    return articles
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

  try {
    loading.value = true
    pageNum.value++
    console.log('加载更多文章，即将加载第', pageNum.value, '页')

    const newArticles = await loadArticles()
    if (newArticles && newArticles.length > 0) {
      displayedArticles.value = [...displayedArticles.value, ...newArticles]
      console.log('当前总文章数：', displayedArticles.value.length)
    }
  } catch (error) {
    console.error('加载更多文章失败:', error)
    pageNum.value-- // 加载失败时恢复页码
  } finally {
    loading.value = false
  }
}

// 重置状态并加载第一页
const resetAndLoad = async () => {
  console.log('重置状态，准备加载第一页')
  pageNum.value = 1
  displayedArticles.value = []
  noMoreArticles.value = false

  const articles = await loadArticles()
  if (articles && articles.length > 0) {
    displayedArticles.value = articles
    console.log('初始加载完成，文章数：', articles.length)
  }
}

// 选择月份
const selectMonth = async (year, month) => {
  if (selectedYear.value === year && selectedMonth.value === month) {
    return
  }

  console.log('切换月份：', year, '年', month, '月')
  selectedYear.value = year
  selectedMonth.value = month

  // // 重置并重新加载
  await resetAndLoad()

  // 滚动到顶部
  nextTick(() => {
    if (articlesContainer.value) {
      articlesContainer.value.scrollTop = 0
    }
  })
}

// 监听筛选条件变化
watch([filterCondition], async () => {
  console.log('筛选条件变化，重新加载')
  await resetAndLoad()
})


//#region Watchers
// 监听路由参数变化
watch(() => route.params.slug, async (newSlug) => {
  if (newSlug) {
    console.log('分类变化，加载新分类：', newSlug)
    // 获取新分类信息
    await getCategory(newSlug)
    // 重置状态
    searchQuery.value = ''
    filterCondition.value = 1
    selectedYear.value = currentYear
    selectedMonth.value = (new Date().getMonth() + 1).toString()
    // 重新加载文章
    await resetAndLoad()
  }
}, { immediate: true })
//#endregion

//#region Methods
// 处理年份变化
const dateMapArticleCount = ref({})
const handleYearChange = (activeNames) => {

  console.log('年份变化，当前展开的年份：', activeNames)



  // 如果年份面板被关闭，则重置为当前年份
  if (!activeNames || activeNames.length === 0) {
    activeYears.value = [currentYear]
  } else {
    activeYears.value = activeNames
  }
}

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
  console.log('执行搜索，关键词：', searchQuery.value)
  // 重置页面状态
  pageNum.value = 1
  displayedArticles.value = []
  noMoreArticles.value = false

  // 重新加载第一页
  await resetAndLoad()
}

// 重置处理
const handleReset = async () => {
  console.log('执行重置')
  // 重置所有状态
  searchQuery.value = ''
  filterCondition.value = 1
  pageNum.value = 1
  displayedArticles.value = []
  noMoreArticles.value = false

  // 重新加载第一页
  await resetAndLoad()
}

// 处理文章点击
const handleArticleClick = (article) => {

  router.push(`/article/${article.id}`)
  // 路由传递参数
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

// 处理滚动事件
const handleScroll = () => {
  if (!articlesContainer.value || loading.value || noMoreArticles.value) return

  const { scrollTop, scrollHeight, clientHeight } = articlesContainer.value
  const scrollBottom = scrollHeight - scrollTop - clientHeight

  // 当距离底部小于100px时加载更多
  if (scrollBottom < 100) {
    console.log('触发滚动加载，距离底部：', scrollBottom)
    loadMoreArticles()
  }
}
//#endregion
</script>

<style scoped>
.app-container {
  font-family: 'SF Pro Display', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  min-height: 100vh;
  width: 100%;
  background: linear-gradient(135deg, #1a1c2a, #2d3154, #31346e);
  color: #ffffff;
  --primary-color: #bcbde9;
  --primary-light: #818cf8;
  --primary-dark: #4f46e5;
  --bg-color: rgba(28, 28, 45, 0.65);
  --bg-color-light: rgba(44, 44, 66, 0.75);
  --text-color: #ffffff;
  --text-color-secondary: rgba(235, 235, 245, 0.6);
  --border-color: rgba(99, 102, 241, 0.2);
  --accent-color: #818cf8;
  --sidebar-width: 150px;
  --sidebar-collapsed-width: 50px;
  --header-height: 60px;
  letter-spacing: 0.015em;
  overflow: hidden;
  /* 防止整个容器滚动 */
}

.glass-panel {
  background: rgba(28, 28, 45, 0.65);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  border: 1px solid rgba(99, 102, 241, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.main-layout {
  display: grid;
  grid-template-columns: auto 1fr;
  height: 100vh;
  /* 使用视口高度 */
  gap: 1rem;
  padding: 1rem;
  overflow: hidden;
  /* 防止布局滚动 */
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
  background-color: rgba(99, 102, 241, 0.15);
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  color: var(--accent-color);
  font-weight: 500;
  border: 1px solid rgba(99, 102, 241, 0.2);
  transition: all 0.3s ease;
}

.month-item:hover .article-count {
  background-color: rgba(99, 102, 241, 0.25);
  border-color: rgba(99, 102, 241, 0.3);
}

.month-item.active .article-count {
  background-color: rgba(99, 102, 241, 0.3);
  border-color: rgba(99, 102, 241, 0.4);
  color: #fff;
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
  height: 100%;
  /* 占满父容器高度 */
  overflow: hidden;
  /* 防止内容区域滚动 */
}

.content-header {
  padding: 1.5rem;
  background: rgba(28, 28, 45, 0.75);
  border-bottom: 1px solid rgba(99, 102, 241, 0.2);
}

.content-header h1 {
  font-size: 1.75rem;
  font-weight: 600;
  background: linear-gradient(135deg, #fee4a9, #e63007);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.search-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(28, 28, 45, 0.4);
  padding: 0.5rem;
  border-radius: 1rem;
  border: 1px solid rgba(99, 102, 241, 0.15);
  transition: all 0.3s ease;
}

.search-group:hover {
  background: rgba(28, 28, 45, 0.6);
  border-color: rgba(99, 102, 241, 0.3);
}

.search-input {
  width: 300px;
}

.search-input :deep(.el-input__wrapper) {
  background: transparent !important;
  box-shadow: none !important;
  padding: 0 0.5rem;
}

.search-input :deep(.el-input__inner) {
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 0.95rem;
  height: 40px;
}

.search-input :deep(.el-input__inner):focus {
  border: none;
  box-shadow: none;
}

.search-input :deep(.el-input__inner)::placeholder {
  color: rgba(235, 235, 245, 0.5);
}

.filter-group {
  background: var(--bg-color-light);
  padding: 0.25rem;
  border-radius: 0.75rem;
  margin-left: auto;
  /* 将按钮组推到右边 */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* 优化按钮组的样式 */
:deep(.el-radio-button__inner) {
  background: transparent !important;
  border: 1px solid rgba(99, 102, 241, 0.3) !important;
  color: var(--text-color-secondary) !important;
  transition: all 0.3s ease;
  padding: 0.5rem 1.25rem;
  font-weight: 500;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: linear-gradient(135deg, hsl(239, 62%, 76%), #0b92a4) !important;
  color: white !important;
  border-color: transparent !important;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3);
}

.articles-container {
  flex: 1;
  overflow-y: auto;
  /* 只允许垂直滚动 */
  overflow-x: hidden;
  /* 禁止水平滚动 */
  padding-right: 0.625rem;
  height: calc(100vh - var(--header-height) - 8rem);
  /* 增加底部空间，确保分页下拉框显示 */
  position: relative;
  /* 自定义滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: rgba(40, 43, 225, 0.3) transparent;
}

/* Webkit浏览器的滚动条样式 */
.articles-container::-webkit-scrollbar {
  width: 6px;
}

.articles-container::-webkit-scrollbar-track {
  background: transparent;
}

.articles-container::-webkit-scrollbar-thumb {
  background: rgba(99, 102, 241, 0.3);
  border-radius: 3px;
}

.articles-container::-webkit-scrollbar-thumb:hover {
  background: rgba(99, 102, 241, 0.5);
}

.articles-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding-bottom: 3rem;
  /* 增加底部内边距，为分页留出更多空间 */
  min-height: 100%;
  /* 确保内容至少占满容器高度 */
}

.article-card {
  padding: 1.5rem;
  transition: all 0.3s ease;
  background: rgba(28, 28, 45, 0.65);
  border: 1px solid rgba(99, 102, 241, 0.2);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.article-card:hover {
  transform: translateY(-3px);
  background: rgba(28, 28, 45, 0.75);
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
}

.article-header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: flex-start;
  gap: 1rem;
}

.article-title {
  font-size: 1.35rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
  line-height: 1.4;
  background: linear-gradient(135deg, #fff, #818cf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.article-date {
  font-size: 0.875rem;
  color: var(--text-color-secondary);
  font-weight: 500;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
}

.click_times {
  color: var(--accent-color) !important;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  background: rgba(129, 140, 248, 0.1);
  border-radius: 1rem;
  font-size: 0.8rem;
}

.article-body {
  display: grid;
  grid-template-columns: 1fr 200px;
  gap: 1.5rem;
  min-height: 180px;
}

.article-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-excerpt {
  font-size: 0.95rem;
  line-height: 1.7;
  color: rgba(235, 235, 245, 0.85);
  font-weight: 400;
  flex: 1;
}

.article-image {
  width: 200px;
  height: 180px;
  border-radius: 1rem;
  overflow: hidden;
  position: relative;
}

.article-image :deep(.el-image) {
  width: 100%;
  height: 100%;
  transition: all 0.5s ease;
}

.article-image :deep(.el-image:hover) {
  transform: scale(1.05);
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.article-tag {
  background: rgba(99, 102, 241, 0.15) !important;
  border: 1px solid rgba(99, 102, 241, 0.3) !important;
  color: #818cf8 !important;
  font-size: 0.8rem !important;
  font-weight: 500 !important;
  padding: 0.25rem 0.75rem !important;
  border-radius: 0.75rem !important;
  transition: all 0.3s ease !important;
}

.article-tag:hover {
  background: rgba(99, 102, 241, 0.25) !important;
  border-color: rgba(99, 102, 241, 0.4) !important;
  transform: translateY(-1px);
}

.loading-more,
.no-more-articles {
  text-align: center;
  padding: 1.25rem;
  color: var(--text-color-secondary);
  font-size: 0.875rem;
  font-weight: 500;
}

/* 响应式布局调整 */
@media (max-width: 768px) {
  .article-body {
    grid-template-columns: 1fr;
  }

  .article-image {
    width: 100%;
    height: 200px;
    order: -1;
  }

  .article-header {
    grid-template-columns: 1fr;
  }

  .article-date {
    align-items: flex-start;
  }

  .search-input {
    width: 100%;
  }

  .search-group {
    flex-direction: column;
    width: 100%;
  }

  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    margin-left: 0;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .search-group {
    width: 100%;
  }

  .articles-container {
    height: calc(100vh - var(--header-height) - 10rem);
    /* 在移动端增加更多空间 */
  }
}

.description-container {
  margin: 1rem 1.5rem;
  padding: 1.25rem;
  background: rgba(35, 35, 141, 0.45);
  border: 1px solid rgba(99, 102, 241, 0.15);
  border-radius: 1rem;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.description-container:hover {
  background: rgba(44, 44, 66, 0.55);
  border-color: rgba(99, 102, 241, 0.25);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
}

.description-title {
  color: rgba(235, 235, 245, 0.9);
  font-size: 1.1rem;
  font-weight: 500;
  margin: 0;
  line-height: 1.6;
}
</style>