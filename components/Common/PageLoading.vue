<template>
  <transition name="page-loading-fade">
    <div v-if="visible" class="page-loading-overlay">
      <div class="spinner"></div>
      <p class="loading-text">数据正在跨越太平洋，请稍候...</p>
    </div>
  </transition>
</template>

<script setup>
  import { computed } from "vue";
  import { useLoadingStore } from "~/stores/loadingStore";

  const loadingStore = useLoadingStore();

  const visible = computed(() => loadingStore.globalLoading);
</script>

<style scoped>
  .page-loading-overlay {
    position: fixed;
    inset: 0;
    background: rgba(250, 249, 246, 0.9);
    backdrop-filter: blur(4px);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    z-index: 9999;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-top-color: #e45462;
    animation: page-loading-spin 0.8s linear infinite;
  }

  .loading-text {
    margin-top: 16px;
    color: #666;
    font-size: 0.95rem;
  }

  @keyframes page-loading-spin {
    to {
      transform: rotate(360deg);
    }
  }

  .page-loading-fade-enter-active,
  .page-loading-fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .page-loading-fade-enter-from,
  .page-loading-fade-leave-to {
    opacity: 0;
  }
</style>
