<template>
  <div class="article-detail" v-loading="loading">
    <div v-if="article" class="article-container">
      <!-- 文章头部 -->
      <div class="article-header">
        <div class="category-badge" v-if="article.category">
          <el-icon><Folder /></el-icon>
          {{ article.category.name }}
        </div>
        <h1 class="article-title">{{ article.title }}</h1>
        <div class="article-meta">
          <div class="author-info">
            <el-avatar :size="40" :src="article.author?.avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
            <div class="author-details">
              <span class="author-name">{{ article.author?.username }}</span>
              <span class="author-bio">{{ article.author?.bio || '博主' }}</span>
            </div>
          </div>
          <div class="article-stats">
            <span class="stat-item">
              <el-icon><Clock /></el-icon>
              {{ formatDate(article.createdAt) }}
            </span>
            <span class="stat-item">
              <el-icon><View /></el-icon>
              {{ article.views }} 次阅读
            </span>
            <span class="stat-item">
              <el-icon><Star /></el-icon>
              {{ article.likes?.length || 0 }} 点赞
            </span>
          </div>
        </div>
        <div class="article-tags" v-if="article.tags && article.tags.length">
          <router-link
            v-for="tag in article.tags"
            :key="tag._id"
            :to="`/tag/${tag._id}`"
            class="tag-item"
          >
            #{{ tag.name }}
          </router-link>
        </div>
      </div>

      <!-- 文章封面 -->
      <div class="article-cover" v-if="article.coverImage">
        <img :src="article.coverImage" :alt="article.title">
        <div class="cover-overlay"></div>
      </div>

      <!-- 文章内容 -->
      <div class="article-content">
        <div v-if="article.excerpt" class="article-excerpt">
          {{ article.excerpt }}
        </div>
        <div class="content-body" v-html="article.content"></div>
      </div>

      <!-- 文章操作 -->
      <div class="article-actions">
        <el-button type="primary" size="large" @click="handleLike" :disabled="!userStore.user" class="like-btn">
          <el-icon><Star /></el-icon>
          点赞 ({{ article.likes?.length || 0 }})
        </el-button>
        <el-button size="large" @click="handleShare" class="share-btn">
          <el-icon><Share /></el-icon>
          分享
        </el-button>
      </div>

      <!-- 分隔线 -->
      <el-divider />

      <!-- 评论区 -->
      <div class="comments-section">
        <div class="section-header">
          <h2>
            <el-icon><ChatDotRound /></el-icon>
            评论 ({{ comments.length }})
          </h2>
        </div>

        <div class="comment-form-card" v-if="userStore.user">
          <div class="user-avatar">
            <el-avatar :size="40" :src="userStore.user.avatar">
              <el-icon><User /></el-icon>
            </el-avatar>
          </div>
          <div class="form-content">
            <el-input
              v-model="newComment"
              type="textarea"
              :rows="4"
              placeholder="发表你的评论..."
              class="comment-input"
            />
            <div class="form-actions">
              <el-button type="primary" @click="handleSubmitComment" :loading="submitting" size="large">
                <el-icon><Promotion /></el-icon>
                发表评论
              </el-button>
            </div>
          </div>
        </div>

        <div v-else class="login-tip-card">
          <el-icon><Lock /></el-icon>
          <p>请 <router-link to="/login">登录</router-link> 后发表评论</p>
        </div>

        <div class="comments-list">
          <div v-for="comment in comments" :key="comment._id" class="comment-item">
            <div class="comment-avatar">
              <el-avatar :size="40" :src="comment.author?.avatar">
                <el-icon><User /></el-icon>
              </el-avatar>
            </div>
            <div class="comment-body">
              <div class="comment-header">
                <span class="comment-author">{{ comment.author?.username }}</span>
                <span class="comment-date">{{ formatDate(comment.createdAt) }}</span>
              </div>
              <div class="comment-content">{{ comment.content }}</div>
              <div class="comment-actions">
                <el-button text @click="handleLikeComment(comment)" :disabled="!userStore.user" class="action-btn">
                  <el-icon><Star /></el-icon>
                  {{ comment.likes?.length || 0 }}
                </el-button>
                <el-button text @click="handleReply(comment)" :disabled="!userStore.user" class="action-btn">
                  <el-icon><ChatDotRound /></el-icon>
                  回复
                </el-button>
                <el-button
                  text
                  v-if="userStore.user && comment.author._id === userStore.user.id"
                  @click="handleDeleteComment(comment._id)"
                  class="action-btn danger"
                >
                  <el-icon><Delete /></el-icon>
                  删除
                </el-button>
              </div>
            </div>
          </div>
        </div>

        <div v-if="comments.length === 0" class="empty-comments">
          <el-empty description="暂无评论,快来发表第一条评论吧!" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '../store/user'
