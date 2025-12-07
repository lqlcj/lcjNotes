# 网站图标配置位置汇总

## 📍 主要配置位置

### 1. **nuxt.config.ts** (第 44-49 行)
这是网站图标的**唯一配置位置**，位于 `app.head.link` 中：

```typescript
app: {
  head: {
    link: [
      { rel: 'icon', type: 'image/svg+xml', href: '/images/logo.svg' },
      { rel: 'shortcut icon', type: 'image/svg+xml', href: '/images/logo.svg' },
      { rel: 'apple-touch-icon', href: '/images/logo.svg' },
      { rel: 'stylesheet', href: '/styles/styles.css' }
    ]
  }
}
```

**配置说明：**
- `rel: 'icon'` - 标准网站图标（favicon）
- `rel: 'shortcut icon'` - 兼容旧版浏览器的快捷图标
- `rel: 'apple-touch-icon'` - iOS 设备添加到主屏幕时的图标

**图标文件位置：**
- 源文件：`public/images/logo.svg`
- 访问路径：`/images/logo.svg`

## 🔍 其他相关位置

### 2. **README.md** (第 122 行)
文档中提到了 `favicon.ico`，但这是过时的信息，实际已不再使用。

### 3. **components/Layouts/Header.vue** (第 33 行)
使用了 `/images/logo.webp` 作为页面内的 Logo 显示，**不是网站图标**。

## ✅ 总结

- **网站图标（favicon）配置位置**：`nuxt.config.ts` 第 44-49 行
- **图标文件**：`public/images/logo.svg`
- **没有其他位置设置网站图标**
- **Nuxt 3 会自动将 `app.head` 配置注入到所有页面的 `<head>` 标签中**

## 🛠️ 如何修改网站图标

1. 替换 `public/images/logo.svg` 文件
2. 或者修改 `nuxt.config.ts` 中的 `href` 路径指向新的图标文件
3. 如果需要使用不同格式（如 PNG、ICO），修改 `type` 属性：
   - PNG: `type: 'image/png'`
   - ICO: `type: 'image/x-icon'`
   - SVG: `type: 'image/svg+xml'` (当前使用)

