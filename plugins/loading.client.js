/**
 * Nuxt 路由加载状态插件
 * 在路由切换时显示/隐藏加载遮罩
 */
export default defineNuxtPlugin((nuxtApp) => {
  const loadingStore = useLoadingStore()

  // 页面加载完成后隐藏 loading
  nuxtApp.hook('page:finish', () => {
    setTimeout(() => {
      loadingStore.hide()
    }, 200)
  })

  // 页面开始加载时显示 loading
  nuxtApp.hook('page:start', () => {
    loadingStore.show()
  })

  // 应用挂载后隐藏初始 loading
  nuxtApp.hook('app:mounted', () => {
    setTimeout(() => {
      loadingStore.hide()
    }, 300)
  })
})

