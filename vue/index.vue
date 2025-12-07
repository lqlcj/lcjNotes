<template>
  <div class="homepage-content" :style="styles">
    <!-- 顶部区域：标题和下载按钮 -->
    <div class="image-face"></div>
    <div class="text">
      <span class="homepage question">
        20,053,897 <span class="c">Free Songs</span><br />in 1 software
      </span>
    </div>
    <div class="homepage download-button">
      <div class="homepage shadown-button-download"></div>
      <a class="download-link-patch download_link" href="#" @click.prevent="handleDownload">
        <div class="image">
          Free Download
        </div>
      </a>
    </div>

    <div class="sin"></div>
    <br />
    <br />
    <br />

    <!-- 第一部分：两个并排的文本块 -->
    <div class="homepage down">
      <div class="line" style="width: 80%; margin: 0px auto;">
        <div style="float: left">
          <span class="homepage title">Legal Music Download</span><br /><br />
          <span class="homepage description">
            Music tracks are all legal and available for free download. MP3jam does not use torrents, p2p algorithms or
            pirate sites and only searches for music in public access. This free music software delivers best MP3s
            hosted
            by YouTube.
          </span>
        </div>
        <div style="float: right">
          <span class="homepage title">Impressive MP3 Library</span><br /><br />
          <span class="homepage description">
            Over 20 Million audio tracks are at your daily disposal. Find any song, artist, or album and start MP3
            download at once. No registration, no captchas, absolutely obligation-free!
          </span>
        </div>
      </div>

      <!-- 社交媒体按钮区域 -->
      <div style="padding-top: 20px;">
        <div class="sin" style="float: left; width: 29%"></div>
        <div style="float: left; width: 40.7%; margin-top: -10px; padding-left: 12px">
          <div class="social_button" style="position: relative; left: 1%">
            <slot name="social-buttons">
              <!-- 默认插槽，可以在外部自定义社交媒体按钮 -->
            </slot>
          </div>
        </div>
        <div class="sin" style="float: right; width: 27%"></div>
      </div>
    </div>

    <br />

    <!-- 右侧图片 -->
    <div class="top1-image">
      <img :src="mp3jamImg" alt="MP3jam" />
    </div>

    <!-- 阴影内容区域：三个特性展示 -->
    <div class="shadow">
      <img :src="rightRadiusImg" style="margin-left: 1px" alt="" />
      <div class="shadow-content">
        <div class="unique-shadow"></div>
        <div class="unique"></div>

        <!-- 特性1：Full Album Downloads -->
        <div class="line">
          <div class="img">
            <img :src="img1" alt="" />
          </div>
          <div class="img-texet" style="text-align: left; margin-top: -2px; padding-left: 57px">
            <span class="homepage title">Full Album Downloads</span><br /><br />
            <span class="homepage description">
              No other tool organizes music hosted by YouTube in albums! MP3jam has a one-click option to download the
              entire MP3 album that contains your favorite song.
            </span>
          </div>
        </div>

        <!-- 特性2：MP3 Download on the Fly -->
        <div class="line" style="padding-left: 95px">
          <div class="img" style="margin-top: -35px">
            <img :src="img2" alt="" />
          </div>
          <div class="img-texet" style="text-align: left; margin-top: -87px; padding-left: 40px">
            <span class="homepage title">MP3 Download on the Fly</span><br /><br />
            <span class="homepage description">
              MP3jam downloads music in MP3 format. It means you can further transfer downloaded music to iPod, iPhone,
              Android, MP3 player or PC. Converting music video to MP3 is no longer necessary!
            </span>
          </div>
        </div>

        <!-- 特性3：Smart Music Search -->
        <div class="line" style="padding-left: 60px; margin-top: -73px">
          <div class="img" style="padding-left: 113px; margin-top: -62px">
            <img :src="searchImg" alt="" />
          </div>
          <div class="img-texet" style="text-align: left; margin-top: -112px; margin-left: -30px">
            <span class="homepage title">Smart Music Search</span><br /><br />
            <span class="homepage description">
              Find free mp3 songs by your favourite artists with 99% accuracy using the smart music search feature. All
              tracks are sorted by newest and most popular. Best free music guaranteed!
            </span>
          </div>
        </div>
      </div>
      <img class="shadow-off" :src="mp3jamBottomImg" alt="" />
    </div>

    <!-- 底部区域 -->
    <div class="bottom-sector">
      <div class="bottom-sector2">
        <div class="fix">
          <span class="homepage title">All-in-one Music Jukebox</span><br /><br />
          <span class="homepage description">
            Search, preview and download music in one place. Listen to saved tracks from the download history. MP3jam is
            organized in such an easy way that even your grandma can download MP3 now!
          </span>
        </div>
      </div>

      <div class="bottom-radius">
        <img :src="bottomRadiusImg" alt="" />
      </div>

      <!-- 更多特性展示 -->
      <div class="homepage down">
        <div class="line" style="width: 80%; margin: 0px auto; margin-top: -58px">
          <div style="float: left">
            <span class="homepage title">Fast Music Download</span><br /><br />
            <span class="homepage description">
              Enjoy free MP3 download at record speed due to MP3jam multi-thread download technology. Just a few seconds
              to download a song, several minutes to save a whole album!
            </span>
          </div>
          <div style="float: right">
            <span class="homepage title">High-quality MP3s</span><br /><br />
            <span class="homepage description">
              Download MP3 at highest quality (up to 320 kbps) for free. The software automatically searches for the
              highest audio bitrate available and provides only the best search results.
            </span>
          </div>
        </div>

        <div class="line" style="margin-top: 40px; width: 80%; margin: 0px auto">
          <div style="float: left">
            <span class="homepage title">Discover Artists by Genre</span><br /><br />
            <span class="homepage description">
              Find new music by genre and explore artists that are popular today. Download music albums of recommended
              singers and bands. Listen to rock, pop, electronic, jazz, indie, r&b and much more.
            </span>
          </div>
          <div style="float: right">
            <span class="homepage title">Sharing in Social Networks</span><br /><br />
            <span class="homepage description">
              Share your favourite music tracks in social networks. Post to Facebook and Twitter straight from the music
              software. Your friends find out your favourite music right away and can download it themselves.
            </span>
          </div>
        </div>
      </div>

      <!-- 第二个下载按钮 -->
      <div class="homepage download-button" style="margin-top: -41%; margin-bottom: -15%">
        <div class="homepage shadown-button-download"></div>
        <a class="download-link-patch download_link" href="#" @click.prevent="handleDownload">
          <div class="image">
            Free Download
          </div>
        </a>
      </div>

      <img :src="homeRightRadiusImg" style="margin-left: 2px" alt="" />

      <!-- Facebook 插件区域 -->
      <div class="stuff">
        <div class="title">
          <img :src="smallSinImg" width="265px" style="vertical-align: middle" alt="" />
          <span class="text">Join Us on Facebook</span>
          <img :src="smallSinImg" width="265px" style="vertical-align: middle" alt="" />
        </div>

        <div style="width: 80%; height: 568px; margin: 0px auto">
          <slot name="facebook-plugin">
            <!-- 默认插槽，可以在外部自定义 Facebook 插件 -->
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { defineEmits, computed } from 'vue'

  // 导入所有图片资源
  import mp3jamImg from './images/home/mp3jam.png'
  import rightRadiusImg from './images/right-radius.png'
  import img1 from './images/img1.png'
  import img2 from './images/page2/img2.png'
  import searchImg from './images/home/search.png'
  import mp3jamBottomImg from './images/page4/mp3jam_bottom.png'
  import bottomRadiusImg from './images/bottom-radius.png'
  import homeRightRadiusImg from './images/home/right-radius.png'
  import smallSinImg from './images/small-sin.png'
  import sinImg from './images/sin.png'
  import uniqueImg from './images/unique.png'
  import uniqueShadowImg from './images/unique-shadow.png'
  import buttonImg from './images/home/button.png'
  import shadowButtonImg from './images/home/shadow-button-download.png'

  // 定义事件
  const emit = defineEmits(['download'])

  // 处理下载按钮点击
  const handleDownload = () => {
    emit('download')
  }

  // 计算样式对象，用于动态绑定背景图
  const styles = computed(() => ({
    '--sin-bg': `url(${sinImg})`,
    '--button-bg': `url(${buttonImg})`,
    '--shadow-button-bg': `url(${shadowButtonImg})`,
    '--unique-bg': `url(${uniqueImg})`,
    '--unique-shadow-bg': `url(${uniqueShadowImg})`
  }))
