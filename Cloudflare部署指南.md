# 🚀 Cloudflare Pages 部署指南

## 📋 前置准备

1. **Cloudflare 账号**：如果没有，请先注册 [Cloudflare](https://dash.cloudflare.com/sign-up)
2. **Wrangler CLI**：Cloudflare 的命令行工具（可选，用于本地测试）

## 🎯 部署步骤

### 方法一：通过 Cloudflare Dashboard（推荐，最简单）

#### 1. 准备项目

确保你的项目已经构建成功：

```bash
# 安装依赖（如果还没安装）
npm install

# 构建项目
npm run build
```

构建完成后，会生成 `dist` 文件夹。

#### 2. 创建 Cloudflare KV 命名空间

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. 选择你的账户
3. 点击左侧菜单 **"Workers & Pages"**
4. 点击 **"KV"** 标签
5. 点击 **"Create a namespace"**
6. 命名空间名称：`BLOG_KV`
7. 点击 **"Add"**
8. **重要**：复制命名空间的 **ID**（类似：`xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）

#### 3. 更新 wrangler.jsonc

编辑 `wrangler.jsonc` 文件，填入你的 KV 命名空间 ID：

```jsonc
{
  "name": "leyiligarden",
  "compatibility_date": "2025-11-28",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  },
  "kv_namespaces": [
    {
      "binding": "BLOG_KV",
      "id": "你的-kv-命名空间-id",  // 👈 替换为实际的 ID
      "preview_id": "你的预览-id"    // 👈 可选，用于预览环境
    }
  ]
}
```

#### 4. 设置环境变量和构建配置

1. 在 Cloudflare Dashboard 中，进入 **"Workers & Pages"**
2. 点击 **"Create application"** → **"Pages"** → **"Connect to Git"**（如果使用 Git）或 **"Upload assets"**（直接上传）
3. 如果使用 Git：
   - 连接你的 Git 仓库（GitHub/GitLab/Bitbucket）
   - **重要**：在构建设置中：
     - **Framework preset**: 选择 **None**（不要选择 Nuxt，因为配置可能不兼容）
     - **Build command**: `npm install && npm run build`（使用 npm install 代替 npm ci）
     - **Build output directory**: `dist`
     - **Root directory**: `/`（留空）
4. 在项目设置中找到 **"Settings"** → **"Environment variables"**
5. 添加环境变量：
   - **变量名**：`ADMIN_PASSWORD`
   - **变量值**：设置一个强密码（例如：`MySecurePassword123!`）
   - **环境**：Production（生产环境）
   - **可选**：添加 `NODE_VERSION=20` 确保使用正确的 Node.js 版本

#### 5. 部署

**方式 A：通过 Git（推荐）**

1. 将代码推送到 Git 仓库
2. Cloudflare 会自动检测并开始构建
3. 等待构建完成

**方式 B：直接上传**

1. 在 Cloudflare Dashboard 中，进入 **"Workers & Pages"** → **"Pages"**
2. 点击 **"Create a project"** → **"Upload assets"**
3. 上传 `dist` 文件夹的内容
4. 点击 **"Deploy site"**

#### 6. 配置自定义域名（可选）

1. 在项目设置中，点击 **"Custom domains"**
2. 添加你的域名
3. 按照提示配置 DNS 记录

---

### 方法二：使用 Wrangler CLI（适合开发者）

#### 1. 安装 Wrangler

```bash
npm install -g wrangler
```

或者使用 npx（不需要全局安装）：

```bash
npx wrangler --version
```

#### 2. 登录 Cloudflare

```bash
wrangler login
```

这会打开浏览器，完成登录认证。

#### 3. 创建 KV 命名空间

```bash
# 创建生产环境命名空间
wrangler kv:namespace create "BLOG_KV"

# 创建预览环境命名空间（可选）
wrangler kv:namespace create "BLOG_KV" --preview
```

执行后会输出命名空间 ID，更新到 `wrangler.jsonc`。

#### 4. 设置环境变量

创建 `.dev.vars` 文件（用于本地开发，不要提交到 Git）：

```
ADMIN_PASSWORD=你的密码
```

在生产环境，需要在 Cloudflare Dashboard 中设置环境变量。

#### 5. 部署

```bash
# 构建项目
npm run build

