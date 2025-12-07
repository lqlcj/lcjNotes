import { getKVStorage } from '~/server/utils/kv';
import { verifyTurnstile } from '~/server/utils/turnstile';
import { validateAndTrim, validateLength, FIELD_LIMITS } from '~/server/utils/validation';
import { handleApiError } from '~/server/utils/errorHandler';

// 创建新留言（公开接口，不需要认证；如果提供认证token，可以设置自定义时间）
export default defineEventHandler(async (event) => {
  const kv = getKVStorage(event);
  const body = await readBody(event);
  
  // 验证并清理输入
  const name = validateAndTrim(body.name, FIELD_LIMITS.MESSAGE_NAME, '姓名');
  const content = validateAndTrim(body.content, FIELD_LIMITS.MESSAGE_CONTENT, '留言内容');
  const email = body.email ? validateAndTrim(body.email, FIELD_LIMITS.MESSAGE_EMAIL, '邮箱') : '';
  const website = body.website ? validateAndTrim(body.website, FIELD_LIMITS.MESSAGE_WEBSITE, '网站') : '';
  const avatar = body.avatar ? validateAndTrim(body.avatar, FIELD_LIMITS.FRIEND_AVATAR, '头像') : '';
  
  // 验证必填字段
  if (!name || !content) {
    throw createError({
      statusCode: 400,
      message: '姓名和留言内容不能为空'
    });
  }
  
  // 验证邮箱格式（如果提供了邮箱）
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({
      statusCode: 400,
      message: '邮箱格式不正确'
    });
  }
  
  // 检查是否是管理员创建（使用 session cookie 或兼容旧的 Bearer token）
  const { isAdmin: checkIsAdmin } = await import('~/server/utils/auth');
  let isAdmin = await checkIsAdmin(event);
  
  // 兼容旧的 Bearer token 方式（向后兼容）
  if (!isAdmin) {
    const authHeader = getHeader(event, 'authorization');
    const adminPassword = useRuntimeConfig().adminPassword || process.env.ADMIN_PASSWORD;
    isAdmin = adminPassword && authHeader === `Bearer ${adminPassword}`;
  }
  
  // 如果不是管理员，验证 Turnstile token
  if (!isAdmin) {
    const turnstileSecretKey = useRuntimeConfig().turnstileSecretKey || process.env.TURNSTILE_SECRET_KEY;
    const turnstileToken = body.turnstileToken;
    
    // 如果配置了 Turnstile，必须验证
    if (turnstileSecretKey) {
      if (!turnstileToken) {
        throw createError({
          statusCode: 400,
          message: '请完成人机验证'
        });
      }
      
      // 获取客户端 IP
      const clientIP = getHeader(event, 'cf-connecting-ip') || 
                       getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() || 
                       'unknown';
      
      // 验证 Turnstile token
      const isValid = await verifyTurnstile(turnstileToken, turnstileSecretKey, clientIP);
      
      if (!isValid) {
        throw createError({
          statusCode: 400,
          message: '人机验证失败，请重试'
        });
      }
    }
  }
  
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
      name: name,
      email: email,
      content: content,
      date: messageDate,
      avatar: avatar,
      website: website,
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
    handleApiError(error, '创建留言失败', 500);
  }
});

