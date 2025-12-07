// @ts-nocheck
import { getKVStorage } from '~/server/utils/kv';
import { verifyTurnstile } from '~/server/utils/turnstile';
import { validateAndTrim, FIELD_LIMITS } from '~/server/utils/validation';
import { handleApiError } from '~/server/utils/errorHandler';

// 提交友链申请
export default defineEventHandler(async (event) => {
  const kv = getKVStorage(event);
  const body = await readBody(event);
  
  // 验证并清理输入
  const name = validateAndTrim(body.name, FIELD_LIMITS.FRIEND_NAME, '网站名称');
  const url = validateAndTrim(body.url, FIELD_LIMITS.FRIEND_URL, '网站链接');
  const description = body.description ? validateAndTrim(body.description, FIELD_LIMITS.FRIEND_DESCRIPTION, '网站描述') : '';
  const avatar = body.avatar ? validateAndTrim(body.avatar, FIELD_LIMITS.FRIEND_AVATAR, '头像') : '';
  
  // 验证必填字段
  if (!name || !url) {
    throw createError({
      statusCode: 400,
      message: '网站名称和链接不能为空'
    });
  }

  // 验证 URL 格式
  try {
    new URL(url);
  } catch {
    throw createError({
      statusCode: 400,
      message: '请输入有效的网站链接'
    });
  }

  // 验证 Turnstile token（如果配置了）
  const turnstileSecretKey = useRuntimeConfig().turnstileSecretKey || process.env.TURNSTILE_SECRET_KEY;
  const turnstileToken = body.turnstileToken;
  
  if (turnstileSecretKey) {
    if (!turnstileToken) {
      throw createError({
        statusCode: 400,
        message: '请完成人机验证'
      });
    }
    
    const clientIP = getHeader(event, 'cf-connecting-ip') || 
                     getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() || 
                     'unknown';
    
    const isValid = await verifyTurnstile(turnstileToken, turnstileSecretKey, clientIP);
    
    if (!isValid) {
      throw createError({
        statusCode: 400,
        message: '人机验证失败，请重试'
      });
    }
  }
  
  try {
    // 生成新的申请 ID
    const requestsListKey = 'friend-requests:list';
    const requestsList = await kv.getItem(requestsListKey) as string[] || [];
    const newId = requestsList.length > 0 
      ? String(Math.max(...requestsList.map(id => parseInt(id))) + 1)
      : '1';
    
    // 构建申请数据
    const requestData = {
      id: newId,
      name: name,
      url: url,
      description: description,
      avatar: avatar,
      status: 'pending', // pending, approved, rejected
      createdAt: new Date().toISOString(),
      ip: getHeader(event, 'cf-connecting-ip') || getHeader(event, 'x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    };
    
    // 保存申请
    const requestKey = `friend-request:${newId}`;
    await kv.setItem(requestKey, requestData);
    
    // 更新申请列表
    requestsList.push(newId);
    await kv.setItem(requestsListKey, requestsList);
    
    return {
      success: true,
      data: {
        id: newId,
        message: '申请已提交，等待审核'
      }
    };
  } catch (error: any) {
    handleApiError(error, '提交申请失败', 500);
  }
});


