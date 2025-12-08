<!--
  朋友圈动态组件
  
  功能：
    - 显示朋友圈动态列表
    - 支持文本和图片内容
    - 图片预览功能
    - 分页加载（每页10条）
    - XSS防护（内容清理）
  
  特性：
    - 微信风格的朋友圈布局
    - 单图和多图网格布局
    - 图片点击预览（全屏遮罩）
    - 懒加载优化
    - 响应式设计
-->
<template>
  <div class="moments-list">
    <!-- Loading 状态 -->
    <LoadingMessage v-if="isLoadingData" text="飘洋过海来看你~" />

    <!-- 内容区域 -->
    <template v-else>
      <div v-if="posts.length === 0" class="empty-state">
        <p>稍等一下~</p>
      </div>
      <div v-for="post in posts" :key="post.id" class="post-item">
        <div class="avatar-container">
          <img :src="post.author.avatar || avatarImage" alt="avatar" class="avatar-img" loading="lazy" decoding="async"
            @error="handleAvatarError" />
        </div>
        <div class="post-content">
          <div class="nickname">{{ post.author.nickname }}</div>
          <p class="content-text" v-html="sanitizeContent(post.content)"></p>
          <div v-if="post.images && post.images.length > 0" class="image-gallery">
            <div v-if="post.images.length === 1" class="image-wrapper single-image">
              <img :src="post.images[0]" alt="post image" class="gallery-image" loading="lazy" decoding="async"
                @click="openImageViewer(post.images[0])" />
            </div>
            <div v-else class="image-grid" :class="{ 'four-grid': post.images.length === 4 }">
              <div v-for="(image, index) in post.images" :key="index" class="image-wrapper grid-image">
                <img :src="image" alt="post image" class="gallery-image" loading="lazy" decoding="async"
                  @click="openImageViewer(image)" />
              </div>
            </div>
          </div>
          <div class="timestamp">{{ post.timestamp }}</div>
        </div>
      </div>

      <!-- 加载更多按钮 -->
      <div v-if="hasMore" class="load-more-container">
        <button class="load-more-btn" @click="loadMore">
          {{ isLoading ? '加载中...' : '加载更多' }}
        </button>
      </div>

      <!-- 图片预览遮罩层 - 使用 Teleport 渲染到 body，避免受父元素 transform 影响 -->
      <Teleport to="body">
        <div v-if="viewerImage" class="image-viewer" @click="closeImageViewer">
          <img :src="viewerImage" alt="预览图片" class="viewer-image" />
        </div>
      </Teleport>
    </template>
  </div>
</template>

