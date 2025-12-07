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
  
  // 验证用户名和密码
  if (body.username !== adminUsername) {
    throw createError({
      statusCode: 401,
      message: '用户名错误'
    });
  }
  
  if (body.password !== adminPassword) {
    throw createError({
      statusCode: 401,
      message: '密码错误'
    });
  }
  
  // 用户名和密码都正确
  return {
    success: true,
    token: adminPassword // 简单实现，实际应该使用 JWT
  };
});

