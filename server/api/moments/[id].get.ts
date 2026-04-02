// @ts-nocheck
/**
 * 单条朋友圈接口（公开）。
 *
 * 功能：按 ID 读取单条动态详情。
 */
import { getKVStorage } from '~/server/utils/kv';
import { handleApiError } from '~/server/utils/errorHandler';

// 获取单个朋友圈动态（公开接口）
export default defineEventHandler(async (event) => {
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
    const momentData = await kv.getItem(momentKey);
    
    if (!momentData) {
      throw createError({
        statusCode: 404,
        message: '动态不存在'
      });
    }
    
    return {
      success: true,
      data: momentData
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    handleApiError(error, '获取朋友圈动态失败', 500);
  }
});