<script setup>
  import { ref, onBeforeUnmount, computed, onMounted, nextTick } from 'vue'
  import LoadingMessage from '~/components/Common/LoadingMessage.vue'
  // 使用 public 目录下的图片
  const avatarImage = '/images/lcj.svg'

  // 清理内容，防止 XSS 攻击
  // 移除危险标签和属性，只保留安全的换行符
  const sanitizeContent = (content) => {
    if (!content || typeof content !== 'string') {
      return ''
    }
    
    // 危险标签列表
    const dangerousTags = ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button', 'select', 'textarea', 'meta', 'link', 'style', 'base', 'frame', 'frameset']
    
    let safeContent = content
    
    // 移除危险标签
    dangerousTags.forEach(tag => {
      const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gis')
      safeContent = safeContent.replace(regex, '')
      const selfClosingRegex = new RegExp(`<${tag}[^>]*/?>`, 'gi')
      safeContent = safeContent.replace(selfClosingRegex, '')
    })
    
    // 移除所有 on* 事件处理器属性
    safeContent = safeContent.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '')
    safeContent = safeContent.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '')
    
    // 移除 javascript: 协议
    safeContent = safeContent.replace(/javascript:/gi, '')
    
    // 将换行符转换为 <br/>
    safeContent = safeContent.replace(/\n/g, '<br/>')
    
    return safeContent
  }

  // 数据状态
  const momentsDataFromAPI = ref([])
  const isLoadingData = ref(true)
  
  // 分页相关
  const pageSize = 20 // 每页从 API 加载20条（与 API 默认值一致）
  const currentOffset = ref(0)
  const hasMoreData = ref(false)
  const totalCount = ref(0)
  const isLoading = ref(false)

  // 从 API 加载数据（支持分页）
  const loadMomentsFromAPI = async (offset = 0, append = false) => {
    try {
      if (!append) {
        isLoadingData.value = true
      } else {
        isLoading.value = true
      }
      
      const response = await $fetch('/api/moments', {
        query: {
          offset: offset,
          limit: pageSize
        }
      })
      
      if (response.success && response.data) {
        const { moments, total, hasMore } = response.data
        
        if (append) {
          // 追加数据
          momentsDataFromAPI.value = [...momentsDataFromAPI.value, ...moments]
        } else {
          // 替换数据
          momentsDataFromAPI.value = moments || []
        }
        
        totalCount.value = total || 0
        hasMoreData.value = hasMore || false
        currentOffset.value = offset + (moments?.length || 0)
      } else {
        if (!append) {
          momentsDataFromAPI.value = []
        }
        hasMoreData.value = false
      }
    } catch (error) {
      console.error('从 API 加载朋友圈数据失败:', error)
      if (!append) {
        momentsDataFromAPI.value = []
      }
      hasMoreData.value = false
    } finally {
      isLoadingData.value = false
      isLoading.value = false
    }
  }

  // 处理所有数据
  const allPosts = computed(() => {
    try {
      if (!momentsDataFromAPI.value || !Array.isArray(momentsDataFromAPI.value) || momentsDataFromAPI.value.length === 0) {
        return []
      }

      return momentsDataFromAPI.value
    } catch (error) {
      console.error('处理 Moments 数据失败:', error)
      return []
    }
  })

  // 当前显示的文章列表（直接使用 API 返回的数据）
  const posts = computed(() => {
    return allPosts.value
  })

  // 是否还有更多
  const hasMore = computed(() => {
    return hasMoreData.value
  })

  // 加载更多（从 API 加载下一页数据）
  const loadMore = async () => {
    if (isLoading.value || !hasMore.value) return

    // 从 API 加载下一页
    await loadMomentsFromAPI(currentOffset.value, true)
    
    // 滚动到新加载的内容附近
    await nextTick()
    const loadMoreBtn = document.querySelector('.load-more-container')
    if (loadMoreBtn) {
      loadMoreBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    }
  }

  // 图片预览相关
  const viewerImage = ref(null)

  // 打开图片预览
  const openImageViewer = (imageSrc) => {
    viewerImage.value = imageSrc
    // 禁止背景滚动
    document.body.style.overflow = 'hidden'
  }

  // 关闭图片预览
  const closeImageViewer = () => {
    viewerImage.value = null
    // 恢复背景滚动
    document.body.style.overflow = ''
  }

  // 头像加载错误处理
  const handleAvatarError = (event) => {
    if (event.target.src !== avatarImage) {
      event.target.src = avatarImage
    }
  }

  // 组件挂载时加载数据
  onMounted(() => {
    loadMomentsFromAPI()
  })

  // 组件卸载时恢复背景滚动
  onBeforeUnmount(() => {
    document.body.style.overflow = ''
  })
</script>

