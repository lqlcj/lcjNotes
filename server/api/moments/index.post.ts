import { getKVStorage } from '~/server/utils/kv';

// 创建新朋友圈动态（需要管理员认证）
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
  
  // 验证必填字段
  if (!body.content) {
    throw createError({
      statusCode: 400,
      message: '内容不能为空'
    });
  }

  try {
    const kv = getKVStorage(event);
    
    const momentsListKey = 'moments:list';
    let momentsList = await kv.getItem(momentsListKey) as string[] || [];
    
    // 🔥 如果列表为空，尝试恢复旧数据（防止数据丢失）
    if (momentsList.length === 0) {
      // 尝试从常见的 ID 范围恢复（1-1000）
      const recoveredIds: string[] = [];
      for (let id = 1; id <= 1000; id++) {
        const momentKey = `moment:${id}`;
        const momentData = await kv.getItem(momentKey);
        if (momentData) {
          recoveredIds.push(String(id));
        }
      }
      
      if (recoveredIds.length > 0) {
        // 恢复列表
        momentsList = recoveredIds;
        await kv.setItem(momentsListKey, momentsList);
        console.log(`恢复了 ${recoveredIds.length} 条旧朋友圈数据`);
      }
    }
    
    // 生成新的动态 ID（确保不覆盖已有数据）
    let newId: string;
    if (momentsList.length > 0) {
      // 基于现有最大 ID + 1
      const maxId = Math.max(...momentsList.map(id => parseInt(id) || 0));
      newId = String(maxId + 1);
    } else {
      // 如果列表仍为空，从 1 开始，但先检查是否存在
      let candidateId = 1;
      while (true) {
        const momentKey = `moment:${candidateId}`;
        const existing = await kv.getItem(momentKey);
        if (!existing) {
          newId = String(candidateId);
          break;
        }
        candidateId++;
        // 防止无限循环
        if (candidateId > 10000) {
          newId = String(Date.now());
          break;
        }
      }
    }
    
    // 再次检查新 ID 是否已存在（双重保险）
    const momentKey = `moment:${newId}`;
    const existingMoment = await kv.getItem(momentKey);
    if (existingMoment) {
      // 如果已存在，递增 ID
      let candidateId = parseInt(newId) + 1;
      while (true) {
        const checkKey = `moment:${candidateId}`;
        const check = await kv.getItem(checkKey);
        if (!check) {
          newId = String(candidateId);
          break;
        }
        candidateId++;
        if (candidateId > 10000) {
          newId = String(Date.now());
          break;
        }
      }
    }
    
    // 构建动态数据
    const now = new Date();
    const timestamp = `创建时间: ${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
    
    const momentData = {
      id: parseInt(newId),
      author: {
        nickname: body.author?.nickname || 'Leyili',
        avatar: body.author?.avatar || '/images/home/avatar.webp'
      },
      content: body.content,
      timestamp: body.timestamp || timestamp,
      images: body.images || []
    };
    
    // 保存动态详情
    await kv.setItem(`moment:${newId}`, momentData);
    
    // 添加到动态列表（避免重复添加）
    if (!momentsList.includes(newId)) {
      momentsList.push(newId);
      await kv.setItem(momentsListKey, momentsList);
    }
    
    return {
      success: true,
      data: momentData,
      message: '朋友圈动态创建成功'
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      message: error.message || '创建朋友圈动态失败'
    });
  }
});




