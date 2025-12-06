import { getKVStorage } from '~/server/utils/kv';

// 获取已批准的友链列表（公开接口）
export default defineEventHandler(async (event) => {
  try {
    const kv = getKVStorage(event);
    const friendsListKey = 'friends:list';
    const friendsList = await kv.getItem(friendsListKey) as string[] || [];
    
    // 获取所有已批准友链详情
    const friends = [];
    for (const id of friendsList) {
      const friendKey = `friend:${id}`;
      const friendData = await kv.getItem(friendKey);
      if (friendData) {
        friends.push(friendData);
      }
    }
    
    // 按日期倒序排序
    friends.sort((a: any, b: any) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    
    return {
      success: true,
      data: friends
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || '获取友链列表失败'
    });
  }
});


