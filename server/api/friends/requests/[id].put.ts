import { getKVStorage } from '~/server/utils/kv';

// 更新友链申请状态（批准或拒绝）
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
      message: '缺少申请 ID'
    });
  }

  if (!body.status || !['approved', 'rejected'].includes(body.status)) {
    throw createError({
      statusCode: 400,
      message: '无效的状态，必须是 approved 或 rejected'
    });
  }

  try {
    const kv = getKVStorage(event);
    const requestKey = `friend-request:${id}`;
    const requestData = await kv.getItem(requestKey) as any;
    
    if (!requestData) {
      throw createError({
        statusCode: 404,
        message: '申请不存在'
      });
    }

    // 更新申请状态
    requestData.status = body.status;
    requestData.reviewedAt = new Date().toISOString();
    
    await kv.setItem(requestKey, requestData);

    // 如果批准，添加到已批准友链列表
    if (body.status === 'approved') {
      const friendsListKey = 'friends:list';
      const friendsList = await kv.getItem(friendsListKey) as string[] || [];
      
      // 检查是否已存在
      if (!friendsList.includes(id)) {
        friendsList.push(id);
        await kv.setItem(friendsListKey, friendsList);
        
        // 保存友链详情
        const friendKey = `friend:${id}`;
        const friendData = {
          id: id,
          name: requestData.name,
          url: requestData.url,
          description: requestData.description,
          avatar: requestData.avatar || '/images/home/avatar.webp',
          date: new Date().toISOString().split('T')[0]
        };
        await kv.setItem(friendKey, friendData);
      }
    }

    return {
      success: true,
      data: requestData
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: error.message || '更新申请状态失败'
    });
  }
});


