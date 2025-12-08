<!--
  文章笔记瀑布流组件（小红书风格）
  
  功能：
    - 瀑布流布局展示文章列表
    - 分页功能（每页12条）
    - 点击文章打开阅读模态框
    - 图片懒加载和错误处理
  
  特性：
    - 响应式列数（桌面3列，移动端2列）
    - 动态高度计算和分配
    - 图片加载占位符
    - 卡片动画效果
    - 窗口大小变化时重新布局
-->
<template>
  <div class="notes-section">
    <div class="notes-bg-layer"></div>

    <div class="xhs-container" ref="containerRef">
      <!-- 使用可复用的页面标题组件 -->
      <PageHeader title="My Stories" subtitle="记录生活，探索代码" />

      <!-- 加载状态 -->
      <LoadingMessage v-if="isLoading" text="飘洋过海来看你~" />

      <!-- 错误状态 -->
      <div v-else-if="hasError" class="error-container glass-card">
        <p class="error-icon">⚠️</p>
        <p class="error-text">加载失败，请稍后重试</p>
        <button class="retry-btn glass-btn" @click="retryLoad">重试</button>
      </div>

      <!-- 瀑布流内容 -->
      <div v-else-if="allData.length > 0" class="waterfall-box" ref="waterfallRef">
        <div v-for="colIndex in columnCount" :key="colIndex" class="waterfall-column"
          :ref="el => setColumnRef(el, colIndex - 1)">
          <div v-for="item in getColumnItems(colIndex - 1)" :key="item.id" class="card glass-card pop-in"
            :style="{ animationDelay: `${item.animationDelay}s` }" @click="handleClick(item)"
            :ref="el => setCardRef(el, item.id)">
            <div class="card-img-wrapper" :style="{ paddingBottom: (1 / item.visualRatio * 100) + '%' }">
              <!-- 图片加载占位符 -->
              <div v-if="!imageLoadedMap[item.id]" class="image-placeholder">
                <div class="placeholder-spinner"></div>
              </div>
              <img :src="item.img" loading="lazy" :alt="item.title" @load="handleImageLoad(item.id)"
                @error="handleImageError(item.id)" :class="{ 'img-loaded': imageLoadedMap[item.id] }" decoding="async"
                fetchpriority="auto" />
              <div class="img-overlay">
                <div class="read-btn">
                  <span>go~</span>
                </div>
              </div>
            </div>

            <div class="card-content">
              <div class="title">{{ item.title }}</div>
              <div class="footer">
                <div class="user">
                  <img src="/images/lcj.svg" alt="avatar" class="icon avatar" />
                  <span class="username">{{ item.user }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1 && !isLoading && !hasError" class="pagination fade-in-up">
        <button class="page-btn glass-btn" :disabled="currentPage === 1 || isChangingPage"
          @click="changePage(currentPage - 1)">
          <span v-if="isChangingPage && currentPage > 1" class="btn-spinner"></span>
          <span v-else>← Prev</span>
        </button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button class="page-btn glass-btn" :disabled="currentPage === totalPages || isChangingPage"
          @click="changePage(currentPage + 1)">
          <span v-if="isChangingPage && currentPage < totalPages" class="btn-spinner"></span>
          <span v-else>Next →</span>
        </button>
      </div>

      <div v-if="allData.length === 0 && !isLoading && !hasError" class="empty-tip glass-card">
        <p>📝 还没有文章</p>
        <p style="margin-top: 10px; font-size: 0.9rem; color: #999;">
          去 <a href="/me" style="color: #6c5ce7; text-decoration: none;">后台管理</a> 创建你的第一篇文章吧！
        </p>
      </div>
    </div>

    <!-- 文章阅读卡片 -->
    <ArticleModal :visible="modalVisible" :article-id="selectedArticleId" @close="closeModal" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { useNotesStore } from '~/stores/notesStore'
import PageHeader from '~/components/HeaderBar/PageHeader.vue'
import ArticleModal from './ArticleModal.vue'
import LoadingMessage from '~/components/Common/LoadingMessage.vue'

  // 使用 public 目录下的图片
  const defaultCover = '/images/loading.webp'
  const defaultAvatar = '/images/lcj.svg'

const notesStore = useNotesStore()
const containerRef = ref(null)
const waterfallRef = ref(null)
const currentPage = ref(1)
const PAGE_SIZE = 12

  // Modal 相关状态
  const modalVisible = ref(false)
  const selectedArticleId = ref(null)

  // 瀑布流相关状态
  const columnRefs = ref([])
  const cardRefs = ref(new Map())
  const columnItems = ref([]) // 每列的数据 [[], [], []]
  const columnHeights = ref([]) // 每列的高度 [0, 0, 0]
  const loadedImages = ref(new Set()) // 已加载的图片ID
  const imageLoadedMap = ref({}) // 图片加载状态映射
  const imageErrorMap = ref({}) // 图片错误状态映射

  // 异步加载状态
  const isLoading = ref(true) // 初始为true，确保显示加载状态
  const hasError = ref(false)
  const errorMessage = ref('')
  const isChangingPage = ref(false)

  // 响应式列数
  const columnCount = computed(() => {
    if (typeof window === 'undefined') return 3 // SSR 默认3列
    const width = window.innerWidth
    // 超小屏：2列
    if (width < 480) return 2
    // 小屏手机：2列
    if (width < 640) return 2
    // 平板：2列
    if (width < 1024) return 2
    // 桌面：3列
    return 3
  })

onMounted(async () => {
  await loadData()
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize)
  }
})

