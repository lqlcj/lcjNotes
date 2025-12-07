<!-- 
  功能卡片网格组件
  功能：展示网站主要功能入口（文章、朋友圈、留言等），包含动画效果和交互
-->

<template>
  <div class="profile-container">
    <!-- ========== 个人信息卡片 ========== -->
    <PersonalInfo />

    <!-- ========== 功能卡片网格 ========== -->
    <!-- 功能：展示网站主要功能入口，包含动画效果和交互 -->
    <div class="dashboard-grid">
      <!-- 文章卡片 -->
      <div class="grid-card glass-panel pointer delay-1" :class="{ 'is-activating': activeCard === 'notes' }"
        @click="handleCardClick('notes', () => navigateTo('/home'))">
        <div class="icon-wrapper">
          <div class="icon-box">
            <svg class="notes-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" width="200"
              height="200">
              <path
                d="M60.19565 418.559608a31.99997 31.99997 0 0 0 31.99997-31.99997v-52.479951a31.99997 31.99997 0 0 0-63.99994 0v52.479951a31.99997 31.99997 0 0 0 31.99997 31.99997z"
                fill="#6B400D"></path>
              <path
                d="M993.954775 518.079514a31.99997 31.99997 0 0 0-14.719987-19.519981l-111.039895-63.99994a31.99997 31.99997 0 0 0-43.51996 11.519989L796.19496 495.359536V127.99988a95.99991 95.99991 0 0 0-95.99991-95.99991h-63.99994a31.99997 31.99997 0 0 0-31.99997-31.99997H220.1955a31.99997 31.99997 0 0 0-31.99997 31.99997H124.19559a95.99991 95.99991 0 0 0-95.99991 95.99991v69.439935a31.99997 31.99997 0 0 0 63.99994 0V127.99988a31.99997 31.99997 0 0 1 31.99997-31.99997h63.99994v15.999985a63.99994 63.99994 0 0 0 63.99994 63.99994h319.9997a63.99994 63.99994 0 0 0 63.99994-63.99994V95.99991h63.99994a31.99997 31.99997 0 0 1 31.99997 31.99997v478.079552l-155.519854 269.759747A29.759972 29.759972 0 0 0 572.19517 895.99916l9.919991 63.99994H124.19559a31.99997 31.99997 0 0 1-31.99997-31.99997V530.559503a31.99997 31.99997 0 0 0-63.99994 0V927.99913a95.99991 95.99991 0 0 0 95.99991 95.99991h495.999535a29.439972 29.439972 0 0 0 11.519989-2.239998l95.99991-36.159966a31.99997 31.99997 0 0 0 16.319985-13.759987l191.99982-332.799688 55.999947-95.99991a30.079972 30.079972 0 0 0 1.919999-24.959977zM252.19547 111.999895V63.99994h319.9997v47.999955z m611.839426 393.919631l55.359949 31.99997-23.999978 41.599961-49.279954-28.479974-6.079994-3.519996z m-170.879839 423.999602l-47.359956 18.239983-7.999992-50.239953 170.23984-295.039723 27.839974 15.999985 27.519974 15.999985z"
                fill="#6B400D"></path>
              <path
                d="M636.19511 563.199472V287.99973a31.99997 31.99997 0 0 0-31.99997-31.99997H220.1955a31.99997 31.99997 0 0 0-31.99997 31.99997v543.99949a31.99997 31.99997 0 0 0 31.99997 31.99997h215.359798a63.99994 63.99994 0 0 0 55.359948-31.99997l136.639872-236.799778a63.99994 63.99994 0 0 0 8.639992-31.99997z"
                fill="#FFC824"></path>
            </svg>
          </div>
        </div>
        <div class="card-info">
          <h3>文章</h3>
          <p class="sub-text">写的一些东西</p>
        </div>
        <div class="hover-arrow">↗</div>
      </div>

      <!-- 朋友圈卡片 -->
      <div class="grid-card glass-panel pointer delay-2" :class="{ 'is-activating': activeCard === 'friends' }"
        @click="handleCardClick('friends', () => navigateTo('/friends'))">
        <div class="icon-wrapper">
          <div class="icon-box">
            <svg class="friends-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              width="200" height="200">
              <path
                d="M381.8288 18.901489c42.635029-11.310603 86.403882-17.002232 130.205481-17.002232 68.479651 0 135.072325 13.469779 197.999516 40.101323l-8.362458 369.71439L381.8288 18.901489 381.8288 18.901489z"
                fill="#F57659"></path>
              <path
                d="M71.201134 255.390621c22.278399-38.284955 49.218982-73.313749 80.134085-104.090707 48.393173-48.396243 104.980983-85.958744 168.285774-111.666242l255.614725 267.305999L71.201134 255.390621 71.201134 255.390621z"
                fill="#F0B360"></path>
              <path
                d="M18.900977 642.275066c-11.276834-42.463114-17.000186-86.234013-17.000186-130.276089 0-68.548212 13.502525-135.140886 40.099277-197.933001l369.749182 8.293897L18.900977 642.275066 18.900977 642.275066z"
                fill="#EFDE58"></path>
              <path
                d="M255.39011 952.798355c-38.010709-22.1423-72.968895-49.079812-104.021122-80.134085-48.428989-48.325635-85.993536-104.911398-111.664196-168.283728l267.302929-255.513418L255.39011 952.798355 255.39011 952.798355z"
                fill="#BBEF5C"></path>
              <path
                d="M512.034281 1022.100744c-68.481697 0-135.072325-13.470803-197.999516-40.031738l8.362458-369.71439 319.843562 392.81348C599.535147 1016.411161 555.80211 1022.100744 512.034281 1022.100744L512.034281 1022.100744z"
                fill="#61F15E"></path>
              <path
                d="M448.830797 717.096145l504.036631 51.54905c-22.107507 37.940101-48.976458 72.900334-80.167854 104.019075-48.327682 48.464805-104.980983 86.029352-168.283728 111.734804L448.830797 717.096145 448.830797 717.096145z"
                fill="#5BE4EE"></path>
              <path
                d="M612.320335 701.707666l392.81348-319.915193c11.276834 42.499953 16.966417 86.302575 16.966417 130.206504 0 68.753897-13.502525 135.282103-40.066531 198.002586L612.320335 701.707666 612.320335 701.707666z"
                fill="#5C9BF6"></path>
              <path
                d="M768.60989 71.235414c37.975916 22.038946 73.004711 48.942689 104.089683 80.0645 48.464805 48.326659 86.027305 104.980983 111.664196 168.284751l-267.302929 255.580956L768.60989 71.235414 768.60989 71.235414z"
                fill="#6D58F1"></path>
            </svg>
          </div>
        </div>
        <div class="card-info">
          <h3>朋友圈</h3>
          <p class="sub-text">分享生活点滴</p>
        </div>
        <div class="hover-arrow">↗</div>
      </div>

      <!-- 留言卡片 -->
      <div class="grid-card glass-panel pointer delay-3" :class="{ 'is-activating': activeCard === 'comments' }"
        @click="handleCardClick('comments', () => emit('scroll-to-comments'))">
        <div class="icon-wrapper">
          <div class="icon-box">
            <svg class="comments-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
              width="200" height="200">
              <path
                d="M696.3 854.6c16.2 14.2 41.6 2.7 41.6-18.9V715.3h125.5c41.6 0 75.3-33.7 75.3-75.3V355.1H374c-41.6 0-75.3 33.7-75.3 75.3v284.9h238.4l159.2 139.3z"
                fill="#F4C708"></path>
              <path
                d="M712.6 882.2c-11 0-21.7-3.9-30.4-11.6l-153.1-134H160.6c-53.3 0-96.6-43.4-96.6-96.6V238.4c0-53.3 43.4-96.6 96.6-96.6h702.8c53.3 0 96.6 43.4 96.6 96.6V640c0 53.3-43.4 96.6-96.6 96.6H759.2v99c0 18.5-10.4 34.6-27.3 42.3-6.2 2.9-12.8 4.3-19.3 4.3z m-552-697.7c-29.8 0-54 24.2-54 54V640c0 29.8 24.2 54 54 54h376.5c5.2 0 10.2 1.9 14 5.3l159.2 139.3c0.5 0.4 1.8 1.7 4 0.6 2.2-1 2.2-2.8 2.2-3.4V715.3c0-11.8 9.5-21.3 21.3-21.3h125.5c29.8 0 54-24.2 54-54V238.4c0-29.8-24.2-54-54-54H160.6z"
                fill="#111111"></path>
              <path d="M499.5 426.7m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#111111"></path>
              <path d="M742.9 426.7m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#111111"></path>
              <path d="M277.3 426.7m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#111111"></path>
            </svg>
          </div>
        </div>
        <div class="card-info">
          <h3>留言</h3>
          <p class="sub-text">说点什么吧</p>
        </div>
        <div class="hover-arrow">↗</div>
      </div>

      <!-- 年度进度条卡片 -->
      <YearProgress />
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue'
  import PersonalInfo from './PersonalInfo.vue'
  import YearProgress from './YearProgress.vue'
  const emit = defineEmits(['scroll-to-comments'])
  const activeCard = ref(null)

  /**
   * 统一的卡片点击动效：先触发微交互，再执行对应动作
   */
  const handleCardClick = (key, callback) => {
    if (activeCard.value) return
    activeCard.value = key
    setTimeout(() => {
      callback?.()
      activeCard.value = null
    }, 220)
  }

