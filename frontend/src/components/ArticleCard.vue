<template>
  <div class="article-card">
    <div class="article-cover" v-if="article.coverImage">
      <img :src="article.coverImage" :alt="article.title">
      <div class="cover-overlay"></div>
    </div>
    <div class="article-content">
      <div class="article-header">
        <div class="category-badge" v-if="article.category">
          <el-icon><Folder /></el-icon>
          {{ article.category.name }}
        </div>
        <span class="article-date">{{ formatDate(article.createdAt) }}</span>
      </div>

      <h3 class="article-title">
        <router-link :to="`/article/${article._id}`">{{ article.title }}</router-link>
      </h3>

      <p class="article-excerpt">{{ article.excerpt || article.content.substring(0, 150) + '...' }}</p>

      <div class="article-footer">
        <div class="author-info">
          <el-avatar :size="32" :src="article.author?.avatar">
            <el-icon><User /></el-icon>
          </el-avatar>
          <span class="author-name">{{ article.author?.username }}</span>
        </div>

        <div class="article-stats">
          <span class="stat-item" title="浏览量">
            <el-icon><View /></el-icon>
            {{ article.views }}
          </span>
          <span class="stat-item" title="点赞数">
            <el-icon><Star /></el-icon>
            {{ article.likes?.length || 0 }}
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
  </div>
</template>

<script setup>
import { User, Folder, View, Star } from '@element-plus/icons-vue'

const props = defineProps({
  article: {
    type: Object,
    required: true
  }
})

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

<style scoped>
.article-card {
  background-color: var(--bg-color);
  border-radius: var(--border-radius-large);
  overflow: hidden;
  box-shadow: var(--box-shadow);
  transition: var(--transition-base);
  margin-bottom: 24px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.article-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.15);
}

.article-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: var(--transition-base);
}

.article-card:hover::before {
  opacity: 1;
}

.article-cover {
  width: 100%;
  height: 240px;
  overflow: hidden;
  position: relative;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.article-card:hover .article-cover img {
  transform: scale(1.1);
}

.cover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
}

.article-content {
  padding: 24px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.category-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.article-date {
  color: var(--text-secondary);
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 4px;
}

.article-title {
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.article-title a {
  color: var(--text-primary);
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: 700;
  display: block;
  transition: var(--transition-base);
  position: relative;
}

.article-title a::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.article-card:hover .article-title a::after {
  width: 100%;
}

.article-title a:hover {
  color: var(--primary-color);
}

.article-excerpt {
  color: var(--text-regular);
  margin: 0 0 20px 0;
  line-height: 1.8;
  font-size: 1rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid var(--border-lighter);
  margin-bottom: 16px;
}

.author-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.author-name {
  color: var(--text-regular);
  font-size: 0.875rem;
  font-weight: 500;
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
  transition: var(--transition-base);
}

.stat-item:hover {
  color: var(--primary-color);
}

.stat-item .el-icon {
  font-size: 18px;
}

.article-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag-item {
  padding: 4px 12px;
  background-color: var(--bg-page);
  border-radius: 12px;
  color: var(--text-regular);
  text-decoration: none;
  font-size: 0.8125rem;
  font-weight: 500;
  transition: var(--transition-base);
  border: 1px solid var(--border-light);
}

.tag-item:hover {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border-color: transparent;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .article-card {
    margin-bottom: 20px;
  }

  .article-cover {
    height: 200px;
  }

  .article-content {
    padding: 20px;
  }

  .article-title a {
    font-size: 1.25rem;
  }

  .article-footer {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .article-stats {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
