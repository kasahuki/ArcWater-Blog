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
      <h2 class="section-title">Commend</h2>
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" :md="8" v-for="article in featuredArticles" :key="article.id">
          <router-link :to="`/article/${article.id}`">
            <el-card class="article-card" shadow="hover">
              <img :src="article.image" class="article-image" alt="文章图片" />
              <div class="article-meta">
                <span class="article-category">{{ article.category }}</span>
              </div>
              <h3 class="article-title">{{ article.title }}</h3>
              <p class="article-desc">{{ article.description }}</p>
              <div class="article-footer">
                <span class="article-date">{{ article.date }}</span>
                <span class="article-views">{{ article.views }}次阅读</span>
              </div>
            </el-card>
          </router-link>
        </el-col>
      </el-row>
    </div>

    <!-- 文章分类 -->
    <div class="section-container">
      <h2 class="section-title">Category</h2>
      <div class="category-slider-container">
        <el-button class="slider-btn prev-btn" circle @click="scrollCategories('left')">
          <el-icon>
            <ArrowLeft />
          </el-icon>
        </el-button>

        <div class="category-container" ref="categoryContainer">
          <router-link v-for="category in categories" :key="category.id" :to="`/category/${category.id}`"
            class="category-item">
            <el-card shadow="hover">

              <h3>{{ category.categoryName }}</h3>
              <h4>{{ category.description }}</h4>
              <p>{{ category.articleCount }}篇文章</p>
            </el-card>
          </router-link>
        </div>

        <el-button class="slider-btn next-btn" circle @click="scrollCategories('right')">
          <el-icon>
            <ArrowRight />
          </el-icon>
        </el-button>
      </div>
    </div>




    <div class="GlodenTitle" style="font-size: 3rem;margin-bottom: 4rem;">Silicon vallery</div>
    <div class="flexbox">
      <Notice title="Click to enjoy the music" body="Music" style="width: 30rem;height: 18rem;font-size: 10rem;">

      </Notice>
      <div style="display: flex;flex-direction: column; height: 18rem;justify-content: space-between">
        <div class="ArcTitle" style="font-size: 4rem;"> <span>Tech-stack beautiful</span> </div>
        <div class="appleFont" style="text-transform: capitalize;">
          <p>hello world</p>
          <p>hello world</p>

          <p>hello world</p>
          <p>int main</p>
          <p>return 0</p>
          <p>we make the world a better place</p>
        </div>

      </div>
    </div>

    <div class="flexbox">

      <div style="display: flex;flex-direction: column; height: 18rem;justify-content: space-between">
        <div class="ArcTitle" style="font-size: 4rem;"> <span>Tech-stack beautiful</span> </div>
        <div class="appleFont" style="text-transform: capitalize;">
          <p>hello world</p>
          <p>hello world</p>

          <p>hello world</p>
          <p>int main</p>
          <p>return 0</p>
          <p>we make the world a better place</p>
        </div>

      </div>

      <Notice title="Click to enjoy the music" body="Music" style="width: 30rem;height: 18rem;font-size: 10rem;">

      </Notice>
    </div>

    <div class="WaterTitle" style="font-size: 3rem;margin-bottom: 4rem;">HOUSE DOCTOR</div>

    <div style="background-color: black;padding: 2.5rem; border-radius: 2rem;margin-bottom: 5rem;position: relative;">
      <span class="appleFont" style="color: white; font-size: 2rem;">home free </span>
      <FloatCards>

      </FloatCards>
      <div class="appleFont" style="color: white;  position: absolute;right: 2rem;bottom: 2rem;  ">
        <WhiteButton style="width: 15rem;" content="Get Started" class="appleFont"></WhiteButton>
      </div>
    </div>






  </div>
</template>

<script setup>
import FloatCards from '../components/FloatCards.vue'
import { ref, onMounted } from 'vue'
import WhiteButton from '../components/WhiteButton.vue'
import Notice from '../components/NoticeComponent.vue'
import MusicBox from '@/components/MusicBox.vue'
import HomeCover from '@/components/HomeCover.vue'
import { getCategories } from '@/util/common'
import { Document, DataLine, Brush, Cellphone, ArrowLeft, ArrowRight } from '@element-plus/icons-vue'
import FloatCardsVue from '@/components/FloatCards.vue'
import { categoryListService } from '@/api/category'


