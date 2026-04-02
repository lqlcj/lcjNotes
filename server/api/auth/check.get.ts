// @ts-nocheck
/**
 * 登录态检查接口。
 *
 * 功能：读取 Session Cookie 判断是否已登录。
 */
import { isAuthenticated } from '~/server/utils/session';

// 检查登录状态
export default defineEventHandler(async (event) => {
  const authenticated = await isAuthenticated(event);
  
  return {
    success: true,
    authenticated
  };
});

