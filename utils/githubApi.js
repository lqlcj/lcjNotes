/**
 * GitHub Issues API 工具
 * 
 * 功能：通过 GitHub Issues API 创建友链申请
 * 
 * 使用说明：
 * 1. 方案一（推荐）：使用 GitHub Issue 表单链接
 *    - 不需要 Token，直接跳转到 GitHub 提交 Issue
 *    - 更安全，不需要暴露 Token
 * 
 * 2. 方案二：使用 GitHub API（需要 Token）
 *    - 需要创建 GitHub Personal Access Token
 *    - 在 .env 文件中配置 GITHUB_TOKEN
 *    - 注意：Token 不要提交到代码仓库！
 * 
 * 配置步骤：
 * 1. 访问 https://github.com/settings/tokens
 * 2. 点击 "Generate new token (classic)"
 * 3. 勾选 "public_repo" 权限
 * 4. 生成 Token 后，在项目根目录创建 .env 文件：
 *    GITHUB_TOKEN=your_token_here
 * 5. 在 vite.config.js 中配置环境变量
 */

/**
 * 方案一：生成 GitHub Issue 表单链接（推荐，无需 Token）
 * @param {Object} formData - 表单数据
 * @param {string} repo - GitHub 仓库（格式：username/repo）
 * @returns {string} GitHub Issue 创建链接
 */
export function generateIssueLink(formData, repo = 'lqlcj/vueblog') {
  const title = encodeURIComponent(`友链申请：${formData.name}`);
  const body = encodeURIComponent(`
## 友链申请信息

- **网站名称**：${formData.name}
- **网站链接**：${formData.url}
- **网站描述**：${formData.description}
- **网站图标**：${formData.avatar || '未提供'}

---

请审核后，将友链信息添加到 \`src/data/friends.json\` 文件中。
  `);
  
  return `https://github.com/${repo}/issues/new?title=${title}&body=${body}`;
}

/**
 * 方案二：通过 GitHub API 创建 Issue（需要 Token）
 * @param {Object} formData - 表单数据
 * @param {string} repo - GitHub 仓库（格式：username/repo）
 * @returns {Promise<Object>} GitHub API 响应
 */
export async function createIssueViaAPI(formData, repo = 'lqlcj/vueblog') {
  const token = import.meta.env.VITE_GITHUB_TOKEN;
  
  if (!token) {
    throw new Error('未配置 GitHub Token，请使用方案一（跳转链接）');
  }

  const [owner, repoName] = repo.split('/');
  
  const issueData = {
    title: `友链申请：${formData.name}`,
    body: `
## 友链申请信息

- **网站名称**：${formData.name}
- **网站链接**：${formData.url}
- **网站描述**：${formData.description}
- **网站图标**：${formData.avatar || '未提供'}

---

请审核后，将友链信息添加到 \`src/data/friends.json\` 文件中。
    `,
    labels: ['友链申请']
  };

  try {
    const response = await fetch(`https://api.github.com/repos/${owner}/${repoName}/issues`, {
      method: 'POST',
      headers: {
        'Authorization': `token ${token}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(issueData)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || '创建 Issue 失败');
    }

    return await response.json();
  } catch (error) {
    console.error('GitHub API 错误:', error);
    throw error;
  }
}

/**
 * 使用说明：
 * 
 * 方式一（推荐）：使用跳转链接（无需配置）
 * ```javascript
 * const link = generateIssueLink({
 *   name: '网站名称',
 *   url: 'https://example.com',
 *   description: '网站描述',
 *   avatar: 'https://example.com/avatar.jpg'
 * });
 * window.open(link, '_blank');
 * ```
 * 
 * 方式二：使用 API（需要配置 Token）
 * ```javascript
 * try {
 *   const issue = await createIssueViaAPI({
 *     name: '网站名称',
 *     url: 'https://example.com',
 *     description: '网站描述',
 *     avatar: 'https://example.com/avatar.jpg'
 *   });
 *   console.log('Issue 创建成功:', issue.html_url);
 * } catch (error) {
 *   console.error('创建失败:', error);
 * }
 * ```
 */

