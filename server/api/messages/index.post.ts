import { getKVStorage } from '~/server/utils/kv';

// 创建新留言（公开接口，不需要认证；如果提供认证token，可以设置自定义时间）
export default defineEventHandler(async (event) => {
  const kv = getKVStorage(event);
  const body = await readBody(event);
  
  // 验证必填字段
  if (!body.name || !body.content) {
    throw createError({
      statusCode: 400,
      message: '姓名和留言内容不能为空'
    });
  }
  
  // 检查是否是管理员创建（带认证token）
  const authHeader = getHeader(event, 'authorization');
  const adminPassword = useRuntimeConfig().adminPassword || process.env.ADMIN_PASSWORD;
  const isAdmin = adminPassword && authHeader === `Bearer ${adminPassword}`;
  
  try {
    // 生成新的留言 ID
    const messagesListKey = 'messages:list';
    const messagesList = await kv.getItem(messagesListKey) as string[] || [];
    const newId = messagesList.length > 0 
      ? String(Math.max(...messagesList.map(id => parseInt(id))) + 1)
      : '1';
    
    // 构建留言数据
    // 如果是管理员且提供了自定义时间，使用自定义时间；否则使用当前时间
    let messageDate = new Date().toISOString();
    if (isAdmin && body.date) {
      // 管理员可以设置自定义时间
      const customDate = new Date(body.date);
      if (!isNaN(customDate.getTime())) {
        messageDate = customDate.toISOString();
      }
    }
    
    const messageData = {
      id: newId,
      name: body.name,
      email: body.email || '',
      content: body.content,
      date: messageDate,
      avatar: body.avatar || '',
      website: body.website || '',
      ip: isAdmin ? 'admin' : (event.headers.get('cf-connecting-ip') || event.headers.get('x-forwarded-for') || 'unknown')
    };
    
    // 保存留言
    const messageKey = `message:${newId}`;
    await kv.setItem(messageKey, messageData);
    
    // 更新留言列表
    messagesList.push(newId);
    await kv.setItem(messagesListKey, messagesList);
    
    return {
      success: true,
      data: {
        id: newId,
        name: messageData.name,
        content: messageData.content,
        date: messageData.date,
        avatar: messageData.avatar,
        website: messageData.website
      }
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || '创建留言失败'
    });
  }
});

