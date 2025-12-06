<template>
  <transition name="fade-slide">
    <button v-if="visible" class="back-to-top" @click="scrollToTop" title="回到顶部" aria-label="回到顶部">
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

  // 1. 监听滚动事件
  const handleScroll = () => {
    // 当向下滚动超过 300px 时显示按钮
    visible.value = window.scrollY > 300
  }

  // 2. 核心功能：平滑滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 关键：平滑滚动
    })
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })
</script>

<style scoped>

  /* ========== 回到顶部按钮 - 现代玻璃态设计 ========== */
  .back-to-top {
    position: fixed;
    bottom: 50px;
    right: 50px;
    width: 52px;
    height: 52px;

    /* 玻璃态效果 - 毛玻璃背景 */
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);

    /* 圆角 */
    border-radius: 12px;

    /* 布局 */
    display: flex;
    align-items: center;
    justify-content: center;

    /* 交互 */
    cursor: pointer;
    border: 1px solid rgba(108, 92, 231, 0.2);
    outline: none;

    /* 层级 */
    z-index: 999;

    /* 阴影 - 现代扁平化阴影 */
    box-shadow:
      0 4px 20px rgba(108, 92, 231, 0.15),
      0 2px 8px rgba(0, 0, 0, 0.08);

    /* 过渡动画 */
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* 悬停效果 - 上浮并增强阴影 */
  .back-to-top:hover {
    transform: translateY(-4px);
    background: rgba(255, 255, 255, 0.95);
    border-color: rgba(108, 92, 231, 0.3);
    box-shadow:
      0 8px 28px rgba(108, 92, 231, 0.25),
      0 4px 12px rgba(0, 0, 0, 0.1);
  }

  /* 点击效果 */
  .back-to-top:active {
    transform: translateY(-2px);
    transition: all 0.15s ease;
  }

  /* 焦点样式 - 可访问性优化 */
  .back-to-top:focus-visible {
    outline: 2px solid #6c5ce7;
    outline-offset: 3px;
  }

  /* ========== SVG 图标样式 ========== */
  .icon {
    width: 20px;
    height: 20px;
    color: #6c5ce7;
    transition: all 0.3s ease;
  }

  /* 悬停时图标颜色变化和轻微上移 */
  .back-to-top:hover .icon {
    color: #a29bfe;
    transform: translateY(-1px);
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
      bottom: 30px;
      right: 30px;
      width: 48px;
      height: 48px;
      border-radius: 10px;
    }

    .icon {
      width: 18px;
      height: 18px;
    }
  }

  /* 小屏幕设备优化 */
  @media (max-width: 480px) {
    .back-to-top {
      bottom: 20px;
      right: 20px;
      width: 44px;
      height: 44px;
    }
  }

  /* ========== 深色模式支持 ========== */
  @media (prefers-color-scheme: dark) {
    .back-to-top {
      background: rgba(30, 30, 40, 0.9);
      border-color: rgba(162, 155, 254, 0.3);
      box-shadow:
        0 4px 20px rgba(108, 92, 231, 0.25),
        0 2px 8px rgba(0, 0, 0, 0.2);
    }

    .back-to-top:hover {
      background: rgba(40, 40, 50, 0.95);
      border-color: rgba(162, 155, 254, 0.4);
    }

    .icon {
      color: #a29bfe;
    }

    .back-to-top:hover .icon {
      color: #c4b5fd;
    }
  }
</style>
