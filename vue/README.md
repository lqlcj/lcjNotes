# 主页内容组件使用说明

这是一个可复用的 Vue3 组件，包含了原网站主页的所有中间内容区域。

## 文件结构

```
vue/
├── index.vue              # 主组件文件
├── images/                # 图片资源文件夹
│   ├── home/
│   ├── page2/
│   └── page4/
└── README.md              # 本说明文件
```

## 使用方法

### 1. 基本使用

```vue
<template>
  <HomepageContent @download="handleDownload" />
</template>

<script setup>
import HomepageContent from './vue/index.vue'

const handleDownload = () => {
  console.log('下载按钮被点击')
  // 在这里处理下载逻辑
}
</script>
```

### 2. 自定义社交媒体按钮

组件提供了 `social-buttons` 插槽，可以自定义社交媒体按钮：

```vue
<template>
  <HomepageContent @download="handleDownload">
    <template #social-buttons>
      <!-- 在这里添加你的社交媒体按钮 -->
      <div class="fb-like" data-href="your-facebook-page"></div>
    </template>
  </HomepageContent>
</template>
```

### 3. 自定义 Facebook 插件

组件提供了 `facebook-plugin` 插槽，可以自定义 Facebook 插件：

```vue
<template>
  <HomepageContent @download="handleDownload">
    <template #facebook-plugin>
      <!-- 在这里添加你的 Facebook 插件 -->
      <div class="fb-like-box" data-href="your-facebook-page"></div>
    </template>
  </HomepageContent>
</template>
```

## 组件特性

- ✅ 完全独立的组件，不依赖外部背景图
- ✅ 所有图片资源已打包在 `vue/images` 文件夹中
- ✅ 使用 Vue3 Composition API
- ✅ 支持插槽自定义社交媒体按钮和 Facebook 插件
- ✅ 发出 `download` 事件，方便外部处理下载逻辑

## 事件

- `download`: 当用户点击下载按钮时触发

## 插槽

- `social-buttons`: 自定义社交媒体按钮区域
- `facebook-plugin`: 自定义 Facebook 插件区域

## 注意事项

1. 组件已经去除了背景图，只保留内容区域
2. 所有图片资源都在 `vue/images` 文件夹中，迁移时请确保一起复制
3. 组件使用了自定义字体（FuturaStd），如果需要在其他项目中使用，请确保字体文件可用或使用系统字体作为后备
4. 组件样式使用了 scoped，不会影响外部样式

## 迁移到其他项目

1. 复制整个 `vue` 文件夹到你的项目
2. 确保图片路径正确（组件使用相对路径导入图片）
3. 在需要的地方导入并使用组件
4. 如果需要自定义字体，请确保字体文件可用

