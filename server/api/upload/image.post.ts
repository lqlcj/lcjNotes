import { getR2Storage, generateFileName, isValidImageType } from '~/server/utils/r2';

// 上传图片到 R2
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

    // 生成唯一文件名
    const fileName = generateFileName(file.name);
    
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
    // 注意：需要配置 R2 的公共域名或自定义域名
    // 这里返回相对路径，前端会拼接完整的 URL
    const publicUrl = `/r2/${fileName}`;

    return {
      success: true,
      data: {
        url: publicUrl,
        fileName: fileName,
        size: file.size,
        type: file.type
      }
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    throw createError({
      statusCode: 500,
      message: error.message || '上传失败'
    });
  }
});

