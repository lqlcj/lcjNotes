import { getKVStorage } from '~/server/utils/kv';

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
    throw createError({
      statusCode: 500,
      message: error.message || '获取朋友圈动态失败'
    });
  }
});


