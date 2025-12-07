<!--
  留言项组件 (MessageItem)
  
  功能：
    - 递归渲染留言和回复
    - 支持回复功能
    - 显示回复表单
-->
<template>
  <div class="message-item-wrapper" :class="{ 'is-reply': isReply }">
    <div class="message-item glass-card">
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
      <div class="message-actions">
        <button @click="toggleReplyForm" class="reply-btn">
          {{ showReplyForm ? '取消回复' : '回复' }}
        </button>
      </div>

      <!-- 回复表单 -->
      <div v-if="showReplyForm" class="reply-form">
        <form @submit.prevent="submitReply">
          <div class="form-row">
            <div class="form-group">
              <label>姓名 *</label>
              <input v-model="replyForm.name" type="text" required placeholder="你的名字" />
            </div>
            <div class="form-group">
              <label>邮箱（可选）</label>
              <input v-model="replyForm.email" type="email" placeholder="your@email.com" />
            </div>
          </div>
          <div class="form-group">
            <label>网站（可选）</label>
            <input v-model="replyForm.website" type="url" placeholder="https://yourwebsite.com" />
          </div>
          <div class="form-group">
            <label>回复内容 *</label>
            <textarea v-model="replyForm.content" rows="3" required placeholder="写下你的回复..."></textarea>
          </div>
          <div class="form-group">
            <div :ref="el => turnstileContainer = el" class="turnstile-container"></div>
          </div>
          <button type="submit" class="submit-btn" :disabled="submitting || !replyTurnstileToken">
            {{ submitting ? '提交中...' : '提交回复' }}
          </button>
          <p v-if="submitError" class="error-message">{{ submitError }}</p>
        </form>
      </div>
    </div>

    <!-- 递归渲染回复 -->
    <div v-if="message.replies && message.replies.length > 0" class="replies-container">
      <MessageItem
        v-for="reply in message.replies"
        :key="reply.id"
        :message="reply"
        :is-reply="true"
        :turnstile-site-key="turnstileSiteKey"
        @reload="$emit('reload')"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue';

const props = defineProps({
  message: {
    type: Object,
    required: true
  },
  isReply: {
    type: Boolean,
    default: false
  },
  turnstileSiteKey: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['reload']);

const showReplyForm = ref(false);
const submitting = ref(false);
const submitError = ref('');
const replyTurnstileToken = ref('');
const turnstileContainer = ref(null);
let turnstileWidgetId = null;

const replyForm = ref({
  name: '',
  email: '',
  website: '',
  content: ''
});

// 全局标记，确保脚本只加载一次
let turnstileScriptLoaded = false;
let turnstileScriptLoading = false;

const toggleReplyForm = () => {
  showReplyForm.value = !showReplyForm.value;
  if (showReplyForm.value) {
    nextTick(() => {
      loadTurnstile();
    });
  } else {
    resetTurnstile();
  }
};

const loadTurnstile = () => {
  if (!props.turnstileSiteKey) {
    replyTurnstileToken.value = 'skip';
    return;
  }

  // 如果脚本已加载，直接渲染
  if (window.turnstile) {
    nextTick(() => {
      renderTurnstile();
    });
    return;
  }

  // 如果脚本正在加载，等待加载完成
  if (turnstileScriptLoading) {
    const checkInterval = setInterval(() => {
      if (window.turnstile) {
        clearInterval(checkInterval);
        nextTick(() => {
          renderTurnstile();
        });
      }
    }, 100);
    return;
  }

  // 加载脚本
  if (!turnstileScriptLoaded && !document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]')) {
    turnstileScriptLoading = true;
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      turnstileScriptLoaded = true;
      turnstileScriptLoading = false;
      nextTick(() => {
        renderTurnstile();
      });
    };
    script.onerror = () => {
      turnstileScriptLoading = false;
    };
    document.head.appendChild(script);
  }
};

const renderTurnstile = () => {
  if (!window.turnstile || !props.turnstileSiteKey || !turnstileContainer.value) {
    return;
  }

  // 确保清理旧的 widget
  if (turnstileWidgetId !== null) {
    try {
      if (window.turnstile && typeof window.turnstile.remove === 'function') {
        window.turnstile.remove(turnstileWidgetId);
      }
    } catch (e) {
      console.warn('清理 Turnstile widget 失败:', e);
    }
    turnstileWidgetId = null;
  }

  // 确保容器是空的
  if (turnstileContainer.value) {
    turnstileContainer.value.innerHTML = '';
  }

  try {
    turnstileWidgetId = window.turnstile.render(turnstileContainer.value, {
      sitekey: props.turnstileSiteKey,
      callback: (token) => {
        replyTurnstileToken.value = token;
      },
      'error-callback': () => {
        replyTurnstileToken.value = '';
        submitError.value = '验证失败，请重试';
      },
      'expired-callback': () => {
        replyTurnstileToken.value = '';
      },
      theme: 'light',
      size: 'normal'
    });
  } catch (e) {
    console.error('渲染 Turnstile widget 失败:', e);
    turnstileWidgetId = null;
  }
};

const resetTurnstile = () => {
  if (turnstileWidgetId !== null && window.turnstile) {
    try {
      if (typeof window.turnstile.remove === 'function') {
        window.turnstile.remove(turnstileWidgetId);
      }
    } catch (e) {
      console.warn('清理 Turnstile widget 失败:', e);
    }
    turnstileWidgetId = null;
  }
  replyTurnstileToken.value = '';
  
  // 清空容器
  if (turnstileContainer.value) {
    turnstileContainer.value.innerHTML = '';
  }
};

