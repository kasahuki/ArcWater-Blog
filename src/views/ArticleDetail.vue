<template>
  <div class="article-detail">
    <el-row :gutter="20">
      <!-- 文章内容 -->
      <el-col :xs="24" :md="18">
        <div class="article-container">
          <div class="article-header">
            <h1 class="article-title">{{ article.title }}</h1>
            <div class="article-meta">
              <span class="article-date">{{ article.date }}</span>
              <span class="article-views">{{ article.views }}次阅读</span>
            </div>
            <div class="article-tags">
              <el-tag size="small" effect="plain" type="primary">{{ article.category }}</el-tag>
              <el-tag size="small" effect="plain" type="info" v-for="tag in article.tags" :key="tag">{{ tag }}</el-tag>
            </div>
          </div>

          <!-- 文章封面图 -->
          <div class="article-cover">
            <img :src="article.image" alt="文章封面" />
          </div>

          <!-- 文章内容 -->
          <div class="article-content">
            <p>{{ article.introduction }}</p>

            <h2>CSS Grid布局简介</h2>
            <p>CSS Grid是一个二维网格布局系统，它彻底改变了我们构建网页布局的方式。与传统的布局方法相比，Grid布局提供了更加灵活和强大的功能。</p>

            <div class="code-block">
              <pre><code>
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  grid-gap: 20px;
}

.grid-item {
  background-color: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
}
              </code></pre>
            </div>

            <p>上面的代码创建了一个自适应的网格布局，每个网格项的最小宽度为250px，最大为1fr（可用空间的一份）。这样的设计在不同屏幕尺寸下都能保持良好的响应性。</p>

            <h2>CSS变量（自定义属性）</h2>
            <p>CSS变量允许我们定义可重用的值，这些值可以在整个样式表中引用。这不仅使代码更加简洁，还提高了可维护性。</p>

            <div class="code-block">
              <pre><code>
:root {
  --primary-color: #4cb8c4;
  --secondary-color: #f9d423;
  --text-color: #333;
}

.element {
  color: var(--text-color);
  background: linear-gradient(90deg, var(--secondary-color), var(--primary-color));
}
              </code></pre>
            </div>

            <p>通过使用CSS变量，我们可以轻松地在整个网站中保持一致的颜色主题，并且只需在一个地方进行修改就能影响所有使用该变量的元素。</p>
          </div>



          <!-- 相关文章 -->
          <div class="related-articles">
            <h3>相关文章</h3>
            <el-row :gutter="20">
              <el-col :xs="24" :sm="12" :md="8" v-for="item in relatedArticles" :key="item.id">
                <router-link :to="`/article/${item.id}`">
                  <el-card class="article-card" shadow="hover">
                    <img :src="item.image" class="related-article-image" alt="相关文章图片" />
                    <h4>{{ item.title }}</h4>
                    <div class="article-footer">
                      <span class="article-date">{{ item.date }}</span>
                    </div>
                  </el-card>
                </router-link>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>

      <!-- 侧边栏 -->
      <el-col :xs="24" :md="6">
        <div class="sidebar">
          <div class="sidebar-section toc">
            <h3>目录</h3>
            <ul class="toc-list">
              <li><a href="#introduction" class="active">简介</a></li>
              <li><a href="#grid">CSS Grid布局简介</a></li>
              <li><a href="#variables">CSS变量（自定义属性）</a></li>
              <li><a href="#conclusion">总结</a></li>
            </ul>
          </div>

          <div class="sidebar-section author-card">
            <h3>Author</h3>
            <div class="author-profile">
              <el-avatar :size="60" src="https://placeholder.com/60x60" />
              <h4>senjay</h4>
              <p>github icon</p>
              <el-button type="primary" plain size="small" @click="$router.push({ name: 'About' })">Follow
                me</el-button>
            </div>
          </div>

          <div class="sidebar-section popular-articles">
            <h3>热门文章</h3>
            <ul class="popular-list">
              <li v-for="(item, index) in popularArticles" :key="index">
                <router-link :to="`/article/${item.id}`">
                  <span class="popular-rank">{{ index + 1 }}</span>
                  <span class="popular-title">{{ item.title }}</span>
                </router-link>
              </li>
            </ul>
          </div>

          <div class="sidebar-section tags">
            <h3>标签云</h3>
            <div class="tag-cloud">
              <router-link to="/tag/css" class="tag-item">CSS</router-link>
              <router-link to="/tag/javascript" class="tag-item">JavaScript</router-link>
              <router-link to="/tag/html" class="tag-item">HTML</router-link>
              <router-link to="/tag/vue" class="tag-item">Vue</router-link>
              <router-link to="/tag/react" class="tag-item">React</router-link>
              <router-link to="/tag/typescript" class="tag-item">TypeScript</router-link>
              <router-link to="/tag/nodejs" class="tag-item">Node.js</router-link>
            </div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Share } from '@element-plus/icons-vue'

