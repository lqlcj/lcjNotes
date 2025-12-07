# ♥Leyili - 个人博客

一个基于 Nuxt 3 构建的现代化个人博客系统，采用玻璃态设计风格，支持 Markdown 文章、留言系统、友链交换等功能。

## ✨ 特性

- 🎨 **现代化设计** - 玻璃态（Glassmorphism）设计风格，优雅的视觉效果
- 📝 **Markdown 支持** - 使用 Markdown 编写博客文章，支持 Front Matter
- 💬 **留言系统** - 集成 Giscus，基于 GitHub Discussions 的留言功能
- 🔗 **友链交换** - 无后端友链申请系统，通过 GitHub Issues 管理
- 📱 **响应式设计** - 完美适配桌面端和移动端
- ⚡ **性能优化** - 代码分割、懒加载、图片优化
- 🎭 **动画效果** - 使用 GSAP 和 CSS 动画，流畅的交互体验
- 🎉 **彩蛋功能** - 生日彩蛋、返回顶部等趣味功能

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看效果。

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

### 生成静态站点

```bash
npm run generate
```

## 📁 项目结构

```
newblog/
├── app.vue                 # 应用根组件
├── nuxt.config.ts          # Nuxt 配置文件
├── package.json            # 项目依赖
│
├── public/                 # 公共静态资源
│   ├── images/            # 图片资源
│   │   ├── background-body.webp
│   │   ├── carousel/      # 轮播图
│   │   └── home/          # 首页图片
│   ├── styles/            # 样式文件
│   │   ├── fonts.css      # 字体定义
│   │   └── styles.css     # 全局样式
│   └── fonts/             # 字体文件
│
├── components/            # Vue 组件
│   ├── BackToTop/        # 返回顶部组件
│   ├── Comments/         # 留言组件（Giscus）
│   ├── Common/           # 通用组件
│   │   ├── OutlineButton.vue
│   │   └── PageLoading.vue
│   ├── ErrorBoundary/    # 错误边界组件
│   ├── Friends/          # 友链相关组件
│   │   ├── FriendRequestForm.vue
│   │   ├── FriendsList.vue
│   │   ├── FriendsSection.vue
│   │   └── README.md
│   ├── HeaderBar/        # 页面标题组件
│   ├── Layouts/         # 布局组件
│   │   ├── Footer.vue
│   │   └── Header.vue
│   └── Moments/         # 动态组件
│
├── composables/          # 组合式函数
│   └── useConfetti.js   # 彩蛋功能
│
├── config/              # 配置文件
│   ├── giscus.js       # Giscus 留言系统配置
│   └── layout.js       # 布局配置
│
├── data/               # 数据文件
│   └── friends.json   # 友链数据（可选，已迁移到 KV）
│
├── pages/              # 页面路由
│   ├── index.vue      # 首页（欢迎页）
│   ├── home.vue       # 主页
│   ├── about.vue      # 关于页面
│   ├── friends.vue    # 友链页面
│   ├── notes.vue      # 笔记列表页
│   ├── post.vue       # 文章详情页
│   └── home/          # 主页子组件
│       └── components/
│           ├── Greeting.vue
│           ├── HomeBanner.vue
│           ├── HomeProfile.vue
│           ├── ImpressionCarousel.vue
│           ├── InfoCards.vue
│           ├── PersonalInfo.vue
│           └── YearProgress.vue
│
├── plugins/            # 插件
│   └── loading.client.js
│
├── public/            # 公共静态文件
│   ├── favicon.ico
│   ├── fonts/         # 字体文件
│   └── images/        # 公共图片
│
├── stores/            # Pinia 状态管理
│   ├── loadingStore.js
│   └── notesStore.js
│
└── utils/             # 工具函数
    └── githubApi.js   # GitHub API 工具
```

## 📝 使用指南

### 添加博客文章

1. 访问 `/login` 页面并登录管理员账号
2. 在"文章管理"标签页中点击"新建文章"
3. 填写文章信息（标题、日期、封面、内容等）
4. 文章会自动保存到云端并显示在笔记列表页（`/notes`）

### 配置 Giscus 留言系统

编辑 `config/giscus.js`：

```javascript
export const giscusConfig = {
  repo: "your-username/your-repo",        // GitHub 仓库
  repoId: "your-repo-id",                  // 仓库 ID
  category: "Announcements",               // 分类
  categoryId: "your-category-id",          // 分类 ID
  mapping: "pathname",                     // 映射方式
  reactionsEnabled: true,                   // 启用反应
  emitMetadata: false,
  inputPosition: "bottom",                 // 输入框位置
  theme: "light",                          // 主题
  lang: "zh-CN",                           // 语言
};
```

