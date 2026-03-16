<!--
  友链申请表单组件
  
  功能：
    - 友链申请表单（网站名称、链接、描述、图标）
    - Cloudflare Turnstile 人机验证
    - 表单验证和提交
    - 成功提示
  
  特性：
    - 展开/收起动画
    - 表单验证（URL格式等）
    - 错误处理和提示
    - 响应式设计
-->
<template>
  <transition name="slide-down">
    <div v-if="isExpanded" class="request-form glass-panel">
      <div class="form-content">
        <div class="form-header">
          <!-- 本站信息 -->
          <div class="site-info">
            <div class="site-info-title">本站信息</div>
            <div class="site-info-content">
              <div class="site-info-item">
                <span class="site-info-label">名称:</span>
                <span
                  class="site-info-value"
                  @click="copyToClipboard('Leyili 花园')"
                  >Leyili 花园</span
                >
              </div>
              <div class="site-info-item">
                <span class="site-info-label">图标:</span>
                <span
                  class="site-info-value"
                  @click="copyToClipboard('https://photo.lcjlq.com/lcj.svg')"
                  >https://blog.930309.xyz/images/lcj.svg</span
                >
              </div>
              <div class="site-info-item">
                <span class="site-info-label">链接:</span>
                <span
                  class="site-info-value"
                  @click="copyToClipboard('https://lcjlq.com/')"
                  >https://blog.930309.xyz/</span
                >
              </div>
              <div class="site-info-item">
                <span class="site-info-label">描述:</span>
                <span
                  class="site-info-value"
                  @click="copyToClipboard('小小后花园～')"
                  >小小后花园～</span
                >
              </div>
            </div>
            <div class="site-info-note">
              长时间无法正常访问的站点会被移除喔～
            </div>
          </div>
          <!-- 复制提示 -->
          <transition name="fade">
            <div v-if="showCopyTip" class="copy-tip">
              <span class="copy-icon">✓</span>
              <span>已复制</span>
            </div>
          </transition>
          <p class="form-subtitle">填写以下信息，我会尽快审核并添加你的网站</p>
          <button @click="handleClose" class="close-btn" aria-label="收起表单">
            ×
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="form">
          <div class="form-group">
            <label for="name">网站名称 <span class="required">*</span></label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              placeholder="例如：我的博客"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="url">网站链接 <span class="required">*</span></label>
            <input
              id="url"
              v-model="formData.url"
              type="url"
              placeholder="https://example.com"
              required
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="description">网站描述</label>
            <textarea
              id="description"
              v-model="formData.description"
              placeholder="简单介绍一下你的网站..."
              rows="3"
              class="form-textarea"
            ></textarea>
          </div>

          <div class="form-group">
            <label for="avatar">网站图标（可选）</label>
            <input
              id="avatar"
              v-model="formData.avatar"
              type="url"
              placeholder="https://example.com/avatar.jpg"
              class="form-input"
            />
            <small class="form-hint">建议尺寸：64x64px，支持 jpg/png/gif</small>
          </div>

          <!-- Turnstile 验证 -->
          <div class="form-group">
            <div ref="turnstileContainer" class="turnstile-container"></div>
          </div>

          <button
            type="submit"
            :disabled="isSubmitting || (turnstileSiteKey && !turnstileToken)"
            class="submit-btn"
          >
            <span v-if="!isSubmitting">提交申请</span>
            <span v-else>提交中...</span>
          </button>

          <p v-if="submitError" class="error-message">{{ submitError }}</p>
        </form>

        <!-- 提交成功提示 -->
        <div v-if="showSuccess" class="success-message">
          <div class="success-icon">✅</div>
          <p class="success-text">申请已提交！</p>
          <p class="success-detail">
            我会尽快审核，审核通过后会添加到友链列表中。
          </p>
          <button @click="resetForm" class="reset-btn">继续申请</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { reactive, ref, onMounted, onUnmounted, watch } from "vue";

const config = useRuntimeConfig();
const turnstileSiteKey = config.public.turnstileSiteKey;

