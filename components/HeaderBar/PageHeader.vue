<template>
  <div class="page-header fade-in-up">
    <div class="title-wrapper">
      <div class="divider-line"></div>
      <div class="title-content">
        <h2 class="handwritten">{{ title }}</h2>
        <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
      </div>
      <div class="divider-line"></div>
    </div>
  </div>
</template>

<script setup>
  /**
   * 页面标题头部组件。
   *
   * 用途：用于页面顶部展示主标题与副标题，提供统一视觉风格与淡入动画。
   *
   * Props：
   * - title：主标题文本（必填）
   * - subtitle：副标题文本（可选）
   */

  // 定义组件 props
  defineProps({
    // 主标题文本（必填）
    title: {
      type: String,
      required: true,
      default: ''
    },
    // 副标题文本（可选）
    subtitle: {
      type: String,
      default: ''
    }
  });
</script>

<style scoped>

  /* 标题容器样式 - 居中显示，底部间距30px */
  .page-header {
    margin-bottom: 30px;
    color: #5d4037;
  }

  /* 标题包装器 - 使用 flexbox 布局 */
  .title-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 24px;
  }

  /* 标题内容区域 */
  .title-content {
    text-align: center;
  }

  /* 手写风格主标题 - 使用 Caveat 字体 */
  .handwritten {
    font-family: 'Caveat', cursive;
    font-size: 3rem;
    margin: 0;
    white-space: nowrap;
  }

  /* 副标题样式 - 灰色，较小字号，带字间距 */
  .subtitle {
    font-size: 1rem;
    color: #888;
    margin-top: 5px;
    margin-bottom: 20px;
    letter-spacing: 2px;
  }

  /* 分割线样式 */
  .divider-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, transparent, #d4c5b0, transparent);
    max-width: 200px;
  }

  /* 淡入向上动画效果 - 从下方20px淡入 */
  .fade-in-up {
    opacity: 0;
    animation: slideUpFade 0.8s ease-out forwards;
  }

  /* 动画关键帧定义 */
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

  /* 响应式设计：移动端适配 */
  @media (max-width: 768px) {
    .page-header {
      margin-bottom: 20px;
    }

    .title-wrapper {
      gap: 12px;
    }

    .handwritten {
      font-size: 2rem;
      white-space: normal;
    }

    .subtitle {
      font-size: 0.9rem;
      letter-spacing: 1px;
      margin-top: 3px;
      margin-bottom: 15px;
    }

    .divider-line {
      max-width: 80px;
    }
  }

  @media (max-width: 480px) {
    .page-header {
      margin-bottom: 15px;
    }

    .title-wrapper {
      gap: 8px;
    }

    .handwritten {
      font-size: 1.6rem;
    }

    .subtitle {
      font-size: 0.8rem;
      letter-spacing: 0.5px;
      margin-bottom: 12px;
    }

    .divider-line {
      max-width: 50px;
    }
  }
</style>
