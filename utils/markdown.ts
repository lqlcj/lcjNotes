import { default as MarkdownIt } from 'markdown-it'

/**
 * 创建安全的 Markdown 解析器
 * 禁用危险的 HTML 标签以防止 XSS 攻击
 * 可以在客户端和服务端使用
 */
export function createSafeMarkdownIt() {
  const md = new MarkdownIt({
    html: true, // 允许 HTML，但我们会过滤危险标签
    linkify: true,
    typographer: true
  })

  // 禁用危险的 HTML 标签
  // 这些标签可能被用于 XSS 攻击
  const dangerousTags = [
    'script',
    'iframe',
    'object',
    'embed',
    'form',
    'input',
    'button',
    'select',
    'textarea',
    'meta',
    'link',
    'style',
    'base',
    'frame',
    'frameset'
  ]

  // 重写 HTML 渲染规则，过滤危险标签
  const defaultRender = md.renderer.rules.html_block || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.html_block = function(tokens, idx, options, env, self) {
    const token = tokens[idx]
    const content = token.content || ''
    
    // 检查是否包含危险标签
    const hasDangerousTag = dangerousTags.some(tag => {
      const regex = new RegExp(`<${tag}[\\s>]`, 'i')
      return regex.test(content)
    })
    
    if (hasDangerousTag) {
      // 移除危险标签，只保留文本内容
      let safeContent = content
      dangerousTags.forEach(tag => {
        const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gis')
        safeContent = safeContent.replace(regex, '')
        const selfClosingRegex = new RegExp(`<${tag}[^>]*/?>`, 'gi')
        safeContent = safeContent.replace(selfClosingRegex, '')
      })
      return safeContent
    }
    
    return defaultRender(tokens, idx, options, env, self)
  }

  // 处理行内 HTML
  const defaultInlineRender = md.renderer.rules.html_inline || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.html_inline = function(tokens, idx, options, env, self) {
    const token = tokens[idx]
    const content = token.content || ''
    
    // 检查是否包含危险标签
    const hasDangerousTag = dangerousTags.some(tag => {
      const regex = new RegExp(`<${tag}[\\s>]`, 'i')
      return regex.test(content)
    })
    
    if (hasDangerousTag) {
      // 移除危险标签
      let safeContent = content
      dangerousTags.forEach(tag => {
        const regex = new RegExp(`<${tag}[^>]*>.*?</${tag}>`, 'gis')
        safeContent = safeContent.replace(regex, '')
        const selfClosingRegex = new RegExp(`<${tag}[^>]*/?>`, 'gi')
        safeContent = safeContent.replace(selfClosingRegex, '')
      })
      return safeContent
    }
    
    return defaultInlineRender(tokens, idx, options, env, self)
  }

  // 过滤危险的属性（如 onclick, onerror 等事件处理器）
  md.renderer.rules.link_open = function(tokens, idx, options, env, self) {
    const token = tokens[idx]
    // 移除危险属性
    if (token.attrs) {
      token.attrs = token.attrs.filter(attr => {
        const attrName = attr[0].toLowerCase()
        // 允许 href, title, target, rel 等安全属性
        const safeAttrs = ['href', 'title', 'target', 'rel', 'class', 'id']
        // 移除所有 on* 事件处理器
        if (attrName.startsWith('on')) {
          return false
        }
        // 移除 javascript: 协议
        if (attrName === 'href' && typeof attr[1] === 'string' && attr[1].toLowerCase().startsWith('javascript:')) {
          return false
        }
        return safeAttrs.includes(attrName) || !attrName.startsWith('on')
      })
    }
    return self.renderToken(tokens, idx, options)
  }

  // 确保代码块安全：移除所有属性，只保留纯文本内容
  // markdown-it 默认会转义代码块内容，但我们额外确保安全
  const defaultCodeBlockRender = md.renderer.rules.fence || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.fence = function(tokens, idx, options, env, self) {
    const token = tokens[idx]
    // 移除所有属性，防止通过属性注入
    if (token.attrs) {
      token.attrs = []
    }
    // markdown-it 已经转义了代码块内容，直接使用默认渲染
    return defaultCodeBlockRender(tokens, idx, options, env, self)
  }

  // 确保行内代码安全
  const defaultCodeInlineRender = md.renderer.rules.code_inline || function(tokens, idx, options, env, self) {
    return self.renderToken(tokens, idx, options)
  }

  md.renderer.rules.code_inline = function(tokens, idx, options, env, self) {
    const token = tokens[idx]
    // 移除所有属性
    if (token.attrs) {
      token.attrs = []
    }
    // markdown-it 已经转义了行内代码内容
    return defaultCodeInlineRender(tokens, idx, options, env, self)
  }

  return md
}

