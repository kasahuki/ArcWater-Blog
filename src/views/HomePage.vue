<template>
  <div class="home-container">
    <!-- 欢迎横幅
    <div class="welcome-banner gradient-bg">
      <h1>Arc Water</h1>
      <p>LET'S MAKE IT HAPPEN!</p>
    </div> -->

    <div class="home-cover">
      <HomeCover></HomeCover>
      <ImgDescLayout style="border-top: 1px solid #e0e0e0; padding:5rem;" :images="images" :title="'How It Works?'"
        :intro="intro" :list="list"></ImgDescLayout>
      <div class="server-anime">
        <ServerAnime style="margin-left: 1rem;"></ServerAnime>
        <div class="server-anime-content">
          <h2 class="choose-title ">Why choose ArcWater?</h2>
          <p class="choose-desc">
            Inspired by ArcWater, a creative space where you can explore different content fields.
          </p>
          <ul class="choose-list">
            <li><span class="choose-strong">Technology Posts</span> : Explore the latest <span
                class="highlight">technology</span> trends and insights.
            </li>
            <li><span class="choose-strong">Music</span> : Discover the latest <span class="highlight">music</span>
              trends and insights.
            </li>
            <li><span class="choose-strong">Experience & Journey</span> : Share your <span class="highlight">experiences
                and journey</span>
              with us.
            </li>
            <li><span class="choose-strong">Resource & Tools </span> : Find and Use the helpful <span
                class="highlight">resources and tools</span>.
            </li>
            <li style="margin-left: 18rem;margin-top: 1rem;">
              <WaterButton :scale="0.8"></WaterButton>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- 推荐文章轮播 -->
    <div class="section-container">
      <SectionTitle title="Comment" />
      <div class="carousel-container">
        <button class="carousel-arrow left" @click="prevSlide">
          <svg width="32" height="32" viewBox="0 0 24 24">
            <path d="M15 19l-7-7 7-7" stroke="#007aff" stroke-width="2" fill="none" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
        <div class="carousel-track" style="width: 900px; display: flex; justify-content: center; align-items: center;">
          <div class="carousel-slide" v-for="(article, idx) in featuredArticles.slice(currentSlide, currentSlide + 3)"
            :key="article.id" :class="{ left: idx === 0, right: idx === 2 }" :style="get3DStyle(idx)">
            <router-link :to="`/article/${article.id}`" class="article-link">
              <div class="article-card">
                <div class="image-wrapper">
                  <img :src="article.cover" class="article-image" alt="" />
                  <div class="image-overlay"></div>
                </div>
                <div class="card-content">
                  <div class="article-meta">
                    <el-tag size="small" effect="plain" type="primary">{{ categoryIdMapName[article.categoryId]
                      }}</el-tag>
                  </div>
                  <h4 class="article-title">{{ article.title }}</h4>
                  <p class="article-desc">{{ truncateContent(article.content) }}</p>
                  <div class="article-info">
                    <div class="info-item time">
                      <svg class="icon" viewBox="0 0 24 24">
                        <path
                          d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.2-4.5-2.7V7z" />
                      </svg>
                      <span>{{ dayjs(article.updateTime).format('YYYY-MM-DD HH:mm') }}</span>
                    </div>
                    <div class="info-item views">
                      <svg class="icon" viewBox="0 0 24 24">
                        <path
                          d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zM12 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
                      </svg>
                      <span>{{ formatNumber(article.clickTimes) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <button class="carousel-arrow right" @click="nextSlide">
          <svg width="32" height="32" viewBox="0 0 24 24">
            <path d="M9 5l7 7-7 7" stroke="#007aff" stroke-width="2" fill="none" stroke-linecap="round"
              stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </div>

    <!-- 文章分类 -->
    <div class="section-container category-section">
      <!-- Apple风格三点菜单 -->
      <div class="apple-three-dots">
        <div class="dot dot-1" @click="openFilterPanel" @mouseenter="showTooltip('filter')" @mouseleave="hideTooltip">
          <div class="tooltip" v-if="activeTooltip === 'filter'">分类筛选</div>
        </div>
        <div class="dot dot-2" @click="toggleViewMode" @mouseenter="showTooltip('view')" @mouseleave="hideTooltip">
          <div class="tooltip" v-if="activeTooltip === 'view'">视图切换</div>
        </div>
        <div class="dot dot-3" @click="toggleAutoScroll" @mouseenter="showTooltip('settings')"
          @mouseleave="hideTooltip">
          <div class="tooltip" v-if="activeTooltip === 'settings'">自动滚动</div>
        </div>
      </div>

      <!-- 分类筛选面板 -->
      <div class="filter-panel" v-if="showFilterPanel" @click.self="closeFilterPanel">
        <div class="filter-content">
          <div class="filter-header">
            <h3>分类筛选</h3>
            <button class="close-btn" @click="closeFilterPanel">×</button>
          </div>
          <div class="filter-options">
            <div class="filter-group">
              <label>文章数量</label>
              <div class="filter-buttons">
                <button>全部</button>
                <button>10+篇</button>
                <button>5-10篇</button>
              </div>
            </div>
            <div class="filter-group">
              <label>排序方式</label>
              <div class="filter-buttons">
                <button>按名称</button>
                <button>按数量</button>
                <button>按更新</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 视图切换指示器 -->
      <div class="view-mode-indicator" v-if="showViewMode">
        <div class="view-mode-content">
          <span>{{ viewMode === 'grid' ? '网格视图' : '列表视图' }}</span>
        </div>
      </div>

      <div class="section-header">
        <div class="category-title-wrapper">
          <div class="category-header-content">
            <div class="category-title-text">
              <SectionTitle title="Category" />
              <div class="category-subtitle">探索不同的内容领域</div>
            </div>
            <img src="/src/assets/image/category.svg" alt="Music Icon" class="category-music-icon" />
          </div>
        </div>
      </div>
      <div class="category-display" :class="viewMode">
        <!-- 网格模式 -->
        <div class="category-grid-container" v-if="viewMode === 'grid'">
          <div class="category-grid" ref="gridContainer">
            <div v-for="category in categories" :key="category.id" class="grid-item">
              <router-link :to="`/category/${category.id}`" class="grid-link">
                <div class="grid-card">
                  <!-- 右上角三角形文章数量 -->
                  <div class="triangle-corner">
                    <span class="article-number">{{ category.articleCount }}篇</span>
                  </div>
                  <div class="grid-content">
                    <div class="folder-icon">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path
                          d="M20 6h-8l-2-2H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" />
                      </svg>
                    </div>
                    <h3>{{ category.categoryName }}</h3>
                    <p class="grid-desc">{{ category.description }}</p>
                  </div>
                </div>
              </router-link>
            </div>
          </div>
        </div>

        <!-- 列表模式 -->
        <div class="category-slider" v-else>
          <div class="category-container" ref="categoryContainer" @scroll="handleScroll" @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave">
            <router-link v-for="category in categories" :key="category.id" :to="`/category/${category.id}`"
              class="category-item">
              <div class="category-card">
                <div class="category-content">
                  <h3>{{ category.categoryName }}</h3>
                  <p class="category-desc">{{ category.description }}</p>
                  <span class="article-count">{{ category.articleCount }} 篇文章</span>
                </div>
              </div>
            </router-link>
          </div>
        </div>
        <!-- 自定义音符滑块 -->
        <div class="music-slider-container">
          <div class="music-icon">
            <svg viewBox="0 0 24 24" class="music-note">
              <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
            </svg>
          </div>
          <div class="slider-track" ref="sliderTrack" @mousedown="handleTrackClick">
            <div class="slider-handle" :style="{ left: scrollProgress + '%' }" @mousedown.stop="handleSliderMouseDown">
              <div class="handle-dot"></div>
            </div>
          </div>
        </div>
      </div>
    </div>


  </div>

  <!-- 音乐区域 - 占满全宽的Apple蓝色背景 -->
  <div class="music-section-fullwidth">
    <div class="home-container">

      <div class="flexbox" style="margin-top: 2.5rem;">

        <img src="/src/assets/image/music.svg" alt="" class="music-image" width="300">
        <div class="flexbox-col">
          <FloatCards>
          </FloatCards>
        </div>
      </div>

    </div>
  </div>



  <!-- 时间轴和图片窗口部分 -->
  <div class="timeline-section">
    <div class="home-container">
      <div class="timeline-title-wrapper">
        <div class="WaterTitle timeline-main-title">Journey Timeline</div>
        <div class="timeline-subtitle">探索我们的发展历程</div>
      </div>

      <div class="timeline-container">
        <!-- 时间轴 -->
        <div class="timeline">
          <div class="timeline-item" v-for="(item, index) in timelineData" :key="index"
            :class="{ 'active': activeTimelineIndex === index }" @click="selectTimelineItem(index)">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
              <div class="timeline-layout">
                <div class="timeline-text">
                  <h3 class="timeline-title">{{ item.title }}</h3>
                  <p class="timeline-date">{{ item.date }}</p>
                  <p class="timeline-description">{{ item.description }}</p>
                </div>
                <div class="timeline-image">
                  <img :src="item.image" :alt="item.title" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 电脑背景和Logo覆盖 -->
  <div class="computer-logo-section">
    <!-- 悬浮图标组 -->
    <div class="floating-icons-container">
      <div class="floating-code-icon">
        <img src="/src/assets/image/code.svg" alt="" class="code-balloon">
      </div>
      <div class="floating-todo-icon">
        <img src="/src/assets/image/todo.svg" alt="" class="todo-balloon">
      </div>
      <div class="floating-myfile-icon">
        <img src="/src/assets/image/myfile.svg" alt="" class="myfile-balloon">
      </div>
      <div class="floating-bookhand-icon">
        <img src="/src/assets/image/bookhand.svg" alt="" class="bookhand-balloon">
      </div>
    </div>
    <div class="computer-background">
      <img src="/src/assets/image/computer.png" alt="Computer Background" class="computer-image" />
      <!-- 电脑屏幕内容整体包装 -->
      <div class="pc-screen-content">
        <img src="/src/assets/image/arcwater_logo.png" alt="ArcWater Logo" class="logo-image" />
        <div class="arcwater-title">ArcWater</div>
        <div class="screen-btns pc-btns">
          <button class="screen-btn">登录</button>
          <button class="screen-btn">注册</button>
        </div>
      </div>
      <!-- 手机屏幕内容整体包装 -->
      <div class="mobile-screen-content">


        <div class="arcwater-title mobile-title">
          <img src="/src/assets/image/arcwater_logo.png" alt="ArcWater Logo" class="logo-image mobile-logo" />
          <span>ArcWater</span>
        </div>
        <div class="screen-btns mobile-btns">
          <button class="screen-btn">
            <span class="btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 21h16" stroke="#fff" stroke-width="2" stroke-linecap="round"
                  stroke-linejoin="round" />
              </svg>
            </span>
            App下载
          </button>
          <button class="screen-btn">
            <span class="btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="6" height="6" rx="1.5" stroke="#fff" stroke-width="2" />
                <rect x="15" y="3" width="6" height="6" rx="1.5" stroke="#fff" stroke-width="2" />
                <rect x="3" y="15" width="6" height="6" rx="1.5" stroke="#fff" stroke-width="2" />
                <path d="M15 15h2v2h-2v-2z" fill="#fff" />
                <path d="M19 19h2v2h-2v-2z" fill="#fff" />
                <path d="M15 19h2v2h-2v-2z" fill="#fff" />
                <path d="M19 15h2v2h-2v-2z" fill="#fff" />
              </svg>
            </span>
            扫码登录
          </button>
        </div>
      </div>
    </div>
  </div>


  <div class="home-container">
    <div class="flexbox" style="margin-bottom: 10rem; border-top: 1px solid #e0e0e0; padding-top: 1rem;">
      <ImageCard :url="url" />
      <div class="profile" style="display: flex;flex-direction: column;">
        <div class="profile-item" style="margin-left: 1rem;margin-top: 5rem;">
          <div class="WaterTitle">ArcWater</div>
          <div class="profile-item-content">
            Welcome to <span class="highlight">ArcWater</span>, a creative space where <span
              class="highlight">technology</span> meets <span class="highlight">art</span>. Here you'll find
            insightful
            articles,
            <span class="highlight">music</span> recommendations, and a collection of digital <span
              class="highlight">artifacts</span>. Join me on this journey of <span class="highlight">exploration</span>
            and
            <span class="highlight">discovery</span> in the digital realm.
          </div>
          <div class="more-button">
            <MoreButton>More</MoreButton>
          </div>
        </div>
      </div>
    </div>
  </div>





</template>

<script setup>
import ImageCard from '@/components/ImageCard.vue'
import FloatCards from '../components/FloatCards.vue'
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
import WaterButton from '@/components/WaterButton.vue'
import HomeCover from '@/components/HomeCover.vue'
import { hotArticleService } from '@/api/article'
import SectionTitle from '@/components/SectionTitle.vue'
import dayjs from 'dayjs'
import { useCategoryStore } from '@/stores/categoryStore'
import img from '@/assets/image/arcwater_logo.png'
import MoreButton from '@/components/MoreButton.vue'
import ServerAnime from '@/components/ServerAnime.vue'
import ImgDescLayout from '@/components/ImgDescLayout.vue'
// ImgDescLayout模拟数据
const images = ref([
  '/src/assets/image/tech.jpg',
  '/src/assets/image/note.jpg',
  '/src/assets/image/music.jpg',

])
const intro = ref('ArcWater makes content exploration simple and fun. Three steps to easily experience the fusion of technology, music, and growth.')
const list = ref([
  '<b>Choose Domain</b> : Browse content categories that interest you',
  '<b>Discover Excellence</b> : Read curated articles and resources',
  '<b>Engage & Interact</b> : Join discussions and share your insights',
  '<b>Join Community</b> : Connect with like-minded people and grow together'
])
const url = ref(img)
const categoryStore = useCategoryStore()
// 时间轴相关数据
const activeTimelineIndex = ref(0)
const timelineData = ref([
  {
    title: "项目启动",
    date: "2024年1月",
    description: "ArcWater项目正式启动，开始构思和设计",
    image: "/src/assets/image/arcwater_logo.png"
  },
  {
    title: "技术选型",
    date: "2024年2月",
    description: "选择Vue3 + Element Plus作为主要技术栈",
    image: "/src/assets/image/linuxDo.png"
  },
  {
    title: "核心功能开发",
    date: "2024年3月",
    description: "完成文章管理、音乐播放等核心功能",
    image: "/src/assets/image/piano.png"
  },
  {
    title: "UI/UX优化",
    date: "2024年4月",
    description: "优化用户界面，提升用户体验",
    image: "/src/assets/image/water.png"
  },
  {
    title: "上线发布",
    date: "2024年5月",
    description: "项目正式上线，开始收集用户反馈",
    image: "/src/assets/image/arcwater_logo.png"
  }
])

// 选择时间轴项目
const selectTimelineItem = (index) => {
  activeTimelineIndex.value = index
}

// 响应式状态声明
const featuredArticles = ref([])
const categories = ref([])
const categoryContainer = ref(null)
const sliderTrack = ref(null)
const isDragging = ref(false)
const startX = ref(0)
const startScrollLeft = ref(0)
const scrollProgress = ref(0)
const categoryIdMapName = ref({})

// 自动滚动相关配置
const isAutoScrolling = ref(true)
const SCROLL_STEP = 3
const SCROLL_INTERVAL = 40
let autoScrollTimer = null

// 格式化工具函数
const formatNumber = (number) => {
  if (number === undefined || number === null) {
    return '0'
  }
  const num = Number(number)
  if (isNaN(num)) {
    return '0'
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(2) + 'M'
  } else if (num >= 10000) {
    return (num / 1000).toFixed(2) + 'K'
  } else {
    return num.toString()
  }
}

const truncateContent = (content) => {
  if (!content) return ''
  const maxLength = 100
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength) + '...'
}

// 数据加载函数
const loadCategories = async () => {
  categories.value = categoryStore.categories
  categories.value.forEach(category => {
    categoryIdMapName.value[category.id] = category.categoryName
  })
}

const getHotArticles = async () => {
  try {
    const response = await hotArticleService(10)
    if (response.data) {
      featuredArticles.value = response.data.map(article => ({
        ...article,
        clickTimes: article.clickTimes || 0
      }))
    }
  } catch (error) {
    console.error('获取热门文章失败:', error)
    featuredArticles.value = []
  }
}

// 自动滚动相关函数
const autoScroll = () => {
  if (!categoryContainer.value || !isAutoScrolling.value) return

  const container = categoryContainer.value
  const maxScroll = container.scrollWidth - container.clientWidth

  if (container.scrollLeft >= maxScroll) {
    container.scrollLeft = 0
  } else {
    container.scrollLeft += SCROLL_STEP
  }
}

const startAutoScroll = () => {
  isAutoScrolling.value = true
  if (!autoScrollTimer) {
    autoScrollTimer = setInterval(autoScroll, SCROLL_INTERVAL)
  }
}

const stopAutoScroll = () => {
  isAutoScrolling.value = false
  if (autoScrollTimer) {
    clearInterval(autoScrollTimer)
    autoScrollTimer = null
  }
}

// 滑块控制相关函数
const handleSliderMouseDown = (e) => {
  if (!categoryContainer.value) return
  stopAutoScroll()
  isDragging.value = true
  startX.value = e.clientX
  startScrollLeft.value = categoryContainer.value.scrollLeft

  document.addEventListener('mousemove', handleSliderMouseMove)
  document.addEventListener('mouseup', handleSliderMouseUp)
  e.preventDefault()
}

const handleSliderMouseMove = (e) => {
  if (!isDragging.value || !categoryContainer.value || !sliderTrack.value) return

  const container = categoryContainer.value
  const track = sliderTrack.value
  const trackRect = track.getBoundingClientRect()
  const scrollWidth = container.scrollWidth - container.clientWidth

  const percent = (e.clientX - trackRect.left) / trackRect.width
  const targetScroll = scrollWidth * Math.max(0, Math.min(1, percent))

  container.scrollLeft = targetScroll
}

const handleSliderMouseUp = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', handleSliderMouseMove)
  document.removeEventListener('mouseup', handleSliderMouseUp)
  // 不再自动恢复滚动
}

