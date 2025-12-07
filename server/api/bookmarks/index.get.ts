import { getKVStorage } from '~/server/utils/kv';
import { handleApiError } from '~/server/utils/errorHandler';

// 获取所有书签列表（公开接口）
export default defineEventHandler(async (event) => {
  try {
    const kv = getKVStorage(event);
    const bookmarksListKey = 'bookmarks:list';
    const bookmarksList = await kv.getItem(bookmarksListKey) as string[] || [];
    
    // 获取所有书签详情
    const bookmarks = [];
    for (const id of bookmarksList) {
      const bookmarkKey = `bookmark:${id}`;
      const bookmarkData = await kv.getItem(bookmarkKey);
      if (bookmarkData) {
        bookmarks.push(bookmarkData);
      }
    }
    
    // 按创建时间倒序排序（最新的在前）
    bookmarks.sort((a: any, b: any) => {
      const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return timeB - timeA;
    });
    
    return {
      success: true,
      data: bookmarks
    };
  } catch (error: any) {
    handleApiError(error, '获取书签列表失败', 500);
  }
});



