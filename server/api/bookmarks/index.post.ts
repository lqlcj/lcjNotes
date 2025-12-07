// @ts-nocheck
import { getKVStorage } from '~/server/utils/kv';
import { validateAndTrim, FIELD_LIMITS } from '~/server/utils/validation';
import { handleApiError } from '~/server/utils/errorHandler';
import { verifyAuth } from '~/server/utils/auth';

// 创建书签（需要管理员权限）
export default defineEventHandler(async (event) => {
  // 验证身份（使用加密的 session cookie）
  await verifyAuth(event);

  const body = await readBody(event);
  
  // 验证并清理输入
  const name = validateAndTrim(body.name, FIELD_LIMITS.BOOKMARK_NAME, '书签名称');
  const url = validateAndTrim(body.url, FIELD_LIMITS.BOOKMARK_URL, '书签链接');
  const description = body.description ? validateAndTrim(body.description, FIELD_LIMITS.BOOKMARK_DESCRIPTION, '书签描述') : '';
  
  // 验证必填字段
  if (!name || !url) {
    throw createError({
      statusCode: 400,
      message: '网站名称和链接不能为空'
    });
  }

  // 验证 URL 格式
  try {
    new URL(url);
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
      name: name,
      url: url,
      description: description,
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
    handleApiError(error, '添加书签失败', 500);
  }
});



