<template>
  <div class="article-detail">
    <el-row :gutter="20">
      <!-- 文章内容 -->
      <el-col :xs="24" :md="18">
        <div class="article-container">
          <div class="article-header">
            <h1 class="article-title">{{ article.title || '加载中...' }}</h1>
            <div class="article-meta">
              <span class="article-date">{{ article.updateTime ? dayjs(article.updateTime).format('YYYY-MM-DD HH:mm:ss')
                : '未知时间' }}</span>
              <span class="article-views">{{ article.clickTimes || 0 }}次阅读</span>
            </div>
            <div class="article-tags">
              <el-tag size="small" effect="plain" type="primary">{{ categoryName || '未分类' }}</el-tag>
              <el-tag size="small" effect="plain" type="info" v-for="tag in (article.tags || [])" :key="tag">{{ tag
              }}</el-tag>
            </div>
          </div>

          <!-- 文章封面图 -->
          <div class="article-cover" v-if="article.cover">
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
              <el-col :xs="24" :sm="12" :md="8" v-for="item in (relatedArticles || [])" :key="item.id">
                <router-link :to="`/article/${item.id}`" class="article-link">
                  <div class="article-card">
                    <div class="image-wrapper">
                      <img :src="item.cover || 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=暂无封面'"
                        class="article-image" alt="" />
                      <div class="image-overlay"></div>
                    </div>
                    <div class="card-content">
                      <h4 class="article-title">{{ item.title || '无标题' }}</h4>
                      <div class="article-info">
                        <div class="info-item time">
                          <svg class="icon" viewBox="0 0 24 24">
                            <path
                              d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm0 18c-4.4 0-8-3.6-8-8s3.6-8 8-8 8 3.6 8 8-3.6 8-8 8zm.5-13H11v6l5.2 3.2.8-1.2-4.5-2.7V7z" />
                          </svg>
                          <span>{{ item.updateTime ? dayjs(item.updateTime).format('YYYY-MM-DD HH:mm') : '未知时间'
                            }}</span>
                        </div>
                        <div class="info-item views">
                          <svg class="icon" viewBox="0 0 24 24">
                            <path
                              d="M12 4.5C7 4.5 2.7 7.6 1 12c1.7 4.4 6 7.5 11 7.5s9.3-3.1 11-7.5c-1.7-4.4-6-7.5-11-7.5zM12 17c-2.8 0-5-2.2-5-5s2.2-5 5-5 5 2.2 5 5-2.2 5-5 5zm0-8c-1.7 0-3 1.3-3 3s1.3 3 3 3 3-1.3 3-3-1.3-3-3-3z" />
                          </svg>
                          <span>{{ formatNumber(item.clickTimes || 0) }}</span>
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
            <div class="toc-header">
              <h3>目录</h3>
              <div class="toc-tree-btns">
                <button class="toc-tree-btn" @click="expandAllToc" title="全部展开">
                  <el-icon>
                    <ArrowDown />
                  </el-icon>
                </button>
                <button class="toc-tree-btn" @click="collapseAllToc" title="全部折叠">
                  <el-icon>
                    <ArrowUp />
                  </el-icon>
                </button>
              </div>
            </div>
            <ul class="toc-list">
              <TocTreeNode v-for="item in tocTree" :key="item.id" :node="item" @toc-click="handleTocClick" />
            </ul>
          </div>

          <div class="sidebar-section author-card">
            <h3>Author</h3>
            <div class="author-profile">
              <el-avatar :size="60" src="https://via.placeholder.com/60x60/4A90E2/FFFFFF?text=头像" />
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
              <li v-for="(item, index) in (popularArticles || [])" :key="item.id" class="popular-item">
                <router-link :to="`/article/${item.id}`" class="popular-link">
                  <div class="popular-rank" :class="{ 'rank-top': index < 3 }">{{ index + 1 }}</div>
                  <div class="popular-content">
                    <div class="popular-title">{{ item.title || '无标题' }}</div>
                    <div class="popular-meta">
                      <span class="popular-views"><i class="el-icon-view"></i> {{ item.clickTimes || 0 }}次阅读</span>
                      <span class="popular-time">{{ item.updateTime ? dayjs(item.updateTime).format('YYYY-MM-DD HH:mm')
                        : '未知时间' }}</span>
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
      <div class="drawer-header" @dblclick="closeFullscreen">
        <span class="drawer-title">{{ currentLanguage }}</span>
        <span class="apple-dots">
          <span class="dot dot-red" @click="closeFullscreen"></span>
          <span class="dot dot-yellow" @click="copyFullscreenCode"></span>
          <span class="dot dot-green" @click="toggleFullscreenBg"></span>
        </span>
      </div>
      <div class="drawer-content" :class="{ 'white-bg': fullscreenWhiteBg }">
        <pre><code :class="`language-${currentLanguage}`" ref="fullscreenCodeBlock">{{ currentCode }}</code></pre>
      </div>
    </div>

    <div class="float-btns-group">
      <div class="float-btn toc-btn" @click="openTocDrawer">
        <el-icon>
          <Menu />
        </el-icon>
      </div>
      <div class="float-btn share-btn" ref="shareBtnRef" @click="toggleShareCapsule">
        <el-icon>
          <Share />
        </el-icon>
      </div>
      <div v-if="showFloatBtns" class="float-btn top-btn" @click="scrollToTop">
        <el-icon>
          <ArrowUp />
        </el-icon>
      </div>
      <!-- 竖直胶囊弹窗 -->
      <transition name="capsule-fade">
        <div v-if="showShareCapsule" class="share-capsule-vertical" @click.stop>
          <MoreButton @click="copyShareLink">复制链接</MoreButton>
          <MoreButton @click="downloadCurrentHtml">下载HTML</MoreButton>
        </div>
      </transition>
    </div>
    <transition name="drawer-slide">
      <div v-if="showTocDrawer" class="toc-drawer-mask" @click="handleDrawerMaskClick">
        <div class="toc-drawer-glass" @click.stop>
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 15px;">
            <span class="apple-dots">
              <span class="dot dot-red" @click="closeTocDrawer"></span>
              <span class="dot dot-yellow"></span>
              <span class="dot dot-green"></span>
            </span>
            <span class="drawer-title">目录</span>
            <div class="toc-tree-btns">
              <button class="toc-tree-btn" @click="expandAllToc" title="全部展开">
                <el-icon>
                  <ArrowDown />
                </el-icon>
              </button>
              <button class="toc-tree-btn" @click="collapseAllToc" title="全部折叠">
                <el-icon>
                  <ArrowUp />
                </el-icon>
              </button>
            </div>
          </div>
          <ul class="drawer-toc-list">
            <TocTreeNode v-for="item in tocTree" :key="item.id" :node="item" @toc-click="handleDrawerTocClick" />
          </ul>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Share, ArrowUp, Menu, ArrowDown } from '@element-plus/icons-vue'
