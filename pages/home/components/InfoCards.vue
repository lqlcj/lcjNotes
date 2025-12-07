<template>
  <div class="info-cards-container">
    <div v-for="(card, index) in cards" :key="index" class="info-card"
      :style="{ backgroundImage: `url(${card.backgroundImage})` }" @click="handleCardClick(card)">
      <!-- 背景遮罩 -->
      <div class="card-overlay"></div>

      <!-- 装饰性背景元素 -->
      <div class="card-background">
        <div class="decorative-items">
          <!-- 根据卡片类型显示不同的装饰元素 -->
          <template v-if="card.type === 'about'">
            <div class="deco-item notebook"></div>
            <div class="deco-item sunglasses"></div>
            <div class="deco-item binder-clip"></div>
          </template>
          <template v-else-if="card.type === 'bilibili'">
            <div class="deco-item stapler"></div>
            <div class="deco-item glasses"></div>
            <div class="deco-item tape"></div>
            <div class="deco-item notebook-black"></div>
          </template>
          <template v-else-if="card.type === 'github'">
            <div class="deco-item cup"></div>
            <div class="deco-item planner"></div>
            <div class="deco-item watch"></div>
            <div class="deco-item pen"></div>
          </template>
        </div>
      </div>

      <!-- 中央文字框 -->
      <div class="text-overlay">
        <h3 class="card-title">{{ card.title }}</h3>
        <p v-if="card.description" class="card-description">{{ card.description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { layoutConfig } from '~/config/layout'

  const cards = [
    {
      type: 'about',
      title: 'About Us',
      description: '关于我',
      link: '/about',
      backgroundImage: 'https://file.nbfox.com/wp-content/uploads/2020/11/28/SbGo04.jpg@water750.jpg'
    },
    {
      type: 'bilibili',
      title: 'Bilibili',
      description: '视频平台',
      link: 'https://www.bilibili.com',
      external: true,
      backgroundImage: '/images/02.webp'
    },
    {
      type: 'github',
      title: 'Gitee',
      description: '代码仓库',
      link: 'https://gitee.com',
      external: true,
      backgroundImage: '/images/03.webp'
    }
  ]

  const handleCardClick = (card) => {
    if (card.external) {
      window.open(card.link, '_blank', 'noopener,noreferrer')
    } else {
      navigateTo(card.link)
    }
  }
</script>

<style scoped>
  .info-cards-container {
    display: flex;
    flex-direction: row;
    gap: 24px;
    width: 100%;
    padding: 0 15px;
  }

  .info-card {
    position: relative;
    flex: 1;
    min-width: 0;
    height: 240px;
    background: #faf9f6;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border: 1px solid #d4c5b0;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(250, 249, 246, 0.85);
    z-index: 1;
    transition: background 0.3s ease;
  }

  .info-card:hover .card-overlay {
    background: rgba(250, 249, 246, 0.75);
  }

  .info-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border-color: #c4b5a0;
  }

  .card-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2;
  }

  .decorative-items {
    position: relative;
    width: 100%;
    height: 100%;
  }

  .deco-item {
    position: absolute;
    background: #fff;
    border-radius: 4px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  /* About Us 卡片装饰 */
  .notebook {
    width: 80px;
    height: 100px;
    bottom: 20px;
    right: 30px;
    background: #fff;
    border: 1px solid #e0e0e0;
  }

  .notebook::before {
    content: '';
    position: absolute;
    left: 8px;
    top: 0;
    width: 4px;
    height: 100%;
    background: #f0f0f0;
  }

  .sunglasses {
    width: 60px;
    height: 20px;
    top: 20px;
    right: 40px;
    background: #2c2c2c;
    border-radius: 20px;
  }

  .sunglasses::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    height: 16px;
    background: #1a1a1a;
    border-radius: 16px;
  }

  .binder-clip {
    width: 20px;
    height: 30px;
    top: 15px;
    left: 25px;
    background: #d4af37;
    clip-path: polygon(0 0, 100% 0, 85% 100%, 15% 100%);
  }

  /* Bilibili 卡片装饰 */
  .stapler {
    width: 50px;
    height: 20px;
    bottom: 30px;
    left: 25px;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 4px;
  }

  .notebook-black {
    width: 70px;
    height: 90px;
    bottom: 20px;
    left: 20px;
    background: #2c2c2c;
    border: 1px solid #1a1a1a;
  }

  .notebook-black::before {
    content: '';
    position: absolute;
    left: 6px;
    top: 0;
    width: 3px;
    height: 100%;
    background: #1a1a1a;
  }

  .glasses {
    width: 80px;
    height: 25px;
    top: 25px;
    left: 30px;
    background: #8b4513;
    border-radius: 25px;
    opacity: 0.8;
  }

  .glasses::before,
  .glasses::after {
    content: '';
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 30px;
    height: 20px;
    background: #654321;
    border-radius: 20px;
  }

  .glasses::before {
    left: 5px;
  }

  .glasses::after {
    right: 5px;
  }

  .tape {
    width: 40px;
    height: 40px;
    top: 20px;
    right: 30px;
    background: #fff;
    border: 2px solid #e0e0e0;
    border-radius: 50%;
  }

  /* Github/Gitee 卡片装饰 */
  .cup {
    width: 50px;
    height: 60px;
    top: 20px;
    left: 25px;
    background: #fff;
    border: 2px solid #e0e0e0;
    border-radius: 0 0 8px 8px;
  }

  .cup::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
    height: 8px;
    background: #fff;
    border: 2px solid #e0e0e0;
    border-radius: 8px 8px 0 0;
  }

  .planner {
    width: 120px;
    height: 140px;
    bottom: 15px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    border: 1px solid #e0e0e0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  .planner::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 30px;
    background: #f5f5f5;
    border-bottom: 1px solid #e0e0e0;
  }

  .watch {
    width: 35px;
    height: 35px;
    top: 50px;
    left: 50%;
    transform: translateX(-50%);
    background: #fff;
    border: 2px solid #d4af37;
    border-radius: 50%;
  }

  .watch::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 2px;
    height: 12px;
    background: #333;
    transform-origin: bottom center;
    transform: translate(-50%, -100%) rotate(45deg);
  }

  .pen {
    width: 4px;
    height: 80px;
    top: 30px;
    right: 30px;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 2px;
  }

  .pen::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 6px;
    height: 8px;
    background: #333;
    border-radius: 2px 2px 0 0;
  }

  .text-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: rgba(255, 255, 255, 0.95);
    padding: 16px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    text-align: center;
    z-index: 10;
    min-width: 140px;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
  }

  .info-card:hover .text-overlay {
    background: #fff;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    transform: translate(-50%, -50%) scale(1.05);
  }

  .card-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 4px 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .card-description {
    font-size: 0.85rem;
    color: #666;
    margin: 0;
    font-weight: 400;
  }

  /* 移动端适配 */
  @media (max-width: 768px) {
    .info-cards-container {
      flex-direction: column;
      max-width: 100%;
      gap: 20px;
      padding: 0 15px;
    }

    .info-card {
      width: 100%;
      height: 180px;
      flex: none;
    }

    .card-title {
      font-size: 1.3rem;
    }

    .card-description {
      font-size: 0.8rem;
    }

    .card-background {
      padding: 15px;
    }

    /* 移动端装饰元素缩小 */
    .notebook {
      width: 60px;
      height: 75px;
    }

    .planner {
      width: 90px;
      height: 105px;
    }
  }

  /* 中等屏幕适配 */
  @media (min-width: 769px) and (max-width: 1024px) {
    .info-card {
      height: 220px;
    }
  }

  /* 可访问性优化 */
  @media (prefers-reduced-motion: reduce) {
    .info-card {
      transition: none;
    }

    .info-card:hover {
      transform: none;
    }

    .text-overlay {
      transition: none;
    }

    .info-card:hover .text-overlay {
      transform: translate(-50%, -50%);
    }
  }
</style>
