<template>
  <div class="post-page-bg">
    <div class="post-container">
      <div class="nav-bar">
        <button @click="goBack" class="back-btn">← 返回列表</button>
      </div>

      <div v-if="post" class="article-wrapper glass-card">

        <div class="article-content">
          <div v-if="coverSrc" class="cover-img">
            <img :src="coverSrc" alt="cover" />
          </div>

          <h1 class="main-title">{{ post.attributes.title }}</h1>

          <div class="meta-info">
            <span>{{ post.attributes.date }}</span>
            <span v-if="post.attributes.user"> · {{ post.attributes.user }}</span>
          </div>

          <hr class="separator" />

          <div class="markdown-body" v-html="htmlContent"></div>
        </div>

      </div>

      <div v-else-if="errorMessage" class="error-message glass-card">
        <p>❌ {{ errorMessage }}</p>
        <p style="margin-top: 10px; font-size: 0.9rem; color: #999;">3秒后自动返回列表...</p>
        <button @click="goBack" class="back-btn" style="margin-top: 15px;">立即返回</button>
      </div>
      
      <div v-else class="loading">
        <div class="spinner"></div>
        <p>文章加载中...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue';
  import { useNotesStore } from '~/stores/notesStore';
  // 使用 public 目录下的图片
  const defaultCover = '/images/loading.webp';
  // 保持依赖动态导入，解决 820KB bloat 问题
  import { default as MarkdownIt } from 'markdown-it';

  const route = useRoute();
  const notesStore = useNotesStore();

  const post = ref(null);
  const htmlContent = ref('');
  const coverSrc = computed(() => post.value?.attributes.cover || defaultCover);

  const errorMessage = ref('');

  onMounted(async () => {
    try {
      // 确保 store 已初始化（只加载元数据，不加载完整内容）
      if (!notesStore.isLoaded) {
        await notesStore.initPosts();
      }

      const postId = route.query.id ? String(route.query.id) : null;
      const filePath = route.query.path; // 兼容旧代码

      console.log('加载文章，postId:', postId, '类型:', typeof postId, 'filePath:', filePath);

      if (postId) {
        // 优先使用 ID 从 API 获取文章
        try {
          console.log('尝试从 API 加载文章:', `/api/posts/${postId}`);
          const response = await $fetch(`/api/posts/${postId}`);
          console.log('API 响应:', response);
          
          if (response && response.success && response.data) {
            const postData = response.data;
            // 初始化解析器
            const md = new MarkdownIt({
              html: true,
              linkify: true,
              typographer: true
            });
            
            // 转换为兼容格式
            post.value = {
              attributes: {
                title: postData.title,
                date: postData.date,
                cover: postData.cover,
                user: postData.user,
              },
              body: postData.body
            };
            htmlContent.value = md.render(postData.body);
            errorMessage.value = '';
            return;
          } else {
            console.warn('API 返回数据格式不正确:', response);
          }
        } catch (e) {
          console.error("从 API 加载文章失败:", e);
          // 不立即跳转，继续尝试其他方式
        }
      }

      // 兼容模式：使用 filePath（从本地文件或旧方式）
      if (filePath) {
        try {
          console.log('尝试从 filePath 加载文章:', filePath);
          const parsed = await notesStore.getPostByPath(filePath);
          if (parsed) {
            // 初始化解析器
            const md = new MarkdownIt({
              html: true,
              linkify: true,
              typographer: true
            });
            post.value = parsed;
            htmlContent.value = md.render(parsed.body);
            errorMessage.value = '';
            return;
          }
        } catch (e) {
          console.error("从 filePath 加载文章失败:", e);
        }
      }

      // 如果都失败了，显示错误信息而不是立即跳转
      errorMessage.value = '文章加载失败，请检查文章是否存在';
      console.error('文章加载失败，postId:', postId, 'filePath:', filePath);
      
      // 3秒后自动跳回主页
      setTimeout(() => {
        navigateTo('/home');
      }, 3000);
    } catch (e) {
      console.error("Post loading error:", e);
      errorMessage.value = '加载文章时发生错误: ' + (e.message || '未知错误');
      
      // 3秒后自动跳回主页
      setTimeout(() => {
        navigateTo('/home');
      }, 3000);
    }
  });

  const goBack = () => {
    // 返回主页，并传递文章ID用于定位
    const postId = route.query.id
    if (postId) {
      navigateTo({
        path: '/home',
        query: { scrollTo: postId }
      })
    } else {
      navigateTo('/home')
    }
  };
</script>

<style scoped>
  /* 样式保持不变 */
  @import 'github-markdown-css';

  .post-page-bg {
    background: linear-gradient(135deg, #FFDDE1 0%, #E0C3FC 100%);
    padding: 40px 20px;
    min-height: 100vh;
    display: flex;
    justify-content: center;
  }

  .post-container {
    max-width: 800px;
    width: 100%;
    margin: 0 auto;
    min-height: 80vh;
  }

  .nav-bar {
    margin-bottom: 20px;
  }

  .back-btn {
    border: none;
    background: none;
    font-size: 16px;
    cursor: pointer;
    color: #666;
    padding: 0;
    transition: color 0.2s;
  }

  .back-btn:hover {
    color: #6c5ce7;
  }

  .article-wrapper {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
    padding: 40px;
  }

  .article-content {
    opacity: 1;
    transition: opacity 0.5s;
  }

  .cover-img img {
    width: 100%;
    border-radius: 8px;
    margin-bottom: 30px;
    max-height: 400px;
    object-fit: cover;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }

  .main-title {
    font-size: 2rem;
    margin-bottom: 10px;
    color: #333;
    line-height: 1.3;
  }

  .meta-info {
    color: #999;
    font-size: 0.9rem;
    margin-bottom: 20px;
  }

  .separator {
    border: 0;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    margin: 20px 0;
  }

  .markdown-body {
    box-sizing: border-box;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.7;
  }

  .loading {
    text-align: center;
    padding: 80px;
    color: #6c5ce7;
  }

  .error-message {
    text-align: center;
    padding: 60px 40px;
    color: #e74c3c;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
  }

  .error-message p {
    margin: 0;
    font-size: 1.1rem;
    line-height: 1.6;
  }

  .spinner {
    border: 4px solid rgba(108, 92, 231, 0.1);
    border-top: 4px solid #6c5ce7;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
    margin: 0 auto 15px;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 767px) {
    .post-page-bg {
      padding: 15px 10px;
    }

    .article-wrapper {
      padding: 25px 20px;
    }

    .main-title {
      font-size: 1.6rem;
    }

    .markdown-body {
      font-size: 0.95rem;
    }
  }
</style>