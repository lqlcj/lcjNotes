# 🔧 GitHub + Cloudflare Pages 自动部署配置

## 📋 问题：npm ci 错误

当你通过 GitHub 连接 Cloudflare Pages 自动构建时，Cloudflare 默认使用 `npm ci`，可能会失败。

## ✅ 解决方案

### 方法 1：在 Cloudflare Dashboard 修改构建命令（推荐）

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com/
   - 进入你的账户

2. **进入项目设置**
   - 点击左侧菜单 **"Workers & Pages"**
   - 点击 **"Pages"**
   - 找到你的项目，点击进入

3. **修改构建配置**
   - 点击 **"Settings"** 标签
   - 找到 **"Builds & deployments"** 部分
   - 点击 **"Configure build"** 或 **"Edit configuration"**

4. **修改以下设置**：
   
   | 设置项 | 修改为 |
   |--------|--------|
   | **Framework preset** | `None`（重要：不要选择 Nuxt） |
   | **Build command** | `npm install && npm run build` |
   | **Build output directory** | `dist` |
   | **Root directory** | `/`（留空） |
   | **Node.js version** | `20`（在环境变量中设置） |

5. **保存设置**
   - 点击 **"Save"** 保存配置
   - 重新触发部署（可以推送一个空提交，或点击 "Retry deployment"）

### 方法 2：通过环境变量配置

在 Cloudflare Dashboard 中：

1. 进入项目 → **Settings** → **Environment variables**
2. 添加以下环境变量：

   | 变量名 | 值 | 环境 |
   |--------|-----|------|
   | `NPM_FLAGS` | `--legacy-peer-deps` | Production（如果需要） |
   | `NODE_VERSION` | `20` | Production |
   | `ADMIN_PASSWORD` | 你的密码 | Production |

### 方法 3：确保 package-lock.json 已提交

确保 `package-lock.json` 文件已提交到 GitHub：

```bash
# 检查文件是否存在
ls package-lock.json

# 如果不存在，生成它
npm install

# 提交到 Git
git add package-lock.json
git commit -m "Add package-lock.json for Cloudflare Pages"
git push
```

---

## 🎯 完整配置步骤

### 第 1 步：确保代码已推送到 GitHub

```bash
# 确保所有文件已提交
git add .
git commit -m "Update project"
git push
```

### 第 2 步：在 Cloudflare Dashboard 配置

1. **连接 GitHub 仓库**（如果还没连接）
   - Workers & Pages → Pages → Create application
   - 选择 "Connect to Git"
   - 选择你的 GitHub 仓库
   - 点击 "Begin setup"

2. **配置构建设置**
   - Framework preset: **None**
   - Build command: **`npm install && npm run build`**
   - Build output directory: **`dist`**
   - Root directory: **`/`**（留空）

3. **设置环境变量**
   - Settings → Environment variables
   - 添加 `ADMIN_PASSWORD` = 你的密码
   - 添加 `NODE_VERSION` = `20`（可选但推荐）

4. **保存并部署**
   - 点击 "Save and Deploy"
   - 等待构建完成

### 第 3 步：验证部署

部署完成后：
1. 访问 Cloudflare 提供的 URL
2. 测试网站功能
3. 访问 `/admin` 测试后台登录

---

## 🔍 检查清单

部署前确保：

- [ ] ✅ `package-lock.json` 已提交到 GitHub
- [ ] ✅ Cloudflare Dashboard 中构建命令设置为 `npm install && npm run build`
- [ ] ✅ Framework preset 设置为 `None`
- [ ] ✅ 输出目录设置为 `dist`
- [ ] ✅ 环境变量 `ADMIN_PASSWORD` 已设置
- [ ] ✅ `wrangler.jsonc` 中 KV 命名空间 ID 已配置

---

## 🐛 如果还是失败

### 查看构建日志

1. 在 Cloudflare Dashboard 中进入项目
2. 点击 **"Deployments"** 标签
3. 点击失败的部署，查看详细日志
4. 找到错误信息，根据错误信息调整

### 常见错误及解决

**错误 1：找不到 package-lock.json**
- 解决：确保 `package-lock.json` 已提交到 GitHub

**错误 2：npm ci 失败**
- 解决：将构建命令改为 `npm install && npm run build`

**错误 3：构建成功但网站无法访问**
- 解决：检查输出目录是否为 `dist`

**错误 4：Node.js 版本不兼容**
- 解决：在环境变量中设置 `NODE_VERSION=20`

---

## 💡 推荐配置

### Cloudflare Dashboard 设置

```
Framework preset: None
Build command: npm install && npm run build
Build output directory: dist
Root directory: /
```

### 环境变量

```
ADMIN_PASSWORD = 你的密码
NODE_VERSION = 20
```

### wrangler.jsonc

```jsonc
{
  "name": "lcjnotes",
  "compatibility_date": "2025-11-28",
  "assets": {
    "directory": "./dist",
    "not_found_handling": "single-page-application"
  },
  "kv_namespaces": [
    {
      "binding": "BLOG_KV",
      "id": "你的-kv-命名空间-id"
    }
  ]
}
```

---

## 📞 需要帮助？

如果按照以上步骤还是失败，请：
1. 查看 Cloudflare Dashboard 的构建日志
2. 复制完整的错误信息
3. 检查 `package-lock.json` 是否存在
4. 确认本地可以成功运行 `npm run build`

祝你部署顺利！🚀




