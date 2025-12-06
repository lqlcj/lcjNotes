<template>
  <div class="comments-container">
    <div class="comments-header">
      <h3 class="comments-title">💬 留言板</h3>
      <p class="comments-subtitle">分享你的想法，让我们一起交流</p>
    </div>

    <!-- 留言表单 -->
    <div class="comment-form glass-card">
      <form @submit.prevent="submitMessage">
        <div class="form-row">
          <div class="form-group">
            <label>姓名 *</label>
            <input v-model="form.name" type="text" required placeholder="你的名字" />
          </div>
          <div class="form-group">
            <label>邮箱（可选）</label>
            <input v-model="form.email" type="email" placeholder="your@email.com" />
          </div>
        </div>
        <div class="form-group">
          <label>网站（可选）</label>
          <input v-model="form.website" type="url" placeholder="https://yourwebsite.com" />
        </div>
        <div class="form-group">
          <label>留言内容 *</label>
          <textarea 
            v-model="form.content" 
            rows="4" 
            required 
            placeholder="写下你想说的话..."
          ></textarea>
        </div>
        <button type="submit" class="submit-btn" :disabled="submitting">
          {{ submitting ? '提交中...' : '提交留言' }}
        </button>
        <p v-if="submitError" class="error-message">{{ submitError }}</p>
        <p v-if="submitSuccess" class="success-message">留言提交成功！</p>
      </form>
    </div>

    <!-- 留言列表 -->
    <div class="comments-list">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>加载留言中...</p>
      </div>
      <div v-else-if="messages.length === 0" class="empty-state">
        <p>还没有留言，快来成为第一个留言的人吧！</p>
      </div>
      <div v-else class="messages">
        <div 
          v-for="message in messages" 
          :key="message.id" 
          class="message-item glass-card"
        >
          <div class="message-header">
            <div class="message-author">
              <div class="message-avatar">
                {{ message.name.charAt(0).toUpperCase() }}
              </div>
              <div class="message-info">
                <h4>{{ message.name }}</h4>
                <span class="message-date">{{ formatDate(message.date) }}</span>
              </div>
            </div>
            <a v-if="message.website" :href="message.website" target="_blank" class="message-website-link">
              🔗
            </a>
          </div>
          <div class="message-content">
            {{ message.content }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const messages = ref([]);
const loading = ref(false);
const submitting = ref(false);
const submitError = ref('');
const submitSuccess = ref(false);

const form = ref({
  name: '',
  email: '',
  website: '',
  content: ''
});

// 加载留言列表
const loadMessages = async () => {
  loading.value = true;
  try {
    const response = await $fetch('/api/messages');
    if (response.success) {
      messages.value = response.data;
    }
  } catch (error) {
    console.error('加载留言失败:', error);
  } finally {
    loading.value = false;
  }
};

// 提交留言
const submitMessage = async () => {
  submitting.value = true;
  submitError.value = '';
  submitSuccess.value = false;
  
  try {
    const response = await $fetch('/api/messages', {
      method: 'POST',
      body: {
        name: form.value.name,
        email: form.value.email,
        website: form.value.website,
        content: form.value.content
      }
    });
    
    if (response.success) {
      submitSuccess.value = true;
      // 清空表单
      form.value = {
        name: '',
        email: '',
        website: '',
        content: ''
      };
      // 重新加载留言列表
      await loadMessages();
      // 3秒后隐藏成功提示
      setTimeout(() => {
        submitSuccess.value = false;
      }, 3000);
    }
  } catch (error) {
    submitError.value = error?.data?.message || '提交失败，请重试';
  } finally {
    submitting.value = false;
  }
};

// 格式化日期
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  loadMessages();
});
</script>

<style scoped>
.comments-container {
  margin-top: 0;
  padding: 0;
  background: #faf9f6;
  border: 1px solid #d4c5b0;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  width: 100%;
}

.comments-header {
  padding: 12px 20px 10px;
  text-align: center;
  border-bottom: 1px solid rgba(224, 195, 252, 0.2);
  background: linear-gradient(135deg,
      rgba(255, 221, 225, 0.05) 0%,
      rgba(224, 195, 252, 0.05) 100%);
}

.comments-title {
  font-family: 'Caveat', cursive;
  font-size: 1.5rem;
  margin: 0 0 3px 0;
  color: #6c5ce7;
  font-weight: 500;
  background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.comments-subtitle {
  font-size: 0.85rem;
  color: #999;
  margin: 0;
}

.glass-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.8);
  border-radius: 8px;
  padding: 20px;
  margin: 20px;
}

.comment-form {
  margin-bottom: 0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #555;
  font-size: 14px;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  font-family: inherit;
}

.form-group textarea {
  resize: vertical;
  min-height: 80px;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  color: #e74c3c;
  font-size: 14px;
  margin-top: 10px;
}

.success-message {
  color: #27ae60;
  font-size: 14px;
  margin-top: 10px;
}

.comments-list {
  padding: 20px;
  max-height: 600px;
  overflow-y: auto;
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 40px;
  color: #999;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  margin: 0 auto 15px;
  border: 4px solid rgba(162, 155, 254, 0.2);
  border-top-color: #6c5ce7;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.messages {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.message-item {
  padding: 15px;
  margin: 0;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: 12px;
}

.message-author {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  flex-shrink: 0;
}

.message-info h4 {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 15px;
}

.message-date {
  font-size: 12px;
  color: #999;
}

.message-content {
  color: #555;
  line-height: 1.6;
  word-break: break-word;
  white-space: pre-wrap;
}

.message-website-link {
  color: #6c5ce7;
  text-decoration: none;
  font-size: 18px;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.message-website-link:hover {
  opacity: 1;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .glass-card {
    margin: 15px;
    padding: 15px;
  }
  
  .comments-list {
    padding: 15px;
  }
}
</style>