const route = useRoute()
const articleId = ref(route.params.id || 1)
// 接收路由过来的id

// 模拟文章数据
const article = ref({
  id: 1,
  title: '现代CSS技术与设计趋势',
  introduction: 'CSS的发展日新月异，现代前端开发中涌现出了许多强大的CSS技术和设计趋势。本文将探索这些技术，并介绍它们如何改变我们的网页设计。',
  image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/bb39aa1f9a34861c4b69e0af6230758-an9isYh6ReUVV7CwD9jcKNTO7muQTQ.png',
  category: 'CSS',
  tags: ['前端', '设计', 'Web开发'],
  date: '2023年8月14日',
  views: 152,
  likes: 45,
  author: '张小明'
})

// 相关文章
const relatedArticles = ref([
  {
    id: 2,
    title: 'CSS Grid与Flexbox布局的对比分析',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ff7de4323d2c8b5b54884f35cc64982-Pm6QTeQIpny9dfWxEXHJo72IEm6NRD.png',
    date: '2023年9月28日'
  },
  {
    id: 3,
    title: 'CSS动画效果实战指南',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/940540be69a5aab847b2c4d9a87608e-qOoaFiHO37ZT60oZzJ9EJAcVyXkHHe.png',
    date: '2023年7月15日'
  },
  {
    id: 4,
    title: '响应式设计最佳实践',
    image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ff7de4323d2c8b5b54884f35cc64982-Pm6QTeQIpny9dfWxEXHJo72IEm6NRD.png',
    date: '2023年6月22日'
  }
])

// 热门文章
const popularArticles = ref([
  { id: 5, title: '2023年前端开发趋势展望' },
  { id: 6, title: 'Vue3与React18：框架对比' },
  { id: 7, title: 'TypeScript高级技巧与实践' },
  { id: 8, title: '前端性能优化完全指南' },
  { id: 9, title: 'CSS Grid布局实战案例分析' }
])

onMounted(() => {
  // 在实际应用中，这里会根据文章ID获取文章详情
  console.log('加载文章:', articleId.value)

  // 模拟滚动监听，实现目录高亮
  window.addEventListener('scroll', handleScroll)
})

const handleScroll = () => {
  // 实际应用中，这里会根据滚动位置更新目录高亮
}
</script>

<style scoped>
.article-detail {
  max-width: 1200px;
  margin: 0 auto;
}

.article-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  padding: 30px;
  margin-bottom: 30px;
}

.article-header {
  margin-bottom: 30px;
}

.article-title {
  font-size: 2rem;
  margin-bottom: 15px;
}

.article-meta {
  display: flex;
  color: var(--lighter-text);
  margin-bottom: 15px;
}

.article-date {
  margin-right: 20px;
}

.article-tags {
  display: flex;
  gap: 10px;
}

.article-cover {
  margin-bottom: 30px;
}

.article-cover img {
  width: 100%;
  border-radius: 8px;
  max-height: 400px;
  object-fit: cover;
}

.article-content {
  font-size: 1.1rem;
  line-height: 1.8;
}

.article-content h2 {
  margin: 30px 0 15px;
  font-size: 1.5rem;
}

.article-content p {
  margin-bottom: 20px;
}



.code-block {
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  margin: 20px 0;
  overflow-x: auto;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
}

.code-block::before {
  content: '';
  height: 12px;
  width: 12px;
  background-color: #ff5f56;
  border-radius: 50%;
  box-shadow:
    20px 0 0 #ffbd2e,
    40px 0 0 #27c93f;
  position: absolute;
  top: 12px;
  left: 12px;
}

