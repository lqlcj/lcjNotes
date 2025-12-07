import { getKVStorage } from '~/server/utils/kv';

// 更新朋友圈动态（需要管理员认证）
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
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '缺少动态 ID'
    });
  }

  try {
    const kv = getKVStorage(event);
    const momentKey = `moment:${id}`;
    const momentData = await kv.getItem(momentKey) as any;
    
    if (!momentData) {
      throw createError({
        statusCode: 404,
        message: '动态不存在'
      });
    }
    
    // 更新数据（保留原有数据，只更新提供的字段）
    const updatedData = {
      ...momentData,
      author: {
        nickname: body.author?.nickname || momentData.author?.nickname || 'Leyili',
        avatar: body.author?.avatar || momentData.author?.avatar || '/images/home/avatar.webp'
      },
      content: body.content !== undefined ? body.content : momentData.content,
      timestamp: body.timestamp !== undefined ? body.timestamp : momentData.timestamp,
      images: body.images !== undefined ? body.images : momentData.images || []
    };
    
    await kv.setItem(momentKey, updatedData);
    
    return {
      success: true,
      data: updatedData,
      message: '朋友圈动态更新成功'
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: error.message || '更新朋友圈动态失败'
    });
  }
});




