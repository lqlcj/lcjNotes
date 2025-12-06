# 🖼️ Cloudflare Pages 图片不显示修复指南

## 问题原因

在 Cloudflare Pages 上部署 Nuxt 3 项目时，图片不显示通常是因为：

1. **构建命令不正确**：使用了 `nuxt build` 而不是 `nuxt generate`
2. **输出目录配置错误**：`nuxt build` 输出到 `.output`，而配置指向 `dist`
3. **静态资源路径问题**：图片路径在构建时没有正确解析

## ✅ 解决方案

### 方法一：使用静态生成（推荐）

如果你的项目是纯静态站点（不需要 SSR），请使用以下配置：

#### 1. 更新 Cloudflare Pages 构建配置

在 Cloudflare Dashboard 中：

1. 进入你的项目设置
2. 找到 **"Builds & deployments"** → **"Build configuration"**
3. 修改以下配置：

   **构建命令：**
   ```
   npm install && npm run generate
   ```

   **构建输出目录：**
   ```
   .output/public
   ```

   **根目录：**
   ```
   /
   ```

#### 2. 重新部署

保存配置后，Cloudflare Pages 会自动触发新的构建。等待构建完成后，图片应该就能正常显示了。

---

### 方法二：使用 SSR 构建（如果需要服务端功能）

如果你的项目需要 SSR 功能（如 API 路由、动态内容），请使用以下配置：

#### 1. 更新 Cloudflare Pages 构建配置

**构建命令：**
```
npm install && npm run build
```

**构建输出目录：**
```
.output/public
```

**根目录：**
```
/
```

#### 2. 确保 Nitro 配置正确

`nuxt.config.ts` 中已经配置了 `nitro.preset: 'cloudflare-pages'`，这会将 SSR 应用正确输出到 `.output/public`。

---

## 🔍 验证修复

部署完成后，请检查：

1. **打开浏览器开发者工具**（F12）
2. **查看 Network 标签**，刷新页面
3. **检查图片请求**：
   - 图片 URL 应该是类似：`https://lcjnotes.pages.dev/assets/images/xxx.webp`
   - 状态码应该是 `200`，而不是 `404`

4. **检查控制台**：
   - 不应该有图片加载错误
   - 不应该有路径相关的警告

---

## 📝 配置说明

### 为什么使用 `.output/public`？

- `nuxt build` 和 `nuxt generate` 都会将静态文件输出到 `.output/public`
- Cloudflare Pages 需要从这个目录读取静态文件
- 这个目录包含了所有构建后的 HTML、CSS、JS 和图片资源

### 为什么推荐 `nuxt generate`？

- `nuxt generate` 会预渲染所有页面，生成纯静态 HTML
- 对于博客类网站，这是最佳选择
- 加载速度更快，SEO 更好
- 不需要服务端运行时

### 什么时候使用 `nuxt build`？

- 需要 SSR 功能（服务端渲染）
- 有动态 API 路由
- 需要服务端状态管理

---

## 🐛 常见问题

### Q1: 构建后仍然看不到图片？

**检查清单：**
- ✅ 确认构建输出目录是 `.output/public`
- ✅ 确认构建命令正确（`npm run generate` 或 `npm run build`）
- ✅ 检查浏览器控制台是否有错误
- ✅ 检查图片文件是否存在于 `assets/images/` 目录

### Q2: 本地预览正常，但部署后图片不显示？

这通常是路径问题。解决方案：
1. 确保 `nuxt.config.ts` 中 `app.baseURL` 设置为 `/`
2. 使用相对路径导入图片：`import img from '~/assets/images/xxx.webp'`
3. 不要使用绝对路径字符串：避免 `src="/images/xxx.webp"`

### Q3: 部分图片显示，部分不显示？

检查图片格式和大小：
- 确保图片文件存在且未损坏
- 检查图片路径是否正确（大小写敏感）
- 查看浏览器 Network 标签，找出哪些图片加载失败

---

## 📚 相关文件

- `nuxt.config.ts` - Nuxt 配置文件（已更新）
- `package.json` - 构建脚本配置
- `Cloudflare部署指南.md` - 完整部署指南

---

## ✨ 更新内容

已更新 `nuxt.config.ts`：
- ✅ 添加了 `app.baseURL` 配置
- ✅ 优化了 Vite 的 `assetFileNames` 配置，确保图片路径正确

现在请按照上述步骤更新 Cloudflare Pages 的构建配置，然后重新部署即可！

