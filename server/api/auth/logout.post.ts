// @ts-nocheck
import { destroySession } from '~/server/utils/session';

// 登出接口
export default defineEventHandler(async (event) => {
  destroySession(event);
  
  return {
    success: true,
    message: '已成功登出'
  };
});

