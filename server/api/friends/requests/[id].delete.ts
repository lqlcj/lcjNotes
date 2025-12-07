// @ts-nocheck
import { getKVStorage } from '~/server/utils/kv';
import { handleApiError } from '~/server/utils/errorHandler';
import { verifyAuth } from '~/server/utils/auth';

// 删除友链申请
export default defineEventHandler(async (event) => {
  // 验证身份（使用加密的 session cookie）
  await verifyAuth(event);

  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '缺少申请 ID'
    });
  }

  try {
    const kv = getKVStorage(event);
    const requestKey = `friend-request:${id}`;
    
    // 删除申请
    await kv.removeItem(requestKey);
    
    // 从申请列表中移除
    const requestsListKey = 'friend-requests:list';
    const requestsList = await kv.getItem(requestsListKey) as string[] || [];
    const updatedList = requestsList.filter(reqId => reqId !== id);
    await kv.setItem(requestsListKey, updatedList);
    
    return {
      success: true,
      message: '删除成功'
    };
  } catch (error: any) {
    handleApiError(error, '删除申请失败', 500);
  }
});


