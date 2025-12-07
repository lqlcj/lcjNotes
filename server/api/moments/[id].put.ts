import { getKVStorage } from '~/server/utils/kv';
import { validateAndTrim, FIELD_LIMITS } from '~/server/utils/validation';
import { handleApiError } from '~/server/utils/errorHandler';
import { verifyAuth } from '~/server/utils/auth';

// 更新朋友圈动态（需要管理员认证）
export default defineEventHandler(async (event) => {
  // 验证身份（使用加密的 session cookie）
  await verifyAuth(event);

  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '缺少动态 ID'
    });
  }

  try {
    const kv = getKVStorage(event);
    const momentKey = `moment:${id}`;
    const momentData = await kv.getItem(momentKey) as any;
    
    if (!momentData) {
      throw createError({
        statusCode: 404,
        message: '动态不存在'
      });
    }
    
    // 验证并清理输入
    let nickname = momentData.author?.nickname || 'Leyili'
    let avatar = momentData.author?.avatar || '/images/lcj.svg'
    let content = momentData.content
    let images = momentData.images || []
    
    if (body.author?.nickname !== undefined) {
      nickname = validateAndTrim(body.author.nickname, FIELD_LIMITS.MOMENT_NICKNAME, '昵称')
    }
    if (body.author?.avatar !== undefined) {
      avatar = validateAndTrim(body.author.avatar, FIELD_LIMITS.MOMENT_AVATAR, '头像')
    }
    if (body.content !== undefined) {
      content = validateAndTrim(body.content, FIELD_LIMITS.MOMENT_CONTENT, '动态内容')
    }
    if (body.images !== undefined) {
      if (Array.isArray(body.images) && body.images.length > 9) {
        throw createError({
          statusCode: 400,
          message: '最多只能上传 9 张图片'
        });
      }
      images = body.images
    }
    
    // 更新数据（保留原有数据，只更新提供的字段）
    const updatedData = {
      ...momentData,
      author: {
        nickname: nickname,
        avatar: avatar
      },
      content: content,
      timestamp: body.timestamp !== undefined ? body.timestamp : momentData.timestamp,
      images: images
    };
    
    await kv.setItem(momentKey, updatedData);
    
    return {
      success: true,
      data: updatedData,
      message: '朋友圈动态更新成功'
    };
  } catch (error: any) {
    if (error.statusCode) {
      throw error;
    }
    handleApiError(error, '更新朋友圈动态失败', 500);
  }
});




