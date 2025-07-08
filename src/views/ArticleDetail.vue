<template>
  <ArticleDetailLoading v-if="loading" />
  <div class="article-detail" v-else>

    <el-row :gutter="20">
      <!-- 文章内容 -->
      <el-col :xs="24" :md="18">
        <div class="article-container">
          <div class="article-header">
            <h1 class="article-title">{{ article.title || '加载中...' }}</h1>
            <div class="article-meta">
              <span class="article-date">{{ article.updateTime ? dayjs(article.updateTime).format('YYYY-MM-DD HH:mm:ss')
                : '未知时间' }}</span>
              <span class="article-wordcount">
                {{ articleWordCount }} 字 <span class="readtime">（约 {{ articleReadTime }} 分钟阅读）</span>
              </span>
              <span class="article-views right">{{ article.clickTimes || 0 }}次阅读</span>
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
              <el-avatar :size="60" src="https://i.pinimg.com/736x/1e/d3/00/1ed300b0d286c37a57c2b3e73a941d93.jpg" />
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

    <!-- 图片预览组件 -->
    <el-image-viewer v-if="showImageViewer" :url-list="[previewImageUrl]" @close="showImageViewer = false" />

    <!-- mermaid 图表预览组件 -->
    <el-image-viewer v-if="showMermaidViewer" :url-list="[mermaidPreviewUrl]" @close="closeMermaidViewer"
      :preview-teleported="true" :initial-index="0" :hide-on-click-modal="true" :z-index="2000" />

    <!-- mermaid 源码弹窗 -->
    <el-dialog v-model="showMermaidSourceDialog" width="60%" :close-on-click-modal="false" :close-on-press-escape="true"
      :show-close="false" class="mermaid-source-dialog">
      <template #header>
        <div class="mermaid-dialog-header">
          <div class="apple-dots">
            <span class="dot dot-red" @click="closeMermaidSourceDialog" title="关闭"></span>

            <span class="dot dot-green" @click="scrollMermaidToTop" title="滚动到顶部"></span>
            <span class="dot dot-blue" @click="scrollMermaidToBottom" title="滚动到底部"></span>
          </div>
          <span class="dialog-title">Mermaid 源码</span>
        </div>
      </template>
      <div class="mermaid-source-content">
        <pre class="mermaid-source-code" ref="mermaidSourceCodeElement">{{ mermaidSourceCode }}</pre>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <MoreButton @click="copyMermaidSource">复制源码</MoreButton>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
