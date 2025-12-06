# 🔧 Cloudflare Pages _nuxt 资源 404 错误修复

## 问题描述

JS 和 CSS 文件在 `/_nuxt/` 路径下返回 404：
- `/_nuxt/assets/css/entry-6xawXyQq.css` → 404
- `/_nuxt/assets/js/entry-Dy4xNBV6.js` → 404

## 问题原因

在 Cloudflare Pages 的 SSR 模式下，`/_nuxt/` 目录下的静态资源需要通过 Worker 来提供。如果构建输出不正确，或者 Cloudflare Pages 的路由配置有问题，就会导致 404。

## 解决方案

### 方案一：检查 Cloudflare Pages 构建配置（最重要！）

在 Cloudflare Dashboard 中，确认以下配置：

1. **进入项目设置**
   - Cloudflare Dashboard → Workers & Pages → 你的项目
   - Settings → Builds & deployments

2. **检查构建配置**
   - **构建命令**：`npm install && npm run build`
   - **构建输出目录**：`dist` ✅（必须是 `dist`，不是 `.output/public`）
   - **根目录**：`/`

3. **检查 Functions 配置**
   - Settings → Functions
   - 确认没有自定义路由规则阻止 `/_nuxt/` 路径

### 方案二：验证构建输出

在本地运行构建，检查输出：

```bash
npm run build
```

然后检查 `dist` 目录结构：

```
dist/
├── _nuxt/
│   ├── assets/
│   │   ├── js/
│   │   │   ├── entry-*.js
│   │   │   └── ...
│   │   ├── css/
│   │   │   ├── entry-*.css
│   │   │   └── ...
│   │   └── ...
│   └── ...
├── _worker.js/
└── ...
```

**如果 `dist/_nuxt/` 目录不存在或为空，说明构建有问题。**

### 方案三：检查 Nitro 配置

确保 `nuxt.config.ts` 中的配置正确：

```typescript
nitro: {
  preset: 'cloudflare-pages',
  // ... 其他配置
}
```

### 方案四：清除缓存并重新部署

1. **清除 Cloudflare 缓存**
   - Cloudflare Dashboard → 你的域名 → Caching → Purge Everything

2. **重新触发部署**
   - 在 Cloudflare Pages 项目中，点击 "Retry deployment" 或推送新的 commit

## 常见问题排查

### Q1: 构建成功但资源仍然 404？

**检查清单：**
- ✅ 确认输出目录是 `dist`（不是 `.output/public`）
- ✅ 确认 `dist/_nuxt/` 目录存在且包含文件
- ✅ 检查构建日志，确认没有资源相关的错误

### Q2: 本地构建正常，但部署后 404？

这通常是 Cloudflare Pages 的路由配置问题：

1. **检查 Functions 路由**
   - Settings → Functions
   - 确认没有自定义路由规则

2. **检查 _routes.json**
   - 在 `dist` 目录中应该有 `_routes.json` 文件
   - 确认其中包含 `/_nuxt/**` 的路由规则

### Q3: 部分资源能加载，部分不能？

检查资源路径：
- 确认所有资源都在 `/_nuxt/` 路径下
- 检查文件名和路径是否正确（大小写敏感）

## 如果问题依然存在

如果上述方案都不行，可能需要：

1. **检查 Nitro 版本**
   ```bash
   npm list nitro
   ```
   确保使用的是最新版本

2. **尝试使用不同的 buildAssetsDir**
   在 `nuxt.config.ts` 中尝试：
   ```typescript
   app: {
     buildAssetsDir: '/', // 尝试根目录
   }
   ```
   但这需要重新构建和测试。

3. **查看 Cloudflare Pages 的构建日志**
   - 在 Cloudflare Dashboard 中查看详细的构建日志
   - 查找关于 `_nuxt` 目录的错误或警告

## 验证修复

修复后，检查：

1. **访问网站**
   - 打开浏览器开发者工具（F12）
   - 查看 Network 标签
   - 刷新页面

2. **检查资源加载**
   - 所有 `/_nuxt/assets/js/*.js` 文件应该返回 200
   - 所有 `/_nuxt/assets/css/*.css` 文件应该返回 200
   - 不应该有 404 错误

---

**关键点：确保 Cloudflare Pages 的构建输出目录设置为 `dist`！**