const handleTrackClick = (e) => {
  if (!categoryContainer.value || !sliderTrack.value || isDragging.value) return

  const container = categoryContainer.value
  const track = sliderTrack.value
  const trackRect = track.getBoundingClientRect()
  const scrollWidth = container.scrollWidth - container.clientWidth

  const percent = (e.clientX - trackRect.left) / trackRect.width
  container.scrollLeft = scrollWidth * Math.max(0, Math.min(1, percent))
}

// 滚动事件处理
const handleScroll = (e) => {
  const container = e.target
  const scrollWidth = container.scrollWidth - container.clientWidth
  if (scrollWidth > 0) {
    scrollProgress.value = (container.scrollLeft / scrollWidth) * 100
  }
}

// 鼠标事件处理
const handleMouseEnter = () => {
  // 不做任何事
}

const handleMouseLeave = () => {
  // 不做任何事
}

// 生命周期钩子
onMounted(() => {
  loadCategories()
  getHotArticles()
  startAutoScroll()
})

onBeforeUnmount(() => {
  stopAutoScroll()
})

const currentSlide = ref(0)
const articlesPerSlide = 3
const totalSlides = computed(() => Math.max(1, featuredArticles.value.length - 2))
const shuffling = ref(false)
const prevSlide = () => {
  currentSlide.value = (currentSlide.value - 1 + totalSlides.value) % totalSlides.value
}
const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % totalSlides.value
}
const goToSlide = (idx) => {
  currentSlide.value = idx
}