获取配置信息：
1. 访问 [Giscus 官网](https://giscus.app/)
2. 按照指引配置并获取相关 ID

### 管理友链

友链数据存储在 `data/friends.json`：

```json
[
  {
    "name": "网站名称",
    "url": "https://example.com",
    "description": "网站描述",
    "avatar": "https://example.com/avatar.jpg",
    "date": "2025-01-01"
  }
]
```

详细使用说明请查看 `components/Friends/README.md`。

### 自定义样式

- **全局样式**：`public/styles/styles.css`
- **字体配置**：`public/styles/fonts.css`
- **布局配置**：`config/layout.js`

### 修改网站信息

编辑 `nuxt.config.ts` 中的 `app.head` 配置：

```typescript
app: {
  head: {
    title: '你的网站标题',
    // ...
  }
}
```

## 🛠️ 技术栈

- **框架**：Nuxt 3
- **UI 框架**：Vue 3 (Composition API)
- **状态管理**：Pinia
- **Markdown 解析**：markdown-it
- **动画库**：GSAP
- **样式**：CSS3 (Glassmorphism)
- **留言系统**：Giscus
- **构建工具**：Vite

## 📦 主要依赖

```json
{
  "nuxt": "^3.13.0",
  "vue": "^3.x",
  "pinia": "^3.0.4",
  "markdown-it": "^14.1.0",
  "front-matter": "^4.0.2",
  "gsap": "^3.13.0",
  "canvas-confetti": "^1.9.4",
  "github-markdown-css": "^5.8.1"
}
```

## 🎨 设计特色

### 玻璃态设计（Glassmorphism）

- 半透明背景
- 毛玻璃效果（backdrop-filter）
- 柔和的阴影和边框
- 渐变色彩

### 响应式布局

- 移动端优先设计
- 灵活的网格布局
- 自适应图片加载
- 触摸友好的交互

### 性能优化

- 代码分割（Code Splitting）
- 懒加载（Lazy Loading）
- 图片优化（WebP 格式）
- 资源压缩

## 🔧 配置说明

### Nuxt 配置

主要配置在 `nuxt.config.ts`：

- **CSS 配置**：全局样式引入
- **模块配置**：Pinia 状态管理
- **Vite 配置**：构建优化、代码分割
- **路由配置**：平滑滚动
- **应用配置**：页面过渡动画

### 环境变量

如需使用 GitHub API 功能，创建 `.env` 文件：

```env
VITE_GITHUB_TOKEN=your_github_token
```

⚠️ **注意**：`.env` 文件不要提交到 Git！

## 📱 页面说明

### 首页（`/`）

欢迎页面，包含：
- 渐变背景动画
- 滚动指示器
- 进入主页按钮

### 主页（`/home`）

主要内容页面，包含：
- 横幅区域
- 印象派轮播图
- 个人资料卡片
- 信息卡片
- 留言板（Giscus）

### 笔记列表（`/notes`）

瀑布流布局展示所有文章：
- 响应式网格布局
- 分页功能
- 文章卡片展示

### 文章详情（`/post`）

Markdown 文章阅读页面：
- Markdown 渲染
- 代码高亮
- 响应式布局

### 友链页面（`/friends`）

友链展示和申请：
- 友链列表
- 申请表单
- GitHub Issues 集成

### 关于页面（`/about`）

个人介绍页面

## 🐛 故障排除

### 文章不显示

1. 检查后台管理系统（`/login`）中是否有文章数据
2. 确认 API 接口 `/api/posts` 是否正常工作
3. 检查 `stores/notesStore.js` 是否正确加载
4. 查看浏览器控制台是否有错误信息

### 留言系统不显示

1. 检查 `config/giscus.js` 配置是否正确
2. 确认 GitHub 仓库已启用 Discussions
3. 检查网络连接

### 样式异常

1. 清除浏览器缓存
2. 重新构建项目：`npm run build`
3. 检查 CSS 文件是否正确引入

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 MIT 许可证。

## 🙏 致谢

- [Nuxt](https://nuxt.com/) - 强大的 Vue 框架
- [Giscus](https://giscus.app/) - 优秀的留言系统
- [GSAP](https://greensock.com/gsap/) - 强大的动画库
- [markdown-it](https://github.com/markdown-it/markdown-it) - Markdown 解析器

---

**♥Leyili** - 安静记录想法的地方...

