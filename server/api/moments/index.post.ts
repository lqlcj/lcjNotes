import { getKVStorage } from '~/server/utils/kv';
import { validateAndTrim, FIELD_LIMITS } from '~/server/utils/validation';
import { handleApiError } from '~/server/utils/errorHandler';
import { verifyAuth } from '~/server/utils/auth';

// 创建新朋友圈动态（需要管理员认证）
export default defineEventHandler(async (event) => {
  // 验证身份（使用加密的 session cookie）
  await verifyAuth(event);

  const body = await readBody(event);
  
  // 验证并清理输入
  const content = validateAndTrim(body.content, FIELD_LIMITS.MOMENT_CONTENT, '动态内容');
  const nickname = body.author?.nickname ? validateAndTrim(body.author.nickname, FIELD_LIMITS.MOMENT_NICKNAME, '昵称') : 'Leyili';
  const avatar = body.author?.avatar ? validateAndTrim(body.author.avatar, FIELD_LIMITS.MOMENT_AVATAR, '头像') : '/images/lcj.svg';
  
  // 验证必填字段
  if (!content) {
    throw createError({
      statusCode: 400,
      message: '内容不能为空'
    });
  }
  
  // 验证图片数组长度
  if (body.images && Array.isArray(body.images) && body.images.length > 9) {
    throw createError({
      statusCode: 400,
      message: '最多只能上传 9 张图片'
    });
  }

  try {
    const kv = getKVStorage(event);
    
    // 生成新的动态 ID（参考 Notes 的简单方式）
    const momentsListKey = 'moments:list';
    const momentsList = await kv.getItem(momentsListKey) as string[] || [];
    const newId = momentsList.length > 0 
      ? String(Math.max(...momentsList.map(id => parseInt(id) || 0)) + 1)
      : '1';
    
    // 构建动态数据
    const now = new Date();
    const timestamp = `创建时间: ${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const momentData = {
      id: parseInt(newId),
      author: {
        nickname: nickname,
        avatar: avatar
      },
      content: content,
      timestamp: body.timestamp || timestamp,
      images: body.images || []
    };
    
    // 保存动态详情
    await kv.setItem(`moment:${newId}`, momentData);
    
    // 更新动态列表
    momentsList.push(newId);
    await kv.setItem(momentsListKey, momentsList);
    
    return {
      success: true,
      data: momentData,
      message: '朋友圈动态创建成功'
    };
  } catch (error: any) {
    console.error('创建朋友圈动态失败:', error);
    handleApiError(error, '创建朋友圈动态失败', 500);
  }
});




