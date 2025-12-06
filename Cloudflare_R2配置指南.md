# 🚀 Cloudflare R2 图片上传配置指南

## 📋 概述

本指南将帮助你配置 Cloudflare R2 对象存储，实现图片上传功能。

## ✅ 已实现的功能

- ✅ 图片上传到 R2
- ✅ 图片预览
- ✅ 图片删除
- ✅ 自动生成唯一文件名
- ✅ 文件类型和大小验证
- ✅ 上传进度显示

## 🔧 配置步骤

### 步骤 1：创建 R2 Bucket

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击左侧菜单 **"R2"**
3. 点击 **"Create bucket"**
4. 输入 Bucket 名称：`blog-images`（或你喜欢的名称）
5. 选择 **Location**：选择离你最近的区域（推荐：`apac` 或 `weur`）
6. 点击 **"Create bucket"**

### 步骤 2：配置 R2 公共访问（可选但推荐）

为了能够通过 URL 直接访问图片，需要配置 R2 的公共访问：

#### 方法 1：使用自定义域名（推荐）

1. 在 R2 bucket 页面，点击 **"Settings"** 标签
2. 找到 **"Public access"** 部分
3. 点击 **"Allow Access"**
4. 配置自定义域名（可选）：
   - 如果你有自己的域名，可以配置自定义域名
   - 例如：`images.yourdomain.com`
5. 或者使用 Cloudflare 提供的默认域名

#### 方法 2：使用 API 代理（已实现）

我们已经实现了 `/api/r2/[...path]` 路由来代理 R2 图片请求，所以即使不配置公共访问，图片也能正常显示。

### 步骤 3：在 Cloudflare Pages 中绑定 R2

1. 在 Cloudflare Dashboard 中，进入你的 **Pages 项目**
2. 点击 **"Settings"** → **"Functions"**
3. 找到 **"R2 bucket bindings"** 部分
4. 点击 **"Add binding"**
5. 配置如下：
   - **Variable name**：`BLOG_R2`（必须与代码中的名称一致）
   - **R2 bucket**：选择你创建的 bucket（例如：`blog-images`）
6. 点击 **"Save"**

### 步骤 4：重新部署项目

配置完成后，需要重新部署项目：

1. **推送代码到 GitHub**（如果使用自动部署）
   ```bash
   git add .
   git commit -m "添加 R2 图片上传功能"
   git push
   ```

2. **或者手动部署**
   ```bash
   npm run build
   npx wrangler pages deploy dist
   ```

## 🎯 使用方法

### 在后台管理界面

1. 访问 `/admin` 页面
2. 登录后，点击 **"新建文章"** 或 **"编辑文章"**
3. 在 **"封面图片"** 部分：
   - 点击 **"📤 上传图片"** 按钮
   - 选择图片文件（支持 JPEG, PNG, WebP, GIF，最大 10MB）
   - 等待上传完成
   - 图片会自动填充到 **"封面图片 URL"** 字段
4. 或者直接输入图片 URL（支持 `/images/xxx.webp` 或 `/r2/covers/xxx.jpg`）

### 图片 URL 格式

上传后的图片 URL 格式：
- `/r2/covers/1234567890-abc123.jpg`

这个 URL 会通过 `/api/r2/[...path]` 路由代理，自动从 R2 获取图片。

## 🔍 验证配置

### 检查 R2 Binding

1. 在 Cloudflare Dashboard 中，进入你的 Pages 项目
2. 点击 **"Settings"** → **"Functions"**
3. 确认 **"R2 bucket bindings"** 中有 `BLOG_R2` 绑定

### 测试上传功能

1. 访问 `/admin` 页面
2. 登录后，尝试上传一张图片
3. 如果上传成功，图片 URL 会自动填充
4. 保存文章后，检查图片是否能正常显示

## ⚠️ 常见问题

### Q1: 上传失败，提示 "R2 storage not available"

**原因：** R2 binding 未正确配置

**解决方法：**
1. 检查 Cloudflare Pages 的 R2 binding 配置
2. 确认 Variable name 是 `BLOG_R2`（大小写敏感）
3. 确认选择了正确的 R2 bucket
4. 重新部署项目

### Q2: 图片上传成功，但无法显示

**原因：** R2 公共访问未配置，或代理路由有问题

**解决方法：**
1. 检查 `/api/r2/[...path]` 路由是否正常工作
2. 在浏览器中直接访问图片 URL，查看错误信息
3. 如果使用自定义域名，检查 DNS 配置

### Q3: 上传的图片在哪里？

**答案：** 图片存储在 Cloudflare R2 中

**查看方法：**
1. 登录 Cloudflare Dashboard
2. 进入 **"R2"** → 你的 bucket
3. 在 **"Objects"** 标签中可以看到所有上传的图片
4. 图片存储在 `covers/` 目录下

### Q4: 如何删除已上传的图片？

**方法 1：通过 Cloudflare Dashboard**
1. 进入 R2 bucket
2. 找到要删除的图片
3. 点击删除按钮

**方法 2：通过代码（未来可以添加）**
- 可以添加删除图片的 API，但目前需要手动删除

### Q5: 免费额度是多少？

**答案：**
- **存储**：10GB 免费
- **读取**：1000万次/月 免费
- **写入**：100万次/月 免费

对于个人博客来说，完全够用！

## 📝 技术说明

### 文件存储结构

```
R2 Bucket: blog-images
├── covers/
│   ├── 1234567890-abc123.jpg
│   ├── 1234567891-def456.png
│   └── ...
```

### API 路由

- `POST /api/upload/image` - 上传图片（需要认证）
- `GET /api/r2/[...path]` - 获取图片（公共访问）

### 代码文件

- `server/utils/r2.ts` - R2 工具函数
- `server/api/upload/image.post.ts` - 上传 API
- `server/api/r2/[...path].get.ts` - 图片代理 API
- `pages/admin.vue` - 后台管理界面（已更新）

## 🎉 完成！

配置完成后，你就可以在后台管理界面直接上传图片了！

如果遇到问题，请检查：
1. R2 bucket 是否创建成功
2. R2 binding 是否配置正确
3. 项目是否已重新部署
4. 浏览器控制台是否有错误信息

---

**祝你使用愉快！** 🚀

