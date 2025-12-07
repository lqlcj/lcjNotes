<template>
  <div class="notes-section">
    <div class="notes-bg-layer"></div>

    <div class="xhs-container" ref="containerRef">
      <!-- 使用可复用的页面标题组件 -->
      <PageHeader title="My Stories" subtitle="记录生活，探索代码" />

      <div class="waterfall-box">
        <div v-for="(item, index) in currentDisplayData" :key="item.id" 
          class="card glass-card pop-in"
          :style="{ animationDelay: `${index * 0.05}s` }" @click="handleClick(item)">
          <div class="card-img-wrapper" :style="{ paddingBottom: (1 / item.visualRatio * 100) + '%' }">
            <img :src="item.img" loading="lazy" :alt="item.title" />
            <div class="img-overlay">
              <div class="read-btn">
                <span>looklook</span>
              </div>
            </div>
          </div>

          <div class="card-content">
            <div class="title">{{ item.title }}</div>
            <div class="footer">
              <div class="user">
                <svg t="1764532787752" class="icon avatar" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4061" width="18" height="18">
                  <path d="M340.199558 709.421025c-40.296201 6.972462-89.828985 28.738894-119.447799 41.680402-13.631035-5.310392-28.924141-10.332623-44.628905-10.425246-30.966995-2.953648-59.047236 10.646513-71.201447 34.486673-10.836905 18.936281-14.382312 40.517467-10.363497 64.167236 5.99992 34.738814 27.57596 73.501588 64.259859 115.336362 49.779779 54.843176 101.823678 57.796824 136.72201 50.572221l1.502553-0.283015c0.061749 0 1.569447-0.411658 1.569447-0.411658 78.930332-25.594854 146.205588-75.158513 199.757186-147.373668l24.025407-32.315176-38.567236-11.999839c-34.39405-10.651658-73.367799-37.692462-89.767237-56.381749l-36.0201-49.913568c-0.535156-0.185246-17.840241 2.861025-17.840241 2.861025" fill="#231916" p-id="4062"></path>
                  <path d="M371.897246 774.452744c21.01001 24.689206 65.60804 53.994131 103.583518 65.741829-48.616844 65.330171-110.525106 112.820101-185.683618 137.102794-48.333829 9.895236-84.142955-13.636181-109.485669-41.495156-37.126432-42.339055-76.259698-103.557789-50.253186-147.342794 7.975879-15.987779 27.920724-21.107779 44.160644-19.378814 15.606995-0.535156 33.792 7.883256 47.613427 12.627618 29.649688-12.812864 83.29391-37.126432 123.307095-44.191517l26.757789 36.93604z" fill="#D8B77A" p-id="4063"></path>
                  <path d="M258.444221 938.966834v-0.092623 0.092623z m-71.798352-105.317628c-7.101106 4.898734-11.809447 12.406352-13.60016 21.987699-3.10802 16.23992 2.264121 36.591276 14.48008 54.369768 20.13009 29.58794 51.318352 42.277307 70.918432 28.960161 7.126834-4.775236 11.778573-12.406352 13.631035-22.111196 0.411658-2.294995 0.751276-4.55397 0.751277-6.946733 0.658653-14.948342-4.806111-32.006432-15.262231-47.392161-20.037467-29.526191-51.2-42.153809-70.918433-28.867538zM691.416121 719.959477c39.920563 9.262312 88.197789 33.550151 117.02416 48.025086 13.975799-4.584844 29.526191-8.799196 45.164061-8.042774 31.157387-1.317307 58.388583 13.728804 69.256362 38.227618 9.956985 19.60008 12.21596 41.243015 6.972462 64.54802-7.667136 34.424925-31.347779 71.865246-70.167156 111.754935-52.604784 52.265166-104.839075 52.357789-139.325749 43.311598l-1.440804-0.308744c-0.066894 0-1.507698-0.632925-1.507698-0.632925-77.453508-29.649688-142.027256-82.640402-191.745287-157.551919l-22.234693-33.704523 39.102392-9.920965c34.990955-8.799196 75.312884-33.606754 92.623115-51.575638l38.628985-47.932462c0.56603-0.092623 17.649849 3.802693 17.64985 3.802693" fill="#231916" p-id="4064"></path>
                  <path d="M656.317106 783.344563c-22.265568 23.526271-68.376442 50.32008-106.820181 60.117548 44.973668 67.846432 104.406834 118.480402 178.083377 146.68414 47.803819 12.627618 84.832482-9.046191 111.657165-35.618733 39.225889-40.39397 81.53407-99.286834 57.853427-144.389146-7.101106-16.584683-26.757789-22.646352-43.028582-21.766432-15.612141-1.44595-34.172784 6.092543-48.308101 10.20398-28.831518-14.44406-81.096683-41.680402-120.729085-50.850091l-28.713166 35.618734z" fill="#D8B77A" p-id="4065"></path>
                  <path d="M762.833688 877.135759c-10.836905 14.135317-17.083819 30.246593-17.778492 44.63405-0.092623 3.046271 0 5.99992 0.313889 8.917548 1.415075 9.67397 5.68603 17.526352 12.437227 22.677226 18.936281 14.356583 50.726593 3.334432 72.42613-24.967075 13.162774-17.186734 19.569206-37.255075 17.310231-53.680242-1.322452-9.704844-5.68603-17.464603-12.406351-22.553728-18.879678-14.48008-50.726593-3.391035-72.302634 24.972221z" fill="#D8B77A" p-id="4070"></path>
                </svg>
                <span class="username">{{ item.user }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="pagination fade-in-up">
        <button class="page-btn glass-btn" :disabled="currentPage === 1" @click="changePage(currentPage - 1)">←
          Prev</button>
        <span class="page-info">{{ currentPage }} / {{ totalPages }}</span>
        <button class="page-btn glass-btn" :disabled="currentPage === totalPages"
          @click="changePage(currentPage + 1)">Next →</button>
      </div>

      <div v-if="allData.length === 0" class="empty-tip glass-card">
        <p>📝 还没有文章</p>
        <p style="margin-top: 10px; font-size: 0.9rem; color: #999;">
          去 <a href="/login" style="color: #6c5ce7; text-decoration: none;">后台管理</a> 创建你的第一篇文章吧！
        </p>
      </div>
    </div>

    <!-- 文章阅读卡片 -->
    <ArticleModal :visible="modalVisible" :article-id="selectedArticleId" @close="closeModal" />
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, nextTick } from 'vue'
  import { useNotesStore } from '~/stores/notesStore'
  import PageHeader from '~/components/HeaderBar/PageHeader.vue'
  import ArticleModal from './ArticleModal.vue'

  // 使用 public 目录下的图片
  const defaultCover = '/images/loading.webp'
  const defaultAvatar = '/images/home/avatar.webp'

  const notesStore = useNotesStore()

  const containerRef = ref(null)
  const currentPage = ref(1)
  const PAGE_SIZE = 12
  
  // Modal 相关状态
  const modalVisible = ref(false)
  const selectedArticleId = ref(null)

  onMounted(() => {
    notesStore.initPosts()
  })

  const allData = computed(() => notesStore.allPosts)

  // 🔴 视觉逻辑：定义比例模式，制造瀑布流的错落感
  const ratioPattern = [0.75, 1.0, 0.75, 1.33, 0.6, 0.75, 1.0]

  const currentDisplayData = computed(() => {
    const start = (currentPage.value - 1) * PAGE_SIZE
    const end = start + PAGE_SIZE
    const pageData = allData.value.slice(start, end)

    return pageData.map((item, index) => {
      // 注入 visualRatio (如果数据源里没有，就按顺序派发一个)
      const visualRatio = item.aspectRatio || ratioPattern[index % ratioPattern.length]
      const avatar = item.avatar || defaultAvatar
      const img = item.img || defaultCover
      return { ...item, visualRatio, avatar, img }
    })
  })

  const totalPages = computed(() => Math.ceil(allData.value.length / PAGE_SIZE))

  const changePage = (page) => {
    if (page < 1 || page > totalPages.value) return
    currentPage.value = page
    
    // 滚动到 Notes 区域而不是页面顶部
    nextTick(() => {
      const notesSection = document.querySelector('.notes-section')
      if (notesSection) {
        const notesTop = notesSection.offsetTop - 100 // 减去100px作为偏移量
        window.scrollTo({
          top: notesTop,
          behavior: 'smooth'
        })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })
  }

  const handleClick = (item) => {
    // 打开 modal 显示文章
    selectedArticleId.value = item.id
    modalVisible.value = true
  }

  const closeModal = () => {
    modalVisible.value = false
    selectedArticleId.value = null
  }
</script>

<style scoped>
  .notes-section {
    position: relative;
    margin-top: 20px;
    padding: 40px 0;
  }

  .notes-bg-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    background: linear-gradient(135deg, #FFDDE1 0%, #E0C3FC 100%);
    opacity: 0.6;
    border-radius: 12px;
  }

  .xhs-container {
    width: 100%;
    max-width: 960px;
    margin: 0 auto;
    padding: 20px 10px 80px;
    box-sizing: border-box;
    position: relative;
  }

  /* 瀑布流布局 */
  .waterfall-box {
    column-count: 3;
    column-gap: 15px;
  }

  .card {
    break-inside: avoid;
    margin-bottom: 15px;
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid rgba(0, 0, 0, 0.02);
    -webkit-mask-image: -webkit-radial-gradient(white, black);
    mask-image: radial-gradient(circle, #fff, #000);
  }

  .glass-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
    z-index: 10;
  }

  /* 图片容器 */
  .card-img-wrapper {
    width: 100%;
    position: relative;
    background-color: #f5f5f5;
    overflow: hidden;
  }

  .card-img-wrapper img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .glass-card:hover .card-img-wrapper img {
    transform: scale(1.08);
  }

  .img-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .glass-card:hover .img-overlay {
    opacity: 1;
  }

  .read-btn {
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.9);
    padding: 6px 18px;
    border-radius: 20px;
    color: #fff;
    font-weight: 800;
    font-size: 0.8rem;
    letter-spacing: 1px;
  }

  .card-content {
    padding: 10px 12px;
  }

  .title {
    font-size: 0.95rem;
    color: #333;
    line-height: 1.4;
    margin-bottom: 8px;
    font-weight: 500;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .footer {
    display: flex;
    align-items: center;
    font-size: 0.75rem;
    color: #999;
  }

  .user {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .avatar {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
    display: inline-block;
    vertical-align: middle;
  }

  .username {
    max-width: 8em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  /* 动画和分页 */
  .pop-in {
    opacity: 0;
    animation: slideUpFade 0.6s ease-out forwards;
  }

  @keyframes slideUpFade {
    from {
      opacity: 0;
      transform: translateY(20px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    margin-top: 40px;
  }

  .glass-btn {
    padding: 8px 20px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    background: rgba(255, 255, 255, 0.5);
    backdrop-filter: blur(5px);
    border-radius: 50px;
    cursor: pointer;
    color: #555;
    transition: all 0.3s;
  }

  .glass-btn:hover:not(:disabled) {
    background: #fff;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    color: #6c5ce7;
  }

  .glass-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .page-info {
    font-family: monospace;
    color: #666;
    font-weight: bold;
  }

  .empty-tip {
    text-align: center;
    padding: 60px;
    color: #888;
    font-size: 1rem;
    margin-top: 20px;
    background: #fff;
    border-radius: 12px;
  }

  @media (max-width: 768px) {
    .waterfall-box {
      column-count: 2;
      column-gap: 10px;
    }

    .xhs-container {
      padding: 20px 5px;
    }
  }
</style>

