<template>
  <div class="tools-page">
    <div class="tools-container">
      <div class="tools-box">
        <!-- 页面标题 -->
        <PageHeader title="Tools" subtitle="Useful tools and utilities." />

        <!-- Tab 标签�?-->
        <div class="tabs-container">
          <div class="tabs-header">
            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
              :class="['tab-button', { active: activeTab === tab.id }]">
              {{ tab.label }}
            </button>
          </div>

          <!-- Tab 内容区域 -->
          <div class="tabs-content">
            <!-- 书签标签�?-->
            <div v-if="activeTab === 'bookmarks'" class="tab-panel">
              <div class="bookmarks-content">
                <LoadingMessage v-if="bookmarksLoading" text="飘洋过海来看你~" />
                <div v-else-if="bookmarks.length === 0" class="empty-state">
                  <p class="placeholder-text">还没有书签，去管理后台添加吧~</p>
                </div>
                <div v-else class="bookmarks-grid">
                  <div v-for="bookmark in bookmarks" :key="bookmark.id" class="bookmark-card"
                    :class="{ 'showing-confirm': confirmingBookmarkId === bookmark.id }">
                    <!-- 正常显示内容 -->
                    <div v-if="confirmingBookmarkId !== bookmark.id" class="bookmark-content"
                      @click="showConfirm(bookmark.id)">
                      <div class="bookmark-icon">🔖</div>
                      <div class="bookmark-info">
                        <h3 class="bookmark-name">{{ bookmark.name }}</h3>
                        <p v-if="bookmark.description" class="bookmark-description">{{ bookmark.description }}</p>
                        <p class="bookmark-url">{{ bookmark.url }}</p>
                      </div>
                    </div>

                    <!-- 确认�?-->
                    <div v-else class="bookmark-confirm">
                      <div class="confirm-content">
                        <div class="confirm-icon">🔗</div>
                        <h3 class="confirm-title">访问网站</h3>
                        <p class="confirm-name">{{ bookmark.name }}</p>
                        <p class="confirm-url">{{ bookmark.url }}</p>
                        <p class="confirm-disclaimer">⚠️ 外站内容与本站无关，请注意安全</p>
                        <div class="confirm-actions">
                          <button @click.stop="confirmVisit(bookmark)" class="confirm-btn">确认</button>
                          <button @click.stop="cancelConfirm" class="cancel-btn">取消</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 知识库标签页 -->

            <!-- 管理后台标签�?-->
            <div v-if="activeTab === 'admin'" class="tab-panel">
              <AdminPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, watch } from 'vue'
  import PageHeader from '~/components/HeaderBar/PageHeader.vue'
  import AdminPanel from '~/pages/me.vue'
  import LoadingMessage from '~/components/Common/LoadingMessage.vue'

  // Tab 配置
  const tabs = [
    { id: 'bookmarks', label: '书签' },
    { id: 'admin', label: 'Me' }
  ]

  // 当前激活的标签
  const activeTab = ref('bookmarks')

  // 书签相关
  const bookmarks = ref([])
  const bookmarksLoading = ref(false)
  const confirmingBookmarkId = ref(null)

  // 加载书签列表
  const loadBookmarks = async () => {
    bookmarksLoading.value = true
    try {
      const response = await $fetch('/api/bookmarks')
      if (response.success) {
        bookmarks.value = response.data || []
      }
    } catch (error) {
      console.error('加载书签失败:', error)
    } finally {
      bookmarksLoading.value = false
    }
  }

  // 监听标签切换，加载书�?
  watch(activeTab, (newTab) => {
    if (newTab === 'bookmarks' && bookmarks.value.length === 0) {
      loadBookmarks()
    }
  })

  // 显示确认�?
  const showConfirm = (bookmarkId) => {
    confirmingBookmarkId.value = bookmarkId
  }

  // 确认访问
  const confirmVisit = (bookmark) => {
    window.open(bookmark.url, '_blank', 'noopener,noreferrer')
    cancelConfirm()
  }

  // 取消确认
  const cancelConfirm = () => {
    confirmingBookmarkId.value = null
  }

  onMounted(() => {
    loadBookmarks()
  })
</script>

