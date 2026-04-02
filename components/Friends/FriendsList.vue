<template>
  <div class="friends-list">
    <div v-if="isLoading" class="loading-state">
      <p>加载中...</p>
    </div>
    <div v-else-if="friends.length === 0" class="empty-state">
      <p>暂无友链，快来申请吧！</p>
    </div>

    <div v-else class="friends-grid">
        <div 
          v-for="(friend, index) in friends" 
          :key="index" 
          class="friend-card glass-panel"
          @click="handleCardClick(friend.url)"
        >
          <div class="friend-avatar">
            <img 
              :src="friend.avatar" 
              :alt="friend.name" 
              loading="lazy"
              decoding="async"
              @error="handleImageError" 
            />
          </div>
          <div class="friend-info">
            <h3 class="friend-name">{{ friend.name }}</h3>
            <p class="friend-description">{{ friend.description || '暂无描述' }}</p>
          </div>
          
          <!-- 外部链接图标 - 始终显示 -->
          <div class="friend-arrow">↗</div>
        </div>
    </div>
  </div>
</template>

<script setup>
  /**
   * 友链列表组件。
   *
   * 功能：加载并展示已审核的友链列表，支持图片兜底与卡片跳转。
   */
  import { ref, onMounted } from 'vue'
  // 使用 public 目录下的图片
  const defaultAvatar = '/images/home/avatar.webp'

  const friends = ref([])
  const isLoading = ref(true)

  // 加载友链数据
  const loadFriends = async () => {
    try {
      isLoading.value = true
      // 从 API 加载已批准的友链
      const response = await $fetch('/api/friends')
      if (response.success && response.data) {
        // 处理头像路径
        friends.value = response.data.map(friend => ({
          ...friend,
          avatar: friend.avatar || defaultAvatar
        }))
      } else {
        friends.value = []
      }
    } catch (error) {
      console.error('加载友链数据失败:', error)
      friends.value = []
    } finally {
      isLoading.value = false
    }
  }

  // 图片加载错误处理
  const handleImageError = (event) => {
    event.target.src = defaultAvatar
  }

  // 处理卡片点击 - 直接跳转
  const handleCardClick = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  onMounted(() => {
    loadFriends()
  })
</script>

<style scoped>
  .friends-list {
    width: 100%;
  }

  .empty-state,
  .loading-state {
    text-align: center;
    padding: 24px 20px;
    color: #999;
    font-size: 0.85rem;
  }

  .loading-state {
    color: #666;
  }

  .friends-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;
    width: 100%;
  }

  .friend-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    /* 米白色/奶油色背景 */
    background: #fcfbf9;
    /* 边框样式 */
    border: 1px solid rgba(104, 68, 77, 0.15);
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease-in-out;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    /* 性能优化：使用 GPU 加速 */
    transform: translateZ(0);
    will-change: transform;
    /* 柔和且带有暖色调的阴影 */
    box-shadow:
      0 8px 32px rgba(255, 165, 0, 0.08),
      0 4px 16px rgba(255, 200, 150, 0.12),
      0 2px 8px rgba(0, 0, 0, 0.04);
  }

  .friend-card:hover {
    transform: translateY(-4px);
    background: rgba(252, 251, 249, 0.98);
    border-color: rgba(104, 68, 77, 0.25);
    box-shadow:
      0 12px 40px rgba(255, 165, 0, 0.12),
      0 6px 20px rgba(255, 200, 150, 0.18),
      0 3px 12px rgba(0, 0, 0, 0.06);
  }

  .friend-card:hover .friend-arrow {
    opacity: 1;
    transform: translate(4px, -4px);
  }

  .friend-avatar {
    flex-shrink: 0;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    overflow: hidden;
    border: 1px solid rgba(44, 62, 80, 0.1);
    background: #fff;
  }

  .friend-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    /* 性能优化 */
    will-change: opacity;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .friend-info {
    flex: 1;
    min-width: 0;
  }

  .friend-name {
    font-size: 0.95rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 2px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .friend-description {
    font-size: 0.75rem;
    color: #666;
    margin: 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* 外部链接图标 - 始终显示 */
  .friend-arrow {
    position: absolute;
    top: 12px;
    right: 12px;
    font-size: 1rem;
    color: #2c3e50;
    opacity: 0.6;
    transition: all 0.3s ease;
    z-index: 1;
  }

  .friend-card:hover .friend-arrow {
    opacity: 1;
    transform: translate(4px, -4px);
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .friends-grid {
      grid-template-columns: 1fr;
      gap: 10px;
    }

    .friend-card {
      padding: 10px;
    }

    .friend-avatar {
      width: 36px;
      height: 36px;
    }

    .friend-name {
      font-size: 0.9rem;
    }

    .friend-description {
      font-size: 0.7rem;
    }
  }

  /* ========== 深色模式支持 ========== */
  @media (prefers-color-scheme: dark) {
    .friend-card {
      background: rgba(40, 35, 35, 0.95);
      border-color: rgba(212, 165, 181, 0.2);
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.3),
        0 4px 16px rgba(0, 0, 0, 0.2);
    }

    .friend-card:hover {
      background: rgba(50, 45, 45, 0.98);
      border-color: rgba(212, 165, 181, 0.3);
      box-shadow:
        0 12px 40px rgba(0, 0, 0, 0.4),
        0 6px 20px rgba(0, 0, 0, 0.3);
    }

  }
</style>
