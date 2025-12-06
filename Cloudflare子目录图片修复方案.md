# 🖼️ Cloudflare Pages 子目录图片不显示 - 完整修复方案

## 问题描述

- ✅ 本地开发：所有图片正常显示
- ❌ Cloudflare Pages 部署后：只有 `assets/images/` 根目录下的图片能显示
- ❌ 子目录图片（`home/`、`Moments/`、`carousel/`）无法显示

## 问题原因

在 Cloudflare Pages 的 SSR 模式下，通过 `import.meta.glob` 或 `import` 导入的 `assets` 目录下的图片会被 Vite 处理。虽然构建成功，但子目录的路径映射在 Cloudflare Pages 的路由处理中可能不正确。

## 解决方案

### 方案一：将图片移动到 public 目录（推荐，最可靠）

这是最可靠的方案，因为 `public` 目录下的文件会被直接复制到输出目录，不经过 Vite 处理，可以通过绝对路径直接访问。

#### 步骤 1：复制图片到 public 目录

```bash
# 在项目根目录执行
# Windows (PowerShell)
Copy-Item -Path "assets\images\*" -Destination "public\images\" -Recurse -Force

# Windows (CMD)
xcopy /E /I /Y assets\images public\images

# macOS/Linux
cp -r assets/images/* public/images/
```

#### 步骤 2：修改代码使用绝对路径

需要修改以下文件：

**1. `components/Moments/MomentsPost.vue`**
```javascript
// 修改前
rawMomentImages = import.meta.glob('~/assets/images/Moments/*', {
  eager: true,
  import: 'default'
})

// 修改后 - 使用 public 目录
// 不再使用 import.meta.glob，改为直接使用路径
const getMomentImage = (filename) => {
  return `/images/Moments/${filename}`
}
```

**2. `pages/home/components/ImpressionCarousel.vue`**
```javascript
// 修改前
const imageModules = import.meta.glob('~/assets/images/carousel/*.{jpg,jpeg,png,webp,gif}', {
  eager: true,
  import: 'default'
})

// 修改后 - 使用 public 目录
const images = [
  '/images/carousel/01.webp',
  '/images/carousel/02.webp',
  '/images/carousel/03.webp'
]
```

**3. 其他使用 `import` 导入图片的文件**

将：
```javascript
import avatarImage from '~/assets/images/home/avatar.webp'
```

改为：
```javascript
const avatarImage = '/images/home/avatar.webp'
```

#### 步骤 3：更新路径解析逻辑

在 `components/Moments/MomentsPost.vue` 中，更新 `resolveImagePath` 函数：

```javascript
const resolveImagePath = (path) => {
  if (!path) return path
  
  // 如果是 assets 路径，转换为 public 路径
  if (path.includes('assets/images/')) {
    return path.replace(/.*\/assets\/images\//, '/images/')
  }
  
  // 如果已经是 /images/ 路径，直接返回
  if (path.startsWith('/images/')) {
    return path
  }
  
  return path
}
```

---

### 方案二：修复 Nitro 配置（已应用，但可能不够）

我已经在 `nuxt.config.ts` 中添加了 `routeRules` 配置，但这可能还不够。如果方案一太复杂，可以尝试：

#### 检查构建输出

1. 本地运行 `npm run build`
2. 检查 `dist/_nuxt/assets/images/` 目录结构
3. 确认子目录（`home/`、`Moments/`、`carousel/`）是否存在

如果子目录不存在，说明 Vite 构建时丢失了目录结构。

#### 添加 Nitro 插件（高级）

如果方案一不可行，可以创建一个 Nitro 插件来修复路径：

创建 `server/plugins/static-assets.ts`：
```typescript
export default defineNitroPlugin((nitroApp) => {
  // 确保 _nuxt 目录下的所有资源都能正确访问
  nitroApp.hooks.hook('render:route', (url, result) => {
    // 处理静态资源路径
  })
})
```

---

## 推荐方案

**强烈推荐使用方案一（移动到 public 目录）**，因为：
- ✅ 最可靠，不依赖 Vite 的路径处理
- ✅ 性能更好，图片不经过构建处理
- ✅ 兼容性最好，适用于所有部署平台
- ✅ 调试更容易，可以直接访问图片 URL

---

## 快速修复脚本

如果你选择方案一，可以使用以下脚本快速修复：

### Windows PowerShell 脚本

创建 `fix-images.ps1`：
```powershell
# 复制图片到 public 目录
Copy-Item -Path "assets\images\*" -Destination "public\images\" -Recurse -Force
Write-Host "图片已复制到 public/images/ 目录"
Write-Host "请手动更新代码中的图片引用路径"
```

### macOS/Linux 脚本

创建 `fix-images.sh`：
```bash
#!/bin/bash
# 复制图片到 public 目录
cp -r assets/images/* public/images/
echo "图片已复制到 public/images/ 目录"
echo "请手动更新代码中的图片引用路径"
```

---

## 验证步骤

修复后：

1. **提交代码**
   ```bash
   git add .
   git commit -m "修复 Cloudflare Pages 子目录图片路径问题"
   git push
   ```

2. **等待部署完成**

3. **测试图片**
   - 访问网站
   - 检查轮播图、头像、朋友圈图片是否正常显示
   - 打开浏览器开发者工具，查看 Network 标签
   - 确认图片请求返回 200 状态码

---

## 如果还有问题

如果按照方案一修复后仍有问题，请提供：
1. 浏览器 Network 标签中失败的图片请求 URL
2. 构建日志（如果有错误）
3. `public/images/` 目录的结构

这样可以进一步诊断问题。