</script>

<style scoped>

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

  .content .question {
    font-family: 'Conv_FuturaStd-Book', Arial;
    font-size: 43pt;
    color: #49414c;
    line-height: 51pt;
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
    padding-top: 55px;
  }

  /* 下载按钮样式 */
  .homepage.download-button {
    margin: 40px auto;
    position: relative;
    width: 26%;
    padding-bottom: 15px;
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

  /* 标题和描述样式 */
  .title {
    font-family: 'Conv_FuturaStd-Light', Arial;
    font-size: 29pt;
    text-align: left;
    line-height: 36pt;
    color: #68444d;
  }

  .description {
    font-family: 'Conv_FuturaStd-Medium', Arial;
    font-size: 12pt;
    text-align: left;
    line-height: 18pt;
    color: #3c3738;
  }

  .homepage.title {
    font-size: 34px;
    font-family: 'Conv_FuturaStd-Light', Arial;
    text-align: left;
    line-height: 36pt;
    color: #68444d;
  }

  .homepage.description {
    font-size: 14px;
    font-family: 'Conv_FuturaStd-Medium', Arial;
    text-align: left;
    line-height: 18pt;
    color: #3c3738;
  }

  /* 右侧图片 */
  .top1-image {
    float: right;
    min-width: 50%;
    margin-top: -45px;
    text-align: right;
    padding-bottom: 194px;
    margin-top: -54%;
    padding-right: 38px;
  }

  /* 阴影内容区域 */
  .shadow {
    width: 100%;
    position: relative;
    top: -450px;
  }

  .shadow-content {
    min-width: 95%;
    margin-top: -430px;
    position: relative;
  }

  .shadow-content .img {
    float: left;
  }

  .shadow-content .line {
    padding-top: 103px;
    padding-left: 17px;
    height: 218px;
    position: relative;
    min-width: 95%;
  }

  .line .img {
    max-width: 29%;
    padding-left: 80px;
  }

  .img-texet {
    float: left;
    text-align: left;
    width: 50%;
    padding-left: 77px;
    padding-top: 49px;
  }

  .shadow-off {
    padding-right: 2px;
    margin-top: -255px;
    margin-bottom: -285px;
  }

  .shadow-content .unique {
    height: 53px;
    width: 110px;
    position: absolute;
    margin-top: 63px;
    right: 143px;
    background-image: var(--unique-bg);
    background-size: contain;
    background-repeat: no-repeat;
  }

  .shadow-content .unique-shadow {
    position: absolute;
    z-index: 0;
    top: 74px;
    right: 156px;
    background-image: var(--unique-shadow-bg);
    min-height: 187px;
    min-width: 272px;
    background-size: contain;
    background-repeat: no-repeat;
  }

  /* 底部区域 */
  .bottom-sector {
    width: 100%;
    padding-bottom: 170px;
    position: relative;
    margin-top: -325px;
  }

  .bottom-sector2 {
    width: 54%;
    padding-bottom: 353px;
    width: 66%;
    margin: 0px auto;
    position: relative;
  }

  .fix {
    width: 100%;
    position: absolute;
    height: 220px;
  }

  .bottom-radius {
    margin-top: -263px;
    margin-left: 3px;
  }

  /* 主页下方内容 */
  .homepage.down {
    width: 100%;
    margin: -10% auto;
    min-height: 460px;
    position: relative;
    padding-top: 50px;
    padding-bottom: 370px;
  }

  .homepage.down .line {
    width: 100%;
    min-height: 200px;
  }

  .homepage.down .line div {
    width: 45%;
    text-align: left;
  }

  /* Facebook 区域 */
  .stuff {
    position: relative;
    margin-top: -185px;
    margin-bottom: -90px;
    width: 100%;
  }

  .stuff .title .text {
    vertical-align: middle;
    font-family: 'Conv_FuturaStd-Light', Arial;
    font-size: 22pt;
    line-height: 47pt;
    color: #68525b;
    padding-right: 30px;
    padding-left: 30px;
  }

  /* 清除浮动 */
  .homepage-content::after {
    content: '';
    display: table;
    clear: both;
  }
</style>
