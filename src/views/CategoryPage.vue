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

              <!-- 文章头部信息 -->
              <div class="article-header">
                <div class="article-title-section">
                  <h2 class="article-title">{{ article.title }}</h2>
                  <div class="article-meta">
                    <div class="meta-item">
                      <el-icon class="meta-icon">
                        <Calendar />
                      </el-icon>
                      <span class="meta-text">{{ formatDate(article.updateTime) }}</span>
                    </div>
                    <div class="meta-item">
                      <el-icon class="meta-icon">
                        <View />
                      </el-icon>
                      <span class="meta-text">{{ article.clickTimes }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 文章内容区域 -->
              <div class="article-body">
                <div class="article-content">
                  <p class="article-excerpt">{{ formatExcerpt(article.content) }}</p>
                  <div class="article-tags">
                    <el-tag v-for="tag in article.tags" :key="tag" size="small" effect="plain" class="article-tag">
                      {{ tag }}
                    </el-tag>
                  </div>
                </div>

                <div class="article-image">
                  <el-image v-if="article.cover" :src="article.cover" :alt="article.title"
                    :preview-src-list="[article.cover]" preview-teleported fit="cover" loading="lazy"
                    class="article-img" @click.stop="">
                    <template #error>
                      <div class="image-error">
                        <el-icon>
                          <Picture />
                        </el-icon>
                        <span>加载失败</span>
                      </div>
                    </template>
                  </el-image>

                  <!-- 默认封面 -->
                  <div v-else class="default-cover">
                    <el-icon class="default-cover-icon">
                      <Document />
                    </el-icon>
                    <span class="default-cover-text">无封面</span>
                  </div>
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
  HomeFilled, Bell, Message, Document, Loading, Timer, RefreshRight, Calendar
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
const currentMonth = (new Date().getMonth() + 1).toString()  // 当前月份

// 从 localStorage 获取保存的日期状态，如果没有则使用当前日期
const getStoredDateState = (categoryId) => {
  try {
    const stored = localStorage.getItem(`category_date_${categoryId}`)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        year: parsed.year || currentYear,
        month: parsed.month || currentMonth,
        activeYears: parsed.activeYears || [currentYear]
      }
    }
  } catch (error) {
    console.warn('读取保存的日期状态失败:', error)
  }
  return {
    year: currentYear,
    month: currentMonth,
    activeYears: [currentYear]
  }
}

// 保存日期状态到 localStorage
const saveDateState = (categoryId, year, month, activeYears) => {
  try {
    const state = { year, month, activeYears }
    localStorage.setItem(`category_date_${categoryId}`, JSON.stringify(state))
  } catch (error) {
    console.warn('保存日期状态失败:', error)
  }
}

const years = ref([])  // 所有可选的年份数据
const activeYears = ref([currentYear])  // 当前展开的年份面板
const selectedYear = ref(currentYear)  // 当前选中的年份
const selectedMonth = ref(currentMonth)  // 当前选中的月份

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

  // 保存日期状态到 localStorage
  saveDateState(route.params.slug, year, month, activeYears.value)

  // 重置并重新加载
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

    // 从 localStorage 恢复该分类的日期状态
    const storedState = getStoredDateState(newSlug)
    selectedYear.value = storedState.year
    selectedMonth.value = storedState.month
    activeYears.value = storedState.activeYears

    // 重置其他状态
    searchQuery.value = ''
    filterCondition.value = 1

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

  // 保存展开状态到 localStorage
  saveDateState(route.params.slug, selectedYear.value, selectedMonth.value, activeYears.value)
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

  // 重置日期状态为当前日期
  selectedYear.value = currentYear
  selectedMonth.value = currentMonth
  activeYears.value = [currentYear]

  // 清除 localStorage 中保存的日期状态
  if (route.params.slug) {
    localStorage.removeItem(`category_date_${route.params.slug}`)
  }

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

  // 如果是首次加载，从 localStorage 恢复当前分类的日期状态
  if (route.params.slug) {
    const storedState = getStoredDateState(route.params.slug)
    selectedYear.value = storedState.year
    selectedMonth.value = storedState.month
    activeYears.value = storedState.activeYears
  }

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
  background: #fff;
  color: #222;
  --primary-color: #3b82f6;
  --primary-light: #93c5fd;
  --primary-dark: #2563eb;
  --bg-color: #fff;
  --bg-color-light: #f3f6fa;
  --text-color: #222;
  --text-color-secondary: #666;
  --border-color: #e5e7eb;
  --accent-color: #3b82f6;
  --sidebar-width: 150px;
  --sidebar-collapsed-width: 50px;
  --header-height: 60px;
  letter-spacing: 0.015em;
  overflow: hidden;
}