// 三点菜单相关状态
const showFilterPanel = ref(false)
const showViewMode = ref(false)
const viewMode = ref(localStorage.getItem('arcwater_view_mode') || 'list') // 默认列表视图，优先取本地存储
const activeTooltip = ref(null)

// 三点菜单功能函数
const openFilterPanel = () => {
  showFilterPanel.value = true
}

const closeFilterPanel = () => {
  showFilterPanel.value = false
}

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid'
  localStorage.setItem('arcwater_view_mode', viewMode.value)
  showViewMode.value = true
  setTimeout(() => {
    showViewMode.value = false
  }, 2000)
}

// 悬浮提示功能
const showTooltip = (type) => {
  activeTooltip.value = type
}

const hideTooltip = () => {
  activeTooltip.value = null
}

// 设置面板功能
const toggleAutoScroll = () => {
  isAutoScrolling.value = !isAutoScrolling.value
  if (isAutoScrolling.value) {
    startAutoScroll()
  } else {
    stopAutoScroll()
  }
}


function get3DStyle(idx) {
  // idx: 0,1,2 代表窗口内的左中右
  if (idx === 0) {
    return {
      opacity: 1,
      pointerEvents: 'auto',
      transform: 'scale(0.92) translateZ(-40px) rotateY(18deg)',
      zIndex: 2,
      transition: 'all 0.5s cubic-bezier(.4,0,.2,1)'
    }
  } else if (idx === 1) {
    return {
      opacity: 1,
      pointerEvents: 'auto',
      transform: 'scale(1.05) translateZ(0px) rotateY(0deg)',
      zIndex: 3,
      boxShadow: '0 8px 32px rgba(0,122,255,0.18)',
      transition: 'all 0.5s cubic-bezier(.4,0,.2,1)'
    }
  } else if (idx === 2) {
    return {
      opacity: 1,
      pointerEvents: 'auto',
      transform: 'scale(0.92) translateZ(-40px) rotateY(-18deg)',
      zIndex: 2,
      transition: 'all 0.5s cubic-bezier(.4,0,.2,1)'
    }
  } else {
    return { opacity: 0, pointerEvents: 'none', display: 'none' }
  }
}
</script>

<style scoped>
.home-cover {
  display: flex;
  flex-direction: column;
  gap: 7rem;

}

.server-anime {
  position: relative;
  z-index: 1;
  /* 内容宽度和原来一样，不加width:100vw */
  height: 40rem;
  display: flex;
  padding: 0;
  gap: 18rem;
  /* 其余样式 */
}

.server-anime::before {
  content: '';
  position: absolute;
  z-index: -1;
  left: 50%;
  top: 0;
  width: 100vw;
  height: 100%;
  background: #021132;
  transform: translateX(-50%);
  pointer-events: none;
  /* 不影响内容交互 */

}

.server-anime-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* 让高度和 ServerAnime 一样高 */
  height: 100%;
  padding: 32px 40px;
  box-sizing: border-box;
}



.choose-title {
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 1.2rem;
  color: #FF9900;
  letter-spacing: 0.01em;
}

.choose-desc {
  font-size: 1.05rem;
  color: #e0e0e0;
  margin-bottom: 1.5rem;
  line-height: 1.7;
}

.choose-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}

.choose-list li {
  font-size: 1.08rem;
  color: #fff;
  line-height: 1.6;
  font-weight: 500;
}

.choose-strong {
  font-weight: 700;
  color: #fff;
  /* 可加渐变或主色 */
}

.GlodenTitle,
.WaterTitle {
  font-family: -apple-system, SF Pro Display, sans-serif;
  font-weight: 600;
  background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
  -webkit-background-clip: text;
  color: transparent;
  margin: 48px 0;
  padding: 0 20px;
}

.flexbox {
  display: flex;
  justify-content: space-between;
  margin-bottom: 5rem;
  gap: 4rem;
  width: 100%;


}

