import { getKVStorage } from '~/server/utils/kv';

// 创建书签（需要管理员权限）
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

  const body = await readBody(event);
  
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
    
    // 生成新的书签 ID
    const bookmarksListKey = 'bookmarks:list';
    const bookmarksList = await kv.getItem(bookmarksListKey) as string[] || [];
    const newId = bookmarksList.length > 0 
      ? String(Math.max(...bookmarksList.map(id => parseInt(id))) + 1)
      : '1';
    
    // 构建书签数据
    const bookmarkData = {
      id: newId,
      name: body.name,
      url: body.url,
      description: body.description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // 保存书签详情
    const bookmarkKey = `bookmark:${newId}`;
    await kv.setItem(bookmarkKey, bookmarkData);
    
    // 添加到书签列表
    bookmarksList.push(newId);
    await kv.setItem(bookmarksListKey, bookmarksList);
    
    return {
      success: true,
      data: bookmarkData,
      message: '书签添加成功'
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || '添加书签失败'
    });
  }
});

