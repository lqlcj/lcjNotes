<template>
  <div class="admin-page">
    <div class="admin-container">
      <!-- 登录界面 -->
      <div v-if="!isAuthenticated" class="login-form glass-card">
        <h2 class="handwritten">Dev.Space</h2>
        <p class="subtitle">🚧 Building in progress...正在构建中...</p>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label>Userame</label>
            <input v-model="loginUsername" type="text" required />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input v-model="loginPassword" type="password" required />
          </div>

          <!-- Turnstile 验证 -->
          <div class="form-group">
            <div ref="turnstileContainer" class="turnstile-container"></div>
          </div>

          <button type="submit" class="btn-primary" :disabled="loggingIn || !turnstileToken">
            {{ loggingIn ? '登录中...' : 'Connect' }}
          </button>
          <p v-if="loginError" class="error">{{ loginError }}</p>
        </form>
      </div>

      <!-- 管理界面 -->
      <div v-else class="admin-panel">
        <div class="admin-header">
          <h1>Me</h1>
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
          <button @click="activeTab = 'bookmarks'" :class="['tab-btn', { active: activeTab === 'bookmarks' }]">
            书签管理
          </button>
          <button @click="activeTab = 'assets'" :class="['tab-btn', { active: activeTab === 'assets' }]">
            图床管理
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

        <!-- 书签管理 -->
        <div v-if="activeTab === 'bookmarks'" class="tab-content">
          <div class="admin-actions">
            <button @click="showBookmarkForm = true" class="btn-primary">
              + 新建书签
            </button>
          </div>

          <!-- 书签列表 -->
          <div class="bookmarks-list">
            <div v-if="bookmarksLoading" class="loading">加载中...</div>
            <div v-else-if="bookmarks.length === 0" class="empty">
              还没有书签，点击上方按钮创建第一个吧！
            </div>
            <div v-else class="bookmarks-grid">
              <div v-for="bookmark in bookmarks" :key="bookmark.id" class="bookmark-card glass-card">
                <div class="bookmark-header">
                  <div class="bookmark-info">
                    <h4>{{ bookmark.name }}</h4>
                    <p class="bookmark-url">{{ bookmark.url }}</p>
                    <p v-if="bookmark.description" class="bookmark-description">{{ bookmark.description }}</p>
                  </div>
                  <div class="bookmark-actions">
                    <button @click="editBookmark(bookmark)" class="btn-edit">编辑</button>
                    <button @click="deleteBookmark(bookmark.id)" class="btn-delete">删除</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 图床管理 -->
        <div v-if="activeTab === 'assets'" class="tab-content">
          <div class="admin-actions">
            <button @click="triggerAssetUpload" class="btn-primary" :disabled="uploadingAsset">
              {{ uploadingAsset ? '上传中...' : '+ 上传图片' }}
            </button>
            <input ref="assetFileInput" type="file" accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
              multiple @change="handleAssetFileSelect" style="display: none" />
            <button @click="loadAssets" class="btn-secondary" :disabled="assetsLoading">
              {{ assetsLoading ? '加载中...' : '刷新' }}
            </button>
          </div>

          <!-- 拖拽上传区域 -->
          <div class="asset-upload-zone" :class="{ 'dragover': isDragging, 'uploading': uploadingAsset }"
            @drop.prevent="handleDrop" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false"
            @click="triggerAssetUpload">
            <div v-if="!uploadingAsset" class="upload-zone-content">
              <p>📁 拖拽图片到这里或点击上传</p>
              <p class="upload-hint">支持 JPG、PNG、WebP、GIF，最大 10MB</p>
            </div>
            <div v-else class="upload-zone-content">
              <p>上传中... {{ assetUploadProgress }}%</p>
            </div>
          </div>

          <!-- 图片列表 -->
          <div class="assets-list">
            <div v-if="assetsLoading" class="loading">加载中...</div>
            <div v-else-if="assets.length === 0" class="empty">
              还没有图片，上传第一张吧！
            </div>
            <div v-else class="assets-grid">
              <div v-for="asset in assets" :key="asset.key" class="asset-card glass-card">
                <div class="asset-image-wrapper">
                  <img :src="asset.url" :alt="asset.name" @error="handleImageError" />
                  <div class="asset-overlay">
                    <button @click.stop="copyAssetUrl(asset.url)" class="btn-copy">复制链接</button>
                    <button @click.stop="deleteAsset(asset.key)" class="btn-delete"
                      :disabled="deletingAssets.includes(asset.key)">
                      {{ deletingAssets.includes(asset.key) ? '删除中...' : '删除' }}
                    </button>
                  </div>
                </div>
                <div class="asset-info">
                  <p class="asset-name" :title="asset.name">{{ asset.name }}</p>
                  <p class="asset-meta">
                    {{ formatFileSize(asset.size) }} ·
                    {{ formatDate(asset.uploaded) }}
                  </p>
                </div>
              </div>
            </div>

            <!-- 加载更多 -->
            <div v-if="hasMoreAssets && !assetsLoading" class="load-more">
              <button @click="loadMoreAssets" class="btn-secondary">加载更多</button>
            </div>
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
                    placeholder="https://your-r2-domain.com/image1.webp&#10;https://your-r2-domain.com/image2.webp"></textarea>
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

        <!-- 创建/编辑书签表单 -->
        <div v-if="showBookmarkForm" class="form-modal">
          <div class="form-content glass-card">
            <div class="form-header">
              <h2>{{ editingBookmark ? '编辑书签' : '新建书签' }}</h2>
              <button @click="closeBookmarkForm" class="close-btn">×</button>
            </div>

            <form @submit.prevent="handleBookmarkSubmit">
              <div class="form-group">
                <label>网站名称 *</label>
                <input v-model="bookmarkFormData.name" type="text" required placeholder="例如：GitHub" />
              </div>

              <div class="form-group">
                <label>网站链接 *</label>
                <input v-model="bookmarkFormData.url" type="url" required placeholder="https://github.com" />
              </div>

              <div class="form-group">
                <label>网站介绍（可选）</label>
                <textarea v-model="bookmarkFormData.description" rows="3" placeholder="网站简介..."></textarea>
              </div>

              <div class="form-actions">
                <button type="button" @click="closeBookmarkForm" class="btn-secondary">取消</button>
                <button type="submit" class="btn-primary" :disabled="submittingBookmark">
                  {{ submittingBookmark ? '保存中...' : (editingBookmark ? '更新' : '创建') }}
                </button>
              </div>
            </form>
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
  import { ref, computed, onMounted, nextTick, watch } from 'vue';

  definePageMeta({
    layout: false
  });

  const isAuthenticated = ref(false);
  const loginUsername = ref('');
  const loginPassword = ref('');
  const loggingIn = ref(false);
  const loginError = ref('');

  // Turnstile 验证相关
  const config = useRuntimeConfig();
  const turnstileSiteKey = config.public.turnstileSiteKey;
  const turnstileContainer = ref(null);
  const turnstileToken = ref('');
  let turnstileWidgetId = null;

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

  // 书签管理相关
  const bookmarks = ref([]);
  const bookmarksLoading = ref(false);
  const showBookmarkForm = ref(false);
  const editingBookmark = ref(null);
  const submittingBookmark = ref(false);
  const bookmarkFormData = ref({
    name: '',
    url: '',
    description: ''
  });
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

  // 图床管理相关
  const assetFileInput = ref(null);
  const assets = ref([]);
  const assetsLoading = ref(false);
  const uploadingAsset = ref(false);
  const assetUploadProgress = ref(0);
  const isDragging = ref(false);
  const deletingAssets = ref([]);
  const assetsCursor = ref(null);
  const hasMoreAssets = ref(false);

  // 成功提示相关
  const showSuccessToast = ref(false);
  const successMessage = ref('');

  // 显示成功提示
  const showSuccess = (message) => {
    successMessage.value = message;
    showSuccessToast.value = true;
    setTimeout(() => {
      showSuccessToast.value = false;
    }, 2000);
  };

  // 加载 Turnstile
  const loadTurnstile = async () => {
    if (!turnstileSiteKey) {
      console.warn('Turnstile Site Key 未配置，跳过验证');
      turnstileToken.value = 'skip'; // 允许跳过验证（开发环境）
      return;
    }

    // 确保容器已渲染
    await nextTick();

    if (!turnstileContainer.value) {
      console.warn('Turnstile 容器未找到，延迟重试');
      setTimeout(() => {
        loadTurnstile();
      }, 100);
      return;
    }

    // 动态加载 Turnstile script
    if (window.turnstile) {
      renderTurnstile();
      return;
    }

    // 检查是否已经在加载
    if (document.querySelector('script[src*="turnstile"]')) {
      // 如果脚本已存在但 window.turnstile 还未加载，等待一下
      const checkInterval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(checkInterval);
          renderTurnstile();
        }
      }, 100);

      // 10秒后停止检查
      setTimeout(() => {
        clearInterval(checkInterval);
      }, 10000);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      renderTurnstile();
    };
    script.onerror = () => {
      console.error('Turnstile 脚本加载失败');
      loginError.value = '验证服务加载失败，请刷新页面重试';
    };
    document.head.appendChild(script);
  };

  // 渲染 Turnstile widget
  const renderTurnstile = () => {
    if (!window.turnstile || !turnstileContainer.value || !turnstileSiteKey) {
      console.warn('Turnstile 渲染条件不满足:', {
        hasTurnstile: !!window.turnstile,
        hasContainer: !!turnstileContainer.value,
        hasSiteKey: !!turnstileSiteKey
      });
      return;
    }

    // 如果已经渲染过，先重置
    if (turnstileWidgetId) {
      try {
        window.turnstile.remove(turnstileWidgetId);
      } catch (e) {
        console.warn('移除 Turnstile widget 失败:', e);
      }
      turnstileWidgetId = null;
    }

    try {
      turnstileWidgetId = window.turnstile.render(turnstileContainer.value, {
        sitekey: turnstileSiteKey,
        callback: (token) => {
          turnstileToken.value = token;
          console.log('Turnstile 验证成功');
        },
        'error-callback': () => {
          turnstileToken.value = '';
          loginError.value = '验证失败，请重试';
          console.error('Turnstile 验证失败');
        },
        'expired-callback': () => {
          turnstileToken.value = '';
          console.warn('Turnstile token 已过期');
        },
        theme: 'light',
        size: 'normal'
      });
      console.log('Turnstile widget 已渲染');
    } catch (error) {
      console.error('渲染 Turnstile widget 失败:', error);
    }
  };

  // 重置 Turnstile
  const resetTurnstile = () => {
    if (turnstileWidgetId && window.turnstile) {
      window.turnstile.reset(turnstileWidgetId);
      turnstileToken.value = '';
    }
  };

  // 检查是否已登录（通过 API 检查 session cookie）
  onMounted(async () => {
    try {
      const response = await $fetch('/api/auth/check');
      if (response.authenticated) {
        isAuthenticated.value = true;
        loadPosts();
        loadMessages();
        loadFriendsRequests();
        loadApprovedFriends();
        loadMoments();
        loadBookmarks();
      } else {
        // 如果未登录，等待 DOM 渲染后加载 Turnstile
        await nextTick();
        setTimeout(() => {
          loadTurnstile();
        }, 300);
      }
    } catch (error) {
      // 检查失败，显示登录表单
      await nextTick();
      setTimeout(() => {
        loadTurnstile();
      }, 300);
    }
  });

  // 监听登录状态变化，如果退出登录，重新加载 Turnstile
  watch(isAuthenticated, (newVal) => {
    if (!newVal) {
      // 退出登录后，重置并重新加载 Turnstile
      resetTurnstile();
      nextTick(() => {
        setTimeout(() => {
          loadTurnstile();
        }, 200);
      });
    }
  });

  // 登录
  const handleLogin = async () => {
    // 验证 Turnstile token
    if (turnstileSiteKey && !turnstileToken.value) {
      loginError.value = '请完成人机验证';
      return;
    }

    loggingIn.value = true;
    loginError.value = '';

    try {
      const response = await $fetch('/api/auth/login', {
        method: 'POST',
        body: {
          username: loginUsername.value,
          password: loginPassword.value,
          turnstileToken: turnstileToken.value
        }
      });

      if (response.success) {
        // Session cookie 已自动设置，无需手动存储
        isAuthenticated.value = true;
        loginUsername.value = '';
        loginPassword.value = '';
        resetTurnstile();
        loadPosts();
        loadMessages();
        loadFriendsRequests();
        loadApprovedFriends();
        loadMoments();
        loadBookmarks();
      }
    } catch (error) {
      loginError.value = error?.data?.message || '登录失败';
      // 验证失败时重置 Turnstile
      if (error?.data?.message?.includes('验证')) {
        resetTurnstile();
      }
    } finally {
      loggingIn.value = false;
    }
  };

  // 退出登录
  const handleLogout = async () => {
    try {
      await $fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('登出失败:', error);
    }
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

    // 使用 session cookie，无需手动设置 token
    try {
      const response = await $fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        // Cookie 会自动发送，无需手动设置 headers
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
    // 使用 session cookie，无需手动设置 token

    try {
      if (editingPost.value) {
        // 更新文章
        const response = await $fetch(`/api/posts/${editingPost.value.id}`, {
          method: 'PUT',
          headers: {
            // Cookie 会自动发送，无需手动设置 Authorization header
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
            // Cookie 会自动发送，无需手动设置 Authorization header
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
    // 使用 session cookie，无需手动设置 token

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
        // Cookie 会自动发送，无需手动设置 headers,
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
    // 使用 session cookie，无需手动设置 token

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
        // Cookie 会自动发送，无需手动设置 headers,
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

    // 使用 session cookie，无需手动设置 token
    try {
      const response = await $fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        // Cookie 会自动发送，无需手动设置 headers
      });

      if (response.success) {
        showSuccess('删除成功');
        loadMessages();
      }
    } catch (error) {
      alert(error?.data?.message || '删除失败');
    }
  };

  // 格式化日期（统一使用，支持空值返回 '未知'）
  const formatDate = (dateString) => {
    if (!dateString) return '未知';
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
    // 使用 session cookie，无需手动设置 token

    try {
      const response = await $fetch('/api/messages', {
        method: 'POST',
        // Cookie 会自动发送，无需手动设置 headers,
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
    // 使用 session cookie，无需手动设置 token
    try {
      const response = await $fetch('/api/friends/requests', {
        // Cookie 会自动发送，无需手动设置 headers
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

    // 使用 session cookie，无需手动设置 token
    try {
      const response = await $fetch(`/api/friends/requests/${id}`, {
        method: 'PUT',
        // Cookie 会自动发送，无需手动设置 headers,
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

    // 使用 session cookie，无需手动设置 token
    try {
      const response = await $fetch(`/api/friends/requests/${id}`, {
        method: 'PUT',
        // Cookie 会自动发送，无需手动设置 headers,
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

    // 使用 session cookie，无需手动设置 token
    try {
      const response = await $fetch(`/api/friends/requests/${id}`, {
        method: 'DELETE',
        // Cookie 会自动发送，无需手动设置 headers
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

    // 使用 session cookie，无需手动设置 token
    try {
      const response = await $fetch(`/api/friends/${id}`, {
        method: 'DELETE',
        // Cookie 会自动发送，无需手动设置 headers
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
    // 使用 session cookie，无需手动设置 token

    try {
      const response = await $fetch('/api/friends', {
        method: 'POST',
        // Cookie 会自动发送，无需手动设置 headers,
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

    // 使用 session cookie，无需手动设置 token
    try {
      const response = await $fetch(`/api/moments/${id}`, {
        method: 'DELETE',
        // Cookie 会自动发送，无需手动设置 headers
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
    // 使用 session cookie，无需手动设置 token

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
            // Cookie 会自动发送，无需手动设置 Authorization header
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
            // Cookie 会自动发送，无需手动设置 Authorization header
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

  // 加载书签列表
  const loadBookmarks = async () => {
    bookmarksLoading.value = true;
    try {
      const response = await $fetch('/api/bookmarks');
      if (response.success) {
        bookmarks.value = response.data || [];
      }
    } catch (error) {
      console.error('加载书签失败:', error);
    } finally {
      bookmarksLoading.value = false;
    }
  };

  // 编辑书签
  const editBookmark = (bookmark) => {
    editingBookmark.value = bookmark;
    bookmarkFormData.value = {
      name: bookmark.name || '',
      url: bookmark.url || '',
      description: bookmark.description || ''
    };
    showBookmarkForm.value = true;
  };

  // 删除书签
  const deleteBookmark = async (id) => {
    if (!confirm('确定要删除这个书签吗？')) return;

    // 使用 session cookie，无需手动设置 token
    try {
      const response = await $fetch(`/api/bookmarks/${id}`, {
        method: 'DELETE',
        // Cookie 会自动发送，无需手动设置 headers
      });

      if (response.success) {
        showSuccess('删除成功');
        loadBookmarks();
      } else {
        alert(response.message || '删除失败');
      }
    } catch (error) {
      alert(error?.data?.message || '删除失败');
    }
  };

  // 提交书签表单
  const handleBookmarkSubmit = async () => {
    if (!bookmarkFormData.value.name.trim() || !bookmarkFormData.value.url.trim()) {
      alert('请填写网站名称和链接');
      return;
    }

    submittingBookmark.value = true;
    // 使用 session cookie，无需手动设置 token

    try {
      if (editingBookmark.value) {
        // 更新书签
        const response = await $fetch(`/api/bookmarks/${editingBookmark.value.id}`, {
          method: 'PUT',
          headers: {
            // Cookie 会自动发送，无需手动设置 Authorization header
          },
          body: bookmarkFormData.value
        });

        if (response.success) {
          showSuccess('更新成功');
          closeBookmarkForm();
          loadBookmarks();
        } else {
          alert(response.message || '更新失败');
        }
      } else {
        // 创建书签
        const response = await $fetch('/api/bookmarks', {
          method: 'POST',
          headers: {
            // Cookie 会自动发送，无需手动设置 Authorization header
          },
          body: bookmarkFormData.value
        });

        if (response.success) {
          showSuccess('创建成功');
          closeBookmarkForm();
          loadBookmarks();
        } else {
          alert(response.message || '创建失败');
        }
      }
    } catch (error) {
      alert(error?.data?.message || '操作失败');
    } finally {
      submittingBookmark.value = false;
    }
  };

  // 关闭书签表单
  const closeBookmarkForm = () => {
    showBookmarkForm.value = false;
    editingBookmark.value = null;
    bookmarkFormData.value = {
      name: '',
      url: '',
      description: ''
    };
  };

  // ========== 图床管理相关方法 ==========

  // 触发文件选择
  const triggerAssetUpload = () => {
    assetFileInput.value?.click();
  };

  // 处理文件选择
  const handleAssetFileSelect = async (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // 验证文件
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 10 * 1024 * 1024; // 10MB

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} 不是支持的图片格式`);
        continue;
      }
      if (file.size > maxSize) {
        alert(`${file.name} 文件大小超过 10MB`);
        continue;
      }
      await uploadAsset(file);
    }

    // 清空文件输入
    if (assetFileInput.value) {
      assetFileInput.value.value = '';
    }
  };

  // 处理拖拽上传
  const handleDrop = async (event) => {
    isDragging.value = false;
    const files = Array.from(event.dataTransfer.files || []);
    if (files.length === 0) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    const maxSize = 10 * 1024 * 1024;

    for (const file of files) {
      if (!validTypes.includes(file.type)) {
        alert(`${file.name} 不是支持的图片格式`);
        continue;
      }
      if (file.size > maxSize) {
        alert(`${file.name} 文件大小超过 10MB`);
        continue;
      }
      await uploadAsset(file);
    }
  };

  // 上传图片
  const uploadAsset = async (file) => {
    uploadingAsset.value = true;
    assetUploadProgress.value = 0;

    try {
      const formData = new FormData();
      formData.append('file', file);

      // 模拟上传进度
      const progressInterval = setInterval(() => {
        if (assetUploadProgress.value < 90) {
          assetUploadProgress.value += 10;
        }
      }, 200);

      const response = await $fetch('/api/assets/upload', {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      assetUploadProgress.value = 100;

      if (response.success) {
        showSuccess('上传成功');
        // 添加到列表顶部
        assets.value.unshift(response.data);
        // 重置进度
        setTimeout(() => {
          assetUploadProgress.value = 0;
        }, 500);
      } else {
        throw new Error('上传失败');
      }
    } catch (error) {
      console.error('上传失败:', error);
      alert(error?.data?.message || '上传失败，请重试');
    } finally {
      uploadingAsset.value = false;
      assetUploadProgress.value = 0;
    }
  };

  // 加载图片列表
  const loadAssets = async (cursor = null) => {
    assetsLoading.value = true;
    try {
      const params = cursor ? { cursor } : {};
      const response = await $fetch('/api/assets/list', {
        query: params
      });

      if (response.success) {
        if (cursor) {
          // 追加数据
          assets.value.push(...response.data.assets);
        } else {
          // 替换数据
          assets.value = response.data.assets;
        }
        assetsCursor.value = response.data.cursor;
        hasMoreAssets.value = response.data.hasMore;
      }
    } catch (error) {
      console.error('加载图片列表失败:', error);
      alert(error?.data?.message || '加载失败');
    } finally {
      assetsLoading.value = false;
    }
  };

  // 加载更多
  const loadMoreAssets = () => {
    if (assetsCursor.value && hasMoreAssets.value) {
      loadAssets(assetsCursor.value);
    }
  };

  // 删除图片
  const deleteAsset = async (key) => {
    if (!confirm('确定要删除这张图片吗？')) return;

    deletingAssets.value.push(key);
    try {
      const response = await $fetch('/api/assets/delete', {
        method: 'DELETE',
        query: { key }
      });

      if (response.success) {
        showSuccess('删除成功');
        // 从列表中移除
        assets.value = assets.value.filter(asset => asset.key !== key);
      } else {
        alert(response.message || '删除失败');
      }
    } catch (error) {
      console.error('删除失败:', error);
      alert(error?.data?.message || '删除失败');
    } finally {
      deletingAssets.value = deletingAssets.value.filter(k => k !== key);
    }
  };

  // 复制图片链接
  const copyAssetUrl = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      showSuccess('链接已复制到剪贴板');
    } catch (error) {
      // 降级方案
      const textarea = document.createElement('textarea');
      textarea.value = url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      showSuccess('链接已复制到剪贴板');
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  // 处理图片加载错误
  const handleImageError = (event) => {
    event.target.src = '/images/placeholder.png'; // 可以设置一个占位图
  };

  // 监听标签页切换，加载图床数据
  watch(activeTab, (newTab) => {
    if (newTab === 'assets' && assets.value.length === 0) {
      loadAssets();
    }
  });
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
  }

  /* 主标题样式 - 手写风格 */
  .login-form .handwritten {
    font-family: 'Caveat', cursive;
    font-size: 2.2rem;
    color: #5d4037;
    margin: 0 0 10px 0;
  }

  /* 副标题样式 */
  .login-form .subtitle {
    font-size: 0.9rem;
    color: #888;
    text-align: center;
    margin-top: 5px;
    margin-bottom: 20px;
    letter-spacing: 1.5px;
  }

  .turnstile-container {
    display: flex;
    justify-content: center;
    margin: 20px 0;
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
    background: #68444d;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: background 0.3s;
  }

  .btn-primary:hover:not(:disabled) {
    background: #5a3a42;
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
    color: #68444d;
    background: rgba(104, 68, 77, 0.05);
  }

  .tab-btn.active {
    color: #68444d;
    border-bottom-color: #68444d;
    font-weight: 600;
    background: rgba(104, 68, 77, 0.05);
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

    .login-form .handwritten {
      font-size: 2rem;
    }

    .login-form .subtitle {
      font-size: 0.9rem;
      letter-spacing: 1px;
    }
  }

  @media (max-width: 480px) {
    .login-form .handwritten {
      font-size: 1.6rem;
    }

    .login-form .subtitle {
      font-size: 0.8rem;
      letter-spacing: 0.5px;
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

  /* 书签管理样式 */
  .bookmarks-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }

  .bookmark-card {
    padding: 20px;
  }

  .bookmark-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 15px;
  }

  .bookmark-info {
    flex: 1;
    min-width: 0;
  }

  .bookmark-info h4 {
    margin: 0 0 8px 0;
    color: #333;
    font-size: 16px;
    font-weight: 600;
    word-break: break-word;
  }

  .bookmark-url {
    margin: 8px 0 0 0;
    color: #999;
    font-size: 12px;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .bookmark-description {
    margin: 8px 0;
    color: #666;
    font-size: 14px;
    line-height: 1.5;
    word-break: break-word;
  }

  .bookmark-actions {
    display: flex;
    gap: 8px;
    flex-shrink: 0;
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
    color: #68444d;
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
    background: #68444d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
    transition: background 0.3s;
  }

  .btn-upload:hover:not(:disabled) {
    background: #5a3a42;
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
    background: #68444d;
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
    color: #68444d;
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

  /* 图床管理样式 */
  .asset-upload-zone {
    border: 2px dashed #ddd;
    border-radius: 8px;
    padding: 40px;
    text-align: center;
    margin: 20px 0;
    background: rgba(255, 255, 255, 0.05);
    cursor: pointer;
    transition: all 0.3s;
  }

  .asset-upload-zone:hover,
  .asset-upload-zone.dragover {
    border-color: #68444d;
    background: rgba(104, 68, 77, 0.1);
  }

  .asset-upload-zone.uploading {
    border-color: #68444d;
    background: rgba(104, 68, 77, 0.2);
    cursor: not-allowed;
  }

  .upload-zone-content {
    pointer-events: none;
  }

  .upload-zone-content p {
    margin: 8px 0;
    font-size: 1rem;
    color: #666;
  }

  .upload-hint {
    font-size: 0.85rem !important;
    color: #999 !important;
  }

  .assets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 20px;
    margin-top: 20px;
  }

  .asset-card {
    overflow: hidden;
    transition: transform 0.3s;
  }

  .asset-card:hover {
    transform: translateY(-4px);
  }

  .asset-image-wrapper {
    position: relative;
    width: 100%;
    padding-top: 100%;
    /* 1:1 比例 */
    background: #f5f5f5;
    overflow: hidden;
  }

  .asset-image-wrapper img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }

  .asset-card:hover .asset-image-wrapper img {
    transform: scale(1.05);
  }

  .asset-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .asset-card:hover .asset-overlay {
    opacity: 1;
  }

  .btn-copy {
    padding: 8px 16px;
    background: #68444d;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.85rem;
    transition: background 0.3s;
  }

  .btn-copy:hover {
    background: #5a3a42;
  }

  .asset-info {
    padding: 12px;
  }

  .asset-name {
    font-size: 0.9rem;
    font-weight: 500;
    margin: 0 0 4px 0;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .asset-meta {
    font-size: 0.75rem;
    color: #999;
    margin: 0;
  }

  .load-more {
    text-align: center;
    margin: 30px 0;
  }

  @media (max-width: 768px) {
    .assets-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 15px;
    }

    .asset-upload-zone {
      padding: 30px 20px;
    }
  }
</style>
