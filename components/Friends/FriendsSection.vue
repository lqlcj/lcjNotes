<!--
  友链交换组件
  
  功能说明：
  1. 展示已审核通过的友链列表
  2. 提供友链申请表单
  
  使用说明：
  ==========
  
  1. 友链数据管理：
     - 友链数据存储在：src/data/friends.json
     - 格式：
       [
         {
           "name": "网站名称",
           "url": "https://example.com",
           "description": "网站描述",
           "avatar": "头像URL（可选）",
           "date": "2025-01-01"
         }
       ]
  
  2. 审核友链申请：
     - 访客提交申请后，会在 GitHub Issues 中创建一条记录
     - 访问你的 GitHub 仓库：https://github.com/lqlcj/vueblog/issues
     - 找到友链申请 Issue，审核通过后：
       a. 将友链信息添加到 src/data/friends.json
       b. 关闭对应的 Issue
  
  3. GitHub Issues 配置（可选）：
     - 如果使用 API 方式（需要 Token）：
       a. 访问 https://github.com/settings/tokens
       b. 创建 Personal Access Token（需要 public_repo 权限）
       c. 在项目根目录创建 .env 文件：
          VITE_GITHUB_TOKEN=your_token_here
       d. 注意：.env 文件不要提交到 Git！
     - 如果使用跳转链接方式（推荐，无需配置）：
       - 直接使用，无需任何配置
  
  4. 自定义配置：
     - 修改仓库名：在 src/utils/githubApi.js 中修改 repo 参数
     - 默认值：'lqlcj/vueblog'
-->

<template>
  <div class="friends-section">
    <!-- 标题 -->
    <div class="section-header">
      <h2 class="section-title">🤝 Friends & Partners</h2>
      <p class="section-subtitle">A curated collection of inspiring creators we support.</p>

      <!-- 申请友链按钮 -->
      <OutlineButton @click="toggleForm" icon="+">
        申请友链
      </OutlineButton>
    </div>

    <!-- 友链列表 -->
    <FriendsList />

    <!-- 申请表单 -->
    <FriendRequestForm :is-expanded="isFormExpanded" @close="toggleForm" />
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import FriendsList from './FriendsList.vue'
  import FriendRequestForm from './FriendRequestForm.vue'
  import OutlineButton from '~/components/Common/OutlineButton.vue'

  const isFormExpanded = ref(false)

  const toggleForm = () => {
    isFormExpanded.value = !isFormExpanded.value
  }
</script>

<style scoped>
  .friends-section {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .section-header {
    text-align: center;
  }

  .section-title {
    font-family: 'Caveat', cursive;
    font-size: 1.8rem;
    color: #2c3e50;
    margin: 0 0 4px 0;
    font-weight: 400;
  }

  .section-subtitle {
    font-size: 0.85rem;
    color: #666;
    margin: 0 0 16px 0;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .friends-section {
      gap: 20px;
    }

    .section-title {
      font-size: 1.5rem;
    }

    .section-subtitle {
      font-size: 0.8rem;
    }
  }
</style>
