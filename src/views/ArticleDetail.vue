<template>
  <div class="article-detail">
    <el-row :gutter="20">
      <!-- 文章内容 -->
      <el-col :xs="24" :md="18">
        <div class="article-container">
          <div class="article-header">
            <h1 class="article-title">{{ article.title }}</h1>
            <div class="article-meta">
              <span class="article-date">{{ dayjs(article.updateTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
              <span class="article-views">{{ article.clickTimes }}次阅读</span>
            </div>
            <div class="article-tags">
              <el-tag size="small" effect="plain" type="primary">{{ categoryName }}</el-tag>
              <el-tag size="small" effect="plain" type="info" v-for="tag in article.tags" :key="tag">{{ tag }}</el-tag>
            </div>
          </div>

          <!-- 文章封面图 -->
          <div class="article-cover">
            <img :src="article.cover" alt="文章封面" />
          </div>

          <!-- 文章内容 -->
          <div class="article-content markdown-body" v-html="article.content">
          </div>

          <!-- 相关文章 -->
          <!-- 相关文章文章数据模型 -->
          <div class="related-articles">
            <h3 class="section-title">
              <span class="title-text">相关文章</span>
              <span class="title-decoration"></span>
            </h3>
            <el-row :gutter="24">
              <el-col :xs="24" :sm="12" :md="8" v-for="item in relatedArticles" :key="item.id">
                <router-link :to="`/article/${item.id}`" class="article-link">
                  <div class="article-card">
                    <div class="image-wrapper">
                      <img :src="item.cover" class="article-image" alt="" />
                      <div class="image-overlay"></div>
                    </div>
                    <div class="card-content">
                      <h4 class="article-title">{{ item.title }}</h4>
                      <div class="article-info">
                        <div class="info-item time">
                          <svg class="icon" viewBox="0 0 24 24">
                            <path
                              d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.2-4.5-2.7V7z" />
                          </svg>
                          <span>{{ dayjs(item.updateTime).format('YYYY-MM-DD HH:mm') }}</span>
                        </div>
                        <div class="info-item views">
                          <svg class="icon" viewBox="0 0 24 24">
                            <path
                              d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zM12 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
                          </svg>
                          <span>{{ formatNumber(item.clickTimes) }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
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
              <li v-for="item in tocItems" :key="item.id">
                <a :href="'#' + item.id" :class="{ active: item.isActive }"
                  :style="{ paddingLeft: (item.level - 1) * 12 + 'px' }" @click.prevent="handleTocClick(item.id)">
                  {{ item.title }}
                </a>
              </li>
            </ul>
          </div>

          <div class="sidebar-section author-card">
            <h3>Author</h3>
            <div class="author-profile">
              <el-avatar :size="60" src="https://placeholder.com/60x60" />
              <h4>senjay</h4>
              <IconBar></IconBar>
              <el-button type="primary" plain size="big" @click="$router.push({ name: 'About' })">
                <span>Follow Me</span>
              </el-button>
            </div>
          </div>

          <div class="sidebar-section popular-articles">
            <h3>热门文章</h3>
            <ul class="popular-list">
              <li v-for="(item, index) in popularArticles" :key="item.id" class="popular-item">
                <router-link :to="`/article/${item.id}`" class="popular-link">
                  <div class="popular-rank" :class="{ 'rank-top': index < 3 }">{{ index + 1 }}</div>
                  <div class="popular-content">
                    <div class="popular-title">{{ item.title }}</div>
                    <div class="popular-meta">
                      <span class="popular-views"><i class="el-icon-view"></i> {{ item.clickTimes }}次阅读</span>
                      <span class="popular-time">{{ dayjs(item.updateTime).format('YYYY-MM-DD HH:mm') }}</span>
                    </div>
                  </div>
                </router-link>
              </li>
            </ul>
          </div>

          <!-- tag cloud 部分先不弄 -->
          <div class="sidebar-section tags">
            <h3>标签云</h3>
            <div class="tag-cloud">

            </div>
          </div>

        </div>
      </el-col>
    </el-row>

    <!-- 全屏代码抽屉 -->
    <div class="fullscreen-drawer" :class="{ active: isFullscreenActive }">
      <div class="drawer-header">
        <span class="drawer-title">{{ currentLanguage }}</span>
        <div class="drawer-actions">
          <button class="drawer-btn" @click="copyFullscreenCode">复制</button>
          <button class="drawer-btn close-btn" @click="closeFullscreen">关闭</button>
        </div>
      </div>
      <div class="drawer-content">
        <pre><code :class="`language-${currentLanguage}`" ref="fullscreenCodeBlock">{{ currentCode }}</code></pre>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Share } from '@element-plus/icons-vue'
import IconBar from '../components/IconBar.vue'
import { articleDetailService, relatedArticleService, hotArticleService } from '@/api/article'
import { categoryGetService } from '@/api/category'
import { marked } from 'marked'
import dayjs from 'dayjs'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
// 导入需要的语言支持
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-sql'
import 'prismjs/plugins/line-numbers/prism-line-numbers.css'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
// 添加dayjs插件支持相对时间
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn' // 导入中文语言包
// 激活插件
dayjs.extend(relativeTime)
dayjs.locale('zh-cn') // 使用中文

//#region 状态变量定义
const route = useRoute()
const articleId = ref(route.params.id || 1)
const categoryName = ref('')
const tocItems = ref([]) // 存储目录项

// 添加全屏代码相关状态
const isFullscreenActive = ref(false)
const currentCode = ref('')
const currentLanguage = ref('plaintext')
const fullscreenCodeBlock = ref(null)

// 初始化文章数据结构
const article = ref({
  title: '',
  content: '',
  updateTime: '',
  clickTimes: 0,
  cover: '',
  categoryId: '',
  tags: []
})

// 相关文章
const relatedArticles = ref([''])

// 热门文章
const popularArticles = ref([''])
//#endregion

//#region Markdown配置与处理
// 恢复原始marked配置，移除自定义渲染器
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false,
  sanitize: false,
  highlight: function (code, lang) {
    if (Prism.languages[lang]) {
      try {
        return Prism.highlight(code, Prism.languages[lang], lang)
      } catch (e) {
        console.error('代码高亮失败:', e)
      }
    }
    return code
  }
})

// 处理文章内容，手动添加按钮到代码块
const processArticleContent = (htmlContent) => {
  if (!htmlContent) return '';

  // 匹配所有代码块
  return htmlContent.replace(/<pre><code class="language-([^"]+)">([\s\S]*?)<\/code><\/pre>/g, (match, language, code) => {
    // 生成唯一ID
    const codeId = 'code-' + Math.random().toString(36).substring(2, 9);

    // 确保code是一个字符串
    const codeContent = (code || '').toString();

    // 创建一个带按钮的代码块
    return `
      <div class="code-wrapper">
        <div class="code-actions">
          <button class="code-btn copy-btn" onclick="window._copyCode('${codeId}')" title="复制">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
          </button>
          <button class="code-btn fullscreen-btn" onclick="window._showFullscreen('${codeId}', '${language}')" title="全屏">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
            </svg>
          </button>
        </div>
        <textarea id="${codeId}" style="display:none">${codeContent}</textarea>
        <pre><code class="language-${language}">${code}</code></pre>
      </div>
    `;
  });
}
//#endregion

