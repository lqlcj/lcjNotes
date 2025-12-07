import { getKVStorage } from '~/server/utils/kv';
import { handleApiError } from '~/server/utils/errorHandler';
import { setPostDetailCacheHeaders, generateETag, checkETag } from '~/server/utils/cache';
import { setHeader } from 'h3';

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
    
    // 生成响应数据
    const responseData = {
      success: true,
      data: postData
    };
    
    // 生成 ETag 并检查条件请求
    const etag = generateETag(responseData);
    if (checkETag(event, etag)) {
      return; // 返回 304 Not Modified
    }
    
    // 设置缓存头
    setPostDetailCacheHeaders(event);
    setHeader(event, 'ETag', etag);
    
    return responseData;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    handleApiError(error, '获取文章失败', 500);
  }
});