// #region 引入依赖
import { ref, onMounted, nextTick, onUnmounted, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { Share, ArrowUp, Menu, ArrowDown } from '@element-plus/icons-vue'
import { ElImageViewer } from 'element-plus'
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
// 添加 mermaid 支持
import mermaid from 'mermaid'
import ArticleDetailLoading from '@/components/ArticleDetailLoading.vue'
// #endregion

// #region Mermaid初始化
mermaid.initialize({
  startOnLoad: false, // 不自动开始渲染
  theme: 'default',
  flowchart: {
    useMaxWidth: true,
    htmlLabels: true
  },
  sequence: {
    useMaxWidth: true
  },
  gantt: {
    useMaxWidth: true
  }
});
// #endregion

// #region 状态变量定义
const loading = ref(true)
const route = useRoute()
const articleId = ref(route.params.id || 1)
const categoryName = ref('')
const tocItems = ref([])
// #endregion

// #region 文章字数/阅读时间计算
const articleWordCount = computed(() => {
  if (!article.value.content) return 0
  const div = document.createElement('div')
  div.innerHTML = article.value.content
  return div.textContent.replace(/\s/g, '').length
})
const articleReadTime = computed(() => {
  const min = Math.max(1, Math.round(articleWordCount.value / 500))
  return min
})
// #endregion

// #region 全屏代码相关状态
const isFullscreenActive = ref(false)
const currentCode = ref('')
const currentLanguage = ref('plaintext')
const fullscreenCodeBlock = ref(null)
const fullscreenWhiteBg = ref(false)
// #endregion

// #region 文章/相关文章/热门文章数据
const article = ref({
  title: '',
  content: '',
  updateTime: '',
  clickTimes: 0,
  cover: '',
  categoryId: '',
  tags: []
})
const relatedArticles = ref([])
const popularArticles = ref([])
// #endregion

// #region 图片/mermaid预览相关方法
const showShareCapsule = ref(false)
const shareBtnRef = ref(null)
const showImageViewer = ref(false)
const previewImageUrl = ref('')
const showMermaidViewer = ref(false)
const mermaidPreviewUrl = ref('')
const showMermaidSourceDialog = ref(false)
const mermaidSourceCode = ref('')
const openImagePreview = (url) => {
  previewImageUrl.value = url
  showImageViewer.value = true
}
const openMermaidPreview = (mermaidCode) => {
  // 清理之前的 URL
  if (mermaidPreviewUrl.value) {
    URL.revokeObjectURL(mermaidPreviewUrl.value)
  }

  // 创建一个临时的 mermaid 容器来渲染图表
  const tempContainer = document.createElement('div')
  tempContainer.className = 'mermaid'
  tempContainer.textContent = mermaidCode
  tempContainer.style.position = 'absolute'
  tempContainer.style.left = '-9999px'
  tempContainer.style.top = '-9999px'
  tempContainer.style.background = '#ffffff'
  document.body.appendChild(tempContainer)

  try {
    // 渲染 mermaid
    mermaid.init(undefined, tempContainer)

    // 等待渲染完成后获取 SVG
    setTimeout(() => {
      const svg = tempContainer.querySelector('svg')
      if (svg) {
        // 为 SVG 添加白色背景
        svg.style.backgroundColor = '#ffffff'
        svg.setAttribute('style', svg.getAttribute('style') + '; background-color: #ffffff;')

        // 确保 SVG 有白色背景
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect')
        rect.setAttribute('width', '100%')
        rect.setAttribute('height', '100%')
        rect.setAttribute('fill', '#ffffff')
        rect.setAttribute('x', '0')
        rect.setAttribute('y', '0')
        svg.insertBefore(rect, svg.firstChild)

        // 将 SVG 转换为 data URL
        const svgString = new XMLSerializer().serializeToString(svg)
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml' })
        const url = URL.createObjectURL(svgBlob)

        mermaidPreviewUrl.value = url
        showMermaidViewer.value = true

        // 清理临时元素
        document.body.removeChild(tempContainer)
      } else {
        console.error('Mermaid 渲染失败')
        document.body.removeChild(tempContainer)
      }
    }, 100)
  } catch (e) {
    console.error('Mermaid 渲染失败:', e)
    document.body.removeChild(tempContainer)
  }
}
const closeMermaidViewer = () => {
  showMermaidViewer.value = false
  // 清理 URL
  if (mermaidPreviewUrl.value) {
    URL.revokeObjectURL(mermaidPreviewUrl.value)
    mermaidPreviewUrl.value = ''
  }
}
const showMermaidSource = (mermaidCode) => {
  mermaidSourceCode.value = mermaidCode
  showMermaidSourceDialog.value = true
}
const closeMermaidSourceDialog = () => {
  showMermaidSourceDialog.value = false
  mermaidSourceCode.value = ''
}
const copyMermaidSource = () => {
  try {
    navigator.clipboard.writeText(mermaidSourceCode.value).then(() => {
      showToast('源码已复制到剪贴板')
    }).catch(err => {
      console.error('复制失败:', err)
      showToast('复制失败', 'error')
    })
  } catch (error) {
    console.error('复制失败:', error)
    showToast('复制失败', 'error')
  }
}
const mermaidSourceCodeElement = ref(null)
const scrollMermaidToTop = () => {
  if (mermaidSourceCodeElement.value) {
    mermaidSourceCodeElement.value.scrollTop = 0
  }
}
const scrollMermaidToBottom = () => {
  if (mermaidSourceCodeElement.value) {
    mermaidSourceCodeElement.value.scrollTop = mermaidSourceCodeElement.value.scrollHeight
  }
}
// #endregion

// #region 文章内容变化监听
const addImagePreviewDblClick = () => {
  const imgs = document.querySelectorAll('.article-content img')
  imgs.forEach(img => {
    // 移除之前的事件，避免重复绑定
    img.ondblclick = null
    // 绑定双击事件
    img.ondblclick = (e) => {
      e.stopPropagation()
      openImagePreview(img.src)
    }
    // 移除按钮容器（如果有）
    if (img.parentElement && img.parentElement.classList.contains('image-preview-wrapper')) {
      img.parentElement.replaceWith(img)
    }
  })
}
watch(() => article.value.content, () => {
  nextTick(() => {
    addImagePreviewDblClick()
    setTimeout(() => {
      enhancedHighlightAll()
      enhancedRenderMermaid()
    }, 50)
  })
})
// #endregion

// #region Markdown配置与处理
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false,
  sanitize: false,
  highlight: function (code, lang) {
    if (lang === 'mermaid') {
      return code
    }
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
const highlightMarkdown = (md) => {
  // 只处理非代码块内的==内容==
  return md.replace(/==([^=]+)==/g, '<span class="md-highlight">$1</span>');
}
const processArticleContent = (htmlContent) => {
  if (!htmlContent) return '';

  // 在处理前先应用高亮
  htmlContent = htmlContent.replace(/==([^=]+)==/g, '<span class="md-highlight">$1</span>');

  // 匹配所有代码块
  return htmlContent.replace(/<pre><code( class="language-([^"]+)")?>([\s\S]*?)<\/code><\/pre>/g, (match, classAttr, language, code) => {
    // 生成唯一ID
    const codeId = 'code-' + Math.random().toString(36).substring(2, 9);
    const codeContent = (code || '').toString();
    // 判断是否有语言
    let codeClass = classAttr ? classAttr : '';
    let extraClass = '';
    if (!language) {
      extraClass = ' codeblock-plain';
    }

    // 如果是 mermaid 代码块，直接渲染成图表
    if (language === 'mermaid') {
      const mermaidId = 'mermaid-' + Math.random().toString(36).substring(2, 9);
      return `
        <div class="mermaid-wrapper">
          <div class="mermaid-actions">
            <button class="mermaid-btn fullscreen-btn" onclick="window._showMermaidFullscreen('${mermaidId}')" title="全屏">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 32 32">
                <path fill="#fb8c00" d="m25.329 20l-7.001-8H20V4h-8v8h1.672l-7.001 8H4v8h8v-8H9.328L16 12.376L22.672 20H20v8h8v-8z"/>
              </svg>
            </button>
            <button class="mermaid-btn source-btn" onclick="window._showMermaidSource('${mermaidId}')" title="查看源码">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 32 32">
                <path fill="#00a23c" d="m20.42 21.157l2.211 2.211L30 16l-7.369-7.369l-2.211 2.212L25.58 16Zm-8.84-10.314L9.369 8.631L2 16l7.369 7.369l2.211-2.211L6.42 16Zm5.831-3.166l1.6.437l-4.42 16.209l-1.6-.437z"/>
              </svg>
            </button>
          </div>
          <textarea id="${mermaidId}" style="display:none">${codeContent}</textarea>
          <div class="mermaid" data-mermaid-code="${encodeURIComponent(codeContent)}">
            ${codeContent}
          </div>
        </div>
      `;
    }

    // 如果是 link 代码块，解析为可点击高亮链接
    if (language === 'link') {
      // ... existing code ...
    }

    // 普通代码块，增加收缩按钮
    return `
      <div class="code-wrapper" id="wrap-${codeId}">
        <div class="code-actions">
          <button class="code-btn copy-btn" onclick="window._copyCode('${codeId}')" title="复制">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2v1"></path>
            </svg>
          </button>
          <button class="code-btn fullscreen-btn" onclick="window._showFullscreen('${codeId}', '${language || ''}')" title="全屏">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
              <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"></path>
            </svg>
          </button>
          <button class="code-btn collapse-btn" onclick="window._toggleCollapseCode('${codeId}')" title="收缩/展开">
            <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" stroke-width="2" fill="none">
              <line x1="4" y1="10" x2="20" y2="10"/>
              <line x1="4" y1="14" x2="20" y2="14"/>
            </svg>
          </button>
        </div>
        <textarea id="${codeId}" style="display:none">${codeContent}</textarea>
        <pre><code${codeClass}${extraClass}>${code}</code></pre>
      </div>
    `;
  });
}
// #endregion

