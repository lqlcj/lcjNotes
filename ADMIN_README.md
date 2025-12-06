# 博客后台管理系统使用指南

## 📋 概述

你的博客已经成功改造为支持后台管理的版本！现在你可以通过 Web 界面来管理博客文章，而不需要手动创建 markdown 文件。

## 🚀 快速开始

### 1. 配置 Cloudflare KV

首先，你需要在 Cloudflare 上创建 KV 命名空间：

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 进入你的 Workers & Pages 项目
3. 点击 "KV" 标签
4. 创建新的 KV 命名空间，命名为 `BLOG_KV`
5. 复制命名空间的 ID

### 2. 更新 wrangler.jsonc

编辑 `wrangler.jsonc` 文件，将 KV 命名空间的 ID 填入：

```jsonc
{
  "kv_namespaces": [
    {
      "binding": "BLOG_KV",
      "id": "你的-kv-命名空间-id",  // 替换为实际的 ID
      "preview_id": "你的预览-id"    // 可选，用于本地开发
    }
  ]
}
```

### 3. 设置管理员密码

在 Cloudflare Dashboard 中设置环境变量：

1. 进入你的 Workers & Pages 项目
2. 点击 "Settings" -> "Variables"
3. 添加环境变量：
   - 变量名：`ADMIN_PASSWORD`
   - 变量值：设置一个强密码（例如：`MySecurePassword123!`）

或者在本地开发时，创建 `.env` 文件：

```
ADMIN_PASSWORD=你的密码
```

### 4. 部署到 Cloudflare

```bash
# 构建项目
npm run build

# 部署（使用 Wrangler CLI）
npx wrangler pages deploy dist
```

## 📝 使用后台管理

### 访问后台

部署后，访问：`https://你的域名/admin`

### 登录

使用你设置的管理员密码登录。

### 功能说明

#### 1. 创建新文章

1. 点击 "新建文章" 按钮
2. 填写文章信息：
   - **标题**：文章标题（必填）
   - **日期**：发布日期
   - **封面图片 URL**：例如 `/images/01.webp`
   - **宽高比**：图片显示比例（0.5-2.0）
   - **作者**：作者名称
   - **文章内容**：Markdown 格式的内容（必填）
3. 点击 "保存"

#### 2. 编辑文章

1. 在文章列表中点击 "编辑" 按钮
2. 修改文章内容
3. 点击 "保存"

#### 3. 删除文章

1. 在文章列表中点击 "删除" 按钮
2. 确认删除

## 🔄 数据迁移（可选）

如果你有现有的 markdown 文件需要迁移到 KV，可以：

### 方法 1：手动迁移（推荐）

直接在后台管理界面创建文章，复制现有 markdown 文件的内容。

### 方法 2：使用迁移 API（仅本地）

如果你在本地环境，可以运行迁移脚本：

```bash
# 先登录获取 token
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"你的密码"}'

# 使用返回的 token 运行迁移
curl -X POST http://localhost:3000/api/migrate \
  -H "Authorization: Bearer 你的token"
```

## 🔒 安全建议

1. **使用强密码**：设置一个复杂的管理员密码
2. **使用 HTTPS**：确保网站使用 HTTPS 加密
3. **定期备份**：定期导出 KV 中的数据作为备份
4. **限制访问**：考虑添加 IP 白名单或其他访问控制

## 🛠️ 技术架构

### 存储方案

- **Cloudflare KV**：用于存储文章数据
- **数据结构**：
  - `posts:list`：存储所有文章 ID 列表
  - `post:{id}`：存储单篇文章的完整数据

### API 路由

- `GET /api/posts`：获取所有文章列表（元数据）
- `GET /api/posts/:id`：获取单篇文章完整内容
- `POST /api/posts`：创建新文章（需要认证）
- `PUT /api/posts/:id`：更新文章（需要认证）
- `DELETE /api/posts/:id`：删除文章（需要认证）
- `POST /api/auth/login`：登录验证

### 前端页面

- `/admin`：后台管理界面
- `/notes`：博客列表页（自动从 API 获取数据）
- `/post`：文章详情页（自动从 API 获取数据）

## ❓ 常见问题

### Q: 本地开发时 KV 不可用怎么办？

A: 系统会自动回退到从本地文件系统读取 markdown 文件，这是兼容模式。

### Q: 如何备份数据？

A: 可以通过 Cloudflare Dashboard 导出 KV 数据，或者定期在后台复制文章内容。

### Q: 可以同时使用文件系统和 KV 吗？

A: 可以。系统会优先尝试从 API（KV）获取数据，如果失败则回退到文件系统。

### Q: 如何修改管理员密码？

A: 在 Cloudflare Dashboard 的环境变量中修改 `ADMIN_PASSWORD`，然后重新部署。

## 📞 需要帮助？

如果遇到问题，请检查：

1. Cloudflare KV 命名空间是否正确配置
2. 环境变量 `ADMIN_PASSWORD` 是否设置
3. wrangler.jsonc 中的 KV binding 是否正确
4. 浏览器控制台是否有错误信息

祝你使用愉快！🎉

