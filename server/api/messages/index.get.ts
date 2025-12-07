// @ts-nocheck
import { getKVStorage } from '~/server/utils/kv';
import { handleApiError } from '~/server/utils/errorHandler';

// 获取所有留言列表
export default defineEventHandler(async (event) => {
  try {
    const kv = getKVStorage(event);
    
    // 从 KV 获取所有留言的 ID 列表
    const messagesListKey = 'messages:list';
    const messagesList = await kv.getItem(messagesListKey) as string[] || [];
    
    // 获取所有留言的详细信息
    const messages = [];
    for (const messageId of messagesList) {
      const messageKey = `message:${messageId}`;
      const messageData = await kv.getItem(messageKey) as any;
      if (messageData) {
        messages.push({
          id: messageId,
          name: messageData.name || '匿名',
          email: messageData.email || '',
          content: messageData.content || '',
          date: messageData.date || '',
          avatar: messageData.avatar || '',
          website: messageData.website || '',
          // 不返回敏感信息给前端
        });
      }
    }
    
    // 按日期降序排序（最新的在前）
    messages.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
    
    return {
      success: true,
      data: messages
    };
  } catch (error: any) {
    // 使用安全的错误处理，但 GET 请求返回错误对象而不是抛出
    const isProd = process.env.NODE_ENV === 'production' || process.env.NITRO_PRESET === 'cloudflare-pages';
    return {
      success: false,
      error: isProd ? '获取留言列表失败' : (error.message || '获取留言列表失败')
    };
  }
});









