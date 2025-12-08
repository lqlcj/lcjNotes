// @ts-nocheck
import { getR2Storage, generateAssetFileName, isValidImageType } from '~/server/utils/r2';
import { handleApiError } from '~/server/utils/errorHandler';
import { verifyAuth } from '~/server/utils/auth';

// 上传图片到 R2（图床管理专用）
export default defineEventHandler(async (event) => {
  // 验证管理员权限
  await verifyAuth(event);

  try {
    // 获取上传的文件
    const formData = await readFormData(event);
    const file = formData.get('file') as File;
    
    if (!file) {
      throw createError({
        statusCode: 400,
        message: '没有上传文件'
      });
    }

    // 验证文件类型
    if (!isValidImageType(file.type)) {
      throw createError({
        statusCode: 400,
        message: '不支持的文件类型，仅支持：JPEG, PNG, WebP, GIF'
      });
    }

    // 验证文件大小（最大 10MB）
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw createError({
        statusCode: 400,
        message: '文件大小不能超过 10MB'
      });
    }

    // 获取 R2 存储实例
    const r2 = getR2Storage(event);

    // 生成唯一文件名（使用 UUID）
    const fileName = generateAssetFileName(file.name);
    
    // 读取文件内容
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 上传到 R2
    await r2.put(fileName, buffer, {
      httpMetadata: {
        contentType: file.type,
        cacheControl: 'public, max-age=31536000', // 缓存 1 年
      },
    });

    // 生成公共访问 URL
    const r2PublicUrl = useRuntimeConfig().r2PublicUrl;
    const publicUrl = r2PublicUrl 
      ? `${r2PublicUrl}/${fileName}` 
      : `/api/r2/${fileName}`;

    return {
      success: true,
      data: {
        key: fileName,
        name: fileName.split('/').pop() || fileName,
        url: publicUrl,
        size: file.size,
        type: file.type
      }
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    handleApiError(error, '上传失败', 500);
  }
});











