<template>
  <!-- ========== 个人信息卡片 ========== -->
  <!-- 功能：展示个人基本信息，包含3D视差效果和打字机动画 -->
  <div class="profile-card glass-panel" ref="cardRef" :style="cardStyle" @mouseleave="resetCard"
    @mousemove="handleMouseMove">
    <div class="card-content">
      <!-- 头像占位符 -->
      <div class="avatar-wrapper">
        <img :src="heroAvatar" alt="个人头像" class="avatar-img" />
      </div>

      <!-- 名字标题 -->
      <h1 class="name">Hello,I'm Lcj.</h1>

      <!-- 打字机效果：动态显示 -->
      <p class="role-text" v-html="displayText"></p>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, onBeforeUnmount, computed } from 'vue'
  // 使用 public 目录下的图片
  const heroAvatar = '/images/home/avatar.webp'

  // ========== 打字机效果逻辑 ==========
  // 功能：逐字显示文本，营造动态效果，循环显示两段文字2次
  const texts = [
    "欢迎来到我的小窝.",
    "全靠兴趣和情怀支撑的个人小站"
  ]
  const typedText = ref('')
  let currentTextIndex = 0
  let charIndex = 0
  let typeTimer = null
  let loopCount = 0
  const maxLoops = 2

  // 计算显示文本，将换行符转换为 <br> 并添加光标
  const displayText = computed(() => {
    return typedText.value.replace(/\n/g, '<br>') + '<span class="typing-cursor"></span>'
  })

  const typeWriter = () => {
    const currentText = texts[currentTextIndex]
    if (charIndex < currentText.length) {
      typedText.value += currentText.charAt(charIndex)
      charIndex++
      typeTimer = setTimeout(typeWriter, 100)
    } else {
      // 完成一段文字显示
      // 切换到下一段文字
      currentTextIndex++
      charIndex = 0

      // 如果还有下一段文字，等待1秒后继续显示（不清空，累积显示）
      if (currentTextIndex < texts.length) {
        // 添加换行符分隔两段文字
        typedText.value += '\n'
        typeTimer = setTimeout(typeWriter, 1000)
      } else {
        // 两段文字都显示完了，等待2秒后清空并重新开始循环
        loopCount++
        if (loopCount < maxLoops) {
          typeTimer = setTimeout(() => {
            typedText.value = ''
            currentTextIndex = 0
            charIndex = 0
            typeWriter()
          }, 2000)
        }
      }
    }
  }

  // ========== 3D 视差效果逻辑 ==========
  // 功能：根据鼠标位置实现卡片3D倾斜效果
  const mouseX = ref(0)
  const mouseY = ref(0)
  const cardRef = ref(null)

  const handleMouseMove = (e) => {
    if (!cardRef.value) return
    const rect = cardRef.value.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    mouseX.value = (x - rect.width / 2) / (rect.width / 2)
    mouseY.value = (y - rect.height / 2) / (rect.height / 2)
  }

  const cardStyle = computed(() => ({
    transform: `perspective(1000px) rotateX(${mouseY.value * -15}deg) rotateY(${mouseX.value * 15}deg)`,
    willChange: 'transform'
  }))

  const resetCard = () => {
    mouseX.value = 0
    mouseY.value = 0
  }

  onMounted(() => {
    // 启动打字机效果
    typeWriter()
  })
</script>

<style scoped>

  /* ========== 玻璃态基础样式 ========== */
  .glass-panel {
    background: #faf9f6;
    border: 1px solid #d4c5b0;
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.3s ease;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }

  .glass-panel:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border-color: #c4b5a0;
  }

  /* ========== 个人信息卡片样式 ========== */
  .profile-card {
    padding: 40px 30px;
    transition: transform 0.1s ease-out, filter 0.3s ease, box-shadow 0.3s ease;
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100%;
    transform-style: preserve-3d;
    position: relative;
  }

  .profile-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border-color: #c4b5a0;
  }

  .card-content {
    position: relative;
    z-index: 2;
  }

  .avatar-wrapper {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 20px;
    border: 2px solid rgba(44, 62, 80, 0.1);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  .avatar-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: 16px;
    filter: contrast(95%) brightness(105%) sepia(10%);
    transition: filter 0.3s ease;
  }

  .avatar-img:hover {
    filter: none;
  }

  .name {
    font-size: 2.4rem;
    font-weight: 400;
    margin: 0;
    color: #2c3e50;
    line-height: 1.1;
    letter-spacing: 2px;
    font-family: 'Caveat', 'Conv_FuturaStd-Book', cursive;
  }

  .role-text {
    font-size: 1.2rem;
    color: #666;
    margin: 10px 0 20px;
    font-family: monospace;
    line-height: 1.6;
    min-height: 60px;
  }

  .typing-cursor::after {
    content: '|';
    animation: blink 1s infinite;
  }

  @keyframes blink {
    50% {
      opacity: 0;
    }
  }

  /* ========== 响应式设计 ========== */
  @media (max-width: 768px) {
    .profile-card {
      padding: 30px 20px;
    }

    .name {
      font-size: 2.1rem;
    }

    .avatar-wrapper {
      width: 64px;
      height: 64px;
    }
  }

  /* 可访问性优化 */
  @media (prefers-reduced-motion: reduce) {

    .glass-panel,
    .profile-card {
      transition: none;
    }

    .glass-panel:hover,
    .profile-card:hover {
      transform: none;
    }
  }
</style>
