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
    
    console.log(`[朋友圈删除] 获取动态数据:`, {
      id,
      hasData: !!momentData,
      hasImages: !!(momentData?.images),
      imagesType: Array.isArray(momentData?.images) ? 'array' : typeof momentData?.images,
      imagesLength: Array.isArray(momentData?.images) ? momentData.images.length : 0
    });
    
    if (momentData) {
      // 删除关联的R2图片
      if (momentData.images && Array.isArray(momentData.images) && momentData.images.length > 0) {
        try {
          const r2 = getR2Storage(event);
          
          console.log(`[朋友圈删除] 开始删除图片，共 ${momentData.images.length} 张`);
          console.log(`[朋友圈删除] 图片列表:`, momentData.images);
          
          for (let i = 0; i < momentData.images.length; i++) {
            let imageUrl = momentData.images[i];
            
            // 清理URL：移除空白字符、换行符等
            if (typeof imageUrl === 'string') {
              imageUrl = imageUrl.trim();
            } else {
              console.log(`[朋友圈删除] ⚠ 第 ${i + 1} 个元素不是字符串，跳过:`, imageUrl);
              continue;
            }
            
            // 跳过空字符串
            if (!imageUrl) {
              console.log(`[朋友圈删除] ⚠ 第 ${i + 1} 个图片URL为空，跳过`);
              continue;
            }
            
            console.log(`[朋友圈删除] 处理第 ${i + 1}/${momentData.images.length} 张图片: ${imageUrl}`);
            console.log(`[朋友圈删除] URL类型: ${typeof imageUrl}, 长度: ${imageUrl.length}`);
            
            const r2Key = extractR2KeyFromUrl(imageUrl);
            
            if (r2Key) {
              console.log(`[朋友圈删除] ✓ 提取到R2 key: ${r2Key}`);
              try {
                await r2.delete(r2Key);
                console.log(`[朋友圈删除] ✓✓ 成功删除R2图片: ${r2Key}`);
              } catch (deleteError: any) {
                // 如果删除失败，记录日志但不中断流程
                console.error(`[朋友圈删除] ✗ 删除R2图片失败 ${r2Key}:`, deleteError?.message || deleteError);
                if (deleteError?.stack) {
                  console.error(`[朋友圈删除] 错误堆栈:`, deleteError.stack);
                }
              }
            } else {
              console.log(`[朋友圈删除] ⚠ 无法从URL提取R2 key，跳过: ${imageUrl}`);
              console.log(`[朋友圈删除] URL分析:`, {
                startsWithHttp: imageUrl.startsWith('http://') || imageUrl.startsWith('https://'),
                startsWithApiR2: imageUrl.startsWith('/api/r2/'),
                startsWithAssets: imageUrl.startsWith('assets/'),
                urlLength: imageUrl.length
              });
            }
          }
        } catch (r2Error: any) {
          // R2操作失败，记录日志但不中断删除流程
          console.error('[朋友圈删除] R2操作异常:', r2Error?.message || r2Error);
        }
      } else {
        console.log(`[朋友圈删除] 没有图片需要删除:`, {
          hasImages: !!momentData.images,
          isArray: Array.isArray(momentData.images),
          imagesValue: momentData.images
        });
      }
    } else {
      console.log(`[朋友圈删除] 动态数据不存在，跳过图片删除`);
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




