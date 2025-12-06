# 🚨 JS/CSS 资源 404 错误 - 紧急修复步骤

## 问题

所有 JS 和 CSS 文件在 `/_nuxt/` 路径下返回 404，导致网站无法正常工作。

## ⚠️ 最可能的原因

**Cloudflare Pages 的构建输出目录配置错误！**

## ✅ 立即检查并修复

### 步骤 1：检查 Cloudflare Pages 构建配置

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入 **Workers & Pages** → **Pages** → 你的项目
3. 点击 **Settings** → **Builds & deployments**
4. 点击 **"Configure build"** 或 **"Edit configuration"**

5. **确认以下配置：**

   | 设置项 | 必须的值 |
   |--------|---------|
   | **Build command** | `npm install && npm run build` |
   | **Build output directory** | `dist` ⚠️ **必须是 `dist`，不是 `.output/public`** |
   | **Root directory** | `/` |

### 步骤 2：验证构建输出

在本地运行构建，检查输出：

```bash
npm run build
```

然后检查 `dist` 目录：

```bash
# Windows
dir dist\_nuxt\assets

# 应该看到 js/ 和 css/ 目录
```

**如果 `dist/_nuxt/` 目录不存在或为空，说明构建有问题！**

### 步骤 3：重新部署

1. **在 Cloudflare Dashboard 中：**
   - 进入你的 Pages 项目
   - 点击 **"Retry deployment"** 或推送新的 commit

2. **等待构建完成**

3. **清除浏览器缓存**
   - 按 `Ctrl + Shift + Delete` 清除缓存
   - 或者使用无痕模式访问

### 步骤 4：验证修复

访问网站，打开开发者工具（F12），查看 Network 标签：

- ✅ `/_nuxt/assets/js/*.js` 应该返回 200
- ✅ `/_nuxt/assets/css/*.css` 应该返回 200
- ❌ 不应该有 404 错误

## 🔍 如果问题依然存在

### 检查构建日志

在 Cloudflare Dashboard 的构建日志中，查找：
- 是否有关于 `_nuxt` 目录的错误
- 是否有资源相关的警告
- 构建是否真的成功完成

### 检查 dist 目录结构

如果可能，检查构建后的 `dist` 目录应该包含：

```
dist/
├── _nuxt/
│   ├── assets/
│   │   ├── js/          ← 必须存在
│   │   ├── css/         ← 必须存在
│   │   └── ...
│   └── ...
├── _worker.js/
└── ...
```

### 可能的额外修复

如果 `dist/_nuxt/` 目录存在但资源仍然 404，可能需要：

1. **检查 Functions 路由**
   - Settings → Functions
   - 确认没有自定义路由规则阻止 `/_nuxt/` 路径

2. **检查 _routes.json**
   - 在 `dist` 目录中应该有 `_routes.json` 文件
   - 如果没有，可能需要手动创建

## 📝 重要提示

**关键点：Cloudflare Pages 的构建输出目录必须是 `dist`！**

如果配置为 `.output/public` 或其他目录，会导致 `_nuxt` 目录无法正确部署。

---

**请先检查并修复 Cloudflare Pages 的构建输出目录配置！**

