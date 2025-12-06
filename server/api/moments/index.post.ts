import { getKVStorage } from '~/server/utils/kv';

// 创建新朋友圈动态（需要管理员认证）
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
  if (!body.content) {
    throw createError({
      statusCode: 400,
      message: '内容不能为空'
    });
  }

  try {
    const kv = getKVStorage(event);
    
    // 生成新的动态 ID
    const momentsListKey = 'moments:list';
    const momentsList = await kv.getItem(momentsListKey) as string[] || [];
    const newId = momentsList.length > 0 
      ? String(Math.max(...momentsList.map(id => parseInt(id))) + 1)
      : '1';
    
    // 构建动态数据
    const now = new Date();
    const timestamp = `创建时间: ${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const momentData = {
      id: parseInt(newId),
      author: {
        nickname: body.author?.nickname || 'Leyili',
        avatar: body.author?.avatar || '/images/home/avatar.webp'
      },
      content: body.content,
      timestamp: body.timestamp || timestamp,
      images: body.images || []
    };
    
    // 保存动态详情
    const momentKey = `moment:${newId}`;
    await kv.setItem(momentKey, momentData);
    
    // 添加到动态列表
    momentsList.push(newId);
    await kv.setItem(momentsListKey, momentsList);
    
    return {
      success: true,
      data: momentData,
      message: '朋友圈动态创建成功'
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || '创建朋友圈动态失败'
    });
  }
});