// 异步加载数据（一次性全量）
const loadData = async () => {
  isLoading.value = true
  hasError.value = false
  errorMessage.value = ''

  try {
    await notesStore.initPosts()
    await new Promise(resolve => setTimeout(resolve, 100))

    if (allData.value.length > 0) {
      cardRefs.value.clear()
      distributeItems()
      await nextTick()
      setTimeout(() => {
        updateColumnHeights()
      }, 100)
    }
  } catch (error) {
    console.error('[NotesSection] 加载数据失败:', error)
    hasError.value = true
    errorMessage.value = error.message || '加载失败，请稍后重试'
  } finally {
    isLoading.value = false
  }
}

  // 重试加载
  const retryLoad = async () => {
    await loadData()
  }

  onUnmounted(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('resize', handleResize)
      // 清理 resize 定时器，防止内存泄漏
      if (resizeTimer) {
        clearTimeout(resizeTimer)
        resizeTimer = null
      }
    }
  })

// 确保数据按日期降序排序（最新的在前）
const allData = computed(() => {
  const posts = [...notesStore.allPosts]
  return posts.sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0
    const dateB = b.date ? new Date(b.date).getTime() : 0
    return dateB - dateA
  })
})

  // 视觉逻辑：定义比例模式，制造瀑布流的错落感
  const ratioPattern = [0.75, 1.0, 0.75, 1.33, 0.6, 0.75, 1.0, 0.8, 1.2, 0.9]

// 当前页的数据（带视觉比例）
const currentPageData = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE
  const pageData = allData.value.slice(start, end)

  return pageData.map((item, index) => {
      const visualRatio = item.aspectRatio || ratioPattern[index % ratioPattern.length]
      const avatar = item.avatar || defaultAvatar
      const img = item.img || defaultCover
      return {
        ...item,
        visualRatio,
        avatar,
        img,
        animationDelay: index * 0.05
      }
    })
  })

