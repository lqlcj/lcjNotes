// @ts-nocheck
/**
 * Session 管理工具
 * 使用加密的 HttpOnly Cookie 存储会话信息
 */

import { getCookie, setCookie, deleteCookie, createError } from 'h3'

// Session 配置
const SESSION_COOKIE_NAME = 'admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 天
const SESSION_SECRET_MIN_LENGTH = 32

/**
 * 获取 Session Secret
 * 从环境变量或运行时配置获取，如果不存在则生成一个（仅开发环境）
 */
function getSessionSecret(): string {
  const config = useRuntimeConfig()
  const secret = config.sessionSecret || process.env.SESSION_SECRET
  
  if (secret && secret.length >= SESSION_SECRET_MIN_LENGTH) {
    return secret
  }
  
  // 生产环境必须配置 SESSION_SECRET
  if (process.env.NODE_ENV === 'production' || process.env.NITRO_PRESET === 'cloudflare-pages') {
    throw new Error('SESSION_SECRET must be configured in production environment')
  }
  
  // 开发环境使用默认密钥（不安全，仅用于开发）
  console.warn('⚠️  Warning: Using default session secret in development. Set SESSION_SECRET in production!')
  return 'dev-session-secret-key-change-in-production-' + Date.now()
}

/**
 * 简单的加密函数（使用 Web Crypto API）
 * 兼容 Cloudflare Workers 环境
 */
async function encryptSession(data: string, secret: string): Promise<string> {
  try {
    const encoder = new TextEncoder()
    const dataBytes = encoder.encode(data)
    const secretBytes = encoder.encode(secret)
    
    // 使用 Web Crypto API 进行 HMAC 签名
    // Cloudflare Workers 支持 Web Crypto API
    const key = await crypto.subtle.importKey(
      'raw',
      secretBytes,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign']
    )
    
    const signature = await crypto.subtle.sign('HMAC', key, dataBytes)
    const signatureArray = new Uint8Array(signature)
    const signatureBase64 = btoa(String.fromCharCode(...signatureArray))
    const dataBase64 = btoa(String.fromCharCode(...dataBytes))
    
    // 组合：数据 + 签名 + 时间戳
    const timestamp = Date.now()
    return `${dataBase64}.${signatureBase64}.${timestamp}`
  } catch (error) {
    console.error('Session encryption error:', error)
    throw error
  }
}

/**
 * 解密 Session
 */
async function decryptSession(encrypted: string, secret: string): Promise<string | null> {
  try {
    const parts = encrypted.split('.')
    if (parts.length !== 3) {
      return null
    }
    
    const [dataBase64, signatureBase64, timestamp] = parts
    
    // 检查时间戳（7 天过期）
    const sessionTime = parseInt(timestamp, 10)
    if (Date.now() - sessionTime > SESSION_MAX_AGE * 1000) {
      return null // Session 已过期
    }
    
    // 验证签名
    const encoder = new TextEncoder()
    const dataBytes = Uint8Array.from(atob(dataBase64), c => c.charCodeAt(0))
    const secretBytes = encoder.encode(secret)
    
    const key = await crypto.subtle.importKey(
      'raw',
      secretBytes,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    )
    
    const signature = Uint8Array.from(atob(signatureBase64), c => c.charCodeAt(0))
    const isValid = await crypto.subtle.verify('HMAC', key, signature, dataBytes)
    
    if (!isValid) {
      return null // 签名验证失败
    }
    
    // 解码数据
    return atob(dataBase64)
  } catch (error) {
    console.error('Session decryption error:', error)
    return null
  }
}

/**
 * 创建 Session
 * @param event H3 事件对象
 * @param sessionData 会话数据（通常是用户信息）
 */
export async function createSession(event: any, sessionData: { username: string; loginTime: number }): Promise<void> {
  const secret = getSessionSecret()
  const sessionJson = JSON.stringify(sessionData)
  const encrypted = await encryptSession(sessionJson, secret)
  
  // 设置 HttpOnly Cookie
  setCookie(event, SESSION_COOKIE_NAME, encrypted, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || process.env.NITRO_PRESET === 'cloudflare-pages', // 生产环境使用 HTTPS
    sameSite: 'strict',
    maxAge: SESSION_MAX_AGE,
    path: '/'
  })
}

/**
 * 获取用户 Session（重命名以避免与 h3 的 getSession 冲突）
 * @param event H3 事件对象
 * @returns 会话数据或 null
 */
export async function getUserSession(event: any): Promise<{ username: string; loginTime: number } | null> {
  const encrypted = getCookie(event, SESSION_COOKIE_NAME)
  
  if (!encrypted) {
    return null
  }
  
  const secret = getSessionSecret()
  const decrypted = await decryptSession(encrypted, secret)
  
  if (!decrypted) {
    return null
  }
  
  try {
    return JSON.parse(decrypted)
  } catch (error) {
    console.error('Session parse error:', error)
    return null
  }
}

/**
 * 删除 Session（登出）
 * @param event H3 事件对象
 */
export function destroySession(event: any): void {
  deleteCookie(event, SESSION_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production' || process.env.NITRO_PRESET === 'cloudflare-pages',
    sameSite: 'strict',
    path: '/'
  })
}

/**
 * 验证用户是否已登录
 * @param event H3 事件对象
 * @returns 如果已登录返回 true，否则返回 false
 */
export async function isAuthenticated(event: any): Promise<boolean> {
  const session = await getUserSession(event)
  return session !== null
}

/**
 * 验证用户身份（用于需要认证的 API）
 * 如果未认证，抛出 401 错误
 */
export async function requireAuth(event: any): Promise<void> {
  const session = await getUserSession(event)
  
  if (!session) {
    throw createError({
      statusCode: 401,
      message: '未授权访问，请先登录'
    })
  }
}

