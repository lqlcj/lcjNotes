// @ts-nocheck
import { getKVStorage } from '~/server/utils/kv';
import { handleApiError } from '~/server/utils/errorHandler';
import { verifyAuth } from '~/server/utils/auth';

// 删除朋友圈动态（需要管理员认证）
export default defineEventHandler(async (event) => {
  // 验证身份（使用加密的 session cookie）
  await verifyAuth(event);

  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '缺少动态 ID'
    });
  }

  try {
    const kv = getKVStorage(event);
    const momentKey = `moment:${id}`;
    
    // 删除动态
    await kv.removeItem(momentKey);
    
    // 从动态列表中移除
    const momentsListKey = 'moments:list';
    const momentsList = await kv.getItem(momentsListKey) as string[] || [];
    const updatedList = momentsList.filter(momentId => momentId !== id);
    await kv.setItem(momentsListKey, updatedList);
    
    return {
      success: true,
      message: '删除成功'
    };
  } catch (error: any) {
    handleApiError(error, '删除朋友圈动态失败', 500);
  }
});




