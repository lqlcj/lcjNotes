import { getKVStorage } from '~/server/utils/kv';

// 更新书签（需要管理员权限）
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
      message: '书签 ID 不能为空'
    });
  }

  // 验证必填字段
  if (!body.name || !body.url) {
    throw createError({
      statusCode: 400,
      message: '网站名称和链接不能为空'
    });
  }

  // 验证 URL 格式
  try {
    new URL(body.url);
  } catch {
    throw createError({
      statusCode: 400,
      message: '请输入有效的网站链接'
    });
  }

  try {
    const kv = getKVStorage(event);
    const bookmarkKey = `bookmark:${id}`;
    const existingBookmark = await kv.getItem(bookmarkKey);
    
    if (!existingBookmark) {
      throw createError({
        statusCode: 404,
        message: '书签不存在'
      });
    }
    
    // 更新书签数据
    const bookmarkData = {
      ...existingBookmark,
      name: body.name,
      url: body.url,
      description: body.description || '',
      updatedAt: new Date().toISOString()
    };
    
    await kv.setItem(bookmarkKey, bookmarkData);
    
    return {
      success: true,
      data: bookmarkData,
      message: '书签更新成功'
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || '更新书签失败'
    });
  }
});

