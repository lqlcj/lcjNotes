import { isAuthenticated } from '~/server/utils/session';

// 检查登录状态
export default defineEventHandler(async (event) => {
  const authenticated = await isAuthenticated(event);
  
  return {
    success: true,
    authenticated
  };
});

