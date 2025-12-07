import { getR2Storage } from '~/server/utils/r2';
import { handleApiError } from '~/server/utils/errorHandler';

// 代理 R2 图片请求（用于公共访问）
export default defineEventHandler(async (event) => {
  try {
    const path = getRouterParam(event, 'path');
    
    if (!path) {
      throw createError({
        statusCode: 404,
        message: '文件不存在'
      });
    }

    // 获取 R2 存储实例
    const r2 = getR2Storage(event);

    // 从 R2 获取文件
    const object = await r2.get(path);

    if (!object) {
      throw createError({
        statusCode: 404,
        message: '文件不存在'
      });
    }

    // 获取文件内容
    const body = await object.arrayBuffer();
    const buffer = Buffer.from(body);

    // 设置响应头
    const contentType = object.httpMetadata?.contentType || 'image/jpeg';
    setHeader(event, 'Content-Type', contentType);
    setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable');
    
    return buffer;
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    handleApiError(error, '获取文件失败', 500);
  }
});