<style scoped>
  .tools-page {
    min-height: 100vh;
    padding: 40px 20px 80px;
    background-color: transparent;
  }

  .tools-container {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .tools-box {
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 24px;
    padding: 60px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
    width: 100%;
    box-sizing: border-box;
  }

  /* Tab 标签页样�?*/
  .tabs-container {
    width: 100%;
    margin-top: 40px;
  }

  .tabs-header {
    display: flex;
    gap: 8px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.08);
    margin-bottom: 30px;
  }

  .tab-button {
    padding: 12px 24px;
    background: transparent;
    border: none;
    border-bottom: 3px solid transparent;
    color: #666;
    font-size: 15px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    margin-bottom: -2px;
  }

  .tab-button:hover {
    color: #68444d;
    background: rgba(104, 68, 77, 0.08);
  }

  .tab-button.active {
    color: #68444d;
    border-bottom-color: #68444d;
    font-weight: 600;
    background: rgba(104, 68, 77, 0.05);
  }

  .tabs-content {
    width: 100%;
    min-height: 400px;
  }

  .tab-panel {
    width: 100%;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* 占位内容样式 */
  .placeholder-text {
    color: #999;
    font-size: 16px;
    margin: 0;
  }

  /* 书签列表样式 */
  .bookmarks-content {
    width: 100%;
  }

  .empty-state {
    padding: 60px 20px;
    text-align: center;
  }

  .bookmarks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 20px;
    padding: 20px 0;
  }

  .bookmark-card {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .bookmark-card:hover:not(.showing-confirm) {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    border-color: #68444d;
  }

  .bookmark-card.showing-confirm {
    border-color: #68444d;
    box-shadow: 0 4px 16px rgba(104, 68, 77, 0.2);
  }

  .bookmark-content {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    width: 100%;
  }

  .bookmark-icon {
    font-size: 24px;
    flex-shrink: 0;
    margin-top: 2px;
  }

  .bookmark-info {
    flex: 1;
    min-width: 0;
  }

  .bookmark-name {
    font-size: 16px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 8px 0;
    word-break: break-word;
  }

  .bookmark-description {
    font-size: 14px;
    color: #666;
    margin: 0 0 8px 0;
    line-height: 1.5;
    word-break: break-word;
  }

  .bookmark-url {
    font-size: 12px;
    color: #999;
    margin: 0;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  /* 确认框样�?*/
  .bookmark-confirm {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 120px;
  }

  .confirm-content {
    text-align: center;
    width: 100%;
  }

  .confirm-icon {
    font-size: 32px;
    margin-bottom: 12px;
  }

  .confirm-title {
    font-size: 18px;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 12px 0;
  }

  .confirm-name {
    font-size: 16px;
    font-weight: 500;
    color: #68444d;
    margin: 0 0 8px 0;
    word-break: break-word;
  }

  .confirm-url {
    font-size: 12px;
    color: #999;
    margin: 0 0 12px 0;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .confirm-disclaimer {
    font-size: 12px;
    color: #ff9800;
    margin: 0 0 20px 0;
    padding: 8px 12px;
    background: rgba(255, 152, 0, 0.1);
    border-radius: 6px;
    line-height: 1.5;
  }

  .confirm-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
  }

  .confirm-btn,
  .cancel-btn {
    padding: 10px 24px;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .confirm-btn {
    background: #68444d;
    color: white;
  }

  .confirm-btn:hover {
    background: #5a3a42;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(104, 68, 77, 0.3);
  }

  .cancel-btn {
    background: rgba(0, 0, 0, 0.05);
    color: #666;
  }

  .cancel-btn:hover {
    background: rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }

  /* 管理后台样式调整 */
  .tab-panel :deep(.admin-page) {
    background: transparent;
    padding: 0;
  }

  .tab-panel :deep(.admin-container) {
    max-width: 100%;
  }

  /* 响应式设�?*/
  @media (max-width: 768px) {
    .tools-page {
      padding: 30px 10px 60px;
    }

    .tools-box {
      padding: 30px 20px;
    }

    .tabs-container {
      margin-top: 30px;
    }

    .tabs-header {
      flex-wrap: wrap;
      gap: 4px;
    }

    .tab-button {
      padding: 10px 16px;
      font-size: 14px;
    }

    .tabs-content {
      min-height: 300px;
    }

    .bookmarks-content {
      padding: 30px 15px;
    }

    .bookmarks-grid {
      grid-template-columns: 1fr;
      gap: 15px;
      padding: 15px 0;
    }

    .bookmark-card {
      padding: 16px;
    }

    .bookmark-name {
      font-size: 15px;
    }

    .bookmark-description {
      font-size: 13px;
    }

    .bookmark-url {
      font-size: 11px;
    }

    .confirm-title {
      font-size: 16px;
    }

    .confirm-name {
      font-size: 14px;
    }

    .confirm-url {
      font-size: 11px;
    }

    .confirm-actions {
      flex-direction: column;
      gap: 10px;
    }

    .confirm-btn,
    .cancel-btn {
      width: 100%;
      padding: 12px;
    }
  }
</style>
