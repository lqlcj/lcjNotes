<template>
  <div class="admin-page">
    <div class="admin-container">
      <!-- 登录界面 -->
      <div v-if="!isAuthenticated" class="login-form glass-card">
        <h2>管理员</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>用户名</label>
            <input v-model="loginUsername" type="text" placeholder="请输入用户名" required />
          </div>
          <div class="form-group">
            <label>密码</label>
            <input v-model="loginPassword" type="password" placeholder="请输入管理员密码" required />
          </div>
          <button type="submit" class="btn-primary" :disabled="loggingIn">
            {{ loggingIn ? '登录中...' : '登录' }}
          </button>
          <p v-if="loginError" class="error">{{ loginError }}</p>
        </form>
      </div>

      <!-- 管理界面 -->
      <div v-else class="admin-panel">
        <div class="admin-header">
          <h1>管理员</h1>
          <button @click="handleLogout" class="btn-secondary">退出</button>
        </div>

        <!-- 标签页切换 -->
        <div class="admin-tabs">
          <button @click="activeTab = 'posts'" :class="['tab-btn', { active: activeTab === 'posts' }]">
            文章管理
          </button>
          <button @click="activeTab = 'messages'" :class="['tab-btn', { active: activeTab === 'messages' }]">
            留言管理
          </button>
          <button @click="activeTab = 'friends'" :class="['tab-btn', { active: activeTab === 'friends' }]">
            友链管理
          </button>
          <button @click="activeTab = 'moments'" :class="['tab-btn', { active: activeTab === 'moments' }]">
            朋友圈管理
          </button>
        </div>

        <!-- 文章管理 -->
        <div v-if="activeTab === 'posts'" class="tab-content">
          <div class="admin-actions">
            <button @click="showCreateForm = true" class="btn-primary">
              + 新建文章
            </button>
          </div>

          <!-- 文章列表 -->
          <div class="posts-list">
            <div v-if="loading" class="loading">加载中...</div>
            <div v-else-if="posts.length === 0" class="empty">
              还没有文章，点击上方按钮创建第一篇吧！
            </div>
            <div v-else class="posts-grid">
              <div v-for="post in posts" :key="post.id" class="post-card glass-card">
                <div class="post-header">
                  <h3>{{ post.title }}</h3>
                  <div class="post-actions">
                    <button @click="editPost(post)" class="btn-edit">编辑</button>
                    <button @click="deletePost(post.id)" class="btn-delete">删除</button>
                  </div>
                </div>
                <div class="post-meta">
                  <span>日期: {{ post.date }}</span>
                  <span>作者: {{ post.user || 'lcj' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 留言管理 -->
        <div v-if="activeTab === 'messages'" class="tab-content">
          <div class="admin-actions">
            <button @click="showMessageForm = true" class="btn-primary">
              + 添加留言
            </button>
          </div>

          <div class="messages-list">
            <div v-if="messagesLoading" class="loading">加载中...</div>
            <div v-else-if="messages.length === 0" class="empty">
              还没有留言
            </div>
            <div v-else class="messages-grid">
              <div v-for="message in messages" :key="message.id" class="message-card glass-card">
                <div class="message-header">
                  <div class="message-author">
                    <div class="message-avatar">
                      {{ message.name.charAt(0).toUpperCase() }}
                    </div>
                    <div class="message-info">
                      <h4>{{ message.name }}</h4>
                      <span class="message-date">{{ formatDate(message.date) }}</span>
                    </div>
                  </div>
                  <button @click="deleteMessage(message.id)" class="btn-delete">删除</button>
                </div>
                <div class="message-content">
                  {{ message.content }}
                </div>
                <div v-if="message.website" class="message-website">
                  <a :href="message.website" target="_blank">{{ message.website }}</a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 友链管理 -->
        <div v-if="activeTab === 'friends'" class="tab-content">
          <div class="admin-actions">
            <button @click="showFriendForm = true" class="btn-primary">
              + 添加友链
            </button>
          </div>

          <!-- 申请列表 -->
          <div class="friends-requests-section">
            <h3 class="section-title">待审核申请</h3>
            <div v-if="friendsRequestsLoading" class="loading">加载中...</div>
            <div v-else-if="pendingRequests.length === 0" class="empty">
              暂无待审核申请
            </div>
            <div v-else class="requests-grid">
              <div v-for="request in pendingRequests" :key="request.id" class="request-card glass-card">
                <div class="request-header">
                  <h4>{{ request.name }}</h4>
                  <span :class="['status-badge', request.status]">
                    {{ request.status === 'pending' ? '待审核' : request.status === 'approved' ? '已批准' : '已拒绝' }}
                  </span>
                </div>
                <div class="request-info">
                  <p><strong>链接：</strong><a :href="request.url" target="_blank">{{ request.url }}</a></p>
                  <p v-if="request.description"><strong>描述：</strong>{{ request.description }}</p>
                  <p><strong>申请时间：</strong>{{ formatDate(request.createdAt) }}</p>
                </div>
                <div v-if="request.status === 'pending'" class="request-actions">
                  <button @click="approveFriendRequest(request.id)" class="btn-approve">批准</button>
                  <button @click="rejectFriendRequest(request.id)" class="btn-reject">拒绝</button>
                  <button @click="deleteFriendRequest(request.id)" class="btn-delete">删除</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 已批准友链 -->
          <div class="friends-approved-section">
            <h3 class="section-title">已批准友链</h3>
            <div v-if="friendsLoading" class="loading">加载中...</div>
            <div v-else-if="approvedFriends.length === 0" class="empty">
              暂无已批准友链
            </div>
            <div v-else class="friends-grid">
              <div v-for="friend in approvedFriends" :key="friend.id" class="friend-card glass-card">
                <div class="friend-header">
                  <h4>{{ friend.name }}</h4>
                  <button @click="deleteFriend(friend.id)" class="btn-delete">删除</button>
                </div>
                <div class="friend-info">
                  <p><strong>链接：</strong><a :href="friend.url" target="_blank">{{ friend.url }}</a></p>
                  <p v-if="friend.description"><strong>描述：</strong>{{ friend.description }}</p>
                  <p><strong>添加时间：</strong>{{ friend.date }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 朋友圈管理 -->
        <div v-if="activeTab === 'moments'" class="tab-content">
          <div class="admin-actions">
            <button @click="showMomentForm = true" class="btn-primary">
              + 新建朋友圈
            </button>
          </div>

          <!-- 朋友圈列表 -->
          <div class="moments-list">
            <div v-if="momentsLoading" class="loading">加载中...</div>
            <div v-else-if="moments.length === 0" class="empty">
              还没有朋友圈动态，点击上方按钮创建第一条吧！
            </div>
            <div v-else class="moments-grid">
              <div v-for="moment in moments" :key="moment.id" class="moment-card glass-card">
                <div class="moment-header">
                  <div class="moment-author">
                    <div class="moment-avatar">
                      {{ moment.author?.nickname?.charAt(0)?.toUpperCase() || 'L' }}
                    </div>
                    <div class="moment-info">
                      <h4>{{ moment.author?.nickname || 'Leyili' }}</h4>
                      <span class="moment-date">{{ moment.timestamp || '未知时间' }}</span>
                    </div>
                  </div>
                  <div class="moment-actions">
                    <button @click="editMoment(moment)" class="btn-edit">编辑</button>
                    <button @click="deleteMoment(moment.id)" class="btn-delete">删除</button>
                  </div>
                </div>
                <div class="moment-content">
                  {{ moment.content }}
                </div>
                <div v-if="moment.images && moment.images.length > 0" class="moment-images">
                  <span class="image-count">{{ moment.images.length }} 张图片</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 创建/编辑文章表单 -->
        <div v-if="showCreateForm || editingPost" class="form-modal">
          <div class="form-content glass-card">
            <div class="form-header">
              <h2>{{ editingPost ? '编辑文章' : '新建文章' }}</h2>
              <button @click="closeForm" class="close-btn">×</button>
            </div>

            <form @submit.prevent="handleSubmit">
              <div class="form-group">
                <label>标题 *</label>
                <input v-model="formData.title" type="text" required />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>日期</label>
                  <input v-model="formData.date" type="date" />
                </div>
                <div class="form-group">
                  <label>封面图片</label>
                  <div class="cover-upload-section">
                    <!-- 上传按钮 -->
                    <div class="upload-area">
                      <input ref="fileInput" type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                        @change="handleFileSelect" style="display: none;" />
                      <button type="button" @click="triggerFileInput" class="btn-upload" :disabled="uploading">
                        {{ uploading ? '上传中...' : '📤 上传图片' }}
                      </button>
                      <span class="upload-hint">或直接输入图片 URL</span>
                    </div>

                    <!-- 预览 -->
                    <div v-if="coverPreview" class="cover-preview">
                      <img :src="coverPreview" alt="封面预览" />
                      <button type="button" @click="clearCoverPreview" class="btn-remove-preview">
                        ✕
                      </button>
                    </div>

                    <!-- URL 输入 -->
                    <input v-model="formData.cover" type="text" placeholder="/r2/covers/xxx.jpg 或 图片URL"
                      class="cover-url-input" />

                    <!-- 上传进度 -->
                    <div v-if="uploading" class="upload-progress">
                      <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>宽高比</label>
                  <input v-model.number="formData.ratio" type="number" step="0.01" min="0.5" max="2" />
                </div>
                <div class="form-group">
                  <label>作者</label>
                  <input v-model="formData.user" type="text" />
                </div>
              </div>

              <div class="form-group">
                <label>文章内容 (Markdown) *</label>
                <textarea v-model="formData.body" rows="20" required placeholder="在这里输入 Markdown 格式的文章内容..."></textarea>
              </div>

              <div class="form-actions">
                <button type="button" @click="closeForm" class="btn-secondary">取消</button>
                <button type="submit" class="btn-primary" :disabled="submitting">
                  {{ submitting ? '保存中...' : '保存' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- 添加友链表单 -->
        <div v-if="showFriendForm" class="form-modal">
          <div class="form-content glass-card">
            <div class="form-header">
              <h2>添加友链</h2>
              <button @click="closeFriendForm" class="close-btn">×</button>
            </div>

            <form @submit.prevent="handleFriendSubmit">
              <div class="form-group">
                <label>网站名称 *</label>
                <input v-model="friendForm.name" type="text" required placeholder="例如：我的博客" />
              </div>

              <div class="form-group">
                <label>网站链接 *</label>
                <input v-model="friendForm.url" type="url" required placeholder="https://example.com" />
              </div>

              <div class="form-group">
                <label>网站描述</label>
                <textarea v-model="friendForm.description" rows="3" placeholder="简单介绍一下这个网站..."></textarea>
              </div>

              <div class="form-group">
                <label>网站图标（可选）</label>
                <input v-model="friendForm.avatar" type="url" placeholder="https://example.com/avatar.jpg" />
                <small style="color: #999; font-size: 12px; margin-top: 4px; display: block;">建议尺寸：64x64px，支持
                  jpg/png/gif</small>
              </div>

              <div class="form-actions">
                <button type="button" @click="closeFriendForm" class="btn-secondary">取消</button>
                <button type="submit" class="btn-primary" :disabled="submittingFriend">
                  {{ submittingFriend ? '添加中...' : '添加' }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- 创建/编辑朋友圈表单 -->
        <div v-if="showMomentForm" class="form-modal">
          <div class="form-content glass-card">
            <div class="form-header">
              <h2>{{ editingMoment ? '编辑朋友圈' : '新建朋友圈' }}</h2>
              <button @click="closeMomentForm" class="close-btn">×</button>
            </div>

            <form @submit.prevent="handleMomentSubmit">
              <div class="form-group">
                <label>作者昵称</label>
                <input v-model="momentFormData.author.nickname" type="text" placeholder="Leyili" />
              </div>

              <div class="form-group">
                <label>头像URL</label>
                <input v-model="momentFormData.author.avatar" type="text" placeholder="/images/lcj.svg" />
              </div>

              <div class="form-group">
                <label>内容 *</label>
                <textarea v-model="momentFormData.content" rows="6" required placeholder="朋友圈内容..."></textarea>
              </div>

              <div class="form-group">
                <label>发布时间（可选，留空则使用当前时间）</label>
                <input v-model="momentTimestampInput" type="datetime-local" />
                <small class="form-hint">格式：YYYY-MM-DD HH:mm:ss，留空则使用当前时间</small>
              </div>

              <div class="form-group">
                <label>图片（可选）</label>
                <div class="images-upload-section">
                  <div class="upload-area">
                    <input ref="momentFileInput" type="file"
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/gif" multiple
                      @change="handleMomentFileSelect" style="display: none;" />
                    <button type="button" @click="triggerMomentFileInput" class="btn-upload"
                      :disabled="uploadingMomentImages">
                      {{ uploadingMomentImages ? '上传中...' : '📤 上传图片（支持多选）' }}
                    </button>
                    <span class="upload-hint">或直接在下方输入图片URL</span>
                  </div>
                  <div v-if="uploadingMomentImages" class="upload-progress">
                    <div class="progress-bar" :style="{ width: momentUploadProgress + '%' }"></div>
                  </div>
                </div>
                <div v-if="momentFormData.images.length > 0" class="images-preview">
                  <div v-for="(image, index) in momentFormData.images" :key="index" class="image-preview-item">
                    <img :src="image" alt="预览" @error="handleMomentImageError" />
                    <button type="button" @click="removeMomentImage(index)" class="remove-image-btn"
                      title="删除">×</button>
                  </div>
                </div>
                <div class="form-group" style="margin-top: 15px;">
                  <label>或手动输入图片URL（每行一个）</label>
                  <textarea v-model="momentImagesText" rows="3"
                    placeholder="/images/Moments/m1.webp&#10;/images/Moments/m2.webp"></textarea>
                  <small class="form-hint">每行输入一个图片URL</small>
                </div>
              </div>

              <div class="form-actions">
                <button type="button" @click="closeMomentForm" class="btn-secondary">取消</button>
                <button type="submit" class="btn-primary" :disabled="submittingMoment">
                  {{ submittingMoment ? '保存中...' : (editingMoment ? '更新' : '创建') }}
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- 创建留言表单 -->
        <div v-if="showMessageForm" class="form-modal">
          <div class="form-content glass-card">
            <div class="form-header">
              <h2>添加留言</h2>
              <button @click="closeMessageForm" class="close-btn">×</button>
            </div>

            <form @submit.prevent="handleMessageSubmit">
              <div class="form-row">
                <div class="form-group">
                  <label>姓名 *</label>
                  <input v-model="messageForm.name" type="text" required />
                </div>
                <div class="form-group">
                  <label>邮箱</label>
                  <input v-model="messageForm.email" type="email" />
                </div>
              </div>

              <div class="form-group">
                <label>网站</label>
                <input v-model="messageForm.website" type="url" placeholder="https://example.com" />
              </div>

              <div class="form-group">
                <label>留言内容 *</label>
                <textarea v-model="messageForm.content" rows="6" required placeholder="留言内容..."></textarea>
              </div>

              <div class="form-group">
                <label>时间（可选，留空则使用当前时间）</label>
                <input v-model="messageForm.date" type="datetime-local" />
              </div>

              <div class="form-actions">
                <button type="button" @click="closeMessageForm" class="btn-secondary">取消</button>
                <button type="submit" class="btn-primary" :disabled="submittingMessage">
                  {{ submittingMessage ? '提交中...' : '提交' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>

    <!-- 成功提示 -->
    <Transition name="toast">
      <div v-if="showSuccessToast" class="success-toast">
        <div class="toast-content">
          <span class="toast-icon">✓</span>
          <span class="toast-message">{{ successMessage }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
  import { ref, computed, onMounted } from 'vue';

  definePageMeta({
    layout: false
  });

  const isAuthenticated = ref(false);
  const loginUsername = ref('');
  const loginPassword = ref('');
  const loggingIn = ref(false);
  const loginError = ref('');

  const activeTab = ref('posts'); // 'posts' 或 'messages'

  const posts = ref([]);
  const loading = ref(false);
  const showCreateForm = ref(false);
  const editingPost = ref(null);
  const submitting = ref(false);

  const messages = ref([]);
  const messagesLoading = ref(false);
  const showMessageForm = ref(false);
  const submittingMessage = ref(false);

  // 友链管理相关
  const friendsRequests = ref([]);
  const friendsRequestsLoading = ref(false);
  const approvedFriends = ref([]);
  const friendsLoading = ref(false);
  const showFriendForm = ref(false);
  const submittingFriend = ref(false);

  // 朋友圈管理相关
  const moments = ref([]);
  const momentsLoading = ref(false);
  const showMomentForm = ref(false);
  const editingMoment = ref(null);
  const submittingMoment = ref(false);
  const momentFormData = ref({
    content: '',
    timestamp: '',
    author: {
      nickname: 'Leyili',
      avatar: '/images/lcj.svg'
    },
    images: []
  });

  // 朋友圈图片文本（用于表单输入）
  const momentImagesText = computed({
    get: () => {
      return momentFormData.value.images.join('\n');
    },
    set: (value) => {
      momentFormData.value.images = value.split('\n').filter(url => url.trim());
    }
  });

  // 朋友圈时间输入（用于表单输入，转换为API需要的格式）
  const momentTimestampInput = computed({
    get: () => {
      if (!momentFormData.value.timestamp) return '';
      // 将 "创建时间: 2025-12-06 20:31:00" 转换为 "2025-12-06T20:31"
      const match = momentFormData.value.timestamp.match(/创建时间:\s*(\d{4}-\d{2}-\d{2})\s+(\d{2}):(\d{2}):(\d{2})/);
      if (match) {
        return `${match[1]}T${match[2]}:${match[3]}`;
      }
      return '';
    },
    set: (value) => {
      if (!value) {
        momentFormData.value.timestamp = '';
        return;
      }
      // 将 "2025-12-06T20:31" 转换为 "创建时间: 2025-12-06 20:31:00"
      const date = new Date(value);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      momentFormData.value.timestamp = `创建时间: ${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
  });

  // 过滤出待审核的申请
  const pendingRequests = computed(() => {
    return friendsRequests.value.filter(request => request.status === 'pending');
  });

  const messageForm = ref({
    name: '',
    email: '',
    website: '',
    content: '',
    date: new Date().toISOString().slice(0, 16) // 默认使用当前时间
  });

  const friendForm = ref({
    name: '',
    url: '',
    description: '',
    avatar: ''
  });

  const formData = ref({
    title: '',
    date: new Date().toISOString().split('T')[0],
    cover: '',
    ratio: 0.75,
    user: 'lcj',
    avatar: '',
    likes: 0,
    body: ''
  });

  // 图片上传相关
  const fileInput = ref(null);
  const uploading = ref(false);
  const uploadProgress = ref(0);
  const coverPreview = ref('');

  // 朋友圈图片上传相关
  const momentFileInput = ref(null);
  const uploadingMomentImages = ref(false);
  const momentUploadProgress = ref(0);

  // 检查是否已登录
  onMounted(() => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      isAuthenticated.value = true;
      loadPosts();
      loadMessages();
      loadFriendsRequests();
      loadApprovedFriends();
      loadMoments();
    }
  });

  // 登录
  const handleLogin = async () => {
    loggingIn.value = true;
    loginError.value = '';

    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          username: loginUsername.value,
          password: loginPassword.value
        }
      });

      if (response.success) {
        localStorage.setItem('admin_token', response.token);
        isAuthenticated.value = true;
        loginUsername.value = '';
        loginPassword.value = '';
        loadPosts();
        loadMessages();
      }
    } catch (error) {
      loginError.value = error?.data?.message || '登录失败';
    } finally {
      loggingIn.value = false;
    }
  };

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    isAuthenticated.value = false;
    posts.value = [];
  };

  // 加载文章列表
  const loadPosts = async () => {
    loading.value = true;
    try {
      const response = await $fetch('/api/posts');
      if (response.success) {
        posts.value = response.data;
      }
    } catch (error) {
      console.error('加载文章失败:', error);
    } finally {
      loading.value = false;
    }
  };

  // 编辑文章
  const editPost = async (post) => {
    try {
      const response = await $fetch(`/api/posts/${post.id}`);
      if (response.success) {
        editingPost.value = response.data;
        formData.value = {
          title: response.data.title,
          date: response.data.date,
          cover: response.data.cover || '',
          ratio: response.data.ratio || 0.75,
          user: response.data.user || 'lcj',
          avatar: response.data.avatar || '',
          likes: response.data.likes || 0,
          body: response.data.body
        };
        // 如果有封面，显示预览
        if (response.data.cover) {
          coverPreview.value = response.data.cover;
        }
        showCreateForm.value = true;
      }
    } catch (error) {
      console.error('加载文章失败:', error);
      alert('加载文章失败');
    }
  };

  // 删除文章
  const deletePost = async (id) => {
    if (!confirm('确定要删除这篇文章吗？')) {
      return;
    }

    const token = localStorage.getItem('admin_token');
    try {
      const response = await $fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.success) {
        showSuccess('删除成功');
        loadPosts();
      }
    } catch (error) {
      alert(error?.data?.message || '删除失败');
    }
  };

  // 提交表单
  const handleSubmit = async () => {
    submitting.value = true;
    const token = localStorage.getItem('admin_token');

    try {
      if (editingPost.value) {
        // 更新文章
        const response = await $fetch(`/api/posts/${editingPost.value.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData.value
        });

        if (response.success) {
          showSuccess('更新成功');
          closeForm();
          loadPosts();
        }
      } else {
        // 创建文章
        const response = await $fetch('/api/posts', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData.value
        });

        if (response.success) {
          showSuccess('创建成功');
          closeForm();
          loadPosts();
        }
      }
    } catch (error) {
      alert(error?.data?.message || '保存失败');
    } finally {
      submitting.value = false;
    }
  };

  // 关闭表单
  const closeForm = () => {
    showCreateForm.value = false;
    editingPost.value = null;
    formData.value = {
      title: '',
      date: new Date().toISOString().split('T')[0],
      cover: '',
      ratio: 0.75,
      user: 'lcj',
      avatar: '',
      likes: 0,
      body: ''
    };
    coverPreview.value = '';
    uploadProgress.value = 0;
  };

  // 触发文件选择
  const triggerFileInput = () => {
    fileInput.value?.click();
  };

  // 处理文件选择
  const handleFileSelect = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 验证文件类型
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      alert('不支持的文件类型，仅支持：JPEG, PNG, WebP, GIF');
      return;
    }

    // 验证文件大小（最大 10MB）
    if (file.size > 10 * 1024 * 1024) {
      alert('文件大小不能超过 10MB');
      return;
    }

    // 显示预览
    const reader = new FileReader();
    reader.onload = (e) => {
      coverPreview.value = e.target?.result;
    };
    reader.readAsDataURL(file);

    // 上传文件
    await uploadImage(file);
  };

  // 上传图片到 R2
  const uploadImage = async (file) => {
    uploading.value = true;
    uploadProgress.value = 0;
    const token = localStorage.getItem('admin_token');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        if (uploadProgress.value < 90) {
          uploadProgress.value += 10;
        }
      }, 200);

      const response = await $fetch('/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      clearInterval(progressInterval);
      uploadProgress.value = 100;

      if (response.success) {
        // 设置封面 URL
        formData.value.cover = response.data.url;
        alert('图片上传成功！');
      } else {
        throw new Error('上传失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert(error?.data?.message || '图片上传失败，请重试');
      coverPreview.value = '';
    } finally {
      uploading.value = false;
      uploadProgress.value = 0;
      // 清空文件输入
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    }
  };

  // 清除封面预览
  const clearCoverPreview = () => {
    coverPreview.value = '';
    formData.value.cover = '';
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  };

  // 触发朋友圈图片文件选择
  const triggerMomentFileInput = () => {
    momentFileInput.value?.click();
  };

  // 处理朋友圈图片文件选择（支持多选）
  const handleMomentFileSelect = async (event) => {
    let files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // 验证所有文件
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const invalidFiles = files.filter(file => !validTypes.includes(file.type));
    if (invalidFiles.length > 0) {
      alert('不支持的文件类型，仅支持：JPEG, PNG, WebP, GIF');
      return;
    }

    // 验证文件大小（最大 10MB）并过滤
    const oversizedFiles = files.filter(file => file.size > 10 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      alert('有文件大小超过 10MB，已跳过');
      files = files.filter(file => file.size <= 10 * 1024 * 1024);
    }

    // 逐个上传文件
    let successCount = 0;
    for (const file of files) {
      try {
        await uploadMomentImage(file);
        successCount++;
      } catch (error) {
        console.error('上传文件失败:', error);
      }
    }

    if (successCount > 0) {
      alert(`成功上传 ${successCount} 张图片！`);
    }

    // 清空文件输入
    if (momentFileInput.value) {
      momentFileInput.value.value = '';
    }
  };

  // 上传朋友圈图片到 R2
  const uploadMomentImage = async (file) => {
    uploadingMomentImages.value = true;
    momentUploadProgress.value = 0;
    const token = localStorage.getItem('admin_token');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('file', file);

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        if (momentUploadProgress.value < 90) {
          momentUploadProgress.value += 10;
        }
      }, 200);

      const response = await $fetch('/api/upload/image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      clearInterval(progressInterval);
      momentUploadProgress.value = 100;

      if (response.success) {
        // 添加到图片列表
        momentFormData.value.images.push(response.data.url);
      } else {
        throw new Error('上传失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      throw error; // 抛出错误，让调用者处理
    } finally {
      uploadingMomentImages.value = false;
      momentUploadProgress.value = 0;
    }
  };

  // 删除朋友圈图片
  const removeMomentImage = (index) => {
    momentFormData.value.images.splice(index, 1);
  };

  // 处理朋友圈图片加载错误
  const handleMomentImageError = (event) => {
    event.target.style.display = 'none';
  };

  // 加载留言列表
  const loadMessages = async () => {
    messagesLoading.value = true;
    try {
      const response = await $fetch('/api/messages');
      if (response.success) {
        messages.value = response.data;
      }
    } catch (error) {
      console.error('加载留言失败:', error);
    } finally {
      messagesLoading.value = false;
    }
  };

  // 删除留言
  const deleteMessage = async (id) => {
    if (!confirm('确定要删除这条留言吗？')) {
      return;
    }

    const token = localStorage.getItem('admin_token');
    try {
      const response = await $fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.success) {
        showSuccess('删除成功');
        loadMessages();
      }
    } catch (error) {
      alert(error?.data?.message || '删除失败');
    }
  };

  // 格式化日期
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // 提交留言表单
  const handleMessageSubmit = async () => {
    submittingMessage.value = true;
    const token = localStorage.getItem('admin_token');

    try {
      const response = await $fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: {
          name: messageForm.value.name,
          email: messageForm.value.email,
          website: messageForm.value.website,
          content: messageForm.value.content,
          date: messageForm.value.date || undefined // 如果设置了时间，传递时间
        }
      });

      if (response.success) {
        showSuccess('留言创建成功');
        closeMessageForm();
        loadMessages();
      }
    } catch (error) {
      alert(error?.data?.message || '创建失败');
    } finally {
      submittingMessage.value = false;
    }
  };

  // 关闭留言表单
  const closeMessageForm = () => {
    showMessageForm.value = false;
    messageForm.value = {
      name: '',
      email: '',
      website: '',
      content: '',
      date: new Date().toISOString().slice(0, 16) // 重置为当前时间
    };
  };

  // 加载友链申请列表
  const loadFriendsRequests = async () => {
    friendsRequestsLoading.value = true;
    const token = localStorage.getItem('admin_token');
    try {
      const response = await $fetch('/api/friends/requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.success) {
        friendsRequests.value = response.data;
      }
    } catch (error) {
      console.error('加载友链申请失败:', error);
    } finally {
      friendsRequestsLoading.value = false;
    }
  };

  // 加载已批准友链
  const loadApprovedFriends = async () => {
    friendsLoading.value = true;
    try {
      const response = await $fetch('/api/friends');
      if (response.success) {
        approvedFriends.value = response.data;
      }
    } catch (error) {
      console.error('加载已批准友链失败:', error);
    } finally {
      friendsLoading.value = false;
    }
  };

  // 批准友链申请
  const approveFriendRequest = async (id) => {
    if (!confirm('确定要批准这个友链申请吗？')) {
      return;
    }

    const token = localStorage.getItem('admin_token');
    try {
      const response = await $fetch(`/api/friends/requests/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: {
          status: 'approved'
        }
      });

      if (response.success) {
        showSuccess('批准成功');
        loadFriendsRequests();
        loadApprovedFriends();
      }
    } catch (error) {
      alert(error?.data?.message || '批准失败');
    }
  };

  // 拒绝友链申请
  const rejectFriendRequest = async (id) => {
    if (!confirm('确定要拒绝这个友链申请吗？')) {
      return;
    }

    const token = localStorage.getItem('admin_token');
    try {
      const response = await $fetch(`/api/friends/requests/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: {
          status: 'rejected'
        }
      });

      if (response.success) {
        showSuccess('已拒绝');
        loadFriendsRequests();
      }
    } catch (error) {
      alert(error?.data?.message || '操作失败');
    }
  };

  // 删除友链申请
  const deleteFriendRequest = async (id) => {
    if (!confirm('确定要删除这个申请吗？')) {
      return;
    }

    const token = localStorage.getItem('admin_token');
    try {
      const response = await $fetch(`/api/friends/requests/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.success) {
        showSuccess('删除成功');
        loadFriendsRequests();
      }
    } catch (error) {
      alert(error?.data?.message || '删除失败');
    }
  };

  // 删除已批准友链
  const deleteFriend = async (id) => {
    if (!confirm('确定要删除这个友链吗？')) {
      return;
    }

    const token = localStorage.getItem('admin_token');
    try {
      const response = await $fetch(`/api/friends/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.success) {
        showSuccess('删除成功');
        loadApprovedFriends();
      }
    } catch (error) {
      alert(error?.data?.message || '删除失败');
    }
  };

  // 提交友链表单
  const handleFriendSubmit = async () => {
    // 验证表单
    if (!friendForm.value.name.trim()) {
      alert('请输入网站名称');
      return;
    }

    if (!friendForm.value.url.trim()) {
      alert('请输入网站链接');
      return;
    }

    // 验证 URL 格式
    try {
      new URL(friendForm.value.url);
    } catch {
      alert('请输入有效的网站链接（需要包含 http:// 或 https://）');
      return;
    }

    // 如果提供了头像，验证 URL
    if (friendForm.value.avatar && friendForm.value.avatar.trim()) {
      try {
        new URL(friendForm.value.avatar);
      } catch {
        alert('请输入有效的图标链接');
        return;
      }
    }

    submittingFriend.value = true;
    const token = localStorage.getItem('admin_token');

    try {
      const response = await $fetch('/api/friends', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: {
          name: friendForm.value.name,
          url: friendForm.value.url,
          description: friendForm.value.description,
          avatar: friendForm.value.avatar
        }
      });

      if (response.success) {
        showSuccess('友链添加成功');
        closeFriendForm();
        loadApprovedFriends();
      }
    } catch (error) {
      alert(error?.data?.message || '添加失败');
    } finally {
      submittingFriend.value = false;
    }
  };

  // 关闭友链表单
  const closeFriendForm = () => {
    showFriendForm.value = false;
    friendForm.value = {
      name: '',
      url: '',
      description: '',
      avatar: ''
    };
  };

  // 加载朋友圈列表
  const loadMoments = async () => {
    momentsLoading.value = true;
    try {
      const response = await $fetch('/api/moments');
      if (response.success) {
        moments.value = response.data || [];
      }
    } catch (error) {
      console.error('加载朋友圈失败:', error);
    } finally {
      momentsLoading.value = false;
    }
  };

  // 编辑朋友圈
  const editMoment = (moment) => {
    editingMoment.value = moment;
    momentFormData.value = {
      content: moment.content || '',
      timestamp: moment.timestamp || '',
      author: {
        nickname: moment.author?.nickname || 'Leyili',
        avatar: moment.author?.avatar || '/images/home/avatar.webp'
      },
      images: moment.images || []
    };
    showMomentForm.value = true;
  };

  // 删除朋友圈
  const deleteMoment = async (id) => {
    if (!confirm('确定要删除这条朋友圈动态吗？')) {
      return;
    }

    const token = localStorage.getItem('admin_token');
    try {
      const response = await $fetch(`/api/moments/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.success) {
        showSuccess('删除成功');
        loadMoments();
      }
    } catch (error) {
      alert(error?.data?.message || '删除失败');
    }
  };

  // 提交朋友圈表单
  const handleMomentSubmit = async () => {
    if (!momentFormData.value.content.trim()) {
      alert('请输入朋友圈内容');
      return;
    }

    submittingMoment.value = true;
    const token = localStorage.getItem('admin_token');

    try {
      // 准备提交的数据
      const submitData = {
        content: momentFormData.value.content,
        author: momentFormData.value.author,
        images: momentFormData.value.images || []
      };

      // 如果有时间戳，添加到提交数据中
      if (momentFormData.value.timestamp) {
        submitData.timestamp = momentFormData.value.timestamp;
      }

      if (editingMoment.value) {
        // 更新朋友圈
        const response = await $fetch(`/api/moments/${editingMoment.value.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: submitData
        });

        if (response.success) {
          showSuccess('更新成功');
          closeMomentForm();
          loadMoments();
        } else {
          alert(response.message || '更新失败');
        }
      } else {
        // 创建朋友圈
        const response = await $fetch('/api/moments', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: submitData
        });

        if (response.success) {
          showSuccess('创建成功');
          closeMomentForm();
          loadMoments();
        } else {
          alert(response.message || '创建失败');
        }
      }
    } catch (error) {
      console.error('保存朋友圈失败:', error);
      alert(error?.data?.message || error?.message || '保存失败，请检查网络连接');
    } finally {
      submittingMoment.value = false;
    }
  };

  // 关闭朋友圈表单
  const closeMomentForm = () => {
    showMomentForm.value = false;
    editingMoment.value = null;
    momentFormData.value = {
      content: '',
      timestamp: '',
      author: {
        nickname: 'Leyili',
        avatar: '/images/lcj.svg'
      },
      images: []
    };
    momentUploadProgress.value = 0;
    uploadingMomentImages.value = false;
    if (momentFileInput.value) {
      momentFileInput.value.value = '';
    }
  };