.flexbox-col {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  justify-content: space-between;
}

.profile-container {
  width: 80%;
  margin: 0 auto;

}

.home-container {
  width: 1300px;
  margin: 0 auto;
  padding: 0 20px;
}


.welcome-banner {
  padding: 40px;
  text-align: center;
  margin-bottom: 30px;
}

.welcome-banner h1 {
  font-size: 2rem;
  margin-bottom: 10px;
}

.section-container {
  margin: 128px 0;
}

.section-title {
  position: relative;
  margin-bottom: 32px;
  display: flex;
  align-items: center;
}

.section-title .title-text {
  font-family: -apple-system, SF Pro Display, sans-serif;
  font-size: 24px;
  font-weight: 600;
  background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
  -webkit-background-clip: text;
  color: transparent;
  margin-right: 16px;
}

.section-title .title-decoration {
  flex: 1;
  height: 2px;
  background: linear-gradient(to right,
      var(--el-color-primary-light-5),
      transparent);
}

.article-link {
  text-decoration: none;
  display: block;

  height: 100%;
}

.article-card {
  background: var(--el-bg-color);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.article-card:hover .article-image {
  transform: scale(1.05);
}

.article-card:hover .image-overlay {
  opacity: 0.3;
}

.image-wrapper {
  position: relative;
  padding-top: 56.25%;
  overflow: hidden;
}

.article-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom,
      transparent 0%,
      rgba(0, 0, 0, 0.2) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-content {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.article-meta {
  margin-bottom: 16px;
}

.article-title {
  font-family: -apple-system, SF Pro Text, sans-serif;
  font-size: 20px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 12px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-desc {
  color: var(--el-text-color-secondary);
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  flex: 1;
}

.article-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.info-item .icon {
  width: 16px;
  height: 16px;
  fill: currentColor;
}

.info-item.time {
  color: var(--el-text-color-secondary);
}

.info-item.views {
  color: var(--el-color-primary);
  font-weight: 500;
}

.section-header {
  padding: 0 40px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
}

.category-section {
  position: relative;
  padding: 60px 0;
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 50%, #f0f8ff 100%);
  margin: 10rem 0;
  overflow: hidden;
}

/* Category区域背景装饰 */
.category-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 30% 20%, rgba(0, 122, 255, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 70% 80%, rgba(88, 86, 214, 0.06) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(255, 45, 146, 0.04) 0%, transparent 50%);
  z-index: 1;
}

.category-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    linear-gradient(45deg, transparent 30%, rgba(0, 122, 255, 0.03) 50%, transparent 70%);
  z-index: 1;
}

/* Apple风格三点菜单 */
.apple-three-dots {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  gap: 6px;
  z-index: 10;
  padding: 8px;
  border-radius: 20px;
  transition: all 0.3s ease;
}


.dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  position: relative;
  transition: all 0.3s ease;
}

.dot::before {
  content: '';
  position: absolute;
  top: 1px;
  left: 1px;
  right: 1px;
  bottom: 1px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  z-index: 1;
}

.dot-1 {
  background: linear-gradient(135deg, #ff6b6b, #ff8e8e);
  box-shadow:
    0 2px 4px rgba(255, 107, 107, 0.3),
    0 0 0 1px rgba(255, 107, 107, 0.2) inset,
    0 1px 2px rgba(255, 255, 255, 0.8) inset;
  transform: translateZ(2px);
}

.dot-2 {
  background: linear-gradient(135deg, #4ecdc4, #6ee7df);
  box-shadow:
    0 2px 4px rgba(78, 205, 196, 0.3),
    0 0 0 1px rgba(78, 205, 196, 0.2) inset,
    0 1px 2px rgba(255, 255, 255, 0.8) inset;
  transform: translateZ(1px);
}

.dot-3 {
  background: linear-gradient(135deg, #45b7d1, #67c7e1);
  box-shadow:
    0 2px 4px rgba(69, 183, 209, 0.3),
    0 0 0 1px rgba(69, 183, 209, 0.2) inset,
    0 1px 2px rgba(255, 255, 255, 0.8) inset;
  transform: translateZ(0px);
}

.apple-three-dots:hover .dot {
  transform: translateZ(4px);
}

.apple-three-dots:hover .dot-1 {
  background: linear-gradient(135deg, #ff5252, #ff7676);
  box-shadow:
    0 3px 6px rgba(255, 82, 82, 0.4),
    0 0 0 1px rgba(255, 82, 82, 0.3) inset,
    0 2px 4px rgba(255, 255, 255, 0.9) inset;
}

.apple-three-dots:hover .dot-2 {
  background: linear-gradient(135deg, #26d0ce, #4dd8d6);
  box-shadow:
    0 3px 6px rgba(38, 208, 206, 0.4),
    0 0 0 1px rgba(38, 208, 206, 0.3) inset,
    0 2px 4px rgba(255, 255, 255, 0.9) inset;
}

.apple-three-dots:hover .dot-3 {
  background: linear-gradient(135deg, #29b6f6, #4fc3f7);
  box-shadow:
    0 3px 6px rgba(41, 182, 246, 0.4),
    0 0 0 1px rgba(41, 182, 246, 0.3) inset,
    0 2px 4px rgba(255, 255, 255, 0.9) inset;
}

/* Category区域浮动装饰元素 */
.category-section .section-container::before {
  content: '';
  position: absolute;
  top: 15%;
  right: 15%;
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, rgba(0, 122, 255, 0.1), rgba(88, 86, 214, 0.1));
  border-radius: 50%;
  z-index: 1;
  animation: float-category 8s ease-in-out infinite;
}

.category-section .section-container::after {
  content: '';
  position: absolute;
  bottom: 25%;
  left: 10%;
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, rgba(255, 45, 146, 0.08), rgba(255, 149, 0, 0.08));
  border-radius: 12px;
  z-index: 1;
  animation: float-category 10s ease-in-out infinite reverse;
}

@keyframes float-category {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-25px) rotate(180deg);
  }
}

/* Category标题样式 */
.category-title-wrapper {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
  z-index: 2;
}

.category-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 600px;
  margin: 0 auto 1rem auto;
  position: relative;
}

.category-music-icon {
  margin-left: 100px;
  width: 120px;
  height: 120px;
  opacity: 0.8;
  filter: drop-shadow(0 2px 8px rgba(0, 122, 255, 0.2));
  transition: all 0.3s ease;
  animation: float-music 4s ease-in-out infinite;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .category-header-content {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .category-title-text {
    align-items: center;
  }

  .category-music-icon {
    width: 70px;
    height: 70px;
  }

  .apple-three-dots {
    top: 15px;
    right: 15px;
    padding: 6px;
    gap: 4px;
  }

  .dot {
    width: 6px;
    height: 6px;
  }
}

.category-music-icon:hover {
  opacity: 1;
  transform: scale(1.1);
  filter: drop-shadow(0 4px 12px rgba(0, 122, 255, 0.3));
}

@keyframes float-music {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-8px);
  }
}

.category-title-text {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  flex: 1;
}

.category-subtitle {
  font-size: 1.1rem;
  color: #86868b;
  font-weight: 400;
  letter-spacing: 0.5px;
  margin-top: 0.5rem;
}

.category-slider {
  position: relative;
  padding: 0 40px;
  z-index: 2;
}

.category-container {
  display: flex;
  overflow-x: auto;
  scroll-behavior: auto;
  gap: 20px;
  padding: 20px 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}

.category-container::-webkit-scrollbar {
  display: none;
}

.category-item {
  scroll-snap-align: start;
  text-decoration: none;
  min-width: 280px;
  flex-shrink: 0;
}

.category-card {
  position: relative;
  padding: 28px;
  height: 200px;
  border-radius: 20px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 2px 8px rgba(0, 0, 0, 0.04),
    0 0 0 1px rgba(255, 255, 255, 0.02) inset,
    inset 0 4px 12px rgba(0, 0, 0, 0.06),
    inset 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

/* Category卡片内部光晕效果 */
.category-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.05) 0%,
      rgba(255, 255, 255, 0.01) 50%,
      rgba(255, 255, 255, 0.03) 100%);
  border-radius: 20px;
  pointer-events: none;
  z-index: 1;
}