</script>

<style scoped>

  /* ========== 容器布局 ========== */
  .profile-container {
    display: grid;
    grid-template-columns: 0.9fr 1fr;
    gap: 24px;
    width: 100%;
    padding: 0 15px;
  }

  /* ========== 玻璃态基础样式（参考 InfoCards） ========== */
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

  /* ========== 功能卡片网格样式 ========== */
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .grid-card {
    padding: 24px;
    position: relative;
    transition: all 0.3s ease;
    cursor: pointer;
    overflow: hidden;
  }

  .grid-card.is-activating {
    animation: card-press 0.35s ease forwards;
  }

  .grid-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    border-color: #c4b5a0;
  }

  @keyframes card-press {
    0% {
      transform: translateY(0) scale(1);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    50% {
      transform: translateY(4px) scale(0.97);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    }

    100% {
      transform: translateY(0) scale(1);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
  }

  .pointer {
    cursor: pointer;
  }

  .icon-wrapper {
    margin-bottom: 12px;
  }

  .icon-box {
    font-size: 2.5rem;
    display: inline-block;
    transition: transform 0.3s ease;
  }

  .friends-icon,
  .notes-icon,
  .comments-icon {
    width: 2.5rem;
    height: 2.5rem;
    display: block;
    transition: transform 0.3s ease;
  }

  .grid-card:hover .icon-box {
    transform: scale(1.1) rotate(5deg);
  }

  .grid-card:hover .friends-icon,
  .grid-card:hover .notes-icon,
  .grid-card:hover .comments-icon {
    transform: scale(1.1) rotate(5deg);
  }

  .card-info h3 {
    font-size: 1.3rem;
    font-weight: 600;
    color: #2c3e50;
    margin: 0 0 6px 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  .sub-text {
    font-size: 0.85rem;
    color: #666;
    margin: 0;
    font-weight: 400;
  }

  .hover-arrow {
    position: absolute;
    top: 20px;
    right: 20px;
    font-size: 1.2rem;
    opacity: 0;
    transition: opacity 0.3s ease;
    color: #2c3e50;
  }

  .grid-card:hover .hover-arrow {
    opacity: 1;
  }

  /* ========== 进场动画 ========== */
  .delay-1 {
    animation: fadeInUp 0.6s ease 0.1s both;
  }

  .delay-2 {
    animation: fadeInUp 0.6s ease 0.2s both;
  }

  .delay-3 {
    animation: fadeInUp 0.6s ease 0.3s both;
  }


  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  /* ========== 响应式设计 ========== */
  @media (max-width: 768px) {
    .profile-container {
      grid-template-columns: 1fr;
      gap: 20px;
      padding: 0 15px;
    }

    .dashboard-grid {
      grid-template-columns: 1fr;
    }
  }

  /* 可访问性优化 */
  @media (prefers-reduced-motion: reduce) {

    .glass-panel,
    .grid-card {
      transition: none;
    }

    .glass-panel:hover,
    .grid-card:hover {
      transform: none;
    }

    .icon-box {
      transition: none;
    }

    .grid-card:hover .icon-box {
      transform: none;
    }
  }
</style>