const submitReply = async () => {
  if (props.turnstileSiteKey && !replyTurnstileToken.value) {
    submitError.value = '请完成人机验证';
    return;
  }

  submitting.value = true;
  submitError.value = '';

  try {
    const response = await $fetch('/api/messages', {
      method: 'POST',
      body: {
        name: replyForm.value.name,
        email: replyForm.value.email,
        website: replyForm.value.website,
        content: replyForm.value.content,
        parentId: props.message.id,
        turnstileToken: replyTurnstileToken.value
      }
    });

    if (response.success) {
      // 清空表单
      replyForm.value = {
        name: '',
        email: '',
        website: '',
        content: ''
      };
      resetTurnstile();
      showReplyForm.value = false;
      // 触发父组件重新加载
      emit('reload');
    }
  } catch (error) {
    submitError.value = error?.data?.message || '提交失败，请重试';
    if (error?.data?.message?.includes('验证')) {
      resetTurnstile();
    }
  } finally {
    submitting.value = false;
  }
};

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

// 监听回复表单的显示状态，确保清理
watch(showReplyForm, (newVal) => {
  if (!newVal) {
    // 表单关闭时清理
    resetTurnstile();
  }
});

onUnmounted(() => {
  resetTurnstile();
});
</script>

<style scoped>
.message-item-wrapper {
  margin-bottom: 15px;
  max-width: 100%;
  overflow: hidden;
}

.message-item-wrapper.is-reply {
  margin-left: 30px;
  margin-top: 15px;
  border-left: 2px solid rgba(104, 68, 77, 0.2);
  padding-left: 15px;
  max-width: calc(100% - 30px);
}

.message-item {
  padding: 15px;
  margin: 0;
  transition: all 0.3s ease-in-out;
  cursor: default;
  max-width: 100%;
  box-sizing: border-box;
  overflow-wrap: break-word;
  word-wrap: break-word;
}

.message-item:hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 16px rgba(104, 68, 77, 0.15),
    0 3px 8px rgba(255, 165, 0, 0.08);
  border-color: rgba(104, 68, 77, 0.3);
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
  background: #68444d;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.message-item:hover .message-avatar {
  transform: scale(1.1);
  background: linear-gradient(135deg, #68444d 0%, #8b5a6b 100%);
  box-shadow:
    0 2px 8px rgba(104, 68, 77, 0.3),
    0 1px 4px rgba(255, 165, 0, 0.1);
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
  overflow-wrap: break-word;
  white-space: pre-wrap;
  margin-bottom: 12px;
  max-width: 100%;
  overflow: hidden;
}

.message-website-link {
  color: #68444d;
  text-decoration: none;
  font-size: 18px;
  opacity: 0.7;
  transition: all 0.3s ease-in-out;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(104, 68, 77, 0.08);
}

.message-website-link:hover {
  opacity: 1;
  transform: scale(1.15) rotate(15deg);
  background: rgba(104, 68, 77, 0.2);
  box-shadow: 0 2px 6px rgba(104, 68, 77, 0.2);
}

.message-actions {
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(104, 68, 77, 0.1);
  display: flex;
  justify-content: flex-end;
}

.reply-btn {
  background: rgba(104, 68, 77, 0.1);
  color: #68444d;
  border: 1px solid rgba(104, 68, 77, 0.2);
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
}

.reply-btn:hover {
  background: rgba(104, 68, 77, 0.2);
  border-color: rgba(104, 68, 77, 0.3);
  transform: translateY(-1px);
}

.reply-form {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid rgba(104, 68, 77, 0.1);
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
  border: 1px solid rgba(104, 68, 77, 0.2);
  border-radius: 8px;
  font-size: 14px;
  box-sizing: border-box;
  font-family: inherit;
  background: rgba(252, 251, 249, 0.8);
  color: #68444d;
  transition: all 0.3s ease-in-out;
}

.form-group input:hover,
.form-group textarea:hover {
  border-color: rgba(104, 68, 77, 0.3);
  box-shadow: 0 0 0 3px rgba(104, 68, 77, 0.05);
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: rgba(104, 68, 77, 0.4);
  box-shadow:
    0 0 0 3px rgba(104, 68, 77, 0.1),
    0 2px 8px rgba(255, 165, 0, 0.05);
}

.form-group textarea {
  resize: vertical;
  min-height: 60px;
}

.submit-btn {
  width: 100%;
  padding: 10px;
  background: #68444d;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  font-weight: 500;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow:
    0 4px 12px rgba(104, 68, 77, 0.3),
    0 2px 6px rgba(255, 165, 0, 0.15);
  background: #5a3a42;
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

.turnstile-container {
  display: flex;
  justify-content: center;
  margin: 15px 0;
}

.replies-container {
  margin-top: 15px;
}

.glass-card {
  background: rgba(252, 251, 249, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(104, 68, 77, 0.15);
  border-radius: 12px;
  box-shadow:
    0 4px 16px rgba(255, 165, 0, 0.06),
    0 2px 8px rgba(255, 200, 150, 0.1);
}

@media (max-width: 768px) {
  .message-item-wrapper.is-reply {
    margin-left: 15px;
    padding-left: 10px;
    max-width: calc(100% - 15px);
  }

  .message-item {
    padding: 12px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .message-item-wrapper {
    min-width: 0;
  }

  .message-header {
    flex-wrap: wrap;
    gap: 8px;
  }

  .message-author {
    min-width: 0;
    flex: 1 1 auto;
  }

  .message-info {
    min-width: 0;
    overflow: hidden;
  }

  .message-info h4 {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>

