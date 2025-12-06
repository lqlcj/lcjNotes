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
          :class="{ 'show-confirm': confirmingIndex === index }"
          @click="handleCardClick(friend.url, index)"
        >
          <div class="friend-avatar">
            <img :src="friend.avatar" :alt="friend.name" @error="handleImageError" />
          </div>
          <div class="friend-info">
            <h3 class="friend-name">{{ friend.name }}</h3>
            <p class="friend-description">{{ friend.description || '暂无描述' }}</p>
          </div>
          
          <!-- 外部链接图标 - 始终显示 -->
          <div class="friend-arrow">↗</div>
          
          <!-- 确认按钮区域 -->
          <div v-if="confirmingIndex === index" class="confirm-overlay">
            <div class="confirm-content">
              <p class="confirm-text">即将跳转到外部链接</p>
              <div class="confirm-buttons">
                <button class="confirm-btn confirm" @click.stop="confirmNavigate(friend.url, index)">
                  确认跳转
                </button>
                <button class="confirm-btn cancel" @click.stop="cancelConfirm">
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted } from 'vue'
  // 使用 public 目录下的图片
  const defaultAvatar = '/images/home/avatar.webp'

  const friends = ref([])
  const confirmingIndex = ref(null)
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

  // 处理卡片点击
  const handleCardClick = (url, index) => {
    // 如果已经在确认状态，不重复触发
    if (confirmingIndex.value === index) {
      return
    }
    // 显示确认按钮
    confirmingIndex.value = index
  }

  // 确认跳转
  const confirmNavigate = (url, index) => {
    window.open(url, '_blank', 'noopener,noreferrer')
    confirmingIndex.value = null
  }

  // 取消确认
  const cancelConfirm = () => {
    confirmingIndex.value = null
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
    background: #faf9f6;
    border: 1px solid #d4c5b0;
    border-radius: 8px;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    cursor: pointer;
  }

  .friend-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
    border-color: #c4b5a0;
  }

  .friend-card.show-confirm {
    border-color: #8ec5fc;
    box-shadow: 0 4px 16px rgba(142, 197, 252, 0.3);
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

  /* 确认覆盖层 */
  .confirm-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(250, 249, 246, 0.98);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    border-radius: 8px;
    animation: fadeIn 0.2s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  .confirm-content {
    text-align: center;
    padding: 16px;
  }

  .confirm-text {
    font-size: 0.85rem;
    color: #2c3e50;
    margin: 0 0 12px 0;
    font-weight: 500;
  }

  .confirm-buttons {
    display: flex;
    gap: 8px;
    justify-content: center;
  }

  .confirm-btn {
    padding: 6px 16px;
    border: 1px solid #d4c5b0;
    border-radius: 6px;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
  }

  .confirm-btn.confirm {
    background: linear-gradient(135deg, #8ec5fc 0%, #e0c3fc 100%);
    color: #fff;
    border-color: transparent;
  }

  .confirm-btn.confirm:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(142, 197, 252, 0.4);
  }

  .confirm-btn.cancel {
    background: #fff;
    color: #666;
    border-color: #d4c5b0;
  }

  .confirm-btn.cancel:hover {
    background: #f5f5f5;
    border-color: #c4b5a0;
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

    .confirm-text {
      font-size: 0.8rem;
      margin-bottom: 10px;
    }

    .confirm-btn {
      padding: 5px 12px;
      font-size: 0.75rem;
    }
  }
</style>
