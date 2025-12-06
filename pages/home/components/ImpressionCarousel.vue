<template>
  <div class="carousel-container" v-if="images.length > 0">
    <div class="carousel-wrapper" @mouseenter="pauseAutoPlay" @mouseleave="resumeAutoPlay">
      <!-- 轮播图片容器 -->
      <div class="carousel-track" :class="{ 'no-transition': skipTransition || isDragging }"
        :style="{ transform: `translateX(calc(-${currentIndex * 100}% + ${dragOffset}%))` }"
        @transitionend="handleTransitionEnd" @touchstart="handleTouchStart" @touchmove="handleTouchMove"
        @touchend="handleTouchEnd">
        <!-- 克隆最后一张到最前面（prepend） -->
        <div class="carousel-slide">
          <div class="image-wrapper">
            <img :src="images[images.length - 1]" :alt="`Slide ${images.length}`" class="carousel-image" />
            <div class="impression-overlay"></div>
          </div>
        </div>
        <!-- 真实图片 -->
        <div v-for="(image, index) in images" :key="`real-${index}`" class="carousel-slide"
          :class="{ 'active': index === realIndex }">
          <div class="image-wrapper">
            <img :src="image" :alt="`Slide ${index + 1}`" class="carousel-image" />
            <div class="impression-overlay"></div>
          </div>
        </div>
        <!-- 克隆第一张到最后面（append） -->
        <div class="carousel-slide">
          <div class="image-wrapper">
            <img :src="images[0]" :alt="`Slide 1`" class="carousel-image" />
            <div class="impression-overlay"></div>
          </div>
        </div>
      </div>

      <!-- 左右切换按钮 -->
      <button class="carousel-btn prev-btn" @click="prevSlide" aria-label="Previous slide">
        <span>‹</span>
      </button>
      <button class="carousel-btn next-btn" @click="nextSlide" aria-label="Next slide">
        <span>›</span>
      </button>

      <!-- 指示器 -->
      <div class="carousel-indicators">
        <button v-for="(image, index) in images" :key="`indicator-${index}`" class="indicator"
          :class="{ 'active': index === realIndex }" @click="goToSlide(index)"
          :aria-label="`Go to slide ${index + 1}`"></button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue'

  // 使用 public 目录下的图片，直接使用路径数组
  const images = computed(() => {
    // 轮播图文件名列表（按顺序）
    const imageFiles = ['01.webp', '02.webp', '03.webp']
    // 转换为 public 路径
    return imageFiles.map(file => `/images/carousel/${file}`)
  })

  // DOM结构：[图3(克隆), 图1(真实), 图2(真实), 图3(真实), 图1(克隆)]
  // 索引：   0           1          2          3          4
  // currentIndex: 0=克隆的最后一张, 1~length=真实图片, length+1=克隆的第一张
  const currentIndex = ref(1) // 初始位置：真实的第一张图（索引1），无动画
  const skipTransition = ref(false) // 是否跳过过渡动画（用于无缝跳转）
  let autoPlayTimer = null
  const autoPlayInterval = 4000 // 4秒切换一次

  // 触摸滑动相关
  const touchStartX = ref(0)
  const touchStartY = ref(0)
  const touchStartTime = ref(0)
  const isDragging = ref(false)
  const dragOffset = ref(0) // 当前拖拽偏移量（百分比）

  // 计算真实索引（用于指示器显示）
  const realIndex = computed(() => {
    if (currentIndex.value === 0) {
      return images.value.length - 1
    }
    if (currentIndex.value === images.value.length + 1) {
      return 0
    }
    return currentIndex.value - 1
  })

  // 处理过渡结束事件
  const handleTransitionEnd = () => {
    // "下一页"逻辑：从真实的最后一张图（索引length）滑动到克隆的第一张图（索引length+1）
    // 在 transitionend 事件后，立即执行无缝跳转
    if (currentIndex.value === images.value.length + 1) {
      // 1. 设置 transition: none; （取消过渡动画）
      skipTransition.value = true
      // 2. 将 translateX 瞬间"跳"回到真实的第一张图（索引1）
      currentIndex.value = 1
      // 3. 恢复 transition 属性（在下一帧）
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          skipTransition.value = false
        })
      })
    }
    // "上一页"逻辑：从真实的第一张图（索引1）滑动到克隆的最后一张图（索引0）
    // 在 transitionend 事件后，立即执行无缝跳转
    else if (currentIndex.value === 0) {
      // 1. 设置 transition: none; （取消过渡动画）
      skipTransition.value = true
      // 2. 将 translateX 瞬间"跳"回到真实的最后一张图（索引length）
      currentIndex.value = images.value.length
      // 3. 恢复 transition 属性（在下一帧）
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          skipTransition.value = false
        })
      })
    }
  }

  // 下一页
  const nextSlide = () => {
    if (!images.value || images.value.length === 0) return

    // 如果已经在真实的最后一张图（索引length），滑动到克隆的第一张图（索引length+1）
    if (currentIndex.value === images.value.length) {
      currentIndex.value = images.value.length + 1
    }
    // 正常递增
    else if (currentIndex.value >= 1 && currentIndex.value < images.value.length) {
      currentIndex.value++
    }
  }

  // 上一页
  const prevSlide = () => {
    if (!images.value || images.value.length === 0) return

    // 如果已经在真实的第一张图（索引1），滑动到克隆的最后一张图（索引0）
    if (currentIndex.value === 1) {
      currentIndex.value = 0
    }
    // 正常递减
    else if (currentIndex.value > 1 && currentIndex.value <= images.value.length) {
      currentIndex.value--
    }
  }

  // 跳转到指定幻灯片
  const goToSlide = (index) => {
    if (index < 0 || index >= images.value.length) return
    // 直接跳转到对应的真实图片索引（index + 1），无动画
    skipTransition.value = true
    currentIndex.value = index + 1
    // 下一帧恢复过渡动画
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        skipTransition.value = false
      })
    })
  }

  // 暂停自动播放
  const pauseAutoPlay = () => {
    if (autoPlayTimer) {
      clearInterval(autoPlayTimer)
      autoPlayTimer = null
    }
  }

  // 恢复自动播放
  const resumeAutoPlay = () => {
    startAutoPlay()
  }

  // 开始自动播放
  const startAutoPlay = () => {
    pauseAutoPlay()
    autoPlayTimer = setInterval(() => {
      nextSlide()
    }, autoPlayInterval)
  }

  // 触摸开始
  const handleTouchStart = (e) => {
    pauseAutoPlay() // 暂停自动播放
    touchStartX.value = e.touches[0].clientX
    touchStartY.value = e.touches[0].clientY
    touchStartTime.value = Date.now()
    isDragging.value = true
    dragOffset.value = 0
  }

  // 触摸移动
  const handleTouchMove = (e) => {
    if (!isDragging.value) return

    const touchX = e.touches[0].clientX
    const touchY = e.touches[0].clientY
    const deltaX = touchX - touchStartX.value
    const deltaY = touchY - touchStartY.value

    // 如果是垂直滑动，不处理（允许页面滚动）
    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return
    }

    // 阻止默认滚动行为
    e.preventDefault()

    // 计算拖拽偏移量（相对于轮播图宽度的百分比）
    const carouselWidth = e.currentTarget.offsetWidth
    dragOffset.value = (deltaX / carouselWidth) * 100
  }

  // 触摸结束
  const handleTouchEnd = (e) => {
    if (!isDragging.value) return

    const touchEndX = e.changedTouches[0].clientX
    const touchEndTime = Date.now()
    const deltaX = touchEndX - touchStartX.value
    const deltaTime = touchEndTime - touchStartTime.value
    const carouselWidth = e.currentTarget.offsetWidth
    const swipeDistance = Math.abs(deltaX)
    const swipeSpeed = swipeDistance / deltaTime // 像素/毫秒

    // 判断是否触发切换：滑动距离超过30%或滑动速度超过0.3像素/毫秒
    const threshold = carouselWidth * 0.3
    const speedThreshold = 0.3

    if (swipeDistance > threshold || swipeSpeed > speedThreshold) {
      if (deltaX > 0) {
        // 向右滑动，显示上一张
        prevSlide()
      } else {
        // 向左滑动，显示下一张
        nextSlide()
      }
    }

    // 重置状态
    isDragging.value = false
    dragOffset.value = 0
    resumeAutoPlay() // 恢复自动播放
  }

  onMounted(() => {
    // 初始位置：必须立即（没有动画）定位到真实的第一张图（索引1）
    skipTransition.value = true
    currentIndex.value = 1
    // 下一帧恢复过渡动画
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        skipTransition.value = false
        startAutoPlay()
      })
    })
  })

  onUnmounted(() => {
    pauseAutoPlay()
  })
