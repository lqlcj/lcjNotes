// @ts-nocheck
/**
 * 更新书签接口。
 *
 * 功能：鉴权后更新书签数据。
 */
import { getKVStorage } from '~/server/utils/kv';
import { validateAndTrim, FIELD_LIMITS } from '~/server/utils/validation';
import { handleApiError } from '~/server/utils/errorHandler';
import { verifyAuth } from '~/server/utils/auth';

// 更新书签（需要管理员权限）
export default defineEventHandler(async (event) => {
  // 验证身份（使用加密的 session cookie）
  await verifyAuth(event);

  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  
  if (!id) {
    throw createError({
      statusCode: 400,
      message: '书签 ID 不能为空'
    });
  }

  // 验证并清理输入
  const name = validateAndTrim(body.name, FIELD_LIMITS.BOOKMARK_NAME, '书签名称');
  const url = validateAndTrim(body.url, FIELD_LIMITS.BOOKMARK_URL, '书签链接');
  const description = body.description ? validateAndTrim(body.description, FIELD_LIMITS.BOOKMARK_DESCRIPTION, '书签描述') : '';

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
    const bookmarkKey = `bookmark:${id}`;
    const existingBookmark = await kv.getItem(bookmarkKey);
    
    if (!existingBookmark) {
      throw createError({
        statusCode: 404,
        message: '书签不存在'
      });
    }
    
    // 更新书签数据
    const bookmarkData = {
      ...existingBookmark,
      name: name,
      url: url,
      description: description,
      updatedAt: new Date().toISOString()
    };

    await kv.setItem(bookmarkKey, bookmarkData);

    return {
      success: true,
      data: bookmarkData,
      message: '书签更新成功'
    };
  } catch (error: any) {
    handleApiError(error, '更新书签失败', 500);
  }
});