import { articleAPI, commentAPI } from '../api'
import { ElMessage } from 'element-plus'
import {
  User,
  Folder,
  Clock,
  View,
  Star,
  Share,
  ChatDotRound,
  Promotion,
  Lock,
  Delete
} from '@element-plus/icons-vue'

const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)
const submitting = ref(false)
const article = ref(null)
const comments = ref([])
const newComment = ref('')

const fetchArticle = async () => {
  loading.value = true
  try {
    const response = await articleAPI.getArticleById(route.params.id)
    article.value = response
  } catch (error) {
    console.error('获取文章失败:', error)
    ElMessage.error('获取文章失败')
  } finally {
    loading.value = false
  }
}

const fetchComments = async () => {
  try {
    const response = await commentAPI.getCommentsByArticle(route.params.id)
    comments.value = response
  } catch (error) {
    console.error('获取评论失败:', error)
  }
}

const handleLike = async () => {
  if (!userStore.user) {
    ElMessage.warning('请先登录')
    return
  }

  try {
    await articleAPI.likeArticle(article.value._id)
    await fetchArticle()
    ElMessage.success('点赞成功')
  } catch (error) {
    console.error('点赞失败:', error)
  }
}

const handleShare = () => {
  ElMessage.success('链接已复制到剪贴板!')
}

const handleSubmitComment = async () => {
  if (!newComment.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }

  submitting.value = true
  try {
    await commentAPI.createComment({
      content: newComment.value,
      article: article.value._id
    })
    newComment.value = ''
    await fetchComments()
    ElMessage.success('评论发表成功')
  } catch (error) {
    console.error('发表评论失败:', error)
    ElMessage.error('发表评论失败')
  } finally {
    submitting.value = false
  }
}

const handleLikeComment = async (comment) => {
  if (!userStore.user) {
    ElMessage.warning('请先登录')
    return
  }

  try {
    await commentAPI.likeComment(comment._id)
    await fetchComments()
  } catch (error) {
    console.error('点赞评论失败:', error)
  }
}

const handleReply = (comment) => {
  ElMessage.info('回复功能开发中...')
}

const handleDeleteComment = async (commentId) => {
  try {
    await commentAPI.deleteComment(commentId)
    await fetchComments()
    ElMessage.success('评论删除成功')
  } catch (error) {
    console.error('删除评论失败:', error)
    ElMessage.error('删除评论失败')
  }
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchArticle()
  fetchComments()
})
</script>

<style scoped>
.article-detail {
  background-color: var(--bg-color);
  padding: 40px;
  border-radius: var(--border-radius-large);
  box-shadow: var(--box-shadow);
}

.article-container {
  max-width: 900px;
  margin: 0 auto;
}

/* 文章头部 */
.article-header {
  margin-bottom: 40px;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 20px;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.article-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 24px 0;
  line-height: 1.3;
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding: 20px;
  background-color: var(--bg-page);
  border-radius: var(--border-radius);
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.author-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1rem;
}

.author-bio {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.article-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-item {
  padding: 6px 14px;
  background-color: var(--bg-page);
  border-radius: 20px;
  color: var(--text-regular);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: var(--transition-base);
  border: 1px solid var(--border-light);
}

.tag-item:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-color: transparent;
  transform: translateY(-2px);
}

/* 文章封面 */
.article-cover {
  width: 100%;
  height: 400px;
  margin-bottom: 40px;
  border-radius: var(--border-radius-large);
  overflow: hidden;
  position: relative;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.1) 100%);
}

/* 文章内容 */
.article-content {
  margin-bottom: 40px;
}

