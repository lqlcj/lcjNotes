// KV/D2 存储工具函数
export function getKVStorage(event: any) {
  const env = event.context?.cloudflare?.env;
  
  // 🔥 优先使用 Cloudflare D2 database（如果配置了）
  if (env?.BLOG_D2) {
    const db = env.BLOG_D2;
    
    // 初始化 D2 表（如果不存在）- 使用异步初始化
    const initTable = async () => {
      try {
        await db.exec(`
          CREATE TABLE IF NOT EXISTS kv_store (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL
          )
        `);
      } catch (e: any) {
        // 表可能已存在，或者需要先创建数据库
        if (!e.message?.includes('already exists')) {
          console.log('D2 table initialization note:', e.message || e);
        }
      }
    };
    
    // 立即初始化（不阻塞）
    initTable().catch(() => {});
    
    return {
      async getItem(key: string) {
        try {
          // 确保表已创建
          await initTable();
          const result = await db.prepare('SELECT value FROM kv_store WHERE key = ?').bind(key).first();
          if (result && (result as any).value) {
            return JSON.parse((result as any).value as string);
          }
          return null;
        } catch (e: any) {
          console.error('D2 getItem error:', e.message || e, 'key:', key);
          // 如果表不存在，尝试创建
          if (e.message?.includes('no such table')) {
            await initTable();
            return null;
          }
          return null;
        }
      },
      async setItem(key: string, value: any) {
        try {
          // 确保表已创建
          await initTable();
          const jsonValue = JSON.stringify(value);
          await db.prepare('INSERT INTO kv_store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
            .bind(key, jsonValue)
            .run();
          return true;
        } catch (e: any) {
          console.error('D2 setItem error:', e.message || e, 'key:', key);
          // 如果表不存在，尝试创建后重试
          if (e.message?.includes('no such table')) {
            await initTable();
            await db.prepare('INSERT INTO kv_store (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value')
              .bind(key, JSON.stringify(value))
              .run();
            return true;
          }
          throw e;
        }
      },
      async removeItem(key: string) {
        try {
          // 确保表已创建
          await initTable();
          await db.prepare('DELETE FROM kv_store WHERE key = ?').bind(key).run();
          return true;
        } catch (e: any) {
          console.error('D2 removeItem error:', e.message || e, 'key:', key);
          // 如果表不存在，直接返回成功
          if (e.message?.includes('no such table')) {
            return true;
          }
          throw e;
        }
      }
    };
  }
  
  // 🔥 其次使用 Cloudflare KV binding（生产环境，数据持久化）
  if (env?.BLOG_KV) {
    return {
      async getItem(key: string) {
        const value = await env.BLOG_KV.get(key);
        return value ? JSON.parse(value) : null;
      },
      async setItem(key: string, value: any) {
        return await env.BLOG_KV.put(key, JSON.stringify(value));
      },
      async removeItem(key: string) {
        return await env.BLOG_KV.delete(key);
      }
    };
  }
  
  // 回退到 Nitro useStorage（仅用于本地开发）
  try {
    return useStorage('kv');
  } catch (e) {
    throw new Error('Storage not available. Please configure BLOG_D2 or BLOG_KV binding in Cloudflare Pages.');
  }
}

