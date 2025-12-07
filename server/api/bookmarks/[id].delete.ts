// @ts-nocheck
import { getKVStorage } from '~/server/utils/kv';
import { handleApiError } from '~/server/utils/errorHandler';
import { verifyAuth } from '~/server/utils/auth';

// 删除书签（需要管理员权限）
export default defineEventHandler(async (event) => {
  // 验证身份（使用加密的 session cookie）
  await verifyAuth(event);

  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '书签 ID 不能为空'
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
    
    // 删除书签详情
    await kv.removeItem(bookmarkKey);
    
    // 从列表中移除
    const bookmarksListKey = 'bookmarks:list';
    const bookmarksList = await kv.getItem(bookmarksListKey) as string[] || [];
    const updatedList = bookmarksList.filter(bookmarkId => bookmarkId !== id);
    await kv.setItem(bookmarksListKey, updatedList);
    
    return {
      success: true,
      message: '书签删除成功'
    };
  } catch (error: any) {
    handleApiError(error, '删除书签失败', 500);
  }
});



