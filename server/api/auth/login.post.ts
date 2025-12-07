import { verifyTurnstile } from '~/server/utils/turnstile';
import { createSession } from '~/server/utils/session';

// 登录验证
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const adminPassword = useRuntimeConfig().adminPassword || process.env.ADMIN_PASSWORD;
  const adminUsername = 'lcj'; // 固定用户名
  
  if (!adminPassword) {
    throw createError({
      statusCode: 500,
      message: '服务器未配置管理员密码'
    });
  }
  
  // 验证 Turnstile token（防止撞库）
  const turnstileSecretKey = useRuntimeConfig().turnstileSecretKey || process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecretKey) {
    const turnstileToken = body.turnstileToken;
    
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
  
  // 验证用户名和密码
  if (body.username !== adminUsername) {
    throw createError({
      statusCode: 401,
      message: '用户名或密码错误'
    });
  }
  
  if (body.password !== adminPassword) {
    throw createError({
      statusCode: 401,
      message: '用户名或密码错误'
    });
  }
  
  // 用户名和密码都正确，创建加密的 session cookie
  await createSession(event, {
    username: adminUsername,
    loginTime: Date.now()
  });
  
  // 不返回 token，session 已通过 HttpOnly Cookie 设置
  return {
    success: true,
    message: '登录成功'
  };
});

