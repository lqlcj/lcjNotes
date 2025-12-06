import { getKVStorage } from '~/server/utils/kv';

// 管理员直接添加友链（不需要经过申请流程）
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
    
    // 生成新的友链 ID
    const friendsListKey = 'friends:list';
    const friendsList = await kv.getItem(friendsListKey) as string[] || [];
    const newId = friendsList.length > 0 
      ? String(Math.max(...friendsList.map(id => parseInt(id))) + 1)
      : '1';
    
    // 构建友链数据
    const friendData = {
      id: newId,
      name: body.name,
      url: body.url,
      description: body.description || '',
      avatar: body.avatar || '/images/home/avatar.webp',
      date: new Date().toISOString().split('T')[0]
    };
    
    // 保存友链详情
    const friendKey = `friend:${newId}`;
    await kv.setItem(friendKey, friendData);
    
    // 添加到友链列表
    friendsList.push(newId);
    await kv.setItem(friendsListKey, friendsList);
    
    return {
      success: true,
      data: friendData,
      message: '友链添加成功'
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || '添加友链失败'
    });
  }
});

