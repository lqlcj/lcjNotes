<!--
  留言板组件 (Guestbook)
  
  功能：
    - 可折叠的留言板界面
    - 留言提交表单（支持姓名、邮箱、网站、内容）
    - 留言列表展示
    - Cloudflare Turnstile 人机验证
    - 展开时触发烟花效果
  
  特性：
    - 展开/收起动画
    - 表单验证
    - 错误处理和成功提示
    - 响应式设计
-->
<template>
  <div class="comments-container">
    <!-- 标题栏（可点击展开/收起） -->
    <div class="comments-header" @click="toggleExpanded">
      <div class="header-left">
        <h3 class="comments-title">💬 留言板</h3>
        <p class="comments-subtitle">留下你的脚印~</p>
      </div>
      <button class="toggle-btn" @click.stop="toggleExpanded">
        <span class="toggle-icon" :class="{ expanded: isExpanded }">▼</span>
      </button>
    </div>

    <!-- 可折叠的内容区域 -->
    <div class="comments-content" :class="{ expanded: isExpanded }">
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
            <textarea v-model="form.content" rows="4" required placeholder="写下你想说的话..."></textarea>
          </div>

          <!-- Turnstile 验证 -->
          <div class="form-group">
            <div ref="turnstileContainer" class="turnstile-container"></div>
          </div>

          <button type="submit" class="submit-btn" :disabled="submitting || !turnstileToken">
            {{ submitting ? '提交中...' : '提交留言' }}
          </button>
          <p v-if="submitError" class="error-message">{{ submitError }}</p>
          <p v-if="submitSuccess" class="success-message">留言提交成功！</p>
        </form>
      </div>

      <!-- 留言列表 -->
      <div class="comments-list">
        <LoadingMessage v-if="loading" text="飘洋过海来看你~" />
        <div v-else-if="messages.length === 0" class="empty-state">
          <p>还没有留言，快来成为第一个留言的人吧！</p>
        </div>
        <div v-else class="messages">
          <MessageItem
            v-for="message in messages"
            :key="message.id"
            :message="message"
            :turnstile-site-key="turnstileSiteKey"
            @reload="loadMessages"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted, watch } from 'vue';
  import { useConfetti } from '~/composables/useConfetti';
  import LoadingMessage from '~/components/Common/LoadingMessage.vue';
  import MessageItem from '~/components/Comments/MessageItem.vue';

  // 展开/收起状态
  const isExpanded = ref(false);

  // 烟花效果
  const { birthday } = useConfetti();

  // 切换展开/收起
  const toggleExpanded = () => {
    const wasExpanded = isExpanded.value;
    isExpanded.value = !isExpanded.value;

    // 如果是从关闭状态变为打开状态，触发烟花效果
    if (!wasExpanded && isExpanded.value) {
      // 延迟一点触发，让展开动画先开始
      setTimeout(() => {
        birthday();
      }, 200);
    }

    // 如果展开，延迟加载 Turnstile（确保 DOM 已渲染）
    if (isExpanded.value) {
      setTimeout(() => {
        loadTurnstile();
      }, 100);
    }
  };

  const config = useRuntimeConfig();
  const turnstileSiteKey = config.public.turnstileSiteKey;

  const messages = ref([]);
  const loading = ref(false);
  const submitting = ref(false);
  const submitError = ref('');
  const submitSuccess = ref(false);
  const turnstileContainer = ref(null);
  const turnstileToken = ref('');
  let turnstileWidgetId = null;

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

  // 加载 Turnstile
  const loadTurnstile = () => {
    if (!turnstileSiteKey) {
      console.warn('Turnstile Site Key 未配置，跳过验证');
      turnstileToken.value = 'skip'; // 允许跳过验证（开发环境）
      return;
    }

    // 如果脚本已加载，直接渲染
    if (window.turnstile) {
      nextTick(() => {
        renderTurnstile();
      });
      return;
    }

    // 检查脚本是否已经存在
    if (document.querySelector('script[src="https://challenges.cloudflare.com/turnstile/v0/api.js"]')) {
      // 脚本已存在，等待加载完成
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

    // 动态加载 Turnstile script
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      nextTick(() => {
        renderTurnstile();
      });
    };
    document.head.appendChild(script);
  };

  // 渲染 Turnstile widget
  const renderTurnstile = () => {
    if (!window.turnstile || !turnstileContainer.value || !turnstileSiteKey) {
      return;
    }

    // 如果已有 widget，先清理
    if (turnstileWidgetId !== null) {
      try {
        if (typeof window.turnstile.remove === 'function') {
          window.turnstile.remove(turnstileWidgetId);
        }
      } catch (e) {
        console.warn('清理 Turnstile widget 失败:', e);
      }
      turnstileWidgetId = null;
    }

    // 清空容器
    if (turnstileContainer.value) {
      turnstileContainer.value.innerHTML = '';
    }

    try {
      turnstileWidgetId = window.turnstile.render(turnstileContainer.value, {
        sitekey: turnstileSiteKey,
        callback: (token) => {
          turnstileToken.value = token;
        },
        'error-callback': () => {
          turnstileToken.value = '';
          submitError.value = '验证失败，请重试';
        },
        'expired-callback': () => {
          turnstileToken.value = '';
        },
        theme: 'light',
        size: 'normal'
      });
    } catch (e) {
      console.error('渲染 Turnstile widget 失败:', e);
      turnstileWidgetId = null;
    }
  };

  // 重置 Turnstile
  const resetTurnstile = () => {
    if (turnstileWidgetId !== null && window.turnstile) {
      try {
        if (typeof window.turnstile.reset === 'function') {
          window.turnstile.reset(turnstileWidgetId);
        }
      } catch (e) {
        console.warn('重置 Turnstile widget 失败:', e);
      }
      turnstileToken.value = '';
    }
  };

  // 提交留言
  const submitMessage = async () => {
    // 验证 Turnstile token
    if (turnstileSiteKey && !turnstileToken.value) {
      submitError.value = '请完成人机验证';
      return;
    }

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
          content: form.value.content,
          turnstileToken: turnstileToken.value
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
        // 重置 Turnstile
        resetTurnstile();
        // 重新加载留言列表
        await loadMessages();
        // 3秒后隐藏成功提示
        setTimeout(() => {
          submitSuccess.value = false;
        }, 3000);
      }
    } catch (error) {
      submitError.value = error?.data?.message || '提交失败，请重试';
      // 验证失败时重置 Turnstile
      if (error?.data?.message?.includes('验证')) {
        resetTurnstile();
      }
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
    // 不在挂载时自动加载 Turnstile，等用户展开时再加载
  });

  onUnmounted(() => {
    // 清理 Turnstile
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
    if (turnstileContainer.value) {
      turnstileContainer.value.innerHTML = '';
    }
  });
