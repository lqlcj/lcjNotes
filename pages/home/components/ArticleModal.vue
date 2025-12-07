<!--
  文章阅读模态框组件
  
  功能：
    - 在模态框中显示文章详情
    - Markdown 内容渲染
    - 文章封面、标题、元信息显示
    - 加载状态和错误处理
  
  特性：
    - Teleport 到 body
    - 毛玻璃效果
    - 响应式设计
    - 代码块和表格横向滚动处理
-->
<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="handleClose">
        <div class="modal-container" @click.stop>
          <button class="close-btn" @click="handleClose">×</button>
          
          <div v-if="loading" class="loading">
            <div class="spinner"></div>
            <p>文章加载中...</p>
          </div>

          <div v-else-if="errorMessage" class="error-message">
            <p>❌ {{ errorMessage }}</p>
            <button @click="handleClose" class="back-btn">关闭</button>
          </div>

          <div v-else-if="post" class="article-wrapper">
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
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useNotesStore } from '~/stores/notesStore'
// 使用 public 目录下的图片
const defaultCover = '/images/loading.webp'
// 保持依赖动态导入，解决 820KB bloat 问题
import { createSafeMarkdownIt } from '~/utils/markdown'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  articleId: {
    type: String,
    default: null
  }
})

const emit = defineEmits(['close'])

const notesStore = useNotesStore()
const post = ref(null)
const htmlContent = ref('')
const loading = ref(false)
const errorMessage = ref('')

const coverSrc = computed(() => post.value?.attributes.cover || defaultCover)

// 监听 visible 和 articleId 变化，加载文章
watch([() => props.visible, () => props.articleId], async ([newVisible, newId]) => {
  if (newVisible && newId) {
    await loadArticle(newId)
  } else if (!newVisible) {
    // 关闭时清理数据
    post.value = null
    htmlContent.value = ''
    errorMessage.value = ''
  }
}, { immediate: true })

const loadArticle = async (postId) => {
  loading.value = true
  errorMessage.value = ''
  post.value = null
  htmlContent.value = ''

  try {
    // 确保 store 已初始化
    if (!notesStore.isLoaded) {
      await notesStore.initPosts()
    }

    // 从 API 获取文章
    try {
      const response = await $fetch(`/api/posts/${postId}`)
      
      if (response && response.success && response.data) {
        const postData = response.data
        // 初始化安全的解析器
        const md = createSafeMarkdownIt()
        
        // 转换为兼容格式
        post.value = {
          attributes: {
            title: postData.title,
            date: postData.date,
            cover: postData.cover,
            user: postData.user,
          },
          body: postData.body
        }
        htmlContent.value = md.render(postData.body)
        errorMessage.value = ''
      } else {
        errorMessage.value = '文章加载失败，请检查文章是否存在'
      }
    } catch (e) {
      console.error("从 API 加载文章失败:", e)
      errorMessage.value = '加载文章时发生错误: ' + (e.message || '未知错误')
    }
  } catch (e) {
    console.error("加载文章错误:", e)
    errorMessage.value = '加载文章时发生错误: ' + (e.message || '未知错误')
  } finally {
    loading.value = false
  }
}

const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
@import 'github-markdown-css';

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  overflow-y: auto;
}

.modal-container {
  position: relative;
  max-width: 1000px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  margin: auto;
}

.close-btn {
  position: sticky;
  top: 10px;
  right: 10px;
  float: right;
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  font-size: 28px;
  line-height: 1;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  z-index: 10;
  margin: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.close-btn:hover {
  background: #fff;
  color: #e74c3c;
  transform: scale(1.1);
}

.article-wrapper {
  padding: 40px 30px;
  padding-top: 20px;
  overflow-x: hidden;
  max-width: 100%;
  width: 100%;
  margin: 0 auto;
}

.article-content {
  opacity: 1;
  transition: opacity 0.5s;
  max-width: 100%;
  margin: 0 auto;
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
  overflow-x: hidden;
  word-wrap: break-word;
  word-break: break-word;
  max-width: 100%;
  margin: 0 auto;
}

/* 防止代码块和表格导致横向滚动 */
.markdown-body pre,
.markdown-body code {
  max-width: 100%;
  overflow-x: auto;
  word-wrap: normal;
  word-break: normal;
}

.markdown-body pre {
  white-space: pre;
}

.markdown-body table {
  max-width: 100%;
  overflow-x: auto;
  display: block;
  white-space: nowrap;
}

.markdown-body img {
  max-width: 100%;
  height: auto;
}

.loading {
  text-align: center;
  padding: 80px 40px;
  color: #6c5ce7;
}

.error-message {
  text-align: center;
  padding: 60px 40px;
  color: #e74c3c;
}

.error-message p {
  margin: 0 0 20px 0;
  font-size: 1.1rem;
  line-height: 1.6;
}

.back-btn {
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.9);
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
}

.back-btn:hover {
  background: #fff;
  color: #6c5ce7;
  border-color: #6c5ce7;
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

/* Modal 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(-20px);
  opacity: 0;
}

@media (max-width: 767px) {
  .modal-overlay {
    padding: 10px;
  }

  .modal-container {
    max-height: 95vh;
    border-radius: 12px;
  }

  .article-wrapper {
    padding: 25px 20px;
    padding-top: 15px;
  }

  .main-title {
    font-size: 1.6rem;
  }

  .markdown-body {
    font-size: 0.95rem;
  }

  .close-btn {
    width: 36px;
    height: 36px;
    font-size: 24px;
    margin: 8px;
  }
}
</style>