.glass-panel {
  background: #fff;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border-radius: 1.5rem;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 16px rgba(60, 100, 180, 0.06);
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
  background: #f3f6fa;
  border-bottom: 1px solid #e5e7eb;
}

.content-header h1 {
  font-size: 1.25rem;
  margin-bottom: 0.2rem;
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
  background: rgba(255, 255, 255, 0.35);
  /* Remove blur effect */
  /* backdrop-filter: blur(18px) saturate(1.5); */
  /* -webkit-backdrop-filter: blur(18px) saturate(1.5); */
  border-radius: 0.8rem;
  border: 1px solid #f0f1f3;
  box-shadow: 0 1px 6px rgba(60, 100, 180, 0.04);
  padding: 0.3rem 0.7rem;
  gap: 0.5rem;
  display: flex;
  align-items: center;
  transition: box-shadow 0.25s, transform 0.25s, background 0.3s, border-color 0.3s;
}

.search-group:hover {
  /* Only keep transform, remove any blur effect */
  transform: translateY(-2px) scale(1.03);
}

.search-input {
  width: 150px;
}

.search-input :deep(.el-input__wrapper) {
  background: #fff !important;
  border-radius: 0.7rem !important;
  border: none !important;
  box-shadow: none !important;
  padding: 0 0.7rem !important;
  transition: box-shadow 0.2s, background 0.2s;
}

.search-input :deep(.el-input__wrapper):hover,
.search-input :deep(.el-input__wrapper):focus {
  background: rgba(255, 255, 255, 0.7) !important;
  box-shadow: 0 2px 8px rgba(60, 100, 180, 0.10) !important;
}

.search-input :deep(.el-input__inner) {
  background: transparent !important;
  border: none !important;
  color: #222 !important;
  font-size: 0.95rem;
  height: 36px;
  box-shadow: none !important;
}

.search-input :deep(.el-input__inner)::placeholder {
  color: #bbb !important;
  opacity: 1;
}

.filter-group {
  background: transparent;
  padding: 0;
  border-radius: 0.75rem;
  margin-left: auto;
  box-shadow: none;
}

:deep(.el-radio-button__inner) {
  background: transparent !important;
  border: none !important;
  color: var(--text-color-secondary) !important;
  transition: all 0.3s ease;
  padding: 0.4rem 0.9rem;
  font-weight: 500;
  box-shadow: none !important;
}

:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background: #eaf6fb !important;
  color: #2563eb !important;
  border: none !important;
  box-shadow: none !important;
}

.search-group .el-button,
.search-group .el-button:focus,
.search-group .el-button:hover,
.search-group .el-button:active {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  color: #2563eb !important;
  /* 可自定义主色 */
  transition: none !important;
  font-size: 1rem !important;
  /* 保持按钮字体大小不变 */
}

.search-group .el-button.is-primary {
  background: transparent !important;
  color: #2563eb !important;
  font-size: 1rem !important;
  /* 保持按钮字体大小不变 */
}

.search-group .el-button:hover {
  color: #1d4ed8 !important;
  background: #f5f7fa !important;
  font-size: 1rem !important;
  /* 保持按钮字体大小不变 */
}

