// Notes 数据仓库 - 从 API 获取数据
import { defineStore } from "pinia";
import fm from "front-matter";
// 使用 public 目录下的图片
const defaultCover = "/images/loading.webp";
const defaultAvatar = "/images/home/avatar.webp";

// Notes 数据仓库
export const useNotesStore = defineStore("notes", {
  // 1. state: 相当于组件里的 data
  state: () => ({
    allPosts: [], // 存放解析好的所有文章（只包含元数据）
    postContentMap: {}, // 存储文章 ID 到完整内容的映射（懒加载）
    isLoaded: false, // 标记是否已经加载过元数据
  }),

  // 2. getters: 计算属性，用于按需获取文章内容
  getters: {
    // 根据文章 ID 获取文章内容（懒加载）
    getPostById: (state) => {
      return async (postId) => {
        // 如果已经加载过，直接从缓存获取
        if (state.postContentMap[postId]) {
          return state.postContentMap[postId];
        }

        // 从 API 懒加载文章内容
        try {
          const response = await $fetch(`/api/posts/${postId}`);
          if (response.success) {
            state.postContentMap[postId] = response.data;
            return response.data;
          }
          return null;
        } catch (e) {
          console.error("加载文章内容失败", postId, e);
          return null;
        }
      };
    },
    
    // 根据文件路径获取文章（兼容旧代码）
    getPostByPath: (state) => {
      return async (filePath) => {
        // 从 filePath 中提取 ID（例如：/posts/01.md -> 01）
        // 或者从 allPosts 中找到匹配的 post
        const post = state.allPosts.find(p => {
          // 兼容旧的文件路径格式
          if (p.filePath === filePath) {
            return true;
          }
          // 或者通过 ID 匹配
          if (filePath.includes(p.id)) {
            return true;
          }
          return false;
        });
        
        if (!post) {
          return null;
        }
        
        // 使用 getPostById 获取完整内容
        const fullPost = await state.getPostById(post.id);
        if (!fullPost) {
          return null;
        }
        
        // 转换为 front-matter 格式（兼容旧代码）
        return {
          attributes: {
            title: fullPost.title,
            date: fullPost.date,
            cover: fullPost.cover,
            ratio: fullPost.ratio,
            user: fullPost.user,
            avatar: fullPost.avatar,
            likes: fullPost.likes,
          },
          body: fullPost.body
        };
      };
    },
  },

  // 3. actions: 相当于组件里的 methods，用来修改数据
  actions: {
    // 核心动作：从 API 初始化加载文章元数据
    async initPosts() {
      // 如果已经加载过，就直接返回
      if (this.isLoaded) return;

      console.log("Pinia: 正在从 API 加载文章元数据...");

      try {
        const response = await $fetch('/api/posts');
        
        if (response.success && response.data && Array.isArray(response.data) && response.data.length > 0) {
          // 转换 API 返回的数据格式为组件需要的格式
          this.allPosts = response.data.map((item, index) => ({
            id: item.id,
            title: item.title || "无标题",
            img: item.cover || defaultCover,
            aspectRatio: item.ratio || 0.75,
            user: item.user || "lcj",
            avatar: item.avatar || defaultAvatar,
            likes: item.likes || 0,
            date: item.date || "2025-01-01",
            isLiked: false,
            filePath: `/posts/${item.id}.md`, // 兼容旧代码，使用 ID 作为路径
          }));

          // 读取本地缓存的点赞状态
          this.loadLikesFromStorage();

          // 标记为已加载
          this.isLoaded = true;
        } else {
          // API 返回空数据，清空文章列表，不显示假数据
          console.log("API 返回空数据，清空文章列表");
          this.allPosts = [];
          this.isLoaded = true;
          // 不再回退到文件系统，避免显示假数据
        }
      } catch (error) {
        console.error("从 API 加载文章失败:", error);
        // API 失败时，清空文章列表，不显示假数据
        this.allPosts = [];
        this.isLoaded = true;
      }
    },

    // 兼容模式：从本地文件加载（如果 API 不可用）
    initPostsFromFiles() {
      console.log("Pinia: 尝试从本地文件加载文章...");
      
      try {
        // 用于提取元数据（只解析 front-matter，不存储完整内容）
        const mdFilesForMeta = import.meta.glob("~/posts/*.md", {
          query: "?raw",
          import: "default",
          eager: true, // 必须 eager，用于提取元数据
        });

        const posts = [];
        let index = 0;

        // 只解析 front-matter，提取元数据，不存储完整内容
        for (const path in mdFilesForMeta) {
          const content = mdFilesForMeta[path];
          try {
            // 只解析 front-matter，提取元数据
            const parsed = fm(content);
            const attr = parsed.attributes;

            posts.push({
              id: index++,
              title: attr.title || "无标题",
              img: attr.cover || defaultCover,
              aspectRatio: attr.ratio || 0.75,
              user: attr.user || "lcj",
              avatar: attr.avatar || defaultAvatar,
              likes: attr.likes || 0,
              date: attr.date || "2025-01-01",
              isLiked: false,
              filePath: path, // 存储原始路径，用于懒加载内容
            });
          } catch (e) {
            console.error("解析失败", path, e);
          }
        }

        console.log(`从文件系统加载了 ${posts.length} 篇文章`);

        // 按日期排序并存入 state
        this.allPosts = posts.sort((a, b) => {
          // 处理空日期：空日期使用最小日期（1970-01-01）
          const dateA = a.date && a.date.trim() ? new Date(a.date) : new Date(0);
          const dateB = b.date && b.date.trim() ? new Date(b.date) : new Date(0);
          
          // 获取时间戳进行比较
          const timeA = dateA.getTime();
          const timeB = dateB.getTime();
          
          // 如果日期相同，按 id 降序（后添加的在前，因为 id 是递增的）
          if (timeB === timeA) {
            return b.id - a.id;
          }
          
          // 降序排序：最新的在前
          return timeB - timeA;
        });

        // 读取本地缓存的点赞状态
        this.loadLikesFromStorage();

        // 标记为已加载（即使没有文章也要标记，避免重复加载）
        this.isLoaded = true;
      } catch (error) {
        console.error("从本地文件加载失败:", error);
        // 即使出错也要标记为已加载，避免无限重试
        this.isLoaded = true;
      }
    },

    // 动作：读取本地点赞缓存
    loadLikesFromStorage() {
      try {
        const stored = JSON.parse(
          localStorage.getItem("xhs_likes_pinia") || "{}"
        );
        this.allPosts.forEach((item) => {
          if (stored[item.id]) item.isLiked = true;
        });
      } catch (e) {}
    },

    // 动作：处理点赞
    toggleLike(id) {
      // 在数组里找到这篇文章
      const post = this.allPosts.find((p) => p.id === id);
      if (!post) return;

      post.isLiked = !post.isLiked;
      post.isLiked ? post.likes++ : post.likes--;

      // 更新本地缓存
      try {
        const stored = JSON.parse(
          localStorage.getItem("xhs_likes_pinia") || "{}"
        );
        if (post.isLiked) stored[post.id] = true;
        else delete stored[post.id];
        localStorage.setItem("xhs_likes_pinia", JSON.stringify(stored));
      } catch (e) {}
    },
  },
});
