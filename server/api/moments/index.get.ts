import { getKVStorage } from '~/server/utils/kv';
import { handleApiError } from '~/server/utils/errorHandler';

// 获取所有朋友圈动态列表（公开接口）
export default defineEventHandler(async (event) => {
  try {
    const kv = getKVStorage(event);
    const momentsListKey = 'moments:list';
    let momentsList = await kv.getItem(momentsListKey) as string[] || [];
    
    // 🔥 如果列表为空，尝试恢复旧数据（防止数据丢失）
    if (momentsList.length === 0) {
      // 尝试从常见的 ID 范围恢复（1-1000）
      const recoveredIds: string[] = [];
      for (let id = 1; id <= 1000; id++) {
        const momentKey = `moment:${id}`;
        const momentData = await kv.getItem(momentKey);
        if (momentData) {
          recoveredIds.push(String(id));
        }
      }
      
      if (recoveredIds.length > 0) {
        // 恢复列表
        momentsList = recoveredIds;
        await kv.setItem(momentsListKey, momentsList);
      }
    }
    
    // 获取所有动态详情
    const moments = [];
    for (const id of momentsList) {
      const momentKey = `moment:${id}`;
      const momentData = await kv.getItem(momentKey);
      if (momentData) {
        moments.push(momentData);
      }
    }
    
    // 按时间戳倒序排序（最新的在前）
    moments.sort((a: any, b: any) => {
      const timeA = a.timestamp ? new Date(a.timestamp.replace('创建时间: ', '')).getTime() : 0;
      const timeB = b.timestamp ? new Date(b.timestamp.replace('创建时间: ', '')).getTime() : 0;
      return timeB - timeA;
    });
    
    return {
      success: true,
      data: moments
    };
  } catch (error: any) {
    handleApiError(error, '获取朋友圈动态失败', 500);
  }
});




