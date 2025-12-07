<template>
  <div class="ghibli-container">
    <div class="sky-background"></div>
    <div class="content-scroll">
      <section ref="heroSection" class="section scroll-item text-center">
        <h1 class="main-title">
          <span class="handwritten">Welcome to my Garden</span>
        </h1>
        <p class="intro-text">
          <br />
          安静记录想法的地方...
        </p>
        <div v-show="showScrollIndicator" class="scroll-indicator">
          <span>↓ 向下探索</span>
        </div>
      </section>
      <section ref="footerSection" class="section footer-section text-center scroll-item">
        <h2 class="handwritten end-title">Ready to enter?</h2>
        <button class="soft-btn" @click="goHome" aria-label="进入主页">
          进入主页 / Enter Home ➞
        </button>
      </section>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue'
  import { useLoadingStore } from '~/stores/loadingStore'

  const loadingStore = useLoadingStore()

  const goHome = () => {
    navigateTo('/home')
  }

  // 页面挂载后隐藏 loading
  onMounted(() => {
    setTimeout(() => {
      loadingStore.hide()
    }, 500)
  })

  const heroSection = ref(null)
  const footerSection = ref(null)
  const showScrollIndicator = ref(true)

  let observer = null
  let footerObserver = null

  onMounted(() => {
    setTimeout(() => {
      const items = [heroSection.value, footerSection.value].filter(Boolean)

      if (items.length === 0) return

      const options = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }

      const callback = (entries, observerInstance) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observerInstance.unobserve(entry.target)
          }
        })
      }

      observer = new IntersectionObserver(callback, options)
      items.forEach((item) => observer.observe(item))

      if (footerSection.value) {
        const footerOptions = {
          root: null,
          threshold: 0.7,
          rootMargin: '0px 0px -100px 0px',
        }

        const footerCallback = (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              showScrollIndicator.value = false
            } else {
              showScrollIndicator.value = true
            }
          })
        }

        footerObserver = new IntersectionObserver(footerCallback, footerOptions)
        footerObserver.observe(footerSection.value)
      }
    }, 100)
  })

  onBeforeUnmount(() => {
    if (observer) {
      observer.disconnect()
      observer = null
    }
    if (footerObserver) {
      footerObserver.disconnect()
      footerObserver = null
    }
  })
</script>

<style scoped>
  .ghibli-container {
    --ghibli-blue: #a7d0e8;
    --ghibli-cream: #fef9e7;
    --text-dark: #5d6d7e;
    --text-soft: #8a9a9b;

    min-height: 120vh;
    background-color: var(--ghibli-cream);
    color: var(--text-dark);
    font-family: KaiTi SC, STKaiti, KaiTi, 楷体, FangSong, SimSun, serif;
    overflow-x: hidden;
    position: relative;
  }

  .handwritten {
    font-family: Caveat, cursive;
    color: #34495e;
  }

  .text-center {
    text-align: center;
  }

  .sky-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    background: linear-gradient(to bottom, #d4eaff, #fef9e7 80%);
    z-index: 0;
    overflow: hidden;
    contain: strict;
    transform: translateZ(0);
  }

  .content-scroll {
    position: relative;
    z-index: 1;
    contain: layout style;
  }

  .section {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 80px 0;
  }

  .footer-section {
    min-height: 100vh;
    padding: 80px 0 60px;
    justify-content: center;
  }

  .main-title {
    font-size: 4.5rem;
    line-height: 1.2;
    margin-bottom: 30px;
    color: #2c3e50;
  }

  .main-title .handwritten {
    font-size: 3.5rem;
    color: #3498db;
  }

  .intro-text {
    font-size: 1.3rem;
    color: var(--text-dark);
    max-width: 600px;
    margin: 0 auto 60px;
    line-height: 1.8;
  }

  .scroll-indicator {
    font-size: 1rem;
    color: var(--text-soft);
    animation: bounce 2s infinite ease-in-out;
    animation-delay: 0.2s;
    animation-fill-mode: both;
    transition: opacity 0.6s ease;
    font-weight: 400;
    letter-spacing: 1px;
  }

  @keyframes bounce {

    0%,
    20%,
    50%,
    80%,
    100% {
      transform: translate3d(0, 0, 0);
    }

    40% {
      transform: translate3d(0, -8px, 0);
    }

    60% {
      transform: translate3d(0, -4px, 0);
    }
  }

  .end-title {
    font-size: 4rem;
    margin-bottom: 20px;
  }

  .soft-btn {
    margin-top: 30px;
    padding: 15px 40px;
    background: var(--ghibli-blue);
    color: #fff;
    border: none;
    border-radius: 50px;
    font-size: 1.2rem;
    cursor: pointer;
    box-shadow: 0 10px 20px -5px #a7d0e880;
    transition: all 0.3s ease;
    outline: none;
  }

  .soft-btn:hover {
    background: #8dc3e3;
    transform: translateY(-3px);
    box-shadow: 0 15px 25px -5px #a7d0e899;
  }

  .soft-btn:focus-visible {
    outline: 2px solid var(--ghibli-blue);
    outline-offset: 2px;
  }

  .soft-btn:active {
    transform: translateY(-1px);
  }

  .scroll-item {
    opacity: 0;
    transform: translateY(40px);
    contain: layout style paint;
    transition: opacity 1s cubic-bezier(0.16, 1, 0.3, 1), transform 1s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .scroll-item.visible {
    opacity: 1;
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    .ghibli-container {
      min-height: 100vh;
    }

    .section {
      min-height: 100vh;
      padding: 40px 0;
    }

    .footer-section {
      min-height: auto;
      padding: 30px 0 15px;
    }

    .main-title {
      font-size: 3rem;
    }

    .main-title .handwritten {
      font-size: 2.5rem;
    }

    .intro-text {
      font-size: 1.1rem;
      padding: 0 20px;
    }

    .end-title {
      font-size: 3rem;
    }

    .soft-btn {
      padding: 12px 30px;
      font-size: 1rem;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .scroll-item {
      transition: none;
    }

    .scroll-indicator {
      animation: none;
    }

    .soft-btn {
      transition: background-color 0.3s ease;
    }

    .soft-btn:hover {
      transform: none;
    }
  }
</style>
