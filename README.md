# ♥Leyili - 个人博客系统

一个基于 Nuxt 3 构建的现代化全功能个人博客系统，采用玻璃态设计风格，支持文章管理、留言系统、友链交换、朋友圈动态、书签管理、图床等功能。

## ✨ 核心特性

### 🎨 设计特色
- **玻璃态设计（Glassmorphism）** - 半透明背景、毛玻璃效果、柔和阴影
- **响应式布局** - 完美适配桌面端、平板和移动端
- **流畅动画** - GSAP 动画库和 CSS 过渡效果
- **优雅交互** - 页面过渡、加载状态、错误处理

### 📝 内容管理
- **Markdown 文章** - 支持 Markdown 语法和 Front Matter
- **文章管理** - 完整的增删改查功能
- **图片上传** - 支持拖拽上传，自动存储到 Cloudflare R2
- **代码高亮** - Markdown 代码块自动高亮
- **文章封面** - 自定义封面图片和宽高比

### 💬 社交功能
- **留言系统** - 集成 Giscus，基于 GitHub Discussions
- **友链管理** - 友链申请、审核、展示功能
- **朋友圈动态** - 发布和管理个人动态，支持多图
- **书签管理** - 收藏和管理常用网站链接

### 🛠️ 管理功能
- **完整后台** - 统一的管理后台界面
- **图床管理** - 图片上传、删除、链接复制
- **权限控制** - 基于 Session 的认证系统
- **安全验证** - Cloudflare Turnstile 人机验证

### ⚡ 性能优化
- **代码分割** - 按需加载，减少初始包大小
- **懒加载** - 图片和组件懒加载
- **缓存策略** - ETag 缓存和 HTTP 缓存头
- **静态资源优化** - WebP 图片格式，资源压缩

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 9.0.0
- Cloudflare 账号（用于部署和存储）

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
lcjNotes/
├── app.vue                 # 应用根组件
├── nuxt.config.ts          # Nuxt 配置文件
├── package.json            # 项目依赖
│
├── components/            # Vue 组件
│   ├── BackToTop/        # 返回顶部组件
│   ├── Comments/         # 留言组件（Giscus、Guestbook）
│   ├── Common/           # 通用组件
│   │   ├── LoadingMessage.vue
│   │   ├── OutlineButton.vue
│   │   └── PageLoading.vue
│   ├── ErrorBoundary/    # 错误边界组件
│   ├── Friends/          # 友链相关组件
│   │   ├── FriendRequestForm.vue
│   │   └── FriendsList.vue
│   ├── HeaderBar/        # 页面标题组件
│   ├── Layouts/         # 布局组件
│   │   ├── Footer.vue
│   │   └── Header.vue
│   └── Moments/          # 朋友圈动态组件
│       └── MomentsPost.vue
│
├── composables/          # 组合式函数
│   └── useConfetti.js   # 彩蛋功能（烟花效果）
│
├── config/              # 配置文件
│   └── layout.js       # 布局配置
│
├── pages/              # 页面路由
│   ├── index.vue       # 首页（欢迎页）
│   ├── home.vue        # 主页（文章列表、留言板）
│   ├── post.vue        # 文章详情页
│   ├── about.vue       # 关于页面
│   ├── friends.vue     # 友链页面（朋友圈+友链）
│   ├── tools.vue       # 工具页面（书签+管理后台）
│   ├── me.vue          # 管理后台页面
│   └── home/           # 主页子组件
│       └── components/
│           ├── HomeBanner.vue
│           ├── NotesSection.vue
│           └── YearProgress.vue
│
├── plugins/            # 插件
│   ├── console-setup.client.js
│   ├── console-setup.client.ts
│   └── loading.client.js
│
├── public/            # 公共静态文件
│   ├── images/        # 图片资源
│   ├── fonts/         # 字体文件
│   └── styles/        # 样式文件
│
├── server/            # 服务器端代码
│   ├── api/          # API 路由
│   │   ├── assets/    # 图床管理 API
│   │   ├── auth/      # 认证 API
│   │   ├── bookmarks/ # 书签 API
│   │   ├── friends/   # 友链 API
│   │   ├── messages/  # 留言 API
│   │   ├── moments/   # 朋友圈 API
│   │   ├── posts/     # 文章 API
│   │   ├── r2/        # R2 资源访问
│   │   └── upload/    # 图片上传
│   └── utils/         # 工具函数
│       ├── auth.ts    # 认证工具
│       ├── cache.ts   # 缓存工具
│       ├── errorHandler.ts
│       ├── kv.ts      # KV/D2 存储工具
│       ├── r2.ts      # R2 存储工具
│       ├── session.ts # Session 管理
│       ├── turnstile.ts # Turnstile 验证
│       └── validation.ts
│
├── stores/            # Pinia 状态管理
│   ├── loadingStore.js
│   └── notesStore.js
│
└── utils/             # 工具函数
    └── markdown.ts    # Markdown 解析工具
