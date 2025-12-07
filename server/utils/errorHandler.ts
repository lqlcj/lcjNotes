/**
 * 统一的错误处理工具
 * 在生产环境中隐藏详细的错误信息，防止信息泄露
 */

import { createError } from 'h3'

/**
 * 判断是否为生产环境
 */
function isProduction(): boolean {
  return process.env.NODE_ENV === 'production' || process.env.NITRO_PRESET === 'cloudflare-pages'
}

/**
 * 创建安全的错误响应
 * 在生产环境中不返回详细的错误信息
 * 
 * @param statusCode HTTP 状态码
 * @param defaultMessage 默认错误消息（用户友好）
 * @param error 原始错误对象（可选，用于开发环境）
 * @returns 创建的错误对象
 */
export function createSafeError(
  statusCode: number,
  defaultMessage: string,
  error?: any
): any {
  // 在生产环境中，只返回默认消息
  if (isProduction()) {
    return createError({
      statusCode,
      message: defaultMessage
    })
  }
  
  // 在开发环境中，返回详细错误信息（便于调试）
  const message = error?.message 
    ? `${defaultMessage}: ${error.message}`
    : defaultMessage
  
  return createError({
    statusCode,
    message
  })
}

/**
 * 处理 API 错误
 * 统一处理 catch 块中的错误
 * 
 * @param error 错误对象
 * @param defaultMessage 默认错误消息
 * @param statusCode HTTP 状态码（默认 500）
 */
export function handleApiError(
  error: any,
  defaultMessage: string,
  statusCode: number = 500
): never {
  // 如果已经是 createError 创建的错误，直接抛出
  if (error.statusCode) {
    throw error
  }
  
  // 否则使用安全的错误处理
  throw createSafeError(statusCode, defaultMessage, error)
}

