<template>
  <div class="banner-wrapper">
    <div class="banner-content">
      <img :src="logoImage" alt="Logo" class="banner-logo" />
    </div>
  </div>
</template>

<script setup>
  // 使用 public 目录下的图片
  const logoImage = '/images/Logo2.webp'
</script>

<style scoped>
  .banner-wrapper {
    z-index: 20;
    width: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fadeInUp 0.8s ease-out;
    will-change: transform, opacity;
    background: transparent;
  }

  @keyframes fadeInUp {
    from {
      transform: translate3d(0, 30px, 0);
      opacity: 0;
    }

    to {
      transform: translate3d(0, 0, 0);
      opacity: 1;
    }
  }

  .banner-content {
    background: transparent;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .banner-logo {
    display: block;
  }

  @media (max-width: 768px) {
    .banner-wrapper {
      width: 80%;
      padding: 20px 15px;
    }
  }

  @media (max-width: 480px) {
    .banner-wrapper {
      width: 90%;
      padding: 15px 10px;
    }
  }

  /* 🚀 可访问性优化：支持减少动画偏好 */
  @media (prefers-reduced-motion: reduce) {
    .banner-wrapper {
      animation: none;
    }
  }
</style>