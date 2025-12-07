import { getKVStorage } from '~/server/utils/kv';
import { validateAndTrim, validateLength, FIELD_LIMITS } from '~/server/utils/validation';
import { handleApiError } from '~/server/utils/errorHandler';
import { verifyAuth } from '~/server/utils/auth';

// 更新文章
export default defineEventHandler(async (event) => {
  // 验证身份（使用加密的 session cookie）
  await verifyAuth(event);
  
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
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
    
    // 验证并清理输入（只验证提供的字段）
    const updates: any = {}
    if (body.title !== undefined) {
      updates.title = validateAndTrim(body.title, FIELD_LIMITS.POST_TITLE, '标题')
    }
    if (body.body !== undefined) {
      updates.body = validateAndTrim(body.body, FIELD_LIMITS.POST_BODY, '文章内容')
    }
    if (body.user !== undefined) {
      updates.user = validateAndTrim(body.user, FIELD_LIMITS.POST_USER, '作者')
    }
    if (body.cover !== undefined) {
      updates.cover = validateAndTrim(body.cover, FIELD_LIMITS.POST_COVER, '封面')
    }
    if (body.avatar !== undefined) {
      updates.avatar = validateAndTrim(body.avatar, FIELD_LIMITS.FRIEND_AVATAR, '头像')
    }
    if (body.date !== undefined) {
      updates.date = body.date
    }
    if (body.ratio !== undefined) {
      updates.ratio = body.ratio
    }
    if (body.likes !== undefined) {
      updates.likes = body.likes
    }
    
    // 更新文章数据（保留原有数据，只更新提供的字段）
    const updatedPost = {
      ...existingPost,
      ...updates
    };
    
    await kv.setItem(postKey, updatedPost);
    
    return {
      success: true,
      data: updatedPost
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    handleApiError(error, '更新文章失败', 500);
  }
});

