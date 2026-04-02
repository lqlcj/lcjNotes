<template>
  <div v-if="hasError" class="error-boundary">
    <div class="error-container">
      <div class="error-icon">⚠️</div>
      <h2 class="error-title">哎呀，出错了！</h2>
      <p class="error-message">
        应用遇到了一个未预期的错误。我们已经记录了这个问题。
      </p>
      
      <div class="error-details" v-if="showDetails">
        <details>
          <summary>错误详情（点击展开）</summary>
          <pre class="error-stack">{{ errorInfo }}</pre>
        </details>
      </div>

      <div class="error-actions">
        <button @click="handleRetry" class="retry-btn">
          <span>🔄</span>
          <span>重试</span>
        </button>
        <button @click="handleGoHome" class="home-btn">
          <span>🏠</span>
          <span>返回首页</span>
        </button>
        <button @click="toggleDetails" class="details-btn">
          {{ showDetails ? '隐藏' : '显示' }}详情
        </button>
      </div>
    </div>
  </div>
  
  <!-- 如果没有错误，正常渲染子组件 -->
  <slot v-else />
</template>

<script setup>
  /**
   * 错误边界组件。
   *
   * 用途：捕获子组件未处理的错误，显示友好提示并提供恢复操作。
   */
  import { ref, onErrorCaptured } from 'vue';

  // 错误状态
  const hasError = ref(false);
  const errorInfo = ref('');
  const showDetails = ref(false);

  /**
   * 捕获子组件中的错误，阻止错误继续向上传播。
   */
  onErrorCaptured((err, instance, info) => {
    console.error('错误边界捕获到错误:', err);
    console.error('组件实例:', instance);
    console.error('错误信息:', info);

    // 汇总错误详情，供用户展开查看
    errorInfo.value = `
错误类型: ${err.name}
错误消息: ${err.message}
错误堆栈: ${err.stack}
组件信息: ${info}
时间: ${new Date().toLocaleString()}
    `.trim();

    // 标记为有错误，切换到错误展示界面
    hasError.value = true;

    return false;
  });

  /**
   * 重试：清空错误状态并刷新页面。
   */
  const handleRetry = () => {
    hasError.value = false;
    errorInfo.value = '';
    showDetails.value = false;

    if (process.client) {
      window.location.reload();
    }
  };

  /**
   * 返回首页并重置错误状态。
   */
  const handleGoHome = () => {
    hasError.value = false;
    errorInfo.value = '';
    showDetails.value = false;
    navigateTo('/home');
  };

  /**
   * 切换错误详情显示。
   */
  const toggleDetails = () => {
    showDetails.value = !showDetails.value;
  };
</script>

<style scoped>
  /* 错误容器样式 */
  .error-boundary {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    background: linear-gradient(135deg, #FFDDE1 0%, #E0C3FC 100%);
  }

  .error-container {
    max-width: 600px;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    border-radius: 16px;
    padding: 40px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .error-icon {
    font-size: 4rem;
    margin-bottom: 20px;
    animation: shake 0.5s ease-in-out;
  }

  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-10px); }
    75% { transform: translateX(10px); }
  }

  .error-title {
    font-size: 1.8rem;
    color: #d84315;
    margin-bottom: 15px;
    font-weight: bold;
  }

  .error-message {
    font-size: 1rem;
    color: #666;
    line-height: 1.6;
    margin-bottom: 30px;
  }

  /* 错误详情 */
  .error-details {
    margin: 20px 0;
    text-align: left;
  }

  .error-details details {
    cursor: pointer;
    padding: 15px;
    background: #f5f5f5;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .error-details summary {
    font-weight: bold;
    color: #555;
    margin-bottom: 10px;
    user-select: none;
  }

  .error-stack {
    font-size: 0.85rem;
    color: #333;
    background: #fff;
    padding: 15px;
    border-radius: 6px;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-word;
    max-height: 300px;
    overflow-y: auto;
    border: 1px solid #ddd;
    margin-top: 10px;
  }

  /* 操作按钮 */
  .error-actions {
    display: flex;
    gap: 15px;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 30px;
  }

  .retry-btn,
  .home-btn,
  .details-btn {
    padding: 12px 24px;
    border: none;
    border-radius: 8px;
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 500;
  }

  .retry-btn {
    background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
    color: white;
  }

  .retry-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(108, 92, 231, 0.3);
  }

  .home-btn {
    background: linear-gradient(135deg, #00b894 0%, #00cec9 100%);
    color: white;
  }

  .home-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 184, 148, 0.3);
  }

  .details-btn {
    background: #f0f0f0;
    color: #555;
    border: 1px solid #ddd;
  }

  .details-btn:hover {
    background: #e0e0e0;
  }

  /* 响应式设计 */
  @media (max-width: 768px) {
    .error-container {
      padding: 30px 20px;
    }

    .error-title {
      font-size: 1.5rem;
    }

    .error-actions {
      flex-direction: column;
    }

    .retry-btn,
    .home-btn,
    .details-btn {
      width: 100%;
      justify-content: center;
    }
  }
</style>

