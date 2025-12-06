# 🛡️ Cloudflare Turnstile 配置指南

## 📋 概述

Cloudflare Turnstile 是一个免费的人机验证服务，可以有效防止机器人提交垃圾留言。

## ✅ 已实现的功能

- ✅ 在留言板中添加 Turnstile 验证
- ✅ 提交留言前必须完成验证
- ✅ 服务端验证 Turnstile token
- ✅ 管理员提交留言时跳过验证（后台管理）

## 🔧 配置步骤

### 步骤 1：创建 Turnstile Site

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 点击左侧菜单 **"Turnstile"**
3. 点击 **"Add Site"** 或 **"Create"**
4. 填写配置信息：
   - **Site name**：`Blog Guestbook`（或你喜欢的名称）
   - **Domain**：你的网站域名（例如：`lcjnotes.pages.dev`）
   - **Widget mode**：选择 **"Managed"**（推荐）或 **"Non-interactive"**
   - **Pre-Clearance**：可选，启用后用户体验更好
5. 点击 **"Create"**

### 步骤 2：获取 Keys

创建成功后，你会看到两个 Key：

1. **Site Key**（公开，用于前端）
   - 格式类似：`0x4AAAAAAABkMYinukE8q5H6`
   - 这个 Key 会显示在页面上，是公开的

2. **Secret Key**（私密，用于服务端验证）
   - 格式类似：`0x4AAAAAAABkMYinukE8q5H6_xxxxxxxxxxxxxxxx`
   - 这个 Key 必须保密，只能用于服务端

### 步骤 3：配置环境变量

在 Cloudflare Pages 中设置环境变量：

1. 登录 Cloudflare Dashboard
2. 进入你的 **Pages 项目**
3. 点击 **Settings** → **Environment variables**
4. 添加以下环境变量：

   **Production 环境：**
   - **Variable name**：`TURNSTILE_SITE_KEY`
   - **Value**：你的 Site Key（例如：`0x4AAAAAAABkMYinukE8q5H6`）
   - **Environment**：Production

   - **Variable name**：`TURNSTILE_SECRET_KEY`
   - **Value**：你的 Secret Key（例如：`0x4AAAAAAABkMYinukE8q5H6_xxxxxxxxxxxxxxxx`）
   - **Environment**：Production

   **Preview 环境（可选）：**
   - 如果需要，也可以为 Preview 环境配置相同的变量

### 步骤 4：重新部署项目

配置完成后，重新部署项目：

```bash
git add .
git commit -m "添加 Turnstile 人机验证"
git push
```

等待 Cloudflare Pages 自动部署完成。

## 🎯 验证配置

### 检查前端

1. 访问你的网站
2. 打开留言板页面
3. 应该能看到 Turnstile 验证框（通常在提交按钮上方）
4. 如果看不到，检查浏览器控制台是否有错误

### 检查功能

1. **正常提交**：
   - 填写留言表单
   - 完成 Turnstile 验证（通常会自动完成）
   - 点击"提交留言"
   - 应该能成功提交

2. **未验证提交**：
   - 填写留言表单
   - 不完成 Turnstile 验证（如果可能）
   - 点击"提交留言"
   - 应该提示"请完成人机验证"

3. **验证失败**：
   - 如果验证失败，会提示"人机验证失败，请重试"
   - Turnstile widget 会自动重置

## ⚠️ 常见问题

### Q1: 看不到 Turnstile 验证框

**可能原因：**
1. Site Key 未配置或配置错误
2. JavaScript 加载失败
3. 浏览器阻止了脚本加载

**解决方法：**
1. 检查环境变量 `TURNSTILE_SITE_KEY` 是否正确配置
2. 检查浏览器控制台是否有错误
3. 确认已重新部署项目
4. 检查网络连接，确保能访问 `challenges.cloudflare.com`

### Q2: 提交时提示"请完成人机验证"

**可能原因：**
1. Turnstile widget 未正确加载
2. 验证未完成
3. Token 未正确传递

**解决方法：**
1. 检查 Turnstile widget 是否显示
2. 等待验证完成（通常会自动完成）
3. 如果验证框显示错误，刷新页面重试

### Q3: 提交时提示"人机验证失败"

**可能原因：**
1. Secret Key 配置错误
2. Token 已过期
3. 验证请求被拒绝

**解决方法：**
1. 检查环境变量 `TURNSTILE_SECRET_KEY` 是否正确
2. 重新完成验证后再次提交
3. 检查服务端日志，查看具体错误信息

### Q4: 管理员提交留言也需要验证吗？

**答案：** 不需要

管理员通过后台管理提交留言时，会跳过 Turnstile 验证（因为已经通过密码认证）。

### Q5: 本地开发时如何测试？

**方法 1：配置本地环境变量**

创建 `.env` 文件：
```
TURNSTILE_SITE_KEY=你的SiteKey
TURNSTILE_SECRET_KEY=你的SecretKey
```

**方法 2：使用测试 Keys**

Cloudflare 提供了测试 Keys：
- Site Key: `1x00000000000000000000AA`
- Secret Key: `1x0000000000000000000000000000000AA`

这些 Keys 在测试环境中总是返回成功，方便开发测试。

## 🔒 安全说明

1. **Secret Key 必须保密**
   - 不要提交到代码仓库
   - 只存储在环境变量中
   - 不要在前端代码中使用

2. **Site Key 是公开的**
   - 可以安全地显示在前端
   - 即使泄露也不会造成安全问题

3. **验证流程**
   - 前端：用户完成验证，获取 token
   - 前端：提交留言时包含 token
   - 服务端：验证 token 的有效性
   - 服务端：只有验证通过才保存留言

## 📊 Widget 模式说明

### Managed（推荐）
- 自动选择最佳验证方式
- 大多数用户无需交互
- 用户体验最好

### Non-interactive
- 完全无交互验证
- 基于浏览器指纹和行为分析
- 用户体验最好，但可能不够安全

### Invisible
- 完全隐藏验证框
- 自动在后台验证
- 适合高级用户

## 🎉 完成！

配置完成后，你的留言板就受到 Turnstile 保护了！

**主要优势：**
- ✅ 免费使用
- ✅ 用户体验好（大多数情况下无需交互）
- ✅ 有效防止机器人
- ✅ 与 Cloudflare 生态完美集成

---

**如果遇到问题，请检查：**
1. 环境变量是否正确配置
2. 是否已重新部署项目
3. 浏览器控制台是否有错误
4. Turnstile Dashboard 中的配置是否正确

