import { getKVStorage } from '~/server/utils/kv';

/**
 * 朋友圈数据迁移脚本：将 data/moments.json 导入到 KV
 * 
 * ⚠️ 注意：这是一个一次性迁移工具，用于将现有的 JSON 数据导入到 Cloudflare KV
 * 
 * 使用方法：
 * 1. 在本地环境运行：curl -X POST http://localhost:3000/api/moments/migrate -H "Authorization: Bearer YOUR_PASSWORD"
 * 2. 迁移完成后，后续朋友圈管理通过 /login 后台进行
 * 
 * 注意：此脚本在 Cloudflare Workers 环境中无法运行（需要文件系统访问）
 */
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

  try {
    const kv = getKVStorage(event);
    
    // 读取本地 JSON 文件
    const fs = await import('fs/promises');
    const path = await import('path');
    
    const momentsJsonPath = path.join(process.cwd(), 'data', 'moments.json');
    const jsonContent = await fs.readFile(momentsJsonPath, 'utf-8');
    const momentsData = JSON.parse(jsonContent);
    
    if (!Array.isArray(momentsData)) {
      throw new Error('moments.json 格式错误，应该是数组');
    }
    
    const momentsListKey = 'moments:list';
    const existingList = await kv.getItem(momentsListKey) as string[] || [];
    const existingIds = new Set(existingList);
    
    const migratedMoments = [];
    const newIds = [];
    
    for (const moment of momentsData) {
      // 使用 JSON 中的 ID，如果没有则生成
      const momentId = moment.id ? String(moment.id) : String(Date.now());
      
      // 如果已存在，跳过
      if (existingIds.has(momentId)) {
        continue;
      }
      
      // 处理时间戳格式
      let timestamp = moment.timestamp;
      if (!timestamp || !timestamp.includes('创建时间:')) {
        // 如果没有时间戳，尝试从日期推断或使用当前时间
        const now = new Date();
        timestamp = `创建时间: ${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      }
      
      // 处理图片路径：将 assets 路径转换为 public 路径
      const processImagePath = (path) => {
        if (!path) return path;
        
        // 如果已经是 /images/ 路径，直接返回
        if (path.startsWith('/images/')) {
          return path;
        }
        
        // 处理 Moments 图片路径
        if (
          path.startsWith('~/assets/images/Moments/') ||
          path.startsWith('/src/assets/images/Moments/') ||
          path.includes('Moments/')
        ) {
          // 提取文件名
          const fileName = path.split('/').pop() || path.split('\\').pop();
          // 转换为 public 路径
          return `/images/Moments/${fileName}`;
        }
        
        // 处理头像路径
        if (path.includes('home/avatar.webp') || path.includes('avatar.webp')) {
          return '/images/home/avatar.webp';
        }
        
        // 如果是其他 assets 路径，尝试转换
        if (path.includes('assets/images/')) {
          return path.replace(/.*\/assets\/images\//, '/images/');
        }
        
        return path;
      };
      
      // 处理头像路径
      const avatarPath = processImagePath(moment.author?.avatar);
      
      // 处理图片数组
      const processedImages = (moment.images || []).map(img => processImagePath(img));
      
      // 构建动态数据
      const momentData = {
        id: parseInt(momentId),
        author: {
          nickname: moment.author?.nickname || 'Leyili',
          avatar: avatarPath || '/images/home/avatar.webp'
        },
        content: moment.content || '',
        timestamp: timestamp,
        images: processedImages
      };
      
      // 保存到 KV
      const momentKey = `moment:${momentId}`;
      await kv.setItem(momentKey, momentData);
      
      // 添加到列表
      existingList.push(momentId);
      existingIds.add(momentId);
      newIds.push(momentId);
      migratedMoments.push(momentData);
    }
    
    // 更新列表
    await kv.setItem(momentsListKey, existingList);
    
    return {
      success: true,
      message: `成功迁移 ${migratedMoments.length} 条朋友圈动态`,
      data: {
        migrated: migratedMoments.length,
        skipped: momentsData.length - migratedMoments.length,
        total: existingList.length
      }
    };
  } catch (error: any) {
    // 如果文件系统操作失败（在 Cloudflare Workers 中），返回提示
    if (error.code === 'ENOENT' || error.message?.includes('fs')) {
      return {
        success: false,
        message: '迁移脚本需要在本地环境运行，或者手动在后台创建朋友圈动态',
        hint: '请在本地运行此 API，或者直接在后台管理界面创建朋友圈动态'
      };
    }
    
    throw createError({
      statusCode: 500,
      message: error.message || '迁移失败'
    });
  }
});