</script>

<style scoped>
  .carousel-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    position: relative;
    z-index: 10;
  }

  .carousel-wrapper {
    position: relative;
    width: 100%;
    height: 500px;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  }

  .carousel-track {
    display: flex;
    height: 100%;
    /* 使用 CSS transition 实现动画 */
    transition: transform 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* 取消过渡动画（用于无缝跳转） */
  .carousel-track.no-transition {
    transition: none;
  }

  .carousel-slide {
    flex: 0 0 100%;
    min-width: 100%;
    height: 100%;
    position: relative;
  }

  .image-wrapper {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .carousel-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(0.5px) brightness(1.05) saturate(1.1);
    transition: filter 1.2s ease;
  }

  .carousel-slide.active .carousel-image {
    filter: blur(0.3px) brightness(1.08) saturate(1.15);
  }

  /* 印象派模糊层 */
  .impression-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 240, 245, 0.15) 25%,
        rgba(230, 230, 250, 0.15) 50%,
        rgba(240, 248, 255, 0.1) 75%,
        rgba(255, 255, 255, 0.1) 100%);
    pointer-events: none;
    mix-blend-mode: soft-light;
  }

  /* 切换按钮 */
  .carousel-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(10px);
    color: #2c3e50;
    font-size: 28px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease;
    z-index: 20;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  .carousel-btn:hover {
    background: rgba(255, 255, 255, 0.95);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }

  .carousel-btn:active {
    transform: translateY(-50%) scale(0.95);
  }

  .prev-btn {
    left: 20px;
  }

  .next-btn {
    right: 20px;
  }

  .carousel-btn span {
    line-height: 1;
    font-weight: 300;
  }

  /* 指示器 */
  .carousel-indicators {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 10px;
    z-index: 20;
  }

  .indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.8);
    background: transparent;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;
  }

  .indicator:hover {
    background: rgba(255, 255, 255, 0.5);
    transform: scale(1.2);
  }

  .indicator.active {
    background: rgba(255, 255, 255, 0.9);
    width: 30px;
    border-radius: 5px;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .carousel-wrapper {
      height: 350px;
      border-radius: 15px;
    }

    /* 移动端隐藏左右按钮 */
    .carousel-btn {
      display: none;
    }

    .carousel-indicators {
      bottom: 15px;
      gap: 8px;
    }

    .indicator {
      width: 8px;
      height: 8px;
    }

    .indicator.active {
      width: 24px;
    }

    /* 触摸滑动时禁用过渡动画 */
    .carousel-track {
      touch-action: pan-y;
      /* 允许垂直滚动，但处理水平滑动 */
    }
  }

  /* 可访问性优化 */
  @media (prefers-reduced-motion: reduce) {
    .carousel-track {
      transition: transform 0.3s ease;
    }

    .carousel-image {
      transition: filter 0.3s ease;
    }
  }

  /* 印象派风格：添加柔和的边框光晕 */
  .carousel-wrapper::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg,
        rgba(255, 182, 193, 0.3),
        rgba(221, 160, 221, 0.3),
        rgba(176, 224, 230, 0.3),
        rgba(255, 182, 193, 0.3));
    border-radius: 22px;
    z-index: -1;
    opacity: 0.6;
    filter: blur(8px);
  }
</style>