const totalPages = computed(() => Math.ceil(allData.value.length / PAGE_SIZE))

  // 设置列引用
  const setColumnRef = (el, index) => {
    if (el) {
      columnRefs.value[index] = el
    }
  }

  // 设置卡片引用
  const setCardRef = (el, id) => {
    if (el) {
      cardRefs.value.set(id, el)
    }
  }

  // 获取指定列的数据
  const getColumnItems = (colIndex) => {
    return columnItems.value[colIndex] || []
  }

  // 初始化列数据
  const initColumns = () => {
    const count = columnCount.value
    columnItems.value = Array(count).fill(null).map(() => [])
    columnHeights.value = Array(count).fill(0)
  }

  // 将数据分配到最短的列
  const distributeItems = () => {
    initColumns()
    const items = currentPageData.value

    items.forEach((item, index) => {
      // 找到最短的列
      const shortestColIndex = columnHeights.value.indexOf(Math.min(...columnHeights.value))

      // 添加到最短列
      columnItems.value[shortestColIndex].push(item)

      // 估算高度（基于视觉比例，实际高度会在图片加载后更新）
      const estimatedHeight = 200 * item.visualRatio + 80 // 图片高度 + 内容高度
      columnHeights.value[shortestColIndex] += estimatedHeight
    })
  }

  // 图片加载完成后更新列高度
  const handleImageLoad = (itemId) => {
    if (loadedImages.value.has(itemId)) return
    loadedImages.value.add(itemId)
    imageLoadedMap.value[itemId] = true

    // 延迟更新，确保 DOM 已渲染
    nextTick(() => {
      setTimeout(() => {
        updateColumnHeights()
      }, 50)
    })
  }

  // 图片加载错误处理
  const handleImageError = (itemId) => {
    imageErrorMap.value[itemId] = true
    imageLoadedMap.value[itemId] = true // 标记为已处理，避免重复显示占位符
  }

  // 更新所有列的实际高度
  const updateColumnHeights = () => {
    const count = columnCount.value
    columnHeights.value = Array(count).fill(0)

    columnItems.value.forEach((items, colIndex) => {
      let totalHeight = 0
      items.forEach(item => {
        const cardEl = cardRefs.value.get(item.id)
        if (cardEl) {
          totalHeight += cardEl.offsetHeight + 15 // 15px 是 margin-bottom
        }
      })
      columnHeights.value[colIndex] = totalHeight
    })
  }

  // 窗口大小变化处理（防抖）
  let resizeTimer = null
  const handleResize = () => {
    if (resizeTimer) clearTimeout(resizeTimer)
    resizeTimer = setTimeout(() => {
      loadedImages.value.clear()
      distributeItems()
      nextTick(() => {
        setTimeout(() => {
          updateColumnHeights()
        }, 100)
      })
    }, 150)
  }

  // 监听当前页数据变化和列数变化
  watch([currentPageData, columnCount], () => {
    // 如果正在加载，延迟执行
    if (isLoading.value) {
      return
    }

    // 如果没有数据，不执行分配
    if (currentPageData.value.length === 0) {
      return
    }

    cardRefs.value.clear() // 清空卡片引用
    distributeItems()
    nextTick(() => {
      // 等待图片加载和 DOM 更新
      setTimeout(() => {
        updateColumnHeights()
      }, 300)
    })
  }, { immediate: false }) // 改为 false，避免在数据加载前触发