// 模拟数据
const featuredArticles = ref([
  {
    id: 1,
    title: '现代CSS技术与设计趋势',
    description: '探索最新的CSS技术，包括Grid布局、变量等，以及它们如何改变现代网页设计。',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bb39aa1f9a34861c4b69e0af6230758-an9isYh6ReUVV7CwD9jcKNTO7muQTQ.png',
    category: '前端开发',
    date: '2023年8月14日',
    views: 152
  },
  {
    id: 2,
    title: '深入理解ES6+新特性',
    description: '深入解析ES6+的新特性，以及如何在实际项目中高效地运用这些特性。',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ff7de4323d2c8b5b54884f35cc64982-Pm6QTeQIpny9dfWxEXHJo72IEm6NRD.png',
    category: 'JavaScript',
    date: '2023年8月25日',
    views: 102
  },
  {
    id: 3,
    title: 'UI设计中的动态与漂浮',
    description: '探讨如何在用户界面中创造动感，以及如何设计出有层次感的漂浮元素。',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/940540be69a5aab847b2c4d9a87608e-qOoaFiHO37ZT60oZzJ9EJAcVyXkHHe.png',
    category: 'UI/UX设计',
    date: '2023年9月10日',
    views: 62
  }
])

// 类别数据
const categories = ref([])

const categoryContainer = ref(null)

// 滑动功能
const scrollCategories = (direction) => {
  if (!categoryContainer.value) return

  const container = categoryContainer.value
  const scrollAmount = 300 // 滑动距离

  if (direction === 'left') {
    container.scrollLeft -= scrollAmount
  } else {
    container.scrollLeft += scrollAmount
  }
}

// 可以在这里添加后端接口请求函数
const fetchCategories = async () => {
  try {
    // 实际项目中可以替换为真实的API调用
    // const response = await axios.get('/api/categories')
    // categories.value = response.data
    console.log('获取分类数据')
  } catch (error) {
    console.error('获取分类失败:', error)
  }
}

onMounted(() => {
  // 组件挂载后可以调用获取数据函数
  // fetchCategories()
})

const loadCategories = async () => {
  categories.value = await getCategories()
}

loadCategories()
</script>

<style scoped>
.flexbox {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10rem;

}

.home-container {
  max-width: 1200px;
  margin: 0 auto;
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
  margin-bottom: 40px;
}

.section-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  position: relative;
  padding-left: 15px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 5px;
  height: 20px;
  background-image: var(--primary-gradient);
  border-radius: 2px;
}

.article-card {
  margin-bottom: 20px;
  height: 100%;
}

.article-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 15px;
}

.article-meta {
  margin-bottom: 10px;
}

.article-category {
  background-color: #e6f7ff;
  color: #1890ff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.article-title {
  font-size: 1.2rem;
  margin-bottom: 10px;
  color: var(--text-color);
}

.article-desc {
  color: var(--light-text);
  margin-bottom: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  color: var(--lighter-text);
  font-size: 0.8rem;
}

.category-slider-container {
  position: relative;
  display: flex;
  align-items: center;
}

.category-container {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  scrollbar-width: none;
  /* Firefox */
  -ms-overflow-style: none;
  /* IE and Edge */
  gap: 20px;
  padding: 10px 0;
}

.category-container::-webkit-scrollbar {
  display: none;
  /* Chrome, Safari, Opera */
}

.slider-btn {
  position: absolute;
  z-index: 10;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.prev-btn {
  left: -15px;
}

.next-btn {
  right: -15px;
}

.category-item {
  text-decoration: none;
  min-width: 220px;
  flex-shrink: 0;
}

.category-item .el-card {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.category-item .el-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.category-item h3 {
  margin: 15px 0 5px;
  color: var(--text-color);
}

.category-item p {
  color: var(--lighter-text);
  margin: 0;
}
</style>