//#region 文章标题和目录处理
// 处理标题提取
const extractHeaders = (content) => {
  const headers = []
  const lines = content.split('\n')
  const headerPattern = /^(#{1,6})\s+(.+)$/

  lines.forEach((line, index) => {
    const match = line.match(headerPattern)
    if (match) {
      const level = match[1].length
      const title = match[2]
      const id = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      headers.push({
        level,
        title,
        id,
        isActive: false
      })
    }
  })

  return headers
}

// 处理目录点击
const handleTocClick = (id) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

// 处理滚动高亮
const handleScroll = () => {
  if (tocItems.value.length === 0) return

  const headers = tocItems.value.map(item => ({
    element: document.getElementById(item.id),
    id: item.id
  })).filter(item => item.element)

  const scrollPosition = window.scrollY + 100 // 添加偏移量以提前高亮

  // 重置所有项的激活状态
  tocItems.value.forEach(item => item.isActive = false)

  // 找到当前滚动位置对应的标题
  for (let i = headers.length - 1; i >= 0; i--) {
    const { element, id } = headers[i]
    if (element.offsetTop <= scrollPosition) {
      const tocItem = tocItems.value.find(item => item.id === id)
      if (tocItem) {
        tocItem.isActive = true
      }
      break
    }
  }
}
//#endregion

//#region 代码块复制和全屏功能
// 添加处理函数
const copyCode = (codeText) => {
  try {
    navigator.clipboard.writeText(codeText).then(() => {
      showToast('复制成功')
    }).catch(err => {
      console.error('复制失败:', err)
      showToast('复制失败', 'error')
    })
  } catch (error) {
    console.error('复制失败:', error)
    showToast('复制失败', 'error')
  }
}

const copyFullscreenCode = () => {
  copyCode(currentCode.value)
}

const showFullscreen = (codeText, language) => {
  document.body.style.overflow = 'hidden' // 防止滚动
  currentCode.value = codeText
  currentLanguage.value = language || 'plaintext'
  isFullscreenActive.value = true

  // 在下一个 tick 中高亮代码
  nextTick(() => {
    if (fullscreenCodeBlock.value) {
      Prism.highlightElement(fullscreenCodeBlock.value)
    }
  })
}

const closeFullscreen = () => {
  isFullscreenActive.value = false
  document.body.style.overflow = '' // 恢复滚动
}

// 显示提示信息
const showToast = (message, type = 'success') => {
  // 检查是否已有toast
  const existingToast = document.querySelector('.code-toast')
  if (existingToast) {
    document.body.removeChild(existingToast)
  }

  const toast = document.createElement('div')
  toast.className = `code-toast ${type}`
  toast.textContent = message
  document.body.appendChild(toast)

  // 显示提示
  setTimeout(() => toast.classList.add('show'), 10)

  // 自动隐藏
  setTimeout(() => {
    toast.classList.remove('show')
    setTimeout(() => document.body.removeChild(toast), 300)
  }, 2000)
}

// 初始化按钮事件
const initCodeButtons = () => {
  // 设置全局复制函数
  window._copyCode = (codeId) => {
    const codeEl = document.getElementById(codeId);
    if (codeEl) {
      copyCode(codeEl.value || codeEl.textContent);
    }
  };

  // 设置全局全屏函数
  window._showFullscreen = (codeId, language) => {
    const codeEl = document.getElementById(codeId);
    if (codeEl) {
      showFullscreen(codeEl.value || codeEl.textContent, language);
    }
  };
}
//#endregion

//#region 数据获取和加载
// 获取文章详情
const getArticleDetail = async () => {
  try {
    const res = await articleDetailService(articleId.value)
    if (res.data && res.data.content) {
      // 提取标题生成目录
      tocItems.value = extractHeaders(res.data.content)

      // 为每个标题添加 id
      tocItems.value.forEach(item => {
        const pattern = new RegExp(`(#{${item.level}})\\s+(${item.title})`, 'g')
        res.data.content = res.data.content.replace(
          pattern,
          `$1 <span id="${item.id}">$2</span>`
        )
      })

      // 转换 Markdown 为 HTML
      const htmlContent = marked(res.data.content)

      // 处理HTML内容，添加代码块按钮
      res.data.content = processArticleContent(htmlContent)

      // 在下一个 tick 中初始化
      nextTick(() => {
        Prism.highlightAll()
        initCodeButtons()
      })
    }
    article.value = res.data
  } catch (error) {
    console.error('获取文章详情失败:', error)
  }
}

const getCategoryName = async () => {
  const res = await categoryGetService(article.value.categoryId)
  categoryName.value = res.data.categoryName
}

// 获取相关文章
const getRelatedArticles = async () => {
  try {
    const res = await relatedArticleService(
      {
        categoryId: article.value.categoryId,
        count: 3,
        id: article.value.id
      }
    )

    if (res.data) {
      relatedArticles.value = res.data
    }
  } catch (error) {
    console.error('获取相关文章失败:', error)
  }
}

// 获取热门文章
const getHotArticles = async () => {
  try {
    const res = await hotArticleService(8)
    if (res.data) {
      popularArticles.value = res.data
    }
  } catch (error) {
    console.error('获取热门文章失败:', error)
  }
}

const loadData = async () => {
  await getArticleDetail()
  await getCategoryName()
  await getRelatedArticles()
  await getHotArticles()
}
watch(() => route.params.id, async (newId) => {
  if (newId) {
    console.log('文章变化，加载新文章：', newId)

    // 重置状态
    tocItems.value = []
    relatedArticles.value = []
    popularArticles.value = []
    article.value = {}
    articleId.value = newId
    // 获取新文章信息
    await loadData()

  }
}, { immediate: true })

//#endregion

//#region 生命周期钩子
onMounted(() => {
  // 加载数据
  loadData()

  // 监听滚动事件，实现目录高亮
  window.addEventListener('scroll', handleScroll)
})

// 在组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window._copyCode = null;
  window._showFullscreen = null;
  if (isFullscreenActive.value) {
    document.body.style.overflow = ''; // 恢复滚动
  }
});
//#endregion

