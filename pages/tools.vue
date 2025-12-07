<template>
  <div class="tools-page">
    <div class="tools-container">
      <div class="tools-box">
        <!-- 页面标题 -->
        <PageHeader title="Tools" subtitle="Useful tools and utilities." />

        <!-- 内容区域 - 空白占位 -->
        <div class="tools-content">
          <!-- 这里将来可以添加工具内容 -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import PageHeader from '~/components/HeaderBar/PageHeader.vue'
</script>

<style scoped>
  .tools-page {
    min-height: 100vh;
    padding: 40px 20px 80px;
    background-color: transparent;
  }

  .tools-container {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .tools-box {
    background: rgba(255, 255, 255, 0.65);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 24px;
    padding: 60px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.05);
    width: 100%;
    box-sizing: border-box;
  }

  .tools-content {
    width: 100%;
    margin-top: 40px;
    /* 空白占位，后续可以添加内容 */
    min-height: 400px;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .tools-page {
      padding: 30px 10px 60px;
    }

    .tools-box {
      padding: 30px 20px;
    }

    .tools-content {
      margin-top: 30px;
      min-height: 300px;
    }
  }
</style>