/* Category卡片内嵌效果 */
.category-card::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  right: 3px;
  bottom: 3px;
  background: linear-gradient(135deg,
      rgba(0, 0, 0, 0.04) 0%,
      transparent 50%,
      rgba(0, 0, 0, 0.02) 100%);
  border-radius: 17px;
  pointer-events: none;
  z-index: 1;
}

.category-card:hover {
  transform: translateY(-4px) scale(1.005);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  border-color: rgba(0, 122, 255, 0.15);
  box-shadow:
    0 6px 20px rgba(0, 122, 255, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.05) inset,
    inset 0 6px 16px rgba(0, 0, 0, 0.08),
    inset 0 2px 4px rgba(0, 0, 0, 0.12);
}

.category-card:active {
  transform: translateY(-4px) scale(1.01);
  transition: all 0.1s ease;
}

.category-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.category-content h3 {
  font-size: 26px;
  font-weight: 700;
  margin: 0 0 16px;
  background: linear-gradient(135deg, #ff9500, #ffcc00);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.category-desc {
  color: #86868b;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 16px;
  flex: 1;
}


/* 音符滑块样式 */
.music-slider-container {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
  margin-top: 20px;
  user-select: none;
}



.music-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.music-note {
  width: 100%;
  height: 100%;
  fill: var(--el-color-primary);
}

.slider-track {
  position: relative;
  flex: 1;
  height: 4px;
  background: rgba(0, 122, 255, 0.2);
  border-radius: 2px;
  cursor: pointer;
  overflow: visible;
}

.slider-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: grab;
  z-index: 1;
  transition: transform 0.05s ease;
}

.handle-dot {
  width: 16px;
  height: 16px;
  background: #ffffff;
  border: 2px solid #007aff;
  border-radius: 50%;
  box-shadow: 0 0 8px rgba(0, 122, 255, 0.3);
  transition: transform 0.05s ease;
}

.slider-handle:hover .handle-dot {
  transform: scale(1.1);
  box-shadow: 0 0 12px rgba(0, 122, 255, 0.4);
}

.slider-handle:active {
  cursor: grabbing;
  transform: translate(-50%, -50%) scale(1.05);
}


/* 添加动画优化 */
@media (prefers-reduced-motion: no-preference) {
  .category-container {
    transition: none;
  }

  .slider-handle {
    will-change: transform;
  }
}

.music-notice {
  width: 35rem;
  height: 20rem;
  font-size: 12rem;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
  backdrop-filter: blur(20px);
  border-radius: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.music-notice:hover {
  transform: translateY(-5px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0.1));
}

.profile {
  display: flex;
  flex-direction: column;
}

.profile-item {
  margin-left: 0;
  padding: 2rem;
  position: relative;
}

.profile-item .WaterTitle {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #007aff, #5856d6);
  -webkit-background-clip: text;
  color: transparent;
  margin: 0 0 1.5rem 0;
  line-height: 1.2;
}

.profile-item-content {
  font-size: 1.3rem;
  line-height: 1.7;
  color: #2c3e50;
  font-weight: 500;
  max-width: 500px;
  text-align: justify;
  margin-bottom: 2rem;
}



@keyframes oceanWave {
  0% {
    transform: translateY(-100%) scale(1.2);
  }

  50% {
    transform: translateY(0%) scale(1);
  }

  100% {
    transform: translateY(100%) scale(1.2);
  }
}

.WaterTitle {
  position: relative;
  z-index: 1;
  background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
  -webkit-background-clip: text;
  color: transparent;
  animation: titleWave 3s infinite ease-in-out;
}

@keyframes titleWave {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-5px);
  }
}

.stack {
  width: 45%;
  max-width: 600px;
  transition: 0.25s ease;
  background: rgba(6, 105, 192, 0.08);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 20px;
  border: 1px solid rgba(173, 216, 230, 0.15);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

.stack::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg,
      transparent 0%,
      rgba(173, 216, 230, 0.1) 20%,
      rgba(135, 206, 235, 0.15) 40%,
      rgba(173, 216, 230, 0.1) 60%,
      transparent 80%);
  animation: oceanWave 5s infinite ease-in-out;
}

.stack::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg,
      transparent 0%,
      rgba(176, 224, 230, 0.08) 30%,
      rgba(135, 206, 235, 0.12) 50%,
      rgba(176, 224, 230, 0.08) 70%,
      transparent 100%);
  animation: oceanWave 7s infinite ease-in-out reverse;
}

.card {
  aspect-ratio: 3 / 2;
  border: 4px solid rgba(173, 216, 230, 0.2);
  background-color: rgba(6, 105, 192, 0.1);
  position: relative;
  transition: 0.15s ease;
  cursor: pointer;
  padding: 5% 5% 15% 5%;
  border-radius: 15px;
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  overflow: hidden;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg,
      transparent 0%,
      rgba(173, 216, 230, 0.1) 20%,
      rgba(135, 206, 235, 0.15) 40%,
      rgba(173, 216, 230, 0.1) 60%,
      transparent 80%);
  animation: oceanWave 4.5s infinite ease-in-out;
}

.image {
  width: 100%;
  border: 4px solid rgba(173, 216, 230, 0.2);
  background-color: rgba(6, 105, 192, 0.05);
  aspect-ratio: 1 / 1;
  position: relative;
  border-radius: 10px;
  overflow: hidden;
}

.image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  position: relative;
  z-index: 1;
}

.image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg,
      transparent 0%,
      rgba(173, 216, 230, 0.1) 20%,
      rgba(135, 206, 235, 0.15) 40%,
      rgba(173, 216, 230, 0.1) 60%,
      transparent 80%);
  animation: oceanWave 5.5s infinite ease-in-out;
  z-index: 2;
}

/* 时间轴部分样式 */
.timeline-section {
  margin: 0 -20px;
  padding: 6rem 0;
  position: relative;
  background: linear-gradient(135deg, #f8f9ff 0%, #e8f4fd 50%, #f0f8ff 100%);
  overflow: hidden;
}

/* 时间轴背景装饰元素 */
.timeline-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(0, 122, 255, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(88, 86, 214, 0.05) 0%, transparent 50%),
    radial-gradient(circle at 40% 60%, rgba(255, 45, 146, 0.03) 0%, transparent 50%);
  z-index: 1;
}

.timeline-section::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    linear-gradient(45deg, transparent 30%, rgba(0, 122, 255, 0.02) 50%, transparent 70%),
    linear-gradient(-45deg, transparent 30%, rgba(88, 86, 214, 0.02) 50%, transparent 70%);
  z-index: 1;
}

/* 时间轴浮动装饰元素 */
.timeline-section .home-container::before {
  content: '';
  position: absolute;
  top: 10%;
  right: 10%;
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, rgba(0, 122, 255, 0.1), rgba(88, 86, 214, 0.1));
  border-radius: 50%;
  z-index: 1;
  animation: float 6s ease-in-out infinite;
}

.timeline-section .home-container::after {
  content: '';
  position: absolute;
  bottom: 20%;
  left: 5%;
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, rgba(255, 45, 146, 0.1), rgba(255, 149, 0, 0.1));
  border-radius: 8px;
  z-index: 1;
  animation: float 8s ease-in-out infinite reverse;
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

/* 时间轴标题样式 */
.timeline-title-wrapper {
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  z-index: 2;
}

.timeline-main-title {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #007aff, #5856d6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  position: relative;
}

.timeline-main-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #007aff, #5856d6);
  border-radius: 2px;
}

.timeline-subtitle {
  font-size: 1.1rem;
  color: #86868b;
  font-weight: 400;
  letter-spacing: 0.5px;
}

.timeline-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

