import { getKVStorage } from '~/server/utils/kv';

// 创建新文章
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
  
  const body = await readBody(event);
  const kv = getKVStorage(event);
  
  // 验证必填字段
  if (!body.title || !body.body) {
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
      title: body.title,
      date: body.date || new Date().toISOString().split('T')[0],
      cover: body.cover || '',
      ratio: body.ratio || 0.75,
      user: body.user || 'lcj',
      avatar: body.avatar || '',
      likes: body.likes || 0,
      body: body.body
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
    throw createError({
      statusCode: 500,
      message: error.message || '创建文章失败'
    });
  }
});