// #region 目录与标题处理
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
const NAVBAR_HEIGHT = 64
const scrollToHeaderWithOffset = (id) => {
  const element = document.getElementById(id);
  if (element) {
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const offset = NAVBAR_HEIGHT + 16; // 16px 额外间距
    const top = rect.top + scrollTop - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
};
const handleTocClick = (id) => {
  scrollToHeaderWithOffset(id);
};
const handleDrawerTocClick = (id) => {
  closeTocDrawer();
  nextTick(() => {
    scrollToHeaderWithOffset(id);
  });
};
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
// #endregion

// #region 代码块复制/全屏功能
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

  // 在下一个 tick 中高亮代码或渲染 mermaid
  nextTick(() => {
    if (fullscreenCodeBlock.value) {
      if (currentLanguage.value === 'mermaid') {
        // 渲染 mermaid
        try {
          mermaid.init(undefined, fullscreenCodeBlock.value)
        } catch (e) {
          fullscreenCodeBlock.value.innerHTML = '<pre style="color:red">Mermaid 渲染失败: ' + e + '</pre>'
        }
      } else {
        Prism.highlightElement(fullscreenCodeBlock.value)
      }
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

  // 设置全局 mermaid 全屏函数
  window._showMermaidFullscreen = (mermaidId) => {
    const mermaidEl = document.getElementById(mermaidId);
    if (mermaidEl) {
      const mermaidCode = mermaidEl.value || mermaidEl.textContent;
      openMermaidPreview(mermaidCode);
    }
  };

  // 设置全局 mermaid 源码查看函数
  window._showMermaidSource = (mermaidId) => {
    const mermaidEl = document.getElementById(mermaidId);
    if (mermaidEl) {
      const mermaidCode = mermaidEl.value || mermaidEl.textContent;
      showMermaidSource(mermaidCode);
    }
  };

  // 设置全局收缩/展开函数
  window._toggleCollapseCode = (codeId) => {
    const wrapper = document.getElementById('wrap-' + codeId);
    if (wrapper) {
      wrapper.classList.toggle('collapsed');
    }
  };
}
// #endregion

// #region 数据获取与加载
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
            return `${headerMatch[1]} <span id="${item.id}" class="highlight">${headerMatch[2]}</span>`
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
        // 确保DOM完全渲染后再执行代码高亮
        setTimeout(() => {
          enhancedHighlightAll()
          initCodeButtons()
          enhancedRenderMermaid();
        }, 100); // 增加延迟确保DOM完全渲染
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
    loading.value = true
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
  } finally {
    loading.value = false

    // loading完成后，确保代码高亮和mermaid渲染正常工作
    nextTick(() => {
      setTimeout(() => {
        enhancedHighlightAll()
        enhancedRenderMermaid()
        // 再次检查mermaid渲染状态
        setTimeout(() => {
          checkMermaidRenderStatus()
        }, 300)
      }, 200)
    })
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
// #endregion

// #region 生命周期钩子
onMounted(() => {
  // 加载数据
  loadData()

  // 监听滚动事件，实现目录高亮
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('scroll', handleFloatBtnShow)
})
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('scroll', handleFloatBtnShow);
  window._copyCode = null;
  window._showFullscreen = null;
  window._showMermaidFullscreen = null;
  window._showMermaidSource = null;
  if (isFullscreenActive.value) {
    document.body.style.overflow = ''; // 恢复滚动
  }
  // 清理 mermaid 预览 URL
  if (mermaidPreviewUrl.value) {
    URL.revokeObjectURL(mermaidPreviewUrl.value);
  }
  document.removeEventListener('click', handleCapsuleOutsideClick)
});
// #endregion

// #region 格式化函数
const formatRelativeTime = (dateTime) => {
  if (!dateTime) return '未知时间'
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm')
}
const formatTimeAgo = (dateTime) => {
  if (!dateTime) return '未知时间'
  return dayjs(dateTime).format('YYYY-MM-DD HH:mm')
}
const formatNumber = (clickTimes) => {
  if (clickTimes >= 1000000) {
    return (clickTimes / 1000000).toFixed(2) + 'M'
  } else if (clickTimes >= 10000) {
    return (clickTimes / 1000).toFixed(2) + 'K'
  } else {
    return clickTimes.toString()
  }
}
// #endregion

// #region 页面交互（回到顶部、目录抽屉、分享等）
const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
const showTocDrawer = ref(false)
const openTocDrawer = () => { showTocDrawer.value = true }
const closeTocDrawer = () => { showTocDrawer.value = false }
const handleDrawerMaskClick = (e) => {
  // 只在点击遮罩本身时关闭
  if (e.target.classList.contains('toc-drawer-mask')) closeTocDrawer()
}
const showFloatBtns = ref(false)
const handleFloatBtnShow = () => {
  const scrollY = window.scrollY || document.documentElement.scrollTop
  const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
  showFloatBtns.value = scrollY > docHeight / 2
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
// #endregion

// #region 目录树结构与展开折叠
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
const expandAllToc = () => {
  const expand = (nodes) => nodes.forEach(n => { n.isCollapsed = false; if (n.children) expand(n.children) })
  expand(tocTree.value)
}
const collapseAllToc = () => {
  const collapse = (nodes) => nodes.forEach(n => { if (n.children && n.children.length) n.isCollapsed = true; if (n.children) collapse(n.children) })
  collapse(tocTree.value)
}
// #endregion

// #region Mermaid渲染相关
const renderMermaidBlocks = () => {
  // 查找所有未渲染的 mermaid 容器
  const mermaidContainers = document.querySelectorAll('.mermaid-wrapper .mermaid:not([data-mermaid-rendered])');
  console.log('找到', mermaidContainers.length, '个mermaid容器需要渲染');

  mermaidContainers.forEach((container, idx) => {
    container.setAttribute('data-mermaid-rendered', 'true');
    const code = container.textContent;

    // 渲染
    try {
      // 清理之前的渲染结果
      container.innerHTML = code;

      // 重新渲染
      mermaid.init(undefined, container);
      console.log(`Mermaid ${idx + 1} 渲染成功`);
    } catch (e) {
      console.error(`Mermaid ${idx + 1} 渲染失败:`, e);
      container.innerHTML = `
        <div style="color:red; padding: 10px; border: 1px solid #ff4444; border-radius: 4px; background: #fff5f5;">
          <strong>Mermaid 渲染失败:</strong><br>
          ${e.message || e}<br>
          <small>原始代码: ${code.substring(0, 100)}${code.length > 100 ? '...' : ''}</small>
        </div>
      `;
    }
  });
};
const enhancedRenderMermaid = () => {
  // 确保mermaid容器存在
  const mermaidContainers = document.querySelectorAll('.mermaid-wrapper .mermaid');
  if (mermaidContainers.length > 0) {
    try {
      // 检查容器是否已经完全渲染到DOM中
      const isReady = Array.from(mermaidContainers).every(container => {
        return container.offsetHeight > 0 && container.offsetWidth > 0;
      });

      if (isReady) {
        renderMermaidBlocks();
        console.log('Mermaid渲染执行成功，共处理', mermaidContainers.length, '个图表');
      } else {
        // 如果容器还未完全渲染，延迟重试
        console.log('Mermaid容器未完全准备好，延迟重试...');
        setTimeout(() => {
          enhancedRenderMermaid();
        }, 100);
      }
    } catch (error) {
      console.error('Mermaid渲染执行失败:', error);
    }
  } else {
    console.warn('未找到需要渲染的Mermaid图表');
  }
};
const checkMermaidRenderStatus = () => {
  const mermaidContainers = document.querySelectorAll('.mermaid-wrapper .mermaid');
  const renderedContainers = document.querySelectorAll('.mermaid-wrapper .mermaid svg');

  console.log(`Mermaid状态检查: 总容器 ${mermaidContainers.length} 个, 已渲染 ${renderedContainers.length} 个`);

  if (mermaidContainers.length > 0 && renderedContainers.length < mermaidContainers.length) {
    console.log('检测到未完全渲染的Mermaid图表，重新渲染...');
    enhancedRenderMermaid();
  }
};
// #endregion

// #region 代码高亮相关
const enhancedHighlightAll = () => {
  // 确保代码块元素存在
  const codeBlocks = document.querySelectorAll('pre code[class*="language-"]');
  if (codeBlocks.length > 0) {
    try {
      Prism.highlightAll();
      console.log('代码高亮执行成功，共处理', codeBlocks.length, '个代码块');
    } catch (error) {
      console.error('代码高亮执行失败:', error);
    }
  } else {
    console.warn('未找到需要高亮的代码块');
  }
};
// #endregion
</script>
<style scoped>
@import "@/assets/css/ArticleDetail.css";
@import "@/assets/css/CodeStyle.css";

:deep(.el-image-viewer__wrapper) {
  z-index: 2100;
}

/* 自定义代码块样式 */
:deep(.code-wrapper.collapsed pre),
:deep(.code-wrapper.collapsed code) {
  max-height: 1.8em !important;
  overflow: hidden !important;
  white-space: nowrap !important;
  text-overflow: ellipsis !important;
  display: block !important;
}
</style>