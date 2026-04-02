// @ts-nocheck
/**
 * 文章列表接口。
 *
 * 功能：读取 KV 中的文章元数据列表，按日期排序并支持 ETag 缓存。
 */
import { getKVStorage } from '~/server/utils/kv';
import { handleApiError } from '~/server/utils/errorHandler';
import { setPostsListCacheHeaders, generateETag, checkETag } from '~/server/utils/cache';
import { setHeader } from 'h3';

// 获取所有文章列表（只返回元数据）
export default defineEventHandler(async (event) => {
  try {
    // 获取 KV 存储
    const kv = getKVStorage(event);
    
    // 从 KV 获取所有文章的 ID 列表
    const postsListKey = 'posts:list';
    const postsList = await kv.getItem(postsListKey) as string[] || [];

    // 遍历列表读取文章元数据
    const posts = [];
    for (const postId of postsList) {
      const postKey = `post:${postId}`;
      const postData = await kv.getItem(postKey) as any;
      if (postData) {
        // 只返回元数据，不返回完整内容
        posts.push({
          id: postId,
          title: postData.title || '无标题',
          date: postData.date || '',
          cover: postData.cover || '',
          ratio: postData.ratio || 0.75,
          user: postData.user || 'lcj',
          avatar: postData.avatar || '',
          likes: postData.likes || 0,
          // 不返回 body 内容，减少传输量
        });
      }
    }

    // 按日期降序排序
    posts.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });

    // 生成响应数据
    const responseData = {
      success: true,
      data: posts
    };

    // 生成 ETag 并检查条件请求
    const etag = generateETag(responseData);
    if (checkETag(event, etag)) {
      return; // 返回 304 Not Modified
    }

    // 设置缓存头
    setPostsListCacheHeaders(event);
    setHeader(event, 'ETag', etag);

    return responseData;
  } catch (error: any) {
    // 使用安全的错误处理，但 GET 请求返回错误对象而不是抛出
    const isProd = process.env.NODE_ENV === 'production' || process.env.NITRO_PRESET === 'cloudflare-pages';
    return {
      success: false,
      error: isProd ? '获取文章列表失败' : (error.message || '获取文章列表失败')
    };
  }
});