//#region 格式化函数
// 格式化相对时间
const formatRelativeTime = (dateTime) => {
  if (!dateTime) return '未知时间'
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm')
}

// 格式化时间
const formatTimeAgo = (dateTime) => {
  if (!dateTime) return '未知时间'
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm')
}

// 格式化阅读次数
const formatNumber = (clickTimes) => {
  if (clickTimes >= 1000000) {
    return (clickTimes / 1000000).toFixed(2) + 'M'
  } else if (clickTimes >= 10000) {
    return (clickTimes / 1000).toFixed(2) + 'K'
  } else {
    return clickTimes.toString()
  }
}
//#endregion
</script>

<style scoped>
.article-detail {
  max-width: 1450px;
  margin-left: 9rem;
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
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  hyphens: auto;
  max-width: 100%;
}

.article-content :deep(pre),
.article-content :deep(code) {
  white-space: pre-wrap;
  overflow-x: auto;
  max-width: 100%;
}

.article-content :deep(img) {
  max-width: 100%;
  height: auto;
}

.article-content h2 {
  margin: 30px 0 15px;
  font-size: 1.5rem;
}

.article-content p {
  margin-bottom: 20px;
}

.code-block {
  position: relative;
  margin: 1.5em 0;
  background: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.code-block pre {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  max-width: 100%;
}

.code-block code {
  font-family: 'SF Mono', Monaco, Menlo, Consolas, 'Courier New', monospace;
  font-size: 0.9em;
  line-height: 1.5;
  padding: 0;
  max-width: 100%;
  display: block;
}

/* Markdown 内容样式 */
:deep(.markdown-body) {
  color: var(--el-text-color-primary);
  font-size: 1.1rem;
  line-height: 1.8;
  overflow-wrap: break-word;
  word-wrap: break-word;
  max-width: 100%;
}

:deep(.markdown-body h1),
:deep(.markdown-body h2),
:deep(.markdown-body h3),
:deep(.markdown-body h4),
:deep(.markdown-body h5),
:deep(.markdown-body h6) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
  max-width: 100%;
  overflow-wrap: break-word;
}