import IconBar from '../components/IconBar.vue'
import { articleDetailService, relatedArticleService, hotArticleService } from '@/api/article'
import { categoryGetService } from '@/api/category'
import { marked } from 'marked'
import dayjs from 'dayjs'
import { highlightAll } from '@/util/prism-language'
// 添加dayjs插件支持相对时间
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn' // 导入中文语言包
// 激活插件
dayjs.extend(relativeTime)
dayjs.locale('zh-cn') // 使用中文

import MoreButton from '@/components/MoreButton.vue'
import TocTreeNode from '../components/TocTreeNode.vue'

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
const fullscreenWhiteBg = ref(false)

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
const relatedArticles = ref([])

// 热门文章
const popularArticles = ref([])

const showShareCapsule = ref(false)
const shareBtnRef = ref(null)
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

// 支持==高亮==语法
const highlightMarkdown = (md) => {
  // 只处理非代码块内的==内容==
  return md.replace(/==([^=]+)==/g, '<span class="md-highlight">$1</span>');
}

// 处理文章内容，手动添加按钮到代码块
const processArticleContent = (htmlContent) => {
  if (!htmlContent) return '';

  // 在处理前先应用高亮
  htmlContent = htmlContent.replace(/==([^=]+)==/g, '<span class="md-highlight">$1</span>');

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
  let inCodeBlock = false
  let codeBlockFence = ''

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    // 检查代码块起止
    const codeBlockStart = line.match(/^(```|~~~)/)
    if (codeBlockStart) {
      if (!inCodeBlock) {
        inCodeBlock = true
        codeBlockFence = codeBlockStart[1]
        continue
      } else if (inCodeBlock && line.startsWith(codeBlockFence)) {
        inCodeBlock = false
        codeBlockFence = ''
        continue
      }
    }
    if (inCodeBlock) continue // 跳过代码块内

    const match = line.match(headerPattern)
    if (match) {
      const level = match[1].length
      const title = match[2].trim()
      // 高亮处理
      const htmlTitle = title.replace(/==([^=]+)==/g, '<span class="md-highlight">$1</span>')
      let id = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '')
      if (!id) id = `header-${i}`
      let uniqueId = id
      let counter = 1
      while (headers.some(h => h.id === uniqueId)) {
        uniqueId = `${id}-${counter}`
        counter++
      }
      headers.push({
        level,
        title, // 原始文本
        htmlTitle, // 高亮HTML
        id: uniqueId,
        isActive: false
      })
    }
  }
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

const toggleFullscreenBg = () => {
  fullscreenWhiteBg.value = !fullscreenWhiteBg.value
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

      // 为每个标题添加 id - 使用更安全的方法
      tocItems.value.forEach(item => {
        // 使用更精确的匹配方式，避免正则表达式问题
        const lines = res.data.content.split('\n')
        const updatedLines = lines.map(line => {
          const headerMatch = line.match(new RegExp(`^(#{${item.level}})\\s+(.+)$`))
          if (headerMatch && headerMatch[2].trim() === item.title) {
            return `${headerMatch[1]} <span id="${item.id}">${headerMatch[2]}</span>`
          }
          return line
        })
        res.data.content = updatedLines.join('\n')
      })

      // 转换 Markdown 为 HTML
      const htmlContent = marked(highlightMarkdown(res.data.content))

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
  // 添加categoryId检查，避免undefined
  if (!article.value.categoryId) {
    console.warn('categoryId is undefined, skipping category name fetch')
    categoryName.value = '未分类'
    return
  }

  try {
    const res = await categoryGetService(article.value.categoryId)
    categoryName.value = res.data.categoryName
  } catch (error) {
    console.error('获取分类名称失败:', error)
    categoryName.value = '未分类'
  }
}

