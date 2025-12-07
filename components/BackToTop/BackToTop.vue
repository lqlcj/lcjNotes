<!--
  回到顶部按钮组件
  
  功能：
    - 当页面向下滚动超过300px时显示按钮
    - 点击按钮平滑滚动到页面顶部
    - 支持响应式设计，移动端和桌面端自适应
    - 支持深色模式
  
  特性：
    - 米白色纸张质感设计
    - 漂浮动画效果
    - 淡入淡出过渡动画
    - 可访问性优化（aria-label）
-->
<template>
  <transition name="fade-slide">
    <button v-if="visible" class="back-to-top floating-button" @click="scrollToTop" title="回到顶部" aria-label="回到顶部">
      <!-- SVG 向上箭头图标 -->
      <svg class="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 19V5M12 5L5 12M12 5L19 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
          stroke-linejoin="round" />
      </svg>
    </button>
  </transition>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'

  const visible = ref(false)

  // 监听滚动事件
  const handleScroll = () => {
    // 当向下滚动超过 300px 时显示按钮
    visible.value = window.scrollY > 300
  }

  // 核心功能：平滑滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 关键：平滑滚动
    })
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
    // 初始检查
    handleScroll()
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
</script>

<style scoped>

  /* ========== 回到顶部按钮 - 米白色纸张质感 ========== */
  .back-to-top {
    position: fixed;
    bottom: 150px;
    right: 350px;
    width: 52px;
    height: 52px;

    /* 米白色/奶油色背景 */
    background: #fcfbf9;

    /* 温和的圆角 */
    border-radius: 16px;

    /* 布局 */
    display: flex;
    align-items: center;
    justify-content: center;

    /* 交互 */
    cursor: pointer;
    border: 1px solid rgba(104, 68, 77, 0.15);
    outline: none;

    /* 层级 */
    z-index: 999;

    /* 柔和且带有暖色调的阴影 */
    box-shadow:
      0 8px 32px rgba(255, 165, 0, 0.08),
      0 4px 16px rgba(255, 200, 150, 0.12),
      0 2px 8px rgba(0, 0, 0, 0.04);

    /* 漂浮动画 */
    animation: floating 3s ease-in-out infinite;

    /* 过渡动画 */
    transition: all 0.3s ease-in-out;
  }

  /* 漂浮动画 */
  @keyframes floating {

    0%,
    100% {
      transform: translateY(0px);
    }

    50% {
      transform: translateY(-6px);
    }
  }

  /* 悬停效果 - 上浮并增强阴影 */
  .back-to-top:hover {
    transform: translateY(-4px);
    background: rgba(252, 251, 249, 0.98);
    border-color: rgba(104, 68, 77, 0.25);
    box-shadow:
      0 12px 40px rgba(255, 165, 0, 0.12),
      0 6px 20px rgba(255, 200, 150, 0.18),
      0 3px 12px rgba(0, 0, 0, 0.06);
  }

  /* 点击效果 */
  .back-to-top:active {
    transform: translateY(-2px);
    transition: all 0.15s ease;
  }

  /* 焦点样式 - 可访问性优化 */
  .back-to-top:focus-visible {
    outline: 2px solid rgba(104, 68, 77, 0.5);
    outline-offset: 3px;
  }

  /* ========== SVG 图标样式 ========== */
  .icon {
    width: 20px;
    height: 20px;
    color: #68444d;
    transition: all 0.3s ease-in-out;
  }

  /* 悬停时图标颜色变化和轻微上移 */
  .back-to-top:hover .icon {
    color: #8b5a6b;
    transform: translateY(-2px);
  }

  /* ========== 进出场动画 ========== */
  .fade-slide-enter-active {
    transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .fade-slide-leave-active {
    transition: all 0.3s ease-in;
  }

  .fade-slide-enter-from {
    opacity: 0;
    transform: translateY(20px) scale(0.8);
  }

  .fade-slide-leave-to {
    opacity: 0;
    transform: translateY(15px) scale(0.9);
  }

  /* ========== 响应式设计 ========== */
  @media (max-width: 768px) {
    .back-to-top {
      bottom: 100px;
      right: 20px;
      width: 48px;
      height: 48px;
      border-radius: 14px;
    }

    .icon {
      width: 18px;
      height: 18px;
    }
  }

  /* 小屏幕设备优化 */
  @media (max-width: 480px) {
    .back-to-top {
      bottom: 90px;
      right: 16px;
      width: 44px;
      height: 44px;
      border-radius: 12px;
    }

    .icon {
      width: 16px;
      height: 16px;
    }
  }

  /* ========== 深色模式支持 ========== */
  @media (prefers-color-scheme: dark) {
    .back-to-top {
      background: rgba(40, 35, 35, 0.95);
      border-color: rgba(212, 165, 181, 0.2);
      box-shadow:
        0 8px 32px rgba(0, 0, 0, 0.3),
        0 4px 16px rgba(0, 0, 0, 0.2);
    }

    .back-to-top:hover {
      background: rgba(50, 45, 45, 0.98);
      border-color: rgba(212, 165, 181, 0.3);
      box-shadow:
        0 12px 40px rgba(0, 0, 0, 0.4),
        0 6px 20px rgba(0, 0, 0, 0.3);
    }

    .icon {
      color: #d4a5b5;
    }

    .back-to-top:hover .icon {
      color: #e8c4d4;
    }
  }
</style>
