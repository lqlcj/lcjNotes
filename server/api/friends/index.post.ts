// @ts-nocheck
/**
 * 管理员新增友链接口。
 *
 * 功能：鉴权后直接写入友链数据（无需申请流程）。
 */
import { getKVStorage } from '~/server/utils/kv';
import { validateAndTrim, FIELD_LIMITS } from '~/server/utils/validation';
import { handleApiError } from '~/server/utils/errorHandler';
import { verifyAuth } from '~/server/utils/auth';

// 管理员直接添加友链（不需要经过申请流程）
export default defineEventHandler(async (event) => {
  // 验证身份（使用加密的 session cookie）
  await verifyAuth(event);

  const body = await readBody(event);
  
  // 验证并清理输入
  const name = validateAndTrim(body.name, FIELD_LIMITS.FRIEND_NAME, '网站名称');
  const url = validateAndTrim(body.url, FIELD_LIMITS.FRIEND_URL, '网站链接');
  const description = body.description ? validateAndTrim(body.description, FIELD_LIMITS.FRIEND_DESCRIPTION, '网站描述') : '';
  const avatar = body.avatar ? validateAndTrim(body.avatar, FIELD_LIMITS.FRIEND_AVATAR, '头像') : '/images/home/avatar.webp';
  
  // 验证必填字段
  if (!name || !url) {
    throw createError({
      statusCode: 400,
      message: '网站名称和链接不能为空'
    });
  }

  // 验证 URL 格式
  try {
    new URL(url);
  } catch {
    throw createError({
      statusCode: 400,
      message: '请输入有效的网站链接'
    });
  }

  try {
    const kv = getKVStorage(event);
    
    // 生成新的友链 ID
    const friendsListKey = 'friends:list';
    const friendsList = await kv.getItem(friendsListKey) as string[] || [];
    const newId = friendsList.length > 0
      ? String(Math.max(...friendsList.map(id => parseInt(id))) + 1)
      : '1';

    // 构建友链数据
    const friendData = {
      id: newId,
      name: name,
      url: url,
      description: description,
      avatar: avatar,
      date: new Date().toISOString().split('T')[0]
    };

    // 保存友链详情
    const friendKey = `friend:${newId}`;
    await kv.setItem(friendKey, friendData);

    // 添加到友链列表
    friendsList.push(newId);
    await kv.setItem(friendsListKey, friendsList);

    return {
      success: true,
      data: friendData,
      message: '友链添加成功'
    };
  } catch (error: any) {
    handleApiError(error, '添加友链失败', 500);
  }
});