</script>

<style scoped>
  .admin-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #FFDDE1 0%, #E0C3FC 100%);
    padding: 40px 20px;
  }

  .admin-container {
    max-width: 1200px;
    margin: 0 auto;
  }

  .glass-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.8);
    border-radius: 12px;
    box-shadow: 0 5px 25px rgba(0, 0, 0, 0.08);
    padding: 30px;
  }

  /* 登录表单 */
  .login-form {
    max-width: 400px;
    margin: 100px auto;
  }

  .login-form h2 {
    margin-bottom: 20px;
    text-align: center;
    color: #333;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-hint {
    display: block;
    color: #999;
    font-size: 12px;
    margin-top: 4px;
  }

  .form-group label {
    display: block;
    margin-bottom: 8px;
    color: #555;
    font-weight: 500;
  }

  .form-group input,
  .form-group textarea {
    width: 100%;
    padding: 10px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 14px;
    box-sizing: border-box;
  }

  .form-group textarea {
    font-family: monospace;
    resize: vertical;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }

  .btn-primary {
    width: 100%;
    padding: 12px;
    background: #6c5ce7;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .btn-primary:hover:not(:disabled) {
    background: #5a4fcf;
  }

  .btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-secondary {
    padding: 8px 16px;
    background: #95a5a6;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .btn-secondary:hover {
    background: #7f8c8d;
  }

  .error {
    color: #e74c3c;
    margin-top: 10px;
    font-size: 14px;
  }

  /* 管理面板 */
  .admin-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .admin-header h1 {
    color: #333;
    margin: 0;
  }

  /* 标签页 */
  .admin-tabs {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
    border-bottom: 2px solid rgba(255, 255, 255, 0.3);
  }

  .tab-btn {
    padding: 10px 20px;
    background: transparent;
    border: none;
    border-bottom: 2px solid transparent;
    color: #666;
    cursor: pointer;
    font-size: 16px;
    transition: all 0.3s;
    margin-bottom: -2px;
  }

  .tab-btn:hover {
    color: #6c5ce7;
  }

  .tab-btn.active {
    color: #6c5ce7;
    border-bottom-color: #6c5ce7;
    font-weight: 600;
  }

  .tab-content {
    margin-top: 20px;
  }

  .admin-actions {
    margin-bottom: 30px;
  }

  .posts-list {
    margin-top: 20px;
  }

  .loading,
  .empty {
    text-align: center;
    padding: 40px;
    color: #666;
  }

  .posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .post-card {
    padding: 20px;
  }

  .post-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 15px;
  }

  .post-header h3 {
    margin: 0;
    flex: 1;
    color: #333;
    font-size: 18px;
  }

  .post-actions {
    display: flex;
    gap: 8px;
  }

  .btn-edit {
    padding: 6px 12px;
    background: #3498db;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
  }

  .btn-edit:hover {
    background: #2980b9;
  }

  .btn-delete {
    padding: 6px 12px;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 12px;
  }

  .btn-delete:hover {
    background: #c0392b;
  }

  .post-meta {
    display: flex;
    gap: 15px;
    font-size: 12px;
    color: #999;
  }

  /* 表单模态框 */
  .form-modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
    overflow-y: auto;
  }

  .form-content {
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
  }

  .form-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .form-header h2 {
    margin: 0;
    color: #333;
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 32px;
    cursor: pointer;
    color: #999;
    line-height: 1;
    padding: 0;
    width: 32px;
    height: 32px;
  }

  .close-btn:hover {
    color: #333;
  }

  .form-actions {
    display: flex;
    gap: 10px;
    justify-content: flex-end;
    margin-top: 20px;
  }

  @media (max-width: 768px) {
    .form-row {
      grid-template-columns: 1fr;
    }

    .posts-grid {
      grid-template-columns: 1fr;
    }

    .admin-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 15px;
    }
  }

  /* 留言卡片样式 */
  .messages-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
  }

  .message-card {
    padding: 20px;
  }

  .moments-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .moment-card {
    padding: 20px;
  }

  .moment-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 15px;
  }

  .moment-author {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }

  .moment-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 16px;
  }

  .moment-info h4 {
    margin: 0 0 4px 0;
    font-size: 16px;
    color: #333;
  }

  .moment-date {
    font-size: 12px;
    color: #999;
  }

  .moment-actions {
    display: flex;
    gap: 8px;
  }

  .moment-content {
    margin-bottom: 12px;
    line-height: 1.6;
    color: #555;
    word-break: break-word;
  }

  .moment-images {
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid #eee;
  }

  .image-count {
    font-size: 12px;
    color: #999;
  }

  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: start;
    margin-bottom: 15px;
  }

  .message-author {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }

  .message-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
    flex-shrink: 0;
  }

  .message-info h4 {
    margin: 0 0 4px 0;
    color: #333;
    font-size: 16px;
  }

  .message-date {
    font-size: 12px;
    color: #999;
  }

  .message-content {
    color: #555;
    line-height: 1.6;
    margin-bottom: 10px;
    word-break: break-word;
  }

  .message-website {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }

  .message-website a {
    color: #6c5ce7;
    text-decoration: none;
    font-size: 14px;
  }

  .message-website a:hover {
    text-decoration: underline;
  }

  /* 图片上传样式 */
  .cover-upload-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .upload-area {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }

  .btn-upload {
    padding: 8px 16px;
    background: #6c5ce7;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.3s;
  }

  .btn-upload:hover:not(:disabled) {
    background: #5a4fcf;
  }

  .btn-upload:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .images-upload-section {
    margin-bottom: 15px;
  }

  .images-preview {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
    gap: 12px;
    margin-top: 15px;
    padding: 15px;
    background: #f9f9f9;
    border-radius: 8px;
  }

  .image-preview-item {
    position: relative;
    width: 100%;
    padding-bottom: 100%;
    /* 保持正方形 */
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    border: 2px solid #e0e0e0;
  }

  .image-preview-item img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .remove-image-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    width: 24px;
    height: 24px;
    background: rgba(231, 76, 60, 0.9);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 18px;
    line-height: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s;
    z-index: 10;
  }

  .remove-image-btn:hover {
    background: rgba(231, 76, 60, 1);
  }

  .upload-hint {
    font-size: 12px;
    color: #999;
  }

  .cover-preview {
    position: relative;
    width: 200px;
    height: 150px;
    border: 2px dashed #ddd;
    border-radius: 4px;
    overflow: hidden;
    background: #f5f5f5;
  }

  .cover-preview img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .btn-remove-preview {
    position: absolute;
    top: 5px;
    right: 5px;
    width: 24px;
    height: 24px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s;
  }

  .btn-remove-preview:hover {
    background: rgba(0, 0, 0, 0.8);
  }

  .cover-url-input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }

  .upload-progress {
    width: 100%;
    height: 4px;
    background: #f0f0f0;
    border-radius: 2px;
    overflow: hidden;
  }

  .progress-bar {
    height: 100%;
    background: #6c5ce7;
    transition: width 0.3s;
  }

  @media (max-width: 768px) {
    .messages-grid {
      grid-template-columns: 1fr;
    }

    .admin-tabs {
      flex-direction: column;
      gap: 5px;
    }

    .tab-btn {
      width: 100%;
      text-align: left;
    }

    .cover-preview {
      width: 100%;
      max-width: 300px;
    }
  }

  /* 友链管理样式 */
  .friends-requests-section,
  .friends-approved-section {
    margin-bottom: 40px;
  }

  .section-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 2px solid #e0e0e0;
  }

  .requests-grid,
  .friends-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 20px;
  }

  .request-card,
  .friend-card {
    padding: 20px;
  }

  .request-header,
  .friend-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  .request-header h4,
  .friend-header h4 {
    margin: 0;
    color: #333;
    font-size: 1.1rem;
  }

  .status-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .status-badge.pending {
    background: #fff3cd;
    color: #856404;
  }

  .status-badge.approved {
    background: #d4edda;
    color: #155724;
  }

  .status-badge.rejected {
    background: #f8d7da;
    color: #721c24;
  }

  /* 成功提示样式 */
  .success-toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000;
    pointer-events: none;
  }

  .toast-content {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(76, 175, 80, 0.95);
    color: white;
    padding: 12px 24px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    backdrop-filter: blur(10px);
    min-width: 200px;
    justify-content: center;
  }

  .toast-icon {
    font-size: 18px;
    font-weight: bold;
    line-height: 1;
  }

  .toast-message {
    font-size: 14px;
    font-weight: 500;
  }

  /* Toast 动画 */
  .toast-enter-active,
  .toast-leave-active {
    transition: all 0.3s ease;
  }

  .toast-enter-from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }

  .toast-enter-to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  .toast-leave-from {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }

  .toast-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }

  .request-info,
  .friend-info {
    margin-bottom: 15px;
  }

  .request-info p,
  .friend-info p {
    margin: 8px 0;
    font-size: 0.9rem;
    color: #666;
    line-height: 1.6;
  }

  .request-info a,
  .friend-info a {
    color: #6c5ce7;
    text-decoration: none;
  }

  .request-info a:hover,
  .friend-info a:hover {
    text-decoration: underline;
  }

  .request-actions {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .btn-approve {
    padding: 6px 16px;
    background: #27ae60;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: background 0.3s;
  }

  .btn-approve:hover {
    background: #229954;
  }

  .btn-reject {
    padding: 6px 16px;
    background: #e74c3c;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: background 0.3s;
  }

  .btn-reject:hover {
    background: #c0392b;
  }

  @media (max-width: 768px) {

    .requests-grid,
    .friends-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
