import { getKVStorage } from '~/server/utils/kv';

// 更新文章
export default defineEventHandler(async (event) => {
  // 验证身份
  const authHeader = getHeader(event, 'authorization');
  const adminPassword = useRuntimeConfig().adminPassword || process.env.ADMIN_PASSWORD;
  
  if (!adminPassword || authHeader !== `Bearer ${adminPassword}`) {
    throw createError({
      statusCode: 401,
      message: '未授权访问'
    });
  }
  
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
    
    // 更新文章数据（保留原有数据，只更新提供的字段）
    const updatedPost = {
      ...existingPost,
      ...(body.title !== undefined && { title: body.title }),
      ...(body.date !== undefined && { date: body.date }),
      ...(body.cover !== undefined && { cover: body.cover }),
      ...(body.ratio !== undefined && { ratio: body.ratio }),
      ...(body.user !== undefined && { user: body.user }),
      ...(body.avatar !== undefined && { avatar: body.avatar }),
      ...(body.likes !== undefined && { likes: body.likes }),
      ...(body.body !== undefined && { body: body.body })
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
    throw createError({
      statusCode: 500,
      message: error.message || '更新文章失败'
    });
  }
});