```

## 🛠️ 技术栈

### 前端技术
- **框架**：Nuxt 3（SSR/SSG）
- **UI 框架**：Vue 3（Composition API）
- **状态管理**：Pinia
- **样式**：CSS3（Glassmorphism 设计）
- **动画库**：GSAP
- **构建工具**：Vite

### 后端技术
- **运行时**：Cloudflare Workers
- **API 框架**：Nuxt Server API
- **数据存储**：Cloudflare KV / D2 Database
- **文件存储**：Cloudflare R2
- **认证**：Session Cookie
- **安全验证**：Cloudflare Turnstile

### 第三方服务
- **留言系统**：Giscus（基于 GitHub Discussions）
- **Markdown 解析**：markdown-it
- **代码高亮**：github-markdown-css

## 📦 主要依赖

```json
{
  "nuxt": "^3.13.0",
  "vue": "^3.x",
  "@pinia/nuxt": "^0.5.1",
  "pinia": "^3.0.4",
  "markdown-it": "^14.1.0",
  "front-matter": "^4.0.2",
  "gsap": "^3.13.0",
  "canvas-confetti": "^1.9.4",
  "github-markdown-css": "^5.8.1"
}
```

## 🔧 配置说明

### 环境变量

创建 `.env` 文件（不要提交到 Git）：

```env
# 管理员密码
ADMIN_PASSWORD=your_admin_password

# Session 加密密钥（至少 32 字符）
SESSION_SECRET=your_session_secret_key_at_least_32_chars

# R2 公共访问域名
R2_PUBLIC_URL=https://your-r2-domain.com