:deep(.markdown-body p) {
  margin-bottom: 16px;
  max-width: 100%;
  overflow-wrap: break-word;
}

:deep(.markdown-body *) {
  max-width: 100%;
}

:deep(.markdown-body a) {
  color: var(--el-color-primary);
  text-decoration: none;
  word-break: break-all;
}

:deep(.markdown-body pre) {
  overflow-x: auto;
  max-width: 100%;
}

:deep(.markdown-body img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 16px 0;
}

:deep(.markdown-body blockquote) {
  padding: 0 1em;
  color: var(--el-text-color-secondary);
  border-left: 0.25em solid var(--el-border-color);
  margin: 16px 0;
  max-width: 100%;
}

:deep(.markdown-body table) {
  display: block;
  width: 100%;
  overflow-x: auto;
  margin: 16px 0;
  border-spacing: 0;
  border-collapse: collapse;
}

:deep(.markdown-body table th),
:deep(.markdown-body table td) {
  padding: 6px 13px;
  border: 1px solid var(--el-border-color);
  min-width: 60px;
  word-break: break-word;
}

/* 代码高亮颜色 */
:deep(.keyword) {
  color: #569CD6;
}

:deep(.string) {
  color: #CE9178;
}

:deep(.comment) {
  color: #6A9955;
  font-style: italic;
}

:deep(.number) {
  color: #B5CEA8;
}

.article-footer {
  display: flex;
  justify-content: space-between;
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
  margin: 48px 0;
  padding: 0 16px;
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
}

