// 数据迁移脚本：将本地 markdown 文件导入到 KV
// 这个 API 只需要运行一次，用于将现有的 posts/*.md 文件迁移到 KV
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

  const kv = useStorage('kv');
  
  try {
    // 读取所有本地 markdown 文件
    const fs = await import('fs/promises');
    const path = await import('path');
    const fm = await import('front-matter');
    
    const postsDir = path.join(process.cwd(), 'posts');
    const files = await fs.readdir(postsDir);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    const migratedPosts = [];
    const postsList: string[] = [];
    
    for (const file of mdFiles) {
      const filePath = path.join(postsDir, file);
      const content = await fs.readFile(filePath, 'utf-8');
      const parsed = fm.default(content);
      const attr = parsed.attributes;
      
      // 从文件名提取 ID（例如：01.md -> 01）
      const fileId = file.replace('.md', '');
      
      const postData = {
        id: fileId,
        title: attr.title || '无标题',
        date: attr.date || new Date().toISOString().split('T')[0],
        cover: attr.cover || '',
        ratio: attr.ratio || 0.75,
        user: attr.user || 'lcj',
        avatar: attr.avatar || '',
        likes: attr.likes || 0,
        body: parsed.body
      };
      
      // 保存到 KV
      const postKey = `post:${fileId}`;
      await kv.setItem(postKey, postData);
      postsList.push(fileId);
      migratedPosts.push(postData);
    }
    
    // 保存文章列表
    await kv.setItem('posts:list', postsList);
    
    return {
      success: true,
      message: `成功迁移 ${migratedPosts.length} 篇文章`,
      data: migratedPosts
    };
  } catch (error: any) {
    // 如果文件系统操作失败（在 Cloudflare Workers 中），返回提示
    if (error.code === 'ENOENT' || error.message?.includes('fs')) {
      return {
        success: false,
        message: '迁移脚本需要在本地环境运行，或者手动在后台创建文章',
        hint: '请在本地运行此 API，或者直接在后台管理界面创建文章'
      };
    }
    
    throw createError({
      statusCode: 500,
      message: error.message || '迁移失败'
    });
  }
});