// 获取相关文章
const getRelatedArticles = async () => {
  try {
    // 添加categoryId检查
    if (!article.value.categoryId) {
      console.warn('categoryId is undefined, skipping related articles fetch')
      relatedArticles.value = []
      return
    }

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
    relatedArticles.value = []
  }
}

// 获取热门文章
const getHotArticles = async () => {
  try {
    const res = await hotArticleService(8)
    if (res.data) {
      popularArticles.value = res.data
    } else {
      popularArticles.value = []
    }
  } catch (error) {
    console.error('获取热门文章失败:', error)
    popularArticles.value = []
  }
}

const loadData = async () => {
  try {
    // 首先获取文章详情
    await getArticleDetail()

    // 只有在成功获取文章详情后才获取其他数据
    if (article.value && article.value.id) {
      await Promise.all([
        getCategoryName(),
        getRelatedArticles(),
        getHotArticles()
      ])
    }
  } catch (error) {
    console.error('加载数据失败:', error)
  }
}
watch(() => route.params.id, async (newId) => {
  if (newId) {
    console.log('文章变化，加载新文章：', newId)

    // 重置状态
    tocItems.value = []
    relatedArticles.value = []
    popularArticles.value = []
    categoryName.value = ''
    article.value = {
      title: '',
      content: '',
      updateTime: '',
      clickTimes: 0,
      cover: '',
      categoryId: '',
      tags: []
    }
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
  window.addEventListener('scroll', handleFloatBtnShow)
})

// 在组件卸载时清理
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('scroll', handleFloatBtnShow);
  window._copyCode = null;
  window._showFullscreen = null;
  if (isFullscreenActive.value) {
    document.body.style.overflow = ''; // 恢复滚动
  }
  document.removeEventListener('click', handleCapsuleOutsideClick)
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

// 回到顶部方法
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 目录抽屉显示状态
const showTocDrawer = ref(false)
const openTocDrawer = () => { showTocDrawer.value = true }
const closeTocDrawer = () => { showTocDrawer.value = false }

// 点击遮罩关闭目录抽屉
const handleDrawerMaskClick = (e) => {
  // 只在点击遮罩本身时关闭
  if (e.target.classList.contains('toc-drawer-mask')) closeTocDrawer()
}

// 页面滚动到一半才显示按钮
const showFloatBtns = ref(false)
const handleFloatBtnShow = () => {
  const scrollY = window.scrollY || document.documentElement.scrollTop
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  showFloatBtns.value = scrollY > docHeight / 2
}

// 目录抽屉点击目录项跳转
const handleDrawerTocClick = (id) => {
  closeTocDrawer()
  nextTick(() => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  })
}