const props = defineProps({
  isExpanded: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["close"]);

const formData = reactive({
  name: "",
  url: "",
  description: "",
  avatar: "",
});

const isSubmitting = ref(false);
const showSuccess = ref(false);
const submitError = ref("");
const turnstileContainer = ref(null);
const turnstileToken = ref("");
const showCopyTip = ref(false);
let turnstileWidgetId = null;
let copyTipTimer = null;

// 关闭表单
const handleClose = () => {
  resetForm();
  emit("close");
};

// 表单验证
const validateForm = () => {
  if (!formData.name.trim()) {
    alert("请输入网站名称");
    return false;
  }

  if (!formData.url.trim()) {
    alert("请输入网站链接");
    return false;
  }

  // 验证 URL 格式
  try {
    new URL(formData.url);
  } catch {
    alert("请输入有效的网站链接（需要包含 http:// 或 https://）");
    return false;
  }

  // 如果提供了头像，验证 URL
  if (formData.avatar && formData.avatar.trim()) {
    try {
      new URL(formData.avatar);
    } catch {
      alert("请输入有效的图标链接");
      return false;
    }
  }

  return true;
};

// 加载 Turnstile
const loadTurnstile = () => {
  if (!turnstileSiteKey) {
    console.warn("Turnstile Site Key 未配置，跳过验证");
    turnstileToken.value = "skip";
    return;
  }

  if (window.turnstile) {
    renderTurnstile();
    return;
  }

  const script = document.createElement("script");
  script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js";
  script.async = true;
  script.defer = true;
  script.onload = () => {
    renderTurnstile();
  };
  document.head.appendChild(script);
};

// 渲染 Turnstile widget
const renderTurnstile = () => {
  if (!window.turnstile || !turnstileContainer.value || !turnstileSiteKey) {
    return;
  }

  turnstileWidgetId = window.turnstile.render(turnstileContainer.value, {
    sitekey: turnstileSiteKey,
    callback: (token) => {
      turnstileToken.value = token;
    },
    "error-callback": () => {
      turnstileToken.value = "";
      submitError.value = "验证失败，请重试";
    },
    "expired-callback": () => {
      turnstileToken.value = "";
    },
    theme: "light",
    size: "normal",
  });
};

// 重置 Turnstile
const resetTurnstile = () => {
  if (turnstileWidgetId && window.turnstile) {
    window.turnstile.reset(turnstileWidgetId);
    turnstileToken.value = "";
  }
};

// 提交表单
const handleSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  // 验证 Turnstile token
  if (turnstileSiteKey && !turnstileToken.value) {
    submitError.value = "请完成人机验证";
    return;
  }

  isSubmitting.value = true;
  submitError.value = "";

  try {
    const response = await $fetch("/api/friends/requests", {
      method: "POST",
      body: {
        name: formData.name,
        url: formData.url,
        description: formData.description,
        avatar: formData.avatar,
        turnstileToken: turnstileToken.value,
      },
    });

    if (response.success) {
      // 显示成功提示
      showSuccess.value = true;
      // 重置 Turnstile
      resetTurnstile();
      // 3秒后自动重置表单
      setTimeout(() => {
        resetForm();
      }, 5000);
    }
  } catch (error) {
    console.error("提交失败:", error);
    submitError.value = error?.data?.message || "提交失败，请稍后重试";
    // 验证失败时重置 Turnstile
    if (error?.data?.message?.includes("验证")) {
      resetTurnstile();
    }
  } finally {
    isSubmitting.value = false;
  }
};

// 重置表单
const resetForm = () => {
  formData.name = "";
  formData.url = "";
  formData.description = "";
  formData.avatar = "";
  showSuccess.value = false;
  submitError.value = "";
  resetTurnstile();
  // 注意：不自动收起表单，让用户可以选择继续申请
};

// 复制到剪贴板
const copyToClipboard = async (text) => {
  try {
    // 清除之前的定时器
    if (copyTipTimer) {
      clearTimeout(copyTipTimer);
      copyTipTimer = null;
    }

    await navigator.clipboard.writeText(text);
    showCopyTip.value = true;
    copyTipTimer = setTimeout(() => {
      showCopyTip.value = false;
      copyTipTimer = null;
    }, 2000);
  } catch (err) {
    console.error("复制失败:", err);
  }
};

// 监听表单展开状态，展开时加载 Turnstile
watch(
  () => props.isExpanded,
  (newVal) => {
    if (newVal) {
      setTimeout(() => {
        loadTurnstile();
      }, 100);
    }
  },
);

onMounted(() => {
  if (props.isExpanded) {
    setTimeout(() => {
      loadTurnstile();
    }, 100);
  }
});

