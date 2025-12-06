// KV 存储工具函数
export function getKVStorage(event: any) {
  // 尝试使用 Nitro 的 useStorage
  try {
    return useStorage('kv');
  } catch (e) {
    // 如果失败，尝试从 Cloudflare 环境获取
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
    throw new Error('KV storage not available');
  }
}