# Cloudflare Turnstile（可选，用于登录验证）
TURNSTILE_SITE_KEY=your_turnstile_site_key
TURNSTILE_SECRET_KEY=your_turnstile_secret_key
```

### Cloudflare Pages 配置

在 Cloudflare Pages 项目设置中配置以下 Bindings：

1. **BLOG_KV** 或 **BLOG_D2** - 数据存储（KV 或 D2 Database）
2. **BLOG_R2** - 图片存储（R2 Bucket）

### Nuxt 配置

主要配置在 `nuxt.config.ts`：

- **Nitro Preset**：`cloudflare-pages`
- **路由配置**：平滑滚动
- **页面过渡**：淡入淡出动画
- **构建优化**：代码分割、资源压缩

## 📱 页面说明

### 首页（`/`）

欢迎页面，包含：
- 渐变背景动画
- 滚动指示器
- 进入主页按钮

### 主页（`/home`）

主要内容页面，包含：
- 横幅 Logo
- 双语文案展示
- 文章列表（Notes Section）
- 留言板（Giscus）

### 文章详情（`/post`）

Markdown 文章阅读页面：
- 文章封面
- Markdown 渲染
- 代码高亮
- 响应式布局

### 友链页面（`/friends`）

友链展示和申请：
- 左侧：朋友圈动态列表
- 右侧：友链列表和申请表单
- 申请按钮带烟花效果

### 工具页面（`/tools`）

工具集合页面：
- **书签标签页**：瀑布流布局展示书签
- **Me 标签页**：管理后台入口

### 管理后台（`/me`）

完整的管理后台，包含：

#### 文章管理
- 创建、编辑、删除文章
- 上传文章封面
- Markdown 编辑器

#### 留言管理
- 查看所有留言
- 删除留言
- 手动添加留言

#### 友链管理
- 审核友链申请（批准/拒绝）
- 管理已批准友链
- 手动添加友链

#### 朋友圈管理
- 发布朋友圈动态
- 上传多张图片
- 编辑和删除动态

#### 书签管理
- 添加、编辑、删除书签
- 书签分类管理

#### 图床管理
- 拖拽上传图片
- 图片列表展示
- 复制图片链接
- 删除图片

## 🎯 使用指南

### 添加博客文章

1. 访问 `/me` 页面并登录管理员账号
2. 在"文章管理"标签页中点击"新建文章"
3. 填写文章信息：
   - 标题
   - 日期
   - 封面图片（可上传或输入 URL）
   - 宽高比
   - 作者
   - Markdown 内容
4. 点击"保存"，文章会自动保存到云端

### 配置 Giscus 留言系统

1. 访问 [Giscus 官网](https://giscus.app/)
2. 按照指引配置 GitHub 仓库和 Discussions
3. 获取配置信息（repo、repoId、categoryId 等）
4. 在代码中配置 Giscus 组件（通常在 `components/Comments/Giscus.vue`）

### 管理友链

#### 用户申请友链
1. 访问 `/friends` 页面
2. 点击"申请友链"按钮
3. 填写申请信息（网站名称、链接、描述等）
4. 提交申请

#### 管理员审核友链
1. 登录管理后台（`/me`）
2. 进入"友链管理"标签页
3. 在"待审核申请"中查看申请
4. 点击"批准"或"拒绝"按钮

### 发布朋友圈动态

1. 登录管理后台
2. 进入"朋友圈管理"标签页
3. 点击"新建朋友圈"
4. 填写内容、上传图片（支持多选）
5. 保存后动态会显示在 `/friends` 页面

### 使用图床

1. 登录管理后台
2. 进入"图床管理"标签页
3. 拖拽图片到上传区域或点击上传
4. 上传成功后，点击"复制链接"获取图片 URL
5. 可在文章或其他地方使用该链接

## 🚀 部署说明

### Cloudflare Pages 部署

1. **连接 GitHub 仓库**
   - 在 Cloudflare Pages 中连接你的 GitHub 仓库
   - 选择分支和构建命令

2. **配置构建设置**
   - 构建命令：`npm run build`
   - 构建输出目录：`.output/public`
   - Node.js 版本：18.x 或更高

3. **配置环境变量**
   - 在项目设置中添加环境变量（见上方配置说明）

4. **配置 Bindings**
   - 添加 KV Namespace 或 D2 Database（BLOG_KV 或 BLOG_D2）
   - 添加 R2 Bucket（BLOG_R2）
   - 配置 R2 公共访问域名

5. **部署**
   - 推送代码到 GitHub，Cloudflare Pages 会自动部署

### 自定义域名

在 Cloudflare Pages 项目设置中配置自定义域名和 SSL 证书。

## 🔒 安全说明

- **管理员密码**：请在生产环境中使用强密码
- **Session Secret**：使用至少 32 字符的随机字符串
- **Turnstile 验证**：建议在生产环境中启用，防止暴力破解
- **环境变量**：不要将 `.env` 文件提交到 Git
- **HTTPS**：确保生产环境使用 HTTPS

## 🐛 故障排除

### 文章不显示

1. 检查管理后台中是否有文章数据
2. 确认 API 接口 `/api/posts` 是否正常工作
3. 检查浏览器控制台是否有错误信息
4. 确认 KV/D2 存储是否配置正确

### 图片上传失败

1. 检查 R2 Bucket 是否配置正确
2. 确认 `BLOG_R2` binding 是否已添加
3. 检查 R2 公共访问域名是否正确配置
4. 查看服务器日志获取详细错误信息

### 登录失败

1. 检查环境变量 `ADMIN_PASSWORD` 是否正确
2. 确认 Turnstile 配置（如果启用）
3. 检查 Session Secret 是否配置
4. 查看浏览器控制台和服务器日志

### 留言系统不显示

1. 检查 Giscus 配置是否正确
2. 确认 GitHub 仓库已启用 Discussions
3. 检查网络连接和 GitHub API 限制

### 样式异常

1. 清除浏览器缓存
2. 重新构建项目：`npm run build`
3. 检查 CSS 文件是否正确引入
4. 确认静态资源路径配置正确

## 📝 开发说明

### 本地开发

本地开发时，数据会存储在内存中（使用 Nitro 的 useStorage），重启后数据会丢失。生产环境会使用 Cloudflare KV/D2。

### API 接口

所有 API 接口都在 `server/api/` 目录下，遵循 RESTful 规范：

- `GET /api/posts` - 获取文章列表
- `GET /api/posts/:id` - 获取单篇文章
- `POST /api/posts` - 创建文章（需认证）
- `PUT /api/posts/:id` - 更新文章（需认证）
- `DELETE /api/posts/:id` - 删除文章（需认证）

其他资源（留言、友链、朋友圈、书签、图床）的 API 接口类似。

### 存储结构

#### KV/D2 存储键名规范

- `posts:list` - 文章 ID 列表
- `post:{id}` - 单篇文章数据
- `message:{id}` - 单条留言数据
- `friend:{id}` - 单个友链数据
- `friend:request:{id}` - 友链申请数据
- `moment:{id}` - 朋友圈动态数据
- `bookmark:{id}` - 书签数据

#### R2 存储结构

- `assets/YYYY-MM/UUID.ext` - 图床图片
- `covers/YYYY-MM/UUID.ext` - 文章封面

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 MIT 许可证。

## 🙏 致谢

- [Nuxt](https://nuxt.com/) - 强大的 Vue 框架
- [Cloudflare](https://www.cloudflare.com/) - 优秀的边缘计算平台
- [Giscus](https://giscus.app/) - 优秀的留言系统
- [GSAP](https://greensock.com/gsap/) - 强大的动画库
- [markdown-it](https://github.com/markdown-it/markdown-it) - Markdown 解析器

---

**♥Leyili** - 安静记录想法的地方...