onUnmounted(() => {
  // 清理 Turnstile
  if (turnstileWidgetId && window.turnstile) {
    window.turnstile.remove(turnstileWidgetId);
    turnstileWidgetId = null;
  }
  if (turnstileContainer.value) {
    turnstileContainer.value.innerHTML = "";
  }
  // 清理复制提示定时器
  if (copyTipTimer) {
    clearTimeout(copyTipTimer);
    copyTipTimer = null;
  }
});
</script>

<style scoped>
.request-form {
  background: #faf9f6;
  border: 1px solid #d4c5b0;
  border-radius: 12px;
  padding: 0;
  width: 100%;
  overflow: hidden;
}

/* 表单内容区域 */
.form-content {
  padding: 20px;
}

.form-header {
  position: relative;
  text-align: center;
  margin-bottom: 0;
}

.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 28px;
  height: 28px;
  background: transparent;
  border: 1px solid #d4c5b0;
  border-radius: 50%;
  color: #666;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  background: #f0f0f0;
  border-color: #c4b5a0;
  color: #2c3e50;
}

/* 展开/收起动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
  overflow: hidden;
}

.slide-down-enter-from {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.slide-down-enter-to {
  opacity: 1;
  max-height: 1000px;
  transform: translateY(0);
}

.slide-down-leave-from {
  opacity: 1;
  max-height: 1000px;
  transform: translateY(0);
}

.slide-down-leave-to {
  opacity: 0;
  max-height: 0;
  transform: translateY(-10px);
}

.form-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
  text-align: center;
}

.site-info {
  background: rgba(255, 255, 255, 0.6);
  border: 1px solid #e0d5c4;
  border-radius: 6px;
  padding: 10px 12px;
  margin: 8px 0 12px 0;
  font-size: 0.8rem;
  width: 100%;
  text-align: left;
}

.site-info-title {
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 6px;
  font-size: 1rem;
  text-align: center;
}

.site-info-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  text-align: left;
}

.site-info-item {
  display: flex;
  align-items: flex-start;
  line-height: 1.4;
  text-align: left;
}

.site-info-label {
  color: #666;
  min-width: 40px;
  flex-shrink: 0;
  text-align: left;
}

.site-info-value {
  color: #2c3e50;
  word-break: break-all;
  cursor: pointer;
  transition: color 0.2s ease;
  flex: 1;
  text-align: left;
}

.site-info-value:hover {
  color: #6c5ce7;
  text-decoration: underline;
}

.site-info-note {
  margin-top: 6px;
  padding-top: 6px;
  border-top: 1px solid #e0d5c4;
  color: #999;
  font-size: 0.75rem;
  text-align: left;
}

.copy-tip {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(44, 62, 80, 0.95);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.9rem;
  z-index: 10000;
  pointer-events: none;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 500;
  animation: copyTipPop 0.3s ease-out;
}

.copy-icon {
  font-size: 1.1rem;
  color: #4ade80;
}

@keyframes copyTipPop {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0;
  }

  50% {
    transform: translate(-50%, -50%) scale(1.05);
  }

  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.form-subtitle {
  font-size: 0.8rem;
  color: #666;
  text-align: center;
  margin: 0 0 16px 0;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #2c3e50;
}

.required {
  color: #e74c3c;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d4c5b0;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #2c3e50;
  background: #fff;
  transition: all 0.3s ease;
  font-family: inherit;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: #6c5ce7;
  box-shadow: 0 0 0 2px rgba(108, 92, 231, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 60px;
}

.form-hint {
  font-size: 0.8rem;
  color: #999;
  margin-top: -4px;
}

.submit-btn {
  padding: 8px 20px;
  background: #2c3e50;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 4px;
}

.submit-btn:hover:not(:disabled) {
  background: #34495e;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-message {
  text-align: center;
  padding: 16px;
  background: rgba(46, 213, 115, 0.1);
  border-radius: 8px;
  margin-top: 12px;
}

.success-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.success-text {
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 4px 0;
}

.success-detail {
  font-size: 0.8rem;
  color: #666;
  margin: 0 0 12px 0;
}

.reset-btn {
  padding: 8px 20px;
  background: transparent;
  border: 2px solid #2c3e50;
  color: #2c3e50;
  border-radius: 8px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.reset-btn:hover {
  background: #2c3e50;
  color: white;
}

.turnstile-container {
  display: flex;
  justify-content: center;
  margin: 10px 0;
}

.error-message {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-top: 8px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-content {
    padding: 16px;
  }

  .form-title {
    font-size: 1.1rem;
  }

  .form-subtitle {
    font-size: 0.75rem;
  }
}
</style>