.code-block pre {
  margin: 0;
  padding-top: 20px;
  margin-top: 10px;
}

.code-block code {
  font-family: 'SF Mono', SFMono-Regular, ui-monospace, 'Menlo', 'Monaco', 'Cascadia Mono', 'Segoe UI Mono', 'Courier New', monospace;
  color: #333;
  line-height: 1.6;
  font-size: 0.95rem;
}

/* 代码高亮样式 - 类似VSCode深色主题 */
.code-block .keyword {
  color: #569CD6;
}

.code-block .function {
  color: #DCDCAA;
}

.code-block .string {
  color: #CE9178;
}

.code-block .number {
  color: #B5CEA8;
}

.code-block .comment {
  color: #6A9955;
  font-style: italic;
}

.code-block .property {
  color: #9CDCFE;
}

.code-block .selector {
  color: #D7BA7D;
}

.code-block .operator {
  color: #D4D4D4;
}

.code-block .punctuation {
  color: #D4D4D4;
}

/* 深色模式样式 */
@media (prefers-color-scheme: dark) {
  .code-block {
    background-color: rgba(30, 30, 30, 0.7);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .code-block code {
    color: #e0e0e0;
  }

  /* 深色模式下的高亮调整 */
  .code-block .property {
    color: #9CDCFE;
  }

  .code-block .selector {
    color: #D7BA7D;
  }

  .code-block .keyword {
    color: #569CD6;
  }
}


@media (prefers-color-scheme: dark) {
  .code-block {
    background-color: rgba(30, 30, 30, 0.7);
    border-color: rgba(255, 255, 255, 0.1);
  }

  .code-block code {
    color: #e0e0e0;
  }
}


.article-footer {
  margin-top: 40px;
  padding-top: 20px;
  border-top: 1px solid var(--border-color);
}

.article-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.article-author {
  display: flex;
  align-items: center;
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 8px;
}

.author-info {
  margin-left: 15px;
}

.author-info h4 {
  margin: 0 0 5px;
}

.author-info p {
  margin: 0;
  color: var(--light-text);
}

.related-articles {
  margin-top: 40px;
}

.related-articles h3 {
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.related-article-image {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 4px;
  margin-bottom: 10px;
}

/* 侧边栏样式 */
.sidebar {
  position: sticky;
  top: 80px;
}

.sidebar-section {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: var(--card-shadow);
  padding: 20px;
  margin-bottom: 20px;
}

.sidebar-section h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.2rem;
  position: relative;
  padding-left: 12px;
}

.sidebar-section h3::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 16px;
  background-image: var(--primary-gradient);
  border-radius: 2px;
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.toc-list li {
  margin-bottom: 10px;
}

.toc-list a {
  text-decoration: none;
  color: var(--light-text);
  display: block;
  padding: 5px 0;
  transition: all 0.3s ease;
}

.toc-list a:hover,
.toc-list a.active {
  color: #1890ff;
  padding-left: 5px;
}

.author-profile {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.author-profile h4 {
  margin: 10px 0 5px;
}

.author-profile p {
  margin: 0 0 15px;
  color: var(--light-text);
}

.popular-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.popular-list li {
  margin-bottom: 12px;
}

.popular-list a {
  display: flex;
  text-decoration: none;
  color: var(--text-color);
}

.popular-rank {
  background-color: #f0f0f0;
  color: var(--light-text);
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-size: 0.8rem;
}

.popular-list li:nth-child(1) .popular-rank {
  background-color: #f5222d;
  color: white;
}

.popular-list li:nth-child(2) .popular-rank {
  background-color: #fa8c16;
  color: white;
}

.popular-list li:nth-child(3) .popular-rank {
  background-color: #faad14;
  color: white;
}

.popular-title {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-item {
  display: inline-block;
  padding: 5px 10px;
  background-color: #f0f0f0;
  border-radius: 4px;
  color: var(--light-text);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.tag-item:hover {
  background-color: #e6f7ff;
  color: #1890ff;
}

@media (max-width: 768px) {
  .sidebar {
    position: static;
    margin-top: 30px;
  }
}
</style>