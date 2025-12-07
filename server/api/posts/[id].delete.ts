// @ts-nocheck
import { getKVStorage } from '~/server/utils/kv';
import { getR2Storage, extractR2KeyFromUrl } from '~/server/utils/r2';
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
    const existingPost = await kv.getItem(postKey) as any;
    
    if (!existingPost) {
      throw createError({
        statusCode: 404,
        message: '文章不存在'
      });
    }
    
    // 删除封面图片（如果存在且是R2图片）
    if (existingPost.cover) {
      try {
        const r2Key = extractR2KeyFromUrl(existingPost.cover);
        if (r2Key) {
          const r2 = getR2Storage(event);
          try {
            await r2.delete(r2Key);
            console.log(`已删除文章封面图片: ${r2Key}`);
          } catch (deleteError) {
            // 如果删除失败，记录日志但不中断流程
            console.error(`删除封面图片失败 ${r2Key}:`, deleteError);
          }
        }
      } catch (r2Error) {
        // R2操作失败，记录日志但不中断删除流程
        console.error('删除文章封面图片时出错:', r2Error);
      }
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

