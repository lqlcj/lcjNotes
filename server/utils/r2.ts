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

