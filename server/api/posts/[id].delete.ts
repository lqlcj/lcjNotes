// @ts-nocheck
import { getKVStorage } from '~/server/utils/kv';
import { handleApiError } from '~/server/utils/errorHandler';
import { verifyAuth } from '~/server/utils/auth';

// 删除文章
export default defineEventHandler(async (event) => {
  // 验证身份（使用加密的 session cookie）
  await verifyAuth(event);
  
  const id = getRouterParam(event, 'id');
  const kv = getKVStorage(event);
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '缺少文章 ID'
    });
  }
  
  try {
    const postKey = `post:${id}`;
    
    // 检查文章是否存在
    const existingPost = await kv.getItem(postKey);
    if (!existingPost) {
      throw createError({
        statusCode: 404,
        message: '文章不存在'
      });
    }
    
    // 删除文章
    await kv.removeItem(postKey);
    
    // 从文章列表中移除
    const postsListKey = 'posts:list';
    const postsList = await kv.getItem(postsListKey) as string[] || [];
    const updatedList = postsList.filter(postId => postId !== id);
    await kv.setItem(postsListKey, updatedList);
    
    return {
      success: true,
      message: '文章已删除'
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    handleApiError(error, '删除文章失败', 500);
  }
});

