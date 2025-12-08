// R2 存储工具函数
export function getR2Storage(event: any) {
  // 从 Cloudflare 环境获取 R2 binding
  const env = event.context?.cloudflare?.env;
  if (env?.BLOG_R2) {
    return env.BLOG_R2;
  }
  throw new Error('R2 storage not available. Please configure BLOG_R2 binding in Cloudflare Pages.');
}

// 生成唯一的文件名（用于文章封面）
export function generateFileName(originalName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const ext = originalName.split('.').pop() || 'jpg';
  return `covers/${timestamp}-${random}.${ext}`;
}

// 生成唯一的资源文件名（用于图床管理）
export function generateAssetFileName(originalName: string): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const uuid = crypto.randomUUID();
  const ext = originalName.split('.').pop() || 'jpg';
  return `assets/${year}-${month}/${uuid}.${ext}`;
}

// 验证图片文件类型
export function isValidImageType(mimeType: string): boolean {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  return allowedTypes.includes(mimeType);
}

