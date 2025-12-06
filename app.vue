<template>
  <div class="app-container">
    <LayoutHeader />

    <div class="main-content">
      <!-- 
        使用错误边界组件包裹路由视图
        作用：捕获路由组件中的未处理错误，防止整个应用崩溃
        如果某个页面组件出错，会显示友好的错误提示界面
      -->
      <ErrorBoundary>
        <NuxtPage />
      </ErrorBoundary>
    </div>

    <LayoutFooter />

    <BackToTop />

    <!-- 全局路由 Loading 遮罩 -->
    <PageLoading />
  </div>
</template>

<script setup>
  /**
   * app.vue - 应用根组件
   * 
   * 功能：
   * 1. 全局布局：Header + Content + Footer
   * 2. 路由视图：使用 NuxtPage 显示不同页面
   * 3. 错误处理：使用 ErrorBoundary 捕获组件错误
   * 
   * 全局错误处理说明：
   * - ErrorBoundary 组件：捕获子组件中的渲染错误
   * - Nuxt 的错误处理：捕获全局未处理的错误（如异步错误）
   * - 两者配合使用，提供完整的错误处理机制
   */

  import LayoutHeader from '~/components/Layouts/Header.vue'
  import LayoutFooter from '~/components/Layouts/Footer.vue'
  import BackToTop from '~/components/BackToTop/BackToTop.vue'
  // 导入错误边界组件
  import ErrorBoundary from '~/components/ErrorBoundary/ErrorBoundary.vue'
  import PageLoading from '~/components/Common/PageLoading.vue'
  // 使用 public 目录下的图片
  const backgroundImage = '/images/background-body.webp'
  
  // 将图片路径转换为 CSS 可用的格式
  const backgroundImageUrl = `url("${backgroundImage}")`
</script>

<style scoped>
  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    /* 🔴 恢复原样：完全保留你原本的背景写法，不做任何缩放或固定 */
    background-image: v-bind('backgroundImageUrl');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
  }

  /* 新增布局样式：只负责撑开高度，不涉及颜色或图片 */
  .main-content {
    flex: 1;
    /* 让内容区占据剩余空间，把 Footer 挤到最下面 */
    width: 100%;
  }

  /* 移动端：为底部固定导航栏留出空间 */
  @media (max-width: 768px) {
    .main-content {
      padding-bottom: 70px;
      /* 为底部导航栏留出空间 */
    }
  }
</style>

