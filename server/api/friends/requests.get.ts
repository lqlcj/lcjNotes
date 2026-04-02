// @ts-nocheck
/**
 * 友链申请列表接口。
 *
 * 功能：鉴权后读取友链申请并按时间倒序返回。
 */
import { getKVStorage } from '~/server/utils/kv';
import { handleApiError } from '~/server/utils/errorHandler';
import { verifyAuth } from '~/server/utils/auth';

// 获取友链申请列表（需要管理员认证）
export default defineEventHandler(async (event) => {
  // 验证身份（使用加密的 session cookie）
  await verifyAuth(event);

  try {
    const kv = getKVStorage(event);
    const requestsListKey = 'friend-requests:list';
    const requestsList = await kv.getItem(requestsListKey) as string[] || [];
    
    // 获取所有申请详情
    const requests = [];
    for (const id of requestsList) {
      const requestKey = `friend-request:${id}`;
      const requestData = await kv.getItem(requestKey);
      if (requestData) {
        requests.push(requestData);
      }
    }
    
    // 按创建时间倒序排序
    requests.sort((a: any, b: any) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    
    return {
      success: true,
      data: requests
    };
  } catch (error: any) {
    handleApiError(error, '获取申请列表失败', 500);
  }
});


