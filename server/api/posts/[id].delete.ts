// @ts-nocheck
import { getKVStorage } from '~/server/utils/kv';
import { getR2Storage, extractR2KeyFromUrl, extractImageUrlsFromMarkdown } from '~/server/utils/r2';
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
    
    // 收集所有需要删除的图片 URL
    const imageUrlsToDelete: string[] = [];
    
    // 1. 添加封面图片
    if (existingPost.cover) {
      imageUrlsToDelete.push(existingPost.cover);
      console.log(`文章封面图片: ${existingPost.cover}`);
    }
    
    // 2. 从文章内容中提取所有图片 URL
    if (existingPost.body) {
      const contentImageUrls = extractImageUrlsFromMarkdown(existingPost.body);
      imageUrlsToDelete.push(...contentImageUrls);
      if (contentImageUrls.length > 0) {
        console.log(`从文章内容提取到 ${contentImageUrls.length} 张图片`);
      }
    }
    
    // 删除所有 R2 图片
    if (imageUrlsToDelete.length > 0) {
      console.log(`开始删除文章图片，共 ${imageUrlsToDelete.length} 张`);
      try {
        const r2 = getR2Storage(event);
        
        for (const imageUrl of imageUrlsToDelete) {
          console.log(`处理图片URL: ${imageUrl}`);
          const r2Key = extractR2KeyFromUrl(imageUrl);
          
          if (r2Key) {
            console.log(`提取到R2 key: ${r2Key}`);
            try {
              await r2.delete(r2Key);
              console.log(`✓ 已删除R2图片: ${r2Key}`);
            } catch (deleteError) {
              // 如果删除失败，记录日志但不中断流程
              console.error(`✗ 删除R2图片失败 ${r2Key}:`, deleteError);
            }
          } else {
            console.log(`⚠ 无法从URL提取R2 key，跳过: ${imageUrl}`);
          }
        }
      } catch (r2Error) {
        // R2操作失败，记录日志但不中断删除流程
        console.error('删除文章图片时出错:', r2Error);
      }
    } else {
      console.log('文章没有图片，跳过图片删除');
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

