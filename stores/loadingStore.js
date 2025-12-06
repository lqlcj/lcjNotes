import { defineStore } from "pinia";
import { ref } from "vue";

// 全局路由级 Loading 状态
export const useLoadingStore = defineStore("loading", () => {
  // 初始为 false：由插件控制显示/隐藏
  const globalLoading = ref(false);
  let timer = null;

  const show = () => {
    // 防抖：避免极快的路由切换也闪一下
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      globalLoading.value = true;
    }, 150);
  };

  const hide = () => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    globalLoading.value = false;
  };

  return {
    globalLoading,
    show,
    hide,
  };
});


