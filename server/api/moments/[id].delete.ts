// @ts-nocheck
import { getKVStorage } from '~/server/utils/kv';
import { getR2Storage, extractR2KeyFromUrl } from '~/server/utils/r2';
import { handleApiError } from '~/server/utils/errorHandler';
import { verifyAuth } from '~/server/utils/auth';

// 删除朋友圈动态（需要管理员认证）
export default defineEventHandler(async (event) => {
  // 验证身份（使用加密的 session cookie）
  await verifyAuth(event);

  const id = getRouterParam(event, 'id');
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '缺少动态 ID'
    });
  }

  try {
    const kv = getKVStorage(event);
    const momentKey = `moment:${id}`;
    
    // 先获取动态数据，以便删除关联的图片
    const momentData = await kv.getItem(momentKey) as any;
    
    if (momentData) {
      // 删除关联的R2图片
      if (momentData.images && Array.isArray(momentData.images) && momentData.images.length > 0) {
        try {
          const r2 = getR2Storage(event);
          
          console.log(`开始删除朋友圈图片，共 ${momentData.images.length} 张`);
          
          for (const imageUrl of momentData.images) {
            console.log(`处理图片URL: ${imageUrl}`);
            const r2Key = extractR2KeyFromUrl(imageUrl);
            
            if (r2Key) {
              console.log(`提取到R2 key: ${r2Key}`);
              try {
                await r2.delete(r2Key);
                console.log(`✓ 已删除R2图片: ${r2Key}`);
              } catch (deleteError) {
                // 如果删除失败，记录日志但不中断流程
                console.error(`✗ 删除R2图片失败 ${r2Key}:`, deleteError);
              }
            } else {
              console.log(`⚠ 无法从URL提取R2 key，跳过: ${imageUrl}`);
            }
          }
        } catch (r2Error) {
          // R2操作失败，记录日志但不中断删除流程
          console.error('删除朋友圈图片时出错:', r2Error);
        }
      } else {
        console.log('朋友圈动态没有图片，跳过图片删除');
      }
    }
    
    // 删除动态
    await kv.removeItem(momentKey);
    
    // 从动态列表中移除
    const momentsListKey = 'moments:list';
    const momentsList = await kv.getItem(momentsListKey) as string[] || [];
    const updatedList = momentsList.filter(momentId => momentId !== id);
    await kv.setItem(momentsListKey, updatedList);
    
    return {
      success: true,
      message: '删除成功'
    };
  } catch (error: any) {
    handleApiError(error, '删除朋友圈动态失败', 500);
  }
});




