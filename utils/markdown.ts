import { default as MarkdownIt } from 'markdown-it'

/**
 * Markdown 渲染器（信任自身内容，尽量还原原始功能）
 * - 允许内联/块级 HTML
 * - 支持链接自动识别
 * - 软换行转 <br> 保留单行换行
 */
export function createSafeMarkdownIt() {
  return new MarkdownIt({
    html: true,       // 允许 HTML
    linkify: true,    // 自动识别链接
    typographer: true,
    breaks: true      // 单换行转 <br>
  })
}