.search-group .el-button,
.search-group .el-input__wrapper {
  height: 36px !important;
  min-height: 36px !important;
  line-height: 36px !important;
}

.articles-container {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 0.625rem;
  height: calc(100vh - var(--header-height) - 8rem);
  position: relative;
  scrollbar-width: thin;
  scrollbar-color: #c3cfe2 transparent;
}

.articles-container::-webkit-scrollbar {
  width: 6px;
}

.articles-container::-webkit-scrollbar-track {
  background: transparent;
}

.articles-container::-webkit-scrollbar-thumb {
  background: #c3cfe2;
  border-radius: 3px;
}

.articles-container::-webkit-scrollbar-thumb:hover {
  background: #93c5fd;
}

.articles-wrapper {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  padding-bottom: 1.2rem;
  min-height: 100%;
}

.article-card {
  padding: 1.5rem;
  border-radius: 1rem;
  background: #fff;
  border: 1px solid #f1f5f9;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.article-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  border-color: #e2e8f0;
}

.article-card:hover::before {
  transform: scaleX(1);
}

.article-header {
  margin-bottom: 1rem;
}

.article-title-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.article-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.4;
  margin: 0;
  letter-spacing: -0.025em;
  transition: color 0.2s ease;
}

.article-card:hover .article-title {
  color: #3b82f6;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
}

.meta-icon {
  font-size: 1rem;
  color: #94a3b8;
  transition: color 0.2s ease;
}

.meta-text {
  font-weight: 500;
  letter-spacing: 0.025em;
}

.article-card:hover .meta-icon {
  color: #3b82f6;
}

.article-body {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1.5rem;
  align-items: start;
}

.article-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.article-excerpt {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #475569;
  margin: 0;
  font-weight: 400;
  letter-spacing: 0.01em;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.article-tag {
  font-size: 0.75rem !important;
  padding: 0.25rem 0.75rem !important;
  border-radius: 1rem !important;
  font-weight: 500 !important;
  background: #f8fafc !important;
  border: 1px solid #e2e8f0 !important;
  color: #64748b !important;
  transition: all 0.2s ease !important;
}

.article-tag:hover {
  background: #3b82f6 !important;
  color: white !important;
  border-color: #3b82f6 !important;
  transform: translateY(-1px);
}

.article-image {
  width: 140px;
  height: 100px;
  border-radius: 0.75rem;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  background: #f8fafc;
}

.article-card:hover .article-image {
  transform: scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.article-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  display: block;
}

.article-card:hover .article-img {
  transform: scale(1.1);
}

.image-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #94a3b8;
  font-size: 0.875rem;
  gap: 0.5rem;
}

.default-cover {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border: 2px dashed #cbd5e1;
  border-radius: 0.75rem;
  color: #64748b;
  transition: all 0.3s ease;
}

.article-card:hover .default-cover {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  border-color: #3b82f6;
  color: #3b82f6;
}

.default-cover-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.7;
}

.default-cover-text {
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0.8;
}

/* 响应式布局调整 */
@media (max-width: 768px) {
  .article-card {
    padding: 1.25rem;
  }

  .article-body {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .article-image {
    width: 100%;
    height: 140px;
  }

  .article-meta {
    gap: 1rem;
  }

  .article-title {
    font-size: 1.125rem;
  }
}

.loading-more,
.no-more-articles {
  text-align: center;
  padding: 2rem;
  color: #64748b;
  font-size: 0.875rem;
  font-weight: 500;
  background: #f8fafc;
  border-radius: 0.75rem;
  border: 1px solid #e2e8f0;
  margin-top: 1rem;
}

.loading-more {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
}

.loading-more .el-icon {
  font-size: 1.25rem;
  color: #3b82f6;
}

.description-container {
  max-width: 320px;
  min-width: 120px;
  padding: 0.5rem 0.8rem;
  margin: 0.3rem 0 0.3rem 1.2rem;
}

.description-title {
  font-size: 0.85rem;
}
</style>