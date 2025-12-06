<template>
  <footer class="footer-container">


    <div class="footer-content">

      <div class="left-section">
        <p class="welcome-text">
          欢迎 <a href="https://github.com/lqlcj" target="_blank" class="highlight-link">Report Copyrighted</a>
        </p>

        <div class="links-row">
          <a href="#" target="_blank">Privacy policy</a>
          <a href="#" target="_blank">About</a>
        </div>
      </div>

      <HomeBanner class="home-banner-container" />

      <div class="right-section">
        <div class="social-row">
          <!-- <a href="#" target="_blank" class="social-btn facebook">FACEBOOK</a> -->
          <a href="https://twitter.com/Cli13146688" target="_blank" class="social-btn twitter">TWITTER</a>
        </div>

        <span class="copyright">LCJLQ.COM.2025</span>
      </div>

    </div>

    <!-- 版权声明 -->
    <div class="copyright-section">
      <p class="copyright-text">
        © Copyright 2019-2025 『Leyili』 All rights reserved.
        <a href="https://icp.gov.moe/?keyword=20252209" target="_blank" class="icp-link">萌ICP备20252209号</a>
      </p>
    </div>
  </footer>
</template>

<script setup>
  import HomeBanner from '~/pages/home/components/HomeBanner.vue'

</script>

<style scoped>

  /* --- 容器基础设置 --- */
  .footer-container {
    width: 100%;
    padding: 45px 20px 60px;
    /* 上 左右 下 */
    background-color: transparent;
    /* 如果有背景色可以在这里加 */
  }

  /* 限制最大宽度的内容框，居中显示 */
  .footer-content {
    max-width: 1100px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    /* 左右两端对齐 */
    align-items: flex-end;
    /* 底部对齐 */
    flex-wrap: wrap;
    /* 允许换行，防止挤压 */
    gap: 40px;
    /* 左右两块之间的间距 */
  }

  .home-banner-container {
    width: 30%;
  }



  /* --- 左侧区域 --- */
  .left-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
    /* 文字和链接行之间的间距 */
    text-align: left;
  }

  .welcome-text {
    font-family: 'Conv_FuturaStd-Medium', Arial, sans-serif;
    font-size: 14px;
    /* 10pt ≈ 13-14px */
    line-height: 1.6;
    color: #68525B;
    margin: 0;
  }

  .highlight-link {
    color: #68525B;
    text-decoration: underline;
  }

  .links-row {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    /* 替代原来的 style="margin-left: 30px" */
  }

  .links-row a {
    font-family: 'Conv_FuturaStd-Medium', Arial, sans-serif;
    font-size: 14px;
    color: #68525B;
    text-decoration: none;
    transition: color 0.3s;
  }

  .links-row a:hover {
    color: #D94851;
    /* 增加一点交互反馈 */
  }

  .home-banner-container {
    width: 25%;
  }

  /* --- 右侧区域 --- */
  .right-section {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    /* 靠右对齐 */
    gap: 15px;
  }

  /* 社交媒体行 */
  .social-row {
    display: flex;
    gap: 10px;
  }

  .social-btn {
    display: inline-block;
    height: 27px;
    line-height: 27px;
    /* 垂直居中 */
    background-color: #4FBBCC;
    color: #FFFFFF;
    font-family: 'Conv_FuturaStd-Book', Arial, sans-serif;
    font-size: 13px;
    padding: 0 10px;
    letter-spacing: 2px;
    text-decoration: none;
    transition: background-color 0.3s;
  }

  .social-btn:hover {
    background-color: #D94851;
  }

  /* 版权号 */
  .copyright {
    font-family: 'Conv_FuturaStd-Medium', Arial, sans-serif;
    font-size: 14px;
    color: #68525B;
    letter-spacing: 2px;
  }

  /* 版权声明区域 */
  .copyright-section {
    max-width: 1100px;
    margin: 30px auto 0;
    text-align: center;
    padding-top: 20px;
    border-top: 1px solid rgba(104, 82, 91, 0.2);
  }

  .copyright-text {
    font-family: 'Conv_FuturaStd-Medium', Arial, sans-serif;
    font-size: 14px;
    color: #68525B;
    margin: 0;
    white-space: nowrap;
    letter-spacing: 1px;
  }

  .icp-link {
    margin-left: 12px;
    color: #68525B;
    text-decoration: none;
    transition: color 0.3s;
  }

  .icp-link:hover {
    color: #D94851;
    text-decoration: underline;
  }

  /* --- 📱 手机端适配 (Media Query) --- */
  @media (max-width: 768px) {
    .footer-content {
      flex-direction: column;
      /* 改为垂直排列 */
      align-items: center;
      /* 整体居中 */
      text-align: center;
      gap: 30px;
    }

    .home-banner-container {
      width: 50%;
    }

    .left-section {
      align-items: center;
      /* 左侧文字居中 */
      text-align: center;
    }

    .links-row {
      justify-content: center;
      /* 链接居中 */
      gap: 20px;
      /* 手机上间距稍微小一点 */
    }

    .right-section {
      align-items: center;
      /* 右侧内容也居中 */
    }

    .copyright-section {
      margin-top: 20px;
      padding-top: 15px;
    }

    .copyright-text {
      font-size: 12px;
      white-space: normal;
      /* 移动端允许换行 */
    }

    .icp-link {
      margin-left: 8px;
      display: inline-block;
    }
  }
</style>

