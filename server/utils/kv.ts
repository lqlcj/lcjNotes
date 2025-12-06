// KV 存储工具函数
export function getKVStorage(event: any) {
  // 🔥 优先使用 Cloudflare KV binding（生产环境，数据持久化）
  const env = event.context?.cloudflare?.env;
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
    throw new Error('KV storage not available. Please configure BLOG_KV binding in Cloudflare Pages.');
  }
}

