import { getKVStorage } from '~/server/utils/kv';
import { handleApiError } from '~/server/utils/errorHandler';

// 删除留言（需要认证）
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
  
  const kv = getKVStorage(event);
  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '缺少留言 ID'
    });
  }
  
  try {
    const messageKey = `message:${id}`;
    const existingMessage = await kv.getItem(messageKey);
    
    if (!existingMessage) {
      throw createError({
        statusCode: 404,
        message: '留言不存在'
      });
    }
    
    // 删除留言
    await kv.removeItem(messageKey);
    
    // 从留言列表中移除
    const messagesListKey = 'messages:list';
    const messagesList = await kv.getItem(messagesListKey) as string[] || [];
    const updatedList = messagesList.filter(messageId => messageId !== id);
    await kv.setItem(messagesListKey, updatedList);
    
    return {
      success: true,
      message: '留言已删除'
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    handleApiError(error, '删除留言失败', 500);
  }
});