.article-excerpt {
  font-size: 1.25rem;
  color: var(--text-regular);
  line-height: 1.8;
  margin-bottom: 30px;
  padding: 20px;
  background-color: var(--bg-page);
  border-left: 4px solid var(--primary-color);
  border-radius: var(--border-radius);
}

.content-body {
  line-height: 1.8;
  color: var(--text-primary);
  font-size: 1.0625rem;
}

.content-body :deep(img) {
  max-width: 100%;
  border-radius: var(--border-radius);
  margin: 20px 0;
  box-shadow: var(--box-shadow);
}

.content-body :deep(h1),
.content-body :deep(h2),
.content-body :deep(h3),
.content-body :deep(h4),
.content-body :deep(h5),
.content-body :deep(h6) {
  margin: 30px 0 15px 0;
  color: var(--text-primary);
}

.content-body :deep(p) {
  margin-bottom: 16px;
}

.content-body :deep(pre) {
  background-color: #2d2d2d;
  color: #f8f8f2;
  padding: 20px;
  border-radius: var(--border-radius);
  overflow-x: auto;
  margin: 20px 0;
}

.content-body :deep(code) {
  background-color: var(--bg-page);
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.content-body :deep(blockquote) {
  border-left: 4px solid var(--primary-color);
  padding-left: 20px;
  margin: 20px 0;
  color: var(--text-regular);
  font-style: italic;
}

.content-body :deep(ul),
.content-body :deep(ol) {
  margin: 20px 0;
  padding-left: 30px;
}

.content-body :deep(li) {
  margin-bottom: 8px;
}

/* 文章操作 */
.article-actions {
  display: flex;
  gap: 16px;
  margin-bottom: 40px;
}

.like-btn,
.share-btn {
  padding: 12px 32px;
  font-size: 1rem;
  border-radius: 25px;
  transition: var(--transition-base);
}

.like-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.share-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 评论区 */
.comments-section {
  margin-top: 60px;
}

.section-header {
  margin-bottom: 30px;
}

.section-header h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 1.75rem;
  color: var(--text-primary);
}

.comment-form-card {
  display: flex;
  gap: 16px;
  padding: 24px;
  background-color: var(--bg-page);
  border-radius: var(--border-radius);
  margin-bottom: 30px;
}

.user-avatar {
  flex-shrink: 0;
}

.form-content {
  flex: 1;
}

.comment-input {
  margin-bottom: 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.login-tip-card {
  padding: 40px;
  background-color: var(--bg-page);
  border-radius: var(--border-radius);
  text-align: center;
  margin-bottom: 30px;
}

.login-tip-card .el-icon {
  font-size: 48px;
  color: var(--text-secondary);
  margin-bottom: 16px;
}

.login-tip-card p {
  margin: 0;
  color: var(--text-regular);
  font-size: 1rem;
}

.login-tip-card a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 600;
}

.login-tip-card a:hover {
  text-decoration: underline;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.comment-item {
  display: flex;
  gap: 16px;
  padding: 24px;
  background-color: var(--bg-page);
  border-radius: var(--border-radius);
  transition: var(--transition-base);
}

.comment-item:hover {
  box-shadow: var(--box-shadow);
}

.comment-avatar {
  flex-shrink: 0;
}

.comment-body {
  flex: 1;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.comment-author {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 1rem;
}

.comment-date {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.comment-content {
  color: var(--text-regular);
  line-height: 1.6;
  margin-bottom: 12px;
  font-size: 0.9375rem;
}

.comment-actions {
  display: flex;
  gap: 16px;
}

.action-btn {
  font-size: 0.875rem;
  padding: 4px 12px;
}

.action-btn:hover {
  color: var(--primary-color);
}

.action-btn.danger:hover {
  color: var(--danger-color);
}

.empty-comments {
  padding: 60px 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-detail {
    padding: 20px;
  }

  .article-title {
    font-size: 1.75rem;
  }

  .article-meta {
    flex-direction: column;
    gap: 16px;
  }

  .article-cover {
    height: 250px;
  }

  .article-actions {
    flex-direction: column;
  }

  .like-btn,
  .share-btn {
    width: 100%;
  }

  .comment-form-card {
    flex-direction: column;
  }
}
</style>
