/**
 * 认证工具函数
 * 用于验证用户身份，替代原来的 Bearer token 验证
 */

import { requireAuth } from '~/server/utils/session';

/**
 * 验证用户是否已登录
 * 用于需要认证的 API 端点
 * 如果未登录，会抛出 401 错误
 */
export async function verifyAuth(event: any): Promise<void> {
  await requireAuth(event);
}

/**
 * 检查用户是否为管理员（兼容旧代码）
 * 返回 true 表示已登录，false 表示未登录
 */
export async function isAdmin(event: any): Promise<boolean> {
  try {
    await requireAuth(event);
    return true;
  } catch {
    return false;
  }
}