</script>

<style scoped>
  .comments-container {
    margin-top: 0;
    padding: 0;
    background: #fcfbf9;
    border: 1px solid rgba(104, 68, 77, 0.15);
    border-radius: 16px;
    box-shadow:
      0 8px 32px rgba(255, 165, 0, 0.08),
      0 4px 16px rgba(255, 200, 150, 0.12),
      0 2px 8px rgba(0, 0, 0, 0.04);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease-in-out;
    width: 100%;
  }

  .comments-container:hover {
    box-shadow:
      0 12px 40px rgba(255, 165, 0, 0.12),
      0 6px 20px rgba(255, 200, 150, 0.18),
      0 3px 12px rgba(0, 0, 0, 0.06);
    border-color: rgba(104, 68, 77, 0.25);
  }

  .comments-header {
    padding: 12px 20px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid rgba(104, 68, 77, 0.1);
    background: rgba(252, 251, 249, 0.5);
    cursor: pointer;
    transition: background 0.3s ease-in-out;
  }

  .comments-header:hover {
    background: rgba(252, 251, 249, 0.8);
  }

  .header-left {
    flex: 1;
    text-align: center;
  }

  .toggle-btn {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s ease-in-out;
    color: #68444d;
    font-size: 18px;
  }

  .toggle-btn:hover {
    color: #8b5a6b;
    transform: translateY(-2px);
  }

  .toggle-icon {
    display: inline-block;
    transition: transform 0.3s ease;
    font-size: 14px;
  }

  .toggle-icon.expanded {
    transform: rotate(180deg);
  }

  .comments-content {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.4s ease-out;
  }

  .comments-content.expanded {
    max-height: 3000px;
    transition: max-height 0.5s ease-in;
  }

  .comments-title {
    font-family: 'Caveat', cursive;
    font-size: 1.5rem;
    margin: 0 0 3px 0;
    color: #68444d;
    font-weight: 500;
  }

  .comments-subtitle {
    font-size: 0.85rem;
    color: #999;
    margin: 0;
  }

  .glass-card {
    background: rgba(252, 251, 249, 0.95);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(104, 68, 77, 0.15);
    border-radius: 12px;
    padding: 20px;
    margin: 20px;
    box-shadow:
      0 4px 16px rgba(255, 165, 0, 0.06),
      0 2px 8px rgba(255, 200, 150, 0.1);
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
    min-height: 80px;
  }

  .submit-btn {
    width: 100%;
    padding: 12px;
    background: #68444d;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;
    font-weight: 500;
    box-shadow:
      0 4px 12px rgba(104, 68, 77, 0.2),
      0 2px 6px rgba(255, 165, 0, 0.1);
  }

  .submit-btn:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow:
      0 6px 16px rgba(104, 68, 77, 0.3),
      0 3px 8px rgba(255, 165, 0, 0.15);
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

  .success-message {
    color: #27ae60;
    font-size: 14px;
    margin-top: 10px;
  }

  .comments-list {
    padding: 20px;
    max-height: 600px;
    overflow-y: auto;
    overflow-x: hidden;
    width: 100%;
    box-sizing: border-box;
  }

  /* 自定义滚动条样式 - 桌面端 */
  .comments-list::-webkit-scrollbar {
    width: 8px;
  }

  .comments-list::-webkit-scrollbar-track {
    background: rgba(252, 251, 249, 0.5);
    border-radius: 8px;
  }

  .comments-list::-webkit-scrollbar-thumb {
    background: rgba(104, 68, 77, 0.15);
    border-radius: 8px;
    border: 2px solid transparent;
    background-clip: padding-box;
    transition: background 0.3s ease;
  }

  .comments-list::-webkit-scrollbar-thumb:hover {
    background: rgba(104, 68, 77, 0.25);
    background-clip: padding-box;
  }

  /* Firefox 滚动条样式 */
  .comments-list {
    scrollbar-width: thin;
    scrollbar-color: rgba(104, 68, 77, 0.15) rgba(252, 251, 249, 0.5);
  }

  .empty-state {
    text-align: center;
    padding: 40px;
    color: #999;
  }

  .messages {
    display: flex;
    flex-direction: column;
    gap: 15px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    overflow-x: hidden;
  }

  .turnstile-container {
    display: flex;
    justify-content: center;
    margin: 15px 0;
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
      overflow-x: hidden;
    }

    .comments-container {
      overflow-x: hidden;
      max-width: 100%;
    }

    .comments-content {
      overflow-x: hidden;
    }
  }
</style>
