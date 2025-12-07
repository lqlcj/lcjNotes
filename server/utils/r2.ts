// R2 存储工具函数
export function getR2Storage(event: any) {
  // 从 Cloudflare 环境获取 R2 binding
  const env = event.context?.cloudflare?.env;
  if (env?.BLOG_R2) {
    return env.BLOG_R2;
  }
  throw new Error('R2 storage not available. Please configure BLOG_R2 binding in Cloudflare Pages.');
}

/**
 * 生成 UUID v4
 */
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 生成唯一的文件名（使用 UUID）
 * @param originalName 原始文件名
 * @returns 新的文件名（格式：assets/YYYY-MM/UUID.扩展名）
 */
export function generateFileName(originalName: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const uuid = generateUUID();
  
  // 获取文件扩展名（小写）
  const ext = originalName.split('.').pop()?.toLowerCase() || 'jpg';
  
  // 验证扩展名是否为图片格式
  const validExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
  const finalExt = validExts.includes(ext) ? ext : 'jpg';
  
  return `assets/${year}-${month}/${uuid}.${finalExt}`;
}

/**
 * 生成图床文件名（用于图床管理功能）
 * @param originalName 原始文件名
 * @returns 新的文件名（格式：assets/YYYY-MM/UUID.扩展名）
 */
export function generateAssetFileName(originalName: string): string {
  return generateFileName(originalName);
}

// 验证图片文件类型
export function isValidImageType(mimeType: string): boolean {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  return allowedTypes.includes(mimeType);
}

/**
 * 获取文件扩展名对应的 MIME 类型
 */
export function getMimeTypeFromExt(ext: string): string {
  const mimeTypes: Record<string, string> = {
    'jpg': 'image/jpeg',
    'jpeg': 'image/jpeg',
    'png': 'image/png',
    'webp': 'image/webp',
    'gif': 'image/gif'
  };
  return mimeTypes[ext.toLowerCase()] || 'image/jpeg';
}

/**
 * 从图片URL中提取R2存储的key
 * 支持两种格式：
 * 1. https://photo.lcjlq.com/assets/2024-12/uuid.jpg (使用r2PublicUrl)
 * 2. /api/r2/assets/2024-12/uuid.jpg (使用代理路由)
 * @param url 图片URL
 * @returns R2 key，如果不是R2图片则返回null
 */
export function extractR2KeyFromUrl(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  try {
    // 处理完整URL (https://photo.lcjlq.com/assets/...)
    if (url.startsWith('http://') || url.startsWith('https://')) {
      const urlObj = new URL(url);
      const path = urlObj.pathname;
      // 移除开头的斜杠
      const key = path.startsWith('/') ? path.substring(1) : path;
      // 检查是否是assets目录下的文件
      if (key.startsWith('assets/')) {
        return key;
      }
      return null;
    }

    // 处理代理路由 (/api/r2/assets/...)
    if (url.startsWith('/api/r2/')) {
      const key = url.replace('/api/r2/', '');
      if (key.startsWith('assets/')) {
        return key;
      }
      return null;
    }

    // 如果URL直接是key格式 (assets/...)
    if (url.startsWith('assets/')) {
      return url;
    }

    return null;
  } catch (error) {
    console.error('提取R2 key失败:', error);
    return null;
  }
}