const changePage = async (page) => {
  if (page < 1 || page > totalPages.value || isChangingPage.value) return

  isChangingPage.value = true

  try {
    currentPage.value = page

    // 清空图片加载状态，重新加载
    loadedImages.value.clear()
    imageLoadedMap.value = {}
    imageErrorMap.value = {}

    // 等待 DOM 更新
    await nextTick()

    // 滚动到 Notes 区域而不是页面顶部
    const notesSection = document.querySelector('.notes-section')
    if (notesSection) {
      const notesTop = notesSection.offsetTop - 100 // 减去100px作为偏移量
      window.scrollTo({
        top: notesTop,
        behavior: 'smooth'
      })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // 等待图片加载
    await new Promise(resolve => setTimeout(resolve, 300))
  } finally {
    isChangingPage.value = false
  }
}

  const handleClick = (item) => {
    // 打开 modal 显示文章
    selectedArticleId.value = item.id
    modalVisible.value = true
  }

  const closeModal = () => {
    modalVisible.value = false
    selectedArticleId.value = null
  }
</script>

<style scoped>
  .notes-section {
    position: relative;
    margin-top: 20px;
    padding: 1px 0;
    min-height: 200px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    /* 完全隐藏滚动条，因为已使用分页 */
    /* 确保组件有最小高度，始终可见 */
    display: block;
    /* 确保显示 */
    visibility: visible;
    /* 确保可见 */
  }

  .notes-bg-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: linear-gradient(135deg, #FFDDE1 0%, #E0C3FC 100%);
    opacity: 0.6;
    border-radius: 12px;
  }

  .xhs-container {
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
    padding: 20px 10px 80px;
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
    /* 完全隐藏滚动条，因为已使用分页 */
  }

  /* 瀑布流布局 - 小红书风格 */
  .waterfall-box {
    display: flex;
    gap: 15px;
    align-items: flex-start;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    /* 移动端滚动优化 */
    -webkit-overflow-scrolling: touch;
    will-change: contents;
    overflow-x: hidden;
    /* 防止横向滚动 */
  }

  .waterfall-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 15px;
    min-width: 0;
    max-width: 100%;
    box-sizing: border-box;
    /* 防止 flex 子元素溢出 */
  }

  .card {
    width: 100%;
    max-width: 100%;
    margin-bottom: 0;
    /* 使用 gap 替代 margin */
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.02);
    -webkit-mask-image: -webkit-radial-gradient(white, black);
    mask-image: radial-gradient(circle, #fff, #000);
    display: flex;
    flex-direction: column;
    /* 移动端优化 */
    -webkit-tap-highlight-color: transparent;
    touch-action: manipulation;
    user-select: none;
    box-sizing: border-box;
    /* 确保盒子模型正确 */
  }

  .glass-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    z-index: 10;
  }

  /* 图片容器 */
  .card-img-wrapper {
    width: 100%;
    position: relative;
    background-color: #f5f5f5;
    overflow: hidden;
  }

  .card-img-wrapper img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease, opacity 0.3s ease;
    opacity: 0;
  }

  .card-img-wrapper img.img-loaded {
    opacity: 1;
  }

  .glass-card:hover .card-img-wrapper img {
    transform: scale(1.08);
  }

  .img-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .glass-card:hover .img-overlay {
    opacity: 1;
  }

  .read-btn {
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.9);
    padding: 6px 18px;
    border-radius: 20px;
    color: #fff;
    font-weight: 800;
    font-size: 0.8rem;
    letter-spacing: 1px;
  }

  .card-content {
    padding: 10px 12px;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    /* 防止内容溢出 */
    word-wrap: break-word;
    word-break: break-word;
    /* 处理长文本 */
  }

  .title {
    font-size: 0.95rem;
    color: #333;
    line-height: 1.4;
    margin-bottom: 8px;
    font-weight: 500;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    word-wrap: break-word;
    word-break: break-word;
    max-width: 100%;
    /* 防止文本溢出 */
  }

  .footer {
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    color: #999;
  }

  .user {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .avatar {
    width: 22px;
    height: 22px;
    flex-shrink: 0;
    display: inline-block;
    vertical-align: middle;
  }

  .username {
    max-width: 8em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* 动画和分页 */
  .pop-in {
    opacity: 0;
    animation: slideUpFade 0.6s ease-out forwards;
  }

  @keyframes slideUpFade {
    from {
      opacity: 0;
      transform: translateY(20px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 40px;
  }

  .glass-btn {
    padding: 8px 20px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(5px);
    border-radius: 50px;
    cursor: pointer;
    color: #555;
    transition: all 0.3s;
  }

  .glass-btn:hover:not(:disabled) {
    background: #fff;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    color: #6c5ce7;
  }

  .glass-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .page-info {
    font-family: monospace;
    color: #666;
    font-weight: bold;
  }

  .empty-tip {
    text-align: center;
    padding: 60px;
    color: #888;
    font-size: 1rem;
    margin-top: 20px;
    background: #fff;
    border-radius: 12px;
  }


  /* 错误状态样式 */
  .error-container {
    text-align: center;
    padding: 60px 20px;
    margin-top: 20px;
    background: #fff;
    border-radius: 12px;
  }

  .error-icon {
    font-size: 3rem;
    margin-bottom: 15px;
  }

  .error-text {
    color: #666;
    font-size: 1rem;
    margin-bottom: 20px;
  }

  .retry-btn {
    padding: 10px 24px;
    font-size: 0.95rem;
  }

  /* 图片加载占位符 */
  .image-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  .placeholder-spinner {
    width: 30px;
    height: 30px;
    border: 2px solid rgba(108, 92, 231, 0.2);
    border-top-color: #6c5ce7;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }

    100% {
      background-position: 200% 0;
    }
  }


  /* 分页按钮加载状态 */
  .btn-spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  /* 平板适配 */
  @media (max-width: 1024px) {
    .waterfall-box {
      gap: 12px;
    }

    .xhs-container {
      padding: 20px 15px 60px;
    }

    .card {
      border-radius: 10px;
    }

    .card-content {
      padding: 8px 10px;
    }

    .title {
      font-size: 0.9rem;
    }
  }

  /* 移动端加载状态优化 */
  @media (max-width: 768px) {

    .error-container {
      padding: 40px 15px;
    }

    .error-icon {
      font-size: 2.5rem;
    }

    .error-text {
      font-size: 0.9rem;
    }

    .retry-btn {
      padding: 8px 20px;
      font-size: 0.9rem;
    }

    .placeholder-spinner {
      width: 25px;
      height: 25px;
    }
  }

  /* 移动端适配 */
  @media (max-width: 768px) {
    .notes-section {
      margin-top: 10px;
      padding: 20px 0;
      overflow-x: hidden;
      max-width: 100%;
    }

    .notes-bg-layer {
      display: none;
    }

    .xhs-container {
      padding: 15px 10px 50px;
      max-width: 100%;
      overflow-x: hidden;
    }

    .waterfall-box {
      gap: 10px;
      overflow-x: hidden;
    }

    .card {
      border-radius: 8px;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
      max-width: 100%;
      box-sizing: border-box;
    }

    .card-content {
      padding: 8px 10px;
      word-wrap: break-word;
      word-break: break-word;
      overflow: hidden;
      max-width: 100%;
      box-sizing: border-box;
    }

    .title {
      font-size: 0.85rem;
      line-height: 1.3;
      margin-bottom: 6px;
      -webkit-line-clamp: 2;
      line-clamp: 2;
    }

    .footer {
      font-size: 0.7rem;
    }

    .avatar {
      width: 20px;
      height: 20px;
    }

    .username {
      max-width: 6em;
    }

    .read-btn {
      padding: 5px 14px;
      font-size: 0.75rem;
    }

    .pagination {
      gap: 15px;
      margin-top: 30px;
      flex-wrap: wrap;
    }

    .glass-btn {
      padding: 10px 18px;
      font-size: 0.9rem;
      min-width: 80px;
      min-height: 44px;
      /* 触摸友好 */
    }

    .page-info {
      font-size: 0.9rem;
      padding: 0 10px;
    }

    .empty-tip {
      padding: 40px 20px;
      font-size: 0.9rem;
      margin-top: 15px;
    }

    /* 移动端禁用 hover 效果 */
    .glass-card:hover {
      transform: none;
    }

    .glass-card:active {
      transform: scale(0.98);
      opacity: 0.9;
    }

    .glass-card:hover .card-img-wrapper img {
      transform: none;
    }

    .glass-card:hover .img-overlay {
      opacity: 0;
    }

    /* 移动端点击时显示 overlay */
    .glass-card:active .img-overlay {
      opacity: 0.8;
    }
  }

  /* 小屏手机适配 */
  @media (max-width: 640px) {
    .notes-section {
      padding: 15px 0;
      overflow-x: hidden;
      max-width: 100%;
    }

    .xhs-container {
      padding: 10px 8px 40px;
      overflow-x: hidden;
    }

    .waterfall-box {
      gap: 8px;
      overflow-x: hidden;
    }

    .card {
      border-radius: 6px;
      max-width: 100%;
      box-sizing: border-box;
    }

    .card-content {
      padding: 6px 8px;
      word-wrap: break-word;
      word-break: break-word;
      overflow: hidden;
      max-width: 100%;
      box-sizing: border-box;
    }

    .title {
      font-size: 0.8rem;
      margin-bottom: 5px;
    }

    .footer {
      font-size: 0.65rem;
    }

    .avatar {
      width: 18px;
      height: 18px;
    }

    .username {
      max-width: 5em;
    }

    .read-btn {
      padding: 4px 12px;
      font-size: 0.7rem;
    }

    .pagination {
      gap: 10px;
      margin-top: 25px;
    }

    .glass-btn {
      padding: 8px 15px;
      font-size: 0.85rem;
      min-width: 70px;
      min-height: 40px;
    }

    .page-info {
      font-size: 0.85rem;
      padding: 0 8px;
    }

    .empty-tip {
      padding: 30px 15px;
      font-size: 0.85rem;
    }
  }

  /* 超小屏适配 */
  @media (max-width: 480px) {
    .notes-section {
      overflow-x: hidden;
      max-width: 100%;
    }

    .xhs-container {
      padding: 8px 5px 35px;
      overflow-x: hidden;
    }

    .waterfall-box {
      gap: 6px;
      overflow-x: hidden;
    }

    .card {
      max-width: 100%;
      box-sizing: border-box;
    }

    .card-content {
      padding: 5px 6px;
      word-wrap: break-word;
      word-break: break-word;
      overflow: hidden;
      max-width: 100%;
      box-sizing: border-box;
    }

    .title {
      font-size: 0.75rem;
      -webkit-line-clamp: 2;
      line-clamp: 2;
    }

    .footer {
      font-size: 0.6rem;
    }

    .pagination {
      gap: 8px;
      margin-top: 20px;
    }

    .glass-btn {
      padding: 8px 12px;
      font-size: 0.8rem;
      min-width: 60px;
    }

    .page-info {
      font-size: 0.8rem;
      padding: 0 5px;
    }
  }

  /* 横屏模式优化 */
  @media (max-width: 768px) and (orientation: landscape) {
    .waterfall-box {
      gap: 12px;
    }

    .xhs-container {
      padding: 15px 15px 40px;
    }
  }
</style>
