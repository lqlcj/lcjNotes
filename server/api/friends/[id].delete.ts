import { getKVStorage } from '~/server/utils/kv';

// 删除已批准的友链（需要管理员认证）
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
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '缺少友链 ID'
    });
  }

  try {
    const kv = getKVStorage(event);
    const friendKey = `friend:${id}`;
    
    // 删除友链
    await kv.removeItem(friendKey);
    
    // 从友链列表中移除
    const friendsListKey = 'friends:list';
    const friendsList = await kv.getItem(friendsListKey) as string[] || [];
    const updatedList = friendsList.filter(friendId => friendId !== id);
    await kv.setItem(friendsListKey, updatedList);
    
    return {
      success: true,
      message: '删除成功'
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || '删除友链失败'
    });
  }
});


