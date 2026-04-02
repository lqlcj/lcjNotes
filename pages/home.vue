<template>
  <div class="preview-page">
    <div class="preview-container">
      <!-- HomeBanner 组件 -->
      <HomeBanner />
      <div class="homepage-content" :style="styles">

        <!-- 分隔线1 -->
        <div class="sin sin-top"></div>

        <!-- 第一部分：两个并排的文本块 -->
        <div class="homepage down">
          <div class="line text-blocks-line">
            <div class="text-block text-block-left">
              <span class="homepage title">Hello, Traveler...</span>
              <span class="homepage description">
                In an era shaped by algorithmic feeds, personal sites—kept alive only by interest and enthusiasm—feel
                like small islands in a vast ocean.
                <br></br>
                Yet some people still choose to visit these quiet places.
                If you're one of these islands, I'd be glad to have you as a neighbor on the Friends page.
              </span>
            </div>
            <div class="text-block text-block-right">
              <span class="homepage title typewriter">
                {{ displayTitle }}
                <span v-if="typewriterOptions.enabled" class="caret"></span>
              </span>
              <span class="homepage description wenkai-font">
                在这个只有算法推荐的时代，靠兴趣发电的个人小站就像汪洋中的一座座渺小岛屿。
                <br></br>
                不过，仍旧有那么一群人愿意访问这个宁静的地方，
                如果你也是千万岛屿中的一个,非常欢迎你在Friends页成为我的邻居!
              </span>
            </div>
          </div>

          <!-- 分隔线2 -->
          <div class="separator-line-wrapper">
            <div class="sin sin-left"></div>
            <div class="sin-middle">
              <!-- 社交媒体按钮区域已移除 -->
            </div>
            <div class="sin sin-right"></div>
          </div>
        </div>

        <!-- Notes 组件 -->
        <NotesSection />

        <!-- 留言板组件 -->
        <Guestbook />
      </div>
    </div>
  </div>
</template>

<script setup>
  /**
   * 主页组件。
   *
   * 功能：整合 Banner、文章瀑布流与留言板，并提供双语文案与打字机效果。
   */
  import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
  import { layoutConfig } from '~/config/layout'
  import HomeBanner from './home/components/HomeBanner.vue'
  import NotesSection from './home/components/NotesSection.vue'
  import Guestbook from '~/components/Comments/Guestbook.vue'

  // 处理下载按钮点击
  const handleDownload = () => {
    // 可以在这里添加下载逻辑
  }

  // 计算样式对象，用于动态绑定背景图
  const styles = computed(() => ({
    '--sin-bg': 'url(/images/sin.png)',
    '--button-bg': 'url(/images/home/button.png)',
    '--shadow-button-bg': 'url(/images/home/shadow-button-download.png)'
  }))

  // Typewriter state for the right-hand title
  const typewriterOptions = reactive({
    enabled: true,       // 是否开启打字机
    speed: 280,          // 每个字符的间隔（毫秒）
    repeat: 1,    // 循环次数，Infinity 为无限循环
    pauseBetweenRuns: 400 // 每轮结束后的停顿（毫秒）
  })

  const originalTitle = 'watch(you, () => { smile() })..'
  const typedTitle = ref('')
  const displayTitle = computed(() =>
    typewriterOptions.enabled ? typedTitle.value : originalTitle
  )

  let timerId = null
  let index = 0
  let finishedRuns = 0

  const clearTimer = () => {
    if (timerId) {
      clearTimeout(timerId)
      timerId = null
    }
  }

  const scheduleNext = () => {
    timerId = setTimeout(tick, typewriterOptions.speed)
  }

  const tick = () => {
    if (!typewriterOptions.enabled) {
      clearTimer()
      typedTitle.value = originalTitle
      return
    }

    if (index <= originalTitle.length) {
      typedTitle.value = originalTitle.slice(0, index)
      index += 1
      scheduleNext()
      return
    }

    // 一轮结束
    finishedRuns += 1
    if (finishedRuns < typewriterOptions.repeat || typewriterOptions.repeat === Infinity) {
      index = 0
      timerId = setTimeout(tick, typewriterOptions.pauseBetweenRuns)
    } else {
      clearTimer()
    }
  }

  const startTypewriter = () => {
    clearTimer()
    typedTitle.value = ''
    index = 0
    finishedRuns = 0
    if (typewriterOptions.enabled) {
      scheduleNext()
    } else {
      typedTitle.value = originalTitle
    }
  }

  watch(
    () => [typewriterOptions.enabled, typewriterOptions.speed, typewriterOptions.repeat],
    () => startTypewriter()
  )

  onMounted(() => {
    startTypewriter()
  })

  onBeforeUnmount(() => {
    clearTimer()
  })
</script>