/* 时间轴样式 - 交错现代化风格 */
.timeline {
  position: relative;
  padding: 2rem 0;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 3px;
  background: linear-gradient(to bottom, #007aff, #5856d6, #ff2d92, #ff9500, #007aff);
  transform: translateX(-50%);
  border-radius: 2px;
}

.timeline-item {
  position: relative;
  margin-bottom: 4rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  width: 45%;
}

.timeline-item:nth-child(odd) {
  margin-left: 0;
  margin-right: auto;
}

.timeline-item:nth-child(even) {
  margin-left: auto;
  margin-right: 0;
}

.timeline-item:hover {
  transform: translateY(-8px);
}

.timeline-item.active {
  transform: translateY(-12px);
}

.timeline-dot {
  position: absolute;
  top: 30px;
  width: 20px;
  height: 20px;
  background: #007aff;
  border: 4px solid #ffffff;
  border-radius: 50%;
  box-shadow: 0 0 0 3px #e5e5e7, 0 4px 12px rgba(0, 122, 255, 0.3);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 2;
}

.timeline-item:nth-child(odd) .timeline-dot {
  right: -42px;
}

.timeline-item:nth-child(even) .timeline-dot {
  left: -42px;
}

.timeline-item:hover .timeline-dot {
  background: #007aff;
  box-shadow: 0 0 0 6px rgba(0, 122, 255, 0.2), 0 8px 24px rgba(0, 122, 255, 0.4);
  transform: scale(1.3);
}

.timeline-item.active .timeline-dot {
  background: #007aff;
  box-shadow: 0 0 0 8px rgba(0, 122, 255, 0.3), 0 12px 32px rgba(0, 122, 255, 0.5);
  transform: scale(1.4);
}

.timeline-content {
  background: #ffffff;
  border: 1px solid #e5e5e7;
  border-radius: 16px;
  padding: 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.timeline-item:hover .timeline-content {
  border-color: #007aff;
  box-shadow: 0 8px 32px rgba(0, 122, 255, 0.15);
}

.timeline-item.active .timeline-content {
  border-color: #007aff;
  background: #f8f9ff;
  box-shadow: 0 12px 40px rgba(0, 122, 255, 0.2);
}

.timeline-layout {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
}

.timeline-text {
  flex: 1;
  min-width: 0;
}

.timeline-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1d1d1f;
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
}

.timeline-date {
  font-size: 0.875rem;
  color: #007aff;
  font-weight: 600;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.timeline-date::before {
  content: '📅';
  font-size: 0.8rem;
}

.timeline-description {
  font-size: 0.95rem;
  color: #86868b;
  line-height: 1.6;
  margin: 0;
}

.timeline-image {
  width: 120px;
  height: 80px;
  overflow: hidden;
  position: relative;
  border-radius: 8px;
  flex-shrink: 0;
}

.timeline-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.timeline-item:hover .timeline-image img {
  transform: scale(1.05);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .timeline-container {
    max-width: 100%;
    padding: 0 1rem;
  }

  .timeline::before {
    left: 30px;
    transform: none;
  }

  .timeline-item {
    width: calc(100% - 60px);
    margin-left: 60px !important;
    margin-right: 0 !important;
  }

  .timeline-dot {
    left: -42px !important;
    right: auto !important;
  }

  .timeline-content {
    border-radius: 12px;
  }

  .timeline-layout {
    padding: 1rem;
    gap: 1rem;
  }

  .timeline-image {
    width: 80px;
    height: 60px;
    border-radius: 6px;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .flexbox {
    flex-direction: column;
    gap: 2rem;
    padding: 0 1rem;
  }

  .profile-item {
    padding: 1.5rem;
    text-align: center;
  }

  .profile-item .WaterTitle {
    font-size: 2rem;
    margin: 0 0 1rem 0;
  }

  .profile-item-content {
    font-size: 1rem;
    line-height: 1.7;
    max-width: 100%;
    text-align: left;
    margin-bottom: 1.5rem;
  }

  .highlight {
    padding: 0.05rem 0.2rem;
    font-size: 0.95rem;
  }

  .more-button {
    font-size: 0.9rem;
    padding: 0.6rem 1.2rem;
  }

  .arrow-icon {
    width: 14px;
    height: 14px;
  }
}

/* 推荐文章轮播 Apple 风格 */
.carousel-container {
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: none;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
  margin-bottom: 3rem;
  min-height: 380px;
  overflow: visible;
}

.carousel-track {
  display: flex;
  gap: 6.0rem;
  width: 900px;
  min-height: 340px;
  justify-content: center;
  transition: transform 0.5s cubic-bezier(.4, 0, .2, 1);
  will-change: transform;
  perspective: 1200px;
  padding-bottom: 50px;
}

.carousel-slide {
  flex: 0 0 280px;
  max-width: 280px;
  transition: transform 0.6s cubic-bezier(.4, 0, .2, 1), box-shadow 0.4s, opacity 0.4s;
  border-radius: 1.5rem;
  background: none;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18), 0 1.5px 8px rgba(0, 122, 255, 0.10);
  overflow: hidden;
  position: relative;
  will-change: transform, opacity, box-shadow;
}

.carousel-slide::before,
.carousel-slide::after {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  width: 22px;
  border-radius: 12px;
  z-index: 0;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.3s, box-shadow 0.4s, background 0.4s;
}

.carousel-slide.left::before {
  left: -22px;
  opacity: 1;
  width: 28px;
  background:
    linear-gradient(100deg, #007aff 0%, #4f8cff 60%, #eaf6ff 100%),
    repeating-linear-gradient(90deg, #0b65ec 0 2px, transparent 2px 6px),
    repeating-linear-gradient(0deg, #0a51d6 0 1px, transparent 1px 4px);
  box-shadow: 4px 0 12px 0 rgba(0, 0, 0, 0.10);
  filter: blur(0.2px);
  border-radius: 10px 0 0 10px;
  border-right: 2px solid #6181c7;
  z-index: 2;
}

.carousel-slide.right::after {
  right: -22px;
  opacity: 1;
  width: 28px;
  background:
    linear-gradient(260deg, #eaf6ff 0%, #f8fafc 60%, #b3c6e0 100%),
    /* 书页主色+高光 */
    repeating-linear-gradient(90deg, #e0e7ef 0 2px, transparent 2px 6px),
    /* 竖线模拟书页边 */
    repeating-linear-gradient(0deg, #cfd8e3 0 1px, transparent 1px 4px);
  /* 横线模拟书页纹理 */
  box-shadow: -4px 0 12px 0 rgba(0, 0, 0, 0.08);
  filter: blur(0.2px);
  border-radius: 0 10px 10px 0;
  border-left: 2px solid #b3c6e0;
  z-index: 2;
}

.carousel-slide:hover {
  transform: translateY(-8px) scale(1.06) !important;
  box-shadow: 0 24px 56px rgba(0, 122, 255, 0.16), 0 4px 16px rgba(0, 0, 0, 0.16);
  z-index: 10;
}

.carousel-arrow {
  background: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  transition: background 0.2s;
}

.carousel-arrow.left {
  left: 0.5rem;
}

.carousel-arrow.right {
  right: 0.5rem;
}

.carousel-arrow:hover {
  background: #eaf6ff;
}

/* 电脑背景和Logo覆盖样式 */
.computer-logo-section {
  margin: 6rem 0;
  padding: 0 20px;
  position: relative;
}

.computer-background {
  position: relative;
  max-width: 900px;
  margin: 0 auto;
  border-radius: 24px;
  overflow: hidden;

}

.computer-image {
  width: 100%;
  height: auto;
  display: block;
  margin: 0 auto;
  object-fit: cover;
  mix-blend-mode: multiply;
}

/* 电脑屏幕内容居中布局 */
.pc-screen-content {
  position: absolute;
  top: -15%;
  left: 17%;
  width: 78%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2;
  /* 你可以根据实际电脑屏幕区域微调width/left等 */
}

.pc-screen-content .logo-image {
  width: 150px;
  height: auto;
  margin-bottom: 1.2rem;
}

.pc-screen-content .arcwater-title {
  font-size: 2.2rem;
  font-weight: bold;
  color: #1976d2;
  letter-spacing: 0.12em;
  text-shadow: 0 4px 24px rgba(25, 118, 210, 0.08);
  font-family: 'SF Pro Display', 'PingFang SC', 'Hiragino Sans GB', Arial, sans-serif;
  margin-bottom: 1.2rem;
}

.pc-screen-content .pc-btns {
  display: flex;
  flex-direction: row;
  gap: 1rem;
}

/* 按钮 */
.screen-btn {
  padding: 0.5rem 2rem;
  border-radius: 1.5rem;
  border: none;
  background: linear-gradient(90deg, #1976d2 0%, #42a5f5 100%);
  color: #fff;
  font-size: 1.1rem;
  font-weight: 600;
  box-shadow: 0 2px 12px rgba(25, 118, 210, 0.08);
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.screen-btn:hover {
  background: linear-gradient(90deg, #42a5f5 0%, #1976d2 100%);
  transform: translateY(-2px) scale(1.05);
}


.mobile-btns .screen-btn {
  font-size: 0.95rem;
  padding: 0.4rem 1.2rem;
  border-radius: 1.2rem;
}

.screen-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5em;
}

.btn-icon {
  display: flex;
  align-items: center;
  margin-right: 0.3em;
}

/* 响应式适配 */
@media (max-width: 900px) {
  .computer-background {
    max-width: 100%;
  }

  .logo-image {
    width: 120px;
    height: 120px;
  }

  .arcwater-title {
    font-size: 1.3rem;
  }

  .pc-btns .screen-btn {
    font-size: 0.9rem;
    padding: 0.3rem 1rem;
  }

  .mobile-btns .screen-btn {
    font-size: 0.85rem;
    padding: 0.3rem 0.8rem;
  }
}

/* 手机屏幕内容整体flex居中 */
.mobile-screen-content {
  gap: 2.8rem;
  position: absolute;
  top: 20%;
  left: 6%;
  width: 140px;
  height: 320px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 3;
}

.mobile-screen-content .mobile-logo {
  width: 60px;
  height: 60px;

}

.mobile-screen-content .mobile-title {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: #1976d2;

  letter-spacing: 0.12em;
  margin-bottom: 0.7rem;
  text-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
  font-family: 'SF Pro Display', 'PingFang SC', 'Hiragino Sans GB', Arial, sans-serif;
}

.mobile-screen-content .mobile-btns {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  align-items: center;
  justify-content: center;
}

/* 音乐区域 - 占满全宽的Apple蓝色背景 */
.music-section-fullwidth {
  background-color: #007AFF;
  /* 纯Apple蓝色 */
  margin: 0 -20px;
  /* 抵消全局padding，占满全宽 */
  padding: 4rem 0;
  /* 上下内边距 */
  position: relative;
  overflow: hidden;
}

.music-section-fullwidth::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #007AFF 0%, #0056CC 100%);
  /* 渐变增强效果 */
  z-index: 1;
}

.music-section-fullwidth .home-container {
  position: relative;
  z-index: 2;
}

/* 确保音乐区域内的内容样式不受影响 */
.music-section-fullwidth .flexbox {
  position: relative;
  z-index: 2;
}

.music-section-fullwidth .music-image {
  position: relative;
  z-index: 2;
}



.dot {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
}

.dot-1 {
  background: linear-gradient(135deg, #ff6b6b, #ee5a52);
  box-shadow: 0 2px 8px rgba(255, 107, 107, 0.3);
}

.dot-2 {
  background: linear-gradient(135deg, #51cf66, #40c057);
  box-shadow: 0 2px 8px rgba(81, 207, 102, 0.3);
}

.dot-3 {
  background: linear-gradient(135deg, #339af0, #228be6);
  box-shadow: 0 2px 8px rgba(51, 154, 240, 0.3);
}

.dot:hover {
  transform: scale(1.2);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.tooltip {
  position: absolute;
  top: 28px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  z-index: 1000;
  animation: tooltipFadeIn 0.2s ease;
}

.tooltip::after {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid transparent;
  border-bottom-color: rgba(0, 0, 0, 0.8);
}

@keyframes tooltipFadeIn {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

/* 筛选面板样式 */
.filter-panel {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(10px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}

.filter-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(30px) scale(0.9);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.filter-header h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
  background: linear-gradient(135deg, #007aff, #5856d6);
  -webkit-background-clip: text;
  color: transparent;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  padding: 5px;
  border-radius: 50%;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #333;
}

.filter-group {
  margin-bottom: 25px;
}

.filter-group label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: #333;
}

.filter-buttons {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-buttons button {
  padding: 8px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.filter-buttons button:hover {
  border-color: #007aff;
  color: #007aff;
}

.filter-buttons button.active {
  background: linear-gradient(135deg, #007aff, #5856d6);
  border-color: transparent;
  color: white;
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

/* 视图切换指示器 */
.view-mode-indicator {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1001;
  animation: fadeInOut 2s ease;
}

.view-mode-content {
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 15px 25px;
  border-radius: 25px;
  backdrop-filter: blur(10px);
  font-weight: 600;
}

@keyframes fadeInOut {

  0%,
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }

  20%,
  80% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}



/* 网格瀑布流样式 */
.category-display {
  width: 100%;
}

.category-grid-container {
  width: 100%;
  position: relative;
}

.category-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  padding: 20px 10px;
  max-height: 440px;
  /* 限制为两排高度 */
  overflow-x: auto;

  scroll-behavior: smooth;
  scrollbar-width: none;
  -ms-overflow-style: none;
  -webkit-overflow-scrolling: touch;
}

.category-grid::-webkit-scrollbar {
  width: 2px;
}

.category-grid::-webkit-scrollbar-thumb {
  background: #0865e7;
  border-radius: 4px;
}

.grid-item {
  display: block;
}

.grid-link {
  text-decoration: none;
  color: inherit;
  display: block;
  height: 100%;
  cursor: pointer;
  position: relative;
  z-index: 10;
}

.grid-card {
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9ff 50%, #e8f4fd 100%);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 0;
  padding: 25px;
  border: 1px solid rgba(0, 122, 255, 0.1);
  box-shadow:
    0 2px 8px rgba(0, 122, 255, 0.08),
    0 0 0 1px rgba(255, 255, 255, 0.5) inset,
    inset 0 2px 4px rgba(0, 0, 0, 0.04);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  z-index: 1;
}

/* 网格卡片内部光晕效果 */
.grid-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg,
      rgba(0, 122, 255, 0.02) 0%,
      rgba(255, 255, 255, 0.01) 50%,
      rgba(0, 122, 255, 0.01) 100%);
  border-radius: 0;
  pointer-events: none;
  z-index: 1;
}

/* 网格卡片内嵌效果 */
.grid-card::after {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  bottom: 2px;
  background: linear-gradient(135deg,
      rgba(0, 0, 0, 0.04) 0%,
      transparent 50%,
      rgba(0, 0, 0, 0.02) 100%);
  border-radius: 0;
  pointer-events: none;
  z-index: 1;
}

.grid-link:hover .grid-card {
  transform: translateY(-6px) scale(1.02);
  background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 50%, #e6f3ff 100%);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border-color: rgba(0, 122, 255, 0.3);
  box-shadow:
    0 8px 25px rgba(0, 122, 255, 0.15),
    0 0 0 1px rgba(255, 255, 255, 0.8) inset,
    inset 0 2px 4px rgba(0, 0, 0, 0.06);
}

.grid-link:hover {
  transform: translateY(-2px);
}

/* 调试样式 - 确保hover效果明显 */
.grid-link:hover .grid-content h3 {
  background: linear-gradient(135deg, #007aff, #5856d6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 测试样式 - 确保hover可见 */
.grid-link:hover .grid-card {
  background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 50%, #e6f3ff 100%) !important;
  border-color: #007aff !important;
  transform: translateY(-8px) scale(1.02) !important;
}

.grid-link:active .grid-card {
  transform: translateY(-4px) scale(1.01);
  transition: all 0.1s ease;
}

.grid-content {
  position: relative;
  z-index: 2;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.folder-icon {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.folder-icon svg {
  width: 48px;
  height: 48px;
  color: #007aff;
  transition: all 0.3s ease;
}

.grid-link:hover .folder-icon svg {
  color: #0056cc;
  transform: scale(1.1);
}

.grid-content h3 {
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 15px;
  background: linear-gradient(135deg, #007aff, #5856d6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
  text-align: center;
}

.grid-desc {
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin-bottom: 20px;
  flex: 1;
  text-align: center;
  padding: 0 10px;
}

.article-count {
  background: linear-gradient(135deg, #007aff, #5856d6);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.2);
  transition: all 0.3s ease;
}

.grid-link:hover .article-count {
  background: linear-gradient(135deg, #0056cc, #4a4a9e);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
  transform: translateY(-2px);
}

/* 右上角三角形 */
.triangle-corner {
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 60px 60px 0;
  border-color: transparent #007aff transparent transparent;
  z-index: 10;
  pointer-events: none;
}

.article-number {
  position: absolute;
  top: 10px;
  right: -55px;
  color: white;
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  line-height: 1;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  z-index: 11;
  pointer-events: none;
  overflow: hidden;
}

/* hover效果 */
.grid-link:hover .triangle-corner {
  border-color: transparent #0056cc transparent transparent;
}

.grid-link:hover .article-number {
  color: white;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);
}

/* 悬浮代码图标 */
.floating-code-icon {
  position: absolute;
  top: 25%;
  left: 8%;
  z-index: 100;
  animation: float 6s ease-in-out infinite;
}

.code-balloon {
  width: 100px;
  height: 100px;
  filter: drop-shadow(0 4px 8px rgba(0, 122, 255, 0.3));
  transition: all 0.3s ease;
}

.code-balloon:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 6px 12px rgba(0, 122, 255, 0.4));
}

/* 悬浮待办事项图标 */
.floating-todo-icon {
  position: absolute;
  top: 20%;
  right: 12%;
  z-index: 100;
  animation: float 7s ease-in-out infinite;
  animation-delay: 1s;
}

.todo-balloon {
  width: 90px;
  height: 90px;
  filter: drop-shadow(0 4px 8px rgba(255, 149, 0, 0.3));
  transition: all 0.3s ease;
}

.todo-balloon:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 6px 12px rgba(255, 149, 0, 0.4));
}

/* 悬浮文件图标 */
.floating-myfile-icon {
  position: absolute;
  bottom: 30%;
  left: 6%;
  z-index: 100;
  animation: float 8s ease-in-out infinite;
  animation-delay: 2s;
}

.myfile-balloon {
  width: 95px;
  height: 95px;
  filter: drop-shadow(0 4px 8px rgba(88, 86, 214, 0.3));
  transition: all 0.3s ease;
}

.myfile-balloon:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 6px 12px rgba(88, 86, 214, 0.4));
}

/* 悬浮书籍图标 */
.floating-bookhand-icon {
  position: absolute;
  bottom: 25%;
  right: 8%;
  z-index: 100;
  animation: float 6.5s ease-in-out infinite;
  animation-delay: 3s;
}

.bookhand-balloon {
  width: 105px;
  height: 105px;
  filter: drop-shadow(0 4px 8px rgba(52, 199, 89, 0.3));
  transition: all 0.3s ease;
}

.bookhand-balloon:hover {
  transform: scale(1.1);
  filter: drop-shadow(0 6px 12px rgba(52, 199, 89, 0.4));
}

/* 悬浮动画 */
@keyframes float {

  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }

  25% {
    transform: translateY(-10px) rotate(2deg);
  }

  50% {
    transform: translateY(-5px) rotate(-1deg);
  }

  75% {
    transform: translateY(-15px) rotate(1deg);
  }
}

/* 响应式悬浮图标 */
@media (max-width: 768px) {
  .floating-code-icon {
    top: 20%;
    left: 5%;
  }

  .code-balloon {
    width: 80px;
    height: 80px;
  }

  .floating-todo-icon {
    top: 15%;
    right: 8%;
  }

  .todo-balloon {
    width: 75px;
    height: 75px;
  }

  .floating-myfile-icon {
    bottom: 25%;
    left: 4%;
  }

  .myfile-balloon {
    width: 80px;
    height: 80px;
  }

  .floating-bookhand-icon {
    bottom: 20%;
    right: 6%;
  }

  .bookhand-balloon {
    width: 85px;
    height: 85px;
  }

  /* 网格模式响应式 */
  .filter-content {
    width: 95%;
    padding: 20px;
  }

  .filter-buttons {
    flex-direction: column;
  }

  .filter-buttons button {
    width: 100%;
  }

  .category-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
    padding: 15px 0;
    max-height: 400px;
  }

  .grid-slider-container {
    padding: 15px 20px;
    margin-top: 8px;
  }

  .grid-card {
    padding: 25px;
    min-height: 180px;
  }

  .grid-content h3 {
    font-size: 22px;
    margin-bottom: 12px;
  }

  .grid-desc {
    font-size: 0.9rem;
    margin-bottom: 15px;
  }

  .folder-icon svg {
    width: 40px;
    height: 40px;
  }

  /* 小屏幕下的三角形 */
  .triangle-corner {
    border-width: 0 50px 50px 0;
  }

  .article-number {
    top: 6px;
    right: 6px;
    font-size: 12px;
  }

  .grid-link:hover .grid-card {
    transform: translateY(-6px) scale(1.02);
    background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 50%, #e6f3ff 100%);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border-color: rgba(0, 122, 255, 0.3);
    box-shadow:
      0 8px 25px rgba(0, 122, 255, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.8) inset,
      inset 0 2px 4px rgba(0, 0, 0, 0.06);
  }
}

@media (max-width: 480px) {
  .floating-code-icon {
    top: 15%;
    left: 3%;
  }

  .code-balloon {
    width: 65px;
    height: 65px;
  }

  .floating-todo-icon {
    top: 12%;
    right: 5%;
  }

  .todo-balloon {
    width: 60px;
    height: 60px;
  }

  .floating-myfile-icon {
    bottom: 20%;
    left: 2%;
  }

  .myfile-balloon {
    width: 65px;
    height: 65px;
  }

  .floating-bookhand-icon {
    bottom: 15%;
    right: 4%;
  }

  .bookhand-balloon {
    width: 70px;
    height: 70px;
  }

  /* 网格模式响应式 */
  .category-grid {
    grid-template-columns: 1fr;
    gap: 12px;
    max-height: 360px;
  }

  .grid-slider-container {
    padding: 12px 15px;
    margin-top: 6px;
  }

  .grid-card {
    padding: 20px;
    min-height: 160px;
  }

  .grid-content h3 {
    font-size: 22px;
    margin-bottom: 12px;
  }

  .grid-desc {
    font-size: 0.9rem;
    margin-bottom: 15px;
  }

  .folder-icon svg {
    width: 40px;
    height: 40px;
  }

  /* 更小屏幕下的三角形 */
  .triangle-corner {
    border-width: 0 40px 40px 0;
  }

  .article-number {
    top: 4px;
    right: 4px;
    font-size: 10px;
  }

  .grid-link:hover .grid-card {
    transform: translateY(-6px) scale(1.02);
    background: linear-gradient(135deg, #ffffff 0%, #f0f8ff 50%, #e6f3ff 100%);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border-color: rgba(0, 122, 255, 0.3);
    box-shadow:
      0 8px 25px rgba(0, 122, 255, 0.15),
      0 0 0 1px rgba(255, 255, 255, 0.8) inset,
      inset 0 2px 4px rgba(0, 0, 0, 0.06);
  }
}
</style>
