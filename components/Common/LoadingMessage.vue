<template>
  <div class="loading-container">
    <div class="loading-content">
      <!-- 加载动画 -->
      <div class="loading-spinner">
        <div class="spinner-dot"></div>
        <div class="spinner-dot"></div>
        <div class="spinner-dot"></div>
      </div>
      
      <!-- 加载文字 -->
      <p class="loading-text">{{ text }}</p>
    </div>
  </div>
</template>

<script setup>
  /**
   * 加载消息组件。
   *
   * 功能：显示加载动画与自定义提示文字，适配响应式与减少动画偏好。
   */
  defineProps({
    text: {
      type: String,
      default: '飘洋过海来看你~'
    }
  })
</script>

<style scoped>
  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
    padding: 40px 20px;
    width: 100%;
  }

  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }

  /* 加载动画 - 三个点的跳动效果 */
  .loading-spinner {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
  }

  .spinner-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #e0c3fc 100%);
    animation: bounce 1.4s ease-in-out infinite both;
    box-shadow: 0 2px 10px rgba(255, 154, 158, 0.4);
  }

  .spinner-dot:nth-child(1) {
    animation-delay: -0.32s;
  }

  .spinner-dot:nth-child(2) {
    animation-delay: -0.16s;
  }

  .spinner-dot:nth-child(3) {
    animation-delay: 0s;
  }

  @keyframes bounce {
    0%, 80%, 100% {
      transform: scale(0.8) translateY(0);
      opacity: 0.5;
    }
    40% {
      transform: scale(1.2) translateY(-12px);
      opacity: 1;
    }
  }

  /* 加载文字样式 */
  .loading-text {
    font-size: 16px;
    color: #666;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Helvetica Neue", "PingFang SC", "Microsoft YaHei", sans-serif;
    font-weight: 400;
    letter-spacing: 2px;
    animation: fadeInOut 2s ease-in-out infinite;
    text-align: center;
    position: relative;
  }

  .loading-text::before {
    content: '🌊';
    display: inline-block;
    margin-right: 8px;
    animation: wave 2s ease-in-out infinite;
  }

  @keyframes wave {
    0%, 100% {
      transform: translateY(0) rotate(0deg);
    }
    25% {
      transform: translateY(-4px) rotate(-5deg);
    }
    75% {
      transform: translateY(-4px) rotate(5deg);
    }
  }

  @keyframes fadeInOut {
    0%, 100% {
      opacity: 0.6;
    }
    50% {
      opacity: 1;
    }
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .loading-container {
      min-height: 150px;
      padding: 30px 15px;
    }

    .loading-content {
      gap: 20px;
    }

    .loading-text {
      font-size: 14px;
    }

    .spinner-dot {
      width: 8px;
      height: 8px;
    }
  }

  /* 支持减少动画偏好 */
  @media (prefers-reduced-motion: reduce) {
    .spinner-dot {
      animation: none;
      opacity: 1;
    }

    .loading-text {
      animation: none;
      opacity: 1;
    }
  }
</style>

