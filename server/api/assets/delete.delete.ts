// @ts-nocheck
import { getR2Storage } from '~/server/utils/r2';
import { handleApiError } from '~/server/utils/errorHandler';
import { verifyAuth } from '~/server/utils/auth';

// 从 R2 删除图片
export default defineEventHandler(async (event) => {
  // 验证管理员权限
  await verifyAuth(event);

  try {
    const query = getQuery(event);
    const key = query.key as string;
    
    if (!key) {
      throw createError({
        statusCode: 400,
        message: '缺少文件 key 参数'
      });
    }

    // 验证 key 是否在 assets 目录下（安全措施）
    if (!key.startsWith('assets/')) {
      throw createError({
        statusCode: 400,
        message: '只能删除 assets 目录下的文件'
      });
    }

    // 获取 R2 存储实例
    const r2 = getR2Storage(event);

    // 删除文件
    await r2.delete(key);

    return {
      success: true,
      message: '删除成功'
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    handleApiError(error, '删除失败', 500);
  }
});





