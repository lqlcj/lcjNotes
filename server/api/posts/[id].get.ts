import { getKVStorage } from '~/server/utils/kv';

// 获取单篇文章的完整内容
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '缺少文章 ID'
    });
  }
  
  try {
    const kv = getKVStorage(event);
    const postKey = `post:${id}`;
    const postData = await kv.getItem(postKey) as any;
    
    if (!postData) {
      throw createError({
        statusCode: 404,
        message: '文章不存在'
      });
    }
    
    return {
      success: true,
      data: postData
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: error.message || '获取文章失败'
    });
  }
});