.article-card {
  background: var(--el-bg-color);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
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
  padding: 16px;
}

.article-title {
  font-family: -apple-system, SF Pro Text, sans-serif;
  font-size: 16px;
  font-weight: 500;
  color: var(--el-text-color-primary);
  margin: 0 0 12px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.article-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  color: var(--el-text-color-secondary);
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
  margin-bottom: 12px;
}

.toc-list a {
  text-decoration: none;
  color: var(--el-text-color-regular);
  display: block;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  line-height: 1.4;
}

.toc-list a:hover,
.toc-list a.active {
  color: var(--el-color-primary);
  background-color: var(--el-color-primary-light-9);
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

.popular-item {
  margin-bottom: 16px;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.popular-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  background-color: var(--el-color-primary-light-9);
}

.popular-link {
  display: flex;
  text-decoration: none;
  color: var(--el-text-color-primary);
  padding: 10px;
  border-radius: 8px;
}

.popular-rank {
  min-width: 24px;
  height: 24px;
  border-radius: 4px;
  background-color: var(--el-fill-color);
  color: var(--el-text-color-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  margin-right: 12px;
}

.popular-rank.rank-top {
  background: linear-gradient(135deg, var(--el-color-danger) 0%, var(--el-color-danger-light-3) 100%);
  color: white;
  box-shadow: 0 2px 6px rgba(245, 108, 108, 0.4);
}

.popular-content {
  flex: 1;
  overflow: hidden;
}

.popular-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--el-text-color-primary);
  transition: color 0.3s;
}

.popular-item:hover .popular-title {
  color: var(--el-color-primary);
}

.popular-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.popular-views,
.popular-time {
  display: flex;
  align-items: center;
}

.popular-views i {
  margin-right: 4px;
  font-size: 14px;
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

/* Markdown 样式 */
.markdown-body {
  color: var(--el-text-color-primary);
  line-height: 1.8;
  font-size: 1.1rem;
}

.markdown-body :deep(h1),
.markdown-body :deep(h2),
.markdown-body :deep(h3),
.markdown-body :deep(h4),
.markdown-body :deep(h5),
.markdown-body :deep(h6) {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
  color: var(--el-text-color-primary);
}

.markdown-body :deep(h1) {
  font-size: 2em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--el-border-color-light);
}

.markdown-body :deep(h2) {
  font-size: 1.5em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid var(--el-border-color-light);
}

.markdown-body :deep(h3) {
  font-size: 1.25em;
}

.markdown-body :deep(p) {
  margin-bottom: 16px;
  line-height: 1.8;
}

.markdown-body :deep(code) {
  padding: 0.2em 0.4em;
  margin: 0;
  font-size: 85%;
  background-color: var(--el-fill-color-light);
  border-radius: 3px;
  font-family: 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
}

.markdown-body :deep(pre) {
  padding: 16px;
  overflow: auto;
  font-size: 85%;
  line-height: 1.45;
  background-color: var(--el-fill-color-light);
  border-radius: 6px;
  margin-bottom: 16px;
}

.markdown-body :deep(pre code) {
  padding: 0;
  margin: 0;
  font-size: 100%;
  word-break: normal;
  white-space: pre;
  background: transparent;
  border: 0;
}

.markdown-body :deep(blockquote) {
  padding: 0 1em;
  color: var(--el-text-color-secondary);
  border-left: 0.25em solid var(--el-border-color);
  margin: 0 0 16px 0;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  padding-left: 2em;
  margin-bottom: 16px;
}

.markdown-body :deep(li) {
  margin-bottom: 8px;
}

.markdown-body :deep(img) {
  max-width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  margin: 16px 0;
}

.markdown-body :deep(table) {
  display: block;
  width: 100%;
  overflow: auto;
  margin-bottom: 16px;
  border-spacing: 0;
  border-collapse: collapse;
}

.markdown-body :deep(table th),
.markdown-body :deep(table td) {
  padding: 6px 13px;
  border: 1px solid var(--el-border-color);
}

.markdown-body :deep(table tr) {
  background-color: var(--el-bg-color);
  border-top: 1px solid var(--el-border-color);
}

