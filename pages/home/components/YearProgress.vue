<template>
  <!-- 年度进度条卡片 -->
  <!-- 功能：显示当前年份的进度百分比，包含动画效果 -->
  <div class="stat-card glass-panel delay-4">
    <div class="stat-header">
      <span class="stat-title">今年进度</span>
      <span class="stat-value" :key="displayProgress" :class="{ 'is-updating': isUpdating }">{{ displayProgress }}%</span>
    </div>
    <div class="progress-bar">
      <div class="progress-fill" :style="{ width: barWidth + '%' }"></div>
    </div>
    <p class="stat-quote">时间过得真快</p>
  </div>
</template>

<script setup>
  import { ref, watch, onMounted } from 'vue'

  // ========== 年度进度条逻辑 ========== 
  // 功能：计算并显示当前年份的进度百分比，包含动画效果
  const displayProgress = ref('0.0')
  const barWidth = ref(0)
  const isUpdating = ref(false)

  // 监听数字变化，触发跳动动画
  watch(displayProgress, () => {
    isUpdating.value = true
    setTimeout(() => {
      isUpdating.value = false
    }, 300)
  })

  onMounted(() => {
    // 启动年度进度条动画
    const now = new Date()
    const start = new Date(now.getFullYear(), 0, 0)
    const diff = now - start
    const oneDay = 1000 * 60 * 60 * 24
    const day = Math.floor(diff / oneDay)
    const isLeap = (year) => new Date(year, 1, 29).getMonth() === 1
    const daysInYear = isLeap(now.getFullYear()) ? 366 : 365
    const targetVal = (day / daysInYear) * 100

    // 延迟启动动画，让页面先渲染
    setTimeout(() => {
      // 进度条宽度动画
      barWidth.value = targetVal

      // 数字跳动动画
      let startVal = 0
      const duration = 1500
      const startTime = performance.now()

      const animateNumber = (currentTime) => {
        const elapsed = currentTime - startTime
        const progress = Math.min(elapsed / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 4)
        const currentNum = startVal + (targetVal - startVal) * ease
        displayProgress.value = currentNum.toFixed(1)

        if (progress < 1) {
          requestAnimationFrame(animateNumber)
        }
      }

      requestAnimationFrame(animateNumber)
    }, 500)
  })
</script>

<style scoped>
  /* ========== 玻璃态基础样式 ========== */
  .glass-panel {
    background: #faf9f6;
    border: 1px solid #d4c5b0;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .glass-panel:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border-color: #c4b5a0;
  }

  /* ========== 年度进度条卡片样式 ========== */
  .stat-card {
    grid-column: 1 / -1;
    padding: 24px;
  }

  .stat-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .stat-title {
    font-size: 1rem;
    color: #666;
    font-weight: 500;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #2c3e50;
    display: inline-block;
    transition: transform 0.2s ease;
  }

  .stat-value.is-updating {
    animation: numberBounce 0.3s ease;
  }

  @keyframes numberBounce {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.3);
    }

    100% {
      transform: scale(1);
    }
  }

  .progress-bar {
    width: 100%;
    height: 8px;
    background: rgba(44, 62, 80, 0.1);
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 12px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #6c5ce7 0%, #a29bfe 100%);
    border-radius: 4px;
    transition: width 1.5s ease;
  }

  .stat-quote {
    font-size: 0.85rem;
    color: #999;
    margin: 0;
    font-style: italic;
  }

  /* ========== 进场动画 ========== */
  .delay-4 {
    animation: fadeInUp 0.6s ease 0.4s both;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ========== 响应式设计 ========== */
  @media (max-width: 768px) {
    .stat-card {
      grid-column: 1;
    }
  }

  /* 可访问性优化 */
  @media (prefers-reduced-motion: reduce) {
    .glass-panel {
      transition: none;
    }

    .glass-panel:hover {
      transform: none;
    }

    .stat-value {
      transition: none;
    }
  }
</style>

