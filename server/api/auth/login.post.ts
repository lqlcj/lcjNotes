// 登录验证
export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const adminPassword = useRuntimeConfig().adminPassword || process.env.ADMIN_PASSWORD;
  
  if (!adminPassword) {
    throw createError({
      statusCode: 500,
      message: '服务器未配置管理员密码'
    });
  }
  
  if (body.password === adminPassword) {
    return {
      success: true,
      token: adminPassword // 简单实现，实际应该使用 JWT
    };
  } else {
    throw createError({
      statusCode: 401,
      message: '密码错误'
    });
  }
});

