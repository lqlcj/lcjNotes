# 友链交换功能使用说明

## 📋 功能概述

这是一个无后端的友链交换系统，访客可以提交友链申请，你审核后手动添加到友链列表。

## 🚀 快速开始

### 1. 友链数据管理

友链数据存储在：`src/data/friends.json`

**数据格式：**
```json
[
  {
    "name": "网站名称",
    "url": "https://example.com",
    "description": "网站描述",
    "avatar": "https://example.com/avatar.jpg",
    "date": "2025-01-01"
  }
]
```

**添加友链步骤：**
1. 打开 `src/data/friends.json`
2. 按照格式添加新的友链对象
3. 保存文件，网站会自动更新

### 2. 审核友链申请

**方式一：通过 GitHub Issues（推荐）**

1. 访客提交申请后，会在你的 GitHub 仓库中创建一个 Issue
2. 访问：https://github.com/lqlcj/vueblog/issues
3. 找到标题为 "友链申请：xxx" 的 Issue
4. 查看申请信息，审核通过后：
   - 将友链信息添加到 `src/data/friends.json`
   - 在 Issue 中回复 "已添加"，然后关闭 Issue

**方式二：直接添加（如果你认识对方）**

直接编辑 `src/data/friends.json` 文件添加友链。

## ⚙️ 配置说明

### 修改 GitHub 仓库

如果你想使用其他 GitHub 仓库，修改 `src/utils/githubApi.js`：

```javascript
// 默认值
const repo = 'lqlcj/vueblog'

// 修改为你的仓库
const repo = 'your-username/your-repo'
```

### 使用 GitHub API（可选，需要 Token）

如果你想使用 API 自动创建 Issue（而不是跳转链接），需要：

1. **创建 GitHub Token：**
   - 访问：https://github.com/settings/tokens
   - 点击 "Generate new token (classic)"
   - 勾选 `public_repo` 权限
   - 生成 Token

2. **配置环境变量：**
   - 在项目根目录创建 `.env` 文件：
     ```
     VITE_GITHUB_TOKEN=your_token_here
     ```
   - ⚠️ **重要：** `.env` 文件不要提交到 Git！

3. **修改代码：**
   - 在 `src/components/Friends/FriendRequestForm.vue` 中
   - 将 `generateIssueLink` 改为 `createIssueViaAPI`

## 📝 使用流程

### 访客申请友链

1. 访客访问你的博客主页
2. 滚动到页面底部，找到"友情链接"区域
3. 填写申请表单：
   - 网站名称（必填）
   - 网站链接（必填）
   - 网站描述（可选）
   - 网站图标（可选）
4. 点击"提交申请"
5. 系统会跳转到 GitHub Issue 创建页面
6. 访客在 GitHub 上提交 Issue

### 你审核友链

1. 收到 GitHub Issue 通知
2. 查看申请信息
3. 访问申请者的网站，确认是否符合友链要求
4. 如果通过：
   - 编辑 `src/data/friends.json` 添加友链
   - 在 Issue 中回复确认
   - 关闭 Issue
5. 如果拒绝：
   - 在 Issue 中说明原因
   - 关闭 Issue

## 🎨 自定义样式

所有组件都使用了你的页面主题样式（玻璃态风格），如果需要调整：

- **友链卡片样式：** `src/components/Friends/FriendsList.vue`
- **申请表单样式：** `src/components/Friends/FriendRequestForm.vue`
- **整体布局：** `src/components/Friends/FriendsSection.vue`

## ❓ 常见问题

**Q: 友链数据更新后，网站没有变化？**
A: 刷新浏览器缓存，或重新构建项目。

**Q: 如何删除友链？**
A: 直接从 `src/data/friends.json` 中删除对应的对象。

**Q: 可以设置友链数量限制吗？**
A: 可以在 `FriendsList.vue` 中添加数量限制逻辑。

**Q: 如何修改友链展示的列数？**
A: 修改 `FriendsList.vue` 中的 `grid-template-columns` 样式。

## 📚 文件结构

```
src/
├── components/
│   └── Friends/
│       ├── FriendsSection.vue    # 主组件（整合列表和表单）
│       ├── FriendsList.vue       # 友链展示列表
│       ├── FriendRequestForm.vue  # 申请表单
│       └── README.md              # 使用说明（本文件）
├── data/
│   └── friends.json              # 友链数据文件
└── utils/
    └── githubApi.js              # GitHub API 工具
```

## 🔒 安全提示

1. **不要提交 Token：** 如果使用 GitHub API，确保 `.env` 文件在 `.gitignore` 中
2. **验证链接：** 审核友链时，确保链接安全可靠
3. **定期检查：** 定期检查友链是否仍然有效

---

如有问题，请查看代码注释或提交 Issue。

