<template>
  <div class="app">
    <!-- 使用主页内容组件 -->
    <HomepageContent @download="handleDownload">
      <!-- 自定义社交媒体按钮 -->
      <template #social-buttons>
        <div style="text-align: center; padding: 20px;">
          <p style="color: #68525B;">在这里添加你的社交媒体按钮</p>
          <!-- 例如：Facebook Like 按钮 -->
          <!-- <div class="fb-like" data-href="your-page"></div> -->
        </div>
      </template>

      <!-- 自定义 Facebook 插件 -->
      <template #facebook-plugin>
        <div style="text-align: center; padding: 20px;">
          <p style="color: #68525B;">在这里添加你的 Facebook 插件</p>
          <!-- 例如：Facebook Like Box -->
          <!-- <div class="fb-like-box" data-href="your-page"></div> -->
        </div>
      </template>
    </HomepageContent>
  </div>
</template>

<script setup>
import HomepageContent from './index.vue'

// 处理下载按钮点击事件
const handleDownload = () => {
  console.log('下载按钮被点击')
  // 在这里添加你的下载逻辑
  // 例如：跳转到下载页面、触发下载等
  // window.location.href = 'your-download-url'
}
</script>

<style>
.app {
  width: 100%;
  min-width: 975px;
  max-width: 55%;
  margin: 0 auto;
  padding: 20px;
}
</style>