<style scoped>

  /* 全局背景和字体，模拟一个干净的列表 */
  .moments-list {
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif;
    background-color: transparent;
    width: 100%;
    margin: 0;
    padding: 0 0 0 30px;
  }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: #999;
    font-size: 0.9rem;
  }

  /* 每一条动态的容器 */
  .post-item {
    display: flex;
    padding: 12px 10px;
    background-color: transparent;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    /* 性能优化：使用 GPU 加速 */
    transform: translateZ(0);
    will-change: transform;
  }

  /* 1. 头像 */
  .avatar-container {
    margin-right: 10px;
  }

  .avatar-img {
    width: 36px;
    height: 36px;
    border-radius: 6px;
    /* 微信风格的圆角矩形 */
    display: block;
  }

  /* 2. 右侧内容区 */
  .post-content {
    flex: 1;
    /* 占据所有剩余空间 */
    min-width: 0;
    /* 修复 flex 布局中子元素溢出的问题 */
  }

  /* 2.1 昵称 */
  .nickname {
    font-weight: 600;
    color: #576b95;
    /* 微信的"链接蓝" */
    margin-bottom: 6px;
    font-size: 13px;
  }

  /* 2.2 文本内容 */
  .content-text {
    font-size: 13px;
    color: #333;
    margin: 0 0 8px 0;
    line-height: 1.5;
    white-space: pre-wrap;
    /* 保证换行符 \n 生效 */
    word-wrap: break-word;
    /* 英文长单词换行 */
  }

  /* 2.3 图片画廊 */
  .image-gallery {
    margin-bottom: 8px;
  }

  .image-wrapper {
    overflow: hidden;
    background-color: #f0f0f0;
    /* 图片加载时的底色 */
  }

  .gallery-image {
    display: block;
    object-fit: cover;
    /* 保证图片被裁剪填充，不变形 */
    cursor: pointer;
    transition: opacity 0.2s ease;
    /* 性能优化 */
    will-change: opacity;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .gallery-image:hover {
    opacity: 0.9;
  }

  /* --- 图片布局核心逻辑 --- */

  /* 情况一：单图 */
  .single-image {
    max-width: 200px;
    /* 单图最大宽度 */
    max-height: 300px;
    /* 单图最大高度 */
    border-radius: 6px;
  }

  .single-image .gallery-image {
    width: 100%;
    height: auto;
    /* 高度自适应 */
    max-width: 100%;
    max-height: 300px;
    object-fit: cover;
    /* 如果图片太大，就裁剪 */
  }

  /* 情况二：多图网格 */
  .image-grid {
    display: grid;
    gap: 4px;
    /* 网格间距 */

    /* 默认是 3 列，适用于 2, 3, 5, 6, 7, 8, 9 张图 */
    grid-template-columns: repeat(3, 70px);
  }

  /* 特殊情况：4 张图时，强制为 2 列 */
  .image-grid.four-grid {
    grid-template-columns: repeat(2, 70px);
  }

  /* 网格中的图片样式 */
  .grid-image {
    width: 70px;
    height: 70px;
    border-radius: 4px;
  }

  .grid-image .gallery-image {
    width: 100%;
    height: 100%;
  }

  /* 2.4 创建时间 */
  .timestamp {
    font-size: 11px;
    color: #999999;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .moments-list {
      padding: 5px 5px 5px 0;
    }

    .post-item {
      padding: 15px 10px;
    }

    .avatar-img {
      width: 34px;
      height: 34px;
    }

    .nickname {
      font-size: 14px;
    }

    .content-text {
      font-size: 14px;
    }

    .timestamp {
      font-size: 11px;
    }

    .image-grid {
      grid-template-columns: repeat(3, calc((100% - 8px) / 3));
      max-width: 200px;
    }

    .image-grid.four-grid {
      grid-template-columns: repeat(2, calc((100% - 4px) / 2));
      max-width: 200px;
    }

    .grid-image {
      width: 100%;
      height: auto;
      aspect-ratio: 1;
    }

    .single-image {
      max-width: 180px;
      max-height: 240px;
    }

    .single-image .gallery-image {
      max-height: 240px;
    }
  }

  /* 加载更多按钮 */
  .load-more-container {
    text-align: center;
    padding: 20px 0;
    margin-top: 10px;
  }

  .load-more-btn {
    padding: 8px 24px;
    background: transparent;
    border: 1px solid #d0d0d0;
    border-radius: 20px;
    color: #666;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .load-more-btn:hover {
    border-color: #576b95;
    color: #576b95;
    background: rgba(87, 107, 149, 0.05);
  }

  .load-more-btn:active {
    transform: scale(0.98);
  }

  /* 图片预览遮罩层 */
  .image-viewer {
    position: fixed;
    inset: 0;
    width: 100vw;
    height: 100vh;
    background-color: transparent;
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    animation: fadeIn 0.2s ease;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }

  .viewer-image {
    max-width: 90vw;
    max-height: 90vh;
    width: auto;
    height: auto;
    object-fit: contain;
    cursor: pointer;
    animation: zoomIn 0.3s ease;
    display: block;
    margin: 0;
    pointer-events: auto;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes zoomIn {
    from {
      transform: scale(0.8);
      opacity: 0;
    }

    to {
      transform: scale(1);
      opacity: 1;
    }
  }

  /* 移动端适配 */
  @media (max-width: 768px) {
    .viewer-image {
      max-width: 95vw;
      max-height: 95vh;
    }
  }
</style>
