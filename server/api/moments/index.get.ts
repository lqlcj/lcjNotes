import { getKVStorage } from '~/server/utils/kv';

// 获取所有朋友圈动态列表（公开接口）
export default defineEventHandler(async (event) => {
  try {
    const kv = getKVStorage(event);
    const momentsListKey = 'moments:list';
    const momentsList = await kv.getItem(momentsListKey) as string[] || [];
    
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
    throw createError({
      statusCode: 500,
      message: error.message || '获取朋友圈动态失败'
    });
  }
});