// 在 <script setup> 里添加
const goToChatGPT = () => {
  const url = `https://chat.openai.com/?code=${encodeURIComponent(currentCode.value)}`
  window.open(url, '_blank')
}

const toggleShareCapsule = () => {
  showShareCapsule.value = !showShareCapsule.value
  if (showShareCapsule.value) {
    nextTick(() => {
      document.addEventListener('click', handleCapsuleOutsideClick)
    })
  } else {
    document.removeEventListener('click', handleCapsuleOutsideClick)
  }
}

const handleCapsuleOutsideClick = (e) => {
  // 如果点击的不是分享按钮或胶囊本身，则关闭
  if (
    shareBtnRef.value &&
    !shareBtnRef.value.contains(e.target) &&
    !e.target.closest('.share-capsule-vertical')
  ) {
    showShareCapsule.value = false
    document.removeEventListener('click', handleCapsuleOutsideClick)
  }
}

const copyShareLink = () => {
  const url = window.location.origin + '/article/' + articleId.value
  navigator.clipboard.writeText(url).then(() => {
    showToast('分享链接已复制到剪贴板')
  }).catch(() => {
    showToast('复制失败', 'error')
  })
  showShareCapsule.value = false
  document.removeEventListener('click', handleCapsuleOutsideClick)
}

const downloadCurrentHtml = () => {
  const html = document.documentElement.outerHTML
  const blob = new Blob([html], { type: 'text/html' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `article-${articleId.value}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  showToast('HTML页面已下载')
  showShareCapsule.value = false
  document.removeEventListener('click', handleCapsuleOutsideClick)
}

// 目录树形结构转换
const buildTocTree = (flatList) => {
  const root = []
  const stack = []
  flatList.forEach(item => {
    item.children = []
    item.isCollapsed = false
  })
  for (let i = 0; i < flatList.length; i++) {
    const item = flatList[i]
    while (stack.length && stack[stack.length - 1].level >= item.level) {
      stack.pop()
    }
    if (stack.length === 0) {
      root.push(item)
    } else {
      stack[stack.length - 1].children.push(item)
    }
    stack.push(item)
  }
  return root
}
const tocTree = ref([])
watch(tocItems, (newVal) => {
  tocTree.value = buildTocTree(newVal)
}, { immediate: true })

// 一键展开/折叠
const expandAllToc = () => {
  const expand = (nodes) => nodes.forEach(n => { n.isCollapsed = false; if (n.children) expand(n.children) })
  expand(tocTree.value)
}
const collapseAllToc = () => {
  const collapse = (nodes) => nodes.forEach(n => { if (n.children && n.children.length) n.isCollapsed = true; if (n.children) collapse(n.children) })
  collapse(tocTree.value)
}
</script>
<style scoped>
@import "@/assets/css/ArticleDetail.css";

.toc-list {
  max-height: none !important;
  overflow: visible !important;
}

.toc-tree-btn {
  padding: 2px 8px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>