<style scoped>

  /* 页面容器 */
  .preview-page {
    min-height: 100vh;
    padding: 30px 0 40px 0;
    background-color: transparent;
  }

  /* 内容容器 - 限制宽度并居中 */
  .preview-container {
    width: 100%;
    max-width: v-bind('layoutConfig.contentMaxWidth');
    margin: 0 auto;
    padding: 0 v-bind('layoutConfig.contentPadding');
    box-sizing: border-box;
  }

  /* HomeBanner 样式调整 */
  .preview-container :deep(.banner-wrapper) {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto 70px;
  }

  .preview-container :deep(.banner-logo) {
    max-width: 400px;
    width: 100%;
    height: auto;
    transform: scale(1.0);
  }

  /* 基础样式 */
  .homepage-content {
    position: relative;
    text-align: center;
  }

  .homepage-content div {
    text-align: center;
  }

  /* 文本样式 */
  .text {
    margin-top: -300px;
  }

  .homepage.question {
    font-size: 38pt;
  }

  .c {
    color: #f16079;
  }

  .image-face {
    position: relative;
    min-height: 300px;
    padding-top: 80px;
    margin-top: 20px;
  }

  /* 下载按钮样式 */
  .homepage.download-button {
    margin: 40px auto;
    position: relative;
    width: 26%;
    padding-bottom: 10px;
    z-index: 999999;
  }

  .homepage.download-button a {
    font-family: 'Conv_FuturaStd-Heavy', Arial;
    font-size: 19pt;
    color: #ffffff;
    line-height: 60px;
    text-decoration: none;
  }

  .homepage.download-button .image {
    background-image: var(--button-bg);
    height: 63px;
    width: 252px;
    position: relative;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
  }

  .homepage.download-button .image:hover {
    opacity: 0.9;
  }

  .homepage.shadown-button-download {
    position: absolute;
    top: 0px;
    z-index: 0;
    left: -172px;
    background-image: var(--shadow-button-bg);
    min-height: 237px;
    min-width: 515px;
    background-size: contain;
    background-repeat: no-repeat;
  }

  /* 分隔线样式 */
  .sin {
    background-image: var(--sin-bg);
    background-repeat: repeat-x;
    width: 100%;
    min-height: 35px;
    background-size: auto 35px;
  }

  .sin-top {
    margin: 20px 0;
  }

  /* 标题和描述样式 */
  .homepage.title {
    font-size: 22px;
    font-family: 'Conv_FuturaStd-Light', Arial;
    text-align: center;
    line-height: 36pt;
    color: #68444d;
    word-wrap: break-word;
    overflow-wrap: break-word;
    display: block;
    margin-bottom: 20px;
  }

  /* 左侧英文标题与打字机字体统一 */
  .text-block-left .homepage.title {
    font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'Source Han Sans SC', Arial, sans-serif;
    font-weight: 400;
  }

  /* 桌面端中文标题字体优化 */
  .text-block-right .homepage.title {
    font-family: 'Noto Sans SC', 'PingFang SC', 'Microsoft YaHei', 'Noto Sans SC', 'Source Han Sans SC', Arial, sans-serif;
    font-weight: 400;
  }

  .homepage.description {
    font-size: 15px;
    font-family: 'Conv_FuturaStd-Medium', Arial;
    text-align: left;
    line-height: 18pt;
    color: #3c3738;
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;
    display: block;
  }

  /* 系统楷体样式 */
  .wenkai-font {
    font-family: 'KaiTi', 'STKaiti', 'Kaiti SC', '楷体', '楷体-简', 'AR PL UKai CN', serif;
  }

  /* Typewriter cursor */
  .typewriter {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .typewriter .caret {
    display: inline-block;
    width: 2px;
    height: 1.1em;
    background: #68444d;
    animation: blink 0.8s steps(1) infinite;
  }

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }


  /* 底部区域 */
  .bottom-sector {
    width: 100%;
    padding-bottom: 50px;
    position: relative;
    margin-top: 5px;
  }

  /* 主页下方内容 */
  .homepage.down {
    width: 100%;
    margin: 0 auto;
    min-height: auto;
    position: relative;
    padding-top: 0;
  }

  .homepage.down .line {
    width: 100%;
    min-height: 200px;
  }

  /* 文本块布局 */
  .text-blocks-line {
    width: 80%;
    max-width: calc(80% - 6px);
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    gap: 20px;
  }

  .text-block {
    width: 45%;
    text-align: left;
  }

  .text-block-left {
    float: left;
  }

  .text-block-right {
    float: right;
  }

  /* 分隔线包装器 */
  .separator-line-wrapper {
    padding-top: 0;
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
  }

  .sin-left {
    float: left;
    width: 29%;
  }

  .sin-middle {
    float: left;
    width: 40.7%;
    margin-top: -10px;
    padding-left: 12px;
  }

  .sin-right {
    float: right;
    width: 27%;
  }


  /* 清除浮动 */
  .homepage-content::after {
    content: '';
    display: table;
    clear: both;
  }

  /* 响应式设计 - 平板 */
  @media (max-width: 1024px) {
    .homepage.down .line {
      width: 90% !important;
    }

    .homepage.down .line div {
      width: 48%;
    }
  }

  /* 响应式设计 - 移动端 */
  @media (max-width: 768px) {
    .preview-page {
      padding: 20px 0;
    }

    .preview-container {
      padding: 0 v-bind('layoutConfig.contentPaddingMobile');
    }

    /* 触摸优化：增加点击区域 */
    button,
    a,
    .homepage.download-button {
      min-height: 44px;
      min-width: 44px;
    }

    /* Banner 移动端适配 */
    .preview-container :deep(.banner-wrapper) {
      margin: 0 auto;
    }

    .preview-container :deep(.banner-logo) {
      max-width: 320px;
    }

    /* 分隔线间距调整 */
    .sin {
      min-height: 25px;
      background-size: auto 25px;
      margin: 15px 0;
    }

    /* 第一部分：两个并排的文本块 - 移动端改为垂直堆叠 */
    .homepage.down {
      padding-top: 0;
      margin-bottom: 20px;
    }

    .text-blocks-line {
      width: 100% !important;
      flex-direction: column;
      gap: 30px;
      margin: 0 auto;
    }

    .text-block {
      width: 100% !important;
      float: none !important;
      margin: 0;
      padding: 0;
    }

    /* 分隔线2 - 移动端调整 */
    .separator-line-wrapper {
      margin-top: 20px !important;
      padding-top: 0 !important;
      flex-direction: column;
      gap: 10px;
    }

    .sin-left,
    .sin-right,
    .sin-middle {
      float: none !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .sin-middle {
      display: none;
      /* 移动端隐藏中间区域 */
    }

    /* 标题和描述字体大小调整 */
    .homepage.title {
      font-size: 24px;
      line-height: 30px;
      margin-bottom: 10px;
      display: block;
      text-align: center !important;
    }

    .homepage.description {
      font-size: 15px;
      line-height: 20px;
      display: block;
      margin-top: 0;
      text-align: center !important;
    }

    /* 确保文本块之间有足够的间距 */
    .text-block {
      margin-bottom: 25px;
      text-align: center !important;
    }

    .text-block:last-child {
      margin-bottom: 0;
    }

    /* Notes 和 Guestbook 组件移动端优化 */
    .preview-container :deep(.notes-section),
    .preview-container :deep(.comments-container) {
      margin: 10px 0;
    }

    /* 底部区域 */
    .bottom-sector {
      padding-bottom: 30px;
      margin-top: 15px;
    }

    .bottom-sector img {
      max-width: 100%;
      height: auto;
      display: block;
    }

    /* 确保所有图片响应式 */
    img {
      max-width: 100%;
      height: auto;
    }

    /* 下载按钮移动端适配 */
    .homepage.download-button {
      width: 80%;
      margin: 30px auto;
    }

    .homepage.download-button .image {
      width: 100%;
      max-width: 200px;
      height: 50px;
    }

    .homepage.download-button a {
      font-size: 16pt;
      line-height: 50px;
    }

    .homepage.shadown-button-download {
      display: none;
      /* 移动端隐藏阴影按钮 */
    }
  }

  /* 响应式设计 - 小屏手机 */
  @media (max-width: 480px) {
    .preview-page {
      padding: 15px 0;
    }

    .preview-container {
      padding: 0 10px;
    }

    /* Banner 小屏适配 */
    .preview-container :deep(.banner-logo) {
      max-width: 280px;
    }

    /* 标题和描述进一步缩小 */
    .homepage.title {
      font-size: 20px;
      line-height: 26px;
      margin-bottom: 8px;
      text-align: center !important;
    }

    .homepage.description {
      font-size: 14px;
      line-height: 18px;
      text-align: center !important;
    }

    /* 分隔线 */
    .sin {
      min-height: 20px;
      background-size: auto 20px;
      margin: 10px 0;
    }

    /* 下载按钮小屏适配 */
    .homepage.download-button {
      width: 90%;
    }

    .homepage.download-button .image {
      max-width: 180px;
      height: 45px;
    }

    .homepage.download-button a {
      font-size: 14pt;
      line-height: 45px;
    }

    /* Notes 和 Guestbook 组件小屏优化 */
    .preview-container :deep(.notes-section),
    .preview-container :deep(.comments-container) {
      margin: 10px 0;
    }

    /* 底部区域 */
    .bottom-sector {
      padding-bottom: 20px;
      margin-top: 10px;
    }
  }

  /* 响应式设计 - 超小屏 */
  @media (max-width: 360px) {
    .preview-container :deep(.banner-logo) {
      max-width: 180px;
    }

    .homepage.title {
      font-size: 18px;
      line-height: 24px;
      text-align: center !important;
    }

    .homepage.description {
      font-size: 15px;
      line-height: 16px;
      text-align: center !important;
    }
  }

  /* 横屏模式优化 */
  @media (max-width: 768px) and (orientation: landscape) {
    .preview-page {
      padding: 15px 0;
    }

    .preview-container :deep(.banner-logo) {
      max-width: 200px;
    }

    .text-blocks-line {
      flex-direction: row;
      gap: 20px;
    }

    .text-block {
      width: 48% !important;
    }
  }

  /* 滚动优化 */
  @media (max-width: 768px) {
    .preview-page {
      -webkit-overflow-scrolling: touch;
      overflow-x: hidden;
    }

    .homepage-content {
      overflow-x: hidden;
    }
  }
</style>
