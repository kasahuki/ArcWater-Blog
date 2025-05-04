<template>
  <div class="home-container">
    <!-- 欢迎横幅
    <div class="welcome-banner gradient-bg">
      <h1>Arc Water</h1>
      <p>LET'S MAKE IT HAPPEN!</p>
    </div> -->

    <HomeCover></HomeCover>
    <!-- 推荐文章 -->
    <div class="section-container">
      <SectionTitle title="Comment" />
      <el-row :gutter="24">
        <el-col :xs="24" :sm="12" :md="8" v-for="article in featuredArticles" :key="article.id">
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
        </el-col>
      </el-row>
    </div>

    <!-- 文章分类 -->
    <div class="section-container category-section">
      <div class="section-header">
        <SectionTitle title="Category" />
      </div>
      <div class="category-slider">
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


    <SectionTitle title="Music" />
    <div class="flexbox" style="margin-top: 2.5rem;">
      <Notice title="Click to enjoy" body="Music" class="music-notice" @click="$router.push('/music')">
      </Notice>
      <!-- 透明背景钢琴图片 -->
      <div class="piano-image-container">
        <img src="/src/assets/image/piano.png" alt="Piano" class="piano-image" />
      </div>
    </div>



  </div>
  <div class="WaterTitle" style="font-size: 3rem;margin-bottom: 4rem;">My Artifact --early time</div>

  <div style="background-color: black;padding: 2.5rem; border-radius: 2rem;margin-bottom: 5rem;position: relative;">

    <FloatCards>

    </FloatCards>
    <div class="appleFont" style="color: white;  position: absolute;right: 2rem;bottom: 2rem;  ">
      <WhiteButton style="width: 15rem;" content="Learn  More" class="appleFont"></WhiteButton>
    </div>
  </div>
  <div class="home-container">
    <div class="flexbox" style="margin-bottom: 10rem;">
      <ImageCard :url="url" />
      <div class="profile" style="display: flex;flex-direction: column;">
        <div class="profile-item" style="margin-left: 1rem;">
          <div class="WaterTitle">ArcWater</div>
          <div class="profile-item-content">
            Welcome to ArcWater, a creative space where technology meets art. Here you'll find insightful articles,
            music recommendations, and a collection of digital artifacts. Join me on this journey of exploration and
            discovery in the digital realm.
          </div>
        </div>
      </div>
    </div>

  </div>



</template>

<script setup>
import ImageCard from '@/components/ImageCard.vue'
import FloatCards from '../components/FloatCards.vue'
import { ref, onMounted, onBeforeUnmount } from 'vue'
import WhiteButton from '../components/WhiteButton.vue'
import Notice from '../components/NoticeComponent.vue'
import MusicBox from '@/components/MusicBox.vue'
import HomeCover from '@/components/HomeCover.vue'
import { getCategories } from '@/util/common'
import { Document, DataLine, Brush, Cellphone, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import FloatCardsVue from '@/components/FloatCards.vue'
import { categoryListService } from '@/api/category'
import { hotArticleService } from '@/api/article'
import SectionTitle from '@/components/SectionTitle.vue'
import dayjs from 'dayjs'

import { useCategoryStore } from '@/stores/categoryStore'
import img from '@/assets/image/arcwater_logo.png'

const url = ref(img)
const categoryStore = useCategoryStore()
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
    const response = await hotArticleService(3)
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
  startAutoScroll()
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
  stopAutoScroll()
}

const handleMouseLeave = () => {
  if (!isDragging.value) {
    startAutoScroll()
  }
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
</script>

<style scoped>
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
  align-items: center;
  margin-bottom: 10rem;
  padding: 0 20px;
  gap: 8rem;
  background: rgba(6, 105, 192, 0.05);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(173, 216, 230, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  padding: 3rem;
  width: 100%;
  max-width: 100%;
  position: relative;
  overflow: hidden;
}

.flexbox::before {
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
  animation: oceanWave 4s infinite ease-in-out;
}

.flexbox::after {
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
  animation: oceanWave 6s infinite ease-in-out reverse;
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

.home-container {
  max-width: 1200px;
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
  margin: 48px 0;
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
  margin-bottom: 24px;
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
  padding: 40px 0;
  background: linear-gradient(to bottom, #1a1a1a, #2d2d2d);
  border-radius: 24px;
  margin: 48px 0;
}

.category-slider {
  position: relative;
  padding: 0 40px;
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
  padding: 24px;
  height: 180px;
  border-radius: 16px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}

.category-content {
  position: relative;
  z-index: 1;
}

.category-content h3 {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 12px;
  background: linear-gradient(135deg, #fff, rgba(255, 255, 255, 0.7));
  -webkit-background-clip: text;
  color: transparent;
}

.category-desc {
  color: rgba(255, 255, 255, 0.7);
}

.article-count {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.9);
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
  background: rgba(255, 255, 255, 0.1);
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
  width: 12px;
  height: 12px;
  background: var(--el-color-primary);
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(var(--el-color-primary-rgb), 0.3);
  transition: transform 0.05s ease;
}

.slider-handle:hover .handle-dot {
  transform: scale(1.2);
}

.slider-handle:active {
  cursor: grabbing;
  transform: translate(-50%, -50%) scale(1.2);
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  .category-section {
    background: linear-gradient(to bottom, #1a1a1a, #2d2d2d);
  }

  .category-card {
    background: rgba(255, 255, 255, 0.1);
  }

  .category-card:hover {
    background: rgba(255, 255, 255, 0.15);
  }
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

.piano-image-container {
  flex: 1;
  max-width: 40rem;
  height: 20rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.piano-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0.9;
  transition: all 0.3s ease;
}

.piano-image:hover {
  opacity: 1;
  transform: scale(1.02);
}

.profile {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 2rem;
}

.profile-item {
  margin-left: 1rem;
  background: rgba(6, 105, 192, 0.05);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
  border-radius: 15px;
  border: 1px solid rgba(173, 216, 230, 0.2);
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

.profile-item::before {
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
  animation: oceanWave 4s infinite ease-in-out;
}

.profile-item::after {
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
  animation: oceanWave 6s infinite ease-in-out reverse;
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

.profile-item-content {
  color: rgb(244, 255, 163);
  font-size: 1.4rem;
  line-height: 1.6;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 1;
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
</style>
