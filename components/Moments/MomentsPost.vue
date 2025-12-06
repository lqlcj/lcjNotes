<template>
  <div class="moments-list">
    <div v-if="posts.length === 0" class="empty-state">
      <p>暂无动态</p>
    </div>
    <div v-for="post in posts" :key="post.id" class="post-item">
      <div class="avatar-container">
        <img :src="post.author.avatar || avatarImage" alt="avatar" class="avatar-img" @error="handleAvatarError" />
      </div>
      <div class="post-content">
        <div class="nickname">{{ post.author.nickname }}</div>
        <p class="content-text" v-html="post.content.replace(/\n/g, '<br/>')"></p>
        <div v-if="post.images && post.images.length > 0" class="image-gallery">
          <div v-if="post.images.length === 1" class="image-wrapper single-image">
            <img :src="post.images[0]" alt="post image" class="gallery-image"
              @click="openImageViewer(post.images[0])" />
          </div>
          <div v-else class="image-grid" :class="{ 'four-grid': post.images.length === 4 }">
            <div v-for="(image, index) in post.images" :key="index" class="image-wrapper grid-image">
              <img :src="image" alt="post image" class="gallery-image" @click="openImageViewer(image)" />
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

    <!-- 图片预览遮罩层 -->
    <div v-if="viewerImage" class="image-viewer" @click="closeImageViewer">
      <img :src="viewerImage" alt="预览图片" class="viewer-image" @click.stop />
    </div>
  </div>
</template>

<script setup>
  import { ref, onBeforeUnmount, computed, onMounted } from 'vue'
  import momentsData from '~/data/moments.json'
  import avatarImage from '~/assets/images/home/avatar.webp'

  // 预加载 Moments 目录下的所有图片，生成一个「路径 -> 图片」映射
  let rawMomentImages = {}
  let momentsImageMap = {}

  try {
    rawMomentImages = import.meta.glob('~/assets/images/Moments/*', {
      eager: true,
      import: 'default'
    })

    momentsImageMap = Object.entries(rawMomentImages).reduce((acc, [key, value]) => {
      // 将路径标准化，支持多种路径格式
      const normalizedKey = key.replace(/.*\/assets\/images\/Moments\//, '')
      // 支持 ~/assets/images/Moments/xxx 格式
      acc[`~/assets/images/Moments/${normalizedKey}`] = value
      // 支持 /src/assets/images/Moments/xxx 格式（兼容旧数据）
      acc[`/src/assets/images/Moments/${normalizedKey}`] = value
      // 支持相对路径
      acc[`../../assets/images/Moments/${normalizedKey}`] = value
      return acc
    }, {})
  } catch (error) {
    console.error('加载 Moments 图片失败:', error)
  }

  // 处理图片路径
  const resolveImagePath = (path) => {
    if (!path) return path

    // 处理头像路径（支持多种格式）
    if (
      path === '~/assets/images/home/avatar.webp' ||
      path === '/src/assets/images/home/avatar.webp' ||
      path === '@/assets/images/home/avatar.webp' ||
      path.includes('avatar.webp')
    ) {
      return avatarImage
    }

    // 处理 Moments 图片路径（支持多种格式）
    if (
      path.startsWith('~/assets/images/Moments/') ||
      path.startsWith('/src/assets/images/Moments/') ||
      path.startsWith('../../assets/images/Moments/') ||
      path.includes('Moments/')
    ) {
      // 尝试多种路径格式匹配
      const resolved = momentsImageMap[path] || 
                      momentsImageMap[path.replace(/.*\/Moments\//, '~/assets/images/Moments/')] ||
                      momentsImageMap[path.replace(/.*\/Moments\//, '/src/assets/images/Moments/')] ||
                      momentsImageMap[path.replace(/.*\/Moments\//, '../../assets/images/Moments/')]
      
      if (resolved) {
        return resolved
      }
      
      // 如果找不到，尝试直接使用原始路径（可能是外部 URL）
      return path
    }

    return path
  }

  // 处理所有数据，转换图片路径
  const allPosts = computed(() => {
    try {
      if (!momentsData || !Array.isArray(momentsData)) {
        console.warn('momentsData 不是有效数组')
        return []
      }
      return momentsData.map(post => ({
        ...post,
        author: {
          ...post.author,
          avatar: resolveImagePath(post.author?.avatar)
        },
        images: post.images ? post.images.map(img => resolveImagePath(img)) : []
      }))
    } catch (error) {
      console.error('处理 Moments 数据失败:', error)
      return []
    }
  })

  // 分页相关
  const pageSize = 10 // 每页显示10条
  const currentPage = ref(1)
  const isLoading = ref(false)

  // 当前显示的文章列表
  const posts = computed(() => {
    return allPosts.value.slice(0, currentPage.value * pageSize)
  })

  // 是否还有更多
  const hasMore = computed(() => {
    return allPosts.value.length > currentPage.value * pageSize
  })

  // 加载更多
  const loadMore = () => {
    if (isLoading.value || !hasMore.value) return

    isLoading.value = true
    // 模拟加载延迟
    setTimeout(() => {
      currentPage.value++
      isLoading.value = false
    }, 500)
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
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.9);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    animation: fadeIn 0.2s ease;
  }

  .viewer-image {
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    cursor: default;
    animation: zoomIn 0.3s ease;
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
      max-width: 95%;
      max-height: 95%;
    }
  }
</style>
