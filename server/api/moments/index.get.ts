import { getKVStorage } from '~/server/utils/kv';
import { handleApiError } from '~/server/utils/errorHandler';

// 获取朋友圈动态列表（公开接口，支持分页）
export default defineEventHandler(async (event) => {
  try {
    const kv = getKVStorage(event);
    const query = getQuery(event);
    
    // 获取分页参数
    const offset = Math.max(0, parseInt(query.offset as string) || 0);
    const limit = Math.min(Math.max(1, parseInt(query.limit as string) || 20), 100); // 默认20条，最多100条
    
    const momentsListKey = 'moments:list';
    let momentsList = await kv.getItem(momentsListKey) as string[] || [];
    
    // 🔥 优化：只在列表为空且没有恢复标志时尝试恢复数据
    const recoveryFlagKey = 'moments:recovery_attempted';
    if (momentsList.length === 0) {
      const recoveryAttempted = await kv.getItem(recoveryFlagKey);
      
      if (!recoveryAttempted) {
        // 标记已尝试恢复，避免每次都执行
        await kv.setItem(recoveryFlagKey, true);
        
        // 尝试从常见的 ID 范围恢复（限制范围，提高效率）
        const recoveredIds: string[] = [];
        const maxRecoveryId = 500; // 限制恢复范围，避免性能问题
        
        for (let id = 1; id <= maxRecoveryId; id++) {
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
        }
      }
    }
    
    // 如果没有数据，直接返回空结果
    if (momentsList.length === 0) {
      return {
        success: true,
        data: {
          moments: [],
          total: 0,
          offset: offset,
          limit: limit,
          hasMore: false
        }
      };
    }
    
    // 获取所有动态的元数据（用于排序）
    // 优化：只获取需要排序的字段，减少 KV 读取
    const momentsMetadata: Array<{ id: string; timestamp: number }> = [];
    for (const id of momentsList) {
      const momentKey = `moment:${id}`;
      const momentData = await kv.getItem(momentKey) as any;
      if (momentData) {
        const timestamp = momentData.timestamp 
          ? new Date(momentData.timestamp.replace('创建时间: ', '')).getTime() 
          : 0;
        momentsMetadata.push({ id, timestamp });
      }
    }
    
    // 按时间戳倒序排序（最新的在前）
    momentsMetadata.sort((a, b) => b.timestamp - a.timestamp);
    
    // 计算分页范围
    const total = momentsMetadata.length;
    const startIndex = offset;
    const endIndex = Math.min(offset + limit, total);
    const paginatedIds = momentsMetadata.slice(startIndex, endIndex);
    
    // 只获取当前页的动态详情
    const moments = [];
    for (const { id } of paginatedIds) {
      const momentKey = `moment:${id}`;
      const momentData = await kv.getItem(momentKey) as any;
      if (momentData) {
        moments.push(momentData);
      }
    }
    
    return {
      success: true,
      data: {
        moments: moments,
        total: total,
        offset: offset,
        limit: limit,
        hasMore: endIndex < total
      }
    };
  } catch (error: any) {
    handleApiError(error, '获取朋友圈动态失败', 500);
  }
});




