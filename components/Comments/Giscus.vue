<template>
  <div class="comments-container">
    <div class="comments-header">
      <h3 class="comments-title">💬 留言板</h3>
      <p class="comments-subtitle">分享你的想法，让我们一起交流</p>
    </div>

    <!-- 加载中 -->
    <LoadingMessage v-if="isLoading && !hasError" text="飘洋过海来看你~" />

    <!-- Giscus 容器 -->
    <div v-show="!hasError" ref="giscusContainer" class="giscus-wrapper"></div>

    <!-- 错误提示（无法访问时显示） -->
    <div v-if="hasError" class="error-fallback">
      <div class="error-icon">⚠️</div>
      <h4 class="error-title">Oops!!!!可能是网络问题导致无法连接到留言服务。</h4>
      <p class="error-message">
        请检查你的网络连接，或稍后重试。
      </p>
      <div class="fallback-options">
        <button @click="retryLoad" class="retry-btn">
          <span>🔄</span>
          <span>重试加载</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
  import { useRoute } from 'vue-router'
  import LoadingMessage from '~/components/Common/LoadingMessage.vue'

  const props = defineProps({
    repo: { type: String, required: true },
    repoId: { type: String, required: true },
    category: { type: String, default: 'Announcements' },
    categoryId: { type: String, required: true },
    mapping: { type: String, default: 'pathname' },
    reactionsEnabled: { type: Boolean, default: true },
    emitMetadata: { type: Boolean, default: false },
    inputPosition: { type: String, default: 'bottom' },
    theme: { type: String, default: 'light' },
    lang: { type: String, default: 'zh-CN' },
  })

  const route = useRoute()
  const giscusContainer = ref(null)
  const isLoading = ref(true)
  const hasError = ref(false)
  let giscusScript = null
  let loadTimeout = null
  let checkInterval = null

  const checkGiscusLoaded = () => {
    if (!giscusContainer.value) return false
    const iframe = giscusContainer.value.querySelector('iframe.giscus-frame')
    if (iframe) {
      try {
        if (iframe.offsetHeight > 0) {
          return true
        }
      } catch (e) {
        return true
      }
    }
    return false
  }

  const loadGiscus = () => {
    isLoading.value = true
    hasError.value = false

    if (giscusScript) {
      giscusScript.remove()
      giscusScript = null
    }

    if (loadTimeout) {
      clearTimeout(loadTimeout)
      loadTimeout = null
    }
    if (checkInterval) {
      clearInterval(checkInterval)
      checkInterval = null
    }

    if (giscusContainer.value) {
      giscusContainer.value.innerHTML = ''
    }

    giscusScript = document.createElement('script')
    giscusScript.src = 'https://giscus.app/client.js'
    giscusScript.setAttribute('data-repo', props.repo)
    giscusScript.setAttribute('data-repo-id', props.repoId)
    giscusScript.setAttribute('data-category', props.category)
    giscusScript.setAttribute('data-category-id', props.categoryId)
    giscusScript.setAttribute('data-mapping', props.mapping)
    giscusScript.setAttribute('data-reactions-enabled', props.reactionsEnabled ? '1' : '0')
    giscusScript.setAttribute('data-emit-metadata', props.emitMetadata ? '1' : '0')
    giscusScript.setAttribute('data-input-position', props.inputPosition)
    giscusScript.setAttribute('data-theme', props.theme)
    giscusScript.setAttribute('data-lang', props.lang)
    giscusScript.setAttribute('data-strict', '0')
    giscusScript.setAttribute('data-loading', 'lazy')
    giscusScript.crossOrigin = 'anonymous'
    giscusScript.async = true

    giscusScript.onload = () => {
      checkInterval = setInterval(() => {
        if (checkGiscusLoaded()) {
          isLoading.value = false
          hasError.value = false
          if (checkInterval) {
            clearInterval(checkInterval)
            checkInterval = null
          }
          if (loadTimeout) {
            clearTimeout(loadTimeout)
            loadTimeout = null
          }
        }
      }, 500)

      loadTimeout = setTimeout(() => {
        if (isLoading.value) {
          isLoading.value = false
          hasError.value = true
          if (checkInterval) {
            clearInterval(checkInterval)
            checkInterval = null
          }
        }
      }, 10000)
    }

    giscusScript.onerror = () => {
      isLoading.value = false
      hasError.value = true
      if (loadTimeout) {
        clearTimeout(loadTimeout)
        loadTimeout = null
      }
      if (checkInterval) {
        clearInterval(checkInterval)
        checkInterval = null
      }
    }

    if (giscusContainer.value) {
      giscusContainer.value.appendChild(giscusScript)
    }

    setTimeout(() => {
      if (isLoading.value && !checkGiscusLoaded()) {
        isLoading.value = false
        hasError.value = true
        if (checkInterval) {
          clearInterval(checkInterval)
          checkInterval = null
        }
      }
    }, 15000)
  }

  const retryLoad = () => {
    loadGiscus()
  }

  watch(
    () => route.fullPath,
    () => {
      setTimeout(() => {
        loadGiscus()
      }, 100)
    }
  )

  onMounted(() => {
    loadGiscus()
  })

  onBeforeUnmount(() => {
    if (giscusScript) {
      giscusScript.remove()
      giscusScript = null
    }
    if (loadTimeout) {
      clearTimeout(loadTimeout)
      loadTimeout = null
    }
    if (checkInterval) {
      clearInterval(checkInterval)
      checkInterval = null
    }
  })
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

  .comments-container:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border-color: #c4b5a0;
  }

  .comments-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg,
        rgba(255, 221, 225, 0.6) 0%,
        rgba(224, 195, 252, 0.6) 50%,
        rgba(142, 197, 252, 0.6) 100%);
    border-radius: 16px 16px 0 0;
    z-index: 1;
  }

  .comments-header {
    padding: 12px 20px 10px;
    text-align: center;
    border-bottom: 1px solid rgba(224, 195, 252, 0.2);
    background: linear-gradient(135deg,
        rgba(255, 221, 225, 0.05) 0%,
        rgba(224, 195, 252, 0.05) 100%);
    position: relative;
    z-index: 1;
  }

  /* 电脑端：标题和描述居中显示 */
  @media (min-width: 769px) {
    .comments-header {
      text-align: center;
    }

    .comments-title {
      text-align: center;
    }

    .comments-subtitle {
      text-align: center;
    }
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
    letter-spacing: 0.3px;
  }

  .giscus-wrapper {
    width: 100%;
    position: relative;
    z-index: 1;
    padding: 12px 20px 16px;
    background: transparent;
    max-height: 500px;
    overflow-y: auto;
    overflow-x: hidden;
  }

  .giscus-wrapper::-webkit-scrollbar {
    width: 8px;
  }

  .giscus-wrapper::-webkit-scrollbar-track {
    background: rgba(224, 195, 252, 0.1);
    border-radius: 8px;
  }

  .giscus-wrapper::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, rgba(162, 155, 254, 0.6) 0%, rgba(108, 92, 231, 0.6) 100%);
    border-radius: 8px;
    border: 1px solid transparent;
    background-clip: padding-box;
  }

  .giscus-wrapper::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, rgba(162, 155, 254, 0.8) 0%, rgba(108, 92, 231, 0.8) 100%);
    background-clip: padding-box;
  }


  .error-fallback {
    padding: 32px 24px;
    text-align: center;
  }

  .error-icon {
    font-size: 3rem;
    margin-bottom: 12px;
  }

  .error-title {
    font-size: 1.2rem;
    color: #6c5ce7;
    margin: 0 0 12px 0;
    font-weight: 600;
  }

  .error-message {
    font-size: 0.9rem;
    color: #666;
    margin: 0 0 24px 0;
    line-height: 1.6;
  }

  .fallback-options {
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
  }

  .retry-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: rgba(162, 155, 254, 0.1);
    color: #6c5ce7;
    border: 1px solid rgba(162, 155, 254, 0.3);
    border-radius: 12px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .retry-btn:hover {
    background: rgba(162, 155, 254, 0.2);
    border-color: rgba(162, 155, 254, 0.5);
  }

  .retry-btn span:first-child {
    font-size: 1.1rem;
  }

  @media (max-width: 767px) {
    .comments-container {
      margin-top: 30px;
      border-radius: 14px;
    }

    .comments-header {
      padding: 10px 16px 8px;
    }

    .comments-title {
      font-size: 1.3rem;
    }

    .comments-subtitle {
      font-size: 0.75rem;
    }

    .giscus-wrapper {
      padding: 10px 16px 14px;
      max-height: 400px;
    }

    .error-fallback {
      padding: 24px 20px;
    }
  }
</style>