.markdown-body :deep(table tr:nth-child(2n)) {
  background-color: var(--el-fill-color-lighter);
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {

  .markdown-body :deep(pre),
  .markdown-body :deep(code) {
    background-color: var(--el-bg-color-overlay);
  }

  .markdown-body :deep(blockquote) {
    border-left-color: var(--el-border-color-darker);
  }

  .markdown-body :deep(table tr) {
    background-color: var(--el-bg-color-overlay);
  }

  .markdown-body :deep(table tr:nth-child(2n)) {
    background-color: var(--el-fill-color-dark);
  }
}

/* Prism 代码块样式优化 */
:deep(.markdown-body pre[class*="language-"]) {
  margin: 1.5em 0;
  padding: 1em;
  overflow: auto;
  border-radius: 8px;
  background: #2d2d2d;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

:deep(.markdown-body pre[class*="language-"]) code {
  font-family: 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;
  font-size: 0.9em;
  line-height: 1.5;
  text-shadow: none;
}

:deep(.line-numbers .line-numbers-rows) {
  border-right: 1px solid #999;
  padding-right: 0.8em;
}

/* 深色模式适配 */
@media (prefers-color-scheme: dark) {
  :deep(.markdown-body pre[class*="language-"]) {
    background: #1e1e1e;
  }
}

/* 代码块顶部样式 */
:deep(.markdown-body pre[class*="language-"])::before {
  content: '';
  display: block;
  height: 12px;
  width: 12px;
  background: #ff5f56;
  border-radius: 50%;
  box-shadow:
    20px 0 0 #ffbd2e,
    40px 0 0 #27c93f;
  margin-bottom: 0.8em;
}

/* 优化行号显示 */
:deep(.line-numbers-rows > span::before) {
  color: #888;
}

/* 滚动条美化 */
:deep(.markdown-body pre[class*="language-"])::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

:deep(.markdown-body pre[class*="language-"])::-webkit-scrollbar-thumb {
  background: #666;
  border-radius: 4px;
}

:deep(.markdown-body pre[class*="language-"])::-webkit-scrollbar-track {
  background: #2d2d2d;
  border-radius: 4px;
}

/* 代码块按钮样式 */
.markdown-body :deep(.code-wrapper) {
  position: relative;
}

.markdown-body :deep(.code-actions) {
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  gap: 6px;
  z-index: 20;
  opacity: 0;
  transition: opacity 0.2s;
}

.markdown-body :deep(.code-wrapper:hover .code-actions) {
  opacity: 1;
}

.markdown-body :deep(.code-btn) {
  width: 24px;
  height: 24px;
  background: rgba(30, 30, 30, 0.7);
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.markdown-body :deep(.code-btn:hover) {
  background: rgba(50, 50, 50, 0.9);
  transform: scale(1.1);
}

/* 全屏抽屉样式 */
.fullscreen-drawer {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.9);
  z-index: 9999;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
}

.fullscreen-drawer.active {
  transform: translateY(0);
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background-color: #1e1e1e;
  border-bottom: 1px solid #333;
}

.drawer-title {
  color: #e0e0e0;
  font-size: 14px;
  text-transform: uppercase;
}

.drawer-actions {
  display: flex;
  gap: 10px;
}

.drawer-btn {
  background-color: transparent;
  color: #e0e0e0;
  border: 1px solid #444;
  border-radius: 4px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.drawer-btn:hover {
  background-color: #333;
}

.close-btn {
  color: #f56c6c;
  border-color: #f56c6c;
}

.close-btn:hover {
  background-color: rgba(245, 108, 108, 0.1);
}

.drawer-content {
  flex: 1;
  overflow: auto;
  background-color: #1e1e1e;
  padding: 20px;
}

.drawer-content pre {
  margin: 0;
  height: 100%;
  overflow: auto;
  background: transparent;
}

.drawer-content code {
  font-family: 'SF Mono', Monaco, Menlo, Consolas, 'Courier New', monospace;
  font-size: 14px;
  line-height: 1.5;
}

/* 提示消息样式 */
:global(.code-toast) {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 16px;
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.7);
  color: #fff;
  z-index: 10000;
  opacity: 0;
  transform: translateY(-10px);
  transition: all 0.3s;
}

:global(.code-toast.show) {
  opacity: 1;
  transform: translateY(0);
}

:global(.code-toast.success) {
  border-left: 3px solid #67c23a;
}

:global(.code-toast.error) {
  border-left: 3px solid #f56c6c;
}
</style>