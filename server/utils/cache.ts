/**
 * 缓存工具函数
 * 用于设置 HTTP 缓存头，提升 API 性能
 */

import { setHeader, getHeader, setResponseStatus } from 'h3'

/**
 * 设置缓存响应头
 * 
 * @param event H3 事件对象
 * @param maxAge 最大缓存时间（秒）
 * @param staleWhileRevalidate 在重新验证时允许使用过期缓存的时间（秒）
 * @param mustRevalidate 是否必须重新验证
 */
export function setCacheHeaders(
  event: any,
  maxAge: number = 300, // 默认 5 分钟
  staleWhileRevalidate: number = 0,
  mustRevalidate: boolean = false
): void {
  let cacheControl = `public, max-age=${maxAge}`
  
  if (staleWhileRevalidate > 0) {
    cacheControl += `, stale-while-revalidate=${staleWhileRevalidate}`
  }
  
  if (mustRevalidate) {
    cacheControl += ', must-revalidate'
  }
  
  setHeader(event, 'Cache-Control', cacheControl)
  
  // 设置 ETag 支持（基于当前时间戳，实际应用中可以使用内容哈希）
  // 注意：这里使用简单的时间戳，实际生产环境可以使用内容哈希
  const etag = `"${Date.now()}"`
  setHeader(event, 'ETag', etag)
}

/**
 * 为文章列表设置缓存头
 * 列表更新频率较高，使用较短的缓存时间
 */
export function setPostsListCacheHeaders(event: any): void {
  // 文章列表：缓存 2 分钟，允许在重新验证时使用过期缓存 5 分钟
  setCacheHeaders(event, 120, 300, false)
}

/**
 * 为文章详情设置缓存头
 * 单篇文章更新频率较低，使用较长的缓存时间
 */
export function setPostDetailCacheHeaders(event: any): void {
  // 文章详情：缓存 1 小时，允许在重新验证时使用过期缓存 1 天
  setCacheHeaders(event, 3600, 86400, false)
}

/**
 * 检查 ETag 条件请求
 * 如果客户端提供了 If-None-Match 头且匹配，返回 304 Not Modified
 * 
 * @param event H3 事件对象
 * @param etag 当前资源的 ETag
 * @returns 如果匹配返回 true，需要继续处理返回 false
 */
export function checkETag(event: any, etag: string): boolean {
  const ifNoneMatch = getHeader(event, 'if-none-match')
  
  if (ifNoneMatch && ifNoneMatch === etag) {
    setResponseStatus(event, 304)
    return true
  }
  
  return false
}

/**
 * 生成基于内容的 ETag
 * 使用内容的哈希值生成 ETag，更准确
 * 
 * @param content 内容（可以是对象、字符串等）
 * @returns ETag 字符串
 */
export function generateETag(content: any): string {
  // 简单实现：使用 JSON 字符串的哈希
  // 实际生产环境可以使用更强大的哈希算法（如 SHA-256）
  const contentStr = typeof content === 'string' ? content : JSON.stringify(content)
  let hash = 0
  for (let i = 0; i < contentStr.length; i++) {
    const char = contentStr.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 转换为 32 位整数
  }
  return `"${Math.abs(hash).toString(16)}"`
}

