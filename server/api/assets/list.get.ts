// @ts-nocheck
import { getR2Storage } from '~/server/utils/r2';
import { handleApiError } from '~/server/utils/errorHandler';
import { verifyAuth } from '~/server/utils/auth';

// 获取 R2 中的图片列表
export default defineEventHandler(async (event) => {
  // 验证管理员权限
  await verifyAuth(event);

  try {
    const r2 = getR2Storage(event);
    const query = getQuery(event);
    
    // 获取分页参数
    const cursor = query.cursor as string | undefined;
    const limit = Math.min(parseInt(query.limit as string) || 50, 100); // 最多 100 条
    
    // 列出 R2 中的对象
    // R2 的 list 方法支持 prefix 和 cursor
    const listOptions: any = {
      limit: limit,
      prefix: 'assets/', // 只列出 assets 目录下的文件
    };
    
    if (cursor) {
      listOptions.cursor = cursor;
    }
    
    const result = await r2.list(listOptions);
    
    // 过滤出图片文件
    const imageFiles = (result.objects || []).filter((obj: any) => {
      const name = obj.key.toLowerCase();
      return name.endsWith('.jpg') || 
             name.endsWith('.jpeg') || 
             name.endsWith('.png') || 
             name.endsWith('.webp') || 
             name.endsWith('.gif');
    });
    
    // 获取 R2 公共 URL
    const r2PublicUrl = useRuntimeConfig().r2PublicUrl;
    
    // 格式化返回数据
    const assets = imageFiles.map((obj: any) => {
      const fileName = obj.key;
      const publicUrl = r2PublicUrl 
        ? `${r2PublicUrl}/${fileName}`
        : `/api/r2/${fileName}`;
      
      return {
        key: fileName,
        name: fileName.split('/').pop() || fileName,
        url: publicUrl,
        size: obj.size || 0,
        uploaded: obj.uploaded ? new Date(obj.uploaded).toISOString() : null,
        etag: obj.etag || ''
      };
    });
    
    // 按上传时间倒序排序（最新的在前）
    assets.sort((a, b) => {
      const timeA = a.uploaded ? new Date(a.uploaded).getTime() : 0;
      const timeB = b.uploaded ? new Date(b.uploaded).getTime() : 0;
      return timeB - timeA;
    });
    
    return {
      success: true,
      data: {
        assets,
        cursor: result.cursor || null,
        truncated: result.truncated || false,
        hasMore: result.truncated || false
      }
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    handleApiError(error, '获取图片列表失败', 500);
  }
});










