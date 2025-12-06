<template>
  <div v-if="isPageReady" class="friends-page">
    <div class="friends-container">
      <!-- 页面标题 -->
      <PageHeader title="Friends" subtitle="A curated collection of inspiring creators we support." />

      <!-- 左右布局：朋友圈 + 友链 -->
      <div class="friends-content">
        <!-- 左侧：朋友圈 -->
        <div class="moments-column">
          <MomentsPost />
        </div>

        <!-- 右侧：友链 -->
        <div class="friends-column">
          <!-- 标题和申请按钮 -->
          <div class="section-header">
            <p class="section-subtitle">发现更多有趣的创作者和网站</p>

            <!-- 申请友链按钮 -->
            <OutlineButton ref="buttonRef" @click="handleButtonClick" icon="+">
              申请友链
            </OutlineButton>
          </div>

          <!-- 申请表单 -->
          <FriendRequestForm :is-expanded="isFormExpanded" @close="toggleForm" />

          <!-- 友链列表 -->
          <FriendsList />
        </div>
      </div>
    </div>
  </div>
  <div v-else class="friends-page-loading">
    <p>加载中...</p>
  </div>
</template>

<script setup>
  import { ref, onMounted, nextTick } from 'vue'
  import PageHeader from '~/components/HeaderBar/PageHeader.vue'
  import FriendsList from '~/components/Friends/FriendsList.vue'
  import FriendRequestForm from '~/components/Friends/FriendRequestForm.vue'
  import OutlineButton from '~/components/Common/OutlineButton.vue'
  import MomentsPost from '~/components/Moments/MomentsPost.vue'
  import { useConfetti } from '~/composables/useConfetti'

  const isFormExpanded = ref(false)
  const buttonRef = ref(null)
  const { fromPosition } = useConfetti()
  const isPageReady = ref(true) // 立即显示页面，避免白屏

  // 确保页面正确加载
  onMounted(async () => {
    try {
      // 等待所有组件和异步数据加载完成
      await nextTick()
      // 等待一个渲染周期，确保所有异步组件加载完成
      await new Promise(resolve => setTimeout(resolve, 200))
      console.log('Friends page fully mounted')
    } catch (error) {
      console.error('Friends page mount error:', error)
    }
  })

  const toggleForm = () => {
    isFormExpanded.value = !isFormExpanded.value
  }

  const handleButtonClick = (event) => {
    const wasExpanded = isFormExpanded.value
    toggleForm()

    // 如果是从关闭状态变为打开状态，触发烟花效果
    if (!wasExpanded && isFormExpanded.value) {
      // 获取按钮的位置
      const button = event.currentTarget || (buttonRef.value?.$el) || buttonRef.value
      if (button) {
        const rect = button.getBoundingClientRect()
        const x = (rect.left + rect.width / 2) / window.innerWidth
        const y = (rect.top + rect.height / 2) / window.innerHeight

        // 从按钮位置触发烟花效果
        fromPosition({ x, y })
      } else {
        // 如果无法获取按钮位置，从屏幕中央触发
        fromPosition({ x: 0.5, y: 0.5 })
      }
    }
  }
</script>

<style scoped>
  .friends-page {
    min-height: 100vh;
    padding: 40px 20px 80px;
    background-color: transparent;
  }

  .friends-container {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .friends-content {
    width: 100%;
    display: grid;
    grid-template-columns: 2fr 1fr;
    gap: 30px;
    margin-top: 40px;
    align-items: start;
  }

  /* 左侧：朋友圈 */
  .moments-column {
    /* 朋友圈正常滚动 */
  }

  /* 右侧：友链 */
  .friends-column {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .section-header {
    text-align: center;
  }

  .section-title {
    font-family: 'Caveat', cursive;
    font-size: 1.8rem;
    color: #2c3e50;
    margin: 0 0 4px 0;
    font-weight: 400;
  }

  .section-subtitle {
    font-size: 0.85rem;
    color: #666;
    margin: 0 0 16px 0;
  }

  /* 响应式设计 */
  @media (max-width: 1024px) {
    .friends-content {
      grid-template-columns: 1fr;
      gap: 30px;
    }

    .moments-column {
      position: static;
    }
  }

  .friends-page-loading {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666;
    font-size: 1rem;
  }

  @media (max-width: 768px) {
    .friends-page {
      padding: 30px 10px 60px;
    }

    .friends-content {
      gap: 20px;
      margin-top: 30px;
    }

    .section-title {
      font-size: 1.5rem;
    }

    .section-subtitle {
      font-size: 0.8rem;
    }
  }
</style>