# 部署到 Cloudflare Pages
wrangler pages deploy dist
```

#### 6. 查看部署状态

```bash
# 查看部署列表
wrangler pages deployment list

# 查看项目信息
wrangler pages project list
```

---

## ⚙️ 配置说明

### wrangler.jsonc 配置项

```jsonc
{
  "name": "leyiligarden",                    // 项目名称
  "compatibility_date": "2025-11-28",       // 兼容性日期
  "assets": {
    "directory": "./dist",                   // 构建输出目录
    "not_found_handling": "single-page-application"  // SPA 路由处理
  },
  "kv_namespaces": [                         // KV 命名空间配置
    {
      "binding": "BLOG_KV",                  // 绑定名称（代码中使用）
      "id": "你的命名空间ID",                 // 生产环境 ID
      "preview_id": "预览环境ID"              // 预览环境 ID（可选）
    }
  ]
}
```

### 环境变量

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `ADMIN_PASSWORD` | 后台管理密码 | ✅ 是 |

---

## 🔍 验证部署

部署完成后：

1. **访问网站**：打开 Cloudflare 提供的 URL（例如：`https://leyiligarden.pages.dev`）
2. **测试博客**：访问 `/notes` 查看文章列表
3. **测试后台**：访问 `/admin` 使用设置的密码登录
4. **创建文章**：在后台创建一篇测试文章

---

## 🐛 常见问题

### Q: 遇到 "npm ci" 错误？

A: 这是 Cloudflare Pages 默认使用 `npm ci` 导致的。解决方法：

**方法 1：修改构建命令（推荐）**
1. 在 Cloudflare Dashboard 中，进入项目设置
2. 找到 **"Builds & deployments"** → **"Build configuration"**
3. 将 **Build command** 改为：`npm install && npm run build`
4. 保存并重新部署

**方法 2：使用 Wrangler CLI 部署**
```bash
# 本地构建
npm install
npm run build

# 直接部署 dist 文件夹
npx wrangler pages deploy dist
```

**方法 3：确保 package-lock.json 存在**
```bash
# 如果 package-lock.json 不存在，运行：
npm install
git add package-lock.json
git commit -m "Add package-lock.json"
git push
```

详细解决方案请查看 `部署问题解决.md`

### Q: 部署后 KV 不可用？

A: 检查：
1. `wrangler.jsonc` 中的 KV 命名空间 ID 是否正确
2. 环境变量 `ADMIN_PASSWORD` 是否已设置
3. 查看 Cloudflare Dashboard 的日志

### Q: 如何查看日志？

A: 
1. 在 Cloudflare Dashboard 中进入项目
2. 点击 **"Functions"** → **"Logs"**
3. 查看实时日志

### Q: 如何回滚到之前的版本？

A:
1. 在 Cloudflare Dashboard 中进入项目
2. 点击 **"Deployments"**
3. 找到之前的版本，点击 **"Retry deployment"**

### Q: 本地开发时如何测试？

A:
1. 使用 `npm run dev` 启动本地开发服务器
2. 本地开发时，KV 功能不可用，系统会自动回退到从文件系统读取
3. 如需测试 KV，可以使用 Wrangler 的本地开发模式（需要配置）

---

## 📝 部署检查清单

- [ ] ✅ 项目构建成功（`npm run build`）
- [ ] ✅ 创建了 KV 命名空间
- [ ] ✅ 更新了 `wrangler.jsonc` 中的 KV ID
- [ ] ✅ 设置了环境变量 `ADMIN_PASSWORD`
- [ ] ✅ 部署成功
- [ ] ✅ 测试了网站访问
- [ ] ✅ 测试了后台登录
- [ ] ✅ 测试了文章创建功能

---

## 🎉 完成！

部署完成后，你的博客就可以通过 Cloudflare 的 URL 访问了！

**重要提示：**
- 首次使用后台时，KV 是空的，需要先在后台创建文章
- 确保使用强密码保护后台
- 定期备份 KV 数据（可以通过后台导出）

祝你部署顺利！🚀

