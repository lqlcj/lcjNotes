// @ts-nocheck
/**
 * 输入验证工具函数
 * 用于验证和限制用户输入的长度
 */

// 定义字段长度限制
export const FIELD_LIMITS = {
  // 留言相关
  MESSAGE_NAME: 50,        // 留言姓名
  MESSAGE_EMAIL: 100,      // 邮箱
  MESSAGE_CONTENT: 2000,   // 留言内容
  MESSAGE_WEBSITE: 500,    // 网站链接
  
  // 文章相关
  POST_TITLE: 200,         // 文章标题
  POST_BODY: 50000,        // 文章内容（Markdown）
  POST_USER: 50,           // 作者名
  POST_COVER: 500,         // 封面链接
  
  // 友链相关
  FRIEND_NAME: 100,        // 友链名称
  FRIEND_URL: 500,         // 友链链接
  FRIEND_DESCRIPTION: 500, // 友链描述
  FRIEND_AVATAR: 500,      // 友链头像
  
  // 朋友圈动态相关
  MOMENT_CONTENT: 2000,    // 动态内容
  MOMENT_NICKNAME: 50,     // 昵称
  MOMENT_AVATAR: 500,      // 头像链接
  
  // 书签相关
  BOOKMARK_NAME: 200,      // 书签名称
  BOOKMARK_URL: 500,       // 书签链接
  BOOKMARK_DESCRIPTION: 1000, // 书签描述
} as const

/**
 * 验证字符串长度
 * @param value 要验证的值
 * @param maxLength 最大长度
 * @param fieldName 字段名称（用于错误消息）
 * @returns 验证通过返回 true，否则抛出错误
 */
export function validateLength(value: string | undefined | null, maxLength: number, fieldName: string): void {
  if (value === undefined || value === null) {
    return // 允许空值，由必填验证处理
  }
  
  if (typeof value !== 'string') {
    throw createError({
      statusCode: 400,
      message: `${fieldName}必须是字符串类型`
    })
  }
  
  // 计算实际字符长度（考虑多字节字符）
  const length = Array.from(value).length
  
  if (length > maxLength) {
    throw createError({
      statusCode: 400,
      message: `${fieldName}长度不能超过 ${maxLength} 个字符（当前：${length} 个字符）`
    })
  }
}

/**
 * 验证并清理字符串（去除首尾空格）
 * @param value 要验证的值
 * @param maxLength 最大长度
 * @param fieldName 字段名称
 * @returns 清理后的字符串
 */
export function validateAndTrim(value: string | undefined | null, maxLength: number, fieldName: string): string {
  if (value === undefined || value === null) {
    return ''
  }
  
  const trimmed = String(value).trim()
  validateLength(trimmed, maxLength, fieldName)
  return trimmed
}

