// @ts-nocheck
import { getKVStorage } from '~/server/utils/kv';
import { validateAndTrim, validateLength, FIELD_LIMITS } from '~/server/utils/validation';
import { handleApiError } from '~/server/utils/errorHandler';
import { verifyAuth } from '~/server/utils/auth';

// 创建新文章
export default defineEventHandler(async (event) => {
  // 验证身份（使用加密的 session cookie）
  await verifyAuth(event);
  
  const body = await readBody(event);
  const kv = getKVStorage(event);
  
  // 验证并清理输入
  const title = validateAndTrim(body.title, FIELD_LIMITS.POST_TITLE, '标题');
  const postBody = validateAndTrim(body.body, FIELD_LIMITS.POST_BODY, '文章内容');
  const user = body.user ? validateAndTrim(body.user, FIELD_LIMITS.POST_USER, '作者') : 'lcj';
  const cover = body.cover ? validateAndTrim(body.cover, FIELD_LIMITS.POST_COVER, '封面') : '';
  const avatar = body.avatar ? validateAndTrim(body.avatar, FIELD_LIMITS.FRIEND_AVATAR, '头像') : '';
  
  // 验证必填字段
  if (!title || !postBody) {
    throw createError({
      statusCode: 400,
      message: '标题和内容不能为空'
    });
  }
  
  try {
    // 生成新的文章 ID
    const postsListKey = 'posts:list';
    const postsList = await kv.getItem(postsListKey) as string[] || [];
    const newId = postsList.length > 0 
      ? String(Math.max(...postsList.map(id => parseInt(id))) + 1)
      : '1';
    
    // 构建文章数据
    const postData = {
      id: newId,
      title: title,
      date: body.date || new Date().toISOString().split('T')[0],
      cover: cover,
      ratio: body.ratio || 0.75,
      user: user,
      avatar: avatar,
      likes: body.likes || 0,
      body: postBody
    };
    
    // 保存文章
    const postKey = `post:${newId}`;
    await kv.setItem(postKey, postData);
    
    // 更新文章列表
    postsList.push(newId);
    await kv.setItem(postsListKey, postsList);
    
    return {
      success: true,
      data: postData
    };
  } catch (error: any) {
    handleApiError(error, '创建文章失败', 500);
  }
});

