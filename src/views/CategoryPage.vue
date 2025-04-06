<template>
  <div class="category-page">
    <!-- 分类标题 -->
    <div class="category-header gradient-bg">
      <div class="category-icon">
        <el-icon size="32">
          <component :is="categoryIcon" />
        </el-icon>
      </div>
      <div class="category-info">
        <h1>{{ categoryTitle }}</h1>
        <p>{{ categoryDescription }}</p>
      </div>
    </div>

    <!-- 筛选选项 -->
    <div class="filter-container">
      <div class="filter-label">排序方式：</div>
      <el-radio-group v-model="sortBy" size="small">
        <el-radio-button label="latest">最新发布</el-radio-button>
        <el-radio-button label="popular">热门文章</el-radio-button>
      </el-radio-group>

      <div class="filter-tabs">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="全部" name="all"></el-tab-pane>
          <el-tab-pane label="CSS" name="css"></el-tab-pane>
          <el-tab-pane label="JavaScript" name="javascript"></el-tab-pane>
          <el-tab-pane label="HTML" name="html"></el-tab-pane>
          <el-tab-pane label="React" name="react"></el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 文章列表 -->
    <div class="articles-container">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="12" v-for="article in filteredArticles" :key="article.id">
          <router-link :to="`/article/${article.id}`">
            <!-- // 交给路由处理 并且携带参数 由路由转发到对应的组件vue -->
            <el-card class="article-card" shadow="hover">
              <div class="article-content">
                <img :src="article.image" class="article-image" alt="文章图片" />
                <div class="article-details">
                  <div class="article-meta">
                    <span class="article-tag">{{ article.tag }}</span>
                  </div>
                  <h3 class="article-title">{{ article.title }}</h3>
                  <p class="article-desc">{{ article.description }}</p>
                  <div class="article-footer">
                    <span class="article-date">{{ article.date }}</span>
                    <span class="article-views">{{ article.views }}次阅读</span>
                  </div>
                </div>
              </div>
            </el-card>
          </router-link>
        </el-col>
      </el-row>

      <!-- 分页 -->
      <div class="pagination-container">
        <el-pagination background layout="prev, pager, next" :total="100" :page-size="10"
          @current-change="handlePageChange" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Document, DataLine, Brush, Cellphone } from '@element-plus/icons-vue'

const route = useRoute()
const sortBy = ref('latest')
const activeTab = ref('all')
const currentPage = ref(1)

// 根据路由参数获取分类信息
const categorySlug = computed(() => route.params.slug || 'frontend')

// 分类信息
const categoryInfo = computed(() => {
  const categories = {
    frontend: {
      title: '前端开发',
      description: '探索HTML, CSS, JavaScript以及相关框架和技术的最新趋势',
      icon: Document
    },
    backend: {
      title: '后端技术',
      description: '服务器端开发、数据库、API设计等技术文章',
      icon: DataLine
    },
    uiux: {
      title: 'UI/UX设计',
      description: '用户界面设计、用户体验、交互设计的理论与实践',
      icon: Brush
    },
    mobile: {
      title: '移动开发',
      description: '移动应用开发技术、跨平台框架、响应式设计等',
      icon: Cellphone
    }
  }

  return categories[categorySlug.value] || categories.frontend
})

const categoryTitle = computed(() => categoryInfo.value.title)
const categoryDescription = computed(() => categoryInfo.value.description)
const categoryIcon = computed(() => categoryInfo.value.icon)

// 模拟文章数据
const articles = ref([
  {
    id: 1,
    title: 'CSS Grid与Flexbox布局的对比分析',
    description: '深入比较两种现代CSS布局技术，了解它们各自的优势和适用场景。',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ff7de4323d2c8b5b54884f35cc64982-Pm6QTeQIpny9dfWxEXHJo72IEm6NRD.png',
    tag: 'CSS',
    date: '2023年9月28日',
    views: 102
  },
  {
    id: 2,
    title: '深入理解ES6+新特性',
    description: '深入解析ES6+的新特性，以及如何在实际项目中高效地运用这些特性。',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ff7de4323d2c8b5b54884f35cc64982-Pm6QTeQIpny9dfWxEXHJo72IEm6NRD.png',
    tag: 'JavaScript',
    date: '2023年8月25日',
    views: 152
  },
  {
    id: 3,
    title: '现代CSS技术与设计趋势',
    description: '探索最新的CSS技术，包括Grid布局、变量等，以及它们如何改变现代网页设计。',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bb39aa1f9a34861c4b69e0af6230758-an9isYh6ReUVV7CwD9jcKNTO7muQTQ.png',
    tag: 'CSS',
    date: '2023年8月14日',
    views: 89
  },
  {
    id: 4,
    title: 'React Hooks完全指南',
    description: '全面介绍React Hooks的使用方法、最佳实践和常见陷阱。',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/940540be69a5aab847b2c4d9a87608e-qOoaFiHO37ZT60oZzJ9EJAcVyXkHHe.png',
    tag: 'React',
    date: '2023年9月15日',
    views: 76
  }
])

// 根据筛选条件过滤文章
const filteredArticles = computed(() => {
  let result = [...articles.value]

  // 根据标签筛选
  if (activeTab.value !== 'all') {
    result = result.filter(article => article.tag.toLowerCase() === activeTab.value)
  }

  // 根据排序方式排序
  if (sortBy.value === 'latest') {
    result.sort((a, b) => new Date(b.date) - new Date(a.date))
  } else if (sortBy.value === 'popular') {
    result.sort((a, b) => b.views - a.views)
  }

  return result
})

const handlePageChange = (page) => {
  currentPage.value = page
  // 在实际应用中，这里会重新获取对应页码的数据
}

onMounted(() => {
  // 在实际应用中，这里会根据路由参数获取对应分类的文章
  console.log('加载分类:', categorySlug.value)
})
</script>

<style scoped>
.category-page {
  max-width: 1200px;
  margin: 0 auto;
}

.category-header {
  display: flex;
  align-items: center;
  padding: 30px;
  margin-bottom: 30px;
}

.category-icon {
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
}

.category-info h1 {
  font-size: 1.8rem;
  margin-bottom: 5px;
}

.filter-container {
  margin-bottom: 30px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.filter-label {
  margin-right: 10px;
  color: var(--light-text);
}

.filter-tabs {
  margin-top: 20px;
  width: 100%;
}

.articles-container {
  margin-bottom: 40px;
}

.article-card {
  margin-bottom: 20px;
  height: 100%;
}

.article-content {
  display: flex;
}

.article-image {
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  margin-right: 15px;
}

.article-details {
  flex: 1;
}

.article-meta {
  margin-bottom: 10px;
}

.article-tag {
  background-color: #e6f7ff;
  color: #1890ff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
}

.article-title {
  font-size: 1.1rem;
  margin-bottom: 10px;
  color: var(--text-color);
}

.article-desc {
  color: var(--light-text);
  margin-bottom: 10px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: 0.9rem;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  color: var(--lighter-text);
  font-size: 0.8rem;
}

.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

@media (max-width: 768px) {
  .article-content {
    flex-direction: column;
  }

  .article-image {
    width: 100%;
    height: 180px;
    margin-right: 0;
    margin-bottom: 15px;
  }
}
</style>